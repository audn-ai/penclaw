import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { l as secretRefKey } from "./ref-contract-DVV0zYUk.js";
import { t as assertExpectedResolvedSecretValue } from "./secret-value-BtpfhOEU.js";
import "./shared-CrrsbqCi.js";
import { s as coerceSecretRef } from "./types.secrets-BV0ywRAy.js";
//#region src/secrets/runtime-shared.ts
/**
 * Creates the mutable collection context used while preparing a secrets runtime snapshot.
 */
function createResolverContext(params) {
  return {
    sourceConfig: params.sourceConfig,
    env: params.env,
    cache: {},
    ...(params.manifestRegistry ? { manifestRegistry: params.manifestRegistry } : {}),
    warnings: [],
    warningKeys: /* @__PURE__ */ new Set(),
    assignments: [],
  };
}
/**
 * Records a SecretRef assignment that should be resolved and applied later.
 */
function pushAssignment(context, assignment) {
  context.assignments.push(assignment);
}
/**
 * Records a resolver warning once per code/path/message tuple.
 */
function pushWarning(context, warning) {
  const warningKey = `${warning.code}:${warning.path}:${warning.message}`;
  if (context.warningKeys.has(warningKey)) return;
  context.warningKeys.add(warningKey);
  context.warnings.push(warning);
}
/**
 * Emits the standard warning for refs configured on currently inactive surfaces.
 */
function pushInactiveSurfaceWarning(params) {
  pushWarning(params.context, {
    code: "SECRETS_REF_IGNORED_INACTIVE_SURFACE",
    path: params.path,
    message:
      params.details && params.details.trim().length > 0
        ? `${params.path}: ${params.details}`
        : `${params.path}: secret ref is configured on an inactive surface; skipping resolution until it becomes active.`,
  });
}
/**
 * Converts an inline SecretInput value into a deferred assignment when its surface is active.
 */
function collectSecretInputAssignment(params) {
  const ref = coerceSecretRef(params.value, params.defaults);
  if (!ref) return;
  if (params.active === false) {
    pushInactiveSurfaceWarning({
      context: params.context,
      path: params.path,
      details: params.inactiveReason,
    });
    return;
  }
  pushAssignment(params.context, {
    ref,
    path: params.path,
    expected: params.expected,
    apply: params.apply,
  });
}
/**
 * Applies resolved SecretRef values to their collected config targets with shape validation.
 */
function applyResolvedAssignments(params) {
  for (const assignment of params.assignments) {
    const key = secretRefKey(assignment.ref);
    if (!params.resolved.has(key))
      throw new Error(`Secret reference "${key}" resolved to no value.`);
    const value = params.resolved.get(key);
    assertExpectedResolvedSecretValue({
      value,
      expected: assignment.expected,
      errorMessage:
        assignment.expected === "string"
          ? `${assignment.path} resolved to a non-string or empty value.`
          : `${assignment.path} resolved to an unsupported value type.`,
    });
    assignment.apply(value);
  }
}
/**
 * Own-property helper used by config collectors that receive unknown object shapes.
 */
function hasOwnProperty(record, key) {
  return Object.hasOwn(record, key);
}
/**
 * Treats missing or non-object enabled state as enabled by default.
 */
function isEnabledFlag(value) {
  if (!isRecord(value)) return true;
  return value.enabled !== false;
}
/**
 * Returns whether both a channel and one account are enabled for secret resolution.
 */
function isChannelAccountEffectivelyEnabled(channel, account) {
  return isEnabledFlag(channel) && isEnabledFlag(account);
}
//#endregion
export {
  isChannelAccountEffectivelyEnabled as a,
  pushInactiveSurfaceWarning as c,
  hasOwnProperty as i,
  pushWarning as l,
  collectSecretInputAssignment as n,
  isEnabledFlag as o,
  createResolverContext as r,
  pushAssignment as s,
  applyResolvedAssignments as t,
};
