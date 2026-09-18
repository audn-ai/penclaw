import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { n as isNonEmptyString } from "./shared-CrrsbqCi.js";
//#region src/secrets/secret-value.ts
/** Validates resolved secret values against expected value shapes. */
/**
 * Returns whether a resolved provider value satisfies the target's accepted runtime shape.
 */
function isExpectedResolvedSecretValue(value, expected) {
  if (expected === "string") return isNonEmptyString(value);
  return isNonEmptyString(value) || isRecord(value);
}
/**
 * Returns whether an inline configured value should be treated as plaintext secret material.
 */
function hasConfiguredPlaintextSecretValue(value, expected) {
  if (expected === "string") return isNonEmptyString(value);
  return isNonEmptyString(value) || (isRecord(value) && Object.keys(value).length > 0);
}
/**
 * Throws a caller-provided error when a resolved secret value does not match its target shape.
 */
function assertExpectedResolvedSecretValue(params) {
  if (!isExpectedResolvedSecretValue(params.value, params.expected))
    throw new Error(params.errorMessage);
}
//#endregion
export {
  hasConfiguredPlaintextSecretValue as n,
  isExpectedResolvedSecretValue as r,
  assertExpectedResolvedSecretValue as t,
};
