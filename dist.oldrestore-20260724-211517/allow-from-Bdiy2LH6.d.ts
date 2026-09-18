//#region src/channels/allow-from.d.ts
/**
 * Prefix that marks an allowFrom entry as an access-group reference instead of a sender id.
 */
declare const ACCESS_GROUP_ALLOW_FROM_PREFIX = "accessGroup:";
/**
 * Parses an access-group allowFrom entry and returns the referenced group name.
 */
declare function parseAccessGroupAllowFromEntry(entry: string): string | null;
/**
 * Merges configured DM allowFrom entries with pairing-store sender ids when policy allows it.
 */
declare function mergeDmAllowFromSources(params: {
  allowFrom?: Array<string | number>;
  storeAllowFrom?: Array<string | number>;
  dmPolicy?: string;
}): string[];
/**
 * Resolves the allowFrom entries used for group chats, optionally falling back to DM policy.
 */
declare function resolveGroupAllowFromSources(params: {
  allowFrom?: Array<string | number>;
  groupAllowFrom?: Array<string | number>;
  fallbackToAllowFrom?: boolean;
}): string[];
/**
 * Returns the first value that is present, preserving falsy values such as false, 0, and "".
 */
declare function firstDefined<T>(...values: Array<T | undefined>): (T & ({} | null)) | undefined;
/**
 * Checks a normalized sender allowlist with wildcard and empty-list policy handling.
 */
declare function isSenderIdAllowed(
  allow: {
    entries: string[];
    hasWildcard: boolean;
    hasEntries: boolean;
  },
  senderId: string | undefined,
  allowWhenEmpty: boolean,
): boolean;
//#endregion
export {
  parseAccessGroupAllowFromEntry as a,
  mergeDmAllowFromSources as i,
  firstDefined as n,
  resolveGroupAllowFromSources as o,
  isSenderIdAllowed as r,
  ACCESS_GROUP_ALLOW_FROM_PREFIX as t,
};
