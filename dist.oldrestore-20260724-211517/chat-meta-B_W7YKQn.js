import { t as listBundledChannelCatalogEntries } from "./bundled-channel-catalog-read-BR9axaEB.js";
import { t as buildManifestChannelMeta } from "./channel-meta-Dop_ckTT.js";
import "./src-Bl7G9qvi.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { n as CHAT_CHANNEL_ORDER } from "./ids-lBaN9yr4.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region src/channels/chat-meta-shared.ts
/**
 * Built-in chat channel metadata builder.
 *
 * Converts bundled channel catalog entries into setup/status metadata records.
 */
const CHAT_CHANNEL_ID_SET = new Set(CHAT_CHANNEL_ORDER);
function toChatChannelMeta(params) {
  const label = normalizeOptionalString(params.channel.label);
  if (!label) throw new Error(`Missing label for bundled chat channel "${params.id}"`);
  return buildManifestChannelMeta({
    id: params.id,
    channel: params.channel,
    label,
    selectionLabel: normalizeOptionalString(params.channel.selectionLabel) || label,
    docsPath: normalizeOptionalString(params.channel.docsPath) || `/channels/${params.id}`,
    docsLabel: normalizeOptionalString(params.channel.docsLabel),
    blurb: normalizeOptionalString(params.channel.blurb) || "",
    detailLabel: normalizeOptionalString(params.channel.detailLabel),
    systemImage: normalizeOptionalString(params.channel.systemImage),
    arrayFieldMode: "non-empty",
    selectionDocsPrefixMode: "defined",
  });
}
function buildChatChannelMetaById() {
  const entries = /* @__PURE__ */ new Map();
  for (const entry of listBundledChannelCatalogEntries()) {
    const rawId = normalizeOptionalString(entry.id);
    if (!rawId || !CHAT_CHANNEL_ID_SET.has(rawId)) continue;
    const id = rawId;
    entries.set(
      id,
      toChatChannelMeta({
        id,
        channel: entry.channel,
      }),
    );
  }
  return Object.freeze(Object.fromEntries(entries));
}
//#endregion
//#region src/channels/chat-meta.ts
/**
 * Cached built-in chat channel metadata accessors.
 *
 * Provides ordered channel metadata for setup, status, and selection surfaces.
 */
let chatChannelMetaCache = null;
function getChatChannelMetaById() {
  chatChannelMetaCache ??= buildChatChannelMetaById();
  return chatChannelMetaCache;
}
/**
 * Lists built-in chat channel metadata in configured display order.
 */
function listChatChannels() {
  const metaById = getChatChannelMetaById();
  return CHAT_CHANNEL_ORDER.map((id) => metaById[id]).filter((meta) => Boolean(meta));
}
/**
 * Returns metadata for one built-in chat channel id.
 */
/** Drift-tolerant lookup: undefined when the id is missing from the bundled catalog. */
function findChatChannelMeta(id) {
  return getChatChannelMetaById()[id];
}
/**
 * Returns metadata for one built-in chat channel id.
 * Shipped plugin-SDK contract: callers pass bundled ids, so absence is an invariant
 * violation; drift-tolerant core paths use findChatChannelMeta instead.
 */
function getChatChannelMeta(id) {
  return expectDefined(findChatChannelMeta(id), `chat channel meta for ${id}`);
}
//#endregion
export {
  buildChatChannelMetaById as i,
  getChatChannelMeta as n,
  listChatChannels as r,
  findChatChannelMeta as t,
};
