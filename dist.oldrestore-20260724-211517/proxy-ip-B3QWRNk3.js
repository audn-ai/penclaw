import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import "./string-coerce-runtime-BUe4iD0r.js";
//#region extensions/voice-call/src/http-headers.ts
/** Return the first value for a header name regardless of caller casing. */
function getHeader(headers, name) {
  const target = normalizeLowercaseStringOrEmpty(name);
  const value =
    headers[target] ??
    Object.entries(headers).find(([key]) => normalizeLowercaseStringOrEmpty(key) === target)?.[1];
  if (Array.isArray(value)) return value[0];
  return value;
}
//#endregion
//#region extensions/voice-call/src/proxy-ip.ts
function normalizeProxyIp(value) {
  const trimmed = value?.trim();
  if (!trimmed) return;
  const normalized = (
    trimmed.startsWith("[") && trimmed.endsWith("]") ? trimmed.slice(1, -1) : trimmed
  ).toLowerCase();
  if (normalized.startsWith("::ffff:")) {
    const mappedIpv4 = normalized.slice(7);
    if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(mappedIpv4)) return mappedIpv4;
  }
  return normalized;
}
//#endregion
export { getHeader as n, normalizeProxyIp as t };
