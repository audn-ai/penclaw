import { t as expectDefined } from "./expect-CyE8FADM.js";
import "./src-Bl7G9qvi.js";
import { r as readTrimmedStringAlias } from "./string-readers-A0wspDGq.js";
//#region src/infra/net/proxy-env.ts
const PROXY_ENV_KEYS = [
  "HTTP_PROXY",
  "HTTPS_PROXY",
  "ALL_PROXY",
  "http_proxy",
  "https_proxy",
  "all_proxy",
];
/** Return whether any supported proxy environment variable is non-blank. */
function hasProxyEnvConfigured(env = process.env) {
  return readTrimmedStringAlias(env, PROXY_ENV_KEYS) !== void 0;
}
function normalizeProxyEnvValue(value) {
  if (typeof value !== "string") return;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}
/**
 * Match undici EnvHttpProxyAgent semantics for env-based HTTP/S proxy selection:
 * - lower-case vars take precedence over upper-case
 * - HTTPS requests prefer https_proxy/HTTPS_PROXY, then fall back to http_proxy/HTTP_PROXY
 * - ALL_PROXY is ignored by EnvHttpProxyAgent
 */
function resolveEnvHttpProxyUrl(protocol, env = process.env) {
  const lowerHttpProxy = normalizeProxyEnvValue(env.http_proxy);
  const lowerHttpsProxy = normalizeProxyEnvValue(env.https_proxy);
  const httpProxy =
    lowerHttpProxy !== void 0 ? lowerHttpProxy : normalizeProxyEnvValue(env.HTTP_PROXY);
  const httpsProxy =
    lowerHttpsProxy !== void 0 ? lowerHttpsProxy : normalizeProxyEnvValue(env.HTTPS_PROXY);
  if (protocol === "https") return httpsProxy ?? httpProxy ?? void 0;
  return httpProxy ?? void 0;
}
/** Return whether EnvHttpProxyAgent-style HTTP/S proxy resolution finds a proxy URL. */
function hasEnvHttpProxyConfigured(protocol = "https", env = process.env) {
  return resolveEnvHttpProxyUrl(protocol, env) !== void 0;
}
function resolveEnvAllProxyUrl(env) {
  const lowerAllProxy = normalizeProxyEnvValue(env.all_proxy);
  return (
    (lowerAllProxy !== void 0 ? lowerAllProxy : normalizeProxyEnvValue(env.ALL_PROXY)) ?? void 0
  );
}
/**
 * Build explicit options for undici's EnvHttpProxyAgent.
 *
 * EnvHttpProxyAgent does not read ALL_PROXY itself, but it accepts explicit
 * HTTP/HTTPS proxy overrides. Keep this helper separate from the
 * HTTP(S)-only URL helpers so SSRF trusted-env proxy gates do not widen.
 */
function resolveEnvHttpProxyAgentOptions(env = process.env) {
  const allProxy = resolveEnvAllProxyUrl(env);
  const httpProxy = resolveEnvHttpProxyUrl("http", env) ?? allProxy;
  const httpsProxy = resolveEnvHttpProxyUrl("https", env) ?? httpProxy;
  const options = {
    ...(httpProxy ? { httpProxy } : {}),
    ...(httpsProxy ? { httpsProxy } : {}),
  };
  return options.httpProxy || options.httpsProxy ? options : void 0;
}
/** Return whether explicit EnvHttpProxyAgent options can be built from the environment. */
function hasEnvHttpProxyAgentConfigured(env = process.env) {
  return resolveEnvHttpProxyAgentOptions(env) !== void 0;
}
/** Return whether a target URL should use configured HTTP/S env proxy variables. */
function shouldUseEnvHttpProxyForUrl(targetUrl, env = process.env) {
  let protocol;
  try {
    const parsed = new URL(targetUrl);
    if (parsed.protocol === "http:") protocol = "http";
    else if (parsed.protocol === "https:") protocol = "https";
    else return false;
  } catch {
    return false;
  }
  return hasEnvHttpProxyConfigured(protocol, env) && !matchesNoProxy(targetUrl, env);
}
/**
 * Check whether a target URL should bypass the HTTP proxy per NO_PROXY env var.
 *
 * Mirrors undici EnvHttpProxyAgent semantics
 * (`undici/lib/dispatcher/env-http-proxy-agent.js`):
 * - Entries separated by commas OR whitespace (undici splits on `/[,\s]/`)
 * - Case-insensitive
 * - Empty or missing → no bypass
 * - Bare `*` value → bypass everything
 * - Exact hostname match
 * - Leading-dot match (`.example.com` matches `foo.example.com`)
 * - Leading `*.` wildcard match (`*.example.com` matches `foo.example.com`);
 *   undici normalizes via `.replace(/^\*?\./, '')`, so the bare domain also
 *   matches (kept in sync with that behavior)
 * - Subdomain suffix match (`openai.com` matches `api.openai.com`)
 * - Optional `:port` suffix; when present, must match target port
 * - IPv6 literals in bracketed (`[::1]`) or bare (`::1`) form
 * - OpenClaw extension: IPv4 CIDR and octet-wildcard entries
 *   (`100.64.0.0/10`, `100.64.*`) bypass the trusted env proxy mode before
 *   undici's EnvHttpProxyAgent is selected.
 *
 * Undici does not export its matcher, so this is a targeted reimplementation
 * kept in sync with the upstream file above. Paired with
 * `hasEnvHttpProxyConfigured` this gates the trusted-env-proxy auto-upgrade
 * in provider HTTP helpers; see openclaw#64974 review thread on NO_PROXY
 * SSRF bypass.
 */
