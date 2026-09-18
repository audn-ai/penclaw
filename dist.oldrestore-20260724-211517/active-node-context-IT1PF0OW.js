//#region src/infra/active-node-context.ts
let activeNodeContext = null;
/** Publishes the gateway's current active-node choice without volatile timestamps. */
function setActiveNodeContext(next) {
  activeNodeContext = next ? { ...next } : null;
}
/** Returns a defensive snapshot for prompt construction. */
function getActiveNodeContext() {
  return activeNodeContext ? { ...activeNodeContext } : null;
}
/** Formats the stable authenticated id; node-controlled labels stay out of prompt text. */
function formatActiveNodeContextLabel(context) {
  return context?.nodeId;
}
//#endregion
export { getActiveNodeContext as n, setActiveNodeContext as r, formatActiveNodeContextLabel as t };
