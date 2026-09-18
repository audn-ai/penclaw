import { t as BoundedBuffer } from "./bounded-buffer-C08_hwby.js";
//#region src/gateway/terminal/output-ring.ts
/**
 * Last `cap` chars of `chunk`, nudged forward one unit when the cut would land
 * mid-surrogate-pair: a replayed lone surrogate is permanent mojibake, unlike a
 * mid-escape cut the emulator repaints over.
 */
function surrogateSafeTail(chunk, cap) {
  const start = chunk.length - cap;
  const splitsPair =
    start > 0 && /[\uD800-\uDBFF][\uDC00-\uDFFF]/.test(chunk.slice(start - 1, start + 1));
  return chunk.slice(splitsPair ? start + 1 : start);
}
/** Raw output may start mid-escape after whole-write eviction; repaint recovers. */
var TerminalOutputRing = class extends BoundedBuffer {
  constructor(cap) {
    super(
      cap,
      {
        mode: "drop-oldest",
        fit: surrogateSafeTail,
      },
      (chunk) => chunk.length,
    );
  }
  snapshot() {
    return this.values.join("");
  }
};
//#endregion
export { surrogateSafeTail as n, TerminalOutputRing as t };
