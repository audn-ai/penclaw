import { r as resolveBrowserConfig } from "./config-CzdiqFrD.js";
import { t as collectErrorGraphCandidates } from "./errors-BoHeli7m.js";
import { t as getExtensionRelayModule } from "./extension-relay.runtime.js";
import { i as getRuntimeConfig } from "./io-B3ne6NxF.js";
import "./error-runtime-BIAwr399.js";
import "./runtime-env-D0V-7Gqz.js";
import "./routing-CwvmVRHd.js";
import {
  d as markBrowserRuntimeStopping,
  r as beginProfileTransition,
} from "./server-context.lifecycle-CPismpkV.js";
import {
  a as isSubagentSessionKey,
  i as isCronSessionKey,
  n as isAcpSessionKey,
} from "./session-key-utils-B8sNp9l4.js";
import { n as sweepTrackedBrowserTabs } from "./session-tab-registry-RbALbK2T.js";
import { l as registerUnhandledRejectionHandler } from "./unhandled-rejections-DwDskC0u.js";
import "./config-B4sqH_Om.js";
//#region extensions/browser/src/browser/server-lifecycle.ts
/** Browser server lifecycle helpers for parallel profile shutdown. */
/** Invalidate every profile before awaiting any cleanup, then drain in parallel. */
async function stopKnownBrowserProfiles(params) {
  const drains = [...params.current.profiles.values()].map((runtime) =>
    beginProfileTransition({
      state: params.current,
      runtime,
      reason: "Browser runtime shutdown",
      closeSharedAdapters: params.closeSharedAdapters,
    }),
  );
  const failed = (await Promise.allSettled(drains)).find((result) => result.status === "rejected");
  if (failed?.status === "rejected") {
    params.onWarn(`openclaw browser stop failed: ${String(failed.reason)}`);
    throw failed.reason;
  }
}
//#endregion
//#region extensions/browser/src/browser/session-tab-cleanup.ts
/**
 * Periodic cleanup for browser tabs tracked to primary OpenClaw sessions.
 */
const MIN_SWEEP_INTERVAL_MS = 6e4;
function minutesToMs(minutes) {
  return Math.max(0, Math.floor(minutes * 6e4));
}
/** Returns true for user-facing sessions whose tabs should be tracked for cleanup. */
function isPrimaryTrackedBrowserSessionKey(sessionKey) {
  return (
    !isSubagentSessionKey(sessionKey) &&
    !isCronSessionKey(sessionKey) &&
    !isAcpSessionKey(sessionKey)
  );
}
function resolveBrowserTabCleanupRuntimeConfig() {
  const cfg = getRuntimeConfig();
  return resolveBrowserConfig(cfg.browser, cfg).tabCleanup;
}
/** Runs one Browser tab cleanup sweep from runtime config or injected test config. */
async function runTrackedBrowserTabCleanupOnce(params) {
  const cleanup = params?.cleanup ?? resolveBrowserTabCleanupRuntimeConfig();
  if (!cleanup.enabled) return 0;
  return await sweepTrackedBrowserTabs({
    now: params?.now,
    idleMs: minutesToMs(cleanup.idleMinutes),
    maxTabsPerSession: cleanup.maxTabsPerSession,
    sessionFilter: isPrimaryTrackedBrowserSessionKey,
    closeTab: params?.closeTab,
    onWarn: params?.onWarn,
  });
}
/** Starts the recurring Browser tab cleanup timer and returns its disposer. */
function startTrackedBrowserTabCleanupTimer(params) {
  let stopped = false;
  let timer = null;
  let running = null;
  const schedule = () => {
    if (stopped) return;
    let sweepMinutes = 5;
    try {
      sweepMinutes = resolveBrowserTabCleanupRuntimeConfig().sweepMinutes;
    } catch (err) {
      params.onWarn(`failed to resolve browser tab cleanup config: ${String(err)}`);
    }
    timer = setTimeout(run, Math.max(MIN_SWEEP_INTERVAL_MS, minutesToMs(sweepMinutes)));
    timer.unref?.();
  };
  const run = () => {
    if (stopped) return;
    if (!running) {
      running = runTrackedBrowserTabCleanupOnce({ onWarn: params.onWarn }).finally(() => {
        running = null;
        schedule();
      });
      return;
    }
    schedule();
  };
  schedule();
  return async () => {
    stopped = true;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    await running?.catch(() => {});
  };
}
//#endregion
//#region extensions/browser/src/browser/unhandled-rejections.ts
/**
 * Browser-specific unhandled rejection filter for benign Playwright dialog
 * races.
 */
