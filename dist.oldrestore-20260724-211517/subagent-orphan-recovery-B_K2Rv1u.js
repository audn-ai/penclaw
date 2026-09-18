import crypto from "node:crypto";
import { c as callGateway } from "./call-BVMO6az_.js";
import "./utils-DtcDeqWS.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { f as runWithGatewayIndependentRootWorkAdmission } from "./gateway-work-admission-yGjmBAjy.js";
import { r as resolveInternalSessionEffectsTarget } from "./internal-session-effects-BH8UB_O9.js";
import "./config-BDv-QbJ6.js";
import { i as getRuntimeConfig } from "./io-B3ne6NxF.js";
import { l as resolveStorePath } from "./paths-TfuVT-K8.js";
import { D as patchSessionEntry, S as loadSessionEntry } from "./session-accessor-PZVNxFCV.js";
import { d as resolveAgentIdFromSessionKey } from "./session-key-druuY-GG.js";
import "./sessions-CEG7v41b.js";
import { s as readSessionMessagesAsync } from "./session-transcript-readers-Bv0ty7AX.js";
import {
  a as markSubagentRecoveryAttempt,
  n as evaluateSubagentRecoveryGate,
  o as markSubagentRecoveryWedged,
} from "./subagent-recovery-state-B4lLUF84.js";
import {
  n as finalizeInterruptedSubagentRun,
  r as replaceSubagentRunAfterSteer,
} from "./subagent-registry-steer-runtime-ECWUlUYG.js";
import {
  i as isStaleUnendedSubagentRun,
  s as getSubagentSessionStartedAt,
} from "./subagent-run-liveness-CYJpdt9z.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region src/agents/subagent-orphan-recovery.ts
/**
 * Post-restart interrupted-run resume for subagent sessions.
 *
 * After a SIGUSR1 gateway reload aborts in-flight subagent LLM calls,
 * this module scans for interrupted sessions (those with `abortedLastRun: true`
 * that are still tracked as active in the subagent registry) and sends a
 * synthetic resume message to restart their work. Parent notification is handled
 * separately by completion delivery after the child reaches a terminal result.
 *
 * @see https://github.com/openclaw/openclaw/issues/47711
 */
const log = createSubsystemLogger("subagent-interrupted-resume");
/** Delay before attempting recovery to let the gateway finish bootstrapping. */
const DEFAULT_RECOVERY_DELAY_MS = 5e3;
function isLegacyRestartInterruptedTimeout(runRecord, entry) {
  return (
    entry?.abortedLastRun === true &&
    runRecord.outcome?.status === "timeout" &&
    typeof runRecord.endedAt === "number" &&
    runRecord.endedAt > 0
  );
}
function reclassifyLegacyRestartInterruptedRun(runRecord) {
  const interruptedAt = runRecord.endedAt;
  runRecord.execution = {
    ...runRecord.execution,
    status: "interrupted",
    interruptedAt,
    interruptionReason: "gateway-restart",
    endedAt: void 0,
    outcome: void 0,
  };
  runRecord.endedAt = void 0;
  runRecord.endedReason = void 0;
  runRecord.outcome = void 0;
  runRecord.terminalOwner = void 0;
}
function loadRecoverySessionEntry(params) {
  return loadSessionEntry({
    storePath: params.storePath,
    sessionKey: params.childSessionKey,
    clone: false,
  });
}
async function patchRecoverySessionEntry(params) {
  return await patchSessionEntry(
    {
      storePath: params.storePath,
      sessionKey: params.childSessionKey,
    },
    (entry) => {
      params.update(entry);
      return entry;
    },
    {
      replaceEntry: true,
      skipMaintenance: true,
    },
  );
}
/**
 * Build the resume message for an orphaned subagent.
 */
