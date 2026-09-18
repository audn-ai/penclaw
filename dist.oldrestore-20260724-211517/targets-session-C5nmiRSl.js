import { m as mapAllowFromEntries } from "./channel-config-helpers-BFvX3ldW.js";
import { s as channelRouteTargetsShareConversation } from "./channel-route-u-lrE52s.js";
import {
  a as validateTargetProviderPrefix,
  t as resolveTargetPrefixedChannel,
} from "./channel-target-prefix-Co3r_2wp.js";
import { t as formatCliCommand } from "./command-format-H_Arqann.js";
import "./message-channel-constants-CvbXi0yz.js";
import { n as deliveryContextFromSession } from "./delivery-context.shared-WPZGmi9R.js";
import {
  n as normalizeMessageChannel,
  t as isDeliverableMessageChannel,
} from "./message-channel-core-CgTCmAZC.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
  u as normalizeOptionalThreadValue,
} from "./string-coerce-DW4mBlAt.js";
import {
  i as reservedTargetLiteralError,
  r as missingTargetError,
} from "./target-errors-CZ0A80hz.js";
import { s as resolveReservedTargetLiteral } from "./target-normalization-CUTI5XyM.js";
import { t as resolveExplicitDeliveryTargetCompat } from "./target-parsing-loaded-BVN1GPlL.js";
//#region src/infra/outbound/targets-resolve-shared.ts
function buildWebChatDeliveryError() {
  return /* @__PURE__ */ new Error(
    `Delivering to WebChat is not supported via \`${formatCliCommand("openclaw agent")}\`; use WhatsApp/Telegram or run with --deliver=false.`,
  );
}
/**
 * Resolves a target through a channel plugin or the generic fallback path.
 */
function resolveOutboundTargetWithPlugin(params) {
  if (params.target.channel === "webchat")
    return {
      ok: false,
      error: buildWebChatDeliveryError(),
    };
  const plugin = params.plugin;
  if (!plugin) return params.onMissingPlugin?.();
  const allowFromRaw =
    params.target.allowFrom ??
    (params.target.cfg && plugin.config.resolveAllowFrom
      ? plugin.config.resolveAllowFrom({
          cfg: params.target.cfg,
          accountId: params.target.accountId ?? void 0,
        })
      : void 0);
  const allowFrom = allowFromRaw ? mapAllowFromEntries(allowFromRaw) : void 0;
  const effectiveTo =
    params.target.to?.trim() ||
    (params.target.cfg && plugin.config.resolveDefaultTo
      ? plugin.config.resolveDefaultTo({
          cfg: params.target.cfg,
          accountId: params.target.accountId ?? void 0,
        })
      : void 0);
  const targetPrefixError = validateTargetProviderPrefix({
    channel: params.target.channel,
    to: effectiveTo,
  });
  if (targetPrefixError)
    return {
      ok: false,
      error: targetPrefixError,
    };
  const hint = plugin.messaging?.targetResolver?.hint;
  if (params.target.mode !== "heartbeat") {
    const reservedLiteral = resolveReservedTargetLiteral({
      raw: effectiveTo,
      plugin,
    });
    if (reservedLiteral)
      return {
        ok: false,
        error: reservedTargetLiteralError(
          plugin.meta.label ?? params.target.channel,
          reservedLiteral,
          hint,
        ),
      };
  }
  const resolveTarget = plugin.outbound?.resolveTarget;
  if (resolveTarget)
    return resolveTarget({
      cfg: params.target.cfg,
      to: effectiveTo,
      allowFrom,
      accountId: params.target.accountId ?? void 0,
      mode: params.target.mode ?? "explicit",
    });
  if (effectiveTo)
    return {
      ok: true,
      to: effectiveTo,
    };
  return {
    ok: false,
    error: missingTargetError(plugin.meta.label ?? params.target.channel, hint),
  };
}
//#endregion
//#region src/infra/outbound/targets-session.ts
function resolveParsedRouteTarget(params) {
  const channel = normalizeLowercaseStringOrEmpty(params.channel);
  const rawTo = normalizeOptionalString(params.rawTarget);
  if (!channel || !rawTo) return null;
  const parsed = resolveExplicitDeliveryTargetCompat({
    channel,
    rawTarget: rawTo,
    fallbackThreadId: params.fallbackThreadId,
  });
  const threadId = normalizeOptionalThreadValue(parsed?.threadId ?? params.fallbackThreadId);
  return {
    channel,
    rawTo,
    to: parsed?.to ?? rawTo,
    ...(threadId != null ? { threadId } : {}),
    chatType: parsed?.chatType,
  };
}
/**
 * Resolves the effective outbound target for a session-scoped delivery request.
 */
