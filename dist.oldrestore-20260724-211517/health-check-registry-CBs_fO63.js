//#region src/flows/health-check-registry.ts
const REGISTRY = /* @__PURE__ */ new Map();
/** Raised when two checks claim the same stable health-check id. */
var HealthCheckRegistrationError = class extends Error {
  constructor(checkId) {
    super(`health check already registered: ${checkId}`);
    this.checkId = checkId;
    this.code = "OC_DOCTOR_DUPLICATE_CHECK";
    this.name = "HealthCheckRegistrationError";
  }
};
/** Registers one health check for doctor lint/fix execution. */
function registerHealthCheck(check) {
  if (REGISTRY.has(check.id)) throw new HealthCheckRegistrationError(check.id);
  REGISTRY.set(check.id, check);
}
/** Returns registered checks in insertion order for deterministic doctor output. */
function listHealthChecks() {
  return [...REGISTRY.values()];
}
/** Returns registered extension checks after rejecting any reserved core doctor id claims. */
function listExtensionHealthChecksForDoctor(coreChecks) {
  const coreIds = new Set(coreChecks.map((check) => check.id));
  const registeredChecks = listHealthChecks();
  for (const check of registeredChecks)
    if (check.id.startsWith("core/doctor/") || coreIds.has(check.id))
      throw new HealthCheckRegistrationError(check.id);
  return registeredChecks.filter((check) => check.kind !== "core");
}
/** Looks up a registered health check by its stable id. */
function getHealthCheck(id) {
  return REGISTRY.get(id);
}
/** Clears the process-local registry for isolated tests. */
function clearHealthChecksForTest() {
  REGISTRY.clear();
}
//#endregion
export {
  listHealthChecks as a,
  listExtensionHealthChecksForDoctor as i,
  clearHealthChecksForTest as n,
  registerHealthCheck as o,
  getHealthCheck as r,
  HealthCheckRegistrationError as t,
};
