import { t as HOOK_INSTALL_ERROR_CODE } from "./install-ySnrQjbE.js";
import { r as defaultRuntime } from "./runtime-Bz6o617W.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { r as theme } from "./theme-vjDs9tao.js";
//#region src/cli/plugins-command-helpers.ts
function resolveFileNpmSpecToLocalPath(raw) {
  const trimmed = raw.trim();
  if (!normalizeLowercaseStringOrEmpty(trimmed).startsWith("file:")) return null;
  const rest = trimmed.slice(5);
  if (!rest)
    return {
      ok: false,
      error: "unsupported file: spec: missing path",
    };
  if (rest.startsWith("///"))
    return {
      ok: true,
      path: rest.slice(2),
    };
  if (rest.startsWith("//localhost/"))
    return {
      ok: true,
      path: rest.slice(11),
    };
  if (rest.startsWith("//"))
    return {
      ok: false,
      error: 'unsupported file: URL host (expected "file:<path>" or "file:///abs/path")',
    };
  return {
    ok: true,
    path: rest,
  };
}
function createPluginInstallLogger(runtime = defaultRuntime) {
  return {
    info: (msg) => runtime.log(msg),
    warn: (msg) => runtime.log(msg.includes("╭─") ? msg : theme.warn(msg)),
  };
}
function createHookPackInstallLogger(runtime = defaultRuntime) {
  return {
    info: (msg) => runtime.log(msg),
    warn: (msg) => runtime.log(theme.warn(msg)),
  };
}
function enableInternalHookEntries(config, hookNames) {
  const entries = { ...config.hooks?.internal?.entries };
  for (const hookName of hookNames)
    entries[hookName] = {
      ...entries[hookName],
      enabled: true,
    };
  return {
    ...config,
    hooks: {
      ...config.hooks,
      internal: {
        ...config.hooks?.internal,
        enabled: true,
        entries,
      },
    },
  };
}
function formatPluginInstallWithHookFallbackError(pluginError, hookFallback) {
  const formattedPluginError = formatPluginInstallAttemptError(pluginError);
  const formattedHookError = formatPluginInstallAttemptError(hookFallback.error);
  if (/plugin already exists: .+ \(delete it first\)/.test(pluginError))
    return `${formattedPluginError}\nUse \`openclaw plugins update <id-or-npm-spec>\` to upgrade the tracked plugin, or rerun install with \`--force\` to replace it.`;
  if (
    pluginError.startsWith("Invalid extensions directory:") ||
    pluginError === "Invalid path: must stay within extensions directory"
  )
    return formattedPluginError;
  if (hookFallback.code === HOOK_INSTALL_ERROR_CODE.MISSING_OPENCLAW_HOOKS)
    return formattedPluginError;
  return `${formattedPluginError}\nAlso not a valid hook pack: ${formattedHookError}`;
}
const MISSING_GIT_FOR_NPM_DEPENDENCY_HINT =
  "Git is required because one of this plugin's npm dependencies is fetched from a git URL, but `git` was not found on PATH. Install Git and rerun the install. On Windows, use `winget install --id Git.Git -e` or add a portable Git `bin` directory to PATH.";
function formatPluginInstallAttemptError(error) {
  if (!isMissingGitForNpmDependencyError(error)) return error;
  if (error.includes(MISSING_GIT_FOR_NPM_DEPENDENCY_HINT)) return error;
  return `${error}\n\n${MISSING_GIT_FOR_NPM_DEPENDENCY_HINT}`;
}
function isMissingGitForNpmDependencyError(error) {
  const normalized = normalizeLowercaseStringOrEmpty(error);
  return /\bspawn\s+git\b/u.test(normalized) && /\benoent\b/u.test(normalized);
}
function logHookPackRestartHint(runtime = defaultRuntime) {
  runtime.log("Restart the gateway to load hooks.");
}
function logSlotWarnings(warnings, runtime = defaultRuntime) {
  if (warnings.length === 0) return;
  for (const warning of warnings) runtime.log(theme.warn(warning));
}
function parseNpmPrefixSpec(raw) {
  const trimmed = raw.trim();
  if (!normalizeLowercaseStringOrEmpty(trimmed).startsWith("npm:")) return null;
  return trimmed.slice(4).trim();
}
function parseNpmPackPrefixPath(raw) {
  const trimmed = raw.trim();
  if (!normalizeLowercaseStringOrEmpty(trimmed).startsWith("npm-pack:")) return null;
  return trimmed.slice(9).trim();
}
//#endregion
export {
  logHookPackRestartHint as a,
  parseNpmPrefixSpec as c,
  formatPluginInstallWithHookFallbackError as i,
  resolveFileNpmSpecToLocalPath as l,
  createPluginInstallLogger as n,
  logSlotWarnings as o,
  enableInternalHookEntries as r,
  parseNpmPackPrefixPath as s,
  createHookPackInstallLogger as t,
};
