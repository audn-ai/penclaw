import { t as closeTrackedBrowserTabsForSessions } from "./browser-maintenance-DirtFoi0.js";
//#region src/infra/non-fatal-cleanup.ts
/** Run cleanup and swallow failures after invoking the optional error hook. */
async function runBestEffortCleanup(params) {
  try {
    return await params.cleanup();
  } catch (error) {
    params.onError?.(error);
    return;
  }
}
//#endregion
//#region src/browser-lifecycle-cleanup.ts
function normalizeSessionKeys(sessionKeys) {
  const keys = /* @__PURE__ */ new Set();
  for (const sessionKey of sessionKeys) {
    const normalized = sessionKey.trim();
    if (normalized) keys.add(normalized);
  }
  return [...keys];
}
function isBrowserCleanupDisabled(cfg) {
  return cfg?.browser?.enabled === false || cfg?.plugins?.entries?.browser?.enabled === false;
}
async function cleanupBrowserSessionsForLifecycleEnd(params) {
  if (isBrowserCleanupDisabled(params.cfg)) return;
  const sessionKeys = normalizeSessionKeys(params.sessionKeys);
  if (sessionKeys.length === 0) return;
  await runBestEffortCleanup({
    cleanup: async () => {
      await closeTrackedBrowserTabsForSessions({
        sessionKeys,
        onWarn: params.onWarn,
      });
    },
    onError: params.onError,
  });
}
//#endregion
export { cleanupBrowserSessionsForLifecycleEnd as t };
