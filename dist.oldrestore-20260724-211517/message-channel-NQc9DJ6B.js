import { t as listBundledChannelCatalogEntries } from "./bundled-channel-catalog-read-BR9axaEB.js";
import { t as findChatChannelMeta } from "./chat-meta-B_W7YKQn.js";
import {
  c as normalizeGatewayClientName,
  i as GATEWAY_CLIENT_NAMES,
  r as GATEWAY_CLIENT_MODES,
  s as normalizeGatewayClientMode,
} from "./client-info-Br1guPTt.js";
import { r as normalizeChatChannelId } from "./ids-lBaN9yr4.js";
import { t as INTERNAL_MESSAGE_CHANNEL } from "./message-channel-constants-CvbXi0yz.js";
import { i as normalizeMessageChannel } from "./message-channel-normalize-Be6uJOzO.js";
import { r as getRegisteredChannelPluginMeta } from "./registry-xXjI-8UE.js";
//#region src/utils/message-channel.ts
/** Return whether a Gateway client is the CLI transport. */
function isGatewayCliClient(client) {
  return normalizeGatewayClientMode(client?.mode) === GATEWAY_CLIENT_MODES.CLI;
}
/**
 * Return whether a Gateway client is an ephemeral control-plane connection.
 * Test-mode clients stay excluded from this list: suites use them as stand-ins
 * for real clients and assert presence propagation through the full pipeline.
 */
function isEphemeralGatewayClient(client) {
  const mode = normalizeGatewayClientMode(client?.mode);
  return (
    mode === GATEWAY_CLIENT_MODES.CLI ||
    mode === GATEWAY_CLIENT_MODES.BACKEND ||
    mode === GATEWAY_CLIENT_MODES.PROBE
  );
}
/** Return whether a client is one of the operator UI clients. */
function isOperatorUiClient(client) {
  const clientId = normalizeGatewayClientName(client?.id);
  return clientId === GATEWAY_CLIENT_NAMES.CONTROL_UI || clientId === GATEWAY_CLIENT_NAMES.TUI;
}
/** Return whether a client is the browser Control UI. */
function isBrowserOperatorUiClient(client) {
  return normalizeGatewayClientName(client?.id) === GATEWAY_CLIENT_NAMES.CONTROL_UI;
}
/** Return whether a raw channel id resolves to OpenClaw's internal channel. */
function isInternalMessageChannel(raw) {
  return normalizeMessageChannel(raw) === INTERNAL_MESSAGE_CHANNEL;
}
/** Return whether a Gateway client is the public webchat surface. */
function isWebchatClient(client) {
  if (normalizeGatewayClientMode(client?.mode) === GATEWAY_CLIENT_MODES.WEBCHAT) return true;
  return normalizeGatewayClientName(client?.id) === GATEWAY_CLIENT_NAMES.WEBCHAT_UI;
}
/** Resolve whether a channel can receive markdown without plain-text downgrade. */
function isMarkdownCapableMessageChannel(raw) {
  const channel = normalizeMessageChannel(raw);
  if (!channel) return false;
  if (channel === "webchat" || channel === "tui") return true;
  const builtInChannel = normalizeChatChannelId(channel);
  if (builtInChannel) {
    const builtInMeta = findChatChannelMeta(builtInChannel);
    if (builtInMeta) return builtInMeta.markdownCapable === true;
    const catalogMeta = listBundledChannelCatalogEntries().find(
      (entry) => entry.id === builtInChannel,
    );
    if (catalogMeta) return catalogMeta.channel.markdownCapable === true;
  }
  return getRegisteredChannelPluginMeta(channel)?.markdownCapable === true;
}
//#endregion
export {
  isMarkdownCapableMessageChannel as a,
  isInternalMessageChannel as i,
  isEphemeralGatewayClient as n,
  isOperatorUiClient as o,
  isGatewayCliClient as r,
  isWebchatClient as s,
  isBrowserOperatorUiClient as t,
};
