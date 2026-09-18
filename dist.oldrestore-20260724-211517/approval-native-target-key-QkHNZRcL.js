import { n as channelRouteDedupeKey } from "./channel-route-u-lrE52s.js";
//#region src/infra/approval-native-target-key.ts
/** Builds the stable dedupe key used to compare channel-native approval targets. */
function buildChannelApprovalNativeTargetKey(target) {
  return channelRouteDedupeKey({
    to: target.to,
    threadId: target.threadId,
  });
}
//#endregion
export { buildChannelApprovalNativeTargetKey as t };
