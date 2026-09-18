import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import "./src-Bl7G9qvi.js";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
import JSON5 from "json5";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import {
  c as resolveDefaultAgentId,
  o as resolveAgentWorkspaceDir,
} from "./agent-scope-config-DVIR1nBa.js";
import { t as sanitizeForLog } from "./ansi-D4OHEz5F.js";
import {
  i as isPathWithinRoot,
  n as isAvatarDataUrl,
  o as isWindowsAbsolutePath,
  r as isAvatarHttpUrl,
  t as hasAvatarUriScheme,
} from "./avatar-policy-CTkphvvu.js";
import { n as shouldSuppressMissingCodexPluginDiagnostics } from "./codex-plugin-diagnostics-DxsLhCf5.js";
import "./utils-DtcDeqWS.js";
import {
  c as getPublishedConfigRuntimeEnvState,
  n as cloneEnvWithPlatformSemantics,
  s as createConfigRuntimeEnvBase,
  t as applyConfigEnvVars,
  v as shouldWarnOnTouchedVersion,
} from "./config-env-vars-CwdMUFhk.js";
import {
  i as unsetConfigValueAtPath,
  n as parseConfigPath,
  r as setConfigValueAtPath,
} from "./config-paths-DWVgrOEC.js";
import {
  c as normalizePluginsConfig,
  f as resolveMemorySlotDecision,
  o as normalizePluginId,
  u as resolveEffectivePluginActivationState,
} from "./config-state-C1Qyxaws.js";
import { r as collectConfiguredModelRefs } from "./configured-model-refs-wBBEGQ5a.js";
import {
  _ as normalizeConfiguredProviderCatalogModelId,
  h as collectManifestModelIdNormalizationPolicies,
} from "./current-plugin-metadata-snapshot-DGhQ40qh.js";
import { t as DEFAULT_CONTEXT_TOKENS } from "./defaults-CdX9UGcX.js";
import {
  a as resolveChannelDmAllowFrom,
  o as resolveChannelDmPolicy,
} from "./dm-access-Bq5cULcy.js";
import { t as loadDotEnv } from "./dotenv-CrR8ttZb.js";
import { n as isTruthyEnvValue } from "./env-Di-LcxqW.js";
import {
  n as containsEnvVarReference,
  r as resolveConfigEnvVars,
} from "./env-substitution-BDfwDlDU.js";
import {
  n as extractErrorCode,
  r as formatErrorMessage,
  t as collectErrorGraphCandidates,
} from "./errors-BoHeli7m.js";
import {
  i as normalizeTrustedSafeBinDirs,
  u as normalizeSafeBinProfileFixtures,
} from "./exec-safe-bin-trust-BJ49w6Hv.js";
import "./path-guards-CBe_wA_B.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { t as GATEWAY_CONFIG_SELECTION_ENV_KEYS } from "./gateway-env-selection-ChuJZBvC.js";
import { a as createConfigValidationMetadataPluginIdScope } from "./gateway-startup-plugin-ids-C7oHc3ol.js";
import {
  n as isUnsafeGatewayTailscaleNoAuth,
  t as formatUnsafeGatewayTailscaleNoAuthMessage,
} from "./gateway-tailscale-auth-policy-DLytnhv-.js";
import { t as isVerbose } from "./global-state-BAD7XgmL.js";
import { c as resolveUserPath, o as resolveRequiredHomeDir } from "./home-dir-DxrrpDft.js";
import "./agent-scope-y9xQv_q1.js";
import { i as GENERATED_BUNDLED_CHANNEL_CONFIG_METADATA } from "./ids-lBaN9yr4.js";
import "./session-key-druuY-GG.js";
import {
  a as hashConfigIncludeRaw,
  c as resolveConfigIncludes,
  n as ConfigIncludeError,
  o as readConfigIncludeFileWithGuards,
  s as resolveConfigIncludeWritePath,
} from "./includes-C1dGj2Ja.js";
import { n as loadInstalledPluginIndexInstallRecordsSync } from "./installed-plugin-index-record-reader-D7CXgzhH.js";
import { c as writePersistedInstalledPluginIndexInstallRecordsSync } from "./installed-plugin-index-records-BP7rp3ti.js";
import {
  a as formatConfigOverwriteLogMessage,
  c as snapshotConfigAuditProcessInfo,
  i as finalizeConfigWriteAuditRecord,
  n as appendConfigAuditRecordSync,
  r as createConfigWriteAuditRecordBase,
  t as appendConfigAuditRecord,
} from "./io.audit-C-LN6cFD.js";
import { i as throwInvalidConfig } from "./io.invalid-config-D9scyfF6.js";
import { f as isLoopbackIpAddress, i as isCanonicalDottedDecimalIPv4 } from "./ip-CyyRxPli.js";
import { r as formatConfigIssueSummary } from "./issue-format-IJKFr2SL.js";
import { n as resolveManifestCommandAliasOwnerInRegistry } from "./manifest-command-aliases-DrFybOtt.js";
import { n as planManifestModelCatalogSuppressions } from "./manifest-planner-DSmSdykb.js";
import { t as applyMergePatch } from "./merge-patch-r9Hm65ir.js";
import {
  n as normalizeAgentModelRefForConfig,
  t as normalizeAgentModelMapForConfig,
} from "./model-input-B7OGjVYg.js";
import { n as assertConfigWriteAllowedInCurrentMode } from "./nix-mode-write-guard-e6xDJfpJ.js";
import {
  d as resolveOfficialExternalPluginInstall,
  t as getOfficialExternalPluginCatalogEntry,
} from "./official-external-plugin-catalog-B2V9K3em.js";
import {
  L as executeSqliteQuerySync,
  l as runOpenClawStateWriteTransaction,
  s as openOpenClawStateDatabase,
  z as getNodeSqliteKysely,
} from "./openclaw-state-db-Bsa8Tv1Z.js";
import { t as parseJsonWithJson5Fallback } from "./parse-json-compat-CmZHj-1e.js";
import { t as parseConfigPathArrayIndex } from "./path-array-index-CvEcUJa-.js";
import { i as isPathInside } from "./path-DILYn_gk.js";
import {
  c as resolveConfigPath,
  p as resolveIncludeRoots,
  y as resolveStateDir,
} from "./paths-DEklnbzU.js";
import { t as isPlainObject } from "./plain-object-jVBUx3XB.js";
import {
  n as stripShippedPluginInstallConfigRecords,
  t as extractShippedPluginInstallConfigRecords,
} from "./plugin-install-config-migration-Ba4BJKHA.js";
import { a as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-BMgImu0m.js";
import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.js";
import { r as normalizeProviderId } from "./provider-id-BIcU_2-A.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import {
  r as shouldAttemptLastKnownGoodRecovery,
  t as isPluginLocalInvalidConfigSnapshot,
} from "./recovery-policy-CsUZ07YX.js";
import { n as replaceFileAtomic } from "./replace-file-CaPU6XwS.js";
import { n as replaceFileAtomicSync } from "./replace-file-DfwQ8_Mi.js";
import { n as ok, t as err } from "./result-BQGgYouL.js";
import {
  c as hasManagedRuntimeConfigWriteOwner,
  d as notifyRuntimeConfigWriteListeners,
  f as preflightManagedRuntimeConfigWrite,
  h as registerRuntimeConfigWriteListener,
  i as getRuntimeConfigSnapshot,
  m as registerManagedRuntimeConfigWriteOwner,
  n as createRuntimeConfigWriteNotification,
  o as getRuntimeConfigSnapshotRefreshHandler,
  p as preflightRuntimeSnapshotWrite,
  r as finalizeRuntimeSnapshotWrite,
  s as getRuntimeConfigSourceSnapshot,
  u as loadPinnedRuntimeConfig,
} from "./runtime-snapshot-BbbqRiDR.js";
import { t as sanitizeTerminalText } from "./safe-text-DiGQuw-e.js";
import {
  a as summarizeAllowedValues,
  i as appendAllowedValuesHint,
  t as validateJsonSchemaValue,
} from "./schema-validator-BAYKPBuJ.js";
import {
  a as resolveShellEnvFallbackTimeoutMs,
  i as loadShellEnvFallback,
  o as shouldDeferShellEnvFallback,
  s as shouldEnableShellEnvFallback,
} from "./shell-env-DTBGUs4j.js";
import { t as resolveShellEnvExpectedKeys } from "./shell-env-expected-keys-CpWR7W7p.js";
import "./model-catalog-Djtgv3Hv.js";
import { t as sleep } from "./sleep-DZm1epyW.js";
import { r as hasKind } from "./slots-kpL659LX.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
} from "./string-coerce-DW4mBlAt.js";
import { n as normalizeTalkConfig } from "./talk-I2KUqKNv.js";
import { l as resolveBundledProviderPolicySurface } from "./thinking-CVcRbjTC.js";
import { s as coerceSecretRef } from "./types.secrets-BV0ywRAy.js";
import { n as VERSION } from "./version-CeFj_iGk.js";
import { t as resolveWebSearchInstallCatalogEntries } from "./web-search-install-catalog-BFwolsTM.js";
import { t as OpenClawSchema } from "./zod-schema-BY8YFj8I.js";
import {
  B as evaluateDmPolicyAllowFromDependency,
  V as isBuiltInModelProviderOverlayId,
} from "./zod-schema.core-CWTCY1ZZ.js";
//#region src/agents/owner-display.ts
/**
 * Owner display settings for prompt rendering.
 *
 * Hash mode uses a dedicated prompt-display secret so auth material is never reused for owner redaction.
 */
/**
 * Resolve owner display settings for prompt rendering.
 * Keep auth secrets decoupled from owner hash secrets.
 */
function resolveOwnerDisplaySetting(config) {
  const ownerDisplay = config?.commands?.ownerDisplay;
  if (ownerDisplay !== "hash")
    return {
      ownerDisplay,
      ownerDisplaySecret: void 0,
    };
  return {
    ownerDisplay: "hash",
    ownerDisplaySecret: normalizeOptionalString(config?.commands?.ownerDisplaySecret),
  };
}
/**
 * Ensure hash mode has a dedicated secret.
 * Returns updated config and generated secret when autofill was needed.
 */
function ensureOwnerDisplaySecret(
  config,
  generateSecret = () => crypto.randomBytes(32).toString("hex"),
) {
  const settings = resolveOwnerDisplaySetting(config);
  if (settings.ownerDisplay !== "hash" || settings.ownerDisplaySecret) return { config };
  const generatedSecret = generateSecret();
  return {
    config: {
      ...config,
      commands: {
        ...config.commands,
        ownerDisplay: "hash",
        ownerDisplaySecret: generatedSecret,
      },
    },
    generatedSecret,
  };
}
//#endregion
//#region src/config/agent-dirs.ts
/** Error thrown when multiple configured agents resolve to the same state directory. */
var DuplicateAgentDirError = class extends Error {
  constructor(duplicates) {
    super(formatDuplicateAgentDirError(duplicates));
    this.name = "DuplicateAgentDirError";
    this.duplicates = duplicates;
  }
};
function canonicalizeAgentDir(agentDir) {
  const resolved = path.resolve(agentDir);
  if (process.platform === "darwin" || process.platform === "win32")
    return normalizeLowercaseStringOrEmpty(resolved);
  return resolved;
}
function collectReferencedAgentIds(cfg) {
  const ids = /* @__PURE__ */ new Set();
  const agents = Array.isArray(cfg.agents?.list) ? cfg.agents?.list : [];
  const defaultAgentId = agents.find((agent) => agent?.default)?.id ?? agents[0]?.id ?? "main";
  ids.add(normalizeAgentId(defaultAgentId));
  for (const entry of agents) if (entry?.id) ids.add(normalizeAgentId(entry.id));
  const bindings = cfg.bindings;
  if (Array.isArray(bindings))
    for (const binding of bindings) {
      const id = binding?.agentId;
      if (typeof id === "string" && id.trim()) ids.add(normalizeAgentId(id));
    }
  return [...ids];
}
function resolveEffectiveAgentDir(cfg, agentId, deps) {
  const id = normalizeAgentId(agentId);
  const trimmed = (
    Array.isArray(cfg.agents?.list)
      ? cfg.agents?.list.find((agent) => normalizeAgentId(agent.id) === id)?.agentDir
      : void 0
  )?.trim();
  if (trimmed) return resolveUserPath(trimmed);
  const env = deps?.env ?? process.env;
  const root = resolveStateDir(
    env,
    deps?.homedir ?? (() => resolveRequiredHomeDir(env, os.homedir)),
  );
  return path.join(root, "agents", id, "agent");
}
/** Finds agent ids whose effective agentDir would share auth/session state. */
function findDuplicateAgentDirs(cfg, deps) {
  const byDir = /* @__PURE__ */ new Map();
  for (const agentId of collectReferencedAgentIds(cfg)) {
    const agentDir = resolveEffectiveAgentDir(cfg, agentId, deps);
    const key = canonicalizeAgentDir(agentDir);
    const entry = byDir.get(key);
    if (entry) entry.agentIds.push(agentId);
    else
      byDir.set(key, {
        agentDir,
        agentIds: [agentId],
      });
  }
  return [...byDir.values()].filter((v) => v.agentIds.length > 1);
}
/** Formats duplicate agentDir conflicts with the remediation operators should take. */
function formatDuplicateAgentDirError(dups) {
  return [
    "Duplicate agentDir detected (multi-agent config).",
    "Each agent must have a unique agentDir; sharing it causes auth/session state collisions and token invalidation.",
    "",
    "Conflicts:",
    ...dups.map((d) => `- ${d.agentDir}: ${d.agentIds.map((id) => `"${id}"`).join(", ")}`),
    "",
    "Fix: remove the shared agents.list[].agentDir override (or give each agent its own directory).",
    "If you want to share credentials, copy auth-profiles.json instead of sharing the entire agentDir.",
  ].join("\n");
}
//#endregion
//#region src/config/backup-rotation.ts
const CONFIG_BACKUP_COUNT = 5;
/**
 * Advances the config `.bak` ring before a new primary backup is copied in.
 *
 * Missing slots are ignored so interrupted writes or first-run configs do not
 * block the next config write.
 */
async function rotateConfigBackups(configPath, ioFs) {
  const backupBase = `${configPath}.bak`;
  const maxIndex = CONFIG_BACKUP_COUNT - 1;
  await ioFs.unlink(`${backupBase}.${maxIndex}`).catch(() => {});
  for (let index = maxIndex - 1; index >= 1; index -= 1)
    await ioFs.rename(`${backupBase}.${index}`, `${backupBase}.${index + 1}`).catch(() => {});
  await ioFs.rename(backupBase, `${backupBase}.1`).catch(() => {});
}
/**
 * Sets owner-only permissions on every backup slot when chmod exists.
 *
 * Backups are copied on mixed filesystems, so copy mode preservation is not a
 * portable security guarantee.
 */
async function hardenBackupPermissions(configPath, ioFs) {
  if (!ioFs.chmod) return;
  const backupBase = `${configPath}.bak`;
  await ioFs.chmod(backupBase, 384).catch(() => {});
  for (let i = 1; i < CONFIG_BACKUP_COUNT; i++)
    await ioFs.chmod(`${backupBase}.${i}`, 384).catch(() => {});
}
/** Prunes stale `.bak.*` files that are outside the managed numbered ring. */
async function cleanOrphanBackups(configPath, ioFs) {
  if (!ioFs.readdir) return;
  const dir = path.dirname(configPath);
  const bakPrefix = `${path.basename(configPath)}.bak.`;
  const validSuffixes = /* @__PURE__ */ new Set();
  for (let i = 1; i < CONFIG_BACKUP_COUNT; i++) validSuffixes.add(String(i));
  let entries;
  try {
    entries = await ioFs.readdir(dir);
  } catch {
    return;
  }
  for (const entry of entries) {
    if (!entry.startsWith(bakPrefix)) continue;
    const suffix = entry.slice(bakPrefix.length);
    if (validSuffixes.has(suffix)) continue;
    await ioFs.unlink(path.join(dir, entry)).catch(() => {});
  }
}
const preUpdateConfigSnapshotsWritten = /* @__PURE__ */ new Set();
/**
 * Captures the first on-disk config state for an update attempt.
 *
 * The snapshot is outside the rotating `.bak` ring so repeated writes during
 * one process keep an operator-visible rollback point for the original file.
 */
async function createPreUpdateConfigSnapshot(params) {
  if (!params.fs.existsSync(params.configPath)) return;
  const snapshotKey = path.resolve(params.configPath);
  if (preUpdateConfigSnapshotsWritten.has(snapshotKey)) return;
  preUpdateConfigSnapshotsWritten.add(snapshotKey);
  const snapshotPath = `${params.configPath}.pre-update`;
  try {
    const content = await params.fs.readFile(params.configPath, "utf-8");
    await params.fs.writeFile(snapshotPath, content, {
      encoding: "utf-8",
      mode: 384,
      flag: "w",
    });
  } catch {
    preUpdateConfigSnapshotsWritten.delete(snapshotKey);
  }
}
/** Runs rotation, primary copy, permission hardening, then orphan pruning. */
async function maintainConfigBackups(configPath, ioFs) {
  await rotateConfigBackups(configPath, ioFs);
  await ioFs.copyFile(configPath, `${configPath}.bak`).catch(() => {});
  await hardenBackupPermissions(configPath, ioFs);
  await cleanOrphanBackups(configPath, ioFs);
}
//#endregion
//#region src/config/env-preserve.ts
/**
 * Preserves `${VAR}` environment variable references during config write-back.
 *
 * When config is read, `${VAR}` references are resolved to their values.
 * When writing back, callers pass the resolved config. This module detects
 * values that match what a `${VAR}` reference would resolve to and restores
 * the original reference, so env var references survive config round-trips.
 *
 * A value is restored only if:
 * 1. The pre-substitution value contained a `${VAR}` pattern
 * 2. Resolving that pattern with current env vars produces the incoming value
 *
 * If a caller intentionally set a new value (different from what the env var
 * resolves to), the new value is kept as-is.
 */
const ENV_VAR_PATTERN = /\$\{[A-Z_][A-Z0-9_]*\}/;
const ENV_VAR_NAME_PATTERN = /^[A-Z_][A-Z0-9_]*$/;
var EnvRefArrayMutationError = class extends Error {
  constructor() {
    super("Config write would reorder or modify an array containing environment references.");
    this.name = "EnvRefArrayMutationError";
  }
};
/**
 * Check if a string contains any `${VAR}` env var references.
 */
function hasEnvVarRef(value) {
  return ENV_VAR_PATTERN.test(value);
}
function collectAuthoredEnvRefs(value) {
  const refs = [];
  for (let index = 0; index < value.length; index += 1) {
    if (value[index] !== "$") continue;
    const isEscaped = value[index + 1] === "$" && value[index + 2] === "{";
    const nameStart = index + (isEscaped ? 3 : 2);
    if (!isEscaped && value[index + 1] !== "{") continue;
    const nameEnd = value.indexOf("}", nameStart);
    if (nameEnd === -1 || !ENV_VAR_NAME_PATTERN.test(value.slice(nameStart, nameEnd))) continue;
    refs.push({
      kind: isEscaped ? "escaped" : "unescaped",
      name: value.slice(nameStart, nameEnd),
    });
    index = nameEnd;
  }
  return refs;
}
function hasUnescapedEnvVarRef(value) {
  return collectAuthoredEnvRefs(value).some((ref) => ref.kind === "unescaped");
}
function hasEscapedEnvVarRef(value) {
  return collectAuthoredEnvRefs(value).some((ref) => ref.kind === "escaped");
}
function containsAuthoredUnescapedEnvTemplate(value) {
  if (typeof value === "string") return hasUnescapedEnvVarRef(value);
  if (Array.isArray(value)) return value.some((item) => containsAuthoredUnescapedEnvTemplate(item));
  if (isPlainObject(value))
    return Object.values(value).some((item) => containsAuthoredUnescapedEnvTemplate(item));
  return false;
}
function containsAuthoredEscapedEnvTemplate(value) {
  if (typeof value === "string") return hasEscapedEnvVarRef(value);
  if (Array.isArray(value)) return value.some((item) => containsAuthoredEscapedEnvTemplate(item));
  if (isPlainObject(value))
    return Object.values(value).some((item) => containsAuthoredEscapedEnvTemplate(item));
  return false;
}
function countAuthoredEnvRefsByPath(value, kind) {
  const countsByName = /* @__PURE__ */ new Map();
  const visit = (item, path) => {
    if (typeof item === "string") {
      for (const ref of collectAuthoredEnvRefs(item))
        if (ref.kind === kind) {
          const pathCounts = countsByName.get(ref.name) ?? /* @__PURE__ */ new Map();
          const pathKey = JSON.stringify(path);
          pathCounts.set(pathKey, (pathCounts.get(pathKey) ?? 0) + 1);
          countsByName.set(ref.name, pathCounts);
        }
      return;
    }
    if (Array.isArray(item)) {
      item.forEach((child, index) => visit(child, [...path, String(index)]));
      return;
    }
    if (isPlainObject(item))
      Object.entries(item).forEach(([key, child]) => visit(child, [...path, key]));
  };
  visit(value, []);
  return countsByName;
}
function countResolvedActiveEnvRefsByPath(incoming, parsed, env) {
  const countsByName = /* @__PURE__ */ new Map();
  const visit = (incomingItem, parsedItem, path) => {
    if (typeof incomingItem === "string" && typeof parsedItem === "string") {
      if (!isDeepStrictEqual(incomingItem, tryResolveString(parsedItem, env))) return;
      for (const ref of collectAuthoredEnvRefs(parsedItem))
        if (ref.kind === "unescaped") {
          const pathCounts = countsByName.get(ref.name) ?? /* @__PURE__ */ new Map();
          const pathKey = JSON.stringify(path);
          pathCounts.set(pathKey, (pathCounts.get(pathKey) ?? 0) + 1);
          countsByName.set(ref.name, pathCounts);
        }
      return;
    }
    if (Array.isArray(incomingItem) && Array.isArray(parsedItem)) {
      parsedItem.forEach((child, index) =>
        visit(incomingItem[index], child, [...path, String(index)]),
      );
      return;
    }
    if (isPlainObject(incomingItem) && isPlainObject(parsedItem))
      Object.entries(parsedItem).forEach(([key, child]) =>
        visit(incomingItem[key], child, [...path, key]),
      );
  };
  visit(incoming, parsed, []);
  return countsByName;
}
function containsUnaccountedActiveEscapedEnvRef(
  incoming,
  escapedParsed,
  matchedIncoming,
  matchedParsed,
  env,
) {
  const escapedCounts = countAuthoredEnvRefsByPath(escapedParsed, "escaped");
  const incomingActiveCounts = countAuthoredEnvRefsByPath(incoming, "unescaped");
  const incomingEscapedCounts = countAuthoredEnvRefsByPath(incoming, "escaped");
  const matchedActiveCounts = countResolvedActiveEnvRefsByPath(matchedIncoming, matchedParsed, env);
  const matchedEscapedCounts = countAuthoredEnvRefsByPath(matchedParsed, "escaped");
  return [...escapedCounts].some(
    ([name, escapedPathCounts]) =>
      [...(incomingActiveCounts.get(name) ?? /* @__PURE__ */ new Map())].some(
        ([path, count]) => count > (matchedActiveCounts.get(name)?.get(path) ?? 0),
      ) ||
      [...escapedPathCounts.keys()].some((path) => {
        return (
          (incomingActiveCounts.get(name)?.get(path) ?? 0) > 0 &&
          (incomingEscapedCounts.get(name)?.get(path) ?? 0) <
            (matchedEscapedCounts.get(name)?.get(path) ?? 0)
        );
      }),
  );
}
function preservesAuthoredEscapedEnvRefs(incoming, parsed) {
  const parsedEscapedCounts = countAuthoredEnvRefsByPath(parsed, "escaped");
  const incomingEscapedCounts = countAuthoredEnvRefsByPath(incoming, "escaped");
  return [...parsedEscapedCounts].every(([name, parsedPathCounts]) =>
    [...parsedPathCounts].every(
      ([path, count]) => (incomingEscapedCounts.get(name)?.get(path) ?? 0) >= count,
    ),
  );
}
function getArrayIdentityPathValue(value, path) {
  let current = value;
  for (const segment of path) {
    if (!isPlainObject(current)) return;
    current = current[segment];
  }
  return current;
}
function collectStableArrayIdentityPaths(value) {
  if (!isPlainObject(value)) return [];
  for (const key of ["id", "agentId"]) {
    const child = value[key];
    if (typeof child === "string" && !hasEnvVarRef(child)) return [[key]];
  }
  return [];
}
function resolveStableArrayIdentityMatch(params) {
  const parsedItem = params.parsed[params.parsedIndex];
  const identityPaths = collectStableArrayIdentityPaths(parsedItem);
  if (identityPaths.length === 0) return { kind: "none" };
  let incomingIndex;
  let hasUniqueAuthoredIdentity = false;
  for (const identityPath of identityPaths) {
    const identityValue = getArrayIdentityPathValue(parsedItem, identityPath);
    if (
      params.parsed.filter((item) =>
        isDeepStrictEqual(getArrayIdentityPathValue(item, identityPath), identityValue),
      ).length !== 1
    )
      continue;
    hasUniqueAuthoredIdentity = true;
    const incomingMatches = params.incoming.flatMap((item, index) =>
      isDeepStrictEqual(getArrayIdentityPathValue(item, identityPath), identityValue)
        ? [index]
        : [],
    );
    if (
      incomingMatches.length !== 1 ||
      (incomingIndex !== void 0 && incomingIndex !== incomingMatches[0])
    )
      return { kind: "invalid" };
    incomingIndex = incomingMatches[0];
  }
  if (incomingIndex !== void 0)
    return {
      kind: "match",
      incomingIndex,
    };
  return hasUniqueAuthoredIdentity ? { kind: "invalid" } : { kind: "none" };
}
function collectLiteralArrayIdentityPaths(value, path = []) {
  if (typeof value === "string") return hasEnvVarRef(value) ? [] : [path];
  if (!isPlainObject(value)) return [];
  return Object.entries(value).flatMap(([key, child]) =>
    collectLiteralArrayIdentityPaths(child, [...path, key]),
  );
}
function hasStableSameIndexLiteralShape(params) {
  if (params.incoming.length !== params.parsed.length) return false;
  const parsedItem = params.parsed[params.parsedIndex];
  const literalPaths = collectLiteralArrayIdentityPaths(parsedItem);
  if (
    literalPaths.length === 0 ||
    literalPaths.some((identityPath) => {
      const identityValue = getArrayIdentityPathValue(parsedItem, identityPath);
      return !isDeepStrictEqual(
        getArrayIdentityPathValue(params.incoming[params.parsedIndex], identityPath),
        identityValue,
      );
    })
  )
    return false;
  return literalPaths.some((identityPath) => {
    const identityValue = getArrayIdentityPathValue(parsedItem, identityPath);
    const authoredCount = params.parsed.filter((item) =>
      isDeepStrictEqual(getArrayIdentityPathValue(item, identityPath), identityValue),
    ).length;
    const incomingCount = params.incoming.filter((item) =>
      isDeepStrictEqual(getArrayIdentityPathValue(item, identityPath), identityValue),
    ).length;
    return authoredCount === 1 && incomingCount === 1;
  });
}
function matchesArrayElementAtSameIndex(incoming, parsed, env) {
  return (
    isDeepStrictEqual(incoming, parsed) ||
    isDeepStrictEqual(incoming, resolveEnvVarRefsForComparison(parsed, env))
  );
}
function matchesRetainedArrayItem(params) {
  if (
    matchesArrayElementAtSameIndex(
      params.incoming[params.incomingIndex],
      params.parsed[params.parsedIndex],
      params.env,
    )
  )
    return true;
  const stableIdentity = resolveStableArrayIdentityMatch({
    incoming: params.incoming,
    parsed: params.parsed,
    parsedIndex: params.parsedIndex,
  });
  return stableIdentity.kind === "match" && stableIdentity.incomingIndex === params.incomingIndex;
}
function hasStableSameIndexNeighbors(params) {
  return (
    params.incoming.length === params.parsed.length &&
    params.parsed.every(
      (item, index) =>
        index === params.parsedIndex ||
        matchesArrayElementAtSameIndex(params.incoming[index], item, params.env),
    )
  );
}
function matchUniqueRetainedArrayItems(params) {
  if (params.incoming.length >= params.parsed.length) return;
  const earliestParsedIndexes = [];
  let nextParsedIndex = 0;
  for (let incomingIndex = 0; incomingIndex < params.incoming.length; incomingIndex += 1) {
    const parsedIndex = params.parsed.findIndex(
      (_parsedItem, index) =>
        index >= nextParsedIndex &&
        matchesRetainedArrayItem({
          ...params,
          incomingIndex,
          parsedIndex: index,
        }),
    );
    if (parsedIndex < 0) return;
    earliestParsedIndexes.push(parsedIndex);
    nextParsedIndex = parsedIndex + 1;
  }
  const latestParsedIndexes = Array.from({ length: params.incoming.length }, () => 0);
  nextParsedIndex = params.parsed.length - 1;
  for (let incomingIndex = params.incoming.length - 1; incomingIndex >= 0; incomingIndex -= 1) {
    let parsedIndex = nextParsedIndex;
    while (
      parsedIndex >= 0 &&
      !matchesRetainedArrayItem({
        ...params,
        incomingIndex,
        parsedIndex,
      })
    )
      parsedIndex -= 1;
    if (parsedIndex < 0) return;
    latestParsedIndexes[incomingIndex] = parsedIndex;
    nextParsedIndex = parsedIndex - 1;
  }
  if (!isDeepStrictEqual(earliestParsedIndexes, latestParsedIndexes)) return;
  return new Map(
    earliestParsedIndexes.map((parsedIndex, incomingIndex) => [parsedIndex, incomingIndex]),
  );
}
function matchAuthoredTemplateArrayItems(params) {
  const templateIndexes = params.parsed.flatMap((item, index) =>
    containsAuthoredUnescapedEnvTemplate(item) ? [index] : [],
  );
  if (
    params.incoming.length === params.parsed.length &&
    params.incoming.every((item, index) =>
      matchesArrayElementAtSameIndex(item, params.parsed[index], params.env),
    )
  )
    return new Map(templateIndexes.map((index) => [index, index]));
  const retainedDeletionMatches = matchUniqueRetainedArrayItems(params);
  if (retainedDeletionMatches)
    return new Map(
      templateIndexes.flatMap((parsedIndex) => {
        const incomingIndex = retainedDeletionMatches.get(parsedIndex);
        return incomingIndex === void 0 ? [] : [[parsedIndex, incomingIndex]];
      }),
    );
  const matches = /* @__PURE__ */ new Map();
  const usedIncomingIndexes = /* @__PURE__ */ new Set();
  const addMatch = (parsedIndex, incomingIndex) => {
    if (usedIncomingIndexes.has(incomingIndex)) throw new EnvRefArrayMutationError();
    matches.set(parsedIndex, incomingIndex);
    usedIncomingIndexes.add(incomingIndex);
  };
  for (const parsedIndex of templateIndexes) {
    const parsedItem = params.parsed[parsedIndex];
    const stableIdentity = resolveStableArrayIdentityMatch({
      incoming: params.incoming,
      parsed: params.parsed,
      parsedIndex,
    });
    if (stableIdentity.kind !== "none") {
      if (stableIdentity.kind === "invalid") throw new EnvRefArrayMutationError();
      addMatch(parsedIndex, stableIdentity.incomingIndex);
      continue;
    }
    if (
      parsedIndex < params.incoming.length &&
      matchesArrayElementAtSameIndex(params.incoming[parsedIndex], parsedItem, params.env)
    ) {
      const precedingItemsRemainAligned = params.parsed
        .slice(0, parsedIndex)
        .every((item, index) =>
          matchesArrayElementAtSameIndex(params.incoming[index], item, params.env),
        );
      const duplicateAuthoredMatch = params.parsed.some(
        (item, index) =>
          index !== parsedIndex &&
          matchesArrayElementAtSameIndex(params.incoming[parsedIndex], item, params.env),
      );
      const duplicateIncomingMatch = params.incoming.some(
        (item, index) =>
          index !== parsedIndex && matchesArrayElementAtSameIndex(item, parsedItem, params.env),
      );
      if (
        !(params.incoming.length === params.parsed.length || precedingItemsRemainAligned) ||
        duplicateAuthoredMatch ||
        duplicateIncomingMatch
      )
        throw new EnvRefArrayMutationError();
      addMatch(parsedIndex, parsedIndex);
      continue;
    }
    if (isPlainObject(parsedItem) || Array.isArray(parsedItem)) {
      const isSinglePositionEdit = params.incoming.length === 1 && params.parsed.length === 1;
      const hasSameIndexLiteralIdentity = hasStableSameIndexLiteralShape({
        incoming: params.incoming,
        parsed: params.parsed,
        parsedIndex,
      });
      const hasSameIndexNeighbors = hasStableSameIndexNeighbors({
        incoming: params.incoming,
        parsed: params.parsed,
        parsedIndex,
        env: params.env,
      });
      if (!isSinglePositionEdit && !hasSameIndexLiteralIdentity && !hasSameIndexNeighbors)
        throw new EnvRefArrayMutationError();
      addMatch(parsedIndex, parsedIndex);
      continue;
    }
    if (
      params.incoming.some(
        (item, incomingIndex) =>
          incomingIndex !== parsedIndex &&
          matchesArrayElementAtSameIndex(item, parsedItem, params.env),
      )
    )
      throw new EnvRefArrayMutationError();
    if (parsedIndex < params.incoming.length) addMatch(parsedIndex, parsedIndex);
  }
  return matches;
}
function matchAuthoredEscapedTemplateArrayItems(params) {
  const escapedTemplateIndexes = params.parsed.flatMap((item, index) =>
    containsAuthoredEscapedEnvTemplate(item) && !containsAuthoredUnescapedEnvTemplate(item)
      ? [index]
      : [],
  );
  if (
    params.incoming.length === params.parsed.length &&
    params.incoming.every((item, index) =>
      matchesArrayElementAtSameIndex(item, params.parsed[index], params.env),
    )
  )
    return new Map(escapedTemplateIndexes.map((index) => [index, index]));
  const retainedDeletionMatches = matchUniqueRetainedArrayItems(params);
  if (retainedDeletionMatches)
    return new Map(
      escapedTemplateIndexes.flatMap((parsedIndex) => {
        const incomingIndex = retainedDeletionMatches.get(parsedIndex);
        if (incomingIndex === void 0) return [];
        if (params.usedIncomingIndexes.has(incomingIndex)) throw new EnvRefArrayMutationError();
        return [[parsedIndex, incomingIndex]];
      }),
    );
  const matches = /* @__PURE__ */ new Map();
  const usedIncomingIndexes = new Set(params.usedIncomingIndexes);
  const addMatch = (parsedIndex, incomingIndex) => {
    if (usedIncomingIndexes.has(incomingIndex)) throw new EnvRefArrayMutationError();
    matches.set(parsedIndex, incomingIndex);
    usedIncomingIndexes.add(incomingIndex);
  };
  for (const parsedIndex of escapedTemplateIndexes) {
    const parsedItem = params.parsed[parsedIndex];
    const stableIdentity = resolveStableArrayIdentityMatch({
      incoming: params.incoming,
      parsed: params.parsed,
      parsedIndex,
    });
    if (stableIdentity.kind !== "none") {
      if (stableIdentity.kind === "match") {
        addMatch(parsedIndex, stableIdentity.incomingIndex);
        continue;
      }
    }
    const resolvedItem = resolveEnvVarRefsForComparison(parsedItem, params.env);
    const incomingMatches = params.incoming.flatMap((item, incomingIndex) =>
      !usedIncomingIndexes.has(incomingIndex) && isDeepStrictEqual(item, resolvedItem)
        ? [incomingIndex]
        : [],
    );
    const authoredMatches = escapedTemplateIndexes.filter((index) =>
      isDeepStrictEqual(
        resolveEnvVarRefsForComparison(params.parsed[index], params.env),
        resolvedItem,
      ),
    );
    const authoredRepresentationsAreIdentical = authoredMatches.every((index) =>
      isDeepStrictEqual(params.parsed[index], parsedItem),
    );
    if (
      incomingMatches.length > 0 &&
      incomingMatches.length <= authoredMatches.length &&
      authoredRepresentationsAreIdentical
    ) {
      addMatch(
        parsedIndex,
        expectDefined(
          incomingMatches.includes(parsedIndex) ? parsedIndex : incomingMatches[0],
          "env preserve same index match",
        ),
      );
      continue;
    }
    if (incomingMatches.length > 0) throw new EnvRefArrayMutationError();
    if (isPlainObject(parsedItem) || Array.isArray(parsedItem)) {
      const isSinglePositionEdit = params.incoming.length === 1 && params.parsed.length === 1;
      const hasSameIndexLiteralIdentity = hasStableSameIndexLiteralShape({
        incoming: params.incoming,
        parsed: params.parsed,
        parsedIndex,
      });
      const hasSameIndexNeighbors = hasStableSameIndexNeighbors({
        incoming: params.incoming,
        parsed: params.parsed,
        parsedIndex,
        env: params.env,
      });
      if (
        stableIdentity.kind === "none" &&
        parsedIndex < params.incoming.length &&
        !usedIncomingIndexes.has(parsedIndex) &&
        (isSinglePositionEdit || hasSameIndexLiteralIdentity || hasSameIndexNeighbors)
      ) {
        addMatch(parsedIndex, parsedIndex);
        continue;
      }
    }
  }
  return matches;
}
/**
 * Resolve `${VAR}` references in a single string using the given env.
 * Preserves missing references so matching remains aligned with config reads.
 *
 * Mirrors the substitution semantics of `substituteString` in env-substitution.ts:
 * - `${VAR}` → env value (returns null if missing)
 * - `$${VAR}` → literal `${VAR}` (escape sequence)
 */
