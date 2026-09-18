import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  n as resolveDefaultTelegramAccountId,
  t as listTelegramAccountIds,
} from "./account-selection-BgoQbn1V.js";
import { t as normalizeTelegramBotInfo } from "./bot-info-BabEIyfI.js";
import "./security-runtime-CraX8Pqe.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import { n as readJsonFileWithFallback } from "./json-store-CSxUwOCu.js";
import {
  a as TELEGRAM_MESSAGE_DISPATCH_DEDUPE_TTL_MS,
  f as resolveTelegramMessageDispatchLegacyPath,
  i as TELEGRAM_MESSAGE_DISPATCH_DEDUPE_STATE_PLUGIN_ID,
  n as TELEGRAM_MESSAGE_DISPATCH_DEDUPE_NAMESPACE_PREFIX,
  o as buildTelegramMessageDispatchAccountReplayKey,
  r as TELEGRAM_MESSAGE_DISPATCH_DEDUPE_STATE_MAX_ENTRIES,
  t as TELEGRAM_MESSAGE_DISPATCH_DEDUPE_NAMESPACE,
} from "./message-dispatch-dedupe-BKHh8TWv.js";
import { y as resolveStateDir } from "./paths-DEklnbzU.js";
import "./runtime-doctor-DOtJb07X.js";
import {
  i as listPersistentDedupeLegacyJsonFileEntries,
  o as resolvePersistentDedupePluginStateNamespace,
  r as createPersistentDedupeImportEntry,
  s as shouldReplacePersistentDedupeEntry,
} from "./persistent-dedupe-CMTHL22F.js";
import { r as createPluginStateSyncKeyedStore } from "./plugin-state-store-CdAHpy0G.js";
import "./state-paths-DU65nx5N.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { s as statRegularFileSync } from "./regular-file-CuvhUtZS.js";
import { n as getTelegramRuntime } from "./runtime-B_f_VNpK.js";
import {
  d as isTelegramMessageCacheSourceMessage,
  h as resolveTelegramMessageCachePersistentScopeKey,
  m as resolveTelegramMessageCachePath,
  n as TELEGRAM_SENT_MESSAGE_CACHE_NAMESPACE,
  o as TELEGRAM_MESSAGE_CACHE_PERSISTENT_MAX_MESSAGES,
  r as listTelegramLegacySentMessageCacheEntries,
  s as TELEGRAM_MESSAGE_CACHE_PERSISTENT_NAMESPACE,
  t as TELEGRAM_SENT_MESSAGE_CACHE_MAX_ENTRIES,
  yt as parseTelegramMessageThreadId,
} from "./sent-message-cache-D-3cw6_g.js";
import { m as resolveStorePath } from "./session-store-runtime-BwE6SlGz.js";
import { t as normalizeTelegramStateAccountId } from "./state-account-id-CdS1ON70.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
import {
  a as listTelegramLegacyThreadBindingEntries,
  l as testing,
  n as TELEGRAM_THREAD_BINDINGS_NAMESPACE,
  t as TELEGRAM_THREAD_BINDINGS_MAX_ENTRIES,
} from "./thread-bindings-s6Uy3BmF.js";
import { t as fingerprintTelegramBotToken } from "./token-fingerprint-5R81vEJi.js";
import { n as resolveTelegramToken } from "./token-iK1olK6e.js";
import {
  a as resolveTopicNameCachePath,
  c as TELEGRAM_STICKER_CACHE_MAX_ENTRIES,
  i as resolveTopicNameCacheNamespace,
  l as TELEGRAM_STICKER_CACHE_NAMESPACE,
  m as listTelegramLegacyStickerCacheEntries,
  o as resolveTopicNameCacheScope,
  r as listTelegramLegacyTopicNameCacheEntries,
  t as TELEGRAM_TOPIC_NAME_CACHE_MAX_ENTRIES,
} from "./topic-name-cache-BWDqVym9.js";
import {
  a as normalizeTelegramUpdateOffsetAccountId,
  i as listTelegramLegacyUpdateOffsetEntries,
  n as TELEGRAM_UPDATE_OFFSET_NAMESPACE,
  s as shouldReplaceTelegramUpdateOffsetEntry,
  t as TELEGRAM_UPDATE_OFFSET_MAX_ENTRIES,
} from "./update-offset-store-CnRvohsv.js";
//#region extensions/telegram/src/bot-info-cache.ts
const LEGACY_STORE_VERSION = 1;
const TELEGRAM_BOT_INFO_CACHE_NAMESPACE = "telegram.bot-info-cache";
function fingerprintFromToken(botToken) {
  const trimmed = botToken?.trim();
  if (!trimmed) return null;
  return fingerprintTelegramBotToken(trimmed);
}
function resolveTelegramBotInfoCachePath(accountId, env = process.env) {
  const stateDir = resolveStateDir(env, os.homedir);
  return path.join(
    stateDir,
    "telegram",
    `bot-info-${normalizeTelegramStateAccountId(accountId)}.json`,
  );
}
function openBotInfoCacheStore() {
  return getTelegramRuntime().state.openKeyedStore({
    namespace: "telegram.bot-info-cache",
    maxEntries: 128,
    defaultTtlMs: 864e5,
  });
}
function parseCachedTelegramBotInfo(value) {
  if (!value || typeof value !== "object") return null;
  const state = value;
  if (
    typeof state.tokenFingerprint !== "string" ||
    typeof state.fetchedAt !== "string" ||
    Number.isNaN(Date.parse(state.fetchedAt))
  )
    return null;
  const botInfo = normalizeTelegramBotInfo(state.botInfo);
  if (!botInfo) return null;
  return {
    tokenFingerprint: state.tokenFingerprint,
    fetchedAt: state.fetchedAt,
    botInfo,
  };
}
function parseLegacyCachedTelegramBotInfo(value) {
  if (!value || typeof value !== "object") return null;
  if (value.version !== LEGACY_STORE_VERSION) return null;
  return parseCachedTelegramBotInfo(value);
}
async function readCachedTelegramBotInfo(params) {
  const tokenFingerprint = fingerprintFromToken(params.botToken);
  if (!tokenFingerprint) return null;
  const parsed = parseCachedTelegramBotInfo(
    await openBotInfoCacheStore().lookup(normalizeTelegramStateAccountId(params.accountId)),
  );
  if (!parsed || parsed.tokenFingerprint !== tokenFingerprint) return null;
  const fetchedAtMs = Date.parse(parsed.fetchedAt);
  if ((params.now?.getTime() ?? Date.now()) - fetchedAtMs > 864e5) return null;
  return {
    botInfo: parsed.botInfo,
    fetchedAt: parsed.fetchedAt,
  };
}
async function writeCachedTelegramBotInfo(params) {
  const tokenFingerprint = fingerprintFromToken(params.botToken);
  if (!tokenFingerprint) return;
  const botInfo = normalizeTelegramBotInfo(params.botInfo);
  if (!botInfo) return;
  await openBotInfoCacheStore().register(normalizeTelegramStateAccountId(params.accountId), {
    tokenFingerprint,
    fetchedAt: /* @__PURE__ */ new Date().toISOString(),
    botInfo,
  });
}
async function deleteCachedTelegramBotInfo(params) {
  await openBotInfoCacheStore().delete(normalizeTelegramStateAccountId(params.accountId));
}
async function listTelegramLegacyBotInfoCacheEntries(params) {
  const { value } = await readJsonFileWithFallback(params.persistedPath, null);
  const parsed = parseLegacyCachedTelegramBotInfo(value);
  if (!parsed) return [];
  return [
    {
      key: normalizeTelegramStateAccountId(params.accountId),
      value: parsed,
    },
  ];
}
//#endregion
//#region extensions/telegram/src/state-migrations.ts
const TELEGRAM_MESSAGE_DISPATCH_LEGACY_BUCKET_NAMESPACE = "telegram.message-dispatch-dedupe";
const TELEGRAM_MESSAGE_DISPATCH_LEGACY_BUCKET_MAX_ENTRIES = 4096;
function fileExists(pathValue) {
  try {
    return !statRegularFileSync(pathValue).missing;
  } catch {
    return false;
  }
}
function resolveLegacySessionStorePath(params) {
  return path.join(resolveMigrationStateDir(params), "sessions", "sessions.json");
}
function resolveMigrationStateDir(params) {
  return (
    params.stateDir ??
    path.dirname(
      path.dirname(path.dirname(path.dirname(resolveStorePath(void 0, { env: params.env })))),
    )
  );
}
function parseLegacyMessageCacheJson(text) {
  try {
    const value = JSON.parse(text);
    return Array.isArray(value) ? value : [value];
  } catch {
    return;
  }
}
function readLegacyMessageCacheValues(raw) {
  const text = raw.trim();
  const whole = parseLegacyMessageCacheJson(text);
  if (whole) return whole;
  const values = [];
  let jsonl = text;
  if (text.startsWith("["))
    for (const match of text.matchAll(/\](?=\s*\{\s*"key"\s*:)/g)) {
      const arrayEnd = (match.index ?? -1) + 1;
      const initial = parseLegacyMessageCacheJson(text.slice(0, arrayEnd));
      if (initial) {
        values.push(...initial);
        jsonl = text.slice(arrayEnd);
        break;
      }
    }
  for (const line of jsonl.split("\n")) values.push(...(parseLegacyMessageCacheJson(line) ?? []));
  return values;
}
function listTelegramLegacyMessageCacheEntries(persistedPath) {
  let raw;
  try {
    raw = fs.readFileSync(persistedPath, "utf8");
  } catch {
    return [];
  }
  const entries = /* @__PURE__ */ new Map();
  for (const value of readLegacyMessageCacheValues(raw)) {
    if (
      !isRecord(value) ||
      typeof value.key !== "string" ||
      !value.key.trim() ||
      !value.key.includes(":") ||
      !isRecord(value.node)
    )
      continue;
    const sourceMessage = value.node.sourceMessage;
    if (!isTelegramMessageCacheSourceMessage(sourceMessage)) continue;
    const { openclaw_prompt_context_projection: _projection, ...canonicalSourceMessage } =
      sourceMessage;
    const parsedThreadId = parseTelegramMessageThreadId(value.node.threadId);
    const threadId = parsedThreadId === void 0 ? void 0 : String(parsedThreadId);
    const key = `${value.key.slice(0, value.key.lastIndexOf(":") + 1)}${sourceMessage.message_id}`;
    entries.delete(key);
    entries.set(key, {
      version: 1,
      sourceMessage: canonicalSourceMessage,
      ...(threadId ? { threadId } : {}),
    });
    if (entries.size > 3e3) {
      const oldest = entries.keys().next().value;
      if (oldest !== void 0) entries.delete(oldest);
    }
  }
  return Array.from(entries, ([key, value]) => ({
    key,
    value,
  }));
}
function readLegacyMessageDispatchDedupeRecord(value) {
  if (!isRecord(value) || typeof value.namespace !== "string") return;
  if (!isRecord(value.entries)) return;
  const entries = {};
  for (const [key, seenAt] of Object.entries(value.entries))
    if (typeof seenAt === "number" && Number.isFinite(seenAt) && seenAt > 0) entries[key] = seenAt;
  return {
    namespace: value.namespace,
    entries,
  };
}
function remainingMessageDispatchDedupeTtlMs(seenAt, now) {
  const ttlMs = TELEGRAM_MESSAGE_DISPATCH_DEDUPE_TTL_MS - Math.max(0, now - seenAt);
  return ttlMs > 0 ? ttlMs : void 0;
}
function openTelegramLegacyMessageDispatchBucketStore(env) {
  return createPluginStateSyncKeyedStore("telegram", {
    namespace: TELEGRAM_MESSAGE_DISPATCH_LEGACY_BUCKET_NAMESPACE,
    maxEntries: TELEGRAM_MESSAGE_DISPATCH_LEGACY_BUCKET_MAX_ENTRIES,
    env,
  });
}
function readTelegramLegacyMessageDispatchBuckets(params) {
  const store = openTelegramLegacyMessageDispatchBucketStore(params.env);
  const latestSeenAtByKey = /* @__PURE__ */ new Map();
  const recordKeys = [];
  for (const entry of store.entries()) {
    const record = readLegacyMessageDispatchDedupeRecord(entry.value);
    if (!record) continue;
    if (
      !(
        record.namespace === params.accountId || record.namespace.startsWith(`${params.accountId}:`)
      )
    )
      continue;
    recordKeys.push(entry.key);
    if (record.namespace !== params.accountId) continue;
    for (const [key, seenAt] of Object.entries(record.entries))
      latestSeenAtByKey.set(key, Math.max(latestSeenAtByKey.get(key) ?? 0, seenAt));
  }
  const now = params.now ?? Date.now();
  return {
    importEntries: [...latestSeenAtByKey.entries()].flatMap(([key, seenAt]) => {
      const ttlMs = remainingMessageDispatchDedupeTtlMs(seenAt, now);
      return ttlMs == null
        ? []
        : [
            createPersistentDedupeImportEntry({
              key: buildTelegramMessageDispatchAccountReplayKey({
                accountId: params.accountId,
                key,
              }),
              seenAt,
              ttlMs,
            }),
          ];
    }),
    recordKeys,
  };
}
function removeTelegramLegacyMessageDispatchBuckets(params) {
  const store = openTelegramLegacyMessageDispatchBucketStore(params.env);
  for (const key of readTelegramLegacyMessageDispatchBuckets(params).recordKeys) store.delete(key);
}
function mapTelegramMessageDispatchDedupeImportEntries(params) {
  return params.entries.map((entry) =>
    createPersistentDedupeImportEntry({
      key: buildTelegramMessageDispatchAccountReplayKey({
        accountId: params.accountId,
        key: entry.value.key,
      }),
      seenAt: entry.value.seenAt,
      ...(entry.ttlMs != null ? { ttlMs: entry.ttlMs } : {}),
    }),
  );
}
function listTelegramLegacySidecarAccountIds(params) {
  let persistedAccountIds;
  try {
    persistedAccountIds = fs
      .readdirSync(path.join(params.stateDir, "telegram"), { withFileTypes: true })
      .filter(
        (entry) =>
          entry.isFile() &&
          entry.name.startsWith(params.prefix) &&
          entry.name.endsWith(params.suffix),
      )
      .map((entry) => entry.name.slice(params.prefix.length, -params.suffix.length))
      .filter(Boolean);
  } catch {
    persistedAccountIds = [];
  }
  return uniqueStrings([...listTelegramAccountIds(params.cfg), ...persistedAccountIds]);
}
function detectTelegramMessageCacheLegacyStateMigration(params) {
  const runtimePersistedPath = resolveTelegramMessageCachePath(
    resolveStorePath(params.cfg.session?.store, { env: params.env }),
  );
  const legacyPersistedPath = resolveTelegramMessageCachePath(
    resolveLegacySessionStorePath(params),
  );
  const scopeKey = resolveTelegramMessageCachePersistentScopeKey(runtimePersistedPath);
  return uniqueStrings([runtimePersistedPath, legacyPersistedPath]).flatMap((persistedPath) => {
    if (!fileExists(persistedPath)) return [];
    return {
      kind: "plugin-state-import",
      label: "Telegram prompt-context message cache",
      sourcePath: persistedPath,
      targetPath: `plugin state:${TELEGRAM_MESSAGE_CACHE_PERSISTENT_NAMESPACE}`,
      pluginId: "telegram",
      namespace: TELEGRAM_MESSAGE_CACHE_PERSISTENT_NAMESPACE,
      maxEntries: TELEGRAM_MESSAGE_CACHE_PERSISTENT_MAX_MESSAGES,
      scopeKey,
      cleanupSource: "rename",
      preview: `- Telegram prompt-context message cache: ${persistedPath} → plugin state (${TELEGRAM_MESSAGE_CACHE_PERSISTENT_NAMESPACE})`,
      readEntries: () => listTelegramLegacyMessageCacheEntries(persistedPath),
    };
  });
}
function detectTelegramBotInfoCacheLegacyStateMigration(params) {
  return listTelegramAccountIds(params.cfg).flatMap((accountId) => {
    const persistedPath = resolveTelegramBotInfoCachePath(accountId, params.env);
    if (!fileExists(persistedPath)) return [];
    return {
      kind: "plugin-state-import",
      label: "Telegram startup bot info cache",
      sourcePath: persistedPath,
      targetPath: `plugin state:${TELEGRAM_BOT_INFO_CACHE_NAMESPACE}`,
      pluginId: "telegram",
      namespace: TELEGRAM_BOT_INFO_CACHE_NAMESPACE,
      maxEntries: 128,
      scopeKey: "",
      cleanupSource: "rename",
      preview: `- Telegram startup bot info cache: ${persistedPath} → plugin state (${TELEGRAM_BOT_INFO_CACHE_NAMESPACE})`,
      readEntries: () => {
        return listTelegramLegacyBotInfoCacheEntries({
          accountId,
          persistedPath,
        });
      },
    };
  });
}
function detectTelegramUpdateOffsetLegacyStateMigration(params) {
  const stateDir = resolveMigrationStateDir(params);
  return listTelegramLegacySidecarAccountIds({
    cfg: params.cfg,
    stateDir,
    prefix: "update-offset-",
    suffix: ".json",
  }).flatMap((accountId) => {
    const normalized = normalizeTelegramUpdateOffsetAccountId(accountId);
    const persistedPath = path.join(stateDir, "telegram", `update-offset-${normalized}.json`);
    if (!fileExists(persistedPath)) return [];
    let botToken;
    try {
      botToken =
        resolveTelegramToken(params.cfg, {
          accountId,
          envToken: params.env.TELEGRAM_BOT_TOKEN,
        }).token || void 0;
    } catch {
      botToken = void 0;
    }
    return {
      kind: "plugin-state-import",
      label: "Telegram update offset",
      sourcePath: persistedPath,
      targetPath: `plugin state:${TELEGRAM_UPDATE_OFFSET_NAMESPACE}`,
      pluginId: "telegram",
      namespace: TELEGRAM_UPDATE_OFFSET_NAMESPACE,
      maxEntries: TELEGRAM_UPDATE_OFFSET_MAX_ENTRIES,
      scopeKey: "",
      cleanupSource: "rename",
      preview: `- Telegram update offset: ${persistedPath} → plugin state (${TELEGRAM_UPDATE_OFFSET_NAMESPACE})`,
      readEntries: () =>
        listTelegramLegacyUpdateOffsetEntries({
          accountId,
          persistedPath,
        }),
      shouldReplaceExistingEntry: ({ existingValue, incomingValue }) =>
        shouldReplaceTelegramUpdateOffsetEntry({
          existingValue,
          incomingValue,
          botToken,
        }),
    };
  });
}
function detectTelegramStickerCacheLegacyStateMigration(params) {
  const stateDir = resolveMigrationStateDir(params);
  const persistedPath = path.join(stateDir, "telegram", "sticker-cache.json");
  if (!fileExists(persistedPath)) return [];
  return [
    {
      kind: "plugin-state-import",
      label: "Telegram sticker cache",
      sourcePath: persistedPath,
      targetPath: `plugin state:${TELEGRAM_STICKER_CACHE_NAMESPACE}`,
      pluginId: "telegram",
      namespace: TELEGRAM_STICKER_CACHE_NAMESPACE,
      maxEntries: TELEGRAM_STICKER_CACHE_MAX_ENTRIES,
      scopeKey: "",
      cleanupSource: "rename",
      preview: `- Telegram sticker cache: ${persistedPath} → plugin state (${TELEGRAM_STICKER_CACHE_NAMESPACE})`,
      readEntries: () => listTelegramLegacyStickerCacheEntries({ persistedPath }),
    },
  ];
}
function detectTelegramSentMessageCacheLegacyStateMigration(params) {
  const storePath = resolveStorePath(params.cfg.session?.store, { env: params.env });
  return uniqueStrings([storePath, resolveLegacySessionStorePath(params)])
    .map((sourceStorePath) => ({
      targetStorePath: storePath,
      sourcePath: `${sourceStorePath}.telegram-sent-messages.json`,
    }))
    .flatMap((source) => {
      if (!fileExists(source.sourcePath)) return [];
      return {
        kind: "plugin-state-import",
        label: "Telegram sent-message cache",
        sourcePath: source.sourcePath,
        targetPath: `plugin state:${TELEGRAM_SENT_MESSAGE_CACHE_NAMESPACE}`,
        pluginId: "telegram",
        namespace: TELEGRAM_SENT_MESSAGE_CACHE_NAMESPACE,
        maxEntries: TELEGRAM_SENT_MESSAGE_CACHE_MAX_ENTRIES,
        scopeKey: "",
        cleanupSource: "rename",
        preview: `- Telegram sent-message cache: ${source.sourcePath} → plugin state (${TELEGRAM_SENT_MESSAGE_CACHE_NAMESPACE})`,
        readEntries: () =>
          listTelegramLegacySentMessageCacheEntries({
            cfg: { session: { store: source.targetStorePath } },
            persistedPath: source.sourcePath,
          }),
      };
    });
}
function detectTelegramThreadBindingLegacyStateMigration(params) {
  const stateDir = resolveMigrationStateDir(params);
  return listTelegramLegacySidecarAccountIds({
    cfg: params.cfg,
    stateDir,
    prefix: "thread-bindings-",
    suffix: ".json",
  }).flatMap((accountId) => {
    const persistedPath = testing.resolveBindingsPath(accountId, params.env);
    if (!fileExists(persistedPath)) return [];
    return {
      kind: "plugin-state-import",
      label: "Telegram thread bindings",
      sourcePath: persistedPath,
      targetPath: `plugin state:${TELEGRAM_THREAD_BINDINGS_NAMESPACE}`,
      pluginId: "telegram",
      namespace: TELEGRAM_THREAD_BINDINGS_NAMESPACE,
      maxEntries: TELEGRAM_THREAD_BINDINGS_MAX_ENTRIES,
      scopeKey: "",
      cleanupSource: "rename",
      preview: `- Telegram thread bindings: ${persistedPath} → plugin state (${TELEGRAM_THREAD_BINDINGS_NAMESPACE})`,
      readEntries: () =>
        listTelegramLegacyThreadBindingEntries({
          accountId,
          persistedPath,
        }),
    };
  });
}
function detectTelegramMessageDispatchLegacyStateMigration(params) {
  const storePath = resolveStorePath(params.cfg.session?.store, { env: params.env });
  const legacyStorePath = resolveLegacySessionStorePath(params);
  const env = params.stateDir
    ? {
        ...params.env,
        OPENCLAW_STATE_DIR: params.stateDir,
      }
    : params.env;
  const namespace = resolvePersistentDedupePluginStateNamespace({
    namespace: TELEGRAM_MESSAGE_DISPATCH_DEDUPE_NAMESPACE,
    namespacePrefix: TELEGRAM_MESSAGE_DISPATCH_DEDUPE_NAMESPACE_PREFIX,
  });
  return listTelegramAccountIds(params.cfg).flatMap((accountId) => {
    const jsonPlans = uniqueStrings([storePath, legacyStorePath])
      .map((sourceStorePath) => ({
        sourcePath: resolveTelegramMessageDispatchLegacyPath({
          storePath: sourceStorePath,
          namespace: accountId,
        }),
      }))
      .flatMap((source) => {
        const sourcePath = source.sourcePath;
        if (!fileExists(sourcePath)) return [];
        return {
          kind: "plugin-state-import",
          label: "Telegram message dispatch dedupe",
          sourcePath,
          targetPath: `plugin state:${namespace}`,
          pluginId: TELEGRAM_MESSAGE_DISPATCH_DEDUPE_STATE_PLUGIN_ID,
          namespace,
          maxEntries: TELEGRAM_MESSAGE_DISPATCH_DEDUPE_STATE_MAX_ENTRIES,
          defaultTtlMs: TELEGRAM_MESSAGE_DISPATCH_DEDUPE_TTL_MS,
          scopeKey: "",
          cleanupSource: "rename",
          preview: `- Telegram message dispatch dedupe: ${sourcePath} → plugin state (${namespace})`,
          shouldReplaceExistingEntry: ({ existingValue, incomingValue }) =>
            shouldReplacePersistentDedupeEntry({
              existingValue,
              incomingValue,
            }),
          readEntries: async () =>
            mapTelegramMessageDispatchDedupeImportEntries({
              accountId,
              entries: await listPersistentDedupeLegacyJsonFileEntries({
                filePath: source.sourcePath,
                ttlMs: TELEGRAM_MESSAGE_DISPATCH_DEDUPE_TTL_MS,
              }),
            }),
        };
      });
    let legacyRecordKeys;
    try {
      legacyRecordKeys = readTelegramLegacyMessageDispatchBuckets({
        accountId,
        env,
      }).recordKeys;
    } catch {
      legacyRecordKeys = [];
    }
    if (legacyRecordKeys.length === 0) return jsonPlans;
    const pluginStatePlan = {
      kind: "plugin-state-import",
      label: "Telegram message dispatch dedupe",
      sourcePath: `plugin state:${TELEGRAM_MESSAGE_DISPATCH_LEGACY_BUCKET_NAMESPACE}:${accountId}`,
      targetPath: `plugin state:${namespace}`,
      pluginId: TELEGRAM_MESSAGE_DISPATCH_DEDUPE_STATE_PLUGIN_ID,
      namespace,
      maxEntries: TELEGRAM_MESSAGE_DISPATCH_DEDUPE_STATE_MAX_ENTRIES,
      defaultTtlMs: TELEGRAM_MESSAGE_DISPATCH_DEDUPE_TTL_MS,
      scopeKey: "",
      cleanupWhenEmpty: true,
      preview: `- Telegram message dispatch dedupe: plugin state (${TELEGRAM_MESSAGE_DISPATCH_LEGACY_BUCKET_NAMESPACE}) → plugin state (${namespace})`,
      shouldReplaceExistingEntry: ({ existingValue, incomingValue }) =>
        shouldReplacePersistentDedupeEntry({
          existingValue,
          incomingValue,
        }),
      readEntries: () =>
        readTelegramLegacyMessageDispatchBuckets({
          accountId,
          env,
        }).importEntries,
      removeSource: () =>
        removeTelegramLegacyMessageDispatchBuckets({
          accountId,
          env,
        }),
    };
    return jsonPlans.concat(pluginStatePlan);
  });
}
function topicNameCacheImportSource(params) {
  const scope = resolveTopicNameCacheScope(params.targetStorePath ?? params.sourceStorePath);
  return {
    sourcePath: resolveTopicNameCachePath(params.sourceStorePath),
    namespace: resolveTopicNameCacheNamespace(scope),
  };
}
function detectTelegramTopicNameCacheLegacyStateMigration(params) {
  const accountSources = listTelegramAccountIds(params.cfg).map((accountId) => {
    return topicNameCacheImportSource({
      sourceStorePath: resolveStorePath(params.cfg.session?.store, {
        env: params.env,
        agentId: accountId,
      }),
    });
  });
  const defaultStorePath = resolveStorePath(params.cfg.session?.store, { env: params.env });
  const defaultAccountStorePath = resolveStorePath(params.cfg.session?.store, {
    env: params.env,
    agentId: resolveDefaultTelegramAccountId(params.cfg),
  });
  const legacyStorePath = resolveLegacySessionStorePath(params);
  return [
    ...new Map(
      [
        ...accountSources,
        topicNameCacheImportSource({ sourceStorePath: defaultStorePath }),
        topicNameCacheImportSource({
          sourceStorePath: legacyStorePath,
          targetStorePath: defaultAccountStorePath,
        }),
      ].map((source) => [`${source.sourcePath}\0${source.namespace}`, source]),
    ).values(),
  ].flatMap((source) => {
    if (!fileExists(source.sourcePath)) return [];
    return {
      kind: "plugin-state-import",
      label: "Telegram forum topic-name cache",
      sourcePath: source.sourcePath,
      targetPath: `plugin state:${source.namespace}`,
      pluginId: "telegram",
      namespace: source.namespace,
      maxEntries: TELEGRAM_TOPIC_NAME_CACHE_MAX_ENTRIES,
      scopeKey: "",
      cleanupSource: "rename",
      preview: `- Telegram forum topic-name cache: ${source.sourcePath} → plugin state (${source.namespace})`,
      readEntries: () => {
        return listTelegramLegacyTopicNameCacheEntries({
          persistedPath: source.sourcePath,
          maxEntries: TELEGRAM_TOPIC_NAME_CACHE_MAX_ENTRIES,
        });
      },
    };
  });
}
async function detectTelegramLegacyStateMigrations(params) {
  const plans = [];
  plans.push(...detectTelegramUpdateOffsetLegacyStateMigration(params));
  plans.push(...detectTelegramBotInfoCacheLegacyStateMigration(params));
  plans.push(...detectTelegramStickerCacheLegacyStateMigration(params));
  plans.push(...detectTelegramMessageCacheLegacyStateMigration(params));
  plans.push(...detectTelegramSentMessageCacheLegacyStateMigration(params));
  plans.push(...detectTelegramTopicNameCacheLegacyStateMigration(params));
  plans.push(...detectTelegramThreadBindingLegacyStateMigration(params));
  plans.push(...detectTelegramMessageDispatchLegacyStateMigration(params));
  return plans;
}
//#endregion
export {
  writeCachedTelegramBotInfo as i,
  deleteCachedTelegramBotInfo as n,
  readCachedTelegramBotInfo as r,
  detectTelegramLegacyStateMigrations as t,
};
