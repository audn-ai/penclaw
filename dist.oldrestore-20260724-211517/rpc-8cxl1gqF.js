import { randomUUID } from "node:crypto";
import { t as createLazyImportLoader } from "./lazy-promise-EhsWch5m.js";
import { n as parsePairingList, t as parseNodeList } from "./node-list-parse-BlhiSeiu.js";
import "./parse-finite-number-Z7n6tXLk.js";
import { t as resolveNodeFromNodeList } from "./node-resolve-CFpfmgWj.js";
import {
  _ as parseStrictFiniteNumber,
  b as parseStrictPositiveInteger,
  y as parseStrictNonNegativeInteger,
} from "./number-coercion-CJQ8TR--.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  f as normalizeStringifiedOptionalString,
} from "./string-coerce-DW4mBlAt.js";
//#region src/cli/nodes-cli/format.ts
/** Format node permission maps as a stable `[permission=yes|no]` label. */
function formatPermissions(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const entries = Object.entries(raw)
    .map(([key, value]) => [normalizeStringifiedOptionalString(key) ?? "", value === true])
    .filter(([key]) => key.length > 0)
    .toSorted((a, b) => a[0].localeCompare(b[0]));
  if (entries.length === 0) return null;
  return `[${entries.map(([key, granted]) => `${key}=${granted ? "yes" : "no"}`).join(", ")}]`;
}
//#endregion
//#region src/cli/nodes-cli/rpc.ts
const nodesCliRpcRuntimeLoader = createLazyImportLoader(() => import("./rpc.runtime.js"));
async function loadNodesCliRpcRuntime() {
  return nodesCliRpcRuntimeLoader.load();
}
const STORED_DEVICE_AUTH_FALLBACK_DETAIL_CODES = /* @__PURE__ */ new Set([
  "AUTH_REQUIRED",
  "AUTH_UNAUTHORIZED",
  "AUTH_TOKEN_MISMATCH",
  "AUTH_DEVICE_TOKEN_MISMATCH",
  "AUTH_SCOPE_MISMATCH",
  "PAIRING_REQUIRED",
]);
function readGatewayClientRequestDetailCode(value) {
  if (!(value instanceof Error) || value.name !== "GatewayClientRequestError") return null;
  const details = value.details;
  if (!details || typeof details !== "object") return null;
  const code = details.code;
  return typeof code === "string" ? code : null;
}
function isDiagnosticsAuthFallbackError(value) {
  if (
    value instanceof Error &&
    (value.name === "GatewayCredentialsRequiredError" ||
      value.name === "GatewayStoredDeviceAuthUnavailableError" ||
      value.name === "GatewayLocalBackendSharedAuthUnavailableError")
  )
    return true;
  const detailCode = readGatewayClientRequestDetailCode(value);
  if (detailCode !== null && STORED_DEVICE_AUTH_FALLBACK_DETAIL_CODES.has(detailCode)) return true;
  return (
    value instanceof Error &&
    value.name === "GatewayClientRequestError" &&
    value.gatewayCode === "INVALID_REQUEST" &&
    value.message.includes("missing scope: operator.read")
  );
}
function isUnknownGatewayMethodError(value, method) {
  return (
    value instanceof Error &&
    value.name === "GatewayClientRequestError" &&
    value.gatewayCode === "INVALID_REQUEST" &&
    value.message.includes(`unknown method: ${method}`)
  );
}
/** Attach shared Gateway connection/json options to a node command. */
const nodesCallOpts = (cmd, defaults) =>
  cmd
    .option("--url <url>", "Gateway WebSocket URL (defaults to gateway.remote.url when configured)")
    .option("--token <token>", "Gateway token (if required)")
    .option("--timeout <ms>", "Timeout in ms", String(defaults?.timeoutMs ?? 1e4))
    .option("--json", "Output JSON", false);