const PLAYWRIGHT_DIALOG_METHODS = /* @__PURE__ */ new Set([
  "Page.handleJavaScriptDialog",
  "Dialog.handleJavaScriptDialog",
]);
const NO_DIALOG_MESSAGE = "no dialog is showing";
function readMessage(err) {
  if (typeof err === "string") return err;
  if (!err || typeof err !== "object") return "";
  const message = err.message;
  return typeof message === "string" ? message : "";
}
function readPlaywrightMethod(err) {
  if (!err || typeof err !== "object") return;
  const method = err.method;
  return typeof method === "string" ? method : void 0;
}
/** Detects Playwright "no dialog is showing" races that can escape as rejections. */
function isPlaywrightDialogRaceUnhandledRejection(reason) {
  for (const candidate of collectErrorGraphCandidates(reason, (current) => [
    current.cause,
    current.reason,
    current.original,
    current.error,
    current.data,
    ...(Array.isArray(current.errors) ? current.errors : []),
  ])) {
    const message = readMessage(candidate);
    if (!message.toLowerCase().includes(NO_DIALOG_MESSAGE)) continue;
    const method = readPlaywrightMethod(candidate);
    if (method && PLAYWRIGHT_DIALOG_METHODS.has(method)) return true;
    for (const playwrightMethod of PLAYWRIGHT_DIALOG_METHODS)
      if (message.includes(playwrightMethod)) return true;
  }
  return false;
}
/** Installs the Browser unhandled-rejection filter and returns its disposer. */
function registerBrowserUnhandledRejectionHandler() {
  return registerUnhandledRejectionHandler(isPlaywrightDialogRaceUnhandledRejection);
}
//#endregion
//#region extensions/browser/src/browser/runtime-lifecycle.ts
const trackedTabCleanupDisposers = /* @__PURE__ */ new WeakMap();
/** Creates Browser server state and starts runtime-wide cleanup handlers. */
async function createBrowserRuntimeState(params) {
  const state = {
    server: params.server ?? null,
    port: params.port,
    resolved: params.resolved,
    profiles: /* @__PURE__ */ new Map(),
  };
  const stopTrackedTabCleanup = startTrackedBrowserTabCleanupTimer({ onWarn: params.onWarn });
  trackedTabCleanupDisposers.set(state, stopTrackedTabCleanup);
  state.stopTrackedTabCleanup = () => {
    stopTrackedTabCleanup().catch(() => {});
  };
  state.stopUnhandledRejectionHandler = registerBrowserUnhandledRejectionHandler();
  return state;
}
async function stopBrowserRuntimeInternal(params, finalizeGlobalAdapters) {
  const current = params.current;
  if (!current) return;
  markBrowserRuntimeStopping(current);
  let firstError;
  const profileDrain = stopKnownBrowserProfiles({
    current,
    closeSharedAdapters: finalizeGlobalAdapters,
    onWarn: params.onWarn,
  });
  const stopTrackedTabCleanup = trackedTabCleanupDisposers.get(current);
  const tabCleanup = Promise.resolve().then(async () => {
    if (stopTrackedTabCleanup) await stopTrackedTabCleanup();
    else current.stopTrackedTabCleanup?.();
  });
  for (const result of await Promise.allSettled([profileDrain, tabCleanup]))
    if (result.status === "rejected")
      firstError ??= toRuntimeLifecycleError(result.reason, "Browser profile cleanup failed.");
  if (current.extensionRelays?.size)
    try {
      const { stopExtensionRelays } = await getExtensionRelayModule();
      await stopExtensionRelays(current);
    } catch (err) {
      firstError ??= toRuntimeLifecycleError(err, "Browser relay cleanup failed.");
    }
  if (finalizeGlobalAdapters)
    try {
      const { disposeGatewayExtensionRelay } = await import("./gateway-relay-route-BCURm2dl.js");
      disposeGatewayExtensionRelay();
    } catch (err) {
      firstError ??= toRuntimeLifecycleError(err, "Gateway browser relay cleanup failed.");
    }
  if (!firstError) {
    if (params.closeServer && current.server)
      await new Promise((resolve) => {
        current.server?.close(() => resolve());
      });
    params.clearState();
    trackedTabCleanupDisposers.delete(current);
    current.stopUnhandledRejectionHandler?.();
  }
  if (firstError) throw firstError;
}
function toRuntimeLifecycleError(value, message) {
  return value instanceof Error ? value : new Error(message, { cause: value });
}
/** Stops Browser profiles, the optional HTTP server, and loaded Playwright state. */
async function stopBrowserRuntime(params) {
  await stopBrowserRuntimeInternal(params, true);
}
/** Internal bridge shutdown leaves process-global adapters owned by the main runtime intact. */
async function stopBrowserBridgeRuntime(params) {
  await stopBrowserRuntimeInternal(params, false);
}
//#endregion
export { stopBrowserBridgeRuntime as n, stopBrowserRuntime as r, createBrowserRuntimeState as t };
