import { n as channelRouteDedupeKey } from "./channel-route-u-lrE52s.js";
import {
  i as mergeDeliveryContext,
  o as normalizeDeliveryContext,
} from "./delivery-context.shared-WPZGmi9R.js";
import "./src-Bl7G9qvi.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { t as resolveGlobalMap } from "./global-singleton-PwlQSEal.js";
import {
  c as normalizeOptionalString,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
import { t as sanitizeInboundSystemTags } from "./system-tags-Q468PeYF.js";
//#region src/infra/system-events.ts
const MAX_EVENTS = 20;
const queues = resolveGlobalMap(Symbol.for("openclaw.systemEvents.queues"));
function requireSessionKey(key) {
  const trimmed = normalizeOptionalString(key) ?? "";
  if (!trimmed) throw new Error("system events require a sessionKey");
  return trimmed;
}
function normalizeContextKey(key) {
  return normalizeOptionalLowercaseString(key) ?? null;
}
function getSessionQueue(sessionKey) {
  return queues.get(requireSessionKey(sessionKey));
}
function getOrCreateSessionQueue(sessionKey) {
  const key = requireSessionKey(sessionKey);
  const existing = queues.get(key);
  if (existing) return existing;
  const created = {
    queue: [],
    lastContextKey: null,
  };
  queues.set(key, created);
  return created;
}
function cloneSystemEvent(event) {
  return {
    ...event,
    ...(event.deliveryContext ? { deliveryContext: { ...event.deliveryContext } } : {}),
  };
}
function isSystemEventContextChanged(sessionKey, contextKey) {
  const existing = getSessionQueue(sessionKey);
  return normalizeContextKey(contextKey) !== (existing?.lastContextKey ?? null);
}
function findDuplicateInQueue(queue, text, contextKey, deliveryContext) {
  const incoming = {
    text,
    contextKey,
    deliveryContext,
  };
  if (contextKey === null) {
    const last = queue[queue.length - 1];
    return last ? isDuplicateSystemEvent(last, incoming) : false;
  }
  return queue.some((event) => isDuplicateSystemEvent(event, incoming));
}
function enqueueSystemEventEntry(text, options) {
  if (options.replace) return replaceSystemEventEntry(text, options);
  const entry = getOrCreateSessionQueue(requireSessionKey(options.sessionKey));
  const cleaned = sanitizeInboundSystemTags(text).trim();
  if (!cleaned) return null;
  const normalizedContextKey = normalizeContextKey(options.contextKey);
  const normalizedDeliveryContext = normalizeDeliveryContext(options.deliveryContext);
  if (findDuplicateInQueue(entry.queue, cleaned, normalizedContextKey, normalizedDeliveryContext))
    return null;
  if (normalizedContextKey !== null) entry.lastContextKey = normalizedContextKey;
  const event = {
    text: cleaned,
    ts: Date.now(),
    contextKey: normalizedContextKey,
    deliveryContext: normalizedDeliveryContext,
  };
  entry.queue.push(event);
  if (entry.queue.length > MAX_EVENTS) entry.queue.shift();
  return cloneSystemEvent(event);
}
function enqueueSystemEvent(text, options) {
  return enqueueSystemEventEntry(text, options) !== null;
}
function drainSystemEventEntries(sessionKey) {
  const key = requireSessionKey(sessionKey);
  const entry = getSessionQueue(key);
  if (!entry || entry.queue.length === 0) return [];
  const out = entry.queue.map(cloneSystemEvent);
  entry.queue.length = 0;
  entry.lastContextKey = null;
  queues.delete(key);
  return out;
}
function areDeliveryContextsEqual(left, right) {
  if (!left && !right) return true;
  if (!left || !right) return false;
  return channelRouteDedupeKey(left) === channelRouteDedupeKey(right);
}
function replaceSystemEventEntry(text, options) {
  const entry = getOrCreateSessionQueue(requireSessionKey(options.sessionKey));
  const cleaned = sanitizeInboundSystemTags(text).trim();
  if (!cleaned) return null;
  const normalizedContextKey = normalizeContextKey(options.contextKey);
  if (normalizedContextKey === null) throw new Error("replaced system events require a contextKey");
  const normalizedDeliveryContext = normalizeDeliveryContext(options.deliveryContext);
  const matching = entry.queue.filter(
    (event) =>
      (event.contextKey ?? null) === normalizedContextKey &&
      areDeliveryContextsEqual(event.deliveryContext, normalizedDeliveryContext),
  );
  if (matching.length === 1 && matching[0]?.text === cleaned) return null;
  entry.queue = entry.queue.filter(
    (event) =>
      (event.contextKey ?? null) !== normalizedContextKey ||
      !areDeliveryContextsEqual(event.deliveryContext, normalizedDeliveryContext),
  );
  const event = {
    text: cleaned,
    ts: Date.now(),
    contextKey: normalizedContextKey,
    deliveryContext: normalizedDeliveryContext,
  };
  entry.queue.push(event);
  if (entry.queue.length > MAX_EVENTS) entry.queue.shift();
  entry.lastContextKey = normalizedContextKey;
  return cloneSystemEvent(event);
}
function isDuplicateSystemEvent(existing, incoming) {
  return (
    existing.text === incoming.text &&
    (existing.contextKey ?? null) === (incoming.contextKey ?? null) &&
    areDeliveryContextsEqual(existing.deliveryContext, incoming.deliveryContext)
  );
}
function areSystemEventsEqual(left, right) {
  return (
    left.text === right.text &&
    left.ts === right.ts &&
    (left.contextKey ?? null) === (right.contextKey ?? null) &&
    areDeliveryContextsEqual(left.deliveryContext, right.deliveryContext)
  );
}
function resetQueueState(key, entry) {
  if (entry.queue.length === 0) {
    entry.lastContextKey = null;
    queues.delete(key);
    return;
  }
  for (let index = entry.queue.length - 1; index >= 0; index -= 1) {
    const contextKey = expectDefined(entry.queue[index], "queue entry at index").contextKey ?? null;
    if (contextKey !== null) {
      entry.lastContextKey = contextKey;
      return;
    }
  }
  entry.lastContextKey = null;
}
function consumeSystemEventEntries(sessionKey, consumedEntries) {
  const key = requireSessionKey(sessionKey);
  const entry = getSessionQueue(key);
  if (!entry || entry.queue.length === 0 || consumedEntries.length === 0) return [];
  if (
    consumedEntries.length > entry.queue.length ||
    !consumedEntries.every((event, index) =>
      areSystemEventsEqual(expectDefined(entry.queue[index], "queue entry at index"), event),
    )
  )
    return consumeSelectedSystemEventEntries(key, consumedEntries);
  const removed = entry.queue.splice(0, consumedEntries.length).map(cloneSystemEvent);
  resetQueueState(key, entry);
  return removed;
}
function consumeSelectedSystemEventEntries(sessionKey, consumedEntries) {
  const key = requireSessionKey(sessionKey);
  const entry = getSessionQueue(key);
  if (!entry || entry.queue.length === 0 || consumedEntries.length === 0) return [];
  const removed = [];
  for (const consumed of consumedEntries) {
    const index = entry.queue.findIndex((event) => areSystemEventsEqual(event, consumed));
    if (index === -1) continue;
    const [event] = entry.queue.splice(index, 1);
    if (event) removed.push(cloneSystemEvent(event));
  }
  resetQueueState(key, entry);
  return removed;
}
function drainSystemEvents(sessionKey) {
  return drainSystemEventEntries(sessionKey).map((event) => event.text);
}
function peekSystemEventEntries(sessionKey) {
  return getSessionQueue(sessionKey)?.queue.map(cloneSystemEvent) ?? [];
}
function peekSystemEvents(sessionKey) {
  return peekSystemEventEntries(sessionKey).map((event) => event.text);
}
function hasSystemEvents(sessionKey) {
  return (getSessionQueue(sessionKey)?.queue.length ?? 0) > 0;
}
function resolveSystemEventDeliveryContext(events) {
  let resolved;
  for (const event of events) resolved = mergeDeliveryContext(event.deliveryContext, resolved);
  return resolved;
}
function resetSystemEventsForTest() {
  queues.clear();
}
//#endregion
export {
  enqueueSystemEvent as a,
  isSystemEventContextChanged as c,
  resetSystemEventsForTest as d,
  resolveSystemEventDeliveryContext as f,
  drainSystemEvents as i,
  peekSystemEventEntries as l,
  consumeSystemEventEntries as n,
  enqueueSystemEventEntry as o,
  drainSystemEventEntries as r,
  hasSystemEvents as s,
  consumeSelectedSystemEventEntries as t,
  peekSystemEvents as u,
};
