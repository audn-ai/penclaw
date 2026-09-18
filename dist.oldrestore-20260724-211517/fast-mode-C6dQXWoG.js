import { r as resolveAgentConfig } from "./agent-scope-config-DVIR1nBa.js";
import "./agent-scope-y9xQv_q1.js";
import {
  d as resolveFastModeModelAutoOnSeconds,
  f as resolveFastModeModelParams,
} from "./fast-mode-BhVbWk_p.js";
import "./thinking.shared-BWnbgBUO.js";
import { i as normalizeFastMode } from "./string-coerce-DW4mBlAt.js";
//#region src/agents/fast-mode.ts
function resolveConfiguredFastModeRaw(params) {
  const modelParams = resolveFastModeModelParams(params);
  return modelParams?.fastMode ?? modelParams?.fast_mode;
}
/** Resolve the effective fast-mode setting and its source. */
function resolveFastModeState(params) {
  const fastAutoOnSeconds = resolveFastModeModelAutoOnSeconds(params);
  const sessionOverride = normalizeFastMode(params.sessionEntry?.fastMode);
  if (sessionOverride !== void 0)
    return {
      mode: sessionOverride,
      enabled: sessionOverride === "auto" ? true : sessionOverride,
      source: "session",
      fastAutoOnSeconds,
    };
  const normalizedAgentDefault = normalizeFastMode(
    params.agentId && params.cfg
      ? resolveAgentConfig(params.cfg, params.agentId)?.fastModeDefault
      : void 0,
  );
  if (normalizedAgentDefault !== void 0)
    return {
      mode: normalizedAgentDefault,
      enabled: normalizedAgentDefault === "auto" ? true : normalizedAgentDefault,
      source: "agent",
      fastAutoOnSeconds,
    };
  const configured = normalizeFastMode(resolveConfiguredFastModeRaw(params));
  if (configured !== void 0)
    return {
      mode: configured,
      enabled: configured === "auto" ? true : configured,
      source: "config",
      fastAutoOnSeconds,
    };
  return {
    mode: false,
    enabled: false,
    source: "default",
    fastAutoOnSeconds,
  };
}
//#endregion
export { resolveFastModeState as t };
