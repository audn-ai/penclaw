//#region src/plugins/clawhub-install-records.ts
/** Builds plugin install record fields from resolved ClawHub package metadata. */
function buildClawHubPluginInstallRecordFields(fields) {
  return {
    source: "clawhub",
    clawhubUrl: fields.clawhubUrl,
    clawhubPackage: fields.clawhubPackage,
    clawhubFamily: fields.clawhubFamily,
    ...(fields.clawhubChannel ? { clawhubChannel: fields.clawhubChannel } : {}),
    ...(fields.clawhubTrustDisposition
      ? { clawhubTrustDisposition: fields.clawhubTrustDisposition }
      : {}),
    ...(fields.clawhubTrustScanStatus
      ? { clawhubTrustScanStatus: fields.clawhubTrustScanStatus }
      : {}),
    ...(fields.clawhubTrustModerationState
      ? { clawhubTrustModerationState: fields.clawhubTrustModerationState }
      : {}),
    ...(fields.clawhubTrustReasons ? { clawhubTrustReasons: fields.clawhubTrustReasons } : {}),
    ...(fields.clawhubTrustPending !== void 0
      ? { clawhubTrustPending: fields.clawhubTrustPending }
      : {}),
    ...(fields.clawhubTrustStale !== void 0 ? { clawhubTrustStale: fields.clawhubTrustStale } : {}),
    ...(fields.clawhubTrustCheckedAt
      ? { clawhubTrustCheckedAt: fields.clawhubTrustCheckedAt }
      : {}),
    ...(fields.clawhubTrustAcknowledgedAt
      ? { clawhubTrustAcknowledgedAt: fields.clawhubTrustAcknowledgedAt }
      : {}),
    ...(fields.version ? { version: fields.version } : {}),
    ...(fields.integrity ? { integrity: fields.integrity } : {}),
    ...(fields.resolvedAt ? { resolvedAt: fields.resolvedAt } : {}),
    ...(fields.installedAt ? { installedAt: fields.installedAt } : {}),
    ...(fields.artifactKind ? { artifactKind: fields.artifactKind } : {}),
    ...(fields.artifactFormat ? { artifactFormat: fields.artifactFormat } : {}),
    ...(fields.npmIntegrity ? { npmIntegrity: fields.npmIntegrity } : {}),
    ...(fields.npmShasum ? { npmShasum: fields.npmShasum } : {}),
    ...(fields.npmTarballName ? { npmTarballName: fields.npmTarballName } : {}),
    ...(fields.clawpackSha256 ? { clawpackSha256: fields.clawpackSha256 } : {}),
    ...(fields.clawpackSpecVersion !== void 0
      ? { clawpackSpecVersion: fields.clawpackSpecVersion }
      : {}),
    ...(fields.clawpackManifestSha256
      ? { clawpackManifestSha256: fields.clawpackManifestSha256 }
      : {}),
    ...(fields.clawpackSize !== void 0 ? { clawpackSize: fields.clawpackSize } : {}),
  };
}
//#endregion
export { buildClawHubPluginInstallRecordFields as t };
