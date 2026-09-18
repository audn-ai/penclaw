import { randomUUID } from "node:crypto";
import { constants } from "node:fs";
import "./src-Bl7G9qvi.js";
import fs$1 from "node:fs/promises";
import path from "node:path";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { t as buildBundleMcpToolsFromCatalog } from "./agent-bundle-mcp-materialize-DxUEddBG.js";
import { n as createSessionMcpRuntime } from "./agent-bundle-mcp-runtime-3IdGeACS.js";
import { r as extractFirstTextBlock } from "./chat-message-content-CeBHi_A4.js";
import { t as formatCliCommand } from "./command-format-H_Arqann.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { t as resolveGatewayAuthOptions } from "./gateway-secret-options-TEj2PlFa.js";
import {
  a as resolveMcpTransportConfig,
  c as readMcpOAuthCredentialsStatus,
  d as withSameOriginMcpHttpHeaders,
  f as withoutMcpAuthorizationHeader,
  l as runMcpOAuthLogin,
  o as clearMcpOAuthCredentials,
  u as buildMcpHttpFetch,
} from "./mcp-auth-profile-Cy6hOvQm.js";
import {
  a as updateConfiguredMcpServerTools,
  i as updateConfiguredMcpServer,
  n as setConfiguredMcpServer,
  o as parseConfigValue,
  r as unsetConfiguredMcpServer,
  t as listConfiguredMcpServers,
} from "./mcp-config-BoprJeCV.js";
import {
  D as resolveIntegerOption,
  _ as parseStrictFiniteNumber,
} from "./number-coercion-CJQ8TR--.js";
import { t as applyParentDefaultHelpAction } from "./parent-default-help-DQUF3qKA.js";
import { r as defaultRuntime } from "./runtime-Bz6o617W.js";
import {
  At as boolean,
  Rn as string,
  Tn as object,
  dn as literal,
  wn as number,
  yt as _enum,
} from "./schemas-CBJjibl3.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
  f as normalizeStringifiedOptionalString,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
