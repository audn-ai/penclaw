import { r as hasUsableOAuthCredential } from "./credential-state-DvOWxJSx.js";
import { a as resolveExternalCliAuthProfiles } from "./external-auth-aN0UYCd0.js";
import {
  _ as shouldPreferExplicitConfigApiKeyAuth,
  d as hasUsableCustomProviderApiKey,
  h as resolveProviderEntryApiKeyProfileReference,
  l as hasRuntimeAvailableProviderAuth,
  u as hasSyntheticLocalProviderAuthConfig,
} from "./model-auth-BWFdcEzF.js";
import { r as resolveProviderEnvAuthEvidence } from "./model-auth-env-DLe5znyS.js";
import {
  b as resolveProviderEnvAuthLookupMaps,
  p as isSecretRefHeaderValueMarker,
  u as isKnownEnvApiKeyMarker,
} from "./model-auth-markers-CA2Xy59Z.js";
import { i as resolveAgentModelPrimaryValue } from "./model-input-B7OGjVYg.js";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.js";
import {
  A as resolveMergedModelProviderConfig,
  D as fromProviderModelAuthReadiness,
  E as buildProviderModelAuthSourcePlan,
  O as toProviderModelAuthReadiness,
  S as resolveProviderModelRouteAuthRequirement,
  T as buildProviderModelAuthDirectSource,
  f as createOpenAIModelRoutesResolver,
  g as selectOpenAIModelRouteAuth,
  m as resolveConfiguredOpenAIAuthMode,
  w as selectProviderModelAuthSources,
} from "./openai-routing-Cu28Ynzk.js";
import {
  a as resolveAuthProfileOrderWithMetadata,
  r as resolveAuthProfileEligibility,
  t as isConfiguredAwsSdkAuthProfileForProvider,
} from "./order-BNCpk81x.js";
import "./auth-profiles-CX7JDmZ9.js";
import {
  i as normalizeProviderIdForAuth,
  n as findNormalizedProviderValue,
} from "./provider-id-BIcU_2-A.js";
import {
  n as resolveSecretRefReadOnlyAvailability,
  r as resolveStoredCredentialReadOnlyAvailability,
  t as hasMalformedSecretInputSyntax,
} from "./read-only-availability-BluKl_Ub.js";
import { s as isValidSecretRef } from "./ref-contract-DVV0zYUk.js";
import { c as getRuntimeAuthProfileStoreSnapshot } from "./store-B7DoDdVM.js";
import { s as coerceSecretRef } from "./types.secrets-BV0ywRAy.js";
import { o as isProfileInCooldown } from "./usage-state-BQLO_Yob.js";
//#region src/agents/model-auth-availability.ts
/** Read-only provider/model auth availability with provider-route selection. */
const OPENAI_PROVIDER_ID = "openai";
const OPENAI_CODEX_RESPONSES_API = "openai-chatgpt-responses";
function hasSecret(value) {
  return typeof value === "string" && value.trim().length > 0;
}
function modeAllowed(provider, target, mode) {
  const requirement = resolveProviderModelRouteAuthRequirement(mode);
  return target.authRequirement
    ? requirement === target.authRequirement
    : provider !== OPENAI_PROVIDER_ID ||
        target.api === void 0 ||
        target.api === OPENAI_CODEX_RESPONSES_API ||
        requirement === "api-key";
}
function normalizeModelIdForProvider(provider, modelId) {
  const trimmed = splitTrailingAuthProfile(modelId).model.trim();
  if (!trimmed) return;
  const slash = trimmed.indexOf("/");
  if (slash <= 0) return trimmed;
  return normalizeProviderIdForAuth(trimmed.slice(0, slash)) === provider
    ? trimmed.slice(slash + 1).trim() || void 0
    : void 0;
}
/** Builds one snapshot-scoped read-only auth evaluator. */
function createModelAuthAvailabilityResolver(params) {
  const env = params.env ?? process.env;
  const now = Date.now();
  const external = params.externalCliProviderIds?.length
    ? resolveExternalCliAuthProfiles(params.authStore, {
        allowKeychainPrompt: false,
        providerIds: [...params.externalCliProviderIds],
      })
    : [];
  const store = external.length
    ? {
        ...params.authStore,
        profiles: {
          ...params.authStore.profiles,
          ...Object.fromEntries(external.map((item) => [item.profileId, item.credential])),
        },
      }
    : params.authStore;
  const runtimeStore =
    params.allowPreparedRuntimeAuth !== false
      ? getRuntimeAuthProfileStoreSnapshot(params.agentDir)
      : void 0;
  const hydratedProfileIds = /* @__PURE__ */ new Set();
  const sameSecretRef = (left, right) =>
    left !== null &&
    right !== null &&
    left.source === right.source &&
    left.provider === right.provider &&
    left.id === right.id;
  const runtimeCredentialOverlay = (profileId, credential) => {
    const runtime = runtimeStore?.profiles[profileId];
    if (!runtime || credential.type !== runtime.type || credential.provider !== runtime.provider)
      return credential;
    if (
      credential.type === "oauth" &&
      runtime.type === "oauth" &&
      credential.oauthRef &&
      !hasSecret(credential.access) &&
      !hasSecret(credential.refresh) &&
      hasUsableOAuthCredential(runtime, { now })
    )
      return runtime;
    if (
      credential.type === "api_key" &&
      runtime.type === "api_key" &&
      sameSecretRef(
        coerceSecretRef(credential.keyRef ?? credential.key, params.cfg.secrets?.defaults),
        coerceSecretRef(runtime.keyRef, params.cfg.secrets?.defaults),
      ) &&
      hasSecret(runtime.key)
    ) {
      hydratedProfileIds.add(profileId);
      return {
        ...credential,
        key: runtime.key,
      };
    }
    if (
      credential.type === "token" &&
      runtime.type === "token" &&
      sameSecretRef(
        coerceSecretRef(credential.tokenRef ?? credential.token, params.cfg.secrets?.defaults),
        coerceSecretRef(runtime.tokenRef, params.cfg.secrets?.defaults),
      ) &&
      hasSecret(runtime.token)
    ) {
      hydratedProfileIds.add(profileId);
      return {
        ...credential,
        token: runtime.token,
      };
    }
    return credential;
  };
  const orderProfiles = runtimeStore
    ? Object.fromEntries(
        Object.entries(store.profiles).map(([profileId, credential]) => [
          profileId,
          runtimeCredentialOverlay(profileId, credential),
        ]),
      )
    : store.profiles;
  const orderBaseStore =
    orderProfiles === store.profiles
      ? store
      : {
          ...store,
          profiles: orderProfiles,
        };
  const orderStore = orderBaseStore.usageStats
    ? {
        ...orderBaseStore,
        usageStats: Object.fromEntries(
          Object.entries(orderBaseStore.usageStats).map(([id, stats]) => [id, { ...stats }]),
        ),
      }
    : orderBaseStore;
  const { aliasMap, envCandidateMap, authEvidenceMap } = resolveProviderEnvAuthLookupMaps({
    config: params.cfg,
    workspaceDir: params.workspaceDir,
    env,
    metadataSnapshot: params.metadataSnapshot,
  });
  const synthetic = new Set(
    (params.syntheticAuthProviderRefs ?? []).map(normalizeProviderIdForAuth),
  );
  if (
    resolveAgentModelPrimaryValue(params.cfg.agents?.defaults?.model)?.split("/", 1)[0] === "codex"
  )
    synthetic.add("codex");
  const resolveRoutes = (params.routeResolverFactory ?? createOpenAIModelRoutesResolver)({
    config: params.cfg,
    env,
  });
  const envCache = /* @__PURE__ */ new Map();
  const orderCache = /* @__PURE__ */ new Map();
  const normalizeProvider = (provider) => {
    const normalized = normalizeProviderIdForAuth(provider);
    return aliasMap[normalized] ?? normalized;
  };
  const providerConfig = (provider) => resolveMergedModelProviderConfig(params.cfg, provider);
  const prepareAuthTarget = (provider, ref) => {
    const configured = providerConfig(provider);
    const configuredModelId = ref.modelId
      ? normalizeModelIdForProvider(provider, ref.modelId)
      : void 0;
    const configuredModel = configuredModelId
      ? configured?.models?.find(
          (model) => normalizeModelIdForProvider(provider, model.id) === configuredModelId,
        )
      : void 0;
    return {
      ...ref,
      api: ref.api ?? configuredModel?.api ?? configured?.api,
      baseUrl: ref.baseUrl ?? configuredModel?.baseUrl ?? configured?.baseUrl,
    };
  };
  const providerBinding = (provider) =>
    resolveProviderEntryApiKeyProfileReference({
      cfg: params.cfg,
      provider,
      store,
    });
  const envAuth = (provider) => {
    const normalized = normalizeProvider(provider);
    if (!envCache.has(normalized))
      envCache.set(
        normalized,
        resolveProviderEnvAuthEvidence(normalized, env, {
          aliasMap,
          candidateMap: envCandidateMap,
          authEvidenceMap,
          config: params.cfg,
          workspaceDir: params.workspaceDir,
        }),
      );
    return envCache.get(normalized);
  };
  const profileOrder = (provider, forModel, preferredProfileId, lockedProfileId) => {
    const normalized = normalizeProvider(provider);
    const cacheKey = `${normalized}\u0000${forModel ?? ""}\u0000${preferredProfileId ?? ""}\u0000${lockedProfileId ?? ""}`;
    const cached = orderCache.get(cacheKey);
    if (cached) return cached;
    const resolution = resolveAuthProfileOrderWithMetadata({
      cfg: params.cfg,
      store: orderStore,
      provider: normalized,
      preferredProfile: preferredProfileId,
      forModel,
      readinessMode: "read-only",
    });
    orderCache.set(cacheKey, resolution);
    return resolution;
  };
  const profileMode = (profileId) =>
    store.profiles[profileId]?.type ?? params.cfg.auth?.profiles?.[profileId]?.mode;
  const profileCredential = (profileId, credential = store.profiles[profileId]) => {
    return credential ? runtimeCredentialOverlay(profileId, credential) : void 0;
  };
  const profileEligibleForReadOnlyAvailability = (provider, profileId, credential) => {
    const effectiveStore =
      store.profiles[profileId] === credential
        ? store
        : {
            ...store,
            profiles: {
              ...store.profiles,
              [profileId]: credential,
            },
          };
    const eligibility = resolveAuthProfileEligibility({
      cfg: params.cfg,
      store: effectiveStore,
      provider: normalizeProvider(provider),
      profileId,
      now,
    });
    return eligibility.eligible || eligibility.reasonCode === "unresolved_ref";
  };
  const credentialAvailability = (provider, credential, target) => {
    if (!modeAllowed(provider, target, credential.type)) return false;
    return resolveStoredCredentialReadOnlyAvailability({
      credential,
      cfg: params.cfg,
      env,
      now,
      canRefreshOAuth: provider === OPENAI_PROVIDER_ID,
    });
  };
  const resolvedProfileAvailability = (provider, profileId, credential, target) => {
    if (!hydratedProfileIds.has(profileId))
      return credentialAvailability(provider, credential, target);
    if (!modeAllowed(provider, target, credential.type)) return false;
    return credential.type !== "token" || credential.expires === void 0 || credential.expires > now;
  };
  const profileInCooldown = (profileId, target) => {
    const cooldownModel = target.modelId ? splitTrailingAuthProfile(target.modelId).model : void 0;
    return isProfileInCooldown(store, profileId, now, cooldownModel);
  };
  const profileAvailability = (provider, profileId, target, allowCooldown = false) => {
    if (!allowCooldown && profileInCooldown(profileId, target)) return false;
    if (
      isConfiguredAwsSdkAuthProfileForProvider({
        cfg: params.cfg,
        provider,
        profileId,
      })
    )
      return modeAllowed(provider, target, "aws-sdk");
    const credential = profileCredential(profileId);
    if (!credential || !profileEligibleForReadOnlyAvailability(provider, profileId, credential))
      return false;
    return resolvedProfileAvailability(provider, profileId, credential, target);
  };
  const hasProfileEvidence = (provider) => {
    const normalized = normalizeProvider(provider);
    if (findNormalizedProviderValue(params.cfg.auth?.order, normalized) !== void 0) return true;
    if (
      Object.values(params.cfg.auth?.profiles ?? {}).some(
        (profile) => normalizeProvider(profile.provider) === normalized,
      )
    )
      return true;
    return Object.keys(store.profiles).some((profileId) => {
      const reason = resolveAuthProfileEligibility({
        cfg: params.cfg,
        store,
        provider: normalized,
        profileId,
      }).reasonCode;
      return reason !== "provider_mismatch" && reason !== "profile_missing";
    });
  };
  const firstProfileEvidenceId = (provider) => {
    const normalized = normalizeProvider(provider);
    const configuredOrder = findNormalizedProviderValue(params.cfg.auth?.order, normalized);
    const storedOrder = findNormalizedProviderValue(store.order, normalized);
    return (configuredOrder ?? storedOrder ?? Object.keys(store.profiles)).find((profileId) => {
      const reason = resolveAuthProfileEligibility({
        cfg: params.cfg,
        store,
        provider: normalized,
        profileId,
      }).reasonCode;
      return reason !== "provider_mismatch" && reason !== "profile_missing";
    });
  };
  const unprofiledEvaluation = (provider, target) => {
    const configured = providerConfig(provider);
    if (configured?.auth === "aws-sdk")
      return {
        availability: modeAllowed(provider, target, "aws-sdk"),
        selectedAuthMode: "aws-sdk",
        evidence: "aws-sdk",
      };
    const apiKey = configured?.apiKey;
    const configuredBearerMode =
      configured?.auth === "api-key" || configured?.auth === "oauth" || configured?.auth === "token"
        ? configured.auth
        : "api-key";
    const apiKeyRef = coerceSecretRef(apiKey, params.cfg.secrets?.defaults);
    if (!apiKeyRef && hasMalformedSecretInputSyntax(apiKey))
      return {
        availability: false,
        evidence: "provider-config",
      };
    const binding = providerBinding(provider);
    if (binding.kind === "profile") {
      const credential = profileCredential(binding.profileId, binding.credential);
      const cooldownModel = target.modelId
        ? splitTrailingAuthProfile(target.modelId).model
        : void 0;
      return {
        availability:
          credential &&
          !isProfileInCooldown(store, binding.profileId, now, cooldownModel) &&
          profileEligibleForReadOnlyAvailability(
            binding.credential.provider,
            binding.profileId,
            credential,
          )
            ? resolvedProfileAvailability(provider, binding.profileId, credential, target)
            : false,
        selectedProfileId: binding.profileId,
        selectedAuthMode: credential?.type ?? binding.credential.type,
        evidence: "profile",
      };
    }
    if (binding.kind === "profile-incompatible")
      return {
        availability: false,
        evidence: "profile",
      };
    if (binding.kind === "literal")
      return {
        availability: modeAllowed(provider, target, configuredBearerMode),
        selectedAuthMode: configuredBearerMode,
        evidence: "provider-config",
      };
    if (binding.kind === "marker") {
      if (typeof apiKey === "string" && isKnownEnvApiKeyMarker(apiKey))
        return {
          availability: modeAllowed(provider, target, configuredBearerMode)
            ? hasSecret(env[apiKey.trim()])
            : false,
          selectedAuthMode: configuredBearerMode,
          evidence: "environment",
        };
      if (!modeAllowed(provider, target, configuredBearerMode))
        return {
          availability: false,
          selectedAuthMode: configuredBearerMode,
          evidence: "synthetic",
        };
      if (hasUsableCustomProviderApiKey(params.cfg, provider, env))
        return {
          availability: true,
          selectedAuthMode: configuredBearerMode,
          evidence: "synthetic",
        };
      const managed = typeof apiKey === "string" && isSecretRefHeaderValueMarker(apiKey);
      return {
        availability: managed
          ? hasRuntimeAvailableProviderAuth({
              provider,
              modelApi: target.api ?? void 0,
              cfg: params.cfg,
              workspaceDir: params.workspaceDir,
              env,
              allowPluginSyntheticAuth: false,
            }) || void 0
          : void 0,
        selectedAuthMode: configuredBearerMode,
        evidence: managed ? "runtime" : "synthetic",
      };
    }
    if (apiKeyRef) {
      if (!isValidSecretRef(apiKeyRef) || !modeAllowed(provider, target, configuredBearerMode))
        return {
          availability: false,
          selectedAuthMode: configuredBearerMode,
          evidence: "provider-config",
        };
      const available = resolveSecretRefReadOnlyAvailability(apiKeyRef, params.cfg, env);
      const runtimeAvailable = hasRuntimeAvailableProviderAuth({
        provider,
        modelApi: target.api ?? void 0,
        cfg: params.cfg,
        workspaceDir: params.workspaceDir,
        env,
        allowPluginSyntheticAuth: false,
      });
      return {
        availability: runtimeAvailable ? true : available,
        selectedAuthMode: configuredBearerMode,
        evidence: runtimeAvailable ? "runtime" : "provider-config",
      };
    }
    if (apiKey !== void 0 && !(typeof apiKey === "string" && apiKey.trim() === ""))
      return {
        availability: false,
        evidence: "provider-config",
      };
    if (
      provider === "amazon-bedrock" &&
      (target.api === void 0 || target.api === "bedrock-converse-stream") &&
      configured?.auth === void 0 &&
      apiKey === void 0
    )
      return {
        availability: modeAllowed(provider, target, "aws-sdk"),
        selectedAuthMode: "aws-sdk",
        evidence: "aws-sdk",
      };
    const environment = envAuth(provider);
    if (environment) {
      if (provider === "amazon-bedrock" && environment.mode === "aws-sdk")
        return {
          availability: modeAllowed(provider, target, "aws-sdk"),
          selectedAuthMode: "aws-sdk",
          evidence: "aws-sdk",
        };
      const mode = configured?.auth ?? environment.mode;
      return {
        availability: modeAllowed(provider, target, mode),
        selectedAuthMode: mode,
        evidence: "environment",
      };
    }
    const hasCompatibleCodexSyntheticAuth =
      provider === OPENAI_PROVIDER_ID &&
      synthetic.has("codex") &&
      (target.authRequirement === "subscription" || target.api === OPENAI_CODEX_RESPONSES_API);
    if (
      hasSyntheticLocalProviderAuthConfig({
        cfg: params.cfg,
        provider,
      }) ||
      synthetic.has(normalizeProvider(provider)) ||
      hasCompatibleCodexSyntheticAuth
    )
      return {
        availability: void 0,
        evidence: "synthetic",
      };
    return {
      availability:
        configured?.auth !== void 0 ||
        (apiKey !== void 0 && !(typeof apiKey === "string" && apiKey.trim() === "")) ||
        hasProfileEvidence(provider)
          ? false
          : void 0,
      selectedAuthMode: configured?.auth,
    };
  };
  const directSource = (evaluation) =>
    buildProviderModelAuthDirectSource({
      mode: evaluation.selectedAuthMode,
      availability: evaluation.availability,
      evidence: evaluation.evidence ?? "none",
    });
  const automaticProfileSource = (provider, profileId, target) => ({
    kind: "profile",
    profileId,
    mode: profileMode(profileId),
    readiness: toProviderModelAuthReadiness(profileAvailability(provider, profileId, target, true)),
    cooldown: profileInCooldown(profileId, target) ? "active" : "clear",
  });
  const requiredProfileSource = (provider, profileId, target, ignoreCooldown) => ({
    kind: "profile",
    profileId,
    mode: profileMode(profileId),
    readiness: toProviderModelAuthReadiness(
      profileAvailability(provider, profileId, target, ignoreCooldown),
    ),
    cooldown: "clear",
  });
  const sourceEvaluation = (selection) => {
    if (selection.kind === "none") return { availability: void 0 };
    const source = selection.source;
    if (source.kind === "profile")
      return {
        availability:
          selection.kind === "unavailable"
            ? false
            : fromProviderModelAuthReadiness(source.readiness),
        selectedProfileId: source.profileId,
        selectedAuthMode: source.mode,
        evidence: "profile",
      };
    return {
      availability: fromProviderModelAuthReadiness(source.readiness),
      selectedAuthMode: source.mode,
      ...(source.evidence === "none" ? {} : { evidence: source.evidence }),
    };
  };
  const directPolicy = (provider, target) => {
    const configured = providerConfig(provider);
    const binding = providerBinding(provider);
    const apiKeyRef = coerceSecretRef(configured?.apiKey, params.cfg.secrets?.defaults);
    const markerUsable =
      binding.kind === "marker" && hasUsableCustomProviderApiKey(params.cfg, provider, env);
    const hasDirectMaterial = binding.kind === "literal" || markerUsable || apiKeyRef !== null;
    const required =
      configured?.auth === "aws-sdk" ||
      markerUsable ||
      (hasDirectMaterial && shouldPreferExplicitConfigApiKeyAuth(params.cfg, provider));
    const environment = envAuth(provider);
    const environmentMode = environment ? (configured?.auth ?? environment.mode) : void 0;
    const direct =
      !required && environmentMode
        ? buildProviderModelAuthDirectSource({
            mode: environmentMode,
            availability: modeAllowed(provider, target, environmentMode),
            evidence: environmentMode === "aws-sdk" ? "aws-sdk" : "environment",
          })
        : directSource(unprofiledEvaluation(provider, target));
    return {
      binding,
      direct,
      hasDirectMaterial,
      hasDirectFallback: hasDirectMaterial || direct.evidence !== "none",
      markerUsable,
      required,
    };
  };
  const automaticSourceRejection = (provider, ref, target) => {
    if (ref.lockedProfileId?.trim()) return;
    const policy = directPolicy(provider, target);
    if (
      policy.required ||
      policy.binding.kind === "profile" ||
      policy.binding.kind === "profile-incompatible"
    )
      return;
    const orderResolution = profileOrder(
      provider,
      ref.modelId,
      ref.preferredProfileId,
      ref.lockedProfileId,
    );
    const decision = selectProviderModelAuthSources({
      provider,
      plan: buildProviderModelAuthSourcePlan({
        profiles: orderResolution.profileIds.map((profileId) =>
          automaticProfileSource(provider, profileId, target),
        ),
        preferredProfileId: ref.preferredProfileId,
        explicitOrder: orderResolution.hasExplicitOrder,
        ...(policy.hasDirectFallback ? { fallback: policy.direct } : {}),
      }),
    });
    return decision.kind === "rejected" ? decision : void 0;
  };
  const resolveProviderEvaluation = (rawProvider, ref = {}, preparedTarget) => {
    const provider = normalizeProviderIdForAuth(rawProvider);
    const target = preparedTarget ?? prepareAuthTarget(provider, ref);
    const profileLock = ref.lockedProfileId?.trim();
    const policy = directPolicy(provider, target);
    if (!profileLock && policy.binding.kind === "profile-incompatible")
      return {
        availability: false,
        evidence: "profile",
      };
    const orderResolution = profileOrder(
      provider,
      ref.modelId,
      ref.preferredProfileId,
      ref.lockedProfileId,
    );
    const boundProfileId =
      !profileLock && policy.binding.kind === "profile" ? policy.binding.profileId : void 0;
    const ownership = profileLock
      ? {
          reason: "user-lock",
          source: requiredProfileSource(provider, profileLock, target, true),
        }
      : boundProfileId
        ? {
            reason: "provider-binding",
            source: requiredProfileSource(provider, boundProfileId, target, false),
          }
        : policy.required
          ? {
              reason: "configured-auth",
              source: policy.direct,
            }
          : void 0;
    const decision = selectProviderModelAuthSources({
      provider,
      plan: buildProviderModelAuthSourcePlan({
        ...(ownership ? { ownership } : {}),
        profiles: orderResolution.profileIds.map((profileId) =>
          automaticProfileSource(provider, profileId, target),
        ),
        preferredProfileId: ref.preferredProfileId,
        explicitOrder: orderResolution.hasExplicitOrder,
        ...(policy.hasDirectFallback ? { fallback: policy.direct } : {}),
      }),
    });
    if (decision.kind === "rejected")
      return {
        availability: false,
        ...(decision.source
          ? {
              selectedProfileId: decision.source.profileId,
              selectedAuthMode: decision.source.mode,
            }
          : {}),
        evidence: "profile",
      };
    return sourceEvaluation(decision.selection);
  };
  const resolveProviderAuthAvailability = (provider, ref = {}) =>
    resolveProviderEvaluation(provider, ref).availability;
  const evaluateModelAuth = (rawProvider, ref = {}) => {
    const provider = normalizeProviderIdForAuth(rawProvider);
    if (provider !== OPENAI_PROVIDER_ID)
      return {
        ...resolveProviderEvaluation(provider, ref),
        routeResolution: null,
      };
    const routeResolution = resolveRoutes(ref);
    if (!routeResolution)
      return {
        availability: void 0,
        routeResolution: null,
      };
    if (routeResolution.kind === "incompatible")
      return {
        availability: false,
        routeResolution,
      };
    if (routeResolution.kind === "indeterminate") {
      const rejection = automaticSourceRejection(provider, ref, prepareAuthTarget(provider, ref));
      if (rejection)
        return {
          availability: false,
          routeResolution,
          ...(rejection.source
            ? {
                evidence: "profile",
                selectedAuthMode: rejection.source.mode,
                selectedProfileId: rejection.source.profileId,
              }
            : { evidence: "profile" }),
        };
      return {
        availability: void 0,
        routeResolution,
      };
    }
    const modelLock = ref.lockedProfileId?.trim();
    const configuredAuthMode = resolveConfiguredOpenAIAuthMode(params.cfg);
    const awsSdkTerminal = !modelLock && configuredAuthMode === "aws-sdk";
    const baseTarget = prepareAuthTarget(provider, ref);
    const basePolicy = directPolicy(provider, baseTarget);
    if (!modelLock && !awsSdkTerminal && basePolicy.binding.kind === "profile-incompatible")
      return {
        availability: false,
        routeResolution,
      };
    const bindingProfileId =
      !modelLock && !awsSdkTerminal && basePolicy.binding.kind === "profile"
        ? basePolicy.binding.profileId
        : void 0;
    const selectedConfiguredMode = awsSdkTerminal
      ? "aws-sdk"
      : bindingProfileId
        ? void 0
        : (configuredAuthMode ?? (basePolicy.hasDirectMaterial ? "api-key" : void 0));
    const automaticRouteAuthMode =
      basePolicy.hasDirectFallback && configuredAuthMode && !basePolicy.required
        ? void 0
        : selectedConfiguredMode;
    const targetForMode = (mode) => {
      const requirement = resolveProviderModelRouteAuthRequirement(mode);
      const route = requirement
        ? routeResolution.routes.find((candidate) => candidate.authRequirement === requirement)
        : void 0;
      return route
        ? {
            ...ref,
            api: route.api,
            baseUrl: route.baseUrl,
            authRequirement: route.authRequirement,
          }
        : baseTarget;
    };
    const policy = directPolicy(
      provider,
      targetForMode(selectedConfiguredMode ?? basePolicy.direct.mode),
    );
    const orderResolution = profileOrder(
      provider,
      ref.modelId,
      ref.preferredProfileId,
      ref.lockedProfileId,
    );
    let profileIds = orderResolution.profileIds;
    if (profileIds.length === 0 && !modelLock && !bindingProfileId && !policy.required) {
      const evidenceProfileId = firstProfileEvidenceId(provider);
      if (evidenceProfileId) profileIds = [evidenceProfileId];
    }
    const ownership = modelLock
      ? {
          reason: "user-lock",
          source: requiredProfileSource(
            provider,
            modelLock,
            targetForMode(profileMode(modelLock)),
            true,
          ),
        }
      : bindingProfileId
        ? {
            reason: "provider-binding",
            source: requiredProfileSource(
              provider,
              bindingProfileId,
              targetForMode(profileMode(bindingProfileId)),
              false,
            ),
          }
        : policy.required
          ? {
              reason: "configured-auth",
              source: policy.direct,
            }
          : void 0;
    const sourcePlan = buildProviderModelAuthSourcePlan({
      ...(ownership ? { ownership } : {}),
      profiles: profileIds.map((profileId) =>
        automaticProfileSource(provider, profileId, targetForMode(profileMode(profileId))),
      ),
      preferredProfileId: ref.preferredProfileId,
      explicitOrder: orderResolution.hasExplicitOrder,
      ...(policy.hasDirectFallback ? { fallback: policy.direct } : {}),
    });
    const syntheticCodexOwnsAuth =
      !modelLock &&
      !selectedConfiguredMode &&
      (policy.binding.kind === "none" ||
        (policy.binding.kind === "marker" && !policy.markerUsable)) &&
      sourcePlan.kind === "automatic" &&
      !sourcePlan.profiles.explicitOrder &&
      (sourcePlan.profiles.kind === "empty" || sourcePlan.profiles.kind === "all-unavailable") &&
      synthetic.has("codex") &&
      routeResolution.routes.every((route) =>
        route.runtimePolicy?.compatibleIds?.some(
          (runtimeId) => runtimeId.trim().toLowerCase() === "codex",
        ),
      );
    const routeAuthDecision = selectOpenAIModelRouteAuth({
      resolution: routeResolution,
      sourcePlan,
      configuredAuthMode: automaticRouteAuthMode,
      ...(syntheticCodexOwnsAuth ? { runtimeAuthOwner: { id: "codex" } } : {}),
    });
    if (routeAuthDecision.kind === "deferred" && syntheticCodexOwnsAuth)
      return {
        availability: void 0,
        routeResolution,
        evidence: "synthetic",
      };
    if (routeAuthDecision.kind !== "selected") {
      const rejectedSource =
        routeAuthDecision.kind === "rejected" ? routeAuthDecision.source : void 0;
      const projectRejectedSource =
        routeAuthDecision.kind === "rejected" &&
        rejectedSource &&
        (routeAuthDecision.reason === "all-cooldown" || rejectedSource.readiness === "unavailable")
          ? rejectedSource
          : void 0;
      const rejectedRequirement = resolveProviderModelRouteAuthRequirement(rejectedSource?.mode);
      const rejectedRoute =
        routeAuthDecision.kind === "rejected" ? routeAuthDecision.route : void 0;
      const rejectedSourceRoute = rejectedRequirement
        ? routeResolution.routes.find(
            (candidate) => candidate.authRequirement === rejectedRequirement,
          )
        : void 0;
      const selectedRoute =
        rejectedRoute ??
        rejectedSourceRoute ??
        (routeResolution.routes.length === 1 ? routeResolution.routes[0] : void 0);
      return {
        availability: false,
        routeResolution,
        ...(projectRejectedSource
          ? {
              selectedProfileId: projectRejectedSource.profileId,
              selectedAuthMode: projectRejectedSource.mode,
              evidence: "profile",
            }
          : {}),
        ...(selectedRoute ? { selectedRoute } : {}),
      };
    }
    const selectedRoute = routeAuthDecision.selection.route;
    const evaluation = sourceEvaluation(routeAuthDecision.selection);
    const syntheticSubscriptionRoute = routeResolution.routes.find(
      (route) => route.authRequirement === "subscription",
    );
    if (
      syntheticCodexOwnsAuth &&
      evaluation.availability !== true &&
      synthetic.has("codex") &&
      syntheticSubscriptionRoute
    )
      return {
        availability: void 0,
        routeResolution,
        evidence: "synthetic",
      };
    return {
      ...evaluation,
      availability:
        evaluation.availability === void 0 && !evaluation.evidence
          ? false
          : evaluation.availability,
      routeResolution,
      selectedRoute,
    };
  };
  return {
    evaluateModelAuth,
    resolveProviderAuthAvailability,
    hasSyntheticAuth: (provider) =>
      synthetic.has(normalizeProviderIdForAuth(provider)) ||
      synthetic.has(normalizeProvider(provider)) ||
      (normalizeProviderIdForAuth(provider) === OPENAI_PROVIDER_ID && synthetic.has("codex")) ||
      hasSyntheticLocalProviderAuthConfig({
        cfg: params.cfg,
        provider: normalizeProviderIdForAuth(provider),
      }),
  };
}
//#endregion
export { createModelAuthAvailabilityResolver as t };
