#!/usr/bin/env node
import { spawn } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import "./src-Bl7G9qvi.js";
import { enableCompileCache, getCompileCacheDir } from "node:module";
import os from "node:os";
import path from "node:path";
import process$1 from "node:process";
import { fileURLToPath } from "node:url";
import { t as resolveCliArgvInvocation } from "./argv-invocation-BjvIqM-C.js";
import {
  d as isRootHelpInvocation,
  f as isRootVersionInvocation,
  r as getCommandPositionalsWithRootOptions,
} from "./argv-zTv4_Dzq.js";
import { t as attachChildProcessBridge } from "./child-process-bridge-Vp-FhPhG.js";
import { a as normalizeEnv, n as isTruthyEnvValue } from "./env-Di-LcxqW.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { t as isMainModule } from "./is-main-CH4EEB_R.js";
import { n as signalProcessTree } from "./kill-tree-Cr15jS_s.js";
import { t as resolveNodeStartupTlsEnvironment } from "./node-startup-env-Chdn0e25.js";
import { n as ensureOpenClawExecMarkerOnProcess } from "./openclaw-exec-env-BmbZ1aqS.js";
import {
  i as tryOutputPrecomputedCommandHelp,
  n as applyCliProfileEnv,
  o as parseCliContainerArgs,
  r as parseCliProfileArgs,
  s as resolveCliContainerTarget,
  t as createGatewayStartupTrace,
} from "./startup-trace-Bqh9afDl.js";
import { t as installProcessWarningFilter } from "./warning-filter-p3Ue6g9S.js";
import { t as normalizeWindowsArgv } from "./windows-argv-8XbjFcoh.js";
//#region src/cli/respawn-policy.ts
const GATEWAY_RUN_BOOLEAN_FLAGS = [
  "--allow-unconfigured",
  "--claude-cli-logs",
  "--cli-backend-logs",
  "--compact",
  "--dev",
  "--force",
  "--raw-stream",
  "--reset",
  "--tailscale-reset-on-exit",
  "--verbose",
];
const GATEWAY_RUN_VALUE_FLAGS = [
  "--auth",
  "--bind",
  "--password",
  "--password-file",
  "--port",
  "--raw-stream-path",
  "--tailscale",
  "--token",
  "--ws-log",
];
const INTERACTIVE_TTY_COMMANDS = /* @__PURE__ */ new Set(["tui", "terminal", "chat"]);
function isInteractiveTtyCommandArgv(argv) {
  const invocation = resolveCliArgvInvocation(argv);
  return invocation.primary !== null && INTERACTIVE_TTY_COMMANDS.has(invocation.primary);
}
function isTerminalInteractiveRespawnArgv(argv) {
  const invocation = resolveCliArgvInvocation(argv);
  if (invocation.hasHelpOrVersion) return false;
  return invocation.primary === null || INTERACTIVE_TTY_COMMANDS.has(invocation.primary);
}
function isForegroundGatewayRunArgv(argv) {
  const positionals = getCommandPositionalsWithRootOptions(argv, {
    commandPath: ["gateway"],
    booleanFlags: GATEWAY_RUN_BOOLEAN_FLAGS,
    valueFlags: GATEWAY_RUN_VALUE_FLAGS,
  });
  if (!positionals) return false;
  return positionals.length === 0 || (positionals.length === 1 && positionals[0] === "run");
}
/** Returns whether CLI startup should avoid the general respawn wrapper for this argv. */
function shouldSkipRespawnForArgv(argv) {
  const invocation = resolveCliArgvInvocation(argv);
  return (
    invocation.hasHelpOrVersion ||
    isInteractiveTtyCommandArgv(argv) ||
    (invocation.primary === "gateway" && isForegroundGatewayRunArgv(argv))
  );
}
/** Returns whether startup-environment respawn should be skipped without suppressing TUI respawn policy. */
function shouldSkipStartupEnvironmentRespawnForArgv(argv) {
  const invocation = resolveCliArgvInvocation(argv);
  return (
    invocation.hasHelpOrVersion ||
    (invocation.primary === "gateway" && isForegroundGatewayRunArgv(argv))
  );
}
//#endregion
//#region src/process/respawn-child-runner.ts
const RESPAWN_SIGNAL_EXIT_GRACE_MS = 1e3;
const RESPAWN_SIGNAL_FORCE_KILL_GRACE_MS = 1e3;
const RESPAWN_SIGNAL_HARD_EXIT_GRACE_MS = 1e3;
function runRespawnChildWithSignalBridge(params) {
  const { command, args, env, runtime, onError } = params;
  const stdioIsTerminal = params.stdioIsTerminal ?? (process.stdin.isTTY || process.stdout.isTTY);
  const detachForProcessTree =
    params.detachForProcessTree === true && process.platform !== "win32" && !stdioIsTerminal;
  const child = runtime.spawn(command, args, {
    stdio: "inherit",
    env,
    detached: detachForProcessTree,
  });
  let signalExitTimer;
  let signalForceKillTimer;
  let signalHardExitTimer;
  let parentSignalReceived = false;
  const clearSignalTimers = () => {
    if (signalExitTimer) {
      clearTimeout(signalExitTimer);
      signalExitTimer = void 0;
    }
    if (signalForceKillTimer) {
      clearTimeout(signalForceKillTimer);
      signalForceKillTimer = void 0;
    }
    if (signalHardExitTimer) {
      clearTimeout(signalHardExitTimer);
      signalHardExitTimer = void 0;
    }
  };
  const signalChild = (signal) => {
    if (detachForProcessTree && typeof child.pid === "number" && child.pid > 0) {
      signalProcessTree(child.pid, signal, { detached: true });
      return;
    }
    child.kill(signal === "SIGKILL" && process.platform === "win32" ? "SIGTERM" : signal);
  };
  const forceKillChild = () => {
    try {
      signalChild("SIGKILL");
    } catch {}
  };
  const requestChildTermination = () => {
    try {
      signalChild("SIGTERM");
    } catch {}
    signalForceKillTimer = setTimeout(() => {
      forceKillChild();
      signalHardExitTimer = setTimeout(() => {
        runtime.exit(1);
      }, RESPAWN_SIGNAL_HARD_EXIT_GRACE_MS);
      signalHardExitTimer.unref?.();
    }, RESPAWN_SIGNAL_FORCE_KILL_GRACE_MS);
    signalForceKillTimer.unref?.();
  };
  const scheduleParentExit = () => {
    parentSignalReceived = true;
    if (signalExitTimer) return;
    signalExitTimer = setTimeout(() => {
      requestChildTermination();
    }, RESPAWN_SIGNAL_EXIT_GRACE_MS);
    signalExitTimer.unref?.();
  };
  runtime.attachChildProcessBridge(child, { onSignal: scheduleParentExit });
  child.once("exit", (code, signal) => {
    if (parentSignalReceived && detachForProcessTree) forceKillChild();
    clearSignalTimers();
    if (signal) {
      runtime.exit(1);
      return;
    }
    runtime.exit(code ?? 1);
  });
  child.once("error", (error) => {
    clearSignalTimers();
    onError(error);
    runtime.exit(1);
  });
  return child;
}
//#endregion
//#region src/entry.compile-cache.ts
const MIN_COMPILE_CACHE_NODE_24_MINOR = 15;
const COMPILE_CACHE_DISABLED_RESPAWNED_ENV = "OPENCLAW_COMPILE_CACHE_DISABLED_RESPAWNED";
function resolveEntryInstallRoot(entryFile) {
  const entryDir = path.dirname(entryFile);
  const entryParent = path.basename(entryDir);
  return entryParent === "dist" || entryParent === "src" ? path.dirname(entryDir) : entryDir;
}
function isSourceCheckoutInstallRoot(installRoot) {
  return (
    existsSync(path.join(installRoot, ".git")) ||
    existsSync(path.join(installRoot, "src", "entry.ts"))
  );
}
function isNodeCompileCacheDisabled(env) {
  return env?.NODE_DISABLE_COMPILE_CACHE !== void 0;
}
function isNodeCompileCacheRequested(env) {
  return env?.NODE_COMPILE_CACHE !== void 0 && !isNodeCompileCacheDisabled(env);
}
function isNodeVersionAffectedByCompileCacheDeadlock(nodeVersion) {
  if (!nodeVersion) return false;
  const match = nodeVersion.match(/^(\d+)\.(\d+)/);
  if (!match) return false;
  const major = Number.parseInt(expectDefined(match[1], "compile-cache major version capture"), 10);
  const minor = Number.parseInt(expectDefined(match[2], "compile-cache minor version capture"), 10);
  if (major !== 24) return false;
  return minor < MIN_COMPILE_CACHE_NODE_24_MINOR;
}
function shouldEnableOpenClawCompileCache(params) {
  if (isNodeCompileCacheDisabled(params.env)) return false;
  if (
    (params.platform ?? process$1.platform) === "win32" &&
    isNodeVersionAffectedByCompileCacheDeadlock(params.nodeVersion ?? process$1.versions.node)
  )
    return false;
  return !isSourceCheckoutInstallRoot(params.installRoot);
}
function sanitizeCompileCachePathSegment(value) {
  const normalized = value.replace(/[^A-Za-z0-9._-]+/g, "_").replace(/^_+|_+$/g, "");
  return normalized.length > 0 ? normalized : "unknown";
}
function readPackageVersion(packageJsonPath) {
  try {
    const parsed = JSON.parse(readFileSync(packageJsonPath, "utf8"));
    if (
      parsed &&
      typeof parsed === "object" &&
      "version" in parsed &&
      typeof parsed.version === "string" &&
      parsed.version.trim().length > 0
    )
      return parsed.version;
  } catch {}
  return "unknown";
}
function resolveOpenClawCompileCacheDirectory(params) {
  const env = params.env ?? process$1.env;
  const packageJsonPath = path.join(params.installRoot, "package.json");
  const version = sanitizeCompileCachePathSegment(readPackageVersion(packageJsonPath));
  let installMarker = "no-package-json";
  try {
    const stat = statSync(packageJsonPath);
    installMarker = `${Math.trunc(stat.mtimeMs)}-${stat.size}`;
  } catch {}
  const baseDirectory =
    env.NODE_COMPILE_CACHE && !isNodeCompileCacheDisabled(env)
      ? env.NODE_COMPILE_CACHE
      : path.join(os.tmpdir(), "node-compile-cache");
  return path.join(
    baseDirectory,
    "openclaw",
    version,
    sanitizeCompileCachePathSegment(installMarker),
  );
}
function buildOpenClawCompileCacheRespawnPlan(params) {
  const env = params.env ?? process$1.env;
  if (
    !(
      isSourceCheckoutInstallRoot(params.installRoot) ||
      ((params.platform ?? process$1.platform) === "win32" &&
        isNodeVersionAffectedByCompileCacheDeadlock(params.nodeVersion ?? process$1.versions.node))
    )
  )
    return;
  if (env[COMPILE_CACHE_DISABLED_RESPAWNED_ENV] === "1") return;
  if (!params.compileCacheDir && !isNodeCompileCacheRequested(env)) return;
  const nextEnv = {
    ...env,
    NODE_DISABLE_COMPILE_CACHE: "1",
    [COMPILE_CACHE_DISABLED_RESPAWNED_ENV]: "1",
  };
  delete nextEnv.NODE_COMPILE_CACHE;
  return {
    command: params.execPath ?? process$1.execPath,
    args: [
      ...(params.execArgv ?? process$1.execArgv),
      params.currentFile,
      ...(params.argv ?? process$1.argv).slice(2),
    ],
    env: nextEnv,
    detachForProcessTree:
      (params.platform ?? process$1.platform) !== "win32" &&
      !isTerminalInteractiveRespawnArgv(params.argv ?? process$1.argv),
  };
}
function respawnWithoutOpenClawCompileCacheIfNeeded(params) {
  const plan = buildOpenClawCompileCacheRespawnPlan({
    currentFile: params.currentFile,
    installRoot: params.installRoot,
    compileCacheDir: getCompileCacheDir?.(),
  });
  if (!plan) return false;
  runOpenClawCompileCacheRespawnPlan(plan);
  return true;
}
function runOpenClawCompileCacheRespawnPlan(
  plan,
  runtime = {
    spawn,
    attachChildProcessBridge,
    exit: process$1.exit.bind(process$1),
    writeError: (message) => process$1.stderr.write(message),
  },
) {
  return runRespawnChildWithSignalBridge({
    command: plan.command,
    args: plan.args,
    env: plan.env,
    detachForProcessTree: plan.detachForProcessTree,
    runtime,
    onError: (error) => {
      runtime.writeError(
        `[openclaw] Failed to respawn CLI without compile cache: ${error instanceof Error ? (error.stack ?? error.message) : String(error)}\n`,
      );
    },
  });
}
function enableOpenClawCompileCache(params) {
  if (!shouldEnableOpenClawCompileCache(params)) return;
  try {
    enableCompileCache(resolveOpenClawCompileCacheDirectory(params));
  } catch {}
}
//#endregion
//#region src/entry.respawn.ts
const EXPERIMENTAL_WARNING_FLAG = "--disable-warning=ExperimentalWarning";
const OPENCLAW_NODE_OPTIONS_READY = "OPENCLAW_NODE_OPTIONS_READY";
const OPENCLAW_NODE_EXTRA_CA_CERTS_READY = "OPENCLAW_NODE_EXTRA_CA_CERTS_READY";
const WINDOWS_STACK_SIZE_FLAG = "--stack-size=8192";
function pathModuleForPlatform(platform) {
  return platform === "win32" ? path.win32 : path.posix;
}
function resolveCliRespawnCommand(params) {
  const basename = pathModuleForPlatform(params.platform ?? process.platform)
    .basename(params.execPath)
    .toLowerCase();
  if (basename === "volta-shim" || basename === "volta-shim.exe") return "node";
  return params.execPath;
}
function hasExperimentalWarningSuppressed(params = {}) {
  const env = params.env ?? process.env;
  const execArgv = params.execArgv ?? process.execArgv;
  const nodeOptions = env.NODE_OPTIONS ?? "";
  if (nodeOptions.includes(EXPERIMENTAL_WARNING_FLAG) || nodeOptions.includes("--no-warnings"))
    return true;
  return execArgv.some((arg) => arg === EXPERIMENTAL_WARNING_FLAG || arg === "--no-warnings");
}
function hasStackSizeConfigured(execArgv) {
  return execArgv.some(
    (arg) =>
      arg === "--stack-size" ||
      arg.startsWith("--stack-size=") ||
      arg === "--stack_size" ||
      arg.startsWith("--stack_size="),
  );
}
function buildCliRespawnPlan(params = {}) {
  const argv = params.argv ?? process.argv;
  const env = params.env ?? process.env;
  const execArgv = params.execArgv ?? process.execArgv;
  const execPath = params.execPath ?? process.execPath;
  const platform = params.platform ?? process.platform;
  const normalizedArgv =
    platform === "win32"
      ? normalizeWindowsArgv(argv, {
          platform,
          execPath,
        })
      : argv;
  if (
    shouldSkipStartupEnvironmentRespawnForArgv(normalizedArgv) ||
    isTruthyEnvValue(env.OPENCLAW_NO_RESPAWN)
  )
    return null;
  const childEnv = { ...env };
  const childExecArgv = [...execArgv];
  let needsRespawn = false;
  if (platform === "win32") {
    if (!hasStackSizeConfigured(childExecArgv)) {
      childExecArgv.unshift(WINDOWS_STACK_SIZE_FLAG);
      needsRespawn = true;
    }
    if (!needsRespawn) return null;
    return {
      command: resolveCliRespawnCommand({
        execPath,
        platform,
      }),
      argv: [...childExecArgv, ...normalizedArgv.slice(1)],
      env: childEnv,
      detachForProcessTree: false,
    };
  }
  const autoNodeExtraCaCerts =
    params.autoNodeExtraCaCerts ??
    resolveNodeStartupTlsEnvironment({
      env,
      execPath,
      includeDarwinDefaults: false,
    }).NODE_EXTRA_CA_CERTS;
  if (
    autoNodeExtraCaCerts &&
    !isTruthyEnvValue(env[OPENCLAW_NODE_EXTRA_CA_CERTS_READY]) &&
    !env.NODE_EXTRA_CA_CERTS
  ) {
    childEnv.NODE_EXTRA_CA_CERTS = autoNodeExtraCaCerts;
    childEnv[OPENCLAW_NODE_EXTRA_CA_CERTS_READY] = "1";
    needsRespawn = true;
  }
  if (
    !shouldSkipRespawnForArgv(argv) &&
    !isTruthyEnvValue(env[OPENCLAW_NODE_OPTIONS_READY]) &&
    !hasExperimentalWarningSuppressed({
      env,
      execArgv,
    })
  ) {
    childEnv[OPENCLAW_NODE_OPTIONS_READY] = "1";
    childExecArgv.unshift(EXPERIMENTAL_WARNING_FLAG);
    needsRespawn = true;
  }
  if (!needsRespawn) return null;
  return {
    command: resolveCliRespawnCommand({
      execPath,
      platform,
    }),
    argv: [...childExecArgv, ...argv.slice(1)],
    env: childEnv,
    detachForProcessTree: !isTerminalInteractiveRespawnArgv(argv),
  };
}
function runCliRespawnPlan(
  plan,
  runtime = {
    spawn,
    attachChildProcessBridge,
    exit: process.exit.bind(process),
    writeError: (message, error) => console.error(message, error),
  },
) {
  return runRespawnChildWithSignalBridge({
    command: plan.command,
    args: plan.argv,
    env: plan.env,
    detachForProcessTree: plan.detachForProcessTree,
    runtime,
    onError: (error) => {
      runtime.writeError(
        "[openclaw] Failed to respawn CLI:",
        error instanceof Error ? (error.stack ?? error.message) : error,
      );
    },
  });
}
//#endregion
//#region src/entry.version-fast-path.ts
function tryHandleRootVersionFastPath(argv, deps = {}) {
  if (resolveCliContainerTarget(argv, deps.env)) return false;
  if (!isRootVersionInvocation(argv)) return false;
  const output = deps.output ?? ((message) => console.log(message));
  const exit = deps.exit ?? ((code) => process.exit(code));
  const onError =
    deps.onError ??
    ((error) => {
      console.error(
        "[openclaw] Failed to resolve version:",
        error instanceof Error ? (error.stack ?? error.message) : error,
      );
      exit(1);
    });
  (
    deps.resolveVersion ??
    (async () => {
      const [{ VERSION }, { resolveCommitHash }] = await Promise.all([
        import("./version-BmsGkjsI.js"),
        import("./git-commit-CmxOH7qB.js"),
      ]);
      return {
        VERSION,
        resolveCommitHash,
      };
    })
  )()
    .then(({ VERSION, resolveCommitHash }) => {
      const commit = resolveCommitHash({ moduleUrl: deps.moduleUrl ?? import.meta.url });
      output(commit ? `OpenClaw ${VERSION} (${commit})` : `OpenClaw ${VERSION}`);
      exit(0);
    })
    .catch(onError);
  return true;
}
//#endregion
//#region src/entry.ts
const ENTRY_WRAPPER_PAIRS = [
  {
    wrapperBasename: "openclaw.mjs",
    entryBasename: "entry.js",
  },
  {
    wrapperBasename: "openclaw.js",
    entryBasename: "entry.js",
  },
];
const loadRootHelpLiveConfigModule = async () =>
  await import("./root-help-live-config-DLFpCf-w.js");
