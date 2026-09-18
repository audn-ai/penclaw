import {
  n as dispatchInboundMessageWithBufferedDispatcher,
  r as dispatchInboundMessageWithDispatcher,
} from "./dispatch-BG0SdZGw.js";
//#region src/auto-reply/reply/provider-dispatcher.ts
/** Dispatch a reply using the buffered block dispatcher path. */
const dispatchReplyWithBufferedBlockDispatcher = async (params) => {
  return await dispatchInboundMessageWithBufferedDispatcher({
    ctx: params.ctx,
    cfg: params.cfg,
    dispatcherOptions: params.dispatcherOptions,
    toolsAllow: params.toolsAllow,
    replyResolver: params.replyResolver,
    replyOptions: params.replyOptions,
  });
};
/** Dispatch a reply using the standard dispatcher path. */
const dispatchReplyWithDispatcher = async (params) => {
  return await dispatchInboundMessageWithDispatcher({
    ctx: params.ctx,
    cfg: params.cfg,
    dispatcherOptions: params.dispatcherOptions,
    toolsAllow: params.toolsAllow,
    replyResolver: params.replyResolver,
    replyOptions: params.replyOptions,
  });
};
//#endregion
export { dispatchReplyWithDispatcher as n, dispatchReplyWithBufferedBlockDispatcher as t };
