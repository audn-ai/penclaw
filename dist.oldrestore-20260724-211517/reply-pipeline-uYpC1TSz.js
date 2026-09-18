import { r as getLoadedChannelPluginForRead } from "./registry-loaded-D8eZo-vR.js";
import { t as normalizeAnyChannelId } from "./registry-normalize-CWirNxxC.js";
import { n as createReplyPrefixOptions } from "./reply-prefix-C5dokQJN.js";
import { n as resolveResponsePrefixTemplate } from "./response-prefix-template-DdRpfl7D.js";
import { i as resolveSourceReplyDeliveryMode } from "./source-reply-delivery-mode-a6QeCVR1.js";
import { t as createTypingCallbacks } from "./typing-DnYJejsM.js";
//#region src/channels/message/reply-pipeline.ts
/** Resolves whether a channel reply should use source delivery, message tools, or direct sending. */
function resolveChannelSourceReplyDeliveryMode(params) {
  return resolveSourceReplyDeliveryMode(params);
}
/** Builds the reply pipeline used by channel turns and plugin SDK reply helpers. */
function createChannelReplyPipeline(params) {
  const channelId = params.channel
    ? (normalizeAnyChannelId(params.channel) ?? params.channel)
    : void 0;
  let plugin;
  let pluginTransformResolved = false;
  const resolvePluginTransform = () => {
    if (pluginTransformResolved) return plugin?.messaging?.transformReplyPayload;
    pluginTransformResolved = true;
    plugin = channelId ? getLoadedChannelPluginForRead(channelId) : void 0;
    return plugin?.messaging?.transformReplyPayload;
  };
  const transformReplyPayload = params.transformReplyPayload
    ? params.transformReplyPayload
    : channelId
      ? (payload) =>
          resolvePluginTransform()?.({
            payload,
            cfg: params.cfg,
            accountId: params.accountId,
          }) ?? payload
      : void 0;
  const prefixOptions = createReplyPrefixOptions({
    cfg: params.cfg,
    agentId: params.agentId,
    channel: params.channel,
    accountId: params.accountId,
  });
  return {
    ...prefixOptions,
    resolveResponsePrefix: () =>
      resolveResponsePrefixTemplate(
        prefixOptions.responsePrefix,
        prefixOptions.responsePrefixContextProvider(),
      ),
    ...(transformReplyPayload ? { transformReplyPayload } : {}),
    ...(params.typingCallbacks
      ? { typingCallbacks: params.typingCallbacks }
      : params.typing
        ? { typingCallbacks: createTypingCallbacks(params.typing) }
        : {}),
  };
}
//#endregion
export { resolveChannelSourceReplyDeliveryMode as n, createChannelReplyPipeline as t };
