import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import fs$1 from "node:fs/promises";
import os, { homedir } from "node:os";
import path from "node:path";
import * as readline$1 from "node:readline";
import { Readable, Writable } from "node:stream";
import { fileURLToPath } from "node:url";
import {
  AGENT_METHODS,
  AgentSideConnection,
  ClientSideConnection,
  PROTOCOL_VERSION,
  ndJsonStream,
} from "@agentclientprotocol/sdk";
import { t as GatewayClient } from "./client-BkZfVL9e.js";
import { t as resolveGatewayClientBootstrap } from "./client-bootstrap-BOzSWcXH.js";
import {
  i as GATEWAY_CLIENT_NAMES,
  r as GATEWAY_CLIENT_MODES,
  t as GATEWAY_CLIENT_CAPS,
} from "./client-info-Br1guPTt.js";
import { t as startGatewayClientWhenEventLoopReady } from "./client-start-readiness-_Anybv37.js";
import { n as inheritOptionFromParent } from "./command-options-Bv6UxUlT.js";
import { a as routeLogsToStderr } from "./console-CspqtrUy.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import "./path-guards-CBe_wA_B.js";
import { o as withFileLock } from "./file-lock-C2Kr7iLJ.js";
import { t as resolveGatewayAuthOptions } from "./gateway-secret-options-TEj2PlFa.js";
import { i as getRuntimeConfig } from "./io-B3ne6NxF.js";
import { t as isMainModule } from "./is-main-CH4EEB_R.js";
import { r as readJsonFile } from "./json-files-CTWRDHag.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-B-Fc-m0I.js";
import { t as formatDocsLink } from "./links-ClIwBcy4.js";
import {
  i as readString,
  n as readNonNegativeInteger,
  r as readNumber,
  t as readBool,
} from "./meta-LZ3bOX3S.js";
import "./file-lock-CsC2zkbH.js";
import "./config-BDv-QbJ6.js";
import { P as timestampMsToIsoString } from "./number-coercion-CJQ8TR--.js";
import { t as resolveIntegerOption } from "./numeric-options-DkZ44EcT.js";
import {
  l as runOpenClawStateWriteTransaction,
  r as closeOpenClawStateDatabase,
  s as openOpenClawStateDatabase,
} from "./openclaw-state-db-Bsa8Tv1Z.js";
import { i as isPathInside } from "./path-DILYn_gk.js";
import { t as ensureOpenClawCliOnPath } from "./path-env-Ch4tyXXb.js";
import { y as resolveStateDir } from "./paths-DEklnbzU.js";
import {
  i as omitEnvKeysCaseInsensitive,
  n as listKnownProviderAuthEnvVarNames,
} from "./provider-env-vars-BZiQzob_.js";
import { i as asOptionalRecord, o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { r as defaultRuntime } from "./runtime-Bz6o617W.js";
import { t as sanitizeTerminalText } from "./safe-text-DiGQuw-e.js";
import { t as readSecretFromFile } from "./secret-file-Dz7RHA10.js";
import { n as defaultAcpSessionStore } from "./session-DijYR-Eq.js";
import { t as toAcpSessionLineageMeta } from "./session-lineage-meta-B-F6UsS0.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
  i as normalizeFastMode,
  p as readStringValue,
  t as hasNonEmptyString,
} from "./string-coerce-DW4mBlAt.js";
import { r as readTrimmedStringAlias } from "./string-readers-A0wspDGq.js";
import { r as theme } from "./theme-vjDs9tao.js";
import { t as BASE_THINKING_LEVELS } from "./thinking.shared-BWnbgBUO.js";
import { r as isKnownCoreToolId } from "./tool-catalog-fgOwzAUV.js";
import { r as isMutatingToolCall } from "./tool-mutation-CjFyaPPn.js";
import { t as normalizeAcpProvenanceMode } from "./types-ykEDTU-3.js";
import { t as hasHttpUrlPrefix } from "./url-protocol-oWYinajA.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
import { h as shortenHomePath } from "./utils-DtcDeqWS.js";
import { n as VERSION } from "./version-CeFj_iGk.js";
import {
  a as resolveWindowsSpawnProgram,
  r as materializeWindowsSpawnProgram,
} from "./windows-spawn-C5RDaB22.js";
//#region src/acp/approval-classifier.ts
/** Classifies ACP tool permission requests into auto-approved and prompt-required risk buckets. */
const SAFE_SEARCH_TOOL_IDS = /* @__PURE__ */ new Set(["search", "web_search", "memory_search"]);
const TRUSTED_SAFE_TOOL_ALIASES = /* @__PURE__ */ new Set(["search"]);
const EXEC_CAPABLE_TOOL_IDS = /* @__PURE__ */ new Set([
  "exec",
  "spawn",
  "shell",
  "bash",
  "process",
  "code_execution",
  "nodes",
]);
const CONTROL_PLANE_TOOL_IDS = /* @__PURE__ */ new Set([
  "cron",
  "gateway",
  "sessions_spawn",
  "sessions_send",
  "session_status",
]);
function readFirstStringValue(source, keys) {
  if (!source) return;
  return readTrimmedStringAlias(source, keys);
}
function normalizeToolName(value) {
  const normalized = normalizeLowercaseStringOrEmpty(value);
  if (!normalized || normalized.length > 128) return;
  return /^[a-z0-9._-]+$/.test(normalized) ? normalized : void 0;
}
function parseToolNameFromTitle(title) {
  if (!title) return;
  const head = normalizeOptionalString(title.split(":", 1)[0]);
  return head ? normalizeToolName(head) : void 0;
}
function resolveToolNameForPermission(params) {
  const toolCall = params.toolCall;
  const toolMeta = asOptionalRecord(toolCall?.["_meta"]);
  const rawInput = asOptionalRecord(toolCall?.rawInput);
  const fromMeta = readFirstStringValue(toolMeta, ["toolName", "tool_name", "name"]);
  const fromRawInput = readFirstStringValue(rawInput, ["tool", "toolName", "tool_name", "name"]);
  const fromTitle = parseToolNameFromTitle(toolCall?.title);
  const metaName = fromMeta ? normalizeToolName(fromMeta) : void 0;
  const rawInputName = fromRawInput ? normalizeToolName(fromRawInput) : void 0;
  const titleName = fromTitle;
  if ((fromMeta && !metaName) || (fromRawInput && !rawInputName)) return;
  if (metaName && titleName && metaName !== titleName) return;
  if (rawInputName && metaName && rawInputName !== metaName) return;
  if (rawInputName && titleName && rawInputName !== titleName) return;
  return metaName ?? titleName ?? rawInputName;
}
function extractPathFromToolTitle(toolTitle, toolName) {
  if (!toolTitle) return;
  const separator = toolTitle.indexOf(":");
  if (separator < 0) return;
  const tail = toolTitle.slice(separator + 1).trim();
  if (!tail) return;
  const keyedMatch =
    toolName === "read"
      ? tail.match(/(?:^|,\s*)(?:path|file_path|filePath)\s*:\s*([^,]+)/)
      : tail.match(/^(?:path|file_path|filePath)\s*:\s*([^,]+)/);
  if (keyedMatch?.[1]) return keyedMatch[1].trim();
  return toolName === "read" ? tail : void 0;
}
function readLocationPaths(locations) {
  if (!Array.isArray(locations)) return [];
  const paths = [];
  for (const location of locations) {
    const pathValue = readFirstStringValue(asOptionalRecord(location), [
      "path",
      "file_path",
      "filePath",
    ]);
    if (pathValue) paths.push(pathValue);
  }
  return paths;
}
function resolveToolPathCandidates(params) {
  return [
    readFirstStringValue(asOptionalRecord(params.toolCall?.rawInput), [
      "path",
      "file_path",
      "filePath",
    ]),
    extractPathFromToolTitle(params.toolTitle, params.toolName),
    ...(params.includeLocations ? readLocationPaths(params.toolCall?.locations) : []),
  ].filter((value) => value !== void 0);
}
function resolveAbsoluteScopedPath(value, cwd) {
  let candidate = value.trim();
  if (!candidate) return;
  if (candidate.startsWith("file://"))
    try {
      const parsed = new URL(candidate);
      candidate = decodeURIComponent(parsed.pathname || "");
    } catch {
      return;
    }
  if (candidate === "~") candidate = homedir();
  else if (candidate.startsWith("~/")) candidate = path.join(homedir(), candidate.slice(2));
  return path.isAbsolute(candidate) ? path.normalize(candidate) : path.resolve(cwd, candidate);
}
function isToolPathScopedToCwd(rawPath, cwd) {
  const absolutePath = resolveAbsoluteScopedPath(rawPath, cwd);
  if (!absolutePath) return false;
  return isPathInside(path.resolve(cwd), absolutePath);
}
/** Resolves the ACP approval class for one tool call, failing closed on spoofed tool identity. */
function classifyAcpToolApproval(params) {
  const toolName = resolveToolNameForPermission(params);
  if (!toolName)
    return {
      toolName: void 0,
      approvalClass: "unknown",
      autoApprove: false,
    };
  const isTrustedToolId = isKnownCoreToolId(toolName) || TRUSTED_SAFE_TOOL_ALIASES.has(toolName);
  if (toolName === "read" && isTrustedToolId) {
    const rawPaths = resolveToolPathCandidates({
      includeLocations: false,
      toolCall: params.toolCall,
      toolName,
      toolTitle: params.toolCall?.title ?? void 0,
    });
    const autoApprove =
      rawPaths.length > 0 &&
      rawPaths.every((rawPath) => isToolPathScopedToCwd(rawPath, params.cwd));
    return {
      toolName,
      approvalClass: autoApprove ? "readonly_scoped" : "other",
      autoApprove,
    };
  }
  if (SAFE_SEARCH_TOOL_IDS.has(toolName) && isTrustedToolId) {
    if (
      resolveToolPathCandidates({
        includeLocations: true,
        toolCall: params.toolCall,
        toolName,
        toolTitle: params.toolCall?.title ?? void 0,
      }).some((rawPath) => !isToolPathScopedToCwd(rawPath, params.cwd))
    )
      return {
        toolName,
        approvalClass: "other",
        autoApprove: false,
      };
    return {
      toolName,
      approvalClass: "readonly_search",
      autoApprove: true,
    };
  }
  if (EXEC_CAPABLE_TOOL_IDS.has(toolName))
    return {
      toolName,
      approvalClass: "exec_capable",
      autoApprove: false,
    };
  if (CONTROL_PLANE_TOOL_IDS.has(toolName))
    return {
      toolName,
      approvalClass: "control_plane",
      autoApprove: false,
    };
  if (isMutatingToolCall(toolName, params.toolCall?.rawInput))
    return {
      toolName,
      approvalClass: "mutating",
      autoApprove: false,
    };
  return {
    toolName,
    approvalClass: "other",
    autoApprove: false,
  };
}
//#endregion
//#region src/acp/client-helpers.ts
/** Permission, environment, and spawn helpers for the standalone ACP client. */
function resolveToolKindForPermission(toolName, approvalClass) {
  if (!toolName && approvalClass === "unknown") return;
  if (approvalClass === "readonly_scoped") return "readonly_scoped";
  if (approvalClass === "readonly_search") return "readonly_search";
  return approvalClass;
}
function pickOption(options, kinds) {
  for (const kind of kinds) {
    const match = options.find((option) => option.kind === kind);
    if (match) return match;
  }
}
function selectedPermission(optionId) {
  return {
    outcome: {
      outcome: "selected",
      optionId,
    },
  };
}
function cancelledPermission() {
  return { outcome: { outcome: "cancelled" } };
}
function promptUserPermission(toolName, toolTitle) {
  if (!process.stdin.isTTY || !process.stderr.isTTY) {
    console.error(`[permission denied] ${toolName ?? "unknown"}: non-interactive terminal`);
    return Promise.resolve(false);
  }
  return new Promise((resolve) => {
    let settled = false;
    const rl = readline$1.createInterface({
      input: process.stdin,
      output: process.stderr,
    });
    const finish = (approved) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      rl.close();
      resolve(approved);
    };
    const timeout = setTimeout(() => {
      console.error(`\n[permission timeout] denied: ${toolName ?? "unknown"}`);
      finish(false);
    }, 3e4);
    const label = toolTitle
      ? toolName
        ? `${toolTitle} (${toolName})`
        : toolTitle
      : (toolName ?? "unknown tool");
    rl.question(`\n[permission] Allow "${label}"? (y/N) `, (answer) => {
      const approved = normalizeLowercaseStringOrEmpty(answer) === "y";
      console.error(`[permission ${approved ? "approved" : "denied"}] ${toolName ?? "unknown"}`);
      finish(approved);
    });
  });
}
/** Converts an ACP permission request into a selected allow/reject option or cancellation. */
async function resolvePermissionRequest(params, deps = {}) {
  const log = deps.log ?? ((line) => console.error(line));
  const prompt = deps.prompt ?? promptUserPermission;
  const cwd = deps.cwd ?? process.cwd();
  const options = params.options ?? [];
  const toolTitle = sanitizeTerminalText(params.toolCall?.title ?? "tool");
  const classification = classifyAcpToolApproval({
    toolCall: params.toolCall,
    cwd,
  });
  const toolName = classification.toolName;
  const toolKind = resolveToolKindForPermission(toolName, classification.approvalClass);
  if (options.length === 0) {
    log(`[permission cancelled] ${toolName ?? "unknown"}: no options available`);
    return cancelledPermission();
  }
  const allowOption = pickOption(options, ["allow_once", "allow_always"]);
  const rejectOption = pickOption(options, ["reject_once", "reject_always"]);
  if (!!classification.autoApprove) {
    if (!allowOption) {
      log(`[permission cancelled] ${toolName ?? "unknown"}: missing allow option`);
      return cancelledPermission();
    }
    log(`[permission auto-approved] ${toolName} (${toolKind ?? "unknown"})`);
    return selectedPermission(allowOption.optionId);
  }
  log(
    `\n[permission requested] ${toolTitle}${toolName ? ` (${toolName})` : ""}${toolKind ? ` [${toolKind}]` : ""}`,
  );
  const approved = await prompt(toolName, toolTitle);
  if (approved && allowOption) return selectedPermission(allowOption.optionId);
  if (!approved && rejectOption) return selectedPermission(rejectOption.optionId);
  log(
    `[permission cancelled] ${toolName ?? "unknown"}: missing ${approved ? "allow" : "reject"} option`,
  );
  return cancelledPermission();
}
/** Builds the sanitized environment used when spawning an ACP client process. */
function resolveAcpClientSpawnEnv(baseEnv = process.env, options = {}) {
  const env = omitEnvKeysCaseInsensitive(baseEnv, options.stripKeys ?? []);
  env.OPENCLAW_SHELL = "acp-client";
  return env;
}
/** Returns true when the client should hide provider credentials from the spawned server. */
function shouldStripProviderAuthEnvVarsForAcpServer(params = {}) {
  const serverCommand = normalizeOptionalString(params.serverCommand);
  if (!serverCommand) return true;
  const defaultServerCommand = normalizeOptionalString(params.defaultServerCommand);
  if (!defaultServerCommand || serverCommand !== defaultServerCommand) return false;
  const serverArgs = params.serverArgs ?? [];
  const defaultServerArgs = params.defaultServerArgs ?? [];
  return (
    serverArgs.length === defaultServerArgs.length &&
    serverArgs.every((arg, index) => arg === defaultServerArgs[index])
  );
}
/** Builds the exact environment variable denylist used for ACP client subprocesses. */
function buildAcpClientStripKeys(params) {
  const stripKeys = new Set(params.activeSkillEnvKeys ?? []);
  if (params.stripProviderAuthEnvVars)
    for (const key of listKnownProviderAuthEnvVarNames()) stripKeys.add(key);
  return stripKeys;
}
const DEFAULT_ACP_SPAWN_RUNTIME = {
  platform: process.platform,
  env: process.env,
  execPath: process.execPath,
};
/** Resolves the executable/args used to spawn an ACP server, including Windows shims. */
function resolveAcpClientSpawnInvocation(params, runtime = DEFAULT_ACP_SPAWN_RUNTIME) {
  const resolved = materializeWindowsSpawnProgram(
    resolveWindowsSpawnProgram({
      command: params.serverCommand,
      platform: runtime.platform,
      env: runtime.env,
      execPath: runtime.execPath,
      packageName: "openclaw",
    }),
    params.serverArgs,
  );
  return {
    command: resolved.command,
    args: resolved.argv,
    shell: resolved.shell,
    windowsHide: resolved.windowsHide,
  };
}
//#endregion
//#region src/acp/client.ts
/** Interactive stdio ACP client used to connect a terminal session to an OpenClaw ACP server. */
function toArgs(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}
function buildServerArgs(opts) {
  const args = ["acp", ...toArgs(opts.serverArgs)];
  if (opts.serverVerbose && !args.includes("--verbose") && !args.includes("-v"))
    args.push("--verbose");
  return args;
}
function resolveSelfEntryPath() {
  try {
    const here = fileURLToPath(import.meta.url);
    const candidate = path.resolve(path.dirname(here), "..", "entry.js");
    if (fs.existsSync(candidate)) return candidate;
  } catch {}
  const argv1 = normalizeOptionalString(process.argv[1]);
  if (argv1) return path.isAbsolute(argv1) ? argv1 : path.resolve(process.cwd(), argv1);
  return null;
}
function printSessionUpdate(notification) {
  const update = notification.update;
  switch (update.sessionUpdate) {
    case "agent_message_chunk":
      if (update.content?.type === "text") process.stdout.write(update.content.text);
      return;
    case "tool_call":
      console.log(`\n[tool] ${update.title} (${update.status})`);
      return;
    case "tool_call_update":
      if (update.status) console.log(`[tool update] ${update.toolCallId}: ${update.status}`);
      return;
    case "available_commands_update": {
      const names = update.availableCommands?.map((cmd) => `/${cmd.name}`).join(" ");
      if (names) console.log(`\n[commands] ${names}`);
    }
    default:
  }
}
async function createAcpClient(opts = {}) {
  const cwd = opts.cwd ?? process.cwd();
  const log = Boolean(opts.verbose) ? (msg) => console.error(`[acp-client] ${msg}`) : () => {};
  ensureOpenClawCliOnPath();
  const serverArgs = buildServerArgs(opts);
  const entryPath = resolveSelfEntryPath();
  const defaultServerCommand = entryPath ? process.execPath : "openclaw";
  const defaultServerArgs = entryPath ? [entryPath, ...serverArgs] : serverArgs;
  const serverCommand = opts.serverCommand ?? defaultServerCommand;
  const effectiveArgs = opts.serverCommand || !entryPath ? serverArgs : defaultServerArgs;
  const { getActiveSkillEnvKeys } = await import("./env-overrides.runtime.js");
  const stripKeys = buildAcpClientStripKeys({
    stripProviderAuthEnvVars: shouldStripProviderAuthEnvVarsForAcpServer({
      serverCommand,
      serverArgs: effectiveArgs,
      defaultServerCommand,
      defaultServerArgs,
    }),
    activeSkillEnvKeys: getActiveSkillEnvKeys(),
  });
  const spawnEnv = resolveAcpClientSpawnEnv(process.env, { stripKeys });
  const spawnInvocation = resolveAcpClientSpawnInvocation(
    {
      serverCommand,
      serverArgs: effectiveArgs,
    },
    {
      platform: process.platform,
      env: spawnEnv,
      execPath: process.execPath,
    },
  );
  log(`spawning: ${spawnInvocation.command} ${spawnInvocation.args.join(" ")}`);
  const agent = spawn(spawnInvocation.command, spawnInvocation.args, {
    stdio: ["pipe", "pipe", "inherit"],
    cwd,
    env: spawnEnv,
    shell: spawnInvocation.shell,
    windowsHide: spawnInvocation.windowsHide,
  });
  if (!agent.stdin || !agent.stdout) throw new Error("Failed to create ACP stdio pipes");
  const client = new ClientSideConnection(
    () => ({
      sessionUpdate: async (params) => {
        printSessionUpdate(params);
      },
      requestPermission: async (params) => {
        return resolvePermissionRequest(params, { cwd });
      },
    }),
    ndJsonStream(Writable.toWeb(agent.stdin), Readable.toWeb(agent.stdout)),
  );
  log("initializing");
  await client.initialize({
    protocolVersion: PROTOCOL_VERSION,
    clientCapabilities: {
      fs: {
        readTextFile: true,
        writeTextFile: true,
      },
      terminal: true,
    },
    clientInfo: {
      name: "openclaw-acp-client",
      version: "1.0.0",
    },
  });
  log("creating session");
  return {
    client,
    agent,
    sessionId: (
      await client.newSession({
        cwd,
        mcpServers: [],
      })
    ).sessionId,
  };
}
/** Starts the terminal prompt loop for a local ACP client session. */
async function runAcpClientInteractive(opts = {}) {
  const { client, agent, sessionId } = await createAcpClient(opts);
  const rl = readline$1.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  console.log("OpenClaw ACP client");
  console.log(`Session: ${sessionId}`);
  console.log('Type a prompt, or "exit" to quit.\n');
  const prompt = () => {
    rl.question("> ", (input) => {
      (async () => {
        const text = input.trim();
        if (!text) {
          prompt();
          return;
        }
        if (text === "exit" || text === "quit") {
          agent.kill();
          rl.close();
          process.exit(0);
        }
        try {
          const response = await client.prompt({
            sessionId,
            prompt: [
              {
                type: "text",
                text,
              },
            ],
          });
          console.log(`\n[${response.stopReason}]\n`);
        } catch (err) {
          console.error(`\n[error] ${String(err)}\n`);
        }
        prompt();
      })();
    });
  };
  prompt();
  agent.on("exit", (code) => {
    console.log(`\nAgent exited with code ${code ?? 0}`);
    rl.close();
    process.exit(code ?? 0);
  });
}
//#endregion
//#region src/acp/event-ledger.ts
/** Persistent/replayable ACP event ledger implementations for session rehydration. */
const LEDGER_VERSION = 1;
const DEFAULT_MAX_SESSIONS = 200;
const DEFAULT_MAX_EVENTS_PER_SESSION = 5e3;
const DEFAULT_MAX_SERIALIZED_BYTES = 16 * 1024 * 1024;
const FILE_LEDGER_LOCK_OPTIONS = {
  retries: {
    retries: 8,
    factor: 2,
    minTimeout: 50,
    maxTimeout: 5e3,
    randomize: true,
  },
  stale: 15e3,
};
function createEmptyStore() {
  return {
    version: LEDGER_VERSION,
    sessions: {},
  };
}
function normalizeLedgerOptions(options = {}) {
  return {
    maxSessions: resolveIntegerOption(options.maxSessions, DEFAULT_MAX_SESSIONS, { min: 1 }),
    maxEventsPerSession: resolveIntegerOption(
      options.maxEventsPerSession,
      DEFAULT_MAX_EVENTS_PER_SESSION,
      { min: 1 },
    ),
    maxSerializedBytes: resolveIntegerOption(
      options.maxSerializedBytes,
      DEFAULT_MAX_SERIALIZED_BYTES,
      { min: 1024 },
    ),
    now: options.now ?? Date.now,
  };
}
function cloneJsonValue(value) {
  return structuredClone(value);
}
function createUserPromptUpdates(prompt) {
  return prompt.map((content) => ({
    sessionUpdate: "user_message_chunk",
    content: cloneJsonValue(content),
  }));
}
function serializeLedgerStore(store) {
  return JSON.stringify(store);
}
function getSerializedLedgerByteLength(store) {
  return Buffer.byteLength(serializeLedgerStore(store), "utf8");
}
function normalizeEvent(raw) {
  if (!isRecord(raw) || !isRecord(raw.update)) return;
  const seq = raw.seq;
  const at = raw.at;
  const sessionId = raw.sessionId;
  const sessionKey = raw.sessionKey;
  const runId = raw.runId;
  const sessionUpdate = raw.update.sessionUpdate;
  if (
    typeof seq !== "number" ||
    !Number.isInteger(seq) ||
    seq < 0 ||
    typeof at !== "number" ||
    !Number.isFinite(at) ||
    typeof sessionId !== "string" ||
    typeof sessionKey !== "string" ||
    typeof sessionUpdate !== "string"
  )
    return;
  return {
    seq,
    at,
    sessionId,
    sessionKey,
    ...(typeof runId === "string" && runId ? { runId } : {}),
    update: cloneJsonValue(raw.update),
  };
}
function normalizeSession(raw) {
  if (!isRecord(raw)) return;
  const sessionId = raw.sessionId;
  const sessionKey = raw.sessionKey;
  const cwd = raw.cwd;
  const createdAt = raw.createdAt;
  const updatedAt = raw.updatedAt;
  const nextSeq = raw.nextSeq;
  if (
    typeof sessionId !== "string" ||
    typeof sessionKey !== "string" ||
    typeof cwd !== "string" ||
    typeof createdAt !== "number" ||
    !Number.isFinite(createdAt) ||
    typeof updatedAt !== "number" ||
    !Number.isFinite(updatedAt) ||
    typeof nextSeq !== "number" ||
    !Number.isInteger(nextSeq) ||
    nextSeq < 1
  )
    return;
  const events = Array.isArray(raw.events)
    ? raw.events.map(normalizeEvent).filter((event) => Boolean(event))
    : [];
  return {
    sessionId,
    sessionKey,
    cwd,
    complete: raw.complete === true,
    createdAt,
    updatedAt,
    nextSeq,
    events,
  };
}
function normalizeStore(raw) {
  if (!isRecord(raw) || raw.version !== LEDGER_VERSION || !isRecord(raw.sessions))
    return createEmptyStore();
  const sessions = {};
  for (const [sessionId, value] of Object.entries(raw.sessions)) {
    const session = normalizeSession(value);
    if (!session || session.sessionId !== sessionId) continue;
    sessions[sessionId] = session;
  }
  return {
    version: LEDGER_VERSION,
    sessions,
  };
}
function getOrCreateSession(state, params) {
  const now = state.now();
  const existing = state.store.sessions[params.sessionId];
  if (!params.reset && existing) {
    existing.sessionKey = params.sessionKey;
    if (params.cwd) existing.cwd = params.cwd;
    existing.complete = existing.complete || params.complete;
    existing.updatedAt = now;
    return existing;
  }
  const session = {
    sessionId: params.sessionId,
    sessionKey: params.sessionKey,
    cwd: params.cwd,
    complete: params.complete,
    createdAt: now,
    updatedAt: now,
    nextSeq: 1,
    events: [],
  };
  state.store.sessions[params.sessionId] = session;
  return session;
}
function trimLedger(state) {
  for (const session of Object.values(state.store.sessions)) {
    if (session.events.length <= state.maxEventsPerSession) continue;
    session.events = session.events.slice(-state.maxEventsPerSession);
    session.complete = false;
  }
  const sessions = Object.values(state.store.sessions);
  if (sessions.length > state.maxSessions)
    for (const session of sessions
      .toSorted((a, b) => b.updatedAt - a.updatedAt)
      .slice(state.maxSessions))
      delete state.store.sessions[session.sessionId];
  let serializedBytes = getSerializedLedgerByteLength(state.store);
  while (serializedBytes > state.maxSerializedBytes) {
    const session = Object.values(state.store.sessions)
      .filter((candidate) => candidate.events.length > 0)
      .toSorted((a, b) => a.updatedAt - b.updatedAt)[0];
    if (!session) break;
    session.events.shift();
    session.complete = false;
    serializedBytes = getSerializedLedgerByteLength(state.store);
  }
  while (serializedBytes > state.maxSerializedBytes) {
    const session = Object.values(state.store.sessions).toSorted(
      (a, b) => a.updatedAt - b.updatedAt,
    )[0];
    if (!session) break;
    delete state.store.sessions[session.sessionId];
    serializedBytes = getSerializedLedgerByteLength(state.store);
  }
}
function appendUpdate(state, params) {
  const session = getOrCreateSession(state, {
    sessionId: params.sessionId,
    sessionKey: params.sessionKey,
    cwd: "",
    complete: false,
  });
  const now = state.now();
  session.updatedAt = now;
  session.events.push({
    seq: session.nextSeq,
    at: now,
    sessionId: params.sessionId,
    sessionKey: params.sessionKey,
    ...(params.runId ? { runId: params.runId } : {}),
    update: cloneJsonValue(params.update),
  });
  session.nextSeq += 1;
  trimLedger(state);
}
function createLedgerApi(params) {
  const buildReplay = (session) => ({
    complete: true,
    sessionId: session.sessionId,
    sessionKey: session.sessionKey,
    events: session.events.map((event) => cloneJsonValue(event)),
  });
  return {
    async startSession(sessionParams) {
      await params.mutate(() => {
        getOrCreateSession(params.state, sessionParams);
        trimLedger(params.state);
      });
    },
    async recordUserPrompt(promptParams) {
      await params.mutate(() => {
        for (const update of createUserPromptUpdates(promptParams.prompt))
          appendUpdate(params.state, {
            sessionId: promptParams.sessionId,
            sessionKey: promptParams.sessionKey,
            runId: promptParams.runId,
            update,
          });
      });
    },
    async recordUpdate(updateParams) {
      await params.mutate(() => {
        appendUpdate(params.state, updateParams);
      });
    },
    async markIncomplete(markParams) {
      await params.mutate(() => {
        const session = params.state.store.sessions[markParams.sessionId];
        if (!session || session.sessionKey !== markParams.sessionKey) return;
        session.complete = false;
        session.updatedAt = params.state.now();
      });
    },
    async readReplay(replayParams) {
      return params.read(() => {
        const session = params.state.store.sessions[replayParams.sessionId];
        if (!session || session.sessionKey !== replayParams.sessionKey || !session.complete)
          return {
            complete: false,
            events: [],
          };
        return buildReplay(session);
      });
    },
    async readReplayBySessionId(replayParams) {
      return params.read(() => {
        const session = params.state.store.sessions[replayParams.sessionId];
        if (!session || !session.complete)
          return {
            complete: false,
            events: [],
          };
        return buildReplay(session);
      });
    },
    async readReplayBySessionKey(replayParams) {
      return params.read(() => {
        const session = Object.values(params.state.store.sessions)
          .filter(
            (candidate) => candidate.sessionKey === replayParams.sessionKey && candidate.complete,
          )
          .toSorted((a, b) => b.updatedAt - a.updatedAt)[0];
        if (!session)
          return {
            complete: false,
            events: [],
          };
        return buildReplay(session);
      });
    },
  };
}
/** Creates an in-memory ACP event ledger for tests and ephemeral runtimes. */
function createInMemoryAcpEventLedger(options = {}) {
  const normalized = normalizeLedgerOptions(options);
  return createLedgerApi({
    state: {
      store: createEmptyStore(),
      ...normalized,
    },
    mutate: async (fn) => {
      fn();
    },
    read: async (fn) => fn(),
  });
}
/** Resolves the legacy file-backed ACP ledger path under the OpenClaw state directory. */
function resolveDefaultAcpEventLedgerPath(env = process.env) {
  return path.join(resolveStateDir(env), "acp", "event-ledger.json");
}
async function fileExists(filePath) {
  try {
    await fs$1.access(filePath);
    return true;
  } catch {
    return false;
  }
}
/** Migrates a legacy file ledger into the SQLite state database, preserving replay order. */
async function migrateFileAcpEventLedgerToSqlite(params) {
  if (!(await fileExists(params.filePath)))
    return {
      importedSessions: 0,
      importedEvents: 0,
    };
  const legacy = await withFileLock(params.filePath, FILE_LEDGER_LOCK_OPTIONS, async () =>
    normalizeStore(await readJsonFile(params.filePath)),
  );
  const sessions = Object.values(legacy.sessions);
  if (sessions.length === 0)
    return {
      importedSessions: 0,
      importedEvents: 0,
    };
  let importedSessions = 0;
  let importedEvents = 0;
  runOpenClawStateWriteTransaction((database) => {
    const sessionExists = database.db.prepare(
      "SELECT 1 FROM acp_replay_sessions WHERE session_id = ?",
    );
    const insertSession = database.db.prepare(`INSERT INTO acp_replay_sessions (
         session_id, session_key, cwd, complete, created_at, updated_at, next_seq
       ) VALUES (?, ?, ?, ?, ?, ?, ?)`);
    const insertEvent = database.db.prepare(`INSERT OR IGNORE INTO acp_replay_events (
         session_id, seq, at, session_key, run_id, update_json
       ) VALUES (?, ?, ?, ?, ?, ?)`);
    for (const session of sessions) {
      if (sessionExists.get(session.sessionId)) continue;
      insertSession.run(
        session.sessionId,
        session.sessionKey,
        session.cwd,
        session.complete ? 1 : 0,
        session.createdAt,
        session.updatedAt,
        session.nextSeq,
      );
      importedSessions++;
      for (const event of session.events) {
        const result = insertEvent.run(
          event.sessionId,
          event.seq,
          event.at,
          event.sessionKey,
          event.runId ?? null,
          JSON.stringify(event.update),
        );
        importedEvents += Number(result.changes);
      }
    }
  }, params);
  if (params.archiveSource !== true || importedSessions === 0)
    return {
      importedSessions,
      importedEvents,
    };
  const archivePath = `${params.filePath}.migrated`;
  try {
    if (!(await fileExists(archivePath))) {
      await fs$1.rename(params.filePath, archivePath);
      return {
        importedSessions,
        importedEvents,
        archived: true,
      };
    }
  } catch {}
  return {
    importedSessions,
    importedEvents,
  };
}
function normalizeSqliteInteger(value) {
  if (typeof value === "bigint") return Number(value);
  return typeof value === "number" ? value : 0;
}
function sqliteRowToLedgerSession(db, row) {
  const events = db
    .prepare(`SELECT session_id, seq, at, session_key, run_id, update_json
         FROM acp_replay_events
        WHERE session_id = ?
        ORDER BY seq ASC`)
    .all(row.session_id)
    .flatMap((eventRow) => {
      const normalized = sqliteRowToLedgerEvent(eventRow);
      return normalized ? [normalized] : [];
    });
  return {
    sessionId: row.session_id,
    sessionKey: row.session_key,
    cwd: row.cwd,
    complete: normalizeSqliteInteger(row.complete) === 1,
    createdAt: normalizeSqliteInteger(row.created_at),
    updatedAt: normalizeSqliteInteger(row.updated_at),
    nextSeq: normalizeSqliteInteger(row.next_seq),
    events,
  };
}
function sqliteRowToLedgerEvent(row) {
  let update;
  try {
    update = JSON.parse(row.update_json);
  } catch {
    return;
  }
  return normalizeEvent({
    seq: normalizeSqliteInteger(row.seq),
    at: normalizeSqliteInteger(row.at),
    sessionId: row.session_id,
    sessionKey: row.session_key,
    ...(row.run_id ? { runId: row.run_id } : {}),
    update,
  });
}
function readSqliteSessionById(db, sessionId) {
  const row = db
    .prepare(`SELECT session_id, session_key, cwd, complete, created_at, updated_at, next_seq
         FROM acp_replay_sessions
        WHERE session_id = ?`)
    .get(sessionId);
  return row ? sqliteRowToLedgerSession(db, row) : void 0;
}
function readLatestCompleteSqliteSessionByKey(db, sessionKey) {
  const row = db
    .prepare(`SELECT session_id, session_key, cwd, complete, created_at, updated_at, next_seq
         FROM acp_replay_sessions
        WHERE session_key = ? AND complete = 1
        ORDER BY updated_at DESC, session_id ASC
        LIMIT 1`)
    .get(sessionKey);
  return row ? sqliteRowToLedgerSession(db, row) : void 0;
}
function upsertSqliteSession(db, state, params) {
  const now = state.now();
  const existing = readSqliteSessionById(db, params.sessionId);
  if (!params.reset && existing) {
    const cwd = params.cwd || existing.cwd;
    const complete = existing.complete || params.complete ? 1 : 0;
    db.prepare(`UPDATE acp_replay_sessions
          SET estimated_bytes = estimated_bytes - length(session_key) - length(cwd) + ?,
              session_key = ?, cwd = ?, complete = ?, updated_at = ?
        WHERE session_id = ?`).run(
      params.sessionKey.length + cwd.length,
      params.sessionKey,
      cwd,
      complete,
      now,
      params.sessionId,
    );
    return {
      ...existing,
      sessionKey: params.sessionKey,
      cwd,
      complete: complete === 1,
      updatedAt: now,
    };
  }
  if (params.reset)
    db.prepare("DELETE FROM acp_replay_events WHERE session_id = ?").run(params.sessionId);
  const rowBytes = estimateSessionRowBytes({
    sessionId: params.sessionId,
    sessionKey: params.sessionKey,
    cwd: params.cwd,
  });
  db.prepare(`INSERT INTO acp_replay_sessions (
       session_id, session_key, cwd, complete, created_at, updated_at, next_seq, estimated_bytes
     ) VALUES (?, ?, ?, ?, ?, ?, 1, ?)
     ON CONFLICT(session_id) DO UPDATE SET
       session_key = excluded.session_key,
       cwd = excluded.cwd,
       complete = excluded.complete,
       updated_at = excluded.updated_at,
       next_seq = excluded.next_seq,
       -- Row overhead plus whatever event rows still exist: exact after a
       -- reset (events deleted, sum is 0) and on any conflicting rewrite.
       estimated_bytes = excluded.estimated_bytes + COALESCE(
         (SELECT SUM(e.estimated_bytes) FROM acp_replay_events e
           WHERE e.session_id = excluded.session_id), 0)`).run(
    params.sessionId,
    params.sessionKey,
    params.cwd,
    params.complete ? 1 : 0,
    now,
    now,
    rowBytes,
  );
  return {
    sessionId: params.sessionId,
    sessionKey: params.sessionKey,
    cwd: params.cwd,
    complete: params.complete,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    nextSeq: 1,
    events: [],
  };
}
function estimateSqliteLedgerBytes(db) {
  return normalizeSqliteInteger(
    db.prepare("SELECT COALESCE(SUM(estimated_bytes), 0) AS total FROM acp_replay_sessions").get()
      ?.total ?? 0,
  );
}
function estimateSessionRowBytes(params) {
  return params.sessionId.length + params.sessionKey.length + params.cwd.length + 32;
}
function estimateEventRowBytes(params) {
  return (
    params.sessionId.length +
    params.sessionKey.length +
    params.updateJson.length +
    (params.runId?.length ?? 0) +
    32
  );
}
const LEDGER_TRIM_EVENT_BATCH = 64;
function deleteOldestSqliteEvents(db, sessionId, limit) {
  const rows = db
    .prepare(`DELETE FROM acp_replay_events
        WHERE session_id = ?
          AND seq IN (
            SELECT seq FROM acp_replay_events
             WHERE session_id = ?
             ORDER BY seq ASC
             LIMIT ?
          )
        RETURNING estimated_bytes`)
    .all(sessionId, sessionId, limit);
  if (rows.length === 0) return 0;
  const freed = rows.reduce((sum, row) => sum + normalizeSqliteInteger(row.estimated_bytes), 0);
  db.prepare(`UPDATE acp_replay_sessions
        SET estimated_bytes = MAX(0, estimated_bytes - ?), complete = 0
      WHERE session_id = ?`).run(freed, sessionId);
  return rows.length;
}
function trimSqliteLedger(db, state) {
  const overCapSessions = db
    .prepare(`SELECT session_id, event_count FROM (
         SELECT s.session_id AS session_id, COUNT(e.seq) AS event_count
           FROM acp_replay_sessions s
           LEFT JOIN acp_replay_events e ON e.session_id = s.session_id
          GROUP BY s.session_id
       ) WHERE event_count > ?`)
    .all(state.maxEventsPerSession);
  for (const row of overCapSessions) {
    const overage = normalizeSqliteInteger(row.event_count) - state.maxEventsPerSession;
    if (overage > 0) deleteOldestSqliteEvents(db, row.session_id, overage);
  }
  const oldSessions = db
    .prepare(`SELECT session_id
         FROM acp_replay_sessions
        ORDER BY updated_at DESC, session_id ASC
        LIMIT -1 OFFSET ?`)
    .all(state.maxSessions);
  for (const session of oldSessions)
    db.prepare("DELETE FROM acp_replay_sessions WHERE session_id = ?").run(session.session_id);
  let serializedBytes = estimateSqliteLedgerBytes(db);
  while (serializedBytes > state.maxSerializedBytes) {
    const session = db
      .prepare(`SELECT session_id
           FROM acp_replay_sessions
          ORDER BY updated_at ASC, session_id ASC
          LIMIT 1`)
      .get();
    if (!session) break;
    if (deleteOldestSqliteEvents(db, session.session_id, LEDGER_TRIM_EVENT_BATCH) === 0)
      db.prepare("DELETE FROM acp_replay_sessions WHERE session_id = ?").run(session.session_id);
    serializedBytes = estimateSqliteLedgerBytes(db);
  }
}
function appendSqliteUpdate(db, state, params) {
  const session = upsertSqliteSession(db, state, {
    sessionId: params.sessionId,
    sessionKey: params.sessionKey,
    cwd: "",
    complete: false,
  });
  const now = state.now();
  const updateJson = JSON.stringify(cloneJsonValue(params.update));
  const eventBytes = estimateEventRowBytes({
    sessionId: params.sessionId,
    sessionKey: params.sessionKey,
    ...(params.runId !== void 0 ? { runId: params.runId } : {}),
    updateJson,
  });
  db.prepare(`INSERT INTO acp_replay_events (session_id, seq, at, session_key, run_id, update_json, estimated_bytes)
     VALUES (?, ?, ?, ?, ?, ?, ?)`).run(
    params.sessionId,
    session.nextSeq,
    now,
    params.sessionKey,
    params.runId ?? null,
    updateJson,
    eventBytes,
  );
  db.prepare(`UPDATE acp_replay_sessions
        SET estimated_bytes = estimated_bytes - length(session_key) + ?,
            session_key = ?, updated_at = ?, next_seq = ?
      WHERE session_id = ?`).run(
    params.sessionKey.length + eventBytes,
    params.sessionKey,
    now,
    session.nextSeq + 1,
    params.sessionId,
  );
  trimSqliteLedger(db, state);
}
function buildSqliteReplay(session) {
  if (!session?.complete)
    return {
      complete: false,
      events: [],
    };
  return {
    complete: true,
    sessionId: session.sessionId,
    sessionKey: session.sessionKey,
    events: session.events.map((event) => cloneJsonValue(event)),
  };
}
/** Creates the SQLite-backed ACP event ledger used by the state database. */
function createSqliteAcpEventLedger(params = {}) {
  const normalized = normalizeLedgerOptions(params);
  const dbOptions = {
    env: params.env,
    path: params.path,
  };
  const state = { ...normalized };
  const mutate = (fn) => runOpenClawStateWriteTransaction((database) => fn(database.db), dbOptions);
  const read = (fn) => fn(openOpenClawStateDatabase(dbOptions).db);
  return {
    async startSession(sessionParams) {
      mutate((db) => {
        upsertSqliteSession(db, state, sessionParams);
        trimSqliteLedger(db, state);
      });
    },
    async recordUserPrompt(promptParams) {
      mutate((db) => {
        for (const update of createUserPromptUpdates(promptParams.prompt))
          appendSqliteUpdate(db, state, {
            sessionId: promptParams.sessionId,
            sessionKey: promptParams.sessionKey,
            runId: promptParams.runId,
            update,
          });
      });
    },
    async recordUpdate(updateParams) {
      mutate((db) => {
        appendSqliteUpdate(db, state, updateParams);
      });
    },
    async markIncomplete(markParams) {
      mutate((db) => {
        db.prepare(`UPDATE acp_replay_sessions
              SET complete = 0, updated_at = ?
            WHERE session_id = ? AND session_key = ?`).run(
          state.now(),
          markParams.sessionId,
          markParams.sessionKey,
        );
      });
    },
    async readReplay(replayParams) {
      return read((db) => {
        const session = readSqliteSessionById(db, replayParams.sessionId);
        if (session?.sessionKey !== replayParams.sessionKey)
          return {
            complete: false,
            events: [],
          };
        return buildSqliteReplay(session);
      });
    },
    async readReplayBySessionId(replayParams) {
      return read((db) => buildSqliteReplay(readSqliteSessionById(db, replayParams.sessionId)));
    },
    async readReplayBySessionKey(replayParams) {
      return read((db) =>
        buildSqliteReplay(readLatestCompleteSqliteSessionByKey(db, replayParams.sessionKey)),
      );
    },
  };
}
//#endregion
//#region src/infra/fixed-window-rate-limit.ts
/** Normalizes rate-limit numeric config to a finite integer with a lower bound. */
function resolveFixedWindowRateLimitInteger(value, fallback, params) {
  const candidate = typeof value === "number" && Number.isFinite(value) ? value : fallback;
  return Math.max(params.min, Math.floor(candidate));
}
/** Creates a fixed-window counter that reports allowance, remaining quota, and retry delay. */
function createFixedWindowRateLimiter(params) {
  const maxRequests = resolveFixedWindowRateLimitInteger(params.maxRequests, 1, { min: 1 });
  const windowMs = resolveFixedWindowRateLimitInteger(params.windowMs, 1, { min: 1 });
  const now = params.now ?? Date.now;
  let count = 0;
  let windowStartMs = 0;
  return {
    consume() {
      const nowMs = now();
      if (nowMs - windowStartMs >= windowMs) {
        windowStartMs = nowMs;
        count = 0;
      }
      if (count >= maxRequests)
        return {
          allowed: false,
          retryAfterMs: Math.max(0, windowStartMs + windowMs - nowMs),
          remaining: 0,
        };
      count += 1;
      return {
        allowed: true,
        retryAfterMs: 0,
        remaining: Math.max(0, maxRequests - count),
      };
    },
    reset() {
      count = 0;
      windowStartMs = 0;
    },
  };
}
//#endregion
//#region src/acp/event-mapper.ts
const TOOL_LOCATION_PATH_KEYS = [
  "path",
  "filePath",
  "file_path",
  "targetPath",
  "target_path",
  "targetFile",
  "target_file",
  "sourcePath",
  "source_path",
  "destinationPath",
  "destination_path",
  "oldPath",
  "old_path",
  "newPath",
  "new_path",
  "outputPath",
  "output_path",
  "inputPath",
  "input_path",
];
const TOOL_LOCATION_LINE_KEYS = ["line", "lineNumber", "line_number", "startLine", "start_line"];
const TOOL_RESULT_PATH_MARKER_RE = /^(?:FILE|MEDIA):(.+)$/gm;
const TOOL_LOCATION_MAX_DEPTH = 4;
const TOOL_LOCATION_MAX_NODES = 100;
const INLINE_CONTROL_ESCAPE_MAP = {
  "\0": "\\0",
  "\r": "\\r",
  "\n": "\\n",
  "	": "\\t",
  "\v": "\\v",
  "\f": "\\f",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029",
};
function escapeInlineControlChars(value) {
  let escaped = "";
  for (const char of value) {
    const codePoint = char.codePointAt(0);
    if (codePoint === void 0) {
      escaped += char;
      continue;
    }
    if (
      !(
        codePoint <= 31 ||
        (codePoint >= 127 && codePoint <= 159) ||
        codePoint === 8232 ||
        codePoint === 8233
      )
    ) {
      escaped += char;
      continue;
    }
    const mapped = INLINE_CONTROL_ESCAPE_MAP[char];
    if (mapped) {
      escaped += mapped;
      continue;
    }
    escaped +=
      codePoint <= 255
        ? `\\x${codePoint.toString(16).padStart(2, "0")}`
        : `\\u${codePoint.toString(16).padStart(4, "0")}`;
  }
  return escaped;
}
function escapeResourceTitle(value) {
  return escapeInlineControlChars(value).replace(/[()[\]]/g, (char) => `\\${char}`);
}
function normalizeToolLocationPath(value) {
  const trimmed = value.trim();
  if (
    !trimmed ||
    trimmed.length > 4096 ||
    trimmed.includes("\0") ||
    trimmed.includes("\r") ||
    trimmed.includes("\n")
  )
    return;
  if (hasHttpUrlPrefix(trimmed)) return;
  if (/^file:\/\//i.test(trimmed))
    try {
      const parsed = new URL(trimmed);
      return decodeURIComponent(parsed.pathname || "") || void 0;
    } catch {
      return;
    }
  return trimmed;
}
function normalizeToolLocationLine(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) return;
  const line = Math.floor(value);
  return line > 0 ? line : void 0;
}
function extractToolLocationLine(record) {
  for (const key of TOOL_LOCATION_LINE_KEYS) {
    const line = normalizeToolLocationLine(record[key]);
    if (line !== void 0) return line;
  }
}
function addToolLocation(locations, rawPath, line) {
  const path = normalizeToolLocationPath(rawPath);
  if (!path) return;
  for (const [existingKey, existing] of locations.entries()) {
    if (existing.path !== path) continue;
    if (line === void 0 || existing.line === line) return;
    if (existing.line === void 0) locations.delete(existingKey);
  }
  const locationKey = `${path}:${line ?? ""}`;
  if (locations.has(locationKey)) return;
  locations.set(
    locationKey,
    line
      ? {
          path,
          line,
        }
      : { path },
  );
}
function collectLocationsFromTextMarkers(text, locations) {
  for (const match of text.matchAll(TOOL_RESULT_PATH_MARKER_RE)) {
    const candidate = normalizeOptionalString(match[1]);
    if (candidate) addToolLocation(locations, candidate);
  }
}
function collectToolLocations(value, locations, state, depth) {
  if (state.visited >= TOOL_LOCATION_MAX_NODES || depth > TOOL_LOCATION_MAX_DEPTH) return;
  state.visited += 1;
  if (typeof value === "string") {
    collectLocationsFromTextMarkers(value, locations);
    return;
  }
  if (!value || typeof value !== "object") return;
  if (Array.isArray(value)) {
    for (const item of value) {
      collectToolLocations(item, locations, state, depth + 1);
      if (state.visited >= TOOL_LOCATION_MAX_NODES) return;
    }
    return;
  }
  const record = value;
  const line = extractToolLocationLine(record);
  for (const key of TOOL_LOCATION_PATH_KEYS) {
    const rawPath = record[key];
    if (typeof rawPath === "string") addToolLocation(locations, rawPath, line);
  }
  const content = Array.isArray(record.content) ? record.content : void 0;
  if (content)
    for (const block of content) {
      const entry = asOptionalRecord(block);
      if (entry?.type === "text" && typeof entry.text === "string")
        collectLocationsFromTextMarkers(entry.text, locations);
    }
  for (const [key, nested] of Object.entries(record)) {
    if (key === "content") continue;
    collectToolLocations(nested, locations, state, depth + 1);
    if (state.visited >= TOOL_LOCATION_MAX_NODES) return;
  }
}
/** Extracts bounded text content from an ACP prompt block list. */
function extractTextFromPrompt(prompt, maxBytes) {
  const parts = [];
  let totalBytes = 0;
  for (const block of prompt) {
    let blockText;
    if (block.type === "text") blockText = block.text;
    else if (block.type === "resource" && "text" in block.resource && block.resource.text)
      blockText = block.resource.text;
    else if (block.type === "resource_link") {
      const title = block.title ? ` (${escapeResourceTitle(block.title)})` : "";
      const uri = block.uri ? escapeInlineControlChars(block.uri) : "";
      blockText = uri ? `[Resource link${title}] ${uri}` : `[Resource link${title}]`;
    }
    if (blockText !== void 0) {
      if (maxBytes !== void 0) {
        const separatorBytes = parts.length > 0 ? 1 : 0;
        totalBytes += separatorBytes + Buffer.byteLength(blockText, "utf-8");
        if (totalBytes > maxBytes)
          throw new Error(`Prompt exceeds maximum allowed size of ${maxBytes} bytes`);
      }
      parts.push(blockText);
    }
  }
  return parts.join("\n");
}
/** Extracts image/file prompt blocks into Gateway attachment payloads. */
function extractAttachmentsFromPrompt(prompt) {
  const attachments = [];
  for (const block of prompt) {
    if (block.type !== "image") continue;
    if (!block.data || !block.mimeType) continue;
    attachments.push({
      type: "image",
      mimeType: block.mimeType,
      content: block.data,
    });
  }
  return attachments;
}
/** Builds the display title used for ACP tool-call events. */
function formatToolTitle(name, args) {
  const base = name ?? "tool";
  if (!args || Object.keys(args).length === 0) return base;
  return escapeInlineControlChars(
    `${base}: ${Object.entries(args)
      .map(([key, value]) => {
        const raw = typeof value === "string" ? value : JSON.stringify(value);
        return `${key}: ${raw.length > 100 ? `${truncateUtf16Safe(raw, 100)}...` : raw}`;
      })
      .join(", ")}`,
  );
}
/** Infers ACP tool kind from a normalized tool name. */
function inferToolKind(name) {
  if (!name) return "other";
  const normalized = normalizeLowercaseStringOrEmpty(name);
  if (normalized.includes("read")) return "read";
  if (normalized.includes("write") || normalized.includes("edit")) return "edit";
  if (normalized.includes("delete") || normalized.includes("remove")) return "delete";
  if (normalized.includes("move") || normalized.includes("rename")) return "move";
  if (normalized.includes("search") || normalized.includes("find")) return "search";
  if (normalized.includes("exec") || normalized.includes("run") || normalized.includes("bash"))
    return "execute";
  if (normalized.includes("fetch") || normalized.includes("http")) return "fetch";
  return "other";
}
/** Extracts textual ACP tool-call content from unknown runtime payloads. */
function extractToolCallContent(value) {
  if (hasNonEmptyString(value))
    return value.trim()
      ? [
          {
            type: "content",
            content: {
              type: "text",
              text: value,
            },
          },
        ]
      : void 0;
  const record = asOptionalRecord(value);
  if (!record) return;
  const contents = [];
  const blocks = Array.isArray(record.content) ? record.content : [];
  for (const block of blocks) {
    const entry = asOptionalRecord(block);
    if (entry?.type === "text" && hasNonEmptyString(entry.text))
      contents.push({
        type: "content",
        content: {
          type: "text",
          text: entry.text,
        },
      });
  }
  if (contents.length > 0) return contents;
  const fallbackText =
    readStringValue(record.text) ??
    readStringValue(record.message) ??
    readStringValue(record.error);
  if (!hasNonEmptyString(fallbackText)) return;
  return [
    {
      type: "content",
      content: {
        type: "text",
        text: fallbackText,
      },
    },
  ];
}
/** Extracts bounded file locations from nested tool-call payloads. */
function extractToolCallLocations(...values) {
  const locations = /* @__PURE__ */ new Map();
  for (const value of values) collectToolLocations(value, locations, { visited: 0 }, 0);
  return locations.size > 0 ? [...locations.values()] : void 0;
}
//#endregion
//#region src/acp/permission-relay.ts
const FALLBACK_EXEC_APPROVAL_DECISIONS = ["allow-once", "deny"];
function normalizeGatewayExecApprovalDecision(value) {
  if (value === "allow-once" || value === "allow-always" || value === "deny") return value;
}
/** Normalizes allowed Gateway exec approval decisions with a conservative fallback set. */
function normalizeGatewayExecApprovalDecisions(value) {
  const normalized = Array.isArray(value)
    ? value.map(normalizeGatewayExecApprovalDecision).filter((decision) => Boolean(decision))
    : [];
  return normalized.length > 0 ? normalized : [...FALLBACK_EXEC_APPROVAL_DECISIONS];
}
/** Converts Gateway exec decisions into ACP permission options. */
function buildAcpPermissionOptions(decisions) {
  const unique = new Set(decisions);
  const options = [];
  if (unique.has("allow-once"))
    options.push({
      optionId: "allow-once",
      name: "Allow once",
      kind: "allow_once",
    });
  if (unique.has("allow-always"))
    options.push({
      optionId: "allow-always",
      name: "Allow always",
      kind: "allow_always",
    });
  if (unique.has("deny"))
    options.push({
      optionId: "deny",
      name: "Deny",
      kind: "reject_once",
    });
  return options.length > 0 ? options : buildAcpPermissionOptions(FALLBACK_EXEC_APPROVAL_DECISIONS);
}
/** Parses legacy Gateway approval event data into ACP relay state. */
function parseGatewayExecApprovalEventData(data) {
  if (data.phase !== "requested" || data.kind !== "exec" || data.status !== "pending") return null;
  const approvalId = normalizeOptionalString(data.approvalId);
  if (!approvalId) return null;
  return {
    approvalId,
    command: normalizeOptionalString(data.command),
    host: normalizeOptionalString(data.host),
    title: normalizeOptionalString(data.title),
    toolCallId: normalizeOptionalString(data.toolCallId),
  };
}
/** Parses structured Gateway approval-request payloads into ACP relay state. */
function parseGatewayExecApprovalRequestEventPayload(payload) {
  const approvalId = normalizeOptionalString(payload.id);
  const request = payload.request;
  if (!approvalId || !request || typeof request !== "object" || Array.isArray(request)) return null;
  const requestRecord = request;
  return {
    approvalId,
    command:
      normalizeOptionalString(requestRecord.command) ??
      normalizeOptionalString(requestRecord.commandPreview),
    host: normalizeOptionalString(requestRecord.host),
  };
}
/** Builds the ACP request_permission payload shown to a client. */
function buildAcpPermissionRequest(params) {
  const command =
    normalizeOptionalString(params.details?.commandText) ??
    normalizeOptionalString(params.details?.commandPreview) ??
    params.event.command;
  const host = normalizeOptionalString(params.details?.host) ?? params.event.host;
  const decisions = normalizeGatewayExecApprovalDecisions(params.details?.allowedDecisions);
  const rawInput = {
    name: "exec",
    approvalId: params.event.approvalId,
  };
  if (command) rawInput.command = command;
  if (host) rawInput.host = host;
  return {
    sessionId: params.sessionId,
    toolCall: {
      toolCallId: params.event.toolCallId ?? `exec:${params.event.approvalId}`,
      title: params.event.title ?? "Command approval requested",
      kind: "execute",
      status: "pending",
      rawInput,
      _meta: {
        toolName: "exec",
        approvalId: params.event.approvalId,
      },
    },
    options: buildAcpPermissionOptions(decisions),
  };
}
/** Maps an ACP permission response back to the Gateway exec approval decision. */
function resolveGatewayDecisionFromPermissionOutcome(response, options) {
  const outcome = response?.outcome;
  if (!outcome || outcome.outcome !== "selected") return;
  return normalizeGatewayExecApprovalDecision(
    options.find((option) => option.optionId === outcome.optionId)?.optionId,
  );
}
//#endregion
//#region src/acp/session-mapper.ts
/** Resolves ACP request metadata into OpenClaw Gateway session keys and reset behavior. */
/** Parses ACP request metadata into OpenClaw session routing hints. */
function parseSessionMeta(meta) {
  if (!meta || typeof meta !== "object") return {};
  const record = meta;
  return {
    sessionKey: readString(record, ["sessionKey", "session", "key"]),
    sessionLabel: readString(record, ["sessionLabel", "label"]),
    resetSession: readBool(record, ["resetSession", "reset"]),
    requireExisting: readBool(record, ["requireExistingSession", "requireExisting"]),
    prefixCwd: readBool(record, ["prefixCwd"]),
  };
}
/** Resolves the Gateway session key for an ACP request using metadata, defaults, or fallback. */
async function resolveSessionKey(params) {
  const requestedLabel = params.meta.sessionLabel ?? params.opts.defaultSessionLabel;
  const requestedKey = params.meta.sessionKey ?? params.opts.defaultSessionKey;
  const requireExisting =
    params.meta.requireExisting ?? params.opts.requireExistingSession ?? false;
  if (params.meta.sessionLabel) {
    const resolved = await params.gateway.request("sessions.resolve", {
      label: params.meta.sessionLabel,
    });
    if (!resolved?.key)
      throw new Error(`Unable to resolve session label: ${params.meta.sessionLabel}`);
    return resolved.key;
  }
  if (params.meta.sessionKey) {
    if (!requireExisting) return params.meta.sessionKey;
    const resolved = await params.gateway.request("sessions.resolve", {
      key: params.meta.sessionKey,
    });
    if (!resolved?.key) throw new Error(`Session key not found: ${params.meta.sessionKey}`);
    return resolved.key;
  }
  if (requestedLabel) {
    const resolved = await params.gateway.request("sessions.resolve", { label: requestedLabel });
    if (!resolved?.key) throw new Error(`Unable to resolve session label: ${requestedLabel}`);
    return resolved.key;
  }
  if (requestedKey) {
    if (!requireExisting) return requestedKey;
    const resolved = await params.gateway.request("sessions.resolve", { key: requestedKey });
    if (!resolved?.key) throw new Error(`Session key not found: ${requestedKey}`);
    return resolved.key;
  }
  return params.fallbackKey;
}
/** Sends a Gateway session reset when ACP metadata or server defaults request it. */
async function resetSessionIfNeeded(params) {
  if (!(params.meta.resetSession ?? params.opts.resetSession ?? false)) return;
  await params.gateway.request("sessions.reset", { key: params.sessionKey });
}
//#endregion
//#region src/acp/translator.presentation.ts
/** ACP config option ids exposed to compatible ACP clients. */
const ACP_THOUGHT_LEVEL_CONFIG_ID = "thought_level";
const ACP_FAST_MODE_CONFIG_ID = "fast_mode";
const ACP_VERBOSE_LEVEL_CONFIG_ID = "verbose_level";
const ACP_TRACE_LEVEL_CONFIG_ID = "trace_level";
const ACP_REASONING_LEVEL_CONFIG_ID = "reasoning_level";
const ACP_RESPONSE_USAGE_CONFIG_ID = "response_usage";
const ACP_ELEVATED_LEVEL_CONFIG_ID = "elevated_level";
const ACP_TIMEOUT_CONFIG_ID = "timeout";
const ACP_TIMEOUT_SECONDS_CONFIG_ID = "timeout_seconds";
function formatThinkingLevelName(level) {
  switch (level) {
    case "xhigh":
      return "Extra High";
    case "adaptive":
      return "Adaptive";
    default:
      return level.length > 0 ? `${level.charAt(0).toUpperCase()}${level.slice(1)}` : "Unknown";
  }
}
function buildThinkingModeDescription(level) {
  if (level === "adaptive") return "Use the Gateway session default thought level.";
}
function formatConfigValueName(value) {
  switch (value) {
    case "xhigh":
      return "Extra High";
    default:
      return value.length > 0 ? `${value.charAt(0).toUpperCase()}${value.slice(1)}` : "Unknown";
  }
}
function buildSelectConfigOption(params) {
  return {
    type: "select",
    id: params.id,
    name: params.name,
    category: params.category,
    description: params.description,
    currentValue: params.currentValue,
    options: params.values.map((value) => ({
      value,
      name: formatConfigValueName(value),
    })),
  };
}
function buildSessionPresentation(params) {
  const row = {
    ...params.row,
    ...params.overrides,
  };
  const availableLevelIds = row.thinkingLevels?.map((level) => level.id) ?? [
    ...BASE_THINKING_LEVELS,
  ];
  const currentModeId = normalizeOptionalString(row.thinkingLevel) || "adaptive";
  const currentFastMode = normalizeFastMode(row.effectiveFastMode ?? row.fastMode) ?? false;
  if (!availableLevelIds.includes(currentModeId)) availableLevelIds.push(currentModeId);
  const modes = {
    currentModeId,
    availableModes: availableLevelIds.map((level) => ({
      id: level,
      name: formatThinkingLevelName(level),
      description: buildThinkingModeDescription(level),
    })),
  };
  return {
    configOptions: [
      buildSelectConfigOption({
        id: ACP_THOUGHT_LEVEL_CONFIG_ID,
        name: "Thought level",
        category: "thought_level",
        description:
          "Controls how much deliberate reasoning OpenClaw requests from the Gateway model.",
        currentValue: currentModeId,
        values: availableLevelIds,
      }),
      buildSelectConfigOption({
        id: ACP_FAST_MODE_CONFIG_ID,
        name: "Fast mode",
        description: "Controls whether OpenAI sessions use the Gateway fast-mode profile.",
        currentValue: currentFastMode === "auto" ? "auto" : currentFastMode ? "on" : "off",
        values: ["off", "auto", "on"],
      }),
      buildSelectConfigOption({
        id: ACP_VERBOSE_LEVEL_CONFIG_ID,
        name: "Tool verbosity",
        description:
          "Controls how much tool progress and output detail OpenClaw keeps enabled for the session.",
        currentValue: normalizeOptionalString(row.verboseLevel) || "off",
        values: ["off", "on", "full"],
      }),
      buildSelectConfigOption({
        id: ACP_TRACE_LEVEL_CONFIG_ID,
        name: "Plugin trace",
        description: "Controls whether plugin-owned trace lines are shown for the session.",
        currentValue: normalizeOptionalString(row.traceLevel) || "off",
        values: ["off", "on"],
      }),
      buildSelectConfigOption({
        id: ACP_REASONING_LEVEL_CONFIG_ID,
        name: "Reasoning stream",
        description:
          "Controls whether reasoning-capable models emit reasoning text for the session.",
        currentValue: normalizeOptionalString(row.reasoningLevel) || "off",
        values: ["off", "on", "stream"],
      }),
      buildSelectConfigOption({
        id: ACP_RESPONSE_USAGE_CONFIG_ID,
        name: "Usage detail",
        description:
          "Controls how much usage information OpenClaw attaches to responses for the session. 'inherit' follows the configured default; 'off' explicitly disables it for this session.",
        currentValue: normalizeOptionalString(row.responseUsage) || "inherit",
        values: ["inherit", "off", "tokens", "full"],
      }),
      buildSelectConfigOption({
        id: ACP_ELEVATED_LEVEL_CONFIG_ID,
        name: "Elevated actions",
        description: "Controls how aggressively the session allows elevated execution behavior.",
        currentValue: normalizeOptionalString(row.elevatedLevel) || "off",
        values: ["off", "on", "ask", "full"],
      }),
    ],
    modes,
  };
}
function buildSessionMetadata(params) {
  return {
    title:
      normalizeOptionalString(params.row?.derivedTitle) ||
      normalizeOptionalString(params.row?.displayName) ||
      normalizeOptionalString(params.row?.label) ||
      params.sessionKey,
    updatedAt: timestampMsToIsoString(params.row?.updatedAt) ?? null,
    _meta: toAcpSessionLineageMeta(
      params.row ?? {
        key: params.sessionKey,
        kind: "unknown",
      },
    ),
  };
}
function buildSessionUsageSnapshot(row) {
  const totalTokens = row?.totalTokens;
  const contextTokens = row?.contextTokens;
  if (
    row?.totalTokensFresh !== true ||
    typeof totalTokens !== "number" ||
    !Number.isFinite(totalTokens) ||
    typeof contextTokens !== "number" ||
    !Number.isFinite(contextTokens) ||
    contextTokens <= 0
  )
    return;
  const size = Math.max(0, Math.floor(contextTokens));
  return {
    size,
    used: Math.max(0, Math.min(Math.floor(totalTokens), size)),
  };
}
//#endregion
//#region src/acp/translator.replay.ts
function extractReplayChunks(message) {
  const role = typeof message.role === "string" ? message.role : "";
  if (role !== "user" && role !== "assistant") return [];
  if (typeof message.content === "string")
    return message.content.length > 0
      ? [
          {
            sessionUpdate: role === "user" ? "user_message_chunk" : "agent_message_chunk",
            text: message.content,
          },
        ]
      : [];
  if (!Array.isArray(message.content)) return [];
  const replayChunks = [];
  for (const block of message.content) {
    if (!block || typeof block !== "object" || Array.isArray(block)) continue;
    const typedBlock = block;
    if (typedBlock.type === "text" && typeof typedBlock.text === "string" && typedBlock.text) {
      replayChunks.push({
        sessionUpdate: role === "user" ? "user_message_chunk" : "agent_message_chunk",
        text: typedBlock.text,
      });
      continue;
    }
    if (
      role === "assistant" &&
      typedBlock.type === "thinking" &&
      typeof typedBlock.thinking === "string" &&
      typedBlock.thinking
    )
      replayChunks.push({
        sessionUpdate: "agent_thought_chunk",
        text: typedBlock.thinking,
      });
  }
  return replayChunks;
}
//#endregion
//#region src/acp/translator.session-list.ts
/** Cursor and pagination helpers for ACP session/list requests. */
const ACP_LIST_SESSIONS_DEFAULT_PAGE_SIZE = 100;
const ACP_LIST_SESSIONS_MAX_PAGE_SIZE = 100;
const ACP_LIST_SESSIONS_MAX_CURSOR_OFFSET = 1e4;
/** Maximum rows fetched to satisfy ACP session-list pagination plus next-page detection. */
const ACP_LIST_SESSIONS_MAX_FETCH_LIMIT = 10101;
/** Encodes an ACP session-list cursor as base64url JSON. */
function encodeListSessionsCursor(cursor) {
  return Buffer.from(
    JSON.stringify({
      v: 1,
      ...cursor,
    }),
    "utf8",
  ).toString("base64url");
}
/** Decodes and validates an ACP session-list cursor, defaulting to the first page. */
function decodeListSessionsCursor(value) {
  if (!value) return { offset: 0 };
  let parsed;
  try {
    parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
  } catch {
    throw new Error("Invalid ACP session list cursor.");
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
    throw new Error("Invalid ACP session list cursor.");
  const record = parsed;
  if (record.v !== 1) throw new Error("Unsupported ACP session list cursor.");
  if (
    typeof record.offset !== "number" ||
    !Number.isInteger(record.offset) ||
    record.offset < 0 ||
    record.offset > ACP_LIST_SESSIONS_MAX_CURSOR_OFFSET
  )
    throw new Error("Invalid ACP session list cursor offset.");
  const cwd = normalizeOptionalString(record.cwd);
  return {
    offset: record.offset,
    ...(cwd ? { cwd } : {}),
  };
}
/** Throws when an ACP method receives a relative cwd filter/path. */
function assertAbsoluteCwd(cwd, method) {
  if (!path.isAbsolute(cwd)) throw new Error(`ACP ${method} requires an absolute cwd.`);
}
/** Resolves requested ACP session-list page size with bridge limits. */
function resolveListSessionsPageSize(meta) {
  const requested = readNumber(meta, ["limit", "pageSize"]);
  if (requested === void 0) return ACP_LIST_SESSIONS_DEFAULT_PAGE_SIZE;
  return Math.min(ACP_LIST_SESSIONS_MAX_PAGE_SIZE, Math.max(1, Math.floor(requested)));
}
//#endregion
//#region src/acp/translator.session-updates.ts
function resolveLedgerSessionId(session) {
  return session.ledgerSessionId ?? session.sessionId;
}
/** Helper that keeps ACP client updates and replay ledger writes in sync. */
var AcpTranslatorSessionUpdates = class {
  constructor(options) {
    this.options = options;
    this.stopped = false;
  }
  stop() {
    this.stopped = true;
  }
  async startLedgerSession(session, options) {
    if (this.stopped) return;
    try {
      await this.options.eventLedger.startSession({
        sessionId: resolveLedgerSessionId(session),
        sessionKey: session.sessionKey,
        cwd: session.cwd,
        complete: options.complete,
        ...(options.reset ? { reset: true } : {}),
      });
    } catch (err) {
      this.options.log(
        `event ledger session start failed for ${session.sessionId}: ${String(err)}`,
      );
    }
  }
  async readLedgerReplay(params) {
    if (this.stopped)
      return {
        complete: false,
        events: [],
      };
    try {
      return await this.options.eventLedger.readReplay(params);
    } catch (err) {
      this.options.log(`event ledger replay fallback for ${params.sessionId}: ${String(err)}`);
      return {
        complete: false,
        events: [],
      };
    }
  }
  async readLedgerReplayBySessionId(sessionId) {
    if (this.stopped)
      return {
        complete: false,
        events: [],
      };
    try {
      return await this.options.eventLedger.readReplayBySessionId({ sessionId });
    } catch (err) {
      this.options.log(`event ledger exact replay fallback for ${sessionId}: ${String(err)}`);
      return {
        complete: false,
        events: [],
      };
    }
  }
  async readLedgerReplayBySessionKey(sessionKey) {
    if (this.stopped)
      return {
        complete: false,
        events: [],
      };
    try {
      return await this.options.eventLedger.readReplayBySessionKey({ sessionKey });
    } catch (err) {
      this.options.log(
        `event ledger session-key replay fallback for ${sessionKey}: ${String(err)}`,
      );
      return {
        complete: false,
        events: [],
      };
    }
  }
  async recordUserPrompt(session, runId, prompt) {
    if (this.stopped) return;
    try {
      await this.options.eventLedger.recordUserPrompt({
        sessionId: resolveLedgerSessionId(session),
        sessionKey: session.sessionKey,
        runId,
        prompt,
      });
    } catch (err) {
      this.options.log(
        `event ledger prompt record failed for ${session.sessionId}: ${String(err)}`,
      );
      await this.markLedgerIncomplete(session);
    }
  }
  async emit(params) {
    if (this.stopped) return;
    await this.options.connection.sessionUpdate({
      sessionId: params.sessionId,
      update: params.update,
    });
    if (params.record && params.sessionKey)
      await this.recordLedgerUpdate({
        sessionId: params.sessionId,
        sessionKey: params.sessionKey,
        ...(params.ledgerSessionId ? { ledgerSessionId: params.ledgerSessionId } : {}),
        ...(params.runId ? { runId: params.runId } : {}),
        update: params.update,
      });
  }
  async sendAvailableCommands(session, options) {
    await this.emit({
      sessionId: session.sessionId,
      sessionKey: session.sessionKey,
      ...(session.ledgerSessionId ? { ledgerSessionId: session.ledgerSessionId } : {}),
      record: options.record,
      update: {
        sessionUpdate: "available_commands_update",
        availableCommands: await this.options.getAvailableCommands(),
      },
    });
  }
  async recordLedgerUpdate(params) {
    if (this.stopped) return;
    try {
      await this.options.eventLedger.recordUpdate({
        sessionId: params.ledgerSessionId ?? params.sessionId,
        sessionKey: params.sessionKey,
        ...(params.runId ? { runId: params.runId } : {}),
        update: params.update,
      });
    } catch (err) {
      this.options.log(`event ledger update record failed for ${params.sessionId}: ${String(err)}`);
      await this.markLedgerIncomplete({
        sessionId: params.sessionId,
        sessionKey: params.sessionKey,
        ...(params.ledgerSessionId ? { ledgerSessionId: params.ledgerSessionId } : {}),
      });
    }
  }
  async markLedgerIncomplete(session) {
    if (this.stopped) return;
    try {
      await this.options.eventLedger.markIncomplete({
        sessionId: resolveLedgerSessionId(session),
        sessionKey: session.sessionKey,
      });
    } catch (err) {
      this.options.log(
        `event ledger incomplete mark failed for ${session.sessionId}: ${String(err)}`,
      );
    }
  }
};
//#endregion
//#region src/acp/types.ts
/** ACP agent identity advertised during protocol initialization. */
const ACP_AGENT_INFO = {
  name: "openclaw-acp",
  title: "OpenClaw ACP Gateway",
  version: VERSION,
};
//#endregion
//#region src/acp/translator.ts
/** Agent Client Protocol bridge that translates ACP sessions/prompts to Gateway chat sessions. */
const MAX_PROMPT_BYTES = 2 * 1024 * 1024;
const ACP_LOAD_SESSION_REPLAY_LIMIT = 1e6;
const ACP_GATEWAY_DISCONNECT_GRACE_MS = 5e3;
function normalizedChatSendAckStatus(status) {
  return typeof status === "string" ? status.trim().toLowerCase() : "";
}
function isTerminalChatSendAckFailure(status) {
  const normalized = normalizedChatSendAckStatus(status);
  return normalized === "timeout" || normalized === "error";
}
function isTerminalChatSendAckSuccess(status) {
  return normalizedChatSendAckStatus(status) === "ok";
}
const loadAcpCommandsModule = createLazyRuntimeModule(() => import("./commands-Bh-flf7f.js"));
const loadAcpSdkModule = createLazyRuntimeModule(() => import("@agentclientprotocol/sdk"));
async function getAvailableCommandsForAcp() {
  const { getAvailableCommands } = await loadAcpCommandsModule();
  return getAvailableCommands();
}
function isAdminScopeProvenanceRejection(err) {
  if (!(err instanceof Error)) return false;
  const gatewayCode = typeof err.gatewayCode === "string" ? err.gatewayCode : void 0;
  return (
    err.name === "GatewayClientRequestError" &&
    gatewayCode === "INVALID_REQUEST" &&
    err.message.includes("system provenance fields require admin scope")
  );
}
function isGatewayCloseError(err) {
  return (err instanceof Error ? err.message : String(err)).startsWith("gateway closed (");
}
const SESSION_CREATE_RATE_LIMIT_DEFAULT_MAX_REQUESTS = 120;
const SESSION_CREATE_RATE_LIMIT_DEFAULT_WINDOW_MS = 1e4;
function buildSystemInputProvenance(originSessionId) {
  return {
    kind: "external_user",
    originSessionId,
    sourceChannel: "acp",
    sourceTool: "openclaw_acp",
  };
}
function buildSystemProvenanceReceipt(params) {
  return [
    "[Source Receipt]",
    "bridge=openclaw-acp",
    `originHost=${os.hostname()}`,
    `originCwd=${shortenHomePath(params.cwd)}`,
    `acpSessionId=${params.sessionId}`,
    `originSessionId=${params.sessionId}`,
    `targetSession=${params.sessionKey}`,
    "[/Source Receipt]",
  ].join("\n");
}
function hasExplicitSessionRouting(meta, opts) {
  return Boolean(
    meta.sessionKey || meta.sessionLabel || opts.defaultSessionKey || opts.defaultSessionLabel,
  );
}
/** ACP Agent implementation backed by the OpenClaw Gateway and replay ledger. */
var AcpGatewayAgent = class {
  pendingPromptKey(sessionId, runId) {
    return `${sessionId}\u0000${runId}`;
  }
  getPendingPrompt(sessionId, runId) {
    const pending = this.pendingPrompts.get(sessionId);
    if (pending?.idempotencyKey !== runId) return;
    return pending;
  }
  constructor(connection, gateway, opts = {}) {
    this.pendingPrompts = /* @__PURE__ */ new Map();
    this.settlingPromptKeys = /* @__PURE__ */ new Set();
    this.approvalRelays = /* @__PURE__ */ new Map();
    this.disconnectTimer = null;
    this.activeDisconnectContext = null;
    this.disconnectGeneration = 0;
    this.connection = connection;
    this.gateway = gateway;
    this.opts = opts;
    this.log = opts.verbose ? (msg) => process.stderr.write(`[acp] ${msg}\n`) : () => {};
    this.sessionStore = opts.sessionStore ?? defaultAcpSessionStore;
    this.sessionUpdates = new AcpTranslatorSessionUpdates({
      connection,
      eventLedger: opts.eventLedger ?? createInMemoryAcpEventLedger(),
      getAvailableCommands: getAvailableCommandsForAcp,
      log: this.log,
    });
    this.sessionCreateRateLimiter = createFixedWindowRateLimiter({
      maxRequests: resolveFixedWindowRateLimitInteger(
        opts.sessionCreateRateLimit?.maxRequests,
        SESSION_CREATE_RATE_LIMIT_DEFAULT_MAX_REQUESTS,
        { min: 1 },
      ),
      windowMs: resolveFixedWindowRateLimitInteger(
        opts.sessionCreateRateLimit?.windowMs,
        SESSION_CREATE_RATE_LIMIT_DEFAULT_WINDOW_MS,
        { min: 1e3 },
      ),
    });
  }
  start() {
    this.log("ready");
  }
  shutdown() {
    this.sessionUpdates.stop();
    this.activeDisconnectContext = null;
    this.clearDisconnectTimer();
  }
  handleGatewayReconnect() {
    this.log("gateway reconnected");
    const disconnectContext = this.activeDisconnectContext;
    this.activeDisconnectContext = null;
    if (!disconnectContext) return;
    this.reconcilePendingPrompts(disconnectContext.generation, false);
  }
  handleGatewayDisconnect(reason) {
    this.log(`gateway disconnected: ${reason}`);
    const disconnectContext = {
      generation: this.disconnectGeneration + 1,
      reason,
    };
    this.disconnectGeneration = disconnectContext.generation;
    this.activeDisconnectContext = disconnectContext;
    if (this.pendingPrompts.size === 0) return;
    for (const pending of this.pendingPrompts.values())
      pending.disconnectContext = disconnectContext;
    this.armDisconnectTimer(disconnectContext);
  }
  async handleGatewayEvent(evt) {
    if (evt.event === "chat") {
      await this.handleChatEvent(evt);
      return;
    }
    if (evt.event === "exec.approval.requested") {
      this.handleExecApprovalRequestEvent(evt);
      return;
    }
    if (evt.event === "agent") await this.handleAgentEvent(evt);
  }
  async initialize(_params) {
    return {
      protocolVersion: (await loadAcpSdkModule()).PROTOCOL_VERSION,
      agentCapabilities: {
        loadSession: true,
        promptCapabilities: {
          image: true,
          audio: false,
          embeddedContext: true,
        },
        mcpCapabilities: {
          http: false,
          sse: false,
        },
        sessionCapabilities: {
          list: {},
          resume: {},
          close: {},
        },
      },
      agentInfo: ACP_AGENT_INFO,
      authMethods: [],
    };
  }
  async newSession(params) {
    this.assertSupportedSessionSetup(params.mcpServers);
    this.enforceSessionCreateRateLimit("newSession");
    const sessionId = randomUUID();
    const meta = parseSessionMeta(params["_meta"]);
    const sessionKey = await this.resolveSessionKeyFromMeta({
      meta,
      fallbackKey: `acp-bridge:${sessionId}`,
    });
    const session = this.sessionStore.createSession({
      sessionId,
      sessionKey,
      cwd: params.cwd,
    });
    await this.sessionUpdates.startLedgerSession(session, {
      complete: true,
      reset: true,
    });
    this.log(`newSession: ${session.sessionId} -> ${session.sessionKey}`);
    const sessionSnapshot = await this.getSessionSnapshot(session.sessionKey);
    await this.sendSessionSnapshotUpdate(session, sessionSnapshot, {
      includeControls: false,
      record: true,
    });
    await this.sessionUpdates.sendAvailableCommands(session, { record: true });
    const { configOptions, modes } = sessionSnapshot;
    return {
      sessionId: session.sessionId,
      configOptions,
      modes,
    };
  }
  async loadSession(params) {
    this.assertSupportedSessionSetup(params.mcpServers);
    if (!this.sessionStore.hasSession(params.sessionId))
      this.enforceSessionCreateRateLimit("loadSession");
    const meta = parseSessionMeta(params["_meta"]);
    const hasExplicitRouting = hasExplicitSessionRouting(meta, this.opts);
    const exactLedgerReplay = hasExplicitRouting
      ? {
          complete: false,
          events: [],
        }
      : await this.sessionUpdates.readLedgerReplayBySessionId(params.sessionId);
    const listedLedgerReplay =
      !hasExplicitRouting && !exactLedgerReplay.complete
        ? await this.sessionUpdates.readLedgerReplayBySessionKey(params.sessionId)
        : {
            complete: false,
            events: [],
          };
    const routedLedgerReplay = exactLedgerReplay.complete ? exactLedgerReplay : listedLedgerReplay;
    const sessionKey = await this.resolveSessionKeyFromMeta({
      meta,
      fallbackKey: routedLedgerReplay.sessionKey ?? params.sessionId,
    });
    const ledgerReplay =
      exactLedgerReplay.complete && exactLedgerReplay.sessionKey === sessionKey
        ? exactLedgerReplay
        : listedLedgerReplay.complete && listedLedgerReplay.sessionKey === sessionKey
          ? listedLedgerReplay
          : await this.sessionUpdates.readLedgerReplay({
              sessionId: params.sessionId,
              sessionKey,
            });
    const session = this.sessionStore.createSession({
      sessionId: params.sessionId,
      sessionKey,
      ...(ledgerReplay.sessionId ? { ledgerSessionId: ledgerReplay.sessionId } : {}),
      cwd: params.cwd,
    });
    await this.sessionUpdates.startLedgerSession(session, { complete: ledgerReplay.complete });
    this.log(`loadSession: ${session.sessionId} -> ${session.sessionKey}`);
    const [sessionSnapshot, transcript] = await Promise.all([
      this.getSessionSnapshot(session.sessionKey),
      ledgerReplay.complete
        ? Promise.resolve([])
        : this.getSessionTranscript(session.sessionKey).catch((err) => {
            this.log(`session transcript fallback for ${session.sessionKey}: ${String(err)}`);
            return [];
          }),
    ]);
    if (ledgerReplay.complete) await this.replayLedgerSession(session.sessionId, ledgerReplay);
    else await this.replaySessionTranscript(session.sessionId, transcript);
    await this.sendSessionSnapshotUpdate(session, sessionSnapshot, {
      includeControls: false,
      record: false,
    });
    await this.sessionUpdates.sendAvailableCommands(session, { record: false });
    const { configOptions, modes } = sessionSnapshot;
    return {
      configOptions,
      modes,
    };
  }
  async listSessions(params) {
    const requestedCwd = normalizeOptionalString(params.cwd);
    if (requestedCwd) assertAbsoluteCwd(requestedCwd, "session/list");
    const fallbackCwd = requestedCwd ?? process.cwd();
    const rawCursor = normalizeOptionalString(params.cursor);
    const cursor = decodeListSessionsCursor(rawCursor);
    if (rawCursor && cursor.cwd !== requestedCwd)
      throw new Error("ACP session list cursor does not match the cwd filter.");
    const pageSize = resolveListSessionsPageSize(params["_meta"]);
    const start = cursor.offset;
    const end = start + pageSize;
    let fetchLimit = end + 1;
    let rows = [];
    while (true) {
      const result = await this.gateway.request("sessions.list", {
        limit: fetchLimit,
        includeDerivedTitles: true,
      });
      rows = result.sessions
        .filter((session) => {
          if (!requestedCwd) return true;
          return (
            (normalizeOptionalString(session.spawnedCwd) ??
              normalizeOptionalString(session.spawnedWorkspaceDir)) === requestedCwd
          );
        })
        .map((session) => this.mapGatewaySessionToAcpSessionInfo(session, fallbackCwd));
      if (rows.length > end || result.hasMore !== true || fetchLimit >= 10101) break;
      fetchLimit = Math.min(fetchLimit * 2, ACP_LIST_SESSIONS_MAX_FETCH_LIMIT);
    }
    return {
      sessions: rows.slice(start, end),
      nextCursor:
        rows.length > end
          ? encodeListSessionsCursor({
              offset: end,
              ...(requestedCwd ? { cwd: requestedCwd } : {}),
            })
          : null,
    };
  }
  async resumeSession(params) {
    this.assertSupportedSessionSetup(params.mcpServers ?? []);
    assertAbsoluteCwd(params.cwd, "session/resume");
    const existingSession = this.sessionStore.getSession(params.sessionId);
    if (!existingSession) this.enforceSessionCreateRateLimit("resumeSession");
    const meta = parseSessionMeta(params["_meta"]);
    const fallbackKey = existingSession?.sessionKey ?? params.sessionId;
    const sessionKey = await this.resolveSessionKeyFromMeta({
      meta,
      fallbackKey,
    });
    const sessionSnapshot =
      !existingSession || sessionKey !== existingSession.sessionKey
        ? await this.getExistingSessionSnapshot(sessionKey)
        : await this.getSessionSnapshot(sessionKey);
    const session = this.sessionStore.createSession({
      sessionId: params.sessionId,
      sessionKey,
      cwd: params.cwd,
    });
    await this.sessionUpdates.startLedgerSession(session, { complete: false });
    this.log(`resumeSession: ${session.sessionId} -> ${session.sessionKey}`);
    await this.sendSessionSnapshotUpdate(session, sessionSnapshot, {
      includeControls: false,
      record: false,
    });
    await this.sessionUpdates.sendAvailableCommands(session, { record: false });
    const { configOptions, modes } = sessionSnapshot;
    return {
      configOptions,
      modes,
    };
  }
  async closeSession(params) {
    const session = this.sessionStore.getSession(params.sessionId);
    if (!session) throw new Error(`Session ${params.sessionId} not found`);
    await this.cancelSessionWork(session);
    this.sessionStore.deleteSession(params.sessionId);
    this.log(`closeSession: ${params.sessionId}`);
    return {};
  }
  async authenticate(_params) {
    return {};
  }
  async setSessionMode(params) {
    const session = this.sessionStore.getSession(params.sessionId);
    if (!session) throw new Error(`Session ${params.sessionId} not found`);
    if (!params.modeId) return {};
    try {
      await this.gateway.request("sessions.patch", {
        key: session.sessionKey,
        thinkingLevel: params.modeId,
      });
      this.log(`setSessionMode: ${session.sessionId} -> ${params.modeId}`);
      const sessionSnapshot = await this.getSessionSnapshot(session.sessionKey, {
        thinkingLevel: params.modeId,
      });
      await this.sendSessionSnapshotUpdate(session, sessionSnapshot, {
        includeControls: true,
        record: true,
      });
    } catch (err) {
      this.log(`setSessionMode error: ${String(err)}`);
      throw err instanceof Error ? err : new Error(String(err));
    }
    return {};
  }
  async setSessionConfigOption(params) {
    const session = this.sessionStore.getSession(params.sessionId);
    if (!session) throw new Error(`Session ${params.sessionId} not found`);
    const sessionPatch = this.resolveSessionConfigPatch(params.configId, params.value);
    try {
      if (sessionPatch.patch)
        await this.gateway.request("sessions.patch", {
          key: session.sessionKey,
          ...sessionPatch.patch,
        });
      this.log(
        `setSessionConfigOption: ${session.sessionId} -> ${params.configId}=${params.value}`,
      );
      const sessionSnapshot = await this.getSessionSnapshot(
        session.sessionKey,
        sessionPatch.overrides,
      );
      await this.sendSessionSnapshotUpdate(session, sessionSnapshot, {
        includeControls: true,
        record: true,
      });
      return { configOptions: sessionSnapshot.configOptions };
    } catch (err) {
      this.log(`setSessionConfigOption error: ${String(err)}`);
      throw err instanceof Error ? err : new Error(String(err));
    }
  }
  async prompt(params) {
    const session = this.sessionStore.getSession(params.sessionId);
    if (!session) throw new Error(`Session ${params.sessionId} not found`);
    if (session.abortController) this.sessionStore.cancelActiveRun(params.sessionId);
    const meta = parseSessionMeta(params["_meta"]);
    const userText = extractTextFromPrompt(params.prompt, MAX_PROMPT_BYTES);
    const attachments = extractAttachmentsFromPrompt(params.prompt);
    const prefixCwd = meta.prefixCwd ?? this.opts.prefixCwd ?? true;
    const displayCwd = shortenHomePath(session.cwd);
    const message = prefixCwd ? `[Working directory: ${displayCwd}]\n\n${userText}` : userText;
    const provenanceMode = this.opts.provenanceMode ?? "off";
    const systemInputProvenance =
      provenanceMode === "off" ? void 0 : buildSystemInputProvenance(params.sessionId);
    const systemProvenanceReceipt =
      provenanceMode === "meta+receipt"
        ? buildSystemProvenanceReceipt({
            cwd: session.cwd,
            sessionId: params.sessionId,
            sessionKey: session.sessionKey,
          })
        : void 0;
    if (Buffer.byteLength(message, "utf-8") > MAX_PROMPT_BYTES)
      throw new Error(`Prompt exceeds maximum allowed size of ${MAX_PROMPT_BYTES} bytes`);
    const abortController = new AbortController();
    const runId = randomUUID();
    this.sessionStore.setActiveRun(params.sessionId, runId, abortController);
    const requestParams = {
      sessionKey: session.sessionKey,
      message,
      attachments: attachments.length > 0 ? attachments : void 0,
      idempotencyKey: runId,
      thinking: readString(params["_meta"], ["thinking", "thinkingLevel"]),
      deliver: readBool(params["_meta"], ["deliver"]),
      timeoutMs: readNonNegativeInteger(params["_meta"], ["timeoutMs"]),
    };
    return new Promise((resolve, reject) => {
      this.pendingPrompts.set(params.sessionId, {
        sessionId: params.sessionId,
        sessionKey: session.sessionKey,
        ...(session.ledgerSessionId ? { ledgerSessionId: session.ledgerSessionId } : {}),
        idempotencyKey: runId,
        disconnectContext: this.activeDisconnectContext ?? void 0,
        resolve,
        reject,
      });
      if (this.activeDisconnectContext && !this.disconnectTimer)
        this.armDisconnectTimer(this.activeDisconnectContext);
      const sendWithProvenanceFallback = async () => {
        const markSendAccepted = () => {
          const pending = this.getPendingPrompt(params.sessionId, runId);
          if (pending) pending.sendAccepted = true;
        };
        const applyTerminalAck = async (ack) => {
          const status = normalizedChatSendAckStatus(ack?.status);
          const pending = () => this.getPendingPrompt(params.sessionId, runId);
          if (status === "timeout") {
            const current = pending();
            if (current) await this.finishPrompt(params.sessionId, current, "cancelled");
            return true;
          }
          if (status === "error") {
            const current = pending();
            if (current)
              this.rejectPendingPrompt(
                current,
                /* @__PURE__ */ new Error("Chat failed before the run started; try again."),
              );
            return true;
          }
          if (status === "ok") {
            markSendAccepted();
            await this.sessionUpdates.recordUserPrompt(session, runId, params.prompt);
            const current = pending();
            if (current) await this.finishPrompt(params.sessionId, current, "end_turn");
            return true;
          }
          return isTerminalChatSendAckFailure(status) || isTerminalChatSendAckSuccess(status);
        };
        const sendChat = async (payload) => {
          const ack = await this.gateway.request("chat.send", payload, { timeoutMs: null });
          return await applyTerminalAck(ack);
        };
        try {
          if (
            await sendChat({
              ...requestParams,
              systemInputProvenance,
              systemProvenanceReceipt,
            })
          )
            return;
          markSendAccepted();
          await this.sessionUpdates.recordUserPrompt(session, runId, params.prompt);
        } catch (err) {
          if (
            (systemInputProvenance || systemProvenanceReceipt) &&
            isAdminScopeProvenanceRejection(err)
          ) {
            if (await sendChat(requestParams)) return;
            markSendAccepted();
            await this.sessionUpdates.recordUserPrompt(session, runId, params.prompt);
            return;
          }
          throw err;
        }
      };
      sendWithProvenanceFallback().catch((err) => {
        const promptKey = this.pendingPromptKey(params.sessionId, runId);
        if (
          isGatewayCloseError(err) &&
          (this.getPendingPrompt(params.sessionId, runId) || this.settlingPromptKeys.has(promptKey))
        )
          return;
        this.clearApprovalRelaysForPrompt(params.sessionId, runId, { denyActive: true });
        this.pendingPrompts.delete(params.sessionId);
        this.sessionStore.clearActiveRun(params.sessionId);
        if (this.pendingPrompts.size === 0) this.clearDisconnectTimer();
        reject(err instanceof Error ? err : new Error(String(err)));
      });
    });
  }
  async cancel(params) {
    const session = this.sessionStore.getSession(params.sessionId);
    if (!session) return;
    await this.cancelSessionWork(session);
  }
  async resolveSessionKeyFromMeta(params) {
    const sessionKey = await resolveSessionKey({
      meta: params.meta,
      fallbackKey: params.fallbackKey,
      gateway: this.gateway,
      opts: this.opts,
    });
    await resetSessionIfNeeded({
      meta: params.meta,
      sessionKey,
      gateway: this.gateway,
      opts: this.opts,
    });
    return sessionKey;
  }
  async handleAgentEvent(evt) {
    const payload = evt.payload;
    if (!payload) return;
    const stream = payload.stream;
    const runId = payload.runId;
    const data = payload.data;
    const sessionKey = payload.sessionKey;
    if (!stream || !data || !sessionKey) return;
    if (stream === "approval") {
      await this.handleApprovalEvent({
        sessionKey,
        runId,
        data,
      });
      return;
    }
    if (stream !== "tool") return;
    const phase = data.phase;
    const name = data.name;
    const toolCallId = data.toolCallId;
    if (!toolCallId) return;
    const pending = this.findPendingBySessionKey(sessionKey, runId);
    if (!pending) return;
    if (phase === "start") {
      if (!pending.toolCalls) pending.toolCalls = /* @__PURE__ */ new Map();
      if (pending.toolCalls.has(toolCallId)) return;
      const args = data.args;
      const title = formatToolTitle(name, args);
      const kind = inferToolKind(name);
      const locations = extractToolCallLocations(args);
      pending.toolCalls.set(toolCallId, {
        title,
        kind,
        rawInput: args,
        locations,
      });
      await this.sessionUpdates.emit({
        sessionId: pending.sessionId,
        sessionKey: pending.sessionKey,
        ...(pending.ledgerSessionId ? { ledgerSessionId: pending.ledgerSessionId } : {}),
        runId: pending.idempotencyKey,
        record: true,
        update: {
          sessionUpdate: "tool_call",
          toolCallId,
          title,
          status: "in_progress",
          rawInput: args,
          kind,
          locations,
        },
      });
      return;
    }
    if (phase === "update") {
      const toolState = pending.toolCalls?.get(toolCallId);
      const partialResult = data.partialResult;
      await this.sessionUpdates.emit({
        sessionId: pending.sessionId,
        sessionKey: pending.sessionKey,
        ...(pending.ledgerSessionId ? { ledgerSessionId: pending.ledgerSessionId } : {}),
        runId: pending.idempotencyKey,
        record: true,
        update: {
          sessionUpdate: "tool_call_update",
          toolCallId,
          status: "in_progress",
          rawOutput: partialResult,
          content: extractToolCallContent(partialResult),
          locations: extractToolCallLocations(toolState?.locations, partialResult),
        },
      });
      return;
    }
    if (phase === "result") {
      const isError = Boolean(data.isError);
      const toolState = pending.toolCalls?.get(toolCallId);
      pending.toolCalls?.delete(toolCallId);
      await this.sessionUpdates.emit({
        sessionId: pending.sessionId,
        sessionKey: pending.sessionKey,
        ...(pending.ledgerSessionId ? { ledgerSessionId: pending.ledgerSessionId } : {}),
        runId: pending.idempotencyKey,
        record: true,
        update: {
          sessionUpdate: "tool_call_update",
          toolCallId,
          status: isError ? "failed" : "completed",
          rawOutput: data.result,
          content: extractToolCallContent(data.result),
          locations: extractToolCallLocations(toolState?.locations, data.result),
        },
      });
    }
  }
  async handleApprovalEvent(params) {
    const approvalEvent = parseGatewayExecApprovalEventData(params.data);
    if (!approvalEvent) return;
    this.startApprovalRelay({
      sessionKey: params.sessionKey,
      runId: params.runId,
      approvalEvent,
    });
  }
  handleExecApprovalRequestEvent(evt) {
    const payload = evt.payload;
    if (!payload) return;
    const approvalEvent = parseGatewayExecApprovalRequestEventPayload(payload);
    if (!approvalEvent) return;
    const request = payload.request;
    const sessionKey = normalizeOptionalString(request?.sessionKey);
    if (!sessionKey) return;
    this.startApprovalRelay({
      sessionKey,
      approvalEvent,
    });
  }
  startApprovalRelay(params) {
    const approvalEvent = params.approvalEvent;
    if (this.approvalRelays.has(approvalEvent.approvalId)) return;
    const pending = params.runId
      ? this.findPendingBySessionKey(params.sessionKey, params.runId)
      : this.findUniquePendingBySessionKey(params.sessionKey);
    if (!pending) return;
    const relay = {
      approvalId: approvalEvent.approvalId,
      runId: pending.idempotencyKey,
      sessionId: pending.sessionId,
      sessionKey: pending.sessionKey,
      state: "active",
    };
    this.approvalRelays.set(relay.approvalId, relay);
    this.runApprovalRelay(relay, approvalEvent);
  }
  async runApprovalRelay(relay, approvalEvent) {
    let resolved = false;
    try {
      const details = await this.getGatewayApprovalDetails(relay.approvalId);
      if (!this.isApprovalRelayActive(relay)) {
        resolved = await this.resolveGatewayApproval(relay.approvalId, "deny");
        return;
      }
      const request = buildAcpPermissionRequest({
        sessionId: relay.sessionId,
        event: approvalEvent,
        details,
      });
      let decision;
      try {
        decision = resolveGatewayDecisionFromPermissionOutcome(
          await this.connection.requestPermission(request),
          request.options,
        );
      } catch (err) {
        this.log(`approval relay request failed for ${relay.approvalId}: ${String(err)}`);
      }
      const selectedDecision = this.isApprovalRelayActive(relay) && decision ? decision : "deny";
      resolved = await this.resolveGatewayApproval(relay.approvalId, selectedDecision);
    } finally {
      const current = this.approvalRelays.get(relay.approvalId);
      if (current === relay && current.state === "active")
        if (resolved) current.state = "completed";
        else this.approvalRelays.delete(relay.approvalId);
    }
  }
  async getGatewayApprovalDetails(approvalId) {
    try {
      return await this.gateway.request("exec.approval.get", { id: approvalId });
    } catch (err) {
      this.log(`approval relay hydrate failed for ${approvalId}: ${String(err)}`);
      return null;
    }
  }
  async resolveGatewayApproval(approvalId, decision) {
    try {
      await this.gateway.request("exec.approval.resolve", {
        id: approvalId,
        decision,
      });
      return true;
    } catch (err) {
      this.log(`approval relay resolve failed for ${approvalId}: ${String(err)}`);
      return false;
    }
  }
  isApprovalRelayActive(relay) {
    return (
      this.approvalRelays.get(relay.approvalId) === relay &&
      relay.state === "active" &&
      this.getPendingPrompt(relay.sessionId, relay.runId) !== void 0
    );
  }
  clearApprovalRelaysForPrompt(sessionId, runId, opts = {}) {
    for (const [approvalId, relay] of this.approvalRelays) {
      if (relay.sessionId !== sessionId) continue;
      if (runId && relay.runId !== runId) continue;
      this.approvalRelays.delete(approvalId);
      if (opts.denyActive && relay.state === "active")
        this.resolveGatewayApproval(approvalId, "deny");
    }
  }
  async handleChatEvent(evt) {
    const payload = evt.payload;
    if (!payload) return;
    const sessionKey = payload.sessionKey;
    const state = payload.state;
    const runId = payload.runId;
    const messageData = payload.message;
    if (!sessionKey || !state) return;
    const pending = this.findPendingBySessionKey(sessionKey, runId);
    if (!pending) return;
    if (messageData && (state === "delta" || state === "final")) {
      await this.handleDeltaEvent(pending.sessionId, messageData);
      if (state === "delta") return;
    }
    if (state === "final") {
      const stopReason = payload.stopReason === "max_tokens" ? "max_tokens" : "end_turn";
      await this.finishPrompt(pending.sessionId, pending, stopReason);
      return;
    }
    if (state === "aborted") {
      await this.finishPrompt(pending.sessionId, pending, "cancelled");
      return;
    }
    if (state === "error") {
      const stopReason = payload.errorKind === "refusal" ? "refusal" : "end_turn";
      this.finishPrompt(pending.sessionId, pending, stopReason);
    }
  }
  async handleDeltaEvent(sessionId, messageData) {
    const content = messageData.content;
    const pending = this.pendingPrompts.get(sessionId);
    if (!pending) return;
    const fullThought = content
      ?.filter((block) => block?.type === "thinking")
      .map((block) => block.thinking ?? "")
      .join("\n")
      .trimEnd();
    const sentThoughtSoFar = pending.sentThoughtLength ?? 0;
    if (fullThought && fullThought.length > sentThoughtSoFar) {
      const newThought = fullThought.slice(sentThoughtSoFar);
      pending.sentThoughtLength = fullThought.length;
      pending.sentThought = fullThought;
      await this.sessionUpdates.emit({
        sessionId,
        sessionKey: pending.sessionKey,
        ...(pending.ledgerSessionId ? { ledgerSessionId: pending.ledgerSessionId } : {}),
        runId: pending.idempotencyKey,
        record: true,
        update: {
          sessionUpdate: "agent_thought_chunk",
          content: {
            type: "text",
            text: newThought,
          },
        },
      });
    }
    const fullText = content
      ?.filter((block) => block?.type === "text")
      .map((block) => block.text ?? "")
      .join("\n")
      .trimEnd();
    const sentSoFar = pending.sentTextLength ?? 0;
    if (!fullText || fullText.length <= sentSoFar) return;
    const newText = fullText.slice(sentSoFar);
    pending.sentTextLength = fullText.length;
    pending.sentText = fullText;
    await this.sessionUpdates.emit({
      sessionId,
      sessionKey: pending.sessionKey,
      ...(pending.ledgerSessionId ? { ledgerSessionId: pending.ledgerSessionId } : {}),
      runId: pending.idempotencyKey,
      record: true,
      update: {
        sessionUpdate: "agent_message_chunk",
        content: {
          type: "text",
          text: newText,
        },
      },
    });
  }
  async finishPrompt(sessionId, pending, stopReason) {
    const promptKey = this.pendingPromptKey(sessionId, pending.idempotencyKey);
    this.settlingPromptKeys.add(promptKey);
    try {
      this.clearApprovalRelaysForPrompt(sessionId, pending.idempotencyKey, { denyActive: true });
      this.pendingPrompts.delete(sessionId);
      this.sessionStore.clearActiveRun(sessionId);
      if (this.pendingPrompts.size === 0) this.clearDisconnectTimer();
      const sessionSnapshot = await this.getSessionSnapshot(pending.sessionKey);
      try {
        await this.sendSessionSnapshotUpdate(
          {
            sessionId,
            sessionKey: pending.sessionKey,
            ...(pending.ledgerSessionId ? { ledgerSessionId: pending.ledgerSessionId } : {}),
          },
          sessionSnapshot,
          {
            includeControls: false,
            record: true,
            runId: pending.idempotencyKey,
          },
        );
      } catch (err) {
        this.log(`session snapshot update failed for ${sessionId}: ${String(err)}`);
      }
      pending.resolve({ stopReason });
    } finally {
      this.settlingPromptKeys.delete(promptKey);
    }
  }
  findPendingBySessionKey(sessionKey, runId) {
    for (const pending of this.pendingPrompts.values()) {
      if (pending.sessionKey !== sessionKey) continue;
      if (runId && pending.idempotencyKey !== runId) continue;
      return pending;
    }
    if (runId)
      for (const pending of this.pendingPrompts.values()) {
        if (pending.idempotencyKey !== runId) continue;
        this.reconcilePendingSessionKey(pending, sessionKey);
        return pending;
      }
  }
  findUniquePendingBySessionKey(sessionKey) {
    let match;
    for (const pending of this.pendingPrompts.values()) {
      if (pending.sessionKey !== sessionKey) continue;
      if (match) return;
      match = pending;
    }
    return match;
  }
  reconcilePendingSessionKey(pending, sessionKey) {
    if (pending.sessionKey === sessionKey) return;
    this.log(`session key reconciled: ${pending.sessionKey} -> ${sessionKey}`);
    pending.sessionKey = sessionKey;
    const session = this.sessionStore.getSession(pending.sessionId);
    if (session?.activeRunId === pending.idempotencyKey) session.sessionKey = sessionKey;
  }
  clearDisconnectTimer() {
    if (!this.disconnectTimer) return;
    clearTimeout(this.disconnectTimer);
    this.disconnectTimer = null;
  }
  armDisconnectTimer(disconnectContext) {
    this.clearDisconnectTimer();
    this.disconnectTimer = setTimeout(() => {
      this.disconnectTimer = null;
      this.reconcilePendingPrompts(disconnectContext.generation, true);
    }, ACP_GATEWAY_DISCONNECT_GRACE_MS);
    this.disconnectTimer.unref?.();
  }
  rejectPendingPrompt(pending, error) {
    if (this.getPendingPrompt(pending.sessionId, pending.idempotencyKey) !== pending) return;
    this.clearApprovalRelaysForPrompt(pending.sessionId, pending.idempotencyKey, {
      denyActive: true,
    });
    this.pendingPrompts.delete(pending.sessionId);
    this.sessionStore.clearActiveRun(pending.sessionId);
    if (this.pendingPrompts.size === 0) this.clearDisconnectTimer();
    pending.reject(error);
  }
  clearPendingDisconnectState(pending, disconnectContext) {
    if (pending.disconnectContext !== disconnectContext) return;
    pending.disconnectContext = void 0;
  }
  shouldRejectPendingAtDisconnectDeadline(pending, disconnectContext) {
    return (
      pending.disconnectContext === disconnectContext &&
      (!pending.sendAccepted ||
        this.activeDisconnectContext?.generation === disconnectContext.generation)
    );
  }
  async reconcilePendingPrompts(observedDisconnectGeneration, deadlineExpired) {
    if (this.pendingPrompts.size === 0) {
      if (this.disconnectGeneration === observedDisconnectGeneration) this.clearDisconnectTimer();
      return;
    }
    const pendingEntries = [...this.pendingPrompts.entries()];
    let keepDisconnectTimer = false;
    for (const [sessionId, pending] of pendingEntries) {
      if (this.pendingPrompts.get(sessionId) !== pending) continue;
      if (pending.disconnectContext?.generation !== observedDisconnectGeneration) continue;
      if (await this.reconcilePendingPrompt(sessionId, pending, deadlineExpired))
        keepDisconnectTimer = true;
    }
    if (!keepDisconnectTimer && this.disconnectGeneration === observedDisconnectGeneration)
      this.clearDisconnectTimer();
  }
  async reconcilePendingPrompt(sessionId, pending, deadlineExpired) {
    const disconnectContext = pending.disconnectContext;
    if (!disconnectContext) return false;
    let result;
    try {
      result = await this.gateway.request(
        "agent.wait",
        {
          runId: pending.idempotencyKey,
          timeoutMs: 0,
        },
        { timeoutMs: null },
      );
    } catch (err) {
      this.log(`agent.wait reconcile failed for ${pending.idempotencyKey}: ${String(err)}`);
      if (deadlineExpired) {
        if (this.shouldRejectPendingAtDisconnectDeadline(pending, disconnectContext)) {
          this.rejectPendingPrompt(
            pending,
            /* @__PURE__ */ new Error(`Gateway disconnected: ${disconnectContext.reason}`),
          );
          return false;
        }
        this.clearPendingDisconnectState(pending, disconnectContext);
        return false;
      }
      return true;
    }
    const currentPending = this.getPendingPrompt(sessionId, pending.idempotencyKey);
    if (!currentPending) return false;
    if (result?.status === "ok") {
      await this.finishPrompt(sessionId, currentPending, "end_turn");
      return false;
    }
    if (result?.status === "error") {
      this.finishPrompt(sessionId, currentPending, "end_turn");
      return false;
    }
    if (deadlineExpired) {
      if (this.shouldRejectPendingAtDisconnectDeadline(currentPending, disconnectContext)) {
        const currentDisconnectContext = currentPending.disconnectContext;
        if (!currentDisconnectContext) return false;
        this.rejectPendingPrompt(
          currentPending,
          /* @__PURE__ */ new Error(`Gateway disconnected: ${currentDisconnectContext.reason}`),
        );
        return false;
      }
      this.clearPendingDisconnectState(currentPending, disconnectContext);
      return false;
    }
    return true;
  }
  async getSessionSnapshot(sessionKey, overrides) {
    try {
      const row = await this.getGatewaySessionRow(sessionKey);
      return {
        ...buildSessionPresentation({
          row,
          overrides,
        }),
        metadata: buildSessionMetadata({
          row,
          sessionKey,
        }),
        usage: buildSessionUsageSnapshot(row),
      };
    } catch (err) {
      this.log(`session presentation fallback for ${sessionKey}: ${String(err)}`);
      return {
        ...buildSessionPresentation({ overrides }),
        metadata: buildSessionMetadata({ sessionKey }),
      };
    }
  }
  async getExistingSessionSnapshot(sessionKey) {
    const row = await this.getGatewaySessionRow(sessionKey);
    if (!row) throw new Error(`Session ${sessionKey} not found`);
    return {
      ...buildSessionPresentation({ row }),
      metadata: buildSessionMetadata({
        row,
        sessionKey,
      }),
      usage: buildSessionUsageSnapshot(row),
    };
  }
  mapGatewaySessionToAcpSessionInfo(session, fallbackCwd) {
    const cwd =
      normalizeOptionalString(session.spawnedCwd) ??
      normalizeOptionalString(session.spawnedWorkspaceDir) ??
      fallbackCwd;
    return {
      sessionId: session.key,
      cwd,
      title: session.derivedTitle ?? session.displayName ?? session.label ?? session.key,
      updatedAt: timestampMsToIsoString(session.updatedAt),
      _meta: toAcpSessionLineageMeta(session),
    };
  }
  async cancelSessionWork(session) {
    const activeRunId = session.activeRunId;
    this.sessionStore.cancelActiveRun(session.sessionId);
    const pending = this.pendingPrompts.get(session.sessionId);
    const scopedRunId = activeRunId ?? pending?.idempotencyKey;
    if (scopedRunId)
      try {
        await this.gateway.request("chat.abort", {
          sessionKey: session.sessionKey,
          runId: scopedRunId,
        });
      } catch (err) {
        this.log(`cancel error: ${String(err)}`);
      }
    if (pending) {
      this.clearApprovalRelaysForPrompt(session.sessionId, pending.idempotencyKey, {
        denyActive: true,
      });
      this.pendingPrompts.delete(session.sessionId);
      if (this.pendingPrompts.size === 0) this.clearDisconnectTimer();
      pending.resolve({ stopReason: "cancelled" });
    }
  }
  async getGatewaySessionRow(sessionKey) {
    const session = (
      await this.gateway.request("sessions.list", {
        limit: 200,
        search: sessionKey,
        includeDerivedTitles: true,
      })
    ).sessions.find((entry) => entry.key === sessionKey);
    if (!session) return;
    return {
      key: session.key,
      kind: session.kind,
      channel: session.channel,
      parentSessionKey: session.parentSessionKey,
      spawnedBy: session.spawnedBy,
      spawnDepth: session.spawnDepth,
      subagentRole: session.subagentRole,
      subagentControlScope: session.subagentControlScope,
      spawnedWorkspaceDir: session.spawnedWorkspaceDir,
      spawnedCwd: session.spawnedCwd,
      displayName: session.displayName,
      label: session.label,
      derivedTitle: session.derivedTitle,
      updatedAt: session.updatedAt,
      thinkingLevel: session.thinkingLevel,
      thinkingLevels: session.thinkingLevels,
      modelProvider: session.modelProvider,
      model: session.model,
      fastMode: session.fastMode,
      effectiveFastMode: session.effectiveFastMode,
      verboseLevel: session.verboseLevel,
      traceLevel: session.traceLevel,
      reasoningLevel: session.reasoningLevel,
      responseUsage: session.responseUsage,
      elevatedLevel: session.elevatedLevel,
      totalTokens: session.totalTokens,
      totalTokensFresh: session.totalTokensFresh,
      contextTokens: session.contextTokens,
    };
  }
  resolveSessionConfigPatch(configId, value) {
    if (typeof value !== "string")
      throw new Error(
        `ACP bridge does not support non-string session config option values for "${configId}".`,
      );
    switch (configId) {
      case ACP_THOUGHT_LEVEL_CONFIG_ID:
        return {
          patch: { thinkingLevel: value },
          overrides: { thinkingLevel: value },
        };
      case ACP_FAST_MODE_CONFIG_ID: {
        const fastMode = normalizeFastMode(value);
        if (fastMode === void 0) throw new Error(`Unsupported fast mode value: ${value}`);
        return {
          patch: { fastMode },
          overrides: { fastMode },
        };
      }
      case ACP_VERBOSE_LEVEL_CONFIG_ID:
        return {
          patch: { verboseLevel: value },
          overrides: { verboseLevel: value },
        };
      case ACP_TRACE_LEVEL_CONFIG_ID:
        return {
          patch: { traceLevel: value },
          overrides: { traceLevel: value },
        };
      case ACP_REASONING_LEVEL_CONFIG_ID:
        return {
          patch: { reasoningLevel: value },
          overrides: { reasoningLevel: value },
        };
      case ACP_RESPONSE_USAGE_CONFIG_ID: {
        const next = value === "inherit" ? null : value;
        return {
          patch: { responseUsage: next },
          overrides: { responseUsage: next },
        };
      }
      case ACP_ELEVATED_LEVEL_CONFIG_ID:
        return {
          patch: { elevatedLevel: value },
          overrides: { elevatedLevel: value },
        };
      case ACP_TIMEOUT_CONFIG_ID:
      case ACP_TIMEOUT_SECONDS_CONFIG_ID:
        return { overrides: {} };
      default:
        throw new Error(`ACP bridge mode does not support session config option "${configId}".`);
    }
  }
  async getSessionTranscript(sessionKey) {
    const result = await this.gateway.request("sessions.get", {
      key: sessionKey,
      limit: ACP_LOAD_SESSION_REPLAY_LIMIT,
    });
    if (!Array.isArray(result.messages)) return [];
    return result.messages;
  }
  async replaySessionTranscript(sessionId, transcript) {
    for (const message of transcript) {
      const replayChunks = extractReplayChunks(message);
      for (const chunk of replayChunks)
        await this.sessionUpdates.emit({
          sessionId,
          update: {
            sessionUpdate: chunk.sessionUpdate,
            content: {
              type: "text",
              text: chunk.text,
            },
          },
        });
    }
  }
  async replayLedgerSession(sessionId, ledgerReplay) {
    for (const event of ledgerReplay.events)
      await this.sessionUpdates.emit({
        sessionId,
        update: event.update,
        record: false,
      });
  }
  async sendSessionSnapshotUpdate(session, sessionSnapshot, options) {
    if (options.includeControls) {
      await this.sessionUpdates.emit({
        sessionId: session.sessionId,
        sessionKey: session.sessionKey,
        ...(session.ledgerSessionId ? { ledgerSessionId: session.ledgerSessionId } : {}),
        runId: options.runId,
        record: options.record,
        update: {
          sessionUpdate: "current_mode_update",
          currentModeId: sessionSnapshot.modes.currentModeId,
        },
      });
      await this.sessionUpdates.emit({
        sessionId: session.sessionId,
        sessionKey: session.sessionKey,
        ...(session.ledgerSessionId ? { ledgerSessionId: session.ledgerSessionId } : {}),
        runId: options.runId,
        record: options.record,
        update: {
          sessionUpdate: "config_option_update",
          configOptions: sessionSnapshot.configOptions,
        },
      });
    }
    if (sessionSnapshot.metadata)
      await this.sessionUpdates.emit({
        sessionId: session.sessionId,
        sessionKey: session.sessionKey,
        ...(session.ledgerSessionId ? { ledgerSessionId: session.ledgerSessionId } : {}),
        runId: options.runId,
        record: options.record,
        update: {
          sessionUpdate: "session_info_update",
          ...sessionSnapshot.metadata,
        },
      });
    if (sessionSnapshot.usage)
      await this.sessionUpdates.emit({
        sessionId: session.sessionId,
        sessionKey: session.sessionKey,
        ...(session.ledgerSessionId ? { ledgerSessionId: session.ledgerSessionId } : {}),
        runId: options.runId,
        record: options.record,
        update: {
          sessionUpdate: "usage_update",
          used: sessionSnapshot.usage.used,
          size: sessionSnapshot.usage.size,
          _meta: {
            source: "gateway-session-store",
            approximate: true,
          },
        },
      });
  }
  assertSupportedSessionSetup(mcpServers) {
    if (mcpServers.length === 0) return;
    throw new Error(
      "ACP bridge mode does not support per-session MCP servers. Configure MCP on the OpenClaw gateway or agent instead.",
    );
  }
  enforceSessionCreateRateLimit(method) {
    const budget = this.sessionCreateRateLimiter.consume();
    if (budget.allowed) return;
    throw new Error(
      `ACP session creation rate limit exceeded for ${method}; retry after ${Math.ceil(budget.retryAfterMs / 1e3)}s.`,
    );
  }
};
//#endregion
//#region src/acp/server.ts
/** ACP stdio server that bridges Agent Client Protocol clients to the OpenClaw Gateway. */
/** Starts the ACP Gateway bridge and serves AgentSideConnection over stdio. */
async function serveAcpGateway(opts = {}) {
  routeLogsToStderr();
  const bootstrap = await resolveGatewayClientBootstrap({
    config: getRuntimeConfig(),
    gatewayUrl: opts.gatewayUrl,
    explicitAuth: {
      token: opts.gatewayToken,
      password: opts.gatewayPassword,
    },
    env: process.env,
  });
  let agent = null;
  let onClosed;
  const closed = new Promise((resolve) => {
    onClosed = resolve;
  });
  let stopped = false;
  let startupWork = null;
  let onGatewayReadyResolve;
  let onGatewayReadyReject;
  let gatewayReadySettled = false;
  const gatewayReady = new Promise((resolve, reject) => {
    onGatewayReadyResolve = resolve;
    onGatewayReadyReject = reject;
  });
  const resolveGatewayReady = () => {
    if (gatewayReadySettled) return;
    gatewayReadySettled = true;
    onGatewayReadyResolve();
  };
  const rejectGatewayReady = (err) => {
    if (gatewayReadySettled) return;
    gatewayReadySettled = true;
    onGatewayReadyReject(err instanceof Error ? err : new Error(String(err)));
  };
  const closeStateDatabase = () => {
    try {
      closeOpenClawStateDatabase();
    } catch (err) {
      console.warn(`acp: state database close failed during shutdown: ${String(err)}`);
    }
  };
  const gateway = new GatewayClient({
    url: bootstrap.url,
    token: bootstrap.auth.token,
    password: bootstrap.auth.password,
    preauthHandshakeTimeoutMs: bootstrap.preauthHandshakeTimeoutMs,
    clientName: GATEWAY_CLIENT_NAMES.CLI,
    clientDisplayName: "ACP",
    clientVersion: "acp",
    mode: GATEWAY_CLIENT_MODES.CLI,
    caps: [GATEWAY_CLIENT_CAPS.TOOL_EVENTS],
    onEvent: (evt) => {
      if (stopped) return;
      agent?.handleGatewayEvent(evt).catch((err) => {
        process.stderr.write(`openclaw acp: gateway event ${evt.event} failed\n`);
        if (opts.verbose)
          process.stderr.write(`openclaw acp: gateway event ${evt.event} error: ${String(err)}\n`);
      });
    },
    onHelloOk: () => {
      resolveGatewayReady();
      agent?.handleGatewayReconnect();
    },
    onConnectError: (err) => {
      rejectGatewayReady(err);
    },
    onClose: (code, reason) => {
      if (stopped) return;
      rejectGatewayReady(
        /* @__PURE__ */ new Error(`gateway closed before ready (${code}): ${reason}`),
      );
      agent?.handleGatewayDisconnect(`${code}: ${reason}`);
    },
  });
  const shutdown = async () => {
    if (stopped) return;
    stopped = true;
    resolveGatewayReady();
    const activeAgent = agent;
    agent = null;
    activeAgent?.shutdown();
    const startupSettlement = startupWork?.catch(() => {}) ?? Promise.resolve();
    const gatewayStop = gateway.stopAndWait().catch((err) => {
      console.warn(`acp: gateway stop failed during shutdown: ${String(err)}`);
    });
    await Promise.all([startupSettlement, gatewayStop]);
    closeStateDatabase();
    onClosed();
  };
  process.once("SIGINT", () => {
    shutdown();
  });
  process.once("SIGTERM", () => {
    shutdown();
  });
  if (
    !(
      await startGatewayClientWhenEventLoopReady(gateway, {
        clientOptions: { preauthHandshakeTimeoutMs: bootstrap.preauthHandshakeTimeoutMs },
      })
    ).ready
  )
    rejectGatewayReady(/* @__PURE__ */ new Error("gateway event loop readiness timeout"));
  await gatewayReady.catch(async (err) => {
    await shutdown();
    throw err;
  });
  if (stopped) return closed;
  const stream = ndJsonStream(Writable.toWeb(process.stdout), Readable.toWeb(process.stdin));
  const readable = stream.readable.pipeThrough(
    new TransformStream({
      transform(message, controller) {
        controller.enqueue(normalizeAcpInitializeProtocolVersion(message));
      },
    }),
  );
  startupWork = migrateFileAcpEventLedgerToSqlite({
    filePath: resolveDefaultAcpEventLedgerPath(process.env),
    archiveSource: true,
  });
  try {
    await startupWork;
  } catch (err) {
    if (stopped) return closed;
    await shutdown();
    throw err;
  } finally {
    startupWork = null;
  }
  if (stopped) return closed;
  const eventLedger = createSqliteAcpEventLedger();
  new AgentSideConnection(
    (conn) => {
      agent = new AcpGatewayAgent(conn, gateway, {
        ...opts,
        eventLedger,
      });
      agent.start();
      return agent;
    },
    {
      ...stream,
      readable,
    },
  );
  return closed;
}
function normalizeAcpInitializeProtocolVersion(message) {
  if (!isJsonObject(message)) return message;
  const messageObject = message;
  if (messageObject.method !== AGENT_METHODS.initialize) return message;
  const params = messageObject.params;
  if (!isJsonObject(params) || isUint16Integer(params.protocolVersion)) return message;
  return {
    ...message,
    params: {
      ...params,
      protocolVersion: PROTOCOL_VERSION,
    },
  };
}
function isJsonObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function isUint16Integer(value) {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 65535;
}
function parseArgs(args) {
  const opts = {};
  let tokenFile;
  let passwordFile;
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--url" || arg === "--gateway-url") {
      opts.gatewayUrl = args[i + 1];
      i += 1;
      continue;
    }
    if (arg === "--token" || arg === "--gateway-token") {
      opts.gatewayToken = args[i + 1];
      i += 1;
      continue;
    }
    if (arg === "--token-file" || arg === "--gateway-token-file") {
      tokenFile = args[i + 1];
      i += 1;
      continue;
    }
    if (arg === "--password" || arg === "--gateway-password") {
      opts.gatewayPassword = args[i + 1];
      i += 1;
      continue;
    }
    if (arg === "--password-file" || arg === "--gateway-password-file") {
      passwordFile = args[i + 1];
      i += 1;
      continue;
    }
    if (arg === "--session") {
      opts.defaultSessionKey = args[i + 1];
      i += 1;
      continue;
    }
    if (arg === "--session-label") {
      opts.defaultSessionLabel = args[i + 1];
      i += 1;
      continue;
    }
    if (arg === "--require-existing") {
      opts.requireExistingSession = true;
      continue;
    }
    if (arg === "--reset-session") {
      opts.resetSession = true;
      continue;
    }
    if (arg === "--no-prefix-cwd") {
      opts.prefixCwd = false;
      continue;
    }
    if (arg === "--provenance") {
      const provenanceMode = normalizeAcpProvenanceMode(args[i + 1]);
      if (!provenanceMode)
        throw new Error("Invalid --provenance value. Use off, meta, or meta+receipt.");
      opts.provenanceMode = provenanceMode;
      i += 1;
      continue;
    }
    if (arg === "--verbose" || arg === "-v") {
      opts.verbose = true;
      continue;
    }
    if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    }
  }
  const gatewayToken = normalizeOptionalString(opts.gatewayToken);
  const gatewayPassword = normalizeOptionalString(opts.gatewayPassword);
  const normalizedTokenFile = normalizeOptionalString(tokenFile);
  const normalizedPasswordFile = normalizeOptionalString(passwordFile);
  if (gatewayToken && normalizedTokenFile) throw new Error("Use either --token or --token-file.");
  if (gatewayPassword && normalizedPasswordFile)
    throw new Error("Use either --password or --password-file.");
  if (normalizedTokenFile)
    opts.gatewayToken = readSecretFromFile(normalizedTokenFile, "Gateway token");
  if (normalizedPasswordFile)
    opts.gatewayPassword = readSecretFromFile(normalizedPasswordFile, "Gateway password");
  return opts;
}
function printHelp() {
  console.log(`Usage: openclaw acp [options]

Gateway-backed ACP server for IDE integration.

Options:
  --url <url>             Gateway WebSocket URL
  --token <token>         Gateway auth token
  --token-file <path>     Read gateway auth token from file
  --password <password>   Gateway auth password
  --password-file <path>  Read gateway auth password from file
  --session <key>         Default session key (e.g. "agent:main:main")
  --session-label <label> Default session label to resolve
  --require-existing      Fail if the session key/label does not exist
  --reset-session         Reset the session key before first use
  --no-prefix-cwd         Do not prefix prompts with the working directory
  --provenance <mode>     ACP provenance mode: off, meta, or meta+receipt
  --verbose, -v           Verbose logging to stderr
  --help, -h              Show this help message
`);
}
if (isMainModule({ currentFile: fileURLToPath(import.meta.url) })) {
  const argv = process.argv.slice(2);
  if (argv.includes("--token") || argv.includes("--gateway-token"))
    console.error(
      "Warning: --token can be exposed via process listings. Prefer --token-file or OPENCLAW_GATEWAY_TOKEN.",
    );
  if (argv.includes("--password") || argv.includes("--gateway-password"))
    console.error(
      "Warning: --password can be exposed via process listings. Prefer --password-file or OPENCLAW_GATEWAY_PASSWORD.",
    );
  serveAcpGateway(parseArgs(argv)).catch((err) => {
    console.error(String(err));
    process.exit(1);
  });
}
//#endregion
//#region src/cli/acp-cli.ts
function registerAcpCli(program) {
  const acp = program.command("acp").description("Run an ACP bridge backed by the Gateway");
  acp
    .option("--url <url>", "Gateway WebSocket URL (defaults to gateway.remote.url when configured)")
    .option("--token <token>", "Gateway token (if required)")
    .option("--token-file <path>", "Read gateway token from file")
    .option("--password <password>", "Gateway password (if required)")
    .option("--password-file <path>", "Read gateway password from file")
    .option("--session <key>", "Default session key (e.g. agent:main:main)")
    .option("--session-label <label>", "Default session label to resolve")
    .option("--require-existing", "Fail if the session key/label does not exist", false)
    .option("--reset-session", "Reset the session key before first use", false)
    .option("--no-prefix-cwd", "Do not prefix prompts with the working directory")
    .option("--provenance <mode>", "ACP provenance mode: off, meta, or meta+receipt")
    .option("-v, --verbose", "Verbose logging to stderr", false)
    .addHelpText(
      "after",
      () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/acp", "docs.openclaw.ai/cli/acp")}\n`,
    )
    .action(async (opts) => {
      try {
        const { gatewayToken, gatewayPassword } = resolveGatewayAuthOptions(opts);
        const provenanceMode = normalizeAcpProvenanceMode(opts.provenance);
        if (opts.provenance && !provenanceMode)
          throw new Error('Invalid --provenance. Use "off", "meta", or "meta+receipt".');
        await serveAcpGateway({
          gatewayUrl: opts.url,
          gatewayToken,
          gatewayPassword,
          defaultSessionKey: opts.session,
          defaultSessionLabel: opts.sessionLabel,
          requireExistingSession: Boolean(opts.requireExisting),
          resetSession: Boolean(opts.resetSession),
          prefixCwd: opts.prefixCwd !== false,
          provenanceMode,
          verbose: Boolean(opts.verbose),
        });
      } catch (err) {
        defaultRuntime.error(`ACP bridge failed: ${formatErrorMessage(err)}`);
        defaultRuntime.exit(1);
      }
    });
  acp
    .command("client")
    .description("Run an interactive ACP client against the local ACP bridge")
    .option("--cwd <dir>", "Working directory for the ACP session")
    .option("--server <command>", "ACP server command (default: openclaw)")
    .option("--server-args <args...>", "Extra arguments for the ACP server")
    .option("--server-verbose", "Enable verbose logging on the ACP server", false)
    .option("-v, --verbose", "Verbose client logging", false)
    .action(async (opts, command) => {
      const inheritedVerbose = inheritOptionFromParent(command, "verbose");
      try {
        await runAcpClientInteractive({
          cwd: opts.cwd,
          serverCommand: opts.server,
          serverArgs: opts.serverArgs,
          serverVerbose: Boolean(opts.serverVerbose),
          verbose: Boolean(opts.verbose || inheritedVerbose),
        });
      } catch (err) {
        defaultRuntime.error(formatErrorMessage(err));
        defaultRuntime.exit(1);
      }
    });
}
//#endregion
export { registerAcpCli };
