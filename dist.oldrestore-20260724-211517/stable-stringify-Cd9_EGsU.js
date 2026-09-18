import { Buffer } from "node:buffer";
//#region src/agents/stable-stringify.ts
/**
 * Stable stringify helper.
 * Serializes arbitrary values with deterministic key ordering and explicit
 * handling for errors, binary data, bigint, non-finite numbers, and cycles.
 */
const preserveString = (value) => value;
/** Deterministically stringifies values, optionally normalizing strings before key ordering. */
function stableStringify(value, normalizeString = preserveString) {
  return stringifyStableValue(value, /* @__PURE__ */ new WeakSet(), normalizeString);
}
function stringifyStableValue(value, stack, normalizeString) {
  if (value === null || value === void 0) return String(value);
  if (typeof value === "number" && !Number.isFinite(value)) return JSON.stringify(String(value));
  if (typeof value === "bigint") return JSON.stringify(value.toString());
  if (typeof value === "string") return JSON.stringify(normalizeString(value));
  if (typeof value !== "object") return JSON.stringify(value) ?? "null";
  if (stack.has(value)) return JSON.stringify("[Circular]");
  stack.add(value);
  try {
    return stringifyObjectValue(value, stack, normalizeString);
  } finally {
    stack.delete(value);
  }
}
function stringifyObjectValue(value, stack, normalizeString) {
  if (value instanceof Error)
    return stringifyStableValue(
      {
        name: value.name,
        message: value.message,
        stack: value.stack,
      },
      stack,
      normalizeString,
    );
  if (value instanceof Uint8Array)
    return stringifyStableValue(
      {
        type: "Uint8Array",
        data: Buffer.from(value).toString("base64"),
      },
      stack,
      normalizeString,
    );
  if (Array.isArray(value)) {
    const serializedEntries = [];
    for (const entry of value)
      serializedEntries.push(stringifyStableValue(entry, stack, normalizeString));
    return `[${serializedEntries.join(",")}]`;
  }
  const record = value;
  const entries = Object.keys(record)
    .map((key) => ({
      key,
      normalizedKey: normalizeString(key),
    }))
    .toSorted((left, right) => {
      return (
        compareStableStrings(left.normalizedKey, right.normalizedKey) ||
        compareStableStrings(left.key, right.key)
      );
    });
  const serializedFields = [];
  for (const { key, normalizedKey } of entries)
    serializedFields.push(
      `${JSON.stringify(normalizedKey)}:${stringifyStableValue(record[key], stack, normalizeString)}`,
    );
  return `{${serializedFields.join(",")}}`;
}
function compareStableStrings(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}
//#endregion
export { stableStringify as t };
