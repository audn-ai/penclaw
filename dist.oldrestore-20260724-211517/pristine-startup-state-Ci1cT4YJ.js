import fs from "node:fs";
import path from "node:path";
import { n as resolveEffectiveHomeDir } from "./home-dir-DxrrpDft.js";
import { c as tryReadJsonSync } from "./json-7OTJmMaB.js";
import "./json-files-CTWRDHag.js";
import {
  c as resolveConfigPath,
  h as resolveLegacyStateDirs,
  y as resolveStateDir,
} from "./paths-DEklnbzU.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import {
  r as inspectBundledPluginStartupMetadata,
  t as configMayRequireStartupPluginConvergence,
} from "./startup-plugin-convergence-plan-BHPkEe2Z.js";
//#region src/commands/doctor/shared/pristine-startup-state.ts
const STATEFUL_CONFIG_KEYS = /* @__PURE__ */ new Set([
  "accessGroups",
  "acp",
  "approvals",
  "audio",
  "bindings",
  "broadcast",
  "channels",
  "cloudWorkers",
  "commitments",
  "cron",
  "discovery",
  "env",
  "hooks",
  "marketplaces",
  "mcp",
  "media",
  "memory",
  "messages",
  "nodeHost",
  "proxy",
  "secrets",
  "session",
  "surfaces",
  "talk",
  "tools",
  "transcripts",
  "web",
]);
function containsObjectKey(value, targetKey) {
  if (Array.isArray(value)) return value.some((entry) => containsObjectKey(entry, targetKey));
  if (!isRecord(value)) return false;
  return (
    Object.hasOwn(value, targetKey) ||
    Object.values(value).some((entry) => containsObjectKey(entry, targetKey))
  );
}
function hasOnlyMigrationSafePluginEntries(config, env) {
  const plugins = config.plugins;
  if (!isRecord(plugins)) return plugins === void 0;
  if (Object.keys(plugins).some((key) => !["enabled", "entries", "allow", "deny"].includes(key)))
    return false;
  if (!isRecord(plugins.entries)) return plugins.entries === void 0;
  return Object.entries(plugins.entries).every(([pluginId, entry]) => {
    if (!isRecord(entry)) return false;
    if (entry.enabled === false) return true;
    if (entry.config !== void 0) return false;
    const metadata = inspectBundledPluginStartupMetadata({
      pluginId,
      env,
    });
    return Boolean(metadata && !metadata.hasDoctorContract);
  });
}
function configIsPristineCoreStateSafe(config) {
  if ([...STATEFUL_CONFIG_KEYS].some((key) => Object.hasOwn(config, key))) return false;
  if (containsObjectKey(config.agents, "memorySearch")) return false;
  return true;
}
/** Revalidates the authored config after startup recovery without rereading physical state. */
function planPristineStartupConfigMigrations(config, env = process.env) {
  if (!isRecord(config) || containsObjectKey(config, "$include"))
    return {
      skipAllStateMigrations: false,
      skipCoreStateMigrations: false,
    };
  const skipCoreStateMigrations = configIsPristineCoreStateSafe(config);
  return {
    skipAllStateMigrations: skipCoreStateMigrations && configIsPristineStateSafe(config, env),
    skipCoreStateMigrations,
  };
}
function configIsPristineStateSafe(config, env) {
  if (!configIsPristineCoreStateSafe(config)) return false;
  if (!hasOnlyMigrationSafePluginEntries(config, env)) return false;
  return !configMayRequireStartupPluginConvergence({
    config,
    env,
  });
}
function stateDirHasOnlyConfig(stateDir, configPath) {
  let entries;
  try {
    entries = fs.readdirSync(stateDir, { withFileTypes: true });
  } catch (error) {
    return error.code === "ENOENT";
  }
  const resolvedConfigPath = path.resolve(configPath);
  return entries.every((entry) => path.resolve(stateDir, entry.name) === resolvedConfigPath);
}
/**
 * A missing/empty state root plus migration-free bundled config has no legacy data to migrate.
 * Keep ambiguity on the full migration path; this shortcut only accepts a proven new install.
 */
function canSkipPristineStartupStateMigrations(env = process.env) {
  return planPristineStartupStateMigrations(env).skipAllStateMigrations;
}
/** Separates provably absent core state from plugin-owned migration work. */
function planPristineStartupStateMigrations(env = process.env) {
  const stateDir = resolveStateDir(env);
  const configPath = resolveConfigPath(env, stateDir);
  if (!stateDirHasOnlyConfig(stateDir, configPath))
    return {
      skipAllStateMigrations: false,
      skipCoreStateMigrations: false,
    };
  const homeDir = resolveEffectiveHomeDir(env);
  if (!homeDir)
    return {
      skipAllStateMigrations: false,
      skipCoreStateMigrations: false,
    };
  if (
    !resolveLegacyStateDirs(() => homeDir).every((legacyDir) => {
      if (path.resolve(legacyDir) === path.resolve(stateDir)) return false;
      return !fs.existsSync(legacyDir);
    })
  )
    return {
      skipAllStateMigrations: false,
      skipCoreStateMigrations: false,
    };
  const configPlan = planPristineStartupConfigMigrations(tryReadJsonSync(configPath), env);
  return {
    skipAllStateMigrations: configPlan.skipAllStateMigrations,
    skipCoreStateMigrations: configPlan.skipCoreStateMigrations,
  };
}
//#endregion
export {
  canSkipPristineStartupStateMigrations,
  planPristineStartupConfigMigrations,
  planPristineStartupStateMigrations,
};
