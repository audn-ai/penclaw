import { r as createLazyRuntimeModule } from "./lazy-runtime-B-Fc-m0I.js";
import "./session-binding-service-DPVMwWUH.js";
import "./conversation-binding-B-BUd2yg.js";
import "./thread-bindings-policy-d6bhdGnZ.js";
import "./channel-access-compat-Btt8XWBu.js";
import "./binding-registry-j38QvOtc.js";
import "./session-Fo42_iaz.js";
import "./pairing-store-C4j5pnVS.js";
import "./binding-targets-BlWEzEfq.js";
import "./binding-routing-Z88YfeFH.js";
import "./pairing-challenge-Jv_G6M94.js";
import "./pairing-labels-BRZIjxkR.js";
//#region src/channels/session-meta.ts
const loadInboundSessionRuntime = createLazyRuntimeModule(() => import("./inbound.runtime.js"));
/**
 * Best-effort inbound session metadata recorder for channel plugin command handlers.
 */
async function recordInboundSessionMetaSafe(params) {
  const runtime = await loadInboundSessionRuntime();
  const storePath = runtime.resolveStorePath(params.cfg.session?.store, {
    agentId: params.agentId,
  });
  try {
    await runtime.recordInboundSessionMeta({
      storePath,
      sessionKey: params.sessionKey,
      ctx: params.ctx,
    });
  } catch (err) {
    params.onError?.(err);
  }
}
//#endregion
export { recordInboundSessionMetaSafe as t };
