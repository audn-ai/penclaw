//#region src/cli/signal-exit-barrier.ts
const activeBarriers = /* @__PURE__ */ new Set();
const activeGates = /* @__PURE__ */ new Set();
function registerSignalExitGate(gate) {
  activeGates.add(gate);
  return () => activeGates.delete(gate);
}
function registerSignalExitBarrier(barrier) {
  activeBarriers.add(barrier);
  return () => activeBarriers.delete(barrier);
}
async function waitForSignalExitBarriers() {
  const gateResults = await Promise.allSettled(activeGates);
  const barrierResults = await Promise.allSettled([...activeBarriers].map((barrier) => barrier()));
  const failures = [...gateResults, ...barrierResults]
    .filter((result) => result.status === "rejected")
    .map((result) => result.reason);
  if (failures.length > 0) throw new AggregateError(failures, "Signal exit cleanup failed");
}
//#endregion
export {
  registerSignalExitGate as n,
  waitForSignalExitBarriers as r,
  registerSignalExitBarrier as t,
};
