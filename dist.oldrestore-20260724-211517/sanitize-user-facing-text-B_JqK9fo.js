import {
  a as isGenericProviderInternalError,
  i as isCloudflareOrHtmlErrorPage,
  n as extractLeadingHttpStatus,
  o as parseApiErrorInfo,
  r as formatRawAssistantErrorForUi,
  s as parseApiErrorPayload,
} from "./assistant-error-format-G5Se-DL7.js";
import {
  c as stripLegacyBracketToolCallBlocks,
  l as stripMinimaxToolCallXml,
  m as stripFinalTags,
  o as stripAssistantInternalTraceLines,
  u as stripToolCallXmlTags,
} from "./assistant-visible-text-DV1Yognj.js";
import { f as stripInternalRuntimeContext } from "./internal-runtime-context-BW7WOTKc.js";
import { s as stripPlainTextToolCallBlocks } from "./src-CeNsIwRl.js";
import { t as stableStringify } from "./stable-stringify-Cd9_EGsU.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
import { r as stripInboundMetadata } from "./strip-inbound-meta-CbJ4Y6Dq.js";
//#region src/agents/exec-approval-result.ts
/**
 * Parses exec approval tool output and formats denial messages for users.
 */
const EXEC_COMPLETED_RE = /^exec completed:\s*([\s\S]*)$/i;
const APPROVAL_METADATA_SOURCE_RE = /^(?:gateway\s+id=|node=)/i;
function parseExecApprovalResultWithMetadata(raw, prefix, bodySeparator) {
  const normalizedRaw = normalizeLowercaseStringOrEmpty(raw);
  const normalizedPrefix = normalizeLowercaseStringOrEmpty(prefix);
  if (!normalizedRaw.startsWith(normalizedPrefix)) return null;
  const metadataStart = prefix.length;
  let depth = 1;
  let metadataEnd = -1;
  for (let index = metadataStart; index < raw.length; index += 1) {
    const char = raw[index];
    if (char === "(") {
      depth += 1;
      continue;
    }
    if (char === ")") {
      depth -= 1;
      if (depth === 0) {
        metadataEnd = index;
        break;
      }
    }
  }
  if (metadataEnd < 0) return null;
  const metadata = raw.slice(metadataStart, metadataEnd).trim();
  if (!APPROVAL_METADATA_SOURCE_RE.test(metadata)) return null;
  const remainder = raw.slice(metadataEnd + 1);
  if (bodySeparator === ":") {
    if (!remainder.startsWith(":")) return null;
    return {
      metadata,
      body: remainder.slice(1).trim(),
    };
  }
  if (remainder && !remainder.startsWith("\n")) return null;
  return {
    metadata,
    body: remainder.startsWith("\n") ? remainder.slice(1).trim() : "",
  };
}
function parseExecApprovalResultText(resultText) {
  const raw = resultText.trim();
  if (!raw)
    return {
      kind: "other",
      raw,
    };
  const deniedResult = parseExecApprovalResultWithMetadata(raw, "Exec denied (", ":");
  if (deniedResult)
    return {
      kind: "denied",
      raw,
      metadata: deniedResult.metadata,
      body: deniedResult.body,
    };
  const finishedResult = parseExecApprovalResultWithMetadata(raw, "Exec finished (", "\n");
  if (finishedResult)
    return {
      kind: "finished",
      raw,
      metadata: finishedResult.metadata,
      body: finishedResult.body,
    };
  const completedMatch = EXEC_COMPLETED_RE.exec(raw);
  if (completedMatch)
    return {
      kind: "completed",
      raw,
      body: completedMatch[1]?.trim() ?? "",
    };
  return {
    kind: "other",
    raw,
  };
}
function isExecDeniedResultText(resultText) {
  return parseExecApprovalResultText(resultText).kind === "denied";
}
function formatExecDeniedUserMessage(resultText) {
  const parsed = parseExecApprovalResultText(resultText);
  if (parsed.kind !== "denied") return null;
  const metadata = normalizeLowercaseStringOrEmpty(parsed.metadata);
  if (metadata.includes("approval-timeout")) return "Command did not run: approval timed out.";
  if (metadata.includes("user-denied")) return "Command did not run: approval was denied.";
  if (metadata.includes("allowlist-miss")) return "Command did not run: approval is required.";
  if (metadata.includes("approval-request-failed"))
    return "Command did not run: approval request failed.";
  if (metadata.includes("spawn-failed") || metadata.includes("invoke-failed"))
    return "Command did not run.";
  return "Command did not run.";
}
//#endregion
//#region src/agents/embedded-agent-helpers/failover-matches.ts
/**
 * Shared text-pattern matchers for failover, auth, billing, and rate-limit errors.
 */
