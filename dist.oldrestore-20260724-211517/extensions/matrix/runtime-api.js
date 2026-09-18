import {
  a as resolveMatrixDefaultOrOnlyAccountId,
  i as resolveMatrixChannelConfig,
  n as requiresExplicitMatrixDefaultAccount,
  o as resolveMatrixAccountStringValues,
  r as resolveConfiguredMatrixAccountIds,
  t as findMatrixAccountEntry,
} from "../../account-selection-CiG2_E20.js";
import { n as ensureMatrixSdkInstalled, r as isMatrixSdkAvailable } from "../../deps-C6pm28wx.js";
import {
  n as listMatrixEnvAccountIds,
  r as resolveMatrixEnvAccountToken,
  t as getMatrixScopedEnvVarNames,
} from "../../env-vars-DmaJQ3mO.js";
import "../../ssrf-runtime-DJ478vv8.js";
import { r as formatZonedTimestamp } from "../../format-datetime-Bp7Mn3G9.js";
import { i as writeJsonFileAtomically } from "../../json-store-CSxUwOCu.js";
import { r as setMatrixRuntime } from "../../runtime-C3viBnoh.js";
import {
  _ as resolvePinnedHostnameWithPolicy,
  a as createPinnedDispatcher,
  i as closeDispatcher,
} from "../../ssrf-keFRGQLq.js";
import {
  l as ssrfPolicyFromAllowPrivateNetwork,
  t as assertHttpUrlTargetsPrivateNetwork,
  u as ssrfPolicyFromDangerouslyAllowPrivateNetwork,
} from "../../ssrf-policy-zxv5oRW2.js";
import {
  a as resolveMatrixCredentialsPath,
  i as resolveMatrixCredentialsFilename,
  n as resolveMatrixAccountStorageRoot,
  o as resolveMatrixHomeserverKey,
  r as resolveMatrixCredentialsDir,
  s as sanitizeMatrixPathSegment,
  t as hashMatrixAccessToken,
} from "../../storage-paths-CUz2Uj34.js";
import {
  d as setMatrixThreadBindingIdleTimeoutBySessionKey,
  p as setMatrixThreadBindingMaxAgeBySessionKey,
} from "../../thread-bindings-shared-jccfWjhC.js";
//#region extensions/matrix/runtime-api.ts
function chunkTextForOutbound(text, limit) {
  const chunks = [];
  let remaining = text;
  while (remaining.length > limit) {
    const window = remaining.slice(0, limit);
    const splitAt = Math.max(window.lastIndexOf("\n"), window.lastIndexOf(" "));
    const breakAt = splitAt > 0 ? splitAt : limit;
    chunks.push(remaining.slice(0, breakAt).trimEnd());
    remaining = remaining.slice(breakAt).trimStart();
  }
  if (remaining.length > 0 || text.length === 0) chunks.push(remaining);
  return chunks;
}
//#endregion
export {
  assertHttpUrlTargetsPrivateNetwork,
  chunkTextForOutbound,
  closeDispatcher,
  createPinnedDispatcher,
  ensureMatrixSdkInstalled,
  findMatrixAccountEntry,
  formatZonedTimestamp,
  getMatrixScopedEnvVarNames,
  hashMatrixAccessToken,
  isMatrixSdkAvailable,
  listMatrixEnvAccountIds,
  requiresExplicitMatrixDefaultAccount,
  resolveConfiguredMatrixAccountIds,
  resolveMatrixAccountStorageRoot,
  resolveMatrixAccountStringValues,
  resolveMatrixChannelConfig,
  resolveMatrixCredentialsDir,
  resolveMatrixCredentialsFilename,
  resolveMatrixCredentialsPath,
  resolveMatrixDefaultOrOnlyAccountId,
  resolveMatrixEnvAccountToken,
  resolveMatrixHomeserverKey,
  resolvePinnedHostnameWithPolicy,
  sanitizeMatrixPathSegment,
  setMatrixRuntime,
  setMatrixThreadBindingIdleTimeoutBySessionKey,
  setMatrixThreadBindingMaxAgeBySessionKey,
  ssrfPolicyFromAllowPrivateNetwork,
  ssrfPolicyFromDangerouslyAllowPrivateNetwork,
  writeJsonFileAtomically,
};
