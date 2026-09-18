import fs from "node:fs";
import JSON5 from "json5";
import "./src-Bl7G9qvi.js";
import { n as getCommandPathWithRootOptions } from "./argv-zTv4_Dzq.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { c as resolveConfigPath } from "./paths-DEklnbzU.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { n as sliceUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region src/security/safe-regex.ts
const SAFE_REGEX_CACHE_MAX = 256;
const SAFE_REGEX_TEST_WINDOW = 2048;
const safeRegexCache = /* @__PURE__ */ new Map();
function createParseFrame() {
  return {
    lastToken: null,
    containsRepetition: false,
    hasAlternation: false,
    branchMinLength: 0,
    branchMaxLength: 0,
    altMinLength: null,
    altMaxLength: null,
  };
}
function addLength(left, right) {
  if (!Number.isFinite(left) || !Number.isFinite(right)) return Number.POSITIVE_INFINITY;
  return left + right;
}
function multiplyLength(length, factor) {
  if (!Number.isFinite(length)) return factor === 0 ? 0 : Number.POSITIVE_INFINITY;
  return length * factor;
}
function recordAlternative(frame) {
  if (frame.altMinLength === null || frame.altMaxLength === null) {
    frame.altMinLength = frame.branchMinLength;
    frame.altMaxLength = frame.branchMaxLength;
    return;
  }
  frame.altMinLength = Math.min(frame.altMinLength, frame.branchMinLength);
  frame.altMaxLength = Math.max(frame.altMaxLength, frame.branchMaxLength);
}
function readQuantifier(source, index) {
  const ch = source[index];
  const consumed = source[index + 1] === "?" ? 2 : 1;
  if (ch === "*")
    return {
      consumed,
      minRepeat: 0,
      maxRepeat: null,
    };
  if (ch === "+")
    return {
      consumed,
      minRepeat: 1,
      maxRepeat: null,
    };
  if (ch === "?")
    return {
      consumed,
      minRepeat: 0,
      maxRepeat: 1,
    };
  if (ch !== "{") return null;
  let i = index + 1;
  while (i < source.length && /\d/.test(source.charAt(i))) i += 1;
  if (i === index + 1) return null;
  const minRepeat = Number.parseInt(source.slice(index + 1, i), 10);
  let maxRepeat = minRepeat;
  if (source[i] === ",") {
    i += 1;
    const maxStart = i;
    while (i < source.length && /\d/.test(source.charAt(i))) i += 1;
    maxRepeat = i === maxStart ? null : Number.parseInt(source.slice(maxStart, i), 10);
  }
  if (source[i] !== "}") return null;
  i += 1;
  if (source[i] === "?") i += 1;
  if (maxRepeat !== null && maxRepeat < minRepeat) return null;
  return {
    consumed: i - index,
    minRepeat,
    maxRepeat,
  };
}
function tokenizePattern(source) {
  const tokens = [];
  let inCharClass = false;
  for (let i = 0; i < source.length; i += 1) {
    const ch = source[i];
    if (inCharClass) {
      if (ch === "\\") {
        i += 1;
        continue;
      }
      if (ch === "]") inCharClass = false;
      continue;
    }
    if (ch === "\\") {
      i += 1;
      tokens.push({ kind: "simple-token" });
      continue;
    }
    if (ch === "[") {
      inCharClass = true;
      tokens.push({ kind: "simple-token" });
      continue;
    }
    if (ch === "(") {
      tokens.push({ kind: "group-open" });
      continue;
    }
    if (ch === ")") {
      tokens.push({ kind: "group-close" });
      continue;
    }
    if (ch === "|") {
      tokens.push({ kind: "alternation" });
      continue;
    }
    const quantifier = readQuantifier(source, i);
    if (quantifier) {
      tokens.push({
        kind: "quantifier",
        quantifier,
      });
      i += quantifier.consumed - 1;
      continue;
    }
    tokens.push({ kind: "simple-token" });
  }
  return tokens;
}
function analyzeTokensForNestedRepetition(tokens) {
  const frames = [createParseFrame()];
  const emitToken = (token) => {
    const frame = expectDefined(frames[frames.length - 1], "frames entry at frames.length 1");
    frame.lastToken = token;
    if (token.containsRepetition) frame.containsRepetition = true;
    frame.branchMinLength = addLength(frame.branchMinLength, token.minLength);
    frame.branchMaxLength = addLength(frame.branchMaxLength, token.maxLength);
  };
  const emitSimpleToken = () => {
    emitToken({
      containsRepetition: false,
      hasAmbiguousAlternation: false,
      minLength: 1,
      maxLength: 1,
    });
  };
  for (const token of tokens) {
    if (token.kind === "simple-token") {
      emitSimpleToken();
      continue;
    }
    if (token.kind === "group-open") {
      frames.push(createParseFrame());
      continue;
    }
    if (token.kind === "group-close") {
      if (frames.length > 1) {
        const frame = frames.pop();
        if (frame.hasAlternation) recordAlternative(frame);
        const groupMinLength = frame.hasAlternation
          ? (frame.altMinLength ?? 0)
          : frame.branchMinLength;
        const groupMaxLength = frame.hasAlternation
          ? (frame.altMaxLength ?? 0)
          : frame.branchMaxLength;
        emitToken({
          containsRepetition: frame.containsRepetition,
          hasAmbiguousAlternation:
            frame.hasAlternation &&
            frame.altMinLength !== null &&
            frame.altMaxLength !== null &&
            frame.altMinLength !== frame.altMaxLength,
          minLength: groupMinLength,
          maxLength: groupMaxLength,
        });
      }
      continue;
    }
    if (token.kind === "alternation") {
      const frame = expectDefined(frames[frames.length - 1], "frames entry at frames.length 1");
      frame.hasAlternation = true;
      recordAlternative(frame);
      frame.branchMinLength = 0;
      frame.branchMaxLength = 0;
      frame.lastToken = null;
      continue;
    }
    const frame = expectDefined(frames[frames.length - 1], "frames entry at frames.length 1");
    const previousToken = frame.lastToken;
    if (!previousToken) continue;
    if (previousToken.containsRepetition) return true;
    if (previousToken.hasAmbiguousAlternation && token.quantifier.maxRepeat === null) return true;
    const previousMinLength = previousToken.minLength;
    const previousMaxLength = previousToken.maxLength;
    previousToken.minLength = multiplyLength(previousToken.minLength, token.quantifier.minRepeat);
    previousToken.maxLength =
      token.quantifier.maxRepeat === null
        ? Number.POSITIVE_INFINITY
        : multiplyLength(previousToken.maxLength, token.quantifier.maxRepeat);
    previousToken.containsRepetition = true;
    frame.containsRepetition = true;
    frame.branchMinLength = frame.branchMinLength - previousMinLength + previousToken.minLength;
    frame.branchMaxLength = addLength(
      Number.isFinite(frame.branchMaxLength) && Number.isFinite(previousMaxLength)
        ? frame.branchMaxLength - previousMaxLength
        : Number.POSITIVE_INFINITY,
      previousToken.maxLength,
    );
  }
  return false;
}
function testRegexFromStart(regex, value) {
  regex.lastIndex = 0;
  return regex.test(value);
}
function testRegexWithBoundedInput(regex, input, maxWindow = SAFE_REGEX_TEST_WINDOW) {
  if (maxWindow <= 0) return false;
  if (input.length <= maxWindow) return testRegexFromStart(regex, input);
  if (testRegexFromStart(regex, input.slice(0, maxWindow))) return true;
  return testRegexFromStart(regex, input.slice(-maxWindow));
}
function hasNestedRepetition(source) {
  return analyzeTokensForNestedRepetition(tokenizePattern(source));
}
function compileSafeRegexDetailed(source, flags = "") {
  const trimmed = source.trim();
  if (!trimmed)
    return {
      regex: null,
      source: trimmed,
      flags,
      reason: "empty",
    };
  const cacheKey = `${flags}::${trimmed}`;
  if (safeRegexCache.has(cacheKey))
    return (
      safeRegexCache.get(cacheKey) ?? {
        regex: null,
        source: trimmed,
        flags,
        reason: "invalid-regex",
      }
    );
  let result;
  if (hasNestedRepetition(trimmed))
    result = {
      regex: null,
      source: trimmed,
      flags,
      reason: "unsafe-nested-repetition",
    };
  else
    try {
      result = {
        regex: new RegExp(trimmed, flags),
        source: trimmed,
        flags,
        reason: null,
      };
    } catch {
      result = {
        regex: null,
        source: trimmed,
        flags,
        reason: "invalid-regex",
      };
    }
  safeRegexCache.set(cacheKey, result);
  if (safeRegexCache.size > SAFE_REGEX_CACHE_MAX) {
    const oldestKey = safeRegexCache.keys().next().value;
    if (oldestKey) safeRegexCache.delete(oldestKey);
  }
  return result;
}
function compileSafeRegex(source, flags = "") {
  return compileSafeRegexDetailed(source, flags).regex;
}
//#endregion
//#region src/security/config-regex.ts
function normalizeRejectReason(result) {
  if (result.reason === null || result.reason === "empty") return null;
  return result.reason;
}
/**
 * Compile a single user-configured regex with the shared safe-regex guardrails.
 * Returns null for blank patterns so optional config entries can be skipped silently.
 */
function compileConfigRegex(pattern, flags = "") {
  const result = compileSafeRegexDetailed(pattern, flags);
  if (result.reason === "empty") return null;
  return {
    regex: result.regex,
    pattern: result.source,
    flags: result.flags,
    reason: normalizeRejectReason(result),
  };
}
/**
 * Compile a list of user-configured regex patterns, separating usable regexes from diagnostics.
 * Callers can keep operating with safe entries while reporting rejected unsafe patterns once.
 */
function compileConfigRegexes(patterns, flags = "") {
  const regexes = [];
  const rejected = [];
  for (const pattern of patterns) {
    const compiled = compileConfigRegex(pattern, flags);
    if (!compiled) continue;
    if (compiled.regex) {
      regexes.push(compiled.regex);
      continue;
    }
    rejected.push({
      pattern: compiled.pattern,
      flags: compiled.flags,
      reason: compiled.reason,
    });
  }
  return {
    regexes,
    rejected,
  };
}
//#endregion
//#region src/logging/config.ts
let cachedLoggingConfig;
/** Avoids config reads that can mutate or validate config while schema/config commands run. */
function shouldSkipMutatingLoggingConfigRead(argv = process.argv) {
  const [primary, secondary] = getCommandPathWithRootOptions(argv, 2);
  return primary === "config" && (secondary === "schema" || secondary === "validate");
}
/** Reads the logging block from config, caching by resolved config path. */
function readLoggingConfig() {
  if (shouldSkipMutatingLoggingConfigRead()) return;
  try {
    const configPath = resolveConfigPath();
    if (cachedLoggingConfig?.path === configPath) return cachedLoggingConfig.logging;
    if (!fs.existsSync(configPath)) return;
    const parsed = JSON5.parse(fs.readFileSync(configPath, "utf8"));
    const logging = isRecord(parsed) ? parsed.logging : void 0;
    const resolved = isRecord(logging) ? logging : void 0;
    cachedLoggingConfig = {
      path: configPath,
      logging: resolved,
    };
    return resolved;
  } catch {
    return;
  }
}
//#endregion
//#region src/logging/redact-bounded.ts
const REDACT_REGEX_CHUNK_THRESHOLD = 32768;
const REDACT_REGEX_CHUNK_SIZE = 16384;
/** Applies a regex replacement in chunks once input crosses the redaction size threshold. */
function replacePatternBounded(text, pattern, replacer, options) {
  const chunkThreshold = options?.chunkThreshold ?? REDACT_REGEX_CHUNK_THRESHOLD;
  const chunkSize = options?.chunkSize ?? REDACT_REGEX_CHUNK_SIZE;
  if (chunkThreshold <= 0 || chunkSize <= 0 || text.length <= chunkThreshold)
    return text.replace(pattern, replacer);
  let output = "";
  for (let index = 0; index < text.length; index += chunkSize)
    output += text.slice(index, index + chunkSize).replace(pattern, replacer);
  return output;
}
//#endregion
//#region src/logging/redact-internal.ts
const fullContextToolPayloadRedaction = Symbol("full-context-tool-payload-redaction");
function isFullContextToolPayloadRedaction(loggingConfig) {
  return Boolean(loggingConfig?.[fullContextToolPayloadRedaction]);
}
//#endregion
//#region src/logging/secret-redaction-registry.ts
const MIN_SECRET_VALUE_LENGTH = 6;
const MAX_SECRET_VALUES = 512;
const registeredValues = /* @__PURE__ */ new Map();
let compiledMatcher;
let firstChars = /* @__PURE__ */ new Set();
function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function rebuildProbe() {
  firstChars = new Set([...registeredValues.keys()].map((value) => value.charAt(0)));
  compiledMatcher = void 0;
}
function registerOneSecretValue(value) {
  if (registeredValues.delete(value)) {
    registeredValues.set(value, true);
    return;
  }
  registeredValues.set(value, true);
  if (registeredValues.size > MAX_SECRET_VALUES) {
    const oldest = registeredValues.keys().next().value;
    if (oldest !== void 0) registeredValues.delete(oldest);
  }
  rebuildProbe();
}
/** Registers one resolved secret for exact-value log redaction. */
function registerSecretValueForRedaction(value) {
  if (value.length < MIN_SECRET_VALUE_LENGTH) return;
  const encoded = encodeURIComponent(value);
  if (encoded !== value) registerOneSecretValue(encoded);
  const jsonEscaped = JSON.stringify(value).slice(1, -1);
  if (jsonEscaped !== value) registerOneSecretValue(jsonEscaped);
  registerOneSecretValue(value);
}
/** Returns whether a value has SecretRef provenance in the process registry. */
function isSecretValueRegisteredForRedaction(value) {
  return registeredValues.has(value);
}
function hasRegisteredSecretValuesForRedaction() {
  return registeredValues.size > 0;
}
/** Replaces registered exact values while preserving the caller's mask convention. */
function redactRegisteredSecretValues(text, mask) {
  if (!text || registeredValues.size === 0) return text;
  let couldMatch = false;
  for (const firstChar of firstChars)
    if (text.includes(firstChar)) {
      couldMatch = true;
      break;
    }
  if (!couldMatch) return text;
  compiledMatcher ??= new RegExp(
    [...registeredValues.keys()]
      .toSorted((left, right) => right.length - left.length)
      .map(escapeRegExp)
      .join("|"),
    "g",
  );
  return text.replace(compiledMatcher, (value) => mask(value));
}
//#endregion
//#region src/logging/redact.ts
const DEFAULT_REDACT_MODE = "tools";
const DEFAULT_REDACT_MIN_LENGTH = 18;
const DEFAULT_REDACT_KEEP_START = 6;
const PAYMENT_CREDENTIAL_ENV_KEYS = String.raw`CARD[_-]?NUMBER|CARD[_-]?CVC|CARD[_-]?CVV|CVC|CVV|SECURITY[_-]?CODE|PAYMENT[_-]?CREDENTIAL|SHARED[_-]?PAYMENT[_-]?TOKEN`;
const PAYMENT_CREDENTIAL_QUERY_KEYS = String.raw`card[-_]?number|card[-_]?cvc|card[-_]?cvv|cvc|cvv|security[-_]?code|payment[-_]?credential|shared[-_]?payment[-_]?token`;
const AUTH_QUERY_KEYS = String.raw`access[-_]?token|auth[-_]?token|hook[-_]?token|refresh[-_]?token|id[-_]?token|api[-_]?key|apikey|client[-_]?secret|app[-_]?secret|private[-_]?key|credential|authorization|token|key|secret|password|pass|passwd|auth|jwt|session|code|signature|x[-_]?amz[-_]?(?:signature|security[-_]?token)`;
const FORM_BODY_FIRST_PAIR_KEYS = String.raw`${AUTH_QUERY_KEYS}|app[-_]?secret|credential|${PAYMENT_CREDENTIAL_QUERY_KEYS}`;
const STANDALONE_ASSIGNMENT_SECRET_KEYS = String.raw`access_token|refresh_token|id_token|auth[-_]?token|hook[-_]?token|api[-_]?key|client[-_]?secret|app[-_]?secret|private[-_]?key|authorization|jwt|token|secret|password|pass|passwd|credential|${PAYMENT_CREDENTIAL_QUERY_KEYS}`;
const BODY_SECRET_KEYS = /* @__PURE__ */ new Set([
  "access_token",
  "auth_token",
  "hook_token",
  "refresh_token",
  "id_token",
  "token",
  "api_key",
  "apikey",
  "client_secret",
  "app_secret",
  "password",
  "pass",
  "passwd",
  "auth",
  "jwt",
  "session",
  "code",
  "signature",
  "x_amz_signature",
  "x_amz_security_token",
  "secret",
  "credential",
  "private_key",
  "authorization",
  "key",
  "card_number",
  "card_cvc",
  "card_cvv",
  "cvc",
  "cvv",
  "security_code",
  "payment_credential",
  "shared_payment_token",
]);
const FORM_BODY_KEY_INVISIBLE_CHARS = String.raw`\p{C}\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000\u115F\u1160\u3164\uFFA0`;
const FORM_BODY_KEY_OBFUSCATION_RE = new RegExp(
  String.raw`[${FORM_BODY_KEY_INVISIBLE_CHARS}+]`,
  "gu",
);
const FORM_BODY_KEY_SEPARATOR_RE = /[\p{C}\p{Z}\u115F\u1160\u3164\uFFA0+]/gu;
const FORM_BODY_PERCENT_ESCAPE_RE = /%[0-9A-Fa-f]{2}/u;
const FORM_BODY_KEY = String.raw`[${FORM_BODY_KEY_INVISIBLE_CHARS}+]*(?:[A-Za-z_]|%[0-9A-Fa-f]{2})(?:[A-Za-z0-9_.-]|%[0-9A-Fa-f]{2}|[${FORM_BODY_KEY_INVISIBLE_CHARS}+])*`;
const FORM_BODY_VALUE = "[^&\\s<>]*";
const URL_QUERY_VALUE = "[^&#\\s<>]*";
const FORM_BODY_PAIR = String.raw`${FORM_BODY_KEY}=${FORM_BODY_VALUE}`;
const FORM_BODY_RE = new RegExp(String.raw`^${FORM_BODY_PAIR}(?:&${FORM_BODY_PAIR})+$`, "u");
const FORM_BODY_SUBSTRING_RE = new RegExp(
  String.raw`(^|[\s:({\[,="'` + "`" + String.raw`])(${FORM_BODY_PAIR}(?:&${FORM_BODY_PAIR})+)`,
  "gu",
);
const ENCODED_FORM_PAIR_RE = new RegExp(
  String.raw`(^|[\s:({\[,="'` + "`" + String.raw`&])(${FORM_BODY_KEY})=(${FORM_BODY_VALUE})`,
  "gu",
);
const FORM_BODY_CONTEXT_SINGLE_PAIR_RE = new RegExp(
  String.raw`(\b(?:body|form(?:[-_\s]?body)?)\s*[:=]\s*(["'\x60]?))(${FORM_BODY_KEY})=(${FORM_BODY_VALUE})(["'\x60]?)`,
  "giu",
);
const URL_QUERY_PAIR_RE = new RegExp(
  String.raw`([?&])(${FORM_BODY_KEY})=(${URL_QUERY_VALUE})`,
  "gu",
);
const SECRET_VALUE_TRAILING_DELIMITER_RE = /(["'`,;)}\]]+)$/u;
const SECRET_VALUE_SUFFIX_RE = /^["'`,;)}\]]*$/u;
const SECRET_VALUE_QUOTE_CHARS = /* @__PURE__ */ new Set(['"', "'", "`"]);
const FORM_BODY_LINE_BREAK_SPLIT_RE = /(\r\n|\r|\n)/u;
const FORM_BODY_LINE_BREAK_SEGMENT_RE = /^(?:\r\n|\r|\n)$/u;
const PAYMENT_CREDENTIAL_JSON_KEYS = String.raw`cardNumber|card_number|cardCvc|card_cvc|cardCvv|card_cvv|cvc|cvv|securityCode|security_code|paymentCredential|payment_credential|sharedPaymentToken|shared_payment_token`;
const STRUCTURED_SECRET_FIELD_RE = new RegExp(
  String.raw`^(?:api[-_]?key|apiKey|api[-_]?token|apiToken|bearer[-_]?token|bearerToken|token|secret|password|passwd|credential|authorization|private[-_]?key|privateKey|access[-_]?token|accessToken|refresh[-_]?token|refreshToken|id[-_]?token|idToken|auth[-_]?token|authToken|client[-_]?secret|clientSecret|app[-_]?secret|appSecret|secret[-_]?value|secretValue|raw[-_]?secret|rawSecret|secret[-_]?input|secretInput|key|key[-_]?material|keyMaterial|jwt|session|signature|cookie|set[-_]?cookie|${PAYMENT_CREDENTIAL_QUERY_KEYS}|${PAYMENT_CREDENTIAL_JSON_KEYS})$`,
  "i",
);
const STRUCTURED_INTERNAL_SOURCE_PATH_VALUE_RE = /^\$WORKSPACE_DIR\/[A-Za-z0-9._/-]+\.jsonl$/u;
const STRUCTURED_APP_PASSWORD_FIELD_RE =
  /^(?:apple|icloud|app[-_]?specific[-_]?password|appSpecificPassword|application[-_]?password|text|content|message|error|errorMessage|detail|details|reason)$/i;
const APP_SPECIFIC_PASSWORD_RE = /\b([a-z]{4}-[a-z]{4}-[a-z]{4}-[a-z]{4})\b/g;
const BENIGN_APP_PASSWORD_WORDS = /* @__PURE__ */ new Set([
  "case",
  "claw",
  "demo",
  "file",
  "main",
  "name",
  "open",
  "path",
  "slug",
  "test",
]);
const STRUCTURED_SECRET_ENV_FIELD_RE = new RegExp(
  String.raw`^(?:(?:[A-Z0-9]+[_-])+(?:KEY|TOKEN|SECRET|PASSWORD|PASSWD)|API[_-]?KEY|TOKEN|SECRET|PASSWORD|PASSWD|${PAYMENT_CREDENTIAL_ENV_KEYS})$`,
  "i",
);
const ENV_ASSIGNMENT_REDACT_PATTERN = String.raw`/\b[A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSWORD|PASSWD|${PAYMENT_CREDENTIAL_ENV_KEYS})\b\s*[=:]\s*(["']?)([^\s"'\\]+)\1/g`;
const ESCAPED_ENV_ASSIGNMENT_REDACT_PATTERN = String.raw`/\b[A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSWORD|PASSWD|${PAYMENT_CREDENTIAL_ENV_KEYS})\b\s*[=:]\s*\\+(["'])([^\s"'\\]+)\\+\1/g`;
const STANDALONE_ASSIGNMENT_QUOTED_REDACT_PATTERN = String.raw`(^|[\s,;])(?:${STANDALONE_ASSIGNMENT_SECRET_KEYS})=(["'\x60])((?:(?!\2)[^\r\n])+)\2`;
const STANDALONE_ASSIGNMENT_REDACT_PATTERN = String.raw`(^|[\s,;])(?:${STANDALONE_ASSIGNMENT_SECRET_KEYS})=(["'\x60]?[^\s&#"'\x60<>]+)`;
const BASE64_SAFE_TOKEN_BOUNDARY = String.raw`(^|[^A-Za-z0-9])(?<!;base64,[A-Za-z0-9+/=]*)`;
const IDENTIFIER_SAFE_TOKEN_BOUNDARY = String.raw`(^|[^A-Za-z0-9_])`;
const TELEGRAM_BOT_TOKEN_REDACT_PATTERN = String.raw`\bbot(\d{6,}:[A-Za-z0-9_-]{20,})\b`;
const TELEGRAM_TOKEN_REDACT_PATTERN = String.raw`\b(\d{6,}:[A-Za-z0-9_-]{20,})\b`;
const SHELL_REFERENCE_PRESERVING_PATTERN_SOURCES = /* @__PURE__ */ new Set([
  ENV_ASSIGNMENT_REDACT_PATTERN,
  ESCAPED_ENV_ASSIGNMENT_REDACT_PATTERN,
  STANDALONE_ASSIGNMENT_QUOTED_REDACT_PATTERN,
  STANDALONE_ASSIGNMENT_REDACT_PATTERN,
]);
const CHUNK_UNSAFE_PATTERN_SOURCES = /* @__PURE__ */ new Set([
  TELEGRAM_BOT_TOKEN_REDACT_PATTERN,
  TELEGRAM_TOKEN_REDACT_PATTERN,
]);
const shellReferencePreservingPatterns = /* @__PURE__ */ new WeakSet();
const chunkUnsafePatterns = /* @__PURE__ */ new WeakSet();
const DEFAULT_REDACT_PATTERNS = [
  ENV_ASSIGNMENT_REDACT_PATTERN,
  ESCAPED_ENV_ASSIGNMENT_REDACT_PATTERN,
  String.raw`/[?&](?:${AUTH_QUERY_KEYS}|${PAYMENT_CREDENTIAL_QUERY_KEYS})=([^&#\s<>]+)/gi`,
  String.raw`"(?:apiKey|api_key|apiToken|api_token|bearerToken|bearer_token|token|secret|password|passwd|credential|authorization|accessToken|access_token|refreshToken|refresh_token|idToken|id_token|authToken|auth_token|clientSecret|client_secret|privateKey|private_key|secret_value|raw_secret|secret_input|key_material|${PAYMENT_CREDENTIAL_JSON_KEYS})"\s*:\s*"([^"]+)"`,
  String.raw`(^|[\s,{])["']?(?:api[-_]key|access[-_]token|refresh[-_]token|id[-_]token|authToken|auth[-_]token|clientSecret|client[-_]secret|appSecret|app[-_]secret|private[-_]key|credential|authorization|secret[-_]value|raw[-_]secret|secret[-_]input|key[-_]material)["']?\s*[:=]\s*(["'])([^"'\r\n]+)\2`,
  String.raw`(^|[\s,{])["']?(?:authorization|proxy-authorization|cookie|set-cookie|x-api-key|x-auth-token)["']?\s*[:=]\s*(["'])([^"'\r\n]+)\2`,
  String.raw`--(?:api[-_]?key|hook[-_]?token|access[-_]?token|refresh[-_]?token|id[-_]?token|token|secret|password|passwd|credential|private[-_]?key|client[-_]?secret|${PAYMENT_CREDENTIAL_QUERY_KEYS})\s+(?!(?:or|and)\b(?=\s+--))(["']?)([^\s"']+)\1`,
  String.raw`Authorization\s*[:=]\s*Bearer\s+([A-Za-z0-9._\-+=]+)`,
  String.raw`Authorization\s*[:=]\s*Basic\s+([A-Za-z0-9+/=]+)`,
  String.raw`Authorization\s*[:=]\s*Bot\s+([A-Za-z0-9._\-+=]{18,})`,
  String.raw`(?:X-OpenClaw-Token|x-pomerium-jwt-assertion|X-Api-Key|X-Auth-Token)\s*[:=]\s*([^\s"',;]+)`,
  String.raw`\bBearer\s+([A-Za-z0-9._\-+=]{18,})\b`,
  String.raw`\b(?:https?|wss?|ftp):\/\/[^\/\s:@]*:([^\/\s@]+)@`,
  String.raw`\b(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?|rediss?|amqps?):\/\/[^:\s/@]*:([^@\s]+)@`,
  String.raw`(^|[\s,;])(?:${FORM_BODY_FIRST_PAIR_KEYS})=([^&\s]+)(?=&[A-Za-z_][A-Za-z0-9_.-]*=)`,
  STANDALONE_ASSIGNMENT_QUOTED_REDACT_PATTERN,
  STANDALONE_ASSIGNMENT_REDACT_PATTERN,
  String.raw`-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]+?-----END [A-Z ]*PRIVATE KEY-----`,
  String.raw`\b(sk-[A-Za-z0-9_-]{8,})\b`,
  String.raw`(ghp_[A-Za-z0-9]{10,})`,
  String.raw`(github_pat_[A-Za-z0-9_]{10,})`,
  String.raw`(gho_[A-Za-z0-9]{10,})`,
  String.raw`(ghu_[A-Za-z0-9]{10,})`,
  String.raw`(ghs_[A-Za-z0-9]{10,})`,
  String.raw`(ghr_[A-Za-z0-9]{10,})`,
  String.raw`(glpat-[A-Za-z0-9._=\-]{20,})`,
  String.raw`(gloas-[A-Fa-f0-9]{32,})`,
  String.raw`(xox[baprs]-[A-Za-z0-9-]{10,})`,
  String.raw`(xapp-[A-Za-z0-9-]{10,})`,
  String.raw`(https:\/\/hooks\.slack\.com\/(?:services\/T[A-Z0-9]+\/B[A-Z0-9]+|workflows\/T[A-Z0-9]+\/A[A-Z0-9]+\/[0-9]{17,19})\/[A-Za-z0-9]{20,})`,
  String.raw`(https:\/\/discord(?:app)?\.com\/api\/webhooks\/[0-9]{17,20}\/[A-Za-z0-9_-]{60,})`,
  String.raw`discord(?:.|\n|\r){0,40}?\b([A-Za-z0-9_-]{24}\.[A-Za-z0-9_-]{6}\.[A-Za-z0-9_-]{27})\b`,
  String.raw`(gsk_[A-Za-z0-9_-]{10,})`,
  String.raw`(AIza[0-9A-Za-z\-_]{20,})`,
  String.raw`(ya29\.[0-9A-Za-z_\-./+=]{10,})`,
  String.raw`(1//0[0-9A-Za-z_\-./+=]{10,})`,
  String.raw`(eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,})`,
  String.raw`(pplx-[A-Za-z0-9_-]{10,})`,
  String.raw`(fal_[A-Za-z0-9_-]{10,})`,
  String.raw`(fc-[A-Za-z0-9]{10,})`,
  String.raw`(bb_live_[A-Za-z0-9_-]{10,})`,
  String.raw`${BASE64_SAFE_TOKEN_BOUNDARY}(gAAAA[A-Za-z0-9_=-]{20,})`,
  String.raw`(sk_live_[A-Za-z0-9]{10,})`,
  String.raw`(sk_test_[A-Za-z0-9]{10,})`,
  String.raw`(rk_live_[A-Za-z0-9]{10,})`,
  String.raw`(SG\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,})`,
  String.raw`(npm_[A-Za-z0-9]{10,})`,
  String.raw`(pypi-[A-Za-z0-9_-]{10,})`,
  String.raw`(dop_v1_[A-Za-z0-9]{10,})`,
  String.raw`(doo_v1_[A-Za-z0-9]{10,})`,
  String.raw`(dor_v1_[A-Za-z0-9]{10,})`,
  String.raw`(dp\.(?:ct|pt|sa|scim|audit)\.[A-Za-z0-9]{40,44})`,
  String.raw`(dp\.st\.[A-Za-z0-9]{40,44})`,
  String.raw`(dp\.st\.[a-z0-9_-]{2,35}\.[A-Za-z0-9]{40,44})`,
  String.raw`(dckr_(?:pat|oat)_[A-Za-z0-9_-]{27,32})`,
  String.raw`(bkua_[a-z0-9]{40})`,
  String.raw`(CCIPAT_[A-Za-z0-9]{22}_[A-Fa-f0-9]{40})`,
  String.raw`(sbp_[a-z0-9]{40})`,
  String.raw`${BASE64_SAFE_TOKEN_BOUNDARY}(dapi[0-9a-f]{32}(?:-\d)?)`,
  String.raw`(dd[pw]_[A-Za-z0-9]{36})`,
  String.raw`(glsa_[A-Za-z0-9_]{41})`,
  String.raw`(glc_eyJ[A-Za-z0-9+/=]{60,160})`,
  String.raw`(nfp_[A-Za-z0-9_]{36})`,
  String.raw`(CFPAT-[A-Za-z0-9_\-]{40,})`,
  String.raw`${BASE64_SAFE_TOKEN_BOUNDARY}(ATCTT3xFfG[A-Za-z0-9+/=_-]+=[A-Za-z0-9]{8})`,
  String.raw`${BASE64_SAFE_TOKEN_BOUNDARY}(ATATT[A-Za-z0-9+/=_-]+=[A-Za-z0-9]{8})`,
  String.raw`${BASE64_SAFE_TOKEN_BOUNDARY}(ATBB[A-Za-z0-9_=.-]{16,})`,
  String.raw`(BBDC-[A-Za-z0-9+/@_-]{40,50})`,
  String.raw`(HRKU-AA[A-Za-z0-9_-]{20,})`,
  String.raw`(pat-(?:eu|na)1-[A-Za-z0-9]{8}\-[A-Za-z0-9]{4}\-[A-Za-z0-9]{4}\-[A-Za-z0-9]{4}\-[A-Za-z0-9]{12})`,
  String.raw`(apify_api_[A-Za-z0-9\-]{20,})`,
  String.raw`(FlyV1 fm\d+_[A-Za-z0-9+/=,_-]{100,})`,
  String.raw`(fio-u-[A-Za-z0-9_-]{40,})`,
  String.raw`(^|[^A-Za-z0-9_])(am_[A-Za-z0-9_-]{10,})`,
  String.raw`(^|[^A-Za-z0-9_])(sk_[A-Za-z0-9_]{10,})`,
  String.raw`(tvly-[A-Za-z0-9]{10,})`,
  String.raw`(exa_[A-Za-z0-9]{10,})`,
  String.raw`(syt_[A-Za-z0-9]{10,})`,
  String.raw`(retaindb_[A-Za-z0-9]{10,})`,
  String.raw`(hsk-[A-Za-z0-9]{10,})`,
  String.raw`(mem0_[A-Za-z0-9]{10,})`,
  String.raw`(brv_[A-Za-z0-9]{10,})`,
  String.raw`(xai-[A-Za-z0-9]{30,})`,
  String.raw`${IDENTIFIER_SAFE_TOKEN_BOUNDARY}(fw-[A-Za-z0-9]{30,})`,
  String.raw`${IDENTIFIER_SAFE_TOKEN_BOUNDARY}(fw_[A-Za-z0-9]{30,})`,
  String.raw`${IDENTIFIER_SAFE_TOKEN_BOUNDARY}(fpk_[A-Za-z0-9]{30,})`,
  String.raw`${BASE64_SAFE_TOKEN_BOUNDARY}(AKIA[A-Z0-9]{16})`,
  String.raw`${BASE64_SAFE_TOKEN_BOUNDARY}(ASIA[A-Z0-9]{16})`,
  String.raw`(AKID[A-Za-z0-9]{10,})`,
  String.raw`(LTAI[A-Za-z0-9]{10,})`,
  String.raw`(hf_[A-Za-z0-9]{10,})`,
  String.raw`(api_org_[A-Za-z0-9]{20,})`,
  String.raw`(r8_[A-Za-z0-9]{10,})`,
  TELEGRAM_BOT_TOKEN_REDACT_PATTERN,
  TELEGRAM_TOKEN_REDACT_PATTERN,
];
let defaultResolvedPatterns;
const DEFAULT_REDACT_PREFILTER_SOURCES = [
  String.raw`KEY|TOKEN|SECRET|PASSWORD|PASSWD|AUTH|COOKIE|SIGNATURE|CREDENTIAL|CARD|CVC|CVV|PAYMENT|PRIVATE KEY`,
  String.raw`security[-_]?code|\bpass=|jwt=|session=|code=`,
  String.raw`\bBearer\s+`,
  String.raw`:\/\/[^\/\s:@]*:[^\/\s@]+@`,
  String.raw`sk-|gh[opsur]_|github_pat_|glpat-|gloas-|xox[baprs]-|xapp-|hooks\.slack\.com|discord|gsk_|AIza|ya29\.|1\/\/0|eyJ|pplx-|fal_|fc-|bb_live_|gAAAA|[sr]k_(?:live|test)_|\bSG\.|npm_|pypi-|do[opr]_v1_|dp\.(?:ct|pt|sa|st|scim|audit)\.|dckr_|bkua_|CCIPAT_|sbp_|dapi[0-9a-f]|dd[pw]_|glsa_|nfp_|CFPAT-|ATCTT3|ATATT|ATBB|BBDC-|HRKU-|pat-(?:eu|na)1-|apify_api_|FlyV1|fio-u-|tvly-|exa_|syt_|retaindb_|mem0_|brv_|xai-|fw-|fw_|fpk_`,
  String.raw`(?:^|[^A-Za-z0-9_])(?:am_|sk_)`,
  String.raw`A[KS]IA[A-Z0-9]|AKID|LTAI|hf_|api_org_|r8_`,
  String.raw`\bbot\d{6,}:|\b\d{6,}:[A-Za-z0-9_-]{20,}`,
  String.raw`%[0-9A-Fa-f]{2}[A-Za-z0-9_%.-]*=`,
  String.raw`(?:\+|[${FORM_BODY_KEY_INVISIBLE_CHARS}])(?:[${FORM_BODY_KEY_INVISIBLE_CHARS}+]*[A-Za-z0-9_%.-])+[${FORM_BODY_KEY_INVISIBLE_CHARS}+]*=`,
];
const DEFAULT_REDACT_PREFILTER_RE = new RegExp(
  `(?:${DEFAULT_REDACT_PREFILTER_SOURCES.join("|")})`,
  "iu",
);
function normalizeMode(value) {
  return value === "off" ? "off" : DEFAULT_REDACT_MODE;
}
function parsePattern(raw) {
  let pattern = null;
  if (raw instanceof RegExp)
    if (raw.flags.includes("g")) pattern = raw;
    else pattern = new RegExp(raw.source, `${raw.flags}g`);
  else if (raw.trim()) {
    const match = raw.match(/^\/(.+)\/([gimsuy]*)$/);
    if (match) {
      const flags = expectDefined(match[2], "redact regex capture 2").includes("g")
        ? match[2]
        : `${match[2]}g`;
      pattern =
        compileConfigRegex(expectDefined(match[1], "redact regex capture 1"), flags)?.regex ?? null;
    } else pattern = compileConfigRegex(raw, "gi")?.regex ?? null;
  }
  if (pattern && typeof raw === "string" && SHELL_REFERENCE_PRESERVING_PATTERN_SOURCES.has(raw))
    shellReferencePreservingPatterns.add(pattern);
  if (
    pattern &&
    typeof raw === "string" &&
    (raw.startsWith(BASE64_SAFE_TOKEN_BOUNDARY) ||
      raw.startsWith(IDENTIFIER_SAFE_TOKEN_BOUNDARY) ||
      CHUNK_UNSAFE_PATTERN_SOURCES.has(raw))
  )
    chunkUnsafePatterns.add(pattern);
  return pattern;
}
function resolvePatterns(value) {
  if (!value?.length) {
    defaultResolvedPatterns ??= DEFAULT_REDACT_PATTERNS.map(parsePattern).filter((re) =>
      Boolean(re),
    );
    return defaultResolvedPatterns;
  }
  return value.map(parsePattern).filter((re) => Boolean(re));
}
function includesDefaultRedactPatterns(value) {
  if (!value?.length) return true;
  const source = new Set(value.filter((pattern) => typeof pattern === "string"));
  return DEFAULT_REDACT_PATTERNS.every((pattern) => source.has(pattern));
}
function maskToken(token) {
  if (token === "***") return token;
  if (token.length < DEFAULT_REDACT_MIN_LENGTH) return "***";
  return `${sliceUtf16Safe(token, 0, DEFAULT_REDACT_KEEP_START)}…${sliceUtf16Safe(token, -4)}`;
}
function splitSecretValueForMask(token) {
  const openingQuote = token[0] ?? "";
  if (SECRET_VALUE_QUOTE_CHARS.has(openingQuote)) {
    const closingQuoteIndex = token.lastIndexOf(openingQuote);
    if (closingQuoteIndex > 0) {
      const suffix = token.slice(closingQuoteIndex + 1);
      if (SECRET_VALUE_SUFFIX_RE.test(suffix))
        return {
          maskable: token.slice(1, closingQuoteIndex),
          suffix,
          maskStart: 0,
          maskEnd: closingQuoteIndex + 1,
        };
    }
    const tokenWithoutLeadingQuote = token.slice(1);
    const trailingDelimiter =
      tokenWithoutLeadingQuote.match(SECRET_VALUE_TRAILING_DELIMITER_RE)?.[1] ?? "";
    const maskable =
      trailingDelimiter && trailingDelimiter.length < tokenWithoutLeadingQuote.length
        ? tokenWithoutLeadingQuote.slice(0, -trailingDelimiter.length)
        : tokenWithoutLeadingQuote;
    return {
      maskable,
      suffix:
        trailingDelimiter && trailingDelimiter.length < tokenWithoutLeadingQuote.length
          ? trailingDelimiter
          : "",
      maskStart: 0,
      maskEnd: 1 + maskable.length,
    };
  }
  const trailingDelimiter = token.match(SECRET_VALUE_TRAILING_DELIMITER_RE)?.[1] ?? "";
  const maskable =
    trailingDelimiter && trailingDelimiter.length < token.length
      ? token.slice(0, -trailingDelimiter.length)
      : token;
  return {
    maskable,
    suffix: maskable === token ? "" : trailingDelimiter,
    maskStart: 0,
    maskEnd: maskable.length,
  };
}
function maskSecretValue(token, options) {
  const { maskable, suffix } = splitSecretValueForMask(token);
  return `${options?.hinted ? maskToken(maskable) : "***"}${suffix}`;
}
function normalizeSensitiveKeyName(value) {
  const stripped = value.replace(FORM_BODY_KEY_SEPARATOR_RE, "");
  try {
    return decodeURIComponent(stripped)
      .replace(FORM_BODY_KEY_SEPARATOR_RE, "")
      .toLowerCase()
      .replaceAll("-", "_");
  } catch {
    return stripped.toLowerCase().replaceAll("-", "_");
  }
}
function isSensitiveBodyKey(key) {
  return BODY_SECRET_KEYS.has(normalizeSensitiveKeyName(key));
}
function hasEncodedOrInvisibleFormKey(key) {
  return (
    FORM_BODY_PERCENT_ESCAPE_RE.test(key) || key.replace(FORM_BODY_KEY_OBFUSCATION_RE, "") !== key
  );
}
function redactFormEncodedPairs(value, options) {
  return value
    .split("&")
    .map((pair) => {
      const equalsIndex = pair.indexOf("=");
      if (equalsIndex < 0) return pair;
      const key = pair.slice(0, equalsIndex);
      if (options?.onlyEncodedOrInvisibleKeys && !hasEncodedOrInvisibleFormKey(key)) return pair;
      if (!isSensitiveBodyKey(key)) return pair;
      return `${key}=${maskSecretValue(pair.slice(equalsIndex + 1), { hinted: options?.maskValues === "hinted" })}`;
    })
    .join("&");
}
function markBitmapRange(bitmap, start, end) {
  const boundedStart = Math.max(0, start);
  const boundedEnd = Math.min(bitmap.length, end);
  for (let i = boundedStart; i < boundedEnd; i++) bitmap[i] = true;
}
function markSensitiveFormEncodedPairValues(bitmap, value, offset, options) {
  let cursor = 0;
  for (const pair of value.split("&")) {
    const pairStart = cursor;
    cursor = pairStart + pair.length + 1;
    const equalsIndex = pair.indexOf("=");
    if (equalsIndex < 0) continue;
    const key = pair.slice(0, equalsIndex);
    if (options?.onlyEncodedOrInvisibleKeys && !hasEncodedOrInvisibleFormKey(key)) continue;
    if (!isSensitiveBodyKey(key)) continue;
    const secretValue = splitSecretValueForMask(pair.slice(equalsIndex + 1));
    const valueStart = pairStart + equalsIndex + 1 + secretValue.maskStart;
    const valueEnd = pairStart + equalsIndex + 1 + secretValue.maskEnd;
    markBitmapRange(bitmap, offset + valueStart, offset + valueEnd);
  }
}
function redactUrlQueryPairs(text) {
  if (!text || !text.includes("?")) return text;
  return text.replace(URL_QUERY_PAIR_RE, (match, prefix, key, token) => {
    if (!hasEncodedOrInvisibleFormKey(key) || !isSensitiveBodyKey(key)) return match;
    return `${prefix}${key}=${maskSecretValue(token, { hinted: true })}`;
  });
}
function markUrlQueryPairRedactions(text, bitmap) {
  if (!text || !text.includes("?")) return;
  for (const match of text.matchAll(URL_QUERY_PAIR_RE)) {
    if (match.index === void 0) continue;
    const prefix = match[1] ?? "";
    const key = match[2] ?? "";
    const token = match[3] ?? "";
    if (!hasEncodedOrInvisibleFormKey(key) || !isSensitiveBodyKey(key)) continue;
    const secretValue = splitSecretValueForMask(token);
    const valueOffset = match.index + prefix.length + key.length + 1;
    markBitmapRange(bitmap, valueOffset + secretValue.maskStart, valueOffset + secretValue.maskEnd);
  }
}
function redactEncodedFormPairs(text) {
  if (!text || (!text.includes("%") && text.replace(FORM_BODY_KEY_OBFUSCATION_RE, "") === text))
    return text;
  return text.replace(ENCODED_FORM_PAIR_RE, (match, prefix, key, token) => {
    if (!hasEncodedOrInvisibleFormKey(key) || !isSensitiveBodyKey(key)) return match;
    return `${prefix}${key}=${maskSecretValue(token)}`;
  });
}
function markEncodedFormPairRedactions(text, bitmap, offset = 0) {
  if (!text || (!text.includes("%") && text.replace(FORM_BODY_KEY_OBFUSCATION_RE, "") === text))
    return;
  for (const match of text.matchAll(ENCODED_FORM_PAIR_RE)) {
    if (match.index === void 0) continue;
    const prefix = match[1] ?? "";
    const key = match[2] ?? "";
    const token = match[3] ?? "";
    if (!hasEncodedOrInvisibleFormKey(key) || !isSensitiveBodyKey(key)) continue;
    const secretValue = splitSecretValueForMask(token);
    const valueOffset = match.index + prefix.length + key.length + 1;
    markBitmapRange(
      bitmap,
      offset + valueOffset + secretValue.maskStart,
      offset + valueOffset + secretValue.maskEnd,
    );
  }
}
function redactFormBodyContextSinglePairs(text) {
  if (!text || !/[=:]/u.test(text)) return text;
  return text.replace(
    FORM_BODY_CONTEXT_SINGLE_PAIR_RE,
    (match, prefix, _quote, key, token, suffix) => {
      if (!isSensitiveBodyKey(key)) return match;
      return `${prefix}${key}=${maskSecretValue(token)}${suffix}`;
    },
  );
}
function markFormBodyContextSinglePairRedactions(text, bitmap, offset = 0) {
  if (!text || !/[=:]/u.test(text)) return;
  for (const match of text.matchAll(FORM_BODY_CONTEXT_SINGLE_PAIR_RE)) {
    if (match.index === void 0) continue;
    const prefix = match[1] ?? "";
    const key = match[3] ?? "";
    const token = match[4] ?? "";
    if (!isSensitiveBodyKey(key)) continue;
    const secretValue = splitSecretValueForMask(token);
    const valueOffset = match.index + prefix.length + key.length + 1;
    markBitmapRange(
      bitmap,
      offset + valueOffset + secretValue.maskStart,
      offset + valueOffset + secretValue.maskEnd,
    );
  }
}
function redactFormBodyLine(text) {
  if (!text) return text;
  const contextRedacted = redactFormBodyContextSinglePairs(redactEncodedFormPairs(text));
  if (!contextRedacted.includes("&")) return contextRedacted;
  if (FORM_BODY_RE.test(contextRedacted)) return redactFormEncodedPairs(contextRedacted);
  return redactFormBodyContextSinglePairs(
    redactEncodedFormPairs(
      contextRedacted.replace(FORM_BODY_SUBSTRING_RE, (match, prefix, body) => {
        const redactedBody = redactFormEncodedPairs(body);
        return redactedBody === body ? match : `${prefix}${redactedBody}`;
      }),
    ),
  );
}
function redactFormBody(text) {
  if (!text) return text;
  if (FORM_BODY_LINE_BREAK_SPLIT_RE.test(text))
    return text
      .split(FORM_BODY_LINE_BREAK_SPLIT_RE)
      .map((segment) =>
        FORM_BODY_LINE_BREAK_SEGMENT_RE.test(segment) ? segment : redactFormBodyLine(segment),
      )
      .join("");
  return redactFormBodyLine(text);
}
function markFormBodyLineRedactions(text, bitmap, offset) {
  if (!text) return;
  markEncodedFormPairRedactions(text, bitmap, offset);
  markFormBodyContextSinglePairRedactions(text, bitmap, offset);
  if (!text.includes("&")) return;
  if (FORM_BODY_RE.test(text)) {
    markSensitiveFormEncodedPairValues(bitmap, text, offset);
    return;
  }
  for (const match of text.matchAll(FORM_BODY_SUBSTRING_RE)) {
    if (match.index === void 0) continue;
    const prefix = match[1] ?? "";
    markSensitiveFormEncodedPairValues(
      bitmap,
      match[2] ?? "",
      offset + match.index + prefix.length,
    );
  }
}
function markFormBodyRedactions(text, bitmap) {
  if (!text) return;
  if (!FORM_BODY_LINE_BREAK_SPLIT_RE.test(text)) {
    markFormBodyLineRedactions(text, bitmap, 0);
    return;
  }
  let offset = 0;
  for (const segment of text.split(FORM_BODY_LINE_BREAK_SPLIT_RE)) {
    if (!FORM_BODY_LINE_BREAK_SEGMENT_RE.test(segment))
      markFormBodyLineRedactions(segment, bitmap, offset);
    offset += segment.length;
  }
}
function redactPemBlock(block) {
  const lines = block.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return "***";
  return `${lines[0]}\n…redacted…\n${lines[lines.length - 1]}`;
}
function isShellReferenceToKey(key, value) {
  if (!/^[A-Z_][A-Z0-9_]*$/.test(key)) return false;
  const bare = value.match(/^\$([A-Z_][A-Z0-9_]*)$/);
  if (bare) return bare[1] === key;
  return value.match(/^\$\{([A-Z_][A-Z0-9_]*)(?::[-=?+])?\}$/)?.[1] === key;
}
function readEnvAssignmentKey(match) {
  return match.match(/\b([A-Z_][A-Z0-9_]*)\b\s*[=:]/)?.[1];
}
function shouldPreserveShellReferenceMatch(match, token) {
  const key = readEnvAssignmentKey(match);
  return key ? isShellReferenceToKey(key, token) : false;
}
function isEmptyShellParameterExpansionTail(token) {
  return /^[-=?+]\}$/.test(token);
}
function hasBackreferenceToGroup(pattern, groupNumber) {
  return new RegExp(String.raw`\\${groupNumber}(?!\d)`).test(pattern.source);
}
function selectSecretCapture(match, groups) {
  const tokens = groups
    .map((value, index) => ({
      index,
      value,
    }))
    .filter(({ value }) => typeof value === "string" && value.length > 0);
  return {
    ...((tokens.length > 1 ? tokens[tokens.length - 1] : tokens[0]) ?? {
      index: -1,
      value: match,
    }),
    captureCount: tokens.length,
  };
}
function getIndexedCaptureStart(pattern, input, match, matchOffset, captureIndex) {
  if (matchOffset < 0 || !input) return null;
  try {
    const flags = pattern.flags.includes("d") ? pattern.flags : `${pattern.flags}d`;
    const indexedPattern = new RegExp(pattern.source, flags);
    indexedPattern.lastIndex = matchOffset;
    const indexedMatch = indexedPattern.exec(input);
    const captureIndices = indexedMatch?.indices?.[captureIndex + 1];
    if (!indexedMatch || indexedMatch.index !== matchOffset || indexedMatch[0] !== match)
      return null;
    if (!captureIndices) return null;
    return captureIndices[0] - matchOffset;
  } catch {
    return null;
  }
}
function getSecretCaptureStart(pattern, input, match, matchOffset, selected) {
  const indexedTokenStart = getIndexedCaptureStart(
    pattern,
    input,
    match,
    matchOffset,
    selected.index,
  );
  const preferFirstCapture =
    selected.captureCount === 1 &&
    selected.index >= 0 &&
    hasBackreferenceToGroup(pattern, selected.index + 1);
  return (
    indexedTokenStart ??
    (preferFirstCapture ? match.indexOf(selected.value) : match.lastIndexOf(selected.value))
  );
}
function redactMatch(match, groups, pattern, context) {
  if (match.includes("PRIVATE KEY-----")) return redactPemBlock(match);
  const selected = selectSecretCapture(match, groups);
  const token = selected.value;
  if (splitSecretValueForMask(token).maskable === "***") return match;
  const isShellReferencePattern = shellReferencePreservingPatterns.has(pattern);
  if (
    isShellReferencePattern &&
    (shouldPreserveShellReferenceMatch(match, token) || isEmptyShellParameterExpansionTail(token))
  )
    return match;
  const masked = isShellReferencePattern
    ? maskToken(token)
    : maskSecretValue(token, { hinted: true });
  if (token === match) return masked;
  const tokenIndex = getSecretCaptureStart(
    pattern,
    context?.input ?? "",
    match,
    context?.offset ?? -1,
    selected,
  );
  if (tokenIndex < 0) return match;
  return `${match.slice(0, tokenIndex)}${masked}${match.slice(tokenIndex + token.length)}`;
}
function redactText(text, patterns, options) {
  let next = text;
  if (options?.redactFormBodies) {
    next = redactUrlQueryPairs(next);
    next = redactFormBody(next);
  }
  for (const pattern of patterns) {
    const replacer = (...args) => {
      const inputIndex =
        args.length > 0 &&
        typeof args[args.length - 1] === "object" &&
        args[args.length - 1] !== null
          ? args.length - 2
          : args.length - 1;
      const offsetIndex = inputIndex - 1;
      const match = typeof args[0] === "string" ? args[0] : "";
      const groups = args
        .slice(1, offsetIndex)
        .map((value) => (typeof value === "string" ? value : ""));
      const offset = typeof args[offsetIndex] === "number" ? args[offsetIndex] : -1;
      const input = typeof args[inputIndex] === "string" ? args[inputIndex] : "";
      return redactMatch(match, groups, pattern, {
        input,
        offset,
      });
    };
    next =
      options?.fullContext || chunkUnsafePatterns.has(pattern)
        ? next.replace(pattern, replacer)
        : replacePatternBounded(next, pattern, replacer);
  }
  return next;
}
function couldMatchDefaultRedactPatterns(text) {
  return DEFAULT_REDACT_PREFILTER_RE.test(text);
}
function cloneGlobalPattern(pattern) {
  return pattern.flags.includes("g")
    ? new RegExp(pattern.source, pattern.flags)
    : new RegExp(pattern.source, `${pattern.flags}g`);
}
function markPatternMatchRedaction(bitmap, input, pattern, match) {
  if (match.index === void 0) return;
  const fullMatch = match[0] ?? "";
  if (fullMatch.includes("PRIVATE KEY-----")) {
    markBitmapRange(bitmap, match.index, match.index + fullMatch.length);
    return;
  }
  const selected = selectSecretCapture(
    fullMatch,
    match.slice(1).map((value) => (typeof value === "string" ? value : "")),
  );
  const tokenStart =
    selected.value === fullMatch
      ? 0
      : getSecretCaptureStart(pattern, input, fullMatch, match.index, selected);
  if (tokenStart < 0) return;
  const secretValue = splitSecretValueForMask(selected.value);
  markBitmapRange(
    bitmap,
    match.index + tokenStart + secretValue.maskStart,
    match.index + tokenStart + secretValue.maskEnd,
  );
}
function computeSensitiveRedactionBitmap(text, resolved) {
  const bitmap = Array.from({ length: text.length }, () => false);
  if (resolved.mode === "off" || !resolved.patterns.length || !text) return bitmap;
  if (resolved.redactFormBodies) {
    markUrlQueryPairRedactions(text, bitmap);
    markFormBodyRedactions(text, bitmap);
  }
  for (const pattern of resolved.patterns)
    for (const match of text.matchAll(cloneGlobalPattern(pattern)))
      markPatternMatchRedaction(bitmap, text, pattern, match);
  return bitmap;
}
function looksLikeAppSpecificPassword(candidate) {
  return candidate.split("-").every((part) => !BENIGN_APP_PASSWORD_WORDS.has(part.toLowerCase()));
}
function redactAppSpecificPasswords(text) {
  return replacePatternBounded(text, APP_SPECIFIC_PASSWORD_RE, (match, token) =>
    looksLikeAppSpecificPassword(token)
      ? redactMatch(match, [token], APP_SPECIFIC_PASSWORD_RE)
      : match,
  );
}
function resolveConfigRedaction() {
  const cfg = readLoggingConfig();
  return {
    mode: normalizeMode(cfg?.redactSensitive),
    patterns: cfg?.redactPatterns,
  };
}
function resolveRedactOptions(options) {
  const resolved = options ?? resolveConfigRedaction();
  const mode = normalizeMode(resolved.mode);
  if (mode === "off")
    return {
      mode,
      patterns: [],
      redactFormBodies: false,
    };
  const patterns = resolvePatterns(resolved.patterns);
  return {
    mode,
    patterns,
    redactFormBodies: patterns.length > 0 && includesDefaultRedactPatterns(resolved.patterns),
  };
}
function redactSensitiveText(text, options) {
  if (!text) return text;
  const exactRedacted = redactRegisteredSecretValues(text, maskToken);
  const resolvedOptions = options ?? resolveConfigRedaction();
  if (normalizeMode(resolvedOptions.mode) === "off") return exactRedacted;
  if (!resolvedOptions.patterns?.length && !couldMatchDefaultRedactPatterns(exactRedacted))
    return exactRedacted;
  const resolved = resolveRedactOptions(resolvedOptions);
  if (!resolved.patterns.length) return exactRedacted;
  return redactText(exactRedacted, resolved.patterns, {
    redactFormBodies: resolved.redactFormBodies,
  });
}
function redactToolDetail(detail) {
  return redactToolPayloadText(detail);
}
function resolveToolPayloadRedaction(loggingConfig = readLoggingConfig()) {
  const userPatterns = loggingConfig?.redactPatterns;
  return {
    mode: "tools",
    patterns:
      userPatterns && userPatterns.length > 0
        ? [...userPatterns, ...DEFAULT_REDACT_PATTERNS]
        : void 0,
  };
}
function redactToolPayloadText(text) {
  return redactToolPayloadTextWithConfig(text, readLoggingConfig());
}
function redactToolPayloadTextWithConfig(text, loggingConfig) {
  if (!text) return text;
  const exactRedacted = redactRegisteredSecretValues(text, maskToken);
  if (isFullContextToolPayloadRedaction(loggingConfig)) {
    const resolved = resolveRedactOptions(resolveToolPayloadRedaction(loggingConfig));
    return redactText(exactRedacted, resolved.patterns, {
      fullContext: true,
      redactFormBodies: resolved.redactFormBodies,
    });
  }
  return redactSensitiveText(text, resolveToolPayloadRedaction(loggingConfig));
}
function isSensitiveFieldKey(key) {
  return STRUCTURED_SECRET_FIELD_RE.test(key) || STRUCTURED_SECRET_ENV_FIELD_RE.test(key);
}
function redactSensitiveFieldValueWithOptions(key, value, options, path = [key]) {
  const exactRedacted = redactRegisteredSecretValues(value, maskToken);
  const resolved = resolveRedactOptions(options);
  if (resolved.mode === "off") return exactRedacted;
  const redacted = redactText(exactRedacted, resolved.patterns, {
    redactFormBodies: resolved.redactFormBodies,
  });
  if (redacted !== value || STRUCTURED_APP_PASSWORD_FIELD_RE.test(key)) {
    const appRedacted = redactAppSpecificPasswords(redacted);
    if (appRedacted !== value) return appRedacted;
  }
  if (redacted !== value) return redacted;
  const normalizedStructuredKey = key.toLowerCase();
  if (shouldRedactStructuredAuthorizationCode(normalizedStructuredKey, path))
    return maskToken(value);
  if (
    normalizedStructuredKey === "session" &&
    STRUCTURED_INTERNAL_SOURCE_PATH_VALUE_RE.test(exactRedacted)
  )
    return exactRedacted;
  if (isSensitiveFieldKey(key)) {
    if (isShellReferenceToKey(key, exactRedacted)) return exactRedacted;
    return maskToken(exactRedacted);
  }
  return exactRedacted;
}
function redactSensitiveFieldValue(key, value, options) {
  return redactSensitiveFieldValueWithOptions(key, value, options ?? resolveToolPayloadRedaction());
}
function redactSensitiveFieldValueWithConfig(key, value, loggingConfig) {
  return redactSensitiveFieldValueWithOptions(
    key,
    value,
    resolveToolPayloadRedaction(loggingConfig),
  );
}
function pathEndsWith(path, suffix) {
  if (path.length < suffix.length) return false;
  return suffix.every((part, index) => path[path.length - suffix.length + index] === part);
}
function shouldRedactStructuredAuthorizationCode(normalizedKey, path) {
  if (normalizedKey !== "code") return false;
  const normalizedPath = path.map((part) => part.toLowerCase());
  if (
    normalizedPath.length === 1 ||
    pathEndsWith(normalizedPath, ["error", "code"]) ||
    pathEndsWith(normalizedPath, ["nodeerror", "code"]) ||
    pathEndsWith(normalizedPath, ["status", "code"]) ||
    pathEndsWith(normalizedPath, ["details", "code"]) ||
    pathEndsWith(normalizedPath, ["warnings", "code"])
  )
    return false;
  return true;
}
function shouldRedactStructuredPrimitiveField(key, path) {
  return (
    shouldRedactStructuredAuthorizationCode(key.toLowerCase(), path) || isSensitiveFieldKey(key)
  );
}
function isPlainRedactableObject(value) {
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}
function redactStructuredSecretValue(key, value, seen, options, path = key ? [key] : []) {
  if (typeof value === "string")
    return redactSensitiveFieldValueWithOptions(key, value, options, path);
  if (value === null || value === void 0) return value;
  if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint")
    return shouldRedactStructuredPrimitiveField(key, path) ? "***" : value;
  if (Array.isArray(value)) {
    if (seen.has(value)) return "[Circular]";
    seen.add(value);
    const out = value.map((entry) => redactStructuredSecretValue(key, entry, seen, options, path));
    seen.delete(value);
    return out;
  }
  if (typeof value === "object") {
    if (seen.has(value)) return "[Circular]";
    if (!isPlainRedactableObject(value)) return value;
    seen.add(value);
    const out = {};
    for (const [nestedKey, nestedValue] of Object.entries(value))
      out[nestedKey] = redactStructuredSecretValue(nestedKey, nestedValue, seen, options, [
        ...path,
        nestedKey,
      ]);
    seen.delete(value);
    return out;
  }
  return value;
}
function redactSecrets(value) {
  const options = resolveToolPayloadRedaction();
  if (typeof value === "string") return redactSensitiveText(value, options);
  if (value === null || value === void 0) return value;
  if (typeof value !== "object") return value;
  return redactStructuredSecretValue("", value, /* @__PURE__ */ new WeakSet(), options);
}
function getDefaultRedactPatterns() {
  return [...DEFAULT_REDACT_PATTERNS];
}
function redactSensitiveLines(lines, resolved) {
  if (resolved.mode === "off" || !resolved.patterns.length || lines.length === 0) return lines;
  return redactText(
    (resolved.redactFormBodies
      ? lines.map((line) => redactFormBody(redactUrlQueryPairs(line)))
      : lines
    ).join("\n"),
    resolved.patterns,
  ).split("\n");
}
//#endregion
export {
  testRegexWithBoundedInput as C,
  hasNestedRepetition as S,
  readLoggingConfig as _,
  redactSensitiveFieldValue as a,
  compileSafeRegex as b,
  redactSensitiveText as c,
  redactToolPayloadTextWithConfig as d,
  resolveRedactOptions as f,
  registerSecretValueForRedaction as g,
  redactRegisteredSecretValues as h,
  redactSecrets as i,
  redactToolDetail as l,
  isSecretValueRegisteredForRedaction as m,
  getDefaultRedactPatterns as n,
  redactSensitiveFieldValueWithConfig as o,
  hasRegisteredSecretValuesForRedaction as p,
  isSensitiveFieldKey as r,
  redactSensitiveLines as s,
  computeSensitiveRedactionBitmap as t,
  redactToolPayloadText as u,
  shouldSkipMutatingLoggingConfigRead as v,
  compileSafeRegexDetailed as x,
  compileConfigRegexes as y,
};
