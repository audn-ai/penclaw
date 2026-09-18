import { execFileSync } from "node:child_process";
import fs from "node:fs";
import "./parse-finite-number-Z7n6tXLk.js";
import os from "node:os";
import path from "node:path";
import { n as isTruthyEnvValue } from "./env-Di-LcxqW.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { s as sanitizeHostExecEnv } from "./host-env-security-pMY6K0Qy.js";
import {
  j as resolveTimerTimeoutMs,
  y as parseStrictNonNegativeInteger,
} from "./number-coercion-CJQ8TR--.js";
//#region src/infra/shell-env.ts
const DEFAULT_TIMEOUT_MS = 15e3;
const DEFAULT_MAX_BUFFER_BYTES = 2 * 1024 * 1024;
const DEFAULT_SHELL = "/bin/sh";
let lastAppliedKeys = [];
let cachedShellPath;
let cachedEtcShells;
let nextExecCacheId = 1;
const loginShellEnvProbeCache = /* @__PURE__ */ new Map();
const execCacheIds = /* @__PURE__ */ new WeakMap();
function resolveShellExecEnv(env) {
  const execEnv = sanitizeHostExecEnv({ baseEnv: env });
  const home = os.homedir().trim();
  if (home) execEnv.HOME = home;
  else delete execEnv.HOME;
  delete execEnv.ZDOTDIR;
  return execEnv;
}
function resolveTimeoutMs(timeoutMs) {
  return resolveTimerTimeoutMs(timeoutMs, DEFAULT_TIMEOUT_MS, 0);
}
function readEtcShells() {
  if (cachedEtcShells !== void 0) return cachedEtcShells;
  try {
    const entries = fs
      .readFileSync("/etc/shells", "utf8")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && !line.startsWith("#") && path.isAbsolute(line));
    cachedEtcShells = new Set(entries);
  } catch {
    cachedEtcShells = null;
  }
  return cachedEtcShells;
}
function isTrustedShellPath(shell) {
  if (!path.isAbsolute(shell)) return false;
  if (path.normalize(shell) !== shell) return false;
  return readEtcShells()?.has(shell) === true;
}
function resolveShell(env) {
  const shell = env.SHELL?.trim();
  if (shell && isTrustedShellPath(shell)) return shell;
  return DEFAULT_SHELL;
}
function execLoginShellEnvZero(params) {
  return params.exec(params.shell, ["-l", "-c", "env -0"], {
    encoding: "buffer",
    timeout: params.timeoutMs,
    maxBuffer: DEFAULT_MAX_BUFFER_BYTES,
    env: params.env,
    windowsHide: true,
    stdio: ["ignore", "pipe", "pipe"],
  });
}
function parseShellEnv(stdout) {
  const shellEnv = /* @__PURE__ */ new Map();
  const parts = stdout.toString("utf8").split("\0");
  for (const part of parts) {
    if (!part) continue;
    const eq = part.indexOf("=");
    if (eq <= 0) continue;
    const key = part.slice(0, eq);
    const value = part.slice(eq + 1);
    if (!key) continue;
    shellEnv.set(key, value);
  }
  return shellEnv;
}
function resolveExecCacheId(exec) {
  if (!exec) return "default";
  const key = exec;
  let id = execCacheIds.get(key);
  if (!id) {
    id = nextExecCacheId;
    nextExecCacheId += 1;
    execCacheIds.set(key, id);
  }
  return `exec:${id}`;
}
function createLoginShellEnvCacheKey(params) {
  const startupEnvEntries = Object.entries(params.execEnv)
    .filter(([key]) => {
      if (
        key === "HOME" ||
        key === "PATH" ||
        key === "TERM" ||
        key === "LANG" ||
        key === "LC_ALL" ||
        key === "LC_CTYPE" ||
        key === "USER" ||
        key === "LOGNAME" ||
        key === "TMPDIR"
      )
        return true;
      return key.startsWith("XDG_") || key.startsWith("OPENCLAW_");
    })
    .toSorted(([left], [right]) => left.localeCompare(right));
  return JSON.stringify([
    params.shell,
    params.timeoutMs,
    resolveExecCacheId(params.exec),
    startupEnvEntries,
  ]);
}
function probeLoginShellEnv(params) {
  if ((params.platform ?? process.platform) === "win32")
    return {
      ok: true,
      shellEnv: /* @__PURE__ */ new Map(),
    };
  const exec = params.exec ?? execFileSync;
  const timeoutMs = resolveTimeoutMs(params.timeoutMs);
  const shell = resolveShell(params.env);
  const execEnv = resolveShellExecEnv(params.env);
  const cacheKey = createLoginShellEnvCacheKey({
    shell,
    timeoutMs,
    exec: params.exec,
    execEnv,
  });
  const cached = loginShellEnvProbeCache.get(cacheKey);
  if (cached)
    return cached.ok
      ? {
          ok: true,
          shellEnv: new Map(cached.entries),
        }
      : cached;
  try {
    const shellEnv = parseShellEnv(
      execLoginShellEnvZero({
        shell,
        env: execEnv,
        exec,
        timeoutMs,
      }),
    );
    loginShellEnvProbeCache.set(cacheKey, {
      ok: true,
      entries: [...shellEnv.entries()],
    });
    return {
      ok: true,
      shellEnv,
    };
  } catch (err) {
    const result = {
      ok: false,
      error: formatErrorMessage(err),
    };
    loginShellEnvProbeCache.set(cacheKey, result);
    return result;
  }
}
function hasExplicitEnvBinding(env, key) {
  return Object.hasOwn(env, key);
}
function loadShellEnvFallback(opts) {
  const logger = opts.logger ?? console;
  if (!opts.enabled) {
    lastAppliedKeys = [];
    return {
      ok: true,
      applied: [],
      skippedReason: "disabled",
    };
  }
  const missingExpectedKeys = opts.expectedKeys.filter(
    (key) => !hasExplicitEnvBinding(opts.env, key),
  );
  if (missingExpectedKeys.length === 0) {
    lastAppliedKeys = [];
    return {
      ok: true,
      applied: [],
      skippedReason: "already-has-keys",
    };
  }
  const probe = probeLoginShellEnv({
    env: opts.env,
    timeoutMs: opts.timeoutMs,
    exec: opts.exec,
    platform: opts.platform,
  });
  if (!probe.ok) {
    logger.warn(`[openclaw] shell env fallback failed: ${probe.error}`);
    lastAppliedKeys = [];
    return {
      ok: false,
      error: probe.error,
      applied: [],
    };
  }
  const applied = [];
  for (const key of missingExpectedKeys) {
    const value = probe.shellEnv.get(key);
    if (!value?.trim()) continue;
    opts.env[key] = value;
    applied.push(key);
  }
  lastAppliedKeys = applied;
  return {
    ok: true,
    applied,
  };
}
function shouldEnableShellEnvFallback(env) {
  return isTruthyEnvValue(env.OPENCLAW_LOAD_SHELL_ENV);
}
function shouldDeferShellEnvFallback(env) {
  return isTruthyEnvValue(env.OPENCLAW_DEFER_SHELL_ENV_FALLBACK);
}
function resolveShellEnvFallbackTimeoutMs(env) {
  const raw = env.OPENCLAW_SHELL_ENV_TIMEOUT_MS?.trim();
  if (!raw) return DEFAULT_TIMEOUT_MS;
  const parsed = parseStrictNonNegativeInteger(raw);
  if (parsed === void 0) return DEFAULT_TIMEOUT_MS;
  return resolveTimeoutMs(parsed);
}
function getShellPathFromLoginShell(opts) {
  if (cachedShellPath !== void 0) return cachedShellPath;
  const platform = opts.platform ?? process.platform;
  if (platform === "win32") {
    cachedShellPath = null;
    return cachedShellPath;
  }
  const probe = probeLoginShellEnv({
    env: opts.env,
    timeoutMs: opts.timeoutMs,
    exec: opts.exec,
    platform,
  });
  if (!probe.ok) {
    cachedShellPath = null;
    return cachedShellPath;
  }
  const shellPath = probe.shellEnv.get("PATH")?.trim();
  cachedShellPath = shellPath && shellPath.length > 0 ? shellPath : null;
  return cachedShellPath;
}
function getShellEnvAppliedKeys() {
  return [...lastAppliedKeys];
}
function clearShellEnvAppliedKeys(keys) {
  const removed = new Set(keys);
  lastAppliedKeys = lastAppliedKeys.filter((key) => !removed.has(key));
}
//#endregion
export {
  resolveShellEnvFallbackTimeoutMs as a,
  loadShellEnvFallback as i,
  getShellEnvAppliedKeys as n,
  shouldDeferShellEnvFallback as o,
  getShellPathFromLoginShell as r,
  shouldEnableShellEnvFallback as s,
  clearShellEnvAppliedKeys as t,
};
