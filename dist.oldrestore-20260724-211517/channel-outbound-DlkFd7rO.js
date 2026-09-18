import { n as normalizeAccountId } from "./account-id-C7N4Rwku.js";
import { t as resolveAccountEntry } from "./account-lookup-DgErwy8P.js";
import "./payloads-BRNPux3W.js";
import { c as resolveTextChunkLimit } from "./chunk-DtO_2oor.js";
import "./session-context-CryOjB_1.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-B-Fc-m0I.js";
import { t as createMessageReceiptFromOutboundResults } from "./receipt-C0uxiauk.js";
import { N as resolveChannelStreamingPreviewChunk } from "./streaming-D_YE0SPS.js";
import {
  i as livePreviewFinalizerCapabilities,
  n as channelMessageReceiveAckPolicies,
  r as durableFinalDeliveryCapabilities,
  t as channelMessageLiveCapabilities,
} from "./types-GcWljJIT.js";
import "./sanitize-text-BCxyPW9Z.js";
import "./identity-SEW64WfD.js";
import "./reply-pipeline-uYpC1TSz.js";
import "./progress-draft-compositor-DC3-BWzZ.js";
import "./draft-stream-controls-CaxJNqVC.js";
//#region src/channels/message/adapter.ts
const defaultManualReceiveAdapter$1 = {
  defaultAckPolicy: "manual",
  supportedAckPolicies: ["manual"],
};
/** Defines a message adapter while defaulting receive acknowledgement to manual. */
function defineChannelMessageAdapter(adapter) {
  return {
    ...adapter,
    receive: adapter.receive ?? defaultManualReceiveAdapter$1,
  };
}
//#endregion
//#region src/channels/message/outbound-bridge.ts
/**
 * Legacy outbound bridge adapter.
 *
 * Wraps old channel send functions in the newer channel message adapter contract.
 */
