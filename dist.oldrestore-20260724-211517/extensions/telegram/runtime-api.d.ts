import { n as normalizeAccountId, t as DEFAULT_ACCOUNT_ID } from "../../account-id-Dh6XMgGH.js";
import {
  n as collectTelegramUnmentionedGroupIds,
  t as auditTelegramGroupMembership,
} from "../../audit-Drq02iIY.js";
import { t as getChatChannelMeta } from "../../channel-plugin-common-D31aKIoj.js";
import {
  n as resolveConfiguredFromCredentialStatuses,
  t as projectCredentialSnapshotFields,
} from "../../channel-status-DVZOSuaQ.js";
import {
  C as readReactionParams,
  E as readStringParam,
  T as readStringOrNumberParam,
  w as readStringArrayParam,
  x as readNumberParam,
} from "../../common-CuQ9SS3Z.js";
import { t as clearAccountEntryFields } from "../../config-helpers-DAeK6gXx.js";
import { r as buildChannelConfigSchema } from "../../config-schema-CpUUoa8V.js";
import { n as AcpRuntimeError, r as AcpRuntimeErrorCode } from "../../errors-Buu3ylDF.js";
import {
  i as shouldRetryTelegramTransportFallback,
  n as resolveTelegramFetch,
  r as resolveTelegramTransport,
} from "../../fetch-BqOpQ7W9.js";
import { n as formatPairingApproveHint } from "../../helpers-D1ImsQvd.js";
import { t as PAIRING_APPROVED_MESSAGE } from "../../pairing-message-CFjlYpMw.js";
import {
  A as OpenClawPluginServiceContext,
  W as PluginLogger,
  g as OpenClawPluginApi,
  k as OpenClawPluginService,
} from "../../plugin-entry-DPCR66aO.js";
import { a as resolvePollMaxSelections } from "../../polls-CfHkU59X.js";
import { r as probeTelegram, t as TelegramProbe } from "../../probe-CqqU3R6r.js";
import { r as makeProxyFetch } from "../../proxy-fetch-DPt1dxTl.js";
import {
  _ as resolveTelegramRuntimeGroupPolicy,
  a as monitorTelegramProvider,
  g as shouldSuppressTelegramExecApprovalForwardingFallback,
  h as buildTelegramExecApprovalPendingPayload,
  i as resolveTelegramPollVisibility,
  n as TelegramActionConfig,
  o as telegramMessageActions,
  r as TelegramNetworkConfig,
  t as TelegramAccountConfig,
} from "../../runtime-api-BHLv84Uu.js";
import {
  _ as unpinMessageTelegram,
  a as deleteMessageTelegram,
  c as editMessageTelegram,
  d as renameForumTopicTelegram,
  g as sendTypingTelegram,
  h as sendStickerTelegram,
  i as createForumTopicTelegram,
  l as pinMessageTelegram,
  m as sendPollTelegram,
  o as editForumTopicTelegram,
  p as sendMessageTelegram,
  r as TelegramApiOverride,
  s as editMessageReplyMarkupTelegram,
  t as setTelegramRuntime,
  u as reactMessageTelegram,
} from "../../runtime-CuY_VuJY.js";
import { o as buildTokenChannelStatusSummary } from "../../status-helpers-D0-IqnB6.js";
import {
  a as setTelegramThreadBindingMaxAgeBySessionKey,
  i as setTelegramThreadBindingIdleTimeoutBySessionKey,
  n as getTelegramThreadBindingManager,
  r as resetTelegramThreadBindingsForTests,
  t as createTelegramThreadBindingManager,
} from "../../thread-bindings-BQq125Mo.js";
import { r as resolveTelegramToken } from "../../token-BmfcHrcM.js";
import { t as jsonResult } from "../../tool-results-DtJKrUlx.js";
import { n as parseTelegramTopicConversation } from "../../topic-conversation-DB0Kpc_a.js";
import {
  a as AcpRuntimeEnsureInput,
  g as AcpSessionUpdateTag,
  i as AcpRuntimeDoctorReport,
  n as AcpRuntimeCapabilities,
  o as AcpRuntimeEvent,
  p as AcpRuntimeTurnInput,
  s as AcpRuntimeHandle,
  t as AcpRuntime,
  u as AcpRuntimeStatus,
} from "../../types-D85xy4rc.js";
import { Ys as emptyPluginConfigSchema, cr as PluginRuntime } from "../../types-Ga3mNO_F.js";
import { v as ChannelMessageActionAdapter } from "../../types.core-CcwzPNhX.js";
import { i as OpenClawConfig } from "../../types.openclaw-DDo8sH3F.js";
import { t as ChannelPlugin } from "../../types.plugin-BGk2f9vp.js";
import { o as TelegramConfigSchema } from "../../zod-schema.providers-core-CTizxtk1.js";
export {
  type AcpRuntime,
  type AcpRuntimeCapabilities,
  type AcpRuntimeDoctorReport,
  type AcpRuntimeEnsureInput,
  AcpRuntimeError,
  type AcpRuntimeErrorCode,
  type AcpRuntimeEvent,
  type AcpRuntimeHandle,
  type AcpRuntimeStatus,
  type AcpRuntimeTurnInput,
  type AcpSessionUpdateTag,
  type ChannelMessageActionAdapter,
  type ChannelPlugin,
  DEFAULT_ACCOUNT_ID,
  type OpenClawConfig,
  type OpenClawPluginApi,
  type OpenClawPluginService,
  type OpenClawPluginServiceContext,
  PAIRING_APPROVED_MESSAGE,
  type PluginLogger,
  type PluginRuntime,
  TelegramAccountConfig,
  TelegramActionConfig,
  type TelegramApiOverride,
  TelegramConfigSchema,
  TelegramNetworkConfig,
  type TelegramProbe,
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
