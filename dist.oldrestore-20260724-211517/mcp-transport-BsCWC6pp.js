import { spawn } from "node:child_process";
import process from "node:process";
import { PassThrough } from "node:stream";
import "./errors-BoHeli7m.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { getDefaultEnvironment } from "@modelcontextprotocol/sdk/client/stdio.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { ReadBuffer, serializeMessage } from "@modelcontextprotocol/sdk/shared/stdio.js";
import { AjvJsonSchemaValidator } from "@modelcontextprotocol/sdk/validation/ajv-provider.js";
import { Compile } from "typebox/compile";
import { r as toErrorObject } from "./error-coercion-CrJRoLe1.js";
import { n as signalProcessTree, t as killProcessTree } from "./kill-tree-Cr15jS_s.js";
import { t as prepareOomScoreAdjustedSpawn } from "./linux-oom-score-eO5nXmjv.js";
import { t as logDebug } from "./logger-BegyOJlO.js";
import {
  a as resolveMcpTransportConfig,
  d as withSameOriginMcpHttpHeaders,
  f as withoutMcpAuthorizationHeader,
  i as withMcpAuthProfileBearer,
  n as resolveMcpAuthProfileId,
  s as createMcpOAuthClientProvider,
  u as buildMcpHttpFetch,
} from "./mcp-auth-profile-Cy6hOvQm.js";
import {
  n as findJsonSchemaShapeError,
  r as normalizeJsonSchemaForTypeBox,
} from "./schema-validator-BAYKPBuJ.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region src/agents/agent-bundle-mcp-filter.ts
/** Match the documented MCP tool-filter glob syntax: exact text plus `*`. */
function matchesMcpToolFilterPattern(pattern, value) {
  const trimmed = pattern.trim();
  if (!trimmed) return false;
  if (!trimmed.includes("*")) return trimmed === value;
  const parts = trimmed.split("*");
  const first = parts[0] ?? "";
  const last = parts.at(-1) ?? "";
  let cursor = 0;
  if (first) {
    if (!value.startsWith(first)) return false;
    cursor = first.length;
  }
  const endBound = last ? value.length - last.length : value.length;
  if (last && (!value.endsWith(last) || endBound < cursor)) return false;
  for (const part of parts.slice(1, -1)) {
    if (!part) continue;
    const index = value.indexOf(part, cursor);
    if (index === -1 || index + part.length > endBound) return false;
    cursor = index + part.length;
  }
  return true;
}
//#endregion
//#region src/agents/mcp-json-schema-validator.ts
const DRAFT_2020_12_SCHEMA = "https://json-schema.org/draft/2020-12/schema";
function isDraft202012Schema(schema) {
  return schema.$schema === DRAFT_2020_12_SCHEMA;
}
function formatTypeBoxErrors(errors) {
  return (
    errors
      .map((error) => {
        const message = error.message?.trim() || "schema validation failed";
        return error.instancePath ? `${error.instancePath} ${message}` : message;
      })
      .join(", ") || "schema validation failed"
  );
}
const schemaMapKeywords = /* @__PURE__ */ new Set([
  "$defs",
  "definitions",
  "dependentSchemas",
  "patternProperties",
  "properties",
]);
const schemaValueKeywords = /* @__PURE__ */ new Set([
  "additionalItems",
  "additionalProperties",
  "contains",
  "else",
  "if",
  "items",
  "not",
  "propertyNames",
  "then",
  "unevaluatedItems",
  "unevaluatedProperties",
]);
const schemaArrayKeywords = /* @__PURE__ */ new Set(["allOf", "anyOf", "oneOf", "prefixItems"]);
function stripSchemaMapFormats(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return value;
  return Object.fromEntries(
    Object.entries(value).map(([key, entry]) => [key, stripJsonSchemaFormats(entry)]),
  );
}
function expandJsonSchemaTypeArray(schema) {
  const { type, ...rest } = schema;
  if (!Array.isArray(type)) return schema;
  return { anyOf: type.map((entry) => Object.assign({}, rest, { type: entry })) };
}
function stripJsonSchemaFormats(schema) {
  if (Array.isArray(schema)) return schema.map((entry) => stripJsonSchemaFormats(entry));
  if (!schema || typeof schema !== "object") return schema;
  const normalizedSchema = expandJsonSchemaTypeArray(schema);
  return Object.fromEntries(
    Object.entries(normalizedSchema)
      .filter(([key]) => key !== "format")
      .map(([key, value]) => {
        if (schemaMapKeywords.has(key)) return [key, stripSchemaMapFormats(value)];
        if (key === "dependencies") return [key, stripSchemaMapFormats(value)];
        if (schemaValueKeywords.has(key) || schemaArrayKeywords.has(key))
          return [key, stripJsonSchemaFormats(value)];
        return [key, value];
      }),
  );
}
/** MCP SDK validator with draft-2020-12 support for external tool schemas. */
function createMcpJsonSchemaValidator() {
  const defaultValidator = new AjvJsonSchemaValidator();
  return {
    getValidator(schema) {
      if (!isDraft202012Schema(schema)) return defaultValidator.getValidator(schema);
      let validator;
      try {
        const schemaError = findJsonSchemaShapeError(schema);
        if (schemaError) throw new Error(schemaError);
        validator = Compile(normalizeJsonSchemaForTypeBox(stripJsonSchemaFormats(schema)));
      } catch (error) {
        const setupError = toErrorObject(error, "schema setup failed");
        throw new Error(`Invalid MCP draft-2020-12 JSON Schema: ${setupError.message}`, {
          cause: error,
        });
      }
      return (input) => {
        if (validator.Check(input))
          return {
            valid: true,
            data: input,
            errorMessage: void 0,
          };
        return {
          valid: false,
          data: void 0,
          errorMessage: formatTypeBoxErrors([...validator.Errors(input)]),
        };
      };
    },
  };
}
//#endregion
//#region src/agents/mcp-metadata.ts
const MCP_METADATA_TEXT_LIMIT = 1200;
/** Scrubs untrusted MCP metadata before exposing it to a model. */
function sanitizeMcpMetadataText(value) {
  const normalized = normalizeOptionalString(value);
  if (!normalized) return;
  const scrubbed = normalized
    .replace(
      /ignore\s+(?:all\s+)?(?:previous|prior|above)\s+instructions/gi,
      "[redacted MCP metadata instruction]",
    )
    .replace(
      /disregard\s+(?:all\s+)?(?:previous|prior|above)\s+instructions/gi,
      "[redacted MCP metadata instruction]",
    )
    .replace(/system\s+prompt/gi, "system prompt");
  return scrubbed.length > MCP_METADATA_TEXT_LIMIT
    ? `${truncateUtf16Safe(scrubbed, MCP_METADATA_TEXT_LIMIT)}...`
    : scrubbed;
}
//#endregion
//#region src/agents/mcp-stdio-transport.ts
/**
 * OpenClaw stdio transport wrapper for MCP server subprocesses.
 */
