import { execFileSync, spawn } from "node:child_process";
import { once } from "node:events";
import fs from "node:fs";
import fs$1 from "node:fs/promises";
import { isIP } from "node:net";
import os from "node:os";
import path from "node:path";
import { setTimeout as setTimeout$1 } from "node:timers/promises";
import { t as createBoundedUtf8Tail } from "./bounded-utf8-tail-zGgVhmwV.js";
import { n as redactCdpUrl } from "./browser-config-BYZ1IWa3.js";
import {
  C as BrowserProfileUnavailableError,
  I as CHROME_STDERR_HINT_MAX_CHARS,
  L as CHROME_STOP_TIMEOUT_MS,
  M as CHROME_BOOTSTRAP_EXIT_TIMEOUT_MS,
  N as CHROME_BOOTSTRAP_PREFS_TIMEOUT_MS,
  P as CHROME_LAUNCH_READY_WINDOW_MS,
  U as ensureAbsoluteDirectory,
  V as assertManagedProxyAllowsCdpUrl,
  c as isWebSocketUrl,
  f as scopeCdpPolicyToConfiguredEndpoint,
  i as fetchJson,
  l as normalizeCdpHttpBaseForJsonEndpoints,
  m as withCdpSocket,
  n as assertCdpEndpointAllowed,
  p as stripCdpUrlCredentials,
  r as fetchCdpChecked,
  s as isDirectCdpWebSocketEndpoint,
  t as appendCdpPath,
  u as openCdpWebSocket,
  v as BROWSER_ERROR_REASONS,
  y as BrowserCdpEndpointBlockedError,
} from "./cdp.helpers-ChuUODxP.js";
import { r as resolveBrowserExecutableForPlatform } from "./chrome.executables-3W0Qoqc0.js";
import {
  i as resolveManagedBrowserHeadlessMode,
  o as DEFAULT_DOWNLOAD_DIR,
  t as getManagedBrowserMissingDisplayError,
} from "./config-CzdiqFrD.js";
import "./number-runtime-B-n-wjMn.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./text-utility-runtime-CJESZCN5.js";
import { p as DEFAULT_OPENCLAW_BROWSER_PROFILE_NAME } from "./constants-C2_ZjRRD.js";
import "./process-runtime-BKNTr1ic.js";
import { t as expectDefined } from "./expect-runtime--WgnKYXT.js";
import "./provider-http-BDIltggC.js";
import { t as normalizeHostname } from "./hostname-DAZapKzN.js";
import { r as saveJsonFile, t as loadJsonFile } from "./json-store-CSxUwOCu.js";
import { t as prepareOomScoreAdjustedSpawn } from "./linux-oom-score-eO5nXmjv.js";
import "./tmp-openclaw-dir-BmzZqWyg.js";
import { i as isLoopbackHost } from "./net-BpMGIYrw.js";
import { D as resolveIntegerOption } from "./number-coercion-CJQ8TR--.js";
import { r as ensurePortAvailable } from "./ports-miNUZKci.js";
import { m as readProviderJsonResponse } from "./provider-http-errors-DLMRBkZU.js";
import { c as redactSensitiveText, u as redactToolPayloadText } from "./redact-CUe6Oey5.js";
import {
  _ as resolvePinnedHostnameWithPolicy,
  d as isPrivateNetworkAllowedByPolicy,
  p as matchesHostnameAllowlist,
} from "./ssrf-keFRGQLq.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
} from "./string-coerce-DW4mBlAt.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-uPgNO8da.js";
import { n as sliceUtf16Safe, r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
import { t as CONFIG_DIR } from "./utils-DtcDeqWS.js";
//#region extensions/browser/src/browser/browser-proxy-mode.ts
const PROXY_ROUTING_CHROME_ARGS = /* @__PURE__ */ new Set([
  "--proxy-auto-detect",
  "--proxy-pac-url",
  "--proxy-server",
]);
const PROXY_CONTROL_CHROME_ARGS = /* @__PURE__ */ new Set([
  "--no-proxy-server",
  ...PROXY_ROUTING_CHROME_ARGS,
]);
const CHROME_PROXY_ENV_KEYS = [
  "HTTP_PROXY",
  "HTTPS_PROXY",
  "ALL_PROXY",
  "NO_PROXY",
  "http_proxy",
  "https_proxy",
  "all_proxy",
  "no_proxy",
];
function chromeArgName(arg) {
  return arg.trim().split("=", 1)[0]?.toLowerCase() ?? "";
}
/** Return true when Chrome args contain any proxy control flag. */
function hasChromeProxyControlArg(args) {
  return args.some((arg) => PROXY_CONTROL_CHROME_ARGS.has(chromeArgName(arg)));
}
/** Return true when Chrome args route traffic through an explicit proxy. */
function hasExplicitChromeProxyRoutingArg(args) {
  return args.some((arg) => PROXY_ROUTING_CHROME_ARGS.has(chromeArgName(arg)));
}
/** Remove inherited proxy env so launched Chrome follows only configured args. */
function omitChromeProxyEnv(env) {
  const next = { ...env };
  for (const key of CHROME_PROXY_ENV_KEYS) delete next[key];
  return next;
}
/** Resolve the navigation proxy mode used by SSRF/navigation guards. */
function resolveBrowserNavigationProxyMode(params) {
  if (
    params.profile.driver === "openclaw" &&
    params.profile.cdpIsLoopback &&
    !params.profile.attachOnly &&
    hasExplicitChromeProxyRoutingArg(params.resolved.extraArgs)
  )
    return "explicit-browser-proxy";
  return "direct";
}
//#endregion
//#region extensions/browser/src/browser/navigation-guard.ts
/**
 * Browser navigation SSRF guard.
 *
 * Validates page navigation URLs and redirect chains before or after browser
 * navigation while accounting for browser proxy routing.
 */
const NETWORK_NAVIGATION_PROTOCOLS = /* @__PURE__ */ new Set(["http:", "https:"]);
const SAFE_NON_NETWORK_URLS = /* @__PURE__ */ new Set(["about:blank"]);
const BROWSER_NAVIGATION_CREDENTIALS_BLOCKED_MESSAGE =
  "Navigation blocked: URL-embedded credentials are not supported for page navigation. Set HTTP Basic auth with `openclaw browser set credentials <username> <password>` or use an authenticated browser profile.";
function isAllowedNonNetworkNavigationUrl(parsed) {
  return SAFE_NON_NETWORK_URLS.has(parsed.href);
}
/** Raised when a browser navigation URL fails syntax or policy validation. */
var InvalidBrowserNavigationUrlError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidBrowserNavigationUrlError";
  }
};
/** Parse a page-navigation URL and reject credentials before any transport dispatch. */
function parseBrowserNavigationUrl(url) {
  const rawUrl = url.trim();
  if (!rawUrl) throw new InvalidBrowserNavigationUrlError("url is required");
  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new InvalidBrowserNavigationUrlError(
      `Invalid URL: ${rawUrl.includes("@") ? "[redacted credential-bearing URL]" : rawUrl}`,
    );
  }
  if (parsed.username || parsed.password)
    throw new InvalidBrowserNavigationUrlError(BROWSER_NAVIGATION_CREDENTIALS_BLOCKED_MESSAGE);
  return parsed;
}
/** Build a navigation-policy object while omitting default direct proxy mode. */
function withBrowserNavigationPolicy(ssrfPolicy, opts) {
  return {
    ...(ssrfPolicy ? { ssrfPolicy } : {}),
    ...(opts?.browserProxyMode && opts.browserProxyMode !== "direct"
      ? { browserProxyMode: opts.browserProxyMode }
      : {}),
  };
}
/** Return true when strict policy requires redirect-chain inspection. */
function requiresInspectableBrowserNavigationRedirects(ssrfPolicy) {
  return ssrfPolicy?.dangerouslyAllowPrivateNetwork === false;
}
/** Return true when a URL needs redirect inspection under strict policy. */
function requiresInspectableBrowserNavigationRedirectsForUrl(url, ssrfPolicy) {
  if (!requiresInspectableBrowserNavigationRedirects(ssrfPolicy)) return false;
  try {
    const parsed = new URL(url);
    return NETWORK_NAVIGATION_PROTOCOLS.has(parsed.protocol);
  } catch {
    return false;
  }
}
function isIpLiteralHostname(hostname) {
  return isIP(normalizeHostname(hostname)) !== 0;
}
function isExplicitlyAllowedBrowserHostname(hostname, ssrfPolicy) {
  const normalizedHostname = normalizeHostname(hostname);
  if (
    (ssrfPolicy?.allowedHostnames ?? []).some(
      (value) => normalizeHostname(value) === normalizedHostname,
    )
  )
    return true;
  const hostnameAllowlist = (ssrfPolicy?.hostnameAllowlist ?? [])
    .map((pattern) => normalizeHostname(pattern))
    .filter(Boolean);
  return hostnameAllowlist.length > 0
    ? matchesHostnameAllowlist(normalizedHostname, hostnameAllowlist)
    : false;
}
/** Assert that a requested browser navigation URL is policy-allowed. */
async function assertBrowserNavigationAllowed(opts) {
  const parsed = parseBrowserNavigationUrl(opts.url);
  if (!NETWORK_NAVIGATION_PROTOCOLS.has(parsed.protocol)) {
    if (isAllowedNonNetworkNavigationUrl(parsed)) return;
    throw new InvalidBrowserNavigationUrlError(
      `Navigation blocked: unsupported protocol "${parsed.protocol}"`,
    );
  }
  if (
    opts.browserProxyMode === "explicit-browser-proxy" &&
    !isPrivateNetworkAllowedByPolicy(opts.ssrfPolicy)
  )
    throw new InvalidBrowserNavigationUrlError(
      "Navigation blocked: strict browser SSRF policy cannot be enforced while this browser profile is proxy-routed",
    );
  if (
    opts.ssrfPolicy &&
    opts.ssrfPolicy.dangerouslyAllowPrivateNetwork === false &&
    !isPrivateNetworkAllowedByPolicy(opts.ssrfPolicy) &&
    !isIpLiteralHostname(parsed.hostname) &&
    !isExplicitlyAllowedBrowserHostname(parsed.hostname, opts.ssrfPolicy)
  )
    throw new InvalidBrowserNavigationUrlError(
      "Navigation blocked: strict browser SSRF policy requires an IP-literal URL because browser DNS rebinding protections are unavailable for hostname-based navigation",
    );
  await resolvePinnedHostnameWithPolicy(parsed.hostname, {
    lookupFn: opts.lookupFn,
    policy: opts.ssrfPolicy,
  });
}
/**
 * Best-effort post-navigation guard for final page URLs.
 * Only validates network URLs (http/https) and about:blank to avoid false
 * positives on browser-internal error pages (e.g. chrome-error://). In strict
 * mode this intentionally re-applies the hostname gate after redirects.
 */
async function assertBrowserNavigationResultAllowed(opts) {
  const rawUrl = opts.url.trim();
  if (!rawUrl) return;
  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return;
  }
  if (NETWORK_NAVIGATION_PROTOCOLS.has(parsed.protocol) || isAllowedNonNetworkNavigationUrl(parsed))
    await assertBrowserNavigationAllowed(opts);
}
/** Assert that every URL in a browser redirect chain is policy-allowed. */
async function assertBrowserNavigationRedirectChainAllowed(opts) {
  const chain = [];
  let current = opts.request ?? null;
  while (current) {
    chain.push(current.url());
    current = current.redirectedFrom();
  }
  for (const url of chain.toReversed())
    await assertBrowserNavigationAllowed({
      url,
      lookupFn: opts.lookupFn,
      ssrfPolicy: opts.ssrfPolicy,
      browserProxyMode: opts.browserProxyMode,
    });
}
//#endregion
//#region extensions/browser/src/browser/snapshot-roles.ts
/**
 * Shared ARIA role classification sets used by both the Playwright and Chrome MCP
 * snapshot paths. Keep these in sync — divergence causes the two drivers to produce
 * different snapshot output for the same page.
 */
/** Roles that represent user-interactive elements and always get a ref. */
const INTERACTIVE_ROLES = /* @__PURE__ */ new Set([
  "button",
  "checkbox",
  "combobox",
  "link",
  "listbox",
  "menuitem",
  "menuitemcheckbox",
  "menuitemradio",
  "option",
  "radio",
  "searchbox",
  "slider",
  "spinbutton",
  "switch",
  "tab",
  "textbox",
  "treeitem",
]);
/** Roles that carry meaningful content and get a ref when named. */
const CONTENT_ROLES = /* @__PURE__ */ new Set([
  "article",
  "cell",
  "columnheader",
  "gridcell",
  "heading",
  "listitem",
  "main",
  "navigation",
  "region",
  "rowheader",
]);
/** Structural/container roles — typically skipped in compact mode. */
const STRUCTURAL_ROLES = /* @__PURE__ */ new Set([
  "application",
  "directory",
  "document",
  "generic",
  "grid",
  "group",
  "ignored",
  "list",
  "menu",
  "menubar",
  "none",
  "presentation",
  "row",
  "rowgroup",
  "table",
  "tablist",
  "toolbar",
  "tree",
  "treegrid",
]);
//#endregion
//#region extensions/browser/src/browser/pw-role-snapshot.ts
/**
 * Playwright role snapshot helpers.
 *
 * Converts ARIA or AI snapshots into compact role/name text with stable refs
 * and duplicate disambiguation for agent actions.
 */
