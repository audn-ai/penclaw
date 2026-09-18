import path from "node:path";
import { s as resolveDefaultAgentDir } from "./agent-scope-config-DVIR1nBa.js";
import { t as formatCliCommand } from "./command-format-H_Arqann.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { s as readCodexCliCredentialsCached } from "./external-auth-aN0UYCd0.js";
import { n as externalCliDiscoveryForProviderAuth } from "./external-cli-discovery-To6-j7MZ.js";
import { t as resolveEnvApiKey } from "./model-auth-env-DLe5znyS.js";
import {
  a as NON_ENV_SECRETREF_MARKER,
  b as resolveProviderEnvAuthLookupMaps,
  c as SECRETREF_ENV_HEADER_MARKER_PREFIX,
  d as isNonSecretApiKeyMarker,
  n as CUSTOM_LOCAL_AUTH_MARKER,
  p as isSecretRefHeaderValueMarker,
  u as isKnownEnvApiKeyMarker,
} from "./model-auth-markers-CA2Xy59Z.js";
import { n as ProviderAuthError } from "./model-auth-runtime-shared-BVzqP6NP.js";
import { o as normalizeProviderId } from "./model-selection-normalize-BoKGJiBx.js";
import { t as normalizeOptionalSecretInput } from "./normalize-secret-input-Df_qhWv_.js";
import { n as resolveApiKeyForProfile } from "./oauth-CqNVt6lC.js";
import "./config-BDv-QbJ6.js";
import { t as OAuthRefreshFailureError } from "./oauth-refresh-failure-CHdq_iT5.js";
import { A as resolveMergedModelProviderConfig } from "./openai-routing-Cu28Ynzk.js";
import {
  i as resolveAuthProfileOrder,
  n as isStoredCredentialCompatibleWithAuthProvider,
  t as isConfiguredAwsSdkAuthProfileForProvider,
} from "./order-BNCpk81x.js";
import { i as resolveAuthStorePathForDisplay } from "./path-resolve-8wkj2l4Z.js";
import { n as listProfilesForProvider } from "./profile-list-I4BheGlK.js";
import "./auth-profiles-CX7JDmZ9.js";
import {
  i as getModelProviderRequestTransport,
  n as attachModelProviderRequestTransport,
} from "./provider-request-config-DpW-uV6A.js";
import {
  V as shouldDeferProviderSyntheticProfileAuthWithPlugin,
  j as resolveProviderSyntheticAuthWithPlugin,
  o as buildProviderMissingAuthMessageWithPlugin,
} from "./provider-runtime-DyIHJ2cX.js";
import { f as resolveOwningPluginIdsForProviderRef } from "./providers-D0H29WPB.js";
import { c as resolveDefaultSecretProviderAlias } from "./ref-contract-DVV0zYUk.js";
import {
  b as selectApplicableRuntimeConfig,
  i as getRuntimeConfigSnapshot,
  l as hashRuntimeConfigValue,
  s as getRuntimeConfigSourceSnapshot,
} from "./runtime-snapshot-BbbqRiDR.js";
import { i as mintSecretSentinel } from "./sentinel-Ccb6pnS1.js";
import { n as getShellEnvAppliedKeys } from "./shell-env-DTBGUs4j.js";
import { i as ensureAuthProfileStore } from "./store-B7DoDdVM.js";
import "./model-selection-DOlkTrQa.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
import { p as normalizeUniqueStringEntries } from "./string-normalization-CRyoFBPt.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
import { n as resolveRuntimeSyntheticAuthProviderRefState } from "./synthetic-auth.runtime.js";
import { s as coerceSecretRef } from "./types.secrets-BV0ywRAy.js";
//#region src/agents/model-auth.ts
/**
 * Resolves model-provider credentials from config, env, auth profiles, and
 * provider synthetic auth hooks. This module is the shared auth boundary for
 * runtime dispatch, setup checks, and model metadata reporting.
 */
