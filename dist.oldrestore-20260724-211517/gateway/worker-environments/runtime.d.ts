import { a as CommandOptions, s as SpawnResult } from "../../exec-D8nvu0GV.js";
import { Cv as WorkerAdmissionHandshake } from "../../index-F2ydESCy.js";
import { t as resolveSecretRefString } from "../../resolve-B20TjsQr.js";
import {
  $n as WorkerProvider,
  Qn as WorkerProfile,
  nr as WorkerSshIdentity,
  tr as WorkerSshEndpoint,
} from "../../types-Ga3mNO_F.js";
import { h as SecretRef } from "../../types.secrets-C15Z_eLX.js";

//#region src/gateway/worker-environments/bundle.d.ts
type WorkerInstallationArtifactBase = {
  bundleHash: string;
  openclawVersion: string;
  protocolFeatures: readonly string[];
};
type WorkerBundleArtifact = WorkerInstallationArtifactBase & {
  install: "bundle";
  tarballSha256: string;
  tarballPath: string;
};
type WorkerNpmArtifact = WorkerInstallationArtifactBase & {
  install: "npm";
  packageIntegrity: string;
  packageSpec: string;
};
type WorkerInstallationArtifact = WorkerBundleArtifact | WorkerNpmArtifact;
type WorkerBundleProducer = {
  prepare: () => Promise<WorkerBundleArtifact>;
};
type WorkerBundleProducerOptions = {
  packageRoot?: string;
  cacheDir?: string;
  openclawVersion?: string;
  protocolFeatures?: readonly string[];
};
type WorkerNpmPackageInstallCheck = (packageRoot: string) => Promise<boolean>;
type WorkerNpmReleaseVerifier = (params: {
  bundleHash: string;
  version: string;
}) => Promise<string>;
/** Creates a process-lifecycle bundle producer that scans the running build at most once. */
declare function createWorkerBundleProducer(
  options?: WorkerBundleProducerOptions,
): WorkerBundleProducer;
/**
 * Selects the exact npm package only after the public tarball's canonical worker manifest proves
 * parity with the running gateway bundle.
 */
declare function resolveWorkerNpmInstallationArtifact(params: {
  bundle: WorkerBundleArtifact;
  packageRoot?: string;
  isPackageInstall?: WorkerNpmPackageInstallCheck;
  verifyRelease?: WorkerNpmReleaseVerifier;
}): Promise<WorkerNpmArtifact>;
//#endregion
//#region src/gateway/worker-environments/bootstrap.d.ts
type ResolvedWorkerSshIdentity = WorkerSshIdentity;
type WorkerBootstrapCommandRunner = (
  argv: string[],
  options: CommandOptions,
) => Promise<SpawnResult>;
type WorkerBootstrapRequest = {
  ssh: WorkerSshEndpoint;
  artifact: WorkerInstallationArtifact /** Provider endpoint host key copied by the gateway bootstrap adapter. */;
  pinnedHostKey?: string;
};
type WorkerBootstrapDependencies = {
  resolveIdentity: (keyRef: WorkerSshEndpoint["keyRef"]) => Promise<ResolvedWorkerSshIdentity>;
  runCommand?: WorkerBootstrapCommandRunner;
  timeoutMs?: number;
  signal?: AbortSignal;
};
/** Installs one exact worker artifact over SSH and returns its admission receipt. */
declare function bootstrapWorker(
  request: WorkerBootstrapRequest,
  dependencies: WorkerBootstrapDependencies,
): Promise<WorkerAdmissionHandshake>;
//#endregion
//#region src/gateway/worker-environments/identity.d.ts
type GenericWorkerSshIdentityResolver = (keyRef: SecretRef) => Promise<WorkerSshIdentity>;
/** Routes dynamic identities to their provider owner and configured refs to the generic resolver. */
declare function resolveWorkerSshIdentity(params: {
  provider: WorkerProvider;
  leaseId: string;
  profile: WorkerProfile;
  keyRef: SecretRef;
  resolveGeneric: GenericWorkerSshIdentityResolver;
}): Promise<WorkerSshIdentity>;
//#endregion
export {
  bootstrapWorker,
  createWorkerBundleProducer,
  resolveSecretRefString,
  resolveWorkerNpmInstallationArtifact,
  resolveWorkerSshIdentity,
};
