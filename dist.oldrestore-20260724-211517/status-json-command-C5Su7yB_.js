import { m as resolveStatusUpdateChannelInfo } from "./format-BCAYBsyK.js";
import { i as writeRuntimeJson } from "./runtime-Bz6o617W.js";
import {
  a as resolveStatusRuntimeSnapshot,
  f as buildStatusOverviewSurfaceFromScan,
  l as buildStatusGatewayJsonPayloadFromSurface,
} from "./status-runtime-shared-BS3Gvzoh.js";
//#region src/commands/status-json-payload.ts
/** Combines scan summary, overview surface, services, agents, diagnostics, and optional deep probes. */
function buildStatusJsonPayload(params) {
  const channelInfo = resolveStatusUpdateChannelInfo({
    updateConfigChannel: params.surface.cfg.update?.channel ?? void 0,
    update: params.surface.update,
  });
  return {
    ...params.summary,
    os: params.osSummary,
    update: params.surface.update,
    updateChannel: channelInfo.channel,
    updateChannelSource: channelInfo.source,
    memory: params.memory,
    memoryPlugin: params.memoryPlugin,
    gateway: buildStatusGatewayJsonPayloadFromSurface({ surface: params.surface }),
    gatewayService: params.surface.gatewayService,
    nodeService: params.surface.nodeService,
    agents: params.agents,
    secretDiagnostics: params.secretDiagnostics,
    ...(params.securityAudit ? { securityAudit: params.securityAudit } : {}),
    ...(params.pluginCompatibility
      ? {
          pluginCompatibility: {
            count: params.pluginCompatibility.length,
            warnings: params.pluginCompatibility,
          },
        }
      : {}),
    ...(params.health || params.usage || params.lastHeartbeat
      ? {
          health: params.health,
          usage: params.usage,
          lastHeartbeat: params.lastHeartbeat,
        }
      : {}),
  };
}
//#endregion
//#region src/commands/status-json-runtime.ts
/** Builds the status JSON object from a completed scan plus optional runtime/deep probes. */
async function resolveStatusJsonOutput(params) {
  const { scan, opts } = params;
  const { securityAudit, usage, health, lastHeartbeat, gatewayService, nodeService } =
    await resolveStatusRuntimeSnapshot({
      config: scan.cfg,
      sourceConfig: scan.sourceConfig,
      timeoutMs: opts.timeoutMs,
      usage: opts.usage,
      deep: opts.deep,
      gatewayReachable: scan.gatewayReachable,
      includeSecurityAudit: params.includeSecurityAudit,
      suppressHealthErrors: params.suppressHealthErrors,
    });
  return buildStatusJsonPayload({
    summary: scan.summary,
    surface: buildStatusOverviewSurfaceFromScan({
      scan,
      gatewayService,
      nodeService,
    }),
    osSummary: scan.osSummary,
    memory: scan.memory,
    memoryPlugin: scan.memoryPlugin,
    agents: scan.agentStatus,
    secretDiagnostics: scan.secretDiagnostics,
    securityAudit,
    health,
    usage,
    lastHeartbeat,
    pluginCompatibility: params.includePluginCompatibility ? scan.pluginCompatibility : void 0,
  });
}
//#endregion
//#region src/commands/status-json-command.ts
/** Runs the fast status scan, resolves optional deep fields, and writes JSON through the runtime. */
async function runStatusJsonCommand(params) {
  const scan = await params.scanStatusJsonFast(
    {
      timeoutMs: params.opts.timeoutMs,
      all: params.opts.all,
    },
    params.runtime,
  );
  writeRuntimeJson(
    params.runtime,
    await resolveStatusJsonOutput({
      scan,
      opts: params.opts,
      includeSecurityAudit: params.includeSecurityAudit,
      includePluginCompatibility: params.includePluginCompatibility,
      suppressHealthErrors: params.suppressHealthErrors,
    }),
  );
}
//#endregion
export { runStatusJsonCommand as t };
