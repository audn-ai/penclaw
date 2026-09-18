//#region packages/terminal-core/src/terminal-link.ts
function stripTerminalLinkControls(value) {
  let out = "";
  for (const char of value) {
    const code = char.charCodeAt(0);
    if (!((code >= 0 && code <= 31) || (code >= 127 && code <= 159))) out += char;
  }
  return out;
}
/** Format a clickable terminal link when supported, otherwise return a readable fallback. */
function formatTerminalLink(label, url, opts) {
  const safeLabel = stripTerminalLinkControls(label);
  const safeUrl = stripTerminalLinkControls(url);
  if (!(opts?.force === true ? true : opts?.force === false ? false : process.stdout.isTTY))
    return opts?.fallback === void 0
      ? `${safeLabel} (${safeUrl})`
      : stripTerminalLinkControls(opts.fallback);
  return `\u001b]8;;${safeUrl}\u0007${safeLabel}\u001b]8;;\u0007`;
}
//#endregion
export { formatTerminalLink as t };
