import {
  i as resolveAgentOutboundTarget,
  n as resolveAgentDeliveryPlanWithSessionRoute,
} from "./agent-delivery-B5NNkGfd.js";
import {
  c as resolveDefaultAgentId,
  o as resolveAgentWorkspaceDir,
} from "./agent-scope-config-DVIR1nBa.js";
import "./src-Bl7G9qvi.js";
import { v as resolveSessionAgentId } from "./agent-scope-y9xQv_q1.js";
import { r as resolveMessageChannelSelection } from "./channel-selection-DB_q64I6.js";
import { r as toErrorObject } from "./error-coercion-CrJRoLe1.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { i as resolveChannelDefaultAccountId } from "./helpers-BzNF0htn.js";
import "./plugins-BKdf-5tW.js";
import { n as isNestedAgentLane } from "./lanes-CI0_P-yC.js";
import { i as isInternalMessageChannel } from "./message-channel-NQc9DJ6B.js";
import { t as normalizeReplyPayload } from "./normalize-reply-DyJ9i_w0.js";
import { t as createOutboundSendDeps } from "./outbound-send-deps-D4Ql4D3K.js";
import { a as hasReplyPayloadContent } from "./payload-BFbDi85B.js";
import {
  a as projectOutboundPayloadPlanForDelivery,
  c as projectOutboundPayloadPlanForOutbound,
  n as formatOutboundPayloadLog,
  o as projectOutboundPayloadPlanForJson,
  r as normalizeOutboundPayloadsForJson,
  t as createOutboundPayloadPlan,
} from "./payloads-BRNPux3W.js";
import { a as normalizeChannelId, t as getChannelPlugin } from "./registry-mc8oBRx8.js";
import { n as createReplyMediaPathNormalizer } from "./reply-media-paths.runtime-MeEuXE-D.js";
import { i as copyReplyPayloadMetadata } from "./reply-payload-BK_jICQ3.js";
import "./runtime-BM0DJgoF.js";
import { r as formatBtwTextForExternalDelivery } from "./reply-payloads-CrA6c_P6.js";
import {
  i as resolveMessagingToolPayloadDedupe,
  n as filterMessagingToolMediaDuplicates,
  r as hasEnabledDeliveryOperation,
} from "./reply-payloads-dedupe-jL7XC27p.js";
import { t as createReplyPrefixContext } from "./reply-prefix-C5dokQJN.js";
import { n as resolveResponsePrefixTemplate } from "./response-prefix-template-DdRpfl7D.js";
import { s as isAgentRunRestartAbortReason } from "./run-termination-BEbihwT8.js";
import { i as writeRuntimeJson } from "./runtime-Bz6o617W.js";
import {
  n as serializeDurableMessagePayloadOutcomes,
  t as sendDurableMessageBatch,
} from "./send-DJdWoC1F.js";
import "./reply-payloads-dedupe.runtime-BQW_4mfS.js";
//#region src/infra/outbound/envelope.ts
const isOutboundPayloadJson = (payload) => "mediaUrl" in payload;
/** Builds the outbound result envelope, flattening plain delivery-only results by default. */
function buildOutboundResultEnvelope(params) {
  const hasPayloads = params.payloads !== void 0;
  const payloads =
    params.payloads === void 0
      ? void 0
      : params.payloads.length === 0
        ? []
        : isOutboundPayloadJson(expectDefined(params.payloads[0], "payloads entry at 0"))
          ? [...params.payloads]
          : normalizeOutboundPayloadsForJson(params.payloads);
  if (params.flattenDelivery !== false && params.delivery && !params.meta && !hasPayloads)
    return params.delivery;
  return {
    ...(hasPayloads ? { payloads } : {}),
    ...(params.meta ? { meta: params.meta } : {}),
    ...(params.delivery ? { delivery: params.delivery } : {}),
  };
}
//#endregion
//#region src/agents/command/delivery.ts
/**
 * Normalizes and delivers agent command results to outbound channels.
 */
