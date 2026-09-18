import chalk, { Chalk } from "chalk";
import { t as LOBSTER_PALETTE } from "./palette-BYlmKNtE.js";
//#region packages/terminal-core/src/theme.ts
const hasForceColor =
  typeof process.env.FORCE_COLOR === "string" &&
  process.env.FORCE_COLOR.trim().length > 0 &&
  process.env.FORCE_COLOR.trim() !== "0";
const baseChalk = process.env.NO_COLOR && !hasForceColor ? new Chalk({ level: 0 }) : chalk;
const hex = (value) => baseChalk.hex(value);
/** Shared terminal theme color functions. */
const theme = {
  accent: hex(LOBSTER_PALETTE.accent),
  accentBright: hex(LOBSTER_PALETTE.accentBright),
  accentDim: hex(LOBSTER_PALETTE.accentDim),
  info: hex(LOBSTER_PALETTE.info),
  success: hex(LOBSTER_PALETTE.success),
  warn: hex(LOBSTER_PALETTE.warn),
  error: hex(LOBSTER_PALETTE.error),
  muted: hex(LOBSTER_PALETTE.muted),
  heading: baseChalk.bold.hex(LOBSTER_PALETTE.accent),
  command: hex(LOBSTER_PALETTE.accentBright),
  option: hex(LOBSTER_PALETTE.warn),
};
/** Return true when color styling is active. */
const isRich = () => baseChalk.level > 0;
/** Conditionally apply a color function based on caller rich-output state. */
const colorize = (rich, color, value) => (rich ? color(value) : value);
//#endregion
export { isRich as n, theme as r, colorize as t };
