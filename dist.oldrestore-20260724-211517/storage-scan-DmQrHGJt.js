import fs from "node:fs";
import path from "node:path";
import { a as resolveAgentDir, n as listAgentIds } from "./agent-scope-config-DVIR1nBa.js";
import "./utils-DtcDeqWS.js";
import "./agent-scope-y9xQv_q1.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import { r as createConfigIO } from "./io-B3ne6NxF.js";
import "./target-registry-Db69vEew.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import "./config-BDv-QbJ6.js";
import { n as isNonEmptyString, o as parseEnvValue } from "./shared-CrrsbqCi.js";
import { o as listAuthProfileSecretTargetEntries } from "./target-registry-query-CH3KJb3I.js";
//#region src/secrets/auth-profiles-scan.ts
/** Scans auth-profile stores for plaintext credentials, SecretRefs, and OAuth tokens. */
function getAuthProfileFieldName(pathPattern) {
  const segments = pathPattern.split(".").filter(Boolean);
  return segments[segments.length - 1] ?? "";
}
const AUTH_PROFILE_FIELD_SPEC_BY_TYPE = (() => {
  const defaults = {
    api_key: {
      valueField: "key",
      refField: "keyRef",
    },
    token: {
      valueField: "token",
      refField: "tokenRef",
    },
  };
  for (const target of listAuthProfileSecretTargetEntries()) {
    if (!target.authProfileType) continue;
    defaults[target.authProfileType] = {
      valueField: getAuthProfileFieldName(target.pathPattern),
      refField:
        target.refPathPattern !== void 0
          ? getAuthProfileFieldName(target.refPathPattern)
          : defaults[target.authProfileType].refField,
    };
  }
  return defaults;
})();
/** Returns the value/ref field names for one auth-profile credential type. */
function getAuthProfileFieldSpec(type) {
  return AUTH_PROFILE_FIELD_SPEC_BY_TYPE[type];
}
function toSecretCredentialVisit(params) {
  const spec = getAuthProfileFieldSpec(params.kind);
  return {
    kind: params.kind,
    profileId: params.profileId,
    provider: params.provider,
    profile: params.profile,
    valueField: spec.valueField,
    refField: spec.refField,
    value: params.profile[spec.valueField],
    refValue: params.profile[spec.refField],
  };
}
/** Iterates credential-bearing auth profiles with normalized field metadata for audit/apply. */
function* iterateAuthProfileCredentials(profiles) {
  for (const [profileId, value] of Object.entries(profiles)) {
    if (!isRecord(value) || !isNonEmptyString(value.provider)) continue;
    const provider = value.provider;
    if (value.type === "api_key" || value.type === "token") {
      yield toSecretCredentialVisit({
        kind: value.type,
        profileId,
        provider,
        profile: value,
      });
      continue;
    }
    if (value.type === "oauth")
      yield {
        kind: "oauth",
        profileId,
        provider,
        profile: value,
        hasAccess: isNonEmptyString(value.access),
        hasRefresh: isNonEmptyString(value.refresh),
      };
  }
}
//#endregion
//#region src/secrets/config-io.ts
/** Config IO adapter used by secrets apply/configure flows. */
const silentConfigIoLogger = {
  error: () => {},
  warn: () => {},
};
/**
 * Creates config I/O for secrets commands with config-loader logging suppressed.
 */
function createSecretsConfigIO(params) {
  return createConfigIO({
    env: params.env,
    logger: silentConfigIoLogger,
  });
}
//#endregion
//#region src/secrets/auth-store-paths.ts
/** Discovers auth-profile store paths that may contain secret refs. */
/**
 * Lists deduplicated auth-profile store agent dirs that may contain SecretRefs.
 * Covers implicit main, discovered state-dir agents, and config-declared agent dirs.
 */