function matchesNoProxy(targetUrl, env = process.env) {
  const raw = normalizeProxyEnvValue(env.no_proxy) ?? normalizeProxyEnvValue(env.NO_PROXY);
  if (!raw) return false;
  let parsed;
  try {
    parsed = new URL(targetUrl);
  } catch {
    return false;
  }
  const targetHost = parsed.hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (!targetHost) return false;
  if (raw === "*") return true;
  const targetPort =
    parsed.port !== ""
      ? parsed.port
      : parsed.protocol === "https:"
        ? "443"
        : parsed.protocol === "http:"
          ? "80"
          : "";
  for (const rawEntry of raw.split(/[,\s]/)) {
    const entry = rawEntry.trim().toLowerCase();
    if (!entry) continue;
    let entryHost;
    let entryPort;
    if (entry.startsWith("[")) {
      const m = entry.match(/^\[([^\]]+)\](?::(\d+))?$/);
      if (!m) continue;
      entryHost = expectDefined(m[1], "m capture group 1");
      entryPort = m[2];
    } else {
      const firstColonIdx = entry.indexOf(":");
      const lastColonIdx = entry.lastIndexOf(":");
      if (
        firstColonIdx > -1 &&
        firstColonIdx === lastColonIdx &&
        /^\d+$/.test(entry.slice(lastColonIdx + 1))
      ) {
        entryHost = entry.slice(0, lastColonIdx);
        entryPort = entry.slice(lastColonIdx + 1);
      } else entryHost = entry;
    }
    if (entryPort && entryPort !== targetPort) continue;
    const normalizedEntry = entryHost.replace(/^\*\./, "").replace(/^\./, "");
    if (!normalizedEntry || normalizedEntry === "*") continue;
    if (matchesIpv4NoProxyPattern(targetHost, normalizedEntry)) return true;
    if (targetHost === normalizedEntry) return true;
    if (targetHost.endsWith("." + normalizedEntry)) return true;
  }
  return false;
}
function parseIpv4Address(host) {
  const parts = host.split(".");
  if (parts.length !== 4) return;
  let value = 0;
  for (const part of parts) {
    if (!/^\d{1,3}$/.test(part)) return;
    const octet = Number(part);
    if (!Number.isInteger(octet) || octet < 0 || octet > 255) return;
    value = (value << 8) | octet;
  }
  return value >>> 0;
}
function matchesIpv4NoProxyPattern(targetHost, entryHost) {
  const target = parseIpv4Address(targetHost);
  if (target === void 0) return false;
  const cidrMatch = entryHost.match(/^(\d{1,3}(?:\.\d{1,3}){3})\/(\d{1,2})$/);
  if (cidrMatch) {
    const network = parseIpv4Address(expectDefined(cidrMatch[1], "cidr match capture group 1"));
    const prefixLength = Number(cidrMatch[2]);
    if (network === void 0 || prefixLength < 0 || prefixLength > 32) return false;
    const mask = prefixLength === 0 ? 0 : (4294967295 << (32 - prefixLength)) >>> 0;
    return (target & mask) === (network & mask);
  }
  if (!entryHost.includes("*")) return false;
  const targetParts = targetHost.split(".");
  const patternParts = entryHost.split(".");
  if (patternParts.length > 4 || patternParts.length === 0) return false;
  for (const [index, part] of patternParts.entries()) {
    if (part === "*") {
      if (index === patternParts.length - 1) return true;
      continue;
    }
    if (!/^\d{1,3}$/.test(part) || Number(part) !== Number(targetParts[index])) return false;
  }
  return patternParts.length === targetParts.length;
}
//#endregion
export {
  matchesNoProxy as a,
  shouldUseEnvHttpProxyForUrl as c,
  hasProxyEnvConfigured as i,
  hasEnvHttpProxyAgentConfigured as n,
  resolveEnvHttpProxyAgentOptions as o,
  hasEnvHttpProxyConfigured as r,
  resolveEnvHttpProxyUrl as s,
  PROXY_ENV_KEYS as t,
};
