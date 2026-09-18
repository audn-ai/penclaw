import "./openclaw-state-db-Bsa8Tv1Z.js";
import fs from "node:fs/promises";
import "./plugin-state-store-CdAHpy0G.js";
import "./dangerous-name-matching-Z6nhxFXz.js";
import "./uninstall-gwewgRmX.js";
import { r as normalizeLegacyDmAliases } from "./dm-access-Bq5cULcy.js";
//#region src/config/channel-compat-normalization.ts
/** Narrows unknown config JSON values to mutable object records. */
function asObjectRecord(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : null;
}
function parseAliasStreamingMode(value) {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase();
  return normalized === "off" ||
    normalized === "partial" ||
    normalized === "block" ||
    normalized === "progress"
    ? normalized
    : null;
}
/**
 * Doctor-only stream mode resolution across nested and legacy alias keys.
 *
 * Runtime helpers no longer read `streamMode`, so doctor contracts use this to
 * preserve legacy intent (nested mode > scalar string > streamMode > scalar
 * boolean) while migrating flat aliases into `streaming.mode`.
 */
function resolveLegacyAliasStreamingMode(entry, defaultMode) {
  const nestedMode = asObjectRecord(entry.streaming)?.mode;
  const parsed =
    parseAliasStreamingMode(nestedMode ?? entry.streaming) ??
    parseAliasStreamingMode(entry.streamMode);
  if (parsed) return parsed;
  if (typeof entry.streaming === "boolean") return entry.streaming ? "partial" : "off";
  return defaultMode;
}
/** Checks whether any account entry still carries a channel-specific legacy alias. */
function hasLegacyAccountStreamingAliases(value, match) {
  const accounts = asObjectRecord(value);
  if (!accounts) return false;
  return Object.values(accounts).some((account) => match(account));
}
function ensureNestedRecord(owner, key) {
  const existing = asObjectRecord(owner[key]);
  if (existing) return { ...existing };
  return {};
}
/**
 * Moves legacy flat streaming aliases into the nested `streaming` config shape.
 *
 * Existing nested values win over legacy aliases, matching doctor migration rules
 * that preserve explicit modern config while removing stale compatibility keys.
 */
