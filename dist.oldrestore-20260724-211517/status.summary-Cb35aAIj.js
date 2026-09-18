import { n as listGatewayAgentsBasic } from "./agent-list-DLfObW15.js";
import {
  T as hasSessionAutoModelFallbackProvenance,
  w as hasSessionActiveAutoModelFallback,
} from "./agent-scope-y9xQv_q1.js";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-CdX9UGcX.js";
import { r as resolveHeartbeatSummaryForAgent } from "./heartbeat-summary-CrfY3Te7.js";
import {
  A as projectConfigOntoRuntimeSourceSnapshot,
  i as getRuntimeConfig,
} from "./io-B3ne6NxF.js";
import { t as createLazyImportLoader } from "./lazy-promise-EhsWch5m.js";
import { a as createLazyRuntimeSurface } from "./lazy-runtime-B-Fc-m0I.js";
import "./config-BDv-QbJ6.js";
import { a as resolveMainSessionKey } from "./main-session-nrmKYo2W.js";
import { t as areRuntimeModelRefsEquivalent } from "./model-runtime-aliases-DMpABeI4.js";
import { l as resolveStorePath } from "./paths-TfuVT-K8.js";
import { y as listSessionEntries } from "./session-accessor-PZVNxFCV.js";
import { c as parseAgentSessionKey } from "./session-key-utils-B8sNp9l4.js";
import { w as resolveSessionTotalTokens } from "./store-CzZJhTF6.js";
import { u as peekSystemEvents } from "./system-events-CIAdjAwz.js";
import {
  i as summarizeRetainedLostTaskAuditFindings,
  r as summarizeActionableTaskAuditFindings,
} from "./task-registry.audit-DiY0ICYg.js";
import { s as resolveRuntimeServiceVersion } from "./version-CeFj_iGk.js";
//#region src/commands/status.summary.ts
const RECENT_SESSION_LIMIT = 10;
const channelSummaryModuleLoader = createLazyImportLoader(
  () => import("./channel-summary-CQT5CS7G.js"),
);
const channelPluginIdsModuleLoader = createLazyImportLoader(
  () => import("./channel-plugin-ids-D0R8mauV.js"),
);
const linkChannelModuleLoader = createLazyImportLoader(
  () => import("./status.link-channel-BJzTZJNu.js"),
);
const taskRegistryMaintenanceModuleLoader = createLazyImportLoader(
  () => import("./task-registry.maintenance-DmgKSfmH.js"),
);
const staticModelCatalogResolverLoader = createLazyImportLoader(async () => {
  const modelCatalog = await import("./model.static-catalog-kmjucSAR.js");
  return {
    resolveManifestModel: modelCatalog.createBundledStaticCatalogModelResolver({
      includeRuntimeDiscovery: true,
    }),
    createProviderContextResolver: modelCatalog.createBundledProviderStaticCatalogContextResolver,
  };
});
function loadChannelSummaryModule() {
  return channelSummaryModuleLoader.load();
}
function loadChannelPluginIdsModule() {
  return channelPluginIdsModuleLoader.load();
}
function loadLinkChannelModule() {
  return linkChannelModuleLoader.load();
}
const loadStatusSummaryRuntimeModule = createLazyRuntimeSurface(
  () => import("./commands/status.summary.runtime.js"),
  ({ statusSummaryRuntime }) => statusSummaryRuntime,
);
function loadTaskRegistryMaintenanceModule() {
  return taskRegistryMaintenanceModuleLoader.load();
}
function loadStaticModelCatalogResolvers() {
  return staticModelCatalogResolverLoader.load();
}
const buildFlags = (entry) => {
  if (!entry) return [];
  const flags = [];
  const think = entry?.thinkingLevel;
  if (typeof think === "string" && think.length > 0) flags.push(`think:${think}`);
  const verbose = entry?.verboseLevel;
  if (typeof verbose === "string" && verbose.length > 0) flags.push(`verbose:${verbose}`);
  if (entry?.fastMode === "auto") flags.push("fast:auto");
  else if (typeof entry?.fastMode === "boolean") flags.push(entry.fastMode ? "fast" : "fast:off");
  const reasoning = entry?.reasoningLevel;
  if (typeof reasoning === "string" && reasoning.length > 0) flags.push(`reasoning:${reasoning}`);
  const elevated = entry?.elevatedLevel;
  if (typeof elevated === "string" && elevated.length > 0) flags.push(`elevated:${elevated}`);
  if (entry?.systemSent) flags.push("system");
  if (entry?.abortedLastRun) flags.push("aborted");
  const sessionId = entry?.sessionId;
  if (typeof sessionId === "string" && sessionId.length > 0) flags.push(`id:${sessionId}`);
  return flags;
};
function discountRetainedLostTaskFailures(tasks, retainedLostCount) {
  if (retainedLostCount <= 0 || tasks.failures <= 0) return tasks;
  return {
    ...tasks,
    failures: Math.max(0, tasks.failures - retainedLostCount),
  };
}
function hasUserPinnedModelSelection(entry) {
  if (!entry?.modelOverride) return false;
  if (entry.modelOverrideSource === "user") return true;
  if (entry.modelOverrideSource === "auto") return false;
  return !hasSessionAutoModelFallbackProvenance(entry);
}
function normalizeStatusModelPart(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}
function resolveTrustedSessionContextTokens(params) {
  const contextTokens =
    typeof params.entry?.contextTokens === "number" && params.entry.contextTokens > 0
      ? params.entry.contextTokens
      : void 0;
  if (contextTokens === void 0) return;
  if (hasSessionAutoModelFallbackProvenance(params.entry)) return contextTokens;
  const entryProvider = normalizeStatusModelPart(params.entry?.modelProvider);
  const entryModel = normalizeStatusModelPart(params.entry?.model);
  const resolvedProvider = normalizeStatusModelPart(params.provider);
  const resolvedModel = normalizeStatusModelPart(params.model);
  if (!entryModel || !resolvedModel || entryModel !== resolvedModel) return;
  if (entryProvider && resolvedProvider && entryProvider !== resolvedProvider) return;
  return contextTokens;
}
function compareSessionCandidatesByUpdatedAt(left, right) {
  return (right.updatedAt ?? 0) - (left.updatedAt ?? 0);
}
function selectRecentSessionCandidates(candidates, limit) {
  const selected = [];
  for (const candidate of candidates) {
    const insertAt = selected.findIndex(
      (selectedCandidate) => compareSessionCandidatesByUpdatedAt(candidate, selectedCandidate) < 0,
    );
    if (insertAt >= 0) {
      selected.splice(insertAt, 0, candidate);
      if (selected.length > limit) selected.pop();
    } else if (selected.length < limit) selected.push(candidate);
  }
  return selected;
}
function listSessionCandidates(storePath, agentId) {
  return listSessionEntries({
    ...(agentId ? { agentId } : {}),
    storePath,
  })
    .filter(({ sessionKey }) => sessionKey !== "global" && sessionKey !== "unknown")
    .map(({ sessionKey, entry }) => ({
      key: sessionKey,
      entry,
      updatedAt: entry?.updatedAt ?? null,
    }));
}
/** Removes session paths and recent session details from a status summary. */
function redactSensitiveStatusSummary(summary) {
  return {
    ...summary,
    sessions: {
      ...summary.sessions,
      paths: [],
      defaults: {
        model: null,
        contextTokens: null,
      },
      recent: [],
      byAgent: summary.sessions.byAgent.map((entry) => ({
        ...entry,
        path: "[redacted]",
        recent: [],
      })),
    },
  };
}
/** Builds the aggregate status summary for agents, sessions, tasks, heartbeat, and channels. */
async function getStatusSummary(options = {}) {
  const { includeSensitive = true, includeChannelSummary = true } = options;
  const {
    classifySessionKey,
    resolveConfiguredStatusModelRef,
    resolveContextTokensForModel,
    resolveSessionRuntimeLabel,
    resolveSessionModelRef,
    resolveStatusModelComparisonLabel,
    resolveStatusModelLookupRef,
    waitForContextWindowCacheLoad,
  } = await loadStatusSummaryRuntimeModule();
  const cfg = options.config ?? getRuntimeConfig();
  await waitForContextWindowCacheLoad();
  const contextSourceConfig =
    options.sourceConfig !== void 0
      ? options.sourceConfig
      : projectConfigOntoRuntimeSourceSnapshot(cfg);
  const { resolveManifestModel, createProviderContextResolver } =
    await loadStaticModelCatalogResolvers();
  const resolveProviderContext = createProviderContextResolver({ cfg });
  const modelContextCache = /* @__PURE__ */ new Map();
  const resolveStaticModelContext = async (provider, model) => {
    if (!provider || !model) return {};
    const key = `${provider}\0${model}`;
    const cached = modelContextCache.get(key);
    if (cached) return cached;
    const resolved = (async () => {
      try {
        const entry =
          resolveManifestModel({
            provider,
            modelId: model,
          }) ??
          (await resolveProviderContext({
            provider,
            modelId: model,
          }));
        return {
          ...(entry?.contextWindow ? { modelContextWindow: entry.contextWindow } : {}),
          ...(entry?.contextTokens ? { modelContextTokens: entry.contextTokens } : {}),
        };
      } catch {
        return {};
      }
    })();
    modelContextCache.set(key, resolved);
    return resolved;
  };
  const channelScopeConfig =
    options.sourceConfig === void 0
      ? { config: cfg }
      : {
          config: cfg,
          activationSourceConfig: options.sourceConfig,
        };
  const needsChannelPlugins =
    includeChannelSummary &&
    (await loadChannelPluginIdsModule().then(({ hasConfiguredChannelsForReadOnlyScope }) =>
      hasConfiguredChannelsForReadOnlyScope(channelScopeConfig),
    ));
  const linkContext = needsChannelPlugins
    ? await loadLinkChannelModule().then(({ resolveLinkChannelContext }) =>
        resolveLinkChannelContext(cfg, { sourceConfig: options.sourceConfig }),
      )
    : null;
  const agentList = listGatewayAgentsBasic(cfg);
  const heartbeatAgents = agentList.agents.map((agent) => {
    const summary = resolveHeartbeatSummaryForAgent(cfg, agent.id);
    return {
      agentId: agent.id,
      enabled: summary.enabled,
      every: summary.every,
      everyMs: summary.everyMs,
    };
  });
  const channelSummary = needsChannelPlugins
    ? await loadChannelSummaryModule().then(({ buildChannelSummary }) =>
        buildChannelSummary(cfg, {
          colorize: true,
          includeAllowFrom: true,
          sourceConfig: options.sourceConfig,
        }),
      )
    : [];
  const queuedSystemEvents = peekSystemEvents(resolveMainSessionKey(cfg));
  const taskMaintenanceModule = await loadTaskRegistryMaintenanceModule();
  taskMaintenanceModule.configureTaskRegistryMaintenance();
  const inspectableTasks = taskMaintenanceModule.reconcileInspectableTasks();
  const rawTasks = taskMaintenanceModule.getInspectableTaskRegistrySummary(inspectableTasks);
  const taskAuditFindings = taskMaintenanceModule.getInspectableTaskAuditFindings(inspectableTasks);
  const now = Date.now();
  const taskAudit = summarizeActionableTaskAuditFindings(taskAuditFindings, { now });
  const taskAuditRetainedLost = summarizeRetainedLostTaskAuditFindings(taskAuditFindings, { now });
  const tasks = discountRetainedLostTaskFailures(rawTasks, taskAuditRetainedLost.count);
  const resolved = resolveConfiguredStatusModelRef({
    cfg,
    defaultProvider: DEFAULT_PROVIDER,
    defaultModel: DEFAULT_MODEL,
  });
  const configModel = resolved.model ?? "gpt-5.6-sol";
  const configModelContext = await resolveStaticModelContext(
    resolved.provider ?? "openai",
    configModel,
  );
  const configContextTokens =
    resolveContextTokensForModel({
      cfg,
      sourceCfg: contextSourceConfig,
      provider: resolved.provider ?? "openai",
      model: configModel,
      ...configModelContext,
      contextTokensOverride: cfg.agents?.defaults?.contextTokens,
      fallbackContextTokens: 2e5,
      allowAsyncLoad: false,
    }) ?? 2e5;
  const candidateCache = /* @__PURE__ */ new Map();
  const loadSessionCandidates = (storePath, agentId) => {
    const cacheKey = `${storePath}\0${agentId ?? ""}`;
    const cached = candidateCache.get(cacheKey);
    if (cached) return cached;
    const candidates = listSessionCandidates(storePath, agentId);
    candidateCache.set(cacheKey, candidates);
    return candidates;
  };
  const buildSessionRows = async (candidates, opts = {}) =>
    Promise.all(
      candidates.map(async ({ key, entry, updatedAt }) => {
        const age = updatedAt ? now - updatedAt : null;
        const parsedAgentId = parseAgentSessionKey(key)?.agentId;
        const agentId = opts.agentIdOverride ?? parsedAgentId;
        const configuredForSession = resolveConfiguredStatusModelRef({
          cfg,
          defaultProvider: DEFAULT_PROVIDER,
          defaultModel: DEFAULT_MODEL,
          agentId,
        });
        const configuredSessionModel = configuredForSession.model ?? "gpt-5.6-sol";
        const configuredSessionModelLabel = `${configuredForSession.provider ?? "openai"}/${configuredSessionModel}`;
        const resolvedModel = resolveSessionModelRef(cfg, entry, opts.agentIdOverride);
        const model = resolvedModel.model ?? configuredSessionModel ?? null;
        const lookupModel =
          resolveStatusModelLookupRef({
            provider: resolvedModel.provider,
            model,
            defaultProvider: configuredForSession.provider ?? "openai",
          }) ?? resolvedModel;
        const lookupModelId = lookupModel.model ?? model;
        const modelContext = await resolveStaticModelContext(
          lookupModel.provider,
          lookupModelId ?? void 0,
        );
        const selectedModelLabel =
          resolvedModel.provider && model ? `${resolvedModel.provider}/${model}` : model;
        const configuredSessionModelComparisonLabel = resolveStatusModelComparisonLabel({
          provider: configuredForSession.provider ?? "openai",
          model: configuredSessionModel,
          defaultProvider: DEFAULT_PROVIDER,
        });
        const selectedModelComparisonLabel = resolveStatusModelComparisonLabel({
          provider: resolvedModel.provider,
          model,
          defaultProvider: configuredForSession.provider ?? "openai",
        });
        const modelSelectionDiffers =
          selectedModelComparisonLabel != null &&
          configuredSessionModelComparisonLabel != null &&
          selectedModelComparisonLabel !== configuredSessionModelComparisonLabel &&
          !areRuntimeModelRefsEquivalent(
            selectedModelComparisonLabel,
            configuredSessionModelComparisonLabel,
          ) &&
          (hasUserPinnedModelSelection(entry) || hasSessionActiveAutoModelFallback(entry));
        const contextTokens =
          resolveContextTokensForModel({
            cfg,
            sourceCfg: contextSourceConfig,
            provider: lookupModel.provider,
            model: lookupModelId,
            ...modelContext,
            contextTokensOverride: resolveTrustedSessionContextTokens({
              entry,
              provider: lookupModel.provider,
              model: lookupModelId,
            }),
            fallbackContextTokens: configContextTokens ?? void 0,
            allowAsyncLoad: false,
          }) ?? null;
        const total = resolveSessionTotalTokens(entry);
        const totalTokensFresh =
          typeof entry?.totalTokens === "number" ? entry?.totalTokensFresh !== false : false;
        const remaining =
          contextTokens != null && total !== void 0 ? Math.max(0, contextTokens - total) : null;
        const pct =
          contextTokens && contextTokens > 0 && total !== void 0
            ? Math.min(999, Math.round((total / contextTokens) * 100))
            : null;
        const runtime = resolveSessionRuntimeLabel({
          cfg,
          entry,
          provider: lookupModel.provider,
          model: lookupModelId ?? "",
          agentId,
          sessionKey: key,
        });
        return {
          agentId,
          key,
          kind: classifySessionKey(key, entry),
          sessionId: entry?.sessionId,
          updatedAt,
          age,
          thinkingLevel: entry?.thinkingLevel,
          fastMode: entry?.fastMode,
          verboseLevel: entry?.verboseLevel,
          traceLevel: entry?.traceLevel,
          reasoningLevel: entry?.reasoningLevel,
          elevatedLevel: entry?.elevatedLevel,
          systemSent: entry?.systemSent,
          abortedLastRun: entry?.abortedLastRun,
          inputTokens: entry?.inputTokens,
          outputTokens: entry?.outputTokens,
          cacheRead: entry?.cacheRead,
          cacheWrite: entry?.cacheWrite,
          totalTokens: total ?? null,
          totalTokensFresh,
          remainingTokens: remaining,
          percentUsed: pct,
          model,
          configuredModel: configuredSessionModelLabel,
          selectedModel: selectedModelLabel,
          modelSelectionReason: modelSelectionDiffers
            ? hasUserPinnedModelSelection(entry)
              ? "session override"
              : "fallback selected"
            : null,
          runtime,
          contextTokens,
          flags: buildFlags(entry),
        };
      }),
    );
  const storeSources = agentList.agents.map((agent) => ({
    agentId: agent.id,
    storePath: resolveStorePath(cfg.session?.store, { agentId: agent.id }),
  }));
  const paths = /* @__PURE__ */ new Set();
  const pathCounts = /* @__PURE__ */ new Map();
  for (const source of storeSources) {
    paths.add(source.storePath);
    pathCounts.set(source.storePath, (pathCounts.get(source.storePath) ?? 0) + 1);
  }
  const byAgent = await Promise.all(
    agentList.agents.map(async (agent) => {
      const storePath = resolveStorePath(cfg.session?.store, { agentId: agent.id });
      const candidates = loadSessionCandidates(storePath, agent.id);
      const sessions = await buildSessionRows(
        selectRecentSessionCandidates(candidates, RECENT_SESSION_LIMIT),
        { agentIdOverride: agent.id },
      );
      return {
        agentId: agent.id,
        path: storePath,
        count: candidates.length,
        recent: sessions,
      };
    }),
  );
  const allSessions = storeSources
    .filter((source, index, sources) => {
      return sources.findIndex((candidate) => candidate.storePath === source.storePath) === index;
    })
    .flatMap((source) =>
      loadSessionCandidates(
        source.storePath,
        pathCounts.get(source.storePath) === 1 ? source.agentId : void 0,
      ),
    );
  const recent = await buildSessionRows(
    selectRecentSessionCandidates(allSessions, RECENT_SESSION_LIMIT),
  );
  const totalSessions = allSessions.length;
  const summary = {
    runtimeVersion: resolveRuntimeServiceVersion(process.env),
    linkChannel: linkContext
      ? {
          id: linkContext.plugin.id,
          label: linkContext.plugin.meta.label ?? "Channel",
          linked: linkContext.linked,
          authAgeMs: linkContext.authAgeMs,
        }
      : void 0,
    heartbeat: {
      defaultAgentId: agentList.defaultId,
      agents: heartbeatAgents,
    },
    channelSummary,
    queuedSystemEvents,
    tasks,
    taskAudit,
    ...(taskAuditRetainedLost.count > 0 ? { taskAuditRetainedLost } : {}),
    sessions: {
      paths: Array.from(paths),
      count: totalSessions,
      defaults: {
        model: configModel ?? null,
        contextTokens: configContextTokens ?? null,
      },
      recent,
      byAgent,
    },
  };
  return includeSensitive ? summary : redactSensitiveStatusSummary(summary);
}
//#endregion
export { redactSensitiveStatusSummary as n, getStatusSummary as t };
