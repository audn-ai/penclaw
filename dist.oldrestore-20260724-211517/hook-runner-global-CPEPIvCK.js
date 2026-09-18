import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import "./src-Bl7G9qvi.js";
import { n as resolveGlobalSingleton } from "./global-singleton-PwlQSEal.js";
import { r as logVerbose } from "./globals-CNUzHTcU.js";
import {
  d as clampPositiveTimerTimeoutMs,
  j as resolveTimerTimeoutMs,
} from "./number-coercion-CJQ8TR--.js";
import "./number-coercion-EqFmHmOw.js";
import { i as copyReplyPayloadMetadata } from "./reply-payload-BK_jICQ3.js";
import {
  V as isPluginRegistryRetired,
  t as collectLivePluginRegistries,
} from "./runtime-CcYnX0B4.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region src/plugins/hook-runner-global-state.ts
const hookRunnerGlobalStateKey = Symbol.for("openclaw.plugins.hook-runner-global-state");
function getHookRunnerGlobalState() {
  return resolveGlobalSingleton(hookRunnerGlobalStateKey, () => ({
    hookRunner: null,
    registry: null,
  }));
}
function collectHookRegistrySources(lastInitialized) {
  const ordered = [];
  const seen = /* @__PURE__ */ new Set();
  const add = (registry) => {
    if (!registry || seen.has(registry)) return;
    if (isPluginRegistryRetired(registry)) return;
    seen.add(registry);
    ordered.push(registry);
  };
  add(lastInitialized);
  for (const registry of collectLivePluginRegistries()) add(registry);
  return ordered;
}
function composeLiveHookRegistry(lastInitialized) {
  const sources = collectHookRegistrySources(lastInitialized);
  const ownerSourceIndexByPluginId = /* @__PURE__ */ new Map();
  const claimOwner = (pluginId, index) => {
    if (!ownerSourceIndexByPluginId.has(pluginId)) ownerSourceIndexByPluginId.set(pluginId, index);
  };
  const hookPluginIdsBySource = sources.map((registry) => {
    const ids = /* @__PURE__ */ new Set();
    for (const hook of registry.typedHooks) ids.add(hook.pluginId);
    for (const hook of registry.hooks) ids.add(hook.pluginId);
    return ids;
  });
  sources.forEach((registry, index) => {
    for (const plugin of registry.plugins)
      if (
        plugin.status === "loaded" &&
        expectDefined(hookPluginIdsBySource[index], "hook plugin ids by source entry at index").has(
          plugin.id,
        )
      )
        claimOwner(plugin.id, index);
  });
  sources.forEach((registry, index) => {
    for (const plugin of registry.plugins)
      if (plugin.status === "loaded") claimOwner(plugin.id, index);
  });
  sources.forEach((registry, index) => {
    for (const plugin of registry.plugins) claimOwner(plugin.id, index);
  });
  sources.forEach((registry, index) => {
    for (const hook of registry.typedHooks) claimOwner(hook.pluginId, index);
    for (const hook of registry.hooks) claimOwner(hook.pluginId, index);
  });
  const policyOwnerSourceIndexByPluginId = /* @__PURE__ */ new Map();
  const claimPolicyOwner = (pluginId, index) => {
    if (!policyOwnerSourceIndexByPluginId.has(pluginId))
      policyOwnerSourceIndexByPluginId.set(pluginId, index);
  };
  const trustedPolicyPluginIdsBySource = sources.map((registry) => {
    const ids = /* @__PURE__ */ new Set();
    for (const registration of registry.trustedToolPolicies ?? []) ids.add(registration.pluginId);
    return ids;
  });
  sources.forEach((registry, index) => {
    for (const plugin of registry.plugins)
      if (
        plugin.status === "loaded" &&
        expectDefined(
          trustedPolicyPluginIdsBySource[index],
          "trusted policy plugin ids by source entry at index",
        ).has(plugin.id)
      )
        claimPolicyOwner(plugin.id, index);
  });
  sources.forEach((registry, index) => {
    for (const plugin of registry.plugins)
      if (plugin.status === "loaded") claimPolicyOwner(plugin.id, index);
  });
  sources.forEach((registry, index) => {
    for (const plugin of registry.plugins) claimPolicyOwner(plugin.id, index);
  });
  sources.forEach((registry, index) => {
    for (const registration of registry.trustedToolPolicies ?? [])
      claimPolicyOwner(registration.pluginId, index);
  });
  const trustedToolPolicies = sources
    .flatMap((registry, index) =>
      (registry.trustedToolPolicies ?? []).filter(
        (registration) => policyOwnerSourceIndexByPluginId.get(registration.pluginId) === index,
      ),
    )
    .toSorted((left, right) => {
      return (left.origin === "bundled" ? 0 : 1) - (right.origin === "bundled" ? 0 : 1);
    });
  return {
    hooks: sources.flatMap((registry, index) =>
      registry.hooks.filter((hook) => ownerSourceIndexByPluginId.get(hook.pluginId) === index),
    ),
    typedHooks: sources.flatMap((registry, index) =>
      registry.typedHooks.filter((hook) => ownerSourceIndexByPluginId.get(hook.pluginId) === index),
    ),
    plugins: sources.flatMap((registry, index) =>
      registry.plugins.filter((plugin) => ownerSourceIndexByPluginId.get(plugin.id) === index),
    ),
    trustedToolPolicies,
  };
}
function createComposedHookRegistryFacade(state) {
  return {
    get hooks() {
      return composeLiveHookRegistry(state.registry).hooks;
    },
    get typedHooks() {
      return composeLiveHookRegistry(state.registry).typedHooks;
    },
    get plugins() {
      return composeLiveHookRegistry(state.registry).plugins;
    },
    get trustedToolPolicies() {
      return composeLiveHookRegistry(state.registry).trustedToolPolicies;
    },
  };
}
/** Get the composed registry that backs global hook dispatch. */
function getGlobalHookRunnerRegistry() {
  const state = getHookRunnerGlobalState();
  return state.registry ? createComposedHookRegistryFacade(state) : null;
}
//#endregion
//#region src/hooks/fire-and-forget.ts
const DEFAULT_MAX_CONCURRENT_FIRE_AND_FORGET_HOOKS = 16;
const DEFAULT_MAX_QUEUED_FIRE_AND_FORGET_HOOKS = 256;
const DEFAULT_FIRE_AND_FORGET_HOOK_TIMEOUT_MS = 2e3;
const MAX_HOOK_LOG_MESSAGE_LENGTH = 500;
const getFireAndForgetHookState = () =>
  resolveGlobalSingleton(Symbol.for("openclaw.fireAndForgetHookState"), () => ({
    active: 0,
    queue: [],
  }));
