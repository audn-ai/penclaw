import { createHash, randomBytes } from "node:crypto";
import path from "node:path";
import { s as resolveDefaultAgentDir } from "./agent-scope-config-DVIR1nBa.js";
import "./types.secrets-BV0ywRAy.js";
import "./ref-contract-DVV0zYUk.js";
import {
  i as COPILOT_INTEGRATION_ID,
  s as buildCopilotIdeHeaders,
} from "./copilot-dynamic-headers-CF9zPORX.js";
import { n as externalCliDiscoveryForProviderAuth } from "./external-cli-discovery-To6-j7MZ.js";
import "./provider-env-vars-BZiQzob_.js";
import { n as saveJsonFile, t as loadJsonFile } from "./json-file-DwcpMGrz.js";
import "./persisted-B2tK2f7d.js";
import { a as logWarn } from "./logger-BegyOJlO.js";
import { t as resolveEnvApiKey } from "./model-auth-env-DLe5znyS.js";
import "./external-auth-aN0UYCd0.js";
import "./credential-state-DvOWxJSx.js";
import {
  E as resolveExpiresAtMsFromEpochSeconds,
  o as asDateTimestampMs,
  y as parseStrictNonNegativeInteger,
} from "./number-coercion-CJQ8TR--.js";
import { n as resolveApiKeyForProfile } from "./oauth-CqNVt6lC.js";
import { i as resolveAuthProfileOrder } from "./order-BNCpk81x.js";
import "./profiles-DxTOoenK.js";
import { y as resolveStateDir } from "./paths-DEklnbzU.js";
import "./repair-bhv6VYT3.js";
import { n as listProfilesForProvider } from "./profile-list-I4BheGlK.js";
import { n as resolveProviderEndpoint } from "./provider-attribution-CdW1rMjo.js";
import "./model-auth-markers-CA2Xy59Z.js";
import { m as readProviderJsonResponse } from "./provider-http-errors-DLMRBkZU.js";
import "./models-config.providers.secrets-Dh4joY6h.js";
import "./provider-model-shared-CYlCpWlu.js";
import "./provider-auth-input-BukgsQa4.js";
import "./provider-auth-helpers-CLs4Yz61.js";
import "./provider-api-key-auth-CXfFv7q7.js";
import "./agent-dir-compat-d7bWcNLv.js";
import "./provider-auth-result-C3SBJpUX.js";
import {
  d as loadAuthProfileStoreForSecretsRuntime,
  f as loadAuthProfileStoreWithoutExternalProfiles,
  i as ensureAuthProfileStore,
} from "./store-B7DoDdVM.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
} from "./string-coerce-DW4mBlAt.js";
//#region src/plugin-sdk/provider-auth-copilot-cache.ts
const DEFAULT_GITHUB_COPILOT_DOMAIN = "github.com";
const COPILOT_CACHE_NAMESPACE = "github-copilot-token";
const COPILOT_TOKEN_CACHE_MAX_ENTRIES = 8;
function resolveLegacyCopilotTokenCachePath(env) {
  return path.join(resolveStateDir(env), "credentials", "github-copilot.token.json");
}
function fingerprintCopilotSourceCredential(githubToken) {
  return createHash("sha256").update(githubToken).digest("hex");
}
function isCopilotTokenUsable(params) {
  const expiresAt = asDateTimestampMs(params.cache.expiresAt);
  const cacheDomain = params.cache.domain ?? "github.com";
  return (
    params.cache.integrationId === "vscode-chat" &&
    cacheDomain === params.domain &&
    params.cache.sourceCredentialFingerprint === params.sourceCredentialFingerprint &&
    expiresAt !== void 0 &&
    expiresAt - (params.now ?? Date.now()) > 300 * 1e3
  );
}
async function resolveCopilotTokenCache(params) {
  if (
    params.cachePath !== void 0 ||
    params.loadJsonFileImpl !== void 0 ||
    params.saveJsonFileImpl !== void 0
  ) {
    const cachePath = params.cachePath?.trim() || resolveLegacyCopilotTokenCachePath(params.env);
    const loadJsonFileFn = params.loadJsonFileImpl ?? loadJsonFile;
    const saveJsonFileFn = params.saveJsonFileImpl ?? saveJsonFile;
    return {
      path: cachePath,
      load: () => loadJsonFileFn(cachePath),
      save: (value) => saveJsonFileFn(cachePath, value),
    };
  }
  const { createCorePluginStateSyncKeyedStore } = await import("./plugin-state-store-NDtw_XiB.js");
  const store = createCorePluginStateSyncKeyedStore({
    ownerId: "core:provider-auth",
    namespace: COPILOT_CACHE_NAMESPACE,
    maxEntries: COPILOT_TOKEN_CACHE_MAX_ENTRIES,
    overflowPolicy: "evict-oldest",
    env: params.env,
  });
  const key = `${params.domain}:${params.sourceCredentialFingerprint}`;
  return {
    path: "plugin-state",
    load: () => store.lookup(key),
    save: (value) =>
      store.register(key, value, { ttlMs: Math.max(1, value.expiresAt - Date.now()) }),
  };
}
//#endregion
//#region src/plugin-sdk/provider-openai-chatgpt-auth.ts
const OPENAI_CODEX_AUTH_CLAIM = "https://api.openai.com/auth";
const OPENAI_CODEX_PROFILE_CLAIM = "https://api.openai.com/profile";
/**
 * Decodes a JWT payload without verifying signatures for local metadata extraction.
 */
