import crypto from "node:crypto";
import fs, { realpathSync } from "node:fs";
import fs$1 from "node:fs/promises";
import path, { isAbsolute, relative, resolve, sep } from "node:path";
import { a as sha256Hex } from "./crypto-digest-CNeb2i19.js";
import { g as onTrustedInternalDiagnosticEvent } from "./diagnostic-events-5-gsFhkM.js";
import { o as withFileLock } from "./file-lock-C2Kr7iLJ.js";
import { i as resolveSkillKey } from "./frontmatter-DXeaZ3EN.js";
import { v as pathExists } from "./fs-safe-RNq3oO57.js";
import "./path-safety-CBe_wA_B.js";
import { o as tryReadJson } from "./json-files-CTWRDHag.js";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.js";
import {
  L as executeSqliteQuerySync,
  R as executeSqliteQueryTakeFirstSync,
  l as runOpenClawStateWriteTransaction,
  s as openOpenClawStateDatabase,
  z as getNodeSqliteKysely,
} from "./openclaw-state-db-Bsa8Tv1Z.js";
import "./file-lock-CsC2zkbH.js";
import { i as isPathInside } from "./path-DILYn_gk.js";
import { y as resolveStateDir } from "./paths-DEklnbzU.js";
import { a as root } from "./secure-temp-dir-DMUMnweR.js";
import { t as resolveSkillSource } from "./source-9Jdpd6BI.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
import { t as findContainingAllowedSkillSymlinkTarget } from "./symlink-targets-eds-KwyT.js";
//#region src/agents/utils/paths.ts
/**
 * Agent path formatting helpers.
 *
 * Canonicalizes local paths and formats paths relative to a workspace when possible.
 */
/**
 * Resolve a path to its canonical (real) form, following symlinks.
 * Falls back to the raw path if resolution fails (e.g. the target does
 * not exist yet), so that callers never crash on missing filesystem
 * entries.
 */
function canonicalizePath(path) {
  try {
    return realpathSync(path);
  } catch {
    return path;
  }
}
/**
 * Returns true if the value is NOT a package source (npm:, git:, etc.)
 * or a URL protocol. Bare names and relative paths without ./ prefix
 * are considered local.
 */
function isLocalPath(value) {
  const trimmed = value.trim();
  if (
    trimmed.startsWith("npm:") ||
    trimmed.startsWith("git:") ||
    trimmed.startsWith("github:") ||
    trimmed.startsWith("http:") ||
    trimmed.startsWith("https:") ||
    trimmed.startsWith("ssh:")
  )
    return false;
  return true;
}
function resolveAgainstCwd(filePath, cwd) {
  return isAbsolute(filePath) ? resolve(filePath) : resolve(cwd, filePath);
}
function getCwdRelativePath(filePath, cwd) {
  const resolvedCwd = resolve(cwd);
  const relativePath = relative(resolvedCwd, resolveAgainstCwd(filePath, resolvedCwd));
  return relativePath === "" ||
    (relativePath !== ".." && !relativePath.startsWith(`..${sep}`) && !isAbsolute(relativePath))
    ? relativePath || "."
    : void 0;
}
function formatPathRelativeToCwdOrAbsolute(filePath, cwd) {
  const absolutePath = resolveAgainstCwd(filePath, cwd);
  return (getCwdRelativePath(absolutePath, cwd) ?? absolutePath).split(sep).join("/");
}
//#endregion
//#region src/skills/discovery/skill-index.ts
/** Normalizes a skill name to the comparable key used by filters and commands. */
function normalizeSkillIndexName(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s_/]+/g, "-")
    .replace(/[^a-z0-9-]+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}
