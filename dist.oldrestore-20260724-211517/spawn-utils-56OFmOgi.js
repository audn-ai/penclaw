import { spawn, spawnSync } from "node:child_process";
import { r as toErrorObject } from "./error-coercion-CrJRoLe1.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import "./src-Bl7G9qvi.js";
import "./errors-BoHeli7m.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { t as getWindowsCmdExePath } from "./windows-install-roots-Cnzi1kc9.js";
//#region src/infra/windows-encoding.ts
const WINDOWS_CODEPAGE_ENCODING_MAP = {
  65001: "utf-8",
  54936: "gb18030",
  874: "windows-874",
  936: "gbk",
  950: "big5",
  932: "shift_jis",
  949: "euc-kr",
  1250: "windows-1250",
  1251: "windows-1251",
  1252: "windows-1252",
  1253: "windows-1253",
  1254: "windows-1254",
  1255: "windows-1255",
  1256: "windows-1256",
  1257: "windows-1257",
  1258: "windows-1258",
};
let cachedWindowsConsoleEncoding;
let cachedWindowsSystemEncoding;
/** Extracts a Windows console code page number from localized `chcp` output. */
function parseWindowsCodePage(raw) {
  if (!raw) return null;
  const match = raw.match(/\b(\d{3,5})\b/);
  if (!match?.[1]) return null;
  const codePage = Number.parseInt(match[1], 10);
  if (!Number.isFinite(codePage) || codePage <= 0) return null;
  return codePage;
}
/** Resolves and caches the current Windows console encoding for subprocess output. */
function resolveWindowsConsoleEncoding() {
  if (process.platform !== "win32") return null;
  if (cachedWindowsConsoleEncoding !== void 0) return cachedWindowsConsoleEncoding;
  try {
    const result = spawnSync(getWindowsCmdExePath(), ["/d", "/s", "/c", "chcp"], {
      windowsHide: true,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    const codePage = parseWindowsCodePage(`${result.stdout ?? ""}\n${result.stderr ?? ""}`);
    cachedWindowsConsoleEncoding =
      codePage !== null ? (WINDOWS_CODEPAGE_ENCODING_MAP[codePage] ?? null) : null;
  } catch {
    cachedWindowsConsoleEncoding = null;
  }
  return cachedWindowsConsoleEncoding;
}
/** Resolves and caches the Windows system encoding used by legacy text files. */
function resolveWindowsSystemEncoding() {
  if (process.platform !== "win32") return null;
  if (cachedWindowsSystemEncoding !== void 0) return cachedWindowsSystemEncoding;
  try {
    const result = spawnSync(
      "powershell.exe",
      ["-NoLogo", "-NoProfile", "-NonInteractive", "-Command", "[Text.Encoding]::Default.CodePage"],
      {
        windowsHide: true,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
      },
    );
    const codePage = parseWindowsCodePage(`${result.stdout ?? ""}\n${result.stderr ?? ""}`);
    cachedWindowsSystemEncoding =
      codePage !== null ? (WINDOWS_CODEPAGE_ENCODING_MAP[codePage] ?? null) : null;
  } catch {
    cachedWindowsSystemEncoding = null;
  }
  return cachedWindowsSystemEncoding;
}
/** Decodes one complete subprocess output buffer, preferring valid UTF-8 before legacy code pages. */
function decodeWindowsOutputBuffer(params) {
  return decodeWindowsBufferWithFallback({
    ...params,
    resolveFallbackEncoding: () => params.windowsEncoding ?? resolveWindowsConsoleEncoding(),
  });
}
/** Decodes a text file, preferring valid UTF-8 before the Windows system encoding. */
function decodeWindowsTextFileBuffer(params) {
  return decodeWindowsBufferWithFallback({
    ...params,
    resolveFallbackEncoding: () => params.windowsEncoding ?? resolveWindowsSystemEncoding(),
  });
}
function decodeWindowsBufferWithFallback(params) {
  if ((params.platform ?? process.platform) !== "win32") return params.buffer.toString("utf8");
  const utf8 = decodeStrictUtf8(params.buffer);
  if (utf8 !== null) return utf8;
  const encoding = params.resolveFallbackEncoding();
  if (!encoding || normalizeLowercaseStringOrEmpty(encoding) === "utf-8")
    return params.buffer.toString("utf8");
  try {
    return new TextDecoder(encoding).decode(params.buffer);
  } catch {
    return params.buffer.toString("utf8");
  }
}
/** Creates a streaming decoder for subprocess output chunks that may split multibyte characters. */
function createWindowsOutputDecoder(params) {
  const platform = params?.platform ?? process.platform;
  const encoding =
    platform === "win32" ? (params?.windowsEncoding ?? resolveWindowsConsoleEncoding()) : null;
  const normalizedEncoding = normalizeLowercaseStringOrEmpty(encoding);
  const legacyDecoder =
    platform === "win32" && encoding && normalizedEncoding !== "utf-8"
      ? new TextDecoder(encoding)
      : null;
  const utf8Decoder =
    platform === "win32" && legacyDecoder ? new TextDecoder("utf-8", { fatal: true }) : null;
  const streamingUtf8Decoder = legacyDecoder ? null : new TextDecoder("utf-8");
  let useLegacyDecoder = false;
  let pendingUtf8Bytes = Buffer.alloc(0);
  return {
    decode(chunk) {
      const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      if (!legacyDecoder || !utf8Decoder)
        return streamingUtf8Decoder?.decode(buffer, { stream: true }) ?? "";
      if (useLegacyDecoder) return legacyDecoder.decode(buffer, { stream: true });
      const replayBuffer =
        pendingUtf8Bytes.length > 0 ? Buffer.concat([pendingUtf8Bytes, buffer]) : buffer;
      try {
        const decoded = utf8Decoder.decode(buffer, { stream: true });
        pendingUtf8Bytes = Buffer.from(getTrailingIncompleteUtf8Bytes(replayBuffer));
        return decoded;
      } catch {
        useLegacyDecoder = true;
        pendingUtf8Bytes = Buffer.alloc(0);
        return legacyDecoder.decode(replayBuffer, { stream: true });
      }
    },
    flush() {
      if (!legacyDecoder || !utf8Decoder) return streamingUtf8Decoder?.decode() ?? "";
      if (useLegacyDecoder) return legacyDecoder.decode();
      try {
        const decoded = utf8Decoder.decode();
        pendingUtf8Bytes = Buffer.alloc(0);
        return decoded;
      } catch {
        useLegacyDecoder = true;
        const replayBuffer = pendingUtf8Bytes;
        pendingUtf8Bytes = Buffer.alloc(0);
        return replayBuffer.length > 0 ? legacyDecoder.decode(replayBuffer) : "";
      }
    },
  };
}
function getTrailingIncompleteUtf8Bytes(buffer) {
  let index = buffer.length - 1;
  let continuationBytes = 0;
  while (index >= 0 && continuationBytes < 3) {
    const byte = buffer.at(index);
    if (byte === void 0 || byte < 128 || byte > 191) break;
    continuationBytes += 1;
    index -= 1;
  }
  if (index < 0) return buffer;
  const leadByte = buffer.at(index);
  if (leadByte === void 0) return Buffer.alloc(0);
  const sequenceLength = getUtf8SequenceLength(leadByte);
  if (sequenceLength <= 1) return Buffer.alloc(0);
  return continuationBytes + 1 < sequenceLength ? buffer.subarray(index) : Buffer.alloc(0);
}
function getUtf8SequenceLength(byte) {
  if (byte >= 194 && byte <= 223) return 2;
  if (byte >= 224 && byte <= 239) return 3;
  if (byte >= 240 && byte <= 244) return 4;
  return 1;
}
function decodeStrictUtf8(buffer) {
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(buffer);
  } catch {
    return null;
  }
}
//#endregion
//#region src/process/spawn-utils.ts
const DEFAULT_RETRY_CODES = ["EBADF"];
function resolveCommandStdio(params) {
  return [params.hasInput ? "pipe" : params.preferInherit ? "inherit" : "pipe", "pipe", "pipe"];
}
function shouldRetry(err, codes) {
  const code = err && typeof err === "object" && "code" in err ? String(err.code) : "";
  return code.length > 0 && codes.includes(code);
}
async function spawnAndWaitForSpawn(spawnImpl, argv, options) {
  const child = spawnImpl(expectDefined(argv[0], "argv entry at 0"), argv.slice(1), options);
  return await new Promise((resolve, reject) => {
    let settled = false;
    const cleanup = () => {
      child.removeListener("error", onError);
      child.removeListener("spawn", onSpawn);
    };
    const finishResolve = () => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(child);
    };
    const onError = (err) => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(toErrorObject(err, "Non-Error rejection"));
    };
    const onSpawn = () => {
      finishResolve();
    };
    child.once("error", onError);
    child.once("spawn", onSpawn);
    process.nextTick(() => {
      if (typeof child.pid === "number") finishResolve();
    });
  });
}
async function spawnWithFallback(params) {
  const spawnImpl = params.spawnImpl ?? spawn;
  const retryCodes = params.retryCodes ?? DEFAULT_RETRY_CODES;
  const baseOptions = { ...params.options };
  const fallbacks = params.fallbacks ?? [];
  const attempts = [
    { options: baseOptions },
    ...fallbacks.map((fallback) => ({
      label: fallback.label,
      options: {
        ...baseOptions,
        ...fallback.options,
      },
    })),
  ];
  let lastError;
  for (const [index, attempt] of attempts.entries())
    try {
      return {
        child: await spawnAndWaitForSpawn(spawnImpl, params.argv, attempt.options),
        usedFallback: index > 0,
        fallbackLabel: attempt.label,
      };
    } catch (err) {
      lastError = err;
      const nextFallback = fallbacks[index];
      if (!nextFallback || !shouldRetry(err, retryCodes)) throw err;
      params.onFallback?.(err, nextFallback);
    }
  throw lastError;
}
//#endregion
export {
  decodeWindowsTextFileBuffer as a,
  decodeWindowsOutputBuffer as i,
  spawnWithFallback as n,
  resolveWindowsConsoleEncoding as o,
  createWindowsOutputDecoder as r,
  resolveCommandStdio as t,
};
