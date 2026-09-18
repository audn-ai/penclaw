import { n as signalProcessTree } from "./kill-tree-Cr15jS_s.js";
import {
  i as resolveTrustedWindowsCmdExe,
  n as isWindowsBatchCommand,
  t as buildWindowsCmdExeCommandLine,
} from "./windows-command-DMZlx6HX.js";
//#region src/process/terminal-pty.ts
function resolveTerminalPtyInvocation(params) {
  const platform = params.platform ?? process.platform;
  if (!isWindowsBatchCommand(params.file, platform))
    return {
      file: params.file,
      args: params.args,
    };
  return {
    file: params.comSpec?.trim() || resolveTrustedWindowsCmdExe(platform),
    args: ["/d", "/s", "/c", buildWindowsCmdExeCommandLine(params.file, params.args)],
  };
}
async function spawnTerminalPty(params) {
  const { spawn } = await import("@lydell/node-pty");
  const comSpec = params.env.ComSpec ?? params.env.COMSPEC;
  const invocation = resolveTerminalPtyInvocation({
    file: params.file,
    args: params.args,
    ...(comSpec ? { comSpec } : {}),
  });
  const pty = spawn(invocation.file, invocation.args, {
    name: params.env.TERM ?? "xterm-256color",
    cols: params.cols,
    rows: params.rows,
    cwd: params.cwd,
    env: params.env,
  });
  return {
    get pid() {
      return pty.pid;
    },
    write: (data) => pty.write(data),
    resize: (cols, rows) => pty.resize(cols, rows),
    pause: () => pty.pause(),
    resume: () => pty.resume(),
    onData: (listener) => {
      pty.onData(listener);
    },
    onExit: (listener) => {
      pty.onExit(listener);
    },
    kill: (signal) => killPtyTree(pty, signal),
  };
}
function killPtyTree(pty, signal) {
  const sig = signal ?? "SIGKILL";
  try {
    if ((sig === "SIGKILL" || sig === "SIGTERM") && typeof pty.pid === "number" && pty.pid > 0)
      signalProcessTree(pty.pid, sig);
    else if (process.platform === "win32") pty.kill();
    else pty.kill(sig);
  } catch {}
}
//#endregion
export { spawnTerminalPty as t };
