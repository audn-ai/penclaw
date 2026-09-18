import { t as normalizeChatType } from "./chat-type-BARlA53h.js";
import {
  i as DEFAULT_MAX_CHARS_BY_CAPABILITY,
  n as DEFAULT_MAX_BYTES,
  o as DEFAULT_PROMPT,
} from "./defaults.constants-Ci5WOufw.js";
import { r as resolveEffectiveMediaEntryCapabilities } from "./entry-capabilities-BK3bTOCE.js";
import { a as shouldLogVerbose, r as logVerbose } from "./globals-CNUzHTcU.js";
import {
  j as resolveTimerTimeoutMs,
  n as MAX_TIMER_TIMEOUT_MS,
} from "./number-coercion-CJQ8TR--.js";
import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
//#region src/media-understanding/scope.ts
function normalizeDecision(value) {
  const normalized = normalizeOptionalLowercaseString(value);
  if (normalized === "allow") return "allow";
  if (normalized === "deny") return "deny";
}
/** Normalizes channel/direct chat type aliases used by media-understanding scope rules. */
function normalizeMediaUnderstandingChatType(raw) {
  return normalizeChatType(raw ?? void 0);
}
/** Evaluates ordered media-understanding scope rules against channel, chat type, and session key. */
function resolveMediaUnderstandingScope(params) {
  const scope = params.scope;
  if (!scope) return "allow";
  const channel = normalizeOptionalLowercaseString(params.channel);
  const chatType = normalizeMediaUnderstandingChatType(params.chatType);
  const sessionKey = normalizeOptionalLowercaseString(params.sessionKey) ?? "";
  for (const rule of scope.rules ?? []) {
    if (!rule) continue;
    const action = normalizeDecision(rule.action) ?? "allow";
    const match = rule.match ?? {};
    const matchChannel = normalizeOptionalLowercaseString(match.channel);
    const matchChatType = normalizeMediaUnderstandingChatType(match.chatType);
    const matchPrefix = normalizeOptionalLowercaseString(match.keyPrefix);
    if (matchChannel && matchChannel !== channel) continue;
    if (matchChatType && matchChatType !== chatType) continue;
    if (matchPrefix && !sessionKey.startsWith(matchPrefix)) continue;
    return action;
  }
  return normalizeDecision(scope.default) ?? "allow";
}
//#endregion
//#region src/media-understanding/resolve.ts
/** Default per-provider media-understanding runtime timeout in milliseconds. */
const DEFAULT_MEDIA_RUNTIME_TIMEOUT_MS = 3e4;
const MIN_MEDIA_TIMEOUT_MS = 1e3;
/** Converts configured timeout seconds into a timer-safe millisecond deadline. */
function resolveTimeoutMs(seconds, fallbackSeconds) {
  const value = typeof seconds === "number" && Number.isFinite(seconds) ? seconds : fallbackSeconds;
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0)
    return MIN_MEDIA_TIMEOUT_MS;
  const timeoutMs = Math.floor(value * 1e3);
  return resolveTimerTimeoutMs(
    Number.isFinite(timeoutMs) ? timeoutMs : MAX_TIMER_TIMEOUT_MS,
    MIN_MEDIA_TIMEOUT_MS,
    MIN_MEDIA_TIMEOUT_MS,
  );
}
/** Clamps an already-millisecond runtime timeout to the shared timer bounds. */
function resolveMediaRuntimeTimeoutMs(timeoutMs) {
  return resolveTimerTimeoutMs(timeoutMs, DEFAULT_MEDIA_RUNTIME_TIMEOUT_MS);
}
/** Resolves the provider prompt and appends length guidance for non-audio outputs. */
function resolvePrompt(capability, prompt, maxChars) {
  const base = prompt?.trim() || DEFAULT_PROMPT[capability];
  if (!maxChars || capability === "audio") return base;
  return `${base} Respond in at most ${maxChars} characters.`;
}
/** Resolves the effective max response characters for a model entry and capability. */
function resolveMaxChars(params) {
  const { capability, entry, cfg } = params;
  const configured =
    entry.maxChars ?? params.config?.maxChars ?? cfg.tools?.media?.[capability]?.maxChars;
  if (typeof configured === "number") return configured;
  return DEFAULT_MAX_CHARS_BY_CAPABILITY[capability];
}
/** Resolves the effective input byte cap for a model entry and capability. */
function resolveMaxBytes(params) {
  const configured =
    params.entry.maxBytes ??
    params.config?.maxBytes ??
    params.cfg.tools?.media?.[params.capability]?.maxBytes;
  if (typeof configured === "number") return configured;
  return DEFAULT_MAX_BYTES[params.capability];
}
/** Maps the message context to an allow/deny decision for configured media scope rules. */
function resolveScopeDecision(params) {
  return resolveMediaUnderstandingScope({
    scope: params.scope,
    sessionKey: params.ctx.SessionKey,
    channel: params.ctx.Surface ?? params.ctx.Provider,
    chatType: normalizeMediaUnderstandingChatType(params.ctx.ChatType),
  });
}
/** Resolves configured model entries that can handle the requested media capability. */
function resolveModelEntries(params) {
  const { cfg, capability, config } = params;
  const sharedModels = cfg.tools?.media?.models ?? [];
  const entries = [
    ...(config?.models ?? []).map((entry) => ({
      entry,
      source: "capability",
    })),
    ...sharedModels.map((entry) => ({
      entry,
      source: "shared",
    })),
  ];
  if (entries.length === 0) return [];
  return entries
    .filter(({ entry, source }) => {
      const caps = resolveEffectiveMediaEntryCapabilities({
        entry,
        source,
        providerRegistry: params.providerRegistry,
      });
      if (!caps || caps.length === 0) {
        if (source === "shared") {
          if (shouldLogVerbose())
            logVerbose(
              `Skipping shared media model without capabilities: ${entry.provider ?? entry.command ?? "unknown"}`,
            );
          return false;
        }
        return true;
      }
      return caps.includes(capability);
    })
    .map(({ entry }) => entry);
}
/** Resolves the bounded media-understanding task concurrency from config. */
function resolveConcurrency(cfg) {
  const configured = cfg.tools?.media?.concurrency;
  if (typeof configured === "number" && Number.isFinite(configured) && configured > 0)
    return Math.floor(configured);
  return 2;
}
//#endregion
export {
  resolveModelEntries as a,
  resolveTimeoutMs as c,
  resolveMediaRuntimeTimeoutMs as i,
  normalizeMediaUnderstandingChatType as l,
  resolveMaxBytes as n,
  resolvePrompt as o,
  resolveMaxChars as r,
  resolveScopeDecision as s,
  resolveConcurrency as t,
  resolveMediaUnderstandingScope as u,
};
