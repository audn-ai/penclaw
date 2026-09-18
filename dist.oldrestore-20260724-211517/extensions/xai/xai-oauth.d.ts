import {
  ht as ProviderAuthMethod,
  pt as ProviderAuthContext,
} from "../../plugin-entry-DPCR66aO.js";
import { c as OAuthCredential } from "../../types-Dzb4Vh4b.js";
import { Ot as ProviderAuthResult } from "../../types-Ga3mNO_F.js";
//#region extensions/xai/xai-oauth.d.ts
declare const XAI_OAUTH_CLIENT_ID = "b1a00492-073a-47ea-816f-4c329264a828";
declare const XAI_OAUTH_SCOPE = "openid profile email offline_access grok-cli:access api:access";
declare const XAI_OAUTH_DISCOVERY_URL = "https://auth.x.ai/.well-known/openid-configuration";
type XaiOAuthDiscovery = {
  tokenEndpoint: string;
};
type XaiOAuthFetchOptions = {
  fetchImpl?: typeof fetch;
  now?: () => number;
  signal?: AbortSignal;
};
declare function isTrustedXaiOAuthEndpoint(endpoint: string): boolean;
declare function fetchXaiOAuthDiscovery(options?: XaiOAuthFetchOptions): Promise<XaiOAuthDiscovery>;
declare function loginXaiDeviceCode(ctx: ProviderAuthContext): Promise<ProviderAuthResult>;
declare function refreshXaiOAuthCredential(
  credential: OAuthCredential,
  options?: XaiOAuthFetchOptions,
): Promise<OAuthCredential>;
declare function createXaiOAuthAuthMethod(): ProviderAuthMethod;
declare function createXaiDeviceCodeAuthMethod(): ProviderAuthMethod;
//#endregion
export {
  XAI_OAUTH_CLIENT_ID,
  XAI_OAUTH_DISCOVERY_URL,
  XAI_OAUTH_SCOPE,
  createXaiDeviceCodeAuthMethod,
  createXaiOAuthAuthMethod,
  fetchXaiOAuthDiscovery,
  isTrustedXaiOAuthEndpoint,
  loginXaiDeviceCode,
  refreshXaiOAuthCredential,
};
