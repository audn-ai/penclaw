import { n as resolveGatewayProbeSurfaceAuth } from "./auth-surface-resolution-CMA3ybr3.js";
import { i as isLoopbackHost } from "./net-BpMGIYrw.js";
import "./parse-finite-number-Z7n6tXLk.js";
import { t as inspectBestEffortPrimaryTailnetIPv4 } from "./network-discovery-display-hQA33VdG.js";
import { v as parseStrictInteger } from "./number-coercion-CJQ8TR--.js";
import { n as parseTimeoutMsWithFallback } from "./parse-timeout-DZMZaF9B.js";
import { f as resolveGatewayPort } from "./paths-DEklnbzU.js";
import "./config-BDv-QbJ6.js";
import { c as normalizeOptionalString, p as readStringValue } from "./string-coerce-DW4mBlAt.js";
import { r as theme, t as colorize } from "./theme-vjDs9tao.js";
import { c as hasConfiguredSecretInput } from "./types.secrets-BV0ywRAy.js";
//#region src/commands/gateway-status/helpers.ts
/** Shared helpers for gateway status target selection, auth, summaries, and probe rendering. */
const MISSING_SCOPE_PATTERN = /\bmissing scope:\s*[a-z0-9._-]+/i;
function parseIntOrNull(value) {
  const s =
    typeof value === "string"
      ? value.trim()
      : typeof value === "number" || typeof value === "bigint"
        ? String(value)
        : "";
  if (!s) return null;
  return parseStrictInteger(s) ?? null;
}
/** Parses CLI timeout input with the gateway-status fallback rules. */
function parseTimeoutMs(raw, fallbackMs) {
  return parseTimeoutMsWithFallback(raw, fallbackMs);
}
function normalizeWsUrl(value) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (!trimmed.startsWith("ws://") && !trimmed.startsWith("wss://")) return null;
  return trimmed;
}
/** Builds the deduplicated ordered gateway probe targets from CLI input and config. */
function resolveTargets(cfg, explicitUrl, localPortOverride) {
  const targets = [];
  const add = (t) => {
    if (!targets.some((x) => x.url === t.url)) targets.push(t);
  };
  const explicit = typeof explicitUrl === "string" ? normalizeWsUrl(explicitUrl) : null;
  if (explicit)
    add({
      id: "explicit",
      kind: "explicit",
      url: explicit,
      active: true,
    });
  const port = localPortOverride ?? resolveGatewayPort(cfg);
  const localLoopbackTarget = {
    id: "localLoopback",
    kind: "localLoopback",
    url: `${cfg.gateway?.tls?.enabled === true ? "wss" : "ws"}://127.0.0.1:${port}`,
    active: localPortOverride !== void 0 || cfg.gateway?.mode !== "remote",
  };
  if (localPortOverride !== void 0 && !explicit) {
    add(localLoopbackTarget);
    return targets;
  }
  const remoteUrl =
    typeof cfg.gateway?.remote?.url === "string" ? normalizeWsUrl(cfg.gateway.remote.url) : null;
  if (remoteUrl)
    add({
      id: "configRemote",
      kind: "configRemote",
      url: remoteUrl,
      active: cfg.gateway?.mode === "remote",
    });
  add(localLoopbackTarget);
  return targets;
}
function isLoopbackProbeTarget(target) {
  if (target.kind === "localLoopback") return true;
  try {
    return isLoopbackHost(new URL(target.url).hostname);
  } catch {
    return false;
  }
}
function resolveProbeBudgetMs(overallMs, target) {
  if (target.kind === "sshTunnel") return Math.min(2e3, overallMs);
  if (target.active) return overallMs;
  if (target.kind === "localLoopback") return Math.min(800, overallMs);
  if (!isLoopbackProbeTarget(target)) return Math.min(1500, overallMs);
  return overallMs;
}
/** Normalizes user-entered SSH targets, accepting both raw targets and `ssh host` input. */
function sanitizeSshTarget(value) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.replace(/^ssh\s+/, "");
}
/** Resolves auth for the probe surface represented by the selected status target. */
async function resolveAuthForTarget(cfg, target, overrides) {
  const tokenOverride = normalizeOptionalString(overrides.token);
  const passwordOverride = normalizeOptionalString(overrides.password);
  if (tokenOverride || passwordOverride)
    return {
      token: tokenOverride,
      password: passwordOverride,
    };
  const resolved = await resolveGatewayProbeSurfaceAuth({
    config: cfg,
    surface: target.kind === "configRemote" || target.kind === "sshTunnel" ? "remote" : "local",
  });
  return {
    token: resolved.token,
    password: resolved.password,
    ...(resolved.diagnostics ? { diagnostics: resolved.diagnostics } : {}),
  };
}
/** Extracts the config fields displayed by `openclaw gateway status --deep`. */
function extractConfigSummary(snapshotUnknown) {
  const snap = snapshotUnknown;
  const path = typeof snap?.path === "string" ? snap.path : null;
  const exists = Boolean(snap?.exists);
  const valid = Boolean(snap?.valid);
  const issuesRaw = Array.isArray(snap?.issues) ? snap.issues : [];
  const legacyRaw = Array.isArray(snap?.legacyIssues) ? snap.legacyIssues : [];
  const cfg = snap?.config ?? {};
  const gateway = cfg.gateway ?? {};
  const secretDefaults = (cfg.secrets ?? {}).defaults ?? void 0;
  const wideArea = (cfg.discovery ?? {}).wideArea ?? {};
  const remote = gateway.remote ?? {};
  const auth = gateway.auth ?? {};
  const controlUi = gateway.controlUi ?? {};
  const tailscale = gateway.tailscale ?? {};
  const authMode = typeof auth.mode === "string" ? auth.mode : null;
  const authTokenConfigured = hasConfiguredSecretInput(auth.token, secretDefaults);
  const authPasswordConfigured = hasConfiguredSecretInput(auth.password, secretDefaults);
  const remoteUrl = typeof remote.url === "string" ? normalizeWsUrl(remote.url) : null;
  const remoteTokenConfigured = hasConfiguredSecretInput(remote.token, secretDefaults);
  const remotePasswordConfigured = hasConfiguredSecretInput(remote.password, secretDefaults);
  const wideAreaEnabled = typeof wideArea.enabled === "boolean" ? wideArea.enabled : null;
  return {
    path,
    exists,
    valid,
    issues: issuesRaw
      .filter((i) => i && typeof i.path === "string" && typeof i.message === "string")
      .map((i) => ({
        path: i.path,
        message: i.message,
      })),
    legacyIssues: legacyRaw
      .filter((i) => i && typeof i.path === "string" && typeof i.message === "string")
      .map((i) => ({
        path: i.path,
        message: i.message,
      })),
    gateway: {
      mode: typeof gateway.mode === "string" ? gateway.mode : null,
      bind: typeof gateway.bind === "string" ? gateway.bind : null,
      port: parseIntOrNull(gateway.port),
      controlUiEnabled: typeof controlUi.enabled === "boolean" ? controlUi.enabled : null,
      controlUiBasePath: typeof controlUi.basePath === "string" ? controlUi.basePath : null,
      authMode,
      authTokenConfigured,
      authPasswordConfigured,
      remoteUrl,
      remoteTokenConfigured,
      remotePasswordConfigured,
      tailscaleMode: typeof tailscale.mode === "string" ? tailscale.mode : null,
    },
    discovery: { wideAreaEnabled },
  };
}
/** Builds local and tailnet gateway URL hints for the selected gateway port. */
function buildNetworkHints(cfg, localPortOverride) {
  const { tailnetIPv4 } = inspectBestEffortPrimaryTailnetIPv4();
  const port = localPortOverride ?? resolveGatewayPort(cfg);
  const localScheme = cfg.gateway?.tls?.enabled === true ? "wss" : "ws";
  return {
    localLoopbackUrl: `${localScheme}://127.0.0.1:${port}`,
    localTailnetUrl: tailnetIPv4 ? `${localScheme}://${tailnetIPv4}:${port}` : null,
    tailnetIPv4: tailnetIPv4 ?? null,
  };
}
/** Renders the status heading for a single gateway probe target. */
function renderTargetHeader(target, rich) {
  const kindLabel =
    target.kind === "localLoopback"
      ? "Local loopback"
      : target.kind === "sshTunnel"
        ? "Remote over SSH"
        : target.kind === "configRemote"
          ? target.active
            ? "Remote (configured)"
            : "Remote (configured, inactive)"
          : "URL (explicit)";
  return `${colorize(rich, theme.heading, kindLabel)} ${colorize(rich, theme.muted, target.url)}`;
}
/** Returns true when auth succeeded enough to connect but lacks the read scope. */
function isScopeLimitedProbeFailure(probe) {
  if (probe.ok || probe.connectLatencyMs == null) return false;
  return MISSING_SCOPE_PATTERN.test(probe.error ?? "");
}
/** Returns true when the gateway connection was established but a later probe failed. */
function isPostConnectProbeFailure(probe) {
  return !probe.ok && probe.connectLatencyMs != null;
}
/** Returns true when the probe established any gateway connection. */
function isProbeReachable(probe) {
  return probe.ok || probe.connectLatencyMs != null;
}
function getGatewayProbeCapability(probe) {
  return probe.auth.capability;
}
function summarizeGatewayProbeCapability(probes) {
  for (const capability of [
    "admin_capable",
    "write_capable",
    "read_only",
    "connected_no_operator_scope",
    "pairing_pending",
    "unknown",
  ])
    if (probes.some((probe) => getGatewayProbeCapability(probe) === capability)) return capability;
  return "unknown";
}
function formatGatewayProbeCapabilityLabel(capability) {
  switch (capability) {
    case "admin_capable":
      return "Capability: admin-capable";
    case "write_capable":
      return "Capability: write-capable";
    case "read_only":
      return "Capability: read-only";
    case "connected_no_operator_scope":
      return "Capability: connect-only";
    case "pairing_pending":
      return "Capability: pairing pending";
    default:
      return "Capability: unknown";
  }
}
function colorForGatewayProbeCapability(capability) {
  switch (capability) {
    case "admin_capable":
    case "write_capable":
    case "read_only":
      return theme.info;
    case "connected_no_operator_scope":
    case "pairing_pending":
      return theme.warn;
    default:
      return theme.muted;
  }
}
function renderProbeCapabilityLine(probe, rich) {
  const capability = getGatewayProbeCapability(probe);
  return colorize(
    rich,
    colorForGatewayProbeCapability(capability),
    formatGatewayProbeCapabilityLabel(capability),
  );
}
function renderProbeSummaryLine(probe, rich) {
  const capability = renderProbeCapabilityLine(probe, rich);
  if (probe.ok) {
    const latency =
      typeof probe.connectLatencyMs === "number" ? `${probe.connectLatencyMs}ms` : "unknown";
    return `${colorize(rich, theme.success, "Connect: ok")} (${latency}) · ${capability} · ${colorize(rich, theme.success, "Read probe: ok")}`;
  }
  const detail = probe.error ? ` - ${probe.error}` : "";
  if (probe.connectLatencyMs != null) {
    const latency =
      typeof probe.connectLatencyMs === "number" ? `${probe.connectLatencyMs}ms` : "unknown";
    const readStatus = isScopeLimitedProbeFailure(probe)
      ? colorize(rich, theme.warn, "Read probe: limited")
      : colorize(rich, theme.error, "Read probe: failed");
    return `${colorize(rich, theme.success, "Connect: ok")} (${latency}) · ${capability} · ${readStatus}${detail}`;
  }
  if (getGatewayProbeCapability(probe) === "pairing_pending")
    return `${colorize(rich, theme.warn, "Connect: blocked")}${detail} · ${capability}`;
  return `${colorize(rich, theme.error, "Connect: failed")}${detail} · ${capability}`;
}
//#endregion
//#region src/commands/gateway-presence.ts
/** Extracts the gateway's self presence entry from status/presence payloads. */
function parseLegacyGatewaySelfText(text) {
  const match = text.match(/^Gateway:\s*([^ (·]+)(?:\s*\(([^)]+)\))?/i);
  if (!match) return {};
  return {
    host: readStringValue(match[1]),
    ip: readStringValue(match[2]),
  };
}
/** Picks host, ip, version, and platform from the gateway self presence record. */
function pickGatewaySelfPresence(presence) {
  if (!Array.isArray(presence)) return null;
  const entries = presence;
  const self =
    entries.find((e) => e.mode === "gateway" && e.reason === "self") ??
    entries.find((e) => typeof e.text === "string" && e.text.startsWith("Gateway:")) ??
    null;
  if (!self) return null;
  const legacy = typeof self.text === "string" ? parseLegacyGatewaySelfText(self.text) : {};
  const result = {
    host: readStringValue(self.host) ?? legacy.host,
    ip: readStringValue(self.ip) ?? legacy.ip,
    version: readStringValue(self.version),
    platform: readStringValue(self.platform),
  };
  const deviceId = readStringValue(self.deviceId);
  if (deviceId) result.deviceId = deviceId;
  const instanceId = readStringValue(self.instanceId);
  if (instanceId) result.instanceId = instanceId;
  return result;
}
//#endregion
export {
  isProbeReachable as a,
  renderProbeSummaryLine as c,
  resolveProbeBudgetMs as d,
  resolveTargets as f,
  isPostConnectProbeFailure as i,
  renderTargetHeader as l,
  summarizeGatewayProbeCapability as m,
  buildNetworkHints as n,
  isScopeLimitedProbeFailure as o,
  sanitizeSshTarget as p,
  extractConfigSummary as r,
  parseTimeoutMs as s,
  pickGatewaySelfPresence as t,
  resolveAuthForTarget as u,
};
