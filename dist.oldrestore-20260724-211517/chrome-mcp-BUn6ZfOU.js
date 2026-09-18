import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { setTimeout as setTimeout$1 } from "node:timers/promises";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { ErrorCode, McpError } from "@modelcontextprotocol/sdk/types.js";
import { t as createAsyncLock } from "./async-lock-CaiUOILd.js";
import "./number-runtime-B-n-wjMn.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./async-lock-runtime-CyldtJuZ.js";
import "./process-runtime-BKNTr1ic.js";
import {
  n as decodeBoundedUtf8Tail,
  t as createBoundedUtf8Tail,
} from "./bounded-utf8-tail-zGgVhmwV.js";
import { n as redactCdpUrl } from "./browser-config-BYZ1IWa3.js";
import "./tmp-openclaw-dir-BmzZqWyg.js";
import {
  C as BrowserProfileUnavailableError,
  E as BrowserTabNotFoundError,
  d as redactCdpErrorText,
} from "./cdp.helpers-ChuUODxP.js";
import "./record-shared-BNyRYPIG.js";
import { n as runExec } from "./exec-CXKmx4dL.js";
import {
  O as resolveNonNegativeIntegerOption,
  a as addTimerTimeoutGraceMs,
} from "./number-coercion-CJQ8TR--.js";
import { n as asNullableRecord } from "./record-coerce-DHZ4bFlT.js";
import { u as redactToolPayloadText } from "./redact-CUe6Oey5.js";
import { c as normalizeOptionalString, p as readStringValue } from "./string-coerce-DW4mBlAt.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-uPgNO8da.js";
//#region extensions/browser/src/browser/chrome-mcp.ts
/**
 * Chrome MCP existing-session adapter.
 *
 * Manages chrome-devtools-mcp processes and sessions, maps Browser actions to
 * MCP tools, and exposes tab/snapshot/action helpers for logged-in browsers.
 */
const log = createSubsystemLogger("browser").child("chrome-mcp");
var ChromeMcpDocumentUnavailableError = class extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = "ChromeMcpDocumentUnavailableError";
  }
};
function rethrowChromeMcpDocumentError(error) {
  const message = error instanceof Error ? error.message : String(error);
  if (
    /Element (?:with )?uid .* (?:not found|no longer exists) on (?:the )?page|Execution context was destroyed|Cannot find context with specified id|Frame (?:was |is )?detached|detached Frame|Node is detached from document/i.test(
      message,
    )
  )
    throw new ChromeMcpDocumentUnavailableError(message, { cause: error });
  throw error;
}
const MCP_REQUEST_TIMEOUT_CODE = ErrorCode.RequestTimeout;
const DEFAULT_CHROME_MCP_COMMAND = "npx";
const DEFAULT_CHROME_MCP_PACKAGE_ARGS = ["-y", "chrome-devtools-mcp@latest"];
const DEFAULT_CHROME_MCP_FEATURE_ARGS = [
  "--no-usage-statistics",
  "--experimentalStructuredContent",
  "--experimental-page-id-routing",
];
const CHROME_MCP_USAGE_STATISTICS_FLAG_RE = /^--(?:no-)?usage-?statistics(?:=.*)?$/i;
const CHROME_MCP_CONNECTION_FLAGS = /* @__PURE__ */ new Set([
  "--autoConnect",
  "--auto-connect",
  "--browserUrl",
  "--browser-url",
  "--wsEndpoint",
  "--ws-endpoint",
  "-w",
]);
const CHROME_MCP_USER_DATA_DIR_FLAGS = /* @__PURE__ */ new Set([
  "--userDataDir",
  "--user-data-dir",
]);
const CHROME_MCP_NEW_PAGE_TIMEOUT_MS = 5e3;
const CHROME_MCP_NAVIGATE_TIMEOUT_MS = 2e4;
const CHROME_MCP_HANDSHAKE_TIMEOUT_MS = 3e4;
const CHROME_MCP_STDERR_MAX_BYTES = 8 * 1024;
const CHROME_MCP_PROCESS_EXIT_GRACE_MS = 250;
const DEVTOOLS_ACTIVE_PORT_RE = /\bDevToolsActivePort\b/i;
const CHROME_CONNECTION_TOOL_ERROR_RE =
  /(?:Could not connect to Chrome|DevToolsActivePort|ECONNREFUSED|ECONNRESET|websocket|timed out)/i;
const STALE_SELECTED_PAGE_ERROR =
  "The selected page has been closed. Call list_pages to see open pages.";
