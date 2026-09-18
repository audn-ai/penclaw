//#region packages/terminal-core/src/progress-line.ts
let activeStream = null;
/** Register the stream that currently owns an inline progress line. */
function registerActiveProgressLine(stream) {
  if (!stream.isTTY) return;
  activeStream = stream;
}
/** Clear the active progress line when it is attached to a TTY stream. */
function clearActiveProgressLine() {
  if (!activeStream?.isTTY) return;
  activeStream.write("\r\x1B[2K");
}
/** Unregister the active progress line, optionally only for a matching stream. */
function unregisterActiveProgressLine(stream) {
  if (!activeStream) return;
  if (stream && activeStream !== stream) return;
  activeStream = null;
}
//#endregion
export {
  registerActiveProgressLine as n,
  unregisterActiveProgressLine as r,
  clearActiveProgressLine as t,
};
