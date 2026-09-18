import { s as readCodexModelListResponse } from "./protocol-validators-CfDblFS1.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
//#region extensions/codex/src/app-server/models.ts
/**
 * Lists and normalizes models exposed by the Codex app-server `model/list`
 * endpoint, including pagination and shared-client lease handling.
 */
/** Lists one Codex app-server model page using the configured auth/client options. */
async function listCodexAppServerModels(options = {}) {
  return await withCodexAppServerModelClient(options, async ({ client, timeoutMs }) =>
    requestModelListPage(client, {
      ...options,
      timeoutMs,
    }),
  );
}
/** Walks Codex app-server model pages until exhaustion or the max-page guard. */
async function listAllCodexAppServerModels(options = {}) {
  const maxPages = normalizeMaxPages(options.maxPages);
  return await withCodexAppServerModelClient(options, async ({ client, timeoutMs }) => {
    const models = [];
    let cursor = options.cursor;
    let nextCursor;
    for (let page = 0; page < maxPages; page += 1) {
      const result = await requestModelListPage(client, {
        ...options,
        timeoutMs,
        cursor,
      });
      models.push(...result.models);
      nextCursor = result.nextCursor;
      if (!nextCursor) return { models };
      cursor = nextCursor;
    }
    return {
      models,
      nextCursor,
      truncated: true,
    };
  });
}
async function withCodexAppServerModelClient(options, run) {
  const timeoutMs = options.timeoutMs ?? 2500;
  const useSharedClient = options.sharedClient !== false;
  const {
    createIsolatedCodexAppServerClient,
    getLeasedSharedCodexAppServerClient,
    releaseLeasedSharedCodexAppServerClient,
  } = await import("./shared-client-Bt7kZiNA.js");
  const client = useSharedClient
    ? await getLeasedSharedCodexAppServerClient({
        startOptions: options.startOptions,
        timeoutMs,
        authProfileId: options.authProfileId,
        agentDir: options.agentDir,
        config: options.config,
      })
    : await createIsolatedCodexAppServerClient({
        startOptions: options.startOptions,
        timeoutMs,
        authProfileId: options.authProfileId,
        agentDir: options.agentDir,
        config: options.config,
      });
  try {
    return await run({
      client,
      timeoutMs,
    });
  } finally {
    if (useSharedClient) releaseLeasedSharedCodexAppServerClient(client);
    else client.close();
  }
}
async function requestModelListPage(client, options) {
  return readModelListResult(
    await client.request(
      "model/list",
      {
        limit: options.limit ?? null,
        cursor: options.cursor ?? null,
        includeHidden: options.includeHidden ?? null,
      },
      { timeoutMs: options.timeoutMs },
    ),
  );
}
/** Parses a raw Codex app-server model/list response into OpenClaw's normalized shape. */
function readModelListResult(value) {
  const response = readCodexModelListResponse(value);
  if (!response) return { models: [] };
  const models = response.data
    .map((entry) => readCodexModel(entry))
    .filter((entry) => entry !== void 0);
  const nextCursor = response.nextCursor ?? void 0;
  return {
    models,
    ...(nextCursor ? { nextCursor } : {}),
  };
}
function readCodexModel(value) {
  const id = readNonEmptyString(value.id);
  const model = readNonEmptyString(value.model) ?? id;
  if (!id || !model) return;
  return {
    id,
    model,
    ...(readNonEmptyString(value.displayName)
      ? { displayName: readNonEmptyString(value.displayName) }
      : {}),
    ...(readNonEmptyString(value.description)
      ? { description: readNonEmptyString(value.description) }
      : {}),
    hidden: value.hidden,
    isDefault: value.isDefault,
    inputModalities: value.inputModalities,
    supportedReasoningEfforts: readReasoningEfforts(value.supportedReasoningEfforts),
    ...(readNonEmptyString(value.defaultReasoningEffort)
      ? { defaultReasoningEffort: readNonEmptyString(value.defaultReasoningEffort) }
      : {}),
  };
}
function readReasoningEfforts(value) {
  return uniqueStrings(
    value
      .map((entry) => readNonEmptyString(entry.reasoningEffort))
      .filter((entry) => entry !== void 0),
  );
}
function readNonEmptyString(value) {
  if (typeof value !== "string") return;
  return value.trim() || void 0;
}
function normalizeMaxPages(value) {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.floor(value) : 20;
}
//#endregion
export {
  listCodexAppServerModels as n,
  readModelListResult as r,
  listAllCodexAppServerModels as t,
};
