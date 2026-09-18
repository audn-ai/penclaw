import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import os from "node:os";
import "./parse-finite-number-Z7n6tXLk.js";
import path from "node:path";
import { prerelease, satisfies } from "semver";
import { a as sha256Hex, t as sha256Base64 } from "./crypto-digest-CNeb2i19.js";
import { d as readResponseWithLimit, u as readResponseTextSnippet } from "./http-body-aoMvQQlg.js";
import { s as parseRegistryNpmSpec } from "./npm-registry-spec-CqBTTiC9.js";
import {
  b as parseStrictPositiveInteger,
  j as resolveTimerTimeoutMs,
  y as parseStrictNonNegativeInteger,
} from "./number-coercion-CJQ8TR--.js";
import { t as retryAsync } from "./retry-CcVvEFm0.js";
import { a as parseSemver, n as isAtLeast } from "./runtime-guard-BFPw9ugu.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
} from "./string-coerce-DW4mBlAt.js";
import { l as normalizeStringEntries } from "./string-normalization-CRyoFBPt.js";
import { n as createTempDownloadTarget } from "./temp-download-lJ1zbvdM.js";
//#region packages/ai/src/internal/retry-after.ts
const HTTP_DATE_MONTH_INDEX = new Map(
  ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(
    (month, index) => [month, index],
  ),
);
const HTTP_DATE_SHORT_WEEKDAY_INDEX = new Map(
  ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((weekday, index) => [weekday, index]),
);
const HTTP_DATE_LONG_WEEKDAY_INDEX = new Map(
  ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(
    (weekday, index) => [weekday, index],
  ),
);
const IMF_FIXDATE_RE =
  /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d{2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d{2}):(\d{2}):(\d{2}) GMT$/;
const OBSOLETE_RFC850_DATE_RE =
  /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (\d{2})-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d{2}) (\d{2}):(\d{2}):(\d{2}) GMT$/;
const OBSOLETE_ASCTIME_DATE_RE =
  /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{2}| \d) (\d{2}):(\d{2}):(\d{2}) (\d{4})$/;
