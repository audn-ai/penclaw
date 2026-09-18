import { t as asBoolean } from "./boolean-CrriykWV.js";
import { s as asFiniteNumber } from "./number-coercion-CJQ8TR--.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import "./utils-DtcDeqWS.js";
import { l as normalizeStringEntries } from "./string-normalization-CRyoFBPt.js";
//#region packages/net-policy/src/url-userinfo.ts
/** Strip username/password credentials from a URL string when it parses. */
function stripUrlUserInfo(value) {
  try {
    const parsed = new URL(value);
    if (!parsed.username && !parsed.password) return value;
    parsed.username = "";
    parsed.password = "";
    return parsed.toString();
  } catch {
    return value;
  }
}
//#endregion
//#region src/channels/account-snapshot-fields.ts
/**
 * Status-safe channel account projection helpers for CLI, status APIs, and plugin SDK callers.
 * This file is the redaction boundary between runtime account objects and public snapshots.
 */
const CREDENTIAL_STATUS_KEYS = [
  "tokenStatus",
  "botTokenStatus",
  "appTokenStatus",
  "signingSecretStatus",
  "userTokenStatus",
];
function readBoolean(record, key) {
  return asBoolean(record[key]);
}
function readNumber(record, key) {
  const value = record[key];
  return asFiniteNumber(value);
}
function readNullableNumber(record, key) {
  if (record[key] === null) return null;
  return readNumber(record, key);
}
function readStringArray(record, key) {
  const value = record[key];
  if (!Array.isArray(value)) return;
  const normalized = normalizeStringEntries(
    value.map((entry) => (typeof entry === "string" || typeof entry === "number" ? entry : "")),
  );
  return normalized.length > 0 ? normalized : void 0;
}
function readCredentialStatus(record, key) {
  const value = record[key];
  return value === "available" || value === "configured_unavailable" || value === "missing"
    ? value
    : void 0;
}
/**
 * Infers whether any known credential status makes an account configured.
 *
 * Status commands need this metadata for "configured but unavailable" accounts without reading
 * raw credentials from runtime-only helpers.
 */
function resolveConfiguredFromCredentialStatuses(account) {
  const record = isRecord(account) ? account : null;
  if (!record) return;
  let sawCredentialStatus = false;
  for (const key of CREDENTIAL_STATUS_KEYS) {
    const status = readCredentialStatus(record, key);
    if (!status) continue;
    sawCredentialStatus = true;
    if (status !== "missing") return true;
  }
  return sawCredentialStatus ? false : void 0;
}
/** Infers configured state only from the credential status keys required by a channel. */
function resolveConfiguredFromRequiredCredentialStatuses(account, requiredKeys) {
  const record = isRecord(account) ? account : null;
  if (!record) return;
  let sawCredentialStatus = false;
  for (const key of requiredKeys) {
    const status = readCredentialStatus(record, key);
    if (!status) continue;
    sawCredentialStatus = true;
    if (status === "missing") return false;
  }
  return sawCredentialStatus ? true : void 0;
}
/** Returns true when a credential exists but cannot be resolved at status-render time. */
function hasConfiguredUnavailableCredentialStatus(account) {
  const record = isRecord(account) ? account : null;
  if (!record) return false;
  return CREDENTIAL_STATUS_KEYS.some(
    (key) => readCredentialStatus(record, key) === "configured_unavailable",
  );
}
/** Returns true when account data contains a resolved credential value or available status. */
function hasResolvedCredentialValue(account) {
  const record = isRecord(account) ? account : null;
  if (!record) return false;
  return (
    ["token", "botToken", "appToken", "signingSecret", "userToken"].some((key) => {
      return normalizeOptionalString(record[key]) !== void 0;
    }) || CREDENTIAL_STATUS_KEYS.some((key) => readCredentialStatus(record, key) === "available")
  );
}
/** Projects credential source/status metadata while omitting raw credential values. */
function projectCredentialSnapshotFields(account) {
  const record = isRecord(account) ? account : null;
  if (!record) return {};
  const tokenSource = normalizeOptionalString(record.tokenSource);
  const botTokenSource = normalizeOptionalString(record.botTokenSource);
  const appTokenSource = normalizeOptionalString(record.appTokenSource);
  const signingSecretSource = normalizeOptionalString(record.signingSecretSource);
  return {
    ...(tokenSource ? { tokenSource } : {}),
    ...(botTokenSource ? { botTokenSource } : {}),
    ...(appTokenSource ? { appTokenSource } : {}),
    ...(signingSecretSource ? { signingSecretSource } : {}),
    ...(readCredentialStatus(record, "tokenStatus")
      ? { tokenStatus: readCredentialStatus(record, "tokenStatus") }
      : {}),
    ...(readCredentialStatus(record, "botTokenStatus")
      ? { botTokenStatus: readCredentialStatus(record, "botTokenStatus") }
      : {}),
    ...(readCredentialStatus(record, "appTokenStatus")
      ? { appTokenStatus: readCredentialStatus(record, "appTokenStatus") }
      : {}),
    ...(readCredentialStatus(record, "signingSecretStatus")
      ? { signingSecretStatus: readCredentialStatus(record, "signingSecretStatus") }
      : {}),
    ...(readCredentialStatus(record, "userTokenStatus")
      ? { userTokenStatus: readCredentialStatus(record, "userTokenStatus") }
      : {}),
  };
}
/**
 * Projects status-safe account fields for read-only channel/account snapshots.
 *
 * This is the boundary between runtime account objects and status renderers; keep it explicit so
 * new channel fields do not accidentally expose webhook URLs, public keys, or raw credentials.
 */
