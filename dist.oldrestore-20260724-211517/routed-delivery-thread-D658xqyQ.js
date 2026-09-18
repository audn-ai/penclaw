import { B as parseSessionThreadInfoFast } from "./store-CzZJhTF6.js";
//#region src/auto-reply/reply/routed-delivery-thread.ts
/** Resolves the thread id used when replies are routed through channel delivery helpers. */
/** Prefers current inbound thread ids, falling back to persisted session thread metadata. */
function resolveRoutedDeliveryThreadId(params) {
  if (params.ctx.MessageThreadId != null) return params.ctx.MessageThreadId;
  if (params.ctx.TransportThreadId != null) return params.ctx.TransportThreadId;
  return parseSessionThreadInfoFast(params.sessionKey).threadId;
}
//#endregion
export { resolveRoutedDeliveryThreadId as t };
