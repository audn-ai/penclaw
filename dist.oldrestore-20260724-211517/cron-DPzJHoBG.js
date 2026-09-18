import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import { c as resolveDefaultAgentId } from "./agent-scope-config-DVIR1nBa.js";
import { t as parseBoolean } from "./boolean-coercion-1HZNNkFl.js";
import { n as listConfiguredMessageChannels } from "./channel-selection-DB_q64I6.js";
import {
  a as validateTargetProviderPrefix,
  t as resolveTargetPrefixedChannel,
} from "./channel-target-prefix-Co3r_2wp.js";
import { n as sha256Base64Url } from "./crypto-digest-CNeb2i19.js";
import {
  n as resolveCronDeliveryPlan,
  t as hasExplicitCronDeliveryTarget,
} from "./delivery-plan-DoSj9Ji-.js";
import "./session-key-druuY-GG.js";
import { t as assertCronDeliveryInputNonBlankFields } from "./delivery-target-validation-D5dmr1ev.js";
import { n as errorShape, t as ErrorCodes } from "./error-codes-O0AkRNx7.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import "./message-channel-NQc9DJ6B.js";
import { b as resolveDeliveryTarget, r as applyJobPatch } from "./jobs-DmOhTis1.js";
import {
  i as normalizeMessageChannel,
  t as isDeliverableMessageChannel,
} from "./message-channel-normalize-Be6uJOzO.js";
import { r as normalizeCronJobPatch, t as normalizeCronJobCreate } from "./normalize-pVPLopSK.js";
import {
  M as resolveTimestampMsToIsoString,
  o as asDateTimestampMs,
} from "./number-coercion-CJQ8TR--.js";
import { t as parseAbsoluteTimeMs } from "./parse-CbtxGw67.js";
import { t as getGatewayProcessInstanceId } from "./process-instance-CwB3RMsz.js";
import { i as projectCronJobThroughStorageCodec, u as cronStoreKey } from "./row-codec-CaYtaRTs.js";
import {
  a as isSubagentSessionKey,
  c as parseAgentSessionKey,
} from "./session-key-utils-B8sNp9l4.js";
import {
  a as resolveCronDeliverySessionKey,
  r as isInvalidCronSessionTargetIdError,
  s as resolveCronSessionTargetSessionKey,
} from "./session-target-DJsUULzX.js";
import { u as loadSessionEntry } from "./session-utils-DjTWBI0J.js";
import {
  Li as validateWakeParams,
  at as validateCronRunParams,
  ct as validateCronUpdateParams,
  it as validateCronRemoveParams,
  nt as validateCronGetParams,
  ot as validateCronRunsParams,
  rt as validateCronListParams,
  st as validateCronStatusParams,
  tt as validateCronAddParams,
} from "./src-CIJf1lT0.js";
import { t as stableStringify } from "./stable-stringify-Cd9_EGsU.js";
import {
  Ct as AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE,
  St as AGENT_HARNESS_SESSION_ID_LOCKED_MESSAGE,
  Tt as isAgentHarnessSessionKey,
  jt as resolveAgentHarnessSessionStoreEntryError,
} from "./store-CzZJhTF6.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import {
  i as resolveCronListSnapshotRevision,
  r as readCronTaskRunHistoryPage,
  t as isInvalidCronTaskRunJobIdError,
} from "./task-run-history-C4upObjK.js";
import { t as formatValidationErrors } from "./validation-errors-B9K6VbD7.js";
//#region src/cron/config-revision.ts
/** Opaque revision token for cron configuration, excluding scheduler-maintained state. */
function configRevisionDefinition(projected) {
  const { updatedAtMs: _updatedAtMs, state: _state, ...definition } = projected;
  if (definition.payload.kind !== "command" || !definition.payload.env) return definition;
  const foldedKeys = /* @__PURE__ */ new Set();
  if (
    !Object.keys(definition.payload.env).some((key) => {
      const folded = key.toLowerCase();
      if (foldedKeys.has(folded)) return true;
      foldedKeys.add(folded);
      return false;
    })
  )
    return definition;
  const { env, ...payload } = definition.payload;
  return {
    ...definition,
    payload: {
      ...payload,
      envEntries: Object.entries(env),
    },
  };
}
/** Hashes the job definition while preserving meaningful own-undefined config fields. */
function resolveCronJobConfigRevision(job) {
  return `sha256:${sha256Base64Url(
    stableStringify(
      configRevisionDefinition(
        projectCronJobThroughStorageCodec({
          ...job,
          updatedAtMs: 0,
          state: {},
        }),
      ),
    ),
  )}`;
}
//#endregion
//#region src/cron/delivery-channel-validation.ts
function hasExplicitChannelConfigEntry(cfg) {
  const channels = cfg.channels;
  if (!channels || typeof channels !== "object" || Array.isArray(channels)) return false;
  return Object.entries(channels).some(([channelId, entry]) => {
    if (channelId === "defaults" || channelId === "modelByChannel") return false;
    return Boolean(
      entry && typeof entry === "object" && !Array.isArray(entry) && Object.keys(entry).length > 0,
    );
  });
}
async function assertConfiguredAnnounceChannel(params) {
  if (params.channel === "last") return;
  const configuredChannels = (await listConfiguredMessageChannels(params.cfg)).toSorted();
  const normalizedChannel = normalizeMessageChannel(params.channel);
  if (!normalizedChannel) {
    if (configuredChannels.length <= 1) return;
    throw new Error(
      `${params.field} is required when multiple channels are configured: ${configuredChannels.join(", ")}`,
    );
  }
  if (configuredChannels.length === 0) {
    if (!hasExplicitChannelConfigEntry(params.cfg)) {
      if (!isDeliverableMessageChannel(normalizedChannel))
        throw new Error(`${params.field} is not a known channel: ${normalizedChannel}`);
      return;
    }
    throw new Error(`${params.field} is not configured: ${normalizedChannel}`);
  }
  if (!configuredChannels.includes(normalizedChannel))
    throw new Error(`${params.field} must be one of: ${configuredChannels.join(", ")}`);
}
function resolveAnnounceValidationChannel(params) {
  return params.channel && params.channel !== "last"
    ? params.channel
    : (resolveTargetPrefixedChannel(params.to) ?? params.channel);
}
function assertCompatibleAnnounceTarget(params) {
  if (!params.channel || params.channel === "last") return;
  const error = validateTargetProviderPrefix({
    channel: params.channel,
    to: params.to,
  });
  if (error) throw new Error(`${params.field}: ${error.message}`);
}
async function assertValidCronAnnounceDelivery(params) {
  if (params.delivery && (params.delivery.mode ?? "announce") === "announce") {
    assertCompatibleAnnounceTarget({
      channel: params.delivery.channel,
      to: params.delivery.to,
      field: "delivery.channel",
    });
    await assertConfiguredAnnounceChannel({
      cfg: params.cfg,
      channel: resolveAnnounceValidationChannel(params.delivery),
      field: "delivery.channel",
    });
  }
  const failureDestination = params.delivery?.failureDestination;
  if (failureDestination && (failureDestination.mode ?? "announce") === "announce") {
    if (
      failureDestination.channel === void 0 &&
      failureDestination.to === void 0 &&
      failureDestination.accountId === void 0 &&
      failureDestination.mode === void 0
    )
      return;
    assertCompatibleAnnounceTarget({
      channel: failureDestination.channel,
      to: failureDestination.to,
      field: "delivery.failureDestination.channel",
    });
    await assertConfiguredAnnounceChannel({
      cfg: params.cfg,
      channel: resolveAnnounceValidationChannel(failureDestination),
      field: "delivery.failureDestination.channel",
    });
  }
}
async function assertValidCronCreateDelivery(cfg, job) {
  await assertValidCronAnnounceDelivery({
    cfg,
    delivery: job.delivery,
  });
}
//#endregion
//#region src/cron/delivery-preview.ts
/** Builds dry-run cron delivery labels for CLI/UI list surfaces. */
function formatTarget(channel, to) {
  if (!channel) return "last";
  if (to) return `${channel}:${to}`;
  return channel;
}
function formatDeliveryDetail(params) {
  if (params.requestedChannel === "last" || !params.requestedChannel) {
    if (!params.resolved)
      return params.error
        ? `last -> no route, will fail-closed: ${params.error}`
        : "last -> no route, will fail-closed";
    return params.sessionKey
      ? `resolved from last, session ${params.sessionKey}`
      : "resolved from last, main session";
  }
  return params.resolved ? "explicit" : (params.error ?? "unresolved");
}
/** Builds the user-visible cron delivery preview for one job without sending anything. */
async function resolveCronDeliveryPreview(params) {
  const plan = resolveCronDeliveryPlan(params.job);
  if (plan.mode === "none" && !hasExplicitCronDeliveryTarget(plan))
    return {
      label: "not requested",
      detail: "not requested",
    };
  if (plan.mode === "webhook")
    return {
      label: plan.to ? `webhook:${plan.to}` : "webhook",
      detail: plan.to ? "webhook" : "webhook target missing",
    };
  const requestedChannel = plan.channel ?? "last";
  const agentId =
    params.job.agentId?.trim() || params.defaultAgentId || resolveDefaultAgentId(params.cfg);
  const deliverySessionKey = resolveCronDeliverySessionKey(params.job);
  const resolved = await resolveDeliveryTarget(
    params.cfg,
    agentId,
    {
      channel: requestedChannel,
      to: plan.to,
      threadId: plan.threadId,
      accountId: plan.accountId,
      sessionKey: deliverySessionKey,
    },
    { dryRun: true },
  );
  if (!resolved.ok)
    return {
      label: `${plan.mode} -> ${formatTarget(requestedChannel, plan.to ?? null)}`,
      detail:
        plan.mode === "none"
          ? `message tool target unresolved: ${resolved.error.message}`
          : formatDeliveryDetail({
              requestedChannel,
              resolved: false,
              sessionKey: deliverySessionKey,
              error: resolved.error.message,
            }),
    };
  return {
    label: `${plan.mode} -> ${formatTarget(resolved.channel, resolved.to)}`,
    detail: formatDeliveryDetail({
      requestedChannel,
      resolved: true,
      sessionKey: deliverySessionKey,
    }),
  };
}
/** Builds cron delivery previews keyed by job id. */
async function resolveCronDeliveryPreviews(params) {
  const entries = await Promise.all(
    params.jobs.map(async (job) => [
      job.id,
      await resolveCronDeliveryPreview({
        cfg: params.cfg,
        defaultAgentId: params.defaultAgentId,
        job,
      }),
    ]),
  );
  return Object.fromEntries(entries);
}
//#endregion
//#region src/cron/validate-timestamp.ts
/** Validates user-supplied one-shot cron timestamps before scheduling. */
const ONE_MINUTE_MS = 60 * 1e3;
const TEN_YEARS_MS = 10 * 365.25 * 24 * 60 * 60 * 1e3;
/**
 * Validates one-shot cron timestamps with a small past grace window and far-future cap.
 */
