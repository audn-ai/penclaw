import { t as formatCliCommand } from "./command-format-H_Arqann.js";
import {
  g as resolveNodeLaunchAgentLabel,
  m as resolveGatewayWindowsTaskName,
  p as resolveGatewaySystemdServiceName,
  u as resolveGatewayLaunchAgentLabel,
} from "./constants-obO8goqF.js";
import {
  n as gatewayInstallErrorHint,
  t as buildGatewayInstallPlan,
} from "./daemon-install-helpers-DbcV1pnD.js";
import "./utils-DtcDeqWS.js";
import {
  n as GATEWAY_DAEMON_RUNTIME_OPTIONS,
  t as DEFAULT_GATEWAY_DAEMON_RUNTIME,
} from "./daemon-runtime-CHOL1Kuf.js";
import { n as readLastGatewayErrorLine } from "./diagnostics-fiGytHJL.js";
import {
  a as resolveServiceRepairPolicy,
  i as isServiceRepairExternallyManaged,
  n as SERVICE_REPAIR_POLICY_ENV,
  r as confirmDoctorServiceRepair,
  t as EXTERNAL_SERVICE_REPAIR_NOTE,
} from "./doctor-service-repair-policy-D0NFzdqc.js";
import { t as resolveGatewayInstallToken } from "./gateway-install-token-CwKaSRw3.js";
import { c as healthCommand } from "./health-B7JDh_rX.js";
import {
  r as formatHealthCheckFailure,
  t as formatGatewayClosedDiagnostic,
} from "./health-format-DQ9OK_xq.js";
import { r as findSystemGatewayServices } from "./inspect-CD2p_qWO.js";
import "./config-BDv-QbJ6.js";
import {
  f as repairLaunchAgentBootstrap,
  o as isLaunchAgentLoaded,
  s as launchAgentPlistExists,
} from "./launchd-CNqS8gSo.js";
import "./ports-miNUZKci.js";
import { a as getResolvedLoggerSettings } from "./logger-BUux_Jpv.js";
import { t as note } from "./note-Uvqr4R1d.js";
import { f as resolveGatewayPort } from "./paths-DEklnbzU.js";
import {
  i as formatPortDiagnostics,
  n as inspectPortUsage,
  o as isExpectedGatewayListeners,
  t as inspectPortConnections,
} from "./ports-inspect-DyOb8qZr.js";
import {
  n as readGatewayRestartHandoffSync,
  t as formatGatewayRestartHandoffDiagnostic,
} from "./restart-handoff-C_HtGsPl.js";
import {
  a as isSystemdUnavailableDetail,
  i as resolveDaemonContainerContext,
  o as renderSystemdUnavailableHints,
  r as formatRuntimeStatus,
  t as buildPlatformRuntimeLogHints,
} from "./runtime-hints-DaMB6xc0.js";
import {
  a as resolveGatewayService,
  t as describeGatewayServiceRestart,
} from "./service-Dw37Ek79.js";
import "./logging-C8NGWOYr.js";
import {
  n as isSystemdCgroupHygieneRisk,
  r as isSystemdStartLimitHit,
  t as getSystemdCgroupHygieneSummary,
} from "./service-runtime-Cy_yLpbt.js";
import { t as sleep } from "./sleep-DZm1epyW.js";
import {
  h as classifySystemdUnavailableDetail,
  o as isSystemdUserServiceAvailable,
} from "./systemd-BI3sgDKJ.js";
import { d as isWSLEnv, l as isWSL } from "./undici-runtime-Bm6J6FAw.js";
//#region src/commands/doctor-format.ts
/** Formatting helpers for gateway runtime summaries and doctor repair hints. */
/** Formats the platform-specific gateway service runtime into a compact status line. */
function formatGatewayRuntimeSummary(runtime) {
  return formatRuntimeStatus(runtime);
}
/** Builds follow-up hints for stopped, missing, or unhealthy gateway service runtimes. */
function buildGatewayRuntimeHints(runtime, options = {}) {
  const hints = [];
  if (!runtime) return hints;
  const platform = options.platform ?? process.platform;
  const env = options.env ?? process.env;
  const container = Boolean(resolveDaemonContainerContext(env));
  const fileLog = (() => {
    try {
      return getResolvedLoggerSettings().file;
    } catch {
      return null;
    }
  })();
  if (platform === "linux" && isSystemdUnavailableDetail(runtime.detail)) {
    hints.push(
      ...renderSystemdUnavailableHints({
        wsl: isWSLEnv(env),
        kind: classifySystemdUnavailableDetail(runtime.detail),
        container,
      }),
    );
    if (fileLog) hints.push(`File logs: ${fileLog}`);
    return hints;
  }
  if (runtime.cachedLabel && platform === "darwin") {
    const label = resolveGatewayLaunchAgentLabel(env.OPENCLAW_PROFILE);
    hints.push(
      `LaunchAgent label cached but plist missing. Clear with: launchctl bootout gui/$UID/${label}`,
    );
    hints.push(`Then reinstall: ${formatCliCommand("openclaw gateway install", env)}`);
  }
  if (runtime.missingUnit) {
    hints.push(`Service not installed. Run: ${formatCliCommand("openclaw gateway install", env)}`);
    if (fileLog) hints.push(`File logs: ${fileLog}`);
    return hints;
  }
  if (runtime.missingGuiSession && platform === "darwin") {
    hints.push(
      "LaunchAgent requires a logged-in macOS GUI session; SSH/headless/sudo shells cannot bootstrap gui/$UID.",
    );
    hints.push(
      `Sign in to the macOS desktop as this user, then run: ${formatCliCommand("openclaw gateway restart", env)}`,
    );
    hints.push(
      "For headless VM setups, enable auto-login for the target user or use a custom LaunchDaemon (not shipped).",
    );
    if (fileLog) hints.push(`File logs: ${fileLog}`);
    return hints;
  }
  if (runtime.missingSupervision && platform === "darwin") {
    hints.push(
      `LaunchAgent installed but not loaded. Run: ${formatCliCommand("openclaw gateway restart", env)}`,
    );
    if (fileLog) hints.push(`File logs: ${fileLog}`);
    return hints;
  }
  if (runtime.status === "stopped") {
    if (platform === "linux" && isSystemdStartLimitHit(runtime))
      hints.push(
        "systemd stopped restarting the gateway after repeated crashes.",
        `Recover with: ${formatCliCommand("openclaw gateway restart", env)}, then inspect logs if it keeps crashing.`,
      );
    else hints.push("Service is loaded but not running (likely exited immediately).");
    if (fileLog) hints.push(`File logs: ${fileLog}`);
    hints.push(
      ...buildPlatformRuntimeLogHints({
        platform,
        env,
        systemdServiceName: resolveGatewaySystemdServiceName(env.OPENCLAW_PROFILE),
        windowsTaskName: resolveGatewayWindowsTaskName(env.OPENCLAW_PROFILE),
      }),
    );
  }
  if (platform === "linux" && isSystemdCgroupHygieneRisk(runtime.systemd)) {
    const unit =
      runtime.systemd?.unit ?? `${resolveGatewaySystemdServiceName(env.OPENCLAW_PROFILE)}.service`;
    const summary = getSystemdCgroupHygieneSummary(runtime.systemd);
    if (summary)
      hints.push(
        `Systemd cgroup hygiene looks elevated: ${summary}.`,
        "This usually means old helper or browser processes may still be attached to the gateway service.",
        `Run: systemctl --user show ${unit} -p KillMode -p TasksCurrent -p MemoryCurrent -p MainPID`,
        `Run: systemd-cgls --user-unit ${unit}`,
        `After reviewing service settings, run: ${formatCliCommand("openclaw gateway restart", env)}`,
      );
  }
  return hints;
}
//#endregion
//#region src/commands/doctor-gateway-daemon-flow.ts
/** Doctor gateway daemon repair flow for service install, bootstrap, restart, and port hints. */
function noteGatewayRuntime(serviceRuntime, env) {
  const summary = formatGatewayRuntimeSummary(serviceRuntime);
  const hints = buildGatewayRuntimeHints(serviceRuntime, {
    platform: process.platform,
    env,
  });
  if (!summary && hints.length === 0) return;
  const lines = [];
  if (summary) lines.push(`Runtime: ${summary}`);
  lines.push(...hints);
  note(lines.join("\n"), "Gateway");
}
async function maybeRepairLaunchAgentBootstrap(params) {
  if (process.platform !== "darwin") return { status: "skipped" };
  if (!(await launchAgentPlistExists(params.env))) return { status: "skipped" };
  if (await isLaunchAgentLoaded({ env: params.env })) return { status: "skipped" };
  note("LaunchAgent is installed but not loaded in launchd.", `${params.title} LaunchAgent`);
  if (params.serviceRepairExternal) {
    note(EXTERNAL_SERVICE_REPAIR_NOTE, `${params.title} LaunchAgent`);
    return { status: "skipped" };
  }
  if (
    !(await confirmDoctorServiceRepair(params.prompter, {
      message: `Repair ${params.title} LaunchAgent bootstrap now?`,
      initialValue: true,
    }))
  )
    return { status: "skipped" };
  params.runtime.log(`Bootstrapping ${params.title} LaunchAgent...`);
  const repair = await repairLaunchAgentBootstrap({ env: params.env });
  if (!repair.ok) {
    if (repair.status === "gui-session-unavailable")
      return {
        status: "gui-session-unavailable",
        detail: repair.detail,
      };
    params.runtime.error(
      `${params.title} LaunchAgent bootstrap failed: ${repair.detail ?? "unknown error"}`,
    );
    return { status: "skipped" };
  }
  if (!(await isLaunchAgentLoaded({ env: params.env }))) {
    params.runtime.error(`${params.title} LaunchAgent still not loaded after repair.`);
    return { status: "skipped" };
  }
  note(`${params.title} LaunchAgent repaired.`, `${params.title} LaunchAgent`);
  return { status: "repaired" };
}
function renderBlockingSystemGatewayServices(services) {
  return [
    "System-level OpenClaw gateway service detected while the user gateway service is not installed.",
    ...services.map((svc) => `- ${svc.label} (${svc.detail})`),
    "OpenClaw will not install a second user-level gateway service automatically.",
    "Run `openclaw gateway status --deep` or `openclaw doctor --deep` to inspect duplicate services.",
    `Set ${SERVICE_REPAIR_POLICY_ENV}=external if a system supervisor owns the gateway lifecycle.`,
  ].join("\n");
}
function renderEstablishedGatewayConnections(connections) {
  return [
    "Established Gateway TCP clients detected:",
    ...connections.slice(0, 8).map((connection) => {
      return `- ${connection.pid ? `pid=${connection.pid}` : "pid=?"} ${connection.direction}${connection.command ? ` ${connection.command}` : ""}${connection.address ? ` ${connection.address}` : ""}${connection.commandLine ? ` cmd=${connection.commandLine}` : ""}`;
    }),
    ...(connections.length > 8 ? [`- ... ${connections.length - 8} more connection(s)`] : []),
    "If logs show protocol mismatch after rollback, stop stale OpenClaw client processes listed here and rerun doctor.",
  ].join("\n");
}
async function maybeReportEstablishedGatewayClients(params) {
  if (!params.deep || params.cfg.gateway?.mode === "remote") return;
  const establishedClients = (
    await inspectPortConnections(params.port ?? resolveGatewayPort(params.cfg, process.env)).catch(
      () => null,
    )
  )?.connections.filter((connection) => connection.direction !== "server");
  if (establishedClients && establishedClients.length > 0)
    note(renderEstablishedGatewayConnections(establishedClients), "Gateway clients");
}
/**
 * Repairs or diagnoses the local gateway service after the health check fails.
 *
 * Remote gateway mode is only diagnosed; local mode may bootstrap launchd, install missing
 * services, report port conflicts, or restart unhealthy supervision when policy allows.
 */
