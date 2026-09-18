import { Command } from "commander";
import {
  a as GatewayClientOptions,
  i as EventLoopReadyResult,
  n as GatewayClientStartReadinessOptions,
  r as GatewayClientStartable,
  t as GatewayClient,
} from "./client-CFSDLgzq.js";
import { n as GatewayClientName, t as GatewayClientMode } from "./client-info-Dd-clGC_.js";
import { t as DeviceIdentity } from "./device-identity-CcgLHrOC.js";
import { t as OperatorScope } from "./operator-scopes-Phea7r7e.js";
import { l as NodeSession, o as RespondFn } from "./types-Dz3ohwUV.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";

//#region src/gateway/channel-status-patches.d.ts
/** Patch emitted when a channel connection is established. */
type ConnectedChannelStatusPatch = {
  connected: true;
  lastConnectedAt: number;
  lastEventAt: number;
};
/** Patch emitted when a channel transport reports activity without reconnecting. */
type TransportActivityChannelStatusPatch = {
  lastTransportActivityAt: number;
};
/** Creates a connected-channel status patch with matching connection/event timestamps. */
declare function createConnectedChannelStatusPatch(at?: number): ConnectedChannelStatusPatch;
/** Creates a transport-activity patch for health/activity monitors. */
declare function createTransportActivityStatusPatch(
  at?: number,
): TransportActivityChannelStatusPatch;
//#endregion
//#region src/cli/gateway-rpc.types.d.ts
/** Common gateway RPC flags accepted by direct gateway command helpers. */
type GatewayRpcOpts = {
  url?: string;
  token?: string;
  timeout?: string;
  expectFinal?: boolean;
  json?: boolean;
};
//#endregion
//#region src/cli/gateway-rpc.d.ts
declare function addGatewayClientOptions(
  cmd: Command,
  defaults?: {
    timeoutMs?: number;
  },
): Command;
declare function callGatewayFromCli(
  method: string,
  opts: GatewayRpcOpts,
  params?: unknown,
  extra?: {
    clientName?: GatewayClientName;
    mode?: GatewayClientMode;
    deviceIdentity?: DeviceIdentity | null;
    signal?: AbortSignal;
    expectFinal?: boolean;
    progress?: boolean;
    scopes?: OperatorScope[];
  },
): Promise<Record<string, unknown>>;
//#endregion
//#region src/gateway/hosted-plugin-surface-url.d.ts
type HostSource = string | null | undefined;
/** Inputs used to infer the externally reachable plugin surface URL. */
type HostedPluginSurfaceUrlParams = {
  port?: number;
  hostOverride?: HostSource;
  forwardedHost?: HostSource | HostSource[];
  requestHost?: HostSource;
  forwardedProto?: HostSource | HostSource[];
  localAddress?: HostSource;
  scheme?: "http" | "https";
};
/** Resolve the URL that plugins should advertise for hosted node surfaces. */
declare function resolveHostedPluginSurfaceUrl(
  params: HostedPluginSurfaceUrlParams,
): string | undefined;
//#endregion
//#region src/gateway/node-command-policy.d.ts
type NodeCommandPolicyNode = Pick<NodeSession, "platform" | "deviceFamily"> &
  Partial<Pick<NodeSession, "caps" | "commands" | "connId" | "nodeId">> & {
    approvedCommands?: readonly string[];
  };
declare function resolveNodeCommandAllowlist(
  cfg: OpenClawConfig,
  node?: NodeCommandPolicyNode,
): Set<string>;
declare function isNodeCommandAllowed(params: {
  command: string;
  declaredCommands?: string[];
  allowlist: Set<string>;
}):
  | {
      ok: true;
    }
  | {
      ok: false;
      reason: string;
    };
//#endregion
//#region src/shared/node-match.d.ts
/**
 * Shared node-selection policy for CLI, gateway-facing SDK helpers, and plugins.
 *
 * Exact ids, remote IPs, normalized display names, and long id prefixes are the
 * only accepted query shapes; fuzzy ordering lives here so callers agree.
 */