const defaultManualReceiveAdapter = {
  defaultAckPolicy: "manual",
  supportedAckPolicies: ["manual"],
};
function resolveResultMessageId(result) {
  return (
    result.messageId ??
    result.receipt?.primaryPlatformMessageId ??
    result.receipt?.platformMessageIds[0] ??
    result.chatId ??
    result.channelId ??
    result.roomId ??
    result.conversationId ??
    result.toJid ??
    result.pollId
  );
}
function toMessageSendResult(result, params) {
  const receipt = result.receipt
    ? params.normalizeReceiptKind
      ? {
          ...result.receipt,
          parts: result.receipt.parts.map((part) => ({
            ...part,
            kind: params.kind,
          })),
        }
      : result.receipt
    : createMessageReceiptFromOutboundResults({
        results: [result],
        kind: params.kind,
        threadId: params.threadId == null ? void 0 : String(params.threadId),
        replyToId: params.replyToId ?? void 0,
      });
  return {
    receipt,
    ...(resolveResultMessageId({
      ...result,
      receipt,
    })
      ? {
          messageId: resolveResultMessageId({
            ...result,
            receipt,
          }),
        }
      : {}),
  };
}
function adaptOutboundBridgeContext(ctx, resultParams) {
  const { onDeliveryResult, ...outboundCtx } = ctx;
  return {
    ...outboundCtx,
    ...(onDeliveryResult
      ? {
          onDeliveryResult: async (result) => {
            await onDeliveryResult(toMessageSendResult(result, resultParams));
          },
        }
      : {}),
  };
}
function hasRenderedPresentationBlocks(channelData) {
  return Object.values(channelData ?? {}).some((value) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) return false;
    const blocks = value.presentationBlocks;
    return Array.isArray(blocks) && blocks.length > 0;
  });
}
function resolvePayloadReceiptKind(ctx) {
  if (
    ctx.payload.audioAsVoice &&
    (ctx.mediaUrl || ctx.payload.mediaUrl || ctx.payload.mediaUrls?.length)
  )
    return "voice";
  if (ctx.mediaUrl || ctx.payload.mediaUrl || ctx.payload.mediaUrls?.length) return "media";
  if (
    Boolean(ctx.payload.presentation?.title || ctx.payload.presentation?.blocks?.length) ||
    hasRenderedPresentationBlocks(ctx.payload.channelData)
  )
    return "card";
  if (ctx.payload.interactive) return "card";
  if (ctx.payload.location) return "card";
  if (ctx.payload.text?.trim() || ctx.text.trim()) return "text";
  return "unknown";
}
/** Converts legacy outbound send methods into a typed channel message adapter. */
function createChannelMessageAdapterFromOutbound(params) {
  const send = {};
  if (params.outbound.sendText)
    send.text = async (ctx) => {
      const resultParams = {
        kind: "text",
        threadId: ctx.threadId,
        replyToId: ctx.replyToId,
      };
      return toMessageSendResult(
        await params.outbound.sendText(adaptOutboundBridgeContext(ctx, resultParams)),
        resultParams,
      );
    };
  if (params.outbound.sendMedia)
    send.media = async (ctx) => {
      const resultParams = {
        kind: ctx.audioAsVoice ? "voice" : "media",
        threadId: ctx.threadId,
        replyToId: ctx.replyToId,
      };
      return toMessageSendResult(
        await params.outbound.sendMedia(adaptOutboundBridgeContext(ctx, resultParams)),
        resultParams,
      );
    };
  if (params.outbound.sendPayload)
    send.payload = async (ctx) => {
      const resultParams = {
        kind: resolvePayloadReceiptKind(ctx),
        threadId: ctx.threadId,
        replyToId: ctx.replyToId,
      };
      return toMessageSendResult(
        await params.outbound.sendPayload(adaptOutboundBridgeContext(ctx, resultParams)),
        resultParams,
      );
    };
  if (params.outbound.sendPoll)
    send.poll = async (ctx) => {
      const resultParams = {
        kind: "poll",
        normalizeReceiptKind: true,
        threadId: ctx.threadId,
        replyToId: ctx.replyToId,
      };
      return toMessageSendResult(
        await params.outbound.sendPoll(adaptOutboundBridgeContext(ctx, resultParams)),
        resultParams,
      );
    };
  return {
    ...(params.id ? { id: params.id } : {}),
    durableFinal: {
      capabilities: params.capabilities ?? params.outbound.deliveryCapabilities?.durableFinal,
    },
    send,
    ...(params.live ? { live: params.live } : {}),
    receive: params.receive ?? defaultManualReceiveAdapter,
  };
}
//#endregion
//#region src/channels/message/durable-receive.ts
function normalizeDurableInboundReceiveId(id) {
  const normalized = id.trim();
  if (!normalized) throw new Error("Durable inbound receive id cannot be empty");
  return normalized;
}
function sortPendingRecords(records) {
  return records.toSorted((a, b) => a.receivedAt - b.receivedAt || a.id.localeCompare(b.id));
}
/** Creates a store-backed journal for accepting, completing, and retrying inbound events. */
function createDurableInboundReceiveJournal(options) {
  const now = options.now ?? Date.now;
  const accept = async (id, payload, acceptOptions) => {
    const key = normalizeDurableInboundReceiveId(id);
    const completed = await options.completedStore.lookup(key);
    if (completed)
      return {
        kind: "completed",
        duplicate: true,
        record: completed,
      };
    const receivedAt = acceptOptions?.receivedAt ?? now();
    const record = {
      id: key,
      payload,
      receivedAt,
      updatedAt: receivedAt,
      attempts: 0,
    };
    if (acceptOptions?.metadata !== void 0) record.metadata = acceptOptions.metadata;
    const acceptInsertedRecord = async () => {
      const completedAfterInsertRace = await options.completedStore.lookup(key);
      if (completedAfterInsertRace) {
        await options.pendingStore.delete(key);
        return {
          kind: "completed",
          duplicate: true,
          record: completedAfterInsertRace,
        };
      }
      return {
        kind: "accepted",
        duplicate: false,
        record,
      };
    };
    if (await options.pendingStore.registerIfAbsent(key, record, { ttlMs: options.pendingTtlMs }))
      return acceptInsertedRecord();
    const pending = await options.pendingStore.lookup(key);
    if (pending)
      return {
        kind: "pending",
        duplicate: true,
        record: pending,
      };
    const completedAfterPendingRace = await options.completedStore.lookup(key);
    if (completedAfterPendingRace)
      return {
        kind: "completed",
        duplicate: true,
        record: completedAfterPendingRace,
      };
    if (await options.pendingStore.registerIfAbsent(key, record, { ttlMs: options.pendingTtlMs }))
      return acceptInsertedRecord();
    return {
      kind: "pending",
      duplicate: true,
      record: (await options.pendingStore.lookup(key)) ?? record,
    };
  };
  const pending = async () => {
    const entries = await options.pendingStore.entries();
    const records = [];
    for (const entry of entries) {
      if (await options.completedStore.lookup(entry.key)) {
        await options.pendingStore.delete(entry.key);
        continue;
      }
      records.push(entry.value);
    }
    return sortPendingRecords(records);
  };
  const complete = async (id, completeOptions) => {
    const key = normalizeDurableInboundReceiveId(id);
    const record = {
      id: key,
      completedAt: completeOptions?.completedAt ?? now(),
    };
    if (completeOptions?.metadata !== void 0) record.metadata = completeOptions.metadata;
    await options.completedStore.register(key, record, { ttlMs: options.completedTtlMs });
    await options.pendingStore.delete(key);
  };
  const release = async (id, releaseOptions) => {
    const key = normalizeDurableInboundReceiveId(id);
    const record = await options.pendingStore.lookup(key);
    if (!record) return false;
    const releasedAt = releaseOptions?.releasedAt ?? now();
    const updated = {
      ...record,
      updatedAt: releasedAt,
      attempts: record.attempts + 1,
      lastAttemptAt: releasedAt,
    };
    if (releaseOptions?.lastError !== void 0) updated.lastError = releaseOptions.lastError;
    await options.pendingStore.register(key, updated, { ttlMs: options.pendingTtlMs });
    return true;
  };
  return {
    accept,
    pending,
    complete,
    release,
    deletePending: (id) => options.pendingStore.delete(normalizeDurableInboundReceiveId(id)),
  };
}
/** Adapts the shared channel ingress queue to the durable receive journal API. */
function createDurableInboundReceiveJournalFromQueue(options) {
  const prune = async (protectId) => {
    if (options.retention)
      await options.queue.prune({
        ...options.retention,
        ...(protectId === void 0 ? {} : { protectIds: [protectId] }),
      });
  };
  return {
    accept: async (id, payload, acceptOptions) => {
      await prune();
      const result = await options.queue.enqueue(normalizeDurableInboundReceiveId(id), payload, {
        ...(acceptOptions?.metadata === void 0 ? {} : { metadata: acceptOptions.metadata }),
        ...(acceptOptions?.receivedAt === void 0 ? {} : { receivedAt: acceptOptions.receivedAt }),
      });
      await prune(normalizeDurableInboundReceiveId(id));
      if (result.kind === "accepted")
        return {
          kind: "accepted",
          duplicate: false,
          record: result.record,
        };
      if (result.kind === "completed")
        return {
          kind: "completed",
          duplicate: true,
          record: result.record,
        };
      if (result.kind === "pending" || result.kind === "claimed")
        return {
          kind: "pending",
          duplicate: true,
          record: result.record,
        };
      return {
        kind: "pending",
        duplicate: true,
        record: {
          id: result.record.id,
          payload,
          receivedAt: result.record.failedAt,
          updatedAt: result.record.failedAt,
          attempts: 0,
        },
      };
    },
    pending: async () => {
      await prune();
      return await options.queue.listPending({ limit: "all" });
    },
    complete: async (id, completeOptions) => {
      await options.queue.complete(normalizeDurableInboundReceiveId(id), {
        ...(completeOptions?.metadata === void 0 ? {} : { metadata: completeOptions.metadata }),
        ...(completeOptions?.completedAt === void 0
          ? {}
          : { completedAt: completeOptions.completedAt }),
      });
      await prune(normalizeDurableInboundReceiveId(id));
    },
    release: async (id, releaseOptions) => {
      const released = await options.queue.release(normalizeDurableInboundReceiveId(id), {
        ...(releaseOptions?.lastError === void 0 ? {} : { lastError: releaseOptions.lastError }),
        ...(releaseOptions?.releasedAt === void 0 ? {} : { releasedAt: releaseOptions.releasedAt }),
      });
      await prune(normalizeDurableInboundReceiveId(id));
      return released;
    },
    deletePending: async (id) => {
      const deleted = await options.queue.delete(normalizeDurableInboundReceiveId(id));
      await prune();
      return deleted;
    },
  };
}
//#endregion
//#region src/channels/message/contracts.ts
/**
 * Lists declared durable-final delivery capabilities in stable contract order.
 */
