import {
  n as resolveWorkboardSqlitePath,
  t as createWorkboardSqliteStores,
} from "../../sqlite-store-Csd4QS_7.js";
//#region extensions/workboard/doctor-contract-api.ts
const MAX_CARDS = 2e3;
function migrationEnv(params) {
  return {
    ...params.env,
    OPENCLAW_STATE_DIR: params.stateDir,
  };
}
function openLegacyStore(params) {
  return params.context.openPluginStateKeyedStore({
    namespace: params.namespace,
    maxEntries: params.maxEntries,
    env: params.env,
  });
}
function isPersistedCard(value) {
  return Boolean(value && typeof value === "object" && value.version === 1);
}
function isPersistedBoard(value) {
  return Boolean(value && typeof value === "object" && value.version === 1);
}
function isPersistedSubscription(value) {
  return Boolean(value && typeof value === "object" && value.version === 1);
}
function isPersistedAttachment(value) {
  if (!value || typeof value !== "object") return false;
  const candidate = value;
  const attachment = candidate.attachment;
  return (
    candidate.version === 1 &&
    attachment !== void 0 &&
    typeof attachment === "object" &&
    typeof attachment.id === "string" &&
    typeof attachment.cardId === "string" &&
    typeof attachment.fileName === "string" &&
    typeof attachment.byteSize === "number" &&
    typeof attachment.createdAt === "number" &&
    typeof candidate.contentBase64 === "string"
  );
}
async function migrateNamespace(params) {
  const warnings = [];
  let imported = 0;
  for (const entry of await params.legacy.entries()) {
    if (!params.isValid(entry.value)) {
      warnings.push(`Skipped malformed legacy Workboard ${params.label} entry ${entry.key}`);
      continue;
    }
    try {
      const targetEntry = await params.target.lookup(entry.key);
      if (targetEntry) {
        if (JSON.stringify(targetEntry) === JSON.stringify(entry.value)) {
          await params.legacy.delete(entry.key);
          imported++;
          continue;
        }
        warnings.push(
          `Skipped legacy Workboard ${params.label} entry ${entry.key} because the SQLite target already exists`,
        );
        continue;
      }
      await params.target.register(entry.key, entry.value);
      await params.legacy.delete(entry.key);
      imported++;
    } catch (err) {
      warnings.push(
        `Failed migrating legacy Workboard ${params.label} entry ${entry.key}: ${String(err)}`,
      );
    }
  }
  return {
    imported,
    warnings,
  };
}
async function targetCardReferencesAttachment(cards, attachment) {
  const card = await cards.lookup(attachment.attachment.cardId);
  return Boolean(
    card?.version === 1 &&
    card.card.metadata?.attachments?.some(
      (entry) =>
        entry.id === attachment.attachment.id && entry.cardId === attachment.attachment.cardId,
    ),
  );
}
async function migrateAttachments(params) {
  const warnings = [];
  let imported = 0;
  for (const entry of await params.legacy.entries()) {
    if (!isPersistedAttachment(entry.value)) {
      warnings.push(`Skipped malformed legacy Workboard attachment entry ${entry.key}`);
      continue;
    }
    if (!(await targetCardReferencesAttachment(params.cards, entry.value))) {
      warnings.push(
        `Skipped legacy Workboard attachment entry ${entry.key} because its owning card was not migrated or does not reference the attachment`,
      );
      continue;
    }
    const targetEntry = await params.target.lookup(entry.key);
    if (targetEntry) {
      if (JSON.stringify(targetEntry) === JSON.stringify(entry.value)) {
        await params.legacy.delete(entry.key);
        imported++;
        continue;
      }
      warnings.push(
        `Skipped legacy Workboard attachment entry ${entry.key} because the SQLite target already exists`,
      );
      continue;
    }
    try {
      await params.target.register(entry.key, entry.value);
      await params.legacy.delete(entry.key);
      imported++;
    } catch (err) {
      warnings.push(
        `Failed migrating legacy Workboard attachment entry ${entry.key}: ${String(err)}`,
      );
    }
  }
  return {
    imported,
    warnings,
  };
}
const stateMigrations = [
  {
    id: "workboard-28-kv-to-sqlite",
    label: "Workboard .28 plugin-state KV",
    async detectLegacyState(params) {
      const env = migrationEnv(params);
      const cards = await openLegacyStore({
        context: params.context,
        env,
        namespace: "workboard.cards",
        maxEntries: MAX_CARDS,
      }).entries();
      const boards = await openLegacyStore({
        context: params.context,
        env,
        namespace: "workboard.boards",
        maxEntries: 200,
      }).entries();
      const subscriptions = await openLegacyStore({
        context: params.context,
        env,
        namespace: "workboard.notify",
        maxEntries: 2e3,
      }).entries();
      const attachments = await openLegacyStore({
        context: params.context,
        env,
        namespace: "workboard.attachments",
        maxEntries: MAX_CARDS * 21,
      }).entries();
      const count = cards.length + boards.length + subscriptions.length + attachments.length;
      if (count === 0) return null;
      return {
        preview: [
          `- Workboard: ${count} legacy .28 plugin-state KV ${count === 1 ? "entry" : "entries"} → ${resolveWorkboardSqlitePath(env)}`,
        ],
      };
    },
    async migrateLegacyState(params) {
      const env = migrationEnv(params);
      const cards = openLegacyStore({
        context: params.context,
        env,
        namespace: "workboard.cards",
        maxEntries: MAX_CARDS,
      });
      const boards = openLegacyStore({
        context: params.context,
        env,
        namespace: "workboard.boards",
        maxEntries: 200,
      });
      const subscriptions = openLegacyStore({
        context: params.context,
        env,
        namespace: "workboard.notify",
        maxEntries: 2e3,
      });
      const attachments = openLegacyStore({
        context: params.context,
        env,
        namespace: "workboard.attachments",
        maxEntries: MAX_CARDS * 21,
      });
      const sqlite = createWorkboardSqliteStores({ env });
      try {
        const cardResult = await migrateNamespace({
          label: "card",
          legacy: cards,
          target: sqlite.cards,
          isValid: isPersistedCard,
        });
        const boardResult = await migrateNamespace({
          label: "board",
          legacy: boards,
          target: sqlite.boards,
          isValid: isPersistedBoard,
        });
        const subscriptionResult = await migrateNamespace({
          label: "notification subscription",
          legacy: subscriptions,
          target: sqlite.subscriptions,
          isValid: isPersistedSubscription,
        });
        const attachmentResult = await migrateAttachments({
          legacy: attachments,
          cards: sqlite.cards,
          target: sqlite.attachments,
        });
        const imported =
          cardResult.imported +
          boardResult.imported +
          subscriptionResult.imported +
          attachmentResult.imported;
        return {
          changes:
            imported > 0
              ? [
                  `Migrated ${imported} Workboard .28 plugin-state KV ${imported === 1 ? "entry" : "entries"} → relational SQLite`,
                ]
              : [],
          warnings: [
            ...cardResult.warnings,
            ...boardResult.warnings,
            ...subscriptionResult.warnings,
            ...attachmentResult.warnings,
          ],
        };
      } finally {
        sqlite.close();
      }
    },
  },
];
//#endregion
export { stateMigrations };
