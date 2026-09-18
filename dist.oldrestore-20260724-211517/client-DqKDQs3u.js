import {
  i as resolveMatrixConfigForAccount,
  n as resolveMatrixAuth,
  r as resolveMatrixAuthContext,
  t as backfillMatrixAuthDeviceIdAfterStartup,
} from "./config-sv-OBcvj.js";
import { t as createMatrixClient } from "./create-client-CINQAL-h.js";
import {
  i as resolveScopedMatrixEnvConfig,
  r as resolveMatrixEnvAuthReadiness,
  t as hasReadyMatrixEnvAuth,
} from "./env-auth-GBg-erEj.js";
import { t as getMatrixScopedEnvVarNames } from "./env-vars-DmaJQ3mO.js";
import { t as isBunRuntime } from "./runtime-BefyhPWv.js";
import {
  i as resolveSharedMatrixClient,
  n as releaseSharedClientInstance,
  o as stopSharedClientForAccount,
  r as removeSharedClientInstance,
  s as stopSharedClientInstance,
  t as acquireSharedMatrixClient,
} from "./shared-BQILq3IO.js";
import {
  n as validateMatrixHomeserverUrl,
  t as resolveValidatedMatrixHomeserverUrl,
} from "./url-validation-Bz1uO1l1.js";
import "./client-Cy4l1-OV.js";
export {
  acquireSharedMatrixClient,
  backfillMatrixAuthDeviceIdAfterStartup,
  createMatrixClient,
  getMatrixScopedEnvVarNames,
  hasReadyMatrixEnvAuth,
  isBunRuntime,
  releaseSharedClientInstance,
  removeSharedClientInstance,
  resolveMatrixAuth,
  resolveMatrixAuthContext,
  resolveMatrixConfigForAccount,
  resolveMatrixEnvAuthReadiness,
  resolveScopedMatrixEnvConfig,
  resolveSharedMatrixClient,
  resolveValidatedMatrixHomeserverUrl,
  stopSharedClientForAccount,
  stopSharedClientInstance,
  validateMatrixHomeserverUrl,
};
