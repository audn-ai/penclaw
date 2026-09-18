import { r as fetchWithSsrFGuard } from "./fetch-guard-Da47iiZE.js";
import { t as hashText } from "./hash-DsDOoPhE.js";
import {
  d as runMemoryHostTasksWithConcurrency,
  f as hasNonTextEmbeddingParts,
  h as splitTextToUtf8ByteLimit,
  m as estimateUtf8Bytes,
} from "./internal-Dd4OzKYD.js";
import { o as requireApiKey } from "./model-auth-runtime-shared-BVzqP6NP.js";
import { T as formatErrorMessage } from "./openclaw-agent-db-VC51jrBW.js";
import { c as shouldUseEnvHttpProxyForUrl } from "./proxy-env-5nRGQyQD.js";
import { n as resolveMemorySecretInputString } from "./secret-input-BxM5UYg1.js";
import { t as decodeTextPrefix } from "./src-Bl7G9qvi.js";
import { o as retryAsync } from "./src-Dqmh2693.js";
import { y as ssrfPolicyFromHttpBaseUrlAllowedHostname } from "./ssrf-keFRGQLq.js";
import "./multimodal-1dt2YOuy.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
} from "./string-coerce-DW4mBlAt.js";
import "./memory-embedding-provider-runtime-DO4orj5r.js";
import "./openclaw-runtime-memory-7oDmkPWd.js";
import { s as resolveSafeTimeoutDelayMs } from "./timeouts-Dewo7BbT.js";
import "./embeddings-B6h5v7TW.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region packages/memory-host-sdk/src/host/batch-error-utils.ts
const BATCH_ERROR_DETAIL_MAX_CHARS = 500;
const BATCH_ERROR_DETAIL_TRUNCATED_SUFFIX = "... [truncated]";
const EMBEDDING_BATCH_UNAVAILABLE_CODE = "embedding_batch_unavailable";
/** Signals that a provider cannot run the configured embedding batch operation. */
var EmbeddingBatchUnavailableError = class extends Error {
  constructor(message, options) {
    super(message, options);
    this.code = EMBEDDING_BATCH_UNAVAILABLE_CODE;
    this.name = "EmbeddingBatchUnavailableError";
  }
};
function isEmbeddingBatchUnavailableError(error) {
  if (!error || typeof error !== "object") return false;
  try {
    return error.code === EMBEDDING_BATCH_UNAVAILABLE_CODE;
  } catch {
    return false;
  }
}
/** Pull a nested response error message without assuming a fixed provider body shape. */
function getResponseErrorMessage(line) {
  const body = line?.response?.body;
  if (typeof body === "string") return body || line?.response?.message || void 0;
  if (!body || typeof body !== "object") return line?.response?.message || void 0;
  return body.error?.message || line?.response?.message || void 0;
}
/** Return the first useful error message from batch output lines. */
function extractBatchErrorMessage(lines) {
  const first = lines.find((line) => line.error?.message || getResponseErrorMessage(line));
  return first?.error?.message || getResponseErrorMessage(first);
}
/** Redact and bound provider-controlled batch diagnostics before logging them. */
function formatBatchErrorDetail(detail) {
  if (!detail) return;
  const formatted = formatErrorMessage(detail);
  if (formatted.length <= BATCH_ERROR_DETAIL_MAX_CHARS) return formatted;
  return `${truncateUtf16Safe(formatted, BATCH_ERROR_DETAIL_MAX_CHARS - 15)}${BATCH_ERROR_DETAIL_TRUNCATED_SUFFIX}`;
}
/** Format a failed error-file read without hiding the underlying read problem. */
function formatUnavailableBatchError(err) {
  const message = formatBatchErrorDetail(formatErrorMessage(err));
  return message ? `error file unavailable: ${message}` : void 0;
}
//#endregion
//#region packages/memory-host-sdk/src/host/remote-http.ts
/** Proxy mode used only for URLs that the runtime classified as env-proxy safe. */
const MEMORY_REMOTE_TRUSTED_ENV_PROXY_MODE = "trusted_env_proxy";
/** Build an SSRF allow policy from a configured remote base URL. */
const buildRemoteBaseUrlPolicy = ssrfPolicyFromHttpBaseUrlAllowedHostname;
/** Execute a remote HTTP request under SSRF guard and always release the response handle. */
async function withRemoteHttpResponse(params) {
  const guardedFetch = params.fetchWithSsrFGuardImpl ?? fetchWithSsrFGuard;
  const shouldUseEnvProxy = params.shouldUseEnvHttpProxyForUrlImpl ?? shouldUseEnvHttpProxyForUrl;
  const { response, release } = await guardedFetch({
    url: params.url,
    fetchImpl: params.fetchImpl,
    init: params.init,
    signal: params.signal,
    policy: params.ssrfPolicy,
    auditContext: params.auditContext ?? "memory-remote",
    ...(shouldUseEnvProxy(params.url) ? { mode: MEMORY_REMOTE_TRUSTED_ENV_PROXY_MODE } : {}),
  });
  try {
    return await params.onResponse(response);
  } finally {
    await release();
  }
}
//#endregion
//#region packages/memory-host-sdk/src/host/response-snippet.ts
const DEFAULT_ERROR_BODY_MAX_BYTES = 8 * 1024;
const DEFAULT_ERROR_BODY_MAX_CHARS = 1e3;
const DEFAULT_JSON_BODY_MAX_BYTES = 64 * 1024 * 1024;
const TRUNCATED_SUFFIX = "... [truncated]";
/** Read a small collapsed text snippet from a response body. */
async function readMemoryHostResponseTextSnippet(res, options = {}) {
  const maxBytes = options.maxBytes ?? DEFAULT_ERROR_BODY_MAX_BYTES;
  const maxChars = options.maxChars ?? DEFAULT_ERROR_BODY_MAX_CHARS;
  const prefix = await readResponsePrefix(res, maxBytes, options.signal);
  if (prefix.length === 0) return "";
  const collapsed = decodeTextPrefix(joinChunks(prefix.bytes, prefix.length), {
    truncated: prefix.truncated,
  })
    .replace(/\s+/g, " ")
    .trim();
  if (!collapsed) return "";
  if (prefix.truncated || collapsed.length > maxChars)
    return `${truncateUtf16Safe(collapsed, maxChars)}${TRUNCATED_SUFFIX}`;
  return collapsed;
}
/** Read and parse JSON while enforcing a hard byte limit. */
async function readResponseJsonWithLimit(res, options) {
  const maxBytes = options.maxBytes ?? DEFAULT_JSON_BODY_MAX_BYTES;
  const contentLength = parseContentLength(res.headers.get("content-length"), options.errorPrefix);
  if (typeof contentLength === "number" && contentLength > maxBytes) {
    await cancelResponseBody(res);
    throw responseTooLarge(options.errorPrefix, contentLength, maxBytes);
  }
  const text = await readResponseTextWithLimit(res, maxBytes, options.errorPrefix, options.signal);
  try {
    return JSON.parse(text);
  } catch (cause) {
    throw new Error(`${options.errorPrefix}: malformed JSON response`, { cause });
  }
}
function toAbortError(signal, fallbackMessage) {
  return signal.reason instanceof Error ? signal.reason : new Error(fallbackMessage);
}
async function readChunkWithAbort(reader, signal, fallbackMessage) {
  if (!signal) return await reader.read();
  if (signal.aborted) {
    await reader.cancel().catch(() => void 0);
    throw toAbortError(signal, fallbackMessage);
  }
  let removeAbortListener;
  const abortPromise = new Promise((_resolve, reject) => {
    const onAbort = () => {
      reader.cancel().catch(() => void 0);
      reject(toAbortError(signal, fallbackMessage));
    };
    signal.addEventListener("abort", onAbort, { once: true });
    removeAbortListener = () => signal.removeEventListener("abort", onAbort);
  });
  try {
    return await Promise.race([reader.read(), abortPromise]);
  } finally {
    removeAbortListener?.();
  }
}
async function readResponsePrefix(res, maxBytes, signal) {
  const body = res.body;
  if (!body || typeof body.getReader !== "function")
    return {
      bytes: [],
      length: 0,
      truncated: false,
    };
  const reader = body.getReader();
  const chunks = [];
  let length = 0;
  let truncated = false;
  try {
    while (true) {
      const { done, value } = await readChunkWithAbort(
        reader,
        signal,
        "Response snippet body read aborted",
      );
      if (done) break;
      if (!value?.length) continue;
      const remaining = maxBytes - length;
      if (value.length >= remaining) {
        if (remaining > 0) {
          chunks.push(value.subarray(0, remaining));
          length += remaining;
        }
        truncated = true;
        await reader.cancel().catch(() => void 0);
        break;
      }
      chunks.push(value);
      length += value.length;
    }
  } finally {
    try {
      reader.releaseLock();
    } catch {}
  }
  return {
    bytes: chunks,
    length,
    truncated,
  };
}
async function readResponseTextWithLimit(res, maxBytes, errorPrefix, signal) {
  const body = res.body;
  if (!body || typeof body.getReader !== "function") return "";
  const reader = body.getReader();
  const chunks = [];
  let length = 0;
  try {
    while (true) {
      const { done, value } = await readChunkWithAbort(
        reader,
        signal,
        `${errorPrefix}: response body read aborted`,
      );
      if (done) break;
      if (!value?.length) continue;
      const nextLength = length + value.length;
      if (nextLength > maxBytes) {
        await reader.cancel().catch(() => void 0);
        throw responseTooLarge(errorPrefix, nextLength, maxBytes);
      }
      chunks.push(value);
      length = nextLength;
    }
  } finally {
    try {
      reader.releaseLock();
    } catch {}
  }
  return new TextDecoder().decode(joinChunks(chunks, length));
}
async function cancelResponseBody(res) {
  const body = res.body;
  if (!body || typeof body.cancel !== "function") return;
  await body.cancel().catch(() => void 0);
}
function parseContentLength(raw, errorPrefix) {
  const trimmed = raw?.trim();
  if (!trimmed) return;
  if (!/^\d+$/.test(trimmed))
    throw new Error(`${errorPrefix}: invalid content-length header: ${raw}`);
  const value = Number(trimmed);
  if (!Number.isSafeInteger(value))
    throw new Error(`${errorPrefix}: invalid content-length header: ${raw}`);
  return value;
}
function responseTooLarge(errorPrefix, size, maxBytes) {
  return new Error(responseTooLargeMessage(errorPrefix, size, maxBytes));
}
function responseTooLargeMessage(errorPrefix, size, maxBytes) {
  return `${errorPrefix}: response body too large: ${size} bytes (limit: ${maxBytes} bytes)`;
}
function joinChunks(chunks, length) {
  if (chunks.length === 1 && chunks[0]?.length === length) return chunks[0];
  const joined = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    joined.set(chunk, offset);
    offset += chunk.length;
  }
  return joined;
}
//#endregion
//#region packages/memory-host-sdk/src/host/post-json.ts
/** POST JSON, parse bounded response JSON, and attach status metadata when requested. */
async function postJson(params) {
  return await withRemoteHttpResponse({
    url: params.url,
    ssrfPolicy: params.ssrfPolicy,
    fetchImpl: params.fetchImpl,
    signal: params.signal,
    init: {
      method: "POST",
      headers: params.headers,
      body: JSON.stringify(params.body),
    },
    onResponse: async (res) => {
      if (!res.ok) {
        const text = await readMemoryHostResponseTextSnippet(res, { signal: params.signal });
        const err = /* @__PURE__ */ new Error(`${params.errorPrefix}: ${res.status} ${text}`);
        if (params.attachStatus) err.status = res.status;
        throw err;
      }
      const payload = await readResponseJsonWithLimit(res, {
        errorPrefix: params.errorPrefix,
        maxBytes: params.maxResponseBytes,
        signal: params.signal,
      });
      return await params.parse(payload);
    },
  });
}
//#endregion
//#region packages/memory-host-sdk/src/host/batch-http.ts
/** POST JSON and retry provider 429/5xx failures with bounded backoff. */
async function postJsonWithRetry(params) {
  return await (params.retryImpl ?? retryAsync)(
    async () => {
      return await postJson({
        url: params.url,
        headers: params.headers,
        ssrfPolicy: params.ssrfPolicy,
        fetchImpl: params.fetchImpl,
        body: params.body,
        errorPrefix: params.errorPrefix,
        attachStatus: true,
        parse: async (payload) => payload,
      });
    },
    {
      attempts: 3,
      minDelayMs: 300,
      maxDelayMs: 2e3,
      jitter: 0.2,
      shouldRetry: (err) => {
        const status = err.status;
        return status === 429 || (typeof status === "number" && status >= 500);
      },
    },
  );
}
//#endregion
//#region packages/memory-host-sdk/src/host/batch-output.ts
const DEFAULT_BATCH_OUTPUT_RECORD_MAX_BYTES = 4 * 1024 * 1024;
const INITIAL_BATCH_OUTPUT_RECORD_BYTES = 64 * 1024;
/** Stream bounded JSONL records without buffering the provider output file. */
async function readEmbeddingBatchJsonl(response, options) {
  const reader = response.body?.getReader();
  if (!reader) return;
  const maxRecordBytes = options.maxRecordBytes ?? DEFAULT_BATCH_OUTPUT_RECORD_MAX_BYTES;
  const decoder = new TextDecoder();
  let recordCount = 0;
  let recordBytes = 0;
  let recordBuffer;
  const appendRecordPart = (part) => {
    if (part.byteLength === 0) return;
    const nextRecordBytes = recordBytes + part.byteLength;
    if (nextRecordBytes > maxRecordBytes)
      throw new Error(`${options.label}: JSONL record exceeds ${maxRecordBytes} bytes`);
    if (!recordBuffer || recordBuffer.byteLength < nextRecordBytes) {
      const nextCapacity = Math.min(
        maxRecordBytes,
        Math.max(
          nextRecordBytes,
          recordBuffer
            ? recordBuffer.byteLength * 2
            : Math.min(INITIAL_BATCH_OUTPUT_RECORD_BYTES, maxRecordBytes),
        ),
      );
      const nextBuffer = new Uint8Array(nextCapacity);
      if (recordBuffer) nextBuffer.set(recordBuffer.subarray(0, recordBytes));
      recordBuffer = nextBuffer;
    }
    recordBuffer.set(part, recordBytes);
    recordBytes = nextRecordBytes;
  };
  const emitRecord = () => {
    recordCount += 1;
    if (recordCount > options.maxRecords)
      throw new Error(`${options.label}: JSONL output exceeds ${options.maxRecords} records`);
    const text = decoder.decode(recordBuffer?.subarray(0, recordBytes)).trim();
    recordBytes = 0;
    if (!text) return true;
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      throw new Error(`${options.label}: malformed JSONL record`);
    }
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
      throw new Error(`${options.label}: malformed JSONL record`);
    return options.onRecord(parsed);
  };
  const cancel = async () => {
    await reader.cancel().catch(() => {});
  };
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      let offset = 0;
      for (let index = 0; index < value.byteLength; index += 1) {
        if (value[index] !== 10) continue;
        appendRecordPart(value.subarray(offset, index));
        if (!emitRecord()) {
          await cancel();
          return;
        }
        offset = index + 1;
      }
      appendRecordPart(value.subarray(offset));
    }
    if (recordBytes > 0) emitRecord();
  } catch (error) {
    await cancel();
    throw error;
  } finally {
    reader.releaseLock();
  }
}
/** Apply one output line, collecting errors and successful embeddings by custom id. */
function applyEmbeddingBatchOutputLine(params) {
  const customId = params.line.custom_id;
  if (!customId) return;
  params.remaining.delete(customId);
  const errorMessage = params.line.error?.message;
  if (errorMessage) {
    params.errors.push(`${customId}: ${errorMessage}`);
    return;
  }
  const response = params.line.response;
  if ((response?.status_code ?? 0) >= 400) {
    const messageFromObject =
      response?.body && typeof response.body === "object" ? response.body.error?.message : void 0;
    const messageFromString = typeof response?.body === "string" ? response.body : void 0;
    params.errors.push(
      `${customId}: ${messageFromObject || messageFromString || response?.message || "unknown error"}`,
    );
    return;
  }
  const embedding =
    (response?.body && typeof response.body === "object" ? (response.body.data ?? []) : [])[0]
      ?.embedding ?? [];
  if (embedding.length === 0) {
    params.errors.push(`${customId}: empty embedding`);
    return;
  }
  params.byCustomId.set(customId, embedding);
}
//#endregion
//#region packages/memory-host-sdk/src/host/batch-provider-common.ts
/** OpenAI-compatible endpoint used inside embedding batch request lines. */
const EMBEDDING_BATCH_ENDPOINT = "/v1/embeddings";
//#endregion
//#region packages/memory-host-sdk/src/host/batch-utils.ts
/** Normalize batch API base URLs by removing one trailing slash. */
function normalizeBatchBaseUrl(client) {
  return client.baseUrl?.replace(/\/$/, "") ?? "";
}
/** Build request headers, preserving caller auth and controlling JSON/form content type. */
function buildBatchHeaders(client, params) {
  const headers = client.headers ? { ...client.headers } : {};
  if (params.json) {
    if (!headers["Content-Type"] && !headers["content-type"])
      headers["Content-Type"] = "application/json";
  } else {
    delete headers["Content-Type"];
    delete headers["content-type"];
  }
  return headers;
}
const jsonlEncoder = new TextEncoder();
function estimateJsonlLineBytes(request) {
  return jsonlEncoder.encode(JSON.stringify(request) ?? "").byteLength;
}
function normalizePositiveInteger(value) {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return;
  return Math.floor(value);
}
function splitBatchRequestsByLimits(requests, limits) {
  const maxRequests = normalizePositiveInteger(limits.maxRequests) ?? 1;
  const maxJsonlBytes = normalizePositiveInteger(limits.maxJsonlBytes);
  if (requests.length === 0) return maxJsonlBytes ? [] : [requests];
  const groups = [];
  let current = [];
  let currentBytes = 0;
  for (const request of requests) {
    const requestBytes = estimateJsonlLineBytes(request);
    const separatorBytes = current.length === 0 ? 0 : 1;
    const wouldExceedRequests = current.length >= maxRequests;
    const wouldExceedBytes =
      maxJsonlBytes !== void 0 &&
      current.length > 0 &&
      currentBytes + separatorBytes + requestBytes > maxJsonlBytes;
    if (current.length > 0 && (wouldExceedRequests || wouldExceedBytes)) {
      groups.push(current);
      current = [];
      currentBytes = 0;
    }
    currentBytes += (current.length === 0 ? 0 : 1) + requestBytes;
    current.push(request);
  }
  if (current.length > 0) groups.push(current);
  return groups;
}
//#endregion
//#region packages/memory-host-sdk/src/host/batch-runner.ts
/** Clamp polling to both configured poll interval and total timeout budget. */
function resolveEmbeddingBatchPollIntervalMs(params) {
  const safePollIntervalMs = resolveSafeTimeoutDelayMs(params.pollIntervalMs);
  const safeTimeoutMs =
    typeof params.timeoutMs === "number" &&
    Number.isFinite(params.timeoutMs) &&
    params.timeoutMs > 0
      ? resolveSafeTimeoutDelayMs(params.timeoutMs)
      : safePollIntervalMs;
  return Math.min(safePollIntervalMs, safeTimeoutMs);
}
/** Run request groups with bounded concurrency and return embeddings by custom id. */
async function runEmbeddingBatchGroups(params) {
  if (params.requests.length === 0) return /* @__PURE__ */ new Map();
  const groups = splitBatchRequestsByLimits(params.requests, {
    maxRequests: params.maxRequests,
    maxJsonlBytes: params.maxJsonlBytes,
  });
  const byCustomId = /* @__PURE__ */ new Map();
  const pollIntervalMs = resolveEmbeddingBatchPollIntervalMs(params);
  const runGroup = async (group, groupIndex, depth = 0) => {
    try {
      await params.runGroup({
        group,
        groupIndex,
        groups: groups.length,
        byCustomId,
        pollIntervalMs,
        timeoutMs: params.timeoutMs,
      });
    } catch (error) {
      if (group.length <= 1 || !params.shouldSplitGroupOnError?.(error, group)) throw error;
      const splitAt = Math.ceil(group.length / 2);
      const parts = [group.slice(0, splitAt), group.slice(splitAt)].filter(
        (part) => part.length > 0,
      );
      params.onSplitGroup?.({
        error,
        group,
        parts,
        groupIndex,
        groups: groups.length,
        depth,
      });
      for (const part of parts) await runGroup(part, groupIndex, depth + 1);
    }
  };
  const tasks = groups.map((group, groupIndex) => async () => {
    await runGroup(group, groupIndex);
  });
  params.debug?.(params.debugLabel, {
    requests: params.requests.length,
    groups: groups.length,
    maxRequests: params.maxRequests,
    maxJsonlBytes: params.maxJsonlBytes,
    wait: params.wait,
    concurrency: params.concurrency,
    pollIntervalMs,
    timeoutMs: params.timeoutMs,
  });
  await runMemoryHostTasksWithConcurrency(tasks, params.concurrency);
  return byCustomId;
}
/** Build normalized batch-group options for provider-specific runners. */
function buildEmbeddingBatchGroupOptions(params, options) {
  const pollIntervalMs = resolveEmbeddingBatchPollIntervalMs(params);
  return {
    requests: params.requests,
    maxRequests: options.maxRequests,
    maxJsonlBytes: options.maxJsonlBytes,
    wait: params.wait,
    pollIntervalMs,
    timeoutMs: params.timeoutMs,
    concurrency: params.concurrency,
    debug: params.debug,
    debugLabel: options.debugLabel,
  };
}
//#endregion
//#region packages/memory-host-sdk/src/host/batch-status.ts
const TERMINAL_FAILURE_STATES = /* @__PURE__ */ new Set([
  "failed",
  "expired",
  "cancelled",
  "canceled",
]);
/** Convert a completed provider status payload into output/error file ids. */
function resolveBatchCompletionFromStatus(params) {
  if (!params.status.output_file_id)
    throw new Error(`${params.provider} batch ${params.batchId} completed without output file`);
  return {
    outputFileId: params.status.output_file_id,
    errorFileId: params.status.error_file_id ?? void 0,
  };
}
/** Fail a completed partial/all-error batch before requiring its success file. */
async function throwIfBatchCompletionError(params) {
  if (params.status.status !== "completed" || !params.status.error_file_id) return;
  const detail = await params.readError(params.status.error_file_id);
  throw new Error(
    `${params.provider} batch ${params.status.id ?? "<unknown>"} completed: ${detail ?? "provider error file present"}`,
  );
}
/** Throw when a provider reports a terminal failure, including error-file detail if available. */
async function throwIfBatchTerminalFailure(params) {
  const state = params.status.status ?? "unknown";
  if (!TERMINAL_FAILURE_STATES.has(state)) return;
  const detail = params.status.error_file_id
    ? await params.readError(params.status.error_file_id)
    : void 0;
  const suffix = detail ? `: ${detail}` : "";
  throw new Error(`${params.provider} batch ${params.status.id ?? "<unknown>"} ${state}${suffix}`);
}
/** Resolve the completed batch files, optionally waiting according to caller policy. */
async function resolveCompletedBatchResult(params) {
  const batchId = params.status.id ?? "<unknown>";
  if (!params.wait && params.status.status !== "completed")
    throw new Error(
      `${params.provider} batch ${batchId} submitted; enable remote.batch.wait to await completion`,
    );
  const completed =
    params.status.status === "completed"
      ? resolveBatchCompletionFromStatus({
          provider: params.provider,
          batchId,
          status: params.status,
        })
      : await params.waitForBatch();
  if (!completed.outputFileId)
    throw new Error(`${params.provider} batch ${batchId} completed without output file`);
  return completed;
}
//#endregion
//#region packages/memory-host-sdk/src/host/batch-upload.ts
/** Upload embedding batch requests and return the provider file id. */
async function uploadBatchJsonlFile(params) {
  const baseUrl = normalizeBatchBaseUrl(params.client);
  const jsonl = params.requests.map((request) => JSON.stringify(request)).join("\n");
  const form = new FormData();
  form.append("purpose", "batch");
  form.append(
    "file",
    new Blob([jsonl], { type: "application/jsonl" }),
    `memory-embeddings.${hashText(String(Date.now()))}.jsonl`,
  );
  const filePayload = await withRemoteHttpResponse({
    url: `${baseUrl}/files`,
    ssrfPolicy: params.client.ssrfPolicy,
    fetchImpl: params.client.fetchImpl,
    signal: params.signal,
    init: {
      method: "POST",
      headers: buildBatchHeaders(params.client, { json: false }),
      body: form,
    },
    onResponse: async (fileRes) => {
      if (!fileRes.ok) {
        const text = await readMemoryHostResponseTextSnippet(fileRes, { signal: params.signal });
        throw new Error(`${params.errorPrefix}: ${fileRes.status} ${text}`);
      }
      return await readResponseJsonWithLimit(fileRes, {
        errorPrefix: params.errorPrefix,
        maxBytes: params.maxResponseBytes,
        signal: params.signal,
      });
    },
  });
  if (!filePayload.id) throw new Error(`${params.errorPrefix}: missing file id`);
  return filePayload.id;
}
//#endregion
//#region packages/memory-host-sdk/src/host/embedding-model-limits.ts
const DEFAULT_EMBEDDING_MAX_INPUT_TOKENS = 8192;
const DEFAULT_LOCAL_EMBEDDING_MAX_INPUT_TOKENS = 2048;
/** Resolve the effective embedding input limit for a provider. */
function resolveEmbeddingMaxInputTokens(provider) {
  if (typeof provider.maxInputTokens === "number") return provider.maxInputTokens;
  if (provider.id === "local") return DEFAULT_LOCAL_EMBEDDING_MAX_INPUT_TOKENS;
  return DEFAULT_EMBEDDING_MAX_INPUT_TOKENS;
}
//#endregion
//#region packages/memory-host-sdk/src/host/embedding-chunk-limits.ts
/**
 * Split text-only chunks to the provider's effective input limit.
 *
 * Structured multimodal chunks are preserved because only the provider can decide how to count
 * non-text parts.
 */
