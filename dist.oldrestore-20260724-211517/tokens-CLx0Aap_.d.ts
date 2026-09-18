//#region src/auto-reply/tokens.d.ts
/** Token that marks a heartbeat response as an acknowledgement with no user notification. */
declare const HEARTBEAT_TOKEN = "HEARTBEAT_OK";
/** Token that marks an auto-reply response as intentionally silent. */
declare const SILENT_REPLY_TOKEN = "NO_REPLY";
/** Returns true only for token-only silent replies. */
declare function isSilentReplyText(text: string | undefined, token?: string): boolean;
/** Returns true for token-only, JSON-envelope, or reasoning-prefixed silent payload text. */
declare function isSilentReplyPayloadText(text: string | undefined, token?: string): boolean;
//#endregion
export {
  isSilentReplyText as i,
  SILENT_REPLY_TOKEN as n,
  isSilentReplyPayloadText as r,
  HEARTBEAT_TOKEN as t,
};
