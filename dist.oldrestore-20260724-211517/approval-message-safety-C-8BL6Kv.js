//#region extensions/discord/src/approval-message-safety.ts
const DISCORD_APPROVAL_ALLOWED_MENTIONS = { parse: [] };
const DISCORD_MARKDOWN_META_CHARACTERS = /* @__PURE__ */ new Set([
  "\\",
  "`",
  "*",
  "_",
  "{",
  "}",
  "[",
  "]",
  "(",
  ")",
  "<",
  ">",
  "#",
  "+",
  "-",
  ".",
  "!",
  "|",
  "~",
]);
function escapeDiscordApprovalDisplayCharacter(character) {
  if (character === "\n") return "\\n";
  if (character === "\r") return "\\r";
  if (character === "	") return "\\t";
  const codePoint = character.codePointAt(0) ?? 0;
  if (
    codePoint <= 31 ||
    (codePoint >= 127 && codePoint <= 159) ||
    codePoint === 8232 ||
    codePoint === 8233
  )
    return `\\u{${codePoint.toString(16).padStart(4, "0")}}`;
  return DISCORD_MARKDOWN_META_CHARACTERS.has(character) ? `\\${character}` : character;
}
/** Keep opaque approval metadata bounded, single-line, and inert in Discord Markdown. */
function formatDiscordApprovalDisplayValue(value, maxChars = 200) {
  const limit = Number.isFinite(maxChars) ? Math.max(0, Math.trunc(maxChars)) : 200;
  const escapedParts = Array.from(value, escapeDiscordApprovalDisplayCharacter);
  const escaped = escapedParts.join("");
  if (escaped.length <= limit) return escaped;
  if (limit <= 3) return ".".repeat(limit);
  let bounded = "";
  for (const part of escapedParts) {
    if (bounded.length + part.length > limit - 3) break;
    bounded += part;
  }
  return `${bounded}...`;
}
//#endregion
export { formatDiscordApprovalDisplayValue as n, DISCORD_APPROVAL_ALLOWED_MENTIONS as t };