async function maybeRepairGatewayDaemon(params) {
  if (params.healthOk) {
    await maybeReportEstablishedGatewayClients({
      cfg: params.cfg,
      deep: params.options.deep ?? false,
    });
    return;
  }
  if (params.healthSkipped && params.cfg.gateway?.mode === "remote") return;
  const serviceRepairPolicy = resolveServiceRepairPolicy();
  const serviceRepairExternal = isServiceRepairExternallyManaged(serviceRepairPolicy);
  const service = resolveGatewayService();
  const isLocalDarwinGateway =
    process.platform === "darwin" && params.cfg.gateway?.mode !== "remote";
  let loaded;
  try {
    loaded = await service.isLoaded({ env: process.env });
  } catch {
    loaded = false;
  }
  let serviceRuntime;
  const command = params.options.deep
    ? await Promise.resolve(service.readCommand(process.env)).catch(() => null)
    : null;
  const serviceEnv = command?.environment
    ? {
        ...process.env,
        ...command.environment,
      }
    : process.env;
  if (loaded || isLocalDarwinGateway)
    serviceRuntime = await service.readRuntime(serviceEnv).catch(() => void 0);
  if (params.options.deep) {
    const handoff = readGatewayRestartHandoffSync(serviceEnv);
    if (handoff) note(formatGatewayRestartHandoffDiagnostic(handoff), "Gateway");
  }
  if (isLocalDarwinGateway) {
    const gatewayRepair = serviceRuntime?.missingGuiSession
      ? {
          status: "gui-session-unavailable",
          detail: serviceRuntime.detail ?? "",
        }
      : await maybeRepairLaunchAgentBootstrap({
          env: process.env,
          title: "Gateway",
          runtime: params.runtime,
          prompter: params.prompter,
          serviceRepairExternal,
        });
    await maybeRepairLaunchAgentBootstrap({
      env: {
        ...process.env,
        OPENCLAW_LAUNCHD_LABEL: resolveNodeLaunchAgentLabel(),
      },
      title: "Node",
      runtime: params.runtime,
      prompter: params.prompter,
      serviceRepairExternal,
    });
    if (gatewayRepair.status === "gui-session-unavailable")
      serviceRuntime = {
        status: "unknown",
        detail: gatewayRepair.detail || serviceRuntime?.detail,
        missingSupervision: true,
        missingGuiSession: true,
      };
    if (gatewayRepair.status === "repaired") {
      loaded = await service.isLoaded({ env: process.env });
      if (loaded) serviceRuntime = await service.readRuntime(process.env).catch(() => void 0);
    }
  }
  if (params.cfg.gateway?.mode !== "remote") {
    const port = resolveGatewayPort(params.cfg, process.env);
    const diagnostics = await inspectPortUsage(port);
    await maybeReportEstablishedGatewayClients({
      cfg: params.cfg,
      deep: params.options.deep ?? false,
      port,
    });
    if (
      diagnostics.status === "busy" &&
      !isExpectedGatewayListeners(diagnostics.listeners, diagnostics.port)
    )
      note(formatPortDiagnostics(diagnostics).join("\n"), "Gateway port");
    else if (loaded && serviceRuntime?.status === "running") {
      const lastError = await readLastGatewayErrorLine(process.env);
      if (lastError) note(`Last gateway error: ${lastError}`, "Gateway");
    }
  }
  if (!loaded) {
    if (
      isLocalDarwinGateway &&
      (serviceRuntime?.missingGuiSession ||
        serviceRuntime?.missingSupervision ||
        serviceRuntime?.cachedLabel)
    ) {
      noteGatewayRuntime(serviceRuntime, process.env);
      return;
    }
    if (process.platform === "linux") {
      if (!(await isSystemdUserServiceAvailable().catch(() => false))) {
        note(
          renderSystemdUnavailableHints({
            wsl: await isWSL(),
            kind: "generic_unavailable",
          }).join("\n"),
          "Gateway",
        );
        return;
      }
    }
    note("Gateway service not installed.", "Gateway");
    if (params.cfg.gateway?.mode !== "remote") {
      if (process.platform === "linux") {
        const systemGatewayServices = await findSystemGatewayServices();
        if (systemGatewayServices.length > 0) {
          note(renderBlockingSystemGatewayServices(systemGatewayServices), "Gateway");
          return;
        }
      }
      if (serviceRepairExternal) {
        note(EXTERNAL_SERVICE_REPAIR_NOTE, "Gateway");
        return;
      }
      const install = await confirmDoctorServiceRepair(
        params.prompter,
        {
          message: "Install gateway service now?",
          initialValue: true,
          requiresInteractiveConfirmation: true,
        },
        serviceRepairPolicy,
      );
      if (!install)
        note(
          `Run ${formatCliCommand("openclaw gateway install")} when you want to install the gateway service.`,
          "Gateway",
        );
      if (install) {
        const daemonRuntime = await params.prompter.select(
          {
            message: "Gateway service runtime",
            options: GATEWAY_DAEMON_RUNTIME_OPTIONS,
            initialValue: DEFAULT_GATEWAY_DAEMON_RUNTIME,
          },
          DEFAULT_GATEWAY_DAEMON_RUNTIME,
        );
        const tokenResolution = await resolveGatewayInstallToken({
          config: params.cfg,
          env: process.env,
        });
        for (const warning of tokenResolution.warnings) note(warning, "Gateway");
        if (tokenResolution.unavailableReason) {
          note(
            [
              "Gateway service install aborted.",
              tokenResolution.unavailableReason,
              "Fix gateway auth config/token input and rerun doctor.",
            ].join("\n"),
            "Gateway",
          );
          return;
        }
        const port = resolveGatewayPort(params.cfg, process.env);
        const { programArguments, workingDirectory, environment, environmentValueSources } =
          await buildGatewayInstallPlan({
            env: process.env,
            port,
            runtime: daemonRuntime,
            warn: (message, title) => note(message, title),
            config: params.cfg,
          });
        try {
          await service.install({
            env: process.env,
            stdout: process.stdout,
            programArguments,
            workingDirectory,
            environment,
            environmentValueSources,
          });
        } catch (err) {
          note(`Gateway service install failed: ${String(err)}`, "Gateway");
          note(gatewayInstallErrorHint(), "Gateway");
        }
      }
    }
    return;
  }
  noteGatewayRuntime(serviceRuntime, process.env);
  if (serviceRuntime?.status !== "running") {
    if (params.healthSkipped && serviceRuntime?.status !== "stopped") return;
    if (serviceRepairExternal) {
      note(EXTERNAL_SERVICE_REPAIR_NOTE, "Gateway");
      return;
    }
    if (
      await confirmDoctorServiceRepair(
        params.prompter,
        {
          message: "Start gateway service now?",
          initialValue: true,
        },
        serviceRepairPolicy,
      )
    ) {
      const restartStatus = describeGatewayServiceRestart(
        "Gateway",
        await service.restart({
          env: process.env,
          stdout: process.stdout,
        }),
      );
      if (!restartStatus.scheduled) await sleep(1500);
      else note(restartStatus.message, "Gateway");
    }
  }
  if (process.platform === "darwin") {
    const label = resolveGatewayLaunchAgentLabel(process.env.OPENCLAW_PROFILE);
    note(
      `LaunchAgent loaded; stopping requires "${formatCliCommand("openclaw gateway stop")}" or launchctl bootout gui/$UID/${label}.`,
      "Gateway",
    );
  }
  if (serviceRuntime?.status === "running") {
    if (params.healthSkipped) return;
    if (serviceRepairExternal) {
      note(EXTERNAL_SERVICE_REPAIR_NOTE, "Gateway");
      return;
    }
    if (readGatewayRestartHandoffSync(serviceEnv))
      try {
        await healthCommand(
          {
            json: false,
            timeoutMs: 1e4,
          },
          params.runtime,
        );
        note("Gateway is healthy after recent restart; skipping restart prompt.", "Gateway");
        return;
      } catch {}
    if (params.options.nonInteractive === true) return;
    if (
      await confirmDoctorServiceRepair(
        params.prompter,
        {
          message: "Restart gateway service now?",
          initialValue: false,
        },
        serviceRepairPolicy,
      )
    ) {
      const restartStatus = describeGatewayServiceRestart(
        "Gateway",
        await service.restart({
          env: process.env,
          stdout: process.stdout,
        }),
      );
      if (restartStatus.scheduled) {
        note(restartStatus.message, "Gateway");
        return;
      }
      await sleep(1500);
      try {
        await healthCommand(
          {
            json: false,
            timeoutMs: 1e4,
          },
          params.runtime,
        );
      } catch (err) {
        if (String(err).includes("gateway closed")) {
          const closedDiagnostic = formatGatewayClosedDiagnostic(err);
          if (closedDiagnostic) {
            note(closedDiagnostic, "Gateway");
            note(params.gatewayDetailsMessage, "Gateway connection");
          } else {
            note("Gateway not running.", "Gateway");
            note(params.gatewayDetailsMessage, "Gateway connection");
          }
        } else params.runtime.error(formatHealthCheckFailure(err));
      }
    }
  }
}
//#endregion
export { maybeRepairGatewayDaemon };