import "commander";
import { n as VERSION } from "./version-CeFj_iGk.js";
//#region src/mcp/channel-shared.ts
/** Raw MCP notification schema emitted by Claude channel clients for permission prompts. */
const ClaudePermissionRequestSchema = object({
  method: literal("notifications/claude/channel/permission_request"),
  params: object({
    request_id: string(),
    tool_name: string(),
    description: string(),
    input_preview: string(),
  }),
});
/** Resolve the visible message id, including OpenClaw metadata attached to raw entries. */
function resolveMessageId(entry) {
  return (
    normalizeOptionalString(entry.id) ??
    (entry["__openclaw"] && typeof entry["__openclaw"] === "object"
      ? normalizeOptionalString(entry["__openclaw"].id)
      : void 0)
  );
}
/** Build the text summary format expected by simple MCP tool results. */
function summarizeResult(label, count) {
  return {
    content: [
      {
        type: "text",
        text: `${label}: ${count}`,
      },
    ],
  };
}
/** Build a text summary plus pretty JSON payload for MCP clients without structured rendering. */
function summarizeStructuredResult(label, count, payload) {
  return {
    content: [
      {
        type: "text",
        text: `${label}: ${count}\n\n${JSON.stringify(payload, null, 2)}`,
      },
    ],
  };
}
function resolveConversationChannel(row) {
  return normalizeOptionalLowercaseString(
    normalizeOptionalString(row.deliveryContext?.channel) ??
      normalizeOptionalString(row.lastChannel) ??
      normalizeOptionalString(row.channel) ??
      normalizeOptionalString(row.origin?.provider),
  );
}
/** Convert a Gateway session row into a reply-capable conversation descriptor. */
function toConversation(row) {
  const channel = resolveConversationChannel(row);
  const to =
    normalizeOptionalString(row.deliveryContext?.to) ?? normalizeOptionalString(row.lastTo);
  if (!channel || !to) return null;
  return {
    sessionKey: row.key,
    channel,
    to,
    accountId:
      normalizeOptionalString(row.deliveryContext?.accountId) ??
      normalizeOptionalString(row.lastAccountId) ??
      normalizeOptionalString(row.origin?.accountId),
    threadId: row.deliveryContext?.threadId ?? row.lastThreadId ?? row.origin?.threadId,
    label: normalizeOptionalString(row.label),
    displayName: normalizeOptionalString(row.displayName),
    derivedTitle: normalizeOptionalString(row.derivedTitle),
    lastMessagePreview: normalizeOptionalString(row.lastMessagePreview),
    updatedAt: typeof row.updatedAt === "number" ? row.updatedAt : null,
  };
}
/** Check whether a queued event should be visible to a poll or wait call. */
function matchEventFilter(event, filter) {
  if (event.cursor <= filter.afterCursor) return false;
  if (!filter.sessionKey) return true;
  return "sessionKey" in event && event.sessionKey === filter.sessionKey;
}
/** Return non-text content blocks from a raw message payload. */
function extractAttachmentsFromMessage(message) {
  if (!message || typeof message !== "object") return [];
  const content = message.content;
  if (!Array.isArray(content)) return [];
  return content.filter((entry) => {
    if (!entry || typeof entry !== "object") return false;
    return normalizeOptionalString(entry.type) !== "text";
  });
}
/** Normalize approval identifiers before local tracking or resolution. */
function normalizeApprovalId(value) {
  const id = normalizeOptionalString(value);
  return id ? id.trim() : void 0;
}
//#endregion
//#region src/mcp/channel-bridge.ts
const CLAUDE_PERMISSION_REPLY_RE = /^(yes|no)\s+([a-km-z]{5})$/i;
const QUEUE_LIMIT = 1e3;
const CONVERSATIONS_LIST_LIMIT = 500;
const MESSAGES_READ_LIMIT = 200;
const EVENTS_POLL_LIMIT = 200;
const EVENTS_WAIT_TIMEOUT_LIMIT_MS = 3e5;
const PENDING_CLAUDE_PERMISSION_TTL_MS = 3600 * 1e3;
const PENDING_APPROVAL_DEFAULT_TTL_MS = 1800 * 1e3;
const PENDING_SWEEP_INTERVAL_MS = 300 * 1e3;
/** Connects the MCP server surface to a Gateway client and queues channel events for polling. */
var OpenClawChannelBridge = class {
  constructor(cfg, params) {
    this.cfg = cfg;
    this.params = params;
    this.gateway = null;
    this.queue = [];
    this.pendingWaiters = /* @__PURE__ */ new Set();
    this.pendingClaudePermissions = /* @__PURE__ */ new Map();
    this.pendingApprovals = /* @__PURE__ */ new Map();
    this.pendingSweepInterval = null;
    this.server = null;
    this.cursor = 0;
    this.closed = false;
    this.ready = false;
    this.started = false;
    this.retryingInitialConnect = false;
    this.readySettled = false;
    this.verbose = params.verbose;
    this.claudeChannelMode = params.claudeChannelMode;
    this.readyPromise = new Promise((resolve, reject) => {
      this.resolveReady = resolve;
      this.rejectReady = reject;
    });
  }
  /** Attach the MCP server used for outbound protocol notifications. */
  setServer(server) {
    this.server = server;
  }
  /** Start the Gateway connection and resolve only after session subscription succeeds. */
  async start() {
    if (this.started) {
      await this.readyPromise;
      return;
    }
    this.started = true;
    const [
      { resolveGatewayClientBootstrap },
      { GatewayClient: GatewayClientCtor },
      { startGatewayClientWhenEventLoopReady },
      { APPROVALS_SCOPE, READ_SCOPE, WRITE_SCOPE },
      { GATEWAY_CLIENT_MODES, GATEWAY_CLIENT_NAMES },
    ] = await Promise.all([
      import("./client-bootstrap-qLehgSXa.js"),
      import("./client-DBIVrEAX.js"),
      import("./client-start-readiness-BEBUeT12.js"),
      import("./method-scopes-DuCl_gs0.js"),
      import("./client-info-CzXxZ3Ec.js"),
    ]);
    const bootstrap = await resolveGatewayClientBootstrap({
      config: this.cfg,
      gatewayUrl: this.params.gatewayUrl,
      explicitAuth: {
        token: this.params.gatewayToken,
        password: this.params.gatewayPassword,
      },
      env: process.env,
    });
    if (this.closed) {
      this.resolveReadyOnce();
      return;
    }
    this.gateway = new GatewayClientCtor({
      url: bootstrap.url,
      token: bootstrap.auth.token,
      password: bootstrap.auth.password,
      preauthHandshakeTimeoutMs: bootstrap.preauthHandshakeTimeoutMs,
      clientName: GATEWAY_CLIENT_NAMES.CLI,
      clientDisplayName: "OpenClaw MCP",
      clientVersion: VERSION,
      mode: GATEWAY_CLIENT_MODES.CLI,
      scopes: [READ_SCOPE, WRITE_SCOPE, APPROVALS_SCOPE],
      requestTimeoutMs: 18e4,
      onEvent: (event) => {
        this.dispatchGatewayEvent(event);
      },
      onHelloOk: () => {
        this.retryingInitialConnect = false;
        this.handleHelloOk();
      },
      onConnectError: (error) => {
        const normalizedError = error instanceof Error ? error : new Error(String(error));
        if (shouldRetryInitialMcpGatewayConnect(normalizedError)) {
          this.retryingInitialConnect = true;
          return;
        }
        this.rejectReadyOnce(normalizedError);
      },
      onClose: (code, reason) => {
        if (!this.ready && !this.closed && !this.retryingInitialConnect)
          this.rejectReadyOnce(
            /* @__PURE__ */ new Error(`gateway closed before ready (${code}): ${reason}`),
          );
        this.retryingInitialConnect = false;
      },
    });
    if (
      !(
        await startGatewayClientWhenEventLoopReady(this.gateway, {
          clientOptions: { preauthHandshakeTimeoutMs: bootstrap.preauthHandshakeTimeoutMs },
        })
      ).ready
    )
      this.rejectReadyOnce(/* @__PURE__ */ new Error("gateway event loop readiness timeout"));
    await this.readyPromise;
  }
  /** Wait until the bridge has subscribed to Gateway session events. */
  async waitUntilReady() {
    await this.readyPromise;
  }
  /** Stop Gateway IO and release waiters so MCP shutdown cannot hang on pending polls. */
  async close() {
    if (this.closed) return;
    this.closed = true;
    this.resolveReadyOnce();
    if (this.pendingSweepInterval) {
      clearInterval(this.pendingSweepInterval);
      this.pendingSweepInterval = null;
    }
    this.pendingClaudePermissions.clear();
    this.pendingApprovals.clear();
    for (const waiter of this.pendingWaiters) {
      if (waiter.timeout) clearTimeout(waiter.timeout);
      waiter.resolve(null);
    }
    this.pendingWaiters.clear();
    const gateway = this.gateway;
    this.gateway = null;
    await gateway?.stopAndWait().catch(() => void 0);
  }
  /** List Gateway sessions that have enough routing metadata to be channel conversations. */
  async listConversations(params) {
    await this.waitUntilReady();
    const limit = resolveIntegerOption(params?.limit, 50, {
      min: 1,
      max: CONVERSATIONS_LIST_LIMIT,
    });
    const response = await this.requestGateway("sessions.list", {
      limit,
      search: params?.search,
      includeDerivedTitles: params?.includeDerivedTitles ?? true,
      includeLastMessage: params?.includeLastMessage ?? true,
    });
    const requestedChannel = normalizeOptionalLowercaseString(params?.channel);
    return (response.sessions ?? [])
      .map(toConversation)
      .filter((conversation) => Boolean(conversation))
      .filter((conversation) =>
        requestedChannel
          ? normalizeLowercaseStringOrEmpty(conversation.channel) === requestedChannel
          : true,
      );
  }
  /** Resolve one conversation by its stable session key. */
  async getConversation(sessionKey) {
    const normalizedSessionKey = sessionKey.trim();
    if (!normalizedSessionKey) return null;
    await this.waitUntilReady();
    const response = await this.requestGateway("sessions.describe", {
      key: normalizedSessionKey,
      includeDerivedTitles: true,
      includeLastMessage: true,
    });
    return response.session ? toConversation(response.session) : null;
  }
  /** Read recent history through the Gateway session API. */
  async readMessages(sessionKey, limit = 20) {
    await this.waitUntilReady();
    const requestLimit = resolveIntegerOption(limit, 20, {
      min: 1,
      max: MESSAGES_READ_LIMIT,
    });
    return (
      (
        await this.requestGateway("sessions.get", {
          key: sessionKey,
          limit: requestLimit,
        })
      ).messages ?? []
    );
  }
  /** Send a reply using the same channel route stored on the conversation. */
  async sendMessage(params) {
    const conversation = await this.getConversation(params.sessionKey);
    if (!conversation) throw new Error(`Conversation not found for session ${params.sessionKey}`);
    return await this.requestGateway("send", {
      to: conversation.to,
      channel: conversation.channel,
      accountId: conversation.accountId,
      threadId: conversation.threadId == null ? void 0 : String(conversation.threadId),
      message: params.text,
      sessionKey: conversation.sessionKey,
      idempotencyKey: randomUUID(),
    });
  }
  /** Return locally tracked approval requests that are still open. */
  listPendingApprovals() {
    this.sweepPendingExpired();
    return [...this.pendingApprovals.values()]
      .map((entry) => entry.approval)
      .toSorted((a, b) => {
        return (a.createdAtMs ?? 0) - (b.createdAtMs ?? 0);
      });
  }
  /** Forward an MCP approval decision to the matching Gateway approval resolver. */
  async respondToApproval(params) {
    if (params.kind === "exec")
      return await this.requestGateway("exec.approval.resolve", {
        id: params.id,
        decision: params.decision,
      });
    return await this.requestGateway("plugin.approval.resolve", {
      id: params.id,
      decision: params.decision,
    });
  }
  /** Poll queued events after a cursor without consuming them. */
  pollEvents(filter, limit = 20) {
    const eventLimit = resolveIntegerOption(limit, 20, {
      min: 1,
      max: EVENTS_POLL_LIMIT,
    });
    const events = this.queue
      .filter((event) => matchEventFilter(event, filter))
      .slice(0, eventLimit);
    return {
      events,
      nextCursor: events.at(-1)?.cursor ?? filter.afterCursor,
    };
  }
  /** Wait for the next matching event, resolving null on timeout or bridge close. */
  async waitForEvent(filter, timeoutMs = 3e4) {
    const existing = this.queue.find((event) => matchEventFilter(event, filter));
    if (existing) return existing;
    const waitTimeoutMs = resolveIntegerOption(timeoutMs, 3e4, {
      min: 1,
      max: EVENTS_WAIT_TIMEOUT_LIMIT_MS,
    });
    return await new Promise((resolve) => {
      const waiter = {
        filter,
        resolve: (value) => {
          this.pendingWaiters.delete(waiter);
          resolve(value);
        },
        timeout: null,
      };
      waiter.timeout = setTimeout(() => {
        waiter.resolve(null);
      }, waitTimeoutMs);
      this.pendingWaiters.add(waiter);
    });
  }
  /** Accept a Claude channel permission notification and expose it through event polling. */
  async handleClaudePermissionRequest(params) {
    if (this.closed) return;
    this.pendingClaudePermissions.set(params.requestId, Date.now());
    this.ensurePendingSweeper();
    this.enqueue({
      cursor: this.nextCursor(),
      type: "claude_permission_request",
      requestId: params.requestId,
      toolName: params.toolName,
      description: params.description,
      inputPreview: params.inputPreview,
    });
    if (this.verbose)
      process.stderr.write(`openclaw mcp: pending Claude permission ${params.requestId}\n`);
  }
  async requestGateway(method, params) {
    if (!this.gateway) throw new Error("Gateway client is not ready");
    return await this.gateway.request(method, params);
  }
  async sendNotification(notification) {
    if (!this.server || this.closed) return;
    try {
      await this.server.server.notification(notification);
    } catch (error) {
      if (this.closed) return;
      process.stderr.write(`openclaw mcp: notification ${notification.method} failed\n`);
      if (this.verbose)
        process.stderr.write(
          `openclaw mcp: notification ${notification.method} error: ${String(error)}\n`,
        );
    }
  }
  async handleHelloOk() {
    try {
      await this.requestGateway("sessions.subscribe", {});
      this.ready = true;
      this.resolveReadyOnce();
    } catch (error) {
      this.rejectReadyOnce(error instanceof Error ? error : new Error(String(error)));
    }
  }
  resolveReadyOnce() {
    if (this.readySettled) return;
    this.readySettled = true;
    this.resolveReady();
  }
  rejectReadyOnce(error) {
    if (this.readySettled) return;
    this.readySettled = true;
    this.rejectReady(error);
  }
  nextCursor() {
    this.cursor += 1;
    return this.cursor;
  }
  enqueue(event) {
    this.queue.push(event);
    while (this.queue.length > QUEUE_LIMIT) this.queue.shift();
    for (const waiter of this.pendingWaiters) {
      if (!matchEventFilter(event, waiter.filter)) continue;
      if (waiter.timeout) clearTimeout(waiter.timeout);
      waiter.resolve(event);
    }
  }
  trackApproval(kind, payload) {
    if (this.closed) return;
    const id = normalizeApprovalId(payload.id);
    if (!id) return;
    this.pendingApprovals.set(id, {
      approval: {
        kind,
        id,
        request: payload.request && typeof payload.request === "object" ? payload.request : void 0,
        createdAtMs: typeof payload.createdAtMs === "number" ? payload.createdAtMs : void 0,
        expiresAtMs: typeof payload.expiresAtMs === "number" ? payload.expiresAtMs : void 0,
      },
      trackedAtMs: Date.now(),
    });
    this.ensurePendingSweeper();
  }
  ensurePendingSweeper() {
    if (this.pendingSweepInterval || this.closed) return;
    this.pendingSweepInterval = setInterval(() => {
      this.sweepPendingExpired();
    }, PENDING_SWEEP_INTERVAL_MS);
    this.pendingSweepInterval.unref();
  }
  sweepPendingExpired(now = Date.now()) {
    for (const [id, createdAtMs] of this.pendingClaudePermissions)
      if (now - createdAtMs >= PENDING_CLAUDE_PERMISSION_TTL_MS)
        this.pendingClaudePermissions.delete(id);
    for (const [id, entry] of this.pendingApprovals)
      if (
        now >= (entry.approval.expiresAtMs ?? entry.trackedAtMs + PENDING_APPROVAL_DEFAULT_TTL_MS)
      )
        this.pendingApprovals.delete(id);
    if (
      this.pendingSweepInterval &&
      this.pendingClaudePermissions.size === 0 &&
      this.pendingApprovals.size === 0
    ) {
      clearInterval(this.pendingSweepInterval);
      this.pendingSweepInterval = null;
    }
  }
  resolveTrackedApproval(payload) {
    const id = normalizeApprovalId(payload.id);
    if (id) this.pendingApprovals.delete(id);
  }
  async dispatchGatewayEvent(event) {
    try {
      await this.handleGatewayEvent(event);
    } catch (error) {
      process.stderr.write(`openclaw mcp: gateway event ${event.event} failed\n`);
      if (this.verbose)
        process.stderr.write(
          `openclaw mcp: gateway event ${event.event} error: ${String(error)}\n`,
        );
    }
  }
  async handleGatewayEvent(event) {
    switch (event.event) {
      case "session.message":
        await this.handleSessionMessageEvent(event.payload);
        return;
      case "exec.approval.requested": {
        const raw = event.payload ?? {};
        this.trackApproval("exec", raw);
        this.enqueue({
          cursor: this.nextCursor(),
          type: "exec_approval_requested",
          raw,
        });
        return;
      }
      case "exec.approval.resolved": {
        const raw = event.payload ?? {};
        this.resolveTrackedApproval(raw);
        this.enqueue({
          cursor: this.nextCursor(),
          type: "exec_approval_resolved",
          raw,
        });
        return;
      }
      case "plugin.approval.requested": {
        const raw = event.payload ?? {};
        this.trackApproval("plugin", raw);
        this.enqueue({
          cursor: this.nextCursor(),
          type: "plugin_approval_requested",
          raw,
        });
        return;
      }
      case "plugin.approval.resolved": {
        const raw = event.payload ?? {};
        this.resolveTrackedApproval(raw);
        this.enqueue({
          cursor: this.nextCursor(),
          type: "plugin_approval_resolved",
          raw,
        });
      }
    }
  }
  async handleSessionMessageEvent(payload) {
    const sessionKey = normalizeOptionalString(payload.sessionKey);
    if (!sessionKey) return;
    const conversation =
      toConversation({
        key: sessionKey,
        lastChannel: normalizeOptionalString(payload.lastChannel),
        lastTo: normalizeOptionalString(payload.lastTo),
        lastAccountId: normalizeOptionalString(payload.lastAccountId),
        lastThreadId: payload.lastThreadId,
      }) ?? void 0;
    const role = normalizeOptionalString(payload.message?.role);
    const text = extractFirstTextBlock(payload.message);
    const permissionMatch = text ? CLAUDE_PERMISSION_REPLY_RE.exec(text) : null;
    if (role === "user" && payload.senderIsOwner === true && permissionMatch) {
      const requestId = normalizeOptionalLowercaseString(permissionMatch[2]);
      if (requestId && this.pendingClaudePermissions.has(requestId)) {
        this.pendingClaudePermissions.delete(requestId);
        await this.sendNotification({
          method: "notifications/claude/channel/permission",
          params: {
            request_id: requestId,
            behavior: normalizeLowercaseStringOrEmpty(permissionMatch[1]).startsWith("y")
              ? "allow"
              : "deny",
          },
        });
        return;
      }
    }
    this.enqueue({
      cursor: this.nextCursor(),
      type: "message",
      sessionKey,
      conversation,
      messageId: normalizeOptionalString(payload.messageId),
      messageSeq: typeof payload.messageSeq === "number" ? payload.messageSeq : void 0,
      role,
      text,
      raw: payload,
    });
    if (!this.shouldEmitClaudeChannel(role, conversation)) return;
    await this.sendNotification({
      method: "notifications/claude/channel",
      params: {
        content: text ?? "[non-text message]",
        meta: {
          session_key: sessionKey,
          channel: conversation?.channel ?? "",
          to: conversation?.to ?? "",
          account_id: conversation?.accountId ?? "",
          thread_id: conversation?.threadId == null ? "" : String(conversation.threadId),
          message_id: normalizeOptionalString(payload.messageId) ?? "",
        },
      },
    });
  }
  shouldEmitClaudeChannel(role, conversation) {
    if (this.claudeChannelMode === "off") return false;
    if (role !== "user") return false;
    return Boolean(conversation);
  }
};
/** Decide whether startup should wait for a retryable Gateway connect failure to recover. */
function shouldRetryInitialMcpGatewayConnect(error) {
  if (
    error.name === "GatewayClientRequestError" &&
    "retryable" in error &&
    typeof error.retryable === "boolean"
  )
    return error.retryable;
  const message = error.message.toLowerCase();
  return (
    message.includes("gateway request timeout for connect") ||
    message.includes("gateway connect challenge timeout")
  );
}
//#endregion
//#region src/mcp/channel-tools.ts
/**
 * MCP tool registration for channel conversation access.
 *
 * Tool handlers stay thin: schemas validate public inputs and the bridge owns
 * Gateway readiness, routing, event queueing, and approval resolution.
 */
