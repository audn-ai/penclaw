import { r as fetchWithSsrFGuard } from "./fetch-guard-Da47iiZE.js";
import { t as readFeishuJsonResponse } from "./json-response-BANLr5Ru.js";
import { p as finiteSecondsToTimerSafeMilliseconds } from "./number-coercion-CJQ8TR--.js";
import "./media-runtime-BhmZORKM.js";
import { t as renderQrTerminal } from "./qr-terminal-CJg7Nrhm.js";
import "./number-runtime-B-n-wjMn.js";
import "./runtime-env-D0V-7Gqz.js";
import "./ssrf-runtime-DJ478vv8.js";
import { t as sleep } from "./sleep-DZm1epyW.js";
//#region extensions/feishu/src/app-registration.ts
/**
 * Feishu app registration via OAuth device-code flow.
 *
 * Migrated from feishu-plugin-cli's `feishu-auth.ts` and `install-prompts.ts`.
 * Replaces axios with native fetch, removes inquirer/ora/chalk in favor of
 * the openclaw WizardPrompter surface.
 */
const FEISHU_ACCOUNTS_URL = "https://accounts.feishu.cn";
const LARK_ACCOUNTS_URL = "https://accounts.larksuite.com";
const REGISTRATION_PATH = "/oauth/v1/app/registration";
const REQUEST_TIMEOUT_MS = 1e4;
const DEFAULT_REGISTRATION_POLL_INTERVAL_SECONDS = 5;
const DEFAULT_REGISTRATION_EXPIRE_SECONDS = 600;
function accountsBaseUrl(domain) {
  return domain === "lark" ? LARK_ACCOUNTS_URL : FEISHU_ACCOUNTS_URL;
}
async function postRegistration(baseUrl, body, options) {
  return await fetchFeishuJson({
    url: `${baseUrl}${REGISTRATION_PATH}`,
    init: {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(body).toString(),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    },
    auditContext: "feishu.app-registration.post",
    fetchImpl: options?.fetchImpl,
    lookupFn: options?.lookupFn,
  });
}
async function fetchFeishuJson(params) {
  const { response, release } = await fetchWithSsrFGuard({
    url: params.url,
    init: params.init,
    fetchImpl: params.fetchImpl,
    lookupFn: params.lookupFn,
    policy: { allowedHostnames: [new URL(params.url).hostname] },
    auditContext: params.auditContext,
  });
  try {
    return await readFeishuJsonResponse(response);
  } finally {
    await release();
  }
}
/**
 * Step 1: Initialize registration and verify the environment supports
 * `client_secret` auth.
 *
 * @throws If the environment does not support `client_secret`.
 */
async function initAppRegistration(domain = "feishu", options) {
  if (
    !(
      await postRegistration(accountsBaseUrl(domain), { action: "init" }, options)
    ).supported_auth_methods?.includes("client_secret")
  )
    throw new Error("Current environment does not support client_secret auth method");
}
/**
 * Step 2: Begin the device-code flow. Returns a device code and a QR URL
 * that the user should scan with Feishu/Lark mobile app.
 */
async function beginAppRegistration(domain = "feishu", options) {
  const res = await postRegistration(
    accountsBaseUrl(domain),
    {
      action: "begin",
      archetype: "PersonalAgent",
      auth_method: "client_secret",
      request_user_info: "open_id",
    },
    options,
  );
  const qrUrl = new URL(res.verification_uri_complete);
  qrUrl.searchParams.set("from", "oc_onboard");
  qrUrl.searchParams.set("tp", "ob_cli_app");
  return {
    deviceCode: res.device_code,
    qrUrl: qrUrl.toString(),
    userCode: res.user_code,
    interval:
      finiteSecondsToTimerSafeMilliseconds(res.interval) === void 0
        ? DEFAULT_REGISTRATION_POLL_INTERVAL_SECONDS
        : res.interval,
    expireIn:
      finiteSecondsToTimerSafeMilliseconds(res.expire_in) === void 0
        ? DEFAULT_REGISTRATION_EXPIRE_SECONDS
        : res.expire_in,
  };
}
/**
 * Step 3: Poll for authorization result until success, denial, expiry, or
 * timeout. Automatically handles domain switching when `tenant_brand` is
 * detected as "lark".
 */
