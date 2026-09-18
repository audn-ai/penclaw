import fs from "node:fs";
import { n as redactCdpUrl } from "./browser-config-BYZ1IWa3.js";
import {
  A as toBrowserErrorResponse,
  B as usesFastLoopbackCdpProbeClass,
  C as BrowserProfileUnavailableError,
  D as BrowserTargetAmbiguousError,
  E as BrowserTabNotFoundError,
  F as CHROME_MCP_ATTACH_READY_WINDOW_MS,
  R as PROFILE_ATTACH_RETRY_TIMEOUT_MS,
  S as BrowserProfileNotFoundError,
  a as fetchOk,
  g as withExactHostnamePolicy,
  i as fetchJson,
  l as normalizeCdpHttpBaseForJsonEndpoints,
  n as assertCdpEndpointAllowed,
  t as appendCdpPath,
  v as BROWSER_ERROR_REASONS,
  w as BrowserResetUnsupportedError,
  z as resolveCdpReachabilityTimeouts,
} from "./cdp.helpers-ChuUODxP.js";
import {
  A as assertBrowserNavigationResultAllowed,
  D as InvalidBrowserNavigationUrlError,
  M as requiresInspectableBrowserNavigationRedirectsForUrl,
  N as withBrowserNavigationPolicy,
  O as assertBrowserNavigationAllowed,
  P as resolveBrowserNavigationProxyMode,
  _ as normalizeCdpWsUrl,
  a as isChromeReachable,
  c as stopOpenClawChrome,
  d as diagnoseChromeCdp,
  f as formatChromeCdpDiagnostic,
  h as createTargetViaCdp,
  i as isChromeCdpReady,
  o as launchOpenClawChrome,
  r as isChromeCdpOwnedByPid,
  s as resolveOpenClawUserDataDir,
  t as ManagedChromeCleanupError,
} from "./chrome-C-Qf8Isl.js";
import { o as countChromeMcpTabs } from "./chrome-mcp-BUn6ZfOU.js";
import {
  a as resolveProfile,
  n as getOwnBrowserProfile,
  r as resolveBrowserConfig,
} from "./config-CzdiqFrD.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import { s as DEFAULT_BROWSER_LOCAL_CDP_READY_TIMEOUT_MS } from "./constants-C2_ZjRRD.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { t as getExtensionRelayModule } from "./extension-relay.runtime.js";
import { t as normalizeHostname } from "./hostname-DAZapKzN.js";
import { i as getRuntimeConfig } from "./io-B3ne6NxF.js";
import { s as getRuntimeConfigSourceSnapshot } from "./runtime-snapshot-BbbqRiDR.js";
import {
  a as getOrCreateProfileRuntime,
  b as getChromeMcpModule,
  c as isProfileGenerationCurrent,
  f as registerProfileHandle,
  g as getBrowserProfileCapabilities,
  h as getPwAiModule,
  i as enqueueProfileStart,
  l as isProfileRestartRequiredError,
  m as withProfileOperationLease,
  n as assertProfileLifecycleContext,
  o as getProfileLifecycle,
  p as releaseProfileHandle,
  r as beginProfileTransition,
  s as isBrowserRuntimeRunning,
  t as ProfileRestartRequiredError,
  u as isWithinProfileOperationLease,
} from "./server-context.lifecycle-CPismpkV.js";
import "./errors-CZhWrgPb.js";
import "./config-B4sqH_Om.js";
import { p as matchesHostnameAllowlist } from "./ssrf-keFRGQLq.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
} from "./string-coerce-DW4mBlAt.js";
import { t as movePathToTrash } from "./trash-DGM0lK0C.js";
//#region extensions/browser/src/browser/cdp-reachability-policy.ts
function withCdpControlHostname(profile, ssrfPolicy, requireAllowlistMatch = false) {
  const cdpHost = normalizeHostname(profile.cdpHost);
  if (!ssrfPolicy || !cdpHost) return ssrfPolicy;
  const hostnameAllowlist = (ssrfPolicy.hostnameAllowlist ?? [])
    .map((pattern) => normalizeHostname(pattern))
    .filter((pattern) => pattern && pattern !== "*" && pattern !== "*.");
  if (
    requireAllowlistMatch &&
    hostnameAllowlist.length > 0 &&
    !matchesHostnameAllowlist(cdpHost, hostnameAllowlist)
  )
    return ssrfPolicy;
  return withExactHostnamePolicy(ssrfPolicy, cdpHost);
}
function resolveCdpReachabilityPolicy(profile, ssrfPolicy) {
  const capabilities = getBrowserProfileCapabilities(profile);
  if (!capabilities.isRemote && profile.cdpIsLoopback && profile.driver === "openclaw") return;
  return withCdpControlHostname(profile, ssrfPolicy, capabilities.isRemote);
}
/** Alias used by callers that treat reachability and control as one CDP policy. */
const resolveCdpControlPolicy = resolveCdpReachabilityPolicy;
//#endregion
//#region extensions/browser/src/browser/config-refresh-source.ts
/**
 * Browser runtime config refresh source.
 *
 * Loads the source-backed runtime config snapshot when available so long-lived
 * browser routes can refresh from disk without changing config ownership.
 */
/** Load the best available config object for browser route runtime refresh. */
function loadBrowserConfigForRuntimeRefresh() {
  return getRuntimeConfigSourceSnapshot() ?? getRuntimeConfig();
}
//#endregion
//#region extensions/browser/src/browser/resolved-config-refresh.ts
/**
 * Runtime config refresh helpers for Browser profiles that can be hot-reloaded
 * without restarting the whole Browser plugin server.
 */
function changedProfileInvariants(current, next) {
  const changed = [];
  const currentUsesLocalManagedLaunch =
    current.driver === "openclaw" && !current.attachOnly && current.cdpIsLoopback;
  const nextUsesLocalManagedLaunch =
    next.driver === "openclaw" && !next.attachOnly && next.cdpIsLoopback;
  if (current.cdpUrl !== next.cdpUrl) changed.push("cdpUrl");
  if (current.cdpPort !== next.cdpPort) changed.push("cdpPort");
  if (current.driver !== next.driver) changed.push("driver");
  if (
    currentUsesLocalManagedLaunch &&
    nextUsesLocalManagedLaunch &&
    current.headless !== next.headless
  )
    changed.push("headless");
  if (
    currentUsesLocalManagedLaunch &&
    nextUsesLocalManagedLaunch &&
    current.executablePath !== next.executablePath
  )
    changed.push("executablePath");
  if (current.attachOnly !== next.attachOnly) changed.push("attachOnly");
  if (current.cdpIsLoopback !== next.cdpIsLoopback) changed.push("cdpIsLoopback");
  if ((current.userDataDir ?? "") !== (next.userDataDir ?? "")) changed.push("userDataDir");
  if ((current.mcpCommand ?? "") !== (next.mcpCommand ?? "")) changed.push("mcpCommand");
  if (
    current.mcpArgs?.length !== next.mcpArgs?.length ||
    current.mcpArgs?.some((arg, index) => arg !== next.mcpArgs?.[index])
  )
    changed.push("mcpArgs");
  return changed;
}
function queueRemovedProfileCleanup(params) {
  const actor = getProfileLifecycle(params.runtime);
  if (!params.initial && (!actor.blockedReason || actor.transitionReason)) return;
  params.runtime.lastTargetId = null;
  beginProfileTransition({
    state: params.current,
    runtime: params.runtime,
    reason: params.initial ? "profile removed from config" : "profile removal cleanup retry",
    terminal: "config-removed",
    advanceConfigRevision: params.initial,
    closeRelay: params.runtime.profile.driver === "extension",
    exposeReason: true,
  })
    .then(() => {
      if (params.current.profiles.get(params.name) === params.runtime)
        params.current.profiles.delete(params.name);
    })
    .catch(() => {});
}
function applyResolvedConfig(current, freshResolved) {
  current.resolved = {
    ...freshResolved,
    evaluateEnabled: current.resolved.evaluateEnabled,
  };
  for (const [name, runtime] of current.profiles) {
    const actor = getProfileLifecycle(runtime);
    if (actor.terminal === "config-removed") {
      queueRemovedProfileCleanup({
        current,
        name,
        runtime,
        initial: false,
      });
      continue;
    }
    if (actor.terminal) continue;
    const nextProfile = resolveProfile(freshResolved, name);
    if (nextProfile) {
      if (actor.blockedReason && !actor.transitionReason) {
        beginProfileTransition({
          state: current,
          runtime,
          reason: "profile invariant cleanup retry",
          captureProfileResources: false,
          exposeReason: true,
        }).catch(() => {});
        continue;
      }
      const changed = changedProfileInvariants(runtime.profile, nextProfile);
      if (changed.length > 0) {
        const previousProfile = runtime.profile;
        beginProfileTransition({
          state: current,
          runtime,
          reason: `profile invariants changed: ${changed.join(", ")}`,
          advanceConfigRevision: true,
          closeRelay: previousProfile.driver === "extension",
          exposeReason: true,
        }).catch(() => {});
        runtime.lastTargetId = null;
      }
      runtime.profile = nextProfile;
      continue;
    }
    queueRemovedProfileCleanup({
      current,
      name,
      runtime,
      initial: true,
    });
  }
}
/** Refreshes the Browser runtime's resolved config from disk when hot reload is enabled. */
function refreshResolvedBrowserConfigFromDisk(params) {
  if (!params.refreshConfigFromDisk) return;
  const cfg = loadBrowserConfigForRuntimeRefresh();
  const freshResolved = resolveBrowserConfig(cfg.browser, cfg);
  applyResolvedConfig(params.current, freshResolved);
}
/** Resolves a profile after an optional config reload. */
function resolveBrowserProfileWithHotReload(params) {
  refreshResolvedBrowserConfigFromDisk({
    current: params.current,
    refreshConfigFromDisk: params.refreshConfigFromDisk,
  });
  return resolveProfile(params.current.resolved, params.name);
}
//#endregion
//#region extensions/browser/src/browser/server-context.constants.ts
/**
 * Timing and size constants for Browser profile/tab runtime operations.
 */
