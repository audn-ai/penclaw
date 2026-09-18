import { createHash } from "node:crypto";
import { r as logVerbose } from "./globals-CNUzHTcU.js";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.js";
import { c as parseModelRef } from "./model-selection-normalize-BoKGJiBx.js";
import {
  d as openOpenClawAgentDatabase,
  f as runOpenClawAgentWriteTransaction,
} from "./openclaw-agent-db-VC51jrBW.js";
import "./defaults-CdX9UGcX.js";
import {
  L as executeSqliteQuerySync,
  z as getNodeSqliteKysely,
} from "./openclaw-state-db-Bsa8Tv1Z.js";
import { u as redactToolPayloadText } from "./redact-CUe6Oey5.js";
import {
  r as prepareSimpleCompletionModelForAgent,
  t as completeWithPreparedSimpleCompletionModel,
} from "./simple-completion-runtime-DThW6g7z.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
import { n as resolveUtilityModelRefForAgent } from "./utility-model-wOa6LPAB.js";
//#region src/gateway/chat-tool-titles.ts
/**
 * Cheap-model purpose titles for tool calls shown in the Control UI.
 *
 * Model selection delegates to the canonical utility-model resolver and
 * follows the platform-wide utilityModel contract: an explicit utilityModel
 * is an operator decision and may name any provider (exactly like session
 * titles, thread titles, and narration, which already send bounded session
 * content there); the AUTO-derived small-model default stays on the session's
 * own provider so no silent new egress destination appears; and an explicit
 * empty utilityModel disables titles entirely. Titles never fall through to
 * the (potentially expensive) primary model — callers get an empty result and
 * keep deterministic labels.
 *
 * Generated titles cache in the per-agent SQLite database (`cache_entries`,
 * scope below) keyed by a digest of tool name + input, so reopening a session
 * never re-bills the same calls.
 */