/** Return protocol capabilities advertised when Claude channel mode is enabled. */
function getChannelMcpCapabilities(claudeChannelMode) {
  if (claudeChannelMode === "off") return;
  return {
    experimental: {
      "claude/channel": {},
      "claude/channel/permission": {},
    },
  };
}
/** Register all channel MCP tools against a server instance. */
function registerChannelMcpTools(server, bridge) {
  server.tool(
    "conversations_list",
    "List OpenClaw channel-backed conversations available through session routes.",
    {
      limit: number().int().min(1).max(500).optional(),
      search: string().optional(),
      channel: string().optional(),
      includeDerivedTitles: boolean().optional(),
      includeLastMessage: boolean().optional(),
    },
    async (args) => {
      const conversations = await bridge.listConversations(args);
      return {
        ...summarizeStructuredResult("conversations", conversations.length, { conversations }),
        structuredContent: { conversations },
      };
    },
  );
  server.tool(
    "conversation_get",
    "Get one OpenClaw conversation by session key.",
    { session_key: string().min(1) },
    async ({ session_key }) => {
      const conversation = await bridge.getConversation(session_key);
      if (!conversation)
        return {
          content: [
            {
              type: "text",
              text: `conversation not found: ${session_key}`,
            },
          ],
          isError: true,
        };
      return {
        content: [
          {
            type: "text",
            text: `conversation ${conversation.sessionKey}`,
          },
        ],
        structuredContent: { conversation },
      };
    },
  );
  server.tool(
    "messages_read",
    "Read recent messages for one OpenClaw conversation.",
    {
      session_key: string().min(1),
      limit: number().int().min(1).max(200).optional(),
    },
    async ({ session_key, limit }) => {
      const messages = await bridge.readMessages(session_key, limit ?? 20);
      return {
        ...summarizeStructuredResult("messages", messages.length, { messages }),
        structuredContent: { messages },
      };
    },
  );
  server.tool(
    "attachments_fetch",
    "List non-text attachments for a message in one OpenClaw conversation.",
    {
      session_key: string().min(1),
      message_id: string().min(1),
      limit: number().int().min(1).max(200).optional(),
    },
    async ({ session_key, message_id, limit }) => {
      const message = (await bridge.readMessages(session_key, limit ?? 100)).find(
        (entry) => resolveMessageId(entry) === message_id,
      );
      if (!message)
        return {
          content: [
            {
              type: "text",
              text: `message not found: ${message_id}`,
            },
          ],
          isError: true,
        };
      const attachments = extractAttachmentsFromMessage(message);
      return {
        ...summarizeResult("attachments", attachments.length),
        structuredContent: {
          attachments,
          message,
        },
      };
    },
  );
  server.tool(
    "events_poll",
    "Poll queued OpenClaw conversation events since a cursor.",
    {
      after_cursor: number().int().min(0).optional(),
      session_key: string().optional(),
      limit: number().int().min(1).max(200).optional(),
    },
    async ({ after_cursor, session_key, limit }) => {
      const { events, nextCursor } = bridge.pollEvents(
        {
          afterCursor: after_cursor ?? 0,
          sessionKey: normalizeOptionalString(session_key),
        },
        limit ?? 20,
      );
      return {
        ...summarizeResult("events", events.length),
        structuredContent: {
          events,
          next_cursor: nextCursor,
        },
      };
    },
  );
  server.tool(
    "events_wait",
    "Wait for the next queued OpenClaw conversation event.",
    {
      after_cursor: number().int().min(0).optional(),
      session_key: string().optional(),
      timeout_ms: number().int().min(1).max(3e5).optional(),
    },
    async ({ after_cursor, session_key, timeout_ms }) => {
      const event = await bridge.waitForEvent(
        {
          afterCursor: after_cursor ?? 0,
          sessionKey: normalizeOptionalString(session_key),
        },
        timeout_ms ?? 3e4,
      );
      return {
        content: [
          {
            type: "text",
            text: event ? `event ${event.cursor}` : "timeout",
          },
        ],
        structuredContent: { event },
      };
    },
  );
  server.tool(
    "messages_send",
    "Send a message back through the same OpenClaw conversation route.",
    {
      session_key: string().min(1),
      text: string().min(1),
    },
    async ({ session_key, text }) => {
      return {
        content: [
          {
            type: "text",
            text: "sent",
          },
        ],
        structuredContent: {
          result: await bridge.sendMessage({
            sessionKey: session_key,
            text,
          }),
        },
      };
    },
  );
  server.tool(
    "permissions_list_open",
    "List open OpenClaw exec or plugin approval requests visible through the Gateway.",
    {},
    async () => {
      const approvals = bridge.listPendingApprovals();
      return {
        ...summarizeResult("approvals", approvals.length),
        structuredContent: { approvals },
      };
    },
  );
  server.tool(
    "permissions_respond",
    "Allow or deny one pending OpenClaw exec or plugin approval request.",
    {
      kind: _enum(["exec", "plugin"]),
      id: string().min(1),
      decision: _enum(["allow-once", "allow-always", "deny"]),
    },
    async ({ kind, id, decision }) => {
      return {
        content: [
          {
            type: "text",
            text: "approval resolved",
          },
        ],
        structuredContent: {
          result: await bridge.respondToApproval({
            kind,
            id,
            decision,
          }),
        },
      };
    },
  );
}
//#endregion
//#region src/mcp/channel-server.ts
async function resolveMcpConfig(config) {
  if (config) return config;
  const { getRuntimeConfig } = await import("./config/config.js");
  return getRuntimeConfig();
}
/** Create an in-process channel MCP server plus explicit start and close hooks. */
async function createOpenClawChannelMcpServer(opts = {}) {
  const cfg = await resolveMcpConfig(opts.config);
  const claudeChannelMode = opts.claudeChannelMode ?? "auto";
  const capabilities = getChannelMcpCapabilities(claudeChannelMode);
  const server = new McpServer(
    {
      name: "openclaw",
      version: VERSION,
    },
    capabilities ? { capabilities } : void 0,
  );
  const bridge = new OpenClawChannelBridge(cfg, {
    gatewayUrl: opts.gatewayUrl,
    gatewayToken: opts.gatewayToken,
    gatewayPassword: opts.gatewayPassword,
    claudeChannelMode,
    verbose: opts.verbose ?? false,
  });
  bridge.setServer(server);
  server.server.setNotificationHandler(ClaudePermissionRequestSchema, async ({ params }) => {
    await bridge.handleClaudePermissionRequest({
      requestId: params.request_id,
      toolName: params.tool_name,
      description: params.description,
      inputPreview: params.input_preview,
    });
  });
  registerChannelMcpTools(server, bridge);
  return {
    server,
    bridge,
    start: async () => {
      await bridge.start();
    },
    close: async () => {
      await bridge.close();
      await server.close();
    },
  };
}
/** Serve the channel MCP server over stdio until transport or process shutdown. */
async function serveOpenClawChannelMcp(opts = {}) {
  const { server, start, close } = await createOpenClawChannelMcpServer(opts);
  const transport = new StdioServerTransport();
  let shuttingDown = false;
  let resolveClosed;
  const closed = new Promise((resolve) => {
    resolveClosed = resolve;
  });
  const shutdown = () => {
    if (shuttingDown) return;
    shuttingDown = true;
    process.stdin.off("end", shutdown);
    process.stdin.off("close", shutdown);
    process.off("SIGINT", shutdown);
    process.off("SIGTERM", shutdown);
    transport["onclose"] = void 0;
    close().then(resolveClosed, resolveClosed);
  };
  transport["onclose"] = shutdown;
  process.stdin.once("end", shutdown);
  process.stdin.once("close", shutdown);
  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
  try {
    await server.connect(transport);
    await start();
    await closed;
  } finally {
    shutdown();
    await closed;
  }
}
//#endregion
//#region src/cli/mcp-cli.ts
function fail(message) {
  defaultRuntime.error(message);
  defaultRuntime.exit(1);
  throw new Error(message);
}
function printJson(value) {
  defaultRuntime.writeJson(value);
}
function parseCsvList(value) {
  if (!value) return;
  const entries = value
    .split(",")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
  return entries.length > 0 ? entries : void 0;
}
function collectOption(value, previous = []) {
  return [...previous, value];
}
function parseKeyValueEntries(values, label) {
  const entries = {};
  for (const raw of values ?? []) {
    const separatorIndex = raw.indexOf("=");
    if (separatorIndex <= 0) fail(`${label} entries must use KEY=VALUE.`);
    const key = raw.slice(0, separatorIndex).trim();
    const value = raw.slice(separatorIndex + 1);
    if (!key) fail(`${label} entries must use a non-empty key.`);
    entries[key] = value;
  }
  return Object.keys(entries).length > 0 ? entries : void 0;
}
function parsePositiveNumberOption(value, label) {
  if (value === void 0) return;
  const parsed = parseStrictFiniteNumber(value);
  if (parsed === void 0 || parsed <= 0) fail(`${label} must be a positive number.`);
  return parsed;
}
function parseOAuthConfig(opts) {
  const oauth = {
    ...(normalizeStringifiedOptionalString(opts.scope) ? { scope: opts.scope.trim() } : {}),
    ...(normalizeStringifiedOptionalString(opts.redirectUrl)
      ? { redirectUrl: opts.redirectUrl.trim() }
      : {}),
    ...(normalizeStringifiedOptionalString(opts.clientMetadataUrl)
      ? { clientMetadataUrl: opts.clientMetadataUrl.trim() }
      : {}),
  };
  return Object.keys(oauth).length > 0 ? oauth : void 0;
}
async function clearMcpOAuthCredentialsForConfiguredServer(name, server) {
  const resolved = resolveMcpTransportConfig(name, server);
  if (resolved?.kind === "http")
    await clearMcpOAuthCredentials({
      serverName: name,
      serverUrl: resolved.url,
    });
}
function hasOAuthAuth(server) {
  return (
    typeof server === "object" && server !== null && "auth" in server && server.auth === "oauth"
  );
}
async function clearStaleMcpOAuthCredentialsForReplacement(params) {
  if (!hasOAuthAuth(params.previous)) return;
  const previousResolved = resolveMcpTransportConfig(params.name, params.previous);
  if (previousResolved?.kind !== "http") return;
  const nextResolved = hasOAuthAuth(params.next)
    ? resolveMcpTransportConfig(params.name, params.next)
    : void 0;
  if (nextResolved?.kind === "http" && nextResolved.url === previousResolved.url) return;
  await clearMcpOAuthCredentials({
    serverName: params.name,
    serverUrl: previousResolved.url,
  });
}
function setOptionalField(target, key, value) {
  if (value !== void 0) target[key] = value;
}
const SENSITIVE_HEADER_NAMES = /* @__PURE__ */ new Set([
  "authorization",
  "proxy-authorization",
  "x-api-key",
  "api-key",
  "api_key",
]);
const SENSITIVE_KEY_PATTERN =
  /(?:^|[_-])(api[_-]?key|authorization|bearer|password|secret|token)$/i;
function asRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value) ? value : null;
}
function issue(level, message) {
  return {
    level,
    message,
  };
}
function hasSensitiveKey(name) {
  return SENSITIVE_HEADER_NAMES.has(name.trim().toLowerCase()) || SENSITIVE_KEY_PATTERN.test(name);
}
function hasLiteralSensitiveValue(value) {
  return typeof value === "string" && value.trim().length > 0 && !value.trim().startsWith("$");
}
function resolveConfiguredPath(filePath, cwd) {
  if (path.isAbsolute(filePath)) return filePath;
  const base = typeof cwd === "string" && cwd.trim() ? cwd.trim() : process.cwd();
  return path.resolve(base, filePath);
}
async function fileExists(filePath) {
  try {
    return (await fs$1.stat(filePath)).isFile();
  } catch {
    return false;
  }
}
async function directoryExists(filePath) {
  try {
    return (await fs$1.stat(filePath)).isDirectory();
  } catch {
    return false;
  }
}
async function isExecutable(filePath) {
  try {
    await fs$1.access(filePath, process.platform === "win32" ? constants.F_OK : constants.X_OK);
    return true;
  } catch {
    return false;
  }
}
function executableCandidates(command) {
  if (process.platform !== "win32") return [command];
  const extensions = (process.env.PATHEXT ?? ".EXE;.CMD;.BAT;.COM")
    .split(";")
    .map((entry) => entry.trim())
    .filter(Boolean);
  if (path.extname(command)) return [command];
  return [command, ...extensions.map((extension) => `${command}${extension.toLowerCase()}`)];
}
function resolveEffectivePath(env) {
  if (!env) return process.env.PATH ?? "";
  if (typeof env.PATH === "string") return env.PATH;
  if (process.platform === "win32" && typeof env.Path === "string") return env.Path;
  return process.env.PATH ?? "";
}
async function commandExists(command, cwd, env) {
  if (path.isAbsolute(command) || command.includes("/") || command.includes("\\"))
    return isExecutable(resolveConfiguredPath(command, cwd));
  const pathEntries = resolveEffectivePath(env)
    .split(path.delimiter)
    .map((entry) => entry.trim() || ".");
  for (const pathEntry of pathEntries) {
    const resolvedPathEntry = path.isAbsolute(pathEntry)
      ? pathEntry
      : resolveConfiguredPath(pathEntry, cwd);
    for (const candidate of executableCandidates(command))
      if (await isExecutable(path.join(resolvedPathEntry, candidate))) return true;
  }
  return false;
}
async function collectMcpDoctorIssues(params) {
  const issues = [];
  const { name, server } = params;
  const resolved = resolveMcpTransportConfig(name, server);
  const disabled = server.enabled === false;
  if (server.enabled === false) issues.push(issue("warning", "server is disabled"));
  if (!disabled) {
    if (!resolved) issues.push(issue("error", "server transport is invalid"));
    if (resolved?.kind === "stdio") {
      if (!(await commandExists(resolved.command, resolved.cwd, resolved.env)))
        issues.push(
          issue("error", `stdio command not found or not executable: ${resolved.command}`),
        );
      if (resolved.cwd && !(await directoryExists(resolved.cwd)))
        issues.push(issue("error", `stdio cwd does not exist: ${resolved.cwd}`));
    }
    if (resolved?.kind === "http") {
      if (server.auth === "oauth") {
        if (
          !(
            await readMcpOAuthCredentialsStatus({
              serverName: name,
              serverUrl: resolved.url,
            })
          ).hasTokens
        )
          issues.push(
            issue(
              "warning",
              `OAuth credentials are not authorized; run ${formatCliCommand(`openclaw mcp login ${name}`)}`,
            ),
          );
        const headers = asRecord(server.headers);
        if (headers && "Authorization" in headers)
          issues.push(
            issue("warning", "OAuth is enabled and the static Authorization header is ignored"),
          );
      }
      if (resolved.sslVerify === false)
        issues.push(issue("warning", "TLS certificate verification is disabled"));
      if (
        resolved.clientCert &&
        !(await fileExists(resolveConfiguredPath(resolved.clientCert, "")))
      )
        issues.push(
          issue("error", `client certificate file does not exist: ${resolved.clientCert}`),
        );
      if (resolved.clientKey && !(await fileExists(resolveConfiguredPath(resolved.clientKey, ""))))
        issues.push(issue("error", `client key file does not exist: ${resolved.clientKey}`));
    }
  }
  for (const [field, values] of [
    ["headers", asRecord(server.headers)],
    ["env", asRecord(server.env)],
  ])
    for (const [key, value] of Object.entries(values ?? {}))
      if (hasSensitiveKey(key) && hasLiteralSensitiveValue(value))
        issues.push(
          issue(
            "warning",
            `${field}.${key} contains a literal sensitive value; prefer an environment-backed value outside committed config`,
          ),
        );
  const toolFilter = asRecord(server.toolFilter);
  if (toolFilter && !Array.isArray(toolFilter.include) && !Array.isArray(toolFilter.exclude))
    issues.push(issue("warning", "toolFilter is present but has no include or exclude list"));
  if (
    params.probe &&
    server.enabled !== false &&
    !issues.some((entry) => entry.level === "error")
  ) {
    const probeIssue = await probeMcpServerIssue({
      config: params.config,
      name,
      server,
    });
    if (probeIssue) issues.push(probeIssue);
  }
  return issues;
}
async function probeMcpServerIssue(params) {
  const runtime = createSessionMcpRuntime({
    sessionId: "openclaw-cli-mcp-doctor",
    workspaceDir: process.cwd(),
    cfg: buildMcpProbeConfig({
      config: params.config,
      servers: { [params.name]: params.server },
    }),
    manifestRegistry: { plugins: [] },
  });
  try {
    const result = formatMcpProbeResult(await runtime.getCatalog());
    const diagnostic = result.diagnostics[0];
    if (diagnostic) return issue("error", `probe failed: ${diagnostic.message}`);
    if (!result.servers[params.name]) return issue("error", "probe did not connect to this server");
    return null;
  } catch (err) {
    return issue("error", `probe failed: ${formatErrorMessage(err)}`);
  } finally {
    await runtime.dispose();
  }
}
async function buildMcpStatusEntries(servers) {
  const entries = Object.entries(servers).toSorted(([a], [b]) => a.localeCompare(b));
  return Promise.all(
    entries.map(async ([name, server]) => {
      const resolved = resolveMcpTransportConfig(name, server);
      const enabled = server.enabled !== false;
      const entry = {
        name,
        configured: true,
        enabled,
        ok: enabled && Boolean(resolved),
        transport: resolved?.transportType,
        launch: resolved?.description,
        requestTimeoutMs: resolved?.requestTimeoutMs,
        connectionTimeoutMs: resolved?.connectionTimeoutMs,
        supportsParallelToolCalls: resolved?.supportsParallelToolCalls,
        toolFilter: server.toolFilter,
        codex: server.codex,
      };
      if (server.auth) entry.auth = server.auth;
      if (server.auth === "oauth" && resolved?.kind === "http")
        entry.authStatus = await readMcpOAuthCredentialsStatus({
          serverName: name,
          serverUrl: resolved.url,
        });
      return entry;
    }),
  );
}
function formatMcpProbeResult(catalog) {
  const projectedTools = buildBundleMcpToolsFromCatalog({
    catalog,
    createResourceListExecute: () => async () => {
      throw new Error("probe projection cannot execute MCP resources_list");
    },
    createResourceReadExecute: () => async () => {
      throw new Error("probe projection cannot execute MCP resources_read");
    },
    createPromptListExecute: () => async () => {
      throw new Error("probe projection cannot execute MCP prompts_list");
    },
    createPromptGetExecute: () => async () => {
      throw new Error("probe projection cannot execute MCP prompts_get");
    },
  });
  return {
    generatedAt: new Date(catalog.generatedAt).toISOString(),
    servers: Object.fromEntries(
      Object.entries(catalog.servers)
        .toSorted(([a], [b]) => a.localeCompare(b))
        .map(([name, server]) => [
          name,
          {
            launch: server.launchSummary,
            tools: server.toolCount,
            ...(server.requestTimeoutMs ? { requestTimeoutMs: server.requestTimeoutMs } : {}),
            ...(server.supportsParallelToolCalls
              ? { supportsParallelToolCalls: server.supportsParallelToolCalls }
              : {}),
            ...(server.tools?.filteredCount ? { filteredTools: server.tools.filteredCount } : {}),
            ...(server.resources ? { resources: true } : {}),
            ...(server.prompts ? { prompts: true } : {}),
            ...(server.tools?.listChanged ||
            server.resources?.listChanged ||
            server.prompts?.listChanged
              ? {
                  listChanged: {
                    tools: server.tools?.listChanged === true,
                    resources: server.resources?.listChanged === true,
                    prompts: server.prompts?.listChanged === true,
                  },
                }
              : {}),
          },
        ]),
    ),
    tools: projectedTools.map((tool) => tool.name).toSorted(),
    diagnostics: catalog.diagnostics ?? [],
  };
}
function buildMcpProbeConfig(params) {
  return {
    ...params.config,
    mcp: {
      ...params.config.mcp,
      servers: params.servers,
    },
  };
}
async function probeMcpServersOrFail(params) {
  const runtime = createSessionMcpRuntime({
    sessionId: "openclaw-cli-mcp-probe",
    workspaceDir: process.cwd(),
    cfg: buildMcpProbeConfig({
      config: params.config,
      servers: params.servers,
    }),
    manifestRegistry: { plugins: [] },
  });
  try {
    const result = formatMcpProbeResult(await runtime.getCatalog());
    if (result.diagnostics.length > 0) {
      const first = expectDefined(result.diagnostics[0], "diagnostics entry at 0");
      fail(`MCP probe failed for "${first.serverName}" in ${params.path}: ${first.message}`);
    }
    for (const name of Object.keys(params.servers))
      if (!result.servers[name]) fail(`MCP probe did not connect to "${name}" in ${params.path}.`);
    return result;
  } finally {
    await runtime.dispose();
  }
}
const OPENCLAW_MCP_REGISTRY_SCOPE_NOTE =
  "Note: this command only shows OpenClaw-managed mcp.servers entries and does not include mcporter servers from config/mcporter.json.";
