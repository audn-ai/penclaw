//#region src/infra/system-message.d.ts
declare const SYSTEM_MARK = "\u2699\uFE0F";
/** Return true when text already carries the system-message prefix. */
declare function hasSystemMark(text: string): boolean;
/** Prefix non-empty text as a system message without double-prefixing. */
declare function prefixSystemMessage(text: string): string;
//#endregion
export { hasSystemMark as n, prefixSystemMessage as r, SYSTEM_MARK as t };
