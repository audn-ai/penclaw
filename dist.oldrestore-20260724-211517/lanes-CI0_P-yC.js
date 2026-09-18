//#region src/agents/lanes.ts
/** Default lane for nested agent work. */
const AGENT_LANE_NESTED = "nested";
const AGENT_LANE_CRON_NESTED = "cron-nested";
const AGENT_LANE_SUBAGENT = "subagent";
const AGENT_LANE_CRON = "cron";
const NESTED_LANE = "nested";
const NESTED_LANE_PREFIX = `${NESTED_LANE}:`;
/** Resolves the lane for agent work started from cron. */
function resolveCronAgentLane(lane) {
  const trimmed = lane?.trim();
  if (!trimmed || trimmed === AGENT_LANE_CRON) return AGENT_LANE_CRON_NESTED;
  return trimmed;
}
/** Resolves a per-session nested lane to serialize nested agent work. */
function resolveNestedAgentLaneForSession(sessionKey) {
  const trimmed = sessionKey?.trim();
  if (!trimmed) return AGENT_LANE_NESTED;
  return `${NESTED_LANE_PREFIX}${trimmed}`;
}
/** Returns true when a lane belongs to nested agent work. */
function isNestedAgentLane(lane) {
  if (!lane) return false;
  return lane === NESTED_LANE || lane.startsWith(NESTED_LANE_PREFIX);
}
//#endregion
export {
  resolveNestedAgentLaneForSession as i,
  isNestedAgentLane as n,
  resolveCronAgentLane as r,
  AGENT_LANE_SUBAGENT as t,
};
