import { d as readResponseWithLimit, l as readResponseTextPrefix } from "./http-body-aoMvQQlg.js";
import { c as redactSensitiveText } from "./redact-CUe6Oey5.js";
import "./number-coercion-CJQ8TR--.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
import "./boolean-CrriykWV.js";
//#region src/agents/provider-http-errors.ts
/**
 * Shared provider HTTP error normalization helpers.
 *
 * Transport adapters use this module to turn provider-specific response bodies,
 * request ids, and binary payload guardrails into stable OpenClaw error shapes.
 */
const ERROR_BODY_METADATA_LIMIT = 500;
const PROVIDER_BINARY_RESPONSE_MAX_BYTES = 16 * 1024 * 1024;
const PROVIDER_JSON_RESPONSE_MAX_BYTES = 16 * 1024 * 1024;
const PROVIDER_TEXT_RESPONSE_MAX_BYTES = 16 * 1024 * 1024;
/** Returns a plain object view for provider JSON payloads when one exists. */
function asObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value) ? value : void 0;
}
/** Trims provider error details to a log- and prompt-safe preview length. */
function truncateErrorDetail(detail, limit = 220) {
  return detail.length <= limit ? detail : `${truncateUtf16Safe(detail, limit - 1)}…`;
}
/** Redacts secrets before preserving a bounded provider error body preview. */
function redactProviderErrorBody(body) {
  return truncateErrorDetail(redactSensitiveText(body), ERROR_BODY_METADATA_LIMIT);
}
/** Reads at most `limitBytes` from a response body without buffering provider-sized failures. */
async function readResponseTextLimited(response, limitBytes = 16 * 1024) {
  if (limitBytes <= 0) return "";
  return (await readResponseTextPrefix(response, limitBytes)).text;
}
/** Reads a successful provider text response under a byte cap. */
async function readProviderTextResponse(response, label, opts) {
  const bytes = await readResponseWithLimit(
    response,
    opts?.maxBytes ?? PROVIDER_TEXT_RESPONSE_MAX_BYTES,
    {
      onOverflow: ({ maxBytes: maxBytesLocal }) =>
        /* @__PURE__ */ new Error(`${label}: text response exceeds ${maxBytesLocal} bytes`),
    },
  );
  return new TextDecoder().decode(bytes);
}
/** Formats common provider JSON error payload shapes into one readable detail string. */
function formatProviderErrorPayload(payload) {
  const root = asObject(payload);
  const detailObject = asObject(root?.detail);
  const subject = asObject(root?.error) ?? detailObject ?? root;
  if (!subject) return;
  const errorDescription =
    normalizeOptionalString(subject.error_description) ??
    normalizeOptionalString(root?.error_description);
  const oauthCode = errorDescription ? normalizeOptionalString(root?.error) : void 0;
  const message =
    normalizeOptionalString(subject.message) ??
    normalizeOptionalString(subject.detail) ??
    errorDescription ??
    normalizeOptionalString(root?.message) ??
    normalizeOptionalString(root?.error) ??
    normalizeOptionalString(root?.detail);
  const type = normalizeOptionalString(subject.type);
  const code =
    normalizeOptionalString(subject.code) ?? normalizeOptionalString(subject.status) ?? oauthCode;
  const metadata = [type ? `type=${type}` : void 0, code ? `code=${code}` : void 0]
    .filter((value) => Boolean(value))
    .join(", ");
  if (message && metadata) return `${truncateErrorDetail(message)} [${metadata}]`;
  if (message) return truncateErrorDetail(message);
  if (metadata) return `[${metadata}]`;
}
function extractProviderErrorPayloadMetadata(payload) {
  const root = asObject(payload);
  const detailObject = asObject(root?.detail);
  const subject = asObject(root?.error) ?? detailObject ?? root;
  if (!subject) return {};
  const detail = formatProviderErrorPayload(payload);
  const type = normalizeOptionalString(subject.type);
  const oauthCode =
    (normalizeOptionalString(subject.error_description) ??
    normalizeOptionalString(root?.error_description))
      ? normalizeOptionalString(root?.error)
      : void 0;
  const code =
    normalizeOptionalString(subject.code) ?? normalizeOptionalString(subject.status) ?? oauthCode;
  return {
    ...(detail ? { detail: redactSensitiveText(detail) } : {}),
    ...(code ? { code } : {}),
    ...(type ? { type } : {}),
  };
}
/** Extracts normalized provider error metadata while keeping the raw body bounded and redacted. */
async function extractProviderErrorInfo(response) {
  const rawBody = normalizeOptionalString(await readResponseTextLimited(response).catch(() => ""));
  const requestId = extractProviderRequestId(response);
  if (!rawBody) return requestId ? { requestId } : {};
  const body = redactProviderErrorBody(rawBody);
  try {
    const metadata = extractProviderErrorPayloadMetadata(JSON.parse(rawBody));
    return {
      ...(metadata.detail ? { detail: metadata.detail } : { detail: body }),
      ...(metadata.code ? { code: metadata.code } : {}),
      ...(metadata.type ? { type: metadata.type } : {}),
      body,
      ...(requestId ? { requestId } : {}),
    };
  } catch {
    return {
      detail: body,
      body,
      ...(requestId ? { requestId } : {}),
    };
  }
}
/** Returns only the normalized provider detail string for callers that do not need metadata. */
async function extractProviderErrorDetail(response) {
  return (await extractProviderErrorInfo(response)).detail;
}
/** Reads the provider request id header variants used across model and media APIs. */
function extractProviderRequestId(response) {
  return (
    normalizeOptionalString(response.headers.get("x-request-id")) ??
    normalizeOptionalString(response.headers.get("request-id"))
  );
}
/** Error type carrying normalized provider status, request id, code, type, and body metadata. */
var ProviderHttpError = class extends Error {
  constructor(message, params) {
    super(message);
    this.name = "ProviderHttpError";
    this.status = params.status;
    this.statusCode = params.status;
    this.code = params.code;
    this.errorCode = params.code;
    this.errorType = params.type;
    this.errorBody = params.body;
    this.requestId = params.requestId;
  }
};
/** Builds the human-facing provider HTTP error message from normalized metadata. */
function formatProviderHttpErrorMessage(params) {
  const { label, status, detail, requestId, statusPrefix = "" } = params;
  return (
    `${label} (${statusPrefix}${status})` +
    (detail ? `: ${detail}` : "") +
    (requestId ? ` [request_id=${requestId}]` : "")
  );
}
/** Creates a normalized provider HTTP error from a failed response. */
async function createProviderHttpError(response, label, options) {
  const info = await extractProviderErrorInfo(response);
  return new ProviderHttpError(
    formatProviderHttpErrorMessage({
      label,
      status: response.status,
      detail: info.detail,
      requestId: info.requestId,
      statusPrefix: options?.statusPrefix,
    }),
    {
      status: response.status,
      code: info.code,
      type: info.type,
      body: info.body,
      requestId: info.requestId,
    },
  );
}
/** Throws a normalized provider error when a fetch response is not OK. */
async function assertOkOrThrowProviderError(response, label) {
  if (response.ok) return;
  throw await createProviderHttpError(response, label);
}
/** Throws a normalized generic HTTP error when a fetch response is not OK. */
async function assertOkOrThrowHttpError(response, label) {
  if (response.ok) return;
  throw await createProviderHttpError(response, label, { statusPrefix: "HTTP " });
}
/**
 * Parses a provider JSON response under a byte cap and wraps malformed JSON with the caller's label.
 *
 * The body is read through the same bounded reader as binary responses so a provider that streams an
 * unbounded JSON body cannot force the runtime to buffer the whole payload before parsing.
 */
