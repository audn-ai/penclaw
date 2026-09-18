import { createAmbientNodeProxyAgent, hasAmbientNodeProxyConfigured } from "@openclaw/proxyline";
import "./src-Bl7G9qvi.js";
import { i as runPassiveAccountLifecycle } from "./channel-lifecycle.core-BZ1pethE.js";
import "./fetch-timeout-CAJNUHY1.js";
import { t as createDeferred$1 } from "./deferred-DJrEoFQk.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { r as resolveActiveManagedProxyTlsOptions } from "./managed-proxy-undici-BZ0Vz-Ui.js";
import { c as resolveDefaultSecretProviderAlias } from "./ref-contract-DVV0zYUk.js";
import { t as createLoggerBackedRuntime } from "./runtime-logger-CdfMCDWX.js";
//#region src/plugin-sdk/extension-shared.ts
/**
 * Builds the standard passive-channel status object used by plugin status surfaces.
 * Missing lifecycle fields are normalized to stable defaults so callers can merge
 * plugin-specific extras without leaking `undefined` into status responses.
 */
function buildPassiveChannelStatusSummary(snapshot, extra) {
  return {
    configured: snapshot.configured ?? false,
    ...(extra ?? {}),
    running: snapshot.running ?? false,
    lastStartAt: snapshot.lastStartAt ?? null,
    lastStopAt: snapshot.lastStopAt ?? null,
    lastError: snapshot.lastError ?? null,
  };
}
/** Adds probe state to the standard passive-channel status summary. */
function buildPassiveProbedChannelStatusSummary(snapshot, extra) {
  return {
    ...buildPassiveChannelStatusSummary(snapshot, extra),
    probe: snapshot.probe,
    lastProbeAt: snapshot.lastProbeAt ?? null,
  };
}
/** Normalizes optional traffic timestamps for channel status payloads. */
function buildTrafficStatusSummary(snapshot) {
  return {
    lastInboundAt: snapshot?.lastInboundAt ?? null,
    lastOutboundAt: snapshot?.lastOutboundAt ?? null,
  };
}
/**
 * Runs a passive monitor until the supplied abort signal fires, then calls `stop()`.
 * This adapts simple plugin monitors to the shared passive account lifecycle.
 */
async function runStoppablePassiveMonitor(params) {
  await runPassiveAccountLifecycle({
    abortSignal: params.abortSignal,
    start: params.start,
    stop: async (monitor) => {
      monitor.stop();
    },
  });
}
/**
 * Returns the provided runtime or creates a logger-backed fallback for monitor-only paths.
 * The fallback cannot exit the process, so command/runtime callers should inject a real runtime.
 */
function resolveLoggerBackedRuntime(runtime, logger) {
  return (
    runtime ??
    createLoggerBackedRuntime({
      logger,
      exitError: () => /* @__PURE__ */ new Error("Runtime exit not available"),
    })
  );
}
/** Applies the shared validation rule for open DM policies that require wildcard allowlists. */
function requireChannelOpenAllowFrom(params) {
  params.requireOpenAllowFrom({
    policy: params.policy,
    allowFrom: params.allowFrom,
    ctx: params.ctx,
    path: ["allowFrom"],
    message: `channels.${params.channel}.dmPolicy="open" requires channels.${params.channel}.allowFrom to include "*"`,
  });
}
/** Extracts a fixed set of fields from unknown status issue payloads without trusting shape. */
function readStatusIssueFields(value, fields) {
  if (!value || typeof value !== "object") return null;
  const record = value;
  const result = {};
  for (const field of fields) result[field] = record[field];
  return result;
}
/** Converts string or numeric account identifiers from status issue payloads to strings. */
function coerceStatusIssueAccountId(value) {
  return typeof value === "string" ? value : typeof value === "number" ? String(value) : void 0;
}
/** Creates a promise with externally controlled resolve/reject hooks for async handoff code. */
function createDeferred() {
  return createDeferred$1();
}
const DEFAULT_PACKAGE_JSON_VERSION_CANDIDATES = [
  "../package.json",
  "./package.json",
  "../../package.json",
];
/** Formats Zod plugin-config issues into stable user-facing status messages. */
function formatPluginConfigIssue(issue, options) {
  if (!issue) return options?.invalidConfigMessage ?? "invalid config";
  if (issue.code === "unrecognized_keys" && issue.keys.length > 0)
    return (
      options?.unknownKeyMessage?.(expectDefined(issue.keys[0], "keys entry at 0")) ??
      `unknown config key: ${issue.keys[0]}`
    );
  if (issue.code === "invalid_type" && issue.path.length === 0)
    return options?.rootInvalidTypeMessage ?? "expected config object";
  return issue.message;
}
/** Keeps only string/number path segments so config issue paths stay JSON-safe. */
function normalizePluginConfigIssuePath(path) {
  return path.filter((segment) => {
    const kind = typeof segment;
    return kind === "string" || kind === "number";
  });
}
/** Converts raw Zod issues into the plugin status issue shape used by bundled channels. */
function mapPluginConfigIssues(issues, options) {
  return issues.map((issue) => ({
    path: normalizePluginConfigIssuePath(issue.path),
    message: formatPluginConfigIssue(issue, options),
  }));
}
/** Checks whether a read-only plugin path may resolve a secret through an env provider. */
function canResolveEnvSecretRefInReadOnlyPath(params) {
  const providerConfig = params.cfg?.secrets?.providers?.[params.provider];
  if (!providerConfig)
    return params.provider === resolveDefaultSecretProviderAlias(params.cfg ?? {}, "env");
  if (providerConfig.source !== "env") return false;
  const allowlist = providerConfig.allowlist;
  return !allowlist || allowlist.includes(params.id);
}
/** Reads plugin package versions across source, bundled, and test layouts with a fallback. */
function readPluginPackageVersion(params) {
  for (const candidate of params.candidates ?? DEFAULT_PACKAGE_JSON_VERSION_CANDIDATES)
    try {
      const version = params.require(candidate).version;
      if (typeof version === "string" && version.trim().length > 0) return version;
    } catch {}
  return params.fallback ?? "unknown";
}
/**
 * Builds an ambient Node proxy agent when proxy env/config is active.
 * Managed proxy CA trust is attached when available; creation errors are reported
 * through `onError` and otherwise degrade to no agent.
 */
async function resolveAmbientNodeProxyAgent(params) {
  const protocol = params?.protocol ?? "https";
  if (!hasAmbientNodeProxyConfigured({ protocol })) return;
  try {
    const proxyTls = resolveActiveManagedProxyTlsOptions();
    const agent = createAmbientNodeProxyAgent({
      protocol,
      ...(proxyTls ? { proxyTls } : {}),
    });
    if (agent === void 0) return;
    params?.onUsingProxy?.();
    return agent;
  } catch (error) {
    params?.onError?.(error);
    return;
  }
}
//#endregion
export {
  coerceStatusIssueAccountId as a,
  mapPluginConfigIssues as c,
  readStatusIssueFields as d,
  requireChannelOpenAllowFrom as f,
  runStoppablePassiveMonitor as h,
  canResolveEnvSecretRefInReadOnlyPath as i,
  normalizePluginConfigIssuePath as l,
  resolveLoggerBackedRuntime as m,
  buildPassiveProbedChannelStatusSummary as n,
  createDeferred as o,
  resolveAmbientNodeProxyAgent as p,
  buildTrafficStatusSummary as r,
  formatPluginConfigIssue as s,
  buildPassiveChannelStatusSummary as t,
  readPluginPackageVersion as u,
};
