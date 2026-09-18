import { n as ensureAuthProfileStore$1 } from "../store-TQsl5_Yq.js";

//#region src/agents/auth-profiles.runtime.d.ts
type EnsureAuthProfileStore = typeof ensureAuthProfileStore$1;
/** Ensure an auth-profile store using the production store implementation. */
declare function ensureAuthProfileStore(
  ...args: Parameters<EnsureAuthProfileStore>
): ReturnType<EnsureAuthProfileStore>;
//#endregion
export { ensureAuthProfileStore };
