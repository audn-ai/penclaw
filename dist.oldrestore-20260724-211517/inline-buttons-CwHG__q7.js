import { t as inspectTelegramAccount } from "./account-inspect-Bttu8O3n.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import { r as listTelegramAccountIds } from "./accounts-BBOSygpA.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
import "./targets-Cb32iLpC.js";
//#region extensions/telegram/src/inline-buttons.ts
const DEFAULT_INLINE_BUTTONS_SCOPE = "allowlist";
function normalizeInlineButtonsScope(value) {
  const trimmed = normalizeOptionalLowercaseString(value);
  if (!trimmed) return;
  if (
    trimmed === "off" ||
    trimmed === "dm" ||
    trimmed === "group" ||
    trimmed === "all" ||
    trimmed === "allowlist"
  )
    return trimmed;
}
function readInlineButtonsCapability(value) {
  if (!value || Array.isArray(value) || typeof value !== "object" || !("inlineButtons" in value))
    return;
  return value.inlineButtons;
}
function resolveTelegramInlineButtonsConfigScope(capabilities) {
  return normalizeInlineButtonsScope(readInlineButtonsCapability(capabilities));
}
function resolveTelegramInlineButtonsScopeFromCapabilities(capabilities) {
  if (!capabilities) return DEFAULT_INLINE_BUTTONS_SCOPE;
  if (Array.isArray(capabilities)) {
    if (capabilities.length === 0) return DEFAULT_INLINE_BUTTONS_SCOPE;
    return capabilities.some(
      (entry) => normalizeLowercaseStringOrEmpty(String(entry)) === "inlinebuttons",
    )
      ? "all"
      : "off";
  }
  if (typeof capabilities === "object")
    return resolveTelegramInlineButtonsConfigScope(capabilities) ?? DEFAULT_INLINE_BUTTONS_SCOPE;
  return DEFAULT_INLINE_BUTTONS_SCOPE;
}
function resolveTelegramInlineButtonsScope(params) {
  return resolveTelegramInlineButtonsScopeFromCapabilities(
    inspectTelegramAccount({
      cfg: params.cfg,
      accountId: params.accountId,
    }).config.capabilities,
  );
}
function isTelegramInlineButtonsEnabled(params) {
  if (params.accountId) return resolveTelegramInlineButtonsScope(params) !== "off";
  const accountIds = listTelegramAccountIds(params.cfg);
  if (accountIds.length === 0) return resolveTelegramInlineButtonsScope(params) !== "off";
  return accountIds.some(
    (accountId) =>
      resolveTelegramInlineButtonsScope({
        cfg: params.cfg,
        accountId,
      }) !== "off",
  );
}
//#endregion
export {
  resolveTelegramInlineButtonsScopeFromCapabilities as i,
  resolveTelegramInlineButtonsConfigScope as n,
  resolveTelegramInlineButtonsScope as r,
  isTelegramInlineButtonsEnabled as t,
};
