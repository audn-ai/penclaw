//#region src/infra/system-message.ts
const SYSTEM_MARK = "⚙️";
function normalizeSystemText(value) {
  return value.trim();
}
/** Return true when text already carries the system-message prefix. */
function hasSystemMark(text) {
  return normalizeSystemText(text).startsWith(SYSTEM_MARK);
}
/** Prefix non-empty text as a system message without double-prefixing. */
function prefixSystemMessage(text) {
  const normalized = normalizeSystemText(text);
  if (!normalized) return normalized;
  if (hasSystemMark(normalized)) return normalized;
  return `${SYSTEM_MARK} ${normalized}`;
}
//#endregion
export { hasSystemMark as n, prefixSystemMessage as r, SYSTEM_MARK as t };
