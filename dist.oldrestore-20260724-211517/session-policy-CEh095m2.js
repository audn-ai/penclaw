import crypto from "node:crypto";
import { r as resolvePluginConfigObject } from "./plugin-config-runtime-ef53THzv.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./routing-CwvmVRHd.js";
import { i as asOptionalRecord } from "./record-coerce-DHZ4bFlT.js";
import { i as resolveCanonicalSessionKeyFromSessionId } from "./session-BHzzCQEf.js";
import {
  c as parseAgentSessionKey,
  f as parseThreadSessionSuffix,
} from "./session-key-utils-B8sNp9l4.js";
import { f as DEFAULT_AGENT_ID } from "./types-gz2L16qk.js";
//#region extensions/active-memory/session-policy.ts
function activeMemoryToggleKey(sessionKey) {
  return crypto.createHash("sha256").update(sessionKey, "utf8").digest("hex");
}
function openActiveMemoryToggleStore(api) {
  return api.runtime.state.openKeyedStore({
    namespace: "session-toggles",
    maxEntries: 1e4,
  });
}
async function isSessionActiveMemoryDisabled(params) {
  const sessionKey = params.sessionKey?.trim();
  if (!sessionKey) return false;
  try {
    const store = openActiveMemoryToggleStore(params.api);
    const key = activeMemoryToggleKey(sessionKey);
    if ((await store.lookup(key))?.disabled === true) return true;
    return false;
  } catch (error) {
    params.api.logger.debug?.(
      `active-memory: failed to read session toggle (${error instanceof Error ? error.message : String(error)})`,
    );
    return false;
  }
}
async function setSessionActiveMemoryDisabled(params) {
  const store = openActiveMemoryToggleStore(params.api);
  if (params.disabled)
    await store.register(activeMemoryToggleKey(params.sessionKey), {
      sessionKey: params.sessionKey,
      disabled: true,
      updatedAt: Date.now(),
    });
  else await store.delete(activeMemoryToggleKey(params.sessionKey));
}
function resolveCommandSessionKey(params) {
  const explicit = params.sessionKey?.trim();
  if (explicit) return explicit;
  const configuredAgents =
    params.config.agents.length > 0 ? params.config.agents : [DEFAULT_AGENT_ID];
  for (const agentId of configuredAgents) {
    const sessionKey = resolveCanonicalSessionKeyFromSessionId({
      api: params.api,
      agentId,
      sessionId: params.sessionId,
    });
    if (sessionKey) return sessionKey;
  }
}
function formatActiveMemoryCommandHelp() {
  return [
    "Active Memory session toggle:",
    "/active-memory status",
    "/active-memory on",
    "/active-memory off",
    "",
    "Global config toggle:",
    "/active-memory status --global",
    "/active-memory on --global",
    "/active-memory off --global",
  ].join("\n");
}
function isActiveMemoryGloballyEnabled(cfg) {
  if (asOptionalRecord(cfg.plugins?.entries?.["active-memory"])?.enabled === false) return false;
  return resolvePluginConfigObject(cfg, "active-memory")?.enabled !== false;
}
function updateActiveMemoryGlobalEnabledInConfig(cfg, enabled) {
  const entries = { ...cfg.plugins?.entries };
  const existingEntry = asOptionalRecord(entries["active-memory"]) ?? {};
  const existingConfig = asOptionalRecord(existingEntry.config) ?? {};
  entries["active-memory"] = {
    ...existingEntry,
    enabled: true,
    config: {
      ...existingConfig,
      enabled,
    },
  };
  return {
    ...cfg,
    plugins: {
      ...cfg.plugins,
      entries,
    },
  };
}
function lacksAdminToMutateActiveMemoryGlobal(params) {
  if (Array.isArray(params.gatewayClientScopes))
    return !params.gatewayClientScopes.includes("operator.admin");
  return params.senderIsOwner !== true;
}
const ACTIVE_MEMORY_GLOBAL_MUTATION_ADMIN_REQUIRED_TEXT =
  "⚠️ /active-memory global enable/disable changes require owner or operator.admin.";
