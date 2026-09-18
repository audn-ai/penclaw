import { randomUUID } from "node:crypto";
import { x as withPairedDeviceRecords } from "./device-pairing-BIH9-x3P.js";
import { t as resolveNodePairApprovalScopes } from "./node-pairing-authz-DF_md7_V.js";
import { t as resolveMissingRequestedScope } from "./operator-scope-compat-BVrjvlGm.js";
import { t as normalizeArrayBackedTrimmedStringList } from "./string-normalization-CRyoFBPt.js";
//#region src/infra/node-pairing-surface.ts
/** Normalize capability/command lists for node approval-surface comparison. */
function normalizeNodeApprovalSurfaceList(value) {
  return normalizeArrayBackedTrimmedStringList(value) ?? [];
}
/** Compare capability/command surfaces as normalized sets, ignoring order and duplicates. */
function sameNodeApprovalSurfaceSet(left, right) {
  const normalizedLeft = new Set(normalizeNodeApprovalSurfaceList(left));
  const normalizedRight = new Set(normalizeNodeApprovalSurfaceList(right));
  if (normalizedLeft.size !== normalizedRight.size) return false;
  for (const entry of normalizedLeft) if (!normalizedRight.has(entry)) return false;
  return true;
}
/** Compare node permission maps deterministically so key order cannot trigger repairs. */
function sameNodePermissionSurface(left, right) {
  const leftEntries = Object.entries(left ?? {}).toSorted(([leftKey], [rightKey]) =>
    leftKey.localeCompare(rightKey),
  );
  const rightEntries = Object.entries(right ?? {}).toSorted(([leftKey], [rightKey]) =>
    leftKey.localeCompare(rightKey),
  );
  if (leftEntries.length !== rightEntries.length) return false;
  return leftEntries.every(([key, value], index) => {
    const rightEntry = rightEntries[index];
    return rightEntry !== void 0 && rightEntry[0] === key && rightEntry[1] === value;
  });
}
//#endregion
//#region src/infra/node-pairing.ts
const OPERATOR_ROLE = "operator";
const activeCleanupRevisionClaims = /* @__PURE__ */ new Map();
let nextCleanupClaimGeneration = 0;
function normalizeNodeId(nodeId) {
  return nodeId.trim();
}
function nodeSurfaceDevice(pairedByDeviceId, nodeId) {
  return pairedByDeviceId[normalizeNodeId(nodeId)] ?? null;
}
function toPublicPendingRequest(device, pending) {
  return {
    requestId: pending.requestId,
    nodeId: device.deviceId,
    clientId: pending.clientId ?? device.clientId,
    clientMode: pending.clientMode ?? device.clientMode,
    displayName: pending.displayName ?? device.displayName,
    platform: pending.platform ?? device.platform,
    version: pending.version,
    coreVersion: pending.coreVersion,
    uiVersion: pending.uiVersion,
    deviceFamily: pending.deviceFamily ?? device.deviceFamily,
    modelIdentifier: pending.modelIdentifier,
    caps: pending.caps,
    commands: pending.commands,
    permissions: pending.permissions,
    remoteIp: pending.remoteIp ?? device.remoteIp,
    silent: pending.silent,
    ts: pending.ts,
  };
}
function toPendingSnapshot(device, pending) {
  return {
    requestId: pending.requestId,
    nodeId: device.deviceId,
    ...(pending.revision ? { revision: pending.revision } : {}),
  };
}
function toPendingEntry(device, pending) {
  return {
    ...toPublicPendingRequest(device, pending),
    requiredApproveScopes: resolveNodePairApprovalScopes(pending.commands ?? []),
  };
}
function toPairedNode(device) {
  const surface = device.nodeSurface;
  if (!surface) return null;
  return {
    nodeId: device.deviceId,
    clientId: device.clientId,
    clientMode: device.clientMode,
    displayName: surface.displayName ?? device.displayName,
    platform: device.platform,
    version: surface.version,
    coreVersion: surface.coreVersion,
    uiVersion: surface.uiVersion,
    deviceFamily: device.deviceFamily,
    modelIdentifier: surface.modelIdentifier,
    caps: surface.caps,
    commands: surface.commands,
    permissions: surface.permissions,
    remoteIp: device.remoteIp,
    bins: surface.bins,
    createdAtMs: surface.createdAtMs,
    approvedAtMs: surface.approvedAtMs,
    lastConnectedAtMs: surface.lastConnectedAtMs,
    lastSeenAtMs: device.lastSeenAtMs,
    lastSeenReason: device.lastSeenReason,
  };
}
function buildPendingNodeSurface(params) {
  return {
    requestId: randomUUID(),
    revision: randomUUID(),
    clientId: params.req.clientId,
    clientMode: params.req.clientMode,
    displayName: params.req.displayName,
    platform: params.req.platform,
    version: params.req.version,
    coreVersion: params.req.coreVersion,
    uiVersion: params.req.uiVersion,
    deviceFamily: params.req.deviceFamily,
    modelIdentifier: params.req.modelIdentifier,
    caps: normalizeArrayBackedTrimmedStringList(params.req.caps),
    commands: normalizeArrayBackedTrimmedStringList(params.req.commands),
    permissions: params.req.permissions,
    remoteIp: params.req.remoteIp,
    silent: params.req.silent,
    ts: Date.now(),
  };
}
function refreshPendingNodeSurface(existing, incoming) {
  return {
    ...existing,
    revision: randomUUID(),
    clientId: incoming.clientId ?? existing.clientId,
    clientMode: incoming.clientMode ?? existing.clientMode,
    displayName: incoming.displayName ?? existing.displayName,
    platform: incoming.platform ?? existing.platform,
    version: incoming.version ?? existing.version,
    coreVersion: incoming.coreVersion ?? existing.coreVersion,
    uiVersion: incoming.uiVersion ?? existing.uiVersion,
    deviceFamily: incoming.deviceFamily ?? existing.deviceFamily,
    modelIdentifier: incoming.modelIdentifier ?? existing.modelIdentifier,
    caps: normalizeArrayBackedTrimmedStringList(incoming.caps) ?? existing.caps,
    commands: normalizeArrayBackedTrimmedStringList(incoming.commands) ?? existing.commands,
    permissions: incoming.permissions ?? existing.permissions,
    remoteIp: incoming.remoteIp ?? existing.remoteIp,
    silent: Boolean(existing.silent && incoming.silent),
    ts: Date.now(),
  };
}
function samePendingApprovalSurface(existing, incoming) {
  const incomingCaps = normalizeArrayBackedTrimmedStringList(incoming.caps) ?? existing.caps;
  const incomingCommands =
    normalizeArrayBackedTrimmedStringList(incoming.commands) ?? existing.commands;
  const incomingPermissions = incoming.permissions ?? existing.permissions;
  return (
    sameNodeApprovalSurfaceSet(existing.caps, incomingCaps) &&
    sameNodeApprovalSurfaceSet(existing.commands, incomingCommands) &&
    sameNodePermissionSurface(existing.permissions, incomingPermissions)
  );
}
function samePendingReconnectMetadata(existing, incoming) {
  return (
    (incoming.clientId ?? existing.clientId) === existing.clientId &&
    (incoming.clientMode ?? existing.clientMode) === existing.clientMode &&
    (incoming.displayName ?? existing.displayName) === existing.displayName &&
    (incoming.platform ?? existing.platform) === existing.platform &&
    (incoming.version ?? existing.version) === existing.version &&
    (incoming.coreVersion ?? existing.coreVersion) === existing.coreVersion &&
    (incoming.uiVersion ?? existing.uiVersion) === existing.uiVersion &&
    (incoming.deviceFamily ?? existing.deviceFamily) === existing.deviceFamily &&
    (incoming.modelIdentifier ?? existing.modelIdentifier) === existing.modelIdentifier &&
    (incoming.remoteIp ?? existing.remoteIp) === existing.remoteIp &&
    Boolean(existing.silent && incoming.silent) === Boolean(existing.silent)
  );
}
function buildCleanupRevisionClaimKey(baseDir, observed) {
  return `${baseDir ?? ""}\0${observed.nodeId}\0${observed.requestId}\0${observed.revision ?? ""}`;
}
function addCleanupClaim(claim) {
  const key = buildCleanupRevisionClaimKey(claim.baseDir, claim.observed);
  const generations = activeCleanupRevisionClaims.get(key) ?? /* @__PURE__ */ new Set();
  generations.add(claim.generation);
  activeCleanupRevisionClaims.set(key, generations);
}
function cleanupClaimIsActive(claim) {
  const key = buildCleanupRevisionClaimKey(claim.baseDir, claim.observed);
  return activeCleanupRevisionClaims.get(key)?.has(claim.generation) === true;
}
function removeCleanupClaim(claim) {
  const key = buildCleanupRevisionClaimKey(claim.baseDir, claim.observed);
  const generations = activeCleanupRevisionClaims.get(key);
  generations?.delete(claim.generation);
  if (!generations || generations.size === 0) activeCleanupRevisionClaims.delete(key);
}
function invalidateCleanupClaimsThrough(claim, device, pending) {
  const key = buildCleanupRevisionClaimKey(claim.baseDir, toPendingSnapshot(device, pending));
  const generations = activeCleanupRevisionClaims.get(key);
  if (!generations) return;
  for (const generation of generations)
    if (generation <= claim.generation) generations.delete(generation);
  if (generations.size === 0) activeCleanupRevisionClaims.delete(key);
}
function pendingHasActiveCleanupClaim(baseDir, device, pending) {
  const key = buildCleanupRevisionClaimKey(baseDir, toPendingSnapshot(device, pending));
  return (activeCleanupRevisionClaims.get(key)?.size ?? 0) > 0;
}
async function listNodePairing(baseDir) {
  return await withPairedDeviceRecords(baseDir, (pairedByDeviceId) => {
    const pending = [];
    const paired = [];
    for (const device of Object.values(pairedByDeviceId)) {
      if (device.pendingNodeSurface)
        pending.push(toPendingEntry(device, device.pendingNodeSurface));
      const node = toPairedNode(device);
      if (node) paired.push(node);
    }
    pending.sort((a, b) => b.ts - a.ts);
    paired.sort((a, b) => b.approvedAtMs - a.approvedAtMs);
    return {
      value: {
        pending,
        paired,
      },
      persist: false,
    };
  });
}
/** Snapshot pairing state and claim current pending revisions for one paired reconnect. */
async function beginNodePairingConnect(nodeId, baseDir) {
  return await withPairedDeviceRecords(baseDir, (pairedByDeviceId) => {
    const device = nodeSurfaceDevice(pairedByDeviceId, nodeId);
    const pairedNode = device ? toPairedNode(device) : null;
    const pending = device?.pendingNodeSurface;
    if (!device || !pairedNode || !pending)
      return {
        value: { pairedNode },
        persist: false,
      };
    const claim = {
      baseDir,
      generation: ++nextCleanupClaimGeneration,
      nodeId: device.deviceId,
      observed: toPendingSnapshot(device, pending),
    };
    addCleanupClaim(claim);
    return {
      value: {
        pairedNode,
        cleanupClaim: claim,
      },
      persist: false,
    };
  });
}
/** Release a reconnect cleanup claim without changing pending pairing state. */
async function releaseNodePairingCleanupClaim(claim) {
  removeCleanupClaim(claim);
}
/** Delete pending revisions claimed by a reconnect after hello succeeds. */
async function finalizeNodePairingCleanupClaim(claim) {
  if (!cleanupClaimIsActive(claim)) return [];
  try {
    return await withPairedDeviceRecords(claim.baseDir, (pairedByDeviceId) => {
      const device = nodeSurfaceDevice(pairedByDeviceId, claim.nodeId);
      const pending = device?.pendingNodeSurface;
      if (!device || !pending)
        return {
          value: [],
          persist: false,
        };
      if (
        claim.observed.requestId !== pending.requestId ||
        claim.observed.revision !== pending.revision
      )
        return {
          value: [],
          persist: false,
        };
      delete device.pendingNodeSurface;
      return {
        value: [
          {
            requestId: pending.requestId,
            nodeId: device.deviceId,
          },
        ],
        persist: true,
      };
    });
  } finally {
    removeCleanupClaim(claim);
  }
}
/** Create or refresh the pending node-surface request for operator approval. */
async function requestNodePairing(req, baseDir) {
  const nodeId = normalizeNodeId(req.nodeId);
  if (!nodeId) throw new Error("nodeId required");
  return await withPairedDeviceRecords(baseDir, (pairedByDeviceId) => {
    const device = nodeSurfaceDevice(pairedByDeviceId, nodeId);
    if (!device) throw new Error("node pairing requires a paired device");
    const existing = device.pendingNodeSurface;
    if (
      existing &&
      samePendingApprovalSurface(existing, {
        ...req,
        nodeId,
      })
    ) {
      const refreshed = refreshPendingNodeSurface(existing, req);
      device.pendingNodeSurface = refreshed;
      return {
        value: {
          status: "pending",
          request: toPublicPendingRequest(device, refreshed),
          created: false,
        },
        persist: true,
      };
    }
    const replacement = buildPendingNodeSurface({
      req: {
        ...req,
        nodeId,
      },
    });
    device.pendingNodeSurface = replacement;
    const superseded = existing
      ? [
          {
            requestId: existing.requestId,
            nodeId,
          },
        ]
      : [];
    return {
      value: {
        status: "pending",
        request: toPublicPendingRequest(device, replacement),
        created: true,
        ...(superseded.length > 0 ? { superseded } : {}),
      },
      persist: true,
    };
  });
}
/** Reuse an unchanged reconnect request without refreshing or writing pairing state. */
async function reusePendingNodePairingForReconnect(req, cleanupClaim, baseDir) {
  const nodeId = normalizeNodeId(req.nodeId);
  return await withPairedDeviceRecords(baseDir, (pairedByDeviceId) => {
    const device = nodeSurfaceDevice(pairedByDeviceId, nodeId);
    const pending = device?.pendingNodeSurface;
    if (
      device &&
      pending &&
      samePendingApprovalSurface(pending, {
        ...req,
        nodeId,
      }) &&
      samePendingReconnectMetadata(pending, req)
    ) {
      if (cleanupClaim) invalidateCleanupClaimsThrough(cleanupClaim, device, pending);
      return {
        value: {
          status: "pending",
          request: toPublicPendingRequest(device, pending),
          created: false,
        },
        persist: false,
      };
    }
    return {
      value: null,
      persist: false,
    };
  });
}
/** Approve a pending node request when caller scopes cover the requested command surface. */
async function approveNodePairing(requestId, options, baseDir) {
  return await withPairedDeviceRecords(baseDir, (pairedByDeviceId) => {
    const device = Object.values(pairedByDeviceId).find(
      (entry) => entry.pendingNodeSurface?.requestId === requestId,
    );
    const pending = device?.pendingNodeSurface;
    if (!device || !pending)
      return {
        value: null,
        persist: false,
      };
    if (pendingHasActiveCleanupClaim(baseDir, device, pending))
      return {
        value: null,
        persist: false,
      };
    const requiredScopes = resolveNodePairApprovalScopes(pending.commands ?? []);
    const missingScope = resolveMissingRequestedScope({
      role: OPERATOR_ROLE,
      requestedScopes: requiredScopes,
      allowedScopes: options.callerScopes ?? [],
    });
    if (missingScope)
      return {
        value: {
          status: "forbidden",
          missingScope,
        },
        persist: false,
      };
    const now = Date.now();
    device.nodeSurface = {
      displayName: pending.displayName,
      version: pending.version,
      coreVersion: pending.coreVersion,
      uiVersion: pending.uiVersion,
      modelIdentifier: pending.modelIdentifier,
      caps: pending.caps,
      commands: pending.commands,
      permissions: pending.permissions,
      bins: device.nodeSurface?.bins,
      createdAtMs: device.nodeSurface?.createdAtMs ?? now,
      approvedAtMs: now,
      lastConnectedAtMs: device.nodeSurface?.lastConnectedAtMs,
    };
    delete device.pendingNodeSurface;
    const node = toPairedNode(device);
    if (!node)
      return {
        value: null,
        persist: false,
      };
    return {
      value: {
        requestId,
        node,
      },
      persist: true,
    };
  });
}
/** Reject a pending node pairing request. */
async function rejectNodePairing(requestId, baseDir) {
  return await withPairedDeviceRecords(baseDir, (pairedByDeviceId) => {
    const device = Object.values(pairedByDeviceId).find(
      (entry) => entry.pendingNodeSurface?.requestId === requestId,
    );
    if (!device)
      return {
        value: null,
        persist: false,
      };
    delete device.pendingNodeSurface;
    return {
      value: {
        requestId,
        nodeId: device.deviceId,
      },
      persist: true,
    };
  });
}
/** Update runtime node-surface metadata (connect stamps, remote skill bins). */
async function updatePairedNodeMetadata(nodeId, patch, baseDir) {
  return await withPairedDeviceRecords(baseDir, (pairedByDeviceId) => {
    const device = nodeSurfaceDevice(pairedByDeviceId, nodeId);
    if (!device?.nodeSurface)
      return {
        value: false,
        persist: false,
      };
    device.nodeSurface = {
      ...device.nodeSurface,
      ...(patch.lastConnectedAtMs !== void 0 ? { lastConnectedAtMs: patch.lastConnectedAtMs } : {}),
      ...(patch.bins !== void 0 ? { bins: patch.bins } : {}),
    };
    return {
      value: true,
      persist: true,
    };
  });
}
/** Rename a paired node display name while preserving approval metadata. */
async function renamePairedNode(nodeId, displayName, baseDir) {
  const trimmed = displayName.trim();
  if (!trimmed) throw new Error("displayName required");
  return await withPairedDeviceRecords(baseDir, (pairedByDeviceId) => {
    const device = nodeSurfaceDevice(pairedByDeviceId, nodeId);
    if (!device?.nodeSurface)
      return {
        value: null,
        persist: false,
      };
    device.nodeSurface = {
      ...device.nodeSurface,
      displayName: trimmed,
    };
    return {
      value: toPairedNode(device),
      persist: true,
    };
  });
}
//#endregion
export {
  rejectNodePairing as a,
  requestNodePairing as c,
  normalizeNodeApprovalSurfaceList as d,
  sameNodeApprovalSurfaceSet as f,
  listNodePairing as i,
  reusePendingNodePairingForReconnect as l,
  beginNodePairingConnect as n,
  releaseNodePairingCleanupClaim as o,
  sameNodePermissionSurface as p,
  finalizeNodePairingCleanupClaim as r,
  renamePairedNode as s,
  approveNodePairing as t,
  updatePairedNodeMetadata as u,
};
