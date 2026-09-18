import {
  a as resolveAgentDir,
  o as resolveAgentWorkspaceDir,
} from "./agent-scope-config-DVIR1nBa.js";
import { v as resolveSessionAgentId } from "./agent-scope-y9xQv_q1.js";
import { t as createOpenClawCodingTools } from "./agent-tools-CQdhKaa9.js";
import { r as resolveEffectiveToolPolicy } from "./agent-tools.policy-BQgyHzcD.js";
import { r as normalizeStaticProviderModelId } from "./model-ref-shared-Bs7ONe2Q.js";
import { n as resolveModel } from "./model-uG6W-_2M.js";
import { c as resolveBundledStaticCatalogModel } from "./model.static-catalog-CxG7_5Cl.js";
import {
  n as findNormalizedProviderValue,
  r as normalizeProviderId,
} from "./provider-id-BIcU_2-A.js";
import { n as extractModelCompat } from "./provider-model-compat-oht7fX8H.js";
import { v as normalizeProviderTransportWithPlugin } from "./provider-runtime-DyIHJ2cX.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
} from "./string-coerce-DW4mBlAt.js";
import { m as normalizeToolName } from "./tool-policy-1QHiwXPv.js";
import { n as buildRuntimeCompatibleToolInventory } from "./tools-effective-inventory-build-Dq0dJSWS.js";
//#region src/agents/tools-effective-inventory-groups.ts
function groupLabel(source) {
  switch (source) {
    case "plugin":
      return "Connected tools";
    case "channel":
      return "Channel tools";
    case "mcp":
      return "MCP server tools";
    default:
      return "Built-in tools";
  }
}
/** Groups effective tool inventory entries by source in UI/report order. */
function buildEffectiveToolInventoryGroups(entries) {
  const groupsBySource = /* @__PURE__ */ new Map();
  for (const entry of entries) {
    const tools = groupsBySource.get(entry.source) ?? [];
    tools.push(entry);
    groupsBySource.set(entry.source, tools);
  }
  return ["core", "plugin", "channel", "mcp"]
    .map((source) => {
      const tools = groupsBySource.get(source);
      if (!tools || tools.length === 0) return null;
      return {
        id: source,
        label: groupLabel(source),
        source,
        tools,
      };
    })
    .filter((group) => group !== null);
}
//#endregion
//#region src/agents/tools-effective-inventory.ts
/**
 * Effective tool inventory resolver.
 *
 * Builds model-visible tool lists after profile, provider, plugin, policy, and compatibility filters.
 */
