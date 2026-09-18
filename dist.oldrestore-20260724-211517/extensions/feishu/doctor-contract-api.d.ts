import {
  C as ChannelDoctorConfigMutation,
  T as ChannelDoctorLegacyConfigRule,
} from "../../types.adapters-BND_5Qr-.js";
import { i as OpenClawConfig } from "../../types.openclaw-DDo8sH3F.js";
//#region extensions/feishu/src/doctor-contract.d.ts
declare const legacyConfigRules: ChannelDoctorLegacyConfigRule[];
declare function normalizeCompatibilityConfig({
  cfg,
}: {
  cfg: OpenClawConfig;
}): ChannelDoctorConfigMutation;
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig };
