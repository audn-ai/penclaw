import {
  Tt as ProviderDefaultThinkingPolicyContext,
  en as ProviderThinkingProfile,
} from "./plugin-entry-DPCR66aO.js";
import { f as ModelProviderConfig } from "./types.models-BqJSiNyu.js";
//#region extensions/google/src/google-api-base-url.d.ts
declare const DEFAULT_GOOGLE_API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
declare function isGoogleVertexHostname(hostname: string): boolean;
declare function isGoogleVertexBaseUrl(baseUrl?: string | null): boolean;
declare function normalizeGoogleApiBaseUrl(baseUrl?: string): string;
declare function isGoogleGenerativeAiApi(api?: string | null): boolean;
declare function normalizeGoogleGenerativeAiBaseUrl(baseUrl?: string): string | undefined;
//#endregion
//#region extensions/google/provider-policy.d.ts
type GoogleApiCarrier = {
  api?: string | null;
};
type GoogleProviderConfigLike = GoogleApiCarrier & {
  baseUrl?: string | null;
  models?: ReadonlyArray<GoogleApiCarrier | null | undefined> | null;
};
declare function resolveGoogleGenerativeAiTransport<
  TApi extends string | null | undefined,
>(params: {
  provider?: string;
  api: TApi;
  baseUrl?: string;
}): {
  api: TApi | "google-generative-ai" | "google-vertex";
  baseUrl?: string;
};
declare function resolveGoogleGenerativeAiApiOrigin(baseUrl?: string): string;
declare function shouldNormalizeGoogleGenerativeAiProviderConfig(
  providerKey: string,
  provider: GoogleProviderConfigLike,
): boolean;
declare function shouldNormalizeGoogleProviderConfig(
  providerKey: string,
  provider: GoogleProviderConfigLike,
): boolean;
declare function normalizeGoogleProviderConfig(
  providerKey: string,
  provider: ModelProviderConfig,
): ModelProviderConfig;
declare function resolveGoogleThinkingProfile({
  modelId,
  reasoning,
}: ProviderDefaultThinkingPolicyContext): ProviderThinkingProfile | undefined;
//#endregion
export {
  shouldNormalizeGoogleGenerativeAiProviderConfig as a,
  isGoogleGenerativeAiApi as c,
  normalizeGoogleApiBaseUrl as d,
  normalizeGoogleGenerativeAiBaseUrl as f,
  resolveGoogleThinkingProfile as i,
  isGoogleVertexBaseUrl as l,
  resolveGoogleGenerativeAiApiOrigin as n,
  shouldNormalizeGoogleProviderConfig as o,
  resolveGoogleGenerativeAiTransport as r,
  DEFAULT_GOOGLE_API_BASE_URL as s,
  normalizeGoogleProviderConfig as t,
  isGoogleVertexHostname as u,
};