function enforceEmbeddingMaxInputTokens(provider, chunks, hardMaxInputTokens) {
  const providerMaxInputTokens = resolveEmbeddingMaxInputTokens(provider);
  const maxInputTokens =
    typeof hardMaxInputTokens === "number" && hardMaxInputTokens > 0
      ? Math.min(providerMaxInputTokens, hardMaxInputTokens)
      : providerMaxInputTokens;
  const out = [];
  for (const chunk of chunks) {
    if (hasNonTextEmbeddingParts(chunk.embeddingInput)) {
      out.push(chunk);
      continue;
    }
    if (estimateUtf8Bytes(chunk.text) <= maxInputTokens) {
      out.push(chunk);
      continue;
    }
    for (const text of splitTextToUtf8ByteLimit(chunk.text, maxInputTokens))
      out.push({
        startLine: chunk.startLine,
        endLine: chunk.endLine,
        text,
        hash: hashText(text),
        embeddingInput: { text },
      });
  }
  return out;
}
//#endregion
//#region packages/memory-host-sdk/src/host/embedding-provider-adapter-utils.ts
/** Detect missing API key errors from provider auth resolution. */
function isMissingEmbeddingApiKeyError(err) {
  return err instanceof Error && err.message.includes("No API key found for provider");
}
/** Return stable cache headers after removing provider-specific secret headers. */
function sanitizeEmbeddingCacheHeaders(headers, excludedHeaderNames) {
  const excluded = new Set(
    excludedHeaderNames.map((name) => normalizeLowercaseStringOrEmpty(name)),
  );
  return Object.entries(headers)
    .filter(([key]) => !excluded.has(normalizeLowercaseStringOrEmpty(key)))
    .toSorted(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => [key, value]);
}
/** Convert custom-id keyed batch embeddings back to request-index order. */
function mapBatchEmbeddingsByIndex(byCustomId, count) {
  const embeddings = [];
  for (let index = 0; index < count; index += 1)
    embeddings.push(byCustomId.get(String(index)) ?? []);
  return embeddings;
}
//#endregion
//#region packages/memory-host-sdk/src/host/embeddings-debug.ts
const debugEmbeddings = isTruthyEnvValue(process.env.OPENCLAW_DEBUG_MEMORY_EMBEDDINGS);
/** Write embedding debug metadata when OPENCLAW_DEBUG_MEMORY_EMBEDDINGS is enabled. */
function debugEmbeddingsLog(message, meta) {
  if (!debugEmbeddings) return;
  const suffix = meta ? ` ${JSON.stringify(meta)}` : "";
  process.stderr.write(`${message}${suffix}\n`);
}
/** Parse common truthy env values for debug toggles. */
function isTruthyEnvValue(value) {
  switch (normalizeLowercaseStringOrEmpty(value)) {
    case "1":
    case "on":
    case "true":
    case "yes":
      return true;
    default:
      return false;
  }
}
//#endregion
//#region packages/memory-host-sdk/src/host/embeddings-model-normalize.ts
/** Trim a configured model id, fall back when empty, and strip known prefixes. */
function normalizeEmbeddingModelWithPrefixes(params) {
  const trimmed = params.model.trim();
  if (!trimmed) return params.defaultModel;
  for (const prefix of params.prefixes)
    if (trimmed.startsWith(prefix)) return trimmed.slice(prefix.length);
  return trimmed;
}
//#endregion
//#region packages/memory-host-sdk/src/host/openclaw-runtime-auth.ts
/** Resolve a provider API key through the core model-auth runtime. */
const resolveApiKeyForProvider = async (...args) => {
  return (await import("./model-auth-C6PbJmme.js")).resolveApiKeyForProvider(...args);
};
//#endregion
//#region packages/memory-host-sdk/src/host/embeddings-remote-client.ts
/** Attribution headers for native OpenAI embedding calls. */
function resolveOpenClawAttributionHeaders() {
  const version = typeof process !== "undefined" ? process.env.OPENCLAW_VERSION?.trim() : void 0;
  return {
    originator: "openclaw",
    ...(version ? { version } : {}),
    "User-Agent": version ? `openclaw/${version}` : "openclaw",
  };
}
/** Detect the native OpenAI embeddings API route that accepts attribution headers. */
function isNativeOpenAIEmbeddingRoute(provider, baseUrl) {
  if (provider !== "openai") return false;
  try {
    return new URL(baseUrl).hostname.toLowerCase().replace(/\.+$/, "") === "api.openai.com";
  } catch {
    return false;
  }
}
/** Resolve base URL, bearer headers, header overrides, and SSRF policy for remote embeddings. */
async function resolveRemoteEmbeddingBearerClient(params) {
  const remote = params.options.remote;
  const remoteApiKey = resolveMemorySecretInputString({
    value: remote?.apiKey,
    path: "agents.*.memorySearch.remote.apiKey",
  });
  const remoteBaseUrl = normalizeOptionalString(remote?.baseUrl);
  const providerConfig = params.options.config.models?.providers?.[params.provider];
  const apiKey = remoteApiKey
    ? remoteApiKey
    : requireApiKey(
        await resolveApiKeyForProvider({
          provider: params.provider,
          cfg: params.options.config,
          agentDir: params.options.agentDir,
        }),
        params.provider,
      );
  const baseUrl =
    remoteBaseUrl || normalizeOptionalString(providerConfig?.baseUrl) || params.defaultBaseUrl;
  const headerOverrides = Object.assign({}, providerConfig?.headers, remote?.headers);
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
    ...headerOverrides,
  };
  if (isNativeOpenAIEmbeddingRoute(params.provider, baseUrl))
    Object.assign(headers, resolveOpenClawAttributionHeaders());
  return {
    baseUrl,
    headers,
    ssrfPolicy: buildRemoteBaseUrlPolicy(baseUrl),
  };
}
//#endregion
//#region packages/memory-host-sdk/src/host/embeddings-remote-fetch.ts
/** Narrow unknown JSON payloads to plain objects. */
function asRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value) ? value : void 0;
}
/** Build the common malformed embedding response error. */
function malformedEmbeddingResponse(errorPrefix) {
  return /* @__PURE__ */ new Error(`${errorPrefix}: malformed JSON response`);
}
/** Validate and return one finite embedding vector. */
function readEmbeddingVector(value, errorPrefix) {
  if (!Array.isArray(value)) throw malformedEmbeddingResponse(errorPrefix);
  for (const entry of value)
    if (typeof entry !== "number" || !Number.isFinite(entry))
      throw malformedEmbeddingResponse(errorPrefix);
  return value;
}
/** Resolve expected response count from the request body when input is an array. */
function resolveExpectedEmbeddingCount(body) {
  const input = asRecord(body)?.input;
  return Array.isArray(input) ? input.length : void 0;
}
/** POST an embedding request and return validated vectors in provider response order. */
async function fetchRemoteEmbeddingVectors(params) {
  return await postJson({
    url: params.url,
    headers: params.headers,
    ssrfPolicy: params.ssrfPolicy,
    fetchImpl: params.fetchImpl,
    signal: params.signal,
    body: params.body,
    errorPrefix: params.errorPrefix,
    parse: (payload) => {
      const root = asRecord(payload);
      if (!root || !Array.isArray(root.data)) throw malformedEmbeddingResponse(params.errorPrefix);
      const expectedCount = resolveExpectedEmbeddingCount(params.body);
      if (expectedCount !== void 0 && root.data.length !== expectedCount)
        throw malformedEmbeddingResponse(params.errorPrefix);
      return root.data.map((entry) => {
        const record = asRecord(entry);
        if (!record) throw malformedEmbeddingResponse(params.errorPrefix);
        return readEmbeddingVector(record.embedding, params.errorPrefix);
      });
    },
  });
}
//#endregion
//#region packages/memory-host-sdk/src/host/embeddings-remote-provider.ts
/** Create an EmbeddingProvider backed by a remote embeddings endpoint. */
function createRemoteEmbeddingProvider(params) {
  const { client } = params;
  const url = `${client.baseUrl.replace(/\/$/, "")}/embeddings`;
  const embed = async (input, signal) => {
    if (input.length === 0) return [];
    return await fetchRemoteEmbeddingVectors({
      url,
      headers: client.headers,
      ssrfPolicy: client.ssrfPolicy,
      fetchImpl: client.fetchImpl,
      signal,
      body: {
        model: client.model,
        input,
      },
      errorPrefix: params.errorPrefix,
    });
  };
  return {
    id: params.id,
    model: client.model,
    ...(typeof params.maxInputTokens === "number" ? { maxInputTokens: params.maxInputTokens } : {}),
    embedQuery: async (text, options) => {
      const [vec] = await embed([text], options?.signal);
      return vec ?? [];
    },
    embedBatch: async (texts, options) => await embed(texts, options?.signal),
  };
}
/** Resolve a normalized remote embedding client from provider config and model options. */
async function resolveRemoteEmbeddingClient(params) {
  const { baseUrl, headers, ssrfPolicy } = await resolveRemoteEmbeddingBearerClient({
    provider: params.provider,
    options: params.options,
    defaultBaseUrl: params.defaultBaseUrl,
  });
  return {
    baseUrl,
    headers,
    ssrfPolicy,
    model: params.normalizeModel(params.options.model),
  };
}
//#endregion
export {
  isEmbeddingBatchUnavailableError as A,
  postJsonWithRetry as C,
  extractBatchErrorMessage as D,
  EmbeddingBatchUnavailableError as E,
  formatBatchErrorDetail as O,
  readEmbeddingBatchJsonl as S,
  withRemoteHttpResponse as T,
  runEmbeddingBatchGroups as _,
  normalizeEmbeddingModelWithPrefixes as a,
  EMBEDDING_BATCH_ENDPOINT as b,
  mapBatchEmbeddingsByIndex as c,
  uploadBatchJsonlFile as d,
  resolveBatchCompletionFromStatus as f,
  buildEmbeddingBatchGroupOptions as g,
  throwIfBatchTerminalFailure as h,
  resolveRemoteEmbeddingBearerClient as i,
  formatUnavailableBatchError as k,
  sanitizeEmbeddingCacheHeaders as l,
  throwIfBatchCompletionError as m,
  resolveRemoteEmbeddingClient as n,
  debugEmbeddingsLog as o,
  resolveCompletedBatchResult as p,
  fetchRemoteEmbeddingVectors as r,
  isMissingEmbeddingApiKeyError as s,
  createRemoteEmbeddingProvider as t,
  enforceEmbeddingMaxInputTokens as u,
  buildBatchHeaders as v,
  buildRemoteBaseUrlPolicy as w,
  applyEmbeddingBatchOutputLine as x,
  normalizeBatchBaseUrl as y,
};