const loadRootHelpMetadataModule = async () => await import("./root-help-metadata-Oxd_25lt.js");
function shouldForceReadOnlyAuthStore(argv) {
  const tokens = argv.slice(2).filter((token) => token.length > 0 && !token.startsWith("-"));
  for (let index = 0; index < tokens.length - 1; index += 1)
    if (tokens[index] === "secrets" && tokens[index + 1] === "audit") return true;
  return false;
}
const gatewayEntryStartupTrace = createGatewayStartupTrace(process$1.argv, "entry");
if (
  !isMainModule({
    currentFile: fileURLToPath(import.meta.url),
    wrapperEntryPairs: [...ENTRY_WRAPPER_PAIRS],
  })
) {
} else {
  const entryFile = fileURLToPath(import.meta.url);
  const installRoot = resolveEntryInstallRoot(entryFile);
  if (
    !respawnWithoutOpenClawCompileCacheIfNeeded({
      currentFile: entryFile,
      installRoot,
    })
  ) {
    process$1.title = "openclaw";
    ensureOpenClawExecMarkerOnProcess();
    installProcessWarningFilter();
    normalizeEnv();
    const { assertSupportedRuntime } = await import("./runtime-guard-BAzir5IC.js");
    assertSupportedRuntime();
    enableOpenClawCompileCache({ installRoot });
    gatewayEntryStartupTrace.mark("bootstrap");
    if (shouldForceReadOnlyAuthStore(process$1.argv))
      process$1.env.OPENCLAW_AUTH_STORE_READONLY = "1";
    if (process$1.argv.includes("--no-color")) {
      process$1.env.NO_COLOR = "1";
      process$1.env.FORCE_COLOR = "0";
    }
    function ensureCliRespawnReady() {
      const plan = buildCliRespawnPlan();
      if (!plan) return false;
      runCliRespawnPlan(plan);
      return true;
    }
    process$1.argv = normalizeWindowsArgv(process$1.argv);
    if (!ensureCliRespawnReady()) {
      const parsedContainer = parseCliContainerArgs(process$1.argv);
      if (!parsedContainer.ok) {
        console.error(`[openclaw] ${parsedContainer.error}`);
        process$1.exit(2);
      }
      const parsed = parseCliProfileArgs(parsedContainer.argv);
      if (!parsed.ok) {
        console.error(`[openclaw] ${parsed.error}`);
        process$1.exit(2);
      }
      if (resolveCliContainerTarget(process$1.argv) && parsed.profile) {
        console.error("[openclaw] --container cannot be combined with --profile/--dev");
        process$1.exit(2);
      }
      if (parsed.profile) {
        applyCliProfileEnv({ profile: parsed.profile });
        process$1.argv = parsed.argv;
      }
      gatewayEntryStartupTrace.mark("argv");
      if (!tryHandleRootVersionFastPath(process$1.argv)) await runMainOrRootHelp(process$1.argv);
    }
  }
}
async function tryHandleRootHelpFastPath(argv, deps = {}) {
  if (resolveCliContainerTarget(argv, deps.env)) return false;
  if (!isRootHelpInvocation(argv)) return false;
  const handleError =
    deps.onError ??
    ((error) => {
      console.error(
        "[openclaw] Failed to display help:",
        error instanceof Error ? (error.stack ?? error.message) : error,
      );
      process$1.exit(1);
    });
  try {
    const liveRootHelpOptions = await (
      deps.loadRootHelpRenderOptionsForConfigSensitivePlugins ??
      (await loadRootHelpLiveConfigModule()).loadRootHelpRenderOptionsForConfigSensitivePlugins
    )(deps.env);
    if (!liveRootHelpOptions) {
      if (
        (
          deps.outputPrecomputedRootHelpText ??
          (await loadRootHelpMetadataModule()).outputPrecomputedRootHelpText
        )()
      )
        return true;
    }
    await (deps.outputRootHelp ?? (await import("./root-help-Cee7pbj5.js")).outputRootHelp)(
      liveRootHelpOptions ?? void 0,
    );
    return true;
  } catch (error) {
    handleError(error);
    return true;
  }
}
async function tryHandlePrecomputedCommandHelpFastPath(argv, deps = {}) {
  const env = deps.env ?? process$1.env;
  if (resolveCliContainerTarget(argv, env)) return false;
  try {
    return await tryOutputPrecomputedCommandHelp(argv, {
      ...deps,
      env,
    });
  } catch {
    return false;
  }
}
async function runMainOrRootHelp(argv) {
  if (await tryHandleRootHelpFastPath(argv)) return;
  if (await tryHandlePrecomputedCommandHelpFastPath(argv)) return;
  try {
    const { runCli } = await gatewayEntryStartupTrace.measure(
      "run-main-import",
      () => import("./cli/run-main.js"),
    );
    await runCli(argv);
  } catch (error) {
    const { formatCliFailureLines } = await import("./failure-output-Dfsu97Wc.js");
    for (const line of formatCliFailureLines({
      title: "Could not start the CLI.",
      error,
      argv,
    }))
      console.error(line);
    process$1.exit(1);
  }
}
//#endregion
export { tryHandlePrecomputedCommandHelpFastPath, tryHandleRootHelpFastPath };
