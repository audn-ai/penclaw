import { i as PlatformMessageNotDispatchedError } from "../deliver-types-Df1s0J7e.js";
import {
  i as formatUncaughtError,
  n as extractErrorCode,
  r as formatErrorMessage,
  s as readErrorName,
  t as collectErrorGraphCandidates,
} from "../errors-DFNEfRR0.js";

//#region src/infra/approval-errors.d.ts
/**
 * Detects approval-not-found failures across gateway error shapes.
 * Kept broad enough for legacy message-only errors emitted before structured codes.
 */
declare function isApprovalNotFoundError(err: unknown): boolean;
//#endregion
//#region src/plugin-sdk/error-runtime.d.ts
/** Stable error code for subagent APIs called outside an authenticated gateway request. */
declare const SUBAGENT_RUNTIME_REQUEST_SCOPE_ERROR_CODE = "OPENCLAW_SUBAGENT_RUNTIME_REQUEST_SCOPE";
/** Default message paired with `SUBAGENT_RUNTIME_REQUEST_SCOPE_ERROR_CODE`. */
declare const SUBAGENT_RUNTIME_REQUEST_SCOPE_ERROR_MESSAGE =
  "Plugin runtime subagent methods are only available during a gateway request.";
/** Error thrown when request-scoped plugin runtime APIs are used outside their scope. */
declare class RequestScopedSubagentRuntimeError extends Error {
  code: string;
  constructor(message?: string);
}
//#endregion
export {
  PlatformMessageNotDispatchedError,
  RequestScopedSubagentRuntimeError,
  SUBAGENT_RUNTIME_REQUEST_SCOPE_ERROR_CODE,
  SUBAGENT_RUNTIME_REQUEST_SCOPE_ERROR_MESSAGE,
  collectErrorGraphCandidates,
  extractErrorCode,
  formatErrorMessage,
  formatUncaughtError,
  isApprovalNotFoundError,
  readErrorName,
};
