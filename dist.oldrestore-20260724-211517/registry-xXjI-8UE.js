import { r as normalizeChatChannelId } from "./ids-lBaN9yr4.js";
import {
  n as findRegisteredChannelPluginEntryById,
  r as listRegisteredChannelPluginEntries,
} from "./registry-normalize-CWirNxxC.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import "./chat-meta-B_W7YKQn.js";
//#region src/channels/registry.ts
/**
 * Normalizes built-in chat channel ids without loading channel plugin implementations.
 */
function normalizeChannelId(raw) {
  return normalizeChatChannelId(raw);
}
/**
 * Lists registered channel plugin ids without importing their runtime implementations.
 */
function listRegisteredChannelPluginIds() {
  return listRegisteredChannelPluginEntries().flatMap((entry) => {
    const id = normalizeOptionalString(entry.plugin.id);
    return id ? [id] : [];
  });
}
/**
 * Returns lightweight channel metadata used by message formatting and capability checks.
 */
function getRegisteredChannelPluginMeta(id) {
  return findRegisteredChannelPluginEntryById(id)?.plugin.meta ?? null;
}
/**
 * Formats a concise channel primer line for setup/status flows.
 */
function formatChannelPrimerLine(meta) {
  return `${meta.label}: ${meta.blurb}`;
}
/**
 * Formats a docs-aware channel selection line for interactive setup prompts.
 */
function formatChannelSelectionLine(meta, docsLink) {
  const docsPrefix = meta.selectionDocsPrefix ?? "Docs:";
  const docsLabel = meta.docsLabel ?? meta.id;
  const docs = meta.selectionDocsOmitLabel
    ? docsLink(meta.docsPath)
    : docsLink(meta.docsPath, docsLabel);
  const extras = (meta.selectionExtras ?? []).filter(Boolean).join(" ");
  return `${meta.label} — ${meta.blurb} ${docsPrefix ? `${docsPrefix} ` : ""}${docs}${extras ? ` ${extras}` : ""}`;
}
//#endregion
export {
  normalizeChannelId as a,
  listRegisteredChannelPluginIds as i,
  formatChannelSelectionLine as n,
  getRegisteredChannelPluginMeta as r,
  formatChannelPrimerLine as t,
};