function tryResolveString(template, env) {
  const chunks = [];
  for (let i = 0; i < template.length; i++) {
    if (template[i] === "$") {
      if (template[i + 1] === "$" && template[i + 2] === "{") {
        const start = i + 3;
        const end = template.indexOf("}", start);
        if (end !== -1) {
          const name = template.slice(start, end);
          if (ENV_VAR_NAME_PATTERN.test(name)) {
            chunks.push(`\${${name}}`);
            i = end;
            continue;
          }
        }
      }
      if (template[i + 1] === "{") {
        const start = i + 2;
        const end = template.indexOf("}", start);
        if (end !== -1) {
          const name = template.slice(start, end);
          if (ENV_VAR_NAME_PATTERN.test(name)) {
            const val = env[name];
            if (val === void 0 || val === "") {
              chunks.push(`\${${name}}`);
              i = end;
              continue;
            }
            chunks.push(val);
            i = end;
            continue;
          }
        }
      }
    }
    chunks.push(template.charAt(i));
  }
  return chunks.join("");
}
function resolveEnvVarRefsForComparison(value, env) {
  if (typeof value === "string") return hasEnvVarRef(value) ? tryResolveString(value, env) : value;
  if (Array.isArray(value)) return value.map((item) => resolveEnvVarRefsForComparison(item, env));
  if (isPlainObject(value))
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, resolveEnvVarRefsForComparison(item, env)]),
    );
  return value;
}
/**
 * Deep-walk the incoming config and restore `${VAR}` references from the
 * pre-substitution parsed config wherever the resolved value matches.
 *
 * @param incoming - The resolved config about to be written
 * @param parsed - The pre-substitution parsed config (from the current file on disk)
 * @param env - Environment variables for verification
 * @returns A new config object with env var references restored where appropriate
 */
function restoreEnvVarRefs(incoming, parsed, env = process.env) {
  if (parsed === null || parsed === void 0) return incoming;
  if (typeof incoming === "string" && typeof parsed === "string") {
    if (hasEnvVarRef(parsed)) {
      if (tryResolveString(parsed, env) === incoming) return parsed;
    }
    return incoming;
  }
  if (Array.isArray(incoming) && Array.isArray(parsed)) {
    if (
      !containsAuthoredUnescapedEnvTemplate(parsed) &&
      !containsAuthoredEscapedEnvTemplate(parsed)
    )
      return incoming.map((item, index) =>
        index < parsed.length ? restoreEnvVarRefs(item, parsed[index], env) : item,
      );
    const unescapedMatches = matchAuthoredTemplateArrayItems({
      incoming,
      parsed,
      env,
    });
    const escapedMatches = matchAuthoredEscapedTemplateArrayItems({
      incoming,
      parsed,
      env,
      usedIncomingIndexes: new Set(unescapedMatches.values()),
    });
    const matches = new Map([...unescapedMatches, ...escapedMatches]);
    const next = [...incoming];
    const matchedIncomingIndexes = new Set(matches.values());
    for (const [parsedIndex, incomingIndex] of matches)
      next[incomingIndex] = restoreEnvVarRefs(incoming[incomingIndex], parsed[parsedIndex], env);
    for (let index = 0; index < incoming.length && index < parsed.length; index += 1)
      if (
        !matchedIncomingIndexes.has(index) &&
        !containsAuthoredUnescapedEnvTemplate(parsed[index]) &&
        !containsAuthoredEscapedEnvTemplate(parsed[index])
      )
        next[index] = restoreEnvVarRefs(incoming[index], parsed[index], env);
    const matchedParsedIndexByIncoming = new Map(
      [...matches].map(([parsedIndex, incomingIndex]) => [incomingIndex, parsedIndex]),
    );
    for (const [escapedParsedIndex, escapedParsedItem] of parsed.entries()) {
      if (!containsAuthoredEscapedEnvTemplate(escapedParsedItem)) continue;
      const matchedIncomingIndex = matches.get(escapedParsedIndex);
      if (
        matchedIncomingIndex !== void 0 &&
        preservesAuthoredEscapedEnvRefs(next[matchedIncomingIndex], escapedParsedItem)
      )
        continue;
      if (
        next.some((item, incomingIndex) => {
          const matchedParsedIndex = matchedParsedIndexByIncoming.get(incomingIndex);
          return containsUnaccountedActiveEscapedEnvRef(
            item,
            escapedParsedItem,
            incoming[incomingIndex],
            matchedParsedIndex === void 0 ? void 0 : parsed[matchedParsedIndex],
            env,
          );
        })
      )
        throw new EnvRefArrayMutationError();
    }
    return next;
  }
  if (isPlainObject(incoming) && isPlainObject(parsed)) {
    const result = {};
    for (const [key, value] of Object.entries(incoming))
      if (key in parsed) result[key] = restoreEnvVarRefs(value, parsed[key], env);
      else result[key] = value;
    return result;
  }
  return incoming;
}
//#endregion
//#region src/config/io.clobber-snapshot.ts
/** Maximum retained clobbered-config snapshots per config file. */
const CONFIG_CLOBBER_SNAPSHOT_LIMIT = 32;
const CONFIG_CLOBBER_LOCK_STALE_MS = 3e4;
const CONFIG_CLOBBER_LOCK_RETRY_MS = 10;
const CONFIG_CLOBBER_LOCK_TIMEOUT_MS = 2e3;
const clobberCapWarnedPaths = /* @__PURE__ */ new Set();
function formatConfigArtifactTimestamp$1(ts) {
  return ts.replaceAll(":", "-").replaceAll(".", "-");
}
function isFsErrorCode(error, code) {
  return (
    error instanceof Error &&
    "code" in error &&
    typeof error.code === "string" &&
    error.code === code
  );
}
function resolveClobberPaths(configPath) {
  const dir = path.dirname(configPath);
  const basename = path.basename(configPath);
  return {
    dir,
    prefix: `${basename}.clobbered.`,
    lockPath: path.join(dir, `${basename}.clobber.lock`),
  };
}
function shouldRemoveStaleLock(mtimeMs, nowMs) {
  return typeof mtimeMs === "number" && nowMs - mtimeMs > CONFIG_CLOBBER_LOCK_STALE_MS;
}
async function acquireClobberLock(deps, lockPath) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < CONFIG_CLOBBER_LOCK_TIMEOUT_MS)
    try {
      await deps.fs.promises.mkdir(lockPath, { mode: 448 });
      return true;
    } catch (error) {
      if (!isFsErrorCode(error, "EEXIST")) return false;
      if (
        shouldRemoveStaleLock(
          (await deps.fs.promises.stat(lockPath).catch(() => null))?.mtimeMs,
          Date.now(),
        )
      ) {
        await deps.fs.promises.rmdir(lockPath).catch(() => {});
        continue;
      }
      await sleep(CONFIG_CLOBBER_LOCK_RETRY_MS);
    }
  return false;
}
function acquireClobberLockSync(deps, lockPath) {
  for (let attempt = 0; attempt < 2; attempt++)
    try {
      deps.fs.mkdirSync(lockPath, { mode: 448 });
      return true;
    } catch (error) {
      if (!isFsErrorCode(error, "EEXIST")) return false;
      if (
        !shouldRemoveStaleLock(
          deps.fs.statSync(lockPath, { throwIfNoEntry: false })?.mtimeMs,
          Date.now(),
        )
      )
        return false;
      try {
        deps.fs.rmdirSync(lockPath);
      } catch {
        return false;
      }
    }
  return false;
}
function compareClobberedSiblings(left, right) {
  return (
    left.timestampKey.localeCompare(right.timestampKey) ||
    left.mtimeMs - right.mtimeMs ||
    left.name.localeCompare(right.name)
  );
}
function createClobberedSiblingSnapshot(params) {
  return {
    name: params.entry,
    path: path.join(params.dir, params.entry),
    timestampKey: params.entry.slice(params.prefix.length).replace(/-\d{2}$/, ""),
    mtimeMs: params.mtimeMs,
  };
}
async function listClobberedSiblings(deps, dir, prefix) {
  try {
    const entries = await deps.fs.promises.readdir(dir);
    const snapshots = [];
    for (const entry of entries) {
      if (!entry.startsWith(prefix)) continue;
      const stat = await deps.fs.promises.stat(path.join(dir, entry)).catch(() => null);
      snapshots.push(
        createClobberedSiblingSnapshot({
          dir,
          entry,
          prefix,
          mtimeMs: stat?.mtimeMs ?? 0,
        }),
      );
    }
    return snapshots.toSorted(compareClobberedSiblings);
  } catch {
    return [];
  }
}
function listClobberedSiblingsSync(deps, dir, prefix) {
  try {
    const snapshots = [];
    for (const entry of deps.fs.readdirSync(dir)) {
      if (!entry.startsWith(prefix)) continue;
      const stat = deps.fs.statSync(path.join(dir, entry), { throwIfNoEntry: false });
      snapshots.push(
        createClobberedSiblingSnapshot({
          dir,
          entry,
          prefix,
          mtimeMs: stat?.mtimeMs ?? 0,
        }),
      );
    }
    return snapshots.toSorted(compareClobberedSiblings);
  } catch {
    return [];
  }
}
function warnClobberCapReached(deps, configPath, existing) {
  if (clobberCapWarnedPaths.has(configPath)) return;
  clobberCapWarnedPaths.add(configPath);
  deps.logger.warn(
    `Config clobber snapshot cap reached for ${configPath}: ${existing} existing .clobbered.* files; rotating oldest snapshots to preserve the latest forensic copy.`,
  );
}
async function rotateOldestClobberedSiblings(deps, snapshots) {
  const deleteCount = Math.max(0, snapshots.length - CONFIG_CLOBBER_SNAPSHOT_LIMIT + 1);
  for (const snapshot of snapshots.slice(0, deleteCount))
    try {
      await deps.fs.promises.unlink(snapshot.path);
    } catch (error) {
      if (!isFsErrorCode(error, "ENOENT")) return false;
    }
  return true;
}
function rotateOldestClobberedSiblingsSync(deps, snapshots) {
  const deleteCount = Math.max(0, snapshots.length - CONFIG_CLOBBER_SNAPSHOT_LIMIT + 1);
  for (const snapshot of snapshots.slice(0, deleteCount))
    try {
      deps.fs.unlinkSync(snapshot.path);
    } catch (error) {
      if (!isFsErrorCode(error, "ENOENT")) return false;
    }
  return true;
}
function buildClobberedTargetPath(configPath, observedAt, attempt) {
  const basePath = `${configPath}.clobbered.${formatConfigArtifactTimestamp$1(observedAt)}`;
  return attempt === 0 ? basePath : `${basePath}-${String(attempt).padStart(2, "0")}`;
}
async function persistBoundedClobberedConfigSnapshot(params) {
  const paths = resolveClobberPaths(params.configPath);
  if (!(await acquireClobberLock(params.deps, paths.lockPath))) return null;
  try {
    const existing = await listClobberedSiblings(params.deps, paths.dir, paths.prefix);
    if (existing.length >= CONFIG_CLOBBER_SNAPSHOT_LIMIT) {
      warnClobberCapReached(params.deps, params.configPath, existing.length);
      if (!(await rotateOldestClobberedSiblings(params.deps, existing))) return null;
    }
    for (let attempt = 0; attempt < CONFIG_CLOBBER_SNAPSHOT_LIMIT; attempt++) {
      const targetPath = buildClobberedTargetPath(params.configPath, params.observedAt, attempt);
      try {
        await params.deps.fs.promises.writeFile(targetPath, params.raw, {
          encoding: "utf-8",
          mode: 384,
          flag: "wx",
        });
        return targetPath;
      } catch (error) {
        if (!isFsErrorCode(error, "EEXIST")) return null;
      }
    }
    return null;
  } finally {
    await params.deps.fs.promises.rmdir(paths.lockPath).catch(() => {});
  }
}
function persistBoundedClobberedConfigSnapshotSync(params) {
  const paths = resolveClobberPaths(params.configPath);
  if (!acquireClobberLockSync(params.deps, paths.lockPath)) return null;
  try {
    const existing = listClobberedSiblingsSync(params.deps, paths.dir, paths.prefix);
    if (existing.length >= CONFIG_CLOBBER_SNAPSHOT_LIMIT) {
      warnClobberCapReached(params.deps, params.configPath, existing.length);
      if (!rotateOldestClobberedSiblingsSync(params.deps, existing)) return null;
    }
    for (let attempt = 0; attempt < CONFIG_CLOBBER_SNAPSHOT_LIMIT; attempt++) {
      const targetPath = buildClobberedTargetPath(params.configPath, params.observedAt, attempt);
      try {
        params.deps.fs.writeFileSync(targetPath, params.raw, {
          encoding: "utf-8",
          mode: 384,
          flag: "wx",
        });
        return targetPath;
      } catch (error) {
        if (!isFsErrorCode(error, "EEXIST")) return null;
      }
    }
    return null;
  } finally {
    try {
      params.deps.fs.rmdirSync(paths.lockPath);
    } catch {}
  }
}
//#endregion
//#region src/config/io.health-state.ts
function resolveConfigHealthStateEnv(deps) {
  if (deps.env.OPENCLAW_HOME || deps.env.HOME || deps.env.USERPROFILE || deps.env.PREFIX)
    return deps.env;
  return {
    ...deps.env,
    HOME: deps.homedir(),
  };
}
function parseConfigHealthFingerprint(value) {
  if (!value) return;
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" ? parsed : void 0;
  } catch {
    return;
  }
}
function stringifyConfigHealthFingerprint(value) {
  return value ? JSON.stringify(value) : null;
}
function formatConfigHealthStateError(error) {
  return error instanceof Error ? error.message : String(error);
}
function readConfigHealthStateFromStore(deps) {
  try {
    const database = openOpenClawStateDatabase({ env: resolveConfigHealthStateEnv(deps) });
    const healthDb = getNodeSqliteKysely(database.db);
    const rows = executeSqliteQuerySync(
      database.db,
      healthDb
        .selectFrom("config_health_entries")
        .select([
          "config_path",
          "last_known_good_json",
          "last_promoted_good_json",
          "last_observed_suspicious_signature",
        ])
        .orderBy("config_path", "asc"),
    ).rows;
    return {
      entries: Object.fromEntries(
        rows.map((row) => [
          row.config_path,
          {
            lastKnownGood: parseConfigHealthFingerprint(row.last_known_good_json),
            lastPromotedGood: parseConfigHealthFingerprint(row.last_promoted_good_json),
            lastObservedSuspiciousSignature: row.last_observed_suspicious_signature,
          },
        ]),
      ),
    };
  } catch {
    return {};
  }
}
function writeConfigHealthStateToStore(deps, state) {
  try {
    const entries = Object.entries(state.entries ?? {});
    if (entries.length === 0) return;
    const updatedAtMs = Date.now();
    runOpenClawStateWriteTransaction(
      ({ db }) => {
        executeSqliteQuerySync(
          db,
          getNodeSqliteKysely(db)
            .insertInto("config_health_entries")
            .values(
              entries.map(([configPath, entry]) => ({
                config_path: configPath,
                last_known_good_json: stringifyConfigHealthFingerprint(entry.lastKnownGood),
                last_promoted_good_json: stringifyConfigHealthFingerprint(entry.lastPromotedGood),
                last_observed_suspicious_signature: entry.lastObservedSuspiciousSignature ?? null,
                updated_at_ms: updatedAtMs,
              })),
            )
            .onConflict((conflict) =>
              conflict.column("config_path").doUpdateSet({
                last_known_good_json: (eb) => eb.ref("excluded.last_known_good_json"),
                last_promoted_good_json: (eb) => eb.ref("excluded.last_promoted_good_json"),
                last_observed_suspicious_signature: (eb) =>
                  eb.ref("excluded.last_observed_suspicious_signature"),
                updated_at_ms: (eb) => eb.ref("excluded.updated_at_ms"),
              }),
            ),
        );
      },
      { env: resolveConfigHealthStateEnv(deps) },
    );
  } catch (error) {
    deps.logger.warn(`Config health-state write failed: ${formatConfigHealthStateError(error)}`);
  }
}
//#endregion
//#region src/config/io.meta.ts
/** Metadata keys automatically stamped on config writes. */
const AUTO_MANAGED_CONFIG_META_FIELDS = {
  lastTouchedVersion: "lastTouchedVersion",
  lastTouchedAt: "lastTouchedAt",
};
const AUTO_MANAGED_CONFIG_META_PATHS = [
  ["meta", AUTO_MANAGED_CONFIG_META_FIELDS.lastTouchedVersion],
  ["meta", AUTO_MANAGED_CONFIG_META_FIELDS.lastTouchedAt],
];
function stampConfigWriteMetadata(
  cfg,
  now = /* @__PURE__ */ new Date().toISOString(),
  version = VERSION,
) {
  return {
    ...cfg,
    meta: {
      ...cfg.meta,
      [AUTO_MANAGED_CONFIG_META_FIELDS.lastTouchedVersion]: version,
      [AUTO_MANAGED_CONFIG_META_FIELDS.lastTouchedAt]: now,
    },
  };
}
//#endregion
//#region src/config/io.observe-suspicious.ts
function isUpdateChannelOnlyRoot(value) {
  if (!isRecord(value)) return false;
  const keys = Object.keys(value);
  if (keys.length !== 1 || keys[0] !== "update") return false;
  const update = value.update;
  if (!isRecord(update)) return false;
  return Object.keys(update).length === 1 && typeof update.channel === "string";
}
function resolveConfigObserveSuspiciousReasons(params) {
  const reasons = [];
  const baseline = params.lastKnownGood;
  if (!baseline) return reasons;
  if (baseline.bytes >= 512 && params.bytes < Math.floor(baseline.bytes * 0.5))
    reasons.push(`size-drop-vs-last-good:${baseline.bytes}->${params.bytes}`);
  if (baseline.hasMeta && !params.hasMeta) reasons.push("missing-meta-vs-last-good");
  if (baseline.gatewayMode && !params.gatewayMode)
    reasons.push("gateway-mode-missing-vs-last-good");
  if (baseline.gatewayMode && isUpdateChannelOnlyRoot(params.parsed))
    reasons.push("update-channel-only-root");
  return reasons;
}
//#endregion
//#region src/config/io.observe-recovery.ts
function formatConfigPermissionHardeningWarning(params) {
  const detail = params.error instanceof Error ? params.error.message : String(params.error);
  return `Config permission hardening failed (${params.context}): ${params.configPath}: ${detail}`;
}
async function chmodConfigBestEffort(params) {
  try {
    await params.deps.fs.promises.chmod?.(params.configPath, 384);
  } catch (error) {
    params.deps.logger.warn(
      formatConfigPermissionHardeningWarning({
        configPath: params.configPath,
        context: params.context,
        error,
      }),
    );
  }
}
function chmodConfigBestEffortSync(params) {
  try {
    params.deps.fs.chmodSync?.(params.configPath, 384);
  } catch (error) {
    params.deps.logger.warn(
      formatConfigPermissionHardeningWarning({
        configPath: params.configPath,
        context: params.context,
        error,
      }),
    );
  }
}
function createConfigObserveAuditRecord(params) {
  return {
    ts: params.ts,
    source: "config-io",
    event: "config.observe",
    phase: "read",
    configPath: params.configPath,
    ...snapshotConfigAuditProcessInfo(),
    exists: true,
    valid: params.valid,
    hash: params.current.hash,
    bytes: params.current.bytes,
    mtimeMs: params.current.mtimeMs,
    ctimeMs: params.current.ctimeMs,
    dev: params.current.dev,
    ino: params.current.ino,
    mode: params.current.mode,
    nlink: params.current.nlink,
    uid: params.current.uid,
    gid: params.current.gid,
    hasMeta: params.current.hasMeta,
    gatewayMode: params.current.gatewayMode,
    suspicious: params.suspicious,
    lastKnownGoodHash: params.lastKnownGood?.hash ?? null,
    lastKnownGoodBytes: params.lastKnownGood?.bytes ?? null,
    lastKnownGoodMtimeMs: params.lastKnownGood?.mtimeMs ?? null,
    lastKnownGoodCtimeMs: params.lastKnownGood?.ctimeMs ?? null,
    lastKnownGoodDev: params.lastKnownGood?.dev ?? null,
    lastKnownGoodIno: params.lastKnownGood?.ino ?? null,
    lastKnownGoodMode: params.lastKnownGood?.mode ?? null,
    lastKnownGoodNlink: params.lastKnownGood?.nlink ?? null,
    lastKnownGoodUid: params.lastKnownGood?.uid ?? null,
    lastKnownGoodGid: params.lastKnownGood?.gid ?? null,
    lastKnownGoodGatewayMode: params.lastKnownGood?.gatewayMode ?? null,
    backupHash: params.backup?.hash ?? null,
    backupBytes: params.backup?.bytes ?? null,
    backupMtimeMs: params.backup?.mtimeMs ?? null,
    backupCtimeMs: params.backup?.ctimeMs ?? null,
    backupDev: params.backup?.dev ?? null,
    backupIno: params.backup?.ino ?? null,
    backupMode: params.backup?.mode ?? null,
    backupNlink: params.backup?.nlink ?? null,
    backupUid: params.backup?.uid ?? null,
    backupGid: params.backup?.gid ?? null,
    backupGatewayMode: params.backup?.gatewayMode ?? null,
    clobberedPath: params.clobberedPath,
    restoredFromBackup: params.restoredFromBackup,
    restoredBackupPath: params.restoredBackupPath,
    restoreErrorCode: params.restoreErrorCode ?? null,
    restoreErrorMessage: params.restoreErrorMessage ?? null,
  };
}
function createConfigObserveAuditAppendParams(deps, params) {
  return {
    fs: deps.fs,
    env: deps.env,
    homedir: deps.homedir,
    record: createConfigObserveAuditRecord(params),
  };
}
function extractRestoreErrorDetails(error) {
  if (!error || typeof error !== "object")
    return {
      code: null,
      message: typeof error === "string" ? error : null,
    };
  return {
    code: "code" in error && typeof error.code === "string" ? error.code : null,
    message: "message" in error && typeof error.message === "string" ? error.message : null,
  };
}
function hashConfigRaw$1(raw) {
  return crypto
    .createHash("sha256")
    .update(raw ?? "")
    .digest("hex");
}
function resolveConfigSnapshotHash$1(snapshot) {
  if (typeof snapshot.hash === "string") {
    const trimmed = snapshot.hash.trim();
    if (trimmed) return trimmed;
  }
  if (typeof snapshot.raw !== "string") return null;
  return hashConfigRaw$1(snapshot.raw);
}
function hasConfigMeta$1(value) {
  return (
    isRecord(value) &&
    isRecord(value.meta) &&
    (typeof value.meta.lastTouchedVersion === "string" ||
      typeof value.meta.lastTouchedAt === "string")
  );
}
function resolveGatewayMode$1(value) {
  if (!isRecord(value) || !isRecord(value.gateway)) return null;
  return typeof value.gateway.mode === "string" ? value.gateway.mode : null;
}
function resolveConfigStatMetadata$1(stat) {
  if (!stat)
    return {
      dev: null,
      ino: null,
      mode: null,
      nlink: null,
      uid: null,
      gid: null,
    };
  return {
    dev: typeof stat.dev === "number" || typeof stat.dev === "bigint" ? String(stat.dev) : null,
    ino: typeof stat.ino === "number" || typeof stat.ino === "bigint" ? String(stat.ino) : null,
    mode: typeof stat.mode === "number" ? stat.mode : null,
    nlink: typeof stat.nlink === "number" ? stat.nlink : null,
    uid: typeof stat.uid === "number" ? stat.uid : null,
    gid: typeof stat.gid === "number" ? stat.gid : null,
  };
}
function createConfigHealthFingerprint(params) {
  return {
    hash: params.hash,
    bytes: Buffer.byteLength(params.raw, "utf-8"),
    mtimeMs: params.stat?.mtimeMs ?? null,
    ctimeMs: params.stat?.ctimeMs ?? null,
    ...resolveConfigStatMetadata$1(params.stat),
    hasMeta: hasConfigMeta$1(params.parsed),
    gatewayMode: resolveGatewayMode$1(params.gatewaySource),
    observedAt: params.observedAt,
  };
}
function parseConfigRawOrEmpty(deps, raw) {
  try {
    return deps.json5.parse(raw);
  } catch {
    return {};
  }
}
function returnOriginalConfigRead(params) {
  return {
    raw: params.raw,
    parsed: params.parsed,
  };
}
async function readConfigHealthState$1(deps) {
  return readConfigHealthStateFromStore(deps);
}
function readConfigHealthStateSync$1(deps) {
  return readConfigHealthStateFromStore(deps);
}
async function writeConfigHealthState$1(deps, state) {
  writeConfigHealthStateToStore(deps, state);
}
function writeConfigHealthStateSync$1(deps, state) {
  writeConfigHealthStateToStore(deps, state);
}
function parseBackupConfigRaw(deps, backupRaw) {
  try {
    return { parsed: deps.json5.parse(backupRaw) };
  } catch {
    return null;
  }
}
function getConfigHealthEntry$1(state, configPath) {
  const entries = state.entries;
  if (!entries || !isRecord(entries)) return {};
  const entry = entries[configPath];
  return entry && isRecord(entry) ? entry : {};
}
function setConfigHealthEntry$1(state, configPath, entry) {
  return {
    ...state,
    entries: {
      ...state.entries,
      [configPath]: entry,
    },
  };
}
function createLastObservedSuspiciousEntry(entry, suspiciousSignature) {
  return {
    ...entry,
    lastObservedSuspiciousSignature: suspiciousSignature,
  };
}
function createRecoveredSuspiciousHealthState(params) {
  return setConfigHealthEntry$1(
    params.healthState,
    params.configPath,
    createLastObservedSuspiciousEntry(params.entry, params.suspiciousSignature),
  );
}
function logBackupRestoreResult(params) {
  if (params.restoredFromBackup) {
    params.deps.logger.warn(
      `Config auto-restored from backup: ${params.configPath} (${params.suspicious.join(", ")})`,
    );
    return;
  }
  params.deps.logger.warn(
    `Config auto-restore from backup failed: ${params.configPath} (${params.suspicious.join(", ")}${params.restoreErrorMessage ? `; ${params.restoreErrorMessage}` : ""})`,
  );
}
function createBackupRestoreAuditAppendParams(params) {
  return createConfigObserveAuditAppendParams(params.deps, {
    ts: params.now,
    configPath: params.configPath,
    valid: params.restoredFromBackup,
    current: params.current,
    suspicious: params.suspicious,
    lastKnownGood: params.entry.lastKnownGood,
    backup: params.backup,
    clobberedPath: params.clobberedPath,
    restoredFromBackup: params.restoredFromBackup,
    restoredBackupPath: params.backupPath,
    restoreErrorCode: params.restoreErrorDetails.code,
    restoreErrorMessage: params.restoreErrorDetails.message,
  });
}
function resolveSuspiciousSignature(current, suspicious) {
  return `${current.hash}:${suspicious.join(",")}`;
}
function isRecoverableConfigReadSuspiciousReason(reason) {
  return (
    reason === "missing-meta-vs-last-good" ||
    reason === "gateway-mode-missing-vs-last-good" ||
    reason === "update-channel-only-root" ||
    reason.startsWith("size-drop-vs-last-good:")
  );
}
function resolveConfigReadRecoveryContext(params) {
  const suspicious = resolveConfigObserveSuspiciousReasons({
    bytes: params.current.bytes,
    hasMeta: params.current.hasMeta,
    gatewayMode: params.current.gatewayMode,
    parsed: params.parsed,
    lastKnownGood: params.backupBaseline,
  });
  if (!suspicious.some(isRecoverableConfigReadSuspiciousReason)) return null;
  const suspiciousSignature = resolveSuspiciousSignature(params.current, suspicious);
  if (params.entry.lastObservedSuspiciousSignature === suspiciousSignature) return null;
  return {
    suspicious,
    suspiciousSignature,
  };
}
async function readConfigFingerprintForPath$1(deps, targetPath) {
  try {
    const raw = await deps.fs.promises.readFile(targetPath, "utf-8");
    const stat = await deps.fs.promises.stat(targetPath).catch(() => null);
    const parsed = parseConfigRawOrEmpty(deps, raw);
    return createConfigHealthFingerprint({
      hash: hashConfigRaw$1(raw),
      raw,
      parsed,
      gatewaySource: parsed,
      stat,
      observedAt: /* @__PURE__ */ new Date().toISOString(),
    });
  } catch {
    return null;
  }
}
function readConfigFingerprintForPathSync$1(deps, targetPath) {
  try {
    const raw = deps.fs.readFileSync(targetPath, "utf-8");
    const stat = deps.fs.statSync(targetPath, { throwIfNoEntry: false }) ?? null;
    const parsed = parseConfigRawOrEmpty(deps, raw);
    return createConfigHealthFingerprint({
      hash: hashConfigRaw$1(raw),
      raw,
      parsed,
      gatewaySource: parsed,
      stat,
      observedAt: /* @__PURE__ */ new Date().toISOString(),
    });
  } catch {
    return null;
  }
}
function resolveLastKnownGoodConfigPath(configPath) {
  return `${configPath}.last-good`;
}
function isSensitiveConfigPath(pathLabel) {
  return /(^|\.)(api[-_]?key|auth|bearer|credential|password|private[-_]?key|secret|token)(\.|$)/i.test(
    pathLabel,
  );
}
function collectPollutedSecretPlaceholders(value, pathLabel = "", output = []) {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed === "***" || trimmed === "[redacted]") {
      output.push(pathLabel || "<root>");
      return output;
    }
    if (isSensitiveConfigPath(pathLabel) && (trimmed.includes("...") || trimmed.includes("…")))
      output.push(pathLabel || "<root>");
    return output;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) =>
      collectPollutedSecretPlaceholders(item, `${pathLabel}[${index}]`, output),
    );
    return output;
  }
  if (isRecord(value))
    for (const [key, child] of Object.entries(value))
      collectPollutedSecretPlaceholders(child, pathLabel ? `${pathLabel}.${key}` : key, output);
  return output;
}
async function maybeRecoverSuspiciousConfigRead(params) {
  const stat = await params.deps.fs.promises.stat(params.configPath).catch(() => null);
  const now = /* @__PURE__ */ new Date().toISOString();
  const current = createConfigHealthFingerprint({
    hash: hashConfigRaw$1(params.raw),
    raw: params.raw,
    parsed: params.parsed,
    gatewaySource: params.parsed,
    stat,
    observedAt: now,
  });
  let healthState = await readConfigHealthState$1(params.deps);
  const entry = getConfigHealthEntry$1(healthState, params.configPath);
  const backupPath = `${params.configPath}.bak`;
  const backupBaseline =
    entry.lastKnownGood ??
    (await readConfigFingerprintForPath$1(params.deps, backupPath)) ??
    void 0;
  const recoveryContext = resolveConfigReadRecoveryContext({
    current,
    parsed: params.parsed,
    entry,
    backupBaseline,
  });
  if (!recoveryContext) return returnOriginalConfigRead(params);
  const { suspicious, suspiciousSignature } = recoveryContext;
  const backupRaw = await params.deps.fs.promises.readFile(backupPath, "utf-8").catch(() => null);
  if (!backupRaw) return returnOriginalConfigRead(params);
  const backupParse = parseBackupConfigRaw(params.deps, backupRaw);
  if (!backupParse) return returnOriginalConfigRead(params);
  if (
    params.validateBackup &&
    !(await params.validateBackup({
      raw: backupRaw,
      parsed: backupParse.parsed,
    }))
  )
    return returnOriginalConfigRead(params);
  const backup = backupBaseline ?? (await readConfigFingerprintForPath$1(params.deps, backupPath));
  if (!backup?.gatewayMode) return returnOriginalConfigRead(params);
  if (params.allowBackupRecovery && !(await params.allowBackupRecovery()))
    return returnOriginalConfigRead(params);
  const clobberedPath = await persistBoundedClobberedConfigSnapshot({
    deps: params.deps,
    configPath: params.configPath,
    raw: params.raw,
    observedAt: now,
  });
  let restoredFromBackup = false;
  let restoreError;
  try {
    await params.deps.fs.promises.writeFile(params.configPath, backupRaw, {
      encoding: "utf-8",
      mode: 384,
    });
    await chmodConfigBestEffort({
      deps: params.deps,
      configPath: params.configPath,
      context: "backup restore",
    });
    restoredFromBackup = true;
  } catch (error) {
    restoreError = error;
  }
  const restoreErrorDetails = restoredFromBackup
    ? {
        code: null,
        message: null,
      }
    : extractRestoreErrorDetails(restoreError);
  logBackupRestoreResult({
    deps: params.deps,
    configPath: params.configPath,
    suspicious,
    restoredFromBackup,
    restoreErrorMessage: restoreErrorDetails.message,
  });
  await appendConfigAuditRecord(
    createBackupRestoreAuditAppendParams({
      deps: params.deps,
      now,
      configPath: params.configPath,
      restoredFromBackup,
      current,
      suspicious,
      entry,
      backup,
      clobberedPath,
      backupPath,
      restoreErrorDetails,
    }),
  );
  if (restoredFromBackup) {
    healthState = createRecoveredSuspiciousHealthState({
      healthState,
      configPath: params.configPath,
      entry,
      suspiciousSignature,
    });
    await writeConfigHealthState$1(params.deps, healthState);
  }
  return {
    raw: backupRaw,
    parsed: backupParse.parsed,
  };
}
function maybeRecoverSuspiciousConfigReadSync(params) {
  const stat = params.deps.fs.statSync(params.configPath, { throwIfNoEntry: false }) ?? null;
  const now = /* @__PURE__ */ new Date().toISOString();
  const current = createConfigHealthFingerprint({
    hash: hashConfigRaw$1(params.raw),
    raw: params.raw,
    parsed: params.parsed,
    gatewaySource: params.parsed,
    stat,
    observedAt: now,
  });
  let healthState = readConfigHealthStateSync$1(params.deps);
  const entry = getConfigHealthEntry$1(healthState, params.configPath);
  const backupPath = `${params.configPath}.bak`;
  const backupBaseline =
    entry.lastKnownGood ?? readConfigFingerprintForPathSync$1(params.deps, backupPath) ?? void 0;
  const recoveryContext = resolveConfigReadRecoveryContext({
    current,
    parsed: params.parsed,
    entry,
    backupBaseline,
  });
  if (!recoveryContext) return returnOriginalConfigRead(params);
  const { suspicious, suspiciousSignature } = recoveryContext;
  let backupRaw;
  try {
    backupRaw = params.deps.fs.readFileSync(backupPath, "utf-8");
  } catch {
    return returnOriginalConfigRead(params);
  }
  const backupParse = parseBackupConfigRaw(params.deps, backupRaw);
  if (!backupParse) return returnOriginalConfigRead(params);
  if (
    params.validateBackupSync &&
    !params.validateBackupSync({
      raw: backupRaw,
      parsed: backupParse.parsed,
    })
  )
    return returnOriginalConfigRead(params);
  const backup = backupBaseline ?? readConfigFingerprintForPathSync$1(params.deps, backupPath);
  if (!backup?.gatewayMode) return returnOriginalConfigRead(params);
  const clobberedPath = persistBoundedClobberedConfigSnapshotSync({
    deps: params.deps,
    configPath: params.configPath,
    raw: params.raw,
    observedAt: now,
  });
  let restoredFromBackup = false;
  let restoreError;
  try {
    params.deps.fs.writeFileSync(params.configPath, backupRaw, {
      encoding: "utf-8",
      mode: 384,
    });
    chmodConfigBestEffortSync({
      deps: params.deps,
      configPath: params.configPath,
      context: "backup restore",
    });
    restoredFromBackup = true;
  } catch (error) {
    restoreError = error;
  }
  const restoreErrorDetails = restoredFromBackup
    ? {
        code: null,
        message: null,
      }
    : extractRestoreErrorDetails(restoreError);
  logBackupRestoreResult({
    deps: params.deps,
    configPath: params.configPath,
    suspicious,
    restoredFromBackup,
    restoreErrorMessage: restoreErrorDetails.message,
  });
  appendConfigAuditRecordSync(
    createBackupRestoreAuditAppendParams({
      deps: params.deps,
      now,
      configPath: params.configPath,
      restoredFromBackup,
      current,
      suspicious,
      entry,
      backup,
      clobberedPath,
      backupPath,
      restoreErrorDetails,
    }),
  );
  if (restoredFromBackup) {
    healthState = createRecoveredSuspiciousHealthState({
      healthState,
      configPath: params.configPath,
      entry,
      suspiciousSignature,
    });
    writeConfigHealthStateSync$1(params.deps, healthState);
  }
  return {
    raw: backupRaw,
    parsed: backupParse.parsed,
  };
}
async function promoteConfigSnapshotToLastKnownGood$1(params) {
  const { deps, snapshot } = params;
  if (!snapshot.exists || !snapshot.valid || typeof snapshot.raw !== "string") return false;
  const polluted = collectPollutedSecretPlaceholders(snapshot.parsed);
  if (polluted.length > 0) {
    params.logger?.warn(
      `Config last-known-good promotion skipped: redacted secret placeholder at ${polluted[0]}`,
    );
    return false;
  }
  const stat = await deps.fs.promises.stat(snapshot.path).catch(() => null);
  const now = /* @__PURE__ */ new Date().toISOString();
  const current = createConfigHealthFingerprint({
    hash: resolveConfigSnapshotHash$1(snapshot) ?? hashConfigRaw$1(snapshot.raw),
    raw: snapshot.raw,
    parsed: snapshot.parsed,
    gatewaySource: snapshot.resolved,
    stat,
    observedAt: now,
  });
  const lastGoodPath = resolveLastKnownGoodConfigPath(snapshot.path);
  await deps.fs.promises.writeFile(lastGoodPath, snapshot.raw, {
    encoding: "utf-8",
    mode: 384,
  });
  await chmodConfigBestEffort({
    deps,
    configPath: lastGoodPath,
    context: "last-known-good promotion",
  });
  const healthState = await readConfigHealthState$1(deps);
  const entry = getConfigHealthEntry$1(healthState, snapshot.path);
  await writeConfigHealthState$1(
    deps,
    setConfigHealthEntry$1(healthState, snapshot.path, {
      ...entry,
      lastKnownGood: current,
      lastPromotedGood: current,
      lastObservedSuspiciousSignature: null,
    }),
  );
  return true;
}
async function recoverConfigFromLastKnownGood$1(params) {
  const { deps, snapshot } = params;
  if (!snapshot.exists || typeof snapshot.raw !== "string") return false;
  if (!shouldAttemptLastKnownGoodRecovery(snapshot)) {
    if (isPluginLocalInvalidConfigSnapshot(snapshot))
      deps.logger.warn(
        `Config last-known-good recovery skipped: invalidity is scoped to stale plugin config (${params.reason})`,
      );
    return false;
  }
  const healthState = await readConfigHealthState$1(deps);
  const entry = getConfigHealthEntry$1(healthState, snapshot.path);
  const promoted = entry.lastPromotedGood;
  if (!promoted?.hash) return false;
  const lastGoodPath = resolveLastKnownGoodConfigPath(snapshot.path);
  const backupRaw = await deps.fs.promises.readFile(lastGoodPath, "utf-8").catch(() => null);
  if (!backupRaw || hashConfigRaw$1(backupRaw) !== promoted.hash) return false;
  let backupParsed;
  try {
    backupParsed = deps.json5.parse(backupRaw);
  } catch {
    return false;
  }
  const polluted = collectPollutedSecretPlaceholders(backupParsed);
  if (polluted.length > 0) {
    deps.logger.warn(
      `Config last-known-good recovery skipped: redacted secret placeholder at ${polluted[0]}`,
    );
    return false;
  }
  const now = /* @__PURE__ */ new Date().toISOString();
  const stat = await deps.fs.promises.stat(snapshot.path).catch(() => null);
  const current = createConfigHealthFingerprint({
    hash: resolveConfigSnapshotHash$1(snapshot) ?? hashConfigRaw$1(snapshot.raw),
    raw: snapshot.raw,
    parsed: snapshot.parsed,
    gatewaySource: snapshot.resolved,
    stat,
    observedAt: now,
  });
  const clobberedPath = await persistBoundedClobberedConfigSnapshot({
    deps,
    configPath: snapshot.path,
    raw: snapshot.raw,
    observedAt: now,
  });
  await deps.fs.promises.writeFile(snapshot.path, backupRaw, {
    encoding: "utf-8",
    mode: 384,
  });
  await chmodConfigBestEffort({
    deps,
    configPath: snapshot.path,
    context: "last-known-good recovery",
  });
  const issueSummary = formatConfigIssueSummary([...snapshot.issues, ...snapshot.legacyIssues]);
  deps.logger.warn(
    `Config auto-restored from last-known-good: ${snapshot.path} (${params.reason})${issueSummary ? `; Rejected validation details: ${issueSummary}.` : ""}`,
  );
  await appendConfigAuditRecord(
    createConfigObserveAuditAppendParams(deps, {
      ts: now,
      configPath: snapshot.path,
      valid: snapshot.valid,
      current,
      suspicious: [params.reason],
      lastKnownGood: promoted,
      backup: promoted,
      clobberedPath,
      restoredFromBackup: true,
      restoredBackupPath: lastGoodPath,
    }),
  );
  await writeConfigHealthState$1(
    deps,
    setConfigHealthEntry$1(healthState, snapshot.path, {
      ...entry,
      lastKnownGood: promoted,
      lastPromotedGood: promoted,
      lastObservedSuspiciousSignature: null,
    }),
  );
  return true;
}
//#endregion
//#region src/config/io.owner-display-secret.ts
/** Retains generated owner display secrets in memory without persisting them into config. */
function retainGeneratedOwnerDisplaySecret(params) {
  const { config, configPath, generatedSecret, state } = params;
  if (!generatedSecret) {
    state.pendingByPath.delete(configPath);
    return config;
  }
  state.pendingByPath.set(configPath, generatedSecret);
  return config;
}
//#endregion
//#region src/config/io.write-prepare.ts
const OPEN_DM_POLICY_ALLOW_FROM_RE =
  /^(?<policyPath>[a-z0-9_.-]+)\s*=\s*"open"\s+requires\s+(?<allowPath>[a-z0-9_.-]+)(?:\s+\(or\s+[a-z0-9_.-]+\))?\s+to include "\*"$/i;
