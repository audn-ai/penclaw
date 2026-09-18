import { AsyncLocalStorage } from "node:async_hooks";
import { randomBytes } from "node:crypto";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import { t as mintAgentRuntimeIdentityToken } from "./agent-runtime-identity-token-CEl6qhwK.js";
import { c as callGateway } from "./call-BVMO6az_.js";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-Br1guPTt.js";
import { h as readPositiveIntegerParam, y as readStringParam } from "./common-DyDSUect.js";
import { a as trimToUndefined } from "./credential-planner-BTC1pLMc.js";
import { r as resolveGatewayCredentialsFromConfig } from "./credentials-DqHTozxM.js";
import "./config-BDv-QbJ6.js";
import {
  n as loadDeviceIdentityIfPresent,
  r as loadOrCreateDeviceIdentity,
} from "./device-identity-BmJfeLuX.js";
import { t as ErrorCodes } from "./error-codes-O0AkRNx7.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { i as getRuntimeConfig } from "./io-B3ne6NxF.js";
import {
  c as resolveMessageActionDiscoveryChannelId,
  l as resolveMessageActionDiscoveryForPlugin,
  r as createMessageActionDiscoveryContext,
  s as resolveCurrentChannelMessageToolDiscoveryAdapter,
} from "./message-action-discovery-B2Y90cRg.js";
import "./registry-xXjI-8UE.js";
import {
  i as normalizeMessageChannel,
  t as isDeliverableMessageChannel,
} from "./message-channel-normalize-Be6uJOzO.js";
import "./plugins-BKdf-5tW.js";
import { s as resolveLeastPrivilegeOperatorScopesForMethod } from "./method-scopes-DrxGpKMT.js";
import {
  n as channelPluginHasNativeApprovalPromptUi,
  t as NATIVE_APPROVAL_PROMPT_RUNTIME_CAPABILITY,
} from "./native-approval-prompt-DvjWs-dL.js";
import { t as getOperatorApprovalRuntimeToken } from "./operator-approval-runtime-token-CwiIM76w.js";
import { f as resolveGatewayPort } from "./paths-DEklnbzU.js";
import { n as asNullableRecord } from "./record-coerce-DHZ4bFlT.js";
import { i as listChannelPlugins, t as getChannelPlugin } from "./registry-mc8oBRx8.js";
import { t as normalizeAnyChannelId } from "./registry-normalize-CWirNxxC.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
} from "./string-coerce-DW4mBlAt.js";
import { l as normalizeStringEntries } from "./string-normalization-CRyoFBPt.js";
import { n as copyPluginToolMeta } from "./tools-K3NqAe9E.js";
//#region src/agents/before-tool-call-metadata.ts
const BEFORE_TOOL_CALL_WRAPPED = Symbol("beforeToolCallWrapped");
const BEFORE_TOOL_CALL_DIAGNOSTIC_OPTIONS = Symbol("beforeToolCallDiagnosticOptions");
const BEFORE_TOOL_CALL_SOURCE_TOOL = Symbol("beforeToolCallSourceTool");
const BEFORE_TOOL_CALL_HOOK_CONTEXT = Symbol("beforeToolCallHookContext");
/** Return true when a tool already carries the before_tool_call wrapper marker. */
function isToolWrappedWithBeforeToolCallHook(tool) {
  return tool[BEFORE_TOOL_CALL_WRAPPED] === true;
}
/** Toggle diagnostic event emission on an existing before_tool_call wrapper. */
function setBeforeToolCallDiagnosticsEnabled(tool, enabled) {
  const options = tool[BEFORE_TOOL_CALL_DIAGNOSTIC_OPTIONS];
  if (options && typeof options === "object" && "emitDiagnostics" in options)
    options.emitDiagnostics = enabled;
}
/** Copy before_tool_call marker metadata when another wrapper replaces a tool. */
function copyBeforeToolCallHookMarker(source, target) {
  if (!isToolWrappedWithBeforeToolCallHook(source)) return;
  Object.defineProperty(target, BEFORE_TOOL_CALL_WRAPPED, {
    value: true,
    enumerable: true,
  });
  const taggedSource = source;
  const sourceTool = taggedSource[BEFORE_TOOL_CALL_SOURCE_TOOL];
  if (sourceTool && typeof sourceTool === "object")
    Object.defineProperty(target, BEFORE_TOOL_CALL_SOURCE_TOOL, {
      value: sourceTool,
      enumerable: false,
    });
  const hookContext = taggedSource[BEFORE_TOOL_CALL_HOOK_CONTEXT];
  Object.defineProperty(target, BEFORE_TOOL_CALL_HOOK_CONTEXT, {
    value: hookContext,
    enumerable: false,
  });
}
//#endregion
//#region src/agents/channel-tool-metadata.ts
const channelAgentToolMeta = /* @__PURE__ */ new WeakMap();
/** Read channel metadata attached to a channel-owned agent tool. */
function getChannelAgentToolMeta(tool) {
  return channelAgentToolMeta.get(tool);
}
/** Attach channel ownership metadata to a concrete agent tool. */
function setChannelAgentToolMeta(tool, meta) {
  channelAgentToolMeta.set(tool, meta);
}
/** Copy channel metadata when wrapping or replacing a channel-owned tool. */
function copyChannelAgentToolMeta(source, target) {
  const meta = channelAgentToolMeta.get(source);
  if (meta) channelAgentToolMeta.set(target, meta);
}
//#endregion
//#region src/agents/channel-tools.ts
/**
 * Channel-owned agent tool and prompt helpers.
 * Discovers channel tools, message actions, prompt capabilities, reaction
 * guidance, and weakly-attached channel metadata for wrapped tools.
 */
