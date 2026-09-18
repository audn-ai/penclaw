import fs from "node:fs";
import { createRequire } from "node:module";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./process-runtime-BKNTr1ic.js";
import path from "node:path";
import { fileURLToPath } from "node:url";
import "./process-lease-DiKkFj6F.js";
import { t as AcpxPluginConfigSchema } from "./config-schema-B4teWnv2.js";
import { n as runExec } from "./exec-CXKmx4dL.js";
import { s as formatPluginConfigIssue } from "./extension-shared-DqZe9psR.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
//#region extensions/acpx/src/command-line.ts
/**
 * Small shell-command helpers for ACPX-launched processes. Splitting supports
 * simple quoted command strings from config without invoking a shell parser.
 */
/** Quote one command argument for display or config serialization. */
function quoteCommandPart(value) {
  return JSON.stringify(value);
}
/** Split a command string into argv-like parts using simple quote/backslash rules. */
function splitCommandParts(value) {
  const parts = [];
  let current = "";
  let quote = null;
  let escaping = false;
  for (const ch of value) {
    if (escaping) {
      current += ch;
      escaping = false;
      continue;
    }
    if (ch === "\\" && quote !== "'") {
      escaping = true;
      continue;
    }
    if (quote) {
      if (ch === quote) quote = null;
      else current += ch;
      continue;
    }
    if (ch === "'" || ch === '"') {
      quote = ch;
      continue;
    }
    if (/\s/.test(ch)) {
      if (current) {
        parts.push(current);
        current = "";
      }
      continue;
    }
    current += ch;
  }
  if (escaping) current += "\\";
  if (current) parts.push(current);
  return parts;
}
//#endregion
//#region extensions/acpx/src/config.ts
/**
 * Resolves ACPX plugin config from raw user configuration. It locates the
 * plugin root, injects optional MCP bridge servers, and applies runtime defaults.
 */
