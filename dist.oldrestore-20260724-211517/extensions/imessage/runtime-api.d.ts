import { t as DEFAULT_ACCOUNT_ID } from "../../account-id-Dh6XMgGH.js";
import { g as formatTrimmedAllowFromEntries } from "../../channel-config-helpers-WkGz1Ols.js";
import { n as ChannelRuntimeSurface } from "../../channel-runtime-surface.types-CouuvmKm.js";
import { r as buildChannelConfigSchema } from "../../config-schema-CpUUoa8V.js";
import { d as getChatChannelMeta } from "../../core-UJInsb1U.js";
import { D as resolveChannelMediaMaxBytes } from "../../media-runtime-Dm8piy3T.js";
import { t as PAIRING_APPROVED_MESSAGE } from "../../pairing-message-CFjlYpMw.js";
import {
  a as looksLikeIMessageTargetId,
  o as normalizeIMessageMessagingTarget,
  r as probeIMessage,
  s as ResolvedIMessageAccount,
  t as IMessageProbe,
} from "../../probe-ZhVyEC7P.js";
import { n as RuntimeEnv } from "../../runtime-Bxifh4bY.js";
import {
  c as collectStatusIssuesFromLastError,
  r as buildComputedAccountStatusSnapshot,
} from "../../status-helpers-D0-IqnB6.js";
import {
  d as resolveIMessageGroupRequireMention,
  f as resolveIMessageGroupToolPolicy,
  n as IMessageService,
  u as parseIMessageTarget,
} from "../../targets-C_uGAwoG.js";
import { t as chunkTextForOutbound } from "../../text-chunking-B9AReq3e.js";
import { P as MessageReceipt } from "../../types-FwtQl4mH.js";
import { cr as PluginRuntime } from "../../types-Ga3mNO_F.js";
import { v as ChannelMessageActionAdapter } from "../../types.core-CcwzPNhX.js";
import { i as OpenClawConfig } from "../../types.openclaw-DDo8sH3F.js";
import { t as ChannelPlugin } from "../../types.plugin-BGk2f9vp.js";
import { n as IMessageConfigSchema } from "../../zod-schema.providers-core-CTizxtk1.js";