function listAuthProfileStoreAgentDirs$1(config, stateDir) {
  const paths = /* @__PURE__ */ new Set();
  paths.add(path.join(resolveUserPath(stateDir), "agents", "main", "agent"));
  const agentsRoot = path.join(resolveUserPath(stateDir), "agents");
  if (fs.existsSync(agentsRoot))
    for (const entry of fs.readdirSync(agentsRoot, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      paths.add(path.join(agentsRoot, entry.name, "agent"));
    }
  for (const agentId of listAgentIds(config)) {
    if (agentId === "main") {
      paths.add(path.join(resolveUserPath(stateDir), "agents", "main", "agent"));
      continue;
    }
    const agentDir = resolveAgentDir(config, agentId);
    paths.add(resolveUserPath(agentDir));
  }
  return [...paths];
}
//#endregion
//#region src/secrets/storage-scan.ts
/** Filesystem discovery and bounded JSON readers for local secret storage audits. */
/** Parses one .env assignment value using the shared shell-ish env parser. */
function parseEnvAssignmentValue(raw) {
  return parseEnvValue(raw);
}
/** Lists agent directories that own canonical auth-profile stores. */
function listAuthProfileStoreAgentDirs(config, stateDir) {
  return listAuthProfileStoreAgentDirs$1(config, stateDir);
}
/** Lists legacy per-agent auth.json stores that can contain static credentials. */
function listLegacyAuthJsonPaths(stateDir) {
  const out = [];
  const agentsRoot = path.join(resolveUserPath(stateDir), "agents");
  if (!fs.existsSync(agentsRoot)) return out;
  for (const entry of fs.readdirSync(agentsRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const candidate = path.join(agentsRoot, entry.name, "agent", "auth.json");
    if (fs.existsSync(candidate)) out.push(candidate);
  }
  return out;
}
function resolveActiveAgentDir(stateDir, env = process.env) {
  const override = env.OPENCLAW_AGENT_DIR?.trim() || env.PI_CODING_AGENT_DIR?.trim();
  if (override) return resolveUserPath(override, env);
  return path.join(resolveUserPath(stateDir), "agents", "main", "agent");
}
/**
 * Lists deduplicated models.json paths that may contain materialized provider credentials.
 * Includes active env override, implicit main agent, discovered state dirs, and configured agents.
 */
function listAgentModelsJsonPaths(config, stateDir, env = process.env) {
  const resolvedStateDir = resolveUserPath(stateDir);
  const paths = /* @__PURE__ */ new Set();
  paths.add(path.join(resolvedStateDir, "agents", "main", "agent", "models.json"));
  paths.add(path.join(resolveActiveAgentDir(stateDir, env), "models.json"));
  const agentsRoot = path.join(resolvedStateDir, "agents");
  if (fs.existsSync(agentsRoot))
    for (const entry of fs.readdirSync(agentsRoot, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      paths.add(path.join(agentsRoot, entry.name, "agent", "models.json"));
    }
  for (const agentId of listAgentIds(config)) {
    if (agentId === "main") {
      paths.add(path.join(resolvedStateDir, "agents", "main", "agent", "models.json"));
      continue;
    }
    const agentDir = resolveAgentDir(config, agentId);
    paths.add(path.join(resolveUserPath(agentDir), "models.json"));
  }
  return [...paths];
}
function readJsonObjectIfExists(filePath, options = {}) {
  if (!fs.existsSync(filePath)) return { value: null };
  try {
    const stats = fs.statSync(filePath);
    if (options.requireRegularFile && !stats.isFile())
      return {
        value: null,
        error: `Refusing to read non-regular file: ${filePath}`,
      };
    if (
      typeof options.maxBytes === "number" &&
      Number.isFinite(options.maxBytes) &&
      options.maxBytes >= 0 &&
      stats.size > options.maxBytes
    )
      return {
        value: null,
        error: `Refusing to read oversized JSON (${stats.size} bytes): ${filePath}`,
      };
    const raw = fs.readFileSync(filePath, "utf8");
    const parsed = JSON.parse(raw);
    if (!isRecord(parsed)) return { value: null };
    return { value: parsed };
  } catch (err) {
    return {
      value: null,
      error: formatErrorMessage(err),
    };
  }
}
//#endregion
export {
  readJsonObjectIfExists as a,
  parseEnvAssignmentValue as i,
  listAuthProfileStoreAgentDirs as n,
  createSecretsConfigIO as o,
  listLegacyAuthJsonPaths as r,
  iterateAuthProfileCredentials as s,
  listAgentModelsJsonPaths as t,
};
