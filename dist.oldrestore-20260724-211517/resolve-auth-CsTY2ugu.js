import { o as shouldForceDirectAuthFallbackModelResolve } from "./credential-scoped-model-lT7pctV8.js";
import "./errors-BoHeli7m.js";
import { r as toErrorObject } from "./error-coercion-CrJRoLe1.js";
import { o as getApiKeyForModel } from "./model-auth-BWFdcEzF.js";
import { b as providerModelRouteAcceptsAuthMode } from "./openai-routing-Cu28Ynzk.js";
import {
  i as preparedAgentRuntimeProfileAttemptHasCandidate,
  n as canRunPreparedAgentRuntimeAuthAttempt,
} from "./prepare-auth-CUDA42wQ.js";
import { o as isProfileInCooldown } from "./usage-state-BQLO_Yob.js";
//#region src/agents/runtime-plan/model-route.ts
function normalizeRouteBaseUrl(value) {
  return value.replace(/\/+$/u, "");
}
function sameCompatibleRuntimeIds(left, right) {
  if (left === right) return true;
  if (!left || !right) return false;
  const leftIds = new Set(left);
  const rightIds = new Set(right);
  if (leftIds.size !== rightIds.size) return false;
  for (const id of leftIds) if (!rightIds.has(id)) return false;
  return true;
}
/** Compares the complete secret-free identity of two prepared model routes. */
function sameAgentRuntimeAuthModelRoute(left, right) {
  return (
    left.provider.trim().toLowerCase() === right.provider.trim().toLowerCase() &&
    left.modelId === right.modelId &&
    left.api === right.api &&
    left.authRequirement === right.authRequirement &&
    left.requestTransportOverrides === right.requestTransportOverrides &&
    sameCompatibleRuntimeIds(
      left.runtimePolicy?.compatibleIds,
      right.runtimePolicy?.compatibleIds,
    ) &&
    normalizeRouteBaseUrl(left.baseUrl) === normalizeRouteBaseUrl(right.baseUrl)
  );
}
//#endregion
//#region src/agents/runtime-plan/resolve-auth.ts
/** Resolves credentials for an immutable prepared runtime route. */
function listDistinctPreparedRuntimeAuthAttempts(attempts) {
  return attempts.filter((attempt, index) => {
    const route = attempt.plan.modelRoute;
    return !attempts.slice(0, index).some((previous) => {
      if (
        (previous.allowAuthProfileFallback === false) !==
        (attempt.allowAuthProfileFallback === false)
      )
        return false;
      const previousRoute = previous.plan.modelRoute;
      if (!route || !previousRoute) return !route && !previousRoute;
      return sameAgentRuntimeAuthModelRoute(route, previousRoute);
    });
  });
}
/** Resolves one complete prepared route/profile tuple without crossing retries mid-flight. */
async function resolvePreparedRuntimeAuthAttempts(params) {
  let firstError;
  let priorProfileAttempted = false;
  for (const attempt of listDistinctPreparedRuntimeAuthAttempts(params.attempts)) {
    if (
      !canRunPreparedAgentRuntimeAuthAttempt({
        attempt,
        priorProfileAttempted,
      })
    ) {
      firstError ??= /* @__PURE__ */ new Error(
        "Prepared direct auth cannot bypass unavailable profiles.",
      );
      continue;
    }
    if (
      attempt.kind === "profile" &&
      !preparedAgentRuntimeProfileAttemptHasCandidate({
        attempt,
        store: params.store,
        modelId: params.modelId,
      })
    ) {
      firstError ??= /* @__PURE__ */ new Error(
        "Prepared runtime auth candidates are temporarily unavailable.",
      );
      continue;
    }
    try {
      let model = await params.materializeModel({
        plan: attempt.plan,
        model: params.model,
        forceResolve:
          (params.forceCredentialScopedDirectModelResolve === true &&
            attempt.kind === "direct" &&
            Boolean(attempt.plan.selectedAuthMode)) ||
          shouldForceDirectAuthFallbackModelResolve({
            attempt,
            priorProfileAttempted,
          }),
      });
      if (
        attempt.kind === "profile" &&
        !preparedAgentRuntimeProfileAttemptHasCandidate({
          attempt,
          store: params.store,
          modelId: params.modelId,
        })
      )
        throw new Error("Prepared runtime auth candidates are temporarily unavailable.");
      const resolution = params.resolveAuth({
        attempt,
        model,
      });
      priorProfileAttempted ||= attempt.kind === "profile";
      const resolved = await resolution;
      if (resolved.plan.forwardedAuthProfileId !== attempt.plan.forwardedAuthProfileId)
        model = await params.materializeModel({
          plan: resolved.plan,
          model,
          forceResolve: true,
        });
      return {
        model,
        plan: resolved.plan,
        auth: resolved.auth,
      };
    } catch (error) {
      firstError ??= error;
    }
  }
  throw toErrorObject(firstError, params.errorMessage);
}
function scopeAuthStoreToPreparedCandidates(store, profileIds) {
  const profileIdSet = new Set(profileIds);
  const profiles = {};
  for (const profileId of profileIds) {
    const profile = store.profiles[profileId];
    if (profile) profiles[profileId] = profile;
  }
  const order = store.order
    ? Object.fromEntries(
        Object.entries(store.order).map(([provider, ids]) => [
          provider,
          ids.filter((profileId) => profileIdSet.has(profileId)),
        ]),
      )
    : void 0;
  const lastGood = store.lastGood
    ? Object.fromEntries(
        Object.entries(store.lastGood).filter(([, profileId]) => profileIdSet.has(profileId)),
      )
    : void 0;
  const usageStats = store.usageStats
    ? Object.fromEntries(
        Object.entries(store.usageStats).filter(([profileId]) => profileIdSet.has(profileId)),
      )
    : void 0;
  const runtimePersistedProfileIds = store.runtimePersistedProfileIds?.filter((profileId) =>
    profileIdSet.has(profileId),
  );
  const runtimeExternalProfileIds = store.runtimeExternalProfileIds?.filter((profileId) =>
    profileIdSet.has(profileId),
  );
  return {
    version: store.version,
    profiles,
    ...(order ? { order } : {}),
    ...(lastGood ? { lastGood } : {}),
    ...(usageStats ? { usageStats } : {}),
    ...(runtimePersistedProfileIds ? { runtimePersistedProfileIds } : {}),
    ...(runtimeExternalProfileIds || store.runtimeExternalProfileIdsAuthoritative === true
      ? {
          runtimeExternalProfileIds: runtimeExternalProfileIds ?? [],
          ...(store.runtimeExternalProfileIdsAuthoritative === true
            ? { runtimeExternalProfileIdsAuthoritative: true }
            : {}),
        }
      : {}),
  };
}
/** Restricts a native auth consumer to the profiles selected for one physical route. */
function scopeAuthProfileStoreToPreparedPlan(store, plan) {
  return scopeAuthStoreToPreparedCandidates(
    store,
    plan.modelRoute?.authRequirement === "api-key"
      ? []
      : [plan.forwardedAuthProfileId, ...(plan.forwardedAuthProfileCandidateIds ?? [])].filter(
          (profileId, index, values) => {
            return Boolean(profileId?.trim()) && values.indexOf(profileId) === index;
          },
        ),
  );
}
function applyResolvedAuthToPlan(params) {
  const profileId = params.auth.profileId?.trim();
  if (!profileId)
    return {
      ...params.plan,
      forwardedAuthProfileId: void 0,
      forwardedAuthProfileSource: void 0,
      forwardedAuthProfileCandidateIds: void 0,
      selectedAuthMode: params.auth.mode,
    };
  const resolvedIndex = params.candidates.indexOf(profileId);
  const remainingCandidates =
    resolvedIndex >= 0 ? params.candidates.slice(resolvedIndex) : [profileId];
  const source = params.plan.forwardedAuthProfileId
    ? params.plan.forwardedAuthProfileSource
    : "auto";
  return {
    ...params.plan,
    forwardedAuthProfileId: profileId,
    forwardedAuthProfileSource: source,
    forwardedAuthProfileCandidateIds: source === "auto" ? remainingCandidates : [profileId],
    selectedAuthMode: params.auth.mode,
  };
}
function assertResolvedAuthMatchesPreparedRoute(params) {
  const route = params.plan.modelRoute;
  if (
    !route ||
    providerModelRouteAcceptsAuthMode({
      requirement: route.authRequirement,
      mode: params.auth.mode,
    })
  )
    return;
  throw new Error(
    `Resolved ${params.auth.mode} credentials are incompatible with the selected ${route.authRequirement} route for ${route.provider}.`,
  );
}
/** Resolves prepared same-route candidates without pinning the first unresolved profile. */
async function resolvePreparedRuntimeModelAuth(params) {
  const { plan, ...authParams } = params;
  const candidates = [
    plan.forwardedAuthProfileId,
    ...(plan.forwardedAuthProfileCandidateIds ?? []),
  ].filter((profileId, index, values) => {
    return Boolean(profileId?.trim()) && values.indexOf(profileId) === index;
  });
  if (candidates.length === 0) {
    const auth = await getApiKeyForModel({
      ...authParams,
      store: {
        version: 1,
        profiles: {},
      },
      lockedProfile: false,
      allowAuthProfileFallback: false,
      skipSetupProviderFallback: plan.modelRoute?.provider === "openai",
    });
    assertResolvedAuthMatchesPreparedRoute({
      plan,
      auth,
    });
    return {
      auth,
      plan: applyResolvedAuthToPlan({
        plan,
        auth,
        candidates,
      }),
    };
  }
  if (plan.forwardedAuthProfileSource !== "auto") {
    const auth = await getApiKeyForModel({
      ...authParams,
      profileId: plan.forwardedAuthProfileId,
      lockedProfile: Boolean(plan.forwardedAuthProfileId),
    });
    assertResolvedAuthMatchesPreparedRoute({
      plan,
      auth,
    });
    return {
      auth,
      plan: applyResolvedAuthToPlan({
        plan,
        auth,
        candidates,
      }),
    };
  }
  const store = params.store;
  const currentCandidates = store
    ? candidates.filter(
        (profileId) => !isProfileInCooldown(store, profileId, void 0, params.model.id),
      )
    : candidates;
  if (currentCandidates.length === 0)
    throw new Error("Prepared runtime auth candidates are temporarily unavailable.");
  const candidateStore = store
    ? scopeAuthStoreToPreparedCandidates(store, currentCandidates)
    : void 0;
  let firstError;
  for (const profileId of currentCandidates)
    try {
      const auth = await getApiKeyForModel({
        ...authParams,
        profileId,
        lockedProfile: true,
        ...(candidateStore ? { store: candidateStore } : {}),
      });
      assertResolvedAuthMatchesPreparedRoute({
        plan,
        auth,
      });
      return {
        auth,
        plan: applyResolvedAuthToPlan({
          plan,
          auth,
          candidates: currentCandidates,
        }),
      };
    } catch (error) {
      firstError ??= error;
    }
  throw toErrorObject(firstError, "Prepared runtime auth candidates could not be resolved.");
}
//#endregion
export {
  resolvePreparedRuntimeModelAuth as n,
  scopeAuthProfileStoreToPreparedPlan as r,
  resolvePreparedRuntimeAuthAttempts as t,
};
