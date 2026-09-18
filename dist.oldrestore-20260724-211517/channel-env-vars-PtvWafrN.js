import { t as appendUniqueEnvVarCandidates } from "./env-var-candidates-D_PA36up.js";
import { i as loadPluginMetadataSnapshot } from "./plugin-metadata-snapshot-BMgImu0m.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
//#region src/secrets/channel-env-vars.ts
/** Discovers plugin-declared environment variable names for channel credential setup. */
/**
 * Resolves plugin-declared channel environment variable names keyed by channel id.
 * The result is deterministic so env-shell docs and prompt snapshots stay stable.
 */
function resolveChannelEnvVars(params) {
  const snapshot = loadPluginMetadataSnapshot({
    config: params?.config ?? {},
    workspaceDir: params?.workspaceDir,
    env: params?.env ?? process.env,
  });
  const candidates = {};
  for (const plugin of snapshot.plugins) {
    if (!plugin.channelEnvVars) continue;
    for (const [channelId, keys] of Object.entries(plugin.channelEnvVars).toSorted(
      ([left], [right]) => left.localeCompare(right),
    ))
      appendUniqueEnvVarCandidates(candidates, channelId, keys);
  }
  return candidates;
}
/**
 * Returns the declared env var names for one channel id.
 */
function getChannelEnvVars(channelId, params) {
  const channelEnvVars = resolveChannelEnvVars(params);
  const envVars = Object.hasOwn(channelEnvVars, channelId) ? channelEnvVars[channelId] : void 0;
  return Array.isArray(envVars) ? [...envVars] : [];
}
/**
 * Lists every known channel env var name across installed plugin metadata.
 */
function listKnownChannelEnvVarNames(params) {
  return uniqueStrings(Object.values(resolveChannelEnvVars(params)).flat());
}
//#endregion
export { listKnownChannelEnvVarNames as n, getChannelEnvVars as t };
