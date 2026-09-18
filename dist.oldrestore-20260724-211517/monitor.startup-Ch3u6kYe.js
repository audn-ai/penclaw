import { b as parseStrictPositiveInteger } from "./number-coercion-CJQ8TR--.js";
import { t as probeFeishu } from "./probe-gUyS3oUp.js";
import "./number-runtime-B-n-wjMn.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
//#region extensions/feishu/src/monitor-startup-timeout.ts
const FEISHU_STARTUP_BOT_INFO_TIMEOUT_DEFAULT_MS = 3e4;
const FEISHU_STARTUP_BOT_INFO_TIMEOUT_ENV = "OPENCLAW_FEISHU_STARTUP_PROBE_TIMEOUT_MS";
function resolveStartupProbeTimeoutMs(env = process.env) {
  const raw = env[FEISHU_STARTUP_BOT_INFO_TIMEOUT_ENV];
  if (raw) {
    const parsed = parseStrictPositiveInteger(raw);
    if (parsed !== void 0) return parsed;
    console.warn(
      `[feishu] ${FEISHU_STARTUP_BOT_INFO_TIMEOUT_ENV}="${raw}" is invalid; using default ${FEISHU_STARTUP_BOT_INFO_TIMEOUT_DEFAULT_MS}ms`,
    );
  }
  return FEISHU_STARTUP_BOT_INFO_TIMEOUT_DEFAULT_MS;
}
//#endregion
//#region extensions/feishu/src/monitor.startup.ts
const FEISHU_STARTUP_BOT_INFO_TIMEOUT_MS = resolveStartupProbeTimeoutMs();
function isTimeoutErrorMessage(message) {
  const lower = normalizeLowercaseStringOrEmpty(message);
  return lower.includes("timeout") || lower.includes("timed out");
}
function isAbortErrorMessage(message) {
  return normalizeLowercaseStringOrEmpty(message).includes("aborted");
}
async function fetchBotIdentityForMonitor(account, options = {}) {
  if (options.abortSignal?.aborted) return {};
  const timeoutMs = options.timeoutMs ?? FEISHU_STARTUP_BOT_INFO_TIMEOUT_MS;
  const result = await probeFeishu(account, {
    timeoutMs,
    abortSignal: options.abortSignal,
  });
  if (result.ok)
    return {
      botOpenId: result.botOpenId,
      botName: result.botName,
    };
  const probeError = result.error ?? void 0;
  if (options.abortSignal?.aborted || isAbortErrorMessage(probeError)) return {};
  if (isTimeoutErrorMessage(probeError))
    (options.runtime?.error ?? console.error)(
      `feishu[${account.accountId}]: bot info probe timed out after ${timeoutMs}ms; continuing startup`,
    );
  return {};
}
//#endregion
export { fetchBotIdentityForMonitor as t };
