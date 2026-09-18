import { n as normalizeAccountId, t as DEFAULT_ACCOUNT_ID } from "../../account-id-C7N4Rwku.js";
import {
  a as resolveConfiguredFromCredentialStatuses,
  r as projectCredentialSnapshotFields,
} from "../../account-snapshot-fields-DYiq0cA9.js";
import {
  n as collectTelegramUnmentionedGroupIds,
  t as auditTelegramGroupMembership,
} from "../../audit-B1ygGhHT.js";
import { n as getChatChannelMeta } from "../../chat-meta-B_W7YKQn.js";
import {
  _ as readStringArrayParam,
  g as readReactionParams,
  m as readNumberParam,
  v as readStringOrNumberParam,
  y as readStringParam,
} from "../../common-DyDSUect.js";
import { t as clearAccountEntryFields } from "../../config-helpers-CGWarYiR.js";
import { r as emptyPluginConfigSchema } from "../../config-schema-D48VtTjI.js";
import { r as buildChannelConfigSchema } from "../../config-schema-qmCQZl6j.js";
import { n as AcpRuntimeError } from "../../errors-BTjUwYsc.js";
import {
  i as shouldRetryTelegramTransportFallback,
  n as resolveTelegramFetch,
  r as resolveTelegramTransport,
} from "../../fetch-C3cVXJjY.js";
import { r as resolveTelegramRuntimeGroupPolicy } from "../../group-access-CsWTRSQo.js";
import { n as formatPairingApproveHint } from "../../helpers-BzNF0htn.js";
import { t as PAIRING_APPROVED_MESSAGE } from "../../pairing-message-DNhqI-OE.js";
import "../../channel-core-Z_rV5hXh.js";
import { t as resolveTelegramPollVisibility } from "../../poll-visibility-Ds4ydsWS.js";
import { r as resolvePollMaxSelections } from "../../polls-C-v11_tu.js";
import "../../acp-runtime-DyDCRcAX.js";
import {
  a as buildTelegramExecApprovalPendingPayload,
  o as shouldSuppressTelegramExecApprovalForwardingFallback,
  r as monitorTelegramProvider,
  s as telegramMessageActions,
  t as probeTelegram,
} from "../../probe-DCMHJuy6.js";
import "../../channel-plugin-common-BUOWmTDS.js";
import { r as makeProxyFetch } from "../../proxy-fetch-BNm7PiNO.js";
import "../../channel-status-B8fwcUOI.js";
import { r as setTelegramRuntime } from "../../runtime-B_f_VNpK.js";
import "../../channel-actions-C9vNf9jw.js";
import {
  a as editMessageTelegram,
  c as renameForumTopicTelegram,
  d as sendMessageTelegram,
  f as sendPollTelegram,
  g as unpinMessageTelegram,
  i as editMessageReplyMarkupTelegram,
  m as sendTypingTelegram,
  n as deleteMessageTelegram,
  o as pinMessageTelegram,
  p as sendStickerTelegram,
  r as editForumTopicTelegram,
  s as reactMessageTelegram,
  t as createForumTopicTelegram,
} from "../../send-CfVpuwvn.js";
import { o as buildTokenChannelStatusSummary } from "../../status-helpers-SdoCNDDu.js";
import {
  c as setTelegramThreadBindingMaxAgeBySessionKey,
  i as getTelegramThreadBindingManager,
  o as resetTelegramThreadBindingsForTests,
  r as createTelegramThreadBindingManager,
  s as setTelegramThreadBindingIdleTimeoutBySessionKey,
} from "../../thread-bindings-s6Uy3BmF.js";
import "../../config-api-BmSj5U96.js";
import { n as resolveTelegramToken } from "../../token-iK1olK6e.js";
import { t as jsonResult } from "../../tool-results-BCM3fdVS.js";
import { t as parseTelegramTopicConversation } from "../../topic-conversation-B6kdtLDb.js";
import { o as TelegramConfigSchema } from "../../zod-schema.providers-core-BNKhRce5.js";
export {
  AcpRuntimeError,
  DEFAULT_ACCOUNT_ID,
  PAIRING_APPROVED_MESSAGE,
  TelegramConfigSchema,
  auditTelegramGroupMembership,
  buildChannelConfigSchema,
  buildTelegramExecApprovalPendingPayload,
  buildTokenChannelStatusSummary,
  clearAccountEntryFields,
  collectTelegramUnmentionedGroupIds,
  createForumTopicTelegram,
  createTelegramThreadBindingManager,
  deleteMessageTelegram,
  editForumTopicTelegram,
  editMessageReplyMarkupTelegram,
  editMessageTelegram,
  emptyPluginConfigSchema,
  formatPairingApproveHint,
  getChatChannelMeta,
  getTelegramThreadBindingManager,
  jsonResult,
  makeProxyFetch,
  monitorTelegramProvider,
  normalizeAccountId,
  parseTelegramTopicConversation,
  pinMessageTelegram,
  probeTelegram,
  projectCredentialSnapshotFields,
  reactMessageTelegram,
  readNumberParam,
  readReactionParams,
  readStringArrayParam,
  readStringOrNumberParam,
  readStringParam,
  renameForumTopicTelegram,
  resetTelegramThreadBindingsForTests,
  resolveConfiguredFromCredentialStatuses,
  resolvePollMaxSelections,
  resolveTelegramFetch,
  resolveTelegramPollVisibility,
  resolveTelegramRuntimeGroupPolicy,
  resolveTelegramToken,
  resolveTelegramTransport,
  sendMessageTelegram,
  sendPollTelegram,
  sendStickerTelegram,
  sendTypingTelegram,
  setTelegramRuntime,
  setTelegramThreadBindingIdleTimeoutBySessionKey,
  setTelegramThreadBindingMaxAgeBySessionKey,
  shouldRetryTelegramTransportFallback,
  shouldSuppressTelegramExecApprovalForwardingFallback,
  telegramMessageActions,
  unpinMessageTelegram,
};
