import { t as isPlainObject } from "./plain-object-jVBUx3XB.js";
//#region src/config/commands.flags.ts
function getOwnCommandFlagValue(config, key) {
  const { commands } = config ?? {};
  if (!isPlainObject(commands) || !Object.hasOwn(commands, key)) return;
  return commands[key];
}
/** Returns true only when a command flag is explicitly enabled. */
function isCommandFlagEnabled(config, key) {
  return getOwnCommandFlagValue(config, key) === true;
}
/** Returns the public restart command state; restart defaults on and is disabled only by false. */
function isRestartEnabled(config) {
  return getOwnCommandFlagValue(config, "restart") !== false;
}
//#endregion
export { isRestartEnabled as n, isCommandFlagEnabled as t };
