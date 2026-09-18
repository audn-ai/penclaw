//#region packages/retry/src/index.ts
const MAX_TIMER_TIMEOUT_MS = 2147e6;
function computeBackoff(policy, attempt) {
  const base = Math.min(policy.maxMs, policy.initialMs * policy.factor ** Math.max(attempt - 1, 0));
  const jitter = base * policy.jitter * Math.random();
  return Math.min(policy.maxMs, Math.round(base + jitter));
}
function computeBackoffSchedule(scheduleMs, attempt) {
  const index = Math.min(attempt - 1, scheduleMs.length - 1);
  return attempt <= 0 ? 0 : (scheduleMs[index] ?? 0);
}
async function sleepWithAbort(ms, abortSignal) {
  if (!Number.isFinite(ms) || ms <= 0) return;
  const delayMs = Math.min(Math.max(Math.floor(ms), 1), MAX_TIMER_TIMEOUT_MS);
  await new Promise((resolve, reject) => {
    let settled = false;
    let timer = null;
    const cleanup = () => abortSignal?.removeEventListener("abort", onAbort);
    const onAbort = () => {
      if (settled) return;
      settled = true;
      if (timer) clearTimeout(timer);
      timer = null;
      cleanup();
      reject(
        new Error("aborted", {
          cause: abortSignal?.reason ?? /* @__PURE__ */ new Error("aborted"),
        }),
      );
    };
    abortSignal?.addEventListener("abort", onAbort, { once: true });
    if (abortSignal?.aborted) {
      onAbort();
      return;
    }
    timer = setTimeout(() => {
      settled = true;
      cleanup();
      timer = null;
      resolve();
    }, delayMs);
    if (abortSignal?.aborted) onAbort();
  });
}
var RetrySupervisor = class {
  constructor(policy, maxAttempts = Number.POSITIVE_INFINITY) {
    this.policy = policy;
    this.maxAttempts = maxAttempts;
    this.attempts = 0;
    this.initialMs = policy.initialMs;
  }
  reset(initialMs = this.policy.initialMs) {
    this.cancel();
    this.attempts = 0;
    this.initialMs = initialMs;
    this.nextDelayOverrideMs = void 0;
  }
  cancel(reason = /* @__PURE__ */ new Error("retry cancelled")) {
    this.pendingAbort?.abort(reason);
    this.pendingAbort = void 0;
  }
  next(abortSignal) {
    const override = this.nextDelayOverrideMs;
    this.nextDelayOverrideMs = void 0;
    if (override === void 0 && ++this.attempts > Math.ceil(this.maxAttempts)) return;
    const attempt = Math.max(this.attempts, 1);
    const delayMs =
      override ??
      computeBackoff(
        {
          ...this.policy,
          initialMs: this.initialMs,
        },
        attempt,
      );
    this.cancel();
    const pendingAbort = new AbortController();
    this.pendingAbort = pendingAbort;
    return {
      attempt,
      delayMs,
      signal: abortSignal
        ? AbortSignal.any([pendingAbort.signal, abortSignal])
        : pendingAbort.signal,
    };
  }
};
const DEFAULT_RETRY_CONFIG = {
  attempts: 3,
  minDelayMs: 300,
  maxDelayMs: 3e4,
  jitter: 0,
};
const defaultSleep = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
function asFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : void 0;
}
function clampNumber(value, fallback, min, max) {
  const next = asFiniteNumber(value);
  if (next === void 0) return fallback;
  return Math.min(Math.max(next, min ?? Number.NEGATIVE_INFINITY), max ?? Number.POSITIVE_INFINITY);
}
function resolveAttemptCount(value, fallback) {
  return Math.max(1, Math.round(asFiniteNumber(value) ?? fallback));
}
function resolveRetryDelayMs(value) {
  const finite =
    value === Number.POSITIVE_INFINITY ? MAX_TIMER_TIMEOUT_MS : (asFiniteNumber(value) ?? 0);
  return Math.min(Math.max(Math.round(finite), 0), MAX_TIMER_TIMEOUT_MS);
}
function resolveJitterConfig(value, fallback) {
  if (value === "full") return "full";
  const fraction = asFiniteNumber(value);
  return fraction === void 0 ? fallback : Math.min(Math.max(fraction, 0), 1);
}
function resolveRetryConfig(defaults = DEFAULT_RETRY_CONFIG, overrides) {
  const attempts = resolveAttemptCount(overrides?.attempts, defaults.attempts);
  const minDelayMs = resolveRetryDelayMs(
    clampNumber(overrides?.minDelayMs, defaults.minDelayMs, 0),
  );
  return {
    attempts,
    minDelayMs,
    maxDelayMs: Math.max(
      minDelayMs,
      resolveRetryDelayMs(clampNumber(overrides?.maxDelayMs, defaults.maxDelayMs, 0)),
    ),
    jitter: resolveJitterConfig(overrides?.jitter, defaults.jitter),
  };
}
function applyJitter(delayMs, jitter, mode, random) {
  if (jitter === "full") {
    if (mode === "symmetric") return Math.max(0, Math.round(delayMs * (0.5 + random() * 0.5)));
    return Math.max(0, Math.ceil(delayMs * (1 + random())));
  }
  if (jitter <= 0) return mode === "positive" ? Math.ceil(delayMs) : delayMs;
  const fraction = random();
  const raw =
    delayMs * (1 + (mode === "positive" ? fraction * jitter : (fraction * 2 - 1) * jitter));
  return Math.max(0, mode === "positive" ? Math.ceil(raw) : Math.round(raw));
}
function toRetryError(value, fallbackMessage = "Non-Error thrown") {
  if (value instanceof Error) return value;
  if (typeof value === "string") return new Error(value);
  const error = new Error(fallbackMessage, { cause: value });
  if ((typeof value === "object" && value !== null) || typeof value === "function")
    Object.assign(error, value);
  return error;
}
function createRetryRunner(runtime = {}) {
  const runtimeSleep = runtime.sleep ?? defaultSleep;
  const runtimeRandom = runtime.random ?? Math.random;
  const createFailure =
    runtime.createFailure ??
    ((errors) => toRetryError(errors.at(-1) ?? /* @__PURE__ */ new Error("Retry failed")));
  return async function retryAsync(fn, attemptsOrOptions = 3, initialDelayMs = 300) {
    const attemptErrors = [];
    if (typeof attemptsOrOptions === "number") {
      const attempts = resolveAttemptCount(attemptsOrOptions, DEFAULT_RETRY_CONFIG.attempts);
      for (let index = 0; index < attempts; index += 1)
        try {
          return await fn();
        } catch (err) {
          attemptErrors.push(err);
          if (index === attempts - 1) break;
          await runtimeSleep(resolveRetryDelayMs(initialDelayMs * 2 ** index));
        }
      throw createFailure(attemptErrors);
    }
    const options = attemptsOrOptions;
    const resolved = resolveRetryConfig(DEFAULT_RETRY_CONFIG, options);
    const maxAttempts = resolved.attempts;
    const minDelayMs = resolved.minDelayMs;
    const maxDelayMs = resolved.maxDelayMs > 0 ? resolved.maxDelayMs : Number.POSITIVE_INFINITY;
    const retryAfterMaxDelayMs =
      options.retryAfterMaxDelayMs === void 0
        ? maxDelayMs
        : Math.max(
            minDelayMs,
            resolveRetryDelayMs(clampNumber(options.retryAfterMaxDelayMs, maxDelayMs, 0)),
          );
    const random = options.random ?? runtimeRandom;
    const sleep = options.sleep ?? runtimeSleep;
    const shouldRetry = options.shouldRetry ?? (() => true);
    for (let attempt = 1; attempt <= maxAttempts; attempt += 1)
      try {
        return await fn();
      } catch (err) {
        attemptErrors.push(err);
        if (attempt >= maxAttempts || !shouldRetry(err, attempt)) break;
        const context = {
          attempt,
          maxAttempts,
          err,
          label: options.label,
        };
        const retryAfterMs = options.retryAfterMs?.(err);
        const hasRetryAfter = typeof retryAfterMs === "number" && Number.isFinite(retryAfterMs);
        const configuredDelay =
          typeof options.delayMs === "function" ? options.delayMs(context) : options.delayMs;
        const resolvedConfiguredDelay =
          configuredDelay === void 0 ? void 0 : resolveRetryDelayMs(configuredDelay);
        const baseDelay = hasRetryAfter
          ? Math.max(retryAfterMs, minDelayMs)
          : resolvedConfiguredDelay === void 0
            ? minDelayMs * 2 ** (attempt - 1)
            : Math.max(resolvedConfiguredDelay, minDelayMs);
        const delayCap = hasRetryAfter ? retryAfterMaxDelayMs : maxDelayMs;
        let delay = Math.min(baseDelay, delayCap);
        const canHonorRetryAfter = hasRetryAfter && (retryAfterMs ?? 0) <= delayCap;
        const wantsPositiveDraw =
          resolved.jitter === "full" ? !hasRetryAfter || canHonorRetryAfter : canHonorRetryAfter;
        delay = applyJitter(
          delay,
          resolved.jitter,
          wantsPositiveDraw ? "positive" : "symmetric",
          random,
        );
        delay = Math.min(Math.max(delay, minDelayMs), delayCap);
        await options.onRetry?.({
          ...context,
          delayMs: delay,
        });
        if (delay > 0) await sleep(delay);
      }
    throw createFailure(attemptErrors);
  };
}
const retryAsync = createRetryRunner();
//#endregion
export {
  resolveRetryConfig as a,
  toRetryError as c,
  createRetryRunner as i,
  computeBackoff as n,
  retryAsync as o,
  computeBackoffSchedule as r,
  sleepWithAbort as s,
  RetrySupervisor as t,
};
