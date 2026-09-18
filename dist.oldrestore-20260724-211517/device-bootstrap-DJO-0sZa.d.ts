//#region src/shared/device-bootstrap-profile.d.ts
/** Closed purpose codes carried by specialized bootstrap tokens. */
type DeviceBootstrapPurpose = "control-ui" | "mobile-full";
/** Normalized roles/scopes carried by a bootstrap token during device handoff. */
type DeviceBootstrapProfile = {
  roles: string[];
  scopes: string[];
  purpose?: DeviceBootstrapPurpose;
};
/** Caller-provided bootstrap profile before role/scope normalization and bounding. */
type DeviceBootstrapProfileInput = {
  roles?: readonly string[];
  scopes?: readonly string[];
  purpose?: DeviceBootstrapPurpose;
};
/** Operator scopes allowed to cross the short-lived bootstrap handoff boundary. */
declare const BOOTSTRAP_HANDOFF_OPERATOR_SCOPES: readonly [
  "operator.approvals",
  "operator.read",
  "operator.talk.secrets",
  "operator.write",
];
/** Existing least-privilege setup-code/QR profile. */
declare const PAIRING_SETUP_BOOTSTRAP_PROFILE: DeviceBootstrapProfile;
/** Normalize caller-provided bootstrap roles/scopes without applying handoff bounds. */
declare function normalizeDeviceBootstrapProfile(
  input: DeviceBootstrapProfileInput | undefined,
): DeviceBootstrapProfile;
//#endregion
//#region src/infra/device-pairing.types.d.ts
/** Pending device pairing request awaiting owner approval. */
type DevicePairingPendingRequest = {
  requestId: string;
  deviceId: string;
  publicKey: string;
  displayName?: string;
  platform?: string;
  deviceFamily?: string;
  clientId?: string;
  clientMode?: string;
  role?: string;
  roles?: string[];
  scopes?: string[];
  remoteIp?: string;
  silent?: boolean;
  isRepair?: boolean;
  ts: number;
};
/** Bearer token issued to one paired device role. */
type DeviceAuthToken = {
  token: string;
  role: string;
  scopes: string[];
  issuer?: {
    kind: "shared-gateway-auth";
    generation: string;
  };
  createdAtMs: number;
  rotatedAtMs?: number;
  revokedAtMs?: number;
  lastUsedAtMs?: number;
};
/**
 * How the latest pairing approval was granted. "silent" is a same-host local
 * policy approval and the only prune-eligible kind: local clients re-pair
 * silently and cannot collide with another machine's records. "trusted-cidr"
 * and "ssh-verified" are also non-interactive but cross hosts, so they are
 * never pruned automatically (display metadata is not a machine identity).
 * "owner" and "bootstrap" approvals required a user action and are never
 * pruned.
 */
type PairedDeviceApprovalKind = "owner" | "silent" | "trusted-cidr" | "ssh-verified" | "bootstrap";
/**
 * Approved node capability surface for a node-role device. Device pairing
 * grants connection auth; this grants command/capability exposure (node
 * command gating). displayName here is the operator-facing node name set at
 * approval or via node.rename; it must not be clobbered by reconnect
 * metadata refreshes, which is why it lives apart from the device fields.
 */
type PairedDeviceNodeSurface = {
  displayName?: string;
  version?: string;
  coreVersion?: string;
  uiVersion?: string;
  modelIdentifier?: string;
  caps?: string[];
  commands?: string[];
  permissions?: Record<string, boolean>;
  bins?: string[];
  createdAtMs: number;
  approvedAtMs: number;
  lastConnectedAtMs?: number;
};
/**
 * Pending node-surface approval awaiting an operator decision (one per
 * device). Carries its own metadata snapshot so approval UIs can show what
 * the node declared at request time. `revision` guards the reconnect-vs-
 * approve race: reconnect cleanup only deletes the revision it observed, so
 * a refreshed request survives concurrent approval flows.
 */
