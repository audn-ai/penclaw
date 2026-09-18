import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import {
  i as failTaskRunByRunId,
  r as createRunningTaskRun,
  t as completeTaskRunByRunId,
  u as startTaskRunByRunId,
} from "./detached-task-runtime-DYTrA0lL.js";
import { r as toErrorObject } from "./error-coercion-CrJRoLe1.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import "./src-Bl7G9qvi.js";
import {
  a as toAcpRuntimeError,
  n as AcpRuntimeError,
  o as withAcpRuntimeErrorBoundary,
  r as formatAcpErrorChain,
  t as ACP_ERROR_CODES,
} from "./errors-BTjUwYsc.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { n as resolveGlobalSingleton } from "./global-singleton-PwlQSEal.js";
import { r as logVerbose } from "./globals-CNUzHTcU.js";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.js";
import {
  a as resolveMainSessionKey,
  n as canonicalizeMainSessionAlias,
} from "./main-session-nrmKYo2W.js";
import {
  a as buildRuntimeConfigOptionPairs,
  c as mergeRuntimeOptions,
  d as resolveRuntimeConfigOptionKey,
  f as resolveRuntimeOptionsFromMeta,
  g as validateRuntimeModeInput,
  i as resolveTurnTimeoutMs,
  l as normalizeRuntimeOptions,
  m as validateRuntimeConfigOptionInput,
  n as awaitTurnWithTimeout,
  o as buildRuntimeControlSignature,
  p as runtimeOptionsEqual,
  r as cleanupTimedOutTurn,
  s as inferRuntimeOptionPatchFromConfigOption,
  v as validateRuntimeOptionPatch,
} from "./manager.turn-timeout-DXXvfPFH.js";
import { n as asNullableRecord } from "./record-coerce-DHZ4bFlT.js";
import { r as requireAcpRuntimeBackend, t as getAcpRuntimeBackend } from "./registry-BVG2dQ33.js";
import { y as resolveRuntimeConfigCacheKey } from "./runtime-snapshot-BbbqRiDR.js";
import {
  a as identityHasStableSessionId,
  c as resolveRuntimeHandleIdentifiersFromIdentity,
  i as identityEquals,
  l as resolveRuntimeResumeSessionId,
  n as createIdentityFromHandleEvent,
  o as isSessionIdentityPending,
  r as createIdentityFromStatus,
  s as mergeSessionIdentity,
  t as createIdentityFromEnsure,
  u as resolveSessionIdentityFromMeta,
} from "./session-identity-D29-Iouw.js";
import { l as normalizeMainKey } from "./session-key-druuY-GG.js";
import "./errors-CDrK1ZOW.js";
import { c as parseAgentSessionKey, n as isAcpSessionKey } from "./session-key-utils-B8sNp9l4.js";
import {
  n as readAcpSessionEntry,
  o as upsertAcpSessionMeta,
  t as listAcpSessionEntries,
} from "./session-meta-IQvNG5NK.js";
import {
  p as recordSubagentTerminalState,
  u as recordSessionHumanDirectMessage,
} from "./session-state-events-DXdC9X_q.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
} from "./string-coerce-DW4mBlAt.js";
import { n as resolveRequiredCompletionTerminalResult } from "./task-completion-contract-CVdE344F.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region src/acp/control-plane/manager.utils.ts
/** Shared ACP manager normalization, resolution, and error helpers. */
/** Resolves the agent id encoded in an ACP session key. */
function resolveAcpAgentFromSessionKey(sessionKey, fallback = "main") {
  return normalizeAgentId(parseAgentSessionKey(sessionKey)?.agentId ?? fallback);
}
/** Builds the stale-session error shown when ACP metadata is missing. */
function resolveMissingMetaError(sessionKey) {
  return new AcpRuntimeError(
    "ACP_SESSION_INIT_FAILED",
    `ACP metadata is missing for ${sessionKey}. Recreate this ACP session with /acp spawn and rebind the thread.`,
  );
}
/** Converts a session resolution union into the runtime error callers should throw. */
function resolveAcpSessionResolutionError(resolution) {
  if (resolution.kind === "ready") return null;
  if (resolution.kind === "stale") return resolution.error;
  return new AcpRuntimeError(
    "ACP_SESSION_INIT_FAILED",
    `Session is not ACP-enabled: ${resolution.sessionKey}`,
  );
}
/** Returns ready ACP metadata or throws the matching resolution error. */
function requireReadySessionMeta(resolution) {
  if (resolution.kind === "ready") return resolution.meta;
  throw toErrorObject(resolveAcpSessionResolutionError(resolution), "Non-Error thrown");
}
function normalizeSessionKey(sessionKey) {
  return sessionKey.trim();
}
/** Canonicalizes aliases and main-session keys before ACP metadata lookup. */
function canonicalizeAcpSessionKey(params) {
  const normalized = normalizeSessionKey(params.sessionKey);
  if (!normalized) return "";
  const lowered = normalizeLowercaseStringOrEmpty(normalized);
  if (lowered === "global" || lowered === "unknown") return lowered;
  const parsed = parseAgentSessionKey(lowered);
  if (parsed)
    return canonicalizeMainSessionAlias({
      cfg: params.cfg,
      agentId: parsed.agentId,
      sessionKey: lowered,
    });
  const mainKey = normalizeMainKey(params.cfg.session?.mainKey);
  if (lowered === "main" || lowered === mainKey) return resolveMainSessionKey(params.cfg);
  return lowered;
}
/** Normalizes session keys for process-local actor maps. */
function normalizeActorKey(sessionKey) {
  return normalizeLowercaseStringOrEmpty(sessionKey);
}
/** Restricts runtime-provided error codes to the ACP error-code enum. */
function normalizeAcpErrorCode(code) {
  if (!code) return "ACP_TURN_FAILED";
  const normalized = code.trim().toUpperCase();
  for (const allowed of ACP_ERROR_CODES) if (allowed === normalized) return allowed;
  return "ACP_TURN_FAILED";
}
function createUnsupportedControlError(params) {
  return new AcpRuntimeError(
    "ACP_BACKEND_UNSUPPORTED_CONTROL",
    `ACP backend "${params.backend}" does not support ${params.control}.`,
  );
}
function resolveRuntimeIdleTtlMs(cfg) {
  const ttlMinutes = cfg.acp?.runtime?.ttlMinutes;
  if (typeof ttlMinutes !== "number" || !Number.isFinite(ttlMinutes) || ttlMinutes <= 0) return 0;
  return Math.round(ttlMinutes * 60 * 1e3);
}
function hasLegacyAcpIdentityProjection(meta) {
  const raw = meta;
  return (
    Object.hasOwn(raw, "backendSessionId") ||
    Object.hasOwn(raw, "agentSessionId") ||
    Object.hasOwn(raw, "sessionIdsProvisional")
  );
}
//#endregion
//#region src/acp/control-plane/manager.cancel-session.ts
/** Cancels either the active ACP turn or the idle runtime handle for a session. */
async function runManagerCancelSession(params) {
  const actorKey = normalizeActorKey(params.sessionKey);
  const activeTurn = params.activeTurnBySession.get(actorKey);
  if (activeTurn) {
    await cancelActiveTurn({
      activeTurn,
      reason: params.reason,
    });
    return;
  }
  await params.withSessionActor(params.sessionKey, async () => {
    const resolvedMeta = requireReadySessionMeta(
      params.resolveSession({
        cfg: params.cfg,
        sessionKey: params.sessionKey,
      }),
    );
    const { runtime, handle } = await params.ensureRuntimeHandle({
      cfg: params.cfg,
      sessionKey: params.sessionKey,
      meta: resolvedMeta,
    });
    try {
      await cancelRuntimeHandle({
        runtime,
        handle,
        reason: params.reason,
      });
      await params.setSessionState({
        cfg: params.cfg,
        sessionKey: params.sessionKey,
        state: "idle",
        clearLastError: true,
      });
    } catch (error) {
      const acpError = normalizeCancelError(error);
      await params.setSessionState({
        cfg: params.cfg,
        sessionKey: params.sessionKey,
        state: "error",
        lastError: acpError.message,
      });
      throw acpError;
    }
  });
}
async function cancelActiveTurn(params) {
  params.activeTurn.abortController.abort();
  if (!params.activeTurn.cancelPromise)
    params.activeTurn.cancelPromise = params.activeTurn.runtime.cancel({
      handle: params.activeTurn.handle,
      reason: params.reason,
    });
  await withAcpRuntimeErrorBoundary({
    run: async () => await params.activeTurn.cancelPromise,
    fallbackCode: "ACP_TURN_FAILED",
    fallbackMessage: "ACP cancel failed before completion.",
  });
}
async function cancelRuntimeHandle(params) {
  await withAcpRuntimeErrorBoundary({
    run: async () =>
      await params.runtime.cancel({
        handle: params.handle,
        reason: params.reason,
      }),
    fallbackCode: "ACP_TURN_FAILED",
    fallbackMessage: "ACP cancel failed before completion.",
  });
}
function normalizeCancelError(error) {
  return toAcpRuntimeError({
    error,
    fallbackCode: "ACP_TURN_FAILED",
    fallbackMessage: "ACP cancel failed before completion.",
  });
}
//#endregion
//#region src/acp/control-plane/manager.runtime-resume-state.ts
/** Recovery helpers for stale ACP persistent session ids and early runtime exits. */
/** Detects acpx exits that are safe to retry with a fresh runtime handle. */
function isRecoverableManagerAcpxExitError(message) {
  return /^acpx exited with (code \d+|signal [a-z0-9]+)/i.test(message.trim());
}
/** acpx detail code for a persistent session that can no longer be resumed and must be re-created. */
const SESSION_RESUME_REQUIRED_DETAIL_CODE = "SESSION_RESUME_REQUIRED";
/**
 * Detects a "persistent session can no longer be resumed" failure by acpx's
 * structured detail code, on the error itself or anywhere in its cause chain.
 * Keying on the structured code rather than the human reason text is what makes
 * recovery independent of the backend's wording — Claude reports "Resource not
 * found", Kiro reports "Internal error" (RequestError -32603), but both wrap a
 * SessionResumeRequiredError; matching the reason text missed Kiro and left the
 * thread permanently stuck (#87830).
 */
