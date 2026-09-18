import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region packages/acp-core/src/meta.ts
function readMetaValue(meta, keys, normalize) {
  if (!meta) return;
  for (const key of keys) {
    const normalized = normalize(meta[key]);
    if (normalized !== void 0) return normalized;
  }
}
/** Reads the first present string metadata value from a current-to-legacy key list. */
function readString(meta, keys) {
  return readMetaValue(meta, keys, normalizeOptionalString);
}
/** Reads the first boolean metadata value without dropping false. */
function readBool(meta, keys) {
  return readMetaValue(meta, keys, (value) => (typeof value === "boolean" ? value : void 0));
}
/** Reads the first finite numeric metadata value from a current-to-legacy key list. */
function readNumber(meta, keys) {
  return readMetaValue(meta, keys, (value) =>
    typeof value === "number" && Number.isFinite(value) ? value : void 0,
  );
}
/** Reads the first safe non-negative integer metadata value, preserving zero. */
function readNonNegativeInteger(meta, keys) {
  return readMetaValue(meta, keys, (value) =>
    typeof value === "number" && Number.isSafeInteger(value) && value >= 0 ? value : void 0,
  );
}
//#endregion
export { readString as i, readNonNegativeInteger as n, readNumber as r, readBool as t };
