import { isDeepStrictEqual } from "node:util";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import {
  n as resolveCliExecutionAuthProfileId,
  t as cliBackendAcceptsAuthProfileForwarding,
} from "./cli-execution-auth-DACbF1SS.js";
import { r as normalizeProviderId } from "./provider-id-BIcU_2-A.js";
//#region src/crestodian/inference-route.ts
const CRESTODIAN_EXECUTION_AGENT_ID = "crestodian";
function projectCrestodianExecutionConfig(config, routeAgentId) {
  const agents = config.agents?.list;
  if (!agents) return config;
  const routeAgent =
    routeAgentId === CRESTODIAN_EXECUTION_AGENT_ID
      ? void 0
      : agents.find((agent) => normalizeAgentId(agent.id) === routeAgentId);
  const retainedAgents = agents.filter(
    (agent) => normalizeAgentId(agent.id) !== CRESTODIAN_EXECUTION_AGENT_ID,
  );
  const hasProjectedSettings = routeAgent?.params !== void 0 || routeAgent?.tools !== void 0;
  if (retainedAgents.length === agents.length && !hasProjectedSettings) return config;
  return {
    ...config,
    agents: {
      ...config.agents,
      list: [
        ...retainedAgents,
        ...(hasProjectedSettings
          ? [
              {
                id: CRESTODIAN_EXECUTION_AGENT_ID,
                ...(routeAgent?.params !== void 0
                  ? { params: structuredClone(routeAgent.params) }
                  : {}),
                ...(routeAgent?.tools !== void 0
                  ? { tools: structuredClone(routeAgent.tools) }
                  : {}),
              },
            ]
          : []),
      ],
    },
  };
}
async function resolveCrestodianConfiguredRouteFromConfig(runConfig) {
  const [agentScope, modelSelection, modelRuntimeAliases, simpleCompletion, harnessPolicy] =
    await Promise.all([
      import("./agent-scope-DfhU1PO5.js"),
      import("./model-selection-Dc7njIe_.js"),
      import("./model-runtime-aliases-DRx7mbl7.js"),
      import("./simple-completion-runtime-Bl4JrIHv.js"),
      import("./policy-xgu0BNRZ.js"),
    ]);
  const modelOwnerAgentId = agentScope.resolveDefaultAgentId(runConfig);
  if (!agentScope.resolveAgentEffectiveModelPrimary(runConfig, modelOwnerAgentId)) return null;
  const selection = simpleCompletion.resolveSimpleCompletionSelectionForAgent({
    cfg: runConfig,
    agentId: modelOwnerAgentId,
  });
  if (!selection) return null;
  const executionProvider =
    modelRuntimeAliases.resolveCliRuntimeExecutionProvider({
      provider: selection.provider,
      cfg: runConfig,
      agentId: modelOwnerAgentId,
      modelId: selection.modelId,
      ...(selection.profileId ? { authProfileId: selection.profileId } : {}),
    }) ??
    selection.runtimeProvider ??
    selection.provider;
  const isCliRoute = modelSelection.isCliProvider(executionProvider, runConfig);
  const allowCliAuthProfileForwarding =
    isCliRoute &&
    cliBackendAcceptsAuthProfileForwarding({
      provider: executionProvider,
      config: runConfig,
      agentId: modelOwnerAgentId,
    });
  const cliAuthProfileId = allowCliAuthProfileForwarding
    ? resolveCliExecutionAuthProfileId({
        cliExecutionProvider: executionProvider,
        authProfileProvider: selection.provider,
        config: runConfig,
        agentDir: selection.agentDir,
        ...(selection.profileId
          ? {
              selected: {
                authProfileId: selection.profileId,
                authProfileIdSource: "user",
              },
            }
          : {}),
      })
    : void 0;
  const authProfileId = allowCliAuthProfileForwarding ? cliAuthProfileId : selection.profileId;
  const base = {
    runConfig: projectCrestodianExecutionConfig(runConfig, modelOwnerAgentId),
    modelLabel: `${selection.provider}/${selection.modelId}`,
    provider: executionProvider,
    model: selection.modelId,
    agentDir: selection.agentDir,
    agentId: modelOwnerAgentId,
    ...(authProfileId ? { authProfileId } : {}),
  };
  if (isCliRoute)
    return {
      runner: "cli",
      ...base,
    };
  return {
    runner: "embedded",
    agentHarnessRuntimeOverride: harnessPolicy.resolveAgentHarnessPolicy({
      config: runConfig,
      agentId: modelOwnerAgentId,
      provider: selection.provider,
      modelId: selection.modelId,
    }).runtime,
    ...base,
  };
}
function projectRelevantModelMap(params) {
  if (!params.models) return;
  const relevant = Object.fromEntries(
    Object.entries(params.models).filter(([key, entry]) => {
      const slash = key.indexOf("/");
      const provider = slash > 0 ? normalizeProviderId(key.slice(0, slash)) : "";
      const model = slash > 0 ? key.slice(slash + 1) : key;
      return (
        (params.providerIds.has(provider) &&
          (model === params.modelId || model === "*" || key === params.rawModel)) ||
        entry.alias?.trim() === params.rawModel
      );
    }),
  );
  return Object.keys(relevant).length > 0 ? relevant : void 0;
}
/** Project every config input that can change the configured default-agent route. */
async function projectDefaultInferenceRoute(config) {
  const [{ resolveDefaultAgentId }, { resolveProviderIdForAuth }] = await Promise.all([
    import("./agent-scope-DfhU1PO5.js"),
    import("./provider-auth-aliases-BMY9SjIJ.js"),
  ]);
  const defaultAgentId = resolveDefaultAgentId(config);
  const route = await resolveCrestodianConfiguredRouteFromConfig(config);
  const list = config.agents?.list ?? [];
  const agent = list.find((entry) => normalizeAgentId(entry.id) === defaultAgentId);
  const executionAgent = route?.runConfig.agents?.list?.find(
    (entry) => normalizeAgentId(entry.id) === CRESTODIAN_EXECUTION_AGENT_ID,
  );
  const defaults = config.agents?.defaults;
  const logicalProvider = normalizeProviderId(route?.modelLabel.split("/", 1)[0] ?? "");
  const providerIds = new Set(
    [logicalProvider, normalizeProviderId(route?.provider ?? "")].filter(Boolean),
  );
  const authProviderIds = new Set(
    [...providerIds].map((provider) => resolveProviderIdForAuth(provider, { config })),
  );
  const authProfiles = Object.fromEntries(
    Object.entries(config.auth?.profiles ?? {}).filter(([, profile]) =>
      authProviderIds.has(resolveProviderIdForAuth(profile.provider, { config })),
    ),
  );
  const authOrder = Object.fromEntries(
    Object.entries(config.auth?.order ?? {}).filter(([provider]) =>
      authProviderIds.has(resolveProviderIdForAuth(provider, { config })),
    ),
  );
  const modelProviders = Object.fromEntries(
    Object.entries(config.models?.providers ?? {})
      .filter(([provider]) => providerIds.has(normalizeProviderId(provider)))
      .map(([provider, providerConfig]) => [provider, structuredClone(providerConfig)]),
  );
  const rawModel =
    typeof agent?.model === "string"
      ? agent.model
      : agent?.model?.primary ||
        (typeof defaults?.model === "string" ? defaults.model : defaults?.model?.primary);
  let projectedRoute = null;
  if (route) {
    const { runConfig: _runConfig, ...routeWithoutConfig } = route;
    projectedRoute = routeWithoutConfig;
  }
  const explicitDefaultIds = list
    .filter((entry) => entry.default)
    .map((entry) => normalizeAgentId(entry.id));
  return {
    route: projectedRoute,
    defaultSelection: {
      explicitIds: explicitDefaultIds,
      ...(explicitDefaultIds.length === 0 && list[0]?.id
        ? { fallbackId: normalizeAgentId(list[0].id) }
        : {}),
    },
    auth: {
      profiles: authProfiles,
      order: authOrder,
      cooldowns: structuredClone(config.auth?.cooldowns),
    },
    models: {
      mode: config.models?.mode,
      providers: modelProviders,
    },
    defaults: {
      model: structuredClone(defaults?.model),
      params: structuredClone(defaults?.params),
      models: projectRelevantModelMap({
        models: defaults?.models,
        providerIds,
        modelId: route?.model,
        rawModel,
      }),
      agentRuntime: structuredClone(defaults?.agentRuntime),
      cliBackends: Object.fromEntries(
        Object.entries(defaults?.cliBackends ?? {}).filter(([provider]) =>
          providerIds.has(normalizeProviderId(provider)),
        ),
      ),
    },
    ...(agent
      ? {
          agent: {
            id: normalizeAgentId(agent.id),
            agentDir: agent.agentDir,
            model: structuredClone(agent.model),
            params: structuredClone(agent.params),
            tools: structuredClone(agent.tools),
            models: projectRelevantModelMap({
              models: agent.models,
              providerIds,
              modelId: route?.model,
              rawModel,
            }),
            agentRuntime: structuredClone(agent.agentRuntime),
          },
        }
      : {}),
    ...(executionAgent
      ? {
          executionAgent: {
            id: CRESTODIAN_EXECUTION_AGENT_ID,
            params: structuredClone(executionAgent.params),
            tools: structuredClone(executionAgent.tools),
          },
        }
      : {}),
    env: structuredClone(config.env),
    secrets: structuredClone(config.secrets),
    plugins: structuredClone(config.plugins),
    tools: structuredClone(config.tools),
  };
}
function sameDefaultInferenceRoute(left, right) {
  return isDeepStrictEqual(left, right);
}
//#endregion
export {
  resolveCrestodianConfiguredRouteFromConfig as n,
  sameDefaultInferenceRoute as r,
  projectDefaultInferenceRoute as t,
};