function normalizeLegacyStreamingAliases(params) {
  const beforeStreaming = params.entry.streaming;
  const hadLegacyStreamMode = params.entry.streamMode !== void 0;
  const hasLegacyFlatFields =
    params.entry.chunkMode !== void 0 ||
    params.entry.blockStreaming !== void 0 ||
    params.entry.blockStreamingCoalesce !== void 0 ||
    (params.includePreviewChunk === true && params.entry.draftChunk !== void 0) ||
    params.entry.nativeStreaming !== void 0;
  if (
    !(
      hadLegacyStreamMode ||
      typeof beforeStreaming === "boolean" ||
      typeof beforeStreaming === "string" ||
      hasLegacyFlatFields
    )
  )
    return {
      entry: params.entry,
      changed: false,
    };
  const updated = { ...params.entry };
  let changed = false;
  const streaming = ensureNestedRecord(updated, "streaming");
  const block = ensureNestedRecord(streaming, "block");
  const preview = ensureNestedRecord(streaming, "preview");
  let movedStreamMode = false;
  if (
    (hadLegacyStreamMode ||
      typeof beforeStreaming === "boolean" ||
      typeof beforeStreaming === "string") &&
    streaming.mode === void 0
  ) {
    streaming.mode = params.resolvedMode;
    if (hadLegacyStreamMode) {
      movedStreamMode = true;
      params.changes.push(
        `Moved ${params.pathPrefix}.streamMode → ${params.pathPrefix}.streaming.mode (${params.resolvedMode}).`,
      );
    } else if (typeof beforeStreaming === "boolean")
      params.changes.push(
        `Moved ${params.pathPrefix}.streaming (boolean) → ${params.pathPrefix}.streaming.mode (${params.resolvedMode}).`,
      );
    else if (typeof beforeStreaming === "string")
      params.changes.push(
        `Moved ${params.pathPrefix}.streaming (scalar) → ${params.pathPrefix}.streaming.mode (${params.resolvedMode}).`,
      );
    changed = true;
  }
  if (hadLegacyStreamMode) {
    if (!movedStreamMode)
      params.changes.push(
        `Removed ${params.pathPrefix}.streamMode (${params.pathPrefix}.streaming.mode already set).`,
      );
    delete updated.streamMode;
    changed = true;
  }
  const moveOrRemoveAlias = (flatKey, target, slot, nestedPath) => {
    if (updated[flatKey] === void 0) return;
    const nested = `${params.pathPrefix}.streaming.${nestedPath}`;
    if (target[slot] === void 0) {
      target[slot] = updated[flatKey];
      params.changes.push(`Moved ${params.pathPrefix}.${flatKey} → ${nested}.`);
    } else params.changes.push(`Removed ${params.pathPrefix}.${flatKey} (${nested} already set).`);
    delete updated[flatKey];
    changed = true;
  };
  moveOrRemoveAlias("chunkMode", streaming, "chunkMode", "chunkMode");
  moveOrRemoveAlias("blockStreaming", block, "enabled", "block.enabled");
  if (params.includePreviewChunk === true)
    moveOrRemoveAlias("draftChunk", preview, "chunk", "preview.chunk");
  moveOrRemoveAlias("blockStreamingCoalesce", block, "coalesce", "block.coalesce");
  if (updated.nativeStreaming !== void 0 && params.resolvedNativeTransport !== void 0) {
    if (streaming.nativeTransport === void 0) {
      streaming.nativeTransport = params.resolvedNativeTransport;
      params.changes.push(
        `Moved ${params.pathPrefix}.nativeStreaming → ${params.pathPrefix}.streaming.nativeTransport.`,
      );
    } else
      params.changes.push(
        `Removed ${params.pathPrefix}.nativeStreaming (${params.pathPrefix}.streaming.nativeTransport already set).`,
      );
    delete updated.nativeStreaming;
    changed = true;
  } else if (
    typeof beforeStreaming === "boolean" &&
    streaming.nativeTransport === void 0 &&
    params.resolvedNativeTransport !== void 0
  ) {
    streaming.nativeTransport = params.resolvedNativeTransport;
    params.changes.push(
      `Moved ${params.pathPrefix}.streaming (boolean) → ${params.pathPrefix}.streaming.nativeTransport.`,
    );
    changed = true;
  }
  if (
    changed &&
    beforeStreaming === void 0 &&
    streaming.mode === void 0 &&
    params.aliasOnlyMode !== void 0
  ) {
    streaming.mode = params.aliasOnlyMode;
    params.changes.push(
      `Set ${params.pathPrefix}.streaming.mode (${params.aliasOnlyMode}) to keep the previous default while migrating flat streaming keys.`,
    );
    changed = true;
  }
  if (Object.keys(preview).length > 0) streaming.preview = preview;
  if (Object.keys(block).length > 0) streaming.block = block;
  updated.streaming = streaming;
  return {
    entry: updated,
    changed,
  };
}
/**
 * Root flat delivery aliases resolved per-key for every account (nested-first,
 * flat-fallback), even when the account carried its own `streaming` value that
 * replaces the root object wholesale at merge time. Capture them before root
 * migration so replace-semantics channels can seed existing account streaming
 * objects with the delivery settings those accounts previously inherited.
 */
function buildRootFlatDeliverySeed(entry, includePreviewChunk) {
  const seed = {};
  if (entry.chunkMode !== void 0) seed.chunkMode = entry.chunkMode;
  const block = {};
  if (entry.blockStreaming !== void 0) block.enabled = entry.blockStreaming;
  if (entry.blockStreamingCoalesce !== void 0) block.coalesce = entry.blockStreamingCoalesce;
  if (Object.keys(block).length > 0) seed.block = block;
  if (includePreviewChunk === true && entry.draftChunk !== void 0)
    seed.preview = { chunk: entry.draftChunk };
  return Object.keys(seed).length > 0 ? seed : null;
}
/**
 * Rebuilds a materialized account streaming object with the per-slot
 * precedence the runtime resolvers applied pre-migration. The slots disagree:
 * - mode, block.enabled, preview.chunk resolve on the MERGED entry
 *   (src/channels/streaming.ts nested-first), so the root nested object
 *   outranked account flat aliases and preview.chunk picks atomically.
 * - chunkMode resolves the raw account entry before the root entry
 *   (resolveChunkModeForProvider in src/auto-reply/chunk.ts), so an account
 *   flat chunkMode outranked every root spelling.
 * - block.coalesce merges the account pick over the root pick per field
 *   (resolveProviderBlockStreamingCoalesce in
 *   src/auto-reply/reply/block-streaming.ts).
 * One generic deep-fill cannot express that ladder, so seed slot by slot.
 * Copying root values freezes inheritance at fix time by design (the change
 * message records it); merged-entry channels (mattermost-style resolved
 * accounts) would otherwise lose the root values entirely once the account
 * owns a streaming object.
 */
