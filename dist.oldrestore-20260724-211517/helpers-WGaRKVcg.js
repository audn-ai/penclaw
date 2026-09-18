import { InvalidArgumentError } from "commander";
import "./parse-finite-number-Z7n6tXLk.js";
import { b as parseStrictPositiveInteger } from "./number-coercion-CJQ8TR--.js";
//#region src/cli/program/helpers.ts
/** Commander option collector for repeatable string flags. */
function collectOption(value, previous = []) {
  return [...previous, value];
}
/** Parse an optional positive integer, treating empty values as unset. */
function parsePositiveIntOrUndefined(value) {
  if (value === void 0 || value === null || value === "") return;
  return parseStrictPositiveInteger(value);
}
/** Parse a positive integer without treating empty values specially. */
function parseStrictPositiveIntOrUndefined(value) {
  return parseStrictPositiveInteger(value);
}
/** Commander argument parser for required positive integer options. */
function parseStrictPositiveIntOption(value, flag) {
  const parsed = parseStrictPositiveInteger(value);
  if (parsed === void 0) throw new InvalidArgumentError(`${flag} must be a positive integer.`);
  return parsed;
}
//#endregion
export {
  parseStrictPositiveIntOrUndefined as i,
  parsePositiveIntOrUndefined as n,
  parseStrictPositiveIntOption as r,
  collectOption as t,
};
