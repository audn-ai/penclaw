import { decodeHTMLStrict } from "entities";
//#region src/shared/html-entities.ts
const HTML_ENTITY_RE = /&(?:#x([0-9a-f]+)|#(\d+)|([a-z][a-z0-9]+));/gi;
const LEGACY_CASE_INSENSITIVE_ENTITY_NAME_RE = /^(?:amp|quot|apos|lt|gt)$/i;
function isUnicodeScalar(codePoint) {
  return (
    Number.isInteger(codePoint) &&
    codePoint >= 0 &&
    codePoint <= 1114111 &&
    (codePoint < 55296 || codePoint > 57343)
  );
}
/** Decodes semicolon-terminated HTML5 named and numeric entities exactly once. */
function decodeHtmlEntities(html) {
  if (!html.includes("&")) return html;
  return html.replace(HTML_ENTITY_RE, (entity, hex, decimal, name) => {
    if (hex === void 0 && decimal === void 0) {
      const decodedEntity = decodeHTMLStrict(entity);
      return decodedEntity === entity && LEGACY_CASE_INSENSITIVE_ENTITY_NAME_RE.test(name ?? "")
        ? decodeHTMLStrict(entity.toLowerCase())
        : decodedEntity;
    }
    const codePoint =
      hex === void 0 ? Number.parseInt(decimal ?? "", 10) : Number.parseInt(hex, 16);
    return isUnicodeScalar(codePoint) ? String.fromCodePoint(codePoint) : entity;
  });
}
//#endregion
export { decodeHtmlEntities as t };
