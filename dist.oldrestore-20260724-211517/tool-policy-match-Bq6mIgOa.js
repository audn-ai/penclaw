import { n as matchesAnyGlobPattern, t as compileGlobPatterns } from "./glob-pattern-CrqljM7B.js";
import { f as expandToolGroups, m as normalizeToolName } from "./tool-policy-1QHiwXPv.js";
//#region src/agents/tool-policy-match.ts
/**
 * Runtime matcher for sandbox tool policies. Deny patterns always win, then
 * an empty allow list means "allow everything not denied".
 */
function makeToolPolicyMatcher(policy) {
  const deny = compileGlobPatterns({
    raw: expandToolGroups(policy.deny ?? []),
    normalize: normalizeToolName,
  });
  const allow = compileGlobPatterns({
    raw: expandToolGroups(policy.allow ?? []),
    normalize: normalizeToolName,
  });
  return (name) => {
    const normalized = normalizeToolName(name);
    if (matchesAnyGlobPattern(normalized, deny)) return false;
    if (allow.length === 0) return true;
    if (matchesAnyGlobPattern(normalized, allow)) return true;
    if (normalized === "apply_patch" && matchesAnyGlobPattern("write", allow)) return true;
    return false;
  };
}
/** Return whether one tool name is allowed by a single sandbox policy. */
function isToolAllowedByPolicyName(name, policy) {
  if (!policy) return true;
  return makeToolPolicyMatcher(policy)(name);
}
/** Return whether one tool name is allowed by every active sandbox policy. */
function isToolAllowedByPolicies(name, policies) {
  return policies.every((policy) => isToolAllowedByPolicyName(name, policy));
}
//#endregion
export { isToolAllowedByPolicyName as n, isToolAllowedByPolicies as t };
