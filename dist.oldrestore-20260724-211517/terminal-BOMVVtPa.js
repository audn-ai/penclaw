import { a as stripAnsiSequences } from "./ansi-D4OHEz5F.js";
import { t as BoundedBuffer } from "./bounded-buffer-C08_hwby.js";
import { n as errorShape, t as ErrorCodes } from "./error-codes-O0AkRNx7.js";
import { r as resolveTerminalSpawnPlan, t as buildTerminalEnv } from "./launch-BJTXKX1H.js";
import {
  l as resolveNodeCommandAllowlist,
  o as isNodeCommandAllowed,
} from "./node-command-policy-pdhFRd-t.js";
import { a as NODE_DUPLEX_INVOKE_IDLE_TIMEOUT_MS } from "./node-commands-zATGYJg5.js";
import { t as applyPluginNodeInvokePolicy } from "./node-invoke-plugin-policy-C2wyaeel.js";
import { n as surrogateSafeTail } from "./output-ring-Bz-YhhYd.js";
import { n as resolveSessionCatalogProvider } from "./session-catalog-DVKnKnTB.js";
import {
  Ci as validateTerminalAttachParams,
  Di as validateTerminalOpenParams,
  Ei as validateTerminalInputParams,
  Oi as validateTerminalResizeParams,
  ki as validateTerminalTextParams,
  wi as validateTerminalCloseParams,
} from "./src-CIJf1lT0.js";
import { t as formatValidationErrors } from "./validation-errors-B9K6VbD7.js";
//#region src/gateway/terminal/buffer-text.ts
const C0_EXCEPT_TAB_CR_LF = `${String.fromCharCode(0)}-${String.fromCharCode(8)}${String.fromCharCode(11)}${String.fromCharCode(12)}${String.fromCharCode(14)}-${String.fromCharCode(31)}${String.fromCharCode(127)}`;
const C1 = `${String.fromCharCode(128)}-${String.fromCharCode(159)}`;
const CONTROL_BYTES_REGEX = new RegExp(`[${C0_EXCEPT_TAB_CR_LF}${C1}]`, "g");
/**
 * Approximates what a terminal would show without running a VT emulator:
 * strips ANSI sequences, collapses carriage-return overwrites (progress bars
 * emit "10%\r20%\r30%" — keep the last write per line), and drops remaining
 * C0/C1 control bytes. Cursor-movement layouts (vim, htop) will not reconstruct
 * faithfully; a true screen snapshot is a tracked follow-up.
 */
