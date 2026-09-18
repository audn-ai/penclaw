import {
  n as statusChannelsTableColumns,
  t as buildStatusChannelsTableRows,
} from "./channels-table-DxFNivs3.js";
import {
  c as normalizePairingConnectRequestId,
  d as readConnectPairingRequiredMessage,
  f as readPairingConnectErrorDetails,
} from "./connect-error-details-BxqBqDDT.js";
import { t as createLazyImportLoader } from "./lazy-promise-EhsWch5m.js";
import { P as timestampMsToIsoString } from "./number-coercion-CJQ8TR--.js";
import { t as OPENCLAW_WRAPPER_ENV_KEY } from "./program-args-CoV0mEiK.js";
import { r as withProgress } from "./progress-DXZjrYcT.js";
import { c as readRestartSentinel } from "./restart-sentinel-CJp3hEwi.js";
import { t as sanitizeTerminalText } from "./safe-text-DiGQuw-e.js";
import { t as runStatusJsonCommand } from "./status-json-command-C5Su7yB_.js";
import {
  a as resolveStatusRuntimeSnapshot,
  c as resolveStatusUsageSummary,
  f as buildStatusOverviewSurfaceFromScan,
  o as resolveStatusSecurityAudit,
  r as resolveStatusGatewayHealth,
  t as loadStatusProviderUsageModule,
} from "./status-runtime-shared-BS3Gvzoh.js";
import { t as logGatewayConnectionDetails } from "./status.gateway-connection-BhoLn6II.js";
import {
  C as buildStatusSystemEventsRows,
  S as buildStatusSessionsRows,
  T as statusHealthColumns,
  _ as buildStatusHealthRows,
  b as buildStatusPluginCompatibilityLines,
  c as buildStatusOverviewSection,
  d as buildStatusUsageSection,
  g as buildStatusFooterLines,
  h as buildStatusCommandOverviewRows,
  l as buildStatusSessionsSection,
  o as buildStatusChannelsTableSection,
  p as formatUpdateRestartStatusValue,
  s as buildStatusHealthSection,
  t as appendStatusReportSections,
  u as buildStatusSystemEventsSection,
  v as buildStatusModelSelectionLines,
  w as buildStatusSystemEventsTrailer,
  x as buildStatusSecurityAuditLines,
  y as buildStatusPairingRecoveryLines,
} from "./text-report-sWBb7rU3.js";
//#region src/commands/status.command-report-data.ts
/** Builds all table rows, section lines, and footer data needed by the status report renderer. */
async function buildStatusCommandReportData(params) {
  const overviewRows = buildStatusCommandOverviewRows({
    opts: params.opts,
    surface: params.surface,
    osLabel: params.osSummary.label,
    summary: params.summary,
    health: params.health,
    lastHeartbeat: params.lastHeartbeat,
    agentStatus: params.agentStatus,
    memory: params.memory,
    memoryPlugin: params.memoryPlugin,
    pluginCompatibility: params.pluginCompatibility,
    ok: params.ok,
    warn: params.warn,
    muted: params.muted,
    formatTimeAgo: params.formatTimeAgo,
    formatKTokens: params.formatKTokens,
    resolveMemoryVectorState: params.resolveMemoryVectorState,
    resolveMemoryFtsState: params.resolveMemoryFtsState,
    resolveMemoryCacheSummary: params.resolveMemoryCacheSummary,
    updateValue: params.updateValue,
    updateRestartValue: params.updateRestartValue,
  });
  const sessionsColumns = [
    {
      key: "Key",
      header: "Key",
      minWidth: 20,
      flex: true,
    },
    {
      key: "Kind",
      header: "Kind",
      minWidth: 6,
    },
    {
      key: "Age",
      header: "Age",
      minWidth: 9,
    },
    {
      key: "Model",
      header: "Model",
      minWidth: 14,
    },
    {
      key: "Runtime",
      header: "Runtime",
      minWidth: 14,
    },
    {
      key: "Tokens",
      header: "Tokens",
      minWidth: 16,
    },
    ...(params.opts.verbose
      ? [
          {
            key: "Cache",
            header: "Cache",
            minWidth: 16,
            flex: true,
          },
        ]
      : []),
  ];
  const securityAuditLines = params.securityAudit
    ? buildStatusSecurityAuditLines({
        securityAudit: params.securityAudit,
        theme: params.theme,
        shortenText: params.shortenText,
        formatCliCommand: params.formatCliCommand,
      })
    : [
        params.theme.muted(
          `Skipped in fast status. Full report: ${params.formatCliCommand("openclaw security audit")}`,
        ),
        params.theme.muted(`Deep probe: ${params.formatCliCommand("openclaw status --deep")}`),
      ];
  const retainedLost = params.summary.taskAuditRetainedLost;
  const retainedLostLine =
    (params.opts.deep || params.opts.verbose) && retainedLost && retainedLost.count > 0
      ? params.theme.muted(
          `${retainedLost.count} lost task${retainedLost.count === 1 ? "" : "s"} retained until ${timestampMsToIsoString(retainedLost.nextCleanupAfter) ?? "cleanupAfter"}`,
        )
      : null;
  return {
    heading: params.theme.heading,
    muted: params.theme.muted,
    renderTable: params.renderTable,
    width: params.tableWidth,
    overviewRows,
    showTaskMaintenanceHint: params.summary.taskAudit.errors > 0,
    taskMaintenanceHint: `Task maintenance: ${params.formatCliCommand("openclaw tasks maintenance --apply")}`,
    retainedLostTaskLine: retainedLostLine,
    pluginCompatibilityLines: buildStatusPluginCompatibilityLines({
      notices: params.pluginCompatibility,
      formatNotice: params.formatPluginCompatibilityNotice,
      warn: params.theme.warn,
      muted: params.theme.muted,
    }),
    pairingRecoveryLines: buildStatusPairingRecoveryLines({
      pairingRecovery: params.pairingRecovery,
      warn: params.theme.warn,
      muted: params.theme.muted,
      formatCliCommand: params.formatCliCommand,
    }),
    modelSelectionLines: buildStatusModelSelectionLines({
      recent: params.summary.sessions.recent,
      shortenText: params.shortenText,
      warn: params.theme.warn,
      muted: params.theme.muted,
    }),
    securityAuditLines,
    channelsColumns: statusChannelsTableColumns,
    channelsRows: buildStatusChannelsTableRows({
      rows: params.channels.rows,
      channelIssues: params.channelIssues,
      ok: params.ok,
      warn: params.warn,
      muted: params.muted,
      accentDim: params.accentDim,
      formatIssueMessage: (message) => params.shortenText(message, 84),
    }),
    sessionsColumns,
    sessionsRows: buildStatusSessionsRows({
      recent: params.summary.sessions.recent,
      verbose: params.opts.verbose,
      shortenText: params.shortenText,
      formatTimeAgo: params.formatTimeAgo,
      formatTokensCompact: params.formatTokensCompact,
      formatPromptCacheCompact: params.formatPromptCacheCompact,
      muted: params.muted,
    }),
    systemEventsRows: buildStatusSystemEventsRows({
      queuedSystemEvents: params.summary.queuedSystemEvents,
    }),
    systemEventsTrailer: buildStatusSystemEventsTrailer({
      queuedSystemEvents: params.summary.queuedSystemEvents,
      muted: params.muted,
    }),
    healthColumns: params.health ? statusHealthColumns : void 0,
    healthRows: params.health
      ? buildStatusHealthRows({
          health: params.health,
          formatHealthChannelLines: params.formatHealthChannelLines,
          ok: params.ok,
          warn: params.warn,
          muted: params.muted,
        })
      : void 0,
    usageLines: params.usageLines,
    footerLines: buildStatusFooterLines({
      updateHint: params.formatUpdateAvailableHint(params.surface.update),
      warn: params.theme.warn,
      formatCliCommand: params.formatCliCommand,
      nodeOnlyGateway: params.surface.nodeOnlyGateway,
      gatewayReachable: params.surface.gatewayReachable,
    }),
  };
}
//#endregion
//#region src/commands/status.command-report.ts
/** Builds terminal lines for the standard status report. */
async function buildStatusCommandReportLines(params) {
  const lines = [];
  lines.push(params.heading("OpenClaw status"));
  appendStatusReportSections({
    lines,
    heading: params.heading,
    sections: [
      {
        ...buildStatusOverviewSection({
          width: params.width,
          renderTable: params.renderTable,
          rows: params.overviewRows,
        }),
      },
      {
        kind: "raw",
        body:
          params.showTaskMaintenanceHint || params.retainedLostTaskLine
            ? [
                "",
                ...(params.showTaskMaintenanceHint
                  ? [params.muted(params.taskMaintenanceHint)]
                  : []),
                ...(params.retainedLostTaskLine ? [params.retainedLostTaskLine] : []),
              ]
            : [],
        skipIfEmpty: true,
      },
      {
        kind: "lines",
        title: "Plugin compatibility",
        body: params.pluginCompatibilityLines,
        skipIfEmpty: true,
      },
      {
        kind: "raw",
        body: params.pairingRecoveryLines.length > 0 ? ["", ...params.pairingRecoveryLines] : [],
        skipIfEmpty: true,
      },
      {
        kind: "lines",
        title: "Model selection",
        body: params.modelSelectionLines,
        skipIfEmpty: true,
      },
      {
        kind: "lines",
        title: "Security audit",
        body: params.securityAuditLines,
      },
      params.channelsRows.length === 0
        ? {
            kind: "lines",
            title: "Channels",
            body: [params.muted("No channels configured")],
          }
        : {
            ...buildStatusChannelsTableSection({
              width: params.width,
              renderTable: params.renderTable,
              columns: params.channelsColumns,
              rows: params.channelsRows,
            }),
          },
      params.sessionsRows.length === 0
        ? {
            kind: "lines",
            title: "Sessions",
            body: [params.muted("No sessions")],
          }
        : {
            ...buildStatusSessionsSection({
              width: params.width,
              renderTable: params.renderTable,
              columns: params.sessionsColumns,
              rows: params.sessionsRows,
            }),
          },
      {
        ...buildStatusSystemEventsSection({
          width: params.width,
          renderTable: params.renderTable,
          rows: params.systemEventsRows,
          trailer: params.systemEventsTrailer,
        }),
      },
      {
        ...buildStatusHealthSection({
          width: params.width,
          renderTable: params.renderTable,
          columns: params.healthColumns,
          rows: params.healthRows,
        }),
      },
      { ...buildStatusUsageSection({ usageLines: params.usageLines }) },
      {
        kind: "raw",
        body: ["", ...params.footerLines],
      },
    ],
  });
  return lines;
}
//#endregion
//#region src/commands/status.command.ts
const statusScanModuleLoader = createLazyImportLoader(() => import("./status.scan-DBr9z8zG.js"));
const statusScanFastJsonModuleLoader = createLazyImportLoader(
  () => import("./status.scan.fast-json-r1I2gUjC.js"),
);
const statusAllModuleLoader = createLazyImportLoader(() => import("./status-all-IBkBlmO7.js"));
const statusCommandTextRuntimeLoader = createLazyImportLoader(
  () => import("./status.command.text-runtime-DWJfxtYh.js"),
);
const statusNodeModeModuleLoader = createLazyImportLoader(
  () => import("./status.node-mode-DE9fpz0b.js"),
);
function loadStatusScanModule() {
  return statusScanModuleLoader.load();
}
function loadStatusScanFastJsonModule() {
  return statusScanFastJsonModuleLoader.load();
}
function loadStatusAllModule() {
  return statusAllModuleLoader.load();
}
function loadStatusCommandTextRuntime() {
  return statusCommandTextRuntimeLoader.load();
}
function loadStatusNodeModeModule() {
  return statusNodeModeModuleLoader.load();
}
/** Extracts device-pairing recovery context from structured gateway errors or legacy message text. */
function resolvePairingRecoveryContext(params) {
  const structured = readPairingConnectErrorDetails(params.details);
  if (structured)
    return {
      requestId: normalizePairingConnectRequestId(structured.requestId) ?? null,
      reason: structured.reason ?? null,
      remediationHint: structured.remediationHint
        ? sanitizeTerminalText(structured.remediationHint)
        : null,
    };
  const pairing = readConnectPairingRequiredMessage(
    [params.error, params.closeReason]
      .filter((part) => typeof part === "string" && part.trim().length > 0)
      .join(" "),
  );
  if (!pairing) return null;
  return {
    requestId: normalizePairingConnectRequestId(pairing.requestId) ?? null,
    reason: pairing.reason ?? null,
    remediationHint: null,
  };
}
function normalizeStatusWrapperPath(value) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}
function resolveServiceWrapperContextHint(params) {
  const serviceWrapperPath = normalizeStatusWrapperPath(params.serviceWrapperPath);
  if (!serviceWrapperPath) return null;
  if (normalizeStatusWrapperPath(params.cliWrapperPath) === serviceWrapperPath) return null;
  return `The installed gateway service uses ${OPENCLAW_WRAPPER_ENV_KEY} (${sanitizeTerminalText(serviceWrapperPath)}), but this CLI process is not running with that same wrapper. Missing-secret diagnostics may describe the current CLI process rather than the installed gateway service context.`;
}
/** Runs `openclaw status`, including JSON/all routing and optional deep probes. */
async function statusCommand(opts, runtime) {
  if (opts.all && !opts.json) {
    await loadStatusAllModule().then(({ statusAllCommand }) =>
      statusAllCommand(runtime, { timeoutMs: opts.timeoutMs }),
    );
    return;
  }
  if (opts.json) {
    await runStatusJsonCommand({
      opts,
      runtime,
      includeSecurityAudit: opts.all === true,
      includePluginCompatibility: true,
      suppressHealthErrors: true,
      scanStatusJsonFast: async (scanOpts, runtimeForScan) =>
        await loadStatusScanFastJsonModule().then(({ scanStatusJsonFast }) =>
          scanStatusJsonFast(scanOpts, runtimeForScan),
        ),
    });
    return;
  }
  const scan = await loadStatusScanModule().then(({ scanStatus }) =>
    scanStatus(
      {
        json: false,
        timeoutMs: opts.timeoutMs,
        all: opts.all,
        deep: opts.deep,
      },
      runtime,
    ),
  );
  const {
    cfg,
    osSummary,
    tailscaleMode,
    tailscaleDns,
    tailscaleHttpsUrl,
    advertisedControlUiLinks,
    update,
    gatewayConnection,
    remoteUrlMissing,
    gatewayMode,
    gatewayProbeAuth,
    gatewayProbeAuthWarning,
    gatewayProbe,
    gatewayReachable,
    gatewaySelf,
    channelIssues,
    agentStatus,
    channels,
    summary,
    secretDiagnostics,
    memory,
    memoryPlugin,
    pluginCompatibility,
  } = scan;
  const {
    securityAudit,
    usage,
    health,
    lastHeartbeat,
    gatewayService: daemon,
    nodeService: nodeDaemon,
  } = await resolveStatusRuntimeSnapshot({
    config: scan.cfg,
    sourceConfig: scan.sourceConfig,
    timeoutMs: opts.timeoutMs,
    usage: opts.usage,
    deep: opts.deep,
    gatewayReachable,
    includeSecurityAudit: opts.all === true || opts.deep === true,
    resolveSecurityAudit: async (input) =>
      await withProgress(
        {
          label: "Running security audit…",
          indeterminate: true,
          enabled: true,
        },
        async () => await resolveStatusSecurityAudit(input),
      ),
    resolveUsage: async (input) =>
      await withProgress(
        {
          label: "Fetching usage snapshot…",
          indeterminate: true,
          enabled: opts.json !== true,
        },
        async () => await resolveStatusUsageSummary(input),
      ),
    resolveHealth: async (input) =>
      await withProgress(
        {
          label: "Checking gateway health…",
          indeterminate: true,
          enabled: opts.json !== true,
        },
        async () => await resolveStatusGatewayHealth(input),
      ),
  });
  const {
    buildStatusUpdateSurface,
    formatCliCommand,
    formatHealthChannelLines,
    formatKTokens,
    formatPromptCacheCompact,
    formatPluginCompatibilityNotice,
    formatTimeAgo,
    formatTokensCompact,
    formatUpdateAvailableHint,
    getTerminalTableWidth,
    info,
    renderTable,
    resolveMemoryCacheSummary,
    resolveMemoryFtsState,
    resolveMemoryVectorState,
    shortenText,
    theme,
  } = await loadStatusCommandTextRuntime();
  const muted = (value) => theme.muted(value);
  const ok = (value) => theme.success(value);
  const warn = (value) => theme.warn(value);
  const updateSurface = buildStatusUpdateSurface({
    updateConfigChannel: cfg.update?.channel,
    update,
  });
  if (opts.verbose) {
    const { buildGatewayConnectionDetails } = await import("./call-BtFiTrFI.js");
    logGatewayConnectionDetails({
      runtime,
      info,
      message: buildGatewayConnectionDetails({ config: scan.cfg }).message,
      trailingBlankLine: true,
    });
  }
  const tableWidth = getTerminalTableWidth();
  if (secretDiagnostics.length > 0) {
    runtime.log(theme.warn("Secret diagnostics:"));
    for (const entry of secretDiagnostics) runtime.log(`- ${entry}`);
    const wrapperContextHint = resolveServiceWrapperContextHint({
      serviceWrapperPath: daemon.wrapperPath,
      cliWrapperPath: process.env[OPENCLAW_WRAPPER_ENV_KEY],
    });
    if (wrapperContextHint) runtime.log(theme.warn(wrapperContextHint));
    runtime.log("");
  }
  const nodeOnlyGateway = await loadStatusNodeModeModule().then(({ resolveNodeOnlyGatewayInfo }) =>
    resolveNodeOnlyGatewayInfo({
      daemon,
      node: nodeDaemon,
    }),
  );
  const pairingRecovery = resolvePairingRecoveryContext({
    error: gatewayProbe?.error ?? null,
    closeReason: gatewayProbe?.close?.reason ?? null,
    details: gatewayProbe?.connectErrorDetails,
  });
  const usageLines = usage
    ? await loadStatusProviderUsageModule().then(({ formatUsageReportLines }) =>
        formatUsageReportLines(usage),
      )
    : void 0;
  const overviewSurface = buildStatusOverviewSurfaceFromScan({
    scan: {
      cfg,
      update,
      tailscaleMode,
      tailscaleDns,
      tailscaleHttpsUrl,
      ...(advertisedControlUiLinks ? { advertisedControlUiLinks } : {}),
      gatewayMode,
      remoteUrlMissing,
      gatewayConnection,
      gatewayReachable,
      gatewayProbe,
      gatewayProbeAuth,
      gatewayProbeAuthWarning,
      gatewaySelf,
    },
    gatewayService: daemon,
    nodeService: nodeDaemon,
    nodeOnlyGateway,
  });
  const updateRestartValue = formatUpdateRestartStatusValue(
    (await readRestartSentinel().catch(() => null))?.payload,
    {
      ok,
      warn,
      muted,
      formatTimeAgo,
    },
  );
  const lines = await buildStatusCommandReportLines(
    await buildStatusCommandReportData({
      opts,
      surface: overviewSurface,
      osSummary,
      summary,
      securityAudit,
      health,
      usageLines,
      lastHeartbeat,
      agentStatus,
      channels,
      channelIssues,
      memory,
      memoryPlugin,
      pluginCompatibility,
      pairingRecovery,
      tableWidth,
      ok,
      warn,
      muted,
      shortenText,
      formatCliCommand,
      formatTimeAgo,
      formatKTokens,
      formatTokensCompact,
      formatPromptCacheCompact,
      formatHealthChannelLines,
      formatPluginCompatibilityNotice,
      formatUpdateAvailableHint,
      resolveMemoryVectorState,
      resolveMemoryFtsState,
      resolveMemoryCacheSummary,
      accentDim: theme.accentDim,
      theme,
      renderTable,
      updateValue: updateSurface.updateAvailable
        ? warn(`available · ${updateSurface.updateLine}`)
        : updateSurface.updateLine,
      updateRestartValue,
    }),
  );
  for (const line of lines) runtime.log(line);
}
//#endregion
export { statusCommand as n, resolvePairingRecoveryContext as t };
