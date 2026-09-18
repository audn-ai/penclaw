import { t as buildAgentRuntimeAuthPlan } from "./auth-6NjuyOV9.js";
import {
  _ as shouldPreferExplicitConfigApiKeyAuth,
  d as hasUsableCustomProviderApiKey,
  h as resolveProviderEntryApiKeyProfileReference,
} from "./model-auth-BWFdcEzF.js";
import { n as resolveProviderDirectAuthPlanningEvidence } from "./model-auth-env-DLe5znyS.js";
import {
  A as resolveMergedModelProviderConfig,
  E as buildProviderModelAuthSourcePlan,
  T as buildProviderModelAuthDirectSource,
  g as selectOpenAIModelRouteAuth,
  h as resolveOpenAIModelRoutes,
  w as selectProviderModelAuthSources,
} from "./openai-routing-Cu28Ynzk.js";
import {
  a as resolveAuthProfileOrderWithMetadata,
  r as resolveAuthProfileEligibility,
} from "./order-BNCpk81x.js";
import { r as resolveStoredCredentialReadOnlyAvailability } from "./read-only-availability-BluKl_Ub.js";
import { s as coerceSecretRef } from "./types.secrets-BV0ywRAy.js";
import { o as isProfileInCooldown } from "./usage-state-BQLO_Yob.js";
//#region src/agents/runtime-plan/prepare-auth.ts
/**
 * Prepares route-aware auth forwarding for auxiliary agent-runtime calls.
 * Callers supply an already loaded credential snapshot; this module never
 * resolves secrets or loads a provider runtime.
 */
