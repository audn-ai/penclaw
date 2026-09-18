import { r as createLazyRuntimeModule } from "./lazy-runtime-B-Fc-m0I.js";
import {
  a as unregisterAcpRuntimeBackend,
  n as registerAcpRuntimeBackend,
  t as getAcpRuntimeBackend,
} from "./registry-BVG2dQ33.js";
import "./acp-runtime-backend-BDpy5Nbx.js";
import { t as createLazyAcpRuntimeProxy } from "./runtime-proxy-BTnYAJY7.js";
//#region extensions/acpx/register.runtime.ts
/**
 * Lazy ACPX runtime service registration. The plugin exposes an ACP backend
 * immediately, then imports the heavier service only when a session needs it.
 */
const ACPX_BACKEND_ID = "acpx";
const loadServiceModule = createLazyRuntimeModule(() => import("./service-f1fwJY99.js"));
async function startRealService(state) {
  if (state.realRuntime) return state.realRuntime;
  if (!state.ctx) throw new Error("ACPX runtime service is not started");
  state.startPromise ??= (async () => {
    const { createAcpxRuntimeService: createAcpxRuntimeServiceLocal } = await loadServiceModule();
    const service = createAcpxRuntimeServiceLocal(state.params);
    state.realService = service;
    await service.start(state.ctx);
    const backend = getAcpRuntimeBackend(ACPX_BACKEND_ID);
    if (!backend?.runtime) throw new Error("ACPX runtime service did not register an ACP backend");
    state.realRuntime = backend.runtime;
    return state.realRuntime;
  })();
  try {
    return await state.startPromise;
  } catch (error) {
    state.startPromise = null;
    state.realService = null;
    throw error;
  }
}
function createDeferredRuntime(state) {
  const resolveRuntime = () => startRealService(state);
  return createLazyAcpRuntimeProxy(resolveRuntime);
}
/** Creates the plugin service that registers ACPX as an ACP runtime backend. */
function createAcpxRuntimeService(params = {}) {
  const state = {
    ctx: null,
    params,
    realRuntime: null,
    realService: null,
    startPromise: null,
  };
  return {
    id: "acpx-runtime",
    async start(ctx) {
      if (process.env.OPENCLAW_SKIP_ACPX_RUNTIME === "1") {
        ctx.logger.info("skipping embedded acpx runtime backend (OPENCLAW_SKIP_ACPX_RUNTIME=1)");
        return;
      }
      state.ctx = ctx;
      registerAcpRuntimeBackend({
        id: ACPX_BACKEND_ID,
        runtime: createDeferredRuntime(state),
      });
      ctx.logger.info("embedded acpx runtime backend registered lazily");
    },
    async stop(ctx) {
      if (state.realService) await state.realService.stop?.(ctx);
      else unregisterAcpRuntimeBackend(ACPX_BACKEND_ID);
      state.ctx = null;
      state.realRuntime = null;
      state.realService = null;
      state.startPromise = null;
    },
  };
}
//#endregion
export { createAcpxRuntimeService as t };