const OPEN_TAB_DISCOVERY_WINDOW_MS = 2e3;
const CDP_READY_AFTER_LAUNCH_WINDOW_MS = DEFAULT_BROWSER_LOCAL_CDP_READY_TIMEOUT_MS;
//#endregion
//#region extensions/browser/src/browser/server-context.availability.ts
/**
 * Browser profile availability operations: reachability probes, managed Chrome
 * launch/restart, Chrome MCP attach, and profile stop handling.
 */
const MANAGED_LAUNCH_FAILURE_THRESHOLD = 3;
const MANAGED_LAUNCH_COOLDOWN_BASE_MS = 3e4;
const MANAGED_LAUNCH_COOLDOWN_MAX_MS = 5 * 6e4;
function launchOptionsForEnsure(options) {
  return typeof options?.headless === "boolean" ? { headlessOverride: options.headless } : void 0;
}
function ensureOptionsKey(options) {
  return typeof options?.headless === "boolean" ? `headless:${options.headless}` : "default";
}
function formatLocalPortOwnershipHint(profile) {
  const resetHint = `If OpenClaw should own this local profile, run action=reset-profile profile=${profile.name} to stop the conflicting process.`;
  if (!profile.cdpIsLoopback) return resetHint;
  return `${resetHint} If this port is an externally managed CDP service such as Browserless, set browser.profiles.${profile.name}.attachOnly=true so OpenClaw attaches without trying to manage the local process. For Browserless Docker, set EXTERNAL to the same WebSocket endpoint OpenClaw can reach via browser.profiles.<name>.cdpUrl.`;
}
function normalizeFailureMessage(err) {
  return (
    (err instanceof Error ? err.message : String(err)).trim() || "unknown browser launch failure"
  );
}
function resetManagedLaunchFailure(profileState) {
  profileState.managedLaunchFailure = void 0;
}
function recordManagedLaunchFailure(profileState, err) {
  const consecutiveFailures = (profileState.managedLaunchFailure?.consecutiveFailures ?? 0) + 1;
  const exponent = Math.max(0, consecutiveFailures - MANAGED_LAUNCH_FAILURE_THRESHOLD);
  const cooldownMs =
    consecutiveFailures >= MANAGED_LAUNCH_FAILURE_THRESHOLD
      ? Math.min(MANAGED_LAUNCH_COOLDOWN_MAX_MS, MANAGED_LAUNCH_COOLDOWN_BASE_MS * 2 ** exponent)
      : 0;
  const now = Date.now();
  profileState.managedLaunchFailure = {
    consecutiveFailures,
    lastFailureAt: now,
    ...(cooldownMs > 0 ? { cooldownUntil: now + cooldownMs } : {}),
    lastError: normalizeFailureMessage(err),
  };
}
function assertManagedLaunchNotCoolingDown(profileName, profileState) {
  const failure = profileState.managedLaunchFailure;
  if (!failure || failure.consecutiveFailures < MANAGED_LAUNCH_FAILURE_THRESHOLD) return;
  const remainingMs = (failure.cooldownUntil ?? 0) - Date.now();
  if (remainingMs <= 0) return;
  const retrySeconds = Math.max(1, Math.ceil(remainingMs / 1e3));
  throw new BrowserProfileUnavailableError(
    `Browser launch for profile "${profileName}" is cooling down after ${failure.consecutiveFailures} consecutive managed Chrome launch failures. Retry in ${retrySeconds}s after fixing Chrome startup, or set browser.enabled=false if the browser tool is not needed. Last error: ${failure.lastError}`,
  );
}
/** Builds reachability, ensure, and stop operations for one resolved browser profile. */
function createProfileAvailability({ opts, profile, state, runtime, configRevision }) {
  const redactedProfileCdpUrl = redactCdpUrl(profile.cdpUrl) ?? profile.cdpUrl;
  const capabilities = getBrowserProfileCapabilities(profile);
  const resolveTimeouts = (timeoutMs) =>
    resolveCdpReachabilityTimeouts({
      profileIsLoopback: profile.cdpIsLoopback,
      attachOnly: profile.attachOnly,
      timeoutMs,
      remoteHttpTimeoutMs: state().resolved.remoteCdpTimeoutMs,
      remoteHandshakeTimeoutMs: state().resolved.remoteCdpHandshakeTimeoutMs,
    });
  const getCdpReachabilityPolicy = () =>
    resolveCdpReachabilityPolicy(profile, state().resolved.ssrfPolicy);
  const ensureExtensionRelay = async (signal) => {
    signal?.throwIfAborted();
    if (capabilities.mode !== "local-extension") return;
    const { ensureExtensionRelayForProfile } = await getExtensionRelayModule();
    await ensureExtensionRelayForProfile(state(), profile);
    signal?.throwIfAborted();
  };
  const isReachable = async (timeoutMs, options) => {
    await ensureExtensionRelay(options?.signal);
    if (capabilities.usesChromeMcp) {
      const { countChromeMcpTabs } = await getChromeMcpModule();
      const callOptions = {};
      if (timeoutMs != null) callOptions.timeoutMs = timeoutMs;
      if (options?.ephemeral) callOptions.ephemeral = true;
      if (options?.signal) callOptions.signal = options.signal;
      await countChromeMcpTabs(profile.name, profile, callOptions);
      return true;
    }
    const { httpTimeoutMs, wsTimeoutMs } = resolveTimeouts(timeoutMs);
    return await isChromeCdpReady(
      profile.cdpUrl,
      httpTimeoutMs,
      wsTimeoutMs,
      getCdpReachabilityPolicy(),
    );
  };
  const isTransportAvailable = async (timeoutMs, signal) => {
    if (capabilities.usesChromeMcp) {
      const { ensureChromeMcpAvailable } = await getChromeMcpModule();
      await ensureChromeMcpAvailable(profile.name, profile, {
        ephemeral: true,
        timeoutMs,
        signal,
      });
      return true;
    }
    return await isReachable(timeoutMs, { signal });
  };
  const isHttpReachable = async (timeoutMs, signal) => {
    if (capabilities.usesChromeMcp) return await isTransportAvailable(timeoutMs, signal);
    await ensureExtensionRelay(signal);
    const { httpTimeoutMs } = resolveTimeouts(timeoutMs);
    return await isChromeReachable(profile.cdpUrl, httpTimeoutMs, getCdpReachabilityPolicy());
  };
  const describeCdpFailure = async (timeoutMs) => {
    const { httpTimeoutMs, wsTimeoutMs } = resolveTimeouts(timeoutMs);
    return formatChromeCdpDiagnostic(
      await diagnoseChromeCdp(
        profile.cdpUrl,
        httpTimeoutMs,
        wsTimeoutMs,
        getCdpReachabilityPolicy(),
      ),
    );
  };
  const stopExactRunning = async (profileState, running) => {
    try {
      await stopOpenClawChrome(running);
      releaseProfileHandle(profileState, running);
    } catch (err) {
      getProfileLifecycle(profileState).blockedReason = "managed Chrome cleanup failed";
      throw err;
    }
  };
  const adoptRunning = (params) => {
    const actor = getProfileLifecycle(params.profileState);
    if (
      !isProfileGenerationCurrent({
        state: state(),
        runtime: params.profileState,
        configRevision,
        generation: params.generation,
      })
    ) {
      params.signal.throwIfAborted();
      throw new BrowserProfileUnavailableError(
        `Browser start for profile "${profile.name}" was superseded.`,
      );
    }
    if (
      !actor.handles.has(params.running) ||
      params.running.proc.exitCode != null ||
      params.running.proc.signalCode != null
    )
      throw new BrowserProfileUnavailableError(
        `Managed Chrome for profile "${profile.name}" exited before adoption.`,
      );
    params.profileState.running = params.running;
  };
  const formatChromeMcpAttachFailure = (lastError) => {
    const detail = lastError instanceof Error ? ` Last error: ${lastError.message}` : "";
    const message = lastError instanceof Error ? lastError.message : "";
    if (message.includes("DevToolsActivePort") || message.includes("Could not connect to Chrome"))
      return (
        `Chrome MCP existing-session attach for profile "${profile.name}" could not connect to Chrome. Enable remote debugging in the browser inspect page, keep the browser open, approve the attach prompt, and retry. If you do not need your signed-in browser session, use the managed "openclaw" profile instead.` +
        detail
      );
    return `Chrome MCP existing-session attach for profile "${profile.name}" timed out waiting for tabs to become available. Approve the browser attach prompt, keep the browser open, and retry.${detail}`;
  };
  const waitForPoll = async (delayMs, signal) => {
    signal.throwIfAborted();
    await new Promise((resolve, reject) => {
      const finish = () => {
        signal.removeEventListener("abort", onAbort);
        resolve();
      };
      const timer = setTimeout(finish, delayMs);
      const onAbort = () => {
        clearTimeout(timer);
        signal.removeEventListener("abort", onAbort);
        reject(
          signal.reason instanceof Error
            ? signal.reason
            : new Error("Browser availability wait aborted.", { cause: signal.reason }),
        );
      };
      signal.addEventListener("abort", onAbort, { once: true });
      if (signal.aborted) onAbort();
    });
  };
  const waitForCdpReadyAfterLaunch = async (signal, running) => {
    const deadlineMs =
      Date.now() + (state().resolved.localCdpReadyTimeoutMs ?? CDP_READY_AFTER_LAUNCH_WINDOW_MS);
    while (Date.now() < deadlineMs) {
      const remainingMs = Math.max(0, deadlineMs - Date.now());
      const attemptTimeoutMs = Math.max(75, Math.min(250, remainingMs));
      signal.throwIfAborted();
      if (await isReachable(attemptTimeoutMs, { signal })) {
        const ownsEndpoint = await isChromeCdpOwnedByPid(
          profile.cdpUrl,
          running.pid,
          attemptTimeoutMs,
          getCdpReachabilityPolicy(),
        );
        signal.throwIfAborted();
        if (!ownsEndpoint)
          throw new BrowserProfileUnavailableError(
            `Managed Chrome for profile "${profile.name}" did not own its CDP endpoint.`,
          );
        return;
      }
      await waitForPoll(100, signal);
    }
    throw new Error(
      `Chrome CDP websocket for profile "${profile.name}" is not reachable after start. ${await describeCdpFailure(250)}`,
    );
  };
  const waitForChromeMcpReadyAfterAttach = async (signal) => {
    const deadlineMs = Date.now() + CHROME_MCP_ATTACH_READY_WINDOW_MS;
    let lastError;
    while (Date.now() < deadlineMs) {
      try {
        const { listChromeMcpTabs } = await getChromeMcpModule();
        await listChromeMcpTabs(profile.name, profile, { signal });
        return;
      } catch (err) {
        lastError = err;
      }
      signal.throwIfAborted();
      await waitForPoll(200, signal);
    }
    throw new BrowserProfileUnavailableError(formatChromeMcpAttachFailure(lastError));
  };
  const launchManagedChrome = async (profileState, current, launchOptions, signal) => {
    assertManagedLaunchNotCoolingDown(profile.name, profileState);
    try {
      return await launchOpenClawChrome(current.resolved, profile, {
        ...launchOptions,
        signal,
      });
    } catch (err) {
      if (err instanceof ManagedChromeCleanupError) {
        if (registerProfileHandle(profileState, err.running))
          getProfileLifecycle(profileState).blockedReason = "managed Chrome cleanup failed";
        throw err;
      }
      if (signal.aborted) throw err;
      if (
        !(
          err instanceof BrowserProfileUnavailableError &&
          err.metadata?.reason === BROWSER_ERROR_REASONS.noDisplayForHeadedProfile
        )
      )
        recordManagedLaunchFailure(profileState, err);
      throw err;
    }
  };
  const ensureBrowserAvailableOnce = async (signal, generation, options) => {
    signal.throwIfAborted();
    if (capabilities.usesChromeMcp) {
      if (profile.userDataDir && !fs.existsSync(profile.userDataDir))
        throw new BrowserProfileUnavailableError(
          `Browser user data directory not found for profile "${profile.name}": ${profile.userDataDir}`,
        );
      const { ensureChromeMcpAvailable } = await getChromeMcpModule();
      await ensureChromeMcpAvailable(profile.name, profile, { signal });
      await waitForChromeMcpReadyAfterAttach(signal);
      return;
    }
    const current = state();
    const remoteCdp = capabilities.isRemote;
    const attachOnly = profile.attachOnly;
    const httpReachable = await isHttpReachable(void 0, signal);
    const launchOptions = launchOptionsForEnsure(options);
    if (!httpReachable) {
      if ((attachOnly || remoteCdp) && opts.onEnsureAttachTarget) {
        await opts.onEnsureAttachTarget(profile);
        signal.throwIfAborted();
        if (await isHttpReachable(1200, signal)) return;
      }
      if (!attachOnly && !remoteCdp && profile.cdpIsLoopback && !runtime.running) {
        if ((await isHttpReachable(1200, signal)) && (await isReachable(1200, { signal }))) {
          resetManagedLaunchFailure(runtime);
          return;
        }
      }
      if (attachOnly || remoteCdp) {
        if (capabilities.mode === "local-extension") {
          const { EXTENSION_PAIRING_HINT } = await getExtensionRelayModule();
          throw new BrowserProfileUnavailableError(
            `The OpenClaw Chrome extension is not connected for profile "${profile.name}". Open Chrome on this machine and check the extension popup shows "Connected". ${EXTENSION_PAIRING_HINT}`,
          );
        }
        throw new BrowserProfileUnavailableError(
          remoteCdp
            ? `Remote CDP for profile "${profile.name}" is not reachable at ${redactedProfileCdpUrl}.`
            : `Browser attachOnly is enabled and profile "${profile.name}" is not running.`,
        );
      }
      if (runtime.running) throw new ProfileRestartRequiredError();
      const launched = await launchManagedChrome(runtime, current, launchOptions, signal);
      if (!registerProfileHandle(runtime, launched))
        throw new BrowserProfileUnavailableError(
          `Managed Chrome for profile "${profile.name}" exited before adoption.`,
        );
      try {
        await waitForCdpReadyAfterLaunch(signal, launched);
        adoptRunning({
          profileState: runtime,
          running: launched,
          generation,
          signal,
        });
        resetManagedLaunchFailure(runtime);
      } catch (err) {
        await stopExactRunning(runtime, launched);
        if (!signal.aborted) recordManagedLaunchFailure(runtime, err);
        throw err;
      }
      return;
    }
    if (await isReachable(void 0, { signal })) {
      resetManagedLaunchFailure(runtime);
      return;
    }
    if (attachOnly || remoteCdp) {
      if (opts.onEnsureAttachTarget) {
        await opts.onEnsureAttachTarget(profile);
        signal.throwIfAborted();
        if (await isReachable(1200, { signal })) return;
      }
      if (remoteCdp && (await isReachable(1200, { signal }))) return;
      if (capabilities.mode === "local-extension") {
        const { EXTENSION_PAIRING_HINT } = await getExtensionRelayModule();
        throw new BrowserProfileUnavailableError(
          `The extension relay for profile "${profile.name}" is running but the OpenClaw Chrome extension is not connected. ${EXTENSION_PAIRING_HINT}`,
        );
      }
      const detail = await describeCdpFailure(PROFILE_ATTACH_RETRY_TIMEOUT_MS);
      throw new BrowserProfileUnavailableError(
        remoteCdp
          ? `Remote CDP websocket for profile "${profile.name}" is not reachable. ${detail}`
          : `Browser attachOnly is enabled and CDP websocket for profile "${profile.name}" is not reachable. ${detail}`,
      );
    }
    if (!runtime.running) {
      const detail = await describeCdpFailure(PROFILE_ATTACH_RETRY_TIMEOUT_MS);
      throw new BrowserProfileUnavailableError(
        `Port ${profile.cdpPort} is in use for profile "${profile.name}" but not by openclaw. ${formatLocalPortOwnershipHint(profile)} ${detail}`,
      );
    }
    throw new ProfileRestartRequiredError();
  };
  const ensureBrowserAvailable = async (options) => {
    const key = ensureOptionsKey(options);
    for (;;)
      try {
        await enqueueProfileStart({
          state: state(),
          runtime,
          configRevision,
          key,
          signal: options?.signal,
          run: async (signal, generation) => {
            await ensureBrowserAvailableOnce(signal, generation, options);
          },
        });
        return;
      } catch (err) {
        if (!isProfileRestartRequiredError(err)) throw err;
        if (isWithinProfileOperationLease(runtime)) throw err;
        await beginProfileTransition({
          state: state(),
          runtime,
          reason: "managed Chrome restart required",
        });
      }
  };
  const stopRunningBrowser = async () => {
    assertProfileLifecycleContext({
      state: state(),
      runtime,
      configRevision,
    });
    resetManagedLaunchFailure(runtime);
    return {
      stopped:
        (
          await beginProfileTransition({
            state: state(),
            runtime,
            reason: "stop requested",
          })
        ).stopped ||
        profile.attachOnly ||
        capabilities.isRemote,
    };
  };
  return {
    isHttpReachable,
    isTransportAvailable,
    isReachable,
    ensureBrowserAvailable,
    stopRunningBrowser,
  };
}
//#endregion
//#region extensions/browser/src/browser/server-context.reset.ts
/**
 * Browser profile reset operations for local managed profiles.
 */
