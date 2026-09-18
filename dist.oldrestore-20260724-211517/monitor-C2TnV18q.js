import { r as waitForAbortSignal } from "./abort-signal-DEbc_zqk.js";
import { n as createChannelPairingController } from "./channel-pairing-1V8FM4wM.js";
import {
  n as resolveZaloRuntimeGroupPolicy,
  t as normalizeZaloAllowEntry,
} from "./group-access-CzCOOJZN.js";
import { t as registerPluginHttpRoute } from "./http-registry-BeVjji7b.js";
import { r as resolveInboundRouteEnvelopeBuilderWithRuntime } from "./inbound-envelope-ByuqRWu-.js";
import { m as formatInboundMediaUnavailableText } from "./kernel-BhdvbEs2.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-B-Fc-m0I.js";
import "./number-runtime-B-n-wjMn.js";
import "./runtime-env-D0V-7Gqz.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import { r as logTypingFailure } from "./logging-gUWPKC5g.js";
import { i as resolveStableChannelMessageIngress } from "./message-access-DY5sc0VK.js";
import {
  C as resolveExpiresAtMsFromDurationMs,
  o as asDateTimestampMs,
} from "./number-coercion-CJQ8TR--.js";
import { t as createHostedOutboundMediaStore } from "./outbound-media-DXLWAnHG.js";
import {
  a as getUpdates,
  c as sendMessage,
  l as sendPhoto,
  n as ZaloApiError,
  o as getWebhookInfo,
  r as deleteWebhook,
  s as sendChatAction,
  t as resolveZaloProxyFetch,
  u as setWebhook,
} from "./proxy-CNK10_dW.js";
import "./channel-inbound-vhkYEe2n.js";
import "./channel-feedback-lNNgzRXo.js";
import {
  i as deliverTextOrMediaReply,
  m as resolveSendableOutboundReplyParts,
} from "./reply-payload-DDwHXDkv.js";
import "./channel-ingress-runtime-B6CHO2ZB.js";
import { t as getZaloRuntime } from "./runtime-BtVraGqZ.js";
import "./webhook-ingress-BloIhSnv.js";
import {
  a as warnMissingProviderGroupPolicyFallbackOnce,
  r as resolveDefaultGroupPolicy,
} from "./runtime-group-policy-BEjP88cf.js";
import { s as sleepWithAbort } from "./src-Dqmh2693.js";
import { l as normalizeStringEntries } from "./string-normalization-CRyoFBPt.js";
import { n as resolveWebhookPath } from "./webhook-path-CaYfbDPb.js";
//#region extensions/zalo/src/monitor-durable.ts
function prepareZaloDurableReplyPayload(params) {
  if (!params.payload.text) return params.payload;
  return {
    ...params.payload,
    text: params.convertMarkdownTables(params.payload.text, params.tableMode),
  };
}
function resolveZaloDurableReplyOptions(params) {
  if (params.infoKind !== "final") return false;
  const reply = resolveSendableOutboundReplyParts(params.payload);
  if (reply.hasMedia || !reply.hasText) return false;
  return { to: params.chatId };
}
//#endregion
//#region extensions/zalo/src/outbound-media.ts
const ZALO_OUTBOUND_MEDIA_TTL_MS = 2 * 6e4;
const ZALO_OUTBOUND_MEDIA_SEGMENT = "media";
const ZALO_OUTBOUND_MEDIA_PREFIX = `/${ZALO_OUTBOUND_MEDIA_SEGMENT}/`;
const ZALO_OUTBOUND_MEDIA_ID_RE = /^[a-f0-9]{24}$/;
const ZALO_OUTBOUND_MEDIA_NAMESPACE = "hosted-outbound-media";
const ZALO_OUTBOUND_MEDIA_CHUNKS_NAMESPACE = "hosted-outbound-media-chunks";
const ZALO_OUTBOUND_MEDIA_MAX_ENTRIES = 64;
const ZALO_OUTBOUND_MEDIA_MAX_CHUNK_ROWS = ZALO_OUTBOUND_MEDIA_MAX_ENTRIES * 256;
let hostedZaloMediaStore;
function createHostedZaloMediaStore() {
  const runtime = getZaloRuntime();
  return createHostedOutboundMediaStore({
    metadataStore: runtime.state.openKeyedStore({
      namespace: ZALO_OUTBOUND_MEDIA_NAMESPACE,
      maxEntries: 80,
    }),
    chunkStore: runtime.state.openKeyedStore({
      namespace: ZALO_OUTBOUND_MEDIA_CHUNKS_NAMESPACE,
      maxEntries: ZALO_OUTBOUND_MEDIA_MAX_CHUNK_ROWS,
    }),
    ttlMs: ZALO_OUTBOUND_MEDIA_TTL_MS,
    maxEntries: ZALO_OUTBOUND_MEDIA_MAX_ENTRIES,
    maxChunkRows: ZALO_OUTBOUND_MEDIA_MAX_CHUNK_ROWS,
    resolveExpiresAtMs: (ttlMs) => resolveExpiresAtMsFromDurationMs(ttlMs),
  });
}
function getHostedZaloMediaStore() {
  hostedZaloMediaStore ??= createHostedZaloMediaStore();
  return hostedZaloMediaStore;
}
function resolveHostedZaloMediaRoutePrefix(params) {
  const webhookRoutePath = resolveWebhookPath({
    webhookPath: params.webhookPath,
    webhookUrl: params.webhookUrl,
    defaultPath: null,
  });
  if (!webhookRoutePath)
    throw new Error("Zalo webhookPath could not be derived for outbound media hosting");
  return webhookRoutePath === "/"
    ? `/${ZALO_OUTBOUND_MEDIA_SEGMENT}`
    : `${webhookRoutePath}/${ZALO_OUTBOUND_MEDIA_SEGMENT}`;
}
function resolveHostedZaloMediaRoutePath(params) {
  return `${resolveHostedZaloMediaRoutePrefix(params)}/`;
}
async function prepareHostedZaloMediaUrl(params) {
  const now = asDateTimestampMs(Date.now());
  if (
    (now === void 0
      ? void 0
      : resolveExpiresAtMsFromDurationMs(ZALO_OUTBOUND_MEDIA_TTL_MS, { nowMs: now })) === void 0
  )
    throw new Error("Zalo outbound media expiry could not be resolved");
  const routePath = resolveHostedZaloMediaRoutePath({
    webhookUrl: params.webhookUrl,
    webhookPath: params.webhookPath,
  });
  const publicBaseUrl = new URL(params.webhookUrl).origin;
  return await getHostedZaloMediaStore().prepareUrl({
    mediaUrl: params.mediaUrl,
    routePath,
    publicBaseUrl,
    maxBytes: params.maxBytes,
    ...(params.proxyUrl ? { proxyUrl: params.proxyUrl } : {}),
  });
}
async function tryHandleHostedZaloMediaRequest(req, res) {
  const store = getHostedZaloMediaStore();
  await store.cleanupExpired();
  const method = req.method ?? "GET";
  if (method !== "GET" && method !== "HEAD") return false;
  let url;
  try {
    url = new URL(req.url ?? "/", "http://localhost");
  } catch {
    return false;
  }
  const mediaPath = url.pathname;
  const prefixIndex = mediaPath.lastIndexOf(ZALO_OUTBOUND_MEDIA_PREFIX);
  if (prefixIndex < 0) return false;
  const routePath = mediaPath.slice(0, prefixIndex + ZALO_OUTBOUND_MEDIA_PREFIX.length);
  const id = mediaPath.slice(prefixIndex + ZALO_OUTBOUND_MEDIA_PREFIX.length);
  if (!id || !ZALO_OUTBOUND_MEDIA_ID_RE.test(id)) {
    res.statusCode = 404;
    res.end("Not Found");
    return true;
  }
  const now = asDateTimestampMs(Date.now());
  if (now === void 0) {
    await store.delete(id);
    res.statusCode = 410;
    res.end("Expired");
    return true;
  }
  const entry = await store.read(id, now);
  if (!entry || entry.metadata.routePath !== routePath) {
    res.statusCode = 404;
    res.end("Not Found");
    return true;
  }
  const expiresAt = asDateTimestampMs(entry.metadata.expiresAt);
  if (expiresAt === void 0 || expiresAt <= now) {
    await store.delete(id);
    res.statusCode = 410;
    res.end("Expired");
    return true;
  }
  if (url.searchParams.get("token") !== entry.metadata.token) {
    res.statusCode = 401;
    res.end("Unauthorized");
    return true;
  }
  if (entry.metadata.contentType) res.setHeader("Content-Type", entry.metadata.contentType);
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Content-Length", String(entry.metadata.byteLength));
  if (method === "HEAD") {
    res.statusCode = 200;
    res.end();
    return true;
  }
  res.statusCode = 200;
  res.end(entry.buffer);
  await store.delete(id);
  return true;
}
//#endregion
//#region extensions/zalo/src/monitor.ts
/** Default idle timeout for Zalo inbound photo downloads (30 seconds). */
const ZALO_MEDIA_READ_IDLE_TIMEOUT_MS = 3e4;
/** Maximum wait for Zalo inbound photo response headers (120 seconds). */
const ZALO_MEDIA_RESPONSE_HEADER_TIMEOUT_MS = 12e4;
const ZALO_TEXT_LIMIT = 2e3;
const DEFAULT_MEDIA_MAX_MB = 5;
const WEBHOOK_CLEANUP_TIMEOUT_MS = 5e3;
const ZALO_TYPING_TIMEOUT_MS = 5e3;
const UNIX_MILLISECONDS_THRESHOLD = 0xe8d4a51000;
const hostedMediaRouteRefs = /* @__PURE__ */ new Map();
function resolveZaloTimestampMs(date) {
  if (!date) return;
  return date >= UNIX_MILLISECONDS_THRESHOLD ? date : date * 1e3;
}
const loadZaloWebhookModule = createLazyRuntimeModule(
  () => import("./monitor.webhook-D_plznOA.js"),
);
function releaseSharedHostedMediaRouteRef(routePath) {
  const current = hostedMediaRouteRefs.get(routePath);
  if (!current) return;
  if (current.count > 1) {
    current.count -= 1;
    return;
  }
  hostedMediaRouteRefs.delete(routePath);
  for (const unregisterHandle of current.unregisters) unregisterHandle();
}
function registerSharedHostedMediaRoute(params) {
  const unregister = registerPluginHttpRoute({
    auth: "plugin",
    match: "prefix",
    path: params.path,
    pluginId: "zalo",
    source: "zalo-hosted-media",
    accountId: params.accountId,
    log: params.log,
    handler: async (req, res) => {
      if (!(await tryHandleHostedZaloMediaRequest(req, res)) && !res.headersSent) {
        res.statusCode = 404;
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.end("Not Found");
      }
    },
  });
  const existing = hostedMediaRouteRefs.get(params.path);
  if (existing) {
    existing.count += 1;
    existing.unregisters.push(unregister);
    return () => releaseSharedHostedMediaRouteRef(params.path);
  }
  hostedMediaRouteRefs.set(params.path, {
    count: 1,
    unregisters: [unregister],
  });
  return () => releaseSharedHostedMediaRouteRef(params.path);
}
function formatZaloError(error) {
  if (error instanceof Error) return error.stack ?? `${error.name}: ${error.message}`;
  return String(error);
}
function describeWebhookTarget(rawUrl) {
  try {
    const parsed = new URL(rawUrl);
    return `${parsed.origin}${parsed.pathname}`;
  } catch {
    return rawUrl;
  }
}
function normalizeWebhookUrl(url) {
  const trimmed = url?.trim();
  return trimmed ? trimmed : void 0;
}
function logVerbose(core, runtime, message) {
  if (core.logging.shouldLogVerbose()) runtime.log?.(`[zalo] ${message}`);
}
async function handleZaloWebhookRequest(req, res) {
  const { handleZaloWebhookRequest: handleZaloWebhookRequestInternal } =
    await loadZaloWebhookModule();
  return await handleZaloWebhookRequestInternal(req, res, async ({ update, target }) => {
    await processUpdate({
      update,
      token: target.token,
      account: target.account,
      config: target.config,
      runtime: target.runtime,
      core: target.core,
      mediaMaxMb: target.mediaMaxMb,
      canHostMedia: target.canHostMedia,
      webhookUrl: target.webhookUrl,
      webhookPath: target.webhookPath,
      statusSink: target.statusSink,
      fetcher: target.fetcher,
    });
  });
}
function startPollingLoop(params) {
  const {
    token,
    account,
    config,
    runtime,
    core,
    mediaMaxMb,
    canHostMedia,
    webhookUrl,
    webhookPath,
    abortSignal,
    isStopped,
    statusSink,
    fetcher,
  } = params;
  const pollTimeout = 30;
  const processingContext = {
    token,
    account,
    config,
    runtime,
    core,
    mediaMaxMb,
    canHostMedia,
    webhookUrl,
    webhookPath,
    statusSink,
    fetcher,
  };
  runtime.log?.(`[${account.accountId}] Zalo polling loop started timeout=${String(pollTimeout)}s`);
  const poll = async () => {
    if (isStopped() || abortSignal.aborted) return;
    try {
      const response = await getUpdates(token, { timeout: pollTimeout }, fetcher);
      if (isStopped() || abortSignal.aborted) return;
      if (response.ok && response.result) {
        statusSink?.({ lastInboundAt: Date.now() });
        await processUpdate({
          update: response.result,
          ...processingContext,
        });
      }
    } catch (err) {
      if (err instanceof ZaloApiError && err.isPollingTimeout) {
      } else if (!isStopped() && !abortSignal.aborted) {
        runtime.error?.(`[${account.accountId}] Zalo polling error: ${formatZaloError(err)}`);
        await sleepWithAbort(5e3, abortSignal).catch(() => void 0);
      }
    }
    if (!isStopped() && !abortSignal.aborted)
      setImmediate(() => {
        poll();
      });
  };
  poll();
}
async function processUpdate(params) {
  const { update, token, account, config, runtime, core, mediaMaxMb, statusSink, fetcher } = params;
  const { event_name, message } = update;
  const sharedContext = {
    token,
    account,
    config,
    runtime,
    core,
    mediaMaxMb,
    canHostMedia: params.canHostMedia,
    webhookUrl: params.webhookUrl,
    webhookPath: params.webhookPath,
    statusSink,
    fetcher,
  };
  if (!message) return;
  switch (event_name) {
    case "message.text.received":
      await handleTextMessage({
        message,
        ...sharedContext,
      });
      break;
    case "message.image.received":
      await handleImageMessage({
        message,
        ...sharedContext,
        mediaMaxMb,
      });
      break;
    case "message.sticker.received":
      logVerbose(core, runtime, `[${account.accountId}] Received sticker from ${message.from.id}`);
      break;
    case "message.unsupported.received":
      logVerbose(
        core,
        runtime,
        `[${account.accountId}] Received unsupported message type from ${message.from.id}`,
      );
      break;
  }
}
async function handleTextMessage(params) {
  const { message } = params;
  const { text } = message;
  if (!text?.trim()) return;
  await processMessageWithPipeline({
    ...params,
    text,
    mediaPath: void 0,
    mediaType: void 0,
  });
}
async function handleImageMessage(params) {
  const { message, mediaMaxMb, account, core, runtime } = params;
  const { photo_url, caption } = message;
  const authorization = await authorizeZaloMessage({
    ...params,
    text: caption,
    mediaPath: "__pending_media__",
    mediaType: void 0,
  });
  if (!authorization) return;
  let mediaPath;
  let mediaType;
  if (photo_url)
    try {
      const maxBytes = mediaMaxMb * 1024 * 1024;
      const saved = await core.channel.media.saveRemoteMedia({
        url: photo_url,
        maxBytes,
        responseHeaderTimeoutMs: ZALO_MEDIA_RESPONSE_HEADER_TIMEOUT_MS,
        readIdleTimeoutMs: ZALO_MEDIA_READ_IDLE_TIMEOUT_MS,
      });
      mediaPath = saved.path;
      mediaType = saved.contentType;
    } catch (err) {
      runtime.error?.(`[${account.accountId}] Failed to download Zalo image: ${String(err)}`);
    }
  const agentBody = mediaPath
    ? authorization.rawBody
    : formatInboundMediaUnavailableText({
        body: caption,
        mediaPlaceholder: "<media:image>",
        notice: "[zalo image attachment unavailable]",
      });
  await processMessageWithPipeline({
    ...params,
    authorization,
    agentBody,
    text: caption,
    mediaPath,
    mediaType,
  });
}
async function authorizeZaloMessage(params) {
  const { message, account, config, runtime, core, text, mediaPath, token, statusSink, fetcher } =
    params;
  const pairing = createChannelPairingController({
    core,
    channel: "zalo",
    accountId: account.accountId,
  });
  const { from, chat } = message;
  const isGroup = chat.chat_type === "GROUP";
  const chatId = chat.id;
  const senderId = from.id;
  const senderName = from.display_name ?? from.name;
  const dmPolicy = account.config.dmPolicy ?? "pairing";
  const defaultGroupPolicy = resolveDefaultGroupPolicy(config);
  const rawBody = text?.trim() || (mediaPath ? "<media:image>" : "");
  const { groupPolicy, providerMissingFallbackApplied } = resolveZaloRuntimeGroupPolicy({
    providerConfigPresent: config.channels?.zalo !== void 0,
    groupPolicy: account.config.groupPolicy,
    defaultGroupPolicy,
  });
  const shouldComputeAuth = core.channel.commands.shouldComputeCommandAuthorized(rawBody, config);
  const access = await resolveStableChannelMessageIngress({
    channelId: "zalo",
    accountId: account.accountId,
    identity: {
      key: "zalo-user-id",
      normalize: normalizeZaloAllowEntry,
      sensitivity: "pii",
      entryIdPrefix: "zalo-entry",
    },
    cfg: config,
    readStoreAllowFrom: async () => await pairing.readAllowFromStore(),
    subject: { stableId: senderId },
    conversation: {
      kind: isGroup ? "group" : "direct",
      id: chatId,
    },
    providerMissingFallbackApplied,
    dmPolicy,
    groupPolicy,
    policy: { groupAllowFromFallbackToAllowFrom: true },
    allowFrom: normalizeStringEntries(account.config.allowFrom),
    groupAllowFrom: normalizeStringEntries(account.config.groupAllowFrom),
    command: shouldComputeAuth ? {} : void 0,
  });
  const senderAccess = access.senderAccess;
  if (isGroup) {
    warnMissingProviderGroupPolicyFallbackOnce({
      providerMissingFallbackApplied: senderAccess.providerMissingFallbackApplied,
      providerKey: "zalo",
      accountId: account.accountId,
      log: (messageValue) => logVerbose(core, runtime, messageValue),
    });
    if (!senderAccess.allowed) {
      if (senderAccess.reasonCode === "group_policy_disabled")
        logVerbose(core, runtime, `zalo: drop group ${chatId} (groupPolicy=disabled)`);
      else if (senderAccess.reasonCode === "group_policy_empty_allowlist")
        logVerbose(
          core,
          runtime,
          `zalo: drop group ${chatId} (groupPolicy=allowlist, no groupAllowFrom)`,
        );
      else if (senderAccess.reasonCode === "group_policy_not_allowlisted")
        logVerbose(core, runtime, `zalo: drop group sender ${senderId} (groupPolicy=allowlist)`);
      return;
    }
  }
  if (
    !isGroup &&
    senderAccess.decision === "block" &&
    senderAccess.reasonCode === "dm_policy_disabled"
  ) {
    logVerbose(core, runtime, `Blocked zalo DM from ${senderId} (dmPolicy=disabled)`);
    return;
  }
  if (!isGroup && senderAccess.decision !== "allow") {
    if (dmPolicy === "pairing")
      await pairing.issueChallenge({
        senderId,
        senderIdLine: `Your Zalo user id: ${senderId}`,
        meta: { name: senderName ?? void 0 },
        onCreated: () => {
          logVerbose(core, runtime, `zalo pairing request sender=${senderId}`);
        },
        sendPairingReply: async (textLocal) => {
          await sendMessage(
            token,
            {
              chat_id: chatId,
              text: textLocal,
            },
            fetcher,
          );
          statusSink?.({ lastOutboundAt: Date.now() });
        },
        onReplyError: (err) => {
          logVerbose(core, runtime, `zalo pairing reply failed for ${senderId}: ${String(err)}`);
        },
      });
    else
      logVerbose(
        core,
        runtime,
        `Blocked unauthorized zalo sender ${senderId} (dmPolicy=${dmPolicy})`,
      );
    return;
  }
  return {
    chatId,
    commandAuthorized: access.commandAccess.requested ? access.commandAccess.authorized : void 0,
    isGroup,
    rawBody,
    senderId,
    senderName,
  };
}
async function processMessageWithPipeline(params) {
  const {
    message,
    token,
    account,
    config,
    runtime,
    core,
    mediaPath,
    mediaType,
    statusSink,
    fetcher,
    agentBody: agentBodyOverride,
    authorization: authorizationOverride,
  } = params;
  const { message_id, date } = message;
  const authorization =
    authorizationOverride ??
    (await authorizeZaloMessage({
      ...params,
      mediaPath,
      mediaType,
    }));
  if (!authorization) return;
  const { isGroup, chatId, senderId, senderName, rawBody, commandAuthorized } = authorization;
  const agentBody = agentBodyOverride ?? rawBody;
  const { route, buildEnvelope } = resolveInboundRouteEnvelopeBuilderWithRuntime({
    cfg: config,
    channel: "zalo",
    accountId: account.accountId,
    peer: {
      kind: isGroup ? "group" : "direct",
      id: chatId,
    },
    runtime: core.channel,
    sessionStore: config.session?.store,
  });
  if (
    isGroup &&
    core.channel.commands.isControlCommandMessage(rawBody, config) &&
    commandAuthorized !== true
  ) {
    logVerbose(core, runtime, `zalo: drop control command from unauthorized sender ${senderId}`);
    return;
  }
  const fromLabel = isGroup ? `group:${chatId}` : senderName || `user:${senderId}`;
  const timestamp = resolveZaloTimestampMs(date);
  const { storePath, body } = buildEnvelope({
    channel: "Zalo",
    from: fromLabel,
    timestamp,
    body: agentBody,
  });
  const ctxPayload = core.channel.inbound.buildContext({
    channel: "zalo",
    accountId: route.accountId,
    messageId: message_id,
    timestamp,
    from: isGroup ? `zalo:group:${chatId}` : `zalo:${senderId}`,
    sender: {
      id: senderId,
      name: senderName || void 0,
    },
    conversation: {
      kind: isGroup ? "group" : "direct",
      id: chatId,
      label: fromLabel,
    },
    route: {
      agentId: route.agentId,
      accountId: route.accountId,
      routeSessionKey: route.sessionKey,
    },
    reply: { to: `zalo:${chatId}` },
    message: {
      body,
      bodyForAgent: agentBody,
      rawBody,
      commandBody: rawBody,
    },
    media:
      mediaPath || mediaType
        ? [
            {
              path: mediaPath,
              url: mediaPath,
              contentType: mediaType,
            },
          ]
        : void 0,
    extra: {
      CommandAuthorized: commandAuthorized,
      GroupSubject: void 0,
    },
  });
  const tableMode = core.channel.text.resolveMarkdownTableMode({
    cfg: config,
    channel: "zalo",
    accountId: account.accountId,
  });
  await core.channel.inbound.dispatchReply({
    cfg: config,
    channel: "zalo",
    accountId: account.accountId,
    agentId: route.agentId,
    routeSessionKey: route.sessionKey,
    storePath,
    ctxPayload,
    recordInboundSession: core.channel.session.recordInboundSession,
    dispatchReplyWithBufferedBlockDispatcher:
      core.channel.reply.dispatchReplyWithBufferedBlockDispatcher,
    delivery: {
      preparePayload: (payload) =>
        prepareZaloDurableReplyPayload({
          payload,
          tableMode,
          convertMarkdownTables: core.channel.text.convertMarkdownTables,
        }),
      durable: (payload, info) =>
        resolveZaloDurableReplyOptions({
          payload,
          infoKind: info.kind,
          chatId,
        }),
      deliver: async (payload) => {
        await deliverZaloReply({
          payload,
          token,
          chatId,
          runtime,
          core,
          config,
          webhookUrl: params.webhookUrl,
          webhookPath: params.webhookPath,
          proxyUrl: account.config.proxy,
          mediaMaxBytes: params.mediaMaxMb * 1024 * 1024,
          canHostMedia: params.canHostMedia,
          accountId: account.accountId,
          statusSink,
          fetcher,
          tableMode: "off",
        });
      },
      onDelivered: () => {
        statusSink?.({ lastOutboundAt: Date.now() });
      },
      onError: (err, info) => {
        runtime.error?.(`[${account.accountId}] Zalo ${info.kind} reply failed: ${String(err)}`);
      },
    },
    replyPipeline: {
      typing: {
        start: async () => {
          await sendChatAction(
            token,
            {
              chat_id: chatId,
              action: "typing",
            },
            fetcher,
            ZALO_TYPING_TIMEOUT_MS,
          );
        },
        onStartError: (err) => {
          logTypingFailure({
            log: (messageLocal) => logVerbose(core, runtime, messageLocal),
            channel: "zalo",
            action: "start",
            target: chatId,
            error: err,
          });
        },
      },
    },
    record: {
      onRecordError: (err) => {
        runtime.error?.(`zalo: failed updating session meta: ${String(err)}`);
      },
    },
  });
}
async function deliverZaloReply(params) {
  const {
    payload,
    token,
    chatId,
    runtime,
    core,
    config,
    webhookUrl,
    webhookPath,
    proxyUrl,
    mediaMaxBytes,
    canHostMedia,
    accountId,
    statusSink,
    fetcher,
  } = params;
  const tableMode = params.tableMode ?? "code";
  const reply = resolveSendableOutboundReplyParts(payload, {
    text: core.channel.text.convertMarkdownTables(payload.text ?? "", tableMode),
  });
  const chunkMode = core.channel.text.resolveChunkMode(config, "zalo", accountId);
  await deliverTextOrMediaReply({
    payload,
    text: reply.text,
    chunkText: (value) =>
      core.channel.text.chunkMarkdownTextWithMode(value, ZALO_TEXT_LIMIT, chunkMode),
    sendText: async (chunk) => {
      try {
        await sendMessage(
          token,
          {
            chat_id: chatId,
            text: chunk,
          },
          fetcher,
        );
        statusSink?.({ lastOutboundAt: Date.now() });
      } catch (err) {
        runtime.error?.(`Zalo message send failed: ${String(err)}`);
      }
    },
    sendMedia: async ({ mediaUrl, caption }) => {
      const sendableMediaUrl =
        canHostMedia && webhookUrl && webhookPath
          ? await prepareHostedZaloMediaUrl({
              mediaUrl,
              webhookUrl,
              webhookPath,
              maxBytes: mediaMaxBytes,
              proxyUrl,
            })
          : mediaUrl;
      await sendPhoto(
        token,
        {
          chat_id: chatId,
          photo: sendableMediaUrl,
          caption,
        },
        fetcher,
      );
      statusSink?.({ lastOutboundAt: Date.now() });
    },
    onMediaError: (error) => {
      runtime.error?.(
        `Zalo photo send failed: ${error instanceof Error ? error.message : JSON.stringify(error)}`,
      );
    },
  });
}
async function monitorZaloProvider(options) {
  const {
    token,
    account,
    config,
    runtime,
    abortSignal,
    useWebhook,
    webhookUrl,
    webhookSecret,
    webhookPath,
    statusSink,
    fetcher: fetcherOverride,
  } = options;
  const core = getZaloRuntime();
  const effectiveMediaMaxMb = account.config.mediaMaxMb ?? DEFAULT_MEDIA_MAX_MB;
  const fetcher = fetcherOverride ?? resolveZaloProxyFetch(account.config.proxy);
  const mode = useWebhook ? "webhook" : "polling";
  const effectiveWebhookUrl = normalizeWebhookUrl(webhookUrl ?? account.config.webhookUrl);
  const effectiveWebhookPath =
    effectiveWebhookUrl || webhookPath?.trim() || account.config.webhookPath?.trim()
      ? (resolveWebhookPath({
          webhookPath: webhookPath ?? account.config.webhookPath,
          webhookUrl: effectiveWebhookUrl,
          defaultPath: null,
        }) ?? void 0)
      : void 0;
  const canHostMedia = Boolean(effectiveWebhookUrl && effectiveWebhookPath);
  const hostedMediaRoutePath =
    canHostMedia && effectiveWebhookUrl
      ? resolveHostedZaloMediaRoutePrefix({
          webhookUrl: effectiveWebhookUrl,
          webhookPath: effectiveWebhookPath,
        })
      : void 0;
  let stopped = false;
  const stopHandlers = [];
  let cleanupWebhook;
  const stop = () => {
    if (stopped) return;
    stopped = true;
    for (const handler of stopHandlers) handler();
  };
  const stopOnAbort = () => {
    if (!useWebhook) stop();
  };
  abortSignal.addEventListener("abort", stopOnAbort, { once: true });
  runtime.log?.(
    `[${account.accountId}] Zalo provider init mode=${mode} mediaMaxMb=${String(effectiveMediaMaxMb)}`,
  );
  try {
    if (hostedMediaRoutePath) {
      const unregisterHostedMediaRoute = registerSharedHostedMediaRoute({
        path: hostedMediaRoutePath,
        accountId: account.accountId,
        log: runtime.log,
      });
      stopHandlers.push(unregisterHostedMediaRoute);
    }
    if (useWebhook) {
      const { registerZaloWebhookTarget } = await loadZaloWebhookModule();
      if (!effectiveWebhookUrl || !webhookSecret)
        throw new Error("Zalo webhookUrl and webhookSecret are required for webhook mode");
      if (!effectiveWebhookUrl.startsWith("https://"))
        throw new Error("Zalo webhook URL must use HTTPS");
      if (webhookSecret.length < 8 || webhookSecret.length > 256)
        throw new Error("Zalo webhook secret must be 8-256 characters");
      const path = effectiveWebhookPath;
      if (!path) throw new Error("Zalo webhookPath could not be derived");
      runtime.log?.(
        `[${account.accountId}] Zalo configuring webhook path=${path} target=${describeWebhookTarget(effectiveWebhookUrl)}`,
      );
      await setWebhook(
        token,
        {
          url: effectiveWebhookUrl,
          secret_token: webhookSecret,
        },
        fetcher,
      );
      let webhookCleanupPromise;
      cleanupWebhook = async () => {
        if (!webhookCleanupPromise)
          webhookCleanupPromise = (async () => {
            runtime.log?.(`[${account.accountId}] Zalo stopping; deleting webhook`);
            try {
              await deleteWebhook(token, fetcher, WEBHOOK_CLEANUP_TIMEOUT_MS);
              runtime.log?.(`[${account.accountId}] Zalo webhook deleted`);
            } catch (err) {
              const detail =
                err instanceof Error && err.name === "AbortError"
                  ? `timed out after ${String(WEBHOOK_CLEANUP_TIMEOUT_MS)}ms`
                  : formatZaloError(err);
              runtime.error?.(`[${account.accountId}] Zalo webhook delete failed: ${detail}`);
            }
          })();
        await webhookCleanupPromise;
      };
      runtime.log?.(`[${account.accountId}] Zalo webhook registered path=${path}`);
      const unregister = registerZaloWebhookTarget(
        {
          token,
          account,
          config,
          runtime,
          core,
          path,
          webhookUrl: effectiveWebhookUrl,
          webhookPath: path,
          secret: webhookSecret,
          statusSink: (patch) => statusSink?.(patch),
          mediaMaxMb: effectiveMediaMaxMb,
          canHostMedia,
          fetcher,
        },
        {
          route: {
            auth: "plugin",
            match: "exact",
            pluginId: "zalo",
            source: "zalo-webhook",
            accountId: account.accountId,
            log: runtime.log,
            handler: async (req, res) => {
              if (!(await handleZaloWebhookRequest(req, res)) && !res.headersSent) {
                res.statusCode = 404;
                res.setHeader("Content-Type", "text/plain; charset=utf-8");
                res.end("Not Found");
              }
            },
          },
        },
      );
      stopHandlers.push(unregister);
      await waitForAbortSignal(abortSignal);
      return;
    }
    runtime.log?.(`[${account.accountId}] Zalo polling mode: clearing webhook before startup`);
    try {
      try {
        const currentWebhookUrl = normalizeWebhookUrl(
          (await getWebhookInfo(token, fetcher)).result?.url,
        );
        if (!currentWebhookUrl)
          runtime.log?.(`[${account.accountId}] Zalo polling mode ready (no webhook configured)`);
        else {
          runtime.log?.(
            `[${account.accountId}] Zalo polling mode disabling existing webhook ${describeWebhookTarget(currentWebhookUrl)}`,
          );
          await deleteWebhook(token, fetcher);
          runtime.log?.(`[${account.accountId}] Zalo polling mode ready (webhook disabled)`);
        }
      } catch (err) {
        if (err instanceof ZaloApiError && err.errorCode === 404)
          runtime.log?.(
            `[${account.accountId}] Zalo polling mode webhook inspection unavailable; continuing without webhook cleanup`,
          );
        else throw err;
      }
    } catch (err) {
      runtime.error?.(
        `[${account.accountId}] Zalo polling startup could not clear webhook: ${formatZaloError(err)}`,
      );
    }
    startPollingLoop({
      token,
      account,
      config,
      runtime,
      core,
      canHostMedia,
      webhookUrl: effectiveWebhookUrl,
      webhookPath: effectiveWebhookPath,
      abortSignal,
      isStopped: () => stopped,
      mediaMaxMb: effectiveMediaMaxMb,
      statusSink,
      fetcher,
    });
    await waitForAbortSignal(abortSignal);
  } catch (err) {
    runtime.error?.(
      `[${account.accountId}] Zalo provider startup failed mode=${mode}: ${formatZaloError(err)}`,
    );
    throw err;
  } finally {
    abortSignal.removeEventListener("abort", stopOnAbort);
    await cleanupWebhook?.();
    stop();
    runtime.log?.(`[${account.accountId}] Zalo provider stopped mode=${mode}`);
  }
}
//#endregion
export { monitorZaloProvider };
