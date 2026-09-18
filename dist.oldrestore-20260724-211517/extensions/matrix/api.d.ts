import { t as matrixPlugin } from "../../channel-dSikRL6V.js";
import {
  n as createMatrixSetupWizardProxy,
  r as matrixSetupAdapter,
  t as matrixOnboardingAdapter,
} from "../../setup-surface-B-N9RBlG.js";
import {
  a as resolveMatrixCredentialsPath,
  c as getMatrixScopedEnvVarNames,
  d as findMatrixAccountEntry,
  f as requiresExplicitMatrixDefaultAccount,
  h as resolveMatrixDefaultOrOnlyAccountId,
  i as resolveMatrixCredentialsFilename,
  l as listMatrixEnvAccountIds,
  m as resolveMatrixChannelConfig,
  n as resolveMatrixAccountStorageRoot,
  o as resolveMatrixHomeserverKey,
  p as resolveConfiguredMatrixAccountIds,
  r as resolveMatrixCredentialsDir,
  s as sanitizeMatrixPathSegment,
  t as hashMatrixAccessToken,
  u as resolveMatrixEnvAccountToken,
} from "../../storage-paths-CzgiPIV9.js";
import { t as createMatrixThreadBindingManager } from "../../thread-bindings-iKEXUrzB.js";
import {
  a as setMatrixThreadBindingMaxAgeBySessionKey,
  i as setMatrixThreadBindingIdleTimeoutBySessionKey,
  n as getMatrixThreadBindingManager,
  r as resetMatrixThreadBindingsForTests,
} from "../../thread-bindings-shared-d5fQZug_.js";

//#region extensions/matrix/api.d.ts
declare const matrixSessionBindingAdapterChannels: readonly ["matrix"];
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
