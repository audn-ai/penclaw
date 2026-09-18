import { t as collectTextContentBlocks } from "./content-blocks-DRK0dze4.js";
import { o as isMessagingToolTargetEvidenceAction } from "./embedded-agent-messaging-C_REpMqa.js";
import {
  c as normalizeInteractiveReply,
  l as normalizeMessagePresentation,
} from "./payload-BFbDi85B.js";
import { i as asOptionalRecord } from "./record-coerce-DHZ4bFlT.js";
import {
  a as redactSensitiveFieldValue,
  i as redactSecrets,
  u as redactToolPayloadText,
} from "./redact-CUe6Oey5.js";
import "./utils-DtcDeqWS.js";
import { a as normalizeChannelId, t as getChannelPlugin } from "./registry-mc8oBRx8.js";
import "./plugins-BKdf-5tW.js";
import {
  c as normalizeOptionalString,
  l as normalizeOptionalStringifiedId,
  p as readStringValue,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
import { a as normalizeTargetForProvider } from "./target-normalization-CUTI5XyM.js";
import { m as normalizeToolName } from "./tool-policy-1QHiwXPv.js";
import {
  i as readToolResultStatus,
  n as isToolResultError,
  r as readToolResultDetails,
} from "./tool-result-error-1qgstja-.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region src/agents/embedded-agent-subscribe.tools.ts
/**
 * Sanitizes, extracts, and classifies embedded-agent tool execution results.
 */
const TOOL_RESULT_MAX_CHARS = 8e3;
const TOOL_ERROR_MAX_CHARS = 400;
const LIVE_EXEC_OUTPUT_MAX_CHARS = 8e3;
const TOOL_DENIAL_ERROR_CODES = ["SYSTEM_RUN_DENIED", "INVALID_REQUEST"];
const OPAQUE_STRUCTURED_RESULT_FIELDS = /* @__PURE__ */ new Set([
  "encrypted_content",
  "encrypted_stdout",
]);
const SENSITIVE_STRUCTURED_HEADER_FIELDS = /* @__PURE__ */ new Set([
  "authorization",
  "proxy-authorization",
  "cookie",
  "set-cookie",
  "x-api-key",
  "x-auth-token",
]);
function truncateToolText(text) {
  if (text.length <= TOOL_RESULT_MAX_CHARS) return text;
  return `${truncateUtf16Safe(text, TOOL_RESULT_MAX_CHARS)}\n…(truncated)…`;
}
function truncateLiveExecOutput(text) {
  if (text.length <= LIVE_EXEC_OUTPUT_MAX_CHARS) return text;
  return `${truncateUtf16Safe(text, LIVE_EXEC_OUTPUT_MAX_CHARS)}\n...(live output truncated)...`;
}
function capLiveExecResult(result) {
  const details = readToolResultDetails(result);
  if (!details || typeof details.status !== "string" || typeof details.aggregated !== "string")
    return result;
  const aggregated = truncateLiveExecOutput(details.aggregated);
  if (aggregated === details.aggregated) return result;
  if (!result || typeof result !== "object" || Array.isArray(result)) return result;
  return {
    ...result,
    details: {
      ...details,
      aggregated,
    },
  };
}
function normalizeToolErrorText(text) {
  const trimmed = text.trim();
  if (!trimmed) return;
  const firstLine = trimmed.split(/\r?\n/)[0]?.trim() ?? "";
  if (!firstLine) return;
  return firstLine.length > TOOL_ERROR_MAX_CHARS
    ? `${truncateUtf16Safe(firstLine, TOOL_ERROR_MAX_CHARS)}…`
    : firstLine;
}
function isErrorLikeStatus(status) {
  const normalized = normalizeOptionalLowercaseString(status);
  if (!normalized) return false;
  if (
    normalized === "0" ||
    normalized === "ok" ||
    normalized === "success" ||
    normalized === "completed" ||
    normalized === "running"
  )
    return false;
  return /error|fail|timeout|timed[_\s-]?out|denied|cancel|invalid|forbidden/.test(normalized);
}
function readErrorCandidate(value) {
  if (typeof value === "string") return normalizeToolErrorText(value);
  if (!value || typeof value !== "object") return;
  const record = value;
  if (typeof record.message === "string") return normalizeToolErrorText(record.message);
  if (typeof record.error === "string") return normalizeToolErrorText(record.error);
}
function extractErrorField(value) {
  if (!value || typeof value !== "object") return;
  const record = value;
  const direct = extractDirectErrorField(record);
  if (direct) return direct;
  const status = normalizeOptionalString(record.status) ?? "";
  if (!status || !isErrorLikeStatus(status)) return;
  return normalizeToolErrorText(status);
}
function extractDirectErrorField(value) {
  if (!value || typeof value !== "object") return;
  const record = value;
  return (
    readErrorCandidate(record.error) ??
    readErrorCandidate(record.message) ??
    readErrorCandidate(record.reason)
  );
}
function readErrorCodeField(value) {
  return typeof value === "string" ? normalizeOptionalString(value) : void 0;
}
function readDenialErrorCodeFromMessage(value) {
  const message = typeof value === "string" ? normalizeOptionalString(value) : void 0;
  if (!message) return;
  for (const code of TOOL_DENIAL_ERROR_CODES)
    if (message === code || message.startsWith(`${code}:`)) return code;
}
function readNestedErrorCodeField(value) {
  if (!value || typeof value !== "object") return;
  const record = value;
  return (
    readDenialErrorCodeFromMessage(record.message) ??
    readDenialErrorCodeFromMessage(record.error) ??
    readErrorCodeField(record.code) ??
    readErrorCodeField(record.gatewayCode)
  );
}
function extractDirectErrorCodeField(value) {
  if (!value || typeof value !== "object") return;
  const record = value;
  return (
    readNestedErrorCodeField(record.error) ??
    readNestedErrorCodeField(record.nodeError) ??
    readErrorCodeField(record.code) ??
    readErrorCodeField(record.gatewayCode)
  );
}
function buildToolLifecycleErrorResult(error) {
  const errorRecord = asOptionalRecord(error);
  const nodeError = asOptionalRecord(asOptionalRecord(errorRecord?.details)?.nodeError);
  const gatewayCode =
    readErrorCodeField(errorRecord?.gatewayCode) ?? readErrorCodeField(errorRecord?.code);
  return {
    details: {
      status: "error",
      error: error instanceof Error ? error.message : String(error),
      ...(gatewayCode ? { gatewayCode } : {}),
      ...(nodeError ? { nodeError } : {}),
    },
  };
}
function extractAggregatedErrorField(value) {
  if (!value || typeof value !== "object") return;
  return readErrorCandidate(value.aggregated);
}
function redactStringsDeep(value, seen = /* @__PURE__ */ new WeakSet()) {
  if (typeof value === "string") return redactToolPayloadText(value);
  if (Array.isArray(value)) {
    if (seen.has(value)) return "[Circular]";
    seen.add(value);
    return value.map((item) => redactStringsDeep(item, seen));
  }
  if (value && typeof value === "object") {
    if (seen.has(value)) return "[Circular]";
    seen.add(value);
    const out = {};
    for (const [key, child] of Object.entries(value))
      out[key] =
        typeof child === "string"
          ? redactSensitiveFieldValue(key, child)
          : redactStringsDeep(child, seen);
    return out;
  }
  return value;
}
function sanitizeToolArgs(args) {
  return redactStringsDeep(args);
}
function sanitizeToolResult(result) {
  if (typeof result === "string") return redactToolPayloadText(result);
  if (Array.isArray(result)) return redactSecrets(result);
  if (!result || typeof result !== "object") return result;
  const record = result;
  const preCleaned = { ...record };
  const originalContent = Array.isArray(record.content) ? record.content : null;
  if (originalContent)
    preCleaned.content = originalContent.map((item) => {
      if (!item || typeof item !== "object") return item;
      const entry = item;
      if (readStringValue(entry.type) === "image") {
        const bytes =
          readStringValue(entry.data)?.length ??
          (typeof entry.bytes === "number" ? entry.bytes : void 0);
        const cleaned = { ...entry };
        delete cleaned.data;
        return Object.assign({}, cleaned, {
          bytes,
          omitted: true,
        });
      }
      return entry;
    });
  const baseline = redactSecrets(preCleaned);
  const out = { ...baseline };
  const content = Array.isArray(baseline.content) ? baseline.content : null;
  if (content)
    out.content = content.map((item) => {
      if (!item || typeof item !== "object") return item;
      const entry = item;
      if (readStringValue(entry.type) === "text" && typeof entry.text === "string")
        return Object.assign({}, entry, { text: truncateToolText(entry.text) });
      return entry;
    });
  return out;
}
const INLINE_DATA_URI_VALUE_PATTERN =
  /^data:(?:[a-z][a-z0-9.+-]*\/[a-z0-9.+-]+)?(?:;[a-z0-9.+-]+(?:=[^,;"'\s]+)?)*,/i;
function redactInlineDataUriValue(value) {
  const trimmed = value.trimStart();
  if (!INLINE_DATA_URI_VALUE_PATTERN.test(trimmed)) return value;
  return `[inline data URI: ${value.length} chars]`;
}
function carriesBinaryData(record) {
  const type = normalizeOptionalLowercaseString(record.type);
  if (type === "audio" || type === "image" || type === "base64") return true;
  const mediaType = normalizeOptionalLowercaseString(record.media_type ?? record.mimeType);
  return (
    mediaType?.startsWith("image/") === true ||
    mediaType?.startsWith("audio/") === true ||
    mediaType?.startsWith("video/") === true ||
    mediaType === "application/pdf"
  );
}
function sanitizeStructuredToolResultValue(
  value,
  key = "",
  parentCarriesBinaryData = false,
  seen = /* @__PURE__ */ new WeakSet(),
) {
  if (typeof value === "string") {
    if (SENSITIVE_STRUCTURED_HEADER_FIELDS.has(key.toLowerCase())) return "***";
    if (key === "blob" || (key === "data" && parentCarriesBinaryData))
      return `[binary omitted: ${value.length} chars]`;
    if (OPAQUE_STRUCTURED_RESULT_FIELDS.has(key))
      return `[opaque data omitted: ${value.length} chars]`;
    return truncateToolText(redactInlineDataUriValue(redactSensitiveFieldValue(key, value)));
  }
  if (typeof value === "bigint") return value.toString();
  if (!value || typeof value !== "object") return value;
  if (seen.has(value)) return "[Circular]";
  seen.add(value);
  if (Array.isArray(value))
    return value.map((item) =>
      sanitizeStructuredToolResultValue(item, key, parentCarriesBinaryData, seen),
    );
  const record = value;
  const hasBinaryData = carriesBinaryData(record);
  return Object.fromEntries(
    Object.entries(record).map(([childKey, child]) => [
      childKey,
      sanitizeStructuredToolResultValue(child, childKey, hasBinaryData, seen),
    ]),
  );
}
function stringifyStructuredToolResultContent(block) {
  if (!block || typeof block !== "object") return;
  const record = block;
  const type = readStringValue(record.type);
  if (type === "text" || type === "image" || type === "image_url" || type === "audio") return;
  try {
    const serialized = JSON.stringify(sanitizeStructuredToolResultValue(record));
    const redacted = serialized ? redactToolPayloadText(serialized) : serialized;
    return redacted && redacted !== "{}" ? redacted : void 0;
  } catch {
    return;
  }
}
function resolveToolResultContentBlocks(result) {
  if (Array.isArray(result)) return result;
  const record = result;
  if (readStringValue(record.type)) return [record];
  if (Array.isArray(record.content)) return record.content;
  if (record.content && typeof record.content === "object") return [record.content];
  return [record];
}
function extractToolResultText(result) {
  if (typeof result === "string") {
    const trimmed = redactToolPayloadText(redactInlineDataUriValue(result)).trim();
    return trimmed ? truncateToolText(trimmed) : void 0;
  }
  if (!result || typeof result !== "object") return;
  const content = resolveToolResultContentBlocks(result);
  const texts = collectTextContentBlocks(content)
    .map((item) => {
      const trimmed = item.trim();
      return trimmed ? trimmed : void 0;
    })
    .filter((value) => Boolean(value));
  if (texts.length > 0) return truncateToolText(texts.join("\n"));
  const structuredTexts = [];
  for (const item of content) {
    const structured = stringifyStructuredToolResultContent(item);
    if (structured) structuredTexts.push(structured);
  }
  if (structuredTexts.length === 0) return;
  return truncateToolText(structuredTexts.join("\n"));
}
function pushUniqueMessagingMediaUrl(urls, seen, value) {
  if (typeof value !== "string") return;
  const normalized = value.trim();
  if (!normalized || seen.has(normalized)) return;
  seen.add(normalized);
  urls.push(normalized);
}
/** Collects messaging attachment references from tool-call arguments or result records. */
function collectMessagingMediaUrlsFromRecord(record) {
  const urls = [];
  const seen = /* @__PURE__ */ new Set();
  const pushAttachment = (value) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) return;
    const attachment = value;
    for (const candidate of [
      attachment.media,
      attachment.mediaUrl,
      attachment.path,
      attachment.filePath,
      attachment.fileUrl,
      attachment.url,
    ])
      pushUniqueMessagingMediaUrl(urls, seen, candidate);
  };
  for (const candidate of [
    record.media,
    record.mediaUrl,
    record.path,
    record.filePath,
    record.fileUrl,
  ])
    pushUniqueMessagingMediaUrl(urls, seen, candidate);
  if (Array.isArray(record.mediaUrls))
    for (const mediaUrl of record.mediaUrls) pushUniqueMessagingMediaUrl(urls, seen, mediaUrl);
  if (Array.isArray(record.attachments))
    for (const attachment of record.attachments) pushAttachment(attachment);
  return urls;
}
/** Collects messaging attachment references from a completed tool result. */
function collectMessagingMediaUrlsFromToolResult(result) {
  const urls = [];
  const seen = /* @__PURE__ */ new Set();
  const appendFromRecord = (value) => {
    if (!value || typeof value !== "object") return;
    for (const url of collectMessagingMediaUrlsFromRecord(value))
      if (!seen.has(url)) {
        seen.add(url);
        urls.push(url);
      }
  };
  appendFromRecord(result);
  if (result && typeof result === "object") appendFromRecord(result.details);
  const outputText = extractToolResultText(result);
  if (outputText)
    try {
      appendFromRecord(JSON.parse(outputText));
    } catch {}
  return urls;
}
/** Extract an internal source-reply payload from a completed message tool result. */
function extractMessagingToolSourceReplyPayload(result) {
  const details = readToolResultDetails(result);
  if (!details || details.sourceReplySink !== "internal-ui") return;
  const status = normalizeOptionalLowercaseString(details.deliveryStatus);
  if (status && status !== "sent") return;
  const sourceReply = asOptionalRecord(details.sourceReply) ?? details;
  const payload = {};
  const text = readStringValue(sourceReply.text) ?? readStringValue(details.message);
  if (text) payload.text = text;
  const mediaUrl = readStringValue(sourceReply.mediaUrl) ?? readStringValue(details.mediaUrl);
  if (mediaUrl) payload.mediaUrl = mediaUrl;
  const mediaUrls = uniqueStrings(
    (Array.isArray(sourceReply.mediaUrls)
      ? sourceReply.mediaUrls
      : Array.isArray(details.mediaUrls)
        ? details.mediaUrls
        : []
    ).filter((value) => typeof value === "string"),
  );
  if (mediaUrls.length > 0) payload.mediaUrls = mediaUrls;
  if (sourceReply.audioAsVoice === true || details.audioAsVoice === true)
    payload.audioAsVoice = true;
  const presentation = normalizeMessagePresentation(sourceReply.presentation);
  if (presentation) payload.presentation = presentation;
  const interactive = normalizeInteractiveReply(sourceReply.interactive);
  if (interactive) payload.interactive = interactive;
  const channelData = asOptionalRecord(sourceReply.channelData);
  if (channelData) payload.channelData = { ...channelData };
  const idempotencyKey =
    readStringValue(sourceReply.idempotencyKey) ?? readStringValue(details.idempotencyKey);
  if (idempotencyKey) payload.idempotencyKey = idempotencyKey;
  return Object.keys(payload).length > 0 ? payload : void 0;
}
const TRUSTED_TOOL_RESULT_MEDIA = /* @__PURE__ */ new Set([
  "agents_list",
  "apply_patch",
  "browser",
  "canvas",
  "cron",
  "edit",
  "exec",
  "gateway",
  "image",
  "image_generate",
  "memory_get",
  "memory_search",
  "message",
  "music_generate",
  "nodes",
  "process",
  "read",
  "session_status",
  "sessions_history",
  "sessions_list",
  "sessions_search",
  "sessions_send",
  "sessions_spawn",
  "subagents",
  "tts",
  "video_generate",
  "web_fetch",
  "web_search",
  "x_search",
  "write",
]);
const HTTP_URL_RE = /^https?:\/\//i;
function isCoreToolResultMediaTrustedName(toolName) {
  if (!toolName) return false;
  return TRUSTED_TOOL_RESULT_MEDIA.has(normalizeToolName(toolName));
}
function isExternalToolResult(result) {
  const details = readToolResultDetails(result);
  if (!details) return false;
  return typeof details.mcpServer === "string" || typeof details.mcpTool === "string";
}
function isToolResultMediaTrusted(toolName, result, trustedLocalMediaToolNames) {
  if (!toolName || isExternalToolResult(result)) return false;
  const registeredName = toolName.trim();
  if (registeredName && trustedLocalMediaToolNames?.has(registeredName) === true) return true;
  return isCoreToolResultMediaTrustedName(toolName);
}
function isTrustedOwnedTtsLocalMedia(toolName, result, trustedLocalMediaToolNames) {
  if (
    !toolName ||
    !isToolResultMediaTrusted(toolName, result, trustedLocalMediaToolNames) ||
    normalizeToolName(toolName) !== "tts"
  )
    return false;
  const media = readToolResultDetails(result)?.media;
  if (!media || typeof media !== "object" || Array.isArray(media)) return false;
  return media.trustedLocalMedia === true;
}
function filterToolResultMediaUrls(toolName, mediaUrls, result, trustedLocalMediaToolNames) {
  if (mediaUrls.length === 0) return mediaUrls;
  const trustedOwnedTtsLocalMedia = isTrustedOwnedTtsLocalMedia(
    toolName,
    result,
    trustedLocalMediaToolNames,
  );
  if (isToolResultMediaTrusted(toolName, result, trustedLocalMediaToolNames)) {
    if (trustedLocalMediaToolNames !== void 0) {
      if (!trustedOwnedTtsLocalMedia) {
        const registeredName = toolName?.trim();
        if (!registeredName || !trustedLocalMediaToolNames.has(registeredName))
          return mediaUrls.filter((url) => HTTP_URL_RE.test(url.trim()));
      }
    }
    return mediaUrls;
  }
  return mediaUrls.filter((url) => HTTP_URL_RE.test(url.trim()));
}
function readToolResultDetailsMedia(result) {
  const details = readToolResultDetails(result);
  return details?.media && typeof details.media === "object" && !Array.isArray(details.media)
    ? details.media
    : void 0;
}
function collectStructuredMediaUrls(media) {
  const urls = [];
  const pushString = (value) => {
    if (typeof value !== "string") return;
    const normalized = value.trim();
    if (normalized) urls.push(normalized);
  };
  const pushAttachment = (value) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) return;
    const attachment = value;
    pushString(attachment.media);
    pushString(attachment.path);
    pushString(attachment.url);
    pushString(attachment.mediaUrl);
    pushString(attachment.filePath);
    pushString(attachment.fileUrl);
  };
  pushString(media.media);
  pushString(media.path);
  pushString(media.url);
  pushString(media.mediaUrl);
  pushString(media.filePath);
  pushString(media.fileUrl);
  if (Array.isArray(media.mediaUrls)) for (const value of media.mediaUrls) pushString(value);
  if (Array.isArray(media.attachments))
    for (const attachment of media.attachments) pushAttachment(attachment);
  return uniqueStrings(urls);
}
function isNonOutboundToolResultMedia(media) {
  return media.outbound === false;
}
function hasImageContentBlock(content) {
  for (const item of content) {
    if (!item || typeof item !== "object") continue;
    if (item.type === "image") return true;
  }
  return false;
}
function extractToolResultMediaArtifact(result) {
  if (!result || typeof result !== "object") return;
  const record = result;
  const detailsMedia = readToolResultDetailsMedia(record);
  if (detailsMedia) {
    if (isNonOutboundToolResultMedia(detailsMedia)) return;
    const mediaUrls = collectStructuredMediaUrls(detailsMedia);
    if (mediaUrls.length > 0)
      return {
        mediaUrls,
        ...(detailsMedia.audioAsVoice === true ? { audioAsVoice: true } : {}),
        ...(detailsMedia.trustedLocalMedia === true ? { trustedLocalMedia: true } : {}),
      };
  }
  const content = Array.isArray(record.content) ? record.content : null;
  if (!content) return;
  if (hasImageContentBlock(content)) {
    const details = record.details;
    const p = normalizeOptionalString(details?.path) ?? "";
    if (p) return { mediaUrls: [p] };
  }
}
function extractToolErrorCode(result) {
  if (!result || typeof result !== "object") return;
  const record = result;
  return extractDirectErrorCodeField(record.details) ?? extractDirectErrorCodeField(record);
}
function isToolResultTimedOut(result) {
  if (readToolResultStatus(result) === "timeout") return true;
  return readToolResultDetails(result)?.timedOut === true;
}
function extractToolErrorMessage(result) {
  if (!result || typeof result !== "object") return;
  const record = result;
  const fromDetails = extractDirectErrorField(record.details);
  if (fromDetails) return fromDetails;
  const fromDetailsAggregated = extractAggregatedErrorField(record.details);
  if (fromDetailsAggregated) return fromDetailsAggregated;
  const fromRoot = extractDirectErrorField(record);
  if (fromRoot) return fromRoot;
  const text = extractToolResultText(result);
  if (text)
    try {
      const fromJson = extractErrorField(JSON.parse(text));
      if (fromJson) return fromJson;
    } catch {}
  const fromDetailsStatus = extractErrorField(record.details);
  if (fromDetailsStatus) return fromDetailsStatus;
  const fromRootStatus = extractErrorField(record);
  if (fromRootStatus) return fromRootStatus;
  if (readToolResultStatus(result) && !isToolResultError(result)) return;
  return text ? normalizeToolErrorText(text) : void 0;
}
function resolveMessageToolTarget(params) {
  const directTarget =
    normalizeOptionalString(params.args.target) ??
    normalizeOptionalString(params.args.to) ??
    normalizeOptionalString(params.args.channelId);
  if (directTarget) return directTarget;
  const aliases = params.providerId
    ? getChannelPlugin(params.providerId)?.actions?.messageActionTargetAliases?.[params.action]
        ?.deliveryTargetAliases
    : void 0;
  for (const alias of aliases ?? []) {
    const aliasTarget = normalizeOptionalStringifiedId(params.args[alias]);
    if (aliasTarget) return aliasTarget;
  }
  return params.currentMessagingTarget ?? params.currentChannelId;
}
function resolveMessagingToolThreadEvidence(params) {
  const threading = getChannelPlugin(params.providerId)?.threading;
  const autoThreadResolver = params.allowImplicitThread ? threading?.resolveAutoThreadId : void 0;
  const replyTransport = params.replyToId
    ? threading?.resolveReplyTransport?.({
        cfg: params.options?.config ?? {},
        accountId: params.accountId,
        threadId: params.threadId,
        replyToId: params.replyToId,
      })
    : void 0;
  const transportThreadId = normalizeOptionalStringifiedId(replyTransport?.threadId);
  const replyToThreadId =
    replyTransport?.threadId === null ? normalizeOptionalString(replyTransport.replyToId) : void 0;
  const explicitThreadId = transportThreadId ?? replyToThreadId ?? params.threadId;
  const currentChannelId = normalizeOptionalString(params.options?.currentChannelId);
  const currentMessagingTarget = normalizeOptionalString(params.options?.currentMessagingTarget);
  const currentThreadId = normalizeOptionalString(params.options?.currentThreadId);
  const replyToMode = params.options?.replyToMode ?? (currentThreadId ? "all" : void 0);
  const canResolveCurrentThread = Boolean(
    (currentChannelId || currentMessagingTarget) && currentThreadId,
  );
  const resolvedCurrentThreadId =
    !explicitThreadId && !params.threadSuppressed && autoThreadResolver && canResolveCurrentThread
      ? autoThreadResolver({
          cfg: params.options?.config ?? {},
          accountId: params.accountId,
          to: params.to,
          replyToId: params.replyToId,
          toolContext: {
            currentChannelId,
            currentMessagingTarget,
            currentThreadTs: currentThreadId,
            currentMessageId: params.options?.currentMessageId,
            replyToMode,
            hasRepliedRef: params.options?.hasRepliedRef,
          },
        })
      : void 0;
  const threadImplicit =
    !explicitThreadId &&
    !params.threadSuppressed &&
    Boolean(autoThreadResolver) &&
    (!canResolveCurrentThread || Boolean(resolvedCurrentThreadId));
  return {
    ...((explicitThreadId ?? resolvedCurrentThreadId)
      ? { threadId: explicitThreadId ?? resolvedCurrentThreadId }
      : {}),
    ...(threadImplicit ? { threadImplicit: true } : {}),
    ...(params.threadSuppressed ? { threadSuppressed: true } : {}),
  };
}
function extractMessagingToolSend(toolName, args, options) {
  const action = normalizeOptionalString(args.action) ?? "";
  const accountId = normalizeOptionalString(args.accountId);
  if (toolName === "message") {
    if (!isMessagingToolTargetEvidenceAction(toolName, args)) return;
    const providerRaw = normalizeOptionalString(args.provider) ?? "";
    const channelRaw = normalizeOptionalString(args.channel) ?? "";
    const providerHint = providerRaw || channelRaw;
    const providerId = providerHint ? normalizeChannelId(providerHint) : null;
    const toRaw = resolveMessageToolTarget({
      action,
      args,
      providerId,
      currentChannelId: options?.currentChannelId,
      currentMessagingTarget: options?.currentMessagingTarget,
    });
    if (!toRaw) return;
    const provider = providerId ?? normalizeOptionalLowercaseString(providerHint) ?? "message";
    const to = normalizeTargetForProvider(provider, toRaw);
    const pluginExtractionArgs = {
      ...args,
      to: toRaw,
    };
    const pluginExtracted = providerId
      ? getChannelPlugin(providerId)?.actions?.extractToolSend?.({ args: pluginExtractionArgs })
      : null;
    const resolvedAccountId = normalizeOptionalString(pluginExtracted?.accountId) ?? accountId;
    const threadId =
      normalizeOptionalString(pluginExtracted?.threadId) ?? normalizeOptionalString(args.threadId);
    const replyToId = normalizeOptionalString(args.replyTo);
    const outboundReplyToId = action === "send" ? replyToId : void 0;
    const threadSuppressed =
      pluginExtracted?.threadSuppressed === true ||
      args.topLevel === true ||
      args.threadId === null;
    return to
      ? {
          tool: toolName,
          provider,
          accountId: resolvedAccountId,
          to,
          ...(providerId
            ? resolveMessagingToolThreadEvidence({
                providerId,
                to,
                accountId: resolvedAccountId,
                threadId,
                replyToId: outboundReplyToId,
                allowImplicitThread: pluginExtracted
                  ? pluginExtracted.threadImplicit === true
                  : true,
                threadSuppressed,
                options,
              })
            : {
                ...(threadId ? { threadId } : {}),
                ...(threadSuppressed ? { threadSuppressed: true } : {}),
              }),
        }
      : void 0;
  }
  const providerId = normalizeChannelId(toolName);
  if (!providerId) return;
  const extracted = getChannelPlugin(providerId)?.actions?.extractToolSend?.({ args });
  if (!extracted?.to) return;
  const to = normalizeTargetForProvider(providerId, extracted.to);
  const threadId = normalizeOptionalString(extracted.threadId);
  const threadSuppressed = extracted.threadSuppressed === true;
  const extractedAccountId = normalizeOptionalString(extracted.accountId) ?? accountId;
  const nativeReplyToMode = options?.replyToMode;
  const nativeSingleUseMode = nativeReplyToMode === "first" || nativeReplyToMode === "batched";
  const canResolveNativeImplicitThread =
    extracted.threadImplicit === true &&
    nativeReplyToMode !== void 0 &&
    (!nativeSingleUseMode || options?.hasRepliedRef !== void 0);
  return to
    ? {
        tool: toolName,
        provider: providerId,
        accountId: extractedAccountId,
        to,
        ...resolveMessagingToolThreadEvidence({
          providerId,
          to,
          accountId: extractedAccountId,
          threadId,
          allowImplicitThread: canResolveNativeImplicitThread,
          threadSuppressed,
          options,
        }),
      }
    : void 0;
}
/** Reconciles pending send evidence with the provider's successful action result. */
function extractMessagingToolSendResult(pending, result) {
  const providerId = normalizeChannelId(pending.provider);
  const extracted = providerId
    ? getChannelPlugin(providerId)?.actions?.extractToolSendResult?.({
        result,
        send: {
          to: pending.to ?? "",
          accountId: pending.accountId,
          threadId: pending.threadId,
          threadImplicit: pending.threadImplicit,
          threadSuppressed: pending.threadSuppressed,
        },
      })
    : null;
  if (!extracted?.to) return pending;
  const threadEvidence =
    normalizeOptionalString(extracted.threadId) != null ||
    extracted.threadImplicit === true ||
    extracted.threadSuppressed === true
      ? extracted
      : pending;
  return {
    ...pending,
    ...extracted,
    accountId: normalizeOptionalString(extracted.accountId) ?? pending.accountId,
    to: normalizeTargetForProvider(providerId ?? pending.provider, extracted.to),
    threadId: normalizeOptionalString(threadEvidence.threadId),
    threadImplicit: threadEvidence.threadImplicit === true ? true : void 0,
    threadSuppressed: threadEvidence.threadSuppressed === true ? true : void 0,
  };
}
//#endregion
export {
  truncateLiveExecOutput as _,
  extractMessagingToolSend as a,
  extractToolErrorCode as c,
  extractToolResultText as d,
  filterToolResultMediaUrls as f,
  sanitizeToolResult as g,
  sanitizeToolArgs as h,
  collectMessagingMediaUrlsFromToolResult as i,
  extractToolErrorMessage as l,
  isToolResultTimedOut as m,
  capLiveExecResult as n,
  extractMessagingToolSendResult as o,
  isToolResultMediaTrusted as p,
  collectMessagingMediaUrlsFromRecord as r,
  extractMessagingToolSourceReplyPayload as s,
  buildToolLifecycleErrorResult as t,
  extractToolResultMediaArtifact as u,
};