const PERIODIC_USAGE_LIMIT_RE =
  /\b(?:daily|weekly|monthly)(?:\/(?:daily|weekly|monthly))* (?:usage )?limit(?:s)?(?: (?:exhausted|reached|exceeded))?\b/i;
const HIGH_CONFIDENCE_AUTH_PERMANENT_PATTERNS = [
  /api[_ ]?key[_ ]?(?:revoked|deactivated|deleted)/i,
  /deactivated[_ ]workspace/i,
  "key has been disabled",
  "key has been revoked",
  "account has been deactivated",
  "not allowed for this organization",
];
const AMBIGUOUS_AUTH_ERROR_PATTERNS = [
  /invalid[_ ]?api[_ ]?key/,
  /could not (?:authenticate|validate).*(?:api[_ ]?key|credentials)/i,
  "permission_error",
];
const COMMON_AUTH_ERROR_PATTERNS = [
  "incorrect api key",
  "invalid token",
  "authentication",
  "re-authenticate",
  "oauth token refresh failed",
  "unauthorized",
  "forbidden",
  "access denied",
  "insufficient permissions",
  "insufficient permission",
  /missing scopes?:/i,
  "expired",
  "token has expired",
  /\b401\b/,
  /\b403\b/,
  "no credentials found",
  "no api key found",
  /\bfailed to (?:extract|parse|validate|decode)\b.*\btoken\b/,
];
const CJK_AUTH_ERROR_PATTERNS = [
  "无权访问",
  "认证失败",
  "鉴权失败",
  "密钥无效",
  "apikey 无效",
  /(?:当前\s*ak|ce-011).*?(?:违规请求|禁止访问)|(?:违规请求|禁止访问).*?(?:当前\s*ak|ce-011)/i,
  /\bce-011\b/i,
];
const ZAI_BILLING_CODE_1311_RE = /"code"\s*:\s*1311\b/;
const ZAI_AUTH_CODE_1113_RE = /"code"\s*:\s*1113\b/;
const VOLCENGINE_INVALID_SUBSCRIPTION_RE = /"code"\s*:\s*"InvalidSubscription"/i;
const STATUS_INTERNAL_SERVER_ERROR_RE = /\bstatus:\s*internal server error\b/i;
const STATUS_INTERNAL_SERVER_ERROR_WITH_500_RE =
  /^(?=[\s\S]*\bstatus:\s*internal server error\b)(?=[\s\S]*\bcode["']?\s*[:=]\s*500\b)/i;
const HTTP_5XX_STATUS_RE = /\bHTTP\s+5\d\d\b/i;
const ZAI_AUTH_ERROR_PATTERNS = [ZAI_AUTH_CODE_1113_RE];
const ERROR_PATTERNS = {
  rateLimit: [
    /rate[_ ]limit|too many requests|429/,
    /too many (?:concurrent )?requests/i,
    /throttling(?:exception)?/i,
    "model_cooldown",
    "exceeded your current quota",
    "resource has been exhausted",
    "quota exceeded",
    "resource_exhausted",
    "throttlingexception",
    "throttling_exception",
    "throttled",
    "throttling",
    "usage limit",
    /\btpm\b/i,
    "tokens per minute",
    "tokens per day",
    "请求过于频繁",
    "调用频率",
    "频率限制",
    "配额不足",
    "配额已用尽",
    "额度不足",
    "额度已用尽",
  ],
  overloaded: [
    /overloaded_error|"type"\s*:\s*"overloaded_error"/i,
    "overloaded",
    /\b(?:selected\s+)?model\s+(?:is\s+)?at capacity\b/i,
    /service[_ ]unavailable.*(?:overload|capacity|high[_ ]demand)|(?:overload|capacity|high[_ ]demand).*service[_ ]unavailable/i,
    "high demand",
    "high load",
    "服务过载",
    "当前负载过高",
    "访问量过大",
  ],
  serverError: [
    "an error occurred while processing",
    "internal server error",
    "internal_error",
    "server_error",
    "service temporarily unavailable",
    "service_unavailable",
    "bad gateway",
    "gateway timeout",
    "upstream error",
    "upstream connect error",
    "connection reset",
    "内部错误",
    "服务器错误",
    "服务器内部错误",
    "系统错误",
    "系统繁忙",
    "系统异常",
  ],
  timeout: [
    "timeout",
    "timed out",
    "service unavailable",
    "deadline exceeded",
    "context deadline exceeded",
    /^(?=[\s\S]*\bgot status:\s*internal\b)(?=[\s\S]*\bcode["']?\s*[:=]\s*500\b)/i,
    /^(?=[\s\S]*["']status["']\s*:\s*["']internal["'])(?=[\s\S]*["']code["']\s*:\s*500\b)/i,
    "connection error",
    "network error",
    "network request failed",
    "fetch failed",
    "socket hang up",
    "网络错误",
    "网络异常",
    "服务暂时不可用",
    "服务繁忙",
    "请求超时",
    "连接超时",
    "连接错误",
    /\beconn(?:refused|reset|aborted)\b/i,
    /\benetunreach\b/i,
    /\behostunreach\b/i,
    /\behostdown\b/i,
    /\benetreset\b/i,
    /\betimedout\b/i,
    /\besockettimedout\b/i,
    /\bepipe\b/i,
    /\benotfound\b/i,
    /\beai_again\b/i,
    /without sending (?:any )?chunks?/i,
    /\bstop reason:\s*(?:abort|error|malformed_response|network_error)\b/i,
    /\breason:\s*(?:abort|error|malformed_response|network_error)\b/i,
    /\bunhandled stop reason:\s*(?:abort|error|malformed_response|network_error)\b/i,
    /\bfinish_reason:\s*(?:abort|error|malformed_response|network_error)\b/i,
    /\boperation was aborted\b/i,
    /\bstream (?:was )?(?:closed|aborted)\b/i,
    /^terminated$/i,
    /^stream_read_error$/i,
    /\bund_err_(?:socket|connect|headers?|body|req_content_length_mismatch|aborted|closed)\b/i,
    /^request failed$/i,
    /\brequest failed after repeated internal retries\b/i,
    /^llm request failed\.$/i,
  ],
  billing: [
    /["']?(?:status|code)["']?\s*[:=]\s*402\b|\bhttp\s*402\b|\berror(?:\s+code)?\s*[:=]?\s*402\b|\b(?:got|returned|received)\s+(?:a\s+)?402\b|^\s*402\s+payment/i,
    "payment required",
    "insufficient credits",
    /used\s+all\s+available\s+credits/i,
    /(?:monthly\s+)?spend(?:ing)?\s+limit/i,
    /insufficient[_ ]quota/i,
    "credit balance",
    "plans & billing",
    /insufficient[_ ]balance/i,
    /\binsufficient\s+\w+\s+balance\b/i,
    "insufficient usd or diem balance",
    /requires?\s+more\s+credits/i,
    /out of extra usage/i,
    /draw from your extra usage/i,
    /extra usage is required(?: for long context requests)?/i,
    "余额不足",
    "账户余额不足",
    "欠费",
    "账户已欠费",
    VOLCENGINE_INVALID_SUBSCRIPTION_RE,
    /\bdoes not have a valid coding\s*plan subscription\b/i,
    ZAI_BILLING_CODE_1311_RE,
    /\bcurrent\s+subscription\s+plan\b.*\b(?:does\s+not|doesn't|not)\b.*\binclude\s+access\b/i,
    /\bmodel\b.*\bnot\s+available\b.*\bcurrent\s+plan\b/i,
  ],
  authPermanent: HIGH_CONFIDENCE_AUTH_PERMANENT_PATTERNS,
  auth: [
    ...AMBIGUOUS_AUTH_ERROR_PATTERNS,
    ...COMMON_AUTH_ERROR_PATTERNS,
    ...ZAI_AUTH_ERROR_PATTERNS,
    ...CJK_AUTH_ERROR_PATTERNS,
  ],
  format: [
    "string should match pattern",
    "tool_use.id",
    "tool_use_id",
    "messages.1.content.1.tool_use.id",
    "invalid request format",
    /tool call id was.*must be/i,
    "does not support assistant message prefill",
    "conversation must end with a user message",
    /agent harness .* does not support .*provider is not one of/i,
  ],
};
const BILLING_ERROR_HEAD_RE =
  /^(?:error[:\s-]+)?billing(?:\s+error)?(?:[:\s-]+|$)|^(?:error[:\s-]+)?(?:credit balance|insufficient credits?|payment required|http\s*402\b)/i;
const BILLING_ERROR_HARD_402_RE =
  /["']?(?:status|code)["']?\s*[:=]\s*402\b|\bhttp\s*402\b|\berror(?:\s+code)?\s*[:=]?\s*402\b|^\s*402\s+payment/i;
const BILLING_ERROR_MAX_LENGTH = 512;
function matchesErrorPatterns(raw, patterns) {
  if (!raw) return false;
  const value = normalizeLowercaseStringOrEmpty(raw);
  return patterns.some((pattern) =>
    pattern instanceof RegExp ? pattern.test(value) : value.includes(pattern),
  );
}
function matchesErrorPatternGroups(raw, groups) {
  return groups.some((patterns) => matchesErrorPatterns(raw, patterns));
}
function matchesFormatErrorPattern(raw) {
  return matchesErrorPatterns(raw, ERROR_PATTERNS.format);
}
function isRateLimitErrorMessage(raw) {
  return matchesErrorPatterns(raw, ERROR_PATTERNS.rateLimit);
}
function isTimeoutErrorMessage(raw) {
  return matchesErrorPatterns(raw, ERROR_PATTERNS.timeout);
}
function isPeriodicUsageLimitErrorMessage(raw) {
  return PERIODIC_USAGE_LIMIT_RE.test(raw);
}
function isBillingErrorMessage(raw) {
  const value = normalizeLowercaseStringOrEmpty(raw);
  if (!value) return false;
  if (raw.length > BILLING_ERROR_MAX_LENGTH)
    return (
      BILLING_ERROR_HARD_402_RE.test(value) ||
      ZAI_BILLING_CODE_1311_RE.test(value) ||
      VOLCENGINE_INVALID_SUBSCRIPTION_RE.test(value)
    );
  if (matchesErrorPatterns(value, ERROR_PATTERNS.billing)) return true;
  if (!BILLING_ERROR_HEAD_RE.test(raw)) return false;
  return (
    value.includes("upgrade") ||
    value.includes("credits") ||
    value.includes("payment") ||
    value.includes("purchase") ||
    value.includes("subscription") ||
    value.includes("plan")
  );
}
function isAuthPermanentErrorMessage(raw) {
  return matchesErrorPatternGroups(raw, [HIGH_CONFIDENCE_AUTH_PERMANENT_PATTERNS]);
}
function isAuthErrorMessage(raw) {
  return matchesErrorPatternGroups(raw, [
    AMBIGUOUS_AUTH_ERROR_PATTERNS,
    COMMON_AUTH_ERROR_PATTERNS,
    ZAI_AUTH_ERROR_PATTERNS,
    CJK_AUTH_ERROR_PATTERNS,
  ]);
}
function isOverloadedErrorMessage(raw) {
  return matchesErrorPatterns(raw, ERROR_PATTERNS.overloaded);
}
function isServerErrorMessage(raw) {
  const value = normalizeLowercaseStringOrEmpty(raw);
  if (!value) return false;
  if (STATUS_INTERNAL_SERVER_ERROR_WITH_500_RE.test(value) || HTTP_5XX_STATUS_RE.test(value))
    return true;
  const scrubbed = value.replace(STATUS_INTERNAL_SERVER_ERROR_RE, "").trim();
  if (scrubbed === "") return true;
  return matchesErrorPatterns(scrubbed, ERROR_PATTERNS.serverError);
}
//#endregion
//#region src/shared/chat-content.ts
/** Coerces arbitrary provider content values into displayable text without throwing. */
function coerceChatContentText(value) {
  if (typeof value === "string") return value;
  if (value == null) return "";
  if (
    typeof value === "number" ||
    typeof value === "boolean" ||
    typeof value === "bigint" ||
    typeof value === "symbol"
  )
    return String(value);
  if (typeof value === "object")
    try {
      return JSON.stringify(value) ?? "";
    } catch {
      return "";
    }
  return "";
}
/** Extracts normalized plain text from string content or OpenAI-style text blocks. */
function extractTextFromChatContent(content, opts) {
  const normalizeText = opts?.normalizeText ?? ((text) => text.replace(/\s+/g, " ").trim());
  const joinWith = opts?.joinWith ?? " ";
  const sanitize = (text) => {
    const raw = coerceChatContentText(text);
    return coerceChatContentText(opts?.sanitizeText ? opts.sanitizeText(raw) : raw);
  };
  const normalize = (text) => coerceChatContentText(normalizeText(coerceChatContentText(text)));
  if (typeof content === "string") {
    const normalized = normalize(sanitize(content));
    return normalized ? normalized : null;
  }
  if (!Array.isArray(content)) return null;
  const chunks = [];
  for (const block of content) {
    if (!block || typeof block !== "object") continue;
    if (block.type !== "text") continue;
    const text = block.text;
    const value = sanitize(text);
    if (value.trim()) chunks.push(value);
  }
  const joined = normalize(chunks.join(joinWith));
  return joined ? joined : null;
}
//#endregion
//#region src/agents/embedded-agent-helpers/sanitize-user-facing-text.ts
/**
 * Converts raw provider/transport errors into concise user-facing copy.
 */
/** Format the billing failure copy with optional provider/model context.
 *
 * When `authMode` is `"oauth"` or `"token"` (i.e. Anthropic Max or a static
 * bearer-token subscription) the user has no API key to top up, so we emit
 * neutral copy that directs them to check their account instead (#80877).
 */
function formatBillingErrorMessage(provider, model, authMode) {
  const providerName = provider?.trim();
  const modelName = model?.trim();
  const providerLabel =
    providerName && modelName ? `${providerName} (${modelName})` : providerName || void 0;
  if (authMode === "oauth" || authMode === "token") {
    if (providerLabel)
      return `⚠️ ${providerLabel} returned a billing error — check your account for subscription or usage limits, then try again.`;
    return "⚠️ API provider returned a billing error — check your account for subscription or usage limits, then try again.";
  }
  if (providerLabel)
    return `⚠️ ${providerLabel} returned a billing error — your API key has run out of credits or has an insufficient balance. Check your ${providerName} billing dashboard and top up or switch to a different API key.`;
  return "⚠️ API provider returned a billing error — your API key has run out of credits or has an insufficient balance. Check your provider's billing dashboard and top up or switch to a different API key.";
}
const BILLING_ERROR_USER_MESSAGE = formatBillingErrorMessage();
const RATE_LIMIT_ERROR_USER_MESSAGE = "⚠️ API rate limit reached. Please try again later.";
const MODEL_CAPACITY_ERROR_USER_MESSAGE =
  "⚠️ Selected model is at capacity. Try a different model, or wait and retry.";
const OVERLOADED_ERROR_USER_MESSAGE =
  "The AI service is temporarily overloaded. Please try again in a moment.";
const TOOL_CALLS_OMITTED_PLACEHOLDER_LINE_RE = /^[ \t]*\[tool calls omitted\][ \t]*$/i;
const ERROR_PREFIX_RE =
  /^(?:error|(?:[a-z][\w-]*\s+)?api\s*error|openai\s*error|anthropic\s*error|gateway\s*error|codex\s*error|request failed|failed|exception)(?:\s+\d{3})?[:\s-]+/i;
const CONTEXT_OVERFLOW_ERROR_HEAD_RE =
  /^(?:context overflow:|request_too_large\b|request size exceeds\b|request exceeds the maximum size\b|context length exceeded\b|maximum context length\b|prompt is too long\b|exceeds model context window\b)/i;
const HTTP_ERROR_HINTS = [
  "error",
  "bad request",
  "not found",
  "unauthorized",
  "forbidden",
  "internal server",
  "service unavailable",
  "gateway",
  "rate limit",
  "overloaded",
  "timeout",
  "timed out",
  "invalid",
  "too many requests",
  "permission",
];
const RATE_LIMIT_SPECIFIC_HINT_RE =
  /\bmin(ute)?s?\b|\bhours?\b|\bseconds?\b|\btry again in\b|\bresets?\b|\bplan\b|\bquota\b/i;
const MODEL_CAPACITY_ERROR_RE = /\b(?:selected\s+)?model\s+(?:is\s+)?at capacity\b/i;
const NON_ERROR_PROVIDER_PAYLOAD_MAX_LENGTH = 16384;
const NON_ERROR_PROVIDER_PAYLOAD_PREFIX_RE = /^codex\s*error(?:\s+\d{3})?[:\s-]+/i;
function extractProviderRateLimitMessage(raw) {
  const withoutPrefix = raw.replace(ERROR_PREFIX_RE, "").trim();
  const candidate =
    (parseApiErrorInfo(raw) ?? parseApiErrorInfo(withoutPrefix))?.message ??
    (extractLeadingHttpStatus(withoutPrefix)?.rest || withoutPrefix);
  if (!candidate || !RATE_LIMIT_SPECIFIC_HINT_RE.test(candidate)) return;
  if (isCloudflareOrHtmlErrorPage(withoutPrefix)) return;
  const trimmed = candidate.trim();
  if (
    trimmed.length > 300 ||
    trimmed.startsWith("{") ||
    /^(?:<!doctype\s+html\b|<html\b)/i.test(trimmed)
  )
    return;
  return `⚠️ ${trimmed}`;
}
function formatRateLimitOrOverloadedErrorCopy(raw) {
  if (MODEL_CAPACITY_ERROR_RE.test(raw)) return MODEL_CAPACITY_ERROR_USER_MESSAGE;
  const isRateLimit = isRateLimitErrorMessage(raw);
  if (isRateLimit) {
    const providerMessage = extractProviderRateLimitMessage(raw);
    if (providerMessage) return providerMessage;
  }
  if (isOverloadedErrorMessage(raw)) return OVERLOADED_ERROR_USER_MESSAGE;
  if (isRateLimit) return RATE_LIMIT_ERROR_USER_MESSAGE;
}
function formatTransportErrorCopy(raw) {
  if (!raw) return;
  if (isCloudflareOrHtmlErrorPage(raw)) return;
  const lower = normalizeLowercaseStringOrEmpty(raw);
  if (
    /\beconnrefused\b/i.test(raw) ||
    lower.includes("connection refused") ||
    lower.includes("actively refused")
  )
    return "LLM request failed: connection refused by the provider endpoint.";
  if (
    /\beconnreset\b|\beconnaborted\b|\benetreset\b|\bepipe\b/i.test(raw) ||
    lower.includes("socket hang up") ||
    lower.includes("connection reset") ||
    lower.includes("connection aborted")
  )
    return "LLM request failed: network connection was interrupted.";
  if (
    /\benotfound\b|\beai_again\b/i.test(raw) ||
    lower.includes("getaddrinfo") ||
    lower.includes("no such host") ||
    lower.includes("dns")
  )
    return "LLM request failed: DNS lookup for the provider endpoint failed.";
  if (
    /\benetunreach\b|\behostunreach\b|\behostdown\b/i.test(raw) ||
    lower.includes("network is unreachable") ||
    lower.includes("host is unreachable")
  )
    return "LLM request failed: the provider endpoint is unreachable from this host.";
  if (
    lower.includes("fetch failed") ||
    lower.includes("connection error") ||
    lower.includes("network request failed")
  )
    return "LLM request failed: network connection error.";
  if (raw.includes("网络错误") || raw.includes("网络异常") || raw.includes("连接错误"))
    return "LLM request failed: provider reported a network error.";
}
function formatDiskSpaceErrorCopy(raw) {
  if (!raw) return;
  const lower = normalizeLowercaseStringOrEmpty(raw);
  if (
    /\benospc\b/i.test(raw) ||
    lower.includes("no space left on device") ||
    lower.includes("disk full")
  )
    return "OpenClaw could not write local session data because the disk is full. Free some disk space and try again.";
}
function isReasoningConstraintErrorMessage(raw) {
  if (!raw) return false;
  const lower = normalizeLowercaseStringOrEmpty(raw);
  return (
    lower.includes("reasoning is mandatory") ||
    lower.includes("reasoning is required") ||
    lower.includes("requires reasoning") ||
    (lower.includes("reasoning") && lower.includes("cannot be disabled"))
  );
}
function isInvalidStreamingEventOrderError(raw) {
  if (!raw) return false;
  const lower = normalizeLowercaseStringOrEmpty(raw);
  return (
    lower.includes("unexpected event order") &&
    lower.includes("message_start") &&
    lower.includes("message_stop")
  );
}
function isStreamingJsonParseError(raw) {
  if (!raw) return false;
  if (raw.trim() === "OpenClaw transport error: malformed_streaming_fragment") return true;
  return false;
}
function hasRateLimitTpmHint(raw) {
  const lower = normalizeLowercaseStringOrEmpty(raw);
  return /\btpm\b/i.test(lower) || lower.includes("tokens per minute");
}
function looksLikeGenericContextOverflowError(raw) {
  if (!raw) return false;
  const lower = normalizeLowercaseStringOrEmpty(raw);
  const hasRequestSizeExceeds = lower.includes("request size exceeds");
  const hasContextWindow =
    lower.includes("context window") ||
    lower.includes("context length") ||
    lower.includes("maximum context length");
  return (
    lower.includes("request_too_large") ||
    (lower.includes("invalid_argument") && lower.includes("maximum number of tokens")) ||
    lower.includes("request exceeds the maximum size") ||
    lower.includes("context length exceeded") ||
    lower.includes("maximum context length") ||
    lower.includes("prompt is too long") ||
    lower.includes("prompt too long") ||
    lower.includes("exceeds model context window") ||
    lower.includes("model token limit") ||
    (lower.includes("input exceeds") && lower.includes("maximum number of tokens")) ||
    (hasRequestSizeExceeds && hasContextWindow) ||
    lower.includes("context overflow:") ||
    lower.includes("exceed context limit") ||
    lower.includes("exceeds the model's maximum context") ||
    (lower.includes("max_tokens") && lower.includes("exceed") && lower.includes("context")) ||
    (lower.includes("input length") && lower.includes("exceed") && lower.includes("context")) ||
    (lower.includes("413") && lower.includes("too large")) ||
    lower.includes("context_window_exceeded") ||
    raw.includes("上下文过长") ||
    raw.includes("上下文超出") ||
    raw.includes("上下文长度超") ||
    raw.includes("超出最大上下文") ||
    raw.includes("请压缩上下文")
  );
}
function shouldRewriteContextOverflowText(raw) {
  if (hasRateLimitTpmHint(raw) || isReasoningConstraintErrorMessage(raw)) return false;
  if (!looksLikeGenericContextOverflowError(raw)) return false;
  return (
    isRawApiErrorPayload(raw) ||
    isLikelyHttpErrorText(raw) ||
    ERROR_PREFIX_RE.test(raw) ||
    CONTEXT_OVERFLOW_ERROR_HEAD_RE.test(raw)
  );
}
function getApiErrorPayloadFingerprint(raw) {
  if (!raw) return null;
  const payload = parseApiErrorPayload(raw);
  if (!payload) return null;
  return stableStringify(payload);
}
function isRawApiErrorPayload(raw) {
  return getApiErrorPayloadFingerprint(raw) !== null;
}
function isLikelyProviderErrorType(type) {
  const normalized = normalizeOptionalLowercaseString(type);
  if (!normalized) return false;
  return normalized.endsWith("_error");
}
function shouldRewriteRawPayloadWithoutErrorContext(raw) {
  if (raw.length > NON_ERROR_PROVIDER_PAYLOAD_MAX_LENGTH) return false;
  if (!NON_ERROR_PROVIDER_PAYLOAD_PREFIX_RE.test(raw)) return false;
  const info = parseApiErrorInfo(raw);
  if (!info) return false;
  if (isLikelyProviderErrorType(info.type)) return true;
  if (info.httpCode) {
    const parsedCode = Number(info.httpCode);
    if (Number.isFinite(parsedCode) && parsedCode >= 400) return true;
  }
  return false;
}
function stripFinalTagsFromText(text) {
  const normalized = coerceChatContentText(text);
  if (!normalized) return normalized;
  return stripFinalTags(normalized);
}
function stripToolCallsOmittedPlaceholderLines(text) {
  let result = "";
  let start = 0;
  while (start < text.length) {
    const newlineIndex = text.indexOf("\n", start);
    const end = newlineIndex === -1 ? text.length : newlineIndex + 1;
    const chunk = text.slice(start, end);
    const line = chunk.endsWith("\n") ? chunk.slice(0, -1).replace(/\r$/, "") : chunk;
    if (!TOOL_CALLS_OMITTED_PLACEHOLDER_LINE_RE.test(line)) result += chunk;
    start = end;
  }
  return result;
}
function collapseConsecutiveDuplicateBlocks(text) {
  const trimmed = text.trim();
  if (!trimmed) return text;
  const blocks = trimmed.split(/\n{2,}/);
  if (blocks.length < 2) return text;
  const normalizeBlock = (value) => value.trim().replace(/\s+/g, " ");
  const result = [];
  let lastNormalized = null;
  for (const block of blocks) {
    const normalized = normalizeBlock(block);
    if (lastNormalized && normalized === lastNormalized) continue;
    result.push(block.trim());
    lastNormalized = normalized;
  }
  if (result.length === blocks.length) return text;
  return result.join("\n\n");
}
function isLikelyHttpErrorText(raw) {
  if (isCloudflareOrHtmlErrorPage(raw)) return true;
  const status = extractLeadingHttpStatus(raw);
  if (!status) return false;
  if (status.code < 400) return false;
  const message = normalizeLowercaseStringOrEmpty(status.rest);
  return HTTP_ERROR_HINTS.some((hint) => message.includes(hint));
}
function sanitizeUserFacingText(text, opts) {
  const raw = coerceChatContentText(text);
  if (!raw) return raw;
  const errorContext = opts?.errorContext ?? false;
  const withoutPlaceholder = stripToolCallsOmittedPlaceholderLines(
    stripToolCallXmlTags(
      stripMinimaxToolCallXml(
        stripInboundMetadata(stripInternalRuntimeContext(stripFinalTagsFromText(raw))),
      ),
      { stripFunctionCallsXmlPayloads: true },
    ),
  );
  const withoutToolCallBlocks = stripPlainTextToolCallBlocks(
    stripLegacyBracketToolCallBlocks(
      errorContext ? stripAssistantInternalTraceLines(withoutPlaceholder) : withoutPlaceholder,
    ),
  );
  const trimmed = withoutToolCallBlocks.trim();
  if (!trimmed) return "";
  if (!errorContext && shouldRewriteRawPayloadWithoutErrorContext(trimmed))
    return formatRawAssistantErrorForUi(trimmed);
  if (errorContext) {
    const execDeniedMessage = formatExecDeniedUserMessage(trimmed);
    if (execDeniedMessage) return execDeniedMessage;
    const diskSpaceCopy = formatDiskSpaceErrorCopy(trimmed);
    if (diskSpaceCopy) return diskSpaceCopy;
    if (/incorrect role information|roles must alternate/i.test(trimmed))
      return "Message ordering conflict - please try again. If this persists, use /new to start a fresh session.";
    if (shouldRewriteContextOverflowText(trimmed))
      return "Context overflow: prompt too large for the model. Try /reset (or /new) to start a fresh session, or use a larger-context model.";
    if (isBillingErrorMessage(trimmed)) return BILLING_ERROR_USER_MESSAGE;
    if (isGenericProviderInternalError(trimmed)) return formatRawAssistantErrorForUi(trimmed);
    if (isInvalidStreamingEventOrderError(trimmed))
      return "LLM request failed: provider returned an invalid streaming response. Please try again.";
    if (isRawApiErrorPayload(trimmed) || isLikelyHttpErrorText(trimmed))
      return formatRawAssistantErrorForUi(trimmed);
    if (isStreamingJsonParseError(trimmed))
      return "LLM streaming response contained a malformed fragment. Please try again.";
    if (ERROR_PREFIX_RE.test(trimmed)) {
      const prefixedCopy = formatRateLimitOrOverloadedErrorCopy(trimmed);
      if (prefixedCopy) return prefixedCopy;
      const transportCopy = formatTransportErrorCopy(trimmed);
      if (transportCopy) return transportCopy;
      if (isTimeoutErrorMessage(trimmed)) return "LLM request timed out.";
      return formatRawAssistantErrorForUi(trimmed);
    }
  }
  return collapseConsecutiveDuplicateBlocks(withoutToolCallBlocks.replace(/^(?:[ \t]*\r?\n)+/, ""));
}
//#endregion
export {
  formatExecDeniedUserMessage as C,
  matchesFormatErrorPattern as S,
  parseExecApprovalResultText as T,
  isOverloadedErrorMessage as _,
  formatTransportErrorCopy as a,
  isServerErrorMessage as b,
  isLikelyHttpErrorText as c,
  sanitizeUserFacingText as d,
  coerceChatContentText as f,
  isBillingErrorMessage as g,
  isAuthPermanentErrorMessage as h,
  formatRateLimitOrOverloadedErrorCopy as i,
  isRawApiErrorPayload as l,
  isAuthErrorMessage as m,
  formatBillingErrorMessage as n,
  getApiErrorPayloadFingerprint as o,
  extractTextFromChatContent as p,
  formatDiskSpaceErrorCopy as r,
  isInvalidStreamingEventOrderError as s,
  BILLING_ERROR_USER_MESSAGE as t,
  isStreamingJsonParseError as u,
  isPeriodicUsageLimitErrorMessage as v,
  isExecDeniedResultText as w,
  isTimeoutErrorMessage as x,
  isRateLimitErrorMessage as y,
};
