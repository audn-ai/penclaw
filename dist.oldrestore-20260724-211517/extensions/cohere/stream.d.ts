import { on as ProviderWrapStreamFnContext } from "../../plugin-entry-DPCR66aO.js";

//#region extensions/cohere/stream.d.ts
declare function createCohereCompletionsWrapper(
  baseStreamFn: ProviderWrapStreamFnContext["streamFn"],
): ProviderWrapStreamFnContext["streamFn"];
//#endregion
export { createCohereCompletionsWrapper };