function seedMaterializedAccountStreaming(params) {
  const { created } = params;
  const rootNested = params.rootNestedBefore ?? {};
  const rootFlat = params.rootFlat ?? {};
  let seeded = fillMissingRecordFields(structuredClone(rootNested), created).value;
  seeded = fillMissingRecordFields(seeded, rootFlat).value;
  seeded = fillMissingRecordFields(seeded, params.rootAfter).value;
  if (created.chunkMode !== void 0)
    seeded = {
      ...seeded,
      chunkMode: created.chunkMode,
    };
  const createdCoalesce = asObjectRecord(asObjectRecord(created.block)?.coalesce);
  if (createdCoalesce) {
    const rootCoalesce =
      asObjectRecord(asObjectRecord(rootNested.block)?.coalesce) ??
      asObjectRecord(asObjectRecord(rootFlat.block)?.coalesce);
    seeded = {
      ...seeded,
      block: {
        ...asObjectRecord(seeded.block),
        coalesce: {
          ...structuredClone(rootCoalesce ?? {}),
          ...structuredClone(createdCoalesce),
        },
      },
    };
  }
  const rootNestedPreviewChunk = asObjectRecord(rootNested.preview)?.chunk;
  if (rootNestedPreviewChunk !== void 0 && asObjectRecord(created.preview)?.chunk !== void 0)
    seeded = {
      ...seeded,
      preview: {
        ...asObjectRecord(seeded.preview),
        chunk: structuredClone(rootNestedPreviewChunk),
      },
    };
  return seeded;
}
/** Deep-fills record fields missing from target with copies of source values. */
function fillMissingRecordFields(target, source) {
  let filled = false;
  const value = { ...target };
  for (const [key, sourceValue] of Object.entries(source)) {
    if (sourceValue === void 0) continue;
    const existing = value[key];
    if (existing === void 0) {
      value[key] = structuredClone(sourceValue);
      filled = true;
      continue;
    }
    const existingRecord = asObjectRecord(existing);
    const sourceRecord = asObjectRecord(sourceValue);
    if (!existingRecord || !sourceRecord) continue;
    const merged = fillMissingRecordFields(existingRecord, sourceRecord);
    if (merged.filled) {
      value[key] = merged.value;
      filled = true;
    }
  }
  return {
    value,
    filled,
  };
}
/**
 * Runs generic channel doctor alias migration for the root entry and accounts.
 *
 * Channel plugins provide streaming resolution and optional account-specific
 * migrations so core can keep one compatibility path for all channel shapes.
 */
