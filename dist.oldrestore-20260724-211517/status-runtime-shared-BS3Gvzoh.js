import { s as resolveDefaultAgentDir } from "./agent-scope-config-DVIR1nBa.js";
import "./program-args-CoV0mEiK.js";
import "./agent-scope-y9xQv_q1.js";
import { r as resolveDefaultModelForAgent } from "./codex-plugin-diagnostics-DxsLhCf5.js";
import {
  i as shouldUseCodexSyntheticUsageForRuntime,
  n as mergeUsageSummaries,
  r as resolveUsageCredentialType,
  t as buildCodexSyntheticUsageAuth,
} from "./codex-synthetic-usage-YVnbuLFB.js";
import {
  a as buildStatusOverviewSurfaceRows,
  t as buildGatewayStatusJsonPayload,
} from "./format-BCAYBsyK.js";
import { t as createLazyImportLoader } from "./lazy-promise-EhsWch5m.js";
import { t as resolveModelAuthLabel } from "./model-auth-label-CNEth1IL.js";
import "./model-selection-DOlkTrQa.js";
import { t as resolveNodeService } from "./node-service-DEXjf2qG.js";
import { a as listOpenAIAuthProfileProvidersForAgentRuntime } from "./openai-routing-Cu28Ynzk.js";
import { t as resolveAgentHarnessPolicy } from "./policy-C704eijA.js";
import { a as resolveGatewayService, i as readGatewayServiceState } from "./service-Dw37Ek79.js";
import { t as summarizeGatewayServiceLayout } from "./service-layout-Djhk2cQN.js";
import { t as formatDaemonRuntimeShort } from "./status.format-MDs8g2Ym.js";
//#region src/commands/status-overview-surface.ts
/** Converts the full status scan result into the shared overview surface. */
function buildStatusOverviewSurfaceFromScan(params) {
  return {
    cfg: params.scan.cfg,
    update: params.scan.update,
    tailscaleMode: params.scan.tailscaleMode,
    tailscaleDns: params.scan.tailscaleDns,
    tailscaleHttpsUrl: params.scan.tailscaleHttpsUrl,
    ...(params.scan.advertisedControlUiLinks
      ? { advertisedControlUiLinks: params.scan.advertisedControlUiLinks }
      : {}),
    gatewayMode: params.scan.gatewayMode,
    remoteUrlMissing: params.scan.remoteUrlMissing,
    gatewayConnection: params.scan.gatewayConnection,
    gatewayReachable: params.scan.gatewayReachable,
    gatewayProbe: params.scan.gatewayProbe,
    gatewayProbeAuth: params.scan.gatewayProbeAuth,
    gatewayProbeAuthWarning: params.scan.gatewayProbeAuthWarning,
    gatewaySelf: params.scan.gatewaySelf,
    gatewayService: params.gatewayService,
    nodeService: params.nodeService,
    nodeOnlyGateway: params.nodeOnlyGateway,
  };
}
/** Converts the lighter status-all overview scan into the shared overview surface. */
function buildStatusOverviewSurfaceFromOverview(params) {
  return {
    cfg: params.overview.cfg,
    update: params.overview.update,
    tailscaleMode: params.overview.tailscaleMode,
    tailscaleDns: params.overview.tailscaleDns,
    tailscaleHttpsUrl: params.overview.tailscaleHttpsUrl,
    ...(params.overview.advertisedControlUiLinks
      ? { advertisedControlUiLinks: params.overview.advertisedControlUiLinks }
      : {}),
    gatewayMode: params.overview.gatewaySnapshot.gatewayMode,
    remoteUrlMissing: params.overview.gatewaySnapshot.remoteUrlMissing,
    gatewayConnection: params.overview.gatewaySnapshot.gatewayConnection,
    gatewayReachable: params.overview.gatewaySnapshot.gatewayReachable,
    gatewayProbe: params.overview.gatewaySnapshot.gatewayProbe,
    gatewayProbeAuth: params.overview.gatewaySnapshot.gatewayProbeAuth,
    gatewayProbeAuthWarning: params.overview.gatewaySnapshot.gatewayProbeAuthWarning,
    gatewaySelf: params.overview.gatewaySnapshot.gatewaySelf,
    gatewayService: params.gatewayService,
    nodeService: params.nodeService,
    nodeOnlyGateway: params.nodeOnlyGateway,
  };
}
/** Builds overview rows from an already-normalized surface. */
function buildStatusOverviewRowsFromSurface(params) {
  return buildStatusOverviewSurfaceRows({
    cfg: params.surface.cfg,
    update: params.surface.update,
    tailscaleMode: params.surface.tailscaleMode,
    tailscaleDns: params.surface.tailscaleDns,
    tailscaleHttpsUrl: params.surface.tailscaleHttpsUrl,
    ...(params.surface.advertisedControlUiLinks
      ? { advertisedControlUiLinks: params.surface.advertisedControlUiLinks }
      : {}),
    tailscaleBackendState: params.tailscaleBackendState,
    includeBackendStateWhenOff: params.includeBackendStateWhenOff,
    includeBackendStateWhenOn: params.includeBackendStateWhenOn,
    includeDnsNameWhenOff: params.includeDnsNameWhenOff,
    decorateTailscaleOff: params.decorateTailscaleOff,
    decorateTailscaleWarn: params.decorateTailscaleWarn,
    gatewayMode: params.surface.gatewayMode,
    remoteUrlMissing: params.surface.remoteUrlMissing,
    gatewayConnection: params.surface.gatewayConnection,
    gatewayReachable: params.surface.gatewayReachable,
    gatewayProbe: params.surface.gatewayProbe,
    gatewayProbeAuth: params.surface.gatewayProbeAuth,
    gatewayProbeAuthWarning: params.surface.gatewayProbeAuthWarning,
    gatewaySelf: params.surface.gatewaySelf,
    gatewayService: params.surface.gatewayService,
    nodeService: params.surface.nodeService,
    nodeOnlyGateway: params.surface.nodeOnlyGateway,
    decorateOk: params.decorateOk,
    decorateWarn: params.decorateWarn,
    prefixRows: params.prefixRows,
    middleRows: params.middleRows,
    suffixRows: params.suffixRows,
    agentsValue: params.agentsValue,
    updateValue: params.updateValue,
    gatewayAuthWarningValue: params.gatewayAuthWarningValue,
    gatewaySelfFallbackValue: params.gatewaySelfFallbackValue,
  });
}
/** Builds the gateway JSON payload from the gateway portion of an overview surface. */
function buildStatusGatewayJsonPayloadFromSurface(params) {
  return buildGatewayStatusJsonPayload({
    gatewayMode: params.surface.gatewayMode,
    gatewayConnection: params.surface.gatewayConnection,
    remoteUrlMissing: params.surface.remoteUrlMissing,
    gatewayReachable: params.surface.gatewayReachable,
    gatewayProbe: params.surface.gatewayProbe,
    gatewaySelf: params.surface.gatewaySelf,
    gatewayProbeAuthWarning: params.surface.gatewayProbeAuthWarning,
  });
}
//#endregion
//#region src/commands/status.service-summary.ts
function normalizeServiceWrapperPath(command) {
  return command?.environment?.["OPENCLAW_WRAPPER"]?.trim() || void 0;
}
/** Reads a daemon service summary, falling back to unknown when service inspection fails. */
async function readServiceStatusSummary(service, fallbackLabel, timeoutMs) {
  try {
    const state = await readGatewayServiceState(service, {
      env: process.env,
      timeoutMs,
    });
    const layout = await summarizeGatewayServiceLayout(state.command);
    const wrapperPath = normalizeServiceWrapperPath(state.command);
    const managedByOpenClaw = state.installed;
    const externallyManaged = !managedByOpenClaw && state.running;
    const installed = managedByOpenClaw || externallyManaged;
    const loadedText = externallyManaged
      ? "running (externally managed)"
      : state.loaded
        ? service.loadedText
        : service.notLoadedText;
    return {
      label: service.label,
      installed,
      loaded: state.loaded,
      managedByOpenClaw,
      externallyManaged,
      loadedText,
      runtime: state.runtime,
      ...(layout ? { layout } : {}),
      ...(wrapperPath ? { wrapperPath } : {}),
    };
  } catch {
    return {
      label: fallbackLabel,
      installed: null,
      loaded: false,
      managedByOpenClaw: false,
      externallyManaged: false,
      loadedText: "unknown",
      runtime: void 0,
    };
  }
}
//#endregion
//#region src/commands/status.daemon.ts
async function buildDaemonStatusSummary(serviceLabel, timeoutMs) {
  const summary = await readServiceStatusSummary(
    serviceLabel === "gateway" ? resolveGatewayService() : resolveNodeService(),
    serviceLabel === "gateway" ? "Daemon" : "Node",
    timeoutMs,
  );
  return {
    label: summary.label,
    installed: summary.installed,
    loaded: summary.loaded,
    managedByOpenClaw: summary.managedByOpenClaw,
    externallyManaged: summary.externallyManaged,
    loadedText: summary.loadedText,
    runtime: summary.runtime,
    runtimeShort: formatDaemonRuntimeShort(summary.runtime),
    layout: summary.layout,
    wrapperPath: summary.wrapperPath,
  };
}
/** Returns the gateway daemon status summary. */
async function getDaemonStatusSummary(timeoutMs) {
  return await buildDaemonStatusSummary("gateway", timeoutMs);
}
/** Returns the node service status summary. */
async function getNodeDaemonStatusSummary(timeoutMs) {
  return await buildDaemonStatusSummary("node", timeoutMs);
}
//#endregion
//#region src/commands/status-runtime-shared.ts
const providerUsageLoader = createLazyImportLoader(() => import("./provider-usage-DCyZjr8M.js"));
const securityAuditModuleLoader = createLazyImportLoader(() => import("./audit.runtime.js"));
const readOnlyChannelPluginsModuleLoader = createLazyImportLoader(
  () => import("./read-only-DqCbWu3z.js"),
);
const gatewayCallModuleLoader = createLazyImportLoader(() => import("./call-BtFiTrFI.js"));
function loadProviderUsage() {
  return providerUsageLoader.load();
}
function loadSecurityAuditModule() {
  return securityAuditModuleLoader.load();
}
function loadReadOnlyChannelPluginsModule() {
  return readOnlyChannelPluginsModuleLoader.load();
}
function loadGatewayCallModule() {
  return gatewayCallModuleLoader.load();
}
function shouldUseConfiguredCodexSyntheticUsage(params) {
  const configuredDefault = resolveDefaultModelForAgent({
    cfg: params.config,
    allowPluginNormalization: false,
  });
  const policy = resolveAgentHarnessPolicy({
    config: params.config,
    provider: configuredDefault.provider,
    modelId: configuredDefault.model,
  });
  if (
    !shouldUseCodexSyntheticUsageForRuntime({
      provider: configuredDefault.provider,
      effectiveHarness: policy.runtime,
    })
  )
    return false;
  return (
    resolveUsageCredentialType(
      resolveModelAuthLabel({
        provider: configuredDefault.provider,
        acceptedProviderIds: listOpenAIAuthProfileProvidersForAgentRuntime({
          provider: configuredDefault.provider,
          harnessRuntime: policy.runtime,
          config: params.config,
        }),
        cfg: params.config,
        agentDir: params.agentDir,
        includeExternalProfiles: false,
      }),
    ) !== "api_key"
  );
}
/** Runs the lightweight security audit used by status JSON/all output. */
async function resolveStatusSecurityAudit(params) {
  const { runSecurityAudit } = await loadSecurityAuditModule();
  const { resolveReadOnlyChannelPluginsForConfig } = await loadReadOnlyChannelPluginsModule();
  const readOnlyPlugins = resolveReadOnlyChannelPluginsForConfig(params.config, {
    activationSourceConfig: params.sourceConfig,
    includeSetupFallbackPlugins: false,
  });
  return await runSecurityAudit({
    config: params.config,
    sourceConfig: params.sourceConfig,
    deep: false,
    ...(params.timeoutMs !== void 0 ? { deepTimeoutMs: params.timeoutMs } : {}),
    includeFilesystem: true,
    includeChannelSecurity: true,
    loadPluginSecurityCollectors: false,
    ...(readOnlyPlugins.missingConfiguredChannelIds.length === 0
      ? { plugins: readOnlyPlugins.plugins }
      : {}),
  });
}
/** Loads provider usage for status output, defaulting to the config's default agent directory. */
async function resolveStatusUsageSummary(params) {
  const { loadProviderUsageSummary } = await loadProviderUsage();
  const agentDir = params.agentDir ?? resolveDefaultAgentDir(params.config);
  const usage = await loadProviderUsageSummary({
    timeoutMs: params.timeoutMs,
    config: params.config,
    agentDir,
  });
  if (
    !shouldUseConfiguredCodexSyntheticUsage({
      config: params.config,
      agentDir,
    })
  )
    return usage;
  return mergeUsageSummaries(
    usage,
    await loadProviderUsageSummary({
      timeoutMs: params.timeoutMs,
      providers: ["openai"],
      auth: [buildCodexSyntheticUsageAuth()],
      config: params.config,
      agentDir,
    }),
  );
}
/** Exposes the lazily loaded provider-usage module for callers that need its helpers. */
async function loadStatusProviderUsageModule() {
  return await loadProviderUsage();
}
/** Calls gateway health and lets errors propagate to deep status callers. */
async function resolveStatusGatewayHealth(params) {
  const { callGateway } = await loadGatewayCallModule();
  return await callGateway({
    method: "health",
    params: { probe: true },
    timeoutMs: params.timeoutMs,
    config: params.config,
  });
}
/** Calls gateway health but converts unreachable/failing probes into an error object. */
async function resolveStatusGatewayHealthSafe(params) {
  if (!params.gatewayReachable) return { error: params.gatewayProbeError ?? "gateway unreachable" };
  const { callGateway } = await loadGatewayCallModule();
  return await callGateway({
    method: "health",
    params: { probe: true },
    timeoutMs: params.timeoutMs,
    config: params.config,
    ...params.callOverrides,
  }).catch((err) => ({ error: String(err) }));
}
/** Reads gateway delivery diagnostics when reachable, returning null on failures. */
async function resolveStatusGatewayDiagnosticsSafe(params) {
  if (!params.gatewayReachable) return null;
  const { callGateway } = await loadGatewayCallModule();
  return await callGateway({
    method: "diagnostics.stability",
    params: { limit: 1e3 },
    timeoutMs: params.timeoutMs,
    config: params.config,
    ...params.callOverrides,
  }).catch(() => null);
}
/** Reads the most recent gateway heartbeat only when the gateway probe succeeded. */
async function resolveStatusLastHeartbeat(params) {
  if (!params.gatewayReachable) return null;
  const { callGateway } = await loadGatewayCallModule();
  return await callGateway({
    method: "last-heartbeat",
    params: {},
    timeoutMs: params.timeoutMs,
    config: params.config,
  }).catch(() => null);
}
const DEFAULT_SERVICE_PROBE_TIMEOUT_MS = 5e3;
/** Resolves launchd/systemd summaries for the gateway and node services together. */
async function resolveStatusServiceSummaries(timeoutMs) {
  const probeTimeoutMs = timeoutMs ?? DEFAULT_SERVICE_PROBE_TIMEOUT_MS;
  return await Promise.all([
    getDaemonStatusSummary(probeTimeoutMs),
    getNodeDaemonStatusSummary(probeTimeoutMs),
  ]);
}
/** Resolves optional usage/deep runtime details plus service summaries for status output. */
async function resolveStatusRuntimeDetails(params) {
  const resolveUsageSummary = params.resolveUsage ?? resolveStatusUsageSummary;
  const resolveGatewayHealthSummary = params.resolveHealth ?? resolveStatusGatewayHealth;
  const usage = params.usage
    ? await resolveUsageSummary({
        timeoutMs: params.timeoutMs,
        config: params.config,
      })
    : void 0;
  const health = params.deep
    ? params.suppressHealthErrors
      ? await resolveGatewayHealthSummary({
          config: params.config,
          timeoutMs: params.timeoutMs,
        }).catch(() => void 0)
      : await resolveGatewayHealthSummary({
          config: params.config,
          timeoutMs: params.timeoutMs,
        })
    : void 0;
  const lastHeartbeat = params.deep
    ? await resolveStatusLastHeartbeat({
        config: params.config,
        timeoutMs: params.timeoutMs,
        gatewayReachable: params.gatewayReachable,
      })
    : null;
  const [gatewayService, nodeService] = await resolveStatusServiceSummaries(params.timeoutMs);
  return {
    usage,
    health,
    lastHeartbeat,
    gatewayService,
    nodeService,
  };
}
/** Resolves the full runtime snapshot, including optional security audit, for status JSON/text. */
async function resolveStatusRuntimeSnapshot(params) {
  return {
    securityAudit: params.includeSecurityAudit
      ? await (params.resolveSecurityAudit ?? resolveStatusSecurityAudit)({
          config: params.config,
          sourceConfig: params.sourceConfig,
          timeoutMs: params.timeoutMs,
        })
      : void 0,
    ...(await resolveStatusRuntimeDetails({
      config: params.config,
      timeoutMs: params.timeoutMs,
      usage: params.usage,
      deep: params.deep,
      gatewayReachable: params.gatewayReachable,
      suppressHealthErrors: params.suppressHealthErrors,
      resolveUsage: params.resolveUsage,
      resolveHealth: params.resolveHealth,
    })),
  };
}
//#endregion
export {
  resolveStatusRuntimeSnapshot as a,
  resolveStatusUsageSummary as c,
  buildStatusOverviewSurfaceFromOverview as d,
  buildStatusOverviewSurfaceFromScan as f,
  resolveStatusGatewayHealthSafe as i,
  buildStatusGatewayJsonPayloadFromSurface as l,
  resolveStatusGatewayDiagnosticsSafe as n,
  resolveStatusSecurityAudit as o,
  resolveStatusGatewayHealth as r,
  resolveStatusServiceSummaries as s,
  loadStatusProviderUsageModule as t,
  buildStatusOverviewRowsFromSurface as u,
};
