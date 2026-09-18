import {
  i as shouldAckReaction,
  n as removeAckReactionAfterReply,
  r as removeAckReactionHandleAfterReply,
  t as createAckReactionHandle,
} from "./ack-reactions-CSknIPuI.js";
import {
  n as recordChannelActivity,
  t as getChannelActivity,
} from "./channel-activity-4piA219h.js";
import {
  a as chunkText,
  c as resolveTextChunkLimit,
  i as chunkMarkdownTextWithMode,
  o as chunkTextWithMode,
  r as chunkMarkdownText,
  s as resolveChunkMode,
  t as chunkByNewline,
} from "./chunk-DtO_2oor.js";
import {
  i as shouldComputeCommandAuthorized,
  r as isControlCommandMessage,
  t as hasControlCommand,
} from "./command-detection-DtT_SU8u.js";
import "./logging-C8NGWOYr.js";
import { t as resolveCommandAuthorizedFromAuthorizers } from "./command-gating-65fgTdwb.js";
import { n as shouldHandleTextCommands } from "./commands-text-routing-iDHdTNyq.js";
import "./sessions-CEG7v41b.js";
import { t as buildChannelInboundEventContext } from "./context-DMJN91Z-.js";
import {
  n as setChannelConversationBindingMaxAgeBySessionKey,
  t as setChannelConversationBindingIdleTimeoutBySessionKey,
} from "./conversation-bindings-fpRBUH0E.js";
import {
  a as settleReplyDispatcher,
  i as dispatchReplyFromConfig,
  o as withReplyDispatcher,
} from "./dispatch-BG0SdZGw.js";
import { n as resolveSessionEntryResetFreshness } from "./entry-freshness-DUBhQwKp.js";
import {
  a as resolveEnvelopeFormatOptions,
  r as formatInboundEnvelope,
  t as formatAgentEnvelope,
} from "./envelope-W2SlFUX-.js";
import {
  a as saveRemoteMedia,
  i as readRemoteMediaBuffer,
  o as saveResponseMedia,
  r as fetchRemoteMedia,
} from "./fetch-BZzOpPxp.js";
import {
  n as resolveChannelGroupRequireMention,
  t as resolveChannelGroupPolicy,
} from "./group-policy-7QrY--DR.js";
import {
  i as resolveHumanDelayConfig,
  r as resolveEffectiveMessagesConfig,
} from "./identity-CceraXdn.js";
import { t as finalizeInboundContext } from "./inbound-context-DpKaYErg.js";
import {
  n as resolveInboundDebounceMs,
  t as createInboundDebouncer,
} from "./inbound-debounce-B16kSCvW.js";
import {
  a as runPreparedInboundReply,
  i as runChannelInboundEvent,
  n as dispatchChannelInboundReply,
} from "./kernel-BhdvbEs2.js";
import { t as loadChannelOutboundAdapter } from "./load-1q60D_pJ.js";
import "./commands-registry-CqMJIODs.js";
import { t as resolveMarkdownTableMode } from "./markdown-tables-pi6oiKnf.js";
import {
  n as resolveInboundMentionDecision,
  t as implicitMentionKindWhen,
} from "./mention-gating-3P8aSD7o.js";
import {
  i as matchesMentionWithExplicit,
  n as buildMentionRegexes,
  r as matchesMentionPatterns,
} from "./mentions-BFTjjd4G.js";
import { t as buildPairingReply } from "./pairing-messages-DwLSgJ3x.js";
import {
  c as upsertChannelPairingRequest,
  i as readChannelAllowFromStore,
} from "./pairing-store-C4j5pnVS.js";
import { l as resolveStorePath } from "./paths-TfuVT-K8.js";
import { t as dispatchReplyWithBufferedBlockDispatcher } from "./provider-dispatcher-Cxi0TUNw.js";
import { a as createReplyDispatcherWithTyping } from "./reply-dispatcher-BdFXrJUS.js";
import { i as resolveAgentRoute, t as buildAgentSessionKey } from "./resolve-route-oiOq6bK9.js";
import {
  B as recordInboundSessionMeta,
  R as readSessionUpdatedAt,
  ot as updateSessionLastRoute,
} from "./session-accessor-PZVNxFCV.js";
import { t as recordInboundSession } from "./session-Fo42_iaz.js";
import { u as saveMediaBuffer } from "./store-BfbXoJVN.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
import { t as convertMarkdownTables } from "./tables-YoFSvuf8.js";
//#region src/plugins/runtime/channel-runtime-contexts.ts
const log = createSubsystemLogger("plugins/runtime-channel");
function normalizeRuntimeContextString(value) {
  return normalizeOptionalString(value) ?? "";
}
function normalizeRuntimeContextKey(params) {
  const channelId = normalizeRuntimeContextString(params.channelId);
  const capability = normalizeRuntimeContextString(params.capability);
  const accountId = normalizeRuntimeContextString(params.accountId);
  if (!channelId || !capability) return null;
  return {
    mapKey: `${channelId}\u0000${accountId}\u0000${capability}`,
    normalizedKey: {
      channelId,
      capability,
      ...(accountId ? { accountId } : {}),
    },
  };
}
function doesRuntimeContextWatcherMatch(params) {
  if (params.watcher.channelId && params.watcher.channelId !== params.event.key.channelId)
    return false;
  if (
    params.watcher.accountId !== void 0 &&
    params.watcher.accountId !== (params.event.key.accountId ?? "")
  )
    return false;
  if (params.watcher.capability && params.watcher.capability !== params.event.key.capability)
    return false;
  return true;
}
/** Creates the in-memory channel runtime context registry used by plugin runtime surfaces. */
function createChannelRuntimeContextRegistry() {
  const runtimeContexts = /* @__PURE__ */ new Map();
  const runtimeContextWatchers = /* @__PURE__ */ new Set();
  const emitRuntimeContextEvent = (event) => {
    for (const watcher of runtimeContextWatchers) {
      if (
        !doesRuntimeContextWatcherMatch({
          watcher: watcher.filter,
          event,
        })
      )
        continue;
      try {
        watcher.onEvent(event);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        log.error(
          `runtime context watcher failed during ${event.type} channel=${event.key.channelId} capability=${event.key.capability}` +
            (event.key.accountId ? ` account=${event.key.accountId}` : "") +
            `: ${message}`,
        );
      }
    }
  };
  return {
    register: (params) => {
      const normalized = normalizeRuntimeContextKey(params);
      if (!normalized) return { dispose: () => {} };
      if (params.abortSignal?.aborted) return { dispose: () => {} };
      const token = Symbol(normalized.mapKey);
      let disposed = false;
      const dispose = () => {
        if (disposed) return;
        disposed = true;
        const current = runtimeContexts.get(normalized.mapKey);
        if (!current || current.token !== token) return;
        runtimeContexts.delete(normalized.mapKey);
        emitRuntimeContextEvent({
          type: "unregistered",
          key: normalized.normalizedKey,
        });
      };
      params.abortSignal?.addEventListener("abort", dispose, { once: true });
      if (params.abortSignal?.aborted) {
        dispose();
        return { dispose };
      }
      runtimeContexts.set(normalized.mapKey, {
        token,
        context: params.context,
        normalizedKey: normalized.normalizedKey,
      });
      if (disposed) return { dispose };
      emitRuntimeContextEvent({
        type: "registered",
        key: normalized.normalizedKey,
        context: params.context,
      });
      return { dispose };
    },
    get: (params) => {
      const normalized = normalizeRuntimeContextKey(params);
      if (!normalized) return;
      return runtimeContexts.get(normalized.mapKey)?.context;
    },
    watch: (params) => {
      const watcher = {
        filter: {
          ...(params.channelId?.trim() ? { channelId: params.channelId.trim() } : {}),
          ...(params.accountId != null ? { accountId: params.accountId.trim() } : {}),
          ...(params.capability?.trim() ? { capability: params.capability.trim() } : {}),
        },
        onEvent: params.onEvent,
      };
      runtimeContextWatchers.add(watcher);
      return () => {
        runtimeContextWatchers.delete(watcher);
      };
    },
  };
}
//#endregion
//#region src/plugins/runtime/runtime-channel.ts
function createRuntimeChannel() {
  return {
    text: {
      chunkByNewline,
      chunkMarkdownText,
      chunkMarkdownTextWithMode,
      chunkText,
      chunkTextWithMode,
      resolveChunkMode,
      resolveTextChunkLimit,
      hasControlCommand,
      resolveMarkdownTableMode,
      convertMarkdownTables,
    },
    reply: {
      dispatchReplyWithBufferedBlockDispatcher,
      createReplyDispatcherWithTyping,
      resolveEffectiveMessagesConfig,
      resolveHumanDelayConfig,
      dispatchReplyFromConfig,
      withReplyDispatcher,
      settleReplyDispatcher,
      finalizeInboundContext,
      formatAgentEnvelope,
      /** @deprecated Prefer `BodyForAgent` + structured user-context blocks (do not build plaintext envelopes for prompts). */
      formatInboundEnvelope,
      resolveEnvelopeFormatOptions,
    },
    routing: {
      buildAgentSessionKey,
      resolveAgentRoute,
    },
    pairing: {
      buildPairingReply,
      readAllowFromStore: ({ channel, accountId, env }) =>
        readChannelAllowFromStore(channel, env, accountId),
      upsertPairingRequest: ({ channel, id, accountId, meta, env, pairingAdapter }) =>
        upsertChannelPairingRequest({
          channel,
          id,
          accountId,
          meta,
          env,
          pairingAdapter,
        }),
    },
    media: {
      readRemoteMediaBuffer,
      fetchRemoteMedia,
      saveRemoteMedia,
      saveResponseMedia,
      saveMediaBuffer,
    },
    activity: {
      record: recordChannelActivity,
      get: getChannelActivity,
    },
    session: {
      resolveStorePath,
      readSessionUpdatedAt,
      recordSessionMetaFromInbound: recordInboundSessionMeta,
      recordInboundSession,
      updateLastRoute: updateSessionLastRoute,
      resolveEntryResetFreshness: resolveSessionEntryResetFreshness,
    },
    mentions: {
      buildMentionRegexes,
      matchesMentionPatterns,
      matchesMentionWithExplicit,
      implicitMentionKindWhen,
      resolveInboundMentionDecision,
    },
    reactions: {
      createAckReactionHandle,
      shouldAckReaction,
      removeAckReactionAfterReply,
      removeAckReactionHandleAfterReply,
    },
    groups: {
      resolveGroupPolicy: resolveChannelGroupPolicy,
      resolveRequireMention: resolveChannelGroupRequireMention,
    },
    debounce: {
      createInboundDebouncer,
      resolveInboundDebounceMs,
    },
    commands: {
      resolveCommandAuthorizedFromAuthorizers,
      isControlCommandMessage,
      shouldComputeCommandAuthorized,
      shouldHandleTextCommands,
    },
    outbound: { loadAdapter: loadChannelOutboundAdapter },
    inbound: {
      buildContext: buildChannelInboundEventContext,
      run: runChannelInboundEvent,
      runPreparedReply: runPreparedInboundReply,
      dispatchReply: dispatchChannelInboundReply,
    },
    threadBindings: {
      setIdleTimeoutBySessionKey: ({ channelId, targetSessionKey, accountId, idleTimeoutMs }) =>
        setChannelConversationBindingIdleTimeoutBySessionKey({
          channelId,
          targetSessionKey,
          accountId,
          idleTimeoutMs,
        }),
      setMaxAgeBySessionKey: ({ channelId, targetSessionKey, accountId, maxAgeMs }) =>
        setChannelConversationBindingMaxAgeBySessionKey({
          channelId,
          targetSessionKey,
          accountId,
          maxAgeMs,
        }),
    },
    runtimeContexts: createChannelRuntimeContextRegistry(),
  };
}
//#endregion
export { createRuntimeChannel as t };
