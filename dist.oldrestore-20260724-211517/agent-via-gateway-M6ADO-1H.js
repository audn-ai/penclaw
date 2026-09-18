import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { TextDecoder } from "node:util";
import "./parse-finite-number-Z7n6tXLk.js";
import { t as createAbortError } from "./abort-signal-DEbc_zqk.js";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import { c as resolveDefaultAgentId, n as listAgentIds } from "./agent-scope-config-DVIR1nBa.js";
import {
  _ as randomIdempotencyKey,
  b as readGatewayDispatchConfig,
  c as callGateway,
  g as isGatewayTransportError,
  h as isGatewayExplicitAuthRequiredError,
  m as isGatewayCredentialsRequiredError,
  x as readGatewayDispatchConfigWithShellEnvFallback,
} from "./call-BVMO6az_.js";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-Br1guPTt.js";
import { t as formatCliCommand } from "./command-format-H_Arqann.js";
import { a as routeLogsToStderr } from "./console-CspqtrUy.js";
import { n as isGatewaySecretRefUnavailableError } from "./credentials-DqHTozxM.js";
import { r as createLazyPromiseLoader } from "./lazy-promise-EhsWch5m.js";
import { i as normalizeMessageChannel } from "./message-channel-normalize-Be6uJOzO.js";
import {
  j as resolveTimerTimeoutMs,
  y as parseStrictNonNegativeInteger,
} from "./number-coercion-CJQ8TR--.js";
import { t as ADMIN_SCOPE } from "./operator-scopes-CpPJIv7P.js";
import { r as withProgress } from "./progress-DXZjrYcT.js";
import { i as writeRuntimeJson } from "./runtime-Bz6o617W.js";
import {
  c as isUnscopedSessionKeySentinel,
  d as resolveAgentIdFromSessionKey,
  h as scopeLegacySessionKeyToAgent,
  s as classifySessionKeyShape,
} from "./session-key-druuY-GG.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region src/commands/agent-via-gateway.ts
const NO_GATEWAY_TIMEOUT_MS = 2147e6;
const EMBEDDED_FALLBACK_META = {
  transport: "embedded",
  fallbackFrom: "gateway",
};
const GATEWAY_TIMEOUT_FALLBACK_SESSION_PREFIX = "gateway-fallback-";
const GATEWAY_TRANSIENT_CONNECT_RETRY_DELAYS_MS = [1e3, 2e3, 5e3, 1e4, 15e3];
const AGENT_CLI_SIGNALS = ["SIGINT", "SIGTERM"];
const GATEWAY_ABORT_RETRY_DELAYS_MS = [50, 150, 300, 600];
const GATEWAY_ABORT_REQUEST_TIMEOUT_MS = 2e3;
const AGENT_CLI_SIGNAL_EXIT_CODES = {
  SIGINT: 130,
  SIGTERM: 143,
};
const MESSAGE_FILE_DECODER = new TextDecoder("utf-8", { fatal: true });
const defaultAgentSessionModuleLoader = () => import("./session-BalR2Ww4.js");
let agentSessionModuleLoader = defaultAgentSessionModuleLoader;
const embeddedAgentCommandLoader = createLazyPromiseLoader(
  () => import("./agent-D-AQu_eG.js").then((module) => module.agentCommand),
  { cacheRejections: true },
);
const agentSessionModuleCache = createLazyPromiseLoader(() => agentSessionModuleLoader(), {
  cacheRejections: true,
});
const runtimeConfigModuleLoader = createLazyPromiseLoader(() => import("./io-CThf_xQw.js"), {
  cacheRejections: true,
});
const replyPayloadModuleLoader = createLazyPromiseLoader(
  () => import("./plugin-sdk/reply-payload.js"),
  { cacheRejections: true },
);
function resolveGatewayAbortRetryDelaysMs() {
  return GATEWAY_ABORT_RETRY_DELAYS_MS;
}
const loadEmbeddedAgentCommand = embeddedAgentCommandLoader.load;
const loadAgentSessionModule = agentSessionModuleCache.load;
async function loadRuntimeConfig() {
  const { getRuntimeConfig } = await runtimeConfigModuleLoader.load();
  return getRuntimeConfig();
}
const loadReplyPayloadModule = replyPayloadModuleLoader.load;
function protectJsonStdout(opts) {
  if (opts.json === true) routeLogsToStderr();
}
function missingAgentMessageError() {
  return /* @__PURE__ */ new Error(
    `Missing message. Use ${formatCliCommand('openclaw agent --message "..." --agent <id>')} or ${formatCliCommand("openclaw agent --message-file <path> --agent <id>")}.`,
  );
}
function formatMessageFileReadFailure(messageFile, err) {
  const code = typeof err?.code === "string" ? err.code : "";
  if (code === "ENOENT") return `Message file not found: ${messageFile}`;
  if (code === "EISDIR") return `Message file is a directory: ${messageFile}`;
  return `Unable to read message file ${messageFile}: ${err instanceof Error ? err.message : String(err)}`;
}
async function readAgentMessageFile(messageFile) {
  let buffer;
  try {
    buffer = await readFile(messageFile);
  } catch (err) {
    throw new Error(formatMessageFileReadFailure(messageFile, err), { cause: err });
  }
  try {
    return MESSAGE_FILE_DECODER.decode(buffer).replace(/^\uFEFF/, "");
  } catch {
    throw new Error(`Message file must be valid UTF-8: ${messageFile}`);
  }
}
async function resolveAgentMessageOpts(opts) {
  const { messageFile: rawMessageFile, ...rest } = opts;
  const messageFile = rawMessageFile?.trim();
  if (opts.message !== void 0 && messageFile)
    throw new Error("Use either --message or --message-file, not both.");
  if (rawMessageFile !== void 0 && !messageFile)
    throw new Error("--message-file must not be empty.");
  if (messageFile) {
    const message = await readAgentMessageFile(messageFile);
    if (!message.trim()) throw new Error(`Message file is empty: ${messageFile}`);
    return {
      ...rest,
      message,
    };
  }
  const message = opts.message ?? "";
  if (!message.trim()) throw missingAgentMessageError();
  return {
    ...rest,
    message,
  };
}
function parseTimeoutSeconds(opts) {
  const raw =
    opts.timeout !== void 0
      ? parseStrictNonNegativeInteger(opts.timeout)
      : (opts.cfg.agents?.defaults?.timeoutSeconds ?? 600);
  if (raw === void 0)
    throw new Error(
      `Invalid --timeout. Use seconds as a non-negative integer, for example --timeout 600. Use --timeout 0 to disable the timeout.`,
    );
  return raw;
}
function resolveGatewayAgentTimeoutMs(timeoutSeconds) {
  if (timeoutSeconds === 0) return NO_GATEWAY_TIMEOUT_MS;
  return resolveTimerTimeoutMs((timeoutSeconds + 30) * 1e3, 1e4, 1e4);
}
async function getGatewayDispatchConfig(options) {
  if (options?.skipShellEnvFallback === false)
    return await readGatewayDispatchConfigWithShellEnvFallback();
  return readGatewayDispatchConfig();
}
async function formatPayloadForLog(payload) {
  const { resolveSendableOutboundReplyParts } = await loadReplyPayloadModule();
  const parts = resolveSendableOutboundReplyParts({
    text: payload.text,
    mediaUrls: payload.mediaUrls,
    mediaUrl: typeof payload.mediaUrl === "string" ? payload.mediaUrl : void 0,
  });
  const lines = [];
  if (parts.text) lines.push(parts.text.trimEnd());
  for (const url of parts.mediaUrls) lines.push(`Attachment: ${url}`);
  return lines.join("\n").trimEnd();
}
function isGatewayAgentTimeoutError(err) {
  if (isGatewayTransportError(err)) return err.kind === "timeout";
  return err instanceof Error && err.message.includes("gateway request timeout for agent");
}
function isCompactControlCommand(message) {
  return /^\/compact(?:\s|:|$)/iu.test(message.trim());
}
function isSessionResetCommand(message) {
  return /^\/(?:new|reset)(?:\s|$)/i.test(message.trim());
}
function shouldRetryGatewayDispatchWithShellEnvFallback(err) {
  return (
    isGatewayCredentialsRequiredError(err) ||
    isGatewayExplicitAuthRequiredError(err) ||
    isGatewaySecretRefUnavailableError(err)
  );
}
function isGatewayAgentEmbeddedFallbackError(err) {
  return isGatewayTransportError(err);
}
function isTransientGatewayAgentConnectClose(err) {
  if (!isGatewayTransportError(err) || err.kind !== "closed") return false;
  const code = typeof err.code === "number" ? err.code : void 0;
  const reason = normalizeOptionalString(err.reason);
  return code === 1e3 && (!reason || reason === "no close reason");
}
function validateExplicitSessionKeyForDispatch(opts) {
  const sessionKey = opts.sessionKey?.trim();
  if (!sessionKey) return;
  if (classifySessionKeyShape(sessionKey) === "malformed_agent")
    throw new Error(
      `Invalid --session-key "${sessionKey}". Agent-prefixed session keys must use agent:<agent-id>:<session-key>.`,
    );
  const agentIdRaw = opts.agent?.trim() || void 0;
  if (!agentIdRaw || classifySessionKeyShape(sessionKey) !== "agent") return;
  const agentId = normalizeAgentId(agentIdRaw);
  const sessionAgentId = resolveAgentIdFromSessionKey(sessionKey);
  if (sessionAgentId !== agentId)
    throw new Error(
      `Agent id "${agentIdRaw}" does not match session key agent "${sessionAgentId}".`,
    );
}
async function normalizeSessionKeyOptsForDispatch(opts) {
  const rawSessionKey = opts.sessionKey?.trim();
  const rawTo = opts.to?.trim();
  if (!rawSessionKey && !opts.sessionId?.trim() && classifySessionKeyShape(rawTo) === "agent")
    return {
      ...opts,
      to: void 0,
      sessionKey: rawTo,
    };
  const isLegacySessionKey =
    rawSessionKey && classifySessionKeyShape(rawSessionKey) === "legacy_or_alias";
  const agentIdRaw = opts.agent?.trim();
  const shouldScopeDefaultAgentKey =
    isLegacySessionKey && !agentIdRaw && !isUnscopedSessionKeySentinel(rawSessionKey);
  const cfg =
    isLegacySessionKey && (agentIdRaw || shouldScopeDefaultAgentKey)
      ? opts.local === true
        ? await loadRuntimeConfig()
        : await getGatewayDispatchConfig()
      : void 0;
  const sessionKey = scopeLegacySessionKeyToAgent({
    agentId: agentIdRaw ?? (shouldScopeDefaultAgentKey ? resolveDefaultAgentId(cfg) : void 0),
    sessionKey: opts.sessionKey,
    mainKey: cfg?.session?.mainKey,
  });
  if (sessionKey === opts.sessionKey) return opts;
  return {
    ...opts,
    sessionKey,
  };
}
function isAbortError(err) {
  return err instanceof Error && err.name === "AbortError";
}
function readAcceptedRunContext(payload) {
  if (!payload || typeof payload !== "object") return {};
  const runId = payload.runId;
  const sessionKey = payload.sessionKey;
  if (payload.status !== "accepted") return {};
  return {
    runId: typeof runId === "string" && runId.trim() ? runId.trim() : void 0,
    sessionKey: typeof sessionKey === "string" && sessionKey.trim() ? sessionKey.trim() : void 0,
  };
}
function createAgentCliSignalBridge(processLike = process) {
  const controller = new AbortController();
  let receivedSignal;
  const handlers = /* @__PURE__ */ new Map();
  const detachHandlers = () => {
    for (const [signal, handler] of handlers) processLike.off(signal, handler);
    handlers.clear();
  };
  for (const signal of AGENT_CLI_SIGNALS) {
    const handler = () => {
      receivedSignal = signal;
      if (!controller.signal.aborted) {
        controller.abort();
        detachHandlers();
      }
    };
    handlers.set(signal, handler);
    processLike.on(signal, handler);
  }
  return {
    signal: controller.signal,
    getReceivedSignal: () => receivedSignal,
    dispose: detachHandlers,
  };
}
function isAgentCliProcessLike(value) {
  return (
    Boolean(value) &&
    typeof value === "object" &&
    typeof value.on === "function" &&
    typeof value.off === "function"
  );
}
function resolveAgentCliProcessLike(deps) {
  if (!deps || !Object.hasOwn(deps, "process")) return process;
  const processLike = deps.process;
  return isAgentCliProcessLike(processLike) ? processLike : process;
}
function createAbortDelayError() {
  return createAbortError("gateway agent retry aborted");
}
function delayMs(ms, signal) {
  if (signal?.aborted) return Promise.reject(createAbortDelayError());
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    const onAbort = () => {
      clearTimeout(timer);
      signal?.removeEventListener("abort", onAbort);
      reject(createAbortDelayError());
    };
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}
function isConfirmedChatAbortResponseForRun(value, runId) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const response = value;
  if (response.aborted !== true) return false;
  if (response.runIds === void 0) return true;
  return Array.isArray(response.runIds) && response.runIds.includes(runId);
}
async function abortAcceptedGatewayAgentRunWithRequest(params) {
  if (!params.signal || !params.runId || !params.sessionKey) return false;
  try {
    if (
      isConfirmedChatAbortResponseForRun(
        await params.request(
          "chat.abort",
          {
            sessionKey: params.sessionKey,
            runId: params.runId,
          },
          { timeoutMs: GATEWAY_ABORT_REQUEST_TIMEOUT_MS },
        ),
        params.runId,
      )
    )
      return true;
    if (params.logFailure !== false)
      params.runtime.error?.(
        `Interrupted by ${params.signal}; Gateway run ${params.runId} was not confirmed aborted.`,
      );
    return false;
  } catch (err) {
    if (params.logFailure !== false)
      params.runtime.error?.(
        `Interrupted by ${params.signal}; failed to abort Gateway run ${params.runId}: ${String(err)}`,
      );
    return false;
  }
}
async function abortAcceptedGatewayAgentRunWithGatewayCall(params) {
  const request = async (method, requestParams, opts) =>
    await callGateway({
      method,
      params: requestParams,
      timeoutMs: opts?.timeoutMs ?? void 0,
      expectFinal: opts?.expectFinal,
      config: params.config,
      ...params.gatewayIdentity,
    });
  const retryDelaysMs = resolveGatewayAbortRetryDelaysMs();
  for (const [attempt, retryDelayMs] of [...retryDelaysMs, 0].entries()) {
    const isFinalAttempt = attempt === retryDelaysMs.length;
    if (
      (await abortAcceptedGatewayAgentRunWithRequest({
        runId: params.runId,
        sessionKey: params.sessionKey,
        signal: params.signal,
        runtime: params.runtime,
        request,
        logFailure: isFinalAttempt,
      })) ||
      isFinalAttempt
    )
      return;
    await delayMs(retryDelayMs);
  }
}
async function abortAcceptedGatewayAgentRunOnActiveConnection(params) {
  const retryDelaysMs = resolveGatewayAbortRetryDelaysMs();
  for (const [attempt, retryDelayMs] of [...retryDelaysMs, 0].entries()) {
    const isFinalAttempt = attempt === retryDelaysMs.length;
    const aborted = await abortAcceptedGatewayAgentRunWithRequest({
      runId: params.runId,
      sessionKey: params.sessionKey,
      signal: params.signal,
      runtime: params.runtime,
      request: params.request,
      logFailure: false,
    });
    if (aborted || isFinalAttempt) return aborted;
    await delayMs(retryDelayMs);
  }
  return false;
}
function exitForReceivedSignal(signal, runtime) {
  if (!signal) return false;
  runtime.exit(AGENT_CLI_SIGNAL_EXIT_CODES[signal]);
  return true;
}
function returnAfterSignalExit(value, signal, runtime) {
  return exitForReceivedSignal(signal, runtime) ? void 0 : value;
}
function createGatewayTimeoutFallbackSessionId() {
  return `${GATEWAY_TIMEOUT_FALLBACK_SESSION_PREFIX}${randomUUID()}`;
}
function createGatewayTimeoutFallbackSession(agentId) {
  const sessionId = createGatewayTimeoutFallbackSessionId();
  return {
    sessionId,
    sessionKey: `agent:${normalizeAgentId(agentId)}:explicit:${sessionId.trim()}`,
  };
}
async function resolveAgentIdForGatewayTimeoutFallback(opts) {
  const explicitSessionKey = opts.sessionKey?.trim();
  if (classifySessionKeyShape(explicitSessionKey) === "agent")
    return resolveAgentIdFromSessionKey(explicitSessionKey);
  if (isUnscopedSessionKeySentinel(explicitSessionKey))
    return resolveDefaultAgentId(await getGatewayDispatchConfig());
  const agentIdRaw = opts.agent?.trim();
  if (agentIdRaw) return normalizeAgentId(agentIdRaw);
  if (!opts.to && !opts.sessionId) return;
  const cfg = await getGatewayDispatchConfig();
  const { resolveSessionKeyForRequest } = await loadAgentSessionModule();
  const resolvedSessionKey = resolveSessionKeyForRequest({
    cfg,
    to: opts.to,
    sessionId: opts.sessionId,
  }).sessionKey;
  return classifySessionKeyShape(resolvedSessionKey) === "agent"
    ? resolveAgentIdFromSessionKey(resolvedSessionKey)
    : void 0;
}
function buildGatewayJsonResponse(response) {
  const deliveryStatus = response.result?.deliveryStatus;
  if (deliveryStatus === void 0) return response;
  return {
    ...response,
    deliveryStatus,
  };
}
function isInFlightGatewayAgentResponse(response) {
  return response.status === "in_flight";
}
function formatInFlightGatewayAgentMessage(response) {
  return response.runId
    ? `Agent run ${response.runId} is already in flight; not starting a duplicate run.`
    : "Agent run is already in flight; not starting a duplicate run.";
}
async function agentViaGatewayCommand(opts, runtime, signalBridge) {
  protectJsonStdout(opts);
  const body = opts.message;
  const explicitSessionKey = opts.sessionKey?.trim();
  if (!body.trim()) throw missingAgentMessageError();
  if (!opts.to && !opts.sessionId && !opts.agent && !explicitSessionKey)
    throw new Error(
      `No target session selected. Use --agent <id>, --session-key <key>, --session-id <id>, or --to <E.164>. Run ${formatCliCommand("openclaw agents list")} to see agents.`,
    );
  let cfg = await getGatewayDispatchConfig();
  const agentIdRaw = opts.agent?.trim();
  const agentId = agentIdRaw ? normalizeAgentId(agentIdRaw) : void 0;
  if (agentId) {
    if (!listAgentIds(cfg).includes(agentId))
      throw new Error(
        `Unknown agent id "${agentIdRaw}". Use "${formatCliCommand("openclaw agents list")}" to see configured agents.`,
      );
  }
  const timeoutSeconds = parseTimeoutSeconds({
    cfg,
    timeout: opts.timeout,
  });
  const gatewayTimeoutMs = resolveGatewayAgentTimeoutMs(timeoutSeconds);
  const channel = normalizeMessageChannel(opts.channel);
  const deferExplicitRecipientSession = Boolean(
    !explicitSessionKey &&
    !opts.sessionId?.trim() &&
    agentId &&
    channel &&
    channel !== "last" &&
    opts.to?.trim() &&
    classifySessionKeyShape(opts.to) !== "agent",
  );
  const sessionKey = deferExplicitRecipientSession
    ? void 0
    : classifySessionKeyShape(explicitSessionKey) === "agent"
      ? explicitSessionKey
      : (await loadAgentSessionModule()).resolveSessionKeyForRequest({
          cfg,
          agentId,
          to: opts.to,
          sessionId: opts.sessionId,
          sessionKey: explicitSessionKey,
        }).sessionKey;
  const abortSessionKey = deferExplicitRecipientSession
    ? (await loadAgentSessionModule()).resolveSessionKeyForRequest({
        cfg,
        agentId,
      }).sessionKey
    : sessionKey;
  const idempotencyKey = normalizeOptionalString(opts.runId) || randomIdempotencyKey();
  const modelOverride = normalizeOptionalString(opts.model);
  const needsAdminGatewayIdentity = Boolean(modelOverride) || isSessionResetCommand(body);
  const hasGatewayUrlOverride = Boolean(normalizeOptionalString(process.env.OPENCLAW_GATEWAY_URL));
  const usesRemoteGateway = cfg.gateway?.mode === "remote" || hasGatewayUrlOverride;
  const gatewayIdentity = needsAdminGatewayIdentity
    ? {
        clientName: GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT,
        mode: GATEWAY_CLIENT_MODES.BACKEND,
        scopes: [ADMIN_SCOPE],
      }
    : {
        clientName: GATEWAY_CLIENT_NAMES.CLI,
        mode: GATEWAY_CLIENT_MODES.CLI,
        ...(usesRemoteGateway ? {} : { scopes: [ADMIN_SCOPE] }),
      };
  let acceptedRunId = idempotencyKey;
  let acceptedSessionKey = abortSessionKey;
  let acceptedGatewayRun = false;
  let activeConnectionAbortAttempted = false;
  let activeConnectionAbortSucceeded = false;
  let response;
  const dispatchGatewayAgentCall = async (activeCfg) =>
    await withProgress(
      {
        label: "Waiting for agent reply…",
        indeterminate: true,
        enabled: opts.json !== true,
      },
      async () =>
        await callGateway({
          method: "agent",
          params: {
            message: body,
            agentId,
            model: modelOverride,
            to: opts.to,
            replyTo: opts.replyTo,
            sessionId: opts.sessionId,
            sessionKey,
            thinking: opts.thinking,
            deliver: Boolean(opts.deliver),
            channel,
            replyChannel: opts.replyChannel,
            replyAccountId: opts.replyAccount,
            bestEffortDeliver: opts.bestEffortDeliver,
            timeout: timeoutSeconds,
            lane: opts.lane,
            extraSystemPrompt: opts.extraSystemPrompt,
            cleanupBundleMcpOnRunEnd: true,
            idempotencyKey,
          },
          expectFinal: true,
          timeoutMs: gatewayTimeoutMs,
          config: activeCfg,
          signal: signalBridge.signal,
          onAccepted: (payload) => {
            acceptedGatewayRun = true;
            const accepted = readAcceptedRunContext(payload);
            acceptedRunId = accepted.runId ?? acceptedRunId;
            acceptedSessionKey = accepted.sessionKey ?? acceptedSessionKey;
          },
          onSignalAbort: async (request) => {
            activeConnectionAbortAttempted = true;
            activeConnectionAbortSucceeded = await abortAcceptedGatewayAgentRunOnActiveConnection({
              runId: acceptedRunId,
              sessionKey: acceptedSessionKey,
              signal: signalBridge.getReceivedSignal(),
              runtime,
              request,
            });
          },
          ...gatewayIdentity,
        }),
    );
  let shellEnvFallbackRetriesRemaining = 1;
  const consumeShellEnvFallbackRetry = () => shellEnvFallbackRetriesRemaining-- > 0;
  for (;;)
    try {
      response = await dispatchGatewayAgentCall(cfg);
      break;
    } catch (err) {
      if (
        !acceptedGatewayRun &&
        shouldRetryGatewayDispatchWithShellEnvFallback(err) &&
        consumeShellEnvFallbackRetry()
      ) {
        cfg = await getGatewayDispatchConfig({ skipShellEnvFallback: false });
        continue;
      }
      if (
        isAbortError(err) &&
        !activeConnectionAbortSucceeded &&
        (acceptedGatewayRun || activeConnectionAbortAttempted)
      )
        await abortAcceptedGatewayAgentRunWithGatewayCall({
          runId: acceptedRunId,
          sessionKey: acceptedSessionKey,
          signal: signalBridge.getReceivedSignal(),
          runtime,
          gatewayIdentity,
          config: cfg,
        });
      throw err;
    }
  if (!response) throw new Error("gateway agent call did not return a response");
  if (opts.json) {
    writeRuntimeJson(runtime, buildGatewayJsonResponse(response));
    return response;
  }
  const payloads = response?.result?.payloads ?? [];
  if (isInFlightGatewayAgentResponse(response)) {
    runtime.error?.(formatInFlightGatewayAgentMessage(response));
    return response;
  }
  if (payloads.length === 0) {
    if (response?.status !== "ok")
      runtime.log(response?.summary ? response.summary : "No reply from agent.");
    return response;
  }
  for (const payload of payloads) {
    const out = await formatPayloadForLog(payload);
    if (out) runtime.log(out);
  }
  return response;
}
async function agentViaGatewayCommandWithTransientRetries(opts, runtime, signalBridge) {
  for (const [attempt, retryDelayMs] of [...GATEWAY_TRANSIENT_CONNECT_RETRY_DELAYS_MS, 0].entries())
    try {
      return await agentViaGatewayCommand(opts, runtime, signalBridge);
    } catch (err) {
      if (isAbortError(err)) throw err;
      if (
        attempt === GATEWAY_TRANSIENT_CONNECT_RETRY_DELAYS_MS.length ||
        !isTransientGatewayAgentConnectClose(err)
      )
        throw err;
      runtime.error?.(
        `Gateway agent connection closed during handshake; retrying in ${retryDelayMs}ms before embedded fallback.`,
      );
      await delayMs(retryDelayMs, signalBridge.signal);
    }
  throw new Error("Gateway agent retry loop exhausted unexpectedly.");
}
async function agentCliCommand(opts, runtime, deps) {
  protectJsonStdout(opts);
  const messageOpts = await resolveAgentMessageOpts(opts);
  if (isCompactControlCommand(messageOpts.message)) {
    runtime.error?.(
      "Slash commands cannot be executed via --message from the CLI. Use: openclaw sessions compact <key>",
    );
    runtime.exit(1);
    return;
  }
  const dispatchOpts = await normalizeSessionKeyOptsForDispatch(messageOpts);
  validateExplicitSessionKeyForDispatch(dispatchOpts);
  const gatewayDispatchOpts = dispatchOpts.runId
    ? dispatchOpts
    : {
        ...dispatchOpts,
        runId: randomIdempotencyKey(),
      };
  const signalBridge = createAgentCliSignalBridge(resolveAgentCliProcessLike(deps));
  const localOpts = {
    ...gatewayDispatchOpts,
    agentId: gatewayDispatchOpts.agent,
    replyAccountId: gatewayDispatchOpts.replyAccount,
    cleanupBundleMcpOnRunEnd: true,
    cleanupCliLiveSessionOnRunEnd: true,
    oneShotCliRun: dispatchOpts.local === true,
    abortSignal: signalBridge.signal,
  };
  try {
    if (dispatchOpts.local === true)
      return returnAfterSignalExit(
        await (
          await loadEmbeddedAgentCommand()
        )(localOpts, runtime, deps),
        signalBridge.getReceivedSignal(),
        runtime,
      );
    try {
      return returnAfterSignalExit(
        await agentViaGatewayCommandWithTransientRetries(
          gatewayDispatchOpts,
          runtime,
          signalBridge,
        ),
        signalBridge.getReceivedSignal(),
        runtime,
      );
    } catch (err) {
      if (isAbortError(err)) {
        if (exitForReceivedSignal(signalBridge.getReceivedSignal(), runtime)) return;
        throw err;
      }
      if (isGatewayAgentTimeoutError(err)) {
        const fallbackSession = createGatewayTimeoutFallbackSession(
          await resolveAgentIdForGatewayTimeoutFallback(dispatchOpts),
        );
        runtime.error?.(
          `EMBEDDED FALLBACK: Gateway agent timed out; running embedded agent with fresh session ${fallbackSession.sessionId}: ${String(err)}`,
        );
        return returnAfterSignalExit(
          await (
            await loadEmbeddedAgentCommand()
          )(
            {
              ...localOpts,
              sessionId: fallbackSession.sessionId,
              sessionKey: fallbackSession.sessionKey,
              runId: fallbackSession.sessionId,
              resultMetaOverrides: {
                ...EMBEDDED_FALLBACK_META,
                fallbackReason: "gateway_timeout",
                fallbackSessionId: fallbackSession.sessionId,
                fallbackSessionKey: fallbackSession.sessionKey,
              },
            },
            runtime,
            deps,
          ),
          signalBridge.getReceivedSignal(),
          runtime,
        );
      }
      if (!isGatewayAgentEmbeddedFallbackError(err)) throw err;
      runtime.error?.(
        `EMBEDDED FALLBACK: Gateway agent failed; running embedded agent: ${String(err)}`,
      );
      return returnAfterSignalExit(
        await (
          await loadEmbeddedAgentCommand()
        )(
          {
            ...localOpts,
            resultMetaOverrides: EMBEDDED_FALLBACK_META,
          },
          runtime,
          deps,
        ),
        signalBridge.getReceivedSignal(),
        runtime,
      );
    }
  } catch (err) {
    if (isAbortError(err) && exitForReceivedSignal(signalBridge.getReceivedSignal(), runtime))
      return;
    throw err;
  } finally {
    signalBridge.dispose();
  }
}
//#endregion
export { agentCliCommand };