/** Builds the reset-profile operation for one resolved browser profile. */
function createProfileResetOps({
  profile,
  state,
  runtime,
  configRevision,
  resolveOpenClawUserDataDir,
}) {
  const capabilities = getBrowserProfileCapabilities(profile);
  const resetProfile = async () => {
    if (!capabilities.supportsReset)
      throw new BrowserResetUnsupportedError(
        `reset-profile is only supported for local profiles (profile "${profile.name}" is remote).`,
      );
    const userDataDir = resolveOpenClawUserDataDir(profile.name);
    assertProfileLifecycleContext({
      state: state(),
      runtime,
      configRevision,
    });
    runtime.managedLaunchFailure = void 0;
    let result = {
      moved: false,
      from: userDataDir,
    };
    await beginProfileTransition({
      state: state(),
      runtime,
      reason: "profile reset requested",
      afterCleanup: async () => {
        if (!fs.existsSync(userDataDir)) return;
        const moved = await movePathToTrash(userDataDir);
        result = {
          moved: true,
          from: userDataDir,
          to: moved,
        };
      },
    });
    return result;
  };
  return { resetProfile };
}
//#endregion
//#region extensions/browser/src/browser/target-id.ts
/**
 * Target id resolution helpers for Browser tab aliases and user-facing ids.
 */
