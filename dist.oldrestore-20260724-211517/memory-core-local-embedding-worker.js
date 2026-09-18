import {
  n as createLocalEmbeddingProviderInProcess,
  r as getLocalEmbeddingRuntimeFacts,
} from "./embeddings-B6h5v7TW.js";
//#region packages/memory-host-sdk/src/host/embeddings-worker-child.ts
let provider = null;
let providerOptionsKey = null;
let requestQueue = Promise.resolve();
/** Send one JSON IPC message when the child still has an IPC channel. */
function send(message) {
  if (typeof process.send === "function") process.send(message);
}
/** Reuse the current provider while options are unchanged, otherwise rebuild it. */
async function getProvider(options) {
  const key = JSON.stringify(options);
  if (provider && providerOptionsKey === key) return provider;
  await provider?.close?.();
  provider = await createLocalEmbeddingProviderInProcess(options);
  providerOptionsKey = key;
  return provider;
}
/** Close and forget the active in-process provider. */
async function closeProvider() {
  const current = provider;
  provider = null;
  providerOptionsKey = null;
  await current?.close?.();
}
/** Preserve error message and code across JSON IPC. */
function serializeError(err) {
  if (!(err instanceof Error)) return { message: String(err) };
  const code = err.code;
  return {
    message: err.message,
    ...(typeof code === "string" ? { code } : {}),
  };
}
/** Handle one parent request after queue serialization. */
async function handleRequest(request) {
  if (request.type === "close") {
    await closeProvider();
    send({
      id: request.id,
      ok: true,
    });
    return;
  }
  const currentProvider = await getProvider(request.options);
  if (request.type === "initialize") {
    send({
      id: request.id,
      ok: true,
      runtimeFacts: getLocalEmbeddingRuntimeFacts(currentProvider),
    });
    return;
  }
  if (request.type === "embedQuery") {
    const value = await currentProvider.embedQuery(request.text);
    send({
      id: request.id,
      ok: true,
      value,
      runtimeFacts: getLocalEmbeddingRuntimeFacts(currentProvider),
    });
    return;
  }
  const value = await currentProvider.embedBatch(request.texts);
  send({
    id: request.id,
    ok: true,
    value,
    runtimeFacts: getLocalEmbeddingRuntimeFacts(currentProvider),
  });
}
process.on("message", (message) => {
  const request = message;
  requestQueue = requestQueue.then(async () => {
    try {
      await handleRequest(request);
    } catch (err) {
      send({
        id: request.id,
        ok: false,
        error: serializeError(err),
        runtimeFacts: getLocalEmbeddingRuntimeFacts(provider),
      });
    }
  });
});
process.once("disconnect", () => {
  closeProvider().finally(() => {
    process.exit(0);
  });
});
//#endregion
export {};
