import fs from "node:fs";
import path from "node:path";
import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.js";
//#region src/shared/config-eval.ts
/** Normalizes primitive config values into the truthiness rules used by requirements checks. */
function isTruthy(value) {
  if (value === void 0 || value === null) return false;
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") return value.trim().length > 0;
  return true;
}
/** Resolves dotted config paths, tolerating extra dots and missing branches. */
function resolveConfigPath(config, pathStr) {
  const parts = pathStr.split(".").filter(Boolean);
  let current = config;
  for (const part of parts) {
    if (typeof current !== "object" || current === null) return;
    if (isBlockedObjectKey(part)) return;
    current = current[part];
  }
  return current;
}
function hasBlockedConfigPathSegment(pathStr) {
  return pathStr
    .split(".")
    .filter(Boolean)
    .some((part) => isBlockedObjectKey(part));
}
/** Checks a config path with fallback defaults only when the path is unresolved. */
function isConfigPathTruthyWithDefaults(config, pathStr, defaults) {
  const value = resolveConfigPath(config, pathStr);
  if (value === void 0 && !hasBlockedConfigPathSegment(pathStr) && Object.hasOwn(defaults, pathStr))
    return defaults[pathStr] ?? false;
  return isTruthy(value);
}
/** Evaluates binary/env/config requirements against local and optional remote capabilities. */
function evaluateRuntimeRequires(params) {
  const requires = params.requires;
  if (!requires) return true;
  const requiredBins = requires.bins ?? [];
  if (requiredBins.length > 0)
    for (const bin of requiredBins) {
      if (params.hasBin(bin)) continue;
      if (params.hasRemoteBin?.(bin)) continue;
      return false;
    }
  const requiredAnyBins = requires.anyBins ?? [];
  if (requiredAnyBins.length > 0) {
    if (
      !requiredAnyBins.some((bin) => params.hasBin(bin)) &&
      !params.hasAnyRemoteBin?.(requiredAnyBins)
    )
      return false;
  }
  const requiredEnv = requires.env ?? [];
  if (requiredEnv.length > 0) {
    for (const envName of requiredEnv) if (!params.hasEnv(envName)) return false;
  }
  const requiredConfig = requires.config ?? [];
  if (requiredConfig.length > 0) {
    for (const configPath of requiredConfig)
      if (!params.isConfigPathTruthy(configPath)) return false;
  }
  return true;
}
/** Evaluates OS gating and runtime requirements for skill/plugin entry eligibility. */
function evaluateRuntimeEligibility(params) {
  const osList = params.os ?? [];
  const remotePlatforms = params.remotePlatforms ?? [];
  if (
    osList.length > 0 &&
    !osList.includes(resolveRuntimePlatform()) &&
    !remotePlatforms.some((platform) => osList.includes(platform))
  )
    return false;
  if (params.always === true) return true;
  return evaluateRuntimeRequires({
    requires: params.requires,
    hasBin: params.hasBin,
    hasRemoteBin: params.hasRemoteBin,
    hasAnyRemoteBin: params.hasAnyRemoteBin,
    hasEnv: params.hasEnv,
    isConfigPathTruthy: params.isConfigPathTruthy,
  });
}
/** Returns the current Node runtime platform used by eligibility checks. */
function resolveRuntimePlatform() {
  return process.platform;
}
function windowsPathExtensions() {
  const raw = process.env.PATHEXT;
  return [
    "",
    ...(raw !== void 0
      ? raw.split(";").map((v) => v.trim())
      : [".EXE", ".CMD", ".BAT", ".COM"]
    ).filter(Boolean),
  ];
}
let cachedHasBinaryPath;
let cachedHasBinaryPathExt;
const hasBinaryCache = /* @__PURE__ */ new Map();
/** Checks PATH for an executable binary, including PATHEXT candidates on Windows. */
function hasBinary(bin) {
  const pathEnv = process.env.PATH ?? "";
  const pathExt = process.platform === "win32" ? (process.env.PATHEXT ?? "") : "";
  if (cachedHasBinaryPath !== pathEnv || cachedHasBinaryPathExt !== pathExt) {
    cachedHasBinaryPath = pathEnv;
    cachedHasBinaryPathExt = pathExt;
    hasBinaryCache.clear();
  }
  if (hasBinaryCache.has(bin)) return hasBinaryCache.get(bin);
  const parts = pathEnv.split(path.delimiter).filter(Boolean);
  const extensions = process.platform === "win32" ? windowsPathExtensions() : [""];
  for (const part of parts)
    for (const ext of extensions) {
      const candidate = path.join(part, bin + ext);
      try {
        fs.accessSync(candidate, fs.constants.X_OK);
        hasBinaryCache.set(bin, true);
        return true;
      } catch {}
    }
  hasBinaryCache.set(bin, false);
  return false;
}
//#endregion
export { hasBinary as n, isConfigPathTruthyWithDefaults as r, evaluateRuntimeEligibility as t };