function buildResumeMessage(task, lastHumanMessage) {
  const maxTaskLen = 2e3;
  let message = `[System] Your previous turn was interrupted by a gateway reload. Your original task was:\n\n${task.length > maxTaskLen ? `${truncateUtf16Safe(task, maxTaskLen)}...` : task}\n\n`;
  if (lastHumanMessage)
    message += `The last message from the user before the interruption was:\n\n${lastHumanMessage}\n\n`;
  message += `Please continue where you left off.`;
  return message;
}
function extractMessageText(msg) {
  if (!msg || typeof msg !== "object") return;
  const m = msg;
  if (typeof m.content === "string") return m.content;
  if (Array.isArray(m.content))
    return (
      m.content
        .filter(
          (c) =>
            typeof c === "object" && c !== null && c.type === "text" && typeof c.text === "string",
        )
        .map((c) => c.text)
        .filter(Boolean)
        .join("\n") || void 0
    );
}
/**
 * Send a resume message to an orphaned subagent session via the gateway agent method.
 */
async function resumeOrphanedSession(params) {
  let resumeMessage = buildResumeMessage(params.task, params.lastHumanMessage);
  if (params.configChangeHint) resumeMessage += params.configChangeHint;
  try {
    const idempotencyKey = crypto.randomUUID();
    const result = await callGateway({
      method: "agent",
      params: {
        message: resumeMessage,
        sessionKey: params.sessionKey,
        idempotencyKey,
        deliver: false,
        lane: "subagent",
        inputProvenance: {
          kind: "inter_session",
          sourceSessionKey: params.originalRun.requesterSessionKey,
          sourceChannel: "internal",
          sourceTool: "subagent_interrupted_resume",
        },
        sessionEffects: "internal",
        suppressPromptPersistence: true,
      },
      timeoutMs: 1e4,
    });
    if (
      !replaceSubagentRunAfterSteer({
        previousRunId: params.originalRunId,
        nextRunId: result.runId,
        fallback: params.originalRun,
        transcriptTarget: resolveInternalSessionEffectsTarget({
          agentId: resolveAgentIdFromSessionKey(params.sessionKey),
          runId: result.runId,
          storePath: resolveStorePath(getRuntimeConfig().session?.store, {
            agentId: resolveAgentIdFromSessionKey(params.sessionKey),
          }),
        }),
        task: params.task,
      })
    ) {
      log.warn(
        `resumed orphaned session ${params.sessionKey} but remap failed (old run already removed); treating resume as accepted to avoid duplicate restarts`,
      );
      return { resumed: true };
    }
    log.info(`resumed orphaned session: ${params.sessionKey}`);
    return { resumed: true };
  } catch (err) {
    const error = formatErrorMessage(err);
    log.warn(`failed to resume orphaned session ${params.sessionKey}: ${error}`);
    return {
      resumed: false,
      error,
    };
  }
}
/**
 * Scan for and resume orphaned subagent sessions after a gateway restart.
 *
 * An orphaned session is one where:
 * 1. It has an active (not ended) entry in the subagent run registry
 * 2. Its session store entry has `abortedLastRun: true`
 *
 * For each orphaned session found, we:
 * 1. Clear the `abortedLastRun` flag
 * 2. Send a synthetic resume message to trigger a new LLM turn
 */
