//#region src/sessions/session-lifecycle-events.ts
const SESSION_LIFECYCLE_LISTENERS = /* @__PURE__ */ new Set();
const SESSION_IDENTITY_MUTATION_LISTENERS = /* @__PURE__ */ new Set();
/** Registers a session lifecycle listener. */
function onSessionLifecycleEvent(listener) {
  SESSION_LIFECYCLE_LISTENERS.add(listener);
  return () => {
    SESSION_LIFECYCLE_LISTENERS.delete(listener);
  };
}
/** Emits a best-effort session lifecycle event to all listeners. */
function emitSessionLifecycleEvent(event) {
  for (const listener of SESSION_LIFECYCLE_LISTENERS)
    try {
      listener(event);
    } catch {}
}
function onSessionIdentityMutation(listener) {
  SESSION_IDENTITY_MUTATION_LISTENERS.add(listener);
  return () => {
    SESSION_IDENTITY_MUTATION_LISTENERS.delete(listener);
  };
}
function emitSessionIdentityMutation(mutation) {
  for (const listener of SESSION_IDENTITY_MUTATION_LISTENERS)
    try {
      listener(mutation);
    } catch {}
}
//#endregion
export {
  onSessionLifecycleEvent as i,
  emitSessionLifecycleEvent as n,
  onSessionIdentityMutation as r,
  emitSessionIdentityMutation as t,
};
