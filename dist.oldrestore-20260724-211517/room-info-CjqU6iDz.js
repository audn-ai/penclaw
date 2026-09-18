import { r as isMatrixNotFoundError } from "./errors-DJRnBTUk.js";
//#region extensions/matrix/src/matrix/monitor/room-info.ts
const MAX_TRACKED_ROOM_INFO = 1024;
const MAX_TRACKED_MEMBER_DISPLAY_NAMES = 4096;
function rememberBounded(map, key, value, maxEntries) {
  map.set(key, value);
  if (map.size > maxEntries) {
    const oldest = map.keys().next().value;
    if (typeof oldest === "string") map.delete(oldest);
  }
}
function createMatrixRoomInfoResolver(client) {
  const roomNameCache = /* @__PURE__ */ new Map();
  const roomAliasCache = /* @__PURE__ */ new Map();
  const memberDisplayNameCache = /* @__PURE__ */ new Map();
  const getRoomName = async (roomId) => {
    if (roomNameCache.has(roomId)) return roomNameCache.get(roomId) ?? { nameResolved: false };
    let name;
    let nameResolved = false;
    try {
      const nameState = await client.getRoomStateEvent(roomId, "m.room.name", "");
      nameResolved = true;
      if (nameState && typeof nameState.name === "string") name = nameState.name;
    } catch (err) {
      if (isMatrixNotFoundError(err)) nameResolved = true;
    }
    const info = {
      name,
      nameResolved,
    };
    if (nameResolved) rememberBounded(roomNameCache, roomId, info, MAX_TRACKED_ROOM_INFO);
    return info;
  };
  const getRoomAliases = async (roomId) => {
    const cached = roomAliasCache.get(roomId);
    if (cached) return cached;
    let canonicalAlias;
    let altAliases = [];
    let aliasesResolved = false;
    try {
      const aliasState = await client.getRoomStateEvent(roomId, "m.room.canonical_alias", "");
      aliasesResolved = true;
      if (aliasState && typeof aliasState.alias === "string") canonicalAlias = aliasState.alias;
      const rawAliases = aliasState?.alt_aliases;
      if (Array.isArray(rawAliases))
        altAliases = rawAliases.filter((entry) => typeof entry === "string");
    } catch (err) {
      if (isMatrixNotFoundError(err)) aliasesResolved = true;
    }
    const info = {
      canonicalAlias,
      altAliases,
      aliasesResolved,
    };
    if (aliasesResolved) rememberBounded(roomAliasCache, roomId, info, MAX_TRACKED_ROOM_INFO);
    return info;
  };
  const getRoomInfo = async (roomId, opts = {}) => {
    const { name, nameResolved } = await getRoomName(roomId);
    if (!opts.includeAliases)
      return {
        name,
        altAliases: [],
        nameResolved,
        aliasesResolved: false,
      };
    return {
      name,
      nameResolved,
      ...(await getRoomAliases(roomId)),
    };
  };
  const getMemberDisplayName = async (roomId, userId) => {
    const cacheKey = `${roomId}:${userId}`;
    if (memberDisplayNameCache.has(cacheKey)) return memberDisplayNameCache.get(cacheKey) ?? userId;
    const memberState = await client
      .getRoomStateEvent(roomId, "m.room.member", userId)
      .catch(() => null);
    const displayName =
      memberState && typeof memberState.displayname === "string" ? memberState.displayname : userId;
    rememberBounded(
      memberDisplayNameCache,
      cacheKey,
      displayName,
      MAX_TRACKED_MEMBER_DISPLAY_NAMES,
    );
    return displayName;
  };
  return {
    getRoomAliases,
    getRoomInfo,
    getMemberDisplayName,
  };
}
//#endregion
export { createMatrixRoomInfoResolver as t };