function projectSafeChannelAccountSnapshotFields(account) {
  const record = isRecord(account) ? account : null;
  if (!record) return {};
  const name = normalizeOptionalString(record.name);
  const statusState = normalizeOptionalString(record.statusState);
  const healthState = normalizeOptionalString(record.healthState);
  const mode = normalizeOptionalString(record.mode);
  const dmPolicy = normalizeOptionalString(record.dmPolicy);
  const baseUrl = normalizeOptionalString(record.baseUrl);
  const cliPath = normalizeOptionalString(record.cliPath);
  const dbPath = normalizeOptionalString(record.dbPath);
  return {
    ...(name ? { name } : {}),
    ...(readBoolean(record, "linked") !== void 0 ? { linked: readBoolean(record, "linked") } : {}),
    ...(readBoolean(record, "running") !== void 0
      ? { running: readBoolean(record, "running") }
      : {}),
    ...(readBoolean(record, "connected") !== void 0
      ? { connected: readBoolean(record, "connected") }
      : {}),
    ...(readBoolean(record, "restartPending") !== void 0
      ? { restartPending: readBoolean(record, "restartPending") }
      : {}),
    ...(readNumber(record, "reconnectAttempts") !== void 0
      ? { reconnectAttempts: readNumber(record, "reconnectAttempts") }
      : {}),
    ...(readNullableNumber(record, "lastConnectedAt") !== void 0
      ? { lastConnectedAt: readNullableNumber(record, "lastConnectedAt") }
      : {}),
    ...(readNumber(record, "lastInboundAt") !== void 0
      ? { lastInboundAt: readNumber(record, "lastInboundAt") }
      : {}),
    ...(readNullableNumber(record, "lastOutboundAt") !== void 0
      ? { lastOutboundAt: readNullableNumber(record, "lastOutboundAt") }
      : {}),
    ...(readNullableNumber(record, "lastMessageAt") !== void 0
      ? { lastMessageAt: readNullableNumber(record, "lastMessageAt") }
      : {}),
    ...(readNullableNumber(record, "lastEventAt") !== void 0
      ? { lastEventAt: readNullableNumber(record, "lastEventAt") }
      : {}),
    ...(readNumber(record, "lastTransportActivityAt") !== void 0
      ? { lastTransportActivityAt: readNumber(record, "lastTransportActivityAt") }
      : {}),
    ...(statusState ? { statusState } : {}),
    ...(healthState ? { healthState } : {}),
    ...(readBoolean(record, "terminalDisconnect") !== void 0
      ? { terminalDisconnect: readBoolean(record, "terminalDisconnect") }
      : {}),
    ...(readBoolean(record, "busy") !== void 0 ? { busy: readBoolean(record, "busy") } : {}),
    ...(readNumber(record, "activeRuns") !== void 0
      ? { activeRuns: readNumber(record, "activeRuns") }
      : {}),
    ...(readNullableNumber(record, "lastRunActivityAt") !== void 0
      ? { lastRunActivityAt: readNullableNumber(record, "lastRunActivityAt") }
      : {}),
    ...(mode ? { mode } : {}),
    ...(dmPolicy ? { dmPolicy } : {}),
    ...(readStringArray(record, "allowFrom")
      ? { allowFrom: readStringArray(record, "allowFrom") }
      : {}),
    ...projectCredentialSnapshotFields(account),
    ...(baseUrl ? { baseUrl: stripUrlUserInfo(baseUrl) } : {}),
    ...(readBoolean(record, "allowUnmentionedGroups") !== void 0
      ? { allowUnmentionedGroups: readBoolean(record, "allowUnmentionedGroups") }
      : {}),
    ...(cliPath ? { cliPath } : {}),
    ...(dbPath ? { dbPath } : {}),
    ...(readNumber(record, "port") !== void 0 ? { port: readNumber(record, "port") } : {}),
  };
}
//#endregion
export {
  resolveConfiguredFromCredentialStatuses as a,
  projectSafeChannelAccountSnapshotFields as i,
  hasResolvedCredentialValue as n,
  resolveConfiguredFromRequiredCredentialStatuses as o,
  projectCredentialSnapshotFields as r,
  hasConfiguredUnavailableCredentialStatus as t,
};
