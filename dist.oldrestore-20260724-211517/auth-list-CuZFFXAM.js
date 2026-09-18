import { i as resolveAuthProfileDisplayLabel } from "./auth-profiles-CX7JDmZ9.js";
import { n as externalCliDiscoveryForProviderAuth } from "./external-cli-discovery-To6-j7MZ.js";
import { t as loadModelsConfig } from "./load-config--T40e-Wr.js";
import { P as timestampMsToIsoString } from "./number-coercion-CJQ8TR--.js";
import { n as resolveAuthStatePathForDisplay } from "./path-resolve-8wkj2l4Z.js";
import { r as resolveProviderIdForAuth } from "./provider-auth-aliases-RaEzqkSo.js";
import { i as writeRuntimeJson } from "./runtime-Bz6o617W.js";
import { u as resolveModelsTargetAgent } from "./shared-DFGOIlxJ.js";
import { i as ensureAuthProfileStore } from "./store-B7DoDdVM.js";
import { h as shortenHomePath } from "./utils-DtcDeqWS.js";
//#region src/commands/models/auth-list.ts
/** Command helpers for listing saved model auth profiles. */
function resolveProviderFilter(rawProvider) {
  const provider = rawProvider?.trim() ? resolveProviderIdForAuth(rawProvider) : void 0;
  if (!provider)
    return {
      provider: void 0,
      externalCliProvider: void 0,
      matches: () => true,
    };
  return {
    provider,
    externalCliProvider: provider,
    matches: (profile) => profile.provider === provider,
  };
}
function formatTimestamp(value) {
  return timestampMsToIsoString(value);
}
function resolveProfileExpiry(profile) {
  return profile.type === "api_key" ? void 0 : formatTimestamp(profile.expires);
}
function summarizeProfile(params) {
  const expiresAt = resolveProfileExpiry(params.profile);
  const cooldownUntil = formatTimestamp(params.usage?.cooldownUntil);
  const disabledUntil = formatTimestamp(params.usage?.disabledUntil);
  return {
    id: params.profileId,
    provider: resolveProviderIdForAuth(params.profile.provider),
    type: params.profile.type,
    label: resolveAuthProfileDisplayLabel({
      cfg: params.cfg,
      store: params.store,
      profileId: params.profileId,
    }),
    ...(params.profile.email ? { email: params.profile.email } : {}),
    ...(params.profile.displayName ? { displayName: params.profile.displayName } : {}),
    ...(expiresAt ? { expiresAt } : {}),
    ...(cooldownUntil ? { cooldownUntil } : {}),
    ...(disabledUntil ? { disabledUntil } : {}),
  };
}
function formatProfileLine(profile) {
  const details = [`${profile.provider}/${profile.type}`];
  if (profile.expiresAt) details.push(`expires ${profile.expiresAt}`);
  if (profile.cooldownUntil) details.push(`cooldown until ${profile.cooldownUntil}`);
  if (profile.disabledUntil) details.push(`disabled until ${profile.disabledUntil}`);
  return `- ${profile.label} [${details.join("; ")}]`;
}
/** Lists auth profiles for the selected agent, optionally filtered by provider. */
async function modelsAuthListCommand(opts, runtime) {
  const cfg = await loadModelsConfig({
    commandName: "models auth list",
    runtime,
  });
  const { agentId, agentDir } = resolveModelsTargetAgent(cfg, opts.agent);
  const providerFilter = resolveProviderFilter(opts.provider);
  const store = ensureAuthProfileStore(
    agentDir,
    providerFilter.externalCliProvider
      ? {
          externalCli: externalCliDiscoveryForProviderAuth({
            cfg,
            provider: providerFilter.externalCliProvider,
          }),
        }
      : void 0,
  );
  const profiles = Object.entries(store.profiles)
    .map(([profileId, profile]) =>
      summarizeProfile({
        cfg,
        store,
        profileId,
        profile,
        usage: store.usageStats?.[profileId],
      }),
    )
    .filter((profile) => providerFilter.matches(profile))
    .toSorted((a, b) => a.provider.localeCompare(b.provider) || a.id.localeCompare(b.id));
  if (opts.json) {
    writeRuntimeJson(runtime, {
      agentId,
      agentDir: shortenHomePath(agentDir),
      authStatePath: shortenHomePath(resolveAuthStatePathForDisplay(agentDir)),
      provider: providerFilter.provider ?? null,
      profiles,
    });
    return;
  }
  runtime.log(`Agent: ${agentId}`);
  runtime.log(`Auth state store: ${shortenHomePath(resolveAuthStatePathForDisplay(agentDir))}`);
  if (providerFilter.provider) runtime.log(`Provider: ${providerFilter.provider}`);
  if (profiles.length === 0) {
    runtime.log("Profiles: (none)");
    return;
  }
  runtime.log("Profiles:");
  for (const profile of profiles) runtime.log(formatProfileLine(profile));
}
//#endregion
export { modelsAuthListCommand };
