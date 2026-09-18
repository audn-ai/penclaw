import { a as resolveAgentDir, c as resolveDefaultAgentId } from "./agent-scope-config-DVIR1nBa.js";
import { _ as readCodexNotificationItem } from "./attempt-notifications-jKAL7Gfs.js";
import { n as resolveCodexBindingAppServerConnection } from "./binding-connection-D_wKlTHe.js";
import "./agent-runtime-BiQiwmwD.js";
import "./agent-harness-runtime-BjY9gsEs.js";
import { j as resolveCompactionTimeoutMs } from "./diagnostic-DE-wbBb7.js";
import { t as log } from "./logger-C5RMMskO.js";
import {
  n as readCodexNotificationThreadId,
  r as readCodexNotificationTurnId,
} from "./notification-correlation-BtXfV0Pa.js";
import { i as isJsonObject } from "./protocol-BMifTfdW.js";
import { n as resolveCodexNativeExecutionBlock } from "./sandbox-guard-D4QOS1Tr.js";
import {
  h as sessionBindingIdentity,
  t as CODEX_APP_SERVER_BINDING_GUARDED_REQUEST_TIMEOUT_MS,
} from "./session-binding-CxW6VTON.js";
import {
  c as getLeasedSharedCodexAppServerClient,
  d as releaseLeasedSharedCodexAppServerClient,
  j as CodexAppServerRpcError,
} from "./shared-client-a36Mluj-.js";
//#region extensions/codex/src/app-server/compact.ts
/**
 * Native Codex app-server compaction bridge for bound OpenClaw sessions.
 */
