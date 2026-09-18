import path from "node:path";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import "./error-runtime-BIAwr399.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import { t as createClaimableDedupe } from "./persistent-dedupe-CMTHL22F.js";
import {
  _ as uniqueStrings,
  l as normalizeStringEntries,
} from "./string-normalization-CRyoFBPt.js";
//#region extensions/telegram/src/message-dispatch-dedupe.ts
const TELEGRAM_MESSAGE_DISPATCH_DEDUPE_TTL_MS = 10080 * 60 * 1e3;
const TELEGRAM_MESSAGE_DISPATCH_DEDUPE_NAMESPACE = "global";
const TELEGRAM_MESSAGE_DISPATCH_DEDUPE_NAMESPACE_PREFIX = "telegram.message-dispatch-dedupe";
const TELEGRAM_MESSAGE_DISPATCH_DEDUPE_STATE_PLUGIN_ID = "telegram-message-dispatch-dedupe";
const TELEGRAM_MESSAGE_DISPATCH_DEDUPE_MEMORY_MAX_ENTRIES = 5e4;
const TELEGRAM_MESSAGE_DISPATCH_DEDUPE_STATE_MAX_ENTRIES = 5e4;
var TelegramMessageDispatchReplayForgetError = class extends Error {
  constructor(failures) {
    const count = failures.length;
    super(`telegram message dispatch dedupe rollback failed for ${count} key(s)`, {
      cause: failures.find((failure) => failure.error !== void 0)?.error,
    });
    this.name = "TelegramMessageDispatchReplayForgetError";
    this.failures = [...failures];
    this.cause = failures.find((failure) => failure.error !== void 0)?.error;
  }
};
function isTelegramMessageDispatchReplayForgetError(error) {
  return error instanceof TelegramMessageDispatchReplayForgetError;
}
function sanitizeFileSegment(value) {
  const trimmed = value.trim();
  if (!trimmed) return "default";
  return trimmed.replace(/[^a-zA-Z0-9_-]/g, "_");
}
function resolveTelegramMessageDispatchLegacyPath(params) {
  return path.join(
    path.dirname(params.storePath),
    `${path.basename(params.storePath)}.telegram-message-dispatch-${sanitizeFileSegment(params.namespace)}.json`,
  );
}
function buildTelegramMessageDispatchReplayKey(msg) {
  const chatId = msg.chat?.id;
  const messageId = msg.message_id;
  if (chatId == null || typeof messageId !== "number" || messageId <= 0) return null;
  return JSON.stringify(["message", String(chatId), messageId]);
}
function buildTelegramMessageDispatchAccountReplayKey(params) {
  return JSON.stringify(["account", params.accountId, params.key]);
}
function buildTelegramMessageDispatchStoredReplayKey(params) {
  const key = buildTelegramMessageDispatchReplayKey(params.msg);
  return key
    ? buildTelegramMessageDispatchAccountReplayKey({
        accountId: params.accountId,
        key,
      })
    : null;
}
function createTelegramMessageDispatchReplayGuard(params = {}) {
  return createClaimableDedupe({
    ttlMs: TELEGRAM_MESSAGE_DISPATCH_DEDUPE_TTL_MS,
    memoryMaxSize: TELEGRAM_MESSAGE_DISPATCH_DEDUPE_MEMORY_MAX_ENTRIES,
    pluginId: TELEGRAM_MESSAGE_DISPATCH_DEDUPE_STATE_PLUGIN_ID,
    namespacePrefix: TELEGRAM_MESSAGE_DISPATCH_DEDUPE_NAMESPACE_PREFIX,
    stateMaxEntries: TELEGRAM_MESSAGE_DISPATCH_DEDUPE_STATE_MAX_ENTRIES,
    ...(params.onDiskError ? { onDiskError: params.onDiskError } : {}),
  });
}
async function claimTelegramMessageDispatchReplay(params) {
  const key = buildTelegramMessageDispatchStoredReplayKey({
    accountId: params.accountId,
    msg: params.msg,
  });
  if (!key) return { kind: "invalid" };
  let releaseRetries = 0;
  while (true) {
    const claim = await params.guard.claim(key, {
      namespace: TELEGRAM_MESSAGE_DISPATCH_DEDUPE_NAMESPACE,
    });
    if (claim.kind === "claimed")
      return {
        kind: "claimed",
        key,
      };
    if (claim.kind === "duplicate") return { kind: "duplicate" };
    try {
      await claim.pending;
      return { kind: "duplicate" };
    } catch {
      releaseRetries += 1;
      if (releaseRetries > 1) return { kind: "duplicate" };
    }
  }
}
function normalizeReplayKeys(keys) {
  return uniqueStrings(normalizeStringEntries(keys ?? []));
}
async function commitTelegramMessageDispatchReplay(params) {
  const keys = normalizeReplayKeys(params.keys);
  const committedKeys = [];
  for (const [index, key] of keys.entries()) {
    let diskError;
    try {
      const recorded = await params.guard.commit(
        key,
        params.requirePersistent === true
          ? {
              namespace: TELEGRAM_MESSAGE_DISPATCH_DEDUPE_NAMESPACE,
              onDiskError: (error) => {
                diskError = error;
              },
            }
          : { namespace: TELEGRAM_MESSAGE_DISPATCH_DEDUPE_NAMESPACE },
      );
      if (params.requirePersistent === true && diskError !== void 0)
        throw diskError instanceof Error
          ? diskError
          : new Error(formatErrorMessage(diskError), { cause: diskError });
      if (recorded) committedKeys.push(key);
    } catch (error) {
      for (const pendingKey of keys.slice(index + 1))
        params.guard.release(pendingKey, {
          namespace: TELEGRAM_MESSAGE_DISPATCH_DEDUPE_NAMESPACE,
          error,
        });
      const failures = [];
      for (const committedKey of committedKeys)
        try {
          if (!(await params.guard.forget(committedKey, { namespace: "global" })))
            failures.push({ key: committedKey });
        } catch (rollbackError) {
          failures.push({
            key: committedKey,
            error: rollbackError,
          });
        }
      let failedKeyCleanupError;
      try {
        await params.guard.forget(key, {
          namespace: TELEGRAM_MESSAGE_DISPATCH_DEDUPE_NAMESPACE,
          onDiskError: (rollbackError) => {
            failedKeyCleanupError = rollbackError;
          },
        });
      } catch (rollbackError) {
        failedKeyCleanupError = rollbackError;
      }
      if (failedKeyCleanupError !== void 0)
        failures.push({
          key,
          error: failedKeyCleanupError,
        });
      if (failures.length > 0) throw new TelegramMessageDispatchReplayForgetError(failures);
      throw error;
    }
  }
}
function releaseTelegramMessageDispatchReplay(params) {
  const keys = normalizeReplayKeys(params.keys);
  for (const key of keys)
    params.guard.release(key, {
      namespace: TELEGRAM_MESSAGE_DISPATCH_DEDUPE_NAMESPACE,
      error: params.error,
    });
}
//#endregion
export {
  TELEGRAM_MESSAGE_DISPATCH_DEDUPE_TTL_MS as a,
  commitTelegramMessageDispatchReplay as c,
  releaseTelegramMessageDispatchReplay as d,
  resolveTelegramMessageDispatchLegacyPath as f,
  TELEGRAM_MESSAGE_DISPATCH_DEDUPE_STATE_PLUGIN_ID as i,
  createTelegramMessageDispatchReplayGuard as l,
  TELEGRAM_MESSAGE_DISPATCH_DEDUPE_NAMESPACE_PREFIX as n,
  buildTelegramMessageDispatchAccountReplayKey as o,
  TELEGRAM_MESSAGE_DISPATCH_DEDUPE_STATE_MAX_ENTRIES as r,
  claimTelegramMessageDispatchReplay as s,
  TELEGRAM_MESSAGE_DISPATCH_DEDUPE_NAMESPACE as t,
  isTelegramMessageDispatchReplayForgetError as u,
};
