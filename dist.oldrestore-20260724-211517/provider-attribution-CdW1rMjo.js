import fs from "node:fs";
import path from "node:path";
import { t as asBoolean } from "./boolean-CrriykWV.js";
import { n as resolveBundledPluginsDir } from "./bundled-dir-CehpKn-r.js";
import { r as resolveHomeRelativePath } from "./home-dir-DxrrpDft.js";
import { i as readPersistedInstalledPluginIndexSync } from "./installed-plugin-index-store-XopnPfaM.js";
import { n as MANIFEST_KEY } from "./legacy-names-NIXaj2oi.js";
import { r as official_external_provider_catalog_default } from "./official-external-plugin-bundled-catalogs-W0nGXVEa.js";
import { n as resolveOpenClawPackageRootSync } from "./openclaw-root-DSkQ6e_8.js";
import { t as parseJsonWithJson5Fallback } from "./parse-json-compat-CmZHj-1e.js";
import { y as resolveStateDir } from "./paths-DEklnbzU.js";
import { r as normalizeProviderId } from "./provider-id-BIcU_2-A.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
import { d as normalizeTrimmedStringList } from "./string-normalization-CRyoFBPt.js";
import { s as resolveRuntimeServiceVersion } from "./version-CeFj_iGk.js";
//#region src/plugins/manifest-metadata-scan.ts
const PLUGIN_MANIFEST_FILENAME = "openclaw.plugin.json";
let manifestMetadataCache;
function listChildPluginDirs(root, rank, startOrder, origin) {
  if (!root || !fs.existsSync(root)) return [];
  const dirs = [];
  let order = startOrder;
  try {
    for (const entry of fs.readdirSync(root, { withFileTypes: true }))
      if (entry.isDirectory())
        dirs.push({
          pluginDir: path.join(root, entry.name),
          rank,
          order: order++,
          origin,
        });
  } catch {
    return [];
  }
  return dirs;
}
function readJsonObject(filePath) {
  try {
    const parsed = parseJsonWithJson5Fallback(fs.readFileSync(filePath, "utf8"));
    return isRecord(parsed) ? parsed : void 0;
  } catch {
    return;
  }
}
function readManifestObject(pluginDir) {
  return readJsonObject(path.join(pluginDir, PLUGIN_MANIFEST_FILENAME));
}
function manifestFileFingerprint(pluginDir) {
  const manifestPath = path.join(pluginDir, PLUGIN_MANIFEST_FILENAME);
  try {
    const stat = fs.statSync(manifestPath);
    return `${manifestPath}:${stat.mtimeMs}:${stat.size}`;
  } catch {
    return `${manifestPath}:missing`;
  }
}
function listPersistedIndexPluginDirs(env, startOrder) {
  const index = readPersistedInstalledPluginIndexSync({ env });
  if (!index) return [];
  const dirs = [];
  let order = startOrder;
  for (const plugin of index.plugins) {
    const rootDir = normalizeOptionalString(plugin.rootDir);
    if (!rootDir) continue;
    dirs.push({
      pluginDir: resolveHomeRelativePath(rootDir, { env }),
      rank: plugin.origin === "bundled" ? 3 : 1,
      order: order++,
      origin: normalizeOptionalString(plugin.origin),
    });
  }
  return dirs;
}
function isSourceCheckoutRoot(packageRoot) {
  return (
    fs.existsSync(path.join(packageRoot, "pnpm-workspace.yaml")) &&
    fs.existsSync(path.join(packageRoot, "src")) &&
    fs.existsSync(path.join(packageRoot, "extensions"))
  );
}
function resolvePackageRootsForSourceManifestMetadata() {
  const roots = [];
  for (const params of [{ argv1: process.argv[1] }, { moduleUrl: import.meta.url }]) {
    const root = resolveOpenClawPackageRootSync(params);
    if (root && !roots.includes(root)) roots.push(root);
  }
  return roots;
}
function listSourceCheckoutPluginDirs(startOrder) {
  const dirs = [];
  let order = startOrder;
  for (const packageRoot of resolvePackageRootsForSourceManifestMetadata()) {
    if (!isSourceCheckoutRoot(packageRoot)) continue;
    dirs.push(...listChildPluginDirs(path.join(packageRoot, "extensions"), 3, order, "source"));
    order = startOrder + dirs.length;
  }
  return dirs;
}
function resolveComparablePath(filePath) {
  try {
    return fs.realpathSync(filePath);
  } catch {
    return path.resolve(filePath);
  }
}
function uniqueCandidateDirs(candidates) {
  const byPath = /* @__PURE__ */ new Map();
  for (const candidate of candidates) {
    const key = resolveComparablePath(candidate.pluginDir);
    const existing = byPath.get(key);
    if (!existing || candidate.rank < existing.rank || candidate.order < existing.order)
      byPath.set(key, candidate);
  }
  return [...byPath.values()].toSorted(
    (left, right) => left.rank - right.rank || left.order - right.order,
  );
}
/** Lists plugin manifest metadata from installed, bundled, and global plugin roots. */
function listOpenClawPluginManifestMetadata(env = process.env) {
  const candidates = [];
  let order = 0;
  candidates.push(...listPersistedIndexPluginDirs(env, order));
  order = candidates.length;
  candidates.push(...listChildPluginDirs(resolveBundledPluginsDir(env), 2, order, "bundled"));
  order = candidates.length;
  candidates.push(...listSourceCheckoutPluginDirs(order));
  order = candidates.length;
  candidates.push(
    ...listChildPluginDirs(path.join(resolveStateDir(env), "extensions"), 4, order, "global"),
  );
  const uniqueCandidates = uniqueCandidateDirs(candidates);
  const cacheKey = JSON.stringify(
    uniqueCandidates.map((candidate) => [
      candidate.pluginDir,
      candidate.rank,
      candidate.order,
      candidate.origin ?? "",
      manifestFileFingerprint(candidate.pluginDir),
    ]),
  );
  if (manifestMetadataCache?.key === cacheKey) return manifestMetadataCache.records.slice();
  const byManifestId = /* @__PURE__ */ new Map();
  const records = [];
  for (const candidate of uniqueCandidates) {
    const manifest = readManifestObject(candidate.pluginDir);
    if (!manifest) continue;
    const manifestId = normalizeOptionalString(manifest.id);
    if (manifestId) {
      const existing = byManifestId.get(manifestId);
      if (existing && existing.rank <= candidate.rank) continue;
      byManifestId.set(manifestId, candidate);
    }
    records.push({
      pluginDir: candidate.pluginDir,
      manifest,
      origin: candidate.origin,
    });
  }
  manifestMetadataCache = {
    key: cacheKey,
    records,
  };
  return records;
}
//#endregion
//#region src/plugins/official-external-provider-endpoints.ts
/**
 * Provider endpoint metadata for officially externalized provider plugins.
 *
 * Endpoint classification (SSRF, attribution, payload-compat policy) keys off
 * base URLs and must keep working when the owning plugin is not installed:
 * dist packages exclude externalized plugins, so their manifests are invisible
 * to bundled discovery. Only the repo-bundled catalog JSON feeds this table;
 * hosted marketplace feeds must never influence endpoint classification.
 * Kept separate from official-external-plugin-catalog.ts so provider
 * transports do not pull the ClawHub install/marketplace module graph.
 */
