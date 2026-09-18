import { createHash, randomBytes, randomUUID } from "node:crypto";
import { constants } from "node:fs";
import fs$1 from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { r as runCommandWithTimeout } from "./exec-CXKmx4dL.js";
import {
  a as listGitWorktrees,
  c as requireGit,
  l as requireGitRaw,
  o as pathExists,
  s as removeEmptyParents,
  t as commandError,
  u as runGit,
} from "./git-CvJkUhVJ.js";
import { y as resolveStateDir } from "./paths-DEklnbzU.js";
import {
  _ as unlockWorktree,
  a as hasLiveWorktreeRunLease,
  c as findLiveRegistryWorktreeByOwner,
  d as getRegistryWorktree,
  f as insertRegistryWorktree,
  g as lockWorktreeForProcess,
  h as lockState,
  i as finalizeWorktreeRemoval,
  l as findLiveRegistryWorktreeByPath,
  m as updateRegistryWorktree,
  p as listRegistryWorktrees,
  r as claimWorktreeRemoval,
  s as deleteRegistryWorktree,
  t as abortWorktreeRemoval,
  u as findRegistryWorktreeByPath,
} from "./run-lease-BVSgrlR2.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
//#region src/agents/worktrees/base-ref.ts
async function resolveWorktreeBase(repoRoot, baseRef) {
  if (baseRef) {
    let gitOperand = baseRef;
    if (baseRef !== "-" && baseRef.startsWith("-")) {
      const symbolic = await runGit(repoRoot, [
        "-c",
        "core.warnAmbiguousRefs=true",
        "rev-parse",
        "--symbolic-full-name",
        "--verify",
        "--end-of-options",
        baseRef,
      ]);
      const fullRef = symbolic.stdout.trim();
      if (symbolic.code !== 0)
        throw commandError("git rev-parse --symbolic-full-name --verify", symbolic);
      if (fullRef) {
        if (!fullRef.startsWith("refs/") || fullRef.includes("\n"))
          throw commandError("git rev-parse --symbolic-full-name --verify", symbolic);
        gitOperand = fullRef;
      } else {
        if (symbolic.stderr.trim())
          throw commandError("git rev-parse --symbolic-full-name --verify", symbolic);
        gitOperand = await requireGit(repoRoot, [
          "rev-parse",
          "--verify",
          "--end-of-options",
          `${baseRef}^{commit}`,
        ]);
      }
    }
    return {
      gitOperand,
      recordRef: baseRef,
      remote: false,
    };
  }
  if ((await runGit(repoRoot, ["fetch", "origin"])).code === 0) {
    const remoteHead = await runGit(repoRoot, [
      "symbolic-ref",
      "--quiet",
      "--short",
      "refs/remotes/origin/HEAD",
    ]);
    if (remoteHead.code === 0 && remoteHead.stdout.trim()) {
      const remoteRef = remoteHead.stdout.trim();
      return {
        gitOperand: remoteRef,
        recordRef: remoteRef,
        remote: true,
      };
    }
  }
  return {
    gitOperand: "HEAD",
    recordRef: "HEAD",
    remote: false,
  };
}
//#endregion
//#region src/agents/worktrees/owner.ts
function worktreeOwnerMatches(record, params) {
  return (
    record.ownerKind === (params.ownerKind ?? "manual") &&
    (record.ownerId ?? void 0) === (params.ownerId ?? void 0)
  );
}
//#endregion
//#region src/agents/worktrees/service.ts
const IDLE_GC_MS = 10080 * 60 * 1e3;
const SNAPSHOT_RETENTION_MS = 720 * 60 * 60 * 1e3;
const WORKTREE_GC_INTERVAL_MS = 3600 * 1e3;
const NAME_PATTERN = /^[a-z0-9][a-z0-9-]{0,63}$/;
/** Non-forced removal aborted because the safety snapshot failed. */
var WorktreeSnapshotError = class extends Error {
  constructor(snapshotError, options) {
    super(`worktree snapshot failed; removal aborted: ${snapshotError}`, options);
    this.snapshotError = snapshotError;
  }
};
const SNAPSHOT_REF_PREFIX = "refs/openclaw/snapshots";
const log = createSubsystemLogger("agents/worktrees");
/**
 * Maps `worktrees.cleanup` config into enforceable byte/count limits.
 * 0 and unset both mean "no limit", so gc callers can pass the result verbatim.
 */