/** Resolves exact tab references first, then unique raw target-id prefixes. */
function resolveTargetIdFromTabs(input, tabs) {
  const needle = input.trim();
  if (!needle)
    return {
      ok: false,
      reason: "not_found",
    };
  const exactMatches = [
    ...new Set(
      tabs
        .filter(
          (tab) =>
            tab.targetId === needle ||
            tab.suggestedTargetId === needle ||
            tab.tabId === needle ||
            tab.label === needle,
        )
        .map((tab) => tab.targetId),
    ),
  ];
  const onlyExact = exactMatches[0];
  if (exactMatches.length === 1 && onlyExact !== void 0)
    return {
      ok: true,
      targetId: onlyExact,
    };
  if (exactMatches.length > 1)
    return {
      ok: false,
      reason: "ambiguous",
      matches: exactMatches,
    };
  const lower = normalizeLowercaseStringOrEmpty(needle);
  const matches = tabs
    .map((t) => t.targetId)
    .filter((id) => normalizeLowercaseStringOrEmpty(id).startsWith(lower));
  const only = matches.length === 1 ? matches[0] : void 0;
  if (only)
    return {
      ok: true,
      targetId: only,
    };
  if (matches.length === 0)
    return {
      ok: false,
      reason: "not_found",
    };
  return {
    ok: false,
    reason: "ambiguous",
    matches,
  };
}
//#endregion
//#region extensions/browser/src/browser/server-context.selection.ts
/**
 * Browser tab selection operations for default tab choice, focus, and close.
 */
