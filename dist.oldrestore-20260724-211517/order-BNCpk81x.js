import { n as evaluateStoredCredentialEligibility } from "./credential-state-DvOWxJSx.js";
import { n as listProfilesForProvider, t as dedupeProfileIds } from "./profile-list-I4BheGlK.js";
import { r as resolveProviderIdForAuth } from "./provider-auth-aliases-RaEzqkSo.js";
import {
  n as findNormalizedProviderValue,
  r as normalizeProviderId,
} from "./provider-id-BIcU_2-A.js";
import {
  o as isProfileInCooldown,
  s as resolveProfileUnusableUntil,
  t as clearExpiredCooldowns,
} from "./usage-state-BQLO_Yob.js";
//#region src/agents/auth-profiles/order.ts
/**
 * Auth profile ordering and eligibility.
 * Resolves configured/stored auth order, provider aliases, cooldowns, and
 * profile compatibility for provider auth selection.
 */
const OPENAI_PROVIDER_ID = "openai";
const OPENAI_CODEX_PROVIDER_ID = "openai";
function isOpenAIApiKeyCompatibleWithCodexAuth(params) {
  if (params.providerAuthKey !== OPENAI_CODEX_PROVIDER_ID) return false;
  const providerKey = resolveProviderIdForAuth(params.profileProvider ?? "", {
    config: params.cfg,
    ...params.authAliasLookupParams,
  });
  const mode = params.credential?.type ?? params.profileMode;
  return providerKey === OPENAI_PROVIDER_ID && mode === "api_key";
}
function isCredentialProviderCompatibleWithAuthProvider(params) {
  return (
    resolveProviderIdForAuth(params.credential.provider, {
      config: params.cfg,
      ...params.authAliasLookupParams,
    }) === params.providerAuthKey ||
    isOpenAIApiKeyCompatibleWithCodexAuth({
      cfg: params.cfg,
      authAliasLookupParams: params.authAliasLookupParams,
      providerAuthKey: params.providerAuthKey,
      credential: params.credential,
      profileProvider: params.credential.provider,
    })
  );
}
/** Returns true when a stored credential can authenticate the requested provider. */
function isStoredCredentialCompatibleWithAuthProvider(params) {
  return isCredentialProviderCompatibleWithAuthProvider({
    cfg: params.cfg,
    authAliasLookupParams: params.authAliasLookupParams,
    providerAuthKey: resolveProviderIdForAuth(params.provider, {
      config: params.cfg,
      ...params.authAliasLookupParams,
    }),
    credential: params.credential,
  });
}
function isConfiguredProfileCompatibleWithAuthProvider(params) {
  return (
    resolveProviderIdForAuth(params.provider, { config: params.cfg }) === params.providerAuthKey ||
    isOpenAIApiKeyCompatibleWithCodexAuth({
      cfg: params.cfg,
      providerAuthKey: params.providerAuthKey,
      credential: params.credential,
      profileProvider: params.provider,
      profileMode: params.mode,
    })
  );
}
function listProfilesCompatibleWithAuthProvider(params) {
  if (params.providerAuthKey !== OPENAI_CODEX_PROVIDER_ID)
    return listProfilesForProvider(params.store, params.provider);
  return Object.entries(params.store.profiles)
    .filter(([, credential]) =>
      isCredentialProviderCompatibleWithAuthProvider({
        cfg: params.cfg,
        providerAuthKey: params.providerAuthKey,
        credential,
      }),
    )
    .map(([profileId]) => profileId);
}
function resolveProviderAuthMode(cfg, provider) {
  const providers = cfg?.models?.providers;
  if (!providers) return;
  const auth = findNormalizedProviderValue(providers, provider)?.auth;
  return typeof auth === "string" ? auth : void 0;
}
function providerAllowsAwsSdkAuth(cfg, provider) {
  return resolveProviderAuthMode(cfg, provider) === "aws-sdk";
}
/** Returns true when config declares an aws-sdk auth profile for a provider. */
function isConfiguredAwsSdkAuthProfileForProvider(params) {
  const profileConfig = params.cfg?.auth?.profiles?.[params.profileId];
  if (!profileConfig || profileConfig.mode !== "aws-sdk") return false;
  const providerAuthKey = resolveProviderIdForAuth(params.provider, { config: params.cfg });
  if (resolveProviderIdForAuth(profileConfig.provider, { config: params.cfg }) !== providerAuthKey)
    return false;
  return providerAllowsAwsSdkAuth(params.cfg, params.provider);
}
/** Resolves whether a profile can be used for a provider right now. */
function resolveAuthProfileEligibility(params) {
  const providerAuthKey = resolveProviderIdForAuth(params.provider, { config: params.cfg });
  const cred = params.store.profiles[params.profileId];
  if (!cred) {
    if (
      isConfiguredAwsSdkAuthProfileForProvider({
        cfg: params.cfg,
        provider: params.provider,
        profileId: params.profileId,
      })
    )
      return {
        eligible: true,
        reasonCode: "ok",
      };
    return {
      eligible: false,
      reasonCode: "profile_missing",
    };
  }
  if (
    !isCredentialProviderCompatibleWithAuthProvider({
      cfg: params.cfg,
      providerAuthKey,
      credential: cred,
    })
  )
    return {
      eligible: false,
      reasonCode: "provider_mismatch",
    };
  const profileConfig = params.cfg?.auth?.profiles?.[params.profileId];
  if (profileConfig) {
    if (
      !isConfiguredProfileCompatibleWithAuthProvider({
        cfg: params.cfg,
        providerAuthKey,
        provider: profileConfig.provider,
        mode: profileConfig.mode,
        credential: cred,
      })
    )
      return {
        eligible: false,
        reasonCode: "provider_mismatch",
      };
    if (profileConfig.mode !== cred.type) {
      if (!(profileConfig.mode === "oauth" && cred.type === "token"))
        return {
          eligible: false,
          reasonCode: "mode_mismatch",
        };
    }
  }
  const credentialEligibility = evaluateStoredCredentialEligibility({
    credential: cred,
    now: params.now,
  });
  return {
    eligible: credentialEligibility.eligible,
    reasonCode: credentialEligibility.reasonCode,
  };
}
/** Resolves ordered usable auth profiles plus whether an explicit order owns selection. */
function resolveAuthProfileOrderWithMetadata(params) {
  const { cfg, store, provider, preferredProfile, forModel } = params;
  const providerKey = normalizeProviderId(provider);
  const providerAuthKey = resolveProviderIdForAuth(provider, { config: cfg });
  const now = Date.now();
  clearExpiredCooldowns(store, now);
  const openAIOrderAliasProvider =
    providerAuthKey === OPENAI_CODEX_PROVIDER_ID || providerKey === OPENAI_CODEX_PROVIDER_ID
      ? OPENAI_PROVIDER_ID
      : void 0;
  const directStoredOrder =
    resolveAuthOrder(store.order, providerAuthKey) ?? resolveAuthOrder(store.order, providerKey);
  const aliasStoredOrder = openAIOrderAliasProvider
    ? resolveAuthOrder(store.order, openAIOrderAliasProvider)
    : void 0;
  const directConfiguredOrder =
    resolveAuthOrder(cfg?.auth?.order, providerAuthKey) ??
    resolveAuthOrder(cfg?.auth?.order, providerKey);
  const aliasConfiguredOrder = openAIOrderAliasProvider
    ? resolveAuthOrder(cfg?.auth?.order, openAIOrderAliasProvider)
    : void 0;
  const directExplicitOrder = directStoredOrder ?? directConfiguredOrder;
  const aliasExplicitOrder = aliasStoredOrder ?? aliasConfiguredOrder;
  const explicitOrderFromStore =
    directStoredOrder !== void 0 || (directExplicitOrder === void 0 && aliasStoredOrder !== void 0);
  const explicitProfiles = cfg?.auth?.profiles
    ? Object.entries(cfg.auth.profiles)
        .filter(([profileId, profile]) =>
          isConfiguredProfileCompatibleWithAuthProvider({
            cfg,
            providerAuthKey,
            provider: profile.provider,
            mode: profile.mode,
            credential: store.profiles[profileId],
          }),
        )
        .map(([profileId]) => profileId)
    : [];
  const storeProfiles = listProfilesCompatibleWithAuthProvider({
    cfg,
    store,
    provider,
    providerAuthKey,
  });
  const nativeStoreProfiles =
    openAIOrderAliasProvider && providerAuthKey === OPENAI_CODEX_PROVIDER_ID
      ? storeProfiles.filter((profileId) =>
          isNativeCredentialProviderCompatibleWithAuthProvider({
            cfg,
            providerAuthKey,
            credential: store.profiles[profileId],
          }),
        )
      : [];
  const explicitOrder =
    directExplicitOrder ??
    (aliasExplicitOrder
      ? mergeAliasOrderWithNativeProfiles({
          aliasOrder: aliasExplicitOrder,
          nativeProfiles: nativeStoreProfiles,
        })
      : void 0);
  const baseOrder =
    explicitOrder ?? (explicitProfiles.length > 0 ? explicitProfiles : storeProfiles);
  if (baseOrder.length === 0)
    return {
      profileIds: [],
      hasExplicitOrder: explicitOrder !== void 0,
    };
  const isValidProfile = (profileId) => {
    const eligibility = resolveAuthProfileEligibility({
      cfg,
      store,
      provider,
      profileId,
      now,
    });
    return (
      eligibility.eligible ||
      (params.readinessMode === "read-only" && eligibility.reasonCode === "unresolved_ref")
    );
  };
  let filtered = baseOrder.filter(isValidProfile);
  let repairedFallbackToStoreProfiles = false;
  const allBaseProfilesMissing = baseOrder.every((profileId) => !store.profiles[profileId]);
  if (
    filtered.length === 0 &&
    allBaseProfilesMissing &&
    (explicitOrderFromStore || explicitProfiles.length > 0)
  ) {
    filtered = storeProfiles.filter(isValidProfile);
    repairedFallbackToStoreProfiles = true;
  }
  const deduped = dedupeProfileIds(filtered);
  if (explicitOrder && explicitOrder.length > 0 && !repairedFallbackToStoreProfiles) {
    const available = [];
    const inCooldown = [];
    for (const profileId of deduped)
      if (isProfileInCooldown(store, profileId, now, forModel)) {
        const cooldownUntil =
          resolveProfileUnusableUntil(store.usageStats?.[profileId] ?? {}) ?? now;
        inCooldown.push({
          profileId,
          cooldownUntil,
        });
      } else available.push(profileId);
    const cooldownSorted = inCooldown
      .toSorted((a, b) => a.cooldownUntil - b.cooldownUntil)
      .map((entry) => entry.profileId);
    const ordered = [...available, ...cooldownSorted];
    if (preferredProfile && ordered.includes(preferredProfile))
      return {
        profileIds: [preferredProfile, ...ordered.filter((e) => e !== preferredProfile)],
        hasExplicitOrder: true,
      };
    return {
      profileIds: ordered,
      hasExplicitOrder: true,
    };
  }
  const sorted = orderProfilesByMode(deduped, store, now, forModel);
  if (preferredProfile && sorted.includes(preferredProfile))
    return {
      profileIds: [preferredProfile, ...sorted.filter((e) => e !== preferredProfile)],
      hasExplicitOrder: explicitOrder !== void 0,
    };
  return {
    profileIds: sorted,
    hasExplicitOrder: explicitOrder !== void 0,
  };
}
/** Resolves ordered usable auth profile ids for a provider. */
function resolveAuthProfileOrder(params) {
  return resolveAuthProfileOrderWithMetadata(params).profileIds;
}
function resolveAuthOrder(order, provider) {
  return findNormalizedProviderValue(order, provider);
}
function isNativeCredentialProviderCompatibleWithAuthProvider(params) {
  if (!params.credential) return false;
  return (
    resolveProviderIdForAuth(params.credential.provider, { config: params.cfg }) ===
    params.providerAuthKey
  );
}
function mergeAliasOrderWithNativeProfiles(params) {
  const nativeIds = new Set(params.nativeProfiles);
  return dedupeProfileIds(
    params.aliasOrder.some((profileId) => nativeIds.has(profileId))
      ? [...params.aliasOrder, ...params.nativeProfiles]
      : [...params.nativeProfiles, ...params.aliasOrder],
  );
}
function orderProfilesByMode(order, store, now, forModel) {
  const available = [];
  const inCooldown = [];
  for (const profileId of order)
    if (isProfileInCooldown(store, profileId, now, forModel)) inCooldown.push(profileId);
    else available.push(profileId);
  const sorted = available
    .map((profileId) => {
      const type = store.profiles[profileId]?.type;
      return {
        profileId,
        typeScore: type === "oauth" ? 0 : type === "token" ? 1 : type === "api_key" ? 2 : 3,
        lastUsed: store.usageStats?.[profileId]?.lastUsed ?? 0,
      };
    })
    .toSorted((a, b) => {
      if (a.typeScore !== b.typeScore) return a.typeScore - b.typeScore;
      return a.lastUsed - b.lastUsed;
    })
    .map((entry) => entry.profileId);
  const cooldownSorted = inCooldown
    .map((profileId) => ({
      profileId,
      cooldownUntil: resolveProfileUnusableUntil(store.usageStats?.[profileId] ?? {}) ?? now,
    }))
    .toSorted((a, b) => a.cooldownUntil - b.cooldownUntil)
    .map((entry) => entry.profileId);
  return [...sorted, ...cooldownSorted];
}
//#endregion
export {
  resolveAuthProfileOrderWithMetadata as a,
  resolveAuthProfileOrder as i,
  isStoredCredentialCompatibleWithAuthProvider as n,
  resolveAuthProfileEligibility as r,
  isConfiguredAwsSdkAuthProfileForProvider as t,
};
