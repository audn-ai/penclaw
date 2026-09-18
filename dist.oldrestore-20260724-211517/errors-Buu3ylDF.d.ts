//#region packages/acp-core/src/runtime/errors.d.ts
declare const ACP_ERROR_CODES: readonly [
  "ACP_BACKEND_MISSING",
  "ACP_BACKEND_UNAVAILABLE",
  "ACP_BACKEND_UNSUPPORTED_CONTROL",
  "ACP_DISPATCH_DISABLED",
  "ACP_INVALID_RUNTIME_OPTION",
  "ACP_SESSION_INIT_FAILED",
  "ACP_TURN_FAILED",
];
type AcpRuntimeErrorCode = (typeof ACP_ERROR_CODES)[number];
/** Error type used at ACP runtime boundaries so callers can preserve structured failure codes. */
declare class AcpRuntimeError extends Error {
  readonly code: AcpRuntimeErrorCode;
  /**
   * Backend-specific structured failure code (e.g. acpx "SESSION_RESUME_REQUIRED"),
   * preserved so recovery decisions key on the failure kind rather than parsing
   * the human-readable message.
   */
  readonly detailCode?: string;
  readonly cause?: unknown;
  constructor(
    code: AcpRuntimeErrorCode,
    message: string,
    options?: {
      cause?: unknown;
      detailCode?: string;
    },
  );
}
/** Recognizes local and cross-realm ACP runtime errors by their stable error code. */
declare function isAcpRuntimeError(value: unknown): value is AcpRuntimeError;
/** Converts arbitrary thrown values into ACP runtime errors with redacted request details. */
declare function toAcpRuntimeError(params: {
  error: unknown;
  fallbackCode: AcpRuntimeErrorCode;
  fallbackMessage: string;
}): AcpRuntimeError;
/**
 * Render an error and its `.cause` chain as a single human-readable line for
 * logs, lifecycle events, and tool results. Format is
 * `Name [code]: message <- Name [code]: message <- ...`. Number codes also
 * appear, so JSON-RPC error codes like `-32603` survive into surfaces that
 * downstream consumers see (gateway logs, telegram replies, tool_result text).
 *
 * Depth is capped to defend against self-referential `.cause` cycles.
 */
declare function formatAcpErrorChain(error: unknown): string;
/** Wraps async runtime work and rethrows failures as ACP runtime errors. */
declare function withAcpRuntimeErrorBoundary<T>(params: {
  run: () => Promise<T>;
  fallbackCode: AcpRuntimeErrorCode;
  fallbackMessage: string;
}): Promise<T>;
//#endregion
export {
  isAcpRuntimeError as a,
  formatAcpErrorChain as i,
  AcpRuntimeError as n,
  toAcpRuntimeError as o,
  AcpRuntimeErrorCode as r,
  withAcpRuntimeErrorBoundary as s,
  ACP_ERROR_CODES as t,
};