function decodeOpenAICodexJwtPayload(token) {
  const payload = token.split(".")[1];
  if (!payload) return;
  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : void 0;
  } catch {
    return;
  }
}
function readRecord(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}
/**
 * Resolves stable account/profile metadata from OpenAI Codex OAuth access-token claims.
 */
function resolveOpenAICodexAuthIdentity(params) {
  const payload = decodeOpenAICodexJwtPayload(params.access);
  const auth = readRecord(payload?.[OPENAI_CODEX_AUTH_CLAIM]);
  const email = normalizeOptionalString(readRecord(payload?.[OPENAI_CODEX_PROFILE_CLAIM]).email);
  const accountId = params.accountId ?? normalizeOptionalString(auth.chatgpt_account_id);
  const chatgptPlanType = normalizeOptionalString(auth.chatgpt_plan_type);
  if (email)
    return {
      ...(accountId ? { accountId } : {}),
      ...(chatgptPlanType ? { chatgptPlanType } : {}),
      email,
      profileName: email,
    };
  const stableSubject =
    normalizeOptionalString(auth.chatgpt_account_user_id) ??
    normalizeOptionalString(auth.chatgpt_user_id) ??
    normalizeOptionalString(auth.user_id) ??
    normalizeOptionalString(payload?.sub) ??
    accountId;
  return {
    ...(accountId ? { accountId } : {}),
    ...(chatgptPlanType ? { chatgptPlanType } : {}),
    ...(stableSubject
      ? { profileName: `id-${Buffer.from(stableSubject).toString("base64url")}` }
      : {}),
  };
}
/**
 * Resolves the OAuth access-token expiry timestamp in milliseconds.
 */
function resolveOpenAICodexAccessTokenExpiry(access) {
  const exp = decodeOpenAICodexJwtPayload(access)?.exp;
  return resolveExpiresAtMsFromEpochSeconds(exp);
}
/**
 * Builds persisted credential metadata for OpenAI Codex OAuth profiles.
 */
function buildOpenAICodexCredentialExtra(identity) {
  const extra = {
    ...(identity.accountId ? { accountId: identity.accountId } : {}),
    ...(identity.chatgptPlanType ? { chatgptPlanType: identity.chatgptPlanType } : {}),
    ...(identity.idToken ? { idToken: identity.idToken } : {}),
  };
  return Object.keys(extra).length > 0 ? extra : void 0;
}
/**
 * Picks the imported profile name used when migrating OpenAI Codex auth.
 */
