import { t as getBootstrapChannelPlugin } from "./bootstrap-registry-BdK6fwWk.js";
import {
  r as resolveChannelConfigRecord,
  t as hasMeaningfulChannelConfigShallow,
} from "./channel-configured-shared-CPUMiZI8.js";
import {
  a as hasBundledChannelPackageState,
  o as listBundledChannelIdsForPackageState,
} from "./config-presence-dDm96tuW.js";
//#region src/channels/plugins/configured-state.ts
/**
 * Lists bundled channel ids that expose configured-state detectors.
 */
function listBundledChannelIdsWithConfiguredState(discovery) {
  return listBundledChannelIdsForPackageState("configuredState", discovery);
}
/**
 * Checks whether a bundled channel reports configured state for the current config.
 */
function hasBundledChannelConfiguredState(params) {
  return hasBundledChannelPackageState({
    metadataKey: "configuredState",
    channelId: params.channelId,
    cfg: params.cfg,
    env: params.env,
    discovery: params.discovery,
  });
}
//#endregion
//#region src/config/channel-configured.ts
/** Resolves whether a channel has enough config, env, or plugin state to be considered setup. */
function isChannelConfigured(cfg, channelId, env = process.env) {
  if (hasMeaningfulChannelConfigShallow(resolveChannelConfigRecord(cfg, channelId))) return true;
  if (
    hasBundledChannelConfiguredState({
      channelId,
      cfg,
      env,
    })
  )
    return true;
  const plugin = getBootstrapChannelPlugin(channelId);
  return Boolean(
    plugin?.config?.hasConfiguredState?.({
      cfg,
      env,
    }),
  );
}
//#endregion
export {
  hasBundledChannelConfiguredState as n,
  listBundledChannelIdsWithConfiguredState as r,
  isChannelConfigured as t,
};
