import { i as resolveAuthProfileDisplayLabel } from "./auth-profiles-CX7JDmZ9.js";
import {
  a as resolveTokenExpiryState,
  n as evaluateStoredCredentialEligibility,
  t as DEFAULT_OAUTH_REFRESH_MARGIN_MS,
} from "./credential-state-DvOWxJSx.js";
import { i as readExternalCliBootstrapCredential } from "./external-auth-aN0UYCd0.js";
import { o as asDateTimestampMs } from "./number-coercion-CJQ8TR--.js";
import { r as resolveEffectiveOAuthCredential$1 } from "./oauth-CqNVt6lC.js";
import { i as resolveAuthProfileOrder } from "./order-BNCpk81x.js";
import { r as resolveProviderIdForAuth } from "./provider-auth-aliases-RaEzqkSo.js";
import {
  n as findNormalizedProviderValue,
  r as normalizeProviderId,
} from "./provider-id-BIcU_2-A.js";
import { p as normalizeUniqueStringEntries } from "./string-normalization-CRyoFBPt.js";
//#region src/agents/auth-profiles/effective-oauth.ts
/**
 * Effective OAuth credential resolver.
 * Delegates to the managed OAuth selector while allowing external CLI
 * bootstrap credentials to fill unusable local profile state.
 */
/** Resolves the effective OAuth credential, optionally reading external CLI bootstrap state. */
function resolveEffectiveOAuthCredential(params) {
  return resolveEffectiveOAuthCredential$1({
    store: params.store,
    profileId: params.profileId,
    credential: params.credential,
    readBootstrapCredential: ({ store, profileId, credential }) =>
      readExternalCliBootstrapCredential({
        store,
        profileId,
        credential,
        allowKeychainPrompt: params.allowKeychainPrompt ?? false,
      }),
  });
}
//#endregion
//#region src/agents/auth-health.ts
/**
 * Auth profile health summarization.
 * Classifies stored and runtime credentials into profile/provider rollups for
 * status commands and doctor output without prompting keychain access.
 */
