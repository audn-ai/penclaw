import { i as OpenClawConfig, un as AgentDefaultsConfig } from "./types.openclaw-DDo8sH3F.js";

//#region src/infra/heartbeat-summary.d.ts
type HeartbeatConfig = AgentDefaultsConfig["heartbeat"];
/** Normalized heartbeat configuration for one agent. */
type HeartbeatSummary = {
  enabled: boolean;
  every: string;
  everyMs: number | null;
  prompt: string;
  target: string;
  model?: string;
  ackMaxChars: number;
};
/** Return whether heartbeat scheduling applies to an agent. */
declare function isHeartbeatEnabledForAgent(cfg: OpenClawConfig, agentId?: string): boolean;
/** Resolve a heartbeat interval string to milliseconds. */
declare function resolveHeartbeatIntervalMs(
  cfg: OpenClawConfig,
  overrideEvery?: string,
  heartbeat?: HeartbeatConfig,
): number | null;
/** Resolve display-ready heartbeat settings for an agent. */
declare function resolveHeartbeatSummaryForAgent(
  cfg: OpenClawConfig,
  agentId?: string,
): HeartbeatSummary;
//#endregion
export {
  resolveHeartbeatSummaryForAgent as i,
  isHeartbeatEnabledForAgent as n,
  resolveHeartbeatIntervalMs as r,
  HeartbeatSummary as t,
};
