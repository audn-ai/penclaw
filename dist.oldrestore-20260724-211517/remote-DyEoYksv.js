import { i as listNodePairing, u as updatePairedNodeMetadata } from "./node-pairing-CPgz4J2C.js";
import { t as bumpSkillsSnapshotVersion } from "./refresh-state-DHnXO3IV.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
} from "./string-coerce-DW4mBlAt.js";
import { l as normalizeStringEntries } from "./string-normalization-CRyoFBPt.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
import { t as listAgentWorkspaceDirs } from "./workspace-dirs-g2WMg6jo.js";
import {
  d as recordRemoteSkillNodeInfo,
  f as removeRemoteNodeSkills,
  o as loadWorkspaceSkillEntries,
} from "./workspace-DR7anktc.js";
//#region src/skills/runtime/remote.ts
const log = createSubsystemLogger("gateway/skills-remote");
const remoteNodes = /* @__PURE__ */ new Map();
const remoteNodeProbeStates = /* @__PURE__ */ new Map();
const remoteBinProbeInflight = /* @__PURE__ */ new Map();
let remoteRegistry = null;
const REMOTE_BIN_PROBE_SUCCESS_TTL_MS = 1800 * 1e3;
const REMOTE_BIN_PROBE_FAILURE_BASE_BACKOFF_MS = 15e3;
const REMOTE_BIN_PROBE_FAILURE_MAX_BACKOFF_MS = 300 * 1e3;
function describeNode(nodeId) {
  const record = remoteNodes.get(nodeId);
  const name = record?.displayName?.trim();
  const base = name && name !== nodeId ? `${name} (${nodeId})` : nodeId;
  const ip = record?.remoteIp?.trim();
  return ip ? `${base} @ ${ip}` : base;
}
function extractErrorMessage(err) {
  if (!err) return;
  if (typeof err === "string") return err;
  if (err instanceof Error) return err.message;
  if (typeof err === "object" && "message" in err && typeof err.message === "string")
    return err.message;
  if (typeof err === "number" || typeof err === "boolean" || typeof err === "bigint")
    return String(err);
  if (typeof err === "symbol") return err.toString();
  if (typeof err === "object")
    try {
      return JSON.stringify(err);
    } catch {
      return;
    }
}
function resolveRemoteBinProbeLogContext(nodeId, context) {
  const details = [
    context?.command ? `command=${context.command}` : void 0,
    typeof context?.timeoutMs === "number" ? `timeoutMs=${context.timeoutMs}` : void 0,
    typeof context?.requiredBinCount === "number"
      ? `requiredBins=${context.requiredBinCount}`
      : void 0,
    `connected=${remoteNodes.get(nodeId)?.connected === true ? "yes" : "no"}`,
  ]
    .filter(Boolean)
    .join(" ");
  return {
    label: describeNode(nodeId),
    details,
  };
}
function logRemoteBinProbeFailure(nodeId, err, context, phase = "probe") {
  const message = extractErrorMessage(err);
  const { label, details } = resolveRemoteBinProbeLogContext(nodeId, context);
  if (phase === "preflight") {
    log.info(
      `remote bin probe skipped: node connectivity unavailable (${label}; ${details}): ${message ?? "unknown"}`,
    );
    return;
  }
  if (message?.includes("node not connected") || message?.includes("node disconnected")) {
    log.info(`remote bin probe skipped: node unavailable (${label}; ${details})`);
    return;
  }
  if (message?.includes("invoke timed out") || message?.includes("timeout")) {
    log.warn(
      `remote bin probe timed out (${label}; ${details}); check node connectivity for ${label}`,
    );
    return;
  }
  log.warn(`remote bin probe error (${label}; ${details}): ${message ?? "unknown"}`);
}
function isMacPlatform(platform, deviceFamily) {
  const platformNorm = normalizeLowercaseStringOrEmpty(platform);
  const familyNorm = normalizeLowercaseStringOrEmpty(deviceFamily);
  if (platformNorm.includes("mac")) return true;
  if (platformNorm.includes("darwin")) return true;
  if (familyNorm === "mac") return true;
  return false;
}
function supportsSystemRun(commands) {
  return Array.isArray(commands) && commands.includes("system.run");
}
function supportsSystemWhich(commands) {
  return Array.isArray(commands) && commands.includes("system.which");
}
function upsertNode(record) {
  const existing = remoteNodes.get(record.nodeId);
  const bins = new Set(record.bins ?? existing?.bins ?? []);
  remoteNodes.set(record.nodeId, {
    nodeId: record.nodeId,
    connId: record.connId ?? existing?.connId,
    displayName: record.displayName ?? existing?.displayName,
    platform: record.platform ?? existing?.platform,
    deviceFamily: record.deviceFamily ?? existing?.deviceFamily,
    commands: record.commands ?? existing?.commands,
    remoteIp: record.remoteIp ?? existing?.remoteIp,
    bins,
    connected: record.connected ?? existing?.connected ?? false,
  });
}
function clearRemoteNodeBins(nodeId) {
  const existing = remoteNodes.get(nodeId);
  if (!existing || existing.bins.size === 0) return false;
  existing.bins = /* @__PURE__ */ new Set();
  return true;
}
function buildRemoteProbeSignature(params) {
  return JSON.stringify([
    params.command,
    normalizeLowercaseStringOrEmpty(params.platform),
    normalizeLowercaseStringOrEmpty(params.deviceFamily),
    [...(params.commands ?? [])].toSorted(),
    params.bins.toSorted(),
  ]);
}
function shouldSkipRemoteNodeProbe(params) {
  return (
    params.state?.signature === params.signature && params.nowMs < params.state.nextProbeAfterMs
  );
}
function restoreCachedRemoteNodeBins(nodeId) {
  const node = remoteNodes.get(nodeId);
  const cachedBins = remoteNodeProbeStates.get(nodeId)?.bins;
  if (!node || !cachedBins || areBinSetsEqual(node.bins, cachedBins)) return false;
  node.bins = new Set(cachedBins);
  return true;
}
function isCurrentRemoteNodeConnection(nodeId, connId) {
  if (!connId) return true;
  const current = remoteNodes.get(nodeId);
  return Boolean(current && (!current.connId || current.connId === connId));
}
function markRemoteNodeProbeSuccess(params) {
  if (!isCurrentRemoteNodeConnection(params.nodeId, params.connId)) return false;
  remoteNodeProbeStates.set(params.nodeId, {
    signature: params.signature,
    nextProbeAfterMs: params.nowMs + REMOTE_BIN_PROBE_SUCCESS_TTL_MS,
    failedProbeCount: 0,
    bins: new Set(params.bins),
  });
  return true;
}
function markRemoteNodeProbeFailure(params) {
  if (!isCurrentRemoteNodeConnection(params.nodeId, params.connId)) return false;
  const existing = remoteNodeProbeStates.get(params.nodeId);
  const failedProbeCount =
    existing?.signature === params.signature ? existing.failedProbeCount + 1 : 1;
  const backoffMs = Math.min(
    REMOTE_BIN_PROBE_FAILURE_MAX_BACKOFF_MS,
    REMOTE_BIN_PROBE_FAILURE_BASE_BACKOFF_MS * 2 ** (failedProbeCount - 1),
  );
  remoteNodeProbeStates.set(params.nodeId, {
    signature: params.signature,
    nextProbeAfterMs: params.nowMs + backoffMs,
    failedProbeCount,
  });
  return true;
}
function setSkillsRemoteRegistry(registry) {
  remoteRegistry = registry;
  if (!registry) remoteNodeProbeStates.clear();
}
async function primeRemoteSkillsCache() {
  try {
    const list = await listNodePairing();
    let sawMac = false;
    for (const node of list.paired) {
      upsertNode({
        nodeId: node.nodeId,
        displayName: node.displayName,
        platform: node.platform,
        deviceFamily: node.deviceFamily,
        commands: node.commands,
        remoteIp: node.remoteIp,
        bins: node.bins,
        connected: false,
      });
      if (
        node.bins &&
        node.bins.length > 0 &&
        isMacPlatform(node.platform, node.deviceFamily) &&
        supportsSystemRun(node.commands)
      )
        sawMac = true;
    }
    if (sawMac) bumpSkillsSnapshotVersion({ reason: "remote-node" });
  } catch (err) {
    log.warn(`failed to prime remote skills cache: ${String(err)}`);
  }
}
function recordRemoteNodeInfo(node) {
  const existing = remoteNodes.get(node.nodeId);
  if (
    node.connId &&
    existing?.connId !== node.connId &&
    !remoteNodeProbeStates.get(node.nodeId)?.bins
  )
    remoteNodeProbeStates.delete(node.nodeId);
  upsertNode({
    ...node,
    connected: true,
  });
  recordRemoteSkillNodeInfo({
    nodeId: node.nodeId,
    connId: node.connId,
    displayName: node.displayName,
    commands: node.commands,
  });
}
function recordRemoteNodeBins(nodeId, bins) {
  upsertNode({
    nodeId,
    bins,
  });
}
function removeRemoteNodeInfo(nodeId) {
  const existing = remoteNodes.get(nodeId);
  remoteNodes.delete(nodeId);
  removeRemoteNodeSkills(nodeId);
  const probeState = remoteNodeProbeStates.get(nodeId);
  if (probeState && !probeState.bins) remoteNodeProbeStates.delete(nodeId);
  if (
    existing &&
    isMacPlatform(existing.platform, existing.deviceFamily) &&
    supportsSystemRun(existing.commands)
  )
    bumpSkillsSnapshotVersion({ reason: "remote-node" });
}
function collectRequiredBins(entries, targetPlatform) {
  const bins = /* @__PURE__ */ new Set();
  for (const entry of entries) {
    const os = entry.metadata?.os ?? [];
    if (os.length > 0 && !os.includes(targetPlatform)) continue;
    const required = entry.metadata?.requires?.bins ?? [];
    const anyBins = entry.metadata?.requires?.anyBins ?? [];
    for (const bin of required) if (bin.trim()) bins.add(bin.trim());
    for (const bin of anyBins) if (bin.trim()) bins.add(bin.trim());
  }
  return [...bins];
}
function buildBinProbeScript(bins) {
  return `for b in ${bins.map((bin) => `'${bin.replace(/'/g, `'\\''`)}'`).join(" ")}; do if command -v "$b" >/dev/null 2>&1; then echo "$b"; fi; done`;
}
function parseBinProbePayload(payloadJSON, payload) {
  if (!payloadJSON && !payload) return [];
  try {
    const parsed = payloadJSON ? JSON.parse(payloadJSON) : payload;
    if (Array.isArray(parsed.bins)) return normalizeStringEntries(parsed.bins);
    if (parsed.bins && typeof parsed.bins === "object")
      return Object.entries(parsed.bins)
        .filter(([, resolvedPath]) => normalizeOptionalString(resolvedPath) !== void 0)
        .map(([bin]) => normalizeOptionalString(bin) ?? "")
        .filter(Boolean);
    if (typeof parsed.stdout === "string")
      return parsed.stdout
        .split(/\r?\n/)
        .map((line) => normalizeOptionalString(line) ?? "")
        .filter(Boolean);
  } catch {
    return [];
  }
  return [];
}
function areBinSetsEqual(a, b) {
  if (!a) return false;
  if (a.size !== b.size) return false;
  for (const bin of b) if (!a.has(bin)) return false;
  return true;
}
async function refreshRemoteNodeBins(params) {
  const connId = remoteRegistry?.get(params.nodeId)?.connId;
  const existing = remoteBinProbeInflight.get(params.nodeId);
  if (existing) {
    await existing.promise;
    if (existing.connId === connId) return;
  }
  const inflight = {
    connId,
    promise: Promise.resolve(),
  };
  const run = refreshRemoteNodeBinsUncoalesced(params).finally(() => {
    if (remoteBinProbeInflight.get(params.nodeId) === inflight)
      remoteBinProbeInflight.delete(params.nodeId);
  });
  inflight.promise = run;
  remoteBinProbeInflight.set(params.nodeId, inflight);
  await run;
}
async function refreshRemoteNodeBinsUncoalesced(params) {
  const readinessDelayMs = params.readinessDelayMs ?? 0;
  if (readinessDelayMs > 0)
    await new Promise((resolve) => {
      setTimeout(resolve, readinessDelayMs);
    });
  if (!remoteRegistry) return;
  const liveSession = remoteRegistry.get(params.nodeId);
  const probeConnId = liveSession?.connId;
  const platform = liveSession?.platform ?? params.platform;
  const deviceFamily = liveSession?.deviceFamily ?? params.deviceFamily;
  const commands = liveSession?.commands ?? params.commands;
  if (!isMacPlatform(platform, deviceFamily)) return;
  const canWhich = supportsSystemWhich(commands);
  const canRun = supportsSystemRun(commands);
  if (!canWhich && !canRun) return;
  const workspaceDirs = listAgentWorkspaceDirs(params.cfg);
  const requiredBins = /* @__PURE__ */ new Set();
  for (const workspaceDir of workspaceDirs) {
    const entries = loadWorkspaceSkillEntries(workspaceDir, { config: params.cfg });
    for (const bin of collectRequiredBins(entries, "darwin")) requiredBins.add(bin);
  }
  if (requiredBins.size === 0) return;
  const binsList = [...requiredBins];
  const timeoutMs = params.timeoutMs ?? 15e3;
  const command = canWhich ? "system.which" : "system.run";
  const probeSignature = buildRemoteProbeSignature({
    command,
    platform,
    deviceFamily,
    commands,
    bins: binsList,
  });
  const nowMs = Date.now();
  if (
    shouldSkipRemoteNodeProbe({
      state: remoteNodeProbeStates.get(params.nodeId),
      signature: probeSignature,
      nowMs,
    })
  ) {
    if (restoreCachedRemoteNodeBins(params.nodeId))
      bumpSkillsSnapshotVersion({ reason: "remote-node" });
    return;
  }
  const logContext = {
    command,
    timeoutMs,
    requiredBinCount: binsList.length,
  };
  const connectivityTimeoutMs = Math.min(timeoutMs, 2e3);
  if (typeof remoteRegistry.checkConnectivity === "function") {
    const preflightConnId = remoteRegistry.get(params.nodeId)?.connId;
    let connectivity;
    try {
      connectivity = await remoteRegistry.checkConnectivity(params.nodeId, connectivityTimeoutMs);
    } catch (err) {
      if (
        !markRemoteNodeProbeFailure({
          nodeId: params.nodeId,
          connId: probeConnId,
          signature: probeSignature,
          nowMs: Date.now(),
        })
      )
        return;
      const cleared = clearRemoteNodeBins(params.nodeId);
      logRemoteBinProbeFailure(
        params.nodeId,
        err,
        {
          command: "websocket.ping",
          timeoutMs: connectivityTimeoutMs,
          requiredBinCount: binsList.length,
        },
        "preflight",
      );
      if (cleared) bumpSkillsSnapshotVersion({ reason: "remote-node" });
      return;
    }
    if (!connectivity.ok) {
      const latestSession = remoteRegistry.get(params.nodeId);
      if (preflightConnId && latestSession && latestSession.connId !== preflightConnId) {
        await refreshRemoteNodeBinsUncoalesced({
          nodeId: latestSession.nodeId,
          platform: latestSession.platform,
          deviceFamily: latestSession.deviceFamily,
          commands: latestSession.commands,
          cfg: params.cfg,
          timeoutMs: params.timeoutMs,
        });
        return;
      }
      if (
        !markRemoteNodeProbeFailure({
          nodeId: params.nodeId,
          connId: probeConnId,
          signature: probeSignature,
          nowMs: Date.now(),
        })
      )
        return;
      const cleared = clearRemoteNodeBins(params.nodeId);
      logRemoteBinProbeFailure(
        params.nodeId,
        connectivity.error.message,
        {
          command: "websocket.ping",
          timeoutMs: connectivityTimeoutMs,
          requiredBinCount: binsList.length,
        },
        "preflight",
      );
      if (cleared) bumpSkillsSnapshotVersion({ reason: "remote-node" });
      return;
    }
  }
  try {
    const res = await remoteRegistry.invoke(
      canWhich
        ? {
            nodeId: params.nodeId,
            command,
            params: { bins: binsList },
            timeoutMs,
          }
        : {
            nodeId: params.nodeId,
            command,
            params: { command: ["/bin/sh", "-lc", buildBinProbeScript(binsList)] },
            timeoutMs,
          },
    );
    if (!res.ok) {
      if (
        !markRemoteNodeProbeFailure({
          nodeId: params.nodeId,
          connId: probeConnId,
          signature: probeSignature,
          nowMs: Date.now(),
        })
      )
        return;
      const cleared = clearRemoteNodeBins(params.nodeId);
      logRemoteBinProbeFailure(params.nodeId, res.error?.message ?? "unknown", logContext);
      if (cleared) bumpSkillsSnapshotVersion({ reason: "remote-node" });
      return;
    }
    const bins = parseBinProbePayload(res.payloadJSON, res.payload);
    if (
      !markRemoteNodeProbeSuccess({
        nodeId: params.nodeId,
        connId: probeConnId,
        signature: probeSignature,
        nowMs: Date.now(),
        bins,
      })
    )
      return;
    const existingBins = remoteNodes.get(params.nodeId)?.bins;
    const hasChanged = !areBinSetsEqual(existingBins, new Set(bins));
    recordRemoteNodeBins(params.nodeId, bins);
    if (!hasChanged) return;
    await updatePairedNodeMetadata(params.nodeId, { bins });
    bumpSkillsSnapshotVersion({ reason: "remote-node" });
  } catch (err) {
    if (
      !markRemoteNodeProbeFailure({
        nodeId: params.nodeId,
        connId: probeConnId,
        signature: probeSignature,
        nowMs: Date.now(),
      })
    )
      return;
    const cleared = clearRemoteNodeBins(params.nodeId);
    logRemoteBinProbeFailure(params.nodeId, err, logContext);
    if (cleared) bumpSkillsSnapshotVersion({ reason: "remote-node" });
  }
}
function getRemoteSkillEligibility(options) {
  const macNodes = [...remoteNodes.values()].filter(
    (node) =>
      node.connected &&
      isMacPlatform(node.platform, node.deviceFamily) &&
      supportsSystemRun(node.commands),
  );
  if (macNodes.length === 0) return;
  const bins = /* @__PURE__ */ new Set();
  for (const node of macNodes) for (const bin of node.bins) bins.add(bin);
  const labels = macNodes.map((node) => node.displayName ?? node.nodeId).filter(Boolean);
  const note =
    options?.advertiseExecNode === false
      ? void 0
      : labels.length > 0
        ? `Remote macOS node available (${labels.join(", ")}). Run macOS-only skills via exec host=node on that node.`
        : "Remote macOS node available. Run macOS-only skills via exec host=node on that node.";
  return {
    platforms: ["darwin"],
    hasBin: (bin) => bins.has(bin),
    hasAnyBin: (required) => required.some((bin) => bins.has(bin)),
    ...(note ? { note } : {}),
  };
}
async function refreshRemoteBinsForConnectedNodes(cfg) {
  if (!remoteRegistry) return;
  const connected = remoteRegistry.listConnected();
  for (const node of connected)
    try {
      await refreshRemoteNodeBins({
        nodeId: node.nodeId,
        platform: node.platform,
        deviceFamily: node.deviceFamily,
        commands: node.commands,
        cfg,
      });
    } catch (err) {
      log.warn(`failed to refresh remote bins for ${describeNode(node.nodeId)}: ${String(err)}`);
    }
}
//#endregion
export {
  refreshRemoteBinsForConnectedNodes as a,
  setSkillsRemoteRegistry as c,
  recordRemoteNodeInfo as i,
  primeRemoteSkillsCache as n,
  refreshRemoteNodeBins as o,
  recordRemoteNodeBins as r,
  removeRemoteNodeInfo as s,
  getRemoteSkillEligibility as t,
};