function positiveIntegerOrDefault(value, fallback) {
  return typeof value === "number" && Number.isInteger(value) && value > 0 ? value : fallback;
}
function resolveFireAndForgetHookTimeoutMs(value) {
  if (typeof value === "number" && Number.isInteger(value) && value > 0)
    return resolveTimerTimeoutMs(value, DEFAULT_FIRE_AND_FORGET_HOOK_TIMEOUT_MS);
  return resolveTimerTimeoutMs(DEFAULT_FIRE_AND_FORGET_HOOK_TIMEOUT_MS, 1);
}
function replaceLogControlCharacters(value) {
  let result = "";
  for (const char of value) {
    const codePoint = char.codePointAt(0);
    if (
      codePoint === void 0 ||
      codePoint <= 31 ||
      codePoint === 127 ||
      codePoint === 8232 ||
      codePoint === 8233
    ) {
      result += " ";
      continue;
    }
    result += char;
  }
  return result;
}
/** Format hook errors as bounded single-line log messages with secrets redacted upstream. */
function formatHookErrorForLog(err) {
  return truncateUtf16Safe(
    replaceLogControlCharacters(formatErrorMessage(err)).replace(/\s+/g, " ").trim() ||
      "unknown error",
    MAX_HOOK_LOG_MESSAGE_LENGTH,
  );
}
/** Run a hook promise without awaiting it, logging rejection safely. */
function fireAndForgetHook(task, label, logger = logVerbose) {
  task.catch((err) => {
    logger(`${label}: ${formatHookErrorForLog(err)}`);
  });
}
function runFireAndForgetHookJob(state, job, limits) {
  state.active += 1;
  let didLogTimeout = false;
  const timeout =
    job.timeoutMs > 0
      ? setTimeout(() => {
          didLogTimeout = true;
          job.logger(`${job.label}: timed out after ${job.timeoutMs}ms`);
        }, job.timeoutMs)
      : void 0;
  Promise.resolve()
    .then(job.task)
    .catch((err) => {
      if (!didLogTimeout) job.logger(`${job.label}: ${formatHookErrorForLog(err)}`);
    })
    .finally(() => {
      if (timeout) clearTimeout(timeout);
      state.active -= 1;
      drainFireAndForgetHookQueue(state, limits);
    });
}
function drainFireAndForgetHookQueue(state, limits) {
  while (state.active < limits.maxConcurrency) {
    const next = state.queue.shift();
    if (!next) return;
    runFireAndForgetHookJob(state, next, limits);
  }
}
/** Queue a fire-and-forget hook with bounded concurrency, queue depth, and timeout logs. */
function fireAndForgetBoundedHook(task, label, logger = logVerbose, options = {}) {
  const state = getFireAndForgetHookState();
  const maxConcurrency = positiveIntegerOrDefault(
    options.maxConcurrency,
    DEFAULT_MAX_CONCURRENT_FIRE_AND_FORGET_HOOKS,
  );
  const maxQueue = positiveIntegerOrDefault(
    options.maxQueue,
    DEFAULT_MAX_QUEUED_FIRE_AND_FORGET_HOOKS,
  );
  const timeoutMs = resolveFireAndForgetHookTimeoutMs(options.timeoutMs);
  if (state.active >= maxConcurrency && state.queue.length >= maxQueue) {
    logger(`${label}: queue full; dropping hook`);
    return;
  }
  state.queue.push({
    task,
    label,
    logger,
    timeoutMs,
  });
  drainFireAndForgetHookQueue(state, { maxConcurrency });
}
//#endregion
//#region src/shared/text/join-segments.ts
/** Concatenates two optional text blocks, preserving the right block's explicit empty string. */
function concatOptionalTextSegments(params) {
  const separator = params.separator ?? "\n\n";
  if (params.left && params.right) return `${params.left}${separator}${params.right}`;
  return params.right ?? params.left;
}
/** Joins non-empty string segments, optionally trimming each segment before presence checks. */
function joinPresentTextSegments(segments, options) {
  const separator = options?.separator ?? "\n\n";
  const trim = options?.trim ?? false;
  const values = [];
  for (const segment of segments) {
    if (typeof segment !== "string") continue;
    const normalized = trim ? segment.trim() : segment;
    if (!normalized) continue;
    values.push(normalized);
  }
  return values.length > 0 ? values.join(separator) : void 0;
}
//#endregion
//#region src/plugins/hook-decision-types.ts
/** Prefix for user-facing replacement messages when a `block` decision stops a request. */
const BLOCK_MESSAGE_PREFIX = "Your message could not be sent";
function resolveBlockMessage(decision, params = {}) {
  const message = typeof decision.message === "string" ? decision.message.trim() : "";
  const blockedBy = params.blockedBy?.trim();
  if (message)
    return blockedBy
      ? `${BLOCK_MESSAGE_PREFIX}: ${message} (blocked by ${blockedBy})`
      : `${BLOCK_MESSAGE_PREFIX}: ${message}`;
  return blockedBy
    ? `${BLOCK_MESSAGE_PREFIX}: blocked by ${blockedBy}`
    : `${BLOCK_MESSAGE_PREFIX}: blocked`;
}
/**
 * Type guard: does this object look like a HookDecision (has `outcome` field)?
 */