function isRecoverableMissingManagerPersistentSessionError(error) {
  let current = error;
  for (let depth = 0; current && depth < 8; depth += 1) {
    if (current.detailCode === SESSION_RESUME_REQUIRED_DETAIL_CODE) return true;
    current = current.cause;
  }
  return false;
}
/** Prepares a one-time fresh-handle retry for recoverable pre-output runtime failures. */
async function prepareFreshManagerRuntimeHandleRetry(params) {
  if (params.attempt > 0 || params.sawTurnOutput) return false;
  if (isRecoverableManagerAcpxExitError(params.error.message)) {
    params.runtimeHandles.clear(params.sessionKey);
    logVerbose(
      `acp-manager: retrying ${params.sessionKey} with a fresh runtime handle after early turn failure: ${params.error.message}`,
    );
    return true;
  }
  if (
    !params.runtime ||
    !params.meta ||
    params.meta.mode !== "persistent" ||
    !isRecoverableMissingManagerPersistentSessionError(params.error)
  )
    return false;
  if (
    !(await clearPersistedRuntimeResumeState({
      cfg: params.cfg,
      sessionKey: params.sessionKey,
      writeSessionMeta: params.writeSessionMeta,
    }))
  )
    return false;
  if (params.runtime.prepareFreshSession)
    try {
      await params.runtime.prepareFreshSession({ sessionKey: params.sessionKey });
    } catch (error) {
      logVerbose(
        `acp-manager: failed preparing a fresh persistent session for ${params.sessionKey}: ${formatErrorMessage(error)}`,
      );
      return false;
    }
  params.runtimeHandles.clear(params.sessionKey);
  logVerbose(
    `acp-manager: retrying ${params.sessionKey} with a fresh persistent session after missing backend resume target: ${params.error.message}`,
  );
  return true;
}
async function clearPersistedRuntimeResumeState(params) {
  const now = Date.now();
  if (
    !(await params.writeSessionMeta({
      cfg: params.cfg,
      sessionKey: params.sessionKey,
      mutate: (current, entry) => {
        if (!entry) return null;
        const base = current;
        if (!base) return null;
        const currentIdentity = resolveSessionIdentityFromMeta(base);
        if (!currentIdentity?.acpxSessionId && !currentIdentity?.agentSessionId) return base;
        const nextIdentity = {
          state: "pending",
          ...(currentIdentity.acpxRecordId ? { acpxRecordId: currentIdentity.acpxRecordId } : {}),
          source: currentIdentity.source,
          lastUpdatedAt: now,
        };
        return {
          backend: base.backend,
          agent: base.agent,
          runtimeSessionName: base.runtimeSessionName,
          identity: nextIdentity,
          mode: base.mode,
          ...(base.runtimeOptions ? { runtimeOptions: base.runtimeOptions } : {}),
          ...(base.cwd ? { cwd: base.cwd } : {}),
          state: base.state,
          lastActivityAt: now,
          ...(base.lastError ? { lastError: base.lastError } : {}),
        };
      },
    }))
  ) {
    logVerbose(
      `acp-manager: unable to clear persisted runtime resume state for ${params.sessionKey}`,
    );
    return false;
  }
  return true;
}
/** Clears persisted runtime resume identifiers while preserving the manager session shell. */
async function discardPersistedManagerRuntimeState(params) {
  const now = Date.now();
  await params.writeSessionMeta({
    cfg: params.cfg,
    sessionKey: params.sessionKey,
    mutate: (current, entry) => {
      if (!entry) return null;
      const base = current;
      if (!base) return null;
      const currentIdentity = resolveSessionIdentityFromMeta(base);
      const nextIdentity = currentIdentity
        ? {
            state: "pending",
            ...(currentIdentity.acpxRecordId ? { acpxRecordId: currentIdentity.acpxRecordId } : {}),
            source: currentIdentity.source,
            lastUpdatedAt: now,
          }
        : void 0;
      return {
        backend: base.backend,
        agent: base.agent,
        runtimeSessionName: base.runtimeSessionName,
        ...(nextIdentity ? { identity: nextIdentity } : {}),
        mode: base.mode,
        ...(base.runtimeOptions ? { runtimeOptions: base.runtimeOptions } : {}),
        ...(base.cwd ? { cwd: base.cwd } : {}),
        state: "idle",
        lastActivityAt: now,
      };
    },
    failOnError: true,
  });
}
async function tryPrepareFreshManagerRuntimeSession(params) {
  const configuredBackend = (params.meta.backend || params.cfg.acp?.backend || "").trim();
  try {
    const backend = params.deps.getRuntimeBackend(configuredBackend || void 0);
    if (!backend) {
      if (params.missingBackendError)
        throw toErrorObject(params.missingBackendError, "Non-Error thrown");
      return;
    }
    await backend.runtime.prepareFreshSession?.({ sessionKey: params.sessionKey });
  } catch (error) {
    logVerbose(
      `${params.logPrefix}: unable to prepare fresh session for ${params.sessionKey}: ${formatErrorMessage(error)}`,
    );
  }
}
//#endregion
//#region src/acp/control-plane/manager.close-session.ts
/** Close/reset path for ACP runtime sessions and persisted manager metadata. */
/** Closes an ACP session runtime handle and optionally discards persistent state/meta. */
async function runManagerCloseSession(params) {
  const { input, sessionKey } = params;
  const resolution = params.resolveSession({
    cfg: input.cfg,
    sessionKey,
  });
  const resolutionError = resolveAcpSessionResolutionError(resolution);
  if (resolutionError) {
    if (input.requireAcpSession ?? true) throw resolutionError;
    return {
      runtimeClosed: false,
      metaCleared: false,
    };
  }
  const meta = requireReadySessionMeta(resolution);
  const currentIdentity = resolveSessionIdentityFromMeta(meta);
  const shouldSkipRuntimeClose =
    input.discardPersistentState &&
    currentIdentity != null &&
    !identityHasStableSessionId(currentIdentity);
  let runtimeClosed = false;
  let runtimeNotice;
  if (shouldSkipRuntimeClose) {
    await tryPrepareFreshManagerRuntimeSession({
      deps: params.deps,
      cfg: input.cfg,
      meta,
      sessionKey,
      logPrefix: "acp close fast-reset",
    });
    params.runtimeHandles.clear(sessionKey);
  } else
    try {
      const { runtime: ensuredRuntime, handle } = await params.ensureRuntimeHandle({
        cfg: input.cfg,
        sessionKey,
        meta,
      });
      await withAcpRuntimeErrorBoundary({
        run: async () =>
          await ensuredRuntime.close({
            handle,
            reason: input.reason,
            discardPersistentState: input.discardPersistentState,
          }),
        fallbackCode: "ACP_TURN_FAILED",
        fallbackMessage: "ACP close failed before completion.",
      });
      runtimeClosed = true;
      params.runtimeHandles.clear(sessionKey);
    } catch (error) {
      const acpError = toAcpRuntimeError({
        error,
        fallbackCode: "ACP_TURN_FAILED",
        fallbackMessage: "ACP close failed before completion.",
      });
      if (
        input.allowBackendUnavailable &&
        (acpError.code === "ACP_BACKEND_MISSING" ||
          acpError.code === "ACP_BACKEND_UNAVAILABLE" ||
          (input.discardPersistentState && acpError.code === "ACP_SESSION_INIT_FAILED") ||
          (input.discardPersistentState && acpError.code === "ACP_BACKEND_UNSUPPORTED_CONTROL") ||
          isRecoverableManagerAcpxExitError(acpError.message))
      ) {
        if (input.discardPersistentState)
          await tryPrepareFreshManagerRuntimeSession({
            deps: params.deps,
            cfg: input.cfg,
            meta,
            sessionKey,
            logPrefix: "acp close recovery",
            missingBackendError: acpError,
          });
        params.runtimeHandles.clear(sessionKey);
        runtimeNotice = acpError.message;
      } else throw acpError;
    }
  let metaCleared = false;
  if (input.discardPersistentState && !input.clearMeta)
    await discardPersistedManagerRuntimeState({
      cfg: input.cfg,
      sessionKey,
      writeSessionMeta: params.writeSessionMeta,
    });
  if (input.clearMeta) {
    await params.writeSessionMeta({
      cfg: input.cfg,
      sessionKey,
      mutate: (_current, entry) => {
        if (!entry) return null;
        return null;
      },
      failOnError: true,
    });
    metaCleared = true;
  }
  return {
    runtimeClosed,
    runtimeNotice,
    metaCleared,
  };
}
//#endregion
//#region src/acp/control-plane/manager.identity-reconcile.ts
/** Reconciles ACP runtime identity observations back into persisted session metadata. */
/** Reconciles runtime-reported session identifiers into persisted ACP session metadata. */
async function reconcileManagerRuntimeSessionIdentifiers(params) {
  let runtimeStatus = params.runtimeStatus;
  if (!runtimeStatus && params.runtime.getStatus)
    try {
      runtimeStatus = await withAcpRuntimeErrorBoundary({
        run: async () => await params.runtime.getStatus({ handle: params.handle }),
        fallbackCode: "ACP_TURN_FAILED",
        fallbackMessage: "Could not read ACP runtime status.",
      });
    } catch (error) {
      if (params.failOnStatusError) throw error;
      logVerbose(
        `acp-manager: failed to refresh ACP runtime status for ${params.sessionKey}: ${String(error)}`,
      );
      return {
        handle: params.handle,
        meta: params.meta,
        runtimeStatus,
      };
    }
  const now = Date.now();
  const currentIdentity = resolveSessionIdentityFromMeta(params.meta);
  const identityAfterEvent =
    mergeSessionIdentity({
      current: currentIdentity,
      incoming: createIdentityFromHandleEvent({
        handle: params.handle,
        now,
      }),
      now,
    }) ?? currentIdentity;
  const nextIdentity =
    mergeSessionIdentity({
      current: identityAfterEvent,
      incoming: createIdentityFromStatus({
        status: runtimeStatus,
        now,
      }),
      now,
    }) ?? identityAfterEvent;
  const handleIdentifiers = resolveRuntimeHandleIdentifiersFromIdentity(nextIdentity);
  const handleChanged =
    handleIdentifiers.backendSessionId !== params.handle.backendSessionId ||
    handleIdentifiers.agentSessionId !== params.handle.agentSessionId;
  const nextHandle = handleChanged
    ? {
        ...params.handle,
        ...(handleIdentifiers.backendSessionId
          ? { backendSessionId: handleIdentifiers.backendSessionId }
          : {}),
        ...(handleIdentifiers.agentSessionId
          ? { agentSessionId: handleIdentifiers.agentSessionId }
          : {}),
      }
    : params.handle;
  if (handleChanged) params.setCachedHandle(params.sessionKey, nextHandle);
  if (
    !(!identityEquals(currentIdentity, nextIdentity) || hasLegacyAcpIdentityProjection(params.meta))
  )
    return {
      handle: nextHandle,
      meta: params.meta,
      runtimeStatus,
    };
  const nextMeta = {
    backend: params.meta.backend,
    agent: params.meta.agent,
    runtimeSessionName: params.meta.runtimeSessionName,
    ...(nextIdentity ? { identity: nextIdentity } : {}),
    mode: params.meta.mode,
    ...(params.meta.runtimeOptions ? { runtimeOptions: params.meta.runtimeOptions } : {}),
    ...(params.meta.cwd ? { cwd: params.meta.cwd } : {}),
    lastActivityAt: now,
    state: params.meta.state,
    ...(params.meta.lastError ? { lastError: params.meta.lastError } : {}),
  };
  if (!identityEquals(currentIdentity, nextIdentity)) {
    const currentAgentSessionId = currentIdentity?.agentSessionId ?? "<none>";
    const nextAgentSessionId = nextIdentity?.agentSessionId ?? "<none>";
    const currentAcpxSessionId = currentIdentity?.acpxSessionId ?? "<none>";
    const nextAcpxSessionId = nextIdentity?.acpxSessionId ?? "<none>";
    const currentAcpxRecordId = currentIdentity?.acpxRecordId ?? "<none>";
    const nextAcpxRecordId = nextIdentity?.acpxRecordId ?? "<none>";
    logVerbose(
      `acp-manager: session identity updated for ${params.sessionKey} (agentSessionId ${currentAgentSessionId} -> ${nextAgentSessionId}, acpxSessionId ${currentAcpxSessionId} -> ${nextAcpxSessionId}, acpxRecordId ${currentAcpxRecordId} -> ${nextAcpxRecordId})`,
    );
  }
  await params.writeSessionMeta({
    cfg: params.cfg,
    sessionKey: params.sessionKey,
    mutate: (current, entry) => {
      if (!entry) return null;
      const base = current;
      if (!base) return null;
      return {
        backend: base.backend,
        agent: base.agent,
        runtimeSessionName: base.runtimeSessionName,
        ...(nextIdentity ? { identity: nextIdentity } : {}),
        mode: base.mode,
        ...(base.runtimeOptions ? { runtimeOptions: base.runtimeOptions } : {}),
        ...(base.cwd ? { cwd: base.cwd } : {}),
        state: base.state,
        lastActivityAt: now,
        ...(base.lastError ? { lastError: base.lastError } : {}),
      };
    },
  });
  return {
    handle: nextHandle,
    meta: nextMeta,
    runtimeStatus,
  };
}
//#endregion
//#region src/acp/control-plane/manager.initialize-session.ts
/** Session initialization path for ACP runtime handles and persisted manager metadata. */
/** Initializes an ACP runtime session and persists its metadata before caching the handle. */
async function runManagerInitializeSession(params) {
  const { input, sessionKey } = params;
  const backend = params.deps.requireRuntimeBackend(input.backendId || input.cfg.acp?.backend);
  const runtime = backend.runtime;
  const agent = normalizeAgentId(input.agent);
  const initialRuntimeOptions = validateRuntimeOptionPatch({
    ...input.runtimeOptions,
    ...(input.cwd !== void 0 ? { cwd: input.cwd } : {}),
  });
  const requestedCwd = initialRuntimeOptions.cwd;
  const requestedModel = initialRuntimeOptions.model;
  const requestedThinking = initialRuntimeOptions.thinking;
  params.enforceConcurrentSessionLimit({
    cfg: input.cfg,
    sessionKey,
  });
  const handle = await withAcpRuntimeErrorBoundary({
    run: async () =>
      await runtime.ensureSession({
        sessionKey,
        agent,
        mode: input.mode,
        resumeSessionId: input.resumeSessionId,
        ...(requestedModel ? { model: requestedModel } : {}),
        ...(requestedThinking ? { thinking: requestedThinking } : {}),
        cwd: requestedCwd,
      }),
    fallbackCode: "ACP_SESSION_INIT_FAILED",
    fallbackMessage: "Could not initialize ACP session runtime.",
  });
  const effectiveCwd = normalizeOptionalString(handle.cwd) ?? requestedCwd;
  const effectiveRuntimeOptions = normalizeRuntimeOptions({
    ...initialRuntimeOptions,
    ...(effectiveCwd ? { cwd: effectiveCwd } : {}),
  });
  const identityNow = Date.now();
  const initializedIdentity = mergeSessionIdentity({
    current: void 0,
    incoming: createIdentityFromEnsure({
      handle,
      now: identityNow,
    }),
    now: identityNow,
  }) ?? {
    state: "pending",
    source: "ensure",
    lastUpdatedAt: identityNow,
  };
  const meta = {
    backend: handle.backend || backend.id,
    agent,
    runtimeSessionName: handle.runtimeSessionName,
    identity: initializedIdentity,
    mode: input.mode,
    ...(Object.keys(effectiveRuntimeOptions).length > 0
      ? { runtimeOptions: effectiveRuntimeOptions }
      : {}),
    cwd: effectiveCwd,
    state: "idle",
    lastActivityAt: Date.now(),
  };
  if (
    !(
      await persistInitializedSessionMeta({
        cfg: input.cfg,
        sessionKey,
        meta,
        runtime,
        handle,
        writeSessionMeta: params.writeSessionMeta,
      })
    )?.acp
  )
    throw new AcpRuntimeError(
      "ACP_SESSION_INIT_FAILED",
      `Could not persist ACP metadata for ${sessionKey}.`,
    );
  params.runtimeHandles.set(sessionKey, {
    runtime,
    handle,
    backend: handle.backend || backend.id,
    agent,
    mode: input.mode,
    cwd: effectiveCwd,
    configSignature: resolveRuntimeConfigCacheKey(input.cfg),
  });
  return {
    runtime,
    handle,
    meta,
  };
}
async function persistInitializedSessionMeta(params) {
  try {
    const persisted = await params.writeSessionMeta({
      cfg: params.cfg,
      sessionKey: params.sessionKey,
      mutate: () => params.meta,
      failOnError: true,
    });
    if (persisted?.acp) return persisted;
  } catch (error) {
    await closeRuntimeAfterInitMetaFailure(params);
    throw error;
  }
  await closeRuntimeAfterInitMetaFailure(params);
  return null;
}
async function closeRuntimeAfterInitMetaFailure(params) {
  await params.runtime
    .close({
      handle: params.handle,
      reason: "init-meta-failed",
    })
    .catch((closeError) => {
      logVerbose(
        `acp-manager: cleanup close failed after metadata write error for ${params.sessionKey}: ${String(closeError)}`,
      );
    });
}
//#endregion
//#region src/acp/control-plane/manager.runtime-controls.ts
const OPTIONAL_TIMEOUT_CONFIG_KEYS = /* @__PURE__ */ new Set(["timeout", "timeout_seconds"]);
function extractConfigOptionKeys(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry) => {
      if (typeof entry === "string") return normalizeOptionalString(entry);
      const record = asNullableRecord(entry);
      return normalizeOptionalString(record?.id ?? record?.key);
    })
    .filter(Boolean);
}
function extractRuntimeStatusConfigOptionKeys(status) {
  const details = asNullableRecord(status?.details);
  return [
    ...extractConfigOptionKeys(details?.configOptions),
    ...extractConfigOptionKeys(details?.config_options),
  ];
}
function isOptionalTimeoutConfigKey(key) {
  return OPTIONAL_TIMEOUT_CONFIG_KEYS.has(normalizeLowercaseStringOrEmpty(key));
}
function isUnsupportedOptionalTimeoutConfigRejection(key, error) {
  if (!isOptionalTimeoutConfigKey(key)) return false;
  if (
    (error && typeof error === "object" ? error.code : null) === "ACP_BACKEND_UNSUPPORTED_CONTROL"
  )
    return true;
  const normalized = normalizeLowercaseStringOrEmpty(
    error instanceof Error ? error.message : typeof error === "string" ? error : String(error),
  );
  return (
    normalized.includes("session/set_config_option") &&
    (normalized.includes("-32602") ||
      normalized.includes("invalid params") ||
      normalized.includes("unsupported") ||
      normalized.includes("not supported") ||
      normalized.includes("not implement"))
  );
}
/** Resolves backend-advertised controls plus locally inferred runtime control support. */
async function resolveManagerRuntimeCapabilities(params) {
  let reported;
  if (params.runtime.getCapabilities)
    reported = await withAcpRuntimeErrorBoundary({
      run: async () => await params.runtime.getCapabilities({ handle: params.handle }),
      fallbackCode: "ACP_TURN_FAILED",
      fallbackMessage: "Could not read ACP runtime capabilities.",
    });
  const controls = new Set(reported?.controls ?? []);
  if (params.runtime.setMode) controls.add("session/set_mode");
  if (params.runtime.setConfigOption) controls.add("session/set_config_option");
  if (params.runtime.getStatus) controls.add("session/status");
  const normalizedKeys = new Set(
    (reported?.configOptionKeys ?? [])
      .map((entry) => normalizeOptionalString(entry))
      .filter(Boolean),
  );
  if (normalizedKeys.size === 0 && params.includeStatusConfigOptionKeys && params.runtime.getStatus)
    try {
      const status = await params.runtime.getStatus({ handle: params.handle });
      for (const key of extractRuntimeStatusConfigOptionKeys(status)) normalizedKeys.add(key);
    } catch {}
  return {
    controls: [...controls].toSorted(),
    ...(normalizedKeys.size > 0 ? { configOptionKeys: [...normalizedKeys] } : {}),
  };
}
/** Applies persisted runtime options to a live handle once per unique option signature. */
async function applyManagerRuntimeControls(params) {
  const options = resolveRuntimeOptionsFromMeta(params.meta);
  const signature = buildRuntimeControlSignature(options);
  const cached = params.getCachedRuntimeState(params.sessionKey);
  if (cached?.appliedControlSignature === signature) return;
  const needsConfigOptionKeys = buildRuntimeConfigOptionPairs(options).length > 0;
  const capabilities = await resolveManagerRuntimeCapabilities({
    runtime: params.runtime,
    handle: params.handle,
    includeStatusConfigOptionKeys: needsConfigOptionKeys,
  });
  const backend = params.handle.backend || params.meta.backend;
  const runtimeMode = normalizeOptionalString(options.runtimeMode);
  const configOptions = buildRuntimeConfigOptionPairs(options, capabilities.configOptionKeys);
  const advertisedKeys = new Set(
    (capabilities.configOptionKeys ?? [])
      .map((entry) => normalizeLowercaseStringOrEmpty(entry))
      .filter(Boolean),
  );
  await withAcpRuntimeErrorBoundary({
    run: async () => {
      if (runtimeMode) {
        if (!capabilities.controls.includes("session/set_mode") || !params.runtime.setMode)
          throw createUnsupportedControlError({
            backend,
            control: "session/set_mode",
          });
        await params.runtime.setMode({
          handle: params.handle,
          mode: runtimeMode,
        });
      }
      if (configOptions.length > 0) {
        if (
          !capabilities.controls.includes("session/set_config_option") ||
          !params.runtime.setConfigOption
        )
          throw createUnsupportedControlError({
            backend,
            control: "session/set_config_option",
          });
        for (const [key, value] of configOptions) {
          if (advertisedKeys.size > 0 && !advertisedKeys.has(normalizeLowercaseStringOrEmpty(key)))
            throw new AcpRuntimeError(
              "ACP_BACKEND_UNSUPPORTED_CONTROL",
              `ACP backend "${backend}" does not accept config key "${key}".`,
            );
          try {
            await params.runtime.setConfigOption({
              handle: params.handle,
              key,
              value,
            });
          } catch (error) {
            if (isUnsupportedOptionalTimeoutConfigRejection(key, error)) continue;
            throw error;
          }
        }
      }
    },
    fallbackCode: "ACP_TURN_FAILED",
    fallbackMessage: "Could not apply ACP runtime options before turn execution.",
  });
  if (cached) cached.appliedControlSignature = signature;
}
//#endregion
//#region src/acp/control-plane/runtime-cache.ts
/** Map-backed cache that tracks last-touch time per actor key. */
var RuntimeCache = class {
  constructor() {
    this.cache = /* @__PURE__ */ new Map();
  }
  size() {
    return this.cache.size;
  }
  has(actorKey) {
    return this.cache.has(actorKey);
  }
  get(actorKey, params = {}) {
    const entry = this.cache.get(actorKey);
    if (!entry) return null;
    if (params.touch !== false) entry.lastTouchedAt = params.now ?? Date.now();
    return entry.state;
  }
  peek(actorKey) {
    return this.get(actorKey, { touch: false });
  }
  getLastTouchedAt(actorKey) {
    return this.cache.get(actorKey)?.lastTouchedAt ?? null;
  }
  set(actorKey, state, params = {}) {
    this.cache.set(actorKey, {
      state,
      lastTouchedAt: params.now ?? Date.now(),
    });
  }
  clear(actorKey) {
    this.cache.delete(actorKey);
  }
  snapshot(params = {}) {
    const now = params.now ?? Date.now();
    const entries = [];
    for (const [actorKey, entry] of this.cache.entries())
      entries.push({
        actorKey,
        state: entry.state,
        lastTouchedAt: entry.lastTouchedAt,
        idleMs: Math.max(0, now - entry.lastTouchedAt),
      });
    return entries;
  }
  collectIdleCandidates(params) {
    if (!Number.isFinite(params.maxIdleMs) || params.maxIdleMs <= 0) return [];
    const now = params.now ?? Date.now();
    return this.snapshot({ now }).filter((entry) => entry.idleMs >= params.maxIdleMs);
  }
};
//#endregion
//#region src/acp/control-plane/manager.runtime-handle-cache.ts
/** Process-local ACP runtime handle cache with idle eviction and reuse checks. */
/** Process-local cache of live ACP runtime handles keyed by canonical session actor. */
var ManagerRuntimeHandleCache = class {
  constructor() {
    this.runtimeCache = new RuntimeCache();
    this.evictedRuntimeCount = 0;
  }
  size() {
    return this.runtimeCache.size();
  }
  has(sessionKey) {
    return this.runtimeCache.has(normalizeActorKey(sessionKey));
  }
  get(sessionKey) {
    return this.runtimeCache.get(normalizeActorKey(sessionKey));
  }
  set(sessionKey, state) {
    this.runtimeCache.set(normalizeActorKey(sessionKey), state);
  }
  clear(sessionKey) {
    this.runtimeCache.clear(normalizeActorKey(sessionKey));
  }
  /** Returns cache counters used by ACP manager observability snapshots. */
  getObservabilitySnapshot(cfg) {
    return {
      activeSessions: this.runtimeCache.size(),
      idleTtlMs: resolveRuntimeIdleTtlMs(cfg),
      evictedTotal: this.evictedRuntimeCount,
      ...(this.lastEvictedAt ? { lastEvictedAt: this.lastEvictedAt } : {}),
    };
  }
  /** Closes and removes one cached runtime handle when present. */
  async close(params) {
    const cached = this.get(params.sessionKey);
    if (!cached) return;
    try {
      await cached.runtime.close({
        handle: cached.handle,
        reason: params.reason,
      });
    } catch (error) {
      logVerbose(
        `acp-manager: cached runtime close failed for ${params.sessionKey}: ${String(error)}`,
      );
    } finally {
      this.clear(params.sessionKey);
    }
  }
  /** Clears a cached handle only when the caller still owns the same runtime identifiers. */
  clearIfHandleMatches(params) {
    const cached = this.get(params.sessionKey);
    if (!cached || !this.runtimeHandlesMatch(cached.handle, params.handle)) return;
    this.clear(params.sessionKey);
  }
  /** Closes handles that exceeded the configured idle TTL without racing active turns. */
  async evictIdle(params) {
    const idleTtlMs = resolveRuntimeIdleTtlMs(params.cfg);
    if (idleTtlMs <= 0 || this.runtimeCache.size() === 0) return;
    const now = Date.now();
    const candidates = this.runtimeCache.collectIdleCandidates({
      maxIdleMs: idleTtlMs,
      now,
    });
    if (candidates.length === 0) return;
    for (const candidate of candidates)
      await params.actorQueue.run(candidate.actorKey, async () => {
        if (params.activeTurnBySession.has(candidate.actorKey)) return;
        const lastTouchedAt = this.runtimeCache.getLastTouchedAt(candidate.actorKey);
        if (lastTouchedAt == null || now - lastTouchedAt < idleTtlMs) return;
        const cached = this.runtimeCache.peek(candidate.actorKey);
        if (!cached) return;
        this.runtimeCache.clear(candidate.actorKey);
        this.evictedRuntimeCount += 1;
        this.lastEvictedAt = Date.now();
        try {
          await cached.runtime.close({
            handle: cached.handle,
            reason: "idle-evicted",
          });
        } catch (error) {
          logVerbose(
            `acp-manager: idle eviction close failed for ${candidate.state.handle.sessionKey}: ${String(error)}`,
          );
        }
      });
  }
  /** Checks whether a cached runtime handle is still healthy enough to reuse. */
  async isReusable(params) {
    if (!params.runtime.getStatus) return true;
    try {
      const status = await params.runtime.getStatus({ handle: params.handle });
      if (isRuntimeStatusUnavailable(status)) {
        this.clear(params.sessionKey);
        logVerbose(
          `acp-manager: evicting cached runtime handle for ${params.sessionKey} after unhealthy status probe: ${status.summary ?? "status unavailable"}`,
        );
        return false;
      }
      return true;
    } catch (error) {
      this.clear(params.sessionKey);
      logVerbose(
        `acp-manager: evicting cached runtime handle for ${params.sessionKey} after status probe failed: ${String(error)}`,
      );
      return false;
    }
  }
  handleMatchesMeta(params) {
    const identity = resolveSessionIdentityFromMeta(params.meta);
    const expectedHandleIds = resolveRuntimeHandleIdentifiersFromIdentity(identity);
    if ((params.handle.backendSessionId ?? "") !== (expectedHandleIds.backendSessionId ?? ""))
      return false;
    if ((params.handle.agentSessionId ?? "") !== (expectedHandleIds.agentSessionId ?? ""))
      return false;
    const expectedAcpxRecordId = identity?.acpxRecordId ?? "";
    return (normalizeOptionalString(params.handle.acpxRecordId) ?? "") === expectedAcpxRecordId;
  }
  runtimeHandlesMatch(a, b) {
    return (
      a.sessionKey === b.sessionKey &&
      a.backend === b.backend &&
      a.runtimeSessionName === b.runtimeSessionName &&
      (a.cwd ?? "") === (b.cwd ?? "") &&
      (a.acpxRecordId ?? "") === (b.acpxRecordId ?? "") &&
      (a.backendSessionId ?? "") === (b.backendSessionId ?? "") &&
      (a.agentSessionId ?? "") === (b.agentSessionId ?? "")
    );
  }
};
function isRuntimeStatusUnavailable(status) {
  if (!status) return false;
  const detailsStatus = normalizeLowercaseStringOrEmpty(status.details?.status);
  if (detailsStatus === "dead" || detailsStatus === "no-session") return true;
  const summaryMatch = status.summary?.match(/\bstatus=([^\s]+)/i);
  const summaryStatus = normalizeLowercaseStringOrEmpty(summaryMatch?.[1]);
  return summaryStatus === "dead" || summaryStatus === "no-session";
}
//#endregion
//#region src/acp/control-plane/manager.runtime-handle-ensure.ts
/** Ensures or recreates a live ACP runtime handle for persisted session metadata. */
/** Returns a reusable cached handle or initializes a fresh runtime session for the metadata. */
async function ensureManagerRuntimeHandle(params) {
  const agent =
    normalizeOptionalString(params.meta.agent) ||
    resolveAcpAgentFromSessionKey(params.sessionKey, "main");
  const mode = params.meta.mode;
  const runtimeOptions = resolveRuntimeOptionsFromMeta(params.meta);
  const cwd = runtimeOptions.cwd ?? normalizeOptionalString(params.meta.cwd);
  const model = normalizeOptionalString(runtimeOptions.model);
  const thinking = normalizeOptionalString(runtimeOptions.thinking);
  const configuredBackend = (params.meta.backend || params.cfg.acp?.backend || "").trim();
  const configSignature = resolveRuntimeConfigCacheKey(params.cfg);
  const cached = params.runtimeHandles.get(params.sessionKey);
  if (cached) {
    const backendMatches = !configuredBackend || cached.backend === configuredBackend;
    const agentMatches = cached.agent === agent;
    const modeMatches = cached.mode === mode;
    const cwdMatches = (cached.cwd ?? "") === (cwd ?? "");
    const configMatches = cached.configSignature === configSignature;
    const handleMatchesMeta = params.runtimeHandles.handleMatchesMeta({
      handle: cached.handle,
      meta: params.meta,
    });
    if (
      backendMatches &&
      agentMatches &&
      modeMatches &&
      cwdMatches &&
      configMatches &&
      handleMatchesMeta &&
      (await params.runtimeHandles.isReusable({
        sessionKey: params.sessionKey,
        runtime: cached.runtime,
        handle: cached.handle,
      }))
    )
      return {
        runtime: cached.runtime,
        handle: cached.handle,
        meta: params.meta,
      };
    await params.runtimeHandles.close({
      sessionKey: params.sessionKey,
      reason: "runtime-handle-replaced",
    });
  }
  params.enforceConcurrentSessionLimit({
    cfg: params.cfg,
    sessionKey: params.sessionKey,
  });
  const backend = params.deps.requireRuntimeBackend(configuredBackend || void 0);
  const runtime = backend.runtime;
  const previousMeta = params.meta;
  const previousIdentity = resolveSessionIdentityFromMeta(previousMeta);
  let identityForEnsure = previousIdentity;
  const persistedResumeSessionId =
    mode === "persistent" ? resolveRuntimeResumeSessionId(previousIdentity) : void 0;
  const shouldPrepareFreshPersistentSession =
    mode === "persistent" &&
    previousIdentity != null &&
    !identityHasStableSessionId(previousIdentity);
  const ensureSession = async (resumeSessionId) =>
    await withAcpRuntimeErrorBoundary({
      run: async () =>
        await runtime.ensureSession({
          sessionKey: params.sessionKey,
          agent,
          mode,
          ...(resumeSessionId ? { resumeSessionId } : {}),
          ...(model ? { model } : {}),
          ...(thinking ? { thinking } : {}),
          cwd,
        }),
      fallbackCode: "ACP_SESSION_INIT_FAILED",
      fallbackMessage: "Could not initialize ACP session runtime.",
    });
  let ensured;
  if (shouldPrepareFreshPersistentSession)
    await runtime.prepareFreshSession?.({ sessionKey: params.sessionKey });
  if (persistedResumeSessionId)
    try {
      ensured = await ensureSession(persistedResumeSessionId);
    } catch (error) {
      const acpError = toAcpRuntimeError({
        error,
        fallbackCode: "ACP_SESSION_INIT_FAILED",
        fallbackMessage: "Could not initialize ACP session runtime.",
      });
      if (acpError.code !== "ACP_SESSION_INIT_FAILED") throw acpError;
      logVerbose(
        `acp-manager: resume init failed for ${params.sessionKey}; retrying without persisted ACP session id: ${acpError.message}`,
      );
      if (identityForEnsure) {
        const {
          acpxSessionId: _staleAcpxSessionId,
          agentSessionId: _staleAgentSessionId,
          ...retryIdentity
        } = identityForEnsure;
        identityForEnsure = {
          ...retryIdentity,
          state: "pending",
        };
      }
      ensured = await ensureSession();
    }
  else ensured = await ensureSession();
  const now = Date.now();
  const effectiveCwd = normalizeOptionalString(ensured.cwd) ?? cwd;
  const nextRuntimeOptions = normalizeRuntimeOptions({
    ...runtimeOptions,
    ...(effectiveCwd ? { cwd: effectiveCwd } : {}),
  });
  const nextIdentity =
    mergeSessionIdentity({
      current: identityForEnsure,
      incoming: createIdentityFromEnsure({
        handle: ensured,
        now,
      }),
      now,
    }) ?? identityForEnsure;
  const nextHandleIdentifiers = resolveRuntimeHandleIdentifiersFromIdentity(nextIdentity);
  const nextHandle = {
    ...ensured,
    ...(nextHandleIdentifiers.backendSessionId
      ? { backendSessionId: nextHandleIdentifiers.backendSessionId }
      : {}),
    ...(nextHandleIdentifiers.agentSessionId
      ? { agentSessionId: nextHandleIdentifiers.agentSessionId }
      : {}),
  };
  const nextMeta = {
    backend: ensured.backend || backend.id,
    agent,
    runtimeSessionName: ensured.runtimeSessionName,
    ...(nextIdentity ? { identity: nextIdentity } : {}),
    mode: params.meta.mode,
    ...(Object.keys(nextRuntimeOptions).length > 0 ? { runtimeOptions: nextRuntimeOptions } : {}),
    ...(effectiveCwd ? { cwd: effectiveCwd } : {}),
    state: previousMeta.state,
    lastActivityAt: now,
    ...(previousMeta.lastError ? { lastError: previousMeta.lastError } : {}),
  };
  if (
    previousMeta.backend !== nextMeta.backend ||
    previousMeta.runtimeSessionName !== nextMeta.runtimeSessionName ||
    !identityEquals(previousIdentity, nextIdentity) ||
    previousMeta.agent !== nextMeta.agent ||
    previousMeta.cwd !== nextMeta.cwd ||
    !runtimeOptionsEqual(previousMeta.runtimeOptions, nextMeta.runtimeOptions) ||
    hasLegacyAcpIdentityProjection(previousMeta)
  )
    await params.writeSessionMeta({
      cfg: params.cfg,
      sessionKey: params.sessionKey,
      mutate: (_current, entry) => {
        if (!entry) return null;
        return nextMeta;
      },
    });
  params.runtimeHandles.set(params.sessionKey, {
    runtime,
    handle: nextHandle,
    backend: ensured.backend || backend.id,
    agent,
    mode,
    cwd: effectiveCwd,
    configSignature,
    appliedControlSignature: void 0,
  });
  return {
    runtime,
    handle: nextHandle,
    meta: nextMeta,
  };
}
//#endregion
//#region src/acp/control-plane/manager.runtime-options-commands.ts
/** Applies a backend runtime mode control and persists the selected mode. */
async function runSetManagerSessionRuntimeMode(params) {
  const resolvedMeta = requireReadySessionMeta(
    params.resolveSession({
      cfg: params.cfg,
      sessionKey: params.sessionKey,
    }),
  );
  const { runtime, handle, meta } = await params.ensureRuntimeHandle({
    cfg: params.cfg,
    sessionKey: params.sessionKey,
    meta: resolvedMeta,
  });
  if (
    !(
      await params.resolveRuntimeCapabilities({
        runtime,
        handle,
      })
    ).controls.includes("session/set_mode") ||
    !runtime.setMode
  )
    throw createUnsupportedControlError({
      backend: handle.backend || meta.backend,
      control: "session/set_mode",
    });
  await withAcpRuntimeErrorBoundary({
    run: async () =>
      await runtime.setMode({
        handle,
        mode: params.runtimeMode,
      }),
    fallbackCode: "ACP_TURN_FAILED",
    fallbackMessage: "Could not update ACP runtime mode.",
  });
  const nextOptions = mergeRuntimeOptions({
    current: resolveRuntimeOptionsFromMeta(meta),
    patch: { runtimeMode: params.runtimeMode },
  });
  await persistManagerRuntimeOptions({
    ...params,
    options: nextOptions,
  });
  return nextOptions;
}
/** Applies a backend config-option control and persists the inferred runtime option patch. */
async function runSetManagerSessionConfigOption(params) {
  const resolvedMeta = requireReadySessionMeta(
    params.resolveSession({
      cfg: params.cfg,
      sessionKey: params.sessionKey,
    }),
  );
  const { runtime, handle, meta } = await params.ensureRuntimeHandle({
    cfg: params.cfg,
    sessionKey: params.sessionKey,
    meta: resolvedMeta,
  });
  const inferredPatch = inferRuntimeOptionPatchFromConfigOption(params.key, params.value);
  const capabilities = await params.resolveRuntimeCapabilities({
    runtime,
    handle,
    includeStatusConfigOptionKeys: true,
  });
  if (!capabilities.controls.includes("session/set_config_option") || !runtime.setConfigOption)
    throw createUnsupportedControlError({
      backend: handle.backend || meta.backend,
      control: "session/set_config_option",
    });
  const advertisedKeys = new Set(
    (capabilities.configOptionKeys ?? [])
      .map((entry) => normalizeLowercaseStringOrEmpty(entry))
      .filter(Boolean),
  );
  const wireKey = resolveRuntimeConfigOptionKey(params.key, capabilities.configOptionKeys);
  if (advertisedKeys.size > 0 && !advertisedKeys.has(normalizeLowercaseStringOrEmpty(wireKey)))
    throw new AcpRuntimeError(
      "ACP_BACKEND_UNSUPPORTED_CONTROL",
      `ACP backend "${handle.backend || meta.backend}" does not accept config key "${wireKey}".`,
    );
  await withAcpRuntimeErrorBoundary({
    run: async () =>
      await runtime.setConfigOption({
        handle,
        key: wireKey,
        value: params.value,
      }),
    fallbackCode: "ACP_TURN_FAILED",
    fallbackMessage: "Could not update ACP runtime config option.",
  });
  const nextOptions = mergeRuntimeOptions({
    current: resolveRuntimeOptionsFromMeta(meta),
    patch: inferredPatch,
  });
  await persistManagerRuntimeOptions({
    ...params,
    options: nextOptions,
  });
  return nextOptions;
}
/** Persists runtime option changes that do not need an immediate backend control call. */
async function runUpdateManagerSessionRuntimeOptions(params) {
  const nextOptions = mergeRuntimeOptions({
    current: resolveRuntimeOptionsFromMeta(
      requireReadySessionMeta(
        params.resolveSession({
          cfg: params.cfg,
          sessionKey: params.sessionKey,
        }),
      ),
    ),
    patch: params.patch,
  });
  await persistManagerRuntimeOptions({
    ...params,
    options: nextOptions,
  });
  return nextOptions;
}
/** Closes the current runtime handle and clears persisted runtime options. */
async function runResetManagerSessionRuntimeOptions(params) {
  const resolvedMeta = requireReadySessionMeta(
    params.resolveSession({
      cfg: params.cfg,
      sessionKey: params.sessionKey,
    }),
  );
  const { runtime, handle } = await params.ensureRuntimeHandle({
    cfg: params.cfg,
    sessionKey: params.sessionKey,
    meta: resolvedMeta,
  });
  await withAcpRuntimeErrorBoundary({
    run: async () =>
      await runtime.close({
        handle,
        reason: "reset-runtime-options",
      }),
    fallbackCode: "ACP_TURN_FAILED",
    fallbackMessage: "Could not reset ACP runtime options.",
  });
  params.runtimeHandles.clear(params.sessionKey);
  await persistManagerRuntimeOptions({
    ...params,
    options: {},
  });
  return {};
}
async function persistManagerRuntimeOptions(params) {
  const normalized = normalizeRuntimeOptions(params.options);
  const hasOptions = Object.keys(normalized).length > 0;
  await params.writeSessionMeta({
    cfg: params.cfg,
    sessionKey: params.sessionKey,
    mutate: (current, entry) => {
      if (!entry) return null;
      const base = current;
      if (!base) return null;
      return {
        backend: base.backend,
        agent: base.agent,
        runtimeSessionName: base.runtimeSessionName,
        ...(base.identity ? { identity: base.identity } : {}),
        mode: base.mode,
        runtimeOptions: hasOptions ? normalized : void 0,
        cwd: normalized.cwd,
        state: base.state,
        lastActivityAt: Date.now(),
        ...(base.lastError ? { lastError: base.lastError } : {}),
      };
    },
    failOnError: true,
  });
  const cached = params.runtimeHandles.get(params.sessionKey);
  if (!cached) return;
  if ((cached.cwd ?? "") !== (normalized.cwd ?? "")) {
    params.runtimeHandles.clear(params.sessionKey);
    return;
  }
  cached.appliedControlSignature = void 0;
}
//#endregion
//#region src/acp/control-plane/manager.startup-identity-reconcile.ts
/** Startup scan that resolves pending ACP session identities when backends can report status. */
/** Resolves pending ACP session identities opportunistically during manager startup. */
async function runManagerStartupIdentityReconcile(params) {
  let checked = 0;
  let resolved = 0;
  let failed = 0;
  let acpSessions;
  try {
    acpSessions = await params.deps.listAcpSessions({ cfg: params.cfg });
  } catch (error) {
    logVerbose(`acp-manager: startup identity scan failed: ${String(error)}`);
    return {
      checked,
      resolved,
      failed: failed + 1,
    };
  }
  for (const session of acpSessions) {
    if (!session.acp || !session.sessionKey) continue;
    const currentIdentity = resolveSessionIdentityFromMeta(session.acp);
    if (!isSessionIdentityPending(currentIdentity) || !identityHasStableSessionId(currentIdentity))
      continue;
    checked += 1;
    try {
      if (
        await params.withSessionActor(session.sessionKey, async () => {
          const resolution = params.resolveSession({
            cfg: params.cfg,
            sessionKey: session.sessionKey,
          });
          if (resolution.kind !== "ready") return false;
          const { runtime, handle, meta } = await params.ensureRuntimeHandle({
            cfg: params.cfg,
            sessionKey: session.sessionKey,
            meta: resolution.meta,
          });
          return !isSessionIdentityPending(
            resolveSessionIdentityFromMeta(
              (
                await params.reconcileRuntimeSessionIdentifiers({
                  cfg: params.cfg,
                  sessionKey: session.sessionKey,
                  runtime,
                  handle,
                  meta,
                  failOnStatusError: false,
                })
              ).meta,
            ),
          );
        })
      )
        resolved += 1;
    } catch (error) {
      failed += 1;
      logVerbose(
        `acp-manager: startup identity reconcile failed for ${session.sessionKey}: ${String(error)}`,
      );
    }
  }
  return {
    checked,
    resolved,
    failed,
  };
}
//#endregion
//#region src/acp/control-plane/manager.status.ts
/** Reads ACP session status from the runtime and reconciles persisted identity metadata. */
/** Reads a fresh ACP session status and reconciles runtime identifiers from the status response. */
async function runManagerGetSessionStatus(params) {
  params.throwIfAborted(params.signal);
  const resolvedMeta = requireReadySessionMeta(
    params.resolveSession({
      cfg: params.cfg,
      sessionKey: params.sessionKey,
    }),
  );
  const {
    runtime,
    handle: ensuredHandle,
    meta: initialMeta,
  } = await params.ensureRuntimeHandle({
    cfg: params.cfg,
    sessionKey: params.sessionKey,
    meta: resolvedMeta,
  });
  let handle = ensuredHandle;
  const capabilities = await params.resolveRuntimeCapabilities({
    runtime,
    handle,
  });
  let runtimeStatus;
  if (runtime.getStatus)
    runtimeStatus = await withAcpRuntimeErrorBoundary({
      run: async () => {
        params.throwIfAborted(params.signal);
        const status = await runtime.getStatus({
          handle,
          ...(params.signal ? { signal: params.signal } : {}),
        });
        params.throwIfAborted(params.signal);
        return status;
      },
      fallbackCode: "ACP_TURN_FAILED",
      fallbackMessage: "Could not read ACP runtime status.",
    });
  const reconciledSession = await params.reconcileRuntimeSessionIdentifiers({
    cfg: params.cfg,
    sessionKey: params.sessionKey,
    runtime,
    handle,
    meta: initialMeta,
    runtimeStatus,
    failOnStatusError: true,
  });
  handle = reconciledSession.handle;
  const meta = reconciledSession.meta;
  runtimeStatus = reconciledSession.runtimeStatus;
  const identity = resolveSessionIdentityFromMeta(meta);
  return {
    sessionKey: params.sessionKey,
    backend: handle.backend || meta.backend,
    agent: meta.agent,
    ...(identity ? { identity } : {}),
    state: meta.state,
    mode: meta.mode,
    runtimeOptions: resolveRuntimeOptionsFromMeta(meta),
    capabilities,
    runtimeStatus,
    lastActivityAt: meta.lastActivityAt,
    lastError: meta.lastError,
  };
}
//#endregion
//#region src/acp/control-plane/active-turns.ts
/** Process-local active-turn registry for ACP maintenance and recovery decisions. */
const ACP_ACTIVE_TURN_STATE_KEY = Symbol.for("openclaw.acp.activeTurns");
function getAcpActiveTurnState() {
  return resolveGlobalSingleton(ACP_ACTIVE_TURN_STATE_KEY, () => ({
    activeTurnKeys: /* @__PURE__ */ new Set(),
  }));
}
/** Marks a session as currently running an ACP turn. */
function markAcpTurnActive(sessionKey) {
  if (!sessionKey) return;
  getAcpActiveTurnState().activeTurnKeys.add(normalizeActorKey(sessionKey));
}
/** Clears the active-turn marker for a session. */
function clearAcpTurnActive(sessionKey) {
  if (!sessionKey) return;
  getAcpActiveTurnState().activeTurnKeys.delete(normalizeActorKey(sessionKey));
}
/** Returns whether the process currently owns an in-flight ACP turn for a session. */
function isAcpTurnActive(sessionKey) {
  if (!sessionKey) return false;
  return getAcpActiveTurnState().activeTurnKeys.has(normalizeActorKey(sessionKey));
}
//#endregion
//#region src/acp/control-plane/manager.backend-failover.ts
/** Builds the deduped backend order from configured primary, resolved primary, and fallbacks. */
function resolveBackendCandidatePlan(params) {
  const configuredPrimaryBackend = normalizeOptionalString(params.configuredPrimaryBackend);
  const resolvedPrimaryBackend = normalizeOptionalString(params.resolvedPrimaryBackend);
  const fallbackBackends = Array.isArray(params.fallbackBackends)
    ? params.fallbackBackends
        .map((backend) => normalizeOptionalString(backend))
        .filter((backend) => backend != null)
    : [];
  return {
    candidateBackends: Array.from(
      /* @__PURE__ */ new Set([
        configuredPrimaryBackend ?? resolvedPrimaryBackend ?? "",
        ...fallbackBackends,
      ]),
    ),
    describeBackendCandidate: (backend) =>
      backend || resolvedPrimaryBackend || configuredPrimaryBackend || "<auto>",
  };
}
/** Returns true for early transient backend errors where trying another backend is safe. */
function isFailoverWorthyBackendError(attempt) {
  return (
    !attempt.sawOutput &&
    (attempt.code === "ACP_TURN_FAILED" ||
      attempt.code === "ACP_SESSION_INIT_FAILED" ||
      attempt.code === "ACP_BACKEND_UNAVAILABLE") &&
    /\b(?:unavailable|rate[-\s]?limit(?:ed|ing)?|quota|exhausted|temporar(?:y|ily)|overloaded)\b/i.test(
      attempt.error,
    )
  );
}
/** Returns whether another backend candidate remains after the current index. */
function shouldAttemptBackendFailover(params) {
  return params.backendIndex < params.candidateBackends.length - 1;
}
//#endregion
//#region src/acp/control-plane/manager.background-task.ts
/** Mirrors child ACP turns into detached-task status for requester-facing progress. */
const ACP_BACKGROUND_TASK_TEXT_MAX_LENGTH = 160;
const ACP_BACKGROUND_TASK_PROGRESS_MAX_LENGTH = 240;
/** Produces the bounded task label shown for a child ACP background run. */
function summarizeBackgroundTaskText(text) {
  const normalized = normalizeOptionalString(text) ?? "ACP background task";
  if (normalized.length <= ACP_BACKGROUND_TASK_TEXT_MAX_LENGTH) return normalized;
  return `${truncateUtf16Safe(normalized, ACP_BACKGROUND_TASK_TEXT_MAX_LENGTH - 1)}…`;
}
/** Appends bounded progress text while preserving a single-line task summary. */
function appendBackgroundTaskProgressSummary(current, chunk) {
  const normalizedChunk = chunk.replace(/\s+/g, " ");
  if (!normalizedChunk) return current;
  const chunkToAppend = current ? normalizedChunk : normalizedChunk.trimStart();
  if (!chunkToAppend) return current;
  const combined = `${current}${chunkToAppend}`.replace(/\s+/g, " ");
  if (combined.length <= ACP_BACKGROUND_TASK_PROGRESS_MAX_LENGTH) return combined;
  return `${truncateUtf16Safe(combined, ACP_BACKGROUND_TASK_PROGRESS_MAX_LENGTH - 1)}…`;
}
/** Maps ACP runtime failures to detached-task terminal states. */
function resolveBackgroundTaskFailureStatus(error) {
  return /\btimed out\b/i.test(error.message) ? "timed_out" : "failed";
}
/** Infers blocked terminal outcomes from final progress text when the child turn reports one. */
function resolveBackgroundTaskTerminalResult(progressSummary) {
  const requiredCompletionResult = resolveRequiredCompletionTerminalResult(progressSummary);
  if (requiredCompletionResult.terminalOutcome) return requiredCompletionResult;
  const normalized = normalizeOptionalString(progressSummary)?.replace(/\s+/g, " ").trim();
  if (!normalized) return {};
  const permissionDeniedMatch = normalized.match(
    /\b(?:write failed:\s*)?permission denied(?: for (?<path>\S+))?\.?/i,
  );
  if (permissionDeniedMatch) {
    const path = normalizeOptionalString(permissionDeniedMatch.groups?.path)?.replace(
      /[.,;:!?]+$/,
      "",
    );
    return {
      terminalOutcome: "blocked",
      terminalSummary: path ? `Permission denied for ${path}.` : "Permission denied.",
    };
  }
  if (
    /\bneed a writable session\b/i.test(normalized) ||
    /\bfilesystem authorization\b/i.test(normalized) ||
    /`?apply_patch`?/i.test(normalized)
  )
    return {
      terminalOutcome: "blocked",
      terminalSummary: "Writable session or apply_patch authorization required.",
    };
  return {};
}
/** Resolves the requester task context for a spawned child ACP session. */
function resolveBackgroundTaskContext(params) {
  const childEntry = params.deps.loadSessionEntry({
    cfg: params.cfg,
    sessionKey: params.sessionKey,
  })?.entry;
  const requesterSessionKey =
    normalizeOptionalString(childEntry?.spawnedBy) ??
    normalizeOptionalString(childEntry?.parentSessionKey);
  if (!requesterSessionKey) return null;
  return {
    requesterSessionKey,
    requesterOrigin:
      params.deps.loadSessionEntry({
        cfg: params.cfg,
        sessionKey: requesterSessionKey,
      })?.entry?.deliveryContext ?? childEntry?.deliveryContext,
    childSessionKey: params.sessionKey,
    runId: params.requestId,
    label: normalizeOptionalString(childEntry?.label),
    task: summarizeBackgroundTaskText(params.text),
  };
}
function createBackgroundTaskRecord(context, startedAt) {
  try {
    if (
      !createRunningTaskRun({
        runtime: "acp",
        sourceId: context.runId,
        ownerKey: context.requesterSessionKey,
        scopeKind: "session",
        requesterOrigin: context.requesterOrigin,
        childSessionKey: context.childSessionKey,
        runId: context.runId,
        label: context.label,
        task: context.task,
        startedAt,
      })
    )
      logVerbose(
        `acp-manager: failed creating background task for ${context.runId}: persist_failed`,
      );
  } catch (error) {
    logVerbose(
      `acp-manager: failed creating background task for ${context.runId}: ${String(error)}`,
    );
  }
}
function markBackgroundTaskRunning(runId, params) {
  try {
    startTaskRunByRunId({
      runId,
      runtime: "acp",
      sessionKey: params.sessionKey,
      lastEventAt: params.lastEventAt,
      progressSummary: params.progressSummary,
    });
  } catch (error) {
    logVerbose(`acp-manager: failed updating background task for ${runId}: ${String(error)}`);
  }
}
function markBackgroundTaskTerminal(runId, params) {
  try {
    if (params.status === "succeeded") {
      completeTaskRunByRunId({
        runId,
        runtime: "acp",
        sessionKey: params.sessionKey,
        endedAt: params.endedAt,
        lastEventAt: params.lastEventAt,
        progressSummary: params.progressSummary,
        terminalSummary: params.terminalSummary,
        terminalOutcome: params.terminalOutcome,
      });
      return;
    }
    failTaskRunByRunId({
      runId,
      runtime: "acp",
      sessionKey: params.sessionKey,
      status: params.status,
      endedAt: params.endedAt,
      lastEventAt: params.lastEventAt,
      error: params.error,
      progressSummary: params.progressSummary,
      terminalSummary: params.terminalSummary,
    });
  } catch (error) {
    logVerbose(`acp-manager: failed updating background task for ${runId}: ${String(error)}`);
  }
}
//#endregion
//#region src/acp/control-plane/manager.turn-stream.ts
function isCancellationStopReason(stopReason) {
  return stopReason === "cancel" || stopReason === "cancelled" || stopReason === "manual-cancel";
}
async function consumeAcpTurnEvents(params) {
  let streamError = null;
  let sawOutput = false;
  let terminalStatus;
  for await (const event of params.events) {
    if (!params.eventGate.open) continue;
    if (event.type === "done")
      terminalStatus =
        event.status ?? (isCancellationStopReason(event.stopReason) ? "cancelled" : "completed");
    else if (event.type === "error")
      streamError = new AcpRuntimeError(
        normalizeAcpErrorCode(event.code),
        normalizeOptionalString(event.message) || "ACP turn failed before completion.",
        event.detailCode ? { detailCode: event.detailCode } : void 0,
      );
    else if (event.type === "text_delta" || event.type === "tool_call") {
      sawOutput = true;
      await params.onOutputEvent?.(event);
    }
    await params.onEvent?.(event);
  }
  if (params.eventGate.open && streamError) throw streamError;
  return {
    sawOutput,
    terminalStatus,
  };
}
function errorFromTurnResult(result) {
  return new AcpRuntimeError(
    normalizeAcpErrorCode(result.error.code),
    normalizeOptionalString(result.error.message) || "ACP turn failed before completion.",
    result.error.detailCode ? { detailCode: result.error.detailCode } : void 0,
  );
}
function waitForQueuedEvents() {
  return new Promise((resolve) => {
    setTimeout(() => resolve("pending"), 0);
  });
}
async function notifyTerminalResult(params) {
  if (!params.eventGate.open) return;
  if (params.result.status === "completed" || params.result.status === "cancelled") {
    await params.onEvent?.({
      type: "done",
      status: params.result.status,
      ...(params.result.stopReason ? { stopReason: params.result.stopReason } : {}),
    });
    return;
  }
  await params.onEvent?.({
    type: "error",
    code: normalizeAcpErrorCode(params.result.error.code),
    ...(params.result.error.detailCode ? { detailCode: params.result.error.detailCode } : {}),
    message:
      normalizeOptionalString(params.result.error.message) || "ACP turn failed before completion.",
    ...(params.result.error.retryable === void 0
      ? {}
      : { retryable: params.result.error.retryable }),
  });
}
/** Consumes runtime turn APIs and emits normalized events while tracking output/terminal state. */
async function consumeAcpTurnStream(params) {
  if (params.runtime.startTurn) {
    const turn = params.runtime.startTurn(params.turn);
    const eventsPromise = consumeAcpTurnEvents({
      events: turn.events,
      eventGate: params.eventGate,
      onEvent: params.onEvent,
      onOutputEvent: params.onOutputEvent,
    }).then(
      (outcome) => ({
        kind: "events",
        outcome,
      }),
      (error) => ({
        kind: "event-error",
        error,
      }),
    );
    const resultPromise = turn.result.then(
      (result) => ({
        kind: "result",
        result,
      }),
      (error) => ({
        kind: "result-error",
        error,
      }),
    );
    let eventOutcome = null;
    let result = null;
    const firstOutcome = await Promise.race([eventsPromise, resultPromise]);
    if (firstOutcome.kind === "event-error") {
      await turn.closeStream({ reason: "turn-events-error" }).catch(() => {});
      throw firstOutcome.error;
    }
    if (firstOutcome.kind === "events") eventOutcome = firstOutcome.outcome;
    else if (firstOutcome.kind === "result-error") {
      await turn.closeStream({ reason: "turn-result-error" }).catch(() => {});
      throw firstOutcome.error;
    } else result = firstOutcome.result;
    if (!result) {
      const terminalOutcome = await resultPromise;
      if (terminalOutcome.kind === "result-error") {
        await turn.closeStream({ reason: "turn-result-error" }).catch(() => {});
        throw terminalOutcome.error;
      }
      result = terminalOutcome.result;
    }
    let closedTerminalStream = false;
    if (!eventOutcome) {
      let eventsOutcome = await Promise.race([eventsPromise, waitForQueuedEvents()]);
      if (eventsOutcome === "pending") {
        await turn.closeStream({ reason: `turn-result-${result.status}` }).catch(() => {});
        closedTerminalStream = true;
        eventsOutcome = await eventsPromise;
      }
      if (eventsOutcome.kind === "event-error") throw eventsOutcome.error;
      eventOutcome = eventsOutcome.outcome;
    }
    if (result.status !== "completed" && !closedTerminalStream)
      await turn.closeStream({ reason: `turn-result-${result.status}` }).catch(() => {});
    await notifyTerminalResult({
      result,
      eventGate: params.eventGate,
      onEvent: params.onEvent,
    });
    if (result.status === "failed") throw errorFromTurnResult(result);
    return {
      sawOutput: eventOutcome.sawOutput,
      terminalStatus: result.status,
    };
  }
  return await consumeAcpTurnEvents({
    events: params.runtime.runTurn(params.turn),
    eventGate: params.eventGate,
    onEvent: params.onEvent,
    onOutputEvent: params.onOutputEvent,
  });
}
//#endregion
//#region src/acp/control-plane/manager.turn-runner.ts
const ACP_TURN_TIMEOUT_GRACE_MS = 1e3;
/** Executes one ACP prompt turn against the selected backend and records terminal state. */
async function runManagerTurn(params) {
  const { input, sessionKey } = params;
  const turnStartedAt = Date.now();
  const actorKey = normalizeActorKey(sessionKey);
  const taskContext =
    input.mode === "prompt"
      ? resolveBackgroundTaskContext({
          deps: params.deps,
          cfg: input.cfg,
          sessionKey,
          requestId: input.requestId,
          text: input.text,
        })
      : null;
  if (taskContext) createBackgroundTaskRecord(taskContext, turnStartedAt);
  let taskProgressSummary = "";
  const initialResolution = params.resolveSession({
    cfg: input.cfg,
    sessionKey,
  });
  const initialMeta = requireReadySessionMeta(initialResolution);
  recordSessionHumanDirectMessage({
    sessionKey,
    entry: initialResolution.kind === "ready" ? initialResolution.entry : void 0,
    actor: { actorType: input.provenance },
    channel: "acp",
    runId: input.requestId,
  });
  const spawnedByWatcher =
    initialResolution.kind === "ready"
      ? (initialResolution.entry?.spawnedBy ?? initialResolution.entry?.parentSessionKey)
      : void 0;
  const { candidateBackends, describeBackendCandidate } = resolveBackendCandidatePlan({
    configuredPrimaryBackend: input.cfg.acp?.backend,
    resolvedPrimaryBackend: initialMeta.backend,
    fallbackBackends: input.cfg.acp?.fallbacks,
  });
  const backendAttempts = [];
  const recordBackendFailure = async (error) => {
    const failedBackends = backendAttempts
      .map((attempt) => `${attempt.backend}: ${attempt.error}`)
      .join(" | ");
    const errorToRecord =
      backendAttempts.length > 1
        ? new AcpRuntimeError(
            error.code,
            `All ACP backends failed (${backendAttempts.length}): ${failedBackends}`,
          )
        : error;
    params.recordTurnCompletion({
      startedAt: turnStartedAt,
      errorCode: errorToRecord.code,
    });
    if (taskContext) {
      const failureStatus = resolveBackgroundTaskFailureStatus(errorToRecord);
      markBackgroundTaskTerminal(taskContext.runId, {
        sessionKey,
        status: failureStatus,
        endedAt: Date.now(),
        lastEventAt: Date.now(),
        error: formatAcpErrorChain(errorToRecord),
        progressSummary: taskProgressSummary || null,
        terminalSummary: null,
      });
      if (spawnedByWatcher)
        recordSubagentTerminalState({
          childSessionKey: sessionKey,
          runId: taskContext.runId,
          requesterSessionKey: spawnedByWatcher,
          outcomeStatus: failureStatus === "timed_out" ? "timeout" : "error",
        });
    }
    await params.setSessionState({
      cfg: input.cfg,
      sessionKey,
      state: "error",
      lastError: formatAcpErrorChain(errorToRecord),
    });
    throw errorToRecord;
  };
  let acpTurnMarkedActive = false;
  if (taskContext) {
    markAcpTurnActive(sessionKey);
    acpTurnMarkedActive = true;
  }
  try {
    for (const [backendIdx, currentBackend] of candidateBackends.entries()) {
      if (backendIdx > 0) {
        await params.runtimeHandles.close({
          sessionKey,
          reason: "backend-failover",
        });
        logVerbose(
          `acp-manager: switching backend for ${sessionKey} from ${describeBackendCandidate(expectDefined(candidateBackends[backendIdx - 1], "candidate backends entry at backend idx 1"))} to ${describeBackendCandidate(currentBackend)}`,
        );
      }
      for (let attempt = 0; attempt < 2; attempt += 1) {
        const resolvedMeta = requireReadySessionMeta(
          backendIdx === 0 && attempt === 0
            ? initialResolution
            : params.resolveSession({
                cfg: input.cfg,
                sessionKey,
              }),
        );
        const metaWithBackend = currentBackend
          ? {
              ...resolvedMeta,
              backend: currentBackend,
            }
          : resolvedMeta;
        let runtime;
        let handle;
        let meta;
        let activeTurn;
        let internalAbortController;
        let onCallerAbort;
        let activeTurnStarted = false;
        let sawTurnOutput = false;
        let retryFreshHandle = false;
        let skipPostTurnCleanup = false;
        try {
          const ensured = await params.ensureRuntimeHandle({
            cfg: input.cfg,
            sessionKey,
            meta: metaWithBackend,
          });
          runtime = ensured.runtime;
          handle = ensured.handle;
          meta = ensured.meta;
          await params.applyRuntimeControls({
            sessionKey,
            runtime,
            handle,
            meta,
          });
          await params.setSessionState({
            cfg: input.cfg,
            sessionKey,
            state: "running",
            clearLastError: true,
          });
          internalAbortController = new AbortController();
          onCallerAbort = () => {
            internalAbortController?.abort();
          };
          if (input.signal?.aborted) internalAbortController.abort();
          else if (input.signal)
            input.signal.addEventListener("abort", onCallerAbort, { once: true });
          activeTurn = {
            runtime,
            handle,
            abortController: internalAbortController,
          };
          params.activeTurnBySession.set(actorKey, activeTurn);
          activeTurnStarted = true;
          const combinedSignal = input.signal
            ? AbortSignal.any([input.signal, internalAbortController.signal])
            : internalAbortController.signal;
          const eventGate = { open: true };
          await input.onLifecycle?.({
            type: "prompt_submitted",
            at: Date.now(),
          });
          const turnPromise = consumeAcpTurnStream({
            runtime,
            turn: {
              handle,
              text: input.text,
              attachments: input.attachments,
              mode: input.mode,
              requestId: input.requestId,
              signal: combinedSignal,
            },
            eventGate,
            onOutputEvent: (event) => {
              sawTurnOutput = true;
              if (event.type === "text_delta" && event.stream !== "thought" && event.text)
                taskProgressSummary = appendBackgroundTaskProgressSummary(
                  taskProgressSummary,
                  event.text,
                );
              if (taskContext)
                markBackgroundTaskRunning(taskContext.runId, {
                  sessionKey,
                  lastEventAt: Date.now(),
                  progressSummary: taskProgressSummary || null,
                });
            },
            onEvent: input.onEvent,
          });
          const turnTimeoutMs = resolveTurnTimeoutMs({
            cfg: input.cfg,
            meta,
          });
          const sessionMode = meta.mode;
          const turnOutcome = await awaitTurnWithTimeout({
            sessionKey,
            turnPromise,
            timeoutMs: turnTimeoutMs + ACP_TURN_TIMEOUT_GRACE_MS,
            timeoutLabelMs: turnTimeoutMs,
            onTimeout: async () => {
              eventGate.open = false;
              skipPostTurnCleanup = true;
              if (!activeTurn) return;
              await cleanupTimedOutTurn({
                sessionKey,
                activeTurn,
                mode: sessionMode,
                clearCachedRuntimeStateIfHandleMatches: (turn) => {
                  params.runtimeHandles.clearIfHandleMatches({
                    sessionKey,
                    handle: turn.handle,
                  });
                },
              });
            },
          });
          if (!turnOutcome.terminalStatus)
            throw new AcpRuntimeError(
              "ACP_TURN_FAILED",
              "ACP turn ended without a terminal done event.",
            );
          params.recordTurnCompletion({ startedAt: turnStartedAt });
          if (taskContext) {
            const terminalResult = resolveBackgroundTaskTerminalResult(taskProgressSummary);
            markBackgroundTaskTerminal(taskContext.runId, {
              sessionKey,
              status: turnOutcome.terminalStatus === "cancelled" ? "cancelled" : "succeeded",
              endedAt: Date.now(),
              lastEventAt: Date.now(),
              error: void 0,
              progressSummary: taskProgressSummary || null,
              terminalSummary: terminalResult.terminalSummary ?? null,
              terminalOutcome: terminalResult.terminalOutcome,
            });
            if (spawnedByWatcher)
              recordSubagentTerminalState({
                childSessionKey: sessionKey,
                runId: taskContext.runId,
                requesterSessionKey: spawnedByWatcher,
                outcomeStatus: turnOutcome.terminalStatus === "cancelled" ? "cancelled" : "ok",
              });
          }
          await params.setSessionState({
            cfg: input.cfg,
            sessionKey,
            state: "idle",
            clearLastError: true,
          });
          return;
        } catch (error) {
          const acpError = toAcpRuntimeError({
            error,
            fallbackCode: activeTurnStarted ? "ACP_TURN_FAILED" : "ACP_SESSION_INIT_FAILED",
            fallbackMessage: activeTurnStarted
              ? "ACP turn failed before completion."
              : "Could not initialize ACP session runtime.",
          });
          retryFreshHandle = await prepareFreshManagerRuntimeHandleRetry({
            attempt,
            cfg: input.cfg,
            sessionKey,
            error: acpError,
            sawTurnOutput,
            runtime,
            meta,
            runtimeHandles: params.runtimeHandles,
            writeSessionMeta: params.writeSessionMeta,
          });
          if (retryFreshHandle) continue;
          const backendAttempt = {
            backend: describeBackendCandidate(currentBackend),
            error: acpError.message,
            code: acpError.code,
            sawOutput: sawTurnOutput,
          };
          backendAttempts.push(backendAttempt);
          if (
            !isFailoverWorthyBackendError(backendAttempt) ||
            !shouldAttemptBackendFailover({
              backendIndex: backendIdx,
              candidateBackends,
            })
          )
            await recordBackendFailure(acpError);
          break;
        } finally {
          if (input.signal && onCallerAbort)
            input.signal.removeEventListener("abort", onCallerAbort);
          if (activeTurn && params.activeTurnBySession.get(actorKey) === activeTurn)
            params.activeTurnBySession.delete(actorKey);
          if (!retryFreshHandle && !skipPostTurnCleanup && runtime && handle && meta)
            ({ handle, meta } = await params.reconcileRuntimeSessionIdentifiers({
              cfg: input.cfg,
              sessionKey,
              runtime,
              handle,
              meta,
              failOnStatusError: false,
            }));
          if (
            !retryFreshHandle &&
            !skipPostTurnCleanup &&
            runtime &&
            handle &&
            meta &&
            meta.mode === "oneshot"
          )
            try {
              await runtime.close({
                handle,
                reason: "oneshot-complete",
              });
            } catch (error) {
              logVerbose(
                `acp-manager: ACP oneshot close failed for ${sessionKey}: ${String(error)}`,
              );
            } finally {
              params.runtimeHandles.clear(sessionKey);
            }
        }
        if (retryFreshHandle) continue;
      }
    }
  } finally {
    if (acpTurnMarkedActive) clearAcpTurnActive(sessionKey);
  }
}
//#endregion
//#region src/acp/control-plane/manager.types.ts
const DEFAULT_DEPS = {
  listAcpSessions: listAcpSessionEntries,
  loadSessionEntry: readAcpSessionEntry,
  upsertSessionMeta: upsertAcpSessionMeta,
  getRuntimeBackend: getAcpRuntimeBackend,
  requireRuntimeBackend: requireAcpRuntimeBackend,
};
//#endregion
//#region src/acp/control-plane/session-actor-queue.ts
/** Per-session async queue wrapper used by ACP manager operations. */
/** Per-session async queue that serializes ACP runtime operations and exposes queue depth. */
var SessionActorQueue = class {
  constructor() {
    this.queue = new KeyedAsyncQueue();
    this.pendingBySession = /* @__PURE__ */ new Map();
  }
  getTotalPendingCount() {
    let total = 0;
    for (const count of this.pendingBySession.values()) total += count;
    return total;
  }
  async run(actorKey, op) {
    return this.queue.enqueue(actorKey, op, {
      onEnqueue: () => {
        this.pendingBySession.set(actorKey, (this.pendingBySession.get(actorKey) ?? 0) + 1);
      },
      onSettle: () => {
        const pending = (this.pendingBySession.get(actorKey) ?? 1) - 1;
        if (pending <= 0) this.pendingBySession.delete(actorKey);
        else this.pendingBySession.set(actorKey, pending);
      },
    });
  }
};
//#endregion
//#region src/acp/control-plane/manager.core.ts
/** Coordinates ACP session metadata, runtime handles, per-session queues, and turn execution. */
var AcpSessionManager = class {
  constructor(deps = DEFAULT_DEPS) {
    this.actorQueue = new SessionActorQueue();
    this.runtimeHandles = new ManagerRuntimeHandleCache();
    this.activeTurnBySession = /* @__PURE__ */ new Map();
    this.turnLatencyStats = {
      completed: 0,
      failed: 0,
      totalMs: 0,
      maxMs: 0,
    };
    this.errorCountsByCode = /* @__PURE__ */ new Map();
    this.deps = deps;
  }
  resolveSession(params) {
    const sessionKey = canonicalizeAcpSessionKey(params);
    if (!sessionKey)
      return {
        kind: "none",
        sessionKey,
      };
    const stored = this.deps.loadSessionEntry({
      cfg: params.cfg,
      sessionKey,
      clone: false,
    });
    const acp = stored?.acp;
    if (acp)
      return {
        kind: "ready",
        sessionKey,
        meta: acp,
        entry: stored.entry,
      };
    if (isAcpSessionKey(sessionKey))
      return {
        kind: "stale",
        sessionKey,
        error: resolveMissingMetaError(sessionKey),
      };
    return {
      kind: "none",
      sessionKey,
    };
  }
  getObservabilitySnapshot(cfg) {
    const completedTurns = this.turnLatencyStats.completed + this.turnLatencyStats.failed;
    const averageLatencyMs =
      completedTurns > 0 ? Math.round(this.turnLatencyStats.totalMs / completedTurns) : 0;
    return {
      runtimeCache: this.runtimeHandles.getObservabilitySnapshot(cfg),
      turns: {
        active: this.activeTurnBySession.size,
        queueDepth: this.actorQueue.getTotalPendingCount(),
        completed: this.turnLatencyStats.completed,
        failed: this.turnLatencyStats.failed,
        averageLatencyMs,
        maxLatencyMs: this.turnLatencyStats.maxMs,
      },
      errorsByCode: Object.fromEntries(
        [...this.errorCountsByCode.entries()].toSorted(([a], [b]) => a.localeCompare(b)),
      ),
    };
  }
  async reconcilePendingSessionIdentities(params) {
    return await runManagerStartupIdentityReconcile({
      cfg: params.cfg,
      deps: this.deps,
      withSessionActor: this.withSessionActor.bind(this),
      resolveSession: this.resolveSession.bind(this),
      ensureRuntimeHandle: this.ensureRuntimeHandle.bind(this),
      reconcileRuntimeSessionIdentifiers: this.reconcileRuntimeSessionIdentifiers.bind(this),
    });
  }
  async initializeSession(input) {
    const sessionKey = canonicalizeAcpSessionKey({
      cfg: input.cfg,
      sessionKey: input.sessionKey,
    });
    if (!sessionKey)
      throw new AcpRuntimeError("ACP_SESSION_INIT_FAILED", "ACP session key is required.");
    await this.evictIdleRuntimeHandles(input.cfg);
    return await this.withSessionActor(sessionKey, async () => {
      return await runManagerInitializeSession({
        input,
        sessionKey,
        deps: this.deps,
        runtimeHandles: this.runtimeHandles,
        enforceConcurrentSessionLimit: this.enforceConcurrentSessionLimit.bind(this),
        writeSessionMeta: this.writeSessionMeta.bind(this),
      });
    });
  }
  async getSessionStatus(params) {
    const sessionKey = canonicalizeAcpSessionKey(params);
    if (!sessionKey)
      throw new AcpRuntimeError("ACP_SESSION_INIT_FAILED", "ACP session key is required.");
    this.throwIfAborted(params.signal);
    await this.evictIdleRuntimeHandles(params.cfg);
    return await this.withSessionActor(
      sessionKey,
      async () =>
        await runManagerGetSessionStatus({
          cfg: params.cfg,
          sessionKey,
          signal: params.signal,
          throwIfAborted: this.throwIfAborted.bind(this),
          resolveSession: this.resolveSession.bind(this),
          ensureRuntimeHandle: this.ensureRuntimeHandle.bind(this),
          resolveRuntimeCapabilities: this.resolveRuntimeCapabilities.bind(this),
          reconcileRuntimeSessionIdentifiers: this.reconcileRuntimeSessionIdentifiers.bind(this),
        }),
      params.signal,
    );
  }
  async setSessionRuntimeMode(params) {
    const sessionKey = canonicalizeAcpSessionKey(params);
    if (!sessionKey)
      throw new AcpRuntimeError("ACP_SESSION_INIT_FAILED", "ACP session key is required.");
    const runtimeMode = validateRuntimeModeInput(params.runtimeMode);
    await this.evictIdleRuntimeHandles(params.cfg);
    return await this.withSessionActor(sessionKey, async () => {
      return await runSetManagerSessionRuntimeMode({
        cfg: params.cfg,
        sessionKey,
        runtimeMode,
        ...this.runtimeOptionCommandServices(),
      });
    });
  }
  async setSessionConfigOption(params) {
    const sessionKey = canonicalizeAcpSessionKey(params);
    if (!sessionKey)
      throw new AcpRuntimeError("ACP_SESSION_INIT_FAILED", "ACP session key is required.");
    const normalizedOption = validateRuntimeConfigOptionInput(params.key, params.value);
    const key = normalizedOption.key;
    const value = normalizedOption.value;
    await this.evictIdleRuntimeHandles(params.cfg);
    return await this.withSessionActor(sessionKey, async () => {
      return await runSetManagerSessionConfigOption({
        cfg: params.cfg,
        sessionKey,
        key,
        value,
        ...this.runtimeOptionCommandServices(),
      });
    });
  }
  async updateSessionRuntimeOptions(params) {
    const sessionKey = canonicalizeAcpSessionKey(params);
    const validatedPatch = validateRuntimeOptionPatch(params.patch);
    if (!sessionKey)
      throw new AcpRuntimeError("ACP_SESSION_INIT_FAILED", "ACP session key is required.");
    await this.evictIdleRuntimeHandles(params.cfg);
    return await this.withSessionActor(sessionKey, async () => {
      return await runUpdateManagerSessionRuntimeOptions({
        cfg: params.cfg,
        sessionKey,
        patch: validatedPatch,
        ...this.runtimeOptionCommandServices(),
      });
    });
  }
  async resetSessionRuntimeOptions(params) {
    const sessionKey = canonicalizeAcpSessionKey(params);
    if (!sessionKey)
      throw new AcpRuntimeError("ACP_SESSION_INIT_FAILED", "ACP session key is required.");
    await this.evictIdleRuntimeHandles(params.cfg);
    return await this.withSessionActor(sessionKey, async () => {
      return await runResetManagerSessionRuntimeOptions({
        cfg: params.cfg,
        sessionKey,
        ...this.runtimeOptionCommandServices(),
      });
    });
  }
  async runTurn(input) {
    const sessionKey = canonicalizeAcpSessionKey({
      cfg: input.cfg,
      sessionKey: input.sessionKey,
    });
    if (!sessionKey)
      throw new AcpRuntimeError("ACP_SESSION_INIT_FAILED", "ACP session key is required.");
    await this.evictIdleRuntimeHandles(input.cfg);
    await this.withSessionActor(
      sessionKey,
      async () =>
        await runManagerTurn({
          input,
          sessionKey,
          deps: this.deps,
          runtimeHandles: this.runtimeHandles,
          activeTurnBySession: this.activeTurnBySession,
          resolveSession: this.resolveSession.bind(this),
          ensureRuntimeHandle: this.ensureRuntimeHandle.bind(this),
          applyRuntimeControls: this.applyRuntimeControls.bind(this),
          setSessionState: this.setSessionState.bind(this),
          recordTurnCompletion: this.recordTurnCompletion.bind(this),
          reconcileRuntimeSessionIdentifiers: this.reconcileRuntimeSessionIdentifiers.bind(this),
          writeSessionMeta: this.writeSessionMeta.bind(this),
        }),
      input.signal,
    );
  }
  async cancelSession(params) {
    const sessionKey = canonicalizeAcpSessionKey(params);
    if (!sessionKey)
      throw new AcpRuntimeError("ACP_SESSION_INIT_FAILED", "ACP session key is required.");
    await this.evictIdleRuntimeHandles(params.cfg);
    await runManagerCancelSession({
      cfg: params.cfg,
      sessionKey,
      reason: params.reason,
      activeTurnBySession: this.activeTurnBySession,
      withSessionActor: this.withSessionActor.bind(this),
      resolveSession: this.resolveSession.bind(this),
      ensureRuntimeHandle: this.ensureRuntimeHandle.bind(this),
      setSessionState: this.setSessionState.bind(this),
    });
  }
  async closeSession(input) {
    const sessionKey = canonicalizeAcpSessionKey({
      cfg: input.cfg,
      sessionKey: input.sessionKey,
    });
    if (!sessionKey)
      throw new AcpRuntimeError("ACP_SESSION_INIT_FAILED", "ACP session key is required.");
    await this.evictIdleRuntimeHandles(input.cfg);
    return await this.withSessionActor(
      sessionKey,
      async () =>
        await runManagerCloseSession({
          input,
          sessionKey,
          deps: this.deps,
          runtimeHandles: this.runtimeHandles,
          resolveSession: this.resolveSession.bind(this),
          ensureRuntimeHandle: this.ensureRuntimeHandle.bind(this),
          writeSessionMeta: this.writeSessionMeta.bind(this),
        }),
    );
  }
  async ensureRuntimeHandle(params) {
    return await ensureManagerRuntimeHandle({
      ...params,
      deps: this.deps,
      runtimeHandles: this.runtimeHandles,
      enforceConcurrentSessionLimit: (limitParams) =>
        this.enforceConcurrentSessionLimit(limitParams),
      writeSessionMeta: async (writeParams) => await this.writeSessionMeta(writeParams),
    });
  }
  runtimeOptionCommandServices() {
    return {
      runtimeHandles: this.runtimeHandles,
      resolveSession: this.resolveSession.bind(this),
      ensureRuntimeHandle: this.ensureRuntimeHandle.bind(this),
      resolveRuntimeCapabilities: this.resolveRuntimeCapabilities.bind(this),
      writeSessionMeta: this.writeSessionMeta.bind(this),
    };
  }
  enforceConcurrentSessionLimit(params) {
    const configuredLimit = params.cfg.acp?.maxConcurrentSessions;
    if (typeof configuredLimit !== "number" || !Number.isFinite(configuredLimit)) return;
    const limit = Math.max(1, Math.floor(configuredLimit));
    if (this.runtimeHandles.has(params.sessionKey)) return;
    const activeCount = this.runtimeHandles.size();
    if (activeCount >= limit)
      throw new AcpRuntimeError(
        "ACP_SESSION_INIT_FAILED",
        `ACP max concurrent sessions reached (${activeCount}/${limit}).`,
      );
  }
  recordTurnCompletion(params) {
    const durationMs = Math.max(0, Date.now() - params.startedAt);
    this.turnLatencyStats.totalMs += durationMs;
    this.turnLatencyStats.maxMs = Math.max(this.turnLatencyStats.maxMs, durationMs);
    if (params.errorCode) {
      this.turnLatencyStats.failed += 1;
      this.recordErrorCode(params.errorCode);
      return;
    }
    this.turnLatencyStats.completed += 1;
  }
  recordErrorCode(code) {
    const normalized = normalizeAcpErrorCode(code);
    this.errorCountsByCode.set(normalized, (this.errorCountsByCode.get(normalized) ?? 0) + 1);
  }
  async resolveRuntimeCapabilities(params) {
    return await resolveManagerRuntimeCapabilities(params);
  }
  async evictIdleRuntimeHandles(cfg) {
    await this.runtimeHandles.evictIdle({
      cfg,
      actorQueue: this.actorQueue,
      activeTurnBySession: this.activeTurnBySession,
    });
  }
  async applyRuntimeControls(params) {
    await applyManagerRuntimeControls({
      ...params,
      getCachedRuntimeState: (sessionKey) => this.runtimeHandles.get(sessionKey),
    });
  }
  async setSessionState(params) {
    await this.writeSessionMeta({
      cfg: params.cfg,
      sessionKey: params.sessionKey,
      skipMaintenance: true,
      takeCacheOwnership: true,
      mutate: (current, entry) => {
        if (!entry) return null;
        const base = current;
        if (!base) return null;
        const next = {
          backend: base.backend,
          agent: base.agent,
          runtimeSessionName: base.runtimeSessionName,
          ...(base.identity ? { identity: base.identity } : {}),
          mode: base.mode,
          ...(base.runtimeOptions ? { runtimeOptions: base.runtimeOptions } : {}),
          ...(base.cwd ? { cwd: base.cwd } : {}),
          state: params.state,
          lastActivityAt: Date.now(),
          ...(base.lastError ? { lastError: base.lastError } : {}),
        };
        const lastError = normalizeOptionalString(params.lastError);
        if (lastError) next.lastError = lastError;
        else if (params.clearLastError) delete next.lastError;
        return next;
      },
    });
  }
  async reconcileRuntimeSessionIdentifiers(params) {
    return await reconcileManagerRuntimeSessionIdentifiers({
      ...params,
      setCachedHandle: (sessionKey, handle) => {
        const cached = this.runtimeHandles.get(sessionKey);
        if (cached) cached.handle = handle;
      },
      writeSessionMeta: async (writeParams) => await this.writeSessionMeta(writeParams),
    });
  }
  async writeSessionMeta(params) {
    try {
      return await this.deps.upsertSessionMeta({
        cfg: params.cfg,
        sessionKey: params.sessionKey,
        mutate: params.mutate,
        ...(params.skipMaintenance === true ? { skipMaintenance: true } : {}),
        ...(params.takeCacheOwnership === true ? { takeCacheOwnership: true } : {}),
      });
    } catch (error) {
      if (params.failOnError) throw error;
      logVerbose(
        `acp-manager: failed persisting ACP metadata for ${params.sessionKey}: ${String(error)}`,
      );
      return null;
    }
  }
  async withSessionActor(sessionKey, op, signal) {
    const actorKey = normalizeActorKey(sessionKey);
    this.throwIfAborted(signal);
    let actorStarted = false;
    const queued = this.actorQueue.run(actorKey, async () => {
      actorStarted = true;
      this.throwIfAborted(signal);
      return await op();
    });
    if (!signal) return await queued;
    return await new Promise((resolve, reject) => {
      let settled = false;
      const cleanup = () => {
        signal.removeEventListener("abort", onAbort);
      };
      const settleValue = (value) => {
        if (settled) return;
        settled = true;
        cleanup();
        resolve(value);
      };
      const settleError = (error) => {
        if (settled) return;
        settled = true;
        cleanup();
        reject(toErrorObject(error, "Non-Error rejection"));
      };
      const onAbort = () => {
        if (actorStarted) return;
        try {
          this.throwIfAborted(signal);
        } catch (error) {
          settleError(error);
        }
      };
      signal.addEventListener("abort", onAbort, { once: true });
      queued.then(settleValue, settleError);
      if (signal.aborted) onAbort();
    });
  }
  throwIfAborted(signal) {
    if (!signal?.aborted) return;
    throw new AcpRuntimeError("ACP_TURN_FAILED", "ACP operation aborted.");
  }
};
//#endregion
//#region src/acp/control-plane/manager.ts
/** Public singleton facade for the ACP session manager control plane. */
let ACP_SESSION_MANAGER_SINGLETON = null;
/** Returns the process-wide ACP session manager singleton. */
function getAcpSessionManager() {
  if (!ACP_SESSION_MANAGER_SINGLETON) ACP_SESSION_MANAGER_SINGLETON = new AcpSessionManager();
  return ACP_SESSION_MANAGER_SINGLETON;
}
const testing = {
  resetAcpSessionManagerForTests() {
    ACP_SESSION_MANAGER_SINGLETON = null;
  },
  setAcpSessionManagerForTests(manager) {
    ACP_SESSION_MANAGER_SINGLETON = manager;
  },
};
//#endregion
export {
  resolveAcpSessionResolutionError as a,
  isAcpTurnActive as i,
  testing as n,
  AcpSessionManager as r,
  getAcpSessionManager as t,
};
