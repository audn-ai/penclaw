import "./safe-text-DiGQuw-e.js";
import "./assistant-visible-text-DV1Yognj.js";
import "./directive-tags-Btb1ssgA.js";
import { t as chunkTextByBreakResolver } from "./text-chunking-B6X1chGx.js";
import "./tables-YoFSvuf8.js";
import "./chunk-items-BB3E9W12.js";
import "./auto-linked-file-ref-DIO7giFK.js";
//#region src/plugin-sdk/text-chunking.ts
/**
 * Splits outbound channel text into chunks no longer than the requested limit.
 * Newline boundaries win over spaces; text without usable separators falls back
 * to a hard character split so channel senders always receive bounded strings.
 */
function chunkTextForOutbound(text, limit) {
  return chunkTextByBreakResolver(text, limit, (window) => {
    const lastNewline = window.lastIndexOf("\n");
    const lastSpace = window.lastIndexOf(" ");
    return lastNewline > 0 ? lastNewline : lastSpace;
  });
}
//#endregion
export { chunkTextForOutbound as t };
