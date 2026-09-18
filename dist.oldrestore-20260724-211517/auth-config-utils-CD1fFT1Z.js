import { r as resolveRequiredConfiguredSecretRefInputString } from "./resolve-configured-secret-input-string-BylZzfX0.js";
import {
  a as readGatewaySecretInputValue,
  n as assignResolvedGatewaySecretInput,
} from "./secret-input-paths-BqHb6OmN.js";
import {
  c as hasConfiguredSecretInput,
  g as resolveSecretInputRef,
} from "./types.secrets-BV0ywRAy.js";
//#region src/gateway/auth-config-utils.ts
/** Check whether a local Gateway auth input is configured directly or through defaults. */
function hasConfiguredGatewayAuthSecretInput(cfg, path) {
  return hasConfiguredSecretInput(readGatewaySecretInputValue(cfg, path), cfg.secrets?.defaults);
}
/** Decide whether a token/password secret ref can be active for the configured auth mode. */
function shouldResolveGatewayAuthSecretRef(params) {
  const isTokenPath = params.path === "gateway.auth.token";
  if (isTokenPath ? params.hasTokenCandidate : params.hasPasswordCandidate) return false;
  if (params.mode === (isTokenPath ? "token" : "password")) return true;
  if (params.mode === "trusted-proxy") return !isTokenPath;
  if (params.mode === "token" || params.mode === "none") return false;
  if (params.mode === "password") return !isTokenPath;
  return isTokenPath ? !params.hasPasswordCandidate : !params.hasTokenCandidate;
}
function shouldResolveGatewayTokenSecretRef(params) {
  return shouldResolveGatewayAuthSecretRef({
    mode: params.mode,
    path: "gateway.auth.token",
    hasPasswordCandidate: params.hasPasswordCandidate,
    hasTokenCandidate: params.hasTokenCandidate,
  });
}
function shouldResolveGatewayPasswordSecretRef(params) {
  return shouldResolveGatewayAuthSecretRef({
    mode: params.mode,
    path: "gateway.auth.password",
    hasPasswordCandidate: params.hasPasswordCandidate,
    hasTokenCandidate: params.hasTokenCandidate,
  });
}
function hasActiveExecGatewayAuthSecretRef(params) {
  if (!params.shouldResolve) return false;
  const { ref } = resolveSecretInputRef({
    value: readGatewaySecretInputValue(params.cfg, params.path),
    defaults: params.cfg.secrets?.defaults,
  });
  return ref?.source === "exec";
}
/** Check whether active local Gateway auth refs can be read without invoking exec providers. */
function canMaterializeGatewayAuthSecretRefsWithoutExec(params) {
  return !(
    hasActiveExecGatewayAuthSecretRef({
      cfg: params.cfg,
      path: "gateway.auth.token",
      shouldResolve: shouldResolveGatewayTokenSecretRef(params),
    }) ||
    hasActiveExecGatewayAuthSecretRef({
      cfg: params.cfg,
      path: "gateway.auth.password",
      shouldResolve: shouldResolveGatewayPasswordSecretRef(params),
    })
  );
}
async function resolveGatewayAuthSecretRefValue(params) {
  if (!params.shouldResolve) return;
  const value = await resolveRequiredConfiguredSecretRefInputString({
    config: params.cfg,
    env: params.env,
    value: readGatewaySecretInputValue(params.cfg, params.path),
    path: params.path,
  });
  if (!value) return;
  return value;
}
/** Resolve the Gateway auth token ref only when token auth can use it. */
async function resolveGatewayTokenSecretRefValue(params) {
  return resolveGatewayAuthSecretRefValue({
    cfg: params.cfg,
    env: params.env,
    path: "gateway.auth.token",
    shouldResolve: shouldResolveGatewayTokenSecretRef(params),
  });
}
/** Resolve the Gateway auth password ref only when password auth can use it. */
async function resolveGatewayPasswordSecretRefValue(params) {
  return resolveGatewayAuthSecretRefValue({
    cfg: params.cfg,
    env: params.env,
    path: "gateway.auth.password",
    shouldResolve: shouldResolveGatewayPasswordSecretRef(params),
  });
}
async function resolveGatewayAuthSecretRef(params) {
  const value = await resolveGatewayAuthSecretRefValue(params);
  if (!value) return params.cfg;
  const nextConfig = structuredClone(params.cfg);
  nextConfig.gateway ??= {};
  nextConfig.gateway.auth ??= {};
  assignResolvedGatewaySecretInput({
    config: nextConfig,
    path: params.path,
    value,
  });
  return nextConfig;
}
async function resolveGatewayPasswordSecretRef(params) {
  return resolveGatewayAuthSecretRef({
    cfg: params.cfg,
    env: params.env,
    path: "gateway.auth.password",
    shouldResolve: shouldResolveGatewayPasswordSecretRef(params),
  });
}
/** Materialize active local Gateway auth secret refs on a cloned config. */
async function materializeGatewayAuthSecretRefs(params) {
  const cfgWithToken = await resolveGatewayAuthSecretRef({
    cfg: params.cfg,
    env: params.env,
    path: "gateway.auth.token",
    shouldResolve: shouldResolveGatewayTokenSecretRef(params),
  });
  return await resolveGatewayPasswordSecretRef({
    cfg: cfgWithToken,
    env: params.env,
    mode: params.mode,
    hasPasswordCandidate: params.hasPasswordCandidate,
    hasTokenCandidate:
      params.hasTokenCandidate ||
      hasConfiguredGatewayAuthSecretInput(cfgWithToken, "gateway.auth.token"),
  });
}
//#endregion
export {
  resolveGatewayTokenSecretRefValue as a,
  resolveGatewayPasswordSecretRefValue as i,
  hasConfiguredGatewayAuthSecretInput as n,
  materializeGatewayAuthSecretRefs as r,
  canMaterializeGatewayAuthSecretRefsWithoutExec as t,
};
