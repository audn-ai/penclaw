//#region src/infra/outbound/target-errors.ts
/**
 * Formats the user-facing error shown when no target is available.
 */
function missingTargetMessage(provider, hint) {
  return `Delivering to ${provider} requires target${formatTargetHint(hint)}`;
}
/**
 * Builds an Error for missing outbound target failures.
 */
function missingTargetError(provider, hint) {
  return new Error(missingTargetMessage(provider, hint));
}
/**
 * Formats the user-facing error shown when a target name resolves ambiguously.
 */
function ambiguousTargetMessage(provider, raw, hint) {
  return `Ambiguous target "${raw}" for ${provider}. Provide a unique name or an explicit id.${formatTargetHint(hint, true)}`;
}
/**
 * Builds an Error for ambiguous outbound target failures.
 */
function ambiguousTargetError(provider, raw, hint) {
  return new Error(ambiguousTargetMessage(provider, raw, hint));
}
/**
 * Formats the user-facing error shown when no target matches the input.
 */
function unknownTargetMessage(provider, raw, hint) {
  return `Unknown target "${raw}" for ${provider}.${formatTargetHint(hint, true)}`;
}
/**
 * Builds an Error for unknown outbound target failures.
 */
function unknownTargetError(provider, raw, hint) {
  return new Error(unknownTargetMessage(provider, raw, hint));
}
function reservedTargetLiteralMessage(provider, raw, hint) {
  return `Reserved target "${raw}" for ${provider} cannot be used as a literal destination. Provide an explicit id or handle.${formatTargetHint(hint, true)}`;
}
function reservedTargetLiteralError(provider, raw, hint) {
  return new Error(reservedTargetLiteralMessage(provider, raw, hint));
}
function isReservedTargetLiteralError(error) {
  return error.message.includes("Reserved target");
}
function formatTargetHint(hint, withLabel = false) {
  const normalized = hint?.trim();
  if (!normalized) return "";
  return withLabel ? ` Hint: ${normalized}` : ` ${normalized}`;
}
//#endregion
export {
  unknownTargetError as a,
  reservedTargetLiteralError as i,
  isReservedTargetLiteralError as n,
  missingTargetError as r,
  ambiguousTargetError as t,
};