function normalizeLegacyChannelAliases(params) {
  let updated = params.entry;
  let changed = false;
  const rootFlatDeliverySeed =
    params.seedAccountStreamingFromRoot === true
      ? buildRootFlatDeliverySeed(
          params.entry,
          params.resolveStreamingOptions(params.entry).includePreviewChunk,
        )
      : null;
  const rootNestedStreamingBefore =
    params.seedAccountStreamingFromRoot === true ? asObjectRecord(params.entry.streaming) : null;
  if (params.normalizeDm === true) {
    const dm = normalizeLegacyDmAliases({
      entry: updated,
      pathPrefix: params.pathPrefix,
      changes: params.changes,
      promoteAllowFrom: params.rootDmPromoteAllowFrom,
    });
    updated = dm.entry;
    changed = dm.changed;
  }
  const streaming = normalizeLegacyStreamingAliases({
    entry: updated,
    pathPrefix: params.pathPrefix,
    changes: params.changes,
    ...params.resolveStreamingOptions(updated),
  });
  updated = streaming.entry;
  changed = changed || streaming.changed;
  const rawAccounts = asObjectRecord(updated.accounts);
  if (!rawAccounts)
    return {
      entry: updated,
      changed,
    };
  const rootStreaming = asObjectRecord(updated.streaming);
  let accountsChanged = false;
  const accounts = { ...rawAccounts };
  for (const [accountId, rawAccount] of Object.entries(rawAccounts)) {
    const account = asObjectRecord(rawAccount);
    if (!account) continue;
    let accountEntry = account;
    let accountChanged = false;
    const accountPathPrefix = `${params.pathPrefix}.accounts.${accountId}`;
    if (params.normalizeAccountDm === true) {
      const accountDm = normalizeLegacyDmAliases({
        entry: accountEntry,
        pathPrefix: accountPathPrefix,
        changes: params.changes,
      });
      accountEntry = accountDm.entry;
      accountChanged = accountDm.changed;
    }
    const accountStreamingOptions = { ...params.resolveStreamingOptions(accountEntry) };
    if (rootStreaming) delete accountStreamingOptions.aliasOnlyMode;
    const beforeAccountStreaming = accountEntry.streaming;
    const accountStreaming = normalizeLegacyStreamingAliases({
      entry: accountEntry,
      pathPrefix: accountPathPrefix,
      changes: params.changes,
      ...accountStreamingOptions,
    });
    accountEntry = accountStreaming.entry;
    accountChanged = accountChanged || accountStreaming.changed;
    if (
      params.seedAccountStreamingFromRoot === true &&
      accountStreaming.changed &&
      beforeAccountStreaming === void 0 &&
      rootStreaming
    ) {
      const created = asObjectRecord(accountEntry.streaming);
      if (created) {
        const seeded = seedMaterializedAccountStreaming({
          created,
          rootNestedBefore: rootNestedStreamingBefore,
          rootFlat: rootFlatDeliverySeed,
          rootAfter: rootStreaming,
        });
        if (JSON.stringify(seeded) !== JSON.stringify(created)) {
          accountEntry = {
            ...accountEntry,
            streaming: seeded,
          };
          params.changes.push(
            `Copied ${params.pathPrefix}.streaming into ${accountPathPrefix}.streaming to keep inherited settings while migrating flat streaming keys.`,
          );
        }
      }
    } else if (rootFlatDeliverySeed && beforeAccountStreaming !== void 0) {
      const accountStreamingObject = asObjectRecord(accountEntry.streaming);
      if (accountStreamingObject) {
        let seededAccount = accountStreamingObject;
        if (rootFlatDeliverySeed.chunkMode !== void 0 && seededAccount.chunkMode === void 0)
          seededAccount = {
            ...seededAccount,
            chunkMode: rootFlatDeliverySeed.chunkMode,
          };
        const rootFlatBlock = asObjectRecord(rootFlatDeliverySeed.block);
        const rootFlatBlockEnabled = rootFlatBlock?.enabled;
        if (
          rootFlatBlockEnabled !== void 0 &&
          asObjectRecord(seededAccount.block)?.enabled === void 0
        )
          seededAccount = {
            ...seededAccount,
            block: {
              ...asObjectRecord(seededAccount.block),
              enabled: rootFlatBlockEnabled,
            },
          };
        const rootFlatCoalesce = asObjectRecord(rootFlatBlock?.coalesce);
        if (rootFlatCoalesce) {
          const accountCoalesce = asObjectRecord(asObjectRecord(seededAccount.block)?.coalesce);
          const mergedCoalesce = {
            ...structuredClone(rootFlatCoalesce),
            ...structuredClone(accountCoalesce ?? {}),
          };
          if (JSON.stringify(mergedCoalesce) !== JSON.stringify(accountCoalesce ?? {}))
            seededAccount = {
              ...seededAccount,
              block: {
                ...asObjectRecord(seededAccount.block),
                coalesce: mergedCoalesce,
              },
            };
        }
        const rootFlatPreviewChunk = asObjectRecord(rootFlatDeliverySeed.preview)?.chunk;
        if (
          rootFlatPreviewChunk !== void 0 &&
          asObjectRecord(seededAccount.preview)?.chunk === void 0
        )
          seededAccount = {
            ...seededAccount,
            preview: {
              ...asObjectRecord(seededAccount.preview),
              chunk: structuredClone(rootFlatPreviewChunk),
            },
          };
        if (seededAccount !== accountStreamingObject) {
          accountEntry = {
            ...accountEntry,
            streaming: seededAccount,
          };
          accountChanged = true;
          params.changes.push(
            `Copied flat ${params.pathPrefix} delivery keys into ${accountPathPrefix}.streaming to keep inherited settings while migrating flat streaming keys.`,
          );
        }
      }
    }
    const accountExtra = params.normalizeAccountExtra?.({
      account: accountEntry,
      accountId,
      pathPrefix: accountPathPrefix,
      changes: params.changes,
    });
    if (accountExtra) {
      accountEntry = accountExtra.entry;
      accountChanged = accountChanged || accountExtra.changed;
    }
    if (accountChanged) {
      accounts[accountId] = accountEntry;
      accountsChanged = true;
    }
  }
  if (accountsChanged) {
    updated = {
      ...updated,
      accounts,
    };
    changed = true;
  }
  return {
    entry: updated,
    changed,
  };
}
/** Detects legacy streaming aliases on one channel or account config entry. */
function hasLegacyStreamingAliases(value, options) {
  const entry = asObjectRecord(value);
  if (!entry) return false;
  return (
    entry.streamMode !== void 0 ||
    typeof entry.streaming === "boolean" ||
    typeof entry.streaming === "string" ||
    entry.chunkMode !== void 0 ||
    entry.blockStreaming !== void 0 ||
    entry.blockStreamingCoalesce !== void 0 ||
    (options?.includePreviewChunk === true && entry.draftChunk !== void 0) ||
    (options?.includeNativeTransport === true && entry.nativeStreaming !== void 0)
  );
}
//#endregion
//#region src/config/channel-alias-migration.ts
function buildAliasRuleMessage(params) {
  const { streaming, prefix } = params;
  const native = streaming.resolveNativeTransport !== void 0;
  const flat = [
    ...(streaming.deliveryOnly ? [] : ["streamMode", "streaming (scalar)"]),
    "chunkMode",
    "blockStreaming",
    ...(streaming.includePreviewChunk ? ["draftChunk"] : []),
    "blockStreamingCoalesce",
    ...(native ? ["nativeStreaming"] : []),
  ];
  const nested = [
    ...(streaming.deliveryOnly ? [] : ["mode"]),
    "chunkMode",
    ...(streaming.includePreviewChunk ? ["preview.chunk"] : []),
    "block.enabled",
    "block.coalesce",
    ...(native ? ["nativeTransport"] : []),
  ];
  const prefixedCount = params.root && !streaming.deliveryOnly ? 2 : 1;
  const keys = flat.map((key, index) => (index < prefixedCount ? `${prefix}.${key}` : key));
  return `${`${keys.slice(0, -1).join(", ")}, and ${keys.at(-1)}`} are legacy; use ${prefix}.streaming.{${nested.join(",")}}. Run "openclaw doctor --fix".`;
}
/**
 * Builds the standard channel doctor alias-migration surface from a small spec:
 * detection rules (root + accounts), the per-entry matcher, and the config
 * normalizer. Channels with additional migrations compose around these pieces.
 */