function listDeclaredDurableFinalCapabilities(capabilities) {
  return durableFinalDeliveryCapabilities.filter(
    (capability) => capabilities?.[capability] === true,
  );
}
/**
 * Lists declared live-preview finalizer capabilities in stable contract order.
 */
function listDeclaredLivePreviewFinalizerCapabilities(capabilities) {
  return livePreviewFinalizerCapabilities.filter(
    (capability) => capabilities?.[capability] === true,
  );
}
/**
 * Lists declared live message capabilities in stable contract order.
 */
function listDeclaredChannelMessageLiveCapabilities(capabilities) {
  return channelMessageLiveCapabilities.filter((capability) => capabilities?.[capability] === true);
}
/**
 * Lists declared receive acknowledgement policies, including the default policy fallback.
 */
function listDeclaredReceiveAckPolicies(receive) {
  const declared = receive?.supportedAckPolicies?.length
    ? receive.supportedAckPolicies
    : receive?.defaultAckPolicy
      ? [receive.defaultAckPolicy]
      : [];
  return channelMessageReceiveAckPolicies.filter((policy) => declared.includes(policy));
}
/**
 * Verifies proof callbacks for every declared durable-final delivery capability.
 */
async function verifyDurableFinalCapabilityProofs(params) {
  const results = [];
  for (const capability of durableFinalDeliveryCapabilities) {
    if (params.capabilities?.[capability] !== true) {
      results.push({
        capability,
        status: "not_declared",
      });
      continue;
    }
    const proof = params.proofs[capability];
    if (!proof)
      throw new Error(
        `${params.adapterName} declares durable final capability "${capability}" without a contract proof`,
      );
    await proof();
    results.push({
      capability,
      status: "verified",
    });
  }
  return results;
}
/**
 * Verifies proof callbacks for every declared live-preview finalizer capability.
 */
