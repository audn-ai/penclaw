import { randomUUID } from "node:crypto";
import { W as convertToLlm } from "./agent-core-DJCbl_Iw.js";
import { t as clearSessionQueues } from "./cleanup-DDlcY-PM.js";
import { r as resolveDefaultModelForAgent } from "./codex-plugin-diagnostics-DxsLhCf5.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import {
  a as buildUsageAgentMetaFields,
  b as createUsageAccumulator,
  v as resolveReportedModelRef,
  x as mergeUsageIntoAccumulator,
} from "./helpers-BcP5pARq.js";
import { i as getRuntimeConfig } from "./io-B3ne6NxF.js";
import "./config-BDv-QbJ6.js";
import { n as parseWorkerLaunchDescriptor } from "./launch-descriptor-RhQ48d91.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-B-Fc-m0I.js";
import {
  L as isDefaultAgentRuntimeId,
  z as normalizeOptionalAgentRuntimeId,
} from "./openai-routing-Cu28Ynzk.js";
import { c as redactSensitiveText } from "./redact-CUe6Oey5.js";
import { n as workerEnvironmentIdForIdempotencyKey } from "./service-D00aBPJK.js";
import { Bt as hasNonzeroUsage, Ht as normalizeUsage } from "./session-accessor-PZVNxFCV.js";
import { t as SessionManager } from "./session-manager-BD4l9VJc.js";
import {
  n as installSessionPlacementResetGuard,
  t as installSessionPlacementAdmissionProvider,
} from "./session-placement-admission-C_WzNYGC.js";
import {
  Y as SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS,
  et as interruptSessionWorkAdmissions,
  ot as runExclusiveSessionStoreWrite,
  rt as runExclusiveSessionLifecycleMutation,
} from "./store-CzZJhTF6.js";
import { r as resolveEffectiveAgentRuntime } from "./thinking-runtime-D675lyzz.js";
import { a as toWorkerTranscriptMessage } from "./transcript-message-widVBq0t.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
import { n as mapThinkingLevelForProvider } from "./utils-CefVZRZM.js";
import { t as WORKER_INFERENCE_MAX_CONTEXT_MESSAGES } from "./worker-inference-y83k6oxW.js";
//#region src/gateway/worker-environments/placement-dispatch-failure.ts
const RECOVERY_ERROR_LIMIT = 1024;
function boundedError(error) {
  return truncateUtf16Safe(
    redactSensitiveText(formatErrorMessage(error), { mode: "tools" })
      .replace(/\s+/gu, " ")
      .trim() || "unknown dispatch failure",
    RECOVERY_ERROR_LIMIT,
  );
}
function isUnavailableEnvironment(environment) {
  return (
    environment.state === "draining" ||
    environment.state === "destroying" ||
    environment.state === "destroyed" ||
    environment.state === "failed" ||
    environment.state === "orphaned"
  );
}
function createPlacementFailureActions(deps) {
  const { environments, placements } = deps;
  const updateFailure = (placement, error) =>
    placements.fail({
      sessionId: placement.sessionId,
      expectedGeneration: placement.generation,
      recoveryError: boundedError(error),
    });
  const cleanupEnvironment = async (params) => {
    const teardownErrors = [];
    try {
      await environments.stopTunnel(params.environmentId, params.ownerEpoch ?? void 0);
    } catch (error) {
      teardownErrors.push(`tunnel stop: ${boundedError(error)}`);
    }
    try {
      await environments.destroy(params.environmentId);
    } catch (error) {
      teardownErrors.push(`environment destroy: ${boundedError(error)}`);
    }
    return teardownErrors;
  };
  const teardownEnvironment = async (params) => {
    const environmentId = params.environmentId;
    const teardownErrors = environmentId
      ? await cleanupEnvironment({
          environmentId,
          ownerEpoch: params.ownerEpoch,
        })
      : [];
    const recoveryError = [boundedError(params.primaryError), ...teardownErrors].join("; ");
    updateFailure(
      params.placement,
      new Error(truncateUtf16Safe(recoveryError, RECOVERY_ERROR_LIMIT)),
    );
  };
  const retryFailedTeardown = async (placement) => {
    if (!placement.environmentId) return;
    const environment = environments.get(placement.environmentId);
    if (
      !environment ||
      environment.state === "destroyed" ||
      environment.state === "failed" ||
      environment.state === "orphaned"
    )
      return;
    const teardownErrors = await cleanupEnvironment({
      environmentId: placement.environmentId,
      ownerEpoch: placement.activeOwnerEpoch,
    });
    if (teardownErrors.length > 0) {
      const recoveryError = [placement.recoveryError, ...teardownErrors].filter(Boolean).join("; ");
      placements.fail({
        sessionId: placement.sessionId,
        expectedGeneration: placement.generation,
        recoveryError: truncateUtf16Safe(recoveryError, RECOVERY_ERROR_LIMIT),
      });
    }
  };
  const startDrain = (placement) => {
    const draining = placements.startDrain({
      sessionId: placement.sessionId,
      environmentId: placement.environmentId,
      ownerEpoch: placement.activeOwnerEpoch,
      expectedGeneration: placement.generation,
    });
    if (draining.state !== "draining")
      throw new Error("Worker placement drain did not produce a draining placement");
    return draining;
  };
  const startReconcile = (placement) => {
    const reconciling = placements.startReconcile({
      sessionId: placement.sessionId,
      environmentId: placement.environmentId,
      ownerEpoch: placement.activeOwnerEpoch,
      expectedGeneration: placement.generation,
    });
    if (reconciling.state !== "reconciling")
      throw new Error("Worker placement reconcile did not produce a reconciling placement");
    return reconciling;
  };
  const advanceReclaimed = (placement) => {
    const reconciling = startReconcile(placement);
    if (
      placements.transition({
        sessionId: reconciling.sessionId,
        from: "reconciling",
        to: "reclaimed",
        expectedGeneration: reconciling.generation,
      }).state !== "reclaimed"
    )
      throw new Error("Worker placement reclaim did not produce a reclaimed placement");
  };
  const finishDrainingFailure = (placement, error, teardownErrors) => {
    const reconciling = startReconcile(placement);
    const recoveryError = [boundedError(error), ...teardownErrors].join("; ");
    updateFailure(reconciling, new Error(truncateUtf16Safe(recoveryError, RECOVERY_ERROR_LIMIT)));
  };
  const failDraining = async (placement, error) => {
    const teardownErrors = await cleanupEnvironment({
      environmentId: placement.environmentId,
      ownerEpoch: placement.activeOwnerEpoch,
    });
    finishDrainingFailure(placement, error, teardownErrors);
  };
  const reclaimActive = async (placement, environment, claimedTurnError) => {
    const draining = startDrain(placement);
    if (draining.turnClaim) {
      await failDraining(draining, claimedTurnError);
      return;
    }
    if (environment && !isUnavailableEnvironment(environment)) {
      const teardownErrors = await cleanupEnvironment({
        environmentId: placement.environmentId,
        ownerEpoch: placement.activeOwnerEpoch,
      });
      if (teardownErrors.length > 0) {
        finishDrainingFailure(
          draining,
          /* @__PURE__ */ new Error(`Worker reclaim teardown failed: ${teardownErrors.join("; ")}`),
          [],
        );
        return;
      }
    }
    advanceReclaimed(draining);
  };
  const failActive = async (placement, error) => {
    const draining = startDrain(placement);
    await failDraining(draining, error);
  };
  return {
    failActive,
    failDraining,
    reclaimActive,
    retryFailedTeardown,
    teardownEnvironment,
  };
}
//#endregion
//#region src/gateway/worker-environments/placement-dispatch-recovery.ts
function sameActiveEnvironment(placement, environment) {
  return Boolean(
    environment &&
    environment.state === "attached" &&
    placement.environmentId &&
    environment.environmentId === placement.environmentId &&
    placement.activeOwnerEpoch !== null &&
    environment.ownerEpoch === placement.activeOwnerEpoch &&
    placement.workerBundleHash &&
    environment.bootstrapReceipt?.bundleHash === placement.workerBundleHash &&
    environment.attachedSessionIds.length === 1 &&
    environment.attachedSessionIds[0] === placement.sessionId,
  );
}
function isStartingPlacement(placement) {
  return placement.state === "starting";
}
function isFailedPlacement(placement) {
  return placement.state === "failed";
}
function createPlacementRecoveryActions(deps) {
  const { environments, failure, placements } = deps;
  const adoptActive = async (placement) => {
    if (placement.turnClaim) {
      const error = /* @__PURE__ */ new Error(
        "Active worker turn claim cannot be proven live after gateway restart",
      );
      await failure.failActive(placement, error);
      return;
    }
    const environment = placement.environmentId
      ? environments.get(placement.environmentId)
      : void 0;
    if (!environment || isUnavailableEnvironment(environment)) {
      await failure.reclaimActive(
        placement,
        environment,
        /* @__PURE__ */ new Error("Active worker disappeared during restart reconciliation"),
      );
      return;
    }
    if (!sameActiveEnvironment(placement, environment)) {
      await failure.reclaimActive(
        placement,
        environment,
        /* @__PURE__ */ new Error("Active worker placement does not match its environment owner"),
      );
      return;
    }
    try {
      await environments.startTunnel({
        environmentId: environment.environmentId,
        ownerEpoch: environment.ownerEpoch,
      });
      placements.adoptActive({
        sessionId: placement.sessionId,
        expectedGeneration: placement.generation,
        environmentId: environment.environmentId,
        ownerEpoch: environment.ownerEpoch,
      });
    } catch (error) {
      await failure.failActive(placement, error);
    }
  };
  const resumeStarting = async (placement) => {
    const environment = placement.environmentId
      ? environments.get(placement.environmentId)
      : void 0;
    const expectedBundle = placement.workerBundleHash;
    const hasSyncedWorkspace = Boolean(
      placement.workspaceBaseManifestRef && placement.remoteWorkspaceDir,
    );
    if (
      !(
        environment &&
        expectedBundle &&
        environment.bootstrapReceipt?.bundleHash === expectedBundle &&
        hasSyncedWorkspace
      )
    ) {
      const error = /* @__PURE__ */ new Error("Interrupted worker dispatch cannot safely resume");
      await failure.teardownEnvironment({
        placement,
        environmentId: placement.environmentId,
        ownerEpoch: environment?.ownerEpoch ?? null,
        primaryError: error,
      });
      return;
    }
    try {
      const ownerEpoch =
        environment.state === "attached" &&
        environment.attachedSessionIds.length === 1 &&
        environment.attachedSessionIds[0] === placement.sessionId
          ? environment.ownerEpoch
          : environment.state === "ready" || environment.state === "idle"
            ? (
                await environments.attachSession({
                  environmentId: environment.environmentId,
                  ownerEpoch: environment.ownerEpoch,
                  sessionId: placement.sessionId,
                })
              ).ownerEpoch
            : void 0;
      if (ownerEpoch === void 0)
        throw new Error(`Worker environment cannot resume dispatch from ${environment.state}`);
      await environments.startTunnel({
        environmentId: environment.environmentId,
        ownerEpoch,
      });
      await deps.runActivationBarrier({
        sessionId: placement.sessionId,
        sessionKey: placement.sessionKey,
        agentId: placement.agentId,
        activate: () => {
          const activated = placements.transition({
            sessionId: placement.sessionId,
            from: "starting",
            to: "active",
            expectedGeneration: placement.generation,
            patch: { activeOwnerEpoch: ownerEpoch },
          });
          if (activated.state !== "active")
            throw new Error("Worker dispatch activation did not produce an active placement");
          return activated;
        },
      });
    } catch (error) {
      await failure.teardownEnvironment({
        placement,
        environmentId: environment.environmentId,
        ownerEpoch: environment.ownerEpoch,
        primaryError: error,
      });
    }
  };
  const reconcile = async () => {
    await environments.reconcileOnce();
    for (const placement of placements.listForReconcile()) {
      if (placement.state === "local" || placement.state === "reclaimed") continue;
      if (placement.state === "active") {
        await adoptActive(placement);
        continue;
      }
      if (isFailedPlacement(placement)) {
        await failure.retryFailedTeardown(placement);
        continue;
      }
      if (isStartingPlacement(placement)) {
        await resumeStarting(placement);
        continue;
      }
      const error = /* @__PURE__ */ new Error(`Worker dispatch interrupted in ${placement.state}`);
      if (placement.state === "draining") {
        await failure.failDraining(placement, error);
        continue;
      }
      await failure.teardownEnvironment({
        placement,
        environmentId: placement.environmentId,
        ownerEpoch: placement.activeOwnerEpoch,
        primaryError: error,
      });
    }
  };
  const reconcileActive = async () => {
    await environments.reconcileOnce();
    for (const placement of placements.listForReconcile()) {
      if (isFailedPlacement(placement)) {
        await failure.retryFailedTeardown(placement);
        continue;
      }
      if (placement.state !== "active") continue;
      const environment = environments.get(placement.environmentId);
      if (!environment || isUnavailableEnvironment(environment)) {
        await failure.reclaimActive(
          placement,
          environment,
          /* @__PURE__ */ new Error("Active worker disappeared during an admitted turn"),
        );
        continue;
      }
      if (!sameActiveEnvironment(placement, environment))
        await failure.reclaimActive(
          placement,
          environment,
          /* @__PURE__ */ new Error("Active worker placement does not match its environment owner"),
        );
    }
  };
  return {
    reconcile,
    reconcileActive,
  };
}
//#endregion
//#region src/gateway/worker-environments/placement-dispatch.ts
function requireProvisionedEnvironment(environment, expectedEnvironmentId) {
  if (
    (environment.state !== "ready" && environment.state !== "idle") ||
    !environment.bootstrapReceipt ||
    environment.environmentId !== expectedEnvironmentId
  )
    throw new Error(`Worker environment is not dispatchable: ${environment.state}`);
  return {
    environmentId: environment.environmentId,
    ownerEpoch: environment.ownerEpoch,
    bundleHash: environment.bootstrapReceipt.bundleHash,
  };
}
function createWorkerPlacementDispatchService(options) {
  const { environments, placements } = options;
  const failure = createPlacementFailureActions({
    environments,
    placements,
  });
  const recovery = createPlacementRecoveryActions({
    environments,
    failure,
    placements,
    runActivationBarrier: options.runActivationBarrier,
  });
  const dispatch = async (request) => {
    let placement;
    let environmentId = null;
    let ownerEpoch = null;
    try {
      placement = await options.runLocalBarrier({
        sessionId: request.sessionId,
        sessionKey: request.sessionKey,
        agentId: request.agentId,
        startDispatch: () => {
          placement = placements.startDispatch({
            sessionId: request.sessionId,
            sessionKey: request.sessionKey,
            agentId: request.agentId,
          });
          return placement;
        },
      });
      const localPath = await options.resolveWorkspacePath(request);
      const idempotencyKey = `session-dispatch:${request.sessionId}:${placement.generation}`;
      const expectedEnvironmentId = workerEnvironmentIdForIdempotencyKey(idempotencyKey);
      placement = placements.transition({
        sessionId: request.sessionId,
        from: "requested",
        to: "provisioning",
        expectedGeneration: placement.generation,
        patch: { environmentId: expectedEnvironmentId },
      });
      const provisioned = requireProvisionedEnvironment(
        await environments.create(request.profileId, idempotencyKey),
        expectedEnvironmentId,
      );
      environmentId = provisioned.environmentId;
      ownerEpoch = provisioned.ownerEpoch;
      placement = placements.transition({
        sessionId: request.sessionId,
        from: "provisioning",
        to: "syncing",
        expectedGeneration: placement.generation,
        patch: {
          environmentId,
          workerBundleHash: provisioned.bundleHash,
        },
      });
      const synced = await (
        await environments.startTunnel({
          environmentId,
          ownerEpoch,
        })
      ).syncWorkspace({
        localPath,
        sessionId: request.sessionId,
        generation: placement.generation,
      });
      placement = placements.transition({
        sessionId: request.sessionId,
        from: "syncing",
        to: "starting",
        expectedGeneration: placement.generation,
        patch: {
          workspaceBaseManifestRef: synced.manifestRef,
          remoteWorkspaceDir: synced.remoteWorkspaceDir,
        },
      });
      ownerEpoch = (
        await environments.attachSession({
          environmentId,
          ownerEpoch,
          sessionId: request.sessionId,
        })
      ).ownerEpoch;
      await environments.startTunnel({
        environmentId,
        ownerEpoch,
      });
      const startingPlacement = placement;
      return await options.runActivationBarrier({
        sessionId: request.sessionId,
        sessionKey: request.sessionKey,
        agentId: request.agentId,
        activate: () => {
          const activated = placements.transition({
            sessionId: request.sessionId,
            from: "starting",
            to: "active",
            expectedGeneration: startingPlacement.generation,
            patch: { activeOwnerEpoch: ownerEpoch },
          });
          if (activated.state !== "active")
            throw new Error("Worker dispatch activation did not produce an active placement");
          return activated;
        },
      });
    } catch (error) {
      const current = placement ? placements.get(request.sessionId) : void 0;
      if (current && current.state !== "local" && current.state !== "reclaimed")
        if (current.state === "active") await failure.failActive(current, error);
        else {
          const currentEnvironmentId = environmentId ?? current.environmentId;
          const currentEnvironment = currentEnvironmentId
            ? environments.get(currentEnvironmentId)
            : void 0;
          await failure.teardownEnvironment({
            placement: current,
            environmentId: currentEnvironment?.environmentId ?? null,
            ownerEpoch: ownerEpoch ?? currentEnvironment?.ownerEpoch ?? null,
            primaryError: error,
          });
        }
      throw error;
    }
  };
  return {
    dispatch,
    reconcile: recovery.reconcile,
    reconcileActive: recovery.reconcileActive,
  };
}
//#endregion
//#region src/gateway/worker-environments/worker-turn-payload.ts
function windowInitialMessages(messages) {
  const projected = messages.flatMap((message) => {
    const value = toWorkerTranscriptMessage(message);
    return value ? [value] : [];
  });
  if (projected.length <= 1024) return projected;
  const minimumStart = projected.length - WORKER_INFERENCE_MAX_CONTEXT_MESSAGES;
  const completeTurnStart = projected.findIndex(
    (message, index) => index >= minimumStart && message.role === "user",
  );
  if (completeTurnStart < 0)
    throw new Error("Worker turn transcript has no complete context window");
  return projected.slice(completeTurnStart);
}
function fitLaunchDescriptor(build, messages) {
  let initialMessages = messages;
  while (true) {
    const descriptor = build(initialMessages);
    if (Buffer.byteLength(JSON.stringify(descriptor), "utf8") <= 26214400) return descriptor;
    const nextTurn = initialMessages.findIndex(
      (message, index) => index > 0 && message.role === "user",
    );
    if (nextTurn < 0)
      throw new Error("Worker turn context exceeds the launch descriptor payload limit");
    initialMessages = initialMessages.slice(nextTurn);
  }
}
function parseRuntimeResult(stdout) {
  let value;
  try {
    value = JSON.parse(stdout.trim());
  } catch (error) {
    throw new Error("Worker process returned invalid output", { cause: error });
  }
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("Worker process returned invalid output");
  const result = value;
  if (
    result.status === "failed" &&
    result.reason === "turn-failed" &&
    Object.keys(result).every((key) => ["status", "reason"].includes(key))
  )
    return result;
  if (
    result.status === "completed" &&
    (result.transcriptLeafId === null || typeof result.transcriptLeafId === "string") &&
    typeof result.transcriptNextSeq === "number" &&
    Number.isSafeInteger(result.transcriptNextSeq) &&
    result.transcriptNextSeq >= 1 &&
    Object.keys(result).every((key) =>
      ["status", "transcriptLeafId", "transcriptNextSeq"].includes(key),
    )
  )
    return result;
  if (
    result.status === "fenced" &&
    (result.reason === "credential-replaced" || result.reason === "owner-epoch-mismatch") &&
    Object.keys(result).every((key) => ["status", "reason"].includes(key))
  )
    return result;
  throw new Error("Worker process returned invalid output");
}
function assistantText(message) {
  if (message.role !== "assistant") return "";
  return message.content.flatMap((part) => (part.type === "text" ? [part.text] : [])).join("");
}
function buildWorkerAgentMeta(params) {
  const usageAccumulator = createUsageAccumulator();
  const assistants = params.messages.filter((message) => message.role === "assistant");
  let lastRunPromptUsage;
  for (const assistant of assistants) {
    const usage = normalizeUsage(assistant.usage);
    mergeUsageIntoAccumulator(usageAccumulator, usage);
    if (hasNonzeroUsage(usage)) lastRunPromptUsage = usage;
  }
  const lastAssistant = assistants.at(-1);
  const usageMeta = buildUsageAgentMetaFields({
    usageAccumulator,
    lastAssistantUsage: lastAssistant?.usage,
    lastRunPromptUsage,
    lastTurnTotal: lastRunPromptUsage?.total,
  });
  const reportedModelRef = resolveReportedModelRef({
    ...params.modelRef,
    assistant: lastAssistant,
  });
  return {
    provider: reportedModelRef.provider,
    model: reportedModelRef.model,
    usage: usageMeta.usage,
    lastCallUsage: usageMeta.lastCallUsage,
    promptTokens: usageMeta.promptTokens,
  };
}
function resolveTurnModelRef(params) {
  const explicitProvider = params.provider?.trim();
  const explicitModel = params.model?.trim();
  const defaults =
    explicitProvider && explicitModel
      ? void 0
      : resolveDefaultModelForAgent({
          cfg: params.config ?? {},
          agentId: params.agentId,
        });
  return {
    provider: explicitProvider ?? defaults?.provider ?? "",
    model: explicitModel ?? defaults?.model ?? "",
  };
}
function assertSupportedTurn(params) {
  if (params.images?.length || params.imageOrder?.length)
    throw new Error("Cloud worker turns do not yet support current-turn image input");
  if (params.clientTools?.length)
    throw new Error("Cloud worker turns do not support client-provided tools");
  const modelRef = resolveTurnModelRef(params);
  const explicitRuntime =
    normalizeOptionalAgentRuntimeId(params.agentHarnessId) ??
    normalizeOptionalAgentRuntimeId(params.agentHarnessRuntimeOverride);
  const runtime =
    explicitRuntime && !isDefaultAgentRuntimeId(explicitRuntime)
      ? explicitRuntime
      : resolveEffectiveAgentRuntime({
          cfg: params.config ?? {},
          provider: modelRef.provider,
          modelId: modelRef.model,
          agentId: params.agentId,
          sessionKey: params.sessionKey,
        });
  if (runtime !== "openclaw")
    throw new Error(`Cloud worker turns require the OpenClaw runtime, not ${runtime}`);
  return modelRef;
}
//#endregion
//#region src/gateway/worker-environments/worker-turn-launcher.ts
const WORKER_LAUNCH_SCRIPT = 'exec node "$HOME/.openclaw-worker/$1/openclaw.mjs" worker';
var WorkerTurnExecutionError = class extends Error {};
function required(value, field) {
  const normalized = value?.trim();
  if (!normalized) throw new Error(`Worker turn ${field} is required`);
  return normalized;
}
async function waitForTurnOperation(params) {
  const timeout = AbortSignal.timeout(params.timeoutMs);
  const signal = params.signal ? AbortSignal.any([params.signal, timeout]) : timeout;
  const abortError = () =>
    signal.reason instanceof Error
      ? signal.reason
      : new Error("Cloud worker operation aborted", { cause: signal.reason });
  if (signal.aborted) throw abortError();
  return await new Promise((resolve, reject) => {
    const onAbort = () => reject(abortError());
    signal.addEventListener("abort", onAbort, { once: true });
    params.operation.then(resolve, reject).finally(() => {
      signal.removeEventListener("abort", onAbort);
    });
  });
}
function resolvePlacementIdentity(claim, placement) {
  return {
    sessionId: claim.sessionId,
    agentId: placement?.agentId ?? required(claim.agentId, "agent id"),
    sessionKey: placement?.sessionKey ?? required(claim.sessionKey, "session key"),
  };
}
function requireActivePlacement(placement) {
  if (placement.state !== "active" || !placement.remoteWorkspaceDir || !placement.workerBundleHash)
    throw new Error(`Worker turn rejected in placement ${placement.state}`);
  return placement;
}
function releaseClaimIfOwned(placements, turnClaim) {
  if (placements.validateTurnClaim(turnClaim)) placements.releaseTurn(turnClaim);
}
async function executeLocalTurn(params) {
  const current = params.placements.get(params.claim.sessionId);
  const turnClaim = params.placements.claimTurn({
    ...resolvePlacementIdentity(params.claim, current),
    claimId: randomUUID(),
    runId: params.claim.runId,
    owner: { kind: "local" },
  });
  try {
    return await params.runLocal();
  } finally {
    releaseClaimIfOwned(params.placements, turnClaim);
  }
}
function recoveryError(error) {
  return truncateUtf16Safe(
    redactSensitiveText(formatErrorMessage(error), { mode: "tools" })
      .replace(/\s+/gu, " ")
      .trim() || "cloud worker turn failed",
    1024,
  );
}
async function failHandedOffTurn(params) {
  const failures = [recoveryError(params.error)];
  let draining;
  try {
    draining = params.placements.startDrain({
      sessionId: params.placement.sessionId,
      environmentId: params.placement.environmentId,
      ownerEpoch: params.placement.activeOwnerEpoch,
      expectedGeneration: params.placement.generation,
    });
  } catch {
    return;
  }
  if (draining.state !== "draining") return;
  try {
    await params.environments.stopTunnel(
      params.placement.environmentId,
      params.placement.activeOwnerEpoch,
    );
  } catch (error) {
    failures.push(`tunnel stop: ${recoveryError(error)}`);
  }
  try {
    await params.environments.destroy(params.placement.environmentId);
  } catch (error) {
    failures.push(`environment destroy: ${recoveryError(error)}`);
  }
  try {
    const reconciling = params.placements.startReconcile({
      sessionId: draining.sessionId,
      environmentId: draining.environmentId,
      ownerEpoch: draining.activeOwnerEpoch,
      expectedGeneration: draining.generation,
    });
    if (reconciling.state !== "reconciling") return;
    params.placements.fail({
      sessionId: reconciling.sessionId,
      expectedGeneration: reconciling.generation,
      recoveryError: truncateUtf16Safe(failures.join("; "), 1024),
    });
  } catch {}
}
async function executeWorkerTurn(params) {
  const { placement, turn } = params;
  const modelRef = assertSupportedTurn(turn);
  const environment = params.environments.get(placement.environmentId);
  if (
    !environment ||
    environment.state !== "attached" ||
    environment.ownerEpoch !== placement.activeOwnerEpoch ||
    environment.bootstrapReceipt?.bundleHash !== placement.workerBundleHash ||
    environment.attachedSessionIds.length !== 1 ||
    environment.attachedSessionIds[0] !== placement.sessionId
  )
    throw new Error("Active worker placement does not match its attached environment");
  const startedAt = Date.now();
  turn.onExecutionStarted?.({ lifecycleGeneration: turn.lifecycleGeneration });
  turn.onExecutionPhase?.({
    phase: "runner_entered",
    backend: "cloud-worker",
  });
  const manager = SessionManager.open(turn.sessionFile);
  const userMessageAlreadyPersisted =
    turn.suppressNextUserMessagePersistence === true ||
    turn.userTurnTranscriptRecorder?.hasPersisted() === true;
  const contextMessages = convertToLlm(manager.buildSessionContext().messages);
  const leaf = manager.getLeafEntry();
  const initialMessages = windowInitialMessages(
    userMessageAlreadyPersisted && leaf?.type === "message" && leaf.message.role === "user"
      ? contextMessages.slice(0, -1)
      : contextMessages,
  );
  let baseLeafId = manager.getLeafId();
  if (!userMessageAlreadyPersisted) {
    const persisted = turn.userTurnTranscriptRecorder
      ? await turn.userTurnTranscriptRecorder.persistApproved({ cwd: turn.workspaceDir })
      : void 0;
    if (persisted) {
      baseLeafId = persisted.messageId;
      turn.userTurnTranscriptRecorder?.markRuntimePersisted(persisted.message);
      turn.onUserMessagePersisted?.(persisted.message);
    } else if (turn.userTurnTranscriptRecorder?.hasPersisted())
      baseLeafId = SessionManager.open(turn.sessionFile).getLeafId();
    else if (!turn.userTurnTranscriptRecorder) {
      const message = {
        role: "user",
        content: [
          {
            type: "text",
            text: turn.transcriptPrompt ?? turn.prompt,
          },
        ],
        timestamp: Date.now(),
      };
      baseLeafId = manager.appendMessage(message);
      turn.onUserMessagePersisted?.(message);
    } else throw new Error("Cloud worker turn could not persist its canonical user message");
  }
  turn.onExecutionPhase?.({
    phase: "model_resolution",
    backend: "cloud-worker",
    provider: modelRef.provider,
    model: modelRef.model,
  });
  const credential = await params.environments.acquireTurnCredential({
    environmentId: placement.environmentId,
    ownerEpoch: placement.activeOwnerEpoch,
    sessionId: placement.sessionId,
  });
  const tunnel = await waitForTurnOperation({
    operation: params.environments.startTunnel({
      environmentId: placement.environmentId,
      ownerEpoch: placement.activeOwnerEpoch,
    }),
    ...(turn.abortSignal ? { signal: turn.abortSignal } : {}),
    timeoutMs: turn.timeoutMs,
  });
  const reasoning = mapThinkingLevelForProvider(turn.thinkLevel);
  const descriptor = fitLaunchDescriptor(
    (windowedMessages) =>
      parseWorkerLaunchDescriptor({
        version: 1,
        socketPath: tunnel.remoteSocketPath,
        admission: {
          environmentId: placement.environmentId,
          credential: credential.credential,
          sessionId: placement.sessionId,
          ownerEpoch: placement.activeOwnerEpoch,
          rpcSetVersion: credential.rpcSetVersion,
          handshake: environment.bootstrapReceipt,
        },
        assignment: {
          runId: turn.runId,
          turnId: randomUUID(),
          prompt: turn.prompt,
          suppressPromptTranscript: true,
          workspaceDir: placement.remoteWorkspaceDir,
          modelRef,
          inferenceOptions: reasoning ? { reasoning } : {},
          ...(turn.extraSystemPrompt === void 0 ? {} : { systemPrompt: turn.extraSystemPrompt }),
          initialMessages: windowedMessages,
          transcript: {
            baseLeafId,
            nextSeq: (placement.lastTranscriptAckCursor ?? 0) + 1,
          },
          liveEvents: {
            ackedSeq: placement.lastLiveEventAckCursor ?? 0,
            nextSeq: (placement.lastLiveEventAckCursor ?? 0) + 1,
          },
        },
      }),
    initialMessages,
  );
  turn.userTurnTranscriptRecorder?.markSentToProvider?.();
  turn.onExecutionPhase?.({
    phase: "attempt_dispatch",
    backend: "cloud-worker",
  });
  const handoffAbort = new AbortController();
  params.onHandoff();
  const processPromise = tunnel.runWorkspaceCommand({
    argv: ["sh", "-c", WORKER_LAUNCH_SCRIPT, "openclaw-worker", placement.workerBundleHash],
    input: JSON.stringify(descriptor),
    timeoutMs: turn.timeoutMs,
    signal: turn.abortSignal
      ? AbortSignal.any([turn.abortSignal, handoffAbort.signal])
      : handoffAbort.signal,
  });
  turn.onExecutionPhase?.({
    phase: "process_spawned",
    backend: "cloud-worker",
  });
  let credentialDelivered;
  try {
    credentialDelivered = params.environments.acknowledgeCredentialDelivery(credential);
  } catch (error) {
    handoffAbort.abort();
    await processPromise.catch(() => void 0);
    throw new Error("Cloud worker credential handoff failed", { cause: error });
  }
  if (!credentialDelivered) {
    handoffAbort.abort();
    await processPromise.catch(() => void 0);
    throw new Error("Cloud worker credential owner changed during process handoff");
  }
  const processResult = await processPromise;
  if (processResult.code !== 0 || processResult.signal !== null || processResult.killed) {
    const detail = redactSensitiveText(processResult.stderr, { mode: "tools" })
      .replace(/\s+/gu, " ")
      .trim()
      .slice(0, 400);
    throw new Error(
      detail
        ? `Cloud worker process failed before completing the turn: ${detail}`
        : "Cloud worker process failed before completing the turn",
    );
  }
  const runtimeResult = parseRuntimeResult(processResult.stdout);
  if (runtimeResult.status === "fenced")
    throw new Error(`Cloud worker turn was fenced: ${runtimeResult.reason}`);
  if (runtimeResult.status === "failed")
    throw new WorkerTurnExecutionError("Cloud worker turn failed");
  const completed = SessionManager.open(turn.sessionFile);
  const currentPlacement = params.placements.get(placement.sessionId);
  if (
    runtimeResult.transcriptLeafId !== completed.getLeafId() ||
    runtimeResult.transcriptNextSeq !== (currentPlacement?.lastTranscriptAckCursor ?? 0) + 1
  )
    throw new Error("Cloud worker result does not match its committed transcript acknowledgement");
  const terminal = runtimeResult.transcriptLeafId
    ? completed.getEntry(runtimeResult.transcriptLeafId)
    : void 0;
  if (!terminal || terminal.type !== "message" || terminal.message.role !== "assistant")
    throw new Error("Cloud worker completed without a terminal assistant transcript message");
  const text = assistantText(terminal.message);
  const baseIndex = completed.getBranch().findIndex((entry) => entry.id === baseLeafId);
  const workerMessages = completed
    .getBranch()
    .slice(baseIndex + 1)
    .flatMap((entry) => (entry.type === "message" ? [entry.message] : []));
  return {
    ...(text ? { payloads: [{ text }] } : {}),
    meta: {
      durationMs: Date.now() - startedAt,
      agentMeta: {
        sessionId: placement.sessionId,
        sessionFile: turn.sessionFile,
        ...buildWorkerAgentMeta({
          messages: workerMessages,
          modelRef,
        }),
      },
      stopReason: terminal.message.stopReason,
    },
  };
}
function createWorkerSessionTurnPlacementProvider(options) {
  return {
    async executeLocalTurn(claim, runLocal) {
      if (!options.placements.get(claim.sessionId) && options.admitNewPlacements === false)
        return await runLocal();
      return await executeLocalTurn({
        claim,
        placements: options.placements,
        runLocal,
      });
    },
    async executeTurn(claim, turn, runLocal) {
      const current = options.placements.get(claim.sessionId);
      if (
        !current &&
        (options.admitNewPlacements === false ||
          (turn.modelRun === true && !claim.sessionKey?.trim()))
      )
        return await runLocal();
      if (!current || current.state === "local")
        return await executeLocalTurn({
          claim,
          placements: options.placements,
          runLocal,
        });
      let routablePlacement = current;
      if (routablePlacement.state === "reclaimed") {
        if (!options.redispatchReclaimed)
          throw new Error("Reclaimed worker placement requires redispatch");
        routablePlacement = await options.redispatchReclaimed(routablePlacement);
      }
      const identity = resolvePlacementIdentity(claim, routablePlacement);
      const placement = requireActivePlacement(routablePlacement);
      const turnClaim = options.placements.claimTurn({
        ...identity,
        claimId: randomUUID(),
        runId: claim.runId,
        owner: {
          kind: "worker",
          environmentId: placement.environmentId,
          ownerEpoch: placement.activeOwnerEpoch,
        },
      });
      let handedOff = false;
      try {
        const result = await executeWorkerTurn({
          environments: options.environments,
          onHandoff: () => {
            handedOff = true;
          },
          placement,
          placements: options.placements,
          turn,
        });
        if (!options.placements.validateTurnClaim(turnClaim))
          throw new Error("Cloud worker turn ownership changed before result reconciliation");
        options.placements.releaseTurn(turnClaim);
        return result;
      } catch (error) {
        if (error instanceof WorkerTurnExecutionError) {
          if (options.placements.validateTurnClaim(turnClaim)) {
            options.placements.releaseTurn(turnClaim);
            throw error;
          }
        }
        if (handedOff)
          await failHandedOffTurn({
            environments: options.environments,
            placements: options.placements,
            placement,
            error,
          });
        else releaseClaimIfOwned(options.placements, turnClaim);
        throw error;
      }
    },
  };
}
//#endregion
//#region src/gateway/server-worker-placement-startup.ts
const WORKER_PLACEMENT_RECONCILE_INTERVAL_MS = 6e4;
const loadWorkerPlacementSessionRuntimeModule = createLazyRuntimeModule(async () => {
  const [placementSessionRuntime, { managedWorktrees }, sessionUtils] = await Promise.all([
    import("./placement-session-runtime-DNKdgxPg.js"),
    import("./service-Bg8I2dbl.js"),
    import("./session-utils-D4f-v1vr.js"),
  ]);
  return {
    isWorkerPlacementSessionRuntimeSupported:
      placementSessionRuntime.isWorkerPlacementSessionRuntimeSupported,
    managedWorktrees,
    resolveWorkerPlacementSessionRuntime:
      placementSessionRuntime.resolveWorkerPlacementSessionRuntime,
    resolveFreshestSessionEntryFromStoreKeys: sessionUtils.resolveFreshestSessionEntryFromStoreKeys,
    resolveGatewaySessionStoreTargetWithStore:
      sessionUtils.resolveGatewaySessionStoreTargetWithStore,
  };
});
var WorkerDispatchTargetChangedError = class extends Error {
  constructor(..._args) {
    super(..._args);
    this.code = "invalid_state";
  }
};
/** Serializes reconciliation sweeps against in-flight dispatches so a sweep never
 * observes a placement mid-transition. Dispatches wait out any pending sweep. */
