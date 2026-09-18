import { n as sliceUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
import "./text-utility-runtime-CJESZCN5.js";
//#region extensions/file-transfer/src/shared/append-bounded-text-tail.ts
function projectBoundedTextTail(text, maxChars) {
  return sliceUtf16Safe(text, Math.max(0, text.length - maxChars));
}
//#endregion
export { projectBoundedTextTail as t };
