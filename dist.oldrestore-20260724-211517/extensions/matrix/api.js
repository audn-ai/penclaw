import {
  a as resolveMatrixDefaultOrOnlyAccountId,
  i as resolveMatrixChannelConfig,
  n as requiresExplicitMatrixDefaultAccount,
  r as resolveConfiguredMatrixAccountIds,
  t as findMatrixAccountEntry,
} from "../../account-selection-CiG2_E20.js";
import { t as matrixPlugin } from "../../channel-BCn2FuGm.js";
import {
  n as listMatrixEnvAccountIds,
  r as resolveMatrixEnvAccountToken,
  t as getMatrixScopedEnvVarNames,
} from "../../env-vars-DmaJQ3mO.js";
import {
  n as matrixSetupAdapter,
  t as createMatrixSetupWizardProxy,
} from "../../setup-core-jlLCuFmn.js";
import { t as matrixOnboardingAdapter } from "../../setup-surface-Bq5pR3WW.js";
import {
  a as resolveMatrixCredentialsPath,
  i as resolveMatrixCredentialsFilename,
  n as resolveMatrixAccountStorageRoot,
  o as resolveMatrixHomeserverKey,
  r as resolveMatrixCredentialsDir,
  s as sanitizeMatrixPathSegment,
  t as hashMatrixAccessToken,
} from "../../storage-paths-CUz2Uj34.js";
import { t as createMatrixThreadBindingManager } from "../../thread-bindings-CDArbsZB.js";
import {
  d as setMatrixThreadBindingIdleTimeoutBySessionKey,
  n as getMatrixThreadBindingManager,
  p as setMatrixThreadBindingMaxAgeBySessionKey,
  s as resetMatrixThreadBindingsForTests,
} from "../../thread-bindings-shared-jccfWjhC.js";
//#region extensions/matrix/api.ts
const matrixSessionBindingAdapterChannels = ["matrix"];
//#endregion
export {
  createMatrixSetupWizardProxy,
  createMatrixThreadBindingManager,
  findMatrixAccountEntry,
  getMatrixScopedEnvVarNames,
  getMatrixThreadBindingManager,
  hashMatrixAccessToken,
  listMatrixEnvAccountIds,
  matrixOnboardingAdapter,
  matrixOnboardingAdapter as matrixSetupWizard,
  matrixPlugin,
  matrixSessionBindingAdapterChannels,
  matrixSetupAdapter,
  requiresExplicitMatrixDefaultAccount,
  resetMatrixThreadBindingsForTests,
  resolveConfiguredMatrixAccountIds,
  resolveMatrixAccountStorageRoot,
  resolveMatrixChannelConfig,
  resolveMatrixCredentialsDir,
  resolveMatrixCredentialsFilename,
  resolveMatrixCredentialsPath,
  resolveMatrixDefaultOrOnlyAccountId,
  resolveMatrixEnvAccountToken,
  resolveMatrixHomeserverKey,
  sanitizeMatrixPathSegment,
  setMatrixThreadBindingIdleTimeoutBySessionKey,
  setMatrixThreadBindingMaxAgeBySessionKey,
};
