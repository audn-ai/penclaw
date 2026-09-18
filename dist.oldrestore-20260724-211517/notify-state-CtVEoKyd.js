import { createHash } from "node:crypto";
import "./string-coerce-runtime-BUe4iD0r.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region extensions/device-pair/notify-state.ts
const DEVICE_PAIR_NOTIFY_LEGACY_STATE_FILE = "device-pair-notify.json";
const DEVICE_PAIR_NOTIFY_SUBSCRIBER_NAMESPACE = "notify-subscribers";
const DEVICE_PAIR_NOTIFY_SEEN_REQUEST_NAMESPACE = "notify-seen-requests";
const DEVICE_PAIR_NOTIFY_SUBSCRIBER_MAX_ENTRIES = 1024;
const DEVICE_PAIR_NOTIFY_SEEN_REQUEST_MAX_ENTRIES = 4096;
const DEVICE_PAIR_NOTIFY_MAX_SEEN_AGE_MS = 1440 * 60 * 1e3;
function normalizeLegacyNotifyState(raw) {
  const root = typeof raw === "object" && raw !== null ? raw : {};
  const subscribersRaw = Array.isArray(root.subscribers) ? root.subscribers : [];
  const notifiedRaw =
    typeof root.notifiedRequestIds === "object" && root.notifiedRequestIds !== null
      ? root.notifiedRequestIds
      : {};
  const subscribers = [];
  for (const item of subscribersRaw) {
    if (typeof item !== "object" || item === null) continue;
    const record = item;
    const to = normalizeOptionalString(record.to) ?? "";
    if (!to) continue;
    const accountId = normalizeOptionalString(record.accountId) ?? void 0;
    const messageThreadId =
      typeof record.messageThreadId === "string"
        ? normalizeOptionalString(record.messageThreadId) || void 0
        : typeof record.messageThreadId === "number" && Number.isFinite(record.messageThreadId)
          ? Math.trunc(record.messageThreadId)
          : void 0;
    const mode = record.mode === "once" ? "once" : "persistent";
    const addedAtMs =
      typeof record.addedAtMs === "number" && Number.isFinite(record.addedAtMs)
        ? Math.trunc(record.addedAtMs)
        : Date.now();
    subscribers.push({
      to,
      accountId,
      messageThreadId,
      mode,
      addedAtMs,
    });
  }
  const notifiedRequestIds = {};
  for (const [requestId, ts] of Object.entries(notifiedRaw)) {
    const normalizedRequestId = normalizeOptionalString(requestId);
    if (!normalizedRequestId) continue;
    if (typeof ts !== "number" || !Number.isFinite(ts) || ts <= 0) continue;
    notifiedRequestIds[normalizedRequestId] = Math.trunc(ts);
  }
  return {
    subscribers,
    notifiedRequestIds,
  };
}
function normalizeNotifyThreadKey(messageThreadId) {
  if (typeof messageThreadId === "number" && Number.isFinite(messageThreadId))
    return String(Math.trunc(messageThreadId));
  if (typeof messageThreadId !== "string") return "";
  const normalized = normalizeOptionalString(messageThreadId);
  if (!normalized) return "";
  if (!/^-?\d+$/u.test(normalized)) return normalized;
  try {
    return BigInt(normalized).toString();
  } catch {
    return normalized;
  }
}
function notifySubscriberKey(subscriber) {
  return JSON.stringify([
    subscriber.to,
    subscriber.accountId ?? "",
    normalizeNotifyThreadKey(subscriber.messageThreadId),
  ]);
}
function hashStoreKey(value) {
  return createHash("sha256").update(value).digest("hex");
}
function notifySubscriberStoreKey(subscriber) {
  return hashStoreKey(notifySubscriberKey(subscriber));
}
function notifyRequestStoreKey(requestId) {
  return hashStoreKey(requestId);
}
//#endregion
export {
  DEVICE_PAIR_NOTIFY_SUBSCRIBER_MAX_ENTRIES as a,
  notifyRequestStoreKey as c,
  DEVICE_PAIR_NOTIFY_SEEN_REQUEST_NAMESPACE as i,
  notifySubscriberKey as l,
  DEVICE_PAIR_NOTIFY_MAX_SEEN_AGE_MS as n,
  DEVICE_PAIR_NOTIFY_SUBSCRIBER_NAMESPACE as o,
  DEVICE_PAIR_NOTIFY_SEEN_REQUEST_MAX_ENTRIES as r,
  normalizeLegacyNotifyState as s,
  DEVICE_PAIR_NOTIFY_LEGACY_STATE_FILE as t,
  notifySubscriberStoreKey as u,
};
