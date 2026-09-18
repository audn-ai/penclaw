//#region src/cli/quote-cli-arg.ts
function quoteCliArg(value) {
  if (/^[A-Za-z0-9_/:=.,@%+-]+$/.test(value)) return value;
  return `'${value.replaceAll("'", "'\\''")}'`;
}
//#endregion
export { quoteCliArg as t };
