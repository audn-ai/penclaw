import { n as normalizeAccountId, t as DEFAULT_ACCOUNT_ID } from "../account-id-Dh6XMgGH.js";
import { t as getChatChannelMeta } from "../channel-plugin-common-D31aKIoj.js";
import {
  n as resolveConfiguredFromCredentialStatuses,
  t as projectCredentialSnapshotFields,
} from "../channel-status-DVZOSuaQ.js";
import { r as buildChannelConfigSchema } from "../config-schema-CpUUoa8V.js";
import { t as PAIRING_APPROVED_MESSAGE } from "../pairing-message-CFjlYpMw.js";
import {
  s as migrateBaseNameToDefaultAccount,
  t as applyAccountNameToChannelSection,
} from "../setup-helpers-CD5ZaV-J.js";
import {
  o as buildTokenChannelStatusSummary,
  r as buildComputedAccountStatusSnapshot,
} from "../status-helpers-D0-IqnB6.js";
import { P as MessageReceipt } from "../types-FwtQl4mH.js";
import {
  C as OpenClawPluginApi,
  Ys as emptyPluginConfigSchema,
  cr as PluginRuntime,
} from "../types-Ga3mNO_F.js";
import {
  P as ChannelStatusIssue,
  m as ChannelGroupContext,
  r as ChannelAccountSnapshot,
  v as ChannelMessageActionAdapter,
} from "../types.core-CcwzPNhX.js";
import { i as OpenClawConfig } from "../types.openclaw-DDo8sH3F.js";
import { t as ChannelPlugin } from "../types.plugin-BGk2f9vp.js";
import { t as ChannelMessageActionName } from "../types.public-CV2EbDei.js";
import { t as DiscordConfigSchema } from "../zod-schema.providers-core-CTizxtk1.js";
//#region src/plugin-sdk/discord.d.ts
/** Discord channel config shape for one account in OpenClaw config. */
type DiscordAccountConfig = NonNullable<NonNullable<OpenClawConfig["channels"]>["discord"]>;
/** Component-message request accepted by the deprecated Discord SDK facade. */
type DiscordComponentMessageSpec = {
  text?: string;
  reusable?: boolean;
  container?: {
    accentColor?: string | number;
    spoiler?: boolean;
  };
  blocks?: unknown[];
  modal?: unknown;
};
/** Built Discord component payload plus registration metadata. */
type DiscordComponentBuildResult = {
  components: unknown[];
  entries: unknown[];
  modals: unknown[];
};
/** Send/edit options for Discord component messages. */
type DiscordComponentSendOpts = {
  cfg: OpenClawConfig;
  accountId?: string;
  replyTo?: string;
  files?: unknown;
  mediaReadFile?: (filePath: string) => Promise<Buffer>;
  filename?: string;
  textLimit?: number;
  maxLinesPerMessage?: number;
  tableMode?: unknown;
  chunkMode?: unknown;
  [key: string]: unknown;
};
/** Normalized Discord message result returned by component send/edit helpers. */
type DiscordComponentSendResult = {
  messageId: string;
  channelId: string;
  receipt: MessageReceipt;
};
/** Resolved Discord account with token source metadata for status and runtime checks. */
type ResolvedDiscordAccount = {
  accountId: string;
  enabled: boolean;
  name?: string;
  token: string;
  tokenSource: "env" | "config" | "none";
  config: DiscordAccountConfig;
};
/** Normalized outbound target result for Discord channel ids and DM targets. */
type DiscordOutboundTargetResolution =
  | {
      ok: true;
      to: string;
    }
  | {
      ok: false;
      error: Error;
    };