function resolveOpenAICodexImportProfileName(identity, fallback) {
  if (identity.accountId)
    return `account-${identity.accountId.replaceAll(/[^A-Za-z0-9._-]+/gu, "-")}`;
  if (identity.profileName?.startsWith("id-")) return identity.profileName;
  return fallback;
}
//#endregion
//#region src/plugin-sdk/oauth-utils.ts
/**
 * Encode a flat object as application/x-www-form-urlencoded form data.
 *
 * @deprecated OAuth provider-owned helper; keep this local to provider plugins instead.
 */
function toFormUrlEncoded(data) {
  return Object.entries(data)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join("&");
}
/**
 * Generate a PKCE verifier/challenge pair suitable for OAuth authorization flows.
 *
 * @deprecated OAuth provider-owned helper; keep this local to provider plugins instead.
 */
function generatePkceVerifierChallenge() {
  const verifier = randomBytes(32).toString("base64url");
  return {
    verifier,
    challenge: createHash("sha256").update(verifier).digest("base64url"),
  };
}
/** Generate a PKCE verifier/challenge pair with a 64-character hex verifier. */
function generateHexPkceVerifierChallenge() {
  const verifier = randomBytes(32).toString("hex");
  return {
    verifier,
    challenge: createHash("sha256").update(verifier).digest("base64url"),
  };
}
//#endregion
//#region src/plugin-sdk/provider-auth.ts
/** @deprecated GitHub Copilot provider-owned helper; do not use from third-party plugins. */
const DEFAULT_COPILOT_API_BASE_URL = "https://api.individual.githubcopilot.com";
/**
 * Data-residency GitHub Enterprise (`*.ghe.com`) support.
 *
 * Copilot on a data-residency GHE tenant lives at `<domain>` / `api.<domain>` /
 * `copilot-api.<domain>` rather than the public github.com endpoints. The host
 * is resolved (in priority order) from the `COPILOT_GITHUB_DOMAIN` env override,
 * the persisted `models.providers.github-copilot.params.githubDomain` config, and
 * finally public `github.com`.
 */
const COPILOT_PROVIDER_ID = "github-copilot";
const COPILOT_TOKEN_EXCHANGE_TIMEOUT_MS = 3e4;
const GHE_DATA_RESIDENCY_HOST = /^[a-z0-9-]+\.ghe\.com$/;
/**
 * Coerce a user/config-supplied GitHub host to a safe bare lowercase hostname.
 *
 * Fails closed to public `github.com`: only the public host and data-residency
 * GHE tenants (`*.ghe.com`) are trusted. Any other value falls back to the
 * default rather than being used verbatim, because the resolved host becomes the
 * `api.<host>` endpoint that receives the GitHub OAuth token during exchange — a
 * typo or injected value like `evil.com` must never redirect that token.
 * (Classic self-hosted GHE Server uses arbitrary hostnames but does not host
 * Copilot, so it is deliberately out of scope.)
 */
