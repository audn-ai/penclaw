import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
//#region src/channels/chat-type.ts
/**
 * Channel conversation kind normalization.
 *
 * Maps channel-specific direct/group/channel labels into OpenClaw chat types.
 */
/**
 * Normalizes channel-specific chat type labels into OpenClaw conversation kinds.
 */
function normalizeChatType(raw) {
  const value = normalizeOptionalLowercaseString(raw);
  if (!value) return;
  if (value === "direct" || value === "dm") return "direct";
  if (value === "group") return "group";
  if (value === "channel") return "channel";
}
//#endregion
export { normalizeChatType as t };
