import { t as LegacyConfigRule } from "../../legacy.shared-CFJyEGh7.js";
import { C as ChannelDoctorConfigMutation } from "../../types.adapters-BND_5Qr-.js";
import { i as OpenClawConfig } from "../../types.openclaw-DDo8sH3F.js";
//#region extensions/tlon/src/doctor-contract.d.ts
declare const legacyConfigRules: LegacyConfigRule[];
declare const normalizeCompatibilityConfig: (params: {
  cfg: OpenClawConfig;
}) => ChannelDoctorConfigMutation;
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig };
