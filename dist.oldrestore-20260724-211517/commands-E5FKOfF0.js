import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import { c as resolveDefaultAgentId } from "./agent-scope-config-DVIR1nBa.js";
import "./agent-scope-y9xQv_q1.js";
import {
  h as setPluginCommandRegistryLocked,
  n as listPluginInvocationKeys,
  p as pluginCommands,
  r as pluginCommandSupportsChannel,
  s as canExposeSenderIsOwner,
  t as isReservedCommandName,
  u as isTrustedReservedCommandOwner,
} from "./command-registration-CTCK5hi-.js";
import {
  c as detachPluginConversationBinding,
  h as requestPluginConversationBinding,
  l as getCurrentPluginConversationBinding,
} from "./conversation-binding-B-BUd2yg.js";
import { t as resolveConversationBindingContext } from "./conversation-binding-context-CFEd5JKR.js";
import { r as logVerbose } from "./globals-CNUzHTcU.js";
import { s as isOperatorScope, t as ADMIN_SCOPE } from "./operator-scopes-CpPJIv7P.js";
import { n as getActivePluginChannelRegistry } from "./runtime-CcYnX0B4.js";
import { l as normalizeMainKey } from "./session-key-druuY-GG.js";
import { c as parseAgentSessionKey } from "./session-key-utils-B8sNp9l4.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
} from "./string-coerce-DW4mBlAt.js";
import "./command-specs--PfV6nbf.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region src/agents/session-agent-binding.ts
/**
 * Session-to-agent binding resolver.
 *
 * Derives the trusted active agent from explicit agent ids, agent session keys, or configured main-session aliases.
 */
/**
 * Resolve the trusted active agent bound to a host-owned session reference.
 */
function resolveBoundAgentIdForSession(params) {
  const explicitAgentId = normalizeOptionalString(params.agentId);
  if (explicitAgentId) return normalizeAgentId(explicitAgentId);
  const normalizedSessionKey = normalizeOptionalString(params.sessionKey);
  if (!normalizedSessionKey) return;
  const parsed = parseAgentSessionKey(normalizedSessionKey);
  if (parsed?.agentId) return normalizeAgentId(parsed.agentId);
  const loweredSessionKey = normalizeLowercaseStringOrEmpty(normalizedSessionKey);
  const mainKey = normalizeMainKey(params.config?.session?.mainKey);
  if (loweredSessionKey === "main" || loweredSessionKey === mainKey)
    return resolveDefaultAgentId(params.config ?? {});
}
//#endregion
//#region src/plugins/commands.ts
/**
 * Plugin Command Registry
 *
 * Manages commands registered by plugins that bypass the LLM agent.
 * These commands are processed before built-in commands and before agent invocation.
 */
const MAX_ARGS_LENGTH = 4096;
/**
 * Check if a command body matches a registered plugin command.
 * Returns the command definition and parsed args if matched.
 *
 * Note: If a command has `acceptsArgs: false` and the user provides arguments,
 * the command will not match. This allows the message to fall through to
 * built-in handlers or the agent. Document this behavior to plugin authors.
 */
function matchPluginCommand(commandBody, options = {}) {
  const trimmed = commandBody.trim();
  if (!trimmed.startsWith("/")) return null;
  const commandMatch = trimmed.match(/^\/\s*([^\s]+)(?:\s+([\s\S]*))?$/);
  if (!commandMatch) return null;
  const commandName = `/${commandMatch[1]}`;
  const args = commandMatch[2]?.trim();
  const key = normalizeLowercaseStringOrEmpty(commandName);
  const alternateKeys = [key];
  if (key.includes("_")) alternateKeys.push(key.replace(/_/g, "-"));
  if (key.includes("-")) alternateKeys.push(key.replace(/-/g, "_"));
  const command =
    alternateKeys
      .map(
        (candidateKey) =>
          pluginCommands.get(candidateKey) ??
          Array.from(pluginCommands.values()).find((candidate) =>
            listPluginInvocationNames(candidate).includes(candidateKey),
          ),
      )
      .filter((candidate) => candidate && pluginCommandSupportsChannel(candidate, options.channel))
      .find(Boolean) ?? null;
  if (!command) return null;
  if (args && !command.acceptsArgs) return null;
  return {
    command,
    args: args || void 0,
  };
}
/**
 * Sanitize command arguments to prevent injection attacks.
 * Removes control characters and enforces length limits.
 */
