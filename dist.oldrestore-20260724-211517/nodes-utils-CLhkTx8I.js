import { t as callGatewayTool } from "./gateway-Dyh1k_4Q.js";
import { n as parsePairingList, t as parseNodeList } from "./node-list-parse-BlhiSeiu.js";
import {
  n as resolveNodeIdFromNodeList,
  t as resolveNodeFromNodeList,
} from "./node-resolve-CFpfmgWj.js";
import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
//#region src/agents/tools/nodes-utils.ts
/**
 * Nodes lookup helpers.
 *
 * Loads paired nodes from Gateway and resolves requested/default nodes with legacy pair-list fallback.
 */
function messageFromError(error) {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  )
    return error.message;
  if (typeof error === "object" && error !== null)
    try {
      return JSON.stringify(error);
    } catch {
      return "";
    }
  return "";
}
function shouldFallbackToPairList(error) {
  const message = normalizeOptionalLowercaseString(messageFromError(error)) ?? "";
  if (!message.includes("node.list")) return false;
  return (
    message.includes("unknown method") ||
    message.includes("method not found") ||
    message.includes("not implemented") ||
    message.includes("unsupported")
  );
}
async function loadNodes(opts, signal) {
  try {
    return parseNodeList(await callGatewayTool("node.list", opts, {}, { signal }));
  } catch (error) {
    if (!shouldFallbackToPairList(error)) throw error;
    const { paired } = parsePairingList(
      await callGatewayTool("node.pair.list", opts, {}, { signal }),
    );
    return paired.map((n) => ({
      nodeId: n.nodeId,
      displayName: n.displayName,
      platform: n.platform,
      remoteIp: n.remoteIp,
    }));
  }
}
function isLocalMacNode(node) {
  return (
    normalizeOptionalLowercaseString(node.platform)?.startsWith("mac") === true &&
    typeof node.nodeId === "string" &&
    node.nodeId.startsWith("mac-")
  );
}
function compareDefaultNodeOrder(a, b) {
  const aConnectedAt = Number.isFinite(a.connectedAtMs) ? (a.connectedAtMs ?? 0) : -1;
  const bConnectedAt = Number.isFinite(b.connectedAtMs) ? (b.connectedAtMs ?? 0) : -1;
  if (aConnectedAt !== bConnectedAt) return bConnectedAt - aConnectedAt;
  return a.nodeId.localeCompare(b.nodeId);
}
/** Selects the implicit node target when a tool call omits an explicit node query. */
function selectDefaultNodeFromList(nodes, options = {}) {
  const capability = options.capability?.trim();
  const withCapability = capability
    ? nodes.filter((n) => (Array.isArray(n.caps) ? n.caps.includes(capability) : true))
    : nodes;
  if (withCapability.length === 0) return null;
  const connected = withCapability.filter((n) => n.connected);
  const candidates = connected.length > 0 ? connected : withCapability;
  if (candidates.length === 1) return candidates.at(0) ?? null;
  if (options.preferLocalMac ?? true) {
    const local = candidates.filter(isLocalMacNode);
    if (local.length === 1) return local.at(0) ?? null;
  }
  if ((options.fallback ?? "none") === "none") return null;
  return [...candidates].toSorted(compareDefaultNodeOrder)[0] ?? null;
}
function pickDefaultNode(nodes) {
  return selectDefaultNodeFromList(nodes, {
    capability: "canvas",
    fallback: "first",
    preferLocalMac: true,
  });
}
/** Lists Gateway nodes, falling back to paired-node records for older Gateway versions. */
async function listNodes(opts, signal) {
  return loadNodes(opts, signal);
}
/** Resolves a node id from an already-loaded node list using shared node matching rules. */
function resolveNodeIdFromList(nodes, query, allowDefault = false, options = {}) {
  return resolveNodeIdFromNodeList(nodes, query, {
    allowDefault,
    allowCompactDisplayName: options.allowCompactDisplayName,
    pickDefaultNode,
  });
}
/** Loads nodes from the Gateway and resolves the requested or default node id. */
async function resolveNodeId(opts, query, allowDefault = false) {
  return (await resolveNode(opts, query, allowDefault)).nodeId;
}
/** Loads nodes from the Gateway and returns the requested or default node record. */
async function resolveNode(opts, query, allowDefault = false) {
  return resolveNodeFromNodeList(await loadNodes(opts), query, {
    allowDefault,
    pickDefaultNode,
  });
}
//#endregion
export {
  selectDefaultNodeFromList as a,
  resolveNodeIdFromList as i,
  resolveNode as n,
  resolveNodeId as r,
  listNodes as t,
};
