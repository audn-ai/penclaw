import { t as getChannelEnvVars } from "./channel-env-vars-PtvWafrN.js";
import "./utils-DtcDeqWS.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
//#region src/config/channel-configured-shared.ts
/** Returns a channel config object when `channels.<id>` is present and object-shaped. */
function resolveChannelConfigRecord(cfg, channelId) {
  const entry = cfg.channels?.[channelId];
  return isRecord(entry) ? entry : null;
}
/** Checks whether a shallow channel config contains activation-relevant values. */
function hasMeaningfulChannelConfigShallow(value) {
  if (!isRecord(value)) return false;
  const keys = Object.keys(value);
  if (keys.length === 1 && keys[0] === "enabled") return value.enabled === true;
  return keys.some((key) => key !== "enabled");
}
/** Detects static channel configuration from known env vars or `channels.<id>` config. */
function isStaticallyChannelConfigured(cfg, channelId, env = process.env) {
  for (const envVar of getChannelEnvVars(channelId, {
    config: cfg,
    env,
  }))
    if (typeof env[envVar] === "string" && env[envVar].trim().length > 0) return true;
  return hasMeaningfulChannelConfigShallow(resolveChannelConfigRecord(cfg, channelId));
}
//#endregion
export {
  isStaticallyChannelConfigured as n,
  resolveChannelConfigRecord as r,
  hasMeaningfulChannelConfigShallow as t,
};
