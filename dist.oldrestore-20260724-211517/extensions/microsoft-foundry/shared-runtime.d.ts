import {
  M as resolveConfiguredModelNameHint,
  T as isFoundryProviderApi,
  b as extractFoundryEndpoint,
  h as TOKEN_REFRESH_MARGIN_MS,
  s as CachedTokenEntry,
  t as ANTHROPIC_MESSAGES_API,
  u as FOUNDRY_ANTHROPIC_SCOPE,
  y as buildFoundryProviderBaseUrl,
} from "../../shared-CIt6cRoQ.js";

//#region extensions/microsoft-foundry/shared-runtime.d.ts
declare function getFoundryTokenCacheKey(params?: {
  scope?: string;
  subscriptionId?: string;
  tenantId?: string;
}): string;
//#endregion
export {
  ANTHROPIC_MESSAGES_API,
  type CachedTokenEntry,
  FOUNDRY_ANTHROPIC_SCOPE,
  TOKEN_REFRESH_MARGIN_MS,
  buildFoundryProviderBaseUrl,
  extractFoundryEndpoint,
  getFoundryTokenCacheKey,
  isFoundryProviderApi,
  resolveConfiguredModelNameHint,
};
