import {
  r as BROWSER_REQUEST_GATEWAY_SCOPES,
  t as BROWSER_REQUEST_GATEWAY_METHOD,
} from "./browser-gateway-contract-B6OC_gCs.js";
import { h as normalizeBrowserTimerDelayMs } from "./cdp.helpers-ChuUODxP.js";
import "./number-runtime-B-n-wjMn.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import { n as callGatewayFromCli } from "./gateway-rpc-DpocbsVi.js";
import {
  b as parseStrictPositiveInteger,
  y as parseStrictNonNegativeInteger,
} from "./number-coercion-CJQ8TR--.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import "./core-api-CbAkgF5l.js";
//#region extensions/browser/src/cli/browser-cli-shared.ts
/**
 * Shared Browser CLI option parsing and gateway request helpers.
 */
/** Help text for user-facing tab references accepted by Browser CLI commands. */
const BROWSER_TAB_REFERENCE_HELP =
  "Tab reference: suggested target id, tab id, label, raw target id, or unique raw prefix";
function normalizeQuery(query) {
  if (!query) return;
  const out = {};
  for (const [key, value] of Object.entries(query)) {
    if (value === void 0) continue;
    out[key] = String(value);
  }
  return Object.keys(out).length ? out : void 0;
}
/** Parses a positive integer value for Browser CLI options. */
function parseBrowserPositiveIntegerValue(value) {
  return parseStrictPositiveInteger(value);
}
/** Parses a non-negative integer value for Browser CLI options. */
function parseBrowserNonNegativeIntegerValue(value) {
  return parseStrictNonNegativeInteger(value);
}
/** Parses and validates a required positive integer CLI option. */
function parseBrowserPositiveIntegerOption(raw, flag) {
  const parsed = parseBrowserPositiveIntegerValue(raw);
  if (parsed === void 0) throw new Error(`${flag} must be a positive integer.`);
  return parsed;
}
/** Parses and validates a required non-negative integer CLI option. */
function parseBrowserNonNegativeIntegerOption(raw, flag) {
  const parsed = parseBrowserNonNegativeIntegerValue(raw);
  if (parsed === void 0) throw new Error(`${flag} must be a non-negative integer.`);
  return parsed;
}
/** Calls the Browser gateway request method with normalized timeout/query options. */
async function callBrowserRequest(opts, params, extra) {
  const resolvedTimeoutMs =
    typeof extra?.timeoutMs === "number" && Number.isFinite(extra.timeoutMs)
      ? normalizeBrowserTimerDelayMs(extra.timeoutMs)
      : typeof opts.timeout === "string"
        ? normalizeBrowserTimerDelayMs(parseBrowserPositiveIntegerOption(opts.timeout, "--timeout"))
        : void 0;
  const resolvedTimeout =
    typeof resolvedTimeoutMs === "number" && Number.isFinite(resolvedTimeoutMs)
      ? resolvedTimeoutMs
      : void 0;
  const timeout = typeof resolvedTimeout === "number" ? String(resolvedTimeout) : opts.timeout;
  const payload = await callGatewayFromCli(
    BROWSER_REQUEST_GATEWAY_METHOD,
    {
      ...opts,
      timeout,
    },
    {
      method: params.method,
      path: params.path,
      query: normalizeQuery(params.query),
      body: params.body,
      timeoutMs: resolvedTimeout,
    },
    {
      progress: extra?.progress,
      scopes: [...BROWSER_REQUEST_GATEWAY_SCOPES],
    },
  );
  if (payload === void 0) throw new Error("Unexpected browser.request response");
  return payload;
}
/** Sends a Browser resize action through the shared request helper. */
async function callBrowserResize(opts, params, extra) {
  return callBrowserRequest(
    opts,
    {
      method: "POST",
      path: "/act",
      query: params.profile ? { profile: params.profile } : void 0,
      body: {
        kind: "resize",
        width: params.width,
        height: params.height,
        targetId: normalizeOptionalString(params.targetId),
      },
    },
    extra,
  );
}
//#endregion
export {
  parseBrowserNonNegativeIntegerValue as a,
  parseBrowserNonNegativeIntegerOption as i,
  callBrowserRequest as n,
  parseBrowserPositiveIntegerOption as o,
  callBrowserResize as r,
  parseBrowserPositiveIntegerValue as s,
  BROWSER_TAB_REFERENCE_HELP as t,
};
