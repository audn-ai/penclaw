import crypto from "node:crypto";
import { n as normalizeAccountId } from "./account-id-C7N4Rwku.js";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import "./src-Bl7G9qvi.js";
import { r as stripTargetProviderPrefix } from "./channel-target-prefix-Co3r_2wp.js";
import { n as resolveCronStoredDeliveryContext } from "./delivery-context-vIV9w5yj.js";
import { n as resolveCronDeliveryPlan } from "./delivery-plan-DoSj9Ji-.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { W as resolveCronTriggerMinIntervalMs } from "./io-B3ne6NxF.js";
import { t as createLazyImportLoader } from "./lazy-promise-EhsWch5m.js";
import { r as resolveAgentMainSessionKey } from "./main-session-nrmKYo2W.js";
import {
  i as coerceFiniteScheduleNumber,
  n as normalizePayloadToSystemText,
  r as normalizeRequiredName,
} from "./normalize-CSef2SY2.js";
import { t as parseAbsoluteTimeMs } from "./parse-CbtxGw67.js";
import { l as resolveStorePath } from "./paths-TfuVT-K8.js";
import { r as getLoadedChannelPluginForRead } from "./registry-loaded-D8eZo-vR.js";
import { n as computePreviousRunAtMs, t as computeNextRunAtMs } from "./schedule-DsVY1zm0.js";
import { S as loadSessionEntry } from "./session-accessor-PZVNxFCV.js";
import { u as normalizeOptionalAgentId } from "./session-key-druuY-GG.js";
import { t as resolveCronAgentSessionKey } from "./session-key-MFREoGog.js";
import { t as assertSafeCronSessionTargetId } from "./session-target-DJsUULzX.js";
import {
  n as resolveCronStaggerMs,
  r as resolveDefaultCronStaggerMs,
  t as normalizeCronStaggerMs,
} from "./stagger-N9cGukpI.js";
import {
  c as normalizeOptionalString,
  u as normalizeOptionalThreadValue,
} from "./string-coerce-DW4mBlAt.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
import { n as isReservedTargetLiteralError } from "./target-errors-CZ0A80hz.js";
import { t as resolveExplicitDeliveryTargetCompat } from "./target-parsing-loaded-BVN1GPlL.js";
import {
  n as resolveOutboundTargetWithPlugin,
  t as resolveSessionDeliveryTarget,
} from "./targets-session-C5nmiRSl.js";
import { t as normalizeHttpWebhookUrl } from "./webhook-url-BOvGxtq0.js";
//#region src/infra/outbound/targets-loaded.ts
function resolveLoadedOutboundChannelPlugin(channel) {
  const normalized = normalizeOptionalString(channel);
  if (!normalized) return;
  return getLoadedChannelPluginForRead(normalized);
}
/** Resolves targets through an already-loaded channel plugin without bootstrap discovery. */
function tryResolveLoadedOutboundTarget(params) {
  return resolveOutboundTargetWithPlugin({
    plugin: resolveLoadedOutboundChannelPlugin(params.channel),
    target: params,
  });
}
//#endregion
//#region src/cron/isolated-agent/delivery-target.ts
/** Resolves isolated cron delivery requests into concrete outbound targets. */
const targetsRuntimeLoader = createLazyImportLoader(() => import("./targets.runtime.js"));
async function loadTargetsRuntime() {
  return await targetsRuntimeLoader.load();
}
async function resolveOutboundTargetWithRuntime(params) {
  try {
    const loaded = tryResolveLoadedOutboundTarget(params);
    if (loaded) return loaded;
    const { resolveOutboundTarget } = await loadTargetsRuntime();
    return resolveOutboundTarget({
      ...params,
      allowBootstrap: true,
    });
  } catch (err) {
    return {
      ok: false,
      error: /* @__PURE__ */ new Error(`Invalid delivery target: ${formatErrorMessage(err)}`),
    };
  }
}
const channelSelectionRuntimeLoader = createLazyImportLoader(
  () => import("./channel-selection.runtime.js"),
);
const deliveryTargetRuntimeLoader = createLazyImportLoader(
  () => import("./delivery-target.runtime.js"),
);
async function loadChannelSelectionRuntime() {
  return await channelSelectionRuntimeLoader.load();
}
async function loadDeliveryTargetRuntime() {
  return await deliveryTargetRuntimeLoader.load();
}
function isNonEmptyThreadId(value) {
  return value != null && value !== "";
}
function routesSharePeer(left, right) {
  return Boolean(
    left &&
    right &&
    left.baseSessionKey === right.baseSessionKey &&
    left.peer.kind === right.peer.kind &&
    left.peer.id === right.peer.id,
  );
}
function shouldCarrySessionThread(params) {
  if (!isNonEmptyThreadId(params.resolved.threadId)) return false;
  if (!params.explicitTo)
    return (
      params.resolved.channel === params.resolved.lastChannel &&
      params.resolved.to === params.resolved.lastTo
    );
  return routesSharePeer(params.route, params.lastRoute);
}
function stripSelectedProviderPrefix(params) {
  const trimmed = params.to?.trim();
  if (!trimmed) return;
  return stripTargetProviderPrefix(trimmed, params.channel).trim() || void 0;
}
function shouldStripResolvedTargetProviderPrefix(target) {
  return target.resolutionSource === "normalized";
}
/** Resolves cron delivery config into a concrete channel target and optional thread/account. */
async function resolveDeliveryTarget(cfg, agentId, jobPayload, options) {
  const requestedChannel = typeof jobPayload.channel === "string" ? jobPayload.channel : "last";
  const explicitTo = typeof jobPayload.to === "string" ? jobPayload.to : void 0;
  const allowMismatchedLastTo = requestedChannel === "last";
  const deliveryTargetRuntime = await loadDeliveryTargetRuntime();
  const sessionCfg = cfg.session;
  const mainSessionKey = resolveAgentMainSessionKey({
    cfg,
    agentId,
  });
  const storePath = resolveStorePath(sessionCfg?.store, { agentId });
  const rawSessionKey = jobPayload.sessionKey?.trim();
  const threadSessionKey = rawSessionKey
    ? resolveCronAgentSessionKey({
        sessionKey: rawSessionKey,
        agentId,
        mainKey: cfg.session?.mainKey,
        cfg,
      })
    : void 0;
  const storedDeliveryContext = resolveCronStoredDeliveryContext({
    cfg,
    sessionKey: threadSessionKey,
  });
  const storedDeliveryEntry = storedDeliveryContext
    ? {
        sessionId: threadSessionKey ?? mainSessionKey,
        updatedAt: 0,
        deliveryContext: storedDeliveryContext,
      }
    : void 0;
  const threadEntry = threadSessionKey
    ? loadSessionEntry({
        agentId,
        sessionKey: threadSessionKey,
        storePath,
      })
    : void 0;
  const mainEntry = loadSessionEntry({
    agentId,
    sessionKey: mainSessionKey,
    storePath,
  });
  const main = storedDeliveryEntry ?? threadEntry ?? mainEntry;
  const usedSharedMainFallback = mainEntry !== void 0 && main === mainEntry;
  const preliminary = resolveSessionDeliveryTarget({
    entry: main,
    requestedChannel,
    explicitTo,
    explicitThreadId: jobPayload.threadId,
    allowMismatchedLastTo,
  });
  let fallbackChannel;
  let channelResolutionError;
  if (!preliminary.channel)
    if (preliminary.lastChannel) fallbackChannel = preliminary.lastChannel;
    else
      try {
        const { resolveMessageChannelSelection } = await loadChannelSelectionRuntime();
        fallbackChannel = (await resolveMessageChannelSelection({ cfg })).channel;
      } catch (err) {
        const detail = formatErrorMessage(err);
        channelResolutionError = /* @__PURE__ */ new Error(
          `${detail} Set delivery.channel explicitly or use a main session with a previous channel.`,
        );
      }
  const resolved = fallbackChannel
    ? resolveSessionDeliveryTarget({
        entry: main,
        requestedChannel,
        explicitTo,
        explicitThreadId: jobPayload.threadId,
        fallbackChannel,
        allowMismatchedLastTo,
        mode: preliminary.mode,
      })
    : preliminary;
  const channel = resolved.channel ?? fallbackChannel;
  const mode = resolved.mode;
  let toCandidate = resolved.to;
  let accountId =
    (typeof jobPayload.accountId === "string" && jobPayload.accountId.trim()
      ? jobPayload.accountId.trim()
      : void 0) ?? resolved.accountId;
  if (!accountId && channel)
    accountId = deliveryTargetRuntime.resolveFirstBoundAccountId({
      cfg,
      channelId: channel,
      agentId,
    });
  if (jobPayload.accountId) accountId = jobPayload.accountId;
  if (!channel)
    return {
      ok: false,
      channel: void 0,
      to: void 0,
      accountId,
      threadId: void 0,
      mode,
      error:
        channelResolutionError ??
        /* @__PURE__ */ new Error(
          "Channel is required when delivery.channel=last has no previous channel.",
        ),
    };
  const explicitThreadId = isNonEmptyThreadId(jobPayload.threadId) ? jobPayload.threadId : void 0;
  let effectiveAllowFrom;
  if (mode === "implicit") {
    const { getLoadedChannelPluginForRead, mapAllowFromEntries } = deliveryTargetRuntime;
    const channelPlugin = getLoadedChannelPluginForRead(channel);
    const resolvedAccountId = normalizeAccountId(accountId);
    const configuredAllowFromRaw = channelPlugin?.config.resolveAllowFrom?.({
      cfg,
      accountId: resolvedAccountId,
    });
    const allowFromOverride = uniqueStrings(
      configuredAllowFromRaw ? mapAllowFromEntries(configuredAllowFromRaw) : [],
    );
    effectiveAllowFrom = allowFromOverride;
    if (toCandidate && allowFromOverride.length > 0) {
      if (
        !(
          await resolveOutboundTargetWithRuntime({
            channel,
            to: toCandidate,
            cfg,
            accountId,
            mode,
            allowFrom: effectiveAllowFrom,
          })
        ).ok
      )
        toCandidate = allowFromOverride[0];
    }
  }
  if (
    !rawSessionKey &&
    mode === "implicit" &&
    !explicitTo &&
    usedSharedMainFallback &&
    toCandidate != null &&
    toCandidate === resolved.lastTo
  )
    return {
      ok: false,
      channel,
      to: void 0,
      accountId,
      threadId: explicitThreadId,
      mode,
      error: /* @__PURE__ */ new Error(
        "Refusing implicit isolated cron delivery: the target would be inherited from the shared agent-main session bucket's last recipient, which is ambiguous across conversations and can deliver to the wrong room (and replay there after a restart). Set delivery.channel and delivery.to explicitly, or run the cron from a session that carries its own delivery context.",
      ),
    };
  const preResolvedRouteTargetCandidate = toCandidate;
  const docked = await resolveOutboundTargetWithRuntime({
    channel,
    to: toCandidate,
    cfg,
    accountId,
    mode,
    allowFrom: effectiveAllowFrom,
  });
  if (!docked.ok) {
    if (!toCandidate || !isReservedTargetLiteralError(docked.error))
      return {
        ok: false,
        channel,
        to: void 0,
        accountId,
        threadId: explicitThreadId,
        mode,
        error: docked.error,
      };
  } else toCandidate = docked.to;
  const targetResolution = await deliveryTargetRuntime.resolveChannelTargetForDelivery({
    cfg,
    channel,
    input: toCandidate,
    accountId,
  });
  if (!targetResolution.ok)
    return {
      ok: false,
      channel,
      to: void 0,
      accountId,
      threadId: explicitThreadId,
      mode,
      error: targetResolution.error,
    };
  const resolvedTarget = targetResolution.target;
  const routeTargetCandidate =
    resolvedTarget.source === "directory"
      ? resolvedTarget.to
      : (preResolvedRouteTargetCandidate ?? toCandidate);
  const selectedTarget = shouldStripResolvedTargetProviderPrefix(resolvedTarget)
    ? stripSelectedProviderPrefix({
        channel,
        to: resolvedTarget.to,
      })
    : resolvedTarget.to.trim();
  if (!selectedTarget)
    return {
      ok: false,
      channel,
      to: void 0,
      accountId,
      threadId: explicitThreadId,
      mode,
      error: /* @__PURE__ */ new Error("Target is required"),
    };
  toCandidate = selectedTarget;
  const route = await (async () => {
    try {
      return await deliveryTargetRuntime.resolveOutboundSessionRouteForDelivery({
        cfg,
        channel,
        agentId,
        accountId,
        target: routeTargetCandidate,
        resolvedTarget,
        threadId: explicitThreadId,
        currentSessionKey: threadSessionKey ?? mainSessionKey,
      });
    } catch {
      return null;
    }
  })();
  const routeCanCanonicalizeTarget = deliveryTargetRuntime.channelCanResolveOutboundSessionRoute({
    cfg,
    channel,
  });
  const routeShouldCanonicalizeTarget =
    route && (route.threadId !== void 0 || route.to !== routeTargetCandidate);
  if (route && routeCanCanonicalizeTarget && routeShouldCanonicalizeTarget) {
    const routeTo = stripSelectedProviderPrefix({
      channel,
      to: route.to,
    });
    if (!routeTo)
      return {
        ok: false,
        channel,
        to: void 0,
        accountId,
        threadId: explicitThreadId,
        mode,
        error: /* @__PURE__ */ new Error("Target is required"),
      };
    toCandidate = routeTo;
  }
  const lastTo = resolved.lastTo;
  const lastRoute =
    lastTo && resolved.lastChannel === channel
      ? await (async () => {
          try {
            return await deliveryTargetRuntime.resolveOutboundSessionRouteForDelivery({
              cfg,
              channel,
              agentId,
              accountId: resolved.lastAccountId ?? accountId,
              target: lastTo,
              threadId: resolved.lastThreadId,
              currentSessionKey: threadSessionKey ?? mainSessionKey,
            });
          } catch {
            return null;
          }
        })()
      : null;
  const parserExplicitThreadId =
    explicitThreadId == null && explicitTo
      ? normalizeOptionalThreadValue(
          resolveExplicitDeliveryTargetCompat({
            channel,
            rawTarget: explicitTo,
          })?.threadId,
        )
      : void 0;
  const canUseSessionThread =
    options?.inheritSessionThread !== false &&
    shouldCarrySessionThread({
      resolved,
      explicitTo,
      route,
      lastRoute,
    });
  const threadId =
    explicitThreadId ??
    route?.threadId ??
    parserExplicitThreadId ??
    (canUseSessionThread ? resolved.threadId : void 0);
  if (options?.dryRun)
    return {
      ok: true,
      channel,
      to: toCandidate,
      accountId,
      threadId,
      mode,
    };
  return {
    ok: true,
    channel,
    to: toCandidate,
    accountId,
    threadId,
    mode,
  };
}
//#endregion
//#region src/cron/service/initial-delivery.ts
/** Resolves default cron delivery for new jobs when callers omit explicit delivery config. */
function resolveInitialCronDelivery(input) {
  if (input.delivery) return input.delivery;
  if (
    input.sessionTarget === "isolated" &&
    (input.payload.kind === "agentTurn" || input.payload.kind === "command")
  )
    return { mode: "announce" };
}
//#endregion
//#region src/cron/service/jobs.ts
/** Cron job scheduling, validation, creation, and patch helpers. */
const STUCK_RUN_MS = 7200 * 1e3;
const STAGGER_OFFSET_CACHE_MAX = 4096;
const CRON_DECLARATIVE_LABEL_MAX_LENGTH = 200;
const staggerOffsetCache = /* @__PURE__ */ new Map();
/** Default retry delays applied after consecutive cron execution errors. */
const DEFAULT_ERROR_BACKOFF_SCHEDULE_MS = [3e4, 6e4, 5 * 6e4, 15 * 6e4, 60 * 6e4];
function isFiniteTimestamp(value) {
  return typeof value === "number" && Number.isFinite(value);
}
/** Returns whether a stored next-run timestamp is finite and schedulable. */
function hasScheduledNextRunAtMs(value) {
  return isFiniteTimestamp(value) && value > 0;
}
/** Resolves the newest persisted cron run status while older state is still readable. */
function resolveJobLastRunStatus(job) {
  return job.state.lastRunStatus ?? job.state.lastStatus;
}
/** Resolves the retry backoff delay for a one-based consecutive error count. */
function errorBackoffMs(consecutiveErrors, scheduleMs = DEFAULT_ERROR_BACKOFF_SCHEDULE_MS) {
  const idx = Math.min(consecutiveErrors - 1, scheduleMs.length - 1);
  return (
    expectDefined(scheduleMs[Math.max(0, idx)], "schedule ms entry at math.max(0, idx)") ??
    DEFAULT_ERROR_BACKOFF_SCHEDULE_MS[0]
  );
}
/** Returns the earliest retry timestamp after a failed cron run and its runtime duration. */
function resolveJobErrorBackoffUntilMs(job, scheduleMs = DEFAULT_ERROR_BACKOFF_SCHEDULE_MS) {
  if (resolveJobLastRunStatus(job) !== "error" || !isFiniteTimestamp(job.state.lastRunAtMs)) return;
  const consecutiveErrorsRaw = job.state.consecutiveErrors;
  const consecutiveErrors =
    typeof consecutiveErrorsRaw === "number" && Number.isFinite(consecutiveErrorsRaw)
      ? Math.max(1, Math.floor(consecutiveErrorsRaw))
      : 1;
  const lastDurationMs =
    typeof job.state.lastDurationMs === "number" && Number.isFinite(job.state.lastDurationMs)
      ? Math.max(0, Math.floor(job.state.lastDurationMs))
      : 0;
  return job.state.lastRunAtMs + lastDurationMs + errorBackoffMs(consecutiveErrors, scheduleMs);
}
function resolveStableCronOffsetMs(jobId, staggerMs) {
  if (staggerMs <= 1) return 0;
  const cacheKey = `${staggerMs}:${jobId}`;
  const cached = staggerOffsetCache.get(cacheKey);
  if (cached !== void 0) return cached;
  const offset = crypto.createHash("sha256").update(jobId).digest().readUInt32BE(0) % staggerMs;
  if (staggerOffsetCache.size >= STAGGER_OFFSET_CACHE_MAX) {
    const first = staggerOffsetCache.keys().next();
    if (!first.done) staggerOffsetCache.delete(first.value);
  }
  staggerOffsetCache.set(cacheKey, offset);
  return offset;
}
function computeStaggeredCronNextRunAtMs(job, nowMs) {
  if (job.schedule.kind !== "cron") return computeNextRunAtMs(job.schedule, nowMs);
  const staggerMs = resolveCronStaggerMs(job.schedule);
  const offsetMs = resolveStableCronOffsetMs(job.id, staggerMs);
  if (offsetMs <= 0) return computeNextRunAtMs(job.schedule, nowMs);
  let cursorMs = Math.max(0, nowMs - offsetMs);
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const baseNext = computeNextRunAtMs(job.schedule, cursorMs);
    if (baseNext === void 0) return;
    const shifted = baseNext + offsetMs;
    if (shifted > nowMs) return shifted;
    cursorMs = Math.max(cursorMs + 1, baseNext + 1e3);
  }
}
function computeStaggeredCronPreviousRunAtMs(job, nowMs) {
  if (job.schedule.kind !== "cron") return;
  const staggerMs = resolveCronStaggerMs(job.schedule);
  const offsetMs = resolveStableCronOffsetMs(job.id, staggerMs);
  if (offsetMs <= 0) return computePreviousRunAtMs(job.schedule, nowMs);
  let cursorMs = Math.max(0, nowMs - offsetMs);
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const basePrevious = computePreviousRunAtMs(job.schedule, cursorMs);
    if (basePrevious === void 0) return;
    const shifted = basePrevious + offsetMs;
    if (shifted <= nowMs) return shifted;
    cursorMs = Math.max(0, basePrevious - 1e3);
  }
}
function isStaggeredCronRunAtMs(job, runAtMs) {
  if (job.schedule.kind !== "cron" || !isFiniteTimestamp(runAtMs)) return false;
  return computeStaggeredCronPreviousRunAtMs(job, runAtMs + 1e3) === runAtMs;
}
function isPendingErrorBackoffSlot(params) {
  const { state, job, nextRunAtMs, nowMs } = params;
  const backoffUntilMs = resolveJobErrorBackoffUntilMs(
    job,
    state.deps.cronConfig?.retry?.backoffMs ?? DEFAULT_ERROR_BACKOFF_SCHEDULE_MS,
  );
  return backoffUntilMs !== void 0 && nowMs < backoffUntilMs && nextRunAtMs <= backoffUntilMs;
}
function shouldRepairFutureCronNextRunAtMs(params) {
  const { state, job, nowMs } = params;
  const nextRun = job.state.nextRunAtMs;
  if (
    job.schedule.kind !== "cron" ||
    !hasScheduledNextRunAtMs(nextRun) ||
    nowMs >= nextRun ||
    typeof job.state.runningAtMs === "number"
  )
    return false;
  if (
    isPendingErrorBackoffSlot({
      state,
      job,
      nextRunAtMs: nextRun,
      nowMs,
    })
  )
    return false;
  let naturalNext;
  try {
    naturalNext = computeStaggeredCronNextRunAtMs(job, nowMs);
  } catch {
    return false;
  }
  if (!isFiniteTimestamp(naturalNext)) return false;
  let isScheduledSlot;
  try {
    isScheduledSlot = isStaggeredCronRunAtMs(job, nextRun);
  } catch {
    return false;
  }
  if (isScheduledSlot) return false;
  if (nextRun < naturalNext) return job.payload.kind !== "agentTurn";
  if (nextRun === naturalNext) return false;
  let followingNaturalNext;
  try {
    followingNaturalNext = computeStaggeredCronNextRunAtMs(job, naturalNext);
  } catch {
    return false;
  }
  if (!isFiniteTimestamp(followingNaturalNext)) return false;
  const naturalIntervalMs = followingNaturalNext - naturalNext;
  return naturalIntervalMs > 0 && nextRun >= followingNaturalNext + naturalIntervalMs;
}
function resolveEveryAnchorMs(params) {
  const coerced = coerceFiniteScheduleNumber(params.schedule.anchorMs);
  if (coerced !== void 0) return Math.max(0, Math.floor(coerced));
  if (isFiniteTimestamp(params.fallbackAnchorMs))
    return Math.max(0, Math.floor(params.fallbackAnchorMs));
  return 0;
}
/** Validates that session target and payload kind form a supported cron job shape. */
function assertSupportedJobSpec(job) {
  if (typeof job.sessionTarget !== "string")
    throw new Error(
      'cron job is missing sessionTarget; expected "main", "isolated", "current", or "session:<id>"',
    );
  const isIsolatedLike =
    job.sessionTarget === "isolated" ||
    job.sessionTarget === "current" ||
    job.sessionTarget.startsWith("session:");
  if (job.sessionTarget.startsWith("session:"))
    assertSafeCronSessionTargetId(job.sessionTarget.slice(8));
  if (job.sessionTarget === "main" && job.payload.kind !== "systemEvent")
    throw new Error('main cron jobs require payload.kind="systemEvent"');
  if (isIsolatedLike && job.payload.kind !== "agentTurn" && job.payload.kind !== "command")
    throw new Error(
      'isolated/current/session cron jobs require payload.kind="agentTurn" or "command"',
    );
}
function assertTriggerSupport(job, opts) {
  if (!job.trigger) return;
  if (opts?.requireEnabled && opts.cronConfig?.triggers?.enabled !== true)
    throw new Error("cron triggers are disabled; set cron.triggers.enabled=true");
  if (job.schedule.kind !== "every" && job.schedule.kind !== "cron")
    throw new Error("cron triggers require an every or cron schedule");
  const minIntervalMs = resolveCronTriggerMinIntervalMs(opts?.cronConfig);
  if (job.schedule.kind === "every" && job.schedule.everyMs < minIntervalMs)
    throw new Error(`cron trigger every interval must be at least ${minIntervalMs}ms`);
}
function assertCronExpressionSatisfiable(job, nowMs) {
  if (job.schedule.kind !== "cron") return;
  if (
    computeJobNextRunAtMs(
      {
        ...job,
        enabled: true,
      },
      nowMs,
    ) !== void 0
  )
    return;
  throw new Error(
    `cron expression "${job.schedule.expr}" has no upcoming run time and would never fire`,
  );
}
function assertMainSessionAgentId(job, defaultAgentId) {
  if (job.sessionTarget !== "main") return;
  if (!job.agentId) return;
  if (normalizeAgentId(job.agentId) !== normalizeAgentId(defaultAgentId))
    throw new Error(
      `cron: sessionTarget "main" is only valid for the default agent. Use sessionTarget "isolated" with payload.kind "agentTurn" for non-default agents (agentId: ${job.agentId})`,
    );
}
function assertDeliverySupport(job) {
  if (!job.delivery) return;
  if (job.delivery.mode === "none" && !job.delivery.completionDestination) return;
  if (job.delivery.mode === "webhook") {
    const target = normalizeHttpWebhookUrl(job.delivery.to);
    if (!target)
      throw new Error("cron webhook delivery requires delivery.to to be a valid http(s) URL");
    job.delivery.to = target;
  }
  if (job.delivery.completionDestination?.mode === "webhook") {
    if (job.delivery.mode !== "announce")
      throw new Error(
        'cron completion destination webhook is only supported with delivery.mode="announce"',
      );
    const target = normalizeHttpWebhookUrl(job.delivery.completionDestination.to);
    if (!target)
      throw new Error(
        "cron completion destination webhook requires delivery.completionDestination.to to be a valid http(s) URL",
      );
    job.delivery.completionDestination.to = target;
  }
  if (job.delivery.mode === "none") return;
  if (job.delivery.mode === "webhook") return;
  if (
    !(
      job.sessionTarget === "isolated" ||
      job.sessionTarget === "current" ||
      job.sessionTarget.startsWith("session:")
    )
  )
    throw new Error('cron channel delivery config is only supported for sessionTarget="isolated"');
}
function hasConcreteFailureDestination(destination) {
  return Boolean(
    destination &&
    (destination.channel !== void 0 ||
      destination.to !== void 0 ||
      destination.accountId !== void 0 ||
      destination.mode !== void 0),
  );
}
function assertFailureDestinationSupport(job) {
  const failureDestination = job.delivery?.failureDestination;
  if (!failureDestination) return;
  if (!hasConcreteFailureDestination(failureDestination)) return;
  if (job.sessionTarget === "main" && job.delivery?.mode !== "webhook")
    throw new Error(
      'cron delivery.failureDestination is only supported for sessionTarget="isolated" unless delivery.mode="webhook"',
    );
  if (failureDestination.mode === "webhook") {
    const target = normalizeHttpWebhookUrl(failureDestination.to);
    if (!target)
      throw new Error(
        "cron failure destination webhook requires delivery.failureDestination.to to be a valid http(s) URL",
      );
    failureDestination.to = target;
  }
}
/** Finds an in-memory cron job or throws the public unknown-id error. */
function findJobOrThrow(state, id) {
  const job = state.store?.jobs.find((j) => j.id === id);
  if (!job) throw new Error(`unknown cron job id: ${id}`);
  return job;
}
/** Returns the effective enabled flag, defaulting missing values to enabled. */
function isJobEnabled(job) {
  return job.enabled ?? true;
}
/** Computes the next run timestamp for enabled jobs across every/at/cron schedules. */
function computeJobNextRunAtMs(job, nowMs) {
  if (!isJobEnabled(job)) return;
  if (job.schedule.kind === "every") {
    const everyMsRaw = coerceFiniteScheduleNumber(job.schedule.everyMs);
    if (everyMsRaw === void 0) return;
    const everyMs = Math.max(1, Math.floor(everyMsRaw));
    const lastRunAtMs = job.state.lastRunAtMs;
    if (typeof lastRunAtMs === "number" && Number.isFinite(lastRunAtMs)) {
      const nextFromLastRun = Math.floor(lastRunAtMs) + everyMs;
      if (nextFromLastRun > nowMs) return nextFromLastRun;
    }
    const fallbackAnchorMs = isFiniteTimestamp(job.createdAtMs) ? job.createdAtMs : nowMs;
    const anchorMs = resolveEveryAnchorMs({
      schedule: job.schedule,
      fallbackAnchorMs,
    });
    const next = computeNextRunAtMs(
      {
        ...job.schedule,
        everyMs,
        anchorMs,
      },
      nowMs,
    );
    return isFiniteTimestamp(next) ? next : void 0;
  }
  if (job.schedule.kind === "at") {
    const atMs = parseAbsoluteTimeMs(job.schedule.at);
    if (resolveJobLastRunStatus(job) === "ok" && job.state.lastRunAtMs) {
      if (atMs !== null && Number.isFinite(atMs) && atMs > job.state.lastRunAtMs) return atMs;
      return;
    }
    return atMs !== null && Number.isFinite(atMs) ? atMs : void 0;
  }
  const next = computeStaggeredCronNextRunAtMs(job, nowMs);
  if (next === void 0 && job.schedule.kind === "cron")
    return computeStaggeredCronNextRunAtMs(job, Math.floor(nowMs / 1e3) * 1e3 + 1e3);
  return isFiniteTimestamp(next) ? next : void 0;
}
/** Computes the previous effective cron timestamp, including per-job staggering. */
function computeJobPreviousRunAtMs(job, nowMs) {
  if (!isJobEnabled(job) || job.schedule.kind !== "cron") return;
  const previous = computeStaggeredCronPreviousRunAtMs(job, nowMs);
  return isFiniteTimestamp(previous) ? previous : void 0;
}
/** Maximum consecutive schedule errors before auto-disabling a job. */
const MAX_SCHEDULE_ERRORS = 3;
/** Records a schedule-computation failure and auto-disables after repeated errors. */
function recordScheduleComputeError(params) {
  const { state, job, err } = params;
  const errorCount = (job.state.scheduleErrorCount ?? 0) + 1;
  const errText = String(err);
  job.state.scheduleErrorCount = errorCount;
  job.state.nextRunAtMs = void 0;
  job.state.lastError = `schedule error: ${errText}`;
  if (errorCount >= MAX_SCHEDULE_ERRORS) {
    job.enabled = false;
    state.deps.log.error(
      {
        jobId: job.id,
        name: job.name,
        errorCount,
        err: errText,
      },
      "cron: auto-disabled job after repeated schedule errors",
    );
    const notifyText = `⚠️ Cron job "${job.name}" has been auto-disabled after ${errorCount} consecutive schedule errors. Last error: ${errText}`;
    const notify = () => {
      state.deps.enqueueSystemEvent(notifyText, {
        agentId: job.agentId,
        sessionKey: job.sessionKey,
        contextKey: `cron:${job.id}:auto-disabled`,
      });
      state.deps.requestHeartbeat({
        source: "cron",
        intent: "event",
        reason: `cron:${job.id}:auto-disabled`,
        agentId: job.agentId,
        sessionKey: job.sessionKey,
      });
    };
    if (params.deferredAutoDisableNotifications)
      params.deferredAutoDisableNotifications.push(notify);
    else notify();
  } else
    state.deps.log.warn(
      {
        jobId: job.id,
        name: job.name,
        errorCount,
        err: errText,
      },
      "cron: failed to compute next run for job (skipping)",
    );
  return true;
}
function normalizeJobTickState(params) {
  const { state, job, nowMs } = params;
  let changed = false;
  if (!job.state) {
    job.state = {};
    changed = true;
  }
  if (job.schedule.kind === "every") {
    const normalizedAnchorMs = resolveEveryAnchorMs({
      schedule: job.schedule,
      fallbackAnchorMs: isFiniteTimestamp(job.createdAtMs) ? job.createdAtMs : nowMs,
    });
    if (job.schedule.anchorMs !== normalizedAnchorMs) {
      job.schedule = {
        ...job.schedule,
        anchorMs: normalizedAnchorMs,
      };
      changed = true;
    }
  }
  if (!isJobEnabled(job)) {
    if (job.state.nextRunAtMs !== void 0) {
      job.state.nextRunAtMs = void 0;
      changed = true;
    }
    if (job.state.runningAtMs !== void 0) {
      job.state.runningAtMs = void 0;
      changed = true;
    }
    return {
      changed,
      skip: true,
    };
  }
  if (!hasScheduledNextRunAtMs(job.state.nextRunAtMs) && job.state.nextRunAtMs !== void 0) {
    job.state.nextRunAtMs = void 0;
    changed = true;
  }
  const runningAt = job.state.runningAtMs;
  if (typeof runningAt === "number" && nowMs - runningAt > STUCK_RUN_MS) {
    state.deps.log.warn(
      {
        jobId: job.id,
        runningAtMs: runningAt,
      },
      "cron: clearing stuck running marker",
    );
    job.state.runningAtMs = void 0;
    changed = true;
    const nextRun = job.state.nextRunAtMs;
    const lastRun = job.state.lastRunAtMs;
    const alreadyExecutedSlot =
      hasScheduledNextRunAtMs(nextRun) && isFiniteTimestamp(lastRun) && lastRun >= nextRun;
    return {
      changed,
      skip: !alreadyExecutedSlot,
    };
  }
  return {
    changed,
    skip: false,
  };
}
function walkSchedulableJobs(state, fn, nowMs = state.deps.nowMs()) {
  if (!state.store) return false;
  let changed = false;
  for (const job of state.store.jobs) {
    const tick = normalizeJobTickState({
      state,
      job,
      nowMs,
    });
    if (tick.changed) changed = true;
    if (tick.skip) continue;
    if (
      fn({
        job,
        nowMs,
      })
    )
      changed = true;
  }
  return changed;
}
function recomputeJobNextRunAtMs(params) {
  let changed = false;
  try {
    let newNext = computeJobNextRunAtMs(params.job, params.nowMs);
    if (
      params.job.schedule.kind !== "at" &&
      resolveJobLastRunStatus(params.job) === "error" &&
      isFiniteTimestamp(params.job.state.lastRunAtMs)
    ) {
      const backoffFloor = resolveJobErrorBackoffUntilMs(
        params.job,
        params.state.deps.cronConfig?.retry?.backoffMs ?? DEFAULT_ERROR_BACKOFF_SCHEDULE_MS,
      );
      if (newNext !== void 0)
        newNext = backoffFloor !== void 0 ? Math.max(newNext, backoffFloor) : newNext;
    }
    if (params.job.state.nextRunAtMs !== newNext) {
      params.job.state.nextRunAtMs = newNext;
      changed = true;
    }
    if (params.job.state.scheduleErrorCount) {
      params.job.state.scheduleErrorCount = void 0;
      changed = true;
    }
  } catch (err) {
    if (
      recordScheduleComputeError({
        state: params.state,
        job: params.job,
        err,
        deferredAutoDisableNotifications: params.deferredAutoDisableNotifications,
      })
    )
      changed = true;
  }
  return changed;
}
/** Recomputes missing, due, or repairable next-run timestamps for all schedulable jobs. */
function recomputeNextRuns(state) {
  return walkSchedulableJobs(state, ({ job, nowMs: now }) => {
    let changed = false;
    const nextRun = job.state.nextRunAtMs;
    if (
      !hasScheduledNextRunAtMs(nextRun) ||
      now >= nextRun ||
      shouldRepairFutureCronNextRunAtMs({
        state,
        job,
        nowMs: now,
      })
    ) {
      if (
        recomputeJobNextRunAtMs({
          state,
          job,
          nowMs: now,
        })
      )
        changed = true;
    }
    return changed;
  });
}
/**
 * Maintenance-only version of recomputeNextRuns that handles disabled jobs
 * and stuck markers, but does NOT recompute nextRunAtMs for enabled jobs
 * with existing values. Used during timer ticks when no due jobs were found
 * to prevent silently advancing past-due nextRunAtMs values without execution
 * (see #13992).
 */
