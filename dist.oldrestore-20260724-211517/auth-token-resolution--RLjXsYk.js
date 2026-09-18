import { a as trimToUndefined } from "./credential-planner-BTC1pLMc.js";
import { t as resolveConfiguredSecretInputString } from "./resolve-configured-secret-input-string-BylZzfX0.js";
import "./credentials-DqHTozxM.js";
import { g as resolveSecretInputRef } from "./types.secrets-BV0ywRAy.js";
//#region src/gateway/auth-token-resolution.ts
/** Resolves gateway.auth.token with configurable env fallback and SecretRef diagnostics. */
async function resolveGatewayAuthToken(params) {
  const explicitToken = trimToUndefined(params.explicitToken);
  if (explicitToken)
    return {
      token: explicitToken,
      source: "explicit",
      secretRefConfigured: false,
    };
  const tokenInput = params.cfg.gateway?.auth?.token;
  const tokenRef = resolveSecretInputRef({
    value: tokenInput,
    defaults: params.cfg.secrets?.defaults,
  }).ref;
  const envFallback = params.envFallback ?? "always";
  const envToken = trimToUndefined(params.env.OPENCLAW_GATEWAY_TOKEN);
  if (!tokenRef) {
    const configToken = trimToUndefined(tokenInput);
    if (configToken)
      return {
        token: configToken,
        source: "config",
        secretRefConfigured: false,
      };
    if (envFallback !== "never" && envToken)
      return {
        token: envToken,
        source: "env",
        secretRefConfigured: false,
      };
    return { secretRefConfigured: false };
  }
  const resolved = await resolveConfiguredSecretInputString({
    config: params.cfg,
    env: params.env,
    value: tokenInput,
    path: "gateway.auth.token",
    unresolvedReasonStyle: params.unresolvedReasonStyle,
  });
  if (resolved.value)
    return {
      token: resolved.value,
      source: "secretRef",
      secretRefConfigured: true,
    };
  if (envFallback === "always" && envToken)
    return {
      token: envToken,
      source: "env",
      secretRefConfigured: true,
    };
  return {
    secretRefConfigured: true,
    unresolvedRefReason: resolved.unresolvedRefReason,
  };
}
//#endregion
export { resolveGatewayAuthToken as t };
