import { createHash, randomUUID } from "node:crypto";
//#region extensions/acpx/src/state.ts
const ACPX_PROCESS_LEASE_NAMESPACE = "process-leases";
const ACPX_PROCESS_LEASE_MAX_ENTRIES = 4096;
const ACPX_LEGACY_PROCESS_LEASE_FILE = "process-leases.json";
const ACPX_GATEWAY_INSTANCE_NAMESPACE = "gateway-instance";
const ACPX_GATEWAY_INSTANCE_KEY = "current";
const ACPX_LEGACY_GATEWAY_INSTANCE_FILE = "gateway-instance-id";
function normalizeAcpxGatewayInstanceRecord(value) {
  if (typeof value !== "object" || value === null) return;
  const record = value;
  if (typeof record.instanceId !== "string" || !record.instanceId.trim()) return;
  const createdAt =
    typeof record.createdAt === "number" && Number.isFinite(record.createdAt)
      ? Math.trunc(record.createdAt)
      : 0;
  return {
    instanceId: record.instanceId.trim(),
    createdAt,
  };
}
//#endregion
//#region extensions/acpx/src/process-lease.ts
/**
 * Persistent lease store for ACPX wrapper processes. Leases let OpenClaw attach
 * gateway/session identity to spawned ACP processes and clean them up later.
 */
/** Environment variable carrying the ACPX process lease id. */
const OPENCLAW_ACPX_LEASE_ID_ENV = "OPENCLAW_ACPX_LEASE_ID";
/** Environment variable carrying the owning gateway instance id. */
const OPENCLAW_GATEWAY_INSTANCE_ID_ENV = "OPENCLAW_GATEWAY_INSTANCE_ID";
/** CLI argument carrying the ACPX process lease id for platforms without env wrapping. */
const OPENCLAW_ACPX_LEASE_ID_ARG = "--openclaw-acpx-lease-id";
/** CLI argument carrying the owning gateway instance id. */
const OPENCLAW_GATEWAY_INSTANCE_ID_ARG = "--openclaw-gateway-instance-id";
function normalizeAcpxProcessLease(value) {
  if (typeof value !== "object" || value === null) return;
  const record = value;
  if (
    typeof record.leaseId !== "string" ||
    typeof record.gatewayInstanceId !== "string" ||
    typeof record.sessionKey !== "string" ||
    typeof record.wrapperRoot !== "string" ||
    typeof record.wrapperPath !== "string" ||
    typeof record.rootPid !== "number" ||
    typeof record.commandHash !== "string" ||
    typeof record.startedAt !== "number" ||
    !["open", "closing", "closed", "lost"].includes(String(record.state))
  )
    return;
  return {
    leaseId: record.leaseId,
    gatewayInstanceId: record.gatewayInstanceId,
    sessionKey: record.sessionKey,
    wrapperRoot: record.wrapperRoot,
    wrapperPath: record.wrapperPath,
    rootPid: record.rootPid,
    ...(typeof record.processGroupId === "number" ? { processGroupId: record.processGroupId } : {}),
    commandHash: record.commandHash,
    startedAt: record.startedAt,
    state: record.state,
  };
}
function normalizeAcpxProcessLeaseFile(value) {
  const root = typeof value === "object" && value !== null ? value : {};
  return {
    version: 1,
    leases: Array.isArray(root.leases)
      ? root.leases.map(normalizeAcpxProcessLease).filter((lease) => Boolean(lease))
      : [],
  };
}
function openAcpxProcessLeaseStateStore(openKeyedStore) {
  return openKeyedStore({
    namespace: ACPX_PROCESS_LEASE_NAMESPACE,
    maxEntries: ACPX_PROCESS_LEASE_MAX_ENTRIES,
  });
}
/** Create a serialized SQLite-backed ACPX process lease store. */
function createAcpxProcessLeaseStore(params) {
  let updateQueue = Promise.resolve();
  async function update(mutator) {
    const run = updateQueue.then(async () => {
      await mutator();
    });
    updateQueue = run.catch(() => {});
    await run;
  }
  async function readCurrent() {
    await updateQueue;
    return (await params.store.entries())
      .map((entry) => normalizeAcpxProcessLease(entry.value))
      .filter((lease) => Boolean(lease));
  }
  return {
    async load(leaseId) {
      await updateQueue;
      return normalizeAcpxProcessLease(await params.store.lookup(leaseId));
    },
    async listOpen(gatewayInstanceId) {
      return (await readCurrent()).filter(
        (lease) =>
          (lease.state === "open" || lease.state === "closing") &&
          (!gatewayInstanceId || lease.gatewayInstanceId === gatewayInstanceId),
      );
    },
    async save(lease) {
      await update(async () => {
        await params.store.register(lease.leaseId, lease);
      });
    },
    async markState(leaseId, state) {
      await update(async () => {
        if (state === "closed" || state === "lost") {
          await params.store.delete(leaseId);
          return;
        }
        const lease = normalizeAcpxProcessLease(await params.store.lookup(leaseId));
        if (lease)
          await params.store.register(leaseId, {
            ...lease,
            state,
          });
      });
    },
  };
}
/** Create a unique lease id for one ACPX wrapper process. */
function createAcpxProcessLeaseId() {
  return randomUUID();
}
/** Hash a wrapper command so process leases can detect command drift. */
function hashAcpxProcessCommand(command) {
  return createHash("sha256").update(command).digest("hex");
}
function quoteEnvValue(value) {
  return /^[A-Za-z0-9_./:=@+-]+$/.test(value) ? value : `'${value.replace(/'/g, "'\\''")}'`;
}
function appendAcpxLeaseArgs(params) {
  return [
    params.command,
    OPENCLAW_ACPX_LEASE_ID_ARG,
    quoteEnvValue(params.leaseId),
    OPENCLAW_GATEWAY_INSTANCE_ID_ARG,
    quoteEnvValue(params.gatewayInstanceId),
  ].join(" ");
}
/** Add ACPX lease identity to a command through env vars and portable args. */
function withAcpxLeaseEnvironment(params) {
  if ((params.platform ?? process.platform) === "win32") return appendAcpxLeaseArgs(params);
  return [
    "env",
    `${OPENCLAW_ACPX_LEASE_ID_ENV}=${quoteEnvValue(params.leaseId)}`,
    `${OPENCLAW_GATEWAY_INSTANCE_ID_ENV}=${quoteEnvValue(params.gatewayInstanceId)}`,
    appendAcpxLeaseArgs(params),
  ].join(" ");
}
//#endregion
export {
  createAcpxProcessLeaseStore as a,
  normalizeAcpxProcessLeaseFile as c,
  ACPX_GATEWAY_INSTANCE_KEY as d,
  ACPX_GATEWAY_INSTANCE_NAMESPACE as f,
  normalizeAcpxGatewayInstanceRecord as h,
  createAcpxProcessLeaseId as i,
  openAcpxProcessLeaseStateStore as l,
  ACPX_LEGACY_PROCESS_LEASE_FILE as m,
  OPENCLAW_ACPX_LEASE_ID_ENV as n,
  hashAcpxProcessCommand as o,
  ACPX_LEGACY_GATEWAY_INSTANCE_FILE as p,
  OPENCLAW_GATEWAY_INSTANCE_ID_ARG as r,
  normalizeAcpxProcessLease as s,
  OPENCLAW_ACPX_LEASE_ID_ARG as t,
  withAcpxLeaseEnvironment as u,
};
