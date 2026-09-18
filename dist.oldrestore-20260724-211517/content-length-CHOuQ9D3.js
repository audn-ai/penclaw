//#region packages/media-core/src/content-length.ts
/** Parses a Content-Length header as a safe integer or rejects malformed values. */
function parseMediaContentLength(raw) {
  if (raw === null) return null;
  const values = raw.split(",").map((value) => value.replace(/^[\t ]+|[\t ]+$/g, ""));
  const value = values[0] ?? "";
  if (!/^\d+$/.test(value) || values.some((candidate) => candidate !== value))
    throw new Error(`invalid content-length header: ${raw}`);
  const size = Number(value);
  if (!Number.isSafeInteger(size)) throw new Error(`invalid content-length header: ${raw}`);
  return size;
}
//#endregion
export { parseMediaContentLength as t };