const ROLE_SNAPSHOT_TRUNCATION_MARKER = "[...TRUNCATED - page too large]";
const ROLE_SNAPSHOT_LINE_REF_RE = /^\s*-\s+\w+(?:\s+"(?:\\.|[^"\\])*")?[^:]*?\[ref=([^\]]+)\]/;
/** Compute snapshot line/char/ref statistics. */
function getRoleSnapshotStats(snapshot, refs) {
  const interactive = Object.values(refs).filter((r) => INTERACTIVE_ROLES.has(r.role)).length;
  return {
    lines: snapshot ? snapshot.split("\n").length : 0,
    chars: snapshot.length,
    refs: Object.keys(refs).length,
    interactive,
  };
}
function findSnapshotLineRef(line) {
  return ROLE_SNAPSHOT_LINE_REF_RE.exec(line)?.[1];
}
function truncateRoleSnapshot(snapshot, maxChars) {
  const marker = maxChars >= 31 ? ROLE_SNAPSHOT_TRUNCATION_MARKER : "…";
  let prefix = "";
  for (const line of snapshot.split("\n")) {
    const candidate = prefix ? `${prefix}\n${line}` : line;
    if (candidate.length + 2 + marker.length > maxChars) break;
    prefix = candidate;
  }
  return prefix ? `${prefix}\n\n${marker}` : marker;
}
/** Apply the final output budget, then keep only refs present on complete output lines. */
function finalizeRoleSnapshot(params) {
  const normalizedMaxChars =
    typeof params.maxChars === "number" && Number.isFinite(params.maxChars) && params.maxChars > 0
      ? Math.floor(params.maxChars)
      : void 0;
  const maxChars = normalizedMaxChars && normalizedMaxChars > 0 ? normalizedMaxChars : void 0;
  const truncated = maxChars !== void 0 && params.snapshot.length > maxChars;
  const snapshot = truncated ? truncateRoleSnapshot(params.snapshot, maxChars) : params.snapshot;
  const visibleRefs = new Set(
    snapshot
      .split("\n")
      .map(findSnapshotLineRef)
      .filter((ref) => Boolean(ref)),
  );
  const refs = Object.fromEntries(
    Object.entries(params.refs).filter(([ref]) => visibleRefs.has(ref)),
  );
  const result = {
    snapshot,
    refs,
    stats: getRoleSnapshotStats(snapshot, refs),
  };
  return truncated
    ? {
        ...result,
        truncated: true,
      }
    : result;
}
function getIndentLevel(line) {
  const indent = line.match(/^(\s*)/)?.[1];
  return indent === void 0 ? 0 : Math.floor(indent.length / 2);
}
function matchInteractiveSnapshotLine(line, options) {
  const depth = getIndentLevel(line);
  if (options.maxDepth !== void 0 && depth > options.maxDepth) return null;
  const match = line.match(/^(\s*-\s*)(\w+)(?:\s+"([^"]*)")?(.*)$/);
  if (!match) return null;
  const roleRaw = match[2];
  const name = match[3];
  const suffix = match[4];
  if (roleRaw === void 0 || suffix === void 0) return null;
  if (roleRaw.startsWith("/")) return null;
  return {
    roleRaw,
    role: normalizeLowercaseStringOrEmpty(roleRaw),
    ...(name ? { name } : {}),
    suffix,
  };
}
function createRoleNameTracker() {
  const counts = /* @__PURE__ */ new Map();
  const refsByKey = /* @__PURE__ */ new Map();
  return {
    counts,
    refsByKey,
    getKey(role, name) {
      return `${role}:${name ?? ""}`;
    },
    getNextIndex(role, name) {
      const key = this.getKey(role, name);
      const current = counts.get(key) ?? 0;
      counts.set(key, current + 1);
      return current;
    },
    trackRef(role, name, ref) {
      const key = this.getKey(role, name);
      const list = refsByKey.get(key) ?? [];
      list.push(ref);
      refsByKey.set(key, list);
    },
    getDuplicateKeys() {
      const out = /* @__PURE__ */ new Set();
      for (const [key, refs] of refsByKey) if (refs.length > 1) out.add(key);
      return out;
    },
  };
}
function removeNthFromNonDuplicates(refs, tracker) {
  const duplicates = tracker.getDuplicateKeys();
  for (const [ref, data] of Object.entries(refs)) {
    const key = tracker.getKey(data.role, data.name);
    if (!duplicates.has(key)) delete refs[ref]?.nth;
  }
}
function compactTree(tree) {
  const lines = tree.split("\n");
  const entries = [];
  const stack = [];
  const finishEntry = () => {
    const current = stack.pop();
    if (!current) return;
    current.entry.keep ||= current.entry.hasRef;
    if (current.entry.hasRef && stack.length > 0) {
      const parent = stack.at(-1);
      if (parent !== void 0) parent.entry.hasRef = true;
    }
  };
  for (const line of lines) {
    const indent = getIndentLevel(line);
    while (stack.length > 0) {
      if (expectDefined(stack.at(-1), "non-empty role snapshot stack").indent < indent) break;
      finishEntry();
    }
    const entry = {
      line,
      keep: line.includes("[ref=") || (line.includes(":") && !line.trimEnd().endsWith(":")),
      hasRef: line.includes("[ref="),
      indent,
    };
    entries.push(entry);
    stack.push({
      entry,
      indent,
    });
  }
  while (stack.length > 0) finishEntry();
  return entries
    .filter((entry) => entry.keep)
    .map((entry) => entry.line)
    .join("\n");
}
function processLine(line, refs, options, tracker, nextRef) {
  const depth = getIndentLevel(line);
  if (options.maxDepth !== void 0 && depth > options.maxDepth) return null;
  const match = line.match(/^(\s*-\s*)(\w+)(?:\s+"([^"]*)")?(.*)$/);
  if (!match) return options.interactive ? null : line;
  const prefix = match[1];
  const roleRaw = match[2];
  const name = match[3];
  const suffix = match[4];
  if (prefix === void 0 || roleRaw === void 0 || suffix === void 0)
    return options.interactive ? null : line;
  if (roleRaw.startsWith("/")) return options.interactive ? null : line;
  const role = normalizeLowercaseStringOrEmpty(roleRaw);
  const isInteractive = INTERACTIVE_ROLES.has(role);
  const isContent = CONTENT_ROLES.has(role);
  const isStructural = STRUCTURAL_ROLES.has(role);
  if (options.interactive && !isInteractive) return null;
  if (options.compact && isStructural && !name) return null;
  if (!(isInteractive || (isContent && name))) return line;
  const ref = nextRef();
  const nth = tracker.getNextIndex(role, name);
  tracker.trackRef(role, name, ref);
  refs[ref] = {
    role,
    name,
    nth,
  };
  let enhanced = `${prefix}${roleRaw}`;
  if (name) enhanced += ` "${name}"`;
  enhanced += ` [ref=${ref}]`;
  if (nth > 0) enhanced += ` [nth=${nth}]`;
  if (suffix) enhanced += suffix;
  return enhanced;
}
function buildInteractiveSnapshotLines(params) {
  const out = [];
  for (const line of params.lines) {
    const parsed = matchInteractiveSnapshotLine(line, params.options);
    if (!parsed) continue;
    if (!INTERACTIVE_ROLES.has(parsed.role)) continue;
    const resolved = params.resolveRef(parsed);
    if (!resolved?.ref) continue;
    params.recordRef(parsed, resolved.ref, resolved.nth);
    let enhanced = `- ${parsed.roleRaw}`;
    if (parsed.name) enhanced += ` "${parsed.name}"`;
    enhanced += ` [ref=${resolved.ref}]`;
    if ((resolved.nth ?? 0) > 0) enhanced += ` [nth=${resolved.nth}]`;
    if (params.includeSuffix(parsed.suffix)) enhanced += parsed.suffix;
    out.push(enhanced);
  }
  return out;
}
/** Normalize a role snapshot ref accepted by browser actions. */
function parseRoleRef(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const normalized = trimmed.startsWith("@")
    ? trimmed.slice(1)
    : trimmed.startsWith("ref=")
      ? trimmed.slice(4)
      : trimmed;
  if (/^e\d+$/i.test(normalized)) return normalized;
  if (/^\d{1,9}$/.test(normalized)) return normalized;
  return null;
}
/** Build a role snapshot and refs from Playwright ARIA snapshot text. */
function buildRoleSnapshotFromAriaSnapshot(ariaSnapshot, options = {}) {
  const lines = ariaSnapshot.split("\n");
  const refs = {};
  const tracker = createRoleNameTracker();
  let counter = 0;
  const nextRef = () => {
    counter += 1;
    return `e${counter}`;
  };
  if (options.interactive) {
    const result = buildInteractiveSnapshotLines({
      lines,
      options,
      resolveRef: ({ role, name }) => {
        const ref = nextRef();
        const nth = tracker.getNextIndex(role, name);
        tracker.trackRef(role, name, ref);
        return {
          ref,
          nth,
        };
      },
      recordRef: ({ role, name }, ref, nth) => {
        refs[ref] = {
          role,
          name,
          nth,
        };
      },
      includeSuffix: (suffix) => suffix.includes("["),
    });
    removeNthFromNonDuplicates(refs, tracker);
    return {
      snapshot: result.join("\n") || "(no interactive elements)",
      refs,
    };
  }
  const result = [];
  for (const line of lines) {
    const processed = processLine(line, refs, options, tracker, nextRef);
    if (processed !== null) result.push(processed);
  }
  removeNthFromNonDuplicates(refs, tracker);
  const tree = result.join("\n") || "(empty)";
  return {
    snapshot: options.compact ? compactTree(tree) : tree,
    refs,
  };
}
function parseAiSnapshotRef(suffix) {
  const eMatch = suffix.match(/\[ref=(e\d+)\]/i);
  if (eMatch) return eMatch[1] ?? null;
  return suffix.match(/\[ref=(\d{1,9})\]/)?.[1] ?? null;
}
/**
 * Build a role snapshot from Playwright's AI snapshot output while preserving Playwright's own
 * aria-ref ids (e.g. ref=e13). This makes the refs self-resolving across calls.
 */
/** Build a role snapshot and refs from Playwright AI snapshot text. */
function buildRoleSnapshotFromAiSnapshot(aiSnapshot, options = {}) {
  const lines = aiSnapshot.split("\n");
  const refs = {};
  if (options.interactive)
    return {
      snapshot:
        buildInteractiveSnapshotLines({
          lines,
          options,
          resolveRef: ({ suffix }) => {
            const ref = parseAiSnapshotRef(suffix);
            return ref ? { ref } : null;
          },
          recordRef: ({ role, name }, ref) => {
            refs[ref] = {
              role,
              ...(name ? { name } : {}),
            };
          },
          includeSuffix: () => true,
        }).join("\n") || "(no interactive elements)",
      refs,
    };
  const out = [];
  for (const line of lines) {
    const depth = getIndentLevel(line);
    if (options.maxDepth !== void 0 && depth > options.maxDepth) continue;
    const match = line.match(/^(\s*-\s*)(\w+)(?:\s+"([^"]*)")?(.*)$/);
    if (!match) {
      out.push(line);
      continue;
    }
    const roleRaw = match[2];
    const name = match[3];
    const suffix = match[4];
    if (roleRaw === void 0 || suffix === void 0) {
      out.push(line);
      continue;
    }
    if (roleRaw.startsWith("/")) {
      out.push(line);
      continue;
    }
    const role = normalizeLowercaseStringOrEmpty(roleRaw);
    const isStructural = STRUCTURAL_ROLES.has(role);
    if (options.compact && isStructural && !name) continue;
    const ref = parseAiSnapshotRef(suffix);
    if (ref)
      refs[ref] = {
        role,
        ...(name ? { name } : {}),
      };
    out.push(line);
  }
  const tree = out.join("\n") || "(empty)";
  return {
    snapshot: options.compact ? compactTree(tree) : tree,
    refs,
  };
}
//#endregion
//#region extensions/browser/src/browser/cdp.ts
/**
 * Chrome DevTools Protocol browser operations.
 *
 * Provides screenshots, target creation, JavaScript evaluation, ARIA/role
 * snapshots, DOM text, and selector lookup on top of the CDP socket helpers.
 */
