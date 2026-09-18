import {
  A as resolveMergedModelProviderConfig,
  M as resolveModelProviderRouteOverridePresence,
  N as hasModelExtraParams,
  _ as canonicalizeProviderModelId,
  j as resolveMergedModelProviderModels,
  k as resolveProviderModelRoutes,
} from "./openai-routing-Cu28Ynzk.js";
import { t as resolveAgentHarnessPolicy } from "./policy-C704eijA.js";
import { r as normalizeProviderId } from "./provider-id-BIcU_2-A.js";
import { i as listRegisteredAgentHarnesses } from "./registry-ef8V3P8D.js";
import { d as resolveAgentIdFromSessionKey } from "./session-key-druuY-GG.js";
import { r as resolveSessionRuntimeOverrideForProvider } from "./session-runtime-compat-DgCFENjt.js";
import {
  n as isThinkingLevelSupported,
  o as resolveSupportedThinkingLevel,
} from "./thinking-CVcRbjTC.js";
//#region src/agents/harness/support.ts
/** Projects one prepared auth attempt into a secret-free native-runtime support fact. */
function resolveAgentHarnessPreparedAuthSupport(params) {
  const plan = params.plan;
  if (!plan) return;
  return {
    source:
      params.source ??
      (plan.forwardedAuthProfileId
        ? "profile"
        : plan.selectedAuthMode
          ? "direct"
          : plan.harnessAuthProvider
            ? "harness"
            : "none"),
    ...(plan.selectedAuthMode ? { mode: plan.selectedAuthMode } : {}),
    ...(plan.modelRoute ? { requirement: plan.modelRoute.authRequirement } : {}),
  };
}
/** Projects the concrete or deferred prepared route into native-runtime support facts. */
function resolveAgentHarnessPreparedRouteSupport(plan) {
  const support = plan?.modelRoute ?? plan?.deferredRouteSupport;
  return support
    ? {
        requestTransportOverrides: support.requestTransportOverrides,
        runtimePolicy: support.runtimePolicy,
      }
    : {};
}
/** Builds the provider/model facts passed to registered harness support probes. */
function buildAgentHarnessSupportContext(params) {
  const providerConfig = resolveMergedModelProviderConfig(params.config, params.provider);
  const modelId = params.modelId ? normalizeModelId(params.provider, params.modelId) : void 0;
  const modelConfig = modelId
    ? resolveMergedModelProviderModels({
        models: providerConfig?.models,
        normalizeModelId: (configuredModelId) =>
          normalizeModelId(params.provider, configuredModelId),
      }).get(modelId)
    : void 0;
  const agentId =
    params.agentId ??
    (params.sessionKey ? resolveAgentIdFromSessionKey(params.sessionKey) : void 0);
  const hasConfiguredParams = hasModelExtraParams({
    config: params.config,
    provider: params.provider,
    modelId: params.modelId,
    agentId,
  });
  const configuredModelProvider = providerConfig
    ? {
        api: modelConfig?.api ?? providerConfig.api ?? "openai-responses",
        baseUrl: modelConfig?.baseUrl ?? providerConfig.baseUrl,
        azureApiVersion: readStringParam(
          modelConfig?.params?.azureApiVersion ?? providerConfig.params?.azureApiVersion,
        ),
        request: providerConfig.request,
        requestTransportOverrides: resolveModelProviderRouteOverridePresence({
          provider: params.provider,
          modelId: params.modelId,
          config: params.config,
          canonicalizeModelId: (configuredModelId) =>
            canonicalizeProviderModelId(params.provider, configuredModelId),
        }),
      }
    : void 0;
  const requestTransportOverrides =
    params.modelProvider?.requestTransportOverrides === "present" ||
    configuredModelProvider?.requestTransportOverrides === "present" ||
    hasConfiguredParams
      ? "present"
      : "none";
  const modelProviderFacts =
    params.modelProvider || configuredModelProvider || hasConfiguredParams
      ? {
          api: params.modelProvider?.api ?? configuredModelProvider?.api,
          baseUrl: params.modelProvider?.baseUrl ?? configuredModelProvider?.baseUrl,
          azureApiVersion:
            params.modelProvider?.azureApiVersion ?? configuredModelProvider?.azureApiVersion,
          request: params.modelProvider?.request ?? configuredModelProvider?.request,
          preparedAuth: params.modelProvider?.preparedAuth,
          requestTransportOverrides,
        }
      : void 0;
  const routeRuntimeContract = params.modelProvider?.runtimePolicy
    ? {
        owned: true,
        policy: params.modelProvider.runtimePolicy,
      }
    : params.preparedModelProvider
      ? { owned: true }
      : resolveHarnessRouteRuntimePolicy({
          provider: params.provider,
          modelId: params.modelId,
          modelProvider: modelProviderFacts,
          config: params.config,
        });
  const modelProvider =
    modelProviderFacts || routeRuntimeContract.owned
      ? {
          ...modelProviderFacts,
          runtimePolicy: params.modelProvider?.runtimePolicy ?? routeRuntimeContract.policy,
        }
      : void 0;
  return {
    provider: params.provider,
    modelId: params.modelId,
    modelProvider,
    requestedRuntime: params.requestedRuntime,
    ...(params.providerOwnership
      ? {
          providerOwnerStatus: params.providerOwnership.status,
          providerOwnerPluginIds:
            params.providerOwnership.status === "unowned" ? [] : params.providerOwnership.pluginIds,
        }
      : {}),
  };
}
function resolveHarnessRouteRuntimePolicy(params) {
  const resolution = resolveProviderModelRoutes({
    provider: params.provider,
    modelId: params.modelId,
    api: params.modelProvider?.api,
    baseUrl: params.modelProvider?.baseUrl,
    config: params.config,
    requestTransportOverrides: params.modelProvider?.requestTransportOverrides,
  });
  if (!resolution) return { owned: false };
  if (resolution.kind !== "routes") return { owned: true };
  const policies = resolution.routes.map((route) => route.runtimePolicy);
  const first = policies[0];
  if (!first || policies.some((policy) => !policy)) return { owned: true };
  return {
    owned: true,
    policy: {
      compatibleIds: first.compatibleIds.filter(
        (id, index, ids) =>
          ids.indexOf(id) === index &&
          policies.every((policy) => policy?.compatibleIds.includes(id)),
      ),
    },
  };
}
/** Resolves the registered plugin harness that auto selection would choose. */
function resolveAutoAgentHarnessId(params) {
  const supportContext = buildAgentHarnessSupportContext({
    ...params,
    requestedRuntime: "auto",
  });
  return listRegisteredAgentHarnesses()
    .map(({ harness }) => ({
      harness,
      support: harness.supports(supportContext),
    }))
    .filter(isSupportedHarness)
    .toSorted(compareHarnessSupport)[0]?.harness.id;
}
function compareHarnessSupport(left, right) {
  const priorityDelta = (right.support.priority ?? 0) - (left.support.priority ?? 0);
  return priorityDelta !== 0 ? priorityDelta : left.harness.id.localeCompare(right.harness.id);
}
function isSupportedHarness(entry) {
  return entry.support.supported;
}
function readStringParam(value) {
  return typeof value === "string" && value.trim() ? value.trim() : void 0;
}
function normalizeModelId(provider, modelId) {
  const trimmed = modelId.trim();
  const slashIndex = trimmed.indexOf("/");
  return canonicalizeProviderModelId(
    provider,
    slashIndex > 0 &&
      normalizeProviderId(trimmed.slice(0, slashIndex)) === normalizeProviderId(provider)
      ? trimmed.slice(slashIndex + 1).trim()
      : trimmed,
  );
}
//#endregion
//#region src/agents/thinking-runtime.ts
/** Convert residual auto policy into the built-in fallback when no registry selection is needed. */
function concretizeAgentRuntime(runtime) {
  return runtime === "auto" ? "openclaw" : runtime;
}
/** Resolves an explicit session override before configured model/provider policy. */
function resolveEffectiveAgentRuntime(params) {
  const runtime =
    resolveSessionRuntimeOverrideForProvider({
      provider: params.provider,
      entry: params.sessionEntry,
      cfg: params.cfg,
    }) ??
    resolveAgentHarnessPolicy({
      provider: params.provider,
      modelId: params.modelId,
      config: params.cfg,
      agentId: params.agentId,
      sessionKey: params.sessionKey,
    }).runtime;
  if (runtime === "auto")
    return (
      resolveAutoAgentHarnessId({
        provider: params.provider,
        modelId: params.modelId,
        config: params.cfg,
      }) ?? "openclaw"
    );
  return concretizeAgentRuntime(runtime);
}
/** Revalidates a turn-local thinking level after fallback selects its actual model/runtime. */
function resolveCandidateThinkingLevel(params) {
  if (!params.level) return;
  const concreteRuntime = params.agentRuntime?.trim().toLowerCase();
  const agentRuntime =
    concreteRuntime && concreteRuntime !== "auto" && concreteRuntime !== "default"
      ? concreteRuntime
      : resolveEffectiveAgentRuntime({
          cfg: params.cfg ?? {},
          provider: params.provider,
          modelId: params.modelId,
          agentId: params.agentId,
          sessionKey: params.sessionKey,
          sessionEntry: params.sessionEntry,
        });
  const policy = {
    provider: params.provider,
    model: params.modelId,
    level: params.level,
    catalog: params.catalog,
    agentRuntime,
  };
  return isThinkingLevelSupported(policy) ? params.level : resolveSupportedThinkingLevel(policy);
}
//#endregion
export {
  compareHarnessSupport as a,
  buildAgentHarnessSupportContext as i,
  resolveCandidateThinkingLevel as n,
  resolveAgentHarnessPreparedAuthSupport as o,
  resolveEffectiveAgentRuntime as r,
  resolveAgentHarnessPreparedRouteSupport as s,
  concretizeAgentRuntime as t,
};