async function readProviderJsonResponse(response, label, opts) {
  const bytes = await readResponseWithLimit(
    response,
    opts?.maxBytes ?? PROVIDER_JSON_RESPONSE_MAX_BYTES,
    {
      onOverflow: ({ maxBytes: maxBytesLocal }) =>
        /* @__PURE__ */ new Error(`${label}: JSON response exceeds ${maxBytesLocal} bytes`),
    },
  );
  try {
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch (cause) {
    throw new Error(`${label}: malformed JSON response`, { cause });
  }
}
/** Parses a provider JSON response that must be a top-level object. */
async function readProviderJsonObjectResponse(response, label) {
  const object = asObject(await readProviderJsonResponse(response, label));
  if (!object) throw new Error(`${label}: malformed JSON response`);
  return object;
}
/** Parses a provider JSON object response and returns an array field. */
async function readProviderJsonArrayFieldResponse(response, label, field) {
  const value = (await readProviderJsonObjectResponse(response, label))[field];
  if (!Array.isArray(value)) throw new Error(`${label}: malformed JSON response`);
  return value;
}
function normalizeContentType(response) {
  return response.headers.get("content-type")?.split(";")[0]?.trim().toLowerCase() || void 0;
}
/** Rejects text or JSON responses on provider endpoints that should return binary bytes. */
function assertProviderBinaryResponseContent(response, label, kind = "binary") {
  const contentType = normalizeContentType(response);
  if (!contentType) return;
  if (
    contentType === "application/json" ||
    contentType.endsWith("+json") ||
    contentType.startsWith("text/")
  )
    throw new Error(`${label}: malformed ${kind} response`);
}
/** Reads a bounded non-empty binary provider response after content-type validation. */
async function readProviderBinaryResponse(response, label, kind = "binary", opts) {
  assertProviderBinaryResponseContent(response, label, kind);
  const bytes = await readResponseWithLimit(
    response,
    opts?.maxBytes ?? PROVIDER_BINARY_RESPONSE_MAX_BYTES,
    {
      onOverflow: ({ maxBytes: maxBytesLocal }) =>
        /* @__PURE__ */ new Error(`${label}: ${kind} response exceeds ${maxBytesLocal} bytes`),
    },
  );
  if (bytes.byteLength === 0) throw new Error(`${label}: malformed ${kind} response`);
  return bytes;
}
//#endregion
export {
  truncateErrorDetail as _,
  assertProviderBinaryResponseContent as a,
  extractProviderRequestId as c,
  readProviderBinaryResponse as d,
  readProviderJsonArrayFieldResponse as f,
  readResponseTextLimited as g,
  readProviderTextResponse as h,
  assertOkOrThrowProviderError as i,
  formatProviderErrorPayload as l,
  readProviderJsonResponse as m,
  asObject as n,
  createProviderHttpError as o,
  readProviderJsonObjectResponse as p,
  assertOkOrThrowHttpError as r,
  extractProviderErrorDetail as s,
  ProviderHttpError as t,
  formatProviderHttpErrorMessage as u,
};
