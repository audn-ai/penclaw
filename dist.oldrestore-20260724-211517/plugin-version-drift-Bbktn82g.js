import { t as parseClawHubPluginSpec } from "./clawhub-spec-CzLwxQg_.js";
import {
  c as normalizePluginsConfig,
  l as resolveEffectiveEnableState,
} from "./config-state-C1Qyxaws.js";
import {
  i as resolveTrustedSourceLinkedOfficialNpmSpec,
  n as resolveTrustedSourceLinkedOfficialClawHubInstall,
} from "./manifest-registry-CXy9BBfE.js";
import { s as parseRegistryNpmSpec } from "./npm-registry-spec-CqBTTiC9.js";
//#region src/plugins/plugin-version-drift.ts
function resolveExactNpmPinPackageName(entry) {
  if (entry.source !== "npm" || !entry.spec) return;
  const parsed = parseRegistryNpmSpec(entry.spec);
  if (parsed?.selectorKind !== "exact-version") return;
  return parsed.name;
}
/** Exact npm pins need a package@version target; id-only updates preserve the old pin. */
function resolvePluginVersionDriftUpdateCommand(entry) {
  const exactNpmPackageName = resolveExactNpmPinPackageName(entry);
  if (exactNpmPackageName) {
    const exactNpmTarget = `${exactNpmPackageName}@${entry.gatewayVersion}`;
    if (parseRegistryNpmSpec(exactNpmTarget)?.selectorKind === "exact-version")
      return `openclaw plugins update ${exactNpmTarget}`;
  }
  return `openclaw plugins update ${entry.pluginId}`;
}
/**
 * Strip a trailing build qualifier (e.g. `2026.5.4-1` -> `2026.5.4`) so that
 * a gateway packaged as `2026.5.4-1` is not reported as drifted from a
 * plugin packaged as `2026.5.4`. Both ends are normalized identically.
 */
function normalizeVersion(value) {
  return value.replace(/-\d+$/, "");
}
function isPluginEnabled(config, pluginId) {
  return resolveEffectiveEnableState({
    id: pluginId,
    origin: "global",
    config: normalizePluginsConfig(config?.plugins),
    rootConfig: config,
  }).enabled;
}
function shouldCompareOfficialInstallToGateway(params) {
  const officialNpmSpec = resolveTrustedSourceLinkedOfficialNpmSpec(params);
  if (officialNpmSpec)
    return parseRegistryNpmSpec(officialNpmSpec)?.selectorKind !== "exact-version";
  const officialClawHubInstall = resolveTrustedSourceLinkedOfficialClawHubInstall(params);
  if (officialClawHubInstall) {
    if (officialClawHubInstall.clawhubSpec)
      return !parseClawHubPluginSpec(officialClawHubInstall.clawhubSpec)?.version;
    return (
      parseRegistryNpmSpec(officialClawHubInstall.npmSpec ?? "")?.selectorKind !== "exact-version"
    );
  }
  return false;
}
/**
 * Compare active official external plugin installs against the running gateway
 * version and return any mismatches.
 *
 * @param params.gatewayVersion The gateway version string (typically the
 *   `version` field of the installed openclaw package.json).
 * @param params.installRecords The full set of recorded plugin installs (as
 *   produced by `loadInstalledPluginIndexInstallRecords`).
 * @param params.config The merged daemon-side OpenClawConfig (optional).
 *   Plugins inactive under the effective activation policy are skipped.
 *
 * The returned `drifts` list is sorted by `pluginId` for stable output.
 */
function detectPluginVersionDrift(params) {
  const { gatewayVersion, installRecords, config } = params;
  const normalizedGateway = normalizeVersion(gatewayVersion);
  const drifts = [];
  for (const [pluginId, record] of Object.entries(installRecords)) {
    if (!record) continue;
    if (!isPluginEnabled(config, pluginId)) continue;
    if (
      !shouldCompareOfficialInstallToGateway({
        pluginId,
        record,
      })
    )
      continue;
    const installedVersion = record.resolvedVersion ?? record.version;
    if (!installedVersion) continue;
    if (normalizeVersion(installedVersion) === normalizedGateway) continue;
    drifts.push({
      pluginId,
      installedVersion,
      gatewayVersion,
      source: record.source,
      ...(record.resolvedName ? { packageName: record.resolvedName } : {}),
      ...(record.spec ? { spec: record.spec } : {}),
    });
  }
  drifts.sort((a, b) => a.pluginId.localeCompare(b.pluginId));
  return {
    gatewayVersion,
    drifts,
  };
}
//#endregion
export { resolvePluginVersionDriftUpdateCommand as n, detectPluginVersionDrift as t };
