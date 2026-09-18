import { t as buildApprovalResolutionRef } from "./approval-resolution-ref-BMBlVd2b.js";
//#region extensions/telegram/src/approval-callback-data.ts
const TELEGRAM_CALLBACK_DATA_MAX_BYTES = 64;
const TELEGRAM_APPROVAL_CALLBACK_PREFIX = "tga1:";
const TELEGRAM_APPROVE_ALLOW_ALWAYS_PATTERN =
  /^\/approve(?:@[^\s]+)?\s+[A-Za-z0-9][A-Za-z0-9._:-]*\s+allow-always(?![\s\S])/i;
function fitsTelegramCallbackData(value) {
  return Buffer.byteLength(value, "utf8") <= TELEGRAM_CALLBACK_DATA_MAX_BYTES;
}
/** Reserve the Telegram approval namespace even when a callback is malformed. */
function hasTelegramApprovalCallbackPrefix(data) {
  return data?.startsWith(TELEGRAM_APPROVAL_CALLBACK_PREFIX) === true;
}
/** Encode a typed approval action into Telegram-private, versioned callback data. */
function buildTelegramApprovalCallbackData(action) {
  if (!action.approvalId) return;
  const approvalKind = action.approvalKind;
  const kind = approvalKind === "exec" ? "e" : approvalKind === "plugin" ? "p" : null;
  const decision =
    action.decision === "allow-once"
      ? "o"
      : action.decision === "allow-always"
        ? "a"
        : action.decision === "deny"
          ? "d"
          : null;
  if (!kind || !decision) return;
  const encode = (approvalId) =>
    `${TELEGRAM_APPROVAL_CALLBACK_PREFIX}${kind}:${decision}:${approvalId}`;
  const exact = encode(action.approvalId);
  if (fitsTelegramCallbackData(exact)) return exact;
  return encode(
    buildApprovalResolutionRef({
      approvalId: action.approvalId,
      approvalKind,
    }),
  );
}
/** Decode only callbacks emitted by buildTelegramApprovalCallbackData. */
function parseTelegramApprovalCallbackData(data) {
  if (!hasTelegramApprovalCallbackPrefix(data) || !data || !fitsTelegramCallbackData(data))
    return null;
  const encoded = data.slice(5);
  if (encoded.length < 5 || encoded[1] !== ":" || encoded[3] !== ":") return null;
  const approvalKind = encoded[0] === "e" ? "exec" : encoded[0] === "p" ? "plugin" : null;
  const decision =
    encoded[2] === "o"
      ? "allow-once"
      : encoded[2] === "a"
        ? "allow-always"
        : encoded[2] === "d"
          ? "deny"
          : null;
  const approvalId = encoded.slice(4);
  if (!approvalKind || !decision || !approvalId) return null;
  return {
    type: "approval",
    approvalId,
    approvalKind,
    decision,
  };
}
function rewriteTelegramApprovalDecisionAlias(value) {
  if (!TELEGRAM_APPROVE_ALLOW_ALWAYS_PATTERN.test(value)) return value;
  return value.slice(0, -12) + "always";
}
function sanitizeTelegramCallbackData(value) {
  const rewritten = rewriteTelegramApprovalDecisionAlias(value);
  return fitsTelegramCallbackData(rewritten) ? rewritten : void 0;
}
//#endregion
//#region extensions/telegram/src/native-command-callback-data.ts
const TELEGRAM_NATIVE_COMMAND_CALLBACK_PREFIX = "tgcmd:";
const TELEGRAM_OPAQUE_CALLBACK_PREFIX = "tgcb1:";
function buildTelegramNativeCommandCallbackData(commandText) {
  return `${TELEGRAM_NATIVE_COMMAND_CALLBACK_PREFIX}${commandText}`;
}
function parseTelegramNativeCommandCallbackData(data) {
  if (!data) return null;
  const trimmed = data.trim();
  if (!trimmed.startsWith(TELEGRAM_NATIVE_COMMAND_CALLBACK_PREFIX)) return null;
  const commandText = trimmed.slice(6).trim();
  return commandText.startsWith("/") ? commandText : null;
}
function buildTelegramOpaqueCallbackData(value) {
  return `${TELEGRAM_OPAQUE_CALLBACK_PREFIX}${checksumTelegramOpaqueCallbackValue(value)}:${value}`;
}
function parseTelegramOpaqueCallbackData(data) {
  if (!data) return null;
  if (!data.startsWith(TELEGRAM_OPAQUE_CALLBACK_PREFIX)) return null;
  const encoded = data.slice(6);
  const separatorIndex = encoded.indexOf(":");
  if (separatorIndex <= 0) return null;
  const checksum = encoded.slice(0, separatorIndex);
  const value = encoded.slice(separatorIndex + 1);
  if (!value || checksum !== checksumTelegramOpaqueCallbackValue(value)) return null;
  return value;
}
function checksumTelegramOpaqueCallbackValue(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash.toString(36).slice(0, 5).padStart(5, "0");
}
//#endregion
export {
  buildTelegramApprovalCallbackData as a,
  parseTelegramApprovalCallbackData as c,
  parseTelegramOpaqueCallbackData as i,
  rewriteTelegramApprovalDecisionAlias as l,
  buildTelegramOpaqueCallbackData as n,
  fitsTelegramCallbackData as o,
  parseTelegramNativeCommandCallbackData as r,
  hasTelegramApprovalCallbackPrefix as s,
  buildTelegramNativeCommandCallbackData as t,
  sanitizeTelegramCallbackData as u,
};
