import fs from "node:fs/promises";
import "./utils-DtcDeqWS.js";
import path from "node:path";
import {
  a as loadBundleManifest,
  i as detectBundleManifestFormat,
} from "./bundle-manifest-Dxp5qa20.js";
import {
  c as normalizePluginsConfig,
  l as resolveEffectiveEnableState,
} from "./config-state-C1Qyxaws.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import { a as resolveDefaultPluginNpmDir } from "./install-paths-CqMnrXsY.js";
import { c as listManagedPluginNpmRoots } from "./managed-npm-retention-Ddwq8V0k.js";
import { s as resolvePackageExtensionEntries } from "./manifest-DnFAzqZi.js";
import {
  i as resolveTrustedSourceLinkedOfficialNpmSpec,
  r as resolveTrustedSourceLinkedOfficialClawHubSpec,
} from "./manifest-registry-CXy9BBfE.js";
import { i as repairMissingConfiguredPluginInstalls } from "./missing-configured-plugin-install-CQu0CVkE.js";
import { r as validatePackageExtensionEntriesForInstall } from "./package-entry-resolution-BGL_bDuB.js";
import {
  i as relinkOpenClawPeerDependenciesInManagedNpmRoot,
  n as auditOpenClawPeerDependencyLink,
} from "./plugin-peer-link-CMrc53yA.js";
import { n as pruneStaleLocalBundledPluginInstallRecords } from "./stale-local-bundled-plugin-install-records-DU70BZn6.js";
import { s as UPDATE_POST_CORE_CONVERGENCE_ENV } from "./update-phase-RYqcMEby.js";
import { n as VERSION } from "./version-CeFj_iGk.js";
//#region src/cli/update-cli/plugin-payload-validation.ts
const TRACKED_SOURCES = /* @__PURE__ */ new Set(["npm", "clawhub", "git", "marketplace"]);
/**
 * Verify that each tracked plugin install record on disk is structurally
 * loadable: code packages contain a parseable `package.json` and declared
 * package entry files, while bundle packages satisfy their bundle manifest
 * contract.
 *
 * IMPORTANT: this is intentionally a *static* check. We do NOT execute the
 * plugin's code, so post-update side effects (network calls, filesystem
 * writes, registry registration) cannot fire while the gateway is still
 * stopped. The goal is to catch obvious payload corruption — missing files,
 * unparseable manifests — before we hand control back to the restart path.
 */
