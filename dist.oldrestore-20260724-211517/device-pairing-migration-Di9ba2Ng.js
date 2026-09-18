import fs from "node:fs/promises";
import path from "node:path";
import {
  f as coercePairingStateRecord,
  m as resolvePairingPaths,
} from "./device-bootstrap-km7Bg8Dl.js";
import { x as withPairedDeviceRecords } from "./device-pairing-BIH9-x3P.js";
import { a as readJsonIfExists } from "./json-files-CTWRDHag.js";
//#region src/infra/device-pairing-migration.ts
async function archiveLegacyFile(filePath) {
  try {
    await fs.rename(filePath, `${filePath}.migrated`);
  } catch {}
}
async function fileExists(filePath) {
  return await fs.access(filePath).then(
    () => true,
    () => false,
  );
}
/** List legacy devices/*.json files the startup import has not archived yet. */
async function listLegacyDevicePairingStoreFiles(baseDir) {
  const { dir, pendingPath, pairedPath } = resolvePairingPaths(baseDir, "devices");
  const candidates = [pairedPath, pendingPath, path.join(dir, "bootstrap.json")];
  const present = await Promise.all(candidates.map(fileExists));
  return candidates.filter((_, index) => present[index]);
}
/**
 * Import legacy devices/paired.json records into the SQLite pairing store,
 * then archive the legacy files. Existing SQLite records win over legacy rows
 * for the same device id. Idempotent: after the first run the files carry a
 * `.migrated` suffix and the function returns null immediately. Throws on an
 * unreadable paired.json so a failed import leaves the files for a retry
 * instead of silently dropping approved pairings.
 */
async function migrateLegacyDevicePairingStore(params) {
  const { dir, pendingPath, pairedPath } = resolvePairingPaths(params?.baseDir, "devices");
  const bootstrapPath = path.join(dir, "bootstrap.json");
  const pairedRaw = await readJsonIfExists(pairedPath);
  const hasTransientFiles = (await fileExists(pendingPath)) || (await fileExists(bootstrapPath));
  if (pairedRaw == null && !hasTransientFiles) return null;
  const legacyPaired = coercePairingStateRecord(pairedRaw);
  let imported = 0;
  let skippedExisting = 0;
  if (Object.keys(legacyPaired).length > 0)
    await withPairedDeviceRecords(params?.baseDir, (pairedByDeviceId) => {
      for (const [rawDeviceId, record] of Object.entries(legacyPaired)) {
        const deviceId = rawDeviceId.trim();
        if (!deviceId) continue;
        if (pairedByDeviceId[deviceId]) {
          skippedExisting += 1;
          continue;
        }
        pairedByDeviceId[deviceId] = {
          ...record,
          deviceId,
        };
        imported += 1;
      }
      return {
        value: void 0,
        persist: imported > 0,
      };
    });
  await Promise.all([
    archiveLegacyFile(pairedPath),
    archiveLegacyFile(pendingPath),
    archiveLegacyFile(bootstrapPath),
  ]);
  const result = {
    imported,
    skippedExisting,
  };
  params?.log?.info(
    `device pairing store migrated to SQLite: imported ${imported} paired device(s), kept ${skippedExisting} existing record(s)`,
  );
  return result;
}
//#endregion
export { listLegacyDevicePairingStoreFiles, migrateLegacyDevicePairingStore };
