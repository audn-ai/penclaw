import { on as ProviderWrapStreamFnContext } from "../../plugin-entry-DPCR66aO.js";

//#region extensions/opencode-go/stream.d.ts
declare function createOpencodeGoWrapper(
  baseStreamFn: ProviderWrapStreamFnContext["streamFn"],
  thinkingLevel: ProviderWrapStreamFnContext["thinkingLevel"],
): ProviderWrapStreamFnContext["streamFn"];
//#endregion
export { createOpencodeGoWrapper };
