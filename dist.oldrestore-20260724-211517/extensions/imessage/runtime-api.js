import { t as DEFAULT_ACCOUNT_ID } from "../../account-id-C7N4Rwku.js";
import { a as resolveIMessageAccount } from "../../accounts--1GXl2sX.js";
import { p as formatTrimmedAllowFromEntries } from "../../channel-config-helpers-BFvX3ldW.js";
import { r as buildChannelConfigSchema } from "../../config-schema-qmCQZl6j.js";
import { c as getChatChannelMeta } from "../../core-V3U0lOIj.js";
import {
  n as resolveIMessageGroupToolPolicy,
  r as imessageMessageActions,
  t as resolveIMessageGroupRequireMention,
} from "../../group-policy-K3n-fVwn.js";
import { a as resolveChannelMediaMaxBytes } from "../../media-runtime-BhmZORKM.js";
import { t as monitorIMessageProvider } from "../../monitor-4VKDtG7H.js";
import "../../channel-status-B8fwcUOI.js";
import {
  n as normalizeIMessageMessagingTarget,
  t as looksLikeIMessageTargetId,
} from "../../normalize-D37IclcM.js";
import { t as PAIRING_APPROVED_MESSAGE } from "../../pairing-message-DNhqI-OE.js";
import { r as setIMessageRuntime } from "../../runtime-CKNRV1AW.js";
import { o as probeIMessage } from "../../sanitize-outbound-DuVgJyZw.js";
import { t as sendMessageIMessage } from "../../send-CPGPD4PZ.js";
import {
  c as collectStatusIssuesFromLastError,
  r as buildComputedAccountStatusSnapshot,
} from "../../status-helpers-SdoCNDDu.js";
import "../../config-api-C3U8VEbn.js";
import { t as chunkTextForOutbound } from "../../text-chunking-Dr19ggf-.js";
import { n as IMessageConfigSchema } from "../../zod-schema.providers-core-BNKhRce5.js";
//#region extensions/imessage/src/config-accessors.ts
function resolveIMessageConfigAllowFrom(params) {
  return (resolveIMessageAccount(params).config.allowFrom ?? []).map((entry) => String(entry));
}
function resolveIMessageConfigDefaultTo(params) {
  const defaultTo = resolveIMessageAccount(params).config.defaultTo;
  if (defaultTo == null) return;
  return defaultTo.trim() || void 0;
}
//#endregion
export {
  DEFAULT_ACCOUNT_ID,
  IMessageConfigSchema,
  PAIRING_APPROVED_MESSAGE,
  buildChannelConfigSchema,
  buildComputedAccountStatusSnapshot,
  chunkTextForOutbound,
  collectStatusIssuesFromLastError,
  formatTrimmedAllowFromEntries,
  getChatChannelMeta,
  imessageMessageActions,
  looksLikeIMessageTargetId,
  monitorIMessageProvider,
  normalizeIMessageMessagingTarget,
  probeIMessage,
  resolveChannelMediaMaxBytes,
  resolveIMessageConfigAllowFrom,
  resolveIMessageConfigDefaultTo,
  resolveIMessageGroupRequireMention,
  resolveIMessageGroupToolPolicy,
  sendMessageIMessage,
  setIMessageRuntime,
};
