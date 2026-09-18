import { t as hasExplicitCommandContextText } from "./context-text-DMuk8Wh5.js";
import "./errors-CDrK1ZOW.js";
import "./registry-BVG2dQ33.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-B-Fc-m0I.js";
//#region src/plugin-sdk/acp-runtime-backend.ts
const loadDispatchAcpRuntime = createLazyRuntimeModule(() => import("./dispatch-acp.runtime.js"));
/**
 * Dispatch a plugin reply hook through ACP when the event targets an ACP-bound session.
 * Returns a handled result only when ACP consumes the reply; otherwise callers continue normal delivery.
 */
async function tryDispatchAcpReplyHook(event, ctx) {
  if (
    event.sendPolicy === "deny" &&
    !event.suppressUserDelivery &&
    !hasExplicitCommandContextText(event.ctx) &&
    !event.isTailDispatch
  )
    return;
  const runtime = await loadDispatchAcpRuntime();
  const bypassForCommand = await runtime.shouldBypassAcpDispatchForCommand(event.ctx, ctx.cfg);
  if (
    event.sendPolicy === "deny" &&
    !event.suppressUserDelivery &&
    !bypassForCommand &&
    !event.isTailDispatch
  )
    return;
  const result = await runtime.tryDispatchAcpReply({
    ctx: event.ctx,
    cfg: ctx.cfg,
    dispatcher: ctx.dispatcher,
    runId: event.runId,
    sessionKey: event.sessionKey,
    toolsAllow: event.toolsAllow,
    images: event.images,
    abortSignal: ctx.abortSignal,
    inboundAudio: event.inboundAudio,
    sessionTtsAuto: event.sessionTtsAuto,
    ttsChannel: event.ttsChannel,
    suppressUserDelivery: event.suppressUserDelivery,
    suppressReplyLifecycle: event.suppressReplyLifecycle === true || event.sendPolicy === "deny",
    sourceReplyDeliveryMode: event.sourceReplyDeliveryMode,
    shouldRouteToOriginating: event.shouldRouteToOriginating,
    originatingChannel: event.originatingChannel,
    originatingTo: event.originatingTo,
    originatingAccountId: event.originatingAccountId,
    originatingThreadId: event.originatingThreadId,
    originatingChatType: event.originatingChatType,
    shouldSendToolSummaries: event.shouldSendToolSummaries,
    shouldSendToolSummariesNow: () => event.shouldSendToolSummaries,
    bypassForCommand,
    onReplyStart: ctx.onReplyStart,
    recordProcessed: ctx.recordProcessed,
    markIdle: ctx.markIdle,
  });
  if (!result) return;
  return {
    handled: true,
    queuedFinal: result.queuedFinal,
    counts: result.counts,
  };
}
//#endregion
export { tryDispatchAcpReplyHook as t };
