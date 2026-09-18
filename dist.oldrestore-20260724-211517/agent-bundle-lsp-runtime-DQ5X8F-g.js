import { spawn } from "node:child_process";
import { t as createAbortError } from "./abort-signal-DEbc_zqk.js";
import { n as loadEnabledBundleLspConfig } from "./bundle-lsp-Cko1XYFu.js";
import { s as sanitizeHostExecEnv } from "./host-env-security-pMY6K0Qy.js";
import { t as killProcessTree } from "./kill-tree-Cr15jS_s.js";
import { a as logWarn, t as logDebug } from "./logger-BegyOJlO.js";
import {
  n as resolveStdioMcpServerLaunchConfig,
  t as describeStdioMcpServerLaunchConfig,
} from "./mcp-stdio-CT1C_4ex.js";
import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { o as setPluginToolMeta } from "./tools-K3NqAe9E.js";
import {
  a as resolveWindowsSpawnProgram,
  r as materializeWindowsSpawnProgram,
} from "./windows-spawn-C5RDaB22.js";
//#region src/agents/embedded-agent-lsp.ts
/** Resolve enabled embedded-agent LSP servers and diagnostics. */
function loadEmbeddedAgentLspConfig(params) {
  const bundleLsp = loadEnabledBundleLspConfig({
    workspaceDir: params.workspaceDir,
    cfg: params.cfg,
    manifestRegistry: params.manifestRegistry,
  });
  return {
    lspServers: { ...bundleLsp.config.lspServers },
    diagnostics: bundleLsp.diagnostics,
  };
}
//#endregion
//#region src/agents/agent-bundle-lsp-runtime.ts
/** Session-scoped embedded LSP runtime and tool materialization for agent bundles. */
const LSP_SHUTDOWN_GRACE_MS = 500;
const LSP_PROCESS_TREE_KILL_GRACE_MS = 1e3;
const activeBundleLspSessions = /* @__PURE__ */ new Set();
function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, Math.max(1, ms)).unref?.();
  });
}
/** Spawns one LSP server process using sanitized host env and Windows shim handling. */
function spawnLspServerProcess(config) {
  const mergedEnv = sanitizeHostExecEnv({
    baseEnv: process.env,
    overrides: config.env ?? null,
  });
  const invocation = materializeWindowsSpawnProgram(
    resolveWindowsSpawnProgram({
      command: config.command,
      env: mergedEnv,
      allowShellFallback: true,
    }),
    config.args ?? [],
  );
  return spawn(invocation.command, invocation.argv, {
    stdio: ["pipe", "pipe", "pipe"],
    env: mergedEnv,
    cwd: config.cwd,
    detached: process.platform !== "win32",
    windowsHide: invocation.windowsHide ?? process.platform === "win32",
    shell: invocation.shell,
  });
}
function createLspSession(serverName, child) {
  return {
    serverName,
    process: child,
    requestId: 0,
    pendingRequests: /* @__PURE__ */ new Map(),
    buffer: Buffer.alloc(0),
    initialized: false,
    capabilities: {},
    disposed: false,
  };
}
function registerActiveLspSession(session) {
  activeBundleLspSessions.add(session);
}
function rememberLspFailure(session, error) {
  session.failure ??= error;
}
function takePendingLspRequest(session, id) {
  const pending = session.pendingRequests.get(id);
  if (!pending) return;
  session.pendingRequests.delete(id);
  clearTimeout(pending.timeout);
  pending.dispose();
  return pending;
}
function failLspSession(session, error) {
  rememberLspFailure(session, error);
  for (const [id] of session.pendingRequests)
    takePendingLspRequest(session, id)?.reject(session.failure ?? error);
}
function lspProcessExitError(session, code, signal) {
  return /* @__PURE__ */ new Error(
    `LSP server "${session.serverName}" exited (${signal ?? code ?? "unknown"})`,
  );
}
function attachLspProcessHandlers(session) {
  session.process.on("error", (error) => {
    failLspSession(session, error);
  });
  session.process.on("exit", (code, signal) => {
    rememberLspFailure(session, lspProcessExitError(session, code, signal));
  });
  session.process.on("close", (code, signal) => {
    failLspSession(session, lspProcessExitError(session, code, signal));
  });
  session.process.stdout?.on("data", (chunk) => handleIncomingData(session, chunk));
  session.process.stdout?.on("error", (error) => {
    failLspSession(session, error);
  });
  session.process.stdin?.on("error", (error) => {
    failLspSession(session, error);
  });
  session.process.stderr?.setEncoding("utf-8");
  session.process.stderr?.on("data", (chunk) => {
    for (const line of chunk.split(/\r?\n/).filter(Boolean))
      logDebug(`bundle-lsp:${session.serverName}: ${line.trim()}`);
  });
  session.process.stderr?.on("error", (error) => {
    logWarn(`bundle-lsp:${session.serverName}: stderr failed: ${String(error)}`);
  });
}
function encodeLspMessage(body) {
  const json = JSON.stringify(body);
  return `Content-Length: ${Buffer.byteLength(json, "utf-8")}\r\n\r\n${json}`;
}
const LSP_HEADER_SEPARATOR = Buffer.from("\r\n\r\n", "ascii");
const MAX_LSP_HEADER_BYTES = 8 * 1024;
const MAX_LSP_BODY_BYTES = 64 * 1024 * 1024;
var LspFramingError = class extends Error {
  constructor(..._args) {
    super(..._args);
    this.name = "LspFramingError";
  }
};
function framingError(messages, detail) {
  return {
    ok: false,
    messages,
    error: new LspFramingError(`LSP framing error: ${detail}`),
  };
}
function parseContentLength(header) {
  const values = [];
  for (const line of header.split("\r\n")) {
    const separator = line.indexOf(":");
    if (separator === -1)
      return new LspFramingError("LSP framing error: header line must contain a colon");
    if (line.slice(0, separator).trim().toLowerCase() === "content-length")
      values.push(line.slice(separator + 1).trim());
  }
  if (values.length !== 1)
    return new LspFramingError(
      `LSP framing error: expected exactly one Content-Length header, received ${values.length}`,
    );
  const value = values[0];
  if (value === void 0 || !/^[0-9]+$/.test(value))
    return new LspFramingError("LSP framing error: Content-Length must be decimal digits");
  const length = Number(value);
  if (!Number.isSafeInteger(length) || length <= 0)
    return new LspFramingError("LSP framing error: Content-Length must be a positive safe integer");
  if (length > MAX_LSP_BODY_BYTES)
    return new LspFramingError(
      `LSP framing error: Content-Length exceeds ${MAX_LSP_BODY_BYTES} bytes`,
    );
  return length;
}
function parseLspMessages(buffer) {
  const messages = [];
  let remaining = buffer;
  while (true) {
    const headerEnd = remaining.indexOf(LSP_HEADER_SEPARATOR);
    if (headerEnd === -1) {
      const maxIncompleteHeaderBytes = MAX_LSP_HEADER_BYTES + LSP_HEADER_SEPARATOR.length - 1;
      return remaining.length > maxIncompleteHeaderBytes
        ? framingError(messages, `header exceeds ${MAX_LSP_HEADER_BYTES} bytes`)
        : {
            ok: true,
            messages,
            remaining,
          };
    }
    if (headerEnd > MAX_LSP_HEADER_BYTES)
      return framingError(messages, `header exceeds ${MAX_LSP_HEADER_BYTES} bytes`);
    const contentLength = parseContentLength(remaining.subarray(0, headerEnd).toString("ascii"));
    if (contentLength instanceof LspFramingError)
      return {
        ok: false,
        messages,
        error: contentLength,
      };
    const bodyStart = headerEnd + LSP_HEADER_SEPARATOR.length;
    const bodyEnd = bodyStart + contentLength;
    if (remaining.length < bodyEnd)
      return {
        ok: true,
        messages,
        remaining,
      };
    const body = remaining.subarray(bodyStart, bodyEnd).toString("utf8");
    try {
      messages.push(JSON.parse(body));
    } catch (error) {
      return framingError(
        messages,
        `body is not valid JSON: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
    remaining = remaining.subarray(bodyEnd);
  }
}
function lspAbortError(signal) {
  return signal?.reason instanceof Error
    ? signal.reason
    : createAbortError("LSP request aborted", { cause: signal?.reason });
}
function sendRequest(session, method, params, signal) {
  if (session.failure) return Promise.reject(session.failure);
  if (signal?.aborted) return Promise.reject(lspAbortError(signal));
  const id = ++session.requestId;
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      takePendingLspRequest(session, id)?.reject(
        /* @__PURE__ */ new Error(`LSP request ${method} timed out`),
      );
    }, 1e4);
    timeout.unref?.();
    const onAbort = () => {
      const pending = takePendingLspRequest(session, id);
      if (!pending) return;
      try {
        session.process.stdin?.write(
          encodeLspMessage({
            jsonrpc: "2.0",
            method: "$/cancelRequest",
            params: { id },
          }),
          "utf-8",
        );
      } catch {}
      pending.reject(lspAbortError(signal));
    };
    const dispose = () => signal?.removeEventListener("abort", onAbort);
    session.pendingRequests.set(id, {
      resolve,
      reject,
      timeout,
      dispose,
    });
    signal?.addEventListener("abort", onAbort, { once: true });
    const encoded = encodeLspMessage({
      jsonrpc: "2.0",
      id,
      method,
      params,
    });
    session.process.stdin?.write(encoded, "utf-8");
  });
}
function handleIncomingData(session, chunk) {
  session.buffer = Buffer.concat([
    session.buffer,
    typeof chunk === "string" ? Buffer.from(chunk, "utf8") : chunk,
  ]);
  const parsed = parseLspMessages(session.buffer);
  session.buffer = parsed.ok
    ? parsed.remaining.length === 0
      ? Buffer.alloc(0)
      : Buffer.from(parsed.remaining)
    : Buffer.alloc(0);
  for (const msg of parsed.messages) {
    if (typeof msg !== "object" || msg === null) continue;
    const record = msg;
    if ("id" in record && typeof record.id === "number") {
      const pending = takePendingLspRequest(session, record.id);
      if (pending)
        if ("error" in record) pending.reject(new Error(JSON.stringify(record.error)));
        else pending.resolve(record.result);
    }
    if ("method" in record && !("id" in record))
      logDebug(`bundle-lsp:${session.serverName}: notification ${String(record.method)}`);
  }
  if (!parsed.ok) {
    failLspSession(session, parsed.error);
    terminateLspProcessTree(session);
  }
}
async function initializeSession(session) {
  const result = await sendRequest(session, "initialize", {
    processId: process.pid,
    rootUri: null,
    capabilities: {
      textDocument: {
        hover: { contentFormat: ["plaintext", "markdown"] },
        completion: { completionItem: { snippetSupport: false } },
        definition: {},
        references: {},
      },
    },
  });
  session.process.stdin?.write(
    encodeLspMessage({
      jsonrpc: "2.0",
      method: "initialized",
      params: {},
    }),
    "utf-8",
  );
  session.initialized = true;
  return result?.capabilities ?? {};
}
function hasLspProcessExited(child) {
  return child.exitCode !== null || child.signalCode !== null;
}
function terminateLspProcessTree(session) {
  const pid = session.process.pid;
  if (pid && !hasLspProcessExited(session.process)) {
    killProcessTree(pid, { graceMs: LSP_PROCESS_TREE_KILL_GRACE_MS });
    return;
  }
  if (!hasLspProcessExited(session.process)) session.process.kill("SIGTERM");
}
async function disposeSession(session) {
  if (session.disposed) return;
  session.disposed = true;
  activeBundleLspSessions.delete(session);
  if (session.initialized)
    try {
      const shutdown = sendRequest(session, "shutdown").catch(() => void 0);
      await Promise.race([shutdown, delay(LSP_SHUTDOWN_GRACE_MS)]);
      session.process.stdin?.write(
        encodeLspMessage({
          jsonrpc: "2.0",
          method: "exit",
          params: null,
        }),
        "utf-8",
      );
    } catch {}
  for (const [id] of session.pendingRequests)
    takePendingLspRequest(session, id)?.reject(/* @__PURE__ */ new Error("LSP session disposed"));
  terminateLspProcessTree(session);
}
async function disposeSessions(sessions) {
  await Promise.allSettled(Array.from(sessions, (session) => disposeSession(session)));
}
function createLspPositionTool(params) {
  return {
    name: params.toolName,
    label: params.label,
    description: params.description,
    parameters: {
      type: "object",
      properties: {
        uri: {
          type: "string",
          description: "File URI (file:///path/to/file)",
        },
        line: {
          type: "number",
          description: "Zero-based line number",
        },
        character: {
          type: "number",
          description: "Zero-based character offset",
        },
      },
      required: ["uri", "line", "character"],
    },
    execute: async (_toolCallId, input, signal) => {
      const position = input;
      const result = await sendRequest(
        params.session,
        params.method,
        {
          textDocument: { uri: position.uri },
          position: {
            line: position.line,
            character: position.character,
          },
        },
        signal,
      );
      return formatLspResult(params.session.serverName, params.resultLabel, result);
    },
  };
}
function buildLspTools(session) {
  const tools = [];
  const caps = session.capabilities;
  const serverLabel = session.serverName;
  if (caps.hoverProvider)
    tools.push(
      createLspPositionTool({
        session,
        toolName: `lsp_hover_${serverLabel}`,
        label: `LSP Hover (${serverLabel})`,
        description: `Get hover information for a symbol at a position in a file via the ${serverLabel} language server.`,
        method: "textDocument/hover",
        resultLabel: "hover",
      }),
    );
  if (caps.definitionProvider)
    tools.push(
      createLspPositionTool({
        session,
        toolName: `lsp_definition_${serverLabel}`,
        label: `LSP Go to Definition (${serverLabel})`,
        description: `Find the definition of a symbol at a position in a file via the ${serverLabel} language server.`,
        method: "textDocument/definition",
        resultLabel: "definition",
      }),
    );
  if (caps.referencesProvider)
    tools.push({
      name: `lsp_references_${serverLabel}`,
      label: `LSP Find References (${serverLabel})`,
      description: `Find all references to a symbol at a position in a file via the ${serverLabel} language server.`,
      parameters: {
        type: "object",
        properties: {
          uri: {
            type: "string",
            description: "File URI (file:///path/to/file)",
          },
          line: {
            type: "number",
            description: "Zero-based line number",
          },
          character: {
            type: "number",
            description: "Zero-based character offset",
          },
          includeDeclaration: {
            type: "boolean",
            description: "Include the declaration in results",
          },
        },
        required: ["uri", "line", "character"],
      },
      execute: async (_toolCallId, input, signal) => {
        const params = input;
        const result = await sendRequest(
          session,
          "textDocument/references",
          {
            textDocument: { uri: params.uri },
            position: {
              line: params.line,
              character: params.character,
            },
            context: { includeDeclaration: params.includeDeclaration ?? true },
          },
          signal,
        );
        return formatLspResult(serverLabel, "references", result);
      },
    });
  return tools;
}
function formatLspResult(serverName, method, result) {
  return {
    content: [
      {
        type: "text",
        text:
          result !== null && result !== void 0
            ? JSON.stringify(result, null, 2)
            : `No ${method} result from ${serverName}`,
      },
    ],
    details: {
      lspServer: serverName,
      lspMethod: method,
    },
  };
}
async function createBundleLspToolRuntime(params) {
  const loaded = loadEmbeddedAgentLspConfig({
    workspaceDir: params.workspaceDir,
    cfg: params.cfg,
    manifestRegistry: params.manifestRegistry,
  });
  for (const diagnostic of loaded.diagnostics)
    logWarn(`bundle-lsp: ${diagnostic.pluginId}: ${diagnostic.message}`);
  if (Object.keys(loaded.lspServers).length === 0)
    return {
      tools: [],
      sessions: [],
      dispose: async () => {},
    };
  const reservedNames = new Set(
    Array.from(params.reservedToolNames ?? [], (name) =>
      normalizeOptionalLowercaseString(name),
    ).filter(Boolean),
  );
  const sessions = [];
  const tools = [];
  try {
    for (const [serverName, rawServer] of Object.entries(loaded.lspServers)) {
      const launch = resolveStdioMcpServerLaunchConfig(rawServer);
      if (!launch.ok) {
        logWarn(`bundle-lsp: skipped server "${serverName}" because ${launch.reason}.`);
        continue;
      }
      const launchConfig = launch.config;
      let session;
      try {
        session = createLspSession(serverName, spawnLspServerProcess(launchConfig));
        registerActiveLspSession(session);
        attachLspProcessHandlers(session);
        const capabilities = await initializeSession(session);
        session.capabilities = capabilities;
        sessions.push(session);
        const serverTools = buildLspTools(session);
        for (const tool of serverTools) {
          const normalizedName = normalizeOptionalLowercaseString(tool.name);
          if (!normalizedName) continue;
          if (reservedNames.has(normalizedName)) {
            logWarn(
              `bundle-lsp: skipped tool "${tool.name}" from server "${serverName}" because the name already exists.`,
            );
            continue;
          }
          reservedNames.add(normalizedName);
          setPluginToolMeta(tool, {
            pluginId: "bundle-lsp",
            optional: false,
          });
          tools.push(tool);
        }
        logDebug(
          `bundle-lsp: started "${serverName}" (${describeStdioMcpServerLaunchConfig(launchConfig)}) with ${serverTools.length} tools`,
        );
      } catch (error) {
        if (session) await disposeSession(session);
        logWarn(
          `bundle-lsp: failed to start server "${serverName}" (${describeStdioMcpServerLaunchConfig(launchConfig)}): ${String(error)}`,
        );
      }
    }
    return {
      tools,
      sessions: sessions.map((s) => ({
        serverName: s.serverName,
        capabilities: s.capabilities,
      })),
      dispose: async () => {
        await disposeSessions(sessions);
      },
    };
  } catch (error) {
    await disposeSessions(sessions);
    throw error;
  }
}
async function disposeAllBundleLspRuntimes() {
  await disposeSessions(activeBundleLspSessions);
}
//#endregion
export {
  disposeAllBundleLspRuntimes as n,
  spawnLspServerProcess as r,
  createBundleLspToolRuntime as t,
};