async function runPluginPayloadSmokeCheck(params) {
  const checked = [];
  const failures = [];
  for (const [pluginId, record] of Object.entries(params.records).toSorted(([a], [b]) =>
    a.localeCompare(b),
  )) {
    if (!record || typeof record !== "object" || !TRACKED_SOURCES.has(record.source)) continue;
    const rawInstallPath = typeof record.installPath === "string" ? record.installPath.trim() : "";
    if (!rawInstallPath) {
      checked.push(pluginId);
      failures.push({
        pluginId,
        reason: "missing-install-path",
        detail: "Install path is missing from the plugin install record.",
      });
      continue;
    }
    const installPath = resolveUserPath(rawInstallPath, params.env);
    checked.push(pluginId);
    if (!(await safeStat(installPath))?.isDirectory()) {
      failures.push({
        pluginId,
        installPath,
        reason: "missing-package-dir",
        detail: `Install dir is missing: ${installPath}`,
      });
      continue;
    }
    const bundlePayload = resolveBundleInstallRecordPayload({
      record,
      installPath,
    });
    const packagePayload = await readPackagePayloadManifest(installPath);
    if (packagePayload.status === "present") {
      if (!bundlePayload.isBundlePayload || hasNativePackageMetadata(packagePayload.manifest)) {
        failures.push(
          ...(await validatePackagePayload({
            pluginId,
            installPath,
            manifest: packagePayload.manifest,
          })),
        );
        continue;
      }
    } else if (!bundlePayload.isBundlePayload) {
      failures.push(
        formatPackagePayloadReadFailure({
          pluginId,
          installPath,
          packagePayload,
        }),
      );
      continue;
    }
    const bundleFailure = validateBundleInstallRecordPayload({
      pluginId,
      installPath,
      record,
      bundleFormat: bundlePayload.bundleFormat,
    });
    if (bundleFailure) failures.push(bundleFailure);
  }
  return {
    checked,
    failures,
  };
}
async function readPackagePayloadManifest(installPath) {
  const packageJsonPath = path.join(installPath, "package.json");
  if (!(await safeStat(packageJsonPath))?.isFile()) return { status: "missing" };
  try {
    return {
      status: "present",
      manifest: JSON.parse(await fs.readFile(packageJsonPath, "utf8")),
    };
  } catch (err) {
    return {
      status: "invalid",
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
function formatPackagePayloadReadFailure(params) {
  if (params.packagePayload.status === "invalid")
    return {
      pluginId: params.pluginId,
      installPath: params.installPath,
      reason: "invalid-package-json",
      detail: `Could not parse package.json: ${params.packagePayload.error}`,
    };
  return {
    pluginId: params.pluginId,
    installPath: params.installPath,
    reason: "missing-package-json",
    detail: `package.json is missing under ${params.installPath}`,
  };
}
function hasNativePackageMetadata(manifest) {
  return resolvePackageExtensionEntries(manifest).status !== "missing";
}
async function hasNativePackageInstallPayload(installPath) {
  const packagePayload = await readPackagePayloadManifest(installPath);
  return packagePayload.status === "present" && hasNativePackageMetadata(packagePayload.manifest);
}
async function validatePackagePayload(params) {
  const failures = [];
  if (manifestDeclaresOpenClawPeer(params.manifest)) {
    const peerIssue = await auditOpenClawPeerDependencyLink({
      packageDir: params.installPath,
      packageName: params.manifest.name ?? params.pluginId,
    });
    if (peerIssue)
      failures.push({
        pluginId: params.pluginId,
        installPath: params.installPath,
        reason: "missing-openclaw-peer-link",
        detail: `Plugin declares peerDependency "openclaw" but peer link audit failed: ${peerIssue.reason}.`,
      });
  }
  const extensionResolution = resolvePackageExtensionEntries(params.manifest);
  if (extensionResolution.status === "invalid" || extensionResolution.status === "empty") {
    failures.push({
      pluginId: params.pluginId,
      installPath: params.installPath,
      reason: "missing-extension-entry",
      detail: `Plugin extension entry validation failed: ${extensionResolution.status === "invalid" ? extensionResolution.error : "package.json openclaw.extensions is empty"}`,
    });
    return failures;
  } else if (extensionResolution.status === "ok") {
    const extensionValidation = await validatePackageExtensionEntriesForInstall({
      packageDir: params.installPath,
      extensions: extensionResolution.entries,
      manifest: params.manifest,
    });
    if (!extensionValidation.ok)
      failures.push({
        pluginId: params.pluginId,
        installPath: params.installPath,
        reason: "missing-extension-entry",
        detail: `Plugin extension entry validation failed: ${extensionValidation.error}`,
      });
  }
  if (typeof params.manifest.main !== "string" || !params.manifest.main.trim()) return failures;
  const mainRel = params.manifest.main.trim();
  const mainPath = path.join(params.installPath, mainRel);
  if (!(await safeStat(mainPath))?.isFile())
    failures.push({
      pluginId: params.pluginId,
      installPath: params.installPath,
      reason: "missing-main-entry",
      detail: `Plugin main entry "${mainRel}" not found at ${mainPath}`,
    });
  return failures;
}
function isBundleInstallRecord(record) {
  return record.format === "bundle" || record.clawhubFamily === "bundle-plugin";
}
function resolveBundleInstallRecordPayload(params) {
  const hasBundleRecordMetadata = isBundleInstallRecord(params.record);
  if (!hasBundleRecordMetadata && params.record.source !== "marketplace")
    return {
      isBundlePayload: false,
      bundleFormat: null,
    };
  const bundleFormat = detectBundleManifestFormat(params.installPath);
  return {
    isBundlePayload: hasBundleRecordMetadata || bundleFormat !== null,
    bundleFormat,
  };
}
function validateBundleInstallRecordPayload(params) {
  const hasBundleRecordMetadata = isBundleInstallRecord(params.record);
  const bundleFormat =
    params.bundleFormat === void 0
      ? detectBundleManifestFormat(params.installPath)
      : params.bundleFormat;
  if (!hasBundleRecordMetadata && !bundleFormat) return null;
  if (!bundleFormat)
    return {
      pluginId: params.pluginId,
      installPath: params.installPath,
      reason: "missing-bundle-manifest",
      detail: `No supported bundle manifest or bundle marker found under ${params.installPath}`,
    };
  const bundleManifest = loadBundleManifest({
    rootDir: params.installPath,
    bundleFormat,
  });
  if (bundleManifest.ok) return null;
  return {
    pluginId: params.pluginId,
    installPath: params.installPath,
    reason: bundleManifest.error.startsWith("plugin manifest not found")
      ? "missing-bundle-manifest"
      : "invalid-bundle-manifest",
    detail: `Bundle manifest validation failed: ${bundleManifest.error}`,
  };
}
function manifestDeclaresOpenClawPeer(manifest) {
  const peerDependencies = manifest.peerDependencies;
  return (
    typeof peerDependencies === "object" &&
    peerDependencies !== null &&
    !Array.isArray(peerDependencies) &&
    typeof peerDependencies.openclaw === "string"
  );
}
async function safeStat(target) {
  try {
    return await fs.stat(target);
  } catch {
    return null;
  }
}
//#endregion
//#region src/cli/update-cli/post-core-plugin-convergence.ts
const REPAIR_GUIDANCE = "Run `openclaw update repair` to retry plugin repair.";
const inspectGuidance = (pluginId) =>
  `Run \`openclaw plugins inspect ${pluginId} --runtime --json\` for details.`;
async function repairManagedNpmOpenClawPeerLinks(params) {
  try {
    const npmRoots = await listManagedPluginNpmRoots(resolveDefaultPluginNpmDir(params.env));
    const repaired = (
      await Promise.all(
        npmRoots.map((npmRoot) =>
          relinkOpenClawPeerDependenciesInManagedNpmRoot({
            npmRoot,
            logger: {},
          }),
        ),
      )
    ).reduce((total, result) => total + result.repaired, 0);
    return {
      changes:
        repaired > 0
          ? [`Repaired OpenClaw host peer link(s) for ${repaired} managed npm plugin package(s).`]
          : [],
      warnings: [],
    };
  } catch (err) {
    const message = `Failed to repair managed npm OpenClaw host peer links: ${err instanceof Error ? err.message : String(err)}`;
    return {
      changes: [],
      warnings: [
        {
          reason: message,
          message,
          guidance: [REPAIR_GUIDANCE],
        },
      ],
    };
  }
}
/**
 * Mandatory post-core convergence pass. Runs AFTER the core package files
 * are swapped and the in-update doctor pass has already returned, but BEFORE
 * the gateway is restarted. Missing-plugin repair failures stay nonblocking:
 * an external package fetch may be transient, and failing the core update
 * would strand the user. Payload smoke failures still block the restart so we
 * never restart with an installed active plugin whose payload is unloadable.
 */
async function runPostCorePluginConvergence(params) {
  const env = {
    ...params.env,
    OPENCLAW_COMPATIBILITY_HOST_VERSION: VERSION,
    [UPDATE_POST_CORE_CONVERGENCE_ENV]: "1",
  };
  const prunedBaseline = params.baselineInstallRecords
    ? pruneStaleLocalBundledPluginInstallRecords({
        installRecords: params.baselineInstallRecords,
        env,
      })
    : null;
  const repair = await repairMissingConfiguredPluginInstalls({
    cfg: params.cfg,
    env,
    ...(prunedBaseline ? { baselineRecords: prunedBaseline.records } : {}),
    ...(params.acknowledgeClawHubRisk ? { acknowledgeClawHubRisk: true } : {}),
    ...(params.onClawHubRisk ? { onClawHubRisk: params.onClawHubRisk } : {}),
  });
  const warnings = repair.warnings.map((message) => ({
    reason: message,
    message,
    guidance: [REPAIR_GUIDANCE],
  }));
  const peerLinkRepair = await repairManagedNpmOpenClawPeerLinks({ env });
  warnings.push(...peerLinkRepair.warnings);
  const notices = (repair.notices ?? []).map((message) => ({
    reason: message,
    message,
    guidance: [],
  }));
  const records = repair.records;
  const smoke = await runPluginPayloadSmokeCheck({
    records: filterRecordsToActive({
      cfg: params.cfg,
      records,
    }),
    env,
  });
  for (const failure of smoke.failures)
    warnings.push({
      pluginId: failure.pluginId,
      reason: `${failure.reason}: ${failure.detail}`,
      message: `Plugin "${failure.pluginId}" failed post-core payload smoke check (${failure.reason}): ${failure.detail}`,
      guidance: [REPAIR_GUIDANCE, inspectGuidance(failure.pluginId)],
    });
  return {
    changes: [
      ...(prunedBaseline?.stale.map(
        (record) => `Removed stale local bundled plugin install record "${record.pluginId}".`,
      ) ?? []),
      ...repair.changes,
      ...peerLinkRepair.changes,
    ],
    notices,
    warnings,
    errored: smoke.failures.length > 0,
    smokeFailures: smoke.failures,
    installRecords: records,
  };
}
/**
 * Drop install records that the gateway would never activate: disabled
 * plugin entries, plugins listed in `plugins.deny`, etc. Records that
 * resolve as a trusted-source-linked official install (npm or ClawHub)
 * are retained even when the entry is disabled, mirroring the existing
 * `collectMissingPluginInstallPayloads({ skipDisabledPlugins: true,
 * syncOfficialPluginInstalls: true })` policy at
 * `update-command.ts:~218`. We do NOT collapse to the configured plugin
 * id set here — that would over-filter and miss e.g. providers/runtimes
 * that are enabled implicitly via auth profiles or model refs. Effective
 * enable state is the right precision boundary.
 */
function filterRecordsToActive(params) {
  const normalizedPluginConfig = normalizePluginsConfig(params.cfg.plugins);
  const filtered = {};
  for (const [pluginId, record] of Object.entries(params.records)) {
    if (!record || typeof record !== "object") continue;
    if (
      resolveEffectiveEnableState({
        id: pluginId,
        origin: "global",
        config: normalizedPluginConfig,
        rootConfig: params.cfg,
      }).enabled
    ) {
      filtered[pluginId] = record;
      continue;
    }
    const officialNpm = resolveTrustedSourceLinkedOfficialNpmSpec({
      pluginId,
      record,
    });
    const officialClawHub = resolveTrustedSourceLinkedOfficialClawHubSpec({
      pluginId,
      record,
    });
    if (officialNpm || officialClawHub) filtered[pluginId] = record;
  }
  return filtered;
}
/**
 * Pure helper used by `updatePluginsAfterCoreUpdate` to fold a convergence
 * result into the existing `PluginUpdateOutcome[]` / warning shape that the
 * post-core update result carries.
 *
 * Returns:
 *  - `outcomes` to append to `pluginUpdateOutcomes`. Only convergence
 *    warnings that name a `pluginId` produce per-plugin error outcomes; the
 *    rest are surfaced via `warnings`.
 *  - `errored` boolean that callers translate into `status: "error"`.
 *    Repair warnings are nonblocking; smoke failures remain blocking
 *    because they prove an active installed payload is unloadable.
 */
function convergenceWarningsToOutcomes(convergence) {
  const outcomes = convergence.warnings
    .filter((w) => Boolean(w.pluginId))
    .map((w) => ({
      pluginId: w.pluginId,
      status: "error",
      message: w.message,
    }));
  return {
    warnings: [...convergence.warnings, ...(convergence.notices ?? [])],
    outcomes,
    errored: convergence.errored,
  };
}
//#endregion
export {
  resolveBundleInstallRecordPayload as a,
  hasNativePackageInstallPayload as i,
  filterRecordsToActive as n,
  validateBundleInstallRecordPayload as o,
  runPostCorePluginConvergence as r,
  convergenceWarningsToOutcomes as t,
};