/** Node fields accepted by shared CLI/API node selection helpers. */
type NodeMatchCandidate = {
  /** Stable node id used for RPC/session routing. */ nodeId: string /** Human-facing node name used for fuzzy operator input. */;
  displayName?: string /** Tailscale or network address accepted as an exact match. */;
  remoteIp?: string /** Connected nodes win only after the strongest match type is chosen. */;
  connected?: boolean /** Client id used to prefer current OpenClaw nodes over legacy migration ties. */;
  clientId?: string;
};
//#endregion
//#region src/shared/node-resolve.d.ts
type ResolveNodeFromListOptions<TNode extends NodeMatchCandidate> = {
  allowDefault?: boolean;
  allowCompactDisplayName?: boolean;
  pickDefaultNode?: (nodes: TNode[]) => TNode | null;
};
/** Resolves a user query to a node id, optionally using a caller-defined blank-query default. */
declare function resolveNodeIdFromNodeList<TNode extends NodeMatchCandidate>(
  nodes: TNode[],
  query?: string,
  options?: ResolveNodeFromListOptions<TNode>,
): string;
/** Resolves a full node entry, preserving synthetic defaults returned by the picker. */
declare function resolveNodeFromNodeList<TNode extends NodeMatchCandidate>(
  nodes: TNode[],
  query?: string,
  options?: ResolveNodeFromListOptions<TNode>,
): TNode;
//#endregion
//#region src/gateway/server-json.d.ts
/** Safely parses an optional JSON string, returning a payloadJSON wrapper on parse failure. */
declare function safeParseJson(value: string | null | undefined): unknown;
//#endregion
//#region src/gateway/server-methods/nodes.helpers.d.ts
/** Narrows successful node invoke results or responds with the node error details. */
declare function respondUnavailableOnNodeInvokeError<
  T extends {
    ok: boolean;
    error?: unknown;
  },
>(
  respond: RespondFn,
  res: T,
): res is T & {
  ok: true;
};
//#endregion
//#region src/gateway/client-start-readiness.d.ts
/** Starts a gateway client once the shared event-loop readiness check passes. */
declare function startGatewayClientWhenEventLoopReady(
  client: GatewayClientStartable,
  options?: GatewayClientStartReadinessOptions,
): Promise<EventLoopReadyResult>;
//#endregion
//#region src/gateway/operator-approvals-client.d.ts
/** Create a Gateway client authorized for operator approval event handling. */
declare function createOperatorApprovalsGatewayClient(
  params: Pick<
    GatewayClientOptions,
    | "clientDisplayName"
    | "onClose"
    | "onConnectError"
    | "onEvent"
    | "onHelloOk"
    | "onReconnectPaused"
  > & {
    config: OpenClawConfig;
    gatewayUrl?: string;
  },
): Promise<GatewayClient>;
/** Run a callback with a started operator-approvals Gateway client and close it after. */
declare function withOperatorApprovalsGatewayClient<T>(
  params: {
    config: OpenClawConfig;
    gatewayUrl?: string;
    clientDisplayName: string;
  },
  run: (client: GatewayClient) => Promise<T>,
): Promise<T>;
//#endregion
//#region src/plugin-sdk/gateway-runtime.d.ts
declare function resolveAdvertisedLanHost(): Promise<string | null>;
//#endregion
export {
  ConnectedChannelStatusPatch as _,
  respondUnavailableOnNodeInvokeError as a,
  createTransportActivityStatusPatch as b,
  resolveNodeIdFromNodeList as c,
  resolveNodeCommandAllowlist as d,
  HostedPluginSurfaceUrlParams as f,
  GatewayRpcOpts as g,
  callGatewayFromCli as h,
  startGatewayClientWhenEventLoopReady as i,
  NodeMatchCandidate as l,
  addGatewayClientOptions as m,
  createOperatorApprovalsGatewayClient as n,
  safeParseJson as o,
  resolveHostedPluginSurfaceUrl as p,
  withOperatorApprovalsGatewayClient as r,
  resolveNodeFromNodeList as s,
  resolveAdvertisedLanHost as t,
  isNodeCommandAllowed as u,
  TransportActivityChannelStatusPatch as v,
  createConnectedChannelStatusPatch as y,
};
