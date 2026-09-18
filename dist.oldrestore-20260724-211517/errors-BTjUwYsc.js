import { n as stringifyNonErrorCause } from "./error-coercion-CrJRoLe1.js";
//#region packages/acp-core/src/error-format.ts
const SECRET_PATTERNS = [
  /\b[A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSWORD|PASSWD|CARD[_-]?NUMBER|CARD[_-]?CVC|CARD[_-]?CVV|CVC|CVV|SECURITY[_-]?CODE|PAYMENT[_-]?CREDENTIAL|SHARED[_-]?PAYMENT[_-]?TOKEN)\b\s*[=:]\s*(["']?)([^\s"'\\]+)\1/g,
  /\b[A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSWORD|PASSWD|CARD[_-]?NUMBER|CARD[_-]?CVC|CARD[_-]?CVV|CVC|CVV|SECURITY[_-]?CODE|PAYMENT[_-]?CREDENTIAL|SHARED[_-]?PAYMENT[_-]?TOKEN)\b\s*[=:]\s*\\+(["'])([^\s"'\\]+)\\+\1/g,
  /[?&](?:access[-_]?token|auth[-_]?token|hook[-_]?token|refresh[-_]?token|api[-_]?key|client[-_]?secret|token|key|secret|password|pass|passwd|auth|signature|card[-_]?number|card[-_]?cvc|card[-_]?cvv|cvc|cvv|security[-_]?code|payment[-_]?credential|shared[-_]?payment[-_]?token)=([^&\s"'<>]+)/gi,
  /"(?:apiKey|token|secret|password|passwd|accessToken|refreshToken|cardNumber|card_number|cardCvc|card_cvc|cardCvv|card_cvv|cvc|cvv|securityCode|security_code|paymentCredential|payment_credential|sharedPaymentToken|shared_payment_token)"\s*:\s*"([^"]+)"/g,
  /(^|[\s,{])["']?(?:api[-_]key|access[-_]token|refresh[-_]token|authToken|auth[-_]token|clientSecret|client[-_]secret|appSecret|app[-_]secret)["']?\s*[:=]\s*(["'])([^"'\r\n]+)\2/gi,
  /(^|[\s,{])["']?(?:authorization|proxy-authorization|cookie|set-cookie|x-api-key|x-auth-token)["']?\s*[:=]\s*(["'])([^"'\r\n]+)\2/gi,
  /--(?:api[-_]?key|hook[-_]?token|token|secret|password|passwd|card[-_]?number|card[-_]?cvc|card[-_]?cvv|cvc|cvv|security[-_]?code|payment[-_]?credential|shared[-_]?payment[-_]?token)\s+(["']?)([^\s"']+)\1/gi,
  /Authorization\s*[:=]\s*Bearer\s+([A-Za-z0-9._\-+=]+)/gi,
  /Authorization\s*[:=]\s*Basic\s+([A-Za-z0-9+/=]+)/gi,
  /(?:X-OpenClaw-Token|x-pomerium-jwt-assertion|X-Api-Key|X-Auth-Token)\s*[:=]\s*([^\s"',;]+)/gi,
  /\bBearer\s+([A-Za-z0-9._\-+=]{18,})\b/g,
  /(^|[\s,;])(?:access_token|refresh_token|auth[-_]?token|api[-_]?key|client[-_]?secret|app[-_]?secret|token|secret|password|passwd|card[-_]?number|card[-_]?cvc|card[-_]?cvv|cvc|cvv|security[-_]?code|payment[-_]?credential|shared[-_]?payment[-_]?token)=([^\s&#]+)/gi,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]+?-----END [A-Z ]*PRIVATE KEY-----/g,
  /\b(sk-[A-Za-z0-9_-]{8,})\b/g,
  /(ghp_[A-Za-z0-9]{20,})/g,
  /(github_pat_[A-Za-z0-9_]{20,})/g,
  /(xox[baprs]-[A-Za-z0-9-]{10,})/g,
  /(xapp-[A-Za-z0-9-]{10,})/g,
  /(gsk_[A-Za-z0-9_-]{10,})/g,
  /(AIza[0-9A-Za-z\-_]{20,})/g,
  /(ya29\.[0-9A-Za-z_\-./+=]{10,})/g,
  /(1\/\/0[0-9A-Za-z_\-./+=]{10,})/g,
  /(eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,})/g,
  /(pplx-[A-Za-z0-9_-]{10,})/g,
  /(npm_[A-Za-z0-9]{10,})/g,
  /(AKID[A-Za-z0-9]{10,})/g,
  /(LTAI[A-Za-z0-9]{10,})/g,
  /(hf_[A-Za-z0-9]{10,})/g,
  /(r8_[A-Za-z0-9]{10,})/g,
  /\bbot(\d{6,}:[A-Za-z0-9_-]{20,})\b/g,
  /\b(\d{6,}:[A-Za-z0-9_-]{20,})\b/g,
];
let configuredRedactor;
/** Installs a host-provided redactor used before ACP fallback secret-pattern redaction. */
function configureAcpErrorRedactor(redactor) {
  configuredRedactor = redactor;
}
/** Redacts common provider, GitHub, HTTP, payment, bot, and private-key secrets from error text. */
function redactSensitiveText(value) {
  let redacted = configuredRedactor ? configuredRedactor(value) : value;
  for (const pattern of SECRET_PATTERNS)
    redacted = redacted.replace(pattern, (match, ...args) => {
      if (match.includes("PRIVATE KEY-----")) return "[REDACTED_PRIVATE_KEY]";
      const token = args
        .slice(0, -2)
        .findLast((group) => typeof group === "string" && group.length > 0);
      return token ? match.replace(token, "[REDACTED]") : "[REDACTED]";
    });
  return redacted;
}
//#endregion
//#region packages/acp-core/src/runtime/errors.ts
const ACP_ERROR_CODES = [
  "ACP_BACKEND_MISSING",
  "ACP_BACKEND_UNAVAILABLE",
  "ACP_BACKEND_UNSUPPORTED_CONTROL",
  "ACP_DISPATCH_DISABLED",
  "ACP_INVALID_RUNTIME_OPTION",
  "ACP_SESSION_INIT_FAILED",
  "ACP_TURN_FAILED",
];
const ACP_ERROR_CODE_SET = new Set(ACP_ERROR_CODES);
/** Error type used at ACP runtime boundaries so callers can preserve structured failure codes. */
var AcpRuntimeError = class extends Error {
  constructor(code, message, options) {
    super(message);
    this.name = "AcpRuntimeError";
    this.code = code;
    this.detailCode = options?.detailCode;
    this.cause = options?.cause;
  }
};
function getForeignAcpRuntimeError(value) {
  if (!(value instanceof Error)) return null;
  const code = value.code;
  if (typeof code !== "string" || !ACP_ERROR_CODE_SET.has(code)) return null;
  return {
    code,
    message: value.message,
  };
}
function readAcpRequestErrorDetails(value) {
  if (typeof value.code !== "number") return;
  const data = value.data;
  if (!data || typeof data !== "object") return;
  const details = data.details;
  if (details === void 0 || details === null) return;
  const rendered = redactSensitiveText(stringifyNonErrorCause(details)).trim();
  return rendered.length > 0 ? rendered : void 0;
}
function messageWithAcpRequestErrorDetails(error) {
  const details = readAcpRequestErrorDetails(error);
  if (!details || error.message.includes(details)) return error.message;
  return `${error.message}: ${details}`;
}
/** Recognizes local and cross-realm ACP runtime errors by their stable error code. */
function isAcpRuntimeError(value) {
  return value instanceof AcpRuntimeError || getForeignAcpRuntimeError(value) !== null;
}
/** Converts arbitrary thrown values into ACP runtime errors with redacted request details. */
function toAcpRuntimeError(params) {
  if (params.error instanceof AcpRuntimeError) return params.error;
  const foreignAcpRuntimeError = getForeignAcpRuntimeError(params.error);
  if (foreignAcpRuntimeError)
    return new AcpRuntimeError(foreignAcpRuntimeError.code, foreignAcpRuntimeError.message, {
      cause: params.error,
    });
  if (params.error instanceof Error)
    return new AcpRuntimeError(
      params.fallbackCode,
      messageWithAcpRequestErrorDetails(params.error),
      { cause: params.error },
    );
  return new AcpRuntimeError(params.fallbackCode, params.fallbackMessage, { cause: params.error });
}
/**
 * Render an error and its `.cause` chain as a single human-readable line for
 * logs, lifecycle events, and tool results. Format is
 * `Name [code]: message <- Name [code]: message <- ...`. Number codes also
 * appear, so JSON-RPC error codes like `-32603` survive into surfaces that
 * downstream consumers see (gateway logs, telegram replies, tool_result text).
 *
 * Depth is capped to defend against self-referential `.cause` cycles.
 */
function formatAcpErrorChain(error) {
  if (!(error instanceof Error)) return redactSensitiveText(String(error));
  const segments = [renderSingleError(error)];
  let current = error.cause;
  let depth = 0;
  while (current !== void 0 && current !== null && depth < 8) {
    if (current instanceof Error) {
      segments.push(renderSingleError(current));
      current = current.cause;
    } else {
      segments.push(stringifyNonErrorCause(current));
      current = void 0;
    }
    depth += 1;
  }
  return redactSensitiveText(segments.join(" <- "));
}
function renderSingleError(error) {
  const codeValue = error.code;
  const codeSuffix =
    typeof codeValue === "string" || typeof codeValue === "number" ? ` [${codeValue}]` : "";
  return `${error.name}${codeSuffix}: ${error.message}`;
}
/** Wraps async runtime work and rethrows failures as ACP runtime errors. */
async function withAcpRuntimeErrorBoundary(params) {
  try {
    return await params.run();
  } catch (error) {
    throw toAcpRuntimeError({
      error,
      fallbackCode: params.fallbackCode,
      fallbackMessage: params.fallbackMessage,
    });
  }
}
//#endregion
export {
  toAcpRuntimeError as a,
  redactSensitiveText as c,
  isAcpRuntimeError as i,
  AcpRuntimeError as n,
  withAcpRuntimeErrorBoundary as o,
  formatAcpErrorChain as r,
  configureAcpErrorRedactor as s,
  ACP_ERROR_CODES as t,
};
