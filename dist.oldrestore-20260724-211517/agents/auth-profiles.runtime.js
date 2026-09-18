import { i as ensureAuthProfileStore$1 } from "../store-B7DoDdVM.js";
//#region src/agents/auth-profiles.runtime.ts
/**
 * Runtime seam for auth-profile store loading.
 * Tests can stub this facade without importing the full auth profile store
 * implementation.
 */
/** Ensure an auth-profile store using the production store implementation. */
function ensureAuthProfileStore(...args) {
  return ensureAuthProfileStore$1(...args);
}
//#endregion
export { ensureAuthProfileStore };