/**
 * Lists manifest-shaped catalog metadata blocks that declare provider endpoints.
 *
 * The catalog mirrors manifests faithfully, including endpoint classes core
 * does not (yet) recognize (e.g. deepinfra-native, gmi-native). The endpoint
 * reader filters unknown classes exactly as it does for installed manifests,
 * so they stay inert instead of complicating the mirror contract.
 */
function listOfficialExternalProviderEndpointManifests() {
  const entries = official_external_provider_catalog_default.entries;
  if (!Array.isArray(entries)) return [];
  const manifests = [];
  for (const entry of entries) {
    if (!isRecord(entry)) continue;
    const manifest = entry[MANIFEST_KEY];
    if (isRecord(manifest) && Array.isArray(manifest.providerEndpoints)) manifests.push(manifest);
  }
  return manifests;
}
//#endregion
//#region src/agents/provider-attribution.ts
/**
 * Provider endpoint attribution and request capability resolver.
 *
 * Classifies provider routes so transports know which attribution headers, payload features, and endpoint policies apply.
 */
function readCompatBoolean(compat, key) {
  if (!compat || typeof compat !== "object") return;
  return asBoolean(compat[key]);
}
const OPENCLAW_ATTRIBUTION_PRODUCT = "OpenClaw";
const OPENCLAW_ATTRIBUTION_ORIGINATOR = "openclaw";
const OPENROUTER_ATTRIBUTION_CATEGORIES =
  "cli-agent,cloud-agent,programming-app,creative-writing,writing-assistant,general-chat,personal-agent";