function sanitizeArgs(args) {
  if (!args) return;
  let sanitized = "";
  for (const char of truncateUtf16Safe(args, MAX_ARGS_LENGTH)) {
    const code = char.charCodeAt(0);
    if (!((code <= 31 && code !== 9 && code !== 10) || code === 127)) sanitized += char;
  }
  return sanitized;
}
function resolveBindingConversationFromCommand(params) {
  if (
    !getActivePluginChannelRegistry()?.channels.find((entry) => entry.plugin.id === params.channel)
      ?.plugin?.bindings?.resolveCommandConversation
  )
    return null;
  return resolveConversationBindingContext({
    cfg: params.config ?? {},
    channel: params.channel,
    accountId: params.accountId,
    threadId: params.messageThreadId,
    threadParentId: params.threadParentId,
    senderId: params.senderId,
    originatingTo: params.from,
    commandTo: params.to,
    fallbackTo: params.to ?? params.from,
  });
}
function buildPluginCommandRuntimeContext(params) {
  const sessionKey = params.sessionKey?.trim();
  const agentId = resolveBoundAgentIdForSession({
    config: params.config,
    agentId: params.agentId,
    sessionKey,
  });
  if (!sessionKey && !agentId) return;
  return {
    llm: {
      complete: async (request) => {
        const { createRuntimeLlm } = await import("./runtime-llm.runtime.js");
        return await createRuntimeLlm({
          getConfig: () => params.config,
          authority: {
            caller: {
              kind: "plugin",
              id: params.command.pluginId,
              name: params.command.pluginName,
            },
            pluginIdForPolicy: params.command.pluginId,
            requiresBoundAgent: true,
            ...(sessionKey ? { sessionKey } : {}),
            ...(agentId ? { agentId } : {}),
            ...(params.authProfileId ? { preferredProfile: params.authProfileId } : {}),
            allowAgentIdOverride: false,
            allowModelOverride: false,
            allowComplete: true,
          },
        }).complete(request);
      },
    },
  };
}
/**
 * Execute a plugin command handler.
 *
 * Note: Plugin authors should still validate and sanitize ctx.args for their
 * specific use case. This function provides basic defense-in-depth sanitization.
 */