function defineChannelAliasMigration(spec) {
  const { streaming } = spec;
  const pathPrefix = `channels.${spec.channelId}`;
  const hasLegacyAliases = (value) => {
    if (streaming.deliveryOnly === true) {
      const entry = asObjectRecord(value);
      return (
        entry !== null &&
        (entry.chunkMode !== void 0 ||
          entry.blockStreaming !== void 0 ||
          entry.blockStreamingCoalesce !== void 0)
      );
    }
    return hasLegacyStreamingAliases(value, {
      includePreviewChunk: streaming.includePreviewChunk,
      includeNativeTransport: streaming.resolveNativeTransport !== void 0,
    });
  };
  const resolveStreamingOptions = (entry) => ({
    resolvedMode:
      streaming.resolveMode?.(entry) ??
      resolveLegacyAliasStreamingMode(entry, streaming.defaultMode),
    aliasOnlyMode: streaming.absentObjectDefault,
    includePreviewChunk: streaming.includePreviewChunk,
    resolvedNativeTransport: streaming.resolveNativeTransport?.(entry),
  });
  const normalizeChannelConfig = (params) => {
    const changes = params.changes ?? [];
    const channels = params.cfg.channels;
    const entry = asObjectRecord(channels?.[spec.channelId]);
    if (!entry)
      return {
        config: params.cfg,
        changes,
      };
    if (
      streaming.deliveryOnly === true &&
      !hasLegacyAliases(entry) &&
      !hasLegacyAccountStreamingAliases(entry.accounts, hasLegacyAliases)
    )
      return {
        config: params.cfg,
        changes,
      };
    const result = normalizeLegacyChannelAliases({
      entry,
      pathPrefix,
      changes,
      normalizeDm: spec.dm?.root,
      rootDmPromoteAllowFrom: spec.dm?.rootPromoteAllowFrom,
      normalizeAccountDm: spec.dm?.accounts,
      seedAccountStreamingFromRoot: spec.accountStreamingReplacesRoot,
      resolveStreamingOptions,
      normalizeAccountExtra: spec.normalizeAccountExtra,
    });
    if (!result.changed)
      return {
        config: params.cfg,
        changes,
      };
    return {
      config: {
        ...params.cfg,
        channels: {
          ...channels,
          [spec.channelId]: result.entry,
        },
      },
      changes,
    };
  };
  return {
    legacyConfigRules: [
      {
        path: ["channels", spec.channelId],
        message: buildAliasRuleMessage({
          streaming,
          prefix: pathPrefix,
          root: true,
        }),
        match: hasLegacyAliases,
      },
      {
        path: ["channels", spec.channelId, "accounts"],
        message: buildAliasRuleMessage({
          streaming,
          prefix: `${pathPrefix}.accounts.<id>`,
          root: false,
        }),
        match: (value) => hasLegacyAccountStreamingAliases(value, hasLegacyAliases),
      },
    ],
    hasLegacyAliases,
    normalizeChannelConfig,
  };
}
//#endregion
//#region src/plugins/doctor-state-migration-fs.ts
/** True when the legacy-state path exists and is a regular file. */
async function legacyStateFileExists(filePath) {
  try {
    return (await fs.stat(filePath)).isFile();
  } catch {
    return false;
  }
}
/**
 * Renames a migrated legacy source to `<path>.migrated`, recording the outcome in the
 * doctor changes/warnings lists. Never throws: a failed archive leaves the source in
 * place so a later doctor run can retry without losing migrated data.
 */
