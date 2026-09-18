import { t as parseClawHubPluginSpec } from "./clawhub-spec-CzLwxQg_.js";
import {
  r as isExactSemverVersion,
  s as parseRegistryNpmSpec,
} from "./npm-registry-spec-CqBTTiC9.js";
//#region src/plugins/install-channel-specs.ts
function resolveDefaultNpmSpec(spec) {
  const parsed = parseRegistryNpmSpec(spec);
  if (!parsed) return null;
  if (parsed.selectorKind === "none") return { name: parsed.name };
  if (parsed.selectorKind === "tag" && parsed.selector?.toLowerCase() === "latest")
    return { name: parsed.name };
  return null;
}
function isDefaultClawHubSpecForBetaChannel(spec) {
  const parsed = parseClawHubPluginSpec(spec);
  if (!parsed) return null;
  if (!parsed.version || parsed.version.toLowerCase() === "latest") return { name: parsed.name };
  return null;
}
function resolveNpmInstallSpecsForUpdateChannel(params) {
  if (params.updateChannel === "extended-stable") {
    const target = resolveDefaultNpmSpec(params.spec);
    if (target && params.officialPackageName === target.name) {
      const coreVersion = params.coreVersion?.trim();
      if (!coreVersion || !isExactSemverVersion(coreVersion))
        throw new Error(
          `Extended-stable plugin resolution for ${target.name} requires an exact core version.`,
        );
      return {
        installSpec: `${target.name}@${coreVersion}`,
        recordSpec: params.spec,
      };
    }
    return {
      installSpec: params.spec,
      recordSpec: params.spec,
    };
  }
  if (params.updateChannel !== "beta")
    return {
      installSpec: params.spec,
      recordSpec: params.spec,
    };
  const betaTarget = resolveDefaultNpmSpec(params.spec);
  if (!betaTarget)
    return {
      installSpec: params.spec,
      recordSpec: params.spec,
    };
  const betaSpec = `${betaTarget.name}@beta`;
  return {
    installSpec: betaSpec,
    recordSpec: params.spec,
    fallbackSpec: params.spec,
    fallbackLabel: betaSpec,
  };
}
function resolveClawHubInstallSpecsForUpdateChannel(params) {
  if (params.updateChannel !== "beta")
    return {
      installSpec: params.spec,
      recordSpec: params.spec,
    };
  const betaTarget = isDefaultClawHubSpecForBetaChannel(params.spec);
  if (!betaTarget)
    return {
      installSpec: params.spec,
      recordSpec: params.spec,
    };
  const betaSpec = `clawhub:${betaTarget.name}@beta`;
  return {
    installSpec: betaSpec,
    recordSpec: params.spec,
    fallbackSpec: params.spec,
    fallbackLabel: betaSpec,
  };
}
//#endregion
export {
  resolveNpmInstallSpecsForUpdateChannel as n,
  resolveClawHubInstallSpecsForUpdateChannel as t,
};
