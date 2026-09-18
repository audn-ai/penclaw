import fs from "node:fs";
import fs$1 from "node:fs/promises";
import "./src-Bl7G9qvi.js";
import path from "node:path";
import { c as normalizePluginsConfig } from "./config-state-C1Qyxaws.js";
import { r as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-DGhQ40qh.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { r as runCommandWithTimeout } from "./exec-CXKmx4dL.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { s as readSecureFile } from "./fs-safe-RNq3oO57.js";
import "./utils-DtcDeqWS.js";
import { t as shouldRejectHardlinkedPluginFiles } from "./hardlink-policy-BNUEpDI2.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import { n as readJsonPointer } from "./json-pointer-BDbFmrN8.js";
import { n as isActivatedManifestOwner } from "./manifest-owner-policy-Bl1TJHcS.js";
import { t as loadPluginManifestRegistry } from "./manifest-registry-CXy9BBfE.js";
import { C as FsSafeError, i as isPathInside } from "./path-DILYn_gk.js";
import { a as inspectPathPermissions, d as safeStat } from "./permissions-sY2quqHz.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import {
  a as isValidFileSecretRefId,
  c as resolveDefaultSecretProviderAlias,
  i as isValidExecSecretRefId,
  l as secretRefKey,
  n as SINGLE_VALUE_FILE_REF_ID,
  o as isValidSecretProviderAlias,
  r as formatExecSecretRefIdValidationMessage,
} from "./ref-contract-DVV0zYUk.js";
import "./audit-fs-CBe_wA_B.js";
import "./scan-paths-Bve2UhXh.js";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-BHgpSCM6.js";
import {
  i as normalizePositiveTimerMs,
  n as isNonEmptyString,
  r as normalizePositiveInt,
} from "./shared-CrrsbqCi.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
import { d as isValidEnvSecretRefId } from "./types.secrets-BV0ywRAy.js";
//#region src/secrets/provider-integrations.ts
/** Materializes trusted plugin secret-provider integrations into exec provider configs. */
const NODE_COMMAND_PLACEHOLDER = "${node}";
const PLUGIN_INTEGRATION_PROVIDER_ID_MAX_LENGTH = 128;
function isPathInsideOrEqual(rootDir, candidate) {
  const relative = path.relative(path.resolve(rootDir), path.resolve(candidate));
  return (
    relative === "" ||
    (relative.length > 0 && !relative.startsWith("..") && !path.isAbsolute(relative))
  );
}
function resolvePluginRelativePath(value, pluginRoot) {
  const resolved = path.resolve(pluginRoot, value);
  return isPathInsideOrEqual(pluginRoot, resolved) ? resolved : void 0;
}
function isPluginRelativeEntrypoint(value) {
  return value.startsWith("./");
}
function resolveArg(arg, pluginRoot) {
  if (!arg.startsWith("./") && !arg.startsWith("../")) return arg;
  return resolvePluginRelativePath(arg, pluginRoot);
}
function withNodeCommandTrustedDir(command, pluginRoot) {
  return command === NODE_COMMAND_PLACEHOLDER
    ? [.../* @__PURE__ */ new Set([path.dirname(process.execPath), pluginRoot])]
    : [pluginRoot];
}
function isSecurePosixPathStat(stat) {
  if (process.platform === "win32") return true;
  if ((stat.mode & 18) !== 0) return false;
  if (typeof process.getuid !== "function" || typeof stat.uid !== "number") return true;
  const uid = process.getuid();
  return stat.uid === uid || stat.uid === 0;
}
function pathSegmentsBetween(rootDir, targetDir) {
  const relative = path.relative(rootDir, targetDir);
  if (relative === "") return [];
  if (relative.startsWith("..") || path.isAbsolute(relative)) return;
  return relative.split(path.sep).filter(Boolean);
}
function isSecurePluginEntrypointPath(params) {
  if (params.allowInsecurePath || process.platform === "win32") return true;
  const originalSegments = pathSegmentsBetween(
    path.resolve(params.pluginRoot),
    path.dirname(path.resolve(params.resolvedEntrypoint)),
  );
  const realpathSegments = pathSegmentsBetween(
    params.pluginRootRealpath,
    path.dirname(params.entrypointRealpath),
  );
  if (!originalSegments || !realpathSegments) return false;
  let originalDir = path.resolve(params.pluginRoot);
  for (const [index, segment] of ["", ...originalSegments].entries()) {
    if (segment) originalDir = path.join(originalDir, segment);
    const stat = fs.lstatSync(originalDir);
    if (index === 0 && stat.isSymbolicLink()) continue;
    if (!stat.isDirectory() || stat.isSymbolicLink() || !isSecurePosixPathStat(stat)) return false;
  }
  let realpathDir = params.pluginRootRealpath;
  for (const segment of ["", ...realpathSegments]) {
    if (segment) realpathDir = path.join(realpathDir, segment);
    const stat = fs.lstatSync(realpathDir);
    if (!stat.isDirectory() || !isSecurePosixPathStat(stat)) return false;
  }
  return true;
}
function resolveNodeEntrypointArg(params) {
  const entrypoint = params.integration.args?.[0];
  if (!entrypoint || !isPluginRelativeEntrypoint(entrypoint)) return;
  let pluginRootRealpath;
  try {
    pluginRootRealpath = fs.realpathSync(params.pluginRoot);
  } catch {
    return;
  }
  const resolved = resolvePluginRelativePath(entrypoint, params.pluginRoot);
  if (!resolved) return;
  let stat;
  try {
    stat = fs.lstatSync(resolved);
  } catch {
    return;
  }
  if (!stat.isFile() || stat.isSymbolicLink()) return;
  if (params.rejectHardlinks && stat.nlink > 1) return;
  if (params.integration.allowInsecurePath !== true && !isSecurePosixPathStat(stat)) return;
  try {
    const realpath = fs.realpathSync(resolved);
    if (!isPathInsideOrEqual(pluginRootRealpath, realpath)) return;
    if (
      !isSecurePluginEntrypointPath({
        pluginRoot: params.pluginRoot,
        pluginRootRealpath,
        resolvedEntrypoint: resolved,
        entrypointRealpath: realpath,
        allowInsecurePath: params.integration.allowInsecurePath === true,
      })
    )
      return;
    return realpath;
  } catch {
    return;
  }
}
function materializeExecProviderConfig(integration, record, env) {
  const pluginRoot = record.rootDir;
  if (integration.command !== NODE_COMMAND_PLACEHOLDER) return;
  const nodeEntrypoint = resolveNodeEntrypointArg({
    integration,
    pluginRoot,
    rejectHardlinks: shouldRejectHardlinkedPluginFiles({
      origin: record.origin,
      rootDir: pluginRoot,
      env,
    }),
  });
  if (!nodeEntrypoint) return;
  const args = integration.args
    ?.map((arg, index) =>
      nodeEntrypoint && index === 0 ? nodeEntrypoint : resolveArg(arg, pluginRoot),
    )
    .filter((arg) => arg !== void 0);
  if (integration.args && args?.length !== integration.args.length) return;
  const trustedDirs = withNodeCommandTrustedDir(integration.command, pluginRoot);
  return {
    source: "exec",
    command: process.execPath,
    ...(args ? { args } : {}),
    ...(integration.timeoutMs !== void 0 ? { timeoutMs: integration.timeoutMs } : {}),
    ...(integration.noOutputTimeoutMs !== void 0
      ? { noOutputTimeoutMs: integration.noOutputTimeoutMs }
      : {}),
    ...(integration.maxOutputBytes !== void 0
      ? { maxOutputBytes: integration.maxOutputBytes }
      : {}),
    ...(integration.jsonOnly === false ? { jsonOnly: false } : {}),
    ...(integration.env ? { env: integration.env } : {}),
    ...(integration.passEnv ? { passEnv: integration.passEnv } : {}),
    trustedDirs,
    ...(integration.command === NODE_COMMAND_PLACEHOLDER || integration.allowInsecurePath
      ? { allowInsecurePath: true }
      : {}),
  };
}
function canExposeSecretProviderIntegrations(params) {
  if (params.record.origin !== "bundled" && params.record.origin !== "global") return false;
  return isActivatedManifestOwner({
    plugin: params.record,
    normalizedConfig: params.normalizedConfig,
    rootConfig: params.config,
  });
}
function integrationDisplayName(record, integrationId, integration) {
  return (
    normalizeOptionalString(integration.displayName) ??
    normalizeOptionalString(record.name) ??
    integrationId
  );
}
function createPluginIntegrationProviderConfig(params) {
  return {
    source: "exec",
    pluginIntegration: {
      pluginId: params.pluginId,
      integrationId: params.integrationId,
    },
  };
}
function isValidPluginIntegrationProviderId(value) {
  return value.length > 0 && value.length <= PLUGIN_INTEGRATION_PROVIDER_ID_MAX_LENGTH;
}
/** Narrows a secret provider config to the plugin-integration exec shape. */
function isPluginIntegrationSecretProviderConfig(value) {
  return (
    typeof value === "object" &&
    value !== null &&
    "source" in value &&
    value.source === "exec" &&
    "pluginIntegration" in value &&
    typeof value.pluginIntegration === "object" &&
    value.pluginIntegration !== null &&
    "pluginId" in value.pluginIntegration &&
    typeof value.pluginIntegration.pluginId === "string" &&
    value.pluginIntegration.pluginId.trim().length > 0 &&
    "integrationId" in value.pluginIntegration &&
    typeof value.pluginIntegration.integrationId === "string" &&
    value.pluginIntegration.integrationId.trim().length > 0
  );
}
/** Materializes an active trusted plugin secret-provider integration into an exec provider. */
/** Resolves a trusted plugin secret-provider integration into executable provider config. */
function resolveSecretProviderIntegrationConfig(params) {
  const config = params.config ?? {};
  const normalizedConfig = normalizePluginsConfig(config.plugins);
  const env = params.env ?? process.env;
  const { pluginId, integrationId } = params.providerConfig.pluginIntegration;
  if (!isValidSecretProviderAlias(params.providerAlias))
    return {
      ok: false,
      reason: `provider alias "${params.providerAlias}" is invalid`,
    };
  const record = params.manifestRegistry.plugins.find((candidate) => candidate.id === pluginId);
  if (!record)
    return {
      ok: false,
      reason: `plugin "${pluginId}" is not installed`,
    };
  if (
    !canExposeSecretProviderIntegrations({
      record,
      normalizedConfig,
      config,
    })
  )
    return {
      ok: false,
      reason: `plugin "${pluginId}" is not active or is not from a trusted install origin`,
    };
  const integration = record.secretProviderIntegrations?.[integrationId];
  if (!integration)
    return {
      ok: false,
      reason: `plugin "${record.id}" does not declare secret provider integration "${integrationId}"`,
    };
  const materialized = materializeExecProviderConfig(integration, record, env);
  if (!materialized)
    return {
      ok: false,
      reason: `plugin "${record.id}" integration "${integrationId}" could not be materialized`,
    };
  return {
    ok: true,
    providerConfig: materialized,
  };
}
/** Lists plugin secret-provider presets available to interactive configure flows. */
function listSecretProviderIntegrationPresets(params) {
  const presets = [];
  const config = params.config ?? {};
  const normalizedConfig = normalizePluginsConfig(config.plugins);
  const env = params.env ?? process.env;
  for (const record of params.manifestRegistry.plugins) {
    if (
      !canExposeSecretProviderIntegrations({
        record,
        normalizedConfig,
        config,
      })
    )
      continue;
    for (const [integrationId, integration] of Object.entries(
      record.secretProviderIntegrations ?? {},
    )) {
      const providerAlias = normalizeOptionalString(integration.providerAlias) ?? integrationId;
      if (
        !isValidSecretProviderAlias(providerAlias) ||
        !isValidPluginIntegrationProviderId(record.id) ||
        !isValidPluginIntegrationProviderId(integrationId)
      )
        continue;
      if (!materializeExecProviderConfig(integration, record, env)) continue;
      presets.push({
        id: integrationId,
        pluginId: record.id,
        providerAlias,
        displayName: integrationDisplayName(record, integrationId, integration),
        ...(integration.description ? { description: integration.description } : {}),
        providerConfig: createPluginIntegrationProviderConfig({
          pluginId: record.id,
          integrationId,
        }),
      });
    }
  }
  return presets.toSorted((left, right) =>
    `${left.displayName}:${left.providerAlias}`.localeCompare(
      `${right.displayName}:${right.providerAlias}`,
    ),
  );
}
//#endregion
//#region src/secrets/resolve.ts
/** Resolves SecretRef values from env, file, and exec secret providers. */
const DEFAULT_PROVIDER_CONCURRENCY = 4;
const DEFAULT_MAX_REFS_PER_PROVIDER = 512;
const DEFAULT_MAX_BATCH_BYTES = 256 * 1024;
const DEFAULT_FILE_MAX_BYTES = 1024 * 1024;
const DEFAULT_FILE_TIMEOUT_MS = 5e3;
const DEFAULT_EXEC_TIMEOUT_MS = 5e3;
const DEFAULT_EXEC_MAX_OUTPUT_BYTES = 1024 * 1024;
const SAFE_EXEC_ERROR_CODES = /* @__PURE__ */ new Set(["AMBIGUOUS_DUPLICATE_KEY", "NOT_FOUND"]);
const WINDOWS_ABS_PATH_PATTERN = /^[A-Za-z]:[\\/]/;
const WINDOWS_UNC_PATH_PATTERN = /^\\\\[^\\]+\\[^\\]+/;
/** Error for failures that affect an entire configured secret provider. */
/** Error emitted when a configured secret provider cannot resolve a ref. */
var SecretProviderResolutionError = class extends Error {
  constructor(params) {
    super(params.message, params.cause !== void 0 ? { cause: params.cause } : void 0);
    this.scope = "provider";
    this.name = "SecretProviderResolutionError";
    this.source = params.source;
    this.provider = params.provider;
  }
};
/** Error for failures limited to one SecretRef id under a provider. */
var SecretRefResolutionError = class extends Error {
  constructor(params) {
    super(params.message, params.cause !== void 0 ? { cause: params.cause } : void 0);
    this.scope = "ref";
    this.name = "SecretRefResolutionError";
    this.source = params.source;
    this.provider = params.provider;
    this.refId = params.refId;
  }
};
/** Type guard for provider-scoped secret resolution failures. */
function isProviderScopedSecretResolutionError(value) {
  return value instanceof SecretProviderResolutionError;
}
function isSecretResolutionError(value) {
  return (
    value instanceof SecretProviderResolutionError || value instanceof SecretRefResolutionError
  );
}
function providerResolutionError(params) {
  return new SecretProviderResolutionError(params);
}
function refResolutionError(params) {
  return new SecretRefResolutionError(params);
}
function throwUnknownProviderResolutionError(params) {
  if (isSecretResolutionError(params.err)) throw params.err;
  throw providerResolutionError({
    source: params.source,
    provider: params.provider,
    message: formatErrorMessage(params.err),
    cause: params.err,
  });
}
async function readFileStatOrThrow(pathname, label) {
  const stat = await safeStat(pathname);
  if (!stat.ok) throw new Error(`${label} is not readable: ${pathname}`);
  if (stat.isDir) throw new Error(`${label} must be a file: ${pathname}`);
  return stat;
}
function isAbsolutePathname(value) {
  return (
    path.isAbsolute(value) ||
    WINDOWS_ABS_PATH_PATTERN.test(value) ||
    WINDOWS_UNC_PATH_PATTERN.test(value)
  );
}
function resolveResolutionLimits(config) {
  const resolution = config.secrets?.resolution;
  return {
    maxProviderConcurrency: normalizePositiveInt(
      resolution?.maxProviderConcurrency,
      DEFAULT_PROVIDER_CONCURRENCY,
    ),
    maxRefsPerProvider: normalizePositiveInt(
      resolution?.maxRefsPerProvider,
      DEFAULT_MAX_REFS_PER_PROVIDER,
    ),
    maxBatchBytes: normalizePositiveInt(resolution?.maxBatchBytes, DEFAULT_MAX_BATCH_BYTES),
  };
}
function toProviderKey(source, provider) {
  return `${source}:${provider}`;
}
function resolveConfiguredProvider(params) {
  const { ref, config } = params;
  const providerConfig = config.secrets?.providers?.[ref.provider];
  if (!providerConfig) {
    if (ref.source === "env" && ref.provider === resolveDefaultSecretProviderAlias(config, "env"))
      return { source: "env" };
    throw providerResolutionError({
      source: ref.source,
      provider: ref.provider,
      message: `Secret provider "${ref.provider}" is not configured (ref: ${ref.source}:${ref.provider}:${ref.id}).`,
    });
  }
  if (providerConfig.source !== ref.source)
    throw providerResolutionError({
      source: ref.source,
      provider: ref.provider,
      message: `Secret provider "${ref.provider}" has source "${providerConfig.source}" but ref requests "${ref.source}".`,
    });
  if (isPluginIntegrationSecretProviderConfig(providerConfig)) {
    const resolved = resolveSecretProviderIntegrationConfig({
      manifestRegistry:
        params.manifestRegistry ??
        getCurrentPluginMetadataSnapshot({
          config,
          env: params.env,
          allowWorkspaceScopedSnapshot: true,
        })?.manifestRegistry ??
        loadPluginManifestRegistry({
          config,
          env: params.env,
        }),
      providerAlias: ref.provider,
      providerConfig,
      config,
      env: params.env,
    });
    if (!resolved.ok)
      throw providerResolutionError({
        source: ref.source,
        provider: ref.provider,
        message: `Secret provider "${ref.provider}" plugin integration is unavailable: ${resolved.reason}.`,
      });
    return resolved.providerConfig;
  }
  return providerConfig;
}
async function assertSecurePath(params) {
  if (!isAbsolutePathname(params.targetPath))
    throw new Error(`${params.label} must be an absolute path.`);
  let effectivePath = params.targetPath;
  let stat = await readFileStatOrThrow(effectivePath, params.label);
  if (stat.isSymlink) {
    if (!params.allowSymlinkPath)
      throw new Error(`${params.label} must not be a symlink: ${effectivePath}`);
    try {
      effectivePath = await fs$1.realpath(effectivePath);
    } catch {
      throw new Error(`${params.label} symlink target is not readable: ${params.targetPath}`);
    }
    if (!isAbsolutePathname(effectivePath))
      throw new Error(`${params.label} resolved symlink target must be an absolute path.`);
    stat = await readFileStatOrThrow(effectivePath, params.label);
    if (stat.isSymlink)
      throw new Error(`${params.label} symlink target must not be a symlink: ${effectivePath}`);
  }
  if (params.trustedDirs && params.trustedDirs.length > 0) {
    if (
      !params.trustedDirs
        .map((entry) => resolveUserPath(entry))
        .some((dir) => isPathInside(dir, effectivePath))
    )
      throw new Error(`${params.label} is outside trustedDirs: ${effectivePath}`);
  }
  if (params.allowInsecurePath) return effectivePath;
  const perms = await inspectPathPermissions(effectivePath);
  if (!perms.ok)
    throw new Error(`${params.label} permissions could not be verified: ${effectivePath}`);
  const writableByOthers = perms.worldWritable || perms.groupWritable;
  const readableByOthers = perms.worldReadable || perms.groupReadable;
  if (writableByOthers || (!params.allowReadableByOthers && readableByOthers))
    throw new Error(`${params.label} permissions are too open: ${effectivePath}`);
  if (process.platform === "win32" && perms.source === "unknown")
    throw new Error(
      `${params.label} ACL verification unavailable on Windows for ${effectivePath}. Set allowInsecurePath=true for this provider to bypass this check when the path is trusted.`,
    );
  if (process.platform !== "win32" && typeof process.getuid === "function" && stat.uid != null) {
    const uid = process.getuid();
    if (stat.uid !== uid)
      throw new Error(
        `${params.label} must be owned by the current user (uid=${uid}): ${effectivePath}`,
      );
  }
  return effectivePath;
}
async function readFileProviderPayload(params) {
  const cacheKey = params.providerName;
  const cache = params.cache;
  const cachedFilePayload = cache?.filePayloadByProvider?.get(cacheKey);
  if (cachedFilePayload) return await cachedFilePayload;
  const filePath = resolveUserPath(params.providerConfig.path);
  const readPromise = (async () => {
    const timeoutMs = normalizePositiveTimerMs(
      params.providerConfig.timeoutMs,
      DEFAULT_FILE_TIMEOUT_MS,
    );
    const maxBytes = normalizePositiveInt(params.providerConfig.maxBytes, DEFAULT_FILE_MAX_BYTES);
    try {
      const { buffer: payload } = await readSecureFile({
        filePath,
        label: `secrets.providers.${params.providerName}.path`,
        io: {
          maxBytes,
          timeoutMs,
        },
        permissions: { allowInsecure: params.providerConfig.allowInsecurePath },
      });
      const text = payload.toString("utf8").replace(/^\uFEFF/, "");
      if (params.providerConfig.mode === "singleValue") return text.replace(/\r?\n$/, "");
      const parsed = JSON.parse(text);
      if (!isRecord(parsed))
        throw new Error(`File provider "${params.providerName}" payload is not a JSON object.`);
      return parsed;
    } catch (error) {
      if (error instanceof FsSafeError && error.code === "timeout")
        throw new Error(`File provider "${params.providerName}" timed out after ${timeoutMs}ms.`, {
          cause: error,
        });
      throw error;
    }
  })();
  if (cache) {
    cache.filePayloadByProvider ??= /* @__PURE__ */ new Map();
    cache.filePayloadByProvider.set(cacheKey, readPromise);
  }
  return await readPromise;
}
async function resolveEnvRefs(params) {
  const resolved = /* @__PURE__ */ new Map();
  const allowlist = params.providerConfig.allowlist
    ? new Set(params.providerConfig.allowlist)
    : null;
  for (const ref of params.refs) {
    if (allowlist && !allowlist.has(ref.id))
      throw refResolutionError({
        source: "env",
        provider: params.providerName,
        refId: ref.id,
        message: `Environment variable "${ref.id}" is not allowlisted in secrets.providers.${params.providerName}.allowlist.`,
      });
    const envValue = params.env[ref.id];
    if (!isNonEmptyString(envValue))
      throw refResolutionError({
        source: "env",
        provider: params.providerName,
        refId: ref.id,
        message: `Environment variable "${ref.id}" is missing or empty.`,
      });
    resolved.set(ref.id, envValue);
  }
  return resolved;
}
async function resolveFileRefs(params) {
  let payload;
  try {
    payload = await readFileProviderPayload({
      providerName: params.providerName,
      providerConfig: params.providerConfig,
      cache: params.cache,
    });
  } catch (err) {
    throwUnknownProviderResolutionError({
      source: "file",
      provider: params.providerName,
      err,
    });
  }
  const mode = params.providerConfig.mode ?? "json";
  const resolved = /* @__PURE__ */ new Map();
  if (mode === "singleValue") {
    for (const ref of params.refs) {
      if (ref.id !== "value")
        throw refResolutionError({
          source: "file",
          provider: params.providerName,
          refId: ref.id,
          message: `singleValue file provider "${params.providerName}" expects ref id "${SINGLE_VALUE_FILE_REF_ID}".`,
        });
      resolved.set(ref.id, payload);
    }
    return resolved;
  }
  for (const ref of params.refs)
    try {
      resolved.set(ref.id, readJsonPointer(payload, ref.id, { onMissing: "throw" }));
    } catch (err) {
      throw refResolutionError({
        source: "file",
        provider: params.providerName,
        refId: ref.id,
        message: formatErrorMessage(err),
        cause: err,
      });
    }
  return resolved;
}
function parseExecValues(params) {
  const trimmed = params.stdout.trim();
  if (!trimmed)
    throw providerResolutionError({
      source: "exec",
      provider: params.providerName,
      message: `Exec provider "${params.providerName}" returned empty stdout.`,
    });
  let parsed;
  if (!params.jsonOnly && params.ids.length === 1)
    try {
      parsed = JSON.parse(trimmed);
    } catch {
      return { [expectDefined(params.ids[0], "ids entry at 0")]: trimmed };
    }
  else
    try {
      parsed = JSON.parse(trimmed);
    } catch {
      throw providerResolutionError({
        source: "exec",
        provider: params.providerName,
        message: `Exec provider "${params.providerName}" returned invalid JSON.`,
      });
    }
  if (!isRecord(parsed)) {
    if (!params.jsonOnly && params.ids.length === 1 && typeof parsed === "string")
      return { [expectDefined(params.ids[0], "ids entry at 0")]: parsed };
    throw providerResolutionError({
      source: "exec",
      provider: params.providerName,
      message: `Exec provider "${params.providerName}" response must be an object.`,
    });
  }
  if (parsed.protocolVersion !== 1)
    throw providerResolutionError({
      source: "exec",
      provider: params.providerName,
      message: `Exec provider "${params.providerName}" protocolVersion must be 1.`,
    });
  const responseValues = parsed.values;
  if (!isRecord(responseValues))
    throw providerResolutionError({
      source: "exec",
      provider: params.providerName,
      message: `Exec provider "${params.providerName}" response missing "values".`,
    });
  const responseErrors = isRecord(parsed.errors) ? parsed.errors : null;
  const out = {};
  for (const id of params.ids) {
    if (responseErrors && Object.hasOwn(responseErrors, id)) {
      const entry = responseErrors[id];
      const code = isRecord(entry) && typeof entry.code === "string" ? entry.code : null;
      const safeCode = code && SAFE_EXEC_ERROR_CODES.has(code) ? code : null;
      throw refResolutionError({
        source: "exec",
        provider: params.providerName,
        refId: id,
        message: `Exec provider "${params.providerName}" failed for id "${id}"${safeCode ? ` (${safeCode})` : ""}.`,
      });
    }
    if (!Object.hasOwn(responseValues, id))
      throw refResolutionError({
        source: "exec",
        provider: params.providerName,
        refId: id,
        message: `Exec provider "${params.providerName}" response missing id "${id}".`,
      });
    out[id] = responseValues[id];
  }
  return out;
}
async function resolveExecRefs(params) {
  const ids = uniqueStrings(params.refs.map((ref) => ref.id));
  if (ids.length > params.limits.maxRefsPerProvider)
    throw providerResolutionError({
      source: "exec",
      provider: params.providerName,
      message: `Exec provider "${params.providerName}" exceeded maxRefsPerProvider (${params.limits.maxRefsPerProvider}).`,
    });
  const commandPath = resolveUserPath(params.providerConfig.command);
  let secureCommandPath;
  try {
    secureCommandPath = await assertSecurePath({
      targetPath: commandPath,
      label: `secrets.providers.${params.providerName}.command`,
      trustedDirs: params.providerConfig.trustedDirs,
      allowInsecurePath: params.providerConfig.allowInsecurePath,
      allowReadableByOthers: true,
      allowSymlinkPath: params.providerConfig.allowSymlinkCommand,
    });
  } catch (err) {
    throwUnknownProviderResolutionError({
      source: "exec",
      provider: params.providerName,
      err,
    });
  }
  const requestPayload = {
    protocolVersion: 1,
    provider: params.providerName,
    ids,
  };
  const input = JSON.stringify(requestPayload);
  if (Buffer.byteLength(input, "utf8") > params.limits.maxBatchBytes)
    throw providerResolutionError({
      source: "exec",
      provider: params.providerName,
      message: `Exec provider "${params.providerName}" request exceeded maxBatchBytes (${params.limits.maxBatchBytes}).`,
    });
  const childEnv = {};
  for (const key of params.providerConfig.passEnv ?? []) {
    const value = params.env[key];
    if (value !== void 0) childEnv[key] = value;
  }
  for (const [key, value] of Object.entries(params.providerConfig.env ?? {})) childEnv[key] = value;
  const timeoutMs = normalizePositiveTimerMs(
    params.providerConfig.timeoutMs,
    DEFAULT_EXEC_TIMEOUT_MS,
  );
  const noOutputTimeoutMs = normalizePositiveTimerMs(
    params.providerConfig.noOutputTimeoutMs,
    timeoutMs,
  );
  const maxOutputBytes = normalizePositiveInt(
    params.providerConfig.maxOutputBytes,
    DEFAULT_EXEC_MAX_OUTPUT_BYTES,
  );
  const jsonOnly = params.providerConfig.jsonOnly ?? true;
  let result;
  try {
    result = await runCommandWithTimeout(
      [secureCommandPath, ...(params.providerConfig.args ?? [])],
      {
        baseEnv: {},
        cwd: path.dirname(secureCommandPath),
        env: childEnv,
        input,
        killProcessTree: true,
        maxCombinedOutputBytes: maxOutputBytes,
        maxOutputBytes,
        noOutputTimeoutMs,
        outputCapture: "head",
        terminateOnOutputLimit: true,
        timeoutMs,
      },
    );
  } catch (err) {
    throwUnknownProviderResolutionError({
      source: "exec",
      provider: params.providerName,
      err,
    });
  }
  if (result.termination === "timeout")
    throw providerResolutionError({
      source: "exec",
      provider: params.providerName,
      message: `Exec provider "${params.providerName}" timed out after ${timeoutMs}ms.`,
    });
  if (result.termination === "no-output-timeout")
    throw providerResolutionError({
      source: "exec",
      provider: params.providerName,
      message: `Exec provider "${params.providerName}" produced no output for ${noOutputTimeoutMs}ms.`,
    });
  if (result.outputLimitExceeded)
    throw providerResolutionError({
      source: "exec",
      provider: params.providerName,
      message: `Exec provider output exceeded maxOutputBytes (${maxOutputBytes}).`,
    });
  if (result.code !== 0)
    throw providerResolutionError({
      source: "exec",
      provider: params.providerName,
      message: `Exec provider "${params.providerName}" exited with code ${String(result.code)}.`,
    });
  let values;
  try {
    values = parseExecValues({
      providerName: params.providerName,
      ids,
      stdout: result.stdout,
      jsonOnly,
    });
  } catch (err) {
    throwUnknownProviderResolutionError({
      source: "exec",
      provider: params.providerName,
      err,
    });
  }
  const resolved = /* @__PURE__ */ new Map();
  for (const id of ids) resolved.set(id, values[id]);
  return resolved;
}
async function resolveProviderRefs(params) {
  try {
    if (params.providerConfig.source === "env")
      return await resolveEnvRefs({
        refs: params.refs,
        providerName: params.providerName,
        providerConfig: params.providerConfig,
        env: params.options.env ?? process.env,
      });
    if (params.providerConfig.source === "file")
      return await resolveFileRefs({
        refs: params.refs,
        providerName: params.providerName,
        providerConfig: params.providerConfig,
        cache: params.options.cache,
      });
    if (params.providerConfig.source === "exec") {
      if (isPluginIntegrationSecretProviderConfig(params.providerConfig))
        throw providerResolutionError({
          source: params.source,
          provider: params.providerName,
          message: `Secret provider "${params.providerName}" plugin integration was not materialized before exec resolution.`,
        });
      return await resolveExecRefs({
        refs: params.refs,
        providerName: params.providerName,
        providerConfig: params.providerConfig,
        env: params.options.env ?? process.env,
        limits: params.limits,
      });
    }
    throw providerResolutionError({
      source: params.source,
      provider: params.providerName,
      message: `Unsupported secret provider source "${String(params.providerConfig.source)}".`,
    });
  } catch (err) {
    return throwUnknownProviderResolutionError({
      source: params.source,
      provider: params.providerName,
      err,
    });
  }
}
/** Resolves a batch of SecretRefs, grouped by provider for bounded provider concurrency. */
async function resolveSecretRefValues(refs, options) {
  if (refs.length === 0) return /* @__PURE__ */ new Map();
  const limits = resolveResolutionLimits(options.config);
  const uniqueRefs = /* @__PURE__ */ new Map();
  for (const ref of refs) {
    const id = ref.id.trim();
    if (!id) throw new Error("Secret reference id is empty.");
    if (!isValidSecretProviderAlias(ref.provider))
      throw new Error(
        `Secret reference provider must match /^[a-z][a-z0-9_-]{0,63}$/ (ref: ${ref.source}:${ref.provider}:${id}).`,
      );
    if (ref.source === "env" && !isValidEnvSecretRefId(id))
      throw new Error(
        `Env secret reference id must match /^[A-Z][A-Z0-9_]{0,127}$/ (ref: ${ref.source}:${ref.provider}:${id}).`,
      );
    if (ref.source === "file" && !isValidFileSecretRefId(id))
      throw new Error(
        `File secret reference id must be an absolute JSON pointer or "value" (ref: ${ref.source}:${ref.provider}:${id}).`,
      );
    if (ref.source === "exec" && !isValidExecSecretRefId(id))
      throw new Error(
        `${formatExecSecretRefIdValidationMessage()} (ref: ${ref.source}:${ref.provider}:${id}).`,
      );
    uniqueRefs.set(secretRefKey(ref), {
      ...ref,
      id,
    });
  }
  const grouped = /* @__PURE__ */ new Map();
  for (const ref of uniqueRefs.values()) {
    const key = toProviderKey(ref.source, ref.provider);
    const existing = grouped.get(key);
    if (existing) {
      existing.refs.push(ref);
      continue;
    }
    grouped.set(key, {
      source: ref.source,
      providerName: ref.provider,
      refs: [ref],
    });
  }
  const taskResults = await runTasksWithConcurrency({
    tasks: [...grouped.values()].map((group) => async () => {
      if (group.refs.length > limits.maxRefsPerProvider)
        throw providerResolutionError({
          source: group.source,
          provider: group.providerName,
          message: `Secret provider "${group.providerName}" exceeded maxRefsPerProvider (${limits.maxRefsPerProvider}).`,
        });
      const providerConfig = resolveConfiguredProvider({
        ref: expectDefined(group.refs[0], "refs entry at 0"),
        config: options.config,
        env: options.env ?? process.env,
        manifestRegistry: options.manifestRegistry,
      });
      return {
        group,
        values: await resolveProviderRefs({
          refs: group.refs,
          source: group.source,
          providerName: group.providerName,
          providerConfig,
          options,
          limits,
        }),
      };
    }),
    limit: limits.maxProviderConcurrency,
    errorMode: "stop",
  });
  if (taskResults.hasError) throw taskResults.firstError;
  const resolved = /* @__PURE__ */ new Map();
  for (const result of taskResults.results)
    for (const ref of result.group.refs) {
      if (!result.values.has(ref.id))
        throw refResolutionError({
          source: result.group.source,
          provider: result.group.providerName,
          refId: ref.id,
          message: `Secret provider "${result.group.providerName}" did not return id "${ref.id}".`,
        });
      resolved.set(secretRefKey(ref), result.values.get(ref.id));
    }
  return resolved;
}
/** Resolves one SecretRef, using the optional shared runtime cache. */
/** Resolves one SecretRef to an unknown value using configured provider state. */
async function resolveSecretRefValue(ref, options) {
  const cache = options.cache;
  const key = secretRefKey(ref);
  const cachedResolvedValue = cache?.resolvedByRefKey?.get(key);
  if (cachedResolvedValue) return await cachedResolvedValue;
  const promise = (async () => {
    const resolved = await resolveSecretRefValues([ref], options);
    if (!resolved.has(key))
      throw refResolutionError({
        source: ref.source,
        provider: ref.provider,
        refId: ref.id,
        message: `Secret reference "${key}" resolved to no value.`,
      });
    return resolved.get(key);
  })();
  if (cache) {
    cache.resolvedByRefKey ??= /* @__PURE__ */ new Map();
    cache.resolvedByRefKey.set(key, promise);
  }
  return await promise;
}
/** Resolves one SecretRef and requires a non-empty string result. */
async function resolveSecretRefString(ref, options) {
  const resolved = await resolveSecretRefValue(ref, options);
  if (!isNonEmptyString(resolved))
    throw new Error(
      `Secret reference "${ref.source}:${ref.provider}:${ref.id}" resolved to a non-string or empty value.`,
    );
  return resolved;
}
//#endregion
export {
  isPluginIntegrationSecretProviderConfig as a,
  resolveSecretRefValues as i,
  resolveSecretRefString as n,
  listSecretProviderIntegrationPresets as o,
  resolveSecretRefValue as r,
  resolveSecretProviderIntegrationConfig as s,
  isProviderScopedSecretResolutionError as t,
};
