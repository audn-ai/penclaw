import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import "../../security-runtime-CraX8Pqe.js";
import "../../string-coerce-runtime-BUe4iD0r.js";
import "../../state-paths-DU65nx5N.js";
import {
  a as resolveIMessageAccount,
  i as resolveDefaultIMessageAccountId,
  r as listIMessageAccountIds,
} from "../../accounts--1GXl2sX.js";
import {
  o as resolveIMessageCatchupCursorKey,
  r as capFailureRetriesMap,
  t as IMESSAGE_CATCHUP_CURSOR_NAMESPACE,
} from "../../catchup-Chv08ub7.js";
import {
  d as resolveIMessageReplyCacheEntryKey,
  i as IMESSAGE_REPLY_CACHE_NAMESPACE,
  n as IMESSAGE_REPLY_CACHE_COUNTER_NAMESPACE,
  r as IMESSAGE_REPLY_CACHE_MAX_ENTRIES,
  t as IMESSAGE_REPLY_CACHE_COUNTER_KEY,
} from "../../monitor-reply-cache-BmVsaTWs.js";
import { y as resolveStateDir } from "../../paths-DEklnbzU.js";
import {
  n as IMESSAGE_SENT_ECHOES_TTL_MS,
  o as resolveIMessageSentEchoEntryKey,
  t as IMESSAGE_SENT_ECHOES_NAMESPACE,
} from "../../persisted-echo-cache-DgrS4aLB.js";
import { s as statRegularFileSync } from "../../regular-file-CuvhUtZS.js";
import { _ as uniqueStrings } from "../../string-normalization-CRyoFBPt.js";
//#region extensions/imessage/src/state-migrations.ts
const REPLY_CACHE_TTL_MS = 360 * 60 * 1e3;
function fileExists(pathValue) {
  try {
    return !statRegularFileSync(pathValue).missing;
  } catch {
    return false;
  }
}
function resolveMigrationStateDir(params) {
  return params.stateDir ?? resolveStateDir(params.env);
}
function remainingTtlMs(timestamp, ttlMs) {
  const remaining = ttlMs - Math.max(0, Date.now() - timestamp);
  return remaining > 0 ? remaining : void 0;
}
function readJsonl(pathValue) {
  try {
    return fs
      .readFileSync(pathValue, "utf8")
      .split(/\n+/)
      .flatMap((line) => {
        if (!line) return [];
        try {
          return [JSON.parse(line)];
        } catch {
          return [];
        }
      });
  } catch (err) {
    throw new Error(`Failed reading ${pathValue}: ${String(err)}`, { cause: err });
  }
}
function parseReplyCacheEntry(raw) {
  if (!raw || typeof raw !== "object") return null;
  const parsed = raw;
  if (
    typeof parsed.accountId !== "string" ||
    typeof parsed.messageId !== "string" ||
    typeof parsed.shortId !== "string" ||
    typeof parsed.timestamp !== "number"
  )
    return null;
  return {
    accountId: parsed.accountId,
    messageId: parsed.messageId,
    shortId: parsed.shortId,
    timestamp: parsed.timestamp,
    ...(typeof parsed.chatGuid === "string" ? { chatGuid: parsed.chatGuid } : {}),
    ...(typeof parsed.chatIdentifier === "string" ? { chatIdentifier: parsed.chatIdentifier } : {}),
    ...(typeof parsed.chatId === "number" ? { chatId: parsed.chatId } : {}),
    ...(typeof parsed.isFromMe === "boolean" ? { isFromMe: parsed.isFromMe } : {}),
  };
}
function readReplyCacheMaxShortId(sourcePath) {
  let max = 0;
  for (const raw of readJsonl(sourcePath)) {
    if (!raw || typeof raw !== "object") continue;
    const shortId = raw.shortId;
    if (typeof shortId !== "string") continue;
    const numeric = Number.parseInt(shortId, 10);
    if (Number.isFinite(numeric) && numeric > max) max = numeric;
  }
  return max;
}
function readReplyCounterValue(value) {
  if (!value || typeof value !== "object") return null;
  const counter = value.counter;
  return typeof counter === "number" && Number.isFinite(counter) ? counter : null;
}
function shouldReplaceReplyCounter(existingValue, incomingValue) {
  const incomingCounter = readReplyCounterValue(incomingValue);
  if (incomingCounter === null) return false;
  const existingCounter = readReplyCounterValue(existingValue);
  return existingCounter === null || incomingCounter > existingCounter;
}
function parseSentEchoEntry(raw) {
  if (!raw || typeof raw !== "object") return null;
  const parsed = raw;
  if (typeof parsed.scope !== "string" || typeof parsed.timestamp !== "number") return null;
  return {
    scope: parsed.scope,
    timestamp: parsed.timestamp,
    ...(typeof parsed.text === "string" ? { text: parsed.text } : {}),
    ...(typeof parsed.messageId === "string" ? { messageId: parsed.messageId } : {}),
  };
}
function listReplyCacheEntries(sourcePath) {
  const entriesByKey = /* @__PURE__ */ new Map();
  for (const entry of readJsonl(sourcePath).map(parseReplyCacheEntry)) {
    if (!entry) continue;
    const ttlMs = remainingTtlMs(entry.timestamp, REPLY_CACHE_TTL_MS);
    if (!ttlMs) continue;
    const key = resolveIMessageReplyCacheEntryKey(entry.messageId);
    entriesByKey.delete(key);
    entriesByKey.set(key, {
      value: entry,
      ttlMs,
    });
  }
  return [...entriesByKey.entries()]
    .slice(-IMESSAGE_REPLY_CACHE_MAX_ENTRIES)
    .map(([key, entry]) => ({
      key,
      value: entry.value,
      ttlMs: entry.ttlMs,
    }));
}
function listSentEchoEntries(sourcePath) {
  return readJsonl(sourcePath)
    .map(parseSentEchoEntry)
    .filter((entry) => Boolean(entry))
    .slice(-256)
    .flatMap((entry) => {
      const ttlMs = remainingTtlMs(entry.timestamp, IMESSAGE_SENT_ECHOES_TTL_MS);
      if (!ttlMs) return [];
      return [
        {
          key: resolveIMessageSentEchoEntryKey(entry),
          value: entry,
          ttlMs,
        },
      ];
    });
}
function resolveLegacyCatchupCursorPath(stateDir, accountId) {
  const safePrefix = accountId.replace(/[^a-zA-Z0-9_-]/g, "_") || "account";
  const hash = createHash("sha256").update(accountId, "utf8").digest("hex").slice(0, 12);
  return path.join(stateDir, "imessage", "catchup", `${safePrefix}__${hash}.json`);
}
function listLegacyCatchupCursorPaths(stateDir) {
  const dir = path.join(stateDir, "imessage", "catchup");
  try {
    return fs
      .readdirSync(dir, { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
      .map((entry) => path.join(dir, entry.name));
  } catch {
    return [];
  }
}
function normalizeCatchupCursor(raw) {
  if (!raw || typeof raw !== "object") return null;
  const value = raw;
  if (
    typeof value.lastSeenMs !== "number" ||
    !Number.isFinite(value.lastSeenMs) ||
    typeof value.lastSeenRowid !== "number" ||
    !Number.isFinite(value.lastSeenRowid)
  )
    return null;
  const failureRetries = sanitizeCatchupFailureRetries(value.failureRetries);
  const hasRetries = Object.keys(failureRetries).length > 0;
  return {
    lastSeenMs: value.lastSeenMs,
    lastSeenRowid: value.lastSeenRowid,
    updatedAt: typeof value.updatedAt === "number" ? value.updatedAt : 0,
    ...(hasRetries ? { failureRetries } : {}),
  };
}
function readCatchupCursor(sourcePath) {
  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
  } catch (err) {
    throw new Error(`Failed reading ${sourcePath}: ${String(err)}`, { cause: err });
  }
  const cursor = normalizeCatchupCursor(parsed);
  if (!cursor) throw new Error(`Invalid iMessage catchup cursor: ${sourcePath}`);
  return cursor;
}
function sanitizeCatchupFailureRetries(raw) {
  if (!raw || typeof raw !== "object") return {};
  const out = {};
  for (const [guid, count] of Object.entries(raw))
    if (typeof count === "number" && Number.isFinite(count) && count > 0)
      out[guid] = Math.floor(count);
  return capFailureRetriesMap(out);
}
function shouldReplaceCatchupCursor(existingValue, incomingValue) {
  const incoming = normalizeCatchupCursor(incomingValue);
  if (!incoming) return false;
  const existing = normalizeCatchupCursor(existingValue);
  return (
    !existing ||
    incoming.lastSeenRowid > existing.lastSeenRowid ||
    (incoming.lastSeenRowid === existing.lastSeenRowid && incoming.lastSeenMs > existing.lastSeenMs)
  );
}
function detectReplyCacheMigration(params) {
  const stateDir = resolveMigrationStateDir(params);
  const sourcePath = path.join(stateDir, "imessage", "reply-cache.jsonl");
  if (!fileExists(sourcePath)) return [];
  const plans = [];
  plans.push({
    kind: "plugin-state-import",
    label: "iMessage reply short-id counter",
    sourcePath,
    targetPath: `plugin state:${IMESSAGE_REPLY_CACHE_COUNTER_NAMESPACE}`,
    pluginId: "imessage",
    namespace: IMESSAGE_REPLY_CACHE_COUNTER_NAMESPACE,
    maxEntries: 1,
    scopeKey: "",
    stateDir,
    preview: `- iMessage reply short-id counter: ${sourcePath} → plugin state (${IMESSAGE_REPLY_CACHE_COUNTER_NAMESPACE})`,
    readEntries: () => {
      const maxShortId = readReplyCacheMaxShortId(sourcePath);
      return maxShortId > 0
        ? [
            {
              key: IMESSAGE_REPLY_CACHE_COUNTER_KEY,
              value: { counter: maxShortId },
            },
          ]
        : [];
    },
    shouldReplaceExistingEntry: ({ existingValue, incomingValue }) =>
      shouldReplaceReplyCounter(existingValue, incomingValue),
  });
  plans.push({
    kind: "plugin-state-import",
    label: "iMessage reply short-id cache",
    sourcePath,
    targetPath: `plugin state:${IMESSAGE_REPLY_CACHE_NAMESPACE}`,
    pluginId: "imessage",
    namespace: IMESSAGE_REPLY_CACHE_NAMESPACE,
    maxEntries: IMESSAGE_REPLY_CACHE_MAX_ENTRIES,
    scopeKey: "",
    stateDir,
    cleanupSource: "rename",
    cleanupWhenEmpty: true,
    preview: `- iMessage reply short-id cache: ${sourcePath} → plugin state (${IMESSAGE_REPLY_CACHE_NAMESPACE})`,
    readEntries: () => listReplyCacheEntries(sourcePath),
  });
  return plans;
}
function detectSentEchoMigration(params) {
  const stateDir = resolveMigrationStateDir(params);
  const sourcePath = path.join(stateDir, "imessage", "sent-echoes.jsonl");
  if (!fileExists(sourcePath)) return [];
  return [
    {
      kind: "plugin-state-import",
      label: "iMessage sent-echo dedupe cache",
      sourcePath,
      targetPath: `plugin state:${IMESSAGE_SENT_ECHOES_NAMESPACE}`,
      pluginId: "imessage",
      namespace: IMESSAGE_SENT_ECHOES_NAMESPACE,
      maxEntries: 256,
      scopeKey: "",
      stateDir,
      cleanupSource: "rename",
      cleanupWhenEmpty: true,
      preview: `- iMessage sent-echo dedupe cache: ${sourcePath} → plugin state (${IMESSAGE_SENT_ECHOES_NAMESPACE})`,
      readEntries: () => listSentEchoEntries(sourcePath),
    },
  ];
}
function detectCatchupCursorMigrations(params) {
  const stateDir = resolveMigrationStateDir(params);
  const accountIds = uniqueStrings(
    [resolveDefaultIMessageAccountId(params.cfg), ...listIMessageAccountIds(params.cfg)].map(
      (accountId) =>
        resolveIMessageAccount({
          cfg: params.cfg,
          accountId,
        }).accountId,
    ),
  );
  const configuredPaths = new Set(
    accountIds.map((accountId) => resolveLegacyCatchupCursorPath(stateDir, accountId)),
  );
  const configuredPlans = accountIds.flatMap((accountId) => {
    const sourcePath = resolveLegacyCatchupCursorPath(stateDir, accountId);
    if (!fileExists(sourcePath)) return [];
    return {
      kind: "plugin-state-import",
      label: "iMessage catchup cursor",
      sourcePath,
      targetPath: `plugin state:${IMESSAGE_CATCHUP_CURSOR_NAMESPACE}`,
      pluginId: "imessage",
      namespace: IMESSAGE_CATCHUP_CURSOR_NAMESPACE,
      maxEntries: 256,
      scopeKey: "",
      stateDir,
      cleanupSource: "rename",
      preview: `- iMessage catchup cursor: ${sourcePath} → plugin state (${IMESSAGE_CATCHUP_CURSOR_NAMESPACE})`,
      readEntries: () => {
        const cursor = readCatchupCursor(sourcePath);
        return [
          {
            key: resolveIMessageCatchupCursorKey(accountId),
            value: cursor,
          },
        ];
      },
      shouldReplaceExistingEntry: (replaceParams) =>
        shouldReplaceCatchupCursor(replaceParams.existingValue, replaceParams.incomingValue),
    };
  });
  const orphanPlans = listLegacyCatchupCursorPaths(stateDir)
    .filter((sourcePath) => !configuredPaths.has(sourcePath))
    .map((sourcePath) => ({
      kind: "plugin-state-import",
      label: "iMessage orphan catchup cursor",
      sourcePath,
      targetPath: `plugin state:${IMESSAGE_CATCHUP_CURSOR_NAMESPACE}`,
      pluginId: "imessage",
      namespace: IMESSAGE_CATCHUP_CURSOR_NAMESPACE,
      maxEntries: 256,
      scopeKey: "",
      stateDir,
      cleanupSource: "rename",
      cleanupWhenEmpty: true,
      preview: `- iMessage orphan catchup cursor: ${sourcePath} → archived legacy state`,
      readEntries: () => [],
    }));
  return [...configuredPlans, ...orphanPlans];
}
async function detectIMessageLegacyStateMigrations(params) {
  return [
    ...detectCatchupCursorMigrations(params),
    ...detectReplyCacheMigration(params),
    ...detectSentEchoMigration(params),
  ];
}
//#endregion
export { detectIMessageLegacyStateMigrations };
