//#region src/commands/doctor-service-repair-policy.ts
const SERVICE_REPAIR_POLICY_ENV = "OPENCLAW_SERVICE_REPAIR_POLICY";
const EXTERNAL_SERVICE_REPAIR_NOTE =
  "Gateway service is managed externally; skipped service install/start repair. Start or repair the gateway through your supervisor.";
/** Resolves whether doctor may repair managed services or must defer to an external supervisor. */
function resolveServiceRepairPolicy(env = process.env) {
  const value = env[SERVICE_REPAIR_POLICY_ENV]?.trim().toLowerCase();
  switch (value) {
    case "auto":
    case "external":
      return value;
    default:
      return "auto";
  }
}
/** Returns true when service repairs should only emit external-supervisor guidance. */
function isServiceRepairExternallyManaged(policy = resolveServiceRepairPolicy()) {
  return policy === "external";
}
/** Confirms a service repair unless the service repair policy is external. */
async function confirmDoctorServiceRepair(prompter, params, policy = resolveServiceRepairPolicy()) {
  if (isServiceRepairExternallyManaged(policy)) return false;
  return await prompter.confirmRuntimeRepair(params);
}
//#endregion
export {
  resolveServiceRepairPolicy as a,
  isServiceRepairExternallyManaged as i,
  SERVICE_REPAIR_POLICY_ENV as n,
  confirmDoctorServiceRepair as r,
  EXTERNAL_SERVICE_REPAIR_NOTE as t,
};
