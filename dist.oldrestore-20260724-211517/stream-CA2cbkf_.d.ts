import { on as ProviderWrapStreamFnContext } from "./plugin-entry-DPCR66aO.js";
import { c as Context } from "./types-CqrbBnUB.js";
import { T as StreamFn } from "./types-JQFrjdua.js";

//#region extensions/github-copilot/stream.d.ts
declare function buildCopilotDynamicHeaders(params: {
  messages: Context["messages"];
  hasImages: boolean;
}): Record<string, string>;
declare function wrapCopilotAnthropicStream(
  baseStreamFn: StreamFn | undefined,
): StreamFn | undefined;
declare function wrapCopilotOpenAIResponsesStream(
  baseStreamFn: StreamFn | undefined,
): StreamFn | undefined;
declare function wrapCopilotOpenAICompletionsStream(
  baseStreamFn: StreamFn | undefined,
): StreamFn | undefined;
declare function wrapCopilotProviderStream(ctx: ProviderWrapStreamFnContext): StreamFn | undefined;
//#endregion
export {
  wrapCopilotProviderStream as a,
  wrapCopilotOpenAIResponsesStream as i,
  wrapCopilotAnthropicStream as n,
  wrapCopilotOpenAICompletionsStream as r,
  buildCopilotDynamicHeaders as t,
};