/**
 * Get the list of supported message actions for a specific channel.
 * Returns an empty array if channel is not found or has no actions configured.
 */
function listChannelSupportedActions(params) {
  const channelId = resolveMessageActionDiscoveryChannelId(params.channel);
  if (!channelId) return [];
  const pluginActions = resolveCurrentChannelMessageToolDiscoveryAdapter(channelId);
  if (!pluginActions?.actions) return [];
  return resolveMessageActionDiscoveryForPlugin({
    pluginId: pluginActions.pluginId,
    actions: pluginActions.actions,
    context: createMessageActionDiscoveryContext(params),
    includeActions: true,
  }).actions;
}
/**
 * Get the list of all supported message actions across all configured channels.
 */
function listAllChannelSupportedActions(params) {
  const actions = /* @__PURE__ */ new Set();
  for (const plugin of listChannelPlugins()) {
    const channelActions = resolveMessageActionDiscoveryForPlugin({
      pluginId: plugin.id,
      actions: plugin.actions,
      context: createMessageActionDiscoveryContext({
        ...params,
        currentChannelProvider: plugin.id,
      }),
      includeActions: true,
    }).actions;
    for (const action of channelActions) actions.add(action);
  }
  return Array.from(actions);
}
/** List agent tools contributed by registered channel plugins. */
function listChannelAgentTools(params) {
  const tools = [];
  for (const plugin of listChannelPlugins()) {
    const entry = plugin.agentTools;
    if (!entry) continue;
    const resolved = typeof entry === "function" ? entry(params) : entry;
    if (Array.isArray(resolved)) {
      for (const tool of resolved) setChannelAgentToolMeta(tool, { channelId: plugin.id });
      tools.push(...resolved);
    }
  }
  return tools;
}
/** Resolve channel-specific message tool hints for system prompt assembly. */
function resolveChannelMessageToolHints(params) {
  const channelId = normalizeAnyChannelId(params.channel);
  if (!channelId) return [];
  const resolve = getChannelPlugin(channelId)?.agentPrompt?.messageToolHints;
  if (!resolve) return [];
  return normalizeStringEntries(
    resolve({
      cfg: params.cfg ?? {},
      accountId: params.accountId,
    }),
  );
}
/** Resolve channel prompt capabilities, including native approval UI support. */
function resolveChannelPromptCapabilities(params) {
  const channelId = normalizeAnyChannelId(params.channel);
  if (!channelId) return [];
  const plugin = getChannelPlugin(channelId);
  const cfg = params.cfg ?? {};
  const capabilities = normalizePromptCapabilities(
    plugin?.agentPrompt?.messageToolCapabilities?.({
      cfg,
      accountId: params.accountId,
    }),
  );
  if (channelPluginHasNativeApprovalPromptUi(plugin))
    capabilities.push(NATIVE_APPROVAL_PROMPT_RUNTIME_CAPABILITY);
  return capabilities;
}
function normalizePromptCapabilities(capabilities) {
  return normalizeStringEntries(capabilities ?? []);
}
/** Resolve optional channel reaction guidance for assistant replies. */
function resolveChannelReactionGuidance(params) {
  const channelId = normalizeAnyChannelId(params.channel);
  if (!channelId) return;
  const resolve = getChannelPlugin(channelId)?.agentPrompt?.reactionGuidance;
  if (!resolve) return;
  const resolved = resolve({
    cfg: params.cfg ?? {},
    accountId: params.accountId,
  });
  if (!resolved?.level) return;
  return {
    level: resolved.level,
    channel: resolved.channelLabel?.trim() || channelId,
  };
}
//#endregion
//#region src/agents/tool-terminal-presentation.ts
const terminalPresentationByTool = /* @__PURE__ */ new WeakMap();
function setToolTerminalPresentation(tool, formatter) {
  terminalPresentationByTool.set(tool, formatter);
  return tool;
}
function getToolTerminalPresentation(tool) {
  return terminalPresentationByTool.get(tool);
}
function copyToolTerminalPresentation(source, target) {
  const formatter = terminalPresentationByTool.get(source);
  if (formatter) terminalPresentationByTool.set(target, formatter);
}
//#endregion
//#region src/gateway/message-action-turn-capability.ts
const DEFAULT_TTL_MS = 15 * 6e4;
const MAX_TTL_MS = 1440 * 6e4;
const MAX_ACTIVE_CAPABILITIES = 4096;
const capabilitiesByToken = /* @__PURE__ */ new Map();
function isTrustedMessageActionTurnIngress(provider) {
  const normalized = normalizeMessageChannel(provider);
  return normalized !== void 0 && isDeliverableMessageChannel(normalized);
}
function resolveTtlMs(value) {
  if (!Number.isFinite(value) || value === void 0 || value <= 0) return DEFAULT_TTL_MS;
  return Math.min(Math.trunc(value), MAX_TTL_MS);
}
function copyToolContext(context) {
  if (!context) return;
  return {
    currentChannelId: normalizeOptionalString(context.currentChannelId),
    currentChatType: context.currentChatType,
    currentMessagingTarget: normalizeOptionalString(context.currentMessagingTarget),
    currentGraphChannelId: normalizeOptionalString(context.currentGraphChannelId),
    currentChannelProvider: context.currentChannelProvider,
    currentThreadTs: normalizeOptionalString(context.currentThreadTs),
    currentMessageId: context.currentMessageId,
    replyToMode: context.replyToMode,
    hasRepliedRef: context.hasRepliedRef,
    sameChannelThreadRequired: context.sameChannelThreadRequired,
    skipCrossContextDecoration: context.skipCrossContextDecoration,
  };
}
function evictOldestCapability() {
  const oldest = capabilitiesByToken.keys().next().value;
  if (typeof oldest === "string") capabilitiesByToken.delete(oldest);
}
function sweepExpiredMessageActionTurnCapabilities(nowMs = Date.now()) {
  let removed = 0;
  for (const [token, capability] of capabilitiesByToken)
    if (nowMs >= capability.expiresAtMs) {
      capabilitiesByToken.delete(token);
      removed += 1;
    }
  return removed;
}
/**
 * Mint an opaque current-turn capability from trusted channel ingress.
 * Public Gateway agent requests never receive this token.
 */
