import { createHash } from "node:crypto";
//#region extensions/anthropic/session-catalog-adoption.ts
const CLAUDE_LOCAL_SESSION_HOST_ID = "gateway:local";
const CLAUDE_ADOPTED_SESSION_KEY_PREFIX = "plugin:anthropic:catalog-adopt:claude:";
function adoptedSourceKey(hostId, threadId) {
  return `${hostId}\0${threadId}`;
}
function adoptedSessionKey(hostId, threadId) {
  const source = hostId === "gateway:local" ? threadId : adoptedSourceKey(hostId, threadId);
  return `${CLAUDE_ADOPTED_SESSION_KEY_PREFIX}${createHash("sha256").update(source).digest("hex")}`;
}
//#endregion
export { adoptedSessionKey as n, adoptedSourceKey as r, CLAUDE_LOCAL_SESSION_HOST_ID as t };
