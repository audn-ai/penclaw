import { a as asRecord } from "./record-coerce-DHZ4bFlT.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region src/shared/node-list-parse.ts
function normalizePendingRequest(row) {
  const requestId = normalizeOptionalString(row.requestId);
  const nodeId = normalizeOptionalString(row.nodeId);
  if (requestId === void 0 || nodeId === void 0) return null;
  return {
    ...row,
    requestId,
    nodeId,
    displayName: normalizeOptionalString(row.displayName),
    platform: normalizeOptionalString(row.platform),
    version: normalizeOptionalString(row.version),
    coreVersion: normalizeOptionalString(row.coreVersion),
    uiVersion: normalizeOptionalString(row.uiVersion),
    remoteIp: normalizeOptionalString(row.remoteIp),
  };
}
function normalizePairedNode(row) {
  const nodeId = normalizeOptionalString(row.nodeId);
  if (nodeId === void 0) return null;
  return {
    ...row,
    nodeId,
    displayName: normalizeOptionalString(row.displayName),
    platform: normalizeOptionalString(row.platform),
    version: normalizeOptionalString(row.version),
    coreVersion: normalizeOptionalString(row.coreVersion),
    uiVersion: normalizeOptionalString(row.uiVersion),
    remoteIp: normalizeOptionalString(row.remoteIp),
    lastSeenReason: normalizeOptionalString(row.lastSeenReason),
  };
}
/** Extracts pending and paired node arrays from permissive node.pair.list payloads. */
function parsePairingList(value) {
  const obj = asRecord(value);
  return {
    pending: Array.isArray(obj.pending)
      ? obj.pending.map(normalizePendingRequest).filter((row) => row !== null)
      : [],
    paired: Array.isArray(obj.paired)
      ? obj.paired.map(normalizePairedNode).filter((row) => row !== null)
      : [],
  };
}
/** Extracts the nodes array from a node.list response, treating malformed payloads as empty. */
function parseNodeList(value) {
  const obj = asRecord(value);
  return Array.isArray(obj.nodes) ? obj.nodes : [];
}
//#endregion
export { parsePairingList as n, parseNodeList as t };
