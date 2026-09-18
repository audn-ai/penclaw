import { a as getAccessTokenResultAsync } from "./cli-tnciAn7X.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import {
  C as resolveExpiresAtMsFromDurationMs,
  S as resolveDateTimestampMs,
  o as asDateTimestampMs,
} from "./number-coercion-CJQ8TR--.js";
import {
  _ as isFoundryProviderApi,
  a as FOUNDRY_ANTHROPIC_SCOPE,
  d as buildFoundryProviderBaseUrl,
  f as extractFoundryEndpoint,
  w as resolveConfiguredModelNameHint,
} from "./shared-Cky42rCK.js";
import "./error-runtime-BIAwr399.js";
import "./number-runtime-B-n-wjMn.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./provider-auth-mypr64nh.js";
import { t as getFoundryTokenCacheKey } from "./shared-runtime-COG8Dv3f.js";
import { i as ensureAuthProfileStore } from "./store-B7DoDdVM.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region extensions/microsoft-foundry/runtime.ts
const cachedTokens = /* @__PURE__ */ new Map();
const refreshPromises = /* @__PURE__ */ new Map();
const FOUNDRY_TOKEN_FALLBACK_LIFETIME_MS = 3300 * 1e3;
function resetFoundryRuntimeAuthCaches() {
  cachedTokens.clear();
  refreshPromises.clear();
}
async function refreshEntraToken(params) {
  const result = await getAccessTokenResultAsync(params);
  const rawExpiry = result.expiresOn ? new Date(result.expiresOn).getTime() : NaN;
  const now = resolveDateTimestampMs(Date.now());
  const expiresAt =
    asDateTimestampMs(rawExpiry) ??
    resolveExpiresAtMsFromDurationMs(FOUNDRY_TOKEN_FALLBACK_LIFETIME_MS, { nowMs: now }) ??
    now;
  cachedTokens.set(getFoundryTokenCacheKey(params), {
    token: result.accessToken,
    expiresAt,
  });
  return {
    apiKey: result.accessToken,
    expiresAt,
  };
}
async function prepareFoundryRuntimeAuth(ctx) {
  if (ctx.apiKey !== "__entra_id_dynamic__")
    return {
      apiKey: ctx.apiKey,
      request: {
        auth: {
          mode: "header",
          headerName: ctx.model.api === "anthropic-messages" ? "x-api-key" : "api-key",
          value: ctx.apiKey,
        },
      },
    };
  try {
    const authStore = ensureAuthProfileStore(ctx.agentDir, { allowKeychainPrompt: false });
    const credential = ctx.profileId ? authStore.profiles[ctx.profileId] : void 0;
    const metadata = credential?.type === "api_key" ? credential.metadata : void 0;
    const modelId =
      normalizeOptionalString(ctx.modelId) ??
      normalizeOptionalString(metadata?.modelId) ??
      ctx.modelId;
    const requestedModelId = normalizeOptionalString(ctx.modelId);
    const metadataModelId = normalizeOptionalString(metadata?.modelId);
    const activeModelUsesMetadata = !requestedModelId || requestedModelId === metadataModelId;
    const activeModelNameHint = activeModelUsesMetadata ? metadata?.modelName : void 0;
    const modelNameHint = resolveConfiguredModelNameHint(
      modelId,
      ctx.model.name ?? activeModelNameHint,
    );
    const configuredApi = isFoundryProviderApi(ctx.model.api)
      ? ctx.model.api
      : activeModelUsesMetadata &&
          typeof metadata?.api === "string" &&
          isFoundryProviderApi(metadata.api)
        ? metadata.api
        : void 0;
    const endpoint =
      extractFoundryEndpoint(ctx.model.baseUrl ?? "") ??
      normalizeOptionalString(metadata?.endpoint);
    const tokenScope = configuredApi === "anthropic-messages" ? FOUNDRY_ANTHROPIC_SCOPE : void 0;
    const baseUrl = endpoint
      ? buildFoundryProviderBaseUrl(endpoint, modelId, modelNameHint, configuredApi)
      : void 0;
    const cacheKey = getFoundryTokenCacheKey({
      scope: tokenScope,
      subscriptionId: metadata?.subscriptionId,
      tenantId: metadata?.tenantId,
    });
    const cachedToken = cachedTokens.get(cacheKey);
    const rawNow = Date.now();
    const hasValidClock = asDateTimestampMs(rawNow) !== void 0;
    const now = resolveDateTimestampMs(rawNow);
    const refreshAfterMs = resolveExpiresAtMsFromDurationMs(3e5, { nowMs: now }) ?? now;
    if (cachedToken && hasValidClock && cachedToken.expiresAt > refreshAfterMs)
      return {
        apiKey: cachedToken.token,
        expiresAt: cachedToken.expiresAt,
        ...(baseUrl ? { baseUrl } : {}),
        request: {
          auth: {
            mode: "authorization-bearer",
            token: cachedToken.token,
          },
        },
      };
    let refreshPromise = refreshPromises.get(cacheKey);
    if (!refreshPromise) {
      refreshPromise = refreshEntraToken({
        scope: tokenScope,
        subscriptionId: metadata?.subscriptionId,
        tenantId: metadata?.tenantId,
      }).finally(() => {
        refreshPromises.delete(cacheKey);
      });
      refreshPromises.set(cacheKey, refreshPromise);
    }
    const token = await refreshPromise;
    return {
      ...token,
      ...(baseUrl ? { baseUrl } : {}),
      request: {
        auth: {
          mode: "authorization-bearer",
          token: token.apiKey,
        },
      },
    };
  } catch (err) {
    const details = formatErrorMessage(err);
    throw new Error(`Failed to refresh Azure Entra ID token via az CLI: ${details}`, {
      cause: err,
    });
  }
}
//#endregion
export { resetFoundryRuntimeAuthCaches as n, prepareFoundryRuntimeAuth as t };