const MANAGED_CONFIG_UNSET_PATHS = [["plugins", "installs"]];
function cloneUnknown(value) {
  return structuredClone(value);
}
/** Builds an RFC-7396-style merge patch between source and target config values. */
function createMergePatch(base, target) {
  if (!isRecord(base) || !isRecord(target)) return cloneUnknown(target);
  const patch = {};
  const keys = /* @__PURE__ */ new Set([...Object.keys(base), ...Object.keys(target)]);
  for (const key of keys) {
    const hasBase = Object.hasOwn(base, key);
    if (!Object.hasOwn(target, key)) {
      patch[key] = null;
      continue;
    }
    const targetValue = target[key];
    if (!hasBase) {
      patch[key] = cloneUnknown(targetValue);
      continue;
    }
    const baseValue = base[key];
    if (isRecord(baseValue) && isRecord(targetValue)) {
      const childPatch = createMergePatch(baseValue, targetValue);
      if (isRecord(childPatch) && Object.keys(childPatch).length === 0) continue;
      patch[key] = childPatch;
      continue;
    }
    if (!isDeepStrictEqual(baseValue, targetValue)) patch[key] = cloneUnknown(targetValue);
  }
  return patch;
}
function projectSourceOntoRuntimeShape(source, runtime) {
  if (!isRecord(source) || !isRecord(runtime)) return cloneUnknown(source);
  const next = {};
  for (const [key, sourceValue] of Object.entries(source)) {
    if (!(key in runtime)) {
      next[key] = cloneUnknown(sourceValue);
      continue;
    }
    next[key] = projectSourceOntoRuntimeShape(sourceValue, runtime[key]);
  }
  return next;
}
function hasOwnValidIncludeDirective(value) {
  if (!isRecord(value) || !Object.hasOwn(value, "$include")) return false;
  const includeValue = value.$include;
  return (
    typeof includeValue === "string" ||
    (Array.isArray(includeValue) && includeValue.every((entry) => typeof entry === "string"))
  );
}
function collectIncludeOwnedPaths(value, path = []) {
  if (Array.isArray(value))
    return value.flatMap((child, index) =>
      collectIncludeOwnedPaths(child, [...path, String(index)]),
    );
  if (!isRecord(value)) return [];
  if (hasOwnValidIncludeDirective(value)) return [path];
  return Object.entries(value).flatMap(([key, child]) =>
    collectIncludeOwnedPaths(child, [...path, key]),
  );
}
function collectMutableSiblingPathsAtInclude(rootAuthoredConfig, includePath) {
  const includeValue = getPathValue(rootAuthoredConfig, includePath);
  if (!hasOwnValidIncludeDirective(includeValue)) return [];
  return Object.keys(includeValue).flatMap((key) =>
    key === "$include" || isBlockedObjectKey(key) ? [] : [[...includePath, key]],
  );
}
function isMutableSiblingPathAtInclude(rootAuthoredConfig, includePath, path) {
  return collectMutableSiblingPathsAtInclude(rootAuthoredConfig, includePath).some(
    (siblingPath) => {
      if (!pathStartsWith(path, siblingPath)) return false;
      return !collectIncludeOwnedPaths(
        getPathValue(rootAuthoredConfig, siblingPath),
        siblingPath,
      ).some(
        (nestedIncludePath) =>
          pathStartsWith(path, nestedIncludePath) || pathStartsWith(nestedIncludePath, path),
      );
    },
  );
}
function formatConfigPath$1(path) {
  return path.length > 0 ? path.join(".") : "<root>";
}
function findContainingArrayPath(root, path) {
  let current = root;
  const currentPath = [];
  for (const segment of path) {
    if (Array.isArray(current)) return currentPath;
    if (!isRecord(current)) return;
    current = current[segment];
    currentPath.push(segment);
  }
}
function hasChangedEquivalentArraySibling(value, nextValue, index) {
  if (!Array.isArray(value) || !Array.isArray(nextValue) || index >= value.length) return false;
  return value.some(
    (item, itemIndex) =>
      itemIndex !== index &&
      isDeepStrictEqual(item, value[index]) &&
      !isDeepStrictEqual(nextValue[itemIndex], item),
  );
}
function hasNewEquivalentArraySibling(value, nextValue, index) {
  if (!Array.isArray(value) || !Array.isArray(nextValue) || index >= value.length) return false;
  const includedValue = value[index];
  if (!isDeepStrictEqual(nextValue[index], includedValue)) return false;
  return nextValue.some(
    (item, itemIndex) =>
      itemIndex !== index &&
      isDeepStrictEqual(item, includedValue) &&
      !isDeepStrictEqual(value[itemIndex], includedValue),
  );
}
function getPathValue(value, path) {
  let current = value;
  for (const segment of path) {
    if (Array.isArray(current)) {
      const index = parseArrayIndexPathSegment(segment);
      if (index === void 0 || index >= current.length) return;
      current = current[index];
      continue;
    }
    if (!isRecord(current)) return;
    current = current[segment];
  }
  return current;
}
function setPathValue(value, path, nextValue) {
  if (path.length === 0) return cloneUnknown(nextValue);
  const head = expectDefined(path[0], "config path head");
  const tail = path.slice(1);
  if (Array.isArray(value)) {
    const index = parseArrayIndexPathSegment(head);
    if (index === void 0 || index >= value.length) return value;
    const next = [...value];
    next[index] = setPathValue(value[index], tail, nextValue);
    return next;
  }
  if (!isRecord(value)) return value;
  return {
    ...value,
    [head]: setPathValue(value[head], tail, nextValue),
  };
}
function pathStartsWith(path, prefix) {
  return prefix.length <= path.length && prefix.every((segment, index) => path[index] === segment);
}
function pathOverlapsAny(path, candidates) {
  return Boolean(
    candidates?.some(
      (candidate) => pathStartsWith(path, candidate) || pathStartsWith(candidate, path),
    ),
  );
}
function isIncludeOwnedPath(rootAuthoredConfig, path) {
  return collectIncludeOwnedPaths(rootAuthoredConfig).some((includePath) => {
    if (!(pathStartsWith(path, includePath) || pathStartsWith(includePath, path))) return false;
    return !isMutableSiblingPathAtInclude(rootAuthoredConfig, includePath, path);
  });
}
function findOverlappingIncludeOwnedPath(rootAuthoredConfig, path) {
  return collectIncludeOwnedPaths(rootAuthoredConfig).find((includePath) => {
    if (!(pathStartsWith(path, includePath) || pathStartsWith(includePath, path))) return false;
    return !isMutableSiblingPathAtInclude(rootAuthoredConfig, includePath, path);
  });
}
function setPathValueCreatingParents(value, path, nextValue) {
  if (path.length === 0) return cloneUnknown(nextValue);
  const head = expectDefined(path[0], "config path head");
  const tail = path.slice(1);
  if (Array.isArray(value) || isNumericPathSegment(head)) {
    const index = parseArrayIndexPathSegment(head);
    if (index === void 0) return value;
    const next = Array.isArray(value) ? [...value] : [];
    next[index] = setPathValueCreatingParents(next[index], tail, nextValue);
    return next;
  }
  const record = isRecord(value) ? value : {};
  return {
    ...record,
    [head]: setPathValueCreatingParents(record[head], tail, nextValue),
  };
}
function deletePathValue(value, path) {
  if (path.length === 0) return value;
  const head = expectDefined(path[0], "config path head");
  const tail = path.slice(1);
  if (Array.isArray(value)) {
    const index = parseArrayIndexPathSegment(head);
    if (index === void 0 || index >= value.length || tail.length === 0) return value;
    const next = [...value];
    next[index] = deletePathValue(value[index], tail);
    return next;
  }
  if (!isRecord(value) || !Object.hasOwn(value, head)) return value;
  const next = { ...value };
  if (tail.length === 0) {
    delete next[head];
    return next;
  }
  next[head] = deletePathValue(value[head], tail);
  return next;
}
function preserveSourceValueAtPath(params) {
  if (pathOverlapsAny(params.path, params.unsetPaths)) return params.persistedCandidate;
  if (isIncludeOwnedPath(params.rootAuthoredConfig, params.path)) return params.persistedCandidate;
  if (getPathValue(params.nextConfig, params.path) !== void 0) return params.persistedCandidate;
  const sourceValue = params.sourceValue ?? getPathValue(params.sourceConfig, params.path);
  if (sourceValue === void 0 || getPathValue(params.persistedCandidate, params.path) !== void 0)
    return params.persistedCandidate;
  return setPathValueCreatingParents(params.persistedCandidate, params.path, sourceValue);
}
function preserveAuthoredAgentParams(params) {
  const defaults = getPathValue(params.sourceConfig, ["agents", "defaults"]);
  if (!isRecord(defaults)) return params.persistedCandidate;
  let next = params.persistedCandidate;
  if (Object.hasOwn(defaults, "params"))
    next = preserveSourceValueAtPath({
      ...params,
      persistedCandidate: next,
      path: ["agents", "defaults", "params"],
      sourceValue: defaults.params,
    });
  const models = defaults.models;
  if (!isRecord(models)) return next;
  const nextModels = getPathValue(params.nextConfig, ["agents", "defaults", "models"]);
  for (const [modelId, modelEntry] of Object.entries(models)) {
    if (!isRecord(modelEntry) || !Object.hasOwn(modelEntry, "params")) continue;
    const modelPath = [
      "agents",
      "defaults",
      "models",
      normalizeAgentModelRefForConfig(modelId) || modelId,
    ];
    const normalizedModelId = modelPath.at(-1);
    if (isRecord(nextModels) && normalizedModelId && !Object.hasOwn(nextModels, normalizedModelId))
      continue;
    const paramsPath = [...modelPath, "params"];
    if (modelPath.at(-1) !== modelId)
      next = deletePathValue(next, ["agents", "defaults", "models", modelId]);
    if (getPathValue(next, modelPath) === void 0) {
      next = preserveSourceValueAtPath({
        ...params,
        persistedCandidate: next,
        path: modelPath,
        sourceValue: modelEntry,
      });
      continue;
    }
    next = preserveSourceValueAtPath({
      ...params,
      persistedCandidate: next,
      path: paramsPath,
      sourceValue: modelEntry.params,
    });
  }
  return next;
}
function normalizeAgentModelConfigForWrite(value) {
  if (typeof value === "string") {
    const normalized = normalizeAgentModelRefForConfig(value);
    return normalized === value ? value : normalized;
  }
  if (!isRecord(value)) return value;
  let mutated = false;
  const next = { ...value };
  if (typeof value.primary === "string") {
    const primary = normalizeAgentModelRefForConfig(value.primary);
    if (primary !== value.primary) {
      next.primary = primary;
      mutated = true;
    }
  }
  if (Array.isArray(value.fallbacks)) {
    const fallbacks = value.fallbacks.map((fallback) =>
      typeof fallback === "string" ? normalizeAgentModelRefForConfig(fallback) : fallback,
    );
    if (!isDeepStrictEqual(fallbacks, value.fallbacks)) {
      next.fallbacks = fallbacks;
      mutated = true;
    }
  }
  return mutated ? next : value;
}
const AGENT_MODEL_CONFIG_KEYS = [
  "model",
  "imageModel",
  "imageGenerationModel",
  "videoGenerationModel",
  "musicGenerationModel",
  "voiceModel",
  "pdfModel",
];
function normalizeModelConfigPathForWrite(config, path) {
  const value = getPathValue(config, path);
  if (value === void 0) return config;
  const normalizedModel = normalizeAgentModelConfigForWrite(value);
  return normalizedModel !== value ? setPathValue(config, path, normalizedModel) : config;
}
function normalizeModelStringPathForWrite(config, path) {
  const value = getPathValue(config, path);
  if (typeof value !== "string") return config;
  const normalized = normalizeAgentModelRefForConfig(value);
  return normalized !== value ? setPathValue(config, path, normalized) : config;
}
function normalizeAgentModelRefsAtPathForWrite(config, path) {
  if (!isRecord(getPathValue(config, path))) return config;
  let next = config;
  for (const key of AGENT_MODEL_CONFIG_KEYS)
    next = normalizeModelConfigPathForWrite(next, [...path, key]);
  next = normalizeModelStringPathForWrite(next, [...path, "utilityModel"]);
  next = normalizeModelStringPathForWrite(next, [...path, "heartbeat", "model"]);
  next = normalizeModelConfigPathForWrite(next, [...path, "subagents", "model"]);
  next = normalizeModelStringPathForWrite(next, [...path, "compaction", "model"]);
  next = normalizeModelStringPathForWrite(next, [...path, "compaction", "memoryFlush", "model"]);
  const models = getPathValue(next, [...path, "models"]);
  if (isRecord(models)) {
    const normalizedModels = normalizeAgentModelMapForConfig(models);
    if (normalizedModels !== models)
      next = setPathValue(next, [...path, "models"], normalizedModels);
  }
  return next;
}
function normalizeAgentListModelRefsForWrite(config) {
  const list = getPathValue(config, ["agents", "list"]);
  if (!Array.isArray(list)) return config;
  let mutated = false;
  const nextList = list.map((agent) => {
    if (!isRecord(agent)) return agent;
    const normalized = normalizeAgentModelRefsAtPathForWrite({ agent }, ["agent"]);
    if (normalized.agent !== agent) {
      mutated = true;
      return normalized.agent;
    }
    return agent;
  });
  return mutated ? setPathValue(config, ["agents", "list"], nextList) : config;
}
function normalizeToolsModelRefsForWrite(config) {
  return normalizeModelConfigPathForWrite(config, ["tools", "subagents", "model"]);
}
function normalizeModelProviderCatalogRefsForWrite(config, modelIdNormalizationPolicies) {
  const providers = getPathValue(config, ["models", "providers"]);
  if (!isRecord(providers)) return config;
  let mutated = false;
  const nextProviders = { ...providers };
  for (const [provider, providerConfig] of Object.entries(providers)) {
    if (!isRecord(providerConfig) || !Array.isArray(providerConfig.models)) continue;
    let providerMutated = false;
    const models = providerConfig.models.map((model) => {
      if (!isRecord(model) || typeof model.id !== "string") return model;
      const trimmed = model.id.trim();
      if (!trimmed) return model;
      const id = normalizeConfiguredProviderCatalogModelId(
        provider,
        trimmed,
        modelIdNormalizationPolicies,
      );
      if (id === model.id) return model;
      providerMutated = true;
      return {
        ...model,
        id,
      };
    });
    if (providerMutated) {
      nextProviders[provider] = {
        ...providerConfig,
        models,
      };
      mutated = true;
    }
  }
  return mutated ? setPathValue(config, ["models", "providers"], nextProviders) : config;
}
function normalizeModelRefsForWrite(config, modelIdNormalizationPolicies) {
  return normalizeModelProviderCatalogRefsForWrite(
    normalizeToolsModelRefsForWrite(
      normalizeAgentListModelRefsForWrite(
        normalizeAgentModelRefsAtPathForWrite(config, ["agents", "defaults"]),
      ),
    ),
    modelIdNormalizationPolicies,
  );
}
function projectRootAuthoredIncludeSibling(params) {
  if (
    params.nextPresent &&
    params.baselinePresent &&
    isDeepStrictEqual(params.next, params.baseline)
  )
    return {
      ok: true,
      present: true,
      value: cloneUnknown(params.authored),
    };
  if (!params.nextPresent)
    return collectIncludeOwnedPaths(params.authored).length > 0
      ? { ok: false }
      : {
          ok: true,
          present: false,
        };
  if (!params.baselinePresent)
    return {
      ok: true,
      present: true,
      value: cloneUnknown(params.next),
    };
  if (hasOwnValidIncludeDirective(params.authored)) return { ok: false };
  if (Array.isArray(params.authored))
    return Array.isArray(params.next)
      ? { ok: false }
      : {
          ok: true,
          present: true,
          value: cloneUnknown(params.next),
        };
  if (!isRecord(params.authored))
    return {
      ok: true,
      present: true,
      value: cloneUnknown(params.next),
    };
  if (!isRecord(params.next))
    return collectIncludeOwnedPaths(params.authored).length > 0
      ? { ok: false }
      : {
          ok: true,
          present: true,
          value: cloneUnknown(params.next),
        };
  if (!isRecord(params.baseline))
    return {
      ok: true,
      present: true,
      value: cloneUnknown(params.next),
    };
  const value = cloneUnknown(params.authored);
  const keys = /* @__PURE__ */ new Set([
    ...Object.keys(params.authored),
    ...Object.keys(params.baseline),
    ...Object.keys(params.next),
  ]);
  for (const key of keys) {
    if (isBlockedObjectKey(key)) continue;
    const authoredPresent = Object.hasOwn(params.authored, key);
    const baselinePresent = Object.hasOwn(params.baseline, key);
    const nextPresent = Object.hasOwn(params.next, key);
    if (!authoredPresent) {
      if (
        baselinePresent &&
        nextPresent &&
        isDeepStrictEqual(params.baseline[key], params.next[key])
      )
        continue;
      if (!nextPresent) return { ok: false };
      if (baselinePresent && Array.isArray(params.baseline[key]) && Array.isArray(params.next[key]))
        return { ok: false };
    }
    const projected = projectRootAuthoredIncludeSibling({
      authored: authoredPresent ? params.authored[key] : {},
      baseline: params.baseline[key],
      next: params.next[key],
      baselinePresent,
      nextPresent,
    });
    if (!projected.ok) return projected;
    if (projected.present) value[key] = projected.value;
    else delete value[key];
  }
  return {
    ok: true,
    present: true,
    value,
  };
}
function preserveUntouchedIncludes(params) {
  let next = params.persistedCandidate;
  for (const includePath of collectIncludeOwnedPaths(params.rootAuthoredConfig)) {
    const containingArrayPath = findContainingArrayPath(params.rootAuthoredConfig, includePath);
    const includeIsArrayEntry =
      containingArrayPath !== void 0 && includePath.length === containingArrayPath.length + 1;
    const comparisonPath = includeIsArrayEntry ? includePath : (containingArrayPath ?? includePath);
    const mutableSiblingPaths = collectMutableSiblingPathsAtInclude(
      params.rootAuthoredConfig,
      includePath,
    );
    const relativeMutableSiblingPaths = mutableSiblingPaths.map((path) =>
      path.slice(comparisonPath.length),
    );
    const omitMutableSiblingValues = (value) =>
      relativeMutableSiblingPaths.reduce((current, path) => deletePathValue(current, path), value);
    const nextValue = omitMutableSiblingValues(getPathValue(params.nextConfig, comparisonPath));
    const sourceValue = omitMutableSiblingValues(getPathValue(params.sourceConfig, comparisonPath));
    const runtimeValue = omitMutableSiblingValues(
      getPathValue(params.runtimeConfig, comparisonPath),
    );
    if (!isDeepStrictEqual(nextValue, sourceValue) && !isDeepStrictEqual(nextValue, runtimeValue))
      throw new Error(
        `Config write would flatten $include-owned config at ${formatConfigPath$1(includePath)}; edit that include file directly or remove the $include first.`,
      );
    if (includeIsArrayEntry) {
      const index = parseArrayIndexPathSegment(includePath.at(-1) ?? "");
      const nextArray = getPathValue(params.nextConfig, containingArrayPath);
      const sourceArray = getPathValue(params.sourceConfig, containingArrayPath);
      const runtimeArray = getPathValue(params.runtimeConfig, containingArrayPath);
      if (
        index !== void 0 &&
        (hasChangedEquivalentArraySibling(sourceArray, nextArray, index) ||
          hasChangedEquivalentArraySibling(runtimeArray, nextArray, index) ||
          hasNewEquivalentArraySibling(sourceArray, nextArray, index) ||
          hasNewEquivalentArraySibling(runtimeArray, nextArray, index))
      )
        throw new Error(
          `Config write would flatten $include-owned config at ${formatConfigPath$1(includePath)}; edit that include file directly or remove the $include first.`,
        );
    }
    let authoredIncludeValue = getPathValue(params.rootAuthoredConfig, includePath);
    for (const siblingPath of mutableSiblingPaths) {
      const relativeSiblingPath = siblingPath.slice(includePath.length);
      const nextPresent = hasPathValue(params.nextConfig, siblingPath);
      const projectAgainst = (baselineConfig) =>
        projectRootAuthoredIncludeSibling({
          authored: getPathValue(params.rootAuthoredConfig, siblingPath),
          baseline: getPathValue(baselineConfig, siblingPath),
          next: getPathValue(params.nextConfig, siblingPath),
          baselinePresent: hasPathValue(baselineConfig, siblingPath),
          nextPresent,
        });
      const sourceProjection = projectAgainst(params.sourceConfig);
      const projection = sourceProjection.ok
        ? sourceProjection
        : projectAgainst(params.runtimeConfig);
      if (!projection.ok)
        throw new Error(
          `Config write would flatten $include-owned config at ${formatConfigPath$1(includePath)}; edit that include file directly or remove the $include first.`,
        );
      authoredIncludeValue = projection.present
        ? setPathValue(authoredIncludeValue, relativeSiblingPath, projection.value)
        : deletePathValue(authoredIncludeValue, relativeSiblingPath);
    }
    next = setPathValue(next, includePath, authoredIncludeValue);
  }
  return next;
}
function preserveIncludeOwnedConfigForWrite(params) {
  return preserveUntouchedIncludes({
    ...params,
    persistedCandidate: params.nextConfig,
  });
}
function hasPathValue(value, path) {
  if (path.length === 0) return true;
  const head = expectDefined(path[0], "config path head");
  const tail = path.slice(1);
  if (Array.isArray(value)) {
    const index = parseArrayIndexPathSegment(head);
    if (index === void 0 || index >= value.length) return false;
    return tail.length === 0 || hasPathValue(value[index], tail);
  }
  if (!isRecord(value)) return false;
  if (isBlockedObjectKey(head) || !Object.hasOwn(value, head)) return false;
  return tail.length === 0 || hasPathValue(value[head], tail);
}
function mergeMissingExplicitValues(currentValue, explicitValue) {
  if (!isRecord(currentValue) || !isRecord(explicitValue)) {
    if (!Array.isArray(currentValue) || !Array.isArray(explicitValue))
      return {
        changed: false,
        value: currentValue,
      };
    let changed = false;
    const next = [...currentValue];
    for (const [key, childExplicitValue] of Object.entries(explicitValue)) {
      const index = parseArrayIndexPathSegment(key);
      if (index === void 0) continue;
      if (index >= next.length || next[index] === void 0) {
        next[index] = cloneUnknown(childExplicitValue);
        changed = true;
        continue;
      }
      const childMerged = mergeMissingExplicitValues(next[index], childExplicitValue);
      if (childMerged.changed) {
        next[index] = childMerged.value;
        changed = true;
      }
    }
    return {
      changed,
      value: changed ? next : currentValue,
    };
  }
  let changed = false;
  const next = { ...currentValue };
  for (const [key, childExplicitValue] of Object.entries(explicitValue)) {
    if (isBlockedObjectKey(key)) continue;
    if (!Object.hasOwn(next, key)) {
      next[key] = cloneUnknown(childExplicitValue);
      changed = true;
      continue;
    }
    const childMerged = mergeMissingExplicitValues(next[key], childExplicitValue);
    if (childMerged.changed) {
      next[key] = childMerged.value;
      changed = true;
    }
  }
  return {
    changed,
    value: changed ? next : currentValue,
  };
}
function injectExplicitlySetPaths(params) {
  if (!params.explicitSetPaths || params.explicitSetPaths.length === 0)
    return params.persistedCandidate;
  let next = params.persistedCandidate;
  for (const path of params.explicitSetPaths) {
    if (path.length === 0 || path.some(isBlockedObjectKey)) continue;
    const includeOwnedPath = params.rootAuthoredConfig
      ? findOverlappingIncludeOwnedPath(params.rootAuthoredConfig, [...path])
      : void 0;
    if (includeOwnedPath)
      throw new Error(
        `Config write would flatten $include-owned config at ${formatConfigPath$1(includeOwnedPath)}; edit that include file directly or remove the $include first.`,
      );
    const nextValue = getPathValue(params.valueSource, [...path]);
    if (nextValue === void 0) continue;
    if (!hasPathValue(next, path)) {
      next = setPathValueCreatingParents(next, [...path], nextValue);
      continue;
    }
    const merged = mergeMissingExplicitValues(getPathValue(next, [...path]), nextValue);
    if (merged.changed) next = setPathValue(next, [...path], merged.value);
  }
  return next;
}
function resolvePersistCandidateForWrite(params) {
  const patch = createMergePatch(params.runtimeConfig, params.nextConfig);
  const projectedSource = projectSourceOntoRuntimeShape(params.sourceConfig, params.runtimeConfig);
  const rootAuthoredConfig = params.rootAuthoredConfig ?? params.sourceConfig;
  const persistedBase = preserveUntouchedIncludes({
    runtimeConfig: params.runtimeConfig,
    sourceConfig: params.sourceConfig,
    nextConfig: params.nextConfig,
    rootAuthoredConfig,
    persistedCandidate: applyMergePatch(projectedSource, patch),
  });
  const persisted = injectExplicitlySetPaths({
    valueSource: params.explicitSetValueSource ?? params.nextConfig,
    persistedCandidate: persistedBase,
    explicitSetPaths: params.explicitSetPaths,
    rootAuthoredConfig,
  });
  const withSchema = preserveRootSchemaUri({
    rootAuthoredConfig,
    nextConfig: params.nextConfig,
    persistedCandidate: persisted,
  });
  return normalizeModelRefsForWrite(
    preserveAuthoredAgentParams({
      sourceConfig: params.sourceConfig,
      nextConfig: params.nextConfig,
      rootAuthoredConfig,
      persistedCandidate: withSchema,
      unsetPaths: params.unsetPaths,
    }),
    params.modelIdNormalizationPolicies,
  );
}
function readRootSchemaUri(value) {
  if (!isRecord(value) || typeof value.$schema !== "string") return;
  return value.$schema;
}
function hasOwnRootSchemaKey(value) {
  return isRecord(value) && Object.hasOwn(value, "$schema");
}
function preserveRootSchemaUri(params) {
  if (hasOwnRootSchemaKey(params.nextConfig)) return params.persistedCandidate;
  const sourceSchema = readRootSchemaUri(params.rootAuthoredConfig);
  if (sourceSchema === void 0 || !isRecord(params.persistedCandidate))
    return params.persistedCandidate;
  return {
    ...params.persistedCandidate,
    $schema: sourceSchema,
  };
}
function formatConfigValidationFailure(pathLabel, issueMessage) {
  const match = issueMessage.match(OPEN_DM_POLICY_ALLOW_FROM_RE);
  const policyPath = match?.groups?.policyPath?.trim();
  const allowPath = match?.groups?.allowPath?.trim();
  if (!policyPath || !allowPath) return `Config validation failed: ${pathLabel}: ${issueMessage}`;
  return [
    `Config validation failed: ${pathLabel}`,
    "",
    `Configuration mismatch: ${policyPath} is "open", but ${allowPath} does not include "*".`,
    "",
    "Fix with:",
    `  openclaw config set ${allowPath} '["*"]'`,
    "",
    "Or switch policy:",
    `  openclaw config set ${policyPath} "pairing"`,
  ].join("\n");
}
function isNumericPathSegment(raw) {
  return parseArrayIndexPathSegment(raw) !== void 0;
}
function parseArrayIndexPathSegment(raw) {
  return parseConfigPathArrayIndex(raw);
}
function isWritePlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
function hasOwnObjectKey(value, key) {
  return Object.hasOwn(value, key);
}
const WRITE_PRUNED_OBJECT = Symbol("write-pruned-object");
function coerceConfig$1(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value;
}
function unsetPathForWriteAt(value, pathSegments, depth) {
  if (depth >= pathSegments.length)
    return {
      changed: false,
      value,
    };
  const segment = expectDefined(pathSegments[depth], "path segments entry at depth");
  const isLeaf = depth === pathSegments.length - 1;
  if (Array.isArray(value)) {
    const index = parseArrayIndexPathSegment(segment);
    if (index === void 0 || index >= value.length)
      return {
        changed: false,
        value,
      };
    if (isLeaf) {
      const next = value.slice();
      next.splice(index, 1);
      return {
        changed: true,
        value: next,
      };
    }
    const child = unsetPathForWriteAt(value[index], pathSegments, depth + 1);
    if (!child.changed)
      return {
        changed: false,
        value,
      };
    const next = value.slice();
    if (child.value === WRITE_PRUNED_OBJECT) next.splice(index, 1);
    else next[index] = child.value;
    return {
      changed: true,
      value: next,
    };
  }
  if (isBlockedObjectKey(segment) || !isWritePlainObject(value) || !hasOwnObjectKey(value, segment))
    return {
      changed: false,
      value,
    };
  if (isLeaf) {
    const next = { ...value };
    delete next[segment];
    return {
      changed: true,
      value: Object.keys(next).length === 0 ? WRITE_PRUNED_OBJECT : next,
    };
  }
  const child = unsetPathForWriteAt(value[segment], pathSegments, depth + 1);
  if (!child.changed)
    return {
      changed: false,
      value,
    };
  const next = { ...value };
  if (child.value === WRITE_PRUNED_OBJECT) delete next[segment];
  else next[segment] = child.value;
  return {
    changed: true,
    value: Object.keys(next).length === 0 ? WRITE_PRUNED_OBJECT : next,
  };
}
function unsetPathForWrite(root, pathSegments) {
  if (pathSegments.length === 0)
    return {
      changed: false,
      next: root,
    };
  const result = unsetPathForWriteAt(root, pathSegments, 0);
  if (!result.changed)
    return {
      changed: false,
      next: root,
    };
  if (result.value === WRITE_PRUNED_OBJECT)
    return {
      changed: true,
      next: {},
    };
  if (isWritePlainObject(result.value))
    return {
      changed: true,
      next: coerceConfig$1(result.value),
    };
  return {
    changed: false,
    next: root,
  };
}
function applyUnsetPathsForWrite(root, unsetPaths) {
  let next = root;
  for (const unsetPath of unsetPaths ?? []) {
    if (!Array.isArray(unsetPath) || unsetPath.length === 0) continue;
    const unsetResult = unsetPathForWrite(next, unsetPath);
    if (unsetResult.changed) next = unsetResult.next;
  }
  return next;
}
function resolveManagedUnsetPathsForWrite(unsetPaths) {
  const next = [];
  for (const managedPath of MANAGED_CONFIG_UNSET_PATHS) next.push(Array.from(managedPath));
  for (const unsetPath of unsetPaths ?? []) {
    if (!Array.isArray(unsetPath) || unsetPath.length === 0) continue;
    if (next.some((existing) => isDeepStrictEqual(existing, unsetPath))) continue;
    next.push([...unsetPath]);
  }
  return next;
}
function collectChangedPaths(base, target, path, output) {
  if (Array.isArray(base) && Array.isArray(target)) {
    const max = Math.max(base.length, target.length);
    for (let index = 0; index < max; index += 1) {
      const childPath = path ? `${path}[${index}]` : `[${index}]`;
      if (index >= base.length || index >= target.length) {
        output.add(childPath);
        continue;
      }
      collectChangedPaths(base[index], target[index], childPath, output);
    }
    return;
  }
  if (isRecord(base) && isRecord(target)) {
    const keys = /* @__PURE__ */ new Set([...Object.keys(base), ...Object.keys(target)]);
    for (const key of keys) {
      const childPath = path ? `${path}.${key}` : key;
      const hasBase = Object.hasOwn(base, key);
      if (!Object.hasOwn(target, key) || !hasBase) {
        output.add(childPath);
        continue;
      }
      collectChangedPaths(base[key], target[key], childPath, output);
    }
    return;
  }
  if (!isDeepStrictEqual(base, target)) output.add(path);
}
function parentPath(value) {
  if (!value) return "";
  if (value.endsWith("]")) {
    const index = value.lastIndexOf("[");
    return index > 0 ? value.slice(0, index) : "";
  }
  const index = value.lastIndexOf(".");
  return index >= 0 ? value.slice(0, index) : "";
}
function isPathChanged(path, changedPaths) {
  if (changedPaths.has(path)) return true;
  let current = parentPath(path);
  while (current) {
    if (changedPaths.has(current)) return true;
    current = parentPath(current);
  }
  return changedPaths.has("");
}
function restoreEnvRefsFromMap(
  value,
  path,
  envRefMap,
  changedPaths,
  identityRestoredPaths = /* @__PURE__ */ new Set(),
) {
  if (typeof value === "string") {
    if (identityRestoredPaths.has(path)) return value;
    if (!isPathChanged(path, changedPaths)) {
      const original = envRefMap.get(path);
      if (original !== void 0) return original;
    }
    return value;
  }
  if (Array.isArray(value)) {
    let changed = false;
    const next = value.map((item, index) => {
      const updated = restoreEnvRefsFromMap(
        item,
        `${path}[${index}]`,
        envRefMap,
        changedPaths,
        identityRestoredPaths,
      );
      if (updated !== item) changed = true;
      return updated;
    });
    return changed ? next : value;
  }
  if (isRecord(value)) {
    let changed = false;
    const next = {};
    for (const [key, child] of Object.entries(value)) {
      const updated = restoreEnvRefsFromMap(
        child,
        path ? `${path}.${key}` : key,
        envRefMap,
        changedPaths,
        identityRestoredPaths,
      );
      if (updated !== child) changed = true;
      next[key] = updated;
    }
    return changed ? next : value;
  }
  return value;
}
function resolveWriteEnvSnapshotForPath(params) {
  if (params.expectedConfigPath === void 0 || params.expectedConfigPath === params.actualConfigPath)
    return params.envSnapshotForRestore;
}
/** Resolves top-level agent concurrency, flooring finite values and clamping to at least one. */
function resolveAgentMaxConcurrent(cfg) {
  const raw = cfg?.agents?.defaults?.maxConcurrent;
  if (typeof raw === "number" && Number.isFinite(raw)) return Math.max(1, Math.floor(raw));
  return 4;
}
/** Resolves subagent concurrency, flooring finite values and clamping to at least one. */
function resolveSubagentMaxConcurrent(cfg) {
  const raw = cfg?.agents?.defaults?.subagents?.maxConcurrent;
  if (typeof raw === "number" && Number.isFinite(raw)) return Math.max(1, Math.floor(raw));
  return 8;
}
const DEFAULT_CRON_TRIGGER_MIN_INTERVAL_MS = 3e4;
/** Resolves cron concurrency config, flooring finite values and clamping to at least one. */
function resolveCronMaxConcurrentRuns(cronConfig) {
  const raw = cronConfig?.maxConcurrentRuns;
  if (typeof raw === "number" && Number.isFinite(raw)) return Math.max(1, Math.floor(raw));
  return 8;
}
/** Resolves the minimum cadence for trigger-bearing cron jobs. */
function resolveCronTriggerMinIntervalMs(cronConfig) {
  const raw = cronConfig?.triggers?.minIntervalMs;
  if (typeof raw === "number" && Number.isFinite(raw)) return Math.max(1, Math.floor(raw));
  return DEFAULT_CRON_TRIGGER_MIN_INTERVAL_MS;
}
//#endregion
//#region src/config/provider-policy.ts
/** Applies bundled provider-owned normalization to one provider config during config defaults. */
function normalizeProviderConfigForConfigDefaults(params) {
  const normalized = resolveBundledProviderPolicySurface(params.provider, {
    manifestRegistry: params.manifestRegistry,
  })?.normalizeConfig?.({
    provider: params.provider,
    providerConfig: params.providerConfig,
  });
  return normalized && normalized !== params.providerConfig ? normalized : params.providerConfig;
}
/** Applies bundled provider-owned defaults to the full config when that provider has policy. */
function applyProviderConfigDefaultsForConfig(params) {
  return (
    resolveBundledProviderPolicySurface(params.provider, {
      manifestRegistry: params.manifestRegistry,
    })?.applyConfigDefaults?.({
      provider: params.provider,
      config: params.config,
      env: params.env,
    }) ?? params.config
  );
}
//#endregion
//#region src/config/defaults.ts
const defaultWarnState = { warned: false };
const DEFAULT_MODEL_ALIASES = {
  opus: "anthropic/claude-opus-4-8",
  sonnet: "anthropic/claude-sonnet-5",
  gpt: "openai/gpt-5.4",
  "gpt-mini": "openai/gpt-5.4-mini",
  "gpt-nano": "openai/gpt-5.4-nano",
  gemini: "google/gemini-3.1-pro-preview",
  "gemini-flash": "google/gemini-3-flash-preview",
  "gemini-flash-lite": "google/gemini-3.1-flash-lite",
};
const DEFAULT_MODEL_COST = {
  input: 0,
  output: 0,
  cacheRead: 0,
  cacheWrite: 0,
};
const DEFAULT_MODEL_INPUT = ["text"];
const DEFAULT_MODEL_MAX_TOKENS = 8192;
const MISTRAL_SAFE_MAX_TOKENS_BY_MODEL = {
  "devstral-medium-latest": 32768,
  "magistral-small": 4e4,
  "mistral-large-latest": 16384,
  "mistral-medium-2508": 8192,
  "mistral-small-latest": 16384,
  "pixtral-large-latest": 32768,
};
function isPositiveNumber(value) {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}
function resolveModelCost(raw) {
  return {
    input: typeof raw?.input === "number" ? raw.input : DEFAULT_MODEL_COST.input,
    output: typeof raw?.output === "number" ? raw.output : DEFAULT_MODEL_COST.output,
    cacheRead: typeof raw?.cacheRead === "number" ? raw.cacheRead : DEFAULT_MODEL_COST.cacheRead,
    cacheWrite:
      typeof raw?.cacheWrite === "number" ? raw.cacheWrite : DEFAULT_MODEL_COST.cacheWrite,
    ...(raw?.tieredPricing ? { tieredPricing: raw.tieredPricing } : {}),
  };
}
function resolveNormalizedProviderModelMaxTokens(params) {
  const clamped = Math.min(params.rawMaxTokens, params.contextWindow);
  if (normalizeProviderId(params.providerId) !== "mistral" || clamped < params.contextWindow)
    return clamped;
  const safeMaxTokens =
    MISTRAL_SAFE_MAX_TOKENS_BY_MODEL[params.modelId] ?? DEFAULT_MODEL_MAX_TOKENS;
  return Math.min(safeMaxTokens, params.contextWindow);
}
function applyMessageDefaults(cfg) {
  const messages = cfg.messages;
  if (messages?.ackReactionScope !== void 0) return cfg;
  const nextMessages = messages ? { ...messages } : {};
  nextMessages.ackReactionScope = "group-mentions";
  return {
    ...cfg,
    messages: nextMessages,
  };
}
function applySessionDefaults(cfg, options = {}) {
  const session = cfg.session;
  if (!session || session.mainKey === void 0) return cfg;
  const trimmed = session.mainKey.trim();
  const warn = options.warn ?? console.warn;
  const warnState = options.warnState ?? defaultWarnState;
  const next = {
    ...cfg,
    session: {
      ...session,
      mainKey: "main",
    },
  };
  if (trimmed && trimmed !== "main" && !warnState.warned) {
    warnState.warned = true;
    warn('session.mainKey is ignored; main session is always "main".');
  }
  return next;
}
function applyTalkConfigNormalization(config) {
  return normalizeTalkConfig(config);
}
function applyModelDefaults(cfg, options = {}) {
  let mutated = false;
  let nextCfg = cfg;
  const providerConfig = nextCfg.models?.providers;
  if (providerConfig) {
    const manifestRegistry = options.manifestRegistry ?? options.loadManifestRegistry?.();
    const modelIdNormalizationPolicies = manifestRegistry
      ? collectManifestModelIdNormalizationPolicies(manifestRegistry.plugins)
      : void 0;
    const nextProviders = { ...providerConfig };
    for (const [providerId, provider] of Object.entries(providerConfig)) {
      const normalizedProvider = normalizeProviderConfigForConfigDefaults({
        provider: providerId,
        providerConfig: provider,
        manifestRegistry,
      });
      const models = normalizedProvider.models;
      if (!Array.isArray(models) || models.length === 0) {
        if (normalizedProvider !== provider) {
          nextProviders[providerId] = normalizedProvider;
          mutated = true;
        }
        continue;
      }
      const providerApi = normalizedProvider.api;
      const nextProvider = normalizedProvider;
      if (nextProvider !== provider) mutated = true;
      let providerMutated = false;
      const nextModels = models.map((model) => {
        const raw = model;
        let modelMutated = false;
        const id = normalizeConfiguredProviderCatalogModelId(
          providerId,
          raw.id,
          modelIdNormalizationPolicies,
        );
        if (id !== raw.id) modelMutated = true;
        const reasoning = typeof raw.reasoning === "boolean" ? raw.reasoning : false;
        if (raw.reasoning !== reasoning) modelMutated = true;
        const input = raw.input ?? [...DEFAULT_MODEL_INPUT];
        if (raw.input === void 0) modelMutated = true;
        const cost = resolveModelCost(raw.cost);
        if (
          !raw.cost ||
          raw.cost.input !== cost.input ||
          raw.cost.output !== cost.output ||
          raw.cost.cacheRead !== cost.cacheRead ||
          raw.cost.cacheWrite !== cost.cacheWrite
        )
          modelMutated = true;
        const contextWindow = isPositiveNumber(raw.contextWindow)
          ? raw.contextWindow
          : DEFAULT_CONTEXT_TOKENS;
        if (raw.contextWindow !== contextWindow) modelMutated = true;
        const defaultMaxTokens = Math.min(DEFAULT_MODEL_MAX_TOKENS, contextWindow);
        const rawMaxTokens = isPositiveNumber(raw.maxTokens) ? raw.maxTokens : defaultMaxTokens;
        const maxTokens = resolveNormalizedProviderModelMaxTokens({
          providerId,
          modelId: id,
          contextWindow,
          rawMaxTokens,
        });
        if (raw.maxTokens !== maxTokens) modelMutated = true;
        const api = raw.api ?? providerApi;
        if (raw.api !== api) modelMutated = true;
        if (!modelMutated) return model;
        providerMutated = true;
        return Object.assign({}, raw, {
          id,
          reasoning,
          input,
          cost,
          contextWindow,
          maxTokens,
          api,
        });
      });
      if (!providerMutated) {
        if (nextProvider !== provider) nextProviders[providerId] = nextProvider;
        continue;
      }
      nextProviders[providerId] = {
        ...nextProvider,
        models: nextModels,
      };
      mutated = true;
    }
    if (mutated)
      nextCfg = {
        ...nextCfg,
        models: {
          ...nextCfg.models,
          providers: nextProviders,
        },
      };
  }
  let nextAgents = nextCfg.agents;
  const rawAgentList = nextAgents?.list;
  if (Array.isArray(rawAgentList)) {
    let listMutated = false;
    const agentList = rawAgentList.map((agent) => {
      if (!isRecord(agent)) return agent;
      let nextAgent = agent;
      if (Object.hasOwn(agent, "model")) {
        const normalizedModel = normalizeAgentModelConfigForDefaults(agent.model);
        if (normalizedModel !== agent.model) {
          nextAgent = {
            ...nextAgent,
            model: normalizedModel,
          };
          listMutated = true;
        }
      }
      if (isRecord(agent.models)) {
        const normalizedModels = normalizeAgentModelMapForConfig(agent.models);
        if (normalizedModels !== agent.models) {
          nextAgent = {
            ...nextAgent,
            models: normalizedModels,
          };
          listMutated = true;
        }
      }
      return nextAgent;
    });
    if (listMutated) {
      nextAgents = {
        ...nextAgents,
        list: agentList,
      };
      mutated = true;
    }
  }
  const existingAgent = nextAgents?.defaults;
  if (!existingAgent) {
    if (!mutated) return cfg;
    return nextAgents === nextCfg.agents
      ? nextCfg
      : {
          ...nextCfg,
          agents: nextAgents,
        };
  }
  let nextAgent = existingAgent;
  const normalizedModel = normalizeAgentModelConfigForDefaults(existingAgent.model);
  if (normalizedModel !== existingAgent.model) {
    nextAgent = {
      ...nextAgent,
      model: normalizedModel,
    };
    mutated = true;
  }
  const rawExistingModels = existingAgent.models ?? {};
  const existingModels = normalizeAgentModelMapForConfig(rawExistingModels);
  if (existingModels !== rawExistingModels) mutated = true;
  if (Object.keys(existingModels).length === 0)
    return mutated
      ? {
          ...nextCfg,
          agents: {
            ...nextAgents,
            defaults: nextAgent,
          },
        }
      : cfg;
  const nextModels = { ...existingModels };
  for (const [alias, target] of Object.entries(DEFAULT_MODEL_ALIASES)) {
    const entry = nextModels[target];
    if (!entry) continue;
    if (entry.alias !== void 0) continue;
    const normalizedAlias = normalizeLowercaseStringOrEmpty(alias);
    if (
      Object.entries(nextModels).some(
        ([modelRef, candidate]) =>
          modelRef !== target &&
          normalizeLowercaseStringOrEmpty(candidate.alias) === normalizedAlias,
      )
    )
      continue;
    nextModels[target] = {
      ...entry,
      alias,
    };
    mutated = true;
  }
  if (!mutated) return cfg;
  return {
    ...nextCfg,
    agents: {
      ...nextAgents,
      defaults: {
        ...nextAgent,
        models: nextModels,
      },
    },
  };
}
function normalizeAgentModelConfigForDefaults(value) {
  if (typeof value === "string") {
    const normalized = normalizeAgentModelRefForConfig(value);
    return normalized === value ? value : normalized;
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) return value;
  const raw = value;
  let mutated = false;
  const next = { ...raw };
  if (typeof raw.primary === "string") {
    const primary = normalizeAgentModelRefForConfig(raw.primary);
    if (primary !== raw.primary) {
      next.primary = primary;
      mutated = true;
    }
  }
  if (Array.isArray(raw.fallbacks)) {
    const rawFallbacks = raw.fallbacks;
    const fallbacks = rawFallbacks.map((fallback) =>
      typeof fallback === "string" ? normalizeAgentModelRefForConfig(fallback) : fallback,
    );
    if (fallbacks.some((fallback, index) => fallback !== rawFallbacks[index])) {
      next.fallbacks = fallbacks;
      mutated = true;
    }
  }
  return mutated ? next : value;
}
function applyAgentDefaults(cfg) {
  const agents = cfg.agents;
  const defaults = agents?.defaults;
  const hasMax =
    typeof defaults?.maxConcurrent === "number" && Number.isFinite(defaults.maxConcurrent);
  const hasSubMax =
    typeof defaults?.subagents?.maxConcurrent === "number" &&
    Number.isFinite(defaults.subagents.maxConcurrent);
  const hasSubArchive =
    typeof defaults?.subagents?.archiveAfterMinutes === "number" &&
    Number.isFinite(defaults.subagents.archiveAfterMinutes);
  if (hasMax && hasSubMax && hasSubArchive) return cfg;
  let mutated = false;
  const nextDefaults = defaults ? { ...defaults } : {};
  if (!hasMax) {
    nextDefaults.maxConcurrent = 4;
    mutated = true;
  }
  const nextSubagents = defaults?.subagents ? { ...defaults.subagents } : {};
  if (!hasSubMax) {
    nextSubagents.maxConcurrent = 8;
    mutated = true;
  }
  if (!hasSubArchive) {
    nextSubagents.archiveAfterMinutes = 60;
    mutated = true;
  }
  if (!mutated) return cfg;
  return {
    ...cfg,
    agents: {
      ...agents,
      defaults: {
        ...nextDefaults,
        subagents: nextSubagents,
      },
    },
  };
}
function applyCronDefaults(cfg) {
  const raw = cfg.cron?.maxConcurrentRuns;
  if (typeof raw === "number" && Number.isFinite(raw)) return cfg;
  return {
    ...cfg,
    cron: {
      ...cfg.cron,
      maxConcurrentRuns: 8,
    },
  };
}
function applyLoggingDefaults(cfg) {
  const logging = cfg.logging;
  if (!logging) return cfg;
  if (logging.redactSensitive) return cfg;
  return {
    ...cfg,
    logging: {
      ...logging,
      redactSensitive: "tools",
    },
  };
}
function hasAnthropicDefaultSignal(cfg, env) {
  if (env.ANTHROPIC_API_KEY?.trim() || env.ANTHROPIC_OAUTH_TOKEN?.trim()) return true;
  const profiles = cfg.auth?.profiles;
  if (profiles)
    for (const profile of Object.values(profiles)) {
      const provider = normalizeProviderId(profile?.provider);
      if (provider === "anthropic" || provider === "claude-cli") return true;
    }
  const order = cfg.auth?.order;
  if (!order) return false;
  return Object.keys(order).some((provider) => {
    const normalizedProvider = normalizeProviderId(provider);
    if (normalizedProvider !== "anthropic" && normalizedProvider !== "claude-cli") return false;
    return order[provider] !== void 0;
  });
}
function applyContextPruningDefaults(cfg, options = {}) {
  if (!cfg.agents?.defaults) return cfg;
  if (!hasAnthropicDefaultSignal(cfg, process.env)) return cfg;
  return (
    applyProviderConfigDefaultsForConfig({
      provider: "anthropic",
      config: cfg,
      env: process.env,
      manifestRegistry: options.manifestRegistry,
    }) ?? cfg
  );
}
function applyCompactionDefaults(cfg) {
  const defaults = cfg.agents?.defaults;
  if (!defaults) return cfg;
  const compaction = defaults?.compaction;
  if (compaction?.mode) return cfg;
  return {
    ...cfg,
    agents: {
      ...cfg.agents,
      defaults: {
        ...defaults,
        compaction: {
          ...compaction,
          mode: "safeguard",
        },
      },
    },
  };
}
//#endregion
//#region src/config/normalize-exec-safe-bin.ts
/**
 * Config normalization for exec safe-bin policy before materialized config is consumed.
 * Keep this limited to persisted global/per-agent config shape; runtime trust decisions live in infra.
 */
