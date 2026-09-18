import { createHash } from "node:crypto";
import "./runtime-env-D0V-7Gqz.js";
import { r as logVerbose } from "./globals-CNUzHTcU.js";
import { t as getIMessageRuntime } from "./runtime-CKNRV1AW.js";
//#region extensions/imessage/src/monitor/echo-text-corruption.ts
function isLeadingEchoTextCorruptionMarker(code) {
  return code === 0 || code === 65279 || code === 65533 || code === 65534 || code === 65535;
}
function stripLeadingEchoTextCorruptionMarkers(text) {
  let offset = 0;
  while (offset < text.length && isLeadingEchoTextCorruptionMarker(text.charCodeAt(offset)))
    offset += 1;
  return offset === 0 ? text : text.slice(offset);
}
//#endregion
//#region extensions/imessage/src/monitor/persisted-echo-cache.ts
const IMESSAGE_SENT_ECHOES_TTL_MS = 720 * 60 * 1e3;
const IMESSAGE_SENT_ECHOES_NAMESPACE = "imessage.sent-echoes";
function normalizeText(text) {
  if (!text) return;
  return (
    stripLeadingEchoTextCorruptionMarkers(text.replace(/\r\n?/g, "\n").trim()).trim() || void 0
  );
}
function normalizeMessageId(messageId) {
  const normalized = messageId?.trim();
  if (!normalized || normalized === "ok" || normalized === "unknown") return;
  return normalized;
}
let mirror = null;
let persistenceFailureLogged = false;
function reportFailure(scope, err) {
  if (persistenceFailureLogged) return;
  persistenceFailureLogged = true;
  logVerbose(`imessage echo-cache: ${scope} disabled after first failure: ${String(err)}`);
}
function resolveIMessageSentEchoEntryKey(entry) {
  return createHash("sha256")
    .update(JSON.stringify([entry.scope, entry.text ?? "", entry.messageId ?? "", entry.timestamp]))
    .digest("hex")
    .slice(0, 32);
}
function openPersistedEchoStore() {
  return getIMessageRuntime().state.openSyncKeyedStore({
    namespace: IMESSAGE_SENT_ECHOES_NAMESPACE,
    maxEntries: 256,
  });
}
function remainingTtlMs(timestamp) {
  const remaining = IMESSAGE_SENT_ECHOES_TTL_MS - Math.max(0, Date.now() - timestamp);
  return remaining > 0 ? remaining : void 0;
}
function resolveEntryTtlMs(entry, ttlMs) {
  if (typeof ttlMs === "number" && Number.isFinite(ttlMs) && ttlMs > 0) return ttlMs;
  return remainingTtlMs(entry.timestamp);
}
function isLiveEntry(entry, now = Date.now()) {
  const cutoff = now - IMESSAGE_SENT_ECHOES_TTL_MS;
  return entry.timestamp >= cutoff && (entry.expiresAt == null || entry.expiresAt > now);
}
function loadMirrorFromStore() {
  try {
    mirror = openPersistedEchoStore()
      .entries()
      .map(({ value }) => value)
      .filter((entry) => isLiveEntry(entry))
      .toSorted((a, b) => a.timestamp - b.timestamp)
      .slice(-256);
  } catch (err) {
    reportFailure("read", err);
    mirror = [];
  }
}
function readRecentEntries() {
  loadMirrorFromStore();
  return mirror ?? [];
}
function persistEntry(entry, ttlMs) {
  const effectiveTtlMs = resolveEntryTtlMs(entry, ttlMs);
  if (!effectiveTtlMs) return;
  const key = resolveIMessageSentEchoEntryKey(entry);
  try {
    openPersistedEchoStore().register(key, entry, { ttlMs: effectiveTtlMs });
  } catch (err) {
    reportFailure("write", err);
    return;
  }
  return key;
}
function rememberPersistedIMessageEcho(params) {
  const text = normalizeText(params.text);
  const messageId = normalizeMessageId(params.messageId);
  const entry = {
    scope: params.scope,
    timestamp: Date.now(),
    ...(text ? { text } : {}),
    ...(messageId ? { messageId } : {}),
    ...(params.pending ? { pending: true } : {}),
  };
  if (typeof params.ttlMs === "number" && Number.isFinite(params.ttlMs) && params.ttlMs > 0)
    entry.expiresAt = entry.timestamp + params.ttlMs;
  if (!entry.text && !entry.messageId) return;
  loadMirrorFromStore();
  const key = persistEntry(entry, params.ttlMs);
  mirror = [...(mirror ?? []), entry].filter((candidate) => isLiveEntry(candidate)).slice(-256);
  return key;
}
function forgetPersistedIMessageEchoKey(key) {
  if (!key) return;
  try {
    openPersistedEchoStore().delete(key);
  } catch (err) {
    reportFailure("delete", err);
  }
  mirror = (mirror ?? []).filter((entry) => resolveIMessageSentEchoEntryKey(entry) !== key);
}
function hasPersistedIMessageEcho(params) {
  const text = normalizeText(params.text);
  const messageId = normalizeMessageId(params.messageId);
  if (!text && !messageId) return false;
  for (const entry of readRecentEntries()) {
    if (entry.scope !== params.scope) continue;
    if (messageId && entry.messageId === messageId) return true;
    if (text && entry.text === text && (!entry.pending || params.includePendingText)) return true;
  }
  return false;
}
//#endregion
export {
  rememberPersistedIMessageEcho as a,
  hasPersistedIMessageEcho as i,
  IMESSAGE_SENT_ECHOES_TTL_MS as n,
  resolveIMessageSentEchoEntryKey as o,
  forgetPersistedIMessageEchoKey as r,
  stripLeadingEchoTextCorruptionMarkers as s,
  IMESSAGE_SENT_ECHOES_NAMESPACE as t,
};
