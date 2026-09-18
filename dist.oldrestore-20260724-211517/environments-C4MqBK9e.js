import { l as listDevicePairing } from "./device-pairing-BIH9-x3P.js";
import { n as errorShape, t as ErrorCodes } from "./error-codes-O0AkRNx7.js";
import { r as listKnownNodes, t as createKnownNodeCatalog } from "./node-catalog-DHHVSVMP.js";
import { i as listNodePairing } from "./node-pairing-CPgz4J2C.js";
import {
  r as respondUnavailableOnThrow,
  t as respondInvalidParams,
} from "./nodes.helpers-eTJDH6p7.js";
import {
  bt as validateEnvironmentsListParams,
  vt as validateEnvironmentsCreateParams,
  xt as validateEnvironmentsStatusParams,
  yt as validateEnvironmentsDestroyParams,
} from "./src-CIJf1lT0.js";
import { c as normalizeSortedUniqueTrimmedStringList } from "./string-normalization-CRyoFBPt.js";
//#region src/gateway/server-methods/environments.ts
const GATEWAY_ENVIRONMENT = {
  id: "gateway",
  type: "local",
  label: "Gateway local",
  status: "available",
  capabilities: ["agent.run", "sessions", "tools", "workspace"],
};
const WORKER_STATUS = {
  requested: "starting",
  provisioning: "starting",
  bootstrapping: "starting",
  ready: "available",
  attached: "available",
  idle: "available",
  draining: "stopping",
  destroying: "stopping",
  destroyed: "unavailable",
  failed: "error",
  orphaned: "error",
};
function uniqueSortedStrings(...items) {
  return normalizeSortedUniqueTrimmedStringList(items.flatMap((item) => item ?? []));
}
function rejectInvalid(respond, method, validator) {
  return respondInvalidParams({
    respond,
    method,
    validator,
  });
}
function summarizeNodeEnvironment(node) {
  const capabilities = uniqueSortedStrings(node.caps, node.commands);
  return {
    id: `node:${node.nodeId}`,
    type: "node",
    label: node.displayName ?? node.nodeId,
    status: node.connected ? "available" : "unavailable",
    ...(capabilities.length > 0 ? { capabilities } : {}),
  };
}
/** Projects a durable worker row without exposing its SSH credential reference. */
function summarizeWorkerEnvironment(record, now = Date.now()) {
  return {
    id: record.environmentId,
    type: "worker",
    status: WORKER_STATUS[record.state],
    worker: {
      providerId: record.providerId,
      ...(record.leaseId ? { leaseId: record.leaseId } : {}),
      state: record.state,
      ageMs: Math.max(0, Math.trunc(now - record.createdAtMs)),
      ...(record.state === "idle" && record.idleSinceAtMs !== null
        ? { idleMs: Math.max(0, Math.trunc(now - record.idleSinceAtMs)) }
        : {}),
      attachedSessionIds: uniqueSortedStrings(record.attachedSessionIds),
      tunnelStatus: record.tunnelStatus,
    },
  };
}
async function listEnvironments(context) {
  const [devices, nodes] = await Promise.all([listDevicePairing(), listNodePairing()]);
  const catalog = createKnownNodeCatalog({
    pairedDevices: devices.paired,
    pairedNodes: nodes.paired,
    connectedNodes: context.nodeRegistry.listConnected(),
  });
  return [GATEWAY_ENVIRONMENT, ...listKnownNodes(catalog).map(summarizeNodeEnvironment)];
}
function listWorkerEnvironments(context) {
  try {
    return context.workerEnvironmentService?.list() ?? [];
  } catch {
    return [];
  }
}
async function respondWorkerMutation(respond, run, invalidCodes, unavailableMessage) {
  try {
    respond(true, summarizeWorkerEnvironment(await run()), void 0);
  } catch (error) {
    const code = error && typeof error === "object" && "code" in error ? error.code : void 0;
    const invalid = typeof code === "string" && invalidCodes.includes(code);
    const message = invalid && error instanceof Error ? error.message : unavailableMessage;
    respond(
      false,
      void 0,
      errorShape(invalid ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE, message),
    );
  }
}
const environmentsHandlers = {
  "environments.list": async ({ params, respond, context }) => {
    if (!validateEnvironmentsListParams(params))
      return rejectInvalid(respond, "environments.list", validateEnvironmentsListParams);
    await respondUnavailableOnThrow(respond, async () => {
      const environments = await listEnvironments(context);
      const workers = listWorkerEnvironments(context);
      const summarizedAtMs = Date.now();
      environments.push(
        ...workers.map((record) => summarizeWorkerEnvironment(record, summarizedAtMs)),
      );
      respond(true, { environments }, void 0);
    });
  },
  "environments.status": async ({ params, respond, context }) => {
    if (!validateEnvironmentsStatusParams(params))
      return rejectInvalid(respond, "environments.status", validateEnvironmentsStatusParams);
    await respondUnavailableOnThrow(respond, async () => {
      const environment = (await listEnvironments(context)).find(
        (entry) => entry.id === params.environmentId,
      );
      if (environment) {
        respond(true, environment, void 0);
        return;
      }
      let worker;
      try {
        worker = context.workerEnvironmentService?.get(params.environmentId);
      } catch {
        respond(
          false,
          void 0,
          errorShape(ErrorCodes.UNAVAILABLE, "environment status unavailable"),
        );
        return;
      }
      respond(
        Boolean(worker),
        worker ? summarizeWorkerEnvironment(worker) : void 0,
        worker ? void 0 : errorShape(ErrorCodes.INVALID_REQUEST, "unknown environmentId"),
      );
    });
  },
  "environments.create": async ({ params, respond, context }) => {
    if (!validateEnvironmentsCreateParams(params))
      return rejectInvalid(respond, "environments.create", validateEnvironmentsCreateParams);
    const service = context.workerEnvironmentService;
    if (!service) {
      respond(
        false,
        void 0,
        errorShape(ErrorCodes.INVALID_REQUEST, "cloud worker environments are not configured"),
      );
      return;
    }
    await respondWorkerMutation(
      respond,
      () => service.create(params.profileId, params.idempotencyKey),
      ["profile_not_found", "invalid_profile"],
      "worker environment creation failed",
    );
  },
  "environments.destroy": async ({ params, respond, context }) => {
    if (!validateEnvironmentsDestroyParams(params))
      return rejectInvalid(respond, "environments.destroy", validateEnvironmentsDestroyParams);
    const service = context.workerEnvironmentService;
    if (!service) {
      respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unknown environmentId"));
      return;
    }
    await respondWorkerMutation(
      respond,
      () => service.destroy(params.environmentId),
      ["environment_not_found", "invalid_state"],
      "worker environment destruction failed",
    );
  },
};
//#endregion
export { environmentsHandlers, summarizeWorkerEnvironment };
