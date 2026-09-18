import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import pLimit from "p-limit";
import { H as formatMemoryDreamingDay, U as isSameMemoryDreamingDay } from "./dreaming-CM8RB1ct.js";
import {
  _ as writeMemoryCoreWorkspaceEntries,
  a as SHORT_TERM_LOCK_NAMESPACE,
  c as SHORT_TERM_RECALL_NAMESPACE,
  d as memoryCoreStateReference,
  g as readMemoryCoreWorkspaceEntries,
  h as openMemoryCoreStateStore,
  i as SHORT_TERM_LOCK_MAX_ENTRIES,
  o as SHORT_TERM_META_NAMESPACE,
  p as memoryCoreWorkspaceStateKey,
  s as SHORT_TERM_PHASE_SIGNAL_NAMESPACE,
  v as writeMemoryCoreWorkspaceEntry,
} from "./dreaming-state-DLMGVRgZ.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { n as appendMemoryHostEvent } from "./events-B-Dr_eF7.js";
import "./runtime-env-D0V-7Gqz.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./text-utility-runtime-CJESZCN5.js";
import { t as expectDefined } from "./expect-runtime--WgnKYXT.js";
import "./memory-core-host-status-BYxFcXad.js";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.js";
import "./memory-host-events-1465bDCf.js";
import { n as asNullableRecord } from "./record-coerce-DHZ4bFlT.js";
import "./dreaming-shared-BS6J1klu.js";
import { t as sleep } from "./sleep-DZm1epyW.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import {
  _ as uniqueStrings,
  l as normalizeStringEntries,
} from "./string-normalization-CRyoFBPt.js";
import { n as resolveMemoryCoreTimestamp, t as resolveMemoryCoreNowMs } from "./time-ngD8glCa.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
const CONCEPT_STOP_WORDS = new Set(
  Object.values({
    shared: [
      "about",
      "after",
      "agent",
      "again",
      "also",
      "assistant",
      "because",
      "before",
      "being",
      "between",
      "build",
      "called",
      "could",
      "daily",
      "default",
      "deploy",
      "during",
      "every",
      "file",
      "files",
      "from",
      "have",
      "into",
      "just",
      "line",
      "lines",
      "long",
      "main",
      "make",
      "memory",
      "month",
      "more",
      "most",
      "move",
      "much",
      "next",
      "note",
      "notes",
      "over",
      "part",
      "past",
      "port",
      "same",
      "score",
      "search",
      "session",
      "sessions",
      "short",
      "should",
      "since",
      "some",
      "subagent",
      "system",
      "than",
      "that",
      "their",
      "there",
      "these",
      "they",
      "this",
      "through",
      "today",
      "user",
      "using",
      "with",
      "work",
      "workspace",
      "year",
    ],
    english: ["and", "are", "for", "into", "its", "our", "the", "then", "were", "you", "your"],
    spanish: [
      "al",
      "con",
      "como",
      "de",
      "del",
      "el",
      "en",
      "es",
      "la",
      "las",
      "los",
      "para",
      "por",
      "que",
      "se",
      "sin",
      "su",
      "sus",
      "una",
      "uno",
      "unos",
      "unas",
      "y",
    ],
    french: [
      "au",
      "aux",
      "avec",
      "dans",
      "de",
      "des",
      "du",
      "en",
      "est",
      "et",
      "la",
      "le",
      "les",
      "ou",
      "pour",
      "que",
      "qui",
      "sans",
      "ses",
      "son",
      "sur",
      "une",
      "un",
    ],
    german: [
      "auf",
      "aus",
      "bei",
      "das",
      "dem",
      "den",
      "der",
      "des",
      "die",
      "ein",
      "eine",
      "einem",
      "einen",
      "einer",
      "für",
      "im",
      "in",
      "mit",
      "nach",
      "oder",
      "ohne",
      "über",
      "und",
      "von",
      "zu",
      "zum",
      "zur",
    ],
    cjk: [
      "が",
      "から",
      "する",
      "して",
      "した",
      "で",
      "と",
      "に",
      "の",
      "は",
      "へ",
      "まで",
      "も",
      "や",
      "を",
      "与",
      "为",
      "了",
      "及",
      "和",
      "在",
      "将",
      "或",
      "把",
      "是",
      "用",
      "的",
      "과",
      "는",
      "도",
      "로",
      "를",
      "에",
      "에서",
      "와",
      "은",
      "으로",
      "을",
      "이",
      "하다",
      "한",
      "할",
      "해",
      "했다",
    ],
    pathNoise: [
      "cjs",
      "cpp",
      "cts",
      "jsx",
      "json",
      "md",
      "mjs",
      "mts",
      "text",
      "toml",
      "ts",
      "tsx",
      "txt",
      "yaml",
      "yml",
    ],
  })
    .flat()
    .map((word) => normalizeLowercaseStringOrEmpty(word)),
);
const PROTECTED_GLOSSARY = [
  "backup",
  "backups",
  "embedding",
  "embeddings",
  "failover",
  "gateway",
  "glacier",
  "gpt",
  "kv",
  "network",
  "openai",
  "qmd",
  "router",
  "s3",
  "vlan",
  "sauvegarde",
  "routeur",
  "passerelle",
  "konfiguration",
  "sicherung",
  "überwachung",
  "configuración",
  "respaldo",
  "enrutador",
  "puerta-de-enlace",
  "バックアップ",
  "フェイルオーバー",
  "ルーター",
  "ネットワーク",
  "ゲートウェイ",
  "障害対応",
  "路由器",
  "备份",
  "故障转移",
  "网络",
  "网关",
  "라우터",
  "백업",
  "페일오버",
  "네트워크",
  "게이트웨이",
  "장애대응",
].map((word) => normalizeLowercaseStringOrEmpty(word.normalize("NFKC")));
const COMPOUND_TOKEN_RE = /[\p{L}\p{N}]+(?:[._/-][\p{L}\p{N}]+)+/gu;
const LETTER_OR_NUMBER_RE = /[\p{L}\p{N}]/u;
const LATIN_RE = /\p{Script=Latin}/u;
const HAN_RE = /\p{Script=Han}/u;
const HIRAGANA_RE = /\p{Script=Hiragana}/u;
const KATAKANA_RE = /\p{Script=Katakana}/u;
const HANGUL_RE = /\p{Script=Hangul}/u;
const DEFAULT_WORD_SEGMENTER =
  typeof Intl.Segmenter === "function" ? new Intl.Segmenter("und", { granularity: "word" }) : null;
function containsLetterOrNumber(value) {
  return LETTER_OR_NUMBER_RE.test(value);
}
function classifyConceptTagScript(tag) {
  const normalized = tag.normalize("NFKC");
  const hasLatin = LATIN_RE.test(normalized);
  const hasCjk =
    HAN_RE.test(normalized) ||
    HIRAGANA_RE.test(normalized) ||
    KATAKANA_RE.test(normalized) ||
    HANGUL_RE.test(normalized);
  if (hasLatin && hasCjk) return "mixed";
  if (hasCjk) return "cjk";
  if (hasLatin) return "latin";
  return "other";
}
function minimumTokenLengthForScript(script) {
  if (script === "cjk") return 2;
  return 3;
}
function isKanaOnlyToken(value) {
  return (
    !HAN_RE.test(value) &&
    !HANGUL_RE.test(value) &&
    (HIRAGANA_RE.test(value) || KATAKANA_RE.test(value))
  );
}
function normalizeConceptToken(rawToken, fromGlossary = false) {
  const normalized = normalizeLowercaseStringOrEmpty(
    rawToken
      .normalize("NFKC")
      .replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "")
      .replaceAll("_", "-"),
  );
  if (!normalized || !containsLetterOrNumber(normalized) || normalized.length > 32) return null;
  if (
    /^\d+$/.test(normalized) ||
    /^\d{4}-\d{2}-\d{2}$/u.test(normalized) ||
    /^\d{4}-\d{2}-\d{2}\.[\p{L}\p{N}]+$/u.test(normalized)
  )
    return null;
  const script = classifyConceptTagScript(normalized);
  if (!fromGlossary && normalized.length < minimumTokenLengthForScript(script)) return null;
  if (isKanaOnlyToken(normalized) && normalized.length < 3) return null;
  if (CONCEPT_STOP_WORDS.has(normalized)) return null;
  return normalized;
}
const GLOSSARY_ENTRIES = PROTECTED_GLOSSARY.map((entry) => ({
  entry,
  wholeWord: entry.length < minimumTokenLengthForScript(classifyConceptTagScript(entry)),
}));
function isAlphanumericAt(source, index) {
  const ch = source[index];
  return ch !== void 0 && LETTER_OR_NUMBER_RE.test(ch);
}
function includesStandaloneTerm(source, entry) {
  let from = source.indexOf(entry);
  while (from !== -1) {
    if (!isAlphanumericAt(source, from - 1) && !isAlphanumericAt(source, from + entry.length))
      return true;
    from = source.indexOf(entry, from + 1);
  }
  return false;
}
function collectGlossaryMatches(source) {
  const normalizedSource = normalizeLowercaseStringOrEmpty(source.normalize("NFKC"));
  const matches = [];
  for (const { entry, wholeWord } of GLOSSARY_ENTRIES)
    if (
      wholeWord ? includesStandaloneTerm(normalizedSource, entry) : normalizedSource.includes(entry)
    )
      matches.push(entry);
  return matches;
}
function collectCompoundTokens(source) {
  return source.match(COMPOUND_TOKEN_RE) ?? [];
}
function collectSegmentTokens(source) {
  if (DEFAULT_WORD_SEGMENTER)
    return Array.from(DEFAULT_WORD_SEGMENTER.segment(source), (part) =>
      part.isWordLike ? part.segment : "",
    ).filter(Boolean);
  return source.split(/[^\p{L}\p{N}]+/u).filter(Boolean);
}
function pushNormalizedTag(tags, rawToken, limit, fromGlossary = false) {
  const normalized = normalizeConceptToken(rawToken, fromGlossary);
  if (!normalized || tags.includes(normalized)) return;
  tags.push(normalized);
  if (tags.length > limit) tags.splice(limit);
}
function deriveConceptTags(params) {
  const source = `${path.basename(params.path)} ${params.snippet}`;
  const limit = Number.isFinite(params.limit) ? Math.max(0, Math.floor(params.limit)) : 8;
  if (limit === 0) return [];
  const tags = [];
  const tokenSources = [
    {
      tokens: collectGlossaryMatches(source),
      fromGlossary: true,
    },
    {
      tokens: collectCompoundTokens(source),
      fromGlossary: false,
    },
    {
      tokens: collectSegmentTokens(source),
      fromGlossary: false,
    },
  ];
  for (const { tokens, fromGlossary } of tokenSources)
    for (const rawToken of tokens) {
      pushNormalizedTag(tags, rawToken, limit, fromGlossary);
      if (tags.length >= limit) return tags;
    }
  return tags;
}
function summarizeConceptTagScriptCoverage(conceptTagsByEntry) {
  const coverage = {
    latinEntryCount: 0,
    cjkEntryCount: 0,
    mixedEntryCount: 0,
    otherEntryCount: 0,
  };
  for (const conceptTags of conceptTagsByEntry) {
    let hasLatin = false;
    let hasCjk = false;
    let hasOther = false;
    for (const tag of conceptTags) {
      const family = classifyConceptTagScript(tag);
      if (family === "mixed") {
        hasLatin = true;
        hasCjk = true;
        continue;
      }
      if (family === "latin") {
        hasLatin = true;
        continue;
      }
      if (family === "cjk") {
        hasCjk = true;
        continue;
      }
      hasOther = true;
    }
    if (hasLatin && hasCjk) coverage.mixedEntryCount += 1;
    else if (hasCjk) coverage.cjkEntryCount += 1;
    else if (hasLatin) coverage.latinEntryCount += 1;
    else if (hasOther) coverage.otherEntryCount += 1;
  }
  return coverage;
}
//#endregion
//#region extensions/memory-core/src/memory-budget.ts
/**
 * Bounded MEMORY.md compaction for dreaming/promotion writes.
 *
 * Background: the dreaming pipeline appends promoted entries to MEMORY.md
 * via short-term-promotion.applyShortTermPromotions. Without a size budget,
 * MEMORY.md grows unboundedly across deep-phase sweeps and eventually
 * exceeds bootstrap's per-file injection cap, breaking session bootstrap.
 * See issue #73691.
 *
 * Strategy: drop the OLDEST auto-promoted sections (date-ordered) until
 * the file plus the new section fit within the budget. User-authored
 * content (anything that is not a `## Promoted From Short-Term Memory
 * (DATE)` section) is preserved unconditionally — only dreaming-owned
 * sections are eligible for compaction.
 */
const PROMOTION_SECTION_HEADING_RE = /^## Promoted From Short-Term Memory \(([^)]+)\)\s*$/;
/**
 * Default budget for MEMORY.md content on disk, in characters. Chosen to
 * stay safely below the bootstrap injection cap (~12KB per file at the
 * time of writing) so promoted memory keeps reaching new sessions instead
 * of being silently dropped by bootstrap truncation.
 */
