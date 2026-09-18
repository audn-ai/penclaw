import { c as normalizePluginsConfig } from "./config-state-C1Qyxaws.js";
import { o as registerHealthCheck } from "./health-check-registry-CBs_fO63.js";
import { i as passesManifestOwnerBasePolicy } from "./manifest-owner-policy-Bl1TJHcS.js";
import { n as loadBundledPluginPublicArtifactModuleSync } from "./public-surface-loader-X-jDa4d1.js";
import { r as asOptionalObjectRecord } from "./record-coerce-DHZ4bFlT.js";
//#region src/flows/bundled-health-checks.ts
/** Registers bundled health checks that are explicitly enabled by config and owner policy. */
function registerBundledHealthChecks(params) {
  if (!shouldRegisterPolicyHealth(params)) return;
  loadBundledPluginPublicArtifactModuleSync({
    dirName: "policy",
    artifactBasename: "api.js",
  }).registerPolicyDoctorChecks?.({ registerHealthCheck });
}
function shouldRegisterPolicyHealth(params) {
  const entry = params.cfg.plugins?.entries?.policy;
  const config = asOptionalObjectRecord(entry?.config) ?? {};
  if (entry === void 0 || entry.enabled === false || config.enabled === false) return false;
  if (
    !passesManifestOwnerBasePolicy({
      plugin: { id: "policy" },
      normalizedConfig: normalizePluginsConfig(params.cfg.plugins),
    })
  )
    return false;
  return entry.enabled === true || config.enabled === true;
}
//#endregion
export { registerBundledHealthChecks as t };
