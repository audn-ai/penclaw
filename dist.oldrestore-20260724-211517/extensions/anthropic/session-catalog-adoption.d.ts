//#region extensions/anthropic/session-catalog-adoption.d.ts
declare const CLAUDE_LOCAL_SESSION_HOST_ID = "gateway:local";
declare function adoptedSourceKey(hostId: string, threadId: string): string;
declare function adoptedSessionKey(hostId: string, threadId: string): string;
//#endregion
export { CLAUDE_LOCAL_SESSION_HOST_ID, adoptedSessionKey, adoptedSourceKey };
