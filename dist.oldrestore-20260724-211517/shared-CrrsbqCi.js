import fs from "node:fs";
import "./number-coercion-EqFmHmOw.js";
import "./utils-DtcDeqWS.js";
import path from "node:path";
import "./replace-file-CaPU6XwS.js";
import { A as resolvePositiveTimerTimeoutMs } from "./number-coercion-CJQ8TR--.js";
import { n as privateFileStoreSync } from "./private-file-store-BSksaLX_.js";
import { n as replaceFileAtomicSync } from "./replace-file-DfwQ8_Mi.js";
//#region src/secrets/shared.ts
/** Shared parsing and file helpers for secrets migration/runtime code. */
/**
 * Narrows to strings that contain non-whitespace content.
 */
function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}
/**
 * Parses a simple .env assignment value, stripping one matching quote pair after trimming.
 */
function parseEnvValue(raw) {
  const trimmed = raw.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  )
    return trimmed.slice(1, -1);
  return trimmed;
}
/**
 * Normalizes numeric config to a positive integer, falling back when the input is not finite.
 */
function normalizePositiveInt(value, fallback) {
  if (typeof value === "number" && Number.isFinite(value)) return Math.max(1, Math.floor(value));
  return Math.max(1, Math.floor(fallback));
}
/**
 * Normalizes timer values with the shared timeout coercion rules used by secret providers.
 */
function normalizePositiveTimerMs(value, fallback) {
  return resolvePositiveTimerTimeoutMs(value, fallback);
}
/**
 * Splits a dotted config path into non-empty trimmed segments.
 */
function parseDotPath(pathname) {
  return pathname
    .split(".")
    .map((segment) => segment.trim())
    .filter((segment) => segment.length > 0);
}
/**
 * Joins config path segments using the secrets command's dotted path format.
 */
function toDotPath(segments) {
  return segments.join(".");
}
/**
 * Ensures the parent directory for a secret-related file exists with private permissions.
 */
function ensureDirForFile(filePath) {
  fs.mkdirSync(path.dirname(filePath), {
    recursive: true,
    mode: 448,
  });
}
/**
 * Writes a JSON file through the private file store so new files get secret-safe permissions.
 */
function writeJsonFileSecure(pathname, value) {
  privateFileStoreSync(path.dirname(pathname)).writeJson(path.basename(pathname), value, {
    trailingNewline: true,
  });
}
/**
 * Reads a text file when present, returning null instead of throwing for missing paths.
 */
function readTextFileIfExists(pathname) {
  if (!fs.existsSync(pathname)) return null;
  return fs.readFileSync(pathname, "utf8");
}
/**
 * Atomically writes secret-adjacent text, using the private store for default 0600 files.
 */
function writeTextFileAtomic(pathname, value, mode = 384) {
  if (mode !== 384) {
    replaceFileAtomicSync({
      filePath: pathname,
      content: value,
      mode,
      tempPrefix: ".openclaw-secrets",
    });
    return;
  }
  privateFileStoreSync(path.dirname(pathname)).writeText(path.basename(pathname), value);
}
//#endregion
export {
  parseDotPath as a,
  toDotPath as c,
  normalizePositiveTimerMs as i,
  writeJsonFileSecure as l,
  isNonEmptyString as n,
  parseEnvValue as o,
  normalizePositiveInt as r,
  readTextFileIfExists as s,
  ensureDirForFile as t,
  writeTextFileAtomic as u,
};
