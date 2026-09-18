import { t as LegacyConfigRule } from "./legacy.shared-CFJyEGh7.js";
import { T as ChannelDoctorLegacyConfigRule } from "./types.adapters-BND_5Qr-.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";
//#region extensions/elevenlabs/doctor-contract.d.ts
declare function hasLegacyTalkFields(value: unknown): boolean;
declare const legacyConfigRules: ChannelDoctorLegacyConfigRule[];
declare const ELEVENLABS_TALK_LEGACY_CONFIG_RULES: LegacyConfigRule[];
declare function normalizeCompatibilityConfig({ cfg }: { cfg: OpenClawConfig }): {
  config: OpenClawConfig;
  changes: string[];
};
//#endregion
export {
  normalizeCompatibilityConfig as i,
  hasLegacyTalkFields as n,
  legacyConfigRules as r,
  ELEVENLABS_TALK_LEGACY_CONFIG_RULES as t,
};