function resolveWorktreeCleanupLimits(config) {
  const maxCount = config?.cleanup?.maxCount;
  const maxTotalSizeGb = config?.cleanup?.maxTotalSizeGb;
  return {
    ...(typeof maxCount === "number" && maxCount > 0 ? { maxCount: Math.floor(maxCount) } : {}),
    ...(typeof maxTotalSizeGb === "number" && maxTotalSizeGb > 0
      ? { maxTotalSizeBytes: Math.round(maxTotalSizeGb * 1024 ** 3) }
      : {}),
  };
}
function resultMessage(result) {
  return (result.stderr || result.stdout).trim().split("\n").slice(-12).join("\n");
}
function validateName(name) {
  if (!NAME_PATTERN.test(name)) throw new Error("worktree name must match [a-z0-9][a-z0-9-]{0,63}");
  return name;
}
function generateName() {
  return `wt-${randomBytes(4).toString("hex")}`;
}
async function resolveRepository(repoRoot) {
  const rootResult = await runGit(
    await fs$1.realpath(repoRoot).catch(() => {
      throw new Error(`repository does not exist: ${repoRoot}`);
    }),
    ["rev-parse", "--show-toplevel"],
  );
  if (rootResult.code !== 0) throw new Error(`not a git checkout: ${repoRoot}`);
  const sourceRoot = await fs$1.realpath(rootResult.stdout.trim());
  const commonRaw = await requireGit(sourceRoot, ["rev-parse", "--git-common-dir"]);
  const commonDir = await fs$1.realpath(
    path.isAbsolute(commonRaw) ? commonRaw : path.resolve(sourceRoot, commonRaw),
  );
  const primary = (await listGitWorktrees(sourceRoot))[0]?.path ?? sourceRoot;
  const canonicalRoot = await fs$1.realpath(primary);
  const origin = await runGit(canonicalRoot, ["config", "--get", "remote.origin.url"]);
  const originUrl = origin.code === 0 ? origin.stdout.trim() : "";
  return {
    repoRoot: canonicalRoot,
    sourceRoot,
    commonDir,
    originUrl,
    fingerprint: createHash("sha256")
      .update(`${commonDir}\n${originUrl}`)
      .digest("hex")
      .slice(0, 16),
  };
}
async function ensureNoSymlinkDirectory(root, relativePath) {
  const segments = relativePath.split(/[\\/]/).filter(Boolean);
  let current = root;
  for (const segment of segments.slice(0, -1)) {
    current = path.join(current, segment);
    try {
      const stat = await fs$1.lstat(current);
      if (stat.isSymbolicLink() || !stat.isDirectory()) return false;
    } catch (error) {
      if (error.code === "ENOENT") continue;
      throw error;
    }
  }
  return true;
}
async function copyIncludedFiles(repoRoot, worktreePath) {
  const includePath = path.join(repoRoot, ".worktreeinclude");
  if (!(await pathExists(includePath))) return;
  const candidatesRaw = await requireGitRaw(repoRoot, [
    "ls-files",
    "--others",
    "--ignored",
    "--exclude-standard",
    "-z",
  ]);
  const includedRaw = await requireGitRaw(repoRoot, [
    "ls-files",
    "--others",
    "--ignored",
    `--exclude-from=${includePath}`,
    "-z",
  ]);
  const included = new Set(includedRaw.split("\0").filter(Boolean));
  for (const relativePath of candidatesRaw.split("\0").filter(Boolean)) {
    if (!included.has(relativePath) || path.isAbsolute(relativePath)) continue;
    const normalized = path.normalize(relativePath);
    if (normalized === ".." || normalized.startsWith(`..${path.sep}`)) continue;
    if (
      !(await ensureNoSymlinkDirectory(repoRoot, normalized)) ||
      !(await ensureNoSymlinkDirectory(worktreePath, normalized))
    )
      continue;
    const source = path.join(repoRoot, normalized);
    const destination = path.join(worktreePath, normalized);
    const sourceStat = await fs$1.lstat(source).catch(() => void 0);
    if (!sourceStat?.isFile() || sourceStat.isSymbolicLink()) continue;
    await fs$1.mkdir(path.dirname(destination), { recursive: true });
    await fs$1.copyFile(source, destination, constants.COPYFILE_EXCL).catch((error) => {
      if (error.code !== "EEXIST") throw error;
    });
    await fs$1.chmod(destination, sourceStat.mode);
  }
}
async function cleanupFailedCreate(repoRoot, worktreePath, branch) {
  const removed = await runGit(repoRoot, ["worktree", "remove", "--force", worktreePath]);
  const deletedBranch = await runGit(repoRoot, ["branch", "-D", branch]);
  await runGit(repoRoot, ["worktree", "prune"]);
  if (removed.code !== 0 || deletedBranch.code !== 0)
    throw new Error(
      `failed to clean up worktree creation: ${resultMessage(removed) || resultMessage(deletedBranch)}`,
    );
}
async function resetFailedWorktreeAdd(repoRoot, worktreePath, branch) {
  if (
    (await listGitWorktrees(repoRoot)).some(
      (entry) => path.resolve(entry.path) === path.resolve(worktreePath),
    )
  ) {
    const removed = await runGit(repoRoot, ["worktree", "remove", "--force", worktreePath]);
    if (removed.code !== 0) throw commandError("git worktree remove", removed);
  } else if (await pathExists(worktreePath))
    await fs$1.rm(worktreePath, {
      recursive: true,
      force: true,
    });
  if (
    (await runGit(repoRoot, ["show-ref", "--quiet", "--verify", `refs/heads/${branch}`])).code === 0
  )
    await requireGit(repoRoot, ["branch", "-D", branch]);
  await requireGit(repoRoot, ["worktree", "prune"]);
}
async function canResetFailedWorktreeAdd(repoRoot, worktreePath, branch, failure) {
  const message = resultMessage(failure);
  const createdBranch = message.includes(`Preparing worktree (new branch '${branch}')`);
  if (message.includes("unable to checkout working tree") || createdBranch) return true;
  if (
    (await listGitWorktrees(repoRoot)).some(
      (entry) => path.resolve(entry.path) === path.resolve(worktreePath),
    ) ||
    (await pathExists(worktreePath))
  )
    return false;
  return (
    (await runGit(repoRoot, ["show-ref", "--quiet", "--verify", `refs/heads/${branch}`])).code === 1
  );
}
async function runSetupScript(repoRoot, worktreePath) {
  const setupScript = path.join(repoRoot, ".openclaw", "worktree-setup.sh");
  const stat = await fs$1.stat(setupScript).catch(() => void 0);
  if (!stat?.isFile() || (stat.mode & 73) === 0) return;
  const result = await runCommandWithTimeout([setupScript], {
    timeoutMs: 12e4,
    cwd: worktreePath,
    env: {
      OPENCLAW_SOURCE_TREE_PATH: repoRoot,
      OPENCLAW_WORKTREE_PATH: worktreePath,
    },
  });
  if (result.code !== 0)
    throw new Error(
      `worktree setup failed${resultMessage(result) ? `:\n${resultMessage(result)}` : ""}`,
    );
}
function isMissingFileError(error) {
  return error.code === "ENOENT";
}
/**
 * Sums file sizes without following symlinks, so a link cannot inflate or escape
 * the worktree. Only ENOENT is tolerated (cleanup races with removals); other
 * failures propagate so an unreadable tree is never measured as zero bytes.
 */
