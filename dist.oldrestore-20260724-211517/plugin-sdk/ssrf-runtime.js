import { r as formatErrorMessage } from "../errors-BoHeli7m.js";
import { r as fetchWithSsrFGuard } from "../fetch-guard-Da47iiZE.js";
import { o as isPrivateOrLoopbackHost } from "../net-BpMGIYrw.js";
import {
  _ as resolvePinnedHostnameWithPolicy,
  a as createPinnedDispatcher,
  b as ssrfPolicyFromHttpBaseUrlAllowedOrigin,
  c as isBlockedHostnameOrIp,
  g as resolvePinnedHostname,
  i as closeDispatcher,
  m as mergeSsrFPolicies,
  t as SsrFBlockedError,
  u as isPrivateIpAddress,
  v as resolveSsrFPolicyForUrl,
  y as ssrfPolicyFromHttpBaseUrlAllowedHostname,
} from "../ssrf-keFRGQLq.js";
import {
  d as ssrfPolicyFromPrivateNetworkOptIn,
  i as hasLegacyFlatAllowPrivateNetworkAlias,
  l as ssrfPolicyFromAllowPrivateNetwork,
  n as buildHostnameAllowlistPolicyFromSuffixAllowlist,
  o as isPrivateNetworkOptInEnabled,
  r as createLegacyPrivateNetworkDoctorContract,
  s as migrateLegacyFlatAllowPrivateNetworkAlias,
  t as assertHttpUrlTargetsPrivateNetwork,
  u as ssrfPolicyFromDangerouslyAllowPrivateNetwork,
} from "../ssrf-policy-zxv5oRW2.js";
import "../ssrf-runtime-DJ478vv8.js";
export {
  SsrFBlockedError,
  assertHttpUrlTargetsPrivateNetwork,
  buildHostnameAllowlistPolicyFromSuffixAllowlist,
  closeDispatcher,
  createLegacyPrivateNetworkDoctorContract,
  createPinnedDispatcher,
  fetchWithSsrFGuard,
  formatErrorMessage,
  hasLegacyFlatAllowPrivateNetworkAlias,
  isBlockedHostnameOrIp,
  isPrivateIpAddress,
  isPrivateNetworkOptInEnabled,
  isPrivateOrLoopbackHost,
  mergeSsrFPolicies,
  migrateLegacyFlatAllowPrivateNetworkAlias,
  resolvePinnedHostname,
  resolvePinnedHostnameWithPolicy,
  resolveSsrFPolicyForUrl,
  ssrfPolicyFromAllowPrivateNetwork,
  ssrfPolicyFromDangerouslyAllowPrivateNetwork,
  ssrfPolicyFromHttpBaseUrlAllowedHostname,
  ssrfPolicyFromHttpBaseUrlAllowedOrigin,
  ssrfPolicyFromPrivateNetworkOptIn,
};
