import { t as stripInternalRuntimeScaffolding } from "./protocol-scaffolding-DMClPiYZ.js";
//#region src/infra/outbound/sanitize-text.ts
const HTML_TAG_RE = /<\/?[a-z][a-z0-9_-]*\b[^>]*>/gi;
const CONVERTIBLE_HTML_OPEN_TAG_RE =
  /<(b|strong|i|em|s|strike|del|code|h[1-6]|li)(?=\s|>)(?:[^"'<>]|"[^"]*"|'[^']*')*>/gi;
function stripRemainingHtmlTags(text) {
  let previous;
  let current = text;
  do {
    previous = current;
    current = current.replace(HTML_TAG_RE, "");
  } while (current !== previous);
  return current;
}
/**
 * Convert common HTML tags to their plain-text/lightweight-markup equivalents
 * and strip anything that remains.
 *
 * The function is intentionally conservative — it only targets tags that models
 * are known to produce and avoids false positives on angle brackets in normal
 * prose (e.g. `a < b`).
 */
function sanitizeForPlainText(text, options = {}) {
  const boldMarker = options.style === "markdown" ? "**" : "*";
  const strikeMarker = options.style === "markdown" ? "~~" : "~";
  return stripRemainingHtmlTags(
    stripInternalRuntimeScaffolding(text)
      .replace(/<((?:https?:\/\/|mailto:)[^<>\s]+)>/gi, "$1")
      .replace(CONVERTIBLE_HTML_OPEN_TAG_RE, "<$1>")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/?(p|div)>/gi, "\n")
      .replace(/<(b|strong)>(.*?)<\/\1>/gi, `${boldMarker}$2${boldMarker}`)
      .replace(/<(i|em)>(.*?)<\/\1>/gi, "_$2_")
      .replace(/<(s|strike|del)>(.*?)<\/\1>/gi, `${strikeMarker}$2${strikeMarker}`)
      .replace(/<code>(.*?)<\/code>/gi, "`$1`")
      .replace(/<h[1-6]>(.*?)<\/h[1-6]>/gi, `\n${boldMarker}$1${boldMarker}\n`)
      .replace(/<li>(.*?)<\/li>/gi, "• $1\n"),
  ).replace(/\n{3,}/g, "\n\n");
}
//#endregion
export { sanitizeForPlainText as t };
