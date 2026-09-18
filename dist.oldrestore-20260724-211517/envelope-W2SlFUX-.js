import { t as normalizeChatType } from "./chat-type-BARlA53h.js";
import { a as resolveUserTimezone } from "./date-time-CcWivhrg.js";
import {
  a as resolveTimezone,
  n as formatUtcTimestamp,
  r as formatZonedTimestamp,
} from "./format-datetime-Bp7Mn3G9.js";
import { n as formatTimeAgo } from "./format-relative-Bjc3l98W.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
} from "./string-coerce-DW4mBlAt.js";
//#region src/channels/sender-label.ts
function normalizeSenderLabelParams(params) {
  return {
    name: normalizeOptionalString(params.name),
    username: normalizeOptionalString(params.username),
    tag: normalizeOptionalString(params.tag),
    e164: normalizeOptionalString(params.e164),
    id: normalizeOptionalString(params.id),
  };
}
/** Resolves the best one-line sender label from available identity fields. */
function resolveSenderLabel(params) {
  const { name, username, tag, e164, id } = normalizeSenderLabelParams(params);
  const display = name ?? username ?? tag ?? "";
  const idPart = e164 ?? id ?? "";
  if (display && idPart && display !== idPart) return `${display} (${idPart})`;
  return display || idPart || null;
}
//#endregion
//#region src/auto-reply/envelope.ts
/** Formats inbound message envelopes with sender, timing, and channel metadata for agent prompts. */
function sanitizeEnvelopeHeaderPart(value) {
  return value
    .replace(/\r\n|\r|\n/g, " ")
    .replaceAll("[", "(")
    .replaceAll("]", ")")
    .replace(/\s+/g, " ")
    .trim();
}
/** Resolves envelope formatting defaults from agent config. */
function resolveEnvelopeFormatOptions(cfg) {
  const defaults = cfg?.agents?.defaults;
  return {
    timezone: defaults?.envelopeTimezone,
    includeTimestamp: defaults?.envelopeTimestamp !== "off",
    includeElapsed: defaults?.envelopeElapsed !== "off",
    userTimezone: defaults?.userTimezone,
  };
}
function normalizeEnvelopeOptions(options) {
  const includeTimestamp = options?.includeTimestamp !== false;
  const includeElapsed = options?.includeElapsed !== false;
  return {
    timezone: normalizeOptionalString(options?.timezone) || "local",
    includeTimestamp,
    includeElapsed,
    userTimezone: options?.userTimezone,
  };
}
function resolveEnvelopeTimezone(options) {
  const trimmed = options.timezone?.trim();
  if (!trimmed) return { mode: "local" };
  const lowered = normalizeLowercaseStringOrEmpty(trimmed);
  if (lowered === "utc" || lowered === "gmt") return { mode: "utc" };
  if (lowered === "local" || lowered === "host") return { mode: "local" };
  if (lowered === "user")
    return {
      mode: "iana",
      timeZone: resolveUserTimezone(options.userTimezone),
    };
  const explicit = resolveTimezone(trimmed);
  return explicit
    ? {
        mode: "iana",
        timeZone: explicit,
      }
    : { mode: "utc" };
}
/** Formats an envelope timestamp using local, UTC, user, or explicit IANA timezone rules. */
function formatEnvelopeTimestamp(ts, options) {
  if (!ts) return;
  const resolved = normalizeEnvelopeOptions(options);
  if (!resolved.includeTimestamp) return;
  const date = ts instanceof Date ? ts : new Date(ts);
  if (Number.isNaN(date.getTime())) return;
  const zone = resolveEnvelopeTimezone(resolved);
  const weekday = (() => {
    try {
      if (zone.mode === "utc")
        return new Intl.DateTimeFormat("en-US", {
          timeZone: "UTC",
          weekday: "short",
        }).format(date);
      if (zone.mode === "local")
        return new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date);
      return new Intl.DateTimeFormat("en-US", {
        timeZone: zone.timeZone,
        weekday: "short",
      }).format(date);
    } catch {
      return;
    }
  })();
  const formatted =
    zone.mode === "utc"
      ? formatUtcTimestamp(date, { displaySeconds: true })
      : zone.mode === "local"
        ? formatZonedTimestamp(date, { displaySeconds: true })
        : formatZonedTimestamp(date, {
            timeZone: zone.timeZone,
            displaySeconds: true,
          });
  if (!formatted) return;
  return weekday ? `${weekday} ${formatted}` : formatted;
}
function resolveDirectEnvelopeBodyLabel(from) {
  const label = sanitizeEnvelopeHeaderPart(from || "");
  const idMarkerIndex = label.search(/\s+id:/i);
  if (idMarkerIndex > 0) {
    const displayLabel = label.slice(0, idMarkerIndex).trim();
    return displayLabel.includes(":") ? "(sender)" : displayLabel;
  }
  return label.includes(":") ? "(sender)" : label;
}
/** Formats the generic bracketed envelope prepended to agent-visible messages. */
function formatAgentEnvelope(params) {
  const parts = [sanitizeEnvelopeHeaderPart(normalizeOptionalString(params.channel) || "Channel")];
  const resolved = normalizeEnvelopeOptions(params.envelope);
  let elapsed;
  if (resolved.includeElapsed && params.timestamp && params.previousTimestamp) {
    const elapsedMs =
      (params.timestamp instanceof Date ? params.timestamp.getTime() : params.timestamp) -
      (params.previousTimestamp instanceof Date
        ? params.previousTimestamp.getTime()
        : params.previousTimestamp);
    elapsed =
      Number.isFinite(elapsedMs) && elapsedMs >= 0
        ? formatTimeAgo(elapsedMs, { suffix: false })
        : void 0;
  }
  const from = normalizeOptionalString(params.from);
  if (from) {
    const fromLabel = sanitizeEnvelopeHeaderPart(from);
    parts.push(elapsed ? `${fromLabel} +${elapsed}` : fromLabel);
  } else if (elapsed) parts.push(`+${elapsed}`);
  const host = normalizeOptionalString(params.host);
  if (host) parts.push(sanitizeEnvelopeHeaderPart(host));
  const ip = normalizeOptionalString(params.ip);
  if (ip) parts.push(sanitizeEnvelopeHeaderPart(ip));
  const ts = formatEnvelopeTimestamp(params.timestamp, resolved);
  if (ts) parts.push(ts);
  return `${`[${parts.join(" ")}]`} ${params.body}`;
}
/** Formats an inbound message body with sender attribution appropriate for direct/group chats. */
function formatInboundEnvelope(params) {
  const chatType = normalizeChatType(params.chatType);
  const isDirect = !chatType || chatType === "direct";
  const resolvedSenderRaw =
    normalizeOptionalString(params.senderLabel) || resolveSenderLabel(params.sender ?? {});
  const resolvedSender = resolvedSenderRaw ? sanitizeEnvelopeHeaderPart(resolvedSenderRaw) : "";
  const directSender = resolveDirectEnvelopeBodyLabel(normalizeOptionalString(params.from));
  const body =
    isDirect && params.fromMe
      ? `(self): ${params.body}`
      : isDirect && directSender
        ? `${directSender}: ${params.body}`
        : !isDirect && resolvedSender
          ? `${resolvedSender}: ${params.body}`
          : params.body;
  return formatAgentEnvelope({
    channel: params.channel,
    from: params.from,
    timestamp: params.timestamp,
    previousTimestamp: params.previousTimestamp,
    envelope: params.envelope,
    body,
  });
}
/** Builds the compact `from` label used in inbound envelope headers. */
function formatInboundFromLabel(params) {
  if (params.isGroup) {
    const label = normalizeOptionalString(params.groupLabel) || params.groupFallback || "Group";
    const id = params.groupId?.trim();
    return id ? `${label} id:${id}` : label;
  }
  const directLabel = params.directLabel.trim();
  const directId = params.directId?.trim();
  if (!directId || directId === directLabel) return directLabel;
  return `${directLabel} id:${directId}`;
}
//#endregion
export {
  resolveEnvelopeFormatOptions as a,
  formatInboundFromLabel as i,
  formatEnvelopeTimestamp as n,
  formatInboundEnvelope as r,
  formatAgentEnvelope as t,
};
