import {
  C as resolveProviderModelRouteMaterializationAuthMode,
  S as resolveProviderModelRouteAuthRequirement,
  _ as canonicalizeProviderModelId,
  v as modelMatchesProviderModelRoute,
  x as resolveProviderModelMaterializationAuthMode,
  y as projectProviderModelRouteConfig,
} from "./openai-routing-Cu28Ynzk.js";
import { t as agentRuntimeAuthPlanMatchesTarget } from "./prepare-auth-CUDA42wQ.js";
import { r as normalizeProviderId } from "./provider-id-BIcU_2-A.js";
import { H as shouldPreferProviderRuntimeResolvedModel } from "./provider-runtime-DyIHJ2cX.js";
//#region src/agents/runtime-plan/materialize-model.ts
function modelMatchesPreparedTarget(params) {
  const modelId = canonicalizeProviderModelId(params.provider, params.model.id ?? "");
  const targetModelId = canonicalizeProviderModelId(params.provider, params.modelId);
  return (
    normalizeProviderId(params.model.provider ?? "") === normalizeProviderId(params.provider) &&
    modelId === targetModelId &&
    modelMatchesProviderModelRoute({
      provider: params.provider,
      api: params.model.api,
      baseUrl: params.model.baseUrl,
      route: params.route,
    })
  );
}
/** Resolves the exact model tuple selected by a prepared runtime auth plan. */
async function materializePreparedRuntimeModel(params) {
  const route = params.plan.modelRoute;
  if (!route && !params.forceResolve) return params.model;
  if (
    route &&
    (normalizeProviderId(route.provider) !== normalizeProviderId(params.provider) ||
      canonicalizeProviderModelId(route.provider, route.modelId) !==
        canonicalizeProviderModelId(params.provider, params.modelId))
  )
    throw new Error(
      `Prepared runtime auth route ${route.provider}/${route.modelId} does not match target ${params.provider}/${params.modelId}.`,
    );
  const callerModelMatches =
    params.model !== void 0 &&
    normalizeProviderId(params.model.provider ?? "") === normalizeProviderId(params.provider) &&
    canonicalizeProviderModelId(params.provider, params.model.id ?? "") ===
      canonicalizeProviderModelId(params.provider, params.modelId) &&
    (!route ||
      modelMatchesPreparedTarget({
        model: params.model,
        provider: params.provider,
        modelId: params.modelId,
        route,
      }));
  if (callerModelMatches && !params.forceResolve) return params.model;
  if (params.model && !callerModelMatches && params.rejectMismatchedModel)
    throw new Error(
      route
        ? `Caller-provided ${params.provider}/${params.modelId} metadata does not match its prepared ${route.authRequirement} route.`
        : `Caller-provided model metadata does not match ${params.provider}/${params.modelId}.`,
    );
  const resolved = await params.resolveModel({
    config: route
      ? projectProviderModelRouteConfig({
          provider: params.provider,
          config: params.config,
          route,
        })
      : (params.config ?? {}),
    authProfileId: params.plan.forwardedAuthProfileId,
    authProfileMode: route
      ? resolveProviderModelRouteMaterializationAuthMode({
          mode: params.plan.selectedAuthMode,
          requirement: route.authRequirement,
        })
      : resolveProviderModelMaterializationAuthMode(params.plan.selectedAuthMode),
  });
  if (
    !resolved.model ||
    normalizeProviderId(resolved.model.provider ?? "") !== normalizeProviderId(params.provider) ||
    canonicalizeProviderModelId(params.provider, resolved.model.id ?? "") !==
      canonicalizeProviderModelId(params.provider, params.modelId) ||
    (route &&
      !modelMatchesPreparedTarget({
        model: resolved.model,
        provider: params.provider,
        modelId: params.modelId,
        route,
      }))
  )
    throw new Error(
      resolved.error ??
        (route
          ? `Unable to materialize ${params.provider}/${params.modelId} for its prepared ${route.authRequirement} route.`
          : `Unable to rematerialize ${params.provider}/${params.modelId} for its resolved auth profile.`),
    );
  return resolved.model;
}
//#endregion
//#region src/agents/runtime-plan/credential-scoped-model.ts
function providerUsesCredentialScopedModelMetadata(params) {
  return shouldPreferProviderRuntimeResolvedModel({
    provider: params.provider,
    config: params.config,
    workspaceDir: params.workspaceDir,
    env: params.env ?? process.env,
    context: {
      config: params.config,
      agentDir: params.agentDir,
      workspaceDir: params.workspaceDir,
      provider: params.provider,
      modelId: params.modelId,
    },
  });
}
/** Reuses forwarded model auth only when the prepared plan owns the exact target. */
function resolveReusableRuntimeModelAuth(params) {
  const plan =
    params.plan &&
    agentRuntimeAuthPlanMatchesTarget(params.plan, {
      provider: params.provider,
      modelId: params.modelId,
    })
      ? params.plan
      : void 0;
  const authProfileId = params.authProfileId ?? plan?.forwardedAuthProfileId;
  const authProfileMode = resolveProviderModelMaterializationAuthMode(plan?.selectedAuthMode);
  return {
    plan,
    authProfileId,
    modelAuth:
      authProfileId !== void 0
        ? { authProfileId }
        : authProfileMode !== void 0
          ? { authProfileMode }
          : void 0,
  };
}
/** Direct auth after a profile attempt must drop credential-scoped model metadata. */
function shouldForceDirectAuthFallbackModelResolve(params) {
  return params.attempt.kind === "direct" && params.priorProfileAttempted;
}
/** Re-resolves when the selected profile or direct credential can change provider metadata. */
function shouldForceCredentialScopedModelResolve(
  plan,
  requestedProfileId,
  providerUsesProfileScopedModelMetadata = false,
) {
  return Boolean(
    plan.forwardedAuthProfileId ||
    requestedProfileId ||
    (providerUsesProfileScopedModelMetadata && plan.selectedAuthMode),
  );
}
/** Re-resolves metadata whenever the prepared credential can change provider limits. */
function shouldMaterializeAuthPlanModel(
  plan,
  requestedProfileId,
  providerUsesProfileScopedModelMetadata = false,
) {
  return Boolean(
    plan.modelRoute ||
    shouldForceCredentialScopedModelResolve(
      plan,
      requestedProfileId,
      providerUsesProfileScopedModelMetadata,
    ),
  );
}
function resolveCredentialScopedAuthAttemptModelDecision(params) {
  const forceResolve = shouldForceDirectAuthFallbackModelResolve(params);
  const shouldMaterialize =
    shouldMaterializeAuthPlanModel(
      params.attempt.plan,
      params.requestedProfileId,
      params.providerUsesProfileScopedModelMetadata,
    ) || forceResolve;
  return {
    forceResolve,
    shouldMaterialize,
    authRequirement:
      params.attempt.plan.modelRoute?.authRequirement ??
      (shouldMaterialize && params.providerUsesProfileScopedModelMetadata
        ? resolveProviderModelRouteAuthRequirement(params.attempt.plan.selectedAuthMode)
        : void 0),
  };
}
function hasPreparedAuthAttemptModelMetadata(params) {
  return params.attempts.some(
    (attempt) =>
      (params.providerUsesProfileScopedModelMetadata &&
        (attempt.kind === "profile" || Boolean(attempt.plan.forwardedAuthProfileId))) ||
      Boolean(attempt.plan.modelRoute) ||
      attempt.allowAuthProfileFallback !== void 0,
  );
}
function createPreparedRuntimeModelMaterializer(params) {
  const materializedRouteModels = /* @__PURE__ */ new WeakMap();
  const materializeUncached = async (plan, forceResolve = false) => {
    const model = params.getModel();
    if (params.nativeModelOwned) return model;
    return (
      (await materializePreparedRuntimeModel({
        plan,
        provider: params.provider,
        modelId: params.modelId,
        config: params.config,
        model,
        forceResolve:
          forceResolve ||
          shouldForceCredentialScopedModelResolve(
            plan,
            params.requestedProfileId,
            params.providerUsesProfileScopedModelMetadata,
          ),
        resolveModel: (request) => params.resolveModel(request),
      })) ?? model
    );
  };
  const materialize = (plan) => {
    if (!plan.modelRoute) return materializeUncached(plan);
    const cached = materializedRouteModels.get(plan);
    if (cached) return cached;
    const materialized = materializeUncached(plan);
    materializedRouteModels.set(plan, materialized);
    return materialized;
  };
  return {
    materialize,
    materializeUncached,
  };
}
//#endregion
export {
  resolveReusableRuntimeModelAuth as a,
  resolveCredentialScopedAuthAttemptModelDecision as i,
  hasPreparedAuthAttemptModelMetadata as n,
  shouldForceDirectAuthFallbackModelResolve as o,
  providerUsesCredentialScopedModelMetadata as r,
  materializePreparedRuntimeModel as s,
  createPreparedRuntimeModelMaterializer as t,
};