function isHookDecision(value) {
  if (typeof value !== "object" || value === null) return false;
  const v = value;
  const keys = Object.keys(v);
  if (v.outcome === "pass") return keys.length === 1;
  if (v.outcome !== "block") return false;
  const allowedBlockKeys = /* @__PURE__ */ new Set([
    "outcome",
    "reason",
    "message",
    "category",
    "metadata",
  ]);
  if (keys.some((key) => !allowedBlockKeys.has(key))) return false;
  if (typeof v.reason !== "string" || !v.reason.trim()) return false;
  if ("message" in v && (typeof v.message !== "string" || !v.message.trim())) return false;
  if ("category" in v && (typeof v.category !== "string" || !v.category.trim())) return false;
  if (
    "metadata" in v &&
    (typeof v.metadata !== "object" || v.metadata === null || Array.isArray(v.metadata))
  )
    return false;
  return true;
}
//#endregion
//#region src/plugins/hooks.ts
/**
 * Plugin Hook Runner
 *
 * Provides utilities for executing plugin lifecycle hooks with proper
 * error handling and priority ordering.
 */
const DEFAULT_VOID_HOOK_TIMEOUT_MS_BY_HOOK = {
  agent_end: 3e4,
  channel_pairing_requested: 2e3,
  before_compaction: 3e4,
  after_compaction: 3e4,
};
const DEFAULT_MODIFYING_HOOK_TIMEOUT_MS_BY_HOOK = {
  before_agent_run: 15e3,
  before_agent_start: 15e3,
  before_agent_finalize: 15e3,
  before_prompt_build: 15e3,
  message_sending: 15e3,
  reply_payload_sending: 15e3,
  resolve_exec_env: 15e3,
};
/**
 * Get hooks for a specific hook name, sorted by priority (higher first).
 */
