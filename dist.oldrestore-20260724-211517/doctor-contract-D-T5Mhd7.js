import { n as migrateElevenLabsLegacyTalkConfig } from "./config-compat-Bx_PEn_N.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
//#region extensions/elevenlabs/doctor-contract.ts
function hasLegacyTalkFields(value) {
  const talk = isRecord(value) ? value : null;
  if (!talk) return false;
  return ["voiceId", "voiceAliases", "modelId", "outputFormat", "apiKey"].some((key) =>
    Object.hasOwn(talk, key),
  );
}
const legacyConfigRules = [
  {
    path: ["talk"],
    message:
      "talk.voiceId/talk.voiceAliases/talk.modelId/talk.outputFormat/talk.apiKey are legacy; use talk.providers.<provider> and run openclaw doctor --fix.",
    match: hasLegacyTalkFields,
  },
];
const ELEVENLABS_TALK_LEGACY_CONFIG_RULES = legacyConfigRules;
function normalizeCompatibilityConfig({ cfg }) {
  return migrateElevenLabsLegacyTalkConfig(cfg);
}
//#endregion
export {
  normalizeCompatibilityConfig as i,
  hasLegacyTalkFields as n,
  legacyConfigRules as r,
  ELEVENLABS_TALK_LEGACY_CONFIG_RULES as t,
};