async function verifyLivePreviewFinalizerCapabilityProofs(params) {
  const results = [];
  for (const capability of livePreviewFinalizerCapabilities) {
    if (params.capabilities?.[capability] !== true) {
      results.push({
        capability,
        status: "not_declared",
      });
      continue;
    }
    const proof = params.proofs[capability];
    if (!proof)
      throw new Error(
        `${params.adapterName} declares live preview finalizer capability "${capability}" without a contract proof`,
      );
    await proof();
    results.push({
      capability,
      status: "verified",
    });
  }
  return results;
}
/**
 * Verifies proof callbacks for every declared live message capability.
 */
async function verifyChannelMessageLiveCapabilityProofs(params) {
  const results = [];
  for (const capability of channelMessageLiveCapabilities) {
    if (params.capabilities?.[capability] !== true) {
      results.push({
        capability,
        status: "not_declared",
      });
      continue;
    }
    const proof = params.proofs[capability];
    if (!proof)
      throw new Error(
        `${params.adapterName} declares live capability "${capability}" without a contract proof`,
      );
    await proof();
    results.push({
      capability,
      status: "verified",
    });
  }
  return results;
}
/**
 * Verifies proof callbacks for every declared receive acknowledgement policy.
 */
async function verifyChannelMessageReceiveAckPolicyProofs(params) {
  const declared = new Set(listDeclaredReceiveAckPolicies(params.receive));
  const results = [];
  for (const policy of channelMessageReceiveAckPolicies) {
    if (!declared.has(policy)) {
      results.push({
        policy,
        status: "not_declared",
      });
      continue;
    }
    const proof = params.proofs[policy];
    if (!proof)
      throw new Error(
        `${params.adapterName} declares receive ack policy "${policy}" without a contract proof`,
      );
    await proof();
    results.push({
      policy,
      status: "verified",
    });
  }
  return results;
}
/**
 * Verifies durable-final proofs from a channel message adapter declaration.
 */
