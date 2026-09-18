import { r as ThinkLevel } from "./thinking.shared-0bZWY054.js";
import { T as StreamFn } from "./types-JQFrjdua.js";

//#region src/llm/providers/stream-wrappers/moonshot-thinking.d.ts
type MoonshotThinkingType = "enabled" | "disabled";
type MoonshotThinkingKeep = "all";
/** @deprecated Moonshot provider-owned stream helper; do not use from third-party plugins. */
declare function resolveMoonshotThinkingType(params: {
  configuredThinking: unknown;
  thinkingLevel?: ThinkLevel;
}): MoonshotThinkingType | undefined;
/** @deprecated Moonshot provider-owned stream helper; do not use from third-party plugins. */
declare function createMoonshotThinkingWrapper(
  baseStreamFn: StreamFn | undefined,
  thinkingType?: MoonshotThinkingType,
  thinkingKeep?: MoonshotThinkingKeep,
): StreamFn;
//#endregion
export { resolveMoonshotThinkingType as n, createMoonshotThinkingWrapper as t };