const TOOL_TITLE_CACHE_SCOPE = "tool-call-titles";
const TOOL_TITLES_MAX_ITEMS = 24;
const TOOL_TITLE_INPUT_MAX_CHARS = 2e3;
const TOOL_TITLE_MAX_CHARS = 72;
const TOOL_TITLES_MAX_TOKENS = 4096;
const TOOL_TITLES_TIMEOUT_MS = 2e4;
const TOOL_TITLES_SYSTEM_PROMPT = [
  "You label tool calls in a coding agent's activity feed.",
  "For each item, write a 3-8 word title describing the call's purpose in sentence case.",
  "Start with a past-tense verb such as Checked, Inspected, Installed, Listed.",
  "No trailing period, no quotes, no markdown.",
  'Respond with JSON only: {"titles":{"<id>":"<title>"}} covering every item id.',
].join(" ");
function cacheKeyFor(item) {
  return createHash("sha256").update(`${item.name}\0${item.input}`).digest("hex");
}
function normalizeItems(items) {
  const seen = /* @__PURE__ */ new Set();
  const normalized = [];
  for (const item of items) {
    if (normalized.length >= TOOL_TITLES_MAX_ITEMS) break;
    const id = item.id.trim();
    const name = item.name.trim();
    const input = truncateUtf16Safe(redactToolPayloadText(item.input), TOOL_TITLE_INPUT_MAX_CHARS);
    if (!id || !name || !input.trim() || seen.has(id)) continue;
    seen.add(id);
    normalized.push({
      id,
      name,
      input,
    });
  }
  return normalized;
}
function normalizeTitle(raw) {
  if (typeof raw !== "string") return null;
  const singleLine = raw
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^["'`]+|["'`.]+$/g, "");
  return singleLine ? truncateUtf16Safe(singleLine, TOOL_TITLE_MAX_CHARS) : null;
}
function parseTitlesResponse(text) {
  const stripped = text
    .replace(/^\s*```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/, "")
    .trim();
  const start = stripped.indexOf("{");
  const end = stripped.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    const parsed = JSON.parse(stripped.slice(start, end + 1));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    const titles = parsed.titles;
    if (!titles || typeof titles !== "object" || Array.isArray(titles)) return null;
    return titles;
  } catch {
    return null;
  }
}
function readCachedTitles(agentId, keysByItemId) {
  const cached = /* @__PURE__ */ new Map();
  if (keysByItemId.size === 0) return cached;
  try {
    const database = openOpenClawAgentDatabase({ agentId });
    const kysely = getNodeSqliteKysely(database.db);
    const keys = [...new Set(keysByItemId.values())];
    const rows = executeSqliteQuerySync(
      database.db,
      kysely
        .selectFrom("cache_entries")
        .select(["key", "value_json"])
        .where("scope", "=", TOOL_TITLE_CACHE_SCOPE)
        .where("key", "in", keys),
    ).rows;
    const titlesByKey = /* @__PURE__ */ new Map();
    for (const row of rows) {
      if (!row.value_json) continue;
      try {
        const title = normalizeTitle(JSON.parse(row.value_json));
        if (title) titlesByKey.set(row.key, title);
      } catch {}
    }
    for (const [itemId, key] of keysByItemId) {
      const title = titlesByKey.get(key);
      if (title) cached.set(itemId, title);
    }
  } catch (err) {
    logVerbose(`chat-tool-titles: cache read failed: ${String(err)}`);
  }
  return cached;
}
function writeCachedTitles(agentId, entries) {
  if (entries.size === 0) return;
  try {
    runOpenClawAgentWriteTransaction(
      (database) => {
        const kysely = getNodeSqliteKysely(database.db);
        const now = Date.now();
        for (const [key, title] of entries)
          executeSqliteQuerySync(
            database.db,
            kysely
              .insertInto("cache_entries")
              .values({
                scope: TOOL_TITLE_CACHE_SCOPE,
                key,
                value_json: JSON.stringify(title),
                blob: null,
                expires_at: null,
                updated_at: now,
              })
              .onConflict((oc) =>
                oc.columns(["scope", "key"]).doUpdateSet({
                  value_json: JSON.stringify(title),
                  updated_at: now,
                }),
              ),
          );
      },
      { agentId },
    );
  } catch (err) {
    logVerbose(`chat-tool-titles: cache write failed: ${String(err)}`);
  }
}
async function generateMissingTitles(params) {
  const generated = /* @__PURE__ */ new Map();
  if (params.items.length === 0) return generated;
  let prepared;
  try {
    prepared = await prepareSimpleCompletionModelForAgent({
      cfg: params.cfg,
      agentId: params.agentId,
      modelRef: params.modelRef,
      preferredProfile: params.sessionAuthProfile,
      useAsyncModelResolution: true,
      allowMissingApiKeyModes: ["aws-sdk"],
    });
  } catch (err) {
    logVerbose(`chat-tool-titles: model preparation failed: ${String(err)}`);
    return generated;
  }
  if ("error" in prepared) {
    logVerbose(`chat-tool-titles: ${prepared.error}`);
    return generated;
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TOOL_TITLES_TIMEOUT_MS);
  try {
    const result = await completeWithPreparedSimpleCompletionModel({
      model: prepared.model,
      auth: prepared.auth,
      cfg: params.cfg,
      context: {
        systemPrompt: TOOL_TITLES_SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: JSON.stringify({
              items: params.items.map((item, index) => ({
                id: String(index),
                tool: item.name,
                input: item.input,
              })),
            }),
            timestamp: Date.now(),
          },
        ],
      },
      options: {
        maxTokens: Math.min(TOOL_TITLES_MAX_TOKENS, Math.floor(prepared.model.maxTokens)),
        signal: controller.signal,
      },
    });
    if (result.stopReason === "error") {
      logVerbose(`chat-tool-titles: completion failed: ${result.errorMessage ?? "unknown error"}`);
      return generated;
    }
    const text = result.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("")
      .trim();
    const titles = text ? parseTitlesResponse(text) : null;
    if (!titles) return generated;
    params.items.forEach((item, index) => {
      const title = normalizeTitle(titles[String(index)]);
      if (title) generated.set(item.id, title);
    });
    return generated;
  } catch (err) {
    logVerbose(`chat-tool-titles: completion failed: ${String(err)}`);
    return generated;
  } finally {
    clearTimeout(timeout);
  }
}
/** Resolve purpose titles for tool calls: cache first, one batched cheap-model call for misses. */
async function generateToolCallTitles(params) {
  const items = normalizeItems(params.items);
  if (items.length === 0) return {};
  const resolvedRef = resolveUtilityModelRefForAgent({
    cfg: params.cfg,
    agentId: params.agentId,
    primaryProvider: params.sessionPrimaryProvider,
  });
  if (!resolvedRef) {
    logVerbose(
      "chat-tool-titles: utility routing is disabled or has no derived small-model default; skipping titles",
    );
    return {};
  }
  const strippedRef = splitTrailingAuthProfile(resolvedRef).model;
  if (!parseModelRef(strippedRef, params.sessionPrimaryProvider?.trim() || "openai")) {
    logVerbose(
      `chat-tool-titles: utility model ref ${JSON.stringify(resolvedRef)} is malformed; skipping titles`,
    );
    return {};
  }
  const modelRef = params.sessionAuthProfile
    ? `${strippedRef}@${params.sessionAuthProfile}`
    : resolvedRef;
  const keysByItemId = new Map(items.map((item) => [item.id, cacheKeyFor(item)]));
  const titles = readCachedTitles(params.agentId, keysByItemId);
  const missing = items.filter((item) => !titles.has(item.id));
  if (missing.length > 0) {
    const generated = await generateMissingTitles({
      cfg: params.cfg,
      agentId: params.agentId,
      modelRef,
      sessionAuthProfile: params.sessionAuthProfile,
      items: missing,
    });
    if (generated.size > 0) {
      const cacheWrites = /* @__PURE__ */ new Map();
      for (const [itemId, title] of generated) {
        titles.set(itemId, title);
        const key = keysByItemId.get(itemId);
        if (key) cacheWrites.set(key, title);
      }
      writeCachedTitles(params.agentId, cacheWrites);
    }
  }
  return Object.fromEntries(titles);
}
//#endregion
export { generateToolCallTitles };