async function pollAppRegistration(params) {
  const {
    deviceCode,
    expireIn,
    initialDomain = "feishu",
    abortSignal,
    tp,
    fetchImpl,
    lookupFn,
  } = params;
  let currentInterval = params.interval;
  let domain = initialDomain;
  let domainSwitched = false;
  const expireInMs =
    finiteSecondsToTimerSafeMilliseconds(expireIn) ??
    finiteSecondsToTimerSafeMilliseconds(DEFAULT_REGISTRATION_EXPIRE_SECONDS) ??
    REQUEST_TIMEOUT_MS;
  const deadline = Date.now() + expireInMs;
  while (Date.now() < deadline) {
    if (abortSignal?.aborted) return { status: "timeout" };
    const baseUrl = accountsBaseUrl(domain);
    let pollRes;
    try {
      pollRes = await postRegistration(
        baseUrl,
        {
          action: "poll",
          device_code: deviceCode,
          ...(tp ? { tp } : {}),
        },
        {
          fetchImpl,
          lookupFn,
        },
      );
    } catch {
      await sleepRegistrationPollInterval(currentInterval);
      continue;
    }
    if (pollRes.user_info?.tenant_brand) {
      const isLark = pollRes.user_info.tenant_brand === "lark";
      if (!domainSwitched && isLark) {
        domain = "lark";
        domainSwitched = true;
        continue;
      }
    }
    if (pollRes.client_id && pollRes.client_secret)
      return {
        status: "success",
        result: {
          appId: pollRes.client_id,
          appSecret: pollRes.client_secret,
          domain,
          openId: pollRes.user_info?.open_id,
        },
      };
    if (pollRes.error)
      if (pollRes.error === "authorization_pending") {
      } else if (pollRes.error === "slow_down") currentInterval += 5;
      else if (pollRes.error === "access_denied") return { status: "access_denied" };
      else if (pollRes.error === "expired_token") return { status: "expired" };
      else
        return {
          status: "error",
          message: `${pollRes.error}: ${pollRes.error_description ?? "unknown"}`,
        };
    await sleepRegistrationPollInterval(currentInterval);
  }
  return { status: "timeout" };
}
/**
 * Print QR code directly to stdout.
 *
 * QR codes must be printed without any surrounding box/border decoration,
 * otherwise the pattern is corrupted and cannot be scanned.
 */
async function printQrCode(url) {
  const output = await renderQrTerminal(url, { small: true });
  process.stdout.write(output.endsWith("\n") ? output : `${output}\n`);
}
/**
 * Fetch the app owner's open_id using the application.v6.application.get API.
 *
 * Used during setup to auto-populate security policy allowlists.
 * Returns undefined on any failure (fail-open).
 */
async function getAppOwnerOpenId(params) {
  const baseUrl =
    params.domain === "lark" ? "https://open.larksuite.com" : "https://open.feishu.cn";
  try {
    const tokenData = await fetchFeishuJson({
      url: `${baseUrl}/open-apis/auth/v3/tenant_access_token/internal`,
      init: {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          app_id: params.appId,
          app_secret: params.appSecret,
        }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      },
      auditContext: "feishu.app-registration.owner-token",
      fetchImpl: params.fetchImpl,
      lookupFn: params.lookupFn,
    });
    if (!tokenData.tenant_access_token) return;
    const appData = await fetchFeishuJson({
      url: `${baseUrl}/open-apis/application/v6/applications/${params.appId}?user_id_type=open_id`,
      init: {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenData.tenant_access_token}`,
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      },
      auditContext: "feishu.app-registration.owner-app",
      fetchImpl: params.fetchImpl,
      lookupFn: params.lookupFn,
    });
    if (appData.code !== 0) return;
    const app = appData.data?.app;
    const owner = app?.owner;
    return (owner?.owner_type ?? owner?.type) === 2 && owner?.owner_id
      ? owner.owner_id
      : (app?.creator_id ?? owner?.owner_id);
  } catch {
    return;
  }
}
function sleepRegistrationPollInterval(intervalSeconds) {
  return sleep(
    finiteSecondsToTimerSafeMilliseconds(intervalSeconds) ??
      finiteSecondsToTimerSafeMilliseconds(DEFAULT_REGISTRATION_POLL_INTERVAL_SECONDS) ??
      REQUEST_TIMEOUT_MS,
  );
}
//#endregion
export {
  beginAppRegistration,
  getAppOwnerOpenId,
  initAppRegistration,
  pollAppRegistration,
  printQrCode,
};