const CHROME_MCP_SESSION_TARGET_PREFIX = "chrome-mcp:";
const CHROME_MCP_SNAPSHOT_REF_PREFIX = "mcp-ref:";
var ChromeMcpReconnectRequiredError = class extends Error {};
var ChromeMcpProcessSnapshotError = class extends Error {};
const sessions = /* @__PURE__ */ new Map();
const pendingSessions = /* @__PURE__ */ new Map();
const retainedCleanupSessions = /* @__PURE__ */ new Map();
const cleanupPromises = /* @__PURE__ */ new WeakMap();
let sessionFactory = null;
let chromeMcpProcessCleanupDepsForTest = null;
/** Decode a bounded UTF-8-safe stderr tail for Chrome MCP diagnostics. */
function decodeChromeMcpStderrTail(buffer) {
  return decodeBoundedUtf8Tail(buffer, CHROME_MCP_STDERR_MAX_BYTES).trim();
}
function asPages(value) {
  if (!Array.isArray(value)) return [];
  const out = [];
  for (const entry of value) {
    const record = asNullableRecord(entry);
    if (!record || typeof record.id !== "number") continue;
    out.push({
      id: record.id,
      url: readStringValue(record.url),
      selected: record.selected === true,
    });
  }
  return out;
}
function getChromeMcpRoutingState(session) {
  session.routing ??= {
    sessionNonce: randomUUID().replaceAll("-", "").slice(0, 12),
    withOperationLock: createAsyncLock(),
    targetIdByPageId: /* @__PURE__ */ new Map(),
    nextTargetHandleId: 1,
    snapshotRefById: /* @__PURE__ */ new Map(),
    nextSnapshotRefId: 1,
  };
  return session.routing;
}
async function withChromeMcpOperationLock(session, options, operation) {
  const signal = options.signal;
  if (signal?.aborted) throw signal.reason ?? /* @__PURE__ */ new Error("aborted");
  let started = false;
  let cancelled = false;
  let cancelReason;
  const queued = getChromeMcpRoutingState(session).withOperationLock(async () => {
    if (cancelled)
      throw (
        cancelReason ??
        /* @__PURE__ */ new Error("Chrome MCP operation cancelled before it started.")
      );
    started = true;
    if (signal?.aborted) throw signal.reason ?? /* @__PURE__ */ new Error("aborted");
    return await operation();
  });
  const timeoutMs = options.timeoutMs;
  if (!signal && !(timeoutMs !== void 0 && timeoutMs > 0)) return await queued;
  let timer;
  let abortListener;
  const cancelBeforeStart = new Promise((_resolve, reject) => {
    const cancel = (reason) => {
      if (started || cancelled) return;
      cancelled = true;
      cancelReason = toLintErrorObject(reason, "Chrome MCP operation cancelled");
      reject(cancelReason);
    };
    if (signal) {
      abortListener = () => cancel(signal.reason ?? /* @__PURE__ */ new Error("aborted"));
      signal.addEventListener("abort", abortListener, { once: true });
    }
    if (timeoutMs !== void 0 && timeoutMs > 0) {
      timer = setTimeout(
        () =>
          cancel(
            /* @__PURE__ */ new Error(
              `Chrome MCP operation timed out after ${timeoutMs}ms while waiting for another operation.`,
            ),
          ),
        timeoutMs,
      );
      timer.unref?.();
    }
  });
  try {
    return await Promise.race([queued, cancelBeforeStart]);
  } finally {
    if (timer) clearTimeout(timer);
    if (signal && abortListener) signal.removeEventListener("abort", abortListener);
    if (cancelled) queued.catch(() => {});
  }
}
function clearChromeMcpSnapshotRefsForTarget(routing, targetId) {
  for (const [refId, ref] of routing.snapshotRefById)
    if (ref.targetId === targetId) routing.snapshotRefById.delete(refId);
}
function updateChromeMcpTargetMappings(routing, targetIdByPageId) {
  for (const [pageId, targetId] of routing.targetIdByPageId)
    if (!targetIdByPageId.has(pageId)) clearChromeMcpSnapshotRefsForTarget(routing, targetId);
  routing.targetIdByPageId = targetIdByPageId;
}
function wrapChromeMcpSnapshotRefs(session, targetId, root) {
  const routing = getChromeMcpRoutingState(session);
  clearChromeMcpSnapshotRefsForTarget(routing, targetId);
  const wrappedByUid = /* @__PURE__ */ new Map();
  const visit = (node) => {
    const rawUid = normalizeOptionalString(node.id);
    let id;
    if (rawUid) {
      id = wrappedByUid.get(rawUid);
      if (!id) {
        id = `${CHROME_MCP_SNAPSHOT_REF_PREFIX}${routing.sessionNonce}:${routing.nextSnapshotRefId}`;
        routing.nextSnapshotRefId += 1;
        wrappedByUid.set(rawUid, id);
        routing.snapshotRefById.set(id, {
          targetId,
          uid: rawUid,
        });
      }
    }
    return {
      ...node,
      ...(id ? { id } : {}),
      ...(node.children ? { children: node.children.map(visit) } : {}),
    };
  };
  return visit(root);
}
function resolveChromeMcpSnapshotRef(session, targetId, refId) {
  const resolved = getChromeMcpRoutingState(session).snapshotRefById.get(refId);
  if (!resolved || resolved.targetId !== targetId)
    throw new Error(`Unknown ref "${refId}". Run a new snapshot and use a ref from that snapshot.`);
  return resolved.uid;
}
function extractStructuredContent(result) {
  return asNullableRecord(result.structuredContent) ?? {};
}
function extractTextContent(result) {
  return (Array.isArray(result.content) ? result.content : [])
    .map((entry) => {
      const record = asNullableRecord(entry);
      return record && typeof record.text === "string" ? record.text : "";
    })
    .filter(Boolean);
}
function extractTextPages(result) {
  const pages = [];
  for (const block of extractTextContent(result))
    for (const line of block.split(/\r?\n/)) {
      const match = line.match(/^\s*(\d+):\s+(.+?)(?:\s+\[(selected)\])?\s*$/i);
      if (!match) continue;
      pages.push({
        id: Number.parseInt(match[1] ?? "", 10),
        url: normalizeOptionalString(match[2]),
        selected: Boolean(match[3]),
      });
    }
  return pages;
}
function extractStructuredPages(result) {
  const structured = asPages(extractStructuredContent(result).pages);
  return structured.length > 0 ? structured : extractTextPages(result);
}
function extractSnapshot(result) {
  const snapshot = asNullableRecord(extractStructuredContent(result).snapshot);
  if (!snapshot)
    throw new Error("Chrome MCP snapshot response was missing structured snapshot data.");
  return snapshot;
}
function extractJsonBlock(text) {
  const raw = text.match(/```json\s*([\s\S]*?)\s*```/i)?.[1]?.trim() || text.trim();
  return raw ? JSON.parse(raw) : null;
}
function extractMessageText(result) {
  const message = extractStructuredContent(result).message;
  if (typeof message === "string" && message.trim()) return message;
  return extractTextContent(result).find((block) => block.trim()) ?? "";
}
function extractToolErrorMessage(result, name) {
  return extractMessageText(result).trim() || `Chrome MCP tool "${name}" failed.`;
}
function formatChromeMcpEndpointForDiagnostic(browserUrl) {
  return redactToolPayloadText(redactCdpUrl(browserUrl) ?? browserUrl);
}
function formatChromeMcpToolErrorMessage(params) {
  const detail = redactChromeMcpDiagnosticTextWithLocalPaths(params.message);
  const profileLabel = redactChromeMcpProfileLabelForDiagnostic(params.profileName);
  if (params.options.browserUrl && CHROME_CONNECTION_TOOL_ERROR_RE.test(params.message))
    return `Chrome MCP tool "${params.toolName}" failed for profile "${profileLabel}" while using the configured Chrome endpoint (${formatChromeMcpEndpointForDiagnostic(params.options.browserUrl)}). Details: ${detail}`;
  if (
    !params.options.browserUrl &&
    params.options.userDataDir &&
    DEVTOOLS_ACTIVE_PORT_RE.test(params.message)
  )
    return `${detail} If this browser was started with --remote-debugging-port, set ${path.isAbsolute(params.profileName) ? "this existing-session profile's cdpUrl" : `browser.profiles.${params.profileName}.cdpUrl`} to that DevTools endpoint instead of relying on Chrome MCP auto-connect.`;
  return detail;
}
function shouldReconnectForToolError(name, message) {
  return name === "list_pages" && message.includes(STALE_SELECTED_PAGE_ERROR);
}
function extractJsonMessage(result) {
  const candidates = [extractMessageText(result), ...extractTextContent(result)].filter((text) =>
    text.trim(),
  );
  let lastError;
  for (const candidate of candidates)
    try {
      return extractJsonBlock(candidate);
    } catch (err) {
      lastError = err;
    }
  if (lastError) throw toLintErrorObject(lastError, "Non-Error thrown");
  return null;
}
function normalizeChromeMcpUserDataDir(userDataDir) {
  const trimmed = userDataDir?.trim();
  return trimmed ? trimmed : void 0;
}
function normalizeChromeMcpStringList(values) {
  return Array.isArray(values)
    ? values.filter((value) => typeof value === "string" && value.trim().length > 0)
    : [];
}
function normalizeChromeMcpOptions(input) {
  if (typeof input === "object" && input && "command" in input && "extraArgs" in input)
    return input;
  const options = typeof input === "string" ? { userDataDir: input } : (input ?? {});
  return {
    command: normalizeOptionalString(options.mcpCommand) ?? DEFAULT_CHROME_MCP_COMMAND,
    userDataDir: normalizeChromeMcpUserDataDir(options.userDataDir),
    browserUrl: normalizeOptionalString(options.cdpUrl),
    extraArgs: normalizeChromeMcpStringList(options.mcpArgs),
  };
}
function hasFlag(args, flags) {
  return args.some((arg) => {
    const [name] = arg.split("=", 1);
    return flags.has(name ?? arg);
  });
}
function isChromeMcpWebSocketEndpoint(url) {
  return /^wss?:\/\//i.test(url);
}
function buildChromeMcpConnectionArgs(options) {
  if (hasFlag(options.extraArgs, CHROME_MCP_CONNECTION_FLAGS)) return [];
  if (options.browserUrl)
    return isChromeMcpWebSocketEndpoint(options.browserUrl)
      ? ["--wsEndpoint", options.browserUrl]
      : ["--browserUrl", options.browserUrl];
  return ["--autoConnect"];
}
function buildChromeMcpUserDataDirArgs(options) {
  if (
    !options.userDataDir ||
    options.browserUrl ||
    hasFlag(options.extraArgs, CHROME_MCP_CONNECTION_FLAGS) ||
    hasFlag(options.extraArgs, CHROME_MCP_USER_DATA_DIR_FLAGS)
  )
    return [];
  return ["--userDataDir", options.userDataDir];
}
function buildChromeMcpSessionCacheKey(profileName, options) {
  return JSON.stringify([
    profileName,
    options.userDataDir ?? "",
    options.browserUrl ?? "",
    options.command,
    options.extraArgs,
  ]);
}
function chromeMcpProfileOptionsFromParams(params) {
  return params.profile ?? params.userDataDir;
}
function cacheKeyMatchesProfileName(cacheKey, profileName) {
  try {
    const parsed = JSON.parse(cacheKey);
    return Array.isArray(parsed) && parsed[0] === profileName;
  } catch {
    return false;
  }
}
async function closeChromeMcpSessionsForProfile(profileName, keepKey) {
  let closed = false;
  let firstError;
  const keys = /* @__PURE__ */ new Set([
    ...pendingSessions.keys(),
    ...sessions.keys(),
    ...retainedCleanupSessions.keys(),
  ]);
  for (const key of keys) {
    if (key === keepKey || !cacheKeyMatchesProfileName(key, profileName)) continue;
    closed = true;
    const pending = pendingSessions.get(key);
    if (pending) {
      abortPendingChromeMcpSession(
        pending,
        /* @__PURE__ */ new Error("Chrome MCP profile session was replaced"),
      );
      try {
        await drainCancelledChromeMcpPendingSession(pending);
      } catch (err) {
        firstError ??= toLintErrorObject(err, "Chrome MCP pending-session cleanup failed.");
        continue;
      }
    }
    try {
      await drainRetainedChromeMcpCleanup(key);
    } catch (err) {
      firstError ??= toLintErrorObject(err, "Chrome MCP retained-session cleanup failed.");
      continue;
    }
    const session = sessions.get(key);
    if (session) {
      sessions.delete(key);
      try {
        await closeTrackedChromeMcpSession(key, session);
      } catch (err) {
        firstError ??= toLintErrorObject(err, "Chrome MCP session cleanup failed.");
      }
    }
  }
  if (firstError) throw firstError;
  return closed;
}
function buildChromeMcpArgsFromOptions(options) {
  const commandPrefix =
    options.command === DEFAULT_CHROME_MCP_COMMAND ? DEFAULT_CHROME_MCP_PACKAGE_ARGS : [];
  const defaultFeatureArgs = options.extraArgs.some((arg) =>
    CHROME_MCP_USAGE_STATISTICS_FLAG_RE.test(arg),
  )
    ? DEFAULT_CHROME_MCP_FEATURE_ARGS.filter((arg) => arg !== "--no-usage-statistics")
    : DEFAULT_CHROME_MCP_FEATURE_ARGS;
  return [
    ...commandPrefix,
    ...buildChromeMcpConnectionArgs(options),
    ...defaultFeatureArgs,
    ...buildChromeMcpUserDataDirArgs(options),
    ...options.extraArgs,
  ];
}
function drainStderr(transport) {
  const stream = transport.stderr;
  if (!stream) return () => "";
  const tail = createBoundedUtf8Tail(CHROME_MCP_STDERR_MAX_BYTES);
  stream.on("data", (chunk) => {
    tail.append(chunk);
  });
  stream.on("error", () => {});
  return () => tail.text().trim();
}
function redactChromeMcpDiagnosticText(text) {
  return redactCdpErrorText(text);
}
function redactChromeMcpDiagnosticTextWithLocalPaths(text) {
  const homeDir = normalizeOptionalString(os.homedir());
  const homePath = homeDir ? path.resolve(homeDir) : void 0;
  return redactChromeMcpDiagnosticText(homePath ? text.split(homePath).join("~") : text);
}
function redactChromeMcpLocalPathForDiagnostic(filePath) {
  const homeDir = normalizeOptionalString(os.homedir());
  if (!homeDir || !path.isAbsolute(filePath)) return redactChromeMcpDiagnosticText(filePath);
  const relative = path.relative(path.resolve(homeDir), path.resolve(filePath));
  if (relative === "") return "~";
  if (!relative.startsWith("..") && !path.isAbsolute(relative))
    return redactChromeMcpDiagnosticText(`~/${relative.split(path.sep).join("/")}`);
  return redactChromeMcpDiagnosticText(filePath);
}
function redactChromeMcpProfileLabelForDiagnostic(profileName) {
  return path.isAbsolute(profileName)
    ? redactChromeMcpLocalPathForDiagnostic(profileName)
    : redactChromeMcpDiagnosticText(profileName);
}
function readChromeMcpTransportPid(transport) {
  const pid = transport.pid;
  return typeof pid === "number" && Number.isInteger(pid) && pid > 0 && pid !== process.pid
    ? pid
    : void 0;
}
function parseChromeMcpLinuxStat(pid, stat) {
  const fields = stat.slice(stat.lastIndexOf(")") + 2).split(/\s+/);
  const ppid = Number.parseInt(fields[1] ?? "", 10);
  const startTime = normalizeOptionalString(fields[19]);
  return Number.isInteger(ppid) && startTime
    ? {
        pid,
        ppid,
        identity: `linux:${startTime}`,
      }
    : null;
}
async function listChromeMcpLinuxProcesses() {
  const pids = (await fs.readdir("/proc"))
    .filter((name) => /^\d+$/.test(name))
    .map((name) => Number.parseInt(name, 10));
  const rows = [];
  for (const pid of pids)
    try {
      const row = parseChromeMcpLinuxStat(pid, await fs.readFile(`/proc/${pid}/stat`, "utf8"));
      if (row) rows.push(row);
    } catch {}
  return rows;
}
function parseChromeMcpDelimitedProcessList(stdout, platform) {
  return stdout.split(/\r?\n/).flatMap((line) => {
    const [rawPid, rawPpid, rawStarted, ...rawCommand] = line.split("	");
    const pid = Number.parseInt(rawPid ?? "", 10);
    const ppid = Number.parseInt(rawPpid ?? "", 10);
    const started = normalizeOptionalString(rawStarted);
    const command = normalizeOptionalString(rawCommand.join("	"));
    return Number.isInteger(pid) && Number.isInteger(ppid) && started && command
      ? [
          {
            pid,
            ppid,
            identity: `${platform}:${started}|${command}`,
          },
        ]
      : [];
  });
}
/** Parse one C-locale Unix process table for focused process-identity tests. */
function parseChromeMcpUnixProcessListForTest(stdout, platform) {
  return parseChromeMcpDelimitedProcessList(
    stdout.replace(/^\s*(\d+)\s+(\d+)\s+(.{24})\s+(.+)$/gm, "$1	$2	$3	$4"),
    platform,
  );
}
async function listChromeMcpPlatformProcesses(deps) {
  try {
    if (deps?.listProcesses) return await deps.listProcesses();
    const platform = deps?.platform ?? process.platform;
    if (platform === "linux") return await listChromeMcpLinuxProcesses();
    const windows = platform === "win32";
    const { stdout } = await runExec(
      windows ? "powershell.exe" : "ps",
      windows
        ? [
            "-NoProfile",
            "-NonInteractive",
            "-Command",
            'Get-CimInstance Win32_Process | ForEach-Object { "{0}`t{1}`t{2:o}`t{3}" -f $_.ProcessId,$_.ParentProcessId,$_.CreationDate,$_.ExecutablePath }',
          ]
        : ["-axww", "-o", "pid=,ppid=,lstart=,command="],
      {
        env: windows
          ? void 0
          : {
              ...process.env,
              LC_ALL: "C",
              TZ: "UTC",
            },
        logOutput: false,
        maxBuffer: 4 * 1024 * 1024,
        timeoutMs: 2e3,
      },
    );
    if (windows) return parseChromeMcpDelimitedProcessList(stdout, platform);
    return parseChromeMcpUnixProcessListForTest(stdout, platform);
  } catch (err) {
    throw new ChromeMcpProcessSnapshotError(
      err instanceof Error ? err.message : "Unable to inspect the Chrome MCP process tree.",
      { cause: err },
    );
  }
}
function captureChromeMcpProcessTarget(rootPid, snapshots) {
  const root = new Map(snapshots.map((snapshot) => [snapshot.pid, snapshot])).get(rootPid);
  if (!root)
    throw new ChromeMcpProcessSnapshotError(
      `Chrome MCP process identity unavailable for pid ${rootPid}.`,
    );
  const childrenByParent = /* @__PURE__ */ new Map();
  for (const snapshot of snapshots) {
    const children = childrenByParent.get(snapshot.ppid) ?? [];
    children.push(snapshot);
    childrenByParent.set(snapshot.ppid, children);
  }
  const descendants = [];
  const queue = [...(childrenByParent.get(rootPid) ?? [])];
  while (queue.length > 0) {
    const next = queue.shift();
    if (!next || next.pid === process.pid || next.pid === rootPid) continue;
    descendants.push({
      pid: next.pid,
      identity: next.identity,
    });
    queue.push(...(childrenByParent.get(next.pid) ?? []));
  }
  return {
    root: {
      pid: root.pid,
      identity: root.identity,
    },
    descendants,
  };
}
function sameChromeMcpProcesses(targets, snapshots) {
  const currentByPid = new Map(snapshots.map((snapshot) => [snapshot.pid, snapshot.identity]));
  return targets.filter((target) => currentByPid.get(target.pid) === target.identity);
}
function cleanupTarget(state) {
  return state.status === "tracked" || state.status === "uncertain" ? state.target : void 0;
}
async function refreshChromeMcpCleanupProcess(session) {
  const state = session.processCleanup;
  if (!state || state.status === "closed") return;
  if (session.processCleanupRefresh) return await session.processCleanupRefresh;
  const refresh = (async () => {
    const existing = cleanupTarget(state);
    const rootPid = existing?.root.pid ?? readChromeMcpTransportPid(session.transport);
    if (!rootPid) {
      if (state.status === "uncertain")
        throw new Error("Chrome MCP subprocess tree cleanup could not be verified.");
      return;
    }
    const snapshots = await listChromeMcpPlatformProcesses(chromeMcpProcessCleanupDepsForTest);
    const currentRoot = snapshots.find((snapshot) => snapshot.pid === rootPid);
    if (existing && currentRoot?.identity !== existing.root.identity) {
      if (state.status === "uncertain")
        throw new Error("Chrome MCP subprocess tree cleanup could not be verified.");
      return;
    }
    const captured = captureChromeMcpProcessTarget(rootPid, snapshots);
    session.processCleanup = {
      status: "tracked",
      target: {
        root: existing?.root ?? captured.root,
        descendants: [
          ...new Map(
            [...(existing?.descendants ?? []), ...captured.descendants].map((owned) => [
              owned.pid,
              owned,
            ]),
          ).values(),
        ],
      },
    };
  })();
  session.processCleanupRefresh = refresh;
  try {
    await refresh;
  } finally {
    if (session.processCleanupRefresh === refresh) session.processCleanupRefresh = void 0;
  }
}
async function taskkillChromeMcpProcessTree(rootPid, deps) {
  if (deps?.taskkillProcessTree) {
    await deps.taskkillProcessTree(rootPid);
    return;
  }
  await runExec("taskkill", ["/pid", String(rootPid), "/t", "/f"], {
    logOutput: false,
    maxBuffer: 64 * 1024,
    timeoutMs: 2e3,
  });
}
async function currentChromeMcpProcesses(targets, deps) {
  return sameChromeMcpProcesses(targets, await listChromeMcpPlatformProcesses(deps));
}
async function terminateChromeMcpProcessTree(target) {
  if (!target) return;
  const deps = chromeMcpProcessCleanupDepsForTest;
  if ((deps?.platform ?? process.platform) === "win32") {
    let firstError;
    if ((await currentChromeMcpProcesses([target.root], deps)).length > 0)
      try {
        await taskkillChromeMcpProcessTree(target.root.pid, deps);
      } catch (err) {
        firstError ??= toLintErrorObject(err, "Chrome MCP process-tree cleanup failed.");
      }
    await (deps?.sleep ?? setTimeout$1)(CHROME_MCP_PROCESS_EXIT_GRACE_MS);
    for (const descendant of await currentChromeMcpProcesses(target.descendants, deps))
      try {
        await taskkillChromeMcpProcessTree(descendant.pid, deps);
      } catch (err) {
        firstError ??= toLintErrorObject(err, "Chrome MCP process-tree cleanup failed.");
      }
    await (deps?.sleep ?? setTimeout$1)(CHROME_MCP_PROCESS_EXIT_GRACE_MS);
    const surviving = await currentChromeMcpProcesses([target.root, ...target.descendants], deps);
    if (surviving.length > 0)
      throw (
        firstError ??
        /* @__PURE__ */ new Error(
          `Chrome MCP process cleanup failed for pid ${surviving.map(({ pid }) => pid).join(", ")}.`,
        )
      );
    return;
  }
  const killProcess = deps?.killProcess ?? ((pid, signal) => process.kill(pid, signal));
  const sleep = deps?.sleep ?? setTimeout$1;
  const targets = [...target.descendants.toReversed(), target.root];
  for (const owned of await currentChromeMcpProcesses(targets, deps))
    try {
      killProcess(owned.pid, "SIGTERM");
    } catch {}
  await sleep(CHROME_MCP_PROCESS_EXIT_GRACE_MS);
  for (const owned of await currentChromeMcpProcesses(targets, deps))
    try {
      killProcess(owned.pid, "SIGKILL");
    } catch {}
  await sleep(CHROME_MCP_PROCESS_EXIT_GRACE_MS);
  const surviving = await currentChromeMcpProcesses(targets, deps);
  if (surviving.length > 0)
    throw new Error(
      `Chrome MCP process cleanup failed for pid ${surviving.map(({ pid }) => pid).join(", ")}.`,
    );
}
async function closeChromeMcpSessionHandle(session) {
  let firstError;
  let cleanupUncertain = session.processCleanup?.status === "uncertain";
  const attempt = async (operation) => {
    try {
      await operation();
    } catch (err) {
      cleanupUncertain ||= err instanceof ChromeMcpProcessSnapshotError;
      firstError ??= toLintErrorObject(err, "Chrome MCP session cleanup failed.");
    }
  };
  await attempt(async () => await refreshChromeMcpCleanupProcess(session));
  const target = session.processCleanup ? cleanupTarget(session.processCleanup) : void 0;
  const terminateFirst =
    Boolean(target) &&
    (chromeMcpProcessCleanupDepsForTest?.platform ?? process.platform) === "win32";
  if (terminateFirst) await attempt(async () => await terminateChromeMcpProcessTree(target));
  await attempt(async () => await session.client.close());
  if (!terminateFirst) await attempt(async () => await terminateChromeMcpProcessTree(target));
  if (firstError) {
    if (cleanupUncertain)
      session.processCleanup = {
        status: "uncertain",
        ...(target ? { target } : {}),
      };
    throw firstError;
  }
  session.processCleanup = { status: "closed" };
}
async function closeTrackedChromeMcpSession(cacheKey, session) {
  if (session.processCleanup?.status === "closed") return;
  const existing = cleanupPromises.get(session);
  if (existing) return await existing;
  const retained = retainedCleanupSessions.get(cacheKey) ?? /* @__PURE__ */ new Set();
  retained.add(session);
  retainedCleanupSessions.set(cacheKey, retained);
  const cleanup = (async () => {
    try {
      await closeChromeMcpSessionHandle(session);
      retained.delete(session);
      if (retained.size === 0) retainedCleanupSessions.delete(cacheKey);
    } finally {
      cleanupPromises.delete(session);
    }
  })();
  cleanupPromises.set(session, cleanup);
  return await cleanup;
}
async function drainRetainedChromeMcpCleanup(cacheKey) {
  const failed = (
    await Promise.allSettled(
      [...(retainedCleanupSessions.get(cacheKey) ?? [])].map(
        async (session) => await closeTrackedChromeMcpSession(cacheKey, session),
      ),
    )
  ).find((result) => result.status === "rejected");
  if (failed) throw failed.reason;
}
async function drainChromeMcpCleanupForKey(cacheKey) {
  const pending = pendingSessions.get(cacheKey);
  if (pending?.state.cancelled) await drainCancelledChromeMcpPendingSession(pending);
  await drainRetainedChromeMcpCleanup(cacheKey);
}
function hasChromeMcpCleanupForKey(cacheKey) {
  return (
    pendingSessions.get(cacheKey)?.state.cancelled === true ||
    (retainedCleanupSessions.get(cacheKey)?.size ?? 0) > 0
  );
}
async function withChromeMcpHandshakeTimeout(task) {
  let timer;
  try {
    return await Promise.race([
      task,
      new Promise((_, reject) => {
        timer = setTimeout(() => {
          reject(/* @__PURE__ */ new Error("Chrome MCP handshake timed out"));
        }, CHROME_MCP_HANDSHAKE_TIMEOUT_MS);
        timer.unref?.();
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}
async function createRealSession(profileName, options = normalizeChromeMcpOptions()) {
  const transport = new StdioClientTransport({
    command: options.command,
    args: buildChromeMcpArgsFromOptions(options),
    stderr: "pipe",
  });
  const client = new Client(
    {
      name: "openclaw-browser",
      version: "0.0.0",
    },
    {},
  );
  let getStderr = () => "";
  const session = {
    client,
    transport,
    ready: Promise.resolve(),
    processCleanup: { status: "open" },
  };
  const requireSession = () => session;
  const ready = (async () => {
    try {
      await withChromeMcpHandshakeTimeout(
        (async () => {
          await client.connect(transport);
          await refreshChromeMcpCleanupProcess(requireSession());
          getStderr = drainStderr(transport);
          if (!(await client.listTools()).tools.some((tool) => tool.name === "list_pages"))
            throw new Error("Chrome MCP server did not expose the expected navigation tools.");
          await refreshChromeMcpCleanupProcess(requireSession());
        })(),
      );
    } catch (err) {
      const stderr = getStderr();
      if (stderr)
        log.warn(
          `Chrome MCP attach failed for profile "${redactChromeMcpProfileLabelForDiagnostic(profileName)}". Subprocess stderr:\n${redactChromeMcpDiagnosticTextWithLocalPaths(stderr)}`,
        );
      const targetLabel = options.browserUrl
        ? `the configured Chrome endpoint (${redactToolPayloadText(redactCdpUrl(options.browserUrl) ?? options.browserUrl)})`
        : options.userDataDir
          ? `the configured Chromium user data dir (${redactChromeMcpLocalPathForDiagnostic(options.userDataDir)})`
          : "Google Chrome's default profile";
      const detail = redactChromeMcpDiagnosticTextWithLocalPaths(
        err instanceof Error ? err.message : String(err),
      );
      throw new BrowserProfileUnavailableError(
        `Chrome MCP existing-session attach failed for profile "${redactChromeMcpProfileLabelForDiagnostic(profileName)}". Make sure ${targetLabel} is running locally with remote debugging enabled. Details: ${detail}`,
      );
    }
  })();
  ready.catch(() => {});
  session.ready = ready;
  return session;
}
async function waitForChromeMcpReady(session, profileName, timeoutMs, signal) {
  if (signal?.aborted) throw signal.reason ?? /* @__PURE__ */ new Error("aborted");
  if ((!timeoutMs || timeoutMs <= 0) && !signal) {
    await session.ready;
    return;
  }
  let timer;
  let abortListener;
  try {
    const racers = [session.ready];
    if (timeoutMs && timeoutMs > 0)
      racers.push(
        new Promise((_, reject) => {
          timer = setTimeout(() => {
            reject(
              new BrowserProfileUnavailableError(
                `Chrome MCP existing-session attach for profile "${redactChromeMcpProfileLabelForDiagnostic(profileName)}" timed out after ${timeoutMs}ms.`,
              ),
            );
          }, timeoutMs);
        }),
      );
    if (signal)
      racers.push(
        new Promise((_, reject) => {
          abortListener = () =>
            reject(
              toLintErrorObject(
                signal.reason ?? /* @__PURE__ */ new Error("aborted"),
                "Non-Error rejection",
              ),
            );
          signal.addEventListener("abort", abortListener, { once: true });
        }),
      );
    await Promise.race(racers);
  } finally {
    if (timer) clearTimeout(timer);
    if (signal && abortListener) signal.removeEventListener("abort", abortListener);
  }
}
async function waitForChromeMcpPendingSession(pending, signal) {
  if (signal?.aborted) throw signal.reason ?? /* @__PURE__ */ new Error("aborted");
  if (!signal) return await pending;
  let abortListener;
  try {
    return await Promise.race([
      pending,
      new Promise((_, reject) => {
        abortListener = () =>
          reject(
            toLintErrorObject(
              signal.reason ?? /* @__PURE__ */ new Error("aborted"),
              "Non-Error rejection",
            ),
          );
        signal.addEventListener("abort", abortListener, { once: true });
      }),
    ]);
  } finally {
    if (abortListener) signal.removeEventListener("abort", abortListener);
  }
}
function createChromeMcpSession(cacheKey, profileName, options, signal) {
  const created = (sessionFactory ?? createRealSession)(profileName, options);
  let adopted = false;
  let closePromise;
  const closeCreated = async (session) => {
    closePromise ??= closeTrackedChromeMcpSession(cacheKey, session);
    await closePromise;
  };
  const promise = (async () => {
    const session = await waitForChromeMcpPendingSession(created, signal);
    if (signal?.aborted) {
      await closeCreated(session);
      throw signal.reason ?? /* @__PURE__ */ new Error("aborted");
    }
    adopted = true;
    return session;
  })();
  const cleanup = (async () => {
    await promise.catch(() => {});
    if (adopted) return;
    const session = await created.catch(() => null);
    if (session) await closeCreated(session);
  })();
  cleanup.catch(() => {});
  return {
    promise,
    cleanup,
  };
}
function abortPendingChromeMcpSession(
  pending,
  reason = /* @__PURE__ */ new Error("Chrome MCP session attach no longer has active waiters"),
) {
  pending.state.cancelled = true;
  if (!pending.state.settled && !pending.abortController.signal.aborted)
    pending.abortController.abort(reason);
}
function forgetCancelledChromeMcpPendingSession(pending) {
  if (pendingSessions.get(pending.cacheKey) === pending) pendingSessions.delete(pending.cacheKey);
}
async function drainCancelledChromeMcpPendingSession(pending) {
  const cleanupWasSettled = pending.state.cleanupSettled;
  try {
    await pending.cleanup;
  } catch (err) {
    if (!cleanupWasSettled) throw err;
    await drainRetainedChromeMcpCleanup(pending.cacheKey);
  }
  forgetCancelledChromeMcpPendingSession(pending);
}
function forgetCachedChromeMcpSessionIfCurrent(cacheKey, session) {
  if (sessions.get(cacheKey)?.transport !== session.transport) return false;
  sessions.delete(cacheKey);
  return true;
}
function forgetPendingChromeMcpSessionIfCurrent(cacheKey, pending) {
  if (pendingSessions.get(cacheKey) !== pending) return false;
  pendingSessions.delete(cacheKey);
  return true;
}
function createSharedPendingChromeMcpSession(cacheKey, profileName, options) {
  const id = Symbol(cacheKey);
  const abortController = new AbortController();
  const state = {
    waiters: 0,
    settled: false,
    cancelled: false,
    cleanupSettled: false,
  };
  const creation = createChromeMcpSession(cacheKey, profileName, options, abortController.signal);
  const promise = (async () => {
    try {
      const created = await creation.promise;
      state.session = created;
      if (pendingSessions.get(cacheKey)?.id === id) sessions.set(cacheKey, created);
      else await closeTrackedChromeMcpSession(cacheKey, created);
      return created;
    } finally {
      state.settled = true;
      if (!state.cancelled && state.waiters === 0 && pendingSessions.get(cacheKey)?.id === id)
        pendingSessions.delete(cacheKey);
    }
  })();
  const cleanup = creation.cleanup.finally(() => {
    state.cleanupSettled = true;
  });
  const pending = {
    cacheKey,
    id,
    promise,
    cleanup,
    abortController,
    state,
  };
  promise.catch(() => {});
  cleanup.catch(() => {});
  return pending;
}
async function waitForSharedPendingChromeMcpSession(pending, signal) {
  pending.state.waiters += 1;
  let released = false;
  let leasedSession;
  const release = async (closeIfLastWaiter) => {
    if (released) return false;
    released = true;
    pending.state.waiters = Math.max(0, pending.state.waiters - 1);
    if (pending.state.waiters !== 0) return false;
    if (!pending.state.settled) {
      abortPendingChromeMcpSession(pending, signal?.reason);
      await drainCancelledChromeMcpPendingSession(pending);
    } else if (closeIfLastWaiter) {
      const session = leasedSession ?? pending.state.session;
      if (session) {
        abortPendingChromeMcpSession(pending, signal?.reason);
        forgetCachedChromeMcpSessionIfCurrent(pending.cacheKey, session);
        await closeTrackedChromeMcpSession(pending.cacheKey, session);
      }
      forgetCancelledChromeMcpPendingSession(pending);
    } else forgetPendingChromeMcpSessionIfCurrent(pending.cacheKey, pending);
    return true;
  };
  let abortRelease;
  const releaseOnAbort = () => {
    abortRelease ??= release(true);
    abortRelease.catch(() => {});
  };
  signal?.addEventListener("abort", releaseOnAbort, { once: true });
  if (signal?.aborted) releaseOnAbort();
  try {
    leasedSession = await waitForChromeMcpPendingSession(pending.promise, signal);
    return {
      session: leasedSession,
      release,
    };
  } catch (err) {
    await (abortRelease ?? release(signal?.aborted === true));
    throw err;
  } finally {
    signal?.removeEventListener("abort", releaseOnAbort);
  }
}
async function getSession(profileName, profileOptions, timeoutMs, signal) {
  const options = normalizeChromeMcpOptions(profileOptions);
  const cacheKey = buildChromeMcpSessionCacheKey(profileName, options);
  signal?.throwIfAborted();
  await closeChromeMcpSessionsForProfile(profileName, cacheKey);
  if (hasChromeMcpCleanupForKey(cacheKey)) await drainChromeMcpCleanupForKey(cacheKey);
  if (signal?.aborted) throw signal.reason ?? /* @__PURE__ */ new Error("aborted");
  let staleReadySessionRetries = 0;
  for (;;) {
    let session = sessions.get(cacheKey);
    if (session && session.transport.pid === null) {
      sessions.delete(cacheKey);
      await closeTrackedChromeMcpSession(cacheKey, session);
      session = void 0;
    }
    let pendingLease;
    let leasedPending;
    const pending = pendingSessions.get(cacheKey);
    if (pending?.state.cancelled) {
      await drainCancelledChromeMcpPendingSession(pending);
      continue;
    }
    if (pending) {
      leasedPending = pending;
      pendingLease = await waitForSharedPendingChromeMcpSession(pending, signal);
      session = pendingLease.session;
    }
    if (!session) {
      const createdPending = createSharedPendingChromeMcpSession(cacheKey, profileName, options);
      pendingSessions.set(cacheKey, createdPending);
      leasedPending = createdPending;
      pendingLease = await waitForSharedPendingChromeMcpSession(createdPending, signal);
      session = pendingLease.session;
    }
    try {
      await waitForChromeMcpReady(session, profileName, timeoutMs, signal);
      if (session.transport.pid === null) {
        forgetCachedChromeMcpSessionIfCurrent(cacheKey, session);
        if (leasedPending) forgetPendingChromeMcpSessionIfCurrent(cacheKey, leasedPending);
        if (pendingLease) {
          await pendingLease.release(true);
          pendingLease = void 0;
        }
        staleReadySessionRetries += 1;
        if (staleReadySessionRetries > 1)
          throw new BrowserProfileUnavailableError(
            `Chrome MCP existing-session attach failed for profile "${redactChromeMcpProfileLabelForDiagnostic(profileName)}". The Chrome MCP subprocess exited before it became usable.`,
          );
        continue;
      }
      return session;
    } catch (err) {
      if (signal?.aborted && pendingLease) {
        await pendingLease.release(true);
        pendingLease = void 0;
      } else if (pendingLease && leasedPending && leasedPending.state.waiters > 1) {
        await pendingLease.release(false);
        pendingLease = void 0;
      } else {
        forgetCachedChromeMcpSessionIfCurrent(cacheKey, session);
        if (leasedPending) forgetPendingChromeMcpSessionIfCurrent(cacheKey, leasedPending);
        if (pendingLease) {
          await pendingLease.release(true);
          pendingLease = void 0;
        } else await closeTrackedChromeMcpSession(cacheKey, session);
      }
      throw err;
    } finally {
      await pendingLease?.release(false);
    }
  }
}
async function getExistingSession(cacheKey, profileName, timeoutMs, signal, includePending = true) {
  if (!includePending && pendingSessions.has(cacheKey)) return null;
  let session = sessions.get(cacheKey);
  if (session && session.transport.pid === null) {
    sessions.delete(cacheKey);
    await closeTrackedChromeMcpSession(cacheKey, session);
    session = void 0;
  }
  const pending = pendingSessions.get(cacheKey);
  if (includePending && pending) {
    const pendingLease = await waitForSharedPendingChromeMcpSession(pending, signal);
    let pendingLeaseReleased = false;
    session = pendingLease.session;
    try {
      await waitForChromeMcpReady(session, profileName, timeoutMs, signal);
      if (session.transport.pid === null) {
        forgetCachedChromeMcpSessionIfCurrent(cacheKey, session);
        forgetPendingChromeMcpSessionIfCurrent(cacheKey, pending);
        await pendingLease.release(true);
        pendingLeaseReleased = true;
        return null;
      }
      return session;
    } catch (err) {
      if (signal?.aborted) {
        await pendingLease.release(true);
        pendingLeaseReleased = true;
      } else if (pending.state.waiters > 1) {
        await pendingLease.release(false);
        pendingLeaseReleased = true;
      } else {
        forgetCachedChromeMcpSessionIfCurrent(cacheKey, session);
        forgetPendingChromeMcpSessionIfCurrent(cacheKey, pending);
        await pendingLease.release(true);
        pendingLeaseReleased = true;
      }
      throw err;
    } finally {
      if (!pendingLeaseReleased) await pendingLease.release(false);
    }
  }
  if (session)
    try {
      await waitForChromeMcpReady(session, profileName, timeoutMs, signal);
      return session;
    } catch (err) {
      if (signal?.aborted) throw err;
      if (forgetCachedChromeMcpSessionIfCurrent(cacheKey, session))
        await closeTrackedChromeMcpSession(cacheKey, session);
      throw err;
    }
  return null;
}
async function createEphemeralSession(profileName, profileOptions, timeoutMs, signal) {
  signal?.throwIfAborted();
  const options = normalizeChromeMcpOptions(profileOptions);
  const cacheKey = buildChromeMcpSessionCacheKey(profileName, options);
  const creation = createChromeMcpSession(cacheKey, profileName, options, signal);
  let session;
  try {
    session = await creation.promise;
    await waitForChromeMcpReady(session, profileName, timeoutMs, signal);
    return session;
  } catch (err) {
    await creation.cleanup;
    if (session) await closeTrackedChromeMcpSession(cacheKey, session);
    throw err;
  }
}
async function leaseSession(profileName, profileOptions, options = {}) {
  options.signal?.throwIfAborted();
  const normalizedProfileOptions = normalizeChromeMcpOptions(profileOptions);
  const cacheKey = buildChromeMcpSessionCacheKey(profileName, normalizedProfileOptions);
  if (!options.ephemeral)
    return {
      session: await getSession(
        profileName,
        normalizedProfileOptions,
        options.timeoutMs,
        options.signal,
      ),
      cacheKey,
      temporary: false,
    };
  if (hasChromeMcpCleanupForKey(cacheKey)) await drainChromeMcpCleanupForKey(cacheKey);
  options.signal?.throwIfAborted();
  const existingSession = await getExistingSession(
    cacheKey,
    profileName,
    options.timeoutMs,
    options.signal,
    false,
  );
  if (existingSession)
    return {
      session: existingSession,
      cacheKey,
      temporary: false,
    };
  return {
    session: await createEphemeralSession(
      profileName,
      normalizedProfileOptions,
      options.timeoutMs,
      options.signal,
    ),
    cacheKey,
    temporary: true,
  };
}
async function callTool(profileName, profileOptions, name, args, options, lease) {
  const timeoutMs = options.timeoutMs;
  const signal = options.signal;
  if (signal?.aborted) throw signal.reason ?? /* @__PURE__ */ new Error("aborted");
  const request = {
    name,
    arguments: args,
  };
  const rawCall =
    (timeoutMs !== void 0 && timeoutMs > 0) || signal
      ? lease.session.client.callTool(request, void 0, {
          ...(timeoutMs !== void 0 && timeoutMs > 0 ? { timeout: timeoutMs } : {}),
          ...(signal ? { signal } : {}),
        })
      : lease.session.client.callTool(request);
  let result;
  try {
    result = await rawCall;
  } catch (err) {
    if (!lease.temporary) {
      if (sessions.get(lease.cacheKey)?.transport === lease.session.transport) {
        sessions.delete(lease.cacheKey);
        await closeTrackedChromeMcpSession(lease.cacheKey, lease.session);
      }
    }
    if (signal?.aborted) throw toLintErrorObject(signal.reason ?? err, "Non-Error abort reason");
    if (timeoutMs && err instanceof McpError && err.code === MCP_REQUEST_TIMEOUT_CODE)
      throw new Error(
        `Chrome MCP "${name}" timed out after ${timeoutMs}ms. Session reset for reconnect.`,
        { cause: err },
      );
    throw err;
  }
  if (result.isError) {
    const message = extractToolErrorMessage(result, name);
    if (shouldReconnectForToolError(name, message)) {
      if (!lease.temporary) {
        if (sessions.get(lease.cacheKey)?.transport === lease.session.transport) {
          sessions.delete(lease.cacheKey);
          await closeTrackedChromeMcpSession(lease.cacheKey, lease.session);
        }
      }
      throw new ChromeMcpReconnectRequiredError(message);
    }
    throw new Error(
      formatChromeMcpToolErrorMessage({
        profileName,
        options: profileOptions,
        toolName: name,
        message,
      }),
    );
  }
  return result;
}
async function callTargetTool(params, name, args) {
  return await withChromeMcpTarget(params, async (target) => {
    const resolvedArgs = typeof args === "function" ? args(target.lease.session) : args;
    return await callTool(
      params.profileName,
      target.profileOptions,
      name,
      {
        ...resolvedArgs,
        pageId: target.pageId,
      },
      params,
      target.lease,
    );
  });
}
async function withChromeMcpLease(profileName, profileOptions, options, operation) {
  const normalizedProfileOptions = normalizeChromeMcpOptions(profileOptions);
  const lease = await leaseSession(profileName, normalizedProfileOptions, options);
  try {
    return await withChromeMcpOperationLock(lease.session, options, async () => {
      if (!lease.temporary) {
        if (
          sessions.get(lease.cacheKey)?.transport !== lease.session.transport ||
          lease.session.transport.pid === null
        ) {
          forgetCachedChromeMcpSessionIfCurrent(lease.cacheKey, lease.session);
          throw new BrowserProfileUnavailableError(
            `Chrome MCP session for profile "${redactChromeMcpProfileLabelForDiagnostic(profileName)}" changed before the operation could start. Run the browser command again to reconnect.`,
          );
        }
      }
      return await operation(lease, normalizedProfileOptions);
    });
  } finally {
    if (lease.temporary) await closeTrackedChromeMcpSession(lease.cacheKey, lease.session);
  }
}
async function listChromeMcpTargetsWithLease(params) {
  const result = await callTool(
    params.profileName,
    params.profileOptions,
    "list_pages",
    {},
    params.options,
    params.lease,
  );
  return registerChromeMcpTargets(params.lease.session, extractStructuredPages(result));
}
function registerChromeMcpTargets(session, pages, options = {}) {
  const routing = getChromeMcpRoutingState(session);
  const targetIdByPageId =
    options.authoritative === false ? new Map(routing.targetIdByPageId) : /* @__PURE__ */ new Map();
  const returnedPageIds = /* @__PURE__ */ new Set();
  const targets = [];
  for (const page of pages) {
    if (returnedPageIds.has(page.id))
      throw new Error(`Chrome MCP returned duplicate numeric page id ${page.id}.`);
    returnedPageIds.add(page.id);
    let targetId = routing.targetIdByPageId.get(page.id);
    if (!targetId) {
      targetId = `${CHROME_MCP_SESSION_TARGET_PREFIX}${routing.sessionNonce}:${routing.nextTargetHandleId}`;
      routing.nextTargetHandleId += 1;
    }
    targetIdByPageId.set(page.id, targetId);
    targets.push({
      page,
      targetId,
    });
  }
  updateChromeMcpTargetMappings(routing, targetIdByPageId);
  return targets;
}
async function withChromeMcpTarget(params, operation) {
  const profileOptions = chromeMcpProfileOptionsFromParams(params);
  return await withChromeMcpLease(
    params.profileName,
    profileOptions,
    params,
    async (lease, normalizedProfileOptions) => {
      const pageId = [...getChromeMcpRoutingState(lease.session).targetIdByPageId].find(
        ([, targetId]) => targetId === params.targetId,
      )?.[0];
      if (pageId === void 0) throw new BrowserTabNotFoundError({ input: params.targetId });
      return await operation({
        lease,
        profileOptions: normalizedProfileOptions,
        pageId,
      });
    },
  );
}
async function withTempFile(fn) {
  const dir = await fs.mkdtemp(path.join(resolvePreferredOpenClawTmpDir(), "openclaw-chrome-mcp-"));
  const filePath = path.join(dir, randomUUID());
  try {
    return await fn(filePath);
  } finally {
    await fs
      .rm(dir, {
        recursive: true,
        force: true,
      })
      .catch(() => {});
  }
}
/** Ensure a Chrome MCP session can be started for the profile. */
async function ensureChromeMcpAvailable(profileName, profileOptions, options = {}) {
  await withChromeMcpLease(profileName, profileOptions, options, async () => {});
}
/** Return the cached Chrome MCP process pid for a profile, when present. */
function getChromeMcpPid(profileName) {
  for (const [key, session] of sessions.entries())
    if (cacheKeyMatchesProfileName(key, profileName)) return session.transport.pid ?? null;
  for (const [key, retained] of retainedCleanupSessions)
    if (cacheKeyMatchesProfileName(key, profileName)) {
      const session = retained.values().next().value;
      return (
        (session?.processCleanup ? cleanupTarget(session.processCleanup) : void 0)?.root.pid ??
        session?.transport.pid ??
        null
      );
    }
  return null;
}
/** Close cached Chrome MCP sessions for one profile. */
async function closeChromeMcpSession(profileName) {
  return await closeChromeMcpSessionsForProfile(profileName);
}
/** Close every cached Chrome MCP session. */
async function stopAllChromeMcpSessions() {
  const names = uniqueStrings(
    [...pendingSessions.keys(), ...sessions.keys(), ...retainedCleanupSessions.keys()].map(
      (key) => JSON.parse(key)[0],
    ),
  );
  let firstError;
  for (const name of names)
    try {
      await closeChromeMcpSession(name);
    } catch (err) {
      firstError ??= toLintErrorObject(err, "Chrome MCP shutdown failed.");
    }
  if (firstError) throw firstError;
}
async function readChromeMcpTabs(profileName, profileOptions, options = {}) {
  for (let attempt = 0; attempt < 2; attempt += 1)
    try {
      return await withChromeMcpLease(
        profileName,
        profileOptions,
        options,
        async (lease, normalizedProfileOptions) =>
          (
            await listChromeMcpTargetsWithLease({
              profileName,
              profileOptions: normalizedProfileOptions,
              lease,
              options,
            })
          ).map(({ page, targetId }) => ({
            targetId,
            title: "",
            url: page.url ?? "",
            type: "page",
          })),
      );
    } catch (err) {
      if (err instanceof ChromeMcpReconnectRequiredError && attempt === 0) continue;
      throw err;
    }
  return [];
}
/** List Chrome MCP pages converted to persistent BrowserTab handles. */
async function listChromeMcpTabs(profileName, profileOptions, options = {}) {
  return await readChromeMcpTabs(profileName, profileOptions, {
    timeoutMs: options.timeoutMs,
    signal: options.signal,
  });
}
/** Count Chrome MCP pages without returning handles from an ephemeral session. */
async function countChromeMcpTabs(profileName, profileOptions, options = {}) {
  return (await readChromeMcpTabs(profileName, profileOptions, options)).length;
}
/** Open a new Chrome MCP tab and navigate it to the requested URL. */
async function openChromeMcpTab(profileName, url, profileOptions, options = {}) {
  const targetUrl = url.trim() || "about:blank";
  return await withChromeMcpLease(
    profileName,
    profileOptions,
    options,
    async (lease, normalizedProfileOptions) => {
      const result = await callTool(
        profileName,
        normalizedProfileOptions,
        "new_page",
        {
          url: "about:blank",
          timeout: CHROME_MCP_NEW_PAGE_TIMEOUT_MS,
        },
        options,
        lease,
      );
      const createdPages = registerChromeMcpTargets(lease.session, extractStructuredPages(result), {
        authoritative: false,
      });
      const created = createdPages.find(({ page }) => page.selected) ?? createdPages.at(-1);
      if (!created) throw new Error("Chrome MCP did not return the created page.");
      if (targetUrl === "about:blank")
        return {
          targetId: created.targetId,
          title: "",
          url: created.page.url ?? targetUrl,
          type: "page",
        };
      const navigateCallTimeoutMs = resolveChromeMcpNavigateCallTimeoutMs(
        CHROME_MCP_NAVIGATE_TIMEOUT_MS,
      );
      await callTool(
        profileName,
        normalizedProfileOptions,
        "navigate_page",
        {
          pageId: created.page.id,
          type: "url",
          url: targetUrl,
          timeout: CHROME_MCP_NAVIGATE_TIMEOUT_MS,
        },
        {
          timeoutMs: navigateCallTimeoutMs,
          signal: options.signal,
        },
        lease,
      );
      const finalPage = (
        await listChromeMcpTargetsWithLease({
          profileName,
          profileOptions: normalizedProfileOptions,
          lease,
          options: {
            timeoutMs: navigateCallTimeoutMs,
            signal: options.signal,
          },
        })
      ).find((entry) => entry.targetId === created.targetId);
      if (!finalPage)
        throw new Error("Chrome MCP created page identity changed before navigation completed.");
      return {
        targetId: created.targetId,
        title: "",
        url: finalPage.page.url ?? targetUrl,
        type: "page",
      };
    },
  );
}
/** Bring a Chrome MCP page to the foreground. */
async function focusChromeMcpTab(profileName, targetId, profileOptions, options = {}) {
  await callTargetTool(
    {
      profileName,
      profile: typeof profileOptions === "string" ? void 0 : profileOptions,
      userDataDir: typeof profileOptions === "string" ? profileOptions : void 0,
      targetId,
      ...options,
    },
    "select_page",
    { bringToFront: true },
  );
}
/** Close a Chrome MCP page by target id. */
async function closeChromeMcpTab(profileName, targetId, profileOptions, options = {}) {
  await withChromeMcpTarget(
    {
      profileName,
      profile: typeof profileOptions === "string" ? void 0 : profileOptions,
      userDataDir: typeof profileOptions === "string" ? profileOptions : void 0,
      targetId,
      ...options,
    },
    async (target) => {
      await callTool(
        profileName,
        target.profileOptions,
        "close_page",
        { pageId: target.pageId },
        options,
        target.lease,
      );
      const routing = getChromeMcpRoutingState(target.lease.session);
      routing.targetIdByPageId.delete(target.pageId);
      clearChromeMcpSnapshotRefsForTarget(routing, targetId);
    },
  );
}
/** Navigate a Chrome MCP page and return its resolved URL. */
async function navigateChromeMcpPage(params) {
  const resolvedTimeoutMs = params.timeoutMs ?? CHROME_MCP_NAVIGATE_TIMEOUT_MS;
  const callTimeoutMs = resolveChromeMcpNavigateCallTimeoutMs(resolvedTimeoutMs);
  return await withChromeMcpTarget(
    {
      ...params,
      timeoutMs: callTimeoutMs,
    },
    async (target) => {
      await callTool(
        params.profileName,
        target.profileOptions,
        "navigate_page",
        {
          pageId: target.pageId,
          type: "url",
          url: params.url,
          timeout: resolvedTimeoutMs,
        },
        {
          timeoutMs: callTimeoutMs,
          signal: params.signal,
        },
        target.lease,
      );
      const page = (
        await listChromeMcpTargetsWithLease({
          profileName: params.profileName,
          profileOptions: target.profileOptions,
          lease: target.lease,
          options: {
            timeoutMs: callTimeoutMs,
            signal: params.signal,
          },
        })
      ).find((entry) => entry.targetId === params.targetId)?.page;
      if (!page)
        throw new Error(
          "Chrome MCP tab identity changed while navigation was running; the navigation outcome is unknown.",
        );
      return { url: page.url ?? params.url };
    },
  );
}
/** Add call-level grace around the MCP navigate timeout. */
function resolveChromeMcpNavigateCallTimeoutMs(timeoutMs) {
  return addTimerTimeoutGraceMs(timeoutMs) ?? 1;
}
/** Take a structured Chrome MCP snapshot for one page. */
async function takeChromeMcpSnapshot(params) {
  return await withChromeMcpTarget(params, async (target) => {
    const result = await callTool(
      params.profileName,
      target.profileOptions,
      "take_snapshot",
      { pageId: target.pageId },
      params,
      target.lease,
    );
    return wrapChromeMcpSnapshotRefs(
      target.lease.session,
      params.targetId,
      extractSnapshot(result),
    );
  });
}
/** Run document-bound evaluations without releasing the target/session lock. */
async function withChromeMcpDocument(params, task) {
  return await withChromeMcpTarget(params, async (target) => {
    let snapshot;
    try {
      snapshot = extractSnapshot(
        await callTool(
          params.profileName,
          target.profileOptions,
          "take_snapshot",
          {
            pageId: target.pageId,
            verbose: true,
          },
          params,
          target.lease,
        ),
      );
    } catch (error) {
      rethrowChromeMcpDocumentError(error);
    }
    const uid = normalizeOptionalString(snapshot.id);
    if (!uid || snapshot.role?.trim().toLowerCase() !== "rootwebarea")
      throw new Error("Chrome MCP snapshot did not contain a top-level document uid");
    return await task({
      evaluate: async (fn) => {
        try {
          return extractJsonMessage(
            await callTool(
              params.profileName,
              target.profileOptions,
              "evaluate_script",
              {
                pageId: target.pageId,
                function: fn,
                args: [uid],
              },
              params,
              target.lease,
            ),
          );
        } catch (error) {
          return rethrowChromeMcpDocumentError(error);
        }
      },
    });
  });
}
/** Take a screenshot via Chrome MCP and return the image bytes. */
async function takeChromeMcpScreenshot(params) {
  return await withTempFile(async (filePath) => {
    const format = params.format ?? "png";
    await callTargetTool(params, "take_screenshot", (session) => ({
      filePath,
      format,
      ...(params.uid
        ? { uid: resolveChromeMcpSnapshotRef(session, params.targetId, params.uid) }
        : {}),
      ...(params.fullPage ? { fullPage: true } : {}),
    }));
    return await fs.readFile(`${filePath}.${format}`);
  });
}
/** Click a Chrome MCP snapshot element by uid. */
async function clickChromeMcpElement(params) {
  await callTargetTool(params, "click", (session) => ({
    uid: resolveChromeMcpSnapshotRef(session, params.targetId, params.uid),
    ...(params.doubleClick ? { dblClick: true } : {}),
  }));
}
/** Dispatch mouse events at page coordinates through an in-page script. */
async function clickChromeMcpCoords(params) {
  const button = params.button ?? "left";
  const buttonCode = button === "middle" ? 1 : button === "right" ? 2 : 0;
  const pressedButtons = button === "middle" ? 4 : button === "right" ? 2 : 1;
  const x = JSON.stringify(params.x);
  const y = JSON.stringify(params.y);
  const delayMs = JSON.stringify(resolveNonNegativeIntegerOption(params.delayMs, 0));
  const doubleClick = params.doubleClick ? "true" : "false";
  await evaluateChromeMcpScript({
    ...params,
    fn: `async () => {
      const x = ${x};
      const y = ${y};
      const delayMs = ${delayMs};
      const doubleClick = ${doubleClick};
      const target = document.elementFromPoint(x, y) ?? document.body ?? document.documentElement ?? document;
      const base = {
        bubbles: true,
        cancelable: true,
        view: window,
        clientX: x,
        clientY: y,
        screenX: window.screenX + x,
        screenY: window.screenY + y,
        button: ${buttonCode},
      };
      const pressedButtons = ${pressedButtons};
      const dispatch = (type, buttons, detail) => {
        target.dispatchEvent(new MouseEvent(type, { ...base, buttons, detail }));
      };
      dispatch("mousemove", 0, 0);
      dispatch("mousedown", pressedButtons, 1);
      if (delayMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
      dispatch("mouseup", 0, 1);
      dispatch("click", 0, 1);
      if (doubleClick) {
        dispatch("mousedown", pressedButtons, 2);
        dispatch("mouseup", 0, 2);
        dispatch("click", 0, 2);
        dispatch("dblclick", 0, 2);
      }
      return true;
    }`,
  });
}
/** Fill one Chrome MCP element by uid. */
async function fillChromeMcpElement(params) {
  await callTargetTool(params, "fill", (session) => ({
    uid: resolveChromeMcpSnapshotRef(session, params.targetId, params.uid),
    value: params.value,
  }));
}
/** Fill multiple Chrome MCP form elements in one tool call. */
async function fillChromeMcpForm(params) {
  await callTargetTool(params, "fill_form", (session) => ({
    elements: params.elements.map((element) => ({
      ...element,
      uid: resolveChromeMcpSnapshotRef(session, params.targetId, element.uid),
    })),
  }));
}
/** Hover a Chrome MCP snapshot element by uid. */
async function hoverChromeMcpElement(params) {
  await callTargetTool(params, "hover", (session) => ({
    uid: resolveChromeMcpSnapshotRef(session, params.targetId, params.uid),
  }));
}
/** Drag between two Chrome MCP snapshot element uids. */
async function dragChromeMcpElement(params) {
  await callTargetTool(params, "drag", (session) => ({
    from_uid: resolveChromeMcpSnapshotRef(session, params.targetId, params.fromUid),
    to_uid: resolveChromeMcpSnapshotRef(session, params.targetId, params.toUid),
  }));
}
/** Upload a local file into a Chrome MCP file input by uid. */
async function uploadChromeMcpFile(params) {
  await callTargetTool(params, "upload_file", (session) => ({
    uid: resolveChromeMcpSnapshotRef(session, params.targetId, params.uid),
    filePath: params.filePath,
  }));
}
/** Press a keyboard key in a Chrome MCP page. */
async function pressChromeMcpKey(params) {
  await callTargetTool(params, "press_key", { key: params.key });
}
/** Resize a Chrome MCP page viewport. */
async function resizeChromeMcpPage(params) {
  await callTargetTool(params, "resize_page", {
    width: params.width,
    height: params.height,
  });
}
/** Evaluate a JavaScript function in a Chrome MCP page. */
async function evaluateChromeMcpScript(params) {
  return extractJsonMessage(
    await callTargetTool(params, "evaluate_script", (session) => ({
      function: params.fn,
      ...(params.args?.length
        ? {
            args: params.args.map((ref) =>
              resolveChromeMcpSnapshotRef(session, params.targetId, ref),
            ),
          }
        : {}),
    })),
  );
}
/** Replace Chrome MCP session creation for focused tests. */
function setChromeMcpSessionFactoryForTest(factory) {
  sessionFactory = factory;
}
/** Replace process cleanup hooks for focused tests. */
function setChromeMcpProcessCleanupDepsForTest(deps) {
  chromeMcpProcessCleanupDepsForTest = deps;
}
/** Reset cached sessions and test hooks. */
async function resetChromeMcpSessionsForTest() {
  sessionFactory = null;
  for (const pending of pendingSessions.values())
    abortPendingChromeMcpSession(
      pending,
      /* @__PURE__ */ new Error("Chrome MCP sessions reset for test"),
    );
  await Promise.allSettled(
    [...pendingSessions.values()].map(drainCancelledChromeMcpPendingSession),
  );
  await stopAllChromeMcpSessions();
  pendingSessions.clear();
  chromeMcpProcessCleanupDepsForTest = null;
}
function toLintErrorObject(value, fallbackMessage) {
  if (value instanceof Error) return value;
  if (typeof value === "string") return new Error(value);
  const error = new Error(fallbackMessage, { cause: value });
  if ((typeof value === "object" && value !== null) || typeof value === "function")
    Object.assign(error, value);
  return error;
}
//#endregion
export {
  resolveChromeMcpNavigateCallTimeoutMs as C,
  takeChromeMcpSnapshot as D,
  takeChromeMcpScreenshot as E,
  uploadChromeMcpFile as O,
  resizeChromeMcpPage as S,
  setChromeMcpSessionFactoryForTest as T,
  navigateChromeMcpPage as _,
  closeChromeMcpTab as a,
  pressChromeMcpKey as b,
  dragChromeMcpElement as c,
  fillChromeMcpElement as d,
  fillChromeMcpForm as f,
  listChromeMcpTabs as g,
  hoverChromeMcpElement as h,
  closeChromeMcpSession as i,
  withChromeMcpDocument as k,
  ensureChromeMcpAvailable as l,
  getChromeMcpPid as m,
  clickChromeMcpCoords as n,
  countChromeMcpTabs as o,
  focusChromeMcpTab as p,
  clickChromeMcpElement as r,
  decodeChromeMcpStderrTail as s,
  ChromeMcpDocumentUnavailableError as t,
  evaluateChromeMcpScript as u,
  openChromeMcpTab as v,
  setChromeMcpProcessCleanupDepsForTest as w,
  resetChromeMcpSessionsForTest as x,
  parseChromeMcpUnixProcessListForTest as y,
};
