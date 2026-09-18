import { n as RuntimeEnv } from "./runtime-Bxifh4bY.js";

//#region src/infra/transport-ready.d.ts
/** Result returned by one transport readiness probe attempt. */
type TransportReadyResult = {
  ok: boolean;
  error?: string | null;
};
/** Parameters for polling a channel transport until it can accept runtime work. */
type WaitForTransportReadyParams = {
  label: string;
  timeoutMs: number;
  logAfterMs?: number;
  logIntervalMs?: number;
  pollIntervalMs?: number;
  abortSignal?: AbortSignal;
  runtime: RuntimeEnv;
  check: () => Promise<TransportReadyResult>;
};
/**
 * Polls a channel transport readiness probe until it succeeds, times out, or aborts.
 *
 * Used by channel plugins that start external daemons or subscribe to local transports before
 * processing inbound events, with bounded retry logging through the caller's runtime sink.
 */
declare function waitForTransportReady(params: WaitForTransportReadyParams): Promise<void>;
//#endregion
export { WaitForTransportReadyParams as n, waitForTransportReady as r, TransportReadyResult as t };