async function archiveLegacyStateSource(params) {
  const archivedPath = `${params.filePath}.migrated`;
  try {
    if (await legacyStateFileExists(archivedPath)) {
      const [sourceBytes, archiveBytes] = await Promise.all([
        fs.readFile(params.filePath),
        fs.readFile(archivedPath),
      ]);
      if (sourceBytes.equals(archiveBytes)) {
        await fs.rm(params.filePath, { force: true });
        params.changes.push(
          `Removed already-archived ${params.label} legacy source ${params.filePath}`,
        );
        return;
      }
      const nextArchivePath = await firstFreeArchivePath(params.filePath);
      await fs.rename(params.filePath, nextArchivePath);
      params.changes.push(`Archived ${params.label} legacy source -> ${nextArchivePath}`);
      return;
    }
    await fs.rename(params.filePath, archivedPath);
    params.changes.push(`Archived ${params.label} legacy source -> ${archivedPath}`);
  } catch (err) {
    params.warnings.push(`Failed archiving ${params.label} legacy source: ${String(err)}`);
  }
}
async function firstFreeArchivePath(sourcePath) {
  for (let index = 2; ; index++) {
    const candidate = `${sourcePath}.migrated.${index}`;
    if (!(await legacyStateFileExists(candidate))) return candidate;
  }
}
//#endregion
export {
  hasLegacyAccountStreamingAliases as a,
  normalizeLegacyStreamingAliases as c,
  asObjectRecord as i,
  resolveLegacyAliasStreamingMode as l,
  legacyStateFileExists as n,
  hasLegacyStreamingAliases as o,
  defineChannelAliasMigration as r,
  normalizeLegacyChannelAliases as s,
  archiveLegacyStateSource as t,
};