function getHooksForName(registry, hookName) {
  return registry.typedHooks
    .filter((h) => h.hookName === hookName)
    .toSorted((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
}
function getHooksForNameAndPlugin(registry, hookName, pluginId) {
  return getHooksForName(registry, hookName).filter((hook) => hook.pluginId === pluginId);
}
/**
 * Create a hook runner for a specific registry.
 */
function createHookRunner(registry, options = {}) {
  const logger = options.logger;
  const catchErrors = options.catchErrors ?? true;
  const failurePolicyByHook = {
    before_agent_run: "fail-closed",
    ...options.failurePolicyByHook,
  };
  const voidHookTimeoutMsByHook = {
    ...DEFAULT_VOID_HOOK_TIMEOUT_MS_BY_HOOK,
    ...options.voidHookTimeoutMsByHook,
  };
  const modifyingHookTimeoutMsByHook = {
    ...DEFAULT_MODIFYING_HOOK_TIMEOUT_MS_BY_HOOK,
    ...options.modifyingHookTimeoutMsByHook,
  };
  const shouldCatchHookErrors = (hookName) =>
    catchErrors && (failurePolicyByHook[hookName] ?? "fail-open") === "fail-open";
  const firstDefined = (prev, next) => prev ?? next;
  const lastDefined = (prev, next) => next ?? prev;
  const stickyTrue = (prev, next) => (prev === true || next === true ? true : void 0);
  const toPluginReplyPayload = (payload) => {
    const { trustedLocalMedia: _trustedLocalMedia, ...visiblePayload } = payload;
    return structuredClone(visiblePayload);
  };
  const areMediaUrlArraysEqual = (left, right) => {
    const normalizedLeft = left ?? [];
    const normalizedRight = right ?? [];
    return (
      normalizedLeft.length === normalizedRight.length &&
      normalizedLeft.every((value, index) => value === normalizedRight[index])
    );
  };
  const preservesTrustedMediaRefs = (previous, next) => {
    return (
      previous.trustedLocalMedia === true &&
      previous.mediaUrl === next.mediaUrl &&
      areMediaUrlArraysEqual(previous.mediaUrls, next.mediaUrls)
    );
  };
  const acceptPluginReplyPayload = (previous, next) => {
    const { trustedLocalMedia: _trustedLocalMedia, ...safePayload } = next;
    const clonedPayload = structuredClone(safePayload);
    return copyReplyPayloadMetadata(
      previous,
      preservesTrustedMediaRefs(previous, clonedPayload)
        ? {
            ...clonedPayload,
            trustedLocalMedia: true,
          }
        : clonedPayload,
    );
  };
  const mergeBeforeModelResolve = (acc, next) => ({
    modelOverride: firstDefined(acc?.modelOverride, next.modelOverride),
    providerOverride: firstDefined(acc?.providerOverride, next.providerOverride),
  });
  const mergeBeforePromptBuild = (acc, next) => ({
    systemPrompt: firstDefined(acc?.systemPrompt, next.systemPrompt),
    prependContext: concatOptionalTextSegments({
      left: acc?.prependContext,
      right: next.prependContext,
    }),
    appendContext: concatOptionalTextSegments({
      left: acc?.appendContext,
      right: next.appendContext,
    }),
    prependSystemContext: concatOptionalTextSegments({
      left: acc?.prependSystemContext,
      right: next.prependSystemContext,
    }),
    appendSystemContext: concatOptionalTextSegments({
      left: acc?.appendSystemContext,
      right: next.appendSystemContext,
    }),
  });
  const mergeAgentTurnPrepare = (acc, next) => ({
    prependContext: concatOptionalTextSegments({
      left: acc?.prependContext,
      right: next.prependContext,
    }),
    appendContext: concatOptionalTextSegments({
      left: acc?.appendContext,
      right: next.appendContext,
    }),
  });
  const mergeBeforeAgentFinalize = (acc, next) => {
    const normalizeRetry = (retry) => {
      const instruction = typeof retry?.instruction === "string" ? retry.instruction.trim() : "";
      if (!instruction) return;
      return {
        ...retry,
        instruction,
      };
    };
    const readRetryCandidates = (result) => {
      if (!result || result.action !== "revise") return [];
      const candidateList = result.retryCandidates;
      if (Array.isArray(candidateList) && candidateList.length > 0)
        return candidateList
          .map((retry) => normalizeRetry(retry))
          .filter((retry) => retry !== void 0);
      const retry = normalizeRetry(result.retry);
      return retry ? [retry] : [];
    };
    const attachRetryCandidates = (result, candidates) => {
      if (result.action !== "revise" || candidates.length <= 1) return result;
      Object.defineProperty(result, "retryCandidates", {
        configurable: true,
        enumerable: false,
        value: candidates,
      });
      return result;
    };
    if (acc?.action === "finalize") return acc;
    if (next.action === "finalize")
      return {
        action: "finalize",
        reason: next.reason,
      };
    if (acc?.action === "revise" && next.action === "revise") {
      const retryCandidates = [...readRetryCandidates(acc), ...readRetryCandidates(next)];
      const retry = retryCandidates[0];
      return attachRetryCandidates(
        {
          action: "revise",
          reason: concatOptionalTextSegments({
            left: acc.reason,
            right: next.reason,
          }),
          ...(retry ? { retry } : {}),
        },
        retryCandidates,
      );
    }
    if (acc?.action === "revise") return acc;
    if (next.action === "revise") {
      const retry = normalizeRetry(next.retry);
      return {
        action: "revise",
        reason: next.reason,
        ...(retry ? { retry } : {}),
      };
    }
    return next.action === "continue"
      ? {
          action: "continue",
          reason: next.reason,
        }
      : (acc ?? next);
  };
  const mergeSubagentSpawningResult = (acc, next) => {
    if (acc?.status === "error") return acc;
    if (next.status === "error") return next;
    const deliveryOrigin = acc?.deliveryOrigin ?? next.deliveryOrigin;
    return {
      status: "ok",
      threadBindingReady: Boolean(acc?.threadBindingReady || next.threadBindingReady),
      ...(deliveryOrigin ? { deliveryOrigin } : {}),
    };
  };
  const mergeSubagentDeliveryTargetResult = (acc, next) => {
    if (acc?.origin) return acc;
    return next;
  };
  const handleHookError = (params) => {
    const msg = `[hooks] ${params.hookName} handler from ${params.pluginId} failed: ${formatHookErrorForLog(params.error)}`;
    if (shouldCatchHookErrors(params.hookName)) {
      logger?.error(msg);
      return;
    }
    throw new Error(msg, { cause: params.error });
  };
  const sanitizeHookError = (error) => {
    return formatErrorMessage(error).split("\n")[0]?.trim() || "unknown error";
  };
  const isPromiseLike = (value) => {
    if ((typeof value !== "object" && typeof value !== "function") || value === null) return false;
    return typeof value.then === "function";
  };
  const normalizePositiveTimeoutMs = (timeoutMs) => {
    return clampPositiveTimerTimeoutMs(timeoutMs);
  };
  const getVoidHookTimeoutMs = (hookName, hook) =>
    normalizePositiveTimeoutMs(hook.timeoutMs) ??
    normalizePositiveTimeoutMs(voidHookTimeoutMsByHook[hookName]);
  const getModifyingHookTimeoutMs = (hookName, hook) =>
    normalizePositiveTimeoutMs(hook.timeoutMs) ??
    normalizePositiveTimeoutMs(modifyingHookTimeoutMsByHook[hookName]);
  const getClaimingHookTimeoutMs = (hookName, hook) =>
    normalizePositiveTimeoutMs(hook.timeoutMs) ??
    normalizePositiveTimeoutMs(modifyingHookTimeoutMsByHook[hookName]);
  const withHookTimeout = async (promise, timeoutMs, optionsResult = {}) => {
    let timer;
    const timeout = new Promise((_, reject) => {
      timer = setTimeout(() => {
        reject(/* @__PURE__ */ new Error(`timed out after ${timeoutMs}ms`));
      }, timeoutMs);
      if (optionsResult.unref) timer.unref?.();
    });
    try {
      return await Promise.race([promise, timeout]);
    } finally {
      if (timer) clearTimeout(timer);
    }
  };
  const runSyncHookHandler = (hook, event, ctx) => {
    const handler = hook.handler;
    return handler(event, ctx);
  };
  /**
   * Run a hook that doesn't return a value (fire-and-forget style).
   * All handlers are executed in parallel for performance.
   */
  async function runVoidHook(hookName, event, ctx, optionsValue = {}) {
    const hooks = getHooksForName(registry, hookName);
    if (hooks.length === 0) return;
    logger?.debug?.(`[hooks] running ${hookName} (${hooks.length} handlers)`);
    const promises = hooks.map(async (hook) => {
      try {
        const promise = Promise.resolve(hook.handler(event, ctx));
        const timeoutMs = getVoidHookTimeoutMs(hookName, hook);
        if (timeoutMs)
          await withHookTimeout(promise, timeoutMs, { unref: optionsValue.unrefTimeout ?? true });
        else await promise;
      } catch (err) {
        handleHookError({
          hookName,
          pluginId: hook.pluginId,
          error: err,
        });
      }
    });
    await Promise.all(promises);
  }
  /**
   * Run a hook that can return a modifying result.
   * Handlers are executed sequentially in priority order, and results are merged.
   */
  async function runModifyingHook(hookName, event, ctx, policy = {}) {
    const hooks = getHooksForName(registry, hookName);
    if (hooks.length === 0) return;
    logger?.debug?.(`[hooks] running ${hookName} (${hooks.length} handlers, sequential)`);
    let result;
    for (const hook of hooks)
      try {
        const handler = hook.handler;
        const promise = Promise.resolve(handler(event, ctx));
        const timeoutMs = getModifyingHookTimeoutMs(hookName, hook);
        const handlerResult = timeoutMs ? await withHookTimeout(promise, timeoutMs) : await promise;
        if (handlerResult !== void 0 && (handlerResult !== null || policy.mergeNullResults)) {
          if (policy.mergeResults) result = policy.mergeResults(result, handlerResult, hook);
          else result = handlerResult;
          if (result && policy.shouldStop?.(result)) {
            const terminalLabel = policy.terminalLabel ? ` ${policy.terminalLabel}` : "";
            const priority = hook.priority ?? 0;
            logger?.debug?.(
              `[hooks] ${hookName}${terminalLabel} decided by ${hook.pluginId} (priority=${priority}); skipping remaining handlers`,
            );
            policy.onTerminal?.({
              hookName,
              pluginId: hook.pluginId,
              result,
            });
            break;
          }
        }
      } catch (err) {
        handleHookError({
          hookName,
          pluginId: hook.pluginId,
          error: err,
        });
      }
    return result;
  }
  /**
   * Run a sequential claim hook where the first `{ handled: true }` result wins.
   */
  async function runClaimingHook(hookName, event, ctx) {
    const hooks = getHooksForName(registry, hookName);
    if (hooks.length === 0) return;
    logger?.debug?.(`[hooks] running ${hookName} (${hooks.length} handlers, first-claim wins)`);
    return await runClaimingHooksList(hooks, hookName, event, ctx);
  }
  async function runClaimingHookForPlugin(hookName, pluginId, event, ctx) {
    const hooks = getHooksForNameAndPlugin(registry, hookName, pluginId);
    if (hooks.length === 0) return;
    logger?.debug?.(
      `[hooks] running ${hookName} for ${pluginId} (${hooks.length} handlers, targeted)`,
    );
    return await runClaimingHooksList(hooks, hookName, event, ctx);
  }
  async function runClaimingHooksList(hooks, hookName, event, ctx) {
    for (const hook of hooks)
      try {
        const promise = Promise.resolve(hook.handler(event, ctx));
        const timeoutMs = getClaimingHookTimeoutMs(hookName, hook);
        const handlerResult = timeoutMs ? await withHookTimeout(promise, timeoutMs) : await promise;
        if (handlerResult?.handled) return handlerResult;
      } catch (err) {
        handleHookError({
          hookName,
          pluginId: hook.pluginId,
          error: err,
        });
      }
  }
  async function runClaimingHookForPluginOutcome(hookName, pluginId, event, ctx) {
    if (!registry.plugins.some((plugin) => plugin.id === pluginId && plugin.status === "loaded"))
      return { status: "missing_plugin" };
    const hooks = getHooksForNameAndPlugin(registry, hookName, pluginId);
    if (hooks.length === 0) return { status: "no_handler" };
    logger?.debug?.(
      `[hooks] running ${hookName} for ${pluginId} (${hooks.length} handlers, targeted outcome)`,
    );
    let firstError = null;
    for (const hook of hooks)
      try {
        const promise = Promise.resolve(hook.handler(event, ctx));
        const timeoutMs = getClaimingHookTimeoutMs(hookName, hook);
        const handlerResult = timeoutMs ? await withHookTimeout(promise, timeoutMs) : await promise;
        if (handlerResult?.handled)
          return {
            status: "handled",
            result: handlerResult,
          };
      } catch (err) {
        firstError ??= sanitizeHookError(err);
        handleHookError({
          hookName,
          pluginId: hook.pluginId,
          error: err,
        });
      }
    if (firstError)
      return {
        status: "error",
        error: firstError,
      };
    return { status: "declined" };
  }
  function withAgentRunId(event, ctx) {
    if (event.runId || !ctx.runId) return event;
    return {
      ...event,
      runId: ctx.runId,
    };
  }
  /**
   * Run before_model_resolve hook.
   * Allows plugins to override provider/model before model resolution.
   */
  async function runBeforeModelResolve(event, ctx) {
    return runModifyingHook("before_model_resolve", event, ctx, {
      mergeResults: mergeBeforeModelResolve,
    });
  }
  /**
   * Run before_prompt_build hook.
   * Allows plugins to inject context and system prompt before prompt submission.
   */
  async function runBeforePromptBuild(event, ctx) {
    return runModifyingHook("before_prompt_build", event, ctx, {
      mergeResults: mergeBeforePromptBuild,
    });
  }
  async function runAgentTurnPrepare(event, ctx) {
    return runModifyingHook("agent_turn_prepare", event, ctx, {
      mergeResults: mergeAgentTurnPrepare,
    });
  }
  /**
   * @deprecated Use runBeforeModelResolve and runBeforePromptBuild.
   *
   * Run before_agent_start hook.
   * Legacy compatibility hook that combines model resolve + prompt build phases.
   */
  async function runBeforeAgentStart(event, ctx) {
    return runModifyingHook("before_agent_start", withAgentRunId(event, ctx), ctx, {
      mergeResults: (acc, next) => ({
        ...mergeBeforePromptBuild(acc, next),
        ...mergeBeforeModelResolve(acc, next),
      }),
    });
  }
  /**
   * Run before_agent_reply hook.
   * Allows plugins to intercept messages and return a synthetic reply,
   * short-circuiting the LLM agent. First handler to return { handled: true } wins.
   */
  async function runBeforeAgentReply(event, ctx) {
    return runClaimingHook("before_agent_reply", event, ctx);
  }
  /**
   * Run model_call_started hook.
   * Allows plugins to observe sanitized model-call metadata.
   * Runs in parallel (fire-and-forget).
   */
  async function runModelCallStarted(event, ctx) {
    return runVoidHook("model_call_started", event, ctx);
  }
  /**
   * Run model_call_ended hook.
   * Allows plugins to observe sanitized terminal model-call metadata.
   * Runs in parallel (fire-and-forget).
   */
  async function runModelCallEnded(event, ctx) {
    return runVoidHook("model_call_ended", event, ctx);
  }
  /**
   * Run agent_end hook.
   * Allows plugins to analyze completed conversations.
   * Runs handlers in parallel.
   */
  async function runAgentEnd(event, ctx, optionsLocal) {
    return runVoidHook("agent_end", withAgentRunId(event, ctx), ctx, optionsLocal);
  }
  /**
   * Run llm_input hook.
   * Allows plugins to observe the exact input payload sent to the LLM.
   * Runs in parallel (fire-and-forget).
   */
  async function runLlmInput(event, ctx) {
    return runVoidHook("llm_input", event, ctx);
  }
  /**
   * Run llm_output hook.
   * Allows plugins to observe the exact output payload returned by the LLM.
   * Runs in parallel (fire-and-forget).
   */
  async function runLlmOutput(event, ctx) {
    return runVoidHook("llm_output", event, ctx);
  }
  /**
   * Run before_agent_finalize hook.
   * Allows plugins to request one more model pass before a natural final reply
   * is accepted. This is not the user-facing /stop cancellation path.
   */
  async function runBeforeAgentFinalize(event, ctx) {
    return runModifyingHook("before_agent_finalize", withAgentRunId(event, ctx), ctx, {
      mergeResults: mergeBeforeAgentFinalize,
    });
  }
  /**
   * Run before_compaction hook.
   */
  async function runBeforeCompaction(event, ctx) {
    return runVoidHook("before_compaction", event, ctx);
  }
  /**
   * Run after_compaction hook.
   */
  async function runAfterCompaction(event, ctx) {
    return runVoidHook("after_compaction", event, ctx);
  }
  /**
   * Run before_reset hook.
   * Fired when /new or /reset clears a session, before messages are lost.
   * Runs in parallel (fire-and-forget).
   */
  async function runBeforeReset(event, ctx) {
    return runVoidHook("before_reset", event, ctx);
  }
  /**
   * Run inbound_claim hook.
   * Allows plugins to claim an inbound event before commands/agent dispatch.
   */
  async function runInboundClaim(event, ctx) {
    return runClaimingHook("inbound_claim", event, ctx);
  }
  async function runInboundClaimForPlugin(pluginId, event, ctx) {
    return runClaimingHookForPlugin("inbound_claim", pluginId, event, ctx);
  }
  async function runInboundClaimForPluginOutcome(pluginId, event, ctx) {
    return runClaimingHookForPluginOutcome("inbound_claim", pluginId, event, ctx);
  }
  /**
   * Run message_received hook.
   * Runs in parallel (fire-and-forget).
   */
  async function runMessageReceived(event, ctx) {
    return runVoidHook("message_received", event, ctx);
  }
  /**
   * Run channel_pairing_requested hook.
   * Observation-only; slow/failing handlers must not block pairing flow.
   */
  async function runChannelPairingRequested(event, ctx) {
    return runVoidHook("channel_pairing_requested", event, ctx);
  }
  /**
   * Run before_dispatch hook.
   * Allows plugins to inspect or handle a message before model dispatch.
   * First handler returning { handled: true } wins.
   */
  async function runBeforeDispatch(event, ctx) {
    return runClaimingHook("before_dispatch", event, ctx);
  }
  /**
   * Run reply_dispatch hook.
   * Allows plugins to own reply dispatch before the default model path runs.
   * First handler returning { handled: true } wins.
   */
  async function runReplyDispatch(event, ctx) {
    return runClaimingHook("reply_dispatch", event, ctx);
  }
  /**
   * Run reply_payload_sending hook.
   * Allows plugins to modify or cancel normalized reply payloads before delivery.
   * Runs sequentially, passing each handler the latest payload.
   */
  async function runReplyPayloadSending(event, ctx) {
    const hooks = getHooksForName(registry, "reply_payload_sending");
    if (hooks.length === 0) return;
    logger?.debug?.(`[hooks] running reply_payload_sending (${hooks.length} handlers, sequential)`);
    let currentPayload = event.payload;
    let result;
    for (const hook of hooks)
      try {
        const handler = hook.handler;
        const promise = Promise.resolve(
          handler(
            {
              ...event,
              payload: toPluginReplyPayload(currentPayload),
            },
            ctx,
          ),
        );
        const timeoutMs = getModifyingHookTimeoutMs("reply_payload_sending", hook);
        const handlerResult = timeoutMs ? await withHookTimeout(promise, timeoutMs) : await promise;
        if (!handlerResult) continue;
        if (handlerResult.payload !== void 0)
          currentPayload = acceptPluginReplyPayload(currentPayload, handlerResult.payload);
        result = {
          payload: currentPayload,
          cancel: stickyTrue(result?.cancel, handlerResult.cancel),
          reason: lastDefined(result?.reason, handlerResult.reason),
        };
        if (result.cancel === true) {
          const priority = hook.priority ?? 0;
          logger?.debug?.(
            `[hooks] reply_payload_sending cancel=true decided by ${hook.pluginId} (priority=${priority}); skipping remaining handlers`,
          );
          break;
        }
      } catch (err) {
        handleHookError({
          hookName: "reply_payload_sending",
          pluginId: hook.pluginId,
          error: err,
        });
      }
    return result;
  }
  /**
   * Run message_sending hook.
   * Allows plugins to modify or cancel outgoing messages.
   * Runs sequentially.
   */
  async function runMessageSending(event, ctx) {
    return runModifyingHook("message_sending", event, ctx, {
      mergeResults: (acc, next) => {
        if (acc?.cancel === true) return acc;
        return {
          content: lastDefined(acc?.content, next.content),
          cancel: stickyTrue(acc?.cancel, next.cancel),
          cancelReason: lastDefined(acc?.cancelReason, next.cancelReason),
          metadata: next.metadata ?? acc?.metadata,
        };
      },
      shouldStop: (result) => result.cancel === true,
      terminalLabel: "cancel=true",
    });
  }
  /**
   * Run message_sent hook.
   * Runs in parallel (fire-and-forget).
   */
  async function runMessageSent(event, ctx) {
    return runVoidHook("message_sent", event, ctx);
  }
  /**
   * Run before_agent_run gate hook.
   * Fires after session resolution and workspace preparation, before model inference.
   * Returns the most-restrictive pass/block decision from all handlers.
   * Handlers that return void are treated as pass.
   */
  async function runBeforeAgentRun(event, ctx) {
    let winningPluginId;
    const decision = await runModifyingHook("before_agent_run", event, ctx, {
      mergeResults: (_acc, next, reg) => {
        if (next === void 0 || next === null) {
          const normalized = {
            outcome: "block",
            reason: "before_agent_run returned an invalid decision",
          };
          winningPluginId = reg.pluginId;
          return normalized;
        }
        const normalized = isHookDecision(next)
          ? next
          : {
              outcome: "block",
              reason: "before_agent_run returned an invalid decision",
            };
        const merged =
          !_acc || (normalized.outcome === "block" && _acc.outcome !== "block") ? normalized : _acc;
        if (merged === normalized) winningPluginId = reg.pluginId;
        return merged;
      },
      mergeNullResults: true,
      shouldStop: (result) => result?.outcome === "block",
      terminalLabel: "gate-decision",
    });
    if (!decision) return;
    return {
      decision,
      pluginId: winningPluginId ?? "unknown",
    };
  }
  /**
   * Run before_tool_call hook.
   * Allows plugins to modify or block tool calls.
   * Runs sequentially.
   */
  async function runBeforeToolCall(event, ctx) {
    return runModifyingHook("before_tool_call", event, ctx, {
      mergeResults: (acc, next, reg) => {
        if (acc?.block === true) return acc;
        const approvalPluginId = acc?.requireApproval?.pluginId;
        return {
          params:
            Boolean(approvalPluginId) && approvalPluginId !== reg.pluginId
              ? acc?.params
              : lastDefined(acc?.params, next.params),
          block: stickyTrue(acc?.block, next.block),
          blockReason: lastDefined(acc?.blockReason, next.blockReason),
          requireApproval:
            acc?.requireApproval ??
            (next.requireApproval
              ? {
                  ...next.requireApproval,
                  pluginId: reg.pluginId,
                }
              : void 0),
        };
      },
      shouldStop: (result) => result.block === true,
      terminalLabel: "block=true",
    });
  }
  /**
   * Run after_tool_call hook.
   * Runs in parallel (fire-and-forget).
   */
  async function runAfterToolCall(event, ctx) {
    return runVoidHook("after_tool_call", event, ctx);
  }
  /**
   * Run tool_result_persist hook.
   *
   * This hook is intentionally synchronous: it runs in hot paths where session
   * transcripts are appended synchronously.
   *
   * Handlers are executed sequentially in priority order (higher first). Each
   * handler may return `{ message }` to replace the message passed to the next
   * handler.
   */
  function runToolResultPersist(event, ctx) {
    const hooks = getHooksForName(registry, "tool_result_persist");
    if (hooks.length === 0) return;
    let current = event.message;
    for (const hook of hooks)
      try {
        const out = runSyncHookHandler(
          hook,
          {
            ...event,
            message: current,
          },
          ctx,
        );
        if (isPromiseLike(out)) {
          const msg = `[hooks] tool_result_persist handler from ${hook.pluginId} returned a Promise; this hook is synchronous and the result was ignored.`;
          if (shouldCatchHookErrors("tool_result_persist")) {
            logger?.warn?.(msg);
            continue;
          }
          throw new Error(msg);
        }
        const next = out?.message;
        if (next) current = next;
      } catch (err) {
        const msg = `[hooks] tool_result_persist handler from ${hook.pluginId} failed: ${String(err)}`;
        if (shouldCatchHookErrors("tool_result_persist")) logger?.error(msg);
        else throw new Error(msg, { cause: err });
      }
    return { message: current };
  }
  /**
   * Run before_message_write hook.
   *
   * This hook is intentionally synchronous: it runs on the hot path where
   * session transcripts are appended synchronously.
   *
   * Handlers are executed sequentially in priority order (higher first).
   * If any handler returns { block: true }, the message is NOT written
   * to the session JSONL and we return immediately.
   * If a handler returns { message }, the modified message replaces the
   * original for subsequent handlers and the final write.
   */
  function runBeforeMessageWrite(event, ctx) {
    const hooks = getHooksForName(registry, "before_message_write");
    if (hooks.length === 0) return;
    let current = event.message;
    for (const hook of hooks)
      try {
        const out = runSyncHookHandler(
          hook,
          {
            ...event,
            message: current,
          },
          ctx,
        );
        if (isPromiseLike(out)) {
          const msg = `[hooks] before_message_write handler from ${hook.pluginId} returned a Promise; this hook is synchronous and the result was ignored.`;
          if (shouldCatchHookErrors("before_message_write")) {
            logger?.warn?.(msg);
            continue;
          }
          throw new Error(msg);
        }
        const result = out;
        if (result?.block) return { block: true };
        if (result?.message) current = result.message;
      } catch (err) {
        const msg = `[hooks] before_message_write handler from ${hook.pluginId} failed: ${String(err)}`;
        if (shouldCatchHookErrors("before_message_write")) logger?.error(msg);
        else throw new Error(msg, { cause: err });
      }
    if (current !== event.message) return { message: current };
  }
  /**
   * Run session_start hook.
   * Runs in parallel (fire-and-forget).
   */
  async function runSessionStart(event, ctx) {
    return runVoidHook("session_start", event, ctx);
  }
  /**
   * Run session_end hook.
   * Runs in parallel (fire-and-forget).
   */
  async function runSessionEnd(event, ctx) {
    return runVoidHook("session_end", event, ctx);
  }
  /**
   * @deprecated Core prepares thread-bound subagent bindings through channel
   * session-binding adapters before subagent_spawned fires. This remains only
   * for older plugins that call the hook runner directly.
   */
  async function runSubagentSpawning(event, ctx) {
    return runModifyingHook("subagent_spawning", event, ctx, {
      mergeResults: mergeSubagentSpawningResult,
    });
  }
  /**
   * Run subagent_delivery_target hook.
   * Runs sequentially so channel plugins can deterministically resolve routing.
   */
  async function runSubagentDeliveryTarget(event, ctx) {
    return runModifyingHook("subagent_delivery_target", event, ctx, {
      mergeResults: mergeSubagentDeliveryTargetResult,
    });
  }
  /**
   * Run subagent_spawned hook.
   * Runs in parallel (fire-and-forget).
   */
  async function runSubagentSpawned(event, ctx) {
    return runVoidHook("subagent_spawned", event, ctx);
  }
  /**
   * Run subagent_ended hook.
   * Runs in parallel (fire-and-forget).
   */
  async function runSubagentEnded(event, ctx) {
    return runVoidHook("subagent_ended", event, ctx);
  }
  /**
   * Run gateway_start hook.
   * Runs in parallel (fire-and-forget).
   */
  async function runGatewayStart(event, ctx) {
    return runVoidHook("gateway_start", event, ctx);
  }
  /**
   * Run gateway_stop hook.
   * Runs in parallel (fire-and-forget).
   */
  async function runGatewayStop(event, ctx) {
    return runVoidHook("gateway_stop", event, ctx);
  }
  async function runHeartbeatPromptContribution(event, ctx) {
    return runModifyingHook("heartbeat_prompt_contribution", event, ctx, {
      mergeResults: mergeAgentTurnPrepare,
    });
  }
  /**
   * Run cron_reconciled after the Gateway scheduler reaches a complete state.
   */
  async function runCronReconciled(event, ctx) {
    return runVoidHook("cron_reconciled", event, ctx);
  }
  /**
   * Run cron_changed hook for gateway-owned cron lifecycle changes.
   */
  async function runCronChanged(event, ctx) {
    return runVoidHook("cron_changed", event, ctx);
  }
  /**
   * Run before_install hook.
   * Allows plugins to augment scan findings or block installs.
   * Runs sequentially so higher-priority hooks can block before lower ones run.
   */
  async function runBeforeInstall(event, ctx) {
    return runModifyingHook("before_install", event, ctx, {
      mergeResults: (acc, next) => {
        if (acc?.block === true) return acc;
        const mergedFindings = [...(acc?.findings ?? []), ...(next.findings ?? [])];
        return {
          findings: mergedFindings.length > 0 ? mergedFindings : void 0,
          block: stickyTrue(acc?.block, next.block),
          blockReason: lastDefined(acc?.blockReason, next.blockReason),
        };
      },
      shouldStop: (result) => result.block === true,
      terminalLabel: "block=true",
    });
  }
  async function runResolveExecEnv(event, ctx) {
    return (
      (await runModifyingHook("resolve_exec_env", event, ctx, {
        mergeResults: (acc, next) =>
          acc
            ? {
                ...acc,
                ...next,
              }
            : next,
      })) ?? {}
    );
  }
  function hasHooks(hookName) {
    return registry.typedHooks.some((h) => h.hookName === hookName);
  }
  /**
   * Get count of registered hooks for a given hook name.
   */
  function getHookCount(hookName) {
    return registry.typedHooks.filter((h) => h.hookName === hookName).length;
  }
  return {
    runBeforeModelResolve,
    runAgentTurnPrepare,
    runBeforePromptBuild,
    runBeforeAgentStart,
    runBeforeAgentReply,
    runModelCallStarted,
    runModelCallEnded,
    runLlmInput,
    runLlmOutput,
    runBeforeAgentFinalize,
    runAgentEnd,
    runBeforeCompaction,
    runAfterCompaction,
    runBeforeReset,
    runBeforeAgentRun,
    runInboundClaim,
    runInboundClaimForPlugin,
    runInboundClaimForPluginOutcome,
    runChannelPairingRequested,
    runMessageReceived,
    runBeforeDispatch,
    runReplyDispatch,
    runReplyPayloadSending,
    runMessageSending,
    runMessageSent,
    runBeforeToolCall,
    runAfterToolCall,
    runToolResultPersist,
    runBeforeMessageWrite,
    runSessionStart,
    runSessionEnd,
    runSubagentSpawning,
    runSubagentDeliveryTarget,
    runSubagentSpawned,
    runSubagentEnded,
    runGatewayStart,
    runGatewayStop,
    runHeartbeatPromptContribution,
    runCronReconciled,
    runCronChanged,
    runBeforeInstall,
    runResolveExecEnv,
    hasHooks,
    getHookCount,
  };
}
//#endregion
//#region src/plugins/hook-runner-global.ts
/**
 * Global Plugin Hook Runner
 *
 * Singleton hook runner that's initialized when plugins are loaded
 * and can be called from anywhere in the codebase.
 *
 * The runner is created once and resolves hooks live on every dispatch from a
 * composed view of the registries that are currently live: the most recently
 * initialized registry, the active registry, and the pinned channel/http-route
 * surfaces. Freezing one registry caused scoped mid-run activations (harness
 * and memory ensures) to rebind the runner to a narrow registry and silently
 * drop other plugins' tool-call hooks (#91918). Composing live also preserves
 * the older contract that hooks pushed into a registry after initialization
 * (e.g. the SDK `addTestHook` helper) dispatch immediately.
 */
const getLog = () => createSubsystemLogger("plugins");
/**
 * Initialize the global hook runner with a plugin registry.
 * Called on every plugin registry activation and by SDK consumers. The runner
 * instance stays stable so references captured mid-run keep seeing current
 * hooks; the passed registry becomes the highest-precedence composition source.
 */
function initializeGlobalHookRunner(registry) {
  const state = getHookRunnerGlobalState();
  const log = getLog();
  state.registry = registry;
  if (!state.hookRunner)
    state.hookRunner = createHookRunner(createComposedHookRegistryFacade(state), {
      logger: {
        debug: (msg) => log.debug(msg),
        warn: (msg) => log.warn(msg),
        error: (msg) => log.error(msg),
      },
      catchErrors: true,
      failurePolicyByHook: {
        before_agent_run: "fail-closed",
        before_install: "fail-closed",
        before_tool_call: "fail-closed",
      },
    });
  const hookCount = registry.hooks.length;
  if (hookCount > 0) log.debug(`hook runner initialized with ${hookCount} registered hooks`);
}
/**
 * Get the global hook runner.
 * Returns null if plugins haven't been loaded yet.
 */
function getGlobalHookRunner() {
  return getHookRunnerGlobalState().hookRunner;
}
/**
 * Get the registry from the most recent activation or explicit initialization.
 * Returns null if plugins haven't been loaded yet. Hook dispatch does not use
 * this single registry; the runner resolves hooks from the live composed view.
 */
function getGlobalPluginRegistry() {
  return getHookRunnerGlobalState().registry;
}
/**
 * Check if any hooks are registered for a given hook name.
 */
function hasGlobalHooks(hookName) {
  return getHookRunnerGlobalState().hookRunner?.hasHooks(hookName) ?? false;
}
async function runGlobalGatewayStopSafely(params) {
  const log = getLog();
  const hookRunner = getGlobalHookRunner();
  if (!hookRunner?.hasHooks("gateway_stop")) return;
  try {
    await hookRunner.runGatewayStop(params.event, params.ctx);
  } catch (err) {
    if (params.onError) {
      params.onError(err);
      return;
    }
    log.warn(`gateway_stop hook failed: ${String(err)}`);
  }
}
/**
 * Reset the global hook runner (for testing).
 */
function resetGlobalHookRunner() {
  const state = getHookRunnerGlobalState();
  state.hookRunner = null;
  state.registry = null;
}
//#endregion
export {
  resetGlobalHookRunner as a,
  joinPresentTextSegments as c,
  formatHookErrorForLog as d,
  getGlobalHookRunnerRegistry as f,
  initializeGlobalHookRunner as i,
  fireAndForgetBoundedHook as l,
  getGlobalPluginRegistry as n,
  runGlobalGatewayStopSafely as o,
  hasGlobalHooks as r,
  resolveBlockMessage as s,
  getGlobalHookRunner as t,
  fireAndForgetHook as u,
};
