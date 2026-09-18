import { spawn } from "node:child_process";
import path from "node:path";
import { t as attachChildProcessBridge } from "./child-process-bridge-Vp-FhPhG.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import {
  n as TUI_SETUP_AUTH_SOURCE_ENV,
  t as TUI_SETUP_AUTH_SOURCE_CONFIG,
} from "./setup-launch-env-DehdAyoV.js";
//#region src/tui/tui-launch.ts
function appendOption(args, flag, value) {
  if (value === void 0) return;
  args.push(flag, String(value));
}
function filterTuiExecArgv(execArgv) {
  const filtered = [];
  for (let index = 0; index < execArgv.length; index += 1) {
    const arg = execArgv[index] ?? "";
    if (
      arg === "--inspect" ||
      arg.startsWith("--inspect=") ||
      arg === "--inspect-brk" ||
      arg.startsWith("--inspect-brk=") ||
      arg === "--inspect-wait" ||
      arg.startsWith("--inspect-wait=")
    ) {
      const next = execArgv[index + 1];
      if (!arg.includes("=") && typeof next === "string" && !next.startsWith("-")) index += 1;
      continue;
    }
    if (arg === "--inspect-port") {
      const next = execArgv[index + 1];
      if (typeof next === "string" && !next.startsWith("-")) index += 1;
      continue;
    }
    if (arg.startsWith("--inspect-port=")) continue;
    filtered.push(arg);
  }
  return filtered;
}
function buildCurrentCliEntryArgs() {
  const entry = process.argv[1]?.trim();
  if (!entry) throw new Error("unable to relaunch TUI: current CLI entry path is unavailable");
  return path.isAbsolute(entry) ? [entry] : [];
}
function buildTuiCliArgs(opts) {
  const args = [...filterTuiExecArgv(process.execArgv), ...buildCurrentCliEntryArgs(), "tui"];
  if (opts.local) args.push("--local");
  appendOption(args, "--url", opts.url);
  appendOption(args, "--token", opts.token);
  appendOption(args, "--password", opts.password);
  appendOption(args, "--tls-fingerprint", opts.tlsFingerprint);
  appendOption(args, "--session", opts.session);
  appendOption(args, "--thinking", opts.thinking);
  appendOption(args, "--message", opts.message);
  appendOption(args, "--timeout-ms", opts.timeoutMs);
  appendOption(args, "--history-limit", opts.historyLimit);
  if (opts.deliver) args.push("--deliver");
  return args;
}
/** Launches a child TUI process with inherited stdio and setup-specific environment hints. */
async function launchTuiCli(opts, launchOptions = {}) {
  const args = buildTuiCliArgs(opts);
  const env =
    launchOptions.gatewayUrl || launchOptions.authSource
      ? {
          ...process.env,
          ...(launchOptions.gatewayUrl ? { OPENCLAW_GATEWAY_URL: launchOptions.gatewayUrl } : {}),
          ...(launchOptions.authSource === "config"
            ? { [TUI_SETUP_AUTH_SOURCE_ENV]: TUI_SETUP_AUTH_SOURCE_CONFIG }
            : {}),
        }
      : process.env;
  process.stdin.pause();
  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, {
      stdio: "inherit",
      env,
    });
    const { detach } = attachChildProcessBridge(child);
    child.once("error", (error) => {
      detach();
      reject(/* @__PURE__ */ new Error(`failed to launch TUI: ${formatErrorMessage(error)}`));
    });
    child.once("exit", (code, signal) => {
      detach();
      if (signal) {
        reject(/* @__PURE__ */ new Error(`TUI exited from signal ${signal}`));
        return;
      }
      if ((code ?? 0) !== 0) {
        reject(/* @__PURE__ */ new Error(`TUI exited with code ${code ?? 1}`));
        return;
      }
      resolve();
    });
  });
}
//#endregion
export { launchTuiCli as t };