const DEFAULT_MEMORY_FILE_MAX_CHARS = 1e4;
/**
 * Reserve for writer-side overhead that the helper does not see directly:
 * the `# Long-Term Memory\n\n` header re-emitted when compaction empties
 * out (20 chars) and `withTrailingNewline`'s trailing `\n` (1 char). See
 * the actual write expression in `applyShortTermPromotions`. Subtracting
 * this from `budgetChars` keeps the on-disk file inside the caller's
 * stated budget instead of exceeding it by up to ~21 chars in edge cases.
 */
const WRITE_OVERHEAD_RESERVE = 21;
function parseMemoryBlocks(content) {
  if (content.length === 0) return [];
  const lines = content.split(/\r?\n/);
  const blocks = [];
  let currentLines = [];
  let currentKind = "preserved";
  let currentDate;
  const flush = () => {
    if (currentLines.length === 0) return;
    const text = currentLines.join("\n");
    if (currentKind === "promotion" && currentDate)
      blocks.push({
        kind: "promotion",
        date: currentDate,
        text,
      });
    else
      blocks.push({
        kind: "preserved",
        text,
      });
    currentLines = [];
    currentKind = "preserved";
    currentDate = void 0;
  };
  for (const line of lines)
    if (line.startsWith("## ")) {
      flush();
      const match = PROMOTION_SECTION_HEADING_RE.exec(line);
      if (match) {
        currentKind = "promotion";
        currentDate = match[1];
      } else currentKind = "preserved";
      currentLines = [line];
    } else currentLines.push(line);
  flush();
  return blocks;
}
function joinBlocks(blocks) {
  return blocks.map((block) => block.text).join("\n");
}
/**
 * Drop oldest auto-promotion sections from `existingMemory` until
 * `existingMemory + newSection` fits within `budgetChars`. Returns the
 * (possibly trimmed) existing memory and the dates of dropped sections.
 *
 * Guarantees:
 * - Non-promotion content (user-authored markdown, the file header, any
 *   `##` heading not matching the promotion pattern) is preserved.
 * - Promotion sections are dropped in ascending date order (oldest first).
 * - If `existingMemory + newSection` already fits the budget, the existing
 *   memory is returned unchanged.
 * - If the budget cannot be satisfied even by dropping every promotion
 *   section, the function drops them all and returns; the caller writes
 *   the new section anyway. This is the "log and continue" failure mode —
 *   refusing the new write would silently swallow the freshest material.
 */
function compactMemoryForBudget(params) {
  const { existingMemory, newSection, budgetChars } = params;
  if (budgetChars <= 0)
    return {
      compacted: existingMemory,
      droppedDates: [],
    };
  const effectiveBudget = Math.max(0, budgetChars - WRITE_OVERHEAD_RESERVE);
  if (existingMemory.length + newSection.length <= effectiveBudget)
    return {
      compacted: existingMemory,
      droppedDates: [],
    };
  const blocks = parseMemoryBlocks(existingMemory);
  const promotionEntries = blocks
    .map((block, index) =>
      block.kind === "promotion"
        ? {
            index,
            date: block.date,
            length: block.text.length,
          }
        : null,
    )
    .filter((entry) => entry !== null)
    .toSorted((a, b) => a.date.localeCompare(b.date));
  if (promotionEntries.length === 0)
    return {
      compacted: existingMemory,
      droppedDates: [],
    };
  const droppedIndices = /* @__PURE__ */ new Set();
  const droppedDates = [];
  let projectedExistingSize = existingMemory.length;
  const blockSeparatorCost = blocks.length > 1 ? 1 : 0;
  for (const entry of promotionEntries) {
    if (projectedExistingSize + newSection.length <= effectiveBudget) break;
    droppedIndices.add(entry.index);
    droppedDates.push(entry.date);
    projectedExistingSize = Math.max(0, projectedExistingSize - entry.length - blockSeparatorCost);
  }
  if (droppedIndices.size === 0)
    return {
      compacted: existingMemory,
      droppedDates: [],
    };
  return {
    compacted: joinBlocks(blocks.filter((_, index) => !droppedIndices.has(index))),
    droppedDates,
  };
}
//#endregion
//#region extensions/memory-core/src/short-term-promotion.ts
const SHORT_TERM_PATH_RE = /(?:^|\/)memory\/(?:[^/]+\/)*(\d{4})-(\d{2})-(\d{2})(?:-[^/]+)?\.md$/;
const DREAMING_MEMORY_PATH_RE = /(?:^|\/)memory\/dreaming\//;
const SHORT_TERM_SESSION_CORPUS_RE =
  /(?:^|\/)memory\/\.dreams\/session-corpus\/(\d{4})-(\d{2})-(\d{2})\.(?:md|txt)$/;
const SHORT_TERM_BASENAME_RE = /^(\d{4})-(\d{2})-(\d{2})(?:-[^/]+)?\.md$/;
const DAY_MS = 1440 * 60 * 1e3;
const DEFAULT_RECENCY_HALF_LIFE_DAYS = 14;
const DEFAULT_PROMOTION_MIN_SCORE = 0.75;
const DEFAULT_PROMOTION_MIN_RECALL_COUNT = 3;
const DEFAULT_PROMOTION_MIN_UNIQUE_QUERIES = 2;
const PROMOTION_MARKER_PREFIX = "openclaw-memory-promotion:";
const PROMOTED_SNIPPET_CHARS_PER_TOKEN_ESTIMATE = 4;
const MAX_QUERY_HASHES = 32;
const MAX_RECALL_DAYS = 16;
const SHORT_TERM_RECALL_MAX_ENTRIES = 512;
const SHORT_TERM_SOURCE_FILE_CHECK_CONCURRENCY = 32;
const SHORT_TERM_RECALL_MAX_SNIPPET_CHARS = 800;
const SHORT_TERM_STORE_RELATIVE_PATH = path.join("memory", ".dreams", "short-term-recall.json");
const SHORT_TERM_PHASE_SIGNAL_RELATIVE_PATH = path.join("memory", ".dreams", "phase-signals.json");
const SHORT_TERM_LOCK_WAIT_TIMEOUT_MS = 1e4;
const SHORT_TERM_LOCK_STALE_MS = 6e4;
const SHORT_TERM_LOCK_RETRY_DELAY_MS = 40;
const DREAMING_ENTRY_LIST_LIMIT = 8;
const PHASE_SIGNAL_LIGHT_BOOST_MAX = 0.06;
const PHASE_SIGNAL_REM_BOOST_MAX = 0.09;
const PHASE_SIGNAL_HALF_LIFE_DAYS = 14;
const DREAMING_TRANSCRIPT_PROMPT_LINE_RE =
  /\[[^\]]*dreaming-narrative[^\]]*]\s*(?:User|Assistant):\s*Write a dream diary entry from these memory fragments:?/i;
const RAW_SESSION_METADATA_RE =
  /\bSession Key\b.{0,260}\bSession ID\b|\bSession ID\b.{0,260}\bSession Key\b/i;
const RAW_CONVERSATION_SUMMARY_RE = /^(?:[-*+]\s*)?Conversation Summary:/i;
const RAW_TRANSCRIPT_TURN_RE = /^(?:[-*+]\s*)?(?:user|assistant):\s/i;
const MEMORY_FLUSH_PROMPT_RE =
  /Save important context from this session to the daily memory file\.\s*STRICT RULES:/i;
