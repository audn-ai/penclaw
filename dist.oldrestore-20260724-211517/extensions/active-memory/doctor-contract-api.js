import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { t as archiveLegacyStateSource } from "../../runtime-doctor-DOtJb07X.js";
//#region extensions/active-memory/doctor-contract-api.ts
/**
 * Doctor migration contract for Active Memory state. It moves legacy per-session
 * toggle JSON into the plugin state keyed store used by current runtimes.
 */
const TOGGLE_STATE_FILE = "session-toggles.json";
const SESSION_TOGGLES_NAMESPACE = "session-toggles";
const MAX_TOGGLE_ENTRIES = 1e4;
function resolveToggleStatePath(stateDir) {
  return path.join(stateDir, "plugins", "active-memory", TOGGLE_STATE_FILE);
}
function activeMemoryToggleKey(sessionKey) {
  return crypto.createHash("sha256").update(sessionKey, "utf8").digest("hex");
}
async function readLegacyToggleEntries(filePath) {
  try {
    const parsed = JSON.parse(await fs.readFile(filePath, "utf8"));
    if (!parsed || typeof parsed !== "object") return [];
    const sessions = parsed.sessions;
    if (!sessions || typeof sessions !== "object" || Array.isArray(sessions)) return [];
    const entries = [];
    for (const [sessionKey, value] of Object.entries(sessions)) {
      if (!sessionKey.trim() || !value || typeof value !== "object" || Array.isArray(value))
        continue;
      if (value.disabled !== true) continue;
      const updatedAt = typeof value.updatedAt === "number" ? value.updatedAt : Date.now();
      entries.push({
        sessionKey,
        disabled: true,
        updatedAt,
      });
    }
    return entries;
  } catch {
    return [];
  }
}
/** State migrations exposed to OpenClaw doctor for Active Memory. */
const stateMigrations = [
  {
    id: "active-memory-session-toggles-json-to-plugin-state",
    label: "Active Memory session toggles",
    async detectLegacyState(params) {
      const entries = await readLegacyToggleEntries(resolveToggleStatePath(params.stateDir));
      if (entries.length === 0) return null;
      return {
        preview: [
          `- Active Memory session toggles: ${entries.length} ${entries.length === 1 ? "entry" : "entries"} -> plugin state (${SESSION_TOGGLES_NAMESPACE})`,
        ],
      };
    },
    async migrateLegacyState(params) {
      const changes = [];
      const warnings = [];
      const filePath = resolveToggleStatePath(params.stateDir);
      const entries = await readLegacyToggleEntries(filePath);
      if (entries.length === 0)
        return {
          changes,
          warnings,
        };
      const store = params.context.openPluginStateKeyedStore({
        namespace: SESSION_TOGGLES_NAMESPACE,
        maxEntries: MAX_TOGGLE_ENTRIES,
      });
      const existingKeys = new Set((await store.entries()).map((entry) => entry.key));
      const missingEntries = entries.filter(
        (entry) => !existingKeys.has(activeMemoryToggleKey(entry.sessionKey)),
      );
      if (missingEntries.length > MAX_TOGGLE_ENTRIES - existingKeys.size) {
        warnings.push(
          `Skipped Active Memory session toggle migration because plugin state has room for ${MAX_TOGGLE_ENTRIES - existingKeys.size} of ${missingEntries.length} missing entries; left legacy source in place`,
        );
        return {
          changes,
          warnings,
        };
      }
      let imported = 0;
      for (const entry of entries) {
        const key = activeMemoryToggleKey(entry.sessionKey);
        if (existingKeys.has(key)) continue;
        await store.register(key, entry);
        existingKeys.add(key);
        imported++;
      }
      if (imported > 0)
        changes.push(
          `Migrated ${imported} Active Memory session toggle ${imported === 1 ? "entry" : "entries"} -> plugin state`,
        );
      await archiveLegacyStateSource({
        filePath,
        label: "Active Memory session toggles",
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
