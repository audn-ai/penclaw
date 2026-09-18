import { n as resolveControlUiLinks } from "./control-ui-links-BImlWgwk.js";
import { r as formatDurationPrecise } from "./format-duration-DKk9BtRb.js";
import { f as resolveGatewayPort } from "./paths-DEklnbzU.js";
import "./config-BDv-QbJ6.js";
import {
  i as resolveUpdateAvailability,
  n as formatUpdateOneLiner,
} from "./status.update-gnpRVvCh.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import {
  f as resolveUpdateChannelDisplay,
  l as normalizeUpdateChannel,
} from "./update-channels-CQNa2YMG.js";
import { a as formatGitInstallLabel } from "./update-check-DaMnBu3x.js";
import { n as VERSION } from "./version-CeFj_iGk.js";
//#region src/commands/status-all/format.ts
/** Resolves the display update channel from config, install kind, and git metadata. */
function resolveStatusUpdateChannelInfo(params) {
  return resolveUpdateChannelDisplay({
    configChannel: normalizeUpdateChannel(params.updateConfigChannel),
    currentVersion: VERSION,
    installKind: params.update.installKind ?? "unknown",
    gitTag: params.update.git?.tag ?? null,
    gitBranch: params.update.git?.branch ?? null,
  });
}
/** Builds the update row fields reused by the overview table and status-all report. */
function buildStatusUpdateSurface(params) {
  const channelInfo = resolveStatusUpdateChannelInfo({
    updateConfigChannel: params.updateConfigChannel,
    update: params.update,
  });
  return {
    channelInfo,
    channelLabel: channelInfo.label,
    gitLabel: formatGitInstallLabel(params.update),
    updateLine: formatUpdateOneLiner(params.update).replace(/^Update:\s*/i, ""),
    updateAvailable: resolveUpdateAvailability(params.update).available,
  };
}
/** Formats missing dashboard URLs as disabled instead of leaking empty/null into status rows. */
function formatStatusDashboardValue(value) {
  const trimmed = normalizeOptionalString(value);
  return trimmed && trimmed.length > 0 ? trimmed : "disabled";
}
/** Formats Tailscale exposure in a compact, warning-aware status row value. */
function formatStatusTailscaleValue(params) {
  const decorateOff = params.decorateOff ?? ((value) => value);
  const decorateWarn = params.decorateWarn ?? ((value) => value);
  if (params.tailscaleMode === "off") {
    const suffix = [
      params.includeBackendStateWhenOff && params.backendState
        ? `daemon ${params.backendState}`
        : null,
      params.includeDnsNameWhenOff && params.dnsName ? params.dnsName : null,
    ]
      .filter(Boolean)
      .join(" · ");
    return decorateOff(suffix ? `off · ${suffix}` : "off");
  }
  if (params.dnsName && params.httpsUrl)
    return [
      params.tailscaleMode,
      params.includeBackendStateWhenOn ? (params.backendState ?? "unknown") : null,
      params.dnsName,
      params.httpsUrl,
    ]
      .filter(Boolean)
      .join(" · ");
  return decorateWarn(
    [
      params.tailscaleMode,
      params.includeBackendStateWhenOn ? (params.backendState ?? "unknown") : null,
      "magicdns unknown",
    ]
      .filter(Boolean)
      .join(" · "),
  );
}
/** Formats launchd/systemd service state into one row-friendly string. */
function formatStatusServiceValue(params) {
  if (!params.installed) return `${params.label} not installed`;
  const installedPrefix = params.managedByOpenClaw ? "installed · " : "";
  const runtimeSuffix = params.runtimeShort
    ? ` · ${params.runtimeShort}`
    : [
        params.runtimeStatus ? ` · ${params.runtimeStatus}` : "",
        params.runtimePid ? ` (pid ${params.runtimePid})` : "",
      ].join("");
  return `${params.label} ${installedPrefix}${params.loadedText}${runtimeSuffix}`;
}
/** Returns the dashboard URL when the Control UI is enabled for the current gateway binding. */
function resolveStatusDashboardUrl(params) {
  if (!(params.cfg.gateway?.controlUi?.enabled ?? true)) return null;
  return resolveControlUiLinks({
    port: resolveGatewayPort(params.cfg),
    bind: params.cfg.gateway?.bind,
    customBindHost: params.cfg.gateway?.customBindHost,
    basePath: params.cfg.gateway?.controlUi?.basePath,
    tlsEnabled: params.cfg.gateway?.tls?.enabled === true,
  }).httpUrl;
}
/** Builds the ordered overview rows shared by status command variants. */
function buildStatusOverviewRows(params) {
  const rows = [...(params.prefixRows ?? [])];
  rows.push(
    {
      Item: "Dashboard",
      Value: params.dashboardValue,
    },
    {
      Item: "Tailscale exposure",
      Value: params.tailscaleValue,
    },
    {
      Item: "Channel",
      Value: params.channelLabel,
    },
  );
  if (params.gitLabel)
    rows.push({
      Item: "Git",
      Value: params.gitLabel,
    });
  rows.push(
    {
      Item: "Update",
      Value: params.updateValue,
    },
    {
      Item: "Gateway",
      Value: params.gatewayValue,
    },
  );
  if (params.gatewayAuthWarning)
    rows.push({
      Item: "Gateway auth warning",
      Value: params.gatewayAuthWarning,
    });
  rows.push(...(params.middleRows ?? []));
  if (params.gatewaySelfValue != null)
    rows.push({
      Item: "Gateway self",
      Value: params.gatewaySelfValue,
    });
  rows.push(
    {
      Item: "Gateway service",
      Value: params.gatewayServiceValue,
    },
    {
      Item: "Node service",
      Value: params.nodeServiceValue,
    },
    {
      Item: "Agents",
      Value: params.agentsValue,
    },
  );
  rows.push(...(params.suffixRows ?? []));
  return rows;
}
/** Builds overview rows directly from raw scan/update/gateway inputs. */
function buildStatusOverviewSurfaceRows(params) {
  const updateSurface = buildStatusUpdateSurface({
    updateConfigChannel: params.cfg.update?.channel,
    update: params.update,
  });
  const { dashboardUrl, gatewayValue, gatewaySelfValue, gatewayServiceValue, nodeServiceValue } =
    buildStatusGatewaySurfaceValues({
      cfg: params.cfg,
      ...(params.advertisedControlUiLinks
        ? { advertisedControlUiLinks: params.advertisedControlUiLinks }
        : {}),
      gatewayMode: params.gatewayMode,
      remoteUrlMissing: params.remoteUrlMissing,
      gatewayConnection: params.gatewayConnection,
      gatewayReachable: params.gatewayReachable,
      gatewayProbe: params.gatewayProbe,
      gatewayProbeAuth: params.gatewayProbeAuth,
      gatewaySelf: params.gatewaySelf,
      gatewayService: params.gatewayService,
      nodeService: params.nodeService,
      nodeOnlyGateway: params.nodeOnlyGateway,
      decorateOk: params.decorateOk,
      decorateWarn: params.decorateWarn,
    });
  return buildStatusOverviewRows({
    prefixRows: params.prefixRows,
    dashboardValue: formatStatusDashboardValue(dashboardUrl),
    tailscaleValue: formatStatusTailscaleValue({
      tailscaleMode: params.tailscaleMode,
      dnsName: params.tailscaleDns,
      httpsUrl: params.tailscaleHttpsUrl,
      backendState: params.tailscaleBackendState,
      includeBackendStateWhenOff: params.includeBackendStateWhenOff,
      includeBackendStateWhenOn: params.includeBackendStateWhenOn,
      includeDnsNameWhenOff: params.includeDnsNameWhenOff,
      decorateOff: params.decorateTailscaleOff,
      decorateWarn: params.decorateTailscaleWarn,
    }),
    channelLabel: updateSurface.channelLabel,
    gitLabel: updateSurface.gitLabel,
    updateValue: params.updateValue ?? updateSurface.updateLine,
    gatewayValue,
    gatewayAuthWarning:
      params.gatewayAuthWarningValue !== void 0
        ? params.gatewayAuthWarningValue
        : params.gatewayProbeAuthWarning,
    middleRows: params.middleRows,
    gatewaySelfValue: params.gatewaySelfFallbackValue ?? gatewaySelfValue,
    gatewayServiceValue,
    nodeServiceValue,
    agentsValue: params.agentsValue,
    suffixRows: params.suffixRows,
  });
}
/** Returns which gateway auth material was actually used for the probe. */
function formatGatewayAuthUsed(auth) {
  const hasToken = Boolean(auth?.token?.trim());
  const hasPassword = Boolean(auth?.password?.trim());
  if (hasToken && hasPassword) return "token+password";
  if (hasToken) return "token";
  if (hasPassword) return "password";
  return "none";
}
/** Formats gateway self metadata returned by the health endpoint. */
function formatGatewaySelfSummary(gatewaySelf) {
  return gatewaySelf?.host || gatewaySelf?.ip || gatewaySelf?.version || gatewaySelf?.platform
    ? [
        gatewaySelf.host ? gatewaySelf.host : null,
        gatewaySelf.ip ? `(${gatewaySelf.ip})` : null,
        gatewaySelf.version ? `app ${gatewaySelf.version}` : null,
        gatewaySelf.platform ? gatewaySelf.platform : null,
      ]
        .filter(Boolean)
        .join(" ")
    : null;
}
/** Builds gateway target, reachability, auth, and mode strings for text status output. */
function buildGatewayStatusSummaryParts(params) {
  const targetText = params.remoteUrlMissing
    ? `fallback ${params.gatewayConnection.url}`
    : params.gatewayConnection.url;
  return {
    targetText,
    targetTextWithSource: params.gatewayConnection.urlSource
      ? `${targetText} (${params.gatewayConnection.urlSource})`
      : targetText,
    reachText: params.remoteUrlMissing
      ? "misconfigured (remote.url missing)"
      : params.gatewayReachable
        ? `reachable ${formatDurationPrecise(params.gatewayProbe?.connectLatencyMs ?? 0)}`
        : params.gatewayProbe?.error
          ? `unreachable (${params.gatewayProbe.error})`
          : "unreachable",
    authText: params.gatewayReachable
      ? `auth ${formatGatewayAuthUsed(params.gatewayProbeAuth)}`
      : "",
    modeLabel: `${params.gatewayMode}${params.remoteUrlMissing ? " (remote.url missing)" : ""}`,
  };
}
/** Builds gateway/dashboard/service values for overview rows. */
function buildStatusGatewaySurfaceValues(params) {
  const decorateOk = params.decorateOk ?? ((value) => value);
  const decorateWarn = params.decorateWarn ?? ((value) => value);
  const gatewaySummary = buildGatewayStatusSummaryParts({
    gatewayMode: params.gatewayMode,
    remoteUrlMissing: params.remoteUrlMissing,
    gatewayConnection: params.gatewayConnection,
    gatewayReachable: params.gatewayReachable,
    gatewayProbe: params.gatewayProbe,
    gatewayProbeAuth: params.gatewayProbeAuth,
  });
  const gatewaySelfValue = formatGatewaySelfSummary(params.gatewaySelf);
  const gatewayValue =
    params.nodeOnlyGateway?.gatewayValue ??
    `${gatewaySummary.modeLabel} · ${gatewaySummary.targetTextWithSource} · ${params.remoteUrlMissing ? decorateWarn(gatewaySummary.reachText) : params.gatewayReachable ? decorateOk(gatewaySummary.reachText) : decorateWarn(gatewaySummary.reachText)}${params.gatewayReachable && !params.remoteUrlMissing && gatewaySummary.authText && gatewaySummary.authText.length > 0 ? ` · ${gatewaySummary.authText}` : ""}${gatewaySelfValue ? ` · ${gatewaySelfValue}` : ""}`;
  return {
    dashboardUrl:
      params.advertisedControlUiLinks?.httpUrl ?? resolveStatusDashboardUrl({ cfg: params.cfg }),
    gatewayValue,
    gatewaySelfValue,
    gatewayServiceValue: formatStatusServiceValue({
      label: params.gatewayService.label,
      installed: params.gatewayService.installed !== false,
      managedByOpenClaw: params.gatewayService.managedByOpenClaw,
      loadedText: params.gatewayService.loadedText,
      runtimeShort: params.gatewayService.runtimeShort,
      runtimeStatus: params.gatewayService.runtime?.status,
      runtimePid: params.gatewayService.runtime?.pid,
    }),
    nodeServiceValue: formatStatusServiceValue({
      label: params.nodeService.label,
      installed: params.nodeService.installed !== false,
      managedByOpenClaw: params.nodeService.managedByOpenClaw,
      loadedText: params.nodeService.loadedText,
      runtimeShort: params.nodeService.runtimeShort,
      runtimeStatus: params.nodeService.runtime?.status,
      runtimePid: params.nodeService.runtime?.pid,
    }),
  };
}
/** Builds the stable gateway object used by `openclaw status --json`. */
function buildGatewayStatusJsonPayload(params) {
  return {
    mode: params.gatewayMode,
    url: params.gatewayConnection.url,
    urlSource: params.gatewayConnection.urlSource,
    misconfigured: params.remoteUrlMissing,
    reachable: params.gatewayReachable,
    connectLatencyMs: params.gatewayProbe?.connectLatencyMs ?? null,
    self: params.gatewaySelf ?? null,
    error: params.gatewayProbe?.error ?? null,
    authWarning: params.gatewayProbeAuthWarning ?? null,
    ...(params.gatewayProbe?.health &&
    typeof params.gatewayProbe.health === "object" &&
    "modelPricing" in params.gatewayProbe.health
      ? { modelPricing: params.gatewayProbe.health.modelPricing }
      : {}),
  };
}
/** Redacts common credential shapes before text is printed in status diagnostics. */
function redactSecrets(text) {
  if (!text) return text;
  let out = text;
  out = out.replace(
    /(\b(?:access[_-]?token|refresh[_-]?token|token|password|secret|api[_-]?key)\b\s*[:=]\s*)("?)([^"\\s]+)("?)/gi,
    "$1$2***$4",
  );
  out = out.replace(/\bBearer\s+[A-Za-z0-9._-]+\b/g, "Bearer ***");
  out = out.replace(/\bsk-[A-Za-z0-9]{10,}\b/g, "sk-***");
  return out;
}
//#endregion
export {
  buildStatusOverviewSurfaceRows as a,
  formatGatewaySelfSummary as c,
  formatStatusTailscaleValue as d,
  redactSecrets as f,
  buildStatusOverviewRows as i,
  formatStatusDashboardValue as l,
  resolveStatusUpdateChannelInfo as m,
  buildGatewayStatusSummaryParts as n,
  buildStatusUpdateSurface as o,
  resolveStatusDashboardUrl as p,
  buildStatusGatewaySurfaceValues as r,
  formatGatewayAuthUsed as s,
  buildGatewayStatusJsonPayload as t,
  formatStatusServiceValue as u,
};
