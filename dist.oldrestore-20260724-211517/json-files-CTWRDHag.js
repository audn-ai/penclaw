import "./fs-safe-defaults-B7hUN42l.js";
import {
  n as readJson$1,
  r as readJsonIfExists$1,
  t as JsonFileReadError,
} from "./json-7OTJmMaB.js";
import { n as replaceFileAtomic } from "./replace-file-CaPU6XwS.js";
//#region src/infra/json-files.ts
/** Reads and parses JSON, wrapping unexpected read failures in JsonFileReadError. */
async function readJson(filePath) {
  try {
    return await readJson$1(filePath);
  } catch (err) {
    throw err instanceof JsonFileReadError ? err : new JsonFileReadError(filePath, "read", err);
  }
}
/** Strict JSON read alias for callers that must fail on missing or invalid files. */
async function readJsonFileStrict(filePath) {
  return readJson(filePath);
}
/** Reads JSON when the file exists, returning null only for a missing path. */
async function readJsonIfExists(filePath) {
  try {
    return await readJsonIfExists$1(filePath);
  } catch (err) {
    if (err instanceof JsonFileReadError) throw err;
    throw new JsonFileReadError(filePath, "read", err);
  }
}
/** Durable JSON read alias that keeps parse/read errors visible to callers. */
async function readDurableJsonFile(filePath) {
  return readJsonIfExists(filePath);
}
/**
 * tryReadJson delegates to readJsonIfExists instead of the internal
 * tryReadJsonImpl from @openclaw/fs-safe. The fs-safe implementation retries
 * race conditions before propagating errors; this wrapper keeps the historical
 * null-on-error contract for callers that intentionally treat reads as optional.
 */
async function tryReadJson(filePath) {
  try {
    return await readJsonIfExists(filePath);
  } catch {
    return null;
  }
}
/** Optional JSON read that returns null for missing, invalid, or racing files. */
async function readJsonFile(filePath) {
  return tryReadJson(filePath);
}
/** Writes text through the repo atomic replace helper with durable fsync by default. */
async function writeTextAtomic(filePath, content, options) {
  await replaceFileAtomic({
    filePath,
    content: options?.trailingNewline && !content.endsWith("\n") ? `${content}\n` : content,
    mode: options?.mode ?? 384,
    dirMode: options?.dirMode ?? 511 & ~process.umask(),
    copyFallbackOnPermissionError: true,
    syncTempFile: options?.durable !== false,
    syncParentDir: options?.durable !== false,
    ...(options?.beforeRename ? { beforeRename: options.beforeRename } : {}),
    ...(options?.tempPrefix ? { tempPrefix: options.tempPrefix } : {}),
  });
}
//#endregion
export {
  readJsonIfExists as a,
  readJsonFileStrict as i,
  readJson as n,
  tryReadJson as o,
  readJsonFile as r,
  writeTextAtomic as s,
  readDurableJsonFile as t,
};
