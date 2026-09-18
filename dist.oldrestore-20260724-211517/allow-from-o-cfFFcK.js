import { l as normalizeStringEntries } from "./string-normalization-CRyoFBPt.js";
//#region src/channels/allow-from.ts
/**
 * Channel allowFrom policy helpers.
 *
 * Merges DM/group allowlists and checks normalized sender entries.
 */
/**
 * Prefix that marks an allowFrom entry as an access-group reference instead of a sender id.
 */
const ACCESS_GROUP_ALLOW_FROM_PREFIX = "accessGroup:";
/**
 * Parses an access-group allowFrom entry and returns the referenced group name.
 */
function parseAccessGroupAllowFromEntry(entry) {
  const trimmed = entry.trim();
  if (!trimmed.startsWith("accessGroup:")) return null;
  const name = trimmed.slice(12).trim();
  return name.length > 0 ? name : null;
}
/**
 * Merges configured DM allowFrom entries with pairing-store sender ids when policy allows it.
 */
function mergeDmAllowFromSources(params) {
  const storeEntries =
    params.dmPolicy === "allowlist" || params.dmPolicy === "open"
      ? []
      : (params.storeAllowFrom ?? []);
  return normalizeStringEntries([...(params.allowFrom ?? []), ...storeEntries]);
}
/**
 * Resolves the allowFrom entries used for group chats, optionally falling back to DM policy.
 */
function resolveGroupAllowFromSources(params) {
  const explicitGroupAllowFrom =
    Array.isArray(params.groupAllowFrom) && params.groupAllowFrom.length > 0
      ? params.groupAllowFrom
      : void 0;
  return normalizeStringEntries(
    explicitGroupAllowFrom
      ? explicitGroupAllowFrom
      : params.fallbackToAllowFrom === false
        ? []
        : (params.allowFrom ?? []),
  );
}
/**
 * Returns the first value that is present, preserving falsy values such as false, 0, and "".
 */
function firstDefined(...values) {
  for (const value of values) if (value !== void 0) return value;
}
/**
 * Checks a normalized sender allowlist with wildcard and empty-list policy handling.
 */
function isSenderIdAllowed(allow, senderId, allowWhenEmpty) {
  if (!allow.hasEntries) return allowWhenEmpty;
  if (allow.hasWildcard) return true;
  if (!senderId) return false;
  return allow.entries.includes(senderId);
}
//#endregion
export {
  parseAccessGroupAllowFromEntry as a,
  mergeDmAllowFromSources as i,
  firstDefined as n,
  resolveGroupAllowFromSources as o,
  isSenderIdAllowed as r,
  ACCESS_GROUP_ALLOW_FROM_PREFIX as t,
};
