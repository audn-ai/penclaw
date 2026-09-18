import { g as OpenClawPluginApi } from "../../plugin-entry-DPCR66aO.js";
import { tt as ResolvedActiveRecallPluginConfig } from "../../types-Di2zMoWq.js";
import { i as OpenClawConfig } from "../../types.openclaw-DDo8sH3F.js";

//#region extensions/active-memory/session-policy.d.ts
declare function isSessionActiveMemoryDisabled(params: {
  api: OpenClawPluginApi;
  sessionKey?: string;
}): Promise<boolean>;
declare function setSessionActiveMemoryDisabled(params: {
  api: OpenClawPluginApi;
  sessionKey: string;
  disabled: boolean;
}): Promise<void>;
declare function resolveCommandSessionKey(params: {
  api: OpenClawPluginApi;
  config: ResolvedActiveRecallPluginConfig;
  sessionKey?: string;
  sessionId?: string;
}): string | undefined;
declare function formatActiveMemoryCommandHelp(): string;
declare function isActiveMemoryGloballyEnabled(cfg: OpenClawConfig): boolean;
declare function updateActiveMemoryGlobalEnabledInConfig(
  cfg: OpenClawConfig,
  enabled: boolean,
): OpenClawConfig;
declare function lacksAdminToMutateActiveMemoryGlobal(params: {
  senderIsOwner?: boolean;
  gatewayClientScopes?: readonly string[];
}): boolean;
declare const ACTIVE_MEMORY_GLOBAL_MUTATION_ADMIN_REQUIRED_TEXT =
  "\u26A0\uFE0F /active-memory global enable/disable changes require owner or operator.admin.";
declare function isEnabledForAgent(
  config: ResolvedActiveRecallPluginConfig,
  agentId: string | undefined,
): boolean;
declare function shouldSkipActiveMemoryForHarnessSession(params: {
  api: OpenClawPluginApi;
  agentId?: string;
  sessionKey?: string;
}): boolean;
declare function isEligibleInteractiveSession(ctx: {
  trigger?: string;
  sessionKey?: string;
  sessionId?: string;
  messageProvider?: string;
  channelId?: string;
}): boolean;
declare function isAllowedChatType(
  config: ResolvedActiveRecallPluginConfig,
  ctx: {
    sessionKey?: string;
    messageProvider?: string;
    channelId?: string;
    mainKey?: string;
  },
): boolean;
/**
 * Apply allowedChatIds / deniedChatIds filters after the chat type check
 * has already passed. Empty allowedChatIds means "no allowlist" and this
 * function returns true for any conversation. Empty deniedChatIds is also
 * a no-op.
 *
 * When allowedChatIds is non-empty but the session key does not expose a
 * conversation id (e.g. webchat default session), the session is skipped
 * to avoid accidentally running against an unknown conversation.
 */
declare function isAllowedChatId(
  config: ResolvedActiveRecallPluginConfig,
  ctx: {
    sessionKey?: string;
    messageProvider?: string;
  },
): boolean;
//#endregion
export {
  ACTIVE_MEMORY_GLOBAL_MUTATION_ADMIN_REQUIRED_TEXT,
  formatActiveMemoryCommandHelp,
  isActiveMemoryGloballyEnabled,
  isAllowedChatId,
  isAllowedChatType,
  isEligibleInteractiveSession,
  isEnabledForAgent,
  isSessionActiveMemoryDisabled,
  lacksAdminToMutateActiveMemoryGlobal,
  resolveCommandSessionKey,
  setSessionActiveMemoryDisabled,
  shouldSkipActiveMemoryForHarnessSession,
  updateActiveMemoryGlobalEnabledInConfig,
};