const CLOSE_TIMEOUT_MS = 2e3;
const SIGKILL_REAP_TIMEOUT_MS = 500;
function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms).unref();
  });
}
var OpenClawStdioClientTransport = class {
  constructor(serverParams) {
    this.serverParams = serverParams;
    this.readBuffer = new ReadBuffer();
    this.stderrStream = null;
    if (serverParams.stderr === "pipe" || serverParams.stderr === "overlapped")
      this.stderrStream = new PassThrough();
  }
  async start() {
    if (this.process)
      throw new Error(
        "OpenClawStdioClientTransport already started; Client.connect() starts transports automatically.",
      );
    await new Promise((resolve, reject) => {
      const baseEnv = {
        ...getDefaultEnvironment(),
        ...this.serverParams.env,
      };
      const preparedSpawn = prepareOomScoreAdjustedSpawn(
        this.serverParams.command,
        this.serverParams.args ?? [],
        { env: baseEnv },
      );
      const child = spawn(preparedSpawn.command, preparedSpawn.args, {
        cwd: this.serverParams.cwd,
        detached: process.platform !== "win32",
        env: preparedSpawn.env,
        shell: false,
        stdio: ["pipe", "pipe", this.serverParams.stderr ?? "inherit"],
        windowsHide: process.platform === "win32",
      });
      this.process = child;
      child.on("error", (error) => {
        reject(error);
        this.onerror?.(error);
      });
      child.on("spawn", () => resolve());
      child.on("close", () => {
        this.process = void 0;
        this.onclose?.();
      });
      child.stdin?.on("error", (error) => this.onerror?.(error));
      child.stdout?.on("data", (chunk) => {
        this.readBuffer.append(chunk);
        this.processReadBuffer();
      });
      child.stdout?.on("error", (error) => this.onerror?.(error));
      if (this.stderrStream && child.stderr) {
        child.stderr.on("error", (error) => this.onerror?.(error));
        child.stderr.pipe(this.stderrStream);
      }
    });
  }
  get stderr() {
    return this.stderrStream ?? this.process?.stderr ?? null;
  }
  get pid() {
    return this.process?.pid ?? this.closingProcess?.pid ?? null;
  }
  processReadBuffer() {
    while (true)
      try {
        const message = this.readBuffer.readMessage();
        if (message === null) break;
        this.onmessage?.(message);
      } catch (error) {
        this.onerror?.(error instanceof Error ? error : new Error(String(error)));
      }
  }
  async close() {
    const processToClose = this.process ?? this.closingProcess;
    this.process = void 0;
    this.closingProcess = processToClose;
    if (processToClose) this.closingProcess = processToClose;
    if (processToClose) {
      const closePromise = new Promise((resolve) => {
        processToClose.once("close", () => resolve());
      });
      try {
        processToClose.stdin?.end();
      } catch {}
      await Promise.race([closePromise, delay(CLOSE_TIMEOUT_MS)]);
      if (processToClose.exitCode === null && processToClose.pid) {
        killProcessTree(processToClose.pid);
        await Promise.race([closePromise, delay(CLOSE_TIMEOUT_MS)]);
        if (processToClose.exitCode === null && processToClose.pid) {
          signalProcessTree(processToClose.pid, "SIGKILL");
          await Promise.race([closePromise, delay(SIGKILL_REAP_TIMEOUT_MS)]);
        }
      }
    }
    if (this.closingProcess === processToClose) this.closingProcess = void 0;
    this.readBuffer.clear();
  }
  async forceClose() {
    const processToClose = this.process ?? this.closingProcess;
    this.process = void 0;
    if (processToClose?.pid && processToClose.exitCode === null) {
      const closePromise = new Promise((resolve) => {
        processToClose.once("close", () => resolve());
      });
      signalProcessTree(processToClose.pid, "SIGKILL");
      await Promise.race([closePromise, delay(SIGKILL_REAP_TIMEOUT_MS)]);
    }
    if (this.closingProcess === processToClose) this.closingProcess = void 0;
    this.readBuffer.clear();
  }
  send(message) {
    return new Promise((resolve, reject) => {
      const stdin = this.process?.stdin;
      if (!stdin) throw new Error("Not connected");
      const json = serializeMessage(message);
      try {
        if (
          !stdin.write(json, (err) => {
            if (err) reject(err);
            else resolve();
          })
        )
          stdin.once("drain", () => {});
      } catch (err) {
        reject(err instanceof Error ? err : new Error(String(err)));
      }
    });
  }
};
//#endregion
//#region src/agents/mcp-transport.ts
/**
 * MCP client transport factory.
 *
 * This module turns normalized MCP server config into stdio, SSE, or
 * streamable-HTTP SDK transports with OpenClaw auth, redirect, and logging rules.
 */