function mergeOpenedTabSnapshot(tabs, openedTab) {
  if (!openedTab) return tabs;
  const index = tabs.findIndex((tab) => tab.targetId === openedTab.targetId);
  if (index < 0) return [...tabs, openedTab];
  const listedTab = tabs[index];
  if (!listedTab || listedTab.wsUrl || !openedTab.wsUrl) return tabs;
  const merged = tabs.slice();
  merged[index] = {
    ...listedTab,
    wsUrl: openedTab.wsUrl,
  };
  return merged;
}
function waitForTabDiscoveryPoll() {
  return new Promise((resolve) => {
    setTimeout(resolve, 100);
  });
}
/** Builds tab selection/focus/close operations for one resolved browser profile. */
function createProfileSelectionOps({
  profile,
  runtime,
  getCdpControlPolicy,
  ensureBrowserAvailable,
  listTabs,
  openTab,
}) {
  const cdpHttpBase = normalizeCdpHttpBaseForJsonEndpoints(profile.cdpUrl);
  const capabilities = getBrowserProfileCapabilities(profile);
  const ensureTabAvailable = async (targetId, options, browserAlreadyEnsured = false) => {
    options?.signal?.throwIfAborted();
    if (!browserAlreadyEnsured) await ensureBrowserAvailable({ signal: options?.signal });
    options?.signal?.throwIfAborted();
    let lastNonEmptyTabs = [];
    let lastListError;
    let sawSuccessfulList = false;
    let openedTab;
    const readTabs = async () => {
      try {
        const tabs = await listTabs(options);
        sawSuccessfulList = true;
        if (tabs.length > 0) lastNonEmptyTabs = tabs;
        return tabs;
      } catch (err) {
        options?.signal?.throwIfAborted();
        lastListError = err;
        return [];
      }
    };
    const openWhenConfirmedEmpty = async (tabs) => {
      if (!openedTab && sawSuccessfulList && lastNonEmptyTabs.length === 0 && tabs.length === 0)
        openedTab = await openTab("about:blank", options);
    };
    const candidateTabs = (tabs) =>
      capabilities.supportsPerTabWs ? tabs.filter((tab) => Boolean(tab.wsUrl)) : tabs;
    const canResolveSelection = (tabs) => {
      const desiredTargetId =
        targetId ?? openedTab?.targetId ?? normalizeOptionalString(runtime.lastTargetId) ?? void 0;
      if (!desiredTargetId) return tabs.length > 0;
      if (targetId === void 0) return tabs.some((tab) => tab.targetId === desiredTargetId);
      const resolved = resolveTargetIdFromTabs(desiredTargetId, tabs);
      return resolved.ok || resolved.reason === "ambiguous";
    };
    await openWhenConfirmedEmpty(await readTabs());
    let listedTabs = await readTabs();
    await openWhenConfirmedEmpty(listedTabs);
    let unfilteredTabs = mergeOpenedTabSnapshot(listedTabs, openedTab);
    let candidates = candidateTabs(unfilteredTabs);
    const preservedCanResolveSelection = () =>
      canResolveSelection(mergeOpenedTabSnapshot(lastNonEmptyTabs, openedTab));
    if (
      capabilities.supportsPerTabWs &&
      !canResolveSelection(candidates) &&
      (candidates.length === 0 ||
        canResolveSelection(unfilteredTabs) ||
        preservedCanResolveSelection())
    ) {
      const deadline = Date.now() + OPEN_TAB_DISCOVERY_WINDOW_MS;
      while (Date.now() < deadline) {
        await waitForTabDiscoveryPoll();
        listedTabs = await readTabs();
        await openWhenConfirmedEmpty(listedTabs);
        unfilteredTabs = mergeOpenedTabSnapshot(listedTabs, openedTab);
        candidates = candidateTabs(unfilteredTabs);
        if (canResolveSelection(candidates)) break;
      }
    }
    if (!canResolveSelection(candidates)) {
      const preservedTabs = mergeOpenedTabSnapshot(lastNonEmptyTabs, openedTab);
      const preservedCandidates = candidateTabs(preservedTabs);
      if (canResolveSelection(preservedCandidates)) candidates = preservedCandidates;
      else if (options?.allowPlaywrightFallback && canResolveSelection(preservedTabs))
        candidates = preservedTabs;
    }
    if (candidates.length === 0 && !sawSuccessfulList && lastListError)
      throw lastListError instanceof Error
        ? lastListError
        : new Error(formatErrorMessage(lastListError));
    const resolveById = (raw, targetOptions) => {
      if (targetOptions?.exactTargetId)
        return candidates.find((tab) => tab.targetId === raw) ?? null;
      const resolved = resolveTargetIdFromTabs(raw, candidates);
      if (!resolved.ok) {
        if (resolved.reason === "ambiguous") return "AMBIGUOUS";
        return null;
      }
      return candidates.find((t) => t.targetId === resolved.targetId) ?? null;
    };
    const stickyTargetId = normalizeOptionalString(runtime.lastTargetId);
    const pickDefault = () => {
      const last = stickyTargetId ?? "";
      const lastResolved = last ? resolveById(last, { exactTargetId: true }) : null;
      if (lastResolved && lastResolved !== "AMBIGUOUS") return lastResolved;
      if (last) return null;
      return candidates.find((t) => (t.type ?? "page") === "page") ?? candidates.at(0) ?? null;
    };
    const chosen = targetId ? resolveById(targetId) : pickDefault();
    if (chosen === "AMBIGUOUS") throw new BrowserTargetAmbiguousError();
    if (!chosen) throw new BrowserTabNotFoundError({ input: targetId ?? stickyTargetId });
    runtime.lastTargetId = chosen.targetId;
    return chosen;
  };
  const resolveTargetIdOrThrow = async (targetId, options) => {
    const tabs = await listTabs(options);
    if (options?.exactTargetId) {
      const exactTarget = tabs.find((tab) => tab.targetId === targetId);
      if (!exactTarget) throw new BrowserTabNotFoundError({ input: targetId });
      return exactTarget.targetId;
    }
    const resolved = resolveTargetIdFromTabs(targetId, tabs);
    if (!resolved.ok) {
      if (resolved.reason === "ambiguous") throw new BrowserTargetAmbiguousError();
      throw new BrowserTabNotFoundError({ input: targetId });
    }
    return resolved.targetId;
  };
  const focusTab = async (targetId, options) => {
    const resolvedTargetId = await resolveTargetIdOrThrow(targetId, options);
    if (capabilities.usesChromeMcp) {
      const { focusChromeMcpTab } = await getChromeMcpModule();
      await focusChromeMcpTab(profile.name, resolvedTargetId, profile, options);
      runtime.lastTargetId = resolvedTargetId;
      return;
    }
    if (capabilities.usesPersistentPlaywright) {
      const focusPageByTargetIdViaPlaywright = (await getPwAiModule({ mode: "strict" }))
        ?.focusPageByTargetIdViaPlaywright;
      if (typeof focusPageByTargetIdViaPlaywright === "function") {
        await focusPageByTargetIdViaPlaywright({
          cdpUrl: profile.cdpUrl,
          targetId: resolvedTargetId,
          ssrfPolicy: getCdpControlPolicy(),
        });
        runtime.lastTargetId = resolvedTargetId;
        return;
      }
    }
    await fetchOk(
      appendCdpPath(cdpHttpBase, `/json/activate/${resolvedTargetId}`),
      void 0,
      void 0,
      getCdpControlPolicy(),
    );
    runtime.lastTargetId = resolvedTargetId;
  };
  const closeTab = async (targetId, options) => {
    const resolvedTargetId = await resolveTargetIdOrThrow(targetId, options);
    if (capabilities.usesChromeMcp) {
      const { closeChromeMcpTab } = await getChromeMcpModule();
      await closeChromeMcpTab(profile.name, resolvedTargetId, profile, options);
    } else {
      let closedViaPlaywright = false;
      if (capabilities.usesPersistentPlaywright) {
        const closePageByTargetIdViaPlaywright = (await getPwAiModule({ mode: "strict" }))
          ?.closePageByTargetIdViaPlaywright;
        if (typeof closePageByTargetIdViaPlaywright === "function") {
          await closePageByTargetIdViaPlaywright({
            cdpUrl: profile.cdpUrl,
            targetId: resolvedTargetId,
            ssrfPolicy: getCdpControlPolicy(),
          });
          closedViaPlaywright = true;
        }
      }
      if (!closedViaPlaywright)
        await fetchOk(
          appendCdpPath(cdpHttpBase, `/json/close/${resolvedTargetId}`),
          void 0,
          void 0,
          getCdpControlPolicy(),
        );
    }
    if (runtime.lastTargetId === resolvedTargetId) runtime.lastTargetId = null;
  };
  return {
    ensureTabAvailable,
    focusTab,
    closeTab,
  };
}
//#endregion
//#region extensions/browser/src/browser/cdp-target-filter.ts
/**
 * CDP target filtering helpers.
 *
 * Browser-internal pages cannot be reliably automated as user content, so tab
 * selection filters them before exposing targets to browser actions.
 */
const BROWSER_INTERNAL_TARGET_URL_PREFIXES = [
  "chrome://",
  "chrome-untrusted://",
  "devtools://",
  "edge://",
  "brave://",
  "vivaldi://",
  "opera://",
];
/** Return true for browser-owned chrome/devtools/internal URLs. */
function isBrowserInternalTargetUrl(url) {
  const normalized = url?.trim().toLowerCase() ?? "";
  return BROWSER_INTERNAL_TARGET_URL_PREFIXES.some((prefix) => normalized.startsWith(prefix));
}
/** Return true when a CDP page target should be selectable by user-facing actions. */
function isSelectableCdpBrowserTarget(target) {
  return target.type === "page" && !isBrowserInternalTargetUrl(target.url);
}
//#endregion
//#region extensions/browser/src/browser/server-context.tab-ops.ts
/**
 * Browser tab listing, opening, labeling, and alias management for one profile.
 */
/**
 * Normalize a CDP WebSocket URL to use the correct base URL.
 */
