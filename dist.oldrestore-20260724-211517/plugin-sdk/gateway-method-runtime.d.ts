//#region src/plugin-sdk/gateway-method-runtime.d.ts
/** Error envelope returned by in-process Gateway method dispatch. */
type GatewayMethodDispatchError = {
  /** Stable machine-readable error code returned by the Gateway method. */ code: string /** Human-readable error summary safe to forward to the plugin caller. */;
  message: string /** Optional structured method-specific diagnostics. */;
  details?: unknown /** Whether the caller can retry the same request without changing params. */;
  retryable?: boolean /** Suggested delay before retrying when the Gateway can estimate backoff. */;
  retryAfterMs?: number;
};
/** Response envelope returned to plugins after dispatching a Gateway method. */
type GatewayMethodDispatchResponse = {
  /** True when the Gateway method completed and `payload` contains its result. */ ok: boolean /** Method-specific result payload for successful responses. */;
  payload?: unknown /** Gateway error envelope for failed responses. */;
  error?: GatewayMethodDispatchError /** Optional response metadata that plugins may pass through unchanged. */;
  meta?: Record<string, unknown>;
};
/** Dispatch controls for plugin-initiated Gateway method calls. */
type GatewayMethodDispatchOptions = {
  /** Wait for the Gateway's final response instead of returning the first response frame. */ expectFinal?: boolean /** Maximum time to wait for Gateway dispatch before the runtime reports a timeout. */;
  timeoutMs?: number;
};
/**
 * Dispatch a Gateway control-plane method from an authenticated plugin request scope.
 */
declare function dispatchGatewayMethod(
  /** Gateway method name, validated by the Gateway method router. */

  method: string /** Method-specific params forwarded without SDK-side normalization. */,
  params?: unknown /** Dispatch behavior controls for response timing and timeout handling. */,
  options?: GatewayMethodDispatchOptions,
): Promise<GatewayMethodDispatchResponse>;
//#endregion
export {
  GatewayMethodDispatchError,
  GatewayMethodDispatchOptions,
  GatewayMethodDispatchResponse,
  dispatchGatewayMethod,
};
