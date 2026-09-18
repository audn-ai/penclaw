import { n as resolveGlobalSingleton } from "./global-singleton-PwlQSEal.js";
//#region src/agents/session-placement-admission.ts
const state = resolveGlobalSingleton(
  Symbol.for("openclaw.sessionPlacementAdmissionState"),
  () => ({}),
);
function installSessionPlacementAdmissionProvider(provider) {
  state.provider = provider;
  return () => {
    if (state.provider === provider) state.provider = void 0;
  };
}
function installSessionPlacementResetGuard(guard) {
  state.resetGuard = guard;
  return () => {
    if (state.resetGuard === guard) state.resetGuard = void 0;
  };
}
function resolveSessionPlacementResetBlock(sessionId) {
  return state.resetGuard?.(sessionId);
}
async function withSessionPlacementTurnAdmission(claim, params, task) {
  const provider = state.provider;
  if (!provider) return await task();
  return await provider.executeTurn(claim, params, task);
}
async function withLocalSessionPlacementTurnAdmission(claim, task) {
  const provider = state.provider;
  if (!provider) return await task();
  return await provider.executeLocalTurn(claim, task);
}
//#endregion
export {
  withSessionPlacementTurnAdmission as a,
  withLocalSessionPlacementTurnAdmission as i,
  installSessionPlacementResetGuard as n,
  resolveSessionPlacementResetBlock as r,
  installSessionPlacementAdmissionProvider as t,
};
