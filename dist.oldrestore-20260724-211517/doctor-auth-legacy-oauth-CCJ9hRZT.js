import { t as sanitizeForLog } from "./ansi-D4OHEz5F.js";
import { t as repairOAuthProfileIdMismatch } from "./repair-bhv6VYT3.js";
import { i as ensureAuthProfileStore } from "./store-B7DoDdVM.js";
//#region src/commands/doctor-auth-legacy-oauth.ts
/** Migrates legacy provider-declared OAuth profile ids to current auth profile ids. */
async function loadProviderRuntime() {
  return import("./providers.runtime.js");
}
async function loadNoteRuntime() {
  return import("./terminal-core/note.js");
}
function hasConfigOAuthProfiles(cfg) {
  return Object.values(cfg.auth?.profiles ?? {}).some((profile) => profile?.mode === "oauth");
}
function sanitizePromptLabel(label) {
  return (label ? sanitizeForLog(label).trim() : void 0) || void 0;
}
/**
 * Applies provider-declared OAuth profile id repairs to config after prompting.
 *
 * Providers own the legacy id mapping; doctor only loads setup-time provider metadata and asks
 * before writing config so stale provider-specific ids do not silently shadow current profiles.
 */
async function maybeRepairLegacyOAuthProfileIds(cfg, prompter) {
  if (!hasConfigOAuthProfiles(cfg)) return cfg;
  const store = ensureAuthProfileStore();
  if (Object.keys(store.profiles).length === 0) return cfg;
  let nextCfg = cfg;
  const { resolvePluginProviders } = await loadProviderRuntime();
  const providers = resolvePluginProviders({
    config: cfg,
    env: process.env,
    mode: "setup",
  });
  for (const provider of providers)
    for (const repairSpec of provider.oauthProfileIdRepairs ?? []) {
      const repair = repairOAuthProfileIdMismatch({
        cfg: nextCfg,
        store,
        provider: provider.id,
        legacyProfileId: repairSpec.legacyProfileId,
      });
      if (!repair.migrated || repair.changes.length === 0) continue;
      const { note } = await loadNoteRuntime();
      note(repair.changes.map((c) => `- ${c}`).join("\n"), "Auth profiles");
      const label =
        sanitizePromptLabel(repairSpec.promptLabel) ??
        sanitizePromptLabel(provider.label) ??
        provider.id;
      if (
        !(await prompter.confirm({
          message: `Update ${label} OAuth profile id in config now?`,
          initialValue: true,
        }))
      )
        continue;
      nextCfg = repair.config;
    }
  return nextCfg;
}
//#endregion
export { maybeRepairLegacyOAuthProfileIds };