function mintMessageActionTurnCapability(params) {
  const agentId = normalizeAgentId(params.agentId);
  const runId = params.runId.trim();
  const sessionKey = params.sessionKey.trim();
  if (!agentId || !runId || !sessionKey)
    throw new Error("message action turn capability requires agent, run, and session identity");
  const nowMs = params.nowMs ?? Date.now();
  sweepExpiredMessageActionTurnCapabilities(nowMs);
  while (capabilitiesByToken.size >= MAX_ACTIVE_CAPABILITIES) evictOldestCapability();
  const token = randomBytes(32).toString("base64url");
  capabilitiesByToken.set(token, {
    agentId,
    runId,
    sessionKey,
    expiresAtMs: nowMs + resolveTtlMs(params.ttlMs),
    sessionId: normalizeOptionalString(params.sessionId),
    requesterAccountId: normalizeOptionalString(params.requesterAccountId),
    requesterSenderId: normalizeOptionalString(params.requesterSenderId),
    toolContext: copyToolContext(params.toolContext),
  });
  return token;
}
function resolveMessageActionTurnCapability(params) {
  const token = params.token?.trim();
  if (!token) return;
  const capability = capabilitiesByToken.get(token);
  if (!capability) return;
  if ((params.nowMs ?? Date.now()) >= capability.expiresAtMs) {
    capabilitiesByToken.delete(token);
    return;
  }
  if (
    capability.agentId !== normalizeAgentId(params.agentId) ||
    capability.runId !== params.runId?.trim() ||
    capability.sessionKey !== params.sessionKey.trim() ||
    (capability.sessionId && capability.sessionId !== normalizeOptionalString(params.sessionId))
  )
    return;
  return {
    expiresAtMs: capability.expiresAtMs,
    sessionId: capability.sessionId,
    requesterAccountId: capability.requesterAccountId,
    requesterSenderId: capability.requesterSenderId,
    toolContext: copyToolContext(capability.toolContext),
  };
}
function revokeMessageActionTurnCapability(token) {
  return token ? capabilitiesByToken.delete(token) : false;
}
//#endregion
//#region src/agents/tools/gateway-caller-context.ts
const gatewayToolCallerStorage = new AsyncLocalStorage();
function getGatewayToolCallerIdentity() {
  return gatewayToolCallerStorage.getStore();
}
async function withGatewayToolCallerIdentity(identity, run) {
  if (!identity?.agentId?.trim() || !identity.sessionKey?.trim()) return await run();
  return await gatewayToolCallerStorage.run(
    {
      agentId: identity.agentId.trim(),
      sessionKey: identity.sessionKey.trim(),
      ...(identity.turnSourceChannel?.trim()
        ? { turnSourceChannel: identity.turnSourceChannel.trim() }
        : {}),
      ...(identity.turnSourceTo?.trim() ? { turnSourceTo: identity.turnSourceTo.trim() } : {}),
      ...(identity.turnSourceAccountId?.trim()
        ? { turnSourceAccountId: identity.turnSourceAccountId.trim() }
        : {}),
      ...(identity.turnSourceThreadId !== void 0
        ? { turnSourceThreadId: identity.turnSourceThreadId }
        : {}),
    },
    run,
  );
}
function wrapToolWithGatewayCallerIdentity(tool, identity) {
  if (!identity?.agentId?.trim() || !identity.sessionKey?.trim() || !tool.execute) return tool;
  const wrapped = {
    ...tool,
    execute: async (...args) =>
      await withGatewayToolCallerIdentity(identity, async () => await tool.execute?.(...args)),
  };
  copyPluginToolMeta(tool, wrapped);
  copyChannelAgentToolMeta(tool, wrapped);
  copyBeforeToolCallHookMarker(tool, wrapped);
  copyToolTerminalPresentation(tool, wrapped);
  return wrapped;
}
//#endregion
//#region src/agents/tools/gateway.ts
/**
 * Gateway call helpers for built-in tools.
 *
 * Resolves gateway URL/token overrides, local credentials, and least-privilege operator scopes.
 */