async function recoverOrphanedSubagentSessions(params) {
  const result = {
    recovered: 0,
    failed: 0,
    skipped: 0,
    failedRuns: [],
  };
  const resumedSessionKeys = params.resumedSessionKeys ?? /* @__PURE__ */ new Set();
  const pendingStaleFinalizations = params.pendingStaleFinalizations ?? /* @__PURE__ */ new Map();
  const configChangePattern = /openclaw\.json|openclaw gateway restart|config\.patch/i;
  try {
    const activeRuns = params.getActiveRuns();
    if (activeRuns.size === 0) return result;
    let cfg;
    const scanNow = Date.now();
    const runEntries = [...activeRuns.entries()].toSorted(([, left], [, right]) => {
      const leftIsStale = isStaleUnendedSubagentRun(left, scanNow);
      const rightIsStale = isStaleUnendedSubagentRun(right, scanNow);
      return Number(rightIsStale) - Number(leftIsStale);
    });
    for (const [runId, runRecord] of runEntries) {
      const childSessionKey = runRecord.childSessionKey?.trim();
      if (!childSessionKey) continue;
      const now = scanNow;
      if (
        runRecord.terminalOwner === "interrupted-recovery" &&
        Number.isFinite(runRecord.endedAt) &&
        runRecord.outcome?.status === "error" &&
        runRecord.endedReason === "subagent-error" &&
        runRecord.pauseReason !== "sessions_yield"
      ) {
        const recoveryError =
          runRecord.outcome?.status === "error"
            ? (runRecord.outcome.error ?? "subagent run interrupted by gateway restart")
            : "subagent run interrupted by gateway restart";
        try {
          if (
            (await finalizeInterruptedSubagentRun({
              runId,
              error: recoveryError,
              endedAt: runRecord.endedAt,
            })) === 0
          ) {
            result.failed++;
            result.failedRuns.push({
              runId,
              childSessionKey,
              error: recoveryError,
            });
          } else {
            pendingStaleFinalizations.delete(runId);
            result.skipped++;
          }
        } catch (err) {
          const error = formatErrorMessage(err);
          log.warn(`replay interrupted terminal ${runId}: ${error}`);
          result.failed++;
          result.failedRuns.push({
            runId,
            childSessionKey,
            error,
          });
        }
        continue;
      }
      const pendingStaleError = pendingStaleFinalizations.get(runId);
      if (pendingStaleError) {
        try {
          if (
            (await finalizeInterruptedSubagentRun({
              runId,
              error: pendingStaleError,
            })) === 0
          ) {
            result.failed++;
            result.failedRuns.push({
              runId,
              childSessionKey,
              error: pendingStaleError,
            });
          } else {
            pendingStaleFinalizations.delete(runId);
            result.skipped++;
          }
        } catch (err) {
          const error = formatErrorMessage(err);
          log.warn(`retry stale terminal ${runId}: ${error}`);
          result.failed++;
          result.failedRuns.push({
            runId,
            childSessionKey,
            error,
          });
        }
        continue;
      }
      if (resumedSessionKeys.has(childSessionKey)) {
        result.skipped++;
        continue;
      }
      try {
        cfg ??= getRuntimeConfig();
        const agentId = resolveAgentIdFromSessionKey(childSessionKey);
        const storePath = resolveStorePath(cfg.session?.store, { agentId });
        const entry = loadRecoverySessionEntry({
          storePath,
          childSessionKey,
        });
        if (!entry) {
          result.skipped++;
          continue;
        }
        if (isLegacyRestartInterruptedTimeout(runRecord, entry))
          reclassifyLegacyRestartInterruptedRun(runRecord);
        if (typeof runRecord.endedAt === "number" && runRecord.endedAt > 0) {
          result.skipped++;
          continue;
        }
        if (!entry.abortedLastRun) {
          result.skipped++;
          continue;
        }
        if (isStaleUnendedSubagentRun(runRecord, now)) {
          const staleStartedAt = getSubagentSessionStartedAt(runRecord) ?? now;
          const staleError = `stale aborted subagent run not resumed (${Math.round((now - staleStartedAt) / 1e3)}s old, exceeds stale-run window)`;
          try {
            if (
              (await finalizeInterruptedSubagentRun({
                runId,
                error: staleError,
              })) === 0
            ) {
              pendingStaleFinalizations.set(runId, staleError);
              result.failed++;
              result.failedRuns.push({
                runId,
                childSessionKey,
                error: staleError,
              });
            } else {
              pendingStaleFinalizations.delete(runId);
              result.skipped++;
            }
          } catch (err) {
            const error = formatErrorMessage(err);
            log.warn(`finalize stale run ${runId}: ${error}`);
            pendingStaleFinalizations.set(runId, staleError);
            result.failed++;
            result.failedRuns.push({
              runId,
              childSessionKey,
              error,
            });
          }
          continue;
        }
        const recoveryGate = evaluateSubagentRecoveryGate(entry, now);
        if (!recoveryGate.allowed) {
          if (recoveryGate.shouldMarkWedged)
            try {
              const updated = await patchRecoverySessionEntry({
                storePath,
                childSessionKey,
                update: (current) => {
                  markSubagentRecoveryWedged({
                    entry: current,
                    now,
                    runId,
                    reason: recoveryGate.reason,
                  });
                },
              });
              if (updated) Object.assign(entry, updated);
            } catch (err) {
              log.warn(
                `failed to persist wedged subagent recovery marker for ${childSessionKey}: ${String(err)}`,
              );
            }
          log.warn(`skipping orphan recovery for ${childSessionKey}: ${recoveryGate.reason}`);
          result.skipped++;
          result.failedRuns.push({
            runId,
            childSessionKey,
            error: recoveryGate.reason,
          });
          continue;
        }
        log.info(`found orphaned subagent session: ${childSessionKey} (run=${runId})`);
        const messages = await readSessionMessagesAsync(
          {
            agentId: resolveAgentIdFromSessionKey(childSessionKey),
            sessionEntry: entry,
            sessionId: entry.sessionId,
            sessionKey: childSessionKey,
            storePath,
          },
          {
            mode: "recent",
            maxMessages: 200,
            maxBytes: 1024 * 1024,
          },
        );
        const lastHumanMessage = [...messages].toReversed().find((msg) => msg?.role === "user");
        const configChangeDetected = messages.some((msg) => {
          if (msg?.role !== "assistant") return false;
          const text = extractMessageText(msg);
          return typeof text === "string" && configChangePattern.test(text);
        });
        const resumeResult = await resumeOrphanedSession({
          sessionKey: childSessionKey,
          task: runRecord.task,
          lastHumanMessage: extractMessageText(lastHumanMessage),
          configChangeHint: configChangeDetected
            ? "\n\n[config changes from your previous run were already applied — do not re-modify openclaw.json or restart the gateway]"
            : void 0,
          originalRunId: runId,
          originalRun: runRecord,
        });
        if (resumeResult.resumed) {
          resumedSessionKeys.add(childSessionKey);
          try {
            await patchRecoverySessionEntry({
              storePath,
              childSessionKey,
              update: (current) => {
                current.abortedLastRun = false;
                markSubagentRecoveryAttempt({
                  entry: current,
                  now: Date.now(),
                  runId,
                  attempt: recoveryGate.nextAttempt,
                });
                current.updatedAt = Date.now();
              },
            });
          } catch (err) {
            log.warn(
              `resume succeeded but failed to update session store for ${childSessionKey}: ${String(err)}`,
            );
          }
          result.recovered++;
        } else {
          log.warn(
            `resume failed for ${childSessionKey}; abortedLastRun flag preserved for retry on next restart`,
          );
          result.failed++;
          result.failedRuns.push({
            runId,
            childSessionKey,
            error: resumeResult.error,
          });
        }
      } catch (err) {
        const error = formatErrorMessage(err);
        log.warn(`error processing orphaned session ${childSessionKey}: ${error}`);
        result.failed++;
        result.failedRuns.push({
          runId,
          childSessionKey,
          error,
        });
      }
    }
  } catch (err) {
    log.warn(`orphan recovery scan failed: ${String(err)}`);
    if (result.failed === 0) result.failed = 1;
  }
  if (result.recovered > 0 || result.failed > 0)
    log.info(
      `orphan recovery complete: recovered=${result.recovered} failed=${result.failed} skipped=${result.skipped}`,
    );
  return result;
}
/** Maximum number of retry attempts for orphan recovery. */
const MAX_RECOVERY_RETRIES = 3;
/** Backoff multiplier between retries (exponential). */
const RETRY_BACKOFF_MULTIPLIER = 2;
/** Separate durable-terminal attempts after session recovery is exhausted. */
const MAX_TERMINAL_FINALIZE_ATTEMPTS = 3;
function buildRecoveryFailureMessage(params) {
  const base = `Subagent run was interrupted by a gateway restart or connection loss. Automatic recovery failed after ${params.attempts} attempt${params.attempts === 1 ? "" : "s"}. Please retry.`;
  const detail = params.error?.trim();
  if (!detail) return base;
  return `${base} (${detail})`;
}
async function finalizeInterruptedRunWithRetry(params) {
  let delayMs = Math.max(1, params.initialDelayMs);
  for (let attempt = 1; attempt <= MAX_TERMINAL_FINALIZE_ATTEMPTS; attempt += 1) {
    try {
      if (
        (await finalizeInterruptedSubagentRun({
          runId: params.runId,
          error: params.error,
        })) > 0
      )
        return true;
    } catch {}
    if (attempt < MAX_TERMINAL_FINALIZE_ATTEMPTS) {
      await new Promise((resolve) => {
        setTimeout(resolve, delayMs).unref?.();
      });
      delayMs *= RETRY_BACKOFF_MULTIPLIER;
    }
  }
  return false;
}
/**
 * Schedule orphan recovery after a delay, with retry logic.
 * The delay gives the gateway time to fully bootstrap after restart.
 * If recovery fails (e.g. gateway not yet ready), retries with exponential backoff.
 */
