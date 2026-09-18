import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import path from "node:path";
import "./errors-BoHeli7m.js";
import {
  n as shouldDetachChildForProcessTree,
  r as signalChildProcessTree,
  t as forceKillChildProcessTree,
} from "./child-process-tree-10JBMlVM.js";
import { r as toErrorObject } from "./error-coercion-CrJRoLe1.js";
import { d as isNonSecretApiKeyMarker } from "./model-auth-markers-CA2Xy59Z.js";
import {
  A as resolvePositiveTimerTimeoutMs,
  d as clampPositiveTimerTimeoutMs,
} from "./number-coercion-CJQ8TR--.js";
import {
  i as getModelProviderRequestTransport,
  n as attachModelProviderRequestTransport,
} from "./provider-request-config-DpW-uV6A.js";
import { c as redactSensitiveText, r as isSensitiveFieldKey } from "./redact-CUe6Oey5.js";
import {
  i as mintSecretSentinel,
  o as swapSecretSentinelsInText,
  r as looksLikeSecretSentinel,
} from "./sentinel-Ccb6pnS1.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
//#region src/agents/provider-secret-egress.ts
function protectRuntimeAuthValue(params) {
  if (!params.value) return params.value;
  return looksLikeSecretSentinel(params.value)
    ? params.value
    : mintSecretSentinel(params.value, { label: `model-auth:${params.provider}:${params.label}` });
}
/** Re-sentinels credentials returned by a provider auth exchange. */
function protectPreparedProviderRuntimeAuth(params) {
  const { preparedAuth } = params;
  if (!preparedAuth) return;
  const protect = (value, label) =>
    !value || isNonSecretApiKeyMarker(value)
      ? value
      : protectRuntimeAuthValue({
          value,
          provider: params.provider,
          label,
        });
  const request = preparedAuth.request;
  const headers = request?.headers
    ? Object.fromEntries(
        Object.entries(request.headers).map(([name, value]) => [
          name,
          protect(value, `runtime-header:${name.toLowerCase()}`),
        ]),
      )
    : void 0;
  const auth = request?.auth;
  const protectedAuth =
    auth?.mode === "authorization-bearer"
      ? {
          ...auth,
          token: protect(auth.token, "runtime-bearer"),
        }
      : auth?.mode === "header"
        ? {
            ...auth,
            value: protect(auth.value, `runtime-auth-header:${auth.headerName.toLowerCase()}`),
          }
        : auth;
  return {
    ...preparedAuth,
    apiKey: protect(preparedAuth.apiKey, "runtime-api-key"),
    ...(request
      ? {
          request: {
            ...request,
            ...(headers ? { headers } : {}),
            ...(protectedAuth ? { auth: protectedAuth } : {}),
          },
        }
      : {}),
  };
}
function unwrapSecretSentinelsForProviderEgress(value, boundary) {
  const swapped = swapSecretSentinelsInText(value);
  const unknown = swapped.unknown[0];
  if (unknown)
    throw new Error(
      `Secret sentinel ${unknown} is not registered in this process; refusing ${boundary}`,
    );
  return swapped.text;
}
function unwrapHeaderSentinelsForProviderEgress(input, boundary) {
  let headers;
  for (const [name, value] of Object.entries(input)) {
    if (typeof value !== "string") continue;
    const resolved = unwrapSecretSentinelsForProviderEgress(value, boundary);
    if (resolved !== value) {
      headers ??= { ...input };
      headers[name] = resolved;
    }
  }
  return headers ? headers : input;
}
function unwrapHeadersInitSentinelsForProviderEgress(input, boundary) {
  if (!input) return input;
  const headers = new Headers(input);
  let changed = false;
  for (const [name, value] of headers) {
    const resolved = unwrapSecretSentinelsForProviderEgress(value, boundary);
    if (resolved !== value) {
      headers.set(name, resolved);
      changed = true;
    }
  }
  return changed ? headers : input;
}
function unwrapRequestTransportSentinelsForProviderEgress(request, boundary) {
  if (!request) return request;
  const headers = request.headers
    ? unwrapHeaderSentinelsForProviderEgress(request.headers, boundary)
    : request.headers;
  let auth = request.auth;
  if (auth?.mode === "authorization-bearer") {
    const token = unwrapSecretSentinelsForProviderEgress(auth.token, boundary);
    if (token !== auth.token)
      auth = {
        ...auth,
        token,
      };
  } else if (auth?.mode === "header") {
    const value = unwrapSecretSentinelsForProviderEgress(auth.value, boundary);
    if (value !== auth.value)
      auth = {
        ...auth,
        value,
      };
  }
  if (headers === request.headers && auth === request.auth) return request;
  return {
    ...request,
    ...(headers ? { headers } : {}),
    ...(auth ? { auth } : {}),
  };
}
function unwrapModelHeaderSentinelsForProviderEgress(model, boundary) {
  const headers = model.headers
    ? unwrapHeaderSentinelsForProviderEgress(model.headers, boundary)
    : model.headers;
  const request = getModelProviderRequestTransport(model);
  const unwrappedRequest = unwrapRequestTransportSentinelsForProviderEgress(request, boundary);
  if (headers === model.headers && unwrappedRequest === request) return model;
  const next =
    headers === model.headers
      ? { ...model }
      : {
          ...model,
          headers,
        };
  return unwrappedRequest === request
    ? next
    : attachModelProviderRequestTransport(next, unwrappedRequest);
}
//#endregion
//#region src/agents/provider-local-service.ts
/**
 * Manages optional local provider sidecar processes attached to models. Leases
 * keep shared services alive while requests run and stop them after idle.
 */
