import { createHash } from "node:crypto";
import { a as prepareClawRouterRequestModel } from "./provider-catalog-DLyVBiDu.js";
//#region extensions/clawrouter/stream.ts
const ENV_API_KEY_MARKER = "CLAWROUTER_API_KEY";
const ATTRIBUTION_VALUE_MAX_LENGTH = 256;
const REQUEST_ID_MAX_LENGTH = 128;
const CLIENT_HEADER = "X-ClawRouter-Client";
const AGENT_HEADER = "X-ClawRouter-Agent-Id";
const SESSION_HEADER = "X-ClawRouter-Session-Id";
const REQUEST_ID_HEADER = "X-Request-ID";
const REQUEST_ID_HASH_LENGTH = 16;
const REQUEST_ID_PATTERN = /^[A-Za-z0-9._~:/+@=-]+$/u;
const REQUEST_ID_UNSAFE_CHARACTER_PATTERN = /[^A-Za-z0-9._~:/+@=-]/gu;
function hasControlCharacter(value) {
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    if (code <= 31 || code === 127) return true;
  }
  return false;
}
function normalizeAttributionValue(value) {
  const normalized = value?.trim();
  if (!normalized || hasControlCharacter(normalized)) return;
  return normalized;
}
function sanitizeAttributionValue(value) {
  const normalized = normalizeAttributionValue(value);
  if (!normalized) return;
  return normalized.slice(0, ATTRIBUTION_VALUE_MAX_LENGTH);
}
function sanitizeRequestId(value) {
  const normalized = normalizeAttributionValue(value);
  if (!normalized) return normalized;
  if (normalized.length <= REQUEST_ID_MAX_LENGTH && REQUEST_ID_PATTERN.test(normalized))
    return normalized;
  const hash = createHash("sha256")
    .update(normalized)
    .digest("hex")
    .slice(0, REQUEST_ID_HASH_LENGTH);
  const modelSuffix = normalized.match(/:model:\d+$/u)?.[0] ?? "";
  const safePrefix = (modelSuffix ? normalized.slice(0, -modelSuffix.length) : normalized).replace(
    REQUEST_ID_UNSAFE_CHARACTER_PATTERN,
    "_",
  );
  const boundedSuffix = `~${hash}${modelSuffix}`;
  if (boundedSuffix.length >= REQUEST_ID_MAX_LENGTH)
    return `${safePrefix.slice(0, REQUEST_ID_MAX_LENGTH - hash.length - 1)}~${hash}`;
  return `${safePrefix.slice(0, REQUEST_ID_MAX_LENGTH - boundedSuffix.length)}${boundedSuffix}`;
}
function findHeader(headers, target) {
  const normalizedTarget = target.toLowerCase();
  for (const [name, value] of Object.entries(headers))
    if (name.toLowerCase() === normalizedTarget) return value;
}
function setHeaderDefault(headers, name, value) {
  if (value !== void 0 && findHeader(headers, name) === void 0) headers[name] = value;
}
function withClawRouterHeaders(headers, params) {
  const next = {};
  for (const [name, value] of Object.entries(headers ?? {}))
    if (name.toLowerCase() !== "authorization" || !params.apiKey) next[name] = value;
  setHeaderDefault(next, CLIENT_HEADER, "openclaw");
  setHeaderDefault(next, AGENT_HEADER, sanitizeAttributionValue(params.agentId));
  setHeaderDefault(next, SESSION_HEADER, sanitizeAttributionValue(params.sessionId));
  setHeaderDefault(next, REQUEST_ID_HEADER, sanitizeRequestId(params.requestId));
  if (params.apiKey) next.Authorization = `Bearer ${params.apiKey}`;
  return next;
}
function createClawRouterStreamWrapper(ctx) {
  const underlying = ctx.streamFn;
  if (!underlying) return;
  return (model, context, options) => {
    const apiKey = options?.apiKey?.trim();
    const preparedModel = prepareClawRouterRequestModel(model);
    const hasExplicitRequestId = findHeader(options?.headers ?? {}, REQUEST_ID_HEADER) !== void 0;
    return underlying(
      {
        ...preparedModel,
        headers: withClawRouterHeaders(preparedModel.headers, {
          agentId: ctx.agentId,
          apiKey: apiKey && apiKey !== ENV_API_KEY_MARKER ? apiKey : void 0,
          requestId: hasExplicitRequestId ? void 0 : options?.requestId,
          sessionId: options?.sessionId,
        }),
      },
      context,
      options,
    );
  };
}
function wrapClawRouterProviderStream(ctx) {
  return createClawRouterStreamWrapper(ctx);
}
//#endregion
export { wrapClawRouterProviderStream as t };
