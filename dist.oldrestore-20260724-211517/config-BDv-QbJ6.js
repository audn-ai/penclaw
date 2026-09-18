import { AsyncLocalStorage } from "node:async_hooks";
import "./src-Bl7G9qvi.js";
import fs from "node:fs/promises";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
import {
  c as getPublishedConfigRuntimeEnvState,
  n as cloneEnvWithPlatformSemantics,
  s as createConfigRuntimeEnvBase,
  t as applyConfigEnvVars,
} from "./config-env-vars-CwdMUFhk.js";
import "./fs-safe-RNq3oO57.js";
import { r as resolveConfigEnvVars } from "./env-substitution-BDfwDlDU.js";
import "./utils-DtcDeqWS.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import "./types.secrets-BV0ywRAy.js";
import { o as withFileLock } from "./file-lock-C2Kr7iLJ.js";
import "./scan-paths-Bve2UhXh.js";
import { t as GATEWAY_CONFIG_SELECTION_ENV_KEYS } from "./gateway-env-selection-ChuJZBvC.js";
import {
  a as hashConfigIncludeRaw,
  n as ConfigIncludeError,
  r as INCLUDE_KEY,
  s as resolveConfigIncludeWritePath,
} from "./includes-C1dGj2Ja.js";
import {
  D as validateConfigObjectWithPlugins,
  L as ConfigMutationConflictError,
  Q as resolveWriteEnvSnapshotForPath,
  S as writeConfigFile,
  Z as resolveManagedUnsetPathsForWrite,
  b as resolveConfigSnapshotHash,
  et as restoreEnvVarRefs,
  f as readConfigFileSnapshotForWrite,
  nt as maintainConfigBackups,
  q as applyUnsetPathsForWrite,
  r as createConfigIO,
  x as restoreEnvChangesIfUnchanged,
} from "./io-B3ne6NxF.js";
import {
  n as formatInvalidConfigDetails,
  t as createInvalidConfigError,
} from "./io.invalid-config-D9scyfF6.js";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.js";
import { n as assertConfigWriteAllowedInCurrentMode } from "./nix-mode-write-guard-e6xDJfpJ.js";
import { t as parseJsonWithJson5Fallback } from "./parse-json-compat-CmZHj-1e.js";
import { i as isPathInside } from "./path-DILYn_gk.js";
import "./file-lock-CsC2zkbH.js";
import { c as resolveConfigPath } from "./paths-DEklnbzU.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import {
  _ as resolveConfigWriteAfterWrite,
  c as hasManagedRuntimeConfigWriteOwner,
  d as notifyRuntimeConfigWriteListeners,
  f as preflightManagedRuntimeConfigWrite,
  i as getRuntimeConfigSnapshot,
  n as createRuntimeConfigWriteNotification,
  o as getRuntimeConfigSnapshotRefreshHandler,
  p as preflightRuntimeSnapshotWrite,
  r as finalizeRuntimeSnapshotWrite,
  s as getRuntimeConfigSourceSnapshot,
  v as resolveConfigWriteFollowUp,
} from "./runtime-snapshot-BbbqRiDR.js";
import { a as root } from "./secure-temp-dir-DMUMnweR.js";
//#region src/config/mutate.ts
const CONFIG_MUTATION_LOCK_OPTIONS = {
  retries: {
    retries: 80,
    factor: 1.2,
    minTimeout: 25,
    maxTimeout: 250,
    randomize: true,
  },
  stale: 3e4,
};
const DEFAULT_CONFIG_MUTATION_RETRY_ATTEMPTS = 5;
const activeConfigMutationLocks = new AsyncLocalStorage();
const configMutationQueue = new KeyedAsyncQueue();
function resolveManagedRuntimeEnvBaseline() {
  const published = getPublishedConfigRuntimeEnvState();
  return {
    generation: published.generation,
    sourceConfig: published.sourceConfig ?? getRuntimeConfigSourceSnapshot() ?? {},
  };
}
function assertManagedRuntimeEnvGeneration(generation) {
  if (getPublishedConfigRuntimeEnvState().generation !== generation)
    throw new ConfigMutationConflictError(
      "active config environment changed while preparing write",
      { currentHash: null },
    );
}
function assertBaseHashMatches(snapshot, expectedHash) {
  const currentHash = resolveConfigSnapshotHash(snapshot) ?? null;
  if (expectedHash !== void 0 && expectedHash !== currentHash)
    throw new ConfigMutationConflictError("config changed since last load", { currentHash });
  return currentHash;
}
function assertExpectedConfigPathMatches(snapshot, expectedConfigPath) {
  if (expectedConfigPath !== void 0 && expectedConfigPath !== snapshot.path)
    throw new ConfigMutationConflictError("config path changed since last load", {
      currentHash: resolveConfigSnapshotHash(snapshot) ?? null,
      retryable: false,
    });
}
async function withConfigMutationLock(params, fn) {
  if (params.io) return await fn();
  const configPath = path.resolve(params.lockPath ?? resolveConfigPath());
  const activeLocks = activeConfigMutationLocks.getStore();
  if (activeLocks?.has(configPath)) return await fn();
  assertConfigWriteAllowedInCurrentMode({ configPath });
  await fs.mkdir(path.dirname(configPath), {
    recursive: true,
    mode: 448,
  });
  const nextActiveLocks = new Set(activeLocks ?? []);
  nextActiveLocks.add(configPath);
  return await configMutationQueue.enqueue(configPath, () =>
    activeConfigMutationLocks.run(
      nextActiveLocks,
      async () => await withFileLock(configPath, CONFIG_MUTATION_LOCK_OPTIONS, fn),
    ),
  );
}
function markActiveConfigMutationPath(configPath) {
  activeConfigMutationLocks.getStore()?.add(path.resolve(configPath));
}
async function readConfigSnapshotForMutation(params) {
  const options = params.writeOptions?.skipPluginValidation ? { skipPluginValidation: true } : {};
  if (params.io) return await params.io.readConfigFileSnapshotForWrite(options);
  if (params.ownedConfigPathForWrite) {
    const ioOptions = {
      configPath: params.ownedConfigPathForWrite,
      ...(params.writeOptions?.skipPluginValidation ? { pluginValidation: "skip" } : {}),
    };
    return await (
      hasManagedRuntimeConfigWriteOwner(params.ownedConfigPathForWrite)
        ? createConfigIO({
            ...ioOptions,
            env: createConfigRuntimeEnvBase(
              resolveManagedRuntimeEnvBaseline().sourceConfig,
              process.env,
              { preservedKeys: GATEWAY_CONFIG_SELECTION_ENV_KEYS },
            ),
          })
        : createConfigIO(ioOptions)
    ).readConfigFileSnapshotForWrite();
  }
  return await readConfigFileSnapshotForWrite(options);
}
function createConfigMutationOwnership(prepared, writeOptions) {
  const mergedWriteOptions = {
    ...prepared.writeOptions,
    ...writeOptions,
  };
  return {
    initialized: true,
    expectedConfigPath: mergedWriteOptions.expectedConfigPath ?? prepared.snapshot.path,
    ownedConfigPathForWrite: mergedWriteOptions.ownedConfigPathForWrite,
    assertConfigPathForWrite: mergedWriteOptions.assertConfigPathForWrite,
  };
}
async function withConfigMutationSnapshotLock(params, fn) {
  let lockPath = path.resolve(params.writeOptions?.ownedConfigPathForWrite ?? resolveConfigPath());
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const outcome = await withConfigMutationLock({ lockPath }, async () => {
      const prepared = await readConfigSnapshotForMutation({
        ...(params.writeOptions?.ownedConfigPathForWrite
          ? { ownedConfigPathForWrite: params.writeOptions.ownedConfigPathForWrite }
          : {}),
        writeOptions: params.writeOptions,
      });
      const preparedPath = path.resolve(prepared.snapshot.path);
      if (preparedPath !== lockPath)
        return {
          done: false,
          lockPath: preparedPath,
        };
      return {
        done: true,
        value: await fn(prepared),
      };
    });
    if (outcome.done) return outcome.value;
    lockPath = outcome.lockPath;
  }
  throw new ConfigMutationConflictError("config path changed repeatedly while acquiring lock", {
    currentHash: null,
    retryable: false,
  });
}
function getChangedTopLevelKeys(base, next) {
  if (!isRecord(base) || !isRecord(next)) return isDeepStrictEqual(base, next) ? [] : ["<root>"];
  return [.../* @__PURE__ */ new Set([...Object.keys(base), ...Object.keys(next)])].filter(
    (key) => !isDeepStrictEqual(base[key], next[key]),
  );
}
function getSingleTopLevelIncludeTarget(params) {
  if (!isRecord(params.snapshot.parsed)) return null;
  const authoredSection = params.snapshot.parsed[params.key];
  if (!isRecord(authoredSection)) return null;
  const keys = Object.keys(authoredSection);
  const includeValue = authoredSection[INCLUDE_KEY];
  if (keys.length !== 1 || typeof includeValue !== "string") return null;
  const rootDir = path.dirname(params.snapshot.path);
  return path.normalize(
    path.isAbsolute(includeValue) ? includeValue : path.resolve(rootDir, includeValue),
  );
}
function containsConfigIncludeDirective(value) {
  if (Array.isArray(value)) return value.some((item) => containsConfigIncludeDirective(item));
  if (!isRecord(value)) return false;
  return (
    Object.hasOwn(value, "$include") ||
    Object.values(value).some((item) => containsConfigIncludeDirective(item))
  );
}
function snapshotProvesBrokenInclude(snapshot, includePath) {
  return (
    !snapshot.valid &&
    snapshot.issues.some(
      (issue) =>
        /Failed to (?:read|parse) include file:/.test(issue.message) &&
        issue.message.includes(includePath),
    )
  );
}
function formatJsonFileValue(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}
function isMissingFileError(error) {
  const code = error?.code;
  return code === "ENOENT" || code === "not-found";
}
function resolveRootBoundRelativePath(target, absolutePath) {
  const relativePath = path.relative(target.root.rootReal, path.resolve(absolutePath));
  const firstSegment = relativePath.split(path.sep)[0];
  if (path.isAbsolute(relativePath) || firstSegment === "..")
    throw new Error(`Config include backup path escaped its approved root: ${absolutePath}`);
  return relativePath;
}
async function resolveRootBoundIncludeFile(params) {
  const absolutePath = resolveConfigIncludeWritePath(params);
  const candidateRoots = [path.dirname(params.configPath), ...params.allowedRoots];
  for (const candidateRoot of candidateRoots) {
    const rootReal = await fs.realpath(candidateRoot).catch(() => null);
    if (!rootReal || !isPathInside(rootReal, absolutePath)) continue;
    const relativePath = path.relative(rootReal, absolutePath);
    if (!relativePath || path.isAbsolute(relativePath) || relativePath.split(path.sep)[0] === "..")
      continue;
    return {
      absolutePath,
      relativePath,
      root: await root(rootReal, {
        hardlinks: "reject",
        mkdir: true,
        mode: 384,
        symlinks: "reject",
      }),
    };
  }
  throw new Error(`Config include write path has no approved existing root: ${absolutePath}`);
}
async function resolveExpectedRootBoundIncludeFile(params) {
  let target;
  try {
    target = await resolveRootBoundIncludeFile(params);
  } catch (error) {
    if (
      error instanceof ConfigIncludeError ||
      (error instanceof Error &&
        error.message.startsWith("Config include write path has no approved existing root:"))
    )
      throw new ConfigMutationConflictError("included config target changed since last load", {
        currentHash: null,
      });
    throw error;
  }
  if (path.normalize(target.absolutePath) !== path.normalize(params.expectedAbsolutePath))
    throw new ConfigMutationConflictError("included config target changed since last load", {
      currentHash: null,
    });
  return target;
}
async function readRootBoundFileRawIfExists(target) {
  try {
    return await target.root.readText(target.relativePath);
  } catch (error) {
    if (isMissingFileError(error)) return null;
    throw error;
  }
}
async function assertRootConfigStillMatchesSnapshot(snapshot) {
  let currentRaw = null;
  try {
    currentRaw = await fs.readFile(snapshot.path, "utf-8");
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
  const currentHash = hashConfigIncludeRaw(currentRaw);
  if (currentHash !== hashConfigIncludeRaw(snapshot.exists ? (snapshot.raw ?? null) : null))
    throw new ConfigMutationConflictError("config changed while preparing include write", {
      currentHash,
    });
}
async function rollbackJsonFileWriteIfUnchanged(params) {
  if (
    hashConfigIncludeRaw(await readRootBoundFileRawIfExists(params.target)) !== params.committedHash
  )
    return false;
  if (params.previousRaw !== null) {
    await params.target.root.write(params.target.relativePath, params.previousRaw, {
      mkdir: true,
      mode: 384,
      overwrite: true,
    });
    return true;
  }
  try {
    await params.target.root.remove(params.target.relativePath);
  } catch (error) {
    if (!isMissingFileError(error)) throw error;
  }
  return true;
}
function createRootBoundBackupFs(target) {
  return {
    chmod: async (filePath, mode) => {
      const opened = await target.root.open(resolveRootBoundRelativePath(target, filePath));
      try {
        await opened.handle.chmod(mode);
      } finally {
        await opened[Symbol.asyncDispose]();
      }
    },
    copyFile: async (from, to) => {
      const content = await target.root.readBytes(resolveRootBoundRelativePath(target, from));
      await target.root.write(resolveRootBoundRelativePath(target, to), content, {
        mkdir: true,
        mode: 384,
        overwrite: true,
      });
    },
    readdir: async (dir) => await target.root.list(resolveRootBoundRelativePath(target, dir)),
    rename: async (from, to) => {
      await target.root.move(
        resolveRootBoundRelativePath(target, from),
        resolveRootBoundRelativePath(target, to),
        { overwrite: true },
      );
    },
    unlink: async (filePath) => {
      await target.root.remove(resolveRootBoundRelativePath(target, filePath));
    },
  };
}
async function writeRootBoundJsonFile(params) {
  params.assertConfigPathForWrite();
  const targetBeforeBackup = await resolveExpectedRootBoundIncludeFile({
    configPath: params.configPath,
    includePath: params.includePath,
    allowedRoots: params.allowedRoots,
    expectedAbsolutePath: params.expectedTargetPath,
  });
  if (await targetBeforeBackup.root.exists(targetBeforeBackup.relativePath))
    await maintainConfigBackups(
      targetBeforeBackup.absolutePath,
      createRootBoundBackupFs(targetBeforeBackup),
    );
  const targetAtCommit = await resolveExpectedRootBoundIncludeFile({
    configPath: params.configPath,
    includePath: params.includePath,
    allowedRoots: params.allowedRoots,
    expectedAbsolutePath: params.expectedTargetPath,
  });
  params.assertConfigPathForWrite();
  await assertRootConfigStillMatchesSnapshot(params.rootSnapshot);
  const currentRaw = await readRootBoundFileRawIfExists(targetAtCommit);
  const currentHash = hashConfigIncludeRaw(currentRaw);
  if (currentHash !== hashConfigIncludeRaw(params.expectedRaw))
    throw new ConfigMutationConflictError("included config changed while preparing write", {
      currentHash,
    });
  const content = formatJsonFileValue(params.value);
  await params.preCommitRuntimePreflight?.();
  params.assertConfigPathForWrite();
  await targetAtCommit.root.write(targetAtCommit.relativePath, content, {
    mkdir: true,
    mode: 384,
    overwrite: true,
  });
  try {
    params.assertConfigPathForWrite();
  } catch (error) {
    await rollbackJsonFileWriteIfUnchanged({
      target: targetAtCommit,
      previousRaw: currentRaw,
      committedHash: hashConfigIncludeRaw(content),
    });
    throw error;
  }
}
async function tryWriteSingleTopLevelIncludeMutation(params) {
  const nextConfig = applyUnsetPathsForWrite(
    params.nextConfig,
    resolveManagedUnsetPathsForWrite(params.writeOptions?.unsetPaths),
  );
  const changedKeys = getChangedTopLevelKeys(params.snapshot.sourceConfig, nextConfig);
  if (changedKeys.length !== 1 || changedKeys[0] === "<root>") return null;
  const key = expectDefined(changedKeys[0], "changed keys entry at 0");
  const includePath = getSingleTopLevelIncludeTarget({
    snapshot: params.snapshot,
    key,
  });
  if (!includePath || !isRecord(nextConfig) || !(key in nextConfig)) return null;
  const nextConfigRecord = nextConfig;
  const writeEnv = params.io?.env ?? process.env;
  const allowedRoots = [];
  const expectedIncludeTarget = params.writeOptions?.includeFileTargetsForWrite?.[includePath];
  if (!expectedIncludeTarget)
    throw new ConfigMutationConflictError("included config target changed since last load", {
      currentHash: null,
    });
  const assertConfigPathForWrite = params.writeOptions?.assertConfigPathForWrite;
  if (!assertConfigPathForWrite) return null;
  assertConfigPathForWrite();
  if (!isPathInside(await fs.realpath(path.dirname(params.snapshot.path)), expectedIncludeTarget))
    throw new Error(
      `Config mutation cannot update external $include target ${includePath}; edit the included file directly or move it under the config directory.`,
    );
  const includeTarget = await resolveExpectedRootBoundIncludeFile({
    configPath: params.snapshot.path,
    includePath,
    allowedRoots,
    expectedAbsolutePath: expectedIncludeTarget,
  });
  const previousIncludeRaw = await readRootBoundFileRawIfExists(includeTarget);
  const previousIncludeHash = hashConfigIncludeRaw(previousIncludeRaw);
  const expectedIncludeHash = params.writeOptions?.includeFileHashesForWrite?.[includePath];
  if (expectedIncludeHash !== void 0 && expectedIncludeHash !== previousIncludeHash)
    throw new ConfigMutationConflictError("included config changed since last load", {
      currentHash: previousIncludeHash,
    });
  const envForRestore =
    resolveWriteEnvSnapshotForPath({
      actualConfigPath: params.snapshot.path,
      expectedConfigPath: params.writeOptions?.expectedConfigPath,
      envSnapshotForRestore: params.writeOptions?.envSnapshotForRestore,
    }) ??
    params.io?.env ??
    process.env;
  const snapshotHasBrokenInclude = snapshotProvesBrokenInclude(params.snapshot, includePath);
  if (previousIncludeRaw === null && (!snapshotHasBrokenInclude || expectedIncludeHash === void 0))
    throw new ConfigMutationConflictError("included config changed since last load", {
      currentHash: previousIncludeHash,
    });
  let includedValueToWrite = nextConfigRecord[key];
  if (previousIncludeRaw !== null) {
    let authoredIncludeValue;
    let parsedInclude = false;
    try {
      authoredIncludeValue = parseJsonWithJson5Fallback(previousIncludeRaw);
      parsedInclude = true;
    } catch {
      if (!snapshotHasBrokenInclude || expectedIncludeHash === void 0)
        throw new ConfigMutationConflictError("included config changed since last load", {
          currentHash: previousIncludeHash,
        });
    }
    if (parsedInclude) {
      if (containsConfigIncludeDirective(authoredIncludeValue)) return null;
      const currentIncludedValue = resolveConfigEnvVars(authoredIncludeValue, envForRestore, {
        onMissing: () => {},
      });
      const snapshotIncludedValue = params.snapshot.sourceConfig[key];
      if (!isDeepStrictEqual(currentIncludedValue, snapshotIncludedValue))
        throw new ConfigMutationConflictError("included config changed since last load", {
          currentHash: previousIncludeHash,
        });
      includedValueToWrite = restoreEnvVarRefs(
        includedValueToWrite,
        authoredIncludeValue,
        envForRestore,
      );
    }
  }
  const deferRuntimeActivation = hasManagedRuntimeConfigWriteOwner(params.snapshot.path);
  const runtimeEnvBaseline = deferRuntimeActivation ? resolveManagedRuntimeEnvBaseline() : void 0;
  const runtimeCandidateEnv = runtimeEnvBaseline
    ? createConfigRuntimeEnvBase(runtimeEnvBaseline.sourceConfig, process.env, {
        preservedKeys: GATEWAY_CONFIG_SELECTION_ENV_KEYS,
      })
    : cloneEnvWithPlatformSemantics(writeEnv);
  const authoredRuntimeCandidate = restoreEnvVarRefs(
    nextConfig,
    params.snapshot.parsed,
    envForRestore,
  );
  applyConfigEnvVars(authoredRuntimeCandidate, runtimeCandidateEnv);
  const runtimeConfigToWrite = resolveConfigEnvVars(
    {
      ...authoredRuntimeCandidate,
      [key]: includedValueToWrite,
    },
    runtimeCandidateEnv,
    { onMissing: () => {} },
  );
  const validated = validateConfigObjectWithPlugins(
    runtimeConfigToWrite,
    params.writeOptions?.skipPluginValidation ? { pluginValidation: "skip" } : void 0,
  );
  if (!validated.ok)
    throw createInvalidConfigError(
      params.snapshot.path,
      formatInvalidConfigDetails(validated.issues),
    );
  const runtimeConfigSnapshot = getRuntimeConfigSnapshot();
  const runtimeConfigSourceSnapshot = getRuntimeConfigSourceSnapshot();
  const hadRuntimeSnapshot = Boolean(runtimeConfigSnapshot);
  const hadBothSnapshots = Boolean(runtimeConfigSnapshot && runtimeConfigSourceSnapshot);
  let managedPreparedCandidates = /* @__PURE__ */ new Map();
  let runtimePreflightResult;
  if (runtimeEnvBaseline) {
    managedPreparedCandidates = await preflightManagedRuntimeConfigWrite(
      params.snapshot.path,
      runtimeConfigToWrite,
      params.writeOptions?.runtimeRefresh,
    );
    assertManagedRuntimeEnvGeneration(runtimeEnvBaseline.generation);
  } else
    runtimePreflightResult = await preflightRuntimeSnapshotWrite({
      nextSourceConfig: runtimeConfigToWrite,
      refreshOptions: params.writeOptions?.runtimeRefresh,
      formatRefreshError: (error) => formatErrorMessage(error),
      createRefreshError: (detail, cause) =>
        new Error(
          `Config write blocked before committing ${includePath}: active SecretRef resolution failed: ${detail}`,
          { cause },
        ),
    });
  const committedIncludeHash = hashConfigIncludeRaw(formatJsonFileValue(includedValueToWrite));
  const callerPreCommit = params.writeOptions?.preCommitRuntimePreflight;
  assertConfigPathForWrite();
  await assertRootConfigStillMatchesSnapshot(params.snapshot);
  const includeRawAtCommit = await readRootBoundFileRawIfExists(includeTarget);
  if (hashConfigIncludeRaw(includeRawAtCommit) !== hashConfigIncludeRaw(previousIncludeRaw))
    throw new ConfigMutationConflictError("included config changed while preparing write", {
      currentHash: hashConfigIncludeRaw(includeRawAtCommit),
    });
  await writeRootBoundJsonFile({
    configPath: params.snapshot.path,
    includePath,
    allowedRoots,
    expectedTargetPath: expectedIncludeTarget,
    value: includedValueToWrite,
    expectedRaw: includeRawAtCommit,
    rootSnapshot: params.snapshot,
    assertConfigPathForWrite,
    preCommitRuntimePreflight:
      runtimeEnvBaseline || callerPreCommit
        ? async () => {
            if (runtimeEnvBaseline)
              assertManagedRuntimeEnvGeneration(runtimeEnvBaseline.generation);
            await callerPreCommit?.(runtimeConfigToWrite);
          }
        : void 0,
  });
  const envBeforePostWriteRead = { ...writeEnv };
  let envAfterPostWriteRead = envBeforePostWriteRead;
  try {
    if (
      params.writeOptions?.skipRuntimeSnapshotRefresh &&
      !hadRuntimeSnapshot &&
      !getRuntimeConfigSnapshotRefreshHandler()
    )
      return {
        persistedHash: null,
        persistedConfig: runtimeConfigToWrite,
      };
    let refreshed;
    try {
      refreshed = await readConfigSnapshotForMutation({
        ownedConfigPathForWrite: params.snapshot.path,
        io: params.io,
        writeOptions: params.writeOptions,
      });
    } finally {
      envAfterPostWriteRead = { ...writeEnv };
    }
    const refreshedSnapshot = refreshed.snapshot;
    assertConfigPathForWrite();
    assertExpectedConfigPathMatches(refreshedSnapshot, params.snapshot.path);
    const persistedHash = resolveConfigSnapshotHash(refreshedSnapshot);
    if (!refreshedSnapshot.valid)
      throw createInvalidConfigError(
        params.snapshot.path,
        formatInvalidConfigDetails(refreshedSnapshot.issues),
      );
    if (!persistedHash)
      throw new Error(
        `Config was written to ${params.snapshot.path}, but no persisted hash was available.`,
      );
    const notifyCommittedWrite = () => {
      const currentRuntimeConfig = getRuntimeConfigSnapshot();
      const notificationRuntimeConfig = deferRuntimeActivation
        ? refreshedSnapshot.runtimeConfig
        : currentRuntimeConfig;
      if (!notificationRuntimeConfig) return;
      const notificationPreparedCandidates = new Map(
        [...managedPreparedCandidates].map(([ownerId, candidate]) => [
          ownerId,
          {
            ...candidate,
            runtimeConfig:
              candidate.reapplyRuntimeOverlays?.(refreshedSnapshot.runtimeConfig) ??
              candidate.runtimeConfig,
            compareConfig:
              candidate.reapplyCompareOverlays?.(refreshedSnapshot.sourceConfig) ??
              candidate.compareConfig,
          },
        ]),
      );
      notifyRuntimeConfigWriteListeners(
        createRuntimeConfigWriteNotification({
          configPath: params.snapshot.path,
          sourceConfig: refreshedSnapshot.sourceConfig,
          runtimeConfig: notificationRuntimeConfig,
          persistedHash,
          afterWrite: params.afterWrite ?? params.writeOptions?.afterWrite,
          runtimeRefresh: params.writeOptions?.runtimeRefresh,
          ...(notificationPreparedCandidates.size > 0
            ? { preparedCandidatesByOwner: notificationPreparedCandidates }
            : {}),
        }),
      );
    };
    await finalizeRuntimeSnapshotWrite({
      nextSourceConfig: refreshedSnapshot.sourceConfig,
      refreshOptions: params.writeOptions?.runtimeRefresh,
      hadRuntimeSnapshot,
      hadBothSnapshots,
      loadFreshConfig: () => refreshedSnapshot.runtimeConfig,
      notifyCommittedWrite,
      preflightResult: runtimePreflightResult,
      deferRuntimeActivation,
      formatRefreshError: (error) => formatErrorMessage(error),
      createRefreshError: (detail, cause) =>
        new Error(
          `Config was written to ${params.snapshot.path}, but runtime snapshot refresh failed: ${detail}`,
          { cause },
        ),
    });
    return {
      persistedHash,
      persistedConfig: refreshedSnapshot.sourceConfig,
    };
  } catch (error) {
    try {
      if (
        await rollbackJsonFileWriteIfUnchanged({
          target: includeTarget,
          previousRaw: includeRawAtCommit,
          committedHash: committedIncludeHash,
        })
      )
        restoreEnvChangesIfUnchanged({
          env: writeEnv,
          before: envBeforePostWriteRead,
          after: envAfterPostWriteRead,
        });
    } catch (rollbackError) {
      throw new Error(
        `${formatErrorMessage(error)} Rollback failed: ${formatErrorMessage(rollbackError)}`,
        { cause: rollbackError },
      );
    }
    throw error;
  }
}
function resolveConfigWriteResult(result, fallbackConfig) {
  if (result)
    return {
      persistedHash: result.persistedHash,
      persistedConfig: result.persistedConfig,
    };
  return {
    persistedHash: null,
    persistedConfig: fallbackConfig,
  };
}
async function replaceConfigFile(params) {
  if (!params.snapshot && !params.io)
    return await withConfigMutationSnapshotLock(
      { writeOptions: params.writeOptions },
      async (prepared) =>
        await replaceConfigFileUnlocked({
          ...params,
          snapshot: prepared.snapshot,
          writeOptions: {
            ...prepared.writeOptions,
            ...params.writeOptions,
          },
        }),
    );
  return await withConfigMutationLock(
    {
      io: params.io,
      lockPath: params.snapshot?.path,
    },
    async () => await replaceConfigFileUnlocked(params),
  );
}
async function replaceConfigFileUnlocked(params) {
  const { snapshot, writeOptions } = params.snapshot
    ? {
        snapshot: params.snapshot,
        writeOptions: params.writeOptions ?? {},
      }
    : await readConfigSnapshotForMutation({
        io: params.io,
        writeOptions: params.writeOptions,
      });
  const mergedWriteOptions = {
    ...writeOptions,
    ...params.writeOptions,
  };
  mergedWriteOptions.assertConfigPathForWrite?.();
  assertExpectedConfigPathMatches(snapshot, mergedWriteOptions.expectedConfigPath);
  assertConfigWriteAllowedInCurrentMode({ configPath: snapshot.path });
  markActiveConfigMutationPath(snapshot.path);
  const previousHash = assertBaseHashMatches(snapshot, params.baseHash);
  const afterWrite = resolveConfigWriteAfterWrite(
    params.afterWrite ?? params.writeOptions?.afterWrite,
  );
  let writeResult = await tryWriteSingleTopLevelIncludeMutation({
    snapshot,
    nextConfig: params.nextConfig,
    afterWrite,
    writeOptions: mergedWriteOptions,
    io: params.io,
  });
  if (!writeResult) {
    const fallbackWriteOptions = {
      baseSnapshot: snapshot,
      ...mergedWriteOptions,
      afterWrite,
    };
    const ioPreCommitRuntimePreflight = params.io
      ? fallbackWriteOptions.preCommitRuntimePreflight
      : void 0;
    if (params.io)
      fallbackWriteOptions.preCommitRuntimePreflight = async (sourceConfig) => {
        await preflightRuntimeSnapshotWrite({
          nextSourceConfig: sourceConfig,
          refreshOptions: fallbackWriteOptions.runtimeRefresh,
          formatRefreshError: (error) => formatErrorMessage(error),
          createRefreshError: (detail, cause) =>
            new Error(
              `Config write blocked before committing ${snapshot.path}: active SecretRef resolution failed: ${detail}`,
              { cause },
            ),
        });
        await ioPreCommitRuntimePreflight?.(sourceConfig);
      };
    writeResult = resolveConfigWriteResult(
      await (params.io?.writeConfigFile ?? writeConfigFile)(
        params.nextConfig,
        fallbackWriteOptions,
      ),
      params.nextConfig,
    );
  }
  return {
    path: snapshot.path,
    previousHash,
    snapshot,
    nextConfig: writeResult.persistedConfig,
    persistedHash: writeResult.persistedHash,
    afterWrite,
    followUp: resolveConfigWriteFollowUp(afterWrite),
  };
}
async function commitPreparedConfigMutation(params) {
  const result = await replaceConfigFileUnlocked({
    nextConfig: params.nextConfig,
    snapshot: params.snapshot,
    baseHash: params.baseHash,
    writeOptions: {
      ...params.writeOptions,
      afterWrite: params.afterWrite,
    },
    io: params.io,
  });
  return {
    config: result.nextConfig,
    persistedHash: result.persistedHash,
    afterWrite: result.afterWrite,
  };
}
async function transformConfigFileAttempt(params, attempt, ownership, prepared) {
  ownership?.assertConfigPathForWrite?.();
  const { snapshot, writeOptions } =
    prepared ??
    (await readConfigSnapshotForMutation({
      ...(ownership?.ownedConfigPathForWrite
        ? { ownedConfigPathForWrite: ownership.ownedConfigPathForWrite }
        : {}),
      io: params.io,
      writeOptions: params.writeOptions,
    }));
  let mergedWriteOptions = {
    ...writeOptions,
    ...params.writeOptions,
  };
  if (ownership) {
    if (!ownership.initialized) {
      ownership.initialized = true;
      ownership.expectedConfigPath = mergedWriteOptions.expectedConfigPath ?? snapshot.path;
      ownership.ownedConfigPathForWrite = mergedWriteOptions.ownedConfigPathForWrite;
      ownership.assertConfigPathForWrite = mergedWriteOptions.assertConfigPathForWrite;
    }
    mergedWriteOptions = {
      ...mergedWriteOptions,
      expectedConfigPath: ownership.expectedConfigPath,
      ...(ownership.ownedConfigPathForWrite
        ? { ownedConfigPathForWrite: ownership.ownedConfigPathForWrite }
        : {}),
      ...(ownership.assertConfigPathForWrite
        ? { assertConfigPathForWrite: ownership.assertConfigPathForWrite }
        : {}),
    };
  }
  mergedWriteOptions.assertConfigPathForWrite?.();
  assertExpectedConfigPathMatches(snapshot, mergedWriteOptions.expectedConfigPath);
  assertConfigWriteAllowedInCurrentMode({ configPath: snapshot.path });
  markActiveConfigMutationPath(snapshot.path);
  const previousHash = assertBaseHashMatches(snapshot, params.baseHash);
  const baseConfig = params.base === "runtime" ? snapshot.runtimeConfig : snapshot.sourceConfig;
  const afterWrite = resolveConfigWriteAfterWrite(
    params.afterWrite ?? params.writeOptions?.afterWrite,
  );
  const transformed = await params.transform(baseConfig, {
    snapshot,
    previousHash,
    attempt,
  });
  const committed = await (params.commit ?? commitPreparedConfigMutation)({
    nextConfig: transformed.nextConfig,
    snapshot,
    ...(previousHash !== null ? { baseHash: previousHash } : {}),
    writeOptions: mergedWriteOptions,
    afterWrite,
    io: params.io,
  });
  const committedAfterWrite = committed.afterWrite ?? afterWrite;
  return {
    path: snapshot.path,
    previousHash,
    snapshot,
    nextConfig: committed.config,
    persistedHash: committed.persistedHash,
    result: transformed.result,
    attempts: attempt + 1,
    afterWrite: committedAfterWrite,
    followUp: resolveConfigWriteFollowUp(committedAfterWrite),
  };
}
async function transformConfigFile(params) {
  if (!params.io)
    return await withConfigMutationSnapshotLock(
      { writeOptions: params.writeOptions },
      async (prepared) =>
        await transformConfigFileAttempt(
          params,
          0,
          createConfigMutationOwnership(prepared, params.writeOptions),
          prepared,
        ),
    );
  return await withConfigMutationLock(
    { io: params.io },
    async () => await transformConfigFileAttempt(params, 0),
  );
}
async function transformConfigFileWithRetry(params) {
  const maxAttempts = params.maxAttempts ?? DEFAULT_CONFIG_MUTATION_RETRY_ATTEMPTS;
  if (!Number.isInteger(maxAttempts) || maxAttempts < 1)
    throw new Error("Config mutation maxAttempts must be a positive integer.");
  const runWithPrepared = async (prepared) => {
    const ownership = prepared
      ? createConfigMutationOwnership(prepared, params.writeOptions)
      : {
          initialized: false,
          expectedConfigPath: "",
        };
    for (let attempt = 0; attempt < maxAttempts; attempt += 1)
      try {
        return await transformConfigFileAttempt(
          params,
          attempt,
          ownership,
          attempt === 0 ? prepared : void 0,
        );
      } catch (err) {
        if (
          err instanceof ConfigMutationConflictError &&
          err.retryable &&
          attempt < maxAttempts - 1
        )
          continue;
        throw err;
      }
    throw new Error("Config mutation retry loop exhausted unexpectedly.");
  };
  if (!params.io)
    return await withConfigMutationSnapshotLock(
      { writeOptions: params.writeOptions },
      runWithPrepared,
    );
  return await withConfigMutationLock({ io: params.io }, async () => await runWithPrepared());
}
async function mutateConfigFile(params) {
  return await transformConfigFile({
    base: params.base,
    baseHash: params.baseHash,
    afterWrite: params.afterWrite,
    writeOptions: params.writeOptions,
    io: params.io,
    transform: async (currentConfig, context) => {
      const draft = structuredClone(currentConfig);
      return {
        nextConfig: draft,
        result: await params.mutate(draft, context),
      };
    },
  });
}
async function mutateConfigFileWithRetry(params) {
  return await transformConfigFileWithRetry({
    base: params.base,
    baseHash: params.baseHash,
    maxAttempts: params.maxAttempts,
    afterWrite: params.afterWrite,
    writeOptions: params.writeOptions,
    io: params.io,
    transform: async (currentConfig, context) => {
      const draft = structuredClone(currentConfig);
      return {
        nextConfig: draft,
        result: await params.mutate(draft, context),
      };
    },
  });
}
//#endregion
export {
  transformConfigFileWithRetry as a,
  transformConfigFile as i,
  mutateConfigFileWithRetry as n,
  replaceConfigFile as r,
  mutateConfigFile as t,
};
