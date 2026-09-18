import crypto from "node:crypto";
import {
  a as resolveGatewayTokenSecretRefValue,
  i as resolveGatewayPasswordSecretRefValue,
  n as hasConfiguredGatewayAuthSecretInput,
} from "./auth-config-utils-CD1fFT1Z.js";
import { t as assertExplicitGatewayAuthModeWhenBothConfigured } from "./auth-mode-policy-DKWQE9Br.js";
import "./credentials-DqHTozxM.js";
import "./auth-D-Aebsmj.js";
import { n as resolveGatewayAuth } from "./auth-resolve-PY0Y7GYi.js";
import {
  a as trimToUndefined,
  n as hasGatewayPasswordEnvCandidate,
  r as hasGatewayTokenEnvCandidate,
} from "./credential-planner-BTC1pLMc.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region src/gateway/known-weak-gateway-secrets.ts
const KNOWN_WEAK_GATEWAY_TOKEN_PLACEHOLDERS = ["change-me-to-a-long-random-token", "change-me-now"];
const KNOWN_WEAK_GATEWAY_PASSWORD_PLACEHOLDERS = ["change-me-to-a-strong-password"];
/**
 * Placeholder credentials that have ever shipped in `.env.example` or been
 * used as copy-paste examples in onboarding docs. If any of these ever
 * becomes the resolved gateway credential, reject it. The operator almost
 * certainly copied an example file verbatim without replacing the sentinel,
 * which would otherwise leave the gateway protected by a publicly-known
 * credential.
 */
const KNOWN_WEAK_GATEWAY_TOKENS = new Set(KNOWN_WEAK_GATEWAY_TOKEN_PLACEHOLDERS);
const KNOWN_WEAK_GATEWAY_PASSWORDS = new Set(KNOWN_WEAK_GATEWAY_PASSWORD_PLACEHOLDERS);
function assertGatewayAuthNotKnownWeak(auth) {
  if (auth.mode === "token") {
    const token = auth.token?.trim() ?? "";
    if (token && KNOWN_WEAK_GATEWAY_TOKENS.has(token))
      throw new Error(
        "Invalid config: gateway auth token is set to a published example placeholder from docs or .env.example. Generate a real secret (e.g. `openssl rand -hex 32`) and set OPENCLAW_GATEWAY_TOKEN or gateway.auth.token before starting the gateway.",
      );
    return;
  }
  if (auth.mode === "password") {
    const password = auth.password?.trim() ?? "";
    if (password && KNOWN_WEAK_GATEWAY_PASSWORDS.has(password))
      throw new Error(
        "Invalid config: gateway auth password is set to the example placeholder from .env.example. Choose a real password and set OPENCLAW_GATEWAY_PASSWORD or gateway.auth.password before starting the gateway.",
      );
  }
}
//#endregion
//#region src/gateway/startup-auth.ts
const HOOKS_GATEWAY_AUTH_REUSE_WARNING =
  "Security warning: hooks.token matches active Gateway shared-secret auth. Startup continues for compatibility; rotate hooks.token or Gateway auth. Run openclaw security audit for a full report, and run openclaw doctor --fix when the reused hooks.token is persisted in config.";
