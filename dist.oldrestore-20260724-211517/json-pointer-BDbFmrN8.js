import { t as parseConfigPathArrayIndex } from "./path-array-index-CvEcUJa-.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
//#region src/secrets/json-pointer.ts
/** JSON Pointer token helpers for file-backed secret refs. */
function failOrUndefined(params) {
  if (params.onMissing === "throw") throw new Error(params.message);
}
function decodeJsonPointerToken(token) {
  return token.replace(/~1/g, "/").replace(/~0/g, "~");
}
/**
 * Encodes one JSON Pointer path token using RFC 6901 escaping.
 */
function encodeJsonPointerToken(token) {
  return token.replace(/~/g, "~0").replace(/\//g, "~1");
}
/**
 * Reads a value from a JSON-like document using an absolute JSON Pointer.
 * Missing segments throw by default; `onMissing: "undefined"` is for optional probes.
 */
function readJsonPointer(root, pointer, options = {}) {
  const onMissing = options.onMissing ?? "throw";
  if (!pointer.startsWith("/"))
    return failOrUndefined({
      onMissing,
      message:
        'File-backed secret ids must be absolute JSON pointers (for example: "/providers/openai/apiKey").',
    });
  const tokens = pointer
    .slice(1)
    .split("/")
    .map((token) => decodeJsonPointerToken(token));
  let current = root;
  for (const token of tokens) {
    if (Array.isArray(current)) {
      const index = parseConfigPathArrayIndex(token);
      if (index === void 0 || index >= current.length)
        return failOrUndefined({
          onMissing,
          message: `JSON pointer segment "${token}" is out of bounds.`,
        });
      current = current[index];
      continue;
    }
    if (!isRecord(current))
      return failOrUndefined({
        onMissing,
        message: `JSON pointer segment "${token}" does not exist.`,
      });
    if (!Object.hasOwn(current, token))
      return failOrUndefined({
        onMissing,
        message: `JSON pointer segment "${token}" does not exist.`,
      });
    current = current[token];
  }
  return current;
}
//#endregion
export { readJsonPointer as n, encodeJsonPointerToken as t };