async function directorySizeBytes(root) {
  let entries;
  try {
    entries = await fs$1.readdir(root, { withFileTypes: true });
  } catch (error) {
    if (isMissingFileError(error)) return 0;
    throw error;
  }
  let total = 0;
  for (const entry of entries) {
    const child = path.join(root, entry.name);
    if (entry.isDirectory() && !entry.isSymbolicLink()) total += await directorySizeBytes(child);
    else
      try {
        total += (await fs$1.lstat(child)).size;
      } catch (error) {
        if (!isMissingFileError(error)) throw error;
      }
  }
  return total;
}
async function snapshotWorktree(record, reason) {
  const tempDir = await fs$1.mkdtemp(path.join(os.tmpdir(), "openclaw-worktree-index-"));
  const indexPath = path.join(tempDir, "index");
  const snapshotRef = `${SNAPSHOT_REF_PREFIX}/${record.id}`;
  const env = {
    GIT_INDEX_FILE: indexPath,
    GIT_AUTHOR_NAME: "OpenClaw",
    GIT_AUTHOR_EMAIL: "openclaw@localhost",
    GIT_COMMITTER_NAME: "OpenClaw",
    GIT_COMMITTER_EMAIL: "openclaw@localhost",
  };
  try {
    await requireGit(record.path, ["read-tree", "HEAD"], { env });
    await requireGit(record.path, ["add", "-A"], { env });
    const tree = await requireGit(record.path, ["write-tree"], { env });
    if (
      (await requireGit(record.path, ["ls-tree", "-r", tree]))
        .split("\n")
        .some((entry) => entry.startsWith("160000 "))
    )
      throw new Error("nested git repositories cannot be snapshotted losslessly");
    const parent = await requireGit(record.path, ["rev-parse", "HEAD"]);
    const commit = await requireGit(
      record.path,
      ["commit-tree", tree, "-p", parent, "-m", `OpenClaw worktree snapshot: ${reason}`],
      { env },
    );
    await requireGit(record.repoRoot, ["update-ref", snapshotRef, commit]);
    return snapshotRef;
  } finally {
    await fs$1.rm(tempDir, {
      recursive: true,
      force: true,
    });
  }
}
var ManagedWorktreeService = class {
  constructor(options = {}) {
    this.env = options.env ?? process.env;
    this.now = options.now ?? Date.now;
  }
  async create(params) {
    const repository = await resolveRepository(params.repoRoot);
    const name = validateName(params.name ?? generateName());
    const root = path.join(resolveStateDir(this.env), "worktrees", repository.fingerprint);
    const worktreePath = path.join(root, name);
    const existing = findRegistryWorktreeByPath(this.env, worktreePath);
    if (existing?.name === name && !existing.removedAt && !worktreeOwnerMatches(existing, params))
      throw new Error(
        `worktree name is already in use by ${existing.ownerKind}${existing.ownerId ? ` ${existing.ownerId}` : ""}: ${name}`,
      );
    if (existing?.name === name && existing.removedAt === void 0) {
      if (await pathExists(existing.path)) return existing;
      updateRegistryWorktree(this.env, existing.id, { removedAt: this.now() });
    }
    if (existing?.name === name && existing.removedAt !== void 0 && existing.snapshotRef) {
      if (!worktreeOwnerMatches(existing, params))
        throw new Error(
          `worktree name is already in use by ${existing.ownerKind}${existing.ownerId ? ` ${existing.ownerId}` : ""}: ${name}`,
        );
      return await this.restore({ id: existing.id });
    }
    const branch = `openclaw/${name}`;
    const branchExists = await runGit(repository.repoRoot, [
      "show-ref",
      "--quiet",
      "--verify",
      `refs/heads/${branch}`,
    ]);
    if (branchExists.code === 0) throw new Error(`branch already exists: ${branch}`);
    if (branchExists.code !== 1) throw commandError("git show-ref --verify", branchExists);
    const base = await resolveWorktreeBase(repository.repoRoot, params.baseRef);
    await fs$1.mkdir(root, { recursive: true });
    let gitBase = base.gitOperand;
    let recordBase = base.recordRef;
    const runRepositorySetup = params.runSetupScript !== false;
    const worktreeAddArgs = () => [
      ...(runRepositorySetup ? [] : ["-c", `core.hooksPath=${os.devNull}`]),
      "worktree",
      "add",
      "-b",
      branch,
      "--",
      worktreePath,
      gitBase,
    ];
    let added = await runGit(repository.repoRoot, worktreeAddArgs());
    if (added.code !== 0 && base.remote) {
      if (!(await canResetFailedWorktreeAdd(repository.repoRoot, worktreePath, branch, added)))
        throw commandError("git worktree add", added);
      await resetFailedWorktreeAdd(repository.repoRoot, worktreePath, branch);
      gitBase = "HEAD";
      recordBase = "HEAD";
      added = await runGit(repository.repoRoot, worktreeAddArgs());
    }
    if (added.code !== 0) throw commandError("git worktree add", added);
    try {
      await copyIncludedFiles(repository.sourceRoot, worktreePath);
      if (runRepositorySetup) await runSetupScript(repository.sourceRoot, worktreePath);
    } catch (error) {
      try {
        await cleanupFailedCreate(repository.repoRoot, worktreePath, branch);
      } catch (cleanupError) {
        throw new Error(`${String(error)}\n${String(cleanupError)}`, { cause: cleanupError });
      }
      throw error;
    }
    const createdAt = this.now();
    const record = {
      id: randomUUID(),
      name,
      repoFingerprint: repository.fingerprint,
      repoRoot: repository.repoRoot,
      path: worktreePath,
      branch,
      baseRef: recordBase,
      ownerKind: params.ownerKind ?? "manual",
      ...(params.ownerId ? { ownerId: params.ownerId } : {}),
      createdAt,
      lastActiveAt: createdAt,
    };
    insertRegistryWorktree(this.env, record);
    return record;
  }
  async list() {
    const records = listRegistryWorktrees(this.env);
    for (const record of records)
      if (record.removedAt === void 0 && !(await pathExists(record.path))) {
        const removedAt = this.now();
        updateRegistryWorktree(this.env, record.id, { removedAt });
        record.removedAt = removedAt;
      }
    return records.filter((record) => record.removedAt === void 0 || record.snapshotRef);
  }
  findLiveByOwner(ownerKind, ownerId) {
    return findLiveRegistryWorktreeByOwner(this.env, ownerKind, ownerId);
  }
  /** Resolves the canonical registry root and the caller's own checkout root. */
  async resolveRepositoryPaths(repoRoot) {
    const resolved = await resolveRepository(repoRoot);
    return {
      canonicalRoot: resolved.repoRoot,
      sourceRoot: resolved.sourceRoot,
    };
  }
  /**
   * Lists selectable base refs for a repository without touching the network.
   * Base-ref pickers must stay snappy; resolveWorktreeBase() still fetches on create
   * when no explicit ref is chosen.
   */
  async listRepositoryBranches(repoRoot) {
    const repository = await resolveRepository(repoRoot);
    const branches = /* @__PURE__ */ new Map();
    const remoteRaw = await runGit(repository.repoRoot, [
      "for-each-ref",
      "--format=%(refname)",
      "refs/remotes",
    ]);
    if (remoteRaw.code === 0)
      for (const refname of remoteRaw.stdout.split("\n")) {
        const trimmed = refname.trim();
        if (!trimmed.startsWith("refs/remotes/")) continue;
        const withoutPrefix = trimmed.slice(13);
        const slash = withoutPrefix.indexOf("/");
        if (slash <= 0) continue;
        const shortName = withoutPrefix.slice(slash + 1);
        if (!shortName || shortName === "HEAD") continue;
        branches.set(shortName, {
          name: withoutPrefix,
          kind: "remote",
        });
      }
    const localRaw = await runGit(repository.repoRoot, [
      "for-each-ref",
      "--format=%(refname:short)",
      "refs/heads",
    ]);
    if (localRaw.code === 0)
      for (const line of localRaw.stdout.split("\n")) {
        const name = line.trim();
        if (name)
          branches.set(name, {
            name,
            kind: "local",
          });
      }
    const remoteHead = await runGit(repository.repoRoot, [
      "symbolic-ref",
      "--quiet",
      "--short",
      "refs/remotes/origin/HEAD",
    ]);
    const defaultShort =
      remoteHead.code === 0 ? remoteHead.stdout.trim().replace(/^origin\//, "") || void 0 : void 0;
    const head = await runGit(repository.repoRoot, ["symbolic-ref", "--quiet", "--short", "HEAD"]);
    const headBranch = head.code === 0 ? head.stdout.trim() || void 0 : void 0;
    const defaultBranch = defaultShort
      ? (branches.get(defaultShort)?.name ?? defaultShort)
      : void 0;
    const rank = (shortName) => (shortName === defaultShort ? 0 : shortName === headBranch ? 1 : 2);
    return {
      branches: [...branches.entries()]
        .toSorted(
          ([aShort, a], [bShort, b]) => rank(aShort) - rank(bShort) || a.name.localeCompare(b.name),
        )
        .map(([, branch]) => branch),
      ...(defaultBranch ? { defaultBranch } : {}),
      ...(headBranch ? { headBranch } : {}),
    };
  }
  async acquire(id) {
    const record = this.requireLiveRecord(id);
    await lockWorktreeForProcess(record);
    const lastActiveAt = this.now();
    updateRegistryWorktree(this.env, id, { lastActiveAt });
    return {
      ...record,
      lastActiveAt,
    };
  }
  async release(id) {
    const record = getRegistryWorktree(this.env, id);
    if (!record || record.removedAt !== void 0 || !(await pathExists(record.path))) return;
    const state = await lockState(record);
    if (state.kind === "live" && state.pid !== process.pid) return;
    if (state.kind === "foreign") return;
    if (state.kind !== "none") await unlockWorktree(record);
  }
  async remove(params) {
    const record = this.requireLiveRecord(params.id);
    const force = params.force ?? false;
    const claimToken = params.claimToken ?? randomUUID();
    claimWorktreeRemoval(this.env, {
      worktreeId: record.id,
      token: claimToken,
      force,
    });
    try {
      const state = await lockState(record);
      if ((state.kind === "live" || state.kind === "foreign") && !force)
        throw new Error(
          state.kind === "live"
            ? `worktree is locked by live OpenClaw pid ${state.pid}`
            : `worktree has a foreign lock${state.reason ? `: ${state.reason}` : ""}`,
        );
      if (state.kind !== "none")
        await requireGit(record.repoRoot, ["worktree", "unlock", record.path]);
      let snapshotRef = record.snapshotRef;
      let snapshotError;
      try {
        snapshotRef = await snapshotWorktree(record, params.reason);
        updateRegistryWorktree(this.env, record.id, { snapshotRef });
      } catch (error) {
        snapshotError = error instanceof Error ? error.message : String(error);
        if (!force) throw new WorktreeSnapshotError(snapshotError, { cause: error });
      }
      const removed = await runGit(record.repoRoot, ["worktree", "remove", "--force", record.path]);
      if (removed.code !== 0) throw commandError("git worktree remove", removed);
      const branchDelete = await runGit(record.repoRoot, ["branch", "-D", record.branch]);
      if (branchDelete.code !== 0) throw commandError("git branch -D", branchDelete);
      await requireGit(record.repoRoot, ["worktree", "prune"]);
      await removeEmptyParents(
        path.dirname(record.path),
        path.join(resolveStateDir(this.env), "worktrees"),
      );
      const removedAt = this.now();
      updateRegistryWorktree(this.env, record.id, {
        removedAt,
        snapshotRef,
      });
      finalizeWorktreeRemoval(this.env, record.id);
      return {
        removed: true,
        ...(snapshotRef ? { snapshotRef } : {}),
        ...(snapshotError ? { snapshotError } : {}),
      };
    } catch (error) {
      abortWorktreeRemoval(this.env, record.id, claimToken);
      throw error;
    }
  }
  async restore(params) {
    const record = getRegistryWorktree(this.env, params.id);
    if (!record?.snapshotRef || record.removedAt === void 0)
      throw new Error(`worktree ${params.id} is not restorable`);
    if (!(await pathExists(record.repoRoot)))
      throw new Error(`source repository no longer exists: ${record.repoRoot}`);
    const parent = await requireGit(record.repoRoot, ["rev-parse", `${record.snapshotRef}^`]);
    await fs$1.mkdir(path.dirname(record.path), { recursive: true });
    await requireGit(record.repoRoot, [
      "worktree",
      "add",
      "--detach",
      record.path,
      record.snapshotRef,
    ]);
    let branchCreated = false;
    try {
      await requireGit(record.repoRoot, ["branch", record.branch, parent]);
      branchCreated = true;
      await requireGit(record.path, ["symbolic-ref", "HEAD", `refs/heads/${record.branch}`]);
      await requireGit(record.path, ["reset"]);
      await copyIncludedFiles(record.repoRoot, record.path);
    } catch (error) {
      const removed = await runGit(record.repoRoot, ["worktree", "remove", "--force", record.path]);
      const branchDeleted = branchCreated
        ? await runGit(record.repoRoot, ["branch", "-D", record.branch])
        : void 0;
      if (removed.code !== 0 || (branchDeleted && branchDeleted.code !== 0))
        throw new Error(
          `${String(error)}\nrestore cleanup failed: ${resultMessage(removed) || (branchDeleted ? resultMessage(branchDeleted) : "")}`,
          { cause: error },
        );
      throw error;
    }
    const lastActiveAt = this.now();
    updateRegistryWorktree(this.env, params.id, {
      removedAt: void 0,
      lastActiveAt,
    });
    finalizeWorktreeRemoval(this.env, params.id);
    const restored = {
      ...record,
      lastActiveAt,
    };
    delete restored.removedAt;
    return restored;
  }
  async removeIfLossless(id) {
    const record = this.requireLiveRecord(id);
    const claimToken = randomUUID();
    try {
      claimWorktreeRemoval(this.env, {
        worktreeId: id,
        token: claimToken,
        force: false,
      });
    } catch {
      return false;
    }
    try {
      const status = await requireGit(record.path, ["status", "--porcelain"]);
      const unpushed = await requireGit(record.path, [
        "log",
        "HEAD",
        "--not",
        "--remotes",
        "--oneline",
      ]);
      if (status || unpushed) {
        abortWorktreeRemoval(this.env, id, claimToken);
        return false;
      }
    } catch (error) {
      abortWorktreeRemoval(this.env, id, claimToken);
      throw error;
    }
    await this.release(id);
    await this.remove({
      id,
      reason: "run-end",
      claimToken,
    });
    return true;
  }
  async removeIfLosslessByPath(worktreePath, owner) {
    const record = findLiveRegistryWorktreeByPath(this.env, worktreePath);
    if (!record || !worktreeOwnerMatches(record, owner)) return false;
    return await this.removeIfLossless(record.id);
  }
  async releaseByPath(worktreePath) {
    const record = findLiveRegistryWorktreeByPath(this.env, worktreePath);
    if (record) await this.release(record.id);
  }
  async gc(params = {}) {
    const now = this.now();
    const removed = [];
    const records = listRegistryWorktrees(this.env);
    for (const record of records)
      try {
        if (record.removedAt === void 0 && !(await pathExists(record.path))) {
          updateRegistryWorktree(this.env, record.id, { removedAt: now });
          record.removedAt = now;
        }
        const expiresWhenIdle = record.ownerKind === "workboard" || record.ownerKind === "session";
        if (record.removedAt === void 0 && expiresWhenIdle && now - record.lastActiveAt > 6048e5) {
          if (await this.isProtectedFromAutoRemoval(record, params.isOwnerActive)) continue;
          await this.remove({
            id: record.id,
            reason: "idle-gc",
          });
          removed.push(record.id);
        }
      } catch (error) {
        log.warn(`idle cleanup failed for ${record.id}: ${String(error)}`);
      }
    removed.push(...(await this.enforceCleanupLimits(params)));
    const orphansDeleted = await this.reconcileOrphans(records);
    let snapshotsPruned = 0;
    for (const record of listRegistryWorktrees(this.env)) {
      if (record.removedAt === void 0 || now - record.removedAt <= 2592e6) continue;
      try {
        if (record.snapshotRef && (await pathExists(record.repoRoot)))
          await requireGit(record.repoRoot, ["update-ref", "-d", record.snapshotRef]);
        deleteRegistryWorktree(this.env, record.id);
        snapshotsPruned += 1;
      } catch (error) {
        log.warn(`snapshot retention failed for ${record.id}: ${String(error)}`);
      }
    }
    return {
      removed,
      orphansDeleted,
      snapshotsPruned,
    };
  }
  /**
   * Shared auto-removal guard for idle and limit cleanup: active owners, live run
   * leases, and live/foreign git locks all veto removal; a dead lock is cleared.
   */
  async isProtectedFromAutoRemoval(record, isOwnerActive) {
    if (record.ownerId !== void 0 && isOwnerActive?.(record.ownerKind, record.ownerId) === true)
      return true;
    if (hasLiveWorktreeRunLease(this.env, record.id)) return true;
    const state = await lockState(record);
    if (state.kind === "live" || state.kind === "foreign") return true;
    if (state.kind === "dead")
      await requireGit(record.repoRoot, ["worktree", "unlock", record.path]);
    return false;
  }
  /**
   * Enforces configured count/size retention across all live managed worktrees.
   * Manual worktrees count toward the totals but are never limit-evicted, so a
   * limit can stay exceeded when only protected worktrees remain.
   */
  async enforceCleanupLimits(params) {
    const limits = params.limits ?? {};
    if (limits.maxCount === void 0 && limits.maxTotalSizeBytes === void 0) return [];
    const live = listRegistryWorktrees(this.env).filter((record) => record.removedAt === void 0);
    const sizes = /* @__PURE__ */ new Map();
    let totalBytes = 0;
    if (limits.maxTotalSizeBytes !== void 0)
      for (const record of live)
        try {
          const bytes = await directorySizeBytes(record.path);
          sizes.set(record.id, bytes);
          totalBytes += bytes;
        } catch (error) {
          log.warn(`worktree size measurement failed for ${record.id}: ${String(error)}`);
        }
    let liveCount = live.length;
    const overLimit = () =>
      (limits.maxCount !== void 0 && liveCount > limits.maxCount) ||
      (limits.maxTotalSizeBytes !== void 0 && totalBytes > limits.maxTotalSizeBytes);
    if (!overLimit()) return [];
    const refreshTotals = () => {
      const liveIds = new Set(
        listRegistryWorktrees(this.env)
          .filter((record) => record.removedAt === void 0)
          .map((record) => record.id),
      );
      liveCount = liveIds.size;
      if (limits.maxTotalSizeBytes !== void 0) {
        totalBytes = 0;
        for (const [id, bytes] of sizes) if (liveIds.has(id)) totalBytes += bytes;
      }
      return liveIds;
    };
    const removed = [];
    const candidates = live
      .filter((record) => record.ownerKind === "workboard" || record.ownerKind === "session")
      .toSorted((a, b) => a.lastActiveAt - b.lastActiveAt);
    for (const record of candidates) {
      const liveIds = refreshTotals();
      if (!overLimit()) break;
      if (!liveIds.has(record.id)) continue;
      try {
        if (await this.isProtectedFromAutoRemoval(record, params.isOwnerActive)) continue;
        await this.remove({
          id: record.id,
          reason: "limit-gc",
        });
      } catch (error) {
        log.warn(`cleanup limit removal failed for ${record.id}: ${String(error)}`);
        continue;
      }
      removed.push(record.id);
    }
    refreshTotals();
    if (overLimit())
      log.warn(
        `worktree cleanup limits still exceeded after evicting ${removed.length}; remaining worktrees are protected or manual`,
      );
    return removed;
  }
  requireLiveRecord(id) {
    const record = getRegistryWorktree(this.env, id);
    if (!record || record.removedAt !== void 0) throw new Error(`unknown active worktree: ${id}`);
    return record;
  }
  async reconcileOrphans(records) {
    const managedPaths = new Set(records.map((record) => path.resolve(record.path)));
    const worktreesRoot = path.join(resolveStateDir(this.env), "worktrees");
    const fingerprints = await fs$1.readdir(worktreesRoot, { withFileTypes: true }).catch(() => []);
    let deleted = 0;
    for (const fingerprint of fingerprints) {
      if (!fingerprint.isDirectory()) continue;
      const fingerprintPath = path.join(worktreesRoot, fingerprint.name);
      const names = await fs$1.readdir(fingerprintPath, { withFileTypes: true }).catch(() => []);
      for (const name of names) {
        if (!name.isDirectory()) continue;
        const candidate = path.join(fingerprintPath, name.name);
        if (managedPaths.has(path.resolve(candidate))) continue;
        const repository = await resolveRepository(candidate).catch(() => void 0);
        if (repository) {
          if (
            (await listGitWorktrees(repository.repoRoot).catch(() => [])).some(
              (entry) => path.resolve(entry.path) === path.resolve(candidate),
            )
          )
            continue;
        }
        await fs$1.rm(candidate, {
          recursive: true,
          force: true,
        });
        deleted += 1;
      }
      await fs$1.rmdir(fingerprintPath).catch(() => void 0);
    }
    return deleted;
  }
};
const managedWorktrees = new ManagedWorktreeService();
//#endregion
export {
  WorktreeSnapshotError as a,
  WORKTREE_GC_INTERVAL_MS as i,
  ManagedWorktreeService as n,
  managedWorktrees as o,
  SNAPSHOT_RETENTION_MS as r,
  resolveWorktreeCleanupLimits as s,
  IDLE_GC_MS as t,
};