const warnedIgnoredCompactionOverrides = /* @__PURE__ */ new Set();
const codexNativeCompactionQueues = /* @__PURE__ */ new Map();
const CODEX_NATIVE_COMPACTION_INTERRUPT_GRACE_MS = 3e4;
const CODEX_NO_ACTIVE_TURN_ERROR_CODE = -32600;
const CODEX_NO_ACTIVE_TURN_ERROR_MESSAGE = "no active turn to interrupt";
function isAlreadyTerminalInterruptError(error) {
  return (
    error instanceof CodexAppServerRpcError &&
    error.code === CODEX_NO_ACTIVE_TURN_ERROR_CODE &&
    error.message === CODEX_NO_ACTIVE_TURN_ERROR_MESSAGE
  );
}
function watchCodexNativeCompactionCompletion(params) {
  let settled = false;
  let requestStarted = false;
  let abortRequested = false;
  let interruptRequested = false;
  let retirementStarted = false;
  let compactionTurnId;
  let compactionItemId;
  let compactionItemCompleted = false;
  let resolveCompletion = (_result) => {};
  const completion = new Promise((resolve) => {
    resolveCompletion = resolve;
  });
  let removeNotificationHandler = () => {};
  let removeCloseHandler = () => {};
  let removeAbortHandler = () => {};
  let completionTimeout;
  let interruptGraceTimeout;
  const finish = (result) => {
    if (settled) return;
    settled = true;
    removeNotificationHandler();
    removeCloseHandler();
    removeAbortHandler();
    clearTimeout(completionTimeout);
    clearTimeout(interruptGraceTimeout);
    resolveCompletion(result);
  };
  const retireUnconfirmed = (reason) => {
    if (settled || retirementStarted) return;
    retirementStarted = true;
    params
      .retireUnconfirmed()
      .then(() =>
        finish({
          completed: false,
          reason,
        }),
      )
      .catch((error) => {
        log.error("failed to retire unconfirmed codex app-server compaction", {
          threadId: params.threadId,
          turnId: compactionTurnId,
          reason: formatCompactionError(error),
        });
      });
  };
  const requestInterrupt = () => {
    if (settled || !requestStarted || !abortRequested || !compactionTurnId || interruptRequested)
      return;
    interruptRequested = true;
    params.client
      .request(
        "turn/interrupt",
        {
          threadId: params.threadId,
          turnId: compactionTurnId,
        },
        { timeoutMs: Math.max(1, params.interruptGraceMs) },
      )
      .then(() => {
        finish({
          completed: false,
          reason: "codex app-server confirmed native compaction interruption",
        });
      })
      .catch((error) => {
        if (isAlreadyTerminalInterruptError(error)) {
          finish(
            compactionItemCompleted
              ? { completed: true }
              : {
                  completed: false,
                  reason:
                    "codex app-server compaction reached terminal state without a completed compaction item",
                },
          );
          return;
        }
        log.warn("codex app-server compaction interrupt request failed", {
          threadId: params.threadId,
          turnId: compactionTurnId,
          reason: formatCompactionError(error),
        });
      });
  };
  const beginInterruptGrace = () => {
    if (settled || !requestStarted || interruptGraceTimeout) return;
    requestInterrupt();
    interruptGraceTimeout = setTimeout(
      () => {
        log.warn("codex app-server compaction did not reach terminal state after interruption", {
          threadId: params.threadId,
          turnId: compactionTurnId,
          interruptGraceMs: params.interruptGraceMs,
        });
        retireUnconfirmed(
          "codex app-server compaction did not reach terminal state after interruption",
        );
      },
      Math.max(1, params.interruptGraceMs),
    );
    interruptGraceTimeout.unref?.();
  };
  const beginCompletionTimeout = () => {
    completionTimeout = setTimeout(
      () => {
        abortRequested = true;
        beginInterruptGrace();
        log.warn("codex app-server compaction exceeded its completion budget", {
          threadId: params.threadId,
          timeoutMs: params.timeoutMs,
          interruptRequested,
        });
      },
      Math.max(1, params.timeoutMs),
    );
    completionTimeout.unref?.();
  };
  removeNotificationHandler = params.client.addNotificationHandler((notification) => {
    if (!requestStarted) return;
    if (!isJsonObject(notification.params)) return;
    if (readCodexNotificationThreadId(notification.params) !== params.threadId) return;
    const notificationTurnId = readCodexNotificationTurnId(notification.params);
    if (notification.method === "turn/started") {
      compactionTurnId = notificationTurnId;
      requestInterrupt();
      return;
    }
    if (compactionTurnId && notificationTurnId !== compactionTurnId) return;
    const item = readCodexNotificationItem(notification.params);
    if (item?.type === "contextCompaction") {
      if (notification.method === "item/started") {
        compactionTurnId = compactionTurnId ?? notificationTurnId;
        compactionItemId = item.id;
        requestInterrupt();
        return;
      }
      if (notification.method === "item/completed" && compactionItemId === item.id) {
        compactionItemCompleted = true;
        return;
      }
    }
    if (
      notification.method !== "turn/completed" ||
      !compactionTurnId ||
      notificationTurnId !== compactionTurnId
    )
      return;
    const turn = isJsonObject(notification.params.turn) ? notification.params.turn : void 0;
    const status = typeof turn?.status === "string" ? turn.status : void 0;
    if (status !== "completed") {
      finish({
        completed: false,
        reason: `codex app-server compaction turn ended with status ${status ?? "unknown"}`,
      });
      return;
    }
    if (!compactionItemId) {
      finish({
        completed: false,
        reason: "codex app-server compaction turn completed without a compaction item",
      });
      return;
    }
    if (!compactionItemCompleted) {
      finish({
        completed: false,
        reason: "codex app-server compaction turn completed before its compaction item",
      });
      return;
    }
    finish({ completed: true });
  });
  removeCloseHandler = params.client.addCloseHandler(() => {
    retireUnconfirmed("codex app-server closed before native compaction completed");
  });
  if (params.signal) {
    const onAbort = () => {
      abortRequested = true;
      beginInterruptGrace();
    };
    params.signal.addEventListener("abort", onAbort, { once: true });
    removeAbortHandler = () => params.signal?.removeEventListener("abort", onAbort);
    if (params.signal.aborted) onAbort();
  }
  return {
    completion,
    beginRequest: () => {
      requestStarted = true;
      beginCompletionTimeout();
      if (abortRequested) beginInterruptGrace();
    },
    confirmRequestRejected: () =>
      finish({
        completed: false,
        reason: "codex app-server rejected the compaction request",
      }),
    retireUnconfirmedRequest: async (reason) => {
      retireUnconfirmed(reason);
      return await completion;
    },
    cancel: () => {
      if (!requestStarted)
        finish({
          completed: false,
          reason: "compaction request did not start",
        });
    },
  };
}
async function runExclusiveCodexNativeCompaction(threadId, signal, run) {
  const previous = codexNativeCompactionQueues.get(threadId) ?? Promise.resolve();
  let releaseCurrent;
  const current = new Promise((resolve) => {
    releaseCurrent = resolve;
  });
  const queued = previous.then(
    () => current,
    () => current,
  );
  codexNativeCompactionQueues.set(threadId, queued);
  try {
    await waitForCodexNativeCompactionQueue(previous, signal);
    signal?.throwIfAborted();
    return await run();
  } finally {
    releaseCurrent();
    queued.then(() => {
      if (codexNativeCompactionQueues.get(threadId) === queued)
        codexNativeCompactionQueues.delete(threadId);
    });
  }
}
async function waitForCodexNativeCompactionQueue(previous, signal) {
  if (!signal) {
    await previous.catch(() => void 0);
    return;
  }
  signal.throwIfAborted();
  let removeAbortListener = () => {};
  const aborted = new Promise((_, reject) => {
    const onAbort = () => {
      reject(
        signal.reason instanceof Error
          ? signal.reason
          : /* @__PURE__ */ new Error("compaction aborted"),
      );
    };
    removeAbortListener = () => signal.removeEventListener("abort", onAbort);
    signal.addEventListener("abort", onAbort, { once: true });
  });
  try {
    await Promise.race([previous.catch(() => void 0), aborted]);
  } finally {
    removeAbortListener();
  }
}
/**
 * Starts native Codex compaction for a manually requested bound session, or
 * reports why Codex-owned automatic compaction should handle the trigger.
 */