/** Reads common gateway options from tool parameters while preserving explicit token whitespace. */
function readGatewayCallOptions(params) {
  return {
    gatewayUrl: readStringParam(params, "gatewayUrl", { trim: false }),
    gatewayToken: readStringParam(params, "gatewayToken", { trim: false }),
    timeoutMs: readPositiveIntegerParam(params, "timeoutMs"),
  };
}
/**
 * Canonicalizes websocket URLs for allowlist comparisons without retaining paths or credentials.
 */
function canonicalizeToolGatewayWsUrl(raw) {
  const input = raw.trim();
  let url;
  try {
    url = new URL(input);
  } catch (error) {
    const message = formatErrorMessage(error);
    throw new Error(`invalid gatewayUrl: ${input} (${message})`, { cause: error });
  }
  if (url.protocol !== "ws:" && url.protocol !== "wss:")
    throw new Error(`invalid gatewayUrl protocol: ${url.protocol} (expected ws:// or wss://)`);
  if (url.username || url.password)
    throw new Error("invalid gatewayUrl: credentials are not allowed");
  if (url.search || url.hash) throw new Error("invalid gatewayUrl: query/hash not allowed");
  if (url.pathname && url.pathname !== "/") throw new Error("invalid gatewayUrl: path not allowed");
  return {
    origin: url.origin,
    key: `${url.protocol}//${normalizeLowercaseStringOrEmpty(url.host)}`,
  };
}
function resolveLocalGatewayUrlKeys(cfg) {
  const port = resolveGatewayPort(cfg);
  return /* @__PURE__ */ new Set([
    `ws://127.0.0.1:${port}`,
    `wss://127.0.0.1:${port}`,
    `ws://localhost:${port}`,
    `wss://localhost:${port}`,
    `ws://[::1]:${port}`,
    `wss://[::1]:${port}`,
  ]);
}
function resolveConfiguredRemoteGatewayKey(cfg) {
  let remoteKey;
  const remoteUrl = normalizeOptionalString(cfg.gateway?.remote?.url) ?? "";
  if (remoteUrl)
    try {
      remoteKey = canonicalizeToolGatewayWsUrl(remoteUrl).key;
    } catch {}
  return remoteKey;
}
function resolveDefaultGatewayTarget(params) {
  if (params.envGatewayUrl) return "remote";
  if (
    params.cfg.gateway?.mode === "remote" &&
    normalizeOptionalString(params.cfg.gateway.remote?.url)
  )
    return "remote";
  return "local";
}
function validateGatewayUrlOverrideForAgentTools(params) {
  const { cfg } = params;
  const localAllowed = resolveLocalGatewayUrlKeys(cfg);
  const remoteKey = resolveConfiguredRemoteGatewayKey(cfg);
  const parsed = canonicalizeToolGatewayWsUrl(params.urlOverride);
  if (localAllowed.has(parsed.key))
    return {
      url: parsed.origin,
      target: "local",
    };
  if (remoteKey && parsed.key === remoteKey)
    return {
      url: parsed.origin,
      target: "remote",
    };
  const port = resolveGatewayPort(cfg);
  throw new Error(
    [
      "gatewayUrl override rejected.",
      `Allowed: ws(s) loopback on port ${port} (127.0.0.1/localhost/[::1])`,
      "Or: configure gateway.remote.url and omit gatewayUrl to use the configured remote gateway.",
    ].join(" "),
  );
}
function resolveGatewayOverrideToken(params) {
  if (params.explicitToken) return params.explicitToken;
  return resolveGatewayCredentialsFromConfig({
    cfg: params.cfg,
    env: process.env,
    modeOverride: params.target,
    remoteTokenFallback: params.target === "remote" ? "remote-only" : "remote-env-local",
    remotePasswordFallback: params.target === "remote" ? "remote-only" : "remote-env-local",
  }).token;
}
/**
 * Resolves the gateway URL, token, and timeout for agent tool calls.
 */
