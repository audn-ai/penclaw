//#region packages/terminal-core/src/terminal-link.d.ts
/** Format a clickable terminal link when supported, otherwise return a readable fallback. */
declare function formatTerminalLink(
  label: string,
  url: string,
  opts?: {
    fallback?: string;
    force?: boolean;
  },
): string;
//#endregion
export { formatTerminalLink as t };
