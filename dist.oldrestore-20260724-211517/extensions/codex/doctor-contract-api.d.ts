import {
  a as DoctorSessionRouteStateOwner,
  r as PluginDoctorStateMigration,
} from "../../runtime-doctor-Bk2wvOYl.js";
import { i as OpenClawConfig } from "../../types.openclaw-DDo8sH3F.js";
//#region extensions/codex/src/migration/session-binding-sidecars.d.ts
declare const stateMigrations: PluginDoctorStateMigration[];
//#endregion
//#region extensions/codex/doctor-contract-api.d.ts
type LegacyConfigRule = {
  path: string[];
  message: string;
  match: (value: unknown) => boolean;
};
/** Legacy Codex config keys that doctor should report or repair. */
declare const legacyConfigRules: LegacyConfigRule[];
/**
 * Removes retired Codex plugin config keys while preserving unrelated config.
 */
declare function normalizeCompatibilityConfig({ cfg }: { cfg: OpenClawConfig }): {
  config: OpenClawConfig;
  changes: string[];
};
/** Session/auth ownership metadata used by doctor route-state checks. */
declare const sessionRouteStateOwners: DoctorSessionRouteStateOwner[];
//#endregion
export {
  legacyConfigRules,
  normalizeCompatibilityConfig,
  sessionRouteStateOwners,
  stateMigrations,
};