/** Normalize a reported CDP WebSocket URL against the configured CDP base URL. */
function normalizeCdpWsUrl(wsUrl, cdpUrl) {
  const ws = new URL(wsUrl);
  const cdp = new URL(cdpUrl);
  const isWildcardBind = ws.hostname === "0.0.0.0" || ws.hostname === "[::]";
  if ((isLoopbackHost(ws.hostname) || isWildcardBind) && !isLoopbackHost(cdp.hostname)) {
    ws.hostname = cdp.hostname;
    const cdpPort = cdp.port || (cdp.protocol === "https:" ? "443" : "80");
    /* c8 ignore next 3 */
    if (cdpPort) ws.port = cdpPort;
    ws.protocol = cdp.protocol === "https:" ? "wss:" : "ws:";
  } else if (isLoopbackHost(ws.hostname) && isLoopbackHost(cdp.hostname)) {
    ws.hostname = cdp.hostname;
    if (!ws.port && cdp.port) ws.port = cdp.port;
  }
  if (cdp.protocol === "https:" && ws.protocol === "ws:") ws.protocol = "wss:";
  if (!ws.username && !ws.password && (cdp.username || cdp.password)) {
    ws.username = cdp.username;
    ws.password = cdp.password;
  }
  for (const [key, value] of cdp.searchParams.entries())
    if (!ws.searchParams.has(key)) ws.searchParams.append(key, value);
  return ws.toString();
}
/** Capture a PNG or JPEG screenshot through CDP, optionally full-page. */
async function captureScreenshot(opts) {
  return await withCdpSocket(
    opts.wsUrl,
    async (send) => {
      await send("Page.enable");
      await send("Page.bringToFront").catch(() => {});
      let savedVp;
      if (opts.fullPage) {
        const metrics = await send("Page.getLayoutMetrics");
        const size = metrics?.cssContentSize ?? metrics?.contentSize;
        const contentWidth = size?.width ?? 0;
        const contentHeight = size?.height ?? 0;
        if (contentWidth > 0 && contentHeight > 0) {
          const v = (
            await send("Runtime.evaluate", {
              expression:
                "({ w: window.innerWidth, h: window.innerHeight, dpr: window.devicePixelRatio, sw: screen.width, sh: screen.height })",
              returnByValue: true,
            })
          )?.result?.value;
          const currentW = v?.w ?? 0;
          const currentH = v?.h ?? 0;
          savedVp = {
            w: currentW,
            h: currentH,
            dpr: v?.dpr ?? 1,
            sw: v?.sw ?? currentW,
            sh: v?.sh ?? currentH,
          };
          await send("Emulation.setDeviceMetricsOverride", {
            width: Math.ceil(Math.max(currentW, contentWidth)),
            height: Math.ceil(Math.max(currentH, contentHeight)),
            deviceScaleFactor: savedVp.dpr,
            mobile: false,
            screenWidth: savedVp.sw,
            screenHeight: savedVp.sh,
          });
        }
      }
      const format = opts.format ?? "png";
      const quality =
        format === "jpeg" ? Math.max(0, Math.min(100, Math.round(opts.quality ?? 85))) : void 0;
      try {
        const base64 = (
          await send("Page.captureScreenshot", {
            format,
            ...(quality !== void 0 ? { quality } : {}),
            ...(opts.fullPage ? { captureBeyondViewport: true } : {}),
          })
        )?.data;
        if (!base64) throw new Error("Screenshot failed: missing data");
        return Buffer.from(base64, "base64");
      } finally {
        if (savedVp) {
          await send("Emulation.clearDeviceMetricsOverride").catch(() => {});
          try {
            const p = (
              await send("Runtime.evaluate", {
                expression:
                  "({ w: window.innerWidth, h: window.innerHeight, dpr: window.devicePixelRatio })",
                returnByValue: true,
              })
            )?.result?.value;
            if (p?.w !== savedVp.w || p?.h !== savedVp.h || p?.dpr !== savedVp.dpr)
              await send("Emulation.setDeviceMetricsOverride", {
                width: savedVp.w,
                height: savedVp.h,
                deviceScaleFactor: savedVp.dpr,
                mobile: false,
                screenWidth: savedVp.sw,
                screenHeight: savedVp.sh,
              });
          } catch {}
        }
      }
    },
    { commandTimeoutMs: opts.timeoutMs },
  );
}
/** Create a new browser target after applying navigation and CDP SSRF policy. */
async function createTargetViaCdp(opts) {
  await assertBrowserNavigationAllowed({
    url: opts.url,
    ...withBrowserNavigationPolicy(opts.ssrfPolicy),
  });
  await assertCdpEndpointAllowed(opts.cdpUrl, opts.ssrfPolicy);
  const cdpControlPolicy = scopeCdpPolicyToConfiguredEndpoint(opts.cdpUrl, opts.ssrfPolicy);
  let wsUrl;
  if (isDirectCdpWebSocketEndpoint(opts.cdpUrl)) wsUrl = opts.cdpUrl;
  else {
    const discoveryUrl = isWebSocketUrl(opts.cdpUrl)
      ? normalizeCdpHttpBaseForJsonEndpoints(opts.cdpUrl)
      : opts.cdpUrl;
    let version = null;
    try {
      version = await fetchJson(
        appendCdpPath(discoveryUrl, "/json/version"),
        opts.timeouts?.httpTimeoutMs,
        void 0,
        cdpControlPolicy,
      );
    } catch (err) {
      if (!isWebSocketUrl(opts.cdpUrl)) throw err;
    }
    const wsUrlRaw = version?.webSocketDebuggerUrl?.trim() ?? "";
    if (wsUrlRaw) wsUrl = normalizeCdpWsUrl(wsUrlRaw, discoveryUrl);
    else if (isWebSocketUrl(opts.cdpUrl)) wsUrl = opts.cdpUrl;
    else throw new Error("CDP /json/version missing webSocketDebuggerUrl");
  }
  const candidateWsUrls =
    isWebSocketUrl(opts.cdpUrl) && wsUrl !== opts.cdpUrl ? [wsUrl, opts.cdpUrl] : [wsUrl];
  let lastError;
  for (const candidateWsUrl of candidateWsUrls)
    try {
      await assertCdpEndpointAllowed(
        candidateWsUrl,
        cdpControlPolicy,
        candidateWsUrl === opts.cdpUrl
          ? { source: "configured" }
          : {
              source: "discovered",
              configuredUrl: opts.cdpUrl,
            },
      );
      return await withCdpSocket(
        candidateWsUrl,
        async (send) => {
          const targetId =
            (await send("Target.createTarget", { url: opts.url }))?.targetId?.trim() ?? "";
          if (!targetId) throw new Error("CDP Target.createTarget returned no targetId");
          await prepareCdpTargetSession(send, targetId);
          return { targetId };
        },
        {
          commandTimeoutMs: opts.timeouts?.httpTimeoutMs ?? 5e3,
          handshakeTimeoutMs: opts.timeouts?.handshakeTimeoutMs,
        },
      );
    } catch (err) {
      lastError = err;
    }
  if (lastError instanceof Error) throw lastError;
  throw new Error("CDP Target.createTarget failed");
}
async function prepareCdpTargetSession(send, targetId) {
  const attached = await send("Target.attachToTarget", {
    targetId,
    flatten: true,
  }).catch(() => null);
  const sessionId = typeof attached?.sessionId === "string" ? attached.sessionId : void 0;
  if (!sessionId) return;
  try {
    await prepareCdpPageSession(send, sessionId);
  } finally {
    await send("Target.detachFromTarget", { sessionId }).catch(() => {});
  }
}
async function prepareCdpPageSession(send, sessionId) {
  await Promise.all([
    send("Page.enable", void 0, sessionId).catch(() => {}),
    send("Runtime.enable", void 0, sessionId).catch(() => {}),
    send("Network.enable", void 0, sessionId).catch(() => {}),
    send("DOM.enable", void 0, sessionId).catch(() => {}),
    send("Accessibility.enable", void 0, sessionId).catch(() => {}),
  ]);
  await send("Runtime.runIfWaitingForDebugger", void 0, sessionId).catch(() => {});
}
/** Prefix assigned to generated accessibility-node refs. */
const AX_REF_PREFIX = "ax";
const AX_REF_PATTERN = new RegExp(`^${AX_REF_PREFIX}\\d+$`);
function axValue(v) {
  if (!v || typeof v !== "object") return "";
  const value = v.value;
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return "";
}
/** Format raw AX nodes into bounded ARIA snapshot nodes. */
function formatAriaSnapshot(nodes, limit) {
  const byId = /* @__PURE__ */ new Map();
  for (const n of nodes) if (n.nodeId) byId.set(n.nodeId, n);
  const referenced = /* @__PURE__ */ new Set();
  for (const n of nodes) for (const c of n.childIds ?? []) referenced.add(c);
  const root = nodes.find((n) => n.nodeId && !referenced.has(n.nodeId)) ?? nodes[0];
  if (!root?.nodeId) return [];
  const out = [];
  const stack = [
    {
      id: root.nodeId,
      depth: 0,
    },
  ];
  while (stack.length && out.length < limit) {
    const popped = stack.pop();
    /* c8 ignore next 3 */
    if (!popped) break;
    const { id, depth } = popped;
    const n = byId.get(id);
    /* c8 ignore next 3 */
    if (!n) continue;
    const role = axValue(n.role);
    const name = axValue(n.name);
    const value = axValue(n.value);
    const description = axValue(n.description);
    const ref = `${AX_REF_PREFIX}${out.length + 1}`;
    out.push({
      ref,
      role: role || "unknown",
      name: name || "",
      ...(value ? { value } : {}),
      ...(description ? { description } : {}),
      ...(typeof n.backendDOMNodeId === "number" ? { backendDOMNodeId: n.backendDOMNodeId } : {}),
      depth,
    });
    const children = (n.childIds ?? []).filter((c) => byId.has(c));
    for (let i = children.length - 1; i >= 0; i--) {
      const child = children[i];
      /* c8 ignore next 3 */
      if (child)
        stack.push({
          id: child,
          depth: depth + 1,
        });
    }
  }
  return out;
}
/** Capture an accessibility-tree snapshot through CDP. */
async function snapshotAria(opts) {
  const limit = resolveIntegerOption(opts.limit, 500, {
    min: 1,
    max: 2e3,
  });
  return await withCdpSocket(
    opts.wsUrl,
    async (send) => {
      await prepareCdpPageSession(send);
      const res = await send("Accessibility.getFullAXTree");
      return { nodes: formatAriaSnapshot(Array.isArray(res?.nodes) ? res.nodes : [], limit) };
    },
    { commandTimeoutMs: opts.timeoutMs ?? 5e3 },
  );
}
function buildRoleTree(nodes) {
  const byId = /* @__PURE__ */ new Map();
  const tree = [];
  for (const raw of nodes) {
    const nodeId = raw.nodeId ?? "";
    if (!nodeId) continue;
    byId.set(nodeId, tree.length);
    tree.push({
      raw,
      role: axValue(raw.role) || "unknown",
      name: axValue(raw.name),
      value: axValue(raw.value),
      backendDOMNodeId:
        typeof raw.backendDOMNodeId === "number" && raw.backendDOMNodeId > 0
          ? Math.floor(raw.backendDOMNodeId)
          : void 0,
      children: [],
      depth: 0,
    });
  }
  const childIndexes = /* @__PURE__ */ new Set();
  for (let index = 0; index < tree.length; index += 1)
    for (const childId of tree[index]?.raw.childIds ?? []) {
      const childIndex = byId.get(childId);
      if (childIndex === void 0) continue;
      tree[index]?.children.push(childIndex);
      expectDefined(tree[childIndex], "CDP child node index").parent = index;
      childIndexes.add(childIndex);
    }
  const roots = tree.map((_node, index) => index).filter((index) => !childIndexes.has(index));
  const stack = roots.map((index) => ({
    index,
    depth: 0,
  }));
  while (stack.length) {
    const current = stack.pop();
    if (!current) break;
    expectDefined(tree[current.index], "CDP traversal node index").depth = current.depth;
    for (const child of (tree[current.index]?.children ?? []).toReversed())
      stack.push({
        index: child,
        depth: current.depth + 1,
      });
  }
  return {
    tree,
    roots: roots.length ? roots : tree.length ? [0] : [],
  };
}
function shouldIncludeRoleNode(node, options) {
  const role = node.role.toLowerCase();
  if (options.maxDepth !== void 0 && node.depth > options.maxDepth) return false;
  if (options.interactive)
    return INTERACTIVE_ROLES.has(role) || role === "iframe" || Boolean(node.cursorInfo);
  if (options.compact && STRUCTURAL_ROLES.has(role) && !node.name && !node.ref) return false;
  return true;
}
function cursorSuffix(info) {
  if (!info) return "";
  const parts = [
    info.hasCursorPointer ? "cursor:pointer" : void 0,
    info.hasOnClick ? "onclick" : void 0,
    info.hasTabIndex ? "tabindex" : void 0,
    info.isEditable ? "contenteditable" : void 0,
    info.hiddenInputType ? `hidden-${info.hiddenInputType}` : void 0,
  ].filter(Boolean);
  return parts.length ? ` [${parts.join(", ")}]` : "";
}
function escapeRoleSnapshotValue(value) {
  return value
    .replaceAll("\\", "\\\\")
    .replaceAll('"', '\\"')
    .replaceAll("\r", "\\r")
    .replaceAll("\n", "\\n");
}
function renderRoleTree(tree, index, output, options, indentOffset = 0) {
  const node = tree[index];
  if (!node) return;
  if (shouldIncludeRoleNode(node, options)) {
    const indent = "  ".repeat(Math.max(0, node.depth + indentOffset));
    const name = node.name ? ` "${escapeRoleSnapshotValue(node.name)}"` : "";
    const ref = node.ref ? ` [ref=${node.ref}]` : "";
    const nth = node.nth !== void 0 && node.nth > 0 ? ` [nth=${node.nth}]` : "";
    const value = node.value ? ` value="${escapeRoleSnapshotValue(node.value)}"` : "";
    const url = node.url ? ` [url=${node.url}]` : "";
    output.push(
      `${indent}- ${node.role}${name}${ref}${nth}${value}${url}${cursorSuffix(node.cursorInfo)}`,
    );
  }
  for (const child of node.children) renderRoleTree(tree, child, output, options, indentOffset);
}
async function findCursorInteractiveElements(send, sessionId) {
  const attr = "data-openclaw-cdp-ci";
  const evaluated = await send(
    "Runtime.evaluate",
    {
      expression: `(() => {
        const out = [];
        const roles = new Set(["button","link","textbox","checkbox","radio","combobox","listbox","menuitem","menuitemcheckbox","menuitemradio","option","searchbox","slider","spinbutton","switch","tab","treeitem"]);
        const tags = new Set(["a","button","input","select","textarea","details","summary"]);
        document.querySelectorAll("[${attr}]").forEach((el) => el.removeAttribute("${attr}"));
        for (const el of Array.from(document.body ? document.body.querySelectorAll("*") : [])) {
          if (!(el instanceof HTMLElement) || el.closest("[hidden],[aria-hidden='true']")) continue;
          const tagName = el.tagName.toLowerCase();
          if (tags.has(tagName)) continue;
          const role = String(el.getAttribute("role") || "").toLowerCase();
          if (roles.has(role)) continue;
          const style = getComputedStyle(el);
          const hasCursorPointer = style.cursor === "pointer";
          const hasOnClick = el.hasAttribute("onclick") || el.onclick !== null;
          const tabIndex = el.getAttribute("tabindex");
          const hasTabIndex = tabIndex !== null && tabIndex !== "-1";
          const ce = el.getAttribute("contenteditable");
          const isEditable = ce === "" || ce === "true";
          if (!hasCursorPointer && !hasOnClick && !hasTabIndex && !isEditable) continue;
          if (hasCursorPointer && !hasOnClick && !hasTabIndex && !isEditable) {
            const parent = el.parentElement;
            if (parent && getComputedStyle(parent).cursor === "pointer") continue;
          }
          const rect = el.getBoundingClientRect();
          if (rect.width <= 0 || rect.height <= 0) continue;
          let hiddenInputType = "";
          const hiddenInput = el.querySelector("input[type='radio'],input[type='checkbox']");
          if (hiddenInput instanceof HTMLInputElement) {
            const hiddenStyle = getComputedStyle(hiddenInput);
            if (hiddenInput.hidden || hiddenStyle.display === "none" || hiddenStyle.visibility === "hidden") {
              hiddenInputType = hiddenInput.type;
            }
          }
          el.setAttribute("${attr}", String(out.length));
          out.push({
            text: String(el.textContent || "").replace(/\\s+/g, " ").trim().slice(0, 101),
            tagName,
            hasCursorPointer,
            hasOnClick,
            hasTabIndex,
            isEditable,
            hiddenInputType,
          });
        }
        return out;
      })()`,
      returnByValue: true,
      awaitPromise: false,
    },
    sessionId,
  ).catch(() => null);
  const entries = Array.isArray(evaluated?.result?.value)
    ? evaluated.result.value.map((entry) => {
        entry.text = truncateUtf16Safe(entry.text, 100);
        return entry;
      })
    : [];
  if (!entries.length) return /* @__PURE__ */ new Map();
  const rootNodeId = (await send("DOM.getDocument", { depth: 0 }, sessionId).catch(() => null))
    ?.root?.nodeId;
  if (typeof rootNodeId !== "number") return /* @__PURE__ */ new Map();
  const queried = await send(
    "DOM.querySelectorAll",
    {
      nodeId: rootNodeId,
      selector: `[${attr}]`,
    },
    sessionId,
  ).catch(() => null);
  const out = /* @__PURE__ */ new Map();
  await Promise.all(
    (queried?.nodeIds ?? []).map(async (nodeId) => {
      const described = await send("DOM.describeNode", { nodeId }, sessionId).catch(() => null);
      const attrs = described?.node?.attributes ?? [];
      const attrIndex = attrs.indexOf(attr);
      const rawIndex = attrIndex >= 0 ? attrs[attrIndex + 1] : void 0;
      const index = typeof rawIndex === "string" ? Number(rawIndex) : NaN;
      const backendNodeId = described?.node?.backendNodeId;
      if (typeof backendNodeId === "number" && Number.isInteger(index) && entries[index])
        out.set(backendNodeId, entries[index]);
    }),
  );
  await send(
    "Runtime.evaluate",
    {
      expression: `document.querySelectorAll("[${attr}]").forEach((el) => el.removeAttribute("${attr}"))`,
      returnByValue: true,
    },
    sessionId,
  ).catch(() => {});
  return out;
}
async function resolveLinkUrls(send, refs, sessionId) {
  const out = /* @__PURE__ */ new Map();
  await Promise.all(
    Object.values(refs).map(async (ref) => {
      if (ref.role !== "link" || !ref.backendDOMNodeId) return;
      const objectId = (
        await send("DOM.resolveNode", { backendNodeId: ref.backendDOMNodeId }, sessionId).catch(
          () => null,
        )
      )?.object?.objectId;
      if (!objectId) return;
      const hrefResult = await send(
        "Runtime.callFunctionOn",
        {
          objectId,
          functionDeclaration: "function() { return this.href || ''; }",
          returnByValue: true,
        },
        sessionId,
      ).catch(() => null);
      const href = typeof hrefResult?.result?.value === "string" ? hrefResult.result.value : "";
      if (href) out.set(ref.backendDOMNodeId, href);
    }),
  );
  return out;
}
async function resolveIframeFrameIds(send, tree, sessionId) {
  const out = /* @__PURE__ */ new Map();
  await Promise.all(
    tree.map(async (node) => {
      if (node.role.toLowerCase() !== "iframe" || !node.backendDOMNodeId) return;
      const described = await send(
        "DOM.describeNode",
        {
          backendNodeId: node.backendDOMNodeId,
          depth: 1,
        },
        sessionId,
      ).catch(() => null);
      const frameId = described?.node?.contentDocument?.frameId ?? described?.node?.frameId ?? "";
      if (frameId) out.set(node.backendDOMNodeId, frameId);
    }),
  );
  return out;
}
async function buildCdpRoleSnapshot(params) {
  const res = await params.send(
    "Accessibility.getFullAXTree",
    params.frameId ? { frameId: params.frameId } : void 0,
    params.sessionId,
  );
  const { tree, roots } = buildRoleTree(Array.isArray(res.nodes) ? res.nodes : []);
  const cursorElements = await findCursorInteractiveElements(params.send, params.sessionId);
  for (const node of tree)
    if (node.backendDOMNodeId && cursorElements.has(node.backendDOMNodeId)) {
      const cursorInfo = cursorElements.get(node.backendDOMNodeId);
      node.cursorInfo = cursorInfo;
      if (!node.name && cursorInfo?.text) node.name = cursorInfo.text;
    }
  const counts = /* @__PURE__ */ new Map();
  const refsByKey = /* @__PURE__ */ new Map();
  const nodesByRef = /* @__PURE__ */ new Map();
  const refs = {};
  for (const node of tree) {
    const role = node.role.toLowerCase();
    if (
      !(
        INTERACTIVE_ROLES.has(role) ||
        (CONTENT_ROLES.has(role) && Boolean(node.name)) ||
        role === "iframe" ||
        Boolean(node.cursorInfo)
      )
    )
      continue;
    const key = `${role}:${node.name}`;
    const nth = counts.get(key) ?? 0;
    counts.set(key, nth + 1);
    const ref = `e${params.nextRef.value}`;
    params.nextRef.value += 1;
    node.ref = ref;
    node.nth = nth;
    const refsForKey = refsByKey.get(key);
    if (refsForKey) refsForKey.push(ref);
    else refsByKey.set(key, [ref]);
    nodesByRef.set(ref, node);
    refs[ref] = {
      role,
      ...(node.name ? { name: node.name } : {}),
      ...(nth > 0 ? { nth } : {}),
      ...(node.backendDOMNodeId ? { backendDOMNodeId: node.backendDOMNodeId } : {}),
      ...(params.frameId ? { frameId: params.frameId } : {}),
    };
  }
  for (const refList of refsByKey.values()) {
    if (refList.length > 1) continue;
    const ref = refList[0];
    if (ref) {
      delete refs[ref]?.nth;
      const node = nodesByRef.get(ref);
      if (node) delete node.nth;
    }
  }
  const iframeFrameIds = await resolveIframeFrameIds(params.send, tree, params.sessionId);
  for (const node of tree)
    if (node.backendDOMNodeId && iframeFrameIds.has(node.backendDOMNodeId)) {
      node.frameId = iframeFrameIds.get(node.backendDOMNodeId);
      if (node.ref && refs[node.ref])
        expectDefined(refs[node.ref], "owned CDP role reference").frameId = node.frameId;
    }
  if (params.urls) {
    const urls = await resolveLinkUrls(params.send, refs, params.sessionId);
    for (const node of tree)
      if (node.backendDOMNodeId && urls.has(node.backendDOMNodeId))
        node.url = urls.get(node.backendDOMNodeId);
  }
  const lines = [];
  for (const root of roots) renderRoleTree(tree, root, lines, params.options);
  if (params.recurseIframes) {
    const iframeNodes = tree.filter((node) => node.ref && node.frameId);
    for (const iframe of iframeNodes) {
      const marker = `[ref=${iframe.ref}]`;
      const lineIndex = lines.findIndex((line) => line.includes(marker));
      if (lineIndex < 0 || !iframe.frameId) continue;
      const child = await buildCdpRoleSnapshot({
        ...params,
        frameId: iframe.frameId,
        recurseIframes: false,
      }).catch(() => null);
      if (!child?.lines.length) continue;
      Object.assign(refs, child.refs);
      lines.splice(lineIndex + 1, 0, ...child.lines.map((line) => `  ${line}`));
    }
  }
  return {
    lines,
    refs,
  };
}
/** Build a role/name text snapshot with stable refs from CDP DOM and AX data. */
async function snapshotRoleViaCdp(opts) {
  return await withCdpSocket(
    opts.wsUrl,
    async (send) => {
      await prepareCdpPageSession(send);
      const built = await buildCdpRoleSnapshot({
        send,
        options: opts.options ?? {},
        urls: opts.urls,
        recurseIframes: true,
        nextRef: { value: 1 },
      });
      return finalizeRoleSnapshot({
        snapshot:
          built.lines.join("\n").trim() ||
          (opts.options?.interactive ? "(no interactive elements)" : "(empty page)"),
        refs: built.refs,
        maxChars: opts.maxChars,
      });
    },
    { commandTimeoutMs: opts.timeoutMs ?? 5e3 },
  );
}
//#endregion
//#region extensions/browser/src/infra/ws.ts
/**
 * WebSocket payload normalization helpers for Browser gateway transports.
 */