/** Supported thread binding owners for Discord session routing. */
type ThreadBindingTargetKind = "subagent" | "acp";
/** Persisted Discord thread-to-session binding record. */
type ThreadBindingRecord = {
  accountId: string;
  threadId: string;
  channelId?: string;
  targetKind: ThreadBindingTargetKind;
  targetSessionKey: string;
  [key: string]: unknown;
};
type DirectoryConfigParams = {
  cfg: OpenClawConfig;
  accountId?: string | null;
};
type BuildDiscordComponentMessage = (params: {
  spec: DiscordComponentMessageSpec;
  fallbackText?: string;
  sessionKey?: string;
  agentId?: string;
  accountId?: string;
}) => DiscordComponentBuildResult;
type EditDiscordComponentMessage = (
  to: string,
  messageId: string,
  spec: DiscordComponentMessageSpec,
  opts: DiscordComponentSendOpts,
) => Promise<DiscordComponentSendResult>;
type RegisterBuiltDiscordComponentMessage = (params: {
  buildResult: DiscordComponentBuildResult;
  messageId: string;
}) => void;
type DiscordApiFacadeModule = {
  collectDiscordStatusIssues: (accounts: ChannelAccountSnapshot[]) => ChannelStatusIssue[];
  buildDiscordComponentMessage: BuildDiscordComponentMessage;
  discordOnboardingAdapter?: NonNullable<ChannelPlugin<ResolvedDiscordAccount>["setup"]>;
  inspectDiscordAccount: (params: { cfg: OpenClawConfig; accountId?: string | null }) => unknown;
  listDiscordAccountIds: (cfg: OpenClawConfig) => string[];
  listDiscordDirectoryGroupsFromConfig: (
    params: DirectoryConfigParams,
  ) => unknown[] | Promise<unknown[]>;
  listDiscordDirectoryPeersFromConfig: (
    params: DirectoryConfigParams,
  ) => unknown[] | Promise<unknown[]>;
  looksLikeDiscordTargetId: (raw: string) => boolean;
  normalizeDiscordMessagingTarget: (raw: string) => string | undefined;
  normalizeDiscordOutboundTarget: (to?: string) => DiscordOutboundTargetResolution;
  resolveDefaultDiscordAccountId: (cfg: OpenClawConfig) => string;
  resolveDiscordAccount: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
  }) => ResolvedDiscordAccount;
  resolveDiscordGroupRequireMention: (params: ChannelGroupContext) => boolean | undefined;
  resolveDiscordGroupToolPolicy: (params: ChannelGroupContext) => unknown;
};
type DiscordRuntimeFacadeModule = {
  editDiscordComponentMessage: EditDiscordComponentMessage;
  registerBuiltDiscordComponentMessage: RegisterBuiltDiscordComponentMessage;
  autoBindSpawnedDiscordSubagent: (params: {
    cfg: OpenClawConfig;
    accountId?: string;
    channel?: string;
    to?: string;
    threadId?: string | number;
    childSessionKey: string;
    agentId: string;
    label?: string;
    boundBy?: string;
  }) => Promise<ThreadBindingRecord | null>;
  collectDiscordAuditChannelIds: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
  }) => unknown;
  listThreadBindingsBySessionKey: (params: {
    targetSessionKey: string;
    accountId?: string;
    targetKind?: ThreadBindingTargetKind;
  }) => ThreadBindingRecord[];
  unbindThreadBindingsBySessionKey: (params: {
    targetSessionKey: string;
    accountId?: string;
    targetKind?: ThreadBindingTargetKind;
    reason?: string;
    sendFarewell?: boolean;
    farewellText?: string;
  }) => ThreadBindingRecord[];
};
/** Lazy Discord setup adapter retained for deprecated subpath compatibility. */
declare const discordOnboardingAdapter: {};
/** Collect Discord account status issues from account snapshots. */
declare function collectDiscordStatusIssues(
  accounts: ChannelAccountSnapshot[],
): ChannelStatusIssue[];
/** Build Discord component payloads without sending them. */
declare const buildDiscordComponentMessage: DiscordApiFacadeModule["buildDiscordComponentMessage"];
/** Inspect one configured Discord account for setup/status output. */
declare function inspectDiscordAccount(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
}): unknown;
/** List configured Discord account ids from OpenClaw config. */
declare function listDiscordAccountIds(cfg: OpenClawConfig): string[];
/** List Discord directory group records from static config. */
declare function listDiscordDirectoryGroupsFromConfig(
  params: DirectoryConfigParams,
): unknown[] | Promise<unknown[]>;
/** List Discord directory peer records from static config. */
declare function listDiscordDirectoryPeersFromConfig(
  params: DirectoryConfigParams,
): unknown[] | Promise<unknown[]>;
/** Check whether a raw value has Discord target-id shape. */
declare function looksLikeDiscordTargetId(raw: string): boolean;
/** Normalize a Discord messaging target for send helpers. */
declare function normalizeDiscordMessagingTarget(raw: string): string | undefined;
/** Normalize a Discord outbound target and return a typed error on failure. */
declare function normalizeDiscordOutboundTarget(to?: string): DiscordOutboundTargetResolution;
/** Resolve the default Discord account id from config. */
declare function resolveDefaultDiscordAccountId(cfg: OpenClawConfig): string;
/** Resolve a Discord account config plus token source for runtime use. */
declare function resolveDiscordAccount(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
}): ResolvedDiscordAccount;
/** Resolve group mention policy for a Discord channel context. */
declare function resolveDiscordGroupRequireMention(
  params: ChannelGroupContext,
): boolean | undefined;
/** Resolve group tool policy for a Discord channel context. */
declare function resolveDiscordGroupToolPolicy(params: ChannelGroupContext): unknown;
/** Collect configured Discord audit channel ids for runtime status checks. */
declare function collectDiscordAuditChannelIds(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
}): unknown;
/** Edit an already-sent Discord component message. */
declare const editDiscordComponentMessage: DiscordRuntimeFacadeModule["editDiscordComponentMessage"];
/** Register a built component message after Discord assigns its message id. */
declare const registerBuiltDiscordComponentMessage: DiscordRuntimeFacadeModule["registerBuiltDiscordComponentMessage"];
/** Bind a spawned subagent session to the current Discord thread when possible. */
declare function autoBindSpawnedDiscordSubagent(params: {
  cfg?: OpenClawConfig;
  accountId?: string;
  channel?: string;
  to?: string;
  threadId?: string | number;
  childSessionKey: string;
  agentId: string;
  label?: string;
  boundBy?: string;
}): Promise<ThreadBindingRecord | null>;
/** List Discord thread bindings for a target session key. */
declare function listThreadBindingsBySessionKey(params: {
  targetSessionKey: string;
  accountId?: string;
  targetKind?: ThreadBindingTargetKind;
}): ThreadBindingRecord[];
/** Remove Discord thread bindings for a target session key. */
declare function unbindThreadBindingsBySessionKey(params: {
  targetSessionKey: string;
  accountId?: string;
  targetKind?: ThreadBindingTargetKind;
  reason?: string;
  sendFarewell?: boolean;
  farewellText?: string;
}): ThreadBindingRecord[];
//#endregion
export {
  type ChannelMessageActionAdapter,
  type ChannelMessageActionName,
  type ChannelPlugin,
  DEFAULT_ACCOUNT_ID,
  DiscordAccountConfig,
  DiscordComponentBuildResult,
  DiscordComponentMessageSpec,
  DiscordComponentSendOpts,
  DiscordComponentSendResult,
  DiscordConfigSchema,
  DiscordOutboundTargetResolution,
  type OpenClawConfig,
  type OpenClawPluginApi,
  PAIRING_APPROVED_MESSAGE,
  type PluginRuntime,
  ResolvedDiscordAccount,
  ThreadBindingRecord,
  ThreadBindingTargetKind,
  applyAccountNameToChannelSection,
  autoBindSpawnedDiscordSubagent,
  buildChannelConfigSchema,
  buildComputedAccountStatusSnapshot,
  buildDiscordComponentMessage,
  buildTokenChannelStatusSummary,
  collectDiscordAuditChannelIds,
  collectDiscordStatusIssues,
  discordOnboardingAdapter,
  editDiscordComponentMessage,
  emptyPluginConfigSchema,
  getChatChannelMeta,
  inspectDiscordAccount,
  listDiscordAccountIds,
  listDiscordDirectoryGroupsFromConfig,
  listDiscordDirectoryPeersFromConfig,
  listThreadBindingsBySessionKey,
  looksLikeDiscordTargetId,
  migrateBaseNameToDefaultAccount,
  normalizeAccountId,
  normalizeDiscordMessagingTarget,
  normalizeDiscordOutboundTarget,
  projectCredentialSnapshotFields,
  registerBuiltDiscordComponentMessage,
  resolveConfiguredFromCredentialStatuses,
  resolveDefaultDiscordAccountId,
  resolveDiscordAccount,
  resolveDiscordGroupRequireMention,
  resolveDiscordGroupToolPolicy,
  unbindThreadBindingsBySessionKey,
};
