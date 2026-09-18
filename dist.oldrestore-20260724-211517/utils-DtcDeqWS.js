import fs from "node:fs";
import os from "node:os";
import "./sleep-DZm1epyW.js";
import path from "node:path";
import { v as pathExists$1 } from "./fs-safe-RNq3oO57.js";
import {
  c as resolveUserPath,
  n as resolveEffectiveHomeDir,
  o as resolveRequiredHomeDir,
} from "./home-dir-DxrrpDft.js";
//#region src/utils.ts
/** Creates a directory tree if it does not already exist. */
async function ensureDir(dir) {
  await fs.promises.mkdir(dir, { recursive: true });
}
/** Clamps a number to an inclusive min/max range. */
function clampNumber(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
/** Floors a number before clamping it to an inclusive min/max range. */
function clampInt(value, min, max) {
  return clampNumber(Math.floor(value), min, max);
}
/** Alias for clampNumber (shorter, more common name) */
const clamp = clampNumber;
/**
 * Safely parse JSON, returning null on error instead of throwing.
 */
function safeParseJson(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
/** Normalizes phone-like input into the loose E.164 shape used by channel helpers. */
function normalizeE164(number) {
  const digits = number
    .replace(/^[a-z][a-z0-9-]*:/i, "")
    .trim()
    .replace(/\D/g, "");
  return digits ? `+${digits}` : "";
}
/** Resolves the OpenClaw config directory from state/config env overrides or home. */
function resolveConfigDir(env = process.env, homedir = os.homedir) {
  const override = env.OPENCLAW_STATE_DIR?.trim();
  if (override) return resolveUserPath(override, env, homedir);
  const configPath = env.OPENCLAW_CONFIG_PATH?.trim();
  if (configPath) return path.dirname(resolveUserPath(configPath, env, homedir));
  const newDir = path.join(resolveRequiredHomeDir(env, homedir), ".openclaw");
  try {
    if (fs.existsSync(newDir)) return newDir;
  } catch {}
  return newDir;
}
/** Resolves the effective OpenClaw home directory, if one can be determined. */
function resolveHomeDir() {
  return resolveEffectiveHomeDir(process.env, os.homedir);
}
function resolveHomeDisplayPrefix() {
  const home = resolveHomeDir();
  if (!home) return;
  if (process.env.OPENCLAW_HOME?.trim())
    return {
      home,
      prefix: "$OPENCLAW_HOME",
    };
  return {
    home,
    prefix: "~",
  };
}
/** Replaces the leading home directory in a path with `~` or `$OPENCLAW_HOME`. */
function shortenHomePath(input) {
  if (!input) return input;
  const display = resolveHomeDisplayPrefix();
  if (!display) return input;
  const { home, prefix } = display;
  if (input === home) return prefix;
  if (input.startsWith(`${home}/`) || input.startsWith(`${home}\\`))
    return `${prefix}${input.slice(home.length)}`;
  return input;
}
/** Replaces all effective-home occurrences inside a diagnostic string. */
function shortenHomeInString(input) {
  if (!input) return input;
  const display = resolveHomeDisplayPrefix();
  if (!display) return input;
  return input.split(display.home).join(display.prefix);
}
/** Shortens a path for display without changing non-home paths. */
function displayPath(input) {
  return shortenHomePath(input);
}
/** Shortens home paths embedded in arbitrary display text. */
function displayString(input) {
  return shortenHomeInString(input);
}
let CONFIG_DIR = resolveConfigDir();
function pinConfigDir(env = process.env) {
  CONFIG_DIR = resolveConfigDir(env);
  return CONFIG_DIR;
}
/**
 * Check if a file or directory exists at the given path.
 */
async function pathExists(targetPath) {
  return await pathExists$1(targetPath);
}
//#endregion
export {
  displayPath as a,
  normalizeE164 as c,
  resolveConfigDir as d,
  resolveHomeDir as f,
  shortenHomePath as h,
  clampNumber as i,
  pathExists as l,
  shortenHomeInString as m,
  clamp as n,
  displayString as o,
  safeParseJson as p,
  clampInt as r,
  ensureDir as s,
  CONFIG_DIR as t,
  pinConfigDir as u,
};
