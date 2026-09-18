import fs from "node:fs";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import { t as configuredModelRouteNeedsCodex } from "./codex-plugin-diagnostics-DxsLhCf5.js";
import { t as AGENT_MODEL_CONFIG_KEYS } from "./configured-model-refs-wBBEGQ5a.js";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-CdX9UGcX.js";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.js";
import { n as normalizeConfiguredProviderCatalogModelId } from "./model-ref-shared-Bs7ONe2Q.js";
import { t as resolveModelRuntimePolicy } from "./model-runtime-policy-CKdZrymL.js";
import { T as resolveConfiguredProviderFallback } from "./model-selection-shared-BliwFXJy.js";
import { z as normalizeOptionalAgentRuntimeId } from "./openai-routing-Cu28Ynzk.js";
import { r as normalizeProviderId } from "./provider-id-BIcU_2-A.js";
import { i as asOptionalRecord } from "./record-coerce-DHZ4bFlT.js";
import {
  Ot as isValidAgentHarnessSessionStoreEntry,
  a as updateSessionStore,
  u as loadSessionStore,
} from "./store-CzZJhTF6.js";
import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { i as resolveAllAgentSessionStoreTargetsSync } from "./targets-CjMfpXbt.js";
import { n as detectWindowsSpawnCommandInlineArgs } from "./windows-spawn-C5RDaB22.js";
//#region src/commands/doctor/shared/codex-route-warnings.ts
const COMPACTION_OVERRIDE_KEYS = ["model", "provider"];
const AGENT_MEDIA_MODEL_CONFIG_KEYS = ["imageGenerationModel", "videoGenerationModel"];
const LOSSLESS_CONTEXT_ENGINE_ID = "lossless-claw";
function normalizeRuntimeString(value) {
  return normalizeOptionalAgentRuntimeId(value);
}
function asAgentRuntimePolicyConfig(value) {
  const record = asOptionalRecord(value);
  return record ? { id: typeof record.id === "string" ? record.id : void 0 } : void 0;
}
function readLegacyDefaultsRuntime(defaults) {
  return asAgentRuntimePolicyConfig(asOptionalRecord(defaults)?.agentRuntime);
}
function isOpenAICodexModelRef(model) {
  return normalizeOptionalLowercaseString(model)?.startsWith("openai-codex/") === true;
}
function isOpenAICodexAuthProfileRef(profile) {
  return normalizeOptionalLowercaseString(profile)?.startsWith("openai-codex:") === true;
}
function isProviderlessModelRef(model) {
  const normalized = normalizeOptionalLowercaseString(model);
  return Boolean(normalized && !normalized.includes("/"));
}
function toCanonicalOpenAIModelRef(model) {
  if (!isOpenAICodexModelRef(model)) return;
  const modelId = model.slice(13).trim();
  return modelId ? `openai/${modelId}` : void 0;
}
function toOpenAIModelId(model) {
  if (!isOpenAICodexModelRef(model)) return;
  return model.slice(13).trim() || void 0;
}
function resolveRuntime(params) {
  return (
    normalizeRuntimeString(params.agentRuntime?.id) ??
    normalizeRuntimeString(params.defaultsRuntime?.id)
  );
}
function recordCodexModelHit(params) {
  const canonicalModel = toCanonicalOpenAIModelRef(params.model);
  if (!canonicalModel) return;
  params.hits.push({
    path: params.path,
    model: params.model,
    canonicalModel,
    ...(params.runtime ? { runtime: params.runtime } : {}),
  });
  return canonicalModel;
}
function collectStringModelSlot(params) {
  if (typeof params.value !== "string") return false;
  const model = params.value.trim();
  if (!model || !isOpenAICodexModelRef(model)) return false;
  return Boolean(
    recordCodexModelHit({
      hits: params.hits,
      path: params.path,
      model,
      runtime: params.runtime,
    }),
  );
}
function collectModelConfigSlot(params) {
  if (typeof params.value === "string")
    return collectStringModelSlot({
      hits: params.hits,
      path: params.path,
      value: params.value,
      runtime: params.runtime,
    });
  const record = asOptionalRecord(params.value);
  if (!record) return false;
  let rewrotePrimary = false;
  if (typeof record.primary === "string")
    rewrotePrimary = collectStringModelSlot({
      hits: params.hits,
      path: `${params.path}.primary`,
      value: record.primary,
      runtime: params.runtime,
    });
  if (Array.isArray(record.fallbacks))
    for (const [index, entry] of record.fallbacks.entries())
      collectStringModelSlot({
        hits: params.hits,
        path: `${params.path}.fallbacks.${index}`,
        value: entry,
      });
  return rewrotePrimary;
}
function readModelConfigPrimaryRef(value) {
  if (typeof value === "string") return value.trim() || void 0;
  const record = asOptionalRecord(value);
  if (typeof record?.primary === "string") return record.primary.trim() || void 0;
}
function readAgentPrimaryModelRef(agent, fallback) {
  const record = asOptionalRecord(agent);
  if (!record) return fallback;
  return readModelConfigPrimaryRef(record.model) ?? fallback;
}
function concreteRuntimeId(runtime) {
  return runtime && runtime !== "auto" && runtime !== "default" ? runtime : void 0;
}
function modelRefUsesCodexRuntime(params) {
  const effectiveModelRef = params.modelRef?.trim() || `openai/gpt-5.6-sol`;
  if (isOpenAICodexModelRef(effectiveModelRef)) return true;
  return canonicalOpenAIModelUsesCodexRuntime({
    cfg: params.cfg,
    modelRef: resolveRuntimeModelRef({
      cfg: params.cfg,
      modelRef: effectiveModelRef,
      agentId: params.agentId,
    }),
    agentId: params.agentId,
    env: params.env,
  });
}
function resolveRuntimeModelRef(params) {
  const effectiveModelRef =
    normalizeProviderModelRefAuthProfile(params.modelRef) ?? `openai/gpt-5.6-sol`;
  const legacyCodexModel = toCanonicalOpenAIModelRef(effectiveModelRef);
  if (legacyCodexModel) return legacyCodexModel;
  return (
    resolveKnownCompatModelAliasRef(effectiveModelRef) ??
    resolveConfiguredModelAliasRef({
      cfg: params.cfg,
      modelRef: effectiveModelRef,
      agentId: params.agentId,
    }) ??
    resolveConfiguredBareModelRef({
      cfg: params.cfg,
      modelRef: effectiveModelRef,
      agentId: params.agentId,
    }) ??
    normalizeDefaultProviderModelRef(
      effectiveModelRef,
      resolveDefaultProviderForAliasContext({
        cfg: params.cfg,
        agentId: params.agentId,
      }),
    )
  );
}
function normalizeProviderModelRefAuthProfile(modelRef) {
  const trimmed = modelRef.trim();
  if (!trimmed) return;
  return splitTrailingAuthProfile(trimmed).model || trimmed;
}
function resolveKnownCompatModelAliasRef(modelRef) {
  const normalized = normalizeOptionalLowercaseString(modelRef);
  if (!normalized?.startsWith("openrouter:")) return;
  const modelId = normalized.slice(11).trim();
  return modelId ? `openrouter/openrouter/${modelId}` : void 0;
}
function resolveConfiguredModelAliasRef(params) {
  const aliasKey = normalizeOptionalLowercaseString(params.modelRef);
  if (!aliasKey) return;
  const defaultProvider = resolveDefaultProviderForAliasContext({
    cfg: params.cfg,
    agentId: params.agentId,
  });
  return resolveAliasFromModelsMap(
    asOptionalRecord(params.cfg.agents?.defaults?.models),
    aliasKey,
    defaultProvider,
  );
}
function resolveDefaultProviderForAliasContext(params) {
  const primaryModelRef =
    readModelConfigPrimaryRef(findAgentById(params.cfg, params.agentId)?.model) ??
    readModelConfigPrimaryRef(params.cfg.agents?.defaults?.model);
  if (primaryModelRef) {
    const effectivePrimaryModelRef =
      normalizeProviderModelRefAuthProfile(primaryModelRef) ?? primaryModelRef;
    const legacyCodexModel = toCanonicalOpenAIModelRef(effectivePrimaryModelRef);
    const compatModelRef = resolveKnownCompatModelAliasRef(effectivePrimaryModelRef);
    return (
      normalizeProviderId(
        (
          parseModelRef(
            resolveAliasFromModelsMap(
              asOptionalRecord(params.cfg.agents?.defaults?.models),
              normalizeOptionalLowercaseString(effectivePrimaryModelRef) ?? "",
              "openai",
            ) ??
              compatModelRef ??
              legacyCodexModel ??
              effectivePrimaryModelRef,
          ) ??
          parseModelRef(
            resolveConfiguredBareModelRef({
              cfg: params.cfg,
              modelRef: effectivePrimaryModelRef,
              agentId: params.agentId,
            }) ?? "",
          )
        )?.provider ?? "openai",
      ) || "openai"
    );
  }
  return (
    normalizeProviderId(
      parseModelRef(resolveImplicitDefaultAgentModelRef(params.cfg))?.provider ?? "openai",
    ) || "openai"
  );
}
function findAgentById(cfg, agentId) {
  if (!agentId) return;
  const normalizedAgentId = normalizeAgentId(agentId);
  return (Array.isArray(cfg.agents?.list) ? cfg.agents.list : [])
    .map((agent) => asOptionalRecord(agent))
    .find(
      (agent) =>
        normalizeAgentId(typeof agent?.id === "string" ? agent.id : void 0) === normalizedAgentId,
    );
}
function resolveAliasFromModelsMap(models, aliasKey, defaultProvider) {
  for (const [modelRef, entry] of Object.entries(models ?? {})) {
    if (normalizeOptionalLowercaseString(asOptionalRecord(entry)?.alias) !== aliasKey) continue;
    const compatRef = resolveKnownCompatModelAliasRef(modelRef);
    if (compatRef) return compatRef;
    return modelRef.includes("/")
      ? normalizeDefaultProviderModelRef(modelRef)
      : `${defaultProvider}/${modelRef}`;
  }
}
function resolveConfiguredBareModelRef(params) {
  const modelId = params.modelRef.trim();
  if (!modelId || modelId.includes("/")) return;
  const matches = /* @__PURE__ */ new Set();
  const pushModelMapMatches = (models) => {
    for (const key of Object.keys(models ?? {})) {
      const parsed = parseModelRef(key);
      if (parsed?.modelId === modelId) matches.add(`${parsed.provider}/${parsed.modelId}`);
    }
  };
  pushModelMapMatches(asOptionalRecord(params.cfg.agents?.defaults?.models));
  for (const [provider, providerConfig] of Object.entries(params.cfg.models?.providers ?? {}))
    for (const model of providerConfig?.models ?? [])
      if (providerCatalogModelMatches(provider, model?.id, modelId))
        matches.add(`${normalizeProviderId(provider)}/${modelId}`);
  return matches.size === 1 ? [...matches][0] : void 0;
}
function providerCatalogModelMatches(provider, catalogModelId, modelId) {
  const rawId = catalogModelId?.trim();
  if (!rawId) return false;
  const normalizedId = normalizeConfiguredProviderCatalogModelId(provider, rawId);
  if (normalizedId === modelId) return true;
  return (
    normalizeOptionalLowercaseString(normalizedId) === normalizeOptionalLowercaseString(modelId)
  );
}
function normalizeDefaultProviderModelRef(modelRef, defaultProvider = DEFAULT_PROVIDER) {
  return modelRef.includes("/") ? modelRef : `${defaultProvider}/${modelRef}`;
}
function normalizeProviderModelRef(provider, modelId) {
  const normalizedProvider = normalizeProviderId(provider);
  const normalizedModelId = normalizeConfiguredProviderCatalogModelId(normalizedProvider, modelId);
  const slash = normalizedModelId.indexOf("/");
  if (
    slash > 0 &&
    normalizeProviderId(normalizedModelId.slice(0, slash)) === normalizedProvider &&
    slash < normalizedModelId.length - 1
  )
    return `${normalizedProvider}/${normalizedModelId.slice(slash + 1)}`;
  return `${normalizedProvider}/${normalizedModelId}`;
}
function resolveImplicitDefaultAgentModelRef(cfg) {
  const fallbackProvider = resolveConfiguredProviderFallback({
    cfg,
    defaultProvider: DEFAULT_PROVIDER,
  });
  return fallbackProvider
    ? normalizeProviderModelRef(fallbackProvider.provider, fallbackProvider.model)
    : `${DEFAULT_PROVIDER}/${DEFAULT_MODEL}`;
}
function agentUsesCodexRuntimeForCompaction(params) {
  const runtime = concreteRuntimeId(normalizeOptionalLowercaseString(params.currentRuntime));
  if (runtime) return runtime === "codex";
  return modelRefUsesCodexRuntime({
    cfg: params.cfg,
    modelRef: readAgentPrimaryModelRef(params.agent, params.inheritedModelRef),
    agentId: params.agentId,
    env: params.env,
  });
}
function collectUnsupportedCodexCompactionOverridesForAgent(params) {
  const agent = asOptionalRecord(params.agent);
  const compaction = asOptionalRecord(agent?.compaction);
  const inheritedCompaction = asOptionalRecord(params.inheritedCompaction);
  if (
    !agentUsesCodexRuntimeForCompaction({
      cfg: params.cfg,
      agent,
      agentId: params.agentId,
      currentRuntime: params.currentRuntime,
      inheritedModelRef: params.inheritedModelRef,
      env: params.env,
    })
  )
    return [];
  if (
    normalizeOptionalLowercaseString(compaction?.provider ?? inheritedCompaction?.provider) ===
    LOSSLESS_CONTEXT_ENGINE_ID
  )
    return [];
  return COMPACTION_OVERRIDE_KEYS.map((key) => {
    const localValue = compaction?.[key];
    const hasLocalValue = typeof localValue === "string" && localValue.trim();
    return {
      key,
      value: hasLocalValue ? localValue : inheritedCompaction?.[key],
      path: hasLocalValue
        ? `${params.path}.compaction.${key}`
        : params.inheritedCompactionPath
          ? `${params.inheritedCompactionPath}.${key}`
          : `${params.path}.compaction.${key}`,
    };
  }).flatMap(({ key, path, value }) =>
    typeof value === "string" && value.trim()
      ? [
          {
            path,
            key,
            value: value.trim(),
          },
        ]
      : [],
  );
}
function collectLegacyLosslessCompactionForAgent(params) {
  const agent = asOptionalRecord(params.agent);
  const compaction = asOptionalRecord(agent?.compaction);
  const inheritedCompaction = asOptionalRecord(params.inheritedCompaction);
  if (
    !agentUsesCodexRuntimeForCompaction({
      cfg: params.cfg,
      agent,
      agentId: params.agentId,
      currentRuntime: params.currentRuntime,
      inheritedModelRef: params.inheritedModelRef,
      env: params.env,
    })
  )
    return [];
  const localProvider = compaction?.provider;
  const hasLocalProvider = typeof localProvider === "string" && localProvider.trim();
  const providerValue = hasLocalProvider ? localProvider : inheritedCompaction?.provider;
  if (normalizeOptionalLowercaseString(providerValue) !== LOSSLESS_CONTEXT_ENGINE_ID) return [];
  const compactionPath = hasLocalProvider
    ? `${params.path}.compaction`
    : (params.inheritedCompactionPath ?? `${params.path}.compaction`);
  const localModel = compaction?.model;
  const hasLocalModel = typeof localModel === "string" && localModel.trim();
  const inheritedModel = inheritedCompaction?.model;
  const modelValue = hasLocalModel ? localModel : inheritedModel;
  const modelCompactionPath = hasLocalModel
    ? `${params.path}.compaction`
    : (params.inheritedCompactionPath ?? compactionPath);
  return [
    {
      path: params.path,
      compactionPath,
      providerPath: `${compactionPath}.provider`,
      providerValue: String(providerValue).trim(),
      ...(typeof modelValue === "string" && modelValue.trim()
        ? {
            modelPath: `${modelCompactionPath}.model`,
            modelValue: modelValue.trim(),
          }
        : {}),
    },
  ];
}
function dedupeLegacyLosslessCompactionConfigs(hits) {
  const seen = /* @__PURE__ */ new Set();
  return hits.filter((hit) => {
    const key = `${hit.compactionPath}\0${hit.providerValue}\0${hit.modelPath ?? ""}\0${hit.modelValue ?? ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
function collectLegacyLosslessCompactionConfigs(params) {
  const defaults = params.cfg.agents?.defaults;
  const defaultsRuntime = params.ignoreLegacyAgentRuntimePins
    ? void 0
    : readLegacyDefaultsRuntime(defaults);
  const defaultModelRef = readAgentPrimaryModelRef(defaults);
  const defaultCompaction = asOptionalRecord(defaults?.compaction);
  const hits = collectLegacyLosslessCompactionForAgent({
    cfg: params.cfg,
    agent: defaults,
    path: "agents.defaults",
    currentRuntime: resolveRuntime({ defaultsRuntime }),
    env: params.env,
  });
  const agents = Array.isArray(params.cfg.agents?.list) ? params.cfg.agents.list : [];
  for (const [index, agent] of agents.entries()) {
    const agentRecord = asOptionalRecord(agent);
    if (!agentRecord) continue;
    const id =
      typeof agentRecord.id === "string" && agentRecord.id.trim()
        ? agentRecord.id.trim()
        : String(index);
    hits.push(
      ...collectLegacyLosslessCompactionForAgent({
        cfg: params.cfg,
        agent: agentRecord,
        path: `agents.list.${id}`,
        agentId: id,
        currentRuntime: resolveRuntime({
          agentRuntime: params.ignoreLegacyAgentRuntimePins
            ? void 0
            : asAgentRuntimePolicyConfig(agentRecord.agentRuntime),
          defaultsRuntime,
        }),
        inheritedModelRef: defaultModelRef,
        inheritedCompaction: defaultCompaction,
        inheritedCompactionPath: "agents.defaults.compaction",
        env: params.env,
      }),
    );
  }
  return dedupeLegacyLosslessCompactionConfigs(hits);
}
function dedupeUnsupportedCompactionOverrides(hits) {
  const seen = /* @__PURE__ */ new Set();
  return hits.filter((hit) => {
    const key = `${hit.path}\0${hit.key}\0${hit.value}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
function collectUnsupportedCodexCompactionOverrides(params) {
  const defaults = params.cfg.agents?.defaults;
  const defaultsRuntime = params.ignoreLegacyAgentRuntimePins
    ? void 0
    : readLegacyDefaultsRuntime(defaults);
  const defaultModelRef = readAgentPrimaryModelRef(defaults);
  const defaultCompaction = asOptionalRecord(defaults?.compaction);
  const hits = collectUnsupportedCodexCompactionOverridesForAgent({
    cfg: params.cfg,
    agent: defaults,
    path: "agents.defaults",
    currentRuntime: resolveRuntime({ defaultsRuntime }),
    env: params.env,
  });
  const agents = Array.isArray(params.cfg.agents?.list) ? params.cfg.agents.list : [];
  for (const [index, agent] of agents.entries()) {
    const agentRecord = asOptionalRecord(agent);
    if (!agentRecord) continue;
    const id =
      typeof agentRecord.id === "string" && agentRecord.id.trim()
        ? agentRecord.id.trim()
        : String(index);
    hits.push(
      ...collectUnsupportedCodexCompactionOverridesForAgent({
        cfg: params.cfg,
        agent: agentRecord,
        path: `agents.list.${id}`,
        agentId: id,
        currentRuntime: resolveRuntime({
          agentRuntime: params.ignoreLegacyAgentRuntimePins
            ? void 0
            : asAgentRuntimePolicyConfig(agentRecord.agentRuntime),
          defaultsRuntime,
        }),
        inheritedModelRef: defaultModelRef,
        inheritedCompaction: defaultCompaction,
        inheritedCompactionPath: "agents.defaults.compaction",
        env: params.env,
      }),
    );
  }
  return dedupeUnsupportedCompactionOverrides(hits);
}
function getSharedDefaultCompactionOverrideConsumers(params) {
  const consumers = {
    model: false,
    provider: false,
  };
  const defaults = params.cfg.agents?.defaults;
  const defaultCompaction = asOptionalRecord(defaults?.compaction);
  if (!defaultCompaction) return consumers;
  const hasDefaultModel =
    typeof defaultCompaction.model === "string" && defaultCompaction.model.trim();
  const hasDefaultProvider =
    typeof defaultCompaction.provider === "string" && defaultCompaction.provider.trim();
  if (!hasDefaultModel && !hasDefaultProvider) return consumers;
  const defaultsRuntime = readLegacyDefaultsRuntime(defaults);
  const inheritedModelRef = readAgentPrimaryModelRef(defaults);
  if (
    !agentUsesCodexRuntimeForCompaction({
      cfg: params.cfg,
      agent: defaults,
      currentRuntime: resolveRuntime({
        defaultsRuntime: params.ignoreLegacyAgentRuntimePins ? void 0 : defaultsRuntime,
      }),
      env: params.env,
    })
  ) {
    consumers.model ||= Boolean(hasDefaultModel);
    consumers.provider ||= Boolean(hasDefaultProvider);
    if ((!hasDefaultModel || consumers.model) && (!hasDefaultProvider || consumers.provider))
      return consumers;
  }
  const agents = Array.isArray(params.cfg.agents?.list) ? params.cfg.agents.list : [];
  if (agents.length === 0) return consumers;
  for (const [index, agent] of agents.entries()) {
    const agentRecord = asOptionalRecord(agent);
    if (!agentRecord) continue;
    const compaction = asOptionalRecord(agentRecord.compaction);
    const inheritsDefaultModel =
      Boolean(hasDefaultModel) &&
      !(typeof compaction?.model === "string" && compaction.model.trim());
    const inheritsDefaultProvider =
      Boolean(hasDefaultProvider) &&
      !(typeof compaction?.provider === "string" && compaction.provider.trim());
    if (!inheritsDefaultModel && !inheritsDefaultProvider) continue;
    const id =
      typeof agentRecord.id === "string" && agentRecord.id.trim()
        ? agentRecord.id.trim()
        : String(index);
    if (
      !agentUsesCodexRuntimeForCompaction({
        cfg: params.cfg,
        agent: agentRecord,
        agentId: id,
        currentRuntime: resolveRuntime({
          agentRuntime: params.ignoreLegacyAgentRuntimePins
            ? void 0
            : asAgentRuntimePolicyConfig(agentRecord.agentRuntime),
          defaultsRuntime: params.ignoreLegacyAgentRuntimePins ? void 0 : defaultsRuntime,
        }),
        inheritedModelRef,
        env: params.env,
      })
    ) {
      consumers.model ||= inheritsDefaultModel;
      consumers.provider ||= inheritsDefaultProvider;
      if ((!hasDefaultModel || consumers.model) && (!hasDefaultProvider || consumers.provider))
        break;
    }
  }
  return consumers;
}
function sharedDefaultLosslessCompactionHasNonCodexConsumer(params) {
  const defaults = params.cfg.agents?.defaults;
  const defaultCompaction = asOptionalRecord(defaults?.compaction);
  const hasDefaultLosslessProvider =
    normalizeOptionalLowercaseString(defaultCompaction?.provider) === LOSSLESS_CONTEXT_ENGINE_ID;
  const hasDefaultModel =
    typeof defaultCompaction?.model === "string" && defaultCompaction.model.trim();
  if (!hasDefaultLosslessProvider && !hasDefaultModel) return false;
  const defaultsRuntime = params.ignoreLegacyAgentRuntimePins
    ? void 0
    : readLegacyDefaultsRuntime(defaults);
  if (
    !agentUsesCodexRuntimeForCompaction({
      cfg: params.cfg,
      agent: defaults,
      currentRuntime: resolveRuntime({ defaultsRuntime }),
      env: params.env,
    })
  )
    return true;
  const inheritedModelRef = readAgentPrimaryModelRef(defaults);
  const agents = Array.isArray(params.cfg.agents?.list) ? params.cfg.agents.list : [];
  for (const [index, agent] of agents.entries()) {
    const agentRecord = asOptionalRecord(agent);
    if (!agentRecord) continue;
    const compaction = asOptionalRecord(agentRecord.compaction);
    const inheritsDefaultProvider =
      hasDefaultLosslessProvider &&
      !(typeof compaction?.provider === "string" && compaction.provider.trim());
    const inheritsDefaultModel =
      Boolean(hasDefaultModel) &&
      !(typeof compaction?.model === "string" && compaction.model.trim());
    if (!inheritsDefaultProvider && !inheritsDefaultModel) continue;
    const id =
      typeof agentRecord.id === "string" && agentRecord.id.trim()
        ? agentRecord.id.trim()
        : String(index);
    if (
      !agentUsesCodexRuntimeForCompaction({
        cfg: params.cfg,
        agent: agentRecord,
        agentId: id,
        env: params.env,
        currentRuntime: resolveRuntime({
          agentRuntime: params.ignoreLegacyAgentRuntimePins
            ? void 0
            : asAgentRuntimePolicyConfig(agentRecord.agentRuntime),
          defaultsRuntime,
        }),
        inheritedModelRef,
      })
    )
      return true;
  }
  return false;
}
function collectModelsMapRefs(params) {
  const record = asOptionalRecord(params.models);
  if (!record) return;
  for (const modelRef of Object.keys(record)) {
    if (!isOpenAICodexModelRef(modelRef)) continue;
    recordCodexModelHit({
      hits: params.hits,
      path: `${params.path}.${modelRef}`,
      model: modelRef,
    });
  }
}
function collectAgentModelRefs(params) {
  const agent = asOptionalRecord(params.agent);
  if (!agent) return;
  for (const key of AGENT_MODEL_CONFIG_KEYS)
    collectModelConfigSlot({
      hits: params.hits,
      path: `${params.path}.${key}`,
      value: agent[key],
      runtime: key === "model" ? params.runtime : void 0,
    });
  for (const key of AGENT_MEDIA_MODEL_CONFIG_KEYS)
    collectModelConfigSlot({
      hits: params.hits,
      path: `${params.path}.${key}`,
      value: agent[key],
    });
  collectStringModelSlot({
    hits: params.hits,
    path: `${params.path}.heartbeat.model`,
    value: asOptionalRecord(agent.heartbeat)?.model,
  });
  collectModelConfigSlot({
    hits: params.hits,
    path: `${params.path}.subagents.model`,
    value: asOptionalRecord(agent.subagents)?.model,
  });
  const compaction = asOptionalRecord(agent.compaction);
  collectStringModelSlot({
    hits: params.hits,
    path: `${params.path}.compaction.model`,
    value: compaction?.model,
  });
  collectStringModelSlot({
    hits: params.hits,
    path: `${params.path}.compaction.memoryFlush.model`,
    value: asOptionalRecord(compaction?.memoryFlush)?.model,
  });
  if (params.collectModelsMap)
    collectModelsMapRefs({
      hits: params.hits,
      path: `${params.path}.models`,
      models: agent.models,
    });
}
function collectConfigModelRefs(cfg) {
  const hits = [];
  const defaults = cfg.agents?.defaults;
  const defaultsRuntime = readLegacyDefaultsRuntime(defaults);
  collectAgentModelRefs({
    hits,
    agent: defaults,
    path: "agents.defaults",
    runtime: resolveRuntime({ defaultsRuntime }),
    collectModelsMap: true,
  });
  const agents = Array.isArray(cfg.agents?.list) ? cfg.agents.list : [];
  for (const [index, agent] of agents.entries()) {
    const agentRecord = asOptionalRecord(agent);
    if (!agentRecord) continue;
    collectAgentModelRefs({
      hits,
      agent: agentRecord,
      path: `agents.list.${typeof agentRecord.id === "string" && agentRecord.id.trim() ? agentRecord.id.trim() : String(index)}`,
      runtime: resolveRuntime({
        agentRuntime: asAgentRuntimePolicyConfig(agentRecord.agentRuntime),
        defaultsRuntime,
      }),
    });
  }
  const channelsModelByChannel = asOptionalRecord(cfg.channels?.modelByChannel);
  if (channelsModelByChannel)
    for (const [channelId, channelMap] of Object.entries(channelsModelByChannel)) {
      const targets = asOptionalRecord(channelMap);
      if (!targets) continue;
      for (const [targetId, model] of Object.entries(targets))
        collectStringModelSlot({
          hits,
          path: `channels.modelByChannel.${channelId}.${targetId}`,
          value: model,
        });
    }
  for (const [index, mapping] of (cfg.hooks?.mappings ?? []).entries())
    collectStringModelSlot({
      hits,
      path: `hooks.mappings.${index}.model`,
      value: mapping.model,
    });
  collectStringModelSlot({
    hits,
    path: "hooks.gmail.model",
    value: cfg.hooks?.gmail?.model,
  });
  collectStringModelSlot({
    hits,
    path: "messages.tts.summaryModel",
    value: cfg.messages?.tts?.summaryModel,
  });
  collectStringModelSlot({
    hits,
    path: "channels.discord.voice.model",
    value: asOptionalRecord(asOptionalRecord(cfg.channels?.discord)?.voice)?.model,
  });
  return hits;
}
function pluginIdListIncludes(value, pluginId) {
  return (
    Array.isArray(value) &&
    value.some((entry) => normalizeOptionalLowercaseString(entry) === pluginId)
  );
}
function codexPluginAllowlistIsRestrictive(cfg) {
  const allow = cfg.plugins?.allow;
  return Array.isArray(allow) && allow.length > 0 && !pluginIdListIncludes(allow, "codex");
}
function isCodexPluginUnavailableByConfig(cfg) {
  if (codexPluginIsBlockedOutsideEntry(cfg)) return true;
  if (asOptionalRecord(asOptionalRecord(cfg.plugins?.entries)?.codex)?.enabled === false)
    return true;
  return codexPluginAllowlistIsRestrictive(cfg);
}
function codexPluginIsBlockedOutsideEntry(cfg) {
  if (cfg.plugins?.enabled === false) return true;
  return pluginIdListIncludes(cfg.plugins?.deny, "codex");
}
function collectAgentRuntimeModelRefs(params) {
  const refs = [];
  const agent = asOptionalRecord(params.agent);
  if (agent && Object.hasOwn(agent, "model"))
    collectModelConfigRefs({
      refs,
      path: `${params.path}.model`,
      value: agent.model,
    });
  if (!hasAgentPrimaryModelConfig(agent) && params.fallbackModelRefs)
    refs.push(...params.fallbackModelRefs);
  collectStringModelConfigRef({
    refs,
    path: `${params.path}.heartbeat.model`,
    value: asOptionalRecord(agent?.heartbeat)?.model,
  });
  collectModelConfigRefs({
    refs,
    path: `${params.path}.subagents.model`,
    value: asOptionalRecord(agent?.subagents)?.model,
  });
  if (params.inheritedModelRefs) refs.push(...params.inheritedModelRefs);
  collectCodexRuntimeModelPolicyRefs({
    refs,
    path: `${params.path}.models`,
    models: agent?.models,
  });
  return refs;
}
function hasAgentPrimaryModelConfig(agent) {
  const record = asOptionalRecord(agent);
  return Boolean(record && readModelConfigPrimaryRef(record.model));
}
function collectChannelAgentRuntimeModelRefs(cfg) {
  const refs = [];
  const channelsModelByChannel = asOptionalRecord(cfg.channels?.modelByChannel);
  for (const [channelId, channelMapValue] of Object.entries(channelsModelByChannel ?? {})) {
    const channelMap = asOptionalRecord(channelMapValue);
    if (!channelMap) continue;
    for (const [targetId, modelRef] of Object.entries(channelMap))
      collectStringModelConfigRef({
        refs,
        path: `channels.modelByChannel.${channelId}.${targetId}`,
        value: modelRef,
      });
  }
  return refs;
}
function collectDisabledCodexPluginRouteHits(cfg, env) {
  if (!isCodexPluginUnavailableByConfig(cfg)) return [];
  const defaults = cfg.agents?.defaults;
  const defaultRefs = collectAgentRuntimeModelRefs({
    agent: defaults,
    path: "agents.defaults",
  });
  if (
    cfg.agents &&
    !hasAgentPrimaryModelConfig(defaults) &&
    !defaultRefs.some(
      (ref) =>
        resolveRuntimeModelRef({
          cfg,
          modelRef: ref.modelRef,
        }) === resolveImplicitDefaultAgentModelRef(cfg),
    )
  )
    defaultRefs.push({
      path: "agents.defaults.model",
      modelRef: resolveImplicitDefaultAgentModelRef(cfg),
    });
  const agents = Array.isArray(cfg.agents?.list) ? cfg.agents.list : [];
  const inheritedDefaultAuxRefs = defaultRefs.filter(
    (ref) =>
      ref.path === "agents.defaults.heartbeat.model" ||
      ref.path.startsWith("agents.defaults.subagents.model"),
  );
  const inheritedDefaultModelPolicyRefs = defaultRefs.filter((ref) =>
    ref.path.startsWith("agents.defaults.models."),
  );
  const inheritedDefaultModelRefs = defaultRefs.filter(
    (ref) =>
      !inheritedDefaultAuxRefs.includes(ref) && !inheritedDefaultModelPolicyRefs.includes(ref),
  );
  const channelRefs = collectChannelAgentRuntimeModelRefs(cfg);
  const candidateRefs = agents.length === 0 ? [...defaultRefs, ...channelRefs] : [];
  for (const [index, agent] of agents.entries()) {
    const agentRecord = asOptionalRecord(agent);
    if (!agentRecord) continue;
    const pathId =
      typeof agentRecord.id === "string" && agentRecord.id.trim()
        ? agentRecord.id.trim()
        : String(index);
    const agentId = normalizeAgentId(typeof agentRecord.id === "string" ? agentRecord.id : void 0);
    for (const ref of channelRefs)
      candidateRefs.push({
        path: ref.path,
        modelRef: ref.modelRef,
        agentId,
      });
    const inheritedModelRefs = inheritedDefaultAuxRefs.filter((ref) => {
      if (ref.path === "agents.defaults.heartbeat.model")
        return !normalizeOptionalLowercaseString(asOptionalRecord(agentRecord.heartbeat)?.model);
      if (ref.path.startsWith("agents.defaults.subagents.model"))
        return !readModelConfigPrimaryRef(asOptionalRecord(agentRecord.subagents)?.model);
      return true;
    });
    inheritedModelRefs.push(...inheritedDefaultModelPolicyRefs);
    for (const ref of collectAgentRuntimeModelRefs({
      agent: agentRecord,
      path: `agents.list.${pathId}`,
      fallbackModelRefs: inheritedDefaultModelRefs,
      inheritedModelRefs,
    }))
      candidateRefs.push({
        ...ref,
        agentId,
      });
  }
  const hits = [];
  const seen = /* @__PURE__ */ new Set();
  for (const ref of candidateRefs) {
    const canonicalModel = resolveRuntimeModelRef({
      cfg,
      modelRef: ref.modelRef,
      agentId: ref.agentId,
    });
    if (
      !modelRefUsesCodexRuntime({
        cfg,
        modelRef: ref.modelRef,
        agentId: ref.agentId,
        env,
      })
    )
      continue;
    const key = `${ref.agentId ?? ""}\0${ref.path}\0${canonicalModel}`;
    if (seen.has(key)) continue;
    seen.add(key);
    hits.push({
      path: ref.path,
      modelRef: ref.modelRef,
      canonicalModel,
    });
  }
  return hits;
}
/** Find Codex-routed model refs that require the Codex plugin while it is disabled. */
function collectDisabledCodexPluginRouteIssues(cfg, env) {
  const blockedOutsideEntry = codexPluginIsBlockedOutsideEntry(cfg);
  return collectDisabledCodexPluginRouteHits(cfg, env).map((hit) => ({
    path: hit.path,
    modelRef: hit.modelRef,
    canonicalModel: hit.canonicalModel,
    blockedOutsideEntry,
  }));
}
function enableCodexPluginForRequiredRoutes(params) {
  if (params.routeHits.length === 0 || codexPluginIsBlockedOutsideEntry(params.cfg))
    return {
      cfg: params.cfg,
      changes: [],
    };
  const cfg = structuredClone(params.cfg);
  const plugins = asOptionalRecord(cfg.plugins) ?? {};
  if (cfg.plugins !== plugins) cfg.plugins = plugins;
  const entries = asOptionalRecord(plugins.entries) ?? {};
  if (plugins.entries !== entries) plugins.entries = entries;
  const codexEntry = asOptionalRecord(entries.codex) ?? {};
  const changes = [];
  if (codexEntry.enabled !== true) {
    entries.codex = {
      ...codexEntry,
      enabled: true,
    };
    changes.push(
      "Enabled plugins.entries.codex because configured agent routes use Codex runtime.",
    );
  } else if (entries.codex !== codexEntry) entries.codex = codexEntry;
  if (
    Array.isArray(plugins.allow) &&
    plugins.allow.length > 0 &&
    !plugins.allow.some((id) => normalizeOptionalLowercaseString(id) === "codex")
  ) {
    plugins.allow = [...plugins.allow, "codex"];
    changes.push("Added codex to plugins.allow because configured agent routes use Codex runtime.");
  }
  return {
    cfg,
    changes,
  };
}
function rewriteStringModelSlot(params) {
  if (!params.container) return false;
  const value = params.container[params.key];
  const model = typeof value === "string" ? value.trim() : "";
  if (!model || !isOpenAICodexModelRef(model)) return false;
  const canonicalModel = recordCodexModelHit({
    hits: params.hits,
    path: params.path,
    model,
    runtime: params.runtime,
  });
  if (!canonicalModel) return false;
  params.container[params.key] = canonicalModel;
  return true;
}
function rewriteModelConfigSlot(params) {
  if (!params.container) return false;
  const value = params.container[params.key];
  if (typeof value === "string")
    return rewriteStringModelSlot({
      hits: params.hits,
      container: params.container,
      key: params.key,
      path: params.path,
      runtime: params.runtime,
    });
  const record = asOptionalRecord(value);
  if (!record) return false;
  const rewrotePrimary = rewriteStringModelSlot({
    hits: params.hits,
    container: record,
    key: "primary",
    path: `${params.path}.primary`,
    runtime: params.runtime,
  });
  if (Array.isArray(record.fallbacks))
    record.fallbacks = record.fallbacks.map((entry, index) => {
      if (typeof entry !== "string") return entry;
      const model = entry.trim();
      return (
        recordCodexModelHit({
          hits: params.hits,
          path: `${params.path}.fallbacks.${index}`,
          model,
        }) ?? entry
      );
    });
  return rewrotePrimary;
}
function rewriteModelsMap(params) {
  if (!params.models) return;
  for (const legacyRef of Object.keys(params.models)) {
    const canonicalModel = toCanonicalOpenAIModelRef(legacyRef);
    if (!canonicalModel) continue;
    recordCodexModelHit({
      hits: params.hits,
      path: `${params.path}.${legacyRef}`,
      model: legacyRef,
    });
    const legacyEntry = params.models[legacyRef] ?? {};
    const canonicalEntry = params.models[canonicalModel];
    const legacyRecord = asOptionalRecord(legacyEntry);
    const canonicalRecord = asOptionalRecord(canonicalEntry);
    params.models[canonicalModel] =
      legacyRecord && canonicalRecord
        ? mergeCanonicalModelMapRecord({
            legacyRecord,
            canonicalRecord,
          })
        : (canonicalEntry ?? legacyEntry);
    delete params.models[legacyRef];
  }
}
function runtimePolicyHasExplicitNonDefaultPin(value) {
  const id = normalizeOptionalLowercaseString(asOptionalRecord(value)?.id);
  return Boolean(id && id !== "auto" && id !== "default");
}
function mergeCanonicalModelMapRecord(params) {
  const merged = {
    ...params.legacyRecord,
    ...params.canonicalRecord,
  };
  const legacyRuntime = asOptionalRecord(params.legacyRecord.agentRuntime);
  const canonicalRuntime = asOptionalRecord(params.canonicalRecord.agentRuntime);
  if (
    legacyRuntime &&
    runtimePolicyHasExplicitNonDefaultPin(legacyRuntime) &&
    !runtimePolicyHasExplicitNonDefaultPin(canonicalRuntime)
  )
    merged.agentRuntime = {
      ...legacyRuntime,
      ...canonicalRuntime,
      id: legacyRuntime.id,
    };
  return merged;
}
function modelConfigContainsRef(value, modelRef) {
  if (typeof value === "string") return value.trim() === modelRef;
  const record = asOptionalRecord(value);
  if (!record) return false;
  if (typeof record.primary === "string" && record.primary.trim() === modelRef) return true;
  return (
    Array.isArray(record.fallbacks) &&
    record.fallbacks.some((entry) => typeof entry === "string" && entry.trim() === modelRef)
  );
}
function collectModelConfigRefs(params) {
  if (typeof params.value === "string") {
    collectStringModelConfigRef(params);
    return;
  }
  const record = asOptionalRecord(params.value);
  if (!record) return;
  if (typeof record.primary === "string" && record.primary.trim())
    params.refs.push({
      path: `${params.path}.primary`,
      modelRef: record.primary.trim(),
    });
  if (Array.isArray(record.fallbacks)) {
    for (const [index, entry] of record.fallbacks.entries())
      if (typeof entry === "string" && entry.trim())
        params.refs.push({
          path: `${params.path}.fallbacks.${index}`,
          modelRef: entry.trim(),
        });
  }
}
function collectStringModelConfigRef(params) {
  if (typeof params.value !== "string") return;
  const modelRef = params.value.trim();
  if (modelRef)
    params.refs.push({
      path: params.path,
      modelRef,
    });
}
function collectCodexRuntimeModelPolicyRefs(params) {
  const record = asOptionalRecord(params.models);
  if (!record) return;
  for (const [modelRef, entry] of Object.entries(record)) {
    const trimmed = modelRef.trim();
    if (!trimmed) continue;
    if (
      normalizeRuntimeString(asOptionalRecord(asOptionalRecord(entry)?.agentRuntime)?.id) ===
      "codex"
    )
      params.refs.push({
        path: `${params.path}.${trimmed}`,
        modelRef: trimmed,
      });
  }
}
function agentExplicitlyReferencesCanonicalModel(agent, modelRef) {
  const record = asOptionalRecord(agent);
  if (!record) return false;
  for (const key of AGENT_MODEL_CONFIG_KEYS)
    if (modelConfigContainsRef(record[key], modelRef)) return true;
  if (modelConfigContainsRef(asOptionalRecord(record.heartbeat)?.model, modelRef)) return true;
  if (modelConfigContainsRef(asOptionalRecord(record.subagents)?.model, modelRef)) return true;
  const compaction = asOptionalRecord(record.compaction);
  return (
    modelConfigContainsRef(compaction?.model, modelRef) ||
    modelConfigContainsRef(asOptionalRecord(compaction?.memoryFlush)?.model, modelRef) ||
    asOptionalRecord(record.models)?.[modelRef] !== void 0
  );
}
function parseModelRef(modelRef) {
  const slash = modelRef.indexOf("/");
  if (slash <= 0 || slash >= modelRef.length - 1) return;
  return {
    provider: modelRef.slice(0, slash),
    modelId: modelRef.slice(slash + 1),
  };
}
function resolveCurrentRuntimeIdForCanonicalModel(params) {
  const parsed = parseModelRef(params.modelRef);
  if (!parsed) return "auto";
  const configured = normalizeRuntimeString(
    resolveModelRuntimePolicy({
      config: params.cfg,
      provider: parsed.provider,
      modelId: parsed.modelId,
      agentId: params.agentId,
    }).policy?.id,
  );
  if (configured) return configured;
  return configuredModelRouteNeedsCodex({
    cfg: params.cfg,
    env: params.env ?? process.env,
    agentId: params.agentId,
    route: {
      provider: parsed.provider,
      modelId: parsed.modelId,
    },
  })
    ? "codex"
    : "auto";
}
function setModelRuntimePolicy(params) {
  const models = asOptionalRecord(params.agent.models) ?? {};
  if (params.agent.models !== models) params.agent.models = models;
  const entry = asOptionalRecord(models[params.modelRef]) ?? {};
  if (models[params.modelRef] !== entry) models[params.modelRef] = entry;
  const priorRuntime = asOptionalRecord(entry.agentRuntime);
  if (normalizeOptionalLowercaseString(priorRuntime?.id) === params.runtimeId) return;
  entry.agentRuntime = {
    ...priorRuntime,
    id: params.runtimeId,
  };
  params.changes.push(
    `Set ${params.agentPath}.models.${params.modelRef}.agentRuntime.id to "${params.runtimeId}" ${params.reason}.`,
  );
}
function shieldExplicitListedAgentRefsFromDefaultPolicy(params) {
  for (const [index, agent] of (params.cfg.agents?.list ?? []).entries()) {
    if (!agentExplicitlyReferencesCanonicalModel(agent, params.modelRef)) continue;
    const id = typeof agent.id === "string" && agent.id.trim() ? agent.id.trim() : String(index);
    const runtimeId = resolveCurrentRuntimeIdForCanonicalModel({
      cfg: params.cfg,
      modelRef: params.modelRef,
      agentId: id,
      env: params.env,
    });
    if (runtimeId === params.targetRuntimeId) continue;
    setModelRuntimePolicy({
      agent,
      agentPath: `agents.list.${id}`,
      modelRef: params.modelRef,
      runtimeId,
      changes: params.changes,
      reason: "so default runtime repair does not change explicit agent routing",
    });
  }
}
function rewriteAgentModelRefs(params) {
  if (!params.agent) return;
  const agent = params.agent;
  const preserveCodexRuntimePolicyForNewHits = (fromIndex) => {
    for (const hit of params.hits.slice(fromIndex))
      ensureCodexRuntimePolicy({
        cfg: params.cfg,
        agent,
        agentPath: params.path,
        agentId: params.agentId,
        modelRef: hit.canonicalModel,
        legacyModelRef: hit.model,
        isDefaults: params.path === "agents.defaults",
        preRepairCfg: params.preRepairCfg,
        changes: params.runtimePolicyChanges,
        env: params.env,
      });
  };
  for (const key of AGENT_MODEL_CONFIG_KEYS) {
    const start = params.hits.length;
    if (key === "model") {
      rewriteModelConfigSlot({
        hits: params.hits,
        container: agent,
        key,
        path: `${params.path}.${key}`,
        runtime: params.currentRuntime,
      });
      preserveCodexRuntimePolicyForNewHits(start);
    } else
      rewriteModelConfigSlotIfCanonicalCodexRuntime({
        cfg: params.cfg,
        agentId: params.agentId,
        hits: params.hits,
        container: agent,
        key,
        path: `${params.path}.${key}`,
        env: params.env,
      });
  }
  rewriteStringModelSlotIfCanonicalCodexRuntime({
    cfg: params.cfg,
    agentId: params.agentId,
    hits: params.hits,
    container: asOptionalRecord(agent.heartbeat),
    key: "model",
    path: `${params.path}.heartbeat.model`,
    env: params.env,
  });
  rewriteModelConfigSlotIfCanonicalCodexRuntime({
    cfg: params.cfg,
    agentId: params.agentId,
    hits: params.hits,
    container: asOptionalRecord(agent.subagents),
    key: "model",
    path: `${params.path}.subagents.model`,
    env: params.env,
  });
  const compaction = asOptionalRecord(agent.compaction);
  const inheritedCompaction = asOptionalRecord(params.inheritedCompaction);
  if (
    agentUsesCodexRuntimeForCompaction({
      cfg: params.cfg,
      agent,
      agentId: params.agentId,
      currentRuntime: params.currentRuntime,
      inheritedModelRef: params.inheritedModelRef,
      env: params.env,
    })
  )
    if (
      normalizeOptionalLowercaseString(compaction?.provider ?? inheritedCompaction?.provider) ===
      LOSSLESS_CONTEXT_ENGINE_ID
    ) {
      const start = params.hits.length;
      rewriteStringModelSlot({
        hits: params.hits,
        container: compaction,
        key: "model",
        path: `${params.path}.compaction.model`,
      });
      preserveCodexRuntimePolicyForNewHits(start);
      const localModel = typeof compaction?.model === "string" ? compaction.model.trim() : "";
      const inheritedModelPath = params.inheritedCompactionPath
        ? `${params.inheritedCompactionPath}.model`
        : void 0;
      if (
        !localModel &&
        inheritedModelPath &&
        params.preserveUnsupportedCompactionPaths?.has(inheritedModelPath)
      ) {
        const inheritedStart = params.hits.length;
        rewriteStringModelSlot({
          hits: params.hits,
          container: inheritedCompaction,
          key: "model",
          path: inheritedModelPath,
        });
        const inheritedHit = params.hits[inheritedStart];
        const inheritedCanonicalModel =
          inheritedHit?.canonicalModel ??
          params.rewrittenInheritedCompactionModels?.get(inheritedModelPath);
        if (inheritedHit) {
          params.rewrittenInheritedCompactionModels?.set(
            inheritedModelPath,
            inheritedHit.canonicalModel,
          );
          preserveCodexRuntimePolicyForNewHits(inheritedStart);
        } else if (inheritedCanonicalModel)
          ensureCodexRuntimePolicy({
            cfg: params.cfg,
            agent,
            agentPath: params.path,
            agentId: params.agentId,
            modelRef: inheritedCanonicalModel,
            isDefaults: params.path === "agents.defaults",
            preRepairCfg: params.preRepairCfg,
            changes: params.runtimePolicyChanges,
            env: params.env,
          });
      }
    } else {
      removeUnsupportedCodexCompactionOverrides({
        agent,
        compaction,
        path: params.path,
        preserve: params.preserveUnsupportedCompactionOverrides,
        preservePaths: params.preserveUnsupportedCompactionPaths,
        changes: params.unsupportedCompactionChanges,
      });
      if (params.preserveUnsupportedCompactionOverrides?.model)
        rewriteStringModelSlot({
          hits: params.hits,
          container: compaction,
          key: "model",
          path: `${params.path}.compaction.model`,
        });
    }
  else
    rewriteStringModelSlotIfCanonicalCodexRuntime({
      cfg: params.cfg,
      agentId: params.agentId,
      hits: params.hits,
      container: compaction,
      key: "model",
      path: `${params.path}.compaction.model`,
      env: params.env,
    });
  rewriteStringModelSlotIfCanonicalCodexRuntime({
    cfg: params.cfg,
    agentId: params.agentId,
    hits: params.hits,
    container: asOptionalRecord(compaction?.memoryFlush),
    key: "model",
    path: `${params.path}.compaction.memoryFlush.model`,
    env: params.env,
  });
  for (const key of AGENT_MEDIA_MODEL_CONFIG_KEYS)
    rewriteModelConfigSlot({
      hits: params.hits,
      container: agent,
      key,
      path: `${params.path}.${key}`,
    });
  if (params.rewriteModelsMap) {
    const start = params.hits.length;
    rewriteModelsMap({
      hits: params.hits,
      models: asOptionalRecord(agent.models),
      path: `${params.path}.models`,
    });
    preserveCodexRuntimePolicyForNewHits(start);
  }
}
function removeUnsupportedCodexCompactionOverrides(params) {
  if (!params.compaction) return;
  if (normalizeOptionalLowercaseString(params.compaction.provider) === LOSSLESS_CONTEXT_ENGINE_ID)
    return;
  for (const key of COMPACTION_OVERRIDE_KEYS) {
    const path = `${params.path}.compaction.${key}`;
    if (params.preservePaths?.has(path)) continue;
    if (params.preserve?.[key]) continue;
    const value = params.compaction[key];
    if (typeof value !== "string" || !value.trim()) continue;
    delete params.compaction[key];
    params.changes.push(`Removed ${path}; Codex runtime uses native server-side compaction.`);
  }
  if (Object.keys(params.compaction).length === 0) delete params.agent.compaction;
}
function readMutablePath(root, pathLabel) {
  const parts = pathLabel.split(".");
  let cursor = root;
  for (const part of parts) {
    const record = asOptionalRecord(cursor);
    if (!record) return;
    cursor = record[part];
  }
  return asOptionalRecord(cursor);
}
function readCompactionOwnerForPath(cfg, ownerPath) {
  if (ownerPath === "agents.defaults") return asOptionalRecord(cfg.agents?.defaults);
  if (!ownerPath.startsWith("agents.list.")) return readMutablePath(cfg, ownerPath);
  const label = ownerPath.slice(12);
  const agents = Array.isArray(cfg.agents?.list) ? cfg.agents.list : [];
  const agentWithId = agents.find((agent) => agent.id === label);
  if (agentWithId) return asOptionalRecord(agentWithId);
  const index = Number(label);
  const candidate = Number.isInteger(index) ? agents[index] : void 0;
  if (candidate) return asOptionalRecord(candidate);
}
function removeMigratedLosslessCompactionKey(params) {
  const ownerPath = readCompactionOwnerPathForKeyPath(params.path);
  const owner = readCompactionOwnerForPath(params.cfg, ownerPath);
  const compaction = asOptionalRecord(owner?.compaction);
  if (!owner || !compaction) return;
  const value = compaction[params.key];
  if (typeof value !== "string" || !value.trim()) return;
  delete compaction[params.key];
  params.changes.push(params.changeMessage);
  if (Object.keys(compaction).length === 0) delete owner.compaction;
}
function readCompactionOwnerPathForKeyPath(path) {
  return path.replace(/\.(model|provider)$/, "").replace(/\.compaction$/, "");
}
function legacyLosslessSummaryModels(hits) {
  const models = /* @__PURE__ */ new Set();
  for (const hit of hits) {
    if (!hit.modelValue) continue;
    models.add(
      toCanonicalOpenAIModelRef(hit.modelValue) ?? normalizeDefaultProviderModelRef(hit.modelValue),
    );
  }
  return [...models];
}
function preserveMigratedLosslessCodexRuntimePolicy(params) {
  if (!params.summaryModel) return;
  const preservedOwners = /* @__PURE__ */ new Set();
  for (const hit of params.hits) {
    if (!hit.modelValue || !isOpenAICodexModelRef(hit.modelValue)) continue;
    if (toCanonicalOpenAIModelRef(hit.modelValue) !== params.summaryModel) continue;
    const ownerPath = readCompactionOwnerPathForKeyPath(hit.modelPath ?? hit.providerPath);
    if (preservedOwners.has(ownerPath)) continue;
    const owner = readCompactionOwnerForPath(params.cfg, ownerPath);
    if (!owner) continue;
    preservedOwners.add(ownerPath);
    ensureCodexRuntimePolicy({
      cfg: params.cfg,
      agent: owner,
      agentPath: ownerPath,
      agentId: agentIdFromAgentPath(ownerPath),
      modelRef: params.summaryModel,
      isDefaults: ownerPath === "agents.defaults",
      changes: params.changes,
      env: params.env,
    });
  }
}
function canAutoMigrateLegacyLosslessCompaction(params) {
  if (params.contextEngine && params.contextEngine !== LOSSLESS_CONTEXT_ENGINE_ID) return false;
  const models = legacyLosslessSummaryModels(params.hits);
  if (params.hits.some((hit) => !hit.modelValue) && (models.length > 0 || params.summaryModel))
    return false;
  if (models.length === 0) return true;
  if (params.summaryModel) return models.every((model) => model === params.summaryModel);
  return models.length === 1;
}
function readLosslessSummaryModel(plugins) {
  const config = asOptionalRecord(
    asOptionalRecord(asOptionalRecord(plugins?.entries)?.[LOSSLESS_CONTEXT_ENGINE_ID])?.config,
  );
  return typeof config?.summaryModel === "string" && config.summaryModel.trim()
    ? config.summaryModel.trim()
    : void 0;
}
function ensureMutablePath(root, path) {
  let cursor = root;
  for (const part of path) {
    const next = asOptionalRecord(cursor[part]) ?? {};
    if (cursor[part] !== next) cursor[part] = next;
    cursor = next;
  }
  return cursor;
}
function ensureLosslessLlmPolicy(params) {
  if (!params.summaryModel) return;
  const llm = ensureMutablePath(params.entry, ["llm"]);
  if (llm.allowModelOverride !== true) {
    llm.allowModelOverride = true;
    params.changes.push(
      `Set plugins.entries.${LOSSLESS_CONTEXT_ENGINE_ID}.llm.allowModelOverride to true for Lossless summary model overrides.`,
    );
  }
  const allowedModels = Array.isArray(llm.allowedModels) ? [...llm.allowedModels] : [];
  if (!allowedModels.includes(params.summaryModel)) {
    allowedModels.push(params.summaryModel);
    llm.allowedModels = allowedModels;
    params.changes.push(
      `Added ${params.summaryModel} to plugins.entries.${LOSSLESS_CONTEXT_ENGINE_ID}.llm.allowedModels.`,
    );
  }
}
function maybeMigrateLegacyLosslessCompactionConfig(params) {
  const root = params.cfg;
  const hits = collectLegacyLosslessCompactionConfigs(params);
  if (hits.length === 0) return [];
  const existingPlugins = asOptionalRecord(root.plugins);
  const existingSlots = asOptionalRecord(existingPlugins?.slots);
  const configuredContextEngine =
    typeof existingSlots?.contextEngine === "string" && existingSlots.contextEngine.trim()
      ? existingSlots.contextEngine.trim()
      : void 0;
  const existingSummaryModel = readLosslessSummaryModel(existingPlugins);
  const contextEngine = normalizeOptionalLowercaseString(configuredContextEngine);
  if (
    sharedDefaultLosslessCompactionHasNonCodexConsumer(params) ||
    !canAutoMigrateLegacyLosslessCompaction({
      hits,
      contextEngine,
      summaryModel: existingSummaryModel,
    })
  )
    return [];
  const plugins = ensureMutablePath(root, ["plugins"]);
  const slots = ensureMutablePath(plugins, ["slots"]);
  const changes = [];
  const entries = ensureMutablePath(plugins, ["entries"]);
  const entry = asOptionalRecord(entries[LOSSLESS_CONTEXT_ENGINE_ID]) ?? {};
  if (entries[LOSSLESS_CONTEXT_ENGINE_ID] !== entry) entries[LOSSLESS_CONTEXT_ENGINE_ID] = entry;
  const config = ensureMutablePath(entry, ["config"]);
  if (slots.contextEngine !== LOSSLESS_CONTEXT_ENGINE_ID) {
    slots.contextEngine = LOSSLESS_CONTEXT_ENGINE_ID;
    changes.push(
      `Set plugins.slots.contextEngine to "${LOSSLESS_CONTEXT_ENGINE_ID}" for legacy Lossless compaction config.`,
    );
  }
  if (entry.enabled !== true) {
    entry.enabled = true;
    changes.push(`Enabled plugins.entries.${LOSSLESS_CONTEXT_ENGINE_ID}.`);
  }
  let summaryModel = existingSummaryModel;
  const firstModel = legacyLosslessSummaryModels(hits)[0];
  if (!summaryModel && firstModel) {
    summaryModel = firstModel;
    config.summaryModel = summaryModel;
    changes.push(
      `Moved ${hits.find((hit) => hit.modelValue)?.modelPath ?? "legacy compaction model"} to plugins.entries.${LOSSLESS_CONTEXT_ENGINE_ID}.config.summaryModel.`,
    );
  }
  ensureLosslessLlmPolicy({
    entry,
    summaryModel,
    changes,
  });
  preserveMigratedLosslessCodexRuntimePolicy({
    cfg: params.cfg,
    hits,
    summaryModel,
    changes,
    env: params.env,
  });
  for (const hit of hits) {
    removeMigratedLosslessCompactionKey({
      cfg: params.cfg,
      path: hit.providerPath,
      key: "provider",
      changes,
      changeMessage: `Removed ${hit.providerPath}; Lossless now runs through plugins.slots.contextEngine.`,
    });
    if (hit.modelPath)
      removeMigratedLosslessCompactionKey({
        cfg: params.cfg,
        path: hit.modelPath,
        key: "model",
        changes,
        changeMessage: `Removed ${hit.modelPath} after migrating the Lossless summary model.`,
      });
  }
  return changes;
}
function legacyEntryExplicitNonDefaultRuntimeId(models, canonicalModelRef) {
  for (const ref of Object.keys(models)) {
    if (ref === canonicalModelRef) continue;
    if (toCanonicalOpenAIModelRef(ref) !== canonicalModelRef) continue;
    const id = normalizeOptionalLowercaseString(
      asOptionalRecord(asOptionalRecord(models[ref])?.agentRuntime)?.id,
    );
    if (id && id !== "auto" && id !== "default") return id;
  }
}
function agentIdFromAgentPath(agentPath) {
  return agentPath.startsWith("agents.list.") ? agentPath.slice(12) : void 0;
}
function modelIdMatchesProviderModelEntry(params) {
  if (typeof params.entryId !== "string") return false;
  const entryId = params.entryId.trim();
  if (entryId === params.modelId) return true;
  const slash = entryId.indexOf("/");
  if (slash <= 0) return false;
  return (
    normalizeProviderId(entryId.slice(0, slash)) === normalizeProviderId(params.provider) &&
    entryId.slice(slash + 1).trim() === params.modelId
  );
}
function providerModelExplicitNonDefaultRuntimeId(params) {
  const providers = asOptionalRecord(asOptionalRecord(params.cfg.models)?.providers);
  for (const [providerId, providerConfig] of Object.entries(providers ?? {})) {
    if (normalizeProviderId(providerId) !== normalizeProviderId(params.provider)) continue;
    const models = asOptionalRecord(providerConfig)?.models;
    if (!Array.isArray(models)) continue;
    for (const model of models) {
      const record = asOptionalRecord(model);
      if (
        !modelIdMatchesProviderModelEntry({
          entryId: record?.id,
          provider: params.provider,
          modelId: params.modelId,
        })
      )
        continue;
      const runtimeId = normalizeRuntimeString(asOptionalRecord(record?.agentRuntime)?.id);
      if (runtimeId && runtimeId !== "auto" && runtimeId !== "default" && runtimeId !== "codex")
        return runtimeId;
    }
  }
}
function agentModelMapExactRuntimeIdForLegacyRef(params) {
  const parsed = parseModelRef(params.legacyModelRef);
  if (!parsed) return;
  const agentId = normalizeAgentId(params.agentId);
  const modelMaps = [
    asOptionalRecord(
      (agentId
        ? (params.cfg.agents?.list ?? []).find((entry) => normalizeAgentId(entry.id) === agentId)
        : void 0
      )?.models,
    ),
    asOptionalRecord(params.cfg.agents?.defaults?.models),
  ];
  for (const models of modelMaps)
    for (const [key, entry] of Object.entries(models ?? {})) {
      if (
        !modelIdMatchesProviderModelEntry({
          entryId: key,
          provider: parsed.provider,
          modelId: parsed.modelId,
        })
      )
        continue;
      const runtimeId = normalizeRuntimeString(
        asOptionalRecord(asOptionalRecord(entry)?.agentRuntime)?.id,
      );
      if (runtimeId && runtimeId !== "auto" && runtimeId !== "default") return runtimeId;
    }
}
function preRepairLegacyModelPolicyExplicitNonDefaultRuntimePin(params) {
  if (!params.legacyModelRef || !isOpenAICodexModelRef(params.legacyModelRef)) return;
  const parsed = parseModelRef(params.legacyModelRef);
  if (!parsed) return;
  const resolved = resolveModelRuntimePolicy({
    config: params.cfg,
    provider: parsed.provider,
    modelId: parsed.modelId,
    agentId: params.agentId,
  });
  const runtimeId = normalizeRuntimeString(resolved.policy?.id);
  if (!runtimeId || runtimeId === "auto" || runtimeId === "default" || runtimeId === "codex")
    return;
  if (resolved.source === "model") {
    const providerModelRuntimeId = providerModelExplicitNonDefaultRuntimeId({
      cfg: params.cfg,
      provider: parsed.provider,
      modelId: parsed.modelId,
    });
    const agentModelRuntimeId = agentModelMapExactRuntimeIdForLegacyRef({
      cfg: params.cfg,
      legacyModelRef: params.legacyModelRef,
      agentId: params.agentId,
    });
    if (providerModelRuntimeId === runtimeId && !agentModelRuntimeId)
      return {
        runtimeId,
        source: "provider-model",
      };
  }
  return {
    runtimeId,
    source: resolved.source ?? "model",
  };
}
function ensureCodexRuntimePolicy(params) {
  const models = asOptionalRecord(params.agent.models);
  const runtimeId = normalizeOptionalLowercaseString(
    asOptionalRecord(asOptionalRecord(models?.[params.modelRef])?.agentRuntime)?.id,
  );
  const pinnedRuntimeId =
    runtimeId && runtimeId !== "auto" && runtimeId !== "default" ? runtimeId : void 0;
  const legacyModelRuntimeId = models
    ? legacyEntryExplicitNonDefaultRuntimeId(models, params.modelRef)
    : void 0;
  const preRepairRuntimePin = preRepairLegacyModelPolicyExplicitNonDefaultRuntimePin({
    cfg: params.preRepairCfg ?? params.cfg,
    legacyModelRef: params.legacyModelRef,
    agentId: params.agentId,
  });
  const targetRuntimeId =
    pinnedRuntimeId ??
    legacyModelRuntimeId ??
    (preRepairRuntimePin?.source === "provider" || preRepairRuntimePin?.source === "provider-model"
      ? preRepairRuntimePin.runtimeId
      : void 0) ??
    "codex";
  if (params.isDefaults)
    shieldExplicitListedAgentRefsFromDefaultPolicy({
      cfg: params.cfg,
      modelRef: params.modelRef,
      targetRuntimeId,
      changes: params.changes,
      env: params.env,
    });
  if (pinnedRuntimeId) return;
  if (legacyModelRuntimeId) return;
  if (preRepairRuntimePin) {
    if (
      preRepairRuntimePin.source === "provider" ||
      preRepairRuntimePin.source === "provider-model"
    )
      setModelRuntimePolicy({
        agent: params.agent,
        agentPath: params.agentPath,
        modelRef: params.modelRef,
        runtimeId: preRepairRuntimePin.runtimeId,
        changes: params.changes,
        reason: "so legacy provider runtime pins survive Codex route repair",
      });
    return;
  }
  setModelRuntimePolicy({
    agent: params.agent,
    agentPath: params.agentPath,
    modelRef: params.modelRef,
    runtimeId: "codex",
    changes: params.changes,
    reason: "so repaired OpenAI refs keep Codex auth routing",
  });
}
function canonicalOpenAIModelUsesCodexRuntime(params) {
  const slash = params.modelRef.indexOf("/");
  if (slash <= 0 || slash >= params.modelRef.length - 1) return false;
  const parsed = parseModelRef(params.modelRef);
  if (!parsed) return false;
  return configuredModelRouteNeedsCodex({
    cfg: params.cfg,
    env: params.env ?? process.env,
    ...(params.agentId ? { agentId: params.agentId } : {}),
    route: {
      provider: parsed.provider,
      modelId: parsed.modelId,
    },
  });
}
function rewriteStringModelSlotIfCanonicalCodexRuntime(params) {
  const value = params.container?.[params.key];
  if (typeof value !== "string") return;
  const canonicalModel = toCanonicalOpenAIModelRef(value.trim());
  if (
    !canonicalModel ||
    !canonicalOpenAIModelUsesCodexRuntime({
      cfg: params.cfg,
      modelRef: canonicalModel,
      agentId: params.agentId,
      env: params.env,
    })
  )
    return;
  rewriteStringModelSlot({
    hits: params.hits,
    container: params.container,
    key: params.key,
    path: params.path,
  });
}
function rewriteModelConfigSlotIfCanonicalCodexRuntime(params) {
  const value = params.container?.[params.key];
  if (typeof value === "string") {
    rewriteStringModelSlotIfCanonicalCodexRuntime(params);
    return;
  }
  const record = asOptionalRecord(value);
  if (!record) return;
  rewriteStringModelSlotIfCanonicalCodexRuntime({
    cfg: params.cfg,
    agentId: params.agentId,
    hits: params.hits,
    container: record,
    key: "primary",
    path: `${params.path}.primary`,
    env: params.env,
  });
  const fallbacks = Array.isArray(record.fallbacks) ? record.fallbacks : void 0;
  if (!fallbacks) return;
  for (const [index, entry] of fallbacks.entries()) {
    if (typeof entry !== "string") continue;
    const canonicalModel = toCanonicalOpenAIModelRef(entry.trim());
    if (
      !canonicalModel ||
      !canonicalOpenAIModelUsesCodexRuntime({
        cfg: params.cfg,
        modelRef: canonicalModel,
        agentId: params.agentId,
        env: params.env,
      })
    )
      continue;
    fallbacks[index] = canonicalModel;
    params.hits.push({
      path: `${params.path}.fallbacks.${index}`,
      model: entry.trim(),
      canonicalModel,
    });
  }
}
function clearLegacyAgentRuntimePolicy(container, pathLabel, changes) {
  if (!container) return;
  if (asOptionalRecord(container.embeddedHarness)) {
    delete container.embeddedHarness;
    changes.push(`Removed ${pathLabel}.embeddedHarness; runtime is now provider/model scoped.`);
  }
  if (asOptionalRecord(container.agentRuntime)) {
    delete container.agentRuntime;
    changes.push(`Removed ${pathLabel}.agentRuntime; runtime is now provider/model scoped.`);
  }
}
function clearConfigLegacyAgentRuntimePolicies(cfg) {
  const changes = [];
  clearLegacyAgentRuntimePolicy(asOptionalRecord(cfg.agents?.defaults), "agents.defaults", changes);
  const agents = Array.isArray(cfg.agents?.list) ? cfg.agents.list : [];
  for (const [index, agent] of agents.entries()) {
    const agentRecord = asOptionalRecord(agent);
    if (!agentRecord) continue;
    clearLegacyAgentRuntimePolicy(
      agentRecord,
      `agents.list.${typeof agentRecord.id === "string" && agentRecord.id.trim() ? agentRecord.id.trim() : String(index)}`,
      changes,
    );
  }
  return changes;
}
function isCompactionOnlyRouteHit(hit) {
  return (
    hit.path.startsWith("agents.") &&
    (hit.path.endsWith(".compaction.model") || hit.path.endsWith(".compaction.memoryFlush.model"))
  );
}
function rewriteConfigModelRefsWithCompactionPolicy(params) {
  const nextConfig = structuredClone(params.cfg);
  const preRepairCfg = params.cfg;
  const hits = [];
  const runtimePolicyChanges = [];
  const unsupportedCompactionChanges = [];
  const ignoreLegacyAgentRuntimePins =
    params.ignoreLegacyAgentRuntimePins ??
    configRepairWouldClearLegacyRuntimePins({
      cfg: nextConfig,
      env: params.env,
    });
  unsupportedCompactionChanges.push(
    ...maybeMigrateLegacyLosslessCompactionConfig({
      cfg: nextConfig,
      ignoreLegacyAgentRuntimePins,
      env: params.env,
    }),
  );
  const preservedLegacyLosslessCompactionPaths = new Set(
    collectLegacyLosslessCompactionConfigs({
      cfg: nextConfig,
      ignoreLegacyAgentRuntimePins,
      env: params.env,
    }).flatMap((hit) => (hit.modelPath ? [hit.providerPath, hit.modelPath] : [hit.providerPath])),
  );
  const defaultsRuntime = ignoreLegacyAgentRuntimePins
    ? void 0
    : readLegacyDefaultsRuntime(nextConfig.agents?.defaults);
  const rewrittenInheritedCompactionModels = /* @__PURE__ */ new Map();
  rewriteAgentModelRefs({
    cfg: nextConfig,
    preRepairCfg,
    hits,
    agent: asOptionalRecord(nextConfig.agents?.defaults),
    path: "agents.defaults",
    currentRuntime: resolveRuntime({ defaultsRuntime }),
    rewriteModelsMap: true,
    preserveUnsupportedCompactionOverrides: params.preserveSharedDefaultCompactionOverrides,
    preserveUnsupportedCompactionPaths: preservedLegacyLosslessCompactionPaths,
    rewrittenInheritedCompactionModels,
    runtimePolicyChanges,
    unsupportedCompactionChanges,
    env: params.env,
  });
  const inheritedModelRef = readAgentPrimaryModelRef(nextConfig.agents?.defaults);
  const agents = Array.isArray(nextConfig.agents?.list) ? nextConfig.agents.list : [];
  for (const [index, agent] of agents.entries()) {
    const agentRecord = asOptionalRecord(agent);
    if (!agentRecord) continue;
    const id =
      typeof agentRecord.id === "string" && agentRecord.id.trim()
        ? agentRecord.id.trim()
        : String(index);
    rewriteAgentModelRefs({
      cfg: nextConfig,
      preRepairCfg,
      hits,
      agent: agentRecord,
      path: `agents.list.${id}`,
      agentId: id,
      currentRuntime: resolveRuntime({
        agentRuntime: ignoreLegacyAgentRuntimePins
          ? void 0
          : asAgentRuntimePolicyConfig(agentRecord.agentRuntime),
        defaultsRuntime,
      }),
      inheritedModelRef,
      inheritedCompaction: nextConfig.agents?.defaults?.compaction,
      inheritedCompactionPath: "agents.defaults.compaction",
      rewriteModelsMap: true,
      preserveUnsupportedCompactionPaths: preservedLegacyLosslessCompactionPaths,
      rewrittenInheritedCompactionModels,
      runtimePolicyChanges,
      unsupportedCompactionChanges,
      env: params.env,
    });
  }
  const channelsModelByChannel = asOptionalRecord(nextConfig.channels?.modelByChannel);
  if (channelsModelByChannel)
    for (const [channelId, channelMap] of Object.entries(channelsModelByChannel)) {
      const targets = asOptionalRecord(channelMap);
      if (!targets) continue;
      for (const targetId of Object.keys(targets))
        rewriteStringModelSlotIfCanonicalCodexRuntime({
          cfg: nextConfig,
          hits,
          container: targets,
          key: targetId,
          path: `channels.modelByChannel.${channelId}.${targetId}`,
          env: params.env,
        });
    }
  for (const [index, mapping] of (nextConfig.hooks?.mappings ?? []).entries())
    rewriteStringModelSlotIfCanonicalCodexRuntime({
      cfg: nextConfig,
      hits,
      container: mapping,
      key: "model",
      path: `hooks.mappings.${index}.model`,
      env: params.env,
    });
  rewriteStringModelSlotIfCanonicalCodexRuntime({
    cfg: nextConfig,
    hits,
    container: asOptionalRecord(nextConfig.hooks?.gmail),
    key: "model",
    path: "hooks.gmail.model",
    env: params.env,
  });
  rewriteStringModelSlotIfCanonicalCodexRuntime({
    cfg: nextConfig,
    hits,
    container: asOptionalRecord(nextConfig.messages?.tts),
    key: "summaryModel",
    path: "messages.tts.summaryModel",
    env: params.env,
  });
  rewriteStringModelSlotIfCanonicalCodexRuntime({
    cfg: nextConfig,
    hits,
    container: asOptionalRecord(asOptionalRecord(nextConfig.channels?.discord)?.voice),
    key: "model",
    path: "channels.discord.voice.model",
    env: params.env,
  });
  const runtimePinChanges = hits.some((hit) => !isCompactionOnlyRouteHit(hit))
    ? clearConfigLegacyAgentRuntimePolicies(nextConfig)
    : [];
  return {
    cfg:
      hits.length > 0 ||
      runtimePolicyChanges.length > 0 ||
      runtimePinChanges.length > 0 ||
      unsupportedCompactionChanges.length > 0
        ? nextConfig
        : params.cfg,
    changes: hits,
    runtimePinChanges,
    runtimePolicyChanges,
    unsupportedCompactionChanges,
  };
}
function configRepairWouldClearLegacyRuntimePins(params) {
  return rewriteConfigModelRefsWithCompactionPolicy({
    cfg: params.cfg,
    preserveSharedDefaultCompactionOverrides: {
      model: true,
      provider: true,
    },
    ignoreLegacyAgentRuntimePins: false,
    env: params.env,
  }).changes.some((hit) => !isCompactionOnlyRouteHit(hit));
}
function rewriteConfigModelRefs(params) {
  const preserveSharedDefaultCompactionOverrides = getSharedDefaultCompactionOverrideConsumers({
    cfg: params.cfg,
    ignoreLegacyAgentRuntimePins: configRepairWouldClearLegacyRuntimePins(params),
    env: params.env,
  });
  return rewriteConfigModelRefsWithCompactionPolicy({
    cfg: params.cfg,
    preserveSharedDefaultCompactionOverrides,
    env: params.env,
  });
}
function formatCodexRouteChange(hit) {
  return `${hit.path}: ${hit.model} -> ${hit.canonicalModel}.`;
}
function formatUnsupportedCompactionWarning(params) {
  return [
    "- Codex runtime uses native server-side compaction and ignores OpenClaw compaction summarizer overrides.",
    ...params.hits.map(
      (hit) => `- ${hit.path}: ${hit.value} is ignored while this agent uses Codex runtime.`,
    ),
    params.fixHint,
  ].join("\n");
}
function formatLegacyLosslessCompactionWarning(params) {
  const configLines = [];
  const providerPaths = /* @__PURE__ */ new Set();
  for (const hit of params.hits) {
    if (!providerPaths.has(hit.providerPath)) {
      providerPaths.add(hit.providerPath);
      configLines.push(
        `- ${hit.providerPath}: ${hit.providerValue} should become plugins.slots.contextEngine: ${LOSSLESS_CONTEXT_ENGINE_ID}.`,
      );
    }
    if (hit.modelPath && hit.modelValue)
      configLines.push(
        `- ${hit.modelPath}: ${hit.modelValue} should become plugins.entries.${LOSSLESS_CONTEXT_ENGINE_ID}.config.summaryModel.`,
      );
  }
  return [
    "- Legacy Lossless compaction config should use the Lossless context-engine slot for Codex.",
    ...configLines,
    params.canAutoFix
      ? "- Run `openclaw doctor --fix`: it migrates legacy Lossless compaction config to the Lossless context-engine slot."
      : "- Move the Lossless config manually; doctor will not overwrite an existing non-Lossless context-engine slot or collapse conflicting per-agent summary models.",
  ].join("\n");
}
function formatDisabledCodexPluginWarning(params) {
  const fixHint = params.blockedOutsideEntry
    ? "- Enable plugin loading and remove `codex` from plugins.deny, or set the affected OpenAI models to an OpenClaw runtime policy."
    : "- Run `openclaw doctor --fix`: it enables plugins.entries.codex, or set the affected OpenAI models to an OpenClaw runtime policy.";
  return [
    "- Codex runtime is selected, but the Codex plugin is disabled.",
    ...params.hits.map(
      (hit) =>
        `- ${hit.path}: ${hit.modelRef} resolves to ${hit.canonicalModel} with Codex runtime while the Codex plugin is disabled by config.`,
    ),
    fixHint,
  ].join("\n");
}
function collectCodexAppServerCommandWarnings(cfg) {
  const appServer = asOptionalRecord(
    asOptionalRecord(
      asOptionalRecord(asOptionalRecord(asOptionalRecord(cfg.plugins)?.entries)?.codex)?.config,
    )?.appServer,
  );
  const command = typeof appServer?.command === "string" ? appServer.command.trim() : "";
  if (!command) return [];
  const inlineArgs = detectWindowsSpawnCommandInlineArgs(command);
  if (!inlineArgs) return [];
  return [
    [
      "- Codex app-server command override includes inline arguments.",
      `- plugins.entries.codex.config.appServer.command: "${command}" starts with "${inlineArgs.executable}" and embeds "${inlineArgs.arguments}". The command field must be only the executable path.`,
      "- Remove the override to use managed Codex startup, or move script/options to plugins.entries.codex.config.appServer.args.",
    ].join("\n"),
  ];
}
function collectCodexComputerUseWarnings(cfg) {
  const computerUse = asOptionalRecord(
    asOptionalRecord(
      asOptionalRecord(asOptionalRecord(asOptionalRecord(cfg.plugins)?.entries)?.codex)?.config,
    )?.computerUse,
  );
  if (!computerUse) return [];
  if (
    !(
      computerUse.enabled === true ||
      computerUse.autoInstall === true ||
      typeof computerUse.marketplaceSource === "string" ||
      typeof computerUse.marketplacePath === "string" ||
      typeof computerUse.marketplaceName === "string"
    )
  )
    return [];
  const cadence =
    computerUse.healthCheckIntervalMinutes === 30 ||
    computerUse.healthCheckIntervalMinutes === 60 ||
    computerUse.healthCheckIntervalMinutes === 120 ||
    computerUse.healthCheckIntervalMinutes === 240
      ? computerUse.healthCheckIntervalMinutes
      : 60;
  return [
    [
      "- Codex Computer Use is enabled.",
      "- Doctor config review found Computer Use enabled; run `/codex computer-use status` to inspect installation, exposure, and the live `list_apps` probe.",
      computerUse.healthCheckEnabled === true
        ? `- Periodic Computer Use health checks are enabled with a ${cadence}-minute cadence.`
        : "- Periodic Computer Use health checks are disabled by default; set `computerUse.healthCheckEnabled` to true to enable them.",
      computerUse.autoRepair === true
        ? "- Stale Computer Use MCP child repair is enabled and limited to SkyComputerUseClient children."
        : "- Stale Computer Use MCP child repair is disabled by default; set `computerUse.autoRepair` to true to repair before retrying a failed probe.",
    ].join("\n"),
  ];
}
/** Collect doctor warnings for legacy Codex model refs, runtime pins, and compaction overrides. */
function collectCodexRouteWarnings(params) {
  const env = params.env ?? process.env;
  const hits = collectConfigModelRefs(params.cfg);
  const disabledCodexPluginHits = collectDisabledCodexPluginRouteHits(params.cfg, env);
  const ignoreLegacyAgentRuntimePins = configRepairWouldClearLegacyRuntimePins({
    cfg: params.cfg,
    env,
  });
  const legacyLosslessCompactionConfigs = collectLegacyLosslessCompactionConfigs({
    cfg: params.cfg,
    ignoreLegacyAgentRuntimePins,
    env,
  });
  const legacyLosslessCompactionPaths = new Set(
    legacyLosslessCompactionConfigs.flatMap((hit) =>
      hit.modelPath ? [hit.providerPath, hit.modelPath] : [hit.providerPath],
    ),
  );
  const unsupportedCompactionOverrides = collectUnsupportedCodexCompactionOverrides({
    cfg: params.cfg,
    ignoreLegacyAgentRuntimePins,
    env,
  }).filter((hit) => !legacyLosslessCompactionPaths.has(hit.path));
  const sharedDefaultCompactionConsumers = getSharedDefaultCompactionOverrideConsumers({
    cfg: params.cfg,
    ignoreLegacyAgentRuntimePins,
    env,
  });
  const sharedLosslessDefaultHasNonCodexConsumer =
    sharedDefaultLosslessCompactionHasNonCodexConsumer({
      cfg: params.cfg,
      ignoreLegacyAgentRuntimePins,
      env,
    });
  const warnings = [];
  warnings.push(...collectCodexAppServerCommandWarnings(params.cfg));
  warnings.push(...collectCodexComputerUseWarnings(params.cfg));
  if (hits.length > 0)
    warnings.push(
      [
        "- Legacy `openai-codex/*` model refs should be rewritten to `openai/*`.",
        ...hits.map(
          (hit) =>
            `- ${hit.path}: ${hit.model} should become ${hit.canonicalModel}${hit.runtime ? `; current runtime is "${hit.runtime}"` : ""}.`,
        ),
        "- Run `openclaw doctor --fix`: it rewrites configured model refs and stale sessions to `openai/*`, moves Codex intent to provider/model runtime policy, and clears old whole-agent runtime pins.",
      ].join("\n"),
    );
  if (legacyLosslessCompactionConfigs.length > 0) {
    const plugins = asOptionalRecord(params.cfg.plugins);
    const contextEngine = normalizeOptionalLowercaseString(
      asOptionalRecord(plugins?.slots)?.contextEngine,
    );
    warnings.push(
      formatLegacyLosslessCompactionWarning({
        hits: legacyLosslessCompactionConfigs,
        canAutoFix:
          !sharedLosslessDefaultHasNonCodexConsumer &&
          canAutoMigrateLegacyLosslessCompaction({
            hits: legacyLosslessCompactionConfigs,
            contextEngine,
            summaryModel: readLosslessSummaryModel(plugins),
          }),
      }),
    );
  }
  if (disabledCodexPluginHits.length > 0)
    warnings.push(
      formatDisabledCodexPluginWarning({
        hits: disabledCodexPluginHits,
        blockedOutsideEntry: codexPluginIsBlockedOutsideEntry(params.cfg),
      }),
    );
  const preservedSharedDefaultHits = unsupportedCompactionOverrides.filter(
    (hit) =>
      hit.path.startsWith("agents.defaults.compaction.") &&
      sharedDefaultCompactionConsumers[hit.key],
  );
  const fixableHits = unsupportedCompactionOverrides.filter(
    (hit) =>
      !hit.path.startsWith("agents.defaults.compaction.") ||
      !sharedDefaultCompactionConsumers[hit.key],
  );
  if (preservedSharedDefaultHits.length > 0)
    warnings.push(
      formatUnsupportedCompactionWarning({
        hits: preservedSharedDefaultHits,
        fixHint:
          "- Move or remove shared `agents.defaults.compaction.model/provider` settings manually; doctor keeps shared defaults while non-Codex agents can inherit them.",
      }),
    );
  if (fixableHits.length > 0)
    warnings.push(
      formatUnsupportedCompactionWarning({
        hits: fixableHits,
        fixHint:
          "- Run `openclaw doctor --fix`: it removes unsupported Codex compaction overrides.",
      }),
    );
  return warnings;
}
/** Rewrite legacy Codex config routes to OpenAI refs and explicit runtime policy when allowed. */
function maybeRepairCodexRoutes(params) {
  const env = params.env ?? process.env;
  const hits = collectConfigModelRefs(params.cfg);
  const disabledCodexPluginHits = collectDisabledCodexPluginRouteHits(params.cfg, env);
  const ignoreLegacyAgentRuntimePins = configRepairWouldClearLegacyRuntimePins({
    cfg: params.cfg,
    env,
  });
  const unsupportedCompactionOverrides = collectUnsupportedCodexCompactionOverrides({
    cfg: params.cfg,
    ignoreLegacyAgentRuntimePins,
    env,
  });
  const legacyLosslessCompactionConfigs = collectLegacyLosslessCompactionConfigs({
    cfg: params.cfg,
    ignoreLegacyAgentRuntimePins,
    env,
  });
  if (
    hits.length === 0 &&
    disabledCodexPluginHits.length === 0 &&
    unsupportedCompactionOverrides.length === 0 &&
    legacyLosslessCompactionConfigs.length === 0
  )
    return {
      cfg: params.cfg,
      warnings: [],
      changes: [],
    };
  if (!params.shouldRepair)
    return {
      cfg: params.cfg,
      warnings: collectCodexRouteWarnings({
        cfg: params.cfg,
        env,
      }),
      changes: [],
    };
  const repaired = rewriteConfigModelRefs({
    cfg: params.cfg,
    env,
  });
  const codexPluginRepair = enableCodexPluginForRequiredRoutes({
    cfg: repaired.cfg,
    routeHits: collectDisabledCodexPluginRouteHits(repaired.cfg, env),
  });
  const warnings = collectCodexRouteWarnings({
    cfg: codexPluginRepair.cfg,
    env,
  });
  const changes =
    repaired.changes.length > 0
      ? [
          `Repaired Codex model routes:\n${repaired.changes.map((hit) => `- ${formatCodexRouteChange(hit)}`).join("\n")}`,
        ]
      : [];
  return {
    cfg: codexPluginRepair.cfg,
    warnings,
    changes: [
      ...changes,
      ...repaired.runtimePolicyChanges,
      ...repaired.runtimePinChanges,
      ...repaired.unsupportedCompactionChanges,
      ...codexPluginRepair.changes,
    ],
  };
}
function rewriteSessionModelPair(params) {
  let changed = false;
  const provider = normalizeOptionalLowercaseString(params.entry[params.providerKey]);
  const model =
    typeof params.entry[params.modelKey] === "string" ? params.entry[params.modelKey] : void 0;
  if (provider === "openai-codex") {
    params.entry[params.providerKey] = "openai";
    if (model) {
      const modelId = toOpenAIModelId(model);
      if (modelId) params.entry[params.modelKey] = modelId;
    }
    return true;
  }
  if (model && isOpenAICodexModelRef(model)) {
    const canonicalModel = toCanonicalOpenAIModelRef(model);
    if (canonicalModel) {
      params.entry[params.modelKey] = canonicalModel;
      changed = true;
    }
  }
  return changed;
}
function clearStaleCodexFallbackNotice(entry) {
  if (
    !isOpenAICodexModelRef(entry.fallbackNoticeSelectedModel) &&
    !isOpenAICodexModelRef(entry.fallbackNoticeActiveModel)
  )
    return false;
  delete entry.fallbackNoticeSelectedModel;
  delete entry.fallbackNoticeActiveModel;
  delete entry.fallbackNoticeReason;
  return true;
}
function clearStaleSessionRuntimePins(entry) {
  const harnessRuntime = normalizeRuntimeString(entry.agentHarnessId);
  const overrideRuntime = normalizeRuntimeString(entry.agentRuntimeOverride);
  let changed = false;
  if (entry.agentHarnessId !== void 0 && harnessRuntime !== "openclaw") {
    delete entry.agentHarnessId;
    changed = true;
  }
  if (entry.agentRuntimeOverride !== void 0 && overrideRuntime !== "openclaw") {
    delete entry.agentRuntimeOverride;
    changed = true;
  }
  return changed;
}
function repairProviderlessCodexSessionOverride(entry) {
  if (
    !isProviderlessModelRef(entry.modelOverride) ||
    !isOpenAICodexAuthProfileRef(entry.authProfileOverride) ||
    entry.authProfileOverrideSource !== "auto" ||
    entry.modelOverrideSource !== "auto" ||
    normalizeOptionalLowercaseString(entry.providerOverride)
  )
    return false;
  entry.providerOverride = "openai";
  if (entry.model !== void 0 || entry.modelProvider !== void 0) {
    delete entry.model;
    delete entry.modelProvider;
  }
  if (entry.contextTokens !== void 0) delete entry.contextTokens;
  if (entry.contextBudgetStatus !== void 0) delete entry.contextBudgetStatus;
  return true;
}
/** Rewrite stale Codex model/provider/session runtime fields inside one session store object. */
function repairCodexSessionStoreRoutes(params) {
  const now = params.now ?? Date.now();
  const sessionKeys = [];
  for (const [sessionKey, entry] of Object.entries(params.store)) {
    if (!entry || isValidAgentHarnessSessionStoreEntry(sessionKey, entry)) continue;
    const changedRuntimeModelRoute = rewriteSessionModelPair({
      entry,
      providerKey: "modelProvider",
      modelKey: "model",
    });
    const changedOverrideModelRoute = rewriteSessionModelPair({
      entry,
      providerKey: "providerOverride",
      modelKey: "modelOverride",
    });
    const changedProviderlessOverride = repairProviderlessCodexSessionOverride(entry);
    const changedModelRoute =
      changedRuntimeModelRoute || changedOverrideModelRoute || changedProviderlessOverride;
    const changedFallbackNotice = clearStaleCodexFallbackNotice(entry);
    const changedRuntimePins =
      changedModelRoute || changedFallbackNotice ? clearStaleSessionRuntimePins(entry) : false;
    if (!changedModelRoute && !changedFallbackNotice && !changedRuntimePins) continue;
    entry.updatedAt = now;
    sessionKeys.push(sessionKey);
  }
  return {
    changed: sessionKeys.length > 0,
    sessionKeys,
  };
}
function scanCodexSessionStoreRoutes(store) {
  return Object.entries(store).flatMap(([sessionKey, entry]) => {
    if (!entry || isValidAgentHarnessSessionStoreEntry(sessionKey, entry)) return [];
    return normalizeOptionalLowercaseString(entry.modelProvider) === "openai-codex" ||
      normalizeOptionalLowercaseString(entry.providerOverride) === "openai-codex" ||
      isOpenAICodexModelRef(entry.model) ||
      isOpenAICodexModelRef(entry.modelOverride) ||
      (isProviderlessModelRef(entry.modelOverride) &&
        isOpenAICodexAuthProfileRef(entry.authProfileOverride) &&
        entry.authProfileOverrideSource === "auto" &&
        entry.modelOverrideSource === "auto" &&
        !normalizeOptionalLowercaseString(entry.providerOverride)) ||
      isOpenAICodexModelRef(entry.fallbackNoticeSelectedModel) ||
      isOpenAICodexModelRef(entry.fallbackNoticeActiveModel)
      ? [sessionKey]
      : [];
  });
}
/** Scan or repair all configured agent session stores that still contain legacy Codex routes. */
async function maybeRepairCodexSessionRoutes(params) {
  const targets = resolveAllAgentSessionStoreTargetsSync(params.cfg, {
    env: params.env ?? process.env,
  }).filter((target) => fs.existsSync(target.storePath));
  if (targets.length === 0)
    return {
      scannedStores: 0,
      repairedStores: 0,
      repairedSessions: 0,
      warnings: [],
      changes: [],
    };
  if (!params.shouldRepair) {
    const stale = targets.flatMap((target) => {
      return scanCodexSessionStoreRoutes(
        loadSessionStore(target.storePath, {
          skipCache: true,
          clone: false,
        }),
      ).map((sessionKey) => `${target.agentId}:${sessionKey}`);
    });
    return {
      scannedStores: targets.length,
      repairedStores: 0,
      repairedSessions: 0,
      warnings:
        stale.length > 0
          ? [
              [
                "- Legacy `openai-codex/*` session route state detected.",
                `- Affected sessions: ${stale.length}.`,
                "- Run `openclaw doctor --fix` to rewrite stale session model/provider pins across all agent session stores.",
              ].join("\n"),
            ]
          : [],
      changes: [],
    };
  }
  let repairedStores = 0;
  let repairedSessions = 0;
  for (const target of targets) {
    if (
      scanCodexSessionStoreRoutes(
        loadSessionStore(target.storePath, {
          skipCache: true,
          clone: false,
        }),
      ).length === 0
    )
      continue;
    const result = await updateSessionStore(
      target.storePath,
      (store) => repairCodexSessionStoreRoutes({ store }),
      { skipMaintenance: true },
    );
    if (!result.changed) continue;
    repairedStores += 1;
    repairedSessions += result.sessionKeys.length;
  }
  return {
    scannedStores: targets.length,
    repairedStores,
    repairedSessions,
    warnings: [],
    changes:
      repairedSessions > 0
        ? [
            `Repaired Codex session routes: moved ${repairedSessions} session${repairedSessions === 1 ? "" : "s"} across ${repairedStores} store${repairedStores === 1 ? "" : "s"} to openai/* while preserving auth-profile pins.`,
          ]
        : [],
  };
}
//#endregion
export {
  repairCodexSessionStoreRoutes as a,
  maybeRepairCodexSessionRoutes as i,
  collectDisabledCodexPluginRouteIssues as n,
  maybeRepairCodexRoutes as r,
  collectCodexRouteWarnings as t,
};