function coordinateWorkerPlacementDispatch(service) {
  let activeDispatchCount = 0;
  let reconciliation;
  const dispatchIdleWaiters = /* @__PURE__ */ new Set();
  const waitForDispatchIdle = () => {
    if (activeDispatchCount === 0) return Promise.resolve();
    return new Promise((resolve) => {
      dispatchIdleWaiters.add(resolve);
    });
  };
  const runReconciliation = (operation) => {
    if (reconciliation) return reconciliation;
    const current = (async () => {
      await waitForDispatchIdle();
      await operation();
    })();
    reconciliation = current;
    const clearCurrent = () => {
      if (reconciliation === current) reconciliation = void 0;
    };
    current.then(clearCurrent, clearCurrent);
    return current;
  };
  return {
    dispatch: async (request) => {
      for (;;) {
        const pendingReconciliation = reconciliation;
        if (!pendingReconciliation) break;
        await pendingReconciliation.catch(() => void 0);
      }
      activeDispatchCount += 1;
      try {
        return await service.dispatch(request);
      } finally {
        activeDispatchCount -= 1;
        if (activeDispatchCount === 0) {
          const waiters = [...dispatchIdleWaiters];
          dispatchIdleWaiters.clear();
          for (const resolve of waiters) resolve();
        }
      }
    },
    reconcile: () => runReconciliation(service.reconcile),
    reconcileActive: () => runReconciliation(service.reconcileActive),
  };
}
function createGatewayWorkerPlacementRuntime(params) {
  const dispatchService = coordinateWorkerPlacementDispatch(
    createWorkerPlacementDispatchService({
      placements: params.placements,
      environments: params.environments,
      runLocalBarrier: async ({ sessionId, sessionKey, agentId, startDispatch }) => {
        const {
          isWorkerPlacementSessionRuntimeSupported,
          managedWorktrees,
          resolveFreshestSessionEntryFromStoreKeys,
          resolveGatewaySessionStoreTargetWithStore,
          resolveWorkerPlacementSessionRuntime,
        } = await loadWorkerPlacementSessionRuntimeModule();
        const target = resolveGatewaySessionStoreTargetWithStore({
          cfg: getRuntimeConfig(),
          key: sessionKey,
          agentId,
          clone: false,
        });
        const lifecycleIdentities = [
          sessionKey,
          target.canonicalKey,
          ...target.storeKeys,
          sessionId,
        ];
        let placement;
        await runExclusiveSessionLifecycleMutation({
          scope: target.storePath,
          identities: lifecycleIdentities,
          prepare: async () => {
            const currentConfig = getRuntimeConfig();
            const currentTarget = resolveGatewaySessionStoreTargetWithStore({
              cfg: currentConfig,
              key: sessionKey,
              agentId,
              clone: false,
            });
            const currentEntry = resolveFreshestSessionEntryFromStoreKeys(
              currentTarget.store,
              currentTarget.storeKeys,
            );
            const worktree = managedWorktrees.findLiveByOwner(
              "session",
              currentTarget.canonicalKey,
            );
            if (
              currentTarget.storePath !== target.storePath ||
              currentTarget.canonicalKey !== target.canonicalKey ||
              currentTarget.agentId !== target.agentId ||
              currentEntry?.sessionId !== sessionId ||
              !currentEntry.worktree?.id ||
              !worktree ||
              worktree.id !== currentEntry.worktree.id ||
              worktree.ownerId !== currentTarget.canonicalKey
            )
              throw new WorkerDispatchTargetChangedError(
                `Session ${sessionKey} changed before cloud worker dispatch. Retry.`,
              );
            if (currentEntry.archivedAt !== void 0)
              throw new WorkerDispatchTargetChangedError(
                `Session ${sessionKey} was archived before cloud worker dispatch. Retry.`,
              );
            const currentRuntime = resolveWorkerPlacementSessionRuntime({
              cfg: currentConfig,
              entry: currentEntry,
              agentId: currentTarget.agentId,
              sessionKey: currentTarget.canonicalKey,
            });
            if (!isWorkerPlacementSessionRuntimeSupported(currentRuntime))
              throw new WorkerDispatchTargetChangedError(
                `Session ${sessionKey} runtime changed to ${currentRuntime} before cloud worker dispatch. Retry.`,
              );
            placement = startDispatch();
            clearSessionQueues(lifecycleIdentities);
            params.revokeSessionAuthority({
              sessionId,
              sessionKeys: lifecycleIdentities,
            });
            if (
              !(await interruptSessionWorkAdmissions({
                scope: target.storePath,
                identities: lifecycleIdentities,
                timeoutMs: 15e3,
              }))
            )
              throw new Error(`Session ${sessionKey} is still active; dispatch stopped`);
            await params.placements.waitForTurnClaimRelease(sessionId, {
              timeoutMs: SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS,
            });
            await runExclusiveSessionStoreWrite(target.storePath, async () => {}, {
              reentrant: true,
            });
          },
          run: async () => {
            if (!placement) throw new Error(`Session ${sessionKey} dispatch barrier did not start`);
          },
        });
        if (!placement) throw new Error(`Session ${sessionKey} dispatch barrier did not complete`);
        return placement;
      },
      runActivationBarrier: async ({ sessionId, sessionKey, agentId, activate }) => {
        const {
          isWorkerPlacementSessionRuntimeSupported,
          managedWorktrees,
          resolveFreshestSessionEntryFromStoreKeys,
          resolveGatewaySessionStoreTargetWithStore,
          resolveWorkerPlacementSessionRuntime,
        } = await loadWorkerPlacementSessionRuntimeModule();
        const target = resolveGatewaySessionStoreTargetWithStore({
          cfg: getRuntimeConfig(),
          key: sessionKey,
          agentId,
          clone: false,
        });
        const lifecycleIdentities = [
          sessionKey,
          target.canonicalKey,
          ...target.storeKeys,
          sessionId,
        ];
        let activePlacement;
        await runExclusiveSessionLifecycleMutation({
          scope: target.storePath,
          identities: lifecycleIdentities,
          run: async () => {
            const currentConfig = getRuntimeConfig();
            const currentTarget = resolveGatewaySessionStoreTargetWithStore({
              cfg: currentConfig,
              key: sessionKey,
              agentId,
              clone: false,
            });
            const currentEntry = resolveFreshestSessionEntryFromStoreKeys(
              currentTarget.store,
              currentTarget.storeKeys,
            );
            const worktree = managedWorktrees.findLiveByOwner(
              "session",
              currentTarget.canonicalKey,
            );
            if (
              currentTarget.storePath !== target.storePath ||
              currentTarget.canonicalKey !== target.canonicalKey ||
              currentTarget.agentId !== target.agentId ||
              currentEntry?.sessionId !== sessionId ||
              !currentEntry.worktree?.id ||
              !worktree ||
              worktree.id !== currentEntry.worktree.id ||
              worktree.ownerId !== currentTarget.canonicalKey
            )
              throw new WorkerDispatchTargetChangedError(
                `Session ${sessionKey} changed before cloud worker activation. Retry.`,
              );
            if (currentEntry.archivedAt !== void 0)
              throw new WorkerDispatchTargetChangedError(
                `Session ${sessionKey} was archived before cloud worker activation. Retry.`,
              );
            const currentRuntime = resolveWorkerPlacementSessionRuntime({
              cfg: currentConfig,
              entry: currentEntry,
              agentId: currentTarget.agentId,
              sessionKey: currentTarget.canonicalKey,
            });
            if (!isWorkerPlacementSessionRuntimeSupported(currentRuntime))
              throw new WorkerDispatchTargetChangedError(
                `Session ${sessionKey} runtime changed to ${currentRuntime} before cloud worker activation. Retry.`,
              );
            activePlacement = activate();
          },
        });
        if (!activePlacement)
          throw new Error(`Session ${sessionKey} activation barrier did not complete`);
        return activePlacement;
      },
      resolveWorkspacePath: async ({ sessionId, sessionKey, agentId }) => {
        const {
          managedWorktrees,
          resolveFreshestSessionEntryFromStoreKeys,
          resolveGatewaySessionStoreTargetWithStore,
        } = await loadWorkerPlacementSessionRuntimeModule();
        const target = resolveGatewaySessionStoreTargetWithStore({
          cfg: getRuntimeConfig(),
          key: sessionKey,
          agentId,
          clone: false,
        });
        const sessionEntry = resolveFreshestSessionEntryFromStoreKeys(
          target.store,
          target.storeKeys,
        );
        const worktree = managedWorktrees.findLiveByOwner("session", target.canonicalKey);
        if (
          sessionEntry?.sessionId !== sessionId ||
          !sessionEntry.worktree?.id ||
          !worktree ||
          worktree.id !== sessionEntry.worktree.id ||
          worktree.ownerId !== target.canonicalKey
        )
          throw new Error(
            `Session ${sessionKey} dispatch requires a session-owned managed worktree`,
          );
        return worktree.path;
      },
    }),
  );
  const admissionProvider = createWorkerSessionTurnPlacementProvider({
    environments: params.environments,
    placements: params.placements,
    admitNewPlacements: params.admitNewPlacements,
  });
  const startRuntime = async (hooks) => {
    const uninstallPlacementAdmission = installSessionPlacementAdmissionProvider(admissionProvider);
    const uninstallPlacementResetGuard = installSessionPlacementResetGuard((sessionId) => {
      const placement = params.placements.get(sessionId);
      if (!placement || placement.state === "local") return;
      return `cloud worker placement is ${placement.state}`;
    });
    let placementReconcileInterval;
    let placementReconcileInFlight;
    let stopped = false;
    const reconcileActivePlacements = () => {
      if (stopped) return Promise.resolve();
      if (placementReconcileInFlight) return placementReconcileInFlight;
      const current = dispatchService.reconcileActive();
      placementReconcileInFlight = current;
      const clearCurrent = () => {
        if (placementReconcileInFlight === current) placementReconcileInFlight = void 0;
      };
      current.then(clearCurrent, (error) => {
        params.warn(`Worker placement reconcile sweep failed: ${formatErrorMessage(error)}`);
        clearCurrent();
      });
      return current;
    };
    const sidecar = {
      stop: async () => {
        if (stopped) return;
        stopped = true;
        clearInterval(placementReconcileInterval);
        placementReconcileInterval = void 0;
        uninstallPlacementAdmission();
        uninstallPlacementResetGuard();
        const environmentStop = params.environments.stop();
        const environmentStopResult = (
          await Promise.allSettled([
            ...(placementReconcileInFlight ? [placementReconcileInFlight] : []),
            environmentStop,
          ])
        ).at(-1);
        if (environmentStopResult?.status === "rejected") throw environmentStopResult.reason;
      },
    };
    hooks.registerSidecar(sidecar);
    const startupReconcile = dispatchService.reconcile();
    placementReconcileInFlight = startupReconcile;
    try {
      try {
        await startupReconcile;
      } finally {
        if (placementReconcileInFlight === startupReconcile) placementReconcileInFlight = void 0;
      }
      if (hooks.isClosePreludeStarted()) {
        await sidecar.stop();
        return null;
      }
      params.environments.start();
      placementReconcileInterval = setInterval(
        () => void reconcileActivePlacements(),
        WORKER_PLACEMENT_RECONCILE_INTERVAL_MS,
      );
      placementReconcileInterval.unref?.();
      return sidecar;
    } catch (error) {
      await sidecar.stop();
      throw error;
    }
  };
  return {
    dispatchService,
    admissionProvider,
    placements: params.placements,
    startRuntime,
  };
}
//#endregion
export { createGatewayWorkerPlacementRuntime };