function normalizeGithubCopilotDomain(raw) {
  const trimmed = (raw ?? "").trim().toLowerCase();
  if (!trimmed) return DEFAULT_GITHUB_COPILOT_DOMAIN;
  if (!/^[a-z0-9.-]+$/.test(trimmed)) return DEFAULT_GITHUB_COPILOT_DOMAIN;
  if (trimmed === "github.com" || GHE_DATA_RESIDENCY_HOST.test(trimmed)) return trimmed;
  return DEFAULT_GITHUB_COPILOT_DOMAIN;
}
function readGithubCopilotDomainFromConfig(config) {
  const params = config?.models?.providers?.[COPILOT_PROVIDER_ID]?.params;
  const value = params && typeof params === "object" ? params.githubDomain : void 0;
  if (typeof value !== "string" || value.trim().length === 0) return;
  const trimmed = value.trim();
  warnOnceOnRejectedConfigDomain(trimmed);
  return trimmed;
}
const warnedRejectedConfigDomains = /* @__PURE__ */ new Set();
function warnOnceOnRejectedConfigDomain(configured) {
  const lowered = configured.toLowerCase();
  if (lowered === "github.com") return;
  if (normalizeGithubCopilotDomain(configured) !== "github.com") return;
  if (warnedRejectedConfigDomains.has(lowered)) return;
  warnedRejectedConfigDomains.add(lowered);
  logWarn(
    `Ignoring configured GitHub Copilot domain "${configured}": only github.com and *.ghe.com tenants are accepted. Falling back to github.com.`,
  );
}
function resolveGithubCopilotDomain(params) {
  const fromEnv = (params?.env ?? process.env).COPILOT_GITHUB_DOMAIN?.trim();
  if (fromEnv) return normalizeGithubCopilotDomain(fromEnv);
  if (params?.explicit) return normalizeGithubCopilotDomain(params.explicit);
  return normalizeGithubCopilotDomain(readGithubCopilotDomainFromConfig(params?.config));
}
/**
 * Data-residency GHE Copilot tokens carry no `proxy-ep`, so the completions base
 * URL cannot be derived from the token. Point it at the tenant Copilot proxy
 * (`copilot-api.<domain>`) instead of the public individual endpoint.
 */
function copilotTokenUrl(domain) {
  return `https://api.${domain}/copilot_internal/v2/token`;
}
function copilotApiBaseFallback(domain) {
  return domain === "github.com" ? DEFAULT_COPILOT_API_BASE_URL : `https://copilot-api.${domain}`;
}
function resolveCopilotTokenExpiresAtMs(expiresAt) {
  const parsed =
    typeof expiresAt === "number" && Number.isFinite(expiresAt)
      ? expiresAt
      : typeof expiresAt === "string" && expiresAt.trim().length > 0
        ? parseStrictNonNegativeInteger(expiresAt)
        : void 0;
  if (parsed === void 0) return;
  return parsed < 1e11 ? resolveExpiresAtMsFromEpochSeconds(parsed) : asDateTimestampMs(parsed);
}
function parseCopilotTokenResponse(value) {
  if (!value || typeof value !== "object")
    throw new Error("Unexpected response from GitHub Copilot token endpoint");
  const asRecord = value;
  const token = asRecord.token;
  const expiresAt = asRecord.expires_at;
  if (typeof token !== "string" || token.trim().length === 0)
    throw new Error("Copilot token response missing token");
  const expiresAtMs = resolveCopilotTokenExpiresAtMs(expiresAt);
  if (
    expiresAt === void 0 ||
    expiresAt === null ||
    (typeof expiresAt === "string" && expiresAt.trim().length === 0)
  )
    throw new Error("Copilot token response missing expires_at");
  if (expiresAtMs === void 0) throw new Error("Copilot token response has invalid expires_at");
  return {
    token,
    expiresAt: expiresAtMs,
  };
}
async function cancelUnreadResponseBody(response) {
  if (!response.bodyUsed) await response.body?.cancel().catch(() => void 0);
}
function resolveCopilotProxyHost(proxyEp) {
  const trimmed = proxyEp.trim();
  if (!trimmed) return null;
  const urlText = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(urlText);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return normalizeLowercaseStringOrEmpty(url.hostname);
  } catch {
    return null;
  }
}
/** @deprecated GitHub Copilot provider-owned helper; do not use from third-party plugins. */
function deriveCopilotApiBaseUrlFromToken(token) {
  const trimmed = token.trim();
  if (!trimmed) return null;
  const proxyEp = trimmed.match(/(?:^|;)\s*proxy-ep=([^;\s]+)/i)?.[1]?.trim();
  if (!proxyEp) return null;
  const proxyHost = resolveCopilotProxyHost(proxyEp);
  if (!proxyHost) return null;
  const baseUrl = `https://${proxyHost.replace(/^proxy\./i, "api.")}`;
  return resolveProviderEndpoint(baseUrl).endpointClass === "invalid" ? null : baseUrl;
}
/**
 * @deprecated GitHub Copilot provider-owned helper; do not use from third-party plugins.
 */
