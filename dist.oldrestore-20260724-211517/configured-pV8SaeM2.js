//#region src/hooks/legacy-config.ts
/** Read legacy hooks.internal.handlers entries for backward-compatible config detection. */
function getLegacyInternalHookHandlers(config) {
  const handlers = config?.hooks?.internal?.handlers;
  return Array.isArray(handlers) ? handlers : [];
}
//#endregion
//#region src/hooks/configured.ts
function hasEnabledFlag(entry) {
  return entry?.enabled !== false;
}
function hasEnabledEntry(entries) {
  if (!entries) return false;
  return Object.values(entries).some(hasEnabledFlag);
}
function hasConfiguredInstalls(installs) {
  return installs ? Object.keys(installs).length > 0 : false;
}
/** Return whether config can load any internal hooks, including legacy handlers. */
function hasConfiguredInternalHooks(config) {
  const internal = config.hooks?.internal;
  if (!internal || internal.enabled === false) return false;
  if (internal.enabled === true) return true;
  if (hasEnabledEntry(internal.entries)) return true;
  if ((internal.load?.extraDirs ?? []).some((dir) => dir.trim().length > 0)) return true;
  if (hasConfiguredInstalls(internal.installs)) return true;
  return getLegacyInternalHookHandlers(config).length > 0;
}
/** Resolve explicitly configured internal hook names; null means all/discovered hooks may load. */
function resolveConfiguredInternalHookNames(config) {
  const internal = config.hooks?.internal;
  if (!internal || internal.enabled === false) return /* @__PURE__ */ new Set();
  if (internal.enabled === true) return null;
  const names = /* @__PURE__ */ new Set();
  for (const [name, entry] of Object.entries(internal.entries ?? {})) {
    const trimmed = name.trim();
    if (trimmed && hasEnabledFlag(entry)) names.add(trimmed);
  }
  for (const [installId, install] of Object.entries(internal.installs ?? {})) {
    const hookNames = install.hooks ?? [];
    if (hookNames.length === 0 && installId.trim()) return null;
    for (const hookName of hookNames) {
      const trimmedHookName = hookName.trim();
      if (trimmedHookName) names.add(trimmedHookName);
    }
  }
  if ((internal.load?.extraDirs ?? []).some((dir) => dir.trim().length > 0)) return null;
  if (getLegacyInternalHookHandlers(config).length > 0) return null;
  return names;
}
//#endregion
export {
  resolveConfiguredInternalHookNames as n,
  getLegacyInternalHookHandlers as r,
  hasConfiguredInternalHooks as t,
};
