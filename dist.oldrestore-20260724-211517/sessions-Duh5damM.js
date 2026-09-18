import { execSync, spawnSync } from "node:child_process";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { EventEmitter } from "node:events";
import * as fs$2 from "node:fs";
import "./parse-finite-number-Z7n6tXLk.js";
import "./errors-BoHeli7m.js";
import {
  chmodSync,
  constants,
  copyFileSync,
  createWriteStream,
  existsSync,
  globSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  realpathSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { access, mkdir, open, readFile, stat, writeFile } from "node:fs/promises";
import "./number-coercion-EqFmHmOw.js";
import { createRequire } from "node:module";
import * as os$1 from "node:os";
import "./replace-file-CaPU6XwS.js";
import { arch, homedir, platform, tmpdir } from "node:os";
import * as path$1 from "node:path";
import path, { basename, dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { createInterface } from "node:readline";
import { Readable, Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import "./archive-CBe_wA_B.js";
import "./defaults-CdX9UGcX.js";
import {
  Box,
  Container,
  Spacer,
  Text,
  getCapabilities,
  getImageDimensions,
  getKeybindings,
  imageFallback,
  truncateToWidth,
} from "@earendil-works/pi-tui";
import "./store-CzZJhTF6.js";
import { parseRetryAfterHttpDateMs } from "@openclaw/ai/internal/retry-after";
import {
  clampThinkingLevel,
  cleanupSessionResources,
  defaultApiRegistry,
  findEnvKeys,
  getEnvApiKey,
  getSupportedThinkingLevels,
  isContextOverflow,
  modelsAreEqual,
  registerApiProvider,
} from "@openclaw/ai/internal/runtime";
import { resetApiProviders } from "@openclaw/ai/providers";
import chalk from "chalk";
import * as Diff from "diff";
import hostedGitInfo from "hosted-git-info";
import ignore from "ignore";
import { minimatch } from "minimatch";
import milliseconds from "ms";
import lockfile from "proper-lockfile";
import * as bundledTypebox from "typebox";
import { Type } from "typebox";
import * as bundledTypeboxCompile from "typebox/compile";
import { Compile } from "typebox/compile";
import * as bundledTypeboxFormat from "typebox/format";
import "./common-DyDSUect.js";
import * as bundledTypeboxValue from "typebox/value";
import { parse } from "yaml";
import {
  A as findTurnStartIndex,
  C as prepareBranchEntries,
  D as estimateContextTokens,
  E as compact$1,
  F as serializeConversation,
  M as getLastAssistantUsage,
  N as prepareCompaction$1,
  O as estimateTokens,
  P as shouldCompact,
  S as generateBranchSummary$1,
  T as calculateContextTokens,
  W as convertToLlm,
  a as DEFAULT_MAX_LINES,
  c as truncateHead,
  i as DEFAULT_MAX_BYTES,
  j as generateSummary$1,
  k as findCutPoint,
  l as truncateLine,
  n as openClawAgentCoreRuntime,
  s as formatSize,
  t as Agent,
  u as truncateTail,
  v as parseCommandArgs,
  w as DEFAULT_COMPACTION_SETTINGS,
  x as collectEntriesForBranchSummaryFromBranches,
  y as substituteArgs,
} from "./agent-core-DJCbl_Iw.js";
import { t as extractArchive } from "./archive-CR1500gV.js";
import { n as extractLeadingHttpStatus } from "./assistant-error-format-G5Se-DL7.js";
import {
  a as getBinDir,
  c as getReadmePath,
  i as getAgentDir,
  n as CONFIG_DIR_NAME,
  o as getDocsPath,
  r as VERSION,
  s as getExamplesPath,
  t as APP_NAME,
  u as isBunBinary,
} from "./config-DSj7k-uT.js";
import {
  I as canonicalizePath,
  L as formatPathRelativeToCwdOrAbsolute,
  R as isLocalPath,
  t as getArchivedSkillFiles,
} from "./curator-BbVbrcMR.js";
import { t as mergeDeep } from "./deep-merge-DH7N3urv.js";
import { r as toErrorObject } from "./error-coercion-CrJRoLe1.js";
import { l as releaseChildProcessOutputAfterExit, o as spawnCommand } from "./exec-CXKmx4dL.js";
import { r as fetchWithSsrFGuard } from "./fetch-guard-Da47iiZE.js";
import { i as formatDurationSeconds } from "./format-duration-DKk9BtRb.js";
import { t as extractFrontmatterBlock } from "./frontmatter-CnpRhrvE.js";
import { t as decodeHtmlEntities } from "./html-entities-CvDVeY8C.js";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.js";
import { t as killProcessTree } from "./kill-tree-Cr15jS_s.js";
import { t as levenshteinDistance } from "./levenshtein-distance-BhvGlW0t.js";
import { n as appendBoundedTextTail, r as normalizePositiveLimit } from "./limits-BHHfzS4A.js";
import { l as llm_exports } from "./llm-CMBgEkcN.js";
import {
  n as classifyMediaReferenceSource,
  o as resolveMediaReferenceLocalPath,
  r as normalizeMediaReferenceSource,
} from "./media-reference-Cboth956.js";
import { c as convertImageToPng, l as createImageProcessor } from "./media-services-Czws84B5.js";
import { t as resolveModelPluginMetadataSnapshot } from "./model-discovery-context-B688uj_v.js";
import {
  D as resolveIntegerOption,
  j as resolveTimerTimeoutMs,
  y as parseStrictNonNegativeInteger,
} from "./number-coercion-CJQ8TR--.js";
import {
  a as resetOAuthProviders,
  i as registerOAuthProvider,
  n as getOAuthProvider,
  r as getOAuthProviders,
  t as getOAuthApiKey,
} from "./oauth-C291iY27.js";
import { n as resolveToCwd, t as resolveReadPath } from "./path-utils-CMJImZDW.js";
import {
  a as isGeneratedPluginModelCatalog,
  i as filterGeneratedPluginModelCatalogProviders,
  s as listPluginModelCatalogFiles,
} from "./plugin-model-catalog-BJCkxvM0.js";
import { a as installOpenClawInternalCorePackageNativeResolver } from "./plugin-module-loader-cache-CDpLvLFE.js";
import { n as replaceFileAtomicSync } from "./replace-file-DfwQ8_Mi.js";
import { r as __exportAll } from "./rolldown-runtime-DE1ahGrs.js";
import {
  n as buildPluginLoaderJitiOptions,
  t as buildPluginLoaderAliasMap,
} from "./sdk-alias-huj8Ygt2.js";
import {
  a as getLatestCompactionEntry,
  c as normalizeLoadedFileEntry,
  f as runtime_exports,
  i as getDefaultSessionDir,
  l as parseSessionEntries,
  n as buildSessionContext,
  o as loadEntriesFromFile,
  r as findMostRecentSession,
  s as migrateSessionEntries,
  t as SessionManager,
} from "./session-manager-BD4l9VJc.js";
import {
  a as killProcessTree$1,
  i as getShellEnv,
  n as getBashShellConfig,
  o as sanitizeBinaryOutput,
} from "./shell-utils-MIUiOyvx.js";
import {
  i as createSyntheticSourceInfo,
  n as formatSkillsForPrompt$1,
  r as createSourceInfo,
  t as computeSkillPromptVersion,
} from "./skill-version-Ait_lsND.js";
import { a as decodeWindowsTextFileBuffer } from "./spawn-utils-56OFmOgi.js";
import { i as streamSimple } from "./stream-DzNMuPw6.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
import { s as resolveThinkingDefaultForModel } from "./thinking-CVcRbjTC.js";
import { n as textResult } from "./tool-results-BCM3fdVS.js";
import { n as sliceUtf16Safe, r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region src/llm/utils/rate-limit-window.ts
const LONG_WINDOW_RATE_LIMIT_RE =
  /\b(?:daily|weekly|monthly|tokens per day|requests per day|usage limit|subscription|insufficient[_ -]?quota|current quota|quota[_ -]?exceeded|quota exceeded)\b/i;
const SHORT_RATE_LIMIT_UNIT_RE =
  /\b(?:requests per minute|tokens per minute|per-minute|rpm|tpm)\b/i;
const SHORT_WINDOW_RATE_LIMIT_RE =
  /\b(?:requests per minute|tokens per minute|per-minute|rpm|tpm|model_cooldown)\b|请求过于频繁|调用频率|频率限制/i;
const RETRY_AFTER_VALUE_RE = /\bretry[- ]after\b\s*:?\s*(?:in\s*)?([^\r\n;]+)/i;
const RETRY_AFTER_NUMBER_RE = /^(\d+(?:\.\d+)?)\s*([a-z]+)?\b/i;
const MAX_SHORT_WINDOW_RETRY_AFTER_SECONDS = 60;
function parseRetryAfterSeconds(valueText, nowMs) {
  const secondsMatch = RETRY_AFTER_NUMBER_RE.exec(valueText);
  if (secondsMatch?.[1]) {
    const value = Number(secondsMatch[1]);
    if (!Number.isFinite(value) || value < 0) return;
    const unit = secondsMatch[2]?.toLowerCase();
    if (
      unit &&
      !/^(?:milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d)$/.test(
        unit,
      )
    )
      return;
    const unitMilliseconds = milliseconds(`1${unit ?? "s"}`);
    return unitMilliseconds === 1 ? value / 1e3 : value * (unitMilliseconds / 1e3);
  }
  const retryAtMs = parseRetryAfterHttpDateMs(valueText, nowMs);
  return retryAtMs === void 0 ? void 0 : Math.max(0, (retryAtMs - nowMs) / 1e3);
}
/** Classifies provider rate-limit text without deciding a caller's retry policy. */
function classifyRateLimitWindow(message, nowMs = Date.now()) {
  const raw = message?.trim();
  if (!raw) return { kind: "unknown" };
  const hasShortRateLimitUnit = SHORT_RATE_LIMIT_UNIT_RE.test(raw);
  const retryAfterValue = RETRY_AFTER_VALUE_RE.exec(raw)?.[1]?.trim();
  const retryAfterSeconds = retryAfterValue
    ? parseRetryAfterSeconds(retryAfterValue, nowMs)
    : void 0;
  if (retryAfterSeconds !== void 0) {
    if (retryAfterSeconds > MAX_SHORT_WINDOW_RETRY_AFTER_SECONDS) return { kind: "long" };
    return {
      kind: "short",
      retryAfterSeconds,
    };
  }
  if (retryAfterValue && !hasShortRateLimitUnit) return { kind: "long" };
  if (LONG_WINDOW_RATE_LIMIT_RE.test(raw) && !hasShortRateLimitUnit) return { kind: "long" };
  if (SHORT_WINDOW_RATE_LIMIT_RE.test(raw) || extractLeadingHttpStatus(raw)?.code === 429)
    return { kind: "short" };
  return { kind: "unknown" };
}
//#endregion
//#region src/llm/utils/retry.ts
function buildProviderErrorPattern(patterns) {
  return new RegExp(patterns.join("|"), "i");
}
const NON_RETRYABLE_PROVIDER_LIMIT_ERROR_PATTERN = buildProviderErrorPattern([
  "GoUsageLimitError",
  "FreeUsageLimitError",
  "Monthly usage limit reached",
  "available balance",
  "insufficient_quota",
  "out of budget",
]);
const RETRYABLE_HTTP_STATUS_CODES = /* @__PURE__ */ new Set([429, 500, 502, 503, 504]);
const RATE_LIMIT_CONTEXT_PATTERN = buildProviderErrorPattern([
  "rate.?limit",
  "too many requests",
  "resource_exhausted",
  "daily (?:request|usage) limit",
  "requests? per day",
  "tokens? per day",
  "quota[_ -]?exceeded",
  "quota exceeded",
]);
const RETRYABLE_PROVIDER_ERROR_PATTERN = buildProviderErrorPattern([
  "overloaded",
  "rate.?limit",
  "too many requests",
  "service.?unavailable",
  "server.?error",
  "internal.?error",
  "provider.?returned.?error",
  "network.?error",
  "connection.?error",
  "connection.?refused",
  "connection.?lost",
  "other side closed",
  "fetch failed",
  "upstream.?connect",
  "reset before headers",
  "socket hang up",
  "timed? out",
  "timeout",
  "terminated",
  "websocket.?closed",
  "websocket.?error",
  "ended without",
  "stream ended before message_stop",
  "http2 request did not get a response",
  "retry delay",
  "you can retry your request",
  "try your request again",
  "please retry your request",
]);
/** Classify transient provider/transport failures for outer retry policy. */
function isRetryableAssistantError(message) {
  if (message.stopReason !== "error" || !message.errorMessage) return false;
  const errorMessage = message.errorMessage.trim();
  if (NON_RETRYABLE_PROVIDER_LIMIT_ERROR_PATTERN.test(errorMessage)) return false;
  const status = extractLeadingHttpStatus(errorMessage)?.code;
  if (status && status !== 429 && RETRYABLE_HTTP_STATUS_CODES.has(status)) return true;
  if (
    (status === 429 || RATE_LIMIT_CONTEXT_PATTERN.test(errorMessage)) &&
    classifyRateLimitWindow(errorMessage).kind === "long"
  )
    return false;
  if (status === 429) return true;
  return RETRYABLE_PROVIDER_ERROR_PATTERN.test(errorMessage);
}
//#endregion
//#region src/sessions/user-turn-transcript-runtime-context.ts
const RUNTIME_USER_TURN_TRANSCRIPT_CONTEXT = Symbol.for(
  "openclaw.runtimeUserTurnTranscriptContext",
);
const RUNTIME_USER_TURN_TRANSCRIPT_RECORDER = Symbol.for(
  "openclaw.runtimeUserTurnTranscriptRecorder",
);
/** Carries transcript-only fields with a queued runtime message without exposing them to the model. */
function attachRuntimeUserTurnTranscriptContext(runtimeMessage, context) {
  Object.defineProperty(runtimeMessage, RUNTIME_USER_TURN_TRANSCRIPT_CONTEXT, {
    configurable: true,
    value: context,
  });
  return runtimeMessage;
}
/** Consumes the transient queued-turn context before the message is serialized. */
function takeRuntimeUserTurnTranscriptContext(runtimeMessage) {
  const record = runtimeMessage;
  const context = record[RUNTIME_USER_TURN_TRANSCRIPT_CONTEXT];
  if (context) delete record[RUNTIME_USER_TURN_TRANSCRIPT_CONTEXT];
  return context;
}
/** Keeps the queued recorder attached to the exact final message until persistence succeeds. */
function attachRuntimeUserTurnTranscriptRecorder(runtimeMessage, recorder) {
  Object.defineProperty(runtimeMessage, RUNTIME_USER_TURN_TRANSCRIPT_RECORDER, {
    configurable: true,
    value: recorder,
  });
  return runtimeMessage;
}
function takeRuntimeUserTurnTranscriptRecorder(runtimeMessage) {
  const record = runtimeMessage;
  const recorder = record[RUNTIME_USER_TURN_TRANSCRIPT_RECORDER];
  if (recorder) delete record[RUNTIME_USER_TURN_TRANSCRIPT_RECORDER];
  return recorder;
}
//#endregion
//#region src/agents/utils/frontmatter.ts
/**
 * YAML frontmatter parsing helpers.
 *
 * Agent docs/tools use this to split optional Markdown frontmatter from the
 * body while preserving normal content when no complete frontmatter fence exists.
 */
const normalizeNewlines = (value) => value.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
/** Parses optional YAML frontmatter from Markdown-like content. */
const parseFrontmatter = (content) => {
  const normalized = normalizeNewlines(content);
  const extracted = extractFrontmatterBlock(normalized);
  if (!extracted)
    return {
      frontmatter: {},
      body: normalized,
    };
  return {
    frontmatter: parse(extracted.block) ?? {},
    body: extracted.body.trim(),
  };
};
/** Removes YAML frontmatter from content when a complete frontmatter block exists. */
const stripFrontmatter = (content) => parseFrontmatter(content).body;
//#endregion
//#region src/agents/utils/sleep.ts
/**
 * Sleep helper that respects abort signal.
 */
function sleep(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(/* @__PURE__ */ new Error("Aborted"));
      return;
    }
    const onAbort = () => {
      clearTimeout(timeout);
      reject(/* @__PURE__ */ new Error("Aborted"));
    };
    const timeout = setTimeout(
      () => {
        signal?.removeEventListener("abort", onAbort);
        resolve();
      },
      resolveTimerTimeoutMs(ms, 0, 0),
    );
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}
//#endregion
//#region src/agents/sessions/auth-guidance.ts
/**
 * Shared user-facing auth guidance for session/model selection failures.
 *
 * Uses docs paths instead of provider-specific instructions so guidance stays correct across OAuth/API-key providers.
 */
const UNKNOWN_PROVIDER = "unknown";
/** Returns the standard provider login help block. */
function getProviderLoginHelp() {
  return [
    "Use /login to log into a provider via OAuth or API key. See:",
    `  ${join(getDocsPath(), "providers.md")}`,
    `  ${join(getDocsPath(), "models.md")}`,
  ].join("\n");
}
/** Formats the message shown when no configured model can be used. */
function formatNoModelsAvailableMessage() {
  return `No models available. ${getProviderLoginHelp()}`;
}
/** Formats the message shown before a model is selected. */
function formatNoModelSelectedMessage() {
  return `No model selected.\n\n${getProviderLoginHelp()}\n\nThen use /model to select a model.`;
}
/** Formats the missing API key guidance for a provider or unknown selected model. */
function formatNoApiKeyFoundMessage(provider) {
  return `No API key found for ${provider === UNKNOWN_PROVIDER ? "the selected model" : provider}.\n\n${getProviderLoginHelp()}`;
}
//#endregion
//#region src/agents/sessions/auto-continue.ts
function envFlag(name) {
  const v = process.env[name];
  return v === "1" || v === "true";
}
function autoContinueEnabled() {
  return envFlag("OPENCLAW_AUTOCONTINUE");
}
const DECIDER_MODEL = process.env.OPENCLAW_AUTOCONTINUE_DECIDER_MODEL || "gpt-5.6-sol";
const DECIDER_BASE_URL = (
  process.env.OPENCLAW_AUTOCONTINUE_DECIDER_BASE_URL || "https://api.openai.com/v1"
).replace(/\/+$/, "");
const DECIDER_KEY = process.env.OPENCLAW_AUTOCONTINUE_DECIDER_API_KEY || "";
const FALLBACK_BASE_URL = (
  process.env.OPENCLAW_AUTOCONTINUE_FALLBACK_BASE_URL ||
  process.env.OPENAI_BASE_URL ||
  ""
).replace(/\/+$/, "");
const FALLBACK_KEY =
  process.env.OPENCLAW_AUTOCONTINUE_FALLBACK_API_KEY || process.env.OPENAI_API_KEY || "";
const FALLBACK_MODEL =
  process.env.OPENCLAW_AUTOCONTINUE_FALLBACK_MODEL ||
  process.env.OPENAI_MODEL ||
  "pingu-unchained-10";
function deciderUser(turn) {
  return (
    "TASK:\n" +
    (turn.task || "(unspecified)") +
    "\n\nWORKER'S LATEST OUTPUT:\n" +
    String(turn.lastText || "").slice(0, 4e3) +
    "\n\nWorker took a tool action this turn: " +
    (turn.hadToolCall ? "yes" : "no") +
    "."
  );
}
/**
 * [2026-07-18] qwen36 strict-JSON decider FALLBACK. Chat Completions + response_format json_object +
 * enable_thinking:false (so qwen emits the JSON directly instead of reasoning past the budget).
 * Returns null if it also fails (caller then uses the heuristic + progress terminators).
 */
async function qwenDecide(turn) {
  if (!FALLBACK_BASE_URL || !FALLBACK_KEY) return null;
  try {
    const res = await fetch(`${FALLBACK_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${FALLBACK_KEY}`,
      },
      body: JSON.stringify({
        model: FALLBACK_MODEL,
        temperature: 0,
        max_tokens: 500,
        response_format: { type: "json_object" },
        chat_template_kwargs: { enable_thinking: false },
        messages: [
          {
            role: "system",
            content:
              'You are the DECISION-MAKER for an autonomous coding/ops agent working in a user\'s own workspace. Given the user\'s task and the worker\'s latest turn, decide the next move. status=continue ONLY if the worker can make real progress WITHOUT the user (put the concrete next step in next_instruction); needs_human if a question or decision is owed to the user; complete if the task is done; blocked if it cannot proceed without info/access it lacks. Prefer continue while genuine progress is possible; never loop on a finished task. Respond with ONLY a JSON object: {"status": one of continue|complete|needs_human|blocked, "reason": string, "next_instruction": string}. No markdown, no prose.',
          },
          {
            role: "user",
            content: deciderUser(turn),
          },
        ],
      }),
    });
    if (!res.ok) return null;
    let out = (await res.json()).choices?.[0]?.message?.content || "";
    const m = out.match(/\{[\s\S]*\}/);
    if (m) out = m[0];
    const parsed = JSON.parse(out);
    if (
      parsed &&
      typeof parsed.status === "string" &&
      ["continue", "complete", "needs_human", "blocked"].includes(parsed.status)
    )
      return {
        status: parsed.status,
        reason: String(parsed.reason ?? ""),
        next_instruction: String(parsed.next_instruction ?? ""),
      };
  } catch {}
  return null;
}
const DECISION_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    status: {
      type: "string",
      enum: ["continue", "complete", "needs_human", "blocked"],
    },
    reason: { type: "string" },
    next_instruction: { type: "string" },
  },
  required: ["status", "reason", "next_instruction"],
};
/**
 * DECISION-MAKER: gpt-5.6-sol on the real OpenAI Responses API, strict JSON. Returns the
 * decision object, or null when disabled / no key / error (caller falls back to the
 * heuristic + progress terminators). Dependency-free (global fetch) so agent-core stays
 * generic and no new npm dep is introduced. Mirrors ai-chat.js `metaDecide`.
 */
async function metaDecide(turn) {
  if (!envFlag("OPENCLAW_AUTOCONTINUE_DECIDER")) return null;
  if (!DECIDER_KEY) return await qwenDecide(turn);
  try {
    const res = await fetch(`${DECIDER_BASE_URL}/responses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DECIDER_KEY}`,
      },
      body: JSON.stringify({
        model: DECIDER_MODEL,
        reasoning: { effort: "low" },
        max_output_tokens: 500,
        text: {
          format: {
            type: "json_schema",
            name: "next_step_decision",
            strict: true,
            schema: DECISION_SCHEMA,
          },
        },
        input: [
          {
            role: "system",
            content:
              "You are the DECISION-MAKER for an autonomous coding/ops agent working in a user's own workspace. Given the user's task and the worker's latest turn, decide the next move. status=continue ONLY if the worker can make real progress WITHOUT the user (put the concrete next step in next_instruction); needs_human if a question or decision is owed to the user; complete if the task is done; blocked if it cannot proceed without info/access it lacks. Prefer continue while genuine progress is possible; never loop on a finished task.",
          },
          {
            role: "user",
            content:
              "TASK:\n" +
              (turn.task || "(unspecified)") +
              "\n\nWORKER'S LATEST OUTPUT:\n" +
              String(turn.lastText || "").slice(0, 4e3) +
              "\n\nWorker took a tool action this turn: " +
              (turn.hadToolCall ? "yes" : "no") +
              ".",
          },
        ],
      }),
    });
    if (!res.ok) return await qwenDecide(turn);
    const body = await res.json();
    let outputText = body.output_text;
    if (!outputText) {
      const parts = [];
      for (const item of body.output || [])
        for (const c of item.content || [])
          if (c.type === "output_text" || c.type === "text") parts.push(c.text || "");
      outputText = parts.join("");
    }
    if (!outputText) return await qwenDecide(turn);
    const parsed = JSON.parse(outputText);
    if (parsed && typeof parsed.status === "string")
      return {
        status: parsed.status,
        reason: String(parsed.reason ?? ""),
        next_instruction: String(parsed.next_instruction ?? ""),
      };
    return await qwenDecide(turn);
  } catch {
    return await qwenDecide(turn);
  }
}
/**
 * Cheap heuristic "does this turn need the human?" — the FALLBACK when the decider is off or
 * errors. openclaw has no in-process cheap yes/no judge client wired the way ai-chat.js has
 * qwen36, so the port keeps the regex heuristic only. Missing an LLM judge cannot cause a
 * runaway: an ambiguous turn returns continue, and stall/no_progress still terminate the loop.
 * Mirrors the fast-path of ai-chat.js `metaclawNeedsHuman`.
 */
function needsHumanHeuristic(finalText) {
  const t = String(finalText || "").trim();
  if (!t)
    return {
      stop: true,
      reason: "empty",
    };
  if (
    /\b(all set|that'?s (it|all|everything)|task (is )?complete|completed|finished|nothing (else|more))\b/i.test(
      t,
    )
  )
    return {
      stop: true,
      reason: "complete",
    };
  if (
    /\?\s*$/.test(t) ||
    /\b(would you like|should i\b|do you want|which (one|option)|shall i\b|please (provide|share|specify|confirm)|let me know|your call)\b/i.test(
      t,
    )
  )
    return {
      stop: true,
      reason: "needs_human",
    };
  return {
    stop: false,
    reason: "continue",
  };
}
const NUDGES = [
  "Continue.",
  "Keep going — take the next concrete step by calling a tool, don't just describe it.",
  "Proceed with the next action toward finishing the task.",
  "Continue working the task to completion.",
];
function pickNudge(n, escalated) {
  if (escalated)
    return "You repeated yourself or took no action last turn. Do something DIFFERENT now: take the next concrete step with a tool. If the task is genuinely finished, reply exactly 'TASK COMPLETE'. If you are blocked, state precisely what you need from me.";
  return NUDGES[n % NUDGES.length];
}
/**
 * Per-run stateful controller. One instance per top-level user prompt; it survives across the
 * synthetic "Continue." runs it drives. `decideNext` is called once per fully-completed run.
 */
var AutoContinueController = class {
  constructor() {
    this.n = 0;
    this.lastFinal = null;
    this.noToolStreak = 0;
    this.escalated = false;
    this.max = Number.parseInt(process.env.OPENCLAW_AUTOCONTINUE_MAX || "0", 10) || 0;
  }
  get count() {
    return this.n;
  }
  async decideNext(turn) {
    if (turn.aborted)
      return {
        kind: "stop",
        reason: "aborted",
      };
    const finalText = String(turn.lastText || "");
    if (turn.hadToolCall) this.noToolStreak = 0;
    else this.noToolStreak += 1;
    if (
      (this.lastFinal !== null && finalText.trim() === this.lastFinal.trim()) ||
      this.noToolStreak >= 2
    ) {
      if (this.escalated)
        return {
          kind: "stop",
          reason: this.noToolStreak >= 2 ? "no_progress" : "stall",
        };
      this.escalated = true;
    } else this.escalated = false;
    if (this.max > 0 && this.n >= this.max)
      return {
        kind: "stop",
        reason: "max",
      };
    const decision = await metaDecide(turn);
    let nudge;
    if (decision) {
      if (decision.status !== "continue")
        return {
          kind: "stop",
          reason: decision.status,
        };
      nudge = this.escalated
        ? pickNudge(this.n + 1, true)
        : decision.next_instruction.trim() || pickNudge(this.n + 1, false);
    } else {
      const verdict = needsHumanHeuristic(finalText);
      if (verdict.stop)
        return {
          kind: "stop",
          reason: verdict.reason,
        };
      nudge = pickNudge(this.n + 1, this.escalated);
    }
    this.n += 1;
    this.lastFinal = finalText;
    return {
      kind: "continue",
      nudge,
      n: this.n,
      escalated: this.escalated,
    };
  }
};
//#endregion
//#region src/agents/sessions/tools/private-temp-file.ts
/**
 * Private temporary file helper for tool output spillover.
 *
 * Creates owner-only log files without reusing predictable names.
 */
/** Opens a unique write stream with owner-only permissions. */
function createPrivateTempWriteStream(prefix) {
  const filePath = createPrivateTempFilePath(prefix);
  return {
    path: filePath,
    stream: createWriteStream(filePath, {
      flags: "wx",
      mode: 384,
    }),
  };
}
async function writePrivateTempFile(prefix, content) {
  const filePath = createPrivateTempFilePath(prefix);
  await writeFile(filePath, content, {
    flag: "wx",
    mode: 384,
  });
  return filePath;
}
function createPrivateTempFilePath(prefix) {
  const id = randomBytes(8).toString("hex");
  return join(tmpdir(), `${prefix}-${id}.log`);
}
//#endregion
//#region src/agents/sessions/tools/output-accumulator.ts
function byteLength(text) {
  return Buffer.byteLength(text, "utf-8");
}
/**
 * Incrementally tracks streaming output with bounded memory.
 *
 * Appends decode chunks with a streaming UTF-8 decoder, keeps only a decoded
 * tail for display snapshots, and opens a temp file when the full output needs
 * to be preserved.
 */
var OutputAccumulator = class {
  constructor(options = {}) {
    this.decoder = new TextDecoder();
    this.spillChunks = [];
    this.tailText = "";
    this.tailBytes = 0;
    this.tailStartsAtLineBoundary = true;
    this.totalRawBytes = 0;
    this.totalDecodedBytes = 0;
    this.completedLines = 0;
    this.totalLines = 0;
    this.currentLineBytes = 0;
    this.hasOpenLine = false;
    this.finished = false;
    this.maxLines = options.maxLines ?? 2e3;
    this.maxBytes = options.maxBytes ?? 51200;
    this.maxRollingBytes = Math.max(this.maxBytes * 2, 1);
    this.tempFilePrefix = options.tempFilePrefix ?? "openclaw-output";
    this.transformDecodedText = options.transformDecodedText;
  }
  append(data) {
    if (this.finished) throw new Error("Cannot append to a finished output accumulator");
    this.totalRawBytes += data.length;
    const decodedText = this.decoder.decode(data, { stream: true });
    const text = this.transformDecodedText?.(decodedText) ?? decodedText;
    this.appendDecodedText(text);
    const spillChunk = this.transformDecodedText ? Buffer.from(text, "utf-8") : data;
    if (this.tempFileStream || this.shouldUseTempFile()) this.ensureTempFile();
    this.appendSpillChunk(spillChunk);
    return text;
  }
  finish() {
    if (this.finished) return "";
    this.finished = true;
    const decodedText = this.decoder.decode();
    const text = this.transformDecodedText?.(decodedText) ?? decodedText;
    this.appendDecodedText(text);
    if (this.transformDecodedText && text.length > 0)
      this.appendSpillChunk(Buffer.from(text, "utf-8"));
    if (this.shouldUseTempFile()) this.ensureTempFile();
    return text;
  }
  snapshot(options = {}) {
    const tailTruncation = truncateTail(this.getSnapshotText(), {
      maxLines: this.maxLines,
      maxBytes: this.maxBytes,
    });
    const truncated = this.totalLines > this.maxLines || this.totalDecodedBytes > this.maxBytes;
    const truncatedBy = truncated
      ? (tailTruncation.truncatedBy ?? (this.totalDecodedBytes > this.maxBytes ? "bytes" : "lines"))
      : null;
    const truncation = {
      ...tailTruncation,
      truncated,
      truncatedBy,
      totalLines: this.totalLines,
      totalBytes: this.totalDecodedBytes,
      maxLines: this.maxLines,
      maxBytes: this.maxBytes,
    };
    if (options.persistIfTruncated && truncation.truncated) this.ensureTempFile();
    return {
      content: truncation.content,
      truncation,
      fullOutputPath: this.tempFilePath,
    };
  }
  async closeTempFile() {
    if (!this.tempFileStream) return;
    const stream = this.tempFileStream;
    this.tempFileStream = void 0;
    await new Promise((resolve, reject) => {
      const onError = (error) => {
        stream.off("finish", onFinish);
        reject(error);
      };
      const onFinish = () => {
        stream.off("error", onError);
        resolve();
      };
      stream.once("error", onError);
      stream.once("finish", onFinish);
      stream.end();
    });
  }
  getLastLineBytes() {
    return this.currentLineBytes;
  }
  appendDecodedText(text) {
    if (text.length === 0) return;
    const bytes = byteLength(text);
    this.totalDecodedBytes += bytes;
    this.tailText += text;
    this.tailBytes += bytes;
    if (this.tailBytes > this.maxRollingBytes * 2) this.trimTail();
    let newlines = 0;
    let lastNewline = -1;
    for (let i = text.indexOf("\n"); i !== -1; i = text.indexOf("\n", i + 1)) {
      newlines++;
      lastNewline = i;
    }
    if (newlines === 0) {
      this.currentLineBytes += bytes;
      this.hasOpenLine = true;
    } else {
      this.completedLines += newlines;
      const tail = text.slice(lastNewline + 1);
      this.currentLineBytes = byteLength(tail);
      this.hasOpenLine = tail.length > 0;
    }
    this.totalLines = this.completedLines + (this.hasOpenLine ? 1 : 0);
  }
  trimTail() {
    const buffer = Buffer.from(this.tailText, "utf-8");
    if (buffer.length <= this.maxRollingBytes) {
      this.tailBytes = buffer.length;
      return;
    }
    let start = buffer.length - this.maxRollingBytes;
    while (start < buffer.length) {
      const byte = buffer.at(start);
      if (byte === void 0 || (byte & 192) !== 128) break;
      start++;
    }
    this.tailStartsAtLineBoundary =
      start === 0 ? this.tailStartsAtLineBoundary : buffer.at(start - 1) === 10;
    this.tailText = buffer.subarray(start).toString("utf-8");
    this.tailBytes = byteLength(this.tailText);
  }
  getSnapshotText() {
    if (this.tailStartsAtLineBoundary) return this.tailText;
    const firstNewline = this.tailText.indexOf("\n");
    return firstNewline === -1 ? this.tailText : this.tailText.slice(firstNewline + 1);
  }
  shouldUseTempFile() {
    return (
      this.totalRawBytes > this.maxBytes ||
      this.totalDecodedBytes > this.maxBytes ||
      this.totalLines > this.maxLines
    );
  }
  appendSpillChunk(chunk) {
    if (chunk.length === 0) return;
    if (this.tempFileStream) this.tempFileStream.write(chunk);
    else this.spillChunks.push(chunk);
  }
  ensureTempFile() {
    if (this.tempFilePath) return;
    const tempFile = createPrivateTempWriteStream(this.tempFilePrefix);
    this.tempFilePath = tempFile.path;
    this.tempFileStream = tempFile.stream;
    for (const chunk of this.spillChunks) this.tempFileStream.write(chunk);
    this.spillChunks = [];
  }
};
//#endregion
//#region src/agents/sessions/bash-executor.ts
/**
 * Bash command execution with streaming support and cancellation.
 *
 * This module provides a unified bash execution implementation used by:
 * - AgentSession.executeBash() for interactive and RPC modes
 * - Direct calls from modes that need bash execution
 */
/**
 * Execute a bash command using custom BashOperations.
 * Used for remote execution (SSH, containers, etc.).
 */
async function executeBashWithOperations(command, cwd, operations, options) {
  const output = new OutputAccumulator({
    tempFilePrefix: "openclaw-bash",
    transformDecodedText: (text) =>
      sanitizeBinaryOutput(text, { ansiMode: "compat" }).replace(/\r/g, ""),
  });
  const onData = (data) => {
    const text = output.append(data);
    options?.onChunk?.(text);
  };
  const finalizeOutput = async () => {
    const finalText = output.finish();
    const snapshot = output.snapshot({ persistIfTruncated: true });
    try {
      if (finalText) options?.onChunk?.(finalText);
      return snapshot;
    } finally {
      await output.closeTempFile();
    }
  };
  const buildResult = async (exitCode, cancelled) => {
    const snapshot = await finalizeOutput();
    return {
      output: snapshot.content,
      exitCode: cancelled ? void 0 : exitCode,
      cancelled,
      truncated: snapshot.truncation.truncated,
      fullOutputPath: snapshot.fullOutputPath,
    };
  };
  let result;
  try {
    result = await operations.exec(command, cwd, {
      onData,
      signal: options?.signal,
    });
  } catch (err) {
    if (options?.signal?.aborted) return await buildResult(void 0, true);
    await finalizeOutput();
    throw err;
  }
  const cancelled = options?.signal?.aborted ?? false;
  return await buildResult(result.exitCode ?? void 0, cancelled);
}
//#endregion
//#region src/agents/sessions/defaults.ts
/** Default thinking level for sessions that do not specify a model-specific override. */
const DEFAULT_THINKING_LEVEL = "medium";
//#endregion
//#region src/agents/sessions/event-bus.ts
/**
 * Tiny event bus abstraction for session UI/runtime notifications.
 *
 * Isolates handler failures so one bad subscriber cannot break later listeners.
 */
/** Creates an in-process event bus with unsubscribe and clear support. */
function createEventBus() {
  const emitter = new EventEmitter();
  return {
    emit: (channel, data) => {
      emitter.emit(channel, data);
    },
    on: (channel, handler) => {
      const safeHandler = (data) => {
        try {
          handler(data);
        } catch (err) {
          console.error(`Event handler error (${channel}):`, err);
        }
      };
      emitter.on(channel, safeHandler);
      return () => emitter.off(channel, safeHandler);
    },
    clear: () => {
      emitter.removeAllListeners();
    },
  };
}
//#endregion
//#region src/agents/sessions/exec.ts
/**
 * Shared command execution utilities for extensions and custom tools.
 */
const DEFAULT_OUTPUT_LIMIT_CHARS = 16 * 1024 * 1024;
const FORCE_KILL_GRACE_MS = 5e3;
function clampMaxOutputChars(value) {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0)
    return DEFAULT_OUTPUT_LIMIT_CHARS;
  return Math.max(1, Math.floor(value));
}
function appendCapturedOutput(current, chunk, maxOutputChars, truncateTail) {
  const text = String(chunk);
  const combined = `${current.text}${text}`;
  const overflowChars = Math.max(0, combined.length - maxOutputChars);
  if (overflowChars === 0)
    return {
      text: combined,
      truncatedChars: current.truncatedChars,
    };
  const nextText = truncateTail
    ? sliceUtf16Safe(combined, overflowChars)
    : sliceUtf16Safe(combined, 0, maxOutputChars);
  return {
    text: nextText,
    truncatedChars: current.truncatedChars + combined.length - nextText.length,
  };
}
/**
 * Execute a shell command and return stdout/stderr/code.
 * Supports timeout and abort signal.
 */
async function execCommand(command, args, cwd, options) {
  return new Promise((resolve) => {
    const proc = spawnCommand([command, ...args], {
      buffer: false,
      cwd,
      detached: process.platform !== "win32",
      reject: false,
      stdio: ["ignore", "pipe", "pipe"],
    });
    const releaseOutput = releaseChildProcessOutputAfterExit(proc);
    let stdout = {
      text: "",
      truncatedChars: 0,
    };
    let stderr = {
      text: "",
      truncatedChars: 0,
    };
    let killed = false;
    let timeoutId;
    let forceKillTimer;
    let settled = false;
    const maxOutputChars = clampMaxOutputChars(options?.maxOutputChars);
    const truncateOutput = options?.maxOutputChars !== void 0;
    let outputLimitExceeded;
    const markOutputLimitExceeded = (stream) => {
      if (!truncateOutput && !outputLimitExceeded) {
        outputLimitExceeded = stream;
        killProcess();
      }
    };
    const finish = (code) => {
      if (settled) return;
      settled = true;
      if (timeoutId) clearTimeout(timeoutId);
      if (forceKillTimer) clearTimeout(forceKillTimer);
      if (options?.signal) options.signal.removeEventListener("abort", killProcess);
      if (outputLimitExceeded)
        stderr = appendCapturedOutput(
          stderr,
          `${stderr.text ? "\n" : ""}exec ${outputLimitExceeded} exceeded output limit ${maxOutputChars} chars`,
          maxOutputChars,
          true,
        );
      resolve({
        stdout: stdout.text,
        stderr: stderr.text,
        stdoutTruncatedChars: stdout.truncatedChars || void 0,
        stderrTruncatedChars: stderr.truncatedChars || void 0,
        outputLimitExceeded,
        code: outputLimitExceeded ? 1 : code,
        killed,
      });
    };
    const killProcess = () => {
      if (!killed) {
        killed = true;
        if (proc.pid)
          killProcessTree(proc.pid, {
            detached: process.platform !== "win32",
            graceMs: FORCE_KILL_GRACE_MS,
          });
        else {
          proc.kill("SIGTERM");
          forceKillTimer = setTimeout(() => {
            if (!settled) proc.kill("SIGKILL");
          }, FORCE_KILL_GRACE_MS);
          forceKillTimer.unref?.();
        }
      }
    };
    if (options?.signal)
      if (options.signal.aborted) killProcess();
      else options.signal.addEventListener("abort", killProcess, { once: true });
    if (options?.timeout && options.timeout > 0)
      timeoutId = setTimeout(() => {
        killProcess();
      }, options.timeout);
    const ignoreOutputStreamError = () => {};
    proc.stdout?.on("error", ignoreOutputStreamError);
    proc.stderr?.on("error", ignoreOutputStreamError);
    proc.stdout?.on("data", (data) => {
      const before = stdout.truncatedChars;
      stdout = appendCapturedOutput(stdout, data, maxOutputChars, truncateOutput);
      if (stdout.truncatedChars > before) markOutputLimitExceeded("stdout");
    });
    proc.stderr?.on("data", (data) => {
      const before = stderr.truncatedChars;
      stderr = appendCapturedOutput(stderr, data, maxOutputChars, truncateOutput);
      if (stderr.truncatedChars > before) markOutputLimitExceeded("stderr");
    });
    proc
      .then((result) => {
        finish(result.exitCode ?? (result.failed ? 1 : 0));
      })
      .catch(() => {
        finish(1);
      })
      .finally(releaseOutput);
  });
}
//#endregion
//#region src/agents/sessions/resolve-config-value.ts
/**
 * Resolve configuration values that may be shell commands, environment variables, or literals.
 * Used by auth-storage.ts and model-registry.ts.
 */
const commandResultCache = /* @__PURE__ */ new Map();
/**
 * Resolve a config value (API key, header value, etc.) to an actual value.
 * - If starts with "!", executes the rest as a shell command and uses stdout (cached)
 * - Otherwise checks environment variable first, then treats as literal (not cached)
 */
function resolveConfigValue(config) {
  if (config.startsWith("!")) return executeCommand(config);
  return process.env[config] || config;
}
function executeWithConfiguredShell(command) {
  try {
    const { shell, args } = getBashShellConfig();
    const result = spawnSync(shell, [...args, command], {
      encoding: "utf-8",
      timeout: 1e4,
      stdio: ["ignore", "pipe", "ignore"],
      shell: false,
      windowsHide: true,
    });
    if (result.error) {
      if (result.error.code === "ENOENT")
        return {
          executed: false,
          value: void 0,
        };
      return {
        executed: true,
        value: void 0,
      };
    }
    if (result.status !== 0)
      return {
        executed: true,
        value: void 0,
      };
    return {
      executed: true,
      value: (result.stdout ?? "").trim() || void 0,
    };
  } catch {
    return {
      executed: false,
      value: void 0,
    };
  }
}
function executeWithDefaultShell(command) {
  try {
    return (
      execSync(command, {
        encoding: "utf-8",
        timeout: 1e4,
        stdio: ["ignore", "pipe", "ignore"],
      }).trim() || void 0
    );
  } catch {
    return;
  }
}
function executeCommandUncached(commandConfig) {
  const command = commandConfig.slice(1);
  return process.platform === "win32"
    ? (() => {
        const configuredResult = executeWithConfiguredShell(command);
        return configuredResult.executed
          ? configuredResult.value
          : executeWithDefaultShell(command);
      })()
    : executeWithDefaultShell(command);
}
function executeCommand(commandConfig) {
  if (commandResultCache.has(commandConfig)) return commandResultCache.get(commandConfig);
  const result = executeCommandUncached(commandConfig);
  commandResultCache.set(commandConfig, result);
  return result;
}
/**
 * Resolve all header values using the same resolution logic as API keys.
 */
function resolveConfigValueUncached(config) {
  if (config.startsWith("!")) return executeCommandUncached(config);
  return process.env[config] || config;
}
function resolveConfigValueOrThrow(config, description) {
  const resolvedValue = resolveConfigValueUncached(config);
  if (resolvedValue !== void 0) return resolvedValue;
  if (config.startsWith("!"))
    throw new Error(`Failed to resolve ${description} from shell command: ${config.slice(1)}`);
  throw new Error(`Failed to resolve ${description}`);
}
function resolveHeadersOrThrow(headers, description) {
  if (!headers) return;
  const resolved = {};
  for (const [key, value] of Object.entries(headers))
    resolved[key] = resolveConfigValueOrThrow(value, `${description} header "${key}"`);
  return Object.keys(resolved).length > 0 ? resolved : void 0;
}
/** Clear the config value command cache. Exported for testing. */
function clearConfigValueCache() {
  commandResultCache.clear();
}
//#endregion
//#region src/agents/sessions/storage-lock.ts
const MAX_LOCK_ATTEMPTS = 10;
const LOCK_RETRY_DELAY_MS = 20;
function acquireLockSyncWithRetry(path) {
  for (let attempt = 1; ; attempt++) {
    try {
      return lockfile.lockSync(path, { realpath: false });
    } catch (error) {
      if (error.code !== "ELOCKED" || attempt === MAX_LOCK_ATTEMPTS) throw error;
    }
    const start = Date.now();
    while (Date.now() - start < LOCK_RETRY_DELAY_MS);
  }
}
//#endregion
//#region src/agents/sessions/auth-storage.ts
/**
 * Credential storage for API keys and OAuth tokens.
 * Handles loading, saving, and refreshing credentials from auth.json.
 *
 * Uses file locking to prevent race conditions when multiple agent sessions
 * try to refresh tokens simultaneously.
 */
var FileAuthStorageBackend = class {
  constructor(authPath = join(getAgentDir(), "auth.json")) {
    this.authPath = authPath;
  }
  ensureParentDir() {
    const dir = dirname(this.authPath);
    if (!existsSync(dir))
      mkdirSync(dir, {
        recursive: true,
        mode: 448,
      });
  }
  ensureFileExists() {
    if (!existsSync(this.authPath)) {
      writeFileSync(this.authPath, "{}", "utf-8");
      chmodSync(this.authPath, 384);
    }
  }
  replaceAuthFileAtomic(content) {
    const dirMode = statSync(dirname(this.authPath)).mode & 4095;
    replaceFileAtomicSync({
      filePath: this.authPath,
      content,
      dirMode,
      mode: 384,
      tempPrefix: "auth.json",
      syncTempFile: true,
      syncParentDir: true,
    });
  }
  withLock(fn) {
    this.ensureParentDir();
    this.ensureFileExists();
    let release;
    try {
      release = acquireLockSyncWithRetry(this.authPath);
      const { result, next } = fn(
        existsSync(this.authPath) ? readFileSync(this.authPath, "utf-8") : void 0,
      );
      if (next !== void 0) this.replaceAuthFileAtomic(next);
      return result;
    } finally {
      if (release) release();
    }
  }
  async withLockAsync(fn) {
    this.ensureParentDir();
    this.ensureFileExists();
    let release;
    let lockCompromised = false;
    let lockCompromisedError;
    const throwIfCompromised = () => {
      if (lockCompromised)
        throw (
          lockCompromisedError ?? /* @__PURE__ */ new Error("Auth storage lock was compromised")
        );
    };
    try {
      release = await lockfile.lock(this.authPath, {
        retries: {
          retries: 10,
          factor: 2,
          minTimeout: 100,
          maxTimeout: 1e4,
          randomize: true,
        },
        stale: 3e4,
        onCompromised: (err) => {
          lockCompromised = true;
          lockCompromisedError = err;
        },
      });
      throwIfCompromised();
      const { result, next } = await fn(
        existsSync(this.authPath) ? readFileSync(this.authPath, "utf-8") : void 0,
      );
      throwIfCompromised();
      if (next !== void 0) this.replaceAuthFileAtomic(next);
      throwIfCompromised();
      return result;
    } finally {
      if (release)
        try {
          await release();
        } catch {}
    }
  }
};
var InMemoryAuthStorageBackend = class {
  withLock(fn) {
    const { result, next } = fn(this.value);
    if (next !== void 0) this.value = next;
    return result;
  }
  async withLockAsync(fn) {
    const { result, next } = await fn(this.value);
    if (next !== void 0) this.value = next;
    return result;
  }
};
/**
 * Credential storage backed by a JSON file.
 */
var AuthStorage = class AuthStorage {
  constructor(storage) {
    this.data = {};
    this.runtimeOverrides = /* @__PURE__ */ new Map();
    this.loadError = null;
    this.errors = [];
    this.storage = storage;
    this.reload();
  }
  static create(authPath) {
    return new AuthStorage(
      new FileAuthStorageBackend(authPath ?? join(getAgentDir(), "auth.json")),
    );
  }
  static fromStorage(storage) {
    return new AuthStorage(storage);
  }
  static inMemory(data = {}) {
    const storage = new InMemoryAuthStorageBackend();
    storage.withLock(() => ({
      result: void 0,
      next: JSON.stringify(data, null, 2),
    }));
    return AuthStorage.fromStorage(storage);
  }
  /**
   * Set a runtime API key override (not persisted to disk).
   * Used for CLI --api-key flag.
   */
  setRuntimeApiKey(provider, apiKey) {
    this.runtimeOverrides.set(provider, apiKey);
  }
  /**
   * Remove a runtime API key override.
   */
  removeRuntimeApiKey(provider) {
    this.runtimeOverrides.delete(provider);
  }
  /**
   * Set a fallback resolver for API keys not found in auth.json or env vars.
   * Used for custom provider keys from models.json.
   */
  setFallbackResolver(resolver) {
    this.fallbackResolver = resolver;
  }
  recordError(error) {
    const normalizedError = error instanceof Error ? error : new Error(String(error));
    this.errors.push(normalizedError);
  }
  parseStorageData(content) {
    if (!content) return {};
    return JSON.parse(content);
  }
  /**
   * Reload credentials from storage.
   */
  reload() {
    let content;
    try {
      this.storage.withLock((current) => {
        content = current;
        return { result: void 0 };
      });
      this.data = this.parseStorageData(content);
      this.loadError = null;
    } catch (error) {
      this.loadError = error;
      this.recordError(error);
    }
  }
  persistProviderChange(provider, credential) {
    if (this.loadError) return;
    try {
      this.storage.withLock((current) => {
        const merged = { ...this.parseStorageData(current) };
        if (credential) merged[provider] = credential;
        else delete merged[provider];
        return {
          result: void 0,
          next: JSON.stringify(merged, null, 2),
        };
      });
    } catch (error) {
      this.recordError(error);
    }
  }
  /**
   * Get credential for a provider.
   */
  get(provider) {
    return this.data[provider] ?? void 0;
  }
  /**
   * Set credential for a provider.
   */
  set(provider, credential) {
    this.data[provider] = credential;
    this.persistProviderChange(provider, credential);
  }
  /**
   * Remove credential for a provider.
   */
  remove(provider) {
    delete this.data[provider];
    this.persistProviderChange(provider, void 0);
  }
  /**
   * List all providers with credentials.
   */
  list() {
    return Object.keys(this.data);
  }
  /**
   * Check if credentials exist for a provider in auth.json.
   */
  has(provider) {
    return provider in this.data;
  }
  /**
   * Check if any form of auth is configured for a provider.
   * Unlike getApiKey(), this doesn't refresh OAuth tokens.
   */
  hasAuth(provider) {
    if (this.runtimeOverrides.has(provider)) return true;
    if (this.data[provider]) return true;
    if (getEnvApiKey(provider)) return true;
    if (this.fallbackResolver?.(provider)) return true;
    return false;
  }
  /**
   * Return auth status without exposing credential values or refreshing tokens.
   */
  getAuthStatus(provider) {
    if (this.data[provider])
      return {
        configured: true,
        source: "stored",
      };
    if (this.runtimeOverrides.has(provider))
      return {
        configured: false,
        source: "runtime",
        label: "--api-key",
      };
    const envKeys = findEnvKeys(provider);
    if (envKeys?.[0])
      return {
        configured: false,
        source: "environment",
        label: envKeys[0],
      };
    if (this.fallbackResolver?.(provider))
      return {
        configured: false,
        source: "fallback",
        label: "custom provider config",
      };
    return { configured: false };
  }
  /**
   * Get all credentials (for passing to getOAuthApiKey).
   */
  getAll() {
    return { ...this.data };
  }
  drainErrors() {
    const drained = [...this.errors];
    this.errors = [];
    return drained;
  }
  /**
   * Login to an OAuth provider.
   */
  async login(providerId, callbacks) {
    const provider = getOAuthProvider(providerId);
    if (!provider) throw new Error(`Unknown OAuth provider: ${providerId}`);
    const credentials = await provider.login(callbacks);
    this.set(providerId, {
      type: "oauth",
      ...credentials,
    });
  }
  /**
   * Logout from a provider.
   */
  logout(provider) {
    this.remove(provider);
  }
  /**
   * Refresh OAuth token with backend locking to prevent race conditions.
   * Multiple agent sessions may try to refresh simultaneously when tokens expire.
   */
  async refreshOAuthTokenWithLock(providerId) {
    const provider = getOAuthProvider(providerId);
    if (!provider) return null;
    return await this.storage.withLockAsync(async (current) => {
      const currentData = this.parseStorageData(current);
      this.data = currentData;
      this.loadError = null;
      const cred = currentData[providerId];
      if (cred?.type !== "oauth") return { result: null };
      if (Date.now() < cred.expires)
        return {
          result: {
            apiKey: provider.getApiKey(cred),
            newCredentials: cred,
          },
        };
      const oauthCreds = {};
      for (const [key, value] of Object.entries(currentData))
        if (value.type === "oauth") oauthCreds[key] = value;
      const refreshed = await getOAuthApiKey(providerId, oauthCreds);
      if (!refreshed) return { result: null };
      const merged = {
        ...currentData,
        [providerId]: {
          type: "oauth",
          ...refreshed.newCredentials,
        },
      };
      this.data = merged;
      this.loadError = null;
      return {
        result: refreshed,
        next: JSON.stringify(merged, null, 2),
      };
    });
  }
  /**
   * Get API key for a provider.
   * Priority:
   * 1. Runtime override (CLI --api-key)
   * 2. API key from auth.json
   * 3. OAuth token from auth.json (auto-refreshed with locking)
   * 4. Environment variable
   * 5. Fallback resolver (models.json custom providers)
   */
  async getApiKey(providerId, options) {
    const runtimeKey = this.runtimeOverrides.get(providerId);
    if (runtimeKey) return runtimeKey;
    const cred = this.data[providerId];
    if (cred?.type === "api_key") return resolveConfigValue(cred.key);
    if (cred?.type === "oauth") {
      const provider = getOAuthProvider(providerId);
      if (!provider) return;
      if (Date.now() >= cred.expires)
        try {
          const result = await this.refreshOAuthTokenWithLock(providerId);
          if (result) return result.apiKey;
        } catch (error) {
          this.recordError(error);
          this.reload();
          const updatedCred = this.data[providerId];
          if (updatedCred?.type === "oauth" && Date.now() < updatedCred.expires)
            return provider.getApiKey(updatedCred);
          return;
        }
      else return provider.getApiKey(cred);
    }
    const envKey = getEnvApiKey(providerId);
    if (envKey) return envKey;
    if (options?.includeFallback !== false) return this.fallbackResolver?.(providerId) ?? void 0;
  }
  /**
   * Get all registered OAuth providers
   */
  getOAuthProviders() {
    return getOAuthProviders();
  }
};
//#endregion
//#region src/agents/sessions/compaction/branch-summarization.ts
/** Collects entries that differ between two session branches for summarization. */
function collectEntriesForBranchSummary(session, oldLeafId, targetId) {
  if (!oldLeafId)
    return {
      entries: [],
      commonAncestorId: null,
    };
  return collectEntriesForBranchSummaryFromBranches(
    session.getBranch(oldLeafId),
    session.getBranch(targetId),
  );
}
/** Generates a human-readable branch summary through the shared agent-core runtime. */
async function generateBranchSummary(entries, options) {
  const result = await generateBranchSummary$1(entries, {
    runtime: openClawAgentCoreRuntime,
    ...options,
  });
  if (result.ok) return result.value;
  if (result.error.code === "aborted")
    return {
      aborted: true,
      error: result.error.message,
    };
  return { error: result.error.message };
}
//#endregion
//#region src/agents/sessions/compaction/compaction.ts
/** Converts agent-core Result values back to the legacy session compaction API shape. */
function unwrapCompactionResult(result) {
  if (result.ok) return result.value;
  throw result.error;
}
/** Prepares session entries for compaction using the shared agent-core planner. */
function prepareCompaction(pathEntries, settings) {
  return unwrapCompactionResult(prepareCompaction$1(pathEntries, settings));
}
/** Generates a compaction summary through the shared agent-core runtime. */
async function generateSummary(
  currentMessages,
  model,
  reserveTokens,
  apiKey,
  headers,
  signal,
  customInstructions,
  previousSummary,
  thinkingLevel,
  streamFn,
) {
  return unwrapCompactionResult(
    await generateSummary$1(
      currentMessages,
      model,
      reserveTokens,
      apiKey,
      headers,
      signal,
      customInstructions,
      previousSummary,
      thinkingLevel,
      streamFn,
      openClawAgentCoreRuntime,
    ),
  );
}
/** Runs full compaction through agent-core and returns the compacted conversation result. */
async function compact(
  preparation,
  model,
  apiKey,
  headers,
  customInstructions,
  signal,
  thinkingLevel,
  streamFn,
) {
  return unwrapCompactionResult(
    await compact$1(
      preparation,
      model,
      apiKey,
      headers,
      customInstructions,
      signal,
      thinkingLevel,
      streamFn,
      openClawAgentCoreRuntime,
    ),
  );
}
//#endregion
//#region src/agents/sessions/provider-display-names.ts
/**
 * Built-in provider labels shown in session/model UI when plugin metadata does
 * not supply a display name.
 */
const BUILT_IN_PROVIDER_DISPLAY_NAMES = {
  anthropic: "Anthropic",
  "amazon-bedrock": "Amazon Bedrock",
  "azure-openai-responses": "Azure OpenAI Responses",
  cerebras: "Cerebras",
  "cloudflare-ai-gateway": "Cloudflare AI Gateway",
  "cloudflare-workers-ai": "Cloudflare Workers AI",
  deepseek: "DeepSeek",
  fireworks: "Fireworks",
  google: "Google Gemini",
  "google-vertex": "Google Vertex AI",
  groq: "Groq",
  huggingface: "Hugging Face",
  "kimi-coding": "Kimi For Coding",
  meta: "Meta",
  mistral: "Mistral",
  minimax: "MiniMax",
  "minimax-cn": "MiniMax (China)",
  moonshotai: "Moonshot AI",
  "moonshotai-cn": "Moonshot AI (China)",
  opencode: "OpenCode Zen",
  "opencode-go": "OpenCode Go",
  openai: "OpenAI",
  openrouter: "OpenRouter",
  together: "Together AI",
  "vercel-ai-gateway": "Vercel AI Gateway",
  xai: "xAI",
  zai: "ZAI",
  xiaomi: "Xiaomi MiMo",
  "xiaomi-token-plan-cn": "Xiaomi MiMo Token Plan (China)",
  "xiaomi-token-plan-ams": "Xiaomi MiMo Token Plan (Amsterdam)",
  "xiaomi-token-plan-sgp": "Xiaomi MiMo Token Plan (Singapore)",
};
//#endregion
//#region src/agents/sessions/model-registry.ts
/**
 * Model registry - manages configured/provider-owned models and API key resolution.
 */
const log = createSubsystemLogger("agents/model-registry");
const PercentileCutoffsSchema = Type.Object({
  p50: Type.Optional(Type.Number()),
  p75: Type.Optional(Type.Number()),
  p90: Type.Optional(Type.Number()),
  p99: Type.Optional(Type.Number()),
});
const OpenRouterRoutingSchema = Type.Object({
  allow_fallbacks: Type.Optional(Type.Boolean()),
  require_parameters: Type.Optional(Type.Boolean()),
  data_collection: Type.Optional(Type.Union([Type.Literal("deny"), Type.Literal("allow")])),
  zdr: Type.Optional(Type.Boolean()),
  enforce_distillable_text: Type.Optional(Type.Boolean()),
  order: Type.Optional(Type.Array(Type.String())),
  only: Type.Optional(Type.Array(Type.String())),
  ignore: Type.Optional(Type.Array(Type.String())),
  quantizations: Type.Optional(Type.Array(Type.String())),
  sort: Type.Optional(
    Type.Union([
      Type.String(),
      Type.Object({
        by: Type.Optional(Type.String()),
        partition: Type.Optional(Type.Union([Type.String(), Type.Null()])),
      }),
    ]),
  ),
  max_price: Type.Optional(
    Type.Object({
      prompt: Type.Optional(Type.Union([Type.Number(), Type.String()])),
      completion: Type.Optional(Type.Union([Type.Number(), Type.String()])),
      image: Type.Optional(Type.Union([Type.Number(), Type.String()])),
      audio: Type.Optional(Type.Union([Type.Number(), Type.String()])),
      request: Type.Optional(Type.Union([Type.Number(), Type.String()])),
    }),
  ),
  preferred_min_throughput: Type.Optional(Type.Union([Type.Number(), PercentileCutoffsSchema])),
  preferred_max_latency: Type.Optional(Type.Union([Type.Number(), PercentileCutoffsSchema])),
});
const VercelGatewayRoutingSchema = Type.Object({
  only: Type.Optional(Type.Array(Type.String())),
  order: Type.Optional(Type.Array(Type.String())),
});
const ThinkingLevelMapValueSchema = Type.Union([Type.String(), Type.Null()]);
const ThinkingLevelMapSchema = Type.Object({
  off: Type.Optional(ThinkingLevelMapValueSchema),
  minimal: Type.Optional(ThinkingLevelMapValueSchema),
  low: Type.Optional(ThinkingLevelMapValueSchema),
  medium: Type.Optional(ThinkingLevelMapValueSchema),
  high: Type.Optional(ThinkingLevelMapValueSchema),
  xhigh: Type.Optional(ThinkingLevelMapValueSchema),
  max: Type.Optional(ThinkingLevelMapValueSchema),
});
const OpenAICompletionsCompatSchema = Type.Object({
  supportsStore: Type.Optional(Type.Boolean()),
  supportsDeveloperRole: Type.Optional(Type.Boolean()),
  supportsReasoningEffort: Type.Optional(Type.Boolean()),
  supportsUsageInStreaming: Type.Optional(Type.Boolean()),
  maxTokensField: Type.Optional(
    Type.Union([Type.Literal("max_completion_tokens"), Type.Literal("max_tokens")]),
  ),
  requiresToolResultName: Type.Optional(Type.Boolean()),
  requiresAssistantAfterToolResult: Type.Optional(Type.Boolean()),
  requiresThinkingAsText: Type.Optional(Type.Boolean()),
  requiresReasoningContentOnAssistantMessages: Type.Optional(Type.Boolean()),
  thinkingFormat: Type.Optional(
    Type.Union([
      Type.Literal("openai"),
      Type.Literal("openrouter"),
      Type.Literal("together"),
      Type.Literal("deepseek"),
      Type.Literal("zai"),
      Type.Literal("qwen"),
      Type.Literal("qwen-chat-template"),
    ]),
  ),
  cacheControlFormat: Type.Optional(Type.Literal("anthropic")),
  openRouterRouting: Type.Optional(OpenRouterRoutingSchema),
  vercelGatewayRouting: Type.Optional(VercelGatewayRoutingSchema),
  supportsStrictMode: Type.Optional(Type.Boolean()),
  supportsLongCacheRetention: Type.Optional(Type.Boolean()),
});
const OpenAIResponsesCompatSchema = Type.Object({
  supportsTemperature: Type.Optional(Type.Boolean()),
  sendSessionIdHeader: Type.Optional(Type.Boolean()),
  supportsLongCacheRetention: Type.Optional(Type.Boolean()),
});
const AnthropicMessagesCompatSchema = Type.Object({
  supportsEagerToolInputStreaming: Type.Optional(Type.Boolean()),
  supportsLongCacheRetention: Type.Optional(Type.Boolean()),
});
const ProviderCompatSchema = Type.Union([
  OpenAICompletionsCompatSchema,
  OpenAIResponsesCompatSchema,
  AnthropicMessagesCompatSchema,
]);
const ProviderAuthModeSchema = Type.Union([
  Type.Literal("api-key"),
  Type.Literal("aws-sdk"),
  Type.Literal("oauth"),
  Type.Literal("token"),
]);
const ModelDefinitionSchema = Type.Object({
  id: Type.String({ minLength: 1 }),
  name: Type.Optional(Type.String({ minLength: 1 })),
  api: Type.Optional(Type.String({ minLength: 1 })),
  baseUrl: Type.Optional(Type.String({ minLength: 1 })),
  reasoning: Type.Optional(Type.Boolean()),
  thinkingLevelMap: Type.Optional(ThinkingLevelMapSchema),
  input: Type.Optional(
    Type.Array(
      Type.Union([
        Type.Literal("text"),
        Type.Literal("image"),
        Type.Literal("audio"),
        Type.Literal("video"),
      ]),
    ),
  ),
  cost: Type.Optional(
    Type.Object({
      input: Type.Number(),
      output: Type.Number(),
      cacheRead: Type.Number(),
      cacheWrite: Type.Number(),
    }),
  ),
  contextWindow: Type.Optional(Type.Number()),
  maxTokens: Type.Optional(Type.Number()),
  params: Type.Optional(Type.Record(Type.String(), Type.Unknown())),
  headers: Type.Optional(Type.Record(Type.String(), Type.String())),
  compat: Type.Optional(ProviderCompatSchema),
});
const ProviderConfigSchema = Type.Object({
  name: Type.Optional(Type.String({ minLength: 1 })),
  baseUrl: Type.Optional(Type.String({ minLength: 1 })),
  apiKey: Type.Optional(Type.String({ minLength: 1 })),
  auth: Type.Optional(ProviderAuthModeSchema),
  api: Type.Optional(Type.String({ minLength: 1 })),
  headers: Type.Optional(Type.Record(Type.String(), Type.String())),
  compat: Type.Optional(ProviderCompatSchema),
  authHeader: Type.Optional(Type.Boolean()),
  models: Type.Optional(Type.Array(ModelDefinitionSchema)),
});
const validateModelsConfig = Compile(
  Type.Object({
    generatedBy: Type.Optional(Type.String()),
    providers: Type.Record(Type.String(), ProviderConfigSchema),
  }),
);
function formatValidationPath(error) {
  if (error.keyword === "required") {
    const requiredProperty = error.params.requiredProperties?.[0];
    if (requiredProperty) {
      const basePath = error.instancePath.replace(/^\//, "").replace(/\//g, ".");
      return basePath ? `${basePath}.${requiredProperty}` : requiredProperty;
    }
  }
  return error.instancePath.replace(/^\//, "").replace(/\//g, ".") || "root";
}
function allowsMissingProviderApiKey(auth) {
  return auth === "aws-sdk" || auth === "oauth";
}
/** Strip `//` line comments and trailing commas from JSON, leaving string literals untouched. */
function stripJsonComments(input) {
  return input
    .replace(/"(?:\\.|[^"\\])*"|\/\/[^\n]*/g, (m) => (m[0] === '"' ? m : ""))
    .replace(/"(?:\\.|[^"\\])*"|,(\s*[}\]])/g, (m, tail) => tail ?? (m[0] === '"' ? m : ""));
}
function emptyCustomModelsResult(error) {
  return {
    models: [],
    error,
  };
}
function mergeCompat(baseCompat, overrideCompat) {
  if (!overrideCompat) return baseCompat;
  const base = baseCompat;
  const override = overrideCompat;
  const merged = {
    ...base,
    ...override,
  };
  const baseCompletions = base;
  const overrideCompletions = override;
  const mergedCompletions = merged;
  if (baseCompletions?.openRouterRouting || overrideCompletions.openRouterRouting)
    mergedCompletions.openRouterRouting = {
      ...baseCompletions?.openRouterRouting,
      ...overrideCompletions.openRouterRouting,
    };
  if (baseCompletions?.vercelGatewayRouting || overrideCompletions.vercelGatewayRouting)
    mergedCompletions.vercelGatewayRouting = {
      ...baseCompletions?.vercelGatewayRouting,
      ...overrideCompletions.vercelGatewayRouting,
    };
  return merged;
}
/** Clear the config value command cache. Exported for testing. */
const clearApiKeyCache = clearConfigValueCache;
/**
 * Model registry - loads and manages models, resolves API keys via AuthStorage.
 */
var ModelRegistry = class ModelRegistry {
  constructor(authStorage, modelsJsonPath, options = {}) {
    this.models = [];
    this.providerRequestConfigs = /* @__PURE__ */ new Map();
    this.modelRequestHeaders = /* @__PURE__ */ new Map();
    this.registeredProviders = /* @__PURE__ */ new Map();
    this.loadError = void 0;
    this.authStorage = authStorage;
    this.modelsJsonPath = modelsJsonPath;
    this.pluginMetadataSnapshot = resolveModelPluginMetadataSnapshot({
      ...(options.pluginMetadataSnapshot
        ? { pluginMetadataSnapshot: options.pluginMetadataSnapshot }
        : {}),
      ...(options.workspaceDir ? { workspaceDir: options.workspaceDir } : {}),
      allowWorkspaceScopedCurrent: true,
      useRuntimeConfig: true,
    });
    this.loadModels();
  }
  static create(authStorage, modelsJsonPath = join(getAgentDir(), "models.json"), options = {}) {
    return new ModelRegistry(authStorage, modelsJsonPath, options);
  }
  static inMemory(authStorage) {
    return new ModelRegistry(authStorage, void 0);
  }
  /**
   * Reload models from disk (models.json).
   */
  refresh() {
    this.providerRequestConfigs.clear();
    this.modelRequestHeaders.clear();
    this.loadError = void 0;
    resetApiProviders(defaultApiRegistry);
    resetOAuthProviders();
    this.loadModels();
    for (const [providerName, config] of this.registeredProviders.entries())
      this.applyProviderConfig(providerName, config);
  }
  /** Get any root or generated plugin catalog load error. */
  getError() {
    return this.loadError;
  }
  loadModels() {
    const { models: customModels, error } = this.modelsJsonPath
      ? this.loadCustomModels(this.modelsJsonPath)
      : emptyCustomModelsResult();
    if (error) {
      this.loadError = error;
      log.warn(`model catalog load issue: ${error}`);
    }
    let combined = customModels;
    for (const oauthProvider of this.authStorage.getOAuthProviders()) {
      const cred = this.authStorage.get(oauthProvider.id);
      if (cred?.type === "oauth" && oauthProvider.modifyModels)
        combined = oauthProvider.modifyModels(combined, cred);
    }
    this.models = combined;
  }
  loadCustomModels(modelsJsonPath, options = { includePluginCatalogs: true }) {
    if (!existsSync(modelsJsonPath)) return emptyCustomModelsResult();
    try {
      const content = readFileSync(modelsJsonPath, "utf-8");
      const parsed = JSON.parse(stripJsonComments(content));
      if (options.requireGeneratedCatalog === true && !isGeneratedPluginModelCatalog(parsed))
        return emptyCustomModelsResult();
      if (!validateModelsConfig.Check(parsed))
        return emptyCustomModelsResult(
          `Invalid models.json schema:\n${
            validateModelsConfig
              .Errors(parsed)
              .map((error) => `  - ${formatValidationPath(error)}: ${error.message}`)
              .join("\n") || "Unknown schema error"
          }\n\nFile: ${modelsJsonPath}`,
        );
      const config = parsed;
      const providers =
        options.requireGeneratedCatalog === true
          ? filterGeneratedPluginModelCatalogProviders({
              catalogPluginId: options.catalogPluginId,
              parsedCatalog: parsed,
              pluginMetadataSnapshot: this.pluginMetadataSnapshot,
              providers: config.providers,
            })
          : config.providers;
      const configForUse = {
        ...config,
        providers,
      };
      if (options.requireGeneratedCatalog === true && Object.keys(providers).length === 0)
        return emptyCustomModelsResult();
      this.validateConfig(configForUse);
      for (const [providerName, providerConfig] of Object.entries(configForUse.providers))
        if ((providerConfig.models ?? []).length > 0)
          this.storeProviderRequestConfig(providerName, providerConfig);
      const models = this.parseModels(configForUse);
      const pluginCatalogErrors = [];
      if (options.includePluginCatalogs !== false)
        for (const pluginCatalog of listPluginModelCatalogFiles(dirname(modelsJsonPath))) {
          const pluginResult = this.loadCustomModels(pluginCatalog.path, {
            catalogPluginId: pluginCatalog.pluginId,
            includePluginCatalogs: false,
            requireGeneratedCatalog: true,
          });
          if (pluginResult.error) {
            pluginCatalogErrors.push(pluginResult.error);
            continue;
          }
          models.push(...pluginResult.models);
        }
      return {
        models,
        error: pluginCatalogErrors.join("\n\n") || void 0,
      };
    } catch (error) {
      if (error instanceof SyntaxError) {
        if (options.requireGeneratedCatalog === true) return emptyCustomModelsResult();
        return emptyCustomModelsResult(
          `Failed to parse models.json: ${error.message}\n\nFile: ${modelsJsonPath}`,
        );
      }
      return emptyCustomModelsResult(
        `Failed to load models.json: ${error instanceof Error ? error.message : String(error)}\n\nFile: ${modelsJsonPath}`,
      );
    }
  }
  validateConfig(config) {
    for (const [providerName, providerConfig] of Object.entries(config.providers)) {
      const hasProviderApi = Boolean(providerConfig.api);
      const models = providerConfig.models ?? [];
      if (models.length === 0) continue;
      if (!providerConfig.baseUrl)
        throw new Error(
          `Provider ${providerName}: "baseUrl" is required when defining custom models.`,
        );
      if (!providerConfig.apiKey && !allowsMissingProviderApiKey(providerConfig.auth))
        throw new Error(
          `Provider ${providerName}: "apiKey" is required when defining custom models.`,
        );
      for (const modelDef of models) {
        const hasModelApi = Boolean(modelDef.api);
        if (!hasProviderApi && !hasModelApi)
          throw new Error(
            `Provider ${providerName}, model ${modelDef.id}: no "api" specified. Set at provider or model level.`,
          );
        if (!modelDef.id) throw new Error(`Provider ${providerName}: model missing "id"`);
        if (modelDef.contextWindow !== void 0 && modelDef.contextWindow <= 0)
          throw new Error(`Provider ${providerName}, model ${modelDef.id}: invalid contextWindow`);
        if (modelDef.maxTokens !== void 0 && modelDef.maxTokens <= 0)
          throw new Error(`Provider ${providerName}, model ${modelDef.id}: invalid maxTokens`);
      }
    }
  }
  parseModels(config) {
    const models = [];
    for (const [providerName, providerConfig] of Object.entries(config.providers)) {
      const modelDefs = providerConfig.models ?? [];
      if (modelDefs.length === 0) continue;
      for (const modelDef of modelDefs) {
        const api = modelDef.api ?? providerConfig.api;
        if (!api) continue;
        const baseUrl = modelDef.baseUrl ?? providerConfig.baseUrl;
        if (!baseUrl) continue;
        const runtimeInput = (modelDef.input ?? ["text"]).filter(
          (input) => input === "text" || input === "image",
        );
        if ((modelDef.input?.length ?? 0) > 0 && runtimeInput.length === 0) continue;
        const compat = mergeCompat(providerConfig.compat, modelDef.compat);
        this.storeModelHeaders(providerName, modelDef.id, modelDef.headers);
        models.push({
          id: modelDef.id,
          name: modelDef.name ?? modelDef.id,
          api,
          provider: providerName,
          baseUrl,
          reasoning: modelDef.reasoning ?? false,
          thinkingLevelMap: modelDef.thinkingLevelMap,
          input: runtimeInput,
          cost: modelDef.cost ?? {
            input: 0,
            output: 0,
            cacheRead: 0,
            cacheWrite: 0,
          },
          contextWindow: modelDef.contextWindow ?? 128e3,
          maxTokens: modelDef.maxTokens ?? 16384,
          params: modelDef.params,
          headers: void 0,
          compat,
        });
      }
    }
    return models;
  }
  /**
   * Get all configured models.
   */
  getAll() {
    return this.models;
  }
  /**
   * Get only models that have auth configured.
   * This is a fast check that doesn't refresh OAuth tokens.
   */
  getAvailable() {
    return this.models.filter((m) => this.hasConfiguredAuth(m));
  }
  /**
   * Find a model by provider and ID.
   */
  find(provider, modelId) {
    return this.models.find((m) => m.provider === provider && m.id === modelId);
  }
  /**
   * Get API key for a model.
   */
  hasConfiguredAuth(model) {
    return (
      this.authStorage.hasAuth(model.provider) ||
      this.providerRequestConfigs.get(model.provider)?.auth === "aws-sdk" ||
      this.providerRequestConfigs.get(model.provider)?.apiKey !== void 0
    );
  }
  getModelRequestKey(provider, modelId) {
    return `${provider}:${modelId}`;
  }
  storeProviderRequestConfig(providerName, config) {
    if (!config.apiKey && !config.auth && !config.headers && !config.authHeader) return;
    this.providerRequestConfigs.set(providerName, {
      apiKey: config.apiKey,
      auth: config.auth,
      headers: config.headers,
      authHeader: config.authHeader,
    });
  }
  storeModelHeaders(providerName, modelId, headers) {
    const key = this.getModelRequestKey(providerName, modelId);
    if (!headers || Object.keys(headers).length === 0) {
      this.modelRequestHeaders.delete(key);
      return;
    }
    this.modelRequestHeaders.set(key, headers);
  }
  /**
   * Get API key and request headers for a model.
   */
  async getApiKeyAndHeaders(model) {
    try {
      const providerConfig = this.providerRequestConfigs.get(model.provider);
      const usesAwsSdkAuth = providerConfig?.auth === "aws-sdk";
      const apiKey =
        (usesAwsSdkAuth
          ? void 0
          : await this.authStorage.getApiKey(model.provider, { includeFallback: false })) ??
        (!usesAwsSdkAuth && providerConfig?.apiKey
          ? resolveConfigValueOrThrow(
              providerConfig.apiKey,
              `API key for provider "${model.provider}"`,
            )
          : void 0);
      const providerHeaders = resolveHeadersOrThrow(
        providerConfig?.headers,
        `provider "${model.provider}"`,
      );
      const modelHeaders = resolveHeadersOrThrow(
        this.modelRequestHeaders.get(this.getModelRequestKey(model.provider, model.id)),
        `model "${model.provider}/${model.id}"`,
      );
      let headers =
        model.headers || providerHeaders || modelHeaders
          ? {
              ...model.headers,
              ...providerHeaders,
              ...modelHeaders,
            }
          : void 0;
      if (providerConfig?.authHeader) {
        if (!apiKey)
          return {
            ok: false,
            error: `No API key found for "${model.provider}"`,
          };
        headers = {
          ...headers,
          Authorization: `Bearer ${apiKey}`,
        };
      }
      return {
        ok: true,
        apiKey,
        headers: headers && Object.keys(headers).length > 0 ? headers : void 0,
      };
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
  /**
   * Return auth status for a provider, including request auth configured in models.json.
   * This intentionally does not execute command-backed config values.
   */
  getProviderAuthStatus(provider) {
    const providerRequestConfig = this.providerRequestConfigs.get(provider);
    if (providerRequestConfig?.auth === "aws-sdk")
      return {
        configured: true,
        source: "models_json_key",
        label: providerRequestConfig.auth,
      };
    const authStatus = this.authStorage.getAuthStatus(provider);
    if (authStatus.source) return authStatus;
    const providerApiKey = providerRequestConfig?.apiKey;
    if (!providerApiKey) return authStatus;
    if (providerApiKey.startsWith("!"))
      return {
        configured: true,
        source: "models_json_command",
      };
    if (process.env[providerApiKey])
      return {
        configured: true,
        source: "environment",
        label: providerApiKey,
      };
    return {
      configured: true,
      source: "models_json_key",
    };
  }
  /**
   * Get display name for a provider.
   */
  getProviderDisplayName(provider) {
    const registeredProvider = this.registeredProviders.get(provider);
    const oauthProvider = this.authStorage.getOAuthProviders().find((p) => p.id === provider);
    return (
      registeredProvider?.name ??
      registeredProvider?.oauth?.name ??
      oauthProvider?.name ??
      BUILT_IN_PROVIDER_DISPLAY_NAMES[provider] ??
      provider
    );
  }
  /**
   * Get API key for a provider.
   */
  async getApiKeyForProvider(provider) {
    const apiKey = await this.authStorage.getApiKey(provider, { includeFallback: false });
    if (apiKey !== void 0) return apiKey;
    const providerApiKey = this.providerRequestConfigs.get(provider)?.apiKey;
    return providerApiKey ? resolveConfigValueUncached(providerApiKey) : void 0;
  }
  /**
   * Check if a model is using OAuth credentials (subscription).
   */
  isUsingOAuth(model) {
    return this.authStorage.get(model.provider)?.type === "oauth";
  }
  /**
   * Register a provider dynamically (from extensions).
   *
   * If provider has models: replaces all existing models for this provider.
   * Provider-level request settings are stored for already-known models but
   * never create implicit model rows.
   * If provider has oauth: registers OAuth provider for /login support.
   */
  registerProvider(providerName, config) {
    this.validateProviderConfig(providerName, config);
    this.applyProviderConfig(providerName, config);
    this.upsertRegisteredProvider(providerName, config);
  }
  /**
   * Unregister a previously registered provider.
   *
   * Removes the provider from the registry and reloads models from disk.
   * Also resets dynamic OAuth and API stream registrations before reapplying
   * remaining dynamic providers.
   * Has no effect if the provider was never registered.
   */
  unregisterProvider(providerName) {
    if (!this.registeredProviders.has(providerName)) return;
    this.registeredProviders.delete(providerName);
    this.refresh();
  }
  /**
   * Upsert a provider config into registeredProviders.
   * If the provider is already registered, defined values in the incoming config
   * override existing ones; undefined values are preserved from the stored config.
   * If the provider is not registered, the incoming config is stored as-is.
   */
  upsertRegisteredProvider(providerName, config) {
    const existing = this.registeredProviders.get(providerName);
    if (!existing) {
      this.registeredProviders.set(providerName, config);
      return;
    }
    for (const k of Object.keys(config)) if (config[k] !== void 0) existing[k] = config[k];
  }
  validateProviderConfig(providerName, config) {
    if (config.streamSimple && !config.api)
      throw new Error(`Provider ${providerName}: "api" is required when registering streamSimple.`);
    if (!config.models || config.models.length === 0) return;
    if (!config.baseUrl)
      throw new Error(`Provider ${providerName}: "baseUrl" is required when defining models.`);
    if (!config.apiKey && !config.oauth && !allowsMissingProviderApiKey(config.auth))
      throw new Error(
        `Provider ${providerName}: "apiKey" or "oauth" is required when defining models.`,
      );
    for (const modelDef of config.models)
      if (!(modelDef.api || config.api))
        throw new Error(`Provider ${providerName}, model ${modelDef.id}: no "api" specified.`);
  }
  applyProviderConfig(providerName, config) {
    if (config.oauth)
      registerOAuthProvider({
        ...config.oauth,
        id: providerName,
      });
    if (config.streamSimple) {
      const streamSimple = config.streamSimple;
      registerApiProvider(
        {
          api: config.api,
          stream: (model, context, options) => streamSimple(model, context, options),
          streamSimple,
        },
        `provider:${providerName}`,
      );
    }
    this.storeProviderRequestConfig(providerName, config);
    if (config.models && config.models.length > 0) {
      this.models = this.models.filter((m) => m.provider !== providerName);
      for (const modelDef of config.models) {
        const api = modelDef.api || config.api;
        this.storeModelHeaders(providerName, modelDef.id, modelDef.headers);
        this.models.push({
          id: modelDef.id,
          name: modelDef.name,
          api,
          provider: providerName,
          baseUrl: modelDef.baseUrl ?? config.baseUrl,
          reasoning: modelDef.reasoning,
          thinkingLevelMap: modelDef.thinkingLevelMap,
          input: modelDef.input,
          cost: modelDef.cost,
          contextWindow: modelDef.contextWindow,
          maxTokens: modelDef.maxTokens,
          params: modelDef.params,
          headers: void 0,
          compat: modelDef.compat,
        });
      }
      if (config.oauth?.modifyModels) {
        const cred = this.authStorage.get(providerName);
        if (cred?.type === "oauth") this.models = config.oauth.modifyModels(this.models, cred);
      }
    }
  }
};
//#endregion
//#region src/agents/sessions/model-resolver.ts
/**
 * Model resolution, scoping, and initial selection
 */
const VALID_THINKING_LEVELS = ["off", "minimal", "low", "medium", "high", "xhigh", "max"];
function isValidThinkingLevel(level) {
  return VALID_THINKING_LEVELS.includes(level);
}
/**
 * Helper to check if a model ID looks like an alias (no date suffix)
 * Dates are typically in format: -20241022 or -20250929
 */
function isAlias(id) {
  if (id.endsWith("-latest")) return true;
  return !/-\d{8}$/.test(id);
}
/**
 * Find an exact model reference match.
 * Supports either a bare model id or a canonical provider/modelId reference.
 * When matching by bare id, ambiguous matches across providers are rejected.
 */
function findExactModelReferenceMatch(modelReference, availableModels) {
  const trimmedReference = modelReference.trim();
  if (!trimmedReference) return;
  const normalizedReference = trimmedReference.toLowerCase();
  const canonicalMatches = availableModels.filter(
    (model) => `${model.provider}/${model.id}`.toLowerCase() === normalizedReference,
  );
  if (canonicalMatches.length === 1) return canonicalMatches[0];
  if (canonicalMatches.length > 1) return;
  const slashIndex = trimmedReference.indexOf("/");
  if (slashIndex !== -1) {
    const provider = trimmedReference.slice(0, slashIndex).trim();
    const modelId = trimmedReference.slice(slashIndex + 1).trim();
    if (provider && modelId) {
      const providerMatches = availableModels.filter(
        (model) =>
          model.provider.toLowerCase() === provider.toLowerCase() &&
          model.id.toLowerCase() === modelId.toLowerCase(),
      );
      if (providerMatches.length === 1) return providerMatches[0];
      if (providerMatches.length > 1) return;
    }
  }
  const idMatches = availableModels.filter(
    (model) => model.id.toLowerCase() === normalizedReference,
  );
  return idMatches.length === 1 ? idMatches[0] : void 0;
}
/**
 * Try to match a pattern to a model from the available models list.
 * Returns the matched model or undefined if no match found.
 */
function tryMatchModel(modelPattern, availableModels) {
  const exactMatch = findExactModelReferenceMatch(modelPattern, availableModels);
  if (exactMatch) return exactMatch;
  const matches = availableModels.filter(
    (m) =>
      m.id.toLowerCase().includes(modelPattern.toLowerCase()) ||
      m.name?.toLowerCase().includes(modelPattern.toLowerCase()),
  );
  if (matches.length === 0) return;
  const aliases = matches.filter((m) => isAlias(m.id));
  const datedVersions = matches.filter((m) => !isAlias(m.id));
  if (aliases.length > 0) {
    aliases.sort((a, b) => b.id.localeCompare(a.id, void 0, { numeric: true }));
    return aliases[0];
  }
  datedVersions.sort((a, b) => b.id.localeCompare(a.id, void 0, { numeric: true }));
  return datedVersions[0];
}
function buildFallbackModel(provider, modelId, availableModels) {
  const providerModels = availableModels.filter((m) => m.provider === provider);
  if (providerModels.length === 0) return;
  const baseModel = providerModels.at(0);
  if (!baseModel) return;
  return {
    ...baseModel,
    id: modelId,
    name: modelId,
  };
}
function selectAvailableFallbackModel(availableModels) {
  return (
    availableModels.find((model) => model.provider === "openai" && model.id === "gpt-5.6-sol") ??
    availableModels[0]
  );
}
/**
 * Parse a pattern to extract model and thinking level.
 * Handles models with colons in their IDs (e.g., OpenRouter's :exacto suffix).
 *
 * Algorithm:
 * 1. Try to match full pattern as a model
 * 2. If found, return it with "off" thinking level
 * 3. If not found and has colons, split on last colon:
 *    - If suffix is valid thinking level, use it and recurse on prefix
 *    - If suffix is invalid, warn and recurse on prefix with "off"
 *
 * @internal Exported for testing
 */
function parseModelPattern(pattern, availableModels, options) {
  const exactMatch = tryMatchModel(pattern, availableModels);
  if (exactMatch)
    return {
      model: exactMatch,
      thinkingLevel: void 0,
      warning: void 0,
    };
  const lastColonIndex = pattern.lastIndexOf(":");
  if (lastColonIndex === -1)
    return {
      model: void 0,
      thinkingLevel: void 0,
      warning: void 0,
    };
  const prefix = pattern.slice(0, lastColonIndex);
  const suffix = pattern.slice(lastColonIndex + 1);
  if (isValidThinkingLevel(suffix)) {
    const result = parseModelPattern(prefix, availableModels, options);
    if (result.model)
      return {
        model: result.model,
        thinkingLevel: result.warning ? void 0 : suffix,
        warning: result.warning,
      };
    return result;
  }
  if (!(options?.allowInvalidThinkingLevelFallback ?? true))
    return {
      model: void 0,
      thinkingLevel: void 0,
      warning: void 0,
    };
  const result = parseModelPattern(prefix, availableModels, options);
  if (result.model)
    return {
      model: result.model,
      thinkingLevel: void 0,
      warning: `Invalid thinking level "${suffix}" in pattern "${pattern}". Using default instead.`,
    };
  return result;
}
/**
 * Resolve model patterns to actual Model objects with optional thinking levels
 * Format: "pattern:level" where :level is optional
 * For each pattern, finds all matching models and picks the best version:
 * 1. Prefer alias (e.g., claude-sonnet-4-5) over dated versions (claude-sonnet-4-5-20250929)
 * 2. If no alias, pick the latest dated version
 *
 * Supports models with colons in their IDs (e.g., OpenRouter's model:exacto).
 * The algorithm tries to match the full pattern first, then progressively
 * strips colon-suffixes to find a match.
 */
async function resolveModelScope(patterns, modelRegistry) {
  const availableModels = modelRegistry.getAvailable();
  const scopedModels = [];
  for (const pattern of patterns) {
    if (pattern.includes("*") || pattern.includes("?") || pattern.includes("[")) {
      const colonIdx = pattern.lastIndexOf(":");
      let globPattern = pattern;
      let thinkingLevel;
      if (colonIdx !== -1) {
        const suffix = pattern.slice(colonIdx + 1);
        if (isValidThinkingLevel(suffix)) {
          thinkingLevel = suffix;
          globPattern = pattern.slice(0, colonIdx);
        }
      }
      const matchingModels = availableModels.filter((m) => {
        return (
          minimatch(`${m.provider}/${m.id}`, globPattern, { nocase: true }) ||
          minimatch(m.id, globPattern, { nocase: true })
        );
      });
      if (matchingModels.length === 0) {
        console.warn(chalk.yellow(`Warning: No models match pattern "${pattern}"`));
        continue;
      }
      for (const model of matchingModels)
        if (!scopedModels.some((sm) => modelsAreEqual(sm.model, model)))
          scopedModels.push({
            model,
            thinkingLevel,
          });
      continue;
    }
    const { model, thinkingLevel, warning } = parseModelPattern(pattern, availableModels);
    if (warning) console.warn(chalk.yellow(`Warning: ${warning}`));
    if (!model) {
      console.warn(chalk.yellow(`Warning: No models match pattern "${pattern}"`));
      continue;
    }
    if (!scopedModels.some((sm) => modelsAreEqual(sm.model, model)))
      scopedModels.push({
        model,
        thinkingLevel,
      });
  }
  return scopedModels;
}
/**
 * Resolve a single model from CLI flags.
 *
 * Supports:
 * - --provider <provider> --model <pattern>
 * - --model <provider>/<pattern>
 * - Fuzzy matching (same rules as model scoping: exact id, then partial id/name)
 *
 * Note: This does not apply the thinking level by itself, but it may *parse* and
 * return a thinking level from "<pattern>:<thinking>" so the caller can apply it.
 */
function resolveCliModel(options) {
  const { cliProvider, cliModel, modelRegistry } = options;
  if (!cliModel)
    return {
      model: void 0,
      warning: void 0,
      error: void 0,
    };
  const availableModels = modelRegistry.getAll();
  if (availableModels.length === 0)
    return {
      model: void 0,
      warning: void 0,
      error: "No models available. Check your installation or add models to models.json.",
    };
  const providerMap = /* @__PURE__ */ new Map();
  for (const m of availableModels) providerMap.set(m.provider.toLowerCase(), m.provider);
  let provider = cliProvider ? providerMap.get(cliProvider.toLowerCase()) : void 0;
  if (cliProvider && !provider)
    return {
      model: void 0,
      warning: void 0,
      error: `Unknown provider "${cliProvider}". Use --list-models to see available providers/models.`,
    };
  let pattern = cliModel;
  let inferredProvider = false;
  if (!provider) {
    const slashIndex = cliModel.indexOf("/");
    if (slashIndex !== -1) {
      const maybeProvider = cliModel.slice(0, slashIndex);
      const canonical = providerMap.get(maybeProvider.toLowerCase());
      if (canonical) {
        provider = canonical;
        pattern = cliModel.slice(slashIndex + 1);
        inferredProvider = true;
      }
    }
  }
  if (!provider) {
    const lower = cliModel.toLowerCase();
    const exact = availableModels.find(
      (m) => m.id.toLowerCase() === lower || `${m.provider}/${m.id}`.toLowerCase() === lower,
    );
    if (exact)
      return {
        model: exact,
        warning: void 0,
        thinkingLevel: void 0,
        error: void 0,
      };
  }
  if (cliProvider && provider) {
    const prefix = `${provider}/`;
    if (cliModel.toLowerCase().startsWith(prefix.toLowerCase()))
      pattern = cliModel.slice(prefix.length);
  }
  const candidates = provider
    ? availableModels.filter((m) => m.provider === provider)
    : availableModels;
  const { model, thinkingLevel, warning } = parseModelPattern(pattern, candidates, {
    allowInvalidThinkingLevelFallback: false,
  });
  if (model)
    return {
      model,
      thinkingLevel,
      warning,
      error: void 0,
    };
  if (inferredProvider) {
    const lower = cliModel.toLowerCase();
    const exact = availableModels.find(
      (m) => m.id.toLowerCase() === lower || `${m.provider}/${m.id}`.toLowerCase() === lower,
    );
    if (exact)
      return {
        model: exact,
        warning: void 0,
        thinkingLevel: void 0,
        error: void 0,
      };
    const fallback = parseModelPattern(cliModel, availableModels, {
      allowInvalidThinkingLevelFallback: false,
    });
    if (fallback.model)
      return {
        model: fallback.model,
        thinkingLevel: fallback.thinkingLevel,
        warning: fallback.warning,
        error: void 0,
      };
  }
  if (provider) {
    const fallbackModel = buildFallbackModel(provider, pattern, availableModels);
    if (fallbackModel)
      return {
        model: fallbackModel,
        thinkingLevel: void 0,
        warning: warning
          ? `${warning} Model "${pattern}" not found for provider "${provider}". Using custom model id.`
          : `Model "${pattern}" not found for provider "${provider}". Using custom model id.`,
        error: void 0,
      };
  }
  return {
    model: void 0,
    thinkingLevel: void 0,
    warning,
    error: `Model "${provider ? `${provider}/${pattern}` : cliModel}" not found. Use --list-models to see available models.`,
  };
}
/**
 * Find the initial model to use based on priority:
 * 1. CLI args (provider + model)
 * 2. First model from scoped models (if not continuing/resuming)
 * 3. Restored from session (if continuing/resuming)
 * 4. Saved default from settings
 * 5. First available model with valid API key
 */
async function findInitialModel(options) {
  const {
    cliProvider,
    cliModel,
    scopedModels,
    isContinuing,
    defaultProvider,
    defaultModelId,
    defaultThinkingLevel,
    modelRegistry,
  } = options;
  let model;
  let thinkingLevel = DEFAULT_THINKING_LEVEL;
  if (cliProvider && cliModel) {
    const resolved = resolveCliModel({
      cliProvider,
      cliModel,
      modelRegistry,
    });
    if (resolved.error) {
      console.error(chalk.red(resolved.error));
      process.exit(1);
    }
    if (resolved.model)
      return {
        model: resolved.model,
        thinkingLevel: DEFAULT_THINKING_LEVEL,
        fallbackMessage: void 0,
      };
  }
  if (scopedModels.length > 0 && !isContinuing) {
    const scopedModel = scopedModels.at(0);
    if (!scopedModel) throw new Error("Scoped model list became empty during selection");
    return {
      model: scopedModel.model,
      thinkingLevel: scopedModel.thinkingLevel ?? defaultThinkingLevel ?? "medium",
      fallbackMessage: void 0,
    };
  }
  if (defaultProvider && defaultModelId) {
    const found = modelRegistry.find(defaultProvider, defaultModelId);
    if (found) {
      model = found;
      if (defaultThinkingLevel) thinkingLevel = defaultThinkingLevel;
      return {
        model,
        thinkingLevel,
        fallbackMessage: void 0,
      };
    }
  }
  const availableModels = modelRegistry.getAvailable();
  if (availableModels.length > 0)
    return {
      model: selectAvailableFallbackModel(availableModels),
      thinkingLevel: DEFAULT_THINKING_LEVEL,
      fallbackMessage: void 0,
    };
  return {
    model: void 0,
    thinkingLevel: DEFAULT_THINKING_LEVEL,
    fallbackMessage: void 0,
  };
}
/**
 * Restore model from session, with fallback to available models
 */
async function restoreModelFromSession(
  savedProvider,
  savedModelId,
  currentModel,
  shouldPrintMessages,
  modelRegistry,
) {
  const restoredModel = modelRegistry.find(savedProvider, savedModelId);
  const hasConfiguredAuth = restoredModel ? modelRegistry.hasConfiguredAuth(restoredModel) : false;
  if (restoredModel && hasConfiguredAuth) {
    if (shouldPrintMessages)
      console.log(chalk.dim(`Restored model: ${savedProvider}/${savedModelId}`));
    return {
      model: restoredModel,
      fallbackMessage: void 0,
    };
  }
  const reason = !restoredModel ? "model no longer exists" : "no auth configured";
  if (shouldPrintMessages)
    console.error(
      chalk.yellow(
        `Warning: Could not restore model ${savedProvider}/${savedModelId} (${reason}).`,
      ),
    );
  if (currentModel) {
    if (shouldPrintMessages)
      console.log(chalk.dim(`Falling back to: ${currentModel.provider}/${currentModel.id}`));
    return {
      model: currentModel,
      fallbackMessage: `Could not restore model ${savedProvider}/${savedModelId} (${reason}). Using ${currentModel.provider}/${currentModel.id}.`,
    };
  }
  const availableModels = modelRegistry.getAvailable();
  if (availableModels.length > 0) {
    const fallbackModel = selectAvailableFallbackModel(availableModels);
    if (!fallbackModel)
      return {
        model: void 0,
        fallbackMessage: `Could not restore model ${savedProvider}/${savedModelId} (${reason}). No models available.`,
      };
    if (shouldPrintMessages)
      console.log(chalk.dim(`Falling back to: ${fallbackModel.provider}/${fallbackModel.id}`));
    return {
      model: fallbackModel,
      fallbackMessage: `Could not restore model ${savedProvider}/${savedModelId} (${reason}). Using ${fallbackModel.provider}/${fallbackModel.id}.`,
    };
  }
  return {
    model: void 0,
    fallbackMessage: void 0,
  };
}
//#endregion
//#region src/shared/ignore-rules.ts
const IGNORE_FILE_NAMES = [".gitignore", ".ignore", ".fdignore"];
function toPosixPath(pathValue) {
  return pathValue.split(sep).join("/");
}
/** Adds nested ignore-file rules to a matcher using paths relative to the scan root. */
function addIgnoreRules(ig, dir, rootDir) {
  const relativeDir = relative(rootDir, dir);
  const prefix = relativeDir ? `${toPosixPath(relativeDir)}/` : "";
  for (const filename of IGNORE_FILE_NAMES) {
    const ignorePath = join(dir, filename);
    if (!existsSync(ignorePath)) continue;
    try {
      const patterns = readFileSync(ignorePath, "utf-8")
        .split(/\r?\n/)
        .map((line) => prefixIgnorePattern(line, prefix))
        .filter((line) => Boolean(line));
      if (patterns.length > 0) ig.add(patterns);
    } catch {}
  }
}
function prefixIgnorePattern(line, prefix) {
  const trimmed = line.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("#") && !trimmed.startsWith("\\#")) return null;
  let pattern = line;
  let negated = false;
  if (pattern.startsWith("!")) {
    negated = true;
    pattern = pattern.slice(1);
  } else if (pattern.startsWith("\\!")) pattern = pattern.slice(1);
  if (pattern.startsWith("/")) pattern = pattern.slice(1);
  const prefixed = prefix ? `${prefix}${pattern}` : pattern;
  return negated ? `!${prefixed}` : prefixed;
}
//#endregion
//#region src/agents/utils/git.ts
/**
 * Git source parsing helpers.
 *
 * Normalizes git-style package references into clone URL, host/path, and optional ref metadata.
 */
function splitPathRef(params) {
  const refSeparator = params.pathWithMaybeRef.indexOf("@");
  if (refSeparator < 0) return { repo: params.originalRepo };
  const repoPath = params.pathWithMaybeRef.slice(0, refSeparator);
  const ref = params.pathWithMaybeRef.slice(refSeparator + 1);
  if (!repoPath || !ref) return { repo: params.originalRepo };
  return {
    repo: params.buildRepo(repoPath),
    ref,
  };
}
function splitRef(url) {
  const scpLikeMatch = url.match(/^git@([^:]+):(.+)$/);
  if (scpLikeMatch)
    return splitPathRef({
      originalRepo: url,
      pathWithMaybeRef: scpLikeMatch[2] ?? "",
      buildRepo: (repoPath) => `git@${scpLikeMatch[1] ?? ""}:${repoPath}`,
    });
  if (url.includes("://"))
    try {
      const parsed = new URL(url);
      return splitPathRef({
        originalRepo: url,
        pathWithMaybeRef: parsed.pathname.replace(/^\/+/, ""),
        buildRepo: (repoPath) => {
          parsed.pathname = `/${repoPath}`;
          return parsed.toString().replace(/\/$/, "");
        },
      });
    } catch {
      return { repo: url };
    }
  const slashIndex = url.indexOf("/");
  if (slashIndex < 0) return { repo: url };
  const host = url.slice(0, slashIndex);
  return splitPathRef({
    originalRepo: url,
    pathWithMaybeRef: url.slice(slashIndex + 1),
    buildRepo: (repoPath) => `${host}/${repoPath}`,
  });
}
function parseGenericGitUrl(url) {
  const { repo: repoWithoutRef, ref } = splitRef(url);
  let repo = repoWithoutRef;
  let host;
  let path;
  const scpLikeMatch = repoWithoutRef.match(/^git@([^:]+):(.+)$/);
  if (scpLikeMatch) {
    host = scpLikeMatch[1] ?? "";
    path = scpLikeMatch[2] ?? "";
  } else if (
    repoWithoutRef.startsWith("https://") ||
    repoWithoutRef.startsWith("http://") ||
    repoWithoutRef.startsWith("ssh://") ||
    repoWithoutRef.startsWith("git://")
  )
    try {
      const parsed = new URL(repoWithoutRef);
      host = parsed.hostname;
      path = parsed.pathname.replace(/^\/+/, "");
    } catch {
      return null;
    }
  else {
    const slashIndex = repoWithoutRef.indexOf("/");
    if (slashIndex < 0) return null;
    host = repoWithoutRef.slice(0, slashIndex);
    path = repoWithoutRef.slice(slashIndex + 1);
    if (!host.includes(".") && host !== "localhost") return null;
    repo = `https://${repoWithoutRef}`;
  }
  const normalizedPath = normalizeGitPath(path);
  if (!isSafeGitHost(host) || !normalizedPath) return null;
  return {
    type: "git",
    repo,
    host,
    path: normalizedPath,
    ref,
    pinned: Boolean(ref),
  };
}
function isSafeGitHost(host) {
  return (
    Boolean(host) && !host.includes("/") && !host.includes("\\") && host !== "." && host !== ".."
  );
}
function normalizeGitPath(path) {
  const segments = path
    .replace(/\.git$/, "")
    .replace(/^\/+/, "")
    .split("/");
  if (segments.length < 2) return null;
  if (
    segments.some(
      (segment) => !segment || segment === "." || segment === ".." || segment.includes("\\"),
    )
  )
    return null;
  return segments.join("/");
}
function resolveHostedGitSource(params) {
  const info = hostedGitInfo.fromUrl(params.candidate);
  if (!info) return null;
  if (params.split.ref && info.project?.includes("@")) return null;
  const host = info.domain || "";
  const path = normalizeGitPath(`${info.user}/${info.project}`);
  if (!isSafeGitHost(host) || !path) return null;
  return {
    type: "git",
    repo: params.repo,
    host,
    path,
    ref: info.committish || params.split.ref || void 0,
    pinned: Boolean(info.committish || params.split.ref),
  };
}
/**
 * Parse git source into a GitSource.
 *
 * Rules:
 * - With git: prefix, accept all historical shorthand forms.
 * - Without git: prefix, only accept explicit protocol URLs.
 */
function parseGitUrl(source) {
  const trimmed = source.trim();
  const hasGitPrefix = trimmed.startsWith("git:");
  const url = hasGitPrefix ? trimmed.slice(4).trim() : trimmed;
  if (!hasGitPrefix && !/^(https?|ssh|git):\/\//i.test(url)) return null;
  const split = splitRef(url);
  const hostedCandidates = [split.ref ? `${split.repo}#${split.ref}` : void 0, url].filter(
    (value) => Boolean(value),
  );
  for (const candidate of hostedCandidates) {
    const parsed = resolveHostedGitSource({
      candidate,
      split,
      repo:
        !split.repo.startsWith("http://") &&
        !split.repo.startsWith("https://") &&
        !split.repo.startsWith("ssh://") &&
        !split.repo.startsWith("git://") &&
        !split.repo.startsWith("git@")
          ? `https://${split.repo}`
          : split.repo,
    });
    if (parsed) return parsed;
  }
  const httpsCandidates = [
    split.ref ? `https://${split.repo}#${split.ref}` : void 0,
    `https://${url}`,
  ].filter((value) => Boolean(value));
  for (const candidate of httpsCandidates) {
    const parsed = resolveHostedGitSource({
      candidate,
      split,
      repo: `https://${split.repo}`,
    });
    if (parsed) return parsed;
  }
  return parseGenericGitUrl(url);
}
//#endregion
//#region src/agents/sessions/package-manager.ts
/**
 * Session package/resource manager.
 *
 * Resolves extension, skill, prompt, and theme sources from npm, git, local paths, and project manifests.
 */
/**
 * Compute a numeric precedence rank for a resource based on its metadata.
 * Lower rank = higher precedence. Used to sort resolved resources so that
 * name-collision resolution ("first wins") produces the correct outcome.
 *
 * Precedence (highest to lowest):
 *   0  project + settings entry (source: "local", scope: "project")
 *   1  project + auto-discovered (source: "auto", scope: "project")
 *   2  user + settings entry (source: "local", scope: "user")
 *   3  user + auto-discovered (source: "auto", scope: "user")
 *   4  package resource (origin: "package")
 */
function resourcePrecedenceRank(m) {
  if (m.origin === "package") return 4;
  return (m.scope === "project" ? 0 : 2) + (m.source === "local" ? 0 : 1);
}
const RESOURCE_TYPES = ["extensions", "skills", "prompts", "themes"];
const FILE_PATTERNS = {
  extensions: /\.(ts|js)$/,
  skills: /\.md$/,
  prompts: /\.md$/,
  themes: /\.json$/,
};
function getHomeDir() {
  return process.env.HOME || homedir();
}
function isPattern(s) {
  return (
    s.startsWith("!") ||
    s.startsWith("+") ||
    s.startsWith("-") ||
    s.includes("*") ||
    s.includes("?")
  );
}
function isOverridePattern(s) {
  return s.startsWith("!") || s.startsWith("+") || s.startsWith("-");
}
function hasGlobPattern(s) {
  return s.includes("*") || s.includes("?");
}
function splitPatterns(entries) {
  const plain = [];
  const patterns = [];
  for (const entry of entries)
    if (isPattern(entry)) patterns.push(entry);
    else plain.push(entry);
  return {
    plain,
    patterns,
  };
}
function collectFiles(dir, filePattern, skipNodeModules = true, ignoreMatcher, rootDir) {
  const files = [];
  if (!existsSync(dir)) return files;
  const root = rootDir ?? dir;
  const ig = ignoreMatcher ?? ignore();
  addIgnoreRules(ig, dir, root);
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith(".")) continue;
      if (skipNodeModules && entry.name === "node_modules") continue;
      const fullPath = join(dir, entry.name);
      let isDir = entry.isDirectory();
      let isFile = entry.isFile();
      if (entry.isSymbolicLink())
        try {
          const stats = statSync(fullPath);
          isDir = stats.isDirectory();
          isFile = stats.isFile();
        } catch {
          continue;
        }
      const relPath = toPosixPath(relative(root, fullPath));
      const ignorePath = isDir ? `${relPath}/` : relPath;
      if (ig.ignores(ignorePath)) continue;
      if (isDir) files.push(...collectFiles(fullPath, filePattern, skipNodeModules, ig, root));
      else if (isFile && filePattern.test(entry.name)) files.push(fullPath);
    }
  } catch {}
  return files;
}
function collectSkillEntries(dir, mode, ignoreMatcher, rootDir) {
  const entries = [];
  if (!existsSync(dir)) return entries;
  const root = rootDir ?? dir;
  const ig = ignoreMatcher ?? ignore();
  addIgnoreRules(ig, dir, root);
  try {
    const dirEntries = readdirSync(dir, { withFileTypes: true });
    for (const entry of dirEntries) {
      if (entry.name !== "SKILL.md") continue;
      const fullPath = join(dir, entry.name);
      if (!isRealPathWithinRoot(root, fullPath)) continue;
      let isFile = entry.isFile();
      if (entry.isSymbolicLink())
        try {
          isFile = statSync(fullPath).isFile();
        } catch {
          continue;
        }
      const relPath = toPosixPath(relative(root, fullPath));
      if (isFile && !ig.ignores(relPath)) {
        entries.push(fullPath);
        return entries;
      }
    }
    for (const entry of dirEntries) {
      if (entry.name.startsWith(".")) continue;
      if (entry.name === "node_modules") continue;
      const fullPath = join(dir, entry.name);
      if (!isRealPathWithinRoot(root, fullPath)) continue;
      let isDir = entry.isDirectory();
      let isFile = entry.isFile();
      if (entry.isSymbolicLink())
        try {
          const stats = statSync(fullPath);
          isDir = stats.isDirectory();
          isFile = stats.isFile();
        } catch {
          continue;
        }
      const relPath = toPosixPath(relative(root, fullPath));
      if (
        mode === "openclaw" &&
        dir === root &&
        isFile &&
        entry.name.endsWith(".md") &&
        !ig.ignores(relPath)
      ) {
        entries.push(fullPath);
        continue;
      }
      if (!isDir) continue;
      if (ig.ignores(`${relPath}/`)) continue;
      entries.push(...collectSkillEntries(fullPath, mode, ig, root));
    }
  } catch {}
  return entries;
}
function collectAutoSkillEntries(dir, mode) {
  return collectSkillEntries(dir, mode);
}
function findGitRepoRoot(startDir) {
  let dir = resolve(startDir);
  while (true) {
    if (existsSync(join(dir, ".git"))) return dir;
    const parent = dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}
function collectAncestorAgentsSkillDirs(startDir) {
  const skillDirs = [];
  const resolvedStartDir = resolve(startDir);
  const gitRepoRoot = findGitRepoRoot(resolvedStartDir);
  let dir = resolvedStartDir;
  while (true) {
    skillDirs.push(join(dir, ".agents", "skills"));
    if (gitRepoRoot && dir === gitRepoRoot) break;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return skillDirs;
}
function collectTopLevelAutoResourceEntries(dir, resourceType) {
  const entries = [];
  if (!existsSync(dir)) return entries;
  const ig = ignore();
  addIgnoreRules(ig, dir, dir);
  try {
    const dirEntries = readdirSync(dir, { withFileTypes: true });
    for (const entry of dirEntries) {
      if (entry.name.startsWith(".")) continue;
      if (entry.name === "node_modules") continue;
      const fullPath = join(dir, entry.name);
      if (!isRealPathWithinRoot(dir, fullPath)) continue;
      let isFile = entry.isFile();
      if (entry.isSymbolicLink())
        try {
          isFile = statSync(fullPath).isFile();
        } catch {
          continue;
        }
      const relPath = toPosixPath(relative(dir, fullPath));
      if (ig.ignores(relPath)) continue;
      if (isFile && FILE_PATTERNS[resourceType].test(entry.name)) entries.push(fullPath);
    }
  } catch {}
  return entries;
}
function readResourceManifestFile(packageJsonPath) {
  try {
    const content = readFileSync(packageJsonPath, "utf-8");
    return JSON.parse(content).openclaw ?? null;
  } catch {
    return null;
  }
}
function resolveExtensionEntries$1(dir, rootDir = dir) {
  const packageJsonPath = join(dir, "package.json");
  if (existsSync(packageJsonPath)) {
    const manifest = readResourceManifestFile(packageJsonPath);
    if (manifest?.extensions?.length) {
      const entries = [];
      for (const extPath of manifest.extensions) {
        const resolvedExtPath = resolve(dir, extPath);
        if (existsSync(resolvedExtPath) && isRealPathWithinRoot(rootDir, resolvedExtPath))
          entries.push(resolvedExtPath);
      }
      if (entries.length > 0) return entries;
    }
  }
  const indexTs = join(dir, "index.ts");
  const indexJs = join(dir, "index.js");
  if (existsSync(indexTs) && isRealPathWithinRoot(rootDir, indexTs)) return [indexTs];
  if (existsSync(indexJs) && isRealPathWithinRoot(rootDir, indexJs)) return [indexJs];
  return null;
}
function collectAutoExtensionEntries(dir) {
  const entries = [];
  if (!existsSync(dir)) return entries;
  const rootEntries = resolveExtensionEntries$1(dir);
  if (rootEntries) return rootEntries;
  const ig = ignore();
  addIgnoreRules(ig, dir, dir);
  try {
    const dirEntries = readdirSync(dir, { withFileTypes: true });
    for (const entry of dirEntries) {
      if (entry.name.startsWith(".")) continue;
      if (entry.name === "node_modules") continue;
      const fullPath = join(dir, entry.name);
      if (!isRealPathWithinRoot(dir, fullPath)) continue;
      let isDir = entry.isDirectory();
      let isFile = entry.isFile();
      if (entry.isSymbolicLink())
        try {
          const stats = statSync(fullPath);
          isDir = stats.isDirectory();
          isFile = stats.isFile();
        } catch {
          continue;
        }
      const relPath = toPosixPath(relative(dir, fullPath));
      const ignorePath = isDir ? `${relPath}/` : relPath;
      if (ig.ignores(ignorePath)) continue;
      if (isFile && (entry.name.endsWith(".ts") || entry.name.endsWith(".js")))
        entries.push(fullPath);
      else if (isDir) {
        const resolvedEntries = resolveExtensionEntries$1(fullPath, dir);
        if (resolvedEntries) entries.push(...resolvedEntries);
      }
    }
  } catch {}
  return entries;
}
/**
 * Collect resource files from a directory based on resource type.
 * Extensions use smart discovery (index.ts in subdirs), others use recursive collection.
 */
function collectResourceFiles(dir, resourceType) {
  if (resourceType === "skills") return collectSkillEntries(dir, "openclaw");
  if (resourceType === "extensions") return collectAutoExtensionEntries(dir);
  return collectFiles(dir, FILE_PATTERNS[resourceType]);
}
function resolveRealPathIfPossible(path) {
  try {
    return realpathSync.native(path);
  } catch {
    return resolve(path);
  }
}
function isPathWithinRoot(root, candidate) {
  const rel = relative(root, candidate);
  return rel === "" || (rel !== "" && !rel.startsWith("..") && !isAbsolute(rel));
}
function isRealPathWithinRoot(root, candidate) {
  return isPathWithinRoot(
    resolveRealPathIfPossible(resolve(root)),
    resolveRealPathIfPossible(candidate),
  );
}
function getMatchCandidates(filePath, baseDir, includeNames) {
  const name = basename(filePath);
  const candidates = [toPosixPath(relative(baseDir, filePath)), toPosixPath(filePath)];
  if (includeNames) candidates.push(name);
  if (name === "SKILL.md") {
    const parentDir = dirname(filePath);
    candidates.push(toPosixPath(relative(baseDir, parentDir)), toPosixPath(parentDir));
    if (includeNames) candidates.push(basename(parentDir));
  }
  return candidates;
}
function matchesAnyPattern(filePath, patterns, baseDir) {
  const candidates = getMatchCandidates(filePath, baseDir, true);
  return patterns.some((pattern) => minimatch.match(candidates, toPosixPath(pattern)).length > 0);
}
function normalizeExactPattern(pattern) {
  return toPosixPath(
    pattern.startsWith("./") || pattern.startsWith(".\\") ? pattern.slice(2) : pattern,
  );
}
function matchesAnyExactPattern(filePath, patterns, baseDir) {
  const candidates = new Set(getMatchCandidates(filePath, baseDir, false));
  return patterns.some((pattern) => candidates.has(normalizeExactPattern(pattern)));
}
function isEnabledByOverrides(filePath, patterns, baseDir) {
  return applyPatterns([filePath], patterns.filter(isOverridePattern), baseDir).has(filePath);
}
/**
 * Apply patterns to paths and return a Set of enabled paths.
 * Pattern types:
 * - Plain patterns: include matching paths
 * - `!pattern`: exclude matching paths
 * - `+path`: force-include exact path (overrides exclusions)
 * - `-path`: force-exclude exact path (overrides force-includes)
 */
function applyPatterns(allPaths, patterns, baseDir) {
  const includes = [];
  const excludes = [];
  const forceIncludes = [];
  const forceExcludes = [];
  for (const p of patterns)
    if (p.startsWith("+")) forceIncludes.push(p.slice(1));
    else if (p.startsWith("-")) forceExcludes.push(p.slice(1));
    else if (p.startsWith("!")) excludes.push(p.slice(1));
    else includes.push(p);
  let result;
  if (includes.length === 0) result = [...allPaths];
  else result = allPaths.filter((filePath) => matchesAnyPattern(filePath, includes, baseDir));
  if (excludes.length > 0)
    result = result.filter((filePath) => !matchesAnyPattern(filePath, excludes, baseDir));
  if (forceIncludes.length > 0) {
    for (const filePath of allPaths)
      if (!result.includes(filePath) && matchesAnyExactPattern(filePath, forceIncludes, baseDir))
        result.push(filePath);
  }
  if (forceExcludes.length > 0)
    result = result.filter((filePath) => !matchesAnyExactPattern(filePath, forceExcludes, baseDir));
  return new Set(result);
}
var DefaultPackageManager = class {
  constructor(options) {
    this.cwd = options.cwd;
    this.agentDir = options.agentDir;
    this.settingsManager = options.settingsManager;
  }
  async resolve(onMissing) {
    const accumulator = this.createAccumulator();
    const globalSettings = this.settingsManager.getGlobalSettings();
    const projectSettings = this.settingsManager.getProjectSettings();
    const allPackages = [];
    for (const pkg of projectSettings.packages ?? [])
      allPackages.push({
        pkg,
        scope: "project",
      });
    for (const pkg of globalSettings.packages ?? [])
      allPackages.push({
        pkg,
        scope: "user",
      });
    const packageSources = this.dedupePackages(allPackages);
    await this.resolvePackageSources(packageSources, accumulator, onMissing);
    const globalBaseDir = this.agentDir;
    const projectBaseDir = join(this.cwd, CONFIG_DIR_NAME);
    for (const resourceType of RESOURCE_TYPES) {
      const target = this.getTargetMap(accumulator, resourceType);
      const globalEntries = globalSettings[resourceType] ?? [];
      const projectEntries = projectSettings[resourceType] ?? [];
      this.resolveLocalEntries(
        projectEntries,
        resourceType,
        target,
        {
          source: "local",
          scope: "project",
          origin: "top-level",
        },
        projectBaseDir,
      );
      this.resolveLocalEntries(
        globalEntries,
        resourceType,
        target,
        {
          source: "local",
          scope: "user",
          origin: "top-level",
        },
        globalBaseDir,
      );
    }
    this.addAutoDiscoveredResources(
      accumulator,
      globalSettings,
      projectSettings,
      globalBaseDir,
      projectBaseDir,
    );
    return this.toResolvedPaths(accumulator);
  }
  async resolveExtensionSources(sources, options) {
    const accumulator = this.createAccumulator();
    const scope = options?.temporary ? "temporary" : options?.local ? "project" : "user";
    const packageSources = sources.map((source) => ({
      pkg: source,
      scope,
    }));
    await this.resolvePackageSources(packageSources, accumulator);
    return this.toResolvedPaths(accumulator);
  }
  async resolvePackageSources(sources, accumulator, onMissing) {
    for (const { pkg, scope } of sources) {
      const sourceStr = typeof pkg === "string" ? pkg : pkg.source;
      const filter = typeof pkg === "object" ? pkg : void 0;
      const parsed = this.parseSource(sourceStr);
      const metadata = {
        source: sourceStr,
        scope,
        origin: "package",
      };
      if (parsed.type === "local") {
        const baseDir = this.getBaseDirForScope(scope);
        this.resolveLocalExtensionSource(parsed, accumulator, filter, metadata, baseDir);
        continue;
      }
      const handleMissing = async () => {
        if (!onMissing) return;
        if ((await onMissing(sourceStr)) === "error")
          throw new Error(`Missing source: ${sourceStr}`);
      };
      if (parsed.type === "npm") {
        const installedPath = this.getNpmInstallPath(parsed, scope);
        if (
          !existsSync(installedPath) ||
          (parsed.pinned && !this.installedNpmMatchesPinnedVersion(parsed, installedPath))
        ) {
          await handleMissing();
          continue;
        }
        metadata.baseDir = installedPath;
        this.collectPackageResources(installedPath, accumulator, filter, metadata);
        continue;
      }
      if (parsed.type === "git") {
        const installedPath = this.getGitInstallPath(parsed, scope);
        if (!existsSync(installedPath)) {
          await handleMissing();
          continue;
        }
        metadata.baseDir = installedPath;
        this.collectPackageResources(installedPath, accumulator, filter, metadata);
      }
    }
  }
  resolveLocalExtensionSource(source, accumulator, filter, metadata, baseDir) {
    const resolved = this.resolvePathFromBase(source.path, baseDir);
    if (!existsSync(resolved)) return;
    try {
      const stats = statSync(resolved);
      if (stats.isFile()) {
        metadata.baseDir = dirname(resolved);
        this.addResource(accumulator.extensions, resolved, metadata, true);
        return;
      }
      if (stats.isDirectory()) {
        metadata.baseDir = resolved;
        if (!this.collectPackageResources(resolved, accumulator, filter, metadata))
          this.addResource(accumulator.extensions, resolved, metadata, true);
      }
    } catch {}
  }
  parseSource(source) {
    if (source.startsWith("npm:")) {
      const spec = source.slice(4).trim();
      const { name, version } = this.parseNpmSpec(spec);
      return {
        type: "npm",
        spec,
        name,
        pinned: Boolean(version),
      };
    }
    if (isLocalPath(source))
      return {
        type: "local",
        path: source,
      };
    const gitParsed = parseGitUrl(source);
    if (gitParsed) return gitParsed;
    return {
      type: "local",
      path: source,
    };
  }
  installedNpmMatchesPinnedVersion(source, installedPath) {
    const installedVersion = this.getInstalledNpmVersion(installedPath);
    if (!installedVersion) return false;
    const { version: pinnedVersion } = this.parseNpmSpec(source.spec);
    if (!pinnedVersion) return true;
    return installedVersion === pinnedVersion;
  }
  getInstalledNpmVersion(installedPath) {
    const packageJsonPath = join(installedPath, "package.json");
    if (!existsSync(packageJsonPath)) return;
    try {
      const content = readFileSync(packageJsonPath, "utf-8");
      return JSON.parse(content).version;
    } catch {
      return;
    }
  }
  /**
   * Get a unique identity for a package, ignoring version/ref.
   * Used to detect when the same package is in both global and project settings.
   * For git packages, uses normalized host/path to ensure SSH and HTTPS URLs
   * for the same repository are treated as identical.
   */
  getPackageIdentity(source, scope) {
    const parsed = this.parseSource(source);
    if (parsed.type === "npm") return `npm:${parsed.name}`;
    if (parsed.type === "git") return `git:${parsed.host}/${parsed.path}`;
    if (scope) {
      const baseDir = this.getBaseDirForScope(scope);
      return `local:${this.resolvePathFromBase(parsed.path, baseDir)}`;
    }
    return `local:${this.resolvePath(parsed.path)}`;
  }
  /**
   * Dedupe packages: if same package identity appears in both global and project,
   * keep only the project one (project wins).
   */
  dedupePackages(packages) {
    const seen = /* @__PURE__ */ new Map();
    for (const entry of packages) {
      const sourceStr = typeof entry.pkg === "string" ? entry.pkg : entry.pkg.source;
      const identity = this.getPackageIdentity(sourceStr, entry.scope);
      const existing = seen.get(identity);
      if (!existing) seen.set(identity, entry);
      else if (entry.scope === "project" && existing.scope === "user") seen.set(identity, entry);
    }
    return Array.from(seen.values());
  }
  parseNpmSpec(spec) {
    const match = spec.match(/^(@?[^@]+(?:\/[^@]+)?)(?:@(.+))?$/);
    if (!match) return { name: spec };
    return {
      name: match[1] ?? spec,
      version: match[2],
    };
  }
  getNpmInstallPath(source, scope) {
    if (scope === "temporary")
      return join(this.getTemporaryDir("npm"), "node_modules", source.name);
    if (scope === "project")
      return join(this.cwd, CONFIG_DIR_NAME, "npm", "node_modules", source.name);
    return join(this.agentDir, "npm", "node_modules", source.name);
  }
  getGitInstallPath(source, scope) {
    if (scope === "temporary") return this.getTemporaryDir(`git-${source.host}`, source.path);
    if (scope === "project")
      return join(this.cwd, CONFIG_DIR_NAME, "git", source.host, source.path);
    return join(this.agentDir, "git", source.host, source.path);
  }
  getTemporaryDir(prefix, suffix) {
    const hash = createHash("sha256")
      .update(`${prefix}-${suffix ?? ""}`)
      .digest("hex")
      .slice(0, 8);
    return join(tmpdir(), "openclaw-resources", prefix, hash, suffix ?? "");
  }
  getBaseDirForScope(scope) {
    if (scope === "project") return join(this.cwd, CONFIG_DIR_NAME);
    if (scope === "user") return this.agentDir;
    return this.cwd;
  }
  resolvePath(input) {
    const trimmed = input.trim();
    if (trimmed === "~") return getHomeDir();
    if (trimmed.startsWith("~/")) return join(getHomeDir(), trimmed.slice(2));
    if (trimmed.startsWith("~")) return join(getHomeDir(), trimmed.slice(1));
    return resolve(this.cwd, trimmed);
  }
  resolvePathFromBase(input, baseDir) {
    const trimmed = input.trim();
    if (trimmed === "~") return getHomeDir();
    if (trimmed.startsWith("~/")) return join(getHomeDir(), trimmed.slice(2));
    if (trimmed.startsWith("~")) return join(getHomeDir(), trimmed.slice(1));
    return resolve(baseDir, trimmed);
  }
  collectPackageResources(packageRoot, accumulator, filter, metadata) {
    if (filter) {
      for (const resourceType of RESOURCE_TYPES) {
        const patterns = filter[resourceType];
        const target = this.getTargetMap(accumulator, resourceType);
        if (patterns !== void 0)
          this.applyPackageFilter(packageRoot, patterns, resourceType, target, metadata);
        else this.collectDefaultResources(packageRoot, resourceType, target, metadata);
      }
      return true;
    }
    const manifest = this.readResourceManifest(packageRoot);
    if (manifest) {
      for (const resourceType of RESOURCE_TYPES) {
        const entries = manifest[resourceType];
        this.addManifestEntries(
          entries,
          packageRoot,
          resourceType,
          this.getTargetMap(accumulator, resourceType),
          metadata,
        );
      }
      return true;
    }
    let hasAnyDir = false;
    for (const resourceType of RESOURCE_TYPES)
      if (existsSync(join(packageRoot, resourceType))) {
        const files = this.collectConventionResourceFiles(packageRoot, resourceType);
        for (const f of files)
          this.addResource(this.getTargetMap(accumulator, resourceType), f, metadata, true);
        hasAnyDir = true;
      }
    return hasAnyDir;
  }
  collectDefaultResources(packageRoot, resourceType, target, metadata) {
    const entries = this.readResourceManifest(packageRoot)?.[resourceType];
    if (entries) {
      this.addManifestEntries(entries, packageRoot, resourceType, target, metadata);
      return;
    }
    if (existsSync(join(packageRoot, resourceType))) {
      const files = this.collectConventionResourceFiles(packageRoot, resourceType);
      for (const f of files) this.addResource(target, f, metadata, true);
    }
  }
  applyPackageFilter(packageRoot, userPatterns, resourceType, target, metadata) {
    const { allFiles } = this.collectManifestFiles(packageRoot, resourceType);
    if (userPatterns.length === 0) {
      for (const f of allFiles) this.addResource(target, f, metadata, false);
      return;
    }
    const enabledByUser = applyPatterns(allFiles, userPatterns, packageRoot);
    for (const f of allFiles) {
      const enabled = enabledByUser.has(f);
      this.addResource(target, f, metadata, enabled);
    }
  }
  /**
   * Collect all files from a package for a resource type, applying manifest patterns.
   * Returns { allFiles, enabledByManifest } where enabledByManifest is the set of files
   * that pass the manifest's own patterns.
   */
  collectManifestFiles(packageRoot, resourceType) {
    const entries = this.readResourceManifest(packageRoot)?.[resourceType];
    if (entries && entries.length > 0) {
      const allFiles = this.collectFilesFromManifestEntries(entries, packageRoot, resourceType);
      const manifestPatterns = entries.filter(isOverridePattern);
      const enabledByManifest =
        manifestPatterns.length > 0
          ? applyPatterns(allFiles, manifestPatterns, packageRoot)
          : new Set(allFiles);
      return {
        allFiles: Array.from(enabledByManifest),
        enabledByManifest,
      };
    }
    const allFiles = this.collectConventionResourceFiles(packageRoot, resourceType);
    return {
      allFiles,
      enabledByManifest: new Set(allFiles),
    };
  }
  collectConventionResourceFiles(packageRoot, resourceType) {
    const conventionDir = join(packageRoot, resourceType);
    if (!existsSync(conventionDir)) return [];
    return this.filterManifestResourcePaths(
      collectResourceFiles(conventionDir, resourceType),
      packageRoot,
    );
  }
  readResourceManifest(packageRoot) {
    const packageJsonPath = join(packageRoot, "package.json");
    if (!existsSync(packageJsonPath)) return null;
    try {
      const content = readFileSync(packageJsonPath, "utf-8");
      return JSON.parse(content).openclaw ?? null;
    } catch {
      return null;
    }
  }
  addManifestEntries(entries, root, resourceType, target, metadata) {
    if (!entries) return;
    const allFiles = this.collectFilesFromManifestEntries(entries, root, resourceType);
    const enabledPaths = applyPatterns(allFiles, entries.filter(isOverridePattern), root);
    for (const f of allFiles) if (enabledPaths.has(f)) this.addResource(target, f, metadata, true);
  }
  collectFilesFromManifestEntries(entries, root, resourceType) {
    const resolved = entries
      .filter((entry) => !isOverridePattern(entry))
      .flatMap((entry) => {
        if (!hasGlobPattern(entry)) return [resolve(root, entry)];
        return globSync(entry, { cwd: root }).map((match) => resolve(root, match));
      });
    return this.collectFilesFromPaths(
      this.filterManifestResourcePaths(resolved, root),
      resourceType,
    );
  }
  filterManifestResourcePaths(paths, root) {
    const resolvedRoot = resolve(root);
    const realRoot = resolveRealPathIfPossible(resolvedRoot);
    return paths.filter((path) => {
      const resolvedPath = resolve(path);
      if (!isPathWithinRoot(resolvedRoot, resolvedPath)) return false;
      return isPathWithinRoot(realRoot, resolveRealPathIfPossible(resolvedPath));
    });
  }
  resolveLocalEntries(entries, resourceType, target, metadata, baseDir) {
    if (entries.length === 0) return;
    const { plain, patterns } = splitPatterns(entries);
    const resolvedPlain = plain.map((p) => this.resolvePathFromBase(p, baseDir));
    const allFiles = this.collectFilesFromPaths(resolvedPlain, resourceType);
    const enabledPaths = applyPatterns(allFiles, patterns, baseDir);
    for (const f of allFiles) this.addResource(target, f, metadata, enabledPaths.has(f));
  }
  addAutoDiscoveredResources(
    accumulator,
    globalSettings,
    projectSettings,
    globalBaseDir,
    projectBaseDir,
  ) {
    const userMetadata = {
      source: "auto",
      scope: "user",
      origin: "top-level",
      baseDir: globalBaseDir,
    };
    const projectMetadata = {
      source: "auto",
      scope: "project",
      origin: "top-level",
      baseDir: projectBaseDir,
    };
    const userOverrides = {
      extensions: globalSettings.extensions ?? [],
      skills: globalSettings.skills ?? [],
      prompts: globalSettings.prompts ?? [],
      themes: globalSettings.themes ?? [],
    };
    const projectOverrides = {
      extensions: projectSettings.extensions ?? [],
      skills: projectSettings.skills ?? [],
      prompts: projectSettings.prompts ?? [],
      themes: projectSettings.themes ?? [],
    };
    const userDirs = {
      extensions: join(globalBaseDir, "extensions"),
      skills: join(globalBaseDir, "skills"),
      prompts: join(globalBaseDir, "prompts"),
      themes: join(globalBaseDir, "themes"),
    };
    const projectDirs = {
      extensions: join(projectBaseDir, "extensions"),
      skills: join(projectBaseDir, "skills"),
      prompts: join(projectBaseDir, "prompts"),
      themes: join(projectBaseDir, "themes"),
    };
    const userAgentsSkillsDir = join(getHomeDir(), ".agents", "skills");
    const projectAgentsSkillDirs = collectAncestorAgentsSkillDirs(this.cwd).filter(
      (dir) => resolve(dir) !== resolve(userAgentsSkillsDir),
    );
    const addResources = (resourceType, paths, metadata, overrides, baseDir) => {
      const target = this.getTargetMap(accumulator, resourceType);
      for (const path of paths) {
        const enabled = isEnabledByOverrides(path, overrides, baseDir);
        this.addResource(target, path, metadata, enabled);
      }
    };
    addResources(
      "extensions",
      collectAutoExtensionEntries(projectDirs.extensions),
      projectMetadata,
      projectOverrides.extensions,
      projectBaseDir,
    );
    addResources(
      "skills",
      collectAutoSkillEntries(projectDirs.skills, "openclaw"),
      projectMetadata,
      projectOverrides.skills,
      projectBaseDir,
    );
    for (const agentsSkillsDir of projectAgentsSkillDirs) {
      const agentsBaseDir = dirname(agentsSkillsDir);
      const agentsMetadata = {
        ...projectMetadata,
        baseDir: agentsBaseDir,
      };
      addResources(
        "skills",
        collectAutoSkillEntries(agentsSkillsDir, "agents"),
        agentsMetadata,
        projectOverrides.skills,
        agentsBaseDir,
      );
    }
    addResources(
      "prompts",
      collectTopLevelAutoResourceEntries(projectDirs.prompts, "prompts"),
      projectMetadata,
      projectOverrides.prompts,
      projectBaseDir,
    );
    addResources(
      "themes",
      collectTopLevelAutoResourceEntries(projectDirs.themes, "themes"),
      projectMetadata,
      projectOverrides.themes,
      projectBaseDir,
    );
    addResources(
      "extensions",
      collectAutoExtensionEntries(userDirs.extensions),
      userMetadata,
      userOverrides.extensions,
      globalBaseDir,
    );
    addResources(
      "skills",
      collectAutoSkillEntries(userDirs.skills, "openclaw"),
      userMetadata,
      userOverrides.skills,
      globalBaseDir,
    );
    const userAgentsBaseDir = dirname(userAgentsSkillsDir);
    const userAgentsMetadata = {
      ...userMetadata,
      baseDir: userAgentsBaseDir,
    };
    addResources(
      "skills",
      collectAutoSkillEntries(userAgentsSkillsDir, "agents"),
      userAgentsMetadata,
      userOverrides.skills,
      userAgentsBaseDir,
    );
    addResources(
      "prompts",
      collectTopLevelAutoResourceEntries(userDirs.prompts, "prompts"),
      userMetadata,
      userOverrides.prompts,
      globalBaseDir,
    );
    addResources(
      "themes",
      collectTopLevelAutoResourceEntries(userDirs.themes, "themes"),
      userMetadata,
      userOverrides.themes,
      globalBaseDir,
    );
  }
  collectFilesFromPaths(paths, resourceType) {
    const files = [];
    for (const p of paths) {
      if (!existsSync(p)) continue;
      try {
        const stats = statSync(p);
        if (stats.isFile()) files.push(p);
        else if (stats.isDirectory()) files.push(...collectResourceFiles(p, resourceType));
      } catch {}
    }
    return files;
  }
  getTargetMap(accumulator, resourceType) {
    switch (resourceType) {
      case "extensions":
        return accumulator.extensions;
      case "skills":
        return accumulator.skills;
      case "prompts":
        return accumulator.prompts;
      case "themes":
        return accumulator.themes;
      default:
        throw new Error(`Unknown resource type: ${String(resourceType)}`);
    }
  }
  addResource(map, path, metadata, enabled) {
    if (!path) return;
    if (!map.has(path))
      map.set(path, {
        metadata,
        enabled,
      });
  }
  createAccumulator() {
    return {
      extensions: /* @__PURE__ */ new Map(),
      skills: /* @__PURE__ */ new Map(),
      prompts: /* @__PURE__ */ new Map(),
      themes: /* @__PURE__ */ new Map(),
    };
  }
  toResolvedPaths(accumulator) {
    const mapToResolved = (entries) => {
      const resolved = Array.from(entries.entries()).map(([path, { metadata, enabled }]) => ({
        path,
        enabled,
        metadata,
      }));
      resolved.sort(
        (a, b) => resourcePrecedenceRank(a.metadata) - resourcePrecedenceRank(b.metadata),
      );
      const seen = /* @__PURE__ */ new Set();
      return resolved.filter((entry) => {
        const canonicalPath = canonicalizePath(entry.path);
        if (seen.has(canonicalPath)) return false;
        seen.add(canonicalPath);
        return true;
      });
    };
    return {
      extensions: mapToResolved(accumulator.extensions),
      skills: mapToResolved(accumulator.skills),
      prompts: mapToResolved(accumulator.prompts),
      themes: mapToResolved(accumulator.themes),
    };
  }
};
//#endregion
//#region src/agents/sessions/http-dispatcher.ts
/**
 * HTTP session dispatcher config helpers.
 *
 * Parses idle-timeout values shared by server and config surfaces.
 */
const DEFAULT_HTTP_IDLE_TIMEOUT_MS = 3e5;
/** Parses idle timeout values, using `0` for the explicit disabled sentinel. */
function parseHttpIdleTimeoutMs(value) {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed.toLowerCase() === "disabled") return 0;
    if (trimmed.length === 0) return;
    return parseStrictNonNegativeInteger(trimmed);
  }
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return;
  return Math.floor(value);
}
//#endregion
//#region src/agents/sessions/settings-manager.ts
/**
 * Session settings manager.
 *
 * Loads and persists user/session defaults for models, transports, retry policy, UI, packages, and telemetry.
 */
/** Deep merge settings: project/overrides take precedence, nested objects merge recursively */
function deepMergeSettings(base, overrides) {
  return mergeDeep(base, overrides);
}
var FileSettingsStorage = class {
  constructor(cwd, agentDir) {
    this.globalSettingsPath = join(agentDir, "settings.json");
    this.projectSettingsPath = join(cwd, CONFIG_DIR_NAME, "settings.json");
  }
  withLock(scope, fn) {
    const path = scope === "global" ? this.globalSettingsPath : this.projectSettingsPath;
    const dir = dirname(path);
    let release;
    try {
      const fileExists = existsSync(path);
      if (fileExists) release = acquireLockSyncWithRetry(path);
      const next = fn(fileExists ? readFileSync(path, "utf-8") : void 0);
      if (next !== void 0) {
        if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
        if (!release) release = acquireLockSyncWithRetry(path);
        writeFileSync(path, next, "utf-8");
      }
    } finally {
      if (release) release();
    }
  }
};
var InMemorySettingsStorage = class {
  withLock(scope, fn) {
    const next = fn(scope === "global" ? this.global : this.project);
    if (next !== void 0)
      if (scope === "global") this.global = next;
      else this.project = next;
  }
};
var SettingsManager = class SettingsManager {
  constructor(
    storage,
    initialGlobal,
    initialProject,
    globalLoadError = null,
    projectLoadError = null,
    initialErrors = [],
  ) {
    this.settings = {};
    this.runtimeOverrides = {};
    this.modifiedFields = /* @__PURE__ */ new Set();
    this.modifiedNestedFields = /* @__PURE__ */ new Map();
    this.modifiedProjectFields = /* @__PURE__ */ new Set();
    this.modifiedProjectNestedFields = /* @__PURE__ */ new Map();
    this.globalSettingsLoadError = null;
    this.projectSettingsLoadError = null;
    this.writeQueue = Promise.resolve();
    this.storage = storage;
    this.globalSettings = initialGlobal;
    this.projectSettings = initialProject;
    this.globalSettingsLoadError = globalLoadError;
    this.projectSettingsLoadError = projectLoadError;
    this.errors = [...initialErrors];
    this.recomputeSettings();
  }
  /** Create a SettingsManager that loads from files */
  static create(cwd, agentDir = getAgentDir()) {
    const storage = new FileSettingsStorage(cwd, agentDir);
    return SettingsManager.fromStorage(storage);
  }
  /** Create a SettingsManager from an arbitrary storage backend */
  static fromStorage(storage) {
    const globalLoad = SettingsManager.tryLoadFromStorage(storage, "global");
    const projectLoad = SettingsManager.tryLoadFromStorage(storage, "project");
    const initialErrors = [];
    if (globalLoad.error)
      initialErrors.push({
        scope: "global",
        error: globalLoad.error,
      });
    if (projectLoad.error)
      initialErrors.push({
        scope: "project",
        error: projectLoad.error,
      });
    return new SettingsManager(
      storage,
      globalLoad.settings,
      projectLoad.settings,
      globalLoad.error,
      projectLoad.error,
      initialErrors,
    );
  }
  /** Create an in-memory SettingsManager (no file I/O) */
  static inMemory(settings = {}) {
    const storage = new InMemorySettingsStorage();
    const initialSettings = SettingsManager.migrateSettings(structuredClone(settings));
    storage.withLock("global", () => JSON.stringify(initialSettings, null, 2));
    return SettingsManager.fromStorage(storage);
  }
  static loadFromStorage(storage, scope) {
    let content;
    storage.withLock(scope, (current) => {
      content = current;
    });
    if (!content) return {};
    const settings = JSON.parse(content);
    return SettingsManager.migrateSettings(settings);
  }
  static tryLoadFromStorage(storage, scope) {
    try {
      return {
        settings: SettingsManager.loadFromStorage(storage, scope),
        error: null,
      };
    } catch (error) {
      return {
        settings: {},
        error,
      };
    }
  }
  /** Migrate old settings format to new format */
  static migrateSettings(settings) {
    if ("queueMode" in settings && !("steeringMode" in settings)) {
      settings.steeringMode = settings.queueMode;
      delete settings.queueMode;
    }
    if (!("transport" in settings) && typeof settings.websockets === "boolean") {
      settings.transport = settings.websockets ? "websocket" : "sse";
      delete settings.websockets;
    }
    if (
      "skills" in settings &&
      typeof settings.skills === "object" &&
      settings.skills !== null &&
      !Array.isArray(settings.skills)
    ) {
      const skillsSettings = settings.skills;
      if (skillsSettings.enableSkillCommands !== void 0 && settings.enableSkillCommands === void 0)
        settings.enableSkillCommands = skillsSettings.enableSkillCommands;
      if (
        Array.isArray(skillsSettings.customDirectories) &&
        skillsSettings.customDirectories.length > 0
      )
        settings.skills = skillsSettings.customDirectories;
      else delete settings.skills;
    }
    if (
      "retry" in settings &&
      typeof settings.retry === "object" &&
      settings.retry !== null &&
      !Array.isArray(settings.retry)
    ) {
      const retrySettings = settings.retry;
      const providerSettings =
        typeof retrySettings.provider === "object" && retrySettings.provider !== null
          ? retrySettings.provider
          : void 0;
      if (
        typeof retrySettings.maxDelayMs === "number" &&
        (providerSettings?.maxRetryDelayMs === void 0 || providerSettings?.maxRetryDelayMs === null)
      )
        retrySettings.provider = {
          ...providerSettings,
          maxRetryDelayMs: retrySettings.maxDelayMs,
        };
      delete retrySettings.maxDelayMs;
    }
    return settings;
  }
  getGlobalSettings() {
    return structuredClone(this.globalSettings);
  }
  getProjectSettings() {
    return structuredClone(this.projectSettings);
  }
  recomputeSettings() {
    this.settings = deepMergeSettings(
      deepMergeSettings(this.globalSettings, this.projectSettings),
      this.runtimeOverrides,
    );
  }
  async reload() {
    await this.writeQueue;
    const globalLoad = SettingsManager.tryLoadFromStorage(this.storage, "global");
    if (!globalLoad.error) {
      this.globalSettings = globalLoad.settings;
      this.globalSettingsLoadError = null;
    } else {
      this.globalSettingsLoadError = globalLoad.error;
      this.recordError("global", globalLoad.error);
    }
    this.modifiedFields.clear();
    this.modifiedNestedFields.clear();
    this.modifiedProjectFields.clear();
    this.modifiedProjectNestedFields.clear();
    const projectLoad = SettingsManager.tryLoadFromStorage(this.storage, "project");
    if (!projectLoad.error) {
      this.projectSettings = projectLoad.settings;
      this.projectSettingsLoadError = null;
    } else {
      this.projectSettingsLoadError = projectLoad.error;
      this.recordError("project", projectLoad.error);
    }
    this.recomputeSettings();
  }
  /** Apply non-persisted overrides on top of global/project settings. */
  applyOverrides(overrides) {
    this.runtimeOverrides = deepMergeSettings(this.runtimeOverrides, overrides);
    this.recomputeSettings();
  }
  /** Mark a global field as modified during this session */
  markModified(field, nestedKey) {
    this.modifiedFields.add(field);
    if (nestedKey) {
      if (!this.modifiedNestedFields.has(field))
        this.modifiedNestedFields.set(field, /* @__PURE__ */ new Set());
      this.modifiedNestedFields.get(field).add(nestedKey);
    }
  }
  /** Mark a project field as modified during this session */
  markProjectModified(field, nestedKey) {
    this.modifiedProjectFields.add(field);
    if (nestedKey) {
      if (!this.modifiedProjectNestedFields.has(field))
        this.modifiedProjectNestedFields.set(field, /* @__PURE__ */ new Set());
      this.modifiedProjectNestedFields.get(field).add(nestedKey);
    }
  }
  recordError(scope, error) {
    const normalizedError = error instanceof Error ? error : new Error(String(error));
    this.errors.push({
      scope,
      error: normalizedError,
    });
  }
  clearModifiedScope(scope) {
    if (scope === "global") {
      this.modifiedFields.clear();
      this.modifiedNestedFields.clear();
      return;
    }
    this.modifiedProjectFields.clear();
    this.modifiedProjectNestedFields.clear();
  }
  enqueueWrite(scope, task) {
    this.writeQueue = this.writeQueue
      .then(() => {
        task();
        this.clearModifiedScope(scope);
      })
      .catch((error) => {
        this.recordError(scope, error);
      });
  }
  cloneModifiedNestedFields(source) {
    const snapshot = /* @__PURE__ */ new Map();
    for (const [key, value] of source.entries()) snapshot.set(key, new Set(value));
    return snapshot;
  }
  persistScopedSettings(scope, snapshotSettings, modifiedFields, modifiedNestedFields) {
    this.storage.withLock(scope, (current) => {
      const currentFileSettings = current
        ? SettingsManager.migrateSettings(JSON.parse(current))
        : {};
      const mergedSettings = { ...currentFileSettings };
      for (const field of modifiedFields) {
        const value = snapshotSettings[field];
        if (modifiedNestedFields.has(field) && typeof value === "object" && value !== null) {
          const nestedModified = modifiedNestedFields.get(field);
          const baseNested = currentFileSettings[field] ?? {};
          const inMemoryNested = value;
          const mergedNested = { ...baseNested };
          for (const nestedKey of nestedModified)
            mergedNested[nestedKey] = inMemoryNested[nestedKey];
          mergedSettings[field] = mergedNested;
        } else mergedSettings[field] = value;
      }
      return JSON.stringify(mergedSettings, null, 2);
    });
  }
  save() {
    this.recomputeSettings();
    if (this.globalSettingsLoadError) return;
    const snapshotGlobalSettings = structuredClone(this.globalSettings);
    const modifiedFields = new Set(this.modifiedFields);
    const modifiedNestedFields = this.cloneModifiedNestedFields(this.modifiedNestedFields);
    this.enqueueWrite("global", () => {
      this.persistScopedSettings(
        "global",
        snapshotGlobalSettings,
        modifiedFields,
        modifiedNestedFields,
      );
    });
  }
  saveProjectSettings(settings) {
    this.projectSettings = structuredClone(settings);
    this.recomputeSettings();
    if (this.projectSettingsLoadError) return;
    const snapshotProjectSettings = structuredClone(this.projectSettings);
    const modifiedFields = new Set(this.modifiedProjectFields);
    const modifiedNestedFields = this.cloneModifiedNestedFields(this.modifiedProjectNestedFields);
    this.enqueueWrite("project", () => {
      this.persistScopedSettings(
        "project",
        snapshotProjectSettings,
        modifiedFields,
        modifiedNestedFields,
      );
    });
  }
  async flush() {
    await this.writeQueue;
  }
  drainErrors() {
    const drained = [...this.errors];
    this.errors = [];
    return drained;
  }
  getLastChangelogVersion() {
    return this.settings.lastChangelogVersion;
  }
  setLastChangelogVersion(version) {
    this.globalSettings.lastChangelogVersion = version;
    this.markModified("lastChangelogVersion");
    this.save();
  }
  getSessionDir() {
    const sessionDir = this.settings.sessionDir;
    if (!sessionDir) return sessionDir;
    if (sessionDir === "~") return homedir();
    if (sessionDir.startsWith("~/")) return join(homedir(), sessionDir.slice(2));
    return sessionDir;
  }
  getDefaultProvider() {
    return this.settings.defaultProvider;
  }
  getDefaultModel() {
    return this.settings.defaultModel;
  }
  setDefaultProvider(provider) {
    this.globalSettings.defaultProvider = provider;
    this.markModified("defaultProvider");
    this.save();
  }
  setDefaultModel(modelId) {
    this.globalSettings.defaultModel = modelId;
    this.markModified("defaultModel");
    this.save();
  }
  setDefaultModelAndProvider(provider, modelId) {
    this.globalSettings.defaultProvider = provider;
    this.globalSettings.defaultModel = modelId;
    this.markModified("defaultProvider");
    this.markModified("defaultModel");
    this.save();
  }
  getSteeringMode() {
    return this.settings.steeringMode || "one-at-a-time";
  }
  setSteeringMode(mode) {
    this.globalSettings.steeringMode = mode;
    this.markModified("steeringMode");
    this.save();
  }
  getFollowUpMode() {
    return this.settings.followUpMode || "one-at-a-time";
  }
  setFollowUpMode(mode) {
    this.globalSettings.followUpMode = mode;
    this.markModified("followUpMode");
    this.save();
  }
  getTheme() {
    return this.settings.theme;
  }
  setTheme(theme) {
    this.globalSettings.theme = theme;
    this.markModified("theme");
    this.save();
  }
  getDefaultThinkingLevel() {
    return this.settings.defaultThinkingLevel;
  }
  setDefaultThinkingLevel(level) {
    this.globalSettings.defaultThinkingLevel = level;
    this.markModified("defaultThinkingLevel");
    this.save();
  }
  getTransport() {
    return this.settings.transport ?? "auto";
  }
  setTransport(transport) {
    this.globalSettings.transport = transport;
    this.markModified("transport");
    this.save();
  }
  getCompactionEnabled() {
    return this.settings.compaction?.enabled ?? true;
  }
  setCompactionEnabled(enabled) {
    if (!this.globalSettings.compaction) this.globalSettings.compaction = {};
    this.globalSettings.compaction.enabled = enabled;
    this.markModified("compaction", "enabled");
    this.save();
  }
  getCompactionReserveTokens() {
    return this.settings.compaction?.reserveTokens ?? 16384;
  }
  getCompactionKeepRecentTokens() {
    return this.settings.compaction?.keepRecentTokens ?? 2e4;
  }
  getCompactionSettings() {
    return {
      enabled: this.getCompactionEnabled(),
      reserveTokens: this.getCompactionReserveTokens(),
      keepRecentTokens: this.getCompactionKeepRecentTokens(),
    };
  }
  getBranchSummarySettings() {
    return {
      reserveTokens: this.settings.branchSummary?.reserveTokens ?? 16384,
      skipPrompt: this.settings.branchSummary?.skipPrompt ?? false,
    };
  }
  getBranchSummarySkipPrompt() {
    return this.settings.branchSummary?.skipPrompt ?? false;
  }
  getRetryEnabled() {
    return this.settings.retry?.enabled ?? true;
  }
  setRetryEnabled(enabled) {
    if (!this.globalSettings.retry) this.globalSettings.retry = {};
    this.globalSettings.retry.enabled = enabled;
    this.markModified("retry", "enabled");
    this.save();
  }
  getRetrySettings() {
    return {
      enabled: this.getRetryEnabled(),
      maxRetries: this.settings.retry?.maxRetries ?? 3,
      baseDelayMs: this.settings.retry?.baseDelayMs ?? 2e3,
    };
  }
  getHttpIdleTimeoutMs() {
    const value = this.settings.httpIdleTimeoutMs;
    const timeoutMs = parseHttpIdleTimeoutMs(value);
    if (timeoutMs !== void 0) return timeoutMs;
    if (value !== void 0) throw new Error(`Invalid httpIdleTimeoutMs setting: ${String(value)}`);
    return DEFAULT_HTTP_IDLE_TIMEOUT_MS;
  }
  setHttpIdleTimeoutMs(timeoutMs) {
    if (!Number.isFinite(timeoutMs) || timeoutMs < 0)
      throw new Error(`Invalid httpIdleTimeoutMs setting: ${String(timeoutMs)}`);
    this.globalSettings.httpIdleTimeoutMs = Math.floor(timeoutMs);
    this.markModified("httpIdleTimeoutMs");
    this.save();
  }
  getProviderRetrySettings() {
    return {
      timeoutMs: this.settings.retry?.provider?.timeoutMs,
      maxRetries: this.settings.retry?.provider?.maxRetries,
      maxRetryDelayMs: this.settings.retry?.provider?.maxRetryDelayMs ?? 6e4,
    };
  }
  getHideThinkingBlock() {
    return this.settings.hideThinkingBlock ?? false;
  }
  setHideThinkingBlock(hide) {
    this.globalSettings.hideThinkingBlock = hide;
    this.markModified("hideThinkingBlock");
    this.save();
  }
  getShellPath() {
    return this.settings.shellPath;
  }
  setShellPath(path) {
    this.globalSettings.shellPath = path;
    this.markModified("shellPath");
    this.save();
  }
  getQuietStartup() {
    return this.settings.quietStartup ?? false;
  }
  setQuietStartup(quiet) {
    this.globalSettings.quietStartup = quiet;
    this.markModified("quietStartup");
    this.save();
  }
  getShellCommandPrefix() {
    return this.settings.shellCommandPrefix;
  }
  setShellCommandPrefix(prefix) {
    this.globalSettings.shellCommandPrefix = prefix;
    this.markModified("shellCommandPrefix");
    this.save();
  }
  getNpmCommand() {
    return this.settings.npmCommand ? [...this.settings.npmCommand] : void 0;
  }
  setNpmCommand(command) {
    this.globalSettings.npmCommand = command ? [...command] : void 0;
    this.markModified("npmCommand");
    this.save();
  }
  getCollapseChangelog() {
    return this.settings.collapseChangelog ?? false;
  }
  setCollapseChangelog(collapse) {
    this.globalSettings.collapseChangelog = collapse;
    this.markModified("collapseChangelog");
    this.save();
  }
  getEnableInstallTelemetry() {
    return this.settings.enableInstallTelemetry ?? true;
  }
  setEnableInstallTelemetry(enabled) {
    this.globalSettings.enableInstallTelemetry = enabled;
    this.markModified("enableInstallTelemetry");
    this.save();
  }
  getPackages() {
    return [...(this.settings.packages ?? [])];
  }
  setPackages(packages) {
    this.globalSettings.packages = packages;
    this.markModified("packages");
    this.save();
  }
  setProjectPackages(packages) {
    const projectSettings = structuredClone(this.projectSettings);
    projectSettings.packages = packages;
    this.markProjectModified("packages");
    this.saveProjectSettings(projectSettings);
  }
  getExtensionPaths() {
    return [...(this.settings.extensions ?? [])];
  }
  setExtensionPaths(paths) {
    this.globalSettings.extensions = paths;
    this.markModified("extensions");
    this.save();
  }
  setProjectExtensionPaths(paths) {
    const projectSettings = structuredClone(this.projectSettings);
    projectSettings.extensions = paths;
    this.markProjectModified("extensions");
    this.saveProjectSettings(projectSettings);
  }
  getSkillPaths() {
    return [...(this.settings.skills ?? [])];
  }
  setSkillPaths(paths) {
    this.globalSettings.skills = paths;
    this.markModified("skills");
    this.save();
  }
  setProjectSkillPaths(paths) {
    const projectSettings = structuredClone(this.projectSettings);
    projectSettings.skills = paths;
    this.markProjectModified("skills");
    this.saveProjectSettings(projectSettings);
  }
  getPromptTemplatePaths() {
    return [...(this.settings.prompts ?? [])];
  }
  setPromptTemplatePaths(paths) {
    this.globalSettings.prompts = paths;
    this.markModified("prompts");
    this.save();
  }
  setProjectPromptTemplatePaths(paths) {
    const projectSettings = structuredClone(this.projectSettings);
    projectSettings.prompts = paths;
    this.markProjectModified("prompts");
    this.saveProjectSettings(projectSettings);
  }
  getThemePaths() {
    return [...(this.settings.themes ?? [])];
  }
  setThemePaths(paths) {
    this.globalSettings.themes = paths;
    this.markModified("themes");
    this.save();
  }
  setProjectThemePaths(paths) {
    const projectSettings = structuredClone(this.projectSettings);
    projectSettings.themes = paths;
    this.markProjectModified("themes");
    this.saveProjectSettings(projectSettings);
  }
  getEnableSkillCommands() {
    return this.settings.enableSkillCommands ?? true;
  }
  setEnableSkillCommands(enabled) {
    this.globalSettings.enableSkillCommands = enabled;
    this.markModified("enableSkillCommands");
    this.save();
  }
  getThinkingBudgets() {
    return this.settings.thinkingBudgets;
  }
  getShowImages() {
    return this.settings.terminal?.showImages ?? true;
  }
  setShowImages(show) {
    if (!this.globalSettings.terminal) this.globalSettings.terminal = {};
    this.globalSettings.terminal.showImages = show;
    this.markModified("terminal", "showImages");
    this.save();
  }
  getImageWidthCells() {
    return resolveIntegerOption(this.settings.terminal?.imageWidthCells, 60, { min: 1 });
  }
  setImageWidthCells(width) {
    if (!this.globalSettings.terminal) this.globalSettings.terminal = {};
    this.globalSettings.terminal.imageWidthCells = Math.max(1, Math.floor(width));
    this.markModified("terminal", "imageWidthCells");
    this.save();
  }
  getClearOnShrink() {
    return this.settings.terminal?.clearOnShrink ?? false;
  }
  setClearOnShrink(enabled) {
    if (!this.globalSettings.terminal) this.globalSettings.terminal = {};
    this.globalSettings.terminal.clearOnShrink = enabled;
    this.markModified("terminal", "clearOnShrink");
    this.save();
  }
  getShowTerminalProgress() {
    return this.settings.terminal?.showTerminalProgress ?? false;
  }
  setShowTerminalProgress(enabled) {
    if (!this.globalSettings.terminal) this.globalSettings.terminal = {};
    this.globalSettings.terminal.showTerminalProgress = enabled;
    this.markModified("terminal", "showTerminalProgress");
    this.save();
  }
  getImageAutoResize() {
    return this.settings.images?.autoResize ?? true;
  }
  setImageAutoResize(enabled) {
    if (!this.globalSettings.images) this.globalSettings.images = {};
    this.globalSettings.images.autoResize = enabled;
    this.markModified("images", "autoResize");
    this.save();
  }
  getBlockImages() {
    return this.settings.images?.blockImages ?? false;
  }
  setBlockImages(blocked) {
    if (!this.globalSettings.images) this.globalSettings.images = {};
    this.globalSettings.images.blockImages = blocked;
    this.markModified("images", "blockImages");
    this.save();
  }
  getEnabledModels() {
    return this.settings.enabledModels;
  }
  setEnabledModels(patterns) {
    this.globalSettings.enabledModels = patterns;
    this.markModified("enabledModels");
    this.save();
  }
  getDoubleEscapeAction() {
    return this.settings.doubleEscapeAction ?? "tree";
  }
  setDoubleEscapeAction(action) {
    this.globalSettings.doubleEscapeAction = action;
    this.markModified("doubleEscapeAction");
    this.save();
  }
  getTreeFilterMode() {
    const mode = this.settings.treeFilterMode;
    return mode && ["default", "no-tools", "user-only", "labeled-only", "all"].includes(mode)
      ? mode
      : "default";
  }
  setTreeFilterMode(mode) {
    this.globalSettings.treeFilterMode = mode;
    this.markModified("treeFilterMode");
    this.save();
  }
  getShowHardwareCursor() {
    return this.settings.showHardwareCursor ?? false;
  }
  setShowHardwareCursor(enabled) {
    this.globalSettings.showHardwareCursor = enabled;
    this.markModified("showHardwareCursor");
    this.save();
  }
  getEditorPaddingX() {
    return this.settings.editorPaddingX ?? 0;
  }
  setEditorPaddingX(padding) {
    this.globalSettings.editorPaddingX = Math.max(0, Math.min(3, Math.floor(padding)));
    this.markModified("editorPaddingX");
    this.save();
  }
  getAutocompleteMaxVisible() {
    return this.settings.autocompleteMaxVisible ?? 5;
  }
  setAutocompleteMaxVisible(maxVisible) {
    this.globalSettings.autocompleteMaxVisible = Math.max(3, Math.min(20, Math.floor(maxVisible)));
    this.markModified("autocompleteMaxVisible");
    this.save();
  }
  getCodeBlockIndent() {
    return this.settings.markdown?.codeBlockIndent ?? "  ";
  }
  getWarnings() {
    return { ...this.settings.warnings };
  }
  setWarnings(warnings) {
    this.globalSettings.warnings = { ...warnings };
    this.markModified("warnings");
    this.save();
  }
};
//#endregion
//#region src/agents/utils/syntax-highlight.ts
/**
 * Syntax highlighting renderer for terminal-friendly formatted output.
 *
 * Highlight.js emits HTML spans; this module walks that small HTML subset and
 * maps active scopes to caller-provided text formatters.
 */
function isHighlightJs(value) {
  return (
    typeof value === "object" &&
    value !== null &&
    "getLanguage" in value &&
    typeof value.getLanguage === "function" &&
    "highlight" in value &&
    typeof value.highlight === "function" &&
    "highlightAuto" in value &&
    typeof value.highlightAuto === "function"
  );
}
const highlightJsModule = createRequire(import.meta.url)("highlight.js");
if (!isHighlightJs(highlightJsModule))
  throw new TypeError("highlight.js did not expose the expected Node API");
const hljs = highlightJsModule;
const SPAN_CLOSE = "</span>";
const HIGHLIGHT_CLASS_PREFIX = "hljs-";
function getScopeFromSpanTag(tag) {
  const match = /\sclass\s*=\s*(?:"([^"]*)"|'([^']*)')/.exec(tag);
  const classValue = match?.[1] ?? match?.[2];
  if (!classValue) return;
  for (const className of classValue.split(/\s+/))
    if (className.startsWith(HIGHLIGHT_CLASS_PREFIX)) return className.slice(5);
}
function getScopeFormatter(scope, theme) {
  const exact = theme[scope];
  if (exact) return exact;
  const dotIndex = scope.indexOf(".");
  if (dotIndex !== -1) {
    const prefixFormatter = theme[scope.slice(0, dotIndex)];
    if (prefixFormatter) return prefixFormatter;
  }
  const dashIndex = scope.indexOf("-");
  if (dashIndex !== -1) {
    const prefixFormatter = theme[scope.slice(0, dashIndex)];
    if (prefixFormatter) return prefixFormatter;
  }
}
function getActiveFormatter(scopes, theme) {
  for (let i = scopes.length - 1; i >= 0; i--) {
    const scope = scopes[i];
    if (!scope) continue;
    const formatter = getScopeFormatter(scope, theme);
    if (formatter) return formatter;
  }
  return theme.default;
}
function isSpanOpenTagStart(html, index) {
  if (!html.startsWith("<span", index)) return false;
  const nextChar = html[index + 5];
  return (
    nextChar === ">" ||
    nextChar === " " ||
    nextChar === "	" ||
    nextChar === "\n" ||
    nextChar === "\r"
  );
}
/** Renders highlight.js span HTML into themed plain text. */
function renderHighlightedHtml(html, theme = {}) {
  let output = "";
  let textBuffer = "";
  const scopes = [];
  const flushText = () => {
    if (!textBuffer) return;
    const decodedText = decodeHtmlEntities(textBuffer);
    const formatter = getActiveFormatter(scopes, theme);
    output += formatter ? formatter(decodedText) : decodedText;
    textBuffer = "";
  };
  let index = 0;
  while (index < html.length) {
    if (isSpanOpenTagStart(html, index)) {
      const tagEndIndex = html.indexOf(">", index + 5);
      if (tagEndIndex !== -1) {
        flushText();
        const scope = getScopeFromSpanTag(html.slice(index, tagEndIndex + 1));
        scopes.push(scope);
        index = tagEndIndex + 1;
        continue;
      }
    }
    if (html.startsWith(SPAN_CLOSE, index)) {
      flushText();
      if (scopes.length > 0) scopes.pop();
      index += 7;
      continue;
    }
    textBuffer += html[index];
    index++;
  }
  flushText();
  return output;
}
/** Highlights code using an explicit language or highlight.js auto-detection. */
function highlight(code, options = {}) {
  return renderHighlightedHtml(
    options.language
      ? hljs.highlight(code, {
          language: options.language,
          ignoreIllegals: options.ignoreIllegals,
        }).value
      : hljs.highlightAuto(code, options.languageSubset).value,
    options.theme,
  );
}
/** Returns whether highlight.js has a registered language by this name. */
function supportsLanguage(name) {
  return hljs.getLanguage(name) !== void 0;
}
//#endregion
//#region src/agents/modes/interactive/theme/theme.ts
/**
 * Interactive terminal theme loader.
 *
 * Validates theme JSON, resolves color variables, watches custom theme files, and exposes terminal styling helpers.
 */
const ColorValueSchema = Type.Union([
  Type.String(),
  Type.Integer({
    minimum: 0,
    maximum: 255,
  }),
]);
const validateThemeJson = Compile(
  Type.Object({
    $schema: Type.Optional(Type.String()),
    name: Type.String(),
    vars: Type.Optional(Type.Record(Type.String(), ColorValueSchema)),
    colors: Type.Object({
      accent: ColorValueSchema,
      border: ColorValueSchema,
      borderAccent: ColorValueSchema,
      borderMuted: ColorValueSchema,
      success: ColorValueSchema,
      error: ColorValueSchema,
      warning: ColorValueSchema,
      muted: ColorValueSchema,
      dim: ColorValueSchema,
      text: ColorValueSchema,
      thinkingText: ColorValueSchema,
      selectedBg: ColorValueSchema,
      userMessageBg: ColorValueSchema,
      userMessageText: ColorValueSchema,
      customMessageBg: ColorValueSchema,
      customMessageText: ColorValueSchema,
      customMessageLabel: ColorValueSchema,
      toolPendingBg: ColorValueSchema,
      toolSuccessBg: ColorValueSchema,
      toolErrorBg: ColorValueSchema,
      toolTitle: ColorValueSchema,
      toolOutput: ColorValueSchema,
      mdHeading: ColorValueSchema,
      mdLink: ColorValueSchema,
      mdLinkUrl: ColorValueSchema,
      mdCode: ColorValueSchema,
      mdCodeBlock: ColorValueSchema,
      mdCodeBlockBorder: ColorValueSchema,
      mdQuote: ColorValueSchema,
      mdQuoteBorder: ColorValueSchema,
      mdHr: ColorValueSchema,
      mdListBullet: ColorValueSchema,
      toolDiffAdded: ColorValueSchema,
      toolDiffRemoved: ColorValueSchema,
      toolDiffContext: ColorValueSchema,
      syntaxComment: ColorValueSchema,
      syntaxKeyword: ColorValueSchema,
      syntaxFunction: ColorValueSchema,
      syntaxVariable: ColorValueSchema,
      syntaxString: ColorValueSchema,
      syntaxNumber: ColorValueSchema,
      syntaxType: ColorValueSchema,
      syntaxOperator: ColorValueSchema,
      syntaxPunctuation: ColorValueSchema,
      thinkingOff: ColorValueSchema,
      thinkingMinimal: ColorValueSchema,
      thinkingLow: ColorValueSchema,
      thinkingMedium: ColorValueSchema,
      thinkingHigh: ColorValueSchema,
      thinkingXhigh: ColorValueSchema,
      bashMode: ColorValueSchema,
    }),
    export: Type.Optional(
      Type.Object({
        pageBg: Type.Optional(ColorValueSchema),
        cardBg: Type.Optional(ColorValueSchema),
        infoBg: Type.Optional(ColorValueSchema),
      }),
    ),
  }),
);
function hexToRgb(hex) {
  const cleaned = hex.replace("#", "");
  if (cleaned.length !== 6) throw new Error(`Invalid hex color: ${hex}`);
  const r = Number.parseInt(cleaned.slice(0, 2), 16);
  const g = Number.parseInt(cleaned.slice(2, 4), 16);
  const b = Number.parseInt(cleaned.slice(4, 6), 16);
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b))
    throw new Error(`Invalid hex color: ${hex}`);
  return {
    r,
    g,
    b,
  };
}
const CUBE_VALUES = [0, 95, 135, 175, 215, 255];
const GRAY_VALUES = Array.from({ length: 24 }, (_, i) => 8 + i * 10);
function findClosestCubeIndex(value) {
  let minDist = Infinity;
  let minIdx = 0;
  for (const [i, cubeValue] of CUBE_VALUES.entries()) {
    const dist = Math.abs(value - cubeValue);
    if (dist < minDist) {
      minDist = dist;
      minIdx = i;
    }
  }
  return minIdx;
}
function findClosestGrayIndex(gray) {
  let minDist = Infinity;
  let minIdx = 0;
  for (const [i, grayValue] of GRAY_VALUES.entries()) {
    const dist = Math.abs(gray - grayValue);
    if (dist < minDist) {
      minDist = dist;
      minIdx = i;
    }
  }
  return minIdx;
}
function colorDistance(r1, g1, b1, r2, g2, b2) {
  const dr = r1 - r2;
  const dg = g1 - g2;
  const db = b1 - b2;
  return dr * dr * 0.299 + dg * dg * 0.587 + db * db * 0.114;
}
function rgbTo256(r, g, b) {
  const rIdx = findClosestCubeIndex(r);
  const gIdx = findClosestCubeIndex(g);
  const bIdx = findClosestCubeIndex(b);
  const cubeR = CUBE_VALUES[rIdx];
  const cubeG = CUBE_VALUES[gIdx];
  const cubeB = CUBE_VALUES[bIdx];
  if (cubeR === void 0 || cubeG === void 0 || cubeB === void 0)
    throw new Error("Invalid 256-color cube index");
  const cubeIndex = 16 + 36 * rIdx + 6 * gIdx + bIdx;
  const cubeDist = colorDistance(r, g, b, cubeR, cubeG, cubeB);
  const grayIdx = findClosestGrayIndex(Math.round(0.299 * r + 0.587 * g + 0.114 * b));
  const grayValue = GRAY_VALUES[grayIdx];
  if (grayValue === void 0) throw new Error("Invalid 256-color grayscale index");
  const grayIndex = 232 + grayIdx;
  const grayDist = colorDistance(r, g, b, grayValue, grayValue, grayValue);
  if (Math.max(r, g, b) - Math.min(r, g, b) < 10 && grayDist < cubeDist) return grayIndex;
  return cubeIndex;
}
function hexTo256(hex) {
  const { r, g, b } = hexToRgb(hex);
  return rgbTo256(r, g, b);
}
function fgAnsi(color, mode) {
  if (color === "") return "\x1B[39m";
  if (typeof color === "number") return `\x1b[38;5;${color}m`;
  if (color.startsWith("#")) {
    if (mode === "truecolor") {
      const { r, g, b } = hexToRgb(color);
      return `\x1b[38;2;${r};${g};${b}m`;
    }
    return `\x1b[38;5;${hexTo256(color)}m`;
  }
  throw new Error(`Invalid color value: ${color}`);
}
function bgAnsi(color, mode) {
  if (color === "") return "\x1B[49m";
  if (typeof color === "number") return `\x1b[48;5;${color}m`;
  if (color.startsWith("#")) {
    if (mode === "truecolor") {
      const { r, g, b } = hexToRgb(color);
      return `\x1b[48;2;${r};${g};${b}m`;
    }
    return `\x1b[48;5;${hexTo256(color)}m`;
  }
  throw new Error(`Invalid color value: ${color}`);
}
function resolveVarRefs(value, vars, visited = /* @__PURE__ */ new Set()) {
  if (typeof value === "number" || value === "" || value.startsWith("#")) return value;
  if (visited.has(value)) throw new Error(`Circular variable reference detected: ${value}`);
  if (!(value in vars)) throw new Error(`Variable reference not found: ${value}`);
  visited.add(value);
  const resolved = vars[value];
  if (resolved === void 0) throw new Error(`Variable reference not found: ${value}`);
  return resolveVarRefs(resolved, vars, visited);
}
function resolveThemeColors(colors, vars = {}) {
  const resolved = {};
  for (const [key, value] of Object.entries(colors)) resolved[key] = resolveVarRefs(value, vars);
  return resolved;
}
var Theme = class {
  constructor(fgColors, bgColors, mode, options = {}) {
    this.name = options.name;
    this.sourcePath = options.sourcePath;
    this.sourceInfo = options.sourceInfo;
    this.mode = mode;
    this.fgColors = /* @__PURE__ */ new Map();
    for (const [key, value] of Object.entries(fgColors))
      this.fgColors.set(key, fgAnsi(value, mode));
    this.bgColors = /* @__PURE__ */ new Map();
    for (const [key, value] of Object.entries(bgColors))
      this.bgColors.set(key, bgAnsi(value, mode));
  }
  fg(color, text) {
    const ansi = this.fgColors.get(color);
    if (!ansi) throw new Error(`Unknown theme color: ${color}`);
    return `${ansi}${text}\x1b[39m`;
  }
  bg(color, text) {
    const ansi = this.bgColors.get(color);
    if (!ansi) throw new Error(`Unknown theme background color: ${color}`);
    return `${ansi}${text}\x1b[49m`;
  }
  bold(text) {
    return chalk.bold(text);
  }
  italic(text) {
    return chalk.italic(text);
  }
  underline(text) {
    return chalk.underline(text);
  }
  inverse(text) {
    return chalk.inverse(text);
  }
  strikethrough(text) {
    return chalk.strikethrough(text);
  }
  getFgAnsi(color) {
    const ansi = this.fgColors.get(color);
    if (!ansi) throw new Error(`Unknown theme color: ${color}`);
    return ansi;
  }
  getBgAnsi(color) {
    const ansi = this.bgColors.get(color);
    if (!ansi) throw new Error(`Unknown theme background color: ${color}`);
    return ansi;
  }
  getColorMode() {
    return this.mode;
  }
  getThinkingBorderColor(level) {
    switch (level) {
      case "off":
        return (str) => this.fg("thinkingOff", str);
      case "minimal":
        return (str) => this.fg("thinkingMinimal", str);
      case "low":
        return (str) => this.fg("thinkingLow", str);
      case "medium":
        return (str) => this.fg("thinkingMedium", str);
      case "high":
        return (str) => this.fg("thinkingHigh", str);
      case "xhigh":
        return (str) => this.fg("thinkingXhigh", str);
      default:
        return (str) => this.fg("thinkingOff", str);
    }
  }
  getBashModeBorderColor() {
    return (str) => this.fg("bashMode", str);
  }
};
function parseThemeJson(label, json) {
  if (!validateThemeJson.Check(json)) {
    const errors = Array.from(validateThemeJson.Errors(json));
    const missingColors = /* @__PURE__ */ new Set();
    const otherErrors = [];
    for (const error of errors) {
      if (error.keyword === "required" && error.instancePath === "/colors") {
        const requiredProperties = error.params.requiredProperties;
        for (const requiredProperty of requiredProperties ?? [])
          missingColors.add(requiredProperty);
        continue;
      }
      const pathLocal = error.instancePath || "/";
      otherErrors.push(`  - ${pathLocal}: ${error.message}`);
    }
    let errorMessage = `Invalid theme "${label}":\n`;
    if (missingColors.size > 0) {
      errorMessage += "\nMissing required color tokens:\n";
      errorMessage += Array.from(missingColors)
        .toSorted()
        .map((color) => `  - ${color}`)
        .join("\n");
      errorMessage += '\n\nPlease add these colors to your theme\'s "colors" object.';
      errorMessage += "\nSee the built-in themes (dark.json, light.json) for reference values.";
    }
    if (otherErrors.length > 0) errorMessage += `\n\nOther errors:\n${otherErrors.join("\n")}`;
    throw new Error(errorMessage);
  }
  return json;
}
function parseThemeJsonContent(label, content) {
  let json;
  try {
    json = JSON.parse(content);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to parse theme ${label}: ${message}`, { cause: error });
  }
  return parseThemeJson(label, json);
}
function createTheme(themeJson, mode, sourcePath) {
  const colorMode = mode ?? (getCapabilities().trueColor ? "truecolor" : "256color");
  const resolvedColors = resolveThemeColors(themeJson.colors, themeJson.vars);
  const fgColors = {};
  const bgColors = {};
  const bgColorKeys = /* @__PURE__ */ new Set([
    "selectedBg",
    "userMessageBg",
    "customMessageBg",
    "toolPendingBg",
    "toolSuccessBg",
    "toolErrorBg",
  ]);
  for (const [key, value] of Object.entries(resolvedColors))
    if (bgColorKeys.has(key)) bgColors[key] = value;
    else fgColors[key] = value;
  return new Theme(fgColors, bgColors, colorMode, {
    name: themeJson.name,
    sourcePath,
  });
}
function loadThemeFromPath(themePath, mode) {
  return createTheme(
    parseThemeJsonContent(themePath, fs$2.readFileSync(themePath, "utf-8")),
    mode,
    themePath,
  );
}
const THEME_KEY = Symbol.for("openclaw:agent-theme");
const theme = new Proxy(
  {},
  {
    get(_target, prop) {
      const t = globalThis[THEME_KEY];
      if (!t) throw new Error("Theme not initialized. Call setTheme() first.");
      return t[prop];
    },
  },
);
let cachedHighlightThemeFor;
let cachedCliHighlightTheme;
function buildCliHighlightTheme(t) {
  return {
    keyword: (s) => t.fg("syntaxKeyword", s),
    built_in: (s) => t.fg("syntaxType", s),
    literal: (s) => t.fg("syntaxNumber", s),
    number: (s) => t.fg("syntaxNumber", s),
    string: (s) => t.fg("syntaxString", s),
    comment: (s) => t.fg("syntaxComment", s),
    function: (s) => t.fg("syntaxFunction", s),
    title: (s) => t.fg("syntaxFunction", s),
    class: (s) => t.fg("syntaxType", s),
    type: (s) => t.fg("syntaxType", s),
    attr: (s) => t.fg("syntaxVariable", s),
    variable: (s) => t.fg("syntaxVariable", s),
    params: (s) => t.fg("syntaxVariable", s),
    operator: (s) => t.fg("syntaxOperator", s),
    punctuation: (s) => t.fg("syntaxPunctuation", s),
  };
}
function getCliHighlightTheme(t) {
  if (cachedHighlightThemeFor !== t || !cachedCliHighlightTheme) {
    cachedHighlightThemeFor = t;
    cachedCliHighlightTheme = buildCliHighlightTheme(t);
  }
  return cachedCliHighlightTheme;
}
/**
 * Highlight code with syntax coloring based on file extension or language.
 * Returns array of highlighted lines.
 */
function highlightCode(code, lang) {
  const validLang = lang && supportsLanguage(lang) ? lang : void 0;
  if (!validLang) return code.split("\n").map((line) => theme.fg("mdCodeBlock", line));
  const opts = {
    language: validLang,
    ignoreIllegals: true,
    theme: getCliHighlightTheme(theme),
  };
  try {
    return highlight(code, opts).split("\n");
  } catch {
    return code.split("\n");
  }
}
/**
 * Get language identifier from file path extension.
 */
function getLanguageFromPath(filePath) {
  const ext = filePath.split(".").pop()?.toLowerCase();
  if (!ext) return;
  return {
    ts: "typescript",
    tsx: "typescript",
    js: "javascript",
    jsx: "javascript",
    mjs: "javascript",
    cjs: "javascript",
    py: "python",
    rb: "ruby",
    rs: "rust",
    go: "go",
    java: "java",
    kt: "kotlin",
    swift: "swift",
    c: "c",
    h: "c",
    cpp: "cpp",
    cc: "cpp",
    cxx: "cpp",
    hpp: "cpp",
    cs: "csharp",
    php: "php",
    sh: "bash",
    bash: "bash",
    zsh: "bash",
    fish: "fish",
    ps1: "powershell",
    sql: "sql",
    html: "html",
    htm: "html",
    css: "css",
    scss: "scss",
    sass: "sass",
    less: "less",
    json: "json",
    yaml: "yaml",
    yml: "yaml",
    toml: "toml",
    xml: "xml",
    md: "markdown",
    markdown: "markdown",
    dockerfile: "dockerfile",
    makefile: "makefile",
    cmake: "cmake",
    lua: "lua",
    perl: "perl",
    r: "r",
    scala: "scala",
    clj: "clojure",
    ex: "elixir",
    exs: "elixir",
    erl: "erlang",
    hs: "haskell",
    ml: "ocaml",
    vim: "vim",
    graphql: "graphql",
    proto: "protobuf",
    tf: "hcl",
    hcl: "hcl",
  }[ext];
}
//#endregion
//#region src/agents/modes/interactive/components/keybinding-hints.ts
/**
 * Utilities for formatting keybinding hints in the UI.
 */
function formatKeyPart(part, options) {
  const displayPart =
    process.platform === "darwin" && part.toLowerCase() === "alt" ? "option" : part;
  return options.capitalize
    ? displayPart.charAt(0).toUpperCase() + displayPart.slice(1)
    : displayPart;
}
function formatKeyText(key, options = {}) {
  return key
    .split("/")
    .map((k) =>
      k
        .split("+")
        .map((part) => formatKeyPart(part, options))
        .join("+"),
    )
    .join("/");
}
function formatKeys(keys, options = {}) {
  if (keys.length === 0) return "";
  return formatKeyText(keys.join("/"), options);
}
function keyText(keybinding) {
  return formatKeys(getKeybindings().getKeys(keybinding));
}
function keyHint(keybinding, description) {
  return theme.fg("dim", keyText(keybinding)) + theme.fg("muted", ` ${description}`);
}
//#endregion
//#region src/agents/modes/interactive/components/visual-truncate.ts
/**
 * Shared utility for truncating text to visual lines (accounting for line wrapping).
 * Used by both tool-execution.ts and bash-execution.ts for consistent behavior.
 */
/**
 * Truncate text to a maximum number of visual lines (from the end).
 * This accounts for line wrapping based on terminal width.
 *
 * @param text - The text content (may contain newlines)
 * @param maxVisualLines - Maximum number of visual lines to show
 * @param width - Terminal/render width
 * @param paddingX - Horizontal padding for Text component (default 0).
 *                   Use 0 when result will be placed in a Box (Box adds its own padding).
 *                   Use 1 when result will be placed in a plain Container.
 * @returns The truncated visual lines and count of skipped lines
 */
function truncateToVisualLines(text, maxVisualLines, width, paddingX = 0) {
  if (!text)
    return {
      visualLines: [],
      skippedCount: 0,
    };
  const allVisualLines = new Text(text, paddingX, 0).render(width);
  if (allVisualLines.length <= maxVisualLines)
    return {
      visualLines: allVisualLines,
      skippedCount: 0,
    };
  return {
    visualLines: allVisualLines.slice(-maxVisualLines),
    skippedCount: allVisualLines.length - maxVisualLines,
  };
}
//#endregion
//#region src/agents/sessions/tools/render-utils.ts
/**
 * Rendering helpers for session tool output in the TUI.
 *
 * Normalizes paths/text/image fallbacks before tool results are styled or truncated.
 */
/** Shortens paths under the current home directory for display. */
function shortenPath(path) {
  if (typeof path !== "string") return "";
  const home = os$1.homedir();
  if (path === home) return "~";
  if (path.startsWith(`${home}/`) || path.startsWith(`${home}\\`))
    return `~${path.slice(home.length)}`;
  return path;
}
/** Returns a display string for string/nullish values, or null for unsupported values. */
function str(value) {
  if (typeof value === "string") return value;
  if (value == null) return "";
  return null;
}
/** Replaces tabs with stable spaces so terminal layout does not shift by tab stop. */
function replaceTabs$1(text) {
  return text.replace(/\t/g, "   ");
}
/** Normalizes raw terminal output before display. */
function normalizeDisplayText(text) {
  return text.replace(/\r/g, "");
}
/** Extracts text output and image placeholders from a tool result. */
function getTextOutput(result, showImages) {
  if (!result) return "";
  const textBlocks = result.content.filter((c) => c.type === "text");
  const imageBlocks = result.content.filter((c) => c.type === "image");
  let output = textBlocks
    .map((c) => sanitizeBinaryOutput(c.text || "", { ansiMode: "compat" }).replace(/\r/g, ""))
    .join("\n");
  const caps = getCapabilities();
  if (imageBlocks.length > 0 && (!caps.images || !showImages)) {
    const imageIndicators = imageBlocks
      .map((img) => {
        return imageFallback(
          img.mimeType ?? "image/unknown",
          img.data && img.mimeType
            ? (getImageDimensions(img.data, img.mimeType) ?? void 0)
            : void 0,
        );
      })
      .join("\n");
    output = output ? `${output}\n${imageIndicators}` : imageIndicators;
  }
  return output;
}
/** Renders bounded text output with the shared TUI expansion hint. */
function formatSessionToolOutput(result, options, theme, showImages, collapsedLineLimit) {
  const output = getTextOutput(result, showImages).trim();
  if (!output) return "";
  const lines = output.split("\n");
  const maxLines = options.expanded ? lines.length : collapsedLineLimit;
  const displayLines = lines.slice(0, maxLines);
  const remaining = lines.length - maxLines;
  let text = `\n${displayLines.map((line) => theme.fg("toolOutput", line)).join("\n")}`;
  if (remaining > 0)
    text += `${theme.fg("muted", `\n... (${remaining} more lines,`)} ${keyHint("app.tools.expand", "to expand")})`;
  return text;
}
function appendSessionToolTruncationWarning(text, theme, options) {
  const warnings = [];
  if (options.limit) warnings.push(`${options.limit.count} ${options.limit.noun} limit`);
  if (options.truncation?.truncated)
    warnings.push(`${formatSize(options.truncation.maxBytes ?? 51200)} limit`);
  warnings.push(...(options.additionalWarnings ?? []));
  if (warnings.length === 0) return text;
  return `${text}\n${theme.fg("warning", `[Truncated: ${warnings.join(", ")}]`)}`;
}
/** Formats the invalid-argument marker with the active theme. */
function invalidArgText(theme) {
  return theme.fg("error", "[invalid arg]");
}
//#endregion
//#region src/agents/sessions/tools/tool-contracts.ts
function formatFullOutputFooter(path) {
  return `Full output: ${path}`;
}
//#endregion
//#region src/agents/sessions/tools/tool-definition-wrapper.ts
/** Wrap a ToolDefinition into an AgentTool for the core runtime. */
function wrapToolDefinition(definition, ctxFactory) {
  return {
    name: definition.name,
    label: definition.label,
    ...(definition.hideFromChannelProgress === true ? { hideFromChannelProgress: true } : {}),
    description: definition.description,
    parameters: definition.parameters,
    prepareArguments: definition.prepareArguments,
    executionMode: definition.executionMode,
    execute: (toolCallId, params, signal, onUpdate) =>
      definition.execute(toolCallId, params, signal, onUpdate, ctxFactory?.()),
  };
}
/** Wrap multiple ToolDefinitions into AgentTools for the core runtime. */
function wrapToolDefinitions(definitions, ctxFactory) {
  return definitions.map((definition) => wrapToolDefinition(definition, ctxFactory));
}
/**
 * Synthesize a minimal ToolDefinition from an AgentTool.
 *
 * This keeps AgentSession's internal registry definition-first even when a caller
 * provides plain AgentTool overrides that do not include prompt metadata or renderers.
 */
function createToolDefinitionFromAgentTool(tool) {
  return {
    name: tool.name,
    label: tool.label,
    ...(tool.hideFromChannelProgress === true ? { hideFromChannelProgress: true } : {}),
    description: tool.description,
    parameters: tool.parameters,
    prepareArguments: tool.prepareArguments,
    executionMode: tool.executionMode,
    execute: async (toolCallId, params, signal, onUpdate) =>
      tool.execute(toolCallId, params, signal, onUpdate),
  };
}
//#endregion
//#region src/agents/sessions/tools/bash.ts
/**
 * Built-in bash session tool.
 *
 * Executes local shell commands with streaming output accumulation and TUI renderers.
 */
const bashSchema = Type.Object({
  command: Type.String({ description: "Bash command." }),
  timeout: Type.Optional(Type.Number({ description: "Optional timeout seconds; default none." })),
});
function resolveBashTimeoutMs(timeoutSeconds) {
  if (typeof timeoutSeconds !== "number" || !Number.isFinite(timeoutSeconds) || timeoutSeconds <= 0)
    return;
  return resolveTimerTimeoutMs(timeoutSeconds * 1e3, 1);
}
/**
 * Create bash operations using OpenClaw runtime's built-in local shell execution backend.
 *
 * This is useful for extensions that intercept user_bash and still want OpenClaw runtime's
 * standard local shell behavior while wrapping or rewriting commands.
 */
function createLocalBashOperations(options) {
  return {
    exec: (command, cwd, { onData, signal, timeout, env }) => {
      return new Promise((resolve, reject) => {
        const { shell, args } = getBashShellConfig(options?.shellPath);
        if (!existsSync(cwd)) {
          reject(
            /* @__PURE__ */ new Error(
              `Working directory does not exist: ${cwd}\nCannot execute bash commands.`,
            ),
          );
          return;
        }
        const child = spawnCommand([shell, ...args, command], {
          baseEnv: {},
          buffer: false,
          cwd,
          detached: process.platform !== "win32",
          env: env ?? getShellEnv(),
          reject: false,
          stdio: ["ignore", "pipe", "pipe"],
        });
        const releaseOutput = releaseChildProcessOutputAfterExit(child);
        let timedOut = false;
        let timeoutHandle;
        const timeoutMs = resolveBashTimeoutMs(timeout);
        if (timeoutMs !== void 0)
          timeoutHandle = setTimeout(() => {
            timedOut = true;
            if (child.pid) killProcessTree$1(child.pid);
          }, timeoutMs);
        child.stdout?.on("data", onData);
        child.stderr?.on("data", onData);
        const onAbort = () => {
          if (child.pid) killProcessTree$1(child.pid);
        };
        if (signal)
          if (signal.aborted) onAbort();
          else signal.addEventListener("abort", onAbort, { once: true });
        child
          .then((result) => {
            if (result.failed && result.exitCode === void 0 && result.signal === void 0) {
              if (result instanceof Error) throw result;
              throw new Error(`Failed to launch shell: ${shell}`, { cause: result });
            }
            if (timeoutHandle) clearTimeout(timeoutHandle);
            if (signal) signal.removeEventListener("abort", onAbort);
            if (signal?.aborted) {
              reject(/* @__PURE__ */ new Error("aborted"));
              return;
            }
            if (timedOut) {
              reject(/* @__PURE__ */ new Error(`timeout:${timeout}`));
              return;
            }
            resolve({ exitCode: result.exitCode ?? (result.failed ? 1 : 0) });
          })
          .catch((err) => {
            if (timeoutHandle) clearTimeout(timeoutHandle);
            if (signal) signal.removeEventListener("abort", onAbort);
            reject(toErrorObject(err, "Non-Error rejection"));
          })
          .finally(releaseOutput);
      });
    },
  };
}
function resolveSpawnContext(command, cwd, spawnHook) {
  const baseContext = {
    command,
    cwd,
    env: { ...getShellEnv() },
  };
  return spawnHook ? spawnHook(baseContext) : baseContext;
}
const BASH_PREVIEW_LINES = 5;
const BASH_UPDATE_THROTTLE_MS = 100;
var BashResultRenderComponent = class extends Container {
  constructor(..._args) {
    super(..._args);
    this.state = {
      cachedWidth: void 0,
      cachedLines: void 0,
      cachedSkipped: void 0,
    };
  }
};
function formatBashCall(args) {
  const command = str(args?.command);
  const timeout = args?.timeout;
  const timeoutSuffix = timeout ? theme.fg("muted", ` (timeout ${timeout}s)`) : "";
  const commandDisplay =
    command === null ? invalidArgText(theme) : command ? command : theme.fg("toolOutput", "...");
  return theme.fg("toolTitle", theme.bold(`$ ${commandDisplay}`)) + timeoutSuffix;
}
function rebuildBashResultRenderComponent(
  component,
  result,
  options,
  showImages,
  startedAt,
  endedAt,
) {
  const state = component.state;
  component.clear();
  let output = getTextOutput(result, showImages).trim();
  const truncation = result.details?.truncation;
  const fullOutputPath = result.details?.fullOutputPath;
  if (!options.isPartial && truncation?.truncated && fullOutputPath && output.endsWith("]")) {
    const footerStart = output.lastIndexOf("\n\n[");
    if (footerStart !== -1 && output.slice(footerStart).includes(fullOutputPath))
      output = output.slice(0, footerStart).trimEnd();
  }
  if (output) {
    const styledOutput = output
      .split("\n")
      .map((line) => theme.fg("toolOutput", line))
      .join("\n");
    if (options.expanded) component.addChild(new Text(`\n${styledOutput}`, 0, 0));
    else
      component.addChild({
        render: (width) => {
          if (state.cachedLines === void 0 || state.cachedWidth !== width) {
            const preview = truncateToVisualLines(styledOutput, BASH_PREVIEW_LINES, width);
            state.cachedLines = preview.visualLines;
            state.cachedSkipped = preview.skippedCount;
            state.cachedWidth = width;
          }
          if (state.cachedSkipped && state.cachedSkipped > 0)
            return [
              "",
              truncateToWidth(
                theme.fg("muted", `... (${state.cachedSkipped} earlier lines,`) +
                  ` ${keyHint("app.tools.expand", "to expand")})`,
                width,
                "...",
              ),
              ...(state.cachedLines ?? []),
            ];
          return ["", ...(state.cachedLines ?? [])];
        },
        invalidate: () => {
          state.cachedWidth = void 0;
          state.cachedLines = void 0;
          state.cachedSkipped = void 0;
        },
      });
  }
  if (truncation?.truncated || fullOutputPath) {
    const warnings = [];
    if (fullOutputPath) warnings.push(formatFullOutputFooter(fullOutputPath));
    if (truncation?.truncated)
      if (truncation.truncatedBy === "lines")
        warnings.push(
          `Truncated: showing ${truncation.outputLines} of ${truncation.totalLines} lines`,
        );
      else
        warnings.push(
          `Truncated: ${truncation.outputLines} lines shown (${formatSize(truncation.maxBytes ?? 51200)} limit)`,
        );
    component.addChild(new Text(`\n${theme.fg("warning", `[${warnings.join(". ")}]`)}`, 0, 0));
  }
  if (startedAt !== void 0) {
    const label = options.isPartial ? "Elapsed" : "Took";
    const endTime = endedAt ?? Date.now();
    component.addChild(
      new Text(
        `\n${theme.fg("muted", `${label} ${formatDurationSeconds(endTime - startedAt)}`)}`,
        0,
        0,
      ),
    );
  }
}
function createBashToolDefinition(cwd, options) {
  const ops = options?.operations ?? createLocalBashOperations({ shellPath: options?.shellPath });
  const commandPrefix = options?.commandPrefix;
  const spawnHook = options?.spawnHook;
  return {
    name: "bash",
    label: "bash",
    description: `Run bash in cwd; stdout+stderr. Returns last ${DEFAULT_MAX_LINES} lines or ${DEFAULT_MAX_BYTES / 1024}KB; full truncated output saved temp. Optional timeout seconds.`,
    promptSnippet: "Execute bash commands (ls, grep, find, etc.)",
    parameters: bashSchema,
    async execute(toolCallId, { command, timeout }, signal, onUpdate, ctx) {
      const spawnContext = resolveSpawnContext(
        commandPrefix ? `${commandPrefix}\n${command}` : command,
        cwd,
        spawnHook,
      );
      const output = new OutputAccumulator({ tempFilePrefix: "openclaw-bash" });
      let acceptingOutput = true;
      let updateTimer;
      let updateDirty = false;
      let lastUpdateAt = 0;
      const emitOutputUpdate = () => {
        if (!onUpdate || !updateDirty) return;
        updateDirty = false;
        lastUpdateAt = Date.now();
        const snapshot = output.snapshot({ persistIfTruncated: true });
        onUpdate({
          content: [
            {
              type: "text",
              text: snapshot.content || "",
            },
          ],
          details: {
            truncation: snapshot.truncation.truncated ? snapshot.truncation : void 0,
            fullOutputPath: snapshot.fullOutputPath,
          },
        });
      };
      const clearUpdateTimer = () => {
        if (updateTimer) {
          clearTimeout(updateTimer);
          updateTimer = void 0;
        }
      };
      const scheduleOutputUpdate = () => {
        if (!onUpdate) return;
        updateDirty = true;
        const delay = BASH_UPDATE_THROTTLE_MS - (Date.now() - lastUpdateAt);
        if (delay <= 0) {
          clearUpdateTimer();
          emitOutputUpdate();
          return;
        }
        updateTimer ??= setTimeout(() => {
          updateTimer = void 0;
          emitOutputUpdate();
        }, delay);
      };
      if (onUpdate)
        onUpdate({
          content: [],
          details: void 0,
        });
      const handleData = (data) => {
        if (!acceptingOutput) return;
        output.append(data);
        scheduleOutputUpdate();
      };
      const finishOutput = async () => {
        acceptingOutput = false;
        output.finish();
        clearUpdateTimer();
        emitOutputUpdate();
        const snapshot = output.snapshot({ persistIfTruncated: true });
        await output.closeTempFile();
        return snapshot;
      };
      const formatOutput = (snapshot, emptyText = "(no output)") => {
        const truncation = snapshot.truncation;
        let text = snapshot.content || emptyText;
        let details;
        if (truncation.truncated) {
          const fullOutputPath = snapshot.fullOutputPath;
          if (!fullOutputPath)
            throw new Error("Missing full output path for truncated bash output");
          details = {
            truncation,
            fullOutputPath,
          };
          const startLine = truncation.totalLines - truncation.outputLines + 1;
          const endLine = truncation.totalLines;
          if (truncation.lastLinePartial) {
            const lastLineSize = formatSize(output.getLastLineBytes());
            text += `\n\n[Showing last ${formatSize(truncation.outputBytes)} of line ${endLine} (line is ${lastLineSize}). ${formatFullOutputFooter(fullOutputPath)}]`;
          } else if (truncation.truncatedBy === "lines")
            text += `\n\n[Showing lines ${startLine}-${endLine} of ${truncation.totalLines}. ${formatFullOutputFooter(fullOutputPath)}]`;
          else
            text += `\n\n[Showing lines ${startLine}-${endLine} of ${truncation.totalLines} (${formatSize(DEFAULT_MAX_BYTES)} limit). ${formatFullOutputFooter(fullOutputPath)}]`;
        }
        return {
          text,
          details,
        };
      };
      const appendStatus = (text, status) => `${text ? `${text}\n\n` : ""}${status}`;
      try {
        let exitCode;
        try {
          exitCode = (
            await ops.exec(spawnContext.command, spawnContext.cwd, {
              onData: handleData,
              signal,
              timeout,
              env: spawnContext.env,
            })
          ).exitCode;
        } catch (err) {
          const { text } = formatOutput(await finishOutput(), "");
          if (err instanceof Error && err.message === "aborted")
            throw new Error(appendStatus(text, "Command aborted"), { cause: err });
          if (err instanceof Error && err.message.startsWith("timeout:")) {
            const timeoutSecs = err.message.split(":")[1];
            throw new Error(appendStatus(text, `Command timed out after ${timeoutSecs} seconds`), {
              cause: err,
            });
          }
          throw err;
        }
        const { text: outputText, details } = formatOutput(await finishOutput());
        if (exitCode !== 0 && exitCode !== null)
          throw new Error(appendStatus(outputText, `Command exited with code ${exitCode}`));
        return {
          content: [
            {
              type: "text",
              text: outputText,
            },
          ],
          details,
        };
      } finally {
        clearUpdateTimer();
      }
    },
    renderCall(args, themeValue, context) {
      const state = context.state;
      if (context.executionStarted && state.startedAt === void 0) {
        state.startedAt = Date.now();
        state.endedAt = void 0;
      }
      const text = context.lastComponent ?? new Text("", 0, 0);
      text.setText(formatBashCall(args));
      return text;
    },
    renderResult(result, optionsLocal, themeLocal, context) {
      const state = context.state;
      if (state.startedAt !== void 0 && optionsLocal.isPartial && !state.interval)
        state.interval = setInterval(() => context.invalidate(), 1e3);
      if (!optionsLocal.isPartial || context.isError) {
        state.endedAt ??= Date.now();
        if (state.interval) {
          clearInterval(state.interval);
          state.interval = void 0;
        }
      }
      const component = context.lastComponent ?? new BashResultRenderComponent();
      rebuildBashResultRenderComponent(
        component,
        result,
        optionsLocal,
        context.showImages,
        state.startedAt,
        state.endedAt,
      );
      component.invalidate();
      return component;
    },
  };
}
function createBashTool(cwd, options) {
  return wrapToolDefinition(createBashToolDefinition(cwd, options));
}
//#endregion
//#region src/agents/modes/interactive/components/diff.ts
/**
 * Interactive terminal diff renderer.
 *
 * Produces colored line and intra-line highlights for the Pi TUI review surfaces.
 */
/**
 * Parse diff line to extract prefix, line number, and content.
 * Format: "+123 content" or "-123 content" or " 123 content" or "     ..."
 */
function parseDiffLine(line) {
  const match = line.match(/^([+-\s])(\s*\d*)\s(.*)$/);
  if (!match) return null;
  const [, prefix, lineNum, content] = match;
  return prefix !== void 0 && lineNum !== void 0 && content !== void 0
    ? {
        prefix,
        lineNum,
        content,
      }
    : null;
}
/**
 * Replace tabs with spaces for consistent rendering.
 */
function replaceTabs(text) {
  return text.replace(/\t/g, "   ");
}
/**
 * Compute word-level diff and render with inverse on changed parts.
 * Uses diffWords which groups whitespace with adjacent words for cleaner highlighting.
 * Strips leading whitespace from inverse to avoid highlighting indentation.
 */
function renderIntraLineDiff(oldContent, newContent) {
  const wordDiff = Diff.diffWords(oldContent, newContent);
  let removedLine = "";
  let addedLine = "";
  let isFirstRemoved = true;
  let isFirstAdded = true;
  for (const part of wordDiff)
    if (part.removed) {
      let value = part.value;
      if (isFirstRemoved) {
        const leadingWs = value.match(/^(\s*)/)?.[1] || "";
        value = value.slice(leadingWs.length);
        removedLine += leadingWs;
        isFirstRemoved = false;
      }
      if (value) removedLine += theme.inverse(value);
    } else if (part.added) {
      let value = part.value;
      if (isFirstAdded) {
        const leadingWs = value.match(/^(\s*)/)?.[1] || "";
        value = value.slice(leadingWs.length);
        addedLine += leadingWs;
        isFirstAdded = false;
      }
      if (value) addedLine += theme.inverse(value);
    } else {
      removedLine += part.value;
      addedLine += part.value;
    }
  return {
    removedLine,
    addedLine,
  };
}
/**
 * Render a diff string with colored lines and intra-line change highlighting.
 * - Context lines: dim/gray
 * - Removed lines: red, with inverse on changed tokens
 * - Added lines: green, with inverse on changed tokens
 */
function renderDiff(diffText, _options = {}) {
  const lines = diffText.split("\n");
  const result = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines.at(i);
    if (line === void 0) break;
    const parsed = parseDiffLine(line);
    if (!parsed) {
      result.push(theme.fg("toolDiffContext", line));
      i++;
      continue;
    }
    if (parsed.prefix === "-") {
      const removedLines = [];
      while (i < lines.length) {
        const currentLine = lines.at(i);
        const p = currentLine === void 0 ? null : parseDiffLine(currentLine);
        if (!p || p.prefix !== "-") break;
        removedLines.push({
          lineNum: p.lineNum,
          content: p.content,
        });
        i++;
      }
      const addedLines = [];
      while (i < lines.length) {
        const currentLine = lines.at(i);
        const p = currentLine === void 0 ? null : parseDiffLine(currentLine);
        if (!p || p.prefix !== "+") break;
        addedLines.push({
          lineNum: p.lineNum,
          content: p.content,
        });
        i++;
      }
      if (removedLines.length === 1 && addedLines.length === 1) {
        const removed = removedLines[0];
        const added = addedLines[0];
        if (!removed || !added) continue;
        const { removedLine, addedLine } = renderIntraLineDiff(
          replaceTabs(removed.content),
          replaceTabs(added.content),
        );
        result.push(theme.fg("toolDiffRemoved", `-${removed.lineNum} ${removedLine}`));
        result.push(theme.fg("toolDiffAdded", `+${added.lineNum} ${addedLine}`));
      } else {
        for (const removed of removedLines)
          result.push(
            theme.fg("toolDiffRemoved", `-${removed.lineNum} ${replaceTabs(removed.content)}`),
          );
        for (const added of addedLines)
          result.push(theme.fg("toolDiffAdded", `+${added.lineNum} ${replaceTabs(added.content)}`));
      }
    } else if (parsed.prefix === "+") {
      result.push(theme.fg("toolDiffAdded", `+${parsed.lineNum} ${replaceTabs(parsed.content)}`));
      i++;
    } else {
      result.push(theme.fg("toolDiffContext", ` ${parsed.lineNum} ${replaceTabs(parsed.content)}`));
      i++;
    }
  }
  return result.join("\n");
}
//#endregion
//#region src/agents/sessions/tools/edit-diff.ts
/**
 * Shared diff computation utilities for the edit tool.
 * Used by both edit.ts (for execution) and tool-execution.ts (for preview rendering).
 */
function detectLineEnding(content) {
  const crlfIdx = content.indexOf("\r\n");
  const lfIdx = content.indexOf("\n");
  if (lfIdx === -1) return "\n";
  if (crlfIdx === -1) return "\n";
  return crlfIdx < lfIdx ? "\r\n" : "\n";
}
function normalizeToLF(text) {
  return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}
function restoreLineEndings(text, ending) {
  return ending === "\r\n" ? text.replace(/\n/g, "\r\n") : text;
}
/**
 * Normalize text for fuzzy matching. Applies progressive transformations:
 * - Strip trailing whitespace from each line
 * - Normalize smart quotes to ASCII equivalents
 * - Normalize Unicode dashes/hyphens to ASCII hyphen
 * - Normalize special Unicode spaces to regular space
 */
function normalizeForFuzzyMatch(text) {
  return text
    .normalize("NFKC")
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    .replace(/[\u2010\u2011\u2012\u2013\u2014\u2015\u2212]/g, "-")
    .replace(/[\u00A0\u2002-\u200A\u202F\u205F\u3000]/g, " ");
}
var EditNoChangeError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "EditNoChangeError";
  }
};
function splitLinesWithEndings(content) {
  return content.match(/[^\n]*\n|[^\n]+/g) ?? [];
}
function getLineSpans(content) {
  let offset = 0;
  return splitLinesWithEndings(content).map((line) => {
    const span = {
      start: offset,
      end: offset + line.length,
    };
    offset = span.end;
    return span;
  });
}
function getReplacementLineRange(lines, replacement) {
  const replacementStart = replacement.matchIndex;
  const replacementEnd = replacement.matchIndex + replacement.matchLength;
  const startLine = lines.findIndex(
    (line) => replacementStart >= line.start && replacementStart < line.end,
  );
  if (startLine === -1) throw new Error("Replacement range is outside the base content.");
  let endLine = startLine;
  while (endLine < lines.length) {
    const line = lines.at(endLine);
    if (!line || line.end >= replacementEnd) break;
    endLine++;
  }
  if (endLine >= lines.length) throw new Error("Replacement range is outside the base content.");
  return {
    startLine,
    endLine: endLine + 1,
  };
}
function applyReplacements(content, replacements, offset = 0) {
  let result = content;
  for (const replacement of replacements.toReversed()) {
    const matchIndex = replacement.matchIndex - offset;
    result =
      result.slice(0, matchIndex) +
      replacement.newText +
      result.slice(matchIndex + replacement.matchLength);
  }
  return result;
}
/**
 * Rewrite only lines touched by fuzzy replacements. Untouched lines retain
 * their original bytes even though matching used normalized content.
 */
function applyReplacementsPreservingUnchangedLines(originalContent, baseContent, replacements) {
  const originalLines = splitLinesWithEndings(originalContent);
  const baseLines = getLineSpans(baseContent);
  if (originalLines.length !== baseLines.length)
    throw new Error(
      "Cannot preserve unchanged lines because the base content has a different line count.",
    );
  const groups = [];
  const sortedReplacements = replacements.toSorted((a, b) => a.matchIndex - b.matchIndex);
  for (const replacement of sortedReplacements) {
    const range = getReplacementLineRange(baseLines, replacement);
    const current = groups.at(-1);
    if (current && range.startLine < current.endLine) {
      current.endLine = Math.max(current.endLine, range.endLine);
      current.replacements.push(replacement);
    } else
      groups.push({
        ...range,
        replacements: [replacement],
      });
  }
  let originalLineIndex = 0;
  let result = "";
  for (const group of groups) {
    result += originalLines.slice(originalLineIndex, group.startLine).join("");
    const firstLine = baseLines.at(group.startLine);
    const lastLine = baseLines.at(group.endLine - 1);
    if (!firstLine || !lastLine) throw new Error("Replacement group is outside the base content.");
    const groupStartOffset = firstLine.start;
    const groupEndOffset = lastLine.end;
    result += applyReplacements(
      baseContent.slice(groupStartOffset, groupEndOffset),
      group.replacements,
      groupStartOffset,
    );
    originalLineIndex = group.endLine;
  }
  return result + originalLines.slice(originalLineIndex).join("");
}
/**
 * Find oldText in content, trying exact match first, then fuzzy match.
 * When fuzzy matching is used, the returned contentForReplacement is the
 * fuzzy-normalized version of the content (trailing whitespace stripped,
 * Unicode quotes/dashes normalized to ASCII).
 */
function fuzzyFindText(content, oldText) {
  const exactIndex = content.indexOf(oldText);
  if (exactIndex !== -1)
    return {
      found: true,
      index: exactIndex,
      matchLength: oldText.length,
      usedFuzzyMatch: false,
      contentForReplacement: content,
    };
  const fuzzyContent = normalizeForFuzzyMatch(content);
  const fuzzyOldText = normalizeForFuzzyMatch(oldText);
  const fuzzyIndex = fuzzyContent.indexOf(fuzzyOldText);
  if (fuzzyIndex === -1)
    return {
      found: false,
      index: -1,
      matchLength: 0,
      usedFuzzyMatch: false,
      contentForReplacement: content,
    };
  return {
    found: true,
    index: fuzzyIndex,
    matchLength: fuzzyOldText.length,
    usedFuzzyMatch: true,
    contentForReplacement: fuzzyContent,
  };
}
/** Strip UTF-8 BOM if present, return both the BOM (if any) and the text without it */
function stripBom(content) {
  return content.startsWith("﻿")
    ? {
        bom: "﻿",
        text: content.slice(1),
      }
    : {
        bom: "",
        text: content,
      };
}
function countOccurrences(content, oldText) {
  const fuzzyContent = normalizeForFuzzyMatch(content);
  const fuzzyOldText = normalizeForFuzzyMatch(oldText);
  return fuzzyContent.split(fuzzyOldText).length - 1;
}
const EDIT_CANDIDATE_LIMIT = 3;
const EDIT_CANDIDATE_MAX_LINES = 1e3;
const EDIT_CANDIDATE_MAX_SCAN_CHARS = 128 * 1024;
const EDIT_CANDIDATE_MAX_LINE_CHARS = 120;
const EDIT_CANDIDATE_MIN_SCORE = 0.45;
function truncateCandidateText(text, maxChars) {
  if (text.length <= maxChars) return text;
  const cut =
    maxChars > 0 &&
    /[\uD800-\uDBFF]/.test(text.charAt(maxChars - 1)) &&
    /[\uDC00-\uDFFF]/.test(text.charAt(maxChars))
      ? maxChars - 1
      : maxChars;
  return text.slice(0, cut);
}
function getBoundedLines(text, maxLines, maxScanChars) {
  return truncateCandidateText(text, maxScanChars)
    .split("\n", maxLines)
    .map((line) => truncateCandidateText(line, EDIT_CANDIDATE_MAX_LINE_CHARS));
}
function scoreCandidate(expected, candidate) {
  const normalizedExpected = expected.trim();
  const normalizedCandidate = candidate.trim();
  const maxLength = Math.max(normalizedExpected.length, normalizedCandidate.length);
  if (maxLength === 0) return 0;
  if (
    Math.min(normalizedExpected.length, normalizedCandidate.length) / maxLength <
    EDIT_CANDIDATE_MIN_SCORE
  )
    return 0;
  return 1 - levenshteinDistance(normalizedExpected, normalizedCandidate) / maxLength;
}
function describeIndentation(line) {
  const indentation = line.match(/^[ \t]*/)?.[0] ?? "";
  if (!indentation) return "none";
  const tabs = indentation.match(/\t/g)?.length ?? 0;
  const spaces = indentation.length - tabs;
  return tabs === 0 ? `${spaces} spaces` : `${spaces} spaces and ${tabs} tabs`;
}
function firstDifferenceIndex(left, right) {
  const sharedLength = Math.min(left.length, right.length);
  for (let index = 0; index < sharedLength; index++)
    if (left.charAt(index) !== right.charAt(index)) return index;
  return left.length === right.length ? -1 : sharedLength;
}
function describeCandidateDifference(expected, found) {
  if ((expected.match(/^[ \t]*/)?.[0] ?? "") !== (found.match(/^[ \t]*/)?.[0] ?? ""))
    return `indentation differs (expected ${describeIndentation(expected)}, found ${describeIndentation(found)})`;
  const expectedBackslashes = expected.match(/\\/g)?.length ?? 0;
  const foundBackslashes = found.match(/\\/g)?.length ?? 0;
  if (expectedBackslashes !== foundBackslashes)
    return `escaping differs (expected ${expectedBackslashes} backslashes, found ${foundBackslashes})`;
  const differenceIndex = firstDifferenceIndex(expected, found);
  return differenceIndex === -1
    ? "this line matches; surrounding lines differ"
    : `first difference at column ${differenceIndex + 1}`;
}
function getCandidateHint(content, oldText) {
  const expected = getBoundedLines(oldText, 32, 4096).reduce(
    (best, line) => (line.trim().length > best.trim().length ? line : best),
    "",
  );
  if (!expected.trim()) return "";
  const candidates = getBoundedLines(
    content,
    EDIT_CANDIDATE_MAX_LINES,
    EDIT_CANDIDATE_MAX_SCAN_CHARS,
  )
    .map((line, index) => {
      const score = scoreCandidate(expected, line);
      return score >= EDIT_CANDIDATE_MIN_SCORE
        ? {
            lineNumber: index + 1,
            line,
            score,
          }
        : void 0;
    })
    .filter((candidate) => candidate !== void 0)
    .toSorted((left, right) => right.score - left.score || left.lineNumber - right.lineNumber)
    .slice(0, EDIT_CANDIDATE_LIMIT);
  if (candidates.length === 0) return "";
  const expectedDisplay = JSON.stringify(expected);
  return (
    "\nClosest matching lines:\n" +
    candidates
      .map((candidate) => {
        const foundDisplay = JSON.stringify(candidate.line);
        const differenceIndex = firstDifferenceIndex(expectedDisplay, foundDisplay);
        const markerIndex =
          differenceIndex === -1
            ? Math.min(expectedDisplay.length, foundDisplay.length)
            : differenceIndex;
        const markerWidth = Math.max(
          1,
          Math.min(12, Math.max(expectedDisplay.length, foundDisplay.length) - markerIndex),
        );
        return [
          `  near line ${candidate.lineNumber} (${Math.round(candidate.score * 100)}% match):`,
          `    expected: ${expectedDisplay}`,
          `    found:    ${foundDisplay}`,
          `              ${" ".repeat(markerIndex)}${"^".repeat(markerWidth)}`,
          `    hint: ${describeCandidateDifference(expected, candidate.line)}`,
        ].join("\n");
      })
      .join("\n")
  );
}
function getNotFoundError(path, editIndex, totalEdits, content, oldText) {
  const prefix =
    totalEdits === 1 ? "Could not find the exact text" : `Could not find edits[${editIndex}]`;
  const hint = getCandidateHint(content, oldText);
  return /* @__PURE__ */ new Error(
    `${prefix} in ${path}. The old text must match exactly including all whitespace and newlines.${hint}`,
  );
}
function getDuplicateError(path, editIndex, totalEdits, occurrences) {
  if (totalEdits === 1)
    return /* @__PURE__ */ new Error(
      `Found ${occurrences} occurrences of the text in ${path}. The text must be unique. Please provide more context to make it unique.`,
    );
  return /* @__PURE__ */ new Error(
    `Found ${occurrences} occurrences of edits[${editIndex}] in ${path}. Each oldText must be unique. Please provide more context to make it unique.`,
  );
}
function getEmptyOldTextError(path, editIndex, totalEdits) {
  if (totalEdits === 1) return /* @__PURE__ */ new Error(`oldText must not be empty in ${path}.`);
  return /* @__PURE__ */ new Error(`edits[${editIndex}].oldText must not be empty in ${path}.`);
}
function getNoChangeError(path, totalEdits) {
  if (totalEdits === 1)
    return new EditNoChangeError(
      `No changes made to ${path}. The replacement produced identical content. This might indicate an issue with special characters or the text not existing as expected.`,
    );
  return new EditNoChangeError(
    `No changes made to ${path}. The replacements produced identical content.`,
  );
}
/**
 * Apply one or more exact-text replacements to LF-normalized content.
 *
 * All edits are matched against the same original content. Replacements are
 * then applied in reverse order so offsets remain stable. If any edit needs
 * fuzzy matching, only touched lines are rewritten from normalized content.
 */
function applyEditsToNormalizedContent(normalizedContent, edits, path) {
  const normalizedEdits = edits.map((edit) => ({
    oldText: normalizeToLF(edit.oldText),
    newText: normalizeToLF(edit.newText),
  }));
  for (const [i, edit] of normalizedEdits.entries())
    if (edit.oldText.length === 0) throw getEmptyOldTextError(path, i, normalizedEdits.length);
  const usedFuzzyMatch = normalizedEdits
    .map((edit) => fuzzyFindText(normalizedContent, edit.oldText))
    .some((match) => match.usedFuzzyMatch);
  const replacementBaseContent = usedFuzzyMatch
    ? normalizeForFuzzyMatch(normalizedContent)
    : normalizedContent;
  const matchedEdits = [];
  for (const [i, edit] of normalizedEdits.entries()) {
    const matchResult = fuzzyFindText(replacementBaseContent, edit.oldText);
    if (!matchResult.found)
      throw getNotFoundError(path, i, normalizedEdits.length, normalizedContent, edit.oldText);
    const occurrences = countOccurrences(replacementBaseContent, edit.oldText);
    if (occurrences > 1) throw getDuplicateError(path, i, normalizedEdits.length, occurrences);
    matchedEdits.push({
      editIndex: i,
      matchIndex: matchResult.index,
      matchLength: matchResult.matchLength,
      newText: edit.newText,
    });
  }
  matchedEdits.sort((a, b) => a.matchIndex - b.matchIndex);
  for (let i = 1; i < matchedEdits.length; i++) {
    const previous = matchedEdits.at(i - 1);
    const current = matchedEdits.at(i);
    if (!previous || !current) continue;
    if (previous.matchIndex + previous.matchLength > current.matchIndex)
      throw new Error(
        `edits[${previous.editIndex}] and edits[${current.editIndex}] overlap in ${path}. Merge them into one edit or target disjoint regions.`,
      );
  }
  const baseContent = normalizedContent;
  const newContent = usedFuzzyMatch
    ? applyReplacementsPreservingUnchangedLines(
        normalizedContent,
        replacementBaseContent,
        matchedEdits,
      )
    : applyReplacements(replacementBaseContent, matchedEdits);
  if (baseContent === newContent) throw getNoChangeError(path, normalizedEdits.length);
  return {
    baseContent,
    newContent,
  };
}
/** Generate a standard unified patch. */
function generateUnifiedPatch(path, oldContent, newContent, contextLines = 4) {
  return Diff.createTwoFilesPatch(path, path, oldContent, newContent, void 0, void 0, {
    context: contextLines,
    headerOptions: Diff.FILE_HEADERS_ONLY,
  });
}
/**
 * Generate a display-oriented diff string with line numbers and context.
 * Returns both the diff string and the first changed line number (in the new file).
 */
function generateDiffString(oldContent, newContent, contextLines = 4) {
  const hunks = Diff.structuredPatch("", "", oldContent, newContent, void 0, void 0, {
    context: contextLines,
  }).hunks;
  const oldLineCount = oldContent.split("\n").length;
  const newLineCount = newContent.split("\n").length;
  const lastNewLine = newContent === "" ? 0 : newLineCount - Number(newContent.endsWith("\n"));
  const lineNumWidth = String(Math.max(oldLineCount, newLineCount)).length;
  const ellipsis = ` ${"".padStart(lineNumWidth, " ")} ...`;
  const output = [];
  let firstChangedLine;
  for (const [hunkIndex, hunk] of hunks.entries()) {
    if (hunkIndex > 0 || hunk.newStart > 1) output.push(ellipsis);
    let oldLineNum = hunk.oldStart;
    let newLineNum = hunk.newStart;
    for (const line of hunk.lines) {
      const prefix = line[0];
      if (prefix === "\\") continue;
      if (firstChangedLine === void 0 && prefix !== " ") firstChangedLine = newLineNum;
      const lineNum = prefix === "-" ? oldLineNum : newLineNum;
      output.push(`${prefix}${String(lineNum).padStart(lineNumWidth, " ")} ${line.slice(1)}`);
      oldLineNum += prefix === "+" ? 0 : 1;
      newLineNum += prefix === "-" ? 0 : 1;
    }
    if (hunkIndex === hunks.length - 1 && hunk.newStart + hunk.newLines <= lastNewLine)
      output.push(ellipsis);
  }
  return {
    diff: output.join("\n"),
    firstChangedLine,
  };
}
function validateNoOpEditTargets(normalizedContent, noOpEdits, realEdits, path) {
  if (noOpEdits.length > 0)
    applyEditsToNormalizedContent(
      normalizedContent,
      noOpEdits.map((edit) => ({
        oldText: edit.oldText,
        newText: "",
      })),
      path,
    );
  const exactNoOpEdits = noOpEdits.filter((edit) =>
    normalizedContent.includes(normalizeToLF(edit.oldText)),
  );
  if (exactNoOpEdits.length > 0 && realEdits.length > 0)
    applyEditsToNormalizedContent(
      normalizedContent,
      [...exactNoOpEdits, ...realEdits].map((edit) => ({
        oldText: edit.oldText,
        newText: "",
      })),
      path,
    );
}
function splitNoOpEdits(normalizedContent, edits, path) {
  const noOpEdits = [];
  const realEdits = [];
  for (const edit of edits) {
    const fuzzyNoOp = normalizeForFuzzyMatch(edit.oldText) === normalizeForFuzzyMatch(edit.newText);
    if (edit.oldText === edit.newText || fuzzyNoOp) {
      applyEditsToNormalizedContent(
        normalizedContent,
        [
          {
            oldText: edit.oldText,
            newText: "",
          },
        ],
        path,
      );
      noOpEdits.push(edit);
    } else realEdits.push(edit);
  }
  return {
    noOpEdits,
    realEdits,
  };
}
/**
 * Compute the diff for one or more edit operations without applying them.
 * Used for preview rendering in the TUI before the tool executes.
 */
async function computeEditsDiff(path, edits, cwd, operations) {
  const absolutePath = resolveToCwd(path, cwd);
  try {
    try {
      if (operations) await operations.access(absolutePath);
      else await access(absolutePath, constants.R_OK);
    } catch (error) {
      return {
        error: `Could not edit file: ${path}. ${error instanceof Error && "code" in error ? `Error code: ${String(error.code)}` : String(error)}.`,
      };
    }
    const rawContentResult = operations
      ? await operations.readFile(absolutePath)
      : await readFile(absolutePath, "utf-8");
    const { text: content } = stripBom(
      typeof rawContentResult === "string" ? rawContentResult : rawContentResult.toString("utf-8"),
    );
    const normalizedContent = normalizeToLF(content);
    const { noOpEdits, realEdits } = splitNoOpEdits(normalizedContent, edits, path);
    validateNoOpEditTargets(normalizedContent, noOpEdits, realEdits, path);
    if (realEdits.length === 0)
      return {
        diff: "",
        firstChangedLine: void 0,
      };
    const { baseContent, newContent } = applyEditsToNormalizedContent(
      normalizedContent,
      realEdits,
      path,
    );
    return generateDiffString(baseContent, newContent);
  } catch (err) {
    if (err instanceof EditNoChangeError)
      return {
        diff: "",
        firstChangedLine: void 0,
      };
    return { error: err instanceof Error ? err.message : String(err) };
  }
}
//#endregion
//#region src/agents/sessions/tools/file-mutation-queue.ts
/**
 * Per-file mutation queue.
 *
 * Serializes edits/writes targeting the same real file while allowing independent files to mutate in parallel.
 */
const fileMutationQueue = new KeyedAsyncQueue();
function getMutationQueueKey(filePath) {
  const resolvedPath = resolve(filePath);
  try {
    return realpathSync.native(resolvedPath);
  } catch {
    return resolvedPath;
  }
}
/**
 * Serialize file mutation operations targeting the same file.
 * Operations for different files still run in parallel.
 */
async function withFileMutationQueue(filePath, fn) {
  const key = getMutationQueueKey(filePath);
  return await fileMutationQueue.enqueue(key, fn);
}
//#endregion
//#region src/agents/sessions/tools/edit.ts
/**
 * Built-in edit session tool.
 *
 * Applies exact targeted replacements with queued file mutation, diff previews, and TUI renderers.
 */
const replaceEditSchema = Type.Object(
  {
    oldText: Type.String({
      description: "Exact original text; unique and non-overlapping in this call.",
    }),
    newText: Type.String({ description: "Replacement text." }),
  },
  { additionalProperties: false },
);
const editSchema = Type.Object(
  {
    path: Type.String({ description: "File path; relative/absolute." }),
    edits: Type.Array(replaceEditSchema, {
      description:
        "Targeted replacements against original file; no overlap/nesting. Merge nearby changes.",
    }),
  },
  { additionalProperties: false },
);
const EDIT_MISMATCH_MESSAGE = "Could not find the exact text in";
const EDIT_MISMATCH_HINT_LIMIT = 800;
const defaultEditOperations = {
  readFile: (path) => readFile(path),
  writeFile: (path, content) => writeFile(path, content, "utf-8"),
  access: (path) => access(path, constants.R_OK | constants.W_OK),
};
function prepareEditArguments(input) {
  if (!input || typeof input !== "object") return input;
  const args = { ...input };
  if (typeof args.edits === "string")
    try {
      const parsed = JSON.parse(args.edits);
      if (Array.isArray(parsed)) args.edits = parsed;
    } catch {}
  const legacy = args;
  if (typeof legacy.oldText === "string" && typeof legacy.newText === "string") {
    const edits = Array.isArray(legacy.edits) ? [...legacy.edits] : [];
    edits.push({
      oldText: legacy.oldText,
      newText: legacy.newText,
    });
    args.edits = edits;
  }
  const edits = Array.isArray(args.edits)
    ? args.edits.map((edit) => {
        if (!edit || typeof edit !== "object" || Array.isArray(edit)) return edit;
        const candidate = edit;
        return {
          oldText: candidate.oldText,
          newText: candidate.newText,
        };
      })
    : args.edits;
  return {
    path: args.path,
    edits,
  };
}
function validateEditInput(input) {
  if (!Array.isArray(input.edits) || input.edits.length === 0)
    throw new Error("Edit tool input is invalid. edits must contain at least one replacement.");
  return {
    path: input.path,
    edits: input.edits,
  };
}
function removeExactOccurrences(content, needle) {
  return needle.length > 0 ? content.split(needle).join("") : content;
}
function didEditLikelyApply(params) {
  if (params.edits.length === 0) return false;
  const normalizedOriginal = normalizeToLF(params.originalContent);
  const normalizedCurrent = normalizeToLF(params.currentContent);
  if (normalizedOriginal === normalizedCurrent) return false;
  let withoutInsertedNewText = normalizedCurrent;
  for (const edit of params.edits) {
    const normalizedNew = normalizeToLF(edit.newText);
    if (normalizedNew.length > 0 && !normalizedCurrent.includes(normalizedNew)) return false;
    withoutInsertedNewText = removeExactOccurrences(withoutInsertedNewText, normalizedNew);
  }
  return params.edits.every(
    (edit) => !withoutInsertedNewText.includes(normalizeToLF(edit.oldText)),
  );
}
function appendMismatchHint(error, currentContent) {
  const snippet =
    currentContent.length <= EDIT_MISMATCH_HINT_LIMIT
      ? currentContent
      : `${truncateUtf16Safe(currentContent, EDIT_MISMATCH_HINT_LIMIT)}\n... (truncated)`;
  const enhanced = new Error(`${error.message}\nCurrent file contents:\n${snippet}`, {
    cause: error,
  });
  enhanced.stack = error.stack;
  return enhanced;
}
function createEditCallRenderComponent() {
  return Object.assign(new Box(1, 1, (text) => text), {
    preview: void 0,
    previewArgsKey: void 0,
    previewPending: false,
    settledError: false,
  });
}
function getEditCallRenderComponent(state, lastComponent) {
  if (lastComponent instanceof Box) {
    const component = lastComponent;
    state.callComponent = component;
    return component;
  }
  if (state.callComponent) return state.callComponent;
  const component = createEditCallRenderComponent();
  state.callComponent = component;
  return component;
}
function getRenderablePreviewInput(args) {
  if (!args) return null;
  const path =
    typeof args.path === "string"
      ? args.path
      : typeof args.file_path === "string"
        ? args.file_path
        : null;
  if (!path) return null;
  if (
    Array.isArray(args.edits) &&
    args.edits.length > 0 &&
    args.edits.every(
      (edit) => typeof edit?.oldText === "string" && typeof edit?.newText === "string",
    )
  )
    return {
      path,
      edits: args.edits,
    };
  if (typeof args.oldText === "string" && typeof args.newText === "string")
    return {
      path,
      edits: [
        {
          oldText: args.oldText,
          newText: args.newText,
        },
      ],
    };
  return null;
}
function formatEditCall(args, theme) {
  const invalidArg = invalidArgText(theme);
  const rawPath = str(args?.file_path ?? args?.path);
  const path = rawPath !== null ? shortenPath(rawPath) : null;
  const pathDisplay =
    path === null ? invalidArg : path ? theme.fg("accent", path) : theme.fg("toolOutput", "...");
  return `${theme.fg("toolTitle", theme.bold("edit"))} ${pathDisplay}`;
}
function formatEditResult(args, preview, result, theme, isError) {
  const rawPath = str(args?.file_path ?? args?.path);
  const previewDiff = preview && !("error" in preview) ? preview.diff : void 0;
  const previewError = preview && "error" in preview ? preview.error : void 0;
  if (isError) {
    const errorText = result.content
      .filter((c) => c.type === "text")
      .map((c) => c.text || "")
      .join("\n");
    if (!errorText || errorText === previewError) return;
    return theme.fg("error", errorText);
  }
  const resultDiff = result.details?.diff;
  if (resultDiff && resultDiff !== previewDiff)
    return renderDiff(resultDiff, { filePath: rawPath ?? void 0 });
}
function getEditHeaderBg(preview, settledError, theme) {
  if (preview) {
    if ("error" in preview) return (text) => theme.bg("toolErrorBg", text);
    return (text) => theme.bg("toolSuccessBg", text);
  }
  if (settledError) return (text) => theme.bg("toolErrorBg", text);
  return (text) => theme.bg("toolPendingBg", text);
}
function buildEditCallComponent(component, args, theme) {
  component.setBgFn(getEditHeaderBg(component.preview, component.settledError, theme));
  component.clear();
  component.addChild(new Text(formatEditCall(args, theme), 0, 0));
  if (!component.preview) return component;
  const body =
    "error" in component.preview
      ? theme.fg("error", component.preview.error)
      : renderDiff(component.preview.diff);
  component.addChild(new Spacer(1));
  component.addChild(new Text(body, 0, 0));
  return component;
}
function setEditPreview(component, preview, argsKey) {
  const current = component.preview;
  const changed =
    current === void 0 ||
    ("error" in current && "error" in preview
      ? current.error !== preview.error
      : "error" in current !== "error" in preview) ||
    (!("error" in current) &&
      !("error" in preview) &&
      (current.diff !== preview.diff || current.firstChangedLine !== preview.firstChangedLine));
  component.preview = preview;
  component.previewArgsKey = argsKey;
  component.previewPending = false;
  return changed;
}
function createEditToolDefinition(cwd, options) {
  const ops = options?.operations ?? defaultEditOperations;
  return {
    name: "edit",
    label: "edit",
    description:
      "Exact single-file replacements. oldText unique/non-overlapping against original. Merge nearby changes; omit large unchanged spans.",
    promptSnippet: "Exact file edits; multiple disjoint edits per call",
    promptGuidelines: [
      "oldText must match exactly",
      "Multiple disjoint locations: one call, multiple edits[]",
      "Match original file; no overlap/nesting; merge nearby",
      "oldText minimal but unique; no padding",
    ],
    parameters: editSchema,
    renderShell: "self",
    prepareArguments: prepareEditArguments,
    async execute(toolCallId, input, signal, onUpdate, ctx) {
      const { path, edits: originalEdits } = validateEditInput(input);
      const absolutePath = resolveToCwd(path, cwd);
      return withFileMutationQueue(absolutePath, async () => {
        if (signal?.aborted) throw new Error("Operation aborted");
        let realEdits = [];
        try {
          await ops.access(absolutePath);
        } catch (error) {
          const errorMessage =
            error instanceof Error && "code" in error
              ? `Error code: ${String(error.code)}`
              : String(error);
          throw new Error(`Could not edit file: ${path}. ${errorMessage}.`, { cause: error });
        }
        const rawContent = (await ops.readFile(absolutePath)).toString("utf-8");
        try {
          if (signal?.aborted) throw new Error("Operation aborted");
          const { bom, text: content } = stripBom(rawContent);
          const originalEnding = detectLineEnding(content);
          const normalizedContent = normalizeToLF(content);
          const editSets = splitNoOpEdits(normalizedContent, originalEdits, path);
          const noOpEdits = editSets.noOpEdits;
          realEdits = editSets.realEdits;
          validateNoOpEditTargets(normalizedContent, noOpEdits, realEdits, path);
          if (realEdits.length === 0)
            return {
              ...textResult(
                `No changes made to ${path}. The replacement text is identical to the original.`,
                void 0,
              ),
              terminate: true,
            };
          const { baseContent, newContent } = applyEditsToNormalizedContent(
            normalizedContent,
            realEdits,
            path,
          );
          const finalContent = bom + restoreLineEndings(newContent, originalEnding);
          await ops.writeFile(absolutePath, finalContent);
          if (signal?.aborted) throw new Error("Operation aborted");
          const diffResult = generateDiffString(baseContent, newContent);
          const patch = generateUnifiedPatch(path, baseContent, newContent);
          return {
            content: [
              {
                type: "text",
                text: `Successfully replaced ${realEdits.length} block(s) in ${path}.`,
              },
            ],
            details: {
              diff: diffResult.diff,
              patch,
              firstChangedLine: diffResult.firstChangedLine,
            },
          };
        } catch (error) {
          const normalizedError = error instanceof Error ? error : new Error(String(error));
          const currentContent = await ops
            .readFile(absolutePath)
            .then((current) => current.toString("utf-8"))
            .catch(() => rawContent);
          if (
            didEditLikelyApply({
              originalContent: rawContent,
              currentContent,
              edits: realEdits,
            })
          )
            return {
              content: [
                {
                  type: "text",
                  text: `Successfully replaced ${realEdits.length} block(s) in ${path}.`,
                },
              ],
              details: {
                diff: "",
                patch: "",
              },
            };
          if (normalizedError.message.includes(EDIT_MISMATCH_MESSAGE))
            throw appendMismatchHint(normalizedError, currentContent);
          if (normalizedError instanceof EditNoChangeError)
            return {
              ...textResult(
                `No changes made to ${path}. The replacement produced identical content.`,
                void 0,
              ),
              terminate: true,
            };
          throw normalizedError;
        }
      });
    },
    renderCall(args, theme, context) {
      const component = getEditCallRenderComponent(context.state, context.lastComponent);
      const previewInput = getRenderablePreviewInput(args);
      const argsKey = previewInput
        ? JSON.stringify({
            path: previewInput.path,
            edits: previewInput.edits,
          })
        : void 0;
      if (component.previewArgsKey !== argsKey) {
        component.preview = void 0;
        component.previewArgsKey = argsKey;
        component.previewPending = false;
        component.settledError = false;
      }
      if (context.argsComplete && previewInput && !component.preview && !component.previewPending) {
        component.previewPending = true;
        const requestKey = argsKey;
        computeEditsDiff(previewInput.path, previewInput.edits, context.cwd, ops).then(
          (preview) => {
            if (component.previewArgsKey === requestKey) {
              setEditPreview(component, preview, requestKey);
              context.invalidate();
            }
          },
        );
      }
      return buildEditCallComponent(component, args, theme);
    },
    renderResult(result, optionsLocal, theme, context) {
      const callComponent = context.state.callComponent;
      const previewInput = getRenderablePreviewInput(context.args);
      const argsKey = previewInput
        ? JSON.stringify({
            path: previewInput.path,
            edits: previewInput.edits,
          })
        : void 0;
      const typedResult = result;
      const resultDiff = !context.isError ? typedResult.details?.diff : void 0;
      let changed = false;
      if (callComponent) {
        if (typeof resultDiff === "string")
          changed =
            setEditPreview(
              callComponent,
              {
                diff: resultDiff,
                firstChangedLine: typedResult.details?.firstChangedLine,
              },
              argsKey,
            ) || changed;
        if (callComponent.settledError !== context.isError) {
          callComponent.settledError = context.isError;
          changed = true;
        }
        if (changed) buildEditCallComponent(callComponent, context.args, theme);
      }
      const output = formatEditResult(
        context.args,
        callComponent?.preview,
        typedResult,
        theme,
        context.isError,
      );
      const component = context.lastComponent ?? new Container();
      component.clear();
      if (!output) return component;
      component.addChild(new Spacer(1));
      component.addChild(new Text(output, 1, 0));
      return component;
    },
  };
}
function createEditTool(cwd, options) {
  return wrapToolDefinition(createEditToolDefinition(cwd, options));
}
//#endregion
//#region src/agents/utils/tools-manager.ts
/**
 * Tool binary manager for agent-side helper commands.
 *
 * Locates or downloads pinned helper binaries such as fd and ripgrep.
 */
const TOOLS_DIR = getBinDir();
const NETWORK_TIMEOUT_MS = 1e4;
const DOWNLOAD_TIMEOUT_MS = 12e4;
const MAX_ARCHIVE_BYTES = 100 * 1024 * 1024;
const MAX_EXTRACTED_BYTES = 500 * 1024 * 1024;
const MAX_ARCHIVE_ENTRIES = 1e3;
const ARCHIVE_EXTRACT_TIMEOUT_MS = 6e4;
const CONTENT_LENGTH_RE = /^\d+$/;
async function cancelUnreadResponseBody(response) {
  if (!response.bodyUsed) await response.body?.cancel().catch(() => void 0);
}
function isOfflineModeEnabled() {
  const value = process.env.OPENCLAW_OFFLINE;
  if (!value) return false;
  return value === "1" || value.toLowerCase() === "true" || value.toLowerCase() === "yes";
}
const TOOLS = {
  fd: {
    name: "fd",
    repo: "sharkdp/fd",
    binaryName: "fd",
    systemBinaryNames: ["fd", "fdfind"],
    tagPrefix: "v",
    getAssetName: (version, plat, architecture) => {
      if (plat === "darwin")
        return `fd-v${version}-${architecture === "arm64" ? "aarch64" : "x86_64"}-apple-darwin.tar.gz`;
      else if (plat === "linux")
        return `fd-v${version}-${architecture === "arm64" ? "aarch64" : "x86_64"}-unknown-linux-gnu.tar.gz`;
      else if (plat === "win32")
        return `fd-v${version}-${architecture === "arm64" ? "aarch64" : "x86_64"}-pc-windows-msvc.zip`;
      return null;
    },
  },
  rg: {
    name: "ripgrep",
    repo: "BurntSushi/ripgrep",
    binaryName: "rg",
    tagPrefix: "",
    getAssetName: (version, plat, architecture) => {
      if (plat === "darwin")
        return `ripgrep-${version}-${architecture === "arm64" ? "aarch64" : "x86_64"}-apple-darwin.tar.gz`;
      else if (plat === "linux") {
        if (architecture === "arm64") return `ripgrep-${version}-aarch64-unknown-linux-gnu.tar.gz`;
        return `ripgrep-${version}-x86_64-unknown-linux-musl.tar.gz`;
      } else if (plat === "win32")
        return `ripgrep-${version}-${architecture === "arm64" ? "aarch64" : "x86_64"}-pc-windows-msvc.zip`;
      return null;
    },
  },
};
function commandExists(cmd) {
  try {
    const result = spawnSync(cmd, ["--version"], {
      stdio: "pipe",
      timeout: 5e3,
    });
    return !result.error && result.status === 0;
  } catch {
    return false;
  }
}
function getToolPath(tool) {
  const config = TOOLS[tool];
  if (!config) return null;
  const localPath = join(TOOLS_DIR, config.binaryName + (platform() === "win32" ? ".exe" : ""));
  if (existsSync(localPath)) return localPath;
  const systemBinaryNames = config.systemBinaryNames ?? [config.binaryName];
  for (const systemBinaryName of systemBinaryNames)
    if (commandExists(systemBinaryName)) return systemBinaryName;
  return null;
}
async function getLatestVersion(repo) {
  const guarded = await fetchWithSsrFGuard({
    url: `https://api.github.com/repos/${repo}/releases/latest`,
    timeoutMs: NETWORK_TIMEOUT_MS,
    auditContext: "tools-manager-release-check",
    init: { headers: { "User-Agent": `${APP_NAME}-coding-agent` } },
  });
  const { response } = guarded;
  try {
    if (!response.ok) {
      await cancelUnreadResponseBody(response);
      throw new Error(`GitHub API error: ${response.status}`);
    }
    return (await response.json()).tag_name.replace(/^v/, "");
  } finally {
    await guarded.release();
  }
}
async function downloadFile(url, dest, maxBytes) {
  const guarded = await fetchWithSsrFGuard({
    url,
    timeoutMs: DOWNLOAD_TIMEOUT_MS,
    auditContext: "tools-manager-download",
  });
  const { response } = guarded;
  try {
    if (!response.ok) {
      await cancelUnreadResponseBody(response);
      throw new Error(`Failed to download: ${response.status}`);
    }
    if (!response.body) throw new Error("No response body");
    const rawContentLength = response.headers.get("content-length");
    if (rawContentLength !== null) {
      const contentLength = rawContentLength.trim();
      if (CONTENT_LENGTH_RE.test(contentLength)) {
        const declaredBytes = Number(contentLength);
        if (!Number.isSafeInteger(declaredBytes) || declaredBytes > maxBytes) {
          await cancelUnreadResponseBody(response);
          throw new Error(`Download exceeds the ${maxBytes}-byte archive limit`);
        }
      }
    }
    const fileStream = createWriteStream(dest);
    let downloadCompleted = false;
    try {
      let downloadedBytes = 0;
      const byteCap = new Transform({
        transform(chunk, _encoding, callback) {
          downloadedBytes += chunk.byteLength;
          if (downloadedBytes > maxBytes) {
            callback(
              /* @__PURE__ */ new Error(`Download exceeded the ${maxBytes}-byte archive limit`),
            );
            return;
          }
          callback(null, chunk);
        },
      });
      await pipeline(Readable.fromWeb(response.body), byteCap, fileStream);
      downloadCompleted = true;
    } finally {
      if (!downloadCompleted) rmSync(dest, { force: true });
    }
  } finally {
    await guarded.release();
  }
}
function findBinaryRecursively(rootDir, binaryFileName) {
  const stack = [rootDir];
  while (stack.length > 0) {
    const currentDir = stack.pop();
    if (!currentDir) continue;
    const entries = readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(currentDir, entry.name);
      if (entry.isFile() && entry.name === binaryFileName) return fullPath;
      if (entry.isDirectory()) stack.push(fullPath);
    }
  }
  return null;
}
async function extractArchiveSafe(archivePath, extractDir, assetName) {
  try {
    await extractArchive({
      archivePath,
      destDir: extractDir,
      timeoutMs: ARCHIVE_EXTRACT_TIMEOUT_MS,
      limits: {
        maxArchiveBytes: MAX_ARCHIVE_BYTES,
        maxExtractedBytes: MAX_EXTRACTED_BYTES,
        maxEntries: MAX_ARCHIVE_ENTRIES,
      },
    });
  } catch (err) {
    throw new Error(
      `Failed to extract ${assetName}: ${err instanceof Error ? err.message : String(err)}`,
      { cause: err },
    );
  }
}
async function downloadTool(tool) {
  const config = TOOLS[tool];
  if (!config) throw new Error(`Unknown tool: ${tool}`);
  const plat = platform();
  const architecture = arch();
  let version = await getLatestVersion(config.repo);
  if (tool === "fd" && plat === "darwin" && architecture === "x64") version = "10.3.0";
  const assetName = config.getAssetName(version, plat, architecture);
  if (!assetName) throw new Error(`Unsupported platform: ${plat}/${architecture}`);
  mkdirSync(TOOLS_DIR, { recursive: true });
  const downloadUrl = `https://github.com/${config.repo}/releases/download/${config.tagPrefix}${version}/${assetName}`;
  const archivePath = join(TOOLS_DIR, assetName);
  const binaryExt = plat === "win32" ? ".exe" : "";
  const binaryPath = join(TOOLS_DIR, config.binaryName + binaryExt);
  await downloadFile(downloadUrl, archivePath, MAX_ARCHIVE_BYTES);
  const extractDir = join(
    TOOLS_DIR,
    `extract_tmp_${config.binaryName}_${process.pid}_${randomUUID()}`,
  );
  mkdirSync(extractDir, { recursive: true });
  try {
    if (assetName.endsWith(".tar.gz") || assetName.endsWith(".zip"))
      await extractArchiveSafe(archivePath, extractDir, assetName);
    else throw new Error(`Unsupported archive format: ${assetName}`);
    const binaryFileName = config.binaryName + binaryExt;
    let extractedBinary = [
      join(join(extractDir, assetName.replace(/\.(tar\.gz|zip)$/, "")), binaryFileName),
      join(extractDir, binaryFileName),
    ].find((candidate) => existsSync(candidate));
    if (!extractedBinary)
      extractedBinary = findBinaryRecursively(extractDir, binaryFileName) ?? void 0;
    if (extractedBinary) renameSync(extractedBinary, binaryPath);
    else
      throw new Error(
        `Binary not found in archive: expected ${binaryFileName} under ${extractDir}`,
      );
    if (plat !== "win32") chmodSync(binaryPath, 493);
  } finally {
    rmSync(archivePath, { force: true });
    rmSync(extractDir, {
      recursive: true,
      force: true,
    });
  }
  return binaryPath;
}
const TERMUX_PACKAGES = {
  fd: "fd",
  rg: "ripgrep",
};
async function ensureTool(tool, silent = false) {
  const existingPath = getToolPath(tool);
  if (existingPath) return existingPath;
  const config = TOOLS[tool];
  if (!config) return;
  if (isOfflineModeEnabled()) {
    if (!silent)
      console.log(
        chalk.yellow(`${config.name} not found. Offline mode enabled, skipping download.`),
      );
    return;
  }
  if (platform() === "android") {
    const pkgName = TERMUX_PACKAGES[tool] ?? tool;
    if (!silent)
      console.log(chalk.yellow(`${config.name} not found. Install with: pkg install ${pkgName}`));
    return;
  }
  if (!silent) console.log(chalk.dim(`${config.name} not found. Downloading...`));
  try {
    const path = await downloadTool(tool);
    if (!silent) console.log(chalk.dim(`${config.name} installed to ${path}`));
    return path;
  } catch (e) {
    if (!silent)
      console.log(
        chalk.yellow(
          `Failed to download ${config.name}: ${e instanceof Error ? e.message : String(e)}`,
        ),
      );
    return;
  }
}
//#endregion
//#region src/agents/sessions/tools/find.ts
/**
 * Built-in find session tool.
 *
 * Searches files by glob through fd/local operations and returns bounded, renderable results.
 */
function isInsideGitRepository(searchPath) {
  for (let current = searchPath; ;) {
    if (existsSync(path.join(current, ".git"))) return true;
    const parent = path.dirname(current);
    if (parent === current) return false;
    current = parent;
  }
}
const findSchema = Type.Object({
  pattern: Type.String({ description: "File glob, e.g. **/*.ts." }),
  path: Type.Optional(Type.String({ description: "Search dir; default cwd." })),
  limit: Type.Optional(Type.Number({ description: "Max results; default 1000." })),
});
const DEFAULT_LIMIT$2 = 1e3;
const defaultFindOperations = {
  exists: existsSync,
  glob: () => [],
};
function formatFindCall(args, theme) {
  const pattern = str(args?.pattern);
  const rawPath = str(args?.path);
  const pathLocal = rawPath !== null ? shortenPath(rawPath || ".") : null;
  const limit = args?.limit;
  const invalidArg = invalidArgText(theme);
  let text =
    theme.fg("toolTitle", theme.bold("find")) +
    " " +
    (pattern === null ? invalidArg : theme.fg("accent", pattern || "")) +
    theme.fg("toolOutput", ` in ${pathLocal === null ? invalidArg : pathLocal}`);
  if (limit !== void 0) text += theme.fg("toolOutput", ` (limit ${limit})`);
  return text;
}
function formatFindResult(result, options, theme, showImages) {
  const resultLimit = result.details?.resultLimitReached;
  return appendSessionToolTruncationWarning(
    formatSessionToolOutput(result, options, theme, showImages, 20),
    theme,
    {
      limit: resultLimit
        ? {
            count: resultLimit,
            noun: "results",
          }
        : void 0,
      truncation: result.details?.truncation,
    },
  );
}
function buildFindResult(params) {
  const resultLimitReached = params.relativized.length >= params.effectiveLimit;
  const truncation = truncateHead(params.relativized.join("\n"), {
    maxLines: Number.MAX_SAFE_INTEGER,
  });
  let resultOutput = truncation.content;
  const details = {};
  const notices = [];
  if (resultLimitReached) {
    notices.push(params.limitNotice);
    details.resultLimitReached = params.effectiveLimit;
  }
  if (truncation.truncated) {
    notices.push(`${formatSize(DEFAULT_MAX_BYTES)} limit reached`);
    details.truncation = truncation;
  }
  if (notices.length > 0) resultOutput += `\n\n[${notices.join(". ")}]`;
  return {
    content: [
      {
        type: "text",
        text: resultOutput,
      },
    ],
    details: Object.keys(details).length > 0 ? details : void 0,
  };
}
function createFindToolDefinition(cwd, options) {
  const customOps = options?.operations;
  return {
    name: "find",
    label: "find",
    description: `Find by glob; paths relative to search dir. Respects .gitignore. Caps ${DEFAULT_LIMIT$2} results/${DEFAULT_MAX_BYTES / 1024}KB.`,
    promptSnippet: "Find files by glob pattern (respects .gitignore)",
    parameters: findSchema,
    async execute(toolCallId, { pattern, path: searchDir, limit }, signal, onUpdate, ctx) {
      return new Promise((resolve, reject) => {
        if (signal?.aborted) {
          reject(/* @__PURE__ */ new Error("Operation aborted"));
          return;
        }
        let settled = false;
        let stopChild;
        const settle = (fn) => {
          if (settled) return;
          settled = true;
          signal?.removeEventListener("abort", onAbort);
          stopChild = void 0;
          fn();
        };
        const onAbort = () => {
          stopChild?.();
          settle(() => reject(/* @__PURE__ */ new Error("Operation aborted")));
        };
        signal?.addEventListener("abort", onAbort, { once: true });
        (async () => {
          try {
            const searchPath = resolveToCwd(searchDir || ".", cwd);
            const effectiveLimit = normalizePositiveLimit(limit, DEFAULT_LIMIT$2);
            const ops = customOps ?? defaultFindOperations;
            if (customOps?.glob) {
              if (!(await ops.exists(searchPath))) {
                settle(() => reject(/* @__PURE__ */ new Error(`Path not found: ${searchPath}`)));
                return;
              }
              if (signal?.aborted) {
                settle(() => reject(/* @__PURE__ */ new Error("Operation aborted")));
                return;
              }
              const results = await ops.glob(pattern, searchPath, {
                ignore: ["**/node_modules/**", "**/.git/**"],
                limit: effectiveLimit,
              });
              if (signal?.aborted) {
                settle(() => reject(/* @__PURE__ */ new Error("Operation aborted")));
                return;
              }
              if (results.length === 0) {
                settle(() =>
                  resolve({
                    content: [
                      {
                        type: "text",
                        text: "No files found matching pattern",
                      },
                    ],
                    details: void 0,
                  }),
                );
                return;
              }
              const relativized = results.map((p) => {
                if (p.startsWith(searchPath)) return toPosixPath(p.slice(searchPath.length + 1));
                return toPosixPath(path.relative(searchPath, p));
              });
              settle(() =>
                resolve(
                  buildFindResult({
                    relativized,
                    effectiveLimit,
                    limitNotice: `${effectiveLimit} results limit reached`,
                  }),
                ),
              );
              return;
            }
            const fdPath = await ensureTool("fd", true);
            if (signal?.aborted) {
              settle(() => reject(/* @__PURE__ */ new Error("Operation aborted")));
              return;
            }
            if (!fdPath) {
              settle(() =>
                reject(
                  /* @__PURE__ */ new Error("fd is not available and could not be downloaded"),
                ),
              );
              return;
            }
            const args = ["--glob", "--color=never", "--hidden"];
            if (!isInsideGitRepository(searchPath)) args.push("--no-require-git");
            args.push("--max-results", String(effectiveLimit));
            let effectivePattern = pattern;
            if (pattern.includes("/")) {
              args.push("--full-path");
              if (!pattern.startsWith("/") && !pattern.startsWith("**/") && pattern !== "**")
                effectivePattern = `**/${pattern}`;
            }
            args.push("--", effectivePattern, searchPath);
            const child = spawnCommand([fdPath, ...args], {
              buffer: false,
              reject: false,
              stdio: ["ignore", "pipe", "pipe"],
            });
            releaseChildProcessOutputAfterExit(child);
            const rl = createInterface({ input: child.stdout });
            let stderr = "";
            const lines = [];
            stopChild = () => {
              if (!child.killed) child.kill();
            };
            const cleanup = () => {
              rl.close();
            };
            const onStreamError = (stream, error) => {
              if (settled) return;
              stopChild?.();
              cleanup();
              settle(() =>
                reject(/* @__PURE__ */ new Error(`fd ${stream} error: ${error.message}`)),
              );
            };
            child.stderr?.on("data", (chunk) => {
              stderr = appendBoundedTextTail(stderr, chunk);
            });
            rl.on("error", (error) => onStreamError("stdout", error));
            child.stdout?.on("error", (error) => onStreamError("stdout", error));
            child.stderr?.on("error", (error) => onStreamError("stderr", error));
            rl.on("line", (line) => {
              lines.push(line);
            });
            child.on("error", (error) => {
              cleanup();
              settle(() => reject(/* @__PURE__ */ new Error(`Failed to run fd: ${error.message}`)));
            });
            child.on("close", (code) => {
              cleanup();
              if (signal?.aborted) {
                settle(() => reject(/* @__PURE__ */ new Error("Operation aborted")));
                return;
              }
              const output = lines.join("\n");
              if (code !== 0) {
                const errorMsg = stderr.trim() || `fd exited with code ${code}`;
                settle(() => reject(new Error(errorMsg)));
                return;
              }
              if (!output) {
                settle(() =>
                  resolve({
                    content: [
                      {
                        type: "text",
                        text: "No files found matching pattern",
                      },
                    ],
                    details: void 0,
                  }),
                );
                return;
              }
              const relativized = [];
              for (const rawLine of lines) {
                const line = rawLine.replace(/\r$/, "").trim();
                if (!line) continue;
                const hadTrailingSlash = line.endsWith("/") || line.endsWith("\\");
                let relativePath;
                if (line.startsWith(searchPath)) relativePath = line.slice(searchPath.length + 1);
                else relativePath = path.relative(searchPath, line);
                if (hadTrailingSlash && !relativePath.endsWith("/")) relativePath += "/";
                relativized.push(toPosixPath(relativePath));
              }
              settle(() =>
                resolve(
                  buildFindResult({
                    relativized,
                    effectiveLimit,
                    limitNotice: `${effectiveLimit} results limit reached. Use limit=${effectiveLimit * 2} for more, or refine pattern`,
                  }),
                ),
              );
            });
          } catch (e) {
            if (signal?.aborted) {
              settle(() => reject(/* @__PURE__ */ new Error("Operation aborted")));
              return;
            }
            const error = e instanceof Error ? e : new Error(String(e));
            settle(() => reject(error));
          }
        })();
      });
    },
    renderCall(args, theme, context) {
      const text = context.lastComponent ?? new Text("", 0, 0);
      text.setText(formatFindCall(args, theme));
      return text;
    },
    renderResult(result, optionsLocal, theme, context) {
      const text = context.lastComponent ?? new Text("", 0, 0);
      text.setText(formatFindResult(result, optionsLocal, theme, context.showImages));
      return text;
    },
  };
}
function createFindTool(cwd, options) {
  return wrapToolDefinition(createFindToolDefinition(cwd, options));
}
//#endregion
//#region src/agents/sessions/tools/grep.ts
const grepSchema = Type.Object({
  pattern: Type.String({ description: "Regex/literal pattern." }),
  path: Type.Optional(Type.String({ description: "File/dir; default cwd." })),
  glob: Type.Optional(Type.String({ description: "File glob, e.g. *.ts." })),
  ignoreCase: Type.Optional(Type.Boolean({ description: "Ignore case; default false." })),
  literal: Type.Optional(Type.Boolean({ description: "Literal, not regex; default false." })),
  context: Type.Optional(Type.Number({ description: "Context lines each side; default 0." })),
  limit: Type.Optional(Type.Number({ description: "Max matches; default 100." })),
});
const DEFAULT_LIMIT$1 = 100;
const defaultGrepOperations = {
  isDirectory: (p) => statSync(p).isDirectory(),
  readFile: (p) => readFileSync(p, "utf-8"),
};
function formatGrepCall(args, theme) {
  const pattern = str(args?.pattern);
  const rawPath = str(args?.path);
  const pathLocal = rawPath !== null ? shortenPath(rawPath || ".") : null;
  const glob = str(args?.glob);
  const limit = args?.limit;
  const invalidArg = invalidArgText(theme);
  let text =
    theme.fg("toolTitle", theme.bold("grep")) +
    " " +
    (pattern === null ? invalidArg : theme.fg("accent", `/${pattern || ""}/`)) +
    theme.fg("toolOutput", ` in ${pathLocal === null ? invalidArg : pathLocal}`);
  if (glob) text += theme.fg("toolOutput", ` (${glob})`);
  if (limit !== void 0) text += theme.fg("toolOutput", ` limit ${limit}`);
  return text;
}
function formatGrepResult(result, options, theme, showImages) {
  const matchLimit = result.details?.matchLimitReached;
  const linesTruncated = result.details?.linesTruncated;
  return appendSessionToolTruncationWarning(
    formatSessionToolOutput(result, options, theme, showImages, 15),
    theme,
    {
      limit: matchLimit
        ? {
            count: matchLimit,
            noun: "matches",
          }
        : void 0,
      truncation: result.details?.truncation,
      additionalWarnings: linesTruncated ? ["some lines truncated"] : void 0,
    },
  );
}
function createGrepToolDefinition(cwd, options) {
  const customOps = options?.operations;
  return {
    name: "grep",
    label: "grep",
    description: `Search contents; returns path:line matches. Respects .gitignore. Caps ${DEFAULT_LIMIT$1} matches/${DEFAULT_MAX_BYTES / 1024}KB; lines cap 500 chars.`,
    promptSnippet: "Search file contents for patterns (respects .gitignore)",
    parameters: grepSchema,
    async execute(
      toolCallId,
      { pattern, path: searchDir, glob, ignoreCase, literal, context, limit },
      signal,
      onUpdate,
      ctx,
    ) {
      return new Promise((resolve, reject) => {
        let settled = false;
        let child;
        let childClosed = false;
        let rl;
        let killedDueToLimit = false;
        const cleanup = () => {
          rl?.close();
          signal?.removeEventListener("abort", onAbort);
        };
        const settle = (fn) => {
          if (settled) return false;
          settled = true;
          cleanup();
          fn();
          return true;
        };
        const stopChild = (dueToLimit = false) => {
          if (child && !childClosed && !child.killed) {
            killedDueToLimit = dueToLimit;
            child.kill();
          }
        };
        const onAbort = () => {
          if (settle(() => reject(/* @__PURE__ */ new Error("Operation aborted")))) stopChild();
        };
        signal?.addEventListener("abort", onAbort, { once: true });
        if (signal?.aborted) {
          onAbort();
          return;
        }
        (async () => {
          try {
            const rgPath = await ensureTool("rg", true);
            if (settled) return;
            if (!rgPath) {
              settle(() =>
                reject(
                  /* @__PURE__ */ new Error(
                    "ripgrep (rg) is not available and could not be downloaded",
                  ),
                ),
              );
              return;
            }
            const searchPath = resolveToCwd(searchDir || ".", cwd);
            const ops = customOps ?? defaultGrepOperations;
            let isDirectory;
            try {
              isDirectory = await ops.isDirectory(searchPath);
            } catch {
              settle(() => reject(/* @__PURE__ */ new Error(`Path not found: ${searchPath}`)));
              return;
            }
            if (settled) return;
            const contextValue = context && context > 0 ? context : 0;
            const effectiveLimit = normalizePositiveLimit(limit, DEFAULT_LIMIT$1);
            const formatPath = (filePath) => {
              if (isDirectory) {
                const relative = path.relative(searchPath, filePath);
                if (relative && !relative.startsWith("..")) return relative.replace(/\\/g, "/");
              }
              return path.basename(filePath);
            };
            const fileCache = /* @__PURE__ */ new Map();
            const getFileLines = async (filePath) => {
              let lines = fileCache.get(filePath);
              if (!lines) {
                try {
                  lines = (await ops.readFile(filePath))
                    .replace(/\r\n/g, "\n")
                    .replace(/\r/g, "\n")
                    .split("\n");
                } catch {
                  lines = [];
                }
                fileCache.set(filePath, lines);
              }
              return lines;
            };
            const args = ["--json", "--line-number", "--color=never", "--hidden"];
            if (ignoreCase) args.push("--ignore-case");
            if (literal) args.push("--fixed-strings");
            if (glob) args.push("--glob", glob);
            args.push("--", pattern, searchPath);
            if (settled) return;
            const spawnedChild = spawnCommand([rgPath, ...args], {
              buffer: false,
              reject: false,
              stdio: ["ignore", "pipe", "pipe"],
            });
            releaseChildProcessOutputAfterExit(spawnedChild);
            child = spawnedChild;
            rl = createInterface({ input: spawnedChild.stdout });
            let stderr = "";
            let matchCount = 0;
            let matchLimitReached = false;
            let linesTruncated = false;
            const outputLines = [];
            spawnedChild.stderr?.on("data", (chunk) => {
              stderr = appendBoundedTextTail(stderr, chunk);
            });
            const onStreamError = (stream, error) => {
              if (settled) return;
              if (
                settle(() =>
                  reject(/* @__PURE__ */ new Error(`ripgrep ${stream} error: ${error.message}`)),
                )
              )
                stopChild();
            };
            rl.on("error", (error) => onStreamError("stdout", error));
            spawnedChild.stdout?.on("error", (error) => onStreamError("stdout", error));
            spawnedChild.stderr?.on("error", (error) => onStreamError("stderr", error));
            const formatBlock = async (filePath, lineNumber) => {
              const relativePath = formatPath(filePath);
              const lines = await getFileLines(filePath);
              if (!lines.length) return [`${relativePath}:${lineNumber}: (unable to read file)`];
              const block = [];
              const start = contextValue > 0 ? Math.max(1, lineNumber - contextValue) : lineNumber;
              const end =
                contextValue > 0 ? Math.min(lines.length, lineNumber + contextValue) : lineNumber;
              for (let current = start; current <= end; current++) {
                const sanitized = (lines[current - 1] ?? "").replace(/\r/g, "");
                const isMatchLine = current === lineNumber;
                const { text: truncatedText, wasTruncated } = truncateLine(sanitized);
                if (wasTruncated) linesTruncated = true;
                if (isMatchLine) block.push(`${relativePath}:${current}: ${truncatedText}`);
                else block.push(`${relativePath}-${current}- ${truncatedText}`);
              }
              return block;
            };
            const matches = [];
            rl.on("line", (line) => {
              if (!line.trim() || matchCount >= effectiveLimit) return;
              let event;
              try {
                event = JSON.parse(line);
              } catch {
                return;
              }
              if (event.type === "match") {
                matchCount++;
                const filePath = event.data?.path?.text;
                const lineNumber = event.data?.line_number;
                const lineText = event.data?.lines?.text;
                if (filePath && typeof lineNumber === "number")
                  matches.push({
                    filePath,
                    lineNumber,
                    lineText,
                  });
                if (matchCount >= effectiveLimit) {
                  matchLimitReached = true;
                  stopChild(true);
                }
              }
            });
            spawnedChild.on("error", (error) => {
              childClosed = true;
              settle(() =>
                reject(/* @__PURE__ */ new Error(`Failed to run ripgrep: ${error.message}`)),
              );
            });
            spawnedChild.on("close", (code) => {
              childClosed = true;
              (async () => {
                if (settled) return;
                if (!killedDueToLimit && code !== 0 && code !== 1) {
                  const errorMsg = stderr.trim() || `ripgrep exited with code ${code}`;
                  settle(() => reject(new Error(errorMsg)));
                  return;
                }
                if (matchCount === 0) {
                  settle(() =>
                    resolve({
                      content: [
                        {
                          type: "text",
                          text: "No matches found",
                        },
                      ],
                      details: void 0,
                    }),
                  );
                  return;
                }
                for (const match of matches)
                  if (contextValue === 0 && match.lineText !== void 0) {
                    const relativePath = formatPath(match.filePath);
                    const { text: truncatedText, wasTruncated } = truncateLine(
                      match.lineText.replace(/\r\n/g, "\n").replace(/\r/g, "").replace(/\n$/, ""),
                    );
                    if (wasTruncated) linesTruncated = true;
                    outputLines.push(`${relativePath}:${match.lineNumber}: ${truncatedText}`);
                  } else {
                    const block = await formatBlock(match.filePath, match.lineNumber);
                    if (settled) return;
                    outputLines.push(...block);
                  }
                const truncation = truncateHead(outputLines.join("\n"), {
                  maxLines: Number.MAX_SAFE_INTEGER,
                });
                let output = truncation.content;
                const details = {};
                const notices = [];
                if (matchLimitReached) {
                  notices.push(
                    `${effectiveLimit} matches limit reached. Use limit=${effectiveLimit * 2} for more, or refine pattern`,
                  );
                  details.matchLimitReached = effectiveLimit;
                }
                if (truncation.truncated) {
                  notices.push(`${formatSize(DEFAULT_MAX_BYTES)} limit reached`);
                  details.truncation = truncation;
                }
                if (linesTruncated) {
                  notices.push(
                    `Some lines truncated to 500 chars. Use read tool to see full lines`,
                  );
                  details.linesTruncated = true;
                }
                if (notices.length > 0) output += `\n\n[${notices.join(". ")}]`;
                settle(() =>
                  resolve({
                    content: [
                      {
                        type: "text",
                        text: output,
                      },
                    ],
                    details: Object.keys(details).length > 0 ? details : void 0,
                  }),
                );
              })().catch((err) => {
                settle(() => reject(err));
              });
            });
          } catch (err) {
            if (settle(() => reject(err))) stopChild();
          }
        })();
      });
    },
    renderCall(args, theme, context) {
      const text = context.lastComponent ?? new Text("", 0, 0);
      text.setText(formatGrepCall(args, theme));
      return text;
    },
    renderResult(result, optionsLocal, theme, context) {
      const text = context.lastComponent ?? new Text("", 0, 0);
      text.setText(formatGrepResult(result, optionsLocal, theme, context.showImages));
      return text;
    },
  };
}
function createGrepTool(cwd, options) {
  return wrapToolDefinition(createGrepToolDefinition(cwd, options));
}
//#endregion
//#region src/agents/sessions/tools/ls.ts
/**
 * Built-in ls session tool.
 *
 * Lists directory entries through local or injected operations with bounded output rendering.
 */
const lsSchema = Type.Object({
  path: Type.Optional(Type.String({ description: "Directory; default cwd." })),
  limit: Type.Optional(Type.Number({ description: "Max entries; default 500." })),
});
const DEFAULT_LIMIT = 500;
const defaultLsOperations = {
  exists: existsSync,
  stat: statSync,
  readdir: readdirSync,
};
function formatLsCall(args, theme) {
  const rawPath = str(args?.path);
  const path = rawPath !== null ? shortenPath(rawPath || ".") : null;
  const limit = args?.limit;
  const invalidArg = invalidArgText(theme);
  let text = `${theme.fg("toolTitle", theme.bold("ls"))} ${path === null ? invalidArg : theme.fg("accent", path)}`;
  if (limit !== void 0) text += theme.fg("toolOutput", ` (limit ${limit})`);
  return text;
}
function formatLsResult(result, options, theme, showImages) {
  const entryLimit = result.details?.entryLimitReached;
  return appendSessionToolTruncationWarning(
    formatSessionToolOutput(result, options, theme, showImages, 20),
    theme,
    {
      limit: entryLimit
        ? {
            count: entryLimit,
            noun: "entries",
          }
        : void 0,
      truncation: result.details?.truncation,
    },
  );
}
function createLsToolDefinition(cwd, options) {
  const ops = options?.operations ?? defaultLsOperations;
  return {
    name: "ls",
    label: "ls",
    description: `List dir alphabetically; / marks dirs; includes dotfiles. Caps ${DEFAULT_LIMIT} entries/${DEFAULT_MAX_BYTES / 1024}KB.`,
    promptSnippet: "List directory contents",
    parameters: lsSchema,
    async execute(toolCallId, { path: path$2, limit }, signal, onUpdate, ctx) {
      if (signal?.aborted) throw new Error("Operation aborted");
      const runListing = async () => {
        try {
          const dirPath = resolveToCwd(path$2 || ".", cwd);
          const effectiveLimit = normalizePositiveLimit(limit, DEFAULT_LIMIT);
          if (!(await ops.exists(dirPath))) throw new Error(`Path not found: ${dirPath}`);
          if (!(await ops.stat(dirPath)).isDirectory())
            throw new Error(`Not a directory: ${dirPath}`);
          let entries;
          try {
            entries = await ops.readdir(dirPath);
          } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            throw new Error(`Cannot read directory: ${message}`, { cause: error });
          }
          entries.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
          const results = [];
          let entryLimitReached = false;
          for (const entry of entries) {
            if (results.length >= effectiveLimit) {
              entryLimitReached = true;
              break;
            }
            const fullPath = path.join(dirPath, entry);
            let suffix = "";
            try {
              if ((await ops.stat(fullPath)).isDirectory()) suffix = "/";
            } catch {
              continue;
            }
            results.push(entry + suffix);
          }
          if (results.length === 0)
            return {
              content: [
                {
                  type: "text",
                  text: "(empty directory)",
                },
              ],
              details: void 0,
            };
          const truncation = truncateHead(results.join("\n"), {
            maxLines: Number.MAX_SAFE_INTEGER,
          });
          let output = truncation.content;
          const details = {};
          const notices = [];
          if (entryLimitReached) {
            notices.push(
              `${effectiveLimit} entries limit reached. Use limit=${effectiveLimit * 2} for more`,
            );
            details.entryLimitReached = effectiveLimit;
          }
          if (truncation.truncated) {
            notices.push(`${formatSize(DEFAULT_MAX_BYTES)} limit reached`);
            details.truncation = truncation;
          }
          if (notices.length > 0) output += `\n\n[${notices.join(". ")}]`;
          return {
            content: [
              {
                type: "text",
                text: output,
              },
            ],
            details: Object.keys(details).length > 0 ? details : void 0,
          };
        } catch (e) {
          throw toErrorObject(e, "Non-Error rejection");
        }
      };
      if (!signal) return await runListing();
      let onAbort;
      const abortPromise = new Promise((_resolve, reject) => {
        onAbort = () => reject(/* @__PURE__ */ new Error("Operation aborted"));
        signal.addEventListener("abort", onAbort, { once: true });
        if (signal.aborted) onAbort();
      });
      try {
        return await Promise.race([runListing(), abortPromise]);
      } finally {
        if (onAbort) signal.removeEventListener("abort", onAbort);
      }
    },
    renderCall(args, theme, context) {
      const text = context.lastComponent ?? new Text("", 0, 0);
      text.setText(formatLsCall(args, theme));
      return text;
    },
    renderResult(result, optionsLocal, theme, context) {
      const text = context.lastComponent ?? new Text("", 0, 0);
      text.setText(formatLsResult(result, optionsLocal, theme, context.showImages));
      return text;
    },
  };
}
function createLsTool(cwd, options) {
  return wrapToolDefinition(createLsToolDefinition(cwd, options));
}
//#endregion
//#region src/agents/utils/image-resize.ts
const INLINE_IMAGE_MIME_TYPES = /* @__PURE__ */ new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);
function baseMimeType(mimeType) {
  const normalized = mimeType?.split(";")[0]?.trim().toLowerCase();
  return normalized === "image/jpg" ? "image/jpeg" : (normalized ?? "");
}
async function normalizeImageForProvider(image) {
  const mimeType = baseMimeType(image.mimeType);
  if (INLINE_IMAGE_MIME_TYPES.has(mimeType))
    return {
      image: {
        ...image,
        mimeType,
      },
    };
  try {
    return {
      image: {
        type: "image",
        data: (await convertImageToPng(Buffer.from(image.data, "base64"))).toString("base64"),
        mimeType: "image/png",
      },
      convertedFrom: mimeType || image.mimeType,
    };
  } catch {
    return null;
  }
}
/** Normalize image formats for model input, then enforce inline size limits when enabled. */
async function processImage(image, options) {
  const normalized = await normalizeImageForProvider(image);
  if (!normalized)
    return {
      ok: false,
      message: "[Image omitted: could not be converted to a supported inline image format.]",
    };
  const hints = [];
  if (normalized.convertedFrom)
    hints.push(`[Image converted from ${normalized.convertedFrom} to image/png.]`);
  if (!options.autoResizeImages)
    return {
      ok: true,
      image: normalized.image,
      hints,
    };
  const resized = await resizeImage(normalized.image);
  if (!resized)
    return {
      ok: false,
      message: "[Image omitted: could not be resized below the inline image size limit.]",
    };
  const dimensionNote = formatDimensionNote(resized);
  if (dimensionNote) hints.push(dimensionNote);
  return {
    ok: true,
    image: {
      type: "image",
      data: resized.data,
      mimeType: resized.mimeType,
    },
    hints,
  };
}
const MAX_IMAGE_WIDTH = 2e3;
const MAX_IMAGE_HEIGHT = 2e3;
const MAX_IMAGE_BASE64_BYTES = 4.5 * 1024 * 1024;
const JPEG_QUALITY = 80;
function orientedDimensions(probe) {
  return probe.orientation && probe.orientation >= 5 && probe.orientation <= 8
    ? {
        width: probe.height,
        height: probe.width,
      }
    : {
        width: probe.width,
        height: probe.height,
      };
}
/**
 * Resize an image to fit within the inline dimensions and base64 payload limit.
 * Returns null if Rastermill cannot produce output within those limits.
 *
 * Uses Rastermill for image processing. If no Rastermill backend is available,
 * returns null.
 *
 * Strategy for staying under the inline limits:
 * 1. First resize to the maximum dimensions
 * 2. Let Rastermill choose JPEG or PNG for the image transparency profile
 * 3. If still too large, search decreasing quality/compression settings
 * 4. If still too large, progressively reduce dimensions
 */
async function resizeImage(img) {
  const inputBuffer = Buffer.from(img.data, "base64");
  const inputBase64Size = Buffer.byteLength(img.data, "utf-8");
  const processor = createImageProcessor();
  try {
    const probe = await processor.probe(inputBuffer);
    if (!probe) return null;
    const { width: originalWidth, height: originalHeight } = orientedDimensions(probe);
    if (
      originalWidth <= MAX_IMAGE_WIDTH &&
      originalHeight <= MAX_IMAGE_HEIGHT &&
      inputBase64Size <= MAX_IMAGE_BASE64_BYTES
    )
      return {
        data: img.data,
        mimeType: img.mimeType,
        originalWidth,
        originalHeight,
        width: originalWidth,
        height: originalHeight,
        wasResized: false,
      };
    const qualitySteps = [JPEG_QUALITY, 85, 70, 55, 40, 35];
    const output = await processor.encode(inputBuffer, {
      format: "auto",
      limits: {
        maxWidth: MAX_IMAGE_WIDTH,
        maxHeight: MAX_IMAGE_HEIGHT,
      },
      maxBase64Bytes: MAX_IMAGE_BASE64_BYTES,
      opaque: {
        format: "jpeg",
        quality: JPEG_QUALITY,
      },
      transparent: { format: "png" },
      search: {
        quality: qualitySteps,
        compressionLevel: [6, 9],
      },
    });
    if (output.withinBudget !== true) return null;
    return {
      data: output.data.toString("base64"),
      mimeType: output.mimeType,
      originalWidth,
      originalHeight,
      width: output.width,
      height: output.height,
      wasResized: output.resized,
    };
  } catch {
    return null;
  }
}
/**
 * Format a dimension note for resized images.
 * This helps the model understand the coordinate mapping.
 */
function formatDimensionNote(result) {
  if (!result.wasResized) return;
  const scale = result.originalWidth / result.width;
  return `[Image: original ${result.originalWidth}x${result.originalHeight}, displayed at ${result.width}x${result.height}. Multiply coordinates by ${scale.toFixed(2)} to map to original image.]`;
}
//#endregion
//#region src/agents/utils/mime.ts
/**
 * Lightweight MIME sniffing helpers for agent image inputs.
 *
 * The checks here avoid trusting file extensions and reject unsupported image
 * variants before provider upload paths try to process them.
 */
const IMAGE_TYPE_SNIFF_BYTES = 4100;
const PNG_SIGNATURE = [137, 80, 78, 71, 13, 10, 26, 10];
/** Detects supported image MIME types from leading file bytes. */
function detectSupportedImageMimeType(buffer) {
  if (startsWith(buffer, [255, 216, 255])) return buffer[3] === 247 ? null : "image/jpeg";
  if (startsWith(buffer, PNG_SIGNATURE))
    return isPng(buffer) && !isAnimatedPng(buffer) ? "image/png" : null;
  if (startsWithAscii(buffer, 0, "GIF")) return "image/gif";
  if (startsWithAscii(buffer, 0, "RIFF") && startsWithAscii(buffer, 8, "WEBP")) return "image/webp";
  if (startsWithAscii(buffer, 0, "BM") && isBmp(buffer)) return "image/bmp";
  return null;
}
/** Reads a bounded prefix from disk and detects its supported image MIME type. */
async function detectSupportedImageMimeTypeFromFile(filePath) {
  const fileHandle = await open(filePath, "r");
  try {
    const buffer = Buffer.alloc(IMAGE_TYPE_SNIFF_BYTES);
    const { bytesRead } = await fileHandle.read(buffer, 0, IMAGE_TYPE_SNIFF_BYTES, 0);
    return detectSupportedImageMimeType(buffer.subarray(0, bytesRead));
  } finally {
    await fileHandle.close();
  }
}
function isPng(buffer) {
  return (
    buffer.length >= 16 &&
    readUint32BE(buffer, PNG_SIGNATURE.length) === 13 &&
    startsWithAscii(buffer, 12, "IHDR")
  );
}
function isAnimatedPng(buffer) {
  let offset = PNG_SIGNATURE.length;
  while (offset + 8 <= buffer.length) {
    const chunkLength = readUint32BE(buffer, offset);
    const chunkTypeOffset = offset + 4;
    if (startsWithAscii(buffer, chunkTypeOffset, "acTL")) return true;
    if (startsWithAscii(buffer, chunkTypeOffset, "IDAT")) return false;
    const nextOffset = offset + 8 + chunkLength + 4;
    if (nextOffset <= offset || nextOffset > buffer.length) return false;
    offset = nextOffset;
  }
  return false;
}
function isBmp(buffer) {
  if (buffer.length < 26) return false;
  const declaredFileSize = readUint32LE(buffer, 2);
  const pixelDataOffset = readUint32LE(buffer, 10);
  const dibHeaderSize = readUint32LE(buffer, 14);
  if (declaredFileSize !== 0 && declaredFileSize < 26) return false;
  if (pixelDataOffset < 14 + dibHeaderSize) return false;
  if (declaredFileSize !== 0 && pixelDataOffset >= declaredFileSize) return false;
  let colorPlanes;
  let bitsPerPixel;
  if (dibHeaderSize === 12) {
    colorPlanes = readUint16LE(buffer, 22);
    bitsPerPixel = readUint16LE(buffer, 24);
  } else if (dibHeaderSize >= 40 && dibHeaderSize <= 124) {
    if (buffer.length < 30) return false;
    colorPlanes = readUint16LE(buffer, 26);
    bitsPerPixel = readUint16LE(buffer, 28);
  } else return false;
  return colorPlanes === 1 && [1, 4, 8, 16, 24, 32].includes(bitsPerPixel);
}
function readUint16LE(buffer, offset) {
  return (buffer[offset] ?? 0) + ((buffer[offset + 1] ?? 0) << 8);
}
function readUint32BE(buffer, offset) {
  return (
    (buffer[offset] ?? 0) * 16777216 +
    ((buffer[offset + 1] ?? 0) << 16) +
    ((buffer[offset + 2] ?? 0) << 8) +
    (buffer[offset + 3] ?? 0)
  );
}
function readUint32LE(buffer, offset) {
  return (
    (buffer[offset] ?? 0) +
    ((buffer[offset + 1] ?? 0) << 8) +
    ((buffer[offset + 2] ?? 0) << 16) +
    (buffer[offset + 3] ?? 0) * 16777216
  );
}
function startsWith(buffer, bytes) {
  if (buffer.length < bytes.length) return false;
  return bytes.every((byte, index) => buffer[index] === byte);
}
function startsWithAscii(buffer, offset, text) {
  if (buffer.length < offset + text.length) return false;
  for (let index = 0; index < text.length; index++)
    if (buffer[offset + index] !== text.charCodeAt(index)) return false;
  return true;
}
//#endregion
//#region src/agents/sessions/tools/read.ts
/**
 * Built-in read session tool.
 *
 * Reads text and image files through local or injected operations with highlighting, resizing, and bounded output.
 */
const readSchema = Type.Object({
  path: Type.String({ description: "File path; relative/absolute." }),
  offset: Type.Optional(
    Type.Integer({
      minimum: 1,
      description: "Start line; 1-based.",
    }),
  ),
  limit: Type.Optional(Type.Number({ description: "Max lines." })),
});
const COMPACT_RESOURCE_FILE_NAMES = /* @__PURE__ */ new Set([
  "AGENTS.md",
  "AGENTS.MD",
  "CLAUDE.md",
  "CLAUDE.MD",
]);
const defaultReadOperations = {
  resolvePath: resolveLocalReadPath,
  decodeText: ({ buffer }) => decodeWindowsTextFileBuffer({ buffer }),
  readFile: (path) => readFile(path),
  access: (path) => access(path, constants.R_OK),
  detectImageMimeType: detectSupportedImageMimeTypeFromFile,
};
function formatReadLineRange(args, theme) {
  if (args?.offset === void 0 && args?.limit === void 0) return "";
  const startLine = args.offset ?? 1;
  const endLine = args.limit !== void 0 ? startLine + args.limit - 1 : "";
  return theme.fg("warning", `:${startLine}${endLine ? `-${endLine}` : ""}`);
}
function formatReadCall(args, theme) {
  const rawPath = str(args?.file_path ?? args?.path);
  const path = rawPath !== null ? shortenPath(rawPath) : null;
  const invalidArg = invalidArgText(theme);
  const pathDisplay =
    path === null ? invalidArg : path ? theme.fg("accent", path) : theme.fg("toolOutput", "...");
  return `${theme.fg("toolTitle", theme.bold("read"))} ${pathDisplay}${formatReadLineRange(args, theme)}`;
}
function trimTrailingEmptyLines$1(lines) {
  let end = lines.length;
  while (end > 0 && lines[end - 1] === "") end--;
  return lines.slice(0, end);
}
function getNonVisionImageNote(model) {
  if (!model || model.input.includes("image")) return;
  return "[Current model does not support images. The image will be omitted from this request.]";
}
function quotePosixShellArg(value) {
  return `'${value.replaceAll("'", "'\\''")}'`;
}
function getOpenClawDocsClassification(absolutePath) {
  const relativePath = relative(resolve(dirname(getReadmePath())), resolve(absolutePath));
  if (
    relativePath === "" ||
    relativePath === ".." ||
    relativePath.startsWith(`..${sep}`) ||
    isAbsolute(relativePath)
  )
    return;
  const label = toPosixPath(relativePath);
  if (label === "README.md" || label.startsWith("docs/") || label.startsWith("examples/"))
    return {
      kind: "docs",
      label,
    };
}
function getCompactReadClassification(args, cwd) {
  const rawPath = str(args?.file_path ?? args?.path);
  if (!rawPath) return;
  const absolutePath = resolveReadPath(rawPath, cwd);
  const fileName = basename(absolutePath);
  if (fileName === "SKILL.md")
    return {
      kind: "skill",
      label: basename(dirname(absolutePath)) || fileName,
    };
  const docsClassification = getOpenClawDocsClassification(absolutePath);
  if (docsClassification) return docsClassification;
  if (COMPACT_RESOURCE_FILE_NAMES.has(fileName))
    return {
      kind: "resource",
      label: formatPathRelativeToCwdOrAbsolute(absolutePath, cwd),
    };
}
async function resolveLocalReadPath(filePath, cwd) {
  const normalizedMediaSource = normalizeMediaReferenceSource(filePath);
  if (classifyMediaReferenceSource(normalizedMediaSource).isMediaStoreUrl)
    return await resolveMediaReferenceLocalPath(normalizedMediaSource);
  return resolveReadPath(filePath, cwd);
}
async function resolveReadToolPath(ops, filePath, cwd) {
  return await (ops.resolvePath?.(filePath, cwd) ?? resolveReadPath(filePath, cwd));
}
function formatCompactReadCall(classification, args, theme) {
  const expandHint = theme.fg("dim", ` (${keyText("app.tools.expand")} to expand)`);
  if (classification.kind === "skill")
    return (
      theme.fg("customMessageLabel", `\u001b[1m[skill]\u001b[22m `) +
      theme.fg("customMessageText", classification.label) +
      formatReadLineRange(args, theme) +
      expandHint
    );
  return (
    theme.fg("toolTitle", theme.bold(`read ${classification.kind}`)) +
    " " +
    theme.fg("accent", classification.label) +
    formatReadLineRange(args, theme) +
    expandHint
  );
}
function formatReadResult(args, result, options, theme, showImages, cwd, isError) {
  if (!options.expanded && !isError && getCompactReadClassification(args, cwd)) return "";
  const rawPath = str(args?.file_path ?? args?.path);
  const output = getTextOutput(result, showImages);
  const lang = rawPath ? getLanguageFromPath(rawPath) : void 0;
  const lines = trimTrailingEmptyLines$1(
    lang ? highlightCode(replaceTabs$1(output), lang) : output.split("\n"),
  );
  const maxLines = options.expanded ? lines.length : 10;
  const displayLines = lines.slice(0, maxLines);
  const remaining = lines.length - maxLines;
  let text = `\n${displayLines.map((line) => (lang ? replaceTabs$1(line) : theme.fg("toolOutput", replaceTabs$1(line)))).join("\n")}`;
  if (remaining > 0)
    text += `${theme.fg("muted", `\n... (${remaining} more lines,`)} ${keyHint("app.tools.expand", "to expand")})`;
  const truncation = result.details?.truncation;
  if (truncation?.truncated)
    if (truncation.firstLineExceedsLimit)
      text += `\n${theme.fg("warning", `[First line exceeds ${formatSize(truncation.maxBytes ?? 51200)} limit]`)}`;
    else if (truncation.truncatedBy === "lines")
      text += `\n${theme.fg("warning", `[Truncated: showing ${truncation.outputLines} of ${truncation.totalLines} lines (${truncation.maxLines ?? 2e3} line limit)]`)}`;
    else
      text += `\n${theme.fg("warning", `[Truncated: ${truncation.outputLines} lines shown (${formatSize(truncation.maxBytes ?? 51200)} limit)]`)}`;
  return text;
}
function createReadToolDefinition(cwd, options) {
  const autoResizeImages = options?.autoResizeImages ?? true;
  const ops = options?.operations ?? defaultReadOperations;
  return {
    name: "read",
    label: "read",
    description: `Read text/image file (jpg/png/gif/webp/bmp); images attach. Text caps ${DEFAULT_MAX_LINES} lines or ${DEFAULT_MAX_BYTES / 1024}KB. Large/full file: continue offset/limit.`,
    promptSnippet: "Read file contents",
    promptGuidelines: ["Use read to examine files instead of cat or sed."],
    parameters: readSchema,
    async execute(toolCallId, { path, offset, limit }, signal, onUpdate, ctx) {
      if (offset !== void 0 && (!Number.isSafeInteger(offset) || offset < 1))
        throw new Error("Offset must be an integer at least 1");
      return new Promise((resolve, reject) => {
        if (signal?.aborted) {
          reject(/* @__PURE__ */ new Error("Operation aborted"));
          return;
        }
        let aborted = false;
        const onAbort = () => {
          aborted = true;
          reject(/* @__PURE__ */ new Error("Operation aborted"));
        };
        signal?.addEventListener("abort", onAbort, { once: true });
        (async () => {
          try {
            const absolutePath = await resolveReadToolPath(ops, path, cwd);
            await ops.access(absolutePath);
            if (aborted) return;
            const mimeType = ops.detectImageMimeType
              ? await ops.detectImageMimeType(absolutePath)
              : void 0;
            let content;
            let details;
            const nonVisionImageNote = getNonVisionImageNote(ctx?.model);
            if (mimeType) {
              const processed = await processImage(
                {
                  type: "image",
                  data: (await ops.readFile(absolutePath)).toString("base64"),
                  mimeType,
                },
                { autoResizeImages },
              );
              if (!processed.ok) {
                let textNote = `Read image file [${mimeType}]\n${processed.message}`;
                if (nonVisionImageNote) textNote += `\n${nonVisionImageNote}`;
                content = [
                  {
                    type: "text",
                    text: textNote,
                  },
                ];
              } else {
                let textNote = `Read image file [${processed.image.mimeType}]`;
                if (processed.hints.length > 0) textNote += `\n${processed.hints.join("\n")}`;
                if (nonVisionImageNote) textNote += `\n${nonVisionImageNote}`;
                content = [
                  {
                    type: "text",
                    text: textNote,
                  },
                  processed.image,
                ];
              }
            } else {
              const buffer = await ops.readFile(absolutePath);
              const allLines = (
                ops.decodeText?.({
                  buffer,
                  absolutePath,
                }) ?? buffer.toString("utf8")
              ).split("\n");
              const totalFileLines = allLines.length;
              const startLine = offset === void 0 ? 0 : offset - 1;
              const startLineDisplay = startLine + 1;
              if (startLine >= allLines.length)
                throw new Error(
                  `Offset ${offset} is beyond end of file (${allLines.length} lines total)`,
                );
              let selectedContent;
              let userLimitedLines;
              if (limit !== void 0) {
                const normalizedLimit = normalizePositiveLimit(limit, DEFAULT_MAX_LINES);
                const endLine = Math.min(startLine + normalizedLimit, allLines.length);
                selectedContent = allLines.slice(startLine, endLine).join("\n");
                userLimitedLines = endLine - startLine;
              } else selectedContent = allLines.slice(startLine).join("\n");
              const truncation = truncateHead(selectedContent);
              let outputText;
              if (truncation.firstLineExceedsLimit) {
                const firstLine = allLines.at(startLine);
                if (firstLine === void 0) throw new Error("Requested line is outside the file.");
                outputText = `[Line ${startLineDisplay} is ${formatSize(Buffer.byteLength(firstLine, "utf-8"))}, exceeds ${formatSize(DEFAULT_MAX_BYTES)} limit. Use bash: sed -n '${startLineDisplay}p' ${quotePosixShellArg(path)} | head -c ${DEFAULT_MAX_BYTES}]`;
                details = { truncation };
              } else if (truncation.truncated) {
                const endLineDisplay = startLineDisplay + truncation.outputLines - 1;
                const nextOffset = endLineDisplay + 1;
                outputText = truncation.content;
                if (truncation.truncatedBy === "lines")
                  outputText += `\n\n[Showing lines ${startLineDisplay}-${endLineDisplay} of ${totalFileLines}. Use offset=${nextOffset} to continue.]`;
                else
                  outputText += `\n\n[Showing lines ${startLineDisplay}-${endLineDisplay} of ${totalFileLines} (${formatSize(DEFAULT_MAX_BYTES)} limit). Use offset=${nextOffset} to continue.]`;
                details = { truncation };
              } else if (
                userLimitedLines !== void 0 &&
                startLine + userLimitedLines < allLines.length
              ) {
                const remaining = allLines.length - (startLine + userLimitedLines);
                const nextOffset = startLine + userLimitedLines + 1;
                outputText = `${truncation.content}\n\n[${remaining} more lines in file. Use offset=${nextOffset} to continue.]`;
              } else outputText = truncation.content;
              content = [
                {
                  type: "text",
                  text: outputText,
                },
              ];
            }
            if (aborted) return;
            signal?.removeEventListener("abort", onAbort);
            resolve({
              content,
              details,
            });
          } catch (error) {
            signal?.removeEventListener("abort", onAbort);
            if (!aborted) reject(toErrorObject(error, "Non-Error rejection"));
          }
        })();
      });
    },
    renderCall(args, theme, context) {
      const text = context.lastComponent ?? new Text("", 0, 0);
      const classification = !context.expanded
        ? getCompactReadClassification(args, context.cwd)
        : void 0;
      text.setText(
        classification
          ? formatCompactReadCall(classification, args, theme)
          : formatReadCall(args, theme),
      );
      return text;
    },
    renderResult(result, optionsLocal, theme, context) {
      const text = context.lastComponent ?? new Text("", 0, 0);
      text.setText(
        formatReadResult(
          context.args,
          result,
          optionsLocal,
          theme,
          context.showImages,
          context.cwd,
          context.isError,
        ),
      );
      return text;
    },
  };
}
function createReadTool(cwd, options) {
  return wrapToolDefinition(createReadToolDefinition(cwd, options));
}
//#endregion
//#region src/agents/sessions/tools/write.ts
/**
 * Built-in write session tool.
 *
 * Writes files through queued local or injected operations with readback/idempotency metadata.
 */
const writeSchema = Type.Object({
  path: Type.String({ description: "File path; relative/absolute." }),
  content: Type.String({ description: "File content." }),
});
const defaultWriteOperations = {
  writeFile: (path, content) => writeFile(path, content, "utf-8"),
  mkdir: (dir) => mkdir(dir, { recursive: true }).then(() => {}),
  readFile: (path) => readFile(path),
  statFile: async (path) => {
    try {
      const stat$1 = await stat(path);
      return {
        type: stat$1.isFile() ? "file" : stat$1.isDirectory() ? "directory" : "other",
        size: stat$1.size,
        mtimeMs: stat$1.mtimeMs,
      };
    } catch (error) {
      if (error && typeof error === "object" && "code" in error && error.code === "ENOENT")
        return null;
      throw error;
    }
  },
};
const WRITE_PRECHECK_READ_LIMIT_BYTES = 1024 * 1024;
var WriteCallRenderComponent = class extends Text {
  constructor() {
    super("", 0, 0);
  }
};
const WRITE_PARTIAL_FULL_HIGHLIGHT_LINES = 50;
function highlightSingleLine(line, lang) {
  return highlightCode(line, lang)[0] ?? "";
}
function refreshWriteHighlightPrefix(cache) {
  const prefixCount = Math.min(WRITE_PARTIAL_FULL_HIGHLIGHT_LINES, cache.normalizedLines.length);
  if (prefixCount === 0) return;
  const prefixHighlighted = highlightCode(
    cache.normalizedLines.slice(0, prefixCount).join("\n"),
    cache.lang,
  );
  for (let i = 0; i < prefixCount; i++)
    cache.highlightedLines[i] =
      prefixHighlighted[i] ?? highlightSingleLine(cache.normalizedLines[i] ?? "", cache.lang);
}
function rebuildWriteHighlightCacheFull(rawPath, fileContent) {
  const lang = rawPath ? getLanguageFromPath(rawPath) : void 0;
  if (!lang) return;
  const normalized = replaceTabs$1(normalizeDisplayText(fileContent));
  return {
    rawPath,
    lang,
    rawContent: fileContent,
    normalizedLines: normalized.split("\n"),
    highlightedLines: highlightCode(normalized, lang),
  };
}
function updateWriteHighlightCacheIncremental(cache, rawPath, fileContent) {
  const lang = rawPath ? getLanguageFromPath(rawPath) : void 0;
  if (!lang) return;
  if (!cache) return rebuildWriteHighlightCacheFull(rawPath, fileContent);
  if (cache.lang !== lang || cache.rawPath !== rawPath)
    return rebuildWriteHighlightCacheFull(rawPath, fileContent);
  if (!fileContent.startsWith(cache.rawContent))
    return rebuildWriteHighlightCacheFull(rawPath, fileContent);
  if (fileContent.length === cache.rawContent.length) return cache;
  const deltaNormalized = replaceTabs$1(
    normalizeDisplayText(fileContent.slice(cache.rawContent.length)),
  );
  cache.rawContent = fileContent;
  if (cache.normalizedLines.length === 0) {
    cache.normalizedLines.push("");
    cache.highlightedLines.push("");
  }
  const segments = deltaNormalized.split("\n");
  const lastIndex = cache.normalizedLines.length - 1;
  const firstSegment = segments.at(0);
  const currentLastLine = cache.normalizedLines.at(lastIndex);
  if (firstSegment === void 0 || currentLastLine === void 0)
    return rebuildWriteHighlightCacheFull(rawPath, fileContent);
  cache.normalizedLines[lastIndex] = currentLastLine + firstSegment;
  cache.highlightedLines[lastIndex] = highlightSingleLine(
    cache.normalizedLines[lastIndex],
    cache.lang,
  );
  for (const segment of segments.slice(1)) {
    cache.normalizedLines.push(segment);
    cache.highlightedLines.push(highlightSingleLine(segment, cache.lang));
  }
  refreshWriteHighlightPrefix(cache);
  return cache;
}
function trimTrailingEmptyLines(lines) {
  let end = lines.length;
  while (end > 0 && lines[end - 1] === "") end--;
  return lines.slice(0, end);
}
function formatWriteCall(args, options, theme, cache) {
  const rawPath = str(args?.file_path ?? args?.path);
  const fileContent = str(args?.content);
  const path = rawPath !== null ? shortenPath(rawPath) : null;
  const invalidArg = invalidArgText(theme);
  let text = `${theme.fg("toolTitle", theme.bold("write"))} ${path === null ? invalidArg : path ? theme.fg("accent", path) : theme.fg("toolOutput", "...")}`;
  if (fileContent === null)
    text += `\n\n${theme.fg("error", "[invalid content arg - expected string]")}`;
  else if (fileContent) {
    const lang = rawPath ? getLanguageFromPath(rawPath) : void 0;
    const lines = trimTrailingEmptyLines(
      lang
        ? (cache?.highlightedLines ??
            highlightCode(replaceTabs$1(normalizeDisplayText(fileContent)), lang))
        : normalizeDisplayText(fileContent).split("\n"),
    );
    const totalLines = lines.length;
    const maxLines = options.expanded ? lines.length : 10;
    const displayLines = lines.slice(0, maxLines);
    const remaining = lines.length - maxLines;
    text += `\n\n${displayLines.map((line) => (lang ? line : theme.fg("toolOutput", replaceTabs$1(line)))).join("\n")}`;
    if (remaining > 0)
      text += `${theme.fg("muted", `\n... (${remaining} more lines, ${totalLines} total,`)} ${keyHint("app.tools.expand", "to expand")})`;
  }
  return text;
}
function formatWriteResult(result, theme) {
  if (!result.isError) return;
  const output = result.content
    .filter((c) => c.type === "text")
    .map((c) => c.text || "")
    .join("\n");
  if (!output) return;
  return `\n${theme.fg("error", output)}`;
}
function isMissingFileError(error) {
  if (!error || typeof error !== "object") return false;
  if ("code" in error && error.code === "ENOENT") return true;
  return error instanceof Error && error.message.includes("No such file or directory");
}
async function readOriginalWriteState(absolutePath, content, ops) {
  if (!ops.statFile) return { state: "unknown" };
  let stat;
  try {
    stat = await ops.statFile(absolutePath);
  } catch (error) {
    return { state: isMissingFileError(error) ? "different" : "unknown" };
  }
  if (!stat)
    return {
      state: "different",
      beforeStat: stat,
    };
  if (stat.type !== "file")
    return {
      state: "unknown",
      beforeStat: stat,
    };
  if (stat.size !== Buffer.byteLength(content, "utf8"))
    return {
      state: "different",
      beforeStat: stat,
    };
  if (!ops.readFile || stat.size > WRITE_PRECHECK_READ_LIMIT_BYTES)
    return {
      state: "unknown",
      beforeStat: stat,
    };
  try {
    const originalContent = await ops.readFile(absolutePath);
    return {
      state:
        (Buffer.isBuffer(originalContent) ? originalContent.toString("utf8") : originalContent) ===
        content
          ? "same"
          : "different",
      beforeStat: stat,
    };
  } catch {
    return {
      state: "unknown",
      beforeStat: stat,
    };
  }
}
async function didWriteMetadataChange(absolutePath, beforeStat, ops) {
  if (!beforeStat || !ops.statFile) return false;
  const afterStat = await ops.statFile(absolutePath).catch(() => null);
  if (!afterStat || afterStat.type !== "file") return false;
  return afterStat.size !== beforeStat.size || afterStat.mtimeMs !== beforeStat.mtimeMs;
}
function isWriteRecoveryCandidate(error, signal) {
  if (signal?.aborted) return true;
  if (!(error instanceof Error)) return false;
  const message = error.message.toLowerCase();
  return (
    error.name === "AbortError" ||
    error.name === "TimeoutError" ||
    message.includes("timed out") ||
    message.includes("timeout")
  );
}
function successfulWriteResult(path, content) {
  return textResult(
    `Successfully wrote ${Buffer.byteLength(content, "utf8")} bytes to ${path}`,
    void 0,
  );
}
async function recoverSuccessfulWrite(params) {
  if (!params.ops.readFile || !isWriteRecoveryCandidate(params.error, params.signal)) return null;
  const readback = await params.ops.readFile(params.absolutePath).catch(() => void 0);
  const currentContent = Buffer.isBuffer(readback) ? readback.toString("utf8") : readback;
  const changed =
    params.precheck.state === "different" ||
    (params.precheck.state === "unknown" &&
      (await didWriteMetadataChange(params.absolutePath, params.precheck.beforeStat, params.ops)));
  if (currentContent !== params.content || !changed) return null;
  return successfulWriteResult(params.path, params.content);
}
function createWriteToolDefinition(cwd, options) {
  const ops = options?.operations ?? defaultWriteOperations;
  return {
    name: "write",
    label: "write",
    description: "Write/overwrite file; creates parent directories.",
    promptSnippet: "Create/overwrite files",
    promptGuidelines: ["Use only new files/complete rewrites."],
    parameters: writeSchema,
    async execute(toolCallId, { path, content }, signal, onUpdate, ctx) {
      const absolutePath = resolveToCwd(path, cwd);
      const dir = dirname(absolutePath);
      return withFileMutationQueue(absolutePath, async () => {
        const precheck = await readOriginalWriteState(absolutePath, content, ops);
        if (signal?.aborted) throw new Error("Operation aborted");
        if (precheck.state === "same")
          return {
            ...textResult(
              `No changes made to ${path}. The file already has identical content.`,
              void 0,
            ),
            terminate: true,
          };
        try {
          await ops.mkdir(dir);
          if (signal?.aborted) throw new Error("Operation aborted");
          await ops.writeFile(absolutePath, content);
          if (signal?.aborted) throw new Error("Operation aborted");
          return successfulWriteResult(path, content);
        } catch (error) {
          const recovered = await recoverSuccessfulWrite({
            absolutePath,
            content,
            error,
            ops,
            path,
            precheck,
            signal,
          });
          if (recovered) return recovered;
          throw error;
        }
      });
    },
    renderCall(args, theme, context) {
      const renderArgs = args;
      const rawPath = str(renderArgs?.file_path ?? renderArgs?.path);
      const fileContent = str(renderArgs?.content);
      const component = context.lastComponent ?? new WriteCallRenderComponent();
      if (fileContent !== null)
        component.cache = context.argsComplete
          ? rebuildWriteHighlightCacheFull(rawPath, fileContent)
          : updateWriteHighlightCacheIncremental(component.cache, rawPath, fileContent);
      else component.cache = void 0;
      component.setText(
        formatWriteCall(
          renderArgs,
          {
            expanded: context.expanded,
            isPartial: context.isPartial,
          },
          theme,
          component.cache,
        ),
      );
      return component;
    },
    renderResult(result, optionsLocal, theme, context) {
      const output = formatWriteResult(
        {
          ...result,
          isError: context.isError,
        },
        theme,
      );
      if (!output) {
        const component = context.lastComponent ?? new Container();
        component.clear();
        return component;
      }
      const text = context.lastComponent ?? new Text("", 0, 0);
      text.setText(output);
      return text;
    },
  };
}
function createWriteTool(cwd, options) {
  return wrapToolDefinition(createWriteToolDefinition(cwd, options));
}
//#endregion
//#region src/agents/sessions/tools/index.ts
const allToolNames = /* @__PURE__ */ new Set([
  "read",
  "bash",
  "edit",
  "write",
  "grep",
  "find",
  "ls",
]);
/** Creates one tool definition by stable built-in tool name. */
function createToolDefinition(toolName, cwd, options) {
  switch (toolName) {
    case "read":
      return createReadToolDefinition(cwd, options?.read);
    case "bash":
      return createBashToolDefinition(cwd, options?.bash);
    case "edit":
      return createEditToolDefinition(cwd, options?.edit);
    case "write":
      return createWriteToolDefinition(cwd, options?.write);
    case "grep":
      return createGrepToolDefinition(cwd, options?.grep);
    case "find":
      return createFindToolDefinition(cwd, options?.find);
    case "ls":
      return createLsToolDefinition(cwd, options?.ls);
    default:
      throw new Error(`Unknown tool name: ${String(toolName)}`);
  }
}
/** Creates one executable built-in tool by stable tool name. */
function createTool(toolName, cwd, options) {
  switch (toolName) {
    case "read":
      return createReadTool(cwd, options?.read);
    case "bash":
      return createBashTool(cwd, options?.bash);
    case "edit":
      return createEditTool(cwd, options?.edit);
    case "write":
      return createWriteTool(cwd, options?.write);
    case "grep":
      return createGrepTool(cwd, options?.grep);
    case "find":
      return createFindTool(cwd, options?.find);
    case "ls":
      return createLsTool(cwd, options?.ls);
    default:
      throw new Error(`Unknown tool name: ${String(toolName)}`);
  }
}
/** Creates the mutable coding tool definitions used by agent coding sessions. */
function createCodingToolDefinitions(cwd, options) {
  return [
    createReadToolDefinition(cwd, options?.read),
    createBashToolDefinition(cwd, options?.bash),
    createEditToolDefinition(cwd, options?.edit),
    createWriteToolDefinition(cwd, options?.write),
  ];
}
/** Creates read-only discovery tool definitions for restricted sessions. */
function createReadOnlyToolDefinitions(cwd, options) {
  return [
    createReadToolDefinition(cwd, options?.read),
    createGrepToolDefinition(cwd, options?.grep),
    createFindToolDefinition(cwd, options?.find),
    createLsToolDefinition(cwd, options?.ls),
  ];
}
/** Creates all built-in tool definitions keyed by tool name. */
function createAllToolDefinitions(cwd, options) {
  return {
    read: createReadToolDefinition(cwd, options?.read),
    bash: createBashToolDefinition(cwd, options?.bash),
    edit: createEditToolDefinition(cwd, options?.edit),
    write: createWriteToolDefinition(cwd, options?.write),
    grep: createGrepToolDefinition(cwd, options?.grep),
    find: createFindToolDefinition(cwd, options?.find),
    ls: createLsToolDefinition(cwd, options?.ls),
  };
}
/** Creates the mutable coding tools used by local agent sessions. */
function createCodingTools(cwd, options) {
  return [
    createReadTool(cwd, options?.read),
    createBashTool(cwd, options?.bash),
    createEditTool(cwd, options?.edit),
    createWriteTool(cwd, options?.write),
  ];
}
/** Creates read-only discovery tools for restricted sessions. */
function createReadOnlyTools(cwd, options) {
  return [
    createReadTool(cwd, options?.read),
    createGrepTool(cwd, options?.grep),
    createFindTool(cwd, options?.find),
    createLsTool(cwd, options?.ls),
  ];
}
/** Creates all built-in tools keyed by tool name. */
function createAllTools(cwd, options) {
  return {
    read: createReadTool(cwd, options?.read),
    bash: createBashTool(cwd, options?.bash),
    edit: createEditTool(cwd, options?.edit),
    write: createWriteTool(cwd, options?.write),
    grep: createGrepTool(cwd, options?.grep),
    find: createFindTool(cwd, options?.find),
    ls: createLsTool(cwd, options?.ls),
  };
}
//#endregion
//#region src/agents/sessions/extensions/types.ts
/**
 * Preserve parameter inference for standalone tool definitions.
 *
 * Use this when assigning a tool to a variable or passing it through arrays such
 * as `customTools`, where contextual typing would otherwise widen params to
 * `unknown`.
 */
function defineTool(tool) {
  return tool;
}
function isBashToolResult(e) {
  return e.toolName === "bash";
}
function isReadToolResult(e) {
  return e.toolName === "read";
}
function isEditToolResult(e) {
  return e.toolName === "edit";
}
function isWriteToolResult(e) {
  return e.toolName === "write";
}
function isGrepToolResult(e) {
  return e.toolName === "grep";
}
function isFindToolResult(e) {
  return e.toolName === "find";
}
function isLsToolResult(e) {
  return e.toolName === "ls";
}
function isToolCallEventType(toolName, event) {
  return event.toolName === toolName;
}
//#endregion
//#region src/agents/sessions/extensions/wrapper.ts
/**
 * Wrap a RegisteredTool into an AgentTool.
 * Uses the runner's createContext() for consistent context across tools and event handlers.
 */
function wrapRegisteredTool(registeredTool, runner) {
  return wrapToolDefinition(registeredTool.definition, () => runner.createContext());
}
/**
 * Wrap all registered tools into AgentTools.
 * Uses the runner's createContext() for consistent context across tools and event handlers.
 */
function wrapRegisteredTools(registeredTools, runner) {
  return wrapToolDefinitions(
    registeredTools.map((registeredTool) => registeredTool.definition),
    () => runner.createContext(),
  );
}
//#endregion
//#region src/agents/sessions/extension-sdk.ts
var extension_sdk_exports = /* @__PURE__ */ __exportAll({
  AuthStorage: () => AuthStorage,
  CURRENT_SESSION_VERSION: () => 3,
  DEFAULT_COMPACTION_SETTINGS: () => DEFAULT_COMPACTION_SETTINGS,
  DEFAULT_MAX_BYTES: () => DEFAULT_MAX_BYTES,
  DEFAULT_MAX_LINES: () => DEFAULT_MAX_LINES,
  DefaultPackageManager: () => DefaultPackageManager,
  FileAuthStorageBackend: () => FileAuthStorageBackend,
  FileSettingsStorage: () => FileSettingsStorage,
  InMemoryAuthStorageBackend: () => InMemoryAuthStorageBackend,
  InMemorySettingsStorage: () => InMemorySettingsStorage,
  ModelRegistry: () => ModelRegistry,
  SessionManager: () => SessionManager,
  SettingsManager: () => SettingsManager,
  VERSION: () => VERSION,
  allToolNames: () => allToolNames,
  buildSessionContext: () => buildSessionContext,
  calculateContextTokens: () => calculateContextTokens,
  clearApiKeyCache: () => clearApiKeyCache,
  collectEntriesForBranchSummary: () => collectEntriesForBranchSummary,
  compact: () => compact,
  convertToLlm: () => convertToLlm,
  createAllToolDefinitions: () => createAllToolDefinitions,
  createAllTools: () => createAllTools,
  createBashTool: () => createBashTool,
  createBashToolDefinition: () => createBashToolDefinition,
  createCodingToolDefinitions: () => createCodingToolDefinitions,
  createCodingTools: () => createCodingTools,
  createEditTool: () => createEditTool,
  createEditToolDefinition: () => createEditToolDefinition,
  createEventBus: () => createEventBus,
  createFindTool: () => createFindTool,
  createFindToolDefinition: () => createFindToolDefinition,
  createGrepTool: () => createGrepTool,
  createGrepToolDefinition: () => createGrepToolDefinition,
  createLocalBashOperations: () => createLocalBashOperations,
  createLsTool: () => createLsTool,
  createLsToolDefinition: () => createLsToolDefinition,
  createReadOnlyToolDefinitions: () => createReadOnlyToolDefinitions,
  createReadOnlyTools: () => createReadOnlyTools,
  createReadTool: () => createReadTool,
  createReadToolDefinition: () => createReadToolDefinition,
  createSourceInfo: () => createSourceInfo,
  createSyntheticSourceInfo: () => createSyntheticSourceInfo,
  createTool: () => createTool,
  createToolDefinition: () => createToolDefinition,
  createWriteTool: () => createWriteTool,
  createWriteToolDefinition: () => createWriteToolDefinition,
  defineTool: () => defineTool,
  estimateContextTokens: () => estimateContextTokens,
  estimateTokens: () => estimateTokens,
  executeBashWithOperations: () => executeBashWithOperations,
  findCutPoint: () => findCutPoint,
  findExactModelReferenceMatch: () => findExactModelReferenceMatch,
  findInitialModel: () => findInitialModel,
  findMostRecentSession: () => findMostRecentSession,
  findTurnStartIndex: () => findTurnStartIndex,
  formatSize: () => formatSize,
  generateBranchSummary: () => generateBranchSummary,
  generateSummary: () => generateSummary,
  getAgentDir: () => getAgentDir,
  getDefaultSessionDir: () => getDefaultSessionDir,
  getLastAssistantUsage: () => getLastAssistantUsage,
  getLatestCompactionEntry: () => getLatestCompactionEntry,
  isBashToolResult: () => isBashToolResult,
  isEditToolResult: () => isEditToolResult,
  isFindToolResult: () => isFindToolResult,
  isGrepToolResult: () => isGrepToolResult,
  isLsToolResult: () => isLsToolResult,
  isReadToolResult: () => isReadToolResult,
  isToolCallEventType: () => isToolCallEventType,
  isWriteToolResult: () => isWriteToolResult,
  loadEntriesFromFile: () => loadEntriesFromFile,
  migrateSessionEntries: () => migrateSessionEntries,
  normalizeLoadedFileEntry: () => normalizeLoadedFileEntry,
  parseModelPattern: () => parseModelPattern,
  parseSessionEntries: () => parseSessionEntries,
  prepareBranchEntries: () => prepareBranchEntries,
  prepareCompaction: () => prepareCompaction,
  resolveCliModel: () => resolveCliModel,
  resolveModelScope: () => resolveModelScope,
  restoreModelFromSession: () => restoreModelFromSession,
  serializeConversation: () => serializeConversation,
  shouldCompact: () => shouldCompact,
  truncateHead: () => truncateHead,
  truncateLine: () => truncateLine,
  truncateTail: () => truncateTail,
  withFileMutationQueue: () => withFileMutationQueue,
  wrapRegisteredTool: () => wrapRegisteredTool,
  wrapRegisteredTools: () => wrapRegisteredTools,
});
//#endregion
//#region src/agents/sessions/extensions/loader.ts
/**
 * Extension loader - loads TypeScript extension modules using jiti.
 *
 */
/** Modules available to extensions via virtualModules (for compiled Bun binary) */
const VIRTUAL_MODULES = {
  typebox: bundledTypebox,
  "typebox/compile": bundledTypeboxCompile,
  "typebox/format": bundledTypeboxFormat,
  "typebox/value": bundledTypeboxValue,
  "@sinclair/typebox": bundledTypebox,
  "@sinclair/typebox/compile": bundledTypeboxCompile,
  "@sinclair/typebox/format": bundledTypeboxFormat,
  "@sinclair/typebox/value": bundledTypeboxValue,
  "openclaw/plugin-sdk/agent-core": runtime_exports,
  "@openclaw/plugin-sdk/agent-core": runtime_exports,
  "openclaw/plugin-sdk/llm": llm_exports,
  "@openclaw/plugin-sdk/llm": llm_exports,
  "openclaw/plugin-sdk/agent-sessions": extension_sdk_exports,
  "@openclaw/plugin-sdk/agent-sessions": extension_sdk_exports,
};
const require = createRequire(import.meta.url);
let aliases = null;
let createJitiLoaderFactory;
let extensionSourceTransformLoader;
let nativeExtensionLoadCounter = 0;
const EXTENSION_LOADER_ALIAS_IMPORT_PATTERN =
  /(?:@openclaw\/plugin-sdk|openclaw\/plugin-sdk|@sinclair\/typebox|typebox)(?:\/[A-Za-z0-9_-]+)?/u;
const RELATIVE_EXTENSION_IMPORT_PATTERN =
  /(?:import\s*(?:[^'"]*?\s*from\s*)?["']\.{1,2}\/|export\s*(?:[^'"]*?\s*from\s*)["']\.{1,2}\/|import\s*\(\s*["']\.{1,2}\/|require\s*\(\s*["']\.{1,2}\/)/u;
const COMMONJS_EXTENSION_EXPORT_PATTERN = /\b(?:module\.exports|exports\.)/u;
async function loadCreateJitiLoaderFactory() {
  if (createJitiLoaderFactory) return createJitiLoaderFactory;
  const loaded = await import("jiti/static");
  if (typeof loaded.createJiti !== "function")
    throw new Error("jiti/static module did not export createJiti");
  createJitiLoaderFactory = loaded.createJiti;
  return createJitiLoaderFactory;
}
function resolveExtensionSafeAgentSessionsEntry() {
  const currentDirname = path$1.dirname(fileURLToPath(import.meta.url));
  const jsEntry = path$1.resolve(currentDirname, "..", "extension-sdk.js");
  return fs$2.existsSync(jsEntry)
    ? jsEntry
    : path$1.resolve(currentDirname, "..", "extension-sdk.ts");
}
function getExtensionLoaderAliases() {
  if (aliases) return aliases;
  const agentSessionsEntry = resolveExtensionSafeAgentSessionsEntry();
  const typeboxEntry = require.resolve("typebox");
  const typeboxCompileEntry = require.resolve("typebox/compile");
  const typeboxFormatEntry = require.resolve("typebox/format");
  const typeboxValueEntry = require.resolve("typebox/value");
  aliases = {
    ...buildPluginLoaderAliasMap(fileURLToPath(import.meta.url), process.argv[1], import.meta.url),
    "openclaw/plugin-sdk/agent-sessions": agentSessionsEntry,
    "@openclaw/plugin-sdk/agent-sessions": agentSessionsEntry,
    typebox: typeboxEntry,
    "typebox/compile": typeboxCompileEntry,
    "typebox/format": typeboxFormatEntry,
    "typebox/value": typeboxValueEntry,
    "@sinclair/typebox": typeboxEntry,
    "@sinclair/typebox/compile": typeboxCompileEntry,
    "@sinclair/typebox/format": typeboxFormatEntry,
    "@sinclair/typebox/value": typeboxValueEntry,
  };
  return aliases;
}
const UNICODE_SPACES = /[\u00A0\u2000-\u200A\u202F\u205F\u3000]/g;
function normalizeUnicodeSpaces(str) {
  return str.replace(UNICODE_SPACES, " ");
}
function expandPath(p) {
  const normalized = normalizeUnicodeSpaces(p);
  if (normalized.startsWith("~/")) return path$1.join(os$1.homedir(), normalized.slice(2));
  if (normalized.startsWith("~")) return path$1.join(os$1.homedir(), normalized.slice(1));
  return normalized;
}
function resolvePath(extPath, cwd) {
  const expanded = expandPath(extPath);
  if (path$1.isAbsolute(expanded)) return expanded;
  return path$1.resolve(cwd, expanded);
}
/**
 * Create a runtime with throwing stubs for action methods.
 * Runner.bindCore() replaces these with real implementations.
 */
function createExtensionRuntime() {
  const notInitialized = () => {
    throw new Error(
      "Extension runtime not initialized. Action methods cannot be called during extension loading.",
    );
  };
  const state = {};
  const assertActive = () => {
    if (state.staleMessage) throw new Error(state.staleMessage);
  };
  const runtime = {
    sendMessage: notInitialized,
    sendUserMessage: notInitialized,
    appendEntry: notInitialized,
    setSessionName: notInitialized,
    getSessionName: notInitialized,
    setLabel: notInitialized,
    getActiveTools: notInitialized,
    getAllTools: notInitialized,
    setActiveTools: notInitialized,
    refreshTools: () => {},
    getCommands: notInitialized,
    setModel: () => Promise.reject(/* @__PURE__ */ new Error("Extension runtime not initialized")),
    getThinkingLevel: notInitialized,
    setThinkingLevel: notInitialized,
    flagValues: /* @__PURE__ */ new Map(),
    pendingProviderRegistrations: [],
    assertActive,
    invalidate: (message) => {
      state.staleMessage ??=
        message ??
        "This extension ctx is stale after session replacement or reload. Do not use a captured api or command ctx after ctx.newSession(), ctx.fork(), ctx.switchSession(), or ctx.reload(). For newSession, fork, and switchSession, move post-replacement work into withSession and use the ctx passed to withSession. For reload, do not use the old ctx after await ctx.reload().";
    },
    registerProvider: (name, config, extensionPath = "<unknown>") => {
      runtime.pendingProviderRegistrations.push({
        name,
        config,
        extensionPath,
      });
    },
    unregisterProvider: (name) => {
      runtime.pendingProviderRegistrations = runtime.pendingProviderRegistrations.filter(
        (r) => r.name !== name,
      );
    },
  };
  return runtime;
}
/**
 * Create the ExtensionAPI for an extension.
 * Registration methods write to the extension object.
 * Action methods delegate to the shared runtime.
 */
function createExtensionAPI(extension, runtime, cwd, eventBus) {
  return {
    on(event, handler) {
      runtime.assertActive();
      const list = extension.handlers.get(event) ?? [];
      list.push(handler);
      extension.handlers.set(event, list);
    },
    registerTool(tool) {
      runtime.assertActive();
      extension.tools.set(tool.name, {
        definition: tool,
        sourceInfo: extension.sourceInfo,
      });
      runtime.refreshTools();
    },
    registerCommand(name, options) {
      runtime.assertActive();
      extension.commands.set(name, {
        name,
        sourceInfo: extension.sourceInfo,
        ...options,
      });
    },
    registerShortcut(shortcut, options) {
      runtime.assertActive();
      extension.shortcuts.set(shortcut, {
        shortcut,
        extensionPath: extension.path,
        ...options,
      });
    },
    registerFlag(name, options) {
      runtime.assertActive();
      extension.flags.set(name, {
        name,
        extensionPath: extension.path,
        ...options,
      });
      if (options.default !== void 0 && !runtime.flagValues.has(name))
        runtime.flagValues.set(name, options.default);
    },
    registerMessageRenderer(customType, renderer) {
      runtime.assertActive();
      extension.messageRenderers.set(customType, renderer);
    },
    getFlag(name) {
      runtime.assertActive();
      if (!extension.flags.has(name)) return;
      return runtime.flagValues.get(name);
    },
    sendMessage(message, options) {
      runtime.assertActive();
      runtime.sendMessage(message, options);
    },
    sendUserMessage(content, options) {
      runtime.assertActive();
      runtime.sendUserMessage(content, options);
    },
    appendEntry(customType, data) {
      runtime.assertActive();
      runtime.appendEntry(customType, data);
    },
    setSessionName(name) {
      runtime.assertActive();
      runtime.setSessionName(name);
    },
    getSessionName() {
      runtime.assertActive();
      return runtime.getSessionName();
    },
    setLabel(entryId, label) {
      runtime.assertActive();
      runtime.setLabel(entryId, label);
    },
    exec(command, args, options) {
      runtime.assertActive();
      return execCommand(command, args, options?.cwd ?? cwd, options);
    },
    getActiveTools() {
      runtime.assertActive();
      return runtime.getActiveTools();
    },
    getAllTools() {
      runtime.assertActive();
      return runtime.getAllTools();
    },
    setActiveTools(toolNames) {
      runtime.assertActive();
      runtime.setActiveTools(toolNames);
    },
    getCommands() {
      runtime.assertActive();
      return runtime.getCommands();
    },
    setModel(model) {
      runtime.assertActive();
      return runtime.setModel(model);
    },
    getThinkingLevel() {
      runtime.assertActive();
      return runtime.getThinkingLevel();
    },
    setThinkingLevel(level) {
      runtime.assertActive();
      runtime.setThinkingLevel(level);
    },
    registerProvider(name, config) {
      runtime.assertActive();
      runtime.registerProvider(name, config, extension.path);
    },
    unregisterProvider(name) {
      runtime.assertActive();
      runtime.unregisterProvider(name, extension.path);
    },
    events: eventBus,
  };
}
function resolveExtensionFactory(module) {
  const candidate =
    typeof module === "object" && module !== null && "default" in module ? module.default : module;
  if (typeof candidate === "function") return candidate;
  const nestedCandidate =
    typeof candidate === "object" && candidate !== null && "default" in candidate
      ? candidate.default
      : void 0;
  return typeof nestedCandidate === "function" ? nestedCandidate : void 0;
}
function isJavaScriptExtensionPath(extensionPath) {
  switch (path$1.extname(extensionPath).toLowerCase()) {
    case ".cjs":
    case ".mjs":
      return true;
    default:
      return false;
  }
}
function extensionSourceNeedsJitiAliasResolution(extensionPath) {
  try {
    const source = fs$2.readFileSync(extensionPath, "utf8");
    return (
      EXTENSION_LOADER_ALIAS_IMPORT_PATTERN.test(source) ||
      RELATIVE_EXTENSION_IMPORT_PATTERN.test(source) ||
      (path$1.extname(extensionPath).toLowerCase() === ".js" &&
        COMMONJS_EXTENSION_EXPORT_PATTERN.test(source))
    );
  } catch {
    return true;
  }
}
function shouldLoadExtensionWithNativeImport(extensionPath) {
  return (
    !isBunBinary &&
    isJavaScriptExtensionPath(extensionPath) &&
    !extensionSourceNeedsJitiAliasResolution(extensionPath)
  );
}
async function loadNativeExtensionModule(extensionPath) {
  const url = pathToFileURL(extensionPath);
  url.searchParams.set("v", String(++nativeExtensionLoadCounter));
  try {
    const cachedPath = require.resolve(extensionPath);
    delete require.cache[cachedPath];
  } catch {}
  return resolveExtensionFactory(await import(url.href));
}
async function loadExtensionSourceTransformModule(extensionPath) {
  if (!extensionSourceTransformLoader) {
    installOpenClawInternalCorePackageNativeResolver({ moduleUrl: import.meta.url });
    extensionSourceTransformLoader = (await loadCreateJitiLoaderFactory())(import.meta.url, {
      ...(isBunBinary
        ? {
            ...buildPluginLoaderJitiOptions({}),
            tryNative: false,
            virtualModules: VIRTUAL_MODULES,
          }
        : buildPluginLoaderJitiOptions(getExtensionLoaderAliases())),
      moduleCache: false,
    });
  }
  return resolveExtensionFactory(
    await extensionSourceTransformLoader.import(extensionPath, { default: true }),
  );
}
async function loadExtensionModule(extensionPath) {
  if (shouldLoadExtensionWithNativeImport(extensionPath))
    return loadNativeExtensionModule(extensionPath);
  return loadExtensionSourceTransformModule(extensionPath);
}
/**
 * Create an Extension object with empty collections.
 */
function createExtension(extensionPath, resolvedPath) {
  return {
    path: extensionPath,
    resolvedPath,
    sourceInfo: createSyntheticSourceInfo(extensionPath, {
      source:
        extensionPath.startsWith("<") && extensionPath.endsWith(">")
          ? extensionPath.slice(1, -1).split(":")[0] || "temporary"
          : "local",
      baseDir: extensionPath.startsWith("<") ? void 0 : path$1.dirname(resolvedPath),
    }),
    handlers: /* @__PURE__ */ new Map(),
    tools: /* @__PURE__ */ new Map(),
    messageRenderers: /* @__PURE__ */ new Map(),
    commands: /* @__PURE__ */ new Map(),
    flags: /* @__PURE__ */ new Map(),
    shortcuts: /* @__PURE__ */ new Map(),
  };
}
async function loadExtension(extensionPath, cwd, eventBus, runtime) {
  const resolvedPath = resolvePath(extensionPath, cwd);
  try {
    const factory = await loadExtensionModule(resolvedPath);
    if (!factory)
      return {
        extension: null,
        error: `Extension does not export a valid factory function: ${extensionPath}`,
      };
    const extension = createExtension(extensionPath, resolvedPath);
    await factory(createExtensionAPI(extension, runtime, cwd, eventBus));
    return {
      extension,
      error: null,
    };
  } catch (err) {
    return {
      extension: null,
      error: `Failed to load extension: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}
/**
 * Create an Extension from an inline factory function.
 */
async function loadExtensionFromFactory(
  factory,
  cwd,
  eventBus,
  runtime,
  extensionPath = "<inline>",
) {
  const extension = createExtension(extensionPath, extensionPath);
  await factory(createExtensionAPI(extension, runtime, cwd, eventBus));
  return extension;
}
/**
 * Load extensions from paths.
 */
async function loadExtensions(paths, cwd, eventBus) {
  const extensions = [];
  const errors = [];
  const resolvedEventBus = eventBus ?? createEventBus();
  const runtime = createExtensionRuntime();
  for (const extPath of paths) {
    const { extension, error } = await loadExtension(extPath, cwd, resolvedEventBus, runtime);
    if (error) {
      errors.push({
        path: extPath,
        error,
      });
      continue;
    }
    if (extension) extensions.push(extension);
  }
  return {
    extensions,
    errors,
    runtime,
  };
}
function readResourceManifest(packageJsonPath) {
  try {
    const content = fs$2.readFileSync(packageJsonPath, "utf-8");
    const pkg = JSON.parse(content);
    if (pkg.openclaw && typeof pkg.openclaw === "object") return pkg.openclaw;
    return null;
  } catch {
    return null;
  }
}
function isExtensionFile(name) {
  return name.endsWith(".ts") || name.endsWith(".js");
}
/**
 * Resolve extension entry points from a directory.
 *
 * Checks for:
 * 1. package.json with "openclaw.extensions" field -> returns declared paths
 * 2. index.ts or index.js -> returns the index file
 *
 * Returns resolved paths or null if no entry points found.
 */
function resolveExtensionEntries(dir) {
  const packageJsonPath = path$1.join(dir, "package.json");
  if (fs$2.existsSync(packageJsonPath)) {
    const manifest = readResourceManifest(packageJsonPath);
    if (manifest?.extensions?.length) {
      const entries = [];
      for (const extPath of manifest.extensions) {
        const resolvedExtPath = path$1.resolve(dir, extPath);
        if (fs$2.existsSync(resolvedExtPath)) entries.push(resolvedExtPath);
      }
      if (entries.length > 0) return entries;
    }
  }
  const indexTs = path$1.join(dir, "index.ts");
  const indexJs = path$1.join(dir, "index.js");
  if (fs$2.existsSync(indexTs)) return [indexTs];
  if (fs$2.existsSync(indexJs)) return [indexJs];
  return null;
}
/**
 * Discover extensions in a directory.
 *
 * Discovery rules:
 * 1. Direct files: `extensions/*.ts` or `*.js` → load
 * 2. Subdirectory with index: `extensions/* /index.ts` or `index.js` → load
 * 3. Subdirectory with package.json: `extensions/* /package.json` with "openclaw" field → load what it declares
 *
 * No recursion beyond one level. Complex packages must use package.json manifest.
 */
function discoverExtensionsInDir(dir) {
  if (!fs$2.existsSync(dir)) return [];
  const discovered = [];
  try {
    const entries = fs$2.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const entryPath = path$1.join(dir, entry.name);
      if ((entry.isFile() || entry.isSymbolicLink()) && isExtensionFile(entry.name)) {
        discovered.push(entryPath);
        continue;
      }
      if (entry.isDirectory() || entry.isSymbolicLink()) {
        const entriesLocal = resolveExtensionEntries(entryPath);
        if (entriesLocal) discovered.push(...entriesLocal);
      }
    }
  } catch {
    return [];
  }
  return discovered;
}
/**
 * Discover and load extensions from standard locations.
 */
async function discoverAndLoadExtensions(configuredPaths, cwd, agentDir = getAgentDir(), eventBus) {
  const allPaths = [];
  const seen = /* @__PURE__ */ new Set();
  const addPaths = (paths) => {
    for (const p of paths) {
      const resolved = path$1.resolve(p);
      if (!seen.has(resolved)) {
        seen.add(resolved);
        allPaths.push(p);
      }
    }
  };
  addPaths(discoverExtensionsInDir(path$1.join(cwd, CONFIG_DIR_NAME, "extensions")));
  addPaths(discoverExtensionsInDir(path$1.join(agentDir, "extensions")));
  for (const p of configuredPaths) {
    const resolved = resolvePath(p, cwd);
    if (fs$2.existsSync(resolved) && fs$2.statSync(resolved).isDirectory()) {
      const entries = resolveExtensionEntries(resolved);
      if (entries) {
        addPaths(entries);
        continue;
      }
      addPaths(discoverExtensionsInDir(resolved));
      continue;
    }
    addPaths([resolved]);
  }
  return loadExtensions(allPaths, cwd, eventBus);
}
//#endregion
//#region src/agents/sessions/extensions/runner.ts
const RESERVED_KEYBINDINGS_FOR_EXTENSION_CONFLICTS = [
  "app.interrupt",
  "app.clear",
  "app.exit",
  "app.suspend",
  "app.thinking.cycle",
  "app.model.cycleForward",
  "app.model.cycleBackward",
  "app.model.select",
  "app.tools.expand",
  "app.thinking.toggle",
  "app.editor.external",
  "app.message.followUp",
  "tui.input.submit",
  "tui.select.confirm",
  "tui.select.cancel",
  "tui.input.copy",
  "tui.editor.deleteToLineEnd",
];
const buildBuiltinKeybindings = (resolvedKeybindings) => {
  const builtinKeybindings = {};
  for (const [keybinding, keys] of Object.entries(resolvedKeybindings)) {
    if (keys === void 0) continue;
    const keyList = Array.isArray(keys) ? keys : [keys];
    const restrictOverride = RESERVED_KEYBINDINGS_FOR_EXTENSION_CONFLICTS.includes(keybinding);
    for (const key of keyList) {
      const normalizedKey = key.toLowerCase();
      if (builtinKeybindings[normalizedKey]?.restrictOverride && !restrictOverride) continue;
      builtinKeybindings[normalizedKey] = {
        keybinding,
        restrictOverride,
      };
    }
  }
  return builtinKeybindings;
};
/**
 * Helper function to emit session_shutdown event to extensions.
 * Returns true if the event was emitted, false if there were no handlers.
 */
async function emitSessionShutdownEvent(extensionRunner, event) {
  if (extensionRunner.hasHandlers("session_shutdown")) {
    await extensionRunner.emit(event);
    return true;
  }
  return false;
}
const noOpUIContext = {
  select: async () => void 0,
  confirm: async () => false,
  input: async () => void 0,
  notify: () => {},
  onTerminalInput: () => () => {},
  setStatus: () => {},
  setWorkingMessage: () => {},
  setWorkingVisible: () => {},
  setWorkingIndicator: () => {},
  setHiddenThinkingLabel: () => {},
  setWidget: () => {},
  setFooter: () => {},
  setHeader: () => {},
  setTitle: () => {},
  custom: async () => void 0,
  pasteToEditor: () => {},
  setEditorText: () => {},
  getEditorText: () => "",
  editor: async () => void 0,
  addAutocompleteProvider: () => {},
  setEditorComponent: () => {},
  getEditorComponent: () => void 0,
  get theme() {
    return theme;
  },
  getAllThemes: () => [],
  getTheme: () => void 0,
  setTheme: (nextTheme) => {
    return {
      success: false,
      error: "UI not available",
    };
  },
  getToolsExpanded: () => false,
  setToolsExpanded: () => {},
};
var ExtensionRunner = class {
  constructor(extensions, runtime, cwd, sessionManager, modelRegistry) {
    this.errorListeners = /* @__PURE__ */ new Set();
    this.getModel = () => void 0;
    this.isIdleFn = () => true;
    this.getSignalFn = () => void 0;
    this.waitForIdleFn = async () => {};
    this.abortFn = () => {};
    this.hasPendingMessagesFn = () => false;
    this.getContextUsageFn = () => void 0;
    this.compactFn = () => {};
    this.getSystemPromptFn = () => "";
    this.newSessionHandler = async () => ({ cancelled: false });
    this.forkHandler = async () => ({ cancelled: false });
    this.navigateTreeHandler = async () => ({ cancelled: false });
    this.switchSessionHandler = async () => ({ cancelled: false });
    this.reloadHandler = async () => {};
    this.shutdownHandler = () => {};
    this.shortcutDiagnostics = [];
    this.commandDiagnostics = [];
    this.extensions = extensions;
    this.runtime = runtime;
    this.uiContext = noOpUIContext;
    this.cwd = cwd;
    this.sessionManager = sessionManager;
    this.modelRegistry = modelRegistry;
  }
  bindCore(actions, contextActions, providerActions) {
    this.runtime.sendMessage = actions.sendMessage;
    this.runtime.sendUserMessage = actions.sendUserMessage;
    this.runtime.appendEntry = actions.appendEntry;
    this.runtime.setSessionName = actions.setSessionName;
    this.runtime.getSessionName = actions.getSessionName;
    this.runtime.setLabel = actions.setLabel;
    this.runtime.getActiveTools = actions.getActiveTools;
    this.runtime.getAllTools = actions.getAllTools;
    this.runtime.setActiveTools = actions.setActiveTools;
    this.runtime.refreshTools = actions.refreshTools;
    this.runtime.getCommands = actions.getCommands;
    this.runtime.setModel = actions.setModel;
    this.runtime.getThinkingLevel = actions.getThinkingLevel;
    this.runtime.setThinkingLevel = actions.setThinkingLevel;
    this.getModel = contextActions.getModel;
    this.isIdleFn = contextActions.isIdle;
    this.getSignalFn = contextActions.getSignal;
    this.abortFn = contextActions.abort;
    this.hasPendingMessagesFn = contextActions.hasPendingMessages;
    this.shutdownHandler = contextActions.shutdown;
    this.getContextUsageFn = contextActions.getContextUsage;
    this.compactFn = contextActions.compact;
    this.getSystemPromptFn = contextActions.getSystemPrompt;
    for (const { name, config, extensionPath } of this.runtime.pendingProviderRegistrations)
      try {
        if (providerActions?.registerProvider) providerActions.registerProvider(name, config);
        else this.modelRegistry.registerProvider(name, config);
      } catch (err) {
        this.emitError({
          extensionPath,
          event: "register_provider",
          error: err instanceof Error ? err.message : String(err),
          stack: err instanceof Error ? err.stack : void 0,
        });
      }
    this.runtime.pendingProviderRegistrations = [];
    this.runtime.registerProvider = (name, config) => {
      if (providerActions?.registerProvider) {
        providerActions.registerProvider(name, config);
        return;
      }
      this.modelRegistry.registerProvider(name, config);
    };
    this.runtime.unregisterProvider = (name) => {
      if (providerActions?.unregisterProvider) {
        providerActions.unregisterProvider(name);
        return;
      }
      this.modelRegistry.unregisterProvider(name);
    };
  }
  bindCommandContext(actions) {
    if (actions) {
      this.waitForIdleFn = actions.waitForIdle;
      this.newSessionHandler = actions.newSession;
      this.forkHandler = actions.fork;
      this.navigateTreeHandler = actions.navigateTree;
      this.switchSessionHandler = actions.switchSession;
      this.reloadHandler = actions.reload;
      return;
    }
    this.waitForIdleFn = async () => {};
    this.newSessionHandler = async () => ({ cancelled: false });
    this.forkHandler = async () => ({ cancelled: false });
    this.navigateTreeHandler = async () => ({ cancelled: false });
    this.switchSessionHandler = async () => ({ cancelled: false });
    this.reloadHandler = async () => {};
  }
  setUIContext(uiContext) {
    this.uiContext = uiContext ?? noOpUIContext;
  }
  getUIContext() {
    return this.uiContext;
  }
  hasUI() {
    return this.uiContext !== noOpUIContext;
  }
  getExtensionPaths() {
    return this.extensions.map((e) => e.path);
  }
  /** Get all registered tools from all extensions (first registration per name wins). */
  getAllRegisteredTools() {
    const toolsByName = /* @__PURE__ */ new Map();
    for (const ext of this.extensions)
      for (const tool of ext.tools.values())
        if (!toolsByName.has(tool.definition.name)) toolsByName.set(tool.definition.name, tool);
    return Array.from(toolsByName.values());
  }
  /** Get a tool definition by name. Returns undefined if not found. */
  getToolDefinition(toolName) {
    for (const ext of this.extensions) {
      const tool = ext.tools.get(toolName);
      if (tool) return tool.definition;
    }
  }
  getFlags() {
    const allFlags = /* @__PURE__ */ new Map();
    for (const ext of this.extensions)
      for (const [name, flag] of ext.flags) if (!allFlags.has(name)) allFlags.set(name, flag);
    return allFlags;
  }
  setFlagValue(name, value) {
    this.runtime.flagValues.set(name, value);
  }
  getFlagValues() {
    return new Map(this.runtime.flagValues);
  }
  getShortcuts(resolvedKeybindings) {
    this.shortcutDiagnostics = [];
    const builtinKeybindings = buildBuiltinKeybindings(resolvedKeybindings);
    const extensionShortcuts = /* @__PURE__ */ new Map();
    const addDiagnostic = (message, extensionPath) => {
      this.shortcutDiagnostics.push({
        type: "warning",
        message,
        path: extensionPath,
      });
      if (!this.hasUI()) console.warn(message);
    };
    for (const ext of this.extensions)
      for (const [key, shortcut] of ext.shortcuts) {
        const normalizedKey = key.toLowerCase();
        const builtInKeybinding = builtinKeybindings[normalizedKey];
        if (builtInKeybinding?.restrictOverride === true) {
          addDiagnostic(
            `Extension shortcut '${key}' from ${shortcut.extensionPath} conflicts with built-in shortcut. Skipping.`,
            shortcut.extensionPath,
          );
          continue;
        }
        if (builtInKeybinding?.restrictOverride === false)
          addDiagnostic(
            `Extension shortcut conflict: '${key}' is built-in shortcut for ${builtInKeybinding.keybinding} and ${shortcut.extensionPath}. Using ${shortcut.extensionPath}.`,
            shortcut.extensionPath,
          );
        const existingExtensionShortcut = extensionShortcuts.get(normalizedKey);
        if (existingExtensionShortcut)
          addDiagnostic(
            `Extension shortcut conflict: '${key}' registered by both ${existingExtensionShortcut.extensionPath} and ${shortcut.extensionPath}. Using ${shortcut.extensionPath}.`,
            shortcut.extensionPath,
          );
        extensionShortcuts.set(normalizedKey, shortcut);
      }
    return extensionShortcuts;
  }
  getShortcutDiagnostics() {
    return this.shortcutDiagnostics;
  }
  invalidate(
    message = "This extension ctx is stale after session replacement or reload. Do not use a captured api or command ctx after ctx.newSession(), ctx.fork(), ctx.switchSession(), or ctx.reload(). For newSession, fork, and switchSession, move post-replacement work into withSession and use the ctx passed to withSession. For reload, do not use the old ctx after await ctx.reload().",
  ) {
    if (!this.staleMessage) {
      this.staleMessage = message;
      this.runtime.invalidate(message);
    }
  }
  assertActive() {
    if (this.staleMessage) throw new Error(this.staleMessage);
  }
  onError(listener) {
    this.errorListeners.add(listener);
    return () => this.errorListeners.delete(listener);
  }
  emitError(error) {
    for (const listener of this.errorListeners) listener(error);
  }
  hasHandlers(eventType) {
    for (const ext of this.extensions) {
      const handlers = ext.handlers.get(eventType);
      if (handlers && handlers.length > 0) return true;
    }
    return false;
  }
  getMessageRenderer(customType) {
    for (const ext of this.extensions) {
      const renderer = ext.messageRenderers.get(customType);
      if (renderer) return renderer;
    }
  }
  resolveRegisteredCommands() {
    const commands = [];
    const counts = /* @__PURE__ */ new Map();
    for (const ext of this.extensions)
      for (const command of ext.commands.values()) {
        commands.push(command);
        counts.set(command.name, (counts.get(command.name) ?? 0) + 1);
      }
    const seen = /* @__PURE__ */ new Map();
    const takenInvocationNames = /* @__PURE__ */ new Set();
    return commands.map((command) => {
      const occurrence = (seen.get(command.name) ?? 0) + 1;
      seen.set(command.name, occurrence);
      let invocationName =
        (counts.get(command.name) ?? 0) > 1 ? `${command.name}:${occurrence}` : command.name;
      if (takenInvocationNames.has(invocationName)) {
        let suffix = occurrence;
        do {
          suffix++;
          invocationName = `${command.name}:${suffix}`;
        } while (takenInvocationNames.has(invocationName));
      }
      takenInvocationNames.add(invocationName);
      return Object.assign({}, command, { invocationName });
    });
  }
  getRegisteredCommands() {
    this.commandDiagnostics = [];
    return this.resolveRegisteredCommands();
  }
  getCommandDiagnostics() {
    return this.commandDiagnostics;
  }
  getCommand(name) {
    return this.resolveRegisteredCommands().find((command) => command.invocationName === name);
  }
  /**
   * Request a graceful shutdown. Called by extension tools and event handlers.
   * The actual shutdown behavior is provided by the mode via bindExtensions().
   */
  shutdown() {
    this.shutdownHandler();
  }
  /**
   * Create an ExtensionContext for use in event handlers and tool execution.
   * Context values are resolved at call time, so changes via bindCore/bindUI are reflected.
   */
  createContext() {
    const assertActive = () => this.assertActive();
    const getModel = this.getModel;
    const getUiContext = () => this.uiContext;
    const hasUiContext = () => this.hasUI();
    const getCwd = () => this.cwd;
    const getSessionManager = () => this.sessionManager;
    const getModelRegistry = () => this.modelRegistry;
    const isIdle = () => this.isIdleFn();
    const getSignal = () => this.getSignalFn();
    const abort = () => this.abortFn();
    const hasPendingMessages = () => this.hasPendingMessagesFn();
    const shutdown = () => this.shutdownHandler();
    const getContextUsage = () => this.getContextUsageFn();
    const compact = (options) => this.compactFn(options);
    const getSystemPrompt = () => this.getSystemPromptFn();
    return {
      get ui() {
        assertActive();
        return getUiContext();
      },
      get hasUI() {
        assertActive();
        return hasUiContext();
      },
      get cwd() {
        assertActive();
        return getCwd();
      },
      get sessionManager() {
        assertActive();
        return getSessionManager();
      },
      get modelRegistry() {
        assertActive();
        return getModelRegistry();
      },
      get model() {
        assertActive();
        return getModel();
      },
      isIdle: () => {
        assertActive();
        return isIdle();
      },
      get signal() {
        assertActive();
        return getSignal();
      },
      abort: () => {
        assertActive();
        abort();
      },
      hasPendingMessages: () => {
        assertActive();
        return hasPendingMessages();
      },
      shutdown: () => {
        assertActive();
        shutdown();
      },
      getContextUsage: () => {
        assertActive();
        return getContextUsage();
      },
      compact: (options) => {
        assertActive();
        compact(options);
      },
      getSystemPrompt: () => {
        assertActive();
        return getSystemPrompt();
      },
    };
  }
  createCommandContext() {
    const context = Object.defineProperties(
      {},
      Object.getOwnPropertyDescriptors(this.createContext()),
    );
    context.waitForIdle = () => {
      this.assertActive();
      return this.waitForIdleFn();
    };
    context.newSession = (options) => {
      this.assertActive();
      return this.newSessionHandler(options);
    };
    context.fork = (entryId, options) => {
      this.assertActive();
      return this.forkHandler(entryId, options);
    };
    context.navigateTree = (targetId, options) => {
      this.assertActive();
      return this.navigateTreeHandler(targetId, options);
    };
    context.switchSession = (sessionPath, options) => {
      this.assertActive();
      return this.switchSessionHandler(sessionPath, options);
    };
    context.reload = () => {
      this.assertActive();
      return this.reloadHandler();
    };
    return context;
  }
  isSessionBeforeEvent(event) {
    return (
      event.type === "session_before_switch" ||
      event.type === "session_before_fork" ||
      event.type === "session_before_compact" ||
      event.type === "session_before_tree"
    );
  }
  async emit(event) {
    const ctx = this.createContext();
    let result;
    for (const ext of this.extensions) {
      const handlers = ext.handlers.get(event.type);
      if (!handlers || handlers.length === 0) continue;
      for (const handler of handlers)
        try {
          const handlerResult = await handler(event, ctx);
          if (this.isSessionBeforeEvent(event) && handlerResult) {
            result = handlerResult;
            if (result.cancel) return result;
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          const stack = err instanceof Error ? err.stack : void 0;
          this.emitError({
            extensionPath: ext.path,
            event: event.type,
            error: message,
            stack,
          });
        }
    }
    return result;
  }
  async emitMessageEnd(event) {
    const ctx = this.createContext();
    let currentMessage = event.message;
    let modified = false;
    for (const ext of this.extensions) {
      const handlers = ext.handlers.get("message_end");
      if (!handlers || handlers.length === 0) continue;
      for (const handler of handlers)
        try {
          const handlerResult = await handler(
            {
              ...event,
              message: currentMessage,
            },
            ctx,
          );
          if (!handlerResult?.message) continue;
          if (handlerResult.message.role !== currentMessage.role) {
            this.emitError({
              extensionPath: ext.path,
              event: "message_end",
              error: "message_end handlers must return a message with the same role",
            });
            continue;
          }
          currentMessage = handlerResult.message;
          modified = true;
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          const stack = err instanceof Error ? err.stack : void 0;
          this.emitError({
            extensionPath: ext.path,
            event: "message_end",
            error: message,
            stack,
          });
        }
    }
    return modified ? currentMessage : void 0;
  }
  async emitToolResult(event) {
    const ctx = this.createContext();
    const currentEvent = { ...event };
    let modified = false;
    for (const ext of this.extensions) {
      const handlers = ext.handlers.get("tool_result");
      if (!handlers || handlers.length === 0) continue;
      for (const handler of handlers)
        try {
          const handlerResult = await handler(currentEvent, ctx);
          if (!handlerResult) continue;
          if (handlerResult.content !== void 0) {
            currentEvent.content = handlerResult.content;
            modified = true;
          }
          if (handlerResult.details !== void 0) {
            currentEvent.details = handlerResult.details;
            modified = true;
          }
          if (handlerResult.isError !== void 0) {
            currentEvent.isError = handlerResult.isError;
            modified = true;
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          const stack = err instanceof Error ? err.stack : void 0;
          this.emitError({
            extensionPath: ext.path,
            event: "tool_result",
            error: message,
            stack,
          });
        }
    }
    if (!modified) return;
    return {
      content: currentEvent.content,
      details: currentEvent.details,
      isError: currentEvent.isError,
    };
  }
  async emitToolCall(event) {
    const ctx = this.createContext();
    let result;
    for (const ext of this.extensions) {
      const handlers = ext.handlers.get("tool_call");
      if (!handlers || handlers.length === 0) continue;
      for (const handler of handlers) {
        const handlerResult = await handler(event, ctx);
        if (handlerResult) {
          result = handlerResult;
          if (result.block) return result;
        }
      }
    }
    return result;
  }
  async emitUserBash(event) {
    const ctx = this.createContext();
    for (const ext of this.extensions) {
      const handlers = ext.handlers.get("user_bash");
      if (!handlers || handlers.length === 0) continue;
      for (const handler of handlers)
        try {
          const handlerResult = await handler(event, ctx);
          if (handlerResult) return handlerResult;
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          const stack = err instanceof Error ? err.stack : void 0;
          this.emitError({
            extensionPath: ext.path,
            event: "user_bash",
            error: message,
            stack,
          });
        }
    }
  }
  async emitContext(messages) {
    const ctx = this.createContext();
    let currentMessages = structuredClone(messages);
    for (const ext of this.extensions) {
      const handlers = ext.handlers.get("context");
      if (!handlers || handlers.length === 0) continue;
      for (const handler of handlers)
        try {
          const handlerResult = await handler(
            {
              type: "context",
              messages: currentMessages,
            },
            ctx,
          );
          if (handlerResult && handlerResult.messages) currentMessages = handlerResult.messages;
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          const stack = err instanceof Error ? err.stack : void 0;
          this.emitError({
            extensionPath: ext.path,
            event: "context",
            error: message,
            stack,
          });
        }
    }
    return currentMessages;
  }
  async emitBeforeProviderRequest(payload) {
    const ctx = this.createContext();
    let currentPayload = payload;
    for (const ext of this.extensions) {
      const handlers = ext.handlers.get("before_provider_request");
      if (!handlers || handlers.length === 0) continue;
      for (const handler of handlers)
        try {
          const handlerResult = await handler(
            {
              type: "before_provider_request",
              payload: currentPayload,
            },
            ctx,
          );
          if (handlerResult !== void 0) currentPayload = handlerResult;
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          const stack = err instanceof Error ? err.stack : void 0;
          this.emitError({
            extensionPath: ext.path,
            event: "before_provider_request",
            error: message,
            stack,
          });
        }
    }
    return currentPayload;
  }
  async emitBeforeAgentStart(prompt, images, systemPrompt, systemPromptOptions) {
    let currentSystemPrompt = systemPrompt;
    const ctx = Object.defineProperties({}, Object.getOwnPropertyDescriptors(this.createContext()));
    ctx.getSystemPrompt = () => {
      this.assertActive();
      return currentSystemPrompt;
    };
    const messages = [];
    let systemPromptModified = false;
    for (const ext of this.extensions) {
      const handlers = ext.handlers.get("before_agent_start");
      if (!handlers || handlers.length === 0) continue;
      for (const handler of handlers)
        try {
          const handlerResult = await handler(
            {
              type: "before_agent_start",
              prompt,
              images,
              systemPrompt: currentSystemPrompt,
              systemPromptOptions,
            },
            ctx,
          );
          if (handlerResult) {
            const result = handlerResult;
            if (result.message) messages.push(result.message);
            if (result.systemPrompt !== void 0) {
              currentSystemPrompt = result.systemPrompt;
              systemPromptModified = true;
            }
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          const stack = err instanceof Error ? err.stack : void 0;
          this.emitError({
            extensionPath: ext.path,
            event: "before_agent_start",
            error: message,
            stack,
          });
        }
    }
    if (messages.length > 0 || systemPromptModified)
      return {
        messages: messages.length > 0 ? messages : void 0,
        systemPrompt: systemPromptModified ? currentSystemPrompt : void 0,
      };
  }
  async emitResourcesDiscover(cwd, reason) {
    const ctx = this.createContext();
    const skillPaths = [];
    const promptPaths = [];
    const themePaths = [];
    for (const ext of this.extensions) {
      const handlers = ext.handlers.get("resources_discover");
      if (!handlers || handlers.length === 0) continue;
      for (const handler of handlers)
        try {
          const result = await handler(
            {
              type: "resources_discover",
              cwd,
              reason,
            },
            ctx,
          );
          if (result?.skillPaths?.length)
            skillPaths.push(
              ...result.skillPaths.map((path) => ({
                path,
                extensionPath: ext.path,
              })),
            );
          if (result?.promptPaths?.length)
            promptPaths.push(
              ...result.promptPaths.map((path) => ({
                path,
                extensionPath: ext.path,
              })),
            );
          if (result?.themePaths?.length)
            themePaths.push(
              ...result.themePaths.map((path) => ({
                path,
                extensionPath: ext.path,
              })),
            );
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          const stack = err instanceof Error ? err.stack : void 0;
          this.emitError({
            extensionPath: ext.path,
            event: "resources_discover",
            error: message,
            stack,
          });
        }
    }
    return {
      skillPaths,
      promptPaths,
      themePaths,
    };
  }
  /** Emit input event. Transforms chain, "handled" short-circuits. */
  async emitInput(text, images, source) {
    const ctx = this.createContext();
    let currentText = text;
    let currentImages = images;
    for (const ext of this.extensions)
      for (const handler of ext.handlers.get("input") ?? [])
        try {
          const result = await handler(
            {
              type: "input",
              text: currentText,
              images: currentImages,
              source,
            },
            ctx,
          );
          if (result?.action === "handled") return result;
          if (result?.action === "transform") {
            currentText = result.text;
            currentImages = result.images ?? currentImages;
          }
        } catch (err) {
          this.emitError({
            extensionPath: ext.path,
            event: "input",
            error: err instanceof Error ? err.message : String(err),
            stack: err instanceof Error ? err.stack : void 0,
          });
        }
    return currentText !== text || currentImages !== images
      ? {
          action: "transform",
          text: currentText,
          images: currentImages,
        }
      : { action: "continue" };
  }
};
//#endregion
//#region src/shared/tilde-path.ts
/**
 * Expands a leading `~` against the OS home dir, keeping relative inputs
 * relative so callers can resolve them against their own base dir. Unlike
 * `resolveHomeRelativePath`, `~name` is treated as `<home>/name` (shipped
 * loader behavior for prompt/skill path lists).
 */
function expandTildePath(input) {
  const trimmed = input.trim();
  if (trimmed === "~") return homedir();
  if (trimmed.startsWith("~/")) return join(homedir(), trimmed.slice(2));
  if (trimmed.startsWith("~")) return join(homedir(), trimmed.slice(1));
  return trimmed;
}
//#endregion
//#region src/agents/sessions/prompt-templates.ts
/**
 * Prompt template discovery and loading.
 *
 * Reads markdown prompt templates from user, project, and package sources with frontmatter metadata.
 */
function loadTemplateFromFile(filePath, sourceInfo) {
  try {
    const { frontmatter, body } = parseFrontmatter(readFileSync(filePath, "utf-8"));
    const name = basename(filePath).replace(/\.md$/, "");
    let description = frontmatter.description || "";
    if (!description) {
      const firstLine = body.split("\n").find((line) => line.trim());
      if (firstLine) {
        description = truncateUtf16Safe(firstLine, 60);
        if (firstLine.length > 60) description += "...";
      }
    }
    return {
      name,
      description,
      ...(frontmatter["argument-hint"] && { argumentHint: frontmatter["argument-hint"] }),
      content: body,
      sourceInfo,
      filePath,
    };
  } catch {
    return null;
  }
}
/**
 * Scan a directory for .md files (non-recursive) and load them as prompt templates.
 */
function loadTemplatesFromDir(dir, getSourceInfo) {
  const templates = [];
  if (!existsSync(dir)) return templates;
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      let isFile = entry.isFile();
      if (entry.isSymbolicLink())
        try {
          isFile = statSync(fullPath).isFile();
        } catch {
          continue;
        }
      if (isFile && entry.name.endsWith(".md")) {
        const template = loadTemplateFromFile(fullPath, getSourceInfo(fullPath));
        if (template) templates.push(template);
      }
    }
  } catch {
    return templates;
  }
  return templates;
}
function resolvePromptPath(p, cwd) {
  const normalized = expandTildePath(p);
  return isAbsolute(normalized) ? normalized : resolve(cwd, normalized);
}
/**
 * Load all prompt templates from:
 * 1. Global: agentDir/prompts/
 * 2. Project: cwd/{CONFIG_DIR_NAME}/prompts/
 * 3. Explicit prompt paths
 */
function loadPromptTemplates(options) {
  const resolvedCwd = options.cwd;
  const resolvedAgentDir = options.agentDir;
  const promptPaths = options.promptPaths;
  const includeDefaults = options.includeDefaults;
  const templates = [];
  const globalPromptsDir = options.agentDir ? join(options.agentDir, "prompts") : resolvedAgentDir;
  const projectPromptsDir = resolve(resolvedCwd, CONFIG_DIR_NAME, "prompts");
  const isUnderPath = (target, root) => {
    const normalizedRoot = resolve(root);
    if (target === normalizedRoot) return true;
    const prefix = normalizedRoot.endsWith(sep) ? normalizedRoot : `${normalizedRoot}${sep}`;
    return target.startsWith(prefix);
  };
  const getSourceInfo = (resolvedPath) => {
    if (isUnderPath(resolvedPath, globalPromptsDir))
      return createSyntheticSourceInfo(resolvedPath, {
        source: "local",
        scope: "user",
        baseDir: globalPromptsDir,
      });
    if (isUnderPath(resolvedPath, projectPromptsDir))
      return createSyntheticSourceInfo(resolvedPath, {
        source: "local",
        scope: "project",
        baseDir: projectPromptsDir,
      });
    return createSyntheticSourceInfo(resolvedPath, {
      source: "local",
      baseDir: statSync(resolvedPath).isDirectory() ? resolvedPath : dirname(resolvedPath),
    });
  };
  if (includeDefaults) {
    templates.push(...loadTemplatesFromDir(globalPromptsDir, getSourceInfo));
    templates.push(...loadTemplatesFromDir(projectPromptsDir, getSourceInfo));
  }
  for (const rawPath of promptPaths) {
    const resolvedPath = resolvePromptPath(rawPath, resolvedCwd);
    if (!existsSync(resolvedPath)) continue;
    try {
      const stats = statSync(resolvedPath);
      if (stats.isDirectory()) templates.push(...loadTemplatesFromDir(resolvedPath, getSourceInfo));
      else if (stats.isFile() && resolvedPath.endsWith(".md")) {
        const template = loadTemplateFromFile(resolvedPath, getSourceInfo(resolvedPath));
        if (template) templates.push(template);
      }
    } catch {}
  }
  return templates;
}
/**
 * Expand a prompt template if it matches a template name.
 * Returns the expanded content or the original text if not a template.
 */
function expandPromptTemplate(text, templates) {
  if (!text.startsWith("/")) return text;
  const match = text.match(/^\/([^\s]+)(?:\s+([\s\S]*))?$/);
  if (!match) return text;
  const templateName = match[1];
  const argsString = match[2] ?? "";
  const template = templates.find((t) => t.name === templateName);
  if (template) {
    const args = parseCommandArgs(argsString);
    return substituteArgs(template.content, args);
  }
  return text;
}
//#endregion
//#region src/skills/loading/session.ts
/** Max name length per spec */
const MAX_NAME_LENGTH = 64;
/** Max description length per spec */
const MAX_DESCRIPTION_LENGTH = 1024;
/**
 * Validate skill name per Agent Skills spec.
 * Returns array of validation error messages (empty if valid).
 */
function validateName(name) {
  const errors = [];
  if (name.length > MAX_NAME_LENGTH)
    errors.push(`name exceeds ${MAX_NAME_LENGTH} characters (${name.length})`);
  if (!/^[a-z0-9-]+$/.test(name))
    errors.push(`name contains invalid characters (must be lowercase a-z, 0-9, hyphens only)`);
  if (name.startsWith("-") || name.endsWith("-"))
    errors.push(`name must not start or end with a hyphen`);
  if (name.includes("--")) errors.push(`name must not contain consecutive hyphens`);
  return errors;
}
/**
 * Validate description per Agent Skills spec.
 */
function validateDescription(description) {
  const errors = [];
  if (!description || description.trim() === "") errors.push("description is required");
  else if (description.length > MAX_DESCRIPTION_LENGTH)
    errors.push(`description exceeds ${MAX_DESCRIPTION_LENGTH} characters (${description.length})`);
  return errors;
}
function createSkillSourceInfo(filePath, baseDir, source) {
  switch (source) {
    case "user":
      return createSyntheticSourceInfo(filePath, {
        source: "local",
        scope: "user",
        baseDir,
      });
    case "project":
      return createSyntheticSourceInfo(filePath, {
        source: "local",
        scope: "project",
        baseDir,
      });
    case "path":
      return createSyntheticSourceInfo(filePath, {
        source: "local",
        baseDir,
      });
    default:
      return createSyntheticSourceInfo(filePath, {
        source,
        baseDir,
      });
  }
}
/**
 * Load skills from a directory.
 *
 * Discovery rules:
 * - if a directory contains SKILL.md, treat it as a skill root and do not recurse further
 * - otherwise, load direct .md children in the root
 * - recurse into subdirectories to find SKILL.md
 */
function loadSkillsFromDir(options) {
  const { dir, source } = options;
  return loadSkillsFromDirInternal(dir, source, true);
}
function loadSkillsFromDirInternal(dir, source, includeRootFiles, ignoreMatcher, rootDir) {
  const skills = [];
  const diagnostics = [];
  if (!existsSync(dir))
    return {
      skills,
      diagnostics,
    };
  const root = rootDir ?? dir;
  const ig = ignoreMatcher ?? ignore();
  addIgnoreRules(ig, dir, root);
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name !== "SKILL.md") continue;
      const fullPath = join(dir, entry.name);
      let isFile = entry.isFile();
      if (entry.isSymbolicLink())
        try {
          isFile = statSync(fullPath).isFile();
        } catch {
          continue;
        }
      const relPath = toPosixPath(relative(root, fullPath));
      if (!isFile || ig.ignores(relPath)) continue;
      const result = loadSkillFromFile(fullPath, source);
      if (result.skill) skills.push(result.skill);
      diagnostics.push(...result.diagnostics);
      return {
        skills,
        diagnostics,
      };
    }
    for (const entry of entries) {
      if (entry.name.startsWith(".")) continue;
      if (entry.name === "node_modules") continue;
      const fullPath = join(dir, entry.name);
      let isDirectory = entry.isDirectory();
      let isFile = entry.isFile();
      if (entry.isSymbolicLink())
        try {
          const stats = statSync(fullPath);
          isDirectory = stats.isDirectory();
          isFile = stats.isFile();
        } catch {
          continue;
        }
      const relPath = toPosixPath(relative(root, fullPath));
      const ignorePath = isDirectory ? `${relPath}/` : relPath;
      if (ig.ignores(ignorePath)) continue;
      if (isDirectory) {
        const subResult = loadSkillsFromDirInternal(fullPath, source, false, ig, root);
        skills.push(...subResult.skills);
        diagnostics.push(...subResult.diagnostics);
        continue;
      }
      if (!isFile || !includeRootFiles || !entry.name.endsWith(".md")) continue;
      const result = loadSkillFromFile(fullPath, source);
      if (result.skill) skills.push(result.skill);
      diagnostics.push(...result.diagnostics);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "failed to scan skill directory";
    diagnostics.push({
      type: "warning",
      message,
      path: dir,
    });
  }
  return {
    skills,
    diagnostics,
  };
}
function loadSkillFromFile(filePath, source) {
  const diagnostics = [];
  try {
    const rawContent = readFileSync(filePath, "utf-8");
    const { frontmatter } = parseFrontmatter(rawContent);
    const skillDir = dirname(filePath);
    const parentDirName = basename(skillDir);
    const descErrors = validateDescription(frontmatter.description);
    for (const error of descErrors)
      diagnostics.push({
        type: "warning",
        message: error,
        path: filePath,
      });
    const name = frontmatter.name || parentDirName;
    const nameErrors = validateName(name);
    for (const error of nameErrors)
      diagnostics.push({
        type: "warning",
        message: error,
        path: filePath,
      });
    if (!frontmatter.description || frontmatter.description.trim() === "")
      return {
        skill: null,
        diagnostics,
      };
    return {
      skill: {
        name,
        description: frontmatter.description,
        filePath,
        baseDir: skillDir,
        promptVersion: computeSkillPromptVersion(rawContent),
        source,
        sourceInfo: createSkillSourceInfo(filePath, skillDir, source),
        disableModelInvocation: frontmatter["disable-model-invocation"] === true,
      },
      diagnostics,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "failed to parse skill file";
    diagnostics.push({
      type: "warning",
      message,
      path: filePath,
    });
    return {
      skill: null,
      diagnostics,
    };
  }
}
/**
 * Format skills for inclusion in a system prompt.
 * Uses XML format per Agent Skills standard.
 * See: https://agentskills.io/integrate-skills
 *
 * Skills with disableModelInvocation=true are excluded from the prompt
 * (they can only be invoked explicitly via /skill:name commands).
 */
function formatSkillsForPrompt(skills) {
  return formatSkillsForPrompt$1(skills.filter((s) => !s.disableModelInvocation));
}
function resolveSkillPath(p, cwd) {
  const normalized = expandTildePath(p);
  return isAbsolute(normalized) ? normalized : resolve(cwd, normalized);
}
/**
 * Load skills from all configured locations.
 * Returns skills and any validation diagnostics.
 */
function loadSkills(options) {
  const { cwd, agentDir, skillPaths, includeDefaults } = options;
  const archivedSkillFiles = getArchivedSkillFiles();
  const resolvedAgentDir = agentDir ?? getAgentDir();
  const skillMap = /* @__PURE__ */ new Map();
  const realPathSet = /* @__PURE__ */ new Set();
  const allDiagnostics = [];
  const collisionDiagnostics = [];
  function addSkills(result) {
    allDiagnostics.push(...result.diagnostics);
    for (const skill of result.skills) {
      if (archivedSkillFiles.has(canonicalizePath(skill.filePath))) continue;
      const realPath = canonicalizePath(skill.filePath);
      if (realPathSet.has(realPath)) continue;
      const existing = skillMap.get(skill.name);
      if (existing)
        collisionDiagnostics.push({
          type: "collision",
          message: `name "${skill.name}" collision`,
          path: skill.filePath,
          collision: {
            resourceType: "skill",
            name: skill.name,
            winnerPath: existing.filePath,
            loserPath: skill.filePath,
          },
        });
      else {
        skillMap.set(skill.name, skill);
        realPathSet.add(realPath);
      }
    }
  }
  if (includeDefaults) {
    addSkills(loadSkillsFromDirInternal(join(resolvedAgentDir, "skills"), "user", true));
    addSkills(loadSkillsFromDirInternal(resolve(cwd, CONFIG_DIR_NAME, "skills"), "project", true));
  }
  const userSkillsDir = join(resolvedAgentDir, "skills");
  const projectSkillsDir = resolve(cwd, CONFIG_DIR_NAME, "skills");
  const isUnderPath = (target, root) => {
    const normalizedRoot = resolve(root);
    if (target === normalizedRoot) return true;
    const prefix = normalizedRoot.endsWith(sep) ? normalizedRoot : `${normalizedRoot}${sep}`;
    return target.startsWith(prefix);
  };
  const getSource = (resolvedPath) => {
    if (!includeDefaults) {
      if (isUnderPath(resolvedPath, userSkillsDir)) return "user";
      if (isUnderPath(resolvedPath, projectSkillsDir)) return "project";
    }
    return "path";
  };
  for (const rawPath of skillPaths) {
    const resolvedPath = resolveSkillPath(rawPath, cwd);
    if (!existsSync(resolvedPath)) {
      allDiagnostics.push({
        type: "warning",
        message: "skill path does not exist",
        path: resolvedPath,
      });
      continue;
    }
    try {
      const stats = statSync(resolvedPath);
      const source = getSource(resolvedPath);
      if (stats.isDirectory()) addSkills(loadSkillsFromDirInternal(resolvedPath, source, true));
      else if (stats.isFile() && resolvedPath.endsWith(".md")) {
        const result = loadSkillFromFile(resolvedPath, source);
        if (result.skill)
          addSkills({
            skills: [result.skill],
            diagnostics: result.diagnostics,
          });
        else allDiagnostics.push(...result.diagnostics);
      } else
        allDiagnostics.push({
          type: "warning",
          message: "skill path is not a markdown file",
          path: resolvedPath,
        });
    } catch (error) {
      const message = error instanceof Error ? error.message : "failed to read skill path";
      allDiagnostics.push({
        type: "warning",
        message,
        path: resolvedPath,
      });
    }
  }
  return {
    skills: Array.from(skillMap.values()),
    diagnostics: [...allDiagnostics, ...collisionDiagnostics],
  };
}
//#endregion
//#region src/agents/promised-work-prompt.ts
/** Shared prompt policy for commitments that outlive the current turn. */
function buildPromisedWorkPromptSection() {
  return [
    "## Promised Work",
    "- Promising future, background, delegated, or continued work creates follow-through ownership.",
    "- Before ending a turn, arrange an available push-based completion or watch path; keep the originating request and any existing goal or task open.",
    "- Proactively return with the result, link, proof, or a concrete blocker; do not wait for the requester to ask.",
    "- If no completion path exists, do not promise later; stay in the turn or state the blocker.",
    "- Progress such as `running` is not completion.",
    "",
  ];
}
//#endregion
//#region src/agents/sessions/system-prompt.ts
/**
 * System prompt construction and project context loading
 */
/** Build the system prompt with tools, guidelines, and context */
function buildSystemPrompt(options) {
  const {
    customPrompt,
    selectedTools,
    toolSnippets,
    promptGuidelines,
    appendSystemPrompt,
    cwd,
    contextFiles: providedContextFiles,
    skills: providedSkills,
  } = options;
  const promptCwd = cwd.replace(/\\/g, "/");
  const now = /* @__PURE__ */ new Date();
  const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const appendSection = appendSystemPrompt ? `\n\n${appendSystemPrompt}` : "";
  const contextFiles = providedContextFiles ?? [];
  const skills = providedSkills ?? [];
  if (customPrompt) {
    let prompt = customPrompt;
    if (appendSection) prompt += appendSection;
    if (contextFiles.length > 0) {
      prompt += "\n\n<project_context>\n\n";
      prompt += "Project-specific instructions and guidelines:\n\n";
      for (const { path: filePath, content } of contextFiles)
        prompt += `<project_instructions path="${filePath}">\n${content}\n</project_instructions>\n\n`;
      prompt += "</project_context>\n";
    }
    if ((!selectedTools || selectedTools.includes("read")) && skills.length > 0)
      prompt += formatSkillsForPrompt(skills);
    prompt += `\nCurrent date: ${date}`;
    prompt += `\nCurrent working directory: ${promptCwd}`;
    return prompt;
  }
  const readmePath = getReadmePath();
  const docsPath = getDocsPath();
  const examplesPath = getExamplesPath();
  const tools = selectedTools || ["read", "bash", "edit", "write"];
  const visibleTools = tools.filter((name) => Boolean(toolSnippets?.[name]));
  const toolsList =
    visibleTools.length > 0
      ? visibleTools.map((name) => `- ${name}: ${toolSnippets[name]}`).join("\n")
      : "(none)";
  const guidelinesList = [];
  const guidelinesSet = /* @__PURE__ */ new Set();
  const addGuideline = (guideline) => {
    if (guidelinesSet.has(guideline)) return;
    guidelinesSet.add(guideline);
    guidelinesList.push(guideline);
  };
  const hasBash = tools.includes("bash");
  const hasGrep = tools.includes("grep");
  const hasFind = tools.includes("find");
  const hasLs = tools.includes("ls");
  const hasRead = tools.includes("read");
  if (hasBash && !hasGrep && !hasFind && !hasLs)
    addGuideline("Use bash for file operations like ls, rg, find");
  else if (hasBash && (hasGrep || hasFind || hasLs))
    addGuideline(
      "Prefer grep/find/ls tools over bash for file exploration (faster, respects .gitignore)",
    );
  for (const guideline of promptGuidelines ?? []) {
    const normalized = guideline.trim();
    if (normalized.length > 0) addGuideline(normalized);
  }
  addGuideline("Be concise in your responses");
  addGuideline("Show file paths clearly when working with files");
  let prompt = `You are an expert coding assistant operating inside OpenClaw's embedded coding agent harness. You help users by reading files, executing commands, editing code, and writing new files.

Available tools:
${toolsList}

In addition to the tools above, you may have access to other custom tools depending on the project.

Guidelines:
${guidelinesList.map((g) => `- ${g}`).join("\n")}

${buildPromisedWorkPromptSection().join("\n")}

Embedded agent documentation (read only when the user asks about the embedded agent SDK, extensions, themes, skills, or TUI):
- Main documentation: ${readmePath}
- Additional docs: ${docsPath}
- Examples: ${examplesPath} (extensions, custom tools, SDK)
- When reading embedded agent docs or examples, resolve docs/... under Additional docs and examples/... under Examples, not the current working directory
- When asked about: extensions (docs/extensions.md, examples/extensions/), themes (docs/themes.md), skills (docs/skills.md), prompt templates (docs/prompt-templates.md), TUI components (docs/tui.md), keybindings (docs/keybindings.md), SDK integrations (docs/sdk.md), custom providers (docs/custom-provider.md), adding models (docs/models.md), runtime packages (docs/packages.md)
- When working on embedded agent topics, read the docs and examples, and follow .md cross-references before implementing
- Always read embedded agent .md files completely and follow links to related docs (e.g., tui.md for TUI API details)`;
  if (appendSection) prompt += appendSection;
  if (contextFiles.length > 0) {
    prompt += "\n\n<project_context>\n\n";
    prompt += "Project-specific instructions and guidelines:\n\n";
    for (const { path: filePath, content } of contextFiles)
      prompt += `<project_instructions path="${filePath}">\n${content}\n</project_instructions>\n\n`;
    prompt += "</project_context>\n";
  }
  if (hasRead && skills.length > 0) prompt += formatSkillsForPrompt(skills);
  prompt += `\nCurrent date: ${date}`;
  prompt += `\nCurrent working directory: ${promptCwd}`;
  return prompt;
}
//#endregion
//#region src/agents/sessions/agent-session.ts
/**
 * AgentSession - Core abstraction for agent lifecycle and session management.
 *
 * This class is shared between all run modes (interactive, print, rpc).
 * It encapsulates:
 * - Agent state access
 * - Event subscription with automatic session persistence
 * - Model and thinking level management
 * - Compaction (manual and auto)
 * - Bash execution
 * - Session switching and branching
 *
 * Modes use this class and add their own I/O layer on top.
 */
function unwrapCoreResult(result) {
  if (result.ok) return result.value;
  throw result.error;
}
function normalizeBranchSummaryResult(result) {
  if (result.ok) return result.value;
  if (result.error.code === "aborted")
    return {
      aborted: true,
      error: result.error.message,
    };
  return { error: result.error.message };
}
function hasPersistedAssistantContent(content) {
  return (typeof content === "string" || Array.isArray(content)) && content.length > 0;
}
function extractPersistedAssistantText(content) {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";
  let text = "";
  for (const block of content) {
    if (!block || typeof block !== "object") continue;
    const candidate = block;
    if (candidate.type === "text" && typeof candidate.text === "string") text += candidate.text;
  }
  return text;
}
/**
 * Parse a skill block from message text.
 * Returns null if the text doesn't contain a skill block.
 */
function parseSkillBlock(text) {
  const match = text.match(
    /^<skill name="([^"]+)" location="([^"]+)">\n([\s\S]*?)\n<\/skill>(?:\n\n([\s\S]+))?$/,
  );
  if (!match) return null;
  const [, name, location, content, userMessage] = match;
  if (name === void 0 || location === void 0 || content === void 0) return null;
  return {
    name,
    location,
    content,
    userMessage: userMessage?.trim() || void 0,
  };
}
/** Standard thinking levels */
const THINKING_LEVELS = ["off", "minimal", "low", "medium", "high"];
function estimateMessagesFromContent(messages) {
  return messages.reduce((total, message) => total + estimateTokens(message), 0);
}
var AgentSession = class {
  constructor(config) {
    this.eventListeners = [];
    this.steeringMessages = [];
    this.followUpMessages = [];
    this.pendingNextTurnMessages = [];
    this.compactionAbortController = void 0;
    this.autoCompactionAbortController = void 0;
    this.overflowRecoveryAttempted = false;
    this.branchSummaryAbortController = void 0;
    this.extensionModifiedToolResultIds = /* @__PURE__ */ new Set();
    this.retryAbortController = void 0;
    this.retryCount = 0;
    this.autoContinueRunHadToolCall = false;
    this.bashAbortController = void 0;
    this.pendingBashMessages = [];
    this.turnIndex = 0;
    this.baseToolDefinitions = /* @__PURE__ */ new Map();
    this.toolRegistry = /* @__PURE__ */ new Map();
    this.toolDefinitions = /* @__PURE__ */ new Map();
    this.toolPromptSnippets = /* @__PURE__ */ new Map();
    this.toolPromptGuidelines = /* @__PURE__ */ new Map();
    this.baseSystemPrompt = "";
    this.lastAssistantMessage = void 0;
    this.handleAgentEvent = async (event) => {
      if (this.eventMayWriteSession(event)) {
        await this.runWithSessionWriteLock(async () => await this.handleAgentEventUnlocked(event));
        return;
      }
      await this.handleAgentEventUnlocked(event);
    };
    this.agent = config.agent;
    this.sessionManager = config.sessionManager;
    this.settingsManager = config.settingsManager;
    this.scopedModelEntries = config.scopedModels ?? [];
    this.sessionResourceLoader = config.resourceLoader;
    this.customTools = config.customTools ?? [];
    this.cwd = config.cwd;
    this.sessionModelRegistry = config.modelRegistry;
    this.extensionRunnerRef = config.extensionRunnerRef;
    this.initialActiveToolNames = config.initialActiveToolNames;
    this.allowedToolNames = config.allowedToolNames ? new Set(config.allowedToolNames) : void 0;
    this.disableBuiltInTools = config.disableBuiltInTools === true;
    this.baseToolsOverride = config.baseToolsOverride;
    this.sessionStartEvent = config.sessionStartEvent ?? {
      type: "session_start",
      reason: "startup",
    };
    this.withExternalSessionWriteLock = config.withSessionWriteLock;
    this.unsubscribeAgent = this.agent.subscribe(this.handleAgentEvent);
    this.installAgentToolHooks();
    this.buildRuntime({
      activeToolNames: this.initialActiveToolNames,
      includeAllExtensionTools: true,
    });
  }
  /** Model registry for API key resolution and model discovery */
  get modelRegistry() {
    return this.sessionModelRegistry;
  }
  async getRequiredRequestAuth(model) {
    const result = await this.sessionModelRegistry.getApiKeyAndHeaders(model);
    if (!result.ok) {
      if (result.error.startsWith("No API key found"))
        throw new Error(formatNoApiKeyFoundMessage(model.provider));
      throw new Error(result.error);
    }
    if (result.apiKey)
      return {
        apiKey: result.apiKey,
        headers: result.headers,
      };
    if (this.sessionModelRegistry.isUsingOAuth(model))
      throw new Error(
        `Authentication failed for "${model.provider}". Credentials may have expired or network is unavailable. Run '/login ${model.provider}' to re-authenticate.`,
      );
    throw new Error(formatNoApiKeyFoundMessage(model.provider));
  }
  async getCompactionRequestAuth(model) {
    if (this.agent.streamFn === streamSimple) return this.getRequiredRequestAuth(model);
    const result = await this.sessionModelRegistry.getApiKeyAndHeaders(model);
    return result.ok
      ? {
          apiKey: result.apiKey,
          headers: result.headers,
        }
      : {};
  }
  async runWithSessionWriteLock(run) {
    return this.withExternalSessionWriteLock
      ? await this.withExternalSessionWriteLock(run)
      : await run();
  }
  eventMayWriteSession(event) {
    return event.type === "message_end" || this.currentExtensionRunner.hasHandlers(event.type);
  }
  /**
   * Install tool hooks once on the Agent instance.
   *
   * The callbacks read `this.currentExtensionRunner` at execution time, so extension reload swaps in the
   * new runner without reinstalling hooks. Extension-specific tool wrappers are still used to adapt
   * registered tool execution to the extension context. Tool call and tool result interception now
   * happens here instead of in wrappers.
   */
  installAgentToolHooks() {
    this.agent.beforeToolCall = async ({ toolCall, args }) => {
      const runner = this.currentExtensionRunner;
      return await this.runWithSessionWriteLock(async () => {
        if (!runner.hasHandlers("tool_call")) return;
        try {
          return await runner.emitToolCall({
            type: "tool_call",
            toolName: toolCall.name,
            toolCallId: toolCall.id,
            input: args,
          });
        } catch (err) {
          if (err instanceof Error) throw err;
          throw new Error(`Extension failed, blocking execution: ${String(err)}`, { cause: err });
        }
      });
    };
    this.agent.afterToolCall = async ({ toolCall, args, result, isError }) => {
      const runner = this.currentExtensionRunner;
      if (!runner.hasHandlers("tool_result")) return;
      const hookResult = await this.runWithSessionWriteLock(
        async () =>
          await runner.emitToolResult({
            type: "tool_result",
            toolName: toolCall.name,
            toolCallId: toolCall.id,
            input: args,
            content: result.content,
            details: result.details,
            isError,
          }),
      );
      if (!hookResult) return;
      this.extensionModifiedToolResultIds.add(toolCall.id);
      return {
        content: hookResult.content,
        details: hookResult.details,
        isError: hookResult.isError ?? isError,
      };
    };
  }
  /** Emit an event to all listeners */
  emit(event) {
    for (const l of this.eventListeners) l(event);
  }
  emitQueueUpdate() {
    this.emit({
      type: "queue_update",
      steering: [...this.steeringMessages],
      followUp: [...this.followUpMessages],
    });
  }
  async handleAgentEventUnlocked(event) {
    if (event.type === "message_start" && event.message.role === "user") {
      this.overflowRecoveryAttempted = false;
      const messageText = this.getUserMessageText(event.message);
      if (messageText) {
        const steeringIndex = this.steeringMessages.indexOf(messageText);
        if (steeringIndex !== -1) {
          this.steeringMessages.splice(steeringIndex, 1);
          this.emitQueueUpdate();
        } else {
          const followUpIndex = this.followUpMessages.indexOf(messageText);
          if (followUpIndex !== -1) {
            this.followUpMessages.splice(followUpIndex, 1);
            this.emitQueueUpdate();
          }
        }
      }
    }
    const messageChangedByExtension = await this.emitExtensionEvent(event);
    this.emit(
      event.type === "agent_end"
        ? {
            ...event,
            willRetry: this.willRetryAfterAgentEnd(event),
          }
        : event,
    );
    if (event.type === "message_end") {
      if (event.message.role === "custom")
        this.sessionManager.appendCustomMessageEntry(
          event.message.customType,
          event.message.content,
          event.message.display,
          event.message.details,
        );
      else if (
        event.message.role === "user" ||
        event.message.role === "assistant" ||
        event.message.role === "toolResult"
      ) {
        const toolResultChangedByExtension =
          event.message.role === "toolResult" &&
          this.extensionModifiedToolResultIds.delete(event.message.toolCallId);
        this.sessionManager.appendMessage(event.message, {
          invalidateSerializedPrefixCache:
            messageChangedByExtension || toolResultChangedByExtension,
        });
      }
      if (event.message.role === "assistant") {
        this.lastAssistantMessage = event.message;
        const assistantMsg = event.message;
        if (assistantMsg.stopReason !== "error") this.overflowRecoveryAttempted = false;
        if (assistantMsg.stopReason !== "error" && this.retryCount > 0) {
          this.emit({
            type: "auto_retry_end",
            success: true,
            attempt: this.retryCount,
          });
          this.retryCount = 0;
        }
      }
    }
  }
  willRetryAfterAgentEnd(event) {
    const settings = this.settingsManager.getRetrySettings();
    if (!settings.enabled || this.retryCount >= settings.maxRetries) return false;
    for (const message of event.messages.toReversed())
      if (message.role === "assistant") return this.isRetryableError(message);
    return false;
  }
  /** Extract text content from a message */
  getUserMessageText(message) {
    if (message.role !== "user") return "";
    const content = message.content;
    if (typeof content === "string") return content;
    return content
      .filter((c) => c.type === "text")
      .map((c) => c.text)
      .join("");
  }
  /** Find the last assistant message in agent state (including aborted ones) */
  findLastAssistantMessage() {
    const messages = this.agent.state.messages;
    for (const msg of messages.toReversed()) if (msg.role === "assistant") return msg;
  }
  replaceMessageInPlace(target, replacement) {
    if (target === replacement) return;
    const targetRecord = target;
    for (const key of Object.keys(targetRecord)) delete targetRecord[key];
    Object.assign(targetRecord, replacement);
  }
  /** Emit extension events based on agent events */
  async emitExtensionEvent(event) {
    if (event.type === "agent_start") {
      this.turnIndex = 0;
      this.autoContinueRunHadToolCall = false;
      await this.currentExtensionRunner.emit({ type: "agent_start" });
    } else if (event.type === "agent_end")
      await this.currentExtensionRunner.emit({
        type: "agent_end",
        messages: event.messages,
      });
    else if (event.type === "turn_start") {
      const extensionEvent = {
        type: "turn_start",
        turnIndex: this.turnIndex,
        timestamp: Date.now(),
      };
      await this.currentExtensionRunner.emit(extensionEvent);
    } else if (event.type === "turn_end") {
      if (event.toolResults.length > 0) this.autoContinueRunHadToolCall = true;
      const extensionEvent = {
        type: "turn_end",
        turnIndex: this.turnIndex,
        message: event.message,
        toolResults: event.toolResults,
      };
      await this.currentExtensionRunner.emit(extensionEvent);
      this.turnIndex++;
    } else if (event.type === "message_start") {
      const extensionEvent = {
        type: "message_start",
        message: event.message,
      };
      await this.currentExtensionRunner.emit(extensionEvent);
    } else if (event.type === "message_update") {
      const extensionEvent = {
        type: "message_update",
        message: event.message,
        assistantMessageEvent: event.assistantMessageEvent,
      };
      await this.currentExtensionRunner.emit(extensionEvent);
    } else if (event.type === "message_end") {
      const extensionEvent = {
        type: "message_end",
        message: event.message,
      };
      const replacement = await this.currentExtensionRunner.emitMessageEnd(extensionEvent);
      if (replacement) {
        this.replaceMessageInPlace(event.message, replacement);
        return true;
      }
    } else if (event.type === "tool_execution_start") {
      const extensionEvent = {
        type: "tool_execution_start",
        toolCallId: event.toolCallId,
        toolName: event.toolName,
        args: event.args,
      };
      await this.currentExtensionRunner.emit(extensionEvent);
    } else if (event.type === "tool_execution_update") {
      const extensionEvent = {
        type: "tool_execution_update",
        toolCallId: event.toolCallId,
        toolName: event.toolName,
        args: event.args,
        partialResult: event.partialResult,
      };
      await this.currentExtensionRunner.emit(extensionEvent);
    } else if (event.type === "tool_execution_end") {
      const extensionEvent = {
        type: "tool_execution_end",
        toolCallId: event.toolCallId,
        toolName: event.toolName,
        result: event.result,
        isError: event.isError,
      };
      await this.currentExtensionRunner.emit(extensionEvent);
    }
    return false;
  }
  /**
   * Subscribe to agent events.
   * Session persistence is handled internally (saves messages on message_end).
   * Multiple listeners can be added. Returns unsubscribe function for this listener.
   */
  subscribe(listener) {
    this.eventListeners.push(listener);
    return () => {
      const index = this.eventListeners.indexOf(listener);
      if (index !== -1) this.eventListeners.splice(index, 1);
    };
  }
  /**
   * Temporarily disconnect from agent events.
   * User listeners are preserved and will receive events again after resubscribe().
   * Used internally during operations that need to pause event processing.
   */
  disconnectFromAgent() {
    if (this.unsubscribeAgent) {
      this.unsubscribeAgent();
      this.unsubscribeAgent = void 0;
    }
  }
  /**
   * Reconnect to agent events after disconnectFromAgent().
   * Preserves all existing listeners.
   */
  reconnectToAgent() {
    if (this.unsubscribeAgent) return;
    this.unsubscribeAgent = this.agent.subscribe(this.handleAgentEvent);
  }
  /**
   * Remove all listeners and disconnect from agent.
   * Call this when completely done with the session.
   */
  dispose() {
    this.currentExtensionRunner.invalidate(
      "This extension ctx is stale after session replacement or reload. Do not use a captured api or command ctx after ctx.newSession(), ctx.fork(), ctx.switchSession(), or ctx.reload(). For newSession, fork, and switchSession, move post-replacement work into withSession and use the ctx passed to withSession. For reload, do not use the old ctx after await ctx.reload().",
    );
    this.disconnectFromAgent();
    this.eventListeners = [];
    cleanupSessionResources(this.sessionId);
  }
  /** Full agent state */
  get state() {
    return this.agent.state;
  }
  /** Current model (may be undefined if not yet selected) */
  get model() {
    return this.agent.state.model;
  }
  /** Current thinking level */
  get thinkingLevel() {
    return this.agent.state.thinkingLevel;
  }
  /** Whether agent is currently streaming a response */
  get isStreaming() {
    return this.agent.state.isStreaming;
  }
  /** Current effective system prompt (includes any per-turn extension modifications) */
  get systemPrompt() {
    return this.agent.state.systemPrompt;
  }
  /** Current retry attempt (0 if not retrying) */
  get retryAttempt() {
    return this.retryCount;
  }
  /**
   * Get the names of currently active tools.
   * Returns the names of tools currently set on the agent.
   */
  getActiveToolNames() {
    return this.agent.state.tools.map((t) => t.name);
  }
  /**
   * Get all configured tools with name, description, parameter schema, and source metadata.
   */
  getAllTools() {
    return Array.from(this.toolDefinitions.values()).map(({ definition, sourceInfo }) => ({
      name: definition.name,
      description: definition.description,
      parameters: definition.parameters,
      sourceInfo,
    }));
  }
  getToolDefinition(name) {
    return this.toolDefinitions.get(name)?.definition;
  }
  /**
   * Set active tools by name.
   * Only tools in the registry can be enabled. Unknown tool names are ignored.
   * Also rebuilds the system prompt to reflect the new tool set.
   * Changes take effect on the next agent turn.
   */
  setActiveToolsByName(toolNames) {
    const tools = [];
    const validToolNames = [];
    for (const name of toolNames) {
      const tool = this.toolRegistry.get(name);
      if (tool) {
        tools.push(tool);
        validToolNames.push(name);
      }
    }
    this.agent.state.tools = tools;
    this.baseSystemPrompt = this.rebuildSystemPrompt(validToolNames);
    this.agent.state.systemPrompt = this.baseSystemPrompt;
  }
  /** Set an exact base prompt owned by the current runtime. */
  setBaseSystemPrompt(systemPrompt) {
    const { validToolNames, toolSnippets, promptGuidelines } = this.collectActiveToolPromptMetadata(
      this.getActiveToolNames(),
    );
    this.exactBaseSystemPrompt = systemPrompt;
    this.baseSystemPrompt = systemPrompt;
    this.baseSystemPromptOptions = {
      cwd: this.cwd,
      selectedTools: validToolNames,
      toolSnippets,
      promptGuidelines,
      customPrompt: systemPrompt,
    };
    this.agent.state.systemPrompt = systemPrompt;
  }
  /** Whether compaction or branch summarization is currently running */
  get isCompacting() {
    return (
      this.autoCompactionAbortController !== void 0 ||
      this.compactionAbortController !== void 0 ||
      this.branchSummaryAbortController !== void 0
    );
  }
  /** All messages including custom types like BashExecutionMessage */
  get messages() {
    return this.agent.state.messages;
  }
  /** Current steering mode */
  get steeringMode() {
    return this.agent.steeringMode;
  }
  /** Current follow-up mode */
  get followUpMode() {
    return this.agent.followUpMode;
  }
  /** Current session file path, or undefined if sessions are disabled */
  get sessionFile() {
    return this.sessionManager.getSessionFile();
  }
  /** Current session ID */
  get sessionId() {
    return this.sessionManager.getSessionId();
  }
  /** Current session display name, if set */
  get sessionName() {
    return this.sessionManager.getSessionName();
  }
  /** Scoped models for cycling (from --models flag) */
  get scopedModels() {
    return this.scopedModelEntries;
  }
  /** Update scoped models for cycling */
  setScopedModels(scopedModels) {
    this.scopedModelEntries = scopedModels;
  }
  /** File-based prompt templates */
  get promptTemplates() {
    return this.sessionResourceLoader.getPrompts().prompts;
  }
  normalizePromptSnippet(text) {
    if (!text) return;
    const oneLine = text
      .replace(/[\r\n]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return oneLine.length > 0 ? oneLine : void 0;
  }
  normalizePromptGuidelines(guidelines) {
    if (!guidelines || guidelines.length === 0) return [];
    const unique = /* @__PURE__ */ new Set();
    for (const guideline of guidelines) {
      const normalized = guideline.trim();
      if (normalized.length > 0) unique.add(normalized);
    }
    return Array.from(unique);
  }
  collectActiveToolPromptMetadata(toolNames) {
    const validToolNames = toolNames.filter((name) => this.toolRegistry.has(name));
    const toolSnippets = {};
    const promptGuidelines = [];
    for (const name of validToolNames) {
      const snippet = this.toolPromptSnippets.get(name);
      if (snippet) toolSnippets[name] = snippet;
      const toolGuidelines = this.toolPromptGuidelines.get(name);
      if (toolGuidelines) promptGuidelines.push(...toolGuidelines);
    }
    return {
      validToolNames,
      toolSnippets,
      promptGuidelines,
    };
  }
  rebuildSystemPrompt(toolNames) {
    const { validToolNames, toolSnippets, promptGuidelines } =
      this.collectActiveToolPromptMetadata(toolNames);
    if (this.exactBaseSystemPrompt !== void 0) {
      this.baseSystemPromptOptions = {
        ...this.baseSystemPromptOptions,
        cwd: this.cwd,
        customPrompt: this.exactBaseSystemPrompt,
        selectedTools: validToolNames,
        toolSnippets,
        promptGuidelines,
      };
      return this.exactBaseSystemPrompt;
    }
    const loaderSystemPrompt = this.sessionResourceLoader.getSystemPrompt();
    const loaderAppendSystemPrompt = this.sessionResourceLoader.getAppendSystemPrompt();
    const appendSystemPrompt =
      loaderAppendSystemPrompt.length > 0 ? loaderAppendSystemPrompt.join("\n\n") : void 0;
    const loadedSkills = this.sessionResourceLoader.getSkills().skills;
    const loadedContextFiles = this.sessionResourceLoader.getAgentsFiles().agentsFiles;
    this.baseSystemPromptOptions = {
      cwd: this.cwd,
      skills: loadedSkills,
      contextFiles: loadedContextFiles,
      customPrompt: loaderSystemPrompt,
      appendSystemPrompt,
      selectedTools: validToolNames,
      toolSnippets,
      promptGuidelines,
    };
    return buildSystemPrompt(this.baseSystemPromptOptions);
  }
  async runAgentPrompt(messages) {
    const autoContinue = autoContinueEnabled() ? new AutoContinueController() : null;
    const task = autoContinue ? this.extractAutoContinueTask(messages) : "";
    try {
      this.autoContinueRunHadToolCall = false;
      await this.agent.prompt(messages);
      while (await this.handlePostAgentRun()) await this.agent.continue();
      while (autoContinue) {
        const last = this.findLastAssistantMessage();
        const aborted = last?.stopReason === "aborted" || last?.stopReason === "error";
        const decision = await autoContinue.decideNext({
          task,
          lastText: last ? this.extractAssistantText(last) : "",
          hadToolCall: this.autoContinueRunHadToolCall,
          aborted,
        });
        if (decision.kind === "stop") {
          console.error(`[autocontinue] stop reason=${decision.reason} n=${autoContinue.count}`);
          break;
        }
        console.error(`[autocontinue] continue n=${decision.n} escalated=${decision.escalated}`);
        this.autoContinueRunHadToolCall = false;
        await this.agent.prompt([this.buildAutoContinueMessage(decision.nudge)]);
        while (await this.handlePostAgentRun()) await this.agent.continue();
      }
    } finally {
      this.flushPendingBashMessages();
    }
  }
  /** [autoproduct] The task the planner reasons over: the first user message of this prompt. */
  extractAutoContinueTask(messages) {
    const list = Array.isArray(messages) ? messages : [messages];
    for (const message of list)
      if (message.role === "user") {
        const text = this.getUserMessageText(message);
        if (text) return text.replace(/\n*\[Context:[\s\S]*$/i, "").trim();
      }
    return "";
  }
  /** [autoproduct] Concatenated text blocks of an assistant message (the run's final output). */
  extractAssistantText(message) {
    return message.content
      .filter((c) => c.type === "text")
      .map((c) => c.text)
      .join("");
  }
  /** [autoproduct] The synthetic "Continue." user turn fed back to self-continue the loop. */
  buildAutoContinueMessage(text) {
    return {
      role: "user",
      content: [
        {
          type: "text",
          text,
        },
      ],
      timestamp: Date.now(),
    };
  }
  async handlePostAgentRun() {
    const msg = this.lastAssistantMessage;
    this.lastAssistantMessage = void 0;
    if (!msg) return false;
    if (this.isRetryableError(msg) && (await this.prepareRetry(msg))) return true;
    if (msg.stopReason === "error" && this.retryCount > 0) {
      this.emit({
        type: "auto_retry_end",
        success: false,
        attempt: this.retryCount,
        finalError: msg.errorMessage,
      });
      this.retryCount = 0;
    }
    return await this.checkCompaction(msg);
  }
  /**
   * Send a prompt to the agent.
   * - Handles extension commands immediately, even during streaming
   * - Expands file-based prompt templates by default
   * - During streaming, queues via steer() or followUp() based on streamingBehavior option
   * - Validates model and API key before sending (when not streaming)
   * @throws Error if streaming and no streamingBehavior specified
   * @throws Error if no model selected or no API key available (when not streaming)
   */
  async prompt(text, options) {
    const expandPromptTemplates = options?.expandPromptTemplates ?? true;
    const preflightResult = options?.preflightResult;
    let messages;
    try {
      if (expandPromptTemplates && text.startsWith("/")) {
        if (await this.tryExecuteExtensionCommand(text)) {
          preflightResult?.(true);
          return;
        }
      }
      let currentText = text;
      let currentImages = options?.images;
      if (this.currentExtensionRunner.hasHandlers("input")) {
        const inputResult = await this.currentExtensionRunner.emitInput(
          currentText,
          currentImages,
          options?.source ?? "interactive",
        );
        if (inputResult.action === "handled") {
          preflightResult?.(true);
          return;
        }
        if (inputResult.action === "transform") {
          currentText = inputResult.text;
          currentImages = inputResult.images ?? currentImages;
        }
      }
      let expandedText = currentText;
      if (expandPromptTemplates) {
        expandedText = this.expandSkillCommand(expandedText);
        expandedText = expandPromptTemplate(expandedText, [...this.promptTemplates]);
      }
      if (this.isStreaming) {
        if (!options?.streamingBehavior)
          throw new Error(
            "Agent is already processing. Specify streamingBehavior ('steer' or 'followUp') to queue the message.",
          );
        if (options.streamingBehavior === "followUp")
          await this.queueFollowUp(expandedText, currentImages);
        else await this.queueSteer(expandedText, currentImages);
        preflightResult?.(true);
        return;
      }
      this.flushPendingBashMessages();
      if (!this.model) throw new Error(formatNoModelSelectedMessage());
      if (!this.sessionModelRegistry.hasConfiguredAuth(this.model)) {
        if (this.sessionModelRegistry.isUsingOAuth(this.model))
          throw new Error(
            `Authentication failed for "${this.model.provider}". Credentials may have expired or network is unavailable. Run '/login ${this.model.provider}' to re-authenticate.`,
          );
        throw new Error(formatNoApiKeyFoundMessage(this.model.provider));
      }
      const lastAssistant = this.findLastAssistantMessage();
      if (lastAssistant && (await this.checkCompaction(lastAssistant, false)))
        try {
          await this.agent.continue();
          while (await this.handlePostAgentRun()) await this.agent.continue();
        } finally {
          this.flushPendingBashMessages();
        }
      messages = [];
      const userContent = [
        {
          type: "text",
          text: expandedText,
        },
      ];
      if (currentImages) userContent.push(...currentImages);
      messages.push({
        role: "user",
        content: userContent,
        timestamp: Date.now(),
      });
      for (const msg of this.pendingNextTurnMessages) messages.push(msg);
      this.pendingNextTurnMessages = [];
      const result = await this.currentExtensionRunner.emitBeforeAgentStart(
        expandedText,
        currentImages,
        this.baseSystemPrompt,
        this.baseSystemPromptOptions,
      );
      if (result?.messages)
        for (const msg of result.messages)
          messages.push({
            role: "custom",
            customType: msg.customType,
            content: msg.content,
            display: msg.display,
            details: msg.details,
            timestamp: Date.now(),
          });
      if (result?.systemPrompt) this.agent.state.systemPrompt = result.systemPrompt;
      else this.agent.state.systemPrompt = this.baseSystemPrompt;
    } catch (error) {
      preflightResult?.(false);
      throw error;
    }
    if (!messages) return;
    preflightResult?.(true);
    await this.runAgentPrompt(messages);
  }
  /**
   * Try to execute an extension command. Returns true if command was found and executed.
   */
  async tryExecuteExtensionCommand(text) {
    const spaceIndex = text.indexOf(" ");
    const commandName = spaceIndex === -1 ? text.slice(1) : text.slice(1, spaceIndex);
    const args = spaceIndex === -1 ? "" : text.slice(spaceIndex + 1);
    const command = this.currentExtensionRunner.getCommand(commandName);
    if (!command) return false;
    const ctx = this.currentExtensionRunner.createCommandContext();
    try {
      await command.handler(args, ctx);
      return true;
    } catch (err) {
      this.currentExtensionRunner.emitError({
        extensionPath: `command:${commandName}`,
        event: "command",
        error: err instanceof Error ? err.message : String(err),
      });
      return true;
    }
  }
  /**
   * Expand skill commands (/skill:name args) to their full content.
   * Returns the expanded text, or the original text if not a skill command or skill not found.
   * Emits errors via extension runner if file read fails.
   */
  expandSkillCommand(text) {
    if (!text.startsWith("/skill:")) return text;
    const spaceIndex = text.indexOf(" ");
    const skillName = spaceIndex === -1 ? text.slice(7) : text.slice(7, spaceIndex);
    const args = spaceIndex === -1 ? "" : text.slice(spaceIndex + 1).trim();
    const skill = this.sessionResourceLoader.getSkills().skills.find((s) => s.name === skillName);
    if (!skill) return text;
    try {
      const body = stripFrontmatter(readFileSync(skill.filePath, "utf-8")).trim();
      const skillBlock = `<skill name="${skill.name}" location="${skill.filePath}">\nReferences are relative to ${skill.baseDir}.\n\n${body}\n</skill>`;
      return args ? `${skillBlock}\n\n${args}` : skillBlock;
    } catch (err) {
      this.currentExtensionRunner.emitError({
        extensionPath: skill.filePath,
        event: "skill_expansion",
        error: err instanceof Error ? err.message : String(err),
      });
      return text;
    }
  }
  /**
   * Queue a steering message while the agent is running.
   * Delivered after the current assistant turn finishes executing its tool calls,
   * before the next LLM call.
   * Expands skill commands and prompt templates. Errors on extension commands.
   * @param images Optional image attachments to include with the message
   * @param userTurnTranscriptRecorder Prepared channel fields for transcript-only persistence
   * @throws Error if text is an extension command
   */
  async steer(text, images, userTurnTranscriptRecorder) {
    if (text.startsWith("/")) this.throwIfExtensionCommand(text);
    let expandedText = this.expandSkillCommand(text);
    expandedText = expandPromptTemplate(expandedText, [...this.promptTemplates]);
    const preparedMessage = await userTurnTranscriptRecorder?.resolveMessage();
    await this.queueSteer(
      expandedText,
      images,
      preparedMessage && userTurnTranscriptRecorder
        ? {
            message: preparedMessage,
            recorder: userTurnTranscriptRecorder,
          }
        : void 0,
    );
  }
  /**
   * Queue a follow-up message to be processed after the agent finishes.
   * Delivered only when agent has no more tool calls or steering messages.
   * Expands skill commands and prompt templates. Errors on extension commands.
   * @param images Optional image attachments to include with the message
   * @throws Error if text is an extension command
   */
  async followUp(text, images) {
    if (text.startsWith("/")) this.throwIfExtensionCommand(text);
    let expandedText = this.expandSkillCommand(text);
    expandedText = expandPromptTemplate(expandedText, [...this.promptTemplates]);
    await this.queueFollowUp(expandedText, images);
  }
  /**
   * Internal: Queue a steering message (already expanded, no extension command check).
   */
  async queueSteer(text, images, transcriptContext) {
    this.steeringMessages.push(text);
    this.emitQueueUpdate();
    const content = [
      {
        type: "text",
        text,
      },
    ];
    if (images) content.push(...images);
    const runtimeMessage = {
      role: "user",
      content,
      timestamp: Date.now(),
    };
    this.agent.steer(
      transcriptContext
        ? attachRuntimeUserTurnTranscriptContext(runtimeMessage, transcriptContext)
        : runtimeMessage,
    );
  }
  /**
   * Internal: Queue a follow-up message (already expanded, no extension command check).
   */
  async queueFollowUp(text, images) {
    this.followUpMessages.push(text);
    this.emitQueueUpdate();
    const content = [
      {
        type: "text",
        text,
      },
    ];
    if (images) content.push(...images);
    this.agent.followUp({
      role: "user",
      content,
      timestamp: Date.now(),
    });
  }
  /**
   * Throw an error if the text is an extension command.
   */
  throwIfExtensionCommand(text) {
    const spaceIndex = text.indexOf(" ");
    const commandName = spaceIndex === -1 ? text.slice(1) : text.slice(1, spaceIndex);
    if (this.currentExtensionRunner.getCommand(commandName))
      throw new Error(
        `Extension command "/${commandName}" cannot be queued. Use prompt() or execute the command when not streaming.`,
      );
  }
  /**
   * Send a custom message to the session. Creates a CustomMessageEntry.
   *
   * Handles three cases:
   * - Streaming: queues message, processed when loop pulls from queue
   * - Not streaming + triggerTurn: appends to state/session, starts new turn
   * - Not streaming + no trigger: appends to state/session, no turn
   *
   * @param message Custom message with customType, content, display, details
   * @param options.triggerTurn If true and not streaming, triggers a new LLM turn
   * @param options.deliverAs Delivery mode: "steer", "followUp", or "nextTurn"
   */
  async sendCustomMessage(message, options) {
    const appMessage = {
      role: "custom",
      customType: message.customType,
      content: message.content,
      display: message.display,
      details: message.details,
      timestamp: Date.now(),
    };
    if (options?.deliverAs === "nextTurn") this.pendingNextTurnMessages.push(appMessage);
    else if (this.isStreaming)
      if (options?.deliverAs === "followUp") this.agent.followUp(appMessage);
      else this.agent.steer(appMessage);
    else if (options?.triggerTurn) await this.runAgentPrompt(appMessage);
    else {
      this.agent.state.messages.push(appMessage);
      this.sessionManager.appendCustomMessageEntry(
        message.customType,
        message.content,
        message.display,
        message.details,
      );
      this.emit({
        type: "message_start",
        message: appMessage,
      });
      this.emit({
        type: "message_end",
        message: appMessage,
      });
    }
  }
  /**
   * Send a user message to the agent. Always triggers a turn.
   * When the agent is streaming, use deliverAs to specify how to queue the message.
   *
   * @param content User message content (string or content array)
   * @param options.deliverAs Delivery mode when streaming: "steer" or "followUp"
   */
  async sendUserMessage(content, options) {
    let text;
    let images;
    if (typeof content === "string") text = content;
    else {
      const textParts = [];
      images = [];
      for (const part of content)
        if (part.type === "text") textParts.push(part.text);
        else images.push(part);
      text = textParts.join("\n");
      if (images.length === 0) images = void 0;
    }
    await this.prompt(text, {
      expandPromptTemplates: false,
      streamingBehavior: options?.deliverAs,
      images,
      source: "extension",
    });
  }
  /**
   * Clear all queued messages and return them.
   * Useful for restoring to editor when user aborts.
   * @returns Object with steering and followUp arrays
   */
  clearQueue() {
    const steering = [...this.steeringMessages];
    const followUp = [...this.followUpMessages];
    this.steeringMessages = [];
    this.followUpMessages = [];
    this.agent.clearAllQueues();
    this.emitQueueUpdate();
    return {
      steering,
      followUp,
    };
  }
  /** Number of pending messages (includes both steering and follow-up) */
  get pendingMessageCount() {
    return this.steeringMessages.length + this.followUpMessages.length;
  }
  /** Get pending steering messages (read-only) */
  getSteeringMessages() {
    return this.steeringMessages;
  }
  /** Get pending follow-up messages (read-only) */
  getFollowUpMessages() {
    return this.followUpMessages;
  }
  get resourceLoader() {
    return this.sessionResourceLoader;
  }
  /** Abort the current run; yield callers pass a turnHandoff reason to skip interruption guidance. */
  async abort(reason) {
    this.abortRetry();
    this.agent.abort(reason);
    await this.agent.waitForIdle();
  }
  async emitModelSelect(nextModel, previousModel, source) {
    if (modelsAreEqual(previousModel, nextModel)) return;
    await this.currentExtensionRunner.emit({
      type: "model_select",
      model: nextModel,
      previousModel,
      source,
    });
  }
  /**
   * Set model directly.
   * Validates that auth is configured, saves to session and settings.
   * @throws Error if no auth is configured for the model
   */
  async setModel(model) {
    if (!this.sessionModelRegistry.hasConfiguredAuth(model))
      throw new Error(`No API key for ${model.provider}/${model.id}`);
    const previousModel = this.model;
    const thinkingLevel = this.getThinkingLevelForModelSwitch();
    this.agent.state.model = model;
    this.sessionManager.appendModelChange(model.provider, model.id);
    this.settingsManager.setDefaultModelAndProvider(model.provider, model.id);
    this.setThinkingLevel(thinkingLevel);
    await this.emitModelSelect(model, previousModel, "set");
  }
  /**
   * Cycle to next/previous model.
   * Uses scoped models (from --models flag) if available, otherwise all available models.
   * @param direction - "forward" (default) or "backward"
   * @returns The new model info, or undefined if only one model available
   */
  async cycleModel(direction = "forward") {
    if (this.scopedModelEntries.length > 0) return this.cycleScopedModel(direction);
    return this.cycleAvailableModel(direction);
  }
  async cycleScopedModel(direction) {
    const scopedModels = this.scopedModelEntries.filter((scoped) =>
      this.sessionModelRegistry.hasConfiguredAuth(scoped.model),
    );
    if (scopedModels.length <= 1) return;
    const currentModel = this.model;
    let currentIndex = scopedModels.findIndex((sm) => modelsAreEqual(sm.model, currentModel));
    if (currentIndex === -1) currentIndex = 0;
    const len = scopedModels.length;
    const nextIndex =
      direction === "forward" ? (currentIndex + 1) % len : (currentIndex - 1 + len) % len;
    const next = scopedModels.at(nextIndex);
    if (!next) throw new Error("Scoped model cycle produced an invalid index");
    const thinkingLevel = this.getThinkingLevelForModelSwitch(next.thinkingLevel);
    this.agent.state.model = next.model;
    this.sessionManager.appendModelChange(next.model.provider, next.model.id);
    this.settingsManager.setDefaultModelAndProvider(next.model.provider, next.model.id);
    this.setThinkingLevel(thinkingLevel);
    await this.emitModelSelect(next.model, currentModel, "cycle");
    return {
      model: next.model,
      thinkingLevel: this.thinkingLevel,
      isScoped: true,
    };
  }
  async cycleAvailableModel(direction) {
    const availableModels = this.sessionModelRegistry.getAvailable();
    if (availableModels.length <= 1) return;
    const currentModel = this.model;
    let currentIndex = availableModels.findIndex((m) => modelsAreEqual(m, currentModel));
    if (currentIndex === -1) currentIndex = 0;
    const len = availableModels.length;
    const nextIndex =
      direction === "forward" ? (currentIndex + 1) % len : (currentIndex - 1 + len) % len;
    const nextModel = availableModels.at(nextIndex);
    if (!nextModel) throw new Error("Available model cycle produced an invalid index");
    const thinkingLevel = this.getThinkingLevelForModelSwitch();
    this.agent.state.model = nextModel;
    this.sessionManager.appendModelChange(nextModel.provider, nextModel.id);
    this.settingsManager.setDefaultModelAndProvider(nextModel.provider, nextModel.id);
    this.setThinkingLevel(thinkingLevel);
    await this.emitModelSelect(nextModel, currentModel, "cycle");
    return {
      model: nextModel,
      thinkingLevel: this.thinkingLevel,
      isScoped: false,
    };
  }
  /**
   * Set thinking level.
   * Clamps to model capabilities based on available thinking levels.
   * Saves to session and settings only if the level actually changes.
   */
  setThinkingLevel(level) {
    const effectiveLevel = this.getAvailableThinkingLevels().includes(level)
      ? level
      : this.clampThinkingLevel(level);
    const previousLevel = this.agent.state.thinkingLevel;
    const isChanging = effectiveLevel !== previousLevel;
    this.agent.state.thinkingLevel = effectiveLevel;
    if (isChanging) {
      this.sessionManager.appendThinkingLevelChange(effectiveLevel);
      if (this.supportsThinking() || effectiveLevel !== "off")
        this.settingsManager.setDefaultThinkingLevel(effectiveLevel);
      this.emit({
        type: "thinking_level_changed",
        level: effectiveLevel,
      });
      this.currentExtensionRunner.emit({
        type: "thinking_level_select",
        level: effectiveLevel,
        previousLevel,
      });
    }
  }
  /**
   * Cycle to next thinking level.
   * @returns New level, or undefined if model doesn't support thinking
   */
  cycleThinkingLevel() {
    if (!this.supportsThinking()) return;
    const levels = this.getAvailableThinkingLevels();
    const nextIndex = (levels.indexOf(this.thinkingLevel) + 1) % levels.length;
    const nextLevel = levels.at(nextIndex);
    if (!nextLevel) return;
    this.setThinkingLevel(nextLevel);
    return nextLevel;
  }
  /**
   * Get available thinking levels for current model.
   * The provider will clamp to what the specific model supports internally.
   */
  getAvailableThinkingLevels() {
    if (!this.model) return THINKING_LEVELS;
    return getSupportedThinkingLevels(this.model);
  }
  /**
   * Check if current model supports thinking/reasoning.
   */
  supportsThinking() {
    return Boolean(this.model?.reasoning);
  }
  getThinkingLevelForModelSwitch(explicitLevel) {
    if (explicitLevel !== void 0) return explicitLevel;
    if (!this.supportsThinking()) return this.settingsManager.getDefaultThinkingLevel() ?? "medium";
    return this.thinkingLevel;
  }
  clampThinkingLevel(level) {
    return this.model ? clampThinkingLevel(this.model, level) : "off";
  }
  /**
   * Set steering message mode.
   * Saves to settings.
   */
  setSteeringMode(mode) {
    this.agent.steeringMode = mode;
    this.settingsManager.setSteeringMode(mode);
  }
  /**
   * Set follow-up message mode.
   * Saves to settings.
   */
  setFollowUpMode(mode) {
    this.agent.followUpMode = mode;
    this.settingsManager.setFollowUpMode(mode);
  }
  /**
   * Manually compact the session context.
   * Aborts current agent operation first.
   * @param customInstructions Optional instructions for the compaction summary
   */
  async compact(customInstructions) {
    return await this.runWithSessionWriteLock(
      async () => await this.compactWithSessionWriteLock(customInstructions),
    );
  }
  async compactWithSessionWriteLock(customInstructions) {
    this.disconnectFromAgent();
    await this.abort();
    this.compactionAbortController = new AbortController();
    this.emit({
      type: "compaction_start",
      reason: "manual",
    });
    try {
      const settings = this.settingsManager.getCompactionSettings();
      const outcome = await this.runCompactionWork({
        customInstructions,
        mode: "manual",
        settings,
        signal: this.compactionAbortController.signal,
      });
      if (outcome.status !== "compacted") throw new Error("Compaction cancelled");
      this.emit({
        type: "compaction_end",
        reason: "manual",
        result: outcome.result,
        aborted: false,
        willRetry: false,
      });
      return outcome.result;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const aborted =
        message === "Compaction cancelled" ||
        (error instanceof Error && error.name === "AbortError");
      this.emit({
        type: "compaction_end",
        reason: "manual",
        result: void 0,
        aborted,
        willRetry: false,
        errorMessage: aborted ? void 0 : `Compaction failed: ${message}`,
      });
      throw error;
    } finally {
      this.compactionAbortController = void 0;
      this.reconnectToAgent();
    }
  }
  /**
   * Cancel in-progress compaction (manual or auto).
   */
  abortCompaction() {
    this.compactionAbortController?.abort();
    this.autoCompactionAbortController?.abort();
  }
  /**
   * Cancel in-progress branch summarization.
   */
  abortBranchSummary() {
    this.branchSummaryAbortController?.abort();
  }
  async getAutoCompactionRequestAuth(model) {
    if (this.agent.streamFn !== streamSimple) return this.getCompactionRequestAuth(model);
    const authResult = await this.sessionModelRegistry.getApiKeyAndHeaders(model);
    if (!authResult.ok || !authResult.apiKey) return;
    return {
      apiKey: authResult.apiKey,
      headers: authResult.headers,
    };
  }
  async runCompactionWork(options) {
    const isManual = options.mode === "manual";
    if (!this.model) {
      if (isManual) throw new Error(formatNoModelSelectedMessage());
      return { status: "skipped" };
    }
    const auth = isManual
      ? await this.getCompactionRequestAuth(this.model)
      : await this.getAutoCompactionRequestAuth(this.model);
    if (!auth) return { status: "skipped" };
    const pathEntries = this.sessionManager.getBranch();
    const preparation = unwrapCoreResult(prepareCompaction$1(pathEntries, options.settings));
    if (!preparation) {
      if (isManual) {
        const lastEntry = pathEntries[pathEntries.length - 1];
        throw new Error(
          lastEntry?.type === "compaction"
            ? "Already compacted"
            : "Nothing to compact (session too small)",
        );
      }
      return { status: "skipped" };
    }
    let compactionResult;
    let fromExtension = false;
    if (this.currentExtensionRunner.hasHandlers("session_before_compact")) {
      const extensionResult = await this.currentExtensionRunner.emit({
        type: "session_before_compact",
        preparation,
        branchEntries: pathEntries,
        customInstructions: options.customInstructions,
        signal: options.signal,
      });
      if (extensionResult?.cancel) return { status: "aborted" };
      if (extensionResult?.compaction) {
        compactionResult = extensionResult.compaction;
        fromExtension = true;
      }
    }
    compactionResult ??= unwrapCoreResult(
      await compact$1(
        preparation,
        this.model,
        auth.apiKey,
        auth.headers,
        options.customInstructions,
        options.signal,
        this.thinkingLevel,
        this.agent.streamFn,
      ),
    );
    if (options.signal.aborted) return { status: "aborted" };
    this.sessionManager.appendCompaction(
      compactionResult.summary,
      compactionResult.firstKeptEntryId,
      compactionResult.tokensBefore,
      compactionResult.details,
      fromExtension,
    );
    const newEntries = this.sessionManager.getEntries();
    const sessionContext = this.sessionManager.buildSessionContext();
    this.agent.state.messages = sessionContext.messages;
    const savedCompactionEntry = newEntries.find(
      (e) => e.type === "compaction" && e.summary === compactionResult.summary,
    );
    if (this.currentExtensionRunner && savedCompactionEntry)
      await this.currentExtensionRunner.emit({
        type: "session_compact",
        compactionEntry: savedCompactionEntry,
        fromExtension,
      });
    return {
      status: "compacted",
      result: compactionResult,
    };
  }
  /**
   * Check if compaction is needed and run it.
   * Called after agent_end and before prompt submission.
   *
   * Two cases:
   * 1. Overflow: LLM returned context overflow error, remove error message from agent state, compact, auto-retry
   * 2. Threshold: Context over threshold, compact, NO auto-retry (user continues manually)
   *
   * @param assistantMessage The assistant message to check
   * @param skipAbortedCheck If false, include aborted messages (for pre-prompt check). Default: true
   */
  async checkCompaction(assistantMessage, skipAbortedCheck = true) {
    const settings = this.settingsManager.getCompactionSettings();
    if (!settings.enabled) return false;
    if (skipAbortedCheck && assistantMessage.stopReason === "aborted") return false;
    const contextWindow = this.model?.contextWindow ?? 0;
    const sameModel =
      this.model &&
      assistantMessage.provider === this.model.provider &&
      assistantMessage.model === this.model.id;
    const compactionEntry = getLatestCompactionEntry(this.sessionManager.getBranch());
    if (
      compactionEntry !== null &&
      assistantMessage.timestamp <= new Date(compactionEntry.timestamp).getTime()
    )
      return false;
    if (sameModel && isContextOverflow(assistantMessage, contextWindow)) {
      if (this.overflowRecoveryAttempted) {
        this.emit({
          type: "compaction_end",
          reason: "overflow",
          result: void 0,
          aborted: false,
          willRetry: false,
          errorMessage:
            "Context overflow recovery failed after one compact-and-retry attempt. Try reducing context or switching to a larger-context model.",
        });
        return false;
      }
      this.overflowRecoveryAttempted = true;
      const messages = this.agent.state.messages;
      if (messages.at(-1)?.role === "assistant") this.agent.state.messages = messages.slice(0, -1);
      return await this.runAutoCompaction("overflow", true);
    }
    let contextTokens;
    if (assistantMessage.stopReason === "error") {
      const messages = this.agent.state.messages;
      const estimate = estimateContextTokens(messages);
      if (estimate.lastUsageIndex === null) return false;
      const usageMsg = messages.at(estimate.lastUsageIndex);
      if (
        compactionEntry &&
        usageMsg?.role === "assistant" &&
        usageMsg.timestamp <= new Date(compactionEntry.timestamp).getTime()
      )
        return false;
      contextTokens = estimate.tokens;
    } else if (assistantMessage.usage.contextUsage?.state === "unavailable") {
      const estimatedContextTokens = this.getContextUsage()?.tokens;
      if (estimatedContextTokens == null) return false;
      contextTokens = estimatedContextTokens;
    } else contextTokens = calculateContextTokens(assistantMessage.usage);
    if (shouldCompact(contextTokens, contextWindow, settings))
      return await this.runAutoCompaction("threshold", false);
    return false;
  }
  /**
   * Internal: Run auto-compaction with events.
   */
  async runAutoCompaction(reason, willRetry) {
    const settings = this.settingsManager.getCompactionSettings();
    this.emit({
      type: "compaction_start",
      reason,
    });
    this.autoCompactionAbortController = new AbortController();
    try {
      const outcome = await this.runCompactionWork({
        mode: "auto",
        settings,
        signal: this.autoCompactionAbortController.signal,
      });
      if (outcome.status === "skipped") {
        this.emit({
          type: "compaction_end",
          reason,
          result: void 0,
          aborted: false,
          willRetry: false,
        });
        return false;
      }
      if (outcome.status === "aborted") {
        this.emit({
          type: "compaction_end",
          reason,
          result: void 0,
          aborted: true,
          willRetry: false,
        });
        return false;
      }
      this.emit({
        type: "compaction_end",
        reason,
        result: outcome.result,
        aborted: false,
        willRetry,
      });
      if (willRetry) {
        const messages = this.agent.state.messages;
        const lastMsg = messages[messages.length - 1];
        if (lastMsg?.role === "assistant" && lastMsg.stopReason === "error")
          this.agent.state.messages = messages.slice(0, -1);
        return true;
      }
      return this.agent.hasQueuedMessages();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "compaction failed";
      this.emit({
        type: "compaction_end",
        reason,
        result: void 0,
        aborted: false,
        willRetry: false,
        errorMessage:
          reason === "overflow"
            ? `Context overflow recovery failed: ${errorMessage}`
            : `Auto-compaction failed: ${errorMessage}`,
      });
      return false;
    } finally {
      this.autoCompactionAbortController = void 0;
    }
  }
  /**
   * Toggle auto-compaction setting.
   */
  setAutoCompactionEnabled(enabled) {
    this.settingsManager.setCompactionEnabled(enabled);
  }
  /** Whether auto-compaction is enabled */
  get autoCompactionEnabled() {
    return this.settingsManager.getCompactionEnabled();
  }
  async bindExtensions(bindings) {
    if (bindings.uiContext !== void 0) this.extensionUIContext = bindings.uiContext;
    if (bindings.commandContextActions !== void 0)
      this.extensionCommandContextActions = bindings.commandContextActions;
    if (bindings.abortHandler !== void 0) this.extensionAbortHandler = bindings.abortHandler;
    if (bindings.shutdownHandler !== void 0)
      this.extensionShutdownHandler = bindings.shutdownHandler;
    if (bindings.onError !== void 0) this.extensionErrorListener = bindings.onError;
    this.applyExtensionBindings(this.currentExtensionRunner);
    await this.currentExtensionRunner.emit(this.sessionStartEvent);
    await this.extendResourcesFromExtensions(
      this.sessionStartEvent.reason === "reload" ? "reload" : "startup",
    );
  }
  async extendResourcesFromExtensions(reason) {
    if (!this.currentExtensionRunner.hasHandlers("resources_discover")) return;
    const { skillPaths, promptPaths, themePaths } =
      await this.currentExtensionRunner.emitResourcesDiscover(this.cwd, reason);
    if (skillPaths.length === 0 && promptPaths.length === 0 && themePaths.length === 0) return;
    const extensionPaths = {
      skillPaths: this.buildExtensionResourcePaths(skillPaths),
      promptPaths: this.buildExtensionResourcePaths(promptPaths),
      themePaths: this.buildExtensionResourcePaths(themePaths),
    };
    this.sessionResourceLoader.extendResources(extensionPaths);
    this.baseSystemPrompt = this.rebuildSystemPrompt(this.getActiveToolNames());
    this.agent.state.systemPrompt = this.baseSystemPrompt;
  }
  buildExtensionResourcePaths(entries) {
    return entries.map((entry) => {
      const source = this.getExtensionSourceLabel(entry.extensionPath);
      const baseDir = entry.extensionPath.startsWith("<") ? void 0 : dirname(entry.extensionPath);
      return {
        path: entry.path,
        metadata: {
          source,
          scope: "temporary",
          origin: "top-level",
          baseDir,
        },
      };
    });
  }
  getExtensionSourceLabel(extensionPath) {
    if (extensionPath.startsWith("<")) return `extension:${extensionPath.replace(/[<>]/g, "")}`;
    return `extension:${basename(extensionPath).replace(/\.(ts|js)$/, "")}`;
  }
  applyExtensionBindings(runner) {
    runner.setUIContext(this.extensionUIContext);
    runner.bindCommandContext(this.extensionCommandContextActions);
    this.extensionErrorUnsubscriber?.();
    this.extensionErrorUnsubscriber = this.extensionErrorListener
      ? runner.onError(this.extensionErrorListener)
      : void 0;
  }
  refreshCurrentModelFromRegistry() {
    const currentModel = this.model;
    if (!currentModel) return;
    const refreshedModel = this.sessionModelRegistry.find(currentModel.provider, currentModel.id);
    if (!refreshedModel || refreshedModel === currentModel) return;
    this.agent.state.model = refreshedModel;
  }
  bindExtensionCore(runner) {
    const getCommands = () => {
      const extensionCommands = runner.getRegisteredCommands().map((command) => ({
        name: command.invocationName,
        description: command.description,
        source: "extension",
        sourceInfo: command.sourceInfo,
      }));
      const templates = this.promptTemplates.map((template) => ({
        name: template.name,
        description: template.description,
        source: "prompt",
        sourceInfo: template.sourceInfo,
      }));
      const skills = this.sessionResourceLoader.getSkills().skills.map((skill) => ({
        name: `skill:${skill.name}`,
        description: skill.description,
        source: "skill",
        sourceInfo: skill.sourceInfo,
      }));
      return [...extensionCommands, ...templates, ...skills];
    };
    runner.bindCore(
      {
        sendMessage: (message, options) => {
          this.sendCustomMessage(message, options).catch((err) => {
            runner.emitError({
              extensionPath: "<runtime>",
              event: "send_message",
              error: err instanceof Error ? err.message : String(err),
            });
          });
        },
        sendUserMessage: (content, options) => {
          this.sendUserMessage(content, options).catch((err) => {
            runner.emitError({
              extensionPath: "<runtime>",
              event: "send_user_message",
              error: err instanceof Error ? err.message : String(err),
            });
          });
        },
        appendEntry: (customType, data) => {
          this.sessionManager.appendCustomEntry(customType, data);
        },
        setSessionName: (name) => {
          this.setSessionName(name);
        },
        getSessionName: () => {
          return this.sessionManager.getSessionName();
        },
        setLabel: (entryId, label) => {
          this.sessionManager.appendLabelChange(entryId, label);
        },
        getActiveTools: () => this.getActiveToolNames(),
        getAllTools: () => this.getAllTools(),
        setActiveTools: (toolNames) => this.setActiveToolsByName(toolNames),
        refreshTools: () => this.refreshToolRegistry(),
        getCommands,
        setModel: async (model) => {
          if (!this.sessionModelRegistry.hasConfiguredAuth(model)) return false;
          await this.setModel(model);
          return true;
        },
        getThinkingLevel: () => this.thinkingLevel,
        setThinkingLevel: (level) => this.setThinkingLevel(level),
      },
      {
        getModel: () => this.model,
        isIdle: () => !this.isStreaming,
        getSignal: () => this.agent.signal,
        abort: () => {
          if (this.extensionAbortHandler) {
            this.extensionAbortHandler();
            return;
          }
          this.abort();
        },
        hasPendingMessages: () => this.pendingMessageCount > 0,
        shutdown: () => {
          this.extensionShutdownHandler?.();
        },
        getContextUsage: () => this.getContextUsage(),
        compact: (options) => {
          (async () => {
            try {
              const result = await this.compact(options?.customInstructions);
              options?.onComplete?.(result);
            } catch (error) {
              const err = error instanceof Error ? error : new Error(String(error));
              options?.onError?.(err);
            }
          })();
        },
        getSystemPrompt: () => this.systemPrompt,
      },
      {
        registerProvider: (name, config) => {
          this.sessionModelRegistry.registerProvider(name, config);
          this.refreshCurrentModelFromRegistry();
        },
        unregisterProvider: (name) => {
          this.sessionModelRegistry.unregisterProvider(name);
          this.refreshCurrentModelFromRegistry();
        },
      },
    );
  }
  refreshToolRegistry(options) {
    const previousRegistryNames = new Set(this.toolRegistry.keys());
    const previousActiveToolNames = this.getActiveToolNames();
    const allowedToolNames = this.allowedToolNames;
    const isDisabledBuiltInToolName = (name) =>
      this.disableBuiltInTools && this.baseToolDefinitions.has(name);
    const isAllowedTool = (name) =>
      !isDisabledBuiltInToolName(name) && (!allowedToolNames || allowedToolNames.has(name));
    const allCustomTools = [
      ...this.currentExtensionRunner.getAllRegisteredTools(),
      ...this.customTools.map((definition) => ({
        definition,
        sourceInfo: createSyntheticSourceInfo(`<sdk:${definition.name}>`, { source: "sdk" }),
      })),
    ].filter((tool) => isAllowedTool(tool.definition.name));
    const definitionRegistry = new Map(
      Array.from(this.baseToolDefinitions.entries())
        .filter(([name]) => isAllowedTool(name))
        .map(([name, definition]) => [
          name,
          {
            definition,
            sourceInfo: createSyntheticSourceInfo(`<builtin:${name}>`, { source: "builtin" }),
          },
        ]),
    );
    for (const tool of allCustomTools)
      definitionRegistry.set(tool.definition.name, {
        definition: tool.definition,
        sourceInfo: tool.sourceInfo,
      });
    this.toolDefinitions = definitionRegistry;
    this.toolPromptSnippets = new Map(
      Array.from(definitionRegistry.values())
        .map(({ definition }) => {
          const snippet = this.normalizePromptSnippet(definition.promptSnippet);
          return snippet ? [definition.name, snippet] : void 0;
        })
        .filter((entry) => entry !== void 0),
    );
    this.toolPromptGuidelines = new Map(
      Array.from(definitionRegistry.values())
        .map(({ definition }) => {
          const guidelines = this.normalizePromptGuidelines(definition.promptGuidelines);
          return guidelines.length > 0 ? [definition.name, guidelines] : void 0;
        })
        .filter((entry) => entry !== void 0),
    );
    const runner = this.currentExtensionRunner;
    const wrappedExtensionTools = wrapRegisteredTools(allCustomTools, runner);
    const wrappedBuiltInTools = wrapRegisteredTools(
      Array.from(this.baseToolDefinitions.values())
        .filter((definition) => isAllowedTool(definition.name))
        .map((definition) => ({
          definition,
          sourceInfo: createSyntheticSourceInfo(`<builtin:${definition.name}>`, {
            source: "builtin",
          }),
        })),
      runner,
    );
    const toolRegistry = new Map(wrappedBuiltInTools.map((tool) => [tool.name, tool]));
    for (const tool of wrappedExtensionTools) toolRegistry.set(tool.name, tool);
    this.toolRegistry = toolRegistry;
    const nextActiveToolNames = (
      options?.activeToolNames ? [...options.activeToolNames] : [...previousActiveToolNames]
    ).filter((name) => isAllowedTool(name));
    if (allowedToolNames) {
      for (const toolName of this.toolRegistry.keys())
        if (allowedToolNames.has(toolName)) nextActiveToolNames.push(toolName);
    } else if (options?.includeAllExtensionTools)
      for (const tool of wrappedExtensionTools) nextActiveToolNames.push(tool.name);
    else if (!options?.activeToolNames) {
      for (const toolName of this.toolRegistry.keys())
        if (!previousRegistryNames.has(toolName)) nextActiveToolNames.push(toolName);
    }
    this.setActiveToolsByName([...new Set(nextActiveToolNames)]);
  }
  buildRuntime(options) {
    const autoResizeImages = this.settingsManager.getImageAutoResize();
    const shellCommandPrefix = this.settingsManager.getShellCommandPrefix();
    const shellPath = this.settingsManager.getShellPath();
    const baseToolDefinitions = this.baseToolsOverride
      ? Object.fromEntries(
          Object.entries(this.baseToolsOverride).map(([name, tool]) => [
            name,
            createToolDefinitionFromAgentTool(tool),
          ]),
        )
      : createAllToolDefinitions(this.cwd, {
          read: { autoResizeImages },
          bash: {
            commandPrefix: shellCommandPrefix,
            shellPath,
          },
        });
    this.baseToolDefinitions = new Map(
      Object.entries(baseToolDefinitions).map(([name, tool]) => [name, tool]),
    );
    const extensionsResult = this.sessionResourceLoader.getExtensions();
    if (options.flagValues)
      for (const [name, value] of options.flagValues)
        extensionsResult.runtime.flagValues.set(name, value);
    this.currentExtensionRunner = new ExtensionRunner(
      extensionsResult.extensions,
      extensionsResult.runtime,
      this.cwd,
      this.sessionManager,
      this.sessionModelRegistry,
    );
    if (this.extensionRunnerRef) this.extensionRunnerRef.current = this.currentExtensionRunner;
    this.bindExtensionCore(this.currentExtensionRunner);
    this.applyExtensionBindings(this.currentExtensionRunner);
    const defaultActiveToolNames = this.baseToolsOverride
      ? Object.keys(this.baseToolsOverride)
      : ["read", "bash", "edit", "write"];
    const baseActiveToolNames = options.activeToolNames ?? defaultActiveToolNames;
    this.refreshToolRegistry({
      activeToolNames: baseActiveToolNames,
      includeAllExtensionTools: options.includeAllExtensionTools,
    });
  }
  async reload() {
    const previousFlagValues = this.currentExtensionRunner.getFlagValues();
    await emitSessionShutdownEvent(this.currentExtensionRunner, {
      type: "session_shutdown",
      reason: "reload",
    });
    await this.settingsManager.reload();
    resetApiProviders(defaultApiRegistry);
    await this.sessionResourceLoader.reload();
    this.buildRuntime({
      activeToolNames: this.getActiveToolNames(),
      flagValues: previousFlagValues,
      includeAllExtensionTools: true,
    });
    if (
      this.extensionUIContext ||
      this.extensionCommandContextActions ||
      this.extensionShutdownHandler ||
      this.extensionErrorListener
    ) {
      await this.currentExtensionRunner.emit({
        type: "session_start",
        reason: "reload",
      });
      await this.extendResourcesFromExtensions("reload");
    }
  }
  /**
   * Check if an error is retryable (overloaded, rate limit, server errors).
   * Context overflow errors are NOT retryable (handled by compaction instead).
   */
  isRetryableError(message) {
    if (message.stopReason !== "error" || !message.errorMessage) return false;
    if (isContextOverflow(message, this.model?.contextWindow ?? 0)) return false;
    return isRetryableAssistantError(message);
  }
  /**
   * Prepare a retryable error for continuation with exponential backoff.
   * @returns true if the caller should continue the agent, false otherwise
   */
  async prepareRetry(message) {
    const settings = this.settingsManager.getRetrySettings();
    if (!settings.enabled) return false;
    this.retryCount++;
    if (this.retryCount > settings.maxRetries) {
      this.retryCount--;
      return false;
    }
    const delayMs = settings.baseDelayMs * 2 ** (this.retryCount - 1);
    this.emit({
      type: "auto_retry_start",
      attempt: this.retryCount,
      maxAttempts: settings.maxRetries,
      delayMs,
      errorMessage: message.errorMessage || "Unknown error",
    });
    const messages = this.agent.state.messages;
    if (messages.at(-1)?.role === "assistant") this.agent.state.messages = messages.slice(0, -1);
    this.retryAbortController = new AbortController();
    try {
      await sleep(delayMs, this.retryAbortController.signal);
    } catch {
      const attempt = this.retryCount;
      this.retryCount = 0;
      this.emit({
        type: "auto_retry_end",
        success: false,
        attempt,
        finalError: "Retry cancelled",
      });
      return false;
    } finally {
      this.retryAbortController = void 0;
    }
    return true;
  }
  /**
   * Cancel in-progress retry.
   */
  abortRetry() {
    this.retryAbortController?.abort();
  }
  /** Whether auto-retry is currently in progress */
  get isRetrying() {
    return this.retryAbortController !== void 0;
  }
  /** Whether auto-retry is enabled */
  get autoRetryEnabled() {
    return this.settingsManager.getRetryEnabled();
  }
  /**
   * Toggle auto-retry setting.
   */
  setAutoRetryEnabled(enabled) {
    this.settingsManager.setRetryEnabled(enabled);
  }
  /**
   * Execute a bash command.
   * Adds result to agent context and session.
   * @param command The bash command to execute
   * @param onChunk Optional streaming callback for output
   * @param options.excludeFromContext If true, command output won't be sent to LLM (!! prefix)
   * @param options.operations Custom BashOperations for remote execution
   */
  async executeBash(command, onChunk, options) {
    this.bashAbortController = new AbortController();
    const prefix = this.settingsManager.getShellCommandPrefix();
    const shellPath = this.settingsManager.getShellPath();
    const resolvedCommand = prefix ? `${prefix}\n${command}` : command;
    try {
      const result = await executeBashWithOperations(
        resolvedCommand,
        this.sessionManager.getCwd(),
        options?.operations ?? createLocalBashOperations({ shellPath }),
        {
          onChunk,
          signal: this.bashAbortController.signal,
        },
      );
      this.recordBashResult(command, result, options);
      return result;
    } finally {
      this.bashAbortController = void 0;
    }
  }
  /**
   * Record a bash execution result in session history.
   * Used by executeBash and by extensions that handle bash execution themselves.
   */
  recordBashResult(command, result, options) {
    const bashMessage = {
      role: "bashExecution",
      command,
      output: result.output,
      exitCode: result.exitCode,
      cancelled: result.cancelled,
      truncated: result.truncated,
      fullOutputPath: result.fullOutputPath,
      timestamp: Date.now(),
      excludeFromContext: options?.excludeFromContext,
    };
    if (this.isStreaming) this.pendingBashMessages.push(bashMessage);
    else {
      this.agent.state.messages.push(bashMessage);
      this.sessionManager.appendMessage(bashMessage);
    }
  }
  /**
   * Cancel running bash command.
   */
  abortBash() {
    this.bashAbortController?.abort();
  }
  /** Whether a bash command is currently running */
  get isBashRunning() {
    return this.bashAbortController !== void 0;
  }
  /** Whether there are pending bash messages waiting to be flushed */
  get hasPendingBashMessages() {
    return this.pendingBashMessages.length > 0;
  }
  /**
   * Flush pending bash messages to agent state and session.
   * Called after agent turn completes to maintain proper message ordering.
   */
  flushPendingBashMessages() {
    if (this.pendingBashMessages.length === 0) return;
    for (const bashMessage of this.pendingBashMessages) {
      this.agent.state.messages.push(bashMessage);
      this.sessionManager.appendMessage(bashMessage);
    }
    this.pendingBashMessages = [];
  }
  /**
   * Set a display name for the current session.
   */
  setSessionName(name) {
    this.sessionManager.appendSessionInfo(name);
    this.emit({
      type: "session_info_changed",
      name: this.sessionManager.getSessionName(),
    });
  }
  /**
   * Navigate to a different node in the session tree.
   * Unlike fork() which creates a new session file, this stays in the same file.
   *
   * @param targetId The entry ID to navigate to
   * @param options.summarize Whether user wants to summarize abandoned branch
   * @param options.customInstructions Custom instructions for summarizer
   * @param options.replaceInstructions If true, customInstructions replaces the default prompt
   * @param options.label Label to attach to the branch summary entry
   * @returns Result with editorText (if user message) and cancelled status
   */
  async navigateTree(targetId, options = {}) {
    const oldLeafId = this.sessionManager.getLeafId();
    if (targetId === oldLeafId) return { cancelled: false };
    if (options.summarize && !this.model) throw new Error("No model available for summarization");
    const targetEntry = this.sessionManager.getEntry(targetId);
    if (!targetEntry) throw new Error(`Entry ${targetId} not found`);
    const { entries: entriesToSummarize, commonAncestorId } = oldLeafId
      ? collectEntriesForBranchSummaryFromBranches(
          this.sessionManager.getBranch(oldLeafId),
          this.sessionManager.getBranch(targetId),
        )
      : {
          entries: [],
          commonAncestorId: null,
        };
    let customInstructions = options.customInstructions;
    let replaceInstructions = options.replaceInstructions;
    let label = options.label;
    const preparation = {
      targetId,
      oldLeafId,
      commonAncestorId,
      entriesToSummarize,
      userWantsSummary: options.summarize ?? false,
      customInstructions,
      replaceInstructions,
      label,
    };
    this.branchSummaryAbortController = new AbortController();
    try {
      let extensionSummary;
      let fromExtension = false;
      if (this.currentExtensionRunner.hasHandlers("session_before_tree")) {
        const result = await this.currentExtensionRunner.emit({
          type: "session_before_tree",
          preparation,
          signal: this.branchSummaryAbortController.signal,
        });
        if (result?.cancel) return { cancelled: true };
        if (result?.summary && options.summarize) {
          extensionSummary = result.summary;
          fromExtension = true;
        }
        if (result?.customInstructions !== void 0) customInstructions = result.customInstructions;
        if (result?.replaceInstructions !== void 0)
          replaceInstructions = result.replaceInstructions;
        if (result?.label !== void 0) label = result.label;
      }
      let summaryText;
      let summaryDetails;
      if (options.summarize && entriesToSummarize.length > 0 && !extensionSummary) {
        const model = this.model;
        const { apiKey, headers } = await this.getRequiredRequestAuth(model);
        const branchSummarySettings = this.settingsManager.getBranchSummarySettings();
        const result = normalizeBranchSummaryResult(
          await generateBranchSummary$1(entriesToSummarize, {
            model,
            apiKey,
            headers,
            signal: this.branchSummaryAbortController.signal,
            customInstructions,
            replaceInstructions,
            reserveTokens: branchSummarySettings.reserveTokens,
            streamFn: this.agent.streamFn,
          }),
        );
        if (result.aborted)
          return {
            cancelled: true,
            aborted: true,
          };
        if (result.error) throw new Error(result.error);
        summaryText = result.summary;
        summaryDetails = {
          readFiles: result.readFiles || [],
          modifiedFiles: result.modifiedFiles || [],
        };
      } else if (extensionSummary) {
        summaryText = extensionSummary.summary;
        summaryDetails = extensionSummary.details;
      }
      let newLeafId;
      let editorText;
      if (targetEntry.type === "message" && targetEntry.message.role === "user") {
        newLeafId = targetEntry.parentId;
        editorText = this.extractUserMessageText(targetEntry.message.content);
      } else if (targetEntry.type === "custom_message") {
        newLeafId = targetEntry.parentId;
        editorText =
          typeof targetEntry.content === "string"
            ? targetEntry.content
            : targetEntry.content
                .filter((c) => c.type === "text")
                .map((c) => c.text)
                .join("");
      } else newLeafId = targetId;
      let summaryEntry;
      if (summaryText) {
        const summaryId = this.sessionManager.branchWithSummary(
          newLeafId,
          summaryText,
          summaryDetails,
          fromExtension,
        );
        summaryEntry = this.sessionManager.getEntry(summaryId);
        if (label) this.sessionManager.appendLabelChange(summaryId, label);
      } else if (newLeafId === null) this.sessionManager.resetLeaf();
      else this.sessionManager.branch(newLeafId);
      if (label && !summaryText) this.sessionManager.appendLabelChange(targetId, label);
      const sessionContext = this.sessionManager.buildSessionContext();
      this.agent.state.messages = sessionContext.messages;
      await this.currentExtensionRunner.emit({
        type: "session_tree",
        newLeafId: this.sessionManager.getLeafId(),
        oldLeafId,
        summaryEntry,
        fromExtension: summaryText ? fromExtension : void 0,
      });
      return {
        editorText,
        cancelled: false,
        summaryEntry,
      };
    } finally {
      this.branchSummaryAbortController = void 0;
    }
  }
  /**
   * Get all user messages from session for fork selector.
   */
  getUserMessagesForForking() {
    const entries = this.sessionManager.getEntries();
    const result = [];
    for (const entry of entries) {
      if (entry.type !== "message") continue;
      if (entry.message.role !== "user") continue;
      const text = this.extractUserMessageText(entry.message.content);
      if (text)
        result.push({
          entryId: entry.id,
          text,
        });
    }
    return result;
  }
  extractUserMessageText(content) {
    if (typeof content === "string") return content;
    if (Array.isArray(content))
      return content
        .filter((c) => c.type === "text")
        .map((c) => c.text)
        .join("");
    return "";
  }
  /**
   * Get session statistics.
   */
  getSessionStats() {
    const state = this.state;
    const userMessages = state.messages.filter((m) => m.role === "user").length;
    const assistantMessages = state.messages.filter((m) => m.role === "assistant").length;
    const toolResults = state.messages.filter((m) => m.role === "toolResult").length;
    let toolCalls = 0;
    let totalInput = 0;
    let totalOutput = 0;
    let totalCacheRead = 0;
    let totalCacheWrite = 0;
    let totalCost = 0;
    for (const message of state.messages)
      if (message.role === "assistant") {
        const assistantMsg = message;
        toolCalls += assistantMsg.content.filter((c) => c.type === "toolCall").length;
        totalInput += assistantMsg.usage.input;
        totalOutput += assistantMsg.usage.output;
        totalCacheRead += assistantMsg.usage.cacheRead;
        totalCacheWrite += assistantMsg.usage.cacheWrite;
        totalCost += assistantMsg.usage.cost.total;
      }
    return {
      sessionFile: this.sessionFile,
      sessionId: this.sessionId,
      userMessages,
      assistantMessages,
      toolCalls,
      toolResults,
      totalMessages: state.messages.length,
      tokens: {
        input: totalInput,
        output: totalOutput,
        cacheRead: totalCacheRead,
        cacheWrite: totalCacheWrite,
        total: totalInput + totalOutput + totalCacheRead + totalCacheWrite,
      },
      cost: totalCost,
      contextUsage: this.getContextUsage(),
    };
  }
  getContextUsage() {
    const model = this.model;
    if (!model) return;
    const contextWindow = model.contextWindow ?? 0;
    if (contextWindow <= 0) return;
    const branchEntries = this.sessionManager.getBranch();
    const latestCompaction = getLatestCompactionEntry(branchEntries);
    let estimateFromContent = false;
    if (latestCompaction) {
      const compactionIndex = branchEntries.lastIndexOf(latestCompaction);
      let hasPostCompactionUsage = false;
      for (const entry of branchEntries.slice(compactionIndex + 1).toReversed())
        if (entry.type === "message" && entry.message.role === "assistant") {
          const assistant = entry.message;
          if (assistant.stopReason !== "aborted" && assistant.stopReason !== "error") {
            if (assistant.usage.contextUsage?.state === "unavailable") {
              estimateFromContent = true;
              continue;
            }
            if (calculateContextTokens(assistant.usage) > 0) {
              hasPostCompactionUsage = true;
              estimateFromContent = false;
            }
            break;
          }
        }
      if (!hasPostCompactionUsage && !estimateFromContent)
        return {
          tokens: null,
          contextWindow,
          percent: null,
        };
    }
    const tokens = estimateFromContent
      ? estimateMessagesFromContent(this.messages)
      : estimateContextTokens(this.messages).tokens;
    return {
      tokens,
      contextWindow,
      percent: (tokens / contextWindow) * 100,
    };
  }
  /**
   * @deprecated Use the OpenClaw session export command instead.
   * @param outputPath Optional output path (defaults to session directory)
   * @returns Path to exported file
   */
  async exportToHtml(_outputPath) {
    throw new Error(
      "AgentSession.exportToHtml is deprecated; use the OpenClaw session export command.",
    );
  }
  /**
   * Export the current session branch to a JSONL file.
   * Writes the session header followed by all entries on the current branch path.
   * @param outputPath Target file path. If omitted, generates a timestamped file in cwd.
   * @returns The resolved output file path.
   */
  exportToJsonl(outputPath) {
    const filePath = resolve(
      outputPath ??
        `session-${/* @__PURE__ */ new Date().toISOString().replace(/[:.]/g, "-")}.jsonl`,
    );
    const dir = dirname(filePath);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    const header = {
      type: "session",
      version: 3,
      id: this.sessionManager.getSessionId(),
      timestamp: /* @__PURE__ */ new Date().toISOString(),
      cwd: this.sessionManager.getCwd(),
    };
    const branchEntries = this.sessionManager.getBranch();
    const lines = [JSON.stringify(header)];
    let prevId = null;
    for (const entry of branchEntries) {
      const linear = {
        ...entry,
        parentId: prevId,
      };
      lines.push(JSON.stringify(linear));
      prevId = entry.id;
    }
    writeFileSync(filePath, `${lines.join("\n")}\n`);
    return filePath;
  }
  /**
   * Get text content of last assistant message.
   * Useful for /copy command.
   * @returns Text content, or undefined if no assistant message exists
   */
  getLastAssistantText() {
    const lastAssistant = this.messages
      .slice()
      .toReversed()
      .find((m) => {
        if (m.role !== "assistant") return false;
        const content = m.content;
        if (m.stopReason === "aborted" && !hasPersistedAssistantContent(content)) return false;
        return true;
      });
    if (!lastAssistant) return;
    const content = lastAssistant.content;
    return extractPersistedAssistantText(content).trim() || void 0;
  }
  createReplacedSessionContext() {
    const context = Object.defineProperties(
      {},
      Object.getOwnPropertyDescriptors(this.currentExtensionRunner.createCommandContext()),
    );
    context.sendMessage = (message, options) => this.sendCustomMessage(message, options);
    context.sendUserMessage = (content, options) => this.sendUserMessage(content, options);
    return context;
  }
  /**
   * Check if extensions have handlers for a specific event type.
   */
  hasExtensionHandlers(eventType) {
    return this.currentExtensionRunner.hasHandlers(eventType);
  }
  /**
   * Get the extension runner (for setting UI context and error handlers).
   */
  get extensionRunner() {
    return this.currentExtensionRunner;
  }
};
//#endregion
//#region src/agents/sessions/session-cwd.ts
/**
 * Missing session cwd detection.
 *
 * Helps resume flows decide whether to stop, prompt, or continue in the current process cwd.
 */
/** Returns a cwd issue for persisted sessions whose stored cwd has disappeared. */
function getMissingSessionCwdIssue(sessionManager, fallbackCwd) {
  const sessionFile = sessionManager.getSessionFile();
  if (!sessionFile) return;
  const sessionCwd = sessionManager.getCwd();
  if (!sessionCwd || existsSync(sessionCwd)) return;
  return {
    sessionFile,
    sessionCwd,
    fallbackCwd,
  };
}
/** Formats the terminal error shown when resume cannot safely use the stored cwd. */
function formatMissingSessionCwdError(issue) {
  const sessionFile = issue.sessionFile ? `\nSession file: ${issue.sessionFile}` : "";
  return `Stored session working directory does not exist: ${issue.sessionCwd}${sessionFile}\nCurrent working directory: ${issue.fallbackCwd}`;
}
/** Error wrapper that preserves the missing-cwd facts for UI and recovery code. */
var MissingSessionCwdError = class extends Error {
  constructor(issue) {
    super(formatMissingSessionCwdError(issue));
    this.name = "MissingSessionCwdError";
    this.issue = issue;
  }
};
/** Throws when a persisted session cwd is missing and the caller does not handle prompts. */
function assertSessionCwdExists(sessionManager, fallbackCwd) {
  const issue = getMissingSessionCwdIssue(sessionManager, fallbackCwd);
  if (issue) throw new MissingSessionCwdError(issue);
}
//#endregion
//#region src/agents/sessions/resource-loader.ts
/**
 * Session resource loader.
 *
 * Loads extensions, skills, prompts, themes, AGENTS files, and system prompt fragments for a cwd.
 */
function resolvePromptInput(input, description) {
  if (!input) return;
  if (existsSync(input))
    try {
      return readFileSync(input, "utf-8");
    } catch (error) {
      console.error(
        chalk.yellow(`Warning: Could not read ${description} file ${input}: ${String(error)}`),
      );
      return input;
    }
  return input;
}
function loadContextFileFromDir(dir) {
  for (const filename of ["AGENTS.md", "AGENTS.MD", "CLAUDE.md", "CLAUDE.MD"]) {
    const filePath = join(dir, filename);
    if (existsSync(filePath))
      try {
        return {
          path: filePath,
          content: readFileSync(filePath, "utf-8"),
        };
      } catch (error) {
        console.error(chalk.yellow(`Warning: Could not read ${filePath}: ${String(error)}`));
      }
  }
  return null;
}
function loadProjectContextFiles(options) {
  const resolvedCwd = options.cwd;
  const resolvedAgentDir = options.agentDir;
  const contextFiles = [];
  const seenPaths = /* @__PURE__ */ new Set();
  const globalContext = loadContextFileFromDir(resolvedAgentDir);
  if (globalContext) {
    contextFiles.push(globalContext);
    seenPaths.add(globalContext.path);
  }
  const ancestorContextFiles = [];
  let currentDir = resolvedCwd;
  const root = resolve("/");
  while (true) {
    const contextFile = loadContextFileFromDir(currentDir);
    if (contextFile && !seenPaths.has(contextFile.path)) {
      ancestorContextFiles.unshift(contextFile);
      seenPaths.add(contextFile.path);
    }
    if (currentDir === root) break;
    const parentDir = resolve(currentDir, "..");
    if (parentDir === currentDir) break;
    currentDir = parentDir;
  }
  contextFiles.push(...ancestorContextFiles);
  return contextFiles;
}
var DefaultResourceLoader = class {
  constructor(options) {
    this.cwd = options.cwd;
    this.agentDir = options.agentDir;
    this.settingsManager =
      options.settingsManager ?? SettingsManager.create(this.cwd, this.agentDir);
    this.eventBus = options.eventBus ?? createEventBus();
    this.packageManager = new DefaultPackageManager({
      cwd: this.cwd,
      agentDir: this.agentDir,
      settingsManager: this.settingsManager,
    });
    this.additionalExtensionPaths = options.additionalExtensionPaths ?? [];
    this.additionalSkillPaths = options.additionalSkillPaths ?? [];
    this.additionalPromptTemplatePaths = options.additionalPromptTemplatePaths ?? [];
    this.additionalThemePaths = options.additionalThemePaths ?? [];
    this.extensionFactories = options.extensionFactories ?? [];
    this.noExtensions = options.noExtensions ?? false;
    this.noSkills = options.noSkills ?? false;
    this.noPromptTemplates = options.noPromptTemplates ?? false;
    this.noThemes = options.noThemes ?? false;
    this.noContextFiles = options.noContextFiles ?? false;
    this.systemPromptSource = options.systemPrompt;
    this.appendSystemPromptSource = options.appendSystemPrompt;
    this.extensionsOverride = options.extensionsOverride;
    this.skillsOverride = options.skillsOverride;
    this.promptsOverride = options.promptsOverride;
    this.themesOverride = options.themesOverride;
    this.agentsFilesOverride = options.agentsFilesOverride;
    this.systemPromptTransform = options.systemPromptTransform ?? options.systemPromptOverride;
    this.appendSystemPromptTransform =
      options.appendSystemPromptTransform ?? options.appendSystemPromptOverride;
    this.extensionsResult = {
      extensions: [],
      errors: [],
      runtime: createExtensionRuntime(),
    };
    this.skills = [];
    this.skillDiagnostics = [];
    this.prompts = [];
    this.promptDiagnostics = [];
    this.themes = [];
    this.themeDiagnostics = [];
    this.agentsFiles = [];
    this.appendSystemPrompt = [];
    this.lastSkillPaths = [];
    this.extensionSkillSourceInfos = /* @__PURE__ */ new Map();
    this.extensionPromptSourceInfos = /* @__PURE__ */ new Map();
    this.extensionThemeSourceInfos = /* @__PURE__ */ new Map();
    this.lastPromptPaths = [];
    this.lastThemePaths = [];
  }
  getExtensions() {
    return this.extensionsResult;
  }
  getSkills() {
    return {
      skills: this.skills,
      diagnostics: this.skillDiagnostics,
    };
  }
  getPrompts() {
    return {
      prompts: this.prompts,
      diagnostics: this.promptDiagnostics,
    };
  }
  getThemes() {
    return {
      themes: this.themes,
      diagnostics: this.themeDiagnostics,
    };
  }
  getAgentsFiles() {
    return { agentsFiles: this.agentsFiles };
  }
  getSystemPrompt() {
    return this.systemPrompt;
  }
  getAppendSystemPrompt() {
    return this.appendSystemPrompt;
  }
  extendResources(paths) {
    const skillPaths = this.normalizeExtensionPaths(paths.skillPaths ?? []);
    const promptPaths = this.normalizeExtensionPaths(paths.promptPaths ?? []);
    const themePaths = this.normalizeExtensionPaths(paths.themePaths ?? []);
    for (const entry of skillPaths)
      this.extensionSkillSourceInfos.set(entry.path, createSourceInfo(entry.path, entry.metadata));
    for (const entry of promptPaths)
      this.extensionPromptSourceInfos.set(entry.path, createSourceInfo(entry.path, entry.metadata));
    for (const entry of themePaths)
      this.extensionThemeSourceInfos.set(entry.path, createSourceInfo(entry.path, entry.metadata));
    if (skillPaths.length > 0) {
      this.lastSkillPaths = this.mergePaths(
        this.lastSkillPaths,
        skillPaths.map((entry) => entry.path),
      );
      this.updateSkillsFromPaths(this.lastSkillPaths);
    }
    if (promptPaths.length > 0) {
      this.lastPromptPaths = this.mergePaths(
        this.lastPromptPaths,
        promptPaths.map((entry) => entry.path),
      );
      this.updatePromptsFromPaths(this.lastPromptPaths);
    }
    if (themePaths.length > 0) {
      this.lastThemePaths = this.mergePaths(
        this.lastThemePaths,
        themePaths.map((entry) => entry.path),
      );
      this.updateThemesFromPaths(this.lastThemePaths);
    }
  }
  async reload() {
    await this.settingsManager.reload();
    const resolvedPaths = await this.packageManager.resolve();
    const cliExtensionPaths = await this.packageManager.resolveExtensionSources(
      this.additionalExtensionPaths,
      { temporary: true },
    );
    const metadataByPath = /* @__PURE__ */ new Map();
    this.extensionSkillSourceInfos = /* @__PURE__ */ new Map();
    this.extensionPromptSourceInfos = /* @__PURE__ */ new Map();
    this.extensionThemeSourceInfos = /* @__PURE__ */ new Map();
    const getEnabledResources = (resources) => {
      for (const r of resources)
        if (!metadataByPath.has(r.path)) metadataByPath.set(r.path, r.metadata);
      return resources.filter((r) => r.enabled);
    };
    const getEnabledPaths = (resources) => getEnabledResources(resources).map((r) => r.path);
    const enabledExtensions = getEnabledPaths(resolvedPaths.extensions);
    const enabledSkillResources = getEnabledResources(resolvedPaths.skills);
    const enabledPrompts = getEnabledPaths(resolvedPaths.prompts);
    const enabledThemes = getEnabledPaths(resolvedPaths.themes);
    const mapSkillPath = (resource) => {
      if (resource.metadata.source !== "auto" && resource.metadata.origin !== "package")
        return resource.path;
      try {
        if (!statSync(resource.path).isDirectory()) return resource.path;
      } catch {
        return resource.path;
      }
      const skillFile = join(resource.path, "SKILL.md");
      if (existsSync(skillFile)) {
        if (!metadataByPath.has(skillFile)) metadataByPath.set(skillFile, resource.metadata);
        return skillFile;
      }
      return resource.path;
    };
    const enabledSkills = enabledSkillResources.map(mapSkillPath);
    for (const r of cliExtensionPaths.extensions)
      if (!metadataByPath.has(r.path))
        metadataByPath.set(r.path, {
          source: "cli",
          scope: "temporary",
          origin: "top-level",
        });
    for (const r of cliExtensionPaths.skills)
      if (!metadataByPath.has(r.path))
        metadataByPath.set(r.path, {
          source: "cli",
          scope: "temporary",
          origin: "top-level",
        });
    const cliEnabledExtensions = getEnabledPaths(cliExtensionPaths.extensions);
    const cliEnabledSkills = getEnabledPaths(cliExtensionPaths.skills);
    const cliEnabledPrompts = getEnabledPaths(cliExtensionPaths.prompts);
    const cliEnabledThemes = getEnabledPaths(cliExtensionPaths.themes);
    const extensionsResult = await loadExtensions(
      this.noExtensions
        ? cliEnabledExtensions
        : this.mergePaths(cliEnabledExtensions, enabledExtensions),
      this.cwd,
      this.eventBus,
    );
    const inlineExtensions = await this.loadExtensionFactories(extensionsResult.runtime);
    extensionsResult.extensions.push(...inlineExtensions.extensions);
    extensionsResult.errors.push(...inlineExtensions.errors);
    const conflicts = this.detectExtensionConflicts(extensionsResult.extensions);
    for (const conflict of conflicts)
      extensionsResult.errors.push({
        path: conflict.path,
        error: conflict.message,
      });
    for (const p of this.additionalExtensionPaths)
      if (isLocalPath(p) && !existsSync(p))
        extensionsResult.errors.push({
          path: p,
          error: `Extension path does not exist: ${p}`,
        });
    this.extensionsResult = this.extensionsOverride
      ? this.extensionsOverride(extensionsResult)
      : extensionsResult;
    this.applyExtensionSourceInfo(this.extensionsResult.extensions, metadataByPath);
    const skillPaths = this.noSkills
      ? this.mergePaths(cliEnabledSkills, this.additionalSkillPaths)
      : this.mergePaths([...cliEnabledSkills, ...enabledSkills], this.additionalSkillPaths);
    this.lastSkillPaths = skillPaths;
    this.updateSkillsFromPaths(skillPaths, metadataByPath);
    for (const p of this.additionalSkillPaths)
      if (isLocalPath(p) && !existsSync(p) && !this.skillDiagnostics.some((d) => d.path === p))
        this.skillDiagnostics.push({
          type: "error",
          message: "Skill path does not exist",
          path: p,
        });
    const promptPaths = this.noPromptTemplates
      ? this.mergePaths(cliEnabledPrompts, this.additionalPromptTemplatePaths)
      : this.mergePaths(
          [...cliEnabledPrompts, ...enabledPrompts],
          this.additionalPromptTemplatePaths,
        );
    this.lastPromptPaths = promptPaths;
    this.updatePromptsFromPaths(promptPaths, metadataByPath);
    for (const p of this.additionalPromptTemplatePaths)
      if (isLocalPath(p) && !existsSync(p) && !this.promptDiagnostics.some((d) => d.path === p))
        this.promptDiagnostics.push({
          type: "error",
          message: "Prompt template path does not exist",
          path: p,
        });
    const themePaths = this.noThemes
      ? this.mergePaths(cliEnabledThemes, this.additionalThemePaths)
      : this.mergePaths([...cliEnabledThemes, ...enabledThemes], this.additionalThemePaths);
    this.lastThemePaths = themePaths;
    this.updateThemesFromPaths(themePaths, metadataByPath);
    for (const p of this.additionalThemePaths)
      if (!existsSync(p) && !this.themeDiagnostics.some((d) => d.path === p))
        this.themeDiagnostics.push({
          type: "error",
          message: "Theme path does not exist",
          path: p,
        });
    const agentsFiles = {
      agentsFiles: this.noContextFiles
        ? []
        : loadProjectContextFiles({
            cwd: this.cwd,
            agentDir: this.agentDir,
          }),
    };
    const resolvedAgentsFiles = this.agentsFilesOverride
      ? this.agentsFilesOverride(agentsFiles)
      : agentsFiles;
    this.agentsFiles = resolvedAgentsFiles.agentsFiles;
    const baseSystemPrompt = resolvePromptInput(
      this.systemPromptSource ?? this.discoverSystemPromptFile(),
      "system prompt",
    );
    this.systemPrompt = this.systemPromptTransform
      ? this.systemPromptTransform(baseSystemPrompt)
      : baseSystemPrompt;
    const baseAppend = (
      this.appendSystemPromptSource ??
      (this.discoverAppendSystemPromptFile() ? [this.discoverAppendSystemPromptFile()] : [])
    )
      .map((s) => resolvePromptInput(s, "append system prompt"))
      .filter((s) => s !== void 0);
    this.appendSystemPrompt = this.appendSystemPromptTransform
      ? this.appendSystemPromptTransform(baseAppend)
      : baseAppend;
  }
  normalizeExtensionPaths(entries) {
    return entries.map((entry) => ({
      path: this.resolveResourcePath(entry.path),
      metadata: entry.metadata,
    }));
  }
  updateSkillsFromPaths(skillPaths, metadataByPath) {
    let skillsResult;
    if (this.noSkills && skillPaths.length === 0)
      skillsResult = {
        skills: [],
        diagnostics: [],
      };
    else
      skillsResult = loadSkills({
        cwd: this.cwd,
        agentDir: this.agentDir,
        skillPaths,
        includeDefaults: false,
      });
    const resolvedSkills = this.skillsOverride ? this.skillsOverride(skillsResult) : skillsResult;
    this.skills = resolvedSkills.skills.map((skill) => ({
      ...skill,
      sourceInfo:
        this.findSourceInfoForPath(
          skill.filePath,
          this.extensionSkillSourceInfos,
          metadataByPath,
        ) ??
        skill.sourceInfo ??
        this.getDefaultSourceInfoForPath(skill.filePath),
    }));
    this.skillDiagnostics = resolvedSkills.diagnostics;
  }
  updatePromptsFromPaths(promptPaths, metadataByPath) {
    let promptsResult;
    if (this.noPromptTemplates && promptPaths.length === 0)
      promptsResult = {
        prompts: [],
        diagnostics: [],
      };
    else {
      const allPrompts = loadPromptTemplates({
        cwd: this.cwd,
        agentDir: this.agentDir,
        promptPaths,
        includeDefaults: false,
      });
      promptsResult = this.dedupePrompts(allPrompts);
    }
    const resolvedPrompts = this.promptsOverride
      ? this.promptsOverride(promptsResult)
      : promptsResult;
    this.prompts = resolvedPrompts.prompts.map((prompt) => ({
      ...prompt,
      sourceInfo:
        this.findSourceInfoForPath(
          prompt.filePath,
          this.extensionPromptSourceInfos,
          metadataByPath,
        ) ??
        prompt.sourceInfo ??
        this.getDefaultSourceInfoForPath(prompt.filePath),
    }));
    this.promptDiagnostics = resolvedPrompts.diagnostics;
  }
  updateThemesFromPaths(themePaths, metadataByPath) {
    let themesResult;
    if (this.noThemes && themePaths.length === 0)
      themesResult = {
        themes: [],
        diagnostics: [],
      };
    else {
      const loaded = this.loadThemes(themePaths, false);
      const deduped = this.dedupeThemes(loaded.themes);
      themesResult = {
        themes: deduped.themes,
        diagnostics: [...loaded.diagnostics, ...deduped.diagnostics],
      };
    }
    const resolvedThemes = this.themesOverride ? this.themesOverride(themesResult) : themesResult;
    this.themes = resolvedThemes.themes.map((theme) => {
      const sourcePath = theme.sourcePath;
      theme.sourceInfo = sourcePath
        ? (this.findSourceInfoForPath(sourcePath, this.extensionThemeSourceInfos, metadataByPath) ??
          theme.sourceInfo ??
          this.getDefaultSourceInfoForPath(sourcePath))
        : theme.sourceInfo;
      return theme;
    });
    this.themeDiagnostics = resolvedThemes.diagnostics;
  }
  applyExtensionSourceInfo(extensions, metadataByPath) {
    for (const extension of extensions) {
      extension.sourceInfo =
        this.findSourceInfoForPath(extension.path, void 0, metadataByPath) ??
        this.getDefaultSourceInfoForPath(extension.path);
      for (const command of extension.commands.values()) command.sourceInfo = extension.sourceInfo;
      for (const tool of extension.tools.values()) tool.sourceInfo = extension.sourceInfo;
    }
  }
  findSourceInfoForPath(resourcePath, extraSourceInfos, metadataByPath) {
    if (!resourcePath) return;
    if (resourcePath.startsWith("<")) return this.getDefaultSourceInfoForPath(resourcePath);
    const normalizedResourcePath = resolve(resourcePath);
    if (extraSourceInfos)
      for (const [sourcePath, sourceInfo] of extraSourceInfos.entries()) {
        const normalizedSourcePath = resolve(sourcePath);
        if (
          normalizedResourcePath === normalizedSourcePath ||
          normalizedResourcePath.startsWith(`${normalizedSourcePath}${sep}`)
        )
          return {
            ...sourceInfo,
            path: resourcePath,
          };
      }
    if (metadataByPath) {
      const exact = metadataByPath.get(normalizedResourcePath) ?? metadataByPath.get(resourcePath);
      if (exact) return createSourceInfo(resourcePath, exact);
      for (const [sourcePath, metadata] of metadataByPath.entries()) {
        const normalizedSourcePath = resolve(sourcePath);
        if (
          normalizedResourcePath === normalizedSourcePath ||
          normalizedResourcePath.startsWith(`${normalizedSourcePath}${sep}`)
        )
          return createSourceInfo(resourcePath, metadata);
      }
    }
  }
  getDefaultSourceInfoForPath(filePath) {
    if (filePath.startsWith("<") && filePath.endsWith(">"))
      return {
        path: filePath,
        source: filePath.slice(1, -1).split(":")[0] || "temporary",
        scope: "temporary",
        origin: "top-level",
      };
    const normalizedPath = resolve(filePath);
    const agentRoots = [
      join(this.agentDir, "skills"),
      join(this.agentDir, "prompts"),
      join(this.agentDir, "themes"),
      join(this.agentDir, "extensions"),
    ];
    const projectRoots = [
      join(this.cwd, CONFIG_DIR_NAME, "skills"),
      join(this.cwd, CONFIG_DIR_NAME, "prompts"),
      join(this.cwd, CONFIG_DIR_NAME, "themes"),
      join(this.cwd, CONFIG_DIR_NAME, "extensions"),
    ];
    for (const root of agentRoots)
      if (this.isUnderPath(normalizedPath, root))
        return {
          path: filePath,
          source: "local",
          scope: "user",
          origin: "top-level",
          baseDir: root,
        };
    for (const root of projectRoots)
      if (this.isUnderPath(normalizedPath, root))
        return {
          path: filePath,
          source: "local",
          scope: "project",
          origin: "top-level",
          baseDir: root,
        };
    return {
      path: filePath,
      source: "local",
      scope: "temporary",
      origin: "top-level",
      baseDir: statSync(normalizedPath).isDirectory()
        ? normalizedPath
        : resolve(normalizedPath, ".."),
    };
  }
  mergePaths(primary, additional) {
    const merged = [];
    const seen = /* @__PURE__ */ new Set();
    for (const p of [...primary, ...additional]) {
      const resolved = this.resolveResourcePath(p);
      const canonicalPath = canonicalizePath(resolved);
      if (seen.has(canonicalPath)) continue;
      seen.add(canonicalPath);
      merged.push(resolved);
    }
    return merged;
  }
  resolveResourcePath(p) {
    const trimmed = p.trim();
    let expanded = trimmed;
    if (trimmed === "~") expanded = homedir();
    else if (trimmed.startsWith("~/")) expanded = join(homedir(), trimmed.slice(2));
    else if (trimmed.startsWith("~")) expanded = join(homedir(), trimmed.slice(1));
    return resolve(this.cwd, expanded);
  }
  loadThemes(paths, includeDefaults = true) {
    const themes = [];
    const diagnostics = [];
    if (includeDefaults) {
      const defaultDirs = [
        join(this.agentDir, "themes"),
        join(this.cwd, CONFIG_DIR_NAME, "themes"),
      ];
      for (const dir of defaultDirs) this.loadThemesFromDir(dir, themes, diagnostics);
    }
    for (const p of paths) {
      const resolved = resolve(this.cwd, p);
      if (!existsSync(resolved)) {
        diagnostics.push({
          type: "warning",
          message: "theme path does not exist",
          path: resolved,
        });
        continue;
      }
      try {
        const stats = statSync(resolved);
        if (stats.isDirectory()) this.loadThemesFromDir(resolved, themes, diagnostics);
        else if (stats.isFile() && resolved.endsWith(".json"))
          this.loadThemeFromFile(resolved, themes, diagnostics);
        else
          diagnostics.push({
            type: "warning",
            message: "theme path is not a json file",
            path: resolved,
          });
      } catch (error) {
        const message = error instanceof Error ? error.message : "failed to read theme path";
        diagnostics.push({
          type: "warning",
          message,
          path: resolved,
        });
      }
    }
    return {
      themes,
      diagnostics,
    };
  }
  loadThemesFromDir(dir, themes, diagnostics) {
    if (!existsSync(dir)) return;
    try {
      const entries = readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        let isFile = entry.isFile();
        if (entry.isSymbolicLink())
          try {
            isFile = statSync(join(dir, entry.name)).isFile();
          } catch {
            continue;
          }
        if (!isFile) continue;
        if (!entry.name.endsWith(".json")) continue;
        this.loadThemeFromFile(join(dir, entry.name), themes, diagnostics);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "failed to read theme directory";
      diagnostics.push({
        type: "warning",
        message,
        path: dir,
      });
    }
  }
  loadThemeFromFile(filePath, themes, diagnostics) {
    try {
      themes.push(loadThemeFromPath(filePath));
    } catch (error) {
      const message = error instanceof Error ? error.message : "failed to load theme";
      diagnostics.push({
        type: "warning",
        message,
        path: filePath,
      });
    }
  }
  async loadExtensionFactories(runtime) {
    const extensions = [];
    const errors = [];
    for (const [index, factory] of this.extensionFactories.entries()) {
      const extensionPath = `<inline:${index + 1}>`;
      try {
        const extension = await loadExtensionFromFactory(
          factory,
          this.cwd,
          this.eventBus,
          runtime,
          extensionPath,
        );
        extensions.push(extension);
      } catch (error) {
        const message = error instanceof Error ? error.message : "failed to load extension";
        errors.push({
          path: extensionPath,
          error: message,
        });
      }
    }
    return {
      extensions,
      errors,
    };
  }
  dedupePrompts(prompts) {
    const seen = /* @__PURE__ */ new Map();
    const diagnostics = [];
    for (const prompt of prompts) {
      const existing = seen.get(prompt.name);
      if (existing)
        diagnostics.push({
          type: "collision",
          message: `name "/${prompt.name}" collision`,
          path: prompt.filePath,
          collision: {
            resourceType: "prompt",
            name: prompt.name,
            winnerPath: existing.filePath,
            loserPath: prompt.filePath,
          },
        });
      else seen.set(prompt.name, prompt);
    }
    return {
      prompts: Array.from(seen.values()),
      diagnostics,
    };
  }
  dedupeThemes(themes) {
    const seen = /* @__PURE__ */ new Map();
    const diagnostics = [];
    for (const t of themes) {
      const name = t.name ?? "unnamed";
      const existing = seen.get(name);
      if (existing)
        diagnostics.push({
          type: "collision",
          message: `name "${name}" collision`,
          path: t.sourcePath,
          collision: {
            resourceType: "theme",
            name,
            winnerPath: existing.sourcePath ?? "<builtin>",
            loserPath: t.sourcePath ?? "<builtin>",
          },
        });
      else seen.set(name, t);
    }
    return {
      themes: Array.from(seen.values()),
      diagnostics,
    };
  }
  discoverSystemPromptFile() {
    const projectPath = join(this.cwd, CONFIG_DIR_NAME, "SYSTEM.md");
    if (existsSync(projectPath)) return projectPath;
    const globalPath = join(this.agentDir, "SYSTEM.md");
    if (existsSync(globalPath)) return globalPath;
  }
  discoverAppendSystemPromptFile() {
    const projectPath = join(this.cwd, CONFIG_DIR_NAME, "APPEND_SYSTEM.md");
    if (existsSync(projectPath)) return projectPath;
    const globalPath = join(this.agentDir, "APPEND_SYSTEM.md");
    if (existsSync(globalPath)) return globalPath;
  }
  isUnderPath(target, root) {
    const normalizedRoot = resolve(root);
    if (target === normalizedRoot) return true;
    const prefix = normalizedRoot.endsWith(sep) ? normalizedRoot : `${normalizedRoot}${sep}`;
    return target.startsWith(prefix);
  }
  detectExtensionConflicts(extensions) {
    const conflicts = [];
    const toolOwners = /* @__PURE__ */ new Map();
    const flagOwners = /* @__PURE__ */ new Map();
    for (const ext of extensions) {
      for (const toolName of ext.tools.keys()) {
        const existingOwner = toolOwners.get(toolName);
        if (existingOwner && existingOwner !== ext.path)
          conflicts.push({
            path: ext.path,
            message: `Tool "${toolName}" conflicts with ${existingOwner}`,
          });
        else toolOwners.set(toolName, ext.path);
      }
      for (const flagName of ext.flags.keys()) {
        const existingOwner = flagOwners.get(flagName);
        if (existingOwner && existingOwner !== ext.path)
          conflicts.push({
            path: ext.path,
            message: `Flag "--${flagName}" conflicts with ${existingOwner}`,
          });
        else flagOwners.set(flagName, ext.path);
      }
    }
    return conflicts;
  }
};
//#endregion
//#region src/agents/sessions/telemetry.ts
function isTruthyEnvFlag(value) {
  if (!value) return false;
  return value === "1" || value.toLowerCase() === "true" || value.toLowerCase() === "yes";
}
/** Resolves whether install telemetry is enabled from env override or settings. */
function isInstallTelemetryEnabled(settingsManager, telemetryEnv = process.env.OPENCLAW_TELEMETRY) {
  return telemetryEnv !== void 0
    ? isTruthyEnvFlag(telemetryEnv)
    : settingsManager.getEnableInstallTelemetry();
}
//#endregion
//#region src/agents/sessions/sdk.ts
/**
 * Agent session SDK factory.
 *
 * Selects models, wires built-in/custom tools, loads resources, and creates AgentSession instances.
 */
function projectThinkingCatalogCompat(compat) {
  if (!compat || typeof compat !== "object") return;
  const record = compat;
  const projected = {};
  if (typeof record.thinkingFormat === "string") projected.thinkingFormat = record.thinkingFormat;
  if (record.supportedReasoningEfforts === null) projected.supportedReasoningEfforts = null;
  else if (
    Array.isArray(record.supportedReasoningEfforts) &&
    record.supportedReasoningEfforts.every((effort) => typeof effort === "string")
  )
    projected.supportedReasoningEfforts = record.supportedReasoningEfforts;
  return Object.keys(projected).length > 0 ? projected : void 0;
}
function getDefaultAgentDir() {
  return getAgentDir();
}
function getAttributionHeaders(model, settingsManager) {
  if (!isInstallTelemetryEnabled(settingsManager)) return;
  const baseUrl = model.baseUrl ?? "";
  if (model.provider === "openrouter" || baseUrl.includes("openrouter.ai"))
    return {
      "HTTP-Referer": "https://openclaw.ai",
      "X-OpenRouter-Title": "OpenClaw",
      "X-OpenRouter-Categories": "cli-agent",
    };
  if (
    model.provider === "cloudflare-workers-ai" ||
    model.provider === "cloudflare-ai-gateway" ||
    baseUrl.includes("api.cloudflare.com") ||
    baseUrl.includes("gateway.ai.cloudflare.com")
  )
    return { "User-Agent": "openclaw" };
}
/**
 * Create an AgentSession with the specified options.
 *
 * @example
 * ```typescript
 * // Minimal - uses defaults
 * const { session } = await createAgentSession();
 *
 * // With explicit model from the configured registry
 * const model = ModelRegistry.create(AuthStorage.load()).find('anthropic', 'claude-opus-4-5');
 * const { session } = await createAgentSession({
 *   model,
 *   thinkingLevel: 'high',
 * });
 *
 * // Continue previous session
 * const { session, modelFallbackMessage } = await createAgentSession({
 *   continueSession: true,
 * });
 *
 * // Full control
 * const loader = new DefaultResourceLoader({
 *   cwd: process.cwd(),
 *   agentDir: getAgentDir(),
 *   settingsManager: SettingsManager.create(),
 * });
 * await loader.reload();
 * const { session } = await createAgentSession({
 *   model: myModel,
 *   tools: ["read", "bash"],
 *   resourceLoader: loader,
 *   sessionManager: SessionManager.inMemory(),
 * });
 * ```
 */
async function createAgentSession(options = {}) {
  const cwd = options.cwd ?? options.sessionManager?.getCwd() ?? process.cwd();
  const agentDir = options.agentDir ?? getDefaultAgentDir();
  let resourceLoader = options.resourceLoader;
  const authPath = options.agentDir ? join(agentDir, "auth.json") : void 0;
  const modelsPath = options.agentDir ? join(agentDir, "models.json") : void 0;
  const authStorage = options.authStorage ?? AuthStorage.create(authPath);
  const modelRegistry = options.modelRegistry ?? ModelRegistry.create(authStorage, modelsPath);
  const settingsManager = options.settingsManager ?? SettingsManager.create(cwd, agentDir);
  const sessionManager =
    options.sessionManager ?? SessionManager.create(cwd, getDefaultSessionDir(cwd, agentDir));
  if (!resourceLoader) {
    resourceLoader = new DefaultResourceLoader({
      cwd,
      agentDir,
      settingsManager,
    });
    await resourceLoader.reload();
  }
  const existingSession = sessionManager.buildSessionContext();
  const hasExistingSession = existingSession.messages.length > 0;
  const hasThinkingEntry = sessionManager
    .getBranch()
    .some((entry) => entry.type === "thinking_level_change");
  let model = options.model;
  let modelFallbackMessage;
  if (!model && hasExistingSession && existingSession.model) {
    const restoredModel = modelRegistry.find(
      existingSession.model.provider,
      existingSession.model.modelId,
    );
    if (restoredModel && modelRegistry.hasConfiguredAuth(restoredModel)) model = restoredModel;
    if (!model)
      modelFallbackMessage = `Could not restore model ${existingSession.model.provider}/${existingSession.model.modelId}`;
  }
  if (!model) {
    model = (
      await findInitialModel({
        scopedModels: [],
        isContinuing: hasExistingSession,
        defaultProvider: settingsManager.getDefaultProvider(),
        defaultModelId: settingsManager.getDefaultModel(),
        defaultThinkingLevel: settingsManager.getDefaultThinkingLevel(),
        modelRegistry,
      })
    ).model;
    if (!model) modelFallbackMessage = formatNoModelsAvailableMessage();
    else if (modelFallbackMessage) modelFallbackMessage += `. Using ${model.provider}/${model.id}`;
  }
  let thinkingLevel = options.thinkingLevel;
  const modelThinkingProvider = model?.api === "ollama" ? "ollama" : model?.provider;
  const modelThinkingCompat = model ? projectThinkingCatalogCompat(model.compat) : void 0;
  const modelThinkingDefault =
    (model && modelThinkingProvider
      ? resolveThinkingDefaultForModel({
          provider: modelThinkingProvider,
          model: model.id,
          catalog: [
            {
              provider: modelThinkingProvider,
              id: model.id,
              api: model.api,
              reasoning: model.reasoning,
              ...(model.params ? { params: model.params } : {}),
              ...(modelThinkingCompat ? { compat: modelThinkingCompat } : {}),
            },
          ],
        })
      : void 0) === "off"
      ? "off"
      : DEFAULT_THINKING_LEVEL;
  if (thinkingLevel === void 0 && hasExistingSession)
    thinkingLevel = hasThinkingEntry
      ? existingSession.thinkingLevel
      : (settingsManager.getDefaultThinkingLevel() ?? modelThinkingDefault);
  if (thinkingLevel === void 0)
    thinkingLevel = settingsManager.getDefaultThinkingLevel() ?? modelThinkingDefault;
  if (!model) thinkingLevel = "off";
  else thinkingLevel = clampThinkingLevel(model, thinkingLevel);
  const defaultActiveToolNames = ["read", "bash", "edit", "write"];
  const customToolNames = options.customTools?.map((tool) => tool.name) ?? [];
  const allowedToolNames = options.tools ?? (options.noTools === "all" ? [] : void 0);
  const disableBuiltInTools = !options.tools && options.noTools === "builtin";
  const initialActiveToolNames = options.tools
    ? [...options.tools]
    : options.noTools === "all"
      ? []
      : options.noTools === "builtin"
        ? customToolNames
        : defaultActiveToolNames;
  const convertToLlmWithBlockImages = (messages) => {
    const converted = convertToLlm(messages);
    if (!settingsManager.getBlockImages()) return converted;
    return converted.map((msg) => {
      if (msg.role === "user" || msg.role === "toolResult") {
        const content = msg.content;
        if (Array.isArray(content)) {
          if (content.some((c) => c.type === "image")) {
            const filteredContent = content
              .map((c) =>
                c.type === "image"
                  ? {
                      type: "text",
                      text: "Image reading is disabled.",
                    }
                  : c,
              )
              .filter((c, i, arr) => {
                const previous = arr.at(i - 1);
                return !(
                  c.type === "text" &&
                  c.text === "Image reading is disabled." &&
                  i > 0 &&
                  previous?.type === "text" &&
                  previous.text === "Image reading is disabled."
                );
              });
            return Object.assign({}, msg, { content: filteredContent });
          }
        }
      }
      return msg;
    });
  };
  const extensionRunnerRef = {};
  const runWithSessionWriteLock = async (run) =>
    options.withSessionWriteLock ? await options.withSessionWriteLock(run) : await run();
  const agent = new Agent({
    initialState: {
      systemPrompt: "",
      model,
      thinkingLevel,
      tools: [],
    },
    convertToLlm: convertToLlmWithBlockImages,
    streamFn: async (modelResult, context, optionsLocal) => {
      const auth = await modelRegistry.getApiKeyAndHeaders(modelResult);
      if (!auth.ok) throw new Error(auth.error);
      const providerRetrySettings = settingsManager.getProviderRetrySettings();
      const attributionHeaders = getAttributionHeaders(modelResult, settingsManager);
      return streamSimple(modelResult, context, {
        ...optionsLocal,
        apiKey: auth.apiKey,
        timeoutMs: optionsLocal?.timeoutMs ?? providerRetrySettings.timeoutMs,
        maxRetries: optionsLocal?.maxRetries ?? providerRetrySettings.maxRetries,
        maxRetryDelayMs: optionsLocal?.maxRetryDelayMs ?? providerRetrySettings.maxRetryDelayMs,
        headers:
          attributionHeaders || auth.headers || optionsLocal?.headers
            ? {
                ...attributionHeaders,
                ...auth.headers,
                ...optionsLocal?.headers,
              }
            : void 0,
      });
    },
    onPayload: async (payload, modelValue) => {
      const runner = extensionRunnerRef.current;
      if (!runner?.hasHandlers("before_provider_request")) return payload;
      return await runWithSessionWriteLock(
        async () => await runner.emitBeforeProviderRequest(payload),
      );
    },
    onResponse: async (response, modelLocal) => {
      const runner = extensionRunnerRef.current;
      if (!runner?.hasHandlers("after_provider_response")) return;
      await runWithSessionWriteLock(
        async () =>
          await runner.emit({
            type: "after_provider_response",
            status: response.status,
            headers: response.headers,
          }),
      );
    },
    sessionId: sessionManager.getSessionId(),
    transformContext: async (messages) => {
      const runner = extensionRunnerRef.current;
      if (!runner) return messages;
      return runner.emitContext(messages);
    },
    resolveDeferredTool: options.resolveDeferredTool,
    steeringMode: settingsManager.getSteeringMode(),
    followUpMode: settingsManager.getFollowUpMode(),
    transport: settingsManager.getTransport(),
    thinkingBudgets: settingsManager.getThinkingBudgets(),
    maxRetryDelayMs: settingsManager.getProviderRetrySettings().maxRetryDelayMs,
  });
  if (hasExistingSession) {
    agent.state.messages = existingSession.messages;
    if (!hasThinkingEntry) sessionManager.appendThinkingLevelChange(thinkingLevel);
  } else {
    if (model) sessionManager.appendModelChange(model.provider, model.id);
    sessionManager.appendThinkingLevelChange(thinkingLevel);
  }
  return {
    session: new AgentSession({
      agent,
      sessionManager,
      settingsManager,
      cwd,
      scopedModels: options.scopedModels,
      resourceLoader,
      customTools: options.customTools,
      modelRegistry,
      initialActiveToolNames,
      allowedToolNames,
      disableBuiltInTools,
      extensionRunnerRef,
      sessionStartEvent: options.sessionStartEvent,
      withSessionWriteLock: options.withSessionWriteLock,
    }),
    extensionsResult: resourceLoader.getExtensions(),
    modelFallbackMessage,
  };
}
//#endregion
//#region src/agents/sessions/agent-session-services.ts
/**
 * Agent session service factory.
 *
 * Creates cwd-bound auth, settings, model registry, resource loader, and session instances for the CLI runtime.
 */
function applyExtensionFlagValues(resourceLoader, extensionFlagValues) {
  if (!extensionFlagValues) return [];
  const diagnostics = [];
  const extensionsResult = resourceLoader.getExtensions();
  const registeredFlags = /* @__PURE__ */ new Map();
  for (const extension of extensionsResult.extensions)
    for (const [name, flag] of extension.flags) registeredFlags.set(name, { type: flag.type });
  const unknownFlags = [];
  for (const [name, value] of extensionFlagValues) {
    const flag = registeredFlags.get(name);
    if (!flag) {
      unknownFlags.push(name);
      continue;
    }
    if (flag.type === "boolean") {
      extensionsResult.runtime.flagValues.set(name, true);
      continue;
    }
    if (typeof value === "string") {
      extensionsResult.runtime.flagValues.set(name, value);
      continue;
    }
    diagnostics.push({
      type: "error",
      message: `Extension flag "--${name}" requires a value`,
    });
  }
  if (unknownFlags.length > 0)
    diagnostics.push({
      type: "error",
      message: `Unknown option${unknownFlags.length === 1 ? "" : "s"}: ${unknownFlags.map((name) => `--${name}`).join(", ")}`,
    });
  return diagnostics;
}
/**
 * Create cwd-bound runtime services.
 *
 * Returns services plus diagnostics. It does not create an AgentSession.
 */
async function createAgentSessionServices(options) {
  const cwd = options.cwd;
  const agentDir = options.agentDir ?? getAgentDir();
  const authStorage = options.authStorage ?? AuthStorage.create(join(agentDir, "auth.json"));
  const settingsManager = options.settingsManager ?? SettingsManager.create(cwd, agentDir);
  const modelRegistry =
    options.modelRegistry ?? ModelRegistry.create(authStorage, join(agentDir, "models.json"));
  const resourceLoader = new DefaultResourceLoader({
    ...options.resourceLoaderOptions,
    cwd,
    agentDir,
    settingsManager,
  });
  await resourceLoader.reload();
  const diagnostics = [];
  const extensionsResult = resourceLoader.getExtensions();
  for (const { name, config, extensionPath } of extensionsResult.runtime
    .pendingProviderRegistrations)
    try {
      modelRegistry.registerProvider(name, config);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      diagnostics.push({
        type: "error",
        message: `Extension "${extensionPath}" error: ${message}`,
      });
    }
  extensionsResult.runtime.pendingProviderRegistrations = [];
  diagnostics.push(...applyExtensionFlagValues(resourceLoader, options.extensionFlagValues));
  return {
    cwd,
    agentDir,
    authStorage,
    settingsManager,
    modelRegistry,
    resourceLoader,
    diagnostics,
  };
}
/**
 * Create an AgentSession from previously created services.
 *
 * This keeps session creation separate from service creation so callers can
 * resolve model, thinking, tools, and other session inputs against the target
 * cwd before constructing the session.
 */
async function createAgentSessionFromServices(options) {
  return createAgentSession({
    cwd: options.services.cwd,
    agentDir: options.services.agentDir,
    authStorage: options.services.authStorage,
    settingsManager: options.services.settingsManager,
    modelRegistry: options.services.modelRegistry,
    resourceLoader: options.services.resourceLoader,
    sessionManager: options.sessionManager,
    model: options.model,
    thinkingLevel: options.thinkingLevel,
    scopedModels: options.scopedModels,
    tools: options.tools,
    noTools: options.noTools,
    customTools: options.customTools,
    sessionStartEvent: options.sessionStartEvent,
  });
}
//#endregion
//#region src/agents/sessions/agent-session-runtime.ts
/**
 * Agent session runtime factory.
 *
 * Builds cwd-bound services, imports optional session history, and emits shutdown events for replaced sessions.
 */
/**
 * Thrown when /import references a JSONL file path that does not exist.
 */
var SessionImportFileNotFoundError = class extends Error {
  constructor(filePath) {
    super(`File not found: ${filePath}`);
    this.name = "SessionImportFileNotFoundError";
    this.filePath = filePath;
  }
};
function extractUserMessageText(content) {
  if (typeof content === "string") return content;
  return content
    .filter((part) => part.type === "text" && typeof part.text === "string")
    .map((part) => part.text)
    .join("");
}
/**
 * Owns the current AgentSession plus its cwd-bound services.
 *
 * Session replacement methods tear down the current runtime first, then create
 * and apply the next runtime. If creation fails, the error is propagated to the
 * caller. The caller is responsible for user-facing error handling.
 */
var AgentSessionRuntime = class {
  constructor(session, services, createRuntime, diagnostics = [], modelFallbackMessage) {
    this.currentSession = session;
    this.runtimeServices = services;
    this.createRuntime = createRuntime;
    this.runtimeDiagnostics = diagnostics;
    this.fallbackMessage = modelFallbackMessage;
  }
  get services() {
    return this.runtimeServices;
  }
  get session() {
    return this.currentSession;
  }
  get cwd() {
    return this.runtimeServices.cwd;
  }
  get diagnostics() {
    return this.runtimeDiagnostics;
  }
  get modelFallbackMessage() {
    return this.fallbackMessage;
  }
  setRebindSession(rebindSession) {
    this.rebindSession = rebindSession;
  }
  /**
   * Set a synchronous callback that runs after `session_shutdown` handlers finish
   * but before the current session is invalidated.
   *
   * This is for host-owned UI teardown that must not yield to the event loop,
   * such as detaching extension-provided TUI components before the old extension
   * context becomes stale.
   */
  setBeforeSessionInvalidate(beforeSessionInvalidate) {
    this.beforeSessionInvalidate = beforeSessionInvalidate;
  }
  async emitBeforeSwitch(reason, targetSessionFile) {
    const runner = this.currentSession.extensionRunner;
    if (!runner.hasHandlers("session_before_switch")) return { cancelled: false };
    return {
      cancelled:
        (
          await runner.emit({
            type: "session_before_switch",
            reason,
            targetSessionFile,
          })
        )?.cancel === true,
    };
  }
  async emitBeforeFork(entryId, options) {
    const runner = this.currentSession.extensionRunner;
    if (!runner.hasHandlers("session_before_fork")) return { cancelled: false };
    return {
      cancelled:
        (
          await runner.emit({
            type: "session_before_fork",
            entryId,
            ...options,
          })
        )?.cancel === true,
    };
  }
  async teardownCurrent(reason, targetSessionFile) {
    await emitSessionShutdownEvent(this.currentSession.extensionRunner, {
      type: "session_shutdown",
      reason,
      targetSessionFile,
    });
    this.beforeSessionInvalidate?.();
    this.currentSession.dispose();
  }
  apply(result) {
    this.currentSession = result.session;
    this.runtimeServices = result.services;
    this.runtimeDiagnostics = result.diagnostics;
    this.fallbackMessage = result.modelFallbackMessage;
  }
  async finishSessionReplacement(withSession) {
    if (this.rebindSession) await this.rebindSession(this.currentSession);
    if (withSession) await withSession(this.currentSession.createReplacedSessionContext());
  }
  async switchSession(sessionPath, options) {
    const beforeResult = await this.emitBeforeSwitch("resume", sessionPath);
    if (beforeResult.cancelled) return beforeResult;
    const previousSessionFile = this.currentSession.sessionFile;
    const sessionManager = SessionManager.open(sessionPath, void 0, options?.cwdOverride);
    assertSessionCwdExists(sessionManager, this.cwd);
    await this.teardownCurrent("resume", sessionManager.getSessionFile());
    this.apply(
      await this.createRuntime({
        cwd: sessionManager.getCwd(),
        agentDir: this.runtimeServices.agentDir,
        sessionManager,
        sessionStartEvent: {
          type: "session_start",
          reason: "resume",
          previousSessionFile,
        },
      }),
    );
    await this.finishSessionReplacement(options?.withSession);
    return { cancelled: false };
  }
  async newSession(options) {
    const beforeResult = await this.emitBeforeSwitch("new");
    if (beforeResult.cancelled) return beforeResult;
    const previousSessionFile = this.currentSession.sessionFile;
    const sessionDir = this.currentSession.sessionManager.getSessionDir();
    const sessionManager = SessionManager.create(this.cwd, sessionDir);
    if (options?.parentSession) sessionManager.newSession({ parentSession: options.parentSession });
    await this.teardownCurrent("new", sessionManager.getSessionFile());
    this.apply(
      await this.createRuntime({
        cwd: this.cwd,
        agentDir: this.runtimeServices.agentDir,
        sessionManager,
        sessionStartEvent: {
          type: "session_start",
          reason: "new",
          previousSessionFile,
        },
      }),
    );
    if (options?.setup) {
      await options.setup(this.currentSession.sessionManager);
      this.currentSession.agent.state.messages =
        this.currentSession.sessionManager.buildSessionContext().messages;
    }
    await this.finishSessionReplacement(options?.withSession);
    return { cancelled: false };
  }
  async fork(entryId, options) {
    const position = options?.position ?? "before";
    if ((await this.emitBeforeFork(entryId, { position })).cancelled) return { cancelled: true };
    let targetLeafId;
    let selectedText;
    const selectedEntry = this.currentSession.sessionManager.getEntry(entryId);
    if (!selectedEntry) throw new Error("Invalid entry ID for forking");
    if (position === "at") targetLeafId = selectedEntry.id;
    else {
      if (selectedEntry.type !== "message" || selectedEntry.message.role !== "user")
        throw new Error("Invalid entry ID for forking");
      targetLeafId = selectedEntry.parentId;
      selectedText = extractUserMessageText(selectedEntry.message.content);
    }
    const previousSessionFile = this.currentSession.sessionFile;
    if (this.currentSession.sessionManager.isPersisted()) {
      const currentSessionFile = this.currentSession.sessionFile;
      if (!currentSessionFile) throw new Error("Persisted session is missing a session file");
      const sessionDir = this.currentSession.sessionManager.getSessionDir();
      if (!targetLeafId) {
        const sessionManager = SessionManager.create(this.cwd, sessionDir);
        sessionManager.newSession({ parentSession: currentSessionFile });
        await this.teardownCurrent("fork", sessionManager.getSessionFile());
        this.apply(
          await this.createRuntime({
            cwd: this.cwd,
            agentDir: this.runtimeServices.agentDir,
            sessionManager,
            sessionStartEvent: {
              type: "session_start",
              reason: "fork",
              previousSessionFile,
            },
          }),
        );
        await this.finishSessionReplacement(options?.withSession);
        return {
          cancelled: false,
          selectedText,
        };
      }
      const sessionManager = SessionManager.open(currentSessionFile, sessionDir);
      if (!sessionManager.createBranchedSession(targetLeafId))
        throw new Error("Failed to create forked session");
      await this.teardownCurrent("fork", sessionManager.getSessionFile());
      this.apply(
        await this.createRuntime({
          cwd: sessionManager.getCwd(),
          agentDir: this.runtimeServices.agentDir,
          sessionManager,
          sessionStartEvent: {
            type: "session_start",
            reason: "fork",
            previousSessionFile,
          },
        }),
      );
      await this.finishSessionReplacement(options?.withSession);
      return {
        cancelled: false,
        selectedText,
      };
    }
    const sessionManager = this.currentSession.sessionManager;
    if (!targetLeafId)
      sessionManager.newSession({ parentSession: this.currentSession.sessionFile });
    else sessionManager.createBranchedSession(targetLeafId);
    await this.teardownCurrent("fork", sessionManager.getSessionFile());
    this.apply(
      await this.createRuntime({
        cwd: this.cwd,
        agentDir: this.runtimeServices.agentDir,
        sessionManager,
        sessionStartEvent: {
          type: "session_start",
          reason: "fork",
          previousSessionFile,
        },
      }),
    );
    await this.finishSessionReplacement(options?.withSession);
    return {
      cancelled: false,
      selectedText,
    };
  }
  /**
   * Import a session JSONL file and switch runtime state to the imported session.
   *
   * @returns `{ cancelled: true }` when cancelled by `session_before_switch`, otherwise `{ cancelled: false }`.
   * @throws {SessionImportFileNotFoundError} When the input path does not exist.
   * @throws {MissingSessionCwdError} When the imported session cwd cannot be resolved and no override is provided.
   */
  async importFromJsonl(inputPath, cwdOverride) {
    const resolvedPath = resolve(inputPath);
    if (!existsSync(resolvedPath)) throw new SessionImportFileNotFoundError(resolvedPath);
    const sessionDir = this.currentSession.sessionManager.getSessionDir();
    if (!existsSync(sessionDir)) mkdirSync(sessionDir, { recursive: true });
    const destinationPath = join(sessionDir, basename(resolvedPath));
    const beforeResult = await this.emitBeforeSwitch("resume", destinationPath);
    if (beforeResult.cancelled) return beforeResult;
    const previousSessionFile = this.currentSession.sessionFile;
    if (resolve(destinationPath) !== resolvedPath) copyFileSync(resolvedPath, destinationPath);
    const sessionManager = SessionManager.open(destinationPath, sessionDir, cwdOverride);
    assertSessionCwdExists(sessionManager, this.cwd);
    await this.teardownCurrent("resume", sessionManager.getSessionFile());
    this.apply(
      await this.createRuntime({
        cwd: sessionManager.getCwd(),
        agentDir: this.runtimeServices.agentDir,
        sessionManager,
        sessionStartEvent: {
          type: "session_start",
          reason: "resume",
          previousSessionFile,
        },
      }),
    );
    await this.finishSessionReplacement();
    return { cancelled: false };
  }
  async dispose() {
    await emitSessionShutdownEvent(this.currentSession.extensionRunner, {
      type: "session_shutdown",
      reason: "quit",
    });
    this.beforeSessionInvalidate?.();
    this.currentSession.dispose();
  }
};
/**
 * Create the initial runtime from a runtime factory and initial session target.
 *
 * The same factory is stored on the returned AgentSessionRuntime and reused for
 * later /new, /resume, /fork, and import flows.
 */
async function createAgentSessionRuntime(createRuntime, options) {
  assertSessionCwdExists(options.sessionManager, options.cwd);
  const result = await createRuntime(options);
  return new AgentSessionRuntime(
    result.session,
    result.services,
    createRuntime,
    result.diagnostics,
    result.modelFallbackMessage,
  );
}
//#endregion
export {
  createBashTool as $,
  isWriteToolResult as A,
  takeRuntimeUserTurnTranscriptRecorder as At,
  createWriteTool as B,
  isBashToolResult as C,
  InMemoryAuthStorageBackend as Ct,
  isLsToolResult as D,
  sleep as Dt,
  isGrepToolResult as E,
  writePrivateTempFile as Et,
  createCodingTools as F,
  createLsToolDefinition as G,
  createReadTool as H,
  createReadOnlyToolDefinitions as I,
  createFindTool as J,
  createGrepTool as K,
  createReadOnlyTools as L,
  createAllToolDefinitions as M,
  createAllTools as N,
  isReadToolResult as O,
  attachRuntimeUserTurnTranscriptRecorder as Ot,
  createCodingToolDefinitions as P,
  withFileMutationQueue as Q,
  createTool as R,
  defineTool as S,
  FileAuthStorageBackend as St,
  isFindToolResult as T,
  executeBashWithOperations as Tt,
  createReadToolDefinition as U,
  createWriteToolDefinition as V,
  createLsTool as W,
  createEditTool as X,
  createFindToolDefinition as Y,
  createEditToolDefinition as Z,
  discoverAndLoadExtensions as _,
  generateSummary as _t,
  createAgentSessionServices as a,
  InMemorySettingsStorage as at,
  wrapRegisteredTool as b,
  generateBranchSummary as bt,
  loadProjectContextFiles as c,
  findExactModelReferenceMatch as ct,
  buildPromisedWorkPromptSection as d,
  resolveCliModel as dt,
  createBashToolDefinition as et,
  formatSkillsForPrompt as f,
  resolveModelScope as ft,
  createExtensionRuntime as g,
  compact as gt,
  ExtensionRunner as h,
  clearApiKeyCache as ht,
  createAgentSessionFromServices as i,
  FileSettingsStorage as it,
  allToolNames as j,
  classifyRateLimitWindow as jt,
  isToolCallEventType as k,
  takeRuntimeUserTurnTranscriptContext as kt,
  AgentSession as l,
  findInitialModel as lt,
  loadSkillsFromDir as m,
  ModelRegistry as mt,
  SessionImportFileNotFoundError as n,
  wrapToolDefinition as nt,
  createAgentSession as o,
  SettingsManager as ot,
  loadSkills as p,
  restoreModelFromSession as pt,
  createGrepToolDefinition as q,
  createAgentSessionRuntime as r,
  formatFullOutputFooter as rt,
  DefaultResourceLoader as s,
  DefaultPackageManager as st,
  AgentSessionRuntime as t,
  createLocalBashOperations as tt,
  parseSkillBlock as u,
  parseModelPattern as ut,
  loadExtensionFromFactory as v,
  prepareCompaction as vt,
  isEditToolResult as w,
  createEventBus as wt,
  wrapRegisteredTools as x,
  AuthStorage as xt,
  loadExtensions as y,
  collectEntriesForBranchSummary as yt,
  createToolDefinition as z,
};
