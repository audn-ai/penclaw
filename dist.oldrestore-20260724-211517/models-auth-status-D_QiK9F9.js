import { s as resolveDefaultAgentDir } from "./agent-scope-config-DVIR1nBa.js";
import "./number-coercion-EqFmHmOw.js";
import { n as buildAuthHealthSummary, r as formatRemainingShort } from "./auth-health-DTCl3XuB.js";
import { n as abortChatRunsForProvider } from "./chat-abort-DGc7CDOP.js";
import { n as errorShape, t as ErrorCodes } from "./error-codes-O0AkRNx7.js";
import "./agent-scope-y9xQv_q1.js";
import { t as externalCliDiscoveryForConfigStatus } from "./external-cli-discovery-To6-j7MZ.js";
import {
  g as resolveUsableCustomProviderApiKey,
  h as resolveProviderEntryApiKeyProfileReference,
} from "./model-auth-BWFdcEzF.js";
import { r as resolveProviderEnvAuthEvidence } from "./model-auth-env-DLe5znyS.js";
import "./auth-profiles-CX7JDmZ9.js";
import {
  b as resolveProviderEnvAuthLookupMaps,
  d as isNonSecretApiKeyMarker,
  u as isKnownEnvApiKeyMarker,
  y as listProviderEnvAuthLookupKeys,
} from "./model-auth-markers-CA2Xy59Z.js";
import { i as warmCurrentProviderAuthStateOffMainThread } from "./model-provider-auth-DNlLhknV.js";
import { r as clearCurrentProviderAuthState } from "./model-provider-auth-state-DW_JYm-o.js";
import { o as asDateTimestampMs } from "./number-coercion-CJQ8TR--.js";
import { n as listProfilesForProvider } from "./profile-list-I4BheGlK.js";
import {
  a as removeProviderAuthProfilesWithLock,
  i as removeAuthProfilesWithLock,
} from "./profiles-DxTOoenK.js";
import { r as resolveProviderIdForAuth } from "./provider-auth-aliases-RaEzqkSo.js";
import {
  n as findNormalizedProviderValue,
  r as normalizeProviderId,
} from "./provider-id-BIcU_2-A.js";
import { t as loadProviderUsageSummary } from "./provider-usage.load-C735r4BK.js";
import "./src-CIJf1lT0.js";
import {
  c as resolveUsageProviderId,
  o as providerUsageLabel,
} from "./provider-usage.shared-BtRIPHWE.js";
import { u as refreshActiveProviderAuthRuntimeSnapshot } from "./runtime-DEGd6B8G.js";
import {
  i as ensureAuthProfileStore,
  m as resolvePersistedAuthProfileOwnerAgentDir,
  o as ensureAuthProfileStoreWithoutExternalProfiles,
  r as clearRuntimeAuthProfileStoreSnapshots,
} from "./store-B7DoDdVM.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
import { c as hasConfiguredSecretInput, s as coerceSecretRef } from "./types.secrets-BV0ywRAy.js";
import { t as formatForLog } from "./ws-log-BlD6I7mP.js";
//#region src/gateway/server-methods/models-auth-status.ts
const log = createSubsystemLogger("models-auth-status");
const apiKeyUsageStatusProviders = /* @__PURE__ */ new Set(["clawrouter", "deepseek"]);
const CACHE_TTL_MS = 6e4;
let cached = null;
let cacheGeneration = 0;
/**
 * Invalidate the in-memory cache. Reserved for future gateway-side auth
 * mutation handlers (login, logout, token rotation) so the next read returns
 * fresh data. Today those mutations happen via the CLI and the 60s TTL plus
 * `{refresh: true}` param cover the stale-data window.
 */
