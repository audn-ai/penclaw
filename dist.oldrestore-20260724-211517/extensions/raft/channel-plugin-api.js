import { spawn } from "node:child_process";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { createServer } from "node:http";
import { n as describeAccountSnapshot } from "../../account-helpers-BAtt8fRD.js";
import {
  a as waitUntilAbort,
  r as keepHttpServerTaskAlive,
} from "../../channel-lifecycle.core-BZ1pethE.js";
import "../../security-runtime-CraX8Pqe.js";
import { r as buildChannelConfigSchema } from "../../config-schema-qmCQZl6j.js";
import "../../channel-core-Z_rV5hXh.js";
import { i as createChatChannelPlugin } from "../../core-V3U0lOIj.js";
import { t as detectBinary } from "../../detect-binary-BkSLZSbH.js";
import "../../channel-config-schema-C-vJvjtu.js";
import "../../setup-tools-DI8M-Tdb.js";
import "../../channel-outbound-DlkFd7rO.js";
import { t as KeyedAsyncQueue } from "../../keyed-async-queue-CTreGrmR.js";
import { t as createClaimableDedupe } from "../../persistent-dedupe-CMTHL22F.js";
import { At as boolean, Nn as record, Rn as string, Tn as object } from "../../schemas-CBJjibl3.js";
import { t as safeEqualSecret } from "../../secret-equal-DRsL8lKD.js";
import {
  a as resolveRaftAccount,
  i as resolveDefaultRaftAccountId,
  n as RAFT_CHANNEL_ID,
  r as listRaftAccountIds,
  t as raftSetupPlugin,
} from "../../setup-p50hSmF0.js";
import {
  d as createDefaultChannelRuntimeState,
  n as buildBaseChannelStatusSummary,
  u as createComputedAccountStatusAdapter,
} from "../../status-helpers-SdoCNDDu.js";
//#region extensions/raft/src/config-schema.ts
const RaftAccountSchema = object({
  name: string().optional(),
  enabled: boolean().optional(),
  profile: string().min(1).optional(),
}).strict();
const raftChannelConfigSchema = buildChannelConfigSchema(
  object({
    name: string().optional(),
    enabled: boolean().optional(),
    profile: string().min(1).optional(),
    defaultAccount: string().optional(),
    accounts: record(string(), RaftAccountSchema).optional(),
  }).strict(),
);
//#endregion
//#region extensions/raft/src/inbound.ts
const WAKE_TEXT =
  "Raft wake hint received. Check Raft for pending messages, then reply through the Raft CLI.";
