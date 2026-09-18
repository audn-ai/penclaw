//#region packages/terminal-core/src/ansi.d.ts
declare function stripAnsi(input: string): string;
declare function stripAnsiSequences(input: string): string;
/** Preserve pending CSI visibly because an output chunk boundary is not true EOF. */
declare function stripAnsiForStreamChunk(
  input: string,
  options?: {
    compatibilityGrammar?: boolean;
  },
): string;
declare function splitGraphemes(input: string): string[];
/**
 * Sanitize a value for safe interpolation into log messages.
 * Strips ANSI escape sequences, C0/C1 control characters, and DEL to
 * prevent log forging / terminal escape injection (CWE-117).
 */
declare function sanitizeForLog(v: string): string;
declare function visibleWidth(input: string): number;
/**
 * Truncate to at most `maxWidth` visible columns, dropping whole grapheme
 * clusters that would overflow while preserving zero-width ANSI sequences
 * verbatim. Independently executed controls inside CSI count toward the budget
 * while the containing sequence stays atomic. A single wide grapheme that
 * cannot fit is dropped whole, so `visibleWidth(result) <= maxWidth`.
 */
declare function truncateToVisibleWidth(input: string, maxWidth: number): string;
//#endregion
export {
  stripAnsiSequences as a,
  stripAnsiForStreamChunk as i,
  splitGraphemes as n,
  truncateToVisibleWidth as o,
  stripAnsi as r,
  visibleWidth as s,
  sanitizeForLog as t,
};