function invalidateModelAuthStatusCache() {
  cacheGeneration += 1;
  cached = null;
  clearCurrentProviderAuthState();
}
async function refreshModelAuthStatusRuntimeState() {
  invalidateModelAuthStatusCache();
  try {
    if (await refreshActiveProviderAuthRuntimeSnapshot()) return;
  } catch (err) {
    log.warn(`runtime auth snapshot refresh before auth status failed: ${formatForLog(err)}`);
    return;
  }
  clearRuntimeAuthProfileStoreSnapshots();
}
function readProviderParam(params) {
  const raw = params.provider;
  if (typeof raw !== "string") return null;
  return normalizeProviderId(raw) || null;
}
function readLogoutProfileSelection(params) {
  if (!("profileIds" in params)) return { ok: true };
  if (!Array.isArray(params.profileIds) || params.profileIds.length === 0)
    return {
      ok: false,
      message: "profileIds must be a non-empty string array",
    };
  const profileIds = [];
  for (const value of params.profileIds) {
    if (typeof value !== "string" || !value.trim())
      return {
        ok: false,
        message: "profileIds must be a non-empty string array",
      };
    const profileId = value.trim();
    if (!profileIds.includes(profileId)) profileIds.push(profileId);
  }
  return {
    ok: true,
    profileIds,
  };
}
function createAuthLogoutAbortOps(context) {
  return {
    chatAbortControllers: context.chatAbortControllers,
    chatRunBuffers: context.chatRunBuffers,
    chatAbortedRuns: context.chatAbortedRuns,
    clearChatRunState: context.clearChatRunState,
    removeChatRun: context.removeChatRun,
    agentRunSeq: context.agentRunSeq,
    broadcast: context.broadcast,
    nodeSendToSession: context.nodeSendToSession,
  };
}
async function removeProviderAuthProfilesAcrossOwnerStores(params) {
  const ownerAgentDirs = /* @__PURE__ */ new Set([params.agentDir]);
  for (const profileId of params.profileIds)
    ownerAgentDirs.add(
      resolvePersistedAuthProfileOwnerAgentDir({
        agentDir: params.agentDir,
        profileId,
      }),
    );
  for (const ownerAgentDir of ownerAgentDirs)
    if (
      !(await removeProviderAuthProfilesWithLock({
        provider: params.provider,
        agentDir: ownerAgentDir,
      }))
    )
      return false;
  return true;
}
async function removeAuthProfilesAcrossOwnerStores(params) {
  const profilesByOwner = /* @__PURE__ */ new Map([[params.agentDir, new Set(params.profileIds)]]);
  for (const profileId of params.profileIds) {
    const ownerAgentDir = resolvePersistedAuthProfileOwnerAgentDir({
      agentDir: params.agentDir,
      profileId,
    });
    const ownerProfiles = profilesByOwner.get(ownerAgentDir) ?? /* @__PURE__ */ new Set();
    ownerProfiles.add(profileId);
    profilesByOwner.set(ownerAgentDir, ownerProfiles);
  }
  for (const [ownerAgentDir, profileIds] of profilesByOwner)
    if (
      !(await removeAuthProfilesWithLock({
        profileIds: [...profileIds],
        agentDir: ownerAgentDir,
      }))
    )
      return false;
  return true;
}
function buildExpiry(remainingMs, expiresAt) {
  const normalizedExpiresAt = asDateTimestampMs(expiresAt);
  if (normalizedExpiresAt === void 0 || typeof remainingMs !== "number") return;
  return {
    at: normalizedExpiresAt,
    remainingMs,
    label: formatRemainingShort(remainingMs),
  };
}
function providerDisplayName(provider) {
  const usageId = resolveUsageProviderId(provider);
  const usageLabel = usageId ? providerUsageLabel(usageId) : void 0;
  if (usageLabel) return usageLabel;
  return provider;
}
function aggregateProfileStatus(profiles, now) {
  const statuses = new Set(profiles.map((profile) => profile.status));
  const status = ["expired", "missing", "expiring", "ok", "static"].find((candidate) =>
    statuses.has(candidate),
  );
  const expirable = profiles.map((p) => p.expiresAt).filter((v) => asDateTimestampMs(v) !== void 0);
  const expiresAt = expirable.length > 0 ? Math.min(...expirable) : void 0;
  const remainingMs = expiresAt !== void 0 ? expiresAt - now : void 0;
  return {
    status: status ?? "static",
    expiresAt,
    remainingMs,
  };
}
/**
 * Aggregate the effective refreshable credential status for the dashboard.
 * OAuth remains authoritative when present; token credentials are the
 * supported fallback after an OAuth-to-token migration. Explicit auth-order
 * exclusions remain authoritative through `effectiveProfiles`.
 *
 * `expectsOAuth` keeps an API-key-only provider `missing` after config switches
 * to OAuth but login has not completed.
 */