/** Normalize exec safe-bin profiles and trusted dirs in global and per-agent config scopes. */
function normalizeExecSafeBinProfilesInConfig(cfg) {
  const normalizeExec = (exec) => {
    if (!exec || typeof exec !== "object" || Array.isArray(exec)) return;
    const typedExec = exec;
    const normalizedProfiles = normalizeSafeBinProfileFixtures(typedExec.safeBinProfiles);
    typedExec.safeBinProfiles =
      Object.keys(normalizedProfiles).length > 0 ? normalizedProfiles : void 0;
    const normalizedTrustedDirs = normalizeTrustedSafeBinDirs(typedExec.safeBinTrustedDirs);
    typedExec.safeBinTrustedDirs =
      normalizedTrustedDirs.length > 0 ? normalizedTrustedDirs : void 0;
  };
  normalizeExec(cfg.tools?.exec);
  const agents = Array.isArray(cfg.agents?.list) ? cfg.agents.list : [];
  for (const agent of agents) normalizeExec(agent?.tools?.exec);
}
//#endregion
//#region src/config/normalize-paths.ts
const PATH_VALUE_RE = /^~(?=$|[\\/])/;
const PATH_KEY_RE = /(dir|path|paths|file|root|workspace)$/i;
const PATH_LIST_KEYS = /* @__PURE__ */ new Set(["paths", "pathPrepend"]);
function normalizeStringValue(key, value) {
  if (!PATH_VALUE_RE.test(value.trim())) return value;
  if (!key) return value;
  if (PATH_KEY_RE.test(key) || PATH_LIST_KEYS.has(key)) return resolveUserPath(value);
  return value;
}
function normalizeAny(key, value) {
  if (typeof value === "string") return normalizeStringValue(key, value);
  if (Array.isArray(value)) {
    const normalizeChildren = Boolean(key && PATH_LIST_KEYS.has(key));
    return value.map((entry) => {
      if (typeof entry === "string")
        return normalizeChildren ? normalizeStringValue(key, entry) : entry;
      if (Array.isArray(entry)) return normalizeAny(void 0, entry);
      if (isPlainObject(entry)) return normalizeAny(void 0, entry);
      return entry;
    });
  }
  if (!isPlainObject(value)) return value;
  for (const [childKey, childValue] of Object.entries(value)) {
    const next = normalizeAny(childKey, childValue);
    if (next !== childValue) value[childKey] = next;
  }
  return value;
}
/**
 * Normalize "~" paths in path-ish config fields.
 *
 * Goal: accept `~/...` consistently across config file + env overrides, while
 * keeping the surface area small and predictable.
 */
function normalizeConfigPaths(cfg) {
  if (!cfg || typeof cfg !== "object") return cfg;
  normalizeAny(void 0, cfg);
  return cfg;
}
//#endregion
//#region src/config/materialize.ts
const MATERIALIZATION_PROFILES = {
  load: {
    includeCompactionDefaults: true,
    includeContextPruningDefaults: true,
    includeLoggingDefaults: true,
    normalizePaths: true,
  },
  missing: {
    includeCompactionDefaults: true,
    includeContextPruningDefaults: true,
    includeLoggingDefaults: false,
    normalizePaths: false,
  },
  snapshot: {
    includeCompactionDefaults: false,
    includeContextPruningDefaults: false,
    includeLoggingDefaults: true,
    normalizePaths: true,
  },
};
function asResolvedSourceConfig(config) {
  return config;
}
function asRuntimeConfig(config) {
  return config;
}
function materializeRuntimeConfig(config, mode, options = {}) {
  const profile = MATERIALIZATION_PROFILES[mode];
  let next = applyMessageDefaults(config);
  if (profile.includeLoggingDefaults) next = applyLoggingDefaults(next);
  next = applySessionDefaults(next);
  next = applyAgentDefaults(next);
  next = applyCronDefaults(next);
  if (profile.includeContextPruningDefaults)
    next = applyContextPruningDefaults(next, { manifestRegistry: options.manifestRegistry });
  if (profile.includeCompactionDefaults) next = applyCompactionDefaults(next);
  next = applyModelDefaults(next, {
    manifestRegistry: options.manifestRegistry,
    loadManifestRegistry: options.loadManifestRegistry,
  });
  next = applyTalkConfigNormalization(next);
  if (profile.normalizePaths) normalizeConfigPaths(next);
  normalizeExecSafeBinProfilesInConfig(next);
  return asRuntimeConfig(next);
}
//#endregion
//#region src/config/mutation-conflict.ts
/** Raised when a config write loses an optimistic snapshot race. */
var ConfigMutationConflictError = class extends Error {
  constructor(message, params) {
    super(message);
    this.name = "ConfigMutationConflictError";
    this.currentHash = params.currentHash;
    this.retryable = params.retryable ?? true;
  }
};
//#endregion
//#region src/config/runtime-overrides.ts
let overrides = {};
function sanitizeOverrideValue(value, seen = /* @__PURE__ */ new WeakSet()) {
  if (Array.isArray(value)) return value.map((entry) => sanitizeOverrideValue(entry, seen));
  if (!isPlainObject(value)) return value;
  if (seen.has(value)) return {};
  seen.add(value);
  const sanitized = {};
  for (const [key, entry] of Object.entries(value)) {
    if (entry === void 0 || isBlockedObjectKey(key)) continue;
    sanitized[key] = sanitizeOverrideValue(entry, seen);
  }
  seen.delete(value);
  return sanitized;
}
function mergeOverrides(base, override) {
  if (!isPlainObject(base) || !isPlainObject(override)) return override;
  const next = { ...base };
  for (const [key, value] of Object.entries(override)) {
    if (value === void 0 || isBlockedObjectKey(key)) continue;
    next[key] = mergeOverrides(base[key], value);
  }
  return next;
}
/** Return the process-local runtime override tree used by debug config commands. */
function getConfigOverrides() {
  return overrides;
}
/** Clear all process-local runtime overrides. Intended for debug reset flows and tests. */
function resetConfigOverrides() {
  overrides = {};
}
/** Set one runtime override at a parsed config path after sanitizing object values. */
function setConfigOverride(pathRaw, value) {
  const parsed = parseConfigPath(pathRaw);
  if (!parsed.ok) return err(parsed.error);
  setConfigValueAtPath(overrides, parsed.path, sanitizeOverrideValue(value));
  return ok(parsed.path);
}
/** Remove one runtime override path and report whether an override was present. */
function unsetConfigOverride(pathRaw) {
  const parsed = parseConfigPath(pathRaw);
  if (!parsed.ok) return err(parsed.error);
  return ok(unsetConfigValueAtPath(overrides, parsed.path));
}
/** Merge the current runtime overrides over a loaded config without mutating the input config. */
function applyConfigOverrides(cfg) {
  if (!overrides || Object.keys(overrides).length === 0) return cfg;
  return mergeOverrides(cfg, overrides);
}
/** Capture an immutable applier for the process-local overrides active at this instant. */
function captureConfigOverrideApplier() {
  const capturedOverrides = structuredClone(overrides);
  if (Object.keys(capturedOverrides).length === 0) return (cfg) => cfg;
  return (cfg) => mergeOverrides(cfg, capturedOverrides);
}
//#endregion
//#region src/config/runtime-source-projection.ts
function isCompatibleTopLevelRuntimeProjectionShape(params) {
  const runtime = params.runtimeSnapshot;
  const candidate = params.candidate;
  for (const key of Object.keys(runtime)) {
    if (!Object.hasOwn(candidate, key)) return false;
    const runtimeValue = runtime[key];
    const candidateValue = candidate[key];
    if (
      (Array.isArray(runtimeValue)
        ? "array"
        : runtimeValue === null
          ? "null"
          : typeof runtimeValue) !==
      (Array.isArray(candidateValue)
        ? "array"
        : candidateValue === null
          ? "null"
          : typeof candidateValue)
    )
      return false;
  }
  return true;
}
/** Projects a runtime-derived config back onto the active authored source snapshot. */
function projectConfigOntoRuntimeSourceSnapshot(config) {
  const runtimeConfigSnapshot = getRuntimeConfigSnapshot();
  const runtimeConfigSourceSnapshot = getRuntimeConfigSourceSnapshot();
  if (!runtimeConfigSnapshot || !runtimeConfigSourceSnapshot) return config;
  if (config === runtimeConfigSnapshot) return runtimeConfigSourceSnapshot;
  if (
    !isCompatibleTopLevelRuntimeProjectionShape({
      runtimeSnapshot: runtimeConfigSnapshot,
      candidate: config,
    })
  )
    return config;
  return applyMergePatch(
    projectSourceOntoRuntimeShape(runtimeConfigSourceSnapshot, runtimeConfigSnapshot),
    createMergePatch(runtimeConfigSnapshot, config),
  );
}
//#endregion
//#region src/secrets/unsupported-surface-policy.ts
/** Defines unsupported secret-ref surfaces and operator-facing policy messages. */
const CORE_UNSUPPORTED_SECRETREF_SURFACE_PATTERNS = [
  "commands.ownerDisplaySecret",
  "hooks.token",
  "hooks.gmail.pushToken",
  "hooks.mappings[].sessionKey",
  "auth-profiles.oauth.*",
];
const CORE_UNSUPPORTED_SECRETREF_CONFIG_CANDIDATE_PATTERNS = [
  "commands.ownerDisplaySecret",
  "hooks.token",
  "hooks.gmail.pushToken",
  "hooks.mappings[].sessionKey",
];
const bundledChannelUnsupportedSecretRefSurfacePatterns = [
  ...new Set(
    GENERATED_BUNDLED_CHANNEL_CONFIG_METADATA.flatMap((entry) =>
      "unsupportedSecretRefSurfacePatterns" in entry
        ? (entry.unsupportedSecretRefSurfacePatterns ?? [])
        : [],
    ),
  ),
];
const unsupportedSecretRefSurfacePatterns = [
  ...CORE_UNSUPPORTED_SECRETREF_SURFACE_PATTERNS,
  ...bundledChannelUnsupportedSecretRefSurfacePatterns,
];
const unsupportedSecretRefConfigCandidatePatterns = [
  ...CORE_UNSUPPORTED_SECRETREF_CONFIG_CANDIDATE_PATTERNS,
  ...bundledChannelUnsupportedSecretRefSurfacePatterns,
];
const parsedPatternCache = /* @__PURE__ */ new Map();
function parseUnsupportedSecretRefSurfacePattern(pattern) {
  const cached = parsedPatternCache.get(pattern);
  if (cached) return cached;
  const parsed = pattern
    .split(".")
    .filter((segment) => segment.length > 0)
    .map((segment) => {
      if (segment === "*") return { kind: "wildcard" };
      if (segment.endsWith("[]"))
        return {
          kind: "array",
          key: segment.slice(0, -2),
        };
      return {
        kind: "key",
        key: segment,
      };
    });
  parsedPatternCache.set(pattern, parsed);
  return parsed;
}
function collectPatternCandidates(params) {
  if (params.tokenIndex >= params.tokens.length) {
    params.candidates.push({
      path: params.pathSegments.join("."),
      value: params.current,
    });
    return;
  }
  const token = params.tokens[params.tokenIndex];
  if (!token) return;
  if (token.kind === "wildcard") {
    if (Array.isArray(params.current)) {
      for (const [index, value] of params.current.entries())
        collectPatternCandidates({
          ...params,
          current: value,
          tokenIndex: params.tokenIndex + 1,
          pathSegments: [...params.pathSegments, String(index)],
        });
      return;
    }
    if (!isRecord(params.current)) return;
    for (const [key, value] of Object.entries(params.current))
      collectPatternCandidates({
        ...params,
        current: value,
        tokenIndex: params.tokenIndex + 1,
        pathSegments: [...params.pathSegments, key],
      });
    return;
  }
  if (!isRecord(params.current)) return;
  if (token.kind === "array") {
    if (!Object.hasOwn(params.current, token.key)) return;
    const value = params.current[token.key];
    if (!Array.isArray(value)) return;
    for (const [index, entry] of value.entries())
      collectPatternCandidates({
        ...params,
        current: entry,
        tokenIndex: params.tokenIndex + 1,
        pathSegments: [...params.pathSegments, token.key, String(index)],
      });
    return;
  }
  if (!Object.hasOwn(params.current, token.key)) return;
  collectPatternCandidates({
    ...params,
    current: params.current[token.key],
    tokenIndex: params.tokenIndex + 1,
    pathSegments: [...params.pathSegments, token.key],
  });
}
/**
 * Returns canonical config/auth-profile path patterns that do not support SecretRef values.
 */
function listUnsupportedSecretRefSurfacePatterns() {
  return [...unsupportedSecretRefSurfacePatterns];
}
/**
 * Finds configured openclaw.json values whose surfaces currently reject SecretRef objects.
 */