function registerMcpCli(program) {
  const mcp = program
    .command("mcp")
    .description("Manage OpenClaw mcp.servers config and channel bridge");
  mcp
    .command("serve")
    .description("Expose OpenClaw channels over MCP stdio")
    .option("--url <url>", "Gateway WebSocket URL (defaults to gateway.remote.url when configured)")
    .option("--token <token>", "Gateway token (if required)")
    .option("--token-file <path>", "Read gateway token from file")
    .option("--password <password>", "Gateway password (if required)")
    .option("--password-file <path>", "Read gateway password from file")
    .option(
      "--claude-channel-mode <mode>",
      "Claude channel notification mode: auto, on, or off",
      "auto",
    )
    .option("-v, --verbose", "Verbose logging to stderr", false)
    .action(async (opts) => {
      try {
        const { gatewayToken, gatewayPassword } = resolveGatewayAuthOptions(opts);
        const claudeChannelMode = normalizeLowercaseStringOrEmpty(
          normalizeStringifiedOptionalString(opts.claudeChannelMode) ?? "auto",
        );
        if (
          claudeChannelMode !== "auto" &&
          claudeChannelMode !== "on" &&
          claudeChannelMode !== "off"
        )
          throw new Error('Invalid --claude-channel-mode value. Use "auto", "on", or "off".');
        await serveOpenClawChannelMcp({
          gatewayUrl: opts.url,
          gatewayToken,
          gatewayPassword,
          claudeChannelMode,
          verbose: Boolean(opts.verbose),
        });
      } catch (err) {
        defaultRuntime.error(
          `MCP server failed to start: ${formatErrorMessage(err)}. Run ${formatCliCommand("openclaw mcp list")} to inspect configured servers.`,
        );
        defaultRuntime.exit(1);
      }
    });
  mcp
    .command("list")
    .description("List OpenClaw-managed MCP servers from mcp.servers")
    .option("--json", "Print JSON")
    .action(async (opts) => {
      const loaded = await listConfiguredMcpServers();
      if (!loaded.ok) fail(loaded.error);
      if (opts.json) {
        printJson(loaded.mcpServers);
        return;
      }
      const names = Object.keys(loaded.mcpServers).toSorted();
      if (names.length === 0) {
        defaultRuntime.log(
          `No OpenClaw-managed MCP servers configured in ${loaded.path}. Add one with ${formatCliCommand('openclaw mcp set <name> \'{"command":"uvx","args":["context7-mcp"]}\'')}.`,
        );
        defaultRuntime.log(OPENCLAW_MCP_REGISTRY_SCOPE_NOTE);
        return;
      }
      defaultRuntime.log(`OpenClaw-managed MCP servers (${loaded.path}):`);
      for (const name of names) defaultRuntime.log(`- ${name}`);
      defaultRuntime.log("");
      defaultRuntime.log(OPENCLAW_MCP_REGISTRY_SCOPE_NOTE);
    });
  mcp
    .command("show")
    .description("Show one OpenClaw-managed MCP server or the full mcp.servers config")
    .argument("[name]", "MCP server name")
    .option("--json", "Print JSON")
    .action(async (name, opts) => {
      const loaded = await listConfiguredMcpServers();
      if (!loaded.ok) fail(loaded.error);
      const value = name ? loaded.mcpServers[name] : loaded.mcpServers;
      if (name && !value)
        fail(
          `No MCP server named "${name}" in ${loaded.path}. Run ${formatCliCommand("openclaw mcp list")} to see configured servers.`,
        );
      if (opts.json) {
        printJson(value ?? {});
        return;
      }
      if (name) defaultRuntime.log(`OpenClaw-managed MCP server "${name}" (${loaded.path}):`);
      else defaultRuntime.log(`OpenClaw-managed MCP servers (${loaded.path}):`);
      printJson(value ?? {});
    });
  mcp
    .command("status")
    .description("Show configured MCP server transport status without connecting")
    .option("-v, --verbose", "Show transport, auth, timeout, and filter details", false)
    .option("--json", "Print JSON")
    .action(async (opts) => {
      const loaded = await listConfiguredMcpServers();
      if (!loaded.ok) fail(loaded.error);
      const status = await buildMcpStatusEntries(loaded.mcpServers);
      if (opts.json) {
        printJson({
          path: loaded.path,
          servers: status,
        });
        return;
      }
      if (status.length === 0) {
        defaultRuntime.log(`No MCP servers configured in ${loaded.path}.`);
        return;
      }
      defaultRuntime.log(`MCP server status (${loaded.path}):`);
      for (const entry of status) {
        const transport = entry.enabled ? (entry.transport ?? "invalid") : "disabled";
        const auth = entry.auth === "oauth" ? " oauth" : "";
        const oauth = entry.authStatus?.hasTokens ? " authorized" : "";
        const filters = entry.toolFilter ? " tool-filtered" : "";
        const parallel = entry.supportsParallelToolCalls ? " parallel" : "";
        defaultRuntime.log(`- ${entry.name}: ${transport}${auth}${oauth}${filters}${parallel}`);
        if (opts.verbose) {
          defaultRuntime.log(`  launch: ${entry.launch ?? "n/a"}`);
          defaultRuntime.log(
            `  timeouts: connect=${entry.connectionTimeoutMs ?? "n/a"}ms request=${entry.requestTimeoutMs ?? "n/a"}ms`,
          );
          if (entry.auth === "oauth")
            defaultRuntime.log(
              `  oauth: tokens=${entry.authStatus?.hasTokens ? "yes" : "no"} client=${entry.authStatus?.hasClientInformation ? "yes" : "no"}`,
            );
          if (entry.toolFilter) defaultRuntime.log(`  tools: ${JSON.stringify(entry.toolFilter)}`);
        }
      }
    });
  mcp
    .command("probe")
    .description("Connect to configured MCP servers and list available capabilities")
    .argument("[name]", "MCP server name")
    .option("--json", "Print JSON")
    .action(async (name, opts) => {
      const loaded = await listConfiguredMcpServers();
      if (!loaded.ok) fail(loaded.error);
      const servers = name
        ? loaded.mcpServers[name]
          ? { [name]: loaded.mcpServers[name] }
          : void 0
        : loaded.mcpServers;
      if (!servers)
        fail(
          `No MCP server named "${name}" in ${loaded.path}. Run ${formatCliCommand("openclaw mcp list")} to see configured servers.`,
        );
      if (name && loaded.mcpServers[name]?.enabled === false)
        fail(
          `MCP server "${name}" is disabled in ${loaded.path}. Run ${formatCliCommand(`openclaw mcp configure ${name} --enable`)} before probing it.`,
        );
      const runtime = createSessionMcpRuntime({
        sessionId: "openclaw-cli-mcp-probe",
        workspaceDir: process.cwd(),
        cfg: buildMcpProbeConfig({
          config: loaded.config,
          servers,
        }),
        manifestRegistry: { plugins: [] },
      });
      try {
        const result = formatMcpProbeResult(await runtime.getCatalog());
        if (opts.json) {
          printJson(result);
          return;
        }
        defaultRuntime.log(`MCP probe (${loaded.path}):`);
        for (const [serverName, server] of Object.entries(result.servers))
          defaultRuntime.log(
            `- ${serverName}: ${server.tools} tools${server.resources ? ", resources" : ""}${server.prompts ? ", prompts" : ""}`,
          );
        for (const diagnostic of result.diagnostics)
          defaultRuntime.log(`! ${diagnostic.serverName}: ${diagnostic.message}`);
      } finally {
        await runtime.dispose();
      }
    });
  mcp
    .command("doctor")
    .description("Check configured MCP servers for static setup problems")
    .argument("[name]", "MCP server name")
    .option("--probe", "Also connect to each checked server", false)
    .option("--json", "Print JSON")
    .action(async (name, opts) => {
      const loaded = await listConfiguredMcpServers();
      if (!loaded.ok) fail(loaded.error);
      const selected = name
        ? loaded.mcpServers[name]
          ? { [name]: loaded.mcpServers[name] }
          : void 0
        : loaded.mcpServers;
      if (!selected)
        fail(
          `No MCP server named "${name}" in ${loaded.path}. Run ${formatCliCommand("openclaw mcp list")} to see configured servers.`,
        );
      const servers = await Promise.all(
        Object.entries(selected)
          .toSorted(([a], [b]) => a.localeCompare(b))
          .map(async ([serverName, server]) => {
            const issues = await collectMcpDoctorIssues({
              name: serverName,
              server,
              config: loaded.config,
              path: loaded.path,
              probe: Boolean(opts.probe),
            });
            return {
              name: serverName,
              ok: !issues.some((entry) => entry.level === "error"),
              issues,
            };
          }),
      );
      const ok = servers.every((server) => server.ok);
      if (opts.json) {
        printJson({
          path: loaded.path,
          ok,
          servers,
        });
        if (!ok) fail("MCP doctor found errors.");
        return;
      }
      if (servers.length === 0) {
        defaultRuntime.log(
          `No MCP servers configured in ${loaded.path}. Add one with ${formatCliCommand("openclaw mcp add <name> --command <command>")}.`,
        );
        return;
      }
      defaultRuntime.log(`MCP doctor (${loaded.path}):`);
      for (const server of servers) {
        defaultRuntime.log(`- ${server.name}: ${server.ok ? "ok" : "issues"}`);
        for (const entry of server.issues) {
          const prefix = entry.level === "error" ? "!" : entry.level === "warning" ? "-" : "i";
          defaultRuntime.log(`  ${prefix} ${entry.level}: ${entry.message}`);
        }
      }
      if (!ok) fail("MCP doctor found errors.");
    });
  mcp
    .command("add")
    .description("Add one MCP server from flags and probe it before saving")
    .argument("<name>", "MCP server name")
    .option("--command <command>", "Stdio command to spawn")
    .option("--arg <value>", "Repeatable stdio argument", collectOption, [])
    .option("--env <key=value>", "Repeatable stdio environment entry", collectOption, [])
    .option("--cwd <path>", "Working directory for stdio server")
    .option("--url <url>", "HTTP MCP server URL")
    .option("--transport <type>", "HTTP transport: streamable-http or sse")
    .option("--header <key=value>", "Repeatable HTTP header", collectOption, [])
    .option("--auth <mode>", "HTTP auth mode: oauth")
    .option("--oauth-scope <scope>", "OAuth scope")
    .option("--oauth-redirect-url <url>", "OAuth redirect URL")
    .option("--oauth-client-metadata-url <url>", "OAuth client metadata URL")
    .option("--include <csv>", "Comma-separated MCP tool names or '*' globs to expose")
    .option("--exclude <csv>", "Comma-separated MCP tool names or '*' globs to hide")
    .option("--timeout <seconds>", "Per-request timeout in seconds")
    .option("--connect-timeout <seconds>", "Connection timeout in seconds")
    .option("--parallel", "Mark this server safe for concurrent tool calls")
    .option("--disabled", "Save the server disabled", false)
    .option("--ssl-verify <boolean>", "Verify HTTPS certificates: true or false")
    .option("--client-cert <path>", "HTTP mutual TLS client certificate path")
    .option("--client-key <path>", "HTTP mutual TLS client key path")
    .option("--no-probe", "Save without connecting first")
    .action(async (name, opts) => {
      const server = {};
      const command = normalizeStringifiedOptionalString(opts.command);
      const url = normalizeStringifiedOptionalString(opts.url);
      if (command && url) fail("Specify either --command for stdio or --url for HTTP, not both.");
      if (!command && !url) fail("Specify --command for stdio or --url for HTTP.");
      if (command) {
        server.command = command;
        if (opts.arg && opts.arg.length > 0) server.args = opts.arg;
        setOptionalField(server, "env", parseKeyValueEntries(opts.env, "--env"));
        setOptionalField(server, "cwd", normalizeStringifiedOptionalString(opts.cwd));
      }
      if (url) {
        server.url = url;
        setOptionalField(server, "transport", normalizeStringifiedOptionalString(opts.transport));
        setOptionalField(server, "headers", parseKeyValueEntries(opts.header, "--header"));
        const auth = normalizeLowercaseStringOrEmpty(
          normalizeStringifiedOptionalString(opts.auth) ?? "",
        );
        if (auth && auth !== "oauth") fail('Invalid --auth value. Use "oauth".');
        if (auth) server.auth = auth;
        setOptionalField(
          server,
          "oauth",
          parseOAuthConfig({
            scope: opts.oauthScope,
            redirectUrl: opts.oauthRedirectUrl,
            clientMetadataUrl: opts.oauthClientMetadataUrl,
          }),
        );
        if (opts.sslVerify !== void 0) {
          const sslVerify = normalizeLowercaseStringOrEmpty(opts.sslVerify);
          if (sslVerify !== "true" && sslVerify !== "false")
            fail("--ssl-verify must be true or false.");
          server.sslVerify = sslVerify === "true";
        }
        setOptionalField(server, "clientCert", normalizeStringifiedOptionalString(opts.clientCert));
        setOptionalField(server, "clientKey", normalizeStringifiedOptionalString(opts.clientKey));
      }
      if (opts.disabled) server.enabled = false;
      if (opts.parallel) server.supportsParallelToolCalls = true;
      setOptionalField(server, "timeout", parsePositiveNumberOption(opts.timeout, "--timeout"));
      setOptionalField(
        server,
        "connectTimeout",
        parsePositiveNumberOption(opts.connectTimeout, "--connect-timeout"),
      );
      const include = parseCsvList(opts.include);
      const exclude = parseCsvList(opts.exclude);
      if (include || exclude)
        server.toolFilter = {
          ...(include ? { include } : {}),
          ...(exclude ? { exclude } : {}),
        };
      const loaded = await listConfiguredMcpServers();
      if (!loaded.ok) fail(loaded.error);
      const current = loaded.mcpServers[name];
      if (opts.probe !== false && server.enabled !== false && server.auth !== "oauth")
        await probeMcpServersOrFail({
          config: loaded.config,
          path: loaded.path,
          servers: { [name]: server },
        });
      const result = await setConfiguredMcpServer({
        name,
        server,
      });
      if (!result.ok) fail(result.error);
      await clearStaleMcpOAuthCredentialsForReplacement({
        name,
        previous: current,
        next: server,
      });
      defaultRuntime.log(`Saved MCP server "${name}" to ${result.path}.`);
      if (server.auth === "oauth")
        defaultRuntime.log(
          `Run ${formatCliCommand(`openclaw mcp login ${name}`)} to authorize this MCP server.`,
        );
    });
  mcp
    .command("set")
    .description("Set one OpenClaw-managed MCP server from a JSON object")
    .argument("<name>", "MCP server name")
    .argument("<value>", 'JSON object, for example {"command":"uvx","args":["context7-mcp"]}')
    .action(async (name, rawValue) => {
      const parsed = parseConfigValue(rawValue);
      if (parsed.error) fail(parsed.error);
      const loaded = await listConfiguredMcpServers();
      if (!loaded.ok) fail(loaded.error);
      const current = loaded.mcpServers[name];
      const result = await setConfiguredMcpServer({
        name,
        server: parsed.value,
      });
      if (!result.ok) fail(result.error);
      await clearStaleMcpOAuthCredentialsForReplacement({
        name,
        previous: current,
        next: parsed.value,
      });
      defaultRuntime.log(`Saved MCP server "${name}" to ${result.path}.`);
    });
  mcp
    .command("tools")
    .description("Update per-server MCP tool include/exclude filters")
    .argument("<name>", "MCP server name")
    .option("--include <csv>", "Comma-separated MCP tool names or '*' globs to expose")
    .option("--exclude <csv>", "Comma-separated MCP tool names or '*' globs to hide")
    .option("--clear", "Clear this server's MCP tool filter", false)
    .action(async (name, opts) => {
      if (!opts.clear && opts.include === void 0 && opts.exclude === void 0)
        fail("Specify --include, --exclude, or --clear.");
      const result = await updateConfiguredMcpServerTools({
        name,
        tools: opts.clear
          ? null
          : {
              include: parseCsvList(opts.include),
              exclude: parseCsvList(opts.exclude),
            },
      });
      if (!result.ok) fail(result.error);
      if (!result.updated)
        fail(
          `No MCP server named "${name}" in ${result.path}. Run ${formatCliCommand("openclaw mcp list")} to see configured servers.`,
        );
      defaultRuntime.log(`Updated MCP tool selection for "${name}" in ${result.path}.`);
    });
  mcp
    .command("configure")
    .description("Update MCP server operator controls without replacing the server")
    .argument("<name>", "MCP server name")
    .option("--enable", "Enable this saved server", false)
    .option("--disable", "Disable this saved server", false)
    .option("--include <csv>", "Comma-separated MCP tool names or '*' globs to expose")
    .option("--exclude <csv>", "Comma-separated MCP tool names or '*' globs to hide")
    .option("--clear-tools", "Clear this server's MCP tool filter", false)
    .option("--timeout <seconds>", "Per-request timeout in seconds")
    .option("--connect-timeout <seconds>", "Connection timeout in seconds")
    .option("--clear-timeouts", "Clear request and connection timeout overrides", false)
    .option("--parallel", "Mark this server safe for concurrent tool calls")
    .option("--no-parallel", "Clear the concurrent tool-call marker")
    .option("--auth <mode>", "HTTP auth mode: oauth")
    .option("--clear-auth", "Clear auth and OAuth metadata", false)
    .option("--oauth-scope <scope>", "OAuth scope")
    .option("--oauth-redirect-url <url>", "OAuth redirect URL")
    .option("--oauth-client-metadata-url <url>", "OAuth client metadata URL")
    .option("--ssl-verify <boolean>", "Verify HTTPS certificates: true or false")
    .option("--client-cert <path>", "HTTP mutual TLS client certificate path")
    .option("--client-key <path>", "HTTP mutual TLS client key path")
    .option("--clear-tls", "Clear TLS verification and mTLS overrides", false)
    .option("--probe", "Probe the updated server before saving", false)
    .action(async (name, opts) => {
      if (opts.enable && opts.disable) fail("Specify only one of --enable or --disable.");
      const loaded = await listConfiguredMcpServers();
      if (!loaded.ok) fail(loaded.error);
      const current = loaded.mcpServers[name];
      if (!current)
        fail(
          `No MCP server named "${name}" in ${loaded.path}. Run ${formatCliCommand("openclaw mcp list")} to see configured servers.`,
        );
      const next = { ...current };
      const clearOAuthCredentials = opts.clearAuth;
      if (opts.enable) delete next.enabled;
      if (opts.disable) next.enabled = false;
      if (opts.clearTools) delete next.toolFilter;
      else {
        const include = parseCsvList(opts.include);
        const exclude = parseCsvList(opts.exclude);
        if (include || exclude)
          next.toolFilter = {
            ...(include ? { include } : {}),
            ...(exclude ? { exclude } : {}),
          };
      }
      if (opts.clearTimeouts) {
        delete next.timeout;
        delete next.connectTimeout;
        delete next.connect_timeout;
        delete next.requestTimeoutMs;
        delete next.connectionTimeoutMs;
      }
      setOptionalField(next, "timeout", parsePositiveNumberOption(opts.timeout, "--timeout"));
      setOptionalField(
        next,
        "connectTimeout",
        parsePositiveNumberOption(opts.connectTimeout, "--connect-timeout"),
      );
      if (opts.parallel === true) next.supportsParallelToolCalls = true;
      else if (opts.parallel === false) {
        delete next.supportsParallelToolCalls;
        delete next.supports_parallel_tool_calls;
      }
      if (opts.clearAuth) {
        delete next.auth;
        delete next.oauth;
      }
      const auth = normalizeLowercaseStringOrEmpty(
        normalizeStringifiedOptionalString(opts.auth) ?? "",
      );
      if (auth && auth !== "oauth") fail('Invalid --auth value. Use "oauth".');
      if (auth) next.auth = auth;
      const oauth = parseOAuthConfig({
        scope: opts.oauthScope,
        redirectUrl: opts.oauthRedirectUrl,
        clientMetadataUrl: opts.oauthClientMetadataUrl,
      });
      if (oauth) next.oauth = oauth;
      if (opts.clearTls) {
        delete next.sslVerify;
        delete next.ssl_verify;
        delete next.clientCert;
        delete next.client_cert;
        delete next.clientKey;
        delete next.client_key;
      }
      if (opts.sslVerify !== void 0) {
        const sslVerify = normalizeLowercaseStringOrEmpty(opts.sslVerify);
        if (sslVerify !== "true" && sslVerify !== "false")
          fail("--ssl-verify must be true or false.");
        next.sslVerify = sslVerify === "true";
      }
      setOptionalField(next, "clientCert", normalizeStringifiedOptionalString(opts.clientCert));
      setOptionalField(next, "clientKey", normalizeStringifiedOptionalString(opts.clientKey));
      if (opts.probe && next.enabled !== false && next.auth !== "oauth")
        await probeMcpServersOrFail({
          config: loaded.config,
          path: loaded.path,
          servers: { [name]: next },
        });
      if (opts.enable && Object.keys(next).length === 0) {
        const result = await unsetConfiguredMcpServer({ name });
        if (!result.ok) fail(result.error);
        if (clearOAuthCredentials) await clearMcpOAuthCredentialsForConfiguredServer(name, current);
        defaultRuntime.log(`Removed disabled MCP override for "${name}" in ${result.path}.`);
        return;
      }
      const result = await updateConfiguredMcpServer({
        name,
        update: () => next,
      });
      if (!result.ok) fail(result.error);
      if (!result.updated)
        fail(
          `No MCP server named "${name}" in ${result.path}. Run ${formatCliCommand("openclaw mcp list")} to see configured servers.`,
        );
      if (clearOAuthCredentials) await clearMcpOAuthCredentialsForConfiguredServer(name, current);
      defaultRuntime.log(`Updated MCP server "${name}" in ${result.path}.`);
    });
  mcp
    .command("login")
    .description("Authorize an OAuth MCP server")
    .argument("<name>", "MCP server name")
    .option("--code <code>", "Authorization code from the OAuth redirect")
    .action(async (name, opts) => {
      const loaded = await listConfiguredMcpServers();
      if (!loaded.ok) fail(loaded.error);
      const server = loaded.mcpServers[name];
      if (!server)
        fail(
          `No MCP server named "${name}" in ${loaded.path}. Run ${formatCliCommand("openclaw mcp list")} to see configured servers.`,
        );
      if (server.auth !== "oauth")
        fail(`MCP server "${name}" is not configured with auth: "oauth".`);
      if (typeof server.url !== "string" || server.url.trim().length === 0)
        fail(`MCP server "${name}" needs a URL for OAuth login.`);
      const resolved = resolveMcpTransportConfig(name, server);
      if (!resolved || resolved.kind !== "http")
        fail(`MCP server "${name}" needs a valid HTTP transport for OAuth login.`);
      if (
        (await runMcpOAuthLogin({
          serverName: name,
          serverUrl: resolved.url,
          config: server.oauth,
          authorizationCode: opts.code,
          fetchFn: withSameOriginMcpHttpHeaders({
            fetchFn: buildMcpHttpFetch({
              sslVerify: resolved.sslVerify,
              clientCert: resolved.clientCert,
              clientKey: resolved.clientKey,
              resourceUrl: resolved.url,
              timeoutMs: resolved.requestTimeoutMs,
            }),
            headers: withoutMcpAuthorizationHeader(resolved.headers),
            resourceUrl: resolved.url,
          }),
          onAuthorizationUrl: (url) => {
            defaultRuntime.log(`Open this URL to authorize "${name}":`);
            defaultRuntime.log(url.toString());
            defaultRuntime.log(
              `After approval, run ${formatCliCommand(`openclaw mcp login ${name} --code <code>`)}.`,
            );
          },
        })) === "authorized"
      )
        defaultRuntime.log(`MCP OAuth credentials saved for "${name}".`);
    });
  mcp
    .command("logout")
    .description("Clear stored OAuth credentials for an MCP server")
    .argument("<name>", "MCP server name")
    .action(async (name) => {
      const loaded = await listConfiguredMcpServers();
      if (!loaded.ok) fail(loaded.error);
      const server = loaded.mcpServers[name];
      if (!server)
        fail(
          `No MCP server named "${name}" in ${loaded.path}. Run ${formatCliCommand("openclaw mcp list")} to see configured servers.`,
        );
      const resolved = resolveMcpTransportConfig(name, server);
      if (!resolved || resolved.kind !== "http")
        fail(`MCP server "${name}" needs a valid HTTP transport for OAuth logout.`);
      await clearMcpOAuthCredentials({
        serverName: name,
        serverUrl: resolved.url,
      });
      defaultRuntime.log(`MCP OAuth credentials cleared for "${name}".`);
    });
  mcp
    .command("reload")
    .description("Dispose cached MCP runtimes so new config is used on the next turn")
    .action(async () => {
      const { disposeAllSessionMcpRuntimes } = await import("./agents/agent-bundle-mcp-runtime.js");
      await disposeAllSessionMcpRuntimes();
      defaultRuntime.log(
        "Disposed cached MCP runtimes. Active agents use new MCP config on their next runtime build.",
      );
    });
  mcp
    .command("unset")
    .description("Remove one OpenClaw-managed MCP server")
    .argument("<name>", "MCP server name")
    .action(async (name) => {
      const loaded = await listConfiguredMcpServers();
      if (!loaded.ok) fail(loaded.error);
      const current = loaded.mcpServers[name];
      const result = await unsetConfiguredMcpServer({ name });
      if (!result.ok) fail(result.error);
      if (!result.removed)
        fail(
          `No MCP server named "${name}" in ${result.path}. Run ${formatCliCommand("openclaw mcp list")} to see configured servers.`,
        );
      if (current) await clearMcpOAuthCredentialsForConfiguredServer(name, current);
      defaultRuntime.log(`Removed MCP server "${name}" from ${result.path}.`);
    });
  applyParentDefaultHelpAction(mcp);
}
//#endregion
export { registerMcpCli };
