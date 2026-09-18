//#region packages/terminal-core/src/progress-line.d.ts
/** Register the stream that currently owns an inline progress line. */
declare function registerActiveProgressLine(stream: NodeJS.WriteStream): void;
/** Clear the active progress line when it is attached to a TTY stream. */
declare function clearActiveProgressLine(): void;
/** Unregister the active progress line, optionally only for a matching stream. */
declare function unregisterActiveProgressLine(stream?: NodeJS.WriteStream): void;
//#endregion
export {
  registerActiveProgressLine as n,
  unregisterActiveProgressLine as r,
  clearActiveProgressLine as t,
};
