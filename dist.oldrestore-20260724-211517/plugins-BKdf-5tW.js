import "./registry-mc8oBRx8.js";
//#region src/channels/plugins/approvals.ts
/**
 * Returns the approval capability exposed by a channel plugin.
 */
function resolveChannelApprovalCapability(plugin) {
  return plugin?.approvalCapability;
}
/**
 * Projects a channel approval capability into the runtime approval adapter shape.
 */
function resolveChannelApprovalAdapter(plugin) {
  const capability = resolveChannelApprovalCapability(plugin);
  if (!capability) return;
  if (!capability.delivery && !capability.nativeRuntime && !capability.render && !capability.native)
    return;
  return {
    describeExecApprovalSetup: capability.describeExecApprovalSetup,
    describePluginApprovalSetup: capability.describePluginApprovalSetup,
    delivery: capability.delivery,
    nativeRuntime: capability.nativeRuntime,
    render: capability.render,
    native: capability.native,
  };
}
//#endregion
export { resolveChannelApprovalCapability as n, resolveChannelApprovalAdapter as t };
