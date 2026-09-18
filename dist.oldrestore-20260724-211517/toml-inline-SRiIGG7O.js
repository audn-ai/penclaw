import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
//#region src/agents/cli-runner/toml-inline.ts
/**
 * Minimal TOML inline serializer for CLI config overrides.
 */
function escapeTomlString(value) {
  return value.replaceAll("\\", "\\\\").replaceAll('"', '\\"');
}
function formatTomlKey(key) {
  return /^[A-Za-z0-9_-]+$/.test(key) ? key : `"${escapeTomlString(key)}"`;
}
/** Serialize a supported value into TOML inline syntax. */
function serializeTomlInlineValue(value) {
  if (typeof value === "string") return `"${escapeTomlString(value)}"`;
  if (typeof value === "number" || typeof value === "bigint") return String(value);
  if (typeof value === "boolean") return value ? "true" : "false";
  if (Array.isArray(value))
    return `[${value.map((entry) => serializeTomlInlineValue(entry)).join(", ")}]`;
  if (isRecord(value))
    return `{ ${Object.entries(value)
      .map(([key, entry]) => `${formatTomlKey(key)} = ${serializeTomlInlineValue(entry)}`)
      .join(", ")} }`;
  throw new Error(`Unsupported TOML inline value: ${String(value)}`);
}
/** Format one CLI config override as `key=value`. */
function formatTomlConfigOverride(key, value) {
  return `${key}=${serializeTomlInlineValue(value)}`;
}
//#endregion
export { serializeTomlInlineValue as n, formatTomlConfigOverride as t };