/** Converts raw WebSocket payload shapes into UTF-8 strings. */
function rawDataToString(data) {
  if (typeof data === "string") return data;
  if (Buffer.isBuffer(data)) return data.toString("utf8");
  if (Array.isArray(data)) return Buffer.concat(data).toString("utf8");
  if (ArrayBuffer.isView(data))
    return Buffer.from(data.buffer, data.byteOffset, data.byteLength).toString("utf8");
  if (data instanceof ArrayBuffer) return Buffer.from(data).toString("utf8");
  return String(data);
}
//#endregion
//#region extensions/browser/src/browser/chrome.diagnostics.ts
/**
 * Chrome CDP diagnostics.
 *
 * Probes /json/version and WebSocket health, redacts sensitive endpoint data,
 * and formats status output for browser doctor/status flows.
 */
function elapsedSince(startedAt) {
  return Math.max(0, Date.now() - startedAt);
}
/** Convert an error and optional cause to redacted diagnostic text. */
function safeChromeCdpErrorMessage(error) {
  const message = error instanceof Error ? error.message : String(error);
  const cause = error instanceof Error ? error.cause : void 0;
  const causeMessage =
    cause instanceof Error ? cause.message : typeof cause === "string" ? cause : void 0;
  if (message && causeMessage && !message.includes(causeMessage))
    return redactSensitiveText(`${message}: ${causeMessage}`);
  return redactSensitiveText(message || "unknown error");
}
function failureDiagnostic(params) {
  return {
    ok: false,
    cdpUrl: params.cdpUrl,
    wsUrl: params.wsUrl,
    code: params.code,
    message: redactSensitiveText(params.message),
    elapsedMs: elapsedSince(params.startedAt),
  };
}
/** Read and validate Chrome's /json/version endpoint. */
async function readChromeVersion(
  cdpUrl,
  timeoutMs = 500,
  ssrfPolicy,
  versionPath = "/json/version",
) {
  const ctrl = new AbortController();
  const t = setTimeout(ctrl.abort.bind(ctrl), timeoutMs);
  try {
    const { response, release } = await fetchCdpChecked(
      appendCdpPath(cdpUrl, versionPath),
      timeoutMs,
      { signal: ctrl.signal },
      ssrfPolicy,
    );
    try {
      const data = await readProviderJsonResponse(response, "cdp-version");
      if (!data || typeof data !== "object")
        throw new Error("CDP /json/version returned non-object JSON");
      return data;
    } finally {
      await release();
    }
  } finally {
    clearTimeout(t);
  }
}
/** Preserve authenticated providers that expose only Playwright's trailing-slash route. */
async function readChromeVersionWithCredentialFallback(cdpUrl, timeoutMs = 500, ssrfPolicy) {
  try {
    const primaryVersion = await readChromeVersion(cdpUrl, timeoutMs, ssrfPolicy);
    if (
      normalizeOptionalString(primaryVersion.webSocketDebuggerUrl) ||
      stripCdpUrlCredentials(cdpUrl) === cdpUrl
    )
      return primaryVersion;
    try {
      return await readChromeVersion(cdpUrl, timeoutMs, ssrfPolicy, "/json/version/");
    } catch {
      return primaryVersion;
    }
  } catch (primaryError) {
    if (stripCdpUrlCredentials(cdpUrl) === cdpUrl) throw primaryError;
    try {
      return await readChromeVersion(cdpUrl, timeoutMs, ssrfPolicy, "/json/version/");
    } catch {
      throw primaryError;
    }
  }
}
function readObjectString(value, key) {
  if (!value || typeof value !== "object") return;
  return normalizeOptionalString(value[key]);
}
function chromeVersionFromCdpResult(result) {
  const browser = readObjectString(result, "Browser") ?? readObjectString(result, "product");
  const userAgent = readObjectString(result, "User-Agent") ?? readObjectString(result, "userAgent");
  if (!browser && !userAgent) return;
  return {
    Browser: browser,
    "User-Agent": userAgent,
  };
}
async function diagnoseCdpHealthCommand(wsUrl, timeoutMs = 800) {
  return await new Promise((resolve) => {
    const ws = openCdpWebSocket(wsUrl, { handshakeTimeoutMs: timeoutMs });
    let settled = false;
    let opened = false;
    const onMessage = (raw) => {
      if (settled) return;
      let parsed;
      try {
        parsed = JSON.parse(rawDataToString(raw));
      } catch {
        return;
      }
      if (parsed?.id !== 1) return;
      if (parsed.result && typeof parsed.result === "object") {
        finish({
          ok: true,
          version: chromeVersionFromCdpResult(parsed.result),
        });
        return;
      }
      finish({
        ok: false,
        code: "websocket_health_command_failed",
        message: "Browser.getVersion returned no result object",
      });
    };
    const finish = (value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      ws.off("message", onMessage);
      try {
        ws.close();
      } catch {}
      resolve(value);
    };
    const timer = setTimeout(
      () => {
        try {
          ws.terminate();
        } catch {}
        finish({
          ok: false,
          code: opened ? "websocket_health_command_timeout" : "websocket_handshake_failed",
          message: opened
            ? `Browser.getVersion did not respond within ${timeoutMs}ms`
            : `WebSocket handshake did not complete within ${timeoutMs}ms`,
        });
      },
      Math.max(1, timeoutMs + Math.min(25, timeoutMs)),
    );
    ws.once("open", () => {
      opened = true;
      try {
        ws.send(
          JSON.stringify({
            id: 1,
            method: "Browser.getVersion",
          }),
        );
      } catch (err) {
        finish({
          ok: false,
          code: "websocket_health_command_failed",
          message: safeChromeCdpErrorMessage(err),
        });
      }
    });
    ws.on("message", onMessage);
    ws.once("error", (err) => {
      finish({
        ok: false,
        code: opened ? "websocket_health_command_failed" : "websocket_handshake_failed",
        message: safeChromeCdpErrorMessage(err),
      });
    });
    ws.once("close", () => {
      finish({
        ok: false,
        code: opened ? "websocket_health_command_failed" : "websocket_handshake_failed",
        message: opened
          ? "WebSocket closed before Browser.getVersion completed"
          : "WebSocket closed before handshake completed",
      });
    });
  });
}
function classifyChromeVersionError(error) {
  const message = safeChromeCdpErrorMessage(error);
  if (error instanceof BrowserCdpEndpointBlockedError)
    return {
      code: "ssrf_blocked",
      message,
    };
  if (/^HTTP \d+/.test(message))
    return {
      code: "http_status_failed",
      message,
    };
  if (
    error instanceof SyntaxError ||
    message.includes("cdp-version: malformed JSON response") ||
    message.includes("non-object JSON")
  )
    return {
      code: "invalid_json",
      message,
    };
  return {
    code: "http_unreachable",
    message,
  };
}
/** Format a Chrome CDP diagnostic result for status and doctor output. */
function formatChromeCdpDiagnostic(diagnostic) {
  const redactedCdpUrl = redactCdpUrl(diagnostic.cdpUrl) ?? diagnostic.cdpUrl;
  const redactedWsUrl = redactCdpUrl(diagnostic.wsUrl) ?? diagnostic.wsUrl;
  if (diagnostic.ok) {
    const browser = diagnostic.browser ? ` browser=${diagnostic.browser}` : "";
    return `CDP diagnostic: ready after ${diagnostic.elapsedMs}ms; cdp=${redactedCdpUrl}; websocket=${redactedWsUrl}.${browser}`;
  }
  const websocket = redactedWsUrl ? `; websocket=${redactedWsUrl}` : "";
  const wslPortproxyHint =
    diagnostic.code === "http_unreachable" && isLikelyEmptyHttpReply(diagnostic.message)
      ? WSL_EMPTY_REPLY_PORTPROXY_HINT
      : "";
  return `CDP diagnostic: ${diagnostic.code} after ${diagnostic.elapsedMs}ms; cdp=${redactedCdpUrl}${websocket}; ${diagnostic.message}.${wslPortproxyHint}`;
}
const WSL_EMPTY_REPLY_PORTPROXY_HINT =
  " In WSL2-to-Windows Chrome setups, an empty CDP reply can mean netsh is forwarding to the wrong loopback address. On Windows, inspect `netstat -ano | findstr :9222` and `netsh interface portproxy show all`, then curl both 127.0.0.1 and [::1]. Chromium prefers 127.0.0.1 and falls back to [::1] only when the IPv4 bind fails. If svchost/iphlpsvc owns 127.0.0.1:9222, remove the 127.0.0.1:9222 -> 127.0.0.1:9222 self-loop; if chrome.exe listens only on [::1], use v4tov6 with connectaddress=::1 for the WSL2-reachable listener.";
