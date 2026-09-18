import fs from "node:fs/promises";
import path from "node:path";
import { t as archiveLegacyStateSource } from "../../runtime-doctor-DOtJb07X.js";
import { t as normalizeNostrStateAccountId } from "../../state-account-id-CvBZ9s6P.js";
//#region extensions/nostr/doctor-contract-api.ts
const BUS_STATE_NAMESPACE = "bus-state";
const PROFILE_STATE_NAMESPACE = "profile-state";
const MAX_NOSTR_STATE_ENTRIES = 256;
function finiteNumberOrNull(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}
function parseBusState(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const parsed = value;
  if (parsed.version !== 1 && parsed.version !== 2) return null;
  return {
    version: 2,
    lastProcessedAt: finiteNumberOrNull(parsed.lastProcessedAt),
    gatewayStartedAt: finiteNumberOrNull(parsed.gatewayStartedAt),
    recentEventIds:
      parsed.version === 2 && Array.isArray(parsed.recentEventIds)
        ? parsed.recentEventIds.filter((entry) => typeof entry === "string")
        : [],
  };
}
function parseProfileState(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const parsed = value;
  if (parsed.version !== 1) return null;
  const rawResults = parsed.lastPublishResults;
  const lastPublishResults = {};
  if (rawResults && typeof rawResults === "object" && !Array.isArray(rawResults)) {
    for (const [relay, result] of Object.entries(rawResults))
      if (result === "ok" || result === "failed" || result === "timeout")
        lastPublishResults[relay] = result;
  }
  return {
    version: 1,
    lastPublishedAt: finiteNumberOrNull(parsed.lastPublishedAt),
    lastPublishedEventId:
      typeof parsed.lastPublishedEventId === "string" ? parsed.lastPublishedEventId : null,
    lastPublishResults:
      rawResults === null || Object.keys(lastPublishResults).length === 0
        ? null
        : lastPublishResults,
  };
}
async function readJsonFile(filePath) {
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}
async function listLegacyFiles(params) {
  const dir = path.join(params.stateDir, "nostr");
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const suffix = ".json";
  const files = [];
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.startsWith(params.prefix) || !entry.name.endsWith(suffix))
      continue;
    const accountId = normalizeNostrStateAccountId(entry.name.slice(params.prefix.length, -5));
    const filePath = path.join(dir, entry.name);
    try {
      const value = params.parse(await readJsonFile(filePath));
      if (value)
        files.push({
          accountId,
          filePath,
          value,
        });
    } catch {}
  }
  return files;
}
async function ensureStoreCapacity(params) {
  const existingKeys = new Set((await params.store.entries()).map((entry) => entry.key));
  const missingKeys = new Set(
    params.files.map((file) => file.accountId).filter((key) => !existingKeys.has(key)),
  );
  if (missingKeys.size > params.maxEntries - existingKeys.size) {
    params.warnings.push(
      `Skipped migrating ${params.label} because plugin state has room for ${params.maxEntries - existingKeys.size} of ${missingKeys.size} missing entries; left legacy sources in place`,
    );
    return null;
  }
  return existingKeys;
}
const stateMigrations = [
  {
    id: "nostr-bus-state-json-to-plugin-state",
    label: "Nostr bus state",
    async detectLegacyState(params) {
      const files = await listLegacyFiles({
        stateDir: params.stateDir,
        prefix: "bus-state-",
        parse: parseBusState,
      });
      if (files.length === 0) return null;
      return {
        preview: [
          `- Nostr bus state: ${files.length} ${files.length === 1 ? "account" : "accounts"} -> plugin state (${BUS_STATE_NAMESPACE})`,
        ],
      };
    },
    async migrateLegacyState(params) {
      const changes = [];
      const warnings = [];
      const files = await listLegacyFiles({
        stateDir: params.stateDir,
        prefix: "bus-state-",
        parse: parseBusState,
      });
      const store = params.context.openPluginStateKeyedStore({
        namespace: BUS_STATE_NAMESPACE,
        maxEntries: MAX_NOSTR_STATE_ENTRIES,
      });
      const existingKeys = await ensureStoreCapacity({
        files,
        store,
        maxEntries: MAX_NOSTR_STATE_ENTRIES,
        label: "Nostr bus state",
        warnings,
      });
      if (!existingKeys)
        return {
          changes,
          warnings,
        };
      let imported = 0;
      for (const file of files) {
        if (!existingKeys.has(file.accountId)) {
          await store.register(file.accountId, file.value);
          existingKeys.add(file.accountId);
          imported++;
        }
        await archiveLegacyStateSource({
          filePath: file.filePath,
          label: "Nostr bus state",
          changes,
          warnings,
        });
      }
      if (imported > 0)
        changes.unshift(
          `Migrated ${imported} Nostr bus-state ${imported === 1 ? "entry" : "entries"} -> plugin state`,
        );
      return {
        changes,
        warnings,
      };
    },
  },
  {
    id: "nostr-profile-state-json-to-plugin-state",
    label: "Nostr profile state",
    async detectLegacyState(params) {
      const files = await listLegacyFiles({
        stateDir: params.stateDir,
        prefix: "profile-state-",
        parse: parseProfileState,
      });
      if (files.length === 0) return null;
      return {
        preview: [
          `- Nostr profile state: ${files.length} ${files.length === 1 ? "account" : "accounts"} -> plugin state (${PROFILE_STATE_NAMESPACE})`,
        ],
      };
    },
    async migrateLegacyState(params) {
      const changes = [];
      const warnings = [];
      const files = await listLegacyFiles({
        stateDir: params.stateDir,
        prefix: "profile-state-",
        parse: parseProfileState,
      });
      const store = params.context.openPluginStateKeyedStore({
        namespace: PROFILE_STATE_NAMESPACE,
        maxEntries: MAX_NOSTR_STATE_ENTRIES,
      });
      const existingKeys = await ensureStoreCapacity({
        files,
        store,
        maxEntries: MAX_NOSTR_STATE_ENTRIES,
        label: "Nostr profile state",
        warnings,
      });
      if (!existingKeys)
        return {
          changes,
          warnings,
        };
      let imported = 0;
      for (const file of files) {
        if (!existingKeys.has(file.accountId)) {
          await store.register(file.accountId, file.value);
          existingKeys.add(file.accountId);
          imported++;
        }
        await archiveLegacyStateSource({
          filePath: file.filePath,
          label: "Nostr profile state",
          changes,
          warnings,
        });
      }
      if (imported > 0)
        changes.unshift(
          `Migrated ${imported} Nostr profile-state ${imported === 1 ? "entry" : "entries"} -> plugin state`,
        );
      return {
        changes,
        warnings,
      };
    },
  },
];
//#endregion
export { stateMigrations };