function scheduleOrphanRecovery(params) {
  const initialDelay = params.delayMs ?? DEFAULT_RECOVERY_DELAY_MS;
  const maxRetries = params.maxRetries ?? MAX_RECOVERY_RETRIES;
  const resumedSessionKeys = /* @__PURE__ */ new Set();
  const pendingStaleFinalizations = /* @__PURE__ */ new Map();
  const attemptRecovery = (attempt, delay) => {
    setTimeout(() => {
      runWithGatewayIndependentRootWorkAdmission(async () => {
        const result = await recoverOrphanedSubagentSessions({
          ...params,
          resumedSessionKeys,
          pendingStaleFinalizations,
        });
        if (result.failed > 0 && attempt < maxRetries) {
          const nextDelay = delay * RETRY_BACKOFF_MULTIPLIER;
          log.info(
            `orphan recovery had ${result.failed} failure(s); retrying in ${nextDelay}ms (attempt ${attempt + 1}/${maxRetries})`,
          );
          attemptRecovery(attempt + 1, nextDelay);
          return;
        }
        if (result.failedRuns.length === 0) return;
        const attempts = attempt + 1;
        const incomplete = (
          await Promise.all(
            result.failedRuns.map(async (run) => ({
              runId: run.runId,
              completed: await finalizeInterruptedRunWithRetry({
                runId: run.runId,
                error: buildRecoveryFailureMessage({
                  attempts,
                  error: run.error,
                }),
                initialDelayMs: delay,
              }),
            })),
          )
        )
          .filter((terminal) => !terminal.completed)
          .map((terminal) => terminal.runId);
        if (incomplete.length > 0)
          log.warn(
            `orphan recovery exhausted with ${incomplete.length} interrupted terminal projection(s) incomplete`,
            { runIds: incomplete },
          );
      }).catch((err) => {
        if (attempt < maxRetries) {
          const nextDelay = delay * RETRY_BACKOFF_MULTIPLIER;
          log.warn(
            `scheduled orphan recovery failed: ${String(err)}; retrying in ${nextDelay}ms (attempt ${attempt + 1}/${maxRetries})`,
          );
          attemptRecovery(attempt + 1, nextDelay);
        } else
          log.warn(`scheduled orphan recovery failed after ${maxRetries} retries: ${String(err)}`);
      });
    }, delay).unref?.();
  };
  attemptRecovery(0, initialDelay);
}
//#endregion
export { scheduleOrphanRecovery };
