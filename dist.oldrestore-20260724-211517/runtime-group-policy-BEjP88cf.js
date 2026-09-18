import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region src/config/runtime-group-policy.ts
/**
 * Resolve the effective group policy for a channel/provider runtime.
 * Missing provider config can fail closed separately from configured providers.
 */
function resolveRuntimeGroupPolicy(params) {
  const configuredFallbackPolicy = params.configuredFallbackPolicy ?? "open";
  const missingProviderFallbackPolicy = params.missingProviderFallbackPolicy ?? "allowlist";
  return {
    groupPolicy: params.providerConfigPresent
      ? (params.groupPolicy ?? params.defaultGroupPolicy ?? configuredFallbackPolicy)
      : (params.groupPolicy ?? missingProviderFallbackPolicy),
    providerMissingFallbackApplied: !params.providerConfigPresent && params.groupPolicy === void 0,
  };
}
/** Read the shared channels default group policy used by provider-specific resolvers. */
function resolveDefaultGroupPolicy(cfg) {
  return cfg.channels?.defaults?.groupPolicy;
}
/** Human labels for the access surface blocked by a missing-provider fallback. */
const GROUP_POLICY_BLOCKED_LABEL = {
  group: "group messages",
  guild: "guild messages",
  room: "room messages",
  channel: "channel messages",
  space: "space messages",
};
/**
 * Resolve the standard channel-provider policy.
 * Configured providers default open; missing provider config defaults allowlist.
 */
function resolveOpenProviderRuntimeGroupPolicy(params) {
  return resolveRuntimeGroupPolicy({
    providerConfigPresent: params.providerConfigPresent,
    groupPolicy: params.groupPolicy,
    defaultGroupPolicy: params.defaultGroupPolicy,
    configuredFallbackPolicy: "open",
    missingProviderFallbackPolicy: "allowlist",
  });
}
/**
 * Resolve the strict channel-provider policy.
 * Configured and missing provider config both default allowlist.
 */
function resolveAllowlistProviderRuntimeGroupPolicy(params) {
  return resolveRuntimeGroupPolicy({
    providerConfigPresent: params.providerConfigPresent,
    groupPolicy: params.groupPolicy,
    defaultGroupPolicy: params.defaultGroupPolicy,
    configuredFallbackPolicy: "allowlist",
    missingProviderFallbackPolicy: "allowlist",
  });
}
const warnedMissingProviderGroupPolicy = /* @__PURE__ */ new Set();
/**
 * Log the missing-provider fail-closed fallback once per provider/account.
 * Returns true only when this call emitted the warning.
 */
function warnMissingProviderGroupPolicyFallbackOnce(params) {
  if (!params.providerMissingFallbackApplied) return false;
  const key = `${params.providerKey}:${params.accountId ?? "*"}`;
  if (warnedMissingProviderGroupPolicy.has(key)) return false;
  warnedMissingProviderGroupPolicy.add(key);
  const blockedLabel = normalizeOptionalString(params.blockedLabel) || "group messages";
  params.log(
    `${params.providerKey}: channels.${params.providerKey} is missing; defaulting groupPolicy to "allowlist" (${blockedLabel} blocked until explicitly configured).`,
  );
  return true;
}
//#endregion
export {
  warnMissingProviderGroupPolicyFallbackOnce as a,
  resolveOpenProviderRuntimeGroupPolicy as i,
  resolveAllowlistProviderRuntimeGroupPolicy as n,
  resolveDefaultGroupPolicy as r,
  GROUP_POLICY_BLOCKED_LABEL as t,
};