const ACPX_PLUGIN_TOOLS_MCP_SERVER_NAME = "openclaw-plugin-tools";
const ACPX_OPENCLAW_TOOLS_MCP_SERVER_NAME = "openclaw-tools";
const requireFromHere$1 = createRequire(import.meta.url);
function isAcpxPluginRoot(dir) {
  return (
    fs.existsSync(path.join(dir, "openclaw.plugin.json")) &&
    fs.existsSync(path.join(dir, "package.json"))
  );
}
function resolveNearestAcpxPluginRoot(moduleUrl) {
  let cursor = path.dirname(fileURLToPath(moduleUrl));
  for (let i = 0; i < 3; i += 1) {
    if (isAcpxPluginRoot(cursor)) return cursor;
    const parent = path.dirname(cursor);
    if (parent === cursor) break;
    cursor = parent;
  }
  return path.resolve(path.dirname(fileURLToPath(moduleUrl)), "..");
}
function resolveWorkspaceAcpxPluginRoot(currentRoot) {
  if (
    path.basename(currentRoot) !== "acpx" ||
    path.basename(path.dirname(currentRoot)) !== "extensions" ||
    path.basename(path.dirname(path.dirname(currentRoot))) !== "dist"
  )
    return null;
  const workspaceRoot = path.resolve(currentRoot, "..", "..", "..", "extensions", "acpx");
  return isAcpxPluginRoot(workspaceRoot) ? workspaceRoot : null;
}
function resolveRepoAcpxPluginRoot(currentRoot) {
  const workspaceRoot = path.join(currentRoot, "extensions", "acpx");
  return isAcpxPluginRoot(workspaceRoot) ? workspaceRoot : null;
}
function resolveAcpxPluginRootFromOpenClawLayout(moduleUrl) {
  let cursor = path.dirname(fileURLToPath(moduleUrl));
  for (let i = 0; i < 5; i += 1) {
    const candidates = [
      path.join(cursor, "extensions", "acpx"),
      path.join(cursor, "dist", "extensions", "acpx"),
      path.join(cursor, "dist-runtime", "extensions", "acpx"),
    ];
    for (const candidate of candidates) if (isAcpxPluginRoot(candidate)) return candidate;
    const parent = path.dirname(cursor);
    if (parent === cursor) break;
    cursor = parent;
  }
  return null;
}
/** Resolve the ACPX plugin root across source, dist, and dist-runtime layouts. */
function resolveAcpxPluginRoot(moduleUrl = import.meta.url) {
  const resolvedRoot = resolveNearestAcpxPluginRoot(moduleUrl);
  return (
    resolveWorkspaceAcpxPluginRoot(resolvedRoot) ??
    resolveRepoAcpxPluginRoot(resolvedRoot) ??
    resolveAcpxPluginRootFromOpenClawLayout(moduleUrl) ??
    resolvedRoot
  );
}
const DEFAULT_PERMISSION_MODE = "approve-reads";
const DEFAULT_NON_INTERACTIVE_POLICY = "fail";
const DEFAULT_QUEUE_OWNER_TTL_SECONDS = 0.1;
const DEFAULT_STRICT_WINDOWS_CMD_WRAPPER = true;
function parseAcpxPluginConfig(value) {
  if (value === void 0)
    return {
      ok: true,
      value: void 0,
    };
  const parsed = AcpxPluginConfigSchema.safeParse(value);
  if (!parsed.success)
    return {
      ok: false,
      message: formatPluginConfigIssue(parsed.error.issues[0]),
    };
  return {
    ok: true,
    value: parsed.data,
  };
}
function resolveOpenClawRoot(currentRoot) {
  if (
    path.basename(currentRoot) === "acpx" &&
    path.basename(path.dirname(currentRoot)) === "extensions"
  ) {
    const parent = path.dirname(path.dirname(currentRoot));
    if (path.basename(parent) === "dist") return path.dirname(parent);
    return parent;
  }
  return path.resolve(currentRoot, "..");
}
function resolveTsxImportSpecifier() {
  try {
    return requireFromHere$1.resolve("tsx");
  } catch {
    return "tsx";
  }
}
function shellQuoteCommandArg(arg) {
  if (!/[\s'"\\$|&;<>{}()*?[\]~`]/.test(arg)) return arg;
  return `'${arg.replace(/'/g, "'\"'\"'")}'`;
}
function resolvePluginToolsMcpServerConfig(moduleUrl = import.meta.url) {
  const openClawRoot = resolveOpenClawRoot(resolveAcpxPluginRoot(moduleUrl));
  const distEntry = path.join(openClawRoot, "dist", "mcp", "plugin-tools-serve.js");
  if (fs.existsSync(distEntry))
    return {
      command: process.execPath,
      args: [distEntry],
    };
  const sourceEntry = path.join(openClawRoot, "src", "mcp", "plugin-tools-serve.ts");
  return {
    command: process.execPath,
    args: ["--import", resolveTsxImportSpecifier(), sourceEntry],
  };
}
function resolveOpenClawToolsMcpServerConfig(moduleUrl = import.meta.url) {
  const openClawRoot = resolveOpenClawRoot(resolveAcpxPluginRoot(moduleUrl));
  const distEntry = path.join(openClawRoot, "dist", "mcp", "openclaw-tools-serve.js");
  if (fs.existsSync(distEntry))
    return {
      command: process.execPath,
      args: [distEntry],
    };
  const sourceEntry = path.join(openClawRoot, "src", "mcp", "openclaw-tools-serve.ts");
  return {
    command: process.execPath,
    args: ["--import", resolveTsxImportSpecifier(), sourceEntry],
  };
}
function resolveConfiguredMcpServers(params) {
  const resolved = { ...params.mcpServers };
  if (params.pluginToolsMcpBridge && resolved[ACPX_PLUGIN_TOOLS_MCP_SERVER_NAME])
    throw new Error(
      `mcpServers.${ACPX_PLUGIN_TOOLS_MCP_SERVER_NAME} is reserved when pluginToolsMcpBridge=true`,
    );
  if (params.openClawToolsMcpBridge && resolved[ACPX_OPENCLAW_TOOLS_MCP_SERVER_NAME])
    throw new Error(
      `mcpServers.${ACPX_OPENCLAW_TOOLS_MCP_SERVER_NAME} is reserved when openClawToolsMcpBridge=true`,
    );
  if (params.pluginToolsMcpBridge)
    resolved[ACPX_PLUGIN_TOOLS_MCP_SERVER_NAME] = resolvePluginToolsMcpServerConfig(
      params.moduleUrl,
    );
  if (params.openClawToolsMcpBridge)
    resolved[ACPX_OPENCLAW_TOOLS_MCP_SERVER_NAME] = resolveOpenClawToolsMcpServerConfig(
      params.moduleUrl,
    );
  return resolved;
}
/** Convert OpenClaw MCP server config into ACPX runtime MCP server entries. */
function toAcpMcpServers(mcpServers) {
  return Object.entries(mcpServers).map(([name, server]) => ({
    name,
    command: server.command,
    args: [...(server.args ?? [])],
    env: Object.entries(server.env ?? {}).map(([envName, value]) => ({
      name: envName,
      value,
    })),
  }));
}
/** Validate and normalize raw ACPX plugin config for runtime startup. */
function resolveAcpxPluginConfig(params) {
  const parsed = parseAcpxPluginConfig(params.rawConfig);
  if (!parsed.ok) throw new Error(parsed.message);
  const normalized = parsed.value ?? {};
  const workspaceDir = params.workspaceDir?.trim() || process.cwd();
  const fallbackCwd = workspaceDir;
  const cwd = path.resolve(normalized.cwd?.trim() || fallbackCwd);
  const stateDir = path.resolve(normalized.stateDir?.trim() || path.join(workspaceDir, "state"));
  const pluginToolsMcpBridge = normalized.pluginToolsMcpBridge === true;
  const openClawToolsMcpBridge = normalized.openClawToolsMcpBridge === true;
  const mcpServers = resolveConfiguredMcpServers({
    mcpServers: normalized.mcpServers,
    pluginToolsMcpBridge,
    openClawToolsMcpBridge,
    moduleUrl: params.moduleUrl,
  });
  const agents = Object.fromEntries(
    Object.entries(normalized.agents ?? {}).map(([name, entry]) => {
      const cmd = entry.command.trim();
      const cmdArgs = entry.args ?? [];
      const fullCommand =
        cmdArgs.length > 0 ? `${cmd} ${cmdArgs.map(shellQuoteCommandArg).join(" ")}` : cmd;
      return [normalizeLowercaseStringOrEmpty(name), fullCommand];
    }),
  );
  return {
    cwd,
    stateDir,
    probeAgent: normalized.probeAgent,
    permissionMode: normalized.permissionMode ?? DEFAULT_PERMISSION_MODE,
    nonInteractivePermissions:
      normalized.nonInteractivePermissions ?? DEFAULT_NON_INTERACTIVE_POLICY,
    pluginToolsMcpBridge,
    openClawToolsMcpBridge,
    strictWindowsCmdWrapper:
      normalized.strictWindowsCmdWrapper ?? DEFAULT_STRICT_WINDOWS_CMD_WRAPPER,
    timeoutSeconds: normalized.timeoutSeconds ?? 120,
    queueOwnerTtlSeconds: normalized.queueOwnerTtlSeconds ?? DEFAULT_QUEUE_OWNER_TTL_SECONDS,
    legacyCompatibilityConfig: {
      strictWindowsCmdWrapper: normalized.strictWindowsCmdWrapper,
      queueOwnerTtlSeconds: normalized.queueOwnerTtlSeconds,
    },
    mcpServers,
    agents,
  };
}
//#endregion
//#region extensions/acpx/src/process-reaper.ts
/**
 * ACPX process ownership checks and cleanup. The reaper only terminates
 * OpenClaw-owned wrapper trees after validating paths, packages, and lease ids.
 */
const requireFromHere = createRequire(import.meta.url);
const GENERATED_WRAPPER_BASENAMES = /* @__PURE__ */ new Set([
  "codex-acp-wrapper.mjs",
  "claude-agent-acp-wrapper.mjs",
]);
const OPENCLAW_PLUGIN_DEPS_MARKER = "/plugin-runtime-deps/";
const OWNED_ACP_PACKAGE_NAMES = [
  "@zed-industries/codex-acp",
  "@zed-industries/codex-acp-darwin-arm64",
  "@zed-industries/codex-acp-darwin-x64",
  "@zed-industries/codex-acp-linux-arm64",
  "@zed-industries/codex-acp-linux-x64",
  "@zed-industries/codex-acp-win32-arm64",
  "@zed-industries/codex-acp-win32-x64",
  "@agentclientprotocol/claude-agent-acp",
  "acpx",
];
const ACP_PACKAGE_MARKERS = [
  ...OWNED_ACP_PACKAGE_NAMES.map((packageName) => `/node_modules/${packageName}/`),
  "/acpx/dist/",
];
function normalizePathLike(value) {
  return value.replaceAll("\\", "/");
}
function resolvePackageRoot(packageName) {
  try {
    return normalizePathLike(path.dirname(requireFromHere.resolve(`${packageName}/package.json`)));
  } catch {
    return;
  }
}
function resolveOpenClawInstallRoot(pluginRoot) {
  if (
    path.basename(pluginRoot) === "acpx" &&
    path.basename(path.dirname(pluginRoot)) === "extensions"
  ) {
    const parent = path.dirname(path.dirname(pluginRoot));
    return path.basename(parent) === "dist" ? path.dirname(parent) : parent;
  }
  return path.resolve(pluginRoot, "..");
}
function resolveOwnedAcpPackageRootCandidates(packageName) {
  const pluginRoot = resolveAcpxPluginRoot(import.meta.url);
  const openClawRoot = resolveOpenClawInstallRoot(pluginRoot);
  return [
    resolvePackageRoot(packageName),
    path.join(pluginRoot, "node_modules", packageName),
    path.join(openClawRoot, "node_modules", packageName),
  ].flatMap((root) => (root ? [normalizePathLike(root)] : []));
}
const OWNED_ACP_PACKAGE_ROOTS = Array.from(
  new Set(OWNED_ACP_PACKAGE_NAMES.flatMap(resolveOwnedAcpPackageRootCandidates)),
);
function commandBelongsToResolvedAcpPackage(command) {
  return OWNED_ACP_PACKAGE_ROOTS.some((root) => command.includes(`${root}/`));
}
function commandMentionsGeneratedWrapper(command) {
  return Array.from(GENERATED_WRAPPER_BASENAMES).some((basename) => command.includes(basename));
}
function commandWrapperBelongsToRoot(command, wrapperRoot) {
  if (!wrapperRoot) return true;
  const normalizedCommand = normalizePathLike(command);
  const normalizedRoot = normalizePathLike(wrapperRoot).replace(/\/+$/, "");
  return Array.from(GENERATED_WRAPPER_BASENAMES).some((basename) =>
    normalizedCommand.includes(`${normalizedRoot}/${basename}`),
  );
}
/** Check whether a command references an OpenClaw-generated ACPX wrapper path. */
function isOpenClawLeaseAwareAcpxProcessCommand(params) {
  const command = params.command?.trim();
  if (!command) return false;
  const normalized = normalizePathLike(command);
  return (
    commandMentionsGeneratedWrapper(normalized) &&
    commandWrapperBelongsToRoot(normalized, params.wrapperRoot)
  );
}
function commandsReferToSameRootCommand(liveCommand, storedCommand) {
  if (!storedCommand?.trim()) return true;
  return normalizePathLike(liveCommand).trim() === normalizePathLike(storedCommand).trim();
}
function commandOptionEquals(parts, option, expected) {
  if (!expected) return true;
  const index = parts.indexOf(option);
  return index >= 0 && parts[index + 1] === expected;
}
function liveCommandMatchesLeaseIdentity(params) {
  if (!params.expectedLeaseId && !params.expectedGatewayInstanceId) return true;
  const parts = splitCommandParts(params.command ?? "");
  return (
    commandOptionEquals(parts, "--openclaw-acpx-lease-id", params.expectedLeaseId) &&
    commandOptionEquals(parts, "--openclaw-gateway-instance-id", params.expectedGatewayInstanceId)
  );
}
/** Check whether a command is owned by OpenClaw ACPX runtime packages or wrappers. */
function isOpenClawOwnedAcpxProcessCommand(params) {
  const command = params.command?.trim();
  if (!command) return false;
  const normalized = normalizePathLike(command);
  if (
    isOpenClawLeaseAwareAcpxProcessCommand({
      command: normalized,
      wrapperRoot: params.wrapperRoot,
    })
  )
    return true;
  if (commandBelongsToResolvedAcpPackage(normalized)) return true;
  if (!normalized.includes(OPENCLAW_PLUGIN_DEPS_MARKER)) return false;
  return ACP_PACKAGE_MARKERS.some((marker) => normalized.includes(marker));
}
function parseProcessList(stdout) {
  const processes = [];
  for (const line of stdout.split(/\r?\n/)) {
    const match = /^\s*(?<pid>\d+)\s+(?<ppid>\d+)\s+(?<command>.+?)\s*$/.exec(line);
    const pid = match?.groups?.pid;
    const ppid = match?.groups?.ppid;
    const command = match?.groups?.command;
    if (!pid || !ppid || !command) continue;
    processes.push({
      pid: Number.parseInt(pid, 10),
      ppid: Number.parseInt(ppid, 10),
      command,
    });
  }
  return processes;
}
/** List host processes in the compact shape needed by ACPX cleanup. */
async function listPlatformProcesses() {
  if (process.platform === "win32") return [];
  const { stdout } = await runExec("ps", ["-axo", "pid=,ppid=,command="], {
    logOutput: false,
    maxBuffer: 8 * 1024 * 1024,
  });
  return parseProcessList(stdout);
}
function collectProcessTree(processes, rootPid) {
  const childrenByParent = /* @__PURE__ */ new Map();
  for (const processInfo of processes) {
    const children = childrenByParent.get(processInfo.ppid) ?? [];
    children.push(processInfo);
    childrenByParent.set(processInfo.ppid, children);
  }
  const root = new Map(processes.map((processInfo) => [processInfo.pid, processInfo])).get(rootPid);
  const collected = [];
  if (root) collected.push(root);
  const queue = [...(childrenByParent.get(rootPid) ?? [])];
  while (queue.length > 0) {
    const next = queue.shift();
    if (!next || collected.some((processInfo) => processInfo.pid === next.pid)) continue;
    collected.push(next);
    queue.push(...(childrenByParent.get(next.pid) ?? []));
  }
  return collected;
}
function uniquePids(processes) {
  return Array.from(
    new Set(
      processes
        .map((processInfo) => processInfo.pid)
        .filter((pid) => Number.isInteger(pid) && pid > 0 && pid !== process.pid),
    ),
  );
}
function isProcessAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}
async function terminatePids(pids, deps) {
  const killProcess = deps?.killProcess ?? ((pid, signal) => process.kill(pid, signal));
  const sleep =
    deps?.sleep ??
    ((ms) =>
      new Promise((resolve) => {
        setTimeout(resolve, ms);
      }));
  const terminated = [];
  for (const pid of pids)
    try {
      killProcess(pid, "SIGTERM");
      terminated.push(pid);
    } catch {}
  if (terminated.length === 0) return terminated;
  await sleep(750);
  for (const pid of terminated)
    if (deps?.killProcess || isProcessAlive(pid))
      try {
        killProcess(pid, "SIGKILL");
      } catch {}
  return terminated;
}
/** Terminate one validated OpenClaw-owned ACPX wrapper process tree. */
async function cleanupOpenClawOwnedAcpxProcessTree(params) {
  const rootPid = params.rootPid;
  if (!rootPid || rootPid <= 0 || rootPid === process.pid)
    return {
      inspectedPids: [],
      terminatedPids: [],
      skippedReason: "missing-root",
    };
  let processes;
  try {
    processes = await (params.deps?.listProcesses ?? listPlatformProcesses)();
  } catch {
    processes = [];
  }
  const listedTree = collectProcessTree(processes, rootPid);
  if (listedTree.length === 0)
    return {
      inspectedPids: [],
      terminatedPids: [],
      skippedReason: "unverified-root",
    };
  const rootCommand = listedTree[0]?.command ?? params.rootCommand;
  const liveCommandWasGeneratedWrapper = commandMentionsGeneratedWrapper(
    normalizePathLike(rootCommand ?? ""),
  );
  const storedCommandWasGeneratedWrapper = commandMentionsGeneratedWrapper(
    normalizePathLike(params.rootCommand ?? ""),
  );
  if (!liveCommandWasGeneratedWrapper && storedCommandWasGeneratedWrapper)
    return {
      inspectedPids: listedTree.map((processInfo) => processInfo.pid),
      terminatedPids: [],
      skippedReason: "not-openclaw-owned",
    };
  if (
    !liveCommandWasGeneratedWrapper &&
    !commandsReferToSameRootCommand(rootCommand ?? "", params.rootCommand)
  )
    return {
      inspectedPids: listedTree.map((processInfo) => processInfo.pid),
      terminatedPids: [],
      skippedReason: "not-openclaw-owned",
    };
  if (
    !isOpenClawOwnedAcpxProcessCommand({
      command: rootCommand,
      wrapperRoot: params.wrapperRoot,
    })
  )
    return {
      inspectedPids: listedTree.map((processInfo) => processInfo.pid),
      terminatedPids: [],
      skippedReason: "not-openclaw-owned",
    };
  if (
    !liveCommandMatchesLeaseIdentity({
      command: rootCommand,
      expectedLeaseId: params.expectedLeaseId,
      expectedGatewayInstanceId: params.expectedGatewayInstanceId,
    })
  )
    return {
      inspectedPids: listedTree.map((processInfo) => processInfo.pid),
      terminatedPids: [],
      skippedReason: "not-openclaw-owned",
    };
  const pids = uniquePids(listedTree.toReversed());
  return {
    inspectedPids: uniquePids(listedTree),
    terminatedPids: await terminatePids(pids, params.deps),
  };
}
/** Reap orphaned OpenClaw-owned ACPX wrapper trees during runtime startup. */
async function reapStaleOpenClawOwnedAcpxOrphans(params) {
  if (process.platform === "win32")
    return {
      inspectedPids: [],
      terminatedPids: [],
      skippedReason: "unsupported-platform",
    };
  let processes;
  try {
    processes = await (params.deps?.listProcesses ?? listPlatformProcesses)();
  } catch {
    return {
      inspectedPids: [],
      terminatedPids: [],
      skippedReason: "process-list-unavailable",
    };
  }
  const orphanTrees = processes
    .filter(
      (processInfo) =>
        processInfo.ppid === 1 &&
        isOpenClawOwnedAcpxProcessCommand({
          command: processInfo.command,
          wrapperRoot: params.wrapperRoot,
        }),
    )
    .map((orphan) => collectProcessTree(processes, orphan.pid));
  return {
    inspectedPids: uniquePids(orphanTrees.flat()),
    terminatedPids: await terminatePids(
      uniquePids(orphanTrees.flatMap((tree) => tree.toReversed())),
      params.deps,
    ),
  };
}
//#endregion
export {
  resolveAcpxPluginRoot as a,
  splitCommandParts as c,
  resolveAcpxPluginConfig as i,
  isOpenClawLeaseAwareAcpxProcessCommand as n,
  toAcpMcpServers as o,
  reapStaleOpenClawOwnedAcpxOrphans as r,
  quoteCommandPart as s,
  cleanupOpenClawOwnedAcpxProcessTree as t,
};
