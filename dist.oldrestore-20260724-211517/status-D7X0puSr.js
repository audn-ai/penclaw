import fs from "node:fs";
import fs$1 from "node:fs/promises";
import path from "node:path";
import { t as resolveEffectiveAgentSkillFilter } from "./agent-filter-DcBVtCFz.js";
import { t as resolveBundledSkillsDir } from "./bundled-dir-BfHNzP7v.js";
import {
  C as resolveClawHubBaseUrl,
  O as searchClawHubSkills,
  S as reportClawHubSkillInstallTelemetry,
  _ as fetchClawHubSkillVerification,
  a as downloadClawHubSkillArchiveUrl,
  h as fetchClawHubSkillInstallResolution,
  i as downloadClawHubSkillArchive,
  m as fetchClawHubSkillDetail,
  n as downloadClawHubGitHubSkillArchive,
  v as isDefaultClawHubBaseUrl,
} from "./clawhub-CgGOpxts.js";
import { n as ensureClawHubPackageTrustAcknowledged } from "./clawhub-install-trust-BIciJavS.js";
import {
  a as resolveSkillsInstallPreferences,
  i as resolveSkillConfig,
  n as isSkillConfigPathTruthy,
  r as resolveBundledAllowlist,
  t as isBundledSkillAllowed,
} from "./config-B_sNiRFS.js";
import { n as hasBinary } from "./config-eval-BLzabchw.js";
import { a as sha256Hex } from "./crypto-digest-CNeb2i19.js";
import { F as normalizeSkillIndexName, M as buildSkillIndexEntries } from "./curator-BbVbrcMR.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { v as pathExists } from "./fs-safe-RNq3oO57.js";
import {
  i as withExtractedArchiveRoot,
  t as installPackageDir,
} from "./install-package-dir-BWAaVbDQ.js";
import { i as resolveSafeInstallDir } from "./install-safe-path-EhqVsq3P.js";
import { t as evaluateSkillInstallPolicy } from "./install-security-scan-Bu6soO4h.js";
import { l as writeJson } from "./json-7OTJmMaB.js";
import { a as readJsonIfExists, o as tryReadJson } from "./json-files-CTWRDHag.js";
import { t as loadSkillsFromDirSafe } from "./local-loader-BxASAwJb.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
import { t as CONFIG_DIR } from "./utils-DtcDeqWS.js";
import {
  o as loadWorkspaceSkillEntries,
  u as mergeRemoteNodeSkillEntries,
} from "./workspace-DR7anktc.js";
//#region src/shared/entry-metadata.ts
/** Resolves entry emoji/homepage with metadata taking precedence over frontmatter aliases. */
function resolveEmojiAndHomepage(params) {
  const emoji = params.metadata?.emoji ?? params.frontmatter?.emoji;
  const homepage = normalizeOptionalString(
    params.metadata?.homepage ??
      params.frontmatter?.homepage ??
      params.frontmatter?.website ??
      params.frontmatter?.url,
  );
  return {
    ...(emoji ? { emoji } : {}),
    ...(homepage ? { homepage } : {}),
  };
}
//#endregion
//#region src/shared/requirements.ts
/** Returns required binaries absent from both the local host and optional remote target. */
function resolveMissingBins(params) {
  const remote = params.hasRemoteBin;
  return params.required.filter((bin) => {
    if (params.hasLocalBin(bin)) return false;
    if (remote?.(bin)) return false;
    return true;
  });
}
/** Treats an any-bin requirement as satisfied when any listed binary exists locally or remotely. */
function resolveMissingAnyBins(params) {
  if (params.required.length === 0) return [];
  if (params.required.some((bin) => params.hasLocalBin(bin))) return [];
  if (params.hasRemoteAnyBin?.(params.required)) return [];
  return params.required;
}
/** Resolves OS requirements against local and remote platforms, accepting macos as darwin. */
function resolveMissingOs(params) {
  if (params.required.length === 0) return [];
  const localPlatform = normalizeOsRequirementPlatform(params.localPlatform);
  const requiredPlatforms = new Set(
    params.required.map((platform) => normalizeOsRequirementPlatform(platform)),
  );
  if (requiredPlatforms.has(localPlatform)) return [];
  if (
    params.remotePlatforms?.some((platform) =>
      requiredPlatforms.has(normalizeOsRequirementPlatform(platform)),
    )
  )
    return [];
  return params.required;
}
function normalizeOsRequirementPlatform(platform) {
  const normalized = platform.trim().toLowerCase();
  return normalized === "macos" ? "darwin" : normalized;
}
/** Returns environment variable names whose caller-provided satisfaction check fails. */
function resolveMissingEnv(params) {
  const missing = [];
  for (const envName of params.required) {
    if (params.isSatisfied(envName)) continue;
    missing.push(envName);
  }
  return missing;
}
/** Builds per-config-path status while preserving every declared path for UI diagnostics. */
function buildConfigChecks(params) {
  return params.required.map((pathStr) => {
    return {
      path: pathStr,
      satisfied: params.isSatisfied(pathStr),
    };
  });
}
/** Evaluates normalized requirements and returns missing categories plus config diagnostics. */
function evaluateRequirements(params) {
  const missingBins = resolveMissingBins({
    required: params.required.bins,
    hasLocalBin: params.hasLocalBin,
    hasRemoteBin: params.hasRemoteBin,
  });
  const missingAnyBins = resolveMissingAnyBins({
    required: params.required.anyBins,
    hasLocalBin: params.hasLocalBin,
    hasRemoteAnyBin: params.hasRemoteAnyBin,
  });
  const missingOs = resolveMissingOs({
    required: params.required.os,
    localPlatform: params.localPlatform,
    remotePlatforms: params.remotePlatforms,
  });
  const missingEnv = resolveMissingEnv({
    required: params.required.env,
    isSatisfied: params.isEnvSatisfied,
  });
  const configChecks = buildConfigChecks({
    required: params.required.config,
    isSatisfied: params.isConfigSatisfied,
  });
  const missingConfig = configChecks.filter((check) => !check.satisfied).map((check) => check.path);
  const missing = params.always
    ? {
        bins: [],
        anyBins: [],
        env: [],
        config: [],
        os: [],
      }
    : {
        bins: missingBins,
        anyBins: missingAnyBins,
        env: missingEnv,
        config: missingConfig,
        os: missingOs,
      };
  return {
    missing,
    eligible:
      params.always ||
      (missing.bins.length === 0 &&
        missing.anyBins.length === 0 &&
        missing.env.length === 0 &&
        missing.config.length === 0 &&
        missing.os.length === 0),
    configChecks,
  };
}
/** Converts entry metadata into the canonical requirement shape before evaluation. */
function evaluateRequirementsFromMetadata(params) {
  const required = {
    bins: params.metadata?.requires?.bins ?? [],
    anyBins: params.metadata?.requires?.anyBins ?? [],
    env: params.metadata?.requires?.env ?? [],
    config: params.metadata?.requires?.config ?? [],
    os: params.metadata?.os ?? [],
  };
  return {
    required,
    ...evaluateRequirements({
      always: params.always,
      required,
      hasLocalBin: params.hasLocalBin,
      hasRemoteBin: params.hasRemoteBin,
      hasRemoteAnyBin: params.hasRemoteAnyBin,
      localPlatform: params.localPlatform,
      remotePlatforms: params.remotePlatforms,
      isEnvSatisfied: params.isEnvSatisfied,
      isConfigSatisfied: params.isConfigSatisfied,
    }),
  };
}
/** Convenience wrapper for callers that receive remote capability checks as one object. */
function evaluateRequirementsFromMetadataWithRemote(params) {
  return evaluateRequirementsFromMetadata({
    always: params.always,
    metadata: params.metadata,
    hasLocalBin: params.hasLocalBin,
    hasRemoteBin: params.remote?.hasBin,
    hasRemoteAnyBin: params.remote?.hasAnyBin,
    localPlatform: params.localPlatform,
    remotePlatforms: params.remote?.platforms,
    isEnvSatisfied: params.isEnvSatisfied,
    isConfigSatisfied: params.isConfigSatisfied,
  });
}
//#endregion
//#region src/shared/entry-status.ts
/** Resolves entry presentation metadata and requirement eligibility in one shared shape. */
function evaluateEntryMetadataRequirements(params) {
  const { emoji, homepage } = resolveEmojiAndHomepage({
    metadata: params.metadata,
    frontmatter: params.frontmatter,
  });
  const { required, missing, eligible, configChecks } = evaluateRequirementsFromMetadataWithRemote({
    always: params.always,
    metadata: params.metadata ?? void 0,
    hasLocalBin: params.hasLocalBin,
    localPlatform: params.localPlatform,
    remote: params.remote,
    isEnvSatisfied: params.isEnvSatisfied,
    isConfigSatisfied: params.isConfigSatisfied,
  });
  return {
    ...(emoji ? { emoji } : {}),
    ...(homepage ? { homepage } : {}),
    required,
    missing,
    requirementsSatisfied: eligible,
    configChecks,
  };
}
/** Evaluates an entry object's metadata/frontmatter requirements on the current platform. */
function evaluateEntryRequirementsForCurrentPlatform(params) {
  return evaluateEntryMetadataRequirements({
    always: params.always,
    metadata: params.entry.metadata,
    frontmatter: params.entry.frontmatter,
    hasLocalBin: params.hasLocalBin,
    localPlatform: process.platform,
    remote: params.remote,
    isEnvSatisfied: params.isEnvSatisfied,
    isConfigSatisfied: params.isConfigSatisfied,
  });
}
//#endregion
//#region src/skills/lifecycle/archive-install.ts
const VALID_SLUG_PATTERN = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
const DEFAULT_SKILL_ARCHIVE_ROOT_MARKERS = ["SKILL.md"];
/** Accepted root marker names for ClawHub skill archive uploads. */
const CLAWHUB_SKILL_ARCHIVE_ROOT_MARKERS = ["SKILL.md", "skill.md", "skills.md", "SKILL.MD"];
function hasNonAscii(value) {
  for (const char of value) if (char.charCodeAt(0) > 127) return true;
  return false;
}
/** Normalizes a tracked slug without accepting traversal or path separators. */
function normalizeTrackedSkillSlug(raw) {
  const slug = raw.trim();
  if (!slug || slug.includes("/") || slug.includes("\\") || slug.includes(".."))
    throw new Error(`Invalid skill slug: ${raw}`);
  return slug;
}
function validateRequestedSkillSlug(raw) {
  const slug = normalizeTrackedSkillSlug(raw);
  if (hasNonAscii(slug) || !VALID_SLUG_PATTERN.test(slug))
    throw new Error(`Invalid skill slug: ${raw}`);
  return slug;
}
function resolveWorkspaceSkillInstallDir(workspaceDir, slug) {
  const target = resolveSafeInstallDir({
    baseDir: path.join(path.resolve(workspaceDir), "skills"),
    id: slug,
    invalidNameMessage: "invalid skill target path",
  });
  if (!target.ok) throw new Error(target.error);
  return target.path;
}
function installFailure(error, failureKind) {
  return {
    ok: false,
    error,
    failureKind,
  };
}
async function hasSkillArchiveRoot(rootDir, rootMarkers) {
  for (const candidate of rootMarkers)
    if (await pathExists(path.join(rootDir, candidate))) return true;
  return false;
}
function scanBlockedFailureKind(blocked) {
  return blocked.code === "security_scan_failed" ? "unavailable" : "invalid-request";
}
const TRANSIENT_ARCHIVE_ERROR_PATTERNS = [
  "enoent",
  "enospc",
  "eio",
  "eacces",
  "eperm",
  "ebusy",
  "emfile",
  "enfile",
  "timeout",
  "timed out",
];
function archiveFailureKind(error) {
  const lower = error.toLowerCase();
  if (lower.startsWith("failed to install skill:")) return "unavailable";
  for (const pattern of TRANSIENT_ARCHIVE_ERROR_PATTERNS)
    if (lower.includes(pattern)) return "unavailable";
  return "invalid-request";
}
async function installExtractedSkillRoot(params) {
  try {
    if (
      !(await hasSkillArchiveRoot(
        params.extractedRoot,
        params.rootMarkers ?? DEFAULT_SKILL_ARCHIVE_ROOT_MARKERS,
      ))
    )
      return installFailure("archive is missing SKILL.md", "invalid-request");
    let targetDir;
    try {
      targetDir = resolveWorkspaceSkillInstallDir(params.workspaceDir, params.slug);
    } catch (err) {
      return installFailure(formatErrorMessage(err), "invalid-request");
    }
    const targetExists = await pathExists(targetDir);
    const effectiveMode = params.mode === "update" && targetExists ? "update" : "install";
    if (params.mode === "install" && targetExists)
      return installFailure(
        `Skill already exists at ${targetDir}. Re-run with force/update.`,
        "invalid-request",
      );
    if (params.policy) {
      const scanResult = await evaluateSkillInstallPolicy({
        config: params.policy.config,
        installId: params.policy.installId ?? "archive",
        logger: params.logger ?? {},
        origin: params.policy.origin,
        requestedSpecifier: params.policy.requestedSpecifier,
        source: params.policy.source,
        mode: effectiveMode,
        skillName: params.slug,
        sourceDir: params.extractedRoot,
      });
      if (scanResult?.blocked)
        return installFailure(
          scanResult.blocked.reason,
          scanBlockedFailureKind(scanResult.blocked),
        );
    }
    const install = await installPackageDir({
      sourceDir: params.extractedRoot,
      targetDir,
      mode: effectiveMode,
      timeoutMs: params.timeoutMs ?? 12e4,
      logger: params.logger,
      copyErrorPrefix: "failed to install skill",
      hasDeps: false,
      depsLogMessage: "",
    });
    if (!install.ok) return installFailure(install.error, "unavailable");
    return {
      ok: true,
      targetDir,
    };
  } catch (err) {
    return installFailure(formatErrorMessage(err), "unavailable");
  }
}
async function installSkillArchiveFromPath(params) {
  const result = await withExtractedArchiveRoot({
    archivePath: params.archivePath,
    tempDirPrefix: "openclaw-skill-archive-",
    timeoutMs: params.timeoutMs ?? 12e4,
    logger: params.logger,
    rootMarkers: ["SKILL.md"],
    onExtracted: async (rootDir) =>
      await installExtractedSkillRoot({
        workspaceDir: params.workspaceDir,
        slug: params.slug,
        extractedRoot: rootDir,
        mode: params.force ? "update" : "install",
        timeoutMs: params.timeoutMs,
        logger: params.logger,
        policy: params.policy,
      }),
  });
  if (!result.ok) {
    const error = result.error.includes("unexpected archive layout")
      ? "archive is missing SKILL.md"
      : result.error;
    return installFailure(
      error,
      "failureKind" in result &&
        (result.failureKind === "invalid-request" || result.failureKind === "unavailable")
        ? result.failureKind
        : archiveFailureKind(error),
    );
  }
  return result;
}
//#endregion
//#region src/skills/lifecycle/clawhub.ts
const DOT_DIR = ".clawhub";
const LEGACY_DOT_DIR = ".clawdhub";
const SKILL_ORIGIN_RELATIVE_PATH = path.join(DOT_DIR, "origin.json");
const LOCAL_SKILL_CARD_FILENAME = "skill-card.md";
const LOCAL_SKILL_CARD_MAX_BYTES = 256 * 1024;
const CLAWHUB_OWNER_HANDLE_PATTERN = /^[a-z0-9](?:[a-z0-9._-]{0,38}[a-z0-9])?$/;
function normalizeClawHubOwnerHandle(raw) {
  const ownerHandle = raw.trim().toLowerCase();
  if (!CLAWHUB_OWNER_HANDLE_PATTERN.test(ownerHandle))
    throw new Error(`Invalid ClawHub owner handle: ${raw}`);
  return ownerHandle;
}
function parseRequestedClawHubSkillRef(raw) {
  const value = raw.trim();
  if (!value.startsWith("@")) return { slug: validateRequestedSkillSlug(value) };
  const parts = value.slice(1).split("/");
  if (parts.length !== 2) throw new Error(`Invalid ClawHub skill reference: ${raw}`);
  const [owner, slug] = parts;
  if (!owner || !slug) throw new Error(`Invalid ClawHub skill reference: ${raw}`);
  return {
    ownerHandle: normalizeClawHubOwnerHandle(owner),
    slug: validateRequestedSkillSlug(slug),
  };
}
function formatClawHubSkillRef(ref) {
  return ref.ownerHandle ? `@${ref.ownerHandle}/${ref.slug}` : ref.slug;
}
async function resolveRequestedUpdateSlug(params) {
  const requested = params.requestedSlug.trim();
  const requestedRef = requested.startsWith("@")
    ? parseRequestedClawHubSkillRef(requested)
    : { slug: normalizeTrackedSkillSlug(requested) };
  const trackedSlug = requestedRef.slug;
  const trackedOrigin = await readClawHubSkillOrigin(
    resolveWorkspaceSkillInstallDir(params.workspaceDir, trackedSlug),
  );
  const trackedLockEntry = params.lock.skills[trackedSlug];
  if (trackedOrigin || trackedLockEntry) {
    const trackedOwnerHandle = trackedOrigin?.ownerHandle ?? trackedLockEntry?.ownerHandle;
    if (requestedRef.ownerHandle && trackedOwnerHandle !== requestedRef.ownerHandle) {
      const trackedRef = trackedOwnerHandle ? `@${trackedOwnerHandle}/${trackedSlug}` : trackedSlug;
      throw new Error(
        `Skill "${trackedSlug}" is tracked as ${trackedRef}, not @${requestedRef.ownerHandle}/${trackedSlug}.`,
      );
    }
    return trackedSlug;
  }
  return validateRequestedSkillSlug(requestedRef.slug);
}
function hasOfficialClawHubFlag(value) {
  return value?.channel === "official" || value?.official === true || value?.isOfficial === true;
}
function isDefaultOfficialClawHubSkillSource(params) {
  if (!isDefaultClawHubBaseUrl(params.baseUrl)) return false;
  return (
    hasOfficialClawHubFlag(params.detail?.skill) ||
    hasOfficialClawHubFlag(params.detail?.owner) ||
    hasOfficialClawHubFlag(params.resolution) ||
    (params.resolution?.installKind === "archive" &&
      hasOfficialClawHubFlag(params.resolution.archive))
  );
}
async function fetchDefaultClawHubSkillDetailIfOfficial(params) {
  if (!isDefaultClawHubBaseUrl(params.baseUrl)) return;
  try {
    const detail = await fetchClawHubSkillDetail({
      slug: params.slug,
      ...(params.ownerHandle ? { ownerHandle: params.ownerHandle } : {}),
      baseUrl: params.baseUrl,
    });
    return isDefaultOfficialClawHubSkillSource({
      baseUrl: params.baseUrl,
      detail,
    })
      ? detail
      : void 0;
  } catch {
    return;
  }
}
async function readClawHubSkillsLockfile(workspaceDir) {
  const candidates = [
    path.join(workspaceDir, DOT_DIR, "lock.json"),
    path.join(workspaceDir, LEGACY_DOT_DIR, "lock.json"),
  ];
  for (const candidate of candidates)
    try {
      const raw = await tryReadJson(candidate);
      if (raw?.version === 1 && raw.skills && typeof raw.skills === "object")
        return {
          version: 1,
          skills: raw.skills,
        };
    } catch {}
  return {
    version: 1,
    skills: {},
  };
}
async function writeClawHubSkillsLockfile(workspaceDir, lockfile) {
  await writeJson(path.join(workspaceDir, DOT_DIR, "lock.json"), lockfile, {
    trailingNewline: true,
  });
}
function readJsonIfExistsSync(candidate) {
  try {
    return {
      exists: true,
      value: JSON.parse(fs.readFileSync(candidate, "utf8")),
    };
  } catch (err) {
    if (err && typeof err === "object" && "code" in err && err.code === "ENOENT")
      return { exists: false };
    throw err;
  }
}
function normalizeStoredRegistry(registry) {
  const trimmed = registry.trim();
  return trimmed.replace(/\/+$/, "") || trimmed;
}
function readRealPathSync(candidate) {
  try {
    return fs.realpathSync.native(candidate);
  } catch {
    return;
  }
}
function normalizeOptionalStringValue(raw) {
  return typeof raw === "string" && raw.trim() ? raw.trim() : void 0;
}
function asRecord(raw) {
  return raw && typeof raw === "object" && !Array.isArray(raw) ? raw : void 0;
}
function normalizeGitHubRepoName(raw) {
  const repo = normalizeOptionalStringValue(raw);
  if (!repo) return;
  const parts = repo.split("/");
  if (parts.length !== 2 || parts.some((part) => !/^[A-Za-z0-9._-]+$/.test(part))) return;
  return repo;
}
function normalizeGitHubCommitSegment(raw) {
  const commit = normalizeOptionalStringValue(raw);
  if (!commit || !/^[0-9a-f]{40}$/i.test(commit)) return;
  return commit;
}
function buildGitHubTreeUrl(params) {
  const [owner, name] = params.repo.split("/");
  const pathParts = params.sourcePath ? params.sourcePath.split("/") : [];
  return `https://github.com/${[owner, name, "tree", params.commit, ...pathParts]
    .map(encodeURIComponent)
    .join("/")}`;
}
function readVerifiedClawHubSkillSourceUrl(raw) {
  const provenance = asRecord(raw);
  if (provenance?.source !== "server-resolved-github-import") return;
  const repo = normalizeGitHubRepoName(provenance.repo);
  const commit = normalizeGitHubCommitSegment(provenance.commit);
  if (!repo || !commit) return;
  const pathValue = normalizeOptionalStringValue(provenance.path);
  let sourcePath;
  if (pathValue)
    try {
      sourcePath = normalizeGitHubSourcePath(pathValue);
    } catch {
      return;
    }
  return buildGitHubTreeUrl({
    repo,
    commit,
    ...(sourcePath ? { sourcePath } : {}),
  });
}
function readInstallResolutionSourceUrl(resolution) {
  if (resolution?.installKind !== "github") return;
  return normalizeOptionalStringValue(resolution.github.sourceUrl);
}
function buildDownloadedArtifactLock(archive) {
  return {
    kind: archive.artifact,
    sha256: archive.sha256Hex,
    integrity: archive.integrity,
  };
}
function snapshotClawHubSkillVerification(verification) {
  return {
    schema: verification.schema,
    ok: verification.ok,
    decision: verification.decision,
    reasons: [...verification.reasons],
    ...(verification.card !== void 0 ? { card: verification.card } : {}),
    ...(verification.artifact !== void 0 ? { artifact: verification.artifact } : {}),
    ...(verification.provenance !== void 0 ? { provenance: verification.provenance } : {}),
    ...(verification.security !== void 0 ? { security: verification.security } : {}),
    ...(verification.signature !== void 0 ? { signature: verification.signature } : {}),
  };
}
async function fetchInstallVerificationLock(params) {
  try {
    return snapshotClawHubSkillVerification(
      await fetchClawHubSkillVerification({
        slug: params.slug,
        ...(params.ownerHandle ? { ownerHandle: params.ownerHandle } : {}),
        version: params.version,
        baseUrl: params.baseUrl,
      }),
    );
  } catch {
    return;
  }
}
async function readInstalledSkillFileLock(skillDir) {
  for (const marker of CLAWHUB_SKILL_ARCHIVE_ROOT_MARKERS) {
    const candidate = path.join(skillDir, marker);
    try {
      return {
        path: marker,
        sha256: sha256Hex(await fs$1.readFile(candidate)),
      };
    } catch {
      continue;
    }
  }
}
function readClawHubSkillsLockfileStatusSync(workspaceDir) {
  const candidates = [
    path.join(workspaceDir, DOT_DIR, "lock.json"),
    path.join(workspaceDir, LEGACY_DOT_DIR, "lock.json"),
  ];
  for (const candidate of candidates) {
    let raw;
    try {
      const read = readJsonIfExistsSync(candidate);
      if (!read.exists) continue;
      raw = read.value;
    } catch (err) {
      return {
        kind: "malformed",
        path: candidate,
        error: formatErrorMessage(err),
      };
    }
    if (raw?.version === 1 && raw.skills && typeof raw.skills === "object")
      return {
        kind: "found",
        path: candidate,
        lock: {
          version: 1,
          skills: raw.skills,
        },
      };
    return {
      kind: "malformed",
      path: candidate,
      error: "expected version 1 lockfile with skills",
    };
  }
  return { kind: "missing" };
}
function normalizeOptionalSelector(value) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : void 0;
}
function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}
function normalizeDownloadedArtifactLock(raw) {
  if (!raw || typeof raw !== "object") return;
  const candidate = raw;
  if (
    (candidate.kind === "archive" || candidate.kind === "clawpack") &&
    isNonEmptyString(candidate.sha256) &&
    isNonEmptyString(candidate.integrity)
  )
    return {
      kind: candidate.kind,
      sha256: candidate.sha256,
      integrity: candidate.integrity,
    };
}
function normalizeSkillFileLock(raw) {
  if (!raw || typeof raw !== "object") return;
  const candidate = raw;
  if (isNonEmptyString(candidate.path) && isNonEmptyString(candidate.sha256))
    return {
      path: candidate.path,
      sha256: candidate.sha256,
    };
}
function normalizeClawHubSkillOrigin(raw) {
  if (
    raw?.version === 1 &&
    typeof raw.registry === "string" &&
    raw.registry.trim().length > 0 &&
    typeof raw.slug === "string" &&
    raw.slug.trim().length > 0 &&
    typeof raw.installedVersion === "string" &&
    raw.installedVersion.trim().length > 0 &&
    typeof raw.installedAt === "number"
  ) {
    const sourceUrl = normalizeOptionalStringValue(raw.sourceUrl);
    const ownerHandleRaw = normalizeOptionalStringValue(raw.ownerHandle);
    let ownerHandle;
    if (ownerHandleRaw)
      try {
        ownerHandle = normalizeClawHubOwnerHandle(ownerHandleRaw);
      } catch {
        return null;
      }
    const artifact = normalizeDownloadedArtifactLock(raw.artifact);
    const skillFile = normalizeSkillFileLock(raw.skillFile);
    return {
      version: 1,
      registry: normalizeStoredRegistry(raw.registry),
      slug: raw.slug,
      ...(ownerHandle ? { ownerHandle } : {}),
      installedVersion: raw.installedVersion,
      installedAt: raw.installedAt,
      ...(sourceUrl ? { sourceUrl } : {}),
      ...(artifact ? { artifact } : {}),
      ...(skillFile ? { skillFile } : {}),
    };
  }
  return null;
}
async function readClawHubSkillOrigin(skillDir) {
  const candidates = [
    path.join(skillDir, DOT_DIR, "origin.json"),
    path.join(skillDir, LEGACY_DOT_DIR, "origin.json"),
  ];
  for (const candidate of candidates)
    try {
      const origin = normalizeClawHubSkillOrigin(await tryReadJson(candidate));
      if (origin) return origin;
    } catch {}
  return null;
}
function readClawHubSkillOriginStatusSync(skillDir) {
  const candidates = [
    path.join(skillDir, DOT_DIR, "origin.json"),
    path.join(skillDir, LEGACY_DOT_DIR, "origin.json"),
  ];
  for (const candidate of candidates) {
    let raw;
    try {
      const read = readJsonIfExistsSync(candidate);
      if (!read.exists) continue;
      raw = read.value;
    } catch (err) {
      return {
        kind: "malformed",
        path: candidate,
        error: formatErrorMessage(err),
      };
    }
    const origin = normalizeClawHubSkillOrigin(raw);
    if (origin)
      return {
        kind: "found",
        origin,
        path: candidate,
      };
    return {
      kind: "malformed",
      path: candidate,
      error: "expected version 1 origin with registry, slug, installedVersion, and installedAt",
    };
  }
  return { kind: "missing" };
}
async function readClawHubSkillOriginStrict(skillDir) {
  const candidates = [
    path.join(skillDir, DOT_DIR, "origin.json"),
    path.join(skillDir, LEGACY_DOT_DIR, "origin.json"),
  ];
  for (const candidate of candidates) {
    let raw;
    try {
      raw = await readJsonIfExists(candidate);
    } catch (err) {
      return {
        kind: "malformed",
        path: candidate,
        error: formatErrorMessage(err),
      };
    }
    if (!raw) continue;
    const origin = normalizeClawHubSkillOrigin(raw);
    if (origin)
      return {
        kind: "found",
        origin,
        path: candidate,
      };
    return {
      kind: "malformed",
      path: candidate,
      error: "expected version 1 origin with registry, slug, installedVersion, and installedAt",
    };
  }
  return { kind: "missing" };
}
function resolveClawHubSkillStatusLinkSync(params) {
  const originRead = readClawHubSkillOriginStatusSync(params.skillDir);
  const lockRead = params.lockRead ?? readClawHubSkillsLockfileStatusSync(params.workspaceDir);
  const lockfileLabel = `${params.lockfileScope ?? "workspace"} ClawHub lockfile`;
  if (originRead.kind === "missing") {
    let trackedSlug;
    try {
      trackedSlug = normalizeTrackedSkillSlug(params.skillKey);
    } catch {
      return;
    }
    const locked = lockRead.kind === "found" ? lockRead.lock.skills[trackedSlug] : void 0;
    if (!locked) return;
    return {
      status: "invalid",
      valid: false,
      reason: `Skill "${trackedSlug}" is tracked by the ${lockfileLabel} but is missing local ClawHub origin metadata.`,
      slug: trackedSlug,
      installedVersion: locked.version,
      installedAt: locked.installedAt,
      registry: normalizeStoredRegistry(locked.registry ?? resolveClawHubBaseUrl()),
      lockPath: lockRead.kind === "found" ? lockRead.path : void 0,
    };
  }
  if (originRead.kind === "malformed")
    return {
      status: "invalid",
      valid: false,
      reason: `Malformed ClawHub origin metadata at ${originRead.path}: ${originRead.error}`,
      originPath: originRead.path,
      lockPath: lockRead.kind === "found" ? lockRead.path : void 0,
    };
  let trackedSlug;
  try {
    trackedSlug = normalizeTrackedSkillSlug(originRead.origin.slug);
  } catch (err) {
    return {
      status: "invalid",
      valid: false,
      reason: `Invalid ClawHub origin slug "${originRead.origin.slug}": ${formatErrorMessage(err)}`,
      registry: originRead.origin.registry,
      slug: originRead.origin.slug,
      installedVersion: originRead.origin.installedVersion,
      installedAt: originRead.origin.installedAt,
      originPath: originRead.path,
      lockPath: lockRead.kind === "found" ? lockRead.path : void 0,
    };
  }
  if (lockRead.kind === "missing")
    return {
      status: "invalid",
      valid: false,
      reason: `Skill "${trackedSlug}" has ClawHub origin metadata but is not tracked by the ${lockfileLabel}.`,
      registry: originRead.origin.registry,
      slug: trackedSlug,
      installedVersion: originRead.origin.installedVersion,
      installedAt: originRead.origin.installedAt,
      originPath: originRead.path,
    };
  if (lockRead.kind === "malformed")
    return {
      status: "invalid",
      valid: false,
      reason: `Malformed ${lockfileLabel} at ${lockRead.path}: ${lockRead.error}`,
      registry: originRead.origin.registry,
      slug: trackedSlug,
      installedVersion: originRead.origin.installedVersion,
      installedAt: originRead.origin.installedAt,
      originPath: originRead.path,
      lockPath: lockRead.path,
    };
  const locked = lockRead.lock.skills[trackedSlug];
  if (!locked)
    return {
      status: "invalid",
      valid: false,
      reason: `Skill "${trackedSlug}" has ClawHub origin metadata but is not tracked by the ${lockfileLabel}.`,
      registry: originRead.origin.registry,
      slug: trackedSlug,
      installedVersion: originRead.origin.installedVersion,
      installedAt: originRead.origin.installedAt,
      originPath: originRead.path,
      lockPath: lockRead.path,
    };
  const expectedSkillDirRealPath = readRealPathSync(
    resolveWorkspaceSkillInstallDir(params.workspaceDir, trackedSlug),
  );
  const actualSkillDirRealPath = readRealPathSync(params.skillDir);
  if (!expectedSkillDirRealPath || actualSkillDirRealPath !== expectedSkillDirRealPath)
    return {
      status: "invalid",
      valid: false,
      reason: `Skill "${trackedSlug}" ClawHub origin metadata is not in the expected ClawHub install directory.`,
      registry: originRead.origin.registry,
      slug: trackedSlug,
      installedVersion: originRead.origin.installedVersion,
      installedAt: originRead.origin.installedAt,
      originPath: originRead.path,
      lockPath: lockRead.path,
    };
  const originRegistry = normalizeStoredRegistry(originRead.origin.registry);
  const lockedRegistry =
    locked.registry === void 0 ? originRegistry : normalizeStoredRegistry(locked.registry);
  const lockedSourceUrl = normalizeOptionalStringValue(locked.sourceUrl);
  const lockedOwnerHandle = normalizeOptionalStringValue(locked.ownerHandle);
  const lockedArtifact = normalizeDownloadedArtifactLock(locked.artifact);
  const lockedSkillFile = normalizeSkillFileLock(locked.skillFile);
  const provenanceMatches =
    originRead.origin.ownerHandle === lockedOwnerHandle &&
    originRead.origin.sourceUrl === lockedSourceUrl &&
    originRead.origin.artifact?.kind === lockedArtifact?.kind &&
    originRead.origin.artifact?.sha256 === lockedArtifact?.sha256 &&
    originRead.origin.artifact?.integrity === lockedArtifact?.integrity &&
    originRead.origin.skillFile?.path === lockedSkillFile?.path &&
    originRead.origin.skillFile?.sha256 === lockedSkillFile?.sha256;
  if (
    locked.version !== originRead.origin.installedVersion ||
    locked.installedAt !== originRead.origin.installedAt ||
    lockedRegistry !== originRegistry ||
    !provenanceMatches
  )
    return {
      status: "invalid",
      valid: false,
      reason: `Skill "${trackedSlug}" ClawHub origin metadata does not match the ${lockfileLabel}.`,
      registry: lockedRegistry,
      slug: trackedSlug,
      installedVersion: originRead.origin.installedVersion,
      installedAt: originRead.origin.installedAt,
      originPath: originRead.path,
      lockPath: lockRead.path,
    };
  return {
    status: "linked",
    valid: true,
    registry: lockedRegistry,
    slug: trackedSlug,
    ...(lockedOwnerHandle ? { ownerHandle: lockedOwnerHandle } : {}),
    installedVersion: locked.version,
    installedAt: locked.installedAt,
    originPath: originRead.path,
    lockPath: lockRead.path,
    ...(lockedSourceUrl ? { sourceUrl: lockedSourceUrl } : {}),
    ...(lockedArtifact ? { artifact: lockedArtifact } : {}),
    ...(lockedSkillFile ? { skillFile: lockedSkillFile } : {}),
  };
}
function resolveLocalSkillCardStatusSync(skillDir) {
  return readLocalSkillCardSync(skillDir);
}
function isPathInsideDir(child, parent) {
  const relative = path.relative(parent, child);
  return (
    relative === "" ||
    (relative.length > 0 && !relative.startsWith("..") && !path.isAbsolute(relative))
  );
}
function readLocalSkillCardSync(skillDir, includeContent = false) {
  const cardPath = path.join(skillDir, LOCAL_SKILL_CARD_FILENAME);
  let lstat;
  try {
    lstat = fs.lstatSync(cardPath);
  } catch (err) {
    if (err && typeof err === "object" && "code" in err && err.code === "ENOENT") return;
    return;
  }
  if (!lstat.isFile() || lstat.size > LOCAL_SKILL_CARD_MAX_BYTES) return;
  let fd;
  try {
    const rootRealPath = fs.realpathSync.native(skillDir);
    if (!isPathInsideDir(fs.realpathSync.native(cardPath), rootRealPath)) return;
    const noFollowFlag = fs.constants.O_NOFOLLOW ?? 0;
    fd = fs.openSync(cardPath, fs.constants.O_RDONLY | noFollowFlag);
    const fdStat = fs.fstatSync(fd);
    if (!fdStat.isFile() || fdStat.size > LOCAL_SKILL_CARD_MAX_BYTES) return;
    const result = {
      present: true,
      path: cardPath,
      sizeBytes: fdStat.size,
    };
    if (includeContent) result.content = fs.readFileSync(fd, "utf8");
    return result;
  } catch {
    return;
  } finally {
    if (fd !== void 0)
      try {
        fs.closeSync(fd);
      } catch {}
  }
}
function readLocalSkillCardContentSync(skillDir) {
  return readLocalSkillCardSync(skillDir, true)?.content;
}
async function writeClawHubSkillOrigin(skillDir, origin) {
  await writeJson(path.join(skillDir, SKILL_ORIGIN_RELATIVE_PATH), origin, {
    trailingNewline: true,
  });
}
async function searchSkillsFromClawHub(params) {
  return await searchClawHubSkills({
    query: params.query?.trim() || "*",
    limit: params.limit,
    baseUrl: params.baseUrl,
  });
}
async function resolveClawHubSkillVerificationTarget(params) {
  try {
    const version = normalizeOptionalSelector(params.version);
    const tag = normalizeOptionalSelector(params.tag);
    if (version && tag)
      return {
        ok: false,
        error: "Use either --version or --tag.",
      };
    const requestedRef = parseRequestedClawHubSkillRef(params.slug);
    const trackedSlug = requestedRef.slug;
    const skillDir = resolveWorkspaceSkillInstallDir(params.workspaceDir, trackedSlug);
    const originRead = await readClawHubSkillOriginStrict(skillDir);
    if (originRead.kind === "malformed")
      return {
        ok: false,
        error: `Malformed ClawHub origin metadata at ${originRead.path}: ${originRead.error}`,
      };
    if (originRead.kind === "found") {
      const locked = (await readClawHubSkillsLockfile(params.workspaceDir)).skills[trackedSlug];
      if (!locked)
        return {
          ok: false,
          error: `Skill "${trackedSlug}" has ClawHub origin metadata but is not tracked by the workspace ClawHub lockfile. Reinstall it from ClawHub before verifying it as an installed ClawHub skill.`,
        };
      if (normalizeTrackedSkillSlug(originRead.origin.slug) !== trackedSlug)
        return {
          ok: false,
          error: `Skill "${trackedSlug}" has ClawHub origin metadata for "${originRead.origin.slug}". Reinstall it from ClawHub before verifying it as an installed ClawHub skill.`,
        };
      const originRegistry = normalizeStoredRegistry(originRead.origin.registry);
      const lockedRegistry =
        locked.registry === void 0 ? originRegistry : normalizeStoredRegistry(locked.registry);
      const lockedOwnerHandle = normalizeOptionalStringValue(locked.ownerHandle);
      if (
        locked.version !== originRead.origin.installedVersion ||
        locked.installedAt !== originRead.origin.installedAt ||
        lockedRegistry !== originRegistry ||
        originRead.origin.ownerHandle !== lockedOwnerHandle
      )
        return {
          ok: false,
          error: `Skill "${trackedSlug}" ClawHub origin metadata does not match the workspace ClawHub lockfile. Reinstall it from ClawHub before verifying it as an installed ClawHub skill.`,
        };
      if (requestedRef.ownerHandle && lockedOwnerHandle !== requestedRef.ownerHandle)
        return {
          ok: false,
          error: `Skill "${trackedSlug}" is tracked as ${lockedOwnerHandle ? `@${lockedOwnerHandle}/${trackedSlug}` : trackedSlug}, not @${requestedRef.ownerHandle}/${trackedSlug}.`,
        };
      const selector = version ? "version" : tag ? "tag" : "installed-version";
      return {
        ok: true,
        slug: trackedSlug,
        ...(lockedOwnerHandle ? { ownerHandle: lockedOwnerHandle } : {}),
        baseUrl: lockedRegistry,
        version: version ?? (tag ? void 0 : locked.version),
        tag,
        resolution: {
          source: "installed",
          selector,
          registry: lockedRegistry,
          skillDir,
          installedVersion: locked.version,
        },
      };
    }
    const lockRead = readClawHubSkillsLockfileStatusSync(params.workspaceDir);
    if (lockRead.kind === "malformed")
      return {
        ok: false,
        error: `Malformed workspace ClawHub lockfile at ${lockRead.path}: ${lockRead.error}`,
      };
    if (lockRead.kind === "found" && lockRead.lock.skills[trackedSlug])
      return {
        ok: false,
        error: `Skill "${trackedSlug}" is tracked by the workspace ClawHub lockfile but is missing ClawHub origin metadata. Reinstall it from ClawHub before verifying it as an installed ClawHub skill.`,
      };
    const registry = resolveClawHubBaseUrl(params.baseUrl);
    const selector = version ? "version" : tag ? "tag" : "latest";
    return {
      ok: true,
      slug: requestedRef.slug,
      ...(requestedRef.ownerHandle ? { ownerHandle: requestedRef.ownerHandle } : {}),
      baseUrl: registry,
      version,
      tag,
      resolution: {
        source: "registry",
        selector,
        registry,
        skillDir: void 0,
        installedVersion: void 0,
      },
    };
  } catch (err) {
    return {
      ok: false,
      error: formatErrorMessage(err),
    };
  }
}
async function resolveInstallVersion(params) {
  const detail = await fetchClawHubSkillDetail({
    slug: params.slug,
    ...(params.ownerHandle ? { ownerHandle: params.ownerHandle } : {}),
    baseUrl: params.baseUrl,
  });
  if (!detail.skill) throw new Error(`Skill "${params.slug}" not found on ClawHub.`);
  const resolvedVersion = params.version ?? detail.latestVersion?.version;
  if (!resolvedVersion) throw new Error(`Skill "${params.slug}" has no installable version.`);
  return {
    detail,
    version: resolvedVersion,
  };
}
function normalizeGitHubSourcePath(raw) {
  const parts = raw.replaceAll("\\", "/").split("/").filter(Boolean);
  if (parts.length === 0 || parts.some((part) => part === "." || part === ".."))
    throw new Error(`Invalid GitHub skill source path: ${raw}`);
  return parts.join("/");
}
function resolveGitHubSkillSourceDir(repoRoot, sourcePath) {
  const normalized = normalizeGitHubSourcePath(sourcePath);
  return path.join(repoRoot, ...normalized.split("/"));
}
async function installArchiveResolution(params) {
  return await withExtractedArchiveRoot({
    archivePath: params.archivePath,
    tempDirPrefix: "openclaw-skill-clawhub-",
    timeoutMs: 12e4,
    rootMarkers: CLAWHUB_SKILL_ARCHIVE_ROOT_MARKERS,
    onExtracted: async (rootDir) =>
      await installExtractedSkillRoot({
        workspaceDir: params.workspaceDir,
        slug: params.slug,
        extractedRoot: rootDir,
        mode: params.force ? "update" : "install",
        logger: params.logger,
        policy: {
          config: params.config,
          installId: "clawhub",
          origin: {
            type: "clawhub",
            registry: params.registry,
            slug: params.slug,
            ...(params.ownerHandle ? { ownerHandle: params.ownerHandle } : {}),
            version: params.version,
          },
          source: {
            kind: "clawhub",
            authority: params.authority,
            mutable: false,
            network: true,
          },
          requestedSpecifier: `clawhub:${formatClawHubSkillRef(params)}@${params.version}`,
        },
        rootMarkers: CLAWHUB_SKILL_ARCHIVE_ROOT_MARKERS,
      }),
  });
}
async function installGitHubResolution(params) {
  return await withExtractedArchiveRoot({
    archivePath: params.archivePath,
    tempDirPrefix: "openclaw-skill-clawhub-github-",
    timeoutMs: 12e4,
    onExtracted: async (repoRoot) =>
      await installExtractedSkillRoot({
        workspaceDir: params.workspaceDir,
        slug: params.slug,
        extractedRoot: resolveGitHubSkillSourceDir(repoRoot, params.sourcePath),
        mode: params.force ? "update" : "install",
        logger: params.logger,
        policy: {
          config: params.config,
          installId: "clawhub",
          origin: {
            type: "clawhub",
            registry: params.registry,
            slug: params.slug,
            ...(params.ownerHandle ? { ownerHandle: params.ownerHandle } : {}),
            version: params.commit,
            repo: params.repo,
            path: params.sourcePath,
            commit: params.commit,
          },
          source: {
            kind: "git",
            authority: params.authority,
            mutable: false,
            network: true,
          },
          requestedSpecifier: `clawhub:${formatClawHubSkillRef(params)}@${params.commit}`,
        },
        rootMarkers: CLAWHUB_SKILL_ARCHIVE_ROOT_MARKERS,
      }),
  });
}
function assertInstallResolutionAllowed(resolution) {
  if (!resolution.ok) {
    if (resolution.reason === "ambiguous_slug") {
      const message = resolution.message ? ` ${resolution.message}` : "";
      throw new Error(
        `Skill "${resolution.slug}" is ambiguous on ClawHub. Install an owner-qualified skill, for example: openclaw skills install @owner/${resolution.slug}.${message}`,
      );
    }
    throw new Error(resolution.message || `Skill "${resolution.slug}" is not installable.`);
  }
  if (resolution.installKind !== "github") return resolution;
  const commit = normalizeGitHubCommitSegment(resolution.github.commit)?.toLowerCase();
  if (!commit)
    throw new Error(
      `Skill "${resolution.slug}" resolved to a mutable or invalid GitHub source ref; expected a full 40-character commit SHA.`,
    );
  return {
    ...resolution,
    github: {
      ...resolution.github,
      commit,
    },
  };
}
async function ensureClawHubSkillTrustAcknowledged(params) {
  if (params.skipClawHubTrustCheck) return { ok: true };
  const result = await ensureClawHubPackageTrustAcknowledged({
    subject: {
      kind: "skill",
      packageName: params.slug,
      ...(params.ownerHandle ? { ownerHandle: params.ownerHandle } : {}),
    },
    version: params.version,
    baseUrl: params.baseUrl,
    acknowledgeClawHubRisk: params.acknowledgeClawHubRisk,
    onClawHubRisk: params.onClawHubRisk,
    logger: params.logger,
    mode: params.force ? "update" : "install",
  });
  return result.ok
    ? {
        ok: true,
        ...(result.warning ? { warning: result.warning } : {}),
      }
    : {
        ok: false,
        error: result.error,
        ...(result.code ? { code: result.code } : {}),
        ...(result.warning ? { warning: result.warning } : {}),
      };
}
async function performClawHubSkillInstall(params) {
  try {
    const targetDir = resolveWorkspaceSkillInstallDir(params.workspaceDir, params.slug);
    const registry = resolveClawHubBaseUrl(params.baseUrl);
    const clawhubAuthority = isDefaultClawHubBaseUrl(params.baseUrl) ? "openclaw" : "third-party";
    if (!params.force && (await pathExists(targetDir)))
      return {
        ok: false,
        error: `Skill already exists at ${targetDir}. Re-run with force/update.`,
      };
    let version;
    let detail;
    let latestResolution;
    let install;
    let trustWarning;
    let officialClawHubSkill = false;
    let archive;
    if (params.version) {
      const resolved = await resolveInstallVersion({
        slug: params.slug,
        ...(params.ownerHandle ? { ownerHandle: params.ownerHandle } : {}),
        version: params.version,
        baseUrl: params.baseUrl,
      });
      detail = resolved.detail;
      version = resolved.version;
      officialClawHubSkill = isDefaultOfficialClawHubSkillSource({
        baseUrl: params.baseUrl,
        detail,
      });
      const trust = await ensureClawHubSkillTrustAcknowledged({
        ...params,
        version,
        skipClawHubTrustCheck: officialClawHubSkill,
      });
      if (!trust.ok)
        return {
          ...trust,
          version,
        };
      trustWarning = trust.warning;
      params.logger?.info?.(`Downloading ${params.slug}@${version} from ClawHub…`);
      archive = await downloadClawHubSkillArchive({
        slug: params.slug,
        ...(params.ownerHandle ? { ownerHandle: params.ownerHandle } : {}),
        version,
        baseUrl: params.baseUrl,
      });
    } else {
      latestResolution = assertInstallResolutionAllowed(
        await fetchClawHubSkillInstallResolution({
          slug: params.slug,
          ...(params.ownerHandle ? { ownerHandle: params.ownerHandle } : {}),
          baseUrl: params.baseUrl,
          ...(params.forceInstall ? { forceInstall: true } : {}),
        }),
      );
      detail = isDefaultOfficialClawHubSkillSource({
        baseUrl: params.baseUrl,
        resolution: latestResolution,
      })
        ? void 0
        : await fetchDefaultClawHubSkillDetailIfOfficial({
            baseUrl: params.baseUrl,
            slug: params.slug,
            ...(params.ownerHandle ? { ownerHandle: params.ownerHandle } : {}),
          });
      if (latestResolution.installKind === "github") {
        version = latestResolution.github.commit;
        officialClawHubSkill = isDefaultOfficialClawHubSkillSource({
          baseUrl: params.baseUrl,
          detail,
          resolution: latestResolution,
        });
        params.logger?.info?.(`Downloading ${params.slug}@${version} from GitHub…`);
        archive = await downloadClawHubGitHubSkillArchive({
          repo: latestResolution.github.repo,
          commit: latestResolution.github.commit,
        });
      } else {
        version = latestResolution.archive.version;
        officialClawHubSkill = isDefaultOfficialClawHubSkillSource({
          baseUrl: params.baseUrl,
          detail,
          resolution: latestResolution,
        });
        const trust = await ensureClawHubSkillTrustAcknowledged({
          ...params,
          version,
          skipClawHubTrustCheck: officialClawHubSkill,
        });
        if (!trust.ok)
          return {
            ...trust,
            version,
          };
        trustWarning = trust.warning;
        params.logger?.info?.(`Downloading ${params.slug}@${version} from ClawHub…`);
        archive = await downloadClawHubSkillArchiveUrl({
          url: latestResolution.archive.downloadUrl,
          baseUrl: params.baseUrl,
        });
      }
    }
    try {
      if (!params.version) {
        if (!latestResolution) throw new Error(`Skill "${params.slug}" has no install resolution.`);
        install =
          latestResolution.installKind === "github"
            ? await installGitHubResolution({
                workspaceDir: params.workspaceDir,
                slug: params.slug,
                ...(params.ownerHandle ? { ownerHandle: params.ownerHandle } : {}),
                sourcePath: latestResolution.github.path,
                archivePath: archive.archivePath,
                registry,
                authority: officialClawHubSkill ? "official" : "third-party",
                repo: latestResolution.github.repo,
                commit: latestResolution.github.commit,
                force: params.force,
                logger: params.logger,
                config: params.config,
              })
            : await installArchiveResolution({
                workspaceDir: params.workspaceDir,
                slug: params.slug,
                ...(params.ownerHandle ? { ownerHandle: params.ownerHandle } : {}),
                version,
                archivePath: archive.archivePath,
                registry,
                authority: officialClawHubSkill ? "official" : clawhubAuthority,
                force: params.force,
                logger: params.logger,
                config: params.config,
              });
      } else
        install = await installArchiveResolution({
          workspaceDir: params.workspaceDir,
          slug: params.slug,
          ...(params.ownerHandle ? { ownerHandle: params.ownerHandle } : {}),
          version,
          archivePath: archive.archivePath,
          registry,
          authority: officialClawHubSkill ? "official" : clawhubAuthority,
          force: params.force,
          logger: params.logger,
          config: params.config,
        });
      if (!install.ok)
        return {
          ok: false,
          error: install.error,
        };
      const installedAt = Date.now();
      const artifact = buildDownloadedArtifactLock(archive);
      const verificationVersion =
        latestResolution?.installKind === "github" && !params.version ? void 0 : version;
      const [skillFile, verification] = await Promise.all([
        readInstalledSkillFileLock(install.targetDir),
        fetchInstallVerificationLock({
          slug: params.slug,
          ...(params.ownerHandle ? { ownerHandle: params.ownerHandle } : {}),
          version: verificationVersion,
          baseUrl: params.baseUrl,
        }),
      ]);
      const sourceUrl =
        readInstallResolutionSourceUrl(latestResolution) ??
        readVerifiedClawHubSkillSourceUrl(verification?.provenance);
      await writeClawHubSkillOrigin(install.targetDir, {
        version: 1,
        registry: resolveClawHubBaseUrl(params.baseUrl),
        slug: params.slug,
        ...(params.ownerHandle ? { ownerHandle: params.ownerHandle } : {}),
        installedVersion: version,
        installedAt,
        ...(sourceUrl ? { sourceUrl } : {}),
        artifact,
        ...(skillFile ? { skillFile } : {}),
      });
      const lock = await readClawHubSkillsLockfile(params.workspaceDir);
      lock.skills[params.slug] = {
        version,
        installedAt,
        registry: resolveClawHubBaseUrl(params.baseUrl),
        ...(params.ownerHandle ? { ownerHandle: params.ownerHandle } : {}),
        ...(sourceUrl ? { sourceUrl } : {}),
        artifact,
        ...(skillFile ? { skillFile } : {}),
        ...(verification ? { verification } : {}),
      };
      await writeClawHubSkillsLockfile(params.workspaceDir, lock);
      await reportClawHubSkillInstallTelemetry({
        baseUrl: params.baseUrl,
        slug: params.slug,
        ...(params.ownerHandle ? { ownerHandle: params.ownerHandle } : {}),
        version,
      }).catch(() => void 0);
      return {
        ok: true,
        slug: params.slug,
        version,
        targetDir: install.targetDir,
        ...(detail ? { detail } : {}),
        ...(trustWarning ? { warning: trustWarning } : {}),
      };
    } finally {
      await archive.cleanup().catch(() => void 0);
    }
  } catch (err) {
    return {
      ok: false,
      error: formatErrorMessage(err),
    };
  }
}
async function installRequestedSkillFromClawHub(params) {
  try {
    const ref = parseRequestedClawHubSkillRef(params.slug);
    return await performClawHubSkillInstall({
      ...params,
      slug: ref.slug,
      ...(ref.ownerHandle ? { ownerHandle: ref.ownerHandle } : {}),
    });
  } catch (err) {
    return {
      ok: false,
      error: formatErrorMessage(err),
    };
  }
}
async function installTrackedSkillFromClawHub(params) {
  try {
    return await performClawHubSkillInstall({
      ...params,
      slug: normalizeTrackedSkillSlug(params.slug),
    });
  } catch (err) {
    return {
      ok: false,
      error: formatErrorMessage(err),
    };
  }
}
async function resolveTrackedUpdateTarget(params) {
  const origin =
    (await readClawHubSkillOrigin(
      resolveWorkspaceSkillInstallDir(params.workspaceDir, params.slug),
    )) ?? null;
  if (!origin && !params.lock.skills[params.slug])
    return {
      ok: false,
      slug: params.slug,
      error: `Skill "${params.slug}" is not tracked as a ClawHub install.`,
    };
  const lockEntry = params.lock.skills[params.slug];
  const ownerHandle = origin?.ownerHandle ?? lockEntry?.ownerHandle;
  return {
    ok: true,
    slug: params.slug,
    ...(ownerHandle ? { ownerHandle } : {}),
    baseUrl: origin?.registry ?? params.baseUrl,
    previousVersion: origin?.installedVersion ?? lockEntry?.version ?? null,
  };
}
async function installSkillFromClawHub(params) {
  return await installRequestedSkillFromClawHub(params);
}
async function updateSkillsFromClawHub(params) {
  const lock = await readClawHubSkillsLockfile(params.workspaceDir);
  const slugs = params.slug
    ? [
        await resolveRequestedUpdateSlug({
          workspaceDir: params.workspaceDir,
          requestedSlug: params.slug,
          lock,
        }),
      ]
    : Object.keys(lock.skills).map((slug) => normalizeTrackedSkillSlug(slug));
  const results = [];
  for (const slug of slugs) {
    const tracked = await resolveTrackedUpdateTarget({
      workspaceDir: params.workspaceDir,
      slug,
      lock,
      baseUrl: params.baseUrl,
    });
    if (!tracked.ok) {
      results.push({
        ok: false,
        error: tracked.error,
      });
      continue;
    }
    const install = await installTrackedSkillFromClawHub({
      workspaceDir: params.workspaceDir,
      slug: tracked.slug,
      ...(tracked.ownerHandle ? { ownerHandle: tracked.ownerHandle } : {}),
      baseUrl: tracked.baseUrl,
      force: true,
      forceInstall: params.forceInstall,
      acknowledgeClawHubRisk: params.acknowledgeClawHubRisk,
      onClawHubRisk: params.onClawHubRisk,
      logger: params.logger,
      config: params.config,
    });
    if (!install.ok) {
      results.push(install);
      continue;
    }
    results.push({
      ok: true,
      slug: tracked.slug,
      previousVersion: tracked.previousVersion,
      version: install.version,
      changed: tracked.previousVersion !== install.version,
      targetDir: install.targetDir,
      ...(install.warning ? { warning: install.warning } : {}),
    });
  }
  return results;
}
async function readTrackedClawHubSkillSlugs(workspaceDir) {
  const lock = await readClawHubSkillsLockfile(workspaceDir);
  return Object.keys(lock.skills).toSorted();
}
async function untrackClawHubSkill(workspaceDir, slug) {
  const trackedSlug = normalizeTrackedSkillSlug(slug);
  const lock = await readClawHubSkillsLockfile(workspaceDir);
  if (!lock.skills[trackedSlug]) return;
  delete lock.skills[trackedSlug];
  await writeClawHubSkillsLockfile(workspaceDir, lock);
}
//#endregion
//#region src/skills/loading/bundled-context.ts
const skillsLogger = createSubsystemLogger("skills");
let hasWarnedMissingBundledDir = false;
let cachedBundledContext = null;
function resolveBundledSkillsContext(opts = {}) {
  const dir = resolveBundledSkillsDir(opts);
  const names = /* @__PURE__ */ new Set();
  if (!dir) {
    if (!hasWarnedMissingBundledDir) {
      hasWarnedMissingBundledDir = true;
      skillsLogger.warn(
        "Bundled skills directory could not be resolved; built-in skills may be missing.",
      );
    }
    return {
      dir,
      names,
    };
  }
  if (cachedBundledContext?.dir === dir)
    return {
      dir,
      names: new Set(cachedBundledContext.names),
    };
  const result = loadSkillsFromDirSafe({
    dir,
    source: "openclaw-bundled",
  });
  for (const skill of result.skills) if (skill.name.trim()) names.add(skill.name);
  cachedBundledContext = {
    dir,
    names: new Set(names),
  };
  return {
    dir,
    names,
  };
}
//#endregion
//#region src/skills/discovery/status.ts
function resolveSkillStatusEntry(skills, requestedName) {
  const raw = requestedName.trim();
  if (!raw) return null;
  const lower = raw.toLowerCase();
  const normalized = normalizeSkillIndexName(raw);
  let caseInsensitiveMatch = null;
  let caseInsensitiveMatches = 0;
  let normalizedMatch = null;
  let normalizedMatches = 0;
  for (const skill of skills) {
    if (skill.name === raw || skill.skillKey === raw) return skill;
    const nameLower = skill.name.toLowerCase();
    const keyLower = skill.skillKey.toLowerCase();
    if (nameLower === lower || keyLower === lower) {
      caseInsensitiveMatch = skill;
      caseInsensitiveMatches += 1;
      continue;
    }
    if (
      normalized &&
      (normalizeSkillIndexName(skill.name) === normalized ||
        normalizeSkillIndexName(skill.skillKey) === normalized)
    ) {
      normalizedMatch = skill;
      normalizedMatches += 1;
    }
  }
  if (caseInsensitiveMatches > 1) return null;
  if (caseInsensitiveMatches === 1) return caseInsensitiveMatch;
  if (normalizedMatches === 1) return normalizedMatch;
  return null;
}
function selectPreferredInstallSpec(install, prefs) {
  if (install.length === 0) return;
  const indexed = install.map((spec, index) => ({
    spec,
    index,
  }));
  const findKind = (kind) => indexed.find((item) => item.spec.kind === kind);
  const brewSpec = findKind("brew");
  const nodeSpec = findKind("node");
  const goSpec = findKind("go");
  const uvSpec = findKind("uv");
  const downloadSpec = findKind("download");
  const brewAvailable = hasBinary("brew");
  const pickers = [
    () => (prefs.preferBrew && brewAvailable ? brewSpec : void 0),
    () => uvSpec,
    () => nodeSpec,
    () => (brewAvailable ? brewSpec : void 0),
    () => goSpec,
    () => downloadSpec,
    () => brewSpec,
    () => indexed[0],
  ];
  for (const pick of pickers) {
    const selected = pick();
    if (selected) return selected;
  }
}
function normalizeInstallOptions(entry, prefs) {
  const requiredOs = entry.metadata?.os ?? [];
  if (requiredOs.length > 0 && !requiredOs.includes(process.platform)) return [];
  const install = entry.metadata?.install ?? [];
  if (install.length === 0) return [];
  const platform = process.platform;
  const filtered = install.filter((spec) => {
    const osList = spec.os ?? [];
    return osList.length === 0 || osList.includes(platform);
  });
  if (filtered.length === 0) return [];
  const toOption = (spec, index) => {
    const id = (spec.id ?? `${spec.kind}-${index}`).trim();
    const bins = spec.bins ?? [];
    let label = (spec.label ?? "").trim();
    if (spec.kind === "node" && spec.package)
      label = `Install ${spec.package} (${prefs.nodeManager})`;
    if (!label)
      if (spec.kind === "brew" && spec.formula) label = `Install ${spec.formula} (brew)`;
      else if (spec.kind === "node" && spec.package)
        label = `Install ${spec.package} (${prefs.nodeManager})`;
      else if (spec.kind === "go" && spec.module) label = `Install ${spec.module} (go)`;
      else if (spec.kind === "uv" && spec.package) label = `Install ${spec.package} (uv)`;
      else if (spec.kind === "download" && spec.url) {
        const url = spec.url.trim();
        const last = url.split("/").pop();
        label = `Download ${last && last.length > 0 ? last : url}`;
      } else label = "Run installer";
    return {
      id,
      kind: spec.kind,
      label,
      bins,
    };
  };
  if (filtered.every((spec) => spec.kind === "download"))
    return filtered.map((spec, index) => toOption(spec, index));
  const preferred = selectPreferredInstallSpec(filtered, prefs);
  if (!preferred) return [];
  return [toOption(preferred.spec, preferred.index)];
}
function buildSkillStatus(indexed, context) {
  const entry = indexed.entry;
  const skillKey = indexed.skillKey;
  const { config, prefs, eligibility, allowBundled, agentSkillFilter, workspaceDir } = context;
  const skillConfig = resolveSkillConfig(config, skillKey);
  const disabled = skillConfig?.enabled === false;
  const blockedByAllowlist = !isBundledSkillAllowed(entry, allowBundled);
  const blockedByAgentFilter = agentSkillFilter !== void 0 && !indexed.agentAllowed;
  const always = entry.metadata?.always === true;
  const isEnvSatisfied = (envName) =>
    Boolean(
      process.env[envName] ||
      skillConfig?.env?.[envName] ||
      (skillConfig?.apiKey && entry.metadata?.primaryEnv === envName),
    );
  const isConfigSatisfied = (pathStr) => isSkillConfigPathTruthy(config, pathStr);
  const skillSource = indexed.source;
  const bundled = indexed.bundled;
  const { emoji, homepage, required, missing, requirementsSatisfied, configChecks } =
    evaluateEntryRequirementsForCurrentPlatform({
      always,
      entry,
      hasLocalBin: hasBinary,
      remote: eligibility?.remote,
      isEnvSatisfied,
      isConfigSatisfied,
    });
  const eligible = !disabled && !blockedByAllowlist && requirementsSatisfied;
  const platformIncompatible = missing.os.length > 0;
  const availableToAgent = eligible && !blockedByAgentFilter;
  const userInvocable = indexed.userInvocable;
  const isGlobalManagedSkill = !bundled && skillSource === "openclaw-managed";
  const clawhub =
    workspaceDir && !bundled
      ? resolveClawHubSkillStatusLinkSync({
          workspaceDir: isGlobalManagedSkill
            ? path.dirname(path.resolve(context.managedSkillsDir))
            : workspaceDir,
          skillDir: entry.skill.baseDir,
          skillKey,
          lockRead: isGlobalManagedSkill ? context.managedLockRead : context.clawhubLockRead,
          lockfileScope: isGlobalManagedSkill ? "managed" : "workspace",
        })
      : void 0;
  const skillCard = resolveLocalSkillCardStatusSync(entry.skill.baseDir);
  return {
    name: entry.skill.name,
    description: entry.skill.description,
    source: skillSource,
    bundled,
    filePath: entry.skill.filePath,
    baseDir: entry.skill.baseDir,
    skillKey,
    primaryEnv: entry.metadata?.primaryEnv,
    emoji,
    homepage,
    always,
    disabled,
    blockedByAllowlist,
    blockedByAgentFilter,
    eligible,
    platformIncompatible,
    modelVisible: availableToAgent && indexed.promptVisible,
    userInvocable,
    commandVisible: availableToAgent && userInvocable,
    requirements: required,
    missing,
    configChecks,
    install: normalizeInstallOptions(entry, prefs),
    ...(clawhub ? { clawhub } : {}),
    ...(skillCard ? { skillCard } : {}),
  };
}
function buildWorkspaceSkillStatus(workspaceDir, opts) {
  const managedSkillsDir = opts?.managedSkillsDir ?? path.join(CONFIG_DIR, "skills");
  const bundledContext = resolveBundledSkillsContext();
  const agentSkillFilter = opts?.agentId
    ? resolveEffectiveAgentSkillFilter(opts.config, opts.agentId)
    : void 0;
  const skillEntries = mergeRemoteNodeSkillEntries(
    opts?.entries ??
      loadWorkspaceSkillEntries(workspaceDir, {
        config: opts?.config,
        managedSkillsDir,
        bundledSkillsDir: bundledContext.dir,
        includeArchived: true,
      }),
    {
      canExec: opts?.eligibility?.nodeSkills?.canExec,
      node: opts?.eligibility?.nodeSkills?.node,
    },
  );
  const prefs = resolveSkillsInstallPreferences(opts?.config);
  const allowBundled = resolveBundledAllowlist(opts?.config);
  const clawhubLockRead = readClawHubSkillsLockfileStatusSync(workspaceDir);
  const managedParentDir = path.dirname(path.resolve(managedSkillsDir));
  const managedLockRead =
    managedParentDir === path.resolve(workspaceDir)
      ? clawhubLockRead
      : readClawHubSkillsLockfileStatusSync(managedParentDir);
  const skillIndexEntries = buildSkillIndexEntries(skillEntries, {
    bundledNames: bundledContext.names,
    agentSkillFilter,
  });
  return {
    workspaceDir,
    managedSkillsDir,
    agentId: opts?.agentId,
    agentSkillFilter,
    skills: skillIndexEntries.map((entry) =>
      buildSkillStatus(entry, {
        config: opts?.config,
        prefs,
        eligibility: opts?.eligibility,
        allowBundled,
        agentSkillFilter,
        workspaceDir,
        clawhubLockRead,
        managedSkillsDir,
        managedLockRead,
      }),
    ),
  };
}
//#endregion
export {
  readTrackedClawHubSkillSlugs as a,
  searchSkillsFromClawHub as c,
  installExtractedSkillRoot as d,
  installSkillArchiveFromPath as f,
  readLocalSkillCardContentSync as i,
  untrackClawHubSkill as l,
  evaluateEntryRequirementsForCurrentPlatform as m,
  resolveSkillStatusEntry as n,
  readVerifiedClawHubSkillSourceUrl as o,
  validateRequestedSkillSlug as p,
  installSkillFromClawHub as r,
  resolveClawHubSkillVerificationTarget as s,
  buildWorkspaceSkillStatus as t,
  updateSkillsFromClawHub as u,
};