async function executePluginCommand(params) {
  const { command, args, senderId, channel, isAuthorizedSender, commandBody, config } = params;
  if (!pluginCommandSupportsChannel(command, channel)) {
    logVerbose(`Plugin command /${command.name} skipped on unsupported channel ${channel}`);
    return { continueAgent: true };
  }
  if (command.requireAuth !== false && !isAuthorizedSender) {
    logVerbose(
      `Plugin command /${command.name} blocked: unauthorized sender ${senderId || "<unknown>"}`,
    );
    return { text: "⚠️ This command requires authorization." };
  }
  if (command.requiredScopes !== void 0 && !Array.isArray(command.requiredScopes)) {
    logVerbose(`Plugin command /${command.name} blocked: invalid requiredScopes configuration`);
    return { text: "⚠️ This command has invalid gateway scope configuration." };
  }
  const requiredScopes = command.requiredScopes ?? [];
  if (requiredScopes.find((scope) => !isOperatorScope(scope))) {
    logVerbose(`Plugin command /${command.name} blocked: unknown gateway scope`);
    return { text: "⚠️ This command has invalid gateway scope configuration." };
  }
  if (requiredScopes.length > 0) {
    const senderIsOwner = params.senderIsOwner === true;
    const scopes = Array.isArray(params.gatewayClientScopes)
      ? new Set(params.gatewayClientScopes)
      : void 0;
    const hasGatewayScopeContext = scopes !== void 0;
    const hasAdmin = scopes?.has(ADMIN_SCOPE) === true;
    const missingScope = scopes
      ? requiredScopes.find((scope) => !hasAdmin && !scopes.has(scope))
      : requiredScopes[0];
    if (missingScope && (hasGatewayScopeContext || !senderIsOwner)) {
      logVerbose(`Plugin command /${command.name} blocked: missing gateway scope ${missingScope}`);
      return { text: `⚠️ This command requires gateway scope: ${missingScope}.` };
    }
  }
  const sanitizedArgs = sanitizeArgs(args);
  const bindingConversation = resolveBindingConversationFromCommand({
    config,
    channel,
    senderId,
    from: params.from,
    to: params.to,
    accountId: params.accountId,
    messageThreadId: params.messageThreadId,
    threadParentId: params.threadParentId,
  });
  const effectiveAccountId = bindingConversation?.accountId ?? params.accountId;
  const senderIsOwnerForCommand =
    canExposeSenderIsOwner(command) ||
    (isTrustedReservedCommandOwner(command) &&
      command.ownership === "reserved" &&
      isReservedCommandName(command.name) &&
      command.pluginId === normalizeLowercaseStringOrEmpty(command.name))
      ? params.senderIsOwner
      : void 0;
  const diagnosticsPrivateRoutedForCommand =
    isTrustedReservedCommandOwner(command) &&
    command.ownership === "reserved" &&
    isReservedCommandName(command.name) &&
    command.pluginId === normalizeLowercaseStringOrEmpty(command.name)
      ? params.diagnosticsPrivateRouted
      : void 0;
  const diagnosticsUploadApprovedForCommand =
    isTrustedReservedCommandOwner(command) &&
    command.ownership === "reserved" &&
    isReservedCommandName(command.name) &&
    command.pluginId === normalizeLowercaseStringOrEmpty(command.name)
      ? params.diagnosticsUploadApproved
      : void 0;
  const diagnosticsPreviewOnlyForCommand =
    isTrustedReservedCommandOwner(command) &&
    command.ownership === "reserved" &&
    isReservedCommandName(command.name) &&
    command.pluginId === normalizeLowercaseStringOrEmpty(command.name)
      ? params.diagnosticsPreviewOnly
      : void 0;
  const ctx = {
    senderId,
    channel,
    channelId: params.channelId,
    isAuthorizedSender,
    ...(senderIsOwnerForCommand === void 0 ? {} : { senderIsOwner: senderIsOwnerForCommand }),
    gatewayClientScopes: params.gatewayClientScopes,
    agentId: params.agentId,
    sessionKey: params.sessionKey,
    sessionId: params.sessionId,
    sessionFile: params.sessionFile,
    args: sanitizedArgs,
    commandBody,
    config,
    from: params.from,
    to: params.to,
    accountId: effectiveAccountId,
    messageThreadId: params.messageThreadId,
    threadParentId: params.threadParentId,
    diagnosticsSessions: params.diagnosticsSessions,
    runtimeContext: buildPluginCommandRuntimeContext({
      command,
      config,
      agentId: params.agentId,
      sessionKey: params.sessionKey,
      authProfileId: params.authProfileId,
    }),
    ...(diagnosticsUploadApprovedForCommand === void 0
      ? {}
      : { diagnosticsUploadApproved: diagnosticsUploadApprovedForCommand }),
    ...(diagnosticsPreviewOnlyForCommand === void 0
      ? {}
      : { diagnosticsPreviewOnly: diagnosticsPreviewOnlyForCommand }),
    ...(diagnosticsPrivateRoutedForCommand === void 0
      ? {}
      : { diagnosticsPrivateRouted: diagnosticsPrivateRoutedForCommand }),
    requestConversationBinding: async (bindingParams) => {
      if (!command.pluginRoot || !bindingConversation)
        return {
          status: "error",
          message: "This command cannot bind the current conversation.",
        };
      return requestPluginConversationBinding({
        pluginId: command.pluginId,
        pluginName: command.pluginName,
        pluginRoot: command.pluginRoot,
        requestedBySenderId: senderId,
        conversation: bindingConversation,
        binding: bindingParams,
      });
    },
    detachConversationBinding: async () => {
      if (!command.pluginRoot || !bindingConversation) return { removed: false };
      return detachPluginConversationBinding({
        pluginRoot: command.pluginRoot,
        conversation: bindingConversation,
      });
    },
    getCurrentConversationBinding: async () => {
      if (!command.pluginRoot || !bindingConversation) return null;
      return getCurrentPluginConversationBinding({
        pluginRoot: command.pluginRoot,
        conversation: bindingConversation,
      });
    },
  };
  setPluginCommandRegistryLocked(true);
  try {
    const result = await command.handler(ctx);
    logVerbose(
      `Plugin command /${command.name} executed successfully for ${senderId || "unknown"}`,
    );
    if (!result || typeof result !== "object") {
      logVerbose(`Plugin command /${command.name} returned no reply payload`);
      return {};
    }
    return result;
  } catch (err) {
    const error = err;
    logVerbose(`Plugin command /${command.name} error: ${error.message}`);
    return { text: "⚠️ Command failed. Please try again later." };
  } finally {
    setPluginCommandRegistryLocked(false);
  }
}
/**
 * List all registered plugin commands.
 * Used for /help and /commands output.
 */
function listPluginCommands() {
  return Array.from(pluginCommands.values()).map((cmd) => ({
    name: cmd.name,
    description: cmd.description,
    pluginId: cmd.pluginId,
    acceptsArgs: cmd.acceptsArgs ?? false,
  }));
}
function listPluginInvocationNames(command) {
  return listPluginInvocationKeys(command);
}
const testing = { resolveBindingConversationFromCommand };
//#endregion
export {
  resolveBoundAgentIdForSession as a,
  testing as i,
  listPluginCommands as n,
  matchPluginCommand as r,
  executePluginCommand as t,
};
