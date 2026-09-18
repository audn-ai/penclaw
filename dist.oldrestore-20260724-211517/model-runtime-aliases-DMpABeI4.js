import {
  a as resolveCliRuntimeCanonicalProvider,
  n as listCliRuntimeModelBackendBindings,
  o as resolveCliRuntimeModelBackendBinding,
  r as listCliRuntimeProviderIds,
  t as isCliRuntimeModelBackendForProvider,
} from "./cli-backends-D2v5ATPw.js";
import { i as parseModelCatalogRef } from "./model-catalog-refs-BcuK-xC3.js";
import { t as resolveModelRuntimePolicy } from "./model-runtime-policy-CKdZrymL.js";
import { r as resolveProviderIdForAuth } from "./provider-auth-aliases-RaEzqkSo.js";
import { r as normalizeProviderId } from "./provider-id-BIcU_2-A.js";
import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
//#region src/agents/model-runtime-aliases.ts
/**
 * Resolves CLI runtime aliases to provider/model auth labels and execution ids.
 */
/** True for CLI runtime provider ids such as `claude-cli` and `google-gemini-cli`. */
function isCliRuntimeProvider(provider, params = {}) {
  const normalized = normalizeProviderId(provider);
  return listCliRuntimeProviderIds({
    config: params.config,
    env: params.env,
    includeSetupRegistry:
      params.includeSetupRegistry ?? (params.config !== void 0 || params.env !== void 0),
  }).includes(normalized);
}
function isCliRuntimeAlias(runtime) {
  const normalized = normalizeProviderId(runtime ?? "");
  return normalized
    ? listCliRuntimeModelBackendBindings().some((binding) => binding.runtime === normalized)
    : false;
}
function isCliRuntimeAliasForProvider(params) {
  return isCliRuntimeModelBackendForProvider({
    provider: params.provider,
    runtime: params.runtime,
    config: params.cfg,
  });
}
function canonicalizeRuntimeAliasProvider(provider, options = {}) {
  return (
    resolveCliRuntimeCanonicalProvider({
      runtime: provider,
      config: options.config,
      env: options.env,
      includeSetupRegistry:
        options.includeSetupRegistry ?? (options.config !== void 0 || options.env !== void 0),
    }) ?? provider
  );
}
function normalizeRuntimeModelRefForComparison(raw, options = {}) {
  const trimmed = raw.trim();
  const parsed = parseModelCatalogRef(trimmed);
  if (!parsed) return normalizeProviderId(canonicalizeRuntimeAliasProvider(trimmed, options));
  return `${normalizeProviderId(canonicalizeRuntimeAliasProvider(parsed.provider, options))}/${parsed.modelId}`;
}
function normalizeRuntimeModelRefWithoutAlias(raw) {
  const trimmed = raw.trim();
  const parsed = parseModelCatalogRef(trimmed);
  if (!parsed) return normalizeProviderId(trimmed);
  return `${parsed.provider}/${parsed.modelId}`;
}
function areRuntimeModelRefsEquivalent(left, right, options = {}) {
  if (normalizeRuntimeModelRefWithoutAlias(left) === normalizeRuntimeModelRefWithoutAlias(right))
    return true;
  return (
    normalizeRuntimeModelRefForComparison(left, options) ===
    normalizeRuntimeModelRefForComparison(right, options)
  );
}
function shouldPreferActiveRuntimeAliasAuthLabel(params) {
  if (!params.runtimeAliasModelEquivalent) return false;
  const selectedAuth = normalizeOptionalLowercaseString(params.selectedAuthLabel);
  const activeAuth = normalizeOptionalLowercaseString(params.activeAuthLabel);
  if (!activeAuth || activeAuth === "unknown") return false;
  return (
    selectedAuth === "unknown" ||
    (Boolean(selectedAuth?.startsWith("api-key")) &&
      (activeAuth.startsWith("oauth") || activeAuth.startsWith("token")))
  );
}
function resolveConfiguredRuntime(params) {
  const policy = resolveModelRuntimePolicy({
    config: params.cfg,
    provider: params.provider,
    modelId: params.modelId,
    agentId: params.agentId,
  });
  return {
    runtime: policy.policy?.id?.trim() || void 0,
    matchedProvider: policy.matchedProvider,
  };
}
function resolveProfileRuntimeAlias(params) {
  const profile = params.cfg?.auth?.profiles?.[params.profileId];
  if (!profile?.provider) return;
  const provider = normalizeProviderId(params.provider);
  const profileProvider = normalizeProviderId(profile.provider);
  if (!provider || !profileProvider) return;
  if (
    resolveProviderIdForAuth(provider, { config: params.cfg }) !==
    resolveProviderIdForAuth(profileProvider, { config: params.cfg })
  )
    return;
  if (profileProvider === provider) return;
  return resolveCliRuntimeModelBackendBinding({
    config: params.cfg,
    provider,
    runtime: profileProvider,
  })?.runtime;
}
function resolveCliRuntimeFromAuthProfile(params) {
  if (!params.cfg?.auth?.profiles) return;
  if (params.authProfileId?.trim())
    return resolveProfileRuntimeAlias({
      cfg: params.cfg,
      provider: params.provider,
      profileId: params.authProfileId.trim(),
    });
  const provider = normalizeProviderId(params.provider);
  const providerAuthKey = resolveProviderIdForAuth(provider, { config: params.cfg });
  const orderedProfileIds = [
    ...(params.cfg.auth.order?.[providerAuthKey] ?? []),
    ...(providerAuthKey === provider ? [] : (params.cfg.auth.order?.[provider] ?? [])),
  ];
  for (const profileId of orderedProfileIds) {
    const profile = params.cfg.auth.profiles[profileId];
    if (!profile?.provider) continue;
    if (resolveProviderIdForAuth(profile.provider, { config: params.cfg }) !== providerAuthKey)
      continue;
    return resolveProfileRuntimeAlias({
      cfg: params.cfg,
      provider,
      profileId,
    });
  }
  const compatibleProfileIds = Object.entries(params.cfg.auth.profiles)
    .filter(([, profile]) => {
      if (!profile?.provider) return false;
      return resolveProviderIdForAuth(profile.provider, { config: params.cfg }) === providerAuthKey;
    })
    .map(([profileId]) => profileId);
  if (compatibleProfileIds.length !== 1) return;
  const [profileId] = compatibleProfileIds;
  return profileId
    ? resolveProfileRuntimeAlias({
        cfg: params.cfg,
        provider,
        profileId,
      })
    : void 0;
}
function resolveCliRuntimeExecutionProvider(params) {
  const provider = normalizeProviderId(params.provider);
  const { runtime, matchedProvider } = resolveConfiguredRuntime({
    ...params,
    provider,
  });
  if (runtime === "openclaw") return;
  if (!runtime || runtime === "auto")
    return resolveCliRuntimeFromAuthProfile({
      ...params,
      provider,
    });
  const effectiveProvider = provider || normalizeProviderId(matchedProvider ?? "");
  if (!effectiveProvider) return;
  return resolveCliRuntimeModelBackendBinding({
    config: params.cfg,
    provider: effectiveProvider,
    runtime,
  })?.runtime;
}
//#endregion
export {
  resolveCliRuntimeExecutionProvider as a,
  isCliRuntimeProvider as i,
  isCliRuntimeAlias as n,
  shouldPreferActiveRuntimeAliasAuthLabel as o,
  isCliRuntimeAliasForProvider as r,
  areRuntimeModelRefsEquivalent as t,
};
