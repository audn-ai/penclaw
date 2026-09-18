import { t as asBoolean } from "./boolean-CrriykWV.js";
import {
  c as normalizePluginsConfig,
  l as resolveEffectiveEnableState,
} from "./config-state-C1Qyxaws.js";
import { n as isTruthyEnvValue } from "./env-Di-LcxqW.js";
import { r as resolvePluginConfigObject } from "./plugin-config-runtime-ef53THzv.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import "./runtime-env-D0V-7Gqz.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import { p as readStringValue } from "./string-coerce-DW4mBlAt.js";
//#region extensions/canvas/src/config.ts
function readPositiveInteger(value) {
  return typeof value === "number" && Number.isInteger(value) && value > 0 ? value : void 0;
}
function parseCanvasHostConfig(value) {
  if (!isRecord(value)) return;
  return {
    ...(asBoolean(value.enabled) !== void 0 ? { enabled: asBoolean(value.enabled) } : {}),
    ...(readStringValue(value.root) !== void 0 ? { root: readStringValue(value.root) } : {}),
    ...(readPositiveInteger(value.port) !== void 0
      ? { port: readPositiveInteger(value.port) }
      : {}),
    ...(asBoolean(value.liveReload) !== void 0 ? { liveReload: asBoolean(value.liveReload) } : {}),
  };
}
/** Parses raw Canvas plugin config into a typed, normalized shape. */
function parseCanvasPluginConfig(value) {
  if (!isRecord(value)) return {};
  const host = parseCanvasHostConfig(value.host);
  return host ? { host } : {};
}
/** Returns whether the bundled Canvas plugin is effectively enabled. */
function isCanvasPluginEnabled(config) {
  if (!config) return true;
  return resolveEffectiveEnableState({
    id: "canvas",
    origin: "bundled",
    config: normalizePluginsConfig(config.plugins),
    rootConfig: config,
    enabledByDefault: true,
  }).enabled;
}
/** Resolves Canvas host config from plugin config or root config. */
function resolveCanvasHostConfig(params) {
  return (
    parseCanvasPluginConfig(
      params.pluginConfig ?? resolvePluginConfigObject(params.config, "canvas") ?? {},
    ).host ?? {}
  );
}
/** Returns whether the Canvas hosted route/server surface should be active. */
function isCanvasHostEnabled(config) {
  if (isTruthyEnvValue(process.env.OPENCLAW_SKIP_CANVAS_HOST)) return false;
  if (!isCanvasPluginEnabled(config)) return false;
  return resolveCanvasHostConfig({ config }).enabled !== false;
}
/** Config schema metadata for Canvas plugin settings. */
const canvasConfigSchema = {
  parse: parseCanvasPluginConfig,
  uiHints: {
    host: {
      label: "Canvas Host",
      help: "Serves local Canvas and A2UI files for paired nodes.",
      advanced: true,
    },
    "host.enabled": {
      label: "Canvas Host Enabled",
      advanced: true,
    },
    "host.root": {
      label: "Canvas Host Root Directory",
      help: "Directory to serve. Defaults to the OpenClaw state canvas directory.",
      advanced: true,
    },
    "host.port": {
      label: "Canvas Host Port",
      advanced: true,
    },
    "host.liveReload": {
      label: "Canvas Host Live Reload",
      advanced: true,
    },
  },
};
//#endregion
export {
  resolveCanvasHostConfig as a,
  parseCanvasPluginConfig as i,
  isCanvasHostEnabled as n,
  isCanvasPluginEnabled as r,
  canvasConfigSchema as t,
};