function resolveSessionDeliveryTarget(params) {
  const context = deliveryContextFromSession(params.entry);
  const sessionLastChannel =
    context?.channel && isDeliverableMessageChannel(context.channel) ? context.channel : void 0;
  const parsedSessionTarget = sessionLastChannel
    ? resolveParsedRouteTarget({
        channel: sessionLastChannel,
        rawTarget: context?.to,
        fallbackThreadId: context?.threadId,
      })
    : null;
  const hasTurnSourceChannel = params.turnSourceChannel != null;
  const parsedTurnSourceTarget =
    hasTurnSourceChannel && params.turnSourceChannel
      ? resolveParsedRouteTarget({
          channel: params.turnSourceChannel,
          rawTarget: params.turnSourceTo,
          fallbackThreadId: params.turnSourceThreadId,
        })
      : null;
  const hasTurnSourceThreadId = parsedTurnSourceTarget?.threadId != null;
  const lastChannel = hasTurnSourceChannel ? params.turnSourceChannel : sessionLastChannel;
  const lastTo = hasTurnSourceChannel
    ? (parsedTurnSourceTarget?.to ?? params.turnSourceTo)
    : (parsedSessionTarget?.to ?? context?.to);
  const lastAccountId = hasTurnSourceChannel ? params.turnSourceAccountId : context?.accountId;
  const turnToMatchesSession =
    !params.turnSourceTo ||
    !context?.to ||
    (params.turnSourceChannel === sessionLastChannel &&
      channelRouteTargetsShareConversation({
        left: parsedTurnSourceTarget,
        right: parsedSessionTarget,
      }));
  const lastThreadId = hasTurnSourceThreadId
    ? parsedTurnSourceTarget?.threadId
    : hasTurnSourceChannel &&
        (params.turnSourceChannel !== sessionLastChannel || !turnToMatchesSession)
      ? void 0
      : parsedSessionTarget?.threadId;
  const rawRequested = params.requestedChannel ?? "last";
  const requested = rawRequested === "last" ? "last" : normalizeMessageChannel(rawRequested);
  const requestedChannel =
    requested === "last"
      ? "last"
      : requested && isDeliverableMessageChannel(requested)
        ? requested
        : void 0;
  const rawExplicitTo =
    typeof params.explicitTo === "string" && params.explicitTo.trim()
      ? params.explicitTo.trim()
      : void 0;
  const explicitPrefixedChannel =
    requestedChannel === "last" ? resolveTargetPrefixedChannel(rawExplicitTo) : void 0;
  let channel =
    explicitPrefixedChannel && isDeliverableMessageChannel(explicitPrefixedChannel)
      ? explicitPrefixedChannel
      : requestedChannel === "last"
        ? lastChannel
        : requestedChannel;
  if (!channel && params.fallbackChannel && isDeliverableMessageChannel(params.fallbackChannel))
    channel = params.fallbackChannel;
  const parsedExplicitTarget =
    channel && rawExplicitTo
      ? resolveExplicitDeliveryTargetCompat({
          channel,
          rawTarget: rawExplicitTo,
          fallbackThreadId: params.explicitThreadId,
        })
      : null;
  const explicitTo = parsedExplicitTarget?.to ?? rawExplicitTo;
  const explicitThreadId = normalizeOptionalThreadValue(
    parsedExplicitTarget?.threadId ?? params.explicitThreadId,
  );
  const explicitThreadIdSource = explicitThreadId != null ? "explicit" : void 0;
  let to = explicitTo;
  if (!to && lastTo) {
    if (channel && channel === lastChannel) to = lastTo;
    else if (params.allowMismatchedLastTo) to = lastTo;
  }
  const mode = params.mode ?? (explicitTo ? "explicit" : "implicit");
  const accountId = channel && channel === lastChannel ? lastAccountId : void 0;
  const threadId =
    channel && channel === lastChannel
      ? mode === "heartbeat"
        ? hasTurnSourceThreadId
          ? params.turnSourceThreadId
          : void 0
        : lastThreadId
      : void 0;
  return {
    channel,
    to,
    accountId,
    threadId: explicitThreadId ?? threadId,
    threadIdSource:
      explicitThreadIdSource ??
      (threadId != null ? (hasTurnSourceThreadId ? "turn-source" : "session") : void 0),
    mode,
    lastChannel,
    lastTo,
    lastAccountId,
    lastThreadId,
  };
}
//#endregion
export { resolveOutboundTargetWithPlugin as n, resolveSessionDeliveryTarget as t };