async function verifyChannelMessageAdapterCapabilityProofs(params) {
  return await verifyDurableFinalCapabilityProofs({
    adapterName: params.adapterName,
    capabilities: params.adapter.durableFinal?.capabilities,
    proofs: params.proofs,
  });
}
/**
 * Verifies receive acknowledgement proofs from a channel message adapter declaration.
 */
async function verifyChannelMessageReceiveAckPolicyAdapterProofs(params) {
  return await verifyChannelMessageReceiveAckPolicyProofs({
    adapterName: params.adapterName,
    receive: params.adapter.receive,
    proofs: params.proofs,
  });
}
/**
 * Verifies live-preview finalizer proofs from a channel message adapter declaration.
 */
async function verifyChannelMessageLiveFinalizerProofs(params) {
  return await verifyLivePreviewFinalizerCapabilityProofs({
    adapterName: params.adapterName,
    capabilities: params.adapter.live?.finalizer?.capabilities,
    proofs: params.proofs,
  });
}
/**
 * Verifies live message capability proofs from a channel message adapter declaration.
 */
async function verifyChannelMessageLiveCapabilityAdapterProofs(params) {
  return await verifyChannelMessageLiveCapabilityProofs({
    adapterName: params.adapterName,
    capabilities: params.adapter.live?.capabilities,
    proofs: params.proofs,
  });
}
//#endregion
//#region src/channels/message/receive.ts
const neverAbortedSignal = new AbortController().signal;
/** Returns whether an ack policy should acknowledge at the supplied processing stage. */
function shouldAckMessageAfterStage(policy, stage) {
  switch (policy) {
    case "after_receive_record":
      return stage === "receive_record";
    case "after_agent_dispatch":
      return stage === "agent_dispatch";
    case "after_durable_send":
      return stage === "durable_send";
    case "manual":
      return false;
  }
  return false;
}
function normalizeAckErrorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}
/** Creates a receive context with idempotent ack and explicit nack state transitions. */
function createMessageReceiveContext(params) {
  let nackInFlight;
  const ctx = {
    id: params.id,
    channel: params.channel,
    ...(params.accountId ? { accountId: params.accountId } : {}),
    message: params.message,
    ackPolicy: params.ackPolicy ?? "after_receive_record",
    ackState: "pending",
    receivedAt: params.receivedAt ?? Date.now(),
    signal: params.signal ?? neverAbortedSignal,
    shouldAckAfter: (stage) => shouldAckMessageAfterStage(ctx.ackPolicy, stage),
    ack: async () => {
      if (ctx.ackState === "acked") return;
      await params.onAck?.();
      ctx.ackState = "acked";
      ctx.ackedAt = Date.now();
      delete ctx.nackErrorMessage;
    },
    nack: async (error) => {
      if (ctx.ackState === "nacked") return;
      if (nackInFlight) {
        await nackInFlight;
        return;
      }
      nackInFlight = (async () => {
        await params.onNack?.(error);
        ctx.ackState = "nacked";
        ctx.nackErrorMessage = normalizeAckErrorMessage(error);
      })();
      try {
        await nackInFlight;
      } finally {
        nackInFlight = void 0;
      }
    },
  };
  return ctx;
}
//#endregion
//#region src/channels/message/state.ts
/** Creates a durable message recovery record from intent, receipt, and optional error state. */
function createDurableMessageStateRecord(params) {
  return {
    intent: params.intent,
    state: params.state ?? (params.receipt ? "sent" : "pending"),
    ...(params.receipt ? { receipt: params.receipt } : {}),
    updatedAt: params.updatedAt ?? Date.now(),
    ...(params.error === void 0 ? {} : { errorMessage: normalizeErrorMessage(params.error) }),
  };
}
/** Classifies recovery state from persisted intent/receipt facts after a send interruption. */
function classifyDurableSendRecoveryState(params) {
  if (params.failed) return "failed";
  if (params.suppressed) return "suppressed";
  if (params.hasReceipt) return "sent";
  if (params.hasIntent && params.platformSendMayHaveStarted) return "unknown_after_send";
  return "pending";
}
function normalizeErrorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}
//#endregion
//#region src/channels/draft-streaming-chunking.ts
const DEFAULT_DRAFT_STREAM_MIN = 200;
const DEFAULT_DRAFT_STREAM_MAX = 800;
function resolveChannelDraftStreamingChunking(cfg, channelId, accountId, opts) {
  const textLimit = resolveTextChunkLimit(cfg, channelId, accountId, {
    fallbackLimit: opts.fallbackLimit,
  });
  const normalizedAccountId = normalizeAccountId(accountId);
  const channelCfg = cfg?.channels?.[channelId];
  const draftCfg =
    resolveChannelStreamingPreviewChunk(
      resolveAccountEntry(channelCfg?.accounts, normalizedAccountId),
    ) ?? resolveChannelStreamingPreviewChunk(channelCfg);
  const maxRequested = Math.max(1, Math.floor(draftCfg?.maxChars ?? DEFAULT_DRAFT_STREAM_MAX));
  const maxChars = Math.max(1, Math.min(maxRequested, textLimit));
  const minRequested = Math.max(1, Math.floor(draftCfg?.minChars ?? DEFAULT_DRAFT_STREAM_MIN));
  return {
    minChars: Math.min(minRequested, maxChars),
    maxChars,
    breakPreference:
      draftCfg?.breakPreference === "newline" || draftCfg?.breakPreference === "sentence"
        ? draftCfg.breakPreference
        : "paragraph",
  };
}
//#endregion
//#region src/plugin-sdk/channel-outbound.ts
const loadChannelMessageRuntimeModule = createLazyRuntimeModule(
  () => import("./runtime-C_ecTY_D.js"),
);
/** Lazily forwards inbound reply delivery through the channel turn kernel. */
const deliverInboundReplyWithMessageSendContext = async (...args) => {
  return await (
    await import("./kernel-DDgSdlTU.js")
  ).deliverInboundReplyWithMessageSendContext(...args);
};
/** Sends a durable message batch without eager-loading channel message runtime internals. */
async function sendDurableMessageBatch(params) {
  return await (await loadChannelMessageRuntimeModule()).sendDurableMessageBatch(params);
}
/** Runs work inside a durable message send context loaded through the SDK lazy boundary. */
async function withDurableMessageSendContext(params, run) {
  return await (await loadChannelMessageRuntimeModule()).withDurableMessageSendContext(params, run);
}
//#endregion
export {
  createChannelMessageAdapterFromOutbound as C,
  createDurableInboundReceiveJournalFromQueue as S,
  verifyChannelMessageReceiveAckPolicyAdapterProofs as _,
  classifyDurableSendRecoveryState as a,
  verifyLivePreviewFinalizerCapabilityProofs as b,
  shouldAckMessageAfterStage as c,
  listDeclaredLivePreviewFinalizerCapabilities as d,
  listDeclaredReceiveAckPolicies as f,
  verifyChannelMessageLiveFinalizerProofs as g,
  verifyChannelMessageLiveCapabilityProofs as h,
  resolveChannelDraftStreamingChunking as i,
  listDeclaredChannelMessageLiveCapabilities as l,
  verifyChannelMessageLiveCapabilityAdapterProofs as m,
  sendDurableMessageBatch as n,
  createDurableMessageStateRecord as o,
  verifyChannelMessageAdapterCapabilityProofs as p,
  withDurableMessageSendContext as r,
  createMessageReceiveContext as s,
  deliverInboundReplyWithMessageSendContext as t,
  listDeclaredDurableFinalCapabilities as u,
  verifyChannelMessageReceiveAckPolicyProofs as v,
  defineChannelMessageAdapter as w,
  createDurableInboundReceiveJournal as x,
  verifyDurableFinalCapabilityProofs as y,
};
