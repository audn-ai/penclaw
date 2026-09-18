import fs from "node:fs";
import path from "node:path";
import { t as expandHomePrefix } from "./home-dir-DxrrpDft.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
//#region src/infra/executable-path.ts
function isDriveLessWindowsRootedPath(value) {
  return process.platform === "win32" && /^:[\\/]/.test(value);
}
function resolveEnvironmentValue(env, name) {
  if (!env) return;
  const exactValue = env[name] ?? (name === "PATH" ? env.Path : void 0);
  if (exactValue !== void 0) return exactValue;
  if (process.platform !== "win32") return;
  const normalizedName = name.toLowerCase();
  return Object.entries(env).find(([key]) => key.toLowerCase() === normalizedName)?.[1];
}
function resolveExecutablePathCandidate(rawExecutable, options) {
  const expanded = rawExecutable.startsWith("~")
    ? expandHomePrefix(rawExecutable, { env: options?.env })
    : rawExecutable;
  if (isDriveLessWindowsRootedPath(expanded)) return;
  const hasPathSeparator = expanded.includes("/") || expanded.includes("\\");
  if (options?.requirePathSeparator && !hasPathSeparator) return;
  if (!hasPathSeparator) return expanded;
  if (path.isAbsolute(expanded)) return path.resolve(expanded);
  const base = options?.cwd && options.cwd.trim() ? options.cwd.trim() : process.cwd();
  return path.resolve(base, expanded);
}
function resolveWindowsExecutableExtensions(executable, env, includeExtensionless = true) {
  if (process.platform !== "win32") return [""];
  if (path.extname(executable).length > 0) return [""];
  const extensions = (
    resolveEnvironmentValue(env, "PATHEXT") ??
    resolveEnvironmentValue(process.env, "PATHEXT") ??
    ".EXE;.CMD;.BAT;.COM"
  )
    .split(";")
    .map((ext) => normalizeLowercaseStringOrEmpty(ext));
  return includeExtensionless ? ["", ...extensions] : extensions;
}
function resolveWindowsExecutableExtSet(env) {
  return new Set(
    (
      resolveEnvironmentValue(env, "PATHEXT") ??
      resolveEnvironmentValue(process.env, "PATHEXT") ??
      ".EXE;.CMD;.BAT;.COM"
    )
      .split(";")
      .map((ext) => normalizeLowercaseStringOrEmpty(ext))
      .filter(Boolean),
  );
}
function isRegularFile(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch {
    return false;
  }
}
function isExecutableFile(filePath, options) {
  if (!isRegularFile(filePath)) return false;
  try {
    if (process.platform === "win32") {
      const ext = normalizeLowercaseStringOrEmpty(path.extname(filePath));
      if (!ext) return true;
      return resolveWindowsExecutableExtSet(options?.env).has(ext);
    }
    fs.accessSync(filePath, fs.constants.X_OK);
    return true;
  } catch {
    return false;
  }
}
const WINDOWS_NATIVE_EXECUTABLE_EXTENSIONS = /* @__PURE__ */ new Set([
  ".com",
  ".exe",
  ".bat",
  ".cmd",
]);
function resolveExecutableFromPathEnv(executable, pathEnv, env, options) {
  const delimiter = process.platform === "win32" ? ";" : path.delimiter;
  const entries = pathEnv.split(delimiter).filter(Boolean);
  const extensions = resolveWindowsExecutableExtensions(
    executable,
    env,
    options?.includeExtensionless,
  );
  const hasNativeWindowsExtension =
    process.platform === "win32" &&
    WINDOWS_NATIVE_EXECUTABLE_EXTENSIONS.has(
      normalizeLowercaseStringOrEmpty(path.extname(executable)),
    );
  for (const entry of entries)
    for (const ext of extensions) {
      const candidate = path.join(entry, executable + ext);
      if (
        hasNativeWindowsExtension ? isRegularFile(candidate) : isExecutableFile(candidate, { env })
      )
        return candidate;
    }
}
function resolveExecutablePath(rawExecutable, options) {
  const candidate = resolveExecutablePathCandidate(rawExecutable, options);
  if (!candidate) return;
  if (candidate.includes("/") || candidate.includes("\\"))
    return isExecutableFile(candidate, options) ? candidate : void 0;
  return resolveExecutableFromPathEnv(
    candidate,
    resolveEnvironmentValue(options?.env, "PATH") ??
      resolveEnvironmentValue(process.env, "PATH") ??
      "",
    options?.env,
  );
}
/**
 * On Windows, resolves a bare command name to its full .cmd or .exe path by
 * probing PATH/PATHEXT without executing another resolver. On non-Windows this
 * is a no-op.
 */
function resolveExecutable(cmd) {
  if (process.platform !== "win32") return cmd;
  if (WINDOWS_NATIVE_EXECUTABLE_EXTENSIONS.has(normalizeLowercaseStringOrEmpty(path.extname(cmd))))
    return cmd;
  const entries = (resolveEnvironmentValue(process.env, "PATH") ?? "").split(";").filter(Boolean);
  const extensions = resolveWindowsExecutableExtensions(cmd, process.env);
  const matches = [];
  for (const entry of entries)
    for (const ext of extensions) {
      const candidate = path.join(entry, cmd + ext);
      if (isExecutableFile(candidate, { env: process.env })) matches.push(candidate);
    }
  const cmdMatch = matches.find(
    (match) => normalizeLowercaseStringOrEmpty(path.extname(match)) === ".cmd",
  );
  if (cmdMatch) return cmdMatch;
  const exeMatch = matches.find(
    (match) => normalizeLowercaseStringOrEmpty(path.extname(match)) === ".exe",
  );
  if (exeMatch) return exeMatch;
  if (matches[0]) return matches[0];
  return cmd;
}
//#endregion
export {
  resolveExecutablePathCandidate as a,
  resolveExecutablePath as i,
  resolveExecutable as n,
  resolveExecutableFromPathEnv as r,
  isRegularFile as t,
};
