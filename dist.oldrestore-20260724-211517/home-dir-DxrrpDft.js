import os from "node:os";
import path from "node:path";
//#region src/infra/safe-cwd.ts
function tryProcessCwd() {
  try {
    return process.cwd();
  } catch {
    return;
  }
}
function formatCwdRelativePathOrAbsolute(targetPath, samePathFallback) {
  const cwd = tryProcessCwd();
  return cwd ? path.relative(cwd, targetPath) || samePathFallback : targetPath;
}
//#endregion
//#region src/infra/home-dir.ts
function normalize$1(value) {
  const trimmed = value?.trim();
  if (!trimmed || trimmed === "undefined" || trimmed === "null") return;
  return trimmed;
}
function normalizeSafe(homedir) {
  try {
    return normalize$1(homedir());
  } catch {
    return;
  }
}
function resolveTermuxHome(env) {
  const prefix = normalize$1(env.PREFIX);
  if (!prefix || !normalize$1(env.ANDROID_DATA)) return;
  if (!/(?:^|\/)com\.termux\/files\/usr\/?$/u.test(prefix.replace(/\\/gu, "/"))) return;
  return path.resolve(prefix, "..", "home");
}
function resolveRawOsHomeDir(env, homedir) {
  return (
    normalize$1(env.HOME) ??
    normalize$1(env.USERPROFILE) ??
    resolveTermuxHome(env) ??
    normalizeSafe(homedir)
  );
}
function resolveRawHomeDir(env, homedir) {
  const explicitHome = normalize$1(env.OPENCLAW_HOME);
  if (!explicitHome) return resolveRawOsHomeDir(env, homedir);
  if (explicitHome === "~" || explicitHome.startsWith("~/") || explicitHome.startsWith("~\\")) {
    const fallbackHome = resolveRawOsHomeDir(env, homedir);
    return fallbackHome ? explicitHome.replace(/^~(?=$|[\\/])/, fallbackHome) : void 0;
  }
  return explicitHome;
}
/** Resolves OpenClaw's effective home, honoring OPENCLAW_HOME before OS homes. */
function resolveEffectiveHomeDir(env = process.env, homedir = os.homedir) {
  const raw = resolveRawHomeDir(env, homedir);
  return raw ? path.resolve(raw) : void 0;
}
/** Resolves the underlying OS user home, ignoring OPENCLAW_HOME overrides. */
function resolveOsHomeDir(env = process.env, homedir = os.homedir) {
  const raw = resolveRawOsHomeDir(env, homedir);
  return raw ? path.resolve(raw) : void 0;
}
/** Resolves the effective home or falls back to cwd when no home source exists. */
function resolveRequiredHomeDir(env = process.env, homedir = os.homedir) {
  const resolved = resolveEffectiveHomeDir(env, homedir) ?? tryProcessCwd();
  if (resolved) return path.resolve(resolved);
  throw new Error(
    "Unable to resolve an OpenClaw home: set OPENCLAW_HOME, HOME, or USERPROFILE, or run from an existing directory.",
  );
}
/** Resolves the OS home or falls back to cwd when no OS home source exists. */
function resolveRequiredOsHomeDir(env = process.env, homedir = os.homedir) {
  const resolved = resolveOsHomeDir(env, homedir) ?? tryProcessCwd();
  if (resolved) return path.resolve(resolved);
  throw new Error(
    "Unable to resolve an OS home: set HOME or USERPROFILE, or run from an existing directory.",
  );
}
/** Expands leading `~`, `~/`, or `~\` with the effective home when one is known. */
function expandHomePrefix(input, opts) {
  if (!input.startsWith("~")) return input;
  const home =
    normalize$1(opts?.home) ??
    resolveEffectiveHomeDir(opts?.env ?? process.env, opts?.homedir ?? os.homedir);
  if (!home) return input;
  return input.replace(/^~(?=$|[\\/])/, home);
}
/** Resolves a user-supplied path after trimming and expanding against the effective home. */
function resolveHomeRelativePath(input, opts) {
  const trimmed = input.trim();
  if (!trimmed) return trimmed;
  if (trimmed.startsWith("~")) {
    const expanded = expandHomePrefix(trimmed, {
      home: resolveRequiredHomeDir(opts?.env ?? process.env, opts?.homedir ?? os.homedir),
      env: opts?.env,
      homedir: opts?.homedir,
    });
    return path.resolve(expanded);
  }
  return path.resolve(trimmed);
}
/** Resolves a user path against the effective home, preserving an empty input. */
function resolveUserPath(input, env = process.env, homedir = os.homedir) {
  if (!input) return "";
  return resolveHomeRelativePath(input, {
    env,
    homedir,
  });
}
/** Resolves a user-supplied path against the OS home, ignoring OPENCLAW_HOME. */
function resolveOsHomeRelativePath(input, opts) {
  const trimmed = input.trim();
  if (!trimmed) return trimmed;
  if (trimmed.startsWith("~")) {
    const expanded = expandHomePrefix(trimmed, {
      home: resolveRequiredOsHomeDir(opts?.env ?? process.env, opts?.homedir ?? os.homedir),
      env: opts?.env,
      homedir: opts?.homedir,
    });
    return path.resolve(expanded);
  }
  return path.resolve(trimmed);
}
//#endregion
export {
  resolveOsHomeRelativePath as a,
  resolveUserPath as c,
  resolveOsHomeDir as i,
  formatCwdRelativePathOrAbsolute as l,
  resolveEffectiveHomeDir as n,
  resolveRequiredHomeDir as o,
  resolveHomeRelativePath as r,
  resolveRequiredOsHomeDir as s,
  expandHomePrefix as t,
  tryProcessCwd as u,
};