function createRestartOnlyAbortSignal(source) {
  if (!source) return { dispose: () => {} };
  const controller = new AbortController();
  const onAbort = () => {
    if (isAgentRunRestartAbortReason(source.reason)) controller.abort(source.reason);
  };
  if (source.aborted) onAbort();
  else source.addEventListener("abort", onAbort, { once: true });
  return {
    signal: controller.signal,
    dispose: () => source.removeEventListener("abort", onAbort),
  };
}
const NESTED_LOG_PREFIX = "[agent:nested]";
function normalizeDeliverySessionId(value) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : void 0;
}
function isFreshDeliverySessionMatch(freshSessionEntry, expectedSessionId) {
  const normalizedExpected = normalizeDeliverySessionId(expectedSessionId);
  return Boolean(normalizedExpected && freshSessionEntry.sessionId === normalizedExpected);
}
function formatNestedLogPrefix(opts, sessionKey) {
  const parts = [NESTED_LOG_PREFIX];
  const session = sessionKey ?? opts.sessionKey ?? opts.sessionId;
  if (session) parts.push(`session=${session}`);
  if (opts.runId) parts.push(`run=${opts.runId}`);
  const channel = opts.messageChannel ?? opts.channel;
  if (channel) parts.push(`channel=${channel}`);
  if (opts.to) parts.push(`to=${opts.to}`);
  if (opts.accountId) parts.push(`account=${opts.accountId}`);
  return parts.join(" ");
}
function logNestedOutput(runtime, opts, output, sessionKey) {
  const prefix = formatNestedLogPrefix(opts, sessionKey);
  for (const line of output.split(/\r?\n/)) {
    if (!line) continue;
    runtime.log(`${prefix} ${line}`);
  }
}
function mergeResultMetaOverrides(meta, overrides) {
  if (!overrides) return meta;
  return {
    ...meta,
    ...overrides,
  };
}
function hasNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}
function hasNonEmptyStringArray(value) {
  return Array.isArray(value) && value.some(hasNonEmptyString);
}
function hasNonEmptyArray(value) {
  return Array.isArray(value) && value.length > 0;
}
function buildDeliveryResult(params) {
  return {
    payloads: params.payloads,
    meta: params.meta,
    ...(params.result.didSendViaMessagingTool === true ? { didSendViaMessagingTool: true } : {}),
    ...(hasNonEmptyStringArray(params.result.messagingToolSentTexts)
      ? { messagingToolSentTexts: params.result.messagingToolSentTexts }
      : {}),
    ...(hasNonEmptyStringArray(params.result.messagingToolSentMediaUrls)
      ? { messagingToolSentMediaUrls: params.result.messagingToolSentMediaUrls }
      : {}),
    ...(hasNonEmptyArray(params.result.messagingToolSentTargets)
      ? { messagingToolSentTargets: params.result.messagingToolSentTargets }
      : {}),
    ...(params.deliverySucceeded !== void 0 ? { deliverySucceeded: params.deliverySucceeded } : {}),
    ...(params.deliveryStatus ? { deliveryStatus: params.deliveryStatus } : {}),
  };
}
function deliveryStatusFromDurableSend(send) {
  const payloadOutcomes = serializeDurableMessagePayloadOutcomes(send.payloadOutcomes, {
    includeHookEffect: true,
  });
  switch (send.status) {
    case "sent":
      return {
        requested: true,
        attempted: true,
        status: "sent",
        succeeded: true,
        resultCount: send.results.length,
        ...(payloadOutcomes ? { payloadOutcomes } : {}),
      };
    case "suppressed":
      return {
        requested: true,
        attempted: true,
        status: "suppressed",
        succeeded: true,
        reason: send.reason,
        resultCount: 0,
        ...(payloadOutcomes ? { payloadOutcomes } : {}),
      };
    case "partial_failed":
      return {
        requested: true,
        attempted: true,
        status: "partial_failed",
        succeeded: "partial",
        error: true,
        errorMessage: formatErrorMessage(send.error),
        resultCount: send.results.length,
        sentBeforeError: true,
        ...(payloadOutcomes ? { payloadOutcomes } : {}),
      };
    case "failed":
      return {
        requested: true,
        attempted: true,
        status: "failed",
        succeeded: false,
        error: true,
        errorMessage: formatErrorMessage(send.error),
        ...(send.stage ? { reason: send.stage } : {}),
        ...(payloadOutcomes ? { payloadOutcomes } : {}),
      };
  }
  return send;
}
function preDeliveryFailureStatus(reason) {
  return {
    requested: true,
    attempted: false,
    status: "failed",
    succeeded: false,
    error: true,
    reason,
  };
}
function noVisiblePayloadStatus() {
  return {
    requested: true,
    attempted: false,
    status: "suppressed",
    succeeded: true,
    reason: "no_visible_payload",
    resultCount: 0,
  };
}
async function normalizeReplyMediaPathsForDelivery(params) {
  if (params.payloads.length === 0) return { payloads: params.payloads };
  const agentId =
    params.outboundSession?.agentId ??
    resolveSessionAgentId({
      sessionKey: params.sessionKey,
      config: params.cfg,
    });
  const workspaceDir = agentId ? resolveAgentWorkspaceDir(params.cfg, agentId) : void 0;
  if (!workspaceDir) return { payloads: params.payloads };
  const normalizeMediaPaths = createReplyMediaPathNormalizer({
    cfg: params.cfg,
    sessionKey: params.sessionKey,
    agentId,
    workspaceDir,
    messageProvider: params.deliveryChannel,
    accountId: params.accountId,
  });
  const result = [];
  for (const payload of params.payloads) result.push(await normalizeMediaPaths(payload));
  return {
    payloads: result,
    normalizeMediaPaths,
  };
}
async function normalizeSentMediaUrlsForDelivery(params) {
  const normalizedUrls = [];
  const seen = /* @__PURE__ */ new Set();
  for (const raw of params.sentMediaUrls) {
    const trimmed = raw.trim();
    if (!trimmed) continue;
    if (!seen.has(trimmed)) {
      seen.add(trimmed);
      normalizedUrls.push(trimmed);
    }
    if (!params.normalizeMediaPaths) continue;
    try {
      const normalized = await params.normalizeMediaPaths({
        mediaUrl: trimmed,
        mediaUrls: [trimmed],
      });
      for (const mediaUrl of [normalized.mediaUrl, ...(normalized.mediaUrls ?? [])]) {
        const candidate = mediaUrl?.trim();
        if (!candidate || seen.has(candidate)) continue;
        seen.add(candidate);
        normalizedUrls.push(candidate);
      }
    } catch {}
  }
  return normalizedUrls;
}
const UNRESOLVED_RESPONSE_PREFIX_VAR_PATTERN = /\{[a-zA-Z][a-zA-Z0-9.]*\}/;
async function filterAlreadyDeliveredReplyPayloads(params) {
  const sentTexts = params.result.messagingToolSentTexts ?? [];
  const sentMediaUrls = params.result.messagingToolSentMediaUrls ?? [];
  const implicitToolAccountId = params.sourceAccountId ?? params.defaultAccountId;
  const sentTargets = (params.result.messagingToolSentTargets ?? []).flatMap((target) => {
    if (target.accountId || !params.accountId) return [target];
    return implicitToolAccountId
      ? [
          {
            ...target,
            accountId: implicitToolAccountId,
          },
        ]
      : [];
  });
  if (sentTexts.length === 0 && sentMediaUrls.length === 0 && sentTargets.length === 0)
    return params.payloads;
  const decision = resolveMessagingToolPayloadDedupe({
    config: params.cfg,
    messageProvider: params.deliveryChannel,
    messagingToolSentTargets: sentTargets,
    originatingTo: params.deliveryTarget,
    originatingThreadId: params.threadId,
    accountId: params.accountId,
  });
  if (!decision.matchingRoute) return params.payloads;
  const routeSentMediaUrls = decision.useGlobalSentMediaUrlEvidenceFallback
    ? sentMediaUrls
    : decision.routeSentMediaUrls;
  const rawRouteSentTexts = decision.useGlobalSentTextEvidenceFallback
    ? sentTexts
    : decision.routeSentTexts;
  const routeSentTexts = params.normalizeSentTexts?.(rawRouteSentTexts) ?? rawRouteSentTexts;
  const exactRouteSentTexts = new Set(routeSentTexts.filter((text) => Boolean(text.trim())));
  const normalizedSentMediaUrls = await normalizeSentMediaUrlsForDelivery({
    sentMediaUrls: routeSentMediaUrls,
    normalizeMediaPaths: params.normalizeMediaPaths,
  });
  const mediaFiltered = filterMessagingToolMediaDuplicates({
    payloads: params.payloads,
    sentMediaUrls: normalizedSentMediaUrls,
  });
  const filteredPayloads = [];
  for (const candidate of mediaFiltered) {
    if (hasEnabledDeliveryOperation(candidate)) {
      filteredPayloads.push(candidate);
      continue;
    }
    const effectiveCandidateText =
      formatBtwTextForExternalDelivery(candidate) ?? candidate.text ?? "";
    if (!effectiveCandidateText.trim() || !exactRouteSentTexts.has(effectiveCandidateText)) {
      filteredPayloads.push(candidate);
      continue;
    }
    const withoutDuplicateText = copyReplyPayloadMetadata(candidate, {
      ...candidate,
      text: void 0,
    });
    if (
      hasReplyPayloadContent(withoutDuplicateText, {
        trimText: true,
        extraContent: withoutDuplicateText.location != null,
      })
    )
      filteredPayloads.push(withoutDuplicateText);
  }
  return filteredPayloads;
}
/** Normalizes reply payloads and media paths before delivery. */
function normalizeAgentCommandReplyPayloads(params) {
  const payloads = params.payloads ?? [];
  if (payloads.length === 0) return [];
  const channel =
    params.deliveryChannel && !isInternalMessageChannel(params.deliveryChannel)
      ? (normalizeChannelId(params.deliveryChannel) ?? params.deliveryChannel)
      : void 0;
  if (!channel) return payloads;
  const applyChannelTransforms = params.applyChannelTransforms ?? true;
  const deliveryPlugin = applyChannelTransforms ? getChannelPlugin(channel) : void 0;
  const sessionKey = params.outboundSession?.key ?? params.opts.sessionKey;
  const agentId =
    params.outboundSession?.agentId ??
    resolveSessionAgentId({
      sessionKey,
      config: params.cfg,
    });
  const replyPrefix = createReplyPrefixContext({
    cfg: params.cfg,
    agentId,
    channel,
    accountId: params.accountId,
  });
  const modelUsed = params.result.meta.agentMeta?.model;
  const providerUsed = params.result.meta.agentMeta?.provider;
  if (params.includeRunModelContext !== false && providerUsed && modelUsed)
    replyPrefix.onModelSelected({
      provider: providerUsed,
      model: modelUsed,
      thinkLevel: void 0,
    });
  const responsePrefixContext = replyPrefix.responsePrefixContextProvider();
  const resolvedResponsePrefix = resolveResponsePrefixTemplate(
    replyPrefix.responsePrefix,
    responsePrefixContext,
  );
  const responsePrefix =
    params.includeRunModelContext === false &&
    resolvedResponsePrefix &&
    UNRESOLVED_RESPONSE_PREFIX_VAR_PATTERN.test(resolvedResponsePrefix)
      ? void 0
      : replyPrefix.responsePrefix;
  const transformReplyPayload = deliveryPlugin?.messaging?.transformReplyPayload
    ? (payload) =>
        deliveryPlugin.messaging?.transformReplyPayload?.({
          payload,
          cfg: params.cfg,
          accountId: params.accountId,
        }) ?? payload
    : void 0;
  const normalizedPayloads = [];
  for (const payload of payloads) {
    const normalized = normalizeReplyPayload(payload, {
      responsePrefix,
      applyChannelTransforms,
      responsePrefixContext,
      transformReplyPayload,
    });
    if (normalized) normalizedPayloads.push(normalized);
  }
  return normalizedPayloads;
}
/** Delivers an agent command result or records why delivery was skipped. */
async function deliverAgentCommandResult(params) {
  params.assertDeliveryCurrent?.();
  const { cfg, deps, runtime, opts, outboundSession, sessionEntry, payloads, result } = params;
  const effectiveSessionKey = outboundSession?.key ?? opts.sessionKey;
  const deliveryAgentId =
    outboundSession?.agentId ??
    resolveSessionAgentId({
      sessionKey: effectiveSessionKey,
      config: cfg,
    }) ??
    resolveDefaultAgentId(cfg);
  const deliver = opts.deliver === true;
  const bestEffortDeliver = opts.bestEffortDeliver === true;
  const turnSourceChannel = opts.runContext?.messageChannel ?? opts.messageChannel;
  const turnSourceTo = opts.runContext?.currentChannelId ?? opts.to;
  const turnSourceAccountId = opts.runContext?.accountId ?? opts.accountId;
  const turnSourceThreadId = opts.runContext?.currentThreadTs ?? opts.threadId;
  const explicitChannelHint = (opts.replyChannel ?? opts.channel)?.trim();
  const resolveDeliveryRouting = async (candidateSessionEntry) => {
    const deliveryPlan = await resolveAgentDeliveryPlanWithSessionRoute({
      cfg,
      agentId: deliveryAgentId,
      currentSessionKey: effectiveSessionKey,
      sessionEntry: candidateSessionEntry,
      requestedChannel: opts.replyChannel ?? opts.channel,
      explicitTo: opts.replyTo ?? opts.to,
      explicitThreadId: opts.threadId,
      accountId: opts.replyAccountId ?? opts.accountId,
      wantsDelivery: deliver,
      turnSourceChannel,
      turnSourceTo,
      turnSourceAccountId,
      turnSourceThreadId,
    });
    params.assertDeliveryCurrent?.();
    let deliveryChannel = deliveryPlan.resolvedChannel;
    if (deliver && isInternalMessageChannel(deliveryChannel) && !explicitChannelHint)
      try {
        const selection = await resolveMessageChannelSelection({ cfg });
        params.assertDeliveryCurrent?.();
        deliveryChannel = selection.channel;
      } catch {}
    const effectiveDeliveryPlan =
      deliveryChannel === deliveryPlan.resolvedChannel
        ? deliveryPlan
        : {
            ...deliveryPlan,
            resolvedChannel: deliveryChannel,
          };
    const deliveryPlugin =
      deliver && !isInternalMessageChannel(deliveryChannel)
        ? getChannelPlugin(normalizeChannelId(deliveryChannel) ?? deliveryChannel)
        : void 0;
    const isDeliveryChannelKnown =
      isInternalMessageChannel(deliveryChannel) || Boolean(deliveryPlugin);
    const targetMode =
      opts.deliveryTargetMode ??
      effectiveDeliveryPlan.deliveryTargetMode ??
      (opts.to ? "explicit" : "implicit");
    const defaultAccountId =
      !effectiveDeliveryPlan.resolvedAccountId && deliveryPlugin?.config?.listAccountIds
        ? resolveChannelDefaultAccountId({
            plugin: deliveryPlugin,
            cfg,
          })
        : void 0;
    const resolvedAccountId = effectiveDeliveryPlan.resolvedAccountId ?? defaultAccountId;
    const resolvedDeliveryPlan =
      resolvedAccountId === effectiveDeliveryPlan.resolvedAccountId
        ? effectiveDeliveryPlan
        : {
            ...effectiveDeliveryPlan,
            resolvedAccountId,
          };
    const resolved =
      deliver && isDeliveryChannelKnown && deliveryChannel
        ? resolveAgentOutboundTarget({
            cfg,
            plan: resolvedDeliveryPlan,
            targetMode,
            validateExplicitTarget: true,
          })
        : {
            resolvedTarget: null,
            resolvedTo: effectiveDeliveryPlan.resolvedTo,
            targetMode,
          };
    const resolvedThreadId = deliveryPlan.resolvedThreadId ?? opts.threadId;
    const replyTransport =
      deliveryPlugin?.threading?.resolveReplyTransport?.({
        cfg,
        accountId: resolvedAccountId,
        threadId: resolvedThreadId,
      }) ?? null;
    return {
      deliveryPlan,
      deliveryChannel,
      effectiveDeliveryPlan: resolvedDeliveryPlan,
      deliveryPlugin,
      isDeliveryChannelKnown,
      targetMode,
      defaultAccountId,
      resolvedAccountId,
      resolved,
      resolvedTarget: resolved.resolvedTarget,
      deliveryTarget: resolved.resolvedTo,
      resolvedThreadId,
      resolvedReplyToId: replyTransport?.replyToId ?? void 0,
      resolvedThreadTarget:
        replyTransport && Object.hasOwn(replyTransport, "threadId")
          ? (replyTransport.threadId ?? null)
          : (resolvedThreadId ?? null),
    };
  };
  const deliveryRoutingFailureReason = (route) => {
    if (!deliver) return;
    if (isInternalMessageChannel(route.deliveryChannel)) return "channel_resolved_to_internal";
    if (!route.isDeliveryChannelKnown) return "unknown_channel";
    if (route.resolvedTarget && !route.resolvedTarget.ok) return "invalid_delivery_target";
    if (!route.deliveryTarget) return "no_delivery_target";
  };
  const isRetryableFreshSessionRoutingFailure = (route) => {
    const reason = deliveryRoutingFailureReason(route);
    if (!reason) return false;
    if (reason === "unknown_channel") return false;
    return true;
  };
  let deliveryRouting = await resolveDeliveryRouting(sessionEntry);
  params.assertDeliveryCurrent?.();
  if (isRetryableFreshSessionRoutingFailure(deliveryRouting)) {
    const freshSessionEntry = await params.resolveFreshSessionEntryForDelivery?.();
    params.assertDeliveryCurrent?.();
    const expectedFreshSessionId =
      params.expectedSessionIdForFreshDelivery ?? sessionEntry?.sessionId;
    if (
      freshSessionEntry &&
      freshSessionEntry !== sessionEntry &&
      isFreshDeliverySessionMatch(freshSessionEntry, expectedFreshSessionId)
    ) {
      const freshRouting = await resolveDeliveryRouting(freshSessionEntry);
      params.assertDeliveryCurrent?.();
      if (!deliveryRoutingFailureReason(freshRouting)) {
        if (!opts.json)
          runtime.log(
            `[delivery] refreshed session routing before final delivery (session=${effectiveSessionKey ?? "unknown"} channel=${freshRouting.deliveryChannel})`,
          );
        deliveryRouting = freshRouting;
      }
    }
  }
  const {
    deliveryChannel,
    isDeliveryChannelKnown,
    defaultAccountId,
    resolvedAccountId,
    resolvedTarget,
    deliveryTarget,
    resolvedReplyToId,
    resolvedThreadTarget,
  } = deliveryRouting;
  let deliveryLoggedError = false;
  const logDeliveryError = (err) => {
    deliveryLoggedError = true;
    const message = `Delivery failed (${deliveryChannel}${deliveryTarget ? ` to ${deliveryTarget}` : ""}): ${String(err)}`;
    runtime.error?.(message);
    if (!runtime.error) runtime.log(message);
  };
  let strictPreDeliveryError;
  let deliveryStatus;
  const handlePreDeliveryError = (err, reason) => {
    deliveryStatus = preDeliveryFailureStatus(reason);
    if (!bestEffortDeliver) {
      if (opts.json) {
        strictPreDeliveryError = err;
        return;
      }
      throw err;
    }
    logDeliveryError(err);
  };
  if (deliver) {
    if (isInternalMessageChannel(deliveryChannel))
      handlePreDeliveryError(
        /* @__PURE__ */ new Error(
          "delivery channel is required: pass --channel/--reply-channel or use a main session with a previous channel",
        ),
        "channel_resolved_to_internal",
      );
    else if (!isDeliveryChannelKnown)
      handlePreDeliveryError(
        /* @__PURE__ */ new Error(`Unknown channel: ${deliveryChannel}`),
        "unknown_channel",
      );
    else if (resolvedTarget && !resolvedTarget.ok)
      handlePreDeliveryError(resolvedTarget.error, "invalid_delivery_target");
  }
  const canonicalReplyPayloads = projectOutboundPayloadPlanForDelivery(
    createOutboundPayloadPlan(
      normalizeAgentCommandReplyPayloads({
        cfg,
        opts,
        outboundSession,
        payloads,
        result,
        deliveryChannel,
        accountId: resolvedAccountId,
        applyChannelTransforms: deliver,
      }),
    ),
  );
  const shouldFilterDeliveredPayloads =
    deliver &&
    !deliveryStatus &&
    Boolean(deliveryTarget) &&
    !isInternalMessageChannel(deliveryChannel);
  const normalizeSentTexts = (sentTexts) =>
    normalizeAgentCommandReplyPayloads({
      cfg,
      opts,
      outboundSession,
      payloads: sentTexts.map((text) => ({ text })),
      result,
      deliveryChannel,
      accountId: resolvedAccountId,
      applyChannelTransforms: deliver,
      includeRunModelContext: false,
    }).flatMap((payload) => (payload.text?.trim() ? [payload.text] : []));
  const filterDeliveredPayloads = (replyPayloads, normalizeMediaPaths) => {
    if (!shouldFilterDeliveredPayloads || !deliveryTarget) return Promise.resolve(replyPayloads);
    return filterAlreadyDeliveredReplyPayloads({
      cfg,
      payloads: replyPayloads,
      result,
      deliveryChannel,
      deliveryTarget,
      accountId: resolvedAccountId,
      sourceAccountId: turnSourceAccountId,
      defaultAccountId,
      threadId: resolvedThreadTarget ?? resolvedReplyToId ?? void 0,
      normalizeMediaPaths,
      normalizeSentTexts,
    });
  };
  const rawFilteredReplyPayloads = await filterDeliveredPayloads(canonicalReplyPayloads);
  const mediaNormalization =
    deliver && !deliveryStatus && !isInternalMessageChannel(deliveryChannel)
      ? await normalizeReplyMediaPathsForDelivery({
          cfg,
          payloads: rawFilteredReplyPayloads,
          sessionKey: effectiveSessionKey,
          outboundSession,
          deliveryChannel,
          accountId: resolvedAccountId,
        })
      : { payloads: rawFilteredReplyPayloads };
  const mediaNormalizedReplyPayloads = await filterDeliveredPayloads(
    mediaNormalization.payloads,
    mediaNormalization.normalizeMediaPaths,
  );
  params.assertDeliveryCurrent?.();
  const outboundPayloadPlan = createOutboundPayloadPlan(mediaNormalizedReplyPayloads);
  const normalizedPayloads = projectOutboundPayloadPlanForJson(outboundPayloadPlan);
  const resultMeta = mergeResultMetaOverrides(result.meta, opts.resultMetaOverrides);
  const emitJsonEnvelope = (status) => {
    if (!opts.json) return;
    writeRuntimeJson(runtime, {
      ...buildOutboundResultEnvelope({
        payloads: normalizedPayloads,
        meta: resultMeta,
      }),
      ...(status ? { deliveryStatus: status } : {}),
    });
  };
  if (strictPreDeliveryError) {
    emitJsonEnvelope(deliveryStatus);
    throw toErrorObject(strictPreDeliveryError, "Non-Error thrown");
  }
  const deliveryPayloads = projectOutboundPayloadPlanForOutbound(outboundPayloadPlan);
  if (deliveryPayloads.length === 0) {
    deliveryStatus = deliver ? (deliveryStatus ?? noVisiblePayloadStatus()) : void 0;
    const deliverySucceeded = deliveryStatus?.succeeded === true ? true : void 0;
    emitJsonEnvelope(deliveryStatus);
    return buildDeliveryResult({
      payloads: normalizedPayloads,
      meta: resultMeta,
      result,
      deliverySucceeded,
      deliveryStatus,
    });
  }
  let deliverySucceeded = false;
  const logPayload = (payload) => {
    if (opts.json) return;
    const output = formatOutboundPayloadLog(payload);
    if (!output) return;
    if (isNestedAgentLane(opts.lane)) {
      logNestedOutput(runtime, opts, output, effectiveSessionKey);
      return;
    }
    runtime.log(output);
  };
  if (!deliver) {
    for (const payload of deliveryPayloads) logPayload(payload);
    emitJsonEnvelope();
    return buildDeliveryResult({
      payloads: normalizedPayloads,
      meta: resultMeta,
      result,
    });
  }
  if (deliver && deliveryChannel && !isInternalMessageChannel(deliveryChannel)) {
    if (deliveryTarget && !deliveryStatus) {
      params.assertDeliveryCurrent?.();
      const restartAbort = createRestartOnlyAbortSignal(opts.abortSignal);
      let send;
      try {
        send = await sendDurableMessageBatch({
          cfg,
          channel: deliveryChannel,
          to: deliveryTarget,
          accountId: resolvedAccountId,
          payloads: deliveryPayloads,
          session: outboundSession,
          replyToId: resolvedReplyToId ?? null,
          threadId: resolvedThreadTarget ?? null,
          bestEffort: bestEffortDeliver,
          durability: bestEffortDeliver ? "best_effort" : "required",
          signal: restartAbort.signal,
          onDeliveryIntent: restartAbort.dispose,
          onError: logDeliveryError,
          onPayload: logPayload,
          deps: createOutboundSendDeps(deps),
        });
      } finally {
        restartAbort.dispose();
      }
      if (restartAbort.signal?.aborted && send.status === "failed")
        throw restartAbort.signal.reason;
      deliveryStatus = deliveryStatusFromDurableSend(send);
      if (!bestEffortDeliver && (send.status === "failed" || send.status === "partial_failed")) {
        emitJsonEnvelope(deliveryStatus);
        throw send.error;
      }
      deliverySucceeded = send.status === "sent" || send.status === "suppressed";
    }
  }
  if (deliver && !deliveryStatus) deliveryStatus = preDeliveryFailureStatus("no_delivery_target");
  if (deliver && !deliverySucceeded && !opts.json && !deliveryLoggedError) {
    const message = `[delivery] delivery requested but not completed: ${deliveryStatus?.status ?? "unknown"} (reason=${deliveryStatus?.reason ?? "none"} session=${effectiveSessionKey ?? "unknown"} channel=${deliveryChannel ?? "none"} target=${deliveryTarget ?? "none"} payloads=${deliveryPayloads.length})`;
    runtime.error?.(message);
    if (!runtime.error) runtime.log(message);
  }
  emitJsonEnvelope(deliveryStatus);
  return buildDeliveryResult({
    payloads: normalizedPayloads,
    meta: resultMeta,
    result,
    deliverySucceeded,
    deliveryStatus,
  });
}
//#endregion
export { deliverAgentCommandResult };