type PairedDevicePendingNodeSurface = {
  requestId: string;
  revision: string;
  displayName?: string;
  platform?: string;
  version?: string;
  coreVersion?: string;
  uiVersion?: string;
  clientId?: string;
  clientMode?: string;
  deviceFamily?: string;
  modelIdentifier?: string;
  caps?: string[];
  commands?: string[];
  permissions?: Record<string, boolean>;
  remoteIp?: string;
  silent?: boolean;
  ts: number;
};
/** Persisted approved device record, including durable approval and active role tokens. */
type PairedDevice = {
  deviceId: string;
  publicKey: string;
  displayName?: string;
  operatorLabel?: string;
  platform?: string;
  deviceFamily?: string;
  clientId?: string;
  clientMode?: string;
  role?: string;
  roles?: string[];
  scopes?: string[];
  approvedScopes?: string[];
  remoteIp?: string;
  tokens?: Record<string, DeviceAuthToken>;
  approvedVia?: PairedDeviceApprovalKind;
  nodeSurface?: PairedDeviceNodeSurface;
  pendingNodeSurface?: PairedDevicePendingNodeSurface;
  createdAtMs: number;
  approvedAtMs: number;
  lastSeenAtMs?: number;
  lastSeenReason?: string;
};
/** Persisted bootstrap token state, including binding and role/scope redemption progress. */
type DeviceBootstrapTokenRecord = {
  token: string;
  ts: number;
  deviceId?: string;
  publicKey?: string;
  profile?: DeviceBootstrapProfile;
  redeemedProfile?: DeviceBootstrapProfile;
  pendingProfile?: DeviceBootstrapProfile;
  issuedAtMs: number;
  lastUsedAtMs?: number;
};
//#endregion
//#region src/infra/device-pairing.d.ts
/** Paired-device access metadata refreshed when an existing device reconnects. */
type DevicePairingAccessMetadata = Pick<
  PairedDevice,
  "displayName" | "remoteIp" | "lastSeenAtMs" | "lastSeenReason"
>;
/** Combined pending/paired view returned by pairing list APIs. */
type DevicePairingList = {
  pending: DevicePairingPendingRequest[];
  paired: PairedDevice[];
};
/** Authorization failure categories for owner approval and bootstrap approval flows. */
type DevicePairingForbiddenReason =
  | "caller-scopes-required"
  | "caller-missing-scope"
  | "scope-outside-requested-roles"
  | "bootstrap-role-not-allowed"
  | "bootstrap-scope-not-allowed";
/** Structured forbidden result with the missing/disallowed role or scope when known. */
type DevicePairingForbiddenResult = {
  status: "forbidden";
  reason: DevicePairingForbiddenReason;
  scope?: string;
  role?: string;
};
/** Pairing approval outcome: approved, forbidden with reason, or request not found. */
type ApproveDevicePairingResult =
  | {
      status: "approved";
      requestId: string;
      device: PairedDevice;
    }
  | DevicePairingForbiddenResult
  | null;
/** Format a device-pairing authorization failure for CLI/API callers. */
declare function listDevicePairing(baseDir?: string): Promise<DevicePairingList>;
/** Approve a pending request with optional caller-scope checks for operator grants. */
declare function approveDevicePairing(
  requestId: string,
  baseDir?: string,
): Promise<ApproveDevicePairingResult>;
declare function approveDevicePairing(
  requestId: string,
  options: {
    callerScopes?: readonly string[];
    accessMetadata?: DevicePairingAccessMetadata;
    approvedVia?: Extract<
      PairedDeviceApprovalKind,
      "owner" | "silent" | "trusted-cidr" | "ssh-verified"
    >;
  },
  baseDir?: string,
): Promise<ApproveDevicePairingResult>;
//#endregion
//#region src/infra/device-bootstrap.d.ts
/** Issue a short-lived bootstrap token with a bounded role/scope handoff profile. */
declare function issueDeviceBootstrapToken(params?: {
  baseDir?: string;
  profile?: DeviceBootstrapProfileInput;
  roles?: readonly string[];
  scopes?: readonly string[];
}): Promise<{
  token: string;
  expiresAtMs: number;
}>;
/** Remove every outstanding bootstrap token from the pairing state file. */
declare function clearDeviceBootstrapTokens(params?: { baseDir?: string }): Promise<{
  removed: number;
}>;
/** Revoke one bootstrap token and return its record for best-effort restore flows. */
declare function revokeDeviceBootstrapToken(params: { token: string; baseDir?: string }): Promise<{
  removed: boolean;
  record?: DeviceBootstrapTokenRecord;
}>;
//#endregion
export {
  listDevicePairing as a,
  DeviceBootstrapProfileInput as c,
  normalizeDeviceBootstrapProfile as d,
  approveDevicePairing as i,
  DeviceBootstrapPurpose as l,
  issueDeviceBootstrapToken as n,
  BOOTSTRAP_HANDOFF_OPERATOR_SCOPES as o,
  revokeDeviceBootstrapToken as r,
  DeviceBootstrapProfile as s,
  clearDeviceBootstrapTokens as t,
  PAIRING_SETUP_BOOTSTRAP_PROFILE as u,
};