function shellQuote(value) {
  return `'${value.replaceAll("'", `'"'"'`)}'`;
}
async function dispatchRaftWake(params) {
  const { ctx } = params;
  const channelRuntime = ctx.channelRuntime;
  const profile = ctx.account.profile;
  if (!channelRuntime || !profile) return;
  const route = channelRuntime.routing.resolveAgentRoute({
    cfg: ctx.cfg,
    channel: RAFT_CHANNEL_ID,
    accountId: ctx.accountId,
    peer: {
      kind: "direct",
      id: profile,
    },
  });
  const timestamp = Date.now();
  const command = `raft --profile ${shellQuote(profile)}`;
  await channelRuntime.inbound.run({
    channel: RAFT_CHANNEL_ID,
    accountId: ctx.accountId,
    raw: {
      kind: "wake",
      profile,
    },
    adapter: {
      ingest: () => ({
        id: randomUUID(),
        timestamp,
        rawText: WAKE_TEXT,
        textForAgent: `${WAKE_TEXT}\n\nUse \`${command} message check\` to read pending messages and \`${command} message send\` to respond.`,
        textForCommands: "",
      }),
      resolveTurn: async (input) => {
        const ctxPayload = channelRuntime.inbound.buildContext({
          channel: RAFT_CHANNEL_ID,
          accountId: ctx.accountId,
          messageId: input.id,
          timestamp: input.timestamp,
          from: `raft:${profile}`,
          sender: {
            id: profile,
            name: "Raft",
          },
          conversation: {
            kind: "direct",
            id: profile,
            label: `Raft ${profile}`,
          },
          route: {
            agentId: route.agentId,
            accountId: ctx.accountId,
            routeSessionKey: route.sessionKey,
            dispatchSessionKey: route.sessionKey,
          },
          reply: { to: `raft:${profile}` },
          message: {
            rawBody: input.rawText,
            commandBody: input.textForCommands,
            bodyForAgent: input.textForAgent,
          },
        });
        const storePath = channelRuntime.session.resolveStorePath(ctx.cfg.session?.store, {
          agentId: route.agentId,
        });
        return {
          cfg: ctx.cfg,
          channel: RAFT_CHANNEL_ID,
          accountId: ctx.accountId,
          agentId: route.agentId,
          routeSessionKey: route.sessionKey,
          storePath,
          ctxPayload,
          recordInboundSession: channelRuntime.session.recordInboundSession,
          dispatchReplyWithBufferedBlockDispatcher:
            channelRuntime.reply.dispatchReplyWithBufferedBlockDispatcher,
          delivery: { deliver: async () => ({ visibleReplySent: false }) },
          record: {
            onRecordError: (error) =>
              ctx.log?.warn?.(`Raft session metadata update failed: ${String(error)}`),
          },
        };
      },
    },
  });
}
//#endregion
//#region extensions/raft/src/gateway.ts
const BRIDGE_HOST = "127.0.0.1";
const ACTIVITY_DRAIN_PATH = "/activity/drain";
const HEALTH_PATH = "/health";
const WAKE_PATH = "/wake";
const WAKE_TOKEN_HEADER = "x-raft-bridge-token";
const RAFT_ACTIVITY_DRAIN_SCHEMA = "raft-activity-drain.v1";
const MAX_WAKE_BODY_BYTES = 16 * 1024;
const WAKE_DEDUPE_TTL_MS = 1440 * 60 * 1e3;
const WAKE_DEDUPE_MEMORY_MAX_SIZE = 1e3;
const WAKE_DEDUPE_STATE_MAX_ENTRIES = 1e4;
const FORBIDDEN_WAKE_CONTENT_KEYS = /* @__PURE__ */ new Set([
  "body",
  "content",
  "message",
  "messages",
  "preview",
  "snippet",
  "text",
]);
const WAKE_EVENT_ID_FIELDS = ["eventId", "attemptId", "messageId", "delivery_id", "wake_id", "id"];
var WakeRequestError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
};
function createToken() {
  return randomBytes(32).toString("hex");
}
function spawnRaftBridge(params) {
  return spawn(
    "raft",
    [
      "--profile",
      params.profile,
      "agent",
      "bridge",
      "--wake-adapter",
      "wake-channel",
      "--wake-channel-endpoint",
      params.endpoint,
    ],
    {
      env: {
        ...process.env,
        RAFT_CHANNEL_TOKEN: params.token,
      },
      stdio: "ignore",
      windowsHide: true,
    },
  );
}
function hasMatchingToken(request, expected) {
  const value = request.headers[WAKE_TOKEN_HEADER];
  if (typeof value !== "string") return false;
  return safeEqualSecret(value, expected);
}
async function readWakePayload(request) {
  const chunks = [];
  let bytes = 0;
  let tooLarge = false;
  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    bytes += buffer.length;
    if (bytes > MAX_WAKE_BODY_BYTES) {
      tooLarge = true;
      continue;
    }
    chunks.push(buffer);
  }
  if (tooLarge) throw new WakeRequestError(413, "Wake payload exceeds the 16 KiB limit.");
  const text = Buffer.concat(chunks).toString("utf8").trim();
  if (!text) return {};
  let payload;
  try {
    payload = JSON.parse(text);
  } catch {
    throw new WakeRequestError(400, "Wake payload must be valid JSON.");
  }
  if (!payload || typeof payload !== "object" || Array.isArray(payload))
    throw new WakeRequestError(400, "Wake payload must be an object.");
  return payload;
}
function containsMessageContent(value) {
  if (Array.isArray(value)) return value.some(containsMessageContent);
  if (!value || typeof value !== "object") return false;
  return Object.entries(value).some(
    ([key, child]) =>
      FORBIDDEN_WAKE_CONTENT_KEYS.has(key.toLowerCase()) || containsMessageContent(child),
  );
}
function resolveWakeEventId(payload) {
  for (const field of WAKE_EVENT_ID_FIELDS) {
    const value = payload[field];
    if (typeof value === "string" && value) return value;
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
  }
}
function hashWakeEventId(eventId) {
  return createHash("sha256").update(eventId).digest("hex");
}
function resolveWakeDedupeKey(payload) {
  const eventId = resolveWakeEventId(payload);
  return eventId ? hashWakeEventId(`id:${eventId}`) : void 0;
}
function sendJson(response, statusCode, body) {
  response.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
  });
  response.end(JSON.stringify(body));
}
function closeServer(server, sockets) {
  for (const socket of sockets) socket.destroy();
  if (server.listening) server.close();
}
function stopBridge(child) {
  child.kill("SIGTERM");
  const forceKill = setTimeout(() => child.kill("SIGKILL"), 5e3);
  forceKill.unref();
  child.once("exit", () => clearTimeout(forceKill));
}
async function listenLoopback(server) {
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, BRIDGE_HOST, () => {
      server.off("error", reject);
      resolve();
    });
  });
  const address = server.address();
  if (!address || typeof address === "string")
    throw new Error("Raft wake server did not bind a TCP port.");
  return address.port;
}
async function startRaftGatewayAccount(ctx, deps = {}) {
  const profile = ctx.account.profile;
  if (!ctx.account.enabled) {
    await waitUntilAbort(ctx.abortSignal);
    return;
  }
  if (!profile) throw new Error(`Raft account "${ctx.accountId}" is missing a CLI profile.`);
  if (!ctx.channelRuntime)
    throw new Error("Raft requires OpenClaw channel runtime support. Update OpenClaw and retry.");
  const wakeQueue = new KeyedAsyncQueue();
  const wakeDedupe =
    deps.wakeDedupe ??
    createClaimableDedupe({
      ttlMs: WAKE_DEDUPE_TTL_MS,
      memoryMaxSize: WAKE_DEDUPE_MEMORY_MAX_SIZE,
      pluginId: "raft",
      namespacePrefix: "raft-wake-dedupe",
      stateMaxEntries: WAKE_DEDUPE_STATE_MAX_ENTRIES,
      onDiskError: (error) => {
        ctx.log?.warn?.(`Raft wake dedupe storage failed: ${String(error)}`);
      },
    });
  const token = (deps.createToken ?? createToken)();
  const runtimeSession = randomUUID();
  const sockets = /* @__PURE__ */ new Set();
  let stopped = false;
  let bridgeExited;
  const server = createServer((request, response) => {
    (async () => {
      if (request.method === "GET" && request.url === HEALTH_PATH) {
        sendJson(response, 200, { ok: true });
        return;
      }
      if (
        request.method === "GET" &&
        new URL(request.url ?? "/", `http://${BRIDGE_HOST}`).pathname === ACTIVITY_DRAIN_PATH
      ) {
        if (!hasMatchingToken(request, token)) {
          sendJson(response, 401, { error: "unauthorized" });
          return;
        }
        sendJson(response, 200, {
          schema: RAFT_ACTIVITY_DRAIN_SCHEMA,
          events: [],
          dropped: 0,
        });
        return;
      }
      if (request.method !== "POST" || request.url !== WAKE_PATH) {
        sendJson(response, 404, { error: "not found" });
        return;
      }
      if (!hasMatchingToken(request, token)) {
        sendJson(response, 401, { error: "unauthorized" });
        return;
      }
      const payload = await readWakePayload(request);
      if (containsMessageContent(payload))
        throw new WakeRequestError(400, "Wake payload must not include message content.");
      ctx.setStatus({
        ...ctx.getStatus(),
        accountId: ctx.accountId,
        lastInboundAt: Date.now(),
      });
      const dedupeKey = resolveWakeDedupeKey(payload);
      if (!dedupeKey)
        throw new WakeRequestError(400, "Wake payload must include a stable event identity.");
      const dispatched = await wakeQueue.enqueue(ctx.accountId, async () => {
        if (ctx.abortSignal?.aborted) throw new WakeRequestError(503, "Raft Gateway is stopping.");
        const claim = await wakeDedupe.claim(dedupeKey, { namespace: ctx.accountId });
        if (claim.kind === "duplicate") return false;
        if (claim.kind === "inflight") {
          if (await claim.pending) return false;
          throw new WakeRequestError(503, "Raft wake delivery is retrying.");
        }
        try {
          await dispatchRaftWake({ ctx });
        } catch (error) {
          wakeDedupe.release(dedupeKey, {
            namespace: ctx.accountId,
            error,
          });
          throw error;
        }
        await wakeDedupe.commit(dedupeKey, { namespace: ctx.accountId });
        return true;
      });
      sendJson(response, 202, {
        ok: true,
        accepted: true,
        runtimeSession,
        ...(dispatched ? {} : { duplicate: true }),
      });
    })().catch((error) => {
      const statusCode = error instanceof WakeRequestError ? error.statusCode : 500;
      const message = error instanceof WakeRequestError ? error.message : "Internal server error.";
      ctx.log?.warn?.(`Raft wake request rejected: ${message}`);
      if (!response.headersSent) sendJson(response, statusCode, { error: message });
      else response.destroy();
    });
  });
  server.on("connection", (socket) => {
    sockets.add(socket);
    socket.once("close", () => sockets.delete(socket));
  });
  let bridge;
  let bridgeStopRequested = false;
  const requestBridgeStop = () => {
    if (!bridge || bridgeStopRequested) return;
    bridgeStopRequested = true;
    stopBridge(bridge);
  };
  try {
    const port = await listenLoopback(server);
    const endpoint = `http://${BRIDGE_HOST}:${port}${WAKE_PATH}`;
    bridge = (deps.spawnBridge ?? spawnRaftBridge)({
      profile,
      endpoint,
      token,
    });
    bridge.once("error", (error) => {
      if (!stopped) {
        bridgeExited = /* @__PURE__ */ new Error(`Raft bridge failed to start: ${String(error)}`);
        closeServer(server, sockets);
      }
    });
    bridge.once("exit", (code, signal) => {
      if (!stopped) {
        bridgeExited = /* @__PURE__ */ new Error(
          `Raft bridge exited unexpectedly (code=${code ?? "null"}, signal=${signal ?? "none"}).`,
        );
        closeServer(server, sockets);
      }
    });
    ctx.setStatus({
      accountId: ctx.accountId,
      running: true,
      connected: true,
      lastStartAt: Date.now(),
      lastError: null,
    });
    ctx.log?.info?.(`Raft bridge started for profile "${profile}".`);
    await keepHttpServerTaskAlive({
      server,
      abortSignal: ctx.abortSignal,
      onAbort: () => {
        stopped = true;
        requestBridgeStop();
        closeServer(server, sockets);
      },
    });
    if (bridgeExited) throw bridgeExited;
  } catch (error) {
    ctx.setStatus({
      accountId: ctx.accountId,
      running: false,
      connected: false,
      lastStopAt: Date.now(),
      lastError: String(error),
    });
    throw error;
  } finally {
    stopped = true;
    requestBridgeStop();
    closeServer(server, sockets);
    ctx.setStatus({
      accountId: ctx.accountId,
      running: false,
      connected: false,
      lastStopAt: Date.now(),
      ...(bridgeExited ? { lastError: bridgeExited.message } : {}),
    });
  }
}
//#endregion
//#region extensions/raft/src/channel.ts
const raftPlugin = createChatChannelPlugin({
  base: {
    id: RAFT_CHANNEL_ID,
    meta: {
      id: RAFT_CHANNEL_ID,
      label: "Raft",
      selectionLabel: "Raft (CLI wake bridge)",
      docsPath: "/channels/raft",
      docsLabel: "raft",
      blurb: "Raft CLI wake bridge for human and agent collaboration.",
      order: 72,
    },
    capabilities: { chatTypes: ["direct"] },
    setup: raftSetupPlugin.setup,
    setupWizard: raftSetupPlugin.setupWizard,
    reload: { configPrefixes: ["channels.raft"] },
    configSchema: raftChannelConfigSchema,
    config: {
      listAccountIds: listRaftAccountIds,
      resolveAccount: (cfg, accountId) =>
        resolveRaftAccount({
          cfg,
          accountId,
        }),
      defaultAccountId: resolveDefaultRaftAccountId,
      isConfigured: (account) => account.configured,
      isEnabled: (account) => account.enabled,
      describeAccount: (account) =>
        describeAccountSnapshot({
          account,
          configured: account.configured,
          extra: { profile: account.profile },
        }),
    },
    status: createComputedAccountStatusAdapter({
      defaultRuntime: createDefaultChannelRuntimeState("default"),
      buildChannelSummary: ({ snapshot }) => buildBaseChannelStatusSummary(snapshot),
      probeAccount: async () => ({ cliFound: await detectBinary("raft") }),
      formatCapabilitiesProbe: ({ probe }) => [
        {
          text: `Raft CLI: ${probe.cliFound ? "found" : "missing"}`,
          ...(probe.cliFound ? {} : { tone: "error" }),
        },
      ],
      collectStatusIssues: (accounts) =>
        accounts.flatMap((account) => {
          if (!account.configured)
            return [
              {
                channel: RAFT_CHANNEL_ID,
                accountId: account.accountId,
                kind: "config",
                message: "Raft account is missing a CLI profile",
                fix: "Set channels.raft.profile or RAFT_PROFILE.",
              },
            ];
          return [];
        }),
      resolveAccountSnapshot: ({ account }) => ({
        accountId: account.accountId,
        name: account.name ?? void 0,
        enabled: account.enabled,
        configured: account.configured,
        extra: { profile: account.profile },
      }),
    }),
    gateway: { startAccount: async (ctx) => await startRaftGatewayAccount(ctx) },
  },
});
//#endregion
export { raftPlugin };
