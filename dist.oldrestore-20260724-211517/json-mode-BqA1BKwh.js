import { c as hasFlag } from "./argv-zTv4_Dzq.js";
//#region src/cli/program/json-mode.ts
const jsonModeSymbol = Symbol("openclaw.cli.jsonMode");
function commandDefinesJsonOption(command) {
  return command.options.some((option) => option.long === "--json");
}
function getDeclaredCommandJsonMode(command) {
  for (let current = command; current; current = current.parent ?? null) {
    const metadata = current[jsonModeSymbol];
    if (metadata) return metadata;
    if (commandDefinesJsonOption(current)) return "output";
  }
  return null;
}
/** Mark a command as having a special JSON mode beyond ordinary JSON output. */
function setCommandJsonMode(command, mode) {
  command[jsonModeSymbol] = mode;
  return command;
}
function getCommandJsonMode(command, argv = process.argv) {
  if (command.optsWithGlobals().json !== true && !hasFlag(argv, "--json")) return null;
  return getDeclaredCommandJsonMode(command);
}
/** Return true only when `--json` selects machine-readable command output. */
function isCommandJsonOutputMode(command, argv = process.argv) {
  return getCommandJsonMode(command, argv) === "output";
}
//#endregion
export { setCommandJsonMode as n, isCommandJsonOutputMode as t };
