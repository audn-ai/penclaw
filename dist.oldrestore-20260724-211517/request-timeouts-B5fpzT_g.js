import { p as finiteSecondsToTimerSafeMilliseconds } from "./number-coercion-CJQ8TR--.js";
import "./number-runtime-B-n-wjMn.js";
//#region extensions/telegram/src/request-timeouts.ts
const TELEGRAM_GET_UPDATES_REQUEST_TIMEOUT_MS = 45e3;
const TELEGRAM_DEFAULT_REQUEST_TIMEOUT_MS = 6e4;
const TELEGRAM_DEFAULT_LONG_POLL_TIMEOUT_SECONDS = 30;
const TELEGRAM_LONG_POLL_ABORT_MARGIN_SECONDS = 5;
const TELEGRAM_REQUEST_TIMEOUTS_MS = {
  deletemycommands: 15e3,
  deletewebhook: 15e3,
  deletemessage: 15e3,
  editforumtopic: 15e3,
  editmessagetext: 15e3,
  getchat: 15e3,
  getfile: 3e4,
  getme: 15e3,
  getupdates: TELEGRAM_GET_UPDATES_REQUEST_TIMEOUT_MS,
  pinchatmessage: 15e3,
  sendanimation: 3e4,
  sendaudio: 3e4,
  sendchataction: TELEGRAM_DEFAULT_REQUEST_TIMEOUT_MS,
  senddocument: 3e4,
  sendmessage: TELEGRAM_DEFAULT_REQUEST_TIMEOUT_MS,
  sendmessagedraft: TELEGRAM_DEFAULT_REQUEST_TIMEOUT_MS,
  sendphoto: 3e4,
  sendvideo: 3e4,
  sendvoice: 3e4,
  setmessagereaction: 1e4,
  setmycommands: 15e3,
  setwebhook: 15e3,
};
function resolveConfiguredTelegramRequestTimeoutMs(timeoutSeconds) {
  if (typeof timeoutSeconds !== "number" || !Number.isFinite(timeoutSeconds)) return;
  return (
    finiteSecondsToTimerSafeMilliseconds(Math.max(1, timeoutSeconds), { floorSeconds: true }) ??
    2147e6
  );
}
function resolveTelegramRequestTimeoutMs(method, timeoutSeconds) {
  if (!method) return;
  if (method === "getupdates") return TELEGRAM_REQUEST_TIMEOUTS_MS.getupdates;
  const baseTimeoutMs = TELEGRAM_REQUEST_TIMEOUTS_MS[method] ?? TELEGRAM_DEFAULT_REQUEST_TIMEOUT_MS;
  return Math.max(baseTimeoutMs, resolveConfiguredTelegramRequestTimeoutMs(timeoutSeconds) ?? 0);
}
function resolveTelegramLongPollTimeoutSeconds(timeoutSeconds) {
  const maxLongPollTimeoutSeconds = Math.max(
    1,
    Math.floor(TELEGRAM_GET_UPDATES_REQUEST_TIMEOUT_MS / 1e3) -
      TELEGRAM_LONG_POLL_ABORT_MARGIN_SECONDS,
  );
  return Math.min(
    typeof timeoutSeconds === "number" && Number.isFinite(timeoutSeconds)
      ? Math.max(1, Math.floor(timeoutSeconds))
      : TELEGRAM_DEFAULT_LONG_POLL_TIMEOUT_SECONDS,
    maxLongPollTimeoutSeconds,
  );
}
function resolveTelegramStartupProbeTimeoutMs(timeoutSeconds) {
  const getMeTimeoutMs = resolveTelegramRequestTimeoutMs("getme") ?? 15e3;
  if (typeof timeoutSeconds !== "number" || !Number.isFinite(timeoutSeconds)) return getMeTimeoutMs;
  const configuredTimeoutMs = resolveConfiguredTelegramRequestTimeoutMs(timeoutSeconds) ?? 1e3;
  return Math.max(getMeTimeoutMs, configuredTimeoutMs);
}
//#endregion
export {
  resolveTelegramStartupProbeTimeoutMs as i,
  resolveTelegramLongPollTimeoutSeconds as n,
  resolveTelegramRequestTimeoutMs as r,
  TELEGRAM_GET_UPDATES_REQUEST_TIMEOUT_MS as t,
};
