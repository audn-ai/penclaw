//#region src/gateway/worker-environments/placement-worker-gate.ts
function claimForBinding(record, binding) {
  const persisted = record?.turnClaim;
  if (
    !record ||
    (record.state !== "active" && record.state !== "draining") ||
    record.environmentId !== binding.environmentId ||
    record.activeOwnerEpoch !== binding.ownerEpoch ||
    persisted?.owner !== "worker" ||
    persisted.runId !== binding.runId ||
    persisted.ownerEpoch !== binding.ownerEpoch
  )
    return;
  return {
    sessionId: binding.sessionId,
    claimId: persisted.claimId,
    runId: persisted.runId,
    placementGeneration: persisted.generation,
    owner: {
      kind: "worker",
      environmentId: binding.environmentId,
      ownerEpoch: binding.ownerEpoch,
    },
  };
}
function createWorkerSessionPlacementGate(store) {
  const validateWorkerTurn = (binding) => {
    const claim = claimForBinding(store.get(binding.sessionId), binding);
    return claim ? store.validateTurnClaim(claim) : false;
  };
  return {
    validateWorkerTurn,
    updateAckCursors(binding) {
      const claim = claimForBinding(store.get(binding.sessionId), binding);
      if (!claim) throw new Error(`Cannot ACK stale worker turn for session ${binding.sessionId}`);
      store.updateAckCursors({
        claim,
        ...(binding.transcriptSeq === void 0 ? {} : { transcript: binding.transcriptSeq }),
        ...(binding.liveSeq === void 0 ? {} : { liveEvent: binding.liveSeq }),
      });
    },
  };
}
//#endregion
export { createWorkerSessionPlacementGate };
