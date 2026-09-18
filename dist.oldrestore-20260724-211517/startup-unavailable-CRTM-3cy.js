//#region packages/gateway-protocol/src/startup-unavailable.ts
/** Structured error reason used while gateway startup sidecars are still initializing. */
const GATEWAY_STARTUP_UNAVAILABLE_REASON = "startup-sidecars";
/** Internal close cause that distinguishes startup retry closes from generic disconnects. */
const GATEWAY_STARTUP_PENDING_CLOSE_CAUSE = "startup-sidecars-pending";
/** WebSocket close code for temporary gateway unavailability. */
const GATEWAY_STARTUP_CLOSE_CODE = 1013;
/** Human-readable WebSocket close reason for temporary gateway startup unavailability. */
const GATEWAY_STARTUP_CLOSE_REASON = "gateway starting";
const GATEWAY_STARTUP_RETRY_MIN_MS = 100;
const GATEWAY_STARTUP_RETRY_MAX_MS = 2e3;
/** Builds the canonical startup-unavailable details payload. */
function gatewayStartupUnavailableDetails() {
  return { reason: GATEWAY_STARTUP_UNAVAILABLE_REASON };
}
function isGatewayStartupUnavailableDetails(details) {
  return typeof details === "object" && details !== null && details.reason === "startup-sidecars";
}
/** Detects the structured retryable error emitted while startup sidecars are pending. */
function isRetryableGatewayStartupUnavailableError(error) {
  if (!error || typeof error !== "object") return false;
  const shaped = error;
  return (
    (shaped.gatewayCode ?? shaped.code) === "UNAVAILABLE" &&
    shaped.retryable === true &&
    isGatewayStartupUnavailableDetails(shaped.details)
  );
}
/** Resolves a bounded retry-after delay from a startup-unavailable error. */
function resolveGatewayStartupRetryAfterMs(error) {
  if (!isRetryableGatewayStartupUnavailableError(error)) return null;
  const retryAfterMs = error.retryAfterMs;
  return Math.min(
    Math.max(
      Math.floor(
        typeof retryAfterMs === "number" && Number.isFinite(retryAfterMs) ? retryAfterMs : 500,
      ),
      GATEWAY_STARTUP_RETRY_MIN_MS,
    ),
    GATEWAY_STARTUP_RETRY_MAX_MS,
  );
}
//#endregion
export {
  resolveGatewayStartupRetryAfterMs as a,
  gatewayStartupUnavailableDetails as i,
  GATEWAY_STARTUP_CLOSE_REASON as n,
  GATEWAY_STARTUP_PENDING_CLOSE_CAUSE as r,
  GATEWAY_STARTUP_CLOSE_CODE as t,
};