function resolveGatewayOptions(opts) {
  const cfg = getRuntimeConfig();
  const validatedOverride =
    trimToUndefined(opts?.gatewayUrl) !== void 0
      ? validateGatewayUrlOverrideForAgentTools({
          cfg,
          urlOverride: String(opts?.gatewayUrl),
        })
      : void 0;
  const explicitToken = trimToUndefined(opts?.gatewayToken);
  const token = validatedOverride
    ? resolveGatewayOverrideToken({
        cfg,
        target: validatedOverride.target,
        explicitToken,
      })
    : explicitToken;
  const timeoutMs =
    typeof opts?.timeoutMs === "number" && Number.isFinite(opts.timeoutMs)
      ? Math.max(1, Math.floor(opts.timeoutMs))
      : 3e4;
  const envGatewayUrl = trimToUndefined(process.env.OPENCLAW_GATEWAY_URL);
  const target =
    validatedOverride?.target ??
    resolveDefaultGatewayTarget({
      cfg,
      envGatewayUrl,
    });
  return {
    url: validatedOverride?.url,
    token,
    timeoutMs,
    target,
  };
}
const APPROVAL_RUNTIME_METHODS = /* @__PURE__ */ new Set([
  "exec.approval.request",
  "exec.approval.resolve",
  "exec.approval.waitDecision",
  "plugin.approval.request",
  "plugin.approval.waitDecision",
]);
const AGENT_RUNTIME_IDENTITY_METHODS = /* @__PURE__ */ new Set([
  "wake",
  "cron.list",
  "cron.get",
  "cron.add",
  "cron.update",
  "cron.remove",
  "cron.run",
  "cron.runs",
]);
const OPTIONAL_LOCAL_AGENT_RUNTIME_IDENTITY_METHODS = /* @__PURE__ */ new Set(["node.invoke"]);
function resolveApprovalRuntimeTokenForGatewayTool(params) {
  if (!APPROVAL_RUNTIME_METHODS.has(params.method)) return;
  if (trimToUndefined(params.opts.gatewayUrl) !== void 0) return;
  if (params.target !== "local") return;
  return getOperatorApprovalRuntimeToken();
}
function isApprovalReplayNodeSystemRun(method, callParams) {
  const invoke = method === "node.invoke" ? asNullableRecord(callParams) : null;
  const run = invoke?.command === "system.run" ? asNullableRecord(invoke.params) : null;
  const decision = normalizeOptionalString(run?.approvalDecision);
  return run?.approved === true || decision === "allow-once" || decision === "allow-always";
}
function attachNodeInvokeTurnSource(method, params) {
  if (method !== "node.invoke") return params;
  const invoke = asNullableRecord(params);
  const caller = getGatewayToolCallerIdentity();
  if (!invoke || !caller) return params;
  return {
    ...omitNodeInvokeTurnSource(invoke),
    ...(caller.turnSourceChannel ? { turnSourceChannel: caller.turnSourceChannel } : {}),
    ...(caller.turnSourceTo ? { turnSourceTo: caller.turnSourceTo } : {}),
    ...(caller.turnSourceAccountId ? { turnSourceAccountId: caller.turnSourceAccountId } : {}),
    ...(caller.turnSourceThreadId !== void 0
      ? { turnSourceThreadId: caller.turnSourceThreadId }
      : {}),
  };
}
function omitNodeInvokeTurnSource(invoke) {
  const legacyParams = { ...invoke };
  delete legacyParams.turnSourceChannel;
  delete legacyParams.turnSourceTo;
  delete legacyParams.turnSourceAccountId;
  delete legacyParams.turnSourceThreadId;
  return legacyParams;
}
function stripNodeInvokeTurnSource(params) {
  const invoke = asNullableRecord(params);
  return invoke ? omitNodeInvokeTurnSource(invoke) : params;
}
function resolveApprovalRequesterDeviceIdentityForGatewayTool(params) {
  const isApprovalRuntimeMethod = APPROVAL_RUNTIME_METHODS.has(params.method);
  const isNodeApprovalReplay = isApprovalReplayNodeSystemRun(params.method, params.callParams);
  if (!isApprovalRuntimeMethod && !isNodeApprovalReplay) return;
  if (isApprovalRuntimeMethod && trimToUndefined(params.opts.gatewayUrl) !== void 0) return;
  try {
    if (isNodeApprovalReplay) {
      const identity = loadDeviceIdentityIfPresent();
      if (!identity) throw new Error("device identity is not persisted");
      return identity;
    }
    const identity = loadOrCreateDeviceIdentity();
    if (loadDeviceIdentityIfPresent()?.deviceId !== identity.deviceId)
      throw new Error("device identity is not persisted");
    return identity;
  } catch (error) {
    if (isNodeApprovalReplay)
      throw new Error(
        [
          "approved node gateway calls require a stable device identity.",
          "Fix the OpenClaw state directory permissions and retry the approval.",
        ].join(" "),
        { cause: error },
      );
    if (params.target === "local") return;
    throw new Error(
      [
        "remote approval gateway calls require a stable device identity.",
        "Fix the OpenClaw state directory permissions or use the local approval-runtime gateway.",
      ].join(" "),
      { cause: error },
    );
  }
}
async function resolveAgentRuntimeIdentityTokenForGatewayTool(params) {
  const optionalLocalIdentity = OPTIONAL_LOCAL_AGENT_RUNTIME_IDENTITY_METHODS.has(params.method);
  if (
    !params.required &&
    !AGENT_RUNTIME_IDENTITY_METHODS.has(params.method) &&
    !optionalLocalIdentity
  )
    return;
  const identity = getGatewayToolCallerIdentity();
  if (!identity) {
    if (params.required)
      throw new Error("trusted agent runtime identity required for this gateway call");
    return;
  }
  const hasGatewayUrlOverride = trimToUndefined(params.opts.gatewayUrl) !== void 0;
  const hasGatewayTokenOverride = trimToUndefined(params.opts.gatewayToken) !== void 0;
  if (hasGatewayUrlOverride || hasGatewayTokenOverride || params.target !== "local") {
    if (optionalLocalIdentity && !params.required) return;
    throw new Error("agent gateway calls require the trusted local gateway context");
  }
  try {
    return await mintAgentRuntimeIdentityToken(identity);
  } catch (error) {
    if (optionalLocalIdentity && !params.required) return;
    throw error;
  }
}
async function resolveMessageActionAgentRuntimeIdentityToken(params) {
  const identity = getGatewayToolCallerIdentity();
  if (!identity) return;
  const hasGatewayUrlOverride = trimToUndefined(params.opts.gatewayUrl) !== void 0;
  const hasGatewayTokenOverride = trimToUndefined(params.opts.gatewayToken) !== void 0;
  if (hasGatewayUrlOverride || hasGatewayTokenOverride || params.target !== "local") return;
  const messageActionContext = resolveMessageActionTurnCapability({
    token: params.turnCapability,
    agentId: identity.agentId,
    runId: params.runId,
    sessionKey: identity.sessionKey,
    sessionId: params.sessionId,
  });
  if (!messageActionContext) return;
  return await mintAgentRuntimeIdentityToken({
    ...identity,
    messageActionContext,
  });
}
function isStaleGatewayAgentRuntimeIdentityRejection(error) {
  const message = formatErrorMessage(error);
  if (
    message.includes(
      "gateway rejected required agent runtime identity auth field; refusing to retry without it",
    )
  )
    return true;
  return (
    message.includes("invalid connect params") &&
    message.includes("/auth") &&
    message.includes("unexpected property 'agentRuntimeIdentityToken'")
  );
}
function isStaleGatewayNodeInvokeTurnSourceRejection(error) {
  if (!(error instanceof Error) || error.name !== "GatewayClientRequestError") return false;
  const requestError = error;
  if (requestError.gatewayCode !== ErrorCodes.INVALID_REQUEST) return false;
  if (asNullableRecord(requestError.details)?.nodeCommandDispatched === true) return false;
  const message = formatErrorMessage(error);
  if (!message.includes("invalid node.invoke params:")) return false;
  return ["turnSourceChannel", "turnSourceTo", "turnSourceAccountId", "turnSourceThreadId"].some(
    (field) => message.includes(`unexpected property '${field}'`),
  );
}
function staleGatewayAgentRuntimeIdentityError(cause) {
  return new Error(
    [
      "The running Gateway is from an older OpenClaw build and rejected current agent runtime connection metadata.",
      "Restart the Gateway with `openclaw gateway restart`, then retry.",
    ].join(" "),
    { cause },
  );
}
/**
 * Calls a gateway method as the agent-tool backend client with least-privilege scopes.
 */
