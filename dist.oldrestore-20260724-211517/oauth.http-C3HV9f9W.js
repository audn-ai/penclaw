import { r as fetchWithSsrFGuard } from "./fetch-guard-Da47iiZE.js";
import { t as withTrustedEnvProxyGuardedFetchMode } from "./fetch-runtime-DvrgqKVd.js";
import { d as readResponseWithLimit } from "./http-body-aoMvQQlg.js";
import "./response-limit-runtime-B_DBKaLw.js";
import { a as DEFAULT_FETCH_TIMEOUT_MS } from "./oauth.shared-BD6M390i.js";
import "./ssrf-runtime-DJ478vv8.js";
import { c as shouldUseEnvHttpProxyForUrl } from "./proxy-env-5nRGQyQD.js";
//#region extensions/google/oauth.http.ts
const GOOGLE_OAUTH_BODY_MAX_BYTES = 16 * 1024 * 1024;
async function fetchWithTimeout(url, init, timeoutMs = DEFAULT_FETCH_TIMEOUT_MS) {
  const guardedOptions = {
    url,
    init,
    timeoutMs,
    signal: init.signal ?? void 0,
  };
  const { response, release } = await fetchWithSsrFGuard(
    shouldUseEnvHttpProxyForUrl(url)
      ? withTrustedEnvProxyGuardedFetchMode(guardedOptions)
      : guardedOptions,
  );
  try {
    const body = await readResponseWithLimit(response, GOOGLE_OAUTH_BODY_MAX_BYTES, {
      onOverflow: ({ size, maxBytes }) =>
        /* @__PURE__ */ new Error(
          `google HTTP fetch: body exceeds ${maxBytes} bytes (got ${size})`,
        ),
    });
    const bodyBytes = new Uint8Array(body.buffer, body.byteOffset, body.byteLength);
    return new Response(bodyBytes, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  } finally {
    await release();
  }
}
//#endregion
export { fetchWithTimeout as t };