const log = createSubsystemLogger("provider-local-service");
const DEFAULT_READY_TIMEOUT_MS = 12e4;
const DEFAULT_PROBE_TIMEOUT_MS = 2e3;
const PROBE_INTERVAL_MS = 250;
const LOCAL_SERVICE_OUTPUT_TAIL_MAX_BYTES = 8 * 1024;
const MODEL_PROVIDER_LOCAL_SERVICE_SYMBOL = Symbol.for("openclaw.modelProviderLocalService");
const services = /* @__PURE__ */ new Map();
let exitHandlerInstalled = false;
/** Bind local-service acquisition to a host-owned config snapshot. */
function createConfiguredProviderLocalServiceAcquirer(getConfig) {
  return async (target, signal) => {
    const provider = getConfig().models?.providers?.[target.providerId];
    const service = provider?.localService;
    if (!service) return;
    if (!isConfiguredProviderBaseUrl(target.baseUrl, readConfiguredProviderBaseUrl(provider)))
      throw new Error(
        `Local service target must match models.providers.${target.providerId}.baseUrl`,
      );
    return await ensureProviderLocalService(
      {
        ...target,
        service,
      },
      signal,
    );
  };
}
function readConfiguredProviderBaseUrl(provider) {
  const canonical = provider?.baseUrl?.trim();
  if (canonical) return canonical;
  const alternate = provider?.baseURL;
  return typeof alternate === "string" && alternate.trim() ? alternate.trim() : void 0;
}
function normalizeProviderBaseUrl(value) {
  const trimmed = value.trim();
  const candidates = /^[a-z][a-z\d+.-]*:\/\//iu.test(trimmed) ? [trimmed] : [`http://${trimmed}`];
  for (const candidate of candidates)
    try {
      const url = new URL(candidate);
      if (url.protocol !== "http:" && url.protocol !== "https:") continue;
      url.search = "";
      url.hash = "";
      url.pathname = url.pathname.replace(/\/+$/u, "") || "/";
      return url.toString().replace(/\/$/u, "");
    } catch {
      continue;
    }
}
function configuredProviderBaseUrlVariants(value) {
  const normalized = normalizeProviderBaseUrl(value);
  if (!normalized) return /* @__PURE__ */ new Set();
  const withoutOpenAiPath = normalized.replace(/\/v1$/iu, "");
  return /* @__PURE__ */ new Set([normalized, withoutOpenAiPath, `${withoutOpenAiPath}/v1`]);
}
function isLoopbackProviderBaseUrl(value) {
  const normalized = normalizeProviderBaseUrl(value);
  if (!normalized) return false;
  const hostname = new URL(normalized).hostname.toLowerCase();
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]";
}
function isConfiguredProviderBaseUrl(targetBaseUrl, configuredBaseUrl) {
  const target = normalizeProviderBaseUrl(targetBaseUrl);
  if (!target) return false;
  const configured = configuredBaseUrl?.trim();
  return configured
    ? configuredProviderBaseUrlVariants(configured).has(target)
    : isLoopbackProviderBaseUrl(target);
}
/** Attach local-service startup metadata to a model without mutating the original object. */
function attachModelProviderLocalService(model, service) {
  if (!service) return model;
  const next = { ...model };
  next[MODEL_PROVIDER_LOCAL_SERVICE_SYMBOL] = service;
  return next;
}
/** Read local-service startup metadata attached to a model. */
function getModelProviderLocalService(model) {
  return model[MODEL_PROVIDER_LOCAL_SERVICE_SYMBOL];
}
/** Ensure a model's local provider service is healthy and return a lease. */
async function ensureModelProviderLocalService(model, probeHeaders, signal) {
  const service = getModelProviderLocalService(model);
  return await ensureProviderLocalService(
    {
      providerId: model.provider,
      baseUrl: model.baseUrl,
      headers: buildHealthProbeHeaders(model.headers, probeHeaders),
      service,
    },
    signal,
  );
}
/** Ensure a provider endpoint's local service is healthy and return a request lease. */
async function ensureProviderLocalService(target, signal) {
  const service = target.service;
  if (!service) return;
  throwIfAborted(signal);
  validateLocalServiceConfig(service, target.providerId);
  const healthUrl = resolveHealthUrl(service, target.baseUrl);
  const healthHeaders = buildHealthProbeHeaders(target.headers, void 0);
  const key = localServiceKey(target.providerId, service, healthUrl);
  installExitHandler();
  const managed = services.get(key) ?? { active: 0 };
  services.set(key, managed);
  clearIdleTimer(managed);
  managed.active += 1;
  let released = false;
  const release = () => {
    if (released) return;
    released = true;
    managed.active = Math.max(0, managed.active - 1);
    scheduleIdleStop(key, managed, service);
  };
  try {
    if (
      managed.process &&
      !hasLocalServiceProcessExited(managed.process) &&
      (await probeHealth(healthUrl, healthHeaders, signal))
    )
      return { release };
    if (!managed.starting) {
      const startupAbort = new AbortController();
      managed.startupAbort = startupAbort;
      managed.starting = startAndWaitForLocalService({
        provider: target.providerId,
        service,
        healthUrl,
        healthHeaders,
        managed,
        signal: startupAbort.signal,
      }).finally(() => {
        managed.starting = void 0;
        if (managed.startupAbort === startupAbort) managed.startupAbort = void 0;
      });
    }
    await waitForAbort(managed.starting, signal);
    if (!managed.process || hasLocalServiceProcessExited(managed.process)) {
      release();
      return;
    }
    return { release };
  } catch (error) {
    const abortingStartup = isAbortForSignal(error, signal) && Boolean(managed.starting);
    release();
    if (isAbortForSignal(error, signal)) {
      if (abortingStartup && managed.active === 0) {
        managed.startupAbort?.abort(toAbortError(signal));
        stopManagedService(key, managed, "startup-aborted");
      }
    } else stopManagedService(key, managed, "startup-failed");
    throw error;
  }
}
/** Stop all managed local services and clear process state for tests. */
function stopManagedProviderLocalServicesForTest() {
  for (const [key, managed] of services) stopManagedService(key, managed, "test");
  services.clear();
}
/** Return bounded local-service state for focused lifecycle tests. */
function getManagedProviderLocalServiceDiagnosticsForTest() {
  return structuredClone(
    [...services.values()]
      .map((managed) => managed.diagnostics)
      .filter((value) => value !== void 0),
  );
}
function validateLocalServiceConfig(service, provider) {
  if (!path.isAbsolute(service.command))
    throw new Error(`models.providers.${provider}.localService.command must be an absolute path`);
}
function resolveHealthUrl(service, baseUrl) {
  const configured = service.healthUrl?.trim();
  if (configured) return configured;
  return `${baseUrl.replace(/\/+$/, "")}/models`;
}
function localServiceKey(provider, service, healthUrl) {
  return JSON.stringify({
    provider,
    command: service.command,
    args: service.args ?? [],
    cwd: service.cwd ?? "",
    envHash: hashStringRecord(service.env),
    healthUrl,
  });
}
function hashStringRecord(record) {
  const sorted = Object.entries(record ?? {}).toSorted(([left], [right]) =>
    left.localeCompare(right),
  );
  return createHash("sha256").update(JSON.stringify(sorted)).digest("hex");
}
function buildHealthProbeHeaders(providerHeaders, requestHeaders) {
  const headers = new Headers();
  const appendHeaders = (input) => {
    if (!input) return;
    for (const [key, value] of new Headers(input))
      if (value.trim().length > 0 && value.trim().toLowerCase() !== "null") headers.set(key, value);
  };
  appendHeaders(providerHeaders);
  appendHeaders(requestHeaders);
  return [...headers].length > 0 ? headers : void 0;
}
async function probeHealth(url, headers, signal) {
  throwIfAborted(signal);
  const egressHeaders = unwrapHeadersInitSentinelsForProviderEgress(
    headers,
    "to probe local model provider health",
  );
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_PROBE_TIMEOUT_MS);
  timeout.unref?.();
  const onAbort = () => controller.abort(toAbortError(signal));
  signal?.addEventListener("abort", onAbort, { once: true });
  let response;
  try {
    response = await fetch(url, {
      headers: egressHeaders,
      signal: controller.signal,
    });
    return response.ok;
  } catch {
    if (signal?.aborted) throw toAbortError(signal);
    return false;
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener("abort", onAbort);
    await response?.body?.cancel?.().catch(() => void 0);
  }
}
async function startAndWaitForLocalService(params) {
  const { provider, service, healthUrl, healthHeaders, managed, signal } = params;
  if (await probeHealth(healthUrl, healthHeaders, signal)) return;
  if (managed.process && !hasLocalServiceProcessExited(managed.process)) {
    log.info(`restarting unhealthy ${provider} local service`);
    await stopManagedProcessForRestart(managed, signal);
  }
  const startedAt = Date.now();
  const diagnostics = {
    providerId: provider,
    healthUrl,
    startedAt,
    stdoutTail: "",
    stderrTail: "",
  };
  managed.diagnostics = diagnostics;
  throwIfAborted(signal);
  log.info(`starting ${provider} local service: ${service.command}`);
  managed.process = spawn(service.command, service.args ?? [], {
    cwd: service.cwd,
    env: service.env
      ? {
          ...process.env,
          ...service.env,
        }
      : process.env,
    stdio: ["ignore", "pipe", "pipe"],
    detached: shouldDetachChildForProcessTree(),
  });
  const child = managed.process;
  diagnostics.pid = child.pid;
  managed.lastExit = void 0;
  const captureStdout = (chunk) => {
    diagnostics.stdoutTail = appendLocalServiceOutputTail(
      diagnostics.stdoutTail,
      chunk,
      service.env,
      process.env,
      service.args,
      healthHeaders,
    );
  };
  const captureStderr = (chunk) => {
    diagnostics.stderrTail = appendLocalServiceOutputTail(
      diagnostics.stderrTail,
      chunk,
      service.env,
      process.env,
      service.args,
      healthHeaders,
    );
  };
  child.stdout?.on("data", captureStdout);
  child.stderr?.on("data", captureStderr);
  child.unref();
  child.once("exit", (code, signalLocal) => {
    const exit = {
      code,
      signal: signalLocal,
    };
    diagnostics.lastExit = exit;
    log.info(
      `${provider} local service exited: ${signalLocal ? `signal=${signalLocal}` : `code=${code ?? 0}`}`,
    );
    if (managed.process === child) {
      managed.lastExit = exit;
      managed.process = void 0;
    }
  });
  const spawnError = await waitForSpawnResult(child, signal);
  if (spawnError)
    throw new Error(
      `${provider} local service failed to start: ${spawnError.message}${formatLocalServiceDiagnosticTail(diagnostics)}`,
    );
  diagnostics.spawnedAt = Date.now();
  const readyTimeoutMs = resolvePositiveTimerTimeoutMs(
    service.readyTimeoutMs,
    DEFAULT_READY_TIMEOUT_MS,
  );
  const deadline = Date.now() + readyTimeoutMs;
  for (;;) {
    if (await probeHealth(healthUrl, healthHeaders, signal)) {
      diagnostics.readyAt = Date.now();
      diagnostics.lastHealthyAt = diagnostics.readyAt;
      diagnostics.stdoutTail = "";
      diagnostics.stderrTail = "";
      drainLocalServiceOutput(child);
      log.info(
        `${provider} local service ready: pid=${diagnostics.pid ?? "unknown"} spawnMs=${diagnostics.spawnedAt - startedAt} readyMs=${diagnostics.readyAt - startedAt}`,
      );
      return;
    }
    if (managed.lastExit)
      throw new Error(
        `${provider} local service exited before readiness with ${formatLocalServiceExit(managed.lastExit)}${formatLocalServiceDiagnosticTail(diagnostics)}`,
      );
    if (Date.now() >= deadline)
      throw new Error(`${provider} local service did not become ready at ${healthUrl}`);
    await sleep(PROBE_INTERVAL_MS, signal);
  }
}
function appendLocalServiceOutputTail(
  current,
  chunk,
  serviceEnv,
  inheritedEnv,
  serviceArgs,
  healthHeaders,
) {
  let redacted = redactSensitiveText(`${current}${chunk.toString()}`, { mode: "tools" });
  for (const value of Object.values(serviceEnv ?? {}))
    if (value) redacted = redacted.replaceAll(value, "[redacted]");
  for (const [key, value] of Object.entries(inheritedEnv))
    if (value && isSensitiveFieldKey(key)) redacted = redacted.replaceAll(value, "[redacted]");
  for (const value of serviceArgs ?? [])
    if (value) redacted = redacted.replaceAll(value, "[redacted]");
  for (const [, value] of new Headers(healthHeaders))
    if (value) redacted = redacted.replaceAll(value, "[redacted]");
  const bytes = Buffer.from(redacted);
  if (bytes.byteLength <= LOCAL_SERVICE_OUTPUT_TAIL_MAX_BYTES) return redacted;
  let start = bytes.byteLength - LOCAL_SERVICE_OUTPUT_TAIL_MAX_BYTES;
  while (start < bytes.byteLength) {
    const byte = bytes.at(start);
    if (byte === void 0 || (byte & 192) !== 128) break;
    start += 1;
  }
  return bytes.subarray(start).toString("utf8");
}
function unrefLocalServiceOutput(stream) {
  stream?.unref?.();
}
function drainLocalServiceOutput(child) {
  child.stdout?.removeAllListeners("data");
  child.stderr?.removeAllListeners("data");
  child.stdout?.resume();
  child.stderr?.resume();
  unrefLocalServiceOutput(child.stdout);
  unrefLocalServiceOutput(child.stderr);
}
function formatLocalServiceDiagnosticTail(diagnostics) {
  return diagnostics.stderrTail ? `; stderr: ${diagnostics.stderrTail}` : "";
}
function scheduleIdleStop(key, managed, service) {
  const idleStopMs = clampPositiveTimerTimeoutMs(service.idleStopMs);
  if (managed.active > 0) return;
  if (!managed.process) {
    if (!managed.starting) services.delete(key);
    return;
  }
  if (idleStopMs === void 0) return;
  managed.idleTimer = setTimeout(() => {
    if (managed.active === 0) stopManagedService(key, managed, "idle");
  }, idleStopMs);
  managed.idleTimer.unref?.();
}
function clearIdleTimer(managed) {
  if (managed.idleTimer) {
    clearTimeout(managed.idleTimer);
    managed.idleTimer = void 0;
  }
}
function stopManagedService(key, managed, reason) {
  clearIdleTimer(managed);
  managed.startupAbort?.abort(/* @__PURE__ */ new Error(`local service stopped: ${reason}`));
  managed.startupAbort = void 0;
  const child = managed.process;
  managed.process = void 0;
  managed.lastExit = void 0;
  services.delete(key);
  if (child) drainLocalServiceOutput(child);
  if (child && !hasLocalServiceProcessExited(child)) {
    log.info(`stopping local model service: reason=${reason}`);
    signalChildProcessTree(child, "SIGTERM");
  }
}
async function stopManagedProcessForRestart(managed, signal) {
  const child = managed.process;
  managed.process = void 0;
  managed.lastExit = void 0;
  if (!child || hasLocalServiceProcessExited(child)) return;
  drainLocalServiceOutput(child);
  signalChildProcessTree(child, "SIGTERM");
  await waitForChildExit(child, signal, DEFAULT_PROBE_TIMEOUT_MS);
  if (!hasLocalServiceProcessExited(child)) {
    forceKillChildProcessTree(child);
    await waitForChildExit(child, signal, DEFAULT_PROBE_TIMEOUT_MS);
  }
}
function formatLocalServiceExit(exit) {
  return exit.signal ? `signal ${exit.signal}` : `code ${exit.code ?? 0}`;
}
function installExitHandler() {
  if (exitHandlerInstalled) return;
  exitHandlerInstalled = true;
  process.once("exit", () => {
    for (const [key, managed] of services) stopManagedService(key, managed, "process-exit");
  });
}
function toAbortError(signal) {
  if (signal?.reason instanceof Error) return signal.reason;
  const error = /* @__PURE__ */ new Error("The operation was aborted.");
  error.name = "AbortError";
  return error;
}
function throwIfAborted(signal) {
  if (signal?.aborted) throw toAbortError(signal);
}
function isAbortForSignal(error, signal) {
  return (
    Boolean(signal?.aborted) &&
    (error === signal?.reason || (error instanceof Error && error.name === "AbortError"))
  );
}
function waitForAbort(promise, signal) {
  throwIfAborted(signal);
  if (!signal) return promise;
  return new Promise((resolve, reject) => {
    const onAbort = () => {
      cleanup();
      reject(toAbortError(signal));
    };
    const cleanup = () => signal.removeEventListener("abort", onAbort);
    signal.addEventListener("abort", onAbort, { once: true });
    promise.then(
      (value) => {
        cleanup();
        resolve(value);
      },
      (error) => {
        cleanup();
        reject(toErrorObject(error, "Non-Error rejection"));
      },
    );
  });
}
function sleep(ms, signal) {
  throwIfAborted(signal);
  return new Promise((resolve, reject) => {
    const cleanup = () => signal?.removeEventListener("abort", onAbort);
    const onDone = () => {
      cleanup();
      resolve();
    };
    const onAbort = () => {
      clearTimeout(timeout);
      cleanup();
      reject(toAbortError(signal));
    };
    const timeout = setTimeout(onDone, ms);
    timeout.unref?.();
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}
function waitForSpawnResult(child, signal) {
  throwIfAborted(signal);
  return new Promise((resolve) => {
    let settled = false;
    const finish = (error) => {
      if (settled) return;
      settled = true;
      child.off("error", onError);
      child.off("spawn", onSpawn);
      signal?.removeEventListener("abort", onAbort);
      resolve(error);
    };
    const onError = (error) => finish(error);
    const onSpawn = () => finish();
    const onAbort = () => finish(toAbortError(signal));
    child.once("error", onError);
    child.once("spawn", onSpawn);
    signal?.addEventListener("abort", onAbort, { once: true });
    setImmediate(() => {
      if (child.pid) finish();
    });
  });
}
function waitForChildExit(child, signal, timeoutMs) {
  if (hasLocalServiceProcessExited(child)) return Promise.resolve();
  throwIfAborted(signal);
  return new Promise((resolve, reject) => {
    const cleanup = () => {
      clearTimeout(timeout);
      child.off("exit", onExit);
      signal.removeEventListener("abort", onAbort);
    };
    const finish = () => {
      cleanup();
      resolve();
    };
    const onExit = () => finish();
    const onAbort = () => {
      cleanup();
      reject(toAbortError(signal));
    };
    const timeout = setTimeout(finish, timeoutMs);
    timeout.unref?.();
    child.once("exit", onExit);
    signal.addEventListener("abort", onAbort, { once: true });
  });
}
/** Return whether a child process has already reported an exit code or signal. */
function hasLocalServiceProcessExited(child) {
  return child.exitCode !== null || child.signalCode !== null;
}
//#endregion
export {
  getManagedProviderLocalServiceDiagnosticsForTest as a,
  stopManagedProviderLocalServicesForTest as c,
  unwrapModelHeaderSentinelsForProviderEgress as d,
  unwrapSecretSentinelsForProviderEgress as f,
  ensureProviderLocalService as i,
  protectPreparedProviderRuntimeAuth as l,
  createConfiguredProviderLocalServiceAcquirer as n,
  getModelProviderLocalService as o,
  ensureModelProviderLocalService as r,
  hasLocalServiceProcessExited as s,
  attachModelProviderLocalService as t,
  unwrapHeaderSentinelsForProviderEgress as u,
};
