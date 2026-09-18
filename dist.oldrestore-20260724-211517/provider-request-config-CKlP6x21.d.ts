import { n as Api } from "./types-CqrbBnUB.js";
import { s as ModelDefinitionConfig } from "./types.models-BqJSiNyu.js";
import { t as ConfiguredModelProviderRequest } from "./types.provider-request-CVFNhEKy.js";
import { n as RuntimeVersionEnv } from "./version-C1kCd9e0.js";

//#region src/agents/provider-attribution.d.ts
type ProviderAttributionVerification =
  | "vendor-documented"
  | "vendor-hidden-api-spec"
  | "vendor-sdk-hook-only"
  | "internal-runtime";
type ProviderAttributionHook =
  | "request-headers"
  | "default-headers"
  | "user-agent-extra"
  | "custom-user-agent";
/** Product attribution policy emitted for verified provider hooks. */
type ProviderAttributionPolicy = {
  provider: string;
  enabledByDefault: boolean;
  verification: ProviderAttributionVerification;
  hook?: ProviderAttributionHook;
  docsUrl?: string;
  reviewNote?: string;
  product: string;
  version: string;
  headers?: Record<string, string>;
};
/** Transport family used when resolving provider-specific request policy. */
type ProviderRequestTransport = "stream" | "websocket" | "http" | "media-understanding";
/** Capability family used when endpoint rules differ by media or LLM request type. */
type ProviderRequestCapability = "llm" | "audio" | "image" | "video" | "other";
/** Normalized endpoint class used by provider policy and SSRF/attribution decisions. */
type ProviderEndpointClass =
  | "default"
  | "anthropic-public"
  | "cerebras-native"
  | "chutes-native"
  | "deepseek-native"
  | "github-copilot-native"
  | "groq-native"
  | "meta-native"
  | "mistral-public"
  | "moonshot-native"
  | "modelstudio-native"
  | "nvidia-native"
  | "openai-public"
  | "openai"
  | "opencode-native"
  | "azure-openai"
  | "openrouter"
  | "xai-native"
  | "xiaomi-native"
  | "zai-native"
  | "google-generative-ai"
  | "google-vertex"
  | "local"
  | "custom"
  | "invalid";
/** Parsed endpoint facts derived from provider id and base URL. */
type ProviderEndpointResolution = {
  endpointClass: ProviderEndpointClass;
  hostname?: string;
  googleVertexRegion?: string;
};
/** Raw model/provider fields accepted by policy resolution. */
type ProviderRequestPolicyInput = {
  provider?: string | null;
  api?: string | null;
  baseUrl?: string | null;
  transport?: ProviderRequestTransport;
  capability?: ProviderRequestCapability;
};
/** Provider policy facts consumed by transports before constructing a request. */
type ProviderRequestPolicyResolution = {
  provider?: string;
  policy?: ProviderAttributionPolicy;
  endpointClass: ProviderEndpointClass;
  usesConfiguredBaseUrl: boolean;
  knownProviderFamily: string;
  attributionProvider?: string;
  attributionHeaders?: Record<string, string>;
  allowsHiddenAttribution: boolean;
  usesKnownNativeOpenAIEndpoint: boolean;
  usesKnownNativeOpenAIRoute: boolean;
  usesVerifiedOpenAIAttributionHost: boolean;
  usesExplicitProxyLikeEndpoint: boolean;
};
/** Policy input plus model compatibility fields for feature-level capability resolution. */
type ProviderRequestCapabilitiesInput = ProviderRequestPolicyInput & {
  modelId?: string | null;
  compat?: unknown;
};
/** Known compatibility family that needs provider-specific request adjustments. */
type ProviderRequestCompatibilityFamily = "moonshot";
/** Feature capability facts for one resolved provider/model request route. */
type ProviderRequestCapabilities = ProviderRequestPolicyResolution & {
  isKnownNativeEndpoint: boolean;
  allowsOpenAIServiceTier: boolean;
  supportsOpenAIReasoningCompatPayload: boolean;
  allowsAnthropicServiceTier: boolean;
  supportsResponsesStoreField: boolean;
  allowsResponsesStore: boolean;
  shouldStripResponsesPromptCache: boolean;
  supportsNativeStreamingUsageCompat: boolean;
  supportsOpenAICompletionsStreamingUsageCompat: boolean;
  compatibilityFamily?: ProviderRequestCompatibilityFamily;
};
declare function resolveProviderEndpoint(
  baseUrl: string | null | undefined,
): ProviderEndpointResolution;
declare function resolveProviderRequestPolicy(
  input: ProviderRequestPolicyInput,
  env?: RuntimeVersionEnv,
): ProviderRequestPolicyResolution;
declare function resolveProviderRequestCapabilities(
  input: ProviderRequestCapabilitiesInput,
  env?: RuntimeVersionEnv,
): ProviderRequestCapabilities;
//#endregion
//#region src/agents/provider-request-config.d.ts
type RequestApi = Api | ModelDefinitionConfig["api"];
/** Auth override accepted from sanitized provider/model request config. */
type ProviderRequestAuthOverride =
  | {
      mode: "provider-default";
    }
  | {
      mode: "authorization-bearer";
      token: string;
    }
  | {
      mode: "header";
      headerName: string;
      value: string;
      prefix?: string;
    };
