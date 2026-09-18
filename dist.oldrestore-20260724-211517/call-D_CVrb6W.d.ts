import { o as GatewayClientRequestOptions } from "./client-CFSDLgzq.js";
import { n as GatewayClientName, t as GatewayClientMode } from "./client-info-Dd-clGC_.js";
import { t as DeviceIdentity } from "./device-identity-CcgLHrOC.js";
import { t as OperatorScope } from "./operator-scopes-Phea7r7e.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";

//#region src/gateway/call.d.ts
type GatewayRequestFunction = <T = Record<string, unknown>>(
  method: string,
  params?: unknown,
  opts?: GatewayClientRequestOptions,
) => Promise<T>;
type CallGatewayBaseOptions = {
  url?: string;
  token?: string;
  password?: string;
  tlsFingerprint?: string;
  config?: OpenClawConfig;
  method: string;
  params?: unknown;
  expectFinal?: boolean;
  timeoutMs?: number | null;
  signal?: AbortSignal;
  onAccepted?: GatewayClientRequestOptions["onAccepted"];
  onSignalAbort?: (request: GatewayRequestFunction) => Promise<void> | void;
  clientName?: GatewayClientName;
  clientDisplayName?: string;
  clientVersion?: string;
  platform?: string;
  mode?: GatewayClientMode;
  approvalRuntimeToken?: string;
  agentRuntimeIdentityToken?: string;
  useStoredDeviceAuth?: boolean;
  requiredStoredDeviceAuthScopes?: OperatorScope[];
  requireLocalBackendSharedAuth?: boolean;
  deviceIdentity?: DeviceIdentity | null;
  instanceId?: string;
  minProtocol?: number;
  maxProtocol?: number;
  requiredMethods?: string[];
  /**
   * Overrides the config path shown in connection error details.
   * Does not affect config loading; callers still control auth via opts.token/password/env/config.
   */
  configPath?: string;
  /**
   * Explicit local gateway port for command-line overrides such as `gateway health --port`.
   * Bypasses OPENCLAW_GATEWAY_URL and OPENCLAW_GATEWAY_PORT for this call only.
   */
  localPortOverride?: number /** Keep a caller-supplied config target authoritative over OPENCLAW_GATEWAY_URL. */;
  ignoreEnvUrlOverride?: boolean;
};
type CallGatewayOptions = CallGatewayBaseOptions & {
  scopes?: OperatorScope[];
};
declare function callGateway<T = Record<string, unknown>>(opts: CallGatewayOptions): Promise<T>;
//#endregion
export { callGateway as t };
