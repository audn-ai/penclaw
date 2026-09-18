import "./errors-BoHeli7m.js";
//#region src/plugin-sdk/error-runtime.ts
/** Stable error code for subagent APIs called outside an authenticated gateway request. */
const SUBAGENT_RUNTIME_REQUEST_SCOPE_ERROR_CODE = "OPENCLAW_SUBAGENT_RUNTIME_REQUEST_SCOPE";
/** Default message paired with `SUBAGENT_RUNTIME_REQUEST_SCOPE_ERROR_CODE`. */
const SUBAGENT_RUNTIME_REQUEST_SCOPE_ERROR_MESSAGE =
  "Plugin runtime subagent methods are only available during a gateway request.";
/** Error thrown when request-scoped plugin runtime APIs are used outside their scope. */
var RequestScopedSubagentRuntimeError = class extends Error {
  constructor(message = SUBAGENT_RUNTIME_REQUEST_SCOPE_ERROR_MESSAGE) {
    super(message);
    this.code = SUBAGENT_RUNTIME_REQUEST_SCOPE_ERROR_CODE;
    this.name = "RequestScopedSubagentRuntimeError";
  }
};
//#endregion
export {
  SUBAGENT_RUNTIME_REQUEST_SCOPE_ERROR_CODE as n,
  SUBAGENT_RUNTIME_REQUEST_SCOPE_ERROR_MESSAGE as r,
  RequestScopedSubagentRuntimeError as t,
};
