import { s as resolveSafeTimeoutDelayMs } from "./timeouts-Dewo7BbT.js";
//#region src/utils/timer-delay.ts
/** Wrapper around setTimeout that clamps unsafe or invalid delays before arming the timer. */
function setSafeTimeout(callback, delayMs, opts) {
  return setTimeout(callback, resolveSafeTimeoutDelayMs(delayMs, opts));
}
//#endregion
export { setSafeTimeout as t };
