import fs from "node:fs/promises";
import path from "node:path";
import {
  a as DEVICE_PAIR_NOTIFY_SUBSCRIBER_MAX_ENTRIES,
  o as DEVICE_PAIR_NOTIFY_SUBSCRIBER_NAMESPACE,
  s as normalizeLegacyNotifyState,
  t as DEVICE_PAIR_NOTIFY_LEGACY_STATE_FILE,
  u as notifySubscriberStoreKey,
} from "../../notify-state-CtVEoKyd.js";
import { t as archiveLegacyStateSource } from "../../runtime-doctor-DOtJb07X.js";
//#region extensions/device-pair/doctor-contract-api.ts
function resolveLegacyNotifyStatePath(stateDir) {
  return path.join(stateDir, DEVICE_PAIR_NOTIFY_LEGACY_STATE_FILE);
}
async function readLegacyNotifyState(filePath) {
  try {
    return normalizeLegacyNotifyState(JSON.parse(await fs.readFile(filePath, "utf8")));
  } catch {
    return null;
  }
}
const stateMigrations = [
  {
    id: "device-pair-notify-json-to-plugin-state",
    label: "Device Pair notify subscribers",
    async detectLegacyState(params) {
      const filePath = resolveLegacyNotifyStatePath(params.stateDir);
      const state = await readLegacyNotifyState(filePath);
      if (!state || state.subscribers.length === 0) return null;
      return {
        preview: [
          `- Device Pair notify subscribers: ${filePath} -> plugin state (${DEVICE_PAIR_NOTIFY_SUBSCRIBER_NAMESPACE}, ${state.subscribers.length} subscriber(s))`,
        ],
      };
    },
    async migrateLegacyState(params) {
      const changes = [];
      const warnings = [];
      const filePath = resolveLegacyNotifyStatePath(params.stateDir);
      const state = await readLegacyNotifyState(filePath);
      if (!state || state.subscribers.length === 0)
        return {
          changes,
          warnings,
        };
      const store = params.context.openPluginStateKeyedStore({
        namespace: DEVICE_PAIR_NOTIFY_SUBSCRIBER_NAMESPACE,
        maxEntries: DEVICE_PAIR_NOTIFY_SUBSCRIBER_MAX_ENTRIES,
      });
      let imported = 0;
      let alreadyPresent = 0;
      for (const subscriber of state.subscribers)
        if (await store.registerIfAbsent(notifySubscriberStoreKey(subscriber), subscriber))
          imported++;
        else alreadyPresent++;
      changes.push(
        `Migrated Device Pair notify subscribers -> plugin state (${imported} imported, ${alreadyPresent} already present)`,
      );
      await archiveLegacyStateSource({
        filePath,
        label: "Device Pair notify-state",
        changes,
        warnings,
      });
      return {
        changes,
        warnings,
      };
    },
  },
];
//#endregion
export { stateMigrations };
