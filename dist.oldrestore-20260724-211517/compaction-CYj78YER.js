import { a as resolveAgentDir } from "./agent-scope-config-DVIR1nBa.js";
import "./utils-DtcDeqWS.js";
import { y as resolveSessionAgentIds } from "./agent-scope-y9xQv_q1.js";
import { s as materializePreparedRuntimeModel } from "./credential-scoped-model-lT7pctV8.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import { r as applySecretRefHeaderSentinels } from "./model-auth-BWFdcEzF.js";
import {
  i as isCliRuntimeProvider,
  r as isCliRuntimeAliasForProvider,
} from "./model-runtime-aliases-DMpABeI4.js";
import { r as resolveModelAsync } from "./model-uG6W-_2M.js";
import {
  L as isDefaultAgentRuntimeId,
  i as isOpenAIProvider,
  z as normalizeOptionalAgentRuntimeId,
} from "./openai-routing-Cu28Ynzk.js";
import { t as resolveAgentHarnessPolicy } from "./policy-C704eijA.js";
import {
  r as prepareAgentRuntimeAuth,
  t as agentRuntimeAuthPlanMatchesTarget,
} from "./prepare-auth-CUDA42wQ.js";
import {
  d as unwrapModelHeaderSentinelsForProviderEgress,
  f as unwrapSecretSentinelsForProviderEgress,
} from "./provider-local-service-DLgcYp6u.js";
import {
  n as resolvePreparedRuntimeModelAuth,
  t as resolvePreparedRuntimeAuthAttempts,
} from "./resolve-auth-CsTY2ugu.js";
import {
  o as selectAgentHarness,
  s as selectAgentHarnessForPreparedModelProviders,
} from "./selection-B2JBt0RT.js";
import { c as parseAgentSessionKey } from "./session-key-utils-B8sNp9l4.js";
import {
  i as ensureAuthProfileStore,
  o as ensureAuthProfileStoreWithoutExternalProfiles,
} from "./store-B7DoDdVM.js";
import {
  o as resolveAgentHarnessPreparedAuthSupport,
  s as resolveAgentHarnessPreparedRouteSupport,
} from "./thinking-runtime-D675lyzz.js";
//#region src/agents/harness/compaction-recovery.ts
/** Returns whether a native harness failure reason indicates a recoverable binding issue. */
function isRecoverableNativeHarnessBindingReason(reason) {
  if (typeof reason !== "string") return false;
  const normalized = reason.trim().toLowerCase();
  return (
    normalized === "missing_thread_binding" ||
    normalized === "stale_thread_binding" ||
    normalized.includes("thread not found") ||
    normalized.includes("no thread binding")
  );
}
/** Returns whether a compact result failed due to a recoverable native binding issue. */
function isRecoverableNativeHarnessBindingFailure(result) {
  return (
    result?.ok === false &&
    (isRecoverableNativeHarnessBindingReason(result.failure?.reason) ||
      isRecoverableNativeHarnessBindingReason(result.reason))
  );
}
//#endregion
//#region src/agents/harness/compaction.ts
/**
 * Routes compaction through selected native agent harnesses when supported.
 */