function normalizeWsUrl(raw, cdpBaseUrl) {
  if (!raw) return;
  try {
    return normalizeCdpWsUrl(raw, cdpBaseUrl);
  } catch {
    return raw;
  }
}
const TAB_LABEL_PATTERN = /^[A-Za-z0-9_.:-]{1,64}$/;
function normalizeTabLabel(label) {
  const trimmed = label.trim();
  if (!TAB_LABEL_PATTERN.test(trimmed))
    throw new Error("tab label must be 1-64 chars and use only letters, numbers, _, ., :, or -");
  return trimmed;
}
function getTabAliasState(profileState) {
  profileState.tabAliases ??= {
    nextTabNumber: 1,
    byTargetId: {},
  };
  return profileState.tabAliases;
}
function assignTabAlias(params) {
  const aliases = getTabAliasState(params.profileState);
  let entry = aliases.byTargetId[params.tab.targetId];
  if (!entry) {
    entry = { tabId: `t${aliases.nextTabNumber}` };
    aliases.nextTabNumber += 1;
    aliases.byTargetId[params.tab.targetId] = entry;
  }
  if (params.label) {
    const label = normalizeTabLabel(params.label);
    for (const [targetId, current] of Object.entries(aliases.byTargetId))
      if (targetId !== params.tab.targetId && current.label === label) delete current.label;
    entry.label = label;
  }
  entry.url = params.tab.url;
  const labelFields = entry.label ? { label: entry.label } : {};
  return {
    ...params.tab,
    suggestedTargetId: entry.label ?? entry.tabId,
    tabId: entry.tabId,
    ...labelFields,
  };
}
function normalizeReplacementUrl(url) {
  return url?.trim() || void 0;
}
function findConfidentReplacement(params) {
  const { staleEntry, staleEntries, newCandidates } = params;
  if (staleEntries.length === 1 && newCandidates.length === 1) return newCandidates[0];
  const url = normalizeReplacementUrl(staleEntry.url);
  if (!url) return;
  const staleMatches = staleEntries.filter(
    ([, entry]) => normalizeReplacementUrl(entry.url) === url,
  );
  const candidates = newCandidates.filter((tab) => normalizeReplacementUrl(tab.url) === url);
  return staleMatches.length === 1 && candidates.length === 1 ? candidates[0] : void 0;
}
function assignTabAliases(profileState, tabs, migrateReplacements) {
  const aliases = getTabAliasState(profileState);
  const liveTargetIds = new Set(tabs.map((tab) => tab.targetId));
  const staleEntries = Object.entries(aliases.byTargetId).filter(
    ([targetId]) => !liveTargetIds.has(targetId),
  );
  const newCandidates = tabs.filter((tab) => !aliases.byTargetId[tab.targetId]);
  if (migrateReplacements)
    for (const [oldTargetId, staleEntry] of staleEntries) {
      const candidate = findConfidentReplacement({
        staleEntry,
        staleEntries,
        newCandidates,
      });
      if (!candidate) continue;
      aliases.byTargetId[candidate.targetId] = staleEntry;
      delete aliases.byTargetId[oldTargetId];
      if (profileState.lastTargetId === oldTargetId) profileState.lastTargetId = candidate.targetId;
    }
  for (const targetId of Object.keys(aliases.byTargetId))
    if (!liveTargetIds.has(targetId)) delete aliases.byTargetId[targetId];
  return tabs.map((tab) =>
    assignTabAlias({
      profileState,
      tab,
    }),
  );
}
/** Builds list/open/label tab operations for one resolved browser profile. */
function createProfileTabOps({ profile, state, runtime }) {
  const cdpHttpBase = normalizeCdpHttpBaseForJsonEndpoints(profile.cdpUrl);
  const capabilities = getBrowserProfileCapabilities(profile);
  const getCdpControlPolicy = () => resolveCdpControlPolicy(profile, state().resolved.ssrfPolicy);
  const getNavigationPolicy = () =>
    withBrowserNavigationPolicy(state().resolved.ssrfPolicy, {
      browserProxyMode: resolveBrowserNavigationProxyMode({
        resolved: state().resolved,
        profile,
      }),
    });
  const getRemoteCdpActionTimeouts = () => {
    if (profile.cdpIsLoopback && !profile.attachOnly) return;
    const resolved = state().resolved;
    return {
      httpTimeoutMs: resolved.remoteCdpTimeoutMs,
      handshakeTimeoutMs: resolved.remoteCdpHandshakeTimeoutMs,
    };
  };
  const readTabs = async (options) => {
    if (capabilities.usesChromeMcp) {
      const { listChromeMcpTabs } = await getChromeMcpModule();
      return await listChromeMcpTabs(profile.name, profile, options);
    }
    if (capabilities.usesPersistentPlaywright) {
      const listPagesViaPlaywright = (await getPwAiModule({ mode: "strict" }))
        ?.listPagesViaPlaywright;
      if (typeof listPagesViaPlaywright === "function") {
        const ssrfPolicy = getCdpControlPolicy();
        const resolved = state().resolved;
        const timeoutMs = Math.max(
          resolved.remoteCdpTimeoutMs,
          resolved.remoteCdpHandshakeTimeoutMs,
        );
        await assertCdpEndpointAllowed(profile.cdpUrl, ssrfPolicy);
        return (
          await listPagesViaPlaywright({
            cdpUrl: profile.cdpUrl,
            ssrfPolicy,
            timeoutMs,
          })
        )
          .filter(isSelectableCdpBrowserTarget)
          .map((p) => ({
            targetId: p.targetId,
            title: p.title,
            url: p.url,
            type: p.type,
          }));
      }
    }
    const raw = await fetchJson(
      appendCdpPath(cdpHttpBase, "/json/list"),
      void 0,
      void 0,
      getCdpControlPolicy(),
    );
    const cdpControlPolicy = getCdpControlPolicy();
    const tabs = [];
    for (const t of raw) {
      const tab = {
        targetId: t.id ?? "",
        title: t.title ?? "",
        url: t.url ?? "",
        wsUrl: normalizeWsUrl(t.webSocketDebuggerUrl, profile.cdpUrl),
        type: t.type,
      };
      if (!tab.targetId || !isSelectableCdpBrowserTarget(tab)) continue;
      if (tab.wsUrl)
        await assertCdpEndpointAllowed(tab.wsUrl, cdpControlPolicy, {
          source: "discovered",
          configuredUrl: profile.cdpUrl,
        });
      tabs.push(tab);
    }
    return tabs;
  };
  const listTabs = async (options) => {
    return assignTabAliases(runtime, await readTabs(options), !capabilities.usesChromeMcp);
  };
  const enforceManagedTabLimit = async (keepTargetId, options) => {
    if (!capabilities.supportsManagedTabLimit || state().resolved.attachOnly || !runtime.running)
      return;
    const pageTabs = await listTabs(options)
      .then((tabs) => tabs.filter((tab) => (tab.type ?? "page") === "page"))
      .catch(() => []);
    if (pageTabs.length <= 8) return;
    const candidates = pageTabs.filter((tab) => tab.targetId !== keepTargetId);
    const excessCount = pageTabs.length - 8;
    for (const tab of candidates.slice(0, excessCount)) {
      options?.signal?.throwIfAborted();
      await fetchOk(
        appendCdpPath(cdpHttpBase, `/json/close/${tab.targetId}`),
        void 0,
        void 0,
        getCdpControlPolicy(),
      ).catch(() => {});
    }
  };
  const triggerManagedTabLimit = (keepTargetId, options) => {
    enforceManagedTabLimit(keepTargetId, options).catch(() => {});
  };
  const openTab = async (url, opts) => {
    opts?.signal?.throwIfAborted();
    const ssrfPolicyOpts = getNavigationPolicy();
    if (capabilities.usesChromeMcp) {
      await assertBrowserNavigationAllowed({
        url,
        ...ssrfPolicyOpts,
      });
      const { openChromeMcpTab } = await getChromeMcpModule();
      const page = await openChromeMcpTab(profile.name, url, profile, opts);
      runtime.lastTargetId = page.targetId;
      await assertBrowserNavigationResultAllowed({
        url: page.url,
        ...ssrfPolicyOpts,
      });
      return assignTabAlias({
        profileState: runtime,
        tab: page,
        label: opts?.label,
      });
    }
    if (capabilities.usesPersistentPlaywright) {
      const createPageViaPlaywright = (await getPwAiModule({ mode: "strict" }))
        ?.createPageViaPlaywright;
      if (typeof createPageViaPlaywright === "function") {
        const page = await createPageViaPlaywright({
          cdpUrl: profile.cdpUrl,
          url,
          cdpPolicy: getCdpControlPolicy(),
          ...ssrfPolicyOpts,
        });
        opts?.signal?.throwIfAborted();
        runtime.lastTargetId = page.targetId;
        triggerManagedTabLimit(page.targetId, opts);
        return assignTabAlias({
          profileState: runtime,
          label: opts?.label,
          tab: {
            targetId: page.targetId,
            title: page.title,
            url: page.url,
            type: page.type,
          },
        });
      }
    }
    if (requiresInspectableBrowserNavigationRedirectsForUrl(url, state().resolved.ssrfPolicy))
      throw new InvalidBrowserNavigationUrlError(
        "Navigation blocked: strict browser SSRF policy requires Playwright-backed redirect-hop inspection",
      );
    await assertBrowserNavigationAllowed({
      url,
      ...ssrfPolicyOpts,
    });
    const cdpActionTimeouts = getRemoteCdpActionTimeouts();
    const createTargetOpts = {
      cdpUrl: profile.cdpUrl,
      url,
      ssrfPolicy: getCdpControlPolicy(),
    };
    if (cdpActionTimeouts) createTargetOpts.timeouts = cdpActionTimeouts;
    const createdViaCdp = await createTargetViaCdp(createTargetOpts)
      .then((r) => r.targetId)
      .catch(() => null);
    if (createdViaCdp) {
      runtime.lastTargetId = createdViaCdp;
      const deadline = Date.now() + OPEN_TAB_DISCOVERY_WINDOW_MS;
      while (Date.now() < deadline) {
        opts?.signal?.throwIfAborted();
        const found = (await listTabs(opts).catch(() => [])).find(
          (t) => t.targetId === createdViaCdp,
        );
        if (found) {
          await assertBrowserNavigationResultAllowed({
            url: found.url,
            ...ssrfPolicyOpts,
          });
          triggerManagedTabLimit(found.targetId, opts);
          return assignTabAlias({
            profileState: runtime,
            tab: found,
            label: opts?.label,
          });
        }
        await new Promise((r) => {
          setTimeout(r, 100);
        });
      }
      opts?.signal?.throwIfAborted();
      triggerManagedTabLimit(createdViaCdp, opts);
      return assignTabAlias({
        profileState: runtime,
        tab: {
          targetId: createdViaCdp,
          title: "",
          url,
          type: "page",
        },
        label: opts?.label,
      });
    }
    const encoded = encodeURIComponent(url);
    const endpointUrl = new URL(appendCdpPath(cdpHttpBase, "/json/new"));
    const endpoint = endpointUrl.search
      ? (() => {
          endpointUrl.searchParams.set("url", url);
          return endpointUrl.toString();
        })()
      : `${endpointUrl.toString()}?${encoded}`;
    opts?.signal?.throwIfAborted();
    const created = await fetchJson(
      endpoint,
      cdpActionTimeouts?.httpTimeoutMs ?? 1500,
      { method: "PUT" },
      getCdpControlPolicy(),
    ).catch(async (err) => {
      if (String(err).includes("HTTP 405"))
        return await fetchJson(
          endpoint,
          cdpActionTimeouts?.httpTimeoutMs ?? 1500,
          void 0,
          getCdpControlPolicy(),
        );
      throw err;
    });
    opts?.signal?.throwIfAborted();
    if (!created.id) throw new Error("Failed to open tab (missing id)");
    const resolvedUrl = created.url ?? url;
    if (
      !isSelectableCdpBrowserTarget({
        url: resolvedUrl,
        type: created.type,
      })
    )
      throw new Error("Failed to open tab (non-selectable target)");
    await assertBrowserNavigationResultAllowed({
      url: resolvedUrl,
      ...ssrfPolicyOpts,
    });
    const wsUrl = normalizeWsUrl(created.webSocketDebuggerUrl, profile.cdpUrl);
    if (wsUrl)
      await assertCdpEndpointAllowed(wsUrl, getCdpControlPolicy(), {
        source: "discovered",
        configuredUrl: profile.cdpUrl,
      });
    runtime.lastTargetId = created.id;
    triggerManagedTabLimit(created.id, opts);
    return assignTabAlias({
      profileState: runtime,
      label: opts?.label,
      tab: {
        targetId: created.id,
        title: created.title ?? "",
        url: resolvedUrl,
        wsUrl,
        type: created.type,
      },
    });
  };
  const labelTab = async (targetId, label, options) => {
    const normalizedLabel = normalizeTabLabel(label);
    const tabs = await listTabs(options);
    const resolved = resolveTargetIdFromTabs(targetId, tabs);
    if (!resolved.ok) {
      if (resolved.reason === "ambiguous") throw new BrowserTargetAmbiguousError();
      throw new BrowserTabNotFoundError({ input: targetId });
    }
    const tab = tabs.find((candidate) => candidate.targetId === resolved.targetId);
    if (!tab) throw new BrowserTabNotFoundError({ input: targetId });
    return assignTabAlias({
      profileState: runtime,
      tab,
      label: normalizedLabel,
    });
  };
  return {
    listTabs,
    openTab,
    labelTab,
  };
}
//#endregion
//#region extensions/browser/src/browser/server-context.ts
/**
 * Browser route context factory that wires profile-scoped runtime operations for
 * the Browser control server.
 */