function validateScheduleTimestamp(schedule, nowMs = Date.now()) {
  if (schedule.kind !== "at") return { ok: true };
  const atRaw = normalizeOptionalString(schedule.at) ?? "";
  const atMs = atRaw ? parseAbsoluteTimeMs(atRaw) : null;
  if (atMs === null || !Number.isFinite(atMs))
    return {
      ok: false,
      message: `Invalid schedule.at: expected ISO-8601 timestamp (got ${schedule.at})`,
    };
  const referenceNowMs = asDateTimestampMs(nowMs) ?? asDateTimestampMs(Date.now()) ?? 0;
  const diffMs = atMs - referenceNowMs;
  if (diffMs < -6e4) {
    const nowDate = resolveTimestampMsToIsoString(referenceNowMs);
    return {
      ok: false,
      message: `schedule.at is in the past: ${resolveTimestampMsToIsoString(atMs)} (${Math.floor(-diffMs / ONE_MINUTE_MS)} minutes ago). Current time: ${nowDate}`,
    };
  }
  if (diffMs > TEN_YEARS_MS)
    return {
      ok: false,
      message: `schedule.at is too far in the future: ${resolveTimestampMsToIsoString(atMs)} (${Math.floor(diffMs / (365.25 * 24 * 60 * 60 * 1e3))} years ahead). Maximum allowed: 10 years`,
    };
  return { ok: true };
}
//#endregion
//#region src/gateway/server-methods/cron-caller-scope.ts
function readCronCallerScope(client) {
  const identity = client?.internal?.agentRuntimeIdentity;
  if (!identity?.agentId) return;
  return {
    kind: "agentTool",
    agentId: normalizeAgentId(identity.agentId),
    sessionKey: identity.sessionKey?.trim() || void 0,
  };
}
function resolveCronJobEffectiveAgentId(job, defaultAgentId) {
  return normalizeAgentId(job.agentId ?? defaultAgentId ?? "main");
}
function parseAgentIdFromSessionRef(value) {
  const trimmed = value?.trim();
  return trimmed ? parseAgentSessionKey(trimmed)?.agentId : void 0;
}
function parseAgentIdFromCronSessionTarget(value) {
  const trimmed = value?.trim();
  return trimmed?.startsWith("session:") ? parseAgentIdFromSessionRef(trimmed.slice(8)) : void 0;
}
function cronJobSessionRefsMatchCaller(job, callerScope) {
  const sessionAgentId = parseAgentIdFromSessionRef(job.sessionKey);
  if (sessionAgentId && normalizeAgentId(sessionAgentId) !== callerScope.agentId) return false;
  const sessionTargetAgentId = parseAgentIdFromCronSessionTarget(job.sessionTarget);
  return !sessionTargetAgentId || normalizeAgentId(sessionTargetAgentId) === callerScope.agentId;
}
function resolveCronJobOwnerAgentId(job) {
  const ownerAgentId = job.owner?.agentId ?? parseAgentIdFromSessionRef(job.owner?.sessionKey);
  return ownerAgentId ? normalizeAgentId(ownerAgentId) : void 0;
}
function isOperatorCommandCronJob(job) {
  return job.payload.kind === "command" || job.schedule.kind === "on-exit";
}
function cronJobMatchesCallerScope(params) {
  if (!params.callerScope) return true;
  if (isOperatorCommandCronJob(params.job)) return false;
  const ownerAgentId = resolveCronJobOwnerAgentId(params.job);
  if (ownerAgentId) return ownerAgentId === params.callerScope.agentId;
  if (
    resolveCronJobEffectiveAgentId(params.job, params.defaultAgentId) !== params.callerScope.agentId
  )
    return false;
  return cronJobSessionRefsMatchCaller(params.job, params.callerScope);
}
function cronJobMatchesDeclarationScope(params) {
  if (params.callerScope) return cronJobMatchesCallerScope(params);
  const inputOwnerSessionKey = params.input.owner?.sessionKey;
  const inputOwnerAgentId =
    params.input.owner?.agentId ?? parseAgentIdFromSessionRef(inputOwnerSessionKey);
  if (inputOwnerSessionKey && !inputOwnerAgentId)
    return params.job.owner?.sessionKey === inputOwnerSessionKey;
  const inputAgentId = normalizeAgentId(
    inputOwnerAgentId ?? params.input.agentId ?? params.defaultAgentId ?? "main",
  );
  return (
    normalizeAgentId(
      resolveCronJobOwnerAgentId(params.job) ??
        params.job.agentId ??
        params.defaultAgentId ??
        "main",
    ) === inputAgentId
  );
}
function cronCreateMatchesCallerScope(params) {
  if (!params.callerScope) return true;
  if (
    normalizeAgentId(params.job.agentId ?? params.defaultAgentId ?? "main") !==
    params.callerScope.agentId
  )
    return false;
  const sessionAgentId = parseAgentIdFromSessionRef(params.job.sessionKey);
  if (sessionAgentId && normalizeAgentId(sessionAgentId) !== params.callerScope.agentId)
    return false;
  const sessionTargetAgentId = parseAgentIdFromCronSessionTarget(params.job.sessionTarget);
  return (
    !sessionTargetAgentId || normalizeAgentId(sessionTargetAgentId) === params.callerScope.agentId
  );
}
function applyCronCreateCallerScopeDefault(job, callerScope) {
  if (!callerScope) return job;
  return {
    ...job,
    agentId: job.agentId ?? callerScope.agentId,
    owner: {
      agentId: callerScope.agentId,
      ...(callerScope.sessionKey ? { sessionKey: callerScope.sessionKey } : {}),
    },
  };
}
function cronPatchSessionRefsMatchCaller(patch, callerScope) {
  if (!callerScope) return true;
  const sessionAgentId =
    "sessionKey" in patch && typeof patch.sessionKey === "string"
      ? parseAgentIdFromSessionRef(patch.sessionKey)
      : void 0;
  if (sessionAgentId && normalizeAgentId(sessionAgentId) !== callerScope.agentId) return false;
  const sessionTargetAgentId =
    "sessionTarget" in patch && typeof patch.sessionTarget === "string"
      ? parseAgentIdFromCronSessionTarget(patch.sessionTarget)
      : void 0;
  return !sessionTargetAgentId || normalizeAgentId(sessionTargetAgentId) === callerScope.agentId;
}
//#endregion
//#region src/gateway/server-methods/cron-error-classification.ts
function isCronInvalidRequestError(err) {
  const message = formatErrorMessage(err);
  return (
    message.startsWith("unknown cron job id:") ||
    message.startsWith("cron job already exists:") ||
    message.includes("cron job id must not be blank") ||
    message.includes("cron declarationKey") ||
    message.includes("cron displayName") ||
    message.includes("cron triggers are disabled") ||
    message.includes("cron triggers require") ||
    message.includes("cron trigger every interval") ||
    message.includes("cron job is missing sessionTarget") ||
    message.includes("invalid cron sessionTarget session id") ||
    message.includes('main cron jobs require payload.kind="systemEvent"') ||
    message.includes('isolated/current/session cron jobs require payload.kind="agentTurn"') ||
    message.includes("has no upcoming run time and would never fire") ||
    message.includes('sessionTarget "main" is only valid for the default agent') ||
    message.includes('cron.update payload.kind="systemEvent" requires text') ||
    message.includes('cron.update payload.kind="agentTurn" requires message') ||
    message.includes("cron webhook delivery requires") ||
    message.includes("delivery.channel") ||
    message.includes("delivery.failureDestination.channel") ||
    message.includes("cron completion destination webhook requires") ||
    message.includes("cron failure destination webhook requires") ||
    message.includes("cron channel delivery config is only supported") ||
    message.includes("cron delivery.failureDestination is only supported")
  );
}
//#endregion
//#region src/gateway/server-methods/cron-list-caller-scope.ts
const CRON_LIST_SCOPED_SNAPSHOT_MAX_ATTEMPTS = 3;
async function listCronPageForCallerScope({ callerScope, context, options }) {
  let stableScopedJobs;
  for (let attempt = 0; attempt < CRON_LIST_SCOPED_SNAPSHOT_MAX_ATTEMPTS; attempt += 1) {
    const scopedJobs = [];
    let offset = 0;
    let snapshotRevision;
    let snapshotChanged = false;
    for (;;) {
      const sourcePage = await context.cron.listPage({
        ...options,
        agentId: void 0,
        limit: 200,
        offset,
      });
      if (snapshotRevision && sourcePage.snapshotRevision !== snapshotRevision) {
        snapshotChanged = true;
        break;
      }
      snapshotRevision = sourcePage.snapshotRevision;
      scopedJobs.push(
        ...sourcePage.jobs.filter((job) =>
          cronJobMatchesCallerScope({
            job,
            callerScope,
            defaultAgentId: context.cron.getDefaultAgentId(),
          }),
        ),
      );
      if (!sourcePage.hasMore || sourcePage.nextOffset === null || sourcePage.nextOffset <= offset)
        break;
      offset = sourcePage.nextOffset;
    }
    if (!snapshotChanged && snapshotRevision) {
      stableScopedJobs = scopedJobs;
      break;
    }
  }
  if (!stableScopedJobs)
    throw new Error("cron.list changed repeatedly while applying caller scope");
  const total = stableScopedJobs.length;
  const pageOffset = Math.max(0, Math.min(total, Math.floor(options.offset ?? 0)));
  const defaultLimit = total === 0 ? 50 : total;
  const limit = Math.max(1, Math.min(200, Math.floor(options.limit ?? defaultLimit)));
  const jobs = stableScopedJobs.slice(pageOffset, pageOffset + limit);
  const nextOffset = pageOffset + jobs.length;
  return {
    jobs,
    snapshotRevision: resolveCronListSnapshotRevision(stableScopedJobs),
    total,
    offset: pageOffset,
    limit,
    hasMore: nextOffset < total,
    nextOffset: nextOffset < total ? nextOffset : null,
  };
}
//#endregion
//#region src/gateway/server-methods/cron-run-log-filters.ts
function filterCronRunLogJobsByAgent(jobs, agentId, defaultAgentId) {
  if (!agentId) return [...jobs];
  const normalizedAgentId = normalizeAgentId(agentId);
  return jobs.filter(
    (job) => normalizeAgentId(job.agentId ?? defaultAgentId) === normalizedAgentId,
  );
}
function cronRunLogPageFilters(params) {
  return {
    limit: params.limit,
    offset: params.offset,
    statuses: params.statuses,
    status: params.status,
    runId: params.runId,
    deliveryStatuses: params.deliveryStatuses,
    deliveryStatus: params.deliveryStatus,
    query: params.query,
    sortDir: params.sortDir,
  };
}
//#endregion
//#region src/gateway/server-methods/cron.ts
var CronJobConfigRevisionConflictError = class extends Error {
  constructor(expectedConfigRevision, actualConfigRevision) {
    super("cron job definition no longer matches the loaded version");
    this.expectedConfigRevision = expectedConfigRevision;
    this.actualConfigRevision = actualConfigRevision;
  }
};
function cronJobReadView(job) {
  return {
    ...job,
    configRevision: resolveCronJobConfigRevision(job),
    nextRunAtMs: job.state.nextRunAtMs,
    lastRunAtMs: job.state.lastRunAtMs,
    lastRunStatus: job.state.lastRunStatus ?? job.state.lastStatus,
    lastRunError: job.state.lastError,
    lastDelivered: job.state.lastDelivered,
    lastDeliveryStatus: job.state.lastDeliveryStatus,
    lastDeliveryError: job.state.lastDeliveryError,
    lastFailureNotificationDelivered: job.state.lastFailureNotificationDelivered,
    lastFailureNotificationDeliveryStatus: job.state.lastFailureNotificationDeliveryStatus,
    lastFailureNotificationDeliveryError: job.state.lastFailureNotificationDeliveryError,
  };
}
function compactCronListJob(job) {
  return {
    id: job.id,
    name: job.name,
    ...(job.declarationKey ? { declarationKey: job.declarationKey } : {}),
    ...(job.displayName ? { displayName: job.displayName } : {}),
    ...(job.owner ? { owner: job.owner } : {}),
    enabled: job.enabled,
    nextRunAtMs: job.state.nextRunAtMs ?? null,
    scheduleKind: job.schedule.kind,
    ...(job.trigger ? { trigger: true } : {}),
    lastRunAtMs: job.state.lastRunAtMs ?? null,
    lastRunStatus: job.state.lastRunStatus ?? job.state.lastStatus ?? null,
    lastRunError: job.state.lastError ?? null,
    ...(job.state.lastDelivered !== void 0 ? { lastDelivered: job.state.lastDelivered } : {}),
    ...(job.state.lastDeliveryStatus !== void 0
      ? { lastDeliveryStatus: job.state.lastDeliveryStatus }
      : {}),
    ...(job.state.lastDeliveryError !== void 0
      ? { lastDeliveryError: job.state.lastDeliveryError }
      : {}),
    ...(job.state.lastFailureNotificationDelivered !== void 0
      ? { lastFailureNotificationDelivered: job.state.lastFailureNotificationDelivered }
      : {}),
    ...(job.state.lastFailureNotificationDeliveryStatus !== void 0
      ? { lastFailureNotificationDeliveryStatus: job.state.lastFailureNotificationDeliveryStatus }
      : {}),
    ...(job.state.lastFailureNotificationDeliveryError !== void 0
      ? { lastFailureNotificationDeliveryError: job.state.lastFailureNotificationDeliveryError }
      : {}),
  };
}
async function assertValidCronUpdatePatch(params) {
  const nextJob = structuredClone(params.currentJob);
  applyJobPatch(nextJob, params.patch, {
    defaultAgentId: params.defaultAgentId,
    cronConfig: params.cfg.cron,
  });
  if ("agentId" in params.patch || "sessionTarget" in params.patch || "sessionKey" in params.patch)
    assertCronDoesNotTargetAgentHarness(nextJob);
  if ("delivery" in params.patch) {
    const delivery =
      params.patch.delivery?.channel === null &&
      nextJob.delivery &&
      (nextJob.delivery.mode ?? "announce") === "announce" &&
      nextJob.delivery.channel === void 0 &&
      resolveTargetPrefixedChannel(nextJob.delivery.to) === void 0
        ? {
            ...nextJob.delivery,
            channel: "last",
          }
        : nextJob.delivery;
    await assertValidCronAnnounceDelivery({
      cfg: params.cfg,
      delivery,
    });
  }
}
function assertCronDoesNotTargetAgentHarness(input) {
  const targetSessionKey =
    resolveCronSessionTargetSessionKey(input.sessionTarget) ??
    (input.sessionTarget === "current" ? input.sessionKey?.trim() : void 0);
  if (!targetSessionKey) return;
  const loaded = loadSessionEntry(
    targetSessionKey,
    input.agentId?.trim() ? { agentId: input.agentId.trim() } : {},
  );
  const reservedKey =
    isAgentHarnessSessionKey(targetSessionKey) || isAgentHarnessSessionKey(loaded.canonicalKey);
  if (loaded.entry?.modelSelectionLocked === true)
    throw new Error(
      reservedKey
        ? AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE
        : AGENT_HARNESS_SESSION_ID_LOCKED_MESSAGE,
    );
  if (!reservedKey || loaded.entry) return;
  throw new Error(AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE);
}
function resolveCronJobId(params) {
  return params.id ?? params.jobId;
}
function respondInvalidCronParams(respond, method, reason) {
  respond(
    false,
    void 0,
    errorShape(ErrorCodes.INVALID_REQUEST, `invalid ${method} params: ${reason}`),
  );
}
function respondMissingCronJobId(respond, method) {
  respondInvalidCronParams(respond, method, "missing id");
}
/** Gateway request handlers for cron jobs and cron run-log access. */
const cronHandlers = {
  wake: ({ params, respond, context, client }) => {
    if (!validateWakeParams(params)) {
      respond(
        false,
        void 0,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          `invalid wake params: ${formatValidationErrors(validateWakeParams.errors)}`,
        ),
      );
      return;
    }
    const p = params;
    const sessionKey = p.sessionKey?.trim() || void 0;
    const agentId = p.agentId?.trim() || void 0;
    if (sessionKey && isAgentHarnessSessionKey(sessionKey)) {
      const loaded = loadSessionEntry(sessionKey, agentId ? { agentId } : {});
      const harnessSessionError = loaded.entry
        ? resolveAgentHarnessSessionStoreEntryError(loaded.canonicalKey, loaded.entry)
        : AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE;
      if (harnessSessionError) {
        respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, harnessSessionError));
        return;
      }
    }
    if (sessionKey && isSubagentSessionKey(sessionKey)) {
      respond(
        false,
        void 0,
        errorShape(ErrorCodes.INVALID_REQUEST, "wake sessionKey cannot target a subagent session"),
      );
      return;
    }
    const sessionKeyAgentId = sessionKey
      ? parseAgentSessionKey(sessionKey)?.agentId?.trim().toLowerCase()
      : void 0;
    const callerScope = readCronCallerScope(client);
    if (callerScope && agentId && normalizeAgentId(agentId) !== callerScope.agentId) {
      respond(
        false,
        void 0,
        errorShape(ErrorCodes.INVALID_REQUEST, "wake agentId outside caller scope"),
      );
      return;
    }
    if (
      callerScope &&
      sessionKeyAgentId &&
      normalizeAgentId(sessionKeyAgentId) !== callerScope.agentId
    ) {
      respond(
        false,
        void 0,
        errorShape(ErrorCodes.INVALID_REQUEST, "wake sessionKey outside caller scope"),
      );
      return;
    }
    if (agentId && sessionKeyAgentId && agentId.toLowerCase() !== sessionKeyAgentId) {
      respond(
        false,
        void 0,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          "wake agentId contradicts the agent that owns sessionKey; pass a single canonical wake target",
        ),
      );
      return;
    }
    respond(
      true,
      context.cron.wake({
        mode: p.mode,
        text: p.text,
        ...(sessionKey ? { sessionKey } : {}),
        ...(callerScope ? { agentId: callerScope.agentId } : agentId ? { agentId } : {}),
      }),
      void 0,
    );
  },
  "cron.list": async ({ params, respond, context, client }) => {
    if (!validateCronListParams(params)) {
      respond(
        false,
        void 0,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          `invalid cron.list params: ${formatValidationErrors(validateCronListParams.errors)}`,
        ),
      );
      return;
    }
    const p = params;
    const callerScope = readCronCallerScope(client);
    const requestedAgentId = p.agentId ? normalizeAgentId(p.agentId) : void 0;
    if (callerScope && requestedAgentId && requestedAgentId !== callerScope.agentId) {
      respondInvalidCronParams(respond, "cron.list", "agentId outside caller scope");
      return;
    }
    const listOptions = {
      includeDisabled: p.includeDisabled,
      limit: p.limit,
      offset: p.offset,
      query: p.query,
      enabled: p.enabled,
      scheduleKind: p.scheduleKind,
      lastRunStatus: p.lastRunStatus,
      sortBy: p.sortBy,
      sortDir: p.sortDir,
      agentId: callerScope?.agentId ?? p.agentId,
    };
    const page = callerScope
      ? await listCronPageForCallerScope({
          callerScope,
          context,
          options: listOptions,
        })
      : await context.cron.listPage(listOptions);
    if (p.compact === true) {
      respond(
        true,
        {
          ...page,
          jobs: page.jobs.map(compactCronListJob),
        },
        void 0,
      );
      return;
    }
    const deliveryPreviews = await resolveCronDeliveryPreviews({
      cfg: context.getRuntimeConfig(),
      defaultAgentId: context.cron.getDefaultAgentId(),
      jobs: page.jobs,
    });
    respond(
      true,
      {
        ...page,
        jobs: page.jobs.map(cronJobReadView),
        deliveryPreviews,
      },
      void 0,
    );
  },
  "cron.status": async ({ params, respond, context }) => {
    if (!validateCronStatusParams(params)) {
      respond(
        false,
        void 0,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          `invalid cron.status params: ${formatValidationErrors(validateCronStatusParams.errors)}`,
        ),
      );
      return;
    }
    respond(true, await context.cron.status(), void 0);
  },
  "cron.get": async ({ params, respond, context, client }) => {
    if (!validateCronGetParams(params)) {
      respondInvalidCronParams(
        respond,
        "cron.get",
        formatValidationErrors(validateCronGetParams.errors),
      );
      return;
    }
    const jobId = resolveCronJobId(params);
    if (!jobId) {
      respondMissingCronJobId(respond, "cron.get");
      return;
    }
    const callerScope = readCronCallerScope(client);
    const job = await context.cron.readJob(jobId);
    if (
      !job ||
      !cronJobMatchesCallerScope({
        job,
        callerScope,
        defaultAgentId: context.cron.getDefaultAgentId(),
      })
    ) {
      respond(
        false,
        void 0,
        errorShape(ErrorCodes.INVALID_REQUEST, `cron job not found: ${jobId}`),
      );
      return;
    }
    respond(true, cronJobReadView(job), void 0);
  },
  "cron.add": async ({ params, respond, context, client }) => {
    const rawParams = params;
    if (
      typeof rawParams?.declarationKey === "string" &&
      rawParams.declarationKey.trim().length === 0
    ) {
      respondInvalidCronParams(respond, "cron.add", "declarationKey must not be blank");
      return;
    }
    if (typeof rawParams?.displayName === "string" && rawParams.displayName.trim().length === 0) {
      respondInvalidCronParams(respond, "cron.add", "displayName must not be blank");
      return;
    }
    const hasEnabled = Boolean(rawParams && Object.hasOwn(rawParams, "enabled"));
    const parsedEnabled = hasEnabled ? parseBoolean(rawParams?.enabled) : void 0;
    if (hasEnabled && parsedEnabled === void 0) {
      respondInvalidCronParams(respond, "cron.add", "enabled must be a boolean");
      return;
    }
    const enabledExplicit = parsedEnabled !== void 0;
    const sessionKey = typeof params?.sessionKey === "string" ? params.sessionKey : void 0;
    let normalized;
    try {
      assertCronDeliveryInputNonBlankFields(params?.delivery);
      normalized = normalizeCronJobCreate(params, { sessionContext: { sessionKey } }) ?? params;
    } catch (err) {
      respond(
        false,
        void 0,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          `invalid cron.add params: ${formatErrorMessage(err)}`,
        ),
      );
      return;
    }
    const candidate = normalized;
    if (!validateCronAddParams(candidate)) {
      respond(
        false,
        void 0,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          `invalid cron.add params: ${formatValidationErrors(validateCronAddParams.errors)}`,
        ),
      );
      return;
    }
    const callerScope = readCronCallerScope(client);
    const jobCreate = applyCronCreateCallerScopeDefault(candidate, callerScope);
    const cfg = context.getRuntimeConfig();
    try {
      assertCronDoesNotTargetAgentHarness(jobCreate);
    } catch (err) {
      respondInvalidCronParams(respond, "cron.add", formatErrorMessage(err));
      return;
    }
    if (
      !cronCreateMatchesCallerScope({
        job: jobCreate,
        callerScope,
        defaultAgentId: context.cron.getDefaultAgentId(),
      })
    ) {
      respondInvalidCronParams(respond, "cron.add", "job agentId outside caller scope");
      return;
    }
    const timestampValidation = validateScheduleTimestamp(jobCreate.schedule);
    if (!timestampValidation.ok) {
      respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, timestampValidation.message));
      return;
    }
    try {
      await assertValidCronCreateDelivery(cfg, jobCreate);
    } catch (err) {
      respond(
        false,
        void 0,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          `invalid cron.add params: ${formatErrorMessage(err)}`,
        ),
      );
      return;
    }
    let result;
    try {
      result = await context.cron.add(jobCreate, {
        enabledExplicit,
        matchesExisting: (job) =>
          cronJobMatchesDeclarationScope({
            job,
            input: jobCreate,
            callerScope,
            defaultAgentId: context.cron.getDefaultAgentId(),
          }),
      });
    } catch (err) {
      if (
        !(err instanceof TypeError) &&
        !(err instanceof RangeError) &&
        !isCronInvalidRequestError(err)
      )
        throw err;
      respond(
        false,
        void 0,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          `invalid cron.add params: ${formatErrorMessage(err)}`,
        ),
      );
      return;
    }
    const job = "job" in result ? result.job : result;
    context.logGateway.info("cron: job added", {
      jobId: job.id,
      declarationKey: job.declarationKey,
      schedule: jobCreate.schedule,
    });
    respond(
      true,
      "job" in result
        ? {
            created: result.created,
            ...(result.updated === void 0 ? {} : { updated: result.updated }),
            job: cronJobReadView(job),
          }
        : cronJobReadView(job),
      void 0,
    );
  },
  "cron.update": async ({ params, respond, context, client }) => {
    let normalizedPatch;
    try {
      const rawPatch = params?.patch;
      const rawDisplayName =
        rawPatch && typeof rawPatch === "object" ? rawPatch.displayName : void 0;
      if (typeof rawDisplayName === "string" && rawDisplayName.trim().length === 0)
        throw new Error("displayName must not be blank");
      assertCronDeliveryInputNonBlankFields(
        rawPatch && typeof rawPatch === "object" ? rawPatch.delivery : void 0,
      );
      normalizedPatch = normalizeCronJobPatch(rawPatch);
    } catch (err) {
      respond(
        false,
        void 0,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          `invalid cron.update params: ${formatErrorMessage(err)}`,
        ),
      );
      return;
    }
    const candidate =
      normalizedPatch && typeof params === "object" && params !== null
        ? {
            ...params,
            patch: normalizedPatch,
          }
        : params;
    if (!validateCronUpdateParams(candidate)) {
      respond(
        false,
        void 0,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          `invalid cron.update params: ${formatValidationErrors(validateCronUpdateParams.errors)}`,
        ),
      );
      return;
    }
    const p = candidate;
    const callerScope = readCronCallerScope(client);
    const jobId = p.id ?? p.jobId;
    if (!jobId) {
      respond(
        false,
        void 0,
        errorShape(ErrorCodes.INVALID_REQUEST, "invalid cron.update params: missing id"),
      );
      return;
    }
    const patch = p.patch;
    const cfg = context.getRuntimeConfig();
    const currentJob = await context.cron.readJob(jobId);
    if (
      !currentJob ||
      !cronJobMatchesCallerScope({
        job: currentJob,
        callerScope,
        defaultAgentId: context.cron.getDefaultAgentId(),
      })
    ) {
      respondInvalidCronParams(respond, "cron.update", "id not found");
      return;
    }
    if (callerScope && "agentId" in patch) {
      respondInvalidCronParams(respond, "cron.update", "agentId cannot be changed by caller scope");
      return;
    }
    if (!cronPatchSessionRefsMatchCaller(patch, callerScope)) {
      respondInvalidCronParams(respond, "cron.update", "session target outside caller scope");
      return;
    }
    if (patch.schedule) {
      const timestampValidation = validateScheduleTimestamp(patch.schedule);
      if (!timestampValidation.ok) {
        respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, timestampValidation.message));
        return;
      }
    }
    try {
      await assertValidCronUpdatePatch({
        cfg,
        defaultAgentId: context.cron.getDefaultAgentId(),
        currentJob,
        patch,
      });
    } catch (err) {
      respond(
        false,
        void 0,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          `invalid cron.update params: ${formatErrorMessage(err)}`,
        ),
      );
      return;
    }
    let job;
    try {
      job = await context.cron.updateWithPrecondition(jobId, patch, async (lockedJob) => {
        if (
          !cronJobMatchesCallerScope({
            job: lockedJob,
            callerScope,
            defaultAgentId: context.cron.getDefaultAgentId(),
          })
        )
          throw new Error(`unknown cron job id: ${jobId}`);
        if (p.expectedConfigRevision !== void 0) {
          const actualConfigRevision = resolveCronJobConfigRevision(lockedJob);
          if (actualConfigRevision !== p.expectedConfigRevision)
            throw new CronJobConfigRevisionConflictError(
              p.expectedConfigRevision,
              actualConfigRevision,
            );
        }
        await assertValidCronUpdatePatch({
          cfg,
          defaultAgentId: context.cron.getDefaultAgentId(),
          currentJob: lockedJob,
          patch,
        });
      });
    } catch (err) {
      if (err instanceof CronJobConfigRevisionConflictError) {
        respond(
          false,
          void 0,
          errorShape(
            ErrorCodes.INVALID_REQUEST,
            "cron job definition no longer matches the loaded version; review the latest version before retrying",
            {
              details: {
                code: "CRON_JOB_CHANGED",
                expectedConfigRevision: err.expectedConfigRevision,
                actualConfigRevision: err.actualConfigRevision,
              },
            },
          ),
        );
        return;
      }
      if (
        !(err instanceof TypeError) &&
        !(err instanceof RangeError) &&
        !isCronInvalidRequestError(err)
      )
        throw err;
      respond(
        false,
        void 0,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          `invalid cron.update params: ${formatErrorMessage(err)}`,
        ),
      );
      return;
    }
    context.logGateway.info("cron: job updated", { jobId });
    respond(true, cronJobReadView(job), void 0);
  },
  "cron.remove": async ({ params, respond, context, client }) => {
    if (!validateCronRemoveParams(params)) {
      respondInvalidCronParams(
        respond,
        "cron.remove",
        formatValidationErrors(validateCronRemoveParams.errors),
      );
      return;
    }
    const jobId = resolveCronJobId(params);
    if (!jobId) {
      respondMissingCronJobId(respond, "cron.remove");
      return;
    }
    const callerScope = readCronCallerScope(client);
    const job = await context.cron.readJob(jobId);
    if (
      !job ||
      !cronJobMatchesCallerScope({
        job,
        callerScope,
        defaultAgentId: context.cron.getDefaultAgentId(),
      })
    ) {
      respond(
        false,
        void 0,
        errorShape(ErrorCodes.INVALID_REQUEST, "invalid cron.remove params: id not found"),
      );
      return;
    }
    const result = await context.cron.remove(jobId);
    if (!result.removed) {
      respond(
        false,
        void 0,
        errorShape(ErrorCodes.INVALID_REQUEST, "invalid cron.remove params: id not found"),
      );
      return;
    }
    context.logGateway.info("cron: job removed", { jobId });
    respond(true, result, void 0);
  },
  "cron.run": async ({ params, respond, context, client }) => {
    if (!validateCronRunParams(params)) {
      respondInvalidCronParams(
        respond,
        "cron.run",
        formatValidationErrors(validateCronRunParams.errors),
      );
      return;
    }
    const p = params;
    const callerScope = readCronCallerScope(client);
    const jobId = resolveCronJobId(p);
    if (!jobId) {
      respondMissingCronJobId(respond, "cron.run");
      return;
    }
    const job = await context.cron.readJob(jobId);
    if (
      !job ||
      !cronJobMatchesCallerScope({
        job,
        callerScope,
        defaultAgentId: context.cron.getDefaultAgentId(),
      })
    ) {
      respondInvalidCronParams(respond, "cron.run", "id not found");
      return;
    }
    if (
      p.expectedProcessInstanceId &&
      p.expectedProcessInstanceId !== getGatewayProcessInstanceId()
    ) {
      respondInvalidCronParams(respond, "cron.run", "Gateway process changed after preflight");
      return;
    }
    let result;
    try {
      result = await context.cron.enqueueRun(jobId, p.mode ?? "force");
    } catch (error) {
      if (isInvalidCronSessionTargetIdError(error)) {
        respond(
          true,
          {
            ok: true,
            ran: false,
            reason: "invalid-spec",
          },
          void 0,
        );
        return;
      }
      if (isCronInvalidRequestError(error)) {
        respondInvalidCronParams(respond, "cron.run", formatErrorMessage(error));
        return;
      }
      throw error;
    }
    respond(
      true,
      {
        ...result,
        processInstanceId: getGatewayProcessInstanceId(),
      },
      void 0,
    );
  },
  "cron.runs": async ({ params, respond, context, client }) => {
    if (!validateCronRunsParams(params)) {
      respondInvalidCronParams(
        respond,
        "cron.runs",
        formatValidationErrors(validateCronRunsParams.errors),
      );
      return;
    }
    const p = params;
    const callerScope = readCronCallerScope(client);
    const explicitScope = p.scope;
    const jobId = resolveCronJobId(p);
    const scope = explicitScope ?? (jobId ? "job" : "all");
    if (scope === "job" && !jobId) {
      respondMissingCronJobId(respond, "cron.runs");
      return;
    }
    if (scope === "all") {
      if (callerScope) {
        respondInvalidCronParams(respond, "cron.runs", "scope all is not allowed by caller scope");
        return;
      }
      const jobs = filterCronRunLogJobsByAgent(
        await context.cron.list({ includeDisabled: true }),
        p.agentId,
        context.cron.getDefaultAgentId(),
      );
      const jobNameById = Object.fromEntries(
        jobs
          .filter((job) => typeof job.id === "string" && typeof job.name === "string")
          .map((job) => [job.id, job.name]),
      );
      respond(
        true,
        readCronTaskRunHistoryPage({
          storeKey: cronStoreKey(context.cronStorePath),
          ...cronRunLogPageFilters(p),
          ...(p.agentId ? { jobIds: jobs.map((job) => job.id) } : {}),
          jobNameById,
        }),
        void 0,
      );
      return;
    }
    try {
      const matchedJob = filterCronRunLogJobsByAgent(
        await context.cron.list({ includeDisabled: true }),
        p.agentId,
        context.cron.getDefaultAgentId(),
      ).find(
        (job) =>
          job.id === jobId &&
          cronJobMatchesCallerScope({
            job,
            callerScope,
            defaultAgentId: context.cron.getDefaultAgentId(),
          }),
      );
      if ((callerScope || p.agentId) && !matchedJob) {
        respondInvalidCronParams(respond, "cron.runs", "id not found");
        return;
      }
      const jobNameById =
        matchedJob && typeof matchedJob.name === "string" ? { [jobId]: matchedJob.name } : void 0;
      respond(
        true,
        readCronTaskRunHistoryPage({
          storeKey: cronStoreKey(context.cronStorePath),
          jobId,
          ...cronRunLogPageFilters(p),
          jobNameById,
        }),
        void 0,
      );
    } catch (err) {
      if (!isInvalidCronTaskRunJobIdError(err)) throw err;
      respond(
        false,
        void 0,
        errorShape(ErrorCodes.INVALID_REQUEST, "invalid cron.runs params: invalid id"),
      );
    }
  },
};
//#endregion
export { cronHandlers };
