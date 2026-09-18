import { on as ProviderWrapStreamFnContext } from "./plugin-entry-DPCR66aO.js";
import { t as VllmQwenThinkingFormat } from "./thinking-policy-UcP_DCCc.js";
import { T as StreamFn } from "./types-JQFrjdua.js";

//#region extensions/vllm/stream.d.ts
type VllmThinkingLevel = ProviderWrapStreamFnContext["thinkingLevel"];
declare function createVllmQwenThinkingWrapper(params: {
  baseStreamFn: StreamFn | undefined;
  format: VllmQwenThinkingFormat;
  thinkingLevel: VllmThinkingLevel;
}): StreamFn;
declare function createVllmProviderThinkingWrapper(params: {
  baseStreamFn: StreamFn | undefined;
  qwenFormat?: VllmQwenThinkingFormat;
  thinkingLevel: VllmThinkingLevel;
}): StreamFn;
declare function wrapVllmProviderStream(ctx: ProviderWrapStreamFnContext): StreamFn | undefined;
//#endregion
export {
  createVllmQwenThinkingWrapper as n,
  wrapVllmProviderStream as r,
  createVllmProviderThinkingWrapper as t,
};
