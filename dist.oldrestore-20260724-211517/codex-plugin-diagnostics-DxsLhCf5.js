import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import { n as listAgentIds, r as resolveAgentConfig } from "./agent-scope-config-DVIR1nBa.js";
import {
  d as resolveAgentModelFallbacksOverride,
  h as resolveEffectiveModelFallbacks,
  o as resolveAgentEffectiveModelPrimary,
} from "./agent-scope-y9xQv_q1.js";
import { r as collectConfiguredModelRefs } from "./configured-model-refs-wBBEGQ5a.js";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-CdX9UGcX.js";
import { i as parseModelCatalogRef } from "./model-catalog-refs-BcuK-xC3.js";
import {
  o as toAgentModelListLike,
  r as resolveAgentModelFallbackValues,
} from "./model-input-B7OGjVYg.js";
import { t as resolveModelRuntimePolicy } from "./model-runtime-policy-CKdZrymL.js";
import {
  i as buildModelAliasIndex,
  p as normalizeModelSelection,
  v as resolveConfiguredModelRef,
  x as resolveModelRefFromString,
} from "./model-selection-shared-BliwFXJy.js";
import {
  L as isDefaultAgentRuntimeId,
  l as resolveOpenAIImplicitAgentRuntime,
  z as normalizeOptionalAgentRuntimeId,
} from "./openai-routing-Cu28Ynzk.js";
import { r as normalizeProviderId } from "./provider-id-BIcU_2-A.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
//#region src/agents/model-selection-config.ts
/** Pure configured-model selection helpers safe for config validation. */
function resolveDefaultModelForAgent(params) {
  const agentModelOverride = params.agentId
    ? resolveAgentEffectiveModelPrimary(params.cfg, params.agentId)
    : void 0;
  return resolveConfiguredModelRef({
    cfg:
      agentModelOverride && agentModelOverride.length > 0
        ? {
            ...params.cfg,
            agents: {
              ...params.cfg.agents,
              defaults: {
                ...params.cfg.agents?.defaults,
                model: {
                  ...toAgentModelListLike(params.cfg.agents?.defaults?.model),
                  primary: agentModelOverride,
                },
              },
            },
          }
        : params.cfg,
    defaultProvider: DEFAULT_PROVIDER,
    defaultModel: DEFAULT_MODEL,
    allowPluginNormalization: params.allowPluginNormalization,
    manifestPlugins: params.manifestPlugins,
  });
}
function resolveSubagentConfiguredModelSelection(params) {
  const agentConfig = resolveAgentConfig(params.cfg, params.agentId);
  return (
    normalizeModelSelection(agentConfig?.subagents?.model) ??
    normalizeModelSelection(params.cfg.agents?.defaults?.subagents?.model) ??
    (params.includeAgentPrimary === false ? void 0 : normalizeModelSelection(agentConfig?.model))
  );
}
//#endregion
//#region src/config/codex-plugin-diagnostics.ts
const CODEX_PLUGIN_ID = "codex";
const OPENAI_PROVIDER_ID = "openai";
function codexPluginEntryEnabled(cfg) {
  for (const [pluginId, entry] of Object.entries(cfg.plugins?.entries ?? {}))
    if (normalizeLowercaseStringOrEmpty(pluginId) === CODEX_PLUGIN_ID) return entry?.enabled;
}
function configuredRuntimeNeedsCodex(params) {
  const runtimeId = normalizeOptionalAgentRuntimeId(params.runtimeId);
  if (runtimeId === CODEX_PLUGIN_ID) return true;
  if (!isDefaultAgentRuntimeId(runtimeId)) return false;
  return (
    resolveOpenAIImplicitAgentRuntime({
      provider: OPENAI_PROVIDER_ID,
      modelId: params.modelId,
      config: params.cfg,
      env: params.env,
    }) === CODEX_PLUGIN_ID
  );
}
/** Resolves effective runtime policy for one canonical provider/model route. */
function configuredModelRouteNeedsCodex(params) {
  if (normalizeProviderId(params.route.provider) !== OPENAI_PROVIDER_ID) return false;
  const runtime = resolveModelRuntimePolicy({
    config: params.cfg,
    provider: OPENAI_PROVIDER_ID,
    modelId: params.route.modelId,
    agentId: params.agentId,
  }).policy?.id;
  return configuredRuntimeNeedsCodex({
    cfg: params.cfg,
    env: params.env,
    modelId: params.route.modelId,
    runtimeId: runtime,
  });
}
function resolveEffectiveSelectedModelRefs(params) {
  const { cfg, agentId } = params;
  const mainPrimaryRaw = resolveAgentEffectiveModelPrimary(cfg, agentId);
  const mainFallbacks =
    resolveAgentModelFallbacksOverride(cfg, agentId) ??
    resolveAgentModelFallbackValues(cfg.agents?.defaults?.model);
  const subagentPrimaryRaw =
    resolveSubagentConfiguredModelSelection({
      cfg,
      agentId,
    }) ?? mainPrimaryRaw;
  const subagentFallbacks =
    resolveEffectiveModelFallbacks({
      cfg,
      agentId,
      sessionKey: `agent:${agentId}:subagent:codex-diagnostic`,
      hasSessionModelOverride: true,
      modelOverrideSource: "auto",
    }) ?? [];
  const values = /* @__PURE__ */ new Set();
  for (const raw of [mainPrimaryRaw, ...mainFallbacks, subagentPrimaryRaw, ...subagentFallbacks]) {
    const value = raw?.trim();
    if (value) values.add(value);
  }
  return {
    complete: Boolean(mainPrimaryRaw?.trim() && subagentPrimaryRaw?.trim()),
    values,
  };
}
function configuredRefTargetsAgent(params) {
  const match = /^agents\.list\.(\d+)\./.exec(params.path);
  if (!match) return true;
  const entry = params.cfg.agents?.list?.[Number(match[1])];
  return Boolean(entry && normalizeAgentId(entry.id) === params.agentId);
}
function configuredRefIsEffectiveForAgent(params) {
  if (!configuredRefTargetsAgent(params)) return false;
  if (/^agents\.(?:defaults|list\.\d+)\.(?:model|subagents\.model)(?:\.|$)/.test(params.path))
    return params.selectedModelRefs.has(params.value);
  const agent = resolveAgentConfig(params.cfg, params.agentId);
  if (params.path.endsWith(".heartbeat.model"))
    return (
      (agent?.heartbeat?.model?.trim() || params.cfg.agents?.defaults?.heartbeat?.model?.trim()) ===
      params.value
    );
  if (params.path.endsWith(".utilityModel"))
    return (
      (agent?.utilityModel ?? params.cfg.agents?.defaults?.utilityModel)?.trim() === params.value
    );
  return true;
}
function configuredProviderPoliciesNeedCodex(cfg, env, agentIds) {
  for (const agentId of agentIds) {
    const genericPolicy = resolveModelRuntimePolicy({
      config: cfg,
      provider: OPENAI_PROVIDER_ID,
      agentId,
    }).policy;
    if (
      genericPolicy?.id?.trim() &&
      configuredRuntimeNeedsCodex({
        cfg,
        env,
        runtimeId: genericPolicy.id,
      })
    )
      return true;
  }
  for (const [providerId, providerConfig] of Object.entries(cfg.models?.providers ?? {})) {
    if (normalizeProviderId(providerId) !== OPENAI_PROVIDER_ID) continue;
    for (const model of providerConfig.models ?? []) {
      if (!model.agentRuntime?.id?.trim()) continue;
      const parsed = parseModelCatalogRef(model.id);
      const modelId = parsed?.provider === OPENAI_PROVIDER_ID ? parsed.modelId : model.id.trim();
      if (
        modelId &&
        modelId !== "*" &&
        agentIds.some((agentId) =>
          configuredModelRouteNeedsCodex({
            cfg,
            env,
            agentId,
            route: {
              provider: OPENAI_PROVIDER_ID,
              modelId,
            },
          }),
        )
      )
        return true;
    }
  }
  return false;
}
function configuredModelRefsNeedCodex(params) {
  const refs = collectConfiguredModelRefs(params.cfg);
  let complete = true;
  for (const agentId of params.agentIds) {
    const selected = resolveEffectiveSelectedModelRefs({
      cfg: params.cfg,
      agentId,
    });
    complete &&= selected.complete;
    const primary = resolveDefaultModelForAgent({
      cfg: params.cfg,
      agentId,
      manifestPlugins: [],
    });
    const aliasIndex = buildModelAliasIndex({
      cfg: params.cfg,
      defaultProvider: primary.provider,
      manifestPlugins: [],
    });
    for (const ref of refs) {
      if (
        !configuredRefIsEffectiveForAgent({
          cfg: params.cfg,
          path: ref.path,
          value: ref.value,
          agentId,
          selectedModelRefs: selected.values,
        })
      )
        continue;
      const resolved = resolveModelRefFromString({
        cfg: params.cfg,
        raw: ref.value,
        defaultProvider: primary.provider,
        aliasIndex,
        allowManifestNormalization: false,
      });
      const route = resolved
        ? {
            provider: resolved.ref.provider,
            modelId: resolved.ref.model,
          }
        : void 0;
      if (
        route &&
        configuredModelRouteNeedsCodex({
          cfg: params.cfg,
          env: params.env,
          agentId,
          route,
        })
      )
        return {
          complete,
          needsCodex: true,
        };
    }
  }
  return {
    complete,
    needsCodex: false,
  };
}
function defaultOpenAiRouteNeedsCodex(cfg, env, agentIds) {
  return agentIds.some((agentId) => {
    const runtimeId = resolveModelRuntimePolicy({
      config: cfg,
      provider: OPENAI_PROVIDER_ID,
      agentId,
    }).policy?.id;
    return configuredRuntimeNeedsCodex({
      cfg,
      env,
      runtimeId,
    });
  });
}
function configNeedsCodexForOpenAi(cfg, env) {
  const agentIds = listAgentIds(cfg);
  const configuredRefs = configuredModelRefsNeedCodex({
    cfg,
    env,
    agentIds,
  });
  if (configuredRefs.needsCodex) return true;
  if (configuredProviderPoliciesNeedCodex(cfg, env, agentIds)) return true;
  return configuredRefs.complete ? false : defaultOpenAiRouteNeedsCodex(cfg, env, agentIds);
}
/** Suppresses missing Codex diagnostics when no effective OpenAI route selects it. */
function shouldSuppressMissingCodexPluginDiagnostics(cfg, env = process.env) {
  const entryEnabled = codexPluginEntryEnabled(cfg);
  if (entryEnabled === true) return false;
  return entryEnabled === false || !configNeedsCodexForOpenAi(cfg, env);
}
//#endregion
export {
  resolveSubagentConfiguredModelSelection as i,
  shouldSuppressMissingCodexPluginDiagnostics as n,
  resolveDefaultModelForAgent as r,
  configuredModelRouteNeedsCodex as t,
};