//#region extensions/imessage/src/config-accessors.d.ts
declare function resolveIMessageConfigAllowFrom(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
}): string[];
declare function resolveIMessageConfigDefaultTo(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
}): string | undefined;
//#endregion
//#region extensions/imessage/src/monitor/types.d.ts
type MonitorIMessageOpts = {
  runtime?: RuntimeEnv;
  abortSignal?: AbortSignal;
  cliPath?: string;
  dbPath?: string;
  accountId?: string;
  config?: OpenClawConfig;
  allowFrom?: Array<string | number>;
  groupAllowFrom?: Array<string | number>;
  includeAttachments?: boolean;
  mediaMaxMb?: number;
  requireMention?: boolean;
  /**
   * Surface for registering channel runtime contexts (e.g. the approval native
   * runtime). Threaded through from the gateway via ChannelGatewayAccountContext.
   */
  channelRuntime?: ChannelRuntimeSurface;
};
//#endregion
//#region extensions/imessage/src/monitor/monitor-provider.d.ts
declare function monitorIMessageProvider(opts?: MonitorIMessageOpts): Promise<void>;
//#endregion
//#region extensions/imessage/src/client.d.ts
type IMessageRpcNotification = {
  method: string;
  params?: unknown;
};
type IMessageRpcClientOptions = {
  cliPath?: string;
  dbPath?: string;
  runtime?: RuntimeEnv;
  onNotification?: (msg: IMessageRpcNotification) => void;
};
declare class IMessageRpcClient {
  private readonly cliPath;
  private readonly dbPath?;
  private readonly runtime?;
  private readonly onNotification?;
  private readonly pending;
  private readonly closed;
  private closedResolve;
  private child;
  private stdoutBuffer;
  private readonly stdoutDecoder;
  private nextId;
  private publicProcessError;
  constructor(opts?: IMessageRpcClientOptions);
  start(): Promise<void>;
  stop(): Promise<void>;
  waitForClose(): Promise<void>;
  request<T = unknown>(
    method: string,
    params?: Record<string, unknown>,
    opts?: {
      timeoutMs?: number;
    },
  ): Promise<T>;
  private handleStdoutChunk;
  private flushStdoutBuffer;
  private handleStdoutLine;
  private handleLine;
  private recordProcessDiagnostic;
  private buildCloseError;
  private failAll;
  private finish;
}
//#endregion
//#region extensions/imessage/src/send.d.ts
type ParsedIMessageTarget = ReturnType<typeof parseIMessageTarget>;
type IMessageSendOpts = {
  cliPath?: string;
  dbPath?: string;
  service?: IMessageService;
  region?: string;
  accountId?: string;
  replyToId?: string;
  mediaUrl?: string;
  mediaLocalRoots?: readonly string[];
  mediaReadFile?: (filePath: string) => Promise<Buffer>;
  audioAsVoice?: boolean;
  maxBytes?: number;
  timeoutMs?: number;
  chatId?: number;
  client?: IMessageRpcClient;
  config: OpenClawConfig;
  account?: ResolvedIMessageAccount;
  approvalKind?: "exec" | "plugin";
  resolveAttachmentImpl?: (
    mediaUrl: string,
    maxBytes: number,
    options?: {
      localRoots?: readonly string[];
      readFile?: (filePath: string) => Promise<Buffer>;
    },
  ) => Promise<{
    path: string;
    contentType?: string;
  }>;
  createClient?: (params: { cliPath: string; dbPath?: string }) => Promise<IMessageRpcClient>;
  runCliJson?: (args: readonly string[]) => Promise<Record<string, unknown>>;
  resolveMessageGuidImpl?: (params: {
    dbPath?: string;
    messageId: string;
  }) => Promise<string | null> | string | null;
  resolveSentMessageGuidImpl?: (params: {
    dbPath?: string;
    target: ParsedIMessageTarget;
    text: string;
    sentAfterMs?: number;
  }) => Promise<string | null> | string | null;
};
type IMessageSendResult = {
  /**
   * Generic identifier returned by the bridge. May be a GUID string, a
   * numeric ROWID stringified, or the literal "ok"/"unknown" placeholders
   * when the bridge declines to return one. Most callers (reply cache, echo
   * cache, receipts) want this field — it is the broadest match for
   * downstream lookups.
   */
  messageId: string;
  /**
   * GUID-only identifier suitable for matching inbound `reacted_to_guid`
   * fields. Undefined when the bridge returned only a numeric ROWID or
   * placeholder. Approval-reaction bindings MUST use this field so the
   * outbound key matches what the inbound tapback will surface.
   */
  guid?: string;
  sentText: string;
  echoText?: string;
  receipt: MessageReceipt;
};
declare function sendMessageIMessage(
  to: string,
  text: string,
  opts: IMessageSendOpts,
): Promise<IMessageSendResult>;
//#endregion
//#region extensions/imessage/src/actions.d.ts
declare const imessageMessageActions: ChannelMessageActionAdapter;
//#endregion
//#region extensions/imessage/src/runtime.d.ts
declare const getIMessageRuntime: () => PluginRuntime,
  setIMessageRuntime: (next: PluginRuntime) => void,
  getOptionalIMessageRuntime: () => PluginRuntime | null;
//#endregion
//#region extensions/imessage/runtime-api.d.ts
type IMessageAccountConfig = Omit<
  NonNullable<NonNullable<OpenClawConfig["channels"]>["imessage"]>,
  "accounts" | "defaultAccount"
>;
//#endregion
export {
  type ChannelPlugin,
  DEFAULT_ACCOUNT_ID,
  IMessageAccountConfig,
  IMessageConfigSchema,
  type IMessageProbe,
  type MonitorIMessageOpts,
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
