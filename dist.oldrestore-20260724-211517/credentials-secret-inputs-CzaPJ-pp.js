import { a as trimToUndefined } from "./credential-planner-BTC1pLMc.js";
import {
  r as resolveGatewayCredentialsFromConfig,
  t as GatewaySecretRefUnavailableError,
} from "./credentials-DqHTozxM.js";
import { n as resolveSecretRefString } from "./resolve-Dvpn9c2h.js";
import {
  a as readGatewaySecretInputValue,
  i as isTokenGatewaySecretInputPath,
  n as assignResolvedGatewaySecretInput,
  r as isSupportedGatewaySecretInputPath,
  t as ALL_GATEWAY_SECRET_INPUT_PATHS,
} from "./secret-input-paths-BqHb6OmN.js";
import {
  g as resolveSecretInputRef,
  p as normalizeSecretInputString,
} from "./types.secrets-BV0ywRAy.js";
//#region src/secrets/resolve-secret-input-string.ts
/**
 * Resolves a config value that may be either an inline string or a SecretRef object.
 *
 * Plugin and gateway callers can override normalization and convert SecretRef resolution errors
 * into surface-specific failures without duplicating provider lookup behavior.
 */
async function resolveSecretInputString(params) {
  const normalize = params.normalize ?? normalizeSecretInputString;
  const { ref } = resolveSecretInputRef({
    value: params.value,
    defaults: params.defaults ?? params.config.secrets?.defaults,
  });
  if (!ref) return normalize(params.value);
  let resolved;
  try {
    resolved = await resolveSecretRefString(ref, {
      config: params.config,
      env: params.env,
    });
  } catch (error) {
    if (params.onResolveRefError) return params.onResolveRefError(error, ref);
    throw error;
  }
  return normalize(resolved);
}
//#endregion
//#region src/gateway/credentials-secret-inputs.ts
function resolveExplicitGatewayAuth(opts) {
  return {
    token:
      typeof opts?.token === "string" && opts.token.trim().length > 0 ? opts.token.trim() : void 0,
    password:
      typeof opts?.password === "string" && opts.password.trim().length > 0
        ? opts.password.trim()
        : void 0,
  };
}
async function resolveGatewaySecretInputString(params) {
  const value = await resolveSecretInputString({
    config: params.config,
    value: params.value,
    env: params.env,
    normalize: trimToUndefined,
    onResolveRefError: () => {
      throw new GatewaySecretRefUnavailableError(params.path);
    },
  });
  if (!value) throw new Error(`${params.path} resolved to an empty or non-string value.`);
  return value;
}
function hasConfiguredGatewaySecretRef(config, path) {
  return Boolean(
    resolveSecretInputRef({
      value: readGatewaySecretInputValue(config, path),
      defaults: config.secrets?.defaults,
    }).ref,
  );
}
function resolveGatewayCredentialsFromConfigOptions(params) {
  const { cfg, env, options } = params;
  return {
    cfg,
    env,
    explicitAuth: options.explicitAuth,
    urlOverride: options.urlOverride,
    urlOverrideSource: options.urlOverrideSource,
    modeOverride: options.modeOverride,
    localTokenPrecedence: options.localTokenPrecedence,
    localPasswordPrecedence: options.localPasswordPrecedence,
    remoteTokenPrecedence: options.remoteTokenPrecedence,
    remotePasswordPrecedence: options.remotePasswordPrecedence ?? "env-first",
    remoteTokenFallback: options.remoteTokenFallback,
    remotePasswordFallback: options.remotePasswordFallback,
  };
}
function localAuthModeAllowsGatewaySecretInputPath(params) {
  const { authMode, path } = params;
  if (authMode === "none") return false;
  if (authMode === "trusted-proxy") return !isTokenGatewaySecretInputPath(path);
  if (authMode === "token") return isTokenGatewaySecretInputPath(path);
  if (authMode === "password") return !isTokenGatewaySecretInputPath(path);
  return true;
}
function canGatewaySecretInputPathWin(params) {
  if (!hasConfiguredGatewaySecretRef(params.config, params.path)) return false;
  const mode =
    params.options.modeOverride ?? (params.config.gateway?.mode === "remote" ? "remote" : "local");
  if (
    mode === "local" &&
    !localAuthModeAllowsGatewaySecretInputPath({
      authMode: params.config.gateway?.auth?.mode,
      path: params.path,
    })
  )
    return false;
  const sentinel = `__OPENCLAW_GATEWAY_SECRET_REF_PROBE_${params.path.replaceAll(".", "_")}__`;
  const probeConfig = structuredClone(params.config);
  for (const candidatePath of ALL_GATEWAY_SECRET_INPUT_PATHS) {
    if (!hasConfiguredGatewaySecretRef(probeConfig, candidatePath)) continue;
    assignResolvedGatewaySecretInput({
      config: probeConfig,
      path: candidatePath,
      value: void 0,
    });
  }
  assignResolvedGatewaySecretInput({
    config: probeConfig,
    path: params.path,
    value: sentinel,
  });
  try {
    const resolved = resolveGatewayCredentialsFromConfig(
      resolveGatewayCredentialsFromConfigOptions({
        cfg: probeConfig,
        env: params.env,
        options: params.options,
      }),
    );
    const authMode = params.config.gateway?.auth?.mode;
    const tokenCanWin =
      resolved.token === sentinel &&
      ((mode === "local" && authMode === "token") || !resolved.password);
    const passwordCanWin =
      resolved.password === sentinel &&
      ((mode === "local" && (authMode === "password" || authMode === "trusted-proxy")) ||
        !resolved.token);
    return tokenCanWin || passwordCanWin;
  } catch {
    return false;
  }
}
/** Test whether resolving a configured secret-ref path could affect selected credentials. */
function gatewaySecretInputPathCanWin(params) {
  const { path, env = process.env, ...options } = params;
  return canGatewaySecretInputPathWin({
    options: {
      ...options,
      explicitAuth: resolveExplicitGatewayAuth(options.explicitAuth),
    },
    env,
    config: params.config,
    path,
  });
}
async function resolveConfiguredGatewaySecretInput(params) {
  return resolveGatewaySecretInputString({
    config: params.config,
    value: readGatewaySecretInputValue(params.config, params.path),
    path: params.path,
    env: params.env,
  });
}
async function resolvePreferredGatewaySecretInputs(params) {
  let nextConfig = params.config;
  for (const path of ALL_GATEWAY_SECRET_INPUT_PATHS) {
    if (
      !canGatewaySecretInputPathWin({
        options: params.options,
        env: params.env,
        config: nextConfig,
        path,
      })
    )
      continue;
    if (nextConfig === params.config) nextConfig = structuredClone(params.config);
    try {
      const resolvedValue = await resolveConfiguredGatewaySecretInput({
        config: nextConfig,
        path,
        env: params.env,
      });
      assignResolvedGatewaySecretInput({
        config: nextConfig,
        path,
        value: resolvedValue,
      });
    } catch {
      continue;
    }
  }
  return nextConfig;
}
/** Resolve only secret refs that can win, then select Gateway credentials. */
async function resolveGatewayCredentialsFromConfigWithSecretInputs(params) {
  let resolvedConfig = await resolvePreferredGatewaySecretInputs({
    options: params.options,
    env: params.env,
    config: params.options.config,
  });
  const resolvedPaths = /* @__PURE__ */ new Set();
  for (;;)
    try {
      return resolveGatewayCredentialsFromConfig(
        resolveGatewayCredentialsFromConfigOptions({
          cfg: resolvedConfig,
          env: params.env,
          options: params.options,
        }),
      );
    } catch (error) {
      if (!(error instanceof GatewaySecretRefUnavailableError)) throw error;
      const path = error.path;
      if (!isSupportedGatewaySecretInputPath(path) || resolvedPaths.has(path)) throw error;
      if (resolvedConfig === params.options.config)
        resolvedConfig = structuredClone(params.options.config);
      const resolvedValue = await resolveConfiguredGatewaySecretInput({
        config: resolvedConfig,
        path,
        env: params.env,
      });
      assignResolvedGatewaySecretInput({
        config: resolvedConfig,
        path,
        value: resolvedValue,
      });
      resolvedPaths.add(path);
    }
}
/** Resolve Gateway credentials after materializing winning configured secret refs. */
async function resolveGatewayCredentialsWithSecretInputs(params) {
  const options = {
    ...params,
    explicitAuth: resolveExplicitGatewayAuth(params.explicitAuth),
  };
  if (options.explicitAuth.token || options.explicitAuth.password)
    return {
      token: options.explicitAuth.token,
      password: options.explicitAuth.password,
    };
  return await resolveGatewayCredentialsFromConfigWithSecretInputs({
    options,
    env: params.env ?? process.env,
  });
}
//#endregion
export { resolveGatewayCredentialsWithSecretInputs as n, gatewaySecretInputPathCanWin as t };