async function callGatewayTool(method, opts, params, extra) {
  const gateway = resolveGatewayOptions(opts);
  const callParams = attachNodeInvokeTurnSource(method, params);
  const scopes = Array.isArray(extra?.scopes)
    ? extra.scopes
    : resolveLeastPrivilegeOperatorScopesForMethod(method, callParams);
  const approvalRuntimeToken = resolveApprovalRuntimeTokenForGatewayTool({
    method,
    opts,
    target: gateway.target,
  });
  const agentRuntimeIdentityToken = await resolveAgentRuntimeIdentityTokenForGatewayTool({
    method,
    opts,
    target: gateway.target,
    required: extra?.requireAgentRuntimeIdentity,
  });
  const deviceIdentity = resolveApprovalRequesterDeviceIdentityForGatewayTool({
    method,
    callParams,
    opts,
    target: gateway.target,
  });
  const callOptions = {
    url: gateway.url,
    token: gateway.token,
    method,
    params: callParams,
    timeoutMs: gateway.timeoutMs,
    signal: extra?.signal,
    expectFinal: extra?.expectFinal,
    clientName: GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT,
    clientDisplayName: "agent",
    mode: GATEWAY_CLIENT_MODES.BACKEND,
    ...(approvalRuntimeToken ? { approvalRuntimeToken } : {}),
    ...(agentRuntimeIdentityToken ? { agentRuntimeIdentityToken } : {}),
    ...(deviceIdentity ? { deviceIdentity } : {}),
    scopes,
  };
  try {
    return await callGateway(callOptions);
  } catch (error) {
    if (method === "node.invoke" && isStaleGatewayNodeInvokeTurnSourceRejection(error))
      return await callGateway({
        ...callOptions,
        params: stripNodeInvokeTurnSource(callOptions.params),
      });
    if (agentRuntimeIdentityToken && isStaleGatewayAgentRuntimeIdentityRejection(error)) {
      if (method === "node.invoke" && extra?.requireAgentRuntimeIdentity !== true)
        return await callGateway({
          ...callOptions,
          params: stripNodeInvokeTurnSource(callOptions.params),
          agentRuntimeIdentityToken: void 0,
        });
      throw staleGatewayAgentRuntimeIdentityError(error);
    }
    throw error;
  }
}
//#endregion
export {
  BEFORE_TOOL_CALL_HOOK_CONTEXT as C,
  isToolWrappedWithBeforeToolCallHook as D,
  copyBeforeToolCallHookMarker as E,
  setBeforeToolCallDiagnosticsEnabled as O,
  BEFORE_TOOL_CALL_DIAGNOSTIC_OPTIONS as S,
  BEFORE_TOOL_CALL_WRAPPED as T,
  resolveChannelMessageToolHints as _,
  withGatewayToolCallerIdentity as a,
  copyChannelAgentToolMeta as b,
  mintMessageActionTurnCapability as c,
  copyToolTerminalPresentation as d,
  getToolTerminalPresentation as f,
  listChannelSupportedActions as g,
  listChannelAgentTools as h,
  resolveMessageActionAgentRuntimeIdentityToken as i,
  resolveMessageActionTurnCapability as l,
  listAllChannelSupportedActions as m,
  readGatewayCallOptions as n,
  wrapToolWithGatewayCallerIdentity as o,
  setToolTerminalPresentation as p,
  resolveGatewayOptions as r,
  isTrustedMessageActionTurnIngress as s,
  callGatewayTool as t,
  revokeMessageActionTurnCapability as u,
  resolveChannelPromptCapabilities as v,
  BEFORE_TOOL_CALL_SOURCE_TOOL as w,
  getChannelAgentToolMeta as x,
  resolveChannelReactionGuidance as y,
};
