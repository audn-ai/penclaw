import { n as readJsonFileWithFallback } from "./json-store-CSxUwOCu.js";
import { n as getTelegramRuntime } from "./runtime-B_f_VNpK.js";
import { t as normalizeTelegramStateAccountId } from "./state-account-id-CdS1ON70.js";
import { t as fingerprintTelegramBotToken } from "./token-fingerprint-5R81vEJi.js";
import { t as resolveTelegramBotUserIdFromToken } from "./token-iK1olK6e.js";
//#region extensions/telegram/src/update-offset-store.ts
const STORE_VERSION = 3;
const TELEGRAM_UPDATE_OFFSET_NAMESPACE = "telegram.update-offsets";
const TELEGRAM_UPDATE_OFFSET_MAX_ENTRIES = 1e3;
function isValidUpdateId(value) {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}
function normalizeTelegramUpdateOffsetAccountId(accountId) {
  return normalizeTelegramStateAccountId(accountId);
}
function openUpdateOffsetStore(env) {
  return getTelegramRuntime().state.openKeyedStore({
    namespace: "telegram.update-offsets",
    maxEntries: 1e3,
    ...(env ? { env } : {}),
  });
}
function extractBotIdFromToken(token) {
  const botUserId = resolveTelegramBotUserIdFromToken(token);
  return botUserId === void 0 ? null : String(botUserId);
}
function fingerprintFromToken(token) {
  const trimmed = token?.trim();
  if (!trimmed) return null;
  return fingerprintTelegramBotToken(trimmed);
}
function safeParseState(parsed) {
  try {
    const state = parsed;
    if (state?.version !== STORE_VERSION && state?.version !== 2 && state?.version !== 1)
      return null;
    if (state.lastUpdateId !== null && !isValidUpdateId(state.lastUpdateId)) return null;
    if (state.version >= 2 && state.botId !== null && typeof state.botId !== "string") return null;
    if (
      state.version === STORE_VERSION &&
      state.tokenFingerprint !== null &&
      typeof state.tokenFingerprint !== "string"
    )
      return null;
    return {
      version: state.version,
      lastUpdateId: state.lastUpdateId ?? null,
      botId: state.version >= 2 ? (state.botId ?? null) : null,
      tokenFingerprint: state.version === STORE_VERSION ? (state.tokenFingerprint ?? null) : null,
    };
  } catch {
    return null;
  }
}
function rotationForToken(parsed, botToken) {
  const currentBotId = extractBotIdFromToken(botToken);
  if (!currentBotId || parsed.lastUpdateId === null) return null;
  let reason = null;
  if (parsed.botId === null) reason = "legacy-state";
  else if (parsed.botId !== currentBotId) reason = "bot-id-changed";
  else if (parsed.tokenFingerprint === null) reason = "legacy-state";
  else if (parsed.tokenFingerprint !== fingerprintFromToken(botToken)) reason = "token-rotated";
  return reason
    ? {
        reason,
        previousBotId: parsed.botId,
        currentBotId,
        staleLastUpdateId: parsed.lastUpdateId,
      }
    : null;
}
async function readTelegramUpdateOffset(params) {
  const key = normalizeTelegramUpdateOffsetAccountId(params.accountId);
  let storedValue;
  try {
    storedValue = await openUpdateOffsetStore(params.env).lookup(key);
  } catch {
    storedValue = void 0;
  }
  const parsed = safeParseState(storedValue);
  if (!parsed) return null;
  const rotation = rotationForToken(parsed, params.botToken);
  if (rotation) {
    await params.onRotationDetected?.(rotation);
    return null;
  }
  return parsed.lastUpdateId;
}
async function writeTelegramUpdateOffset(params) {
  if (!isValidUpdateId(params.updateId))
    throw new Error("Telegram update offset must be a non-negative safe integer.");
  const payload = {
    version: STORE_VERSION,
    lastUpdateId: params.updateId,
    botId: extractBotIdFromToken(params.botToken),
    tokenFingerprint: fingerprintFromToken(params.botToken),
  };
  await openUpdateOffsetStore(params.env).register(
    normalizeTelegramUpdateOffsetAccountId(params.accountId),
    payload,
  );
}
async function deleteTelegramUpdateOffset(params) {
  await openUpdateOffsetStore(params.env).delete(
    normalizeTelegramUpdateOffsetAccountId(params.accountId),
  );
}
async function listTelegramLegacyUpdateOffsetEntries(params) {
  const { value } = await readJsonFileWithFallback(params.persistedPath, null);
  const parsed = safeParseState(value);
  if (!parsed || parsed.lastUpdateId === null) return [];
  return [
    {
      key: normalizeTelegramUpdateOffsetAccountId(params.accountId),
      value: parsed,
    },
  ];
}
function shouldReplaceTelegramUpdateOffsetEntry(params) {
  const existing = safeParseState(params.existingValue);
  const incoming = safeParseState(params.incomingValue);
  if (!incoming || incoming.lastUpdateId === null) return false;
  if (!existing || existing.lastUpdateId === null) return true;
  if (!params.botToken) {
    if (existing.botId && incoming.botId && existing.botId !== incoming.botId) return false;
    if (
      existing.tokenFingerprint &&
      incoming.tokenFingerprint &&
      existing.tokenFingerprint !== incoming.tokenFingerprint
    )
      return false;
  }
  if (rotationForToken(incoming, params.botToken)) return false;
  if (rotationForToken(existing, params.botToken)) return true;
  return incoming.lastUpdateId > existing.lastUpdateId;
}
//#endregion
export {
  normalizeTelegramUpdateOffsetAccountId as a,
  writeTelegramUpdateOffset as c,
  listTelegramLegacyUpdateOffsetEntries as i,
  TELEGRAM_UPDATE_OFFSET_NAMESPACE as n,
  readTelegramUpdateOffset as o,
  deleteTelegramUpdateOffset as r,
  shouldReplaceTelegramUpdateOffsetEntry as s,
  TELEGRAM_UPDATE_OFFSET_MAX_ENTRIES as t,
};
