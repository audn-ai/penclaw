//#region packages/gateway-protocol/src/schema/error-codes.ts
/** Gateway JSON-RPC style error codes shared by clients and server handlers. */
const ErrorCodes = {
  /** Client has not completed account/device linking for this gateway. */
  NOT_LINKED: "NOT_LINKED",
  /** Device exists but still needs an explicit pairing approval. */
  NOT_PAIRED: "NOT_PAIRED",
  /** Agent turn exceeded the gateway wait window. */
  AGENT_TIMEOUT: "AGENT_TIMEOUT",
  /** Request payload failed protocol validation or method preconditions. */
  INVALID_REQUEST: "INVALID_REQUEST",
  /** Approval resolution referenced a missing or expired approval request. */
  APPROVAL_NOT_FOUND: "APPROVAL_NOT_FOUND",
  /** Gateway service or required backend is temporarily unavailable. */
  UNAVAILABLE: "UNAVAILABLE",
};
/** Builds the canonical gateway error payload while preserving optional retry metadata. */
function errorShape(code, message, opts) {
  return {
    code,
    message,
    ...opts,
  };
}
//#endregion
export { errorShape as n, ErrorCodes as t };
