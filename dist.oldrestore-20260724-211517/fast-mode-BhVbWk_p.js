import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
function modelConfigKey(provider, model) {
  const providerId = provider?.trim() ?? "";
  const modelId = model?.trim() ?? "";
  if (!providerId) return modelId;
  if (!modelId) return providerId;
  return normalizeLowercaseStringOrEmpty(modelId).startsWith(
    `${normalizeLowercaseStringOrEmpty(providerId)}/`,
  )
    ? modelId
    : `${providerId}/${modelId}`;
}
function modelConfigKeys(provider, model) {
  const key = modelConfigKey(provider, model);
  if (normalizeLowercaseStringOrEmpty(provider?.trim() ?? "") !== "openai-codex") return [key];
  const openAiKey = modelConfigKey("openai", model);
  return openAiKey === key ? [key] : [key, openAiKey];
}
function resolveFastModeModelParams(params) {
  const models = params.cfg?.agents?.defaults?.models;
  if (!models) return;
  for (const key of modelConfigKeys(params.provider, params.model)) {
    const modelConfig = models[key];
    if (modelConfig?.params) return modelConfig.params;
  }
}
function normalizeFastModeAutoOnSeconds(value) {
  return typeof value === "number" && Number.isInteger(value) && value > 0 ? value : void 0;
}
function resolveFastModeModelAutoOnSeconds(params) {
  const modelParams = resolveFastModeModelParams(params);
  return (
    normalizeFastModeAutoOnSeconds(modelParams?.fastAutoOnSeconds) ??
    normalizeFastModeAutoOnSeconds(modelParams?.fast_auto_on_seconds) ??
    normalizeFastModeAutoOnSeconds(modelParams?.fastSeconds) ??
    normalizeFastModeAutoOnSeconds(modelParams?.fast_seconds) ??
    60
  );
}
function resolveFastModeForElapsed(params) {
  const nowMs = params.nowMs ?? Date.now();
  const elapsedMs = Math.max(0, nowMs - params.startedAtMs);
  const fastAutoOnSeconds = normalizeFastModeAutoOnSeconds(params.fastAutoOnSeconds) ?? 60;
  const thresholdMs = fastAutoOnSeconds * 1e3;
  const enabled = params.mode === "auto" ? elapsedMs <= thresholdMs : params.mode === true;
  const elapsedSeconds = Math.floor(elapsedMs / 1e3);
  return {
    mode: params.mode,
    enabled,
    elapsedSeconds,
    fastAutoOnSeconds,
  };
}
function formatFastModeAutoProgressText(params) {
  if (params.enabled) return "💨Fast: auto-on";
  const fastAutoOnSeconds = normalizeFastModeAutoOnSeconds(params.fastAutoOnSeconds) ?? 60;
  return `💨Fast: auto-off(${params.elapsedSeconds}s>=${fastAutoOnSeconds}s)`;
}
function formatFastModeValue(mode) {
  return mode === "auto" ? "auto" : mode === true ? "on" : "off";
}
function formatFastModeAutoLabel(params) {
  return `auto (${normalizeFastModeAutoOnSeconds(params?.fastAutoOnSeconds) ?? 60} sec)`;
}
function formatFastModeStatusValue(params) {
  if (params.mode === "auto")
    return formatFastModeAutoLabel({ fastAutoOnSeconds: params.fastAutoOnSeconds });
  return formatFastModeValue(params.mode);
}
function formatFastModeCommandOptions(params) {
  return `on, off, ${formatFastModeAutoLabel({ fastAutoOnSeconds: params?.fastAutoOnSeconds })}, default, status`;
}
function normalizeFastModeSource(value) {
  return value === "session" || value === "agent" || value === "config" || value === "default"
    ? value
    : void 0;
}
function formatFastModeSourceSuffix(source) {
  switch (source) {
    case "session":
      return " (session)";
    case "agent":
      return " (default: agent)";
    case "config":
      return " (default: model)";
    case "default":
      return " (default)";
    default:
      return "";
  }
}
function formatFastModeCurrentStatus(params) {
  return `${params.label ?? "Current fast mode"}: ${formatFastModeStatusValue({
    mode: params.mode,
    fastAutoOnSeconds: params.fastAutoOnSeconds,
  })}${formatFastModeSourceSuffix(params.source)}.`;
}
//#endregion
export {
  formatFastModeSourceSuffix as a,
  normalizeFastModeAutoOnSeconds as c,
  resolveFastModeModelAutoOnSeconds as d,
  resolveFastModeModelParams as f,
  formatFastModeCurrentStatus as i,
  normalizeFastModeSource as l,
  formatFastModeAutoProgressText as n,
  formatFastModeStatusValue as o,
  formatFastModeCommandOptions as r,
  formatFastModeValue as s,
  formatFastModeAutoLabel as t,
  resolveFastModeForElapsed as u,
};
