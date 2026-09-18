import { d as readResponseWithLimit } from "./http-body-aoMvQQlg.js";
import {
  C as postJsonWithRetry,
  D as extractBatchErrorMessage,
  O as formatBatchErrorDetail,
  S as readEmbeddingBatchJsonl,
  T as withRemoteHttpResponse,
  _ as runEmbeddingBatchGroups,
  b as EMBEDDING_BATCH_ENDPOINT,
  d as uploadBatchJsonlFile,
  f as resolveBatchCompletionFromStatus,
  g as buildEmbeddingBatchGroupOptions,
  h as throwIfBatchTerminalFailure,
  k as formatUnavailableBatchError,
  m as throwIfBatchCompletionError,
  p as resolveCompletedBatchResult,
  v as buildBatchHeaders,
  x as applyEmbeddingBatchOutputLine,
  y as normalizeBatchBaseUrl,
} from "./memory-core-host-engine-embeddings-C-z4ELNB.js";
import {
  i as assertOkOrThrowProviderError,
  m as readProviderJsonResponse,
} from "./provider-http-errors-DLMRBkZU.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./response-limit-runtime-B_DBKaLw.js";
import "./provider-http-BDIltggC.js";
import { l as normalizeStringEntries } from "./string-normalization-CRyoFBPt.js";
//#region extensions/voyage/embedding-batch.ts
const VOYAGE_BATCH_ENDPOINT = EMBEDDING_BATCH_ENDPOINT;
const VOYAGE_BATCH_COMPLETION_WINDOW = "12h";
const VOYAGE_BATCH_MAX_REQUESTS = 5e4;
const VOYAGE_BATCH_RESPONSE_MAX_BYTES = 16 * 1024 * 1024;
function resolveVoyageBatchDeps(overrides) {
  return {
    now: overrides?.now ?? Date.now,
    sleep:
      overrides?.sleep ??
      (async (ms) =>
        await new Promise((resolve) => {
          setTimeout(resolve, ms);
        })),
    postJsonWithRetry: overrides?.postJsonWithRetry ?? postJsonWithRetry,
    uploadBatchJsonlFile: overrides?.uploadBatchJsonlFile ?? uploadBatchJsonlFile,
    withRemoteHttpResponse: overrides?.withRemoteHttpResponse ?? withRemoteHttpResponse,
  };
}
function buildVoyageBatchRequest(params) {
  return {
    url: `${normalizeBatchBaseUrl(params.client)}/${params.path}`,
    ssrfPolicy: params.client.ssrfPolicy,
    init: { headers: buildBatchHeaders(params.client, { json: true }) },
    onResponse: params.onResponse,
  };
}
async function submitVoyageBatch(params) {
  const baseUrl = normalizeBatchBaseUrl(params.client);
  const inputFileId = await params.deps.uploadBatchJsonlFile({
    client: params.client,
    requests: params.requests,
    errorPrefix: "voyage batch file upload failed",
  });
  return await params.deps.postJsonWithRetry({
    url: `${baseUrl}/batches`,
    headers: buildBatchHeaders(params.client, { json: true }),
    ssrfPolicy: params.client.ssrfPolicy,
    body: {
      input_file_id: inputFileId,
      endpoint: VOYAGE_BATCH_ENDPOINT,
      completion_window: VOYAGE_BATCH_COMPLETION_WINDOW,
      request_params: {
        model: params.client.model,
        input_type: "document",
      },
      metadata: {
        source: "clawdbot-memory",
        agent: params.agentId,
      },
    },
    errorPrefix: "voyage batch create failed",
  });
}
async function fetchVoyageBatchStatus(params) {
  const maxBytes = params.maxResponseBytes ?? VOYAGE_BATCH_RESPONSE_MAX_BYTES;
  return await params.deps.withRemoteHttpResponse(
    buildVoyageBatchRequest({
      client: params.client,
      path: `batches/${params.batchId}`,
      onResponse: async (res) => {
        await assertOkOrThrowProviderError(res, "voyage.batch-status");
        return await readProviderJsonResponse(res, "voyage-batch-status", { maxBytes });
      },
    }),
  );
}
async function readVoyageBatchError(params) {
  const maxBytes = params.maxResponseBytes ?? VOYAGE_BATCH_RESPONSE_MAX_BYTES;
  try {
    return await params.deps.withRemoteHttpResponse(
      buildVoyageBatchRequest({
        client: params.client,
        path: `files/${params.errorFileId}/content`,
        onResponse: async (res) => {
          await assertOkOrThrowProviderError(res, "voyage.batch-error-file-content");
          const bytes = await readResponseWithLimit(res, maxBytes, {
            onOverflow: ({ maxBytes: maxBytesLocal }) =>
              /* @__PURE__ */ new Error(
                `voyage batch error file content exceeds ${maxBytesLocal} bytes`,
              ),
          });
          const text = new TextDecoder().decode(bytes);
          if (!text.trim()) return;
          return formatBatchErrorDetail(
            extractBatchErrorMessage(
              normalizeStringEntries(text.split("\n")).map((line) => JSON.parse(line)),
            ),
          );
        },
      }),
    );
  } catch (err) {
    return formatUnavailableBatchError(err);
  }
}
async function waitForVoyageBatch(params) {
  const start = params.deps.now();
  let current = params.initial;
  while (true) {
    const status =
      current ??
      (await fetchVoyageBatchStatus({
        client: params.client,
        batchId: params.batchId,
        deps: params.deps,
      }));
    const state = status.status ?? "unknown";
    await throwIfBatchCompletionError({
      provider: "voyage",
      status: {
        ...status,
        id: params.batchId,
      },
      readError: async (errorFileId) =>
        await readVoyageBatchError({
          client: params.client,
          errorFileId,
          deps: params.deps,
        }),
    });
    if (state === "completed")
      return resolveBatchCompletionFromStatus({
        provider: "voyage",
        batchId: params.batchId,
        status,
      });
    await throwIfBatchTerminalFailure({
      provider: "voyage",
      status: {
        ...status,
        id: params.batchId,
      },
      readError: async (errorFileId) =>
        await readVoyageBatchError({
          client: params.client,
          errorFileId,
          deps: params.deps,
        }),
    });
    if (!params.wait)
      throw new Error(`voyage batch ${params.batchId} still ${state}; wait disabled`);
    if (params.deps.now() - start > params.timeoutMs)
      throw new Error(`voyage batch ${params.batchId} timed out after ${params.timeoutMs}ms`);
    params.debug?.(`voyage batch ${params.batchId} ${state}; waiting ${params.pollIntervalMs}ms`);
    await params.deps.sleep(params.pollIntervalMs);
    current = void 0;
  }
}
async function runVoyageEmbeddingBatches(params) {
  const deps = resolveVoyageBatchDeps(params.deps);
  return await runEmbeddingBatchGroups({
    ...buildEmbeddingBatchGroupOptions(params, {
      maxRequests: VOYAGE_BATCH_MAX_REQUESTS,
      debugLabel: "memory embeddings: voyage batch submit",
    }),
    runGroup: async ({ group, groupIndex, groups, byCustomId, pollIntervalMs, timeoutMs }) => {
      const batchInfo = await submitVoyageBatch({
        client: params.client,
        requests: group,
        agentId: params.agentId,
        deps,
      });
      if (!batchInfo.id) throw new Error("voyage batch create failed: missing batch id");
      const batchId = batchInfo.id;
      params.debug?.("memory embeddings: voyage batch created", {
        batchId: batchInfo.id,
        status: batchInfo.status,
        group: groupIndex + 1,
        groups,
        requests: group.length,
      });
      await throwIfBatchCompletionError({
        provider: "voyage",
        status: batchInfo,
        readError: async (errorFileId) =>
          await readVoyageBatchError({
            client: params.client,
            errorFileId,
            deps,
          }),
      });
      const completed = await resolveCompletedBatchResult({
        provider: "voyage",
        status: batchInfo,
        wait: params.wait,
        waitForBatch: async () =>
          await waitForVoyageBatch({
            client: params.client,
            batchId,
            wait: params.wait,
            pollIntervalMs,
            timeoutMs,
            debug: params.debug,
            initial: batchInfo,
            deps,
          }),
      });
      const baseUrl = normalizeBatchBaseUrl(params.client);
      const errors = [];
      const remaining = new Set(group.map((request) => request.custom_id));
      await deps.withRemoteHttpResponse({
        url: `${baseUrl}/files/${completed.outputFileId}/content`,
        ssrfPolicy: params.client.ssrfPolicy,
        init: { headers: buildBatchHeaders(params.client, { json: true }) },
        onResponse: async (contentRes) => {
          await assertOkOrThrowProviderError(contentRes, "voyage.batch-file-content");
          await readEmbeddingBatchJsonl(contentRes, {
            label: "voyage.batch-file-content",
            maxRecords: group.length,
            onRecord: (line) => {
              if (line.custom_id && remaining.has(line.custom_id))
                applyEmbeddingBatchOutputLine({
                  line,
                  remaining,
                  errors,
                  byCustomId,
                });
              return errors.length === 0 && remaining.size > 0;
            },
          });
        },
      });
      if (errors.length > 0)
        throw new Error(
          `voyage batch ${batchInfo.id} failed: ${formatBatchErrorDetail(errors[0]) ?? "unknown error"}`,
        );
      if (remaining.size > 0)
        throw new Error(
          `voyage batch ${batchInfo.id} missing ${remaining.size} embedding responses`,
        );
    },
  });
}
const testing = {
  fetchVoyageBatchStatus,
  readVoyageBatchError,
  VOYAGE_BATCH_RESPONSE_MAX_BYTES,
};
//#endregion
export { testing as n, runVoyageEmbeddingBatches as t };
