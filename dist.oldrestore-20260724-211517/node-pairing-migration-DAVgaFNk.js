import fs from "node:fs/promises";
import {
  f as coercePairingStateRecord,
  m as resolvePairingPaths,
} from "./device-bootstrap-km7Bg8Dl.js";
import {
  c as listApprovedPairedDeviceRoles,
  x as withPairedDeviceRecords,
} from "./device-pairing-BIH9-x3P.js";
import { a as readJsonIfExists } from "./json-files-CTWRDHag.js";
//#region src/infra/node-pairing-migration.ts
async function archiveLegacyFile(path) {
  try {
    await fs.rename(path, `${path}.migrated`);
  } catch {}
}
/**
 * Fold legacy nodes/paired.json rows into device-record node surfaces, then
 * archive the legacy files. Idempotent: after the first run the files carry a
 * `.migrated` suffix and the function returns null immediately.
 */
async function migrateLegacyNodePairingStore(params) {
  const { pendingPath, pairedPath } = resolvePairingPaths(params?.baseDir, "nodes");
  const [pairedRaw, pendingRaw] = await Promise.all([
    readJsonIfExists(pairedPath),
    readJsonIfExists(pendingPath),
  ]);
  if (pairedRaw == null && pendingRaw == null) return null;
  const legacyRows = coercePairingStateRecord(pairedRaw);
  let migrated = 0;
  let orphaned = 0;
  if (Object.keys(legacyRows).length > 0)
    await withPairedDeviceRecords(params?.baseDir, (pairedByDeviceId) => {
      const now = Date.now();
      for (const [rawNodeId, row] of Object.entries(legacyRows)) {
        const device = pairedByDeviceId[rawNodeId.trim()];
        if (!device || !listApprovedPairedDeviceRoles(device).includes("node")) {
          orphaned += 1;
          continue;
        }
        if (device.nodeSurface) continue;
        device.nodeSurface = {
          displayName: row.displayName,
          version: row.version,
          coreVersion: row.coreVersion,
          uiVersion: row.uiVersion,
          modelIdentifier: row.modelIdentifier,
          caps: Array.isArray(row.caps) ? row.caps : void 0,
          commands: Array.isArray(row.commands) ? row.commands : void 0,
          permissions: row.permissions,
          bins: Array.isArray(row.bins) ? row.bins : void 0,
          createdAtMs: typeof row.createdAtMs === "number" ? row.createdAtMs : now,
          approvedAtMs: typeof row.approvedAtMs === "number" ? row.approvedAtMs : now,
          lastConnectedAtMs:
            typeof row.lastConnectedAtMs === "number" ? row.lastConnectedAtMs : void 0,
        };
        migrated += 1;
      }
      return {
        value: void 0,
        persist: migrated > 0,
      };
    });
  await Promise.all([archiveLegacyFile(pairedPath), archiveLegacyFile(pendingPath)]);
  const result = {
    migrated,
    orphaned,
  };
  params?.log?.info(
    `node pairing store migrated: folded ${migrated} node surface(s) into device records, dropped ${orphaned} orphan row(s)`,
  );
  return result;
}
//#endregion
export { migrateLegacyNodePairingStore };
