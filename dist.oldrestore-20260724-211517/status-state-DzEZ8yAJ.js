//#region src/channels/plugins/status-state.ts
/**
 * Human-readable channel status-state labels for status output.
 */
function formatChannelStatusState(statusState) {
  switch (statusState) {
    case "linked":
      return "linked";
    case "not-linked":
      return "not linked";
    case "unstable":
      return "auth stabilizing";
    default:
      return statusState;
  }
}
//#endregion
export { formatChannelStatusState as t };