function aggregateRefreshableAuthStatus(prov, now = Date.now(), expectsOAuth = false) {
  const profiles = prov.effectiveProfiles ?? prov.profiles;
  const oauth = profiles.filter((profile) => profile.type === "oauth");
  if (oauth.length > 0) return aggregateProfileStatus(oauth, now);
  const tokens = profiles.filter((profile) => profile.type === "token");
  if (tokens.length > 0) return aggregateProfileStatus(tokens, now);
  if (expectsOAuth) return { status: "missing" };
  return {
    status: prov.status,
    expiresAt: prov.expiresAt,
    remainingMs: prov.remainingMs,
  };
}
function mapProvider(
  prov,
  usageByProvider,
  expectsOAuthSet,
  apiKeys,
  logoutProfileIds,
  configBoundProfileIds,
) {
  const usageProfile =
    prov.profiles.find((profile) => profile.type === "oauth" || profile.type === "token") ??
    prov.profiles.find((profile) => profile.type === "api_key");
  const usageKey = resolveUsageProviderId(prov.provider, { credentialType: usageProfile?.type });
  const usage = usageKey ? usageByProvider.get(usageKey) : void 0;
  const rollup = aggregateRefreshableAuthStatus(
    prov,
    Date.now(),
    expectsOAuthSet.has(prov.provider),
  );
  const apiKey = apiKeys.get(normalizeProviderId(prov.provider));
  const hasRefreshableProfile = prov.profiles.some(
    (profile) => profile.type === "oauth" || profile.type === "token",
  );
  return {
    provider: prov.provider,
    displayName: providerDisplayName(prov.provider),
    status:
      apiKey && !hasRefreshableProfile && rollup.status === "missing" ? "static" : rollup.status,
    expiry: buildExpiry(rollup.remainingMs, rollup.expiresAt),
    profiles: prov.profiles.map((prof) => ({
      profileId: prof.profileId,
      type: prof.type,
      status: prof.status,
      reasonCode: prof.reasonCode,
      expiry: buildExpiry(prof.remainingMs, prof.expiresAt),
      ...((prof.type === "oauth" || prof.type === "token") &&
      logoutProfileIds.has(prof.profileId) &&
      !configBoundProfileIds.has(prof.profileId)
        ? { logoutSupported: true }
        : {}),
    })),
    ...(apiKey ? { apiKey } : {}),
    usage:
      usage && usageKey
        ? {
            providerId: usageKey,
            windows: usage.windows,
            ...(usage.summary ? { summary: usage.summary } : {}),
            ...(usage.plan ? { plan: usage.plan } : {}),
            ...(usage.billing?.length ? { billing: usage.billing } : {}),
            ...(usage.accountEmail ? { accountEmail: usage.accountEmail } : {}),
          }
        : void 0,
  };
}
function resolveEnvVarName(source) {
  return /^(?:shell env|env): ([A-Z][A-Z0-9_]*)$/u.exec(source)?.[1];
}
function resolveProviderApiKeys(cfg, store) {
  const lookupMaps = resolveProviderEnvAuthLookupMaps({
    config: cfg,
    env: process.env,
  });
  const providerIds = /* @__PURE__ */ new Set([
    ...Object.keys(cfg.models?.providers ?? {}),
    ...Object.values(cfg.auth?.profiles ?? {})
      .map((profile) => profile?.provider)
      .filter((provider) => typeof provider === "string"),
    ...listProviderEnvAuthLookupKeys(lookupMaps),
  ]);
  const apiKeys = /* @__PURE__ */ new Map();
  for (const rawProvider of providerIds) {
    const provider = normalizeProviderId(rawProvider);
    if (!provider) continue;
    const providerConfig = findNormalizedProviderValue(cfg.models?.providers, provider);
    if (hasConfiguredSecretInput(providerConfig?.apiKey, cfg.secrets?.defaults)) {
      const ref = coerceSecretRef(providerConfig?.apiKey, cfg.secrets?.defaults);
      const profileReference = resolveProviderEntryApiKeyProfileReference({
        cfg,
        provider,
        store,
      });
      if (profileReference.kind !== "profile" && profileReference.kind !== "profile-incompatible") {
        if (ref && ref.source !== "env") {
          apiKeys.set(provider, { source: "config" });
          continue;
        }
        const available = resolveUsableCustomProviderApiKey({
          cfg,
          provider,
          env: process.env,
        });
        if (available) {
          const rawKey =
            typeof providerConfig?.apiKey === "string" ? providerConfig.apiKey.trim() : "";
          if (rawKey && isNonSecretApiKeyMarker(rawKey, { includeEnvVarName: false })) continue;
          const envVar =
            ref?.source === "env"
              ? ref.id
              : profileReference.kind === "marker" && isKnownEnvApiKeyMarker(rawKey)
                ? rawKey
                : resolveEnvVarName(available.source);
          apiKeys.set(
            provider,
            envVar
              ? {
                  source: "env",
                  envVar,
                }
              : { source: "config" },
          );
          continue;
        }
      }
    }
    const envEvidence = resolveProviderEnvAuthEvidence(provider, process.env, {
      aliasMap: lookupMaps.aliasMap,
      candidateMap: lookupMaps.envCandidateMap,
      authEvidenceMap: lookupMaps.authEvidenceMap,
    });
    if (envEvidence?.mode !== "api-key") continue;
    const envVar = resolveEnvVarName(envEvidence.source);
    apiKeys.set(provider, {
      source: "env",
      ...(envVar ? { envVar } : {}),
    });
  }
  return apiKeys;
}
function resolveConfigBoundProfileIds(cfg, store) {
  const profileIds = /* @__PURE__ */ new Set();
  for (const provider of Object.keys(cfg.models?.providers ?? {})) {
    const reference = resolveProviderEntryApiKeyProfileReference({
      cfg,
      provider,
      store,
    });
    if (reference.kind === "profile" || reference.kind === "profile-incompatible")
      profileIds.add(reference.profileId);
  }
  return profileIds;
}
function resolveConfiguredProviders(cfg, apiKeys) {
  const out = /* @__PURE__ */ new Set();
  const expectsOAuth = /* @__PURE__ */ new Set();
  for (const [id, provider] of Object.entries(cfg.models?.providers ?? {})) {
    const normalized = normalizeProviderId(id);
    if (!normalized) continue;
    const rawKey = typeof provider?.apiKey === "string" ? provider.apiKey.trim() : "";
    const hasApiKey =
      hasConfiguredSecretInput(provider?.apiKey, cfg.secrets?.defaults) &&
      (rawKey === "secretref-managed" ||
        !isNonSecretApiKeyMarker(rawKey, { includeEnvVarName: false }));
    const mode = provider?.auth;
    if (mode !== "oauth" && mode !== "token" && !hasApiKey) continue;
    if (apiKeys.has(normalized)) continue;
    out.add(normalized);
    if (mode === "oauth") expectsOAuth.add(normalized);
  }
  for (const profile of Object.values(cfg.auth?.profiles ?? {})) {
    const provider = profile?.provider;
    const mode = profile?.mode;
    if (
      typeof provider !== "string" ||
      provider.length === 0 ||
      (mode !== "oauth" && mode !== "token")
    )
      continue;
    const normalized = normalizeProviderId(provider);
    if (!normalized) continue;
    if (apiKeys.has(normalized)) continue;
    out.add(normalized);
    if (mode === "oauth") expectsOAuth.add(normalized);
  }
  return {
    providers: Array.from(out),
    expectsOAuth,
  };
}
const modelsAuthStatusHandlers = {
  "models.authLogout": async ({ params, respond, context }) => {
    const provider = readProviderParam(params);
    if (!provider) {
      respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "provider is required"));
      return;
    }
    const selection = readLogoutProfileSelection(params);
    if (!selection.ok) {
      respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, selection.message));
      return;
    }
    try {
      const cfg = context.getRuntimeConfig();
      const agentDir = resolveDefaultAgentDir(cfg);
      const authProvider = resolveProviderIdForAuth(provider, { config: cfg });
      const store = ensureAuthProfileStoreWithoutExternalProfiles(agentDir);
      const availableProfiles = listProfilesForProvider(store, provider);
      const removedProfiles = selection.profileIds ?? availableProfiles;
      if (
        selection.profileIds &&
        selection.profileIds.some((profileId) => {
          const profile = store.profiles[profileId];
          return (
            !availableProfiles.includes(profileId) ||
            (profile?.type !== "oauth" && profile?.type !== "token")
          );
        })
      ) {
        respond(
          false,
          void 0,
          errorShape(ErrorCodes.INVALID_REQUEST, "profileIds contain unavailable auth profiles"),
        );
        return;
      }
      const configBoundProfileIds = selection.profileIds
        ? resolveConfigBoundProfileIds(cfg, store)
        : null;
      if (selection.profileIds?.some((profileId) => configBoundProfileIds?.has(profileId))) {
        respond(
          false,
          void 0,
          errorShape(ErrorCodes.INVALID_REQUEST, "profileIds contain config-bound auth profiles"),
        );
        return;
      }
      if (
        !(selection.profileIds
          ? await removeAuthProfilesAcrossOwnerStores({
              agentDir,
              profileIds: removedProfiles,
            })
          : await removeProviderAuthProfilesAcrossOwnerStores({
              provider,
              agentDir,
              profileIds: removedProfiles,
            }))
      ) {
        respond(
          false,
          void 0,
          errorShape(
            ErrorCodes.UNAVAILABLE,
            `failed to remove saved auth profiles for provider ${provider}`,
          ),
        );
        return;
      }
      invalidateModelAuthStatusCache();
      await refreshActiveProviderAuthRuntimeSnapshot();
      warmCurrentProviderAuthStateOffMainThread(context.getRuntimeConfig()).catch((err) => {
        log.warn(`provider auth state rewarm after logout failed: ${formatForLog(err)}`);
      });
      const { runIds: abortedRunIds } = selection.profileIds
        ? { runIds: [] }
        : abortChatRunsForProvider(createAuthLogoutAbortOps(context), {
            providerId: authProvider,
            stopReason: "auth-revoked",
          });
      respond(
        true,
        {
          provider,
          removedProfiles,
          abortedRunIds,
        },
        void 0,
      );
    } catch (err) {
      respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatForLog(err)));
    }
  },
  "models.authStatus": async ({ params, respond, context }) => {
    const now = Date.now();
    const bypassCache = Boolean(params?.refresh);
    if (!bypassCache && cached && now - cached.ts < CACHE_TTL_MS) {
      respond(true, cached.result, void 0, { cached: true });
      return;
    }
    try {
      if (bypassCache) await refreshModelAuthStatusRuntimeState();
      const publishGeneration = cacheGeneration;
      const cfg = context.getRuntimeConfig();
      const agentDir = resolveDefaultAgentDir(cfg);
      const store = ensureAuthProfileStore(agentDir, {
        externalCli: externalCliDiscoveryForConfigStatus({ cfg }),
      });
      const apiKeys = resolveProviderApiKeys(cfg, store);
      const configured = resolveConfiguredProviders(cfg, apiKeys);
      const statusProviderIds = new Set(configured.providers);
      for (const provider of apiKeys.keys()) statusProviderIds.add(provider);
      for (const profile of Object.values(store.profiles)) {
        const provider = normalizeProviderId(profile.provider);
        if (provider) statusProviderIds.add(provider);
      }
      const authHealth = buildAuthHealthSummary({
        store,
        cfg,
        providers: statusProviderIds.size > 0 ? [...statusProviderIds] : void 0,
        allowKeychainPrompt: false,
      });
      const usageProviderIds = [
        ...new Set(
          authHealth.profiles
            .filter((p) => {
              if (p.type === "oauth" || p.type === "token") return true;
              const usageProvider = resolveUsageProviderId(p.provider, { credentialType: p.type });
              return usageProvider ? apiKeyUsageStatusProviders.has(usageProvider) : false;
            })
            .map((p) => resolveUsageProviderId(p.provider, { credentialType: p.type }))
            .filter((id) => Boolean(id)),
        ),
      ];
      const usageByProvider = /* @__PURE__ */ new Map();
      if (usageProviderIds.length > 0)
        try {
          const usage = await loadProviderUsageSummary({
            providers: usageProviderIds,
            agentDir,
            timeoutMs: 3500,
          });
          for (const snap of usage.providers)
            usageByProvider.set(snap.provider, {
              windows: snap.windows,
              ...(snap.summary ? { summary: snap.summary } : {}),
              ...(snap.plan ? { plan: snap.plan } : {}),
              ...(snap.billing?.length ? { billing: snap.billing } : {}),
              ...(snap.accountEmail ? { accountEmail: snap.accountEmail } : {}),
            });
        } catch (err) {
          log.debug(
            `usage enrichment failed (auth status still returned): providers=${usageProviderIds.join(",")} error=${formatForLog(err)}`,
          );
        }
      const externalProfileIds = new Set(store.runtimeExternalProfileIds ?? []);
      const logoutProfileIds = new Set(
        Object.entries(store.profiles)
          .filter(
            ([profileId, profile]) =>
              !externalProfileIds.has(profileId) &&
              (profile.type === "oauth" || profile.type === "token"),
          )
          .map(([profileId]) => profileId),
      );
      const configBoundProfileIds = resolveConfigBoundProfileIds(cfg, store);
      const result = {
        ts: now,
        providers: authHealth.providers.map((prov) =>
          mapProvider(
            prov,
            usageByProvider,
            configured.expectsOAuth,
            apiKeys,
            logoutProfileIds,
            configBoundProfileIds,
          ),
        ),
      };
      if (publishGeneration === cacheGeneration)
        cached = {
          ts: now,
          result,
        };
      respond(true, result, void 0);
    } catch (err) {
      respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatForLog(err)));
    }
  },
};
//#endregion
export { aggregateRefreshableAuthStatus, invalidateModelAuthStatusCache, modelsAuthStatusHandlers };
