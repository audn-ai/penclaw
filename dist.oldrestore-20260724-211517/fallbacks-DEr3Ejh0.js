import {
  i as removeFallbackCommand,
  n as clearFallbacksCommand,
  r as listFallbacksCommand,
  t as addFallbackCommand,
} from "./fallbacks-shared-C6l6S9Av.js";
//#region src/commands/models/fallbacks.ts
/** Lists configured text model fallbacks. */
async function modelsFallbacksListCommand(opts, runtime) {
  return await listFallbacksCommand(
    {
      label: "Fallbacks",
      key: "model",
    },
    opts,
    runtime,
  );
}
/** Adds a text model fallback. */
async function modelsFallbacksAddCommand(modelRaw, runtime) {
  return await addFallbackCommand(
    {
      label: "Fallbacks",
      key: "model",
      logPrefix: "Fallbacks",
    },
    modelRaw,
    runtime,
  );
}
/** Removes a text model fallback. */
async function modelsFallbacksRemoveCommand(modelRaw, runtime) {
  return await removeFallbackCommand(
    {
      label: "Fallbacks",
      key: "model",
      notFoundLabel: "Fallback",
      logPrefix: "Fallbacks",
    },
    modelRaw,
    runtime,
  );
}
/** Clears all text model fallbacks. */
async function modelsFallbacksClearCommand(runtime) {
  return await clearFallbacksCommand(
    {
      key: "model",
      clearedMessage: "Fallback list cleared.",
    },
    runtime,
  );
}
//#endregion
export {
  modelsFallbacksAddCommand,
  modelsFallbacksClearCommand,
  modelsFallbacksListCommand,
  modelsFallbacksRemoveCommand,
};
