import { t as isStringOption } from "./string-readers-A0wspDGq.js";
//#region src/utils/message-channel-constants.ts
const INTERNAL_MESSAGE_CHANNEL = "webchat";
function internalSessionConversationId(channelId, sessionKey) {
  return channelId === "webchat" ? sessionKey : void 0;
}
const INTERNAL_NON_DELIVERY_CHANNELS = ["heartbeat", "cron", "webhook", "voice", "sessions_send"];
function isInternalNonDeliveryChannel(value) {
  return isStringOption(value, INTERNAL_NON_DELIVERY_CHANNELS);
}
const NATIVE_APPROVAL_CHANNELS = [
  "webchat",
  "discord",
  "googlechat",
  "imessage",
  "matrix",
  "qqbot",
  "signal",
  "slack",
  "telegram",
  "whatsapp",
];
function isNativeApprovalChannel(value) {
  return isStringOption(value, NATIVE_APPROVAL_CHANNELS);
}
//#endregion
export {
  isNativeApprovalChannel as i,
  internalSessionConversationId as n,
  isInternalNonDeliveryChannel as r,
  INTERNAL_MESSAGE_CHANNEL as t,
};
