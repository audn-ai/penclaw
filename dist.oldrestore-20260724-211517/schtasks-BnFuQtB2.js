import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import "./src-Bl7G9qvi.js";
import os from "node:os";
import path from "node:path";
import {
  a as renderCmdSetAssignment,
  i as parseCmdSetAssignment,
  n as quoteCmdScriptArg,
  r as assertNoCmdLineBreak,
  t as parseCmdScriptCommandLine,
} from "./cmd-argv-BseV0o2O.js";
import {
  f as resolveGatewayServiceDescription,
  m as resolveGatewayWindowsTaskName,
  o as NODE_SERVICE_KIND,
} from "./constants-obO8goqF.js";
import "./utils-DtcDeqWS.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { t as findVerifiedGatewayListenerPidsOnPortSync } from "./gateway-processes-IA9RuZ0v.js";
import { t as killProcessTree } from "./kill-tree-Cr15jS_s.js";
import { n as resolveGatewayTaskScriptPath } from "./paths-t9LtxoUy.js";
import "./ports-miNUZKci.js";
import { n as inspectPortUsage } from "./ports-inspect-DyOb8qZr.js";
import {
  i as writeFormattedLines,
  n as formatLine,
  t as parseKeyValueOutput,
} from "./runtime-parse-CL1pTtPs.js";
import { t as execSchtasks } from "./schtasks-exec-DJCWZ5Qz.js";
import { t as sleep } from "./sleep-DZm1epyW.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
import { n as parseTcpPort } from "./tcp-port-1cXcKObm.js";
import {
  a as getWindowsSystem32ExePath,
  r as getWindowsPowerShellExePath,
  t as getWindowsCmdExePath,
} from "./windows-install-roots-Cnzi1kc9.js";
import { o as isGatewayArgv } from "./windows-port-pids-ClQ99WdK.js";
//#region src/daemon/schtasks.ts
/** Windows Task Scheduler installer, startup fallback, and lifecycle controls. */
function resolveTaskName(env) {
  const override = env.OPENCLAW_WINDOWS_TASK_NAME?.trim();
  if (override) return override;
  return resolveGatewayWindowsTaskName(env.OPENCLAW_PROFILE);
}
function shouldFallbackToStartupEntry(params) {
  return (
    params.code === 1 ||
    /(?:access is denied|acceso denegado)/i.test(params.detail) ||
    params.code === 124 ||
    /schtasks timed out/i.test(params.detail) ||
    /schtasks produced no output/i.test(params.detail)
  );
}
function resolveTaskScriptPath(env) {
  return resolveGatewayTaskScriptPath(env);
}
function resolveWindowsStartupDir(env) {
  const appData = env.APPDATA?.trim();
  if (appData)
    return path.join(appData, "Microsoft", "Windows", "Start Menu", "Programs", "Startup");
  const home = env.USERPROFILE?.trim() || env.HOME?.trim();
  if (!home) throw new Error("Windows startup folder unavailable: APPDATA/USERPROFILE not set");
  return path.join(
    home,
    "AppData",
    "Roaming",
    "Microsoft",
    "Windows",
    "Start Menu",
    "Programs",
    "Startup",
  );
}
function sanitizeWindowsFilename(value) {
  return value.replace(/[<>:"/\\|?*]/g, "_").replace(/\p{Cc}/gu, "_");
}
function resolveStartupEntryPath(env, extension) {
  const taskName = resolveTaskName(env);
  const entryExtension = extension ?? (shouldUseHiddenWindowsTaskLauncher(env) ? "vbs" : "cmd");
  return path.join(
    resolveWindowsStartupDir(env),
    `${sanitizeWindowsFilename(taskName)}.${entryExtension}`,
  );
}
function resolveStartupEntryPaths(env) {
  return uniqueStrings([
    resolveStartupEntryPath(env),
    resolveStartupEntryPath(env, "cmd"),
    resolveStartupEntryPath(env, "vbs"),
  ]);
}
function quoteSchtasksArg(value) {
  if (!/[ \t"]/g.test(value)) return value;
  return `"${value.replace(/"/g, '\\"')}"`;
}
function escapeXmlText(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
function buildScheduledTaskXml(params) {
  const description = escapeXmlText(params.taskDescription);
  const command = escapeXmlText(params.launchPath);
  const principalLogon = params.taskUser
    ? `\n      <UserId>${escapeXmlText(params.taskUser)}</UserId>\n      <LogonType>InteractiveToken</LogonType>`
    : "\n      <GroupId>S-1-5-32-545</GroupId>";
  return `<?xml version="1.0" encoding="UTF-16"?>
<Task version="1.2" xmlns="http://schemas.microsoft.com/windows/2004/02/mit/task">
  <RegistrationInfo>
    <Description>${description}</Description>
  </RegistrationInfo>
  <Triggers>
    <LogonTrigger>
      <Enabled>true</Enabled>${params.taskUser ? `\n      <UserId>${escapeXmlText(params.taskUser)}</UserId>` : ""}
    </LogonTrigger>
  </Triggers>
  <Principals>
    <Principal id="Author">${principalLogon}
      <RunLevel>LeastPrivilege</RunLevel>
    </Principal>
  </Principals>
  <Settings>
    <MultipleInstancesPolicy>IgnoreNew</MultipleInstancesPolicy>
    <DisallowStartIfOnBatteries>false</DisallowStartIfOnBatteries>
    <StopIfGoingOnBatteries>false</StopIfGoingOnBatteries>
    <AllowHardTerminate>true</AllowHardTerminate>
    <StartWhenAvailable>false</StartWhenAvailable>
    <RunOnlyIfNetworkAvailable>false</RunOnlyIfNetworkAvailable>
    <IdleSettings>
      <StopOnIdleEnd>false</StopOnIdleEnd>
      <RestartOnIdle>false</RestartOnIdle>
    </IdleSettings>
    <AllowStartOnDemand>true</AllowStartOnDemand>
    <Enabled>true</Enabled>
    <Hidden>false</Hidden>
    <RunOnlyIfIdle>false</RunOnlyIfIdle>
    <WakeToRun>false</WakeToRun>
    <ExecutionTimeLimit>PT0S</ExecutionTimeLimit>
    <Priority>7</Priority>
  </Settings>
  <Actions Context="Author">
    <Exec>
      <Command>${command}</Command>
    </Exec>
  </Actions>
</Task>`;
}
async function writeTaskXmlTempFile(xml) {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-task-xml-"));
  const xmlPath = path.join(tmpDir, "task.xml");
  const bom = Buffer.from([255, 254]);
  const body = Buffer.from(xml, "utf16le");
  await fs.writeFile(xmlPath, Buffer.concat([bom, body]));
  return xmlPath;
}
function resolveTaskUser(env) {
  const username = env.USERNAME || env.USER || env.LOGNAME;
  if (!username) return null;
  if (username.includes("\\")) return username;
  const domain = env.USERDOMAIN;
  if (normalizeLowercaseStringOrEmpty(domain) === "workgroup") return username;
  if (domain) return `${domain}\\${username}`;
  return username;
}
function resolveSchtasksCreateUser(env, taskUser) {
  if (normalizeLowercaseStringOrEmpty(env.USERDOMAIN) === "workgroup") return null;
  return taskUser;
}
function shouldUseHiddenWindowsTaskLauncher(env) {
  const value = normalizeLowercaseStringOrEmpty(env.OPENCLAW_WINDOWS_TASK_HIDDEN_LAUNCHER);
  return value === "1" || value === "true" || value === "yes";
}
function resolveTaskLauncherScriptPath(env, scriptPath) {
  if (!shouldUseHiddenWindowsTaskLauncher(env)) return scriptPath;
  const parsed = path.parse(scriptPath);
  return path.join(parsed.dir, `${parsed.name}.vbs`);
}
async function readScheduledTaskCommand(env) {
  const scriptPath = resolveTaskScriptPath(env);
  try {
    const content = await fs.readFile(scriptPath, "utf8");
    let workingDirectory = "";
    let commandLine = "";
    const environment = {};
    for (const rawLine of content.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line) continue;
      const lower = normalizeLowercaseStringOrEmpty(line);
      if (line.startsWith("@echo")) continue;
      if (lower.startsWith("rem ")) continue;
      if (lower.startsWith("set ")) {
        const assignment = parseCmdSetAssignment(line.slice(4));
        if (assignment) environment[assignment.key] = assignment.value;
        continue;
      }
      if (lower.startsWith("cd /d ")) {
        workingDirectory = line.slice(6).trim().replace(/^"|"$/g, "");
        continue;
      }
      commandLine = line;
      break;
    }
    if (!commandLine) return null;
    return {
      programArguments: parseCmdScriptCommandLine(commandLine),
      ...(workingDirectory ? { workingDirectory } : {}),
      ...(Object.keys(environment).length > 0 ? { environment } : {}),
      ...(Object.keys(environment).length > 0
        ? {
            environmentValueSources: Object.fromEntries(
              Object.keys(environment).map((key) => [key, "inline"]),
            ),
          }
        : {}),
      sourcePath: scriptPath,
    };
  } catch {
    return null;
  }
}
function parseSchtasksQuery(output) {
  const entries = parseKeyValueOutput(output, ":");
  const info = {};
  const status = entries.status;
  if (status) info.status = status;
  const lastRunTime = entries["last run time"];
  if (lastRunTime) info.lastRunTime = lastRunTime;
  const lastRunResult = entries["last run result"] ?? entries["last result"];
  if (lastRunResult) info.lastRunResult = lastRunResult;
  return info;
}
function normalizeTaskResultCode(value) {
  if (!value) return null;
  const raw = normalizeLowercaseStringOrEmpty(value);
  if (!raw) return null;
  if (/^0x[0-9a-f]+$/.test(raw)) return `0x${raw.slice(2).replace(/^0+/, "") || "0"}`;
  if (/^\d+$/.test(raw)) {
    const numeric = Number.parseInt(raw, 10);
    if (Number.isFinite(numeric)) return `0x${numeric.toString(16)}`;
  }
  return null;
}
const RUNNING_RESULT_CODES = /* @__PURE__ */ new Set(["0x41301"]);
const NOT_YET_RUN_RESULT_CODES = /* @__PURE__ */ new Set(["0x41303"]);
const UNKNOWN_STATUS_DETAIL =
  "Task status is locale-dependent and no numeric Last Run Result was available.";
const SCHEDULED_TASK_FALLBACK_POLL_MS = 250;
const SCHEDULED_TASK_FALLBACK_TIMEOUT_MS = 15e3;
function deriveScheduledTaskRuntimeStatus(parsed) {
  const normalizedResult = normalizeTaskResultCode(parsed.lastRunResult);
  if (normalizedResult != null) {
    if (RUNNING_RESULT_CODES.has(normalizedResult)) return { status: "running" };
    return {
      status: "stopped",
      detail: `Task Last Run Result=${parsed.lastRunResult}; treating as not running.`,
    };
  }
  if (parsed.status?.trim())
    return {
      status: "unknown",
      detail: UNKNOWN_STATUS_DETAIL,
    };
  return { status: "unknown" };
}
function buildTaskScript({ description, programArguments, workingDirectory, environment }) {
  const lines = ["@echo off"];
  const trimmedDescription = description?.trim();
  if (trimmedDescription) {
    assertNoCmdLineBreak(trimmedDescription, "Task description");
    lines.push(`rem ${trimmedDescription}`);
  }
  if (workingDirectory) lines.push(`cd /d ${quoteCmdScriptArg(workingDirectory)}`);
  if (environment)
    for (const [key, value] of Object.entries(environment)) {
      if (!value) continue;
      if (key.toUpperCase() === "PATH") continue;
      lines.push(renderCmdSetAssignment(key, value));
    }
  const command = programArguments.map(quoteCmdScriptArg).join(" ");
  lines.push(command);
  return `${lines.join("\r\n")}\r\n`;
}
function renderStartupLaunchCommand(scriptPath) {
  return `start "" /min ${quoteCmdScriptArg(getWindowsCmdExePath())} /d /c ${quoteCmdScriptArg(scriptPath)}`;
}
function buildStartupLauncherScript(params) {
  const lines = ["@echo off"];
  const trimmedDescription = params.description?.trim();
  if (trimmedDescription) {
    assertNoCmdLineBreak(trimmedDescription, "Startup launcher description");
    lines.push(`rem ${trimmedDescription}`);
  }
  lines.push(renderStartupLaunchCommand(params.scriptPath));
  return `${lines.join("\r\n")}\r\n`;
}
function quoteVbsString(value) {
  return `"${value.replace(/"/g, '""')}"`;
}
function quoteVbsRunCommand(scriptPath) {
  return quoteVbsString(`"${scriptPath}"`);
}
function buildHiddenLauncherScript(params) {
  const lines = [];
  const trimmedDescription = params.description?.trim();
  if (trimmedDescription) {
    assertNoCmdLineBreak(trimmedDescription, "Hidden launcher description");
    lines.push(`' ${trimmedDescription}`);
  }
  lines.push(
    `CreateObject("WScript.Shell").Run ${quoteVbsRunCommand(params.scriptPath)}, 0, False`,
  );
  return `${lines.join("\r\n")}\r\n`;
}
async function assertSchtasksAvailable() {
  const res = await execSchtasks(["/Query"]);
  if (res.code === 0) return;
  const detail = res.stderr || res.stdout;
  throw new Error(`schtasks unavailable: ${detail || "unknown error"}`.trim());
}
async function isStartupEntryInstalled(env) {
  for (const startupEntryPath of resolveStartupEntryPaths(env))
    try {
      await fs.access(startupEntryPath);
      return true;
    } catch {}
  return false;
}
async function removeStartupEntries(env, stdout) {
  for (const startupEntryPath of resolveStartupEntryPaths(env))
    try {
      await fs.unlink(startupEntryPath);
      stdout.write(`${formatLine("Removed Windows login item", startupEntryPath)}\n`);
    } catch {}
}
async function hasScheduledTaskRunningEvidence(env) {
  const runtime = await readScheduledTaskRuntime(env).catch(() => null);
  if (runtime?.status !== "running") return false;
  const normalizedResult = normalizeTaskResultCode(runtime.lastRunResult);
  if (normalizedResult !== null && RUNNING_RESULT_CODES.has(normalizedResult)) return true;
  return shouldUseHiddenWindowsTaskLauncher(env) && normalizedResult === "0x0";
}
async function waitForScheduledTaskRunningEvidence(env) {
  const deadline = Date.now() + SCHEDULED_TASK_FALLBACK_TIMEOUT_MS;
  while (true) {
    if (await hasScheduledTaskRunningEvidence(env)) return true;
    if (Date.now() >= deadline) return false;
    await sleep(SCHEDULED_TASK_FALLBACK_POLL_MS);
  }
}
async function isRegisteredScheduledTask(env) {
  return (
    (
      await execSchtasks(["/Query", "/TN", resolveTaskName(env)]).catch(() => ({
        code: 1,
        stdout: "",
        stderr: "",
      }))
    ).code === 0
  );
}
async function launchFallbackTaskScript(env, installedCommand) {
  const scriptPath = resolveTaskScriptPath(env);
  const command =
    installedCommand === void 0 ? await readScheduledTaskCommand(env) : installedCommand;
  if (command?.programArguments.length) {
    const [executable, ...args] = command.programArguments;
    spawn(expectDefined(executable, "schtasks executable"), args, {
      cwd: command.workingDirectory || void 0,
      detached: true,
      env: {
        ...process.env,
        ...command.environment,
      },
      stdio: "ignore",
      windowsHide: true,
    }).unref();
    return;
  }
  spawn(getWindowsCmdExePath(), ["/d", "/c", scriptPath], {
    detached: true,
    stdio: "ignore",
    windowsHide: true,
  }).unref();
}
function resolveConfiguredGatewayPort(env) {
  return parseTcpPort(env.OPENCLAW_GATEWAY_PORT);
}
function parsePositivePort(raw) {
  return parseTcpPort(raw);
}
function parsePortFromProgramArguments(programArguments) {
  if (!programArguments?.length) return null;
  for (let i = 0; i < programArguments.length; i += 1) {
    const arg = programArguments[i];
    if (!arg) continue;
    const inlineMatch = arg.match(/^--port=(\d+)$/);
    if (inlineMatch) return parsePositivePort(inlineMatch[1]);
    if (arg === "--port") return parsePositivePort(programArguments[i + 1]);
  }
  return null;
}
function isNodeHostArgv(programArguments) {
  const normalized = programArguments.map((arg) =>
    normalizeLowercaseStringOrEmpty(arg.replaceAll("\\", "/")),
  );
  return normalized.some((arg, index) => arg === "node" && normalized[index + 1] === "run");
}
function normalizeProgramArguments(programArguments) {
  return programArguments.map((arg) => normalizeLowercaseStringOrEmpty(arg.replaceAll("\\", "/")));
}
function matchesInstalledProgramArguments(actualArguments, installedArguments) {
  const actual = normalizeProgramArguments(actualArguments);
  const installed = normalizeProgramArguments(installedArguments);
  return (
    actual.length === installed.length && actual.every((arg, index) => arg === installed[index])
  );
}
function getSnapshotProcessId(entry) {
  const pid = entry.ProcessId;
  return typeof pid === "number" && Number.isFinite(pid) && pid > 0 ? pid : null;
}
function findInstalledProcessPid(entries, port, installedArguments, matchesProcess) {
  for (const entry of entries) {
    if (!normalizeLowercaseStringOrEmpty(entry.CommandLine ?? "")) continue;
    const argv = parseCmdScriptCommandLine(entry.CommandLine ?? "");
    if (
      !matchesProcess(argv) ||
      parsePortFromProgramArguments(argv) !== port ||
      !matchesInstalledProgramArguments(argv, installedArguments)
    )
      continue;
    const pid = getSnapshotProcessId(entry);
    if (pid) return pid;
  }
  return null;
}
async function resolveScheduledTaskProcess(env, matchesProcess) {
  const command = await readScheduledTaskCommand(env).catch(() => null);
  const installedArguments = command?.programArguments;
  if (!installedArguments?.length) return null;
  const port =
    parsePortFromProgramArguments(installedArguments) ??
    parsePositivePort(command?.environment?.OPENCLAW_GATEWAY_PORT) ??
    resolveConfiguredGatewayPort(env);
  if (!port) return null;
  const snapshot = readWindowsProcessSnapshot();
  if (!snapshot) return null;
  const pid = findInstalledProcessPid(snapshot, port, installedArguments, matchesProcess);
  if (!pid) return null;
  return {
    pid,
    port,
  };
}
async function resolveScheduledTaskNodeHostProcess(env) {
  return await resolveScheduledTaskProcess(env, isNodeHostArgv);
}
async function resolveScheduledTaskGatewayProcess(env) {
  return await resolveScheduledTaskProcess(env, (argv) =>
    isGatewayArgv(argv, { allowGatewayBinary: true }),
  );
}
function shouldManageGatewayListenerPort(env) {
  return normalizeLowercaseStringOrEmpty(env.OPENCLAW_SERVICE_KIND) !== NODE_SERVICE_KIND;
}
async function resolveScheduledTaskPort(env) {
  const command = await readScheduledTaskCommand(env).catch(() => null);
  return (
    parsePortFromProgramArguments(command?.programArguments) ??
    parsePositivePort(command?.environment?.OPENCLAW_GATEWAY_PORT) ??
    resolveConfiguredGatewayPort(env)
  );
}
async function resolveScheduledTaskGatewayListenerPids(port) {
  const verified = findVerifiedGatewayListenerPidsOnPortSync(port);
  if (verified.length > 0) return verified;
  const diagnostics = await inspectPortUsage(port).catch(() => null);
  if (diagnostics?.status !== "busy") return [];
  const matchedGatewayPids = resolveGatewayListenerPids(diagnostics.listeners);
  if (matchedGatewayPids.length > 0) return matchedGatewayPids;
  return Array.from(
    new Set(
      diagnostics.listeners
        .map((listener) => listener.pid)
        .filter((pid) => typeof pid === "number" && Number.isFinite(pid) && pid > 0),
    ),
  );
}
function resolveGatewayListenerPids(listeners) {
  return Array.from(
    new Set(
      listeners
        .filter(
          (listener) =>
            typeof listener.pid === "number" &&
            listener.commandLine &&
            isGatewayArgv(parseCmdScriptCommandLine(listener.commandLine), {
              allowGatewayBinary: true,
            }),
        )
        .map((listener) => listener.pid),
    ),
  );
}
async function resolveListenerBackedScheduledTaskRuntime(env) {
  if (!shouldManageGatewayListenerPort(env)) {
    const matched = await resolveScheduledTaskNodeHostProcess(env);
    if (!matched) return null;
    return {
      status: "running",
      pid: matched.pid,
      detail: `Node host process detected for gateway port ${matched.port}.`,
    };
  }
  const matched = await resolveScheduledTaskGatewayProcess(env);
  if (matched)
    return {
      status: "running",
      pid: matched.pid,
      detail: `Gateway process detected for gateway port ${matched.port}.`,
    };
  const port = await resolveScheduledTaskPort(env);
  if (!port) return null;
  const pids = findVerifiedGatewayListenerPidsOnPortSync(port);
  if (pids.length === 0) return null;
  return {
    status: "running",
    pid: pids[0],
    detail: `Verified gateway listener detected on port ${port} even though schtasks did not report a running task.`,
  };
}
async function terminateScheduledTaskNodeHost(env) {
  const matched = await resolveScheduledTaskNodeHostProcess(env);
  if (!matched) return [];
  await terminateGatewayProcessTree(matched.pid, 300);
  return [matched.pid];
}
async function terminateScheduledTaskGatewayListeners(env) {
  if (!shouldManageGatewayListenerPort(env)) return [];
  const port = await resolveScheduledTaskPort(env);
  if (!port) return [];
  const pids = await resolveScheduledTaskGatewayListenerPids(port);
  for (const pid of pids) await terminateGatewayProcessTree(pid, 300);
  return pids;
}
function probeProcessState(pid) {
  if (process.platform === "win32") {
    const snapshot = readWindowsProcessSnapshot();
    if (snapshot)
      return snapshot.some((entry) => getSnapshotProcessId(entry) === pid) ? "alive" : "missing";
    const tasklist = spawnSync(
      getWindowsSystem32ExePath("tasklist.exe"),
      ["/FI", `PID eq ${pid}`, "/FO", "CSV", "/NH"],
      {
        encoding: "utf8",
        timeout: 1500,
        windowsHide: true,
      },
    );
    if (tasklist.error || tasklist.status !== 0) return "unknown";
    return tasklist.stdout.split(/\r?\n/).some((line) => line.includes(`,"${pid}",`))
      ? "alive"
      : "missing";
  }
  try {
    process.kill(pid, 0);
    return "alive";
  } catch (err) {
    return err.code === "ESRCH" ? "missing" : "unknown";
  }
}
async function waitForProcessExit(pid, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (probeProcessState(pid) === "missing") return true;
    await sleep(100);
  }
  return probeProcessState(pid) === "missing";
}
async function terminateGatewayProcessTree(pid, graceMs) {
  if (process.platform !== "win32") {
    killProcessTree(pid, { graceMs });
    return;
  }
  const taskkillPath = getWindowsSystem32ExePath("taskkill.exe");
  const graceful = spawnSync(taskkillPath, ["/T", "/PID", String(pid)], {
    stdio: "ignore",
    timeout: 5e3,
    windowsHide: true,
  });
  if (await waitForProcessExit(pid, graceful.status === 0 && !graceful.error ? graceMs : 0)) return;
  const forced = spawnSync(taskkillPath, ["/F", "/T", "/PID", String(pid)], {
    stdio: "ignore",
    timeout: 5e3,
    windowsHide: true,
  });
  if (forced.error || forced.status !== 0) {
    if (probeProcessState(pid) === "missing") return;
    throw new Error(`taskkill could not terminate gateway process ${pid}`);
  }
  if (!(await waitForProcessExit(pid, 5e3)) && probeProcessState(pid) === "alive")
    throw new Error(`gateway process ${pid} is still running after taskkill`);
}
async function waitForGatewayPortRelease(port, timeoutMs = 5e3) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if ((await inspectPortUsage(port).catch(() => null))?.status === "free") return true;
    await sleep(250);
  }
  return false;
}
async function terminateBusyPortListeners(port) {
  const diagnostics = await inspectPortUsage(port).catch(() => null);
  if (diagnostics?.status !== "busy") return [];
  const pids = Array.from(
    new Set(
      diagnostics.listeners
        .map((listener) => listener.pid)
        .filter((pid) => typeof pid === "number" && Number.isFinite(pid) && pid > 0),
    ),
  );
  for (const pid of pids) await terminateGatewayProcessTree(pid, 300);
  return pids;
}
function readWindowsProcessSnapshot() {
  if (process.platform !== "win32") return null;
  const processSnapshot = spawnSync(
    getWindowsPowerShellExePath(),
    [
      "-NoProfile",
      "-Command",
      "Get-CimInstance Win32_Process | Select-Object ProcessId,CommandLine | ConvertTo-Json -Compress",
    ],
    {
      encoding: "utf8",
      timeout: 5e3,
      windowsHide: true,
    },
  );
  if (processSnapshot.error || processSnapshot.status !== 0) return null;
  let parsedSnapshot;
  try {
    parsedSnapshot = JSON.parse(processSnapshot.stdout.trim() || "[]");
  } catch {
    return null;
  }
  const entries = (Array.isArray(parsedSnapshot) ? parsedSnapshot : [parsedSnapshot]).filter(
    (entry) => typeof entry === "object" && entry !== null,
  );
  return entries.length > 0 ? entries : null;
}
async function resolveFallbackRuntime(env, installedCommand, mode = "observe") {
  const command =
    installedCommand === void 0
      ? await readScheduledTaskCommand(env).catch(() => null)
      : installedCommand;
  if (!shouldManageGatewayListenerPort(env)) {
    const installedArguments = command?.programArguments;
    const port =
      parsePortFromProgramArguments(installedArguments) ??
      parsePositivePort(command?.environment?.OPENCLAW_GATEWAY_PORT) ??
      resolveConfiguredGatewayPort(env);
    if (!port)
      return {
        status: "unknown",
        detail: "Startup-folder login item installed; node gateway port unknown.",
      };
    const snapshot = readWindowsProcessSnapshot();
    if (!snapshot)
      return {
        status: "unknown",
        detail: `Startup-folder login item installed; could not inspect node host process for gateway port ${port}.`,
      };
    const pid = installedArguments?.length
      ? findInstalledProcessPid(snapshot, port, installedArguments, isNodeHostArgv)
      : null;
    if (pid)
      return {
        status: "running",
        pid,
        detail: `Startup-folder login item installed; node host process detected for gateway port ${port}.`,
      };
    return {
      status: "stopped",
      detail: `Startup-folder login item installed; no node host process detected for gateway port ${port}.`,
    };
  }
  const port =
    parsePortFromProgramArguments(command?.programArguments) ??
    parsePositivePort(command?.environment?.OPENCLAW_GATEWAY_PORT) ??
    resolveConfiguredGatewayPort(env);
  if (!port)
    return {
      status: "unknown",
      detail: "Startup-folder login item installed; gateway port unknown.",
    };
  const installedArguments = command?.programArguments;
  const shouldInspectProcess = process.platform === "win32" && Boolean(installedArguments?.length);
  const snapshot = shouldInspectProcess ? readWindowsProcessSnapshot() : null;
  const processPid =
    snapshot && installedArguments
      ? findInstalledProcessPid(snapshot, port, installedArguments, () => true)
      : null;
  if (processPid)
    return {
      status: "running",
      pid: processPid,
      detail: `Startup-folder login item installed; matching gateway process detected for port ${port}.`,
    };
  const requireCommandOwnership = mode === "control" && process.platform === "win32";
  if (requireCommandOwnership) {
    if (!installedArguments?.length)
      return {
        status: "unknown",
        detail: `Startup-folder login item installed; persisted command unavailable for gateway port ${port}.`,
      };
    if (!snapshot)
      return {
        status: "unknown",
        detail: `Startup-folder login item installed; could not verify the installed process for gateway port ${port}.`,
      };
  } else {
    const verifiedPids = findVerifiedGatewayListenerPidsOnPortSync(port);
    if (verifiedPids.length > 0)
      return {
        status: "running",
        pid: verifiedPids[0],
        detail: `Startup-folder login item installed; verified gateway listener detected on port ${port}.`,
      };
  }
  const diagnostics = await inspectPortUsage(port).catch(() => null);
  if (!diagnostics)
    return {
      status: "unknown",
      detail: `Startup-folder login item installed; could not inspect port ${port}.`,
    };
  if (diagnostics.status !== "busy") {
    const processInspectionUnavailable = shouldInspectProcess && !snapshot;
    const status =
      diagnostics.status === "free" && !processInspectionUnavailable ? "stopped" : "unknown";
    return {
      status,
      detail:
        status === "unknown" && diagnostics.status === "free"
          ? `Startup-folder login item installed; no listener detected on port ${port}, but process inspection was unavailable.`
          : `Startup-folder login item installed; no gateway listener detected on port ${port}.`,
    };
  }
  const matchedGatewayPids = resolveGatewayListenerPids(diagnostics.listeners);
  if (matchedGatewayPids.length > 0) {
    if (requireCommandOwnership)
      return {
        status: "unknown",
        detail: `Startup-folder login item installed; gateway listener on port ${port} does not match the persisted command.`,
      };
    return {
      status: "running",
      pid: matchedGatewayPids[0],
      detail: `Startup-folder login item installed; verified gateway listener detected on port ${port}.`,
    };
  }
  return {
    status: "unknown",
    detail: `Startup-folder login item installed; port ${port} is busy, but the listener is not a verified gateway process.`,
  };
}
async function assertReplacementPortAvailableForTakeover(params) {
  if (!shouldManageGatewayListenerPort(params.env)) return;
  const port =
    parsePortFromProgramArguments(params.programArguments) ??
    parsePositivePort(params.environment?.OPENCLAW_GATEWAY_PORT) ??
    resolveConfiguredGatewayPort(params.env);
  if (!port) throw new Error("Could not verify the replacement Windows Scheduled Task port.");
  const diagnostics = await inspectPortUsage(port).catch(() => null);
  if (!diagnostics) throw new Error(`Could not inspect replacement gateway port ${port}.`);
  if (diagnostics.status === "free") return;
  if (diagnostics.status !== "busy")
    throw new Error(`Could not verify replacement gateway port ${port}.`);
  const allowedPids = /* @__PURE__ */ new Set();
  if (params.fallbackPid) allowedPids.add(params.fallbackPid);
  if (process.platform === "win32") {
    const snapshot = readWindowsProcessSnapshot();
    if (snapshot) {
      const replacementPid = findInstalledProcessPid(
        snapshot,
        port,
        params.programArguments,
        () => true,
      );
      if (replacementPid) allowedPids.add(replacementPid);
    }
  }
  const listenerPids = diagnostics.listeners.map((listener) => listener.pid);
  if (
    listenerPids.length > 0 &&
    listenerPids.every((pid) => typeof pid === "number" && pid > 0 && allowedPids.has(pid))
  )
    return;
  throw new Error(`replacement gateway port ${port} is occupied by an unverified process`);
}
async function readWindowsStartupFallbackRuntimeForUpdate(env) {
  if (!(await isStartupEntryInstalled(env))) return null;
  const taskExists = probeScheduledTaskExists(resolveTaskName(env));
  if (taskExists === null)
    throw new Error("Could not verify whether the Windows Scheduled Task exists.");
  if (taskExists) return null;
  return await resolveFallbackRuntime(env, void 0, "control");
}
const FALLBACK_TAKEOVER_REPROBE_TIMEOUT_MS = 5e3;
const FALLBACK_TAKEOVER_REPROBE_INTERVAL_MS = 250;
async function waitForFallbackTakeoverRuntime(
  env,
  installedCommand,
  initialRuntime,
  previousRuntime,
) {
  let runtime = initialRuntime;
  const deadline = Date.now() + FALLBACK_TAKEOVER_REPROBE_TIMEOUT_MS;
  while (runtime.status !== "running" && Date.now() < deadline) {
    await sleep(FALLBACK_TAKEOVER_REPROBE_INTERVAL_MS);
    runtime = await resolveFallbackRuntime(env, installedCommand, "control").catch((err) => ({
      status: "unknown",
      detail: `Could not re-inspect the existing Windows login item: ${String(err)}`,
    }));
  }
  if (runtime.status === "stopped" && previousRuntime.status === "running") {
    const previousPid = previousRuntime.pid;
    if (!previousPid || probeProcessState(previousPid) !== "missing")
      return {
        status: "unknown",
        detail: "The previously running Windows login item has not exited cleanly.",
      };
  }
  return runtime;
}
async function resolveControllableFallbackRuntime(env) {
  const runtime = await resolveFallbackRuntime(env, void 0, "control");
  if (runtime.status === "unknown")
    throw new Error(runtime.detail ?? "Could not verify Windows login item ownership.");
  return runtime;
}
async function stopStartupEntry(env, stdout) {
  const runtime = await resolveControllableFallbackRuntime(env);
  if (typeof runtime.pid === "number" && runtime.pid > 0)
    await terminateGatewayProcessTree(runtime.pid, 300);
  stdout.write(`${formatLine("Stopped Windows login item", resolveTaskName(env))}\n`);
}
async function terminateInstalledStartupRuntime(env) {
  if (!(await isStartupEntryInstalled(env))) return;
  const runtime = await resolveControllableFallbackRuntime(env);
  if (typeof runtime.pid === "number" && runtime.pid > 0)
    await terminateGatewayProcessTree(runtime.pid, 300);
}
async function restartStartupEntry(env, stdout) {
  const runtime = await resolveControllableFallbackRuntime(env);
  if (typeof runtime.pid === "number" && runtime.pid > 0)
    await terminateGatewayProcessTree(runtime.pid, 300);
  await launchFallbackTaskScript(env);
  stdout.write(`${formatLine("Restarted Windows login item", resolveTaskName(env))}\n`);
  return { outcome: "completed" };
}
const CALLER_OWNED_SERVICE_IDENTITY_KEYS = [
  "OPENCLAW_LAUNCHD_LABEL",
  "OPENCLAW_SYSTEMD_UNIT",
  "OPENCLAW_WINDOWS_TASK_NAME",
];
function resolveScheduledTaskRenderEnv(env, environment) {
  if (!environment) return env;
  const merged = {
    ...env,
    ...environment,
  };
  for (const key of CALLER_OWNED_SERVICE_IDENTITY_KEYS) {
    const value = env[key]?.trim();
    if (value) merged[key] = value;
  }
  return merged;
}
function resolveScheduledTaskScriptEnvironment(taskEnv, environment) {
  const scriptEnv = environment ? { ...environment } : {};
  for (const key of CALLER_OWNED_SERVICE_IDENTITY_KEYS) {
    const value = taskEnv[key]?.trim();
    if (value) scriptEnv[key] = value;
  }
  return Object.keys(scriptEnv).length > 0 ? scriptEnv : void 0;
}
const SCHEDULED_TASK_ACTIVATION_KEYS = [
  "OPENCLAW_WINDOWS_TASK_HIDDEN_LAUNCHER",
  "OPENCLAW_TASK_SCRIPT_NAME",
  "OPENCLAW_TASK_SCRIPT",
  "OPENCLAW_SERVICE_KIND",
  "OPENCLAW_GATEWAY_PORT",
  "OPENCLAW_STATE_DIR",
  "OPENCLAW_PROFILE",
];
function resolveScheduledTaskActivationEnv(env, environment) {
  if (!environment) return env;
  const activationEnv = { ...env };
  for (const key of SCHEDULED_TASK_ACTIVATION_KEYS) {
    const value = environment[key];
    if (value !== void 0) activationEnv[key] = value;
  }
  return activationEnv;
}
async function writeScheduledTaskScript({
  env,
  programArguments,
  workingDirectory,
  environment,
  description,
}) {
  await assertSchtasksAvailable().catch(() => void 0);
  const taskEnv = resolveScheduledTaskRenderEnv(env, environment);
  const scriptPath = resolveTaskScriptPath(taskEnv);
  const taskLaunchPath = resolveTaskLauncherScriptPath(taskEnv, scriptPath);
  await fs.mkdir(path.dirname(scriptPath), { recursive: true });
  const taskDescription = resolveGatewayServiceDescription({
    env: taskEnv,
    environment,
    description,
  });
  const script = buildTaskScript({
    description: taskDescription,
    programArguments,
    workingDirectory,
    environment: resolveScheduledTaskScriptEnvironment(taskEnv, environment),
  });
  await fs.writeFile(scriptPath, script, "utf8");
  if (taskLaunchPath !== scriptPath) {
    const launcher = buildHiddenLauncherScript({
      description: taskDescription,
      scriptPath,
    });
    await fs.writeFile(taskLaunchPath, launcher, "utf8");
  }
  return {
    scriptPath,
    taskLaunchPath,
    taskDescription,
    taskEnv,
  };
}
async function stageScheduledTask({ stdout, ...args }) {
  const { scriptPath } = await writeScheduledTaskScript(args);
  writeFormattedLines(
    stdout,
    [
      {
        label: "Staged task script",
        value: scriptPath,
      },
    ],
    { leadingBlankLine: true },
  );
  return { scriptPath };
}
async function updateExistingScheduledTask(params) {
  if (!(await isRegisteredScheduledTask(params.env))) return null;
  if (
    (await execSchtasks(["/Change", "/TN", params.taskName, "/TR", params.quotedLaunchPath]))
      .code !== 0
  )
    return null;
  const upgradeXmlPath = await writeTaskXmlTempFile(
    buildScheduledTaskXml({
      taskDescription: params.description ?? "OpenClaw Gateway",
      taskUser: resolveTaskUser(params.env),
      launchPath: params.taskLaunchPath,
    }),
  );
  try {
    await execSchtasks(["/Create", "/F", "/TN", params.taskName, "/XML", upgradeXmlPath]);
  } finally {
    await fs
      .rm(path.dirname(upgradeXmlPath), {
        recursive: true,
        force: true,
      })
      .catch(() => {});
  }
  const activation = await runScheduledTaskOrThrow({
    taskName: params.taskName,
    env: params.env,
    scriptPath: params.scriptPath,
  });
  writeFormattedLines(
    params.stdout,
    [
      {
        label: "Updated Scheduled Task",
        value: params.taskName,
      },
      {
        label: "Task script",
        value: params.scriptPath,
      },
    ],
    { leadingBlankLine: true },
  );
  return activation;
}
async function shouldFallbackScheduledTaskLaunch(params) {
  const readLaunchObservation = async () => {
    const runtime = await readScheduledTaskRuntime(params.env).catch(() => null);
    if (runtime?.status === "running")
      return {
        state: "running",
        signature: [runtime.state, runtime.lastRunTime, runtime.lastRunResult, runtime.detail]
          .filter(Boolean)
          .join("|"),
      };
    const normalizedResult = normalizeTaskResultCode(runtime?.lastRunResult);
    if (normalizedResult && NOT_YET_RUN_RESULT_CODES.has(normalizedResult))
      return {
        state: "not-yet-run",
        signature: [runtime?.state, runtime?.lastRunTime, runtime?.lastRunResult, runtime?.detail]
          .filter(Boolean)
          .join("|"),
      };
    if (normalizedResult === "0x0")
      return {
        state: "stopped-success",
        signature: [runtime?.state, runtime?.lastRunTime, runtime?.lastRunResult, runtime?.detail]
          .filter(Boolean)
          .join("|"),
      };
    return {
      state: "other",
      signature: [runtime?.state, runtime?.lastRunTime, runtime?.lastRunResult, runtime?.detail]
        .filter(Boolean)
        .join("|"),
    };
  };
  const hasLaunchEvidence = async () => {
    const command = await readScheduledTaskCommand(params.env).catch(() => null);
    const installedArguments = command?.programArguments;
    const taskPort =
      parsePortFromProgramArguments(installedArguments) ??
      parsePositivePort(command?.environment?.OPENCLAW_GATEWAY_PORT) ??
      resolveConfiguredGatewayPort(params.env);
    const manageGatewayPort = shouldManageGatewayListenerPort(params.env);
    if (manageGatewayPort && taskPort) {
      if ((await resolveScheduledTaskGatewayListenerPids(taskPort)).length > 0) return true;
    }
    const scriptPathNeedle = normalizeLowercaseStringOrEmpty(
      params.scriptPath.replaceAll("/", "\\"),
    );
    if (!scriptPathNeedle) return false;
    const entries = readWindowsProcessSnapshot();
    if (!entries) return false;
    if (
      entries.some((entry) =>
        normalizeLowercaseStringOrEmpty(entry.CommandLine ?? "")
          .replaceAll("/", "\\")
          .includes(scriptPathNeedle),
      )
    )
      return true;
    if (!taskPort) return false;
    if (!manageGatewayPort)
      return installedArguments?.length
        ? findInstalledProcessPid(entries, taskPort, installedArguments, isNodeHostArgv) != null
        : false;
    return entries.some((entry) => {
      if (!normalizeLowercaseStringOrEmpty(entry.CommandLine ?? "")) return false;
      const argv = parseCmdScriptCommandLine(entry.CommandLine ?? "");
      return (
        isGatewayArgv(argv, { allowGatewayBinary: true }) &&
        parsePortFromProgramArguments(argv) === taskPort
      );
    });
  };
  let previous = await readLaunchObservation();
  if (previous.state !== "not-yet-run" && previous.state !== "stopped-success") return false;
  const deadline = Date.now() + SCHEDULED_TASK_FALLBACK_TIMEOUT_MS;
  while (Date.now() < deadline) {
    await sleep(SCHEDULED_TASK_FALLBACK_POLL_MS);
    const current = await readLaunchObservation();
    if (current.state !== "not-yet-run" && current.state !== "stopped-success") return false;
    if (
      current.state === "not-yet-run" &&
      previous.state === "not-yet-run" &&
      current.signature !== previous.signature
    )
      return false;
    if (previous.state === "stopped-success" && current.state === "not-yet-run") return false;
    previous = current;
    if (await hasLaunchEvidence()) return false;
  }
  return true;
}
async function runScheduledTaskOrThrow(params) {
  const run = await execSchtasks(["/Run", "/TN", params.taskName]);
  if (run.code !== 0) throw new Error(`schtasks run failed: ${run.stderr || run.stdout}`.trim());
  if (
    !(await shouldFallbackScheduledTaskLaunch({
      env: params.env,
      scriptPath: params.scriptPath,
    }))
  )
    return "scheduled-task";
  await launchFallbackTaskScript(params.env);
  return "direct-fallback";
}
async function activateScheduledTask(params) {
  const taskDescription = params.description ?? "OpenClaw Gateway";
  const taskName = resolveTaskName(params.env);
  const quotedLaunchPath = quoteSchtasksArg(params.taskLaunchPath);
  const existingActivation = await updateExistingScheduledTask({
    ...params,
    taskName,
    quotedLaunchPath,
  });
  if (existingActivation) return existingActivation;
  const taskUser = resolveTaskUser(params.env);
  const xmlPath = await writeTaskXmlTempFile(
    buildScheduledTaskXml({
      taskDescription,
      taskUser,
      launchPath: params.taskLaunchPath,
    }),
  );
  let create;
  try {
    const xmlArgs = ["/Create", "/F", "/TN", taskName, "/XML", xmlPath];
    const createUser = resolveSchtasksCreateUser(params.env, taskUser);
    create = await execSchtasks(createUser ? [...xmlArgs, "/RU", createUser, "/NP"] : xmlArgs);
    if (create.code !== 0 && createUser) create = await execSchtasks(xmlArgs);
  } finally {
    await fs
      .rm(path.dirname(xmlPath), {
        recursive: true,
        force: true,
      })
      .catch(() => {});
  }
  if (create.code !== 0) {
    const detail = create.stderr || create.stdout;
    if (
      shouldFallbackToStartupEntry({
        code: create.code,
        detail,
      })
    ) {
      const startupEntryPath = resolveStartupEntryPath(params.env);
      await fs.mkdir(path.dirname(startupEntryPath), { recursive: true });
      const launcher = shouldUseHiddenWindowsTaskLauncher(params.env)
        ? buildHiddenLauncherScript({
            description: taskDescription,
            scriptPath: params.scriptPath,
          })
        : buildStartupLauncherScript({
            description: taskDescription,
            scriptPath: params.scriptPath,
          });
      await fs.writeFile(startupEntryPath, launcher, "utf8");
      await launchFallbackTaskScript(params.env);
      writeFormattedLines(
        params.stdout,
        [
          {
            label: "Installed Windows login item",
            value: startupEntryPath,
          },
          {
            label: "Task script",
            value: params.scriptPath,
          },
        ],
        { leadingBlankLine: true },
      );
      return "startup-fallback";
    }
    throw new Error(`schtasks create failed: ${detail}`.trim());
  }
  const activation = await runScheduledTaskOrThrow({
    taskName,
    env: params.env,
    scriptPath: params.scriptPath,
  });
  writeFormattedLines(
    params.stdout,
    [
      {
        label: "Installed Scheduled Task",
        value: taskName,
      },
      {
        label: "Task script",
        value: params.scriptPath,
      },
    ],
    { leadingBlankLine: true },
  );
  return activation;
}
async function installScheduledTask(args) {
  const installedCommand = await readScheduledTaskCommand(args.env).catch(() => null);
  const fallbackEnv = resolveScheduledTaskActivationEnv(args.env, installedCommand?.environment);
  const startupEntryInstalled = await isStartupEntryInstalled(fallbackEnv);
  let startupRuntime = startupEntryInstalled
    ? await resolveFallbackRuntime(fallbackEnv, installedCommand, "control").catch(() => null)
    : null;
  if (
    startupEntryInstalled &&
    args.startupFallbackTakeoverRuntime?.status === "running" &&
    startupRuntime?.status !== "running"
  )
    startupRuntime = await waitForFallbackTakeoverRuntime(
      fallbackEnv,
      installedCommand,
      startupRuntime ?? { status: "unknown" },
      args.startupFallbackTakeoverRuntime,
    );
  if (startupEntryInstalled && (!startupRuntime || startupRuntime.status === "unknown"))
    throw new Error(
      startupRuntime?.detail ??
        "Could not verify the existing Windows login item before Scheduled Task migration.",
    );
  const activationEnv = resolveScheduledTaskActivationEnv(args.env, args.environment);
  if (startupRuntime) {
    const fallbackPid = startupRuntime.status === "running" ? startupRuntime.pid : void 0;
    if (startupRuntime.status === "running" && !fallbackPid)
      throw new Error("Could not verify the existing Windows login item process.");
    await assertReplacementPortAvailableForTakeover({
      env: activationEnv,
      programArguments: args.programArguments,
      ...(args.environment ? { environment: args.environment } : {}),
      ...(fallbackPid ? { fallbackPid } : {}),
    });
  }
  const staged = await writeScheduledTaskScript(args);
  if (
    (await activateScheduledTask({
      env: activationEnv,
      stdout: args.stdout,
      scriptPath: staged.scriptPath,
      taskLaunchPath: staged.taskLaunchPath,
      description: staged.taskDescription,
    })) !== "scheduled-task"
  )
    return { scriptPath: staged.scriptPath };
  const takeoverRuntime =
    startupRuntime?.status === "stopped"
      ? await resolveFallbackRuntime(fallbackEnv, installedCommand, "control").catch(
          () => startupRuntime,
        )
      : startupRuntime;
  if (takeoverRuntime?.status === "running") {
    if (takeoverRuntime.pid) {
      await terminateGatewayProcessTree(takeoverRuntime.pid, 300);
      try {
        await restartRegisteredScheduledTask({
          env: activationEnv,
          stdout: args.stdout,
          mode: { kind: "fallback-takeover" },
        });
      } catch (err) {
        await launchFallbackTaskScript(fallbackEnv, installedCommand);
        throw err;
      }
    }
  } else if (
    takeoverRuntime?.status === "stopped" &&
    (await waitForScheduledTaskRunningEvidence(activationEnv))
  )
    await removeStartupEntries(activationEnv, args.stdout);
  return { scriptPath: staged.scriptPath };
}
async function uninstallScheduledTask({ env, stdout }) {
  await assertSchtasksAvailable();
  const taskName = resolveTaskName(env);
  if (await isRegisteredScheduledTask(env).catch(() => false))
    await execSchtasks(["/Delete", "/F", "/TN", taskName]);
  await removeStartupEntries(env, stdout);
  const scriptPath = resolveTaskScriptPath(env);
  const parsedScriptPath = path.parse(scriptPath);
  const launcherPaths = uniqueStrings([
    resolveTaskLauncherScriptPath(env, scriptPath),
    path.join(parsedScriptPath.dir, `${parsedScriptPath.name}.vbs`),
  ]);
  for (const launcherPath of launcherPaths) {
    if (launcherPath === scriptPath) continue;
    try {
      await fs.unlink(launcherPath);
      stdout.write(`${formatLine("Removed task launcher", launcherPath)}\n`);
    } catch {}
  }
  try {
    await fs.unlink(scriptPath);
    stdout.write(`${formatLine("Removed task script", scriptPath)}\n`);
  } catch {
    stdout.write(`Task script not found at ${scriptPath}\n`);
  }
}
function isTaskNotRunning(res) {
  return normalizeLowercaseStringOrEmpty(res.stderr || res.stdout).includes("not running");
}
function parseScheduledTaskXmlEnabled(output) {
  const normalized = output.replace(/^\uFEFF/u, "").replaceAll(String.fromCharCode(0), "");
  const settings = /<Settings(?:\s[^>]*)?>([\s\S]*?)<\/Settings>/iu.exec(normalized)?.[1];
  if (settings === void 0) return null;
  const enabled = /<Enabled>\s*(true|false)\s*<\/Enabled>/iu.exec(settings)?.[1];
  return enabled === void 0 ? true : enabled.toLowerCase() === "true";
}
function probeScheduledTaskExists(taskName) {
  const script = [
    "$ErrorActionPreference='Stop'",
    `$taskName=[Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('${Buffer.from(taskName, "utf8").toString("base64")}'))`,
    "try { $service=New-Object -ComObject 'Schedule.Service'; $service.Connect(); $null=$service.GetFolder('\\').GetTask($taskName); exit 0 } catch { $exception=$_.Exception; while($null -ne $exception.InnerException){$exception=$exception.InnerException}; [Console]::Out.Write($exception.HResult); exit 1 }",
  ].join("; ");
  const probe = spawnSync(
    getWindowsPowerShellExePath(),
    [
      "-NoProfile",
      "-NonInteractive",
      "-EncodedCommand",
      Buffer.from(script, "utf16le").toString("base64"),
    ],
    {
      encoding: "utf8",
      timeout: 5e3,
      windowsHide: true,
    },
  );
  if (probe.error) return null;
  if (probe.status === 0) return true;
  const hresult = Number.parseInt(probe.stdout.trim(), 10);
  return hresult === -2147024894 || hresult === -2147024893 ? false : null;
}
async function changeScheduledTaskEnabledState(params) {
  const taskName = resolveTaskName(params.env);
  if (!params.enabled) {
    const query = await execSchtasks(["/Query", "/TN", taskName, "/XML"]);
    if (query.code !== 0) {
      if (probeScheduledTaskExists(taskName) === false) return false;
      const detail = (query.stderr || query.stdout).trim() || "unknown error";
      throw new Error(`schtasks XML query failed: ${detail}`);
    }
    const enabled = parseScheduledTaskXmlEnabled(query.stdout);
    if (enabled === null)
      throw new Error("schtasks XML query did not expose the task enabled state");
    if (!enabled) return false;
  }
  const result = await execSchtasks([
    "/Change",
    "/TN",
    taskName,
    params.enabled ? "/ENABLE" : "/DISABLE",
  ]);
  if (result.code !== 0) {
    const detail = (result.stderr || result.stdout).trim() || "unknown error";
    const changeError = /* @__PURE__ */ new Error(
      `schtasks ${params.enabled ? "enable" : "disable"} failed: ${detail}`,
    );
    if (!params.enabled) {
      const restore = await execSchtasks(["/Change", "/TN", taskName, "/ENABLE"]);
      if (restore.code !== 0) {
        const restoreDetail = (restore.stderr || restore.stdout).trim() || "unknown error";
        throw new AggregateError(
          [changeError, /* @__PURE__ */ new Error(`schtasks enable failed: ${restoreDetail}`)],
          "Scheduled Task disable failed and its enabled state could not be restored",
        );
      }
    }
    throw changeError;
  }
  return true;
}
async function suspendScheduledTaskAutoStartForUpdate(env = process.env) {
  return await changeScheduledTaskEnabledState({
    env,
    enabled: false,
  });
}
async function resumeScheduledTaskAutoStartAfterUpdate(env = process.env) {
  return await changeScheduledTaskEnabledState({
    env,
    enabled: true,
  });
}
async function stopScheduledTask({ stdout, env }) {
  const effectiveEnv = env ?? process.env;
  try {
    await assertSchtasksAvailable();
  } catch (err) {
    if (await isStartupEntryInstalled(effectiveEnv)) {
      await stopStartupEntry(effectiveEnv, stdout);
      return;
    }
    throw err;
  }
  if (!(await isRegisteredScheduledTask(effectiveEnv))) {
    if (await isStartupEntryInstalled(effectiveEnv)) {
      await stopStartupEntry(effectiveEnv, stdout);
      return;
    }
  }
  const taskName = resolveTaskName(effectiveEnv);
  const res = await execSchtasks(["/End", "/TN", taskName]);
  if (res.code !== 0 && !isTaskNotRunning(res))
    throw new Error(`schtasks end failed: ${res.stderr || res.stdout}`.trim());
  const manageGatewayPort = shouldManageGatewayListenerPort(effectiveEnv);
  const stopPort = manageGatewayPort ? await resolveScheduledTaskPort(effectiveEnv) : null;
  if (manageGatewayPort) await terminateScheduledTaskGatewayListeners(effectiveEnv);
  else await terminateScheduledTaskNodeHost(effectiveEnv);
  await terminateInstalledStartupRuntime(effectiveEnv);
  if (stopPort) {
    if (!(await waitForGatewayPortRelease(stopPort))) {
      await terminateBusyPortListeners(stopPort);
      if (!(await waitForGatewayPortRelease(stopPort, 2e3)))
        throw new Error(`gateway port ${stopPort} is still busy after stop`);
    }
  }
  stdout.write(`${formatLine("Stopped Scheduled Task", taskName)}\n`);
}
async function restartRegisteredScheduledTask(params) {
  const taskName = resolveTaskName(params.env);
  await execSchtasks(["/End", "/TN", taskName]);
  const manageGatewayPort = shouldManageGatewayListenerPort(params.env);
  const restartPort = manageGatewayPort ? await resolveScheduledTaskPort(params.env) : null;
  if (params.mode.kind === "standard") {
    if (manageGatewayPort) await terminateScheduledTaskGatewayListeners(params.env);
    else await terminateScheduledTaskNodeHost(params.env);
    await terminateInstalledStartupRuntime(params.env);
  } else {
    const replacementRuntime = await resolveFallbackRuntime(params.env, void 0, "control");
    if (replacementRuntime.status === "unknown")
      throw new Error(
        replacementRuntime.detail ??
          "Could not verify the replacement Windows Scheduled Task process.",
      );
    if (replacementRuntime.status === "running" && replacementRuntime.pid)
      await terminateGatewayProcessTree(replacementRuntime.pid, 300);
  }
  if (restartPort) {
    if (!(await waitForGatewayPortRelease(restartPort))) {
      if (params.mode.kind === "fallback-takeover")
        throw new Error(
          `replacement gateway port ${restartPort} is occupied by an unverified process`,
        );
      await terminateBusyPortListeners(restartPort);
      if (!(await waitForGatewayPortRelease(restartPort, 2e3)))
        throw new Error(`gateway port ${restartPort} is still busy before restart`);
    }
  }
  const activation = await runScheduledTaskOrThrow({
    taskName,
    env: params.env,
    scriptPath: resolveTaskScriptPath(params.env),
  });
  const startupEntryInstalled = await isStartupEntryInstalled(params.env);
  const hasRunningEvidence = startupEntryInstalled
    ? activation === "scheduled-task" && (await waitForScheduledTaskRunningEvidence(params.env))
    : await hasScheduledTaskRunningEvidence(params.env);
  if (
    params.mode.kind === "fallback-takeover" &&
    startupEntryInstalled &&
    activation === "scheduled-task" &&
    !hasRunningEvidence
  ) {
    await execSchtasks(["/End", "/TN", taskName]);
    const failedRuntime = await resolveFallbackRuntime(params.env, void 0, "control").catch(
      () => null,
    );
    if (failedRuntime?.status === "running" && failedRuntime.pid)
      await terminateGatewayProcessTree(failedRuntime.pid, 300);
    throw new Error("Replacement Windows Scheduled Task did not produce running evidence.");
  }
  if (startupEntryInstalled && hasRunningEvidence)
    await removeStartupEntries(params.env, params.stdout);
  params.stdout.write(`${formatLine("Restarted Scheduled Task", taskName)}\n`);
  return { outcome: "completed" };
}
async function restartScheduledTask({ stdout, env }) {
  const effectiveEnv = env ?? process.env;
  try {
    await assertSchtasksAvailable();
  } catch (err) {
    if (await isStartupEntryInstalled(effectiveEnv))
      return await restartStartupEntry(effectiveEnv, stdout);
    throw err;
  }
  if (!(await isRegisteredScheduledTask(effectiveEnv))) {
    if (await isStartupEntryInstalled(effectiveEnv))
      return await restartStartupEntry(effectiveEnv, stdout);
  }
  return await restartRegisteredScheduledTask({
    env: effectiveEnv,
    stdout,
    mode: { kind: "standard" },
  });
}
async function isScheduledTaskInstalled(args) {
  const effectiveEnv = args.env ?? process.env;
  if (await isRegisteredScheduledTask(effectiveEnv)) return true;
  return await isStartupEntryInstalled(effectiveEnv);
}
async function readScheduledTaskRuntime(env = process.env) {
  try {
    await assertSchtasksAvailable();
  } catch (err) {
    if (await isStartupEntryInstalled(env)) return await resolveFallbackRuntime(env);
    return {
      status: "unknown",
      detail: String(err),
    };
  }
  const res = await execSchtasks(["/Query", "/TN", resolveTaskName(env), "/V", "/FO", "LIST"]);
  if (res.code !== 0) {
    if (await isStartupEntryInstalled(env)) return await resolveFallbackRuntime(env);
    const detail = (res.stderr || res.stdout).trim();
    const missing = normalizeLowercaseStringOrEmpty(detail).includes("cannot find the file");
    return {
      status: missing ? "stopped" : "unknown",
      detail: detail || void 0,
      missingUnit: missing,
    };
  }
  const parsed = parseSchtasksQuery(res.stdout || "");
  const derived = deriveScheduledTaskRuntimeStatus(parsed);
  if (derived.status !== "running") {
    const observedRuntime = await resolveListenerBackedScheduledTaskRuntime(env);
    if (observedRuntime)
      return {
        ...observedRuntime,
        state: parsed.status,
        lastRunTime: parsed.lastRunTime,
        lastRunResult: parsed.lastRunResult,
      };
  }
  return {
    status: derived.status,
    state: parsed.status,
    lastRunTime: parsed.lastRunTime,
    lastRunResult: parsed.lastRunResult,
    ...(derived.detail ? { detail: derived.detail } : {}),
  };
}
//#endregion
export {
  readWindowsStartupFallbackRuntimeForUpdate as a,
  resumeScheduledTaskAutoStartAfterUpdate as c,
  suspendScheduledTaskAutoStartForUpdate as d,
  uninstallScheduledTask as f,
  readScheduledTaskRuntime as i,
  stageScheduledTask as l,
  isScheduledTaskInstalled as n,
  resolveTaskScriptPath as o,
  readScheduledTaskCommand as r,
  restartScheduledTask as s,
  installScheduledTask as t,
  stopScheduledTask as u,
};
