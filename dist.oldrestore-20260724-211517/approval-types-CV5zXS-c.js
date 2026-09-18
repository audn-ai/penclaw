//#region src/infra/approval-types.ts
/** Resolve approval ownership from the typed request payload, never from id spelling. */
function resolveApprovalRequestKind(request) {
  const isExec = "command" in request.request;
  if (isExec === ("title" in request.request && "description" in request.request))
    throw new Error("approval request payload does not identify exactly one owner");
  if (isExec) return "exec";
  return "plugin";
}
//#endregion
export { resolveApprovalRequestKind as t };