/** Parses the three HTTP-date forms accepted for Retry-After without Date.parse normalization. */
function parseRetryAfterHttpDateMs(value, nowMs = Date.now()) {
  const imfFixdate = IMF_FIXDATE_RE.exec(value);
  if (imfFixdate)
    return parseHttpDateComponentsMs({
      weekday: HTTP_DATE_SHORT_WEEKDAY_INDEX.get(imfFixdate[1] ?? ""),
      year: Number.parseInt(imfFixdate[4] ?? "", 10),
      month: HTTP_DATE_MONTH_INDEX.get(imfFixdate[3] ?? ""),
      day: Number.parseInt(imfFixdate[2] ?? "", 10),
      hours: Number.parseInt(imfFixdate[5] ?? "", 10),
      minutes: Number.parseInt(imfFixdate[6] ?? "", 10),
      seconds: Number.parseInt(imfFixdate[7] ?? "", 10),
    });
  const rfc850Date = OBSOLETE_RFC850_DATE_RE.exec(value);
  if (rfc850Date) {
    const now = new Date(nowMs);
    if (Number.isNaN(now.getTime())) return;
    const shortYear = Number.parseInt(rfc850Date[4] ?? "", 10);
    const candidateYear = Math.floor(now.getUTCFullYear() / 100) * 100 + shortYear;
    const components = {
      weekday: HTTP_DATE_LONG_WEEKDAY_INDEX.get(rfc850Date[1] ?? ""),
      month: HTTP_DATE_MONTH_INDEX.get(rfc850Date[3] ?? ""),
      day: Number.parseInt(rfc850Date[2] ?? "", 10),
      hours: Number.parseInt(rfc850Date[5] ?? "", 10),
      minutes: Number.parseInt(rfc850Date[6] ?? "", 10),
      seconds: Number.parseInt(rfc850Date[7] ?? "", 10),
    };
    const candidate = parseHttpDateCalendarMs({
      year: candidateYear,
      ...components,
    });
    if (candidate === void 0) return;
    return parseHttpDateComponentsMs({
      year:
        candidate >
        Date.UTC(
          now.getUTCFullYear() + 50,
          now.getUTCMonth(),
          now.getUTCDate(),
          now.getUTCHours(),
          now.getUTCMinutes(),
          now.getUTCSeconds(),
          now.getUTCMilliseconds(),
        )
          ? candidateYear - 100
          : candidateYear,
      ...components,
    });
  }
  const asctimeDate = OBSOLETE_ASCTIME_DATE_RE.exec(value);
  if (asctimeDate)
    return parseHttpDateComponentsMs({
      weekday: HTTP_DATE_SHORT_WEEKDAY_INDEX.get(asctimeDate[1] ?? ""),
      year: Number.parseInt(asctimeDate[7] ?? "", 10),
      month: HTTP_DATE_MONTH_INDEX.get(asctimeDate[2] ?? ""),
      day: Number.parseInt((asctimeDate[3] ?? "").trim(), 10),
      hours: Number.parseInt(asctimeDate[4] ?? "", 10),
      minutes: Number.parseInt(asctimeDate[5] ?? "", 10),
      seconds: Number.parseInt(asctimeDate[6] ?? "", 10),
    });
}
function parseHttpDateComponentsMs(components) {
  const timestamp = parseHttpDateCalendarMs(components);
  if (timestamp === void 0) return;
  const weekdayTimestamp = components.seconds === 60 ? timestamp - 1e3 : timestamp;
  if (new Date(weekdayTimestamp).getUTCDay() !== components.weekday) return;
  return timestamp;
}
function parseHttpDateCalendarMs(components) {
  const { year, month, day, hours, minutes, seconds } = components;
  if (
    month === void 0 ||
    !Number.isInteger(year) ||
    year < 1900 ||
    !Number.isInteger(day) ||
    day < 1 ||
    day > 31 ||
    !Number.isInteger(hours) ||
    hours < 0 ||
    hours > 23 ||
    !Number.isInteger(minutes) ||
    minutes < 0 ||
    minutes > 59 ||
    !Number.isInteger(seconds) ||
    seconds < 0 ||
    seconds > 60
  )
    return;
  const calendarSecond = Math.min(seconds, 59);
  const timestamp = Date.UTC(year, month, day, hours, minutes, calendarSecond);
  const parsedDate = new Date(timestamp);
  if (
    parsedDate.getUTCFullYear() !== year ||
    parsedDate.getUTCMonth() !== month ||
    parsedDate.getUTCDate() !== day ||
    parsedDate.getUTCHours() !== hours ||
    parsedDate.getUTCMinutes() !== minutes ||
    parsedDate.getUTCSeconds() !== calendarSecond
  )
    return;
  return seconds === 60 ? timestamp + 1e3 : timestamp;
}
//#endregion
//#region src/infra/clawhub-retry.ts
const CLAWHUB_RETRY_DELAYS_MS = [1e3, 3e3, 1e4];
const CLAWHUB_MAX_RETRY_AFTER_MS = 6e4;
var RetryableClawHubResponse = class extends Error {
  constructor(result) {
    super(`ClawHub request returned retryable status ${result.response.status}`);
    this.result = result;
  }
};
function isRetryableClawHubStatus(status, retryRateLimit) {
  return (retryRateLimit && status === 429) || status === 502 || status === 503 || status === 504;
}
function parseRetryAfterMs(headers) {
  const retryAfter = headers.get("retry-after")?.trim();
  if (!retryAfter) return;
  if (/^\d+$/.test(retryAfter)) {
    const seconds = Number(retryAfter);
    const delayMs = Math.round(seconds * 1e3);
    return delayMs <= CLAWHUB_MAX_RETRY_AFTER_MS ? delayMs : void 0;
  }
  const retryAt = parseRetryAfterHttpDateMs(retryAfter);
  if (retryAt === void 0) return;
  const delayMs = Math.max(0, retryAt - Date.now());
  return delayMs <= CLAWHUB_MAX_RETRY_AFTER_MS ? delayMs : void 0;
}
async function defaultSleep(ms) {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
/**
 * Retries idempotent ClawHub reads on transient HTTP and transport failures.
 * Callers retain the final response so their existing body limits and errors apply.
 */
async function retryClawHubRead(request, options) {
  try {
    return await retryAsync(
      async () => {
        const result = await request();
        if (isRetryableClawHubStatus(result.response.status, options.retryRateLimit === true))
          throw new RetryableClawHubResponse(result);
        return result;
      },
      {
        attempts: CLAWHUB_RETRY_DELAYS_MS.length + 1,
        minDelayMs: 0,
        maxDelayMs: CLAWHUB_MAX_RETRY_AFTER_MS,
        delayMs: ({ attempt }) => CLAWHUB_RETRY_DELAYS_MS[attempt - 1] ?? 0,
        retryAfterMs: (error) =>
          error instanceof RetryableClawHubResponse
            ? parseRetryAfterMs(error.result.response.headers)
            : void 0,
        onRetry: async ({ err }) => {
          if (err instanceof RetryableClawHubResponse) await options.disposeRetry(err.result);
        },
        sleep: options.sleep ?? defaultSleep,
      },
    );
  } catch (error) {
    if (error instanceof RetryableClawHubResponse) return error.result;
    throw error;
  }
}
//#endregion
//#region src/infra/clawhub.ts
const DEFAULT_CLAWHUB_URL = "https://clawhub.ai";
const DEFAULT_GITHUB_CODELOAD_URL = "https://codeload.github.com";
const DEFAULT_FETCH_TIMEOUT_MS = 3e4;
const SKILL_CARD_MAX_BYTES = 256 * 1024;
const CLAWHUB_ARCHIVE_MAX_BYTES = 256 * 1024 * 1024;
const CLAWHUB_JSON_MAX_BYTES = 16 * 1024 * 1024;
const CLAWHUB_ERROR_BODY_MAX_BYTES = 8 * 1024;
const CLAWHUB_ERROR_BODY_MAX_CHARS = 400;
function resolveClawHubRequestTimeoutMs(timeoutMs) {
  return resolveTimerTimeoutMs(timeoutMs, DEFAULT_FETCH_TIMEOUT_MS);
}
var ClawHubRequestError = class extends Error {
  constructor(params) {
    super(`ClawHub ${params.path} failed (${params.status}): ${params.body}`);
    this.name = "ClawHubRequestError";
    this.status = params.status;
    this.requestPath = params.path;
    this.responseBody = params.body;
  }
};
function normalizeBaseUrl(baseUrl) {
  const envValue =
    normalizeOptionalString(process.env.OPENCLAW_CLAWHUB_URL) ||
    normalizeOptionalString(process.env.CLAWHUB_URL) ||
    DEFAULT_CLAWHUB_URL;
  return (normalizeOptionalString(baseUrl) || envValue).replace(/\/+$/, "") || DEFAULT_CLAWHUB_URL;
}
function normalizeGitHubCodeloadBaseUrl() {
  return (
    (
      normalizeOptionalString(process.env.CLAWHUB_GITHUB_CODELOAD_BASE_URL) ||
      DEFAULT_GITHUB_CODELOAD_URL
    ).replace(/\/+$/, "") || DEFAULT_GITHUB_CODELOAD_URL
  );
}
function extractTokenFromClawHubConfig(value) {
  if (!value || typeof value !== "object") return;
  const record = value;
  return (
    normalizeOptionalString(record.accessToken) ??
    normalizeOptionalString(record.authToken) ??
    normalizeOptionalString(record.apiToken) ??
    normalizeOptionalString(record.token) ??
    extractTokenFromClawHubConfig(record.auth) ??
    extractTokenFromClawHubConfig(record.session) ??
    extractTokenFromClawHubConfig(record.credentials) ??
    extractTokenFromClawHubConfig(record.user)
  );
}
function resolveClawHubConfigPaths() {
  const explicit =
    normalizeOptionalString(process.env.CLAWHUB_CONFIG_PATH) ||
    normalizeOptionalString(process.env.CLAWDHUB_CONFIG_PATH);
  if (explicit) return [explicit];
  const xdgConfigHome = normalizeOptionalString(process.env.XDG_CONFIG_HOME);
  const configHome =
    xdgConfigHome && xdgConfigHome.length > 0 ? xdgConfigHome : path.join(os.homedir(), ".config");
  const xdgPath = path.join(configHome, "clawhub", "config.json");
  if (process.platform === "darwin")
    return [
      path.join(os.homedir(), "Library", "Application Support", "clawhub", "config.json"),
      xdgPath,
    ];
  return [xdgPath];
}
async function resolveClawHubAuthToken() {
  const envToken =
    normalizeOptionalString(process.env.CLAWHUB_TOKEN) ||
    normalizeOptionalString(process.env.CLAWHUB_AUTH_TOKEN);
  if (envToken) return envToken;
  for (const configPath of resolveClawHubConfigPaths())
    try {
      const raw = await fs.readFile(configPath, "utf8");
      const token = extractTokenFromClawHubConfig(JSON.parse(raw));
      if (token) return token;
    } catch {}
}
function normalizePartialComparableVersion(version) {
  const trimmed = version.trim();
  return /^[vV]?[0-9]+\.[0-9]+$/.test(trimmed)
    ? {
        version: `${trimmed}.0`,
        isPartial: true,
      }
    : {
        version: trimmed,
        isPartial: false,
      };
}
function shouldPreservePluginApiPrereleaseFloor(target) {
  return Boolean(prerelease(normalizePartialComparableVersion(target).version));
}
function normalizePluginApiVersionForComparator(version, target) {
  const normalizedCorrection = normalizeOpenClawNumericCorrectionForPluginApi(version);
  if (normalizedCorrection) return normalizedCorrection;
  return shouldPreservePluginApiPrereleaseFloor(target)
    ? version
    : normalizeOpenClawReleaseSuffixForPluginApi(version);
}
function satisfiesComparator(version, token) {
  const trimmed = token.trim();
  if (!trimmed) return true;
  const match = /^(>=|<=|>|<|=|\^|~)?\s*(.+)$/.exec(trimmed);
  if (!match) return false;
  const operator = match[1] ?? "";
  const target = match[2]?.trim();
  if (!target || /^[<>=^~]/.test(target)) return false;
  const comparableVersion = normalizePluginApiVersionForComparator(version, target);
  const normalizedTarget = normalizePartialComparableVersion(target);
  return satisfies(
    comparableVersion,
    normalizedTarget.isPartial && !operator
      ? `>=${normalizedTarget.version}`
      : `${operator}${normalizedTarget.version}`,
    { includePrerelease: true },
  );
}
function satisfiesSemverRange(version, range) {
  if (range.includes("||")) return false;
  const tokens = normalizeStringEntries(range.trim().split(/\s+/));
  if (tokens.length === 0) return false;
  return tokens.every((token) => satisfiesComparator(version, token));
}
const OPENCLAW_RELEASE_SUFFIX_PATTERN =
  /^[vV]?(\d{4}\.[1-9]\d?\.[1-9]\d*)(?:-\d+|-(?:alpha|beta|rc)\.\d+)$/i;
const OPENCLAW_NUMERIC_CORRECTION_PATTERN = /^[vV]?(\d{4}\.[1-9]\d?\.[1-9]\d*)-\d+$/;
function normalizeOpenClawNumericCorrectionForPluginApi(pluginApiVersion) {
  return OPENCLAW_NUMERIC_CORRECTION_PATTERN.exec(pluginApiVersion.trim())?.[1];
}
function normalizeOpenClawReleaseSuffixForPluginApi(pluginApiVersion) {
  return OPENCLAW_RELEASE_SUFFIX_PATTERN.exec(pluginApiVersion.trim())?.[1] ?? pluginApiVersion;
}
function buildUrl(params) {
  if (params.url) {
    const url = new URL(params.url, `${normalizeBaseUrl(params.baseUrl)}/`);
    for (const [key, value] of Object.entries(params.search ?? {})) {
      if (!value) continue;
      url.searchParams.set(key, value);
    }
    return url;
  }
  if (!params.path) throw new Error("ClawHub request path is required");
  const url = new URL(`${normalizeBaseUrl(params.baseUrl)}/`);
  url.pathname = `${url.pathname.replace(/\/+$/, "")}${params.path.startsWith("/") ? params.path : `/${params.path}`}`;
  for (const [key, value] of Object.entries(params.search ?? {})) {
    if (!value) continue;
    url.searchParams.set(key, value);
  }
  return url;
}
async function clawhubRequest(params) {
  const url = buildUrl(params);
  const token = params.skipAuth
    ? void 0
    : normalizeOptionalString(params.token) || (await resolveClawHubAuthToken());
  const timeoutMs = resolveClawHubRequestTimeoutMs(params.timeoutMs);
  const request = async () => {
    const controller = new AbortController();
    const timeout = setTimeout(
      () =>
        controller.abort(
          /* @__PURE__ */ new Error(`ClawHub request timed out after ${timeoutMs}ms`),
        ),
      timeoutMs,
    );
    const headers = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(params.json === void 0 ? {} : { "Content-Type": "application/json" }),
      ...params.headers,
    };
    const init = { signal: controller.signal };
    if (params.method) init.method = params.method;
    if (Object.keys(headers).length > 0) init.headers = headers;
    if (params.json !== void 0) init.body = JSON.stringify(params.json);
    try {
      return {
        response: await (params.fetchImpl ?? fetch)(url, init),
        url,
        hasToken: Boolean(token),
      };
    } finally {
      clearTimeout(timeout);
    }
  };
  if ((params.method ?? "GET") !== "GET" || params.retryTransientReads === false)
    return await request();
  return await retryClawHubRead(request, {
    disposeRetry: async ({ response }) => {
      await response.body?.cancel().catch(() => void 0);
    },
  });
}
async function readErrorBody(response, timeoutMs) {
  try {
    return (
      (await readResponseTextSnippet(response, {
        maxBytes: CLAWHUB_ERROR_BODY_MAX_BYTES,
        maxChars: CLAWHUB_ERROR_BODY_MAX_CHARS,
        chunkTimeoutMs: resolveClawHubRequestTimeoutMs(timeoutMs),
      })) ||
      response.statusText ||
      `HTTP ${response.status}`
    );
  } catch {
    return response.statusText || `HTTP ${response.status}`;
  }
}
async function buildClawHubError(response, url, hasToken, timeoutMs) {
  let body = await readErrorBody(response, timeoutMs);
  if (response.status === 429) {
    const suffix = formatRateLimitSuffix(response.headers, hasToken);
    if (suffix) body = `${body} ${suffix}`;
  }
  return new ClawHubRequestError({
    path: url.pathname,
    status: response.status,
    body,
  });
}
function formatRateLimitSuffix(headers, hasToken) {
  const reset =
    normalizeHeaderValue(headers.get("RateLimit-Reset")) ??
    normalizeHeaderValue(headers.get("Retry-After"));
  const segments = [];
  if (reset && Number.isFinite(Number(reset))) segments.push(`(resets in ${reset}s)`);
  if (!hasToken) segments.push("Sign in for higher rate limits.");
  return segments.join(" ");
}
async function fetchJson(params) {
  const { response, url, hasToken } = await clawhubRequest(params);
  if (!response.ok) throw await buildClawHubError(response, url, hasToken, params.timeoutMs);
  return parseClawHubJsonBody(response, url, params.timeoutMs);
}
async function parseClawHubJsonBody(response, url, timeoutMs) {
  const buffer = await readResponseWithLimit(response, CLAWHUB_JSON_MAX_BYTES, {
    chunkTimeoutMs: resolveClawHubRequestTimeoutMs(timeoutMs),
    onOverflow: ({ size, maxBytes }) =>
      /* @__PURE__ */ new Error(
        `ClawHub ${url.pathname} response exceeded ${maxBytes} bytes (${size} bytes received)`,
      ),
    onIdleTimeout: ({ chunkTimeoutMs }) =>
      /* @__PURE__ */ new Error(
        `ClawHub ${url.pathname} response stalled after ${chunkTimeoutMs}ms`,
      ),
  });
  try {
    return JSON.parse(new TextDecoder().decode(buffer));
  } catch (cause) {
    throw new Error(`ClawHub ${url.pathname} returned malformed JSON`, { cause });
  }
}
async function readClawHubResponseBytes(params) {
  const timeoutMs = resolveClawHubRequestTimeoutMs(params.timeoutMs);
  const maxBytes = params.maxBytes ?? CLAWHUB_ARCHIVE_MAX_BYTES;
  const contentEncoding = normalizeOptionalString(params.response.headers.get("content-encoding"));
  const declaredSize =
    !contentEncoding || contentEncoding.toLowerCase() === "identity"
      ? parseStrictNonNegativeInteger(params.response.headers.get("content-length"))
      : void 0;
  if (declaredSize !== void 0 && declaredSize > maxBytes) {
    await params.response.body?.cancel().catch(() => void 0);
    throw createClawHubBodyLimitError(params.resourceLabel, declaredSize, maxBytes, "declared");
  }
  return await readResponseWithLimit(params.response, maxBytes, {
    chunkTimeoutMs: timeoutMs,
    onOverflow: ({ size, maxBytes: limitBytes }) =>
      createClawHubBodyLimitError(params.resourceLabel, size, limitBytes),
    onIdleTimeout: ({ chunkTimeoutMs }) =>
      /* @__PURE__ */ new Error(
        `ClawHub ${params.resourceLabel} body stalled after ${chunkTimeoutMs}ms`,
      ),
  });
}
function createClawHubBodyLimitError(resourceLabel, size, maxBytes, measurement = "received") {
  return /* @__PURE__ */ new Error(
    `ClawHub ${resourceLabel} exceeded ${maxBytes} bytes (${size} bytes ${measurement})`,
  );
}
function isJsonObject(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
function optionalStringField(source, field, context) {
  const value = source[field];
  if (value === void 0 || value === null || typeof value === "string") return value;
  throw new Error(`Malformed ClawHub ${context}: expected ${field} to be a string or null.`);
}
function requiredBooleanField(source, field, context) {
  const value = source[field];
  if (typeof value === "boolean") return value;
  throw new Error(`Malformed ClawHub ${context}: expected ${field} to be a boolean.`);
}
function requiredStringArrayField(source, field, context) {
  const value = source[field];
  if (Array.isArray(value) && value.every((entry) => typeof entry === "string")) return value;
  throw new Error(`Malformed ClawHub ${context}: expected ${field} to be a string array.`);
}
function requiredStringField(source, field, context) {
  const value = source[field];
  if (typeof value === "string" && value.length > 0) return value;
  throw new Error(`Malformed ClawHub ${context}: expected ${field} to be a non-empty string.`);
}
function requiredNumberField(source, field, context) {
  const value = source[field];
  if (typeof value === "number" && Number.isFinite(value)) return value;
  throw new Error(`Malformed ClawHub ${context}: expected ${field} to be a number.`);
}
function optionalBooleanField(source, field, context) {
  const value = source[field];
  if (value === void 0 || typeof value === "boolean") return value;
  throw new Error(`Malformed ClawHub ${context}: expected ${field} to be a boolean.`);
}
function optionalStringArrayField(source, field, context) {
  const value = source[field];
  if (value === void 0) return;
  if (Array.isArray(value) && value.every((entry) => typeof entry === "string")) return value;
  throw new Error(`Malformed ClawHub ${context}: expected ${field} to be a string array.`);
}
function parseOptionalSecurityPackage(value) {
  if (value === void 0 || value === null) return value;
  if (!isJsonObject(value))
    throw new Error(
      "Malformed ClawHub security response: expected package to be an object or null.",
    );
  const result = {};
  const name = optionalStringField(value, "name", "security package");
  const displayName = optionalStringField(value, "displayName", "security package");
  const family = optionalStringField(value, "family", "security package");
  if (name !== void 0) result.name = name;
  if (displayName !== void 0) result.displayName = displayName;
  if (family !== void 0) result.family = family;
  return result;
}
function parseOptionalSecurityRelease(value) {
  if (value === void 0 || value === null) return value;
  if (!isJsonObject(value))
    throw new Error(
      "Malformed ClawHub security response: expected release to be an object or null.",
    );
  const result = {};
  const releaseId = optionalStringField(value, "releaseId", "security release");
  const legacyId = optionalStringField(value, "id", "security release");
  const version = optionalStringField(value, "version", "security release");
  const id = releaseId ?? legacyId;
  if (id !== void 0) result.id = id;
  if (version !== void 0) result.version = version;
  return result;
}
function parseClawHubPackageSecurityResponse(value) {
  if (!isJsonObject(value))
    throw new Error("Malformed ClawHub security response: expected an object.");
  const trust = value.trust;
  if (!isJsonObject(trust))
    throw new Error("Malformed ClawHub security response: expected trust to be an object.");
  const parsedTrust = {
    blockedFromDownload: requiredBooleanField(trust, "blockedFromDownload", "security trust"),
    reasons: requiredStringArrayField(trust, "reasons", "security trust"),
    pending: requiredBooleanField(trust, "pending", "security trust"),
    stale: requiredBooleanField(trust, "stale", "security trust"),
  };
  const scanStatus = optionalStringField(trust, "scanStatus", "security trust");
  const moderationState = optionalStringField(trust, "moderationState", "security trust");
  if (scanStatus !== void 0) parsedTrust.scanStatus = scanStatus;
  if (moderationState !== void 0) parsedTrust.moderationState = moderationState;
  const result = { trust: parsedTrust };
  const parsedPackage = parseOptionalSecurityPackage(value.package);
  const parsedRelease = parseOptionalSecurityRelease(value.release);
  if (parsedPackage !== void 0) result.package = parsedPackage;
  if (parsedRelease !== void 0) result.release = parsedRelease;
  return result;
}
/** Resolves the configured ClawHub base URL, falling back to the default public host. */
function resolveClawHubBaseUrl(baseUrl) {
  return normalizeBaseUrl(baseUrl);
}
function isDefaultClawHubBaseUrl(baseUrl) {
  return normalizeBaseUrl(baseUrl) === normalizeBaseUrl(DEFAULT_CLAWHUB_URL);
}
function buildVersionOrTagSearch(params) {
  const version = normalizeOptionalString(params.version);
  const ownerHandle = normalizeOptionalString(params.ownerHandle);
  if (version)
    return {
      version,
      ...(ownerHandle ? { ownerHandle } : {}),
    };
  const tag = normalizeOptionalString(params.tag);
  if (tag)
    return {
      tag,
      ...(ownerHandle ? { ownerHandle } : {}),
    };
  return ownerHandle ? { ownerHandle } : void 0;
}
function buildGitHubZipUrl(repo, commit) {
  const url = new URL(`${normalizeGitHubCodeloadBaseUrl()}/`);
  url.pathname = `${url.pathname.replace(/\/+$/, "")}/${repo
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/")}/zip/${encodeURIComponent(commit)}`;
  return url.toString();
}
function formatSha256Integrity(bytes) {
  return `sha256-${sha256Base64(bytes)}`;
}
function formatSha256Hex(bytes) {
  return sha256Hex(bytes);
}
function formatSha512Integrity(bytes) {
  return `sha512-${createHash("sha512").update(bytes).digest("base64")}`;
}
function formatSha1Hex(bytes) {
  return createHash("sha1").update(bytes).digest("hex");
}
function normalizeHeaderValue(value) {
  const normalized = normalizeOptionalString(value);
  return normalized && normalized.length > 0 ? normalized : void 0;
}
function safePackageTarballName(name, version) {
  return `${
    name
      .replace(/^@/, "")
      .replace(/[\\/]+/g, "-")
      .replace(/[^A-Za-z0-9._-]/g, "-") || "package"
  }-${version}.tgz`;
}
/** Normalizes ClawHub SHA-256 metadata into Subresource Integrity format. */
function normalizeClawHubSha256Integrity(value) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const prefixedBase64 = /^sha256-([A-Za-z0-9+/]+={0,1})$/.exec(trimmed);
  if (prefixedBase64?.[1]) {
    try {
      const decoded = Buffer.from(prefixedBase64[1], "base64");
      if (decoded.length === 32) return `sha256-${decoded.toString("base64")}`;
    } catch {
      return null;
    }
    return null;
  }
  const prefixedHex = /^sha256:([A-Fa-f0-9]{64})$/.exec(trimmed);
  if (prefixedHex?.[1]) return `sha256-${Buffer.from(prefixedHex[1], "hex").toString("base64")}`;
  if (/^[A-Fa-f0-9]{64}$/.test(trimmed))
    return `sha256-${Buffer.from(trimmed, "hex").toString("base64")}`;
  return null;
}
/** Normalizes ClawHub SHA-256 metadata into lowercase hex form. */
function normalizeClawHubSha256Hex(value) {
  const trimmed = value.trim();
  if (!/^[A-Fa-f0-9]{64}$/.test(trimmed)) return null;
  return normalizeLowercaseStringOrEmpty(trimmed);
}
async function fetchClawHubPackageDetail(params) {
  return await fetchJson({
    baseUrl: params.baseUrl,
    path: `/api/v1/packages/${encodeURIComponent(params.name)}`,
    token: params.token,
    timeoutMs: params.timeoutMs,
    fetchImpl: params.fetchImpl,
  });
}
async function fetchClawHubPackageVersion(params) {
  return await fetchJson({
    baseUrl: params.baseUrl,
    path: `/api/v1/packages/${encodeURIComponent(params.name)}/versions/${encodeURIComponent(params.version)}`,
    token: params.token,
    timeoutMs: params.timeoutMs,
    fetchImpl: params.fetchImpl,
  });
}
async function fetchClawHubPackageArtifact(params) {
  return await fetchJson({
    baseUrl: params.baseUrl,
    path: `/api/v1/packages/${encodeURIComponent(params.name)}/versions/${encodeURIComponent(params.version)}/artifact`,
    token: params.token,
    timeoutMs: params.timeoutMs,
    fetchImpl: params.fetchImpl,
  });
}
async function fetchClawHubPackageSecurity(params) {
  return parseClawHubPackageSecurityResponse(
    await fetchJson({
      baseUrl: params.baseUrl,
      path: `/api/v1/packages/${encodeURIComponent(params.name)}/versions/${encodeURIComponent(params.version)}/security`,
      token: params.token,
      timeoutMs: params.timeoutMs,
      fetchImpl: params.fetchImpl,
    }),
  );
}
async function searchClawHubPackages(params) {
  return (
    (
      await fetchJson({
        baseUrl: params.baseUrl,
        path: "/api/v1/packages/search",
        token: params.token,
        timeoutMs: params.timeoutMs,
        fetchImpl: params.fetchImpl,
        search: {
          q: params.query.trim(),
          family: params.family,
          limit: params.limit ? String(params.limit) : void 0,
        },
      })
    ).results ?? []
  );
}
async function searchClawHubSkills(params) {
  return (
    (
      await fetchJson({
        baseUrl: params.baseUrl,
        path: "/api/v1/search",
        token: params.token,
        timeoutMs: params.timeoutMs,
        fetchImpl: params.fetchImpl,
        search: {
          q: params.query.trim(),
          limit: params.limit ? String(params.limit) : void 0,
        },
      })
    ).results ?? []
  );
}
async function fetchClawHubSkillDetail(params) {
  return await fetchJson({
    baseUrl: params.baseUrl,
    path: `/api/v1/skills/${encodeURIComponent(params.slug)}`,
    token: params.token,
    timeoutMs: params.timeoutMs,
    fetchImpl: params.fetchImpl,
    search: params.ownerHandle ? { ownerHandle: params.ownerHandle } : void 0,
  });
}
async function fetchClawHubSkillInstallResolution(params) {
  const { response, url, hasToken } = await clawhubRequest({
    baseUrl: params.baseUrl,
    path: `/api/v1/skills/${encodeURIComponent(params.slug)}/install`,
    token: params.token,
    timeoutMs: params.timeoutMs,
    fetchImpl: params.fetchImpl,
    search: {
      ownerHandle: params.ownerHandle,
      forceInstall: params.forceInstall ? "1" : void 0,
    },
  });
  const isStructuredBlock = [403, 409, 410, 423].includes(response.status);
  if (!response.ok && !isStructuredBlock)
    throw await buildClawHubError(response, url, hasToken, params.timeoutMs);
  return parseClawHubJsonBody(response, url, params.timeoutMs);
}
async function fetchClawHubSkillVerification(params) {
  return await fetchJson({
    baseUrl: params.baseUrl,
    path: `/api/v1/skills/${encodeURIComponent(params.slug)}/verify`,
    token: params.token,
    timeoutMs: params.timeoutMs,
    fetchImpl: params.fetchImpl,
    search: buildVersionOrTagSearch(params),
  });
}
async function fetchClawHubSkillSecurityVerdicts(params) {
  return await fetchJson({
    baseUrl: params.baseUrl,
    path: "/api/v1/skills/-/security-verdicts",
    method: "POST",
    json: { items: params.items },
    token: params.token,
    skipAuth: params.skipAuth,
    timeoutMs: params.timeoutMs,
    fetchImpl: params.fetchImpl,
  });
}
async function fetchClawHubSkillCard(params) {
  const cardUrl = normalizeOptionalString(params.url);
  const slug = normalizeOptionalString(params.slug);
  if (!cardUrl && !slug) throw new Error("ClawHub skill card fetch requires a slug or card URL");
  const explicitToken = normalizeOptionalString(params.token);
  const skipAuth =
    cardUrl != null &&
    explicitToken == null &&
    new URL(cardUrl, `${normalizeBaseUrl(params.baseUrl)}/`).origin !==
      new URL(`${normalizeBaseUrl(params.baseUrl)}/`).origin;
  const { response, url, hasToken } = await clawhubRequest({
    baseUrl: params.baseUrl,
    url: cardUrl,
    path: slug ? `/api/v1/skills/${encodeURIComponent(slug)}/card` : void 0,
    token: explicitToken,
    timeoutMs: params.timeoutMs,
    fetchImpl: params.fetchImpl,
    search: cardUrl ? void 0 : buildVersionOrTagSearch(params),
    skipAuth,
  });
  if (!response.ok) throw await buildClawHubError(response, url, hasToken, params.timeoutMs);
  const bytes = await readClawHubResponseBytes({
    response,
    maxBytes: SKILL_CARD_MAX_BYTES,
    timeoutMs: params.timeoutMs,
    resourceLabel: slug ? `skill card for ${slug}` : `skill card at ${url.pathname}`,
  });
  return new TextDecoder().decode(bytes);
}
async function downloadClawHubPackageArchive(params) {
  if (params.artifact === "clawpack") {
    if (!params.version) throw new Error("ClawPack package downloads require an explicit version.");
    const { response, url, hasToken } = await clawhubRequest({
      baseUrl: params.baseUrl,
      path: `/api/v1/packages/${encodeURIComponent(params.name)}/versions/${encodeURIComponent(params.version)}/artifact/download`,
      token: params.token,
      timeoutMs: params.timeoutMs,
      fetchImpl: params.fetchImpl,
    });
    if (!response.ok) throw await buildClawHubError(response, url, hasToken, params.timeoutMs);
    const bytes = await readClawHubResponseBytes({
      response,
      timeoutMs: params.timeoutMs,
      resourceLabel: `ClawPack download for ${params.name}@${params.version}`,
    });
    const sha256Hex = formatSha256Hex(bytes);
    const npmIntegrity = formatSha512Integrity(bytes);
    const npmShasum = formatSha1Hex(bytes);
    const headerSha256 = normalizeClawHubSha256Hex(
      response.headers.get("X-ClawHub-Artifact-Sha256") ??
        response.headers.get("X-ClawHub-ClawPack-Sha256") ??
        "",
    );
    if (!headerSha256)
      throw new Error(
        `ClawHub ClawPack download for "${params.name}@${params.version}" is missing X-ClawHub-Artifact-Sha256.`,
      );
    if (headerSha256 !== sha256Hex)
      throw new Error(
        `ClawHub ClawPack download for "${params.name}@${params.version}" declared sha256 ${headerSha256}, got ${sha256Hex}.`,
      );
    const headerNpmIntegrity = normalizeHeaderValue(
      response.headers.get("X-ClawHub-Npm-Integrity"),
    );
    if (headerNpmIntegrity && headerNpmIntegrity !== npmIntegrity)
      throw new Error(
        `ClawHub ClawPack download for "${params.name}@${params.version}" declared npm integrity ${headerNpmIntegrity}, got ${npmIntegrity}.`,
      );
    const headerNpmShasum = normalizeHeaderValue(response.headers.get("X-ClawHub-Npm-Shasum"));
    if (headerNpmShasum && headerNpmShasum !== npmShasum)
      throw new Error(
        `ClawHub ClawPack download for "${params.name}@${params.version}" declared npm shasum ${headerNpmShasum}, got ${npmShasum}.`,
      );
    const npmTarballName =
      normalizeHeaderValue(response.headers.get("X-ClawHub-Npm-Tarball-Name")) ??
      safePackageTarballName(params.name, params.version);
    const specVersion = parseStrictPositiveInteger(
      response.headers.get("X-ClawHub-ClawPack-Spec-Version"),
    );
    const target = await createTempDownloadTarget({
      prefix: "openclaw-clawhub-clawpack",
      fileName: npmTarballName,
    });
    await fs.writeFile(target.path, bytes);
    return {
      archivePath: target.path,
      integrity: normalizeClawHubSha256Integrity(sha256Hex) ?? formatSha256Integrity(bytes),
      sha256Hex,
      artifact: "clawpack",
      clawpackHeaderSha256: headerSha256,
      ...(typeof specVersion === "number" && Number.isSafeInteger(specVersion) && specVersion >= 0
        ? { clawpackHeaderSpecVersion: specVersion }
        : {}),
      npmIntegrity,
      npmShasum,
      npmTarballName,
      cleanup: target.cleanup,
    };
  }
  const search = params.version
    ? { version: params.version }
    : params.tag
      ? { tag: params.tag }
      : void 0;
  const { response, url, hasToken } = await clawhubRequest({
    baseUrl: params.baseUrl,
    path: `/api/v1/packages/${encodeURIComponent(params.name)}/download`,
    search,
    token: params.token,
    timeoutMs: params.timeoutMs,
    fetchImpl: params.fetchImpl,
  });
  if (!response.ok) throw await buildClawHubError(response, url, hasToken, params.timeoutMs);
  const bytes = await readClawHubResponseBytes({
    response,
    timeoutMs: params.timeoutMs,
    resourceLabel: `package archive download for ${params.name}`,
  });
  const sha256Hex = formatSha256Hex(bytes);
  const target = await createTempDownloadTarget({
    prefix: "openclaw-clawhub-package",
    fileName: `${params.name}.zip`,
  });
  await fs.writeFile(target.path, bytes);
  return {
    archivePath: target.path,
    integrity: formatSha256Integrity(bytes),
    sha256Hex,
    artifact: "archive",
    cleanup: target.cleanup,
  };
}
async function downloadClawHubSkillArchive(params) {
  const { response, url, hasToken } = await clawhubRequest({
    baseUrl: params.baseUrl,
    path: "/api/v1/download",
    token: params.token,
    timeoutMs: params.timeoutMs,
    fetchImpl: params.fetchImpl,
    search: {
      slug: params.slug,
      ownerHandle: params.ownerHandle,
      version: params.version,
      tag: params.version ? void 0 : params.tag,
    },
  });
  if (!response.ok) throw await buildClawHubError(response, url, hasToken, params.timeoutMs);
  const bytes = await readClawHubResponseBytes({
    response,
    timeoutMs: params.timeoutMs,
    resourceLabel: `skill archive download for ${params.slug}`,
  });
  const sha256Hex = formatSha256Hex(bytes);
  const target = await createTempDownloadTarget({
    prefix: "openclaw-clawhub-skill",
    fileName: `${params.slug}.zip`,
  });
  await fs.writeFile(target.path, bytes);
  return {
    archivePath: target.path,
    integrity: formatSha256Integrity(bytes),
    sha256Hex,
    artifact: "archive",
    cleanup: target.cleanup,
  };
}
async function downloadClawHubSkillArchiveUrl(params) {
  const explicitToken = normalizeOptionalString(params.token);
  const requestUrl = new URL(params.url, `${normalizeBaseUrl(params.baseUrl)}/`);
  const registryOrigin = new URL(`${normalizeBaseUrl(params.baseUrl)}/`).origin;
  const skipAuth = explicitToken == null && requestUrl.origin !== registryOrigin;
  const { response, url, hasToken } = await clawhubRequest({
    baseUrl: params.baseUrl,
    url: params.url,
    token: explicitToken,
    timeoutMs: params.timeoutMs,
    fetchImpl: params.fetchImpl,
    skipAuth,
  });
  if (!response.ok) throw await buildClawHubError(response, url, hasToken, params.timeoutMs);
  const bytes = await readClawHubResponseBytes({
    response,
    timeoutMs: params.timeoutMs,
    resourceLabel: `skill archive download at ${url.pathname}`,
  });
  const sha256Hex = formatSha256Hex(bytes);
  const target = await createTempDownloadTarget({
    prefix: "openclaw-clawhub-skill",
    fileName: "skill.zip",
  });
  await fs.writeFile(target.path, bytes);
  return {
    archivePath: target.path,
    integrity: formatSha256Integrity(bytes),
    sha256Hex,
    artifact: "archive",
    cleanup: target.cleanup,
  };
}
async function downloadClawHubGitHubSkillArchive(params) {
  const { response, url, hasToken } = await clawhubRequest({
    url: buildGitHubZipUrl(params.repo, params.commit),
    skipAuth: true,
    timeoutMs: params.timeoutMs,
    fetchImpl: params.fetchImpl,
  });
  if (!response.ok) throw await buildClawHubError(response, url, hasToken, params.timeoutMs);
  const bytes = await readClawHubResponseBytes({
    response,
    timeoutMs: params.timeoutMs,
    resourceLabel: `GitHub source archive for ${params.repo}@${params.commit}`,
  });
  const sha256Hex = formatSha256Hex(bytes);
  const target = await createTempDownloadTarget({
    prefix: "openclaw-clawhub-github-skill",
    fileName: `${params.commit}.zip`,
  });
  await fs.writeFile(target.path, bytes);
  return {
    archivePath: target.path,
    integrity: formatSha256Integrity(bytes),
    sha256Hex,
    artifact: "archive",
    cleanup: target.cleanup,
  };
}
async function reportClawHubSkillInstallTelemetry(params) {
  const token = normalizeOptionalString(params.token) ?? (await resolveClawHubAuthToken());
  if (!token || isClawHubTelemetryDisabled()) return;
  const slug = params.slug.trim();
  if (!slug) return;
  const { response, url, hasToken } = await clawhubRequest({
    baseUrl: params.baseUrl,
    path: "/api/cli/telemetry/install",
    method: "POST",
    token,
    timeoutMs: params.timeoutMs,
    fetchImpl: params.fetchImpl,
    json: {
      event: "install",
      slug,
      ...(params.ownerHandle ? { ownerHandle: params.ownerHandle } : {}),
      version: params.version ?? void 0,
    },
  });
  if (!response.ok) throw await buildClawHubError(response, url, hasToken, params.timeoutMs);
}
function isClawHubTelemetryDisabled() {
  const raw = process.env.CLAWHUB_DISABLE_TELEMETRY ?? process.env.CLAWDHUB_DISABLE_TELEMETRY;
  if (!raw) return false;
  return ["1", "true", "yes", "on"].includes(raw.trim().toLowerCase());
}
/** Resolves the preferred latest package version from detail metadata. */
function resolveLatestVersionFromPackage(detail) {
  return detail.package?.latestVersion ?? detail.package?.tags?.latest ?? null;
}
/** Checks whether a host plugin API version satisfies a ClawHub plugin API range. */
function satisfiesPluginApiRange(pluginApiVersion, pluginApiRange) {
  if (!pluginApiRange) return true;
  return satisfiesSemverRange(pluginApiVersion, pluginApiRange);
}
/** Checks whether the current gateway version satisfies a package minimum gateway version. */
function satisfiesGatewayMinimum(currentVersion, minGatewayVersion) {
  if (!minGatewayVersion) return true;
  const current = parseSemver(currentVersion);
  const minimum = parseSemver(minGatewayVersion);
  if (!current || !minimum) return false;
  return isAtLeast(current, minimum);
}
const CLAWHUB_PROMOTION_MODEL_REF_RE = /^[A-Za-z0-9][A-Za-z0-9._:/-]*$/;
function parseClawHubPromotionModel(value, context) {
  if (!isJsonObject(value))
    throw new Error(`Malformed ClawHub ${context}: expected each model to be an object.`);
  const modelRef = requiredStringField(value, "modelRef", context);
  if (!CLAWHUB_PROMOTION_MODEL_REF_RE.test(modelRef))
    throw new Error(`Malformed ClawHub ${context}: modelRef contains unsupported characters.`);
  const model = { modelRef };
  const alias = optionalStringField(value, "alias", context);
  if (alias) model.alias = alias;
  const suggestedDefault = optionalBooleanField(value, "suggestedDefault", context);
  if (suggestedDefault !== void 0) model.suggestedDefault = suggestedDefault;
  return model;
}
const CLAWHUB_PROMOTION_SLUG_RE = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
const CLAWHUB_PROMOTION_IDENTIFIER_RE = /^[A-Za-z0-9][A-Za-z0-9._@/-]*$/;
function parseClawHubPromotionCore(value, context) {
  const modelsRaw = value.models;
  if (!Array.isArray(modelsRaw) || modelsRaw.length === 0)
    throw new Error(`Malformed ClawHub ${context}: expected models to be a non-empty array.`);
  const slug = requiredStringField(value, "slug", context);
  if (!CLAWHUB_PROMOTION_SLUG_RE.test(slug))
    throw new Error(`Malformed ClawHub ${context}: slug must be lowercase [a-z0-9-].`);
  const startsAt = requiredNumberField(value, "startsAt", context);
  const endsAt = requiredNumberField(value, "endsAt", context);
  if (endsAt <= startsAt)
    throw new Error(`Malformed ClawHub ${context}: promotion window must end after it starts.`);
  const promotion = {
    slug,
    title: requiredStringField(value, "title", context),
    blurb: requiredStringField(value, "blurb", context),
    startsAt,
    endsAt,
    models: modelsRaw.map((entry) => parseClawHubPromotionModel(entry, context)),
  };
  for (const field of ["sponsor", "signupUrl", "docsUrl", "launchPageUrl"]) {
    const parsed = optionalStringField(value, field, context);
    if (parsed) promotion[field] = parsed;
  }
  for (const field of ["provider", "authChoiceId"]) {
    const parsed = optionalStringField(value, field, context);
    if (!parsed) continue;
    if (!CLAWHUB_PROMOTION_IDENTIFIER_RE.test(parsed))
      throw new Error(`Malformed ClawHub ${context}: ${field} contains unsupported characters.`);
    promotion[field] = parsed;
  }
  const pluginNames = optionalStringArrayField(value, "pluginNames", context);
  if (pluginNames && pluginNames.length > 0) {
    for (const name of pluginNames) {
      const parsed = parseRegistryNpmSpec(name);
      if (!parsed || parsed.selectorKind !== "none" || parsed.name !== name)
        throw new Error(
          `Malformed ClawHub ${context}: pluginNames must contain npm package names.`,
        );
    }
    promotion.pluginNames = pluginNames;
  }
  return promotion;
}
function parseClawHubPromotion(value) {
  const context = "promotion";
  if (!isJsonObject(value)) throw new Error(`Malformed ClawHub ${context}: expected an object.`);
  return {
    ...parseClawHubPromotionCore(value, context),
    status: requiredStringField(value, "status", context),
    active: requiredBooleanField(value, "active", context),
  };
}
async function fetchClawHubPromotions(params = {}) {
  const response = await fetchJson({
    baseUrl: params.baseUrl,
    path: "/api/v1/promotions",
    timeoutMs: params.timeoutMs,
    fetchImpl: params.fetchImpl,
  });
  if (!isJsonObject(response) || !Array.isArray(response.promotions))
    throw new Error("Malformed ClawHub promotions response: expected a promotions array.");
  return response.promotions.map((entry) => parseClawHubPromotion(entry));
}
async function fetchClawHubPromotion(params) {
  return parseClawHubPromotion(
    await fetchJson({
      baseUrl: params.baseUrl,
      path: `/api/v1/promotions/${encodeURIComponent(params.slug)}`,
      timeoutMs: params.timeoutMs,
      fetchImpl: params.fetchImpl,
    }),
  );
}
const CLAWHUB_PROMOTIONS_FEED_ID = "clawhub-promotions";
const CLAWHUB_PROMOTIONS_FEED_SCHEMA_VERSION = 1;
function parseClawHubPromotionsFeed(value) {
  const context = "promotions feed";
  if (!isJsonObject(value)) throw new Error(`Malformed ClawHub ${context}: expected an object.`);
  const id = requiredStringField(value, "id", context);
  if (id !== CLAWHUB_PROMOTIONS_FEED_ID)
    throw new Error(`Malformed ClawHub ${context}: unexpected feed id.`);
  const schemaVersion = requiredNumberField(value, "schemaVersion", context);
  if (schemaVersion !== CLAWHUB_PROMOTIONS_FEED_SCHEMA_VERSION)
    throw new Error(`Unsupported ClawHub ${context} schema version ${schemaVersion}.`);
  const sequence = requiredNumberField(value, "sequence", context);
  if (!Number.isSafeInteger(sequence) || sequence < 0)
    throw new Error(`Malformed ClawHub ${context}: sequence must be a non-negative integer.`);
  const generatedAt = requiredStringField(value, "generatedAt", context);
  const expiresAt = requiredStringField(value, "expiresAt", context);
  const generatedAtMs = Date.parse(generatedAt);
  const expiresAtMs = Date.parse(expiresAt);
  if (!Number.isFinite(generatedAtMs) || !Number.isFinite(expiresAtMs))
    throw new Error(`Malformed ClawHub ${context}: timestamps must be ISO dates.`);
  if (expiresAtMs <= generatedAtMs)
    throw new Error(`Malformed ClawHub ${context}: expiresAt must be after generatedAt.`);
  const entriesRaw = value.entries;
  if (!Array.isArray(entriesRaw))
    throw new Error(`Malformed ClawHub ${context}: expected an entries array.`);
  return {
    schemaVersion,
    id,
    generatedAt,
    sequence,
    expiresAt,
    entries: entriesRaw.map((entry) => {
      if (!isJsonObject(entry))
        throw new Error(`Malformed ClawHub ${context}: expected each entry to be an object.`);
      if (requiredStringField(entry, "type", context) !== "promotion")
        throw new Error(`Malformed ClawHub ${context}: unexpected entry type.`);
      return parseClawHubPromotionCore(entry, context);
    }),
  };
}
async function fetchClawHubPromotionsFeed(params = {}) {
  const { response, url } = await clawhubRequest({
    baseUrl: params.baseUrl,
    path: "/api/v1/feeds/promotions",
    timeoutMs: params.timeoutMs,
    fetchImpl: params.fetchImpl,
    retryTransientReads: false,
    skipAuth: true,
    ...(params.etag ? { headers: { "If-None-Match": params.etag } } : {}),
  });
  if (response.status === 304) return { status: "not-modified" };
  if (!response.ok) throw await buildClawHubError(response, url, false, params.timeoutMs);
  const buffer = await readClawHubResponseBytes({
    response,
    maxBytes: CLAWHUB_JSON_MAX_BYTES,
    timeoutMs: params.timeoutMs,
    resourceLabel: "promotions feed",
  });
  const payload = new TextDecoder().decode(buffer);
  let parsedJson;
  try {
    parsedJson = JSON.parse(payload);
  } catch (cause) {
    throw new Error(`ClawHub ${url.pathname} returned malformed JSON`, { cause });
  }
  const feed = parseClawHubPromotionsFeed(parsedJson);
  const etag = response.headers.get("etag") ?? void 0;
  return {
    status: "ok",
    feed,
    payload,
    ...(etag ? { etag } : {}),
  };
}
//#endregion
export {
  resolveClawHubBaseUrl as C,
  searchClawHubPackages as D,
  satisfiesPluginApiRange as E,
  searchClawHubSkills as O,
  reportClawHubSkillInstallTelemetry as S,
  satisfiesGatewayMinimum as T,
  fetchClawHubSkillVerification as _,
  downloadClawHubSkillArchiveUrl as a,
  normalizeClawHubSha256Integrity as b,
  fetchClawHubPackageSecurity as c,
  fetchClawHubPromotions as d,
  fetchClawHubPromotionsFeed as f,
  fetchClawHubSkillSecurityVerdicts as g,
  fetchClawHubSkillInstallResolution as h,
  downloadClawHubSkillArchive as i,
  fetchClawHubPackageVersion as l,
  fetchClawHubSkillDetail as m,
  downloadClawHubGitHubSkillArchive as n,
  fetchClawHubPackageArtifact as o,
  fetchClawHubSkillCard as p,
  downloadClawHubPackageArchive as r,
  fetchClawHubPackageDetail as s,
  ClawHubRequestError as t,
  fetchClawHubPromotion as u,
  isDefaultClawHubBaseUrl as v,
  resolveLatestVersionFromPackage as w,
  parseClawHubPromotionsFeed as x,
  normalizeClawHubSha256Hex as y,
};