function renderTerminalBufferText(raw) {
  return stripAnsiSequences(raw)
    .split("\n")
    .map((line) => {
      const segments = line.split("\r");
      const last = segments[segments.length - 1];
      return (
        (last === "" && segments.length > 1 ? segments[segments.length - 2] : last) ?? ""
      ).replace(CONTROL_BYTES_REGEX, "");
    })
    .join("\n");
}
//#endregion
//#region src/gateway/terminal/node-relay.ts
const DATA_INPUT_CHUNK_BYTES = 2 * 1024;
const MAX_PENDING_DATA_CHARS = 512 * 1024;
function parseExit(result) {
  if (!result.ok)
    return {
      error: `${result.error?.code ?? "NODE_INVOKE_FAILED"}: ${result.error?.message ?? "node terminal invoke failed"}`,
    };
  try {
    const raw =
      result.payloadJSON ?? (result.payload === void 0 ? void 0 : JSON.stringify(result.payload));
    if (!raw) return { exitCode: 0 };
    const value = JSON.parse(raw);
    if (!value || typeof value !== "object" || Array.isArray(value)) return { exitCode: 0 };
    const record = value;
    return {
      ...(typeof record.exitCode === "number" ? { exitCode: record.exitCode } : {}),
      ...(typeof record.signal === "number" ? { signal: record.signal } : {}),
    };
  } catch {
    return { error: "node terminal returned an invalid exit result" };
  }
}
function splitInput(data) {
  const chunks = [];
  let start = 0;
  let bytes = 0;
  for (let index = 0; index < data.length; index += 1) {
    const codePoint = data.codePointAt(index);
    if (codePoint === void 0) break;
    const char = String.fromCodePoint(codePoint);
    const size = Buffer.byteLength(char, "utf8");
    if (bytes > 0 && bytes + size > DATA_INPUT_CHUNK_BYTES) {
      chunks.push(data.slice(start, index));
      start = index;
      bytes = 0;
    }
    bytes += size;
    if (char.length === 2) index += 1;
  }
  if (start < data.length) chunks.push(data.slice(start));
  return chunks;
}
async function createNodeRelayBackend(params) {
  let invokeId;
  let dataCallback;
  let exitCallback;
  const pendingData = new BoundedBuffer(
    MAX_PENDING_DATA_CHARS,
    {
      mode: "drop-oldest",
      fit: surrogateSafeTail,
    },
    (chunk) => chunk.length,
  );
  let pendingExit;
  const abort = new AbortController();
  const result = params.registry
    .invoke({
      nodeId: params.nodeId,
      expectedConnId: params.expectedConnId,
      command: params.command,
      params: params.params,
      timeoutMs: 0,
      idleTimeoutMs: NODE_DUPLEX_INVOKE_IDLE_TIMEOUT_MS,
      signal: abort.signal,
      onInvokeId: (id) => {
        invokeId = id;
      },
      onProgress: (chunk) => {
        if (!chunk) return;
        if (dataCallback) dataCallback(chunk);
        else pendingData.push(chunk);
      },
    })
    .then(parseExit)
    .catch((error) => ({ error: error instanceof Error ? error.message : String(error) }))
    .then((exit) => {
      if (exitCallback) exitCallback(exit);
      else pendingExit = exit;
      return exit;
    });
  await Promise.resolve();
  if (!invokeId) {
    const exit = await result;
    throw new Error(exit.error ?? "failed to start node terminal invoke");
  }
  const activeInvokeId = invokeId;
  const send = (payload) => params.registry.sendInvokeInput(activeInvokeId, payload);
  return {
    write(data) {
      for (const chunk of splitInput(data))
        send({
          kind: "data",
          data: chunk,
        });
    },
    resize(cols, rows) {
      send({
        kind: "resize",
        cols,
        rows,
      });
    },
    kill() {
      abort.abort();
    },
    onData(callback) {
      dataCallback = callback;
      for (const chunk of pendingData.drain()) callback(chunk);
    },
    onExit(callback) {
      exitCallback = callback;
      if (pendingExit) {
        const exit = pendingExit;
        pendingExit = void 0;
        callback(exit);
      }
    },
  };
}
//#endregion
//#region src/gateway/server-methods/terminal-open-plan.ts
function authorizeCatalogTerminalNode(context, plan) {
  const node = context.nodeRegistry.get(plan.nodeId);
  if (!node)
    return {
      ok: false,
      message: "catalog terminal node is not connected",
    };
  if (!node.commands.includes(plan.command))
    return {
      ok: false,
      message: "catalog terminal command is not available",
    };
  const allowlist = resolveNodeCommandAllowlist(context.getRuntimeConfig(), {
    ...node,
    approvedCommands: node.commands,
  });
  const allowed = isNodeCommandAllowed({
    command: plan.command,
    declaredCommands: node.commands,
    allowlist,
  });
  return allowed.ok
    ? {
        ok: true,
        node,
      }
    : {
        ok: false,
        message: allowed.reason,
      };
}
function resolveTerminalOpenSpawnPlan(launchPlan, catalogPlan) {
  if (!catalogPlan) return resolveTerminalSpawnPlan(launchPlan);
  if (catalogPlan.kind === "local")
    return resolveTerminalSpawnPlan({
      ...launchPlan,
      initialCommand: catalogPlan.argv,
      cwdOverride: catalogPlan.cwd,
    });
  return {
    agentId: launchPlan.agentId,
    cwd: catalogPlan.cwd ?? launchPlan.cwd,
    shell: catalogPlan.title ?? catalogPlan.command,
    args: [],
  };
}
//#endregion
//#region src/gateway/server-methods/terminal.ts
function invalid(respond, detail) {
  respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, detail));
}
function requireConnId(opts) {
  const connId = opts.client?.connId;
  if (!connId) {
    invalid(opts.respond, "terminal requires an authenticated connection");
    return null;
  }
  return connId;
}
function terminalEnabled(context) {
  return context.isTerminalEnabled();
}
function respondLaunchBlocked(respond, block) {
  if (block.kind === "disabled") {
    respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "terminal is disabled"));
    return;
  }
  if (block.kind === "unknown-agent") {
    respond(
      false,
      void 0,
      errorShape(ErrorCodes.INVALID_REQUEST, `unknown agent "${block.agentId}"`),
    );
    return;
  }
  respond(
    false,
    void 0,
    errorShape(
      ErrorCodes.INVALID_REQUEST,
      `terminal unavailable: agent "${block.agentId}" runs in a sandbox (mode "${block.mode}"); in-sandbox terminals are not supported yet`,
    ),
  );
}
/** Handlers for the operator terminal method family. */
const terminalHandlers = {
  "terminal.open": async (opts) => {
    const { params, respond, context } = opts;
    if (!validateTerminalOpenParams(params)) {
      invalid(
        respond,
        `invalid terminal.open params: ${formatValidationErrors(validateTerminalOpenParams.errors)}`,
      );
      return;
    }
    const connId = requireConnId(opts);
    if (!connId) return;
    const manager = context.terminalSessions;
    if (!manager) {
      respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "terminal is not available"));
      return;
    }
    const p = params;
    const launch = context.resolveTerminalLaunchPolicy(p.agentId);
    if (!launch.ok) {
      respondLaunchBlocked(respond, launch.block);
      return;
    }
    let catalogPlan;
    let title;
    let createBackend;
    let nodeRelay;
    if (p.catalog) {
      const provider = resolveSessionCatalogProvider(p.catalog.catalogId);
      if (!provider) {
        respond(
          false,
          void 0,
          errorShape(ErrorCodes.INVALID_REQUEST, `unknown session catalog: ${p.catalog.catalogId}`),
        );
        return;
      }
      if (!provider.openTerminal) {
        respond(
          false,
          void 0,
          errorShape(ErrorCodes.INVALID_REQUEST, "session catalog cannot open terminals"),
        );
        return;
      }
      try {
        catalogPlan = await provider.openTerminal({
          hostId: p.catalog.hostId,
          threadId: p.catalog.threadId,
        });
      } catch (error) {
        respond(
          false,
          void 0,
          errorShape(
            ErrorCodes.INVALID_REQUEST,
            error instanceof Error ? error.message : "catalog terminal open failed",
          ),
        );
        return;
      }
      title = catalogPlan.title;
      if (catalogPlan.kind === "local") {
        if (catalogPlan.argv.length === 0) {
          invalid(respond, "catalog terminal plan has no command");
          return;
        }
      } else {
        const nodeCatalogPlan = catalogPlan;
        const access = authorizeCatalogTerminalNode(context, nodeCatalogPlan);
        if (!access.ok) {
          respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, access.message));
          return;
        }
        let nodeParams;
        try {
          const parsed = JSON.parse(catalogPlan.paramsJSON);
          if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
            throw new Error("invalid params");
          nodeParams = {
            ...parsed,
            cols: p.cols,
            rows: p.rows,
          };
        } catch {
          invalid(respond, "catalog terminal plan has invalid params");
          return;
        }
        const policyResult = await applyPluginNodeInvokePolicy({
          context,
          client: opts.client,
          nodeSession: access.node,
          command: nodeCatalogPlan.command,
          params: nodeParams,
        });
        if (policyResult && !policyResult.ok) {
          respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, policyResult.message));
          return;
        }
        nodeRelay = {
          plan: nodeCatalogPlan,
          params: nodeParams,
        };
      }
    }
    if (context.isConnectionActive?.(connId) === false) {
      respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "terminal connection closed"));
      return;
    }
    if (!terminalEnabled(context)) {
      respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "terminal is disabled"));
      return;
    }
    const refreshedLaunch = context.resolveTerminalLaunchPolicy(p.agentId);
    if (!refreshedLaunch.ok) {
      respondLaunchBlocked(respond, refreshedLaunch.block);
      return;
    }
    if (nodeRelay) {
      const relay = nodeRelay;
      const access = authorizeCatalogTerminalNode(context, relay.plan);
      if (!access.ok) {
        respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, access.message));
        return;
      }
      createBackend = async () =>
        await createNodeRelayBackend({
          registry: context.nodeRegistry,
          nodeId: relay.plan.nodeId,
          expectedConnId: access.node.connId,
          command: relay.plan.command,
          params: relay.params,
        });
    }
    const spawnPlan = resolveTerminalOpenSpawnPlan(refreshedLaunch.plan, catalogPlan);
    const outcome = await manager.open({
      connId,
      agentId: spawnPlan.agentId,
      cwd: spawnPlan.cwd,
      shell: spawnPlan.shell,
      args: spawnPlan.args,
      cols: p.cols,
      rows: p.rows,
      env: buildTerminalEnv(process.env),
      ...(createBackend ? { createBackend } : {}),
    });
    if (!outcome.ok) {
      respond(
        false,
        void 0,
        errorShape(
          outcome.code === "limit" ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE,
          outcome.message,
        ),
      );
      return;
    }
    context.logGateway.info(
      `terminal opened session=${outcome.sessionId} agent=${outcome.agentId} conn=${connId} shell=${outcome.shell}`,
    );
    respond(true, {
      sessionId: outcome.sessionId,
      agentId: outcome.agentId,
      shell: outcome.shell,
      cwd: outcome.cwd,
      confined: false,
      ...(title ? { title } : {}),
    });
  },
  "terminal.input": async (opts) => {
    const { params, respond, context } = opts;
    if (!validateTerminalInputParams(params)) {
      invalid(
        respond,
        `invalid terminal.input params: ${formatValidationErrors(validateTerminalInputParams.errors)}`,
      );
      return;
    }
    const connId = requireConnId(opts);
    if (!connId) return;
    const p = params;
    if (!terminalEnabled(context)) {
      context.terminalSessions?.close(connId, p.sessionId);
      respond(true, { ok: false });
      return;
    }
    respond(true, { ok: context.terminalSessions?.write(connId, p.sessionId, p.data) ?? false });
  },
  "terminal.resize": async (opts) => {
    const { params, respond, context } = opts;
    if (!validateTerminalResizeParams(params)) {
      invalid(
        respond,
        `invalid terminal.resize params: ${formatValidationErrors(validateTerminalResizeParams.errors)}`,
      );
      return;
    }
    const connId = requireConnId(opts);
    if (!connId) return;
    const p = params;
    if (!terminalEnabled(context)) {
      context.terminalSessions?.close(connId, p.sessionId);
      respond(true, { ok: false });
      return;
    }
    respond(true, {
      ok: context.terminalSessions?.resize(connId, p.sessionId, p.cols, p.rows) ?? false,
    });
  },
  "terminal.close": async (opts) => {
    const { params, respond, context } = opts;
    if (!validateTerminalCloseParams(params)) {
      invalid(
        respond,
        `invalid terminal.close params: ${formatValidationErrors(validateTerminalCloseParams.errors)}`,
      );
      return;
    }
    const connId = requireConnId(opts);
    if (!connId) return;
    const p = params;
    respond(true, { ok: context.terminalSessions?.close(connId, p.sessionId) ?? false });
  },
  "terminal.attach": async (opts) => {
    const { params, respond, context } = opts;
    if (!validateTerminalAttachParams(params)) {
      invalid(
        respond,
        `invalid terminal.attach params: ${formatValidationErrors(validateTerminalAttachParams.errors)}`,
      );
      return;
    }
    const connId = requireConnId(opts);
    if (!connId) return;
    const p = params;
    if (!context.terminalSessions || !terminalEnabled(context)) {
      respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "terminal is not available"));
      return;
    }
    const attached = context.terminalSessions.attach(connId, p.sessionId);
    if (!attached) {
      respond(
        false,
        void 0,
        errorShape(ErrorCodes.INVALID_REQUEST, `unknown terminal session "${p.sessionId}"`),
      );
      return;
    }
    context.logGateway.info(
      `terminal attached session=${attached.sessionId} agent=${attached.agentId} conn=${connId}`,
    );
    respond(true, {
      sessionId: attached.sessionId,
      agentId: attached.agentId,
      shell: attached.shell,
      cwd: attached.cwd,
      confined: false,
      buffer: attached.buffer,
    });
  },
  "terminal.list": async (opts) => {
    const { respond, context } = opts;
    if (!requireConnId(opts)) return;
    respond(true, {
      sessions:
        context.terminalSessions && terminalEnabled(context)
          ? context.terminalSessions.list().map((session) => ({
              sessionId: session.sessionId,
              agentId: session.agentId,
              shell: session.shell,
              cwd: session.cwd,
              confined: false,
              attached: session.attached,
              createdAtMs: session.createdAtMs,
            }))
          : [],
    });
  },
  "terminal.text": async (opts) => {
    const { params, respond, context } = opts;
    if (!validateTerminalTextParams(params)) {
      invalid(
        respond,
        `invalid terminal.text params: ${formatValidationErrors(validateTerminalTextParams.errors)}`,
      );
      return;
    }
    if (!requireConnId(opts)) return;
    const p = params;
    if (!context.terminalSessions || !terminalEnabled(context)) {
      respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "terminal is not available"));
      return;
    }
    const raw = context.terminalSessions.snapshot(p.sessionId);
    if (raw === void 0) {
      respond(
        false,
        void 0,
        errorShape(ErrorCodes.INVALID_REQUEST, `unknown terminal session "${p.sessionId}"`),
      );
      return;
    }
    respond(true, { text: renderTerminalBufferText(raw) });
  },
};
//#endregion
export { terminalHandlers };
