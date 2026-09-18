import {
  C as resolveExpiresAtMsFromDurationMs,
  j as resolveTimerTimeoutMs,
  o as asDateTimestampMs,
  r as MAX_TIMER_TIMEOUT_SECONDS,
} from "./number-coercion-CJQ8TR--.js";
import { t as decodeTextPrefix } from "./src-Bl7G9qvi.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
//#region src/agents/tools/web-shared.ts
/**
 * Shared web tool cache, timeout, and response helpers.
 *
 * Keeps web_fetch and web_search providers aligned on bounded IO and cache semantics.
 */
const DEFAULT_TIMEOUT_SECONDS = 30;
const DEFAULT_CACHE_TTL_MINUTES = 15;
const DEFAULT_CACHE_MAX_ENTRIES = 100;
function resolveTimeoutSeconds(value, fallback) {
  return Math.min(
    MAX_TIMER_TIMEOUT_SECONDS,
    Math.max(1, Math.floor(typeof value === "number" && Number.isFinite(value) ? value : fallback)),
  );
}
function resolvePositiveTimeoutSeconds(value, fallback) {
  return Math.min(
    MAX_TIMER_TIMEOUT_SECONDS,
    Math.max(
      1,
      Math.floor(
        typeof value === "number" && Number.isFinite(value) && value > 0 ? value : fallback,
      ),
    ),
  );
}
function resolveCacheTtlMs(value, fallbackMinutes) {
  return Math.round(
    (typeof value === "number" && Number.isFinite(value) ? Math.max(0, value) : fallbackMinutes) *
      6e4,
  );
}
function normalizeCacheKey(value) {
  return normalizeLowercaseStringOrEmpty(value);
}
function readCache(cache, key) {
  const entry = cache.get(key);
  if (!entry) return null;
  const now = asDateTimestampMs(Date.now());
  if (now === void 0 || now > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return {
    value: entry.value,
    cached: true,
  };
}
function writeCache(cache, key, value, ttlMs) {
  if (ttlMs <= 0) return;
  const now = Date.now();
  const expiresAt = resolveExpiresAtMsFromDurationMs(ttlMs, { nowMs: now });
  if (expiresAt === void 0) return;
  if (cache.size >= DEFAULT_CACHE_MAX_ENTRIES) {
    const oldest = cache.keys().next();
    if (!oldest.done) cache.delete(oldest.value);
  }
  cache.set(key, {
    value,
    expiresAt,
    insertedAt: now,
  });
}
function withTimeout(signal, timeoutMs) {
  if (timeoutMs <= 0) return signal ?? new AbortController().signal;
  const controller = new AbortController();
  const timer = setTimeout(controller.abort.bind(controller), resolveTimerTimeoutMs(timeoutMs, 1));
  if (signal)
    signal.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        controller.abort();
      },
      { once: true },
    );
  controller.signal.addEventListener(
    "abort",
    () => {
      clearTimeout(timer);
    },
    { once: true },
  );
  return controller.signal;
}
const RESPONSE_CHARSET_SCAN_BYTES = 4096;
const latin1Decoder = new TextDecoder("latin1");
function normalizeCharset(value) {
  const normalized = value?.trim().replace(/^["']|["']$/g, "") ?? "";
  return normalized && normalized.length <= 64 && /^[A-Za-z0-9._:-]+$/.test(normalized)
    ? normalized
    : void 0;
}
function readCharsetParam(value) {
  const match = /(?:^|;)\s*charset\s*=\s*(?:"([^"]+)"|'([^']+)'|([^;\s]+))/i.exec(value ?? "");
  return normalizeCharset(match?.[1] ?? match?.[2] ?? match?.[3]);
}
function readAttribute(tag, name) {
  const target = name.toLowerCase();
  for (const match of tag.matchAll(/([A-Za-z0-9:_-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/g))
    if (match[1]?.toLowerCase() === target) return match[2] ?? match[3] ?? match[4] ?? "";
}
function shouldSniffDocumentCharset(contentType) {
  const mediaType = contentType?.split(";", 1)[0]?.trim().toLowerCase();
  if (!mediaType) return true;
  return (
    mediaType === "text/html" ||
    mediaType === "application/xhtml+xml" ||
    mediaType === "text/xml" ||
    mediaType === "application/xml" ||
    mediaType.endsWith("+xml")
  );
}
function sniffCharset(contentType, bytes) {
  if (bytes[0] === 239 && bytes[1] === 187 && bytes[2] === 191) return "utf-8";
  if (bytes[0] === 255 && bytes[1] === 254) return "utf-16le";
  if (bytes[0] === 254 && bytes[1] === 255) return "utf-16be";
  if (!shouldSniffDocumentCharset(contentType)) return;
  const head = latin1Decoder.decode(
    bytes.subarray(0, Math.min(bytes.byteLength, RESPONSE_CHARSET_SCAN_BYTES)),
  );
  const xmlEncoding = /<\?xml\s+[^>]*\bencoding\s*=\s*(?:"([^"]+)"|'([^']+)')/i.exec(head);
  if (xmlEncoding) return normalizeCharset(xmlEncoding[1] ?? xmlEncoding[2]);
  for (const match of head.matchAll(/<meta\b[^>]*>/gi)) {
    const tag = match[0];
    const charset = normalizeCharset(readAttribute(tag, "charset"));
    if (charset) return charset;
    if (/^content-type$/i.test(readAttribute(tag, "http-equiv") ?? "")) {
      const contentCharset = readCharsetParam(readAttribute(tag, "content"));
      if (contentCharset) return contentCharset;
    }
  }
}
function concatBytes(parts, totalBytes) {
  if (parts.length === 1 && parts[0]?.byteLength === totalBytes) return parts[0];
  const bytes = new Uint8Array(totalBytes);
  let offset = 0;
  for (const part of parts) {
    bytes.set(part, offset);
    offset += part.byteLength;
  }
  return bytes;
}
function responseContentType(res) {
  const headers = res.headers;
  return typeof headers?.get === "function" ? headers.get("content-type") : null;
}
function decodeResponseBytes(res, bytes, truncated = false) {
  const contentType = responseContentType(res);
  const charset = readCharsetParam(contentType) ?? sniffCharset(contentType, bytes);
  try {
    return decodeTextPrefix(bytes, {
      encoding: charset ?? "utf-8",
      truncated,
    });
  } catch {
    return decodeTextPrefix(bytes, {
      encoding: "utf-8",
      truncated,
    });
  }
}
async function readResponseText(res, options) {
  const maxBytesRaw = options?.maxBytes;
  const maxBytes =
    typeof maxBytesRaw === "number" && Number.isFinite(maxBytesRaw) && maxBytesRaw > 0
      ? Math.floor(maxBytesRaw)
      : void 0;
  const body = res.body;
  if (
    maxBytes &&
    body &&
    typeof body === "object" &&
    "getReader" in body &&
    typeof body.getReader === "function"
  ) {
    const reader = body.getReader();
    let bytesRead = 0;
    let truncated = false;
    const parts = [];
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        if (!value || value.byteLength === 0) continue;
        let chunk = value;
        if (bytesRead + chunk.byteLength > maxBytes) {
          const remaining = Math.max(0, maxBytes - bytesRead);
          if (remaining <= 0) {
            truncated = true;
            break;
          }
          chunk = chunk.subarray(0, remaining);
          truncated = true;
        }
        bytesRead += chunk.byteLength;
        parts.push(chunk);
        if (truncated) break;
        if (bytesRead >= maxBytes) {
          truncated = true;
          while (true) {
            const { done: atEnd, value: extra } = await reader.read();
            if (atEnd) {
              truncated = false;
              break;
            }
            if (extra && extra.byteLength > 0) {
              truncated = true;
              break;
            }
          }
          break;
        }
      }
    } catch {
      truncated = true;
    } finally {
      if (truncated) reader.cancel().catch(() => void 0);
      try {
        reader.releaseLock();
      } catch {}
    }
    return {
      text: decodeResponseBytes(res, concatBytes(parts, bytesRead), truncated),
      truncated,
      bytesRead,
    };
  }
  if (maxBytes) {
    if (res instanceof Response && res.body === null)
      return {
        text: "",
        truncated: false,
        bytesRead: 0,
      };
    return {
      text: "",
      truncated: true,
      bytesRead: 0,
    };
  }
  const readBytes = res.arrayBuffer;
  if (typeof readBytes === "function")
    try {
      const bytes = new Uint8Array(await readBytes.call(res));
      return {
        text: decodeResponseBytes(res, bytes),
        truncated: false,
        bytesRead: bytes.byteLength,
      };
    } catch {}
  try {
    const text = await res.text();
    return {
      text,
      truncated: false,
      bytesRead: new TextEncoder().encode(text).byteLength,
    };
  } catch {
    return {
      text: "",
      truncated: false,
      bytesRead: 0,
    };
  }
}
//#endregion
export {
  readResponseText as a,
  resolveTimeoutSeconds as c,
  readCache as i,
  withTimeout as l,
  DEFAULT_TIMEOUT_SECONDS as n,
  resolveCacheTtlMs as o,
  normalizeCacheKey as r,
  resolvePositiveTimeoutSeconds as s,
  DEFAULT_CACHE_TTL_MINUTES as t,
  writeCache as u,
};