function isLikelyEmptyHttpReply(message) {
  return /empty reply|other side closed|socket closed|connection reset|econnreset|terminated before response/i.test(
    message,
  );
}
async function diagnoseCdpWebSocketEndpoint(params) {
  const health = await diagnoseCdpHealthCommand(params.wsUrl, params.handshakeTimeoutMs);
  if (!health.ok)
    return failureDiagnostic({
      cdpUrl: params.cdpUrl,
      wsUrl: params.wsUrl,
      code: health.code,
      message: health.message,
      startedAt: params.startedAt,
    });
  return {
    ok: true,
    cdpUrl: params.cdpUrl,
    wsUrl: params.wsUrl,
    browser: params.version?.Browser ?? health.version?.Browser,
    userAgent: params.version?.["User-Agent"] ?? health.version?.["User-Agent"],
    elapsedMs: elapsedSince(params.startedAt),
  };
}
/** Run HTTP and WebSocket health diagnostics for a Chrome CDP endpoint. */
async function diagnoseChromeCdp(cdpUrl, timeoutMs = 500, handshakeTimeoutMs = 800, ssrfPolicy) {
  const startedAt = Date.now();
  try {
    await assertCdpEndpointAllowed(cdpUrl, ssrfPolicy);
  } catch (err) {
    return failureDiagnostic({
      cdpUrl,
      code: "ssrf_blocked",
      message: safeChromeCdpErrorMessage(err),
      startedAt,
    });
  }
  const cdpControlPolicy = scopeCdpPolicyToConfiguredEndpoint(cdpUrl, ssrfPolicy);
  if (isDirectCdpWebSocketEndpoint(cdpUrl))
    return await diagnoseCdpWebSocketEndpoint({
      cdpUrl,
      wsUrl: cdpUrl,
      startedAt,
      handshakeTimeoutMs,
    });
  const discoveryUrl = isWebSocketUrl(cdpUrl)
    ? normalizeCdpHttpBaseForJsonEndpoints(cdpUrl)
    : cdpUrl;
  let version;
  try {
    version = await readChromeVersionWithCredentialFallback(
      discoveryUrl,
      timeoutMs,
      cdpControlPolicy,
    );
  } catch (err) {
    if (isWebSocketUrl(cdpUrl))
      return await diagnoseCdpWebSocketEndpoint({
        cdpUrl,
        wsUrl: cdpUrl,
        startedAt,
        handshakeTimeoutMs,
      });
    const classified = classifyChromeVersionError(err);
    return failureDiagnostic({
      cdpUrl,
      code: classified.code,
      message: classified.message,
      startedAt,
    });
  }
  const wsUrlRaw = normalizeOptionalString(version.webSocketDebuggerUrl) ?? "";
  if (!wsUrlRaw) {
    if (isWebSocketUrl(cdpUrl))
      return await diagnoseCdpWebSocketEndpoint({
        cdpUrl,
        wsUrl: cdpUrl,
        startedAt,
        handshakeTimeoutMs,
        version,
      });
    return failureDiagnostic({
      cdpUrl,
      code: "missing_websocket_debugger_url",
      message: "CDP /json/version did not include webSocketDebuggerUrl",
      startedAt,
    });
  }
  const wsUrl = normalizeCdpWsUrl(wsUrlRaw, discoveryUrl);
  try {
    await assertCdpEndpointAllowed(wsUrl, cdpControlPolicy, {
      source: "discovered",
      configuredUrl: cdpUrl,
    });
  } catch (err) {
    return failureDiagnostic({
      cdpUrl,
      wsUrl,
      code: "websocket_ssrf_blocked",
      message: safeChromeCdpErrorMessage(err),
      startedAt,
    });
  }
  const health = await diagnoseCdpHealthCommand(wsUrl, handshakeTimeoutMs);
  if (!health.ok) {
    if (isWebSocketUrl(cdpUrl) && wsUrl !== cdpUrl) {
      if ((await diagnoseCdpHealthCommand(cdpUrl, handshakeTimeoutMs)).ok)
        return {
          ok: true,
          cdpUrl,
          wsUrl: cdpUrl,
          browser: version.Browser,
          userAgent: version["User-Agent"],
          elapsedMs: elapsedSince(startedAt),
        };
    }
    return failureDiagnostic({
      cdpUrl,
      wsUrl,
      code: health.code,
      message: health.message,
      startedAt,
    });
  }
  return {
    ok: true,
    cdpUrl,
    wsUrl,
    browser: version.Browser,
    userAgent: version["User-Agent"],
    elapsedMs: elapsedSince(startedAt),
  };
}
//#endregion
//#region extensions/browser/src/browser/chrome.profile-decoration.ts
/**
 * OpenClaw-managed Chrome profile decoration.
 *
 * Applies managed-browser policy, a stable profile name, color, download
 * directory, and clean-exit markers to Chrome's profile files.
 */
