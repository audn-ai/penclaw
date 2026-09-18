import { spawnSync } from "node:child_process";
import { t as parseCmdScriptCommandLine } from "./cmd-argv-BseV0o2O.js";
import { b as parseStrictPositiveInteger } from "./number-coercion-CJQ8TR--.js";
import "./parse-finite-number-Z7n6tXLk.js";
import { n as parseWindowsNetstatListeners } from "./ports-netstat-CscdLGyq.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { l as normalizeStringEntries } from "./string-normalization-CRyoFBPt.js";
import {
  a as getWindowsSystem32ExePath,
  o as getWindowsWmicExePath,
  r as getWindowsPowerShellExePath,
} from "./windows-install-roots-Cnzi1kc9.js";
//#region src/infra/gateway-process-argv.ts
function normalizeProcArg(arg) {
  return normalizeLowercaseStringOrEmpty(arg.replaceAll("\\", "/"));
}
const ENTRY_CANDIDATES = [
  "dist/index.js",
  "dist/entry.js",
  "openclaw.mjs",
  "scripts/run-node.mjs",
  "src/entry.ts",
  "src/index.ts",
];
function parseProcCmdline(raw) {
  return normalizeStringEntries(raw.split("\0"));
}
function isOpenClawCommandArgv(args, command) {
  const normalized = args.map(normalizeProcArg);
  const exe = (normalized[0] ?? "").replace(/\.(bat|cmd|exe)$/i, "");
  if (!normalized.includes(normalizeProcArg(command))) return false;
  if (normalized.some((arg) => ENTRY_CANDIDATES.some((entry) => arg.endsWith(entry)))) return true;
  return exe.endsWith("/openclaw") || exe === "openclaw";
}
function isGatewayArgv(args, opts) {
  const exe = (args.map(normalizeProcArg)[0] ?? "").replace(/\.(bat|cmd|exe)$/i, "");
  const isGatewayBinary = exe.endsWith("/openclaw-gateway") || exe === "openclaw-gateway";
  if (!isOpenClawCommandArgv(args, "gateway"))
    return opts?.allowGatewayBinary === true && isGatewayBinary;
  return true;
}
//#endregion
//#region src/infra/windows-port-pids.ts
const DEFAULT_TIMEOUT_MS = 5e3;
function readListeningPidsViaPowerShell(port, timeoutMs) {
  const ps = spawnSync(
    getWindowsPowerShellExePath(),
    [
      "-NoProfile",
      "-Command",
      `(Get-NetTCPConnection -LocalPort ${port} -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess)`,
    ],
    {
      encoding: "utf8",
      timeout: timeoutMs,
      windowsHide: true,
    },
  );
  if (ps.error || ps.status !== 0) return null;
  return ps.stdout.split(/\r?\n/).flatMap((line) => parseStrictPositiveInteger(line.trim()) ?? []);
}
function parseListeningPidsFromNetstat(stdout, port) {
  return [...new Set(parseWindowsNetstatListeners(stdout, port).map((listener) => listener.pid))];
}
function readWindowsListeningPidsOnPortSync(port, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const result = readWindowsListeningPidsResultSync(port, timeoutMs);
  return result.ok ? result.pids : [];
}
function readWindowsListeningPidsResultSync(port, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const powershellPids = readListeningPidsViaPowerShell(port, timeoutMs);
  if (powershellPids != null)
    return {
      ok: true,
      pids: powershellPids,
    };
  const netstat = spawnSync(getWindowsSystem32ExePath("netstat.exe"), ["-ano"], {
    encoding: "utf8",
    timeout: timeoutMs,
    windowsHide: true,
  });
  if (netstat.error) {
    const code = netstat.error.code;
    return {
      ok: false,
      permanent: code === "ENOENT" || code === "EACCES" || code === "EPERM",
    };
  }
  if (netstat.status !== 0)
    return {
      ok: false,
      permanent: false,
    };
  return {
    ok: true,
    pids: parseListeningPidsFromNetstat(netstat.stdout, port),
  };
}
function decodeWindowsProcessOutput(output) {
  if (!Buffer.isBuffer(output)) return output;
  return output.length >= 2 && output[0] === 255 && output[1] === 254
    ? output.toString("utf16le")
    : output.toString("utf8");
}
function extractWindowsCommandLine(raw) {
  const lines = normalizeStringEntries(decodeWindowsProcessOutput(raw).split(/\r?\n/));
  for (const line of lines) {
    if (!normalizeLowercaseStringOrEmpty(line).startsWith("commandline=")) continue;
    return line.slice(12).trim() || null;
  }
  return lines.find((line) => normalizeLowercaseStringOrEmpty(line) !== "commandline") ?? null;
}
function parseWindowsProcessStartTime(raw) {
  const lines = normalizeStringEntries(decodeWindowsProcessOutput(raw).split(/\r?\n/));
  const value =
    lines
      .find((line) => normalizeLowercaseStringOrEmpty(line).startsWith("creationdate="))
      ?.slice(13)
      .trim() ??
    lines.find((line) => normalizeLowercaseStringOrEmpty(line) !== "creationdate") ??
    "";
  const parsedIso = Date.parse(value);
  if (Number.isFinite(parsedIso)) return parsedIso;
  const dmtf = value.match(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})\.(\d{6})([+-])(\d{3})$/);
  if (!dmtf) return null;
  const [, year, month, day, hour, minute, second, microseconds, offsetSign, offset] = dmtf;
  return (
    Date.UTC(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
      Number(second),
      Math.floor(Number(microseconds) / 1e3),
    ) -
    Number(offset) * 6e4 * (offsetSign === "+" ? 1 : -1)
  );
}
/** Read a stable Windows process creation time for lock-owner identity checks. */
function readWindowsProcessStartTimeSync(pid, timeoutMs = DEFAULT_TIMEOUT_MS) {
  if (!Number.isInteger(pid) || pid <= 0) return null;
  const powershell = spawnSync(
    getWindowsPowerShellExePath(),
    [
      "-NoProfile",
      "-NonInteractive",
      "-Command",
      `$process = Get-CimInstance Win32_Process -Filter "ProcessId = ${pid}" -ErrorAction Stop; [Console]::Out.Write($process.CreationDate.ToUniversalTime().ToString("o"))`,
    ],
    {
      encoding: "utf8",
      timeout: timeoutMs,
      windowsHide: true,
    },
  );
  if (!powershell.error && powershell.status === 0) {
    const startTime = parseWindowsProcessStartTime(powershell.stdout);
    if (startTime !== null) return startTime;
  }
  const wmic = spawnSync(
    getWindowsWmicExePath(),
    ["process", "where", `ProcessId=${pid}`, "get", "CreationDate", "/value"],
    {
      timeout: timeoutMs,
      windowsHide: true,
      stdio: ["ignore", "pipe", "ignore"],
    },
  );
  return !wmic.error && wmic.status === 0 ? parseWindowsProcessStartTime(wmic.stdout) : null;
}
function readWindowsProcessArgsSync(pid, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const result = readWindowsProcessArgsResultSync(pid, timeoutMs);
  return result.ok ? result.args : null;
}
function readWindowsProcessArgsResultSync(pid, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const powershell = spawnSync(
    getWindowsPowerShellExePath(),
    [
      "-NoProfile",
      "-Command",
      `(Get-CimInstance Win32_Process -Filter "ProcessId = ${pid}" | Select-Object -ExpandProperty CommandLine)`,
    ],
    {
      encoding: "utf8",
      timeout: timeoutMs,
      windowsHide: true,
    },
  );
  if (!powershell.error && powershell.status === 0) {
    const command = powershell.stdout.trim();
    return {
      ok: true,
      args: command ? parseCmdScriptCommandLine(command) : null,
    };
  }
  const wmic = spawnSync(
    getWindowsWmicExePath(),
    ["process", "where", `ProcessId=${pid}`, "get", "CommandLine", "/value"],
    {
      timeout: timeoutMs,
      windowsHide: true,
      stdio: ["ignore", "pipe", "ignore"],
    },
  );
  if (!wmic.error && wmic.status === 0) {
    const command = extractWindowsCommandLine(wmic.stdout);
    return {
      ok: true,
      args: command ? parseCmdScriptCommandLine(command) : null,
    };
  }
  const code = (wmic.error ?? powershell.error)?.code;
  return {
    ok: false,
    permanent: code === "ENOENT" || code === "EACCES" || code === "EPERM",
  };
}
//#endregion
export {
  readWindowsProcessStartTimeSync as a,
  parseProcCmdline as c,
  readWindowsProcessArgsSync as i,
  readWindowsListeningPidsResultSync as n,
  isGatewayArgv as o,
  readWindowsProcessArgsResultSync as r,
  isOpenClawCommandArgv as s,
  readWindowsListeningPidsOnPortSync as t,
};
