//#region src/commands/models/list.errors.ts
/** Error code used when model availability lookup is unavailable but auth heuristics can continue. */
const MODEL_AVAILABILITY_UNAVAILABLE_CODE = "MODEL_AVAILABILITY_UNAVAILABLE";
/** Formats an unknown error with stack detail when available. */
function formatErrorWithStack(err) {
  if (err instanceof Error) return err.stack ?? `${err.name}: ${err.message}`;
  return String(err);
}
/** Returns true when model list should continue with auth heuristics. */
function shouldFallbackToAuthHeuristics(err) {
  if (!(err instanceof Error)) return false;
  return err.code === MODEL_AVAILABILITY_UNAVAILABLE_CODE;
}
//#endregion
export {
  formatErrorWithStack as n,
  shouldFallbackToAuthHeuristics as r,
  MODEL_AVAILABILITY_UNAVAILABLE_CODE as t,
};
