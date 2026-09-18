import crypto from "node:crypto";
import { t as appendFileTransferAudit } from "./audit-Be1mkcpD.js";
import { h as readPositiveIntegerParam } from "./common-DyDSUect.js";
import { t as formatByteSize } from "./format-DBMNwbgU.js";
import "./number-runtime-B-n-wjMn.js";
import "./agent-harness-runtime-BjY9gsEs.js";
import "./param-readers-8wnI_A3p.js";
import { t as callGatewayTool } from "./gateway-Dyh1k_4Q.js";
import { i as resolveNodeIdFromList, t as listNodes } from "./nodes-utils-CLhkTx8I.js";
//#region extensions/file-transfer/src/shared/params.ts
function readGatewayCallOptions(params) {
  const opts = {};
  if (typeof params.gatewayUrl === "string" && params.gatewayUrl.trim())
    opts.gatewayUrl = params.gatewayUrl.trim();
  if (typeof params.gatewayToken === "string" && params.gatewayToken.trim())
    opts.gatewayToken = params.gatewayToken.trim();
  opts.timeoutMs = readPositiveIntegerParam(params, "timeoutMs");
  return opts;
}
function readTrimmedString(params, key) {
  const value = params[key];
  return typeof value === "string" ? value.trim() : "";
}
function readBoolean(params, key, defaultValue = false) {
  const value = params[key];
  if (typeof value === "boolean") return value;
  return defaultValue;
}
function readClampedInt(params) {
  const requested = readPositiveIntegerParam(params.input, params.key) ?? params.defaultValue;
  return Math.max(params.hardMin, Math.min(requested, params.hardMax));
}
function humanSize(bytes) {
  return formatByteSize(bytes, {
    style: "legacy-binary",
    maxUnit: "mega",
    separator: " ",
    fractionDigits: (_value, unit) => (unit === "byte" ? null : unit === "kilo" ? 1 : 2),
  });
}
//#endregion
//#region extensions/file-transfer/src/shared/errors.ts
function throwFromNodePayload(operation, payload) {
  const code = typeof payload.code === "string" ? payload.code : "ERROR";
  const message = typeof payload.message === "string" ? payload.message : `${operation} failed`;
  const canonical =
    typeof payload.canonicalPath === "string" ? ` (canonical=${payload.canonicalPath})` : "";
  throw new Error(`${operation} ${code}: ${message}${canonical}`);
}
//#endregion
//#region extensions/file-transfer/src/tools/node-tool-invoke.ts
function readRequiredNodePath(params) {
  const node = readTrimmedString(params, "node");
  const requestedPath = readTrimmedString(params, "path");
  if (!node) throw new Error("node required");
  if (!requestedPath) throw new Error("path required");
  return {
    node,
    requestedPath,
  };
}
async function invokeNodeToolPayload(input) {
  const gatewayOpts = readGatewayCallOptions(input.params);
  const nodes = await listNodes(gatewayOpts);
  if (nodes.length === 0)
    throw new Error(
      "no paired nodes available; file-transfer tools require a paired node from nodes status. Use local file/exec tools for local workspace paths.",
    );
  const nodeId = resolveNodeIdFromList(nodes, input.node, false);
  const nodeDisplayName = nodes.find((n) => n.nodeId === nodeId)?.displayName ?? input.node;
  const startedAt = Date.now();
  const raw = await callGatewayTool("node.invoke", gatewayOpts, {
    nodeId,
    command: input.command,
    params: input.commandParams,
    idempotencyKey: crypto.randomUUID(),
  });
  const payload =
    raw?.payload && typeof raw.payload === "object" && !Array.isArray(raw.payload)
      ? raw.payload
      : null;
  if (!payload) {
    await appendFileTransferAudit({
      op: input.command,
      nodeId,
      nodeDisplayName,
      requestedPath: input.requestedPath,
      decision: "error",
      errorMessage: input.invalidPayloadMessage ?? "invalid payload",
      durationMs: Date.now() - startedAt,
      ...input.errorAuditExtra,
    });
    throw new Error(input.invalidPayloadError ?? `invalid ${input.command} payload`);
  }
  if (payload.ok === false || (input.requireOk === true && payload.ok !== true)) {
    await appendFileTransferAudit({
      op: input.command,
      nodeId,
      nodeDisplayName,
      requestedPath: input.requestedPath,
      canonicalPath: typeof payload.canonicalPath === "string" ? payload.canonicalPath : void 0,
      decision: "error",
      errorCode: typeof payload.code === "string" ? payload.code : void 0,
      errorMessage: typeof payload.message === "string" ? payload.message : void 0,
      durationMs: Date.now() - startedAt,
      ...input.errorAuditExtra,
    });
    throwFromNodePayload(input.command, payload);
  }
  return {
    nodeDisplayName,
    nodeId,
    payload,
    startedAt,
  };
}
//#endregion
export {
  readClampedInt as a,
  readBoolean as i,
  readRequiredNodePath as n,
  humanSize as r,
  invokeNodeToolPayload as t,
};
