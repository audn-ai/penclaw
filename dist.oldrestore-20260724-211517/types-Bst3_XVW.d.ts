//#region packages/acp-core/src/types.d.ts
declare const ACP_PROVENANCE_MODE_VALUES: readonly ["off", "meta", "meta+receipt"];
type SessionId = string;
type AcpProvenanceMode = (typeof ACP_PROVENANCE_MODE_VALUES)[number];
declare function normalizeAcpProvenanceMode(
  value: string | undefined,
): AcpProvenanceMode | undefined;
type AcpSession = {
  sessionId: SessionId;
  sessionKey: string;
  ledgerSessionId?: string;
  cwd: string;
  createdAt: number;
  lastTouchedAt: number;
  abortController: AbortController | null;
  activeRunId: string | null;
};
type AcpServerOptions = {
  gatewayUrl?: string;
  gatewayToken?: string;
  gatewayPassword?: string;
  defaultSessionKey?: string;
  defaultSessionLabel?: string;
  requireExistingSession?: boolean;
  resetSession?: boolean;
  prefixCwd?: boolean;
  provenanceMode?: AcpProvenanceMode;
  sessionCreateRateLimit?: {
    maxRequests?: number;
    windowMs?: number;
  };
  verbose?: boolean;
};
type SessionAcpIdentitySource = "ensure" | "status" | "event";
type SessionAcpIdentityState = "pending" | "resolved";
type SessionAcpIdentity = {
  /** Pending identities may expose provisional ids; resolved identities are safe for resume output. */ state: SessionAcpIdentityState;
  acpxRecordId?: string;
  acpxSessionId?: string;
  agentSessionId?: string /** Runtime lifecycle point that last supplied the identity fields. */;
  source: SessionAcpIdentitySource;
  lastUpdatedAt: number;
};
type AcpSessionRuntimeOptions = {
  /**
   * ACP runtime mode set via session/set_mode (for example: "plan", "normal", "auto").
   */
  runtimeMode?: string /** ACP runtime config option: model id. */;
  model?: string /** ACP runtime config option: thinking/reasoning effort. */;
  thinking?: string /** Working directory override for ACP session turns. */;
  cwd?: string /** ACP runtime config option: permission profile id. */;
  permissionProfile?: string /** ACP runtime config option: per-turn timeout in seconds. */;
  timeoutSeconds?: number /** Backend-specific option bag mapped through session/set_config_option. */;
  backendExtras?: Record<string, string>;
};
type SessionAcpMeta = {
  backend: string;
  agent: string;
  runtimeSessionName: string /** Canonical backend/agent ids used for resume hints and thread/status details. */;
  identity?: SessionAcpIdentity;
  mode: "persistent" | "oneshot";
  runtimeOptions?: AcpSessionRuntimeOptions;
  cwd?: string;
  state: "idle" | "running" | "error";
  lastActivityAt: number;
  lastError?: string;
};
//#endregion
export {
  SessionAcpIdentity as a,
  SessionAcpMeta as c,
  AcpSessionRuntimeOptions as i,
  SessionId as l,
  AcpServerOptions as n,
  SessionAcpIdentitySource as o,
  AcpSession as r,
  SessionAcpIdentityState as s,
  AcpProvenanceMode as t,
  normalizeAcpProvenanceMode as u,
};
