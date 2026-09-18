import {
  n as hasBinary,
  r as isConfigPathTruthyWithDefaults,
  t as evaluateRuntimeEligibility,
} from "./config-eval-BLzabchw.js";
import { i as resolveSkillKey } from "./frontmatter-DXeaZ3EN.js";
import { t as resolveSkillSource } from "./source-9Jdpd6BI.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
} from "./string-coerce-DW4mBlAt.js";
import { l as normalizeStringEntries } from "./string-normalization-CRyoFBPt.js";
//#region src/skills/loading/config.ts
const DEFAULT_CONFIG_VALUES = {
  "browser.enabled": true,
  "browser.evaluateEnabled": true,
};
function resolveSkillsInstallPreferences(config) {
  const raw = config?.skills?.install;
  const preferBrew = raw?.preferBrew ?? true;
  const manager = normalizeLowercaseStringOrEmpty(normalizeOptionalString(raw?.nodeManager));
  return {
    preferBrew,
    nodeManager:
      manager === "pnpm" || manager === "yarn" || manager === "bun" || manager === "npm"
        ? manager
        : "npm",
  };
}
function isSkillConfigPathTruthy(config, pathStr) {
  return isConfigPathTruthyWithDefaults(config, pathStr, DEFAULT_CONFIG_VALUES);
}
function resolveSkillConfig(config, skillKey) {
  const skills = config?.skills?.entries;
  if (!skills || typeof skills !== "object") return;
  const entry = skills[skillKey];
  if (!entry || typeof entry !== "object") return;
  return entry;
}
function normalizeAllowlist(input) {
  if (!input) return;
  if (!Array.isArray(input)) return;
  const normalized = normalizeStringEntries(input);
  return normalized.length > 0 ? new Set(normalized) : void 0;
}
const BUNDLED_SOURCES = /* @__PURE__ */ new Set(["openclaw-bundled"]);
function isBundledSkill(entry) {
  return BUNDLED_SOURCES.has(resolveSkillSource(entry.skill));
}
function resolveBundledAllowlist(config) {
  return normalizeAllowlist(config?.skills?.allowBundled);
}
function isBundledSkillAllowed(entry, allowlist) {
  if (!allowlist || allowlist.size === 0) return true;
  if (!isBundledSkill(entry)) return true;
  const key = resolveSkillKey(entry.skill, entry);
  return allowlist.has(key) || allowlist.has(entry.skill.name);
}
function shouldIncludeSkill(params) {
  const { entry, config, bundledAllowlist, eligibility } = params;
  const skillConfig = resolveSkillConfig(config, resolveSkillKey(entry.skill, entry));
  if (skillConfig?.enabled === false) return false;
  if (!isBundledSkillAllowed(entry, bundledAllowlist)) return false;
  return evaluateRuntimeEligibility({
    os: entry.metadata?.os,
    remotePlatforms: eligibility?.remote?.platforms,
    always: entry.metadata?.always,
    requires: entry.metadata?.requires,
    hasBin: hasBinary,
    hasRemoteBin: eligibility?.remote?.hasBin,
    hasAnyRemoteBin: eligibility?.remote?.hasAnyBin,
    hasEnv: (envName) =>
      Boolean(
        process.env[envName] ||
        skillConfig?.env?.[envName] ||
        (skillConfig?.apiKey && entry.metadata?.primaryEnv === envName),
      ),
    isConfigPathTruthy: (configPath) => isSkillConfigPathTruthy(config, configPath),
  });
}
//#endregion
export {
  resolveSkillsInstallPreferences as a,
  resolveSkillConfig as i,
  isSkillConfigPathTruthy as n,
  shouldIncludeSkill as o,
  resolveBundledAllowlist as r,
  isBundledSkillAllowed as t,
};
