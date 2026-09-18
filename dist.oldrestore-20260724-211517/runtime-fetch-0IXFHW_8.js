import { t as normalizeHeadersInitForFetch } from "./fetch-headers-DPnOMwOE.js";
import { a as loadUndiciRuntimeDeps } from "./undici-runtime-Bm6J6FAw.js";
//#region src/infra/net/form-data.ts
function isFormDataLike(value) {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof value.entries === "function" &&
    value[Symbol.toStringTag] === "FormData"
  );
}
//#endregion
//#region src/infra/net/runtime-fetch.ts
function normalizeRuntimeFormData(body, RuntimeFormData) {
  if (!isFormDataLike(body) || typeof RuntimeFormData !== "function") return body;
  if (body instanceof RuntimeFormData) return body;
  const next = new RuntimeFormData();
  for (const [key, value] of body.entries()) {
    const namedValue = value;
    const fileName =
      typeof namedValue.name === "string" && namedValue.name.trim() ? namedValue.name : void 0;
    if (fileName) next.append(key, value, fileName);
    else next.append(key, value);
  }
  return next;
}
function normalizeRuntimeRequestInit(init, RuntimeFormData) {
  if (!init) return init;
  const normalizedHeaders = normalizeHeadersInitForFetch(init.headers);
  const initWithNormalizedHeaders =
    normalizedHeaders === init.headers
      ? init
      : {
          ...init,
          headers: normalizedHeaders,
        };
  if (!init.body) return initWithNormalizedHeaders;
  const body = normalizeRuntimeFormData(init.body, RuntimeFormData);
  if (body === init.body) return initWithNormalizedHeaders;
  const headers = new Headers(normalizedHeaders);
  headers.delete("content-length");
  headers.delete("content-type");
  return {
    ...initWithNormalizedHeaders,
    headers,
    body,
  };
}
/** Returns true for Vitest-style mocked fetch functions that should stay injectable. */
function isMockedFetch(fetchImpl) {
  if (typeof fetchImpl !== "function") return false;
  return typeof fetchImpl.mock === "object";
}
/** Uses the undici runtime fetch so callers can pass dispatcher-aware options. */
async function fetchWithRuntimeDispatcher(input, init) {
  return await fetchWithPreparedRuntimeDispatcher(loadUndiciRuntimeDeps(), input, init);
}
/** Uses one prepared Undici snapshot so reusable fetch wrappers stay stable. */
function fetchWithPreparedRuntimeDispatcher(runtimeDeps, input, init) {
  const runtimeFetch = runtimeDeps.fetch;
  return runtimeFetch(input, normalizeRuntimeRequestInit(init, runtimeDeps.FormData));
}
/**
 * Uses test-injected global fetch when present, otherwise preserves dispatcher
 * support by routing through the undici runtime fetch.
 */
async function fetchWithRuntimeDispatcherOrMockedGlobal(input, init) {
  if (isMockedFetch(globalThis.fetch)) return await globalThis.fetch(input, init);
  return await fetchWithRuntimeDispatcher(input, init);
}
//#endregion
export {
  isMockedFetch as i,
  fetchWithRuntimeDispatcher as n,
  fetchWithRuntimeDispatcherOrMockedGlobal as r,
  fetchWithPreparedRuntimeDispatcher as t,
};
