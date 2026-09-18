//#region src/auto-reply/reply/reply-operation-run-state.ts
const REPLY_OPERATION_RUN_STATE = Symbol("openclaw.replyOperationRunState");
function resolveReplyOperationRunState(options) {
  return options?.[REPLY_OPERATION_RUN_STATE];
}
//#endregion
export { resolveReplyOperationRunState as n, REPLY_OPERATION_RUN_STATE as t };
