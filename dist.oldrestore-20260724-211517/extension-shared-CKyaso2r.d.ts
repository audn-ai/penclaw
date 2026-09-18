import { t as createLoggerBackedRuntime } from "./runtime-logger-DNnQ2PUM.js";
import { Fr as ZodIssue, mt as ZodType, zr as $RefinementCtx } from "./schemas-CkRCGSfd.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";

//#region src/shared/deferred.d.ts
type Deferred<T = void> = {
  promise: Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: unknown) => void;
};
//#endregion
//#region src/utils/zod-parse.d.ts
/**
 * Null-returning Zod parse helpers for plugin and runtime boundaries.
 *
 * Callers use these where invalid external payloads should be ignored or
 * recovered from without constructing and catching validation errors.
 */
/** Safely validates an unknown value with a Zod schema, returning null on validation failure. */
declare function safeParseWithSchema<T>(schema: ZodType<T>, value: unknown): T | null;
/** Parses JSON, then safely validates it with a Zod schema, returning null for parse or schema failures. */
declare function safeParseJsonWithSchema<T>(schema: ZodType<T>, raw: string): T | null;
//#endregion
//#region src/plugin-sdk/extension-shared.d.ts
type PassiveChannelStatusSnapshot = {
  configured?: boolean;
  running?: boolean;
  lastStartAt?: number | null;
  lastStopAt?: number | null;
  lastError?: string | null;
  probe?: unknown;
  lastProbeAt?: number | null;
};
type TrafficStatusSnapshot = {
  lastInboundAt?: number | null;
  lastOutboundAt?: number | null;
};
type StoppableMonitor = {
  stop: () => void;
};
type RequireOpenAllowFromFn = (params: {
  policy?: string;
  allowFrom?: Array<string | number>;
  ctx: $RefinementCtx;
  path: Array<string | number>;
  message: string;
}) => void;
/**
 * Builds the standard passive-channel status object used by plugin status surfaces.
 * Missing lifecycle fields are normalized to stable defaults so callers can merge
 * plugin-specific extras without leaking `undefined` into status responses.
 */
declare function buildPassiveChannelStatusSummary<TExtra extends object>(
  snapshot: PassiveChannelStatusSnapshot,
  extra?: TExtra,
): {
  configured: boolean;
} & TExtra & {
    running: boolean;
    lastStartAt: number | null;
    lastStopAt: number | null;
    lastError: string | null;
  };
/** Adds probe state to the standard passive-channel status summary. */
declare function buildPassiveProbedChannelStatusSummary<TExtra extends object>(
  snapshot: PassiveChannelStatusSnapshot,
  extra?: TExtra,
): {
  configured: boolean;
} & TExtra & {
    probe: unknown;
    lastProbeAt: number | null;
    running: boolean;
    lastStartAt: number | null;
    lastStopAt: number | null;
    lastError: string | null;
  };
/** Normalizes optional traffic timestamps for channel status payloads. */
declare function buildTrafficStatusSummary(snapshot?: TrafficStatusSnapshot | null): {
  lastInboundAt: number | null;
  lastOutboundAt: number | null;
};
/**
 * Runs a passive monitor until the supplied abort signal fires, then calls `stop()`.
 * This adapts simple plugin monitors to the shared passive account lifecycle.
 */
declare function runStoppablePassiveMonitor<TMonitor extends StoppableMonitor>(params: {
  abortSignal: AbortSignal;
  start: () => Promise<TMonitor>;
}): Promise<void>;
/**
 * Returns the provided runtime or creates a logger-backed fallback for monitor-only paths.
 * The fallback cannot exit the process, so command/runtime callers should inject a real runtime.
 */
declare function resolveLoggerBackedRuntime<TRuntime>(
  runtime: TRuntime | undefined,
  logger: Parameters<typeof createLoggerBackedRuntime>[0]["logger"],
): TRuntime;
/** Applies the shared validation rule for open DM policies that require wildcard allowlists. */
declare function requireChannelOpenAllowFrom(params: {
  channel: string;
  policy?: string;
  allowFrom?: Array<string | number>;
  ctx: $RefinementCtx;
  requireOpenAllowFrom: RequireOpenAllowFromFn;
}): void;
/** Extracts a fixed set of fields from unknown status issue payloads without trusting shape. */
declare function readStatusIssueFields<TField extends string>(
  value: unknown,
  fields: readonly TField[],
): Record<TField, unknown> | null;
/** Converts string or numeric account identifiers from status issue payloads to strings. */
declare function coerceStatusIssueAccountId(value: unknown): string | undefined;
/** Creates a promise with externally controlled resolve/reject hooks for async handoff code. */
declare function createDeferred<T>(): Deferred<T>;
type PackageJsonRequire = (id: string) => unknown;
type PluginConfigIssuePathSegment = string | number;
type PluginConfigIssue = {
  path: PluginConfigIssuePathSegment[];
  message: string;
};
type PluginConfigIssueMessageOptions = {
  invalidConfigMessage?: string;
  unknownKeyMessage?: (key: string) => string;
  rootInvalidTypeMessage?: string;
};
/** Formats Zod plugin-config issues into stable user-facing status messages. */
declare function formatPluginConfigIssue(
  issue: ZodIssue | undefined,
  options?: PluginConfigIssueMessageOptions,
): string;
/** Keeps only string/number path segments so config issue paths stay JSON-safe. */
declare function normalizePluginConfigIssuePath(
  path: readonly unknown[],
): PluginConfigIssuePathSegment[];
/** Converts raw Zod issues into the plugin status issue shape used by bundled channels. */
declare function mapPluginConfigIssues(
  issues: readonly ZodIssue[],
  options?: PluginConfigIssueMessageOptions,
): PluginConfigIssue[];
/** Checks whether a read-only plugin path may resolve a secret through an env provider. */
declare function canResolveEnvSecretRefInReadOnlyPath(params: {
  cfg?: OpenClawConfig;
  provider: string;
  id: string;
}): boolean;
/** Reads plugin package versions across source, bundled, and test layouts with a fallback. */
declare function readPluginPackageVersion(params: {
  require: PackageJsonRequire;
  candidates?: readonly string[];
  fallback?: string;
}): string;
/**
 * Builds an ambient Node proxy agent when proxy env/config is active.
 * Managed proxy CA trust is attached when available; creation errors are reported
 * through `onError` and otherwise degrade to no agent.
 */
declare function resolveAmbientNodeProxyAgent<TAgent>(params?: {
  onError?: (error: unknown) => void;
  onUsingProxy?: () => void;
  protocol?: "http" | "https";
}): Promise<TAgent | undefined>;
//#endregion
export {
  safeParseWithSchema as _,
  coerceStatusIssueAccountId as a,
  mapPluginConfigIssues as c,
  readStatusIssueFields as d,
  requireChannelOpenAllowFrom as f,
  safeParseJsonWithSchema as g,
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
