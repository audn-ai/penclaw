import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { n as resolveBrewPathDirs } from "./brew-BuAbPCrG.js";
import { n as isTruthyEnvValue } from "./env-Di-LcxqW.js";
import { u as tryProcessCwd } from "./home-dir-DxrrpDft.js";
import {
  l as normalizeStringEntries,
  p as normalizeUniqueStringEntries,
} from "./string-normalization-CRyoFBPt.js";
//#region src/infra/path-env.ts
function isExecutable(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.X_OK);
    return true;
  } catch {
    return false;
  }
}
function isDirectory(dirPath) {
  try {
    return fs.statSync(dirPath).isDirectory();
  } catch {
    return false;
  }
}
function splitPathParts(pathEnv) {
  return new Set(normalizeStringEntries(pathEnv.split(path.delimiter)));
}
function isKnownPathDir(existingPathParts, dirPath) {
  return existingPathParts.has(dirPath) || isDirectory(dirPath);
}
function realpathExistingPath(candidate) {
  const suffix = [];
  let current = candidate;
  while (true)
    try {
      return path.resolve(fs.realpathSync.native(current), ...suffix.toReversed());
    } catch {
      const parent = path.dirname(current);
      if (parent === current) return;
      suffix.push(path.basename(current));
      current = parent;
    }
}
function isSameOrChildPath(candidate, parent) {
  const relative = path.relative(parent, candidate);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}
function isFilesystemRoot(dirPath) {
  return path.dirname(dirPath) === dirPath;
}
function normalizeTrustedPackageManagerRoot(params) {
  const trimmed = params.value?.trim();
  if (!trimmed || !path.isAbsolute(trimmed)) return;
  const normalized = path.normalize(trimmed);
  if (normalized === "/proc" || normalized.startsWith(`/proc${path.sep}`)) return;
  if (!params.cwd) return normalized;
  const cwd = path.resolve(params.cwd);
  const homeDir = path.resolve(params.homeDir);
  if (cwd === homeDir || isFilesystemRoot(cwd)) return normalized;
  if (isSameOrChildPath(normalized, cwd)) return;
  const realCandidate = realpathExistingPath(normalized);
  const realCwd = realpathExistingPath(cwd);
  const realHome = realpathExistingPath(homeDir);
  if (
    realCwd &&
    realCwd !== realHome &&
    !isFilesystemRoot(realCwd) &&
    realCandidate &&
    isSameOrChildPath(realCandidate, realCwd)
  )
    return;
  return normalized;
}
function isLinuxbrewPath(dirPath) {
  return dirPath.split(path.sep).includes(".linuxbrew");
}
function resolvePathBootstrapBrewDirs(params) {
  const candidates = resolveBrewPathDirs({ homeDir: params.homeDir });
  if (params.platform !== "darwin") return candidates;
  return candidates.filter(
    (candidate) => !isLinuxbrewPath(candidate) || params.existingPathParts.has(candidate),
  );
}
function mergePath(params) {
  return normalizeUniqueStringEntries([
    ...(params.prepend ?? []),
    ...params.existing.split(path.delimiter),
    ...(params.append ?? []),
  ]).join(path.delimiter);
}
function candidateBinDirs(opts, existingPathParts) {
  const execPath = opts.execPath ?? process.execPath;
  const cwd = opts.cwd ?? tryProcessCwd();
  const homeDir = opts.homeDir ?? os.homedir();
  const platform = opts.platform ?? process.platform;
  const prepend = [];
  const append = [];
  try {
    const execDir = path.dirname(execPath);
    if (isExecutable(execPath)) prepend.push(execDir);
  } catch {}
  try {
    const execDir = path.dirname(execPath);
    if (isExecutable(path.join(execDir, "openclaw"))) prepend.push(execDir);
  } catch {}
  if (
    (opts.allowProjectLocalBin === true ||
      isTruthyEnvValue(process.env.OPENCLAW_ALLOW_PROJECT_LOCAL_BIN)) &&
    cwd
  ) {
    const localBinDir = path.join(cwd, "node_modules", ".bin");
    if (isExecutable(path.join(localBinDir, "openclaw"))) append.push(localBinDir);
  }
  prepend.push("/usr/bin", "/bin");
  append.push(
    ...resolvePathBootstrapBrewDirs({
      homeDir,
      platform,
      existingPathParts,
    }),
  );
  const pnpmHome = normalizeTrustedPackageManagerRoot({
    value: process.env.PNPM_HOME,
    cwd,
    homeDir,
  });
  if (pnpmHome) {
    append.push(pnpmHome);
    append.push(path.join(pnpmHome, "bin"));
  }
  const npmPrefix = normalizeTrustedPackageManagerRoot({
    value: process.env.NPM_CONFIG_PREFIX,
    cwd,
    homeDir,
  });
  if (npmPrefix) append.push(path.join(npmPrefix, "bin"));
  const miseDataDir = process.env.MISE_DATA_DIR ?? path.join(homeDir, ".local", "share", "mise");
  const miseShims = path.join(miseDataDir, "shims");
  if (isKnownPathDir(existingPathParts, miseShims)) append.push(miseShims);
  if (platform === "darwin") {
    append.push(path.join(homeDir, "Library", "pnpm", "bin"));
    append.push(path.join(homeDir, "Library", "pnpm"));
  }
  if (process.env.XDG_BIN_HOME) append.push(process.env.XDG_BIN_HOME);
  append.push(path.join(homeDir, ".local", "bin"));
  append.push(path.join(homeDir, ".npm-global", "bin"));
  append.push(path.join(homeDir, ".local", "share", "pnpm", "bin"));
  append.push(path.join(homeDir, ".local", "share", "pnpm"));
  append.push(path.join(homeDir, ".bun", "bin"));
  append.push(path.join(homeDir, ".yarn", "bin"));
  return {
    prepend: prepend.filter((candidate) => isKnownPathDir(existingPathParts, candidate)),
    append: append.filter((candidate) => isKnownPathDir(existingPathParts, candidate)),
  };
}
/**
 * Best-effort PATH bootstrap so skills that require the `openclaw` CLI can run
 * under launchd/minimal environments (and inside the macOS app bundle).
 */
function ensureOpenClawCliOnPath(opts = {}) {
  if (isTruthyEnvValue(process.env.OPENCLAW_PATH_BOOTSTRAPPED)) return;
  process.env.OPENCLAW_PATH_BOOTSTRAPPED = "1";
  const existing = opts.pathEnv ?? process.env.PATH ?? "";
  const { prepend, append } = candidateBinDirs(opts, splitPathParts(existing));
  if (prepend.length === 0 && append.length === 0) return;
  const merged = mergePath({
    existing,
    prepend,
    append,
  });
  if (merged) process.env.PATH = merged;
}
//#endregion
export { ensureOpenClawCliOnPath as t };