const LOCAL_ENDPOINT_HOSTS = /* @__PURE__ */ new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);
const OPENAI_RESPONSES_APIS = /* @__PURE__ */ new Set([
  "openai-responses",
  "azure-openai-responses",
  "openai-chatgpt-responses",
]);
const OPENAI_RESPONSES_PROVIDERS = /* @__PURE__ */ new Set([
  "openai",
  "azure-openai",
  "azure-openai-responses",
]);
const MANIFEST_PROVIDER_ENDPOINT_CLASSES = /* @__PURE__ */ new Set([
  "anthropic-public",
  "cerebras-native",
  "chutes-native",
  "deepseek-native",
  "github-copilot-native",
  "groq-native",
  "meta-native",
  "mistral-public",
  "moonshot-native",
  "modelstudio-native",
  "nvidia-native",
  "openai-public",
  "openai",
  "opencode-native",
  "azure-openai",
  "openrouter",
  "xai-native",
  "xiaomi-native",
  "zai-native",
  "google-generative-ai",
  "google-vertex",
]);
let manifestProviderEndpointCache = null;
let manifestProviderRequestCache = null;
function formatOpenClawUserAgent(version) {
  return `${OPENCLAW_ATTRIBUTION_ORIGINATOR}/${version}`;
}
function tryParseHostname(value) {
  try {
    return normalizeOptionalLowercaseString(new URL(value).hostname);
  } catch {
    return;
  }
}
function isSchemelessHostnameCandidate(value) {
  return /^[a-z0-9.[\]-]+(?::\d+)?(?:[/?#].*)?$/i.test(value);
}
function resolveUrlHostname(value) {
  const trimmed = normalizeOptionalString(value);
  if (!trimmed) return;
  const parsedHostname = tryParseHostname(trimmed);
  if (parsedHostname) return parsedHostname;
  if (!isSchemelessHostnameCandidate(trimmed)) return;
  return tryParseHostname(`https://${trimmed}`);
}
function normalizeComparableBaseUrl(value) {
  const trimmed = normalizeOptionalString(value);
  if (!trimmed) return;
  const parsedValue =
    tryParseHostname(trimmed) || !isSchemelessHostnameCandidate(trimmed)
      ? trimmed
      : `https://${trimmed}`;
  try {
    const url = new URL(parsedValue);
    if (url.protocol !== "http:" && url.protocol !== "https:") return;
    url.hash = "";
    url.search = "";
    return normalizeOptionalLowercaseString(url.toString().replace(/\/+$/, ""));
  } catch {
    return;
  }
}
function isManifestProviderEndpointClass(value) {
  return MANIFEST_PROVIDER_ENDPOINT_CLASSES.has(value);
}
function readManifestProviderEndpoints(manifest) {
  if (!Array.isArray(manifest.providerEndpoints)) return [];
  const entries = [];
  for (const rawEndpoint of manifest.providerEndpoints) {
    if (!isRecord(rawEndpoint)) continue;
    const endpointClassRaw = normalizeOptionalString(rawEndpoint.endpointClass);
    if (!endpointClassRaw || !isManifestProviderEndpointClass(endpointClassRaw)) continue;
    entries.push({
      endpointClass: endpointClassRaw,
      hosts: normalizeTrimmedStringList(rawEndpoint.hosts).map((host) => host.toLowerCase()),
      hostSuffixes: normalizeTrimmedStringList(rawEndpoint.hostSuffixes).map((host) =>
        host.toLowerCase(),
      ),
      normalizedBaseUrls: normalizeTrimmedStringList(rawEndpoint.baseUrls)
        .map((baseUrl) => normalizeComparableBaseUrl(baseUrl))
        .filter((baseUrl) => baseUrl !== void 0),
      ...(normalizeOptionalString(rawEndpoint.googleVertexRegion)
        ? { googleVertexRegion: normalizeOptionalString(rawEndpoint.googleVertexRegion) }
        : {}),
      ...(normalizeOptionalString(rawEndpoint.googleVertexRegionHostSuffix)
        ? {
            googleVertexRegionHostSuffix: normalizeOptionalString(
              rawEndpoint.googleVertexRegionHostSuffix,
            ),
          }
        : {}),
    });
  }
  return entries;
}
function readManifestProviderRequests(manifest) {
  const providerRequest = manifest.providerRequest;
  if (!isRecord(providerRequest) || !isRecord(providerRequest.providers)) return [];
  const entries = [];
  for (const [providerRaw, requestRaw] of Object.entries(providerRequest.providers)) {
    if (!isRecord(requestRaw)) continue;
    const provider = normalizeLowercaseStringOrEmpty(providerRaw);
    if (!provider) continue;
    const compatibilityFamily =
      normalizeOptionalString(requestRaw.compatibilityFamily) === "moonshot" ? "moonshot" : void 0;
    const supportsStreamingUsage = isRecord(requestRaw.openAICompletions)
      ? requestRaw.openAICompletions.supportsStreamingUsage
      : void 0;
    entries.push([
      provider,
      {
        ...(normalizeOptionalString(requestRaw.family)
          ? { family: normalizeOptionalString(requestRaw.family) }
          : {}),
        ...(compatibilityFamily ? { compatibilityFamily } : {}),
        ...(typeof supportsStreamingUsage === "boolean"
          ? { supportsOpenAICompletionsStreamingUsageCompat: supportsStreamingUsage }
          : {}),
      },
    ]);
  }
  return entries;
}
function collectManifestProviderEndpoints() {
  const entries = [];
  for (const { manifest } of listOpenClawPluginManifestMetadata())
    entries.push(...readManifestProviderEndpoints(manifest));
  for (const manifest of listOfficialExternalProviderEndpointManifests())
    entries.push(...readManifestProviderEndpoints(manifest));
  return entries;
}
function collectManifestProviderRequests() {
  const entries = /* @__PURE__ */ new Map();
  for (const { manifest } of listOpenClawPluginManifestMetadata())
    for (const [provider, request] of readManifestProviderRequests(manifest))
      entries.set(provider, request);
  return entries;
}
function loadManifestProviderEndpointCache() {
  if (!manifestProviderEndpointCache)
    manifestProviderEndpointCache = collectManifestProviderEndpoints();
  return manifestProviderEndpointCache;
}
function loadManifestProviderRequestCache() {
  if (!manifestProviderRequestCache)
    manifestProviderRequestCache = collectManifestProviderRequests();
  return manifestProviderRequestCache;
}
function resolveManifestProviderRequest(provider) {
  return provider ? loadManifestProviderRequestCache().get(provider) : void 0;
}
function hostMatchesSuffix(host, suffix) {
  if (!suffix) return false;
  return suffix.startsWith(".") || suffix.startsWith("-")
    ? host.endsWith(suffix)
    : host === suffix || host.endsWith(`.${suffix}`);
}
function buildManifestEndpointResolution(endpoint, host) {
  const regionSuffix = endpoint.googleVertexRegionHostSuffix;
  const googleVertexRegion =
    endpoint.googleVertexRegion ??
    (regionSuffix && host.endsWith(regionSuffix) ? host.slice(0, -regionSuffix.length) : void 0);
  return {
    endpointClass: endpoint.endpointClass,
    hostname: host,
    ...(googleVertexRegion ? { googleVertexRegion } : {}),
  };
}
function resolveManifestProviderEndpoint(params) {
  for (const endpoint of loadManifestProviderEndpointCache()) {
    if (endpoint.hosts.includes(params.host))
      return buildManifestEndpointResolution(endpoint, params.host);
    if (endpoint.hostSuffixes.some((suffix) => hostMatchesSuffix(params.host, suffix)))
      return buildManifestEndpointResolution(endpoint, params.host);
    if (params.normalizedBaseUrl && endpoint.normalizedBaseUrls.includes(params.normalizedBaseUrl))
      return buildManifestEndpointResolution(endpoint, params.host);
  }
}
function isLocalEndpointHost(host) {
  return (
    LOCAL_ENDPOINT_HOSTS.has(host) ||
    host.endsWith(".localhost") ||
    host.endsWith(".local") ||
    host.endsWith(".internal")
  );
}
function resolveProviderEndpoint(baseUrl) {
  if (typeof baseUrl !== "string" || !baseUrl.trim()) return { endpointClass: "default" };
  const host = resolveUrlHostname(baseUrl);
  if (!host) return { endpointClass: "invalid" };
  const manifestEndpoint = resolveManifestProviderEndpoint({
    host,
    normalizedBaseUrl: normalizeComparableBaseUrl(baseUrl),
  });
  if (manifestEndpoint) return manifestEndpoint;
  if (isLocalEndpointHost(host))
    return {
      endpointClass: "local",
      hostname: host,
    };
  return {
    endpointClass: "custom",
    hostname: host,
  };
}
function resolveKnownProviderFamily(provider) {
  const manifestFamily = resolveManifestProviderRequest(provider)?.family;
  if (manifestFamily) return manifestFamily;
  switch (provider) {
    case "openai":
    case "azure-openai":
    case "azure-openai-responses":
      return "openai-family";
    default:
      return provider || "unknown";
  }
}
function isOpenAIResponsesApi(api) {
  const normalizedApi = normalizeOptionalLowercaseString(api);
  return normalizedApi !== void 0 && OPENAI_RESPONSES_APIS.has(normalizedApi);
}
function isCanonicalOrLegacyOpenAIProvider(provider) {
  return provider === "openai";
}
function resolveProviderAttributionIdentity(env = process.env) {
  return {
    product: OPENCLAW_ATTRIBUTION_PRODUCT,
    version: resolveRuntimeServiceVersion(env),
  };
}
function buildOpenRouterAttributionPolicy(env = process.env) {
  const identity = resolveProviderAttributionIdentity(env);
  return {
    provider: "openrouter",
    enabledByDefault: true,
    verification: "vendor-documented",
    hook: "request-headers",
    docsUrl: "https://openrouter.ai/docs/app-attribution",
    reviewNote: "Documented app attribution headers. Verified in OpenClaw runtime wrapper.",
    ...identity,
    headers: {
      "HTTP-Referer": "https://openclaw.ai",
      "X-OpenRouter-Title": identity.product,
      "X-OpenRouter-Categories": OPENROUTER_ATTRIBUTION_CATEGORIES,
    },
  };
}
function buildNvidiaAttributionPolicy(env = process.env) {
  return {
    provider: "nvidia",
    enabledByDefault: true,
    verification: "vendor-documented",
    hook: "request-headers",
    reviewNote:
      "NVIDIA NIM billing invoke-origin attribution header. Applied only on verified NVIDIA routes.",
    ...resolveProviderAttributionIdentity(env),
    headers: { "X-BILLING-INVOKE-ORIGIN": OPENCLAW_ATTRIBUTION_PRODUCT },
  };
}
function buildGoogleAttributionPolicy(env = process.env) {
  const identity = resolveProviderAttributionIdentity(env);
  return {
    provider: "google",
    enabledByDefault: true,
    verification: "vendor-documented",
    hook: "request-headers",
    docsUrl: "https://ai.google.dev/gemini-api/docs/partner-integration",
    reviewNote:
      "Gemini API partner integration guidance requires x-goog-api-client on partner and library traffic.",
    ...identity,
    headers: { "x-goog-api-client": `${OPENCLAW_ATTRIBUTION_ORIGINATOR}/${identity.version}` },
  };
}
function buildOpenAIAttributionPolicy(env = process.env) {
  const identity = resolveProviderAttributionIdentity(env);
  return {
    provider: "openai",
    enabledByDefault: true,
    verification: "vendor-hidden-api-spec",
    hook: "request-headers",
    reviewNote:
      "OpenAI native traffic supports hidden originator/User-Agent attribution. Verified against the Codex wire contract.",
    ...identity,
    headers: {
      originator: OPENCLAW_ATTRIBUTION_ORIGINATOR,
      version: identity.version,
      "User-Agent": formatOpenClawUserAgent(identity.version),
    },
  };
}
function buildXaiAttributionPolicy(env = process.env) {
  const identity = resolveProviderAttributionIdentity(env);
  return {
    provider: "xai",
    enabledByDefault: true,
    verification: "vendor-hidden-api-spec",
    hook: "request-headers",
    reviewNote:
      "xAI api.x.ai accepts a standard openclaw User-Agent. Companion originator/version headers mirror the OpenAI attribution shape for consistency; they are not validated against an xAI-specific spec and are expected to be ignored by xAI's OpenAI-compatible surface.",
    ...identity,
    headers: {
      originator: OPENCLAW_ATTRIBUTION_ORIGINATOR,
      version: identity.version,
      "User-Agent": formatOpenClawUserAgent(identity.version),
    },
  };
}
function buildSdkHookOnlyPolicy(provider, hook, reviewNote, env = process.env) {
  return {
    provider,
    enabledByDefault: false,
    verification: "vendor-sdk-hook-only",
    hook,
    reviewNote,
    ...resolveProviderAttributionIdentity(env),
  };
}
function listProviderAttributionPolicies(env = process.env) {
  return [
    buildOpenRouterAttributionPolicy(env),
    buildNvidiaAttributionPolicy(env),
    buildGoogleAttributionPolicy(env),
    buildOpenAIAttributionPolicy(env),
    buildXaiAttributionPolicy(env),
    buildSdkHookOnlyPolicy(
      "anthropic",
      "default-headers",
      "Anthropic JS SDK exposes defaultHeaders, but app attribution is not yet verified.",
      env,
    ),
    buildSdkHookOnlyPolicy(
      "groq",
      "default-headers",
      "Groq JS SDK exposes defaultHeaders, but app attribution is not yet verified.",
      env,
    ),
    buildSdkHookOnlyPolicy(
      "mistral",
      "custom-user-agent",
      "Mistral JS SDK exposes a custom userAgent option, but app attribution is not yet verified.",
      env,
    ),
    buildSdkHookOnlyPolicy(
      "together",
      "default-headers",
      "Together JS SDK exposes defaultHeaders, but app attribution is not yet verified.",
      env,
    ),
  ];
}
function resolveProviderAttributionPolicy(provider, env = process.env) {
  const normalized = normalizeProviderId(provider ?? "");
  const canonical = normalized === "openai" ? "openai" : normalized;
  return listProviderAttributionPolicies(env).find((policy) => policy.provider === canonical);
}
function resolveProviderRequestPolicy(input, env = process.env) {
  const provider = normalizeProviderId(input.provider ?? "");
  const policy = resolveProviderAttributionPolicy(provider, env);
  const endpointClass = resolveProviderEndpoint(input.baseUrl).endpointClass;
  const usesConfiguredBaseUrl = endpointClass !== "default";
  const usesKnownNativeOpenAIEndpoint =
    endpointClass === "openai-public" ||
    endpointClass === "openai" ||
    endpointClass === "azure-openai";
  const usesVerifiedOpenAIAttributionHost =
    endpointClass === "openai-public" || endpointClass === "openai";
  const usesXaiNativeAttributionHost = endpointClass === "xai-native";
  const usesExplicitProxyLikeEndpoint = usesConfiguredBaseUrl && !usesKnownNativeOpenAIEndpoint;
  let attributionProvider;
  if (isCanonicalOrLegacyOpenAIProvider(provider) && usesVerifiedOpenAIAttributionHost)
    attributionProvider = "openai";
  else if (provider === "openrouter" && policy?.enabledByDefault) {
    if (endpointClass === "openrouter" || endpointClass === "default")
      attributionProvider = "openrouter";
  } else if (provider === "xai" && policy?.enabledByDefault) {
    if (usesXaiNativeAttributionHost || endpointClass === "default") attributionProvider = "xai";
  }
  if (!attributionProvider && endpointClass === "nvidia-native") attributionProvider = "nvidia";
  if (!attributionProvider && endpointClass === "google-generative-ai")
    attributionProvider = "google";
  const attributionPolicy = attributionProvider
    ? resolveProviderAttributionPolicy(attributionProvider, env)
    : void 0;
  const attributionHeaders = attributionPolicy?.enabledByDefault
    ? attributionPolicy.headers
    : void 0;
  return {
    provider: provider || void 0,
    policy: attributionPolicy ?? policy,
    endpointClass,
    usesConfiguredBaseUrl,
    knownProviderFamily: resolveKnownProviderFamily(provider || void 0),
    attributionProvider,
    attributionHeaders,
    allowsHiddenAttribution:
      attributionProvider !== void 0 &&
      attributionPolicy?.verification === "vendor-hidden-api-spec",
    usesKnownNativeOpenAIEndpoint,
    usesKnownNativeOpenAIRoute:
      endpointClass === "default"
        ? isCanonicalOrLegacyOpenAIProvider(provider)
        : usesKnownNativeOpenAIEndpoint,
    usesVerifiedOpenAIAttributionHost,
    usesExplicitProxyLikeEndpoint,
  };
}
function resolveProviderRequestCapabilities(input, env = process.env) {
  const policy = resolveProviderRequestPolicy(input, env);
  const provider = policy.provider;
  const api = normalizeOptionalLowercaseString(input.api);
  const endpointClass = policy.endpointClass;
  const isKnownNativeEndpoint =
    endpointClass === "anthropic-public" ||
    endpointClass === "cerebras-native" ||
    endpointClass === "chutes-native" ||
    endpointClass === "deepseek-native" ||
    endpointClass === "github-copilot-native" ||
    endpointClass === "groq-native" ||
    endpointClass === "meta-native" ||
    endpointClass === "mistral-public" ||
    endpointClass === "moonshot-native" ||
    endpointClass === "modelstudio-native" ||
    endpointClass === "nvidia-native" ||
    endpointClass === "openai-public" ||
    endpointClass === "openai" ||
    endpointClass === "opencode-native" ||
    endpointClass === "azure-openai" ||
    endpointClass === "openrouter" ||
    endpointClass === "xai-native" ||
    endpointClass === "xiaomi-native" ||
    endpointClass === "zai-native" ||
    endpointClass === "google-generative-ai" ||
    endpointClass === "google-vertex";
  const manifestProviderRequest = resolveManifestProviderRequest(provider);
  const compatibilityFamily = manifestProviderRequest?.compatibilityFamily;
  const isResponsesApi = isOpenAIResponsesApi(api);
  const promptCacheKeySupport = readCompatBoolean(input.compat, "supportsPromptCacheKey");
  const shouldStripResponsesPromptCache =
    promptCacheKeySupport === true
      ? false
      : promptCacheKeySupport === false
        ? isResponsesApi
        : isResponsesApi && policy.usesExplicitProxyLikeEndpoint;
  return {
    ...policy,
    isKnownNativeEndpoint,
    allowsOpenAIServiceTier:
      (isCanonicalOrLegacyOpenAIProvider(provider) &&
        api === "openai-responses" &&
        endpointClass === "openai-public") ||
      (isCanonicalOrLegacyOpenAIProvider(provider) &&
        (api === "openai-chatgpt-responses" || api === "openai-responses") &&
        endpointClass === "openai"),
    supportsOpenAIReasoningCompatPayload:
      provider !== void 0 &&
      api !== void 0 &&
      !policy.usesExplicitProxyLikeEndpoint &&
      (isCanonicalOrLegacyOpenAIProvider(provider) ||
        provider === "azure-openai" ||
        provider === "azure-openai-responses") &&
      (api === "openai-completions" ||
        api === "openai-responses" ||
        api === "openai-chatgpt-responses" ||
        api === "azure-openai-responses"),
    allowsAnthropicServiceTier:
      provider === "anthropic" &&
      api === "anthropic-messages" &&
      (endpointClass === "default" || endpointClass === "anthropic-public"),
    supportsResponsesStoreField:
      readCompatBoolean(input.compat, "supportsStore") !== false && isResponsesApi,
    allowsResponsesStore:
      readCompatBoolean(input.compat, "supportsStore") !== false &&
      provider !== void 0 &&
      isResponsesApi &&
      OPENAI_RESPONSES_PROVIDERS.has(provider) &&
      policy.usesKnownNativeOpenAIEndpoint,
    shouldStripResponsesPromptCache,
    supportsNativeStreamingUsageCompat:
      endpointClass === "moonshot-native" || endpointClass === "modelstudio-native",
    supportsOpenAICompletionsStreamingUsageCompat:
      manifestProviderRequest?.supportsOpenAICompletionsStreamingUsageCompat === true,
    compatibilityFamily,
  };
}
function describeProviderRequestRoutingPolicy(policy) {
  if (!policy.attributionProvider) return "none";
  switch (policy.policy?.verification) {
    case "vendor-hidden-api-spec":
      return "hidden";
    case "vendor-documented":
      return "documented";
    case "vendor-sdk-hook-only":
      return "sdk-hook-only";
    default:
      return "none";
  }
}
function describeProviderRequestRouteClass(policy) {
  if (policy.endpointClass === "default") return "default";
  if (policy.endpointClass === "invalid") return "invalid";
  if (policy.endpointClass === "local") return "local";
  if (policy.endpointClass === "custom" || policy.endpointClass === "openrouter")
    return "proxy-like";
  return "native";
}
function describeProviderRequestRoutingSummary(input, env = process.env) {
  const policy = resolveProviderRequestPolicy(input, env);
  const api = normalizeOptionalLowercaseString(input.api) ?? "unknown";
  const provider = policy.provider ?? "unknown";
  const routeClass = describeProviderRequestRouteClass(policy);
  const routingPolicy = describeProviderRequestRoutingPolicy(policy);
  return [
    `provider=${provider}`,
    `api=${api}`,
    `endpoint=${policy.endpointClass}`,
    `route=${routeClass}`,
    `policy=${routingPolicy}`,
  ].join(" ");
}
//#endregion
export {
  listOpenClawPluginManifestMetadata as a,
  resolveProviderRequestPolicy as i,
  resolveProviderEndpoint as n,
  resolveProviderRequestCapabilities as r,
  describeProviderRequestRoutingSummary as t,
};
