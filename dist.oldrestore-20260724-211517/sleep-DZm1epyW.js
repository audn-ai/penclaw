import { j as resolveTimerTimeoutMs } from "./number-coercion-CJQ8TR--.js";
import "./number-coercion-EqFmHmOw.js";
//#region src/utils/sleep.ts
/** Promise-based sleep that clamps timer inputs through the shared timeout resolver. */
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, resolveTimerTimeoutMs(ms, 0, 0));
  });
}
//#endregion
export { sleep as t };