async function maybeCompactCodexAppServerSession(params, options) {
  warnIfIgnoringOpenClawCompactionOverrides(params);
  return compactCodexNativeThread(params, options);
}
function warnIfIgnoringOpenClawCompactionOverrides(params) {
  const ignoredConfig = readIgnoredCompactionOverridePaths(params);
  if (ignoredConfig.length === 0) return;
  const warningKey = ignoredConfig.join("\0");
  if (warnedIgnoredCompactionOverrides.has(warningKey)) return;
  warnedIgnoredCompactionOverrides.add(warningKey);
  log.warn(
    "ignoring OpenClaw compaction overrides for Codex app-server compaction; Codex uses native server-side compaction",
    {
      sessionId: params.sessionId,
      sessionKey: params.sessionKey,
      ignoredConfig,
    },
  );
}
function readIgnoredCompactionOverridePaths(params) {
  const ignored = /* @__PURE__ */ new Set();
  for (const entry of readCompactionOverrideEntries(params)) {
    const localProvider =
      typeof entry.record.provider === "string" ? entry.record.provider.trim() : "";
    const inheritedProvider =
      !localProvider && typeof entry.inheritedRecord?.provider === "string"
        ? entry.inheritedRecord.provider.trim()
        : "";
    const providerPath = localProvider
      ? `${entry.path}.compaction.provider`
      : inheritedProvider && entry.inheritedPath
        ? `${entry.inheritedPath}.compaction.provider`
        : void 0;
    if (typeof entry.record.model === "string" && entry.record.model.trim())
      ignored.add(`${entry.path}.compaction.model`);
    if (providerPath) ignored.add(providerPath);
  }
  return [...ignored];
}
function readCompactionOverrideEntries(params) {
  const entries = [];
  const defaultCompaction = readRecord(readRecord(params.config?.agents)?.defaults)?.compaction;
  const defaultRecord = readRecord(defaultCompaction);
  if (defaultRecord)
    entries.push({
      path: "agents.defaults",
      record: defaultRecord,
    });
  const agentId = readAgentIdFromSessionKey(params.sessionKey ?? params.sandboxSessionKey);
  if (!agentId) return entries;
  const agentCompaction = readRecord(
    (Array.isArray(params.config?.agents?.list) ? params.config.agents.list : []).find((agent) => {
      return (typeof agent?.id === "string" ? agent.id.trim().toLowerCase() : "") === agentId;
    }),
  )?.compaction;
  const agentRecord = readRecord(agentCompaction);
  if (agentRecord)
    entries.push({
      path: `agents.list.${agentId}`,
      record: agentRecord,
      inheritedRecord: defaultRecord,
      inheritedPath: "agents.defaults",
    });
  return entries;
}
function readAgentIdFromSessionKey(sessionKey) {
  const parts = sessionKey?.trim().toLowerCase().split(":").filter(Boolean) ?? [];
  if (parts.length < 3 || parts[0] !== "agent") return;
  return parts[1]?.trim() || void 0;
}
function readRecord(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : void 0;
}
async function compactCodexNativeThread(params, options) {
  if (params.trigger !== "manual" && !options.allowNonManualNativeRequest) {
    log.info("skipping codex app-server compaction for non-manual trigger", {
      sessionId: params.sessionId,
      sessionKey: params.sessionKey,
      trigger: params.trigger,
    });
    return {
      ok: true,
      compacted: false,
      reason: "codex app-server owns automatic compaction",
      result: {
        summary: "",
        firstKeptEntryId: "",
        tokensBefore: params.currentTokenCount ?? 0,
        details: {
          backend: "codex-app-server",
          skipped: true,
          reason: "non_manual_trigger",
          trigger: params.trigger ?? "unknown",
        },
      },
    };
  }
  const nativeExecutionBlock = resolveCodexNativeExecutionBlock({
    config: params.config,
    sessionKey: params.sandboxSessionKey ?? params.sessionKey,
    sessionId: params.sessionId,
    surface: "native compaction",
  });
  if (nativeExecutionBlock)
    return {
      ok: false,
      compacted: false,
      reason: nativeExecutionBlock,
    };
  const bindingIdentity = sessionBindingIdentity({
    sessionId: params.sessionId,
    sessionKey: params.sessionKey,
    agentId: params.agentId,
    config: params.config,
  });
  const initialBinding = await options.bindingStore.read(bindingIdentity);
  if (!initialBinding?.threadId)
    return failedCodexThreadBindingCompactionResult(params, {
      reason: "no codex app-server thread binding",
      recovery: "missing_thread_binding",
    });
  let binding = initialBinding;
  const requestedAuthProfileId = params.authProfileId?.trim() || void 0;
  let connection;
  try {
    const config = params.config ?? {};
    const agentId =
      params.agentId ??
      readAgentIdFromSessionKey(params.sessionKey) ??
      resolveDefaultAgentId(config);
    connection = resolveCodexBindingAppServerConnection({
      binding,
      authProfileId: requestedAuthProfileId ?? binding.authProfileId,
      pluginConfig: options.pluginConfig,
      config,
      agentDir: resolveAgentDir(config, agentId),
    });
  } catch (error) {
    return {
      ok: false,
      compacted: false,
      reason: formatCompactionError(error),
    };
  }
  const { appServer, usesSupervisionConnection } = connection;
  if (
    !usesSupervisionConnection &&
    requestedAuthProfileId &&
    binding.authProfileId &&
    binding.authProfileId !== requestedAuthProfileId
  )
    return {
      ok: false,
      compacted: false,
      reason: "auth profile mismatch for session binding",
    };
  const shouldReleaseDefaultLease = !options.clientFactory;
  const clientFactory = options.clientFactory ?? getLeasedSharedCodexAppServerClient;
  const runtimeAuthPlan = params.runtimeAuthPlan ?? params.runtimePlan?.auth;
  const usesPreparedApiKey =
    !usesSupervisionConnection && runtimeAuthPlan?.modelRoute?.authRequirement === "api-key";
  const preparedApiKey = usesPreparedApiKey ? params.resolvedApiKey?.trim() : void 0;
  if (usesPreparedApiKey && !preparedApiKey)
    return {
      ok: false,
      compacted: false,
      reason: "Prepared Codex Platform compaction route is missing its resolved API key.",
    };
  try {
    return await runExclusiveCodexNativeCompaction(
      binding.threadId,
      params.abortSignal,
      async () => {
        const client = await clientFactory({
          startOptions: appServer.start,
          ...(preparedApiKey
            ? {
                preparedAuth: {
                  kind: "api-key",
                  apiKey: preparedApiKey,
                },
              }
            : { authProfileId: connection.clientAuthProfileId }),
          agentDir: params.agentDir,
          config: params.config,
        });
        const completionWatch = watchCodexNativeCompactionCompletion({
          client,
          threadId: binding.threadId,
          signal: params.abortSignal,
          timeoutMs: options.nativeCompletionTimeoutMs ?? resolveCompactionTimeoutMs(params.config),
          interruptGraceMs:
            options.nativeInterruptGraceMs ?? CODEX_NATIVE_COMPACTION_INTERRUPT_GRACE_MS,
          retireUnconfirmed: async () => {
            const transportStopped = await client.closeAndWait({
              exitTimeoutMs: 5e3,
              forceKillDelayMs: 250,
            });
            if (appServer.start.transport === "stdio") {
              if (transportStopped) return;
              throw new Error("failed to stop unconfirmed codex app-server process");
            }
            if (usesSupervisionConnection)
              throw new Error("cannot detach an unconfirmed supervised codex thread");
            if (
              await options.bindingStore.mutate(bindingIdentity, {
                kind: "clear",
                threadId: binding.threadId,
              })
            )
              return;
            if ((await options.bindingStore.read(bindingIdentity))?.threadId !== binding.threadId)
              return;
            throw new Error("failed to detach unconfirmed codex app-server thread binding");
          },
        });
        const beginNativeCompactionRequest = async (timeoutMs) => {
          completionWatch.beginRequest();
          const requestParams = { threadId: binding.threadId };
          if (timeoutMs === void 0) await client.request("thread/compact/start", requestParams);
          else await client.request("thread/compact/start", requestParams, { timeoutMs });
        };
        const settleNativeCompactionRequestError = async (error) => {
          if (error instanceof CodexAppServerRpcError) completionWatch.confirmRequestRejected();
          else
            await completionWatch.retireUnconfirmedRequest(
              `codex app-server compaction start was unconfirmed: ${formatCompactionError(error)}`,
            );
        };
        try {
          if (options.allowNonManualNativeRequest) {
            const guardedResult = await options.bindingStore.withLease(
              bindingIdentity,
              async () => {
                const currentBinding = await options.bindingStore.read(bindingIdentity);
                if (params.abortSignal?.aborted)
                  return {
                    started: false,
                    result: skippedCodexNativeCompactionResult(params, {
                      reason: "codex app-server compaction aborted before native compaction",
                      code: "aborted_before_native_compaction",
                      expectedThreadId: binding.threadId,
                      currentThreadId: currentBinding?.threadId,
                    }),
                  };
                if (!currentBinding || !isSameNativeCompactionBinding(currentBinding, binding)) {
                  log.warn(
                    "skipping codex app-server compaction because the thread binding changed",
                    {
                      sessionId: params.sessionId,
                      sessionKey: params.sessionKey,
                      expectedThreadId: binding.threadId,
                      currentThreadId: currentBinding?.threadId,
                    },
                  );
                  return {
                    started: false,
                    result: skippedCodexNativeCompactionResult(params, {
                      reason: "codex app-server binding changed before native compaction",
                      code: "binding_changed_before_native_compaction",
                      expectedThreadId: binding.threadId,
                      currentThreadId: currentBinding?.threadId,
                    }),
                  };
                }
                binding = currentBinding;
                await clearContextEngineProjectionBeforeNativeCompaction({
                  sessionId: params.sessionId,
                  bindingStore: options.bindingStore,
                  identity: bindingIdentity,
                  binding,
                });
                try {
                  await beginNativeCompactionRequest(
                    Math.min(
                      appServer.requestTimeoutMs,
                      CODEX_APP_SERVER_BINDING_GUARDED_REQUEST_TIMEOUT_MS,
                    ),
                  );
                  return {
                    started: true,
                    accepted: true,
                  };
                } catch (error) {
                  await options.bindingStore.mutate(bindingIdentity, {
                    kind: "set",
                    binding,
                  });
                  return {
                    started: true,
                    accepted: false,
                    error,
                  };
                }
              },
            );
            if (!guardedResult.started) return guardedResult.result;
            if (!guardedResult.accepted) {
              await settleNativeCompactionRequestError(guardedResult.error);
              throw guardedResult.error;
            }
          } else {
            params.abortSignal?.throwIfAborted();
            try {
              await beginNativeCompactionRequest();
            } catch (error) {
              await settleNativeCompactionRequestError(error);
              throw error;
            }
          }
          log.info("started codex app-server compaction", {
            sessionId: params.sessionId,
            threadId: binding.threadId,
          });
          const completion = await completionWatch.completion;
          if (!completion.completed) throw new Error(completion.reason);
          log.info("completed codex app-server compaction", {
            sessionId: params.sessionId,
            threadId: binding.threadId,
          });
        } catch (error) {
          if (isCodexThreadNotFoundError(error))
            return failedCodexThreadBindingCompactionResult(params, {
              threadId: binding.threadId,
              reason: formatCompactionError(error),
              recovery: "stale_thread_binding",
            });
          log.warn("codex app-server compaction failed", {
            sessionId: params.sessionId,
            sessionKey: params.sessionKey,
            threadId: binding.threadId,
            reason: formatCompactionError(error),
          });
          return {
            ok: false,
            compacted: false,
            reason: formatCompactionError(error),
          };
        } finally {
          completionWatch.cancel();
          if (shouldReleaseDefaultLease) releaseLeasedSharedCodexAppServerClient(client);
        }
        const resultDetails = {
          backend: "codex-app-server",
          threadId: binding.threadId,
          signal: "thread/compact/start",
          pending: false,
          completed: true,
          ...(options.allowNonManualNativeRequest
            ? {
                request: "after_context_engine",
                trigger: params.trigger ?? "unknown",
              }
            : {}),
        };
        return {
          ok: true,
          compacted: true,
          result: {
            summary: "",
            firstKeptEntryId: "",
            tokensBefore: params.currentTokenCount ?? 0,
            details: resultDetails,
          },
        };
      },
    );
  } catch (error) {
    if (params.abortSignal?.aborted) {
      if (options.allowNonManualNativeRequest)
        return skippedCodexNativeCompactionResult(params, {
          reason: "codex app-server compaction aborted before native compaction",
          code: "aborted_before_native_compaction",
          expectedThreadId: initialBinding.threadId,
          currentThreadId: binding.threadId,
        });
      return {
        ok: false,
        compacted: false,
        reason: "codex app-server compaction aborted while waiting to start",
      };
    }
    throw error;
  }
}
function skippedCodexNativeCompactionResult(params, skipped) {
  return {
    ok: true,
    compacted: false,
    reason: skipped.reason,
    result: {
      summary: "",
      firstKeptEntryId: "",
      tokensBefore: params.currentTokenCount ?? 0,
      details: {
        backend: "codex-app-server",
        skipped: true,
        reason: skipped.code,
        request: "after_context_engine",
        trigger: params.trigger ?? "unknown",
        ...(skipped.expectedThreadId ? { expectedThreadId: skipped.expectedThreadId } : {}),
        ...(skipped.currentThreadId ? { currentThreadId: skipped.currentThreadId } : {}),
      },
    },
  };
}
function failedCodexThreadBindingCompactionResult(params, recovery) {
  log.warn("codex app-server compaction could not use thread binding", {
    sessionId: params.sessionId,
    sessionKey: params.sessionKey,
    threadId: recovery.threadId,
    reason: recovery.reason,
    recovery: recovery.recovery,
  });
  return {
    ok: false,
    compacted: false,
    reason: recovery.reason,
    failure: {
      reason: recovery.recovery,
      rawError: recovery.reason,
    },
  };
}
async function clearContextEngineProjectionBeforeNativeCompaction(params) {
  const contextEngineBinding = params.binding.contextEngine;
  if (!contextEngineBinding?.projection) return;
  await params.bindingStore.mutate(params.identity, {
    kind: "patch",
    threadId: params.binding.threadId,
    patch: {
      contextEngine: {
        ...contextEngineBinding,
        projection: void 0,
      },
    },
  });
  log.info("cleared codex context-engine projection before native compaction", {
    sessionId: params.sessionId,
    threadId: params.binding.threadId,
    previousEpoch: contextEngineBinding.projection.epoch,
    previousFingerprint: contextEngineBinding.projection.fingerprint,
  });
}
function isSameNativeCompactionBinding(current, expected) {
  return (
    current.threadId === expected.threadId &&
    current.authProfileId === expected.authProfileId &&
    current.contextEngine?.engineId === expected.contextEngine?.engineId &&
    current.contextEngine?.policyFingerprint === expected.contextEngine?.policyFingerprint &&
    current.contextEngine?.projection?.mode === expected.contextEngine?.projection?.mode &&
    current.contextEngine?.projection?.epoch === expected.contextEngine?.projection?.epoch &&
    current.contextEngine?.projection?.fingerprint ===
      expected.contextEngine?.projection?.fingerprint
  );
}
function isCodexThreadNotFoundError(error) {
  return formatCompactionError(error).toLowerCase().includes("thread not found");
}
function formatCompactionError(error) {
  if (error instanceof Error) return error.message;
  return String(error);
}
//#endregion
export { maybeCompactCodexAppServerSession };
