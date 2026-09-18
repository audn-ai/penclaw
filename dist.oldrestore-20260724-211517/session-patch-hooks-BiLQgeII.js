import {
  i as hasInternalHookListeners,
  m as triggerInternalHook,
} from "./internal-hooks-CckLIOgu.js";
//#region src/gateway/session-patch-hooks.ts
/** Triggers internal session patch hooks when listeners are registered. */
function triggerSessionPatchHook(params) {
  if (!hasInternalHookListeners("session", "patch")) return;
  const hookContext = structuredClone({
    sessionEntry: params.sessionEntry,
    patch: params.patch,
    cfg: params.cfg,
  });
  triggerInternalHook({
    type: "session",
    action: "patch",
    sessionKey: params.sessionKey,
    context: hookContext,
    timestamp: /* @__PURE__ */ new Date(),
    messages: [],
  });
}
//#endregion
export { triggerSessionPatchHook as t };
