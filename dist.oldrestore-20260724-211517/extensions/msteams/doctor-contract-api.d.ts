import { r as PluginDoctorStateMigration } from "../../runtime-doctor-Bk2wvOYl.js";
import {
  C as ChannelDoctorConfigMutation,
  T as ChannelDoctorLegacyConfigRule,
} from "../../types.adapters-BND_5Qr-.js";
import { i as OpenClawConfig } from "../../types.openclaw-DDo8sH3F.js";
//#region extensions/msteams/doctor-contract-api.d.ts
declare const legacyConfigRules: ChannelDoctorLegacyConfigRule[];
declare function normalizeCompatibilityConfig({
  cfg,
}: {
  cfg: OpenClawConfig;
}): ChannelDoctorConfigMutation;
declare const stateMigrations: PluginDoctorStateMigration[];
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig, stateMigrations };
