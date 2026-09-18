import fs from "node:fs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-B-Fc-m0I.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import { u as ssrfPolicyFromDangerouslyAllowPrivateNetwork } from "./ssrf-policy-zxv5oRW2.js";
import "./ssrf-runtime-DJ478vv8.js";
import {
  d as writeStorageMeta,
  l as resolveMatrixStoragePaths,
  r as maybeMigrateLegacyStorage,
} from "./storage-DhdP97oK.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import "./config-sv-OBcvj.js";
import { t as resolveValidatedMatrixHomeserverUrl } from "./url-validation-Bz1uO1l1.js";
//#region extensions/matrix/src/matrix/client/create-client.ts
const loadMatrixCreateClientRuntimeDeps = createLazyRuntimeModule(() =>
  Promise.all([import("./sdk-DamASCdJ.js"), import("./logging-Q9gq6rz_.js")]).then(
    ([sdkModule, loggingModule]) => ({
      MatrixClient: sdkModule.MatrixClient,
      ensureMatrixSdkLoggingConfigured: loggingModule.ensureMatrixSdkLoggingConfigured,
    }),
  ),
);
async function createMatrixClient(params) {
  const { MatrixClient, ensureMatrixSdkLoggingConfigured } =
    await loadMatrixCreateClientRuntimeDeps();
  ensureMatrixSdkLoggingConfigured();
  const homeserver = await resolveValidatedMatrixHomeserverUrl(params.homeserver, {
    dangerouslyAllowPrivateNetwork: params.allowPrivateNetwork,
  });
  const matrixClientUserId = normalizeOptionalString(params.userId);
  const userId = matrixClientUserId ?? "unknown";
  const storagePaths =
    params.persistStorage !== false
      ? resolveMatrixStoragePaths({
          homeserver,
          userId,
          accessToken: params.accessToken,
          accountId: params.accountId,
          deviceId: params.deviceId,
          env: process.env,
        })
      : null;
  if (storagePaths) {
    await maybeMigrateLegacyStorage({
      storagePaths,
      env: process.env,
    });
    fs.mkdirSync(storagePaths.rootDir, { recursive: true });
    writeStorageMeta({
      storagePaths,
      homeserver,
      userId,
      accountId: params.accountId,
      deviceId: params.deviceId,
    });
  }
  const cryptoDatabasePrefix = storagePaths
    ? `openclaw-matrix-${storagePaths.accountKey}-${storagePaths.tokenHash}`
    : void 0;
  return new MatrixClient(homeserver, params.accessToken, {
    userId: matrixClientUserId,
    password: params.password,
    deviceId: params.deviceId,
    encryption: params.encryption,
    localTimeoutMs: params.localTimeoutMs,
    initialSyncLimit: params.initialSyncLimit,
    storageRootDir: storagePaths?.rootDir,
    recoveryKeyPath: storagePaths?.recoveryKeyPath,
    idbSnapshotPath: storagePaths?.idbSnapshotPath,
    cryptoDatabasePrefix,
    autoBootstrapCrypto: params.autoBootstrapCrypto,
    ssrfPolicy:
      params.ssrfPolicy ?? ssrfPolicyFromDangerouslyAllowPrivateNetwork(params.allowPrivateNetwork),
    dispatcherPolicy: params.dispatcherPolicy,
  });
}
//#endregion
export { createMatrixClient as t };
