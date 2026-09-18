import { createServer as createServer$1 } from "node:http";
import net from "node:net";
import { InputFile } from "grammy";
import { t as mergeTelegramAccountConfig } from "./account-config-D_q_Am0A.js";
import { t as resolveTelegramAllowedUpdates } from "./allowed-updates-C8V4-A3j.js";
import {
  C as stopDiagnosticHeartbeat,
  S as startDiagnosticHeartbeat,
  g as logWebhookReceived,
  h as logWebhookProcessed,
  m as logWebhookError,
} from "./diagnostic-DE-wbBb7.js";
import { f as isDiagnosticsEnabled } from "./diagnostic-events-5-gsFhkM.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { r as resolveTelegramTransport } from "./fetch-C3cVXJjY.js";
import { r as formatDurationPrecise } from "./format-duration-DKk9BtRb.js";
import "./logging-core-QnL1iLWg.js";
import "./number-runtime-B-n-wjMn.js";
import "./runtime-env-D0V-7Gqz.js";
import "./security-runtime-CraX8Pqe.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import { n as createConnectedChannelStatusPatch } from "./gateway-runtime-IrTdjV5_.js";
import { s as readJsonBodyWithLimit } from "./http-body-aoMvQQlg.js";
import { n as isRetryableTelegramApiError } from "./network-errors-CFprAVtH.js";
import "./ssrf-runtime-DJ478vv8.js";
import { y as parseStrictNonNegativeInteger } from "./number-coercion-CJQ8TR--.js";
import "./diagnostic-runtime-CpZ_ot5_.js";
import { r as defaultRuntime } from "./runtime-Bz6o617W.js";
import { t as safeEqualSecret } from "./secret-equal-DRsL8lKD.js";
import { et as withTelegramApiErrorLogging } from "./send-CfVpuwvn.js";
import { n as computeBackoff, s as sleepWithAbort } from "./src-Dqmh2693.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import {
  S as runWithTelegramSpooledReplayUpdate,
  _ as resolveSpooledUpdateRetryDelayMs,
  a as listTelegramSpooledUpdateClaims,
  b as supersedeTelegramReplyFenceLane,
  c as refreshTelegramSpooledUpdateClaim,
  d as writeTelegramSpooledUpdate,
  f as isTelegramSpooledCorruptClaimOwnedByOtherLiveProcess,
  g as resolveSpooledUpdateAttemptNumber,
  h as resolveNonRetryableSpooledUpdateFailure,
  i as failTelegramSpooledUpdateClaim,
  l as releaseTelegramSpooledUpdateClaim,
  m as createTelegramBot,
  n as claimNextTelegramSpooledUpdate,
  o as listTelegramSpooledUpdates,
  p as isTelegramSpooledUpdateClaimOwnedByOtherLiveProcess,
  r as completeTelegramSpooledUpdateWithRetry,
  s as recoverStaleTelegramSpooledUpdateClaims,
  u as resolveTelegramIngressSpoolDir,
  v as shouldDeadLetterRetryableSpooledUpdate,
  x as getTelegramSequentialKey,
  y as buildTelegramReplyFenceLaneKey,
} from "./telegram-ingress-spool-B_TM1GKG.js";
import {
  a as createFixedWindowRateLimiter,
  r as WEBHOOK_RATE_LIMIT_DEFAULTS,
} from "./webhook-ingress-BloIhSnv.js";
import { r as applyBasicWebhookRequestGuards } from "./webhook-request-guards-B3epkORT.js";
//#region extensions/telegram/src/webhook-status.ts
function createTelegramWebhookStatusPublisher(setStatus) {
  return {
    noteWebhookStart() {
      setStatus?.({
        mode: "webhook",
        connected: false,
        lastConnectedAt: null,
        lastEventAt: null,
        lastTransportActivityAt: null,
      });
    },
    noteWebhookAdvertised(at = Date.now()) {
      setStatus?.({
        ...createConnectedChannelStatusPatch(at),
        mode: "webhook",
        lastError: null,
      });
    },
    noteWebhookUpdateReceived(at = Date.now()) {
      setStatus?.({
        ...createConnectedChannelStatusPatch(at),
        mode: "webhook",
        lastError: null,
      });
    },
    noteWebhookRegistrationFailure(error) {
      setStatus?.({
        mode: "webhook",
        connected: false,
        lastError: error,
      });
    },
    noteWebhookStop() {
      setStatus?.({
        mode: "webhook",
        connected: false,
      });
    },
  };
}
//#endregion
//#region extensions/telegram/src/webhook.ts
const TELEGRAM_WEBHOOK_MAX_BODY_BYTES = 1024 * 1024;
const TELEGRAM_WEBHOOK_BODY_TIMEOUT_MS = 3e4;
const TELEGRAM_WEBHOOK_ACCEPTED_HEADER = "x-openclaw-delivery-accepted";
const TELEGRAM_WEBHOOK_ACCEPTED_VALUE = "durable";
const TELEGRAM_WEBHOOK_SPOOLED_DRAIN_INTERVAL_MS = 500;
const TELEGRAM_WEBHOOK_SPOOLED_CLAIM_REFRESH_INTERVAL_MS = 300 * 1e3;
const TELEGRAM_WEBHOOK_SPOOLED_HANDLER_TIMEOUT_MS = 25 * 6e4;
const TELEGRAM_WEBHOOK_SPOOLED_HANDLER_ABORT_GRACE_MS = 5e3;
const TELEGRAM_WEBHOOK_SPOOLED_DRAIN_START_LIMIT = 100;
const TELEGRAM_WEBHOOK_SPOOLED_DRAIN_SCAN_LIMIT = TELEGRAM_WEBHOOK_SPOOLED_DRAIN_START_LIMIT * 10;
const TELEGRAM_WEBHOOK_REGISTRATION_RETRY_POLICY = {
  initialMs: 5e3,
  maxMs: 6e4,
  factor: 2,
  jitter: 0.2,
};
const activeWebhookSpooledHandlersByLane = /* @__PURE__ */ new Map();
function buildWebhookSpooledHandlerKey(params) {
  return `${params.spoolDir}\0${params.laneKey}`;
}
function resolveActiveWebhookSpooledLaneKeys(spoolDir) {
  const laneKeys = /* @__PURE__ */ new Set();
  const prefix = `${spoolDir}\0`;
  for (const [handlerKey, handler] of activeWebhookSpooledHandlersByLane)
    if (handlerKey.startsWith(prefix)) laneKeys.add(handler.laneKey);
  return laneKeys;
}
async function listenHttpServer(params) {
  await new Promise((resolve, reject) => {
    const onError = (err) => {
      params.server.off("error", onError);
      reject(err);
    };
    params.server.once("error", onError);
    params.server.listen(params.port, params.host, () => {
      params.server.off("error", onError);
      resolve();
    });
  });
}
function resolveWebhookPublicUrl(params) {
  if (params.configuredPublicUrl) return params.configuredPublicUrl;
  const address = params.server.address();
  if (address && typeof address !== "string")
    return `http://${params.host === "0.0.0.0" || address.address === "0.0.0.0" || address.address === "::" ? "localhost" : address.address}:${address.port}${params.path}`;
  return `http://${params.host === "0.0.0.0" ? "localhost" : params.host}:${params.port}${params.path}`;
}
async function initializeTelegramWebhookBotOnce(params) {
  const initSignal = params.abortSignal;
  await withTelegramApiErrorLogging({
    operation: "getMe",
    runtime: params.runtime,
    fn: () => params.bot.init(initSignal),
  });
}
async function initializeTelegramWebhookBot(params) {
  let attempt = 0;
  while (true)
    try {
      await initializeTelegramWebhookBotOnce({
        bot: params.bot,
        runtime: params.runtime,
        abortSignal: params.abortSignal,
      });
      return;
    } catch (err) {
      if (!isRetryableTelegramApiError(err, { context: "webhook" }) || params.abortSignal?.aborted)
        throw err;
      attempt += 1;
      const delayMs = computeBackoff(params.retryPolicy, attempt);
      params.runtime.log?.(
        `telegram getMe retry ${attempt} scheduled in ${formatDurationPrecise(delayMs)}`,
      );
      await sleepWithAbort(delayMs, params.abortSignal);
    }
}
function resolveSingleHeaderValue(header) {
  if (typeof header === "string") return header;
  if (Array.isArray(header) && header.length === 1) return header[0];
}
function hasValidTelegramWebhookSecret(secretHeader, expectedSecret) {
  return safeEqualSecret(secretHeader, expectedSecret);
}
function parseIpLiteral(value) {
  const trimmed = normalizeOptionalString(value);
  if (!trimmed) return;
  if (trimmed.startsWith("[")) {
    const end = trimmed.indexOf("]");
    if (end !== -1) {
      const candidate = trimmed.slice(1, end);
      return net.isIP(candidate) === 0 ? void 0 : candidate;
    }
  }
  if (net.isIP(trimmed) !== 0) return trimmed;
  const lastColon = trimmed.lastIndexOf(":");
  if (lastColon > -1 && trimmed.includes(".") && trimmed.indexOf(":") === lastColon) {
    const candidate = trimmed.slice(0, lastColon);
    return net.isIP(candidate) === 4 ? candidate : void 0;
  }
}
function isTrustedProxyAddress(ip, trustedProxies) {
  const candidate = parseIpLiteral(ip);
  if (!candidate || !trustedProxies?.length) return false;
  const blockList = new net.BlockList();
  for (const proxy of trustedProxies) {
    const trimmed = normalizeOptionalString(proxy) ?? "";
    if (!trimmed) continue;
    if (trimmed.includes("/")) {
      const [address, prefix] = trimmed.split("/", 2);
      if (address === void 0 || prefix === void 0) continue;
      const parsedPrefix = parseStrictNonNegativeInteger(prefix);
      const family = net.isIP(address);
      if (family === 4 && parsedPrefix !== void 0 && parsedPrefix >= 0 && parsedPrefix <= 32)
        blockList.addSubnet(address, parsedPrefix, "ipv4");
      if (family === 6 && parsedPrefix !== void 0 && parsedPrefix >= 0 && parsedPrefix <= 128)
        blockList.addSubnet(address, parsedPrefix, "ipv6");
      continue;
    }
    if (net.isIP(trimmed) === 4) {
      blockList.addAddress(trimmed, "ipv4");
      continue;
    }
    if (net.isIP(trimmed) === 6) blockList.addAddress(trimmed, "ipv6");
  }
  return blockList.check(candidate, net.isIP(candidate) === 6 ? "ipv6" : "ipv4");
}
function resolveForwardedClientIp(forwardedFor, trustedProxies) {
  if (!trustedProxies?.length) return;
  const forwardedChain = forwardedFor
    ?.split(",")
    .map((entry) => parseIpLiteral(entry))
    .filter((entry) => Boolean(entry));
  if (!forwardedChain?.length) return;
  for (let index = forwardedChain.length - 1; index >= 0; index -= 1) {
    const hop = forwardedChain[index];
    if (!isTrustedProxyAddress(hop, trustedProxies)) return hop;
  }
}
function resolveTelegramWebhookClientIp(req, config) {
  const remoteAddress = parseIpLiteral(req.socket.remoteAddress);
  const trustedProxies = config?.gateway?.trustedProxies;
  if (!remoteAddress) return "unknown";
  if (!isTrustedProxyAddress(remoteAddress, trustedProxies)) return remoteAddress;
  const forwardedClientIp = resolveForwardedClientIp(
    Array.isArray(req.headers["x-forwarded-for"])
      ? req.headers["x-forwarded-for"][0]
      : req.headers["x-forwarded-for"],
    trustedProxies,
  );
  if (forwardedClientIp) return forwardedClientIp;
  if (config?.gateway?.allowRealIpFallback === true)
    return (
      parseIpLiteral(
        Array.isArray(req.headers["x-real-ip"])
          ? req.headers["x-real-ip"][0]
          : req.headers["x-real-ip"],
      ) ?? "unknown"
    );
  return "unknown";
}
function resolveTelegramWebhookRateLimitKey(req, path, config) {
  return `${path}:${resolveTelegramWebhookClientIp(req, config)}`;
}
function resolveWebhookSpooledUpdateLaneKey(update) {
  return getTelegramSequentialKey({ update });
}
async function releaseFailedWebhookSpooledUpdate(params) {
  const laneKey = resolveWebhookSpooledUpdateLaneKey(params.update.update);
  const nonRetryable = resolveNonRetryableSpooledUpdateFailure(params.err);
  if (nonRetryable) {
    if (
      await failTelegramSpooledUpdateClaim({
        update: params.update,
        reason: nonRetryable.reason,
        message: nonRetryable.message,
      })
    )
      params.log(
        `[telegram][diag] webhook spooled update ${params.update.updateId} failed with non-retryable ${nonRetryable.reason}; dead-lettered: ${nonRetryable.message}`,
      );
    return;
  }
  const attempt = resolveSpooledUpdateAttemptNumber(params.update);
  if (shouldDeadLetterRetryableSpooledUpdate(params.update, attempt)) {
    const message = formatErrorMessage(params.err);
    if (
      await failTelegramSpooledUpdateClaim({
        update: params.update,
        reason: "retry-limit-exceeded",
        message,
      })
    )
      params.log(
        `[telegram][warn] webhook spooled update ${params.update.updateId} on lane ${laneKey} reached retry limit after ${attempt} attempts; dead-lettered: ${message}`,
      );
    return;
  }
  await releaseTelegramSpooledUpdateClaim(params.update, {
    lastError: formatErrorMessage(params.err),
  });
  params.log(
    `[telegram][diag] webhook spooled update ${params.update.updateId} failed; keeping for retry attempt ${attempt + 1}/8: ${formatErrorMessage(params.err)}`,
  );
}
function startWebhookSpooledUpdateClaimRefresh(params) {
  let stopped = false;
  let refreshing = false;
  const refresh = async () => {
    if (stopped || refreshing) return;
    refreshing = true;
    try {
      if (!(await refreshTelegramSpooledUpdateClaim(params.update)) && !stopped)
        params.log(
          `[telegram][diag] webhook spooled update ${params.update.updateId} claim refresh lost ownership`,
        );
    } catch (err) {
      params.log(
        `[telegram][diag] webhook spooled update ${params.update.updateId} claim refresh failed: ${formatErrorMessage(err)}`,
      );
    } finally {
      refreshing = false;
    }
  };
  const timer = setInterval(() => {
    refresh();
  }, TELEGRAM_WEBHOOK_SPOOLED_CLAIM_REFRESH_INTERVAL_MS);
  timer.unref?.();
  return () => {
    if (stopped) return;
    stopped = true;
    clearInterval(timer);
  };
}
var WebhookSpooledHandlerTimeoutError = class extends Error {
  constructor(message, replayTask) {
    super(message);
    this.replayTask = replayTask;
    this.name = "WebhookSpooledHandlerTimeoutError";
  }
};
function formatWebhookSpooledHandlerTimeoutMessage(params) {
  const age = formatDurationPrecise(TELEGRAM_WEBHOOK_SPOOLED_HANDLER_TIMEOUT_MS);
  return `Telegram webhook spool processing timed out behind update ${params.updateId} on lane ${params.laneKey} after ${age}; marking the update failed.`;
}
async function failTimedOutWebhookSpooledUpdate(params) {
  if (
    !(await failTelegramSpooledUpdateClaim({
      update: params.update,
      reason: "handler-timeout",
      message: params.message,
    }))
  )
    params.log(
      `[telegram][diag] timed out webhook spooled update ${params.update.updateId} no longer had a processing marker to fail.`,
    );
}
async function waitForTimedOutWebhookReplayGrace(params) {
  let timer;
  try {
    return await Promise.race([
      params.replayTask.then(
        () => true,
        (replayErr) => {
          params.log(
            `[telegram][diag] timed out webhook spooled update ${params.updateId} replay later failed: ${formatErrorMessage(replayErr)}`,
          );
          return true;
        },
      ),
      new Promise((resolve) => {
        timer = setTimeout(() => resolve(false), TELEGRAM_WEBHOOK_SPOOLED_HANDLER_ABORT_GRACE_MS);
        timer.unref?.();
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}
async function runWebhookSpooledReplayWithTimeout(params) {
  let timer;
  const replayTask = runWithTelegramSpooledReplayUpdate(params.rawUpdate, async () => {
    await params.bot.handleUpdate(params.update);
  });
  replayTask.catch(() => void 0);
  const timeout = new Promise((_resolve, reject) => {
    timer = setTimeout(() => {
      reject(
        new WebhookSpooledHandlerTimeoutError(
          formatWebhookSpooledHandlerTimeoutMessage({
            laneKey: params.laneKey,
            updateId: params.updateId,
          }),
          replayTask,
        ),
      );
    }, TELEGRAM_WEBHOOK_SPOOLED_HANDLER_TIMEOUT_MS);
    timer.unref?.();
  });
  try {
    return await Promise.race([replayTask, timeout]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}
async function waitForWebhookSpooledDeferredWork(params) {
  let timeoutError;
  const timer = setTimeout(() => {
    const age = formatDurationPrecise(TELEGRAM_WEBHOOK_SPOOLED_HANDLER_TIMEOUT_MS);
    const message = `Telegram webhook spool buffered processing timed out behind update ${params.update.updateId} on lane ${params.laneKey} after ${age}; marking the update failed.`;
    params.log(`[telegram] ${message}`);
    timeoutError = new Error(message);
    params.deferredWork.settle({
      kind: "failed-retryable",
      error: timeoutError,
    });
  }, TELEGRAM_WEBHOOK_SPOOLED_HANDLER_TIMEOUT_MS);
  timer.unref?.();
  try {
    const result = await params.deferredWork.task.catch((err) => ({
      kind: "failed-retryable",
      error: err,
    }));
    return timeoutError !== void 0 &&
      result.kind === "failed-retryable" &&
      result.error === timeoutError
      ? {
          ...result,
          timedOut: true,
        }
      : result;
  } finally {
    clearTimeout(timer);
  }
}
async function handleWebhookSpooledUpdate(params) {
  let replay;
  try {
    const rawUpdate = params.update.update;
    if (!rawUpdate || typeof rawUpdate !== "object")
      throw new Error("Telegram spooled webhook update payload was invalid.");
    const laneKey = resolveWebhookSpooledUpdateLaneKey(rawUpdate);
    const update = rawUpdate;
    replay = await runWebhookSpooledReplayWithTimeout({
      bot: params.bot,
      laneKey,
      rawUpdate,
      update,
      updateId: params.update.updateId,
    });
  } catch (err) {
    if (err instanceof WebhookSpooledHandlerTimeoutError) {
      params.log(`[telegram] ${err.message}`);
      const scopedReplyFenceLaneKey = buildTelegramReplyFenceLaneKey({
        accountId: params.accountId,
        sequentialKey: resolveWebhookSpooledUpdateLaneKey(params.update.update),
      });
      if (!supersedeTelegramReplyFenceLane(scopedReplyFenceLaneKey))
        params.log(
          `[telegram][diag] timed out webhook spooled update ${params.update.updateId} had no active reply fence on lane ${scopedReplyFenceLaneKey}.`,
        );
      await failTimedOutWebhookSpooledUpdate({
        log: params.log,
        message: err.message,
        update: params.update,
      });
      if (
        await waitForTimedOutWebhookReplayGrace({
          log: params.log,
          replayTask: err.replayTask,
          updateId: params.update.updateId,
        })
      )
        return {};
      return {
        retainLaneGuardTask: err.replayTask.catch((replayErr) => {
          params.log(
            `[telegram][diag] timed out webhook spooled update ${params.update.updateId} replay later failed: ${formatErrorMessage(replayErr)}`,
          );
        }),
      };
    }
    await releaseFailedWebhookSpooledUpdate({
      err,
      log: params.log,
      update: params.update,
    });
    return {};
  }
  if (replay.deferredWork) {
    const result = await waitForWebhookSpooledDeferredWork({
      deferredWork: replay.deferredWork,
      laneKey: resolveWebhookSpooledUpdateLaneKey(params.update.update),
      log: params.log,
      update: params.update,
    });
    if (result.kind === "failed-retryable") {
      if (result.timedOut) {
        await failTimedOutWebhookSpooledUpdate({
          log: params.log,
          message: formatErrorMessage(result.error),
          update: params.update,
        });
        return {};
      }
      await releaseFailedWebhookSpooledUpdate({
        err: result.error,
        log: params.log,
        update: params.update,
      });
      return {};
    }
  }
  await completeTelegramSpooledUpdateWithRetry({
    update: params.update,
    abortSignal: params.abortSignal,
    onRetry: ({ attempt, delayMs, error }) => {
      params.log(
        `[telegram][diag] webhook spooled update ${params.update.updateId} completion retry ${attempt} scheduled in ${formatDurationPrecise(delayMs)}: ${formatErrorMessage(error)}`,
      );
    },
  });
  return {};
}
async function startTelegramWebhook(opts) {
  const path = opts.path ?? "/telegram-webhook";
  const healthPath = opts.healthPath ?? "/healthz";
  const port = opts.port ?? 8787;
  const host = opts.host ?? "127.0.0.1";
  const secret = normalizeOptionalString(opts.secret) ?? "";
  if (!secret)
    throw new Error(
      "Telegram webhook mode requires a non-empty secret token. Set channels.telegram.webhookSecret in your config.",
    );
  const runtime = opts.runtime ?? defaultRuntime;
  const status = createTelegramWebhookStatusPublisher(opts.setStatus);
  status.noteWebhookStart();
  const webhookRegistrationRetryPolicy =
    opts.webhookRegistrationRetryPolicy ?? TELEGRAM_WEBHOOK_REGISTRATION_RETRY_POLICY;
  const diagnosticsEnabled = isDiagnosticsEnabled(opts.config);
  const spoolDir = opts.spoolDir ?? resolveTelegramIngressSpoolDir({ accountId: opts.accountId });
  let shutDown = false;
  const shutdownAbortController = new AbortController();
  const webhookAbortSignal = opts.abortSignal
    ? AbortSignal.any([shutdownAbortController.signal, opts.abortSignal])
    : shutdownAbortController.signal;
  const telegramAccountConfig = opts.config
    ? mergeTelegramAccountConfig(opts.config, opts.accountId ?? "default")
    : void 0;
  const telegramTransport = resolveTelegramTransport(opts.fetch, {
    network: telegramAccountConfig?.network,
  });
  let closeTransportPromise;
  const closeTransportOnce = () => {
    closeTransportPromise ??= telegramTransport.close();
    return closeTransportPromise;
  };
  const botAbortController = new AbortController();
  const botFetchAbortSignal = opts.abortSignal
    ? AbortSignal.any([opts.abortSignal, botAbortController.signal])
    : botAbortController.signal;
  const bot = createTelegramBot({
    token: opts.token,
    runtime,
    proxyFetch: opts.fetch,
    fetchAbortSignal: botFetchAbortSignal,
    config: opts.config,
    accountId: opts.accountId,
    telegramTransport,
  });
  try {
    await initializeTelegramWebhookBot({
      bot,
      runtime,
      abortSignal: opts.abortSignal,
      retryPolicy: webhookRegistrationRetryPolicy,
    });
  } catch (err) {
    botAbortController.abort();
    await bot.stop();
    await closeTransportOnce();
    throw err;
  }
  const telegramWebhookRateLimiter = createFixedWindowRateLimiter({
    windowMs: WEBHOOK_RATE_LIMIT_DEFAULTS.windowMs,
    maxRequests: WEBHOOK_RATE_LIMIT_DEFAULTS.maxRequests,
    maxTrackedKeys: WEBHOOK_RATE_LIMIT_DEFAULTS.maxTrackedKeys,
  });
  if (diagnosticsEnabled) startDiagnosticHeartbeat(opts.config);
  const log = (line) => runtime.log?.(line);
  let drainActive = false;
  let drainRequested = false;
  const drainWebhookSpool = async () => {
    if (shutDown || opts.abortSignal?.aborted) return;
    if (drainActive) {
      drainRequested = true;
      return;
    }
    drainActive = true;
    drainRequested = false;
    try {
      const activeWebhookSpooledLaneKeys = resolveActiveWebhookSpooledLaneKeys(spoolDir);
      await recoverStaleTelegramSpooledUpdateClaims({
        spoolDir,
        staleMs: 0,
        shouldRecover: (claim) =>
          !activeWebhookSpooledLaneKeys.has(resolveWebhookSpooledUpdateLaneKey(claim.update)) &&
          !isTelegramSpooledUpdateClaimOwnedByOtherLiveProcess(claim),
        shouldRecoverCorrupt: (claim) =>
          !(claim.laneKey && activeWebhookSpooledLaneKeys.has(claim.laneKey)) &&
          !isTelegramSpooledCorruptClaimOwnedByOtherLiveProcess(claim),
      });
      const claimedLaneKeys = new Set(
        (await listTelegramSpooledUpdateClaims({ spoolDir })).map((claim) =>
          resolveWebhookSpooledUpdateLaneKey(claim.update),
        ),
      );
      const updates = await listTelegramSpooledUpdates({
        spoolDir,
        limit: TELEGRAM_WEBHOOK_SPOOLED_DRAIN_SCAN_LIMIT,
      });
      const candidateUpdateIds = updates.map((update) => update.updateId);
      const blockedLaneKeys = /* @__PURE__ */ new Set([
        ...activeWebhookSpooledLaneKeys,
        ...claimedLaneKeys,
      ]);
      for (const update of updates)
        if (resolveSpooledUpdateRetryDelayMs(update) > 0)
          blockedLaneKeys.add(resolveWebhookSpooledUpdateLaneKey(update.update));
      let started = 0;
      while (started < TELEGRAM_WEBHOOK_SPOOLED_DRAIN_START_LIMIT) {
        if (shutDown || opts.abortSignal?.aborted) break;
        const claimedUpdate = await claimNextTelegramSpooledUpdate({
          spoolDir,
          blockedLaneKeys,
          candidateUpdateIds,
          scanLimit: TELEGRAM_WEBHOOK_SPOOLED_DRAIN_SCAN_LIMIT,
        });
        if (!claimedUpdate) break;
        const laneKey = resolveWebhookSpooledUpdateLaneKey(claimedUpdate.update);
        const handlerKey = buildWebhookSpooledHandlerKey({
          spoolDir,
          laneKey,
        });
        const handlerState = { laneKey };
        activeWebhookSpooledHandlersByLane.set(handlerKey, handlerState);
        blockedLaneKeys.add(laneKey);
        const stopClaimRefresh = startWebhookSpooledUpdateClaimRefresh({
          log,
          update: claimedUpdate,
        });
        let retainLaneGuardTask;
        handleWebhookSpooledUpdate({
          accountId: opts.accountId ?? "default",
          abortSignal: webhookAbortSignal,
          bot,
          log,
          update: claimedUpdate,
        })
          .then((result) => {
            retainLaneGuardTask = result.retainLaneGuardTask;
            if (retainLaneGuardTask)
              retainLaneGuardTask.finally(() => {
                if (activeWebhookSpooledHandlersByLane.get(handlerKey) === handlerState)
                  activeWebhookSpooledHandlersByLane.delete(handlerKey);
                Promise.resolve().then(drainWebhookSpool);
              });
          })
          .catch((err) => {
            runtime.log?.(
              `[telegram][diag] webhook spooled update ${claimedUpdate.updateId} handler failed after claim: ${formatErrorMessage(err)}`,
            );
          })
          .finally(() => {
            stopClaimRefresh();
            if (
              !retainLaneGuardTask &&
              activeWebhookSpooledHandlersByLane.get(handlerKey) === handlerState
            )
              activeWebhookSpooledHandlersByLane.delete(handlerKey);
            Promise.resolve().then(drainWebhookSpool);
          });
        started += 1;
      }
    } catch (err) {
      runtime.log?.(`[telegram][diag] webhook spool drain failed: ${formatErrorMessage(err)}`);
    } finally {
      drainActive = false;
      if (drainRequested && !shutDown && !opts.abortSignal?.aborted)
        Promise.resolve().then(drainWebhookSpool);
    }
  };
  const requestWebhookSpoolDrain = () => {
    drainWebhookSpool();
  };
  let drainTimer;
  const startWebhookSpoolDrain = () => {
    if (drainTimer) return;
    requestWebhookSpoolDrain();
    drainTimer = setInterval(requestWebhookSpoolDrain, TELEGRAM_WEBHOOK_SPOOLED_DRAIN_INTERVAL_MS);
    drainTimer.unref?.();
  };
  const server = createServer$1((req, res) => {
    const respondText = (statusCode, text = "") => {
      if (res.headersSent || res.writableEnded) return;
      res.writeHead(statusCode, { "Content-Type": "text/plain; charset=utf-8" });
      res.end(text);
    };
    if (req.url === healthPath) {
      res.writeHead(200);
      res.end("ok");
      return;
    }
    if (req.url !== path || req.method !== "POST") {
      res.writeHead(404);
      res.end();
      return;
    }
    const startTime = Date.now();
    if (diagnosticsEnabled)
      logWebhookReceived({
        channel: "telegram",
        updateType: "telegram-post",
      });
    if (
      !hasValidTelegramWebhookSecret(
        resolveSingleHeaderValue(req.headers["x-telegram-bot-api-secret-token"]),
        secret,
      )
    ) {
      if (
        !applyBasicWebhookRequestGuards({
          req,
          res,
          rateLimiter: telegramWebhookRateLimiter,
          rateLimitKey: resolveTelegramWebhookRateLimitKey(req, path, opts.config),
        })
      )
        return;
      res.shouldKeepAlive = false;
      res.setHeader("Connection", "close");
      respondText(401, "unauthorized");
      return;
    }
    (async () => {
      const body = await readJsonBodyWithLimit(req, {
        maxBytes: TELEGRAM_WEBHOOK_MAX_BODY_BYTES,
        timeoutMs: TELEGRAM_WEBHOOK_BODY_TIMEOUT_MS,
        emptyObjectOnEmpty: false,
      });
      if (!body.ok) {
        if (body.code === "PAYLOAD_TOO_LARGE") {
          respondText(413, body.error);
          return;
        }
        if (body.code === "REQUEST_BODY_TIMEOUT") {
          respondText(408, body.error);
          return;
        }
        if (body.code === "CONNECTION_CLOSED") {
          respondText(400, body.error);
          return;
        }
        respondText(400, body.error);
        return;
      }
      await writeTelegramSpooledUpdate({
        spoolDir,
        update: body.value,
        laneKey: resolveWebhookSpooledUpdateLaneKey(body.value),
      });
      res.setHeader(TELEGRAM_WEBHOOK_ACCEPTED_HEADER, TELEGRAM_WEBHOOK_ACCEPTED_VALUE);
      respondText(200);
      status.noteWebhookUpdateReceived();
      requestWebhookSpoolDrain();
      if (diagnosticsEnabled)
        logWebhookProcessed({
          channel: "telegram",
          updateType: "telegram-post",
          durationMs: Date.now() - startTime,
        });
    })().catch((err) => {
      const errMsg = formatErrorMessage(err);
      if (diagnosticsEnabled)
        logWebhookError({
          channel: "telegram",
          updateType: "telegram-post",
          error: errMsg,
        });
      runtime.log?.(`webhook request failed: ${errMsg}`);
      respondText(500);
    });
  });
  await listenHttpServer({
    server,
    port,
    host,
  });
  const boundAddress = server.address();
  const boundPort = boundAddress && typeof boundAddress !== "string" ? boundAddress.port : port;
  const publicUrl = resolveWebhookPublicUrl({
    configuredPublicUrl: opts.publicUrl,
    server,
    path,
    host,
    port,
  });
  let webhookAdvertised = false;
  const shutdown = async () => {
    if (shutDown) return;
    botAbortController.abort();
    shutDown = true;
    shutdownAbortController.abort();
    if (drainTimer) clearInterval(drainTimer);
    server.close();
    await bot.stop();
    await closeTransportOnce();
    status.noteWebhookStop();
    if (diagnosticsEnabled) stopDiagnosticHeartbeat();
  };
  if (opts.abortSignal?.aborted) shutdown();
  else if (opts.abortSignal)
    opts.abortSignal.addEventListener("abort", () => void shutdown(), { once: true });
  const advertiseWebhook = async () => {
    if (shutDown || opts.abortSignal?.aborted) return;
    try {
      await withTelegramApiErrorLogging({
        operation: "setWebhook",
        runtime,
        fn: () =>
          bot.api.setWebhook(publicUrl, {
            secret_token: secret,
            allowed_updates: resolveTelegramAllowedUpdates(),
            certificate: opts.webhookCertPath ? new InputFile(opts.webhookCertPath) : void 0,
          }),
      });
    } catch (err) {
      status.noteWebhookRegistrationFailure(formatErrorMessage(err));
      throw err;
    }
    if (shutDown) return;
    webhookAdvertised = true;
    status.noteWebhookAdvertised();
    runtime.log?.(`webhook advertised to telegram on ${publicUrl}`);
  };
  const shouldRetryWebhookRegistration = (err) =>
    isRetryableTelegramApiError(err, { context: "webhook" });
  const retryWebhookRegistration = async (firstAttempt) => {
    let attempt = firstAttempt;
    while (true) {
      if (shutDown || opts.abortSignal?.aborted || webhookAdvertised) return;
      const delayMs = computeBackoff(webhookRegistrationRetryPolicy, attempt);
      runtime.log?.(
        `telegram setWebhook retry ${attempt} scheduled in ${formatDurationPrecise(delayMs)}`,
      );
      try {
        await sleepWithAbort(delayMs, opts.abortSignal);
      } catch {
        return;
      }
      if (shutDown || opts.abortSignal?.aborted || webhookAdvertised) return;
      try {
        await advertiseWebhook();
        return;
      } catch (err) {
        if (!shouldRetryWebhookRegistration(err)) {
          runtime.error?.(
            `telegram setWebhook retry stopped after non-recoverable error: ${formatErrorMessage(err)}`,
          );
          await shutdown();
          return;
        }
      }
      attempt += 1;
    }
  };
  runtime.log?.(`webhook local listener on http://${host}:${boundPort}${path}`);
  if (!shutDown)
    try {
      await advertiseWebhook();
    } catch (err) {
      if (!shouldRetryWebhookRegistration(err)) {
        await shutdown();
        throw err;
      }
      retryWebhookRegistration(1);
    }
  if (!shutDown) startWebhookSpoolDrain();
  return {
    server,
    bot,
    stop: shutdown,
  };
}
//#endregion
export { startTelegramWebhook };