/** Prevents a direct fallback from bypassing a prepared profile tier. */
function canRunPreparedAgentRuntimeAuthAttempt(params) {
  return (
    params.attempt.kind !== "direct" ||
    !params.attempt.requiresPriorProfileAttempt ||
    params.priorProfileAttempted
  );
}
/** Rechecks automatic cooldowns immediately before a prepared profile attempt. */
function preparedAgentRuntimeProfileAttemptHasCandidate(params) {
  if (params.attempt.kind !== "profile") return false;
  if (params.attempt.plan.forwardedAuthProfileSource === "user") return true;
  return (params.attempt.plan.forwardedAuthProfileCandidateIds ?? [params.attempt.profileId]).some(
    (profileId) => !isProfileInCooldown(params.store, profileId, void 0, params.modelId),
  );
}
/** True when a prepared auth tuple can be reused for this exact compaction target. */
function agentRuntimeAuthPlanMatchesTarget(plan, target) {
  const route = plan.modelRoute;
  const provider = route?.provider ?? plan.providerForAuth;
  const modelId = route?.modelId ?? plan.modelId;
  return (
    modelId !== void 0 &&
    provider.trim().toLowerCase() === target.provider.trim().toLowerCase() &&
    modelId === target.modelId
  );
}
function resolveProfile(params, profileId, options = {}) {
  const credential = params.authProfileStore?.profiles[profileId];
  const configured = params.config?.auth?.profiles?.[profileId];
  const availability = credential
    ? resolveStoredCredentialReadOnlyAvailability({
        credential,
        cfg: params.config ?? {},
        env: params.env ?? process.env,
      })
    : void 0;
  return {
    kind: "profile",
    profileId,
    provider: credential?.provider ?? configured?.provider,
    mode: credential?.type ?? configured?.mode,
    readiness: availability === false ? "unavailable" : "unknown",
    cooldown:
      !options.ignoreCooldown &&
      params.authProfileStore &&
      isProfileInCooldown(params.authProfileStore, profileId, void 0, params.modelId)
        ? "active"
        : "clear",
  };
}
/** Applies terminal provider-entry credential policy before route selection. */
function resolvePreparedProviderEntryApiKeyProfileReference(params) {
  const reference = resolveProviderEntryApiKeyProfileReference({
    cfg: params.config,
    provider: params.provider,
    store: params.store,
  });
  if (reference.kind !== "profile") return reference;
  if (
    !resolveAuthProfileEligibility({
      cfg: params.config,
      store: params.store,
      provider: params.provider,
      profileId: reference.profileId,
    }).eligible
  )
    throw new Error(
      `Per-entry apiKey profile "${reference.profileId}" has no usable credentials for ${params.provider}.`,
    );
  if (isProfileInCooldown(params.store, reference.profileId, void 0, params.modelId))
    throw new Error(
      `Auth profile "${reference.profileId}" is temporarily unavailable for ${params.provider}/${params.modelId}.`,
    );
  return reference;
}
/** Selects concrete provider routes and ordered credentials as one immutable preparation. */
function prepareAgentRuntimeAuth(params) {
  const requestedProfileId = params.sessionAuthProfileId?.trim() || void 0;
  const lockedProfileId = params.sessionAuthProfileSource === "user" ? requestedProfileId : void 0;
  const harnessOwnsOpenAIAuth =
    params.harnessId?.trim().toLowerCase() === "codex" ||
    params.harnessRuntime?.trim().toLowerCase() === "codex";
  const harnessAuthOwnerId = params.harnessId?.trim() || params.harnessRuntime?.trim();
  const runtimeAuthOwner =
    harnessOwnsOpenAIAuth && params.harnessAuthBootstrap === "harness" && harnessAuthOwnerId
      ? { id: harnessAuthOwnerId }
      : void 0;
  const harnessAllowsAuthProfileForwarding = params.allowHarnessAuthProfileForwarding !== false;
  if (lockedProfileId && !harnessAllowsAuthProfileForwarding)
    throw new Error(
      `Auth profile "${lockedProfileId}" cannot be forwarded to the selected agent harness. Configure that harness's native account instead.`,
    );
  const store = params.authProfileStore;
  const authProfileSelectionProvider = harnessOwnsOpenAIAuth ? "openai" : params.provider;
  if (lockedProfileId) {
    if (
      !(
        store
          ? resolveAuthProfileEligibility({
              cfg: params.config,
              store,
              provider: authProfileSelectionProvider,
              profileId: lockedProfileId,
            })
          : { eligible: false }
      ).eligible
    )
      throw new Error(
        `Auth profile "${lockedProfileId}" is not configured for ${authProfileSelectionProvider}.`,
      );
  }
  const configuredProvider = resolveMergedModelProviderConfig(params.config, params.provider);
  const configuredAuthMode =
    lockedProfileId || !harnessAllowsAuthProfileForwarding ? void 0 : configuredProvider?.auth;
  const configuredAwsSdkAuth = configuredAuthMode === "aws-sdk";
  const providerHasApiKeySecretRef =
    harnessAllowsAuthProfileForwarding &&
    Boolean(coerceSecretRef(configuredProvider?.apiKey, params.config?.secrets?.defaults));
  const providerBinding =
    harnessAllowsAuthProfileForwarding && !lockedProfileId && store && !configuredAwsSdkAuth
      ? resolvePreparedProviderEntryApiKeyProfileReference({
          config: params.config,
          modelId: params.modelId,
          provider: params.provider,
          store,
        })
      : { kind: "none" };
  if (providerBinding.kind === "profile-incompatible")
    throw new Error(
      `Per-entry apiKey "${providerBinding.profileId}" is not a compatible bearer profile for ${params.provider}.`,
    );
  const boundProfileId = providerBinding.kind === "profile" ? providerBinding.profileId : void 0;
  const providerHasUsableMarker =
    providerBinding.kind === "marker" &&
    hasUsableCustomProviderApiKey(params.config, params.provider, params.env);
  const providerHasDirectMaterial =
    !configuredAwsSdkAuth &&
    (providerBinding.kind === "literal" || providerHasUsableMarker || providerHasApiKeySecretRef);
  const explicitConfigApiKeyAuth = shouldPreferExplicitConfigApiKeyAuth(
    params.config,
    params.provider,
  );
  const providerBindingSuppressesProfiles =
    (providerBinding.kind === "literal" && explicitConfigApiKeyAuth) ||
    providerHasUsableMarker ||
    (providerHasApiKeySecretRef && explicitConfigApiKeyAuth);
  const providerBindingNeedsNonProfileFallback =
    providerHasDirectMaterial && !providerBindingSuppressesProfiles;
  const selectedConfiguredAuthMode =
    configuredAuthMode ?? (providerHasDirectMaterial ? "api-key" : void 0);
  const selectedProfileId = lockedProfileId ?? boundProfileId;
  const automaticOrderResolution =
    !harnessAllowsAuthProfileForwarding ||
    selectedProfileId ||
    providerBindingSuppressesProfiles ||
    configuredAwsSdkAuth ||
    !store
      ? {
          profileIds: selectedProfileId ? [selectedProfileId] : [],
          hasExplicitOrder: false,
        }
      : resolveAuthProfileOrderWithMetadata({
          cfg: params.config,
          store,
          provider: authProfileSelectionProvider,
          preferredProfile: lockedProfileId ? void 0 : requestedProfileId,
          forModel: params.modelId,
          readinessMode: "read-only",
        });
  const providerPreferredProfileId =
    harnessAllowsAuthProfileForwarding &&
    !selectedProfileId &&
    !providerBindingSuppressesProfiles &&
    !configuredAwsSdkAuth &&
    store
      ? params.resolveProviderPreferredProfileId?.({
          config: params.config,
          agentDir: params.agentDir,
          workspaceDir: params.workspaceDir,
          provider: params.provider,
          modelId: params.modelId,
          preferredProfileId: lockedProfileId ? void 0 : requestedProfileId,
          lockedProfileId,
          profileOrder: automaticOrderResolution.profileIds,
          authStore: store,
        })
      : void 0;
  const resolvedOrderedProfileIds =
    providerPreferredProfileId &&
    automaticOrderResolution.profileIds.includes(providerPreferredProfileId)
      ? [
          providerPreferredProfileId,
          ...automaticOrderResolution.profileIds.filter(
            (profileId) => profileId !== providerPreferredProfileId,
          ),
        ]
      : automaticOrderResolution.profileIds;
  const directSource = (
    mode,
    evidence = providerHasUsableMarker ? "runtime" : "provider-config",
    availability,
  ) =>
    buildProviderModelAuthDirectSource({
      mode,
      evidence,
      availability,
    });
  const directPlanningCandidate = harnessAllowsAuthProfileForwarding
    ? resolveProviderDirectAuthPlanningEvidence(
        authProfileSelectionProvider,
        params.env ?? process.env,
        {
          config: params.config,
          workspaceDir: params.workspaceDir,
        },
      )
    : null;
  const directPlanningEvidence =
    directPlanningCandidate?.kind === "setup-provider" &&
    authProfileSelectionProvider.trim().toLowerCase() === "openai"
      ? null
      : directPlanningCandidate;
  const directPlanningMode = directPlanningEvidence
    ? (configuredAuthMode ?? directPlanningEvidence.mode)
    : void 0;
  const fallbackDirectSource = directPlanningMode
    ? directSource(
        directPlanningMode,
        directPlanningEvidence?.kind === "environment" ? "environment" : "runtime",
        directPlanningEvidence?.kind === "environment" ? true : void 0,
      )
    : providerBindingNeedsNonProfileFallback
      ? directSource(selectedConfiguredAuthMode)
      : void 0;
  const automaticRouteAuthMode =
    fallbackDirectSource && configuredAuthMode && !providerBindingSuppressesProfiles
      ? void 0
      : selectedConfiguredAuthMode;
  const ownership = selectedProfileId
    ? {
        reason: lockedProfileId ? "user-lock" : "provider-binding",
        source: resolveProfile(params, selectedProfileId, { ignoreCooldown: true }),
      }
    : configuredAwsSdkAuth
      ? {
          reason: "configured-auth",
          source: directSource("aws-sdk"),
        }
      : providerBindingSuppressesProfiles
        ? {
            reason: "configured-auth",
            source: directSource(selectedConfiguredAuthMode),
          }
        : void 0;
  const sourcePlan = buildProviderModelAuthSourcePlan({
    ...(ownership ? { ownership } : {}),
    profiles: resolvedOrderedProfileIds.map((profileId) => resolveProfile(params, profileId)),
    ...(providerPreferredProfileId ? { preferredProfileId: providerPreferredProfileId } : {}),
    explicitOrder: automaticOrderResolution.hasExplicitOrder,
    ...(fallbackDirectSource ? { fallback: fallbackDirectSource } : {}),
    allowCooldown: params.allowTransientCooldownProbe,
  });
  const resolution = resolveOpenAIModelRoutes({
    provider: params.provider,
    modelId: params.modelId,
    api: params.modelApi,
    baseUrl: params.modelBaseUrl,
    config: params.config,
    env: params.env,
    requestTransportOverrides: params.requestTransportOverrides,
  });
  if (!resolution || resolution.kind === "indeterminate") {
    const sourceDecision = selectProviderModelAuthSources({
      provider: authProfileSelectionProvider,
      plan: sourcePlan,
    });
    if (sourceDecision.kind === "rejected") {
      if (sourceDecision.reason === "all-cooldown" && sourceDecision.source)
        throw new Error(
          `Auth profile "${sourceDecision.source.profileId}" is temporarily unavailable for ${params.provider}/${params.modelId}.`,
        );
      throw new Error(sourceDecision.message);
    }
    const buildGenericPlan = (attempt, candidateIndex) => {
      const profile = attempt?.kind === "profile" ? attempt.source : void 0;
      const candidateIds = sourceDecision.attempts
        .slice(candidateIndex)
        .flatMap((candidate) => (candidate.kind === "profile" ? [candidate.source.profileId] : []));
      return buildAgentRuntimeAuthPlan({
        provider: params.provider,
        modelId: params.modelId,
        authProfileProvider: profile?.provider,
        authProfileMode:
          profile?.mode ??
          (attempt?.kind === "direct" ? attempt.source.mode : selectedConfiguredAuthMode),
        sessionAuthProfileId: profile?.profileId,
        sessionAuthProfileSource: profile
          ? sourcePlan.kind === "required" && sourcePlan.reason === "user-lock"
            ? "user"
            : "auto"
          : void 0,
        sessionAuthProfileCandidateIds: candidateIds.length > 0 ? candidateIds : void 0,
        config: params.config,
        workspaceDir: params.workspaceDir,
        harnessId: params.harnessId,
        harnessRuntime: params.harnessRuntime,
        allowHarnessAuthProfileForwarding: harnessAllowsAuthProfileForwarding,
      });
    };
    const attempts = sourceDecision.attempts.map((attempt, index) => {
      const plan = buildGenericPlan(attempt, index);
      return attempt.kind === "profile"
        ? {
            kind: "profile",
            plan,
            profileId: attempt.source.profileId,
          }
        : {
            kind: "direct",
            plan,
            allowAuthProfileFallback: attempt.allowAuthProfileFallback,
            requiresPriorProfileAttempt: sourceDecision.attempts
              .slice(0, index)
              .some((candidate) => candidate.kind === "profile"),
          };
    });
    const plan = attempts[0]?.plan ?? buildGenericPlan(void 0, 0);
    if (
      selectedProfileId &&
      harnessOwnsOpenAIAuth &&
      plan.forwardedAuthProfileId !== selectedProfileId
    )
      throw new Error(
        `Auth profile "${selectedProfileId}" cannot be forwarded to the codex runtime.`,
      );
    return {
      plan,
      attempts:
        attempts.length > 0
          ? attempts
          : [
              {
                kind: "implicit",
                plan,
              },
            ],
    };
  }
  if (resolution.kind === "incompatible") throw new Error(resolution.message);
  const toPreparedRoute = (route) => ({
    provider: params.provider,
    modelId: params.modelId,
    api: route.api,
    baseUrl: route.baseUrl,
    authRequirement: route.authRequirement,
    requestTransportOverrides: route.requestTransportOverrides,
    runtimePolicy: route.runtimePolicy,
  });
  const routeAuthDecision = selectOpenAIModelRouteAuth({
    resolution,
    sourcePlan,
    configuredAuthMode: automaticRouteAuthMode,
    ...(runtimeAuthOwner ? { runtimeAuthOwner } : {}),
  });
  if (routeAuthDecision.kind === "deferred") {
    const plan = buildAgentRuntimeAuthPlan({
      provider: params.provider,
      modelId: params.modelId,
      config: params.config,
      workspaceDir: params.workspaceDir,
      harnessId: params.harnessId,
      harnessRuntime: params.harnessRuntime,
      allowHarnessAuthProfileForwarding: harnessAllowsAuthProfileForwarding,
      deferredRouteSupport: routeAuthDecision.routeSupport,
    });
    return {
      plan,
      attempts: [
        {
          kind: "implicit",
          plan,
        },
      ],
    };
  }
  if (routeAuthDecision.kind !== "selected") {
    if (
      routeAuthDecision.kind === "rejected" &&
      routeAuthDecision.reason === "all-cooldown" &&
      routeAuthDecision.source
    )
      throw new Error(
        `Auth profile "${routeAuthDecision.source.profileId}" is temporarily unavailable for ${params.provider}/${params.modelId}.`,
      );
    throw new Error(routeAuthDecision.message);
  }
  const buildRoutedPlan = (attempt) => {
    const profile = attempt?.kind === "profile" ? attempt.source : void 0;
    const route = attempt?.route ?? routeAuthDecision.selection.route;
    return buildAgentRuntimeAuthPlan({
      provider: params.provider,
      modelId: params.modelId,
      authProfileProvider: profile?.provider,
      authProfileMode:
        profile?.mode ??
        (attempt?.kind === "direct" ? attempt.source.mode : selectedConfiguredAuthMode),
      sessionAuthProfileId: profile?.profileId,
      sessionAuthProfileSource: profile
        ? sourcePlan.kind === "required" && sourcePlan.reason === "user-lock"
          ? "user"
          : "auto"
        : void 0,
      sessionAuthProfileCandidateIds:
        attempt?.kind === "profile" ? [...attempt.sameRouteProfileIds] : void 0,
      modelRoute: toPreparedRoute(route),
      config: params.config,
      workspaceDir: params.workspaceDir,
      harnessId: params.harnessId,
      harnessRuntime: params.harnessRuntime,
      allowHarnessAuthProfileForwarding: harnessAllowsAuthProfileForwarding,
    });
  };
  const attempts = routeAuthDecision.attempts.map((attempt, index) => {
    const plan = buildRoutedPlan(attempt);
    return attempt.kind === "profile"
      ? {
          kind: "profile",
          plan,
          profileId: attempt.source.profileId,
        }
      : {
          kind: "direct",
          plan,
          allowAuthProfileFallback: attempt.allowAuthProfileFallback,
          requiresPriorProfileAttempt: routeAuthDecision.attempts
            .slice(0, index)
            .some((candidate) => candidate.kind === "profile"),
        };
  });
  const plan = attempts[0]?.plan ?? buildRoutedPlan(void 0);
  for (const attempt of attempts)
    if (
      attempt.profileId &&
      harnessOwnsOpenAIAuth &&
      attempt.plan.forwardedAuthProfileId !== attempt.profileId
    )
      throw new Error(
        `Auth profile "${attempt.profileId}" cannot be forwarded to the codex runtime.`,
      );
  return {
    plan,
    attempts:
      attempts.length > 0
        ? attempts
        : [
            {
              kind: "implicit",
              plan,
            },
          ],
  };
}
//#endregion
export {
  preparedAgentRuntimeProfileAttemptHasCandidate as i,
  canRunPreparedAgentRuntimeAuthAttempt as n,
  prepareAgentRuntimeAuth as r,
  agentRuntimeAuthPlanMatchesTarget as t,
};
