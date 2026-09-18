import { l as listDevicePairing } from "./device-pairing-BIH9-x3P.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import "./error-runtime-BIAwr399.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import {
  a as DEVICE_PAIR_NOTIFY_SUBSCRIBER_MAX_ENTRIES,
  c as notifyRequestStoreKey,
  i as DEVICE_PAIR_NOTIFY_SEEN_REQUEST_NAMESPACE,
  l as notifySubscriberKey,
  n as DEVICE_PAIR_NOTIFY_MAX_SEEN_AGE_MS,
  o as DEVICE_PAIR_NOTIFY_SUBSCRIBER_NAMESPACE,
  r as DEVICE_PAIR_NOTIFY_SEEN_REQUEST_MAX_ENTRIES,
  u as notifySubscriberStoreKey,
} from "./notify-state-CtVEoKyd.js";
import "./device-bootstrap-C3W-yoKf.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region extensions/device-pair/notify.ts
const NOTIFY_POLL_INTERVAL_MS = 1e4;
function formatStringList(values) {
  if (!Array.isArray(values) || values.length === 0) return "none";
  const normalized = values.map((value) => value.trim()).filter((value) => value.length > 0);
  return normalized.length > 0 ? normalized.join(", ") : "none";
}
function formatRoleList(request) {
  const role = normalizeOptionalString(request.role);
  if (role) return role;
  return formatStringList(request.roles);
}
function formatScopeList(request) {
  return formatStringList(request.scopes);
}
function formatPendingRequests(pending) {
  if (pending.length === 0) return "No pending device pairing requests.";
  const lines = ["Pending device pairing requests:"];
  for (const req of pending) {
    const label = normalizeOptionalString(req.displayName) || req.deviceId;
    const platform = normalizeOptionalString(req.platform);
    const ip = normalizeOptionalString(req.remoteIp);
    const parts = [
      `- ${req.requestId}`,
      label ? `name=${label}` : null,
      platform ? `platform=${platform}` : null,
      `role=${formatRoleList(req)}`,
      `scopes=${formatScopeList(req)}`,
      ip ? `ip=${ip}` : null,
    ].filter(Boolean);
    lines.push(parts.join(" · "));
  }
  return lines.join("\n");
}
function openNotifySubscriberStore(api) {
  return api.runtime.state.openKeyedStore({
    namespace: DEVICE_PAIR_NOTIFY_SUBSCRIBER_NAMESPACE,
    maxEntries: DEVICE_PAIR_NOTIFY_SUBSCRIBER_MAX_ENTRIES,
  });
}
function openNotifySeenRequestStore(api) {
  return api.runtime.state.openKeyedStore({
    namespace: DEVICE_PAIR_NOTIFY_SEEN_REQUEST_NAMESPACE,
    maxEntries: DEVICE_PAIR_NOTIFY_SEEN_REQUEST_MAX_ENTRIES,
    defaultTtlMs: DEVICE_PAIR_NOTIFY_MAX_SEEN_AGE_MS,
  });
}
async function readNotifyState(api) {
  const subscriberStore = openNotifySubscriberStore(api);
  const seenRequestStore = openNotifySeenRequestStore(api);
  const [subscriberEntries, seenRequestEntries] = await Promise.all([
    subscriberStore.entries(),
    seenRequestStore.entries(),
  ]);
  const subscribers = subscriberEntries
    .map((entry) => entry.value)
    .toSorted((a, b) => a.addedAtMs - b.addedAtMs);
  const notifiedRequestIds = {};
  for (const entry of seenRequestEntries) {
    const requestId = normalizeOptionalString(entry.value.requestId);
    const notifiedAtMs = entry.value.notifiedAtMs;
    if (!requestId || !Number.isFinite(notifiedAtMs) || notifiedAtMs <= 0) continue;
    notifiedRequestIds[requestId] = Math.trunc(notifiedAtMs);
  }
  return {
    subscribers,
    notifiedRequestIds,
  };
}
async function writeNotifyState(api, state) {
  const subscriberStore = openNotifySubscriberStore(api);
  const nextSubscribers = new Map(
    state.subscribers.map((subscriber) => [notifySubscriberStoreKey(subscriber), subscriber]),
  );
  for (const entry of await subscriberStore.entries())
    if (!nextSubscribers.has(entry.key)) await subscriberStore.delete(entry.key);
  for (const [key, subscriber] of nextSubscribers) await subscriberStore.register(key, subscriber);
  const seenRequestStore = openNotifySeenRequestStore(api);
  const nextSeenRequests = new Map(
    Object.entries(state.notifiedRequestIds).map(([requestId, notifiedAtMs]) => [
      notifyRequestStoreKey(requestId),
      {
        requestId,
        notifiedAtMs,
      },
    ]),
  );
  for (const entry of await seenRequestStore.entries())
    if (!nextSeenRequests.has(entry.key)) await seenRequestStore.delete(entry.key);
  for (const [key, value] of nextSeenRequests)
    await seenRequestStore.register(key, value, { ttlMs: DEVICE_PAIR_NOTIFY_MAX_SEEN_AGE_MS });
}
function resolveNotifyTarget(ctx) {
  const to =
    normalizeOptionalString(ctx.senderId) ||
    normalizeOptionalString(ctx.from) ||
    normalizeOptionalString(ctx.to) ||
    "";
  if (!to) return null;
  return {
    to,
    ...(ctx.accountId ? { accountId: ctx.accountId } : {}),
    ...(ctx.messageThreadId != null ? { messageThreadId: ctx.messageThreadId } : {}),
  };
}
function upsertNotifySubscriber(subscribers, target, mode) {
  const key = notifySubscriberKey(target);
  const index = subscribers.findIndex((entry) => notifySubscriberKey(entry) === key);
  const next = {
    ...target,
    mode,
    addedAtMs: Date.now(),
  };
  if (index === -1) {
    subscribers.push(next);
    return true;
  }
  if (subscribers[index]?.mode === mode) return false;
  subscribers[index] = next;
  return true;
}
function buildPairingRequestNotificationText(request) {
  const label = normalizeOptionalString(request.displayName) || request.deviceId;
  const platform = normalizeOptionalString(request.platform);
  const ip = normalizeOptionalString(request.remoteIp);
  const role = formatRoleList(request);
  const scopes = formatScopeList(request);
  return [
    "📲 New device pairing request",
    `ID: ${request.requestId}`,
    `Name: ${label}`,
    ...(platform ? [`Platform: ${platform}`] : []),
    `Role: ${role}`,
    `Scopes: ${scopes}`,
    ...(ip ? [`IP: ${ip}`] : []),
    "",
    `Approve: /pair approve ${request.requestId}`,
    "List pending: /pair pending",
  ].join("\n");
}
function requestTimestampMs(request) {
  if (typeof request.ts !== "number" || !Number.isFinite(request.ts)) return null;
  const ts = Math.trunc(request.ts);
  return ts > 0 ? ts : null;
}
function shouldNotifySubscriberForRequest(subscriber, request) {
  if (subscriber.mode !== "once") return true;
  const ts = requestTimestampMs(request);
  if (ts == null) return false;
  return ts >= subscriber.addedAtMs;
}
async function notifySubscriber(params) {
  const send = (await params.api.runtime.channel.outbound.loadAdapter("telegram"))?.sendText;
  if (!send) {
    params.api.logger.warn(
      "device-pair: telegram outbound adapter unavailable for pairing notifications",
    );
    return false;
  }
  try {
    await send({
      cfg: params.api.config,
      to: params.subscriber.to,
      text: params.text,
      ...(params.subscriber.accountId ? { accountId: params.subscriber.accountId } : {}),
      ...(params.subscriber.messageThreadId != null
        ? { threadId: params.subscriber.messageThreadId }
        : {}),
    });
    return true;
  } catch (err) {
    params.api.logger.warn(
      `device-pair: failed to send pairing notification to ${params.subscriber.to}: ${formatErrorMessage(err)}`,
    );
    return false;
  }
}
async function notifyPendingPairingRequests(params) {
  const state = await readNotifyState(params.api);
  const pending = (await listDevicePairing()).pending;
  const now = Date.now();
  const pendingIds = new Set(pending.map((entry) => entry.requestId));
  let changed = false;
  for (const [requestId, ts] of Object.entries(state.notifiedRequestIds))
    if (!pendingIds.has(requestId) || now - ts > 864e5) {
      delete state.notifiedRequestIds[requestId];
      changed = true;
    }
  if (state.subscribers.length > 0) {
    const oneShotDelivered = /* @__PURE__ */ new Set();
    for (const request of pending) {
      if (state.notifiedRequestIds[request.requestId]) continue;
      const text = buildPairingRequestNotificationText(request);
      let delivered = false;
      for (const subscriber of state.subscribers) {
        if (!shouldNotifySubscriberForRequest(subscriber, request)) continue;
        const sent = await notifySubscriber({
          api: params.api,
          subscriber,
          text,
        });
        delivered = delivered || sent;
        if (sent && subscriber.mode === "once")
          oneShotDelivered.add(notifySubscriberKey(subscriber));
      }
      if (delivered) {
        state.notifiedRequestIds[request.requestId] = now;
        changed = true;
      }
    }
    if (oneShotDelivered.size > 0) {
      const initialCount = state.subscribers.length;
      state.subscribers = state.subscribers.filter(
        (subscriber) => !oneShotDelivered.has(notifySubscriberKey(subscriber)),
      );
      if (state.subscribers.length !== initialCount) changed = true;
    }
  }
  if (changed) await writeNotifyState(params.api, state);
}
async function armPairNotifyOnce(params) {
  if (params.ctx.channel !== "telegram") return false;
  const target = resolveNotifyTarget(params.ctx);
  if (!target) return false;
  const state = await readNotifyState(params.api);
  let changed = false;
  if (upsertNotifySubscriber(state.subscribers, target, "once")) changed = true;
  if (changed) await writeNotifyState(params.api, state);
  return true;
}
async function handleNotifyCommand(params) {
  if (params.ctx.channel !== "telegram")
    return { text: "Pairing notifications are currently supported only on Telegram." };
  const target = resolveNotifyTarget(params.ctx);
  if (!target) return { text: "Could not resolve Telegram target for this chat." };
  const state = await readNotifyState(params.api);
  const targetKey = notifySubscriberKey(target);
  const current = state.subscribers.find((entry) => notifySubscriberKey(entry) === targetKey);
  if (params.action === "on" || params.action === "enable") {
    if (upsertNotifySubscriber(state.subscribers, target, "persistent"))
      await writeNotifyState(params.api, state);
    return {
      text: "✅ Pair request notifications enabled for this Telegram chat.\nI will ping here when a new device pairing request arrives.",
    };
  }
  if (params.action === "off" || params.action === "disable") {
    const currentIndex = state.subscribers.findIndex(
      (entry) => notifySubscriberKey(entry) === targetKey,
    );
    if (currentIndex !== -1) {
      state.subscribers.splice(currentIndex, 1);
      await writeNotifyState(params.api, state);
    }
    return { text: "✅ Pair request notifications disabled for this Telegram chat." };
  }
  if (params.action === "once" || params.action === "arm") {
    await armPairNotifyOnce({
      api: params.api,
      ctx: params.ctx,
    });
    return {
      text: "✅ One-shot pairing notification armed for this Telegram chat.\nI will notify on the next new pairing request, then auto-disable.",
    };
  }
  if (params.action === "status" || params.action === "") {
    const pending = await listDevicePairing();
    const enabled = Boolean(current);
    const mode = current?.mode ?? "off";
    return {
      text: [
        `Pair request notifications: ${enabled ? "enabled" : "disabled"} for this chat.`,
        `Mode: ${mode}`,
        `Subscribers: ${state.subscribers.length}`,
        `Pending requests: ${pending.pending.length}`,
        "",
        "Use /pair notify on|off|once",
      ].join("\n"),
    };
  }
  return { text: "Usage: /pair notify on|off|once|status" };
}
function createPairingNotifierService(api) {
  let notifyInterval = null;
  return {
    id: "device-pair-notifier",
    start: async () => {
      const tick = async () => {
        await notifyPendingPairingRequests({ api });
      };
      await tick().catch((err) => {
        api.logger.warn(`device-pair: initial notify poll failed: ${formatErrorMessage(err)}`);
      });
      notifyInterval = setInterval(() => {
        tick().catch((err) => {
          api.logger.warn(`device-pair: notify poll failed: ${formatErrorMessage(err)}`);
        });
      }, NOTIFY_POLL_INTERVAL_MS);
      notifyInterval.unref?.();
    },
    stop: async () => {
      if (notifyInterval) {
        clearInterval(notifyInterval);
        notifyInterval = null;
      }
    },
  };
}
//#endregion
export {
  handleNotifyCommand as i,
  createPairingNotifierService as n,
  formatPendingRequests as r,
  armPairNotifyOnce as t,
};