function runtimePlanRequiresHostApiKey(plan) {
  return plan?.modelRoute?.authRequirement === "api-key";
}
function resolveHarnessCompactIdentity(params) {
  const agentIds = resolveSessionAgentIds({
    sessionKey: params.sessionKey,
    config: params.config,
    agentId: params.agentId,
  });
  return {
    agentDir: params.agentDir ?? resolveAgentDir(params.config ?? {}, agentIds.sessionAgentId),
    agentId: params.agentId ?? agentIds.sessionAgentId,
  };
}
function stripHarnessOwnedAuthInputs(params) {
  const result = { ...params };
  delete result.resolvedApiKey;
  delete result.runtimeModel;
  return result;
}
function buildHarnessCompactionModelProvider(params) {
  const route = params.plan?.modelRoute;
  return {
    api: route?.api ?? params.model?.api,
    baseUrl: route?.baseUrl ?? params.model?.baseUrl,
    ...resolveAgentHarnessPreparedRouteSupport(params.plan),
    ...(params.plan
      ? {
          preparedAuth: resolveAgentHarnessPreparedAuthSupport({
            plan: params.plan,
            source: params.attempt?.kind === "implicit" ? void 0 : params.attempt?.kind,
          }),
        }
      : {}),
  };
}
async function resolveHarnessCompactApiKey(params) {
  const { agentDir, compactParams, initialHarness } = params;
  if (!compactParams.provider?.trim() || !compactParams.model?.trim()) {
    const existing = compactParams.resolvedApiKey?.trim();
    return existing
      ? {
          harness: initialHarness,
          apiKey: existing,
        }
      : { harness: initialHarness };
  }
  const provider = compactParams.provider;
  const modelId = compactParams.model;
  const providedRuntimeAuthPlan = compactParams.runtimeAuthPlan ?? compactParams.runtimePlan?.auth;
  const reusableRuntimeAuthPlan =
    providedRuntimeAuthPlan &&
    agentRuntimeAuthPlanMatchesTarget(providedRuntimeAuthPlan, {
      provider,
      modelId,
    })
      ? providedRuntimeAuthPlan
      : void 0;
  const workspaceDir = resolveUserPath(compactParams.workspaceDir);
  const callerRuntimeModel = compactParams.runtimeModel;
  const fallbackResolution = (harness, runtimeModel, runtimeAuthPlan) => {
    if (harness.authBootstrap === "harness" && !runtimeAuthPlan)
      throw new Error(
        `Unable to prepare a route-locked native compaction attempt for ${provider}/${modelId}; refusing harness-owned ambient auth.`,
      );
    const apiKey = compactParams.resolvedApiKey?.trim() || void 0;
    return {
      harness,
      ...(apiKey ? { apiKey } : {}),
      ...(runtimeModel ? { runtimeModel } : {}),
      ...(runtimeAuthPlan ? { runtimeAuthPlan } : {}),
    };
  };
  const selectPreparedHarness = (attempts, preparedModel) =>
    selectAgentHarnessForPreparedModelProviders({
      provider,
      modelId,
      modelProviders: attempts.map((attempt) =>
        buildHarnessCompactionModelProvider({
          model: preparedModel,
          plan: attempt.plan,
          attempt,
        }),
      ),
      config: compactParams.config,
      agentId: params.agentId,
      sessionKey: params.sessionKey,
      agentHarnessId: params.pinnedHarnessId,
    });
  if (reusableRuntimeAuthPlan) {
    const reusableHarness = selectPreparedHarness(
      [
        {
          kind: "implicit",
          plan: reusableRuntimeAuthPlan,
        },
      ],
      callerRuntimeModel,
    );
    if (
      (reusableHarness.authBootstrap === "harness" ||
        reusableRuntimeAuthPlan.harnessAuthProvider) &&
      !runtimePlanRequiresHostApiKey(reusableRuntimeAuthPlan)
    )
      return fallbackResolution(reusableHarness, callerRuntimeModel, reusableRuntimeAuthPlan);
  }
  const resolvePreparedModel = ({ config, authProfileId: profileId, authProfileMode }) =>
    resolveModelAsync(provider, modelId, agentDir, config, {
      authProfileId: profileId,
      authProfileMode,
      skipAgentDiscovery: true,
      allowBundledStaticCatalogFallback: true,
      preferBundledStaticCatalogTransport: true,
      workspaceDir,
    });
  let model = callerRuntimeModel;
  if (!model)
    try {
      model = (
        await resolveModelAsync(provider, modelId, agentDir, compactParams.config, {
          authProfileId:
            reusableRuntimeAuthPlan?.forwardedAuthProfileId ??
            compactParams.authProfileId?.trim() ??
            void 0,
          workspaceDir,
        })
      ).model;
    } catch {
      return fallbackResolution(initialHarness);
    }
  if (!model) return fallbackResolution(initialHarness);
  const runtimeAuthProfileStore = isOpenAIProvider(provider)
    ? ensureAuthProfileStore(agentDir, {
        externalCliProviderIds: ["openai"],
        allowKeychainPrompt: false,
      })
    : ensureAuthProfileStoreWithoutExternalProfiles(agentDir, { allowKeychainPrompt: false });
  const prepareRuntimeAuth = (harness) =>
    prepareAgentRuntimeAuth({
      provider,
      modelId,
      modelApi: model.api,
      modelBaseUrl: model.baseUrl,
      config: compactParams.config,
      env: process.env,
      agentDir,
      workspaceDir,
      authProfileStore: runtimeAuthProfileStore,
      sessionAuthProfileId: compactParams.authProfileId,
      sessionAuthProfileSource: compactParams.authProfileIdSource,
      harnessId: harness.id,
      harnessRuntime: harness.id,
      harnessAuthBootstrap: harness.authBootstrap,
    });
  let preparation;
  if (reusableRuntimeAuthPlan)
    preparation = {
      plan: reusableRuntimeAuthPlan,
      attempts: [
        {
          kind: "implicit",
          plan: reusableRuntimeAuthPlan,
        },
      ],
    };
  else
    try {
      preparation = prepareRuntimeAuth(initialHarness);
    } catch {
      return fallbackResolution(initialHarness, model);
    }
  let harness = params.pinnedHarnessId
    ? initialHarness
    : selectPreparedHarness(preparation.attempts, model);
  if (!params.pinnedHarnessId && !reusableRuntimeAuthPlan && harness.id !== initialHarness.id) {
    try {
      preparation = prepareRuntimeAuth(harness);
    } catch {
      return fallbackResolution(harness, model);
    }
    const confirmedHarness = selectPreparedHarness(preparation.attempts, model);
    if (confirmedHarness.id !== harness.id)
      throw new Error(
        `Prepared native compaction auth routes did not converge on one agent harness for ${provider}/${modelId}.`,
      );
    harness = confirmedHarness;
  }
  const materializeModel = async (input) => {
    const materialized = await materializePreparedRuntimeModel({
      plan: input.plan,
      provider,
      modelId,
      config: compactParams.config,
      model: input.model,
      forceResolve: input.forceResolve,
      rejectMismatchedModel: true,
      resolveModel: resolvePreparedModel,
    });
    if (!materialized)
      throw new Error(`Unable to materialize ${provider}/${modelId} for native compaction.`);
    return applySecretRefHeaderSentinels(materialized, compactParams.config);
  };
  let resolved;
  try {
    resolved = await resolvePreparedRuntimeAuthAttempts({
      attempts: preparation.attempts,
      store: runtimeAuthProfileStore,
      modelId,
      model,
      materializeModel,
      resolveAuth: async ({ attempt, model: attemptModel }) => {
        if (
          (harness.authBootstrap === "harness" || attempt.plan.harnessAuthProvider) &&
          !runtimePlanRequiresHostApiKey(attempt.plan)
        )
          return {
            plan: attempt.plan,
            auth: {},
          };
        const existing =
          attempt.plan.forwardedAuthProfileSource === "auto" &&
          Boolean(
            attempt.plan.forwardedAuthProfileId ||
            attempt.plan.forwardedAuthProfileCandidateIds?.length,
          )
            ? void 0
            : compactParams.resolvedApiKey?.trim();
        if (existing)
          return {
            plan: attempt.plan,
            auth: { apiKey: existing },
          };
        const auth = await resolvePreparedRuntimeModelAuth({
          plan: attempt.plan,
          model: attemptModel,
          cfg: compactParams.config,
          store: runtimeAuthProfileStore,
          agentDir,
          workspaceDir,
          ...(attempt.allowAuthProfileFallback !== void 0
            ? { allowAuthProfileFallback: attempt.allowAuthProfileFallback }
            : {}),
          secretSentinels: true,
        });
        return {
          plan: auth.plan,
          auth: { apiKey: auth.auth.apiKey?.trim() || void 0 },
        };
      },
      errorMessage: `Prepared native compaction auth attempts could not be resolved for ${provider}/${modelId}.`,
    });
  } catch {
    return fallbackResolution(harness, model, preparation.plan);
  }
  return {
    harness,
    apiKey: resolved.auth.apiKey,
    runtimeModel: resolved.model,
    runtimeAuthPlan: resolved.plan,
  };
}
/** Runs harness-provided compaction when the selected runtime supports it. */
async function maybeCompactAgentHarnessSession(params, options = {}) {
  const selectedRuntime = normalizeOptionalAgentRuntimeId(params.agentHarnessId);
  const pinnedHarnessId =
    selectedRuntime && !isDefaultAgentRuntimeId(selectedRuntime) ? selectedRuntime : void 0;
  if (
    !pinnedHarnessId &&
    params.provider &&
    isCliRuntimeProvider(params.provider, { config: params.config })
  )
    return;
  const runtimePolicySessionKey = params.sandboxSessionKey ?? params.sessionKey;
  const runtimePolicyAgentId =
    params.sandboxSessionKey && parseAgentSessionKey(params.sandboxSessionKey)
      ? void 0
      : params.agentId;
  const runtimeAuthPlan = params.runtimeAuthPlan ?? params.runtimePlan?.auth;
  const modelRoute = runtimeAuthPlan?.modelRoute;
  if (
    runtimeAuthPlan &&
    modelRoute &&
    (!params.provider ||
      !params.model ||
      !agentRuntimeAuthPlanMatchesTarget(runtimeAuthPlan, {
        provider: params.provider,
        modelId: params.model,
      }))
  )
    throw new Error(
      `Prepared runtime auth route ${modelRoute.provider}/${modelRoute.modelId} does not match the compaction target ${params.provider ?? "unknown"}/${params.model ?? "unknown"}.`,
    );
  const runtime = resolveAgentHarnessPolicy({
    provider: params.provider,
    modelId: params.model,
    config: params.config,
    agentId: runtimePolicyAgentId,
    sessionKey: runtimePolicySessionKey,
  }).runtime;
  if (
    isCliRuntimeAliasForProvider({
      runtime: pinnedHarnessId ?? runtime,
      provider: params.provider,
      cfg: params.config,
    })
  )
    return;
  const harnessSelectionParams = {
    provider: params.provider ?? "",
    modelId: params.model,
    config: params.config,
    agentId: runtimePolicyAgentId,
    sessionKey: runtimePolicySessionKey,
    agentHarnessId: pinnedHarnessId,
  };
  let harness = runtimeAuthPlan
    ? selectAgentHarnessForPreparedModelProviders({
        ...harnessSelectionParams,
        modelProviders: [
          buildHarnessCompactionModelProvider({
            model: params.runtimeModel,
            plan: runtimeAuthPlan,
          }),
        ],
      })
    : selectAgentHarness(harnessSelectionParams);
  const initialInternalHarness = harness;
  if (
    options.nativeCompactionRequest === "after_context_engine" &&
    !initialInternalHarness.compactAfterContextEngine
  )
    return;
  if (!options.nativeCompactionRequest && !harness.compact) {
    if (harness.id !== "openclaw")
      return {
        ok: false,
        compacted: false,
        reason: `Agent harness "${harness.id}" does not support compaction.`,
        failure: { reason: "unsupported_harness_compaction" },
      };
    return;
  }
  const compactIdentity = resolveHarnessCompactIdentity(params);
  let resolvedRuntimeAuthPlan = runtimeAuthPlan;
  const compactParams = {
    ...params,
    agentDir: compactIdentity.agentDir,
    agentId: compactIdentity.agentId,
    ...(resolvedRuntimeAuthPlan
      ? {
          runtimeAuthPlan: resolvedRuntimeAuthPlan,
          ...(params.runtimePlan
            ? {
                runtimePlan: {
                  ...params.runtimePlan,
                  auth: resolvedRuntimeAuthPlan,
                },
              }
            : {}),
        }
      : {}),
  };
  const resolved = await resolveHarnessCompactApiKey({
    agentDir: compactIdentity.agentDir,
    compactParams,
    initialHarness: harness,
    agentId: compactIdentity.agentId,
    sessionKey: runtimePolicySessionKey,
    pinnedHarnessId,
  });
  harness = resolved.harness;
  resolvedRuntimeAuthPlan = resolved.runtimeAuthPlan ?? resolvedRuntimeAuthPlan;
  const internalHarness = harness;
  const shouldCompactAfterContextEngine =
    options.nativeCompactionRequest === "after_context_engine";
  if (shouldCompactAfterContextEngine && !internalHarness.compactAfterContextEngine) return;
  if (!options.nativeCompactionRequest && !harness.compact) {
    if (harness.id !== "openclaw")
      return {
        ok: false,
        compacted: false,
        reason: `Agent harness "${harness.id}" does not support compaction.`,
        failure: { reason: "unsupported_harness_compaction" },
      };
    return;
  }
  const harnessOwnsAuth =
    harness.authBootstrap === "harness" && !runtimePlanRequiresHostApiKey(resolvedRuntimeAuthPlan);
  const resolvedApiKey = harnessOwnsAuth ? void 0 : resolved.apiKey;
  const runtimeModel = resolved.runtimeModel;
  const compactParamsWithResolvedAuth = resolvedRuntimeAuthPlan
    ? {
        ...compactParams,
        authProfileId: resolvedRuntimeAuthPlan.forwardedAuthProfileId,
        authProfileIdSource: resolvedRuntimeAuthPlan.forwardedAuthProfileSource,
        runtimeAuthPlan: resolvedRuntimeAuthPlan,
        ...(compactParams.runtimePlan
          ? {
              runtimePlan: {
                ...compactParams.runtimePlan,
                auth: resolvedRuntimeAuthPlan,
              },
            }
          : {}),
      }
    : compactParams;
  const handoffCompactParams = harnessOwnsAuth
    ? stripHarnessOwnedAuthInputs(compactParamsWithResolvedAuth)
    : compactParamsWithResolvedAuth;
  const resolvedCompactParams =
    resolvedApiKey || runtimeModel
      ? {
          ...handoffCompactParams,
          ...(resolvedApiKey
            ? {
                resolvedApiKey: unwrapSecretSentinelsForProviderEgress(
                  resolvedApiKey,
                  "plugin harness compaction handoff",
                ),
              }
            : {}),
          ...(runtimeModel
            ? {
                runtimeModel: unwrapModelHeaderSentinelsForProviderEgress(
                  runtimeModel,
                  "plugin harness compaction handoff",
                ),
              }
            : {}),
        }
      : handoffCompactParams;
  if (shouldCompactAfterContextEngine)
    return internalHarness.compactAfterContextEngine?.(resolvedCompactParams);
  return harness.compact?.(resolvedCompactParams);
}
//#endregion
export { isRecoverableNativeHarnessBindingFailure as n, maybeCompactAgentHarnessSession as t };
