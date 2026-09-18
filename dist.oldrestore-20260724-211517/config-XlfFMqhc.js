import { n as asNullableRecord } from "./record-coerce-DHZ4bFlT.js";
//#region src/skills/workshop/config.ts
const DEFAULT_CONFIG = {
  autonomous: { enabled: false },
  allowSymlinkTargetWrites: false,
  approvalPolicy: "pending",
  maxPending: 50,
  maxSkillBytes: 4e4,
};
function readBoolean(value, fallback) {
  return typeof value === "boolean" ? value : fallback;
}
function readInteger(value, fallback, min, max) {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.min(Math.max(Math.trunc(value), min), max)
    : fallback;
}
function readApprovalPolicy(value, fallback) {
  return value === "auto" ? "auto" : fallback;
}
function resolveSkillWorkshopConfig(config) {
  const raw = asNullableRecord(config?.skills?.workshop) ?? {};
  return {
    autonomous: {
      enabled: readBoolean(
        (asNullableRecord(raw.autonomous) ?? {}).enabled,
        DEFAULT_CONFIG.autonomous.enabled,
      ),
    },
    allowSymlinkTargetWrites: readBoolean(
      raw.allowSymlinkTargetWrites,
      DEFAULT_CONFIG.allowSymlinkTargetWrites,
    ),
    approvalPolicy: readApprovalPolicy(raw.approvalPolicy, DEFAULT_CONFIG.approvalPolicy),
    maxPending: readInteger(raw.maxPending, DEFAULT_CONFIG.maxPending, 1, 200),
    maxSkillBytes: readInteger(raw.maxSkillBytes, DEFAULT_CONFIG.maxSkillBytes, 1024, 2e5),
  };
}
//#endregion
export { resolveSkillWorkshopConfig as t };
