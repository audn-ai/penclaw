import { intro, note, outro, spinner } from "@clack/prompts";
import {
  n as resolveGithubCopilotDomain,
  t as PUBLIC_GITHUB_COPILOT_DOMAIN,
} from "./domain-D8-95X4Y.js";
import { r as fetchWithSsrFGuard } from "./fetch-guard-Da47iiZE.js";
import { r as logConfigUpdated } from "./logging-C64BTYfR.js";
import {
  C as resolveExpiresAtMsFromDurationMs,
  h as nonNegativeSecondsToSafeMilliseconds,
  j as resolveTimerTimeoutMs,
  x as positiveSecondsToSafeMilliseconds,
} from "./number-coercion-CJQ8TR--.js";
import "./number-runtime-B-n-wjMn.js";
import { c as upsertAuthProfileWithLock } from "./profiles-DxTOoenK.js";
import { r as stylePromptTitle } from "./prompt-style-BQVvtDcR.js";
import { t as applyAuthProfileConfig } from "./provider-auth-helpers-CLs4Yz61.js";
import { o as normalizeGithubCopilotDomain } from "./provider-auth-mypr64nh.js";
import { m as readProviderJsonResponse } from "./provider-http-errors-DLMRBkZU.js";
import "./config-mutation-FDl4lip6.js";
import "./ssrf-runtime-DJ478vv8.js";
import "./cli-runtime-B2OG9Kfj.js";
import "./provider-http-BDIltggC.js";
import { d as updateConfig } from "./shared-DFGOIlxJ.js";
import { i as ensureAuthProfileStore } from "./store-B7DoDdVM.js";
//#region extensions/github-copilot/login.ts
const CLIENT_ID = "Iv1.b507a08c87ecfe98";
const GITHUB_DEVICE_FLOW_REQUEST_TIMEOUT_MS = 3e4;
const deviceCodeUrl = (domain) => `https://${domain}/login/device/code`;
const accessTokenUrl = (domain) => `https://${domain}/login/oauth/access_token`;
const deviceVerificationUrl = (domain) => `https://${domain}/login/device`;
const githubAuthSsrfPolicy = (domain) => ({ hostnameAllowlist: [domain] });
const GITHUB_DEVICE_ACCESS_DENIED = Symbol("github-device-access-denied");
const GITHUB_DEVICE_EXPIRED = Symbol("github-device-expired");
var GitHubDeviceFlowError = class extends Error {
  constructor(kind, message) {
    super(message);
    this.kind = kind;
    this.name = "GitHubDeviceFlowError";
  }
};
let githubDeviceFlowFetchGuard = fetchWithSsrFGuard;
function setGitHubCopilotDeviceFlowFetchGuardForTesting(impl) {
  githubDeviceFlowFetchGuard = impl ?? fetchWithSsrFGuard;
}
async function upsertAuthProfileWithLockOrThrow(params) {
  if (!(await upsertAuthProfileWithLock(params)))
    throw new Error(
      "Failed to update auth profile store; the auth store lock may be busy. Wait a moment and retry.",
    );
}
function isGitHubDeviceAccessDeniedError(err) {
  return err instanceof GitHubDeviceFlowError && err.kind === GITHUB_DEVICE_ACCESS_DENIED;
}
function isGitHubDeviceExpiredError(err) {
  return err instanceof GitHubDeviceFlowError && err.kind === GITHUB_DEVICE_EXPIRED;
}
function parseJsonResponse(value) {
  if (!value || typeof value !== "object") throw new Error("Unexpected response from GitHub");
  return value;
}
function parseDeviceCodeResponse(value, issuedAt) {
  const expiresInMs = positiveSecondsToSafeMilliseconds(value.expires_in);
  const intervalMs = nonNegativeSecondsToSafeMilliseconds(value.interval);
  const expiresAt =
    expiresInMs === void 0
      ? void 0
      : resolveExpiresAtMsFromDurationMs(expiresInMs, { nowMs: issuedAt });
  if (
    typeof value.device_code !== "string" ||
    !value.device_code ||
    typeof value.user_code !== "string" ||
    !value.user_code ||
    typeof value.verification_uri !== "string" ||
    !value.verification_uri ||
    expiresInMs === void 0 ||
    expiresAt === void 0 ||
    intervalMs === void 0
  )
    throw new Error("GitHub device code response missing fields");
  return {
    deviceCode: value.device_code,
    userCode: value.user_code,
    verificationUri: value.verification_uri,
    expiresInMs,
    expiresAt,
    intervalMs,
  };
}
async function postGitHubDeviceFlowForm(params) {
  const { response, release } = await githubDeviceFlowFetchGuard({
    url: params.url,
    init: {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.body,
    },
    ...(params.signal ? { signal: params.signal } : {}),
    requireHttps: true,
    policy: githubAuthSsrfPolicy(params.domain),
    auditContext: "github-copilot-device-flow",
    timeoutMs: GITHUB_DEVICE_FLOW_REQUEST_TIMEOUT_MS,
  });
  try {
    if (!response.ok) throw new Error(`${params.failureLabel}: HTTP ${response.status}`);
    return parseJsonResponse(
      await readProviderJsonResponse(response, "github-copilot.device-flow"),
    );
  } finally {
    await release();
  }
}
async function requestDeviceCode(params) {
  const body = new URLSearchParams({
    client_id: CLIENT_ID,
    scope: params.scope,
  });
  return parseDeviceCodeResponse(
    await postGitHubDeviceFlowForm({
      url: deviceCodeUrl(params.domain),
      body,
      failureLabel: "GitHub device code failed",
      domain: params.domain,
      ...(params.signal ? { signal: params.signal } : {}),
    }),
    Date.now(),
  );
}
async function pollForAccessToken(params) {
  const bodyBase = new URLSearchParams({
    client_id: CLIENT_ID,
    device_code: params.deviceCode,
    grant_type: "urn:ietf:params:oauth:grant-type:device_code",
  });
  while (Date.now() < params.expiresAt) {
    const json = await postGitHubDeviceFlowForm({
      url: accessTokenUrl(params.domain),
      body: bodyBase,
      failureLabel: "GitHub device token failed",
      domain: params.domain,
      ...(params.signal ? { signal: params.signal } : {}),
    });
    if ("access_token" in json && typeof json.access_token === "string") return json.access_token;
    const err = "error" in json ? json.error : "unknown";
    if (err === "authorization_pending") {
      await sleepGitHubDevicePollDelay(params.intervalMs, params.expiresAt, params.signal);
      continue;
    }
    if (err === "slow_down") {
      await sleepGitHubDevicePollDelay(params.intervalMs + 2e3, params.expiresAt, params.signal);
      continue;
    }
    if (err === "expired_token")
      throw new GitHubDeviceFlowError(
        GITHUB_DEVICE_EXPIRED,
        "GitHub device code expired; run login again",
      );
    if (err === "access_denied")
      throw new GitHubDeviceFlowError(GITHUB_DEVICE_ACCESS_DENIED, "GitHub login cancelled");
    throw new Error(`GitHub device flow error: ${err}`);
  }
  throw new GitHubDeviceFlowError(
    GITHUB_DEVICE_EXPIRED,
    "GitHub device code expired; run login again",
  );
}
async function sleepGitHubDevicePollDelay(delayMs, expiresAt, signal) {
  const requestedDelayMs = Math.max(1, Math.floor(delayMs));
  const targetAt = Math.min(Date.now() + requestedDelayMs, expiresAt);
  while (Date.now() < targetAt) {
    const remainingMs = Math.max(1, targetAt - Date.now());
    const safeDelayMs = resolveTimerTimeoutMs(remainingMs, 1);
    const waitMs = Math.min(safeDelayMs, remainingMs);
    await new Promise((resolve, reject) => {
      const onAbort = () => {
        clearTimeout(timeout);
        reject(
          signal?.reason instanceof Error
            ? signal.reason
            : /* @__PURE__ */ new Error("GitHub login cancelled"),
        );
      };
      const timeout = setTimeout(() => {
        signal?.removeEventListener("abort", onAbort);
        resolve();
      }, waitMs);
      signal?.addEventListener("abort", onAbort, { once: true });
      if (signal?.aborted) onAbort();
    });
  }
}
function normalizeGitHubDeviceVerificationUrl(raw, domain) {
  let parsed;
  try {
    parsed = new URL(raw);
  } catch {
    throw new Error("GitHub device flow returned an invalid verification URL");
  }
  if (
    parsed.protocol !== "https:" ||
    parsed.hostname !== domain ||
    parsed.pathname !== "/login/device" ||
    parsed.username ||
    parsed.password
  )
    throw new Error("GitHub device flow returned an unexpected verification URL");
  return deviceVerificationUrl(domain);
}
function normalizeGitHubDeviceUserCode(raw) {
  const userCode = raw.trim();
  if (!userCode || userCode.length > 64)
    throw new Error("GitHub device flow returned an invalid user code");
  return userCode;
}
async function runGitHubCopilotDeviceFlow(io, domain = PUBLIC_GITHUB_COPILOT_DOMAIN) {
  const host = normalizeGithubCopilotDomain(domain);
  const device = await requestDeviceCode({
    scope: "read:user",
    domain: host,
    ...(io.signal ? { signal: io.signal } : {}),
  });
  const verificationUrl = normalizeGitHubDeviceVerificationUrl(device.verificationUri, host);
  const userCode = normalizeGitHubDeviceUserCode(device.userCode);
  await io.showCode({
    verificationUrl,
    userCode,
    expiresInMs: device.expiresInMs,
  });
  try {
    await io.openUrl?.(verificationUrl);
  } catch {}
  try {
    return {
      status: "authorized",
      accessToken: await pollForAccessToken({
        deviceCode: device.deviceCode,
        intervalMs: Math.max(1e3, device.intervalMs),
        expiresAt: device.expiresAt,
        domain: host,
        ...(io.signal ? { signal: io.signal } : {}),
      }),
    };
  } catch (err) {
    if (isGitHubDeviceAccessDeniedError(err)) return { status: "access_denied" };
    if (isGitHubDeviceExpiredError(err)) return { status: "expired" };
    throw err;
  }
}
function withGithubCopilotDomainConfig(cfg, domain) {
  const models = cfg.models ?? {};
  const providers = models.providers ?? {};
  const provider = providers["github-copilot"];
  const params = provider?.params;
  const isDefault = domain === PUBLIC_GITHUB_COPILOT_DOMAIN;
  if (isDefault && !(params && "githubDomain" in params)) return cfg;
  const nextParams = { ...params };
  if (isDefault) delete nextParams.githubDomain;
  else nextParams.githubDomain = domain;
  const nextProviders = { ...providers };
  if (provider)
    nextProviders["github-copilot"] = {
      ...provider,
      params: nextParams,
    };
  else Object.assign(nextProviders, { "github-copilot": { params: nextParams } });
  return {
    ...cfg,
    models: {
      ...models,
      providers: nextProviders,
    },
  };
}
async function githubCopilotLoginCommand(opts, runtime) {
  if (!process.stdin.isTTY) throw new Error("github-copilot login requires an interactive TTY.");
  intro(stylePromptTitle("GitHub Copilot login"));
  const profileId = opts.profileId?.trim() || "github-copilot:github";
  if (
    ensureAuthProfileStore(opts.agentDir, { allowKeychainPrompt: false }).profiles[profileId] &&
    !opts.yes
  )
    note(
      `Auth profile already exists: ${profileId}\nRe-running will overwrite it.`,
      stylePromptTitle("Existing credentials"),
    );
  const domain = resolveGithubCopilotDomain();
  if (domain !== "github.com")
    note(
      `Using the GitHub Enterprise domain from COPILOT_GITHUB_DOMAIN (${domain}). Unset it to log in against github.com.`,
      stylePromptTitle("GitHub Copilot"),
    );
  const spin = spinner();
  spin.start(`Requesting device code from ${domain}...`);
  const device = await requestDeviceCode({
    scope: "read:user",
    domain,
  });
  spin.stop("Device code ready");
  note(
    [`Visit: ${device.verificationUri}`, `Code: ${device.userCode}`].join("\n"),
    stylePromptTitle("Authorize"),
  );
  const intervalMs = Math.max(1e3, device.intervalMs);
  const polling = spinner();
  polling.start("Waiting for GitHub authorization...");
  const accessToken = await pollForAccessToken({
    deviceCode: device.deviceCode,
    intervalMs,
    expiresAt: device.expiresAt,
    domain,
  });
  polling.stop("GitHub access token acquired");
  await upsertAuthProfileWithLockOrThrow({
    profileId,
    credential: {
      type: "token",
      provider: "github-copilot",
      token: accessToken,
    },
    agentDir: opts.agentDir,
  });
  await updateConfig((cfg) =>
    withGithubCopilotDomainConfig(
      applyAuthProfileConfig(cfg, {
        provider: "github-copilot",
        profileId,
        mode: "token",
      }),
      domain,
    ),
  );
  logConfigUpdated(runtime);
  runtime.log(`Auth profile: ${profileId} (github-copilot/token)`);
  outro("Done");
}
//#endregion
export {
  withGithubCopilotDomainConfig as i,
  runGitHubCopilotDeviceFlow as n,
  setGitHubCopilotDeviceFlowFetchGuardForTesting as r,
  githubCopilotLoginCommand as t,
};
