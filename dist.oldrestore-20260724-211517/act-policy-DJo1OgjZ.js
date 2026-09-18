import { r as DEFAULT_BROWSER_ACTION_TIMEOUT_MS } from "./constants-C2_ZjRRD.js";
import "./number-runtime-B-n-wjMn.js";
import {
  a as addTimerTimeoutGraceMs,
  d as clampPositiveTimerTimeoutMs,
  j as resolveTimerTimeoutMs,
  n as MAX_TIMER_TIMEOUT_MS,
  v as parseStrictInteger,
} from "./number-coercion-CJQ8TR--.js";
//#region extensions/browser/src/browser/act-policy.ts
/**
 * Browser action limits and timeout normalization.
 *
 * Shared by the tool schema and runtime action handlers so model-facing limits
 * and browser-control enforcement stay aligned.
 */
/** Maximum click delay accepted from model/tool input. */
const ACT_MAX_CLICK_DELAY_MS = 5e3;
/** Maximum explicit wait duration accepted from model/tool input. */
const ACT_MAX_WAIT_TIME_MS = 3e4;
/** Maximum viewport side length accepted by resize actions. */
const ACT_MAX_VIEWPORT_DIMENSION = 8192;
const ACT_MIN_TIMEOUT_MS = 500;
const ACT_MAX_INTERACTION_TIMEOUT_MS = 6e4;
const ACT_MAX_WAIT_TIMEOUT_MS = 12e4;
const ACT_DEFAULT_INTERACTION_TIMEOUT_MS = 8e3;
const ACT_DEFAULT_WAIT_TIMEOUT_MS = 2e4;
/** Grace between the runtime's action budget and an outer transport watchdog. */
const BROWSER_ACTION_TRANSPORT_SLACK_MS = 5e3;
function normalizeActBoundedNonNegativeMs(value, fieldName, maxMs) {
  if (value === void 0) return;
  if (!Number.isFinite(value) || value < 0) throw new Error(`${fieldName} must be >= 0`);
  const normalized = Math.floor(value);
  if (normalized > maxMs) throw new Error(`${fieldName} exceeds maximum of ${maxMs}ms`);
  return normalized;
}
/** Clamp interaction actions to the supported browser-control timeout window. */
function resolveActInteractionTimeoutMs(timeoutMs) {
  return Math.max(
    ACT_MIN_TIMEOUT_MS,
    Math.min(
      ACT_MAX_INTERACTION_TIMEOUT_MS,
      typeof timeoutMs === "number" && Number.isFinite(timeoutMs)
        ? Math.floor(timeoutMs)
        : ACT_DEFAULT_INTERACTION_TIMEOUT_MS,
    ),
  );
}
/** Clamp wait actions to their wider supported browser-control timeout window. */
function resolveActWaitTimeoutMs(timeoutMs) {
  return Math.max(
    ACT_MIN_TIMEOUT_MS,
    Math.min(
      ACT_MAX_WAIT_TIMEOUT_MS,
      typeof timeoutMs === "number" && Number.isFinite(timeoutMs)
        ? Math.floor(timeoutMs)
        : ACT_DEFAULT_WAIT_TIMEOUT_MS,
    ),
  );
}
function parseTimerInteger(value) {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.floor(value)
    : parseStrictInteger(value);
}
function resolveNonNegativeTimerMs(value) {
  const parsed = parseTimerInteger(value);
  return parsed !== void 0 && parsed >= 0 ? resolveTimerTimeoutMs(parsed, 0, 0) : 0;
}
function addExecutionBudgetMs(totalMs, nextMs) {
  return Math.min(MAX_TIMER_TIMEOUT_MS, totalMs + nextMs);
}
function multiplyExecutionBudgetMs(durationMs, count) {
  return Math.min(MAX_TIMER_TIMEOUT_MS, durationMs * count);
}
function resolveInteractionTimeoutMs(request) {
  return resolveActInteractionTimeoutMs(
    parseTimerInteger("timeoutMs" in request ? request.timeoutMs : void 0),
  );
}
function addNavigationGraceMs(durationMs, count = 1) {
  return addExecutionBudgetMs(durationMs, multiplyExecutionBudgetMs(250, count));
}
function isActionObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
function resolveLeafExecutionBudgetMs(request) {
  switch (request.kind) {
    case "click": {
      const timeoutMs = resolveInteractionTimeoutMs(request);
      const delayMs = Math.min(ACT_MAX_CLICK_DELAY_MS, resolveNonNegativeTimerMs(request.delayMs));
      return addNavigationGraceMs(
        delayMs > 0 ? addExecutionBudgetMs(timeoutMs * 2, delayMs) : timeoutMs,
      );
    }
    case "clickCoords": {
      const delayMs = Math.min(ACT_MAX_CLICK_DELAY_MS, resolveNonNegativeTimerMs(request.delayMs));
      return addNavigationGraceMs(
        addExecutionBudgetMs(
          clampPositiveTimerTimeoutMs(parseTimerInteger(request.timeoutMs)) ?? 0,
          multiplyExecutionBudgetMs(delayMs, request.doubleClick ? 3 : 1),
        ),
      );
    }
    case "type": {
      const phaseCount = (request.slowly ? 2 : 1) + (request.submit ? 1 : 0);
      return addNavigationGraceMs(
        multiplyExecutionBudgetMs(resolveInteractionTimeoutMs(request), phaseCount),
      );
    }
    case "press":
      return addNavigationGraceMs(resolveNonNegativeTimerMs(request.delayMs));
    case "fill": {
      const fieldCount = (Array.isArray(request.fields) ? request.fields : []).filter(
        (field) =>
          Boolean(field) &&
          typeof field === "object" &&
          typeof field.ref === "string" &&
          Boolean(field.ref.trim()),
      ).length;
      return addNavigationGraceMs(
        multiplyExecutionBudgetMs(resolveInteractionTimeoutMs(request), fieldCount),
        fieldCount,
      );
    }
    case "evaluate":
      return addNavigationGraceMs(resolveActWaitTimeoutMs(parseTimerInteger(request.timeoutMs)));
    case "scrollIntoView":
      return addNavigationGraceMs(resolveActWaitTimeoutMs(parseTimerInteger(request.timeoutMs)));
    case "hover":
    case "drag":
    case "select":
      return addNavigationGraceMs(resolveInteractionTimeoutMs(request));
    case "resize":
    case "close":
      return 0;
  }
  return 0;
}
function resolveExecutionBudgetMs(request) {
  if (request.kind === "batch")
    return (Array.isArray(request.actions) ? request.actions.filter(isActionObject) : []).reduce(
      (totalMs, action) => addExecutionBudgetMs(totalMs, resolveExecutionBudgetMs(action)),
      0,
    );
  if (request.kind !== "wait") return resolveLeafExecutionBudgetMs(request);
  const conditionCount = [
    Boolean(request.text),
    Boolean(request.textGone),
    typeof request.selector === "string" && Boolean(request.selector.trim()),
    typeof request.url === "string" && Boolean(request.url.trim()),
    Boolean(request.loadState),
    typeof request.fn === "string" && Boolean(request.fn.trim()),
  ].filter(Boolean).length;
  const timeoutMs = resolveActWaitTimeoutMs(parseTimerInteger(request.timeoutMs));
  return addExecutionBudgetMs(
    resolveNonNegativeTimerMs(request.timeMs),
    multiplyExecutionBudgetMs(timeoutMs, conditionCount),
  );
}
/**
 * Resolve the runtime budget before an outer transport watchdog is armed.
 * Wait phases and batch children execute serially, so maxima would abort valid work midway.
 */
