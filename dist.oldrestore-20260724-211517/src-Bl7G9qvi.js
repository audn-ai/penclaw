import "./number-coercion-CJQ8TR--.js";
//#region packages/normalization-core/src/json-coercion.ts
/** Parses JSON without throwing, returning undefined for invalid input. */
function safeParseJson(value) {
  try {
    return JSON.parse(value);
  } catch {
    return;
  }
}
//#endregion
//#region packages/normalization-core/src/text-decoding.ts
/** Decodes a byte prefix without inventing a replacement character for a cut trailing sequence. */
function decodeTextPrefix(bytes, options = {}) {
  return new TextDecoder(options.encoding).decode(
    bytes,
    options.truncated ? { stream: true } : void 0,
  );
}
//#endregion
export { safeParseJson as n, decodeTextPrefix as t };