/** TLS override accepted from sanitized provider/model request config. */
type ProviderRequestTlsOverride = {
  ca?: string;
  cert?: string;
  key?: string;
  passphrase?: string;
  serverName?: string;
  insecureSkipVerify?: boolean;
};
/** Proxy override accepted from sanitized provider/model request config. */
type ProviderRequestProxyOverride =
  | {
      mode: "env-proxy";
      tls?: ProviderRequestTlsOverride;
    }
  | {
      mode: "explicit-proxy";
      url: string;
      tls?: ProviderRequestTlsOverride;
    };
/** Transport override block shared by provider and model request config. */
type ProviderRequestTransportOverrides = {
  headers?: Record<string, string>;
  auth?: ProviderRequestAuthOverride;
  proxy?: ProviderRequestProxyOverride;
  tls?: ProviderRequestTlsOverride;
};
/** Model-scoped transport overrides, including private-network policy. */
type ModelProviderRequestTransportOverrides = ProviderRequestTransportOverrides & {
  allowPrivateNetwork?: boolean;
};
type ResolvedProviderRequestAuthConfig =
  | {
      configured: false;
      mode: "provider-default" | "authorization-bearer";
      injectAuthorizationHeader: boolean;
    }
  | {
      configured: true;
      mode: "authorization-bearer";
      headerName: "Authorization";
      value: string;
      injectAuthorizationHeader: true;
    }
  | {
      configured: true;
      mode: "header";
      headerName: string;
      value: string;
      prefix?: string;
      injectAuthorizationHeader: false;
    };
type ResolvedProviderRequestProxyConfig =
  | {
      configured: false;
    }
  | {
      configured: true;
      mode: "env-proxy";
      tls: ResolvedProviderRequestTlsConfig;
    }
  | {
      configured: true;
      mode: "explicit-proxy";
      proxyUrl: string;
      tls: ResolvedProviderRequestTlsConfig;
    };
type ResolvedProviderRequestTlsConfig =
  | {
      configured: false;
    }
  | {
      configured: true;
      ca?: string;
      cert?: string;
      key?: string;
      passphrase?: string;
      serverName?: string;
      rejectUnauthorized?: boolean;
    };
type ResolvedProviderRequestExtraHeadersConfig = {
  configured: boolean;
  headers?: Record<string, string>;
};
type ResolvedProviderRequestConfig = {
  api?: RequestApi;
  baseUrl?: string;
  headers?: Record<string, string>;
  extraHeaders: ResolvedProviderRequestExtraHeadersConfig;
  auth: ResolvedProviderRequestAuthConfig;
  proxy: ResolvedProviderRequestProxyConfig;
  tls: ResolvedProviderRequestTlsConfig;
  policy: ProviderRequestPolicyResolution;
};
type ProviderRequestHeaderPrecedence = "caller-wins" | "defaults-win";
/** Sanitizes model-level request overrides after secret resolution. */
declare function sanitizeConfiguredModelProviderRequest(
  request: ConfiguredModelProviderRequest | undefined,
): ModelProviderRequestTransportOverrides | undefined;
/** Normalizes provider base URLs by trimming trailing slashes. */
declare function normalizeBaseUrl(baseUrl: string | undefined, fallback: string): string;
declare function normalizeBaseUrl(
  baseUrl: string | undefined,
  fallback?: string,
): string | undefined;
/** Resolves final headers for one provider request route. */
declare function resolveProviderRequestHeaders(params: {
  provider: string;
  api?: RequestApi;
  baseUrl?: string;
  capability?: ProviderRequestCapability;
  transport?: ProviderRequestTransport;
  callerHeaders?: Record<string, string>;
  defaultHeaders?: Record<string, string>;
  precedence?: ProviderRequestHeaderPrecedence;
  request?: ProviderRequestTransportOverrides;
}): Record<string, string> | undefined;
/** Attaches model-scoped provider request transport metadata without mutating the model. */
declare function attachModelProviderRequestTransport<TModel extends object>(
  model: TModel,
  request: ModelProviderRequestTransportOverrides | undefined,
): TModel;
/** Reads provider request transport metadata attached to a model definition. */
declare function getModelProviderRequestTransport(
  model: object,
): ModelProviderRequestTransportOverrides | undefined;
//#endregion
export {
  resolveProviderRequestCapabilities as C,
  resolveProviderEndpoint as S,
  ProviderRequestCapability as _,
  ProviderRequestTransportOverrides as a,
  ProviderRequestPolicyResolution as b,
  getModelProviderRequestTransport as c,
  sanitizeConfiguredModelProviderRequest as d,
  ProviderAttributionPolicy as f,
  ProviderRequestCapabilitiesInput as g,
  ProviderRequestCapabilities as h,
  ProviderRequestTlsOverride as i,
  normalizeBaseUrl as l,
  ProviderEndpointResolution as m,
  ProviderRequestAuthOverride as n,
  ResolvedProviderRequestConfig as o,
  ProviderEndpointClass as p,
  ProviderRequestProxyOverride as r,
  attachModelProviderRequestTransport as s,
  ModelProviderRequestTransportOverrides as t,
  resolveProviderRequestHeaders as u,
  ProviderRequestCompatibilityFamily as v,
  resolveProviderRequestPolicy as w,
  ProviderRequestTransport as x,
  ProviderRequestPolicyInput as y,
};
