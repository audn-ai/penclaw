//#region packages/terminal-core/src/stream-writer.d.ts
/** Hooks for safe stream writes. */
type SafeStreamWriterOptions = {
  beforeWrite?: () => void;
  onBrokenPipe?: (err: NodeJS.ErrnoException, stream: NodeJS.WriteStream) => void;
};
/** Writer facade that tracks closed/broken-pipe state. */
type SafeStreamWriter = {
  write: (stream: NodeJS.WriteStream, text: string) => boolean;
  writeLine: (stream: NodeJS.WriteStream, text: string) => boolean;
  reset: () => void;
  isClosed: () => boolean;
};
/** Create a stream writer that stops writing after EPIPE/EIO. */
declare function createSafeStreamWriter(options?: SafeStreamWriterOptions): SafeStreamWriter;
//#endregion
export { SafeStreamWriterOptions as n, createSafeStreamWriter as r, SafeStreamWriter as t };