function collectUnsupportedSecretRefConfigCandidates(raw) {
  if (!isRecord(raw)) return [];
  const candidates = [];
  for (const pattern of unsupportedSecretRefConfigCandidatePatterns)
    collectPatternCandidates({
      current: raw,
      tokens: parseUnsupportedSecretRefSurfacePattern(pattern),
      tokenIndex: 0,
      pathSegments: [],
      candidates,
    });
  return candidates;
}
const unsupportedSecretRefSurfacePolicy = {
  listPatterns: listUnsupportedSecretRefSurfacePatterns,
  collectConfigCandidates: collectUnsupportedSecretRefConfigCandidates,
};
//#endregion
//#region src/config/channel-config-metadata.ts
const PLUGIN_ORIGIN_RANK = {
  config: 0,
  workspace: 1,
  global: 2,
  bundled: 3,
};
/** Collects plugin config UI metadata with deterministic origin precedence and output ordering. */
function collectPluginSchemaMetadata(registry) {
  const deduped = /* @__PURE__ */ new Map();
  for (const record of registry.plugins) {
    const current = deduped.get(record.id);
    const nextRank = PLUGIN_ORIGIN_RANK[record.origin] ?? Number.MAX_SAFE_INTEGER;
    if (current && current.originRank <= nextRank) continue;
    deduped.set(record.id, {
      id: record.id,
      name: record.name,
      description: record.description,
      configUiHints: record.configUiHints,
      configSchema: record.configSchema,
      originRank: nextRank,
    });
  }
  return [...deduped.values()]
    .toSorted((left, right) => left.id.localeCompare(right.id))
    .map(({ originRank: _originRank, ...record }) => record);
}
/** Collects per-channel config metadata with the plugin that supplied the selected schema. */
function collectChannelSchemaMetadataWithOwnership(registry) {
  const byChannelId = /* @__PURE__ */ new Map();
  for (const record of registry.plugins) {
    const originRank = PLUGIN_ORIGIN_RANK[record.origin] ?? Number.MAX_SAFE_INTEGER;
    const rootLabel = record.channelCatalogMeta?.label;
    const rootDescription = record.channelCatalogMeta?.blurb;
    for (const channelId of record.channels) {
      const current = byChannelId.get(channelId);
      if (!current || originRank <= current.originRank)
        byChannelId.set(channelId, {
          id: channelId,
          label: rootLabel ?? current?.label,
          description: rootDescription ?? current?.description,
          configSchema: current?.configSchema,
          configUiHints: current?.configUiHints,
          schemaPluginId: current?.schemaPluginId,
          schemaPluginOrigin: current?.schemaPluginOrigin,
          originRank,
        });
    }
    for (const [channelId, channelConfig] of Object.entries(record.channelConfigs ?? {})) {
      const current = byChannelId.get(channelId);
      if (
        current &&
        current.originRank < originRank &&
        (current.configSchema !== void 0 || current.configUiHints !== void 0)
      )
        continue;
      byChannelId.set(channelId, {
        id: channelId,
        label: channelConfig.label ?? rootLabel ?? current?.label,
        description: channelConfig.description ?? rootDescription ?? current?.description,
        configSchema: channelConfig.schema,
        configUiHints: channelConfig.uiHints,
        schemaPluginId: channelConfig.schema === void 0 ? void 0 : record.id,
        schemaPluginOrigin: channelConfig.schema === void 0 ? void 0 : record.origin,
        originRank,
      });
    }
  }
  return [...byChannelId.values()]
    .toSorted((left, right) => left.id.localeCompare(right.id))
    .map(({ originRank: _originRank, ...entry }) => entry);
}
/** Collects public per-channel config UI metadata without internal schema ownership. */
function collectChannelSchemaMetadata(registry) {
  return collectChannelSchemaMetadataWithOwnership(registry).map(
    ({ schemaPluginId: _schemaPluginId, schemaPluginOrigin: _schemaPluginOrigin, ...entry }) =>
      entry,
  );
}
/** Collects channel DM policy metadata without importing doctor/runtime command modules. */
function collectChannelDmPolicyMetadata(registry) {
  const byChannelId = /* @__PURE__ */ new Map();
  const put = (channelId, originRank, dmAllowFromMode) => {
    const id = channelId?.trim();
    if (!id) return;
    const current = byChannelId.get(id);
    if (current && current.originRank < originRank) return;
    byChannelId.set(id, {
      id,
      ...(dmAllowFromMode ? { dmAllowFromMode } : {}),
      originRank,
    });
  };
  for (const record of registry.plugins) {
    const originRank = PLUGIN_ORIGIN_RANK[record.origin] ?? Number.MAX_SAFE_INTEGER;
    const packageChannelId = record.packageChannel?.id?.trim();
    const dmAllowFromMode = record.packageChannel?.doctorCapabilities?.dmAllowFromMode;
    for (const channelId of record.channels)
      put(channelId, originRank, channelId === packageChannelId ? dmAllowFromMode : void 0);
    put(packageChannelId, originRank, dmAllowFromMode);
    for (const channelId of Object.keys(record.channelConfigs ?? {}))
      put(channelId, originRank, channelId === packageChannelId ? dmAllowFromMode : void 0);
  }
  return [...byChannelId.values()]
    .toSorted((left, right) => left.id.localeCompare(right.id))
    .map(({ originRank: _originRank, ...entry }) => entry);
}
//#endregion
//#region src/config/validation.ts
const LEGACY_REMOVED_PLUGIN_IDS = /* @__PURE__ */ new Set([
  "google-antigravity-auth",
  "google-gemini-cli-auth",
  "skill-workshop",
]);
const BLOCKED_PLUGIN_CANDIDATE_PREFIX = "blocked plugin candidate:";
function formatRemovedPluginConfigWarning(pluginId) {
  if (pluginId === "skill-workshop")
    return "plugin removed: skill-workshop (stale plugin config ignored; Skill Workshop is built into OpenClaw skills now. Use skills.workshop settings and openclaw skills workshop commands, then remove this plugins config entry)";
  return `plugin removed: ${pluginId} (stale config entry ignored; remove it from plugins config)`;
}
function stripDeprecatedValidationKeys(raw) {
  if (!isRecord(raw) || !isRecord(raw.commands) || !Object.hasOwn(raw.commands, "modelsWrite"))
    return raw;
  const commands = { ...raw.commands };
  delete commands.modelsWrite;
  return {
    ...raw,
    commands,
  };
}
function materializeBundledModelProviderOverlays(config) {
  const providers = config.models?.providers;
  if (!providers) return config;
  let nextProviders;
  for (const [providerId, providerConfig] of Object.entries(providers)) {
    if (
      !isBuiltInModelProviderOverlayId(providerId) ||
      (providerConfig.baseUrl && Array.isArray(providerConfig.models))
    )
      continue;
    nextProviders ??= { ...providers };
    nextProviders[providerId] = {
      ...providerConfig,
      baseUrl: providerConfig.baseUrl ?? "",
      models: providerConfig.models ?? [],
    };
  }
  if (!nextProviders) return config;
  return {
    ...config,
    models: {
      ...config.models,
      providers: nextProviders,
    },
  };
}
function stripPreservedLegacyRootKeysForValidation(raw, keys) {
  if (!keys || keys.length === 0 || !isRecord(raw)) return raw;
  const next = { ...raw };
  for (const key of keys) delete next[key];
  return next;
}
const CUSTOM_EXPECTED_ONE_OF_RE = /expected one of ((?:"[^"]+"(?:\|"?[^"]+"?)*)+)/i;
const SECRETREF_POLICY_DOC_URL = "https://docs.openclaw.ai/reference/secretref-credential-surface";
const bundledChannelSchemaById = new Map(
  GENERATED_BUNDLED_CHANNEL_CONFIG_METADATA.filter((entry) => entry.configurable !== false).map(
    (entry) => [entry.channelId, entry.schema],
  ),
);
const bundledChannelIds = Object.freeze(
  GENERATED_BUNDLED_CHANNEL_CONFIG_METADATA.filter((entry) => entry.configurable !== false)
    .map((entry) => normalizeLowercaseStringOrEmpty(entry.channelId))
    .filter((channelId) => channelId.length > 0),
);
const bundledChannelIdSet = new Set(bundledChannelIds);
const bundledChannelAliases = new Map(
  GENERATED_BUNDLED_CHANNEL_CONFIG_METADATA.filter((entry) => entry.configurable !== false).flatMap(
    (entry) => {
      const channelId = normalizeLowercaseStringOrEmpty(entry.channelId);
      if (!channelId) return [];
      return (entry.aliases ?? [])
        .map((alias) => [normalizeLowercaseStringOrEmpty(alias), channelId])
        .filter(([alias]) => alias.length > 0);
    },
  ),
);
function normalizeBundledChannelId(raw) {
  const normalized = normalizeLowercaseStringOrEmpty(raw);
  if (!normalized) return null;
  const resolved = bundledChannelAliases.get(normalized) ?? normalized;
  return bundledChannelIdSet.has(resolved) ? resolved : null;
}
function toIssueRecord(value) {
  if (!value || typeof value !== "object") return null;
  return value;
}
function toConfigPathSegments(pathLocal3) {
  if (!Array.isArray(pathLocal3)) return [];
  return pathLocal3.filter((segment) => {
    const segmentType = typeof segment;
    return segmentType === "string" || segmentType === "number";
  });
}
function formatConfigPath(segments) {
  return segments.join(".");
}
function formatMissingOfficialExternalPluginWarning(pluginId, opts) {
  const catalogEntry = getOfficialExternalPluginCatalogEntry(pluginId);
  if (!catalogEntry) return null;
  const install = resolveOfficialExternalPluginInstall(catalogEntry);
  const npmSpec = install?.npmSpec?.trim();
  const clawhubSpec = install?.clawhubSpec?.trim();
  const installSpec =
    install?.defaultChoice === "clawhub" ? (clawhubSpec ?? npmSpec) : (npmSpec ?? clawhubSpec);
  if (!installSpec) return null;
  if (pluginId === "memory-lancedb" && opts?.selectedMissingMemorySlot)
    return `plugin not installed: ${pluginId} — gateway will run without persistent memory until installed; install the official external plugin with: openclaw plugins install ${installSpec}`;
  return `plugin not installed: ${pluginId} — install the official external plugin with: openclaw plugins install ${installSpec}`;
}
function asJsonSchemaLike(value) {
  return value && typeof value === "object" ? value : null;
}
function lookupJsonSchemaNode(schema, pathSegments) {
  let current = asJsonSchemaLike(schema);
  for (const segment of pathSegments) {
    if (!current) return null;
    if (typeof segment === "number") {
      const items = current.items;
      if (Array.isArray(items)) {
        current = asJsonSchemaLike(items[segment] ?? items[0]);
        continue;
      }
      current = asJsonSchemaLike(items);
      continue;
    }
    const properties = asJsonSchemaLike(current.properties);
    current =
      (properties && asJsonSchemaLike(properties[segment])) ||
      asJsonSchemaLike(current.additionalProperties);
  }
  return current;
}
function collectAllowedValuesFromJsonSchemaNode(schema) {
  const node = asJsonSchemaLike(schema);
  if (!node)
    return {
      values: [],
      incomplete: false,
      hasValues: false,
    };
  if (Object.hasOwn(node, "const"))
    return {
      values: [node.const],
      incomplete: false,
      hasValues: true,
    };
  if (Array.isArray(node.enum))
    return {
      values: node.enum,
      incomplete: false,
      hasValues: node.enum.length > 0,
    };
  const type = node.type;
  if (type === "boolean")
    return {
      values: [true, false],
      incomplete: false,
      hasValues: true,
    };
  if (Array.isArray(type) && type.includes("boolean"))
    return {
      values: [true, false],
      incomplete: false,
      hasValues: true,
    };
  const unionBranches = Array.isArray(node.anyOf)
    ? node.anyOf
    : Array.isArray(node.oneOf)
      ? node.oneOf
      : null;
  if (!unionBranches)
    return {
      values: [],
      incomplete: false,
      hasValues: false,
    };
  const collected = [];
  for (const branch of unionBranches) {
    const branchCollected = collectAllowedValuesFromJsonSchemaNode(branch);
    if (branchCollected.incomplete || !branchCollected.hasValues)
      return {
        values: [],
        incomplete: true,
        hasValues: false,
      };
    collected.push(...branchCollected.values);
  }
  return {
    values: collected,
    incomplete: false,
    hasValues: collected.length > 0,
  };
}
function collectAllowedValuesFromBundledChannelSchemaPath(pathSegments) {
  if (pathSegments[0] !== "channels" || typeof pathSegments[1] !== "string")
    return {
      values: [],
      incomplete: false,
      hasValues: false,
    };
  const channelSchema = bundledChannelSchemaById.get(pathSegments[1]);
  if (!channelSchema)
    return {
      values: [],
      incomplete: false,
      hasValues: false,
    };
  const targetNode = lookupJsonSchemaNode(channelSchema, pathSegments.slice(2));
  if (!targetNode)
    return {
      values: [],
      incomplete: false,
      hasValues: false,
    };
  return collectAllowedValuesFromJsonSchemaNode(targetNode);
}
function formatRawChannelConfigIssueMessage(message) {
  return `invalid config: ${message}`;
}
function buildDmPolicyDependencyWarning(params) {
  const channelBase = `channels.${params.channelId}`;
  const scope = params.accountId ? `${channelBase}.accounts.${params.accountId}` : channelBase;
  const allowFromPath = `${scope}.allowFrom`;
  const inherited = params.accountId && params.allowFromSource === "inherited";
  const allowFromSubject = inherited
    ? `${allowFromPath} is unset and ${channelBase}.allowFrom`
    : allowFromPath;
  const accountInheritedTarget = inherited ? ` or ${channelBase}.allowFrom` : "";
  const accountOverrideFix =
    params.accountId && !inherited
      ? `, remove ${allowFromPath} to inherit ${channelBase}.allowFrom,`
      : "";
  return {
    path: allowFromPath,
    message:
      params.violation === "open_requires_wildcard"
        ? `${scope}.dmPolicy="open" but ${allowFromSubject} does not include "*"; all DMs will be dropped. Add "*" to ${allowFromPath}${accountInheritedTarget}${accountOverrideFix} or set ${scope}.dmPolicy to "pairing"/"allowlist".`
        : `${scope}.dmPolicy="allowlist" but ${allowFromSubject} is empty; all DMs will be dropped. Add at least one sender ID to ${allowFromPath}${accountInheritedTarget}${accountOverrideFix} or change ${scope}.dmPolicy.`,
  };
}
const DM_POLICY_PSEUDO_CHANNEL_KEYS = /* @__PURE__ */ new Set([
  "defaults",
  "modelByChannel",
  "tools",
]);
function hasDefinedConfigValue(record, key) {
  return Object.hasOwn(record, key) && record[key] !== void 0;
}
function hasConfiguredDmAllowFrom(record, mode) {
  const dm = isRecord(record.dm) ? record.dm : null;
  if (mode === "nestedOnly")
    return (
      (dm !== null && hasDefinedConfigValue(dm, "allowFrom")) ||
      hasDefinedConfigValue(record, "allowFrom")
    );
  return (
    hasDefinedConfigValue(record, "allowFrom") ||
    (dm !== null && hasDefinedConfigValue(dm, "allowFrom"))
  );
}
function isConfigRecordEnabled(record) {
  return record.enabled !== false;
}
function hasChannelDmPolicyDependencyWarningCandidates(config) {
  if (!config.channels || !isRecord(config.channels)) return false;
  return Object.entries(config.channels).some(
    ([channelId, channelValue]) =>
      !DM_POLICY_PSEUDO_CHANNEL_KEYS.has(channelId) &&
      isRecord(channelValue) &&
      isConfigRecordEnabled(channelValue),
  );
}
/**
 * Surface dmPolicy/allowFrom dependency problems generically for every channel that
 * exposes DM policy via the canonical top-level `dmPolicy`/`allowFrom` fields. These
 * configs parse fine but drop every DM at runtime, so we warn (rather than reject) to
 * stay consistent with `security audit`/`doctor` and avoid breaking existing-but-usable
 * configs on upgrade.
 *
 * Resolution goes through the shared DM-access helpers so the warning matches the
 * effective policy/allowFrom the runtime sees, including the legacy `dm.*` aliases and
 * account->channel inheritance. `nestedOnly` channels (canonical fields under `dm.*`)
 * are skipped because their config shape does not match this warning's top-level paths.
 */
function collectChannelDmPolicyDependencyWarnings(config, options = {}) {
  if (!config.channels || !isRecord(config.channels)) return [];
  const warnings = [];
  for (const [channelId, channelValue] of Object.entries(config.channels)) {
    if (
      DM_POLICY_PSEUDO_CHANNEL_KEYS.has(channelId) ||
      !isRecord(channelValue) ||
      !isConfigRecordEnabled(channelValue)
    )
      continue;
    const mode = options.dmAllowFromModes?.get(channelId) ?? "topOnly";
    if (mode === "nestedOnly") continue;
    const channelViolation = evaluateDmPolicyAllowFromDependency({
      policy: resolveChannelDmPolicy({
        account: channelValue,
        mode,
      }),
      allowFrom: resolveChannelDmAllowFrom({
        account: channelValue,
        mode,
      }),
    });
    if (channelViolation)
      warnings.push(
        buildDmPolicyDependencyWarning({
          channelId,
          violation: channelViolation,
        }),
      );
    if (!isRecord(channelValue.accounts)) continue;
    for (const [accountId, accountValue] of Object.entries(channelValue.accounts)) {
      if (!isRecord(accountValue) || !isConfigRecordEnabled(accountValue)) continue;
      const allowFromSource = hasConfiguredDmAllowFrom(accountValue, mode)
        ? "explicit"
        : "inherited";
      const accountViolation = evaluateDmPolicyAllowFromDependency({
        policy: resolveChannelDmPolicy({
          account: accountValue,
          parent: channelValue,
          mode,
        }),
        allowFrom: resolveChannelDmAllowFrom({
          account: accountValue,
          parent: channelValue,
          mode,
        }),
      });
      if (accountViolation)
        warnings.push(
          buildDmPolicyDependencyWarning({
            channelId,
            accountId,
            allowFromSource,
            violation: accountViolation,
          }),
        );
    }
  }
  return warnings;
}
function collectRawBundledChannelConfigIssues(config) {
  if (!config.channels || !isRecord(config.channels)) return [];
  const issues = [];
  for (const [channelId, schema] of bundledChannelSchemaById) {
    if (!Object.hasOwn(config.channels, channelId)) continue;
    const result = validateJsonSchemaValue({
      schema,
      cacheKey: `raw-channel:${channelId}`,
      value: config.channels[channelId],
      applyDefaults: false,
    });
    if (result.ok) continue;
    for (const error of result.errors) {
      const message = error.additionalProperty
        ? `${error.message}: "${error.additionalProperty}"`
        : error.message;
      const pathLocal2 =
        error.path === "<root>" ? `channels.${channelId}` : `channels.${channelId}.${error.path}`;
      issues.push({
        path: pathLocal2,
        message: formatRawChannelConfigIssueMessage(message),
        allowedValues: error.allowedValues,
        allowedValuesHiddenCount: error.allowedValuesHiddenCount,
      });
    }
  }
  return issues;
}
function collectAllowedValuesFromCustomIssue(record) {
  const expectedMatch = (typeof record.message === "string" ? record.message : "").match(
    CUSTOM_EXPECTED_ONE_OF_RE,
  );
  if (expectedMatch?.[1]) {
    const values = [...expectedMatch[1].matchAll(/"([^"]+)"/g)].map((match) => match[1]);
    return {
      values,
      incomplete: false,
      hasValues: values.length > 0,
    };
  }
  return collectAllowedValuesFromBundledChannelSchemaPath(toConfigPathSegments(record.path));
}
function appendNumericBoundHint(message, record) {
  if ((typeof record.origin === "string" ? record.origin : "") !== "number") return message;
  const inclusive = record.inclusive === true;
  if (record.code === "too_big") {
    const maximum = typeof record.maximum === "number" ? record.maximum : void 0;
    if (maximum !== void 0)
      return inclusive
        ? `${message} (maximum: ${maximum})`
        : `${message} (must be less than ${maximum})`;
  }
  if (record.code === "too_small") {
    const minimum = typeof record.minimum === "number" ? record.minimum : void 0;
    if (minimum !== void 0)
      return inclusive
        ? `${message} (minimum: ${minimum})`
        : `${message} (must be greater than ${minimum})`;
  }
  return message;
}
function collectAllowedValuesFromIssue(issue) {
  const record = toIssueRecord(issue);
  if (!record)
    return {
      values: [],
      incomplete: false,
      hasValues: false,
    };
  const code = typeof record.code === "string" ? record.code : "";
  if (code === "invalid_value") {
    const values = record.values;
    if (!Array.isArray(values))
      return {
        values: [],
        incomplete: true,
        hasValues: false,
      };
    return {
      values,
      incomplete: false,
      hasValues: values.length > 0,
    };
  }
  if (code === "invalid_type") {
    if ((typeof record.expected === "string" ? record.expected : "") === "boolean")
      return {
        values: [true, false],
        incomplete: false,
        hasValues: true,
      };
    return {
      values: [],
      incomplete: true,
      hasValues: false,
    };
  }
  if (code === "custom") return collectAllowedValuesFromCustomIssue(record);
  if (code !== "invalid_union")
    return {
      values: [],
      incomplete: false,
      hasValues: false,
    };
  const nested = record.errors;
  if (!Array.isArray(nested) || nested.length === 0)
    return {
      values: [],
      incomplete: true,
      hasValues: false,
    };
  const collected = [];
  for (const branch of nested) {
    if (!Array.isArray(branch) || branch.length === 0)
      return {
        values: [],
        incomplete: true,
        hasValues: false,
      };
    const branchCollected = collectAllowedValuesFromIssueList(branch);
    if (branchCollected.incomplete || !branchCollected.hasValues)
      return {
        values: [],
        incomplete: true,
        hasValues: false,
      };
    collected.push(...branchCollected.values);
  }
  return {
    values: collected,
    incomplete: false,
    hasValues: collected.length > 0,
  };
}
function collectAllowedValuesFromIssueList(issues) {
  const collected = [];
  let hasValues = false;
  for (const issue of issues) {
    const branch = collectAllowedValuesFromIssue(issue);
    if (branch.incomplete)
      return {
        values: [],
        incomplete: true,
        hasValues: false,
      };
    if (!branch.hasValues) continue;
    hasValues = true;
    collected.push(...branch.values);
  }
  return {
    values: collected,
    incomplete: false,
    hasValues,
  };
}
function collectAllowedValuesFromUnknownIssue(issue) {
  const collection = collectAllowedValuesFromIssue(issue);
  if (collection.incomplete || !collection.hasValues) return [];
  return collection.values;
}
function isBindingsIssuePath(pathSegments) {
  return pathSegments[0] === "bindings" && typeof pathSegments[1] === "number";
}
function isRouteTypeMismatchIssue(issue) {
  const issuePath = toConfigPathSegments(issue.path);
  if (issuePath.length !== 1 || issuePath[0] !== "type") return false;
  if (issue.code !== "invalid_value" || !Array.isArray(issue.values)) return false;
  return issue.values.includes("route");
}
function extractBindingsSpecificUnionIssue(record, parentPath) {
  if (!isBindingsIssuePath(toConfigPathSegments(record.path)) || !Array.isArray(record.errors))
    return null;
  let matchingBranchIssue = null;
  let matchingBranchIsUnrecognized = false;
  let matchingBranchPathLen = -1;
  let sawRouteTypeMismatch = false;
  for (const errGroup of record.errors) {
    if (!Array.isArray(errGroup)) continue;
    const branch = errGroup.map((issue) => toIssueRecord(issue)).filter(Boolean);
    if (branch.length === 0) continue;
    if (branch.some((issue) => isRouteTypeMismatchIssue(issue))) {
      sawRouteTypeMismatch = true;
      continue;
    }
    let branchBestIssue = null;
    let branchBestIsUnrecognized = false;
    let branchBestPathLen = -1;
    for (const issue of branch) {
      const issueCode = typeof issue.code === "string" ? issue.code : "";
      const issuePathLen = toConfigPathSegments(issue.path).length;
      const issueIsUnrecognized = issueCode === "unrecognized_keys";
      if (
        issuePathLen > branchBestPathLen
          ? true
          : issuePathLen === branchBestPathLen && issueIsUnrecognized && !branchBestIsUnrecognized
      ) {
        branchBestIssue = issue;
        branchBestIsUnrecognized = issueIsUnrecognized;
        branchBestPathLen = issuePathLen;
      }
    }
    if (!branchBestIssue) continue;
    if (matchingBranchIssue) return null;
    matchingBranchIssue = branchBestIssue;
    matchingBranchIsUnrecognized = branchBestIsUnrecognized;
    matchingBranchPathLen = branchBestPathLen;
  }
  if (!sawRouteTypeMismatch || !matchingBranchIssue) return null;
  if (matchingBranchPathLen === 0 && !matchingBranchIsUnrecognized) return null;
  const subPath = formatConfigPath(toConfigPathSegments(matchingBranchIssue.path));
  return {
    path: parentPath && subPath ? `${parentPath}.${subPath}` : parentPath || subPath,
    message:
      typeof matchingBranchIssue.message === "string"
        ? matchingBranchIssue.message
        : "Invalid input",
  };
}
function isObjectSecretRefCandidate(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  return coerceSecretRef(value) !== null;
}
function formatUnsupportedMutableSecretRefMessage(pathInner) {
  return [
    `SecretRef objects are not supported at ${pathInner}.`,
    "This credential is runtime-mutable or runtime-managed and must stay a plain string value.",
    'Use a plain string (env template strings like "${MY_VAR}" are allowed).',
    `See ${SECRETREF_POLICY_DOC_URL}.`,
  ].join(" ");
}
function pushUnsupportedMutableSecretRefIssue(issues, pathScoped, value) {
  if (!isObjectSecretRefCandidate(value)) return;
  issues.push({
    path: pathScoped,
    message: formatUnsupportedMutableSecretRefMessage(pathScoped),
  });
}
function collectUnsupportedMutableSecretRefIssues(raw) {
  const issues = [];
  for (const candidate of unsupportedSecretRefSurfacePolicy.collectConfigCandidates(raw))
    pushUnsupportedMutableSecretRefIssue(issues, candidate.path, candidate.value);
  return issues;
}
function formatFilteredUnrecognizedKeyMessage(message, keys) {
  const quotedKeys = keys.map((key) => `"${key}"`).join(", ");
  if (/must not have additional properties/i.test(message))
    return `must not have additional properties: ${quotedKeys}`;
  return keys.length === 1 ? `Unrecognized key: ${quotedKeys}` : `Unrecognized keys: ${quotedKeys}`;
}
function filterUnsupportedMutableSecretRefSchemaIssue(params) {
  const { issue, policyIssue } = params;
  if (issue.path === policyIssue.path)
    return /expected string, received object/i.test(issue.message) ? null : issue;
  if (!issue.path || !policyIssue.path || !policyIssue.path.startsWith(`${issue.path}.`))
    return issue;
  const childKey = policyIssue.path.slice(issue.path.length + 1).split(".")[0];
  if (!childKey) return issue;
  if (!/Unrecognized key|must not have additional properties/i.test(issue.message)) return issue;
  const unrecognizedKeys = [...issue.message.matchAll(/"([^"]+)"/g)].map((match) => match[1]);
  if (unrecognizedKeys.length === 0) return issue;
  if (!unrecognizedKeys.includes(childKey)) return issue;
  const remainingKeys = unrecognizedKeys.filter((key) => key !== void 0 && key !== childKey);
  if (remainingKeys.length === 0) return null;
  return {
    ...issue,
    message: formatFilteredUnrecognizedKeyMessage(issue.message, remainingKeys),
  };
}
function mergeUnsupportedMutableSecretRefIssues(policyIssues, schemaIssues) {
  if (policyIssues.length === 0) return schemaIssues;
  const filteredSchemaIssues = schemaIssues.flatMap((issue) => {
    let filteredIssue = issue;
    for (const policyIssue of policyIssues) {
      if (!filteredIssue) return [];
      filteredIssue = filterUnsupportedMutableSecretRefSchemaIssue({
        issue: filteredIssue,
        policyIssue,
      });
    }
    return filteredIssue ? [filteredIssue] : [];
  });
  return [...policyIssues, ...filteredSchemaIssues];
}
function collectUnsupportedSecretRefPolicyIssues(raw) {
  return collectUnsupportedMutableSecretRefIssues(raw);
}
function mapZodIssueToConfigIssue(issue) {
  const record = toIssueRecord(issue);
  const pathItem = formatConfigPath(toConfigPathSegments(record?.path));
  const message = typeof record?.message === "string" ? record.message : "Invalid input";
  const enrichedMessage = record ? appendNumericBoundHint(message, record) : message;
  const allowedValuesSummary = summarizeAllowedValues(collectAllowedValuesFromUnknownIssue(issue));
  if (
    record &&
    typeof record.code === "string" &&
    record.code === "invalid_union" &&
    !allowedValuesSummary
  ) {
    const betterIssue = extractBindingsSpecificUnionIssue(record, pathItem);
    if (betterIssue) return betterIssue;
  }
  if (!allowedValuesSummary)
    return {
      path: pathItem,
      message: enrichedMessage,
    };
  return {
    path: pathItem,
    message: appendAllowedValuesHint(enrichedMessage, allowedValuesSummary),
    allowedValues: allowedValuesSummary.values,
    allowedValuesHiddenCount: allowedValuesSummary.hiddenCount,
  };
}
function collectExplicitPluginReferences(raw) {
  const references = {
    entries: /* @__PURE__ */ new Set(),
    allow: /* @__PURE__ */ new Set(),
    deny: /* @__PURE__ */ new Set(),
    slots: /* @__PURE__ */ new Map(),
  };
  if (!isRecord(raw) || !isRecord(raw.plugins)) return references;
  const { plugins } = raw;
  if (isRecord(plugins.entries))
    for (const pluginId of Object.keys(plugins.entries)) {
      const normalized = normalizePluginId(pluginId);
      if (normalized) references.entries.add(normalized);
    }
  for (const [key, target] of [
    ["allow", references.allow],
    ["deny", references.deny],
  ]) {
    const value = plugins[key];
    if (!Array.isArray(value)) continue;
    for (const entry of value) {
      if (typeof entry !== "string") continue;
      const normalized = normalizePluginId(entry);
      if (normalized) target.add(normalized);
    }
  }
  if (isRecord(plugins.slots))
    for (const [slotId, pluginId] of Object.entries(plugins.slots)) {
      if (typeof pluginId !== "string") continue;
      const normalized = normalizePluginId(pluginId);
      if (normalized && normalized !== "none") references.slots.set(normalized, slotId);
    }
  return references;
}
function resolveExplicitPluginReferencePath(references, pluginId) {
  const normalized = normalizePluginId(pluginId);
  if (!normalized) return;
  if (references.entries.has(normalized)) return `plugins.entries.${normalized}`;
  if (references.allow.has(normalized)) return "plugins.allow";
  if (references.deny.has(normalized)) return "plugins.deny";
  const slotId = references.slots.get(normalized);
  if (slotId) return `plugins.slots.${slotId}`;
}
function isWorkspaceAvatarPath(value, workspaceDir) {
  const workspaceRoot = path.resolve(workspaceDir);
  return isPathWithinRoot(workspaceRoot, path.resolve(workspaceRoot, value));
}
function validateIdentityAvatar(config) {
  const agents = config.agents?.list;
  if (!Array.isArray(agents) || agents.length === 0) return [];
  const issues = [];
  for (const [index, entry] of agents.entries()) {
    if (!entry || typeof entry !== "object") continue;
    const avatarRaw = entry.identity?.avatar;
    if (typeof avatarRaw !== "string") continue;
    const avatar = avatarRaw.trim();
    if (!avatar) continue;
    if (isAvatarDataUrl(avatar) || isAvatarHttpUrl(avatar)) continue;
    if (avatar.startsWith("~")) {
      issues.push({
        path: `agents.list.${index}.identity.avatar`,
        message: "identity.avatar must be a workspace-relative path, http(s) URL, or data URI.",
      });
      continue;
    }
    if (hasAvatarUriScheme(avatar) && !isWindowsAbsolutePath(avatar)) {
      issues.push({
        path: `agents.list.${index}.identity.avatar`,
        message: "identity.avatar must be a workspace-relative path, http(s) URL, or data URI.",
      });
      continue;
    }
    if (
      !isWorkspaceAvatarPath(
        avatar,
        resolveAgentWorkspaceDir(config, entry.id ?? resolveDefaultAgentId(config)),
      )
    )
      issues.push({
        path: `agents.list.${index}.identity.avatar`,
        message: "identity.avatar must stay within the agent workspace.",
      });
  }
  return issues;
}
function validateGatewayTailscaleBind(config) {
  const tailscaleMode = config.gateway?.tailscale?.mode ?? "off";
  if (tailscaleMode !== "serve" && tailscaleMode !== "funnel") return [];
  const bindMode = config.gateway?.bind ?? "loopback";
  if (bindMode === "loopback") return [];
  const customBindHost = config.gateway?.customBindHost;
  if (
    bindMode === "custom" &&
    isCanonicalDottedDecimalIPv4(customBindHost) &&
    isLoopbackIpAddress(customBindHost)
  )
    return [];
  return [
    {
      path: "gateway.bind",
      message: `gateway.bind must resolve to loopback when gateway.tailscale.mode=${tailscaleMode} (use gateway.bind="loopback" or gateway.bind="custom" with gateway.customBindHost="127.0.0.1")`,
    },
  ];
}
function validateGatewayTailscaleAuth(config) {
  const tailscaleMode = config.gateway?.tailscale?.mode ?? "off";
  if (
    !isUnsafeGatewayTailscaleNoAuth({
      authMode: config.gateway?.auth?.mode,
      tailscaleMode,
    })
  )
    return [];
  return [
    {
      path: "gateway.auth.mode",
      message: formatUnsafeGatewayTailscaleNoAuthMessage(tailscaleMode),
    },
  ];
}
/**
 * Validates config without applying runtime defaults.
 * Use this when you need the raw validated config (e.g., for writing back to file).
 */