function recomputeNextRunsForMaintenance(state, opts) {
  const recomputeExpired = opts?.recomputeExpired ?? false;
  const repairFutureCronNextRunAtMs = opts?.repairFutureCronNextRunAtMs ?? true;
  const recomputeJob = (job, nowMs) =>
    recomputeJobNextRunAtMs({
      state,
      job,
      nowMs,
      deferredAutoDisableNotifications: opts?.deferredAutoDisableNotifications,
    });
  const deferralIds = state.pendingCatchupDeferralJobIds;
  if (state.store && deferralIds.size > 0) {
    const relevantDeferralIds = new Set(
      state.store.jobs.filter((job) => isJobEnabled(job)).map((job) => job.id),
    );
    for (const jobId of deferralIds) if (!relevantDeferralIds.has(jobId)) deferralIds.delete(jobId);
  }
  return walkSchedulableJobs(
    state,
    ({ job, nowMs: now }) => {
      let changed = false;
      if (deferralIds.has(job.id)) {
        const nextRun = job.state.nextRunAtMs;
        if (hasScheduledNextRunAtMs(nextRun) && now >= nextRun) {
          deferralIds.delete(job.id);
          changed = true;
        }
      }
      if (!hasScheduledNextRunAtMs(job.state.nextRunAtMs)) {
        if (recomputeJob(job, now)) changed = true;
      } else if (
        repairFutureCronNextRunAtMs &&
        !deferralIds.has(job.id) &&
        shouldRepairFutureCronNextRunAtMs({
          state,
          job,
          nowMs: now,
        })
      ) {
        if (recomputeJob(job, now)) changed = true;
      } else if (
        recomputeExpired &&
        now >= job.state.nextRunAtMs &&
        typeof job.state.runningAtMs !== "number"
      ) {
        const lastRun = job.state.lastRunAtMs;
        const alreadyExecutedSlot = isFiniteTimestamp(lastRun) && lastRun >= job.state.nextRunAtMs;
        const backoffUntilMs = resolveJobErrorBackoffUntilMs(
          job,
          state.deps.cronConfig?.retry?.backoffMs ?? DEFAULT_ERROR_BACKOFF_SCHEDULE_MS,
        );
        const isStaleBackoffSlot =
          backoffUntilMs !== void 0 &&
          now < backoffUntilMs &&
          job.state.nextRunAtMs < backoffUntilMs;
        if (alreadyExecutedSlot || isStaleBackoffSlot) {
          if (recomputeJob(job, now)) changed = true;
        }
      }
      return changed;
    },
    opts?.nowMs,
  );
}
/** Returns the next enabled wake timestamp from the in-memory cron store. */
function nextWakeAtMs(state) {
  const enabled = (state.store?.jobs ?? []).filter(
    (j) => isJobEnabled(j) && hasScheduledNextRunAtMs(j.state.nextRunAtMs),
  );
  if (enabled.length === 0) return;
  const first = enabled[0]?.state.nextRunAtMs;
  if (!hasScheduledNextRunAtMs(first)) return;
  return enabled.reduce((min, j) => {
    const next = j.state.nextRunAtMs;
    return hasScheduledNextRunAtMs(next) ? Math.min(min, next) : min;
  }, first);
}
/** Creates a normalized cron job row from public add input and computes its initial schedule. */
function createJob(state, input) {
  const now = state.deps.nowMs();
  const id = normalizeOptionalString(input.id) ?? crypto.randomUUID();
  const schedule =
    input.schedule.kind === "every"
      ? {
          ...input.schedule,
          anchorMs: resolveEveryAnchorMs({
            schedule: input.schedule,
            fallbackAnchorMs: now,
          }),
        }
      : input.schedule.kind === "cron"
        ? (() => {
            const explicitStaggerMs = normalizeCronStaggerMs(input.schedule.staggerMs);
            if (explicitStaggerMs !== void 0)
              return {
                ...input.schedule,
                staggerMs: explicitStaggerMs,
              };
            const defaultStaggerMs = resolveDefaultCronStaggerMs(input.schedule.expr);
            return defaultStaggerMs !== void 0
              ? {
                  ...input.schedule,
                  staggerMs: defaultStaggerMs,
                }
              : input.schedule;
          })()
        : input.schedule;
  const deleteAfterRun =
    typeof input.deleteAfterRun === "boolean"
      ? input.deleteAfterRun
      : schedule.kind === "at"
        ? true
        : void 0;
  const enabled = typeof input.enabled === "boolean" ? input.enabled : true;
  const declarationKey = normalizeOptionalString(input.declarationKey);
  if (input.declarationKey !== void 0 && !declarationKey)
    throw new Error("cron declarationKey must not be blank");
  if (declarationKey && declarationKey.length > CRON_DECLARATIVE_LABEL_MAX_LENGTH)
    throw new Error(
      `cron declarationKey must be at most ${CRON_DECLARATIVE_LABEL_MAX_LENGTH} characters`,
    );
  const displayName = normalizeOptionalString(input.displayName);
  if (input.displayName !== void 0 && !displayName)
    throw new Error("cron displayName must not be blank");
  if (displayName && displayName.length > CRON_DECLARATIVE_LABEL_MAX_LENGTH)
    throw new Error(
      `cron displayName must be at most ${CRON_DECLARATIVE_LABEL_MAX_LENGTH} characters`,
    );
  const ownerAgentId = normalizeOptionalAgentId(input.owner?.agentId);
  const ownerSessionKey = normalizeOptionalString(input.owner?.sessionKey);
  const job = {
    id,
    ...(declarationKey ? { declarationKey } : {}),
    ...(displayName ? { displayName } : {}),
    ...(ownerAgentId || ownerSessionKey
      ? {
          owner: {
            ...(ownerAgentId ? { agentId: ownerAgentId } : {}),
            ...(ownerSessionKey ? { sessionKey: ownerSessionKey } : {}),
          },
        }
      : {}),
    agentId: normalizeOptionalAgentId(input.agentId),
    sessionKey: normalizeOptionalString(input.sessionKey),
    name: normalizeRequiredName(input.name),
    description: normalizeOptionalString(input.description),
    enabled,
    deleteAfterRun,
    createdAtMs: now,
    updatedAtMs: now,
    schedule,
    sessionTarget: input.sessionTarget,
    wakeMode: input.wakeMode,
    payload: input.payload,
    delivery: resolveInitialCronDelivery(input),
    failureAlert: input.failureAlert,
    ...(input.trigger ? { trigger: structuredClone(input.trigger) } : {}),
    state: { ...input.state },
  };
  assertSupportedJobSpec(job);
  assertTriggerSupport(job, {
    cronConfig: state.deps.cronConfig,
    requireEnabled: job.trigger !== void 0,
  });
  assertMainSessionAgentId(job, state.deps.defaultAgentId);
  assertDeliverySupport(job);
  assertFailureDestinationSupport(job);
  assertCronExpressionSatisfiable(job, now);
  job.state.nextRunAtMs = computeJobNextRunAtMs(job, now);
  return job;
}
/** Applies a public cron patch in-place, preserving omitted nested fields and validating the result. */
function applyJobPatch(job, patch, opts) {
  if ("name" in patch) job.name = normalizeRequiredName(patch.name);
  if ("description" in patch) job.description = normalizeOptionalString(patch.description);
  if ("displayName" in patch) {
    const displayName = normalizeOptionalString(patch.displayName);
    if (patch.displayName !== null && patch.displayName !== void 0 && !displayName)
      throw new Error("cron displayName must not be blank");
    if (displayName && displayName.length > CRON_DECLARATIVE_LABEL_MAX_LENGTH)
      throw new Error(
        `cron displayName must be at most ${CRON_DECLARATIVE_LABEL_MAX_LENGTH} characters`,
      );
    if (displayName) job.displayName = displayName;
    else delete job.displayName;
  }
  if (typeof patch.enabled === "boolean") job.enabled = patch.enabled;
  if (typeof patch.deleteAfterRun === "boolean") job.deleteAfterRun = patch.deleteAfterRun;
  if (patch.schedule)
    if (patch.schedule.kind === "cron") {
      const explicitStaggerMs = normalizeCronStaggerMs(patch.schedule.staggerMs);
      if (explicitStaggerMs !== void 0)
        job.schedule = {
          ...patch.schedule,
          staggerMs: explicitStaggerMs,
        };
      else if (job.schedule.kind === "cron")
        job.schedule = {
          ...patch.schedule,
          staggerMs: job.schedule.staggerMs,
        };
      else {
        const defaultStaggerMs = resolveDefaultCronStaggerMs(patch.schedule.expr);
        job.schedule =
          defaultStaggerMs !== void 0
            ? {
                ...patch.schedule,
                staggerMs: defaultStaggerMs,
              }
            : patch.schedule;
      }
    } else job.schedule = patch.schedule;
  if ("trigger" in patch)
    if (patch.trigger === null || patch.trigger === void 0) delete job.trigger;
    else job.trigger = structuredClone(patch.trigger);
  if (patch.sessionTarget) job.sessionTarget = patch.sessionTarget;
  if (patch.wakeMode) job.wakeMode = patch.wakeMode;
  if (patch.payload) job.payload = mergeCronPayload(job.payload, patch.payload);
  if (patch.delivery) {
    const implicitMode = resolveCronDeliveryPlan(job).mode;
    job.delivery = mergeCronDelivery(job.delivery, patch.delivery, implicitMode);
  }
  if ("failureAlert" in patch)
    job.failureAlert = mergeCronFailureAlert(job.failureAlert, patch.failureAlert);
  if (
    job.sessionTarget === "main" &&
    job.delivery?.mode !== "webhook" &&
    hasConcreteFailureDestination(job.delivery?.failureDestination)
  )
    throw new Error(
      'cron delivery.failureDestination is only supported for sessionTarget="isolated" unless delivery.mode="webhook"',
    );
  if (job.sessionTarget === "main" && job.delivery?.mode !== "webhook") {
    const failureDestination = job.delivery?.failureDestination;
    job.delivery =
      failureDestination && !hasConcreteFailureDestination(failureDestination)
        ? {
            mode: "none",
            failureDestination,
          }
        : void 0;
  }
  if (patch.state)
    job.state = {
      ...job.state,
      ...patch.state,
    };
  if ("agentId" in patch) job.agentId = normalizeOptionalAgentId(patch.agentId);
  if ("sessionKey" in patch) job.sessionKey = normalizeOptionalString(patch.sessionKey);
  assertSupportedJobSpec(job);
  assertTriggerSupport(job, {
    cronConfig: opts?.cronConfig,
    requireEnabled: patch.trigger !== null && patch.trigger !== void 0,
  });
  assertMainSessionAgentId(job, opts?.defaultAgentId);
  assertDeliverySupport(job);
  assertFailureDestinationSupport(job);
  if (
    opts?.scheduleValidationNowMs !== void 0 &&
    (patch.schedule !== void 0 || patch.enabled === true)
  )
    assertCronExpressionSatisfiable(job, opts.scheduleValidationNowMs);
}
/** Converges the declared schedule, payload, delivery, and display label only. */
function applyDeclarativeJobSpec(job, input, opts) {
  const displayName = normalizeOptionalString(input.displayName);
  if (input.displayName !== void 0 && !displayName)
    throw new Error("cron displayName must not be blank");
  if (displayName && displayName.length > CRON_DECLARATIVE_LABEL_MAX_LENGTH)
    throw new Error(
      `cron displayName must be at most ${CRON_DECLARATIVE_LABEL_MAX_LENGTH} characters`,
    );
  if (displayName) job.displayName = displayName;
  else delete job.displayName;
  if (
    input.schedule.kind === "every" &&
    input.schedule.anchorMs === void 0 &&
    job.schedule.kind === "every" &&
    job.schedule.everyMs === input.schedule.everyMs
  )
    job.schedule = {
      ...input.schedule,
      anchorMs: job.schedule.anchorMs,
    };
  else if (input.schedule.kind === "every" && input.schedule.anchorMs === void 0)
    job.schedule = {
      ...input.schedule,
      anchorMs: opts.nowMs,
    };
  else if (input.schedule.kind === "cron") {
    const explicitStaggerMs = normalizeCronStaggerMs(input.schedule.staggerMs);
    const defaultStaggerMs = resolveDefaultCronStaggerMs(input.schedule.expr);
    job.schedule = {
      ...input.schedule,
      ...(explicitStaggerMs !== void 0
        ? { staggerMs: explicitStaggerMs }
        : defaultStaggerMs !== void 0
          ? { staggerMs: defaultStaggerMs }
          : {}),
    };
  } else job.schedule = structuredClone(input.schedule);
  job.payload = structuredClone(input.payload);
  if (input.trigger) job.trigger = structuredClone(input.trigger);
  else delete job.trigger;
  const delivery = resolveInitialCronDelivery(input);
  if (delivery) job.delivery = structuredClone(delivery);
  else delete job.delivery;
  if (opts.enabledExplicit) job.enabled = input.enabled;
  assertTriggerSupport(job, {
    cronConfig: opts.cronConfig,
    requireEnabled: input.trigger !== void 0,
  });
  assertSupportedJobSpec(job);
  assertMainSessionAgentId(job, opts.defaultAgentId);
  assertDeliverySupport(job);
  assertFailureDestinationSupport(job);
  assertCronExpressionSatisfiable(job, opts.nowMs);
}
function applyAgentTurnToolsAllowPatch(payload, patch, existing) {
  if (Array.isArray(patch.toolsAllow)) {
    payload.toolsAllow = patch.toolsAllow;
    if (
      existing
        ? existing.toolsAllowIsDefault === true && toolsAllowEqual(existing, patch)
        : patch.toolsAllowIsDefault === true
    )
      payload.toolsAllowIsDefault = true;
    else delete payload.toolsAllowIsDefault;
  } else if (patch.toolsAllow === null) {
    delete payload.toolsAllow;
    delete payload.toolsAllowIsDefault;
  }
}
function toolsAllowEqual(left, right) {
  const rightToolsAllow = right.toolsAllow;
  return (
    Array.isArray(left.toolsAllow) &&
    Array.isArray(rightToolsAllow) &&
    left.toolsAllow.length === rightToolsAllow.length &&
    left.toolsAllow.every((toolName, index) => toolName === rightToolsAllow[index])
  );
}
function mergeCronPayload(existing, patch) {
  if (patch.kind !== existing.kind) return buildPayloadFromPatch(patch);
  if (patch.kind === "systemEvent") {
    if (existing.kind !== "systemEvent") return buildPayloadFromPatch(patch);
    return {
      kind: "systemEvent",
      text: typeof patch.text === "string" ? patch.text : existing.text,
    };
  }
  if (patch.kind === "command") {
    if (existing.kind !== "command") return buildPayloadFromPatch(patch);
    const next = { ...existing };
    if (Array.isArray(patch.argv)) next.argv = patch.argv;
    if (typeof patch.cwd === "string") next.cwd = patch.cwd;
    if (patch.env && typeof patch.env === "object" && !Array.isArray(patch.env))
      next.env = patch.env;
    if (typeof patch.input === "string") next.input = patch.input;
    if (typeof patch.timeoutSeconds === "number") next.timeoutSeconds = patch.timeoutSeconds;
    if (typeof patch.noOutputTimeoutSeconds === "number")
      next.noOutputTimeoutSeconds = patch.noOutputTimeoutSeconds;
    if (typeof patch.outputMaxBytes === "number") next.outputMaxBytes = patch.outputMaxBytes;
    return next;
  }
  if (existing.kind !== "agentTurn") return buildPayloadFromPatch(patch);
  const next = { ...existing };
  if (typeof patch.message === "string") next.message = patch.message;
  if (typeof patch.model === "string") next.model = patch.model;
  else if (patch.model === null) delete next.model;
  if (Array.isArray(patch.fallbacks)) next.fallbacks = patch.fallbacks;
  else if (patch.fallbacks === null) delete next.fallbacks;
  applyAgentTurnToolsAllowPatch(next, patch, existing);
  if (typeof patch.thinking === "string") next.thinking = patch.thinking;
  else if (patch.thinking === null) delete next.thinking;
  if (typeof patch.timeoutSeconds === "number") next.timeoutSeconds = patch.timeoutSeconds;
  if (typeof patch.lightContext === "boolean") next.lightContext = patch.lightContext;
  if (typeof patch.allowUnsafeExternalContent === "boolean")
    next.allowUnsafeExternalContent = patch.allowUnsafeExternalContent;
  return next;
}
function buildPayloadFromPatch(patch) {
  if (patch.kind === "systemEvent") {
    if (typeof patch.text !== "string" || patch.text.length === 0)
      throw new Error('cron.update payload.kind="systemEvent" requires text');
    return {
      kind: "systemEvent",
      text: patch.text,
    };
  }
  if (patch.kind === "command") {
    if (!Array.isArray(patch.argv) || patch.argv.length === 0)
      throw new Error('cron.update payload.kind="command" requires argv');
    return {
      kind: "command",
      argv: patch.argv,
      cwd: patch.cwd,
      env: patch.env,
      input: patch.input,
      timeoutSeconds: patch.timeoutSeconds,
      noOutputTimeoutSeconds: patch.noOutputTimeoutSeconds,
      outputMaxBytes: patch.outputMaxBytes,
    };
  }
  if (typeof patch.message !== "string" || patch.message.length === 0)
    throw new Error('cron.update payload.kind="agentTurn" requires message');
  const next = {
    kind: "agentTurn",
    message: patch.message,
    model: typeof patch.model === "string" ? patch.model : void 0,
    fallbacks: Array.isArray(patch.fallbacks) ? patch.fallbacks : void 0,
    thinking: typeof patch.thinking === "string" ? patch.thinking : void 0,
    timeoutSeconds: patch.timeoutSeconds,
    lightContext: patch.lightContext,
    allowUnsafeExternalContent: patch.allowUnsafeExternalContent,
  };
  applyAgentTurnToolsAllowPatch(next, patch);
  return next;
}
function mergeCronDelivery(existing, patch, implicitMode) {
  const hasCompletionDestinationPatch = "completionDestination" in patch;
  const next = {
    mode: existing?.mode ?? implicitMode,
    channel: existing?.channel,
    to: existing?.to,
    threadId: existing?.threadId,
    accountId: existing?.accountId,
    bestEffort: existing?.bestEffort,
    completionDestination: existing?.completionDestination,
    failureDestination: existing?.failureDestination,
  };
  if (typeof patch.mode === "string") {
    const previousMode = next.mode;
    next.mode = patch.mode === "deliver" ? "announce" : patch.mode;
    if (previousMode !== next.mode && (previousMode === "webhook" || next.mode === "webhook"))
      next.to = void 0;
    if (next.mode === "webhook") {
      next.channel = void 0;
      next.threadId = void 0;
      next.accountId = void 0;
    }
    if (!hasCompletionDestinationPatch && (next.mode === "none" || next.mode === "webhook"))
      next.completionDestination = void 0;
  }
  if ("channel" in patch) next.channel = normalizeOptionalString(patch.channel);
  if ("to" in patch) next.to = normalizeOptionalString(patch.to);
  if ("threadId" in patch) next.threadId = normalizeOptionalThreadValue(patch.threadId);
  if ("accountId" in patch) next.accountId = normalizeOptionalString(patch.accountId);
  if (typeof patch.bestEffort === "boolean") next.bestEffort = patch.bestEffort;
  if (hasCompletionDestinationPatch)
    if (patch.completionDestination == null) next.completionDestination = void 0;
    else {
      const to = normalizeOptionalString(patch.completionDestination.to);
      next.completionDestination = {
        mode: "webhook",
        ...(to ? { to } : {}),
      };
    }
  if ("failureDestination" in patch)
    if (patch.failureDestination == null) next.failureDestination = void 0;
    else {
      const existingFd = next.failureDestination;
      const patchFd = patch.failureDestination;
      const nextFd = {};
      if (existingFd) {
        if (Object.hasOwn(existingFd, "channel")) nextFd.channel = existingFd.channel;
        if (Object.hasOwn(existingFd, "to")) nextFd.to = existingFd.to;
        if (Object.hasOwn(existingFd, "accountId")) nextFd.accountId = existingFd.accountId;
        if (Object.hasOwn(existingFd, "mode")) nextFd.mode = existingFd.mode;
      }
      if (patchFd) {
        if ("channel" in patchFd) {
          const channel = normalizeOptionalString(patchFd.channel) ?? "";
          nextFd.channel = channel ? channel : void 0;
        }
        if ("to" in patchFd) {
          const to = normalizeOptionalString(patchFd.to) ?? "";
          nextFd.to = to ? to : void 0;
        }
        if ("accountId" in patchFd) {
          const accountId = normalizeOptionalString(patchFd.accountId) ?? "";
          nextFd.accountId = accountId ? accountId : void 0;
        }
        if ("mode" in patchFd) {
          const mode = normalizeOptionalString(patchFd.mode) ?? "";
          nextFd.mode = mode === "announce" || mode === "webhook" ? mode : void 0;
        }
      }
      next.failureDestination =
        Object.hasOwn(nextFd, "channel") ||
        Object.hasOwn(nextFd, "to") ||
        Object.hasOwn(nextFd, "accountId") ||
        Object.hasOwn(nextFd, "mode")
          ? nextFd
          : void 0;
    }
  if (
    existing === void 0 &&
    !("mode" in patch) &&
    next.channel === void 0 &&
    next.to === void 0 &&
    next.threadId === void 0 &&
    next.accountId === void 0 &&
    next.bestEffort === void 0 &&
    next.completionDestination === void 0 &&
    next.failureDestination === void 0
  )
    return;
  return next;
}
function mergeCronFailureAlert(existing, patch) {
  if (patch === false) return false;
  if (patch === void 0) return existing;
  const next = { ...(existing === false || existing === void 0 ? {} : existing) };
  if ("after" in patch) {
    const after = typeof patch.after === "number" && Number.isFinite(patch.after) ? patch.after : 0;
    next.after = after > 0 ? Math.floor(after) : void 0;
  }
  if ("channel" in patch) next.channel = normalizeOptionalString(patch.channel);
  if ("to" in patch) next.to = normalizeOptionalString(patch.to);
  if ("cooldownMs" in patch) {
    const cooldownMs =
      typeof patch.cooldownMs === "number" && Number.isFinite(patch.cooldownMs)
        ? patch.cooldownMs
        : -1;
    next.cooldownMs = cooldownMs >= 0 ? Math.floor(cooldownMs) : void 0;
  }
  if ("includeSkipped" in patch)
    next.includeSkipped = typeof patch.includeSkipped === "boolean" ? patch.includeSkipped : void 0;
  if ("mode" in patch) {
    const mode = normalizeOptionalString(patch.mode) ?? "";
    next.mode = mode === "announce" || mode === "webhook" ? mode : void 0;
  }
  if ("accountId" in patch) {
    const accountId = normalizeOptionalString(patch.accountId) ?? "";
    next.accountId = accountId ? accountId : void 0;
  }
  return next;
}
/** Returns whether a cron job should execute at `nowMs`, honoring force mode and active runs. */
function isJobDue(job, nowMs, opts) {
  if (!job.state) job.state = {};
  if (typeof job.state.runningAtMs === "number") return false;
  if (opts.forced) return true;
  return (
    isJobEnabled(job) &&
    hasScheduledNextRunAtMs(job.state.nextRunAtMs) &&
    nowMs >= job.state.nextRunAtMs
  );
}
/** Returns main-session queue text for system-event jobs, or undefined when empty/unsupported. */
function resolveJobPayloadTextForMain(job) {
  if (job.payload.kind !== "systemEvent") return;
  const text = normalizePayloadToSystemText(job.payload);
  return text.trim() ? text : void 0;
}
//#endregion
export {
  resolveJobErrorBackoffUntilMs as _,
  computeJobNextRunAtMs as a,
  resolveDeliveryTarget as b,
  errorBackoffMs as c,
  isJobDue as d,
  isJobEnabled as f,
  recordScheduleComputeError as g,
  recomputeNextRunsForMaintenance as h,
  assertSupportedJobSpec as i,
  findJobOrThrow as l,
  recomputeNextRuns as m,
  applyDeclarativeJobSpec as n,
  computeJobPreviousRunAtMs as o,
  nextWakeAtMs as p,
  applyJobPatch as r,
  createJob as s,
  DEFAULT_ERROR_BACKOFF_SCHEDULE_MS as t,
  hasScheduledNextRunAtMs as u,
  resolveJobLastRunStatus as v,
  resolveJobPayloadTextForMain as y,
};
