import { t as buildBundleMcpToolsFromCatalog } from "./agent-bundle-mcp-materialize-DxUEddBG.js";
import {
  a as peekSessionMcpRuntime,
  o as resolveSessionMcpConfigSummary,
} from "./agent-bundle-mcp-runtime-3IdGeACS.js";
import "./errors-BoHeli7m.js";
import {
  a as resolveAgentDir,
  n as listAgentIds,
  o as resolveAgentWorkspaceDir,
} from "./agent-scope-config-DVIR1nBa.js";
import { v as resolveSessionAgentId } from "./agent-scope-y9xQv_q1.js";
import { h as stringifyRouteThreadId } from "./channel-route-u-lrE52s.js";
import { t as resolveConversationCapabilityProfile } from "./conversation-capability-profile-BibJNI2C.js";
import "./config-BDv-QbJ6.js";
import { n as deliveryContextFromSession } from "./delivery-context.shared-WPZGmi9R.js";
import { t as applyFinalEffectiveToolPolicy } from "./effective-tool-policy-z5vi4lWv.js";
import { n as errorShape, t as ErrorCodes } from "./error-codes-O0AkRNx7.js";
import { r as toErrorObject } from "./error-coercion-CrJRoLe1.js";
import { a as logWarn, t as logDebug } from "./logger-BegyOJlO.js";
import { n as getConnectedNodePluginToolsVersion } from "./node-plugin-tool-snapshot-BelBVdcP.js";
import { o as resolveReplyToMode } from "./reply-threading-MGgPZ60G.js";
import {
  r as getActivePluginChannelRegistryVersion,
  u as getActivePluginRegistryVersion,
} from "./runtime-CcYnX0B4.js";
import "./agent-bundle-mcp-tools-DnfukTzv.js";
import { y as resolveRuntimeConfigCacheKey } from "./runtime-snapshot-BbbqRiDR.js";
import { n as resolveSessionModelRef } from "./session-model-ref-1c6_XVhy.js";
import { u as loadSessionEntry } from "./session-utils-DjTWBI0J.js";
import { ji as validateToolsEffectiveParams } from "./src-CIJf1lT0.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import {
  n as filterRuntimeCompatibleTools,
  t as filterProviderNormalizableTools,
} from "./tool-schema-projection-ZrMdwk4s.js";
import {
  a as resolveEffectiveToolRawDescription,
  i as resolveEffectiveToolLabel,
  o as summarizeEffectiveToolDescription,
  r as disambiguateEffectiveToolLabels,
} from "./tools-effective-inventory-build-Dq0dJSWS.js";
import {
  i as buildEffectiveToolInventoryGroups,
  n as resolveEffectiveToolInventory,
  r as resolveEffectiveToolInventoryRuntimeModelContext,
} from "./tools-effective-inventory-C8IMECgd.js";
import { n as normalizeAgentRuntimeTools } from "./tools-M6Rtal9l.js";
import { t as formatValidationErrors } from "./validation-errors-B9K6VbD7.js";
//#region src/agents/tools-effective-mcp-inventory.ts
const BUNDLE_MCP_PLUGIN_ID = "bundle-mcp";
function buildMcpUnsupportedToolSchemaNotice(diagnostic) {
  return {
    id: `unsupported-tool-schema:${diagnostic.toolName}`,
    severity: "warning",
    message: `Tool "${diagnostic.toolName}" from plugin "${BUNDLE_MCP_PLUGIN_ID}" has an unsupported runtime input schema (${diagnostic.violations.join(", ")}) and was quarantined before model projection. Fix or disable the owner, or remove the tool from active allowlists.`,
  };
}
function buildMcpToolInventoryEntries(tools) {
  return disambiguateEffectiveToolLabels(
    tools
      .map((tool) => ({
        id: tool.name,
        label: resolveEffectiveToolLabel(tool),
        description: summarizeEffectiveToolDescription(tool),
        rawDescription:
          resolveEffectiveToolRawDescription(tool) || summarizeEffectiveToolDescription(tool),
        source: "mcp",
        pluginId: BUNDLE_MCP_PLUGIN_ID,
      }))
      .toSorted((a, b) => a.label.localeCompare(b.label)),
    (entry) => entry.pluginId ?? entry.id,
  );
}
/** Builds the runtime-compatible MCP tool inventory and quarantine notices. */
function buildRuntimeCompatibleMcpToolInventory(params) {
  const preNormalizationProjection = filterProviderNormalizableTools(params.tools);
  const preNormalizationDiagnostics = [...preNormalizationProjection.diagnostics];
  const projection = filterRuntimeCompatibleTools(
    normalizeAgentRuntimeTools({
      tools: [...preNormalizationProjection.tools],
      provider: params.modelProvider ?? "",
      config: params.cfg,
      workspaceDir: params.workspaceDir,
      modelId: params.modelId,
      modelApi: params.modelApi ?? void 0,
      model: params.runtimeModel,
      allowProviderRuntimePluginLoad: false,
      onPreNormalizationSchemaDiagnostics: (diagnostics) =>
        preNormalizationDiagnostics.push(...diagnostics),
    }),
  );
  const diagnostics = [...preNormalizationDiagnostics, ...projection.diagnostics];
  return {
    entries: buildMcpToolInventoryEntries(projection.tools),
    notices: diagnostics.map(buildMcpUnsupportedToolSchemaNotice),
  };
}
//#endregion
//#region src/gateway/server-methods/tools-effective.ts
const TOOLS_EFFECTIVE_FRESH_TTL_MS = 1e4;
const TOOLS_EFFECTIVE_STALE_TTL_MS = 12e4;
const TOOLS_EFFECTIVE_SLOW_LOG_MS = 250;
const TOOLS_EFFECTIVE_CACHE_LIMIT = 128;
const MCP_CONFIG_SUMMARY_CACHE_LIMIT = 128;
let nowForToolsEffectiveCache = () => Date.now();
const toolsEffectiveCache = /* @__PURE__ */ new Map();
const toolsEffectiveInflight = /* @__PURE__ */ new Map();
const mcpConfigSummaryCache = /* @__PURE__ */ new Map();
function optionalCacheString(value) {
  return value?.trim() ?? "";
}
function buildToolsEffectiveCacheKey(params) {
  const context = params.context;
  return JSON.stringify({
    v: 1,
    config: context.runtimeConfigCacheKey,
    pluginRegistry: context.pluginRegistryVersion,
    channelRegistry: context.channelRegistryVersion,
    nodePluginTools: context.nodePluginToolsVersion,
    sessionKey: params.sessionKey,
    workspaceDir: optionalCacheString(context.workspaceDir),
    agentId: context.agentId,
    modelProvider: optionalCacheString(context.modelProvider),
    modelId: optionalCacheString(context.modelId),
    messageProvider: optionalCacheString(context.messageProvider),
    accountId: optionalCacheString(context.accountId),
    currentChannelId: optionalCacheString(context.currentChannelId),
    currentThreadTs: optionalCacheString(context.currentThreadTs),
    groupId: optionalCacheString(context.groupId),
    groupChannel: optionalCacheString(context.groupChannel),
    groupSpace: optionalCacheString(context.groupSpace),
    replyToMode: optionalCacheString(context.replyToMode),
  });
}
function trimToolsEffectiveCache() {
  while (toolsEffectiveCache.size > TOOLS_EFFECTIVE_CACHE_LIMIT) {
    const oldest = toolsEffectiveCache.keys().next().value;
    if (typeof oldest !== "string") return;
    toolsEffectiveCache.delete(oldest);
  }
}
function buildMcpConfigSummaryCacheKey(params) {
  return JSON.stringify({
    v: 1,
    config: params.context.runtimeConfigCacheKey,
    pluginRegistry: params.context.pluginRegistryVersion,
    workspaceDir: params.workspaceDir,
  });
}
function trimMcpConfigSummaryCache() {
  while (mcpConfigSummaryCache.size > MCP_CONFIG_SUMMARY_CACHE_LIMIT) {
    const oldest = mcpConfigSummaryCache.keys().next().value;
    if (typeof oldest !== "string") return;
    mcpConfigSummaryCache.delete(oldest);
  }
}
function resolveCachedSessionMcpConfigSummary(params) {
  const key = buildMcpConfigSummaryCacheKey(params);
  const cached = mcpConfigSummaryCache.get(key);
  if (cached) return cached;
  const summary = resolveSessionMcpConfigSummary({
    workspaceDir: params.workspaceDir,
    cfg: params.context.cfg,
  });
  mcpConfigSummaryCache.set(key, summary);
  trimMcpConfigSummaryCache();
  return summary;
}
function cacheToolsEffectiveResult(key, value) {
  toolsEffectiveCache.delete(key);
  toolsEffectiveCache.set(key, {
    value,
    createdAtMs: nowForToolsEffectiveCache(),
  });
  trimToolsEffectiveCache();
}
function scheduleBaseToolsEffectiveRefresh(key, context) {
  const existing = toolsEffectiveInflight.get(key);
  if (existing) return existing;
  const startedAt = nowForToolsEffectiveCache();
  const task = new Promise((resolve, reject) => {
    setImmediate(() => {
      try {
        const value = resolveBaseToolsEffectiveInventory(context);
        cacheToolsEffectiveResult(key, value);
        const durationMs = nowForToolsEffectiveCache() - startedAt;
        if (durationMs >= TOOLS_EFFECTIVE_SLOW_LOG_MS)
          logDebug(
            `tools-effective: refresh durationMs=${durationMs} agent=${context.agentId} session=${context.sessionKey} tools=${value.groups.reduce((sum, group) => sum + group.tools.length, 0)}`,
          );
        resolve(value);
      } catch (err) {
        reject(toErrorObject(err, "Non-Error rejection"));
      } finally {
        toolsEffectiveInflight.delete(key);
      }
    });
  });
  toolsEffectiveInflight.set(key, task);
  return task;
}
function refreshBaseToolsEffectiveInBackground(key, context) {
  scheduleBaseToolsEffectiveRefresh(key, context).catch((err) => {
    logWarn(`tools-effective: background refresh failed: ${String(err)}`);
  });
}
async function resolveCachedBaseToolsEffective(params) {
  const key = buildToolsEffectiveCacheKey(params);
  const now = nowForToolsEffectiveCache();
  const cached = toolsEffectiveCache.get(key);
  if (cached) {
    const ageMs = now - cached.createdAtMs;
    if (ageMs < TOOLS_EFFECTIVE_FRESH_TTL_MS) return cached.value;
    if (ageMs < TOOLS_EFFECTIVE_STALE_TTL_MS) {
      refreshBaseToolsEffectiveInBackground(key, params.context);
      return cached.value;
    }
  }
  return scheduleBaseToolsEffectiveRefresh(key, params.context);
}
function resolveRequestedAgentIdOrRespondError(params) {
  const knownAgents = listAgentIds(params.cfg);
  const requestedAgentId = normalizeOptionalString(params.rawAgentId) ?? "";
  if (!requestedAgentId) return;
  if (!knownAgents.includes(requestedAgentId)) {
    params.respond(
      false,
      void 0,
      errorShape(ErrorCodes.INVALID_REQUEST, `unknown agent id "${requestedAgentId}"`),
    );
    return null;
  }
  return requestedAgentId;
}
function appendMcpInventoryGroups(params) {
  const mcpEntries = params.mcpInventory.entries.filter((entry) => entry.source === "mcp");
  const notices = [...(params.base.notices ?? []), ...params.mcpInventory.notices];
  const base =
    notices.length > 0
      ? {
          ...params.base,
          notices,
        }
      : params.base;
  if (mcpEntries.length === 0) return base;
  const mcpGroups = buildEffectiveToolInventoryGroups(mcpEntries);
  return {
    ...base,
    groups: [...base.groups, ...mcpGroups],
  };
}
function appendToolInventoryNotice(base, notice) {
  return {
    ...base,
    notices: [...(base.notices ?? []), notice],
  };
}
function formatMcpServerNames(names) {
  if (names.length === 0) return "configured MCP servers";
  const visible = names
    .slice(0, 3)
    .map((name) => `"${name}"`)
    .join(", ");
  return names.length > 3 ? `${visible}, and ${names.length - 3} more MCP servers` : visible;
}
function mcpDiscoveryNotice(mcpServerNames, reason) {
  if (mcpServerNames.length === 0) return;
  const servers = formatMcpServerNames(mcpServerNames);
  switch (reason) {
    case "stale-config":
      return {
        id: "mcp-stale-catalog",
        severity: "info",
        message: `MCP servers ${servers} changed since the current runtime catalog was discovered. MCP tools will appear here after the next agent run discovers them.`,
      };
    case "not-listed":
      return {
        id: "mcp-not-yet-listed",
        severity: "info",
        message: `MCP servers ${servers} are connected but have not finished listing tools yet. MCP tools will appear here after the session discovers them.`,
      };
    case "not-connected":
      return {
        id: "mcp-not-yet-connected",
        severity: "info",
        message: `MCP servers ${servers} are configured but not connected for this session yet. MCP tools will appear here after an agent run discovers them.`,
      };
    default:
      return;
  }
}
function maybeAppendMcpNotice(base, mcpServerNames, reason) {
  const notice = mcpDiscoveryNotice(mcpServerNames, reason);
  return notice ? appendToolInventoryNotice(base, notice) : base;
}
function resolveBaseToolsEffectiveInventory(context) {
  const agentDir = resolveAgentDir(context.cfg, context.agentId);
  const runtimeModelContext = resolveEffectiveToolInventoryRuntimeModelContext({
    cfg: context.cfg,
    agentId: context.agentId,
    agentDir,
    workspaceDir: context.workspaceDir,
    modelProvider: context.modelProvider,
    modelId: context.modelId,
  });
  return resolveEffectiveToolInventory({
    cfg: context.cfg,
    agentId: context.agentId,
    agentDir,
    sessionKey: context.sessionKey,
    workspaceDir: context.workspaceDir,
    messageProvider: context.messageProvider,
    modelProvider: context.modelProvider,
    modelId: context.modelId,
    modelApi: runtimeModelContext.modelApi,
    runtimeModel: runtimeModelContext.runtimeModel,
    currentChannelId: context.currentChannelId,
    currentThreadTs: context.currentThreadTs,
    accountId: context.accountId,
    groupId: context.groupId,
    groupChannel: context.groupChannel,
    groupSpace: context.groupSpace,
    replyToMode: context.replyToMode,
  });
}
function filterMcpTools(params) {
  return applyFinalEffectiveToolPolicy({
    bundledTools: params.mcpTools,
    config: params.context.cfg,
    conversationCapabilityProfile: resolveConversationCapabilityProfile({
      config: params.context.cfg,
      sessionKey: params.context.sessionKey,
      agentId: params.context.agentId,
      modelProvider: params.context.modelProvider,
      modelId: params.context.modelId,
      messageProvider: params.context.messageProvider,
      agentAccountId: params.context.accountId,
      groupId: params.context.groupId,
      groupChannel: params.context.groupChannel,
      groupSpace: params.context.groupSpace,
      spawnedBy: params.context.spawnedBy,
    }),
    warn: logWarn,
  });
}
async function resolveReadOnlyToolsEffectiveInventory(context) {
  const base = await resolveCachedBaseToolsEffective({
    sessionKey: context.sessionKey,
    context,
  });
  const runtime = peekSessionMcpRuntime({
    sessionId: context.sessionId,
    sessionKey: context.sessionKey,
  });
  const mcpConfig = resolveCachedSessionMcpConfigSummary({
    context,
    workspaceDir: runtime?.workspaceDir ?? context.workspaceDir,
  });
  if (mcpConfig.serverNames.length === 0) return base;
  if (!runtime) return maybeAppendMcpNotice(base, mcpConfig.serverNames, "not-connected");
  if (runtime.configFingerprint !== mcpConfig.fingerprint)
    return maybeAppendMcpNotice(base, mcpConfig.serverNames, "stale-config");
  const catalog = runtime.peekCatalog();
  if (!catalog) return maybeAppendMcpNotice(base, mcpConfig.serverNames, "not-listed");
  const filteredMcpTools = filterMcpTools({
    context,
    mcpTools: buildBundleMcpToolsFromCatalog({
      catalog,
      reservedToolNames: base.groups.flatMap((group) => group.tools.map((tool) => tool.id)),
    }),
  });
  const agentDir = resolveAgentDir(context.cfg, context.agentId);
  const runtimeModelContext = resolveEffectiveToolInventoryRuntimeModelContext({
    cfg: context.cfg,
    agentId: context.agentId,
    agentDir,
    workspaceDir: runtime.workspaceDir,
    modelProvider: context.modelProvider,
    modelId: context.modelId,
  });
  return appendMcpInventoryGroups({
    base,
    mcpInventory: buildRuntimeCompatibleMcpToolInventory({
      tools: filteredMcpTools,
      cfg: context.cfg,
      workspaceDir: runtime.workspaceDir,
      modelProvider: context.modelProvider,
      modelId: context.modelId,
      modelApi: runtimeModelContext.modelApi,
      runtimeModel: runtimeModelContext.runtimeModel,
    }),
  });
}
function resolveTrustedToolsEffectiveContext(params) {
  const loaded = loadSessionEntry(
    params.sessionKey,
    params.requestedAgentId ? { agentId: params.requestedAgentId } : void 0,
  );
  if (!loaded.entry) {
    params.respond(
      false,
      void 0,
      errorShape(ErrorCodes.INVALID_REQUEST, `unknown session key "${params.sessionKey}"`),
    );
    return null;
  }
  const canonicalKey = loaded.canonicalKey ?? params.sessionKey;
  const allowRequestedAgentOverride = canonicalKey === "global" && Boolean(params.requestedAgentId);
  const sessionAgentId = resolveSessionAgentId({
    sessionKey: canonicalKey,
    config: loaded.cfg,
    ...(allowRequestedAgentOverride ? { agentId: params.requestedAgentId } : {}),
  });
  if (params.requestedAgentId && params.requestedAgentId !== sessionAgentId) {
    params.respond(
      false,
      void 0,
      errorShape(
        ErrorCodes.INVALID_REQUEST,
        `agent id "${params.requestedAgentId}" does not match session agent "${sessionAgentId}"`,
      ),
    );
    return null;
  }
  const delivery = deliveryContextFromSession(loaded.entry);
  const resolvedModel = resolveSessionModelRef(loaded.cfg, loaded.entry, sessionAgentId);
  const workspaceDir =
    normalizeOptionalString(loaded.entry.spawnedWorkspaceDir) ??
    resolveAgentWorkspaceDir(loaded.cfg, sessionAgentId);
  const runtimeConfigCacheKey = resolveRuntimeConfigCacheKey(loaded.cfg);
  const pluginRegistryVersion = getActivePluginRegistryVersion();
  const channelRegistryVersion = getActivePluginChannelRegistryVersion();
  const nodePluginToolsVersion = getConnectedNodePluginToolsVersion();
  return {
    cfg: loaded.cfg,
    agentId: sessionAgentId,
    sessionKey: params.sessionKey,
    sessionId: loaded.entry.sessionId,
    workspaceDir,
    runtimeConfigCacheKey,
    pluginRegistryVersion,
    channelRegistryVersion,
    nodePluginToolsVersion,
    modelProvider: resolvedModel.provider,
    modelId: resolvedModel.model,
    messageProvider:
      delivery?.channel ??
      loaded.entry.lastChannel ??
      loaded.entry.channel ??
      loaded.entry.origin?.provider,
    accountId: delivery?.accountId ?? loaded.entry.lastAccountId ?? loaded.entry.origin?.accountId,
    currentChannelId: delivery?.to,
    currentThreadTs:
      delivery?.threadId != null
        ? stringifyRouteThreadId(delivery.threadId)
        : loaded.entry.lastThreadId != null
          ? stringifyRouteThreadId(loaded.entry.lastThreadId)
          : loaded.entry.origin?.threadId != null
            ? stringifyRouteThreadId(loaded.entry.origin.threadId)
            : void 0,
    groupId: loaded.entry.groupId,
    groupChannel: loaded.entry.groupChannel,
    groupSpace: loaded.entry.space,
    spawnedBy: normalizeOptionalString(loaded.entry.spawnedBy),
    replyToMode: resolveReplyToMode(
      loaded.cfg,
      delivery?.channel ??
        loaded.entry.lastChannel ??
        loaded.entry.channel ??
        loaded.entry.origin?.provider,
      delivery?.accountId ?? loaded.entry.lastAccountId ?? loaded.entry.origin?.accountId,
      loaded.entry.chatType ?? loaded.entry.origin?.chatType,
    ),
  };
}
async function handleToolsEffectiveRequest(params) {
  if (!validateToolsEffectiveParams(params.rawParams)) {
    params.respond(
      false,
      void 0,
      errorShape(
        ErrorCodes.INVALID_REQUEST,
        `invalid tools.effective params: ${formatValidationErrors(validateToolsEffectiveParams.errors)}`,
      ),
    );
    return;
  }
  const cfg = params.context.getRuntimeConfig();
  const requestedAgentId = resolveRequestedAgentIdOrRespondError({
    rawAgentId: params.rawParams.agentId,
    cfg,
    respond: params.respond,
  });
  if (requestedAgentId === null) return;
  const trustedContext = resolveTrustedToolsEffectiveContext({
    sessionKey: params.rawParams.sessionKey,
    requestedAgentId,
    respond: params.respond,
  });
  if (!trustedContext) return;
  try {
    params.respond(true, await resolveReadOnlyToolsEffectiveInventory(trustedContext), void 0);
  } catch (err) {
    params.respond(
      false,
      void 0,
      errorShape(ErrorCodes.UNAVAILABLE, `tools.effective failed: ${String(err)}`),
    );
  }
}
const toolsEffectiveHandlers = {
  "tools.effective": async ({ params, respond, context }) => {
    await handleToolsEffectiveRequest({
      rawParams: params,
      respond,
      context,
    });
  },
};
const testing = {
  resetToolsEffectiveCacheForTest() {
    toolsEffectiveCache.clear();
    toolsEffectiveInflight.clear();
    mcpConfigSummaryCache.clear();
  },
  setToolsEffectiveNowForTest(now) {
    nowForToolsEffectiveCache = now;
  },
  resetToolsEffectiveNowForTest() {
    nowForToolsEffectiveCache = () => Date.now();
  },
};
//#endregion
export { testing as __testing, testing, toolsEffectiveHandlers };