function validateConfigObjectRaw(raw, opts) {
  const normalizedRaw = stripPreservedLegacyRootKeysForValidation(
    stripDeprecatedValidationKeys(raw),
    opts?.preservedLegacyRootKeys,
  );
  const policyIssues = collectUnsupportedSecretRefPolicyIssues(normalizedRaw);
  const validated = OpenClawSchema.safeParse(normalizedRaw);
  if (!validated.success)
    return {
      ok: false,
      issues: mergeUnsupportedMutableSecretRefIssues(
        policyIssues,
        validated.error.issues.map((issue) => mapZodIssueToConfigIssue(issue)),
      ),
    };
  const validatedConfig = materializeBundledModelProviderOverlays(validated.data);
  const channelIssues =
    policyIssues.length > 0 || opts?.validateBundledChannels
      ? collectRawBundledChannelConfigIssues(validatedConfig)
      : [];
  if (channelIssues.length > 0)
    return {
      ok: false,
      issues: mergeUnsupportedMutableSecretRefIssues(policyIssues, channelIssues),
    };
  if (policyIssues.length > 0)
    return {
      ok: false,
      issues: policyIssues,
    };
  const duplicates = findDuplicateAgentDirs(validatedConfig);
  if (duplicates.length > 0)
    return {
      ok: false,
      issues: [
        {
          path: "agents.list",
          message: formatDuplicateAgentDirError(duplicates),
        },
      ],
    };
  const avatarIssues = validateIdentityAvatar(validatedConfig);
  if (avatarIssues.length > 0)
    return {
      ok: false,
      issues: avatarIssues,
    };
  const gatewayTailscaleBindIssues = validateGatewayTailscaleBind(validatedConfig);
  if (gatewayTailscaleBindIssues.length > 0)
    return {
      ok: false,
      issues: gatewayTailscaleBindIssues,
    };
  const gatewayTailscaleAuthIssues = validateGatewayTailscaleAuth(validatedConfig);
  if (gatewayTailscaleAuthIssues.length > 0)
    return {
      ok: false,
      issues: gatewayTailscaleAuthIssues,
    };
  return {
    ok: true,
    config: validatedConfig,
  };
}
function validateConfigObject(raw, opts) {
  const result = validateConfigObjectRaw(raw, opts);
  if (!result.ok) return result;
  return {
    ok: true,
    config: materializeRuntimeConfig(result.config, "snapshot", {
      manifestRegistry: opts?.manifestRegistry,
    }),
  };
}
function validateConfigObjectWithPlugins(raw, params) {
  return validateConfigObjectWithPluginsBase(raw, {
    applyDefaults: true,
    env: params?.env,
    pluginValidation: params?.pluginValidation ?? "full",
    pluginMetadataSnapshot: params?.pluginMetadataSnapshot,
    loadPluginMetadataSnapshot: params?.loadPluginMetadataSnapshot,
    sourceRaw: params?.sourceRaw,
    preservedLegacyRootKeys: params?.preservedLegacyRootKeys,
  });
}
function validateConfigObjectRawWithPlugins(raw, params) {
  return validateConfigObjectWithPluginsBase(raw, {
    applyDefaults: false,
    env: params?.env,
    pluginValidation: params?.pluginValidation ?? "full",
    pluginMetadataSnapshot: params?.pluginMetadataSnapshot,
    loadPluginMetadataSnapshot: params?.loadPluginMetadataSnapshot,
    sourceRaw: params?.sourceRaw,
    preservedLegacyRootKeys: params?.preservedLegacyRootKeys,
  });
}
function validateConfigObjectWithPluginsBase(raw, opts) {
  const base = validateConfigObjectRaw(raw, {
    sourceRaw: opts.sourceRaw,
    preservedLegacyRootKeys: opts.preservedLegacyRootKeys,
  });
  if (!base.ok)
    return {
      ok: false,
      issues: base.issues,
      warnings: [],
    };
  let registryInfo = opts.pluginMetadataSnapshot
    ? { registry: opts.pluginMetadataSnapshot.manifestRegistry }
    : null;
  if (opts.applyDefaults && !registryInfo) {
    const pluginMetadataSnapshot = opts.loadPluginMetadataSnapshot?.(base.config);
    if (pluginMetadataSnapshot)
      registryInfo = { registry: pluginMetadataSnapshot.manifestRegistry };
  }
  const config = opts.applyDefaults
    ? materializeRuntimeConfig(base.config, "snapshot", {
        manifestRegistry: registryInfo?.registry,
      })
    : base.config;
  if (opts.pluginValidation === "skip")
    return {
      ok: true,
      config,
      warnings: [],
    };
  const issues = [];
  const warnings = [];
  const hasExplicitPluginsConfig = isRecord(raw) && Object.hasOwn(raw, "plugins");
  const explicitPluginReferences = collectExplicitPluginReferences(raw);
  const resolvePluginConfigIssuePath = (pluginId, errorPath) => {
    const baseLocal = `plugins.entries.${pluginId}.config`;
    if (!errorPath || errorPath === "<root>") return baseLocal;
    return `${baseLocal}.${errorPath}`;
  };
  const formatChannelConfigIssueMessage = (message, pluginId) => {
    const safePluginId = pluginId ? sanitizeForLog(pluginId).trim() : "";
    if (safePluginId) return `invalid config for plugin ${safePluginId}: ${message}`;
    return formatRawChannelConfigIssueMessage(message);
  };
  let compatConfig;
  let compatPluginIds = null;
  let compatPluginIdsResolved = false;
  let registryDiagnosticsPushed = false;
  const pushRegistryDiagnostics = (registry) => {
    if (registryDiagnosticsPushed) return;
    registryDiagnosticsPushed = true;
    for (const diag of registry.diagnostics) {
      const explicitPath = diag.pluginId
        ? resolveExplicitPluginReferencePath(explicitPluginReferences, diag.pluginId)
        : void 0;
      let pathCandidate = explicitPath ?? (diag.pluginId ? "plugins" : "plugins");
      if (!diag.pluginId && diag.message.includes("plugin path not found"))
        pathCandidate = "plugins.load.paths";
      const message = `${diag.pluginId ? `plugin ${diag.pluginId}` : "plugin"}: ${diag.message}`;
      if (diag.level === "error" && (explicitPath || !diag.pluginId))
        issues.push({
          path: pathCandidate,
          message,
        });
      else
        warnings.push({
          path: pathCandidate,
          message,
        });
    }
  };
  const loadValidationRegistry = () => {
    const pluginMetadataSnapshot = opts.loadPluginMetadataSnapshot?.(config);
    if (pluginMetadataSnapshot) {
      registryInfo = { registry: pluginMetadataSnapshot.manifestRegistry };
      return registryInfo;
    }
    const workspaceDir = resolveAgentWorkspaceDir(config, resolveDefaultAgentId(config));
    registryInfo = {
      registry: resolvePluginMetadataSnapshot({
        config,
        workspaceDir: workspaceDir ?? void 0,
        env: opts.env ?? process.env,
        allowWorkspaceScopedCurrent: true,
      }).manifestRegistry,
    };
    return registryInfo;
  };
  const ensureLoadedRegistryInfo = () => registryInfo ?? loadValidationRegistry();
  const ensureCompatPluginIds = () => {
    if (compatPluginIdsResolved) return compatPluginIds ?? /* @__PURE__ */ new Set();
    compatPluginIdsResolved = true;
    const allow = config.plugins?.allow;
    if (!Array.isArray(allow) || allow.length === 0) {
      compatPluginIds = /* @__PURE__ */ new Set();
      return compatPluginIds;
    }
    const { registry } = registryInfo ?? loadValidationRegistry();
    const overriddenBundledPluginIds = new Set(
      registry.diagnostics
        .filter((diag) => diag.message.includes("duplicate plugin id detected"))
        .map((diag) => diag.pluginId)
        .filter((pluginId) => typeof pluginId === "string" && pluginId !== ""),
    );
    compatPluginIds = new Set(
      registry.plugins
        .filter(
          (plugin) =>
            plugin.origin === "bundled" &&
            (plugin.contracts?.webSearchProviders?.length ?? 0) > 0 &&
            !overriddenBundledPluginIds.has(plugin.id),
        )
        .map((plugin) => plugin.id),
    );
    return compatPluginIds;
  };
  const ensureCompatConfig = () => {
    if (compatConfig !== void 0) return compatConfig ?? config;
    compatConfig = config;
    return config;
  };
  const ensureRegistry = () => {
    const info = ensureLoadedRegistryInfo();
    ensureCompatConfig();
    pushRegistryDiagnostics(info.registry);
    return info;
  };
  const ensureKnownIds = () => {
    const info = ensureRegistry();
    if (!info.knownIds) info.knownIds = new Set(info.registry.plugins.map((record) => record.id));
    return info.knownIds;
  };
  const ensureOverriddenPluginIds = () => {
    const info = ensureRegistry();
    if (!info.overriddenPluginIds)
      info.overriddenPluginIds = new Set(
        info.registry.diagnostics
          .filter((diag) => diag.message.includes("duplicate plugin id detected"))
          .map((diag) => diag.pluginId)
          .filter((pluginId) => typeof pluginId === "string" && pluginId !== ""),
      );
    return info.overriddenPluginIds;
  };
  const ensureNormalizedPlugins = () => {
    const info = ensureRegistry();
    if (!info.normalizedPlugins)
      info.normalizedPlugins = normalizePluginsConfig(ensureCompatConfig().plugins);
    return info.normalizedPlugins;
  };
  const ensureChannelSchemas = () => {
    const info = ensureRegistry();
    if (!info.channelSchemas) {
      info.channelSchemas = new Map(
        GENERATED_BUNDLED_CHANNEL_CONFIG_METADATA.map((entry) => [
          entry.channelId,
          { schema: entry.schema },
        ]),
      );
      for (const entry of collectChannelSchemaMetadataWithOwnership(info.registry)) {
        const current = info.channelSchemas.get(entry.id);
        if (entry.configSchema) {
          info.channelSchemas.set(entry.id, {
            schema: entry.configSchema,
            pluginId: entry.schemaPluginOrigin === "bundled" ? void 0 : entry.schemaPluginId,
          });
          continue;
        }
        if (!current) info.channelSchemas.set(entry.id, {});
      }
    }
    return info.channelSchemas;
  };
  const ensureChannelDmAllowFromModes = () => {
    const info = ensureLoadedRegistryInfo();
    if (!info.channelDmAllowFromModes)
      info.channelDmAllowFromModes = new Map(
        collectChannelDmPolicyMetadata(info.registry).flatMap((entry) =>
          entry.dmAllowFromMode ? [[entry.id, entry.dmAllowFromMode]] : [],
        ),
      );
    return info.channelDmAllowFromModes;
  };
  warnings.push(
    ...(hasChannelDmPolicyDependencyWarningCandidates(base.config)
      ? collectChannelDmPolicyDependencyWarnings(base.config, {
          dmAllowFromModes: ensureChannelDmAllowFromModes(),
        })
      : collectChannelDmPolicyDependencyWarnings(base.config)),
  );
  let mutatedConfig = config;
  let channelsCloned = false;
  let pluginsCloned = false;
  let pluginEntriesCloned = false;
  let installedPluginRecordIds;
  const ensureInstalledPluginRecordIds = () => {
    if (installedPluginRecordIds) return installedPluginRecordIds;
    try {
      installedPluginRecordIds = new Set(
        Object.keys(loadInstalledPluginIndexInstallRecordsSync({ env: opts.env })).map(
          normalizePluginId,
        ),
      );
    } catch {
      installedPluginRecordIds = /* @__PURE__ */ new Set();
    }
    return installedPluginRecordIds;
  };
  const hasStalePluginEvidenceForUnknownChannel = (channelId) => {
    const normalizedChannelId = normalizePluginId(channelId);
    if (!normalizedChannelId || ensureKnownIds().has(normalizedChannelId)) return false;
    const pluginConfig = config.plugins;
    if (
      Array.isArray(pluginConfig?.allow) &&
      pluginConfig.allow.some((pluginId) => normalizePluginId(pluginId) === normalizedChannelId)
    )
      return true;
    if (
      isRecord(pluginConfig?.entries) &&
      Object.keys(pluginConfig.entries).some(
        (pluginId) => normalizePluginId(pluginId) === normalizedChannelId,
      )
    )
      return true;
    if (
      isRecord(pluginConfig?.installs) &&
      Object.keys(pluginConfig.installs).some(
        (pluginId) => normalizePluginId(pluginId) === normalizedChannelId,
      )
    )
      return true;
    return ensureInstalledPluginRecordIds().has(normalizedChannelId);
  };
  const collectActiveWebSearchProviderIds = () => {
    const { registry } = ensureRegistry();
    return [
      ...new Set(
        registry.plugins
          .flatMap((record) => record.contracts?.webSearchProviders ?? [])
          .map((providerId) => providerId.trim())
          .filter((providerId) => providerId.length > 0),
      ),
    ].toSorted((left, right) => left.localeCompare(right));
  };
  const collectKnownWebSearchProviderIds = () => {
    return [
      .../* @__PURE__ */ new Set([
        ...collectActiveWebSearchProviderIds(),
        ...resolveWebSearchInstallCatalogEntries()
          .map((entry) => entry.provider.id.trim())
          .filter((providerId) => providerId.length > 0),
      ]),
    ].toSorted((left, right) => left.localeCompare(right));
  };
  const hasPluginEvidenceForWebSearchProvider = (...pluginOrProviderIds) => {
    const candidateIds = new Set(
      pluginOrProviderIds.map((id) => normalizePluginId(id)).filter((id) => id.length > 0),
    );
    if (candidateIds.size === 0) return false;
    const matches = (pluginId) => candidateIds.has(normalizePluginId(pluginId));
    const pluginConfig = config.plugins;
    if (Array.isArray(pluginConfig?.allow) && pluginConfig.allow.some(matches)) return true;
    if (isRecord(pluginConfig?.entries) && Object.keys(pluginConfig.entries).some(matches))
      return true;
    if (isRecord(pluginConfig?.installs) && Object.keys(pluginConfig.installs).some(matches))
      return true;
    for (const pluginId of candidateIds)
      if (ensureInstalledPluginRecordIds().has(pluginId)) return true;
    return false;
  };
  const hasStalePluginEvidenceForUnknownWebSearchProvider = (providerId) => {
    const normalizedProviderId = normalizePluginId(providerId);
    if (!normalizedProviderId || ensureKnownIds().has(normalizedProviderId)) return false;
    return hasPluginEvidenceForWebSearchProvider(providerId);
  };
  const validateWebSearchProvider = () => {
    const provider = config.tools?.web?.search?.provider;
    if (typeof provider !== "string") return;
    const trimmed = provider.trim();
    const pathEntry = "tools.web.search.provider";
    if (!trimmed) {
      issues.push({
        path: pathEntry,
        message: "web_search provider must not be empty",
      });
      return;
    }
    if (collectActiveWebSearchProviderIds().includes(trimmed)) return;
    const installCatalogEntry = resolveWebSearchInstallCatalogEntries().find(
      (entry) => entry.provider.id === trimmed,
    );
    if (installCatalogEntry) {
      const issue = {
        path: pathEntry,
        message: `web_search provider is not available: ${trimmed} (install or enable plugin "${installCatalogEntry.pluginId}", then run openclaw doctor --fix)`,
        allowedValues: collectKnownWebSearchProviderIds(),
      };
      if (hasPluginEvidenceForWebSearchProvider(trimmed, installCatalogEntry.pluginId)) {
        warnings.push({
          ...issue,
          message: `web_search provider is not available: ${trimmed} (configured plugin "${installCatalogEntry.pluginId}" is unavailable; Gateway will ignore this optional provider until the plugin is installed/enabled or openclaw doctor --fix repairs the config)`,
        });
        return;
      }
      issues.push(issue);
      return;
    }
    const allowedValues = collectKnownWebSearchProviderIds();
    if (allowedValues.length === 0) return;
    const issue = {
      path: pathEntry,
      message: `unknown web_search provider: ${trimmed}`,
      allowedValues,
    };
    if (hasStalePluginEvidenceForUnknownWebSearchProvider(trimmed)) {
      warnings.push({
        ...issue,
        message: `${issue.message} (stale web search plugin config ignored; run openclaw doctor --fix to remove stale config, or install the plugin)`,
      });
      return;
    }
    issues.push(issue);
  };
  const parseProviderModelRef = (value) => {
    const slashIndex = value.indexOf("/");
    if (slashIndex <= 0 || slashIndex >= value.length - 1) return null;
    const provider = normalizeLowercaseStringOrEmpty(value.slice(0, slashIndex));
    const model = normalizeLowercaseStringOrEmpty(value.slice(slashIndex + 1));
    return provider && model
      ? {
          provider,
          model,
        }
      : null;
  };
  const validateConfiguredModelRefs = () => {
    const configuredRefs = collectConfiguredModelRefs(config);
    if (configuredRefs.length === 0) return;
    const { registry } = ensureRegistry();
    const suppressedModels = /* @__PURE__ */ new Map();
    for (const suppression of planManifestModelCatalogSuppressions({ registry }).suppressions) {
      if (suppression.when) continue;
      const key = `${suppression.provider}/${suppression.model}`;
      if (!suppressedModels.has(key))
        suppressedModels.set(key, {
          provider: suppression.provider,
          model: suppression.model,
          ...(suppression.reason ? { reason: suppression.reason } : {}),
        });
    }
    if (suppressedModels.size === 0) return;
    const seen = /* @__PURE__ */ new Set();
    for (const ref of configuredRefs) {
      const parsed = parseProviderModelRef(ref.value);
      if (!parsed) continue;
      const suppression = suppressedModels.get(`${parsed.provider}/${parsed.model}`);
      if (!suppression) continue;
      const issueKey = `${ref.path}\0${parsed.provider}/${parsed.model}`;
      if (seen.has(issueKey)) continue;
      seen.add(issueKey);
      const modelRef = `${suppression.provider}/${suppression.model}`;
      issues.push({
        path: ref.path,
        message: suppression.reason
          ? `Unknown model: ${modelRef}. ${suppression.reason}`
          : `Unknown model: ${modelRef}.`,
      });
    }
  };
  const replaceChannelConfig = (channelId, nextValue) => {
    if (!channelsCloned) {
      mutatedConfig = {
        ...mutatedConfig,
        channels: { ...mutatedConfig.channels },
      };
      channelsCloned = true;
    }
    mutatedConfig.channels[channelId] = nextValue;
  };
  const replacePluginEntryConfig = (pluginId, nextValue) => {
    if (!pluginsCloned) {
      mutatedConfig = {
        ...mutatedConfig,
        plugins: { ...mutatedConfig.plugins },
      };
      pluginsCloned = true;
    }
    if (!pluginEntriesCloned) {
      mutatedConfig.plugins = {
        ...mutatedConfig.plugins,
        entries: { ...mutatedConfig.plugins?.entries },
      };
      pluginEntriesCloned = true;
    }
    const currentEntry = mutatedConfig.plugins?.entries?.[pluginId];
    mutatedConfig.plugins.entries[pluginId] = {
      ...currentEntry,
      config: nextValue,
    };
  };
  const allowedChannels = /* @__PURE__ */ new Set([
    "defaults",
    "modelByChannel",
    ...bundledChannelIds,
  ]);
  if (config.channels && isRecord(config.channels))
    for (const key of Object.keys(config.channels)) {
      const trimmed = key.trim();
      if (!trimmed) continue;
      if (!allowedChannels.has(trimmed)) {
        const { registry } = ensureRegistry();
        for (const record of registry.plugins)
          for (const channelId of record.channels) allowedChannels.add(channelId);
      }
      if (!allowedChannels.has(trimmed)) {
        const issue = {
          path: `channels.${trimmed}`,
          message: `unknown channel id: ${trimmed}`,
        };
        if (hasStalePluginEvidenceForUnknownChannel(trimmed))
          warnings.push({
            ...issue,
            message: `${issue.message} (stale channel plugin config ignored; run openclaw doctor --fix to remove stale config, or install the plugin)`,
          });
        else issues.push(issue);
        continue;
      }
      const channelSchema = ensureChannelSchemas().get(trimmed);
      if (!channelSchema?.schema) continue;
      const result = validateJsonSchemaValue({
        schema: channelSchema.schema,
        cacheKey: `channel:${trimmed}`,
        value: config.channels[trimmed],
        applyDefaults: true,
      });
      if (!result.ok) {
        for (const error of result.errors) {
          const pathResult =
            error.path === "<root>" ? `channels.${trimmed}` : `channels.${trimmed}.${error.path}`;
          issues.push({
            path: pathResult,
            message: formatChannelConfigIssueMessage(error.message, channelSchema.pluginId),
            allowedValues: error.allowedValues,
            allowedValuesHiddenCount: error.allowedValuesHiddenCount,
          });
        }
        continue;
      }
      replaceChannelConfig(trimmed, result.value);
    }
  const heartbeatChannelIds = /* @__PURE__ */ new Set();
  for (const channelId of bundledChannelIds)
    heartbeatChannelIds.add(normalizeLowercaseStringOrEmpty(channelId));
  const validateHeartbeatTarget = (target, pathValue) => {
    if (typeof target !== "string") return;
    const trimmed = target.trim();
    if (!trimmed) {
      issues.push({
        path: pathValue,
        message: "heartbeat target must not be empty",
      });
      return;
    }
    const normalized = normalizeLowercaseStringOrEmpty(trimmed);
    if (normalized === "last" || normalized === "none") return;
    if (normalizeBundledChannelId(trimmed)) return;
    if (!heartbeatChannelIds.has(normalized)) {
      const { registry } = ensureRegistry();
      for (const record of registry.plugins)
        for (const channelId of record.channels) {
          const pluginChannel = channelId.trim();
          if (pluginChannel)
            heartbeatChannelIds.add(normalizeLowercaseStringOrEmpty(pluginChannel));
        }
    }
    if (heartbeatChannelIds.has(normalized)) return;
    issues.push({
      path: pathValue,
      message: `unknown heartbeat target: ${target}`,
    });
  };
  validateHeartbeatTarget(
    config.agents?.defaults?.heartbeat?.target,
    "agents.defaults.heartbeat.target",
  );
  if (Array.isArray(config.agents?.list))
    for (const [index, entry] of config.agents.list.entries())
      validateHeartbeatTarget(entry?.heartbeat?.target, `agents.list.${index}.heartbeat.target`);
  validateWebSearchProvider();
  validateConfiguredModelRefs();
  if (!hasExplicitPluginsConfig) {
    if (issues.length > 0)
      return {
        ok: false,
        issues,
        warnings,
      };
    return {
      ok: true,
      config: mutatedConfig,
      warnings,
    };
  }
  const { registry } = ensureRegistry();
  const knownIds = ensureKnownIds();
  const normalizedPlugins = ensureNormalizedPlugins();
  const effectiveConfig = ensureCompatConfig();
  const blockedPluginDiagnostics = /* @__PURE__ */ new Map();
  const blockedPluginDiagnosticsWithSource = [];
  const normalizeBlockedDiagnosticPath = (value) => {
    const trimmed = value?.trim();
    if (!trimmed) return "";
    try {
      return path.resolve(resolveUserPath(trimmed, opts.env ?? process.env));
    } catch {
      return path.resolve(trimmed);
    }
  };
  for (const diag of registry.diagnostics) {
    if (!diag.message.startsWith(BLOCKED_PLUGIN_CANDIDATE_PREFIX)) continue;
    if (!diag.pluginId && diag.source)
      blockedPluginDiagnosticsWithSource.push({
        message: diag.message,
        source: diag.source,
      });
    if (diag.pluginId) {
      const normalizedPluginId = normalizePluginId(diag.pluginId);
      for (const key of [diag.pluginId, normalizedPluginId]) {
        if (!key || blockedPluginDiagnostics.has(key)) continue;
        blockedPluginDiagnostics.set(key, {
          message: diag.message,
          ...(diag.source ? { source: diag.source } : {}),
        });
      }
    }
  }
  const blockedDiagnosticSourceMatchesPluginId = (diagnostic, pluginId) => {
    const normalizedPluginId = normalizePluginId(pluginId);
    if (!normalizedPluginId) return false;
    const sourcePath = normalizeBlockedDiagnosticPath(diagnostic.source);
    if (!sourcePath) return false;
    if (
      normalizePluginId(path.basename(sourcePath)) === normalizedPluginId ||
      normalizePluginId(path.basename(path.dirname(sourcePath))) === normalizedPluginId
    )
      return true;
    const loadPaths = config.plugins?.load?.paths;
    if (!Array.isArray(loadPaths)) return false;
    for (const loadPath of loadPaths) {
      if (typeof loadPath !== "string") continue;
      const resolvedLoadPath = normalizeBlockedDiagnosticPath(loadPath);
      if (!resolvedLoadPath) continue;
      if (normalizePluginId(path.basename(resolvedLoadPath)) !== normalizedPluginId) continue;
      if (
        sourcePath === resolvedLoadPath ||
        isPathInside(resolvedLoadPath, sourcePath) ||
        isPathInside(sourcePath, resolvedLoadPath)
      )
        return true;
    }
    return false;
  };
  const findBlockedPluginDiagnostic = (pluginId) => {
    const direct =
      blockedPluginDiagnostics.get(pluginId) ??
      blockedPluginDiagnostics.get(normalizePluginId(pluginId));
    if (direct) return direct;
    return blockedPluginDiagnosticsWithSource.find((diagnostic) =>
      blockedDiagnosticSourceMatchesPluginId(diagnostic, pluginId),
    );
  };
  const missingOfficialPluginWarningIds = /* @__PURE__ */ new Set();
  const pushMissingPluginIssue = (pathLocal, pluginId, optsLocal) => {
    if (LEGACY_REMOVED_PLUGIN_IDS.has(pluginId)) {
      warnings.push({
        path: pathLocal,
        message: formatRemovedPluginConfigWarning(pluginId),
      });
      return;
    }
    const blockedDiagnostic = findBlockedPluginDiagnostic(pluginId);
    if (blockedDiagnostic) {
      const message = `plugin present but blocked: ${pluginId} (see preceding plugin warning${blockedDiagnostic.source ? `; source: ${blockedDiagnostic.source}` : ""}; fix the blocked plugin path instead of removing config)`;
      if (optsLocal?.warnOnly)
        warnings.push({
          path: pathLocal,
          message,
        });
      else
        issues.push({
          path: pathLocal,
          message,
        });
      return;
    }
    if (
      normalizePluginId(pluginId) === "codex" &&
      pathLocal === "plugins.entries.codex" &&
      shouldSuppressMissingCodexPluginDiagnostics(config, opts.env ?? process.env)
    )
      return;
    if (optsLocal?.warnOnly && optsLocal.officialInstallHint !== false) {
      const externalInstallWarning =
        optsLocal.missingMessage ?? formatMissingOfficialExternalPluginWarning(pluginId);
      if (externalInstallWarning) {
        const normalizedPluginId = normalizePluginId(pluginId);
        if (!optsLocal.missingMessage && normalizedPluginId) {
          if (missingOfficialPluginWarningIds.has(normalizedPluginId)) return;
          missingOfficialPluginWarningIds.add(normalizedPluginId);
        }
        warnings.push({
          path: pathLocal,
          message: externalInstallWarning,
        });
        return;
      }
    }
    if (optsLocal?.warnOnly) {
      warnings.push({
        path: pathLocal,
        message: `plugin not found: ${pluginId} (stale config entry ignored; remove it from plugins config)`,
      });
      return;
    }
    issues.push({
      path: pathLocal,
      message: `plugin not found: ${pluginId}`,
    });
  };
  const pluginsConfig = config.plugins;
  const entries = pluginsConfig?.entries;
  if (entries && isRecord(entries)) {
    for (const pluginId of Object.keys(entries))
      if (!knownIds.has(pluginId))
        pushMissingPluginIssue(`plugins.entries.${pluginId}`, pluginId, { warnOnly: true });
  }
  const allow = pluginsConfig?.allow ?? [];
  for (const pluginId of allow) {
    if (typeof pluginId !== "string" || !pluginId.trim()) continue;
    if (!knownIds.has(pluginId)) {
      const commandAlias = resolveManifestCommandAliasOwnerInRegistry({
        command: pluginId,
        registry,
      });
      if (commandAlias?.pluginId && knownIds.has(commandAlias.pluginId))
        warnings.push({
          path: "plugins.allow",
          message: `"${pluginId}" is not a plugin — it is a command provided by the "${commandAlias.pluginId}" plugin. Use "${commandAlias.pluginId}" in plugins.allow instead.`,
        });
      else pushMissingPluginIssue("plugins.allow", pluginId, { warnOnly: true });
    }
  }
  const deny = pluginsConfig?.deny ?? [];
  for (const pluginId of deny) {
    if (typeof pluginId !== "string" || !pluginId.trim()) continue;
    if (!knownIds.has(pluginId))
      pushMissingPluginIssue("plugins.deny", pluginId, {
        warnOnly: true,
        officialInstallHint: false,
      });
  }
  const pluginSlots = pluginsConfig?.slots;
  const hasExplicitMemorySlot = pluginSlots !== void 0 && Object.hasOwn(pluginSlots, "memory");
  const memorySlot = normalizedPlugins.slots.memory;
  if (
    hasExplicitMemorySlot &&
    typeof memorySlot === "string" &&
    memorySlot.trim() &&
    !knownIds.has(memorySlot)
  )
    pushMissingPluginIssue("plugins.slots.memory", memorySlot, {
      warnOnly:
        memorySlot === "memory-lancedb" &&
        Boolean(
          formatMissingOfficialExternalPluginWarning(memorySlot, {
            selectedMissingMemorySlot: true,
          }),
        ) &&
        !findBlockedPluginDiagnostic(memorySlot),
      missingMessage: formatMissingOfficialExternalPluginWarning(memorySlot, {
        selectedMissingMemorySlot: true,
      }),
    });
  let selectedMemoryPluginId = null;
  const seenPlugins = /* @__PURE__ */ new Set();
  for (const record of registry.plugins) {
    const pluginId = record.id;
    if (seenPlugins.has(pluginId)) continue;
    seenPlugins.add(pluginId);
    const entry = normalizedPlugins.entries[pluginId];
    const entryHasConfig = Boolean(entry?.config);
    const activationState = resolveEffectivePluginActivationState({
      id: pluginId,
      origin: record.origin,
      config: normalizedPlugins,
      rootConfig: effectiveConfig,
    });
    let enabled = activationState.activated;
    let reason = activationState.reason;
    if (enabled) {
      const memoryDecision = resolveMemorySlotDecision({
        id: pluginId,
        kind: record.kind,
        slot: memorySlot,
        selectedId: selectedMemoryPluginId,
      });
      if (!memoryDecision.enabled) {
        enabled = false;
        reason = memoryDecision.reason;
      }
      if (memoryDecision.selected && hasKind(record.kind, "memory"))
        selectedMemoryPluginId = pluginId;
    }
    const shouldReplacePluginConfig = entryHasConfig || (opts.applyDefaults && enabled);
    if (enabled || entryHasConfig)
      if (record.configSchema) {
        const res = validateJsonSchemaValue({
          schema: record.configSchema,
          cacheKey: record.schemaCacheKey ?? record.manifestPath ?? pluginId,
          value: entry?.config ?? {},
          applyDefaults: true,
        });
        if (!res.ok)
          for (const error of res.errors)
            issues.push({
              path: resolvePluginConfigIssuePath(pluginId, error.path),
              message: `invalid config: ${error.message}`,
              allowedValues: error.allowedValues,
              allowedValuesHiddenCount: error.allowedValuesHiddenCount,
            });
        else if (shouldReplacePluginConfig) replacePluginEntryConfig(pluginId, res.value);
      } else if (record.format === "bundle") {
      } else
        issues.push({
          path: `plugins.entries.${pluginId}`,
          message: `plugin schema missing for ${pluginId}`,
        });
    const suppressDisabledConfigWarning =
      ensureCompatPluginIds().has(pluginId) && !ensureOverriddenPluginIds().has(pluginId);
    if (!enabled && entryHasConfig && !suppressDisabledConfigWarning)
      warnings.push({
        path: `plugins.entries.${pluginId}`,
        message: `plugin disabled (${reason ?? "disabled"}) but config is present`,
      });
  }
  if (issues.length > 0)
    return {
      ok: false,
      issues,
      warnings,
    };
  return {
    ok: true,
    config: mutatedConfig,
    warnings,
  };
}
//#endregion
//#region src/config/io.ts
const loggedInvalidConfigs = /* @__PURE__ */ new Set();
const loggedConfigWarningFingerprints = /* @__PURE__ */ new Map();
const warnedFutureTouchedVersions = /* @__PURE__ */ new Set();
const configWritePostCommitRollback = Symbol("configWritePostCommitRollback");
var ConfigRuntimeRefreshError = class extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = "ConfigRuntimeRefreshError";
  }
};
function hashConfigRaw(raw) {
  if (raw === null) return hashConfigIncludeRaw(null);
  return crypto.createHash("sha256").update(raw).digest("hex");
}
function assertBaseSnapshotStillCurrent(snapshot, configPath, ioFs) {
  if (snapshot.path !== configPath)
    throw new ConfigMutationConflictError("config path changed since last load", {
      currentHash: null,
      retryable: false,
    });
  if (snapshot.readError) return;
  const expectedHash = resolveConfigSnapshotHash(snapshot);
  let currentRaw = null;
  let currentExists = true;
  try {
    currentRaw = ioFs.readFileSync(configPath, "utf-8");
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
    currentExists = false;
  }
  const currentHash = currentExists ? hashConfigRaw(currentRaw) : null;
  if (
    currentExists !== snapshot.exists ||
    (currentExists && expectedHash !== null && currentHash !== expectedHash)
  )
    throw new ConfigMutationConflictError("config changed since last load", { currentHash });
}
async function tightenStateDirPermissionsIfNeeded(params) {
  if (process.platform === "win32") return;
  const stateDir = resolveStateDir(params.env, params.homedir);
  const configDir = path.dirname(params.configPath);
  if (path.resolve(configDir) !== path.resolve(stateDir)) return;
  try {
    if (((await params.fsModule.promises.stat(configDir)).mode & 63) === 0) return;
    await params.fsModule.promises.chmod(configDir, 448);
  } catch {}
}
function resolveConfigSnapshotHash(snapshot) {
  if (typeof snapshot.hash === "string") {
    const trimmed = snapshot.hash.trim();
    if (trimmed) return trimmed;
  }
  if (typeof snapshot.raw !== "string") return null;
  return hashConfigRaw(snapshot.raw);
}
async function rollbackConfigFileWriteIfUnchanged(params) {
  let currentRaw = null;
  try {
    currentRaw = await params.fsModule.promises.readFile(params.configPath, "utf-8");
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
  if (hashConfigRaw(currentRaw) !== params.committedHash) return false;
  if (params.previousSnapshot.exists && typeof params.previousSnapshot.raw === "string") {
    await replaceFileAtomic({
      filePath: params.configPath,
      content: params.previousSnapshot.raw,
      dirMode: 448,
      mode: 384,
      tempPrefix: path.basename(params.configPath),
      copyFallbackOnPermissionError: true,
      fileSystem: params.fsModule,
    });
    return true;
  }
  if (params.previousSnapshot.exists) return false;
  try {
    await params.fsModule.promises.unlink(params.configPath);
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
  return true;
}
function coerceConfig(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value;
}
function hasConfigMeta(value) {
  if (!isRecord(value)) return false;
  const meta = value.meta;
  return isRecord(meta);
}
function resolveGatewayMode(value) {
  if (!isRecord(value)) return null;
  const gateway = value.gateway;
  if (!isRecord(gateway) || typeof gateway.mode !== "string") return null;
  const trimmed = gateway.mode.trim();
  return trimmed.length > 0 ? trimmed : null;
}
function collectEnvRefPaths(value, pathLocal, output) {
  if (typeof value === "string") {
    if (containsEnvVarReference(value)) output.set(pathLocal, value);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      collectEnvRefPaths(item, `${pathLocal}[${index}]`, output);
    });
    return;
  }
  if (isRecord(value))
    for (const [key, child] of Object.entries(value))
      collectEnvRefPaths(child, pathLocal ? `${pathLocal}.${key}` : key, output);
}
function containsConfigIncludeDirective(value) {
  if (Array.isArray(value)) return value.some((item) => containsConfigIncludeDirective(item));
  if (!isRecord(value)) return false;
  if ("$include" in value) return true;
  return Object.values(value).some((item) => containsConfigIncludeDirective(item));
}
function normalizeStatNumber(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}
function normalizeStatId(value) {
  if (typeof value === "bigint") return value.toString();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return null;
}
function resolveConfigStatMetadata(stat) {
  return {
    dev: normalizeStatId(stat?.dev ?? null),
    ino: normalizeStatId(stat?.ino ?? null),
    mode: normalizeStatNumber(stat ? stat.mode & 511 : null),
    nlink: normalizeStatNumber(stat?.nlink ?? null),
    uid: normalizeStatNumber(stat?.uid ?? null),
    gid: normalizeStatNumber(stat?.gid ?? null),
  };
}
function resolveConfigWriteSuspiciousReasons(params) {
  const reasons = [];
  if (!params.existsBefore) return reasons;
  if (params.unreadableBefore) reasons.push("unreadable-config-before-write");
  if (
    typeof params.sizeBaselineBytes === "number" &&
    typeof params.nextBytes === "number" &&
    params.sizeBaselineBytes >= 512 &&
    params.nextBytes < Math.floor(params.sizeBaselineBytes * 0.5)
  )
    reasons.push(`size-drop:${params.sizeBaselineBytes}->${params.nextBytes}`);
  if (!params.hasMetaBefore) reasons.push("missing-meta-before-write");
  if (params.gatewayModeBefore && !params.gatewayModeAfter) reasons.push("gateway-mode-removed");
  return reasons;
}
function resolveConfigWriteBlockingReasons(suspicious, options = {}) {
  return suspicious.filter(
    (reason) =>
      reason === "unreadable-config-before-write" ||
      (reason.startsWith("size-drop:") && options.allowConfigSizeDrop !== true) ||
      reason === "gateway-mode-removed",
  );
}
async function readConfigHealthState(deps) {
  return readConfigHealthStateFromStore(deps);
}
function readConfigHealthStateSync(deps) {
  return readConfigHealthStateFromStore(deps);
}
async function writeConfigHealthState(deps, state) {
  writeConfigHealthStateToStore(deps, state);
}
function writeConfigHealthStateSync(deps, state) {
  writeConfigHealthStateToStore(deps, state);
}
function getConfigHealthEntry(state, configPath) {
  const entries = state.entries;
  if (!entries || !isRecord(entries)) return {};
  const entry = entries[configPath];
  return entry && isRecord(entry) ? entry : {};
}
function setConfigHealthEntry(state, configPath, entry) {
  return {
    ...state,
    entries: {
      ...state.entries,
      [configPath]: entry,
    },
  };
}
async function readConfigFingerprintForPath(deps, targetPath) {
  try {
    const raw = await deps.fs.promises.readFile(targetPath, "utf-8");
    const stat = await deps.fs.promises.stat(targetPath).catch(() => null);
    const parsedRes = parseConfigJson5(raw, deps.json5);
    const parsed = parsedRes.ok ? parsedRes.parsed : {};
    return {
      hash: hashConfigRaw(raw),
      bytes: Buffer.byteLength(raw, "utf-8"),
      mtimeMs: stat?.mtimeMs ?? null,
      ctimeMs: stat?.ctimeMs ?? null,
      ...resolveConfigStatMetadata(stat),
      hasMeta: hasConfigMeta(parsed),
      gatewayMode: resolveGatewayMode(parsed),
      observedAt: /* @__PURE__ */ new Date().toISOString(),
    };
  } catch {
    return null;
  }
}
function readConfigFingerprintForPathSync(deps, targetPath) {
  try {
    const raw = deps.fs.readFileSync(targetPath, "utf-8");
    const stat = deps.fs.statSync(targetPath, { throwIfNoEntry: false }) ?? null;
    const parsedRes = parseConfigJson5(raw, deps.json5);
    const parsed = parsedRes.ok ? parsedRes.parsed : {};
    return {
      hash: hashConfigRaw(raw),
      bytes: Buffer.byteLength(raw, "utf-8"),
      mtimeMs: stat?.mtimeMs ?? null,
      ctimeMs: stat?.ctimeMs ?? null,
      ...resolveConfigStatMetadata(stat),
      hasMeta: hasConfigMeta(parsed),
      gatewayMode: resolveGatewayMode(parsed),
      observedAt: /* @__PURE__ */ new Date().toISOString(),
    };
  } catch {
    return null;
  }
}
function formatConfigArtifactTimestamp(ts) {
  return ts.replaceAll(":", "-").replaceAll(".", "-");
}
function sameFingerprint(left, right) {
  if (!left) return false;
  return (
    left.hash === right.hash &&
    left.bytes === right.bytes &&
    left.mtimeMs === right.mtimeMs &&
    left.ctimeMs === right.ctimeMs &&
    left.dev === right.dev &&
    left.ino === right.ino &&
    left.mode === right.mode &&
    left.nlink === right.nlink &&
    left.uid === right.uid &&
    left.gid === right.gid &&
    left.hasMeta === right.hasMeta &&
    left.gatewayMode === right.gatewayMode
  );
}
async function observeConfigSnapshot(deps, snapshot) {
  if (!snapshot.exists || typeof snapshot.raw !== "string") return;
  const stat = await deps.fs.promises.stat(snapshot.path).catch(() => null);
  const now = /* @__PURE__ */ new Date().toISOString();
  const current = {
    hash: resolveConfigSnapshotHash(snapshot) ?? hashConfigRaw(snapshot.raw),
    bytes: Buffer.byteLength(snapshot.raw, "utf-8"),
    mtimeMs: stat?.mtimeMs ?? null,
    ctimeMs: stat?.ctimeMs ?? null,
    ...resolveConfigStatMetadata(stat),
    hasMeta: hasConfigMeta(snapshot.parsed),
    gatewayMode: resolveGatewayMode(snapshot.resolved),
    observedAt: now,
  };
  let healthState = await readConfigHealthState(deps);
  const entry = getConfigHealthEntry(healthState, snapshot.path);
  const backupBaseline =
    entry.lastKnownGood ??
    (await readConfigFingerprintForPath(deps, `${snapshot.path}.bak`)) ??
    void 0;
  const suspicious = resolveConfigObserveSuspiciousReasons({
    bytes: current.bytes,
    hasMeta: current.hasMeta,
    gatewayMode: current.gatewayMode,
    parsed: snapshot.parsed,
    lastKnownGood: backupBaseline,
  });
  if (suspicious.length === 0) {
    if (snapshot.valid) {
      const nextEntry = {
        ...entry,
        lastKnownGood: current,
        lastObservedSuspiciousSignature: null,
      };
      if (
        !sameFingerprint(entry.lastKnownGood, current) ||
        entry.lastObservedSuspiciousSignature !== null
      ) {
        healthState = setConfigHealthEntry(healthState, snapshot.path, nextEntry);
        await writeConfigHealthState(deps, healthState);
      }
    }
    return;
  }
  const suspiciousSignature = `${current.hash}:${suspicious.join(",")}`;
  if (entry.lastObservedSuspiciousSignature === suspiciousSignature) return;
  const backup =
    (backupBaseline?.hash ? backupBaseline : null) ??
    (await readConfigFingerprintForPath(deps, `${snapshot.path}.bak`));
  deps.logger.warn(`Config observe anomaly: ${snapshot.path} (${suspicious.join(", ")})`);
  await appendConfigAuditRecord({
    fs: deps.fs,
    env: deps.env,
    homedir: deps.homedir,
    record: {
      ts: now,
      source: "config-io",
      event: "config.observe",
      phase: "read",
      configPath: snapshot.path,
      ...snapshotConfigAuditProcessInfo(),
      exists: true,
      valid: snapshot.valid,
      hash: current.hash,
      bytes: current.bytes,
      mtimeMs: current.mtimeMs,
      ctimeMs: current.ctimeMs,
      dev: current.dev,
      ino: current.ino,
      mode: current.mode,
      nlink: current.nlink,
      uid: current.uid,
      gid: current.gid,
      hasMeta: current.hasMeta,
      gatewayMode: current.gatewayMode,
      suspicious,
      lastKnownGoodHash: entry.lastKnownGood?.hash ?? null,
      lastKnownGoodBytes: entry.lastKnownGood?.bytes ?? null,
      lastKnownGoodMtimeMs: entry.lastKnownGood?.mtimeMs ?? null,
      lastKnownGoodCtimeMs: entry.lastKnownGood?.ctimeMs ?? null,
      lastKnownGoodDev: entry.lastKnownGood?.dev ?? null,
      lastKnownGoodIno: entry.lastKnownGood?.ino ?? null,
      lastKnownGoodMode: entry.lastKnownGood?.mode ?? null,
      lastKnownGoodNlink: entry.lastKnownGood?.nlink ?? null,
      lastKnownGoodUid: entry.lastKnownGood?.uid ?? null,
      lastKnownGoodGid: entry.lastKnownGood?.gid ?? null,
      lastKnownGoodGatewayMode: entry.lastKnownGood?.gatewayMode ?? null,
      backupHash: backup?.hash ?? null,
      backupBytes: backup?.bytes ?? null,
      backupMtimeMs: backup?.mtimeMs ?? null,
      backupCtimeMs: backup?.ctimeMs ?? null,
      backupDev: backup?.dev ?? null,
      backupIno: backup?.ino ?? null,
      backupMode: backup?.mode ?? null,
      backupNlink: backup?.nlink ?? null,
      backupUid: backup?.uid ?? null,
      backupGid: backup?.gid ?? null,
      backupGatewayMode: backup?.gatewayMode ?? null,
      clobberedPath: null,
      restoredFromBackup: false,
      restoredBackupPath: null,
      restoreErrorCode: null,
      restoreErrorMessage: null,
    },
  });
  healthState = setConfigHealthEntry(healthState, snapshot.path, {
    ...entry,
    lastObservedSuspiciousSignature: suspiciousSignature,
  });
  await writeConfigHealthState(deps, healthState);
}
function observeConfigSnapshotSync(deps, snapshot) {
  if (!snapshot.exists || typeof snapshot.raw !== "string") return;
  const stat = deps.fs.statSync(snapshot.path, { throwIfNoEntry: false }) ?? null;
  const now = /* @__PURE__ */ new Date().toISOString();
  const current = {
    hash: resolveConfigSnapshotHash(snapshot) ?? hashConfigRaw(snapshot.raw),
    bytes: Buffer.byteLength(snapshot.raw, "utf-8"),
    mtimeMs: stat?.mtimeMs ?? null,
    ctimeMs: stat?.ctimeMs ?? null,
    ...resolveConfigStatMetadata(stat),
    hasMeta: hasConfigMeta(snapshot.parsed),
    gatewayMode: resolveGatewayMode(snapshot.resolved),
    observedAt: now,
  };
  let healthState = readConfigHealthStateSync(deps);
  const entry = getConfigHealthEntry(healthState, snapshot.path);
  const backupBaseline =
    entry.lastKnownGood ?? readConfigFingerprintForPathSync(deps, `${snapshot.path}.bak`) ?? void 0;
  const suspicious = resolveConfigObserveSuspiciousReasons({
    bytes: current.bytes,
    hasMeta: current.hasMeta,
    gatewayMode: current.gatewayMode,
    parsed: snapshot.parsed,
    lastKnownGood: backupBaseline,
  });
  if (suspicious.length === 0) {
    if (snapshot.valid) {
      const nextEntry = {
        ...entry,
        lastKnownGood: current,
        lastObservedSuspiciousSignature: null,
      };
      if (
        !sameFingerprint(entry.lastKnownGood, current) ||
        entry.lastObservedSuspiciousSignature !== null
      ) {
        healthState = setConfigHealthEntry(healthState, snapshot.path, nextEntry);
        writeConfigHealthStateSync(deps, healthState);
      }
    }
    return;
  }
  const suspiciousSignature = `${current.hash}:${suspicious.join(",")}`;
  if (entry.lastObservedSuspiciousSignature === suspiciousSignature) return;
  const backup =
    (backupBaseline?.hash ? backupBaseline : null) ??
    readConfigFingerprintForPathSync(deps, `${snapshot.path}.bak`);
  deps.logger.warn(`Config observe anomaly: ${snapshot.path} (${suspicious.join(", ")})`);
  appendConfigAuditRecordSync({
    fs: deps.fs,
    env: deps.env,
    homedir: deps.homedir,
    record: {
      ts: now,
      source: "config-io",
      event: "config.observe",
      phase: "read",
      configPath: snapshot.path,
      ...snapshotConfigAuditProcessInfo(),
      exists: true,
      valid: snapshot.valid,
      hash: current.hash,
      bytes: current.bytes,
      mtimeMs: current.mtimeMs,
      ctimeMs: current.ctimeMs,
      dev: current.dev,
      ino: current.ino,
      mode: current.mode,
      nlink: current.nlink,
      uid: current.uid,
      gid: current.gid,
      hasMeta: current.hasMeta,
      gatewayMode: current.gatewayMode,
      suspicious,
      lastKnownGoodHash: entry.lastKnownGood?.hash ?? null,
      lastKnownGoodBytes: entry.lastKnownGood?.bytes ?? null,
      lastKnownGoodMtimeMs: entry.lastKnownGood?.mtimeMs ?? null,
      lastKnownGoodCtimeMs: entry.lastKnownGood?.ctimeMs ?? null,
      lastKnownGoodDev: entry.lastKnownGood?.dev ?? null,
      lastKnownGoodIno: entry.lastKnownGood?.ino ?? null,
      lastKnownGoodMode: entry.lastKnownGood?.mode ?? null,
      lastKnownGoodNlink: entry.lastKnownGood?.nlink ?? null,
      lastKnownGoodUid: entry.lastKnownGood?.uid ?? null,
      lastKnownGoodGid: entry.lastKnownGood?.gid ?? null,
      lastKnownGoodGatewayMode: entry.lastKnownGood?.gatewayMode ?? null,
      backupHash: backup?.hash ?? null,
      backupBytes: backup?.bytes ?? null,
      backupMtimeMs: backup?.mtimeMs ?? null,
      backupCtimeMs: backup?.ctimeMs ?? null,
      backupDev: backup?.dev ?? null,
      backupIno: backup?.ino ?? null,
      backupMode: backup?.mode ?? null,
      backupNlink: backup?.nlink ?? null,
      backupUid: backup?.uid ?? null,
      backupGid: backup?.gid ?? null,
      backupGatewayMode: backup?.gatewayMode ?? null,
      clobberedPath: null,
      restoredFromBackup: false,
      restoredBackupPath: null,
      restoreErrorCode: null,
      restoreErrorMessage: null,
    },
  });
  healthState = setConfigHealthEntry(healthState, snapshot.path, {
    ...entry,
    lastObservedSuspiciousSignature: suspiciousSignature,
  });
  writeConfigHealthStateSync(deps, healthState);
}
function warnOnConfigMiskeys(raw, logger) {
  if (!raw || typeof raw !== "object") return;
  const gateway = raw.gateway;
  if (!gateway || typeof gateway !== "object") return;
  if ("token" in gateway)
    logger.warn(
      'Config uses "gateway.token". This key is ignored; use "gateway.auth.token" instead.',
    );
}
function logConfigWarningsOnce(params) {
  if (params.warnings.length === 0) {
    loggedConfigWarningFingerprints.delete(params.configPath);
    return;
  }
  const details = params.warnings
    .map(
      (warning) =>
        `- ${sanitizeTerminalText(warning.path || "<root>")}: ${sanitizeTerminalText(warning.message)}`,
    )
    .join("\n");
  const fingerprint = hashConfigRaw(details);
  if (loggedConfigWarningFingerprints.get(params.configPath) === fingerprint) return;
  loggedConfigWarningFingerprints.set(params.configPath, fingerprint);
  params.logger.warn(`Config warnings:\n${details}`);
}
function stampConfigVersion(cfg, version) {
  return stampConfigWriteMetadata(cfg, /* @__PURE__ */ new Date().toISOString(), version);
}
function resolveConfigSizeBaselineBytes(params) {
  if (params.raw === null) return null;
  const rawBytes = Buffer.byteLength(params.raw, "utf-8");
  const parsed = parseConfigJson5(params.raw, params.json5);
  if (!parsed.ok || !isRecord(parsed.parsed)) return rawBytes;
  const canonical = JSON.stringify(
    stampConfigVersion(parsed.parsed, params.lastTouchedVersionOverride),
    null,
    2,
  )
    .trimEnd()
    .concat("\n");
  return Buffer.byteLength(canonical, "utf-8");
}
function warnIfConfigFromFuture(cfg, logger) {
  const touched = cfg.meta?.lastTouchedVersion;
  if (!touched) return;
  if (shouldWarnOnTouchedVersion(VERSION, touched)) {
    if (warnedFutureTouchedVersions.has(touched)) return;
    warnedFutureTouchedVersions.add(touched);
    logger.warn(
      [
        `Your OpenClaw config was written by version ${touched}, but this command is running ${VERSION}.`,
        "Check: `openclaw --version`, `which openclaw`, and `openclaw gateway status --deep`.",
        "If unexpected, update PATH so `openclaw` points to the version you want, or reinstall the Gateway service from that same OpenClaw install.",
      ].join("\n"),
    );
  }
}
function shouldSuppressFutureVersionWarningForEnv(env) {
  return (
    isTruthyEnvValue(env.OPENCLAW_UPDATE_IN_PROGRESS) ||
    isTruthyEnvValue(env.OPENCLAW_UPDATE_POST_CORE)
  );
}
function resolveConfigPathForDeps(deps) {
  if (deps.configPath) return deps.configPath;
  return resolveConfigPath(deps.env, resolveStateDir(deps.env, deps.homedir));
}
function normalizeDeps(overrides = {}) {
  const env = overrides.env ?? process.env;
  return {
    fs: overrides.fs ?? fs,
    json5: overrides.json5 ?? JSON5,
    env,
    lowerPrecedenceEnv: overrides.lowerPrecedenceEnv ?? {},
    homedir: overrides.homedir ?? (() => resolveRequiredHomeDir(env, os.homedir)),
    configPath: overrides.configPath ?? "",
    logger: overrides.logger ?? console,
    measure: overrides.measure ?? (async (_name, run) => await run()),
    suppressFutureVersionWarning:
      overrides.suppressFutureVersionWarning ?? shouldSuppressFutureVersionWarningForEnv(env),
    observe: overrides.observe ?? true,
  };
}
function maybeLoadDotEnvForConfig(env) {
  if (env !== process.env) return;
  loadDotEnv({ quiet: true });
}
function parseConfigJson5(raw, json5 = JSON5) {
  try {
    return {
      ok: true,
      parsed: parseJsonWithJson5Fallback(raw, json5),
    };
  } catch (err) {
    return {
      ok: false,
      error: String(err),
    };
  }
}
function findJsonRootSuffix(raw, json5 = JSON5) {
  if (/^\s*(?:\{|\[)/.test(raw)) return null;
  let offset = 0;
  while (offset < raw.length) {
    const nextNewline = raw.indexOf("\n", offset);
    const lineEnd = nextNewline === -1 ? raw.length : nextNewline + 1;
    const line = raw.slice(offset, lineEnd);
    if (/^\s*(?:\{|\[)/.test(line)) {
      const candidate = raw.slice(offset);
      const parsed = parseConfigJson5(candidate, json5);
      return parsed.ok
        ? {
            raw: candidate,
            parsed: parsed.parsed,
          }
        : null;
    }
    offset = lineEnd;
  }
  return null;
}
function warnOnConfigPermissionHardeningFailure(params) {
  const detail = params.error instanceof Error ? params.error.message : String(params.error);
  params.deps.logger.warn(
    `Config permission hardening failed (${params.context}): ${params.configPath}: ${detail}`,
  );
}
async function persistPrefixedConfigRecovery(params) {
  const observedAt = /* @__PURE__ */ new Date().toISOString();
  const clobberedPath = await persistBoundedClobberedConfigSnapshot({
    deps: params.deps,
    configPath: params.configPath,
    raw: params.originalRaw,
    observedAt,
  });
  await params.deps.fs.promises.writeFile(params.configPath, params.recoveredRaw, {
    encoding: "utf-8",
    mode: 384,
  });
  await params.deps.fs.promises.chmod?.(params.configPath, 384).catch((error) => {
    warnOnConfigPermissionHardeningFailure({
      deps: params.deps,
      configPath: params.configPath,
      context: "prefix recovery",
      error,
    });
  });
  params.deps.logger.warn(
    `Config auto-stripped non-JSON prefix: ${params.configPath}` +
      (clobberedPath ? ` (original saved as ${clobberedPath})` : ""),
  );
}
async function recoverConfigFromJsonRootSuffixWithDeps(params) {
  if (!params.snapshot.exists || params.snapshot.valid || typeof params.snapshot.raw !== "string")
    return false;
  const suffixRecovery = findJsonRootSuffix(params.snapshot.raw, params.deps.json5);
  if (!suffixRecovery) return false;
  let resolved;
  try {
    resolved = resolveConfigIncludesForRead(suffixRecovery.parsed, params.configPath, params.deps);
  } catch {
    return false;
  }
  if (
    !validateConfigObjectWithPlugins(
      stripShippedPluginInstallConfigRecords(
        resolveConfigForRead(resolved, params.deps.env, params.deps.lowerPrecedenceEnv)
          .resolvedConfigRaw,
      ),
      {
        env: params.deps.env,
        sourceRaw: suffixRecovery.parsed,
      },
    ).ok
  )
    return false;
  await persistPrefixedConfigRecovery({
    deps: params.deps,
    configPath: params.configPath,
    originalRaw: params.snapshot.raw,
    recoveredRaw: suffixRecovery.raw,
  });
  return true;
}
const TILDE_PATH_VALUE_RE = /^~(?=$|[\\/])/;
const PATH_LIKE_CONFIG_KEY_RE = /(dir|path|paths|file|root|workspace)$/i;
const PATH_LIKE_CONFIG_LIST_KEYS = /* @__PURE__ */ new Set(["paths", "pathPrepend"]);
function isPathLikeConfigKey(key) {
  return Boolean(key && (PATH_LIKE_CONFIG_KEY_RE.test(key) || PATH_LIKE_CONFIG_LIST_KEYS.has(key)));
}
function expandAuthoredTildePath(value, home) {
  const suffix = value.slice(1);
  if (!suffix) return home;
  if (suffix.startsWith("/") || suffix.startsWith("\\")) return path.join(home, suffix.slice(1));
  return value;
}
function restoreAuthoredTildePathsForWrite(next, authored, key, home) {
  if (
    typeof next === "string" &&
    typeof authored === "string" &&
    isPathLikeConfigKey(key) &&
    TILDE_PATH_VALUE_RE.test(authored.trim()) &&
    path.normalize(next) === path.normalize(expandAuthoredTildePath(authored.trim(), home))
  )
    return authored;
  if (Array.isArray(next) && Array.isArray(authored)) {
    const normalizeChildren = isPathLikeConfigKey(key);
    return next.map((entry, index) =>
      restoreAuthoredTildePathsForWrite(
        entry,
        authored[index],
        normalizeChildren ? key : void 0,
        home,
      ),
    );
  }
  if (!isRecord(next) || !isRecord(authored)) return next;
  const out = { ...next };
  for (const [childKey, childValue] of Object.entries(out))
    if (Object.hasOwn(authored, childKey))
      out[childKey] = restoreAuthoredTildePathsForWrite(
        childValue,
        authored[childKey],
        childKey,
        home,
      );
  return out;
}
function resolveConfigIncludesForRead(
  parsed,
  configPath,
  deps,
  includeFileHashesForWrite,
  includeFileTargetsForWrite,
) {
  const allowedRoots = resolveIncludeRoots(deps.env, deps.homedir);
  const recordIncludeTarget = (resolvedPath, canonicalPath) => {
    if (!includeFileTargetsForWrite) return;
    const normalizedPath = path.normalize(resolvedPath);
    try {
      includeFileTargetsForWrite[normalizedPath] = path.normalize(
        canonicalPath ??
          resolveConfigIncludeWritePath({
            configPath,
            includePath: resolvedPath,
            allowedRoots,
          }),
      );
    } catch {}
  };
  return resolveConfigIncludes(
    parsed,
    configPath,
    {
      readFile: (candidate) => deps.fs.readFileSync(candidate, "utf-8"),
      readFileWithGuards: ({ includePath, resolvedPath, rootRealDir }) => {
        try {
          const raw = readConfigIncludeFileWithGuards({
            includePath,
            resolvedPath,
            rootRealDir,
            ioFs: deps.fs,
            onResolvedPath: (canonicalPath) => recordIncludeTarget(resolvedPath, canonicalPath),
          });
          if (includeFileHashesForWrite)
            includeFileHashesForWrite[path.normalize(resolvedPath)] = hashConfigIncludeRaw(raw);
          return raw;
        } catch (error) {
          const missing = collectErrorGraphCandidates(error, (current) => [current.cause]).some(
            (candidate) => extractErrorCode(candidate) === "ENOENT",
          );
          if (includeFileHashesForWrite && missing)
            includeFileHashesForWrite[path.normalize(resolvedPath)] = hashConfigIncludeRaw(null);
          if (missing) recordIncludeTarget(resolvedPath);
          throw error;
        }
      },
      parseJson: (raw) => deps.json5.parse(raw),
    },
    { allowedRoots },
  );
}
function resolveConfigForRead(resolvedIncludes, env, lowerPrecedenceEnv = {}) {
  if (resolvedIncludes && typeof resolvedIncludes === "object" && "env" in resolvedIncludes)
    applyConfigEnvVars(resolvedIncludes, env, { lowerPrecedenceEnv });
  const envWarnings = [];
  return {
    resolvedConfigRaw: resolveConfigEnvVars(resolvedIncludes, env, {
      onMissing: (w) => envWarnings.push(w),
    }),
    envSnapshotForRestore: { ...env },
    envWarnings,
  };
}
function snapshotEnv(env) {
  return { ...env };
}
function replaceEnvSnapshot(env, next) {
  for (const key of Object.keys(env)) delete env[key];
  Object.assign(env, next);
}
function resolveManagedRuntimeEnvBaseline() {
  const published = getPublishedConfigRuntimeEnvState();
  return {
    generation: published.generation,
    sourceConfig: published.sourceConfig ?? getRuntimeConfigSourceSnapshot() ?? {},
  };
}
function createManagedRuntimeEnvBase() {
  return createConfigRuntimeEnvBase(resolveManagedRuntimeEnvBaseline().sourceConfig, process.env, {
    preservedKeys: GATEWAY_CONFIG_SELECTION_ENV_KEYS,
  });
}
function restoreEnvChangesIfUnchanged(params) {
  const keys = /* @__PURE__ */ new Set([
    ...Object.keys(params.before),
    ...Object.keys(params.after),
  ]);
  for (const key of keys) {
    if (params.before[key] === params.after[key] || params.env[key] !== params.after[key]) continue;
    const previous = params.before[key];
    if (previous === void 0) delete params.env[key];
    else params.env[key] = previous;
  }
}
function createConfigFileSnapshot(params) {
  const sourceConfig = asResolvedSourceConfig(params.sourceConfig);
  const runtimeConfig = asRuntimeConfig(params.runtimeConfig);
  return {
    path: params.path,
    exists: params.exists,
    raw: params.raw,
    parsed: params.parsed,
    sourceConfig,
    resolved: sourceConfig,
    valid: params.valid,
    runtimeConfig,
    config: runtimeConfig,
    hash: params.hash,
    ...(params.readError ? { readError: params.readError } : {}),
    issues: params.issues,
    warnings: params.warnings,
    legacyIssues: params.legacyIssues,
  };
}
async function finalizeReadConfigSnapshotInternalResult(deps, result, options) {
  if (deps.observe && options?.observe !== false)
    await observeConfigSnapshot(deps, result.snapshot);
  return result;
}
async function collectInvalidConfigLegacyIssues(raw, sourceRaw) {
  if (!raw || typeof raw !== "object") return [];
  const { findDoctorLegacyConfigIssues } = await import("./legacy-config-issues-Cqxbn-AJ.js");
  return findDoctorLegacyConfigIssues(raw, sourceRaw);
}
function createConfigIO(overrides = {}) {
  const deps = normalizeDeps(overrides);
  const configPath = resolveConfigPathForDeps(deps);
  function observeLoadConfigSnapshot(snapshot) {
    if (deps.observe) observeConfigSnapshotSync(deps, snapshot);
    return snapshot;
  }
  function finalizeLoadedRuntimeConfig(cfg) {
    const duplicates = findDuplicateAgentDirs(cfg, {
      env: deps.env,
      homedir: deps.homedir,
    });
    if (duplicates.length > 0) throw new DuplicateAgentDirError(duplicates);
    applyConfigEnvVars(cfg, deps.env);
    if (
      (shouldEnableShellEnvFallback(deps.env) || cfg.env?.shellEnv?.enabled === true) &&
      overrides.shellEnvFallback !== "defer" &&
      !shouldDeferShellEnvFallback(deps.env)
    )
      loadShellEnvFallback({
        enabled: true,
        env: deps.env,
        expectedKeys: resolveShellEnvExpectedKeys(deps.env),
        logger: deps.logger,
        timeoutMs: cfg.env?.shellEnv?.timeoutMs ?? resolveShellEnvFallbackTimeoutMs(deps.env),
      });
    const pendingSecret = AUTO_OWNER_DISPLAY_SECRET_BY_PATH.get(configPath);
    const ownerDisplaySecretResolution = ensureOwnerDisplaySecret(
      cfg,
      () => pendingSecret ?? crypto.randomBytes(32).toString("hex"),
    );
    return applyConfigOverrides(
      retainGeneratedOwnerDisplaySecret({
        config: ownerDisplaySecretResolution.config,
        configPath,
        generatedSecret: ownerDisplaySecretResolution.generatedSecret,
        state: { pendingByPath: AUTO_OWNER_DISPLAY_SECRET_BY_PATH },
      }),
    );
  }
  function replaceConfigFileSync(raw) {
    replaceFileAtomicSync({
      filePath: configPath,
      content: raw,
      dirMode: 448,
      mode: 384,
      tempPrefix: path.basename(configPath),
      copyFallbackOnPermissionError: true,
      fileSystem: deps.fs,
    });
  }
  function migrateAndStripShippedPluginInstallConfigRecords(configRaw, options = {}) {
    const installRecords = extractShippedPluginInstallConfigRecords(configRaw);
    const stripped = stripShippedPluginInstallConfigRecords(configRaw);
    if (Object.keys(installRecords).length === 0) return { config: stripped };
    if (options.persist === false)
      return {
        config: configRaw,
        validationConfig: stripped,
      };
    try {
      const stateDir = resolveStateDir(deps.env, deps.homedir);
      const existingRecords = loadInstalledPluginIndexInstallRecordsSync({
        env: deps.env,
        stateDir,
      });
      const nextRecords = {
        ...installRecords,
        ...existingRecords,
      };
      if (Object.keys(installRecords).some((pluginId) => !(pluginId in existingRecords)))
        writePersistedInstalledPluginIndexInstallRecordsSync(nextRecords, {
          config: coerceConfig(stripped),
          env: deps.env,
          stateDir,
        });
      const rootConfigRaw = options.rootConfigRaw;
      if (
        rootConfigRaw !== void 0 &&
        Object.keys(extractShippedPluginInstallConfigRecords(rootConfigRaw)).length > 0
      ) {
        const persistedRootParsed = stripShippedPluginInstallConfigRecords(rootConfigRaw);
        const persistedRootRaw = JSON.stringify(persistedRootParsed, null, 2)
          .trimEnd()
          .concat("\n");
        replaceConfigFileSync(persistedRootRaw);
        return {
          config: stripped,
          persistedRootParsed,
          persistedRootRaw,
        };
      }
    } catch (err) {
      deps.logger.warn(
        `Config (${configPath}): could not migrate shipped plugins.installs records into the plugin index: ${formatErrorMessage(err)}`,
      );
      return { config: configRaw };
    }
    return { config: stripped };
  }
  function retainRuntimeOnlyShippedPluginInstallConfigRecords(config, sourceRaw) {
    const installRecords = extractShippedPluginInstallConfigRecords(sourceRaw);
    if (Object.keys(installRecords).length === 0) return config;
    return {
      ...config,
      plugins: {
        ...config.plugins,
        installs: installRecords,
      },
    };
  }
  function createValidationPluginMetadataSnapshotLoader(params) {
    let pluginMetadataSnapshot;
    return {
      load: (config) => {
        if (pluginMetadataSnapshot) return pluginMetadataSnapshot;
        const metadataConfig = retainRuntimeOnlyShippedPluginInstallConfigRecords(
          config,
          params.effectiveConfigRaw,
        );
        pluginMetadataSnapshot = resolvePluginMetadataSnapshot({
          config: metadataConfig,
          workspaceDir: resolveAgentWorkspaceDir(
            metadataConfig,
            resolveDefaultAgentId(metadataConfig),
            params.env,
          ),
          env: params.env,
          allowWorkspaceScopedCurrent: true,
          pluginIdScope: createConfigValidationMetadataPluginIdScope({
            config: metadataConfig,
            env: params.env,
          }),
        });
        return pluginMetadataSnapshot;
      },
      getSnapshot: () => pluginMetadataSnapshot,
    };
  }
  function resolveRuntimePreflightSourceConfig(candidate) {
    const env = { ...deps.env };
    return coerceConfig(
      migrateAndStripShippedPluginInstallConfigRecords(
        resolveConfigForRead(
          resolveConfigIncludesForRead(candidate, configPath, {
            ...deps,
            env,
          }),
          env,
          deps.lowerPrecedenceEnv,
        ).resolvedConfigRaw,
        {
          persist: false,
          rootConfigRaw: candidate,
        },
      ).config,
    );
  }
  function ensureShippedPluginInstallConfigRecordsMigratedForWrite(snapshot) {
    const installRecords = {
      ...extractShippedPluginInstallConfigRecords(snapshot.sourceConfig),
      ...extractShippedPluginInstallConfigRecords(snapshot.parsed),
    };
    if (Object.keys(installRecords).length === 0) return { migrated: false };
    const stateDir = resolveStateDir(deps.env, deps.homedir);
    const existingRecords = loadInstalledPluginIndexInstallRecordsSync({
      env: deps.env,
      stateDir,
    });
    if (Object.keys(installRecords).every((pluginId) => pluginId in existingRecords))
      return { migrated: false };
    try {
      writePersistedInstalledPluginIndexInstallRecordsSync(
        {
          ...installRecords,
          ...existingRecords,
        },
        {
          config: coerceConfig(stripShippedPluginInstallConfigRecords(snapshot.sourceConfig)),
          env: deps.env,
          stateDir,
        },
      );
      return { migrated: true };
    } catch (err) {
      throw new Error(
        `Config write blocked: shipped plugins.installs records in ${configPath} could not be migrated into the plugin index. Fix state directory permissions or run openclaw plugins registry --refresh, then retry. ${formatErrorMessage(err)}`,
        { cause: err },
      );
    }
  }
  function rollbackShippedPluginInstallConfigWriteMigration(migration) {
    if (!migration.migrated) return false;
    return false;
  }
  function resolveSuspiciousRecoveryBackupCandidate(parsed) {
    try {
      const candidateEnv = cloneEnvWithPlatformSemantics(deps.env);
      const candidateDeps = {
        ...deps,
        env: candidateEnv,
      };
      const installMigration = migrateAndStripShippedPluginInstallConfigRecords(
        resolveConfigForRead(
          resolveConfigIncludesForRead(parsed, configPath, candidateDeps),
          candidateEnv,
          deps.lowerPrecedenceEnv,
        ).resolvedConfigRaw,
        {
          persist: false,
          rootConfigRaw: parsed,
        },
      );
      const effectiveConfigRaw = installMigration.config;
      const validationConfigRaw = installMigration.validationConfig ?? effectiveConfigRaw;
      const validationPluginMetadata = createValidationPluginMetadataSnapshotLoader({
        effectiveConfigRaw,
        env: candidateEnv,
      });
      return validateConfigObjectWithPlugins(validationConfigRaw, {
        env: candidateEnv,
        pluginValidation: overrides.pluginValidation,
        loadPluginMetadataSnapshot: validationPluginMetadata.load,
        sourceRaw: parsed,
        preservedLegacyRootKeys: overrides.preservedLegacyRootKeys,
      }).ok
        ? coerceConfig(effectiveConfigRaw)
        : null;
    } catch {
      return null;
    }
  }
  function loadConfigLocal(options = {}) {
    try {
      maybeLoadDotEnvForConfig(deps.env);
      const envBeforeRead = snapshotEnv(deps.env);
      if (!deps.fs.existsSync(configPath)) {
        loggedConfigWarningFingerprints.delete(configPath);
        if (
          overrides.shellEnvFallback !== "defer" &&
          shouldEnableShellEnvFallback(deps.env) &&
          !shouldDeferShellEnvFallback(deps.env)
        )
          loadShellEnvFallback({
            enabled: true,
            env: deps.env,
            expectedKeys: resolveShellEnvExpectedKeys(deps.env),
            logger: deps.logger,
            timeoutMs: resolveShellEnvFallbackTimeoutMs(deps.env),
          });
        return {};
      }
      const raw = deps.fs.readFileSync(configPath, "utf-8");
      const parsed = deps.json5.parse(raw);
      const readResolution = resolveConfigForRead(
        resolveConfigIncludesForRead(parsed, configPath, deps),
        deps.env,
        deps.lowerPrecedenceEnv,
      );
      const resolvedConfig = readResolution.resolvedConfigRaw;
      const installMigration = migrateAndStripShippedPluginInstallConfigRecords(resolvedConfig, {
        persist: false,
        rootConfigRaw: parsed,
      });
      const effectiveConfigRaw = installMigration.config;
      const validationConfigRaw = installMigration.validationConfig ?? effectiveConfigRaw;
      const snapshotRaw = installMigration.persistedRootRaw ?? raw;
      const snapshotParsed = installMigration.persistedRootParsed ?? parsed;
      const hash = hashConfigRaw(snapshotRaw);
      for (const w of readResolution.envWarnings)
        deps.logger.warn(
          `Config (${configPath}): missing env var "${w.varName}" at ${w.configPath} - feature using this value will be unavailable`,
        );
      warnOnConfigMiskeys(validationConfigRaw, deps.logger);
      if (typeof validationConfigRaw !== "object" || validationConfigRaw === null) {
        loggedConfigWarningFingerprints.delete(configPath);
        observeLoadConfigSnapshot({
          ...createConfigFileSnapshot({
            path: configPath,
            exists: true,
            raw: snapshotRaw,
            parsed: snapshotParsed,
            sourceConfig: {},
            valid: true,
            runtimeConfig: {},
            hash,
            issues: [],
            warnings: [],
            legacyIssues: [],
          }),
        });
        return {};
      }
      const preValidationDuplicates = findDuplicateAgentDirs(validationConfigRaw, {
        env: deps.env,
        homedir: deps.homedir,
      });
      if (preValidationDuplicates.length > 0)
        throw new DuplicateAgentDirError(preValidationDuplicates);
      const validationPluginMetadata = createValidationPluginMetadataSnapshotLoader({
        effectiveConfigRaw,
        env: deps.env,
      });
      const validated = validateConfigObjectWithPlugins(validationConfigRaw, {
        env: deps.env,
        pluginValidation: overrides.pluginValidation,
        loadPluginMetadataSnapshot: validationPluginMetadata.load,
        sourceRaw: snapshotParsed,
        preservedLegacyRootKeys: overrides.preservedLegacyRootKeys,
      });
      if (!validated.ok) {
        observeLoadConfigSnapshot({
          ...createConfigFileSnapshot({
            path: configPath,
            exists: true,
            raw: snapshotRaw,
            parsed: snapshotParsed,
            sourceConfig: coerceConfig(effectiveConfigRaw),
            valid: false,
            runtimeConfig: coerceConfig(effectiveConfigRaw),
            hash,
            issues: validated.issues,
            warnings: validated.warnings,
            legacyIssues: [],
          }),
        });
        throwInvalidConfig({
          configPath,
          issues: validated.issues,
          logger: deps.logger,
          loggedConfigPaths: loggedInvalidConfigs,
        });
      }
      if (overrides.pluginValidation !== "skip")
        logConfigWarningsOnce({
          configPath,
          warnings: validated.warnings,
          logger: deps.logger,
        });
      if (!deps.suppressFutureVersionWarning) warnIfConfigFromFuture(validated.config, deps.logger);
      if (
        deps.observe &&
        !options.skipSuspiciousRecovery &&
        !containsConfigIncludeDirective(parsed)
      ) {
        if (
          maybeRecoverSuspiciousConfigReadSync({
            deps,
            configPath,
            raw,
            parsed,
            validateBackupSync: (backup) =>
              resolveSuspiciousRecoveryBackupCandidate(backup.parsed) !== null,
          }).raw !== raw
        ) {
          restoreEnvChangesIfUnchanged({
            env: deps.env,
            before: envBeforeRead,
            after: snapshotEnv(deps.env),
          });
          return loadConfigLocal({ skipSuspiciousRecovery: true });
        }
      }
      const cfg = retainRuntimeOnlyShippedPluginInstallConfigRecords(
        materializeRuntimeConfig(validated.config, "load", {
          manifestRegistry: validationPluginMetadata.getSnapshot()?.manifestRegistry,
        }),
        effectiveConfigRaw,
      );
      observeLoadConfigSnapshot({
        ...createConfigFileSnapshot({
          path: configPath,
          exists: true,
          raw: snapshotRaw,
          parsed: snapshotParsed,
          sourceConfig: coerceConfig(effectiveConfigRaw),
          valid: true,
          runtimeConfig: cfg,
          hash,
          issues: [],
          warnings: validated.warnings,
          legacyIssues: [],
        }),
      });
      return finalizeLoadedRuntimeConfig(cfg);
    } catch (err) {
      if (err instanceof DuplicateAgentDirError) {
        deps.logger.error(err.message);
        throw err;
      }
      if (err?.code === "INVALID_CONFIG") throw err;
      deps.logger.error(`Failed to read config at ${configPath}`, err);
      throw err;
    }
  }
  async function readConfigFileSnapshotInternal(options = {}) {
    maybeLoadDotEnvForConfig(deps.env);
    const envBeforeRead = snapshotEnv(deps.env);
    if (!deps.fs.existsSync(configPath)) {
      const hash = hashConfigRaw(null);
      return await finalizeReadConfigSnapshotInternalResult(deps, {
        snapshot: createConfigFileSnapshot({
          path: configPath,
          exists: false,
          raw: null,
          parsed: {},
          sourceConfig: {},
          valid: true,
          runtimeConfig: {},
          hash,
          issues: [],
          warnings: [],
          legacyIssues: [],
        }),
      });
    }
    let fallbackRaw = null;
    let fallbackParsed = {};
    let fallbackSourceConfig = {};
    let fallbackHash = hashConfigRaw(null);
    let fallbackEnvSnapshotForRestore;
    const includeFileHashesForWrite = {};
    const includeFileTargetsForWrite = {};
    try {
      const raw = await deps.measure("config.snapshot.read.file", () =>
        deps.fs.readFileSync(configPath, "utf-8"),
      );
      const rawHash = await deps.measure("config.snapshot.read.hash", () => hashConfigRaw(raw));
      fallbackRaw = raw;
      fallbackHash = rawHash;
      const parsedRes = await deps.measure("config.snapshot.read.parse", () =>
        parseConfigJson5(raw, deps.json5),
      );
      if (!parsedRes.ok)
        return await finalizeReadConfigSnapshotInternalResult(deps, {
          snapshot: createConfigFileSnapshot({
            path: configPath,
            exists: true,
            raw,
            parsed: {},
            sourceConfig: {},
            valid: false,
            runtimeConfig: {},
            hash: rawHash,
            issues: [
              {
                path: "",
                message: `JSON5 parse failed: ${parsedRes.error}`,
              },
            ],
            warnings: [],
            legacyIssues: [],
          }),
        });
      fallbackParsed = parsedRes.parsed;
      fallbackSourceConfig = coerceConfig(parsedRes.parsed);
      const effectiveParsed = parsedRes.parsed;
      const hash = rawHash;
      fallbackRaw = raw;
      fallbackParsed = effectiveParsed;
      fallbackSourceConfig = coerceConfig(effectiveParsed);
      fallbackHash = hash;
      let resolved;
      try {
        resolved = await deps.measure("config.snapshot.read.includes", () =>
          resolveConfigIncludesForRead(
            effectiveParsed,
            configPath,
            deps,
            includeFileHashesForWrite,
            includeFileTargetsForWrite,
          ),
        );
      } catch (err) {
        const message =
          err instanceof ConfigIncludeError
            ? err.message
            : `Include resolution failed: ${String(err)}`;
        return await finalizeReadConfigSnapshotInternalResult(deps, {
          snapshot: createConfigFileSnapshot({
            path: configPath,
            exists: true,
            raw,
            parsed: effectiveParsed,
            sourceConfig: coerceConfig(effectiveParsed),
            valid: false,
            runtimeConfig: coerceConfig(effectiveParsed),
            hash,
            issues: [
              {
                path: "",
                message,
              },
            ],
            warnings: [],
            legacyIssues: [],
          }),
          includeFileHashesForWrite,
          includeFileTargetsForWrite,
        });
      }
      const readResolution = await deps.measure("config.snapshot.read.env", () =>
        resolveConfigForRead(resolved, deps.env, deps.lowerPrecedenceEnv),
      );
      fallbackEnvSnapshotForRestore = readResolution.envSnapshotForRestore;
      const envVarWarnings = readResolution.envWarnings.map((w) => ({
        path: w.configPath,
        message: `Missing env var "${w.varName}" - feature using this value will be unavailable`,
      }));
      const resolvedConfigRaw = readResolution.resolvedConfigRaw;
      const installMigration = await deps.measure(
        "config.snapshot.read.plugin-install-migration",
        () =>
          migrateAndStripShippedPluginInstallConfigRecords(resolvedConfigRaw, {
            persist: false,
            rootConfigRaw: effectiveParsed,
          }),
      );
      const effectiveConfigRaw = installMigration.config;
      const validationConfigRaw = installMigration.validationConfig ?? effectiveConfigRaw;
      const snapshotRaw = installMigration.persistedRootRaw ?? raw;
      const snapshotParsed = installMigration.persistedRootParsed ?? effectiveParsed;
      const snapshotHash = installMigration.persistedRootRaw
        ? hashConfigRaw(installMigration.persistedRootRaw)
        : hash;
      fallbackSourceConfig = coerceConfig(effectiveConfigRaw);
      const validationPluginMetadata = createValidationPluginMetadataSnapshotLoader({
        effectiveConfigRaw,
        env: deps.env,
      });
      const validated = await deps.measure("config.snapshot.read.validate", () =>
        validateConfigObjectWithPlugins(validationConfigRaw, {
          env: deps.env,
          pluginValidation: overrides.pluginValidation,
          loadPluginMetadataSnapshot: validationPluginMetadata.load,
          sourceRaw: effectiveParsed,
          preservedLegacyRootKeys: overrides.preservedLegacyRootKeys,
        }),
      );
      if (!validated.ok) {
        const legacyIssues = await deps.measure("config.snapshot.read.legacy-issues", () =>
          collectInvalidConfigLegacyIssues(effectiveConfigRaw, effectiveParsed),
        );
        return await finalizeReadConfigSnapshotInternalResult(deps, {
          snapshot: createConfigFileSnapshot({
            path: configPath,
            exists: true,
            raw: snapshotRaw,
            parsed: snapshotParsed,
            sourceConfig: coerceConfig(effectiveConfigRaw),
            valid: false,
            runtimeConfig: coerceConfig(effectiveConfigRaw),
            hash: snapshotHash,
            issues: validated.issues,
            warnings: [...validated.warnings, ...envVarWarnings],
            legacyIssues,
          }),
          envSnapshotForRestore: readResolution.envSnapshotForRestore,
          includeFileHashesForWrite,
          includeFileTargetsForWrite,
        });
      }
      if (!deps.suppressFutureVersionWarning) warnIfConfigFromFuture(validated.config, deps.logger);
      let callerRejectedSuspiciousRecovery = false;
      if (
        options.recoverSuspicious === true &&
        deps.observe &&
        !options.skipSuspiciousRecovery &&
        !containsConfigIncludeDirective(effectiveParsed)
      ) {
        const allowSuspiciousRecovery = options.allowSuspiciousRecovery;
        let recoveryCandidate = null;
        if (
          (
            await deps.measure("config.snapshot.read.recover-suspicious", () =>
              maybeRecoverSuspiciousConfigRead({
                deps,
                configPath,
                raw,
                parsed: effectiveParsed,
                validateBackup: async (backup) => {
                  recoveryCandidate = resolveSuspiciousRecoveryBackupCandidate(backup.parsed);
                  return recoveryCandidate !== null;
                },
                ...(allowSuspiciousRecovery
                  ? {
                      allowBackupRecovery: async () => {
                        const allowed =
                          recoveryCandidate !== null &&
                          (await allowSuspiciousRecovery(recoveryCandidate, validated.config));
                        callerRejectedSuspiciousRecovery = !allowed;
                        return allowed;
                      },
                    }
                  : {}),
              }),
            )
          ).raw !== raw
        ) {
          restoreEnvChangesIfUnchanged({
            env: deps.env,
            before: envBeforeRead,
            after: snapshotEnv(deps.env),
          });
          return await readConfigFileSnapshotInternal({
            recoverSuspicious: options.recoverSuspicious,
            skipSuspiciousRecovery: true,
          });
        }
      }
      const snapshotConfig = await deps.measure("config.snapshot.read.materialize", () =>
        retainRuntimeOnlyShippedPluginInstallConfigRecords(
          materializeRuntimeConfig(validated.config, "snapshot", {
            manifestRegistry: validationPluginMetadata.getSnapshot()?.manifestRegistry,
          }),
          effectiveConfigRaw,
        ),
      );
      return await deps.measure("config.snapshot.read.observe", () =>
        finalizeReadConfigSnapshotInternalResult(
          deps,
          {
            snapshot: createConfigFileSnapshot({
              path: configPath,
              exists: true,
              raw: snapshotRaw,
              parsed: snapshotParsed,
              sourceConfig: coerceConfig(effectiveConfigRaw),
              valid: true,
              runtimeConfig: snapshotConfig,
              hash: snapshotHash,
              issues: [],
              warnings: [...validated.warnings, ...envVarWarnings],
              legacyIssues: [],
            }),
            envSnapshotForRestore: readResolution.envSnapshotForRestore,
            includeFileHashesForWrite,
            includeFileTargetsForWrite,
            pluginMetadataSnapshot: validationPluginMetadata.getSnapshot(),
          },
          { observe: !callerRejectedSuspiciousRecovery },
        ),
      );
    } catch (err) {
      const nodeErr = err;
      let message;
      if (nodeErr?.code === "EACCES") {
        const uid = process.getuid?.();
        const uidHint = typeof uid === "number" ? String(uid) : "$(id -u)";
        message = [
          `read failed: ${String(err)}`,
          ``,
          `Config file is not readable by the current process. If running in a container`,
          `or 1-click deployment, fix ownership with:`,
          `  chown ${uidHint} "${configPath}"`,
          `Then restart the gateway.`,
        ].join("\n");
        deps.logger.error(message);
      } else message = `read failed: ${String(err)}`;
      return await finalizeReadConfigSnapshotInternalResult(deps, {
        snapshot: createConfigFileSnapshot({
          path: configPath,
          exists: true,
          raw: fallbackRaw,
          parsed: fallbackParsed,
          sourceConfig: fallbackSourceConfig,
          valid: false,
          runtimeConfig: fallbackSourceConfig,
          hash: fallbackHash,
          ...(fallbackRaw === null ? { readError: { code: nodeErr?.code ?? null } } : {}),
          issues: [
            {
              path: "",
              message,
            },
          ],
          warnings: [],
          legacyIssues: [],
        }),
        envSnapshotForRestore: fallbackEnvSnapshotForRestore,
        includeFileHashesForWrite,
        includeFileTargetsForWrite,
      });
    }
  }
  async function readConfigFileSnapshotLocal(options = {}) {
    return (
      await readConfigFileSnapshotInternal({
        recoverSuspicious: options.recoverSuspicious === true,
        allowSuspiciousRecovery: options.allowSuspiciousRecovery,
      })
    ).snapshot;
  }
  async function readConfigFileSnapshotWithPluginMetadataLocal(options = {}) {
    const result = await readConfigFileSnapshotInternal({
      recoverSuspicious: options.recoverSuspicious === true,
      allowSuspiciousRecovery: options.allowSuspiciousRecovery,
    });
    return {
      snapshot: result.snapshot,
      ...(result.pluginMetadataSnapshot
        ? { pluginMetadataSnapshot: result.pluginMetadataSnapshot }
        : {}),
    };
  }
  async function promoteConfigSnapshotToLastKnownGoodLocal(snapshot) {
    return await promoteConfigSnapshotToLastKnownGood$1({
      deps,
      snapshot,
      logger: deps.logger,
    });
  }
  async function recoverConfigFromLastKnownGoodLocal(params) {
    return await recoverConfigFromLastKnownGood$1({
      deps,
      snapshot: params.snapshot,
      reason: params.reason,
    });
  }
  async function recoverConfigFromJsonRootSuffixLocal(snapshot) {
    return await recoverConfigFromJsonRootSuffixWithDeps({
      deps,
      configPath,
      snapshot,
    });
  }
  async function readConfigFileSnapshotForWriteLocal() {
    const assertConfigPathForWrite = () => {
      if (resolveConfigPathForDeps(deps) !== configPath)
        throw new ConfigMutationConflictError("config path changed since last load", {
          currentHash: null,
          retryable: false,
        });
    };
    assertConfigPathForWrite();
    const result = await readConfigFileSnapshotInternal();
    assertConfigPathForWrite();
    return {
      snapshot: result.snapshot,
      writeOptions: {
        assertConfigPathForWrite,
        basePluginMetadataSnapshot: result.pluginMetadataSnapshot,
        envSnapshotForRestore: result.envSnapshotForRestore,
        expectedConfigPath: configPath,
        ownedConfigPathForWrite: configPath,
        includeFileHashesForWrite: result.includeFileHashesForWrite,
        includeFileTargetsForWrite: result.includeFileTargetsForWrite,
        unsetPaths: resolveManagedUnsetPathsForWrite(void 0),
      },
    };
  }
  async function readBestEffortConfigSnapshotLocal() {
    const result = await readConfigFileSnapshotInternal();
    if (!result.snapshot.valid)
      return {
        config: result.snapshot.config,
        sourceConfig: result.snapshot.sourceConfig,
      };
    return {
      config: finalizeLoadedRuntimeConfig(
        materializeRuntimeConfig(result.snapshot.sourceConfig, "load", {
          manifestRegistry: result.pluginMetadataSnapshot?.manifestRegistry,
        }),
      ),
      sourceConfig: result.snapshot.sourceConfig,
    };
  }
  async function readBestEffortConfigLocal() {
    return (await readBestEffortConfigSnapshotLocal()).config;
  }
  async function readSourceConfigBestEffortLocal() {
    maybeLoadDotEnvForConfig(deps.env);
    if (!deps.fs.existsSync(configPath)) return {};
    try {
      const parsedRes = parseConfigJson5(deps.fs.readFileSync(configPath, "utf-8"), deps.json5);
      if (!parsedRes.ok) return {};
      let resolved;
      try {
        resolved = resolveConfigIncludesForRead(parsedRes.parsed, configPath, deps);
      } catch {
        return coerceConfig(parsedRes.parsed);
      }
      return coerceConfig(
        stripShippedPluginInstallConfigRecords(
          resolveConfigForRead(resolved, deps.env, deps.lowerPrecedenceEnv).resolvedConfigRaw,
        ),
      );
    } catch {
      return {};
    }
  }
  async function writeConfigFileLocal(cfg, options = {}) {
    options.assertConfigPathForWrite?.();
    assertConfigWriteAllowedInCurrentMode({
      configPath,
      env: deps.env,
    });
    const unsetPaths = resolveManagedUnsetPathsForWrite(options.unsetPaths);
    let persistCandidate = cfg;
    const snapshotRead = options.baseSnapshot
      ? {
          snapshot: options.baseSnapshot,
          pluginMetadataSnapshot: options.basePluginMetadataSnapshot,
        }
      : await readConfigFileSnapshotInternal();
    const snapshot = snapshotRead.snapshot;
    if (options.baseSnapshot) assertBaseSnapshotStillCurrent(snapshot, configPath, deps.fs);
    let envRefMap = null;
    let changedPaths = null;
    const identityRestoredPaths = /* @__PURE__ */ new Set();
    const hasAuthoredIncludes = containsConfigIncludeDirective(snapshot.parsed);
    const hasResolvedAuthoredIncludes =
      hasAuthoredIncludes && !containsConfigIncludeDirective(snapshot.sourceConfig);
    if (snapshot.valid && snapshot.exists)
      persistCandidate = resolvePersistCandidateForWrite({
        runtimeConfig: snapshot.config,
        sourceConfig: snapshot.resolved,
        nextConfig: cfg,
        rootAuthoredConfig: snapshot.parsed,
        unsetPaths,
        explicitSetPaths: options.explicitSetPaths,
        explicitSetValueSource: options.explicitSetValueSource,
        modelIdNormalizationPolicies: snapshotRead.pluginMetadataSnapshot
          ? collectManifestModelIdNormalizationPolicies(snapshotRead.pluginMetadataSnapshot.plugins)
          : void 0,
      });
    else if (snapshot.exists && hasAuthoredIncludes)
      persistCandidate = preserveIncludeOwnedConfigForWrite({
        runtimeConfig: snapshot.config,
        sourceConfig: snapshot.resolved,
        nextConfig: cfg,
        rootAuthoredConfig: snapshot.parsed,
      });
    if (snapshot.exists && (snapshot.valid || hasResolvedAuthoredIncludes))
      try {
        const resolvedIncludes = resolveConfigIncludes(
          snapshot.parsed,
          configPath,
          {
            readFile: (candidate) => deps.fs.readFileSync(candidate, "utf-8"),
            readFileWithGuards: ({ includePath, resolvedPath, rootRealDir }) =>
              readConfigIncludeFileWithGuards({
                includePath,
                resolvedPath,
                rootRealDir,
                ioFs: deps.fs,
              }),
            parseJson: (raw) => deps.json5.parse(raw),
          },
          { allowedRoots: resolveIncludeRoots(deps.env, deps.homedir) },
        );
        const collected = /* @__PURE__ */ new Map();
        collectEnvRefPaths(resolvedIncludes, "", collected);
        if (collected.size > 0) {
          envRefMap = collected;
          changedPaths = /* @__PURE__ */ new Set();
          collectChangedPaths(snapshot.config, cfg, "", changedPaths);
        }
      } catch {
        envRefMap = null;
      }
    persistCandidate = applyUnsetPathsForWrite(persistCandidate, unsetPaths);
    const envForRestore = options.envSnapshotForRestore ?? deps.env;
    const validationSourceCandidate = containsConfigIncludeDirective(persistCandidate)
      ? restoreEnvVarRefs(persistCandidate, snapshot.parsed, envForRestore)
      : persistCandidate;
    const validated = validateConfigObjectRawWithPlugins(
      containsConfigIncludeDirective(validationSourceCandidate)
        ? resolveRuntimePreflightSourceConfig(validationSourceCandidate)
        : validationSourceCandidate,
      {
        env: deps.env,
        pluginValidation: options.skipPluginValidation ? "skip" : "full",
        preservedLegacyRootKeys: options.preservedLegacyRootKeys,
      },
    );
    if (!validated.ok) {
      const issue = validated.issues[0];
      const pathLabel = issue?.path ? issue.path : "<root>";
      const issueMessage = issue?.message ?? "invalid";
      throw new Error(formatConfigValidationFailure(pathLabel, issueMessage));
    }
    const previousWarningFingerprint = loggedConfigWarningFingerprints.get(configPath);
    let cfgToWrite = persistCandidate;
    try {
      if (deps.fs.existsSync(configPath)) {
        const parsedRes = parseConfigJson5(
          await deps.fs.promises.readFile(configPath, "utf-8"),
          deps.json5,
        );
        if (parsedRes.ok) {
          const configBeforeIdentityRestore = cfgToWrite;
          cfgToWrite = restoreEnvVarRefs(cfgToWrite, parsedRes.parsed, envForRestore);
          collectChangedPaths(configBeforeIdentityRestore, cfgToWrite, "", identityRestoredPaths);
        }
      }
    } catch (error) {
      if (error instanceof EnvRefArrayMutationError) throw error;
    }
    const dir = path.dirname(configPath);
    await deps.fs.promises.mkdir(dir, {
      recursive: true,
      mode: 448,
    });
    await tightenStateDirPermissionsIfNeeded({
      configPath,
      env: deps.env,
      homedir: deps.homedir,
      fsModule: deps.fs,
    });
    const stampedOutputConfig = stampConfigVersion(
      applyUnsetPathsForWrite(
        restoreAuthoredTildePathsForWrite(
          envRefMap && changedPaths
            ? restoreEnvRefsFromMap(cfgToWrite, "", envRefMap, changedPaths, identityRestoredPaths)
            : cfgToWrite,
          snapshot.parsed,
          void 0,
          deps.homedir(),
        ),
        unsetPaths,
      ),
      options.lastTouchedVersionOverride,
    );
    const json = JSON.stringify(stampedOutputConfig, null, 2).trimEnd().concat("\n");
    const nextHash = hashConfigRaw(json);
    const previousHash = resolveConfigSnapshotHash(snapshot);
    const changedPathCount = changedPaths?.size;
    const previousBytes =
      typeof snapshot.raw === "string" ? Buffer.byteLength(snapshot.raw, "utf-8") : null;
    const sizeBaselineBytes = resolveConfigSizeBaselineBytes({
      raw: snapshot.raw,
      json5: deps.json5,
      lastTouchedVersionOverride: options.lastTouchedVersionOverride,
    });
    const nextBytes = Buffer.byteLength(json, "utf-8");
    const previousStat = snapshot.exists
      ? await deps.fs.promises.stat(configPath).catch(() => null)
      : null;
    const hasMetaBefore = hasConfigMeta(snapshot.parsed);
    const hasMetaAfter = hasConfigMeta(stampedOutputConfig);
    const gatewayModeBefore = resolveGatewayMode(snapshot.resolved);
    const gatewayModeAfter = resolveGatewayMode(stampedOutputConfig);
    const suspiciousReasons = resolveConfigWriteSuspiciousReasons({
      existsBefore: snapshot.exists,
      unreadableBefore: snapshot.readError != null,
      sizeBaselineBytes,
      nextBytes,
      hasMetaBefore,
      gatewayModeBefore,
      gatewayModeAfter,
    });
    const logConfigOverwrite = () => {
      if (!snapshot.exists) return;
      if (options.skipOutputLogs) return;
      const isVitest = deps.env.VITEST === "true";
      const shouldLogInVitest = deps.env.OPENCLAW_TEST_CONFIG_OVERWRITE_LOG === "1";
      if (isVitest && !shouldLogInVitest) return;
      if (!isVerbose() && deps.env.OPENCLAW_CONFIG_OVERWRITE_LOG !== "1" && !shouldLogInVitest)
        return;
      deps.logger.warn(
        formatConfigOverwriteLogMessage({
          configPath,
          previousHash: previousHash ?? null,
          nextHash,
          changedPathCount,
        }),
      );
    };
    const logConfigWriteAnomalies = () => {
      if (suspiciousReasons.length === 0) return;
      if (options.skipOutputLogs) return;
      const isVitest = deps.env.VITEST === "true";
      const shouldLogInVitest = deps.env.OPENCLAW_TEST_CONFIG_WRITE_ANOMALY_LOG === "1";
      if (isVitest && !shouldLogInVitest) return;
      const visibleReasons =
        isVerbose() || deps.env.OPENCLAW_CONFIG_WRITE_ANOMALY_LOG === "1" || shouldLogInVitest
          ? suspiciousReasons
          : suspiciousReasons.filter((reason) => reason !== "missing-meta-before-write");
      if (visibleReasons.length === 0) return;
      deps.logger.warn(`Config write anomaly: ${configPath} (${visibleReasons.join(", ")})`);
    };
    const previousMetadata = resolveConfigStatMetadata(previousStat);
    const auditRecordBase = createConfigWriteAuditRecordBase({
      configPath,
      env: deps.env,
      existsBefore: snapshot.exists,
      previousHash: previousHash ?? null,
      nextHash,
      previousBytes,
      nextBytes,
      previousMetadata,
      changedPathCount,
      hasMetaBefore,
      hasMetaAfter,
      gatewayModeBefore,
      gatewayModeAfter,
      suspicious: suspiciousReasons,
    });
    const appendWriteAudit = async (result, err, nextStat) => {
      await appendConfigAuditRecord({
        fs: deps.fs,
        env: deps.env,
        homedir: deps.homedir,
        record: finalizeConfigWriteAuditRecord({
          base: auditRecordBase,
          result,
          err,
          nextMetadata: resolveConfigStatMetadata(nextStat ?? null),
        }),
      });
    };
    const blockingReasons = resolveConfigWriteBlockingReasons(suspiciousReasons, options);
    if (blockingReasons.length > 0 && options.allowDestructiveWrite !== true) {
      const rejectedPath = `${configPath}.rejected.${formatConfigArtifactTimestamp(/* @__PURE__ */ new Date().toISOString())}`;
      await deps.fs.promises
        .writeFile(rejectedPath, json, {
          encoding: "utf-8",
          mode: 384,
          flag: "wx",
        })
        .catch(() => {});
      const message = `Config write rejected: ${configPath} (${blockingReasons.join(", ")}). Rejected payload saved to ${rejectedPath}.`;
      const err = Object.assign(new Error(message), {
        code: "CONFIG_WRITE_REJECTED",
        rejectedPath,
        reasons: blockingReasons,
      });
      deps.logger.warn(message);
      await appendWriteAudit("rejected", err);
      throw err;
    }
    await (
      options.preCommitRuntimePreflight ??
      (async (sourceConfig) => {
        await preflightRuntimeSnapshotWrite({
          nextSourceConfig: sourceConfig,
          refreshOptions: options.runtimeRefresh,
          formatRefreshError: (error) => formatErrorMessage(error),
          createRefreshError: (detail, cause) =>
            new ConfigRuntimeRefreshError(
              `Config write blocked before committing ${configPath}: active SecretRef resolution failed: ${detail}`,
              { cause },
            ),
        });
      })
    )(resolveRuntimePreflightSourceConfig(stampedOutputConfig));
    const pluginInstallConfigMigration =
      ensureShippedPluginInstallConfigRecordsMigratedForWrite(snapshot);
    let configCommitted = false;
    try {
      const result = await replaceFileAtomic({
        filePath: configPath,
        content: json,
        dirMode: 448,
        mode: 384,
        tempPrefix: path.basename(configPath),
        copyFallbackOnPermissionError: true,
        fileSystem: deps.fs,
        beforeRename: async () => {
          options.assertConfigPathForWrite?.();
          if (options.baseSnapshot) assertBaseSnapshotStillCurrent(snapshot, configPath, deps.fs);
          if (deps.fs.existsSync(configPath))
            await maintainConfigBackups(configPath, deps.fs.promises);
          if (options.baseSnapshot) assertBaseSnapshotStillCurrent(snapshot, configPath, deps.fs);
          options.assertConfigPathForWrite?.();
        },
      });
      configCommitted = true;
      try {
        options.assertConfigPathForWrite?.();
      } catch (error) {
        try {
          if (
            await rollbackConfigFileWriteIfUnchanged({
              configPath,
              previousSnapshot: snapshot,
              committedHash: nextHash,
              fsModule: deps.fs,
            })
          )
            rollbackShippedPluginInstallConfigWriteMigration(pluginInstallConfigMigration);
        } catch (rollbackError) {
          throw new ConfigRuntimeRefreshError(
            `${formatErrorMessage(error)} Rollback failed: ${formatErrorMessage(rollbackError)}`,
            { cause: error },
          );
        }
        throw error;
      }
      logConfigOverwrite();
      logConfigWriteAnomalies();
      await appendWriteAudit(
        result.method,
        void 0,
        await deps.fs.promises.stat(configPath).catch(() => null),
      );
      if (!options.skipPluginValidation)
        logConfigWarningsOnce({
          configPath,
          warnings: validated.warnings,
          logger: deps.logger,
        });
      return {
        persistedHash: nextHash,
        persistedConfig: stampedOutputConfig,
        ...(pluginInstallConfigMigration.migrated || !options.skipPluginValidation
          ? {
              [configWritePostCommitRollback]: () => {
                rollbackShippedPluginInstallConfigWriteMigration(pluginInstallConfigMigration);
                if (previousWarningFingerprint === void 0)
                  loggedConfigWarningFingerprints.delete(configPath);
                else loggedConfigWarningFingerprints.set(configPath, previousWarningFingerprint);
              },
            }
          : {}),
      };
    } catch (err) {
      if (!configCommitted)
        rollbackShippedPluginInstallConfigWriteMigration(pluginInstallConfigMigration);
      await appendWriteAudit("failed", err);
      throw err;
    }
  }
  return {
    configPath,
    env: deps.env,
    loadConfig: loadConfigLocal,
    readBestEffortConfig: readBestEffortConfigLocal,
    readBestEffortConfigSnapshot: readBestEffortConfigSnapshotLocal,
    readSourceConfigBestEffort: readSourceConfigBestEffortLocal,
    readConfigFileSnapshot: readConfigFileSnapshotLocal,
    readConfigFileSnapshotWithPluginMetadata: readConfigFileSnapshotWithPluginMetadataLocal,
    readConfigFileSnapshotForWrite: readConfigFileSnapshotForWriteLocal,
    promoteConfigSnapshotToLastKnownGood: promoteConfigSnapshotToLastKnownGoodLocal,
    recoverConfigFromLastKnownGood: recoverConfigFromLastKnownGoodLocal,
    recoverConfigFromJsonRootSuffix: recoverConfigFromJsonRootSuffixLocal,
    writeConfigFile: writeConfigFileLocal,
  };
}
const AUTO_OWNER_DISPLAY_SECRET_BY_PATH = /* @__PURE__ */ new Map();
function clearConfigCache() {}
function registerConfigWriteListener(listener, options = {}) {
  const unregisterOwner = options.ownsRuntimeActivationFor
    ? registerManagedRuntimeConfigWriteOwner(
        options.ownsRuntimeActivationFor,
        options.preCommitRuntimePreflight,
      )
    : void 0;
  const unregisterListener = registerRuntimeConfigWriteListener((event) => {
    const {
      preparedCandidate: _preparedCandidate,
      preparedCandidatesByOwner: _preparedCandidatesByOwner,
      ...baseEvent
    } = event;
    const preparedCandidate = unregisterOwner
      ? event.preparedCandidatesByOwner?.get(unregisterOwner.ownerId)
      : void 0;
    listener({
      ...baseEvent,
      ...(preparedCandidate ? { preparedCandidate } : {}),
    });
  });
  return () => {
    unregisterListener();
    unregisterOwner?.();
  };
}
function loadConfig(options) {
  const loadFresh = () =>
    createConfigIO({
      ...(options?.skipPluginValidation ? { pluginValidation: "skip" } : {}),
      ...(options?.skipShellEnvFallback ? { shellEnvFallback: "defer" } : {}),
    }).loadConfig();
  if (options?.pin === false) return loadFresh();
  return loadPinnedRuntimeConfig(loadFresh);
}
function getRuntimeConfig(options) {
  return loadConfig(options);
}
async function readBestEffortConfig(options) {
  return await createConfigIO({
    ...(options?.isolateEnv ? { env: cloneEnvWithPlatformSemantics(process.env) } : {}),
    ...(options?.observe === false ? { observe: false } : {}),
    ...(options?.skipPluginValidation ? { pluginValidation: "skip" } : {}),
  }).readBestEffortConfig();
}
async function readBestEffortConfigSnapshot(options) {
  return await createConfigIO({
    ...(options?.observe === false ? { observe: false } : {}),
    ...(options?.skipPluginValidation ? { pluginValidation: "skip" } : {}),
  }).readBestEffortConfigSnapshot();
}
async function readSourceConfigBestEffort() {
  return await createConfigIO().readSourceConfigBestEffort();
}
async function readConfigFileSnapshot(options = {}) {
  return await createConfigIO({
    ...(options.measure ? { measure: options.measure } : {}),
    ...(options.observe === false ? { observe: false } : {}),
    ...(options.isolateEnv ? { env: cloneEnvWithPlatformSemantics(process.env) } : {}),
    ...(options.lowerPrecedenceEnv ? { lowerPrecedenceEnv: options.lowerPrecedenceEnv } : {}),
    ...(options.skipPluginValidation ? { pluginValidation: "skip" } : {}),
    ...(options.suppressFutureVersionWarning ? { suppressFutureVersionWarning: true } : {}),
    ...(options.preservedLegacyRootKeys
      ? { preservedLegacyRootKeys: options.preservedLegacyRootKeys }
      : {}),
  }).readConfigFileSnapshot({
    recoverSuspicious: options.recoverSuspicious === true,
    allowSuspiciousRecovery: options.allowSuspiciousRecovery,
  });
}
async function readConfigFileSnapshotWithPluginMetadata(options) {
  return await createConfigIO({
    ...(options?.measure ? { measure: options.measure } : {}),
    ...(options?.observe === false ? { observe: false } : {}),
    ...(options?.isolateEnv ? { env: cloneEnvWithPlatformSemantics(process.env) } : {}),
    ...(options?.lowerPrecedenceEnv ? { lowerPrecedenceEnv: options.lowerPrecedenceEnv } : {}),
  }).readConfigFileSnapshotWithPluginMetadata({
    recoverSuspicious: options?.recoverSuspicious === true,
    allowSuspiciousRecovery: options?.allowSuspiciousRecovery,
  });
}
async function promoteConfigSnapshotToLastKnownGood(snapshot) {
  return await createConfigIO().promoteConfigSnapshotToLastKnownGood(snapshot);
}
async function recoverConfigFromLastKnownGood(params) {
  return await createConfigIO().recoverConfigFromLastKnownGood(params);
}
async function recoverConfigFromJsonRootSuffix(snapshot) {
  return await createConfigIO().recoverConfigFromJsonRootSuffix(snapshot);
}
async function readSourceConfigSnapshot() {
  return await readConfigFileSnapshot();
}
/** Reads a reload candidate against the accepted runtime env layer in isolation. */
async function readConfigFileSnapshotForRuntimeTransaction(activeSourceConfig) {
  return await createConfigIO({
    env: createConfigRuntimeEnvBase(activeSourceConfig, process.env, {
      preservedKeys: GATEWAY_CONFIG_SELECTION_ENV_KEYS,
    }),
  }).readConfigFileSnapshot();
}
async function readConfigFileSnapshotForWrite(options) {
  const readOptions = options?.skipPluginValidation ? { pluginValidation: "skip" } : {};
  for (let attempt = 0; attempt < 3; attempt += 1)
    try {
      const processIo = createConfigIO(readOptions);
      const result = await (
        hasManagedRuntimeConfigWriteOwner(processIo.configPath)
          ? createConfigIO({
              ...readOptions,
              env: createManagedRuntimeEnvBase(),
            })
          : processIo
      ).readConfigFileSnapshotForWrite();
      result.writeOptions.assertConfigPathForWrite?.();
      return result;
    } catch (error) {
      if (!(error instanceof ConfigMutationConflictError) || error.retryable || attempt === 2)
        throw error;
    }
  throw new Error("unreachable");
}
async function readSourceConfigSnapshotForWrite() {
  return await readConfigFileSnapshotForWrite();
}
async function writeConfigFile(cfg, options = {}) {
  options.assertConfigPathForWrite?.();
  const ioOptions = {
    ...(options.ownedConfigPathForWrite ? { configPath: options.ownedConfigPathForWrite } : {}),
    ...(options.skipPluginValidation ? { pluginValidation: "skip" } : {}),
    ...(options.preservedLegacyRootKeys
      ? { preservedLegacyRootKeys: options.preservedLegacyRootKeys }
      : {}),
  };
  const processIo = createConfigIO(ioOptions);
  const deferRuntimeActivation = hasManagedRuntimeConfigWriteOwner(processIo.configPath);
  const io = deferRuntimeActivation
    ? createConfigIO({
        ...ioOptions,
        env: createManagedRuntimeEnvBase(),
      })
    : processIo;
  assertConfigWriteAllowedInCurrentMode({ configPath: io.configPath });
  let nextCfg = cfg;
  const runtimeConfigSnapshot = getRuntimeConfigSnapshot();
  const runtimeConfigSourceSnapshot = getRuntimeConfigSourceSnapshot();
  const hadRuntimeSnapshot = Boolean(runtimeConfigSnapshot);
  const hadBothSnapshots = Boolean(runtimeConfigSnapshot && runtimeConfigSourceSnapshot);
  if (hadBothSnapshots)
    nextCfg = coerceConfig(
      applyMergePatch(runtimeConfigSourceSnapshot, createMergePatch(runtimeConfigSnapshot, cfg)),
    );
  const baseSnapshotRead = options.baseSnapshot
    ? {
        snapshot: options.baseSnapshot,
        pluginMetadataSnapshot: options.basePluginMetadataSnapshot,
      }
    : await io.readConfigFileSnapshotWithPluginMetadata();
  const baseSnapshot = baseSnapshotRead.snapshot;
  if (deferRuntimeActivation) replaceEnvSnapshot(io.env, createManagedRuntimeEnvBase());
  let runtimePreflightResult;
  let managedPreparedCandidates = /* @__PURE__ */ new Map();
  const writeResult = await io.writeConfigFile(nextCfg, {
    baseSnapshot,
    basePluginMetadataSnapshot: baseSnapshotRead.pluginMetadataSnapshot,
    assertConfigPathForWrite: options.assertConfigPathForWrite,
    envSnapshotForRestore: resolveWriteEnvSnapshotForPath({
      actualConfigPath: io.configPath,
      expectedConfigPath: options.expectedConfigPath,
      envSnapshotForRestore: options.envSnapshotForRestore,
    }),
    unsetPaths: resolveManagedUnsetPathsForWrite(options.unsetPaths),
    explicitSetPaths: options.explicitSetPaths,
    explicitSetValueSource: options.explicitSetPaths
      ? (options.explicitSetValueSource ?? cfg)
      : void 0,
    afterWrite: options.afterWrite,
    allowDestructiveWrite: options.allowDestructiveWrite,
    allowConfigSizeDrop: options.allowConfigSizeDrop,
    skipRuntimeSnapshotRefresh: options.skipRuntimeSnapshotRefresh,
    skipOutputLogs: options.skipOutputLogs,
    skipPluginValidation: options.skipPluginValidation,
    preservedLegacyRootKeys: options.preservedLegacyRootKeys,
    lastTouchedVersionOverride: options.lastTouchedVersionOverride,
    preCommitRuntimePreflight: async (sourceConfig) => {
      if (deferRuntimeActivation)
        managedPreparedCandidates = await preflightManagedRuntimeConfigWrite(
          io.configPath,
          sourceConfig,
          options.runtimeRefresh,
        );
      else
        runtimePreflightResult = await preflightRuntimeSnapshotWrite({
          nextSourceConfig: sourceConfig,
          refreshOptions: options.runtimeRefresh,
          formatRefreshError: (error) => formatErrorMessage(error),
          createRefreshError: (detail, cause) =>
            new ConfigRuntimeRefreshError(
              `Config write blocked before committing ${io.configPath}: active SecretRef resolution failed: ${detail}`,
              { cause },
            ),
        });
      await options.preCommitRuntimePreflight?.(sourceConfig);
    },
  });
  if (
    options.skipRuntimeSnapshotRefresh &&
    !hadRuntimeSnapshot &&
    !getRuntimeConfigSnapshotRefreshHandler()
  )
    return writeResult;
  if (deferRuntimeActivation) replaceEnvSnapshot(io.env, createManagedRuntimeEnvBase());
  let canonicalSourceConfig = nextCfg;
  let canonicalRuntimeConfig = nextCfg;
  let envBeforeCanonicalRead = snapshotEnv(io.env);
  let envAfterCanonicalRead;
  let canonicalReadFailure = null;
  try {
    let stableEnvGeneration = !deferRuntimeActivation;
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const baseline = resolveManagedRuntimeEnvBaseline();
      if (deferRuntimeActivation) {
        replaceEnvSnapshot(
          io.env,
          createConfigRuntimeEnvBase(baseline.sourceConfig, process.env, {
            preservedKeys: GATEWAY_CONFIG_SELECTION_ENV_KEYS,
          }),
        );
        envBeforeCanonicalRead = snapshotEnv(io.env);
      }
      const freshSnapshot = await io.readConfigFileSnapshot();
      if (freshSnapshot.exists && freshSnapshot.valid) {
        canonicalSourceConfig = freshSnapshot.sourceConfig;
        canonicalRuntimeConfig = freshSnapshot.config;
      }
      if (
        !deferRuntimeActivation ||
        getPublishedConfigRuntimeEnvState().generation === baseline.generation
      ) {
        stableEnvGeneration = true;
        break;
      }
    }
    if (!stableEnvGeneration)
      canonicalReadFailure = new ConfigRuntimeRefreshError(
        `Config was written to ${io.configPath}, but the active config environment changed during every canonical reread`,
      );
  } catch (error) {
    canonicalReadFailure = new ConfigRuntimeRefreshError(
      `Config was written to ${io.configPath}, but the canonical reread failed: ${formatErrorMessage(error)}`,
      { cause: error },
    );
  } finally {
    envAfterCanonicalRead = snapshotEnv(io.env);
  }
  const notifyCommittedWrite = () => {
    const currentRuntimeConfig = getRuntimeConfigSnapshot();
    const notificationRuntimeConfig = deferRuntimeActivation
      ? canonicalRuntimeConfig
      : currentRuntimeConfig;
    if (!notificationRuntimeConfig) return;
    const notificationPreparedCandidates = new Map(
      [...managedPreparedCandidates].map(([ownerId, candidate]) => [
        ownerId,
        {
          ...candidate,
          runtimeConfig:
            candidate.reapplyRuntimeOverlays?.(canonicalRuntimeConfig) ?? candidate.runtimeConfig,
          compareConfig:
            candidate.reapplyCompareOverlays?.(canonicalSourceConfig) ?? candidate.compareConfig,
        },
      ]),
    );
    notifyRuntimeConfigWriteListeners(
      createRuntimeConfigWriteNotification({
        configPath: io.configPath,
        sourceConfig: canonicalSourceConfig,
        runtimeConfig: notificationRuntimeConfig,
        persistedHash: writeResult.persistedHash,
        afterWrite: options.afterWrite,
        runtimeRefresh: options.runtimeRefresh,
        ...(notificationPreparedCandidates.size > 0
          ? { preparedCandidatesByOwner: notificationPreparedCandidates }
          : {}),
      }),
    );
  };
  try {
    if (canonicalReadFailure) throw canonicalReadFailure;
    options.assertConfigPathForWrite?.();
    await finalizeRuntimeSnapshotWrite({
      nextSourceConfig: canonicalSourceConfig,
      refreshOptions: options.runtimeRefresh,
      hadRuntimeSnapshot,
      hadBothSnapshots,
      loadFreshConfig: () => io.loadConfig(),
      notifyCommittedWrite,
      formatRefreshError: (error) => formatErrorMessage(error),
      preflightResult: runtimePreflightResult,
      deferRuntimeActivation,
      createRefreshError: (detail, cause) =>
        new ConfigRuntimeRefreshError(
          `Config was written to ${io.configPath}, but runtime snapshot refresh failed: ${detail}`,
          { cause },
        ),
    });
  } catch (error) {
    try {
      if (
        await rollbackConfigFileWriteIfUnchanged({
          configPath: io.configPath,
          previousSnapshot: baseSnapshot,
          committedHash: writeResult.persistedHash,
          fsModule: fs,
        })
      ) {
        restoreEnvChangesIfUnchanged({
          env: io.env,
          before: envBeforeCanonicalRead,
          after: envAfterCanonicalRead,
        });
        writeResult[configWritePostCommitRollback]?.();
      }
    } catch (rollbackError) {
      throw new ConfigRuntimeRefreshError(
        `${formatErrorMessage(error)} Rollback failed: ${formatErrorMessage(rollbackError)}`,
        { cause: error },
      );
    }
    throw error;
  }
  return {
    ...writeResult,
    persistedConfig: canonicalSourceConfig,
  };
}
//#endregion
export {
  AUTO_MANAGED_CONFIG_META_PATHS as $,
  projectConfigOntoRuntimeSourceSnapshot as A,
  DEFAULT_MODEL_ALIASES as B,
  collectUnsupportedSecretRefPolicyIssues as C,
  validateConfigObjectWithPlugins as D,
  validateConfigObjectRawWithPlugins as E,
  setConfigOverride as F,
  resolveAgentMaxConcurrent as G,
  normalizeProviderConfigForConfigDefaults as H,
  unsetConfigOverride as I,
  collectChangedPaths as J,
  resolveSubagentMaxConcurrent as K,
  ConfigMutationConflictError as L,
  captureConfigOverrideApplier as M,
  getConfigOverrides as N,
  collectChannelSchemaMetadata as O,
  resetConfigOverrides as P,
  resolveWriteEnvSnapshotForPath as Q,
  asResolvedSourceConfig as R,
  writeConfigFile as S,
  validateConfigObjectRaw as T,
  resolveCronMaxConcurrentRuns as U,
  resolveNormalizedProviderModelMaxTokens as V,
  resolveCronTriggerMinIntervalMs as W,
  projectSourceOntoRuntimeShape as X,
  createMergePatch as Y,
  resolveManagedUnsetPathsForWrite as Z,
  recoverConfigFromJsonRootSuffix as _,
  loadConfig as a,
  resolveConfigSnapshotHash as b,
  readBestEffortConfig as c,
  readConfigFileSnapshotForRuntimeTransaction as d,
  restoreEnvVarRefs as et,
  readConfigFileSnapshotForWrite as f,
  readSourceConfigSnapshotForWrite as g,
  readSourceConfigSnapshot as h,
  getRuntimeConfig as i,
  applyConfigOverrides as j,
  collectPluginSchemaMetadata as k,
  readBestEffortConfigSnapshot as l,
  readSourceConfigBestEffort as m,
  clearConfigCache as n,
  maintainConfigBackups as nt,
  parseConfigJson5 as o,
  readConfigFileSnapshotWithPluginMetadata as p,
  applyUnsetPathsForWrite as q,
  createConfigIO as r,
  resolveOwnerDisplaySetting as rt,
  promoteConfigSnapshotToLastKnownGood as s,
  ConfigRuntimeRefreshError as t,
  createPreUpdateConfigSnapshot as tt,
  readConfigFileSnapshot as u,
  recoverConfigFromLastKnownGood as v,
  validateConfigObject as w,
  restoreEnvChangesIfUnchanged as x,
  registerConfigWriteListener as y,
  asRuntimeConfig as z,
};
