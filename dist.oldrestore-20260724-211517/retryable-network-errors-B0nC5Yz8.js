//#region src/infra/retryable-network-errors.ts
const RETRYABLE_CONNECTION_ERROR_CODE_RE =
  /\b(?:ECONNRESET|ECONNREFUSED|ETIMEDOUT|EPIPE|EHOSTUNREACH|ENETUNREACH|EAI_AGAIN)\b/i;
function hasRetryableConnectionErrorCode(message) {
  return RETRYABLE_CONNECTION_ERROR_CODE_RE.test(message);
}
//#endregion
export { hasRetryableConnectionErrorCode as t };