async function resolveCopilotApiToken(params) {
  const env = params.env ?? process.env;
  const domain = resolveGithubCopilotDomain({
    env,
    explicit: params.githubDomain,
    config: params.config,
  });
  const tokenUrl = copilotTokenUrl(domain);
  const apiBaseFallback = copilotApiBaseFallback(domain);
  const sourceCredentialFingerprint = fingerprintCopilotSourceCredential(params.githubToken);
  const cache = await resolveCopilotTokenCache({
    env,
    domain,
    sourceCredentialFingerprint,
    ...(params.cachePath !== void 0 ? { cachePath: params.cachePath } : {}),
    ...(params.loadJsonFileImpl ? { loadJsonFileImpl: params.loadJsonFileImpl } : {}),
    ...(params.saveJsonFileImpl ? { saveJsonFileImpl: params.saveJsonFileImpl } : {}),
  });
  const cachePath = cache.path;
  const cached = cache.load();
  if (cached && typeof cached.token === "string" && typeof cached.expiresAt === "number") {
    if (
      isCopilotTokenUsable({
        cache: cached,
        domain,
        sourceCredentialFingerprint,
      })
    )
      return {
        token: cached.token,
        expiresAt: cached.expiresAt,
        source: `cache:${cachePath}`,
        baseUrl: deriveCopilotApiBaseUrlFromToken(cached.token) ?? apiBaseFallback,
      };
  }
  const fetchImpl = params.fetchImpl ?? fetch;
  const signal = AbortSignal.timeout(COPILOT_TOKEN_EXCHANGE_TIMEOUT_MS);
  let json;
  try {
    const res = await fetchImpl(tokenUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${params.githubToken}`,
        "Copilot-Integration-Id": COPILOT_INTEGRATION_ID,
        ...buildCopilotIdeHeaders({ includeApiVersion: true }),
      },
      signal,
    });
    if (!res.ok) {
      await cancelUnreadResponseBody(res);
      throw new Error(`Copilot token exchange failed: HTTP ${res.status}`);
    }
    json = parseCopilotTokenResponse(await readProviderJsonResponse(res, "github-copilot.token"));
  } catch (error) {
    if (signal.aborted && error === signal.reason)
      throw new Error(
        `Copilot token exchange failed: timed out after ${COPILOT_TOKEN_EXCHANGE_TIMEOUT_MS}ms`,
        { cause: error },
      );
    throw error;
  }
  const payload = {
    token: json.token,
    expiresAt: json.expiresAt,
    updatedAt: Date.now(),
    integrationId: COPILOT_INTEGRATION_ID,
    sourceCredentialFingerprint,
    domain,
  };
  cache.save(payload);
  return {
    token: payload.token,
    expiresAt: payload.expiresAt,
    source: `fetched:${tokenUrl}`,
    baseUrl: deriveCopilotApiBaseUrlFromToken(payload.token) ?? apiBaseFallback,
  };
}
/**
 * Checks whether a provider has either env auth or matching local auth profiles configured.
 */
function isProviderApiKeyConfigured(params) {
  if (resolveEnvApiKey(params.provider)?.apiKey) return true;
  const agentDir = params.agentDir?.trim();
  if (!agentDir) return false;
  const store = ensureAuthProfileStore(agentDir, { allowKeychainPrompt: false });
  const profileIds = listProfilesForProvider(store, params.provider);
  if (!params.profileTypes?.length) return profileIds.length > 0;
  const allowedTypes = new Set(params.profileTypes);
  return profileIds.some((profileId) => {
    const type = store.profiles[profileId]?.type;
    return type !== void 0 && allowedTypes.has(type);
  });
}
/**
 * Lists auth profile ids usable for a provider without throwing on missing stores or keychain access.
 */
function listUsableProviderAuthProfileIds(params) {
  try {
    const { agentDir, profileIds, store } = resolveUsableProviderAuthProfiles(params);
    return {
      agentDir,
      profileIds: filterAuthProfileIdsByType(store, profileIds, params),
    };
  } catch {
    return {
      agentDir: "",
      profileIds: [],
    };
  }
}
/**
 * Checks whether any usable auth profile exists for a provider.
 */
function isProviderAuthProfileConfigured(params) {
  return listUsableProviderAuthProfileIds(params).profileIds.length > 0;
}
/**
 * Resolves the first usable auth-profile API key for a provider in configured profile order.
 */
async function resolveProviderAuthProfileApiKey(params) {
  const { agentDir, profileIds, store } = resolveUsableProviderAuthProfiles(params);
  if (!agentDir || profileIds.length === 0) return;
  for (const profileId of filterAuthProfileIdsByType(store, profileIds, params)) {
    const resolved = await resolveApiKeyForProfile({
      cfg: params.cfg,
      store,
      agentDir,
      profileId,
    });
    if (resolved?.apiKey) return resolved.apiKey;
  }
}
function resolveUsableProviderAuthProfiles(params) {
  const agentDir = params.agentDir?.trim() || resolveDefaultAgentDir(params.cfg ?? {});
  const externalCli = params.includeExternalCliAuth
    ? externalCliDiscoveryForProviderAuth({
        cfg: params.cfg,
        provider: params.provider,
        allowKeychainPrompt: params.allowKeychainPrompt,
      })
    : void 0;
  const store = externalCli
    ? loadAuthProfileStoreForSecretsRuntime(agentDir, { externalCli })
    : loadAuthProfileStoreForSecretsRuntime(agentDir);
  const profileIds = resolveAuthProfileOrder({
    cfg: params.cfg,
    store,
    provider: params.provider,
  });
  if (profileIds.length > 0)
    return {
      agentDir,
      profileIds,
      store,
    };
  const fallbackStore = loadAuthProfileStoreWithoutExternalProfiles(agentDir, {
    allowKeychainPrompt: params.allowKeychainPrompt ?? false,
  });
  return {
    agentDir,
    profileIds: resolveAuthProfileOrder({
      cfg: params.cfg,
      store: fallbackStore,
      provider: params.provider,
    }),
    store: fallbackStore,
  };
}
function filterAuthProfileIdsByType(store, profileIds, params) {
  if (!params.profileTypes?.length) return [...profileIds];
  const allowedTypes = new Set(params.profileTypes);
  return profileIds.filter((profileId) => {
    const type = store.profiles[profileId]?.type;
    return type !== void 0 && allowedTypes.has(type);
  });
}
//#endregion
export {
  listUsableProviderAuthProfileIds as a,
  resolveProviderAuthProfileApiKey as c,
  toFormUrlEncoded as d,
  buildOpenAICodexCredentialExtra as f,
  resolveOpenAICodexImportProfileName as g,
  resolveOpenAICodexAuthIdentity as h,
  isProviderAuthProfileConfigured as i,
  generateHexPkceVerifierChallenge as l,
  resolveOpenAICodexAccessTokenExpiry as m,
  deriveCopilotApiBaseUrlFromToken as n,
  normalizeGithubCopilotDomain as o,
  decodeOpenAICodexJwtPayload as p,
  isProviderApiKeyConfigured as r,
  resolveCopilotApiToken as s,
  DEFAULT_COPILOT_API_BASE_URL as t,
  generatePkceVerifierChallenge as u,
};
