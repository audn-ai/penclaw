import {
  r as shouldSuppressBuiltInModel$1,
  t as buildShouldSuppressBuiltInModel$1,
} from "./model-suppression-BEIowhn6.js";
//#region src/agents/model-suppression.runtime.ts
/**
 * Runtime seam for built-in model suppression.
 * Lets tests and lazy catalog paths stub suppression behavior without importing
 * the full suppression implementation at module load.
 */
/** Runtime-forwarded predicate for hiding bundled models. */
function shouldSuppressBuiltInModel(...args) {
  return shouldSuppressBuiltInModel$1(...args);
}
/** Build a provider-aware predicate for hiding bundled models. */
function buildShouldSuppressBuiltInModel(...args) {
  return buildShouldSuppressBuiltInModel$1(...args);
}
//#endregion
export { buildShouldSuppressBuiltInModel, shouldSuppressBuiltInModel };
