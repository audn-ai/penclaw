//#region extensions/browser/src/browser/extension-relay.runtime.ts
/**
 * Lazy boundary for the extension relay (pulls in the ws server dependency).
 */
let modPromise = null;
/** Load the extension relay lifecycle module on demand. */
function getExtensionRelayModule() {
  modPromise ??= import("./relay-lifecycle-Mqu5mgDx.js");
  return modPromise;
}
//#endregion
export { getExtensionRelayModule as t };
