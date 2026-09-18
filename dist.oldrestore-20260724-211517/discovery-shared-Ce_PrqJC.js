import { i as OLLAMA_DEFAULT_BASE_URL } from "./defaults-W8ZJNfBr.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import {
  t as readProviderBaseUrl,
  u as resolveOllamaApiBase,
} from "./provider-base-url-BOHQJG0k.js";
import { i as getCachedLiveCatalogValue } from "./provider-catalog-shared-CQScmZZs.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region extensions/ollama/src/discovery-shared.ts
const OLLAMA_PROVIDER_ID = "ollama";
const OLLAMA_DEFAULT_API_KEY = "ollama-local";
function readStringValue(value) {
  if (typeof value === "string") return normalizeOptionalString(value);
  if (value && typeof value === "object" && "value" in value)
    return normalizeOptionalString(value.value);
}
function isOllamaApiKeyMarker(value) {
  return value === "OLLAMA_API_KEY" || value === "ollama-local";
}
function resolveOllamaRuntimeBaseUrl(params) {
  if (params.configuredBaseUrl && params.api && params.api !== "ollama")
    return params.configuredBaseUrl;
  return params.discoveredBaseUrl;
}
function resolveOllamaDiscoveryApiKey(params) {
  const envValue = normalizeOptionalString(params.env.OLLAMA_API_KEY);
  const resolvedApiKey = normalizeOptionalString(params.resolvedApiKey);
  const resolvedDiscoveryApiKey = normalizeOptionalString(params.resolvedDiscoveryApiKey);
  const explicitApiKey = normalizeOptionalString(params.explicitApiKey);
  if (explicitApiKey && !isOllamaApiKeyMarker(explicitApiKey)) return explicitApiKey;
  if (!isLocalOllamaBaseUrl(params.baseUrl)) {
    if (resolvedDiscoveryApiKey) return resolvedDiscoveryApiKey;
    if (resolvedApiKey && !isOllamaApiKeyMarker(resolvedApiKey)) return resolvedApiKey;
    return envValue && envValue !== "ollama-local" ? envValue : void 0;
  }
  if (resolvedApiKey && resolvedApiKey !== envValue && !isOllamaApiKeyMarker(resolvedApiKey))
    return resolvedApiKey;
  return OLLAMA_DEFAULT_API_KEY;
}
function shouldSkipAmbientOllamaDiscovery(env) {
  return Boolean(env.VITEST) || env.NODE_ENV === "test";
}
const LOCAL_OLLAMA_HOSTNAMES = /* @__PURE__ */ new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "::1",
  "::",
  "docker.orb.internal",
  "host.docker.internal",
  "host.orb.internal",
]);
const LOOPBACK_OLLAMA_HOSTNAMES = /* @__PURE__ */ new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "::1",
  "::",
]);
function isIpv4Loopback(host) {
  if (!/^\d+\.\d+\.\d+\.\d+$/.test(host)) return false;
  const octets = host.split(".").map((part) => Number.parseInt(part, 10));
  if (octets.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) return false;
  return octets[0] === 127;
}
function isIpv4PrivateRange(host) {
  if (!/^\d+\.\d+\.\d+\.\d+$/.test(host)) return false;
  const octets = host.split(".").map((part) => Number.parseInt(part, 10));
  if (octets.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) return false;
  const [a, b] = octets;
  if (a === void 0 || b === void 0) return false;
  return a === 10 || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168);
}
function isIpv6LocalRange(host) {
  const lower = host.toLowerCase();
  return /^fe[89ab][0-9a-f]:/.test(lower) || /^f[cd][0-9a-f]{2}:/.test(lower);
}
function isLocalOllamaBaseUrl(baseUrl) {
  if (!baseUrl) return true;
  let parsed;
  try {
    parsed = new URL(baseUrl);
  } catch {
    return false;
  }
  let host = parsed.hostname.toLowerCase();
  if (host.startsWith("[") && host.endsWith("]")) host = host.slice(1, -1);
  return (
    LOCAL_OLLAMA_HOSTNAMES.has(host) ||
    host.endsWith(".local") ||
    isIpv4PrivateRange(host) ||
    isIpv6LocalRange(host) ||
    (!host.includes(".") && !host.includes(":"))
  );
}
const HOSTED_OLLAMA_CLOUD_HOSTNAMES = /* @__PURE__ */ new Set(["ollama.com", "api.ollama.com"]);
function isHostedOllamaCloud(baseUrl) {
  if (!baseUrl) return false;
  let parsed;
  try {
    parsed = new URL(baseUrl);
  } catch {
    return false;
  }
  const host = parsed.hostname.toLowerCase();
  return HOSTED_OLLAMA_CLOUD_HOSTNAMES.has(host) || host.endsWith(".ollama.com");
}
function isLoopbackOllamaBaseUrl(baseUrl) {
  if (!baseUrl) return true;
  let parsed;
  try {
    parsed = new URL(baseUrl);
  } catch {
    return false;
  }
  let host = parsed.hostname.toLowerCase();
  if (host.startsWith("[") && host.endsWith("]")) host = host.slice(1, -1);
  return LOOPBACK_OLLAMA_HOSTNAMES.has(host) || isIpv4Loopback(host);
}
function hasExplicitRemoteOllamaApiProvider(providers) {
  if (!providers) return false;
  for (const [providerId, provider] of Object.entries(providers)) {
    if (providerId === "ollama" || !provider) continue;
    if (normalizeOptionalString(provider.api)?.toLowerCase() !== "ollama") continue;
    const baseUrl = readProviderBaseUrl(provider);
    if (baseUrl && !isLoopbackOllamaBaseUrl(baseUrl)) return true;
  }
  return false;
}
function shouldUseSyntheticOllamaAuth(providerConfig) {
  if (!hasMeaningfulExplicitOllamaConfig(providerConfig)) return false;
  return isLocalOllamaBaseUrl(readProviderBaseUrl(providerConfig));
}
function hasMeaningfulExplicitOllamaConfig(providerConfig) {
  if (!providerConfig) return false;
  if (Array.isArray(providerConfig.models) && providerConfig.models.length > 0) return true;
  const baseUrl = readProviderBaseUrl(providerConfig);
  if (baseUrl) return resolveOllamaApiBase(baseUrl) !== OLLAMA_DEFAULT_BASE_URL;
  if (readStringValue(providerConfig.apiKey)) return true;
  if (providerConfig.auth) return true;
  if (typeof providerConfig.authHeader === "boolean") return true;
  if (
    providerConfig.headers &&
    typeof providerConfig.headers === "object" &&
    Object.keys(providerConfig.headers).length > 0
  )
    return true;
  if (providerConfig.request) return true;
  if (typeof providerConfig.injectNumCtxForOpenAICompat === "boolean") return true;
  return false;
}
async function resolveOllamaDiscoveryResult(params) {
  const explicit = params.ctx.config.models?.providers?.ollama;
  const hasExplicitModels = Array.isArray(explicit?.models) && explicit.models.length > 0;
  const hasMeaningfulExplicitConfig = hasMeaningfulExplicitOllamaConfig(explicit);
  const hasRemoteOllamaApiProvider = hasExplicitRemoteOllamaApiProvider(
    params.ctx.config.models?.providers,
  );
  const discoveryEnabled = params.pluginConfig.discovery?.enabled;
  if (!hasExplicitModels && discoveryEnabled === false) return null;
  const configuredBaseUrl = readProviderBaseUrl(explicit);
  if (!hasExplicitModels && configuredBaseUrl && isHostedOllamaCloud(configuredBaseUrl))
    return null;
  const resolvedOllamaAuth = params.ctx.resolveProviderApiKey(OLLAMA_PROVIDER_ID);
  const ollamaKey = resolvedOllamaAuth.apiKey;
  const ollamaDiscoveryKey = resolvedOllamaAuth.discoveryApiKey;
  const hasOllamaDiscoveryOptIn = typeof ollamaKey === "string" && ollamaKey.trim().length > 0;
  const hasRealOllamaKey =
    typeof ollamaKey === "string" &&
    ollamaKey.trim().length > 0 &&
    ollamaKey.trim() !== "ollama-local";
  const explicitApiKey = readStringValue(explicit?.apiKey);
  if (hasExplicitModels && explicit) {
    const discoveredBaseUrl = resolveOllamaApiBase(configuredBaseUrl);
    const api = explicit.api ?? "ollama";
    const apiKey = resolveOllamaDiscoveryApiKey({
      env: params.ctx.env,
      baseUrl: discoveredBaseUrl,
      explicitApiKey,
      resolvedApiKey: ollamaKey,
      resolvedDiscoveryApiKey: ollamaDiscoveryKey,
    });
    return {
      provider: {
        ...explicit,
        models: explicit.models ?? [],
        baseUrl: resolveOllamaRuntimeBaseUrl({
          api,
          configuredBaseUrl,
          discoveredBaseUrl,
        }),
        api,
        ...(apiKey ? { apiKey } : {}),
      },
    };
  }
  if (!hasMeaningfulExplicitConfig && hasRemoteOllamaApiProvider) return null;
  if (!hasOllamaDiscoveryOptIn && !hasMeaningfulExplicitConfig) return null;
  if (
    !hasRealOllamaKey &&
    !hasMeaningfulExplicitConfig &&
    shouldSkipAmbientOllamaDiscovery(params.ctx.env)
  )
    return null;
  const quiet = !hasRealOllamaKey && !hasMeaningfulExplicitConfig;
  const provider = await getCachedLiveCatalogValue({
    keyParts: [
      OLLAMA_PROVIDER_ID,
      "models",
      configuredBaseUrl ?? "http://127.0.0.1:11434",
      ollamaKey,
      quiet,
    ],
    load: async () => await params.buildProvider(configuredBaseUrl, { quiet }),
  });
  if (provider.models?.length === 0 && !ollamaKey && !explicit?.apiKey) return null;
  const apiKey = resolveOllamaDiscoveryApiKey({
    env: params.ctx.env,
    baseUrl: provider.baseUrl ?? configuredBaseUrl,
    explicitApiKey,
    resolvedApiKey: ollamaKey,
    resolvedDiscoveryApiKey: ollamaDiscoveryKey,
  });
  const api = explicit?.api ?? provider.api;
  return {
    provider: {
      ...provider,
      baseUrl: resolveOllamaRuntimeBaseUrl({
        api,
        configuredBaseUrl,
        discoveredBaseUrl: provider.baseUrl,
      }),
      api,
      ...(apiKey ? { apiKey } : {}),
    },
  };
}
//#endregion
export {
  resolveOllamaRuntimeBaseUrl as a,
  resolveOllamaDiscoveryResult as i,
  OLLAMA_PROVIDER_ID as n,
  shouldUseSyntheticOllamaAuth as o,
  isLocalOllamaBaseUrl as r,
  OLLAMA_DEFAULT_API_KEY as t,
};
