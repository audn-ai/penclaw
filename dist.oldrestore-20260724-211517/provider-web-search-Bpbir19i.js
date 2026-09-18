import { n as normalizeSecretInput } from "./normalize-secret-input-Df_qhWv_.js";
import "./enable-DK_lFguo.js";
import {
  g as resolveSecretInputRef,
  p as normalizeSecretInputString,
} from "./types.secrets-BV0ywRAy.js";
import "./common-DyDSUect.js";
import "./external-content-rRQGoatE.js";
import "./web-fetch-utils-Pr5OiX35.js";
import "./web-shared-C-2hVbyp.js";
import "./web-search-provider-common-B8EoIruV.js";
import { r as withStrictWebToolsEndpoint } from "./web-guarded-fetch-Clw9u5_V.js";
//#region src/agents/tools/web-search-citation-redirect.ts
/**
 * Citation redirect resolver for web search results.
 *
 * Follows provider citation redirect URLs through the strict web-tools network guard.
 */
const REDIRECT_TIMEOUT_MS = 5e3;
/**
 * Resolve a citation redirect URL to its final destination using a HEAD request.
 * Returns the original URL if resolution fails or times out.
 */
async function resolveCitationRedirectUrl(url) {
  try {
    return await withStrictWebToolsEndpoint(
      {
        url,
        init: { method: "HEAD" },
        timeoutMs: REDIRECT_TIMEOUT_MS,
      },
      async ({ finalUrl }) => finalUrl || url,
    );
  } catch {
    return url;
  }
}
//#endregion
//#region src/agents/tools/web-search-provider-credentials.ts
/**
 * Web-search provider credential resolver.
 *
 * Reads config values, env-backed secret refs, and provider-specific environment variables.
 */
/**
 * Resolves web-search provider credentials from config values, secret refs, or
 * provider-specific environment variables.
 */
/** Returns the first usable credential for a web-search provider. */
function resolveWebSearchProviderCredential(params) {
  const fromConfig = normalizeSecretInput(normalizeSecretInputString(params.credentialValue));
  if (fromConfig) return fromConfig;
  const credentialRef = resolveSecretInputRef({ value: params.credentialValue }).ref;
  if (credentialRef) {
    if (credentialRef.source !== "env") return;
    const fromEnvRef = normalizeSecretInput(process.env[credentialRef.id]);
    if (fromEnvRef) return fromEnvRef;
    return;
  }
  for (const envVar of params.envVars) {
    const fromEnv = normalizeSecretInput(process.env[envVar]);
    if (fromEnv) return fromEnv;
  }
}
//#endregion
//#region src/plugin-sdk/provider-web-search.ts
/**
 * @deprecated Implement provider-owned `createTool(...)` directly on the
 * returned WebSearchProviderPlugin instead of routing through core.
 */
function createPluginBackedWebSearchProvider(provider) {
  return {
    ...provider,
    createTool: () => {
      throw new Error(
        `createPluginBackedWebSearchProvider(${provider.id}) is no longer supported. Define provider-owned createTool(...) directly in the extension's WebSearchProviderPlugin.`,
      );
    },
  };
}
//#endregion
export {
  resolveWebSearchProviderCredential as n,
  resolveCitationRedirectUrl as r,
  createPluginBackedWebSearchProvider as t,
};
