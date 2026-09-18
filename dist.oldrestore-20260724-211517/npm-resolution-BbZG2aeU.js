import { t as buildNpmResolutionFields } from "./install-source-utils-Cvk6wk9f.js";
//#region src/cli/npm-resolution.ts
/** Build the npm section of a plugin install record. */
function buildNpmInstallRecordFields(params) {
  return {
    source: "npm",
    spec: params.spec,
    installPath: params.installPath,
    version: params.version,
    ...buildNpmResolutionFields(params.resolution),
  };
}
/** CLI adapter for npm install-record pinning with styled warning output. */
function resolvePinnedNpmInstallRecordForCli(
  rawSpec,
  pin,
  installPath,
  version,
  resolution,
  log,
  warnFormat,
) {
  const resolvedSpec = resolution?.resolvedSpec;
  const recordSpec = pin && resolvedSpec ? resolvedSpec : rawSpec;
  if (pin)
    if (resolvedSpec) log(`Pinned npm install record to ${resolvedSpec}.`);
    else
      log(warnFormat("Could not resolve exact npm version for --pin; storing original npm spec."));
  return buildNpmInstallRecordFields({
    spec: recordSpec,
    installPath,
    version,
    resolution,
  });
}
//#endregion
export { resolvePinnedNpmInstallRecordForCli as n, buildNpmInstallRecordFields as t };
