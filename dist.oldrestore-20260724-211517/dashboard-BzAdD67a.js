import { t as resolveGatewayAuthToken } from "./auth-token-resolution--RLjXsYk.js";
import { n as openUrl, t as detectBrowserOpenSupport } from "./browser-open-BIKaPeXy.js";
import { n as resolveControlUiLinks } from "./control-ui-links-BImlWgwk.js";
import { r as runCommandWithTimeout } from "./exec-CXKmx4dL.js";
import { a as gatewayProbeResultSawGateway } from "./gateway-health-auth-diagnostic-Bd2f-neB.js";
import { u as readConfigFileSnapshot } from "./io-B3ne6NxF.js";
import { t as createLazyImportLoader } from "./lazy-promise-EhsWch5m.js";
import "./config-BDv-QbJ6.js";
import { i as formatControlUiSshHint } from "./onboard-helpers-CUS3BGDx.js";
import { f as resolveGatewayPort } from "./paths-DEklnbzU.js";
import {
  n as inspectPortUsage,
  s as isSameProcessSpecificIpv4WithLoopbackListeners,
} from "./ports-inspect-DyOb8qZr.js";
import { r as promptYesNo } from "./prompt-DMGJRcz7.js";
import { i as writeRuntimeJson, r as defaultRuntime } from "./runtime-Bz6o617W.js";
import { u as isWSL2Sync } from "./undici-runtime-Bm6J6FAw.js";
//#region src/infra/clipboard.ts
const WSL_CLIPBOARD_ARGV = ["/bin/sh", "-c", "exec /mnt/c/Windows/System32/clip.exe"];
async function copyToClipboard(value) {
  const attempts = [
    ...(isWSL2Sync() ? [{ argv: WSL_CLIPBOARD_ARGV }] : []),
    { argv: ["pbcopy"] },
    { argv: ["xclip", "-selection", "clipboard"] },
    { argv: ["wl-copy"] },
    { argv: ["clip.exe"] },
    { argv: ["powershell", "-NoProfile", "-Command", "Set-Clipboard"] },
  ];
  for (const attempt of attempts)
    try {
      const result = await runCommandWithTimeout(attempt.argv, {
        timeoutMs: 3e3,
        input: value,
      });
      if (result.code === 0 && !result.killed) return true;
    } catch {}
  return false;
}
//#endregion
//#region src/commands/gateway-readiness.ts
const daemonStatusModuleLoader = createLazyImportLoader(
  () => import("./status.gather-CnDEbV58.js"),
);
const daemonInstallModuleLoader = createLazyImportLoader(
  () => import("./install.runtime-D7eh9xIu.js"),
);
const daemonLifecycleModuleLoader = createLazyImportLoader(() => import("./lifecycle-DBE6UamH.js"));
async function defaultGatherStatus(params) {
  const { gatherDaemonStatus } = await daemonStatusModuleLoader.load();
  return gatherDaemonStatus({
    rpc: params.probeUrl ? { url: params.probeUrl } : {},
    probe: true,
    requireRpc: params.requireRpc,
    deep: false,
  });
}
function activeProbePortStatus(status) {
  const probeUrl = status.rpc?.url ?? status.gateway?.probeUrl;
  const probePort = probeUrl
    ? (() => {
        try {
          return Number(new URL(probeUrl).port);
        } catch {
          return NaN;
        }
      })()
    : NaN;
  if (Number.isFinite(probePort) && status.portCli?.port === probePort) return status.portCli;
  return status.port;
}
function gatewayIsRunning(status) {
  return status.rpc?.ok === true;
}
function gatewayProbeSawGateway(status) {
  return Boolean(status.rpc && gatewayProbeResultSawGateway(status.rpc));
}
function gatewayLooksReachable(status) {
  if (gatewayIsRunning(status)) return true;
  if (activeProbePortStatus(status)?.status !== "busy") return false;
  return gatewayProbeSawGateway(status);
}
function gatewayIsReady(status, options) {
  return (
    gatewayIsRunning(status) ||
    (options.readyWhenReachable === true && gatewayLooksReachable(status))
  );
}
function gatewayLooksStopped(status) {
  if (status.rpc?.ok === true) return false;
  if (activeProbePortStatus(status)?.status === "free") return true;
  if (status.service.runtime?.status === "stopped") return true;
  const error = status.rpc?.error ?? "";
  return /\bECONNREFUSED\b|couldn't connect|connection refused/i.test(error);
}
function gatewayServiceIsInstalled(status) {
  return Boolean(status.service.command || status.service.loaded);
}
function readinessFailureReason(status) {
  if (gatewayLooksStopped(status)) return "Gateway is not running.";
  return status.rpc?.error
    ? `Gateway probe failed: ${status.rpc.error}`
    : "Gateway is not healthy.";
}
function printGatewayNotReadyHints(runtime, reason) {
  runtime.log(reason);
  runtime.log("Run `openclaw gateway status --deep` for details.");
  runtime.log("Run `openclaw gateway start` to start a managed gateway.");
  runtime.log("Run `openclaw gateway run` for a foreground gateway.");
}
async function confirmRecovery(params) {
  if (params.yes) return true;
  if (!(params.interactive ?? process.stdin.isTTY)) return false;
  return params.confirm(params.message, true);
}
async function waitForGatewayReady(params) {
  const attempts = params.attempts ?? 20;
  const delayMs = params.delayMs ?? 500;
  let latest = await params.gatherStatus();
  for (
    let attempt = 1;
    attempt < attempts &&
    !gatewayIsReady(latest, { readyWhenReachable: params.readyWhenReachable });
    attempt += 1
  ) {
    await new Promise((resolve) => {
      setTimeout(resolve, delayMs);
    });
    latest = await params.gatherStatus();
  }
  return latest;
}
/** Checks readiness and, when approved, recovers by installing or starting the gateway. */
async function ensureGatewayReadyForOperation(options) {
  const requireRpc = options.requireRpc ?? false;
  const gatherStatus =
    options.deps?.gatherStatus ??
    (() =>
      defaultGatherStatus({
        requireRpc,
        probeUrl: options.probeUrl,
      }));
  const confirm = options.deps?.confirm ?? promptYesNo;
  const installGateway =
    options.deps?.installGateway ??
    (async () => {
      const { runDaemonInstall } = await daemonInstallModuleLoader.load();
      await runDaemonInstall({ json: false });
    });
  const startGateway =
    options.deps?.startGateway ??
    (async () => {
      const { runDaemonStart } = await daemonLifecycleModuleLoader.load();
      await runDaemonStart({ json: false });
    });
  const initialStatus = await gatherStatus();
  if (gatewayIsReady(initialStatus, { readyWhenReachable: options.readyWhenReachable }))
    return {
      ready: true,
      status: initialStatus,
      recovered: false,
    };
  const reason = readinessFailureReason(initialStatus);
  if (!gatewayLooksStopped(initialStatus)) {
    printGatewayNotReadyHints(options.runtime, reason);
    return {
      ready: false,
      status: initialStatus,
      reason,
      recoverable: false,
    };
  }
  const shouldInstall = !gatewayServiceIsInstalled(initialStatus);
  if (shouldInstall && options.allowInstall === false) {
    printGatewayNotReadyHints(options.runtime, reason);
    return {
      ready: false,
      status: initialStatus,
      reason,
      recoverable: false,
    };
  }
  if (
    !(await confirmRecovery({
      message: shouldInstall
        ? `Gateway is not installed. Install and start it now so OpenClaw can ${options.operation}?`
        : `Gateway is not running. Start it now so OpenClaw can ${options.operation}?`,
      yes: options.yes,
      interactive: options.interactive,
      confirm,
    }))
  ) {
    printGatewayNotReadyHints(options.runtime, reason);
    return {
      ready: false,
      status: initialStatus,
      reason,
      recoverable: true,
    };
  }
  if (shouldInstall) await installGateway();
  else await startGateway();
  const recoveredStatus = await waitForGatewayReady({
    gatherStatus,
    readyWhenReachable: options.readyWhenReachable,
  });
  if (gatewayIsReady(recoveredStatus, { readyWhenReachable: options.readyWhenReachable }))
    return {
      ready: true,
      status: recoveredStatus,
      recovered: true,
    };
  const recoveredReason = readinessFailureReason(recoveredStatus);
  printGatewayNotReadyHints(options.runtime, recoveredReason);
  return {
    ready: false,
    status: recoveredStatus,
    reason: recoveredReason,
    recoverable: true,
  };
}
//#endregion
//#region src/commands/dashboard.ts
const quietRuntime = {
  log: () => {},
  error: () => {},
  exit: () => {},
};
async function resolveDashboardTarget() {
  const snapshot = await readConfigFileSnapshot();
  const cfg = snapshot.valid ? (snapshot.sourceConfig ?? snapshot.config) : {};
  const port = resolveGatewayPort(cfg);
  const bind = cfg.gateway?.bind ?? "loopback";
  const basePath = cfg.gateway?.controlUi?.basePath;
  const customBindHost = cfg.gateway?.customBindHost;
  const resolvedToken = await resolveGatewayAuthToken({
    cfg,
    env: process.env,
    envFallback: "always",
  });
  const token = resolvedToken.token ?? "";
  const tlsEnabled = cfg.gateway?.tls?.enabled === true;
  const customBindIsWildcard = bind === "custom" && customBindHost?.trim() === "0.0.0.0";
  const dashboardBind =
    bind === "lan" ||
    customBindIsWildcard ||
    (!tlsEnabled && (bind === "tailnet" || bind === "custom"))
      ? "loopback"
      : bind;
  const configuredLinks = resolveControlUiLinks({
    port,
    bind,
    customBindHost,
    basePath,
    tlsEnabled,
  });
  const links =
    dashboardBind === bind
      ? configuredLinks
      : resolveControlUiLinks({
          port,
          bind: dashboardBind,
          customBindHost,
          basePath,
          tlsEnabled,
        });
  const loopbackAliasHost = (() => {
    if (dashboardBind !== "loopback" || (bind !== "tailnet" && bind !== "custom")) return;
    try {
      const host = new URL(configuredLinks.wsUrl).hostname;
      return host === "127.0.0.1" || host === "0.0.0.0" ? void 0 : host;
    } catch {
      return;
    }
  })();
  const includeTokenInUrl = token.length > 0 && !resolvedToken.secretRefConfigured;
  return {
    port,
    basePath,
    links,
    resolvedToken,
    token,
    includeTokenInUrl,
    dashboardUrl: includeTokenInUrl
      ? `${links.httpUrl}#token=${encodeURIComponent(token)}`
      : links.httpUrl,
    probeUrl: loopbackAliasHost ? configuredLinks.wsUrl : links.wsUrl,
    loopbackAliasHost,
  };
}
async function hasVerifiedLoopbackAlias(target) {
  const expectedHost = target.loopbackAliasHost;
  if (!expectedHost) return true;
  const portUsage = await inspectPortUsage(target.port).catch(() => void 0);
  return Boolean(
    portUsage &&
    isSameProcessSpecificIpv4WithLoopbackListeners(portUsage.listeners, target.port, expectedHost),
  );
}
async function ensureDashboardTargetReady(params) {
  return ensureGatewayReadyForOperation({
    runtime: params.runtime,
    operation: "open the dashboard",
    yes: params.yes,
    probeUrl: params.target.probeUrl,
    readyWhenReachable: true,
    ...(params.allowRecovery === false
      ? {
          allowInstall: false,
          interactive: false,
        }
      : {}),
  });
}
function dashboardJsonFailure(runtime, reason) {
  writeRuntimeJson(
    runtime,
    {
      ok: false,
      reason,
    },
    0,
  );
  runtime.exit(1);
}
async function dashboardJsonCommand(runtime) {
  try {
    const target = await resolveDashboardTarget();
    const readiness = await ensureDashboardTargetReady({
      target,
      runtime: quietRuntime,
      allowRecovery: false,
    });
    if (!readiness.ready) {
      dashboardJsonFailure(runtime, readiness.reason);
      return;
    }
    if (!(await hasVerifiedLoopbackAlias(target))) {
      dashboardJsonFailure(
        runtime,
        "Dashboard loopback listener could not be verified as the configured Gateway.",
      );
      return;
    }
    writeRuntimeJson(
      runtime,
      {
        ok: true,
        url: target.dashboardUrl,
        httpUrl: target.links.httpUrl,
        wsUrl: target.links.wsUrl,
        port: target.port,
        tokenIncluded: target.includeTokenInUrl,
      },
      0,
    );
  } catch (err) {
    dashboardJsonFailure(
      runtime,
      (err instanceof Error ? err.message : String(err)) || "Dashboard target resolution failed.",
    );
  }
}
/** Open or print the Control UI dashboard URL after ensuring the Gateway is reachable. */
async function dashboardCommand(runtime = defaultRuntime, options = {}) {
  if (options.json) {
    await dashboardJsonCommand(runtime);
    return;
  }
  const initialTarget = await resolveDashboardTarget();
  const readiness = await ensureDashboardTargetReady({
    target: initialTarget,
    runtime,
    yes: options.yes,
  });
  if (!readiness.ready) return;
  const target = readiness.recovered ? await resolveDashboardTarget() : initialTarget;
  const recoveryChangedProbe = target.probeUrl !== initialTarget.probeUrl;
  if (readiness.recovered && recoveryChangedProbe) {
    if (
      !(
        await ensureDashboardTargetReady({
          target,
          runtime,
          allowRecovery: false,
        })
      ).ready
    )
      return;
  }
  if (!(await hasVerifiedLoopbackAlias(target))) {
    runtime.error(
      "Dashboard loopback listener could not be verified as the configured Gateway; refusing to copy or open an authenticated URL.",
    );
    runtime.log("Restart the Gateway, then run `openclaw gateway status --deep` for details.");
    return;
  }
  const { port, basePath, links, resolvedToken, token, includeTokenInUrl, dashboardUrl } = target;
  runtime.log(`Dashboard URL: ${links.httpUrl}`);
  if (includeTokenInUrl) runtime.log("Token auto-auth included in browser/clipboard URL.");
  if (resolvedToken.secretRefConfigured && token)
    runtime.log(
      "Token auto-auth is disabled for SecretRef-managed gateway.auth.token; use your external token source if prompted.",
    );
  if (resolvedToken.unresolvedRefReason) {
    runtime.log(`Token auto-auth unavailable: ${resolvedToken.unresolvedRefReason}`);
    runtime.log(
      "Set OPENCLAW_GATEWAY_TOKEN in this shell or resolve your secret provider, then rerun `openclaw dashboard`.",
    );
  }
  const copied = await copyToClipboard(dashboardUrl).catch(() => false);
  runtime.log(copied ? "Copied to clipboard." : "Copy to clipboard unavailable.");
  let opened = false;
  let hint;
  if (!options.noOpen) {
    if ((await detectBrowserOpenSupport()).ok) opened = await openUrl(dashboardUrl);
    if (!opened)
      hint = formatControlUiSshHint({
        port,
        basePath,
      });
  } else
    hint =
      copied && includeTokenInUrl
        ? "Browser launch disabled (--no-open). Token-authenticated URL copied to clipboard."
        : "Browser launch disabled (--no-open). Use the URL above.";
  const fallbackToManualAuth = !copied && !opened && includeTokenInUrl;
  const suppressNoOpenHint = options.noOpen === true && fallbackToManualAuth;
  if (opened) runtime.log("Opened in your browser. Keep that tab to control OpenClaw.");
  else if (hint && !suppressNoOpenHint) runtime.log(hint);
  if (fallbackToManualAuth)
    runtime.log(
      "Token auto-auth not delivered. Append your gateway token (from OPENCLAW_GATEWAY_TOKEN or gateway.auth.token) as a URL fragment with key `token` to authenticate.",
    );
}
//#endregion
export { dashboardCommand };
