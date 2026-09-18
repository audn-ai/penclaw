import { a as createLazyRuntimeSurface } from "./lazy-runtime-B-Fc-m0I.js";
import { n as CLI_OUTBOUND_SEND_FACTORY } from "./outbound-send-deps-D4Ql4D3K.js";
import { a as normalizeChannelId } from "./registry-xXjI-8UE.js";
//#region src/cli/deps.ts
const NON_CHANNEL_DEP_KEYS = /* @__PURE__ */ new Set([
  "__proto__",
  "constructor",
  "cron",
  "cronConfig",
  "cronEnabled",
  "defaultAgentId",
  "enqueueSystemEvent",
  "getQueueSize",
  "hasOwnProperty",
  "inspect",
  "log",
  "migrateOrphanedSessionKeys",
  "nowMs",
  "onEvent",
  "requestHeartbeat",
  "resolveSessionStorePath",
  "runHeartbeatOnce",
  "runIsolatedAgentJob",
  "runtime",
  "sendCronFailureAlert",
  "sessionStorePath",
  "storePath",
  "then",
  "toJSON",
  "toString",
  "valueOf",
]);
function resolveKnownChannelId(raw) {
  return normalizeChannelId(raw) ?? void 0;
}
const senderCache = /* @__PURE__ */ new Map();
/**
 * Create a lazy-loading send function proxy for a channel.
 * The channel's module is loaded on first call and cached for reuse.
 */
function createLazySender(channelId, loader) {
  const loadRuntimeSend = createLazyRuntimeSurface(loader, ({ runtimeSend }) => runtimeSend);
  return async (...args) => {
    let cached = senderCache.get(channelId);
    if (!cached) {
      cached = loadRuntimeSend();
      senderCache.set(channelId, cached);
    }
    return await (await cached).sendMessage(...args);
  };
}
function createDefaultDeps() {
  const deps = {};
  const resolveSender = (channelId) =>
    createLazySender(channelId, async () => {
      const { createChannelOutboundRuntimeSend } =
        await import("./channel-outbound-send-Dsz0J_jy.js");
      return {
        runtimeSend: createChannelOutboundRuntimeSend({
          channelId,
          unavailableMessage: `${channelId} outbound adapter is unavailable.`,
        }),
      };
    });
  Object.defineProperty(deps, CLI_OUTBOUND_SEND_FACTORY, {
    configurable: false,
    enumerable: false,
    value: resolveSender,
    writable: false,
  });
  return new Proxy(deps, {
    get(target, property, receiver) {
      if (typeof property !== "string") return Reflect.get(target, property, receiver);
      const existing = Reflect.get(target, property, receiver);
      if (existing !== void 0 || NON_CHANNEL_DEP_KEYS.has(property)) return existing;
      const channelId = resolveKnownChannelId(property);
      if (!channelId) return existing;
      const sender = resolveSender(channelId);
      Reflect.set(target, property, sender, receiver);
      return sender;
    },
  });
}
//#endregion
export { createDefaultDeps as t };
