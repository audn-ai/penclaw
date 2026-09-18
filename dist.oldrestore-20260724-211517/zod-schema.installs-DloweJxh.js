import {
  At as boolean,
  Et as array,
  Rn as string,
  Xn as union,
  dn as literal,
  wn as number,
} from "./schemas-CBJjibl3.js";
//#region src/config/zod-schema.installs.ts
const InstallSourceSchema = union([
  literal("npm"),
  literal("archive"),
  literal("path"),
  literal("clawhub"),
  literal("git"),
]);
const PluginInstallSourceSchema = union([InstallSourceSchema, literal("marketplace")]);
/** Zod object shape for persisted generic install records. */
const InstallRecordShape = {
  source: InstallSourceSchema,
  spec: string().optional(),
  sourcePath: string().optional(),
  installPath: string().optional(),
  version: string().optional(),
  resolvedName: string().optional(),
  resolvedVersion: string().optional(),
  resolvedSpec: string().optional(),
  integrity: string().optional(),
  shasum: string().optional(),
  resolvedAt: string().optional(),
  installedAt: string().optional(),
  clawhubUrl: string().optional(),
  clawhubPackage: string().optional(),
  clawhubFamily: union([literal("code-plugin"), literal("bundle-plugin")]).optional(),
  clawhubChannel: union([literal("official"), literal("community"), literal("private")]).optional(),
  clawhubTrustDisposition: union([
    literal("clean"),
    literal("review-recommended"),
    literal("review-required"),
    literal("blocked"),
  ]).optional(),
  clawhubTrustScanStatus: string().optional(),
  clawhubTrustModerationState: string().optional(),
  clawhubTrustReasons: array(string()).optional(),
  clawhubTrustPending: boolean().optional(),
  clawhubTrustStale: boolean().optional(),
  clawhubTrustCheckedAt: string().optional(),
  clawhubTrustAcknowledgedAt: string().optional(),
  artifactKind: union([literal("legacy-zip"), literal("npm-pack")]).optional(),
  artifactFormat: union([literal("zip"), literal("tgz")]).optional(),
  npmIntegrity: string().optional(),
  npmShasum: string().optional(),
  npmTarballName: string().optional(),
  clawpackSha256: string().optional(),
  clawpackSpecVersion: number().int().nonnegative().optional(),
  clawpackManifestSha256: string().optional(),
  clawpackSize: number().int().nonnegative().optional(),
  gitUrl: string().optional(),
  gitRef: string().optional(),
  gitCommit: string().optional(),
};
const PluginInstallRecordShape = {
  ...InstallRecordShape,
  source: PluginInstallSourceSchema,
  marketplaceName: string().optional(),
  marketplaceSource: string().optional(),
  marketplacePlugin: string().optional(),
};
//#endregion
export { PluginInstallRecordShape as n, InstallRecordShape as t };
