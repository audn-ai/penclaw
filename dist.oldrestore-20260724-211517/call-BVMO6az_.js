import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { t as createAbortError } from "./abort-signal-DEbc_zqk.js";
import { n as resolveGatewayAuth } from "./auth-resolve-PY0Y7GYi.js";
import { n as loadDeviceAuthToken, t as GatewayClient } from "./client-BkZfVL9e.js";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-Br1guPTt.js";
import { t as startGatewayClientWhenEventLoopReady } from "./client-start-readiness-_Anybv37.js";
import "./credentials-DqHTozxM.js";
import { t as applyConfigEnvVars } from "./config-env-vars-CwdMUFhk.js";
import { t as buildGatewayConnectionDetailsWithResolvers } from "./connection-details-ByYgagYn.js";
import { a as trimToUndefined } from "./credential-planner-BTC1pLMc.js";
import { n as resolveGatewayCredentialsWithSecretInputs } from "./credentials-secret-inputs-CzaPJ-pp.js";
import { r as loadOrCreateDeviceIdentity } from "./device-identity-BmJfeLuX.js";
import { r as resolveConfigEnvVars } from "./env-substitution-BDfwDlDU.js";
import "./version-CwNT1gaY.js";
import { t as canSkipGatewayConfigLoad } from "./explicit-connection-policy-BQ_1rLmb.js";
import { t as loadGatewayTlsRuntime } from "./gateway-nx4YtQiS.js";
import {
  c as resolveConfigIncludes,
  o as readConfigIncludeFileWithGuards,
} from "./includes-C1dGj2Ja.js";
import { f as isLoopbackIpAddress } from "./ip-CyyRxPli.js";
import {
  a as isGatewayMethodClassified,
  s as resolveLeastPrivilegeOperatorScopesForMethod,
  t as CLI_DEFAULT_OPERATOR_SCOPES,
} from "./method-scopes-DrxGpKMT.js";
import { r as roleScopesAllow } from "./operator-scope-compat-BVrjvlGm.js";
import { t as parseJsonWithJson5Fallback } from "./parse-json-compat-CmZHj-1e.js";
import {
  c as resolveConfigPath,
  f as resolveGatewayPort,
  p as resolveIncludeRoots,
  y as resolveStateDir,
} from "./paths-DEklnbzU.js";
import { o as redactSensitiveUrlLikeString } from "./redact-sensitive-url-CPcFXf0r.js";
import { r as isGatewayConnectAssemblyError } from "./src-BOx4iLSi.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import {
  o as resolvePreauthHandshakeTimeoutMs,
  s as resolveSafeTimeoutDelayMs,
} from "./timeouts-Dewo7BbT.js";
import { n as VERSION } from "./version-CeFj_iGk.js";
//#region src/config/gateway-dispatch-config.ts
const GATEWAY_DISPATCH_SHELL_ENV_EXPECTED_KEYS = [
  "OPENCLAW_GATEWAY_TOKEN",
  "OPENCLAW_GATEWAY_PASSWORD",
];
const GATEWAY_DISPATCH_TOP_LEVEL_KEYS = [
  "agents",
  "env",
  "gateway",
  "plugins",
  "secrets",
  "session",
];
function isPlainRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
function cloneConfigValue(value) {
  if (Array.isArray(value)) return value.map((entry) => cloneConfigValue(entry));
  if (!isPlainRecord(value)) return value;
  const out = {};
  for (const [key, child] of Object.entries(value)) out[key] = cloneConfigValue(child);
  return out;
}
function projectGatewayDispatchConfig(value) {
  if (!isPlainRecord(value)) return {};
  const projected = {};
  for (const key of GATEWAY_DISPATCH_TOP_LEVEL_KEYS)
    if (Object.hasOwn(value, key)) projected[key] = cloneConfigValue(value[key]);
  return projected;
}
function applyGatewayDispatchSessionDefaults(config) {
  if (config.session?.mainKey === void 0) return config;
  return {
    ...config,
    session: {
      ...config.session,
      mainKey: "main",
    },
  };
}
function resolveIncludesForGatewayDispatch(parsed, configPath, env) {
  return resolveConfigIncludes(
    parsed,
    configPath,
    {
      readFile: (candidate) => fs.readFileSync(candidate, "utf-8"),
      readFileWithGuards: ({ includePath, resolvedPath, rootRealDir }) =>
        readConfigIncludeFileWithGuards({
          includePath,
          resolvedPath,
          rootRealDir,
          ioFs: fs,
        }),
      parseJson: parseJsonWithJson5Fallback,
    },
    { allowedRoots: resolveIncludeRoots(env) },
  );
}
function resolveGatewayDispatchEnvVars(config, env) {
  if (isPlainRecord(config) && Object.hasOwn(config, "env")) applyConfigEnvVars(config, env);
  return resolveConfigEnvVars(config, env, { onMissing: () => void 0 });
}
function readRawGatewayDispatchConfig(options = {}) {
  const env = options.env ?? process.env;
  const configPath = options.configPath ?? resolveConfigPath(env);
  if (!fs.existsSync(configPath))
    return {
      config: {},
      configPath,
    };
  return {
    config: applyGatewayDispatchSessionDefaults(
      projectGatewayDispatchConfig(
        resolveGatewayDispatchEnvVars(
          resolveIncludesForGatewayDispatch(
            parseJsonWithJson5Fallback(fs.readFileSync(configPath, "utf-8")),
            configPath,
            env,
          ),
          env,
        ),
      ),
    ),
    configPath,
  };
}
function readGatewayDispatchConfig(options = {}) {
  return readRawGatewayDispatchConfig(options).config;
}
async function readGatewayDispatchConfigWithShellEnvFallback(options = {}) {
  const env = options.env ?? process.env;
  const firstRead = readRawGatewayDispatchConfig(options);
  const {
    loadShellEnvFallback,
    resolveShellEnvFallbackTimeoutMs,
    shouldDeferShellEnvFallback,
    shouldEnableShellEnvFallback,
  } = await import("./shell-env-vIkr3AIg.js");
  if (
    (shouldEnableShellEnvFallback(env) || firstRead.config.env?.shellEnv?.enabled === true) &&
    !shouldDeferShellEnvFallback(env)
  )
    loadShellEnvFallback({
      enabled: true,
      env,
      expectedKeys: [...GATEWAY_DISPATCH_SHELL_ENV_EXPECTED_KEYS],
      logger: options.logger ?? console,
      timeoutMs: firstRead.config.env?.shellEnv?.timeoutMs ?? resolveShellEnvFallbackTimeoutMs(env),
    });
  return readGatewayDispatchConfig({
    ...options,
    configPath: path.resolve(firstRead.configPath),
  });
}
//#endregion
//#region src/gateway/call.ts
var GatewayTransportError = class extends Error {
  constructor(params) {
    super(params.message);
    this.name = "GatewayTransportError";
    this.kind = params.kind;
    this.connectionDetails = params.connectionDetails;
    if (params.code !== void 0) this.code = params.code;
    if (params.reason !== void 0) this.reason = params.reason;
    if (params.timeoutMs !== void 0) this.timeoutMs = params.timeoutMs;
  }
};
var GatewayCredentialsRequiredError = class extends Error {
  constructor(params) {
    super(
      [
        `gateway ${params.method} requires credentials before opening a websocket`,
        "Fix: configure gateway.auth token/password, pair this device, or pass --token/--password.",
        `Config: ${params.configPath}`,
      ].join("\n"),
    );
    this.name = "GatewayCredentialsRequiredError";
    this.method = params.method;
    this.configPath = params.configPath;
  }
};
var GatewayExplicitAuthRequiredError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "GatewayExplicitAuthRequiredError";
  }
};
var GatewayStoredDeviceAuthUnavailableError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "GatewayStoredDeviceAuthUnavailableError";
  }
};
var GatewayLocalBackendSharedAuthUnavailableError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "GatewayLocalBackendSharedAuthUnavailableError";
  }
};
function firstGatewayErrorLine(message) {
  return message.split("\n", 1)[0]?.trim() || message;
}
function formatGatewayTransportErrorJson(value) {
  if (!isGatewayTransportError(value)) return null;
  return {
    ok: false,
    error: {
      type: "gateway_transport_error",
      kind: value.kind,
      message: firstGatewayErrorLine(value.message),
      ...(value.code !== void 0 ? { code: value.code } : {}),
      ...(value.reason !== void 0 ? { reason: value.reason } : {}),
      ...(value.timeoutMs !== void 0 ? { timeoutMs: value.timeoutMs } : {}),
    },
    gateway: {
      url: redactSensitiveUrlLikeString(value.connectionDetails.url),
      urlSource: value.connectionDetails.urlSource,
      ...(value.connectionDetails.bindDetail
        ? { bindDetail: value.connectionDetails.bindDetail }
        : {}),
      ...(value.connectionDetails.remoteFallbackNote
        ? { remoteFallbackNote: value.connectionDetails.remoteFallbackNote }
        : {}),
    },
  };
}
function formatGatewayClientRequestErrorJson(value) {
  if (!(value instanceof Error) || value.name !== "GatewayClientRequestError") return null;
  const requestError = value;
  if (
    typeof requestError.gatewayCode !== "string" ||
    requestError.gatewayCode.length === 0 ||
    requestError.message.length === 0 ||
    typeof requestError.retryable !== "boolean" ||
    (requestError.retryAfterMs !== void 0 &&
      (typeof requestError.retryAfterMs !== "number" ||
        !Number.isInteger(requestError.retryAfterMs) ||
        requestError.retryAfterMs < 0))
  )
    return null;
  return {
    ok: false,
    error: {
      type: "gateway_request_error",
      code: requestError.gatewayCode,
      message: requestError.message,
      ...(requestError.details !== void 0 ? { details: requestError.details } : {}),
      retryable: requestError.retryable,
      ...(requestError.retryAfterMs !== void 0 ? { retryAfterMs: requestError.retryAfterMs } : {}),
    },
  };
}
function isGatewayTransportError(value) {
  if (value instanceof GatewayTransportError) return true;
  if (!(value instanceof Error) || value.name !== "GatewayTransportError") return false;
  const candidate = value;
  return (
    (candidate.kind === "closed" || candidate.kind === "timeout") &&
    typeof candidate.connectionDetails === "object" &&
    candidate.connectionDetails !== null
  );
}
function isGatewayCredentialsRequiredError(value) {
  if (value instanceof GatewayCredentialsRequiredError) return true;
  if (!(value instanceof Error) || value.name !== "GatewayCredentialsRequiredError") return false;
  const candidate = value;
  return typeof candidate.method === "string" && typeof candidate.configPath === "string";
}
function isGatewayExplicitAuthRequiredError(value) {
  return value instanceof Error && value.name === "GatewayExplicitAuthRequiredError";
}
const defaultCreateGatewayClient = (opts) => new GatewayClient(opts);
const defaultGetRuntimeConfig = async () => (await import("./io-CThf_xQw.js")).getRuntimeConfig();
const defaultGatewayCallDeps = {
  createGatewayClient: defaultCreateGatewayClient,
  getRuntimeConfig: defaultGetRuntimeConfig,
  loadOrCreateDeviceIdentity,
  resolveGatewayPort,
  resolveConfigPath,
  resolveStateDir,
  loadGatewayTlsRuntime,
  loadDeviceAuthToken,
};
const gatewayCallDeps = { ...defaultGatewayCallDeps };
async function stopGatewayClient(client) {
  try {
    await client.stopAndWait({ timeoutMs: 1e3 });
  } catch {
    client.stop();
  }
}
function resolveGatewayClientDisplayName(opts) {
  if (opts.clientDisplayName) return opts.clientDisplayName;
  const clientName = opts.clientName ?? GATEWAY_CLIENT_NAMES.CLI;
  if (
    (opts.mode ?? GATEWAY_CLIENT_MODES.CLI) !== GATEWAY_CLIENT_MODES.BACKEND &&
    clientName !== GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT
  )
    return;
  const method = opts.method.trim();
  return method ? `gateway:${method}` : "gateway:request";
}
async function loadGatewayConfig() {
  return await (
    typeof gatewayCallDeps.getRuntimeConfig === "function"
      ? gatewayCallDeps.getRuntimeConfig
      : typeof defaultGatewayCallDeps.getRuntimeConfig === "function"
        ? defaultGatewayCallDeps.getRuntimeConfig
        : defaultGetRuntimeConfig
  )();
}
function loadGatewayConfigForConnectionDetails() {
  if (
    gatewayCallDeps.getRuntimeConfig !== defaultGetRuntimeConfig &&
    typeof gatewayCallDeps.getRuntimeConfig === "function"
  ) {
    const config = gatewayCallDeps.getRuntimeConfig();
    if (config && typeof config.then === "function")
      throw new Error("async gateway config loader is not supported for connection details");
    return config;
  }
  return readGatewayDispatchConfig();
}
function resolveGatewayStateDir(env) {
  return (
    typeof gatewayCallDeps.resolveStateDir === "function"
      ? gatewayCallDeps.resolveStateDir
      : resolveStateDir
  )(env);
}
function resolveGatewayConfigPath(env) {
  return (
    typeof gatewayCallDeps.resolveConfigPath === "function"
      ? gatewayCallDeps.resolveConfigPath
      : resolveConfigPath
  )(env, resolveGatewayStateDir(env));
}
function resolveGatewayPortValue(config, env) {
  return (
    typeof gatewayCallDeps.resolveGatewayPort === "function"
      ? gatewayCallDeps.resolveGatewayPort
      : resolveGatewayPort
  )(config, env);
}
function buildGatewayConnectionDetails(options = {}) {
  return buildGatewayConnectionDetailsWithResolvers(options, {
    getRuntimeConfig: () => loadGatewayConfigForConnectionDetails(),
    resolveConfigPath: (env) => resolveGatewayConfigPath(env),
    resolveGatewayPort: (config, env) => resolveGatewayPortValue(config, env),
  });
}
const testing = {
  setDepsForTests(deps) {
    gatewayCallDeps.createGatewayClient =
      deps?.createGatewayClient ?? defaultGatewayCallDeps.createGatewayClient;
    gatewayCallDeps.getRuntimeConfig =
      deps?.getRuntimeConfig ?? defaultGatewayCallDeps.getRuntimeConfig;
    gatewayCallDeps.loadOrCreateDeviceIdentity =
      deps?.loadOrCreateDeviceIdentity ?? defaultGatewayCallDeps.loadOrCreateDeviceIdentity;
    gatewayCallDeps.resolveGatewayPort =
      deps?.resolveGatewayPort ?? defaultGatewayCallDeps.resolveGatewayPort;
    gatewayCallDeps.resolveConfigPath =
      deps?.resolveConfigPath ?? defaultGatewayCallDeps.resolveConfigPath;
    gatewayCallDeps.resolveStateDir =
      deps?.resolveStateDir ?? defaultGatewayCallDeps.resolveStateDir;
    gatewayCallDeps.loadGatewayTlsRuntime =
      deps?.loadGatewayTlsRuntime ?? defaultGatewayCallDeps.loadGatewayTlsRuntime;
    gatewayCallDeps.loadDeviceAuthToken =
      deps?.loadDeviceAuthToken ?? defaultGatewayCallDeps.loadDeviceAuthToken;
  },
  resetDepsForTests() {
    gatewayCallDeps.createGatewayClient = defaultGatewayCallDeps.createGatewayClient;
    gatewayCallDeps.getRuntimeConfig = defaultGatewayCallDeps.getRuntimeConfig;
    gatewayCallDeps.loadOrCreateDeviceIdentity = defaultGatewayCallDeps.loadOrCreateDeviceIdentity;
    gatewayCallDeps.resolveGatewayPort = defaultGatewayCallDeps.resolveGatewayPort;
    gatewayCallDeps.resolveConfigPath = defaultGatewayCallDeps.resolveConfigPath;
    gatewayCallDeps.resolveStateDir = defaultGatewayCallDeps.resolveStateDir;
    gatewayCallDeps.loadGatewayTlsRuntime = defaultGatewayCallDeps.loadGatewayTlsRuntime;
    gatewayCallDeps.loadDeviceAuthToken = defaultGatewayCallDeps.loadDeviceAuthToken;
  },
};
function isLoopbackGatewayUrl(rawUrl) {
  try {
    const hostname = new URL(rawUrl).hostname.toLowerCase();
    const unbracketed =
      hostname.startsWith("[") && hostname.endsWith("]") ? hostname.slice(1, -1) : hostname;
    return unbracketed === "localhost" || isLoopbackIpAddress(unbracketed);
  } catch {
    return false;
  }
}
function shouldOmitDeviceIdentityForGatewayCall(params) {
  const mode = params.opts.mode ?? GATEWAY_CLIENT_MODES.CLI;
  const clientName = params.opts.clientName ?? GATEWAY_CLIENT_NAMES.CLI;
  const hasSharedSecretAuth =
    (params.authMode === "token" && Boolean(params.token)) ||
    (params.authMode === "password" && Boolean(params.password));
  const isLoopback = isLoopbackGatewayUrl(params.url);
  const isLocalBackendSharedAuth =
    mode === GATEWAY_CLIENT_MODES.BACKEND &&
    clientName === GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT &&
    (hasSharedSecretAuth || params.allowAuthNone === true) &&
    isLoopback;
  const isLocalCliSharedAuth =
    mode === GATEWAY_CLIENT_MODES.CLI &&
    clientName === GATEWAY_CLIENT_NAMES.CLI &&
    hasSharedSecretAuth &&
    isLoopback;
  return isLocalBackendSharedAuth || isLocalCliSharedAuth;
}
function resolveDeviceIdentityForGatewayCall() {
  try {
    return gatewayCallDeps.loadOrCreateDeviceIdentity();
  } catch {
    return null;
  }
}
function loadStoredOperatorDeviceAuthToken(deviceIdentity) {
  if (!deviceIdentity) return null;
  try {
    return gatewayCallDeps.loadDeviceAuthToken({
      deviceId: deviceIdentity.deviceId,
      role: "operator",
      env: process.env,
    });
  } catch {
    return null;
  }
}
function hasStoredOperatorDeviceAuthToken(deviceIdentity) {
  return Boolean(loadStoredOperatorDeviceAuthToken(deviceIdentity)?.token);
}
function resolveGatewayCallAuth(config) {
  return resolveGatewayAuth({
    authConfig: config.gateway?.auth,
    env: process.env,
    tailscaleMode: config.gateway?.tailscale?.mode,
  });
}
function ensureGatewayCallCanAuthenticate(params) {
  const resolvedAuth = resolveGatewayCallAuth(params.context.config);
  const authMode = resolvedAuth.mode;
  if (authMode !== "token" && authMode !== "password") return;
  if (params.token || params.password || params.opts.approvalRuntimeToken) return;
  if (resolvedAuth.allowTailscale) return;
  if (hasStoredOperatorDeviceAuthToken(params.deviceIdentity)) return;
  throw new GatewayCredentialsRequiredError({
    method: params.opts.method,
    configPath: params.context.configPath,
  });
}
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
function ensureExplicitGatewayAuth(params) {
  if (!params.urlOverride) return;
  const explicitToken = params.explicitAuth?.token;
  const explicitPassword = params.explicitAuth?.password;
  if (params.urlOverrideSource === "cli" && (explicitToken || explicitPassword)) return;
  const hasResolvedAuth =
    params.resolvedAuth?.token ||
    params.resolvedAuth?.password ||
    explicitToken ||
    explicitPassword;
  if (params.urlOverrideSource === "env" && hasResolvedAuth) return;
  const sourceHint =
    params.urlOverrideSource === "env"
      ? "Set OPENCLAW_GATEWAY_TOKEN or OPENCLAW_GATEWAY_PASSWORD alongside OPENCLAW_GATEWAY_URL; config credentials are intentionally not reused."
      : params.urlOverrideSource === "cli"
        ? "For the default local or SSH-tunneled Gateway, remove --url to use the configured target."
        : void 0;
  throw new GatewayExplicitAuthRequiredError(
    [
      "gateway url override requires explicit credentials",
      params.errorHint,
      sourceHint,
      params.configPath ? `Config: ${params.configPath}` : void 0,
    ]
      .filter(Boolean)
      .join("\n"),
  );
}
function resolveGatewayCallTimeout(timeoutValue, configuredHandshakeTimeoutMs) {
  const hasConfiguredHandshakeTimeout =
    typeof configuredHandshakeTimeoutMs === "number" &&
    Number.isFinite(configuredHandshakeTimeoutMs) &&
    configuredHandshakeTimeoutMs > 0;
  const hasEnvHandshakeTimeout =
    Boolean(process.env.OPENCLAW_HANDSHAKE_TIMEOUT_MS) ||
    Boolean(process.env.VITEST && process.env.OPENCLAW_TEST_HANDSHAKE_TIMEOUT_MS);
  const resolvedHandshakeTimeoutMs =
    hasConfiguredHandshakeTimeout || hasEnvHandshakeTimeout
      ? resolvePreauthHandshakeTimeoutMs({ configuredTimeoutMs: configuredHandshakeTimeoutMs })
      : void 0;
  const defaultTimeoutMs =
    typeof resolvedHandshakeTimeoutMs === "number" && resolvedHandshakeTimeoutMs > 1e4
      ? resolvedHandshakeTimeoutMs
      : 1e4;
  const explicitTimeoutMs =
    typeof timeoutValue === "number" && Number.isFinite(timeoutValue) ? timeoutValue : void 0;
  const startupTimeoutMs = explicitTimeoutMs ?? defaultTimeoutMs;
  const timeoutMs = timeoutValue === null ? null : (explicitTimeoutMs ?? defaultTimeoutMs);
  return {
    timeoutMs,
    startupTimeoutMs,
    safeTimerTimeoutMs: resolveSafeTimeoutDelayMs(timeoutMs ?? startupTimeoutMs),
  };
}
async function resolveGatewayCallContext(opts) {
  const cliUrlOverride = trimToUndefined(opts.url);
  const explicitAuth = resolveExplicitGatewayAuth({
    token: opts.token,
    password: opts.password,
  });
  const envUrlOverride =
    cliUrlOverride || opts.localPortOverride !== void 0 || opts.ignoreEnvUrlOverride === true
      ? void 0
      : trimToUndefined(process.env.OPENCLAW_GATEWAY_URL);
  const urlOverride = cliUrlOverride ?? envUrlOverride;
  const urlOverrideSource = cliUrlOverride ? "cli" : envUrlOverride ? "env" : void 0;
  const canSkipConfigLoad = canSkipGatewayConfigLoad({
    config: opts.config,
    urlOverride,
    explicitAuth,
  });
  const config = opts.config ?? (canSkipConfigLoad ? {} : await loadGatewayConfig());
  const configPath = opts.configPath ?? resolveGatewayConfigPath(process.env);
  const isRemoteMode = config.gateway?.mode === "remote";
  const remote = isRemoteMode ? config.gateway?.remote : void 0;
  return {
    config,
    configPath,
    isRemoteMode,
    remote,
    urlOverride,
    urlOverrideSource,
    remoteUrl: trimToUndefined(remote?.url),
    explicitAuth,
  };
}
function ensureRemoteModeUrlConfigured(context) {
  if (!context.isRemoteMode || context.urlOverride || context.remoteUrl) return;
  throw new Error(
    [
      "gateway remote mode misconfigured: gateway.remote.url missing",
      `Config: ${context.configPath}`,
      "Fix: set gateway.remote.url, or set gateway.mode=local.",
    ].join("\n"),
  );
}
async function resolveGatewayCredentials(context) {
  return resolveGatewayCredentialsWithEnv(context, process.env);
}
async function resolveGatewayCredentialsWithEnv(context, env) {
  if (context.explicitAuth.token || context.explicitAuth.password)
    return {
      token: context.explicitAuth.token,
      password: context.explicitAuth.password,
    };
  return resolveGatewayCredentialsWithSecretInputs({
    config: context.config,
    explicitAuth: context.explicitAuth,
    urlOverride: context.urlOverride,
    urlOverrideSource: context.urlOverrideSource,
    env,
    modeOverride: context.modeOverride,
    localTokenPrecedence: context.localTokenPrecedence,
    localPasswordPrecedence: context.localPasswordPrecedence,
    remoteTokenPrecedence: context.remoteTokenPrecedence,
    remotePasswordPrecedence: context.remotePasswordPrecedence,
    remoteTokenFallback: context.remoteTokenFallback,
    remotePasswordFallback: context.remotePasswordFallback,
  });
}
async function resolveGatewayTlsFingerprint(params) {
  const { opts, context, url } = params;
  const tlsRuntime =
    context.config.gateway?.tls?.enabled === true &&
    !context.urlOverrideSource &&
    !context.remoteUrl &&
    url.startsWith("wss://")
      ? await gatewayCallDeps.loadGatewayTlsRuntime(context.config.gateway?.tls)
      : void 0;
  const overrideTlsFingerprint = trimToUndefined(opts.tlsFingerprint);
  const remoteTlsFingerprint =
    context.isRemoteMode && context.urlOverrideSource !== "cli"
      ? trimToUndefined(context.remote?.tlsFingerprint)
      : void 0;
  return (
    overrideTlsFingerprint ||
    remoteTlsFingerprint ||
    (tlsRuntime?.enabled ? tlsRuntime.fingerprintSha256 : void 0)
  );
}
function formatGatewayCloseError(code, reason, connectionDetails) {
  const reasonText = normalizeOptionalString(reason) || "no close reason";
  const hint =
    code === 1006 ? "abnormal closure (no close frame)" : code === 1e3 ? "normal closure" : "";
  let message = `gateway closed (${code}${hint ? ` ${hint}` : ""}): ${reasonText}\n${connectionDetails.message}`;
  if (code === 1006)
    message +=
      "\n\nPossible causes:\n- Connection dropped without a close frame (retry; check network and gateway load)\n- Gateway not yet ready to accept connections (retry after a moment)\n- TLS mismatch (connecting with ws:// to a wss:// gateway, or vice versa)\n- Gateway process stopped or became unreachable (confirm it is still running)\nRun `openclaw doctor` for diagnostics.";
  return message;
}
function formatGatewayTimeoutError(timeoutMs, connectionDetails) {
  return `gateway timeout after ${timeoutMs}ms\n${connectionDetails.message}`;
}
function createGatewayCloseTransportError(params) {
  const reasonText = normalizeOptionalString(params.reason) || "no close reason";
  return new GatewayTransportError({
    kind: "closed",
    code: params.code,
    reason: reasonText,
    connectionDetails: params.connectionDetails,
    message: formatGatewayCloseError(params.code, params.reason, params.connectionDetails),
  });
}
function createGatewayTimeoutTransportError(params) {
  return new GatewayTransportError({
    kind: "timeout",
    timeoutMs: params.timeoutMs,
    connectionDetails: params.connectionDetails,
    message: formatGatewayTimeoutError(params.timeoutMs, params.connectionDetails),
  });
}
function createGatewayRequestAbortError(method) {
  return createAbortError(`gateway request aborted for ${method}`);
}
function ensureGatewaySupportsRequiredMethods(params) {
  const requiredMethods = Array.isArray(params.requiredMethods)
    ? params.requiredMethods.map((entry) => entry.trim()).filter((entry) => entry.length > 0)
    : [];
  if (requiredMethods.length === 0) return;
  const supportedMethods = new Set(
    (Array.isArray(params.methods) ? params.methods : [])
      .map((entry) => entry.trim())
      .filter((entry) => entry.length > 0),
  );
  for (const method of requiredMethods) {
    if (supportedMethods.has(method)) continue;
    throw new Error(
      [
        `active gateway does not support required method "${method}" for "${params.attemptedMethod}".`,
        "Update the gateway or run without SecretRefs.",
      ].join(" "),
    );
  }
}
function isRequiredAgentRuntimeIdentityConnectError(err) {
  return err.message.includes(
    "gateway rejected required agent runtime identity auth field; refusing to retry without it",
  );
}
async function executeGatewayRequestWithScopes(params) {
  const {
    opts,
    scopes,
    url,
    token,
    password,
    tlsFingerprint,
    preauthHandshakeTimeoutMs,
    timeoutMs,
    startupTimeoutMs,
    safeTimerTimeoutMs,
    deviceIdentity,
    surfaceGatewayClientRequestErrors,
  } = params;
  return await new Promise((resolve, reject) => {
    if (opts.signal?.aborted) {
      reject(createGatewayRequestAbortError(opts.method));
      return;
    }
    let settled = false;
    let ignoreClose = false;
    let timer;
    const startAbort = new AbortController();
    let primaryRequestStarted = false;
    let suppressedPreHelloCleanCloses = 0;
    const cleanup = () => {
      startAbort.abort();
      if (abortHandler) opts.signal?.removeEventListener("abort", abortHandler);
      if (timer) clearTimeout(timer);
    };
    const stopClientThenSettle = (activeClient, err, value) => {
      const complete = () => {
        if (err) reject(err);
        else resolve(value);
      };
      if (!activeClient) {
        complete();
        return;
      }
      stopGatewayClient(activeClient).finally(complete);
    };
    const stop = (err, value) => {
      if (settled) return;
      settled = true;
      cleanup();
      stopClientThenSettle(client, err, value);
    };
    const abortHandler = () => {
      if (settled) return;
      ignoreClose = true;
      settled = true;
      cleanup();
      const err = createGatewayRequestAbortError(opts.method);
      const activeClient = client;
      const stopAfterAbortHook = () => stopClientThenSettle(activeClient, err);
      if (!activeClient || !opts.onSignalAbort || !primaryRequestStarted) {
        stopAfterAbortHook();
        return;
      }
      const request = activeClient.request.bind(activeClient);
      Promise.resolve()
        .then(() => opts.onSignalAbort?.(request))
        .catch(() => {})
        .finally(stopAfterAbortHook);
    };
    opts.signal?.addEventListener("abort", abortHandler, { once: true });
    const client = gatewayCallDeps.createGatewayClient({
      url,
      token,
      password,
      tlsFingerprint,
      preauthHandshakeTimeoutMs,
      instanceId: opts.instanceId ?? randomUUID(),
      clientName: opts.clientName ?? GATEWAY_CLIENT_NAMES.CLI,
      clientDisplayName: resolveGatewayClientDisplayName(opts),
      clientVersion: opts.clientVersion ?? VERSION,
      platform: opts.platform,
      mode: opts.mode ?? GATEWAY_CLIENT_MODES.CLI,
      ...(opts.approvalRuntimeToken ? { approvalRuntimeToken: opts.approvalRuntimeToken } : {}),
      ...(opts.agentRuntimeIdentityToken
        ? { agentRuntimeIdentityToken: opts.agentRuntimeIdentityToken }
        : {}),
      role: "operator",
      ...(Array.isArray(scopes) ? { scopes } : {}),
      deviceIdentity,
      minProtocol: opts.minProtocol ?? 4,
      maxProtocol: opts.maxProtocol ?? 4,
      onHelloOk: (hello) => {
        if (timeoutMs === null && timer) {
          clearTimeout(timer);
          timer = void 0;
        }
        (async () => {
          try {
            ensureGatewaySupportsRequiredMethods({
              requiredMethods: opts.requiredMethods,
              methods: hello.features?.methods,
              attemptedMethod: opts.method,
            });
            const activeClient = client;
            if (!activeClient) throw new Error("gateway client not initialized");
            primaryRequestStarted = true;
            const result = await activeClient.request(opts.method, opts.params, {
              expectFinal: opts.expectFinal,
              timeoutMs: opts.timeoutMs,
              signal: opts.signal,
              onAccepted: opts.onAccepted,
            });
            ignoreClose = true;
            stop(void 0, result);
          } catch (err) {
            ignoreClose = true;
            stop(err);
          }
        })();
      },
      onClose: (code, reason, info) => {
        if (settled || ignoreClose) return;
        if (
          !primaryRequestStarted &&
          info?.transientPreHelloCleanClose === true &&
          suppressedPreHelloCleanCloses < 1
        ) {
          suppressedPreHelloCleanCloses += 1;
          return;
        }
        ignoreClose = true;
        stop(
          createGatewayCloseTransportError({
            code,
            reason,
            connectionDetails: params.connectionDetails,
          }),
        );
      },
      onConnectError: (err) => {
        const isGatewayClientRequestError = err.name === "GatewayClientRequestError";
        const isAgentRuntimeIdentityConnectError =
          Boolean(opts.agentRuntimeIdentityToken) &&
          isRequiredAgentRuntimeIdentityConnectError(err);
        const shouldSurface =
          isGatewayConnectAssemblyError(err) ||
          isAgentRuntimeIdentityConnectError ||
          (surfaceGatewayClientRequestErrors && isGatewayClientRequestError);
        if (settled || !shouldSurface) return;
        ignoreClose = true;
        stop(err);
      },
    });
    const wrapperTimeoutMs = timeoutMs ?? startupTimeoutMs;
    timer = setTimeout(() => {
      ignoreClose = true;
      stop(
        createGatewayTimeoutTransportError({
          timeoutMs: wrapperTimeoutMs,
          connectionDetails: params.connectionDetails,
        }),
      );
    }, safeTimerTimeoutMs);
    startGatewayClientWhenEventLoopReady(client, {
      timeoutMs: safeTimerTimeoutMs,
      signal: startAbort.signal,
    })
      .then((readiness) => {
        if (settled || readiness.ready || readiness.aborted) return;
        ignoreClose = true;
        stop(
          createGatewayTimeoutTransportError({
            timeoutMs: startupTimeoutMs,
            connectionDetails: params.connectionDetails,
          }),
        );
      })
      .catch((err) => {
        if (settled) return;
        ignoreClose = true;
        stop(err instanceof Error ? err : new Error(String(err)));
      });
  });
}
async function callGatewayWithScopes(opts, scopes) {
  const context = await resolveGatewayCallContext(opts);
  const { timeoutMs, startupTimeoutMs, safeTimerTimeoutMs } = resolveGatewayCallTimeout(
    opts.timeoutMs,
    context.config.gateway?.handshakeTimeoutMs,
  );
  if (opts.requireLocalBackendSharedAuth && (context.urlOverride || context.isRemoteMode))
    throw new GatewayLocalBackendSharedAuthUnavailableError(
      "local backend shared auth is limited to the configured local gateway",
    );
  const useStoredDeviceAuth = opts.useStoredDeviceAuth === true;
  if (
    useStoredDeviceAuth &&
    (context.urlOverride ||
      context.explicitAuth.token ||
      context.explicitAuth.password ||
      context.isRemoteMode)
  )
    throw new GatewayStoredDeviceAuthUnavailableError(
      "stored device auth is limited to the configured local gateway",
    );
  const resolvedCredentials = useStoredDeviceAuth ? {} : await resolveGatewayCredentials(context);
  ensureExplicitGatewayAuth({
    urlOverride: context.urlOverride,
    urlOverrideSource: context.urlOverrideSource,
    explicitAuth: context.explicitAuth,
    resolvedAuth: resolvedCredentials,
    errorHint: "Fix: pass --token or --password with --url (or gatewayToken in tools).",
    configPath: context.configPath,
  });
  ensureRemoteModeUrlConfigured(context);
  const connectionDetails = buildGatewayConnectionDetails({
    config: context.config,
    url: context.urlOverride,
    urlSource: context.urlOverrideSource,
    ignoreEnvUrlOverride: opts.localPortOverride !== void 0 || opts.ignoreEnvUrlOverride === true,
    localPortOverride: opts.localPortOverride,
    ...(opts.configPath ? { configPath: opts.configPath } : {}),
  });
  const url = connectionDetails.url;
  const tlsFingerprint = await resolveGatewayTlsFingerprint({
    opts,
    context,
    url,
  });
  const token = useStoredDeviceAuth ? void 0 : resolvedCredentials.token;
  const password = useStoredDeviceAuth ? void 0 : resolvedCredentials.password;
  const authMode = resolveGatewayCallAuth(context.config).mode;
  const omitDeviceIdentity = shouldOmitDeviceIdentityForGatewayCall({
    opts,
    url,
    authMode,
    token,
    password,
    allowAuthNone: opts.requireLocalBackendSharedAuth === true && authMode === "none",
  });
  if (opts.requireLocalBackendSharedAuth && !omitDeviceIdentity)
    throw new GatewayLocalBackendSharedAuthUnavailableError(
      "local backend shared auth requires a loopback gateway with token/password credentials or auth mode none",
    );
  const deviceIdentity =
    opts.deviceIdentity === void 0
      ? omitDeviceIdentity
        ? null
        : resolveDeviceIdentityForGatewayCall()
      : opts.deviceIdentity;
  if (useStoredDeviceAuth) {
    const storedAuth = loadStoredOperatorDeviceAuthToken(deviceIdentity);
    if (!storedAuth?.token)
      throw new GatewayCredentialsRequiredError({
        method: opts.method,
        configPath: context.configPath,
      });
    if (
      Array.isArray(opts.requiredStoredDeviceAuthScopes) &&
      !roleScopesAllow({
        role: "operator",
        requestedScopes: opts.requiredStoredDeviceAuthScopes,
        allowedScopes: storedAuth.scopes,
      })
    )
      throw new GatewayStoredDeviceAuthUnavailableError(
        "stored device auth does not grant the required operator scopes",
      );
  }
  ensureGatewayCallCanAuthenticate({
    opts,
    context,
    token,
    password,
    deviceIdentity,
  });
  return await executeGatewayRequestWithScopes({
    opts,
    scopes: useStoredDeviceAuth ? void 0 : scopes,
    url,
    token,
    password,
    tlsFingerprint,
    preauthHandshakeTimeoutMs: context.config.gateway?.handshakeTimeoutMs,
    timeoutMs,
    startupTimeoutMs,
    safeTimerTimeoutMs,
    connectionDetails,
    deviceIdentity,
    surfaceGatewayClientRequestErrors:
      useStoredDeviceAuth ||
      opts.requireLocalBackendSharedAuth === true ||
      Boolean(opts.agentRuntimeIdentityToken),
  });
}
async function buildGatewayProbeConnectionDetails(opts = {}) {
  const callOpts = {
    ...opts,
    method: "status",
  };
  const context = await resolveGatewayCallContext(callOpts);
  ensureRemoteModeUrlConfigured(context);
  const connectionDetails = buildGatewayConnectionDetails({
    config: context.config,
    url: context.urlOverride,
    urlSource: context.urlOverrideSource,
    ignoreEnvUrlOverride: opts.localPortOverride !== void 0 || opts.ignoreEnvUrlOverride === true,
    localPortOverride: opts.localPortOverride,
    ...(opts.configPath ? { configPath: opts.configPath } : {}),
  });
  const tlsFingerprint = await resolveGatewayTlsFingerprint({
    opts: callOpts,
    context,
    url: connectionDetails.url,
  });
  return {
    ...connectionDetails,
    ...(tlsFingerprint ? { tlsFingerprint } : {}),
    ...(context.config.gateway?.handshakeTimeoutMs
      ? { preauthHandshakeTimeoutMs: context.config.gateway.handshakeTimeoutMs }
      : {}),
  };
}
async function callGatewayCli(opts) {
  return await callGatewayWithScopes(
    opts,
    Array.isArray(opts.scopes)
      ? opts.scopes
      : isGatewayMethodClassified(opts.method)
        ? resolveLeastPrivilegeOperatorScopesForMethod(opts.method, opts.params)
        : CLI_DEFAULT_OPERATOR_SCOPES,
  );
}
async function callGatewayLeastPrivilege(opts) {
  return await callGatewayWithScopes(
    opts,
    resolveLeastPrivilegeOperatorScopesForMethod(opts.method, opts.params),
  );
}
async function callGateway(opts) {
  const callerMode = opts.mode ?? GATEWAY_CLIENT_MODES.BACKEND;
  const callerName = opts.clientName ?? GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT;
  if (callerMode === GATEWAY_CLIENT_MODES.CLI || callerName === GATEWAY_CLIENT_NAMES.CLI)
    return await callGatewayCli(opts);
  if (Array.isArray(opts.scopes))
    return await callGatewayWithScopes(
      {
        ...opts,
        mode: callerMode,
        clientName: callerName,
      },
      opts.scopes,
    );
  return await callGatewayLeastPrivilege({
    ...opts,
    mode: callerMode,
    clientName: callerName,
  });
}
function randomIdempotencyKey() {
  return randomUUID();
}
//#endregion
export {
  randomIdempotencyKey as _,
  GatewayTransportError as a,
  readGatewayDispatchConfig as b,
  callGateway as c,
  ensureExplicitGatewayAuth as d,
  formatGatewayClientRequestErrorJson as f,
  isGatewayTransportError as g,
  isGatewayExplicitAuthRequiredError as h,
  GatewayStoredDeviceAuthUnavailableError as i,
  callGatewayCli as l,
  isGatewayCredentialsRequiredError as m,
  GatewayExplicitAuthRequiredError as n,
  buildGatewayConnectionDetails as o,
  formatGatewayTransportErrorJson as p,
  GatewayLocalBackendSharedAuthUnavailableError as r,
  buildGatewayProbeConnectionDetails as s,
  GatewayCredentialsRequiredError as t,
  callGatewayLeastPrivilege as u,
  resolveExplicitGatewayAuth as v,
  readGatewayDispatchConfigWithShellEnvFallback as x,
  testing as y,
};
