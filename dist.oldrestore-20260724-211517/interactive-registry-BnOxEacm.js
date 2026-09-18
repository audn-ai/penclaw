import { n as resolveGlobalDedupeCache } from "./dedupe-BqZ2YTEC.js";
import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
//#region src/plugins/interactive-shared.ts
function toPluginInteractiveRegistryKey(channel, namespace) {
  return `${normalizeOptionalLowercaseString(channel) ?? ""}:${namespace.trim()}`;
}
function normalizePluginInteractiveNamespace(namespace) {
  return namespace.trim();
}
function validatePluginInteractiveNamespace(namespace) {
  if (!namespace.trim()) return "Interactive handler namespace cannot be empty";
  if (!/^[A-Za-z0-9._-]+$/.test(namespace.trim()))
    return "Interactive handler namespace must contain only letters, numbers, dots, underscores, and hyphens";
  return null;
}
function resolvePluginInteractiveMatch(params) {
  const trimmedData = params.data.trim();
  if (!trimmedData) return null;
  const separatorIndex = trimmedData.indexOf(":");
  const namespace =
    separatorIndex >= 0
      ? trimmedData.slice(0, separatorIndex)
      : normalizePluginInteractiveNamespace(trimmedData);
  const registration = params.interactiveHandlers.get(
    toPluginInteractiveRegistryKey(params.channel, namespace),
  );
  if (!registration) return null;
  return {
    registration,
    namespace,
    payload: separatorIndex >= 0 ? trimmedData.slice(separatorIndex + 1) : "",
  };
}
//#endregion
//#region src/plugins/interactive-state.ts
const PLUGIN_INTERACTIVE_STATE_KEY = Symbol.for("openclaw.pluginInteractiveState");
const PLUGIN_INTERACTIVE_CALLBACK_DEDUPE_KEY = Symbol.for(
  "openclaw.pluginInteractiveCallbackDedupe",
);
function createInteractiveCallbackDedupe() {
  return resolveGlobalDedupeCache(PLUGIN_INTERACTIVE_CALLBACK_DEDUPE_KEY, {
    ttlMs: 5 * 6e4,
    maxSize: 4096,
  });
}
function createInteractiveState() {
  return {
    interactiveHandlers: /* @__PURE__ */ new Map(),
    callbackDedupe: createInteractiveCallbackDedupe(),
    inflightCallbackDedupe: /* @__PURE__ */ new Set(),
  };
}
function hydrateInteractiveState(value) {
  const state = typeof value === "object" && value !== null ? value : {};
  return {
    interactiveHandlers:
      state.interactiveHandlers instanceof Map
        ? state.interactiveHandlers
        : /* @__PURE__ */ new Map(),
    callbackDedupe: createInteractiveCallbackDedupe(),
    inflightCallbackDedupe:
      state.inflightCallbackDedupe instanceof Set
        ? state.inflightCallbackDedupe
        : /* @__PURE__ */ new Set(),
  };
}
function getState() {
  const globalStore = globalThis;
  const existing = globalStore[PLUGIN_INTERACTIVE_STATE_KEY];
  if (existing !== void 0) {
    const hydrated = hydrateInteractiveState(existing);
    globalStore[PLUGIN_INTERACTIVE_STATE_KEY] = hydrated;
    return hydrated;
  }
  const created = createInteractiveState();
  globalStore[PLUGIN_INTERACTIVE_STATE_KEY] = created;
  return created;
}
/** Returns the process-global plugin interactive handler registry. */
function getPluginInteractiveHandlersState() {
  return getState().interactiveHandlers;
}
function getPluginInteractiveCallbackDedupeState() {
  return getState().callbackDedupe;
}
/** Claims an interactive callback dedupe key while the callback is in flight. */
function claimPluginInteractiveCallbackDedupe(dedupeKey, now = Date.now()) {
  if (!dedupeKey) return true;
  const state = getState();
  if (state.inflightCallbackDedupe.has(dedupeKey) || state.callbackDedupe.peek(dedupeKey, now))
    return false;
  state.inflightCallbackDedupe.add(dedupeKey);
  return true;
}
/** Commits an interactive callback dedupe key after successful handling. */
function commitPluginInteractiveCallbackDedupe(dedupeKey, now = Date.now()) {
  if (!dedupeKey) return;
  const state = getState();
  state.inflightCallbackDedupe.delete(dedupeKey);
  state.callbackDedupe.check(dedupeKey, now);
}
/** Releases an in-flight interactive callback dedupe claim without committing it. */
function releasePluginInteractiveCallbackDedupe(dedupeKey) {
  if (!dedupeKey) return;
  getState().inflightCallbackDedupe.delete(dedupeKey);
}
/** Clears plugin interactive handlers and callback dedupe state. */
function clearPluginInteractiveHandlersState() {
  clearPluginInteractiveHandlerRegistrationsState();
  getPluginInteractiveCallbackDedupeState().clear();
  getState().inflightCallbackDedupe.clear();
}
/** Clears only plugin interactive handler registrations. */
function clearPluginInteractiveHandlerRegistrationsState() {
  getPluginInteractiveHandlersState().clear();
}
//#endregion
//#region src/plugins/interactive-registry.ts
/** Resolves a channel payload to a registered plugin interactive namespace handler. */
function resolvePluginInteractiveNamespaceMatch(channel, data) {
  return resolvePluginInteractiveMatch({
    interactiveHandlers: getPluginInteractiveHandlersState(),
    channel,
    data,
  });
}
/** Resolves a handler from registry-owned registrations without changing global state. */
function resolvePluginInteractiveRegistrationsMatch(registrations, channel, data) {
  return resolvePluginInteractiveMatch({
    interactiveHandlers: {
      get: (key) =>
        registrations.find(
          (registration) =>
            toPluginInteractiveRegistryKey(registration.channel, registration.namespace) === key,
        ),
    },
    channel,
    data,
  });
}
/** Registers one plugin interactive namespace for a channel. */
function registerPluginInteractiveHandlerWithOptions(pluginId, registration, opts) {
  const interactiveHandlers = getPluginInteractiveHandlersState();
  const namespace = normalizePluginInteractiveNamespace(registration.namespace);
  const validationError = validatePluginInteractiveNamespace(namespace);
  if (validationError)
    return {
      ok: false,
      error: validationError,
    };
  const key = toPluginInteractiveRegistryKey(registration.channel, namespace);
  const existing = interactiveHandlers.get(key);
  if (existing)
    return {
      ok: false,
      error: `Interactive handler namespace "${namespace}" already registered by plugin "${existing.pluginId}"`,
    };
  interactiveHandlers.set(key, {
    ...registration,
    namespace,
    channel: normalizeOptionalLowercaseString(registration.channel) ?? "",
    pluginId,
    pluginName: opts?.pluginName,
    pluginRoot: opts?.pluginRoot,
    registryOwned: opts?.registryOwned,
  });
  return { ok: true };
}
/** Registers one process-global interactive handler. */
function registerPluginInteractiveHandler(pluginId, registration, opts) {
  return registerPluginInteractiveHandlerWithOptions(pluginId, registration, opts);
}
/** Registers one handler whose lifetime follows its owning plugin registry. */
function registerRegistryPluginInteractiveHandler(pluginId, registration, opts) {
  return registerPluginInteractiveHandlerWithOptions(pluginId, registration, {
    ...opts,
    registryOwned: true,
  });
}
/** Clears all active plugin interactive handlers. */
function clearPluginInteractiveHandlers() {
  clearPluginInteractiveHandlersState();
}
/** Clears stored plugin interactive handler registrations. */
function clearPluginInteractiveHandlerRegistrations() {
  clearPluginInteractiveHandlerRegistrationsState();
}
/** Clears active interactive handlers owned by one plugin. */
function clearPluginInteractiveHandlersForPlugin(pluginId) {
  const interactiveHandlers = getPluginInteractiveHandlersState();
  for (const [key, value] of interactiveHandlers.entries())
    if (value.pluginId === pluginId) interactiveHandlers.delete(key);
}
/** Lists active plugin interactive handlers. */
function listPluginInteractiveHandlers() {
  return Array.from(getPluginInteractiveHandlersState().values());
}
/** Restores active plugin interactive handlers from a saved registry snapshot. */
function restorePluginInteractiveHandlers(registrations) {
  clearPluginInteractiveHandlerRegistrations();
  const interactiveHandlers = getPluginInteractiveHandlersState();
  for (const registration of registrations) {
    const namespace = normalizePluginInteractiveNamespace(registration.namespace);
    if (!namespace) continue;
    interactiveHandlers.set(toPluginInteractiveRegistryKey(registration.channel, namespace), {
      ...registration,
      namespace,
      channel: normalizeOptionalLowercaseString(registration.channel) ?? "",
    });
  }
}
//#endregion
export {
  registerRegistryPluginInteractiveHandler as a,
  restorePluginInteractiveHandlers as c,
  releasePluginInteractiveCallbackDedupe as d,
  registerPluginInteractiveHandler as i,
  claimPluginInteractiveCallbackDedupe as l,
  clearPluginInteractiveHandlersForPlugin as n,
  resolvePluginInteractiveNamespaceMatch as o,
  listPluginInteractiveHandlers as r,
  resolvePluginInteractiveRegistrationsMatch as s,
  clearPluginInteractiveHandlers as t,
  commitPluginInteractiveCallbackDedupe as u,
};
