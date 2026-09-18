import { r as createLegacyPrivateNetworkDoctorContract } from "./ssrf-policy-zxv5oRW2.js";
import "./ssrf-runtime-DJ478vv8.js";
//#region extensions/tlon/src/doctor-contract.ts
const contract = createLegacyPrivateNetworkDoctorContract({ channelKey: "tlon" });
const legacyConfigRules = contract.legacyConfigRules;
const normalizeCompatibilityConfig = contract.normalizeCompatibilityConfig;
//#endregion
export { normalizeCompatibilityConfig as n, legacyConfigRules as t };
