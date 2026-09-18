import { n as drainPendingDeliveries$1, t as DeliverFn } from "./delivery-queue-sWZI1R2e.js";

//#region src/plugin-sdk/delivery-queue-runtime.d.ts
type DrainPendingDeliveriesOptions = Omit<
  Parameters<typeof drainPendingDeliveries$1>[0],
  "deliver"
> & {
  /** Optional delivery implementation for tests or plugin-owned send paths. */ deliver?: DeliverFn;
};
/**
 * Drain queued outbound payloads after a channel reconnect or transport recovery.
 * When no deliver function is provided, the heavy outbound delivery runtime is
 * loaded lazily so importing this SDK subpath does not eagerly bind send internals.
 */
declare function drainPendingDeliveries(opts: DrainPendingDeliveriesOptions): Promise<void>;
//#endregion
export { drainPendingDeliveries as t };