function isSkillRuntimeVisible(entry) {
  return entry.exposure?.includeInRuntimeRegistry ?? true;
}
function isSkillPromptVisible(entry) {
  if (entry.exposure) return entry.exposure.includeInAvailableSkillsPrompt ?? true;
  if (entry.invocation) return !entry.invocation.disableModelInvocation;
  return !entry.skill.disableModelInvocation;
}
function isSkillUserInvocable(entry) {
  if (entry.exposure) return entry.exposure.userInvocable ?? true;
  if (entry.invocation) return entry.invocation.userInvocable ?? true;
  return true;
}
function filterPromptVisibleSkillEntries(entries) {
  return entries.filter(isSkillPromptVisible);
}
function filterUserInvocableSkillEntries(entries) {
  return entries.filter(isSkillUserInvocable);
}
function buildSkillIndexEntries(entries, opts) {
  const agentSkillSet = opts?.agentSkillFilter === void 0 ? void 0 : new Set(opts.agentSkillFilter);
  return entries.map((entry) => createSkillIndexEntry(entry, opts, agentSkillSet));
}
function createSkillIndexEntry(entry, opts, agentSkillSet) {
  const name = entry.skill.name;
  const skillKey = resolveSkillKey(entry.skill, entry);
  const source = resolveSkillSource(entry.skill);
  return {
    entry,
    name,
    normalizedName: normalizeSkillIndexName(name),
    skillKey,
    normalizedSkillKey: normalizeSkillIndexName(skillKey),
    source,
    bundled:
      source === "openclaw-bundled" ||
      (source === "unknown" && opts?.bundledNames?.has(name) === true),
    agentAllowed: agentSkillSet === void 0 || agentSkillSet.has(name),
    runtimeVisible: isSkillRuntimeVisible(entry),
    promptVisible: isSkillPromptVisible(entry),
    userInvocable: isSkillUserInvocable(entry),
  };
}
//#endregion
//#region src/skills/lifecycle/workspace-skill-write.ts
const ALLOWED_SUPPORT_FILE_ROOTS = new Set(
  "assets examples references scripts templates".split(" "),
);
const MAX_WORKSPACE_SKILL_SUPPORT_FILE_BYTES = 256 * 1024;
function normalizeWorkspaceSkillSupportPath(input) {
  const trimmed = input.trim();
  if (!trimmed) throw new Error("Support file path is required.");
  if (trimmed.includes("\\")) throw new Error("Support file paths must use forward slashes.");
  if (path.posix.isAbsolute(trimmed)) throw new Error("Support file paths must be relative.");
  if (
    trimmed
      .split("/")
      .some((part) => !part || part === "." || part === ".." || part.startsWith("."))
  )
    throw new Error("Support file paths must use plain relative path segments.");
  if (!ALLOWED_SUPPORT_FILE_ROOTS.has(trimmed.split("/")[0] ?? ""))
    throw new Error(
      `Support file paths must be under one of: ${[...ALLOWED_SUPPORT_FILE_ROOTS].join(", ")}.`,
    );
  if (trimmed === "PROPOSAL.md" || trimmed === "SKILL.md")
    throw new Error("Support files cannot replace the proposal or skill markdown file.");
  return trimmed;
}
function assertWorkspaceSkillSupportPathSetIsFileOnly(paths) {
  const sorted = paths.toSorted((a, b) => a.localeCompare(b));
  for (const filePath of sorted)
    if (!filePath.includes("/"))
      throw new Error("Support file paths must include a file below an allowed support directory.");
  for (let index = 1; index < sorted.length; index += 1) {
    const previous = sorted[index - 1];
    const current = sorted[index];
    if (previous && current?.startsWith(`${previous}/`))
      throw new Error(`Support file paths cannot overlap: ${previous} and ${current}`);
  }
}
async function readWorkspaceSkillFile(filePath) {
  if (!(await pathExists(filePath))) return null;
  return (
    await (
      await root(path.dirname(filePath))
    ).read(path.basename(filePath), {
      hardlinks: "reject",
      maxBytes: 1024 * 1024,
      symlinks: "reject",
    })
  ).buffer.toString("utf8");
}
async function readWorkspaceSupportFile(params) {
  const relativePath = normalizeWorkspaceSkillSupportPath(params.relativePath);
  if (!(await pathExists(path.join(params.skillDir, ...relativePath.split("/"))))) return null;
  return (
    await (
      await root(params.skillDir)
    ).read(relativePath, {
      hardlinks: "reject",
      maxBytes: MAX_WORKSPACE_SKILL_SUPPORT_FILE_BYTES,
      symlinks: "reject",
    })
  ).buffer.toString("utf8");
}
async function assertWorkspaceSkillWriteTarget(params) {
  await resolveWorkspaceSkillWriteTarget(params);
}
async function writeWorkspaceSkill(params) {
  assertInsideWorkspace(params.workspaceDir, params.skillDir, "skill directory");
  const supportFiles = normalizeSupportFiles(params.supportFiles ?? []);
  const previousSupportFiles = await prepareWorkspaceSkillWrite({
    mode: params.mode,
    workspaceDir: params.workspaceDir,
    skillDir: params.skillDir,
    skillFile: params.skillFile,
    supportFiles,
    symlinkPolicy: params.symlinkPolicy,
  });
  const writtenSupportPaths = [];
  try {
    for (const file of supportFiles) {
      await writeWorkspaceFile({
        workspaceDir: params.workspaceDir,
        filePath: path.join(params.skillDir, ...file.path.split("/")),
        content: file.content,
        overwrite: params.mode === "update",
        symlinkPolicy: params.symlinkPolicy,
      });
      writtenSupportPaths.push(file.path);
    }
    await writeWorkspaceFile({
      workspaceDir: params.workspaceDir,
      filePath: params.skillFile,
      content: params.content,
      overwrite: params.mode === "update",
      symlinkPolicy: params.symlinkPolicy,
    });
  } catch (error) {
    await restoreSupportFilesAfterFailedWrite({
      mode: params.mode,
      workspaceDir: params.workspaceDir,
      skillDir: params.skillDir,
      writtenSupportPaths,
      previousSupportFiles,
      symlinkPolicy: params.symlinkPolicy,
    });
    throw error;
  }
}
function normalizeSupportFiles(supportFiles) {
  const normalized = supportFiles.map((file) => ({
    ...file,
    path: normalizeWorkspaceSkillSupportPath(file.path),
  }));
  assertWorkspaceSkillSupportPathSetIsFileOnly(normalized.map((file) => file.path));
  return normalized;
}
async function prepareWorkspaceSkillWrite(params) {
  await resolveWorkspaceSkillWriteTarget({
    workspaceDir: params.workspaceDir,
    filePath: params.skillFile,
    symlinkPolicy: params.symlinkPolicy,
  });
  const previousContent = await readWorkspaceSkillFile(params.skillFile);
  if (params.mode === "create" && previousContent !== null)
    throw new Error(`Target skill already exists: ${params.skillFile}`);
  if (params.mode === "update" && previousContent === null)
    throw new Error(`Target skill is missing: ${params.skillFile}`);
  const previousSupportFiles = [];
  for (const file of params.supportFiles) {
    const filePath = path.join(params.skillDir, ...file.path.split("/"));
    await resolveWorkspaceSkillWriteTarget({
      workspaceDir: params.workspaceDir,
      filePath,
      symlinkPolicy: params.symlinkPolicy,
    });
    if (params.mode === "update") {
      const previousSupportContent = await readWorkspaceSupportFile({
        skillDir: params.skillDir,
        relativePath: file.path,
      });
      previousSupportFiles.push(
        previousSupportContent === null
          ? {
              path: file.path,
              existed: false,
            }
          : {
              path: file.path,
              existed: true,
              previousContent: previousSupportContent,
            },
      );
    }
  }
  return previousSupportFiles;
}
async function writeWorkspaceFile(params) {
  const target = await resolveWorkspaceSkillWriteTarget(params);
  await (
    await root(target.rootDir)
  ).write(target.relativePath, params.content, {
    encoding: "utf8",
    mkdir: true,
    overwrite: params.overwrite,
  });
}
async function removeWorkspaceFile(params) {
  const target = await resolveWorkspaceSkillWriteTarget(params);
  await (await root(target.rootDir)).remove(target.relativePath).catch((error) => {
    if (error?.code !== "ENOENT") throw error;
  });
}
async function restoreSupportFilesAfterFailedWrite(params) {
  const previousByPath = new Map(params.previousSupportFiles.map((file) => [file.path, file]));
  await Promise.allSettled(
    params.writtenSupportPaths.toReversed().map(async (relativePath) => {
      const filePath = path.join(params.skillDir, ...relativePath.split("/"));
      const previous = previousByPath.get(relativePath);
      if (params.mode === "update" && previous?.existed)
        await writeWorkspaceFile({
          workspaceDir: params.workspaceDir,
          filePath,
          content: previous.previousContent ?? "",
          overwrite: true,
          symlinkPolicy: params.symlinkPolicy,
        });
      else
        await removeWorkspaceFile({
          workspaceDir: params.workspaceDir,
          filePath,
          symlinkPolicy: params.symlinkPolicy,
        });
    }),
  );
}
async function resolveWorkspaceSkillWriteTarget(params) {
  assertInsideWorkspace(params.workspaceDir, params.filePath, "skill file");
  const workspaceDir = path.resolve(params.workspaceDir);
  const filePath = path.resolve(params.filePath);
  const aliasTarget = await resolveWorkspaceAliasTarget({
    workspaceDir,
    filePath,
  });
  if (!aliasTarget)
    return {
      rootDir: workspaceDir,
      relativePath: path.relative(workspaceDir, filePath),
    };
  const allowedRoot = params.symlinkPolicy.allowWrites
    ? findContainingAllowedSkillSymlinkTarget(
        params.symlinkPolicy.allowedTargetRealPaths,
        aliasTarget.realTarget,
      )
    : null;
  if (!allowedRoot)
    throw new Error(
      `Skill file resolves through an untrusted symlink target: ${params.filePath}. Configure skills.load.allowSymlinkTargets and enable skills.workshop.allowSymlinkTargetWrites for intentional Skill Workshop symlink writes.`,
    );
  return {
    rootDir: allowedRoot,
    relativePath: path.relative(allowedRoot, aliasTarget.realTarget),
  };
}
async function resolveWorkspaceAliasTarget(params) {
  const workspaceRealPath = (await tryRealpath(params.workspaceDir)) ?? params.workspaceDir;
  const realTarget = await resolveRealPathThroughExistingAncestors(
    params.workspaceDir,
    params.filePath,
  );
  return isPathInside(workspaceRealPath, realTarget) ? null : { realTarget };
}
async function resolveRealPathThroughExistingAncestors(workspaceDir, filePath) {
  const segments = path.relative(workspaceDir, filePath).split(path.sep).filter(Boolean);
  let lexicalCursor = workspaceDir;
  let realCursor = (await tryRealpath(workspaceDir)) ?? workspaceDir;
  for (const segment of segments) {
    lexicalCursor = path.join(lexicalCursor, segment);
    realCursor = (await tryRealpath(lexicalCursor)) ?? path.join(realCursor, segment);
  }
  return path.resolve(realCursor);
}
async function tryRealpath(filePath) {
  try {
    return await fs$1.realpath(filePath);
  } catch {
    return null;
  }
}
function assertInsideWorkspace(workspaceDir, targetPath, label) {
  const resolvedWorkspaceDir = path.resolve(workspaceDir);
  const resolvedTarget = path.resolve(targetPath);
  if (
    resolvedTarget !== resolvedWorkspaceDir &&
    !isPathInside(resolvedWorkspaceDir, resolvedTarget)
  )
    throw new Error(`${label} must stay inside the workspace.`);
}
//#endregion
//#region src/skills/workshop/types.ts
/** Schema id for persisted skill workshop proposal records. */
const SKILL_WORKSHOP_SCHEMA = "openclaw.skill-workshop.proposal.v1";
const SKILL_WORKSHOP_MANIFEST_SCHEMA = "openclaw.skill-workshop.proposals-manifest.v1";
const SKILL_WORKSHOP_ROLLBACK_SCHEMA = "openclaw.skill-workshop.rollback.v1";
const MAX_SKILL_PROPOSAL_ORIGIN_RUN_IDS = 4096;
//#endregion
//#region src/skills/workshop/proposal-origin-validation.ts
function isValidOrigin(value) {
  if (value === void 0) return true;
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const origin = value;
  return ["agentId", "sessionKey", "runId", "messageId"].every((key) => {
    const item = origin[key];
    return item === void 0 || typeof item === "string";
  });
}
function isValidRunIds(value) {
  if (value === void 0) return true;
  if (!Array.isArray(value) || value.length > 4096) return false;
  const ids = /* @__PURE__ */ new Set();
  for (const item of value) {
    if (typeof item !== "string" || !item.trim() || ids.has(item)) return false;
    ids.add(item);
  }
  return true;
}
function isValidMutationCounts(value, originRunIds) {
  if (value === void 0) return true;
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const allowedIds = new Set(originRunIds);
  const entries = Object.entries(value);
  return (
    entries.length <= 4096 &&
    entries.every(
      ([runId, count]) =>
        Boolean(runId.trim()) &&
        allowedIds.has(runId) &&
        typeof count === "number" &&
        Number.isSafeInteger(count) &&
        count > 0,
    )
  );
}
function hasValidProposalOriginProvenance(value) {
  return (
    isValidOrigin(value.origin) &&
    isValidRunIds(value.originRunIds) &&
    isValidMutationCounts(value.originRunMutationCounts, value.originRunIds)
  );
}
//#endregion
//#region src/skills/workshop/store.ts
const WORKSHOP_REL_DIR = "skill-workshop";
const PROPOSALS_REL_DIR = path.join(WORKSHOP_REL_DIR, "proposals");
const TARGET_LOCKS_REL_DIR = path.join(WORKSHOP_REL_DIR, "locks");
const MANIFEST_REL_PATH = path.join(WORKSHOP_REL_DIR, "proposals.json");
const MANIFEST_LOCK_REL_PATH = path.join(TARGET_LOCKS_REL_DIR, "proposals-manifest");
const PROPOSAL_RECORD_FILE = "proposal.json";
const PROPOSAL_DRAFT_FILE = "PROPOSAL.md";
const PROPOSAL_ROLLBACK_FILE = "rollback.json";
const MAX_PROPOSAL_BYTES = 1024 * 1024;
const MAX_PROPOSAL_SUPPORT_FILES_TOTAL_BYTES = 2 * 1024 * 1024;
const PROPOSAL_ID_PATTERN = /^[a-z0-9][a-z0-9-]{5,120}$/;
const SKILL_WORKSHOP_LOCK_OPTIONS = {
  retries: {
    retries: 8,
    factor: 1.35,
    minTimeout: 10,
    maxTimeout: 250,
    randomize: true,
  },
  stale: 6e4,
};
const skillWorkshopProcessLocks = new KeyedAsyncQueue();
/** Creates a stable proposal id from skill name, date, and random suffix. */
function createSkillProposalId(name, now = /* @__PURE__ */ new Date()) {
  const normalized = normalizeSkillIndexName(name) || "skill";
  const date = now.toISOString().slice(0, 10).replaceAll("-", "");
  const suffix = crypto.randomUUID().replaceAll("-", "").slice(0, 10);
  return `${normalized.slice(0, 60)}-${date}-${suffix}`;
}
function hashSkillProposalContent(content) {
  return sha256Hex(content);
}
function contentSizeBytes(content) {
  return Buffer.byteLength(content, "utf8");
}
function assertSkillProposalContentSize(content) {
  if (contentSizeBytes(content) > MAX_PROPOSAL_BYTES)
    throw new Error("Skill proposal is too large.");
}
function resolveSkillWorkshopStateDir(options = {}) {
  return path.resolve(options.stateDir ?? resolveStateDir(options.env));
}
function resolveProposalDir(proposalId, options = {}) {
  assertProposalId(proposalId);
  return path.join(resolveSkillWorkshopStateDir(options), proposalRelativeDir(proposalId));
}
function resolveProposalRecordPath(proposalId, options = {}) {
  return path.join(resolveProposalDir(proposalId, options), PROPOSAL_RECORD_FILE);
}
function prepareSkillProposalSupportFiles(input) {
  if (!input || input.length === 0) return [];
  if (input.length > 64) throw new Error(`A skill proposal can include at most 64 files.`);
  const seen = /* @__PURE__ */ new Set();
  let totalBytes = 0;
  const files = [];
  for (const file of input) {
    const filePath = normalizeWorkspaceSkillSupportPath(file.path);
    if (seen.has(filePath)) throw new Error(`Duplicate support file path: ${filePath}`);
    seen.add(filePath);
    const sizeBytes = contentSizeBytes(file.content);
    if (sizeBytes > 262144) throw new Error(`Support file is too large: ${filePath}`);
    if (file.content.includes("\0"))
      throw new Error(`Support files must be UTF-8 text: ${filePath}`);
    totalBytes += sizeBytes;
    if (totalBytes > MAX_PROPOSAL_SUPPORT_FILES_TOTAL_BYTES)
      throw new Error("Skill proposal support files exceed the total size limit.");
    files.push({
      path: filePath,
      sizeBytes,
      hash: hashSkillProposalContent(file.content),
      content: file.content,
    });
  }
  assertWorkspaceSkillSupportPathSetIsFileOnly(files.map((file) => file.path));
  return files;
}
function resolveSkillProposalTarget(params) {
  const skillKey = normalizeSkillIndexName(params.skillName);
  if (!skillKey) throw new Error("Skill name must contain at least one letter or number.");
  const skillDir = path.resolve(params.workspaceDir, "skills", skillKey);
  const skillFile = path.join(skillDir, "SKILL.md");
  assertInsideWorkspace(params.workspaceDir, skillDir, "skill directory");
  assertInsideWorkspace(params.workspaceDir, skillFile, "skill file");
  return {
    skillKey,
    skillDir,
    skillFile,
  };
}
async function readSkillProposal(proposalId, options = {}) {
  const record = await readSkillProposalRecord(proposalId, options);
  if (!record) return null;
  return {
    record,
    content: (
      await (
        await root(resolveSkillWorkshopStateDir(options))
      ).read(path.join(proposalRelativeDir(proposalId), PROPOSAL_DRAFT_FILE), {
        hardlinks: "reject",
        maxBytes: MAX_PROPOSAL_BYTES,
        symlinks: "reject",
      })
    ).buffer.toString("utf8"),
  };
}
async function readSkillProposalRecord(proposalId, options = {}) {
  return parseSkillProposalRecord(
    await tryReadJson(resolveProposalRecordPath(proposalId, options)),
  );
}
async function writeSkillProposal(params) {
  assertProposalId(params.record.id);
  assertSkillProposalContentSize(params.content);
  await withSkillProposalManifestLock(params.store ?? {}, async () => {
    const manifest = await readSkillProposalManifestUnlocked(params.store);
    await params.beforeWrite?.(manifest);
    await writeSkillProposalFiles(params);
    await refreshSkillProposalManifestUnlocked(params.store);
  });
}
async function writeSkillProposalFiles(params) {
  const stateRoot = await root(resolveSkillWorkshopStateDir(params.store));
  const relativeDir = proposalRelativeDir(params.record.id);
  await stateRoot.mkdir(relativeDir);
  await stateRoot.write(path.join(relativeDir, PROPOSAL_DRAFT_FILE), params.content, {
    encoding: "utf8",
  });
  for (const file of params.supportFiles ?? [])
    await stateRoot.write(path.join(relativeDir, file.path), file.content, {
      encoding: "utf8",
      mkdir: true,
    });
  await stateRoot.writeJson(path.join(relativeDir, PROPOSAL_RECORD_FILE), params.record, {
    trailingNewline: true,
  });
}
async function replaceSkillProposalDraft(params) {
  assertProposalId(params.record.id);
  assertSkillProposalContentSize(params.content);
  const stateRoot = await root(resolveSkillWorkshopStateDir(params.store));
  const relativeDir = proposalRelativeDir(params.record.id);
  await stateRoot.write(path.join(relativeDir, PROPOSAL_DRAFT_FILE), params.content, {
    encoding: "utf8",
  });
  const nextSupportPaths = /* @__PURE__ */ new Set();
  for (const file of params.supportFiles ?? []) {
    nextSupportPaths.add(file.path);
    await stateRoot.write(path.join(relativeDir, file.path), file.content, {
      encoding: "utf8",
      mkdir: true,
    });
  }
  await stateRoot.writeJson(path.join(relativeDir, PROPOSAL_RECORD_FILE), params.record, {
    trailingNewline: true,
  });
  for (const file of params.previousSupportFiles ?? []) {
    const filePath = normalizeWorkspaceSkillSupportPath(file.path);
    if (!nextSupportPaths.has(filePath))
      await stateRoot.remove(path.join(relativeDir, filePath)).catch(() => void 0);
  }
  await refreshSkillProposalManifest(params.store);
}
async function updateSkillProposalRecord(params) {
  assertProposalId(params.record.id);
  await (
    await root(resolveSkillWorkshopStateDir(params.store))
  ).writeJson(
    path.join(proposalRelativeDir(params.record.id), PROPOSAL_RECORD_FILE),
    params.record,
    { trailingNewline: true },
  );
  await refreshSkillProposalManifest(params.store);
}
async function withSkillProposalTargetLock(record, fn, options = {}) {
  return await withSkillWorkshopLock(
    path.join(
      resolveSkillWorkshopStateDir(options),
      TARGET_LOCKS_REL_DIR,
      `${hashSkillProposalContent(record.target.skillFile)}.target`,
    ),
    fn,
  );
}
async function writeSkillProposalRollback(params) {
  await (
    await root(resolveSkillWorkshopStateDir(params.store))
  ).writeJson(
    path.join(proposalRelativeDir(params.proposalId), PROPOSAL_ROLLBACK_FILE),
    params.rollback,
    { trailingNewline: true },
  );
}
async function readSkillProposalManifest(options = {}) {
  return await readSkillProposalManifestUnlocked(options);
}
async function readSkillProposalManifestUnlocked(options = {}) {
  const parsed = parseSkillProposalManifest(
    await tryReadJson(path.join(resolveSkillWorkshopStateDir(options), MANIFEST_REL_PATH)),
  );
  if (parsed) return parsed;
  return await refreshSkillProposalManifestUnlocked(options);
}
async function refreshSkillProposalManifest(options = {}) {
  return await withSkillProposalManifestLock(options, async () => {
    return await refreshSkillProposalManifestUnlocked(options);
  });
}
async function refreshSkillProposalManifestUnlocked(options = {}) {
  const stateRoot = await root(resolveSkillWorkshopStateDir(options));
  await stateRoot.mkdir(PROPOSALS_REL_DIR);
  const entries = await stateRoot.list(PROPOSALS_REL_DIR, { withFileTypes: true });
  const proposals = [];
  for (const entry of entries.toSorted((a, b) => a.name.localeCompare(b.name))) {
    if (!entry.isDirectory || !PROPOSAL_ID_PATTERN.test(entry.name)) continue;
    const record = await readSkillProposalRecord(entry.name, options);
    if (!record) continue;
    proposals.push(manifestEntryFromRecord(record));
  }
  const manifest = {
    schema: SKILL_WORKSHOP_MANIFEST_SCHEMA,
    updatedAt: /* @__PURE__ */ new Date().toISOString(),
    proposals: proposals.toSorted((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
  };
  await stateRoot.writeJson(MANIFEST_REL_PATH, manifest, {
    mkdir: true,
    trailingNewline: true,
  });
  return manifest;
}
async function withSkillProposalManifestLock(options, fn) {
  return await withSkillWorkshopLock(
    path.join(resolveSkillWorkshopStateDir(options), MANIFEST_LOCK_REL_PATH),
    fn,
  );
}
async function withSkillWorkshopLock(lockFile, fn) {
  const lockKey = path.resolve(lockFile);
  return await skillWorkshopProcessLocks.enqueue(lockKey, async () => {
    await fs$1.mkdir(path.dirname(lockFile), { recursive: true });
    return await withFileLock(lockFile, SKILL_WORKSHOP_LOCK_OPTIONS, fn);
  });
}
async function readProposalSupportFiles(record, options = {}) {
  const stateRoot = await root(resolveSkillWorkshopStateDir(options));
  const out = [];
  for (const file of record.supportFiles ?? []) {
    const filePath = normalizeWorkspaceSkillSupportPath(file.path);
    const content = (
      await stateRoot.read(path.join(proposalRelativeDir(record.id), filePath), {
        hardlinks: "reject",
        maxBytes: MAX_WORKSPACE_SKILL_SUPPORT_FILE_BYTES,
        symlinks: "reject",
      })
    ).buffer.toString("utf8");
    const sizeBytes = contentSizeBytes(content);
    const hash = hashSkillProposalContent(content);
    if (file.sizeBytes !== sizeBytes || file.hash !== hash)
      throw new Error(`Proposal support file changed without updating metadata: ${filePath}`);
    out.push({
      path: filePath,
      sizeBytes,
      hash,
      content,
    });
  }
  assertWorkspaceSkillSupportPathSetIsFileOnly(out.map((file) => file.path));
  return out;
}
function createSkillProposalRollback(params) {
  return {
    schema: SKILL_WORKSHOP_ROLLBACK_SCHEMA,
    proposalId: params.proposalId,
    writtenAt: /* @__PURE__ */ new Date().toISOString(),
    targetSkillFile: params.targetSkillFile,
    action: params.action,
    ...(params.previousContent !== void 0
      ? {
          previousContent: params.previousContent,
          previousContentHash: hashSkillProposalContent(params.previousContent),
        }
      : {}),
    ...(params.supportFiles && params.supportFiles.length > 0
      ? { supportFiles: params.supportFiles }
      : {}),
  };
}
function assertProposalId(proposalId) {
  if (!PROPOSAL_ID_PATTERN.test(proposalId)) throw new Error("Invalid skill proposal id.");
}
function manifestEntryFromRecord(record) {
  return {
    id: record.id,
    kind: record.kind,
    status: record.status,
    title: record.title,
    description: record.description,
    skillName: record.target.skillName,
    skillKey: record.target.skillKey,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    scanState: record.scan.state,
  };
}
function parseSkillProposalRecord(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const record = raw;
  if (
    record.schema !== "openclaw.skill-workshop.proposal.v1" ||
    !PROPOSAL_ID_PATTERN.test(record.id) ||
    (record.kind !== "create" && record.kind !== "update") ||
    !["pending", "applied", "rejected", "quarantined", "stale"].includes(record.status) ||
    typeof record.title !== "string" ||
    typeof record.description !== "string" ||
    typeof record.createdAt !== "string" ||
    typeof record.updatedAt !== "string" ||
    typeof record.draftHash !== "string" ||
    record.draftFile !== PROPOSAL_DRAFT_FILE ||
    !hasValidProposalOriginProvenance(record) ||
    !isValidSupportFileList(record.supportFiles) ||
    !record.target ||
    typeof record.target !== "object" ||
    typeof record.target.skillName !== "string" ||
    typeof record.target.skillKey !== "string" ||
    typeof record.target.skillDir !== "string" ||
    typeof record.target.skillFile !== "string" ||
    !record.scan ||
    typeof record.scan !== "object"
  )
    return null;
  return record;
}
function isValidSupportFileList(value) {
  if (value === void 0) return true;
  if (!Array.isArray(value) || value.length > 64) return false;
  const seen = /* @__PURE__ */ new Set();
  for (const item of value) {
    if (!item || typeof item !== "object" || Array.isArray(item)) return false;
    const file = item;
    if (
      typeof file.path !== "string" ||
      typeof file.hash !== "string" ||
      !/^[a-f0-9]{64}$/i.test(file.hash) ||
      typeof file.sizeBytes !== "number" ||
      !Number.isSafeInteger(file.sizeBytes) ||
      file.sizeBytes < 0 ||
      file.sizeBytes > 262144 ||
      (file.targetExisted !== void 0 && typeof file.targetExisted !== "boolean") ||
      (file.targetContentHash !== void 0 &&
        (typeof file.targetContentHash !== "string" ||
          !/^[a-f0-9]{64}$/i.test(file.targetContentHash)))
    )
      return false;
    let normalized;
    try {
      normalized = normalizeWorkspaceSkillSupportPath(file.path);
    } catch {
      return false;
    }
    if (seen.has(normalized)) return false;
    seen.add(normalized);
  }
  return true;
}
function parseSkillProposalManifest(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const manifest = raw;
  if (
    manifest.schema !== "openclaw.skill-workshop.proposals-manifest.v1" ||
    typeof manifest.updatedAt !== "string" ||
    !Array.isArray(manifest.proposals)
  )
    return null;
  const proposals = manifest.proposals.filter((entry) => {
    return (
      entry &&
      typeof entry === "object" &&
      PROPOSAL_ID_PATTERN.test(normalizeOptionalString(entry.id) ?? "") &&
      typeof entry.skillName === "string" &&
      typeof entry.skillKey === "string" &&
      typeof entry.updatedAt === "string"
    );
  });
  return {
    ...manifest,
    proposals,
  };
}
function proposalRelativeDir(proposalId) {
  assertProposalId(proposalId);
  return path.join(PROPOSALS_REL_DIR, proposalId);
}
//#endregion
//#region src/skills/workshop/curator.ts
const STALE_AFTER_MS = 720 * 60 * 6e4;
const ARCHIVE_AFTER_MS = 2160 * 60 * 6e4;
const CURATOR_SWEEP_INTERVAL_MS = 1440 * 6e4;
const CURATOR_INITIAL_DELAY_MS = 5 * 6e4;
const DOCTOR_WEDGED_AFTER_MS = 10080 * 6e4;
const log = createSubsystemLogger("skills/curator");
const CURATOR_STATE_ID = 1;
const EMPTY_RESULT_JSON = "{}";
let loggedArchivedSkillReadFailure = false;
function curatorDb(options = {}) {
  const database = openOpenClawStateDatabase(options);
  return {
    database,
    kysely: getNodeSqliteKysely(database.db),
  };
}
function canonicalSkillKey(name) {
  const key = normalizeSkillIndexName(name);
  if (!key) throw new Error(`Invalid skill name: ${name}`);
  return key;
}
function recordSkillUsage(event, options = {}) {
  const rawSkillFile = event.skillFile?.trim();
  if (!rawSkillFile || !path.isAbsolute(rawSkillFile)) {
    log.debug(`skipping skill usage without file identity: ${event.skillName}`);
    return;
  }
  const skillFile = canonicalizePath(path.resolve(rawSkillFile));
  const skillKey = canonicalSkillKey(event.skillName);
  runOpenClawStateWriteTransaction(({ db }) => {
    executeSqliteQuerySync(
      db,
      getNodeSqliteKysely(db)
        .insertInto("skill_usage")
        .values({
          skill_file: skillFile,
          skill_key: skillKey,
          skill_name: event.skillName,
          skill_source: event.skillSource,
          first_used_at_ms: event.ts,
          last_used_at_ms: event.ts,
          use_count: 1,
          last_agent_id: event.agentId ?? null,
        })
        .onConflict((conflict) =>
          conflict.column("skill_file").doUpdateSet((eb) => ({
            skill_key: skillKey,
            skill_name: event.skillName,
            skill_source: event.skillSource,
            first_used_at_ms: eb.fn("min", [eb.ref("first_used_at_ms"), eb.val(event.ts)]),
            last_used_at_ms: eb.fn("max", [eb.ref("last_used_at_ms"), eb.val(event.ts)]),
            use_count: eb("use_count", "+", 1),
            last_agent_id: eb
              .case()
              .when("last_used_at_ms", "<=", event.ts)
              .then(event.agentId ?? null)
              .else(eb.ref("last_agent_id"))
              .end(),
          })),
        ),
    );
  }, options);
}
/** Register once per Gateway lifetime; listener failures never reach tool execution. */
function registerSkillUsageTracking(options = {}) {
  return onTrustedInternalDiagnosticEvent((event, metadata, privateData) => {
    if (!metadata.trusted || event.type !== "skill.used") return;
    try {
      recordSkillUsage(
        {
          ...event,
          skillFile: privateData.skillUsage?.skillFile,
        },
        options,
      );
    } catch (error) {
      log.warn(`failed to record skill usage: ${String(error)}`);
    }
  });
}
function startSkillCuratorMaintenance(options) {
  const unregisterUsageTracking = (options.registerUsageTracking ?? registerSkillUsageTracking)();
  const sweep = options.runSweep ?? runSkillCuratorSweep;
  let sweepInFlight = null;
  const performSweep = () => {
    if (sweepInFlight) return sweepInFlight;
    sweepInFlight = sweep()
      .then(() => void 0)
      .catch(options.onError)
      .finally(() => {
        sweepInFlight = null;
      });
    return sweepInFlight;
  };
  const initialSweep = setTimeout(() => void performSweep(), CURATOR_INITIAL_DELAY_MS);
  const sweepInterval = setInterval(() => void performSweep(), CURATOR_SWEEP_INTERVAL_MS);
  return () => {
    clearTimeout(initialSweep);
    clearInterval(sweepInterval);
    unregisterUsageTracking();
  };
}
async function loadCuratedSkills(options = {}) {
  const manifest = await readSkillProposalManifest({ env: options.env });
  const byFile = /* @__PURE__ */ new Map();
  const appliedRecords = [];
  for (const entry of manifest.proposals.toSorted((a, b) => a.id.localeCompare(b.id))) {
    if (entry.status !== "applied") continue;
    const record = await readSkillProposalRecord(entry.id, { env: options.env });
    if (!record || record.status !== "applied" || !record.appliedAt) continue;
    const appliedAtMs = Date.parse(record.appliedAt);
    if (!Number.isFinite(appliedAtMs)) continue;
    appliedRecords.push({
      appliedAtMs,
      record,
    });
    if (record.kind !== "create" || record.createdBy !== "skill-workshop") continue;
    const skillKey = canonicalSkillKey(record.target.skillKey || record.target.skillName);
    const skillFile = canonicalizePath(record.target.skillFile);
    const existing = byFile.get(skillFile);
    if (existing && existing.lastAppliedAtMs > appliedAtMs) {
      existing.createdAtMs = Math.min(existing.createdAtMs, appliedAtMs);
      continue;
    }
    byFile.set(skillFile, {
      createdAtMs: Math.min(existing?.createdAtMs ?? appliedAtMs, appliedAtMs),
      description: record.description,
      lastAppliedAtMs: appliedAtMs,
      skillFile,
      skillKey,
      skillName: record.target.skillName,
    });
  }
  for (const { appliedAtMs, record } of appliedRecords) {
    if (record.kind !== "update") continue;
    const skillFile = canonicalizePath(record.target.skillFile);
    const curated = byFile.get(skillFile);
    if (!curated) continue;
    if (appliedAtMs >= curated.lastAppliedAtMs) {
      curated.lastAppliedAtMs = appliedAtMs;
      curated.description = record.description;
    }
  }
  return [...byFile.values()].toSorted((a, b) => a.skillFile.localeCompare(b.skillFile));
}
function overlapTokens(value) {
  return new Set(
    value
      .toLowerCase()
      .split(/[^a-z0-9]+/u)
      .filter((token) => token.length > 2),
  );
}
function tokenJaccard(left, right) {
  const intersection = [...left].filter((token) => right.has(token)).length;
  const union = /* @__PURE__ */ new Set([...left, ...right]).size;
  return union === 0 ? 0 : intersection / union;
}
function detectOverlapCandidates(skills) {
  const candidates = [];
  for (let leftIndex = 0; leftIndex < skills.length; leftIndex += 1)
    for (let rightIndex = leftIndex + 1; rightIndex < skills.length; rightIndex += 1) {
      const left = skills[leftIndex];
      const right = skills[rightIndex];
      if (!left || !right) continue;
      if (
        path.dirname(path.dirname(path.dirname(left.skillFile))) !==
        path.dirname(path.dirname(path.dirname(right.skillFile)))
      )
        continue;
      const nameScore = tokenJaccard(overlapTokens(left.skillName), overlapTokens(right.skillName));
      const descriptionScore = tokenJaccard(
        overlapTokens(left.description),
        overlapTokens(right.description),
      );
      const score = Math.max(nameScore, descriptionScore);
      if (score >= 0.5)
        candidates.push({
          left: left.skillKey,
          right: right.skillKey,
          score,
        });
    }
  return candidates;
}
function desiredLifecycleState(ageMs) {
  if (ageMs > ARCHIVE_AFTER_MS) return "archived";
  if (ageMs > STALE_AFTER_MS) return "stale";
  return "active";
}
function writeSweepAttempt(nowMs, options) {
  runOpenClawStateWriteTransaction(({ db }) => {
    executeSqliteQuerySync(
      db,
      getNodeSqliteKysely(db)
        .insertInto("skill_curator_state")
        .values({
          id: CURATOR_STATE_ID,
          last_attempt_at_ms: nowMs,
          last_success_at_ms: null,
          last_error: null,
          last_result_json: EMPTY_RESULT_JSON,
        })
        .onConflict((conflict) => conflict.column("id").doUpdateSet({ last_attempt_at_ms: nowMs })),
    );
  }, options);
}
function writeSweepFailure(nowMs, error, options) {
  runOpenClawStateWriteTransaction(({ db }) => {
    executeSqliteQuerySync(
      db,
      getNodeSqliteKysely(db)
        .insertInto("skill_curator_state")
        .values({
          id: CURATOR_STATE_ID,
          last_attempt_at_ms: nowMs,
          last_success_at_ms: null,
          last_error: String(error),
          last_result_json: EMPTY_RESULT_JSON,
        })
        .onConflict((conflict) =>
          conflict.column("id").doUpdateSet({
            last_attempt_at_ms: nowMs,
            last_error: String(error),
          }),
        ),
    );
  }, options);
}
async function runSkillCuratorSweep(options = {}) {
  const nowMs = options.nowMs ?? Date.now();
  const startedAtMs = Date.now();
  writeSweepAttempt(nowMs, options);
  try {
    const curated = await loadCuratedSkills(options);
    const existingCurated = [];
    const result = runOpenClawStateWriteTransaction(({ db }) => {
      const kysely = getNodeSqliteKysely(db);
      const lifecycleRows = executeSqliteQuerySync(
        db,
        kysely.selectFrom("skill_lifecycle").selectAll(),
      ).rows;
      const usageRows = executeSqliteQuerySync(
        db,
        kysely.selectFrom("skill_usage").select(["skill_file", "last_used_at_ms"]),
      ).rows;
      const lifecycleByFile = new Map(lifecycleRows.map((row) => [row.skill_file, row]));
      const usageByFile = new Map(usageRows.map((row) => [row.skill_file, row.last_used_at_ms]));
      let stale = 0;
      let archived = 0;
      let pinnedSkipped = 0;
      for (const skill of curated) {
        const existing = lifecycleByFile.get(skill.skillFile);
        if (!fs.existsSync(skill.skillFile)) {
          executeSqliteQuerySync(
            db,
            kysely.deleteFrom("skill_lifecycle").where("skill_file", "=", skill.skillFile),
          );
          continue;
        }
        existingCurated.push(skill);
        if (existing?.pinned === 1) {
          pinnedSkipped += 1;
          continue;
        }
        const createdAtMs = existing?.created_at_ms ?? skill.createdAtMs;
        const lastActivityMs = Math.max(
          usageByFile.get(skill.skillFile) ?? 0,
          skill.lastAppliedAtMs,
          createdAtMs,
        );
        const desired =
          existing?.state === "archived"
            ? "archived"
            : desiredLifecycleState(nowMs - lastActivityMs);
        if (desired === "stale" && existing?.state !== "stale") stale += 1;
        if (desired === "archived" && existing?.state !== "archived") archived += 1;
        const stateChangedAtMs = existing?.state === desired ? existing.state_changed_at_ms : nowMs;
        executeSqliteQuerySync(
          db,
          kysely
            .insertInto("skill_lifecycle")
            .values({
              skill_key: skill.skillKey,
              skill_name: skill.skillName,
              skill_file: skill.skillFile,
              state: desired,
              pinned: 0,
              state_changed_at_ms: stateChangedAtMs,
              created_at_ms: createdAtMs,
              archived_reason: desired === "archived" ? "unused for 90 days" : null,
            })
            .onConflict((conflict) =>
              conflict.column("skill_file").doUpdateSet({
                skill_key: skill.skillKey,
                skill_name: skill.skillName,
                state: desired,
                state_changed_at_ms: stateChangedAtMs,
                archived_reason: desired === "archived" ? "unused for 90 days" : null,
              }),
            ),
        );
      }
      return {
        stale,
        archived,
        pinnedSkipped,
      };
    }, options);
    const sweepResult = {
      examined: curated.length,
      ...result,
      durationMs: Math.max(0, Date.now() - startedAtMs),
      overlaps: detectOverlapCandidates(existingCurated),
    };
    runOpenClawStateWriteTransaction(({ db }) => {
      executeSqliteQuerySync(
        db,
        getNodeSqliteKysely(db)
          .updateTable("skill_curator_state")
          .set({
            last_success_at_ms: nowMs,
            last_error: null,
            last_result_json: JSON.stringify(sweepResult),
          })
          .where("id", "=", CURATOR_STATE_ID),
      );
    }, options);
    return sweepResult;
  } catch (error) {
    writeSweepFailure(nowMs, error, options);
    throw error;
  }
}
function parseOverlapCandidates(value) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed.overlaps)
      ? parsed.overlaps.filter((entry) =>
          Boolean(
            entry &&
            typeof entry === "object" &&
            typeof entry.left === "string" &&
            typeof entry.right === "string" &&
            typeof entry.score === "number",
          ),
        )
      : [];
  } catch {
    return [];
  }
}
function getSkillCuratorStatus(options = {}) {
  const { database, kysely } = curatorDb(options);
  const state = executeSqliteQueryTakeFirstSync(
    database.db,
    kysely.selectFrom("skill_curator_state").selectAll().where("id", "=", CURATOR_STATE_ID),
  );
  const rows = executeSqliteQuerySync(
    database.db,
    kysely
      .selectFrom("skill_lifecycle")
      .leftJoin("skill_usage", "skill_usage.skill_file", "skill_lifecycle.skill_file")
      .select([
        "skill_lifecycle.skill_key as skillKey",
        "skill_lifecycle.skill_name as skillName",
        "skill_lifecycle.skill_file as skillFile",
        "skill_lifecycle.state as state",
        "skill_lifecycle.pinned as pinned",
        "skill_lifecycle.created_at_ms as createdAtMs",
        "skill_lifecycle.state_changed_at_ms as stateChangedAtMs",
        "skill_lifecycle.archived_reason as archivedReason",
        "skill_usage.last_used_at_ms as lastUsedAtMs",
        "skill_usage.use_count as useCount",
      ])
      .orderBy("skill_lifecycle.skill_file", "asc"),
  ).rows;
  const counts = {
    active: 0,
    stale: 0,
    archived: 0,
  };
  const skills = [];
  for (const row of rows) {
    const lifecycleState = row.state;
    counts[lifecycleState] += 1;
    skills.push({
      ...row,
      state: lifecycleState,
      pinned: row.pinned === 1,
      lastUsedAtMs: row.lastUsedAtMs ?? null,
      useCount: row.useCount ?? 0,
    });
  }
  return {
    lastAttemptAtMs: state?.last_attempt_at_ms ?? null,
    lastSuccessAtMs: state?.last_success_at_ms ?? null,
    lastError: state?.last_error ?? null,
    counts,
    skills,
    overlaps: parseOverlapCandidates(state?.last_result_json),
  };
}
function updateLifecyclePin(skill, pinned, options) {
  const skillKey = canonicalSkillKey(skill);
  const firstSkillFile = runOpenClawStateWriteTransaction(({ db }) => {
    const kysely = getNodeSqliteKysely(db);
    const first = executeSqliteQueryTakeFirstSync(
      db,
      kysely
        .selectFrom("skill_lifecycle")
        .select("skill_file")
        .where("skill_key", "=", skillKey)
        .orderBy("skill_file", "asc"),
    );
    if (!first) return null;
    return executeSqliteQuerySync(
      db,
      kysely
        .updateTable("skill_lifecycle")
        .set({ pinned: pinned ? 1 : 0 })
        .where("skill_key", "=", skillKey),
    ).numAffectedRows === 0n
      ? null
      : first.skill_file;
  }, options);
  if (!firstSkillFile) throw new Error(`Curated skill not found: ${skill}`);
  return getSkillCuratorStatus(options).skills.find((entry) => entry.skillFile === firstSkillFile);
}
function pinCuratedSkill(skill, options = {}) {
  return updateLifecyclePin(skill, true, options);
}
function unpinCuratedSkill(skill, options = {}) {
  return updateLifecyclePin(skill, false, options);
}
function restoreCuratedSkill(skill, options = {}) {
  const skillKey = canonicalSkillKey(skill);
  const nowMs = options.nowMs ?? Date.now();
  const firstSkillFile = runOpenClawStateWriteTransaction(({ db }) => {
    const kysely = getNodeSqliteKysely(db);
    const first = executeSqliteQueryTakeFirstSync(
      db,
      kysely
        .selectFrom("skill_lifecycle")
        .select("skill_file")
        .where("skill_key", "=", skillKey)
        .where("state", "=", "archived")
        .orderBy("skill_file", "asc"),
    );
    if (!first) return null;
    return executeSqliteQuerySync(
      db,
      kysely
        .updateTable("skill_lifecycle")
        .set({
          state: "active",
          state_changed_at_ms: nowMs,
          archived_reason: null,
        })
        .where("skill_key", "=", skillKey)
        .where("state", "=", "archived"),
    ).numAffectedRows === 0n
      ? null
      : first.skill_file;
  }, options);
  if (!firstSkillFile) throw new Error(`Archived curated skill not found: ${skill}`);
  return getSkillCuratorStatus(options).skills.find((entry) => entry.skillFile === firstSkillFile);
}
function getArchivedSkillFiles(options = {}) {
  try {
    const { database, kysely } = curatorDb(options);
    const rows = executeSqliteQuerySync(
      database.db,
      kysely
        .selectFrom("skill_lifecycle")
        .select("skill_file")
        .where("state", "=", "archived")
        .orderBy("skill_file", "asc"),
    ).rows;
    return new Set(rows.map((row) => row.skill_file));
  } catch (error) {
    if (!loggedArchivedSkillReadFailure) {
      loggedArchivedSkillReadFailure = true;
      log.warn("failed to read archived skill state; loading without lifecycle filtering", {
        error: String(error),
      });
    }
    return /* @__PURE__ */ new Set();
  }
}
function getSkillCuratorDoctorWarning(options = {}) {
  const status = getSkillCuratorStatus(options);
  if (status.lastAttemptAtMs === null) return null;
  const nowMs = options.nowMs ?? Date.now();
  const successTooOld =
    status.lastSuccessAtMs === null
      ? nowMs - status.lastAttemptAtMs > DOCTOR_WEDGED_AFTER_MS
      : status.lastAttemptAtMs - status.lastSuccessAtMs > DOCTOR_WEDGED_AFTER_MS &&
        nowMs - status.lastSuccessAtMs > DOCTOR_WEDGED_AFTER_MS;
  if (!status.lastError && !successTooOld) return null;
  return `skill curator has not completed a sweep since ${status.lastSuccessAtMs ? new Date(status.lastSuccessAtMs).toISOString() : "its first attempt"} — check gateway logs`;
}
//#endregion
export {
  readWorkspaceSupportFile as A,
  MAX_SKILL_PROPOSAL_ORIGIN_RUN_IDS as C,
  assertWorkspaceSkillWriteTarget as D,
  assertInsideWorkspace as E,
  normalizeSkillIndexName as F,
  canonicalizePath as I,
  formatPathRelativeToCwdOrAbsolute as L,
  buildSkillIndexEntries as M,
  filterPromptVisibleSkillEntries as N,
  normalizeWorkspaceSkillSupportPath as O,
  filterUserInvocableSkillEntries as P,
  isLocalPath as R,
  writeSkillProposalRollback as S,
  MAX_WORKSPACE_SKILL_SUPPORT_FILE_BYTES as T,
  replaceSkillProposalDraft as _,
  restoreCuratedSkill as a,
  withSkillProposalTargetLock as b,
  createSkillProposalId as c,
  prepareSkillProposalSupportFiles as d,
  readProposalSupportFiles as f,
  refreshSkillProposalManifest as g,
  readSkillProposalRecord as h,
  pinCuratedSkill as i,
  writeWorkspaceSkill as j,
  readWorkspaceSkillFile as k,
  createSkillProposalRollback as l,
  readSkillProposalManifest as m,
  getSkillCuratorDoctorWarning as n,
  startSkillCuratorMaintenance as o,
  readSkillProposal as p,
  getSkillCuratorStatus as r,
  unpinCuratedSkill as s,
  getArchivedSkillFiles as t,
  hashSkillProposalContent as u,
  resolveSkillProposalTarget as v,
  SKILL_WORKSHOP_SCHEMA as w,
  writeSkillProposal as x,
  updateSkillProposalRecord as y,
};
