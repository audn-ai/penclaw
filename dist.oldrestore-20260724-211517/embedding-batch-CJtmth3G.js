import crypto from "node:crypto";
import "./provider-http-BDIltggC.js";
import { i as sanitizeAndNormalizeEmbedding } from "./embeddings-B6h5v7TW.js";
import { t as parseGeminiAuth } from "./gemini-auth-CDWMrlpW.js";
import {
  E as EmbeddingBatchUnavailableError,
  O as formatBatchErrorDetail,
  S as readEmbeddingBatchJsonl,
  T as withRemoteHttpResponse,
  _ as runEmbeddingBatchGroups,
  g as buildEmbeddingBatchGroupOptions,
  o as debugEmbeddingsLog,
  v as buildBatchHeaders,
  y as normalizeBatchBaseUrl,
} from "./memory-core-host-engine-embeddings-C-z4ELNB.js";
import {
  i as assertOkOrThrowProviderError,
  o as createProviderHttpError,
  p as readProviderJsonObjectResponse,
} from "./provider-http-errors-DLMRBkZU.js";
//#region extensions/google/embedding-batch.ts
const GEMINI_BATCH_MAX_REQUESTS = 5e4;
function bindGeminiBatchAuth(client) {
  const apiKey = client.apiKeys[0];
  if (!apiKey) throw new Error("gemini batch requires an API key");
  return {
    ...client,
    headers: {
      ...parseGeminiAuth(apiKey).headers,
      ...client.headers,
    },
  };
}
function hashText(text) {
  return crypto.createHash("sha256").update(text).digest("hex");
}
function getGeminiVersionedRouteBase(baseUrl, route) {
  const match = baseUrl.replace(/\/$/, "").match(/^(.*)\/(v\d+(?:alpha|beta)?)$/);
  return match ? `${match[1]}/${route}/${match[2]}` : null;
}
function getGeminiUploadUrl(baseUrl) {
  return getGeminiVersionedRouteBase(baseUrl, "upload") ?? `${baseUrl.replace(/\/$/, "")}/upload`;
}
function getGeminiDownloadUrl(baseUrl, fileId) {
  const file = fileId.startsWith("files/") ? fileId : `files/${fileId}`;
  const trimmed = baseUrl.replace(/\/$/, "");
  let officialGoogleOrigin = false;
  try {
    officialGoogleOrigin =
      new URL(trimmed).origin.toLowerCase() === "https://generativelanguage.googleapis.com";
  } catch {}
  return `${officialGoogleOrigin ? (getGeminiVersionedRouteBase(trimmed, "download") ?? trimmed) : trimmed}/${file}:download?alt=media`;
}
function getGeminiBatchState(operation) {
  const rawState = operation.metadata?.state?.replace(/^(?:BATCH|JOB)_STATE_/, "");
  if (rawState === "FAILED") return "failed";
  if (rawState === "CANCELLED" || rawState === "CANCELED") return "cancelled";
  if (rawState === "EXPIRED") return "expired";
  if (operation.error) return "failed";
  if (operation.done === false) return "pending";
  if (operation.done === true) return "succeeded";
  if (rawState === "SUCCEEDED") return "succeeded";
  if (rawState === "PENDING" || rawState === "RUNNING") return "pending";
  return "unknown";
}
function getGeminiBatchOutputFileId(operation) {
  const responseFile = operation.response?.responsesFile;
  const metadataFile = operation.metadata?.output?.responsesFile;
  if (responseFile && metadataFile && responseFile !== metadataFile)
    throw new Error("gemini batch operation returned conflicting output files");
  return responseFile ?? metadataFile;
}
function buildGeminiUploadBody(params) {
  const boundary = `openclaw-${hashText(params.displayName)}`;
  const jsonPart = JSON.stringify({
    file: {
      displayName: params.displayName,
      mimeType: "application/jsonl",
    },
  });
  const delimiter = `--${boundary}\r\n`;
  const closeDelimiter = `--${boundary}--\r\n`;
  const parts = [
    `${delimiter}Content-Type: application/json; charset=UTF-8\r\n\r\n${jsonPart}\r\n`,
    `${delimiter}Content-Type: application/jsonl; charset=UTF-8\r\n\r\n${params.jsonl}\r\n`,
    closeDelimiter,
  ];
  return {
    body: new Blob([parts.join("")], { type: "multipart/related" }),
    contentType: `multipart/related; boundary=${boundary}`,
  };
}
async function submitGeminiBatch(params) {
  const baseUrl = normalizeBatchBaseUrl(params.gemini);
  const uploadPayload = buildGeminiUploadBody({
    jsonl: params.requests
      .map((request) =>
        JSON.stringify({
          key: request.custom_id,
          request: request.request,
        }),
      )
      .join("\n"),
    displayName: `memory-embeddings-${hashText(String(Date.now()))}`,
  });
  const uploadUrl = `${getGeminiUploadUrl(baseUrl)}/files?uploadType=multipart`;
  debugEmbeddingsLog("memory embeddings: gemini batch upload", {
    uploadUrl,
    baseUrl,
    requests: params.requests.length,
  });
  const fileId = (
    await withRemoteHttpResponse({
      url: uploadUrl,
      ssrfPolicy: params.gemini.ssrfPolicy,
      init: {
        method: "POST",
        headers: {
          ...buildBatchHeaders(params.gemini, { json: false }),
          "Content-Type": uploadPayload.contentType,
        },
        body: uploadPayload.body,
      },
      onResponse: async (fileRes) => {
        await assertOkOrThrowProviderError(fileRes, "gemini.batch-file-upload");
        return await readProviderJsonObjectResponse(fileRes, "gemini.batch-file-upload");
      },
    })
  ).file?.name;
  if (!fileId) throw new Error("gemini batch file upload failed: missing file id");
  const batchBody = {
    batch: {
      displayName: `memory-embeddings-${params.agentId}`,
      inputConfig: { file_name: fileId },
    },
  };
  const batchEndpoint = `${baseUrl}/${params.gemini.modelPath}:asyncBatchEmbedContent`;
  debugEmbeddingsLog("memory embeddings: gemini batch create", {
    batchEndpoint,
    fileId,
  });
  return await withRemoteHttpResponse({
    url: batchEndpoint,
    ssrfPolicy: params.gemini.ssrfPolicy,
    init: {
      method: "POST",
      headers: buildBatchHeaders(params.gemini, { json: true }),
      body: JSON.stringify(batchBody),
    },
    onResponse: async (batchRes) => {
      if (batchRes.status === 404)
        throw new EmbeddingBatchUnavailableError(
          "gemini asyncBatchEmbedContent not available for this request",
          { cause: await createProviderHttpError(batchRes, "gemini.batch-create") },
        );
      await assertOkOrThrowProviderError(batchRes, "gemini.batch-create");
      return await readProviderJsonObjectResponse(batchRes, "gemini.batch-create");
    },
  });
}
async function fetchGeminiBatchStatus(params) {
  const statusUrl = `${normalizeBatchBaseUrl(params.gemini)}/${params.batchName.startsWith("batches/") ? params.batchName : `batches/${params.batchName}`}`;
  debugEmbeddingsLog("memory embeddings: gemini batch status", { statusUrl });
  return await withRemoteHttpResponse({
    url: statusUrl,
    ssrfPolicy: params.gemini.ssrfPolicy,
    init: { headers: buildBatchHeaders(params.gemini, { json: true }) },
    onResponse: async (res) => {
      await assertOkOrThrowProviderError(res, "gemini.batch-status");
      return await readProviderJsonObjectResponse(res, "gemini.batch-status");
    },
  });
}
function applyGeminiBatchOutputLine(params) {
  const customId = params.line.key ?? params.line.custom_id ?? params.line.request_id;
  if (!customId || !params.remaining.delete(customId)) return;
  const error = params.line.error?.message || params.line.response?.error?.message;
  if (error) {
    params.errors.push(`${customId}: ${error}`);
    return;
  }
  const embedding = sanitizeAndNormalizeEmbedding(
    params.line.embedding?.values ?? params.line.response?.embedding?.values ?? [],
  );
  if (embedding.length === 0) {
    params.errors.push(`${customId}: empty embedding`);
    return;
  }
  params.byCustomId.set(customId, embedding);
}
async function fetchGeminiBatchOutput(params) {
  const downloadUrl = getGeminiDownloadUrl(normalizeBatchBaseUrl(params.gemini), params.fileId);
  debugEmbeddingsLog("memory embeddings: gemini batch download", { downloadUrl });
  await withRemoteHttpResponse({
    url: downloadUrl,
    ssrfPolicy: params.gemini.ssrfPolicy,
    init: { headers: buildBatchHeaders(params.gemini, { json: true }) },
    onResponse: async (res) => {
      await assertOkOrThrowProviderError(res, "gemini.batch-file-content");
      await readEmbeddingBatchJsonl(res, {
        label: "gemini.batch-file-content",
        maxRecords: params.remaining.size,
        onRecord: (line) => {
          applyGeminiBatchOutputLine({
            line,
            remaining: params.remaining,
            errors: params.errors,
            byCustomId: params.byCustomId,
          });
          return params.errors.length === 0 && params.remaining.size > 0;
        },
      });
    },
  });
}
async function waitForGeminiBatch(params) {
  const start = Date.now();
  let current = params.initial;
  while (true) {
    const operation =
      current ??
      (await fetchGeminiBatchStatus({
        gemini: params.gemini,
        batchName: params.batchName,
      }));
    const state = getGeminiBatchState(operation);
    if (state === "succeeded") {
      const outputFileId = getGeminiBatchOutputFileId(operation);
      if (!outputFileId)
        throw new Error(`gemini batch ${params.batchName} completed without output file`);
      return { outputFileId };
    }
    if (state === "failed" || state === "cancelled" || state === "expired") {
      const rawMessage =
        operation.error?.message ??
        (operation.error?.code === void 0 ? "unknown error" : `code ${operation.error.code}`);
      throw new Error(
        `gemini batch ${params.batchName} ${state}: ${formatBatchErrorDetail(rawMessage) ?? "unknown error"}`,
      );
    }
    if (!params.wait)
      throw new Error(
        `gemini batch ${params.batchName} submitted; enable remote.batch.wait to await completion`,
      );
    if (Date.now() - start > params.timeoutMs)
      throw new Error(`gemini batch ${params.batchName} timed out after ${params.timeoutMs}ms`);
    params.debug?.(`gemini batch ${params.batchName} ${state}; waiting ${params.pollIntervalMs}ms`);
    await new Promise((resolve) => {
      setTimeout(resolve, params.pollIntervalMs);
    });
    current = void 0;
  }
}
async function runGeminiEmbeddingBatches(params) {
  const gemini = bindGeminiBatchAuth(params.gemini);
  return await runEmbeddingBatchGroups({
    ...buildEmbeddingBatchGroupOptions(params, {
      maxRequests: GEMINI_BATCH_MAX_REQUESTS,
      debugLabel: "memory embeddings: gemini batch submit",
    }),
    runGroup: async ({ group, groupIndex, groups, byCustomId, pollIntervalMs, timeoutMs }) => {
      const batchInfo = await submitGeminiBatch({
        gemini,
        requests: group,
        agentId: params.agentId,
      });
      const batchName = batchInfo.name ?? "";
      if (!batchName) throw new Error("gemini batch create failed: missing batch name");
      params.debug?.("memory embeddings: gemini batch created", {
        batchName,
        state: getGeminiBatchState(batchInfo),
        group: groupIndex + 1,
        groups,
        requests: group.length,
      });
      const completed = await waitForGeminiBatch({
        gemini,
        batchName,
        wait: params.wait,
        pollIntervalMs,
        timeoutMs,
        debug: params.debug,
        initial: batchInfo,
      });
      const errors = [];
      const remaining = new Set(group.map((request) => request.custom_id));
      await fetchGeminiBatchOutput({
        gemini,
        fileId: completed.outputFileId,
        remaining,
        errors,
        byCustomId,
      });
      if (errors.length > 0)
        throw new Error(
          `gemini batch ${batchName} failed: ${formatBatchErrorDetail(errors[0]) ?? "unknown error"}`,
        );
      if (remaining.size > 0)
        throw new Error(`gemini batch ${batchName} missing ${remaining.size} embedding responses`);
    },
  });
}
//#endregion
export { runGeminiEmbeddingBatches as t };