function attachStderrLogging(serverName, transport) {
  const stderr = transport.stderr;
  if (!stderr || typeof stderr.on !== "function") return;
  const onData = (chunk) => {
    const message =
      normalizeOptionalString(typeof chunk === "string" ? chunk : String(chunk)) ?? "";
    if (!message) return;
    for (const line of message.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (trimmed) logDebug(`bundle-mcp:${serverName}: ${trimmed}`);
    }
  };
  stderr.on("data", onData);
  return () => {
    if (typeof stderr.off === "function") stderr.off("data", onData);
    else if (typeof stderr.removeListener === "function") stderr.removeListener("data", onData);
  };
}
function buildSseEventSourceFetch(headers, baseFetch) {
  return (url, init) => {
    const mergedHeaders = {};
    for (const [key, value] of new Headers(init?.headers)) mergedHeaders[key.toLowerCase()] = value;
    for (const [key, value] of Object.entries(headers)) mergedHeaders[key.toLowerCase()] = value;
    return baseFetch(url, {
      ...init,
      headers: mergedHeaders,
    });
  };
}
/** Resolves a configured MCP server into a live SDK transport instance. */
function resolveMcpTransport(serverName, rawServer, options) {
  const resolved = resolveMcpTransportConfig(serverName, rawServer);
  if (!resolved) return null;
  if (resolved.kind === "stdio") {
    const transport = new OpenClawStdioClientTransport({
      command: resolved.command,
      args: resolved.args,
      env: resolved.env,
      cwd: resolved.cwd,
      stderr: "pipe",
    });
    return {
      transport,
      description: resolved.description,
      transportType: "stdio",
      connectionTimeoutMs: resolved.connectionTimeoutMs,
      requestTimeoutMs: resolved.requestTimeoutMs,
      supportsParallelToolCalls: resolved.supportsParallelToolCalls,
      detachStderr: attachStderrLogging(serverName, transport),
    };
  }
  const authProfileId = resolveMcpAuthProfileId(rawServer);
  const authProvider =
    resolved.auth === "oauth" && !authProfileId
      ? createMcpOAuthClientProvider({
          serverName,
          serverUrl: resolved.url,
          config: resolved.oauth,
        })
      : void 0;
  const baseFetch = buildMcpHttpFetch({
    sslVerify: resolved.sslVerify,
    clientCert: resolved.clientCert,
    clientKey: resolved.clientKey,
    resourceUrl: resolved.url,
  });
  const headers =
    resolved.auth === "oauth" || authProfileId
      ? withoutMcpAuthorizationHeader(resolved.headers)
      : resolved.headers;
  const httpFetch = authProfileId
    ? withMcpAuthProfileBearer({
        fetchFn: baseFetch,
        serverName,
        resourceUrl: resolved.url,
        headers,
        authProfileId,
        cfg: options?.cfg,
        agentDir: options?.agentDir,
      })
    : resolved.auth === "oauth"
      ? withSameOriginMcpHttpHeaders({
          fetchFn: baseFetch,
          headers,
          resourceUrl: resolved.url,
        })
      : baseFetch;
  if (resolved.transportType === "streamable-http")
    return {
      transport: new StreamableHTTPClientTransport(new URL(resolved.url), {
        requestInit: resolved.auth === "oauth" || !headers ? void 0 : { headers },
        fetch: httpFetch,
        authProvider,
      }),
      description: resolved.description,
      transportType: "streamable-http",
      connectionTimeoutMs: resolved.connectionTimeoutMs,
      requestTimeoutMs: resolved.requestTimeoutMs,
      supportsParallelToolCalls: resolved.supportsParallelToolCalls,
    };
  const sseHeaders = { ...headers };
  const hasHeaders = Object.keys(sseHeaders).length > 0;
  return {
    transport: new SSEClientTransport(new URL(resolved.url), {
      requestInit: resolved.auth === "oauth" || !hasHeaders ? void 0 : { headers: sseHeaders },
      fetch: httpFetch,
      eventSourceInit: {
        fetch: buildSseEventSourceFetch(resolved.auth === "oauth" ? {} : sseHeaders, httpFetch),
      },
      authProvider,
    }),
    description: resolved.description,
    transportType: "sse",
    connectionTimeoutMs: resolved.connectionTimeoutMs,
    requestTimeoutMs: resolved.requestTimeoutMs,
    supportsParallelToolCalls: resolved.supportsParallelToolCalls,
  };
}
//#endregion
export {
  matchesMcpToolFilterPattern as a,
  createMcpJsonSchemaValidator as i,
  OpenClawStdioClientTransport as n,
  sanitizeMcpMetadataText as r,
  resolveMcpTransport as t,
};
