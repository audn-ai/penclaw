import { spawn } from "node:child_process";
import {
  a as resolveWindowsSpawnProgram,
  r as materializeWindowsSpawnProgram,
} from "./windows-spawn-C5RDaB22.js";
//#region extensions/codex/src/app-server/transport-stdio.ts
/**
 * Creates and configures stdio-backed Codex app-server transports, including
 * Windows spawn normalization and environment filtering.
 */
const UNSAFE_ENVIRONMENT_KEYS = /* @__PURE__ */ new Set(["__proto__", "constructor", "prototype"]);
const QA_PARENT_PID_ENV = "OPENCLAW_QA_PARENT_PID";
const DEFAULT_SPAWN_RUNTIME = {
  platform: process.platform,
  env: process.env,
  execPath: process.execPath,
};
/** Resolves the concrete command/argv/shell settings used to spawn Codex app-server. */
function resolveCodexAppServerSpawnInvocation(options, runtime = DEFAULT_SPAWN_RUNTIME) {
  if (options.commandSource === "managed")
    throw new Error("Managed Codex app-server start options must be resolved before spawn.");
  const resolved = materializeWindowsSpawnProgram(
    resolveWindowsSpawnProgram({
      command: options.command,
      platform: runtime.platform,
      env: runtime.env,
      execPath: runtime.execPath,
      packageName: "@openai/codex",
    }),
    options.args,
  );
  return {
    command: resolved.command,
    args: resolved.argv,
    shell: resolved.shell,
    windowsHide: resolved.windowsHide,
  };
}
/** Merges app-server environment overrides while honoring clearEnv and unsafe key filtering. */
function resolveCodexAppServerSpawnEnv(
  options,
  baseEnv = process.env,
  platform = process.platform,
) {
  const env = Object.create(null);
  copySafeEnvironmentEntries(env, baseEnv);
  copySafeEnvironmentEntries(env, options.env ?? {});
  const keysToClear = normalizedEnvironmentKeys(options.clearEnv ?? []);
  if (platform === "win32") {
    const lowerCaseKeysToClear = new Set(keysToClear.map((key) => key.toLowerCase()));
    for (const candidate of Object.keys(env))
      if (lowerCaseKeysToClear.has(candidate.toLowerCase())) delete env[candidate];
  } else for (const key of keysToClear) delete env[key];
  return env;
}
/** Keeps QA-owned app-server processes inside the gateway process-group cleanup boundary. */
function resolveCodexAppServerDetachedMode(env, platform = process.platform) {
  return platform !== "win32" && !env[QA_PARENT_PID_ENV]?.trim();
}
function normalizedEnvironmentKeys(rawKeys) {
  const keys = [];
  for (const rawKey of rawKeys) {
    const key = rawKey.trim();
    if (key.length > 0) keys.push(key);
  }
  return keys;
}
function copySafeEnvironmentEntries(target, source) {
  for (const [key, value] of Object.entries(source)) {
    if (UNSAFE_ENVIRONMENT_KEYS.has(key)) continue;
    target[key] = value;
  }
}
/** Spawns the Codex app-server process and returns the shared transport interface. */
function createStdioTransport(options) {
  const env = resolveCodexAppServerSpawnEnv(options);
  const invocation = resolveCodexAppServerSpawnInvocation(options, {
    platform: process.platform,
    env,
    execPath: process.execPath,
  });
  return spawn(invocation.command, invocation.args, {
    ...(options.cwd !== void 0 ? { cwd: options.cwd } : {}),
    env,
    detached: resolveCodexAppServerDetachedMode(env),
    shell: invocation.shell,
    stdio: ["pipe", "pipe", "pipe"],
    windowsHide: invocation.windowsHide,
  });
}
//#endregion
export { resolveCodexAppServerSpawnEnv as n, createStdioTransport as t };
