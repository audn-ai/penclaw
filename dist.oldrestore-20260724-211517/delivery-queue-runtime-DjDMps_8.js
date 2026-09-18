import { t as drainPendingDeliveries$1 } from "./delivery-queue-DAslzmpt.js";
import { f as runWithGatewayIndependentRootWorkAdmission } from "./gateway-work-admission-yGjmBAjy.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-B-Fc-m0I.js";
//#region src/plugin-sdk/delivery-queue-runtime.ts
const loadOutboundDeliverRuntime = createLazyRuntimeModule(
  () => import("./deliver-runtime-BcwCmhea.js"),
);
/**
 * Drain queued outbound payloads after a channel reconnect or transport recovery.
 * When no deliver function is provided, the heavy outbound delivery runtime is
 * loaded lazily so importing this SDK subpath does not eagerly bind send internals.
 */
async function drainPendingDeliveries(opts) {
  await runWithGatewayIndependentRootWorkAdmission(async () => {
    const deliver =
      opts.deliver ?? (await loadOutboundDeliverRuntime()).deliverOutboundPayloadsInternal;
    await drainPendingDeliveries$1({
      ...opts,
      deliver,
    });
  });
}
//#endregion
export { drainPendingDeliveries as t };