function resolveBrowserActExecutionBudgetMs(request) {
  const executionBudgetMs = resolveExecutionBudgetMs(request);
  if (request.kind === "wait") return executionBudgetMs;
  return (request.kind === "batch"
    ? void 0
    : clampPositiveTimerTimeoutMs(
        parseTimerInteger("timeoutMs" in request ? request.timeoutMs : void 0),
      )) === void 0
    ? Math.max(DEFAULT_BROWSER_ACTION_TIMEOUT_MS, executionBudgetMs)
    : executionBudgetMs;
}
/** Add action transport slack once after the full sequential runtime budget is known. */
function resolveBrowserActRequestTimeoutMs(request) {
  return addTimerTimeoutGraceMs(resolveBrowserActExecutionBudgetMs(request), 5e3) ?? 1;
}
//#endregion
export {
  normalizeActBoundedNonNegativeMs as a,
  resolveBrowserActExecutionBudgetMs as c,
  BROWSER_ACTION_TRANSPORT_SLACK_MS as i,
  resolveBrowserActRequestTimeoutMs as l,
  ACT_MAX_VIEWPORT_DIMENSION as n,
  resolveActInteractionTimeoutMs as o,
  ACT_MAX_WAIT_TIME_MS as r,
  resolveActWaitTimeoutMs as s,
  ACT_MAX_CLICK_DELAY_MS as t,
};