/** Merge sparse runtime auth overrides into persisted Gateway auth config. */
function mergeGatewayAuthConfig(base, override) {
  const merged = { ...base };
  if (!override) return merged;
  if (override.mode !== void 0) merged.mode = override.mode;
  if (override.token !== void 0) merged.token = override.token;
  if (override.password !== void 0) merged.password = override.password;
  if (override.allowTailscale !== void 0) merged.allowTailscale = override.allowTailscale;
  if (override.rateLimit !== void 0) merged.rateLimit = override.rateLimit;
  if (override.trustedProxy !== void 0) merged.trustedProxy = override.trustedProxy;
  return merged;
}
/** Merge sparse runtime Tailscale overrides into persisted Gateway Tailscale config. */
function mergeGatewayTailscaleConfig(base, override) {
  const merged = { ...base };
  if (!override) return merged;
  if (override.mode !== void 0) merged.mode = override.mode;
  if (override.resetOnExit !== void 0) merged.resetOnExit = override.resetOnExit;
  if (override.serviceName !== void 0) merged.serviceName = override.serviceName;
  if (override.preserveFunnel !== void 0) merged.preserveFunnel = override.preserveFunnel;
  return merged;
}
function resolveGatewayAuthFromConfig(params) {
  const tailscaleConfig = mergeGatewayTailscaleConfig(
    params.cfg.gateway?.tailscale,
    params.tailscaleOverride,
  );
  return resolveGatewayAuth({
    authConfig: params.cfg.gateway?.auth,
    authOverride: params.authOverride,
    env: params.env,
    tailscaleMode: tailscaleConfig.mode ?? "off",
  });
}
function findActiveGatewaySharedSecret(auth) {
  if (auth.mode === "token") return normalizeOptionalString(auth.token) ?? "";
  if (auth.mode === "password" || auth.mode === "trusted-proxy")
    return normalizeOptionalString(auth.password) ?? "";
  return "";
}
function warnHooksTokenReuseGatewayAuth(params) {
  if (params.cfg.hooks?.enabled !== true || !params.warn) return;
  const hooksToken = normalizeOptionalString(params.cfg.hooks.token) ?? "";
  if (!hooksToken || hooksToken !== findActiveGatewaySharedSecret(params.auth)) return;
  params.warn(HOOKS_GATEWAY_AUTH_REUSE_WARNING);
}
/** Check every source that can satisfy token auth before startup generates one. */
function hasGatewayTokenCandidate(params) {
  if (trimToUndefined(params.env.OPENCLAW_GATEWAY_TOKEN)) return true;
  if (typeof params.authOverride?.token === "string" && params.authOverride.token.trim().length > 0)
    return true;
  return hasConfiguredGatewayAuthSecretInput(params.cfg, "gateway.auth.token");
}
function hasGatewayTokenOverrideCandidate(params) {
  return (
    typeof params.authOverride?.token === "string" && params.authOverride.token.trim().length > 0
  );
}
function hasGatewayPasswordOverrideCandidate(params) {
  if (hasGatewayPasswordEnvCandidate(params.env)) return true;
  return (
    typeof params.authOverride?.password === "string" &&
    params.authOverride.password.trim().length > 0
  );
}
/** Ensure startup has effective Gateway auth, generating only an ephemeral token if needed. */
async function ensureGatewayStartupAuth(params) {
  assertExplicitGatewayAuthModeWhenBothConfigured(params.cfg);
  const env = params.env ?? process.env;
  const explicitMode = params.authOverride?.mode ?? params.cfg.gateway?.auth?.mode;
  const [resolvedTokenRefValue, resolvedPasswordRefValue] = await Promise.all([
    resolveGatewayTokenSecretRefValue({
      cfg: params.cfg,
      env,
      mode: explicitMode,
      hasTokenCandidate:
        hasGatewayTokenOverrideCandidate({ authOverride: params.authOverride }) ||
        hasGatewayTokenEnvCandidate(env),
      hasPasswordCandidate:
        hasGatewayPasswordOverrideCandidate({
          env,
          authOverride: params.authOverride,
        }) || hasConfiguredGatewayAuthSecretInput(params.cfg, "gateway.auth.password"),
    }),
    resolveGatewayPasswordSecretRefValue({
      cfg: params.cfg,
      env,
      mode: explicitMode,
      hasPasswordCandidate: hasGatewayPasswordOverrideCandidate({
        env,
        authOverride: params.authOverride,
      }),
      hasTokenCandidate: hasGatewayTokenCandidate({
        cfg: params.cfg,
        env,
        authOverride: params.authOverride,
      }),
    }),
  ]);
  const authOverride =
    params.authOverride || resolvedTokenRefValue || resolvedPasswordRefValue
      ? {
          ...params.authOverride,
          ...(resolvedTokenRefValue ? { token: resolvedTokenRefValue } : {}),
          ...(resolvedPasswordRefValue ? { password: resolvedPasswordRefValue } : {}),
        }
      : void 0;
  const resolved = resolveGatewayAuthFromConfig({
    cfg: params.cfg,
    env,
    authOverride,
    tailscaleOverride: params.tailscaleOverride,
  });
  if (resolved.mode !== "token" || (resolved.token?.trim().length ?? 0) > 0) {
    assertGatewayAuthNotKnownWeak(resolved);
    warnHooksTokenReuseGatewayAuth({
      cfg: params.cfg,
      auth: resolved,
      warn: params.warn,
    });
    return {
      cfg: params.cfg,
      auth: resolved,
      persistedGeneratedToken: false,
    };
  }
  const generatedToken = crypto.randomBytes(24).toString("hex");
  const nextCfg = {
    ...params.cfg,
    gateway: {
      ...params.cfg.gateway,
      auth: {
        ...params.cfg.gateway?.auth,
        mode: "token",
        token: generatedToken,
      },
    },
  };
  const nextAuth = resolveGatewayAuthFromConfig({
    cfg: nextCfg,
    env,
    authOverride: params.authOverride,
    tailscaleOverride: params.tailscaleOverride,
  });
  assertGatewayAuthNotKnownWeak(nextAuth);
  warnHooksTokenReuseGatewayAuth({
    cfg: nextCfg,
    auth: nextAuth,
    warn: params.warn,
  });
  return {
    cfg: nextCfg,
    auth: nextAuth,
    generatedToken,
    persistedGeneratedToken: false,
  };
}
//#endregion
export {
  assertGatewayAuthNotKnownWeak as i,
  mergeGatewayAuthConfig as n,
  mergeGatewayTailscaleConfig as r,
  ensureGatewayStartupAuth as t,
};
