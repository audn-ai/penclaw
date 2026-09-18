import { C as testRegexWithBoundedInput, b as compileSafeRegex } from "./redact-CUe6Oey5.js";
import { c as parseAgentSessionKey } from "./session-key-utils-B8sNp9l4.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region src/infra/approval-request-filters.ts
/** Matches session filters as literal substrings first, then bounded safe regexes. */
function matchesApprovalRequestSessionFilter(sessionKey, patterns) {
  return patterns.some((pattern) => {
    if (sessionKey.includes(pattern)) return true;
    const regex = compileSafeRegex(pattern);
    return regex ? testRegexWithBoundedInput(regex, sessionKey) : false;
  });
}
/**
 * Applies optional approval request filters for agent ids and session keys.
 * Agent id can be parsed from the session key only when the caller opts in.
 */
function matchesApprovalRequestFilters(params) {
  if (params.agentFilter?.length) {
    const explicitAgentId = normalizeOptionalString(params.request.agentId);
    const sessionAgentId = params.fallbackAgentIdFromSessionKey
      ? (parseAgentSessionKey(params.request.sessionKey)?.agentId ?? void 0)
      : void 0;
    const agentId = explicitAgentId ?? sessionAgentId;
    if (!agentId || !params.agentFilter.includes(agentId)) return false;
  }
  if (params.sessionFilter?.length) {
    const sessionKey = normalizeOptionalString(params.request.sessionKey);
    if (!sessionKey || !matchesApprovalRequestSessionFilter(sessionKey, params.sessionFilter))
      return false;
  }
  return true;
}
//#endregion
export { matchesApprovalRequestSessionFilter as n, matchesApprovalRequestFilters as t };
