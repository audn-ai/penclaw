//#region src/shared/listeners.ts
/** Notifies every registered listener while isolating individual listener failures. */
function notifyListeners(listeners, event, onError) {
  for (const listener of listeners)
    try {
      listener(event);
    } catch (error) {
      onError?.(error);
    }
}
/** Registers a listener in a Set and returns an idempotent unsubscribe handle. */
function registerListener(listeners, listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
//#endregion
export { registerListener as n, notifyListeners as t };
