import { t as resolveGatewayReloadSettings } from "./config-reload-settings-BUK2a-7x.js";
//#region src/gateway/server-shared-auth-generation.ts
const stateRevisions = /* @__PURE__ */ new WeakMap();
function advanceStateRevision(state) {
  const revision = (stateRevisions.get(state) ?? 0) + 1;
  stateRevisions.set(state, revision);
  return revision;
}
/** Capture current generation-state ownership without mutating it. */
function captureSharedGatewaySessionGenerationOwnership(state) {
  return {
    generation: state.current,
    previousGeneration: state.current,
    revision: stateRevisions.get(state) ?? 0,
  };
}
/** Disconnect shared-auth clients whose generation no longer matches the expected one. */
function disconnectStaleSharedGatewayAuthClients(params) {
  for (const gatewayClient of params.clients) {
    if (!gatewayClient.usesSharedGatewayAuth) continue;
    if (gatewayClient.sharedGatewaySessionGeneration === params.expectedGeneration) continue;
    try {
      gatewayClient.socket.close(4001, "gateway auth changed");
    } catch {}
  }
}
/** Disconnect every shared-auth client regardless of generation. */
function disconnectAllSharedGatewayAuthClients(clients) {
  for (const gatewayClient of clients) {
    if (!gatewayClient.usesSharedGatewayAuth) continue;
    try {
      gatewayClient.socket.close(4001, "gateway auth changed");
    } catch {}
  }
}
/** Resolve the generation clients must use, treating null as "current is required". */
function getRequiredSharedGatewaySessionGeneration(state) {
  return state.required === null ? state.current : state.required;
}
/** Claim current generation while preserving required until its transaction commits. */
function claimSharedGatewaySessionGeneration(state, generation) {
  const previousGeneration = state.current;
  state.current = generation;
  return {
    generation,
    previousGeneration,
    revision: advanceStateRevision(state),
  };
}
/** Claim current only while no later generation-state writer has run. */
function claimSharedGatewaySessionGenerationIfOwned(state, ownership, generation) {
  if (!isSharedGatewaySessionGenerationOwnershipCurrent(state, ownership)) return null;
  return claimSharedGatewaySessionGeneration(state, generation);
}
/** Check whether a transaction still owns all generation-state mutations. */
function isSharedGatewaySessionGenerationOwnershipCurrent(state, ownership) {
  return (stateRevisions.get(state) ?? 0) === ownership.revision;
}
/** Replace both generation fields as one ownership-changing mutation. */
function replaceSharedGatewaySessionGenerationState(state, next) {
  state.current = next.current;
  state.required = next.required;
  advanceStateRevision(state);
}
/** Replace both fields only while the caller still owns generation state. */
function replaceOwnedSharedGatewaySessionGenerationState(state, ownership, next) {
  if (!isSharedGatewaySessionGenerationOwnershipCurrent(state, ownership)) return false;
  replaceSharedGatewaySessionGenerationState(state, next);
  return true;
}
/** Restore current only while preserving the required marker owned by the transaction. */
function restoreOwnedCurrentSharedGatewaySessionGeneration(state, ownership, current) {
  if (!isSharedGatewaySessionGenerationOwnershipCurrent(state, ownership)) return false;
  state.current = current;
  advanceStateRevision(state);
  return true;
}
/** Update the required marker as one ownership-changing mutation. */
function setRequiredSharedGatewaySessionGeneration(state, required) {
  state.required = required;
  advanceStateRevision(state);
}
/** Update required only while no later generation-state writer has run. */
function setRequiredSharedGatewaySessionGenerationIfOwned(state, ownership, required) {
  if (!isSharedGatewaySessionGenerationOwnershipCurrent(state, ownership)) return null;
  setRequiredSharedGatewaySessionGeneration(state, required);
  return captureSharedGatewaySessionGenerationOwnership(state);
}
/** Finalize only while no later generation-state writer has replaced this owner. */
function finalizeOwnedSharedGatewaySessionGeneration(state, ownership) {
  if (!isSharedGatewaySessionGenerationOwnershipCurrent(state, ownership)) return false;
  state.current = ownership.generation;
  if (
    state.required === ownership.generation ||
    (state.required !== null && ownership.previousGeneration !== ownership.generation)
  )
    state.required = null;
  advanceStateRevision(state);
  return true;
}
/** Enforce shared auth generation behavior after a config write. */
function enforceSharedGatewaySessionGenerationForConfigWrite(params) {
  const reloadMode = resolveGatewayReloadSettings(params.nextConfig).mode;
  const nextSharedGatewaySessionGeneration = params.resolveRuntimeSnapshotGeneration();
  if (reloadMode === "off") {
    replaceSharedGatewaySessionGenerationState(params.state, {
      current: nextSharedGatewaySessionGeneration,
      required: nextSharedGatewaySessionGeneration,
    });
    disconnectStaleSharedGatewayAuthClients({
      clients: params.clients,
      expectedGeneration: nextSharedGatewaySessionGeneration,
    });
    return;
  }
  replaceSharedGatewaySessionGenerationState(params.state, {
    current: nextSharedGatewaySessionGeneration,
    required: null,
  });
  disconnectStaleSharedGatewayAuthClients({
    clients: params.clients,
    expectedGeneration: nextSharedGatewaySessionGeneration,
  });
}
//#endregion
export {
  enforceSharedGatewaySessionGenerationForConfigWrite as a,
  isSharedGatewaySessionGenerationOwnershipCurrent as c,
  setRequiredSharedGatewaySessionGenerationIfOwned as d,
  disconnectStaleSharedGatewayAuthClients as i,
  replaceOwnedSharedGatewaySessionGenerationState as l,
  claimSharedGatewaySessionGenerationIfOwned as n,
  finalizeOwnedSharedGatewaySessionGeneration as o,
  disconnectAllSharedGatewayAuthClients as r,
  getRequiredSharedGatewaySessionGeneration as s,
  captureSharedGatewaySessionGenerationOwnership as t,
  restoreOwnedCurrentSharedGatewaySessionGeneration as u,
};