const DEFAULT_OAUTH_WARN_MS = 1440 * 60 * 1e3;
/** Format a remaining-duration value for compact auth status displays. */
function formatRemainingShort(remainingMs, opts) {
  if (remainingMs === void 0 || Number.isNaN(remainingMs)) return "unknown";
  if (remainingMs <= 0) return "0m";
  const roundedMinutes = Math.round(remainingMs / 6e4);
  if (roundedMinutes < 1) return opts?.underMinuteLabel ?? "1m";
  const minutes = roundedMinutes;
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.round(minutes / 60);
  if (hours < 48) return `${hours}h`;
  return `${Math.round(hours / 24)}d`;
}
function resolveOAuthStatus(expiresAt, now, expiringWithinMs) {
  const normalizedExpiresAt = asDateTimestampMs(expiresAt);
  if (normalizedExpiresAt === void 0 || normalizedExpiresAt <= 0) return { status: "missing" };
  const remainingMs = normalizedExpiresAt - now;
  const expiryState = resolveTokenExpiryState(normalizedExpiresAt, now, { expiringWithinMs });
  if (expiryState === "invalid_expires" || expiryState === "missing") return { status: "missing" };
  if (expiryState === "expired")
    return {
      status: "expired",
      expiresAt: normalizedExpiresAt,
      remainingMs,
    };
  if (expiryState === "expiring")
    return {
      status: "expiring",
      expiresAt: normalizedExpiresAt,
      remainingMs,
    };
  return {
    status: "ok",
    expiresAt: normalizedExpiresAt,
    remainingMs,
  };
}
function buildProfileHealth(params) {
  const {
    profileId,
    credential,
    runtimeCredential,
    store,
    cfg,
    now,
    warnAfterMs,
    allowKeychainPrompt,
  } = params;
  const label = resolveAuthProfileDisplayLabel({
    cfg,
    store,
    profileId,
  });
  const source = "store";
  const healthCredential = runtimeCredential ?? credential;
  const provider = normalizeProviderId(healthCredential.provider);
  if (healthCredential.type === "api_key") {
    const eligibility = evaluateStoredCredentialEligibility({
      credential: healthCredential,
      now,
    });
    if (!eligibility.eligible)
      return {
        profileId,
        provider,
        type: "api_key",
        status: "missing",
        reasonCode: eligibility.reasonCode,
        source,
        label,
      };
    return {
      profileId,
      provider,
      type: "api_key",
      status: "static",
      source,
      label,
    };
  }
  if (healthCredential.type === "token") {
    const eligibility = evaluateStoredCredentialEligibility({
      credential: healthCredential,
      now,
    });
    if (!eligibility.eligible)
      return {
        profileId,
        provider,
        type: "token",
        status: eligibility.reasonCode === "expired" ? "expired" : "missing",
        reasonCode: eligibility.reasonCode,
        source,
        label,
      };
    const expiresAt =
      resolveTokenExpiryState(healthCredential.expires, now) === "valid"
        ? healthCredential.expires
        : void 0;
    if (!expiresAt)
      return {
        profileId,
        provider,
        type: "token",
        status: "static",
        source,
        label,
      };
    const {
      status,
      expiresAt: normalizedExpiresAt,
      remainingMs,
    } = resolveOAuthStatus(expiresAt, now, warnAfterMs);
    return {
      profileId,
      provider,
      type: "token",
      status,
      reasonCode: status === "expired" ? "expired" : void 0,
      expiresAt: normalizedExpiresAt,
      remainingMs,
      source,
      label,
    };
  }
  const storedEligibility = evaluateStoredCredentialEligibility({
    credential: healthCredential,
    now,
  });
  if (!storedEligibility.eligible && storedEligibility.reasonCode === "unresolved_ref")
    return {
      profileId,
      provider,
      type: "oauth",
      status: "missing",
      reasonCode: storedEligibility.reasonCode,
      source,
      label,
    };
  const effectiveCredential = resolveEffectiveOAuthCredential({
    store,
    profileId,
    credential: healthCredential,
    allowKeychainPrompt,
  });
  const eligibility = evaluateStoredCredentialEligibility({
    credential: effectiveCredential,
    now,
  });
  if (!eligibility.eligible)
    return {
      profileId,
      provider,
      type: "oauth",
      status: eligibility.reasonCode === "expired" ? "expired" : "missing",
      reasonCode: eligibility.reasonCode,
      source,
      label,
    };
  const oauthWarnAfterMs = Math.max(warnAfterMs, DEFAULT_OAUTH_REFRESH_MARGIN_MS);
  const {
    status: rawStatus,
    expiresAt,
    remainingMs,
  } = resolveOAuthStatus(effectiveCredential.expires, now, oauthWarnAfterMs);
  return {
    profileId,
    provider,
    type: "oauth",
    status: rawStatus,
    expiresAt,
    remainingMs,
    source,
    label,
  };
}
/** Build profile and provider auth health rollups from an auth profile store. */
function buildAuthHealthSummary(params) {
  const now = Date.now();
  const warnAfterMs = params.warnAfterMs ?? 864e5;
  const providerFilter = params.providers
    ? new Set(normalizeUniqueStringEntries(params.providers.map((p) => normalizeProviderId(p))))
    : null;
  const profiles = Object.entries(params.store.profiles)
    .filter(([_, cred]) =>
      providerFilter ? providerFilter.has(normalizeProviderId(cred.provider)) : true,
    )
    .map(([profileId, credential]) =>
      buildProfileHealth({
        profileId,
        credential,
        runtimeCredential: params.runtimeCredentialsByProvider?.get(
          normalizeProviderId(credential.provider),
        ),
        store: params.store,
        cfg: params.cfg,
        now,
        warnAfterMs,
        allowKeychainPrompt: params.allowKeychainPrompt,
      }),
    )
    .toSorted((a, b) => {
      if (a.provider !== b.provider) return a.provider.localeCompare(b.provider);
      return a.profileId.localeCompare(b.profileId);
    });
  const providersMap = /* @__PURE__ */ new Map();
  for (const profile of profiles) {
    const existing = providersMap.get(profile.provider);
    if (!existing)
      providersMap.set(profile.provider, {
        provider: profile.provider,
        status: "missing",
        profiles: [profile],
      });
    else existing.profiles.push(profile);
  }
  if (providerFilter) {
    for (const provider of providerFilter)
      if (!providersMap.has(provider))
        providersMap.set(provider, {
          provider,
          status: "missing",
          profiles: [],
        });
  }
  const resolveExplicitAuthOrder = (provider) => {
    const authProvider = resolveProviderIdForAuth(provider, { config: params.cfg });
    return (
      findNormalizedProviderValue(params.store.order, authProvider) ??
      findNormalizedProviderValue(params.store.order, provider) ??
      findNormalizedProviderValue(params.cfg?.auth?.order, authProvider) ??
      findNormalizedProviderValue(params.cfg?.auth?.order, provider)
    );
  };
  const resolveProviderStatusProfiles = (provider) => {
    const explicitOrder = resolveExplicitAuthOrder(provider.provider);
    if (explicitOrder && explicitOrder.length === 0) return [];
    const orderedProfiles = resolveAuthProfileOrder({
      cfg: params.cfg,
      store: params.store,
      provider: provider.provider,
    })
      .map((profileId) => provider.profiles.find((profile) => profile.profileId === profileId))
      .filter((profile) => Boolean(profile));
    if (orderedProfiles.length > 0) return orderedProfiles;
    if (explicitOrder)
      return explicitOrder
        .map((profileId) => provider.profiles.find((profile) => profile.profileId === profileId))
        .filter((profile) => Boolean(profile));
    return provider.profiles;
  };
  for (const provider of providersMap.values()) {
    const effectiveProfiles = resolveProviderStatusProfiles(provider);
    provider.effectiveProfiles = effectiveProfiles;
    if (effectiveProfiles.length === 0) {
      provider.status = "missing";
      provider.expiresAt = void 0;
      provider.remainingMs = void 0;
      continue;
    }
    let hasApiKeyProfile = false;
    let hasExpirableProfile = false;
    let hasExpired = false;
    let hasMissing = false;
    let hasExpiring = false;
    let earliestExpiry;
    for (const profile of effectiveProfiles) {
      if (profile.type === "api_key") {
        if (profile.status === "static") hasApiKeyProfile = true;
        else if (profile.status === "missing") hasMissing = true;
        continue;
      }
      if (profile.type !== "oauth" && profile.type !== "token") continue;
      hasExpirableProfile = true;
      if (typeof profile.expiresAt === "number" && Number.isFinite(profile.expiresAt))
        earliestExpiry =
          earliestExpiry === void 0
            ? profile.expiresAt
            : Math.min(earliestExpiry, profile.expiresAt);
      if (profile.status === "expired") hasExpired = true;
      else if (profile.status === "missing") hasMissing = true;
      else if (profile.status === "expiring") hasExpiring = true;
    }
    if (!hasExpirableProfile) {
      provider.status = hasMissing ? "missing" : hasApiKeyProfile ? "static" : "missing";
      continue;
    }
    if (earliestExpiry !== void 0) {
      provider.expiresAt = earliestExpiry;
      provider.remainingMs = provider.expiresAt - now;
    }
    if (hasExpired) provider.status = "expired";
    else if (hasMissing) provider.status = "missing";
    else if (hasExpiring) provider.status = "expiring";
    else provider.status = "ok";
  }
  return {
    now,
    warnAfterMs,
    profiles,
    providers: Array.from(providersMap.values()).toSorted((a, b) =>
      a.provider.localeCompare(b.provider),
    ),
  };
}
//#endregion
export { buildAuthHealthSummary as n, formatRemainingShort as r, DEFAULT_OAUTH_WARN_MS as t };