function isEnabledForAgent(config, agentId) {
  if (!config.enabled) return false;
  if (!agentId) return false;
  return config.agents.includes(agentId);
}
function isAgentHarnessSessionKey(sessionKey) {
  const normalized = sessionKey.trim().toLowerCase();
  return (parseAgentSessionKey(normalized)?.rest ?? normalized).startsWith("harness:");
}
function shouldSkipActiveMemoryForHarnessSession(params) {
  const sessionKey = params.sessionKey?.trim();
  if (!sessionKey) return false;
  try {
    const entry = params.api.runtime.agent.session.getSessionEntry({
      ...(params.agentId ? { agentId: params.agentId } : {}),
      sessionKey,
      readConsistency: "latest",
    });
    return (
      entry?.modelSelectionLocked === true ||
      (entry === void 0 && isAgentHarnessSessionKey(sessionKey))
    );
  } catch {
    return true;
  }
}
function isEligibleInteractiveSession(ctx) {
  if (ctx.trigger !== "user") return false;
  const sessionKey = ctx.sessionKey ?? "";
  if (
    /^dreaming-narrative-(light|rem|deep)-/i.test(sessionKey) ||
    /^agent:[^:]+:dreaming-narrative-(light|rem|deep)-/i.test(sessionKey)
  )
    return false;
  if (!ctx.sessionKey && !ctx.sessionId) return false;
  if ((ctx.messageProvider ?? "").trim().toLowerCase() === "webchat") return true;
  return Boolean(ctx.channelId && ctx.channelId.trim());
}
function resolveChatType(ctx) {
  const rawSessionKey = ctx.sessionKey?.trim();
  const { baseSessionKey } = parseThreadSessionSuffix(rawSessionKey);
  const sessionKey = (baseSessionKey ?? rawSessionKey)?.trim().toLowerCase();
  if (sessionKey) {
    if (sessionKey.startsWith("agent:") && sessionKey.split(":")[2] === "explicit")
      return "explicit";
    if (sessionKey.includes(":group:")) return "group";
    if (sessionKey.includes(":channel:")) return "channel";
    if (sessionKey.includes(":direct:") || sessionKey.includes(":dm:")) return "direct";
    const mainKey = ctx.mainKey?.trim().toLowerCase() || "main";
    const agentSessionParts = sessionKey.split(":");
    if (
      agentSessionParts.length === 3 &&
      agentSessionParts[0] === "agent" &&
      (agentSessionParts[2] === mainKey || agentSessionParts[2] === "main")
    ) {
      const provider = (ctx.messageProvider ?? "").trim().toLowerCase();
      const channelId = (ctx.channelId ?? "").trim();
      if (provider && provider !== "webchat" && channelId) return "direct";
    }
  }
  if ((ctx.messageProvider ?? "").trim().toLowerCase() === "webchat") return "direct";
}
function isAllowedChatType(config, ctx) {
  const chatType = resolveChatType(ctx);
  if (!chatType) return false;
  return config.allowedChatTypes.includes(chatType);
}
/**
 * Best-effort extraction of the conversation id (peer id) embedded in an
 * agent-scoped session key, using shared session-key utilities so we
 * stay aligned with the canonical key shapes produced by
 * `buildAgentPeerSessionKey` / `resolveThreadSessionKeys`.
 *
 * Supported shapes (after stripping the optional `:thread:<id>` suffix):
 *   - agent:<agentId>:direct:<peerId>                         (dmScope=per-peer)
 *   - agent:<agentId>:<channel>:direct:<peerId>               (dmScope=per-channel-peer)
 *   - agent:<agentId>:<channel>:<accountId>:direct:<peerId>   (dmScope=per-account-channel-peer)
 *   - agent:<agentId>:<channel>:group:<peerId>                (group)
 *   - agent:<agentId>:<channel>:channel:<peerId>              (channel)
 *
 * The legacy `dm` token is also accepted for backwards compatibility.
 *
 * Returns undefined for sessions that do not embed a peer id (for
 * example dmScope=main `agent:<agentId>:<mainKey>` sessions, or any
 * non-canonical session key shape).
 */
function resolveConversationId(ctx) {
  const rawSessionKey = ctx.sessionKey?.trim();
  if (!rawSessionKey) return;
  const { baseSessionKey } = parseThreadSessionSuffix(rawSessionKey);
  const baseKey = (baseSessionKey ?? rawSessionKey).trim();
  if (!baseKey) return;
  const parsed = parseAgentSessionKey(baseKey);
  if (!parsed) return;
  const restParts = parsed.rest.split(":").filter(Boolean);
  if (restParts.length < 2) return;
  for (let index = 0; index < restParts.length - 1; index += 1) {
    const token = restParts[index];
    if (token === "direct" || token === "dm" || token === "group" || token === "channel")
      return (
        restParts
          .slice(index + 1)
          .join(":")
          .trim() || void 0
      );
  }
}
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
function isAllowedChatId(config, ctx) {
  const hasAllowlist = config.allowedChatIds.length > 0;
  const hasDenylist = config.deniedChatIds.length > 0;
  if (!hasAllowlist && !hasDenylist) return true;
  const conversationId = resolveConversationId(ctx);
  if (hasAllowlist) {
    if (!conversationId) return false;
    if (!config.allowedChatIds.includes(conversationId)) return false;
  }
  if (hasDenylist && conversationId && config.deniedChatIds.includes(conversationId)) return false;
  return true;
}
//#endregion
export {
  isAllowedChatType as a,
  isSessionActiveMemoryDisabled as c,
  setSessionActiveMemoryDisabled as d,
  shouldSkipActiveMemoryForHarnessSession as f,
  isAllowedChatId as i,
  lacksAdminToMutateActiveMemoryGlobal as l,
  formatActiveMemoryCommandHelp as n,
  isEligibleInteractiveSession as o,
  updateActiveMemoryGlobalEnabledInConfig as p,
  isActiveMemoryGloballyEnabled as r,
  isEnabledForAgent as s,
  ACTIVE_MEMORY_GLOBAL_MUTATION_ADMIN_REQUIRED_TEXT as t,
  resolveCommandSessionKey as u,
};
