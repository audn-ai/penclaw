import { i as getRuntimeConfigSnapshot } from "./runtime-snapshot-BbbqRiDR.js";
import { s as coerceSecretRef } from "./types.secrets-BV0ywRAy.js";
//#region src/skills/loading/runtime-config.ts
function hasConfiguredSkillApiKeyRef(config) {
  const entries = config?.skills?.entries;
  if (!entries || typeof entries !== "object") return false;
  for (const skillConfig of Object.values(entries)) {
    if (!skillConfig || typeof skillConfig !== "object") continue;
    if (coerceSecretRef(skillConfig.apiKey) !== null) return true;
  }
  return false;
}
/** Chooses the runtime config snapshot unless it would hide skill secret refs. */
function resolveSkillRuntimeConfig(config) {
  const runtimeConfig = getRuntimeConfigSnapshot();
  if (!runtimeConfig) return config;
  if (!config) return runtimeConfig;
  const runtimeHasRawSkillSecretRefs = hasConfiguredSkillApiKeyRef(runtimeConfig);
  const configHasRawSkillSecretRefs = hasConfiguredSkillApiKeyRef(config);
  if (runtimeHasRawSkillSecretRefs && !configHasRawSkillSecretRefs) return config;
  return runtimeConfig;
}
//#endregion
export { resolveSkillRuntimeConfig as t };