function sentinelizeSecretRefProfileApiKey(params) {
  const credential = params.store.profiles[params.profileId];
  return (credential?.type === "api_key"
    ? coerceSecretRef(credential.keyRef)
    : credential?.type === "token"
      ? coerceSecretRef(credential.tokenRef)
      : null) && params.enabled
    ? mintSecretSentinel(params.apiKey, { label: `model-auth:${params.provider}` })
    : params.apiKey;
}
const log = createSubsystemLogger("model-auth");
const OPENAI_PROVIDER_ID = "openai";
const OPENAI_CODEX_RESPONSES_API = "openai-chatgpt-responses";
function directOpenAIPlatformModelRequiresApiKey(params) {
  return (
    normalizeProviderId(params.provider) === OPENAI_PROVIDER_ID &&
    params.modelApi !== void 0 &&
    normalizeLowercaseStringOrEmpty(params.modelApi) !== OPENAI_CODEX_RESPONSES_API
  );
}
function isAuthModeAllowedForModel(params) {
  return !directOpenAIPlatformModelRequiresApiKey(params) || params.mode === "api-key";
}
function assertAuthModeAllowedForModel(params) {
  if (isAuthModeAllowedForModel(params)) return;
  throw new Error(
    `Auth profile "${params.profileId}" uses ${params.mode} auth, but ${params.provider}/${params.modelApi} requires an OpenAI API key profile.`,
  );
}
function resolveConfigAwareEnvApiKey(cfg, provider, workspaceDir, skipSetupProviderFallback) {
  return resolveEnvApiKey(provider, process.env, {
    config: cfg,
    workspaceDir,
    ...(skipSetupProviderFallback ? { skipSetupProviderFallback: true } : {}),
  });
}
function resolveProviderConfig(cfg, provider) {
  return resolveMergedModelProviderConfig(cfg, provider);
}
/** Builds stable env/synthetic auth lookup data for repeated provider checks. */
function createRuntimeProviderAuthLookup(params) {
  const env = params.env ?? process.env;
  const lookupParams = {
    config: params.cfg,
    workspaceDir: params.workspaceDir,
    env,
  };
  const syntheticAuthProviderRefs =
    params.includePluginSyntheticAuth === false
      ? void 0
      : resolveRuntimeSyntheticAuthProviderRefState(lookupParams);
  const authLookupMaps = resolveProviderEnvAuthLookupMaps(lookupParams);
  return {
    envApiKey: {
      aliasMap: authLookupMaps.aliasMap,
      candidateMap: authLookupMaps.envCandidateMap,
      authEvidenceMap: authLookupMaps.authEvidenceMap,
      skipSetupProviderFallback: true,
    },
    setupProviderFallbackRefs: authLookupMaps.setupProviderFallbackRefs,
    syntheticAuthProviderRefs: syntheticAuthProviderRefs?.complete
      ? syntheticAuthProviderRefs.refs
      : void 0,
    syntheticAuthProviderRefsComplete: syntheticAuthProviderRefs?.complete,
  };
}
function runtimeLookupAllowsSetupProviderFallback(params) {
  const refs = params.runtimeLookup?.setupProviderFallbackRefs;
  if (!refs?.length) return false;
  const normalizedProvider = normalizeProviderId(params.provider);
  const aliasTarget = params.runtimeLookup?.envApiKey.aliasMap?.[normalizedProvider];
  return refs.includes(normalizedProvider) || (aliasTarget ? refs.includes(aliasTarget) : false);
}
function resolveRuntimeEnvApiKeyLookupOptions(params) {
  const envApiKey = params.runtimeLookup?.envApiKey;
  if (!envApiKey) return;
  const skipSetupProviderFallback =
    envApiKey.skipSetupProviderFallback === true
      ? !runtimeLookupAllowsSetupProviderFallback(params)
      : envApiKey.skipSetupProviderFallback;
  return {
    ...envApiKey,
    ...(skipSetupProviderFallback !== void 0 ? { skipSetupProviderFallback } : {}),
  };
}
/** Reads a literal or env-secret marker for a custom provider entry. */
function getCustomProviderApiKey(cfg, provider) {
  const entry = resolveProviderConfig(cfg, provider);
  const literal = normalizeOptionalSecretInput(entry?.apiKey);
  if (literal) return literal;
  const ref = coerceSecretRef(entry?.apiKey);
  if (!ref) return;
  if (ref.source === "env") return ref.id.trim() || "secretref-managed";
  return NON_ENV_SECRETREF_MARKER;
}
function canResolveEnvSecretRefInReadOnlyPath(params) {
  const providerConfig = params.cfg?.secrets?.providers?.[params.provider];
  if (!providerConfig)
    return params.provider === resolveDefaultSecretProviderAlias(params.cfg ?? {}, "env");
  if (providerConfig.source !== "env") return false;
  const allowlist = providerConfig.allowlist;
  return !allowlist || allowlist.includes(params.id);
}
/** Resolves custom provider API keys that are usable without mutating secret stores. */
function resolveUsableCustomProviderApiKey(params) {
  const customProviderConfig = resolveProviderConfig(params.cfg, params.provider);
  const apiKeyRef = coerceSecretRef(customProviderConfig?.apiKey);
  if (apiKeyRef) {
    if (apiKeyRef.source !== "env") return null;
    const envVarName = apiKeyRef.id.trim();
    if (!envVarName) return null;
    if (
      !canResolveEnvSecretRefInReadOnlyPath({
        cfg: params.cfg,
        provider: apiKeyRef.provider,
        id: envVarName,
      })
    )
      return null;
    const envValue = normalizeOptionalSecretInput((params.env ?? process.env)[envVarName]);
    if (!envValue) return null;
    const applied = new Set(getShellEnvAppliedKeys());
    return {
      apiKey: params.secretSentinels
        ? mintSecretSentinel(envValue, { label: `model-auth:${params.provider}` })
        : envValue,
      source: resolveEnvSourceLabel({
        applied,
        envVars: [envVarName],
        label: `${envVarName} (models.json secretref)`,
      }),
    };
  }
  const customKey = getCustomProviderApiKey(params.cfg, params.provider);
  if (!customKey) return null;
  if (!isNonSecretApiKeyMarker(customKey))
    return {
      apiKey: customKey,
      source: "models.json",
    };
  if (isKnownEnvApiKeyMarker(customKey)) {
    const envValue = normalizeOptionalSecretInput((params.env ?? process.env)[customKey]);
    if (!envValue) return null;
    return {
      apiKey: envValue,
      source: resolveEnvSourceLabel({
        applied: new Set(getShellEnvAppliedKeys()),
        envVars: [customKey],
        label: `${customKey} (models.json marker)`,
      }),
    };
  }
  if (
    customProviderConfig &&
    isCustomLocalProviderConfig(customProviderConfig) &&
    (customProviderConfig.api === "openai-completions" || customProviderConfig.api === "ollama") &&
    customProviderConfig.baseUrl &&
    isLocalBaseUrl(customProviderConfig.baseUrl)
  )
    return {
      apiKey: customProviderConfig.api === "ollama" ? customKey : CUSTOM_LOCAL_AUTH_MARKER,
      source: "models.json (local marker)",
    };
  return null;
}
/** True when a custom provider has a literal/env/local key available now. */
function hasUsableCustomProviderApiKey(cfg, provider, env) {
  return Boolean(
    resolveUsableCustomProviderApiKey({
      cfg,
      provider,
      env,
    }),
  );
}
/** True when explicit provider config should outrank profile/environment auth. */
function shouldPreferExplicitConfigApiKeyAuth(cfg, provider) {
  const providerConfig = resolveProviderConfig(cfg, provider);
  return (
    resolveProviderAuthOverride(cfg, provider) === "api-key" &&
    providerConfig !== void 0 &&
    hasExplicitProviderApiKeyConfig(providerConfig)
  );
}
function resolveProviderAuthOverride(cfg, provider) {
  const auth = resolveProviderConfig(cfg, provider)?.auth;
  if (auth === "api-key" || auth === "aws-sdk" || auth === "oauth" || auth === "token") return auth;
}
function resolveDirectProviderCredentialMode(params) {
  const configuredMode = resolveProviderAuthOverride(params.cfg, params.provider);
  return configuredMode === "oauth" || configuredMode === "token"
    ? configuredMode
    : params.inferredMode;
}
function shouldUseImplicitAwsSdkAuth(params) {
  if (params.modelApi !== "bedrock-converse-stream") return false;
  if (normalizeProviderId(params.provider) !== "amazon-bedrock") return false;
  const providerConfig = resolveProviderConfig(params.cfg, params.provider);
  return (
    resolveProviderAuthOverride(params.cfg, params.provider) === void 0 &&
    (providerConfig === void 0 || !hasExplicitProviderApiKeyConfig(providerConfig))
  );
}
function profileTypeToAuthMode(type) {
  return type === "oauth" ? "oauth" : type === "token" ? "token" : "api-key";
}
function normalizeProviderEntryBaseUrlForBinding(baseUrl) {
  const trimmed = baseUrl?.trim();
  if (!trimmed) return;
  try {
    const parsed = new URL(trimmed);
    parsed.hash = "";
    parsed.search = "";
    parsed.pathname = parsed.pathname.replace(/\/+$/, "");
    return parsed.toString().replace(/\/+$/, "");
  } catch {
    return trimmed.toLowerCase().replace(/\/+$/, "");
  }
}
function providerEntriesShareBaseUrl(params) {
  const providerBaseUrl = normalizeProviderEntryBaseUrlForBinding(
    resolveProviderConfig(params.cfg, params.provider)?.baseUrl,
  );
  const credentialProviderBaseUrl = normalizeProviderEntryBaseUrlForBinding(
    resolveProviderConfig(params.cfg, params.credentialProvider)?.baseUrl,
  );
  return Boolean(
    providerBaseUrl && credentialProviderBaseUrl && providerBaseUrl === credentialProviderBaseUrl,
  );
}
function isBearerProfileCredential(credential) {
  return credential.type === "api_key" || credential.type === "token";
}
/** True when a bearer auth profile can safely satisfy a provider-entry apiKey reference. */
function canUseProfileAsProviderEntryApiKey(params) {
  if (!isBearerProfileCredential(params.credential)) return false;
  if (
    isStoredCredentialCompatibleWithAuthProvider({
      cfg: params.cfg,
      provider: params.provider,
      credential: params.credential,
    })
  )
    return true;
  return providerEntriesShareBaseUrl({
    cfg: params.cfg,
    provider: params.provider,
    credentialProvider: params.credential.provider,
  });
}
/** Classifies a provider entry apiKey as literal/profile/marker before resolving secrets. */
function resolveProviderEntryApiKeyProfileReference(params) {
  const providerConfig = resolveProviderConfig(params.cfg, params.provider);
  if (coerceSecretRef(providerConfig?.apiKey)) return { kind: "none" };
  const perEntryRawKey = normalizeOptionalSecretInput(providerConfig?.apiKey);
  if (!perEntryRawKey) return { kind: "none" };
  if (isNonSecretApiKeyMarker(perEntryRawKey)) return { kind: "marker" };
  const credential = params.store.profiles[perEntryRawKey];
  if (!credential)
    return {
      kind: "literal",
      apiKey: perEntryRawKey,
      source: "models.json",
    };
  if (!isBearerProfileCredential(credential))
    return {
      kind: "profile-incompatible",
      profileId: perEntryRawKey,
      credentialProvider: credential.provider,
      credentialType: credential.type,
      reason: "credential-class",
    };
  if (
    !canUseProfileAsProviderEntryApiKey({
      cfg: params.cfg,
      provider: params.provider,
      credential,
    })
  )
    return {
      kind: "profile-incompatible",
      profileId: perEntryRawKey,
      credentialProvider: credential.provider,
      credentialType: credential.type,
      reason: "provider-binding",
    };
  return {
    kind: "profile",
    profileId: perEntryRawKey,
    credential,
    mode: profileTypeToAuthMode(credential.type),
  };
}
/** Resolves a provider-entry apiKey profile reference into runtime auth when possible. */
async function resolveProviderEntryApiKeyBinding(params) {
  const reference = resolveProviderEntryApiKeyProfileReference(params);
  if (reference.kind === "none" || reference.kind === "marker") return { kind: "none" };
  if (reference.kind === "literal") return reference;
  if (reference.kind === "profile-incompatible") return reference;
  try {
    const resolved = await resolveApiKeyForProfile({
      cfg: params.cfg,
      store: params.store,
      profileId: reference.profileId,
      agentDir: params.agentDir,
    });
    if (!resolved)
      return {
        kind: "profile-unresolved",
        profileId: reference.profileId,
      };
    const resolvedProfileId = resolved.profileId ?? reference.profileId;
    return {
      kind: "profile-resolved",
      auth: {
        apiKey: sentinelizeSecretRefProfileApiKey({
          apiKey: resolved.apiKey,
          enabled: params.secretSentinels,
          profileId: resolvedProfileId,
          provider: params.provider,
          store: params.store,
        }),
        profileId: resolvedProfileId,
        source: `profile:${resolvedProfileId}`,
        mode: resolved.profileType ? profileTypeToAuthMode(resolved.profileType) : reference.mode,
      },
    };
  } catch (err) {
    return {
      kind: "profile-unresolved",
      profileId: reference.profileId,
      error: err,
    };
  }
}
function resolveConfiguredAwsSdkProfileAuth(params) {
  if (!isConfiguredAwsSdkAuthProfileForProvider(params)) return null;
  return {
    ...resolveAwsSdkAuthInfo(),
    profileId: params.profileId,
    source: `profile:${params.profileId}`,
  };
}
function isLocalBaseUrl(baseUrl) {
  try {
    let host = normalizeLowercaseStringOrEmpty(new URL(baseUrl).hostname);
    if (host.startsWith("[") && host.endsWith("]")) host = host.slice(1, -1);
    return (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === "0.0.0.0" ||
      host === "::1" ||
      host === "::ffff:7f00:1" ||
      host === "::ffff:127.0.0.1" ||
      host === "docker.orb.internal" ||
      host === "host.docker.internal" ||
      host === "host.orb.internal" ||
      host.endsWith(".local") ||
      isPrivateIpv4Host(host)
    );
  } catch {
    return false;
  }
}
function isPrivateIpv4Host(host) {
  if (!/^\d+\.\d+\.\d+\.\d+$/.test(host)) return false;
  const octets = host.split(".").map((part) => Number.parseInt(part, 10));
  if (octets.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) return false;
  const [a, b] = octets;
  return a === 10 || (a === 172 && b !== void 0 && b >= 16 && b <= 31) || (a === 192 && b === 168);
}
function hasExplicitProviderApiKeyConfig(providerConfig) {
  return (
    normalizeOptionalSecretInput(providerConfig.apiKey) !== void 0 ||
    coerceSecretRef(providerConfig.apiKey) !== null
  );
}
function isCustomLocalProviderConfig(providerConfig) {
  return (
    typeof providerConfig.baseUrl === "string" &&
    providerConfig.baseUrl.trim().length > 0 &&
    typeof providerConfig.api === "string" &&
    providerConfig.api.trim().length > 0 &&
    Array.isArray(providerConfig.models) &&
    providerConfig.models.length > 0
  );
}
function isManagedSecretRefApiKeyMarker(apiKey) {
  return apiKey?.trim() === NON_ENV_SECRETREF_MARKER;
}
function hasSecretRefProviderApiKey(cfg, provider) {
  const apiKey = resolveProviderConfig(cfg, provider)?.apiKey;
  if (coerceSecretRef(apiKey)) return true;
  return (
    typeof apiKey === "string" &&
    (isManagedSecretRefApiKeyMarker(apiKey) || apiKey.trim().startsWith("secretref-env:"))
  );
}
function providerConfigMatchesRuntimeSnapshot(params) {
  const inputProvider = resolveProviderConfig(params.inputConfig, params.provider);
  const runtimeProvider = resolveProviderConfig(params.runtimeConfig ?? void 0, params.provider);
  if (!inputProvider || !runtimeProvider) return false;
  const toComparableConfig = (providerConfig) => ({
    models: { providers: { [params.provider]: providerConfig } },
  });
  return (
    hashRuntimeConfigValue(toComparableConfig(inputProvider)) ===
    hashRuntimeConfigValue(toComparableConfig(runtimeProvider))
  );
}
function sentinelizeConfigSecretRefEnvApiKey(params) {
  if (!params.enabled) return params.apiKey;
  const runtimeConfig = getRuntimeConfigSnapshot();
  const runtimeSourceConfig = getRuntimeConfigSourceSnapshot();
  const configured = resolveProviderConfig(
    providerConfigMatchesRuntimeSnapshot({
      inputConfig: params.cfg,
      runtimeConfig,
      provider: params.provider,
    })
      ? (runtimeSourceConfig ?? params.cfg)
      : params.cfg,
    params.provider,
  )?.apiKey;
  const ref = coerceSecretRef(configured);
  const envId =
    ref?.source === "env"
      ? ref.id
      : typeof configured === "string" && configured.trim().startsWith("secretref-env:")
        ? configured.trim().slice(SECRETREF_ENV_HEADER_MARKER_PREFIX.length)
        : void 0;
  return envId && params.source.includes(envId)
    ? mintSecretSentinel(params.apiKey, { label: `model-auth:${params.provider}` })
    : params.apiKey;
}
function resolveLiteralProviderConfigApiKeyAuth(params) {
  const apiKey = normalizeOptionalSecretInput(
    resolveProviderConfig(params.cfg, params.provider)?.apiKey,
  );
  if (!apiKey || isNonSecretApiKeyMarker(apiKey)) return;
  return {
    apiKey,
    source: `models.providers.${params.provider}`,
    mode: resolveDirectProviderCredentialMode({
      cfg: params.cfg,
      provider: params.provider,
      inferredMode: "api-key",
    }),
  };
}
function resolveManagedSecretRefRuntimeProviderAuth(params) {
  const runtimeConfig = getRuntimeConfigSnapshot();
  const runtimeSourceConfig = getRuntimeConfigSourceSnapshot();
  if (params.cfg && params.cfg !== runtimeConfig && !runtimeSourceConfig) return;
  const usesRuntimeProvider =
    selectApplicableRuntimeConfig({
      inputConfig: params.cfg,
      runtimeConfig,
      runtimeSourceConfig,
    }) === runtimeConfig ||
    providerConfigMatchesRuntimeSnapshot({
      inputConfig: params.cfg,
      runtimeConfig,
      provider: params.provider,
    });
  if (
    !hasSecretRefProviderApiKey(
      usesRuntimeProvider ? (runtimeSourceConfig ?? void 0) : params.cfg,
      params.provider,
    )
  )
    return;
  if (!runtimeConfig || !usesRuntimeProvider) return;
  const resolved = resolveLiteralProviderConfigApiKeyAuth({
    cfg: runtimeConfig,
    provider: params.provider,
  });
  if (!resolved?.apiKey) return;
  return {
    ...resolved,
    apiKey: params.secretSentinels
      ? mintSecretSentinel(resolved.apiKey, { label: `model-auth:${params.provider}` })
      : resolved.apiKey,
  };
}
/** True when a custom local provider can use a synthetic no-auth placeholder. */
function hasSyntheticLocalProviderAuthConfig(params) {
  const providerConfig = resolveProviderConfig(params.cfg, params.provider);
  if (!providerConfig) return false;
  if (
    !(
      Boolean(providerConfig.api?.trim()) ||
      Boolean(providerConfig.baseUrl?.trim()) ||
      (Array.isArray(providerConfig.models) && providerConfig.models.length > 0)
    )
  )
    return false;
  const authOverride = resolveProviderAuthOverride(params.cfg, params.provider);
  if (authOverride && authOverride !== "api-key") return false;
  if (!isCustomLocalProviderConfig(providerConfig)) return false;
  if (hasExplicitProviderApiKeyConfig(providerConfig)) return false;
  return Boolean(providerConfig.baseUrl && isLocalBaseUrl(providerConfig.baseUrl));
}
function listProviderSyntheticAuthRefs(params) {
  const refs = [params.provider];
  const providerConfig = resolveProviderConfig(params.cfg, params.provider);
  if (params.modelApi) refs.push(params.modelApi);
  if (providerConfig?.api) refs.push(providerConfig.api);
  return normalizeUniqueStringEntries(refs.map((ref) => normalizeProviderId(ref)));
}
function shouldResolvePluginSyntheticAuth(params) {
  const syntheticAuthProviderRefs = params.runtimeLookup?.syntheticAuthProviderRefs;
  if (!syntheticAuthProviderRefs) return true;
  const eligibleRefs = new Set(
    normalizeUniqueStringEntries(syntheticAuthProviderRefs.map((ref) => normalizeProviderId(ref))),
  );
  if (eligibleRefs.size === 0) return false;
  return listProviderSyntheticAuthRefs(params).some((ref) => eligibleRefs.has(ref));
}
/** Fast auth-availability check for runtime provider/model selection. */
function hasRuntimeAvailableProviderAuth(params) {
  const provider = normalizeProviderId(params.provider);
  if (resolveProviderAuthOverride(params.cfg, provider) === "aws-sdk") return true;
  const envAuth = resolveEnvApiKey(provider, params.env, {
    config: params.cfg,
    workspaceDir: params.workspaceDir,
    ...resolveRuntimeEnvApiKeyLookupOptions({
      provider,
      runtimeLookup: params.runtimeLookup,
    }),
  });
  if (
    envAuth &&
    isAuthModeAllowedForModel({
      provider,
      modelApi: params.modelApi,
      mode: envAuth.source.includes("OAUTH_TOKEN") ? "oauth" : "api-key",
    })
  )
    return true;
  if (
    resolveUsableCustomProviderApiKey({
      cfg: params.cfg,
      provider,
      env: params.env,
    })
  )
    return true;
  if (
    resolveManagedSecretRefRuntimeProviderAuth({
      cfg: params.cfg,
      provider,
    })
  )
    return true;
  if (
    hasSyntheticLocalProviderAuthConfig({
      cfg: params.cfg,
      provider,
    })
  )
    return true;
  if (
    params.allowPluginSyntheticAuth !== false &&
    shouldResolvePluginSyntheticAuth({
      cfg: params.cfg,
      provider,
      runtimeLookup: params.runtimeLookup,
    }) &&
    resolveSyntheticLocalProviderAuth({
      cfg: params.cfg,
      provider,
    })
  )
    return true;
  return false;
}
function resolveProviderSyntheticRuntimeAuth(params) {
  const runtimeAuth = resolveManagedSecretRefRuntimeProviderAuth(params);
  if (runtimeAuth) return { auth: runtimeAuth };
  if (hasSecretRefProviderApiKey(params.cfg, params.provider))
    return { blockedOnManagedSecretRef: true };
  const resolveFromConfig = (config) => {
    const providerConfig = resolveProviderConfig(config, params.provider);
    return (
      resolveProviderSyntheticAuthWithPlugin({
        provider: params.provider,
        config,
        context: {
          config,
          provider: params.provider,
          providerConfig,
        },
        modelApi: params.modelApi,
      }) ?? void 0
    );
  };
  const directAuth = resolveFromConfig(params.cfg);
  if (!directAuth) return {};
  if (!isManagedSecretRefApiKeyMarker(directAuth.apiKey)) return { auth: directAuth };
  const runtimeConfig = getRuntimeConfigSnapshot();
  if (!runtimeConfig || runtimeConfig === params.cfg) return { blockedOnManagedSecretRef: true };
  const runtimePluginAuth = resolveFromConfig(runtimeConfig);
  const runtimeApiKey = runtimePluginAuth?.apiKey;
  if (!runtimePluginAuth || !runtimeApiKey || isNonSecretApiKeyMarker(runtimeApiKey))
    return { blockedOnManagedSecretRef: true };
  return {
    auth: {
      ...runtimePluginAuth,
      apiKey: params.secretSentinels
        ? mintSecretSentinel(runtimeApiKey, { label: `model-auth:${params.provider}` })
        : runtimeApiKey,
    },
  };
}
function resolveSyntheticLocalProviderAuth(params) {
  const syntheticProviderAuth =
    params.allowPluginSyntheticAuth === false ? {} : resolveProviderSyntheticRuntimeAuth(params);
  if (syntheticProviderAuth.auth) return syntheticProviderAuth.auth;
  if (syntheticProviderAuth.blockedOnManagedSecretRef) return null;
  if (!resolveProviderConfig(params.cfg, params.provider)) return null;
  if (hasSyntheticLocalProviderAuthConfig(params))
    return {
      apiKey: CUSTOM_LOCAL_AUTH_MARKER,
      source: `models.providers.${params.provider} (synthetic local key)`,
      mode: "api-key",
    };
  return null;
}
function resolveEnvSourceLabel(params) {
  return `${params.envVars.some((envVar) => params.applied.has(envVar)) ? "shell env: " : "env: "}${params.label}`;
}
function resolveAwsSdkAuthInfo() {
  const applied = new Set(getShellEnvAppliedKeys());
  if (process.env.AWS_BEARER_TOKEN_BEDROCK?.trim())
    return {
      mode: "aws-sdk",
      source: resolveEnvSourceLabel({
        applied,
        envVars: ["AWS_BEARER_TOKEN_BEDROCK"],
        label: "AWS_BEARER_TOKEN_BEDROCK",
      }),
    };
  if (process.env.AWS_ACCESS_KEY_ID?.trim() && process.env.AWS_SECRET_ACCESS_KEY?.trim())
    return {
      mode: "aws-sdk",
      source: resolveEnvSourceLabel({
        applied,
        envVars: ["AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY"],
        label: "AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY",
      }),
    };
  if (process.env.AWS_PROFILE?.trim())
    return {
      mode: "aws-sdk",
      source: resolveEnvSourceLabel({
        applied,
        envVars: ["AWS_PROFILE"],
        label: "AWS_PROFILE",
      }),
    };
  return {
    mode: "aws-sdk",
    source: "aws-sdk default chain",
  };
}
function shouldDeferSyntheticProfileAuth(params) {
  const providerConfig = resolveProviderConfig(params.cfg, params.provider);
  return (
    shouldDeferProviderSyntheticProfileAuthWithPlugin({
      provider: params.provider,
      config: params.cfg,
      modelApi: params.modelApi,
      context: {
        config: params.cfg,
        provider: params.provider,
        providerConfig,
        resolvedApiKey: params.resolvedApiKey,
      },
    }) === true
  );
}
function resolveScopedAuthProfileStore(params) {
  return ensureAuthProfileStore(params.agentDir, {
    externalCli: externalCliDiscoveryForProviderAuth(params),
  });
}
/** Resolves the credential that should be used for one provider request. */
async function resolveApiKeyForProvider(params) {
  const { provider, cfg, profileId, preferredProfile } = params;
  const agentDir = params.agentDir?.trim() || (cfg ? resolveDefaultAgentDir(cfg) : void 0);
  let scopedStore = params.store;
  if (profileId) {
    const awsSdkProfileAuth = resolveConfiguredAwsSdkProfileAuth({
      cfg,
      provider,
      profileId,
    });
    if (awsSdkProfileAuth) return awsSdkProfileAuth;
    const store =
      params.store ??
      resolveScopedAuthProfileStore({
        agentDir,
        cfg,
        provider,
        profileId,
        preferredProfile,
      });
    const configuredProfileType = store.profiles[profileId]?.type;
    if (configuredProfileType)
      assertAuthModeAllowedForModel({
        provider,
        modelApi: params.modelApi,
        profileId,
        mode: profileTypeToAuthMode(configuredProfileType),
      });
    const resolved = await resolveApiKeyForProfile({
      cfg,
      store,
      profileId,
      agentDir,
      forceRefresh: params.forceRefresh,
    });
    if (!resolved) throw new Error(`No credentials found for profile "${profileId}".`);
    const resolvedProfileId = resolved.profileId ?? profileId;
    const mode = resolved.profileType ?? store.profiles[resolvedProfileId]?.type;
    const result = {
      apiKey: sentinelizeSecretRefProfileApiKey({
        apiKey: resolved.apiKey,
        enabled: params.secretSentinels,
        profileId: resolvedProfileId,
        provider,
        store,
      }),
      profileId: resolvedProfileId,
      source: `profile:${resolvedProfileId}`,
      mode: mode ? profileTypeToAuthMode(mode) : "api-key",
    };
    assertAuthModeAllowedForModel({
      provider,
      modelApi: params.modelApi,
      profileId: resolvedProfileId,
      mode: result.mode,
    });
    if (
      !params.lockedProfile &&
      shouldDeferSyntheticProfileAuth({
        cfg,
        provider,
        resolvedApiKey: resolved.apiKey,
        modelApi: params.modelApi,
      })
    )
      return resolveApiKeyForProvider({
        ...params,
        store,
        profileId: void 0,
        lockedProfile: true,
      }).catch(() => result);
    return result;
  }
  if (params.allowAuthProfileFallback !== false && (cfg?.auth?.profiles || cfg?.auth?.order)) {
    scopedStore ??= resolveScopedAuthProfileStore({
      agentDir,
      cfg,
      provider,
      preferredProfile,
    });
    const configuredProfileOrder = resolveAuthProfileOrder({
      cfg,
      store: scopedStore,
      provider,
      preferredProfile,
      forModel: params.modelId,
    });
    for (const candidate of configuredProfileOrder) {
      const awsSdkProfileAuth = resolveConfiguredAwsSdkProfileAuth({
        cfg,
        provider,
        profileId: candidate,
      });
      if (awsSdkProfileAuth) return awsSdkProfileAuth;
    }
  }
  if (resolveProviderAuthOverride(cfg, provider) === "aws-sdk") return resolveAwsSdkAuthInfo();
  if (
    shouldUseImplicitAwsSdkAuth({
      cfg,
      provider,
      modelApi: params.modelApi,
    })
  )
    return resolveAwsSdkAuthInfo();
  if (params.credentialPrecedence === "env-first") {
    const envResolved = resolveConfigAwareEnvApiKey(
      cfg,
      provider,
      params.workspaceDir,
      params.skipSetupProviderFallback,
    );
    if (envResolved) {
      const resolvedMode = resolveDirectProviderCredentialMode({
        cfg,
        provider,
        inferredMode: envResolved.source.includes("OAUTH_TOKEN") ? "oauth" : "api-key",
      });
      if (
        !isAuthModeAllowedForModel({
          provider,
          modelApi: params.modelApi,
          mode: resolvedMode,
        })
      )
        return resolveApiKeyForProvider({
          ...params,
          credentialPrecedence: "profile-first",
        });
      return {
        apiKey: sentinelizeConfigSecretRefEnvApiKey({
          apiKey: envResolved.apiKey,
          source: envResolved.source,
          cfg,
          provider,
          enabled: params.secretSentinels,
        }),
        source: envResolved.source,
        mode: resolvedMode,
      };
    }
  }
  scopedStore ??= resolveScopedAuthProfileStore({
    agentDir,
    cfg,
    provider,
    preferredProfile,
  });
  const providerEntryBinding = await resolveProviderEntryApiKeyBinding({
    cfg,
    provider,
    store: scopedStore,
    agentDir,
    secretSentinels: params.secretSentinels,
  });
  if (providerEntryBinding.kind === "profile-resolved") {
    assertAuthModeAllowedForModel({
      provider,
      modelApi: params.modelApi,
      profileId: providerEntryBinding.auth.profileId ?? provider,
      mode: providerEntryBinding.auth.mode,
    });
    return providerEntryBinding.auth;
  }
  if (providerEntryBinding.kind === "profile-incompatible") {
    const reason =
      providerEntryBinding.reason === "credential-class"
        ? "which is not a bearer-style auth class"
        : "which is not compatible with this provider entry's auth binding";
    const action =
      providerEntryBinding.reason === "credential-class"
        ? "Use an api-key or token profile, or set apiKey to a literal bearer token."
        : "Use a compatible provider auth alias, configure the referenced provider entry with the same baseUrl, or set apiKey to a literal bearer token.";
    throw new Error(
      `Per-entry apiKey "${providerEntryBinding.profileId}" for provider "${provider}" references a "${providerEntryBinding.credentialType}" credential for provider "${providerEntryBinding.credentialProvider}", ${reason}. ${action}`,
    );
  }
  if (providerEntryBinding.kind === "profile-unresolved") {
    const cause = providerEntryBinding.error
      ? formatErrorMessage(providerEntryBinding.error)
      : "credential resolution returned no key";
    throw new Error(
      `Per-entry apiKey "${providerEntryBinding.profileId}" for provider "${provider}" matched a stored profile but failed to resolve: ${cause}. Fix the referenced profile or set apiKey to a literal bearer token.`,
    );
  }
  if (shouldPreferExplicitConfigApiKeyAuth(cfg, provider)) {
    const runtimeCustomKey = resolveManagedSecretRefRuntimeProviderAuth({
      cfg,
      provider,
      secretSentinels: params.secretSentinels,
    });
    if (runtimeCustomKey) return runtimeCustomKey;
    const customKey = resolveUsableCustomProviderApiKey({
      cfg,
      provider,
      secretSentinels: params.secretSentinels,
    });
    if (customKey)
      return {
        apiKey: customKey.apiKey,
        source: customKey.source,
        mode: "api-key",
      };
  }
  const providerConfig = resolveProviderConfig(cfg, provider);
  const configuredLocalKey = resolveUsableCustomProviderApiKey({
    cfg,
    provider,
    secretSentinels: params.secretSentinels,
  });
  if (configuredLocalKey && isNonSecretApiKeyMarker(configuredLocalKey.apiKey))
    return {
      apiKey: configuredLocalKey.apiKey,
      source: configuredLocalKey.source,
      mode: "api-key",
    };
  const localMarkerEnv = resolveConfigAwareEnvApiKey(
    cfg,
    provider,
    params.workspaceDir,
    params.skipSetupProviderFallback,
  );
  if (localMarkerEnv && isNonSecretApiKeyMarker(localMarkerEnv.apiKey))
    return {
      apiKey: localMarkerEnv.apiKey,
      source: localMarkerEnv.source,
      mode: "api-key",
    };
  const store =
    scopedStore ??
    resolveScopedAuthProfileStore({
      agentDir,
      cfg,
      provider,
      preferredProfile,
    });
  const order =
    params.allowAuthProfileFallback === false
      ? []
      : resolveAuthProfileOrder({
          cfg,
          store,
          provider,
          preferredProfile,
          forModel: params.modelId,
        });
  let deferredAuthProfileResult = null;
  let refreshFailure;
  for (const candidate of order) {
    let candidateMode;
    try {
      const awsSdkProfileAuth = resolveConfiguredAwsSdkProfileAuth({
        cfg,
        provider,
        profileId: candidate,
      });
      if (awsSdkProfileAuth) return awsSdkProfileAuth;
      const candidateType = store.profiles[candidate]?.type;
      candidateMode = candidateType ? profileTypeToAuthMode(candidateType) : void 0;
      if (
        candidateMode &&
        !isAuthModeAllowedForModel({
          provider,
          modelApi: params.modelApi,
          mode: candidateMode,
        })
      )
        continue;
      const resolved = await resolveApiKeyForProfile({
        cfg,
        store,
        profileId: candidate,
        agentDir,
        forceRefresh: params.forceRefresh,
      });
      if (resolved) {
        const resolvedProfileId = resolved.profileId ?? candidate;
        const mode = resolved.profileType ?? store.profiles[resolvedProfileId]?.type;
        const resolvedMode = mode ? profileTypeToAuthMode(mode) : "api-key";
        const result = {
          apiKey: sentinelizeSecretRefProfileApiKey({
            apiKey: resolved.apiKey,
            enabled: params.secretSentinels,
            profileId: resolvedProfileId,
            provider,
            store,
          }),
          profileId: resolvedProfileId,
          source: `profile:${resolvedProfileId}`,
          mode: resolvedMode,
        };
        if (
          !isAuthModeAllowedForModel({
            provider,
            modelApi: params.modelApi,
            mode: result.mode,
          })
        )
          continue;
        if (
          shouldDeferSyntheticProfileAuth({
            cfg,
            provider,
            resolvedApiKey: resolved.apiKey,
            modelApi: params.modelApi,
          })
        ) {
          deferredAuthProfileResult ??= result;
          continue;
        }
        return result;
      }
    } catch (err) {
      if (
        !refreshFailure &&
        err instanceof OAuthRefreshFailureError &&
        (!candidateMode ||
          isAuthModeAllowedForModel({
            provider,
            modelApi: params.modelApi,
            mode: candidateMode,
          }))
      )
        refreshFailure = err;
      log.debug?.(`auth profile "${candidate}" failed for provider "${provider}": ${String(err)}`);
    }
  }
  const envResolved = resolveConfigAwareEnvApiKey(
    cfg,
    provider,
    params.workspaceDir,
    params.skipSetupProviderFallback,
  );
  if (envResolved) {
    const resolvedMode = resolveDirectProviderCredentialMode({
      cfg,
      provider,
      inferredMode: envResolved.source.includes("OAUTH_TOKEN") ? "oauth" : "api-key",
    });
    if (
      isAuthModeAllowedForModel({
        provider,
        modelApi: params.modelApi,
        mode: resolvedMode,
      })
    )
      return {
        apiKey: sentinelizeConfigSecretRefEnvApiKey({
          apiKey: envResolved.apiKey,
          source: envResolved.source,
          cfg,
          provider,
          enabled: params.secretSentinels,
        }),
        source: envResolved.source,
        mode: resolvedMode,
      };
  }
  const managedRuntimeAuth = resolveManagedSecretRefRuntimeProviderAuth({
    cfg,
    provider,
    secretSentinels: params.secretSentinels,
  });
  if (
    managedRuntimeAuth &&
    isAuthModeAllowedForModel({
      provider,
      modelApi: params.modelApi,
      mode: managedRuntimeAuth.mode,
    })
  )
    return managedRuntimeAuth;
  const customKey = resolveUsableCustomProviderApiKey({
    cfg,
    provider,
    secretSentinels: params.secretSentinels,
  });
  if (customKey) {
    const mode = resolveDirectProviderCredentialMode({
      cfg,
      provider,
      inferredMode: "api-key",
    });
    if (
      isAuthModeAllowedForModel({
        provider,
        modelApi: params.modelApi,
        mode,
      })
    )
      return {
        apiKey: customKey.apiKey,
        source: customKey.source,
        mode,
      };
  }
  if (deferredAuthProfileResult) return deferredAuthProfileResult;
  const syntheticLocalAuth = resolveSyntheticLocalProviderAuth({
    cfg,
    provider,
    modelApi: params.modelApi,
    secretSentinels: params.secretSentinels,
    allowPluginSyntheticAuth: params.allowAuthProfileFallback !== false,
  });
  if (syntheticLocalAuth) return syntheticLocalAuth;
  if (refreshFailure) throw refreshFailure;
  const hasInlineConfiguredModels =
    Array.isArray(providerConfig?.models) && providerConfig.models.length > 0;
  if (
    (params.allowAuthProfileFallback !== false && !hasInlineConfiguredModels
      ? resolveOwningPluginIdsForProviderRef({
          provider,
          config: cfg,
        })
      : void 0
    )?.length
  ) {
    const pluginMissingAuthMessage = buildProviderMissingAuthMessageWithPlugin({
      provider,
      config: cfg,
      context: {
        config: cfg,
        agentDir,
        env: process.env,
        provider,
        listProfileIds: (providerId) => listProfilesForProvider(store, providerId),
      },
    });
    if (pluginMissingAuthMessage)
      throw new ProviderAuthError("missing-provider-auth", provider, pluginMissingAuthMessage);
  }
  const authStorePath = resolveAuthStorePathForDisplay(agentDir);
  const resolvedAgentDir = path.dirname(authStorePath);
  throw new ProviderAuthError(
    "missing-provider-auth",
    provider,
    [
      `No API key found for provider "${provider}".`,
      `Auth store: ${authStorePath} (agentDir: ${resolvedAgentDir}).`,
      `Configure auth for this agent (${formatCliCommand("openclaw agents add <id>")}) or copy only portable static auth profiles from the main agentDir.`,
    ].join(" "),
  );
}
/** Reports the strongest configured auth mode for provider-list UI and diagnostics. */
function resolveModelAuthMode(provider, cfg, store, options) {
  const resolved = provider?.trim();
  if (!resolved) return;
  if (resolveProviderAuthOverride(cfg, resolved) === "aws-sdk") return "aws-sdk";
  const authStore =
    store ??
    resolveScopedAuthProfileStore({
      cfg,
      provider: resolved,
    });
  const profiles = listProfilesForProvider(authStore, resolved);
  if (profiles.length > 0) {
    const modes = new Set(
      profiles.map((id) => authStore.profiles[id]?.type).filter((mode) => Boolean(mode)),
    );
    if (["oauth", "token", "api_key"].filter((k) => modes.has(k)).length >= 2) return "mixed";
    if (modes.has("oauth")) return "oauth";
    if (modes.has("token")) return "token";
    if (modes.has("api_key")) return "api-key";
  }
  const envKey = resolveConfigAwareEnvApiKey(cfg, resolved, options?.workspaceDir);
  if (envKey?.apiKey) return envKey.source.includes("OAUTH_TOKEN") ? "oauth" : "api-key";
  if (
    normalizeProviderId(resolved) === "codex" &&
    readCodexCliCredentialsCached({
      ttlMs: 5e3,
      allowKeychainPrompt: false,
    })
  )
    return "oauth";
  if (hasUsableCustomProviderApiKey(cfg, resolved)) return "api-key";
  return "unknown";
}
/** Checks provider auth availability, including profile fallback order. */
async function hasAvailableAuthForProvider(params) {
  const { provider, cfg, preferredProfile } = params;
  if (resolveProviderAuthOverride(cfg, provider) === "aws-sdk") return true;
  const envAuth = resolveConfigAwareEnvApiKey(cfg, provider, params.workspaceDir);
  if (
    envAuth &&
    isAuthModeAllowedForModel({
      provider,
      modelApi: params.modelApi,
      mode: envAuth.source.includes("OAUTH_TOKEN") ? "oauth" : "api-key",
    })
  )
    return true;
  if (
    resolveUsableCustomProviderApiKey({
      cfg,
      provider,
    })
  )
    return true;
  if (
    resolveSyntheticLocalProviderAuth({
      cfg,
      provider,
    })
  )
    return true;
  const store =
    params.store ??
    resolveScopedAuthProfileStore({
      agentDir: params.agentDir,
      cfg,
      provider,
      preferredProfile,
    });
  const order = resolveAuthProfileOrder({
    cfg,
    store,
    provider,
    preferredProfile,
    forModel: params.modelId,
  });
  for (const candidate of order)
    try {
      if (
        resolveConfiguredAwsSdkProfileAuth({
          cfg,
          provider,
          profileId: candidate,
        })
      )
        return true;
      const candidateType = store.profiles[candidate]?.type;
      if (
        candidateType &&
        !isAuthModeAllowedForModel({
          provider,
          modelApi: params.modelApi,
          mode: profileTypeToAuthMode(candidateType),
        })
      )
        continue;
      const resolved = await resolveApiKeyForProfile({
        cfg,
        store,
        profileId: candidate,
        agentDir: params.agentDir,
      });
      const mode = resolved?.profileType ?? store.profiles[candidate]?.type;
      if (
        resolved &&
        isAuthModeAllowedForModel({
          provider,
          modelApi: params.modelApi,
          mode: mode ? profileTypeToAuthMode(mode) : "api-key",
        })
      )
        return true;
    } catch (err) {
      log.debug?.(`auth profile "${candidate}" failed for provider "${provider}": ${String(err)}`);
    }
  return false;
}
/** Resolves request credentials from the provider attached to a model descriptor. */
async function getApiKeyForModel(params) {
  return resolveApiKeyForProvider({
    provider: params.model.provider,
    cfg: params.cfg,
    profileId: params.profileId,
    preferredProfile: params.preferredProfile,
    store: params.store,
    agentDir: params.agentDir,
    workspaceDir: params.workspaceDir,
    lockedProfile: params.lockedProfile,
    credentialPrecedence: params.credentialPrecedence,
    allowAuthProfileFallback: params.allowAuthProfileFallback,
    skipSetupProviderFallback: params.skipSetupProviderFallback,
    modelId: params.model.id,
    modelApi: params.model.api,
    secretSentinels: params.secretSentinels,
  });
}
/** Clears auth for local OpenAI-compatible servers that explicitly use no auth. */
function applyLocalNoAuthHeaderOverride(model, auth) {
  if (auth?.apiKey !== "custom-local" || model.api !== "openai-completions") return model;
  const headers = {
    ...model.headers,
    Authorization: null,
  };
  return {
    ...model,
    headers,
  };
}
function applySecretRefHeaderSentinels(model, cfg) {
  if (!model.headers) return model;
  const runtimeConfig = getRuntimeConfigSnapshot();
  const runtimeSourceConfig = getRuntimeConfigSourceSnapshot();
  const usesRuntimeProvider =
    selectApplicableRuntimeConfig({
      inputConfig: cfg,
      runtimeConfig,
      runtimeSourceConfig,
    }) === runtimeConfig ||
    providerConfigMatchesRuntimeSnapshot({
      inputConfig: cfg,
      runtimeConfig,
      provider: model.provider,
    });
  if (!runtimeConfig || !runtimeSourceConfig || !usesRuntimeProvider) return model;
  const sourceProvider = resolveProviderConfig(runtimeSourceConfig, model.provider);
  const runtimeProvider = resolveProviderConfig(runtimeConfig, model.provider);
  const replacements = /* @__PURE__ */ new Map();
  const isManagedSecret = (value) =>
    coerceSecretRef(value) !== null ||
    (typeof value === "string" && isSecretRefHeaderValueMarker(value));
  const addReplacement = (name, value, replacement) => {
    replacements.set(name.trim().toLowerCase(), {
      value,
      replacement:
        replacement ?? mintSecretSentinel(value, { label: `model-auth:${model.provider}` }),
    });
  };
  for (const [name, sourceValue] of Object.entries(sourceProvider?.headers ?? {})) {
    if (!isManagedSecret(sourceValue)) continue;
    const value = normalizeOptionalSecretInput(runtimeProvider?.headers?.[name]);
    if (value) addReplacement(name, value);
  }
  for (const [name, sourceValue] of Object.entries(sourceProvider?.request?.headers ?? {})) {
    if (!isManagedSecret(sourceValue)) continue;
    const value = normalizeOptionalSecretInput(runtimeProvider?.request?.headers?.[name]);
    if (value) addReplacement(name, value);
  }
  const sourceAuth = sourceProvider?.request?.auth;
  const runtimeAuth = runtimeProvider?.request?.auth;
  const attachedRequest = getModelProviderRequestTransport(model);
  let protectedRequest = attachedRequest;
  let protectedRequestHeaders;
  for (const [name, sourceValue] of Object.entries(sourceProvider?.request?.headers ?? {})) {
    if (!isManagedSecret(sourceValue)) continue;
    const value = normalizeOptionalSecretInput(runtimeProvider?.request?.headers?.[name]);
    if (!value || attachedRequest?.headers?.[name] !== value) continue;
    protectedRequestHeaders ??= { ...attachedRequest.headers };
    protectedRequestHeaders[name] = mintSecretSentinel(value, {
      label: `model-auth:${model.provider}`,
    });
  }
  if (protectedRequestHeaders && attachedRequest)
    protectedRequest = {
      ...attachedRequest,
      headers: protectedRequestHeaders,
    };
  if (
    sourceAuth?.mode === "authorization-bearer" &&
    runtimeAuth?.mode === "authorization-bearer" &&
    isManagedSecret(sourceAuth.token)
  ) {
    const token = normalizeOptionalSecretInput(runtimeAuth.token)?.trim();
    if (token) {
      if (attachedRequest?.auth?.mode === "authorization-bearer")
        protectedRequest = {
          ...protectedRequest,
          auth: {
            ...attachedRequest.auth,
            token: mintSecretSentinel(token, { label: `model-auth:${model.provider}` }),
          },
        };
      addReplacement(
        "Authorization",
        `Bearer ${token}`,
        `Bearer ${mintSecretSentinel(token, { label: `model-auth:${model.provider}` })}`,
      );
    }
  } else if (
    sourceAuth?.mode === "header" &&
    runtimeAuth?.mode === "header" &&
    isManagedSecret(sourceAuth.value)
  ) {
    const value = normalizeOptionalSecretInput(runtimeAuth.value)?.trim();
    const headerName = runtimeAuth.headerName.trim();
    const prefix = runtimeAuth.prefix?.trim() ?? "";
    if (headerName && value) {
      if (attachedRequest?.auth?.mode === "header")
        protectedRequest = {
          ...protectedRequest,
          auth: {
            ...attachedRequest.auth,
            value: mintSecretSentinel(value, { label: `model-auth:${model.provider}` }),
          },
        };
      addReplacement(
        headerName,
        `${prefix}${value}`,
        `${prefix}${mintSecretSentinel(value, { label: `model-auth:${model.provider}` })}`,
      );
    }
  }
  let headers;
  for (const [name, value] of Object.entries(model.headers)) {
    const replacement = replacements.get(name.trim().toLowerCase());
    if (replacement?.value !== value) continue;
    headers ??= { ...model.headers };
    headers[name] = replacement.replacement;
  }
  const protectedModel = headers
    ? {
        ...model,
        headers,
      }
    : model;
  return protectedRequest && protectedRequest !== attachedRequest
    ? attachModelProviderRequestTransport(protectedModel, protectedRequest)
    : protectedModel;
}
/**
 * When the provider config sets `authHeader: true`, inject an explicit
 * `Authorization: Bearer <apiKey>` header into the model so downstream SDKs
 * (e.g. `@google/genai`) send credentials via the standard HTTP Authorization
 * header instead of vendor-specific headers like `x-goog-api-key`.
 *
 * This is a no-op when `authHeader` is not `true`, when no API key is
 * available, or when the API key is a synthetic marker (e.g. local-server
 * placeholders) rather than a real credential.
 */