/** Lists configured and runtime-known Browser profile names without duplicates. */
function listKnownProfileNames(state) {
  const names = new Set(Object.keys(state.resolved.profiles));
  for (const name of state.profiles.keys()) names.add(name);
  return [...names];
}
const profileOperationRunners = /* @__PURE__ */ new WeakMap();
/** Internal actor lease entrypoint; not part of the public Browser runtime API. */
function runProfileContextOperation(profileCtx, signal, run, options) {
  const runner = profileOperationRunners.get(profileCtx);
  if (!runner)
    throw new BrowserProfileUnavailableError("Browser profile context is no longer active.");
  return runner(signal, run, options);
}
/** Preserve custom route contexts while leasing contexts created by this runtime. */
function withProfileContextOperation(profileCtx, signal, run) {
  const runner = profileOperationRunners.get(profileCtx);
  if (!runner) return run(signal ?? new AbortController().signal);
  return runner(signal, async (leasedSignal) => await run(leasedSignal));
}
/**
 * Create a profile-scoped context for browser operations.
 */
function createProfileContext(opts, runtimeState, profileState, profile) {
  const state = () => {
    if (opts.getState() !== runtimeState || !isBrowserRuntimeRunning(runtimeState))
      throw new BrowserProfileUnavailableError("Browser runtime changed or is stopping.");
    return runtimeState;
  };
  const configRevision = getProfileLifecycle(profileState).configRevision;
  const rawTabOps = createProfileTabOps({
    profile,
    state,
    runtime: profileState,
  });
  const rawAvailability = createProfileAvailability({
    opts,
    profile,
    state,
    runtime: profileState,
    configRevision,
  });
  const rawSelection = createProfileSelectionOps({
    profile,
    runtime: profileState,
    getCdpControlPolicy: () => resolveCdpControlPolicy(profile, state().resolved.ssrfPolicy),
    ensureBrowserAvailable: rawAvailability.ensureBrowserAvailable,
    listTabs: rawTabOps.listTabs,
    openTab: rawTabOps.openTab,
  });
  const rawReset = createProfileResetOps({
    profile,
    state,
    runtime: profileState,
    configRevision,
    resolveOpenClawUserDataDir,
  });
  const withLease = async (callerSignal, run, options) =>
    await withProfileOperationLease({
      state: state(),
      runtime: profileState,
      configRevision,
      signal: callerSignal,
      run: async (lifecycleSignal) => await run(lifecycleSignal, profileState),
      commit: options?.commit,
    });
  const { ensureBrowserAvailable, stopRunningBrowser } = rawAvailability;
  const context = {
    profile,
    ensureBrowserAvailable,
    ensureTabAvailable: async (targetId, options) => {
      await ensureBrowserAvailable({ signal: options?.signal });
      return await withLease(
        options?.signal,
        async (signal) =>
          await rawSelection.ensureTabAvailable(
            targetId,
            {
              ...options,
              signal,
            },
            true,
          ),
      );
    },
    isHttpReachable: async (timeoutMs) =>
      await withLease(
        void 0,
        async (signal) => await rawAvailability.isHttpReachable(timeoutMs, signal),
      ),
    isTransportAvailable: async (timeoutMs) =>
      await withLease(
        void 0,
        async (signal) => await rawAvailability.isTransportAvailable(timeoutMs, signal),
      ),
    isReachable: async (timeoutMs, options) =>
      await withLease(
        options?.signal,
        async (signal) =>
          await rawAvailability.isReachable(timeoutMs, {
            ...options,
            signal,
          }),
      ),
    listTabs: async (options) =>
      await withLease(
        options?.signal,
        async (signal) =>
          await rawTabOps.listTabs({
            ...options,
            signal,
          }),
      ),
    openTab: async (url, options) =>
      await withLease(
        options?.signal,
        async (signal) =>
          await rawTabOps.openTab(url, {
            ...options,
            signal,
          }),
      ),
    labelTab: async (targetId, label) =>
      await withLease(
        void 0,
        async (signal) => await rawTabOps.labelTab(targetId, label, { signal }),
      ),
    focusTab: async (targetId, options) =>
      await withLease(
        options?.signal,
        async (signal) =>
          await rawSelection.focusTab(targetId, {
            ...options,
            signal,
          }),
      ),
    closeTab: async (targetId, options) =>
      await withLease(
        options?.signal,
        async (signal) =>
          await rawSelection.closeTab(targetId, {
            ...options,
            signal,
          }),
      ),
    stopRunningBrowser,
    resetProfile: rawReset.resetProfile,
  };
  profileOperationRunners.set(context, withLease);
  return context;
}
/** Creates the Browser route context used by control-server route handlers. */
function createBrowserRouteContext(opts) {
  const refreshConfigFromDisk = opts.refreshConfigFromDisk === true;
  const state = () => {
    const current = opts.getState();
    if (!current) throw new BrowserProfileUnavailableError("Browser server not started.");
    if (!isBrowserRuntimeRunning(current))
      throw new BrowserProfileUnavailableError("Browser runtime is stopping.");
    return current;
  };
  const forProfile = (profileName) => {
    const current = state();
    const name = profileName ?? current.resolved.defaultProfile;
    const profile = resolveBrowserProfileWithHotReload({
      current,
      refreshConfigFromDisk,
      name,
    });
    if (!profile)
      throw new BrowserProfileNotFoundError(
        `Profile "${name}" not found. Available profiles: ${Object.keys(current.resolved.profiles).join(", ") || "(none)"}`,
      );
    return createProfileContext(
      opts,
      current,
      getOrCreateProfileRuntime(current, profile),
      profile,
    );
  };
  const listProfiles = async () => {
    const current = state();
    refreshResolvedBrowserConfigFromDisk({
      current,
      refreshConfigFromDisk,
    });
    const result = [];
    for (const name of listKnownProfileNames(current)) {
      let profileState = current.profiles.get(name);
      const profile = resolveProfile(current.resolved, name) ?? profileState?.profile;
      if (!profile) continue;
      profileState ??= getOrCreateProfileRuntime(current, profile);
      let statusProfile = profile;
      let unavailableReason = null;
      let running = false;
      let tabCount = 0;
      for (let attempt = 0; attempt < 2; attempt += 1) {
        statusProfile = profileState.profile;
        const profileCtx = createProfileContext(opts, current, profileState, statusProfile);
        try {
          const snapshot = await runProfileContextOperation(
            profileCtx,
            void 0,
            async (signal, runtime) => {
              const activeProfile = runtime.profile;
              const capabilities = getBrowserProfileCapabilities(activeProfile);
              let activeRunning;
              let activeTabCount = 0;
              if (capabilities.usesChromeMcp)
                try {
                  activeRunning = await profileCtx.isTransportAvailable(300);
                  if (activeRunning)
                    activeTabCount = await countChromeMcpTabs(activeProfile.name, activeProfile, {
                      ephemeral: true,
                      signal,
                    }).catch(() => 0);
                } catch {
                  activeRunning = false;
                }
              else if (runtime.running) {
                activeRunning = true;
                try {
                  activeTabCount = (await profileCtx.listTabs({ signal })).filter(
                    (tab) => tab.type === "page",
                  ).length;
                } catch {}
              } else
                try {
                  const probeTimeoutMs = usesFastLoopbackCdpProbeClass({
                    profileIsLoopback: activeProfile.cdpIsLoopback,
                    attachOnly: activeProfile.attachOnly,
                  })
                    ? 200
                    : current.resolved.remoteCdpTimeoutMs;
                  activeRunning = await isChromeReachable(
                    activeProfile.cdpUrl,
                    probeTimeoutMs,
                    resolveCdpReachabilityPolicy(activeProfile, current.resolved.ssrfPolicy),
                  );
                  if (activeRunning)
                    activeTabCount = (await profileCtx.listTabs({ signal }).catch(() => [])).filter(
                      (tab) => tab.type === "page",
                    ).length;
                } catch {
                  activeRunning = false;
                }
              signal.throwIfAborted();
              return {
                profile: activeProfile,
                running: activeRunning,
                tabCount: activeTabCount,
              };
            },
          );
          statusProfile = snapshot.profile;
          running = snapshot.running;
          tabCount = snapshot.tabCount;
          break;
        } catch (err) {
          if (attempt === 0) continue;
          statusProfile = profileState.profile;
          const actor = getProfileLifecycle(profileState);
          unavailableReason = actor.blockedReason ?? actor.transitionReason ?? actor.terminal;
          if (!unavailableReason && !toBrowserErrorResponse(err)) throw err;
          running = Boolean(profileState.running);
          tabCount = 0;
        }
      }
      const capabilities = getBrowserProfileCapabilities(statusProfile);
      result.push({
        name,
        transport: capabilities.usesChromeMcp
          ? "chrome-mcp"
          : capabilities.mode === "local-extension"
            ? "extension"
            : "cdp",
        cdpPort: capabilities.usesChromeMcp ? null : statusProfile.cdpPort,
        cdpUrl: statusProfile.cdpUrl ? (redactCdpUrl(statusProfile.cdpUrl) ?? null) : null,
        color: statusProfile.color,
        driver: statusProfile.driver,
        running,
        tabCount,
        isDefault: name === current.resolved.defaultProfile,
        isRemote: !statusProfile.cdpIsLoopback,
        missingFromConfig:
          getOwnBrowserProfile(current.resolved.profiles, name) === void 0 || void 0,
        reconcileReason: unavailableReason,
      });
    }
    return result;
  };
  const getDefaultContext = () => forProfile();
  const mapTabError = (err) => {
    const browserMapped = toBrowserErrorResponse(err);
    if (browserMapped) return browserMapped;
    return null;
  };
  return {
    state,
    forProfile,
    listProfiles,
    ensureBrowserAvailable: (options) => getDefaultContext().ensureBrowserAvailable(options),
    ensureTabAvailable: (targetId, options) =>
      getDefaultContext().ensureTabAvailable(targetId, options),
    isHttpReachable: (timeoutMs) => getDefaultContext().isHttpReachable(timeoutMs),
    isTransportAvailable: (timeoutMs) => getDefaultContext().isTransportAvailable(timeoutMs),
    isReachable: (timeoutMs, options) => getDefaultContext().isReachable(timeoutMs, options),
    listTabs: () => getDefaultContext().listTabs(),
    openTab: (url, optsLocal) => getDefaultContext().openTab(url, optsLocal),
    labelTab: (targetId, label) => getDefaultContext().labelTab(targetId, label),
    focusTab: (targetId, options) => getDefaultContext().focusTab(targetId, options),
    closeTab: (targetId, options) => getDefaultContext().closeTab(targetId, options),
    stopRunningBrowser: () => getDefaultContext().stopRunningBrowser(),
    resetProfile: () => getDefaultContext().resetProfile(),
    mapTabError,
  };
}
//#endregion
export {
  loadBrowserConfigForRuntimeRefresh as a,
  resolveTargetIdFromTabs as i,
  runProfileContextOperation as n,
  resolveCdpControlPolicy as o,
  withProfileContextOperation as r,
  createBrowserRouteContext as t,
};
