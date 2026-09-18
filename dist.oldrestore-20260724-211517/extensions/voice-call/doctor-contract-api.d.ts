import { r as PluginDoctorStateMigration } from "../../runtime-doctor-Bk2wvOYl.js";
import { i as OpenClawConfig } from "../../types.openclaw-DDo8sH3F.js";
//#region extensions/voice-call/doctor-contract-api.d.ts
/** Return Voice Call agents whose templated core session stores need migration. */
declare function resolveSessionStoreAgentIds(params: { cfg: OpenClawConfig }): string[];
/** Doctor migrations owned by the voice-call plugin. */
declare const stateMigrations: PluginDoctorStateMigration[];
//#endregion
export { resolveSessionStoreAgentIds, stateMigrations };