function applyAuthHeaderOverride(model, auth, cfg) {
  const sentinelModel = applySecretRefHeaderSentinels(model, cfg);
  if (!auth?.apiKey) return sentinelModel;
  if (isNonSecretApiKeyMarker(auth.apiKey)) return sentinelModel;
  if (!resolveProviderConfig(cfg, sentinelModel.provider)?.authHeader) return sentinelModel;
  const headers = {};
  if (sentinelModel.headers) {
    for (const [key, value] of Object.entries(sentinelModel.headers))
      if (normalizeOptionalLowercaseString(key) !== "authorization") headers[key] = value;
  }
  headers.Authorization = `Bearer ${auth.apiKey}`;
  return {
    ...sentinelModel,
    headers,
  };
}
//#endregion
export {
  shouldPreferExplicitConfigApiKeyAuth as _,
  createRuntimeProviderAuthLookup as a,
  hasAvailableAuthForProvider as c,
  hasUsableCustomProviderApiKey as d,
  resolveApiKeyForProvider as f,
  resolveUsableCustomProviderApiKey as g,
  resolveProviderEntryApiKeyProfileReference as h,
  canUseProfileAsProviderEntryApiKey as i,
  hasRuntimeAvailableProviderAuth as l,
  resolveProviderEntryApiKeyBinding as m,
  applyLocalNoAuthHeaderOverride as n,
  getApiKeyForModel as o,
  resolveModelAuthMode as p,
  applySecretRefHeaderSentinels as r,
  getCustomProviderApiKey as s,
  applyAuthHeaderOverride as t,
  hasSyntheticLocalProviderAuthConfig as u,
};
