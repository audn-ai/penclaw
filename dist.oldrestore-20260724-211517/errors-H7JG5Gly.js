import {
  _ as parseStrictFiniteNumber,
  c as asFiniteNumberInRange,
} from "./number-coercion-CJQ8TR--.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import "./number-runtime-B-n-wjMn.js";
import "./string-coerce-runtime-BUe4iD0r.js";
//#region extensions/msteams/src/errors.ts
const MAX_SAFE_RETRY_AFTER_SECONDS = Number.MAX_SAFE_INTEGER / 1e3;
function formatUnknownError(err) {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  if (err === null) return "null";
  if (err === void 0) return "undefined";
  if (typeof err === "number" || typeof err === "boolean" || typeof err === "bigint")
    return String(err);
  if (typeof err === "symbol") return err.description ?? err.toString();
  if (typeof err === "function") return err.name ? `[function ${err.name}]` : "[function]";
  try {
    return JSON.stringify(err) ?? "unknown error";
  } catch {
    return "unknown error";
  }
}
function extractStatusCode(err) {
  if (!isRecord(err)) return null;
  const parseStatusCode = (value) => {
    if (typeof value === "number")
      return Number.isInteger(value) && value >= 100 && value <= 599 ? value : null;
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (!/^\d{3}$/.test(trimmed)) return null;
      const parsed = Number(trimmed);
      return parsed >= 100 && parsed <= 599 ? parsed : null;
    }
    return null;
  };
  const directStatus = parseStatusCode(err.statusCode ?? err.status);
  if (directStatus !== null) return directStatus;
  const response = err.response;
  if (isRecord(response)) {
    const responseStatus = parseStatusCode(response.status);
    if (responseStatus !== null) return responseStatus;
  }
  return null;
}
function extractErrorCode(err) {
  if (!isRecord(err)) return null;
  const direct = err.code;
  if (typeof direct === "string" && direct.trim()) return direct;
  const response = err.response;
  if (!isRecord(response)) return null;
  const body = response.body;
  if (isRecord(body)) {
    const error = body.error;
    if (isRecord(error) && typeof error.code === "string" && error.code.trim()) return error.code;
  }
  return null;
}
function extractRetryAfterMs(err) {
  if (!isRecord(err)) return null;
  const directMs = asFiniteNumberInRange(err.retryAfterMs ?? err.retry_after_ms, {
    min: 0,
    max: Number.MAX_SAFE_INTEGER,
  });
  if (directMs !== void 0) return directMs;
  const retryAfter = err.retryAfter ?? err.retry_after;
  const retryAfterSeconds = asFiniteNumberInRange(retryAfter, {
    min: 0,
    max: MAX_SAFE_RETRY_AFTER_SECONDS,
  });
  if (retryAfterSeconds !== void 0) return retryAfterSeconds * 1e3;
  if (typeof retryAfter === "string") {
    const parsed = parseNonNegativeRetryAfterSeconds(retryAfter);
    if (parsed !== void 0) return parsed * 1e3;
  }
  const response = err.response;
  if (!isRecord(response)) return null;
  const headers = response.headers;
  if (!headers) return null;
  if (isRecord(headers)) {
    const raw = headers["retry-after"] ?? headers["Retry-After"];
    if (typeof raw === "string") {
      const parsed = parseNonNegativeRetryAfterSeconds(raw);
      if (parsed !== void 0) return parsed * 1e3;
    }
  }
  if (
    typeof headers === "object" &&
    headers !== null &&
    "get" in headers &&
    typeof headers.get === "function"
  ) {
    const raw = headers.get("retry-after");
    if (raw) {
      const parsed = parseNonNegativeRetryAfterSeconds(raw);
      if (parsed !== void 0) return parsed * 1e3;
    }
  }
  return null;
}
function parseNonNegativeRetryAfterSeconds(raw) {
  const trimmed = raw.trim();
  if (!/^\d+(?:\.\d+)?$/.test(trimmed)) return;
  return asFiniteNumberInRange(parseStrictFiniteNumber(trimmed), {
    min: 0,
    max: MAX_SAFE_RETRY_AFTER_SECONDS,
  });
}
/**
 * Classify outbound send errors for safe retries and actionable logs.
 *
 * Important: We only mark errors as retryable when we have an explicit HTTP
 * status code that indicates the message was not accepted (e.g. 429, 5xx).
 * For transport-level errors where delivery is ambiguous, we prefer to avoid
 * retries to reduce the chance of duplicate posts.
 */
function classifyMSTeamsSendError(err) {
  const statusCode = extractStatusCode(err);
  const retryAfterMs = extractRetryAfterMs(err);
  const errorCode = extractErrorCode(err) ?? void 0;
  if (statusCode === 401)
    return {
      kind: "auth",
      statusCode,
      errorCode,
    };
  if (statusCode === 403) {
    if (errorCode === "ContentStreamNotAllowed")
      return {
        kind: "permanent",
        statusCode,
        errorCode,
      };
    return {
      kind: "auth",
      statusCode,
      errorCode,
    };
  }
  if (statusCode === 429)
    return {
      kind: "throttled",
      statusCode,
      retryAfterMs: retryAfterMs ?? void 0,
      errorCode,
    };
  if (statusCode === 408 || (statusCode != null && statusCode >= 500))
    return {
      kind: "transient",
      statusCode,
      retryAfterMs: retryAfterMs ?? void 0,
      errorCode,
    };
  if (statusCode != null && statusCode >= 400)
    return {
      kind: "permanent",
      statusCode,
      errorCode,
    };
  if (statusCode == null) {
    const networkCode = isRecord(err) && typeof err.code === "string" ? err.code : null;
    if (
      networkCode === "ECONNREFUSED" ||
      networkCode === "ENOTFOUND" ||
      networkCode === "EHOSTUNREACH" ||
      networkCode === "ETIMEDOUT" ||
      networkCode === "ECONNRESET"
    )
      return {
        kind: "network",
        errorCode: networkCode,
      };
  }
  return {
    kind: "unknown",
    statusCode: statusCode ?? void 0,
    retryAfterMs: retryAfterMs ?? void 0,
    errorCode,
  };
}
/**
 * Detect whether an error is caused by a revoked Proxy.
 *
 * The Bot Framework SDK wraps TurnContext in a Proxy that is revoked once the
 * turn handler returns.  Any later access (e.g. from a debounced callback)
 * throws a TypeError whose message contains the distinctive "proxy that has
 * been revoked" string.
 */
function isRevokedProxyError(err) {
  if (!(err instanceof TypeError)) return false;
  return /proxy that has been revoked/i.test(err.message);
}
function formatMSTeamsSendErrorHint(classification) {
  if (classification.kind === "auth")
    return "check msteams appId/appPassword/tenantId (or env vars MSTEAMS_APP_ID/MSTEAMS_APP_PASSWORD/MSTEAMS_TENANT_ID)";
  if (classification.errorCode === "ContentStreamNotAllowed")
    return "Teams expired the content stream; stop streaming earlier and fall back to normal message delivery";
  if (classification.kind === "throttled") return "Teams throttled the bot; backing off may help";
  if (classification.kind === "transient")
    return "transient Teams/Bot Framework error; retry may succeed";
  if (classification.kind === "network")
    return "transport-level failure sending reply to Teams Bot Connector (smba.trafficmanager.net) — check egress firewall rules allow outbound HTTPS to smba.trafficmanager.net";
}
//#endregion
export {
  isRevokedProxyError as i,
  formatMSTeamsSendErrorHint as n,
  formatUnknownError as r,
  classifyMSTeamsSendError as t,
};
