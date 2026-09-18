import { on as ProviderWrapStreamFnContext } from "../../plugin-entry-DPCR66aO.js";

//#region extensions/xiaomi/stream.d.ts
declare function createMiMoThinkingWrapper(
  baseStreamFn: ProviderWrapStreamFnContext["streamFn"],
  thinkingLevel: ProviderWrapStreamFnContext["thinkingLevel"],
): ProviderWrapStreamFnContext["streamFn"];
//#endregion
export { createMiMoThinkingWrapper };
