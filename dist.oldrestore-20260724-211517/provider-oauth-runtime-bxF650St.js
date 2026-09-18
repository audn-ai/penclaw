import { r as toErrorObject } from "./error-coercion-CrJRoLe1.js";
import {
  C as resolveExpiresAtMsFromDurationMs,
  j as resolveTimerTimeoutMs,
  x as positiveSecondsToSafeMilliseconds,
} from "./number-coercion-CJQ8TR--.js";
//#region src/plugin-sdk/provider-oauth-runtime.ts
const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none" aria-hidden="true"><defs><linearGradient id="lobster-gradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ff4d4d"/><stop offset="100%" stop-color="#991b1b"/></linearGradient></defs><path fill="url(#lobster-gradient)" d="M60 10 C30 10 15 35 15 55 C15 75 30 95 45 100 L45 110 L55 110 L55 100 C55 100 60 102 65 100 L65 110 L75 110 L75 100 C90 95 105 75 105 55 C105 35 90 10 60 10Z"/><path fill="url(#lobster-gradient)" d="M20 45 C5 40 0 50 5 60 C10 70 20 65 25 55 C28 48 25 45 20 45Z"/><path fill="url(#lobster-gradient)" d="M100 45 C115 40 120 50 115 60 C110 70 100 65 95 55 C92 48 95 45 100 45Z"/><path stroke="#ff4d4d" stroke-width="3" stroke-linecap="round" d="M45 15 Q35 5 30 8"/><path stroke="#ff4d4d" stroke-width="3" stroke-linecap="round" d="M75 15 Q85 5 90 8"/><circle cx="45" cy="35" r="6" fill="#050810"/><circle cx="75" cy="35" r="6" fill="#050810"/><circle cx="46" cy="34" r="2.5" fill="#00e5cc"/><circle cx="76" cy="34" r="2.5" fill="#00e5cc"/></svg>`;
function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
function renderOAuthPage(options) {
  const title = escapeHtml(options.title);
  const heading = escapeHtml(options.heading);
  const message = escapeHtml(options.message);
  const details = options.details ? escapeHtml(options.details) : void 0;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <style>
    :root {
      --text: #fafafa;
      --text-dim: #a1a1aa;
      --page-bg: #09090b;
      --font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
      --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    }
    * { box-sizing: border-box; }
    html { color-scheme: dark; }
    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      background: var(--page-bg);
      color: var(--text);
      font-family: var(--font-sans);
      text-align: center;
    }
    main {
      width: 100%;
      max-width: 560px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .logo {
      width: 72px;
      height: 72px;
      display: block;
      margin-bottom: 24px;
    }
    h1 {
      margin: 0 0 10px;
      font-size: 28px;
      line-height: 1.15;
      font-weight: 650;
      color: var(--text);
    }
    p {
      margin: 0;
      line-height: 1.7;
      color: var(--text-dim);
      font-size: 15px;
    }
    .details {
      margin-top: 16px;
      font-family: var(--font-mono);
      font-size: 13px;
      color: var(--text-dim);
      white-space: pre-wrap;
      word-break: break-word;
    }
  </style>
</head>
<body>
  <main>
    <div class="logo">${LOGO_SVG}</div>
    <h1>${heading}</h1>
    <p>${message}</p>
    ${details ? `<div class="details">${details}</div>` : ""}
  </main>
</body>
</html>`;
}
/**
 * Renders the local OAuth callback success page after provider authentication completes.
 */
function oauthSuccessHtml(message) {
  return renderOAuthPage({
    title: "Authentication successful",
    heading: "Authentication successful",
    message,
  });
}
/**
 * Renders the local OAuth callback error page without exposing raw credential material.
 */
function oauthErrorHtml(message, details) {
  return renderOAuthPage({
    title: "Authentication failed",
    heading: "Authentication failed",
    message,
    details,
  });
}
function base64urlEncode(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/[=]/g, "");
}
/** Generates an OAuth PKCE verifier and SHA-256 challenge using base64url encoding. */
async function generatePKCE() {
  const verifierBytes = /* @__PURE__ */ new Uint8Array(32);
  crypto.getRandomValues(verifierBytes);
  const verifier = base64urlEncode(verifierBytes);
  const data = new TextEncoder().encode(verifier);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return {
    verifier,
    challenge: base64urlEncode(new Uint8Array(hashBuffer)),
  };
}
/** Generates a random base64url OAuth state value for CSRF protection. */
function generateOAuthState() {
  const stateBytes = /* @__PURE__ */ new Uint8Array(32);
  crypto.getRandomValues(stateBytes);
  return base64urlEncode(stateBytes);
}
/**
 * Parses callback URLs, raw query strings, `code#state`, or plain pasted codes.
 * Empty input returns an empty object so callers can keep prompting.
 */
function parseOAuthAuthorizationInput(input) {
  const value = input.trim();
  if (!value) return {};
  try {
    const url = new URL(value);
    return {
      code: url.searchParams.get("code") ?? void 0,
      state: url.searchParams.get("state") ?? void 0,
    };
  } catch {}
  if (value.includes("#")) {
    const [code, state] = value.split("#", 2);
    return {
      code,
      state,
    };
  }
  if (value.includes("code=")) {
    const params = new URLSearchParams(value);
    return {
      code: params.get("code") ?? void 0,
      state: params.get("state") ?? void 0,
    };
  }
  return { code: value };
}
/** Converts provider `expires_in` seconds into safe positive milliseconds. */
function resolveOAuthTokenLifetimeMs(value) {
  return positiveSecondsToSafeMilliseconds(value);
}
/** Resolves provider token lifetime into an absolute expiry timestamp with optional refresh skew. */
function resolveOAuthTokenExpiresAt(value, options = {}) {
  const lifetimeMs = resolveOAuthTokenLifetimeMs(value);
  return lifetimeMs === void 0
    ? void 0
    : resolveExpiresAtMsFromDurationMs(lifetimeMs, {
        nowMs: options.nowMs,
        bufferMs: options.refreshSkewMs,
      });
}
/**
 * Creates the shared cancellation error used by abortable OAuth login flows.
 */
function createOAuthLoginCancelledError() {
  return /* @__PURE__ */ new Error("Login cancelled");
}
/** Throws the shared OAuth cancellation error when a login signal is already aborted. */
function throwIfOAuthLoginAborted(signal) {
  if (signal?.aborted) throw createOAuthLoginCancelledError();
}
/** Races a pending OAuth login step against the login abort signal and normalizes rejections. */
function withOAuthLoginAbort(promise, signal, onAbort) {
  if (!signal) return promise;
  return new Promise((resolve, reject) => {
    const cleanup = () => {
      signal.removeEventListener("abort", abort);
    };
    const abort = () => {
      cleanup();
      onAbort?.();
      reject(createOAuthLoginCancelledError());
    };
    if (signal.aborted) {
      abort();
      return;
    }
    signal.addEventListener("abort", abort, { once: true });
    promise.then(
      (value) => {
        cleanup();
        resolve(value);
      },
      (error) => {
        cleanup();
        reject(toErrorObject(error, "Non-Error rejection"));
      },
    );
  });
}
/** Combines a caller abort signal with a bounded timeout signal for OAuth HTTP requests. */
function buildOAuthRequestSignal(options) {
  const timeoutSignal = AbortSignal.timeout(resolveTimerTimeoutMs(options.timeoutMs, 0, 0));
  if (!options.signal) return timeoutSignal;
  return AbortSignal.any([options.signal, timeoutSignal]);
}
//#endregion
export {
  oauthErrorHtml as a,
  resolveOAuthTokenExpiresAt as c,
  withOAuthLoginAbort as d,
  generatePKCE as i,
  resolveOAuthTokenLifetimeMs as l,
  createOAuthLoginCancelledError as n,
  oauthSuccessHtml as o,
  generateOAuthState as r,
  parseOAuthAuthorizationInput as s,
  buildOAuthRequestSignal as t,
  throwIfOAuthLoginAborted as u,
};
