import os from "node:os";
import { t as resolveAdvertisedLanHost } from "./advertised-lan-host-EzCosS8d.js";
import { r as materializeGatewayAuthSecretRefs } from "./auth-config-utils-CD1fFT1Z.js";
import { t as assertExplicitGatewayAuthModeWhenBothConfigured } from "./auth-mode-policy-DKWQE9Br.js";
import {
  b as PAIRING_SETUP_BOOTSTRAP_PROFILE,
  i as issueDeviceBootstrapToken,
  v as FULL_ACCESS_PAIRING_SETUP_BOOTSTRAP_PROFILE,
  x as deviceBootstrapProfilesEqual,
  y as NODE_PAIRING_SETUP_BOOTSTRAP_PROFILE,
} from "./device-bootstrap-km7Bg8Dl.js";
import { t as resolveGatewayBindUrl } from "./gateway-bind-url-BQi9umgg.js";
import {
  a as isCarrierGradeNatIpv4Address,
  c as isIpv4Address,
  f as isLoopbackIpAddress,
  g as parseCanonicalIpAddress,
  l as isIpv6Address,
  m as isRfc1918Ipv4Address,
} from "./ip-CyyRxPli.js";
import {
  i as safeNetworkInterfaces,
  n as pickMatchingExternalInterfaceAddress,
} from "./network-interfaces-S5y8vKUw.js";
import { f as resolveGatewayPort } from "./paths-DEklnbzU.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
} from "./string-coerce-DW4mBlAt.js";
import {
  n as resolveTailscalePublishedHost,
  r as resolveTailscaleServeGatewayUrlsWithRunner,
  t as resolveTailnetHostWithRunner,
} from "./tailscale-status-DcvtFQ5I.js";
import {
  g as resolveSecretInputRef,
  p as normalizeSecretInputString,
} from "./types.secrets-BV0ywRAy.js";
//#region src/pairing/setup-code.ts
const PAIRING_SETUP_MAX_URLS = 8;
function describeSecureMobilePairingFix(source) {
  return (
    "Tailscale and public mobile pairing require a secure gateway URL (wss://) or Tailscale Serve/Funnel." +
    (source ? ` Resolved source: ${source}.` : "") +
    " Fix: use a private LAN address, prefer gateway.tailscale.mode=serve, or set gateway.remote.url / plugins.entries.device-pair.config.publicUrl to a wss:// URL. ws:// is only valid for localhost, private LAN addresses, .local hosts, or the Android emulator."
  );
}
function normalizeMobilePairingHost(host) {
  let normalized = normalizeLowercaseStringOrEmpty(host);
  if (normalized.startsWith("[") && normalized.endsWith("]")) normalized = normalized.slice(1, -1);
  if (normalized.endsWith(".")) normalized = normalized.slice(0, -1);
  const zoneIndex = normalized.indexOf("%");
  if (zoneIndex >= 0) normalized = normalized.slice(0, zoneIndex);
  return normalized;
}
function isPrivateLanHost(host) {
  const normalized = normalizeMobilePairingHost(host);
  if (normalized.endsWith(".local")) return true;
  if (isRfc1918Ipv4Address(normalized)) return true;
  const parsed = parseCanonicalIpAddress(normalized);
  if (!parsed) return false;
  if (isIpv4Address(parsed)) {
    const normalizedIp = parsed.toString();
    return normalizedIp.startsWith("169.254.") && !isCarrierGradeNatIpv4Address(normalizedIp);
  }
  if (!isIpv6Address(parsed)) return false;
  const normalizedIp = normalizeLowercaseStringOrEmpty(parsed.toString());
  return (
    normalizedIp.startsWith("fe80:") ||
    normalizedIp.startsWith("fc") ||
    normalizedIp.startsWith("fd")
  );
}
function isMobilePairingCleartextAllowedHost(host) {
  const normalized = normalizeMobilePairingHost(host);
  return (
    normalized === "localhost" ||
    isLoopbackIpAddress(normalized) ||
    normalized === "10.0.2.2" ||
    isPrivateLanHost(normalized)
  );
}
function isFullAccessMobilePairingUrl(url) {
  try {
    const parsed = new URL(url);
    if (parsed.protocol === "wss:") return true;
    const host = normalizeMobilePairingHost(parsed.hostname);
    return parsed.protocol === "ws:" && (host === "localhost" || isLoopbackIpAddress(host));
  } catch {
    return false;
  }
}
function resolvePairingSetupAccess(profile) {
  if (deviceBootstrapProfilesEqual(profile, FULL_ACCESS_PAIRING_SETUP_BOOTSTRAP_PROFILE))
    return "full";
  if (deviceBootstrapProfilesEqual(profile, NODE_PAIRING_SETUP_BOOTSTRAP_PROFILE)) return "node";
  return "limited";
}
function validateMobilePairingUrl(url, source) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return "Resolved mobile pairing URL is invalid.";
  }
  const protocol =
    parsed.protocol === "https:" ? "wss:" : parsed.protocol === "http:" ? "ws:" : parsed.protocol;
  if (protocol === "wss:") return null;
  if (protocol !== "ws:" || isMobilePairingCleartextAllowedHost(parsed.hostname)) return null;
  return describeSecureMobilePairingFix(source);
}
const GATEWAY_SCHEME_WITHOUT_AUTHORITY_RE = /^(?:https?|wss?):(?!\/\/)/i;
const SCHEME_LIKE_PATH_RE = /^[A-Za-z][A-Za-z0-9+.-]*:\//;
function normalizeUrl(raw, schemeFallback) {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (GATEWAY_SCHEME_WITHOUT_AUTHORITY_RE.test(trimmed)) return null;
  const parsedUrl = parseNormalizedGatewayUrl(trimmed);
  if (parsedUrl) return parsedUrl;
  if (trimmed.includes("://") || SCHEME_LIKE_PATH_RE.test(trimmed)) return null;
  const withoutPath = normalizeOptionalString(trimmed.split("/", 1)[0]) ?? "";
  return withoutPath ? parseNormalizedGatewayUrl(`${schemeFallback}://${withoutPath}`) : null;
}
function parseNormalizedGatewayUrl(raw) {
  try {
    const parsed = new URL(raw);
    if (parsed.username || parsed.password) return null;
    const scheme = parsed.protocol.replace(":", "");
    if (!scheme) return null;
    const resolvedScheme = scheme === "http" ? "ws" : scheme === "https" ? "wss" : scheme;
    if (resolvedScheme !== "ws" && resolvedScheme !== "wss") return null;
    const host = parsed.hostname;
    if (!host) return null;
    return `${resolvedScheme}://${host}${parsed.port ? `:${parsed.port}` : ""}`;
  } catch {
    return null;
  }
}
function resolveScheme(cfg, opts) {
  if (opts?.forceSecure) return "wss";
  return cfg.gateway?.tls?.enabled === true ? "wss" : "ws";
}
function isTailnetIPv4(address) {
  return isCarrierGradeNatIpv4Address(address);
}
function pickIPv4Matching(networkInterfaces, matches) {
  return (
    pickMatchingExternalInterfaceAddress(safeNetworkInterfaces(networkInterfaces), {
      family: "IPv4",
      matches,
    }) ?? null
  );
}
function pickTailnetIPv4(networkInterfaces) {
  return pickIPv4Matching(networkInterfaces, isTailnetIPv4);
}
function resolvePairingSetupAuthLabel(cfg, env) {
  const mode = cfg.gateway?.auth?.mode;
  const defaults = cfg.secrets?.defaults;
  const tokenRef = resolveSecretInputRef({
    value: cfg.gateway?.auth?.token,
    defaults,
  }).ref;
  const passwordRef = resolveSecretInputRef({
    value: cfg.gateway?.auth?.password,
    defaults,
  }).ref;
  const envToken = normalizeOptionalString(env.OPENCLAW_GATEWAY_TOKEN);
  const envPassword = normalizeOptionalString(env.OPENCLAW_GATEWAY_PASSWORD);
  const token =
    envToken || (tokenRef ? void 0 : normalizeSecretInputString(cfg.gateway?.auth?.token));
  const password =
    envPassword || (passwordRef ? void 0 : normalizeSecretInputString(cfg.gateway?.auth?.password));
  if (mode === "password") {
    if (!password)
      return { error: "Gateway auth is set to password, but no password is configured." };
    return { label: "password" };
  }
  if (mode === "token") {
    if (!token) return { error: "Gateway auth is set to token, but no token is configured." };
    return { label: "token" };
  }
  if (token) return { label: "token" };
  if (password) return { label: "password" };
  return { error: "Gateway auth is not configured (no token or password)." };
}
async function resolveGatewayUrl(cfg, opts) {
  const scheme = resolveScheme(cfg, { forceSecure: opts.forceSecure });
  const port = resolveGatewayPort(cfg, opts.env);
  if (typeof opts.publicUrl === "string" && opts.publicUrl.trim()) {
    const url = normalizeUrl(opts.publicUrl, scheme);
    if (url)
      return {
        url,
        source: "plugins.entries.device-pair.config.publicUrl",
      };
    return { error: "Configured publicUrl is invalid." };
  }
  const remoteUrlRaw = cfg.gateway?.remote?.url;
  const hasRemoteUrl = typeof remoteUrlRaw === "string" && remoteUrlRaw.trim();
  const remoteUrl = hasRemoteUrl ? normalizeUrl(remoteUrlRaw, scheme) : null;
  if (hasRemoteUrl && !remoteUrl) return { error: "Configured gateway.remote.url is invalid." };
  if (opts.preferRemoteUrl && remoteUrl)
    return {
      url: remoteUrl,
      source: "gateway.remote.url",
    };
  const tailscaleMode = cfg.gateway?.tailscale?.mode ?? "off";
  if (tailscaleMode === "serve" || tailscaleMode === "funnel") {
    const host = await resolveTailnetHostWithRunner(opts.runCommandWithTimeout);
    if (!host) return { error: "Tailscale Serve is enabled, but MagicDNS could not be resolved." };
    const publishedHost = resolveTailscalePublishedHost({
      tailscaleMode,
      tailnetHost: host,
      serviceName: cfg.gateway?.tailscale?.serviceName,
    });
    if (!publishedHost)
      return {
        error:
          "Tailscale Serve serviceName is configured, but Service MagicDNS could not be derived.",
      };
    return {
      url: `wss://${publishedHost}`,
      source: `gateway.tailscale.mode=${tailscaleMode}`,
    };
  }
  if (remoteUrl)
    return {
      url: remoteUrl,
      source: "gateway.remote.url",
    };
  const advertisedLanHost =
    cfg.gateway?.bind === "lan"
      ? await resolveAdvertisedLanHost({
          networkInterfaces: opts.networkInterfaces,
          runCommandWithTimeout: opts.runCommandWithTimeout,
        })
      : null;
  const bindResult = resolveGatewayBindUrl({
    bind: cfg.gateway?.bind,
    customBindHost: cfg.gateway?.customBindHost,
    scheme,
    port,
    pickTailnetHost: () => pickTailnetIPv4(opts.networkInterfaces),
    pickLanHost: () => advertisedLanHost,
  });
  if (bindResult) return bindResult;
  return {
    error:
      "Gateway is only bound to loopback. Set gateway.bind=lan, enable tailscale serve, or configure plugins.entries.device-pair.config.publicUrl.",
  };
}
function encodePairingSetupCode(payload) {
  const json = JSON.stringify(payload);
  return Buffer.from(json, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}
async function resolvePairingSetupFromConfig(cfg, options = {}) {
  assertExplicitGatewayAuthModeWhenBothConfigured(cfg);
  const env = options.env ?? process.env;
  const cfgForAuth = await materializeGatewayAuthSecretRefs({
    cfg,
    env,
    mode: cfg.gateway?.auth?.mode,
    hasTokenCandidate: Boolean(normalizeOptionalString(env.OPENCLAW_GATEWAY_TOKEN)),
    hasPasswordCandidate: Boolean(normalizeOptionalString(env.OPENCLAW_GATEWAY_PASSWORD)),
  });
  const authLabel = resolvePairingSetupAuthLabel(cfgForAuth, env);
  if (authLabel.error)
    return {
      ok: false,
      error: authLabel.error,
    };
  const urlResult = await resolveGatewayUrl(cfgForAuth, {
    env,
    publicUrl: options.publicUrl,
    preferRemoteUrl: options.preferRemoteUrl,
    forceSecure: options.forceSecure,
    runCommandWithTimeout: options.runCommandWithTimeout,
    networkInterfaces: options.networkInterfaces ?? os.networkInterfaces,
  });
  if (!urlResult.url)
    return {
      ok: false,
      error: urlResult.error ?? "Gateway URL unavailable.",
    };
  const mobilePairingUrlError = validateMobilePairingUrl(urlResult.url, urlResult.source);
  if (mobilePairingUrlError)
    return {
      ok: false,
      error: mobilePairingUrlError,
    };
  if (!authLabel.label)
    return {
      ok: false,
      error: "Gateway auth is not configured (no token or password).",
    };
  const urls = [urlResult.url];
  if (urlResult.source === "gateway.bind=lan") {
    const serveUrls = await resolveTailscaleServeGatewayUrlsWithRunner(
      resolveGatewayPort(cfgForAuth, env),
      options.runCommandWithTimeout,
    );
    for (const serveUrl of serveUrls)
      if (!validateMobilePairingUrl(serveUrl, "tailscale serve status")) urls.push(serveUrl);
  }
  const uniqueUrls = [...new Set(urls)].slice(0, PAIRING_SETUP_MAX_URLS);
  const requestedBootstrapProfile =
    options.bootstrapProfile ?? FULL_ACCESS_PAIRING_SETUP_BOOTSTRAP_PROFILE;
  const accessDowngraded =
    deviceBootstrapProfilesEqual(
      requestedBootstrapProfile,
      FULL_ACCESS_PAIRING_SETUP_BOOTSTRAP_PROFILE,
    ) && uniqueUrls.some((url) => !isFullAccessMobilePairingUrl(url));
  const issuedBootstrapProfile = accessDowngraded
    ? PAIRING_SETUP_BOOTSTRAP_PROFILE
    : requestedBootstrapProfile;
  return {
    ok: true,
    payload: {
      url: urlResult.url,
      ...(uniqueUrls.length > 1 ? { urls: uniqueUrls } : {}),
      bootstrapToken: (
        await issueDeviceBootstrapToken({
          baseDir: options.pairingBaseDir,
          profile: issuedBootstrapProfile,
        })
      ).token,
    },
    authLabel: authLabel.label,
    urlSource: urlResult.source ?? "unknown",
    access: resolvePairingSetupAccess(issuedBootstrapProfile),
    accessDowngraded,
  };
}
//#endregion
export { resolvePairingSetupFromConfig as n, encodePairingSetupCode as t };