const CHROME_NETWORK_PREDICTION_DISABLED = 2;
function decoratedMarkerPath(userDataDir) {
  return path.join(userDataDir, ".openclaw-profile-decorated");
}
function safeReadJson(filePath) {
  const parsed = loadJsonFile(filePath);
  return typeof parsed === "object" && parsed !== null && !Array.isArray(parsed) ? parsed : null;
}
function safeWriteJson(filePath, data) {
  saveJsonFile(filePath, data);
}
function asRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value) ? value : null;
}
function readNestedRecord(root, key) {
  return asRecord(asRecord(root)?.[key]);
}
function readDefaultProfileInfo(localState) {
  return readNestedRecord(readNestedRecord(asRecord(localState)?.profile, "info_cache"), "Default");
}
function setDeep(obj, keys, value) {
  if (keys.length === 0) return;
  let node = obj;
  for (const key of keys.slice(0, -1)) {
    const next = node[key];
    if (typeof next !== "object" || next === null || Array.isArray(next)) node[key] = {};
    node = node[key];
  }
  const lastKey = keys.at(-1);
  if (lastKey !== void 0) node[lastKey] = value;
}
function parseHexRgbToSignedArgbInt(hex) {
  const cleaned = hex.trim().replace(/^#/, "");
  if (!/^[0-9a-fA-F]{6}$/.test(cleaned)) return null;
  const argbUnsigned = (255 << 24) | Number.parseInt(cleaned, 16);
  return argbUnsigned > 2147483647 ? argbUnsigned - 4294967296 : argbUnsigned;
}
/** Return true when a managed Chrome profile already has desired decoration. */
function isProfileDecorated(userDataDir, desiredName, desiredColorHex, desiredDownloadDir) {
  const desiredColorInt = parseHexRgbToSignedArgbInt(desiredColorHex);
  const localStatePath = path.join(userDataDir, "Local State");
  const preferencesPath = path.join(userDataDir, "Default", "Preferences");
  const info = readDefaultProfileInfo(safeReadJson(localStatePath));
  const prefs = safeReadJson(preferencesPath);
  const browserTheme = readNestedRecord(prefs?.browser, "theme");
  const autogeneratedTheme = readNestedRecord(prefs?.autogenerated, "theme");
  const download = readNestedRecord(prefs, "download");
  const savefile = readNestedRecord(prefs, "savefile");
  const nameOk = typeof info?.name === "string" ? info.name === desiredName : true;
  const downloadOk = desiredDownloadDir
    ? download?.default_directory === desiredDownloadDir &&
      download.prompt_for_download === false &&
      download.directory_upgrade === true &&
      savefile?.default_directory === desiredDownloadDir
    : true;
  if (desiredColorInt == null) return nameOk && downloadOk;
  const localSeedOk =
    typeof info?.profile_color_seed === "number"
      ? info.profile_color_seed === desiredColorInt
      : false;
  const prefOk =
    (typeof browserTheme?.user_color2 === "number" &&
      browserTheme.user_color2 === desiredColorInt) ||
    (typeof autogeneratedTheme?.color === "number" && autogeneratedTheme.color === desiredColorInt);
  return nameOk && localSeedOk && prefOk && downloadOk;
}
/** Return whether this profile was initialized with Chromium's automation keychain. */
function usesOpenClawMockKeychain(userDataDir) {
  return (
    readDefaultProfileInfo(safeReadJson(path.join(userDataDir, "Local State")))
      ?.openclaw_mock_keychain === true
  );
}
/** Disable Chromium network prediction in an OpenClaw-managed Chrome profile. */
function ensureProfileNetworkPredictionDisabled(userDataDir) {
  const preferencesPath = path.join(userDataDir, "Default", "Preferences");
  const prefs = safeReadJson(preferencesPath) ?? {};
  setDeep(prefs, ["net", "network_prediction_options"], CHROME_NETWORK_PREDICTION_DISABLED);
  safeWriteJson(preferencesPath, prefs);
}
/**
 * Best-effort profile decoration (name + lobster-orange). Chrome preference keys
 * vary by version; we keep this conservative and idempotent.
 */
function decorateOpenClawProfile(userDataDir, opts) {
  const desiredName = opts?.name ?? "openclaw";
  const desiredColor = (opts?.color ?? "#FF4500").toUpperCase();
  const desiredColorInt = parseHexRgbToSignedArgbInt(desiredColor);
  const localStatePath = path.join(userDataDir, "Local State");
  const preferencesPath = path.join(userDataDir, "Default", "Preferences");
  const localState = safeReadJson(localStatePath) ?? {};
  setDeep(localState, ["profile", "info_cache", "Default", "name"], desiredName);
  setDeep(localState, ["profile", "info_cache", "Default", "shortcut_name"], desiredName);
  setDeep(localState, ["profile", "info_cache", "Default", "user_name"], desiredName);
  if (opts?.mockKeychain)
    setDeep(localState, ["profile", "info_cache", "Default", "openclaw_mock_keychain"], true);
  setDeep(localState, ["profile", "info_cache", "Default", "profile_color"], desiredColor);
  setDeep(localState, ["profile", "info_cache", "Default", "user_color"], desiredColor);
  if (desiredColorInt != null) {
    setDeep(
      localState,
      ["profile", "info_cache", "Default", "profile_color_seed"],
      desiredColorInt,
    );
    setDeep(
      localState,
      ["profile", "info_cache", "Default", "profile_highlight_color"],
      desiredColorInt,
    );
    setDeep(
      localState,
      ["profile", "info_cache", "Default", "default_avatar_fill_color"],
      desiredColorInt,
    );
    setDeep(
      localState,
      ["profile", "info_cache", "Default", "default_avatar_stroke_color"],
      desiredColorInt,
    );
  }
  safeWriteJson(localStatePath, localState);
  const prefs = safeReadJson(preferencesPath) ?? {};
  setDeep(prefs, ["profile", "name"], desiredName);
  setDeep(prefs, ["profile", "profile_color"], desiredColor);
  setDeep(prefs, ["profile", "user_color"], desiredColor);
  if (desiredColorInt != null) {
    setDeep(prefs, ["autogenerated", "theme", "color"], desiredColorInt);
    setDeep(prefs, ["browser", "theme", "user_color2"], desiredColorInt);
  }
  if (opts?.downloadDir) {
    setDeep(prefs, ["download", "default_directory"], opts.downloadDir);
    setDeep(prefs, ["download", "prompt_for_download"], false);
    setDeep(prefs, ["download", "directory_upgrade"], true);
    setDeep(prefs, ["savefile", "default_directory"], opts.downloadDir);
  }
  safeWriteJson(preferencesPath, prefs);
  try {
    fs.writeFileSync(decoratedMarkerPath(userDataDir), `${Date.now()}\n`, "utf-8");
  } catch {}
}
/** Mark the managed Chrome profile as cleanly exited. */
function ensureProfileCleanExit(userDataDir) {
  const preferencesPath = path.join(userDataDir, "Default", "Preferences");
  const prefs = safeReadJson(preferencesPath) ?? {};
  setDeep(prefs, ["exit_type"], "Normal");
  setDeep(prefs, ["exited_cleanly"], true);
  safeWriteJson(preferencesPath, prefs);
}
//#endregion
//#region extensions/browser/src/browser/output-directories.ts
/**
 * Browser output directory helper.
 *
 * Creates absolute output directories while handling macOS system symlink
 * aliases such as /tmp and /var safely.
 */
async function resolveSystemDirectoryAlias(dirPath) {
  for (const aliasRoot of ["/tmp", "/var"]) {
    if (dirPath !== aliasRoot && !dirPath.startsWith(`${aliasRoot}${path.sep}`)) continue;
    try {
      if (!(await fs$1.lstat(aliasRoot)).isSymbolicLink()) return dirPath;
      return path.join(await fs$1.realpath(aliasRoot), path.relative(aliasRoot, dirPath));
    } catch {
      return dirPath;
    }
  }
  return dirPath;
}
/** Ensure an absolute browser output directory exists and is safe to use. */
async function ensureOutputDirectory(dirPath) {
  const result = await ensureAbsoluteDirectory(
    await resolveSystemDirectoryAlias(path.resolve(dirPath)),
    { scopeLabel: "output directory" },
  );
  if (!result.ok) throw result.error;
}
//#endregion
//#region extensions/browser/src/browser/chrome.ts
/**
 * OpenClaw-managed Chrome lifecycle and CDP helpers.
 *
 * Builds launch args, starts/stops managed Chrome, probes CDP readiness, and
 * resolves WebSocket endpoints for browser control.
 */
const log = createSubsystemLogger("browser").child("chrome");
const CHROME_SINGLETON_LOCK_PATHS = ["SingletonLock", "SingletonSocket", "SingletonCookie"];
const CHROME_SINGLETON_IN_USE_PATTERN = /profile appears to be in use by another chromium process/i;
const CHROME_MISSING_DISPLAY_PATTERN = /missing x server|\$DISPLAY/i;
const CHROME_GRACEFUL_CLOSE_COMMAND_TIMEOUT_MS = 500;
const CHROME_LAUNCH_STDERR_TAIL_MAX_BYTES = 64 * 1024;
const CHROME_HTTP_DISCOVERY_FAILURE_CODES = /* @__PURE__ */ new Set([
  "ssrf_blocked",
  "http_unreachable",
  "http_status_failed",
  "invalid_json",
]);
const TCP_LISTEN_STATE_HEX = "0A";
function exists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}
function diagnosticShowsChromeHttpDiscovery(diagnostic) {
  if (!diagnostic) return false;
  if (diagnostic.ok) return true;
  return !CHROME_HTTP_DISCOVERY_FAILURE_CODES.has(diagnostic.code);
}
function createChromeLaunchStderrDiagnostics(maxBytes) {
  const tail = createBoundedUtf8Tail(maxBytes);
  const signals = {
    singletonInUse: false,
    missingDisplay: false,
  };
  let markerScanTail = "";
  const updateSignals = (chunkText) => {
    const scanText = `${markerScanTail}${chunkText}`;
    signals.singletonInUse ||= CHROME_SINGLETON_IN_USE_PATTERN.test(scanText);
    signals.missingDisplay ||= CHROME_MISSING_DISPLAY_PATTERN.test(scanText);
    markerScanTail = scanText.slice(-256);
  };
  return {
    append(chunk) {
      tail.append(chunk);
      const chunkText = Buffer.isBuffer(chunk) ? chunk.toString("utf8") : chunk;
      if (chunkText.length > 0) updateSignals(chunkText);
    },
    toString() {
      return tail.text();
    },
    signals() {
      return { ...signals };
    },
    clear() {
      tail.clear();
      signals.singletonInUse = false;
      signals.missingDisplay = false;
      markerScanTail = "";
    },
  };
}
function processExists(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (err) {
    if (err.code === "EPERM") return true;
    return false;
  }
}
function readSingletonLockTarget(userDataDir) {
  let target;
  try {
    target = fs.readlinkSync(path.join(userDataDir, "SingletonLock"));
  } catch {
    return null;
  }
  const match = /^(?<lockHost>.+)-(?<pid>\d+)$/.exec(target);
  if (!match?.groups) return null;
  const hostname = normalizeOptionalString(match.groups.lockHost) ?? "";
  const pid = Number.parseInt(match.groups.pid ?? "", 10);
  if (!Number.isInteger(pid) || pid <= 0) return null;
  return {
    hostname,
    pid,
  };
}
function readLinuxProcessStartTime(pid) {
  let stat;
  try {
    stat = fs.readFileSync(`/proc/${pid}/stat`, "utf8");
  } catch {
    return null;
  }
  return normalizeOptionalString(stat.slice(stat.lastIndexOf(")") + 2).split(/\s+/)[19]) ?? null;
}
function readLinuxProcessArgv(pid) {
  let cmdline;
  try {
    cmdline = fs.readFileSync(`/proc/${pid}/cmdline`);
  } catch {
    return null;
  }
  const argv = cmdline
    .toString("utf8")
    .split("\0")
    .filter((arg) => arg.length > 0);
  return argv.length > 0 ? argv : null;
}
function readPsCommandLine(pid) {
  try {
    return (
      normalizeOptionalString(
        execFileSync("ps", ["-ww", "-p", String(pid), "-o", "command="], {
          encoding: "utf8",
          timeout: 1e3,
          maxBuffer: 64 * 1024,
        }),
      ) ?? null
    );
  } catch {
    return null;
  }
}
function readPsStartTime(pid) {
  try {
    return (
      normalizeOptionalString(
        execFileSync("ps", ["-p", String(pid), "-o", "lstart="], {
          encoding: "utf8",
          timeout: 1e3,
          maxBuffer: 64 * 1024,
        }),
      ) ?? null
    );
  } catch {
    return null;
  }
}
function readManagedProcessCommandLine(pid) {
  if (process.platform === "linux") {
    const argv = readLinuxProcessArgv(pid);
    if (!argv) return null;
    const startTime = readLinuxProcessStartTime(pid);
    if (!startTime) return null;
    return {
      argv,
      text: argv.join(" "),
      startTime,
    };
  }
  if (process.platform === "darwin") {
    const text = readPsCommandLine(pid);
    const startTime = readPsStartTime(pid);
    if (!text || !startTime) return null;
    return {
      argv: null,
      text,
      startTime,
    };
  }
  return null;
}
function isChromeExecutableFamilyMatch(commandText, exe) {
  const normalizedCommand = commandText.toLowerCase();
  const configuredPath = exe.path.toLowerCase();
  const configuredBase = path.basename(exe.path).toLowerCase();
  if (
    normalizedCommand.includes(configuredPath) ||
    (configuredBase.length > 0 && normalizedCommand.includes(configuredBase))
  )
    return true;
  if (exe.kind === "chrome" || exe.kind === "canary")
    return /\b(google chrome|google-chrome|chrome|chromium)\b/i.test(commandText);
  if (exe.kind === "chromium") return /\b(chromium|chromium-browser)\b/i.test(commandText);
  if (exe.kind === "brave") return /\b(brave browser|brave-browser|brave)\b/i.test(commandText);
  if (exe.kind === "edge") return /\b(microsoft edge|microsoft-edge|msedge)\b/i.test(commandText);
  return false;
}
function processCommandHasArg(command, expected) {
  if (command.argv) return command.argv.includes(expected);
  return command.text.includes(expected);
}
function commandLineMatchesManagedChrome(params) {
  return (
    isChromeExecutableFamilyMatch(params.command.text, params.exe) &&
    processCommandHasArg(params.command, `--remote-debugging-port=${params.profile.cdpPort}`) &&
    processCommandHasArg(params.command, `--user-data-dir=${params.userDataDir}`)
  );
}
function parseLinuxTcpListenInodesForPort(table, port) {
  const expectedPort = port.toString(16).toUpperCase().padStart(4, "0");
  const inodes = /* @__PURE__ */ new Set();
  for (const line of table.split(/\r?\n/).slice(1)) {
    const fields = line.trim().split(/\s+/);
    const localAddress = fields[1] ?? "";
    const state = fields[3] ?? "";
    const inode = fields[9] ?? "";
    if (
      localAddress.split(":").at(-1)?.toUpperCase() === expectedPort &&
      state === TCP_LISTEN_STATE_HEX &&
      inode
    )
      inodes.add(inode);
  }
  return inodes;
}
function readLinuxTcpListenInodesForPort(port) {
  const inodes = /* @__PURE__ */ new Set();
  for (const tablePath of ["/proc/net/tcp", "/proc/net/tcp6"])
    try {
      for (const inode of parseLinuxTcpListenInodesForPort(
        fs.readFileSync(tablePath, "utf8"),
        port,
      ))
        inodes.add(inode);
    } catch {}
  return inodes;
}
function linuxPidOwnsAnySocketInode(pid, inodes) {
  if (inodes.size === 0) return false;
  let descriptors;
  try {
    descriptors = fs.readdirSync(`/proc/${pid}/fd`);
  } catch {
    return false;
  }
  for (const descriptor of descriptors) {
    let target;
    try {
      target = fs.readlinkSync(`/proc/${pid}/fd/${descriptor}`);
    } catch {
      continue;
    }
    const match = /^socket:\[(?<inode>\d+)\]$/.exec(target);
    if (match?.groups?.inode && inodes.has(match.groups.inode)) return true;
  }
  return false;
}
function linuxPidListensOnPort(pid, port) {
  return linuxPidOwnsAnySocketInode(pid, readLinuxTcpListenInodesForPort(port));
}
function lsofShowsPidListeningOnPort(pid, port) {
  try {
    return execFileSync(
      "lsof",
      ["-nP", "-a", "-p", String(pid), `-iTCP:${port}`, "-sTCP:LISTEN", "-Fp"],
      {
        encoding: "utf8",
        timeout: 1e3,
        maxBuffer: 64 * 1024,
      },
    )
      .split(/\r?\n/)
      .some((line) => line === `p${pid}`);
  } catch {
    return false;
  }
}
function pidListensOnPort(pid, port) {
  if (process.platform === "linux") return linuxPidListensOnPort(pid, port);
  if (process.platform === "darwin") return lsofShowsPidListeningOnPort(pid, port);
  return false;
}
function sameManagedChromeIdentity(a, b) {
  return a.pid === b.pid && a.commandLine === b.commandLine && a.startTime === b.startTime;
}
function readOwnedManagedChromeIdentity(params) {
  if (!processExists(params.pid) || !pidListensOnPort(params.pid, params.profile.cdpPort))
    return null;
  const command = readManagedProcessCommandLine(params.pid);
  if (
    !command ||
    !commandLineMatchesManagedChrome({
      command,
      exe: params.exe,
      profile: params.profile,
      userDataDir: params.userDataDir,
    })
  )
    return null;
  return {
    pid: params.pid,
    startTime: command.startTime,
    commandLine: command.text,
  };
}
function isPortInUseError(err) {
  const errno = err?.code;
  const name = err instanceof Error ? err.name : "";
  const message = err instanceof Error ? err.message : String(err);
  return (
    errno === "EADDRINUSE" ||
    name === "PortInUseError" ||
    /\bEADDRINUSE\b|already in use/i.test(message)
  );
}
function readCurrentHostSingletonPid(userDataDir, hostname = os.hostname()) {
  const lock = readSingletonLockTarget(userDataDir);
  if (!lock || lock.hostname !== hostname || !processExists(lock.pid)) return null;
  return lock.pid;
}
function clearChromeSingletonArtifacts(userDataDir) {
  for (const basename of CHROME_SINGLETON_LOCK_PATHS)
    try {
      fs.rmSync(path.join(userDataDir, basename), { force: true });
    } catch {}
}
/** Remove stale Chrome singleton lock files from a user-data-dir. */
function clearStaleChromeSingletonLocks(userDataDir, hostname = os.hostname()) {
  const lockPath = path.join(userDataDir, "SingletonLock");
  let target;
  try {
    target = fs.readlinkSync(lockPath);
  } catch {
    return false;
  }
  const match = /^(?<lockHost>.+)-(?<pid>\d+)$/.exec(target);
  if (!match?.groups) return false;
  const lockHost = normalizeOptionalString(match.groups.lockHost) ?? "";
  const pid = Number.parseInt(match.groups.pid ?? "", 10);
  if (lockHost === hostname && processExists(pid)) return false;
  clearChromeSingletonArtifacts(userDataDir);
  return true;
}
async function waitForChromeProcessExit(proc, timeoutMs) {
  if (proc.exitCode != null || proc.signalCode != null) return true;
  return await new Promise((resolve) => {
    const cleanup = () => {
      clearTimeout(timer);
      proc.off("exit", onExit);
      proc.off("close", onExit);
    };
    const timer = setTimeout(() => {
      cleanup();
      resolve(false);
    }, timeoutMs);
    const onExit = () => {
      cleanup();
      resolve(true);
    };
    proc.once("exit", onExit);
    proc.once("close", onExit);
    if (proc.exitCode != null || proc.signalCode != null) onExit();
  });
}
async function signalChromeProcess(proc, signal, timeoutMs) {
  if (proc.exitCode != null || proc.signalCode != null) return true;
  try {
    proc.kill(signal);
  } catch {}
  return await waitForChromeProcessExit(proc, timeoutMs);
}
async function terminateChromeForRetry(proc, userDataDir) {
  if (!(await signalChromeProcess(proc, "SIGKILL", 5e3))) return false;
  clearStaleChromeSingletonLocks(userDataDir);
  return true;
}
async function waitForPidExit(pid, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (!processExists(pid)) return true;
    await new Promise((resolve) => {
      setTimeout(resolve, 50);
    });
  }
  return !processExists(pid);
}
async function terminateOwnedStaleChromeProcess(params, timeoutMs = CHROME_STOP_TIMEOUT_MS) {
  const readCurrentIdentity = () =>
    readOwnedManagedChromeIdentity({
      pid: params.identity.pid,
      exe: params.exe,
      profile: params.profile,
      userDataDir: params.userDataDir,
    });
  const beforeSigterm = readCurrentIdentity();
  if (!beforeSigterm || !sameManagedChromeIdentity(params.identity, beforeSigterm)) return false;
  try {
    process.kill(params.identity.pid, "SIGTERM");
  } catch {
    return false;
  }
  if (await waitForPidExit(params.identity.pid, timeoutMs)) return true;
  const beforeSigkill = readCurrentIdentity();
  if (!beforeSigkill || !sameManagedChromeIdentity(params.identity, beforeSigkill)) return false;
  try {
    process.kill(params.identity.pid, "SIGKILL");
  } catch {
    return false;
  }
  return await waitForPidExit(params.identity.pid, CHROME_BOOTSTRAP_EXIT_TIMEOUT_MS);
}
function clearRecoveredChromeSingletonArtifacts(userDataDir, pid) {
  const lock = readSingletonLockTarget(userDataDir);
  if (!lock || lock.hostname !== os.hostname() || lock.pid !== pid || processExists(pid))
    return false;
  clearChromeSingletonArtifacts(userDataDir);
  return true;
}
async function recoverOwnedStaleManagedChromeCdpListener(params) {
  if (!params.profile.cdpIsLoopback) return false;
  const pid = readCurrentHostSingletonPid(params.userDataDir);
  if (pid == null) return false;
  let diagnostic;
  try {
    diagnostic = await diagnoseChromeCdp(params.profile.cdpUrl, 500, 800);
  } catch {
    return false;
  }
  if (diagnostic.ok || diagnostic.code !== "websocket_health_command_timeout") return false;
  const identity = readOwnedManagedChromeIdentity({
    pid,
    exe: params.exe,
    profile: params.profile,
    userDataDir: params.userDataDir,
  });
  if (!identity) return false;
  if (
    !(await terminateOwnedStaleChromeProcess({
      identity,
      exe: params.exe,
      profile: params.profile,
      userDataDir: params.userDataDir,
    }))
  )
    return false;
  if (!clearRecoveredChromeSingletonArtifacts(params.userDataDir, pid)) return false;
  log.warn(
    `Stopped stale managed Chrome CDP listener for profile "${params.profile.name}" (pid ${pid}) and retrying launch.`,
  );
  return true;
}
async function ensureManagedChromePortAvailable(resolved, profile, userDataDir) {
  const configuredHost = new URL(profile.cdpUrl).hostname.replace(/^\[|\]$/g, "");
  const probeHosts =
    configuredHost === "127.0.0.1" ? [configuredHost] : ["127.0.0.1", configuredHost];
  const ensureProbeHostsAvailable = async () => {
    for (const host of probeHosts) await ensurePortAvailable(profile.cdpPort, host);
  };
  try {
    await ensureProbeHostsAvailable();
    return;
  } catch (err) {
    const exe = resolveBrowserExecutable(resolved, profile);
    if (!isPortInUseError(err) || !exe) throw err;
    if (
      !(await recoverOwnedStaleManagedChromeCdpListener({
        exe,
        profile,
        userDataDir,
      }))
    )
      throw err;
  }
  await ensureProbeHostsAvailable();
}
function chromeLaunchHints(params) {
  const hints = [];
  if (process.platform === "linux" && !params.resolved.noSandbox)
    hints.push("If running in a container or as root, try setting browser.noSandbox: true.");
  const headlessMode = resolveManagedBrowserHeadlessMode(
    params.resolved,
    params.profile,
    params.launchOptions,
  );
  if (
    (params.stderrSignals?.missingDisplay ??
      CHROME_MISSING_DISPLAY_PATTERN.test(params.stderrOutput)) &&
    !headlessMode.headless
  )
    hints.push(
      "No DISPLAY/X server was detected. Set OPENCLAW_BROWSER_HEADLESS=1, remove the headed override, start Xvfb, or run the Gateway in a desktop session.",
    );
  if (
    params.stderrSignals?.singletonInUse ??
    CHROME_SINGLETON_IN_USE_PATTERN.test(params.stderrOutput)
  )
    hints.push(
      `The Chromium profile "${params.profile.name}" is locked. Stop the existing browser or remove stale Singleton* lock files under ~/.openclaw/browser/${params.profile.name}/user-data.`,
    );
  return hints.length > 0 ? `\nHint: ${hints.join("\nHint: ")}` : "";
}
/** A managed child survived bounded cancellation and remains actor-owned for retry. */
var ManagedChromeCleanupError = class extends Error {
  constructor(message, running) {
    super(message);
    this.running = running;
    this.code = "MANAGED_CHROME_CLEANUP_FAILED";
    this.name = "ManagedChromeCleanupError";
  }
};
function resolveBrowserExecutable(resolved, profile) {
  return resolveBrowserExecutableForPlatform(
    {
      ...resolved,
      executablePath: profile.executablePath ?? resolved.executablePath,
    },
    process.platform,
  );
}
/** Resolve the user-data-dir path for a managed OpenClaw Chrome profile. */
function resolveOpenClawUserDataDir(profileName = DEFAULT_OPENCLAW_BROWSER_PROFILE_NAME) {
  return path.join(CONFIG_DIR, "browser", profileName, "user-data");
}
function cdpUrlForPort(cdpPort) {
  return `http://127.0.0.1:${cdpPort}`;
}
/** Build Chrome launch arguments for the managed OpenClaw browser. */
function buildOpenClawChromeLaunchArgs(params) {
  const { resolved, profile, userDataDir } = params;
  const platform = params.platform ?? process.platform;
  const headlessMode = resolveManagedBrowserHeadlessMode(resolved, profile, params);
  const args = [
    `--remote-debugging-port=${profile.cdpPort}`,
    `--user-data-dir=${userDataDir}`,
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-sync",
    "--disable-background-networking",
    "--disable-component-update",
    "--disable-features=Translate,MediaRouter",
    "--disable-session-crashed-bubble",
    "--hide-crash-restore-bubble",
    "--password-store=basic",
  ];
  if (platform === "darwin" && params.useMockKeychain) args.push("--use-mock-keychain");
  if (headlessMode.headless) {
    args.push("--headless=new");
    args.push("--disable-gpu");
  } else if (process.platform === "linux" && process.env.DISPLAY) args.push("--ozone-platform=x11");
  if (resolved.noSandbox) args.push("--no-sandbox");
  if (platform === "linux") args.push("--disable-dev-shm-usage");
  if (!hasChromeProxyControlArg(resolved.extraArgs)) args.push("--no-proxy-server");
  if (resolved.extraArgs.length > 0) args.push(...resolved.extraArgs);
  return args;
}
async function canOpenWebSocket(url, timeoutMs) {
  return new Promise((resolve) => {
    const ws = openCdpWebSocket(url, { handshakeTimeoutMs: timeoutMs });
    let settled = false;
    const finish = (value) => {
      if (settled) return;
      settled = true;
      resolve(value);
    };
    ws.once("open", () => {
      try {
        ws.close();
      } catch {}
      finish(true);
    });
    ws.once("error", () => finish(false));
    ws.once("close", () => finish(false));
  });
}
/** Return true when a Chrome CDP endpoint is reachable over HTTP. */
async function isChromeReachable(cdpUrl, timeoutMs = 500, ssrfPolicy) {
  try {
    await assertCdpEndpointAllowed(cdpUrl, ssrfPolicy);
    if (isDirectCdpWebSocketEndpoint(cdpUrl)) return await canOpenWebSocket(cdpUrl, timeoutMs);
    if (
      await fetchChromeVersion(
        isWebSocketUrl(cdpUrl) ? normalizeCdpHttpBaseForJsonEndpoints(cdpUrl) : cdpUrl,
        timeoutMs,
        ssrfPolicy,
      )
    )
      return true;
    if (isWebSocketUrl(cdpUrl)) return await canOpenWebSocket(cdpUrl, timeoutMs);
    return false;
  } catch {
    return false;
  }
}
async function fetchChromeVersion(cdpUrl, timeoutMs = 500, ssrfPolicy) {
  try {
    return await readChromeVersionWithCredentialFallback(cdpUrl, timeoutMs, ssrfPolicy);
  } catch {
    return null;
  }
}
/** Resolve a usable Chrome DevTools WebSocket URL from a CDP endpoint. */
async function getChromeWebSocketUrl(cdpUrl, timeoutMs = 500, ssrfPolicy) {
  await assertCdpEndpointAllowed(cdpUrl, ssrfPolicy);
  const cdpControlPolicy = scopeCdpPolicyToConfiguredEndpoint(cdpUrl, ssrfPolicy);
  if (isDirectCdpWebSocketEndpoint(cdpUrl)) return cdpUrl;
  const discoveryUrl = isWebSocketUrl(cdpUrl)
    ? normalizeCdpHttpBaseForJsonEndpoints(cdpUrl)
    : cdpUrl;
  const wsUrl =
    normalizeOptionalString(
      (await fetchChromeVersion(discoveryUrl, timeoutMs, cdpControlPolicy))?.webSocketDebuggerUrl,
    ) ?? "";
  if (!wsUrl) {
    if (isWebSocketUrl(cdpUrl)) return cdpUrl;
    return null;
  }
  const normalizedWsUrl = normalizeCdpWsUrl(wsUrl, discoveryUrl);
  await assertCdpEndpointAllowed(normalizedWsUrl, cdpControlPolicy, {
    source: "discovered",
    configuredUrl: cdpUrl,
  });
  return normalizedWsUrl;
}
/** Return true when a Chrome CDP endpoint has a healthy WebSocket command path. */
async function isChromeCdpReady(cdpUrl, timeoutMs = 500, handshakeTimeoutMs = 800, ssrfPolicy) {
  const diagnostic = await diagnoseChromeCdp(cdpUrl, timeoutMs, handshakeTimeoutMs, ssrfPolicy);
  if (!diagnostic.ok) log.debug(formatChromeCdpDiagnostic(diagnostic));
  return diagnostic.ok;
}
async function waitForManagedLaunchPoll(delayMs, signal) {
  signal?.throwIfAborted();
  try {
    await setTimeout$1(delayMs, void 0, signal ? { signal } : void 0);
  } catch (err) {
    signal?.throwIfAborted();
    throw err;
  }
}
/** Launch or attach to the managed OpenClaw Chrome profile. */
async function launchOpenClawChrome(resolved, profile, launchOptions = {}) {
  const { signal, ...headlessOptions } = launchOptions;
  signal?.throwIfAborted();
  if (!profile.cdpIsLoopback)
    throw new Error(`Profile "${profile.name}" is remote; cannot launch local Chrome.`);
  const headlessMode = resolveManagedBrowserHeadlessMode(resolved, profile, headlessOptions);
  const missingDisplayError = getManagedBrowserMissingDisplayError(
    resolved,
    profile,
    headlessOptions,
  );
  if (missingDisplayError)
    throw new BrowserProfileUnavailableError(missingDisplayError.message, {
      metadata: {
        reason: BROWSER_ERROR_REASONS.noDisplayForHeadedProfile,
        details: {
          profile: profile.name,
          requestedHeadless: false,
          headlessSource: missingDisplayError.headlessSource,
          displayPresent: false,
        },
      },
    });
  try {
    assertManagedProxyAllowsCdpUrl(profile.cdpUrl);
  } catch (err) {
    throw new BrowserProfileUnavailableError(
      `Browser profile "${profile.name}" cannot launch: ${err instanceof Error ? err.message : String(err)}`,
    );
  }
  const userDataDir = resolveOpenClawUserDataDir(profile.name);
  await ensureManagedChromePortAvailable(resolved, profile, userDataDir);
  signal?.throwIfAborted();
  const exe = resolveBrowserExecutable(resolved, profile);
  if (!exe)
    throw new Error(
      "No supported browser found (Chrome/Brave/Edge/Chromium on macOS, Linux, or Windows).",
    );
  fs.mkdirSync(userDataDir, { recursive: true });
  await ensureOutputDirectory(DEFAULT_DOWNLOAD_DIR);
  const localStatePath = path.join(userDataDir, "Local State");
  const preferencesPath = path.join(userDataDir, "Default", "Preferences");
  const profileIsNew = !exists(localStatePath);
  const needsBootstrap = profileIsNew || !exists(preferencesPath);
  const useMockKeychain =
    process.platform === "darwin" &&
    (usesOpenClawMockKeychain(userDataDir) || (profileIsNew && headlessMode.headless));
  const needsDecorate = !isProfileDecorated(
    userDataDir,
    profile.name,
    (profile.color ?? "#FF4500").toUpperCase(),
    DEFAULT_DOWNLOAD_DIR,
  );
  const spawnOnce = async (onStderr) => {
    signal?.throwIfAborted();
    const args = buildOpenClawChromeLaunchArgs({
      resolved,
      profile,
      userDataDir,
      ...headlessOptions,
      useMockKeychain,
    });
    const env = {
      ...omitChromeProxyEnv(process.env),
      HOME: os.homedir(),
    };
    if (process.platform === "linux") {
      const chromiumStateDir = path.join(resolvePreferredOpenClawTmpDir(), ".chromium");
      env.XDG_CONFIG_HOME ??= chromiumStateDir;
      env.XDG_CACHE_HOME ??= chromiumStateDir;
    }
    const preparedSpawn = prepareOomScoreAdjustedSpawn(exe.path, args, { env });
    const proc = spawn(preparedSpawn.command, preparedSpawn.args, {
      stdio: ["ignore", "ignore", "pipe"],
      env: preparedSpawn.env,
    });
    const onAbort = () => {
      try {
        proc.kill("SIGKILL");
      } catch {}
    };
    signal?.addEventListener("abort", onAbort, { once: true });
    if (signal?.aborted) onAbort();
    proc.on("error", (err) => {
      log.debug(`managed Chrome process error: ${redactToolPayloadText(String(err))}`);
    });
    if (onStderr) proc.stderr?.on("data", onStderr);
    if (proc.pid == null)
      try {
        await once(proc, "spawn");
      } catch (err) {
        signal?.removeEventListener("abort", onAbort);
        if (onStderr) proc.stderr?.off("data", onStderr);
        throw err;
      }
    const pid = proc.pid;
    if (pid == null) {
      signal?.removeEventListener("abort", onAbort);
      if (onStderr) proc.stderr?.off("data", onStderr);
      throw new Error("Managed Chrome process spawned without a pid.");
    }
    return {
      pid,
      proc,
      releaseAbort: () => signal?.removeEventListener("abort", onAbort),
    };
  };
  const startedAt = Date.now();
  const runningForProcess = (proc, pid) => ({
    pid,
    exe,
    userDataDir,
    cdpPort: profile.cdpPort,
    startedAt,
    proc,
    headless: headlessMode.headless,
    headlessSource: headlessMode.source,
  });
  if (needsBootstrap) {
    const { pid: bootstrapPid, proc: bootstrap, releaseAbort } = await spawnOnce();
    let bootstrapError;
    try {
      const deadline = Date.now() + CHROME_BOOTSTRAP_PREFS_TIMEOUT_MS;
      while (Date.now() < deadline) {
        signal?.throwIfAborted();
        if (exists(localStatePath) && exists(preferencesPath)) break;
        await waitForManagedLaunchPoll(100, signal);
      }
    } catch (err) {
      bootstrapError =
        err instanceof Error ? err : new Error("Managed Chrome bootstrap failed.", { cause: err });
    }
    let exited = await signalChromeProcess(bootstrap, "SIGTERM", CHROME_BOOTSTRAP_EXIT_TIMEOUT_MS);
    if (!exited)
      exited = await signalChromeProcess(bootstrap, "SIGKILL", CHROME_BOOTSTRAP_EXIT_TIMEOUT_MS);
    releaseAbort();
    if (!exited)
      throw new ManagedChromeCleanupError(
        `Managed Chrome bootstrap ${bootstrapPid} survived cleanup.`,
        runningForProcess(bootstrap, bootstrapPid),
      );
    if (bootstrapError) throw bootstrapError;
  }
  signal?.throwIfAborted();
  if (needsDecorate)
    try {
      decorateOpenClawProfile(userDataDir, {
        name: profile.name,
        color: profile.color,
        downloadDir: DEFAULT_DOWNLOAD_DIR,
        mockKeychain: useMockKeychain,
      });
      log.info(`🦞 openclaw browser profile decorated (${profile.color})`);
    } catch (err) {
      log.warn(`openclaw browser profile decoration failed: ${String(err)}`);
    }
  try {
    ensureProfileNetworkPredictionDisabled(userDataDir);
  } catch (err) {
    log.warn(`openclaw browser network-prediction prefs failed: ${String(err)}`);
  }
  try {
    ensureProfileCleanExit(userDataDir);
  } catch (err) {
    log.warn(`openclaw browser clean-exit prefs failed: ${String(err)}`);
  }
  signal?.throwIfAborted();
  const launchOnceAndWait = async (allowSingletonRecovery) => {
    const stderrDiagnostics = createChromeLaunchStderrDiagnostics(
      CHROME_LAUNCH_STDERR_TAIL_MAX_BYTES,
    );
    const onStderr = (chunk) => {
      stderrDiagnostics.append(chunk);
    };
    let proc;
    let releaseSpawnAbort;
    try {
      const spawned = await spawnOnce(onStderr);
      proc = spawned.proc;
      releaseSpawnAbort = spawned.releaseAbort;
      const readyDeadline =
        Date.now() + (resolved.localLaunchTimeoutMs ?? CHROME_LAUNCH_READY_WINDOW_MS);
      let launchHttpReachable = false;
      while (Date.now() < readyDeadline) {
        signal?.throwIfAborted();
        if (await isChromeReachable(profile.cdpUrl)) {
          launchHttpReachable = true;
          break;
        }
        await waitForManagedLaunchPoll(200, signal);
      }
      if (!launchHttpReachable) {
        signal?.throwIfAborted();
        let finalDiagnostic = null;
        let diagnosticErrorText = null;
        try {
          finalDiagnostic = await diagnoseChromeCdp(profile.cdpUrl, 500, 800);
        } catch (err) {
          diagnosticErrorText = `CDP diagnostic failed: ${safeChromeCdpErrorMessage(err)}.`;
        }
        signal?.throwIfAborted();
        if (diagnosticShowsChromeHttpDiscovery(finalDiagnostic)) launchHttpReachable = true;
        const diagnosticText = finalDiagnostic
          ? formatChromeCdpDiagnostic(finalDiagnostic)
          : (diagnosticErrorText ?? "CDP diagnostic failed.");
        if (launchHttpReachable) log.debug(diagnosticText);
        else {
          const stderrOutput = normalizeOptionalString(stderrDiagnostics.toString()) ?? "";
          const stderrSignals = stderrDiagnostics.signals();
          const redactedStderrOutput = redactToolPayloadText(stderrOutput);
          if (
            allowSingletonRecovery &&
            stderrSignals.singletonInUse &&
            clearStaleChromeSingletonLocks(userDataDir)
          ) {
            log.warn(
              `Removed stale Chromium Singleton* locks for profile "${profile.name}" and retrying launch.`,
            );
            if (!(await terminateChromeForRetry(proc, userDataDir)))
              throw new ManagedChromeCleanupError(
                `Managed Chrome process ${spawned.pid} survived singleton recovery.`,
                runningForProcess(proc, spawned.pid),
              );
            releaseSpawnAbort();
            releaseSpawnAbort = void 0;
            return await launchOnceAndWait(false);
          }
          const stderrHint = redactedStderrOutput
            ? `\nChrome stderr:\n${sliceUtf16Safe(redactedStderrOutput, -CHROME_STDERR_HINT_MAX_CHARS)}`
            : "";
          const launchHints = chromeLaunchHints({
            stderrOutput,
            stderrSignals,
            resolved,
            profile,
            launchOptions: headlessOptions,
          });
          try {
            proc.kill("SIGKILL");
          } catch {}
          throw new Error(
            `Failed to start Chrome CDP on port ${profile.cdpPort} for profile "${profile.name}". ${diagnosticText}${launchHints}${stderrHint}`,
          );
        }
      }
      signal?.throwIfAborted();
      const pid = spawned.pid;
      log.info(
        `🦞 openclaw browser started (${exe.kind}) profile "${profile.name}" on 127.0.0.1:${profile.cdpPort} (pid ${pid})`,
      );
      return runningForProcess(proc, pid);
    } catch (err) {
      if (proc) {
        const pid = proc.pid;
        if (!(await signalChromeProcess(proc, "SIGKILL", 5e3)) && typeof pid === "number")
          throw new ManagedChromeCleanupError(
            `Managed Chrome process ${pid} survived launch cleanup.`,
            runningForProcess(proc, pid),
          );
      }
      if (err instanceof ManagedChromeCleanupError) {
        if (err.running.proc !== proc) throw err;
        throw new Error(`${err.message} Exact child cleanup succeeded on retry.`, { cause: err });
      }
      throw err;
    } finally {
      releaseSpawnAbort?.();
      proc?.stderr?.off("data", onStderr);
      stderrDiagnostics.clear();
    }
  };
  return await launchOnceAndWait(true);
}
function cdpProcessListOwnsBrowser(result, pid) {
  if (!result || typeof result !== "object" || !("processInfo" in result)) return false;
  const processInfo = result.processInfo;
  return (
    Array.isArray(processInfo) &&
    processInfo.some(
      (entry) =>
        entry !== null && typeof entry === "object" && entry.type === "browser" && entry.id === pid,
    )
  );
}
/** Verify that a managed CDP endpoint belongs to the exact spawned browser pid. */
async function isChromeCdpOwnedByPid(cdpUrl, pid, timeoutMs, ssrfPolicy) {
  try {
    const wsUrl = await getChromeWebSocketUrl(cdpUrl, timeoutMs, ssrfPolicy);
    if (!wsUrl) return false;
    let owned = false;
    await withCdpSocket(
      wsUrl,
      async (send) => {
        owned = cdpProcessListOwnsBrowser(await send("SystemInfo.getProcessInfo"), pid);
      },
      {
        commandTimeoutMs: timeoutMs,
        handshakeRetries: 0,
        handshakeTimeoutMs: timeoutMs,
      },
    );
    return owned;
  } catch {
    return false;
  }
}
async function requestGracefulChromeClose(running, timeoutMs) {
  const commandTimeoutMs = Math.max(
    1,
    Math.min(timeoutMs, CHROME_GRACEFUL_CLOSE_COMMAND_TIMEOUT_MS),
  );
  let commandSent = false;
  try {
    const wsUrl = await getChromeWebSocketUrl(
      cdpUrlForPort(running.cdpPort),
      Math.min(commandTimeoutMs, 200),
    );
    if (!wsUrl) return false;
    await withCdpSocket(
      wsUrl,
      async (send) => {
        if (!cdpProcessListOwnsBrowser(await send("SystemInfo.getProcessInfo"), running.pid))
          return;
        commandSent = true;
        await send("Browser.close");
      },
      {
        commandTimeoutMs,
        handshakeTimeoutMs: commandTimeoutMs,
        handshakeRetries: 0,
      },
    );
    return commandSent;
  } catch (err) {
    log.debug(`Chrome graceful close skipped: ${safeChromeCdpErrorMessage(err)}`);
    return commandSent;
  }
}
/** Stop a managed Chrome process and wait for shutdown. */
async function stopOpenClawChrome(running, timeoutMs = CHROME_STOP_TIMEOUT_MS) {
  const proc = running.proc;
  if (proc.exitCode != null || proc.signalCode != null) return;
  if (
    (await requestGracefulChromeClose(running, timeoutMs)) &&
    (await waitForChromeProcessExit(proc, timeoutMs))
  )
    return;
  if (await signalChromeProcess(proc, "SIGTERM", timeoutMs)) return;
  if (!(await signalChromeProcess(proc, "SIGKILL", timeoutMs)))
    throw new ManagedChromeCleanupError(
      `Managed Chrome process ${running.pid} survived shutdown.`,
      running,
    );
}
//#endregion
export {
  assertBrowserNavigationResultAllowed as A,
  parseRoleRef as C,
  InvalidBrowserNavigationUrlError as D,
  STRUCTURAL_ROLES as E,
  requiresInspectableBrowserNavigationRedirectsForUrl as M,
  withBrowserNavigationPolicy as N,
  assertBrowserNavigationAllowed as O,
  resolveBrowserNavigationProxyMode as P,
  finalizeRoleSnapshot as S,
  INTERACTIVE_ROLES as T,
  normalizeCdpWsUrl as _,
  isChromeReachable as a,
  buildRoleSnapshotFromAiSnapshot as b,
  stopOpenClawChrome as c,
  diagnoseChromeCdp as d,
  formatChromeCdpDiagnostic as f,
  formatAriaSnapshot as g,
  createTargetViaCdp as h,
  isChromeCdpReady as i,
  parseBrowserNavigationUrl as j,
  assertBrowserNavigationRedirectChainAllowed as k,
  ensureOutputDirectory as l,
  captureScreenshot as m,
  getChromeWebSocketUrl as n,
  launchOpenClawChrome as o,
  AX_REF_PATTERN as p,
  isChromeCdpOwnedByPid as r,
  resolveOpenClawUserDataDir as s,
  ManagedChromeCleanupError as t,
  usesOpenClawMockKeychain as u,
  snapshotAria as v,
  CONTENT_ROLES as w,
  buildRoleSnapshotFromAriaSnapshot as x,
  snapshotRoleViaCdp as y,
};