function listIncludesTool(list, toolName) {
  if (!Array.isArray(list)) return false;
  const normalizedToolName = normalizeToolName(toolName);
  return list.some((entry) => normalizeToolName(entry) === normalizedToolName);
}
function policyDeniesTool(policy, toolName) {
  return (
    listIncludesTool(policy?.deny, toolName) ||
    listIncludesTool(policy?.deny, "group:ui") ||
    listIncludesTool(policy?.deny, "group:openclaw")
  );
}
function hasExplicitBrowserIntent(cfg) {
  return cfg.browser?.enabled !== false && Boolean(cfg.browser || cfg.plugins?.entries?.browser);
}
function buildToolInventoryNotices(params) {
  if (
    params.entries.some((entry) => normalizeToolName(entry.id) === "browser") ||
    !hasExplicitBrowserIntent(params.cfg)
  )
    return;
  if (
    [
      params.effectivePolicy.globalPolicy,
      params.effectivePolicy.globalProviderPolicy,
      params.effectivePolicy.agentPolicy,
      params.effectivePolicy.agentProviderPolicy,
    ].some((policy) => policyDeniesTool(policy, "browser"))
  )
    return [
      {
        id: "browser-denied-by-policy",
        severity: "info",
        message:
          "Browser is configured, but this session does not expose the browser tool because tool policy denies it. Remove the browser deny entry to use browser automation.",
      },
    ];
  if (params.profile !== "full")
    return [
      {
        id: "browser-filtered-by-profile",
        severity: "info",
        message:
          'Browser is configured, but the current tool profile does not include the browser tool. Add tools.alsoAllow: ["browser"] or agents.list[].tools.alsoAllow: ["browser"]; tools.subagents.tools.allow alone cannot add it back after profile filtering.',
      },
    ];
  if (
    Array.isArray(params.cfg.plugins?.allow) &&
    !listIncludesTool(params.cfg.plugins.allow, "browser")
  )
    return [
      {
        id: "browser-plugin-not-allowed",
        severity: "warning",
        message:
          'Browser is configured, but plugins.allow does not include browser. Add "browser" to plugins.allow or remove the restrictive plugin allowlist.',
      },
    ];
}
function applyProviderTransportNormalization(params) {
  const normalized = normalizeProviderTransportWithPlugin({
    provider: params.provider,
    modelId: params.runtimeModel.id,
    config: params.cfg,
    workspaceDir: params.workspaceDir,
    context: {
      config: params.cfg,
      workspaceDir: params.workspaceDir,
      provider: params.provider,
      modelId: params.runtimeModel.id,
      api: params.runtimeModel.api,
      baseUrl: params.runtimeModel.baseUrl,
    },
  });
  if (!normalized) return params.runtimeModel;
  return {
    ...params.runtimeModel,
    api: normalized.api ?? params.runtimeModel.api,
    baseUrl: normalized.baseUrl ?? params.runtimeModel.baseUrl,
  };
}
function resolveConfiguredFallbackApi(providerConfig) {
  const explicitApi = normalizeOptionalString(providerConfig?.api);
  if (explicitApi) return explicitApi;
  return normalizeOptionalString(providerConfig?.baseUrl)
    ? "openai-completions"
    : "openai-responses";
}
function resolveDynamicRuntimeModelContext(params) {
  const runtimeModel = resolveModel(params.provider, params.modelId, params.agentDir, params.cfg, {
    workspaceDir: params.workspaceDir,
  }).model;
  if (!runtimeModel) return {};
  return {
    modelApi: runtimeModel.api,
    runtimeModel,
  };
}
/** Resolves the runtime model metadata needed to filter model-compatible tools. */
function resolveEffectiveToolInventoryRuntimeModelContext(params) {
  const provider = normalizeProviderId(params.modelProvider ?? "");
  const modelId = params.modelId?.trim() ?? "";
  if (!provider || !modelId) return {};
  const agentId = params.agentId?.trim() || resolveSessionAgentId({ config: params.cfg });
  const workspaceDir = params.workspaceDir ?? resolveAgentWorkspaceDir(params.cfg, agentId);
  const providerConfig = findNormalizedProviderValue(params.cfg.models?.providers, provider);
  const configuredModels = Array.isArray(providerConfig?.models) ? providerConfig.models : [];
  const normalizedModelId = normalizeStaticProviderModelId(provider, modelId);
  const normalizedModelKey = normalizeLowercaseStringOrEmpty(normalizedModelId);
  const providerPrefixedModelKey = normalizeLowercaseStringOrEmpty(
    `${provider}/${normalizedModelId}`,
  );
  const configuredModel = configuredModels.find((model) => {
    const key = normalizeLowercaseStringOrEmpty(normalizeStaticProviderModelId(provider, model.id));
    return key === normalizedModelKey || key === providerPrefixedModelKey;
  });
  const bundledStaticModel = resolveBundledStaticCatalogModel({
    provider,
    modelId,
    cfg: params.cfg,
    workspaceDir,
  });
  if (configuredModel) {
    const configuredApi =
      normalizeOptionalString(configuredModel.api) ??
      normalizeOptionalString(providerConfig?.api) ??
      normalizeOptionalString(bundledStaticModel?.api) ??
      resolveConfiguredFallbackApi(providerConfig);
    const runtimeModel = applyProviderTransportNormalization({
      cfg: params.cfg,
      provider,
      workspaceDir,
      runtimeModel: {
        ...bundledStaticModel,
        ...configuredModel,
        id: configuredModel.id,
        name: configuredModel.name ?? bundledStaticModel?.name ?? configuredModel.id,
        provider,
        api: configuredApi,
        baseUrl:
          normalizeOptionalString(configuredModel.baseUrl) ??
          normalizeOptionalString(providerConfig?.baseUrl) ??
          normalizeOptionalString(bundledStaticModel?.baseUrl),
      },
    });
    return {
      modelApi: runtimeModel.api,
      runtimeModel,
    };
  }
  if (!bundledStaticModel)
    return resolveDynamicRuntimeModelContext({
      cfg: params.cfg,
      agentDir: params.agentDir,
      workspaceDir,
      provider,
      modelId,
    });
  const runtimeModel = applyProviderTransportNormalization({
    cfg: params.cfg,
    provider,
    workspaceDir,
    runtimeModel: {
      ...bundledStaticModel,
      api: normalizeOptionalString(providerConfig?.api) ?? bundledStaticModel.api,
      baseUrl: normalizeOptionalString(providerConfig?.baseUrl) ?? bundledStaticModel.baseUrl,
    },
  });
  return {
    modelApi: runtimeModel.api,
    runtimeModel,
  };
}
/** Resolves compatibility metadata explicitly configured for a provider/model pair. */
function resolveConfiguredModelCompat(params) {
  const provider = normalizeProviderId(params.modelProvider ?? "");
  const modelId = params.modelId?.trim() ?? "";
  if (!provider || !modelId) return;
  const providerConfig = findNormalizedProviderValue(params.cfg.models?.providers, provider);
  const models = Array.isArray(providerConfig?.models) ? providerConfig.models : [];
  if (models.length === 0) return;
  const normalizedModelId = normalizeStaticProviderModelId(provider, modelId);
  const normalizedModelKey = normalizeLowercaseStringOrEmpty(normalizedModelId);
  const providerPrefixedModelKey = normalizeLowercaseStringOrEmpty(
    `${provider}/${normalizedModelId}`,
  );
  return extractModelCompat(
    models.find((model) => {
      const key = normalizeLowercaseStringOrEmpty(
        normalizeStaticProviderModelId(provider, model.id),
      );
      return key === normalizedModelKey || key === providerPrefixedModelKey;
    }),
  );
}
/** Resolves the grouped effective tool inventory and user-visible filtering notices. */
function resolveEffectiveToolInventory(params) {
  const agentId =
    params.agentId?.trim() ||
    resolveSessionAgentId({
      sessionKey: params.sessionKey,
      config: params.cfg,
    });
  const workspaceDir = params.workspaceDir ?? resolveAgentWorkspaceDir(params.cfg, agentId);
  const agentDir = params.agentDir ?? resolveAgentDir(params.cfg, agentId);
  const runtimeModelContext =
    params.modelApi || params.runtimeModel
      ? {
          modelApi: params.modelApi ?? params.runtimeModel?.api,
          runtimeModel: params.runtimeModel,
        }
      : resolveEffectiveToolInventoryRuntimeModelContext({
          cfg: params.cfg,
          agentId,
          agentDir,
          workspaceDir,
          modelProvider: params.modelProvider,
          modelId: params.modelId,
        });
  const modelCompat = resolveConfiguredModelCompat({
    cfg: params.cfg,
    modelProvider: params.modelProvider,
    modelId: params.modelId,
  });
  const projectedInventory = buildRuntimeCompatibleToolInventory({
    tools: createOpenClawCodingTools({
      agentId,
      sessionKey: params.sessionKey,
      workspaceDir,
      agentDir,
      config: params.cfg,
      modelProvider: params.modelProvider,
      modelId: params.modelId,
      modelApi: runtimeModelContext.modelApi,
      modelCompat,
      messageProvider: params.messageProvider,
      senderId: params.senderId,
      senderName: params.senderName ?? void 0,
      senderUsername: params.senderUsername ?? void 0,
      senderE164: params.senderE164 ?? void 0,
      agentAccountId: params.accountId ?? void 0,
      currentChannelId: params.currentChannelId,
      currentThreadTs: params.currentThreadTs,
      currentMessageId: params.currentMessageId,
      groupId: params.groupId ?? void 0,
      groupChannel: params.groupChannel ?? void 0,
      groupSpace: params.groupSpace ?? void 0,
      replyToMode: params.replyToMode,
      allowGatewaySubagentBinding: true,
      modelHasVision: params.modelHasVision,
      requireExplicitMessageTarget: params.requireExplicitMessageTarget,
      disableMessageTool: params.disableMessageTool,
    }),
    cfg: params.cfg,
    workspaceDir,
    modelProvider: params.modelProvider,
    modelId: params.modelId,
    modelApi: runtimeModelContext.modelApi,
    runtimeModel: runtimeModelContext.runtimeModel,
  });
  const effectivePolicy = resolveEffectiveToolPolicy({
    config: params.cfg,
    agentId,
    sessionKey: params.sessionKey,
    modelProvider: params.modelProvider,
    modelId: params.modelId,
  });
  const profile = effectivePolicy.providerProfile ?? effectivePolicy.profile ?? "full";
  const entries = projectedInventory.entries;
  const notices = [
    ...projectedInventory.notices,
    ...(buildToolInventoryNotices({
      cfg: params.cfg,
      profile,
      entries,
      effectivePolicy,
    }) ?? []),
  ];
  return {
    agentId,
    profile,
    groups: buildEffectiveToolInventoryGroups(entries),
    ...(notices.length > 0 ? { notices } : {}),
  };
}
//#endregion
export {
  buildEffectiveToolInventoryGroups as i,
  resolveEffectiveToolInventory as n,
  resolveEffectiveToolInventoryRuntimeModelContext as r,
  resolveConfiguredModelCompat as t,
};