/** Call a Gateway method through the lazily loaded node CLI RPC runtime. */
const callGatewayCli = async (method, opts, params, callOpts) => {
  return await (
    await loadNodesCliRpcRuntime()
  ).callGatewayCliRuntime(method, opts, params, callOpts);
};
/** Read node diagnostics with pairing details when authorized, otherwise keep read-only access. */
const callNodeDiagnosticsGatewayCli = async (method, opts, params) => {
  try {
    return await callGatewayCli(method, opts, params, {
      useStoredDeviceAuth: true,
      requiredStoredDeviceAuthScopes: ["operator.read", "operator.pairing"],
    });
  } catch (error) {
    if (!isDiagnosticsAuthFallbackError(error)) throw error;
  }
  try {
    return await callGatewayCli(method, opts, params, {
      scopes: ["operator.read", "operator.pairing"],
      useLocalBackendSharedAuth: true,
    });
  } catch (error) {
    if (!isDiagnosticsAuthFallbackError(error)) throw error;
  }
  return await callGatewayCli(method, opts, params);
};
/** Call pairing approval methods with explicit operator scopes. */
const callNodePairApprovalGatewayCli = async (method, opts, params, callOpts) => {
  return await (
    await loadNodesCliRpcRuntime()
  ).callNodePairApprovalGatewayCliRuntime(method, opts, params, callOpts);
};
/** Build a node.invoke payload with an idempotency key and optional timeout. */
function buildNodeInvokeParams(params) {
  const invokeParams = {
    nodeId: params.nodeId,
    command: params.command,
    params: params.params,
    idempotencyKey: params.idempotencyKey ?? randomUUID(),
  };
  if (typeof params.timeoutMs === "number" && Number.isFinite(params.timeoutMs))
    invokeParams.timeoutMs = params.timeoutMs;
  return invokeParams;
}
function hasOptionalValue(value) {
  return value !== void 0 && value !== null && value !== "";
}
/** Parse an optional positive integer node CLI flag. */
function parseOptionalNodePositiveInteger(value, flag) {
  if (!hasOptionalValue(value)) return;
  const parsed = parseStrictPositiveInteger(value);
  if (parsed === void 0) throw new Error(`${flag} must be a positive integer.`);
  return parsed;
}
/** Parse an optional non-negative integer node CLI flag. */
function parseOptionalNodeNonNegativeInteger(value, flag) {
  if (!hasOptionalValue(value)) return;
  const parsed = parseStrictNonNegativeInteger(value);
  if (parsed === void 0) throw new Error(`${flag} must be a non-negative integer.`);
  return parsed;
}
/** Parse an optional finite number node CLI flag with optional bounds. */
function parseOptionalNodeFiniteNumber(value, flag, bounds) {
  if (!hasOptionalValue(value)) return;
  const parsed = parseStrictFiniteNumber(value);
  if (parsed === void 0) throw new Error(`${flag} must be a finite number.`);
  if (bounds?.minExclusive !== void 0 && parsed <= bounds.minExclusive)
    throw new Error(`${flag} must be greater than ${bounds.minExclusive}.`);
  if (bounds?.minInclusive !== void 0 && parsed < bounds.minInclusive)
    throw new Error(`${flag} must be at least ${bounds.minInclusive}.`);
  if (bounds?.maxInclusive !== void 0 && parsed > bounds.maxInclusive)
    throw new Error(`${flag} must be at most ${bounds.maxInclusive}.`);
  return parsed;
}
/** Return the local-development hint for known unsigned Peekaboo bridge authorization failures. */
function unauthorizedHintForMessage(message) {
  const haystack = normalizeLowercaseStringOrEmpty(message);
  if (
    haystack.includes("unauthorizedclient") ||
    haystack.includes("bridge client is not authorized") ||
    haystack.includes("unsigned bridge clients are not allowed")
  )
    return [
      "peekaboo bridge rejected the client.",
      "sign the peekaboo CLI (TeamID Y5PE65HELJ) or launch the host with",
      "PEEKABOO_ALLOW_UNSIGNED_SOCKET_CLIENTS=1 for local dev.",
    ].join(" ");
  return null;
}
/** Resolve a node query to a node id via live node list or paired-node fallback. */
async function resolveNodeId(opts, query) {
  return (await resolveNode(opts, query)).nodeId;
}
/** Resolve a node through the pairing-aware diagnostics view when available. */
async function resolveNodeDiagnosticsId(opts, query) {
  try {
    return resolveNodeFromNodeList(
      parseNodeList(await callNodeDiagnosticsGatewayCli("node.list", opts, {})),
      query,
    ).nodeId;
  } catch (error) {
    if (!isUnknownGatewayMethodError(error, "node.list")) throw error;
    return await resolveNodeId(opts, query);
  }
}
/** Resolve a node query to the best available node record. */
async function resolveNode(opts, query) {
  let nodes;
  try {
    nodes = parseNodeList(await callGatewayCli("node.list", opts, {}));
  } catch {
    const { paired } = parsePairingList(await callGatewayCli("node.pair.list", opts, {}));
    nodes = paired.map((n) => ({
      nodeId: n.nodeId,
      displayName: n.displayName,
      platform: n.platform,
      version: n.version,
      remoteIp: n.remoteIp,
    }));
  }
  return resolveNodeFromNodeList(nodes, query);
}
//#endregion
export {
  nodesCallOpts as a,
  parseOptionalNodePositiveInteger as c,
  resolveNodeId as d,
  unauthorizedHintForMessage as f,
  callNodePairApprovalGatewayCli as i,
  resolveNode as l,
  callGatewayCli as n,
  parseOptionalNodeFiniteNumber as o,
  formatPermissions as p,
  callNodeDiagnosticsGatewayCli as r,
  parseOptionalNodeNonNegativeInteger as s,
  buildNodeInvokeParams as t,
  resolveNodeDiagnosticsId as u,
};
