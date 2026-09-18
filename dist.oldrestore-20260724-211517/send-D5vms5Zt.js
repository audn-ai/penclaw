import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import { v as resolveSessionAgentId } from "./agent-scope-y9xQv_q1.js";
import { r as resolveOutboundChannelPlugin } from "./channel-resolution-B-NyvoRP.js";
import { r as resolveMessageChannelSelection } from "./channel-selection-DB_q64I6.js";
import { t as resolveGatewayConversationReadOrigin } from "./conversation-read-origin-CcxTNkzD.js";
import { n as errorShape, t as ErrorCodes } from "./error-codes-O0AkRNx7.js";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.js";
import { r as getAgentScopedMediaLocalRoots } from "./local-roots-CgMgS9r2.js";
import "./operator-scopes-CpPJIv7P.js";
import "./message-channel-constants-CvbXi0yz.js";
import {
  l as resolveAttachmentMediaPolicy,
  r as hydrateAttachmentParamsForAction,
  t as dispatchChannelMessageAction,
} from "./message-action-dispatch-DVTMB9Nv.js";
import { i as normalizeMessageChannel } from "./message-channel-normalize-Be6uJOzO.js";
import "./plugins-BKdf-5tW.js";
import { t as createOutboundSendDeps } from "./outbound-send-deps-D4Ql4D3K.js";
import "./message-channel-NQc9DJ6B.js";
import "./sessions-CEG7v41b.js";
import {
  n as resolveOutboundSessionRoute,
  t as ensureOutboundSessionEntry,
} from "./outbound-session-D11Wm5tD.js";
import {
  s as projectOutboundPayloadPlanForMirror,
  t as createOutboundPayloadPlan,
} from "./payloads-BRNPux3W.js";
import { n as normalizePollInput } from "./polls-C-v11_tu.js";
import { t as getChannelPlugin } from "./registry-mc8oBRx8.js";
import { t as resolveGatewayPluginConfig } from "./runtime-plugin-config-mrPiwDuw.js";
import {
  b as selectApplicableRuntimeConfig,
  i as getRuntimeConfigSnapshot,
  s as getRuntimeConfigSourceSnapshot,
} from "./runtime-snapshot-BbbqRiDR.js";
import { t as sendDurableMessageBatch } from "./send-DJdWoC1F.js";
import { t as buildOutboundSessionContext } from "./session-context-CryOjB_1.js";
import {
  c as parseAgentSessionKey,
  f as parseThreadSessionSuffix,
  o as normalizeSessionKeyPreservingOpaquePeerIds,
} from "./session-key-utils-B8sNp9l4.js";
import { u as loadSessionEntry } from "./session-utils-DjTWBI0J.js";
import "./runtime-BM0DJgoF.js";
import {
  An as validatePollParams,
  Ht as validateMessageActionParams,
  In as validateSendParams,
} from "./src-CIJf1lT0.js";
import {
  Pt as resolveMissingAgentHarnessSessionError,
  Tt as isAgentHarnessSessionKey,
} from "./store-CzZJhTF6.js";
import {
  c as normalizeOptionalString,
  p as readStringValue,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
import { a as normalizeOptionalTrimmedStringList } from "./string-normalization-CRyoFBPt.js";
import { r as readTrimmedStringAlias } from "./string-readers-A0wspDGq.js";
import { a as maybeResolveIdLikeTarget } from "./target-resolver-BQojPYwH.js";
import { i as resolveOutboundTarget } from "./targets-CnpDCogZ.js";
import { t as extractToolPayload } from "./tool-payload-DV5VuWF_.js";
import { t as appendAssistantMessageToSessionTranscript } from "./transcript-kgNtplfz.js";
import "./deps-BDX9tA_j.js";
import { t as formatValidationErrors } from "./validation-errors-B9K6VbD7.js";
import { t as formatForLog } from "./ws-log-BlD6I7mP.js";
//#region src/infra/outbound/source-reply-mirror.ts
function readStringArray(value) {
  return normalizeOptionalTrimmedStringList(value);
}
function asRecord(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : void 0;
}
function readFirstString(params, keys) {
  return readTrimmedStringAlias(params, keys);
}
function resolveSourceReplyTarget(params) {
  return readFirstString(params, ["target", "to", "channelId", "chatId"]);
}
function resolveSourceReplyThreadId(params) {
  return readFirstString(params.actionParams, ["threadId", "messageThreadId"]);
}
function resolveDeliveredThreadPlacement(params, currentThreadId) {
  const payload = asRecord(params.deliveredPayload);
  const receipt = asRecord(asRecord(payload?.result)?.receipt) ?? asRecord(payload?.receipt);
  if (!receipt) return;
  const deliveredThreadId = normalizeOptionalString(receipt.threadId);
  return deliveredThreadId
    ? deliveredThreadId === currentThreadId
      ? "match"
      : "mismatch"
    : currentThreadId
      ? "mismatch"
      : "match";
}
function resolveSourceReplyThreadPlacement(params) {
  const currentThreadId = normalizeOptionalString(params.toolContext?.currentThreadTs);
  const deliveredPlacement = resolveDeliveredThreadPlacement(params, currentThreadId);
  if (deliveredPlacement) return deliveredPlacement;
  if (params.actionParams.topLevel === true) return currentThreadId ? "mismatch" : "match";
  for (const key of ["threadId", "messageThreadId"]) {
    if (!Object.hasOwn(params.actionParams, key)) continue;
    const explicitThreadId = normalizeOptionalString(params.actionParams[key]);
    if (!explicitThreadId) return currentThreadId ? "mismatch" : "match";
    return explicitThreadId === currentThreadId ? "match" : "mismatch";
  }
  return currentThreadId ? "unknown" : "match";
}
function resolveThreadedSourceTarget(params, requestedTarget) {
  const threadId = resolveSourceReplyThreadId(params);
  if (!threadId) return requestedTarget;
  return (
    normalizeOptionalString(
      getChannelPlugin(params.channel)?.threading?.resolveCurrentChannelId?.({
        to: requestedTarget,
        threadId,
      }),
    ) ?? requestedTarget
  );
}
function hasExplicitDeliveryFailure(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return false;
  const record = payload;
  if (record.ok === false) return true;
  const status = normalizeOptionalLowercaseString(record.status);
  if (status === "failed" || status === "error") return true;
  const deliveryStatus = normalizeOptionalLowercaseString(record.deliveryStatus);
  return deliveryStatus === "failed" || deliveryStatus === "error";
}
function isCurrentSourceConversation(params) {
  if (params.action !== "send") return false;
  if (!params.sessionKey?.trim()) return false;
  const toolContext = params.toolContext;
  if (!toolContext) return false;
  const currentChannel = normalizeOptionalLowercaseString(toolContext.currentChannelProvider);
  if (!currentChannel || currentChannel !== normalizeOptionalLowercaseString(params.channel))
    return false;
  const currentTargets = [
    normalizeOptionalString(toolContext.currentMessagingTarget),
    normalizeOptionalString(toolContext.currentChannelId),
  ].filter((target) => Boolean(target));
  if (currentTargets.length === 0) return false;
  const requestedTarget = resolveSourceReplyTarget(params.actionParams);
  if (!requestedTarget) return false;
  const threadPlacement = resolveSourceReplyThreadPlacement(params);
  if (threadPlacement === "mismatch") return false;
  const threadedTarget = resolveThreadedSourceTarget(params, requestedTarget);
  const matchesToolContextTarget = getChannelPlugin(params.channel)?.threading
    ?.matchesToolContextTarget;
  if (
    threadPlacement === "match" &&
    (matchesToolContextTarget?.({
      target: requestedTarget,
      toolContext,
    }) ||
      (threadedTarget !== requestedTarget &&
        matchesToolContextTarget?.({
          target: threadedTarget,
          toolContext,
        })))
  )
    return true;
  return currentTargets.some(
    (currentTarget) => requestedTarget === currentTarget || threadedTarget === currentTarget,
  );
}
/** Mirrors successful outbound source replies into the owning session transcript. */
async function mirrorDeliveredSourceReplyToTranscript(params) {
  if (hasExplicitDeliveryFailure(params.deliveredPayload)) return false;
  if (!isCurrentSourceConversation(params)) return false;
  const mirror = projectOutboundPayloadPlanForMirror(
    createOutboundPayloadPlan([
      {
        text: readFirstString(params.actionParams, ["message", "content", "text", "caption"]) ?? "",
        mediaUrl: readFirstString(params.actionParams, [
          "mediaUrl",
          "media",
          "path",
          "filePath",
          "fileUrl",
        ]),
        mediaUrls: readStringArray(params.actionParams.mediaUrls),
        presentation: params.actionParams.presentation,
        interactive: params.actionParams.interactive,
        channelData: params.actionParams.channelData,
      },
    ]),
  );
  if (!mirror.text && mirror.mediaUrls.length === 0) return false;
  await appendAssistantMessageToSessionTranscript({
    agentId: params.agentId,
    sessionKey: params.sessionKey,
    text: mirror.text,
    mediaUrls: mirror.mediaUrls.length ? mirror.mediaUrls : void 0,
    idempotencyKey: params.idempotencyKey,
    config: params.cfg,
  });
  return true;
}
//#endregion
//#region src/gateway/server-methods/send.ts
function resolveTrustedMessageActionToolContext(params) {
  const identity = params.client?.internal?.agentRuntimeIdentity;
  const messageActionContext = identity?.messageActionContext;
  if (!identity || !messageActionContext)
    return {
      ok: true,
      toolContext: void 0,
      requesterAccountId: void 0,
      requesterSenderId: void 0,
    };
  if (Date.now() >= messageActionContext.expiresAtMs)
    return {
      ok: false,
      error: errorShape(
        ErrorCodes.INVALID_REQUEST,
        "message.action agent runtime context has expired",
      ),
    };
  const requestSessionKey = normalizeSessionKeyPreservingOpaquePeerIds(params.request.sessionKey);
  const identitySessionKey = normalizeSessionKeyPreservingOpaquePeerIds(identity.sessionKey);
  const identityAgentId = normalizeAgentId(identity.agentId);
  const requestAgentId = normalizeOptionalString(params.request.agentId);
  const sessionAgentId = parseAgentSessionKey(requestSessionKey)?.agentId;
  const requestSessionId = normalizeOptionalString(params.request.sessionId);
  if (
    !requestSessionKey ||
    requestSessionKey !== identitySessionKey ||
    (requestAgentId && normalizeAgentId(requestAgentId) !== identityAgentId) ||
    (sessionAgentId && normalizeAgentId(sessionAgentId) !== identityAgentId) ||
    (messageActionContext.sessionId && requestSessionId !== messageActionContext.sessionId)
  )
    return {
      ok: false,
      error: errorShape(
        ErrorCodes.INVALID_REQUEST,
        "message.action agent runtime identity does not match the requested session",
      ),
    };
  return {
    ok: true,
    toolContext: messageActionContext.toolContext,
    requesterAccountId: messageActionContext.requesterAccountId,
    requesterSenderId: messageActionContext.requesterSenderId,
  };
}
const inflightByContext = /* @__PURE__ */ new WeakMap();
const getInflightMap = (context) => {
  let inflight = inflightByContext.get(context);
  if (!inflight) {
    inflight = /* @__PURE__ */ new Map();
    inflightByContext.set(context, inflight);
  }
  return inflight;
};
function resolveGatewayInflightMap(params) {
  const cached = params.context.dedupe.get(params.dedupeKey);
  if (cached)
    return {
      kind: "cached",
      cached,
    };
  const inflightMap = getInflightMap(params.context);
  const inflight = inflightMap.get(params.dedupeKey);
  if (inflight)
    return {
      kind: "inflight",
      inflight,
    };
  return {
    kind: "ready",
    inflightMap,
  };
}
function resolveGatewayInflightRequest(params) {
  const idem = params.idempotencyKey;
  const dedupeKey =
    params.prefix === "message.action"
      ? `${params.prefix}:${params.conversationReadOrigin ?? "delegated"}:${idem}`
      : `${params.prefix}:${idem}`;
  const inflight = resolveGatewayInflightMap({
    context: params.context,
    dedupeKey,
  });
  if (inflight.kind === "cached") {
    params.respond(inflight.cached.ok, inflight.cached.payload, inflight.cached.error, {
      cached: true,
    });
    return {
      kind: "handled",
      done: Promise.resolve(),
    };
  }
  if (inflight.kind === "inflight")
    return {
      kind: "handled",
      done: inflight.inflight.then((result) => {
        const meta = result.meta
          ? {
              ...result.meta,
              cached: true,
            }
          : { cached: true };
        params.respond(result.ok, result.payload, result.error, meta);
      }),
    };
  return {
    kind: "ready",
    idem,
    dedupeKey,
    inflightMap: inflight.inflightMap,
  };
}
async function runGatewayInflightWork(params) {
  params.inflightMap.set(params.dedupeKey, params.work);
  try {
    const result = await params.work;
    params.respond(result.ok, result.payload, result.error, result.meta);
  } finally {
    params.inflightMap.delete(params.dedupeKey);
  }
}
async function resolveRequestedChannel(params) {
  const channelInput = readStringValue(params.requestChannel);
  const normalizedChannel = channelInput ? normalizeMessageChannel(channelInput) : void 0;
  if (params.rejectWebchatAsInternalOnly && normalizedChannel === "webchat")
    return {
      error: errorShape(
        ErrorCodes.INVALID_REQUEST,
        "unsupported channel: webchat (internal-only). Use `chat.send` for WebChat UI messages or choose a deliverable channel.",
      ),
    };
  if (channelInput && !normalizedChannel)
    return {
      error: errorShape(ErrorCodes.INVALID_REQUEST, params.unsupportedMessage(channelInput)),
    };
  const sourceCfg = params.context.getRuntimeConfig();
  const cfg = resolveGatewayPluginConfig({ config: sourceCfg });
  let channel = normalizedChannel;
  if (!channel)
    try {
      channel = (await resolveMessageChannelSelection({ cfg })).channel;
    } catch (err) {
      return { error: errorShape(ErrorCodes.INVALID_REQUEST, String(err)) };
    }
  return {
    cfg,
    sourceCfg,
    channel,
  };
}
async function resolveInternalDeliveryChannel(requestChannel, context) {
  const resolvedChannel = await resolveRequestedChannel({
    requestChannel,
    unsupportedMessage: (input) => `unsupported channel: ${input}`,
    context,
    rejectWebchatAsInternalOnly: true,
  });
  if ("error" in resolvedChannel)
    return {
      kind: "failed",
      result: {
        ok: false,
        error: resolvedChannel.error,
      },
    };
  return {
    kind: "ready",
    ...resolvedChannel,
  };
}
function resolveGatewayOutboundTarget(params) {
  const resolved = resolveOutboundTarget({
    channel: params.channel,
    to: params.to,
    cfg: params.cfg,
    accountId: params.accountId,
    mode: "explicit",
  });
  if (!resolved.ok)
    return {
      ok: false,
      error: errorShape(ErrorCodes.INVALID_REQUEST, String(resolved.error)),
    };
  return {
    ok: true,
    to: resolved.to,
  };
}
function resolveMessageActionRuntimeConfig(params) {
  const runtimeConfig = getRuntimeConfigSnapshot();
  const runtimeSourceConfig = getRuntimeConfigSourceSnapshot();
  if (!runtimeConfig || !runtimeSourceConfig) return params.cfg;
  const selected = selectApplicableRuntimeConfig({
    inputConfig: params.sourceCfg,
    runtimeConfig,
    runtimeSourceConfig,
  });
  if (selected === runtimeConfig && selected !== params.cfg)
    return resolveGatewayPluginConfig({ config: selected });
  return params.cfg;
}
function buildGatewayDeliveryPayload(params) {
  const payload = {
    runId: params.runId,
    messageId: params.result.messageId,
    channel: params.channel,
  };
  if ("chatId" in params.result) payload.chatId = params.result.chatId;
  if ("channelId" in params.result) payload.channelId = params.result.channelId;
  if ("toJid" in params.result) payload.toJid = params.result.toJid;
  if ("conversationId" in params.result) payload.conversationId = params.result.conversationId;
  if ("pollId" in params.result) payload.pollId = params.result.pollId;
  return payload;
}
function cacheGatewayDedupeSuccess(params) {
  params.context.dedupe.set(params.dedupeKey, {
    ts: Date.now(),
    ok: true,
    payload: params.payload,
  });
}
function cacheGatewayDedupeFailure(params) {
  params.context.dedupe.set(params.dedupeKey, {
    ts: Date.now(),
    ok: false,
    error: params.error,
  });
}
function createGatewayInflightSuccess(params) {
  cacheGatewayDedupeSuccess({
    context: params.context,
    dedupeKey: params.dedupeKey,
    payload: params.payload,
  });
  return {
    ok: true,
    payload: params.payload,
    meta: { channel: params.channel },
  };
}
function createGatewayDeliveryInflightSuccess(params) {
  return createGatewayInflightSuccess({
    context: params.context,
    dedupeKey: params.dedupeKey,
    payload: buildGatewayDeliveryPayload({
      runId: params.runId,
      channel: params.channel,
      result: params.result,
    }),
    channel: params.channel,
  });
}
function createGatewayInflightUnavailableFailure(params) {
  const error = errorShape(ErrorCodes.UNAVAILABLE, String(params.err));
  cacheGatewayDedupeFailure({
    context: params.context,
    dedupeKey: params.dedupeKey,
    error,
  });
  return {
    ok: false,
    error,
    meta: {
      channel: params.channel,
      error: formatForLog(params.err),
    },
  };
}
async function mirrorDeliveredSourceReplyToTranscriptBestEffort(params) {
  try {
    await mirrorDeliveredSourceReplyToTranscript(params.mirror);
  } catch (err) {
    params.context.logGateway?.warn?.("Source reply transcript mirror failed after delivery.", {
      error: formatForLog(err),
      channel: params.mirror.channel,
      sessionKey: params.mirror.sessionKey,
    });
  }
}
const sourceReplyTranscriptMirrorQueue = new KeyedAsyncQueue();
function resolveSourceReplyTranscriptMirrorQueueKey(mirror) {
  return mirror.sessionKey?.trim() || "__global__";
}
function scheduleDeliveredSourceReplyTranscriptMirror(params) {
  const queueKey = resolveSourceReplyTranscriptMirrorQueueKey(params.mirror);
  return sourceReplyTranscriptMirrorQueue.enqueue(queueKey, () =>
    mirrorDeliveredSourceReplyToTranscriptBestEffort(params),
  );
}
const sendHandlers = {
  "message.action": async ({ params, respond, context, client }) => {
    const p = params;
    if (!validateMessageActionParams(p)) {
      respond(
        false,
        void 0,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          `invalid message.action params: ${formatValidationErrors(validateMessageActionParams.errors)}`,
        ),
      );
      return;
    }
    const request = p;
    const trustedContext = resolveTrustedMessageActionToolContext({
      client,
      request,
    });
    if (!trustedContext.ok) {
      respond(false, void 0, trustedContext.error);
      return;
    }
    const conversationReadOrigin = resolveGatewayConversationReadOrigin({
      client,
      requestedOrigin: request.conversationReadOrigin,
    });
    const inflight = resolveGatewayInflightRequest({
      context,
      prefix: "message.action",
      idempotencyKey: request.idempotencyKey,
      respond,
      conversationReadOrigin,
    });
    if (inflight.kind === "handled") {
      await inflight.done;
      return;
    }
    const { dedupeKey, inflightMap } = inflight;
    await runGatewayInflightWork({
      inflightMap,
      dedupeKey,
      work: (async () => {
        const resolvedChannel = await resolveRequestedChannel({
          requestChannel: request.channel,
          unsupportedMessage: (input) => `unsupported channel: ${input}`,
          context,
          rejectWebchatAsInternalOnly: true,
        });
        if ("error" in resolvedChannel)
          return {
            ok: false,
            error: resolvedChannel.error,
          };
        const { cfg: selectedCfg, sourceCfg, channel } = resolvedChannel;
        const cfg = resolveMessageActionRuntimeConfig({
          cfg: selectedCfg,
          sourceCfg,
        });
        if (
          !resolveOutboundChannelPlugin({
            channel,
            cfg,
          })?.actions?.handleAction
        )
          return {
            ok: false,
            error: errorShape(
              ErrorCodes.INVALID_REQUEST,
              `Channel ${channel} does not support action ${request.action}.`,
            ),
          };
        try {
          const sessionKey = normalizeOptionalString(request.sessionKey) ?? void 0;
          const agentId =
            normalizeOptionalString(request.agentId) ??
            (sessionKey
              ? resolveSessionAgentId({
                  sessionKey,
                  config: cfg,
                })
              : void 0);
          const accountId = normalizeOptionalString(request.accountId) ?? void 0;
          if (request.action === "send")
            await hydrateAttachmentParamsForAction({
              cfg,
              channel,
              accountId,
              args: request.params,
              action: "send",
              mediaPolicy: resolveAttachmentMediaPolicy({
                mediaLocalRoots: getAgentScopedMediaLocalRoots(cfg, agentId),
              }),
            });
          const gatewayClientScopes = client?.connect?.scopes ?? [];
          const handled = await dispatchChannelMessageAction({
            channel,
            action: request.action,
            cfg,
            params: request.params,
            accountId,
            requesterAccountId: trustedContext.requesterAccountId,
            requesterSenderId: trustedContext.requesterSenderId,
            senderIsOwner: gatewayClientScopes.includes("operator.admin")
              ? request.senderIsOwner === true
              : false,
            conversationReadOrigin,
            sessionKey,
            sessionId: normalizeOptionalString(request.sessionId) ?? void 0,
            inboundEventKind: request.inboundTurnKind,
            agentId,
            mediaLocalRoots: getAgentScopedMediaLocalRoots(cfg, agentId),
            toolContext: trustedContext.toolContext,
            dryRun: false,
            gatewayClientScopes,
          });
          if (!handled) {
            const error = errorShape(
              ErrorCodes.INVALID_REQUEST,
              `Message action ${request.action} not supported for channel ${channel}.`,
            );
            cacheGatewayDedupeFailure({
              context,
              dedupeKey,
              error,
            });
            return {
              ok: false,
              error,
              meta: { channel },
            };
          }
          const payload = extractToolPayload(handled);
          await scheduleDeliveredSourceReplyTranscriptMirror({
            context,
            mirror: {
              action: request.action,
              channel,
              actionParams: request.params,
              cfg,
              sessionKey,
              agentId,
              toolContext: trustedContext.toolContext,
              idempotencyKey: request.idempotencyKey,
              deliveredPayload: payload,
            },
          });
          return createGatewayInflightSuccess({
            context,
            dedupeKey,
            payload,
            channel,
          });
        } catch (err) {
          return createGatewayInflightUnavailableFailure({
            context,
            dedupeKey,
            channel,
            err,
          });
        }
      })(),
      respond,
    });
  },
  send: async ({ params, respond, context, client }) => {
    const p = params;
    if (!validateSendParams(p)) {
      respond(
        false,
        void 0,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          `invalid send params: ${formatValidationErrors(validateSendParams.errors)}`,
        ),
      );
      return;
    }
    const request = p;
    const inflight = resolveGatewayInflightRequest({
      context,
      prefix: "send",
      idempotencyKey: request.idempotencyKey,
      respond,
    });
    if (inflight.kind === "handled") {
      await inflight.done;
      return;
    }
    const { idem, dedupeKey, inflightMap } = inflight;
    const to = normalizeOptionalString(request.to) ?? "";
    const message = normalizeOptionalString(request.message) ?? "";
    const mediaUrl = normalizeOptionalString(request.mediaUrl);
    const mediaUrls = Array.isArray(request.mediaUrls)
      ? request.mediaUrls
          .map((entry) => normalizeOptionalString(entry))
          .filter((entry) => Boolean(entry))
      : void 0;
    const buffer = readStringValue(request.buffer);
    if (!message && !mediaUrl && (mediaUrls?.length ?? 0) === 0 && !buffer) {
      respond(
        false,
        void 0,
        errorShape(ErrorCodes.INVALID_REQUEST, "invalid send params: text or media is required"),
      );
      return;
    }
    const accountId = normalizeOptionalString(request.accountId);
    const replyToId = normalizeOptionalString(request.replyToId);
    const threadId = normalizeOptionalString(request.threadId);
    await runGatewayInflightWork({
      inflightMap,
      dedupeKey,
      work: (async () => {
        const resolvedChannel = await resolveInternalDeliveryChannel(request.channel, context);
        if (resolvedChannel.kind !== "ready") return resolvedChannel.result;
        const { cfg, channel } = resolvedChannel;
        const outboundChannel = channel;
        if (
          !resolveOutboundChannelPlugin({
            channel,
            cfg,
          })
        )
          return {
            ok: false,
            error: errorShape(ErrorCodes.INVALID_REQUEST, `unsupported channel: ${channel}`),
          };
        try {
          const resolvedTarget = resolveGatewayOutboundTarget({
            channel: outboundChannel,
            to,
            cfg,
            accountId,
          });
          if (!resolvedTarget.ok)
            return {
              ok: false,
              error: resolvedTarget.error,
              meta: { channel },
            };
          const idLikeTarget = await maybeResolveIdLikeTarget({
            cfg,
            channel,
            input: resolvedTarget.to,
            accountId,
          });
          const deliveryTarget = idLikeTarget?.to ?? resolvedTarget.to;
          const providedSessionKey =
            normalizeSessionKeyPreservingOpaquePeerIds(request.sessionKey) || void 0;
          const explicitAgentId = normalizeOptionalString(request.agentId);
          const sessionAgentId = providedSessionKey
            ? resolveSessionAgentId({
                sessionKey: providedSessionKey,
                config: cfg,
              })
            : void 0;
          const defaultAgentId = resolveSessionAgentId({ config: cfg });
          const effectiveAgentId = explicitAgentId ?? sessionAgentId ?? defaultAgentId;
          const sendArgs = {
            mediaUrl,
            mediaUrls,
            buffer,
            filename: normalizeOptionalString(request.filename) ?? void 0,
            contentType: normalizeOptionalString(request.contentType) ?? void 0,
          };
          await hydrateAttachmentParamsForAction({
            cfg,
            channel,
            accountId,
            args: sendArgs,
            action: "send",
            mediaPolicy: resolveAttachmentMediaPolicy({
              mediaLocalRoots: getAgentScopedMediaLocalRoots(cfg, effectiveAgentId),
            }),
          });
          const hydratedMediaUrl = normalizeOptionalString(sendArgs.mediaUrl);
          const hydratedMediaUrls = Array.isArray(sendArgs.mediaUrls)
            ? sendArgs.mediaUrls
                .map((entry) => normalizeOptionalString(entry))
                .filter((entry) => Boolean(entry))
            : void 0;
          const outboundDeps = context.deps ? createOutboundSendDeps(context.deps) : void 0;
          const outboundPayloads = [
            {
              text: message,
              mediaUrl: hydratedMediaUrl,
              mediaUrls: hydratedMediaUrls,
              ...(request.asVoice === true ? { audioAsVoice: true } : {}),
            },
          ];
          const mirrorProjection = projectOutboundPayloadPlanForMirror(
            createOutboundPayloadPlan(outboundPayloads),
          );
          const mirrorText = mirrorProjection.text;
          const mirrorMediaUrls = mirrorProjection.mediaUrls;
          const derivedRoute = await resolveOutboundSessionRoute({
            cfg,
            channel,
            agentId: effectiveAgentId,
            accountId,
            target: deliveryTarget,
            currentSessionKey: providedSessionKey,
            resolvedTarget: idLikeTarget,
            replyToId,
            threadId,
          });
          const providedSessionBaseKey =
            parseThreadSessionSuffix(providedSessionKey).baseSessionKey ?? providedSessionKey;
          const shouldUseDerivedThreadSessionKey =
            channel === "slack" &&
            Boolean(providedSessionKey) &&
            Boolean(normalizeOptionalString(derivedRoute?.threadId)) &&
            normalizeOptionalLowercaseString(derivedRoute?.baseSessionKey) ===
              normalizeOptionalLowercaseString(providedSessionBaseKey) &&
            normalizeOptionalLowercaseString(derivedRoute?.sessionKey) !== providedSessionKey;
          const outboundRoute = derivedRoute
            ? providedSessionKey
              ? shouldUseDerivedThreadSessionKey
                ? {
                    ...derivedRoute,
                    baseSessionKey: derivedRoute.baseSessionKey ?? providedSessionKey,
                  }
                : {
                    ...derivedRoute,
                    sessionKey: providedSessionKey,
                    baseSessionKey: providedSessionKey,
                  }
              : derivedRoute
            : null;
          const outboundSessionKey = outboundRoute?.sessionKey ?? providedSessionKey;
          if (outboundSessionKey && isAgentHarnessSessionKey(outboundSessionKey)) {
            const { canonicalKey, entry } = loadSessionEntry(outboundSessionKey);
            const missingHarnessSessionError = resolveMissingAgentHarnessSessionError(
              canonicalKey,
              entry,
            );
            if (missingHarnessSessionError)
              return {
                ok: false,
                error: errorShape(ErrorCodes.INVALID_REQUEST, missingHarnessSessionError),
                meta: { channel },
              };
          }
          if (outboundRoute)
            await ensureOutboundSessionEntry({
              cfg,
              channel,
              accountId,
              route: outboundRoute,
            });
          const outboundSession = buildOutboundSessionContext({
            cfg,
            agentId: effectiveAgentId,
            sessionKey: outboundSessionKey,
            conversationType: outboundRoute?.chatType,
          });
          const send = await sendDurableMessageBatch({
            cfg,
            channel: outboundChannel,
            to: deliveryTarget,
            accountId,
            payloads: outboundPayloads,
            replyToId: replyToId ?? null,
            session: outboundSession,
            gifPlayback: request.gifPlayback,
            forceDocument: request.forceDocument,
            threadId: outboundRoute?.threadId ?? threadId ?? null,
            deps: outboundDeps,
            gatewayClientScopes: client?.connect?.scopes ?? [],
            silent: request.silent,
            formatting: request.parseMode ? { parseMode: request.parseMode } : void 0,
            mirror: outboundSessionKey
              ? {
                  sessionKey: outboundSessionKey,
                  agentId: effectiveAgentId,
                  text: mirrorText || message,
                  mediaUrls: mirrorMediaUrls.length > 0 ? mirrorMediaUrls : void 0,
                  idempotencyKey: idem,
                }
              : void 0,
          });
          if (send.status === "failed" || send.status === "partial_failed") throw send.error;
          const result = (send.status === "sent" ? send.results : []).at(-1);
          if (!result) throw new Error("No delivery result");
          return createGatewayDeliveryInflightSuccess({
            context,
            dedupeKey,
            runId: idem,
            channel,
            result,
          });
        } catch (err) {
          return createGatewayInflightUnavailableFailure({
            context,
            dedupeKey,
            channel,
            err,
          });
        }
      })(),
      respond,
    });
  },
  poll: async ({ params, respond, context, client }) => {
    const p = params;
    if (!validatePollParams(p)) {
      respond(
        false,
        void 0,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          `invalid poll params: ${formatValidationErrors(validatePollParams.errors)}`,
        ),
      );
      return;
    }
    const request = p;
    const inflight = resolveGatewayInflightRequest({
      context,
      prefix: "poll",
      idempotencyKey: request.idempotencyKey,
      respond,
    });
    if (inflight.kind === "handled") {
      await inflight.done;
      return;
    }
    const { idem, dedupeKey, inflightMap } = inflight;
    await runGatewayInflightWork({
      inflightMap,
      dedupeKey,
      work: (async () => {
        const resolvedChannel = await resolveRequestedChannel({
          requestChannel: request.channel,
          unsupportedMessage: (input) => `unsupported poll channel: ${input}`,
          context,
        });
        if ("error" in resolvedChannel)
          return {
            ok: false,
            error: resolvedChannel.error,
          };
        const { cfg, channel } = resolvedChannel;
        const outbound = resolveOutboundChannelPlugin({
          channel,
          cfg,
        })?.outbound;
        if (
          typeof request.durationSeconds === "number" &&
          outbound?.supportsPollDurationSeconds !== true
        )
          return {
            ok: false,
            error: errorShape(
              ErrorCodes.INVALID_REQUEST,
              `durationSeconds is not supported for ${channel} polls`,
            ),
          };
        if (typeof request.isAnonymous === "boolean" && outbound?.supportsAnonymousPolls !== true)
          return {
            ok: false,
            error: errorShape(
              ErrorCodes.INVALID_REQUEST,
              `isAnonymous is not supported for ${channel} polls`,
            ),
          };
        const poll = {
          question: request.question,
          options: request.options,
          maxSelections: request.maxSelections,
          durationSeconds: request.durationSeconds,
          durationHours: request.durationHours,
        };
        const threadId = normalizeOptionalString(request.threadId);
        const accountId = normalizeOptionalString(request.accountId);
        try {
          if (!outbound?.sendPoll)
            return {
              ok: false,
              error: errorShape(ErrorCodes.INVALID_REQUEST, `unsupported poll channel: ${channel}`),
            };
          const resolvedTarget = resolveGatewayOutboundTarget({
            channel,
            to: request.to.trim(),
            cfg,
            accountId,
          });
          if (!resolvedTarget.ok)
            return {
              ok: false,
              error: resolvedTarget.error,
            };
          const normalized = outbound.pollMaxOptions
            ? normalizePollInput(poll, { maxOptions: outbound.pollMaxOptions })
            : normalizePollInput(poll);
          const result = await outbound.sendPoll({
            cfg,
            to: resolvedTarget.to,
            poll: normalized,
            accountId,
            threadId,
            silent: request.silent,
            isAnonymous: request.isAnonymous,
            gatewayClientScopes: client?.connect?.scopes ?? [],
          });
          const payload = buildGatewayDeliveryPayload({
            runId: idem,
            channel,
            result,
          });
          cacheGatewayDedupeSuccess({
            context,
            dedupeKey,
            payload,
          });
          return {
            ok: true,
            payload,
            meta: { channel },
          };
        } catch (err) {
          const error = errorShape(ErrorCodes.UNAVAILABLE, String(err));
          cacheGatewayDedupeFailure({
            context,
            dedupeKey,
            error,
          });
          return {
            ok: false,
            error,
            meta: {
              channel,
              error: formatForLog(err),
            },
          };
        }
      })(),
      respond,
    });
  },
};
//#endregion
export { sendHandlers };