const PROMOTION_SCORE_METADATA_RE =
  /\[\s*score=\d+(?:\.\d+)?\s+(?:signals=\d+\s+)?recalls=\d+\s+avg=\d+(?:\.\d+)?\s+source=memory\//i;
const DREAMING_DIFF_PREFIX_RE = /@@\s*-\d+(?:,\d+)?\s+[-*+]\s+/iy;
const GENERIC_DAY_HEADING_RE =
  /^(?:(?:mon|monday|tue|tues|tuesday|wed|wednesday|thu|thur|thurs|thursday|fri|friday|sat|saturday|sun|sunday)(?:,\s+)?)?(?:(?:jan|january|feb|february|mar|march|apr|april|may|jun|june|jul|july|aug|august|sep|sept|september|oct|october|nov|november|dec|december)\s+\d{1,2}(?:st|nd|rd|th)?(?:,\s*\d{4})?|\d{1,2}[/-]\d{1,2}(?:[/-]\d{2,4})?|\d{4}[/-]\d{2}[/-]\d{2})$/i;
const PROMOTION_LIST_MARKER_RE = /^(?:\d+\.\s+|[-*+]\s+)/;
const MANAGED_DREAMING_HEADINGS = /* @__PURE__ */ new Set(["light sleep", "rem sleep"]);
const inProcessShortTermLocks = new KeyedAsyncQueue();
const DEFAULT_PROMOTION_WEIGHTS = {
  frequency: 0.24,
  relevance: 0.3,
  diversity: 0.15,
  recency: 0.15,
  consolidation: 0.1,
  conceptual: 0.06,
};
function clampScore(value) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}
function toFiniteScore(value, fallback) {
  const num = Number(value);
  if (!Number.isFinite(num)) return fallback;
  if (num < 0 || num > 1) return fallback;
  return num;
}
function normalizeSnippet(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  return trimmed.replace(/\s+/g, " ");
}
function truncateShortTermSnippet(snippet) {
  if (snippet.length <= SHORT_TERM_RECALL_MAX_SNIPPET_CHARS) return snippet;
  return truncateUtf16Safe(snippet, SHORT_TERM_RECALL_MAX_SNIPPET_CHARS).trimEnd();
}
function enforceShortTermRecallSnippetCap(store) {
  for (const entry of Object.values(store.entries))
    entry.snippet = truncateShortTermSnippet(entry.snippet);
}
function consumeDreamingLeadPrefix(snippet) {
  let index = 0;
  while (index < snippet.length) {
    DREAMING_DIFF_PREFIX_RE.lastIndex = index;
    if (DREAMING_DIFF_PREFIX_RE.exec(snippet)) {
      index = DREAMING_DIFF_PREFIX_RE.lastIndex;
      continue;
    }
    const char = snippet[index];
    if (char === "[" || char === "(") {
      index += 1;
      while (snippet[index] === " ") index += 1;
      continue;
    }
    if (
      (char === "-" || char === "*" || char === "+" || char === ">") &&
      snippet[index + 1] === " "
    ) {
      index += 2;
      continue;
    }
    break;
  }
  return snippet.slice(index);
}
function hasDreamingNarrativeLead(snippet) {
  const withoutPrefix = consumeDreamingLeadPrefix(snippet);
  if (/^(?:Candidate|Reflections?):/i.test(withoutPrefix)) return true;
  const head = withoutPrefix.slice(0, 200);
  return /\b(?:Candidate|Reflections?):/i.test(head);
}
function isContaminatedDreamingSnippet(raw, opts = {}) {
  const snippet = normalizeSnippet(raw);
  if (!snippet) return false;
  if (
    /<!--\s*openclaw-memory-promotion:/i.test(snippet) ||
    DREAMING_TRANSCRIPT_PROMPT_LINE_RE.test(snippet) ||
    RAW_SESSION_METADATA_RE.test(snippet) ||
    RAW_CONVERSATION_SUMMARY_RE.test(snippet) ||
    (!opts.allowTranscriptTurnSnippet && RAW_TRANSCRIPT_TURN_RE.test(snippet)) ||
    MEMORY_FLUSH_PROMPT_RE.test(snippet) ||
    PROMOTION_SCORE_METADATA_RE.test(snippet)
  )
    return true;
  const hasNarrativeLead = hasDreamingNarrativeLead(snippet);
  const hasConfidence = /\bconfidence:\s*\d/i.test(snippet);
  const hasEvidence = /\bevidence:\s*(?:memory\/\.dreams\/session-corpus\/|memory\/)/i.test(
    snippet,
  );
  const hasStatus = /\bstatus:\s*staged\b/i.test(snippet);
  const hasRecalls = /\brecalls:\s*\d+\b/i.test(snippet);
  return hasNarrativeLead && hasConfidence && hasEvidence && hasStatus && hasRecalls;
}
function normalizeMemoryPath(rawPath) {
  return rawPath.replaceAll("\\", "/").replace(/^\.\//, "");
}
function buildClaimHash(snippet) {
  return createHash("sha1").update(normalizeSnippet(snippet)).digest("hex").slice(0, 12);
}
function buildEntryKey(result) {
  const base = `${result.source}:${normalizeMemoryPath(result.path)}:${result.startLine}:${result.endLine}`;
  return result.claimHash ? `${base}:${result.claimHash}` : base;
}
function hashQuery(query) {
  return createHash("sha1")
    .update(normalizeLowercaseStringOrEmpty(query))
    .digest("hex")
    .slice(0, 12);
}
function mergeQueryHashes(existing, queryHash) {
  if (!queryHash) return existing;
  const seen = /* @__PURE__ */ new Set();
  const next = existing.filter((value) => {
    if (!value || seen.has(value)) return false;
    seen.add(value);
    return true;
  });
  if (!seen.has(queryHash)) next.push(queryHash);
  if (next.length <= MAX_QUERY_HASHES) return next;
  return next.slice(next.length - MAX_QUERY_HASHES);
}
function mergeRecentDistinct(existing, nextValue, limit) {
  const seen = /* @__PURE__ */ new Set();
  const next = existing.filter((value) => {
    if (typeof value !== "string" || value.length === 0 || seen.has(value)) return false;
    seen.add(value);
    return true;
  });
  if (nextValue && !next.includes(nextValue)) next.push(nextValue);
  if (next.length <= limit) return next;
  return next.slice(next.length - limit);
}
function normalizeIsoDay(isoLike) {
  if (typeof isoLike !== "string") return null;
  return isoLike.trim().match(/^(\d{4}-\d{2}-\d{2})/)?.[1] ?? null;
}
function normalizeDistinctStrings(values, limit) {
  const seen = /* @__PURE__ */ new Set();
  const normalized = [];
  for (const value of values) {
    if (typeof value !== "string") continue;
    const trimmed = value.trim();
    if (!trimmed || seen.has(trimmed)) continue;
    seen.add(trimmed);
    normalized.push(trimmed);
    if (normalized.length >= limit) break;
  }
  return normalized;
}
function totalSignalCountForEntry(entry) {
  return (
    Math.max(0, Math.floor(entry.recallCount ?? 0)) +
    Math.max(0, Math.floor(entry.dailyCount ?? 0)) +
    Math.max(0, Math.floor(entry.groundedCount ?? 0))
  );
}
function calculateConsolidationComponent(recallDays) {
  if (recallDays.length === 0) return 0;
  if (recallDays.length === 1) return 0.2;
  const parsed = recallDays
    .map((recallDay) => Date.parse(recallDay + "T00:00:00.000Z"))
    .filter((value) => Number.isFinite(value))
    .toSorted((left, right) => left - right);
  if (parsed.length <= 1) return 0.2;
  const first = expectDefined(parsed.at(0), "multiple parsed recall days");
  const last = expectDefined(parsed.at(-1), "multiple parsed recall days");
  const spanDays = Math.max(0, (last - first) / DAY_MS);
  const spacing = clampScore(Math.log1p(parsed.length - 1) / Math.log1p(4));
  const span = clampScore(spanDays / 7);
  return clampScore(0.55 * spacing + 0.45 * span);
}
function calculateConceptualComponent(conceptTags) {
  return clampScore(conceptTags.length / 6);
}
function emptyStore(nowIso) {
  return {
    version: 1,
    updatedAt: nowIso,
    entries: {},
  };
}
function normalizeShortTermRecallStore(raw, nowIso) {
  if (!raw || typeof raw !== "object") return emptyStore(nowIso);
  const record = raw;
  const entriesRaw = record.entries;
  const entries = {};
  if (entriesRaw && typeof entriesRaw === "object")
    for (const [key, value] of Object.entries(entriesRaw)) {
      if (!value || typeof value !== "object") continue;
      const entry = value;
      const entryPath = typeof entry.path === "string" ? normalizeMemoryPath(entry.path) : "";
      const startLine = Number(entry.startLine);
      const endLine = Number(entry.endLine);
      const source = entry.source === "memory" ? "memory" : null;
      if (!entryPath || !Number.isInteger(startLine) || !Number.isInteger(endLine) || !source)
        continue;
      const recallCount = Math.max(0, Math.floor(Number(entry.recallCount) || 0));
      const dailyCount = Math.max(0, Math.floor(Number(entry.dailyCount) || 0));
      const groundedCount = Math.max(0, Math.floor(Number(entry.groundedCount) || 0));
      const totalScore = Math.max(0, Number(entry.totalScore) || 0);
      const maxScore = clampScore(Number(entry.maxScore) || 0);
      const firstRecalledAt =
        typeof entry.firstRecalledAt === "string" ? entry.firstRecalledAt : nowIso;
      const lastRecalledAt =
        typeof entry.lastRecalledAt === "string" ? entry.lastRecalledAt : nowIso;
      const promotedAt = typeof entry.promotedAt === "string" ? entry.promotedAt : void 0;
      const claimHash =
        typeof entry.claimHash === "string" && entry.claimHash.trim().length > 0
          ? entry.claimHash.trim()
          : void 0;
      const fullSnippet = typeof entry.snippet === "string" ? normalizeSnippet(entry.snippet) : "";
      if (
        fullSnippet &&
        isContaminatedDreamingSnippet(fullSnippet, {
          allowTranscriptTurnSnippet: isShortTermSessionCorpusPath(entryPath),
        })
      )
        continue;
      const snippet = truncateShortTermSnippet(fullSnippet);
      const queryHashes = Array.isArray(entry.queryHashes)
        ? normalizeDistinctStrings(entry.queryHashes, MAX_QUERY_HASHES)
        : [];
      const recallDays = Array.isArray(entry.recallDays)
        ? entry.recallDays
            .map((recallDay) => (typeof recallDay === "string" ? normalizeIsoDay(recallDay) : null))
            .filter((valueLocal) => valueLocal !== null)
        : [];
      const conceptTags = Array.isArray(entry.conceptTags)
        ? normalizeDistinctStrings(
            entry.conceptTags.map((tag) =>
              typeof tag === "string" ? normalizeLowercaseStringOrEmpty(tag) : tag,
            ),
            8,
          )
        : deriveConceptTags({
            path: entryPath,
            snippet: fullSnippet,
          });
      const normalizedKey =
        key ||
        buildEntryKey({
          path: entryPath,
          startLine,
          endLine,
          source,
          claimHash,
        });
      entries[normalizedKey] = {
        key: normalizedKey,
        path: entryPath,
        startLine,
        endLine,
        source,
        snippet,
        recallCount,
        dailyCount,
        groundedCount,
        totalScore,
        maxScore,
        firstRecalledAt,
        lastRecalledAt,
        queryHashes,
        recallDays: recallDays.slice(-16),
        conceptTags,
        ...(claimHash ? { claimHash } : {}),
        ...(promotedAt ? { promotedAt } : {}),
      };
    }
  return {
    version: 1,
    updatedAt: typeof record.updatedAt === "string" ? record.updatedAt : nowIso,
    entries,
  };
}
function parseStoreTimestampMs(value) {
  if (!value) return Number.NEGATIVE_INFINITY;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : Number.NEGATIVE_INFINITY;
}
function compareStoreTimestampDesc(left, right) {
  const leftMs = parseStoreTimestampMs(left);
  const rightMs = parseStoreTimestampMs(right);
  if (leftMs === rightMs) return 0;
  return rightMs > leftMs ? 1 : -1;
}
function compareShortTermRecallRetention(a, b) {
  const lastDiff = compareStoreTimestampDesc(a.lastRecalledAt, b.lastRecalledAt);
  if (lastDiff !== 0) return lastDiff;
  const signalDiff = totalSignalCountForEntry(b) - totalSignalCountForEntry(a);
  if (signalDiff !== 0) return signalDiff;
  const totalScoreDiff = b.totalScore - a.totalScore;
  if (totalScoreDiff !== 0) return totalScoreDiff;
  const maxScoreDiff = b.maxScore - a.maxScore;
  if (maxScoreDiff !== 0) return maxScoreDiff;
  const promotedDiff = compareStoreTimestampDesc(a.promotedAt, b.promotedAt);
  if (promotedDiff !== 0) return promotedDiff;
  return a.key.localeCompare(b.key);
}
function enforceShortTermRecallStoreRetention(store) {
  const entries = Object.entries(store.entries);
  if (entries.length <= SHORT_TERM_RECALL_MAX_ENTRIES) return 0;
  const retained = entries
    .toSorted(([, a], [, b]) => compareShortTermRecallRetention(a, b))
    .slice(0, SHORT_TERM_RECALL_MAX_ENTRIES);
  store.entries = Object.fromEntries(retained.toSorted(([a], [b]) => a.localeCompare(b)));
  return entries.length - retained.length;
}
function toFinitePositive(value, fallback) {
  const num = Number(value);
  if (!Number.isFinite(num) || num <= 0) return fallback;
  return num;
}
function toFiniteNonNegativeInt(value, fallback) {
  const num = Number(value);
  if (!Number.isFinite(num)) return fallback;
  const floored = Math.floor(num);
  if (floored < 0) return fallback;
  return floored;
}
function normalizeWeights(weights) {
  const merged = {
    ...DEFAULT_PROMOTION_WEIGHTS,
    ...weights,
  };
  const frequency = Math.max(0, merged.frequency);
  const relevance = Math.max(0, merged.relevance);
  const diversity = Math.max(0, merged.diversity);
  const recency = Math.max(0, merged.recency);
  const consolidation = Math.max(0, merged.consolidation);
  const conceptual = Math.max(0, merged.conceptual);
  const sum = frequency + relevance + diversity + recency + consolidation + conceptual;
  if (sum <= 0) return { ...DEFAULT_PROMOTION_WEIGHTS };
  return {
    frequency: frequency / sum,
    relevance: relevance / sum,
    diversity: diversity / sum,
    recency: recency / sum,
    consolidation: consolidation / sum,
    conceptual: conceptual / sum,
  };
}
function calculateRecencyComponent(ageDays, halfLifeDays) {
  if (!Number.isFinite(ageDays) || ageDays < 0) return 1;
  if (!Number.isFinite(halfLifeDays) || halfLifeDays <= 0) return 1;
  const lambda = Math.LN2 / halfLifeDays;
  return Math.exp(-lambda * ageDays);
}
function calculatePhaseSignalAgeDays(lastSeenAt, nowMs) {
  if (!lastSeenAt) return null;
  const parsed = Date.parse(lastSeenAt);
  if (!Number.isFinite(parsed)) return null;
  return Math.max(0, (nowMs - parsed) / DAY_MS);
}
function calculatePhaseSignalBoost(entry, nowMs) {
  if (!entry) return 0;
  const lightStrength = clampScore(Math.log1p(Math.max(0, entry.lightHits)) / Math.log1p(6));
  const remStrength = clampScore(Math.log1p(Math.max(0, entry.remHits)) / Math.log1p(6));
  const lightAgeDays = calculatePhaseSignalAgeDays(entry.lastLightAt, nowMs);
  const remAgeDays = calculatePhaseSignalAgeDays(entry.lastRemAt, nowMs);
  const lightRecency =
    lightAgeDays === null
      ? 0
      : clampScore(calculateRecencyComponent(lightAgeDays, PHASE_SIGNAL_HALF_LIFE_DAYS));
  const remRecency =
    remAgeDays === null
      ? 0
      : clampScore(calculateRecencyComponent(remAgeDays, PHASE_SIGNAL_HALF_LIFE_DAYS));
  return clampScore(
    PHASE_SIGNAL_LIGHT_BOOST_MAX * lightStrength * lightRecency +
      PHASE_SIGNAL_REM_BOOST_MAX * remStrength * remRecency,
  );
}
function resolveStorePath(workspaceDir) {
  return memoryCoreStateReference(SHORT_TERM_RECALL_NAMESPACE, workspaceDir);
}
function resolvePhaseSignalPath(workspaceDir) {
  return memoryCoreStateReference(SHORT_TERM_PHASE_SIGNAL_NAMESPACE, workspaceDir);
}
function resolveLockPath(workspaceDir) {
  return memoryCoreStateReference(SHORT_TERM_LOCK_NAMESPACE, workspaceDir);
}
function parseLockOwnerPid(raw) {
  const match = raw.trim().match(/^(\d+):/);
  if (!match) return null;
  const pid = Number.parseInt(match[1] ?? "", 10);
  if (!Number.isInteger(pid) || pid <= 0) return null;
  return pid;
}
function isProcessLikelyAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (err) {
    if (err.code === "ESRCH") return false;
    return true;
  }
}
async function withInProcessShortTermLock(lockPath, task) {
  return await inProcessShortTermLocks.enqueue(lockPath, task);
}
async function withShortTermLock(workspaceDir, task) {
  const lockKey = memoryCoreWorkspaceStateKey(workspaceDir);
  const lockRef = resolveLockPath(workspaceDir);
  const lockStore = openMemoryCoreStateStore({
    namespace: SHORT_TERM_LOCK_NAMESPACE,
    maxEntries: SHORT_TERM_LOCK_MAX_ENTRIES,
  });
  return withInProcessShortTermLock(lockKey, async () => {
    const startedAt = Date.now();
    while (true) {
      const owner = `${process.pid}:${Date.now()}`;
      if (
        await lockStore.registerIfAbsent(lockKey, {
          owner,
          acquiredAt: Date.now(),
        })
      )
        try {
          return await task();
        } finally {
          if ((await lockStore.lookup(lockKey).catch(() => void 0))?.owner === owner)
            await lockStore.delete(lockKey).catch(() => false);
        }
      const existing = await lockStore.lookup(lockKey);
      if (existing && Date.now() - existing.acquiredAt > SHORT_TERM_LOCK_STALE_MS) {
        const ownerPid = parseLockOwnerPid(existing.owner);
        if (ownerPid === null || !isProcessLikelyAlive(ownerPid)) {
          await lockStore.delete(lockKey);
          continue;
        }
      }
      if (Date.now() - startedAt >= SHORT_TERM_LOCK_WAIT_TIMEOUT_MS)
        throw new Error(`Timed out waiting for short-term promotion lock at ${lockRef}`);
      await sleep(SHORT_TERM_LOCK_RETRY_DELAY_MS);
    }
  });
}
async function readStore(workspaceDir, nowIso) {
  const [entryRows, metaRows] = await Promise.all([
    readMemoryCoreWorkspaceEntries({
      namespace: SHORT_TERM_RECALL_NAMESPACE,
      workspaceDir,
    }),
    readMemoryCoreWorkspaceEntries({
      namespace: SHORT_TERM_META_NAMESPACE,
      workspaceDir,
    }),
  ]);
  const meta = metaRows.find((entry) => entry.key === "recall")?.value;
  const store = normalizeShortTermRecallStore(
    {
      version: 1,
      updatedAt: meta?.updatedAt ?? nowIso,
      entries: Object.fromEntries(entryRows.map((entry) => [entry.key, entry.value])),
    },
    nowIso,
  );
  enforceShortTermRecallStoreRetention(store);
  return store;
}
function emptyPhaseSignalStore(nowIso) {
  return {
    version: 1,
    updatedAt: nowIso,
    entries: {},
  };
}
function normalizeShortTermPhaseSignalStore(raw, nowIso) {
  const record = asNullableRecord(raw);
  if (!record) return emptyPhaseSignalStore(nowIso);
  const entriesRaw = asNullableRecord(record?.entries);
  if (!entriesRaw) return emptyPhaseSignalStore(nowIso);
  const entries = {};
  for (const [mapKey, value] of Object.entries(entriesRaw)) {
    const entry = asNullableRecord(value);
    if (!entry) continue;
    const key = typeof entry.key === "string" && entry.key.trim().length > 0 ? entry.key : mapKey;
    const lightHits = toFiniteNonNegativeInt(entry.lightHits, 0);
    const remHits = toFiniteNonNegativeInt(entry.remHits, 0);
    if (lightHits === 0 && remHits === 0) continue;
    const lastLightAt =
      typeof entry.lastLightAt === "string" && entry.lastLightAt.trim().length > 0
        ? entry.lastLightAt
        : void 0;
    const lastRemAt =
      typeof entry.lastRemAt === "string" && entry.lastRemAt.trim().length > 0
        ? entry.lastRemAt
        : void 0;
    const lastRemConsideredAt =
      typeof entry.lastRemConsideredAt === "string" && entry.lastRemConsideredAt.trim().length > 0
        ? entry.lastRemConsideredAt
        : void 0;
    entries[key] = {
      key,
      lightHits,
      remHits,
      ...(lastLightAt ? { lastLightAt } : {}),
      ...(lastRemAt ? { lastRemAt } : {}),
      ...(lastRemConsideredAt ? { lastRemConsideredAt } : {}),
    };
  }
  return {
    version: 1,
    updatedAt:
      typeof record.updatedAt === "string" && record.updatedAt.trim().length > 0
        ? record.updatedAt
        : nowIso,
    entries,
  };
}
async function readPhaseSignalStore(workspaceDir, nowIso) {
  const [entryRows, metaRows] = await Promise.all([
    readMemoryCoreWorkspaceEntries({
      namespace: SHORT_TERM_PHASE_SIGNAL_NAMESPACE,
      workspaceDir,
    }),
    readMemoryCoreWorkspaceEntries({
      namespace: SHORT_TERM_META_NAMESPACE,
      workspaceDir,
    }),
  ]);
  const meta = metaRows.find((entry) => entry.key === "phase")?.value;
  return normalizeShortTermPhaseSignalStore(
    {
      version: 1,
      updatedAt: meta?.updatedAt ?? nowIso,
      entries: Object.fromEntries(entryRows.map((entry) => [entry.key, entry.value])),
    },
    nowIso,
  );
}
async function writePhaseSignalStore(workspaceDir, store) {
  await Promise.all([
    writeMemoryCoreWorkspaceEntries({
      namespace: SHORT_TERM_PHASE_SIGNAL_NAMESPACE,
      workspaceDir,
      entries: Object.entries(store.entries).map(([key, value]) => ({
        key,
        value,
      })),
    }),
    writeMemoryCoreWorkspaceEntry({
      namespace: SHORT_TERM_META_NAMESPACE,
      workspaceDir,
      key: "phase",
      value: { updatedAt: store.updatedAt },
    }),
  ]);
}
async function writeStore(workspaceDir, store) {
  enforceShortTermRecallSnippetCap(store);
  enforceShortTermRecallStoreRetention(store);
  await Promise.all([
    writeMemoryCoreWorkspaceEntries({
      namespace: SHORT_TERM_RECALL_NAMESPACE,
      workspaceDir,
      entries: Object.entries(store.entries).map(([key, value]) => ({
        key,
        value,
      })),
    }),
    writeMemoryCoreWorkspaceEntry({
      namespace: SHORT_TERM_META_NAMESPACE,
      workspaceDir,
      key: "recall",
      value: { updatedAt: store.updatedAt },
    }),
  ]);
}
function isShortTermMemoryPath(filePath) {
  const normalized = normalizeMemoryPath(filePath);
  if (DREAMING_MEMORY_PATH_RE.test(normalized)) return false;
  if (SHORT_TERM_PATH_RE.test(normalized)) return true;
  if (SHORT_TERM_SESSION_CORPUS_RE.test(normalized)) return true;
  return SHORT_TERM_BASENAME_RE.test(normalized);
}
function isShortTermSessionCorpusPath(filePath) {
  return SHORT_TERM_SESSION_CORPUS_RE.test(normalizeMemoryPath(filePath));
}
function normalizeMemoryPathForWorkspace(workspaceDir, rawPath) {
  const normalized = normalizeMemoryPath(rawPath);
  const workspaceNormalized = normalizeMemoryPath(workspaceDir);
  if (path.isAbsolute(rawPath) && normalized.startsWith(`${workspaceNormalized}/`))
    return normalized.slice(workspaceNormalized.length + 1);
  return normalized;
}
function toNonNegativeInt(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return 0;
  return Math.max(0, Math.floor(num));
}
function parseEntryRangeFromKey(key, fallbackStartLine, fallbackEndLine) {
  const startLine = toNonNegativeInt(fallbackStartLine);
  const endLine = toNonNegativeInt(fallbackEndLine);
  if (startLine > 0 && endLine > 0)
    return {
      startLine,
      endLine,
    };
  const match = key.match(/:(\d+):(\d+)$/);
  if (match)
    return {
      startLine: Math.max(1, toNonNegativeInt(match[1])),
      endLine: Math.max(1, toNonNegativeInt(match[2])),
    };
  return {
    startLine: 1,
    endLine: 1,
  };
}
function compareDreamingStatsEntryByRecency(a, b) {
  const aMs = a.lastRecalledAt ? Date.parse(a.lastRecalledAt) : Number.NEGATIVE_INFINITY;
  const bMs = b.lastRecalledAt ? Date.parse(b.lastRecalledAt) : Number.NEGATIVE_INFINITY;
  if (Number.isFinite(aMs) || Number.isFinite(bMs)) {
    if (bMs !== aMs) return bMs - aMs;
  }
  if (b.totalSignalCount !== a.totalSignalCount) return b.totalSignalCount - a.totalSignalCount;
  return a.path.localeCompare(b.path);
}
function compareDreamingStatsEntryBySignals(a, b) {
  if (b.totalSignalCount !== a.totalSignalCount) return b.totalSignalCount - a.totalSignalCount;
  if (b.phaseHitCount !== a.phaseHitCount) return b.phaseHitCount - a.phaseHitCount;
  return compareDreamingStatsEntryByRecency(a, b);
}
function compareDreamingStatsEntryByPromotion(a, b) {
  const aMs = a.promotedAt ? Date.parse(a.promotedAt) : Number.NEGATIVE_INFINITY;
  const bMs = b.promotedAt ? Date.parse(b.promotedAt) : Number.NEGATIVE_INFINITY;
  if (Number.isFinite(aMs) || Number.isFinite(bMs)) {
    if (bMs !== aMs) return bMs - aMs;
  }
  return compareDreamingStatsEntryBySignals(a, b);
}
function trimDreamingStatsEntries(entries, compare) {
  const selected = [];
  for (const entry of entries) {
    let insertAt = selected.length;
    for (let index = 0; index < selected.length; index += 1)
      if (compare(entry, expectDefined(selected[index], "selected dreaming stats index")) < 0) {
        insertAt = index;
        break;
      }
    if (insertAt < DREAMING_ENTRY_LIST_LIMIT) {
      selected.splice(insertAt, 0, entry);
      if (selected.length > DREAMING_ENTRY_LIST_LIMIT) selected.pop();
    } else if (selected.length < DREAMING_ENTRY_LIST_LIMIT) selected.push(entry);
  }
  return selected;
}
async function loadShortTermPromotionDreamingStats(params) {
  const workspaceDir = params.workspaceDir.trim();
  const nowIso = new Date(params.nowMs).toISOString();
  const store = await readStore(workspaceDir, nowIso);
  let phaseSignalError;
  let phaseStore;
  try {
    phaseStore = await readPhaseSignalStore(workspaceDir, nowIso);
  } catch (err) {
    phaseSignalError = formatErrorMessage(err);
    phaseStore = emptyPhaseSignalStore(nowIso);
  }
  let shortTermCount = 0;
  let recallSignalCount = 0;
  let dailySignalCount = 0;
  let groundedSignalCount = 0;
  let totalSignalCount = 0;
  let phaseSignalCount = 0;
  let lightPhaseHitCount = 0;
  let remPhaseHitCount = 0;
  let promotedTotal = 0;
  let promotedToday = 0;
  let latestPromotedAtMs = Number.NEGATIVE_INFINITY;
  let latestPromotedAt;
  const activeKeys = /* @__PURE__ */ new Set();
  const activeEntries = /* @__PURE__ */ new Map();
  const shortTermEntries = [];
  const promotedEntries = [];
  for (const [entryKey, entry] of Object.entries(store.entries)) {
    if (entry.source !== "memory" || !entry.path || !isShortTermMemoryPath(entry.path)) continue;
    const range = parseEntryRangeFromKey(entryKey, entry.startLine, entry.endLine);
    const recallCount = toNonNegativeInt(entry.recallCount);
    const dailyCount = toNonNegativeInt(entry.dailyCount);
    const groundedCount = toNonNegativeInt(entry.groundedCount);
    const totalEntrySignalCount = recallCount + dailyCount + groundedCount;
    const normalizedEntryPath = normalizeMemoryPathForWorkspace(workspaceDir, entry.path);
    const detail = {
      key: entryKey,
      path: normalizedEntryPath,
      startLine: range.startLine,
      endLine: Math.max(range.startLine, range.endLine),
      snippet: normalizeSnippet(entry.snippet) || normalizedEntryPath,
      recallCount,
      dailyCount,
      groundedCount,
      totalSignalCount: totalEntrySignalCount,
      lightHits: 0,
      remHits: 0,
      phaseHitCount: 0,
      ...(entry.lastRecalledAt ? { lastRecalledAt: entry.lastRecalledAt } : {}),
    };
    if (!entry.promotedAt) {
      shortTermCount += 1;
      activeKeys.add(entryKey);
      recallSignalCount += recallCount;
      dailySignalCount += dailyCount;
      groundedSignalCount += groundedCount;
      totalSignalCount += totalEntrySignalCount;
      shortTermEntries.push(detail);
      activeEntries.set(entryKey, detail);
      continue;
    }
    promotedTotal += 1;
    promotedEntries.push({
      ...detail,
      promotedAt: entry.promotedAt,
    });
    const promotedAtMs = Date.parse(entry.promotedAt);
    if (
      Number.isFinite(promotedAtMs) &&
      isSameMemoryDreamingDay(promotedAtMs, params.nowMs, params.timezone)
    )
      promotedToday += 1;
    if (Number.isFinite(promotedAtMs) && promotedAtMs > latestPromotedAtMs) {
      latestPromotedAtMs = promotedAtMs;
      latestPromotedAt = entry.promotedAt;
    }
  }
  for (const [key, phaseEntry] of Object.entries(phaseStore.entries)) {
    if (!activeKeys.has(key)) continue;
    const lightHits = toNonNegativeInt(phaseEntry.lightHits);
    const remHits = toNonNegativeInt(phaseEntry.remHits);
    lightPhaseHitCount += lightHits;
    remPhaseHitCount += remHits;
    phaseSignalCount += lightHits + remHits;
    const detail = activeEntries.get(key);
    if (detail) {
      detail.lightHits = lightHits;
      detail.remHits = remHits;
      detail.phaseHitCount = lightHits + remHits;
    }
  }
  return {
    shortTermCount,
    recallSignalCount,
    dailySignalCount,
    groundedSignalCount,
    totalSignalCount,
    phaseSignalCount,
    lightPhaseHitCount,
    remPhaseHitCount,
    promotedTotal,
    promotedToday,
    storePath: resolveStorePath(workspaceDir),
    phaseSignalPath: resolvePhaseSignalPath(workspaceDir),
    shortTermEntries: trimDreamingStatsEntries(
      shortTermEntries,
      compareDreamingStatsEntryByRecency,
    ),
    signalEntries: trimDreamingStatsEntries(shortTermEntries, compareDreamingStatsEntryBySignals),
    promotedEntries: trimDreamingStatsEntries(
      promotedEntries,
      compareDreamingStatsEntryByPromotion,
    ),
    ...(phaseSignalError ? { phaseSignalError } : {}),
    ...(latestPromotedAt ? { lastPromotedAt: latestPromotedAt } : {}),
  };
}
async function shortTermRecallSourceIsFile(sourcePath) {
  try {
    return (await fs.stat(sourcePath)).isFile();
  } catch (err) {
    if (err.code === "ENOENT") return false;
    throw err;
  }
}
async function filterLiveShortTermRecallEntries(params) {
  const workspaceDir = params.workspaceDir.trim();
  if (!workspaceDir) return [];
  const sourceFileChecks = /* @__PURE__ */ new Map();
  const sourceFileLimit = pLimit(SHORT_TERM_SOURCE_FILE_CHECK_CONCURRENCY);
  const checkSourceFile = (sourcePath) => {
    const existing = sourceFileChecks.get(sourcePath);
    if (existing) return existing;
    const check = sourceFileLimit(() => shortTermRecallSourceIsFile(sourcePath));
    sourceFileChecks.set(sourcePath, check);
    return check;
  };
  return (
    await Promise.all(
      params.entries.map(async (entry) => {
        let exists = false;
        for (const sourcePath of resolveShortTermSourcePathCandidates(workspaceDir, entry.path))
          if (await checkSourceFile(sourcePath)) {
            exists = true;
            break;
          }
        return {
          entry,
          exists,
        };
      }),
    )
  )
    .filter((result) => result.exists)
    .map((result) => result.entry);
}
function buildMemoryRecallSkippedEvent(params) {
  return {
    type: "memory.recall.skipped",
    timestamp: params.timestamp,
    query: params.query,
    reason: "non-short-term-memory-path",
    eligibleResultCount: params.eligibleResultCount,
    skippedResultCount: params.skipped.length,
    results: params.skipped.map((result) => ({
      path: normalizeMemoryPath(result.path),
      startLine: Math.max(1, Math.floor(result.startLine)),
      endLine: Math.max(1, Math.floor(result.endLine)),
      score: clampScore(result.score),
      reason: "non-short-term-memory-path",
    })),
  };
}
async function recordShortTermRecalls(params) {
  const workspaceDir = params.workspaceDir?.trim();
  if (!workspaceDir) return;
  const query = params.query.trim();
  if (!query) return;
  const memoryResults = params.results.filter((result) => result.source === "memory");
  const relevant = memoryResults.filter((result) => isShortTermMemoryPath(result.path));
  const skipped = memoryResults.filter((result) => !isShortTermMemoryPath(result.path));
  if (relevant.length === 0 && skipped.length === 0) return;
  const nowMs = resolveMemoryCoreNowMs(params.nowMs);
  const nowIso = resolveMemoryCoreTimestamp(nowMs);
  if (relevant.length === 0) {
    await appendMemoryHostEvent(
      workspaceDir,
      buildMemoryRecallSkippedEvent({
        timestamp: nowIso,
        query,
        eligibleResultCount: relevant.length,
        skipped,
      }),
    );
    return;
  }
  const signalType = params.signalType ?? "recall";
  const queryHash = hashQuery(query);
  const todayBucket =
    normalizeIsoDay(params.dayBucket ?? "") ?? formatMemoryDreamingDay(nowMs, params.timezone);
  await withShortTermLock(workspaceDir, async () => {
    const store = await readStore(workspaceDir, nowIso);
    for (const result of relevant) {
      const normalizedPath = normalizeMemoryPath(result.path);
      const rawSnippet = normalizeSnippet(result.snippet);
      const snippet = truncateShortTermSnippet(rawSnippet);
      if (
        !rawSnippet ||
        isContaminatedDreamingSnippet(rawSnippet, {
          allowTranscriptTurnSnippet: isShortTermSessionCorpusPath(normalizedPath),
        })
      )
        continue;
      const claimHash = buildClaimHash(rawSnippet);
      const groundedKey = claimHash
        ? buildEntryKey({
            path: normalizedPath,
            startLine: Math.max(1, Math.floor(result.startLine)),
            endLine: Math.max(1, Math.floor(result.endLine)),
            source: "memory",
            claimHash,
          })
        : null;
      const baseKey = buildEntryKey(result);
      const key = groundedKey && store.entries[groundedKey] ? groundedKey : baseKey;
      const existing = store.entries[key];
      const score = clampScore(result.score);
      const recallDaysBase = existing?.recallDays ?? [];
      const queryHashesBase = existing?.queryHashes ?? [];
      const dedupeSignal =
        Boolean(params.dedupeByQueryPerDay) &&
        queryHashesBase.includes(queryHash) &&
        recallDaysBase.includes(todayBucket);
      const recallCount =
        signalType === "recall"
          ? Math.max(0, Math.floor(existing?.recallCount ?? 0) + (dedupeSignal ? 0 : 1))
          : Math.max(0, Math.floor(existing?.recallCount ?? 0));
      const dailyCount =
        signalType === "daily"
          ? Math.max(0, Math.floor(existing?.dailyCount ?? 0) + (dedupeSignal ? 0 : 1))
          : Math.max(0, Math.floor(existing?.dailyCount ?? 0));
      const totalScore = Math.max(0, (existing?.totalScore ?? 0) + (dedupeSignal ? 0 : score));
      const maxScore = Math.max(existing?.maxScore ?? 0, dedupeSignal ? 0 : score);
      const queryHashes = mergeQueryHashes(existing?.queryHashes ?? [], queryHash);
      const recallDays = mergeRecentDistinct(recallDaysBase, todayBucket, MAX_RECALL_DAYS);
      const conceptTags = deriveConceptTags({
        path: normalizedPath,
        snippet,
      });
      const lastRecalledAt =
        Boolean(params.dedupeByQueryPerDay) &&
        queryHashesBase.includes(queryHash) &&
        existing?.snippet === snippet
          ? (existing?.lastRecalledAt ?? nowIso)
          : nowIso;
      store.entries[key] = {
        key,
        path: normalizedPath,
        startLine: Math.max(1, Math.floor(result.startLine)),
        endLine: Math.max(1, Math.floor(result.endLine)),
        source: "memory",
        snippet: snippet || existing?.snippet || "",
        recallCount,
        dailyCount,
        groundedCount: Math.max(0, Math.floor(existing?.groundedCount ?? 0)),
        totalScore,
        maxScore,
        firstRecalledAt: existing?.firstRecalledAt ?? nowIso,
        lastRecalledAt,
        queryHashes,
        recallDays,
        conceptTags: conceptTags.length > 0 ? conceptTags : (existing?.conceptTags ?? []),
        ...(existing?.claimHash ? { claimHash: existing.claimHash } : {}),
        ...(existing?.promotedAt ? { promotedAt: existing.promotedAt } : {}),
      };
    }
    store.updatedAt = nowIso;
    await writeStore(workspaceDir, store);
    await appendMemoryHostEvent(workspaceDir, {
      type: "memory.recall.recorded",
      timestamp: nowIso,
      query,
      resultCount: relevant.length,
      results: relevant.map((result) => ({
        path: normalizeMemoryPath(result.path),
        startLine: Math.max(1, Math.floor(result.startLine)),
        endLine: Math.max(1, Math.floor(result.endLine)),
        score: clampScore(result.score),
      })),
    });
    if (skipped.length > 0)
      await appendMemoryHostEvent(
        workspaceDir,
        buildMemoryRecallSkippedEvent({
          timestamp: nowIso,
          query,
          eligibleResultCount: relevant.length,
          skipped,
        }),
      );
  });
}
async function recordGroundedShortTermCandidates(params) {
  const workspaceDir = params.workspaceDir?.trim();
  if (!workspaceDir) return;
  const query = params.query.trim();
  if (!query) return;
  const relevant = params.items
    .map((item) => {
      const rawSnippet = normalizeSnippet(item.snippet);
      const snippet = truncateShortTermSnippet(rawSnippet);
      const normalizedPath = normalizeMemoryPath(item.path);
      if (
        !rawSnippet ||
        isContaminatedDreamingSnippet(rawSnippet) ||
        !normalizedPath ||
        !isShortTermMemoryPath(normalizedPath) ||
        !Number.isFinite(item.startLine) ||
        !Number.isFinite(item.endLine)
      )
        return null;
      return {
        path: normalizedPath,
        startLine: Math.max(1, Math.floor(item.startLine)),
        endLine: Math.max(1, Math.floor(item.endLine)),
        snippet,
        identitySnippet: rawSnippet,
        score: clampScore(item.score),
        query: normalizeSnippet(item.query ?? query),
        signalCount: Math.max(1, Math.floor(item.signalCount ?? 1)),
        dayBucket: normalizeIsoDay(item.dayBucket ?? params.dayBucket ?? ""),
      };
    })
    .filter((item) => item !== null);
  if (relevant.length === 0) return;
  const nowMs = resolveMemoryCoreNowMs(params.nowMs);
  const nowIso = resolveMemoryCoreTimestamp(nowMs);
  const fallbackDayBucket = formatMemoryDreamingDay(nowMs, params.timezone);
  await withShortTermLock(workspaceDir, async () => {
    const store = await readStore(workspaceDir, nowIso);
    for (const item of relevant) {
      const dayBucket = item.dayBucket ?? fallbackDayBucket;
      const effectiveQuery = item.query || query;
      if (!effectiveQuery) continue;
      const queryHash = hashQuery(effectiveQuery);
      const claimHash = buildClaimHash(item.identitySnippet);
      const key = buildEntryKey({
        path: item.path,
        startLine: item.startLine,
        endLine: item.endLine,
        source: "memory",
        claimHash,
      });
      const existing = store.entries[key];
      const recallDaysBase = existing?.recallDays ?? [];
      const queryHashesBase = existing?.queryHashes ?? [];
      const dedupeSignal =
        Boolean(params.dedupeByQueryPerDay) &&
        queryHashesBase.includes(queryHash) &&
        recallDaysBase.includes(dayBucket);
      const groundedCount = Math.max(
        0,
        Math.floor(existing?.groundedCount ?? 0) + (dedupeSignal ? 0 : item.signalCount),
      );
      const totalScore = Math.max(
        0,
        (existing?.totalScore ?? 0) + (dedupeSignal ? 0 : item.score * item.signalCount),
      );
      const maxScore = Math.max(existing?.maxScore ?? 0, dedupeSignal ? 0 : item.score);
      const queryHashes = mergeQueryHashes(existing?.queryHashes ?? [], queryHash);
      const recallDays = mergeRecentDistinct(recallDaysBase, dayBucket, MAX_RECALL_DAYS);
      const conceptTags = deriveConceptTags({
        path: item.path,
        snippet: item.snippet,
      });
      const lastRecalledAt =
        Boolean(params.dedupeByQueryPerDay) &&
        queryHashesBase.includes(queryHash) &&
        existing?.snippet === item.snippet
          ? (existing?.lastRecalledAt ?? nowIso)
          : nowIso;
      store.entries[key] = {
        key,
        path: item.path,
        startLine: item.startLine,
        endLine: item.endLine,
        source: "memory",
        snippet: item.snippet,
        recallCount: Math.max(0, Math.floor(existing?.recallCount ?? 0)),
        dailyCount: Math.max(0, Math.floor(existing?.dailyCount ?? 0)),
        groundedCount,
        totalScore,
        maxScore,
        firstRecalledAt: existing?.firstRecalledAt ?? nowIso,
        lastRecalledAt,
        queryHashes,
        recallDays,
        conceptTags: conceptTags.length > 0 ? conceptTags : (existing?.conceptTags ?? []),
        claimHash,
        ...(existing?.promotedAt ? { promotedAt: existing.promotedAt } : {}),
      };
    }
    store.updatedAt = nowIso;
    await writeStore(workspaceDir, store);
  });
}
async function recordDreamingPhaseSignals(params) {
  const workspaceDir = params.workspaceDir?.trim();
  if (!workspaceDir) return;
  const keys = uniqueStrings(normalizeStringEntries(params.keys));
  if (keys.length === 0) return;
  const nowIso = resolveMemoryCoreTimestamp(resolveMemoryCoreNowMs(params.nowMs));
  await withShortTermLock(workspaceDir, async () => {
    const [store, phaseSignals] = await Promise.all([
      readStore(workspaceDir, nowIso),
      readPhaseSignalStore(workspaceDir, nowIso),
    ]);
    const knownKeys = new Set(Object.keys(store.entries));
    for (const key of keys) {
      if (!knownKeys.has(key)) continue;
      const entry = phaseSignals.entries[key] ?? {
        key,
        lightHits: 0,
        remHits: 0,
      };
      if (params.phase === "light") {
        entry.lightHits = Math.min(9999, entry.lightHits + 1);
        entry.lastLightAt = nowIso;
      } else {
        entry.remHits = Math.min(9999, entry.remHits + 1);
        entry.lastRemAt = nowIso;
      }
      phaseSignals.entries[key] = entry;
    }
    for (const [key, entry] of Object.entries(phaseSignals.entries))
      if (!knownKeys.has(key) || (entry.lightHits <= 0 && entry.remHits <= 0))
        delete phaseSignals.entries[key];
    phaseSignals.updatedAt = nowIso;
    await writePhaseSignalStore(workspaceDir, phaseSignals);
  });
}
async function recordRemConsideredPhaseSignals(params) {
  const workspaceDir = params.workspaceDir?.trim();
  if (!workspaceDir) return;
  const keys = uniqueStrings(normalizeStringEntries(params.keys));
  if (keys.length === 0) return;
  const nowIso = resolveMemoryCoreTimestamp(resolveMemoryCoreNowMs(params.nowMs));
  await withShortTermLock(workspaceDir, async () => {
    const [store, phaseSignals] = await Promise.all([
      readStore(workspaceDir, nowIso),
      readPhaseSignalStore(workspaceDir, nowIso),
    ]);
    const knownKeys = new Set(Object.keys(store.entries));
    for (const key of keys) {
      if (!knownKeys.has(key)) continue;
      const entry = phaseSignals.entries[key] ?? {
        key,
        lightHits: 0,
        remHits: 0,
      };
      entry.lastRemConsideredAt = nowIso;
      phaseSignals.entries[key] = entry;
    }
    for (const [key, entry] of Object.entries(phaseSignals.entries))
      if (!knownKeys.has(key) || (entry.lightHits <= 0 && entry.remHits <= 0))
        delete phaseSignals.entries[key];
    phaseSignals.updatedAt = nowIso;
    await writePhaseSignalStore(workspaceDir, phaseSignals);
  });
}
async function readLightStagedKeys(params) {
  const workspaceDir = params.workspaceDir?.trim();
  if (!workspaceDir) return /* @__PURE__ */ new Set();
  const store = await readPhaseSignalStore(
    workspaceDir,
    resolveMemoryCoreTimestamp(resolveMemoryCoreNowMs(params.nowMs)),
  );
  const keys = /* @__PURE__ */ new Set();
  for (const [key, entry] of Object.entries(store.entries)) {
    if (entry.lightHits <= 0) continue;
    const lastLightMs = Date.parse(entry.lastLightAt ?? "");
    const lastRemMs = Date.parse(entry.lastRemAt ?? "");
    const lastRemConsideredMs = Date.parse(entry.lastRemConsideredAt ?? "");
    const lastConsumedMs = Math.max(
      Number.isFinite(lastRemMs) ? lastRemMs : Number.NEGATIVE_INFINITY,
      Number.isFinite(lastRemConsideredMs) ? lastRemConsideredMs : Number.NEGATIVE_INFINITY,
    );
    if (Number.isFinite(lastLightMs) ? lastLightMs > lastConsumedMs : !entry.lastRemAt)
      keys.add(key);
  }
  return keys;
}
async function filterFreshLightDreamingEntries(params) {
  const workspaceDir = params.workspaceDir.trim();
  if (!workspaceDir || params.entries.length === 0) return [];
  const phaseSignals = await readPhaseSignalStore(
    workspaceDir,
    resolveMemoryCoreTimestamp(resolveMemoryCoreNowMs(params.nowMs)),
  );
  return params.entries.filter((entry) => {
    const phaseSignal = phaseSignals.entries[entry.key];
    if (!phaseSignal || phaseSignal.lightHits <= 0) return true;
    const lastLightMs = parseStoreTimestampMs(phaseSignal.lastLightAt);
    if (!Number.isFinite(lastLightMs)) return true;
    const lastRecalledAtMs = parseStoreTimestampMs(entry.lastRecalledAt);
    return Number.isFinite(lastRecalledAtMs) && lastRecalledAtMs > lastLightMs;
  });
}
async function rankShortTermPromotionCandidates(options) {
  const workspaceDir = options.workspaceDir.trim();
  if (!workspaceDir) return [];
  const nowMs = resolveMemoryCoreNowMs(options.nowMs);
  const nowIso = resolveMemoryCoreTimestamp(nowMs);
  const minScore = toFiniteScore(options.minScore, DEFAULT_PROMOTION_MIN_SCORE);
  const minRecallCount = toFiniteNonNegativeInt(options.minRecallCount, 3);
  const minUniqueQueries = toFiniteNonNegativeInt(options.minUniqueQueries, 2);
  const maxAgeDays = toFiniteNonNegativeInt(options.maxAgeDays, -1);
  const includePromoted = Boolean(options.includePromoted);
  const halfLifeDays = toFinitePositive(
    options.recencyHalfLifeDays,
    DEFAULT_RECENCY_HALF_LIFE_DAYS,
  );
  const weights = normalizeWeights(options.weights);
  const [store, phaseSignals] = await Promise.all([
    readStore(workspaceDir, nowIso),
    readPhaseSignalStore(workspaceDir, nowIso),
  ]);
  const candidates = [];
  for (const entry of Object.values(store.entries)) {
    if (!entry || entry.source !== "memory" || !isShortTermMemoryPath(entry.path)) continue;
    if (
      isContaminatedDreamingSnippet(entry.snippet, {
        allowTranscriptTurnSnippet: isShortTermSessionCorpusPath(entry.path),
      })
    )
      continue;
    if (!includePromoted && entry.promotedAt) continue;
    const recallCount = Math.max(0, Math.floor(entry.recallCount ?? 0));
    const dailyCount = Math.max(0, Math.floor(entry.dailyCount ?? 0));
    const groundedCount = Math.max(0, Math.floor(entry.groundedCount ?? 0));
    const signalCount = totalSignalCountForEntry(entry);
    if (signalCount <= 0) continue;
    if (signalCount < minRecallCount) continue;
    const avgScore = clampScore(entry.totalScore / Math.max(1, signalCount));
    const frequency = clampScore(Math.log1p(signalCount) / Math.log1p(10));
    const uniqueQueries = entry.queryHashes?.length ?? 0;
    const contextDiversity = Math.max(uniqueQueries, entry.recallDays?.length ?? 0);
    if (contextDiversity < minUniqueQueries) continue;
    const diversity = clampScore(contextDiversity / 5);
    const lastRecalledAtMs = Date.parse(entry.lastRecalledAt);
    const ageDays = Number.isFinite(lastRecalledAtMs)
      ? Math.max(0, (nowMs - lastRecalledAtMs) / DAY_MS)
      : 0;
    if (maxAgeDays >= 0 && ageDays > maxAgeDays) continue;
    const recency = clampScore(calculateRecencyComponent(ageDays, halfLifeDays));
    const recallDays = entry.recallDays ?? [];
    const conceptTags = entry.conceptTags ?? [];
    const consolidation = Math.max(
      calculateConsolidationComponent(recallDays),
      clampScore(groundedCount / 3),
    );
    const conceptual = calculateConceptualComponent(conceptTags);
    const phaseBoost = calculatePhaseSignalBoost(phaseSignals.entries[entry.key], nowMs);
    const score =
      weights.frequency * frequency +
      weights.relevance * avgScore +
      weights.diversity * diversity +
      weights.recency * recency +
      weights.consolidation * consolidation +
      weights.conceptual * conceptual +
      phaseBoost;
    if (score < minScore) continue;
    candidates.push({
      key: entry.key,
      path: entry.path,
      startLine: entry.startLine,
      endLine: entry.endLine,
      source: entry.source,
      snippet: entry.snippet,
      recallCount,
      dailyCount,
      groundedCount,
      signalCount,
      avgScore,
      maxScore: clampScore(entry.maxScore),
      uniqueQueries,
      ...(entry.claimHash ? { claimHash: entry.claimHash } : {}),
      promotedAt: entry.promotedAt,
      firstRecalledAt: entry.firstRecalledAt,
      lastRecalledAt: entry.lastRecalledAt,
      ageDays,
      score: clampScore(score),
      recallDays,
      conceptTags,
      components: {
        frequency,
        relevance: avgScore,
        diversity,
        recency,
        consolidation,
        conceptual,
      },
    });
  }
  const sorted = candidates.toSorted((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.recallCount !== a.recallCount) return b.recallCount - a.recallCount;
    return a.path.localeCompare(b.path);
  });
  const limit = Number.isFinite(options.limit)
    ? Math.max(0, Math.floor(options.limit))
    : sorted.length;
  return sorted.slice(0, limit);
}
async function readShortTermRecallEntries(params) {
  const workspaceDir = params.workspaceDir.trim();
  if (!workspaceDir) return [];
  const store = await readStore(
    workspaceDir,
    resolveMemoryCoreTimestamp(resolveMemoryCoreNowMs(params.nowMs)),
  );
  return Object.values(store.entries).filter(
    (entry) => Boolean(entry) && entry.source === "memory" && isShortTermMemoryPath(entry.path),
  );
}
function resolveShortTermSourcePathCandidates(workspaceDir, candidatePath) {
  const normalizedPath = normalizeMemoryPath(candidatePath);
  const basenames = [normalizedPath];
  if (!normalizedPath.startsWith("memory/"))
    basenames.push(path.posix.join("memory", path.posix.basename(normalizedPath)));
  const seen = /* @__PURE__ */ new Set();
  const resolved = [];
  for (const relativePath of basenames) {
    const absolutePath = path.resolve(workspaceDir, relativePath);
    if (seen.has(absolutePath)) continue;
    seen.add(absolutePath);
    resolved.push(absolutePath);
  }
  return resolved;
}
function normalizeRangeSnippet(lines, startLine, endLine) {
  const startIndex = Math.max(0, startLine - 1);
  const endIndex = Math.min(lines.length, endLine);
  if (startIndex >= endIndex) return "";
  return normalizeSnippet(lines.slice(startIndex, endIndex).join(" "));
}
function normalizeListMarkerFreeRangeSnippet(lines, startLine, endLine) {
  const startIndex = Math.max(0, startLine - 1);
  const endIndex = Math.min(lines.length, endLine);
  if (startIndex >= endIndex) return "";
  const strippedLines = lines.slice(startIndex, endIndex).map((line) => {
    const trimmed = line.trim();
    const withoutMarker = trimmed.replace(PROMOTION_LIST_MARKER_RE, "");
    return {
      text: withoutMarker,
      hadListMarker: withoutMarker !== trimmed,
    };
  });
  const joiner =
    strippedLines.length > 1 && strippedLines.every((line) => line.hadListMarker) ? "; " : " ";
  return normalizeSnippet(strippedLines.map((line) => line.text).join(joiner));
}
function normalizeDailyHeadingForPromotion(line) {
  const normalized = normalizeSnippet(
    line
      .trim()
      .match(/^#{1,6}\s+(.+)$/)?.[1]
      ?.replace(PROMOTION_LIST_MARKER_RE, "")
      .trim() ?? "",
  );
  if (
    !normalized ||
    SHORT_TERM_BASENAME_RE.test(normalized) ||
    isGenericDailyHeadingForPromotion(normalized)
  )
    return null;
  return normalized;
}
function isGenericDailyHeadingForPromotion(heading) {
  const normalized = heading.trim().replace(/\s+/g, " ");
  const lower = normalized.toLowerCase();
  if (MANAGED_DREAMING_HEADINGS.has(lower)) return true;
  if (lower === "today" || lower === "yesterday" || lower === "tomorrow") return true;
  if (lower === "morning" || lower === "afternoon" || lower === "evening" || lower === "night")
    return true;
  return GENERIC_DAY_HEADING_RE.test(normalized);
}
function buildRelocatedDailyHeadingLookup(lines) {
  const headings = Array.from({ length: lines.length + 1 }, () => null);
  let currentHeading = null;
  for (let index = 0; index < lines.length; index += 1) {
    headings[index + 1] = currentHeading;
    const line = lines[index] ?? "";
    if (DREAMING_FENCE_START_RE.test(line) || DREAMING_FENCE_END_RE.test(line)) {
      currentHeading = null;
      continue;
    }
    if (/^#{1,6}\s+.+$/.test(line.trim())) currentHeading = normalizeDailyHeadingForPromotion(line);
  }
  return headings;
}
function buildListMarkerFreeMatchSnippet(heading, listMarkerFreeSnippet) {
  if (!listMarkerFreeSnippet) return listMarkerFreeSnippet;
  return heading ? normalizeSnippet(`${heading}: ${listMarkerFreeSnippet}`) : listMarkerFreeSnippet;
}
function targetSnippetHasHeadingContext(targetSnippet, bodySnippet) {
  if (!targetSnippet || !bodySnippet || targetSnippet === bodySnippet) return false;
  const bodyIndex = targetSnippet.indexOf(bodySnippet);
  if (bodyIndex <= 0) return false;
  return targetSnippet.slice(0, bodyIndex).trimEnd().endsWith(":");
}
function extractTargetHeadingBodySnippet(targetSnippet, bodySnippet) {
  if (!targetSnippet || !bodySnippet || targetSnippet === bodySnippet) return null;
  if (bodySnippet.startsWith(targetSnippet)) return null;
  const normalizedBody = normalizeSnippet(bodySnippet);
  for (let separatorIndex = targetSnippet.indexOf(": "); separatorIndex > 0;) {
    const targetBody = normalizeSnippet(targetSnippet.slice(separatorIndex + 2));
    if (targetBody && normalizedBody.startsWith(targetBody)) return targetBody;
    separatorIndex = targetSnippet.indexOf(": ", separatorIndex + 2);
  }
  return null;
}
function compareCandidateWindow(targetSnippet, windowSnippet) {
  if (!targetSnippet || !windowSnippet)
    return {
      matched: false,
      quality: 0,
    };
  if (windowSnippet === targetSnippet)
    return {
      matched: true,
      quality: 3,
    };
  if (windowSnippet.includes(targetSnippet))
    return {
      matched: true,
      quality: 2,
    };
  if (targetSnippet.includes(windowSnippet))
    return {
      matched: true,
      quality: 1,
    };
  return {
    matched: false,
    quality: 0,
  };
}
function relocateCandidateRange(lines, candidate) {
  const targetSnippet = normalizeSnippet(candidate.snippet);
  const preferredSpan = Math.max(1, candidate.endLine - candidate.startLine + 1);
  if (targetSnippet.length === 0) {
    const fallbackSnippet = normalizeRangeSnippet(lines, candidate.startLine, candidate.endLine);
    if (!fallbackSnippet) return null;
    return {
      startLine: candidate.startLine,
      endLine: candidate.endLine,
      snippet: fallbackSnippet,
    };
  }
  const exactSnippet = normalizeRangeSnippet(lines, candidate.startLine, candidate.endLine);
  if (exactSnippet === targetSnippet)
    return {
      startLine: candidate.startLine,
      endLine: candidate.endLine,
      snippet: exactSnippet,
    };
  const maxSpan = Math.min(lines.length, Math.max(preferredSpan + 3, 8));
  const headingLookup = buildRelocatedDailyHeadingLookup(lines);
  let bestMatch;
  for (let startIndex = 0; startIndex < lines.length; startIndex += 1)
    for (let span = 1; span <= maxSpan && startIndex + span <= lines.length; span += 1) {
      const startLine = startIndex + 1;
      const endLine = startIndex + span;
      const snippet = normalizeRangeSnippet(lines, startLine, endLine);
      const comparison = compareCandidateWindow(targetSnippet, snippet);
      const listMarkerFreeSnippet = normalizeListMarkerFreeRangeSnippet(lines, startLine, endLine);
      const listMarkerFreeMatchSnippet = buildListMarkerFreeMatchSnippet(
        headingLookup[startLine] ?? null,
        listMarkerFreeSnippet,
      );
      const listMarkerFreeComparison =
        listMarkerFreeSnippet === snippet
          ? {
              matched: false,
              quality: 0,
            }
          : compareCandidateWindow(targetSnippet, listMarkerFreeSnippet);
      const listMarkerFreeContextComparison =
        listMarkerFreeMatchSnippet === listMarkerFreeSnippet
          ? {
              matched: false,
              quality: 0,
            }
          : compareCandidateWindow(targetSnippet, listMarkerFreeMatchSnippet);
      const targetHeadingBodySnippet = extractTargetHeadingBodySnippet(
        targetSnippet,
        listMarkerFreeSnippet,
      );
      const targetHeadingBodyComparison =
        targetHeadingBodySnippet && listMarkerFreeMatchSnippet !== listMarkerFreeSnippet
          ? compareCandidateWindow(targetHeadingBodySnippet, listMarkerFreeSnippet)
          : {
              matched: false,
              quality: 0,
            };
      const useTargetHeadingBodyContext =
        targetHeadingBodyComparison.matched &&
        targetHeadingBodyComparison.quality >= comparison.quality &&
        targetHeadingBodyComparison.quality >= listMarkerFreeComparison.quality;
      const useListMarkerFreeContext =
        !useTargetHeadingBodyContext &&
        listMarkerFreeContextComparison.quality > comparison.quality &&
        listMarkerFreeContextComparison.quality >= listMarkerFreeComparison.quality;
      const useListMarkerFree =
        !useListMarkerFreeContext && listMarkerFreeComparison.quality > comparison.quality;
      const bestComparison = useTargetHeadingBodyContext
        ? targetHeadingBodyComparison
        : useListMarkerFreeContext
          ? listMarkerFreeContextComparison
          : useListMarkerFree
            ? listMarkerFreeComparison
            : comparison;
      if (!bestComparison.matched) continue;
      const matchedSnippet =
        useTargetHeadingBodyContext || useListMarkerFreeContext
          ? listMarkerFreeMatchSnippet
          : useListMarkerFree
            ? targetSnippetHasHeadingContext(targetSnippet, listMarkerFreeSnippet)
              ? listMarkerFreeMatchSnippet
              : listMarkerFreeSnippet
            : snippet;
      const distance = Math.abs(startLine - candidate.startLine);
      if (
        !bestMatch ||
        bestComparison.quality > bestMatch.quality ||
        (bestComparison.quality === bestMatch.quality && distance < bestMatch.distance) ||
        (bestComparison.quality === bestMatch.quality &&
          distance === bestMatch.distance &&
          Math.abs(span - preferredSpan) <
            Math.abs(bestMatch.endLine - bestMatch.startLine + 1 - preferredSpan))
      )
        bestMatch = {
          startLine,
          endLine,
          snippet: matchedSnippet,
          quality: bestComparison.quality,
          distance,
        };
    }
  if (!bestMatch) return null;
  return {
    startLine: bestMatch.startLine,
    endLine: bestMatch.endLine,
    snippet: bestMatch.snippet,
  };
}
const DREAMING_FENCE_START_RE = /<!--\s*openclaw:dreaming:[a-z][a-z0-9-]*:start\s*-->/i;
const DREAMING_FENCE_END_RE = /<!--\s*openclaw:dreaming:[a-z][a-z0-9-]*:end\s*-->/i;
function lineRangeOverlapsDreamingFence(lines, startLine, endLine) {
  if (lines.length === 0) return false;
  const safeStart = Math.max(1, Math.min(startLine, lines.length));
  const safeEnd = Math.max(safeStart, Math.min(endLine, lines.length));
  let insideFence = false;
  for (let i = 0; i < safeEnd; i += 1) {
    const line = lines[i] ?? "";
    const oneIndexed = i + 1;
    const isStart = DREAMING_FENCE_START_RE.test(line);
    const isEnd = DREAMING_FENCE_END_RE.test(line);
    if (isStart || isEnd) {
      if (oneIndexed >= safeStart && oneIndexed <= safeEnd) return true;
      insideFence = isStart;
      continue;
    }
    if (insideFence && oneIndexed >= safeStart && oneIndexed <= safeEnd) return true;
  }
  return false;
}
async function rehydratePromotionCandidate(workspaceDir, candidate) {
  const sourcePaths = resolveShortTermSourcePathCandidates(workspaceDir, candidate.path);
  for (const sourcePath of sourcePaths) {
    let rawSource;
    try {
      rawSource = await fs.readFile(sourcePath, "utf-8");
    } catch (err) {
      if (err?.code === "ENOENT") continue;
      throw err;
    }
    const lines = rawSource.split(/\r?\n/);
    const relocated = relocateCandidateRange(lines, candidate);
    if (!relocated) continue;
    if (lineRangeOverlapsDreamingFence(lines, relocated.startLine, relocated.endLine)) continue;
    return {
      ...candidate,
      startLine: relocated.startLine,
      endLine: relocated.endLine,
      snippet: relocated.snippet,
    };
  }
  return null;
}
function buildPromotionSection(candidates, nowMs, timezone, maxPromotedSnippetTokens = 160) {
  const lines = [
    "",
    `## Promoted From Short-Term Memory (${formatMemoryDreamingDay(nowMs, timezone)})`,
    "",
  ];
  for (const candidate of candidates) {
    const source = `${candidate.path}:${candidate.startLine}-${candidate.endLine}`;
    const metadata = `[score=${candidate.score.toFixed(3)} signals=${candidate.signalCount} recalls=${candidate.recallCount} avg=${candidate.avgScore.toFixed(3)} source=${source}]`;
    lines.push(`<!-- ${PROMOTION_MARKER_PREFIX}${candidate.key} -->`);
    lines.push(
      `- ${formatPromotedSnippetForMemory(candidate.snippet, maxPromotedSnippetTokens)} ${metadata}`,
    );
  }
  lines.push("");
  return lines.join("\n");
}
function resolvePromotedSnippetCharLimit(maxTokens) {
  return toFiniteNonNegativeInt(maxTokens, 160) * PROMOTED_SNIPPET_CHARS_PER_TOKEN_ESTIMATE;
}
function truncatePromotedSnippet(snippet, maxTokens) {
  const limit = resolvePromotedSnippetCharLimit(maxTokens);
  if (limit === 0 || snippet.length <= limit) return snippet;
  const hardLimit = truncateUtf16Safe(snippet, limit);
  const sentenceBoundary = Math.max(
    hardLimit.lastIndexOf(". "),
    hardLimit.lastIndexOf("! "),
    hardLimit.lastIndexOf("? "),
  );
  const wordBoundary = hardLimit.lastIndexOf(" ");
  const cutAt =
    sentenceBoundary >= Math.floor(limit * 0.55)
      ? sentenceBoundary + 1
      : wordBoundary >= Math.floor(limit * 0.65)
        ? wordBoundary
        : limit;
  return `${hardLimit.slice(0, cutAt).trimEnd()}...`;
}
function formatPromotedSnippetForMemory(rawSnippet, maxTokens) {
  return truncatePromotedSnippet(
    normalizeSnippet(rawSnippet || "(no snippet captured)")
      .replace(/^[-*+] +/, "")
      .trim() || "(no snippet captured)",
    maxTokens,
  );
}
function withTrailingNewline(content) {
  if (!content) return "";
  return content.endsWith("\n") ? content : `${content}\n`;
}
function extractPromotionMarkers(memoryText) {
  const markers = /* @__PURE__ */ new Set();
  const matches = memoryText.matchAll(/<!--\s*openclaw-memory-promotion:([^\n]*?)\s*-->/gi);
  for (const match of matches) {
    const key = match[1]?.trim();
    if (key) markers.add(key);
  }
  return markers;
}
async function applyShortTermPromotions(options) {
  const workspaceDir = options.workspaceDir.trim();
  const nowMs = resolveMemoryCoreNowMs(options.nowMs);
  const nowIso = resolveMemoryCoreTimestamp(nowMs);
  const limit = Number.isFinite(options.limit)
    ? Math.max(0, Math.floor(options.limit))
    : options.candidates.length;
  const minScore = toFiniteScore(options.minScore, DEFAULT_PROMOTION_MIN_SCORE);
  const minRecallCount = toFiniteNonNegativeInt(options.minRecallCount, 3);
  const minUniqueQueries = toFiniteNonNegativeInt(options.minUniqueQueries, 2);
  const maxAgeDays = toFiniteNonNegativeInt(options.maxAgeDays, -1);
  const memoryPath = path.join(workspaceDir, "MEMORY.md");
  return await withShortTermLock(workspaceDir, async () => {
    const store = await readStore(workspaceDir, nowIso);
    const selected = options.candidates
      .filter((candidate) => {
        if (isContaminatedDreamingSnippet(candidate.snippet)) return false;
        if (candidate.promotedAt) return false;
        if (candidate.score < minScore) return false;
        if (candidate.signalCount < minRecallCount) return false;
        if (Math.max(candidate.uniqueQueries, candidate.recallDays.length) < minUniqueQueries)
          return false;
        if (maxAgeDays >= 0 && candidate.ageDays > maxAgeDays) return false;
        if (store.entries[candidate.key]?.promotedAt) return false;
        return true;
      })
      .slice(0, limit);
    const rehydratedSelected = [];
    for (const candidate of selected) {
      const rehydrated = await rehydratePromotionCandidate(workspaceDir, candidate);
      if (rehydrated && !isContaminatedDreamingSnippet(rehydrated.snippet))
        rehydratedSelected.push(rehydrated);
    }
    if (rehydratedSelected.length === 0)
      return {
        memoryPath,
        applied: 0,
        appended: 0,
        reconciledExisting: 0,
        appliedCandidates: [],
        compactedSections: 0,
        compactedDates: [],
      };
    const existingMemory = await fs.readFile(memoryPath, "utf-8").catch((err) => {
      if (err?.code === "ENOENT") return "";
      throw err;
    });
    const existingMarkers = extractPromotionMarkers(existingMemory);
    const alreadyWritten = rehydratedSelected.filter((candidate) =>
      existingMarkers.has(candidate.key),
    );
    const toAppend = rehydratedSelected.filter((candidate) => !existingMarkers.has(candidate.key));
    let compactedDates = [];
    if (toAppend.length > 0) {
      const section = buildPromotionSection(
        toAppend,
        nowMs,
        options.timezone,
        options.maxPromotedSnippetTokens,
      );
      const compaction = compactMemoryForBudget({
        existingMemory,
        newSection: section,
        budgetChars:
          typeof options.memoryFileMaxChars === "number" &&
          Number.isFinite(options.memoryFileMaxChars)
            ? Math.max(0, Math.floor(options.memoryFileMaxChars))
            : DEFAULT_MEMORY_FILE_MAX_CHARS,
      });
      compactedDates = compaction.droppedDates;
      const baseMemory = compaction.compacted;
      const header = baseMemory.trim().length > 0 ? "" : "# Long-Term Memory\n\n";
      await fs.writeFile(
        memoryPath,
        `${header}${withTrailingNewline(baseMemory)}${section}`,
        "utf-8",
      );
    }
    for (const candidate of rehydratedSelected) {
      const entry = store.entries[candidate.key];
      if (!entry) continue;
      entry.startLine = candidate.startLine;
      entry.endLine = candidate.endLine;
      entry.snippet = candidate.snippet;
      entry.promotedAt = nowIso;
    }
    store.updatedAt = nowIso;
    await writeStore(workspaceDir, store);
    await appendMemoryHostEvent(workspaceDir, {
      type: "memory.promotion.applied",
      timestamp: nowIso,
      memoryPath,
      applied: rehydratedSelected.length,
      candidates: rehydratedSelected.map((candidate) => ({
        key: candidate.key,
        path: candidate.path,
        startLine: candidate.startLine,
        endLine: candidate.endLine,
        score: candidate.score,
        recallCount: candidate.recallCount,
      })),
    });
    return {
      memoryPath,
      applied: rehydratedSelected.length,
      appended: toAppend.length,
      reconciledExisting: alreadyWritten.length,
      appliedCandidates: rehydratedSelected,
      compactedSections: compactedDates.length,
      compactedDates,
    };
  });
}
function resolveShortTermRecallStorePath(workspaceDir) {
  return resolveStorePath(workspaceDir);
}
function resolveShortTermRecallLockPath(workspaceDir) {
  return resolveLockPath(workspaceDir);
}
async function auditShortTermPromotionArtifacts(params) {
  const workspaceDir = params.workspaceDir.trim();
  const storePath = resolveStorePath(workspaceDir);
  const lockPath = resolveLockPath(workspaceDir);
  const issues = [];
  let entryCount = 0;
  let promotedCount = 0;
  let spacedEntryCount = 0;
  let conceptTaggedEntryCount = 0;
  let conceptTagScripts;
  let invalidEntryCount = 0;
  let updatedAt;
  const nowIso = /* @__PURE__ */ new Date().toISOString();
  const rawEntries = await readMemoryCoreWorkspaceEntries({
    namespace: SHORT_TERM_RECALL_NAMESPACE,
    workspaceDir,
  });
  const exists = rawEntries.length > 0;
  if (exists) {
    const store = normalizeShortTermRecallStore(
      {
        version: 1,
        updatedAt: nowIso,
        entries: Object.fromEntries(rawEntries.map((entry) => [entry.key, entry.value])),
      },
      nowIso,
    );
    const normalizedEntryCount = Object.keys(store.entries).length;
    updatedAt = store.updatedAt;
    entryCount = normalizedEntryCount;
    promotedCount = Object.values(store.entries).filter((entry) =>
      Boolean(entry.promotedAt),
    ).length;
    spacedEntryCount = Object.values(store.entries).filter(
      (entry) => (entry.recallDays?.length ?? 0) > 1,
    ).length;
    conceptTaggedEntryCount = Object.values(store.entries).filter(
      (entry) => (entry.conceptTags?.length ?? 0) > 0,
    ).length;
    conceptTagScripts = summarizeConceptTagScriptCoverage(
      Object.values(store.entries)
        .filter((entry) => (entry.conceptTags?.length ?? 0) > 0)
        .map((entry) => entry.conceptTags ?? []),
    );
    invalidEntryCount = rawEntries.length - entryCount;
    if (invalidEntryCount > 0)
      issues.push({
        severity: "warn",
        code: "recall-store-invalid",
        message: `Short-term recall store contains ${invalidEntryCount} invalid entr${invalidEntryCount === 1 ? "y" : "ies"}.`,
        fixable: true,
      });
    if (normalizedEntryCount > SHORT_TERM_RECALL_MAX_ENTRIES)
      issues.push({
        severity: "warn",
        code: "recall-store-over-limit",
        message: `Short-term recall store contains ${normalizedEntryCount} entries; only the newest ${SHORT_TERM_RECALL_MAX_ENTRIES} are kept at runtime.`,
        fixable: true,
      });
  }
  const lockKey = memoryCoreWorkspaceStateKey(workspaceDir);
  const lockEntry = await openMemoryCoreStateStore({
    namespace: SHORT_TERM_LOCK_NAMESPACE,
    maxEntries: SHORT_TERM_LOCK_MAX_ENTRIES,
  }).lookup(lockKey);
  if (lockEntry) {
    const ageMs = Date.now() - lockEntry.acquiredAt;
    const ownerPid = parseLockOwnerPid(lockEntry.owner);
    if (ageMs > SHORT_TERM_LOCK_STALE_MS && (ownerPid === null || !isProcessLikelyAlive(ownerPid)))
      issues.push({
        severity: "warn",
        code: "recall-lock-stale",
        message: "Short-term promotion lock appears stale.",
        fixable: true,
      });
  }
  let qmd;
  if (params.qmd) {
    qmd = {
      dbPath: params.qmd.dbPath,
      collections: params.qmd.collections,
    };
    if (typeof params.qmd.collections === "number" && params.qmd.collections <= 0)
      issues.push({
        severity: "warn",
        code: "qmd-collections-empty",
        message: "QMD reports zero managed collections.",
        fixable: false,
      });
    const dbPath = params.qmd.dbPath?.trim();
    if (dbPath)
      try {
        const stat = await fs.stat(dbPath);
        qmd.dbBytes = stat.size;
        if (!stat.isFile() || stat.size <= 0)
          issues.push({
            severity: "error",
            code: "qmd-index-empty",
            message: "QMD index file exists but is empty.",
            fixable: false,
          });
      } catch (err) {
        if (err.code === "ENOENT")
          issues.push({
            severity: "error",
            code: "qmd-index-missing",
            message: "QMD index file is missing.",
            fixable: false,
          });
        else throw err;
      }
  }
  return {
    storePath,
    lockPath,
    updatedAt,
    exists,
    entryCount,
    promotedCount,
    spacedEntryCount,
    conceptTaggedEntryCount,
    ...(conceptTagScripts ? { conceptTagScripts } : {}),
    invalidEntryCount,
    issues,
    ...(qmd ? { qmd } : {}),
  };
}
async function repairShortTermPromotionArtifacts(params) {
  const workspaceDir = params.workspaceDir.trim();
  const nowIso = /* @__PURE__ */ new Date().toISOString();
  let rewroteStore = false;
  let removedInvalidEntries = 0;
  let removedOverflowEntries = 0;
  let removedStaleLock = false;
  const lockKey = memoryCoreWorkspaceStateKey(workspaceDir);
  const lockStore = openMemoryCoreStateStore({
    namespace: SHORT_TERM_LOCK_NAMESPACE,
    maxEntries: SHORT_TERM_LOCK_MAX_ENTRIES,
  });
  const lockEntry = await lockStore.lookup(lockKey);
  if (lockEntry && Date.now() - lockEntry.acquiredAt > SHORT_TERM_LOCK_STALE_MS) {
    const ownerPid = parseLockOwnerPid(lockEntry.owner);
    if (ownerPid === null || !isProcessLikelyAlive(ownerPid))
      removedStaleLock = await lockStore.delete(lockKey);
  }
  await withShortTermLock(workspaceDir, async () => {
    const rawEntries = await readMemoryCoreWorkspaceEntries({
      namespace: SHORT_TERM_RECALL_NAMESPACE,
      workspaceDir,
    });
    if (rawEntries.length > 0) {
      const normalized = normalizeShortTermRecallStore(
        {
          version: 1,
          updatedAt: nowIso,
          entries: Object.fromEntries(rawEntries.map((entry) => [entry.key, entry.value])),
        },
        nowIso,
      );
      removedInvalidEntries = Math.max(
        0,
        rawEntries.length - Object.keys(normalized.entries).length,
      );
      const nextEntries = Object.fromEntries(
        Object.entries(normalized.entries).map(([key, entry]) => {
          const conceptTags = deriveConceptTags({
            path: entry.path,
            snippet: entry.snippet,
          });
          const fallbackDay = normalizeIsoDay(entry.lastRecalledAt) ?? nowIso.slice(0, 10);
          return [
            key,
            {
              ...entry,
              dailyCount: Math.max(0, Math.floor(entry.dailyCount ?? 0)),
              groundedCount: Math.max(0, Math.floor(entry.groundedCount ?? 0)),
              queryHashes: (entry.queryHashes ?? []).slice(-32),
              recallDays: mergeRecentDistinct(entry.recallDays ?? [], fallbackDay, MAX_RECALL_DAYS),
              conceptTags: conceptTags.length > 0 ? conceptTags : (entry.conceptTags ?? []),
            },
          ];
        }),
      );
      const comparableStore = {
        version: 1,
        updatedAt: normalized.updatedAt,
        entries: nextEntries,
      };
      removedOverflowEntries = enforceShortTermRecallStoreRetention(comparableStore);
      if (
        removedInvalidEntries > 0 ||
        removedOverflowEntries > 0 ||
        JSON.stringify(normalized.entries) !== JSON.stringify(comparableStore.entries)
      ) {
        await writeStore(workspaceDir, {
          ...comparableStore,
          updatedAt: nowIso,
        });
        rewroteStore = true;
      }
    }
  });
  return {
    changed: rewroteStore || removedStaleLock,
    removedInvalidEntries,
    removedOverflowEntries,
    rewroteStore,
    removedStaleLock,
  };
}
async function removeGroundedShortTermCandidates(params) {
  const workspaceDir = params.workspaceDir.trim();
  const storePath = resolveStorePath(workspaceDir);
  const nowIso = /* @__PURE__ */ new Date().toISOString();
  let removed = 0;
  await withShortTermLock(workspaceDir, async () => {
    const [store, phaseSignals] = await Promise.all([
      readStore(workspaceDir, nowIso),
      readPhaseSignalStore(workspaceDir, nowIso),
    ]);
    for (const [key, entry] of Object.entries(store.entries))
      if (
        Math.max(0, Math.floor(entry.groundedCount ?? 0)) > 0 &&
        Math.max(0, Math.floor(entry.recallCount ?? 0)) === 0 &&
        Math.max(0, Math.floor(entry.dailyCount ?? 0)) === 0
      ) {
        delete store.entries[key];
        removed += 1;
      }
    for (const key of Object.keys(phaseSignals.entries))
      if (!Object.hasOwn(store.entries, key)) delete phaseSignals.entries[key];
    if (removed > 0) {
      store.updatedAt = nowIso;
      phaseSignals.updatedAt = nowIso;
      await Promise.all([
        writeStore(workspaceDir, store),
        writePhaseSignalStore(workspaceDir, phaseSignals),
      ]);
    }
  });
  return {
    removed,
    storePath,
  };
}
//#endregion
export {
  resolveShortTermRecallStorePath as C,
  resolveShortTermRecallLockPath as S,
  recordGroundedShortTermCandidates as _,
  SHORT_TERM_STORE_RELATIVE_PATH as a,
  removeGroundedShortTermCandidates as b,
  filterFreshLightDreamingEntries as c,
  normalizeShortTermPhaseSignalStore as d,
  normalizeShortTermRecallStore as f,
  recordDreamingPhaseSignals as g,
  readShortTermRecallEntries as h,
  SHORT_TERM_PHASE_SIGNAL_RELATIVE_PATH as i,
  filterLiveShortTermRecallEntries as l,
  readLightStagedKeys as m,
  DEFAULT_PROMOTION_MIN_SCORE as n,
  applyShortTermPromotions as o,
  rankShortTermPromotionCandidates as p,
  DEFAULT_PROMOTION_MIN_UNIQUE_QUERIES as r,
  auditShortTermPromotionArtifacts as s,
  DEFAULT_PROMOTION_MIN_RECALL_COUNT as t,
  loadShortTermPromotionDreamingStats as u,
  recordRemConsideredPhaseSignals as v,
  repairShortTermPromotionArtifacts as x,
  recordShortTermRecalls as y,
};
