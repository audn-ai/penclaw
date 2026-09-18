import { AsyncLocalStorage } from "node:async_hooks";
import { createHash } from "node:crypto";
import { constants } from "node:fs";
import fs$1 from "node:fs/promises";
import path from "node:path";
import pMap, { pMapSkip } from "p-map";
import YAML from "yaml";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import { c as resolveDefaultAgentId } from "./agent-scope-config-DVIR1nBa.js";
import { v as resolveSessionAgentId } from "./agent-scope-y9xQv_q1.js";
import { t as loadCombinedSessionStoreForGateway } from "./combined-store-gateway-TXobKXN7.js";
import { f as readFiniteNumberParam } from "./common-DyDSUect.js";
import {
  i as resolveMemoryWikiAgentConfig,
  n as WIKI_SEARCH_CORPORA,
  t as WIKI_SEARCH_BACKENDS,
} from "./config-Dz4wGD_U.js";
import { n as runExec } from "./exec-CXKmx4dL.js";
import { v as pathExists } from "./fs-safe-RNq3oO57.js";
import { n as callGatewayFromCli } from "./gateway-rpc-DpocbsVi.js";
import { r as retryTransientMemoryRead } from "./hash-DsDOoPhE.js";
import {
  S as writeMemoryWikiSourceSyncState,
  b as setImportedSourceEntry,
  c as readMemoryWikiImportRunRecord,
  g as pruneImportedSourceEntries,
  i as countMemoryWikiImportRunStateRows,
  l as resolveMemoryWikiImportRunsDir,
  p as assertMemoryWikiSourceSyncStateCapacity,
  t as MEMORY_WIKI_IMPORT_RUN_STATE_MAX_ENTRIES,
  u as writeMemoryWikiImportRunRecord,
  v as readMemoryWikiSourceSyncState,
  x as shouldSkipImportedSourceWrite,
} from "./import-runs-state-B_kqwbCA.js";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.js";
import {
  n as withTrailingNewline,
  t as replaceManagedMarkdownBlock,
} from "./memory-host-markdown-mHNl3RAL.js";
import { r as getActiveMemorySearchManager } from "./memory-host-search-aW3_BiIK.js";
import "./number-runtime-B-n-wjMn.js";
import "./security-runtime-CraX8Pqe.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./text-utility-runtime-CJESZCN5.js";
import "./routing-CwvmVRHd.js";
import {
  o as listActiveMemoryPublicArtifacts,
  r as getMemoryCapabilityRegistration,
} from "./memory-state-z9GGEQiO.js";
import "./concurrency-runtime-BCAEiezh.js";
import "./gateway-runtime-IrTdjV5_.js";
import {
  P as timestampMsToIsoString,
  b as parseStrictPositiveInteger,
  s as asFiniteNumber,
} from "./number-coercion-CJQ8TR--.js";
import "./process-runtime-BKNTr1ic.js";
import { C as FsSafeError } from "./path-DILYn_gk.js";
import "./memory-host-core-BLjlFart.js";
import "./memory-core-host-engine-storage-eNQx81fD.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { t as appendRegularFile } from "./regular-file-CuvhUtZS.js";
import "./retry-runtime-DCStwGTN.js";
import "./param-readers-8wnI_A3p.js";
import { t as retryAsync } from "./retry-CcVvEFm0.js";
import { r as __exportAll } from "./rolldown-runtime-DE1ahGrs.js";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-BHgpSCM6.js";
import { a as root } from "./secure-temp-dir-DMUMnweR.js";
import {
  r as resolveTranscriptStemToSessionKeys,
  t as extractTranscriptIdentityFromSessionsMemoryHit,
} from "./session-transcript-hit-CBK6A4kv.js";
import {
  o as resolveEffectiveSessionToolsVisibility,
  r as createSessionVisibilityGuard,
  t as createAgentToAgentPolicy,
} from "./session-visibility-B7S_cwHU.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
  r as lowercasePreservingWhitespace,
} from "./string-coerce-DW4mBlAt.js";
import {
  _ as uniqueStrings,
  l as normalizeStringEntries,
  o as normalizeSingleOrTrimmedStringList,
} from "./string-normalization-CRyoFBPt.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region extensions/memory-wiki/src/claim-health.ts
const DAY_MS = 1440 * 60 * 1e3;
const WIKI_STALE_DAYS = 90;
const CONTESTED_CLAIM_STATUSES = /* @__PURE__ */ new Set([
  "contested",
  "contradicted",
  "refuted",
  "superseded",
]);
function parseTimestamp(value) {
  if (!value?.trim()) return null;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}
function clampDaysSinceTouch(daysSinceTouch) {
  return Math.max(0, daysSinceTouch);
}
function normalizeClaimTextKey(text) {
  return normalizeLowercaseStringOrEmpty(text.replace(/\s+/g, " "));
}
function normalizeTextKey(text) {
  return normalizeLowercaseStringOrEmpty(text)
    .replace(/[^\p{L}\p{N}\p{M}]+/gu, " ")
    .replace(/\s+/g, " ");
}
function buildFreshnessFromTimestamp(params) {
  const now = params.now ?? /* @__PURE__ */ new Date();
  const timestampMs = parseTimestamp(params.timestamp);
  if (timestampMs === null || !params.timestamp)
    return {
      level: "unknown",
      reason: "missing updatedAt",
    };
  const daysSinceTouch = clampDaysSinceTouch(Math.floor((now.getTime() - timestampMs) / DAY_MS));
  if (daysSinceTouch >= WIKI_STALE_DAYS)
    return {
      level: "stale",
      reason: `last touched ${params.timestamp}`,
      daysSinceTouch,
      lastTouchedAt: params.timestamp,
    };
  if (daysSinceTouch >= 30)
    return {
      level: "aging",
      reason: `last touched ${params.timestamp}`,
      daysSinceTouch,
      lastTouchedAt: params.timestamp,
    };
  return {
    level: "fresh",
    reason: `last touched ${params.timestamp}`,
    daysSinceTouch,
    lastTouchedAt: params.timestamp,
  };
}
function resolveLatestTimestamp(candidates) {
  let bestValue;
  let bestMs = -1;
  for (const candidate of candidates) {
    const parsed = parseTimestamp(candidate);
    if (parsed === null || !candidate || parsed <= bestMs) continue;
    bestMs = parsed;
    bestValue = candidate;
  }
  return bestValue;
}
function normalizeClaimStatus(status) {
  return normalizeLowercaseStringOrEmpty(status) || "supported";
}
function isClaimContestedStatus(status) {
  return CONTESTED_CLAIM_STATUSES.has(normalizeClaimStatus(status));
}
function assessPageFreshness(page, now) {
  return buildFreshnessFromTimestamp({
    timestamp: page.updatedAt,
    now,
  });
}
function assessClaimFreshness(params) {
  let hasClaimTimestamp =
    typeof params.claim.updatedAt === "string" && params.claim.updatedAt.trim().length > 0;
  let latestTimestamp = resolveLatestTimestamp([params.claim.updatedAt]);
  let latestMs = parseTimestamp(latestTimestamp) ?? -1;
  for (const evidence of params.claim.evidence) {
    if (typeof evidence.updatedAt === "string" && evidence.updatedAt.trim().length > 0)
      hasClaimTimestamp = true;
    const evidenceMs = parseTimestamp(evidence.updatedAt);
    if (evidenceMs === null || !evidence.updatedAt || evidenceMs <= latestMs) continue;
    latestMs = evidenceMs;
    latestTimestamp = evidence.updatedAt;
  }
  return buildFreshnessFromTimestamp({
    timestamp: latestTimestamp ?? (hasClaimTimestamp ? void 0 : params.page.updatedAt),
    now: params.now,
  });
}
function buildWikiClaimHealth(params) {
  const claimId = params.claim.id?.trim();
  return {
    key: `${params.page.relativePath}#${claimId ?? `claim-${params.index + 1}`}`,
    pagePath: params.page.relativePath,
    pageTitle: params.page.title,
    ...(params.page.id ? { pageId: params.page.id } : {}),
    ...(claimId ? { claimId } : {}),
    text: params.claim.text,
    status: normalizeClaimStatus(params.claim.status),
    ...(typeof params.claim.confidence === "number" ? { confidence: params.claim.confidence } : {}),
    evidenceCount: params.claim.evidence.length,
    missingEvidence: params.claim.evidence.length === 0,
    freshness: assessClaimFreshness({
      page: params.page,
      claim: params.claim,
      now: params.now,
    }),
  };
}
function collectWikiClaimHealth(pages, now) {
  return pages.flatMap((page) =>
    page.claims.map((claim, index) =>
      buildWikiClaimHealth({
        page,
        claim,
        index,
        now,
      }),
    ),
  );
}
function buildClaimContradictionClusters(params) {
  const claimHealth = collectWikiClaimHealth(params.pages, params.now);
  const byId = /* @__PURE__ */ new Map();
  for (const claim of claimHealth) {
    if (!claim.claimId) continue;
    const current = byId.get(claim.claimId) ?? [];
    current.push(claim);
    byId.set(claim.claimId, current);
  }
  return [...byId.entries()]
    .flatMap(([claimId, entries]) => {
      if (entries.length < 2) return [];
      const distinctTexts = new Set(entries.map((entry) => normalizeClaimTextKey(entry.text)));
      const distinctStatuses = new Set(entries.map((entry) => entry.status));
      if (distinctTexts.size < 2 && distinctStatuses.size < 2) return [];
      return [
        {
          key: claimId,
          label: claimId,
          entries: [...entries].toSorted((left, right) =>
            left.pagePath.localeCompare(right.pagePath),
          ),
        },
      ];
    })
    .toSorted((left, right) => left.label.localeCompare(right.label));
}
function buildPageContradictionClusters(pages) {
  const byNote = /* @__PURE__ */ new Map();
  for (const page of pages)
    for (const note of page.contradictions) {
      const key = normalizeTextKey(note);
      if (!key) continue;
      const current = byNote.get(key) ?? [];
      current.push({
        pagePath: page.relativePath,
        pageTitle: page.title,
        ...(page.id ? { pageId: page.id } : {}),
        note,
      });
      byNote.set(key, current);
    }
  return [...byNote.entries()]
    .map(([key, entries]) => ({
      key,
      label: entries[0]?.note ?? key,
      entries: [...entries].toSorted((left, right) => left.pagePath.localeCompare(right.pagePath)),
    }))
    .toSorted((left, right) => left.label.localeCompare(right.label));
}
//#endregion
//#region extensions/memory-wiki/src/log.ts
async function appendMemoryWikiLog(vaultRoot, entry) {
  const logPath = path.join(vaultRoot, ".openclaw-wiki", "log.jsonl");
  await fs$1.mkdir(path.dirname(logPath), { recursive: true });
  await appendRegularFile({
    filePath: logPath,
    content: `${JSON.stringify(entry)}\n`,
    rejectSymlinkParents: true,
  });
}
//#endregion
//#region node_modules/mdast-util-to-string/lib/index.js
/**
 * @typedef {import('mdast').Nodes} Nodes
 *
 * @typedef Options
 *   Configuration (optional).
 * @property {boolean | null | undefined} [includeImageAlt=true]
 *   Whether to use `alt` for `image`s (default: `true`).
 * @property {boolean | null | undefined} [includeHtml=true]
 *   Whether to use `value` of HTML (default: `true`).
 */
/** @type {Options} */
const emptyOptions = {};
/**
 * Get the text content of a node or list of nodes.
 *
 * Prefers the node’s plain-text fields, otherwise serializes its children,
 * and if the given value is an array, serialize the nodes in it.
 *
 * @param {unknown} [value]
 *   Thing to serialize, typically `Node`.
 * @param {Options | null | undefined} [options]
 *   Configuration (optional).
 * @returns {string}
 *   Serialized `value`.
 */
function toString(value, options) {
  const settings = options || emptyOptions;
  return one(
    value,
    typeof settings.includeImageAlt === "boolean" ? settings.includeImageAlt : true,
    typeof settings.includeHtml === "boolean" ? settings.includeHtml : true,
  );
}
/**
 * One node or several nodes.
 *
 * @param {unknown} value
 *   Thing to serialize.
 * @param {boolean} includeImageAlt
 *   Include image `alt`s.
 * @param {boolean} includeHtml
 *   Include HTML.
 * @returns {string}
 *   Serialized node.
 */
function one(value, includeImageAlt, includeHtml) {
  if (node(value)) {
    if ("value" in value) return value.type === "html" && !includeHtml ? "" : value.value;
    if (includeImageAlt && "alt" in value && value.alt) return value.alt;
    if ("children" in value) return all(value.children, includeImageAlt, includeHtml);
  }
  if (Array.isArray(value)) return all(value, includeImageAlt, includeHtml);
  return "";
}
/**
 * Serialize a list of nodes.
 *
 * @param {Array<unknown>} values
 *   Thing to serialize.
 * @param {boolean} includeImageAlt
 *   Include image `alt`s.
 * @param {boolean} includeHtml
 *   Include HTML.
 * @returns {string}
 *   Serialized nodes.
 */
function all(values, includeImageAlt, includeHtml) {
  /** @type {Array<string>} */
  const result = [];
  let index = -1;
  while (++index < values.length) result[index] = one(values[index], includeImageAlt, includeHtml);
  return result.join("");
}
/**
 * Check if `value` looks like a node.
 *
 * @param {unknown} value
 *   Thing.
 * @returns {value is Nodes}
 *   Whether `value` is a node.
 */
function node(value) {
  return Boolean(value && typeof value === "object");
}
//#endregion
//#region node_modules/character-entities/index.js
/**
 * Map of named character references.
 *
 * @type {Record<string, string>}
 */
const characterEntities = {
  AElig: "Æ",
  AMP: "&",
  Aacute: "Á",
  Abreve: "Ă",
  Acirc: "Â",
  Acy: "А",
  Afr: "𝔄",
  Agrave: "À",
  Alpha: "Α",
  Amacr: "Ā",
  And: "⩓",
  Aogon: "Ą",
  Aopf: "𝔸",
  ApplyFunction: "⁡",
  Aring: "Å",
  Ascr: "𝒜",
  Assign: "≔",
  Atilde: "Ã",
  Auml: "Ä",
  Backslash: "∖",
  Barv: "⫧",
  Barwed: "⌆",
  Bcy: "Б",
  Because: "∵",
  Bernoullis: "ℬ",
  Beta: "Β",
  Bfr: "𝔅",
  Bopf: "𝔹",
  Breve: "˘",
  Bscr: "ℬ",
  Bumpeq: "≎",
  CHcy: "Ч",
  COPY: "©",
  Cacute: "Ć",
  Cap: "⋒",
  CapitalDifferentialD: "ⅅ",
  Cayleys: "ℭ",
  Ccaron: "Č",
  Ccedil: "Ç",
  Ccirc: "Ĉ",
  Cconint: "∰",
  Cdot: "Ċ",
  Cedilla: "¸",
  CenterDot: "·",
  Cfr: "ℭ",
  Chi: "Χ",
  CircleDot: "⊙",
  CircleMinus: "⊖",
  CirclePlus: "⊕",
  CircleTimes: "⊗",
  ClockwiseContourIntegral: "∲",
  CloseCurlyDoubleQuote: "”",
  CloseCurlyQuote: "’",
  Colon: "∷",
  Colone: "⩴",
  Congruent: "≡",
  Conint: "∯",
  ContourIntegral: "∮",
  Copf: "ℂ",
  Coproduct: "∐",
  CounterClockwiseContourIntegral: "∳",
  Cross: "⨯",
  Cscr: "𝒞",
  Cup: "⋓",
  CupCap: "≍",
  DD: "ⅅ",
  DDotrahd: "⤑",
  DJcy: "Ђ",
  DScy: "Ѕ",
  DZcy: "Џ",
  Dagger: "‡",
  Darr: "↡",
  Dashv: "⫤",
  Dcaron: "Ď",
  Dcy: "Д",
  Del: "∇",
  Delta: "Δ",
  Dfr: "𝔇",
  DiacriticalAcute: "´",
  DiacriticalDot: "˙",
  DiacriticalDoubleAcute: "˝",
  DiacriticalGrave: "`",
  DiacriticalTilde: "˜",
  Diamond: "⋄",
  DifferentialD: "ⅆ",
  Dopf: "𝔻",
  Dot: "¨",
  DotDot: "⃜",
  DotEqual: "≐",
  DoubleContourIntegral: "∯",
  DoubleDot: "¨",
  DoubleDownArrow: "⇓",
  DoubleLeftArrow: "⇐",
  DoubleLeftRightArrow: "⇔",
  DoubleLeftTee: "⫤",
  DoubleLongLeftArrow: "⟸",
  DoubleLongLeftRightArrow: "⟺",
  DoubleLongRightArrow: "⟹",
  DoubleRightArrow: "⇒",
  DoubleRightTee: "⊨",
  DoubleUpArrow: "⇑",
  DoubleUpDownArrow: "⇕",
  DoubleVerticalBar: "∥",
  DownArrow: "↓",
  DownArrowBar: "⤓",
  DownArrowUpArrow: "⇵",
  DownBreve: "̑",
  DownLeftRightVector: "⥐",
  DownLeftTeeVector: "⥞",
  DownLeftVector: "↽",
  DownLeftVectorBar: "⥖",
  DownRightTeeVector: "⥟",
  DownRightVector: "⇁",
  DownRightVectorBar: "⥗",
  DownTee: "⊤",
  DownTeeArrow: "↧",
  Downarrow: "⇓",
  Dscr: "𝒟",
  Dstrok: "Đ",
  ENG: "Ŋ",
  ETH: "Ð",
  Eacute: "É",
  Ecaron: "Ě",
  Ecirc: "Ê",
  Ecy: "Э",
  Edot: "Ė",
  Efr: "𝔈",
  Egrave: "È",
  Element: "∈",
  Emacr: "Ē",
  EmptySmallSquare: "◻",
  EmptyVerySmallSquare: "▫",
  Eogon: "Ę",
  Eopf: "𝔼",
  Epsilon: "Ε",
  Equal: "⩵",
  EqualTilde: "≂",
  Equilibrium: "⇌",
  Escr: "ℰ",
  Esim: "⩳",
  Eta: "Η",
  Euml: "Ë",
  Exists: "∃",
  ExponentialE: "ⅇ",
  Fcy: "Ф",
  Ffr: "𝔉",
  FilledSmallSquare: "◼",
  FilledVerySmallSquare: "▪",
  Fopf: "𝔽",
  ForAll: "∀",
  Fouriertrf: "ℱ",
  Fscr: "ℱ",
  GJcy: "Ѓ",
  GT: ">",
  Gamma: "Γ",
  Gammad: "Ϝ",
  Gbreve: "Ğ",
  Gcedil: "Ģ",
  Gcirc: "Ĝ",
  Gcy: "Г",
  Gdot: "Ġ",
  Gfr: "𝔊",
  Gg: "⋙",
  Gopf: "𝔾",
  GreaterEqual: "≥",
  GreaterEqualLess: "⋛",
  GreaterFullEqual: "≧",
  GreaterGreater: "⪢",
  GreaterLess: "≷",
  GreaterSlantEqual: "⩾",
  GreaterTilde: "≳",
  Gscr: "𝒢",
  Gt: "≫",
  HARDcy: "Ъ",
  Hacek: "ˇ",
  Hat: "^",
  Hcirc: "Ĥ",
  Hfr: "ℌ",
  HilbertSpace: "ℋ",
  Hopf: "ℍ",
  HorizontalLine: "─",
  Hscr: "ℋ",
  Hstrok: "Ħ",
  HumpDownHump: "≎",
  HumpEqual: "≏",
  IEcy: "Е",
  IJlig: "Ĳ",
  IOcy: "Ё",
  Iacute: "Í",
  Icirc: "Î",
  Icy: "И",
  Idot: "İ",
  Ifr: "ℑ",
  Igrave: "Ì",
  Im: "ℑ",
  Imacr: "Ī",
  ImaginaryI: "ⅈ",
  Implies: "⇒",
  Int: "∬",
  Integral: "∫",
  Intersection: "⋂",
  InvisibleComma: "⁣",
  InvisibleTimes: "⁢",
  Iogon: "Į",
  Iopf: "𝕀",
  Iota: "Ι",
  Iscr: "ℐ",
  Itilde: "Ĩ",
  Iukcy: "І",
  Iuml: "Ï",
  Jcirc: "Ĵ",
  Jcy: "Й",
  Jfr: "𝔍",
  Jopf: "𝕁",
  Jscr: "𝒥",
  Jsercy: "Ј",
  Jukcy: "Є",
  KHcy: "Х",
  KJcy: "Ќ",
  Kappa: "Κ",
  Kcedil: "Ķ",
  Kcy: "К",
  Kfr: "𝔎",
  Kopf: "𝕂",
  Kscr: "𝒦",
  LJcy: "Љ",
  LT: "<",
  Lacute: "Ĺ",
  Lambda: "Λ",
  Lang: "⟪",
  Laplacetrf: "ℒ",
  Larr: "↞",
  Lcaron: "Ľ",
  Lcedil: "Ļ",
  Lcy: "Л",
  LeftAngleBracket: "⟨",
  LeftArrow: "←",
  LeftArrowBar: "⇤",
  LeftArrowRightArrow: "⇆",
  LeftCeiling: "⌈",
  LeftDoubleBracket: "⟦",
  LeftDownTeeVector: "⥡",
  LeftDownVector: "⇃",
  LeftDownVectorBar: "⥙",
  LeftFloor: "⌊",
  LeftRightArrow: "↔",
  LeftRightVector: "⥎",
  LeftTee: "⊣",
  LeftTeeArrow: "↤",
  LeftTeeVector: "⥚",
  LeftTriangle: "⊲",
  LeftTriangleBar: "⧏",
  LeftTriangleEqual: "⊴",
  LeftUpDownVector: "⥑",
  LeftUpTeeVector: "⥠",
  LeftUpVector: "↿",
  LeftUpVectorBar: "⥘",
  LeftVector: "↼",
  LeftVectorBar: "⥒",
  Leftarrow: "⇐",
  Leftrightarrow: "⇔",
  LessEqualGreater: "⋚",
  LessFullEqual: "≦",
  LessGreater: "≶",
  LessLess: "⪡",
  LessSlantEqual: "⩽",
  LessTilde: "≲",
  Lfr: "𝔏",
  Ll: "⋘",
  Lleftarrow: "⇚",
  Lmidot: "Ŀ",
  LongLeftArrow: "⟵",
  LongLeftRightArrow: "⟷",
  LongRightArrow: "⟶",
  Longleftarrow: "⟸",
  Longleftrightarrow: "⟺",
  Longrightarrow: "⟹",
  Lopf: "𝕃",
  LowerLeftArrow: "↙",
  LowerRightArrow: "↘",
  Lscr: "ℒ",
  Lsh: "↰",
  Lstrok: "Ł",
  Lt: "≪",
  Map: "⤅",
  Mcy: "М",
  MediumSpace: " ",
  Mellintrf: "ℳ",
  Mfr: "𝔐",
  MinusPlus: "∓",
  Mopf: "𝕄",
  Mscr: "ℳ",
  Mu: "Μ",
  NJcy: "Њ",
  Nacute: "Ń",
  Ncaron: "Ň",
  Ncedil: "Ņ",
  Ncy: "Н",
  NegativeMediumSpace: "​",
  NegativeThickSpace: "​",
  NegativeThinSpace: "​",
  NegativeVeryThinSpace: "​",
  NestedGreaterGreater: "≫",
  NestedLessLess: "≪",
  NewLine: "\n",
  Nfr: "𝔑",
  NoBreak: "⁠",
  NonBreakingSpace: "\xA0",
  Nopf: "ℕ",
  Not: "⫬",
  NotCongruent: "≢",
  NotCupCap: "≭",
  NotDoubleVerticalBar: "∦",
  NotElement: "∉",
  NotEqual: "≠",
  NotEqualTilde: "≂̸",
  NotExists: "∄",
  NotGreater: "≯",
  NotGreaterEqual: "≱",
  NotGreaterFullEqual: "≧̸",
  NotGreaterGreater: "≫̸",
  NotGreaterLess: "≹",
  NotGreaterSlantEqual: "⩾̸",
  NotGreaterTilde: "≵",
  NotHumpDownHump: "≎̸",
  NotHumpEqual: "≏̸",
  NotLeftTriangle: "⋪",
  NotLeftTriangleBar: "⧏̸",
  NotLeftTriangleEqual: "⋬",
  NotLess: "≮",
  NotLessEqual: "≰",
  NotLessGreater: "≸",
  NotLessLess: "≪̸",
  NotLessSlantEqual: "⩽̸",
  NotLessTilde: "≴",
  NotNestedGreaterGreater: "⪢̸",
  NotNestedLessLess: "⪡̸",
  NotPrecedes: "⊀",
  NotPrecedesEqual: "⪯̸",
  NotPrecedesSlantEqual: "⋠",
  NotReverseElement: "∌",
  NotRightTriangle: "⋫",
  NotRightTriangleBar: "⧐̸",
  NotRightTriangleEqual: "⋭",
  NotSquareSubset: "⊏̸",
  NotSquareSubsetEqual: "⋢",
  NotSquareSuperset: "⊐̸",
  NotSquareSupersetEqual: "⋣",
  NotSubset: "⊂⃒",
  NotSubsetEqual: "⊈",
  NotSucceeds: "⊁",
  NotSucceedsEqual: "⪰̸",
  NotSucceedsSlantEqual: "⋡",
  NotSucceedsTilde: "≿̸",
  NotSuperset: "⊃⃒",
  NotSupersetEqual: "⊉",
  NotTilde: "≁",
  NotTildeEqual: "≄",
  NotTildeFullEqual: "≇",
  NotTildeTilde: "≉",
  NotVerticalBar: "∤",
  Nscr: "𝒩",
  Ntilde: "Ñ",
  Nu: "Ν",
  OElig: "Œ",
  Oacute: "Ó",
  Ocirc: "Ô",
  Ocy: "О",
  Odblac: "Ő",
  Ofr: "𝔒",
  Ograve: "Ò",
  Omacr: "Ō",
  Omega: "Ω",
  Omicron: "Ο",
  Oopf: "𝕆",
  OpenCurlyDoubleQuote: "“",
  OpenCurlyQuote: "‘",
  Or: "⩔",
  Oscr: "𝒪",
  Oslash: "Ø",
  Otilde: "Õ",
  Otimes: "⨷",
  Ouml: "Ö",
  OverBar: "‾",
  OverBrace: "⏞",
  OverBracket: "⎴",
  OverParenthesis: "⏜",
  PartialD: "∂",
  Pcy: "П",
  Pfr: "𝔓",
  Phi: "Φ",
  Pi: "Π",
  PlusMinus: "±",
  Poincareplane: "ℌ",
  Popf: "ℙ",
  Pr: "⪻",
  Precedes: "≺",
  PrecedesEqual: "⪯",
  PrecedesSlantEqual: "≼",
  PrecedesTilde: "≾",
  Prime: "″",
  Product: "∏",
  Proportion: "∷",
  Proportional: "∝",
  Pscr: "𝒫",
  Psi: "Ψ",
  QUOT: '"',
  Qfr: "𝔔",
  Qopf: "ℚ",
  Qscr: "𝒬",
  RBarr: "⤐",
  REG: "®",
  Racute: "Ŕ",
  Rang: "⟫",
  Rarr: "↠",
  Rarrtl: "⤖",
  Rcaron: "Ř",
  Rcedil: "Ŗ",
  Rcy: "Р",
  Re: "ℜ",
  ReverseElement: "∋",
  ReverseEquilibrium: "⇋",
  ReverseUpEquilibrium: "⥯",
  Rfr: "ℜ",
  Rho: "Ρ",
  RightAngleBracket: "⟩",
  RightArrow: "→",
  RightArrowBar: "⇥",
  RightArrowLeftArrow: "⇄",
  RightCeiling: "⌉",
  RightDoubleBracket: "⟧",
  RightDownTeeVector: "⥝",
  RightDownVector: "⇂",
  RightDownVectorBar: "⥕",
  RightFloor: "⌋",
  RightTee: "⊢",
  RightTeeArrow: "↦",
  RightTeeVector: "⥛",
  RightTriangle: "⊳",
  RightTriangleBar: "⧐",
  RightTriangleEqual: "⊵",
  RightUpDownVector: "⥏",
  RightUpTeeVector: "⥜",
  RightUpVector: "↾",
  RightUpVectorBar: "⥔",
  RightVector: "⇀",
  RightVectorBar: "⥓",
  Rightarrow: "⇒",
  Ropf: "ℝ",
  RoundImplies: "⥰",
  Rrightarrow: "⇛",
  Rscr: "ℛ",
  Rsh: "↱",
  RuleDelayed: "⧴",
  SHCHcy: "Щ",
  SHcy: "Ш",
  SOFTcy: "Ь",
  Sacute: "Ś",
  Sc: "⪼",
  Scaron: "Š",
  Scedil: "Ş",
  Scirc: "Ŝ",
  Scy: "С",
  Sfr: "𝔖",
  ShortDownArrow: "↓",
  ShortLeftArrow: "←",
  ShortRightArrow: "→",
  ShortUpArrow: "↑",
  Sigma: "Σ",
  SmallCircle: "∘",
  Sopf: "𝕊",
  Sqrt: "√",
  Square: "□",
  SquareIntersection: "⊓",
  SquareSubset: "⊏",
  SquareSubsetEqual: "⊑",
  SquareSuperset: "⊐",
  SquareSupersetEqual: "⊒",
  SquareUnion: "⊔",
  Sscr: "𝒮",
  Star: "⋆",
  Sub: "⋐",
  Subset: "⋐",
  SubsetEqual: "⊆",
  Succeeds: "≻",
  SucceedsEqual: "⪰",
  SucceedsSlantEqual: "≽",
  SucceedsTilde: "≿",
  SuchThat: "∋",
  Sum: "∑",
  Sup: "⋑",
  Superset: "⊃",
  SupersetEqual: "⊇",
  Supset: "⋑",
  THORN: "Þ",
  TRADE: "™",
  TSHcy: "Ћ",
  TScy: "Ц",
  Tab: "	",
  Tau: "Τ",
  Tcaron: "Ť",
  Tcedil: "Ţ",
  Tcy: "Т",
  Tfr: "𝔗",
  Therefore: "∴",
  Theta: "Θ",
  ThickSpace: "  ",
  ThinSpace: " ",
  Tilde: "∼",
  TildeEqual: "≃",
  TildeFullEqual: "≅",
  TildeTilde: "≈",
  Topf: "𝕋",
  TripleDot: "⃛",
  Tscr: "𝒯",
  Tstrok: "Ŧ",
  Uacute: "Ú",
  Uarr: "↟",
  Uarrocir: "⥉",
  Ubrcy: "Ў",
  Ubreve: "Ŭ",
  Ucirc: "Û",
  Ucy: "У",
  Udblac: "Ű",
  Ufr: "𝔘",
  Ugrave: "Ù",
  Umacr: "Ū",
  UnderBar: "_",
  UnderBrace: "⏟",
  UnderBracket: "⎵",
  UnderParenthesis: "⏝",
  Union: "⋃",
  UnionPlus: "⊎",
  Uogon: "Ų",
  Uopf: "𝕌",
  UpArrow: "↑",
  UpArrowBar: "⤒",
  UpArrowDownArrow: "⇅",
  UpDownArrow: "↕",
  UpEquilibrium: "⥮",
  UpTee: "⊥",
  UpTeeArrow: "↥",
  Uparrow: "⇑",
  Updownarrow: "⇕",
  UpperLeftArrow: "↖",
  UpperRightArrow: "↗",
  Upsi: "ϒ",
  Upsilon: "Υ",
  Uring: "Ů",
  Uscr: "𝒰",
  Utilde: "Ũ",
  Uuml: "Ü",
  VDash: "⊫",
  Vbar: "⫫",
  Vcy: "В",
  Vdash: "⊩",
  Vdashl: "⫦",
  Vee: "⋁",
  Verbar: "‖",
  Vert: "‖",
  VerticalBar: "∣",
  VerticalLine: "|",
  VerticalSeparator: "❘",
  VerticalTilde: "≀",
  VeryThinSpace: " ",
  Vfr: "𝔙",
  Vopf: "𝕍",
  Vscr: "𝒱",
  Vvdash: "⊪",
  Wcirc: "Ŵ",
  Wedge: "⋀",
  Wfr: "𝔚",
  Wopf: "𝕎",
  Wscr: "𝒲",
  Xfr: "𝔛",
  Xi: "Ξ",
  Xopf: "𝕏",
  Xscr: "𝒳",
  YAcy: "Я",
  YIcy: "Ї",
  YUcy: "Ю",
  Yacute: "Ý",
  Ycirc: "Ŷ",
  Ycy: "Ы",
  Yfr: "𝔜",
  Yopf: "𝕐",
  Yscr: "𝒴",
  Yuml: "Ÿ",
  ZHcy: "Ж",
  Zacute: "Ź",
  Zcaron: "Ž",
  Zcy: "З",
  Zdot: "Ż",
  ZeroWidthSpace: "​",
  Zeta: "Ζ",
  Zfr: "ℨ",
  Zopf: "ℤ",
  Zscr: "𝒵",
  aacute: "á",
  abreve: "ă",
  ac: "∾",
  acE: "∾̳",
  acd: "∿",
  acirc: "â",
  acute: "´",
  acy: "а",
  aelig: "æ",
  af: "⁡",
  afr: "𝔞",
  agrave: "à",
  alefsym: "ℵ",
  aleph: "ℵ",
  alpha: "α",
  amacr: "ā",
  amalg: "⨿",
  amp: "&",
  and: "∧",
  andand: "⩕",
  andd: "⩜",
  andslope: "⩘",
  andv: "⩚",
  ang: "∠",
  ange: "⦤",
  angle: "∠",
  angmsd: "∡",
  angmsdaa: "⦨",
  angmsdab: "⦩",
  angmsdac: "⦪",
  angmsdad: "⦫",
  angmsdae: "⦬",
  angmsdaf: "⦭",
  angmsdag: "⦮",
  angmsdah: "⦯",
  angrt: "∟",
  angrtvb: "⊾",
  angrtvbd: "⦝",
  angsph: "∢",
  angst: "Å",
  angzarr: "⍼",
  aogon: "ą",
  aopf: "𝕒",
  ap: "≈",
  apE: "⩰",
  apacir: "⩯",
  ape: "≊",
  apid: "≋",
  apos: "'",
  approx: "≈",
  approxeq: "≊",
  aring: "å",
  ascr: "𝒶",
  ast: "*",
  asymp: "≈",
  asympeq: "≍",
  atilde: "ã",
  auml: "ä",
  awconint: "∳",
  awint: "⨑",
  bNot: "⫭",
  backcong: "≌",
  backepsilon: "϶",
  backprime: "‵",
  backsim: "∽",
  backsimeq: "⋍",
  barvee: "⊽",
  barwed: "⌅",
  barwedge: "⌅",
  bbrk: "⎵",
  bbrktbrk: "⎶",
  bcong: "≌",
  bcy: "б",
  bdquo: "„",
  becaus: "∵",
  because: "∵",
  bemptyv: "⦰",
  bepsi: "϶",
  bernou: "ℬ",
  beta: "β",
  beth: "ℶ",
  between: "≬",
  bfr: "𝔟",
  bigcap: "⋂",
  bigcirc: "◯",
  bigcup: "⋃",
  bigodot: "⨀",
  bigoplus: "⨁",
  bigotimes: "⨂",
  bigsqcup: "⨆",
  bigstar: "★",
  bigtriangledown: "▽",
  bigtriangleup: "△",
  biguplus: "⨄",
  bigvee: "⋁",
  bigwedge: "⋀",
  bkarow: "⤍",
  blacklozenge: "⧫",
  blacksquare: "▪",
  blacktriangle: "▴",
  blacktriangledown: "▾",
  blacktriangleleft: "◂",
  blacktriangleright: "▸",
  blank: "␣",
  blk12: "▒",
  blk14: "░",
  blk34: "▓",
  block: "█",
  bne: "=⃥",
  bnequiv: "≡⃥",
  bnot: "⌐",
  bopf: "𝕓",
  bot: "⊥",
  bottom: "⊥",
  bowtie: "⋈",
  boxDL: "╗",
  boxDR: "╔",
  boxDl: "╖",
  boxDr: "╓",
  boxH: "═",
  boxHD: "╦",
  boxHU: "╩",
  boxHd: "╤",
  boxHu: "╧",
  boxUL: "╝",
  boxUR: "╚",
  boxUl: "╜",
  boxUr: "╙",
  boxV: "║",
  boxVH: "╬",
  boxVL: "╣",
  boxVR: "╠",
  boxVh: "╫",
  boxVl: "╢",
  boxVr: "╟",
  boxbox: "⧉",
  boxdL: "╕",
  boxdR: "╒",
  boxdl: "┐",
  boxdr: "┌",
  boxh: "─",
  boxhD: "╥",
  boxhU: "╨",
  boxhd: "┬",
  boxhu: "┴",
  boxminus: "⊟",
  boxplus: "⊞",
  boxtimes: "⊠",
  boxuL: "╛",
  boxuR: "╘",
  boxul: "┘",
  boxur: "└",
  boxv: "│",
  boxvH: "╪",
  boxvL: "╡",
  boxvR: "╞",
  boxvh: "┼",
  boxvl: "┤",
  boxvr: "├",
  bprime: "‵",
  breve: "˘",
  brvbar: "¦",
  bscr: "𝒷",
  bsemi: "⁏",
  bsim: "∽",
  bsime: "⋍",
  bsol: "\\",
  bsolb: "⧅",
  bsolhsub: "⟈",
  bull: "•",
  bullet: "•",
  bump: "≎",
  bumpE: "⪮",
  bumpe: "≏",
  bumpeq: "≏",
  cacute: "ć",
  cap: "∩",
  capand: "⩄",
  capbrcup: "⩉",
  capcap: "⩋",
  capcup: "⩇",
  capdot: "⩀",
  caps: "∩︀",
  caret: "⁁",
  caron: "ˇ",
  ccaps: "⩍",
  ccaron: "č",
  ccedil: "ç",
  ccirc: "ĉ",
  ccups: "⩌",
  ccupssm: "⩐",
  cdot: "ċ",
  cedil: "¸",
  cemptyv: "⦲",
  cent: "¢",
  centerdot: "·",
  cfr: "𝔠",
  chcy: "ч",
  check: "✓",
  checkmark: "✓",
  chi: "χ",
  cir: "○",
  cirE: "⧃",
  circ: "ˆ",
  circeq: "≗",
  circlearrowleft: "↺",
  circlearrowright: "↻",
  circledR: "®",
  circledS: "Ⓢ",
  circledast: "⊛",
  circledcirc: "⊚",
  circleddash: "⊝",
  cire: "≗",
  cirfnint: "⨐",
  cirmid: "⫯",
  cirscir: "⧂",
  clubs: "♣",
  clubsuit: "♣",
  colon: ":",
  colone: "≔",
  coloneq: "≔",
  comma: ",",
  commat: "@",
  comp: "∁",
  compfn: "∘",
  complement: "∁",
  complexes: "ℂ",
  cong: "≅",
  congdot: "⩭",
  conint: "∮",
  copf: "𝕔",
  coprod: "∐",
  copy: "©",
  copysr: "℗",
  crarr: "↵",
  cross: "✗",
  cscr: "𝒸",
  csub: "⫏",
  csube: "⫑",
  csup: "⫐",
  csupe: "⫒",
  ctdot: "⋯",
  cudarrl: "⤸",
  cudarrr: "⤵",
  cuepr: "⋞",
  cuesc: "⋟",
  cularr: "↶",
  cularrp: "⤽",
  cup: "∪",
  cupbrcap: "⩈",
  cupcap: "⩆",
  cupcup: "⩊",
  cupdot: "⊍",
  cupor: "⩅",
  cups: "∪︀",
  curarr: "↷",
  curarrm: "⤼",
  curlyeqprec: "⋞",
  curlyeqsucc: "⋟",
  curlyvee: "⋎",
  curlywedge: "⋏",
  curren: "¤",
  curvearrowleft: "↶",
  curvearrowright: "↷",
  cuvee: "⋎",
  cuwed: "⋏",
  cwconint: "∲",
  cwint: "∱",
  cylcty: "⌭",
  dArr: "⇓",
  dHar: "⥥",
  dagger: "†",
  daleth: "ℸ",
  darr: "↓",
  dash: "‐",
  dashv: "⊣",
  dbkarow: "⤏",
  dblac: "˝",
  dcaron: "ď",
  dcy: "д",
  dd: "ⅆ",
  ddagger: "‡",
  ddarr: "⇊",
  ddotseq: "⩷",
  deg: "°",
  delta: "δ",
  demptyv: "⦱",
  dfisht: "⥿",
  dfr: "𝔡",
  dharl: "⇃",
  dharr: "⇂",
  diam: "⋄",
  diamond: "⋄",
  diamondsuit: "♦",
  diams: "♦",
  die: "¨",
  digamma: "ϝ",
  disin: "⋲",
  div: "÷",
  divide: "÷",
  divideontimes: "⋇",
  divonx: "⋇",
  djcy: "ђ",
  dlcorn: "⌞",
  dlcrop: "⌍",
  dollar: "$",
  dopf: "𝕕",
  dot: "˙",
  doteq: "≐",
  doteqdot: "≑",
  dotminus: "∸",
  dotplus: "∔",
  dotsquare: "⊡",
  doublebarwedge: "⌆",
  downarrow: "↓",
  downdownarrows: "⇊",
  downharpoonleft: "⇃",
  downharpoonright: "⇂",
  drbkarow: "⤐",
  drcorn: "⌟",
  drcrop: "⌌",
  dscr: "𝒹",
  dscy: "ѕ",
  dsol: "⧶",
  dstrok: "đ",
  dtdot: "⋱",
  dtri: "▿",
  dtrif: "▾",
  duarr: "⇵",
  duhar: "⥯",
  dwangle: "⦦",
  dzcy: "џ",
  dzigrarr: "⟿",
  eDDot: "⩷",
  eDot: "≑",
  eacute: "é",
  easter: "⩮",
  ecaron: "ě",
  ecir: "≖",
  ecirc: "ê",
  ecolon: "≕",
  ecy: "э",
  edot: "ė",
  ee: "ⅇ",
  efDot: "≒",
  efr: "𝔢",
  eg: "⪚",
  egrave: "è",
  egs: "⪖",
  egsdot: "⪘",
  el: "⪙",
  elinters: "⏧",
  ell: "ℓ",
  els: "⪕",
  elsdot: "⪗",
  emacr: "ē",
  empty: "∅",
  emptyset: "∅",
  emptyv: "∅",
  emsp13: " ",
  emsp14: " ",
  emsp: " ",
  eng: "ŋ",
  ensp: " ",
  eogon: "ę",
  eopf: "𝕖",
  epar: "⋕",
  eparsl: "⧣",
  eplus: "⩱",
  epsi: "ε",
  epsilon: "ε",
  epsiv: "ϵ",
  eqcirc: "≖",
  eqcolon: "≕",
  eqsim: "≂",
  eqslantgtr: "⪖",
  eqslantless: "⪕",
  equals: "=",
  equest: "≟",
  equiv: "≡",
  equivDD: "⩸",
  eqvparsl: "⧥",
  erDot: "≓",
  erarr: "⥱",
  escr: "ℯ",
  esdot: "≐",
  esim: "≂",
  eta: "η",
  eth: "ð",
  euml: "ë",
  euro: "€",
  excl: "!",
  exist: "∃",
  expectation: "ℰ",
  exponentiale: "ⅇ",
  fallingdotseq: "≒",
  fcy: "ф",
  female: "♀",
  ffilig: "ﬃ",
  fflig: "ﬀ",
  ffllig: "ﬄ",
  ffr: "𝔣",
  filig: "ﬁ",
  fjlig: "fj",
  flat: "♭",
  fllig: "ﬂ",
  fltns: "▱",
  fnof: "ƒ",
  fopf: "𝕗",
  forall: "∀",
  fork: "⋔",
  forkv: "⫙",
  fpartint: "⨍",
  frac12: "½",
  frac13: "⅓",
  frac14: "¼",
  frac15: "⅕",
  frac16: "⅙",
  frac18: "⅛",
  frac23: "⅔",
  frac25: "⅖",
  frac34: "¾",
  frac35: "⅗",
  frac38: "⅜",
  frac45: "⅘",
  frac56: "⅚",
  frac58: "⅝",
  frac78: "⅞",
  frasl: "⁄",
  frown: "⌢",
  fscr: "𝒻",
  gE: "≧",
  gEl: "⪌",
  gacute: "ǵ",
  gamma: "γ",
  gammad: "ϝ",
  gap: "⪆",
  gbreve: "ğ",
  gcirc: "ĝ",
  gcy: "г",
  gdot: "ġ",
  ge: "≥",
  gel: "⋛",
  geq: "≥",
  geqq: "≧",
  geqslant: "⩾",
  ges: "⩾",
  gescc: "⪩",
  gesdot: "⪀",
  gesdoto: "⪂",
  gesdotol: "⪄",
  gesl: "⋛︀",
  gesles: "⪔",
  gfr: "𝔤",
  gg: "≫",
  ggg: "⋙",
  gimel: "ℷ",
  gjcy: "ѓ",
  gl: "≷",
  glE: "⪒",
  gla: "⪥",
  glj: "⪤",
  gnE: "≩",
  gnap: "⪊",
  gnapprox: "⪊",
  gne: "⪈",
  gneq: "⪈",
  gneqq: "≩",
  gnsim: "⋧",
  gopf: "𝕘",
  grave: "`",
  gscr: "ℊ",
  gsim: "≳",
  gsime: "⪎",
  gsiml: "⪐",
  gt: ">",
  gtcc: "⪧",
  gtcir: "⩺",
  gtdot: "⋗",
  gtlPar: "⦕",
  gtquest: "⩼",
  gtrapprox: "⪆",
  gtrarr: "⥸",
  gtrdot: "⋗",
  gtreqless: "⋛",
  gtreqqless: "⪌",
  gtrless: "≷",
  gtrsim: "≳",
  gvertneqq: "≩︀",
  gvnE: "≩︀",
  hArr: "⇔",
  hairsp: " ",
  half: "½",
  hamilt: "ℋ",
  hardcy: "ъ",
  harr: "↔",
  harrcir: "⥈",
  harrw: "↭",
  hbar: "ℏ",
  hcirc: "ĥ",
  hearts: "♥",
  heartsuit: "♥",
  hellip: "…",
  hercon: "⊹",
  hfr: "𝔥",
  hksearow: "⤥",
  hkswarow: "⤦",
  hoarr: "⇿",
  homtht: "∻",
  hookleftarrow: "↩",
  hookrightarrow: "↪",
  hopf: "𝕙",
  horbar: "―",
  hscr: "𝒽",
  hslash: "ℏ",
  hstrok: "ħ",
  hybull: "⁃",
  hyphen: "‐",
  iacute: "í",
  ic: "⁣",
  icirc: "î",
  icy: "и",
  iecy: "е",
  iexcl: "¡",
  iff: "⇔",
  ifr: "𝔦",
  igrave: "ì",
  ii: "ⅈ",
  iiiint: "⨌",
  iiint: "∭",
  iinfin: "⧜",
  iiota: "℩",
  ijlig: "ĳ",
  imacr: "ī",
  image: "ℑ",
  imagline: "ℐ",
  imagpart: "ℑ",
  imath: "ı",
  imof: "⊷",
  imped: "Ƶ",
  in: "∈",
  incare: "℅",
  infin: "∞",
  infintie: "⧝",
  inodot: "ı",
  int: "∫",
  intcal: "⊺",
  integers: "ℤ",
  intercal: "⊺",
  intlarhk: "⨗",
  intprod: "⨼",
  iocy: "ё",
  iogon: "į",
  iopf: "𝕚",
  iota: "ι",
  iprod: "⨼",
  iquest: "¿",
  iscr: "𝒾",
  isin: "∈",
  isinE: "⋹",
  isindot: "⋵",
  isins: "⋴",
  isinsv: "⋳",
  isinv: "∈",
  it: "⁢",
  itilde: "ĩ",
  iukcy: "і",
  iuml: "ï",
  jcirc: "ĵ",
  jcy: "й",
  jfr: "𝔧",
  jmath: "ȷ",
  jopf: "𝕛",
  jscr: "𝒿",
  jsercy: "ј",
  jukcy: "є",
  kappa: "κ",
  kappav: "ϰ",
  kcedil: "ķ",
  kcy: "к",
  kfr: "𝔨",
  kgreen: "ĸ",
  khcy: "х",
  kjcy: "ќ",
  kopf: "𝕜",
  kscr: "𝓀",
  lAarr: "⇚",
  lArr: "⇐",
  lAtail: "⤛",
  lBarr: "⤎",
  lE: "≦",
  lEg: "⪋",
  lHar: "⥢",
  lacute: "ĺ",
  laemptyv: "⦴",
  lagran: "ℒ",
  lambda: "λ",
  lang: "⟨",
  langd: "⦑",
  langle: "⟨",
  lap: "⪅",
  laquo: "«",
  larr: "←",
  larrb: "⇤",
  larrbfs: "⤟",
  larrfs: "⤝",
  larrhk: "↩",
  larrlp: "↫",
  larrpl: "⤹",
  larrsim: "⥳",
  larrtl: "↢",
  lat: "⪫",
  latail: "⤙",
  late: "⪭",
  lates: "⪭︀",
  lbarr: "⤌",
  lbbrk: "❲",
  lbrace: "{",
  lbrack: "[",
  lbrke: "⦋",
  lbrksld: "⦏",
  lbrkslu: "⦍",
  lcaron: "ľ",
  lcedil: "ļ",
  lceil: "⌈",
  lcub: "{",
  lcy: "л",
  ldca: "⤶",
  ldquo: "“",
  ldquor: "„",
  ldrdhar: "⥧",
  ldrushar: "⥋",
  ldsh: "↲",
  le: "≤",
  leftarrow: "←",
  leftarrowtail: "↢",
  leftharpoondown: "↽",
  leftharpoonup: "↼",
  leftleftarrows: "⇇",
  leftrightarrow: "↔",
  leftrightarrows: "⇆",
  leftrightharpoons: "⇋",
  leftrightsquigarrow: "↭",
  leftthreetimes: "⋋",
  leg: "⋚",
  leq: "≤",
  leqq: "≦",
  leqslant: "⩽",
  les: "⩽",
  lescc: "⪨",
  lesdot: "⩿",
  lesdoto: "⪁",
  lesdotor: "⪃",
  lesg: "⋚︀",
  lesges: "⪓",
  lessapprox: "⪅",
  lessdot: "⋖",
  lesseqgtr: "⋚",
  lesseqqgtr: "⪋",
  lessgtr: "≶",
  lesssim: "≲",
  lfisht: "⥼",
  lfloor: "⌊",
  lfr: "𝔩",
  lg: "≶",
  lgE: "⪑",
  lhard: "↽",
  lharu: "↼",
  lharul: "⥪",
  lhblk: "▄",
  ljcy: "љ",
  ll: "≪",
  llarr: "⇇",
  llcorner: "⌞",
  llhard: "⥫",
  lltri: "◺",
  lmidot: "ŀ",
  lmoust: "⎰",
  lmoustache: "⎰",
  lnE: "≨",
  lnap: "⪉",
  lnapprox: "⪉",
  lne: "⪇",
  lneq: "⪇",
  lneqq: "≨",
  lnsim: "⋦",
  loang: "⟬",
  loarr: "⇽",
  lobrk: "⟦",
  longleftarrow: "⟵",
  longleftrightarrow: "⟷",
  longmapsto: "⟼",
  longrightarrow: "⟶",
  looparrowleft: "↫",
  looparrowright: "↬",
  lopar: "⦅",
  lopf: "𝕝",
  loplus: "⨭",
  lotimes: "⨴",
  lowast: "∗",
  lowbar: "_",
  loz: "◊",
  lozenge: "◊",
  lozf: "⧫",
  lpar: "(",
  lparlt: "⦓",
  lrarr: "⇆",
  lrcorner: "⌟",
  lrhar: "⇋",
  lrhard: "⥭",
  lrm: "‎",
  lrtri: "⊿",
  lsaquo: "‹",
  lscr: "𝓁",
  lsh: "↰",
  lsim: "≲",
  lsime: "⪍",
  lsimg: "⪏",
  lsqb: "[",
  lsquo: "‘",
  lsquor: "‚",
  lstrok: "ł",
  lt: "<",
  ltcc: "⪦",
  ltcir: "⩹",
  ltdot: "⋖",
  lthree: "⋋",
  ltimes: "⋉",
  ltlarr: "⥶",
  ltquest: "⩻",
  ltrPar: "⦖",
  ltri: "◃",
  ltrie: "⊴",
  ltrif: "◂",
  lurdshar: "⥊",
  luruhar: "⥦",
  lvertneqq: "≨︀",
  lvnE: "≨︀",
  mDDot: "∺",
  macr: "¯",
  male: "♂",
  malt: "✠",
  maltese: "✠",
  map: "↦",
  mapsto: "↦",
  mapstodown: "↧",
  mapstoleft: "↤",
  mapstoup: "↥",
  marker: "▮",
  mcomma: "⨩",
  mcy: "м",
  mdash: "—",
  measuredangle: "∡",
  mfr: "𝔪",
  mho: "℧",
  micro: "µ",
  mid: "∣",
  midast: "*",
  midcir: "⫰",
  middot: "·",
  minus: "−",
  minusb: "⊟",
  minusd: "∸",
  minusdu: "⨪",
  mlcp: "⫛",
  mldr: "…",
  mnplus: "∓",
  models: "⊧",
  mopf: "𝕞",
  mp: "∓",
  mscr: "𝓂",
  mstpos: "∾",
  mu: "μ",
  multimap: "⊸",
  mumap: "⊸",
  nGg: "⋙̸",
  nGt: "≫⃒",
  nGtv: "≫̸",
  nLeftarrow: "⇍",
  nLeftrightarrow: "⇎",
  nLl: "⋘̸",
  nLt: "≪⃒",
  nLtv: "≪̸",
  nRightarrow: "⇏",
  nVDash: "⊯",
  nVdash: "⊮",
  nabla: "∇",
  nacute: "ń",
  nang: "∠⃒",
  nap: "≉",
  napE: "⩰̸",
  napid: "≋̸",
  napos: "ŉ",
  napprox: "≉",
  natur: "♮",
  natural: "♮",
  naturals: "ℕ",
  nbsp: "\xA0",
  nbump: "≎̸",
  nbumpe: "≏̸",
  ncap: "⩃",
  ncaron: "ň",
  ncedil: "ņ",
  ncong: "≇",
  ncongdot: "⩭̸",
  ncup: "⩂",
  ncy: "н",
  ndash: "–",
  ne: "≠",
  neArr: "⇗",
  nearhk: "⤤",
  nearr: "↗",
  nearrow: "↗",
  nedot: "≐̸",
  nequiv: "≢",
  nesear: "⤨",
  nesim: "≂̸",
  nexist: "∄",
  nexists: "∄",
  nfr: "𝔫",
  ngE: "≧̸",
  nge: "≱",
  ngeq: "≱",
  ngeqq: "≧̸",
  ngeqslant: "⩾̸",
  nges: "⩾̸",
  ngsim: "≵",
  ngt: "≯",
  ngtr: "≯",
  nhArr: "⇎",
  nharr: "↮",
  nhpar: "⫲",
  ni: "∋",
  nis: "⋼",
  nisd: "⋺",
  niv: "∋",
  njcy: "њ",
  nlArr: "⇍",
  nlE: "≦̸",
  nlarr: "↚",
  nldr: "‥",
  nle: "≰",
  nleftarrow: "↚",
  nleftrightarrow: "↮",
  nleq: "≰",
  nleqq: "≦̸",
  nleqslant: "⩽̸",
  nles: "⩽̸",
  nless: "≮",
  nlsim: "≴",
  nlt: "≮",
  nltri: "⋪",
  nltrie: "⋬",
  nmid: "∤",
  nopf: "𝕟",
  not: "¬",
  notin: "∉",
  notinE: "⋹̸",
  notindot: "⋵̸",
  notinva: "∉",
  notinvb: "⋷",
  notinvc: "⋶",
  notni: "∌",
  notniva: "∌",
  notnivb: "⋾",
  notnivc: "⋽",
  npar: "∦",
  nparallel: "∦",
  nparsl: "⫽⃥",
  npart: "∂̸",
  npolint: "⨔",
  npr: "⊀",
  nprcue: "⋠",
  npre: "⪯̸",
  nprec: "⊀",
  npreceq: "⪯̸",
  nrArr: "⇏",
  nrarr: "↛",
  nrarrc: "⤳̸",
  nrarrw: "↝̸",
  nrightarrow: "↛",
  nrtri: "⋫",
  nrtrie: "⋭",
  nsc: "⊁",
  nsccue: "⋡",
  nsce: "⪰̸",
  nscr: "𝓃",
  nshortmid: "∤",
  nshortparallel: "∦",
  nsim: "≁",
  nsime: "≄",
  nsimeq: "≄",
  nsmid: "∤",
  nspar: "∦",
  nsqsube: "⋢",
  nsqsupe: "⋣",
  nsub: "⊄",
  nsubE: "⫅̸",
  nsube: "⊈",
  nsubset: "⊂⃒",
  nsubseteq: "⊈",
  nsubseteqq: "⫅̸",
  nsucc: "⊁",
  nsucceq: "⪰̸",
  nsup: "⊅",
  nsupE: "⫆̸",
  nsupe: "⊉",
  nsupset: "⊃⃒",
  nsupseteq: "⊉",
  nsupseteqq: "⫆̸",
  ntgl: "≹",
  ntilde: "ñ",
  ntlg: "≸",
  ntriangleleft: "⋪",
  ntrianglelefteq: "⋬",
  ntriangleright: "⋫",
  ntrianglerighteq: "⋭",
  nu: "ν",
  num: "#",
  numero: "№",
  numsp: " ",
  nvDash: "⊭",
  nvHarr: "⤄",
  nvap: "≍⃒",
  nvdash: "⊬",
  nvge: "≥⃒",
  nvgt: ">⃒",
  nvinfin: "⧞",
  nvlArr: "⤂",
  nvle: "≤⃒",
  nvlt: "<⃒",
  nvltrie: "⊴⃒",
  nvrArr: "⤃",
  nvrtrie: "⊵⃒",
  nvsim: "∼⃒",
  nwArr: "⇖",
  nwarhk: "⤣",
  nwarr: "↖",
  nwarrow: "↖",
  nwnear: "⤧",
  oS: "Ⓢ",
  oacute: "ó",
  oast: "⊛",
  ocir: "⊚",
  ocirc: "ô",
  ocy: "о",
  odash: "⊝",
  odblac: "ő",
  odiv: "⨸",
  odot: "⊙",
  odsold: "⦼",
  oelig: "œ",
  ofcir: "⦿",
  ofr: "𝔬",
  ogon: "˛",
  ograve: "ò",
  ogt: "⧁",
  ohbar: "⦵",
  ohm: "Ω",
  oint: "∮",
  olarr: "↺",
  olcir: "⦾",
  olcross: "⦻",
  oline: "‾",
  olt: "⧀",
  omacr: "ō",
  omega: "ω",
  omicron: "ο",
  omid: "⦶",
  ominus: "⊖",
  oopf: "𝕠",
  opar: "⦷",
  operp: "⦹",
  oplus: "⊕",
  or: "∨",
  orarr: "↻",
  ord: "⩝",
  order: "ℴ",
  orderof: "ℴ",
  ordf: "ª",
  ordm: "º",
  origof: "⊶",
  oror: "⩖",
  orslope: "⩗",
  orv: "⩛",
  oscr: "ℴ",
  oslash: "ø",
  osol: "⊘",
  otilde: "õ",
  otimes: "⊗",
  otimesas: "⨶",
  ouml: "ö",
  ovbar: "⌽",
  par: "∥",
  para: "¶",
  parallel: "∥",
  parsim: "⫳",
  parsl: "⫽",
  part: "∂",
  pcy: "п",
  percnt: "%",
  period: ".",
  permil: "‰",
  perp: "⊥",
  pertenk: "‱",
  pfr: "𝔭",
  phi: "φ",
  phiv: "ϕ",
  phmmat: "ℳ",
  phone: "☎",
  pi: "π",
  pitchfork: "⋔",
  piv: "ϖ",
  planck: "ℏ",
  planckh: "ℎ",
  plankv: "ℏ",
  plus: "+",
  plusacir: "⨣",
  plusb: "⊞",
  pluscir: "⨢",
  plusdo: "∔",
  plusdu: "⨥",
  pluse: "⩲",
  plusmn: "±",
  plussim: "⨦",
  plustwo: "⨧",
  pm: "±",
  pointint: "⨕",
  popf: "𝕡",
  pound: "£",
  pr: "≺",
  prE: "⪳",
  prap: "⪷",
  prcue: "≼",
  pre: "⪯",
  prec: "≺",
  precapprox: "⪷",
  preccurlyeq: "≼",
  preceq: "⪯",
  precnapprox: "⪹",
  precneqq: "⪵",
  precnsim: "⋨",
  precsim: "≾",
  prime: "′",
  primes: "ℙ",
  prnE: "⪵",
  prnap: "⪹",
  prnsim: "⋨",
  prod: "∏",
  profalar: "⌮",
  profline: "⌒",
  profsurf: "⌓",
  prop: "∝",
  propto: "∝",
  prsim: "≾",
  prurel: "⊰",
  pscr: "𝓅",
  psi: "ψ",
  puncsp: " ",
  qfr: "𝔮",
  qint: "⨌",
  qopf: "𝕢",
  qprime: "⁗",
  qscr: "𝓆",
  quaternions: "ℍ",
  quatint: "⨖",
  quest: "?",
  questeq: "≟",
  quot: '"',
  rAarr: "⇛",
  rArr: "⇒",
  rAtail: "⤜",
  rBarr: "⤏",
  rHar: "⥤",
  race: "∽̱",
  racute: "ŕ",
  radic: "√",
  raemptyv: "⦳",
  rang: "⟩",
  rangd: "⦒",
  range: "⦥",
  rangle: "⟩",
  raquo: "»",
  rarr: "→",
  rarrap: "⥵",
  rarrb: "⇥",
  rarrbfs: "⤠",
  rarrc: "⤳",
  rarrfs: "⤞",
  rarrhk: "↪",
  rarrlp: "↬",
  rarrpl: "⥅",
  rarrsim: "⥴",
  rarrtl: "↣",
  rarrw: "↝",
  ratail: "⤚",
  ratio: "∶",
  rationals: "ℚ",
  rbarr: "⤍",
  rbbrk: "❳",
  rbrace: "}",
  rbrack: "]",
  rbrke: "⦌",
  rbrksld: "⦎",
  rbrkslu: "⦐",
  rcaron: "ř",
  rcedil: "ŗ",
  rceil: "⌉",
  rcub: "}",
  rcy: "р",
  rdca: "⤷",
  rdldhar: "⥩",
  rdquo: "”",
  rdquor: "”",
  rdsh: "↳",
  real: "ℜ",
  realine: "ℛ",
  realpart: "ℜ",
  reals: "ℝ",
  rect: "▭",
  reg: "®",
  rfisht: "⥽",
  rfloor: "⌋",
  rfr: "𝔯",
  rhard: "⇁",
  rharu: "⇀",
  rharul: "⥬",
  rho: "ρ",
  rhov: "ϱ",
  rightarrow: "→",
  rightarrowtail: "↣",
  rightharpoondown: "⇁",
  rightharpoonup: "⇀",
  rightleftarrows: "⇄",
  rightleftharpoons: "⇌",
  rightrightarrows: "⇉",
  rightsquigarrow: "↝",
  rightthreetimes: "⋌",
  ring: "˚",
  risingdotseq: "≓",
  rlarr: "⇄",
  rlhar: "⇌",
  rlm: "‏",
  rmoust: "⎱",
  rmoustache: "⎱",
  rnmid: "⫮",
  roang: "⟭",
  roarr: "⇾",
  robrk: "⟧",
  ropar: "⦆",
  ropf: "𝕣",
  roplus: "⨮",
  rotimes: "⨵",
  rpar: ")",
  rpargt: "⦔",
  rppolint: "⨒",
  rrarr: "⇉",
  rsaquo: "›",
  rscr: "𝓇",
  rsh: "↱",
  rsqb: "]",
  rsquo: "’",
  rsquor: "’",
  rthree: "⋌",
  rtimes: "⋊",
  rtri: "▹",
  rtrie: "⊵",
  rtrif: "▸",
  rtriltri: "⧎",
  ruluhar: "⥨",
  rx: "℞",
  sacute: "ś",
  sbquo: "‚",
  sc: "≻",
  scE: "⪴",
  scap: "⪸",
  scaron: "š",
  sccue: "≽",
  sce: "⪰",
  scedil: "ş",
  scirc: "ŝ",
  scnE: "⪶",
  scnap: "⪺",
  scnsim: "⋩",
  scpolint: "⨓",
  scsim: "≿",
  scy: "с",
  sdot: "⋅",
  sdotb: "⊡",
  sdote: "⩦",
  seArr: "⇘",
  searhk: "⤥",
  searr: "↘",
  searrow: "↘",
  sect: "§",
  semi: ";",
  seswar: "⤩",
  setminus: "∖",
  setmn: "∖",
  sext: "✶",
  sfr: "𝔰",
  sfrown: "⌢",
  sharp: "♯",
  shchcy: "щ",
  shcy: "ш",
  shortmid: "∣",
  shortparallel: "∥",
  shy: "­",
  sigma: "σ",
  sigmaf: "ς",
  sigmav: "ς",
  sim: "∼",
  simdot: "⩪",
  sime: "≃",
  simeq: "≃",
  simg: "⪞",
  simgE: "⪠",
  siml: "⪝",
  simlE: "⪟",
  simne: "≆",
  simplus: "⨤",
  simrarr: "⥲",
  slarr: "←",
  smallsetminus: "∖",
  smashp: "⨳",
  smeparsl: "⧤",
  smid: "∣",
  smile: "⌣",
  smt: "⪪",
  smte: "⪬",
  smtes: "⪬︀",
  softcy: "ь",
  sol: "/",
  solb: "⧄",
  solbar: "⌿",
  sopf: "𝕤",
  spades: "♠",
  spadesuit: "♠",
  spar: "∥",
  sqcap: "⊓",
  sqcaps: "⊓︀",
  sqcup: "⊔",
  sqcups: "⊔︀",
  sqsub: "⊏",
  sqsube: "⊑",
  sqsubset: "⊏",
  sqsubseteq: "⊑",
  sqsup: "⊐",
  sqsupe: "⊒",
  sqsupset: "⊐",
  sqsupseteq: "⊒",
  squ: "□",
  square: "□",
  squarf: "▪",
  squf: "▪",
  srarr: "→",
  sscr: "𝓈",
  ssetmn: "∖",
  ssmile: "⌣",
  sstarf: "⋆",
  star: "☆",
  starf: "★",
  straightepsilon: "ϵ",
  straightphi: "ϕ",
  strns: "¯",
  sub: "⊂",
  subE: "⫅",
  subdot: "⪽",
  sube: "⊆",
  subedot: "⫃",
  submult: "⫁",
  subnE: "⫋",
  subne: "⊊",
  subplus: "⪿",
  subrarr: "⥹",
  subset: "⊂",
  subseteq: "⊆",
  subseteqq: "⫅",
  subsetneq: "⊊",
  subsetneqq: "⫋",
  subsim: "⫇",
  subsub: "⫕",
  subsup: "⫓",
  succ: "≻",
  succapprox: "⪸",
  succcurlyeq: "≽",
  succeq: "⪰",
  succnapprox: "⪺",
  succneqq: "⪶",
  succnsim: "⋩",
  succsim: "≿",
  sum: "∑",
  sung: "♪",
  sup1: "¹",
  sup2: "²",
  sup3: "³",
  sup: "⊃",
  supE: "⫆",
  supdot: "⪾",
  supdsub: "⫘",
  supe: "⊇",
  supedot: "⫄",
  suphsol: "⟉",
  suphsub: "⫗",
  suplarr: "⥻",
  supmult: "⫂",
  supnE: "⫌",
  supne: "⊋",
  supplus: "⫀",
  supset: "⊃",
  supseteq: "⊇",
  supseteqq: "⫆",
  supsetneq: "⊋",
  supsetneqq: "⫌",
  supsim: "⫈",
  supsub: "⫔",
  supsup: "⫖",
  swArr: "⇙",
  swarhk: "⤦",
  swarr: "↙",
  swarrow: "↙",
  swnwar: "⤪",
  szlig: "ß",
  target: "⌖",
  tau: "τ",
  tbrk: "⎴",
  tcaron: "ť",
  tcedil: "ţ",
  tcy: "т",
  tdot: "⃛",
  telrec: "⌕",
  tfr: "𝔱",
  there4: "∴",
  therefore: "∴",
  theta: "θ",
  thetasym: "ϑ",
  thetav: "ϑ",
  thickapprox: "≈",
  thicksim: "∼",
  thinsp: " ",
  thkap: "≈",
  thksim: "∼",
  thorn: "þ",
  tilde: "˜",
  times: "×",
  timesb: "⊠",
  timesbar: "⨱",
  timesd: "⨰",
  tint: "∭",
  toea: "⤨",
  top: "⊤",
  topbot: "⌶",
  topcir: "⫱",
  topf: "𝕥",
  topfork: "⫚",
  tosa: "⤩",
  tprime: "‴",
  trade: "™",
  triangle: "▵",
  triangledown: "▿",
  triangleleft: "◃",
  trianglelefteq: "⊴",
  triangleq: "≜",
  triangleright: "▹",
  trianglerighteq: "⊵",
  tridot: "◬",
  trie: "≜",
  triminus: "⨺",
  triplus: "⨹",
  trisb: "⧍",
  tritime: "⨻",
  trpezium: "⏢",
  tscr: "𝓉",
  tscy: "ц",
  tshcy: "ћ",
  tstrok: "ŧ",
  twixt: "≬",
  twoheadleftarrow: "↞",
  twoheadrightarrow: "↠",
  uArr: "⇑",
  uHar: "⥣",
  uacute: "ú",
  uarr: "↑",
  ubrcy: "ў",
  ubreve: "ŭ",
  ucirc: "û",
  ucy: "у",
  udarr: "⇅",
  udblac: "ű",
  udhar: "⥮",
  ufisht: "⥾",
  ufr: "𝔲",
  ugrave: "ù",
  uharl: "↿",
  uharr: "↾",
  uhblk: "▀",
  ulcorn: "⌜",
  ulcorner: "⌜",
  ulcrop: "⌏",
  ultri: "◸",
  umacr: "ū",
  uml: "¨",
  uogon: "ų",
  uopf: "𝕦",
  uparrow: "↑",
  updownarrow: "↕",
  upharpoonleft: "↿",
  upharpoonright: "↾",
  uplus: "⊎",
  upsi: "υ",
  upsih: "ϒ",
  upsilon: "υ",
  upuparrows: "⇈",
  urcorn: "⌝",
  urcorner: "⌝",
  urcrop: "⌎",
  uring: "ů",
  urtri: "◹",
  uscr: "𝓊",
  utdot: "⋰",
  utilde: "ũ",
  utri: "▵",
  utrif: "▴",
  uuarr: "⇈",
  uuml: "ü",
  uwangle: "⦧",
  vArr: "⇕",
  vBar: "⫨",
  vBarv: "⫩",
  vDash: "⊨",
  vangrt: "⦜",
  varepsilon: "ϵ",
  varkappa: "ϰ",
  varnothing: "∅",
  varphi: "ϕ",
  varpi: "ϖ",
  varpropto: "∝",
  varr: "↕",
  varrho: "ϱ",
  varsigma: "ς",
  varsubsetneq: "⊊︀",
  varsubsetneqq: "⫋︀",
  varsupsetneq: "⊋︀",
  varsupsetneqq: "⫌︀",
  vartheta: "ϑ",
  vartriangleleft: "⊲",
  vartriangleright: "⊳",
  vcy: "в",
  vdash: "⊢",
  vee: "∨",
  veebar: "⊻",
  veeeq: "≚",
  vellip: "⋮",
  verbar: "|",
  vert: "|",
  vfr: "𝔳",
  vltri: "⊲",
  vnsub: "⊂⃒",
  vnsup: "⊃⃒",
  vopf: "𝕧",
  vprop: "∝",
  vrtri: "⊳",
  vscr: "𝓋",
  vsubnE: "⫋︀",
  vsubne: "⊊︀",
  vsupnE: "⫌︀",
  vsupne: "⊋︀",
  vzigzag: "⦚",
  wcirc: "ŵ",
  wedbar: "⩟",
  wedge: "∧",
  wedgeq: "≙",
  weierp: "℘",
  wfr: "𝔴",
  wopf: "𝕨",
  wp: "℘",
  wr: "≀",
  wreath: "≀",
  wscr: "𝓌",
  xcap: "⋂",
  xcirc: "◯",
  xcup: "⋃",
  xdtri: "▽",
  xfr: "𝔵",
  xhArr: "⟺",
  xharr: "⟷",
  xi: "ξ",
  xlArr: "⟸",
  xlarr: "⟵",
  xmap: "⟼",
  xnis: "⋻",
  xodot: "⨀",
  xopf: "𝕩",
  xoplus: "⨁",
  xotime: "⨂",
  xrArr: "⟹",
  xrarr: "⟶",
  xscr: "𝓍",
  xsqcup: "⨆",
  xuplus: "⨄",
  xutri: "△",
  xvee: "⋁",
  xwedge: "⋀",
  yacute: "ý",
  yacy: "я",
  ycirc: "ŷ",
  ycy: "ы",
  yen: "¥",
  yfr: "𝔶",
  yicy: "ї",
  yopf: "𝕪",
  yscr: "𝓎",
  yucy: "ю",
  yuml: "ÿ",
  zacute: "ź",
  zcaron: "ž",
  zcy: "з",
  zdot: "ż",
  zeetrf: "ℨ",
  zeta: "ζ",
  zfr: "𝔷",
  zhcy: "ж",
  zigrarr: "⇝",
  zopf: "𝕫",
  zscr: "𝓏",
  zwj: "‍",
  zwnj: "‌",
};
//#endregion
//#region node_modules/decode-named-character-reference/index.js
const own$1 = {}.hasOwnProperty;
/**
 * Decode a single character reference (without the `&` or `;`).
 * You probably only need this when you’re building parsers yourself that follow
 * different rules compared to HTML.
 * This is optimized to be tiny in browsers.
 *
 * @param {string} value
 *   `notin` (named), `#123` (deci), `#x123` (hexa).
 * @returns {string|false}
 *   Decoded reference.
 */
function decodeNamedCharacterReference(value) {
  return own$1.call(characterEntities, value) ? characterEntities[value] : false;
}
//#endregion
//#region node_modules/micromark-util-chunked/index.js
/**
 * Like `Array#splice`, but smarter for giant arrays.
 *
 * `Array#splice` takes all items to be inserted as individual argument which
 * causes a stack overflow in V8 when trying to insert 100k items for instance.
 *
 * Otherwise, this does not return the removed items, and takes `items` as an
 * array instead of rest parameters.
 *
 * @template {unknown} T
 *   Item type.
 * @param {Array<T>} list
 *   List to operate on.
 * @param {number} start
 *   Index to remove/insert at (can be negative).
 * @param {number} remove
 *   Number of items to remove.
 * @param {Array<T>} items
 *   Items to inject into `list`.
 * @returns {undefined}
 *   Nothing.
 */
function splice(list, start, remove, items) {
  const end = list.length;
  let chunkStart = 0;
  /** @type {Array<unknown>} */
  let parameters;
  if (start < 0) start = -start > end ? 0 : end + start;
  else start = start > end ? end : start;
  remove = remove > 0 ? remove : 0;
  if (items.length < 1e4) {
    parameters = Array.from(items);
    parameters.unshift(start, remove);
    list.splice(...parameters);
  } else {
    if (remove) list.splice(start, remove);
    while (chunkStart < items.length) {
      parameters = items.slice(chunkStart, chunkStart + 1e4);
      parameters.unshift(start, 0);
      list.splice(...parameters);
      chunkStart += 1e4;
      start += 1e4;
    }
  }
}
/**
 * Append `items` (an array) at the end of `list` (another array).
 * When `list` was empty, returns `items` instead.
 *
 * This prevents a potentially expensive operation when `list` is empty,
 * and adds items in batches to prevent V8 from hanging.
 *
 * @template {unknown} T
 *   Item type.
 * @param {Array<T>} list
 *   List to operate on.
 * @param {Array<T>} items
 *   Items to add to `list`.
 * @returns {Array<T>}
 *   Either `list` or `items`.
 */
function push(list, items) {
  if (list.length > 0) {
    splice(list, list.length, 0, items);
    return list;
  }
  return items;
}
//#endregion
//#region node_modules/micromark-util-combine-extensions/index.js
/**
 * @import {
 *   Extension,
 *   Handles,
 *   HtmlExtension,
 *   NormalizedExtension
 * } from 'micromark-util-types'
 */
const hasOwnProperty = {}.hasOwnProperty;
/**
 * Combine multiple syntax extensions into one.
 *
 * @param {ReadonlyArray<Extension>} extensions
 *   List of syntax extensions.
 * @returns {NormalizedExtension}
 *   A single combined extension.
 */
function combineExtensions(extensions) {
  /** @type {NormalizedExtension} */
  const all = {};
  let index = -1;
  while (++index < extensions.length) syntaxExtension(all, extensions[index]);
  return all;
}
/**
 * Merge `extension` into `all`.
 *
 * @param {NormalizedExtension} all
 *   Extension to merge into.
 * @param {Extension} extension
 *   Extension to merge.
 * @returns {undefined}
 *   Nothing.
 */
function syntaxExtension(all, extension) {
  /** @type {keyof Extension} */
  let hook;
  for (hook in extension) {
    /** @type {Record<string, unknown>} */
    const left = (hasOwnProperty.call(all, hook) ? all[hook] : void 0) || (all[hook] = {});
    /** @type {Record<string, unknown> | undefined} */
    const right = extension[hook];
    /** @type {string} */
    let code;
    if (right)
      for (code in right) {
        if (!hasOwnProperty.call(left, code)) left[code] = [];
        const value = right[code];
        constructs(left[code], Array.isArray(value) ? value : value ? [value] : []);
      }
  }
}
/**
 * Merge `list` into `existing` (both lists of constructs).
 * Mutates `existing`.
 *
 * @param {Array<unknown>} existing
 *   List of constructs to merge into.
 * @param {Array<unknown>} list
 *   List of constructs to merge.
 * @returns {undefined}
 *   Nothing.
 */
function constructs(existing, list) {
  let index = -1;
  /** @type {Array<unknown>} */
  const before = [];
  while (++index < list.length) (list[index].add === "after" ? existing : before).push(list[index]);
  splice(existing, 0, 0, before);
}
//#endregion
//#region node_modules/micromark-util-decode-numeric-character-reference/index.js
/**
 * Turn the number (in string form as either hexa- or plain decimal) coming from
 * a numeric character reference into a character.
 *
 * Sort of like `String.fromCodePoint(Number.parseInt(value, base))`, but makes
 * non-characters and control characters safe.
 *
 * @param {string} value
 *   Value to decode.
 * @param {number} base
 *   Numeric base.
 * @returns {string}
 *   Character.
 */
function decodeNumericCharacterReference(value, base) {
  const code = Number.parseInt(value, base);
  if (
    code < 9 ||
    code === 11 ||
    (code > 13 && code < 32) ||
    (code > 126 && code < 160) ||
    (code > 55295 && code < 57344) ||
    (code > 64975 && code < 65008) ||
    (code & 65535) === 65535 ||
    (code & 65535) === 65534 ||
    code > 1114111
  )
    return "�";
  return String.fromCodePoint(code);
}
//#endregion
//#region node_modules/micromark-util-normalize-identifier/index.js
/**
 * Normalize an identifier (as found in references, definitions).
 *
 * Collapses markdown whitespace, trim, and then lower- and uppercase.
 *
 * Some characters are considered “uppercase”, such as U+03F4 (`ϴ`), but if their
 * lowercase counterpart (U+03B8 (`θ`)) is uppercased will result in a different
 * uppercase character (U+0398 (`Θ`)).
 * So, to get a canonical form, we perform both lower- and uppercase.
 *
 * Using uppercase last makes sure keys will never interact with default
 * prototypal values (such as `constructor`): nothing in the prototype of
 * `Object` is uppercase.
 *
 * @param {string} value
 *   Identifier to normalize.
 * @returns {string}
 *   Normalized identifier.
 */
function normalizeIdentifier(value) {
  return value
    .replace(/[\t\n\r ]+/g, " ")
    .replace(/^ | $/g, "")
    .toLowerCase()
    .toUpperCase();
}
//#endregion
//#region node_modules/micromark-util-character/index.js
/**
 * @import {Code} from 'micromark-util-types'
 */
/**
 * Check whether the character code represents an ASCII alpha (`a` through `z`,
 * case insensitive).
 *
 * An **ASCII alpha** is an ASCII upper alpha or ASCII lower alpha.
 *
 * An **ASCII upper alpha** is a character in the inclusive range U+0041 (`A`)
 * to U+005A (`Z`).
 *
 * An **ASCII lower alpha** is a character in the inclusive range U+0061 (`a`)
 * to U+007A (`z`).
 *
 * @param code
 *   Code.
 * @returns {boolean}
 *   Whether it matches.
 */
const asciiAlpha = regexCheck(/[A-Za-z]/);
/**
 * Check whether the character code represents an ASCII alphanumeric (`a`
 * through `z`, case insensitive, or `0` through `9`).
 *
 * An **ASCII alphanumeric** is an ASCII digit (see `asciiDigit`) or ASCII alpha
 * (see `asciiAlpha`).
 *
 * @param code
 *   Code.
 * @returns {boolean}
 *   Whether it matches.
 */
const asciiAlphanumeric = regexCheck(/[\dA-Za-z]/);
/**
 * Check whether the character code represents an ASCII atext.
 *
 * atext is an ASCII alphanumeric (see `asciiAlphanumeric`), or a character in
 * the inclusive ranges U+0023 NUMBER SIGN (`#`) to U+0027 APOSTROPHE (`'`),
 * U+002A ASTERISK (`*`), U+002B PLUS SIGN (`+`), U+002D DASH (`-`), U+002F
 * SLASH (`/`), U+003D EQUALS TO (`=`), U+003F QUESTION MARK (`?`), U+005E
 * CARET (`^`) to U+0060 GRAVE ACCENT (`` ` ``), or U+007B LEFT CURLY BRACE
 * (`{`) to U+007E TILDE (`~`).
 *
 * See:
 * **\[RFC5322]**:
 * [Internet Message Format](https://tools.ietf.org/html/rfc5322).
 * P. Resnick.
 * IETF.
 *
 * @param code
 *   Code.
 * @returns {boolean}
 *   Whether it matches.
 */
const asciiAtext = regexCheck(/[#-'*+\--9=?A-Z^-~]/);
/**
 * Check whether a character code is an ASCII control character.
 *
 * An **ASCII control** is a character in the inclusive range U+0000 NULL (NUL)
 * to U+001F (US), or U+007F (DEL).
 *
 * @param {Code} code
 *   Code.
 * @returns {boolean}
 *   Whether it matches.
 */
function asciiControl(code) {
  return code !== null && (code < 32 || code === 127);
}
/**
 * Check whether the character code represents an ASCII digit (`0` through `9`).
 *
 * An **ASCII digit** is a character in the inclusive range U+0030 (`0`) to
 * U+0039 (`9`).
 *
 * @param code
 *   Code.
 * @returns {boolean}
 *   Whether it matches.
 */
const asciiDigit = regexCheck(/\d/);
/**
 * Check whether the character code represents an ASCII hex digit (`a` through
 * `f`, case insensitive, or `0` through `9`).
 *
 * An **ASCII hex digit** is an ASCII digit (see `asciiDigit`), ASCII upper hex
 * digit, or an ASCII lower hex digit.
 *
 * An **ASCII upper hex digit** is a character in the inclusive range U+0041
 * (`A`) to U+0046 (`F`).
 *
 * An **ASCII lower hex digit** is a character in the inclusive range U+0061
 * (`a`) to U+0066 (`f`).
 *
 * @param code
 *   Code.
 * @returns {boolean}
 *   Whether it matches.
 */
const asciiHexDigit = regexCheck(/[\dA-Fa-f]/);
/**
 * Check whether the character code represents ASCII punctuation.
 *
 * An **ASCII punctuation** is a character in the inclusive ranges U+0021
 * EXCLAMATION MARK (`!`) to U+002F SLASH (`/`), U+003A COLON (`:`) to U+0040 AT
 * SIGN (`@`), U+005B LEFT SQUARE BRACKET (`[`) to U+0060 GRAVE ACCENT
 * (`` ` ``), or U+007B LEFT CURLY BRACE (`{`) to U+007E TILDE (`~`).
 *
 * @param code
 *   Code.
 * @returns {boolean}
 *   Whether it matches.
 */
const asciiPunctuation = regexCheck(/[!-/:-@[-`{-~]/);
/**
 * Check whether a character code is a markdown line ending.
 *
 * A **markdown line ending** is the virtual characters M-0003 CARRIAGE RETURN
 * LINE FEED (CRLF), M-0004 LINE FEED (LF) and M-0005 CARRIAGE RETURN (CR).
 *
 * In micromark, the actual character U+000A LINE FEED (LF) and U+000D CARRIAGE
 * RETURN (CR) are replaced by these virtual characters depending on whether
 * they occurred together.
 *
 * @param {Code} code
 *   Code.
 * @returns {boolean}
 *   Whether it matches.
 */
function markdownLineEnding(code) {
  return code !== null && code < -2;
}
/**
 * Check whether a character code is a markdown line ending (see
 * `markdownLineEnding`) or markdown space (see `markdownSpace`).
 *
 * @param {Code} code
 *   Code.
 * @returns {boolean}
 *   Whether it matches.
 */
function markdownLineEndingOrSpace(code) {
  return code !== null && (code < 0 || code === 32);
}
/**
 * Check whether a character code is a markdown space.
 *
 * A **markdown space** is the concrete character U+0020 SPACE (SP) and the
 * virtual characters M-0001 VIRTUAL SPACE (VS) and M-0002 HORIZONTAL TAB (HT).
 *
 * In micromark, the actual character U+0009 CHARACTER TABULATION (HT) is
 * replaced by one M-0002 HORIZONTAL TAB (HT) and between 0 and 3 M-0001 VIRTUAL
 * SPACE (VS) characters, depending on the column at which the tab occurred.
 *
 * @param {Code} code
 *   Code.
 * @returns {boolean}
 *   Whether it matches.
 */
function markdownSpace(code) {
  return code === -2 || code === -1 || code === 32;
}
/**
 * Check whether the character code represents Unicode punctuation.
 *
 * A **Unicode punctuation** is a character in the Unicode `Pc` (Punctuation,
 * Connector), `Pd` (Punctuation, Dash), `Pe` (Punctuation, Close), `Pf`
 * (Punctuation, Final quote), `Pi` (Punctuation, Initial quote), `Po`
 * (Punctuation, Other), or `Ps` (Punctuation, Open) categories, or an ASCII
 * punctuation (see `asciiPunctuation`).
 *
 * See:
 * **\[UNICODE]**:
 * [The Unicode Standard](https://www.unicode.org/versions/).
 * Unicode Consortium.
 *
 * @param code
 *   Code.
 * @returns
 *   Whether it matches.
 */
const unicodePunctuation = regexCheck(/\p{P}|\p{S}/u);
/**
 * Check whether the character code represents Unicode whitespace.
 *
 * Note that this does handle micromark specific markdown whitespace characters.
 * See `markdownLineEndingOrSpace` to check that.
 *
 * A **Unicode whitespace** is a character in the Unicode `Zs` (Separator,
 * Space) category, or U+0009 CHARACTER TABULATION (HT), U+000A LINE FEED (LF),
 * U+000C (FF), or U+000D CARRIAGE RETURN (CR) (**\[UNICODE]**).
 *
 * See:
 * **\[UNICODE]**:
 * [The Unicode Standard](https://www.unicode.org/versions/).
 * Unicode Consortium.
 *
 * @param code
 *   Code.
 * @returns
 *   Whether it matches.
 */
const unicodeWhitespace = regexCheck(/\s/);
/**
 * Create a code check from a regex.
 *
 * @param {RegExp} regex
 *   Expression.
 * @returns {(code: Code) => boolean}
 *   Check.
 */
function regexCheck(regex) {
  return check;
  /**
   * Check whether a code matches the bound regex.
   *
   * @param {Code} code
   *   Character code.
   * @returns {boolean}
   *   Whether the character code matches the bound regex.
   */
  function check(code) {
    return code !== null && code > -1 && regex.test(String.fromCharCode(code));
  }
}
//#endregion
//#region node_modules/micromark-factory-space/index.js
/**
 * @import {Effects, State, TokenType} from 'micromark-util-types'
 */
/**
 * Parse spaces and tabs.
 *
 * There is no `nok` parameter:
 *
 * *   spaces in markdown are often optional, in which case this factory can be
 *     used and `ok` will be switched to whether spaces were found or not
 * *   one line ending or space can be detected with `markdownSpace(code)` right
 *     before using `factorySpace`
 *
 * ###### Examples
 *
 * Where `␉` represents a tab (plus how much it expands) and `␠` represents a
 * single space.
 *
 * ```markdown
 * ␉
 * ␠␠␠␠
 * ␉␠
 * ```
 *
 * @param {Effects} effects
 *   Context.
 * @param {State} ok
 *   State switched to when successful.
 * @param {TokenType} type
 *   Type (`' \t'`).
 * @param {number | undefined} [max=Infinity]
 *   Max (exclusive).
 * @returns {State}
 *   Start state.
 */
function factorySpace(effects, ok, type, max) {
  const limit = max ? max - 1 : Number.POSITIVE_INFINITY;
  let size = 0;
  return start;
  /** @type {State} */
  function start(code) {
    if (markdownSpace(code)) {
      effects.enter(type);
      return prefix(code);
    }
    return ok(code);
  }
  /** @type {State} */
  function prefix(code) {
    if (markdownSpace(code) && size++ < limit) {
      effects.consume(code);
      return prefix;
    }
    effects.exit(type);
    return ok(code);
  }
}
//#endregion
//#region node_modules/micromark/lib/initialize/content.js
/**
 * @import {
 *   InitialConstruct,
 *   Initializer,
 *   State,
 *   TokenizeContext,
 *   Token
 * } from 'micromark-util-types'
 */
/** @type {InitialConstruct} */
const content$1 = { tokenize: initializeContent };
/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Initializer}
 *   Content.
 */
function initializeContent(effects) {
  const contentStart = effects.attempt(
    this.parser.constructs.contentInitial,
    afterContentStartConstruct,
    paragraphInitial,
  );
  /** @type {Token} */
  let previous;
  return contentStart;
  /** @type {State} */
  function afterContentStartConstruct(code) {
    if (code === null) {
      effects.consume(code);
      return;
    }
    effects.enter("lineEnding");
    effects.consume(code);
    effects.exit("lineEnding");
    return factorySpace(effects, contentStart, "linePrefix");
  }
  /** @type {State} */
  function paragraphInitial(code) {
    effects.enter("paragraph");
    return lineStart(code);
  }
  /** @type {State} */
  function lineStart(code) {
    const token = effects.enter("chunkText", {
      contentType: "text",
      previous,
    });
    if (previous) previous.next = token;
    previous = token;
    return data(code);
  }
  /** @type {State} */
  function data(code) {
    if (code === null) {
      effects.exit("chunkText");
      effects.exit("paragraph");
      effects.consume(code);
      return;
    }
    if (markdownLineEnding(code)) {
      effects.consume(code);
      effects.exit("chunkText");
      return lineStart;
    }
    effects.consume(code);
    return data;
  }
}
//#endregion
//#region node_modules/micromark/lib/initialize/document.js
/**
 * @import {
 *   Construct,
 *   ContainerState,
 *   InitialConstruct,
 *   Initializer,
 *   Point,
 *   State,
 *   TokenizeContext,
 *   Tokenizer,
 *   Token
 * } from 'micromark-util-types'
 */
/**
 * @typedef {[Construct, ContainerState]} StackItem
 *   Construct and its state.
 */
/** @type {InitialConstruct} */
const document$1 = { tokenize: initializeDocument };
/** @type {Construct} */
const containerConstruct = { tokenize: tokenizeContainer };
/**
 * @this {TokenizeContext}
 *   Self.
 * @type {Initializer}
 *   Initializer.
 */
function initializeDocument(effects) {
  const self = this;
  /** @type {Array<StackItem>} */
  const stack = [];
  let continued = 0;
  /** @type {TokenizeContext | undefined} */
  let childFlow;
  /** @type {Token | undefined} */
  let childToken;
  /** @type {number} */
  let lineStartOffset;
  return start;
  /** @type {State} */
  function start(code) {
    if (continued < stack.length) {
      const item = stack[continued];
      self.containerState = item[1];
      return effects.attempt(item[0].continuation, documentContinue, checkNewContainers)(code);
    }
    return checkNewContainers(code);
  }
  /** @type {State} */
  function documentContinue(code) {
    continued++;
    if (self.containerState._closeFlow) {
      self.containerState._closeFlow = void 0;
      if (childFlow) closeFlow();
      const indexBeforeExits = self.events.length;
      let indexBeforeFlow = indexBeforeExits;
      /** @type {Point | undefined} */
      let point;
      while (indexBeforeFlow--)
        if (
          self.events[indexBeforeFlow][0] === "exit" &&
          self.events[indexBeforeFlow][1].type === "chunkFlow"
        ) {
          point = self.events[indexBeforeFlow][1].end;
          break;
        }
      exitContainers(continued);
      let index = indexBeforeExits;
      while (index < self.events.length) {
        self.events[index][1].end = { ...point };
        index++;
      }
      splice(self.events, indexBeforeFlow + 1, 0, self.events.slice(indexBeforeExits));
      self.events.length = index;
      return checkNewContainers(code);
    }
    return start(code);
  }
  /** @type {State} */
  function checkNewContainers(code) {
    if (continued === stack.length) {
      if (!childFlow) return documentContinued(code);
      if (childFlow.currentConstruct && childFlow.currentConstruct.concrete) return flowStart(code);
      self.interrupt = Boolean(
        childFlow.currentConstruct && !childFlow._gfmTableDynamicInterruptHack,
      );
    }
    self.containerState = {};
    return effects.check(containerConstruct, thereIsANewContainer, thereIsNoNewContainer)(code);
  }
  /** @type {State} */
  function thereIsANewContainer(code) {
    if (childFlow) closeFlow();
    exitContainers(continued);
    return documentContinued(code);
  }
  /** @type {State} */
  function thereIsNoNewContainer(code) {
    self.parser.lazy[self.now().line] = continued !== stack.length;
    lineStartOffset = self.now().offset;
    return flowStart(code);
  }
  /** @type {State} */
  function documentContinued(code) {
    self.containerState = {};
    return effects.attempt(containerConstruct, containerContinue, flowStart)(code);
  }
  /** @type {State} */
  function containerContinue(code) {
    continued++;
    stack.push([self.currentConstruct, self.containerState]);
    return documentContinued(code);
  }
  /** @type {State} */
  function flowStart(code) {
    if (code === null) {
      if (childFlow) closeFlow();
      exitContainers(0);
      effects.consume(code);
      return;
    }
    childFlow = childFlow || self.parser.flow(self.now());
    effects.enter("chunkFlow", {
      _tokenizer: childFlow,
      contentType: "flow",
      previous: childToken,
    });
    return flowContinue(code);
  }
  /** @type {State} */
  function flowContinue(code) {
    if (code === null) {
      writeToChild(effects.exit("chunkFlow"), true);
      exitContainers(0);
      effects.consume(code);
      return;
    }
    if (markdownLineEnding(code)) {
      effects.consume(code);
      writeToChild(effects.exit("chunkFlow"));
      continued = 0;
      self.interrupt = void 0;
      return start;
    }
    effects.consume(code);
    return flowContinue;
  }
  /**
   * @param {Token} token
   *   Token.
   * @param {boolean | undefined} [endOfFile]
   *   Whether the token is at the end of the file (default: `false`).
   * @returns {undefined}
   *   Nothing.
   */
  function writeToChild(token, endOfFile) {
    const stream = self.sliceStream(token);
    if (endOfFile) stream.push(null);
    token.previous = childToken;
    if (childToken) childToken.next = token;
    childToken = token;
    childFlow.defineSkip(token.start);
    childFlow.write(stream);
    if (self.parser.lazy[token.start.line]) {
      let index = childFlow.events.length;
      while (index--)
        if (
          childFlow.events[index][1].start.offset < lineStartOffset &&
          (!childFlow.events[index][1].end ||
            childFlow.events[index][1].end.offset > lineStartOffset)
        )
          return;
      const indexBeforeExits = self.events.length;
      let indexBeforeFlow = indexBeforeExits;
      /** @type {boolean | undefined} */
      let seen;
      /** @type {Point | undefined} */
      let point;
      while (indexBeforeFlow--)
        if (
          self.events[indexBeforeFlow][0] === "exit" &&
          self.events[indexBeforeFlow][1].type === "chunkFlow"
        ) {
          if (seen) {
            point = self.events[indexBeforeFlow][1].end;
            break;
          }
          seen = true;
        }
      exitContainers(continued);
      index = indexBeforeExits;
      while (index < self.events.length) {
        self.events[index][1].end = { ...point };
        index++;
      }
      splice(self.events, indexBeforeFlow + 1, 0, self.events.slice(indexBeforeExits));
      self.events.length = index;
    }
  }
  /**
   * @param {number} size
   *   Size.
   * @returns {undefined}
   *   Nothing.
   */
  function exitContainers(size) {
    let index = stack.length;
    while (index-- > size) {
      const entry = stack[index];
      self.containerState = entry[1];
      entry[0].exit.call(self, effects);
    }
    stack.length = size;
  }
  function closeFlow() {
    childFlow.write([null]);
    childToken = void 0;
    childFlow = void 0;
    self.containerState._closeFlow = void 0;
  }
}
/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 *   Tokenizer.
 */
function tokenizeContainer(effects, ok, nok) {
  return factorySpace(
    effects,
    effects.attempt(this.parser.constructs.document, ok, nok),
    "linePrefix",
    this.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4,
  );
}
//#endregion
//#region node_modules/micromark-util-classify-character/index.js
/**
 * @import {Code} from 'micromark-util-types'
 */
/**
 * Classify whether a code represents whitespace, punctuation, or something
 * else.
 *
 * Used for attention (emphasis, strong), whose sequences can open or close
 * based on the class of surrounding characters.
 *
 * > 👉 **Note**: eof (`null`) is seen as whitespace.
 *
 * @param {Code} code
 *   Code.
 * @returns {typeof constants.characterGroupWhitespace | typeof constants.characterGroupPunctuation | undefined}
 *   Group.
 */
function classifyCharacter(code) {
  if (code === null || markdownLineEndingOrSpace(code) || unicodeWhitespace(code)) return 1;
  if (unicodePunctuation(code)) return 2;
}
//#endregion
//#region node_modules/micromark-util-resolve-all/index.js
/**
 * @import {Event, Resolver, TokenizeContext} from 'micromark-util-types'
 */
/**
 * Call all `resolveAll`s.
 *
 * @param {ReadonlyArray<{resolveAll?: Resolver | undefined}>} constructs
 *   List of constructs, optionally with `resolveAll`s.
 * @param {Array<Event>} events
 *   List of events.
 * @param {TokenizeContext} context
 *   Context used by `tokenize`.
 * @returns {Array<Event>}
 *   Changed events.
 */
function resolveAll(constructs, events, context) {
  /** @type {Array<Resolver>} */
  const called = [];
  let index = -1;
  while (++index < constructs.length) {
    const resolve = constructs[index].resolveAll;
    if (resolve && !called.includes(resolve)) {
      events = resolve(events, context);
      called.push(resolve);
    }
  }
  return events;
}
//#endregion
//#region node_modules/micromark-core-commonmark/lib/attention.js
/**
 * @import {
 *   Code,
 *   Construct,
 *   Event,
 *   Point,
 *   Resolver,
 *   State,
 *   TokenizeContext,
 *   Tokenizer,
 *   Token
 * } from 'micromark-util-types'
 */
/** @type {Construct} */
const attention = {
  name: "attention",
  resolveAll: resolveAllAttention,
  tokenize: tokenizeAttention,
};
/**
 * Take all events and resolve attention to emphasis or strong.
 *
 * @type {Resolver}
 */
function resolveAllAttention(events, context) {
  let index = -1;
  /** @type {number} */
  let open;
  /** @type {Token} */
  let group;
  /** @type {Token} */
  let text;
  /** @type {Token} */
  let openingSequence;
  /** @type {Token} */
  let closingSequence;
  /** @type {number} */
  let use;
  /** @type {Array<Event>} */
  let nextEvents;
  /** @type {number} */
  let offset;
  while (++index < events.length)
    if (
      events[index][0] === "enter" &&
      events[index][1].type === "attentionSequence" &&
      events[index][1]._close
    ) {
      open = index;
      while (open--)
        if (
          events[open][0] === "exit" &&
          events[open][1].type === "attentionSequence" &&
          events[open][1]._open &&
          context.sliceSerialize(events[open][1]).charCodeAt(0) ===
            context.sliceSerialize(events[index][1]).charCodeAt(0)
        ) {
          if (
            (events[open][1]._close || events[index][1]._open) &&
            (events[index][1].end.offset - events[index][1].start.offset) % 3 &&
            !(
              (events[open][1].end.offset -
                events[open][1].start.offset +
                events[index][1].end.offset -
                events[index][1].start.offset) %
              3
            )
          )
            continue;
          use =
            events[open][1].end.offset - events[open][1].start.offset > 1 &&
            events[index][1].end.offset - events[index][1].start.offset > 1
              ? 2
              : 1;
          const start = { ...events[open][1].end };
          const end = { ...events[index][1].start };
          movePoint(start, -use);
          movePoint(end, use);
          openingSequence = {
            type: use > 1 ? "strongSequence" : "emphasisSequence",
            start,
            end: { ...events[open][1].end },
          };
          closingSequence = {
            type: use > 1 ? "strongSequence" : "emphasisSequence",
            start: { ...events[index][1].start },
            end,
          };
          text = {
            type: use > 1 ? "strongText" : "emphasisText",
            start: { ...events[open][1].end },
            end: { ...events[index][1].start },
          };
          group = {
            type: use > 1 ? "strong" : "emphasis",
            start: { ...openingSequence.start },
            end: { ...closingSequence.end },
          };
          events[open][1].end = { ...openingSequence.start };
          events[index][1].start = { ...closingSequence.end };
          nextEvents = [];
          if (events[open][1].end.offset - events[open][1].start.offset)
            nextEvents = push(nextEvents, [
              ["enter", events[open][1], context],
              ["exit", events[open][1], context],
            ]);
          nextEvents = push(nextEvents, [
            ["enter", group, context],
            ["enter", openingSequence, context],
            ["exit", openingSequence, context],
            ["enter", text, context],
          ]);
          nextEvents = push(
            nextEvents,
            resolveAll(
              context.parser.constructs.insideSpan.null,
              events.slice(open + 1, index),
              context,
            ),
          );
          nextEvents = push(nextEvents, [
            ["exit", text, context],
            ["enter", closingSequence, context],
            ["exit", closingSequence, context],
            ["exit", group, context],
          ]);
          if (events[index][1].end.offset - events[index][1].start.offset) {
            offset = 2;
            nextEvents = push(nextEvents, [
              ["enter", events[index][1], context],
              ["exit", events[index][1], context],
            ]);
          } else offset = 0;
          splice(events, open - 1, index - open + 3, nextEvents);
          index = open + nextEvents.length - offset - 2;
          break;
        }
    }
  index = -1;
  while (++index < events.length)
    if (events[index][1].type === "attentionSequence") events[index][1].type = "data";
  return events;
}
/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeAttention(effects, ok) {
  const attentionMarkers = this.parser.constructs.attentionMarkers.null;
  const previous = this.previous;
  const before = classifyCharacter(previous);
  /** @type {NonNullable<Code>} */
  let marker;
  return start;
  /**
   * Before a sequence.
   *
   * ```markdown
   * > | **
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    marker = code;
    effects.enter("attentionSequence");
    return inside(code);
  }
  /**
   * In a sequence.
   *
   * ```markdown
   * > | **
   *     ^^
   * ```
   *
   * @type {State}
   */
  function inside(code) {
    if (code === marker) {
      effects.consume(code);
      return inside;
    }
    const token = effects.exit("attentionSequence");
    const after = classifyCharacter(code);
    const open = !after || (after === 2 && before) || attentionMarkers.includes(code);
    const close = !before || (before === 2 && after) || attentionMarkers.includes(previous);
    token._open = Boolean(marker === 42 ? open : open && (before || !close));
    token._close = Boolean(marker === 42 ? close : close && (after || !open));
    return ok(code);
  }
}
/**
 * Move a point a bit.
 *
 * Note: `move` only works inside lines! It’s not possible to move past other
 * chunks (replacement characters, tabs, or line endings).
 *
 * @param {Point} point
 *   Point.
 * @param {number} offset
 *   Amount to move.
 * @returns {undefined}
 *   Nothing.
 */
function movePoint(point, offset) {
  point.column += offset;
  point.offset += offset;
  point._bufferIndex += offset;
}
//#endregion
//#region node_modules/micromark-core-commonmark/lib/autolink.js
/**
 * @import {
 *   Construct,
 *   State,
 *   TokenizeContext,
 *   Tokenizer
 * } from 'micromark-util-types'
 */
/** @type {Construct} */
const autolink = {
  name: "autolink",
  tokenize: tokenizeAutolink,
};
/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeAutolink(effects, ok, nok) {
  let size = 0;
  return start;
  /**
   * Start of an autolink.
   *
   * ```markdown
   * > | a<https://example.com>b
   *      ^
   * > | a<user@example.com>b
   *      ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    effects.enter("autolink");
    effects.enter("autolinkMarker");
    effects.consume(code);
    effects.exit("autolinkMarker");
    effects.enter("autolinkProtocol");
    return open;
  }
  /**
   * After `<`, at protocol or atext.
   *
   * ```markdown
   * > | a<https://example.com>b
   *       ^
   * > | a<user@example.com>b
   *       ^
   * ```
   *
   * @type {State}
   */
  function open(code) {
    if (asciiAlpha(code)) {
      effects.consume(code);
      return schemeOrEmailAtext;
    }
    if (code === 64) return nok(code);
    return emailAtext(code);
  }
  /**
   * At second byte of protocol or atext.
   *
   * ```markdown
   * > | a<https://example.com>b
   *        ^
   * > | a<user@example.com>b
   *        ^
   * ```
   *
   * @type {State}
   */
  function schemeOrEmailAtext(code) {
    if (code === 43 || code === 45 || code === 46 || asciiAlphanumeric(code)) {
      size = 1;
      return schemeInsideOrEmailAtext(code);
    }
    return emailAtext(code);
  }
  /**
   * In ambiguous protocol or atext.
   *
   * ```markdown
   * > | a<https://example.com>b
   *        ^
   * > | a<user@example.com>b
   *        ^
   * ```
   *
   * @type {State}
   */
  function schemeInsideOrEmailAtext(code) {
    if (code === 58) {
      effects.consume(code);
      size = 0;
      return urlInside;
    }
    if ((code === 43 || code === 45 || code === 46 || asciiAlphanumeric(code)) && size++ < 32) {
      effects.consume(code);
      return schemeInsideOrEmailAtext;
    }
    size = 0;
    return emailAtext(code);
  }
  /**
   * After protocol, in URL.
   *
   * ```markdown
   * > | a<https://example.com>b
   *             ^
   * ```
   *
   * @type {State}
   */
  function urlInside(code) {
    if (code === 62) {
      effects.exit("autolinkProtocol");
      effects.enter("autolinkMarker");
      effects.consume(code);
      effects.exit("autolinkMarker");
      effects.exit("autolink");
      return ok;
    }
    if (code === null || code === 32 || code === 60 || asciiControl(code)) return nok(code);
    effects.consume(code);
    return urlInside;
  }
  /**
   * In email atext.
   *
   * ```markdown
   * > | a<user.name@example.com>b
   *              ^
   * ```
   *
   * @type {State}
   */
  function emailAtext(code) {
    if (code === 64) {
      effects.consume(code);
      return emailAtSignOrDot;
    }
    if (asciiAtext(code)) {
      effects.consume(code);
      return emailAtext;
    }
    return nok(code);
  }
  /**
   * In label, after at-sign or dot.
   *
   * ```markdown
   * > | a<user.name@example.com>b
   *                 ^       ^
   * ```
   *
   * @type {State}
   */
  function emailAtSignOrDot(code) {
    return asciiAlphanumeric(code) ? emailLabel(code) : nok(code);
  }
  /**
   * In label, where `.` and `>` are allowed.
   *
   * ```markdown
   * > | a<user.name@example.com>b
   *                   ^
   * ```
   *
   * @type {State}
   */
  function emailLabel(code) {
    if (code === 46) {
      effects.consume(code);
      size = 0;
      return emailAtSignOrDot;
    }
    if (code === 62) {
      effects.exit("autolinkProtocol").type = "autolinkEmail";
      effects.enter("autolinkMarker");
      effects.consume(code);
      effects.exit("autolinkMarker");
      effects.exit("autolink");
      return ok;
    }
    return emailValue(code);
  }
  /**
   * In label, where `.` and `>` are *not* allowed.
   *
   * Though, this is also used in `emailLabel` to parse other values.
   *
   * ```markdown
   * > | a<user.name@ex-ample.com>b
   *                    ^
   * ```
   *
   * @type {State}
   */
  function emailValue(code) {
    if ((code === 45 || asciiAlphanumeric(code)) && size++ < 63) {
      const next = code === 45 ? emailValue : emailLabel;
      effects.consume(code);
      return next;
    }
    return nok(code);
  }
}
//#endregion
//#region node_modules/micromark-core-commonmark/lib/blank-line.js
/**
 * @import {
 *   Construct,
 *   State,
 *   TokenizeContext,
 *   Tokenizer
 * } from 'micromark-util-types'
 */
/** @type {Construct} */
const blankLine = {
  partial: true,
  tokenize: tokenizeBlankLine,
};
/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeBlankLine(effects, ok, nok) {
  return start;
  /**
   * Start of blank line.
   *
   * > 👉 **Note**: `␠` represents a space character.
   *
   * ```markdown
   * > | ␠␠␊
   *     ^
   * > | ␊
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    return markdownSpace(code) ? factorySpace(effects, after, "linePrefix")(code) : after(code);
  }
  /**
   * At eof/eol, after optional whitespace.
   *
   * > 👉 **Note**: `␠` represents a space character.
   *
   * ```markdown
   * > | ␠␠␊
   *       ^
   * > | ␊
   *     ^
   * ```
   *
   * @type {State}
   */
  function after(code) {
    return code === null || markdownLineEnding(code) ? ok(code) : nok(code);
  }
}
//#endregion
//#region node_modules/micromark-core-commonmark/lib/block-quote.js
/**
 * @import {
 *   Construct,
 *   Exiter,
 *   State,
 *   TokenizeContext,
 *   Tokenizer
 * } from 'micromark-util-types'
 */
/** @type {Construct} */
const blockQuote = {
  continuation: { tokenize: tokenizeBlockQuoteContinuation },
  exit,
  name: "blockQuote",
  tokenize: tokenizeBlockQuoteStart,
};
/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeBlockQuoteStart(effects, ok, nok) {
  const self = this;
  return start;
  /**
   * Start of block quote.
   *
   * ```markdown
   * > | > a
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    if (code === 62) {
      const state = self.containerState;
      if (!state.open) {
        effects.enter("blockQuote", { _container: true });
        state.open = true;
      }
      effects.enter("blockQuotePrefix");
      effects.enter("blockQuoteMarker");
      effects.consume(code);
      effects.exit("blockQuoteMarker");
      return after;
    }
    return nok(code);
  }
  /**
   * After `>`, before optional whitespace.
   *
   * ```markdown
   * > | > a
   *      ^
   * ```
   *
   * @type {State}
   */
  function after(code) {
    if (markdownSpace(code)) {
      effects.enter("blockQuotePrefixWhitespace");
      effects.consume(code);
      effects.exit("blockQuotePrefixWhitespace");
      effects.exit("blockQuotePrefix");
      return ok;
    }
    effects.exit("blockQuotePrefix");
    return ok(code);
  }
}
/**
 * Start of block quote continuation.
 *
 * ```markdown
 *   | > a
 * > | > b
 *     ^
 * ```
 *
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeBlockQuoteContinuation(effects, ok, nok) {
  const self = this;
  return contStart;
  /**
   * Start of block quote continuation.
   *
   * Also used to parse the first block quote opening.
   *
   * ```markdown
   *   | > a
   * > | > b
   *     ^
   * ```
   *
   * @type {State}
   */
  function contStart(code) {
    if (markdownSpace(code))
      return factorySpace(
        effects,
        contBefore,
        "linePrefix",
        self.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4,
      )(code);
    return contBefore(code);
  }
  /**
   * At `>`, after optional whitespace.
   *
   * Also used to parse the first block quote opening.
   *
   * ```markdown
   *   | > a
   * > | > b
   *     ^
   * ```
   *
   * @type {State}
   */
  function contBefore(code) {
    return effects.attempt(blockQuote, ok, nok)(code);
  }
}
/** @type {Exiter} */
function exit(effects) {
  effects.exit("blockQuote");
}
//#endregion
//#region node_modules/micromark-core-commonmark/lib/character-escape.js
/**
 * @import {
 *   Construct,
 *   State,
 *   TokenizeContext,
 *   Tokenizer
 * } from 'micromark-util-types'
 */
/** @type {Construct} */
const characterEscape = {
  name: "characterEscape",
  tokenize: tokenizeCharacterEscape,
};
/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeCharacterEscape(effects, ok, nok) {
  return start;
  /**
   * Start of character escape.
   *
   * ```markdown
   * > | a\*b
   *      ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    effects.enter("characterEscape");
    effects.enter("escapeMarker");
    effects.consume(code);
    effects.exit("escapeMarker");
    return inside;
  }
  /**
   * After `\`, at punctuation.
   *
   * ```markdown
   * > | a\*b
   *       ^
   * ```
   *
   * @type {State}
   */
  function inside(code) {
    if (asciiPunctuation(code)) {
      effects.enter("characterEscapeValue");
      effects.consume(code);
      effects.exit("characterEscapeValue");
      effects.exit("characterEscape");
      return ok;
    }
    return nok(code);
  }
}
//#endregion
//#region node_modules/micromark-core-commonmark/lib/character-reference.js
/**
 * @import {
 *   Code,
 *   Construct,
 *   State,
 *   TokenizeContext,
 *   Tokenizer
 * } from 'micromark-util-types'
 */
/** @type {Construct} */
const characterReference = {
  name: "characterReference",
  tokenize: tokenizeCharacterReference,
};
/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeCharacterReference(effects, ok, nok) {
  const self = this;
  let size = 0;
  /** @type {number} */
  let max;
  /** @type {(code: Code) => boolean} */
  let test;
  return start;
  /**
   * Start of character reference.
   *
   * ```markdown
   * > | a&amp;b
   *      ^
   * > | a&#123;b
   *      ^
   * > | a&#x9;b
   *      ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    effects.enter("characterReference");
    effects.enter("characterReferenceMarker");
    effects.consume(code);
    effects.exit("characterReferenceMarker");
    return open;
  }
  /**
   * After `&`, at `#` for numeric references or alphanumeric for named
   * references.
   *
   * ```markdown
   * > | a&amp;b
   *       ^
   * > | a&#123;b
   *       ^
   * > | a&#x9;b
   *       ^
   * ```
   *
   * @type {State}
   */
  function open(code) {
    if (code === 35) {
      effects.enter("characterReferenceMarkerNumeric");
      effects.consume(code);
      effects.exit("characterReferenceMarkerNumeric");
      return numeric;
    }
    effects.enter("characterReferenceValue");
    max = 31;
    test = asciiAlphanumeric;
    return value(code);
  }
  /**
   * After `#`, at `x` for hexadecimals or digit for decimals.
   *
   * ```markdown
   * > | a&#123;b
   *        ^
   * > | a&#x9;b
   *        ^
   * ```
   *
   * @type {State}
   */
  function numeric(code) {
    if (code === 88 || code === 120) {
      effects.enter("characterReferenceMarkerHexadecimal");
      effects.consume(code);
      effects.exit("characterReferenceMarkerHexadecimal");
      effects.enter("characterReferenceValue");
      max = 6;
      test = asciiHexDigit;
      return value;
    }
    effects.enter("characterReferenceValue");
    max = 7;
    test = asciiDigit;
    return value(code);
  }
  /**
   * After markers (`&#x`, `&#`, or `&`), in value, before `;`.
   *
   * The character reference kind defines what and how many characters are
   * allowed.
   *
   * ```markdown
   * > | a&amp;b
   *       ^^^
   * > | a&#123;b
   *        ^^^
   * > | a&#x9;b
   *         ^
   * ```
   *
   * @type {State}
   */
  function value(code) {
    if (code === 59 && size) {
      const token = effects.exit("characterReferenceValue");
      if (test === asciiAlphanumeric && !decodeNamedCharacterReference(self.sliceSerialize(token)))
        return nok(code);
      effects.enter("characterReferenceMarker");
      effects.consume(code);
      effects.exit("characterReferenceMarker");
      effects.exit("characterReference");
      return ok;
    }
    if (test(code) && size++ < max) {
      effects.consume(code);
      return value;
    }
    return nok(code);
  }
}
//#endregion
//#region node_modules/micromark-core-commonmark/lib/code-fenced.js
/**
 * @import {
 *   Code,
 *   Construct,
 *   State,
 *   TokenizeContext,
 *   Tokenizer
 * } from 'micromark-util-types'
 */
/** @type {Construct} */
const nonLazyContinuation = {
  partial: true,
  tokenize: tokenizeNonLazyContinuation,
};
/** @type {Construct} */
const codeFenced = {
  concrete: true,
  name: "codeFenced",
  tokenize: tokenizeCodeFenced,
};
/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeCodeFenced(effects, ok, nok) {
  const self = this;
  /** @type {Construct} */
  const closeStart = {
    partial: true,
    tokenize: tokenizeCloseStart,
  };
  let initialPrefix = 0;
  let sizeOpen = 0;
  /** @type {NonNullable<Code>} */
  let marker;
  return start;
  /**
   * Start of code.
   *
   * ```markdown
   * > | ~~~js
   *     ^
   *   | alert(1)
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function start(code) {
    return beforeSequenceOpen(code);
  }
  /**
   * In opening fence, after prefix, at sequence.
   *
   * ```markdown
   * > | ~~~js
   *     ^
   *   | alert(1)
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function beforeSequenceOpen(code) {
    const tail = self.events[self.events.length - 1];
    initialPrefix =
      tail && tail[1].type === "linePrefix" ? tail[2].sliceSerialize(tail[1], true).length : 0;
    marker = code;
    effects.enter("codeFenced");
    effects.enter("codeFencedFence");
    effects.enter("codeFencedFenceSequence");
    return sequenceOpen(code);
  }
  /**
   * In opening fence sequence.
   *
   * ```markdown
   * > | ~~~js
   *      ^
   *   | alert(1)
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function sequenceOpen(code) {
    if (code === marker) {
      sizeOpen++;
      effects.consume(code);
      return sequenceOpen;
    }
    if (sizeOpen < 3) return nok(code);
    effects.exit("codeFencedFenceSequence");
    return markdownSpace(code)
      ? factorySpace(effects, infoBefore, "whitespace")(code)
      : infoBefore(code);
  }
  /**
   * In opening fence, after the sequence (and optional whitespace), before info.
   *
   * ```markdown
   * > | ~~~js
   *        ^
   *   | alert(1)
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function infoBefore(code) {
    if (code === null || markdownLineEnding(code)) {
      effects.exit("codeFencedFence");
      return self.interrupt
        ? ok(code)
        : effects.check(nonLazyContinuation, atNonLazyBreak, after)(code);
    }
    effects.enter("codeFencedFenceInfo");
    effects.enter("chunkString", { contentType: "string" });
    return info(code);
  }
  /**
   * In info.
   *
   * ```markdown
   * > | ~~~js
   *        ^
   *   | alert(1)
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function info(code) {
    if (code === null || markdownLineEnding(code)) {
      effects.exit("chunkString");
      effects.exit("codeFencedFenceInfo");
      return infoBefore(code);
    }
    if (markdownSpace(code)) {
      effects.exit("chunkString");
      effects.exit("codeFencedFenceInfo");
      return factorySpace(effects, metaBefore, "whitespace")(code);
    }
    if (code === 96 && code === marker) return nok(code);
    effects.consume(code);
    return info;
  }
  /**
   * In opening fence, after info and whitespace, before meta.
   *
   * ```markdown
   * > | ~~~js eval
   *           ^
   *   | alert(1)
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function metaBefore(code) {
    if (code === null || markdownLineEnding(code)) return infoBefore(code);
    effects.enter("codeFencedFenceMeta");
    effects.enter("chunkString", { contentType: "string" });
    return meta(code);
  }
  /**
   * In meta.
   *
   * ```markdown
   * > | ~~~js eval
   *           ^
   *   | alert(1)
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function meta(code) {
    if (code === null || markdownLineEnding(code)) {
      effects.exit("chunkString");
      effects.exit("codeFencedFenceMeta");
      return infoBefore(code);
    }
    if (code === 96 && code === marker) return nok(code);
    effects.consume(code);
    return meta;
  }
  /**
   * At eol/eof in code, before a non-lazy closing fence or content.
   *
   * ```markdown
   * > | ~~~js
   *          ^
   * > | alert(1)
   *             ^
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function atNonLazyBreak(code) {
    return effects.attempt(closeStart, after, contentBefore)(code);
  }
  /**
   * Before code content, not a closing fence, at eol.
   *
   * ```markdown
   *   | ~~~js
   * > | alert(1)
   *             ^
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function contentBefore(code) {
    effects.enter("lineEnding");
    effects.consume(code);
    effects.exit("lineEnding");
    return contentStart;
  }
  /**
   * Before code content, not a closing fence.
   *
   * ```markdown
   *   | ~~~js
   * > | alert(1)
   *     ^
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function contentStart(code) {
    return initialPrefix > 0 && markdownSpace(code)
      ? factorySpace(effects, beforeContentChunk, "linePrefix", initialPrefix + 1)(code)
      : beforeContentChunk(code);
  }
  /**
   * Before code content, after optional prefix.
   *
   * ```markdown
   *   | ~~~js
   * > | alert(1)
   *     ^
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function beforeContentChunk(code) {
    if (code === null || markdownLineEnding(code))
      return effects.check(nonLazyContinuation, atNonLazyBreak, after)(code);
    effects.enter("codeFlowValue");
    return contentChunk(code);
  }
  /**
   * In code content.
   *
   * ```markdown
   *   | ~~~js
   * > | alert(1)
   *     ^^^^^^^^
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function contentChunk(code) {
    if (code === null || markdownLineEnding(code)) {
      effects.exit("codeFlowValue");
      return beforeContentChunk(code);
    }
    effects.consume(code);
    return contentChunk;
  }
  /**
   * After code.
   *
   * ```markdown
   *   | ~~~js
   *   | alert(1)
   * > | ~~~
   *        ^
   * ```
   *
   * @type {State}
   */
  function after(code) {
    effects.exit("codeFenced");
    return ok(code);
  }
  /**
   * @this {TokenizeContext}
   *   Context.
   * @type {Tokenizer}
   */
  function tokenizeCloseStart(effects, ok, nok) {
    let size = 0;
    return startBefore;
    /**
     *
     *
     * @type {State}
     */
    function startBefore(code) {
      effects.enter("lineEnding");
      effects.consume(code);
      effects.exit("lineEnding");
      return start;
    }
    /**
     * Before closing fence, at optional whitespace.
     *
     * ```markdown
     *   | ~~~js
     *   | alert(1)
     * > | ~~~
     *     ^
     * ```
     *
     * @type {State}
     */
    function start(code) {
      effects.enter("codeFencedFence");
      return markdownSpace(code)
        ? factorySpace(
            effects,
            beforeSequenceClose,
            "linePrefix",
            self.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4,
          )(code)
        : beforeSequenceClose(code);
    }
    /**
     * In closing fence, after optional whitespace, at sequence.
     *
     * ```markdown
     *   | ~~~js
     *   | alert(1)
     * > | ~~~
     *     ^
     * ```
     *
     * @type {State}
     */
    function beforeSequenceClose(code) {
      if (code === marker) {
        effects.enter("codeFencedFenceSequence");
        return sequenceClose(code);
      }
      return nok(code);
    }
    /**
     * In closing fence sequence.
     *
     * ```markdown
     *   | ~~~js
     *   | alert(1)
     * > | ~~~
     *     ^
     * ```
     *
     * @type {State}
     */
    function sequenceClose(code) {
      if (code === marker) {
        size++;
        effects.consume(code);
        return sequenceClose;
      }
      if (size >= sizeOpen) {
        effects.exit("codeFencedFenceSequence");
        return markdownSpace(code)
          ? factorySpace(effects, sequenceCloseAfter, "whitespace")(code)
          : sequenceCloseAfter(code);
      }
      return nok(code);
    }
    /**
     * After closing fence sequence, after optional whitespace.
     *
     * ```markdown
     *   | ~~~js
     *   | alert(1)
     * > | ~~~
     *        ^
     * ```
     *
     * @type {State}
     */
    function sequenceCloseAfter(code) {
      if (code === null || markdownLineEnding(code)) {
        effects.exit("codeFencedFence");
        return ok(code);
      }
      return nok(code);
    }
  }
}
/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeNonLazyContinuation(effects, ok, nok) {
  const self = this;
  return start;
  /**
   *
   *
   * @type {State}
   */
  function start(code) {
    if (code === null) return nok(code);
    effects.enter("lineEnding");
    effects.consume(code);
    effects.exit("lineEnding");
    return lineStart;
  }
  /**
   *
   *
   * @type {State}
   */
  function lineStart(code) {
    return self.parser.lazy[self.now().line] ? nok(code) : ok(code);
  }
}
//#endregion
//#region node_modules/micromark-core-commonmark/lib/code-indented.js
/**
 * @import {
 *   Construct,
 *   State,
 *   TokenizeContext,
 *   Tokenizer
 * } from 'micromark-util-types'
 */
/** @type {Construct} */
const codeIndented = {
  name: "codeIndented",
  tokenize: tokenizeCodeIndented,
};
/** @type {Construct} */
const furtherStart = {
  partial: true,
  tokenize: tokenizeFurtherStart,
};
/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeCodeIndented(effects, ok, nok) {
  const self = this;
  return start;
  /**
   * Start of code (indented).
   *
   * > **Parsing note**: it is not needed to check if this first line is a
   * > filled line (that it has a non-whitespace character), because blank lines
   * > are parsed already, so we never run into that.
   *
   * ```markdown
   * > |     aaa
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    effects.enter("codeIndented");
    return factorySpace(effects, afterPrefix, "linePrefix", 5)(code);
  }
  /**
   * At start, after 1 or 4 spaces.
   *
   * ```markdown
   * > |     aaa
   *         ^
   * ```
   *
   * @type {State}
   */
  function afterPrefix(code) {
    const tail = self.events[self.events.length - 1];
    return tail &&
      tail[1].type === "linePrefix" &&
      tail[2].sliceSerialize(tail[1], true).length >= 4
      ? atBreak(code)
      : nok(code);
  }
  /**
   * At a break.
   *
   * ```markdown
   * > |     aaa
   *         ^  ^
   * ```
   *
   * @type {State}
   */
  function atBreak(code) {
    if (code === null) return after(code);
    if (markdownLineEnding(code)) return effects.attempt(furtherStart, atBreak, after)(code);
    effects.enter("codeFlowValue");
    return inside(code);
  }
  /**
   * In code content.
   *
   * ```markdown
   * > |     aaa
   *         ^^^^
   * ```
   *
   * @type {State}
   */
  function inside(code) {
    if (code === null || markdownLineEnding(code)) {
      effects.exit("codeFlowValue");
      return atBreak(code);
    }
    effects.consume(code);
    return inside;
  }
  /** @type {State} */
  function after(code) {
    effects.exit("codeIndented");
    return ok(code);
  }
}
/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeFurtherStart(effects, ok, nok) {
  const self = this;
  return furtherStart;
  /**
   * At eol, trying to parse another indent.
   *
   * ```markdown
   * > |     aaa
   *            ^
   *   |     bbb
   * ```
   *
   * @type {State}
   */
  function furtherStart(code) {
    if (self.parser.lazy[self.now().line]) return nok(code);
    if (markdownLineEnding(code)) {
      effects.enter("lineEnding");
      effects.consume(code);
      effects.exit("lineEnding");
      return furtherStart;
    }
    return factorySpace(effects, afterPrefix, "linePrefix", 5)(code);
  }
  /**
   * At start, after 1 or 4 spaces.
   *
   * ```markdown
   * > |     aaa
   *         ^
   * ```
   *
   * @type {State}
   */
  function afterPrefix(code) {
    const tail = self.events[self.events.length - 1];
    return tail &&
      tail[1].type === "linePrefix" &&
      tail[2].sliceSerialize(tail[1], true).length >= 4
      ? ok(code)
      : markdownLineEnding(code)
        ? furtherStart(code)
        : nok(code);
  }
}
//#endregion
//#region node_modules/micromark-core-commonmark/lib/code-text.js
/**
 * @import {
 *   Construct,
 *   Previous,
 *   Resolver,
 *   State,
 *   TokenizeContext,
 *   Tokenizer,
 *   Token
 * } from 'micromark-util-types'
 */
/** @type {Construct} */
const codeText = {
  name: "codeText",
  previous,
  resolve: resolveCodeText,
  tokenize: tokenizeCodeText,
};
/** @type {Resolver} */
function resolveCodeText(events) {
  let tailExitIndex = events.length - 4;
  let headEnterIndex = 3;
  /** @type {number} */
  let index;
  /** @type {number | undefined} */
  let enter;
  if (
    (events[headEnterIndex][1].type === "lineEnding" ||
      events[headEnterIndex][1].type === "space") &&
    (events[tailExitIndex][1].type === "lineEnding" || events[tailExitIndex][1].type === "space")
  ) {
    index = headEnterIndex;
    while (++index < tailExitIndex)
      if (events[index][1].type === "codeTextData") {
        events[headEnterIndex][1].type = "codeTextPadding";
        events[tailExitIndex][1].type = "codeTextPadding";
        headEnterIndex += 2;
        tailExitIndex -= 2;
        break;
      }
  }
  index = headEnterIndex - 1;
  tailExitIndex++;
  while (++index <= tailExitIndex)
    if (enter === void 0) {
      if (index !== tailExitIndex && events[index][1].type !== "lineEnding") enter = index;
    } else if (index === tailExitIndex || events[index][1].type === "lineEnding") {
      events[enter][1].type = "codeTextData";
      if (index !== enter + 2) {
        events[enter][1].end = events[index - 1][1].end;
        events.splice(enter + 2, index - enter - 2);
        tailExitIndex -= index - enter - 2;
        index = enter + 2;
      }
      enter = void 0;
    }
  return events;
}
/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Previous}
 */
function previous(code) {
  return code !== 96 || this.events[this.events.length - 1][1].type === "characterEscape";
}
/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeCodeText(effects, ok, nok) {
  let sizeOpen = 0;
  /** @type {number} */
  let size;
  /** @type {Token} */
  let token;
  return start;
  /**
   * Start of code (text).
   *
   * ```markdown
   * > | `a`
   *     ^
   * > | \`a`
   *      ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    effects.enter("codeText");
    effects.enter("codeTextSequence");
    return sequenceOpen(code);
  }
  /**
   * In opening sequence.
   *
   * ```markdown
   * > | `a`
   *     ^
   * ```
   *
   * @type {State}
   */
  function sequenceOpen(code) {
    if (code === 96) {
      effects.consume(code);
      sizeOpen++;
      return sequenceOpen;
    }
    effects.exit("codeTextSequence");
    return between(code);
  }
  /**
   * Between something and something else.
   *
   * ```markdown
   * > | `a`
   *      ^^
   * ```
   *
   * @type {State}
   */
  function between(code) {
    if (code === null) return nok(code);
    if (code === 32) {
      effects.enter("space");
      effects.consume(code);
      effects.exit("space");
      return between;
    }
    if (code === 96) {
      token = effects.enter("codeTextSequence");
      size = 0;
      return sequenceClose(code);
    }
    if (markdownLineEnding(code)) {
      effects.enter("lineEnding");
      effects.consume(code);
      effects.exit("lineEnding");
      return between;
    }
    effects.enter("codeTextData");
    return data(code);
  }
  /**
   * In data.
   *
   * ```markdown
   * > | `a`
   *      ^
   * ```
   *
   * @type {State}
   */
  function data(code) {
    if (code === null || code === 32 || code === 96 || markdownLineEnding(code)) {
      effects.exit("codeTextData");
      return between(code);
    }
    effects.consume(code);
    return data;
  }
  /**
   * In closing sequence.
   *
   * ```markdown
   * > | `a`
   *       ^
   * ```
   *
   * @type {State}
   */
  function sequenceClose(code) {
    if (code === 96) {
      effects.consume(code);
      size++;
      return sequenceClose;
    }
    if (size === sizeOpen) {
      effects.exit("codeTextSequence");
      effects.exit("codeText");
      return ok(code);
    }
    token.type = "codeTextData";
    return data(code);
  }
}
//#endregion
//#region node_modules/micromark-util-subtokenize/lib/splice-buffer.js
/**
 * Some of the internal operations of micromark do lots of editing
 * operations on very large arrays. This runs into problems with two
 * properties of most circa-2020 JavaScript interpreters:
 *
 *  - Array-length modifications at the high end of an array (push/pop) are
 *    expected to be common and are implemented in (amortized) time
 *    proportional to the number of elements added or removed, whereas
 *    other operations (shift/unshift and splice) are much less efficient.
 *  - Function arguments are passed on the stack, so adding tens of thousands
 *    of elements to an array with `arr.push(...newElements)` will frequently
 *    cause stack overflows. (see <https://stackoverflow.com/questions/22123769/rangeerror-maximum-call-stack-size-exceeded-why>)
 *
 * SpliceBuffers are an implementation of gap buffers, which are a
 * generalization of the "queue made of two stacks" idea. The splice buffer
 * maintains a cursor, and moving the cursor has cost proportional to the
 * distance the cursor moves, but inserting, deleting, or splicing in
 * new information at the cursor is as efficient as the push/pop operation.
 * This allows for an efficient sequence of splices (or pushes, pops, shifts,
 * or unshifts) as long such edits happen at the same part of the array or
 * generally sweep through the array from the beginning to the end.
 *
 * The interface for splice buffers also supports large numbers of inputs by
 * passing a single array argument rather passing multiple arguments on the
 * function call stack.
 *
 * @template T
 *   Item type.
 */
var SpliceBuffer = class {
  /**
   * @param {ReadonlyArray<T> | null | undefined} [initial]
   *   Initial items (optional).
   * @returns
   *   Splice buffer.
   */
  constructor(initial) {
    /** @type {Array<T>} */
    this.left = initial ? [...initial] : [];
    /** @type {Array<T>} */
    this.right = [];
  }
  /**
   * Array access;
   * does not move the cursor.
   *
   * @param {number} index
   *   Index.
   * @return {T}
   *   Item.
   */
  get(index) {
    if (index < 0 || index >= this.left.length + this.right.length)
      throw new RangeError(
        "Cannot access index `" +
          index +
          "` in a splice buffer of size `" +
          (this.left.length + this.right.length) +
          "`",
      );
    if (index < this.left.length) return this.left[index];
    return this.right[this.right.length - index + this.left.length - 1];
  }
  /**
   * The length of the splice buffer, one greater than the largest index in the
   * array.
   */
  get length() {
    return this.left.length + this.right.length;
  }
  /**
   * Remove and return `list[0]`;
   * moves the cursor to `0`.
   *
   * @returns {T | undefined}
   *   Item, optional.
   */
  shift() {
    this.setCursor(0);
    return this.right.pop();
  }
  /**
   * Slice the buffer to get an array;
   * does not move the cursor.
   *
   * @param {number} start
   *   Start.
   * @param {number | null | undefined} [end]
   *   End (optional).
   * @returns {Array<T>}
   *   Array of items.
   */
  slice(start, end) {
    /** @type {number} */
    const stop = end === null || end === void 0 ? Number.POSITIVE_INFINITY : end;
    if (stop < this.left.length) return this.left.slice(start, stop);
    if (start > this.left.length)
      return this.right
        .slice(
          this.right.length - stop + this.left.length,
          this.right.length - start + this.left.length,
        )
        .reverse();
    return this.left
      .slice(start)
      .concat(this.right.slice(this.right.length - stop + this.left.length).reverse());
  }
  /**
   * Mimics the behavior of Array.prototype.splice() except for the change of
   * interface necessary to avoid segfaults when patching in very large arrays.
   *
   * This operation moves cursor is moved to `start` and results in the cursor
   * placed after any inserted items.
   *
   * @param {number} start
   *   Start;
   *   zero-based index at which to start changing the array;
   *   negative numbers count backwards from the end of the array and values
   *   that are out-of bounds are clamped to the appropriate end of the array.
   * @param {number | null | undefined} [deleteCount=0]
   *   Delete count (default: `0`);
   *   maximum number of elements to delete, starting from start.
   * @param {Array<T> | null | undefined} [items=[]]
   *   Items to include in place of the deleted items (default: `[]`).
   * @return {Array<T>}
   *   Any removed items.
   */
  splice(start, deleteCount, items) {
    /** @type {number} */
    const count = deleteCount || 0;
    this.setCursor(Math.trunc(start));
    const removed = this.right.splice(this.right.length - count, Number.POSITIVE_INFINITY);
    if (items) chunkedPush(this.left, items);
    return removed.reverse();
  }
  /**
   * Remove and return the highest-numbered item in the array, so
   * `list[list.length - 1]`;
   * Moves the cursor to `length`.
   *
   * @returns {T | undefined}
   *   Item, optional.
   */
  pop() {
    this.setCursor(Number.POSITIVE_INFINITY);
    return this.left.pop();
  }
  /**
   * Inserts a single item to the high-numbered side of the array;
   * moves the cursor to `length`.
   *
   * @param {T} item
   *   Item.
   * @returns {undefined}
   *   Nothing.
   */
  push(item) {
    this.setCursor(Number.POSITIVE_INFINITY);
    this.left.push(item);
  }
  /**
   * Inserts many items to the high-numbered side of the array.
   * Moves the cursor to `length`.
   *
   * @param {Array<T>} items
   *   Items.
   * @returns {undefined}
   *   Nothing.
   */
  pushMany(items) {
    this.setCursor(Number.POSITIVE_INFINITY);
    chunkedPush(this.left, items);
  }
  /**
   * Inserts a single item to the low-numbered side of the array;
   * Moves the cursor to `0`.
   *
   * @param {T} item
   *   Item.
   * @returns {undefined}
   *   Nothing.
   */
  unshift(item) {
    this.setCursor(0);
    this.right.push(item);
  }
  /**
   * Inserts many items to the low-numbered side of the array;
   * moves the cursor to `0`.
   *
   * @param {Array<T>} items
   *   Items.
   * @returns {undefined}
   *   Nothing.
   */
  unshiftMany(items) {
    this.setCursor(0);
    chunkedPush(this.right, items.reverse());
  }
  /**
   * Move the cursor to a specific position in the array. Requires
   * time proportional to the distance moved.
   *
   * If `n < 0`, the cursor will end up at the beginning.
   * If `n > length`, the cursor will end up at the end.
   *
   * @param {number} n
   *   Position.
   * @return {undefined}
   *   Nothing.
   */
  setCursor(n) {
    if (
      n === this.left.length ||
      (n > this.left.length && this.right.length === 0) ||
      (n < 0 && this.left.length === 0)
    )
      return;
    if (n < this.left.length) {
      const removed = this.left.splice(n, Number.POSITIVE_INFINITY);
      chunkedPush(this.right, removed.reverse());
    } else {
      const removed = this.right.splice(
        this.left.length + this.right.length - n,
        Number.POSITIVE_INFINITY,
      );
      chunkedPush(this.left, removed.reverse());
    }
  }
};
/**
 * Avoid stack overflow by pushing items onto the stack in segments
 *
 * @template T
 *   Item type.
 * @param {Array<T>} list
 *   List to inject into.
 * @param {ReadonlyArray<T>} right
 *   Items to inject.
 * @return {undefined}
 *   Nothing.
 */
function chunkedPush(list, right) {
  /** @type {number} */
  let chunkStart = 0;
  if (right.length < 1e4) list.push(...right);
  else
    while (chunkStart < right.length) {
      list.push(...right.slice(chunkStart, chunkStart + 1e4));
      chunkStart += 1e4;
    }
}
//#endregion
//#region node_modules/micromark-util-subtokenize/index.js
/**
 * @import {Chunk, Event, Token} from 'micromark-util-types'
 */
/**
 * Tokenize subcontent.
 *
 * @param {Array<Event>} eventsArray
 *   List of events.
 * @returns {boolean}
 *   Whether subtokens were found.
 */
function subtokenize(eventsArray) {
  /** @type {Record<string, number>} */
  const jumps = {};
  let index = -1;
  /** @type {Event} */
  let event;
  /** @type {number | undefined} */
  let lineIndex;
  /** @type {number} */
  let otherIndex;
  /** @type {Event} */
  let otherEvent;
  /** @type {Array<Event>} */
  let parameters;
  /** @type {Array<Event>} */
  let subevents;
  /** @type {boolean | undefined} */
  let more;
  const events = new SpliceBuffer(eventsArray);
  while (++index < events.length) {
    while (index in jumps) index = jumps[index];
    event = events.get(index);
    if (
      index &&
      event[1].type === "chunkFlow" &&
      events.get(index - 1)[1].type === "listItemPrefix"
    ) {
      subevents = event[1]._tokenizer.events;
      otherIndex = 0;
      if (otherIndex < subevents.length && subevents[otherIndex][1].type === "lineEndingBlank")
        otherIndex += 2;
      if (otherIndex < subevents.length && subevents[otherIndex][1].type === "content")
        while (++otherIndex < subevents.length) {
          if (subevents[otherIndex][1].type === "content") break;
          if (subevents[otherIndex][1].type === "chunkText") {
            subevents[otherIndex][1]._isInFirstContentOfListItem = true;
            otherIndex++;
          }
        }
    }
    if (event[0] === "enter") {
      if (event[1].contentType) {
        Object.assign(jumps, subcontent(events, index));
        index = jumps[index];
        more = true;
      }
    } else if (event[1]._container) {
      otherIndex = index;
      lineIndex = void 0;
      while (otherIndex--) {
        otherEvent = events.get(otherIndex);
        if (otherEvent[1].type === "lineEnding" || otherEvent[1].type === "lineEndingBlank") {
          if (otherEvent[0] === "enter") {
            if (lineIndex) events.get(lineIndex)[1].type = "lineEndingBlank";
            otherEvent[1].type = "lineEnding";
            lineIndex = otherIndex;
          }
        } else if (otherEvent[1].type === "linePrefix" || otherEvent[1].type === "listItemIndent") {
        } else break;
      }
      if (lineIndex) {
        event[1].end = { ...events.get(lineIndex)[1].start };
        parameters = events.slice(lineIndex, index);
        parameters.unshift(event);
        events.splice(lineIndex, index - lineIndex + 1, parameters);
      }
    }
  }
  splice(eventsArray, 0, Number.POSITIVE_INFINITY, events.slice(0));
  return !more;
}
/**
 * Tokenize embedded tokens.
 *
 * @param {SpliceBuffer<Event>} events
 *   Events.
 * @param {number} eventIndex
 *   Index.
 * @returns {Record<string, number>}
 *   Gaps.
 */
function subcontent(events, eventIndex) {
  const token = events.get(eventIndex)[1];
  const context = events.get(eventIndex)[2];
  let startPosition = eventIndex - 1;
  /** @type {Array<number>} */
  const startPositions = [];
  let tokenizer = token._tokenizer;
  if (!tokenizer) {
    tokenizer = context.parser[token.contentType](token.start);
    if (token._contentTypeTextTrailing) tokenizer._contentTypeTextTrailing = true;
  }
  const childEvents = tokenizer.events;
  /** @type {Array<[number, number]>} */
  const jumps = [];
  /** @type {Record<string, number>} */
  const gaps = {};
  /** @type {Array<Chunk>} */
  let stream;
  /** @type {Token | undefined} */
  let previous;
  let index = -1;
  /** @type {Token | undefined} */
  let current = token;
  let adjust = 0;
  let start = 0;
  const breaks = [start];
  while (current) {
    while (events.get(++startPosition)[1] !== current);
    startPositions.push(startPosition);
    if (!current._tokenizer) {
      stream = context.sliceStream(current);
      if (!current.next) stream.push(null);
      if (previous) tokenizer.defineSkip(current.start);
      if (current._isInFirstContentOfListItem) tokenizer._gfmTasklistFirstContentOfListItem = true;
      tokenizer.write(stream);
      if (current._isInFirstContentOfListItem)
        tokenizer._gfmTasklistFirstContentOfListItem = void 0;
    }
    previous = current;
    current = current.next;
  }
  current = token;
  while (++index < childEvents.length)
    if (
      childEvents[index][0] === "exit" &&
      childEvents[index - 1][0] === "enter" &&
      childEvents[index][1].type === childEvents[index - 1][1].type &&
      childEvents[index][1].start.line !== childEvents[index][1].end.line
    ) {
      start = index + 1;
      breaks.push(start);
      current._tokenizer = void 0;
      current.previous = void 0;
      current = current.next;
    }
  tokenizer.events = [];
  if (current) {
    current._tokenizer = void 0;
    current.previous = void 0;
  } else breaks.pop();
  index = breaks.length;
  while (index--) {
    const slice = childEvents.slice(breaks[index], breaks[index + 1]);
    const start = startPositions.pop();
    jumps.push([start, start + slice.length - 1]);
    events.splice(start, 2, slice);
  }
  jumps.reverse();
  index = -1;
  while (++index < jumps.length) {
    gaps[adjust + jumps[index][0]] = adjust + jumps[index][1];
    adjust += jumps[index][1] - jumps[index][0] - 1;
  }
  return gaps;
}
//#endregion
//#region node_modules/micromark-core-commonmark/lib/content.js
/**
 * @import {
 *   Construct,
 *   Resolver,
 *   State,
 *   TokenizeContext,
 *   Tokenizer,
 *   Token
 * } from 'micromark-util-types'
 */
/**
 * No name because it must not be turned off.
 * @type {Construct}
 */
const content = {
  resolve: resolveContent,
  tokenize: tokenizeContent,
};
/** @type {Construct} */
const continuationConstruct = {
  partial: true,
  tokenize: tokenizeContinuation,
};
/**
 * Content is transparent: it’s parsed right now. That way, definitions are also
 * parsed right now: before text in paragraphs (specifically, media) are parsed.
 *
 * @type {Resolver}
 */
function resolveContent(events) {
  subtokenize(events);
  return events;
}
/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeContent(effects, ok) {
  /** @type {Token | undefined} */
  let previous;
  return chunkStart;
  /**
   * Before a content chunk.
   *
   * ```markdown
   * > | abc
   *     ^
   * ```
   *
   * @type {State}
   */
  function chunkStart(code) {
    effects.enter("content");
    previous = effects.enter("chunkContent", { contentType: "content" });
    return chunkInside(code);
  }
  /**
   * In a content chunk.
   *
   * ```markdown
   * > | abc
   *     ^^^
   * ```
   *
   * @type {State}
   */
  function chunkInside(code) {
    if (code === null) return contentEnd(code);
    if (markdownLineEnding(code))
      return effects.check(continuationConstruct, contentContinue, contentEnd)(code);
    effects.consume(code);
    return chunkInside;
  }
  /**
   *
   *
   * @type {State}
   */
  function contentEnd(code) {
    effects.exit("chunkContent");
    effects.exit("content");
    return ok(code);
  }
  /**
   *
   *
   * @type {State}
   */
  function contentContinue(code) {
    effects.consume(code);
    effects.exit("chunkContent");
    previous.next = effects.enter("chunkContent", {
      contentType: "content",
      previous,
    });
    previous = previous.next;
    return chunkInside;
  }
}
/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeContinuation(effects, ok, nok) {
  const self = this;
  return startLookahead;
  /**
   *
   *
   * @type {State}
   */
  function startLookahead(code) {
    effects.exit("chunkContent");
    effects.enter("lineEnding");
    effects.consume(code);
    effects.exit("lineEnding");
    return factorySpace(effects, prefixed, "linePrefix");
  }
  /**
   *
   *
   * @type {State}
   */
  function prefixed(code) {
    if (code === null || markdownLineEnding(code)) return nok(code);
    const tail = self.events[self.events.length - 1];
    if (
      !self.parser.constructs.disable.null.includes("codeIndented") &&
      tail &&
      tail[1].type === "linePrefix" &&
      tail[2].sliceSerialize(tail[1], true).length >= 4
    )
      return ok(code);
    return effects.interrupt(self.parser.constructs.flow, nok, ok)(code);
  }
}
//#endregion
//#region node_modules/micromark-factory-destination/index.js
/**
 * @import {Effects, State, TokenType} from 'micromark-util-types'
 */
/**
 * Parse destinations.
 *
 * ###### Examples
 *
 * ```markdown
 * <a>
 * <a\>b>
 * <a b>
 * <a)>
 * a
 * a\)b
 * a(b)c
 * a(b)
 * ```
 *
 * @param {Effects} effects
 *   Context.
 * @param {State} ok
 *   State switched to when successful.
 * @param {State} nok
 *   State switched to when unsuccessful.
 * @param {TokenType} type
 *   Type for whole (`<a>` or `b`).
 * @param {TokenType} literalType
 *   Type when enclosed (`<a>`).
 * @param {TokenType} literalMarkerType
 *   Type for enclosing (`<` and `>`).
 * @param {TokenType} rawType
 *   Type when not enclosed (`b`).
 * @param {TokenType} stringType
 *   Type for the value (`a` or `b`).
 * @param {number | undefined} [max=Infinity]
 *   Depth of nested parens (inclusive).
 * @returns {State}
 *   Start state.
 */
function factoryDestination(
  effects,
  ok,
  nok,
  type,
  literalType,
  literalMarkerType,
  rawType,
  stringType,
  max,
) {
  const limit = max || Number.POSITIVE_INFINITY;
  let balance = 0;
  return start;
  /**
   * Start of destination.
   *
   * ```markdown
   * > | <aa>
   *     ^
   * > | aa
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    if (code === 60) {
      effects.enter(type);
      effects.enter(literalType);
      effects.enter(literalMarkerType);
      effects.consume(code);
      effects.exit(literalMarkerType);
      return enclosedBefore;
    }
    if (code === null || code === 32 || code === 41 || asciiControl(code)) return nok(code);
    effects.enter(type);
    effects.enter(rawType);
    effects.enter(stringType);
    effects.enter("chunkString", { contentType: "string" });
    return raw(code);
  }
  /**
   * After `<`, at an enclosed destination.
   *
   * ```markdown
   * > | <aa>
   *      ^
   * ```
   *
   * @type {State}
   */
  function enclosedBefore(code) {
    if (code === 62) {
      effects.enter(literalMarkerType);
      effects.consume(code);
      effects.exit(literalMarkerType);
      effects.exit(literalType);
      effects.exit(type);
      return ok;
    }
    effects.enter(stringType);
    effects.enter("chunkString", { contentType: "string" });
    return enclosed(code);
  }
  /**
   * In enclosed destination.
   *
   * ```markdown
   * > | <aa>
   *      ^
   * ```
   *
   * @type {State}
   */
  function enclosed(code) {
    if (code === 62) {
      effects.exit("chunkString");
      effects.exit(stringType);
      return enclosedBefore(code);
    }
    if (code === null || code === 60 || markdownLineEnding(code)) return nok(code);
    effects.consume(code);
    return code === 92 ? enclosedEscape : enclosed;
  }
  /**
   * After `\`, at a special character.
   *
   * ```markdown
   * > | <a\*a>
   *        ^
   * ```
   *
   * @type {State}
   */
  function enclosedEscape(code) {
    if (code === 60 || code === 62 || code === 92) {
      effects.consume(code);
      return enclosed;
    }
    return enclosed(code);
  }
  /**
   * In raw destination.
   *
   * ```markdown
   * > | aa
   *     ^
   * ```
   *
   * @type {State}
   */
  function raw(code) {
    if (!balance && (code === null || code === 41 || markdownLineEndingOrSpace(code))) {
      effects.exit("chunkString");
      effects.exit(stringType);
      effects.exit(rawType);
      effects.exit(type);
      return ok(code);
    }
    if (balance < limit && code === 40) {
      effects.consume(code);
      balance++;
      return raw;
    }
    if (code === 41) {
      effects.consume(code);
      balance--;
      return raw;
    }
    if (code === null || code === 32 || code === 40 || asciiControl(code)) return nok(code);
    effects.consume(code);
    return code === 92 ? rawEscape : raw;
  }
  /**
   * After `\`, at special character.
   *
   * ```markdown
   * > | a\*a
   *       ^
   * ```
   *
   * @type {State}
   */
  function rawEscape(code) {
    if (code === 40 || code === 41 || code === 92) {
      effects.consume(code);
      return raw;
    }
    return raw(code);
  }
}
//#endregion
//#region node_modules/micromark-factory-label/index.js
/**
 * @import {
 *   Effects,
 *   State,
 *   TokenizeContext,
 *   TokenType
 * } from 'micromark-util-types'
 */
/**
 * Parse labels.
 *
 * > 👉 **Note**: labels in markdown are capped at 999 characters in the string.
 *
 * ###### Examples
 *
 * ```markdown
 * [a]
 * [a
 * b]
 * [a\]b]
 * ```
 *
 * @this {TokenizeContext}
 *   Tokenize context.
 * @param {Effects} effects
 *   Context.
 * @param {State} ok
 *   State switched to when successful.
 * @param {State} nok
 *   State switched to when unsuccessful.
 * @param {TokenType} type
 *   Type of the whole label (`[a]`).
 * @param {TokenType} markerType
 *   Type for the markers (`[` and `]`).
 * @param {TokenType} stringType
 *   Type for the identifier (`a`).
 * @returns {State}
 *   Start state.
 */
function factoryLabel(effects, ok, nok, type, markerType, stringType) {
  const self = this;
  let size = 0;
  /** @type {boolean} */
  let seen;
  return start;
  /**
   * Start of label.
   *
   * ```markdown
   * > | [a]
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    effects.enter(type);
    effects.enter(markerType);
    effects.consume(code);
    effects.exit(markerType);
    effects.enter(stringType);
    return atBreak;
  }
  /**
   * In label, at something, before something else.
   *
   * ```markdown
   * > | [a]
   *      ^
   * ```
   *
   * @type {State}
   */
  function atBreak(code) {
    if (
      size > 999 ||
      code === null ||
      code === 91 ||
      (code === 93 && !seen) ||
      (code === 94 && !size && "_hiddenFootnoteSupport" in self.parser.constructs)
    )
      return nok(code);
    if (code === 93) {
      effects.exit(stringType);
      effects.enter(markerType);
      effects.consume(code);
      effects.exit(markerType);
      effects.exit(type);
      return ok;
    }
    if (markdownLineEnding(code)) {
      effects.enter("lineEnding");
      effects.consume(code);
      effects.exit("lineEnding");
      return atBreak;
    }
    effects.enter("chunkString", { contentType: "string" });
    return labelInside(code);
  }
  /**
   * In label, in text.
   *
   * ```markdown
   * > | [a]
   *      ^
   * ```
   *
   * @type {State}
   */
  function labelInside(code) {
    if (code === null || code === 91 || code === 93 || markdownLineEnding(code) || size++ > 999) {
      effects.exit("chunkString");
      return atBreak(code);
    }
    effects.consume(code);
    if (!seen) seen = !markdownSpace(code);
    return code === 92 ? labelEscape : labelInside;
  }
  /**
   * After `\`, at a special character.
   *
   * ```markdown
   * > | [a\*a]
   *        ^
   * ```
   *
   * @type {State}
   */
  function labelEscape(code) {
    if (code === 91 || code === 92 || code === 93) {
      effects.consume(code);
      size++;
      return labelInside;
    }
    return labelInside(code);
  }
}
//#endregion
//#region node_modules/micromark-factory-title/index.js
/**
 * @import {
 *   Code,
 *   Effects,
 *   State,
 *   TokenType
 * } from 'micromark-util-types'
 */
/**
 * Parse titles.
 *
 * ###### Examples
 *
 * ```markdown
 * "a"
 * 'b'
 * (c)
 * "a
 * b"
 * 'a
 *     b'
 * (a\)b)
 * ```
 *
 * @param {Effects} effects
 *   Context.
 * @param {State} ok
 *   State switched to when successful.
 * @param {State} nok
 *   State switched to when unsuccessful.
 * @param {TokenType} type
 *   Type of the whole title (`"a"`, `'b'`, `(c)`).
 * @param {TokenType} markerType
 *   Type for the markers (`"`, `'`, `(`, and `)`).
 * @param {TokenType} stringType
 *   Type for the value (`a`).
 * @returns {State}
 *   Start state.
 */
function factoryTitle(effects, ok, nok, type, markerType, stringType) {
  /** @type {NonNullable<Code>} */
  let marker;
  return start;
  /**
   * Start of title.
   *
   * ```markdown
   * > | "a"
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    if (code === 34 || code === 39 || code === 40) {
      effects.enter(type);
      effects.enter(markerType);
      effects.consume(code);
      effects.exit(markerType);
      marker = code === 40 ? 41 : code;
      return begin;
    }
    return nok(code);
  }
  /**
   * After opening marker.
   *
   * This is also used at the closing marker.
   *
   * ```markdown
   * > | "a"
   *      ^
   * ```
   *
   * @type {State}
   */
  function begin(code) {
    if (code === marker) {
      effects.enter(markerType);
      effects.consume(code);
      effects.exit(markerType);
      effects.exit(type);
      return ok;
    }
    effects.enter(stringType);
    return atBreak(code);
  }
  /**
   * At something, before something else.
   *
   * ```markdown
   * > | "a"
   *      ^
   * ```
   *
   * @type {State}
   */
  function atBreak(code) {
    if (code === marker) {
      effects.exit(stringType);
      return begin(marker);
    }
    if (code === null) return nok(code);
    if (markdownLineEnding(code)) {
      effects.enter("lineEnding");
      effects.consume(code);
      effects.exit("lineEnding");
      return factorySpace(effects, atBreak, "linePrefix");
    }
    effects.enter("chunkString", { contentType: "string" });
    return inside(code);
  }
  /**
   *
   *
   * @type {State}
   */
  function inside(code) {
    if (code === marker || code === null || markdownLineEnding(code)) {
      effects.exit("chunkString");
      return atBreak(code);
    }
    effects.consume(code);
    return code === 92 ? escape : inside;
  }
  /**
   * After `\`, at a special character.
   *
   * ```markdown
   * > | "a\*b"
   *      ^
   * ```
   *
   * @type {State}
   */
  function escape(code) {
    if (code === marker || code === 92) {
      effects.consume(code);
      return inside;
    }
    return inside(code);
  }
}
//#endregion
//#region node_modules/micromark-factory-whitespace/index.js
/**
 * @import {Effects, State} from 'micromark-util-types'
 */
/**
 * Parse spaces and tabs.
 *
 * There is no `nok` parameter:
 *
 * *   line endings or spaces in markdown are often optional, in which case this
 *     factory can be used and `ok` will be switched to whether spaces were found
 *     or not
 * *   one line ending or space can be detected with
 *     `markdownLineEndingOrSpace(code)` right before using `factoryWhitespace`
 *
 * @param {Effects} effects
 *   Context.
 * @param {State} ok
 *   State switched to when successful.
 * @returns {State}
 *   Start state.
 */
function factoryWhitespace(effects, ok) {
  /** @type {boolean} */
  let seen;
  return start;
  /** @type {State} */
  function start(code) {
    if (markdownLineEnding(code)) {
      effects.enter("lineEnding");
      effects.consume(code);
      effects.exit("lineEnding");
      seen = true;
      return start;
    }
    if (markdownSpace(code))
      return factorySpace(effects, start, seen ? "linePrefix" : "lineSuffix")(code);
    return ok(code);
  }
}
//#endregion
//#region node_modules/micromark-core-commonmark/lib/definition.js
/**
 * @import {
 *   Construct,
 *   State,
 *   TokenizeContext,
 *   Tokenizer
 * } from 'micromark-util-types'
 */
/** @type {Construct} */
const definition = {
  name: "definition",
  tokenize: tokenizeDefinition,
};
/** @type {Construct} */
const titleBefore = {
  partial: true,
  tokenize: tokenizeTitleBefore,
};
/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeDefinition(effects, ok, nok) {
  const self = this;
  /** @type {string} */
  let identifier;
  return start;
  /**
   * At start of a definition.
   *
   * ```markdown
   * > | [a]: b "c"
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    effects.enter("definition");
    return before(code);
  }
  /**
   * After optional whitespace, at `[`.
   *
   * ```markdown
   * > | [a]: b "c"
   *     ^
   * ```
   *
   * @type {State}
   */
  function before(code) {
    return factoryLabel.call(
      self,
      effects,
      labelAfter,
      nok,
      "definitionLabel",
      "definitionLabelMarker",
      "definitionLabelString",
    )(code);
  }
  /**
   * After label.
   *
   * ```markdown
   * > | [a]: b "c"
   *        ^
   * ```
   *
   * @type {State}
   */
  function labelAfter(code) {
    identifier = normalizeIdentifier(
      self.sliceSerialize(self.events[self.events.length - 1][1]).slice(1, -1),
    );
    if (code === 58) {
      effects.enter("definitionMarker");
      effects.consume(code);
      effects.exit("definitionMarker");
      return markerAfter;
    }
    return nok(code);
  }
  /**
   * After marker.
   *
   * ```markdown
   * > | [a]: b "c"
   *         ^
   * ```
   *
   * @type {State}
   */
  function markerAfter(code) {
    return markdownLineEndingOrSpace(code)
      ? factoryWhitespace(effects, destinationBefore)(code)
      : destinationBefore(code);
  }
  /**
   * Before destination.
   *
   * ```markdown
   * > | [a]: b "c"
   *          ^
   * ```
   *
   * @type {State}
   */
  function destinationBefore(code) {
    return factoryDestination(
      effects,
      destinationAfter,
      nok,
      "definitionDestination",
      "definitionDestinationLiteral",
      "definitionDestinationLiteralMarker",
      "definitionDestinationRaw",
      "definitionDestinationString",
    )(code);
  }
  /**
   * After destination.
   *
   * ```markdown
   * > | [a]: b "c"
   *           ^
   * ```
   *
   * @type {State}
   */
  function destinationAfter(code) {
    return effects.attempt(titleBefore, after, after)(code);
  }
  /**
   * After definition.
   *
   * ```markdown
   * > | [a]: b
   *           ^
   * > | [a]: b "c"
   *               ^
   * ```
   *
   * @type {State}
   */
  function after(code) {
    return markdownSpace(code)
      ? factorySpace(effects, afterWhitespace, "whitespace")(code)
      : afterWhitespace(code);
  }
  /**
   * After definition, after optional whitespace.
   *
   * ```markdown
   * > | [a]: b
   *           ^
   * > | [a]: b "c"
   *               ^
   * ```
   *
   * @type {State}
   */
  function afterWhitespace(code) {
    if (code === null || markdownLineEnding(code)) {
      effects.exit("definition");
      self.parser.defined.push(identifier);
      return ok(code);
    }
    return nok(code);
  }
}
/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeTitleBefore(effects, ok, nok) {
  return titleBefore;
  /**
   * After destination, at whitespace.
   *
   * ```markdown
   * > | [a]: b
   *           ^
   * > | [a]: b "c"
   *           ^
   * ```
   *
   * @type {State}
   */
  function titleBefore(code) {
    return markdownLineEndingOrSpace(code)
      ? factoryWhitespace(effects, beforeMarker)(code)
      : nok(code);
  }
  /**
   * At title.
   *
   * ```markdown
   *   | [a]: b
   * > | "c"
   *     ^
   * ```
   *
   * @type {State}
   */
  function beforeMarker(code) {
    return factoryTitle(
      effects,
      titleAfter,
      nok,
      "definitionTitle",
      "definitionTitleMarker",
      "definitionTitleString",
    )(code);
  }
  /**
   * After title.
   *
   * ```markdown
   * > | [a]: b "c"
   *               ^
   * ```
   *
   * @type {State}
   */
  function titleAfter(code) {
    return markdownSpace(code)
      ? factorySpace(effects, titleAfterOptionalWhitespace, "whitespace")(code)
      : titleAfterOptionalWhitespace(code);
  }
  /**
   * After title, after optional whitespace.
   *
   * ```markdown
   * > | [a]: b "c"
   *               ^
   * ```
   *
   * @type {State}
   */
  function titleAfterOptionalWhitespace(code) {
    return code === null || markdownLineEnding(code) ? ok(code) : nok(code);
  }
}
//#endregion
//#region node_modules/micromark-core-commonmark/lib/hard-break-escape.js
/**
 * @import {
 *   Construct,
 *   State,
 *   TokenizeContext,
 *   Tokenizer
 * } from 'micromark-util-types'
 */
/** @type {Construct} */
const hardBreakEscape = {
  name: "hardBreakEscape",
  tokenize: tokenizeHardBreakEscape,
};
/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeHardBreakEscape(effects, ok, nok) {
  return start;
  /**
   * Start of a hard break (escape).
   *
   * ```markdown
   * > | a\
   *      ^
   *   | b
   * ```
   *
   * @type {State}
   */
  function start(code) {
    effects.enter("hardBreakEscape");
    effects.consume(code);
    return after;
  }
  /**
   * After `\`, at eol.
   *
   * ```markdown
   * > | a\
   *       ^
   *   | b
   * ```
   *
   *  @type {State}
   */
  function after(code) {
    if (markdownLineEnding(code)) {
      effects.exit("hardBreakEscape");
      return ok(code);
    }
    return nok(code);
  }
}
//#endregion
//#region node_modules/micromark-core-commonmark/lib/heading-atx.js
/**
 * @import {
 *   Construct,
 *   Resolver,
 *   State,
 *   TokenizeContext,
 *   Tokenizer,
 *   Token
 * } from 'micromark-util-types'
 */
/** @type {Construct} */
const headingAtx = {
  name: "headingAtx",
  resolve: resolveHeadingAtx,
  tokenize: tokenizeHeadingAtx,
};
/** @type {Resolver} */
function resolveHeadingAtx(events, context) {
  let contentEnd = events.length - 2;
  let contentStart = 3;
  /** @type {Token} */
  let content;
  /** @type {Token} */
  let text;
  if (events[contentStart][1].type === "whitespace") contentStart += 2;
  if (contentEnd - 2 > contentStart && events[contentEnd][1].type === "whitespace") contentEnd -= 2;
  if (
    events[contentEnd][1].type === "atxHeadingSequence" &&
    (contentStart === contentEnd - 1 ||
      (contentEnd - 4 > contentStart && events[contentEnd - 2][1].type === "whitespace"))
  )
    contentEnd -= contentStart + 1 === contentEnd ? 2 : 4;
  if (contentEnd > contentStart) {
    content = {
      type: "atxHeadingText",
      start: events[contentStart][1].start,
      end: events[contentEnd][1].end,
    };
    text = {
      type: "chunkText",
      start: events[contentStart][1].start,
      end: events[contentEnd][1].end,
      contentType: "text",
    };
    splice(events, contentStart, contentEnd - contentStart + 1, [
      ["enter", content, context],
      ["enter", text, context],
      ["exit", text, context],
      ["exit", content, context],
    ]);
  }
  return events;
}
/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeHeadingAtx(effects, ok, nok) {
  let size = 0;
  return start;
  /**
   * Start of a heading (atx).
   *
   * ```markdown
   * > | ## aa
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    effects.enter("atxHeading");
    return before(code);
  }
  /**
   * After optional whitespace, at `#`.
   *
   * ```markdown
   * > | ## aa
   *     ^
   * ```
   *
   * @type {State}
   */
  function before(code) {
    effects.enter("atxHeadingSequence");
    return sequenceOpen(code);
  }
  /**
   * In opening sequence.
   *
   * ```markdown
   * > | ## aa
   *     ^
   * ```
   *
   * @type {State}
   */
  function sequenceOpen(code) {
    if (code === 35 && size++ < 6) {
      effects.consume(code);
      return sequenceOpen;
    }
    if (code === null || markdownLineEndingOrSpace(code)) {
      effects.exit("atxHeadingSequence");
      return atBreak(code);
    }
    return nok(code);
  }
  /**
   * After something, before something else.
   *
   * ```markdown
   * > | ## aa
   *       ^
   * ```
   *
   * @type {State}
   */
  function atBreak(code) {
    if (code === 35) {
      effects.enter("atxHeadingSequence");
      return sequenceFurther(code);
    }
    if (code === null || markdownLineEnding(code)) {
      effects.exit("atxHeading");
      return ok(code);
    }
    if (markdownSpace(code)) return factorySpace(effects, atBreak, "whitespace")(code);
    effects.enter("atxHeadingText");
    return data(code);
  }
  /**
   * In further sequence (after whitespace).
   *
   * Could be normal “visible” hashes in the heading or a final sequence.
   *
   * ```markdown
   * > | ## aa ##
   *           ^
   * ```
   *
   * @type {State}
   */
  function sequenceFurther(code) {
    if (code === 35) {
      effects.consume(code);
      return sequenceFurther;
    }
    effects.exit("atxHeadingSequence");
    return atBreak(code);
  }
  /**
   * In text.
   *
   * ```markdown
   * > | ## aa
   *        ^
   * ```
   *
   * @type {State}
   */
  function data(code) {
    if (code === null || code === 35 || markdownLineEndingOrSpace(code)) {
      effects.exit("atxHeadingText");
      return atBreak(code);
    }
    effects.consume(code);
    return data;
  }
}
//#endregion
//#region node_modules/micromark-util-html-tag-name/index.js
/**
 * List of lowercase HTML “block” tag names.
 *
 * The list, when parsing HTML (flow), results in more relaxed rules (condition
 * 6).
 * Because they are known blocks, the HTML-like syntax doesn’t have to be
 * strictly parsed.
 * For tag names not in this list, a more strict algorithm (condition 7) is used
 * to detect whether the HTML-like syntax is seen as HTML (flow) or not.
 *
 * This is copied from:
 * <https://spec.commonmark.org/0.30/#html-blocks>.
 *
 * > 👉 **Note**: `search` was added in `CommonMark@0.31`.
 */
const htmlBlockNames = [
  "address",
  "article",
  "aside",
  "base",
  "basefont",
  "blockquote",
  "body",
  "caption",
  "center",
  "col",
  "colgroup",
  "dd",
  "details",
  "dialog",
  "dir",
  "div",
  "dl",
  "dt",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "frame",
  "frameset",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hr",
  "html",
  "iframe",
  "legend",
  "li",
  "link",
  "main",
  "menu",
  "menuitem",
  "nav",
  "noframes",
  "ol",
  "optgroup",
  "option",
  "p",
  "param",
  "search",
  "section",
  "summary",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "title",
  "tr",
  "track",
  "ul",
];
/**
 * List of lowercase HTML “raw” tag names.
 *
 * The list, when parsing HTML (flow), results in HTML that can include lines
 * without exiting, until a closing tag also in this list is found (condition
 * 1).
 *
 * This module is copied from:
 * <https://spec.commonmark.org/0.30/#html-blocks>.
 *
 * > 👉 **Note**: `textarea` was added in `CommonMark@0.30`.
 */
const htmlRawNames = ["pre", "script", "style", "textarea"];
//#endregion
//#region node_modules/micromark-core-commonmark/lib/html-flow.js
/**
 * @import {
 *   Code,
 *   Construct,
 *   Resolver,
 *   State,
 *   TokenizeContext,
 *   Tokenizer
 * } from 'micromark-util-types'
 */
/** @type {Construct} */
const htmlFlow = {
  concrete: true,
  name: "htmlFlow",
  resolveTo: resolveToHtmlFlow,
  tokenize: tokenizeHtmlFlow,
};
/** @type {Construct} */
const blankLineBefore = {
  partial: true,
  tokenize: tokenizeBlankLineBefore,
};
const nonLazyContinuationStart = {
  partial: true,
  tokenize: tokenizeNonLazyContinuationStart,
};
/** @type {Resolver} */
function resolveToHtmlFlow(events) {
  let index = events.length;
  while (index--) if (events[index][0] === "enter" && events[index][1].type === "htmlFlow") break;
  if (index > 1 && events[index - 2][1].type === "linePrefix") {
    events[index][1].start = events[index - 2][1].start;
    events[index + 1][1].start = events[index - 2][1].start;
    events.splice(index - 2, 2);
  }
  return events;
}
/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeHtmlFlow(effects, ok, nok) {
  const self = this;
  /** @type {number} */
  let marker;
  /** @type {boolean} */
  let closingTag;
  /** @type {string} */
  let buffer;
  /** @type {number} */
  let index;
  /** @type {Code} */
  let markerB;
  return start;
  /**
   * Start of HTML (flow).
   *
   * ```markdown
   * > | <x />
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    return before(code);
  }
  /**
   * At `<`, after optional whitespace.
   *
   * ```markdown
   * > | <x />
   *     ^
   * ```
   *
   * @type {State}
   */
  function before(code) {
    effects.enter("htmlFlow");
    effects.enter("htmlFlowData");
    effects.consume(code);
    return open;
  }
  /**
   * After `<`, at tag name or other stuff.
   *
   * ```markdown
   * > | <x />
   *      ^
   * > | <!doctype>
   *      ^
   * > | <!--xxx-->
   *      ^
   * ```
   *
   * @type {State}
   */
  function open(code) {
    if (code === 33) {
      effects.consume(code);
      return declarationOpen;
    }
    if (code === 47) {
      effects.consume(code);
      closingTag = true;
      return tagCloseStart;
    }
    if (code === 63) {
      effects.consume(code);
      marker = 3;
      return self.interrupt ? ok : continuationDeclarationInside;
    }
    if (asciiAlpha(code)) {
      effects.consume(code);
      buffer = String.fromCharCode(code);
      return tagName;
    }
    return nok(code);
  }
  /**
   * After `<!`, at declaration, comment, or CDATA.
   *
   * ```markdown
   * > | <!doctype>
   *       ^
   * > | <!--xxx-->
   *       ^
   * > | <![CDATA[>&<]]>
   *       ^
   * ```
   *
   * @type {State}
   */
  function declarationOpen(code) {
    if (code === 45) {
      effects.consume(code);
      marker = 2;
      return commentOpenInside;
    }
    if (code === 91) {
      effects.consume(code);
      marker = 5;
      index = 0;
      return cdataOpenInside;
    }
    if (asciiAlpha(code)) {
      effects.consume(code);
      marker = 4;
      return self.interrupt ? ok : continuationDeclarationInside;
    }
    return nok(code);
  }
  /**
   * After `<!-`, inside a comment, at another `-`.
   *
   * ```markdown
   * > | <!--xxx-->
   *        ^
   * ```
   *
   * @type {State}
   */
  function commentOpenInside(code) {
    if (code === 45) {
      effects.consume(code);
      return self.interrupt ? ok : continuationDeclarationInside;
    }
    return nok(code);
  }
  /**
   * After `<![`, inside CDATA, expecting `CDATA[`.
   *
   * ```markdown
   * > | <![CDATA[>&<]]>
   *        ^^^^^^
   * ```
   *
   * @type {State}
   */
  function cdataOpenInside(code) {
    if (code === "CDATA[".charCodeAt(index++)) {
      effects.consume(code);
      if (index === 6) return self.interrupt ? ok : continuation;
      return cdataOpenInside;
    }
    return nok(code);
  }
  /**
   * After `</`, in closing tag, at tag name.
   *
   * ```markdown
   * > | </x>
   *       ^
   * ```
   *
   * @type {State}
   */
  function tagCloseStart(code) {
    if (asciiAlpha(code)) {
      effects.consume(code);
      buffer = String.fromCharCode(code);
      return tagName;
    }
    return nok(code);
  }
  /**
   * In tag name.
   *
   * ```markdown
   * > | <ab>
   *      ^^
   * > | </ab>
   *       ^^
   * ```
   *
   * @type {State}
   */
  function tagName(code) {
    if (code === null || code === 47 || code === 62 || markdownLineEndingOrSpace(code)) {
      const slash = code === 47;
      const name = buffer.toLowerCase();
      if (!slash && !closingTag && htmlRawNames.includes(name)) {
        marker = 1;
        return self.interrupt ? ok(code) : continuation(code);
      }
      if (htmlBlockNames.includes(buffer.toLowerCase())) {
        marker = 6;
        if (slash) {
          effects.consume(code);
          return basicSelfClosing;
        }
        return self.interrupt ? ok(code) : continuation(code);
      }
      marker = 7;
      return self.interrupt && !self.parser.lazy[self.now().line]
        ? nok(code)
        : closingTag
          ? completeClosingTagAfter(code)
          : completeAttributeNameBefore(code);
    }
    if (code === 45 || asciiAlphanumeric(code)) {
      effects.consume(code);
      buffer += String.fromCharCode(code);
      return tagName;
    }
    return nok(code);
  }
  /**
   * After closing slash of a basic tag name.
   *
   * ```markdown
   * > | <div/>
   *          ^
   * ```
   *
   * @type {State}
   */
  function basicSelfClosing(code) {
    if (code === 62) {
      effects.consume(code);
      return self.interrupt ? ok : continuation;
    }
    return nok(code);
  }
  /**
   * After closing slash of a complete tag name.
   *
   * ```markdown
   * > | <x/>
   *        ^
   * ```
   *
   * @type {State}
   */
  function completeClosingTagAfter(code) {
    if (markdownSpace(code)) {
      effects.consume(code);
      return completeClosingTagAfter;
    }
    return completeEnd(code);
  }
  /**
   * At an attribute name.
   *
   * At first, this state is used after a complete tag name, after whitespace,
   * where it expects optional attributes or the end of the tag.
   * It is also reused after attributes, when expecting more optional
   * attributes.
   *
   * ```markdown
   * > | <a />
   *        ^
   * > | <a :b>
   *        ^
   * > | <a _b>
   *        ^
   * > | <a b>
   *        ^
   * > | <a >
   *        ^
   * ```
   *
   * @type {State}
   */
  function completeAttributeNameBefore(code) {
    if (code === 47) {
      effects.consume(code);
      return completeEnd;
    }
    if (code === 58 || code === 95 || asciiAlpha(code)) {
      effects.consume(code);
      return completeAttributeName;
    }
    if (markdownSpace(code)) {
      effects.consume(code);
      return completeAttributeNameBefore;
    }
    return completeEnd(code);
  }
  /**
   * In attribute name.
   *
   * ```markdown
   * > | <a :b>
   *         ^
   * > | <a _b>
   *         ^
   * > | <a b>
   *         ^
   * ```
   *
   * @type {State}
   */
  function completeAttributeName(code) {
    if (code === 45 || code === 46 || code === 58 || code === 95 || asciiAlphanumeric(code)) {
      effects.consume(code);
      return completeAttributeName;
    }
    return completeAttributeNameAfter(code);
  }
  /**
   * After attribute name, at an optional initializer, the end of the tag, or
   * whitespace.
   *
   * ```markdown
   * > | <a b>
   *         ^
   * > | <a b=c>
   *         ^
   * ```
   *
   * @type {State}
   */
  function completeAttributeNameAfter(code) {
    if (code === 61) {
      effects.consume(code);
      return completeAttributeValueBefore;
    }
    if (markdownSpace(code)) {
      effects.consume(code);
      return completeAttributeNameAfter;
    }
    return completeAttributeNameBefore(code);
  }
  /**
   * Before unquoted, double quoted, or single quoted attribute value, allowing
   * whitespace.
   *
   * ```markdown
   * > | <a b=c>
   *          ^
   * > | <a b="c">
   *          ^
   * ```
   *
   * @type {State}
   */
  function completeAttributeValueBefore(code) {
    if (code === null || code === 60 || code === 61 || code === 62 || code === 96) return nok(code);
    if (code === 34 || code === 39) {
      effects.consume(code);
      markerB = code;
      return completeAttributeValueQuoted;
    }
    if (markdownSpace(code)) {
      effects.consume(code);
      return completeAttributeValueBefore;
    }
    return completeAttributeValueUnquoted(code);
  }
  /**
   * In double or single quoted attribute value.
   *
   * ```markdown
   * > | <a b="c">
   *           ^
   * > | <a b='c'>
   *           ^
   * ```
   *
   * @type {State}
   */
  function completeAttributeValueQuoted(code) {
    if (code === markerB) {
      effects.consume(code);
      markerB = null;
      return completeAttributeValueQuotedAfter;
    }
    if (code === null || markdownLineEnding(code)) return nok(code);
    effects.consume(code);
    return completeAttributeValueQuoted;
  }
  /**
   * In unquoted attribute value.
   *
   * ```markdown
   * > | <a b=c>
   *          ^
   * ```
   *
   * @type {State}
   */
  function completeAttributeValueUnquoted(code) {
    if (
      code === null ||
      code === 34 ||
      code === 39 ||
      code === 47 ||
      code === 60 ||
      code === 61 ||
      code === 62 ||
      code === 96 ||
      markdownLineEndingOrSpace(code)
    )
      return completeAttributeNameAfter(code);
    effects.consume(code);
    return completeAttributeValueUnquoted;
  }
  /**
   * After double or single quoted attribute value, before whitespace or the
   * end of the tag.
   *
   * ```markdown
   * > | <a b="c">
   *            ^
   * ```
   *
   * @type {State}
   */
  function completeAttributeValueQuotedAfter(code) {
    if (code === 47 || code === 62 || markdownSpace(code)) return completeAttributeNameBefore(code);
    return nok(code);
  }
  /**
   * In certain circumstances of a complete tag where only an `>` is allowed.
   *
   * ```markdown
   * > | <a b="c">
   *             ^
   * ```
   *
   * @type {State}
   */
  function completeEnd(code) {
    if (code === 62) {
      effects.consume(code);
      return completeAfter;
    }
    return nok(code);
  }
  /**
   * After `>` in a complete tag.
   *
   * ```markdown
   * > | <x>
   *        ^
   * ```
   *
   * @type {State}
   */
  function completeAfter(code) {
    if (code === null || markdownLineEnding(code)) return continuation(code);
    if (markdownSpace(code)) {
      effects.consume(code);
      return completeAfter;
    }
    return nok(code);
  }
  /**
   * In continuation of any HTML kind.
   *
   * ```markdown
   * > | <!--xxx-->
   *          ^
   * ```
   *
   * @type {State}
   */
  function continuation(code) {
    if (code === 45 && marker === 2) {
      effects.consume(code);
      return continuationCommentInside;
    }
    if (code === 60 && marker === 1) {
      effects.consume(code);
      return continuationRawTagOpen;
    }
    if (code === 62 && marker === 4) {
      effects.consume(code);
      return continuationClose;
    }
    if (code === 63 && marker === 3) {
      effects.consume(code);
      return continuationDeclarationInside;
    }
    if (code === 93 && marker === 5) {
      effects.consume(code);
      return continuationCdataInside;
    }
    if (markdownLineEnding(code) && (marker === 6 || marker === 7)) {
      effects.exit("htmlFlowData");
      return effects.check(blankLineBefore, continuationAfter, continuationStart)(code);
    }
    if (code === null || markdownLineEnding(code)) {
      effects.exit("htmlFlowData");
      return continuationStart(code);
    }
    effects.consume(code);
    return continuation;
  }
  /**
   * In continuation, at eol.
   *
   * ```markdown
   * > | <x>
   *        ^
   *   | asd
   * ```
   *
   * @type {State}
   */
  function continuationStart(code) {
    return effects.check(
      nonLazyContinuationStart,
      continuationStartNonLazy,
      continuationAfter,
    )(code);
  }
  /**
   * In continuation, at eol, before non-lazy content.
   *
   * ```markdown
   * > | <x>
   *        ^
   *   | asd
   * ```
   *
   * @type {State}
   */
  function continuationStartNonLazy(code) {
    effects.enter("lineEnding");
    effects.consume(code);
    effects.exit("lineEnding");
    return continuationBefore;
  }
  /**
   * In continuation, before non-lazy content.
   *
   * ```markdown
   *   | <x>
   * > | asd
   *     ^
   * ```
   *
   * @type {State}
   */
  function continuationBefore(code) {
    if (code === null || markdownLineEnding(code)) return continuationStart(code);
    effects.enter("htmlFlowData");
    return continuation(code);
  }
  /**
   * In comment continuation, after one `-`, expecting another.
   *
   * ```markdown
   * > | <!--xxx-->
   *             ^
   * ```
   *
   * @type {State}
   */
  function continuationCommentInside(code) {
    if (code === 45) {
      effects.consume(code);
      return continuationDeclarationInside;
    }
    return continuation(code);
  }
  /**
   * In raw continuation, after `<`, at `/`.
   *
   * ```markdown
   * > | <script>console.log(1)<\/script>
   *                            ^
   * ```
   *
   * @type {State}
   */
  function continuationRawTagOpen(code) {
    if (code === 47) {
      effects.consume(code);
      buffer = "";
      return continuationRawEndTag;
    }
    return continuation(code);
  }
  /**
   * In raw continuation, after `</`, in a raw tag name.
   *
   * ```markdown
   * > | <script>console.log(1)<\/script>
   *                             ^^^^^^
   * ```
   *
   * @type {State}
   */
  function continuationRawEndTag(code) {
    if (code === 62) {
      const name = buffer.toLowerCase();
      if (htmlRawNames.includes(name)) {
        effects.consume(code);
        return continuationClose;
      }
      return continuation(code);
    }
    if (asciiAlpha(code) && buffer.length < 8) {
      effects.consume(code);
      buffer += String.fromCharCode(code);
      return continuationRawEndTag;
    }
    return continuation(code);
  }
  /**
   * In cdata continuation, after `]`, expecting `]>`.
   *
   * ```markdown
   * > | <![CDATA[>&<]]>
   *                  ^
   * ```
   *
   * @type {State}
   */
  function continuationCdataInside(code) {
    if (code === 93) {
      effects.consume(code);
      return continuationDeclarationInside;
    }
    return continuation(code);
  }
  /**
   * In declaration or instruction continuation, at `>`.
   *
   * ```markdown
   * > | <!-->
   *         ^
   * > | <?>
   *       ^
   * > | <!q>
   *        ^
   * > | <!--ab-->
   *             ^
   * > | <![CDATA[>&<]]>
   *                   ^
   * ```
   *
   * @type {State}
   */
  function continuationDeclarationInside(code) {
    if (code === 62) {
      effects.consume(code);
      return continuationClose;
    }
    if (code === 45 && marker === 2) {
      effects.consume(code);
      return continuationDeclarationInside;
    }
    return continuation(code);
  }
  /**
   * In closed continuation: everything we get until the eol/eof is part of it.
   *
   * ```markdown
   * > | <!doctype>
   *               ^
   * ```
   *
   * @type {State}
   */
  function continuationClose(code) {
    if (code === null || markdownLineEnding(code)) {
      effects.exit("htmlFlowData");
      return continuationAfter(code);
    }
    effects.consume(code);
    return continuationClose;
  }
  /**
   * Done.
   *
   * ```markdown
   * > | <!doctype>
   *               ^
   * ```
   *
   * @type {State}
   */
  function continuationAfter(code) {
    effects.exit("htmlFlow");
    return ok(code);
  }
}
/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeNonLazyContinuationStart(effects, ok, nok) {
  const self = this;
  return start;
  /**
   * At eol, before continuation.
   *
   * ```markdown
   * > | * ```js
   *            ^
   *   | b
   * ```
   *
   * @type {State}
   */
  function start(code) {
    if (markdownLineEnding(code)) {
      effects.enter("lineEnding");
      effects.consume(code);
      effects.exit("lineEnding");
      return after;
    }
    return nok(code);
  }
  /**
   * A continuation.
   *
   * ```markdown
   *   | * ```js
   * > | b
   *     ^
   * ```
   *
   * @type {State}
   */
  function after(code) {
    return self.parser.lazy[self.now().line] ? nok(code) : ok(code);
  }
}
/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeBlankLineBefore(effects, ok, nok) {
  return start;
  /**
   * Before eol, expecting blank line.
   *
   * ```markdown
   * > | <div>
   *          ^
   *   |
   * ```
   *
   * @type {State}
   */
  function start(code) {
    effects.enter("lineEnding");
    effects.consume(code);
    effects.exit("lineEnding");
    return effects.attempt(blankLine, ok, nok);
  }
}
//#endregion
//#region node_modules/micromark-core-commonmark/lib/html-text.js
/**
 * @import {
 *   Code,
 *   Construct,
 *   State,
 *   TokenizeContext,
 *   Tokenizer
 * } from 'micromark-util-types'
 */
/** @type {Construct} */
const htmlText = {
  name: "htmlText",
  tokenize: tokenizeHtmlText,
};
/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeHtmlText(effects, ok, nok) {
  const self = this;
  /** @type {NonNullable<Code> | undefined} */
  let marker;
  /** @type {number} */
  let index;
  /** @type {State} */
  let returnState;
  return start;
  /**
   * Start of HTML (text).
   *
   * ```markdown
   * > | a <b> c
   *       ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    effects.enter("htmlText");
    effects.enter("htmlTextData");
    effects.consume(code);
    return open;
  }
  /**
   * After `<`, at tag name or other stuff.
   *
   * ```markdown
   * > | a <b> c
   *        ^
   * > | a <!doctype> c
   *        ^
   * > | a <!--b--> c
   *        ^
   * ```
   *
   * @type {State}
   */
  function open(code) {
    if (code === 33) {
      effects.consume(code);
      return declarationOpen;
    }
    if (code === 47) {
      effects.consume(code);
      return tagCloseStart;
    }
    if (code === 63) {
      effects.consume(code);
      return instruction;
    }
    if (asciiAlpha(code)) {
      effects.consume(code);
      return tagOpen;
    }
    return nok(code);
  }
  /**
   * After `<!`, at declaration, comment, or CDATA.
   *
   * ```markdown
   * > | a <!doctype> c
   *         ^
   * > | a <!--b--> c
   *         ^
   * > | a <![CDATA[>&<]]> c
   *         ^
   * ```
   *
   * @type {State}
   */
  function declarationOpen(code) {
    if (code === 45) {
      effects.consume(code);
      return commentOpenInside;
    }
    if (code === 91) {
      effects.consume(code);
      index = 0;
      return cdataOpenInside;
    }
    if (asciiAlpha(code)) {
      effects.consume(code);
      return declaration;
    }
    return nok(code);
  }
  /**
   * In a comment, after `<!-`, at another `-`.
   *
   * ```markdown
   * > | a <!--b--> c
   *          ^
   * ```
   *
   * @type {State}
   */
  function commentOpenInside(code) {
    if (code === 45) {
      effects.consume(code);
      return commentEnd;
    }
    return nok(code);
  }
  /**
   * In comment.
   *
   * ```markdown
   * > | a <!--b--> c
   *           ^
   * ```
   *
   * @type {State}
   */
  function comment(code) {
    if (code === null) return nok(code);
    if (code === 45) {
      effects.consume(code);
      return commentClose;
    }
    if (markdownLineEnding(code)) {
      returnState = comment;
      return lineEndingBefore(code);
    }
    effects.consume(code);
    return comment;
  }
  /**
   * In comment, after `-`.
   *
   * ```markdown
   * > | a <!--b--> c
   *             ^
   * ```
   *
   * @type {State}
   */
  function commentClose(code) {
    if (code === 45) {
      effects.consume(code);
      return commentEnd;
    }
    return comment(code);
  }
  /**
   * In comment, after `--`.
   *
   * ```markdown
   * > | a <!--b--> c
   *              ^
   * ```
   *
   * @type {State}
   */
  function commentEnd(code) {
    return code === 62 ? end(code) : code === 45 ? commentClose(code) : comment(code);
  }
  /**
   * After `<![`, in CDATA, expecting `CDATA[`.
   *
   * ```markdown
   * > | a <![CDATA[>&<]]> b
   *          ^^^^^^
   * ```
   *
   * @type {State}
   */
  function cdataOpenInside(code) {
    if (code === "CDATA[".charCodeAt(index++)) {
      effects.consume(code);
      return index === 6 ? cdata : cdataOpenInside;
    }
    return nok(code);
  }
  /**
   * In CDATA.
   *
   * ```markdown
   * > | a <![CDATA[>&<]]> b
   *                ^^^
   * ```
   *
   * @type {State}
   */
  function cdata(code) {
    if (code === null) return nok(code);
    if (code === 93) {
      effects.consume(code);
      return cdataClose;
    }
    if (markdownLineEnding(code)) {
      returnState = cdata;
      return lineEndingBefore(code);
    }
    effects.consume(code);
    return cdata;
  }
  /**
   * In CDATA, after `]`, at another `]`.
   *
   * ```markdown
   * > | a <![CDATA[>&<]]> b
   *                    ^
   * ```
   *
   * @type {State}
   */
  function cdataClose(code) {
    if (code === 93) {
      effects.consume(code);
      return cdataEnd;
    }
    return cdata(code);
  }
  /**
   * In CDATA, after `]]`, at `>`.
   *
   * ```markdown
   * > | a <![CDATA[>&<]]> b
   *                     ^
   * ```
   *
   * @type {State}
   */
  function cdataEnd(code) {
    if (code === 62) return end(code);
    if (code === 93) {
      effects.consume(code);
      return cdataEnd;
    }
    return cdata(code);
  }
  /**
   * In declaration.
   *
   * ```markdown
   * > | a <!b> c
   *          ^
   * ```
   *
   * @type {State}
   */
  function declaration(code) {
    if (code === null || code === 62) return end(code);
    if (markdownLineEnding(code)) {
      returnState = declaration;
      return lineEndingBefore(code);
    }
    effects.consume(code);
    return declaration;
  }
  /**
   * In instruction.
   *
   * ```markdown
   * > | a <?b?> c
   *         ^
   * ```
   *
   * @type {State}
   */
  function instruction(code) {
    if (code === null) return nok(code);
    if (code === 63) {
      effects.consume(code);
      return instructionClose;
    }
    if (markdownLineEnding(code)) {
      returnState = instruction;
      return lineEndingBefore(code);
    }
    effects.consume(code);
    return instruction;
  }
  /**
   * In instruction, after `?`, at `>`.
   *
   * ```markdown
   * > | a <?b?> c
   *           ^
   * ```
   *
   * @type {State}
   */
  function instructionClose(code) {
    return code === 62 ? end(code) : instruction(code);
  }
  /**
   * After `</`, in closing tag, at tag name.
   *
   * ```markdown
   * > | a </b> c
   *         ^
   * ```
   *
   * @type {State}
   */
  function tagCloseStart(code) {
    if (asciiAlpha(code)) {
      effects.consume(code);
      return tagClose;
    }
    return nok(code);
  }
  /**
   * After `</x`, in a tag name.
   *
   * ```markdown
   * > | a </b> c
   *          ^
   * ```
   *
   * @type {State}
   */
  function tagClose(code) {
    if (code === 45 || asciiAlphanumeric(code)) {
      effects.consume(code);
      return tagClose;
    }
    return tagCloseBetween(code);
  }
  /**
   * In closing tag, after tag name.
   *
   * ```markdown
   * > | a </b> c
   *          ^
   * ```
   *
   * @type {State}
   */
  function tagCloseBetween(code) {
    if (markdownLineEnding(code)) {
      returnState = tagCloseBetween;
      return lineEndingBefore(code);
    }
    if (markdownSpace(code)) {
      effects.consume(code);
      return tagCloseBetween;
    }
    return end(code);
  }
  /**
   * After `<x`, in opening tag name.
   *
   * ```markdown
   * > | a <b> c
   *         ^
   * ```
   *
   * @type {State}
   */
  function tagOpen(code) {
    if (code === 45 || asciiAlphanumeric(code)) {
      effects.consume(code);
      return tagOpen;
    }
    if (code === 47 || code === 62 || markdownLineEndingOrSpace(code)) return tagOpenBetween(code);
    return nok(code);
  }
  /**
   * In opening tag, after tag name.
   *
   * ```markdown
   * > | a <b> c
   *         ^
   * ```
   *
   * @type {State}
   */
  function tagOpenBetween(code) {
    if (code === 47) {
      effects.consume(code);
      return end;
    }
    if (code === 58 || code === 95 || asciiAlpha(code)) {
      effects.consume(code);
      return tagOpenAttributeName;
    }
    if (markdownLineEnding(code)) {
      returnState = tagOpenBetween;
      return lineEndingBefore(code);
    }
    if (markdownSpace(code)) {
      effects.consume(code);
      return tagOpenBetween;
    }
    return end(code);
  }
  /**
   * In attribute name.
   *
   * ```markdown
   * > | a <b c> d
   *          ^
   * ```
   *
   * @type {State}
   */
  function tagOpenAttributeName(code) {
    if (code === 45 || code === 46 || code === 58 || code === 95 || asciiAlphanumeric(code)) {
      effects.consume(code);
      return tagOpenAttributeName;
    }
    return tagOpenAttributeNameAfter(code);
  }
  /**
   * After attribute name, before initializer, the end of the tag, or
   * whitespace.
   *
   * ```markdown
   * > | a <b c> d
   *           ^
   * ```
   *
   * @type {State}
   */
  function tagOpenAttributeNameAfter(code) {
    if (code === 61) {
      effects.consume(code);
      return tagOpenAttributeValueBefore;
    }
    if (markdownLineEnding(code)) {
      returnState = tagOpenAttributeNameAfter;
      return lineEndingBefore(code);
    }
    if (markdownSpace(code)) {
      effects.consume(code);
      return tagOpenAttributeNameAfter;
    }
    return tagOpenBetween(code);
  }
  /**
   * Before unquoted, double quoted, or single quoted attribute value, allowing
   * whitespace.
   *
   * ```markdown
   * > | a <b c=d> e
   *            ^
   * ```
   *
   * @type {State}
   */
  function tagOpenAttributeValueBefore(code) {
    if (code === null || code === 60 || code === 61 || code === 62 || code === 96) return nok(code);
    if (code === 34 || code === 39) {
      effects.consume(code);
      marker = code;
      return tagOpenAttributeValueQuoted;
    }
    if (markdownLineEnding(code)) {
      returnState = tagOpenAttributeValueBefore;
      return lineEndingBefore(code);
    }
    if (markdownSpace(code)) {
      effects.consume(code);
      return tagOpenAttributeValueBefore;
    }
    effects.consume(code);
    return tagOpenAttributeValueUnquoted;
  }
  /**
   * In double or single quoted attribute value.
   *
   * ```markdown
   * > | a <b c="d"> e
   *             ^
   * ```
   *
   * @type {State}
   */
  function tagOpenAttributeValueQuoted(code) {
    if (code === marker) {
      effects.consume(code);
      marker = void 0;
      return tagOpenAttributeValueQuotedAfter;
    }
    if (code === null) return nok(code);
    if (markdownLineEnding(code)) {
      returnState = tagOpenAttributeValueQuoted;
      return lineEndingBefore(code);
    }
    effects.consume(code);
    return tagOpenAttributeValueQuoted;
  }
  /**
   * In unquoted attribute value.
   *
   * ```markdown
   * > | a <b c=d> e
   *            ^
   * ```
   *
   * @type {State}
   */
  function tagOpenAttributeValueUnquoted(code) {
    if (code === null || code === 34 || code === 39 || code === 60 || code === 61 || code === 96)
      return nok(code);
    if (code === 47 || code === 62 || markdownLineEndingOrSpace(code)) return tagOpenBetween(code);
    effects.consume(code);
    return tagOpenAttributeValueUnquoted;
  }
  /**
   * After double or single quoted attribute value, before whitespace or the end
   * of the tag.
   *
   * ```markdown
   * > | a <b c="d"> e
   *               ^
   * ```
   *
   * @type {State}
   */
  function tagOpenAttributeValueQuotedAfter(code) {
    if (code === 47 || code === 62 || markdownLineEndingOrSpace(code)) return tagOpenBetween(code);
    return nok(code);
  }
  /**
   * In certain circumstances of a tag where only an `>` is allowed.
   *
   * ```markdown
   * > | a <b c="d"> e
   *               ^
   * ```
   *
   * @type {State}
   */
  function end(code) {
    if (code === 62) {
      effects.consume(code);
      effects.exit("htmlTextData");
      effects.exit("htmlText");
      return ok;
    }
    return nok(code);
  }
  /**
   * At eol.
   *
   * > 👉 **Note**: we can’t have blank lines in text, so no need to worry about
   * > empty tokens.
   *
   * ```markdown
   * > | a <!--a
   *            ^
   *   | b-->
   * ```
   *
   * @type {State}
   */
  function lineEndingBefore(code) {
    effects.exit("htmlTextData");
    effects.enter("lineEnding");
    effects.consume(code);
    effects.exit("lineEnding");
    return lineEndingAfter;
  }
  /**
   * After eol, at optional whitespace.
   *
   * > 👉 **Note**: we can’t have blank lines in text, so no need to worry about
   * > empty tokens.
   *
   * ```markdown
   *   | a <!--a
   * > | b-->
   *     ^
   * ```
   *
   * @type {State}
   */
  function lineEndingAfter(code) {
    return markdownSpace(code)
      ? factorySpace(
          effects,
          lineEndingAfterPrefix,
          "linePrefix",
          self.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4,
        )(code)
      : lineEndingAfterPrefix(code);
  }
  /**
   * After eol, after optional whitespace.
   *
   * > 👉 **Note**: we can’t have blank lines in text, so no need to worry about
   * > empty tokens.
   *
   * ```markdown
   *   | a <!--a
   * > | b-->
   *     ^
   * ```
   *
   * @type {State}
   */
  function lineEndingAfterPrefix(code) {
    effects.enter("htmlTextData");
    return returnState(code);
  }
}
//#endregion
//#region node_modules/micromark-core-commonmark/lib/label-end.js
/**
 * @import {
 *   Construct,
 *   Event,
 *   Resolver,
 *   State,
 *   TokenizeContext,
 *   Tokenizer,
 *   Token
 * } from 'micromark-util-types'
 */
/** @type {Construct} */
const labelEnd = {
  name: "labelEnd",
  resolveAll: resolveAllLabelEnd,
  resolveTo: resolveToLabelEnd,
  tokenize: tokenizeLabelEnd,
};
/** @type {Construct} */
const resourceConstruct = { tokenize: tokenizeResource };
/** @type {Construct} */
const referenceFullConstruct = { tokenize: tokenizeReferenceFull };
/** @type {Construct} */
const referenceCollapsedConstruct = { tokenize: tokenizeReferenceCollapsed };
/** @type {Resolver} */
function resolveAllLabelEnd(events) {
  let index = -1;
  /** @type {Array<Event>} */
  const newEvents = [];
  while (++index < events.length) {
    const token = events[index][1];
    newEvents.push(events[index]);
    if (token.type === "labelImage" || token.type === "labelLink" || token.type === "labelEnd") {
      const offset = token.type === "labelImage" ? 4 : 2;
      token.type = "data";
      index += offset;
    }
  }
  if (events.length !== newEvents.length) splice(events, 0, events.length, newEvents);
  return events;
}
/** @type {Resolver} */
function resolveToLabelEnd(events, context) {
  let index = events.length;
  let offset = 0;
  /** @type {Token} */
  let token;
  /** @type {number | undefined} */
  let open;
  /** @type {number | undefined} */
  let close;
  /** @type {Array<Event>} */
  let media;
  while (index--) {
    token = events[index][1];
    if (open) {
      if (token.type === "link" || (token.type === "labelLink" && token._inactive)) break;
      if (events[index][0] === "enter" && token.type === "labelLink") token._inactive = true;
    } else if (close) {
      if (
        events[index][0] === "enter" &&
        (token.type === "labelImage" || token.type === "labelLink") &&
        !token._balanced
      ) {
        open = index;
        if (token.type !== "labelLink") {
          offset = 2;
          break;
        }
      }
    } else if (token.type === "labelEnd") close = index;
  }
  const group = {
    type: events[open][1].type === "labelLink" ? "link" : "image",
    start: { ...events[open][1].start },
    end: { ...events[events.length - 1][1].end },
  };
  const label = {
    type: "label",
    start: { ...events[open][1].start },
    end: { ...events[close][1].end },
  };
  const text = {
    type: "labelText",
    start: { ...events[open + offset + 2][1].end },
    end: { ...events[close - 2][1].start },
  };
  media = [
    ["enter", group, context],
    ["enter", label, context],
  ];
  media = push(media, events.slice(open + 1, open + offset + 3));
  media = push(media, [["enter", text, context]]);
  media = push(
    media,
    resolveAll(
      context.parser.constructs.insideSpan.null,
      events.slice(open + offset + 4, close - 3),
      context,
    ),
  );
  media = push(media, [
    ["exit", text, context],
    events[close - 2],
    events[close - 1],
    ["exit", label, context],
  ]);
  media = push(media, events.slice(close + 1));
  media = push(media, [["exit", group, context]]);
  splice(events, open, events.length, media);
  return events;
}
/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeLabelEnd(effects, ok, nok) {
  const self = this;
  let index = self.events.length;
  /** @type {Token} */
  let labelStart;
  /** @type {boolean} */
  let defined;
  while (index--)
    if (
      (self.events[index][1].type === "labelImage" || self.events[index][1].type === "labelLink") &&
      !self.events[index][1]._balanced
    ) {
      labelStart = self.events[index][1];
      break;
    }
  return start;
  /**
   * Start of label end.
   *
   * ```markdown
   * > | [a](b) c
   *       ^
   * > | [a][b] c
   *       ^
   * > | [a][] b
   *       ^
   * > | [a] b
   * ```
   *
   * @type {State}
   */
  function start(code) {
    if (!labelStart) return nok(code);
    if (labelStart._inactive) return labelEndNok(code);
    defined = self.parser.defined.includes(
      normalizeIdentifier(
        self.sliceSerialize({
          start: labelStart.end,
          end: self.now(),
        }),
      ),
    );
    effects.enter("labelEnd");
    effects.enter("labelMarker");
    effects.consume(code);
    effects.exit("labelMarker");
    effects.exit("labelEnd");
    return after;
  }
  /**
   * After `]`.
   *
   * ```markdown
   * > | [a](b) c
   *       ^
   * > | [a][b] c
   *       ^
   * > | [a][] b
   *       ^
   * > | [a] b
   *       ^
   * ```
   *
   * @type {State}
   */
  function after(code) {
    if (code === 40)
      return effects.attempt(
        resourceConstruct,
        labelEndOk,
        defined ? labelEndOk : labelEndNok,
      )(code);
    if (code === 91)
      return effects.attempt(
        referenceFullConstruct,
        labelEndOk,
        defined ? referenceNotFull : labelEndNok,
      )(code);
    return defined ? labelEndOk(code) : labelEndNok(code);
  }
  /**
   * After `]`, at `[`, but not at a full reference.
   *
   * > 👉 **Note**: we only get here if the label is defined.
   *
   * ```markdown
   * > | [a][] b
   *        ^
   * > | [a] b
   *        ^
   * ```
   *
   * @type {State}
   */
  function referenceNotFull(code) {
    return effects.attempt(referenceCollapsedConstruct, labelEndOk, labelEndNok)(code);
  }
  /**
   * Done, we found something.
   *
   * ```markdown
   * > | [a](b) c
   *           ^
   * > | [a][b] c
   *           ^
   * > | [a][] b
   *          ^
   * > | [a] b
   *        ^
   * ```
   *
   * @type {State}
   */
  function labelEndOk(code) {
    return ok(code);
  }
  /**
   * Done, it’s nothing.
   *
   * There was an okay opening, but we didn’t match anything.
   *
   * ```markdown
   * > | [a](b c
   *        ^
   * > | [a][b c
   *        ^
   * > | [a] b
   *        ^
   * ```
   *
   * @type {State}
   */
  function labelEndNok(code) {
    labelStart._balanced = true;
    return nok(code);
  }
}
/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeResource(effects, ok, nok) {
  return resourceStart;
  /**
   * At a resource.
   *
   * ```markdown
   * > | [a](b) c
   *        ^
   * ```
   *
   * @type {State}
   */
  function resourceStart(code) {
    effects.enter("resource");
    effects.enter("resourceMarker");
    effects.consume(code);
    effects.exit("resourceMarker");
    return resourceBefore;
  }
  /**
   * In resource, after `(`, at optional whitespace.
   *
   * ```markdown
   * > | [a](b) c
   *         ^
   * ```
   *
   * @type {State}
   */
  function resourceBefore(code) {
    return markdownLineEndingOrSpace(code)
      ? factoryWhitespace(effects, resourceOpen)(code)
      : resourceOpen(code);
  }
  /**
   * In resource, after optional whitespace, at `)` or a destination.
   *
   * ```markdown
   * > | [a](b) c
   *         ^
   * ```
   *
   * @type {State}
   */
  function resourceOpen(code) {
    if (code === 41) return resourceEnd(code);
    return factoryDestination(
      effects,
      resourceDestinationAfter,
      resourceDestinationMissing,
      "resourceDestination",
      "resourceDestinationLiteral",
      "resourceDestinationLiteralMarker",
      "resourceDestinationRaw",
      "resourceDestinationString",
      32,
    )(code);
  }
  /**
   * In resource, after destination, at optional whitespace.
   *
   * ```markdown
   * > | [a](b) c
   *          ^
   * ```
   *
   * @type {State}
   */
  function resourceDestinationAfter(code) {
    return markdownLineEndingOrSpace(code)
      ? factoryWhitespace(effects, resourceBetween)(code)
      : resourceEnd(code);
  }
  /**
   * At invalid destination.
   *
   * ```markdown
   * > | [a](<<) b
   *         ^
   * ```
   *
   * @type {State}
   */
  function resourceDestinationMissing(code) {
    return nok(code);
  }
  /**
   * In resource, after destination and whitespace, at `(` or title.
   *
   * ```markdown
   * > | [a](b ) c
   *           ^
   * ```
   *
   * @type {State}
   */
  function resourceBetween(code) {
    if (code === 34 || code === 39 || code === 40)
      return factoryTitle(
        effects,
        resourceTitleAfter,
        nok,
        "resourceTitle",
        "resourceTitleMarker",
        "resourceTitleString",
      )(code);
    return resourceEnd(code);
  }
  /**
   * In resource, after title, at optional whitespace.
   *
   * ```markdown
   * > | [a](b "c") d
   *              ^
   * ```
   *
   * @type {State}
   */
  function resourceTitleAfter(code) {
    return markdownLineEndingOrSpace(code)
      ? factoryWhitespace(effects, resourceEnd)(code)
      : resourceEnd(code);
  }
  /**
   * In resource, at `)`.
   *
   * ```markdown
   * > | [a](b) d
   *          ^
   * ```
   *
   * @type {State}
   */
  function resourceEnd(code) {
    if (code === 41) {
      effects.enter("resourceMarker");
      effects.consume(code);
      effects.exit("resourceMarker");
      effects.exit("resource");
      return ok;
    }
    return nok(code);
  }
}
/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeReferenceFull(effects, ok, nok) {
  const self = this;
  return referenceFull;
  /**
   * In a reference (full), at the `[`.
   *
   * ```markdown
   * > | [a][b] d
   *        ^
   * ```
   *
   * @type {State}
   */
  function referenceFull(code) {
    return factoryLabel.call(
      self,
      effects,
      referenceFullAfter,
      referenceFullMissing,
      "reference",
      "referenceMarker",
      "referenceString",
    )(code);
  }
  /**
   * In a reference (full), after `]`.
   *
   * ```markdown
   * > | [a][b] d
   *          ^
   * ```
   *
   * @type {State}
   */
  function referenceFullAfter(code) {
    return self.parser.defined.includes(
      normalizeIdentifier(self.sliceSerialize(self.events[self.events.length - 1][1]).slice(1, -1)),
    )
      ? ok(code)
      : nok(code);
  }
  /**
   * In reference (full) that was missing.
   *
   * ```markdown
   * > | [a][b d
   *        ^
   * ```
   *
   * @type {State}
   */
  function referenceFullMissing(code) {
    return nok(code);
  }
}
/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeReferenceCollapsed(effects, ok, nok) {
  return referenceCollapsedStart;
  /**
   * In reference (collapsed), at `[`.
   *
   * > 👉 **Note**: we only get here if the label is defined.
   *
   * ```markdown
   * > | [a][] d
   *        ^
   * ```
   *
   * @type {State}
   */
  function referenceCollapsedStart(code) {
    effects.enter("reference");
    effects.enter("referenceMarker");
    effects.consume(code);
    effects.exit("referenceMarker");
    return referenceCollapsedOpen;
  }
  /**
   * In reference (collapsed), at `]`.
   *
   * > 👉 **Note**: we only get here if the label is defined.
   *
   * ```markdown
   * > | [a][] d
   *         ^
   * ```
   *
   *  @type {State}
   */
  function referenceCollapsedOpen(code) {
    if (code === 93) {
      effects.enter("referenceMarker");
      effects.consume(code);
      effects.exit("referenceMarker");
      effects.exit("reference");
      return ok;
    }
    return nok(code);
  }
}
//#endregion
//#region node_modules/micromark-core-commonmark/lib/label-start-image.js
/**
 * @import {
 *   Construct,
 *   State,
 *   TokenizeContext,
 *   Tokenizer
 * } from 'micromark-util-types'
 */
/** @type {Construct} */
const labelStartImage = {
  name: "labelStartImage",
  resolveAll: labelEnd.resolveAll,
  tokenize: tokenizeLabelStartImage,
};
/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeLabelStartImage(effects, ok, nok) {
  const self = this;
  return start;
  /**
   * Start of label (image) start.
   *
   * ```markdown
   * > | a ![b] c
   *       ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    effects.enter("labelImage");
    effects.enter("labelImageMarker");
    effects.consume(code);
    effects.exit("labelImageMarker");
    return open;
  }
  /**
   * After `!`, at `[`.
   *
   * ```markdown
   * > | a ![b] c
   *        ^
   * ```
   *
   * @type {State}
   */
  function open(code) {
    if (code === 91) {
      effects.enter("labelMarker");
      effects.consume(code);
      effects.exit("labelMarker");
      effects.exit("labelImage");
      return after;
    }
    return nok(code);
  }
  /**
   * After `![`.
   *
   * ```markdown
   * > | a ![b] c
   *         ^
   * ```
   *
   * This is needed in because, when GFM footnotes are enabled, images never
   * form when started with a `^`.
   * Instead, links form:
   *
   * ```markdown
   * ![^a](b)
   *
   * ![^a][b]
   *
   * [b]: c
   * ```
   *
   * ```html
   * <p>!<a href=\"b\">^a</a></p>
   * <p>!<a href=\"c\">^a</a></p>
   * ```
   *
   * @type {State}
   */
  function after(code) {
    /* c8 ignore next 3 */
    return code === 94 && "_hiddenFootnoteSupport" in self.parser.constructs ? nok(code) : ok(code);
  }
}
//#endregion
//#region node_modules/micromark-core-commonmark/lib/label-start-link.js
/**
 * @import {
 *   Construct,
 *   State,
 *   TokenizeContext,
 *   Tokenizer
 * } from 'micromark-util-types'
 */
/** @type {Construct} */
const labelStartLink = {
  name: "labelStartLink",
  resolveAll: labelEnd.resolveAll,
  tokenize: tokenizeLabelStartLink,
};
/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeLabelStartLink(effects, ok, nok) {
  const self = this;
  return start;
  /**
   * Start of label (link) start.
   *
   * ```markdown
   * > | a [b] c
   *       ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    effects.enter("labelLink");
    effects.enter("labelMarker");
    effects.consume(code);
    effects.exit("labelMarker");
    effects.exit("labelLink");
    return after;
  }
  /** @type {State} */
  function after(code) {
    /* c8 ignore next 3 */
    return code === 94 && "_hiddenFootnoteSupport" in self.parser.constructs ? nok(code) : ok(code);
  }
}
//#endregion
//#region node_modules/micromark-core-commonmark/lib/line-ending.js
/**
 * @import {
 *   Construct,
 *   State,
 *   TokenizeContext,
 *   Tokenizer
 * } from 'micromark-util-types'
 */
/** @type {Construct} */
const lineEnding = {
  name: "lineEnding",
  tokenize: tokenizeLineEnding,
};
/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeLineEnding(effects, ok) {
  return start;
  /** @type {State} */
  function start(code) {
    effects.enter("lineEnding");
    effects.consume(code);
    effects.exit("lineEnding");
    return factorySpace(effects, ok, "linePrefix");
  }
}
//#endregion
//#region node_modules/micromark-core-commonmark/lib/thematic-break.js
/**
 * @import {
 *   Code,
 *   Construct,
 *   State,
 *   TokenizeContext,
 *   Tokenizer
 * } from 'micromark-util-types'
 */
/** @type {Construct} */
const thematicBreak = {
  name: "thematicBreak",
  tokenize: tokenizeThematicBreak,
};
/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeThematicBreak(effects, ok, nok) {
  let size = 0;
  /** @type {NonNullable<Code>} */
  let marker;
  return start;
  /**
   * Start of thematic break.
   *
   * ```markdown
   * > | ***
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    effects.enter("thematicBreak");
    return before(code);
  }
  /**
   * After optional whitespace, at marker.
   *
   * ```markdown
   * > | ***
   *     ^
   * ```
   *
   * @type {State}
   */
  function before(code) {
    marker = code;
    return atBreak(code);
  }
  /**
   * After something, before something else.
   *
   * ```markdown
   * > | ***
   *     ^
   * ```
   *
   * @type {State}
   */
  function atBreak(code) {
    if (code === marker) {
      effects.enter("thematicBreakSequence");
      return sequence(code);
    }
    if (size >= 3 && (code === null || markdownLineEnding(code))) {
      effects.exit("thematicBreak");
      return ok(code);
    }
    return nok(code);
  }
  /**
   * In sequence.
   *
   * ```markdown
   * > | ***
   *     ^
   * ```
   *
   * @type {State}
   */
  function sequence(code) {
    if (code === marker) {
      effects.consume(code);
      size++;
      return sequence;
    }
    effects.exit("thematicBreakSequence");
    return markdownSpace(code) ? factorySpace(effects, atBreak, "whitespace")(code) : atBreak(code);
  }
}
//#endregion
//#region node_modules/micromark-core-commonmark/lib/list.js
/**
 * @import {
 *   Code,
 *   Construct,
 *   Exiter,
 *   State,
 *   TokenizeContext,
 *   Tokenizer
 * } from 'micromark-util-types'
 */
/** @type {Construct} */
const list = {
  continuation: { tokenize: tokenizeListContinuation },
  exit: tokenizeListEnd,
  name: "list",
  tokenize: tokenizeListStart,
};
/** @type {Construct} */
const listItemPrefixWhitespaceConstruct = {
  partial: true,
  tokenize: tokenizeListItemPrefixWhitespace,
};
/** @type {Construct} */
const indentConstruct = {
  partial: true,
  tokenize: tokenizeIndent,
};
/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeListStart(effects, ok, nok) {
  const self = this;
  const tail = self.events[self.events.length - 1];
  let initialSize =
    tail && tail[1].type === "linePrefix" ? tail[2].sliceSerialize(tail[1], true).length : 0;
  let size = 0;
  return start;
  /** @type {State} */
  function start(code) {
    const kind =
      self.containerState.type ||
      (code === 42 || code === 43 || code === 45 ? "listUnordered" : "listOrdered");
    if (
      kind === "listUnordered"
        ? !self.containerState.marker || code === self.containerState.marker
        : asciiDigit(code)
    ) {
      if (!self.containerState.type) {
        self.containerState.type = kind;
        effects.enter(kind, { _container: true });
      }
      if (kind === "listUnordered") {
        effects.enter("listItemPrefix");
        return code === 42 || code === 45
          ? effects.check(thematicBreak, nok, atMarker)(code)
          : atMarker(code);
      }
      if (!self.interrupt || code === 49) {
        effects.enter("listItemPrefix");
        effects.enter("listItemValue");
        return inside(code);
      }
    }
    return nok(code);
  }
  /** @type {State} */
  function inside(code) {
    if (asciiDigit(code) && ++size < 10) {
      effects.consume(code);
      return inside;
    }
    if (
      (!self.interrupt || size < 2) &&
      (self.containerState.marker
        ? code === self.containerState.marker
        : code === 41 || code === 46)
    ) {
      effects.exit("listItemValue");
      return atMarker(code);
    }
    return nok(code);
  }
  /**
   * @type {State}
   **/
  function atMarker(code) {
    effects.enter("listItemMarker");
    effects.consume(code);
    effects.exit("listItemMarker");
    self.containerState.marker = self.containerState.marker || code;
    return effects.check(
      blankLine,
      self.interrupt ? nok : onBlank,
      effects.attempt(listItemPrefixWhitespaceConstruct, endOfPrefix, otherPrefix),
    );
  }
  /** @type {State} */
  function onBlank(code) {
    self.containerState.initialBlankLine = true;
    initialSize++;
    return endOfPrefix(code);
  }
  /** @type {State} */
  function otherPrefix(code) {
    if (markdownSpace(code)) {
      effects.enter("listItemPrefixWhitespace");
      effects.consume(code);
      effects.exit("listItemPrefixWhitespace");
      return endOfPrefix;
    }
    return nok(code);
  }
  /** @type {State} */
  function endOfPrefix(code) {
    self.containerState.size =
      initialSize + self.sliceSerialize(effects.exit("listItemPrefix"), true).length;
    return ok(code);
  }
}
/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeListContinuation(effects, ok, nok) {
  const self = this;
  self.containerState._closeFlow = void 0;
  return effects.check(blankLine, onBlank, notBlank);
  /** @type {State} */
  function onBlank(code) {
    self.containerState.furtherBlankLines =
      self.containerState.furtherBlankLines || self.containerState.initialBlankLine;
    return factorySpace(effects, ok, "listItemIndent", self.containerState.size + 1)(code);
  }
  /** @type {State} */
  function notBlank(code) {
    if (self.containerState.furtherBlankLines || !markdownSpace(code)) {
      self.containerState.furtherBlankLines = void 0;
      self.containerState.initialBlankLine = void 0;
      return notInCurrentItem(code);
    }
    self.containerState.furtherBlankLines = void 0;
    self.containerState.initialBlankLine = void 0;
    return effects.attempt(indentConstruct, ok, notInCurrentItem)(code);
  }
  /** @type {State} */
  function notInCurrentItem(code) {
    self.containerState._closeFlow = true;
    self.interrupt = void 0;
    return factorySpace(
      effects,
      effects.attempt(list, ok, nok),
      "linePrefix",
      self.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4,
    )(code);
  }
}
/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeIndent(effects, ok, nok) {
  const self = this;
  return factorySpace(effects, afterPrefix, "listItemIndent", self.containerState.size + 1);
  /** @type {State} */
  function afterPrefix(code) {
    const tail = self.events[self.events.length - 1];
    return tail &&
      tail[1].type === "listItemIndent" &&
      tail[2].sliceSerialize(tail[1], true).length === self.containerState.size
      ? ok(code)
      : nok(code);
  }
}
/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Exiter}
 */
function tokenizeListEnd(effects) {
  effects.exit(this.containerState.type);
}
/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeListItemPrefixWhitespace(effects, ok, nok) {
  const self = this;
  return factorySpace(
    effects,
    afterPrefix,
    "listItemPrefixWhitespace",
    self.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 5,
  );
  /** @type {State} */
  function afterPrefix(code) {
    const tail = self.events[self.events.length - 1];
    return !markdownSpace(code) && tail && tail[1].type === "listItemPrefixWhitespace"
      ? ok(code)
      : nok(code);
  }
}
//#endregion
//#region node_modules/micromark-core-commonmark/lib/setext-underline.js
/**
 * @import {
 *   Code,
 *   Construct,
 *   Resolver,
 *   State,
 *   TokenizeContext,
 *   Tokenizer
 * } from 'micromark-util-types'
 */
/** @type {Construct} */
const setextUnderline = {
  name: "setextUnderline",
  resolveTo: resolveToSetextUnderline,
  tokenize: tokenizeSetextUnderline,
};
/** @type {Resolver} */
function resolveToSetextUnderline(events, context) {
  let index = events.length;
  /** @type {number | undefined} */
  let content;
  /** @type {number | undefined} */
  let text;
  /** @type {number | undefined} */
  let definition;
  while (index--)
    if (events[index][0] === "enter") {
      if (events[index][1].type === "content") {
        content = index;
        break;
      }
      if (events[index][1].type === "paragraph") text = index;
    } else {
      if (events[index][1].type === "content") events.splice(index, 1);
      if (!definition && events[index][1].type === "definition") definition = index;
    }
  const heading = {
    type: "setextHeading",
    start: { ...events[content][1].start },
    end: { ...events[events.length - 1][1].end },
  };
  events[text][1].type = "setextHeadingText";
  if (definition) {
    events.splice(text, 0, ["enter", heading, context]);
    events.splice(definition + 1, 0, ["exit", events[content][1], context]);
    events[content][1].end = { ...events[definition][1].end };
  } else events[content][1] = heading;
  events.push(["exit", heading, context]);
  return events;
}
/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeSetextUnderline(effects, ok, nok) {
  const self = this;
  /** @type {NonNullable<Code>} */
  let marker;
  return start;
  /**
   * At start of heading (setext) underline.
   *
   * ```markdown
   *   | aa
   * > | ==
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    let index = self.events.length;
    /** @type {boolean | undefined} */
    let paragraph;
    while (index--)
      if (
        self.events[index][1].type !== "lineEnding" &&
        self.events[index][1].type !== "linePrefix" &&
        self.events[index][1].type !== "content"
      ) {
        paragraph = self.events[index][1].type === "paragraph";
        break;
      }
    if (!self.parser.lazy[self.now().line] && (self.interrupt || paragraph)) {
      effects.enter("setextHeadingLine");
      marker = code;
      return before(code);
    }
    return nok(code);
  }
  /**
   * After optional whitespace, at `-` or `=`.
   *
   * ```markdown
   *   | aa
   * > | ==
   *     ^
   * ```
   *
   * @type {State}
   */
  function before(code) {
    effects.enter("setextHeadingLineSequence");
    return inside(code);
  }
  /**
   * In sequence.
   *
   * ```markdown
   *   | aa
   * > | ==
   *     ^
   * ```
   *
   * @type {State}
   */
  function inside(code) {
    if (code === marker) {
      effects.consume(code);
      return inside;
    }
    effects.exit("setextHeadingLineSequence");
    return markdownSpace(code) ? factorySpace(effects, after, "lineSuffix")(code) : after(code);
  }
  /**
   * After sequence, after optional whitespace.
   *
   * ```markdown
   *   | aa
   * > | ==
   *       ^
   * ```
   *
   * @type {State}
   */
  function after(code) {
    if (code === null || markdownLineEnding(code)) {
      effects.exit("setextHeadingLine");
      return ok(code);
    }
    return nok(code);
  }
}
//#endregion
//#region node_modules/micromark/lib/initialize/flow.js
/**
 * @import {
 *   InitialConstruct,
 *   Initializer,
 *   State,
 *   TokenizeContext
 * } from 'micromark-util-types'
 */
/** @type {InitialConstruct} */
const flow$1 = { tokenize: initializeFlow };
/**
 * @this {TokenizeContext}
 *   Self.
 * @type {Initializer}
 *   Initializer.
 */
function initializeFlow(effects) {
  const self = this;
  const initial = effects.attempt(
    blankLine,
    atBlankEnding,
    effects.attempt(
      this.parser.constructs.flowInitial,
      afterConstruct,
      factorySpace(
        effects,
        effects.attempt(
          this.parser.constructs.flow,
          afterConstruct,
          effects.attempt(content, afterConstruct),
        ),
        "linePrefix",
      ),
    ),
  );
  return initial;
  /** @type {State} */
  function atBlankEnding(code) {
    if (code === null) {
      effects.consume(code);
      return;
    }
    effects.enter("lineEndingBlank");
    effects.consume(code);
    effects.exit("lineEndingBlank");
    self.currentConstruct = void 0;
    return initial;
  }
  /** @type {State} */
  function afterConstruct(code) {
    if (code === null) {
      effects.consume(code);
      return;
    }
    effects.enter("lineEnding");
    effects.consume(code);
    effects.exit("lineEnding");
    self.currentConstruct = void 0;
    return initial;
  }
}
//#endregion
//#region node_modules/micromark/lib/initialize/text.js
/**
 * @import {
 *   Code,
 *   InitialConstruct,
 *   Initializer,
 *   Resolver,
 *   State,
 *   TokenizeContext
 * } from 'micromark-util-types'
 */
const resolver = { resolveAll: createResolver() };
const string$1 = initializeFactory("string");
const text$1 = initializeFactory("text");
/**
 * @param {'string' | 'text'} field
 *   Field.
 * @returns {InitialConstruct}
 *   Construct.
 */
function initializeFactory(field) {
  return {
    resolveAll: createResolver(field === "text" ? resolveAllLineSuffixes : void 0),
    tokenize: initializeText,
  };
  /**
   * @this {TokenizeContext}
   *   Context.
   * @type {Initializer}
   */
  function initializeText(effects) {
    const self = this;
    const constructs = this.parser.constructs[field];
    const text = effects.attempt(constructs, start, notText);
    return start;
    /** @type {State} */
    function start(code) {
      return atBreak(code) ? text(code) : notText(code);
    }
    /** @type {State} */
    function notText(code) {
      if (code === null) {
        effects.consume(code);
        return;
      }
      effects.enter("data");
      effects.consume(code);
      return data;
    }
    /** @type {State} */
    function data(code) {
      if (atBreak(code)) {
        effects.exit("data");
        return text(code);
      }
      effects.consume(code);
      return data;
    }
    /**
     * @param {Code} code
     *   Code.
     * @returns {boolean}
     *   Whether the code is a break.
     */
    function atBreak(code) {
      if (code === null) return true;
      const list = constructs[code];
      let index = -1;
      if (list)
        while (++index < list.length) {
          const item = list[index];
          if (!item.previous || item.previous.call(self, self.previous)) return true;
        }
      return false;
    }
  }
}
/**
 * @param {Resolver | undefined} [extraResolver]
 *   Resolver.
 * @returns {Resolver}
 *   Resolver.
 */
function createResolver(extraResolver) {
  return resolveAllText;
  /** @type {Resolver} */
  function resolveAllText(events, context) {
    let index = -1;
    /** @type {number | undefined} */
    let enter;
    while (++index <= events.length)
      if (enter === void 0) {
        if (events[index] && events[index][1].type === "data") {
          enter = index;
          index++;
        }
      } else if (!events[index] || events[index][1].type !== "data") {
        if (index !== enter + 2) {
          events[enter][1].end = events[index - 1][1].end;
          events.splice(enter + 2, index - enter - 2);
          index = enter + 2;
        }
        enter = void 0;
      }
    return extraResolver ? extraResolver(events, context) : events;
  }
}
/**
 * A rather ugly set of instructions which again looks at chunks in the input
 * stream.
 * The reason to do this here is that it is *much* faster to parse in reverse.
 * And that we can’t hook into `null` to split the line suffix before an EOF.
 * To do: figure out if we can make this into a clean utility, or even in core.
 * As it will be useful for GFMs literal autolink extension (and maybe even
 * tables?)
 *
 * @type {Resolver}
 */
function resolveAllLineSuffixes(events, context) {
  let eventIndex = 0;
  while (++eventIndex <= events.length)
    if (
      (eventIndex === events.length || events[eventIndex][1].type === "lineEnding") &&
      events[eventIndex - 1][1].type === "data"
    ) {
      const data = events[eventIndex - 1][1];
      const chunks = context.sliceStream(data);
      let index = chunks.length;
      let bufferIndex = -1;
      let size = 0;
      /** @type {boolean | undefined} */
      let tabs;
      while (index--) {
        const chunk = chunks[index];
        if (typeof chunk === "string") {
          bufferIndex = chunk.length;
          while (chunk.charCodeAt(bufferIndex - 1) === 32) {
            size++;
            bufferIndex--;
          }
          if (bufferIndex) break;
          bufferIndex = -1;
        } else if (chunk === -2) {
          tabs = true;
          size++;
        } else if (chunk === -1) {
        } else {
          index++;
          break;
        }
      }
      if (context._contentTypeTextTrailing && eventIndex === events.length) size = 0;
      if (size) {
        const token = {
          type:
            eventIndex === events.length || tabs || size < 2 ? "lineSuffix" : "hardBreakTrailing",
          start: {
            _bufferIndex: index ? bufferIndex : data.start._bufferIndex + bufferIndex,
            _index: data.start._index + index,
            line: data.end.line,
            column: data.end.column - size,
            offset: data.end.offset - size,
          },
          end: { ...data.end },
        };
        data.end = { ...token.start };
        if (data.start.offset === data.end.offset) Object.assign(data, token);
        else {
          events.splice(eventIndex, 0, ["enter", token, context], ["exit", token, context]);
          eventIndex += 2;
        }
      }
      eventIndex++;
    }
  return events;
}
//#endregion
//#region node_modules/micromark/lib/constructs.js
/**
 * @import {Extension} from 'micromark-util-types'
 */
var constructs_exports = /* @__PURE__ */ __exportAll({
  attentionMarkers: () => attentionMarkers,
  contentInitial: () => contentInitial,
  disable: () => disable,
  document: () => document,
  flow: () => flow,
  flowInitial: () => flowInitial,
  insideSpan: () => insideSpan,
  string: () => string,
  text: () => text,
});
/** @satisfies {Extension['document']} */
const document = {
  [42]: list,
  [43]: list,
  [45]: list,
  [48]: list,
  [49]: list,
  [50]: list,
  [51]: list,
  [52]: list,
  [53]: list,
  [54]: list,
  [55]: list,
  [56]: list,
  [57]: list,
  [62]: blockQuote,
};
/** @satisfies {Extension['contentInitial']} */
const contentInitial = { [91]: definition };
/** @satisfies {Extension['flowInitial']} */
const flowInitial = {
  [-2]: codeIndented,
  [-1]: codeIndented,
  [32]: codeIndented,
};
/** @satisfies {Extension['flow']} */
const flow = {
  [35]: headingAtx,
  [42]: thematicBreak,
  [45]: [setextUnderline, thematicBreak],
  [60]: htmlFlow,
  [61]: setextUnderline,
  [95]: thematicBreak,
  [96]: codeFenced,
  [126]: codeFenced,
};
/** @satisfies {Extension['string']} */
const string = {
  [38]: characterReference,
  [92]: characterEscape,
};
/** @satisfies {Extension['text']} */
const text = {
  [-5]: lineEnding,
  [-4]: lineEnding,
  [-3]: lineEnding,
  [33]: labelStartImage,
  [38]: characterReference,
  [42]: attention,
  [60]: [autolink, htmlText],
  [91]: labelStartLink,
  [92]: [hardBreakEscape, characterEscape],
  [93]: labelEnd,
  [95]: attention,
  [96]: codeText,
};
/** @satisfies {Extension['insideSpan']} */
const insideSpan = { null: [attention, resolver] };
/** @satisfies {Extension['attentionMarkers']} */
const attentionMarkers = { null: [42, 95] };
/** @satisfies {Extension['disable']} */
const disable = { null: [] };
//#endregion
//#region node_modules/micromark/lib/create-tokenizer.js
/**
 * @import {
 *   Chunk,
 *   Code,
 *   ConstructRecord,
 *   Construct,
 *   Effects,
 *   InitialConstruct,
 *   ParseContext,
 *   Point,
 *   State,
 *   TokenizeContext,
 *   Token
 * } from 'micromark-util-types'
 */
/**
 * @callback Restore
 *   Restore the state.
 * @returns {undefined}
 *   Nothing.
 *
 * @typedef Info
 *   Info.
 * @property {Restore} restore
 *   Restore.
 * @property {number} from
 *   From.
 *
 * @callback ReturnHandle
 *   Handle a successful run.
 * @param {Construct} construct
 *   Construct.
 * @param {Info} info
 *   Info.
 * @returns {undefined}
 *   Nothing.
 */
/**
 * Create a tokenizer.
 * Tokenizers deal with one type of data (e.g., containers, flow, text).
 * The parser is the object dealing with it all.
 * `initialize` works like other constructs, except that only its `tokenize`
 * function is used, in which case it doesn’t receive an `ok` or `nok`.
 * `from` can be given to set the point before the first character, although
 * when further lines are indented, they must be set with `defineSkip`.
 *
 * @param {ParseContext} parser
 *   Parser.
 * @param {InitialConstruct} initialize
 *   Construct.
 * @param {Omit<Point, '_bufferIndex' | '_index'> | undefined} [from]
 *   Point (optional).
 * @returns {TokenizeContext}
 *   Context.
 */
function createTokenizer(parser, initialize, from) {
  /** @type {Point} */
  let point = {
    _bufferIndex: -1,
    _index: 0,
    line: (from && from.line) || 1,
    column: (from && from.column) || 1,
    offset: (from && from.offset) || 0,
  };
  /** @type {Record<string, number>} */
  const columnStart = {};
  /** @type {Array<Construct>} */
  const resolveAllConstructs = [];
  /** @type {Array<Chunk>} */
  let chunks = [];
  /** @type {Array<Token>} */
  let stack = [];
  /**
   * Tools used for tokenizing.
   *
   * @type {Effects}
   */
  const effects = {
    attempt: constructFactory(onsuccessfulconstruct),
    check: constructFactory(onsuccessfulcheck),
    consume,
    enter,
    exit,
    interrupt: constructFactory(onsuccessfulcheck, { interrupt: true }),
  };
  /**
   * State and tools for resolving and serializing.
   *
   * @type {TokenizeContext}
   */
  const context = {
    code: null,
    containerState: {},
    defineSkip,
    events: [],
    now,
    parser,
    previous: null,
    sliceSerialize,
    sliceStream,
    write,
  };
  /**
   * The state function.
   *
   * @type {State | undefined}
   */
  let state = initialize.tokenize.call(context, effects);
  if (initialize.resolveAll) resolveAllConstructs.push(initialize);
  return context;
  /** @type {TokenizeContext['write']} */
  function write(slice) {
    chunks = push(chunks, slice);
    main();
    if (chunks[chunks.length - 1] !== null) return [];
    addResult(initialize, 0);
    context.events = resolveAll(resolveAllConstructs, context.events, context);
    return context.events;
  }
  /** @type {TokenizeContext['sliceSerialize']} */
  function sliceSerialize(token, expandTabs) {
    return serializeChunks(sliceStream(token), expandTabs);
  }
  /** @type {TokenizeContext['sliceStream']} */
  function sliceStream(token) {
    return sliceChunks(chunks, token);
  }
  /** @type {TokenizeContext['now']} */
  function now() {
    const { _bufferIndex, _index, line, column, offset } = point;
    return {
      _bufferIndex,
      _index,
      line,
      column,
      offset,
    };
  }
  /** @type {TokenizeContext['defineSkip']} */
  function defineSkip(value) {
    columnStart[value.line] = value.column;
    accountForPotentialSkip();
  }
  /**
   * Main loop (note that `_index` and `_bufferIndex` in `point` are modified by
   * `consume`).
   * Here is where we walk through the chunks, which either include strings of
   * several characters, or numerical character codes.
   * The reason to do this in a loop instead of a call is so the stack can
   * drain.
   *
   * @returns {undefined}
   *   Nothing.
   */
  function main() {
    /** @type {number} */
    let chunkIndex;
    while (point._index < chunks.length) {
      const chunk = chunks[point._index];
      if (typeof chunk === "string") {
        chunkIndex = point._index;
        if (point._bufferIndex < 0) point._bufferIndex = 0;
        while (point._index === chunkIndex && point._bufferIndex < chunk.length)
          go(chunk.charCodeAt(point._bufferIndex));
      } else go(chunk);
    }
  }
  /**
   * Deal with one code.
   *
   * @param {Code} code
   *   Code.
   * @returns {undefined}
   *   Nothing.
   */
  function go(code) {
    state = state(code);
  }
  /** @type {Effects['consume']} */
  function consume(code) {
    if (markdownLineEnding(code)) {
      point.line++;
      point.column = 1;
      point.offset += code === -3 ? 2 : 1;
      accountForPotentialSkip();
    } else if (code !== -1) {
      point.column++;
      point.offset++;
    }
    if (point._bufferIndex < 0) point._index++;
    else {
      point._bufferIndex++;
      if (point._bufferIndex === chunks[point._index].length) {
        point._bufferIndex = -1;
        point._index++;
      }
    }
    context.previous = code;
  }
  /** @type {Effects['enter']} */
  function enter(type, fields) {
    /** @type {Token} */
    const token = fields || {};
    token.type = type;
    token.start = now();
    context.events.push(["enter", token, context]);
    stack.push(token);
    return token;
  }
  /** @type {Effects['exit']} */
  function exit(type) {
    const token = stack.pop();
    token.end = now();
    context.events.push(["exit", token, context]);
    return token;
  }
  /**
   * Use results.
   *
   * @type {ReturnHandle}
   */
  function onsuccessfulconstruct(construct, info) {
    addResult(construct, info.from);
  }
  /**
   * Discard results.
   *
   * @type {ReturnHandle}
   */
  function onsuccessfulcheck(_, info) {
    info.restore();
  }
  /**
   * Factory to attempt/check/interrupt.
   *
   * @param {ReturnHandle} onreturn
   *   Callback.
   * @param {{interrupt?: boolean | undefined} | undefined} [fields]
   *   Fields.
   */
  function constructFactory(onreturn, fields) {
    return hook;
    /**
     * Handle either an object mapping codes to constructs, a list of
     * constructs, or a single construct.
     *
     * @param {Array<Construct> | ConstructRecord | Construct} constructs
     *   Constructs.
     * @param {State} returnState
     *   State.
     * @param {State | undefined} [bogusState]
     *   State.
     * @returns {State}
     *   State.
     */
    function hook(constructs, returnState, bogusState) {
      /** @type {ReadonlyArray<Construct>} */
      let listOfConstructs;
      /** @type {number} */
      let constructIndex;
      /** @type {Construct} */
      let currentConstruct;
      /** @type {Info} */
      let info;
      return Array.isArray(constructs)
        ? handleListOfConstructs(constructs)
        : "tokenize" in constructs
          ? handleListOfConstructs([constructs])
          : handleMapOfConstructs(constructs);
      /**
       * Handle a list of construct.
       *
       * @param {ConstructRecord} map
       *   Constructs.
       * @returns {State}
       *   State.
       */
      function handleMapOfConstructs(map) {
        return start;
        /** @type {State} */
        function start(code) {
          const left = code !== null && map[code];
          const all = code !== null && map.null;
          return handleListOfConstructs([
            ...(Array.isArray(left) ? left : left ? [left] : []),
            ...(Array.isArray(all) ? all : all ? [all] : []),
          ])(code);
        }
      }
      /**
       * Handle a list of construct.
       *
       * @param {ReadonlyArray<Construct>} list
       *   Constructs.
       * @returns {State}
       *   State.
       */
      function handleListOfConstructs(list) {
        listOfConstructs = list;
        constructIndex = 0;
        if (list.length === 0) return bogusState;
        return handleConstruct(list[constructIndex]);
      }
      /**
       * Handle a single construct.
       *
       * @param {Construct} construct
       *   Construct.
       * @returns {State}
       *   State.
       */
      function handleConstruct(construct) {
        return start;
        /** @type {State} */
        function start(code) {
          info = store();
          currentConstruct = construct;
          if (!construct.partial) context.currentConstruct = construct;
          if (construct.name && context.parser.constructs.disable.null.includes(construct.name))
            return nok(code);
          return construct.tokenize.call(
            fields ? Object.assign(Object.create(context), fields) : context,
            effects,
            ok,
            nok,
          )(code);
        }
      }
      /** @type {State} */
      function ok(code) {
        onreturn(currentConstruct, info);
        return returnState;
      }
      /** @type {State} */
      function nok(code) {
        info.restore();
        if (++constructIndex < listOfConstructs.length)
          return handleConstruct(listOfConstructs[constructIndex]);
        return bogusState;
      }
    }
  }
  /**
   * @param {Construct} construct
   *   Construct.
   * @param {number} from
   *   From.
   * @returns {undefined}
   *   Nothing.
   */
  function addResult(construct, from) {
    if (construct.resolveAll && !resolveAllConstructs.includes(construct))
      resolveAllConstructs.push(construct);
    if (construct.resolve)
      splice(
        context.events,
        from,
        context.events.length - from,
        construct.resolve(context.events.slice(from), context),
      );
    if (construct.resolveTo) context.events = construct.resolveTo(context.events, context);
  }
  /**
   * Store state.
   *
   * @returns {Info}
   *   Info.
   */
  function store() {
    const startPoint = now();
    const startPrevious = context.previous;
    const startCurrentConstruct = context.currentConstruct;
    const startEventsIndex = context.events.length;
    const startStack = Array.from(stack);
    return {
      from: startEventsIndex,
      restore,
    };
    /**
     * Restore state.
     *
     * @returns {undefined}
     *   Nothing.
     */
    function restore() {
      point = startPoint;
      context.previous = startPrevious;
      context.currentConstruct = startCurrentConstruct;
      context.events.length = startEventsIndex;
      stack = startStack;
      accountForPotentialSkip();
    }
  }
  /**
   * Move the current point a bit forward in the line when it’s on a column
   * skip.
   *
   * @returns {undefined}
   *   Nothing.
   */
  function accountForPotentialSkip() {
    if (point.line in columnStart && point.column < 2) {
      point.column = columnStart[point.line];
      point.offset += columnStart[point.line] - 1;
    }
  }
}
/**
 * Get the chunks from a slice of chunks in the range of a token.
 *
 * @param {ReadonlyArray<Chunk>} chunks
 *   Chunks.
 * @param {Pick<Token, 'end' | 'start'>} token
 *   Token.
 * @returns {Array<Chunk>}
 *   Chunks.
 */
function sliceChunks(chunks, token) {
  const startIndex = token.start._index;
  const startBufferIndex = token.start._bufferIndex;
  const endIndex = token.end._index;
  const endBufferIndex = token.end._bufferIndex;
  /** @type {Array<Chunk>} */
  let view;
  if (startIndex === endIndex) view = [chunks[startIndex].slice(startBufferIndex, endBufferIndex)];
  else {
    view = chunks.slice(startIndex, endIndex);
    if (startBufferIndex > -1) {
      const head = view[0];
      if (typeof head === "string") view[0] = head.slice(startBufferIndex);
      else view.shift();
    }
    if (endBufferIndex > 0) view.push(chunks[endIndex].slice(0, endBufferIndex));
  }
  return view;
}
/**
 * Get the string value of a slice of chunks.
 *
 * @param {ReadonlyArray<Chunk>} chunks
 *   Chunks.
 * @param {boolean | undefined} [expandTabs=false]
 *   Whether to expand tabs (default: `false`).
 * @returns {string}
 *   Result.
 */
function serializeChunks(chunks, expandTabs) {
  let index = -1;
  /** @type {Array<string>} */
  const result = [];
  /** @type {boolean | undefined} */
  let atTab;
  while (++index < chunks.length) {
    const chunk = chunks[index];
    /** @type {string} */
    let value;
    if (typeof chunk === "string") value = chunk;
    else
      switch (chunk) {
        case -5:
          value = "\r";
          break;
        case -4:
          value = "\n";
          break;
        case -3:
          value = "\r\n";
          break;
        case -2:
          value = expandTabs ? " " : "	";
          break;
        case -1:
          if (!expandTabs && atTab) continue;
          value = " ";
          break;
        default:
          value = String.fromCharCode(chunk);
      }
    atTab = chunk === -2;
    result.push(value);
  }
  return result.join("");
}
//#endregion
//#region node_modules/micromark/lib/parse.js
/**
 * @import {
 *   Create,
 *   FullNormalizedExtension,
 *   InitialConstruct,
 *   ParseContext,
 *   ParseOptions
 * } from 'micromark-util-types'
 */
/**
 * @param {ParseOptions | null | undefined} [options]
 *   Configuration (optional).
 * @returns {ParseContext}
 *   Parser.
 */
function parse$1(options) {
  /** @type {ParseContext} */
  const parser = {
    constructs: combineExtensions([constructs_exports, ...((options || {}).extensions || [])]),
    content: create(content$1),
    defined: [],
    document: create(document$1),
    flow: create(flow$1),
    lazy: {},
    string: create(string$1),
    text: create(text$1),
  };
  return parser;
  /**
   * @param {InitialConstruct} initial
   *   Construct to start with.
   * @returns {Create}
   *   Create a tokenizer.
   */
  function create(initial) {
    return creator;
    /** @type {Create} */
    function creator(from) {
      return createTokenizer(parser, initial, from);
    }
  }
}
//#endregion
//#region node_modules/micromark/lib/postprocess.js
/**
 * @import {Event} from 'micromark-util-types'
 */
/**
 * @param {Array<Event>} events
 *   Events.
 * @returns {Array<Event>}
 *   Events.
 */
function postprocess(events) {
  while (!subtokenize(events));
  return events;
}
//#endregion
//#region node_modules/micromark/lib/preprocess.js
/**
 * @import {Chunk, Code, Encoding, Value} from 'micromark-util-types'
 */
/**
 * @callback Preprocessor
 *   Preprocess a value.
 * @param {Value} value
 *   Value.
 * @param {Encoding | null | undefined} [encoding]
 *   Encoding when `value` is a typed array (optional).
 * @param {boolean | null | undefined} [end=false]
 *   Whether this is the last chunk (default: `false`).
 * @returns {Array<Chunk>}
 *   Chunks.
 */
const search = /[\0\t\n\r]/g;
/**
 * @returns {Preprocessor}
 *   Preprocess a value.
 */
function preprocess() {
  let column = 1;
  let buffer = "";
  /** @type {boolean | undefined} */
  let start = true;
  /** @type {boolean | undefined} */
  let atCarriageReturn;
  return preprocessor;
  /** @type {Preprocessor} */
  function preprocessor(value, encoding, end) {
    /** @type {Array<Chunk>} */
    const chunks = [];
    /** @type {RegExpMatchArray | null} */
    let match;
    /** @type {number} */
    let next;
    /** @type {number} */
    let startPosition;
    /** @type {number} */
    let endPosition;
    /** @type {Code} */
    let code;
    value =
      buffer +
      (typeof value === "string"
        ? value.toString()
        : new TextDecoder(encoding || void 0).decode(value));
    startPosition = 0;
    buffer = "";
    if (start) {
      if (value.charCodeAt(0) === 65279) startPosition++;
      start = void 0;
    }
    while (startPosition < value.length) {
      search.lastIndex = startPosition;
      match = search.exec(value);
      endPosition = match && match.index !== void 0 ? match.index : value.length;
      code = value.charCodeAt(endPosition);
      if (!match) {
        buffer = value.slice(startPosition);
        break;
      }
      if (code === 10 && startPosition === endPosition && atCarriageReturn) {
        chunks.push(-3);
        atCarriageReturn = void 0;
      } else {
        if (atCarriageReturn) {
          chunks.push(-5);
          atCarriageReturn = void 0;
        }
        if (startPosition < endPosition) {
          chunks.push(value.slice(startPosition, endPosition));
          column += endPosition - startPosition;
        }
        switch (code) {
          case 0:
            chunks.push(65533);
            column++;
            break;
          case 9:
            next = Math.ceil(column / 4) * 4;
            chunks.push(-2);
            while (column++ < next) chunks.push(-1);
            break;
          case 10:
            chunks.push(-4);
            column = 1;
            break;
          default:
            atCarriageReturn = true;
            column = 1;
        }
      }
      startPosition = endPosition + 1;
    }
    if (end) {
      if (atCarriageReturn) chunks.push(-5);
      if (buffer) chunks.push(buffer);
      chunks.push(null);
    }
    return chunks;
  }
}
//#endregion
//#region node_modules/micromark-util-decode-string/index.js
const characterEscapeOrReference =
  /\\([!-/:-@[-`{-~])|&(#(?:\d{1,7}|x[\da-f]{1,6})|[\da-z]{1,31});/gi;
/**
 * Decode markdown strings (which occur in places such as fenced code info
 * strings, destinations, labels, and titles).
 *
 * The “string” content type allows character escapes and -references.
 * This decodes those.
 *
 * @param {string} value
 *   Value to decode.
 * @returns {string}
 *   Decoded value.
 */
function decodeString(value) {
  return value.replace(characterEscapeOrReference, decode);
}
/**
 * @param {string} $0
 *   Match.
 * @param {string} $1
 *   Character escape.
 * @param {string} $2
 *   Character reference.
 * @returns {string}
 *   Decoded value
 */
function decode($0, $1, $2) {
  if ($1) return $1;
  if ($2.charCodeAt(0) === 35) {
    const head = $2.charCodeAt(1);
    const hex = head === 120 || head === 88;
    return decodeNumericCharacterReference($2.slice(hex ? 2 : 1), hex ? 16 : 10);
  }
  return decodeNamedCharacterReference($2) || $0;
}
//#endregion
//#region node_modules/unist-util-stringify-position/lib/index.js
/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('unist').Point} Point
 * @typedef {import('unist').Position} Position
 */
/**
 * @typedef NodeLike
 * @property {string} type
 * @property {PositionLike | null | undefined} [position]
 *
 * @typedef PointLike
 * @property {number | null | undefined} [line]
 * @property {number | null | undefined} [column]
 * @property {number | null | undefined} [offset]
 *
 * @typedef PositionLike
 * @property {PointLike | null | undefined} [start]
 * @property {PointLike | null | undefined} [end]
 */
/**
 * Serialize the positional info of a point, position (start and end points),
 * or node.
 *
 * @param {Node | NodeLike | Point | PointLike | Position | PositionLike | null | undefined} [value]
 *   Node, position, or point.
 * @returns {string}
 *   Pretty printed positional info of a node (`string`).
 *
 *   In the format of a range `ls:cs-le:ce` (when given `node` or `position`)
 *   or a point `l:c` (when given `point`), where `l` stands for line, `c` for
 *   column, `s` for `start`, and `e` for end.
 *   An empty string (`''`) is returned if the given value is neither `node`,
 *   `position`, nor `point`.
 */
function stringifyPosition(value) {
  if (!value || typeof value !== "object") return "";
  if ("position" in value || "type" in value) return position(value.position);
  if ("start" in value || "end" in value) return position(value);
  if ("line" in value || "column" in value) return point$1(value);
  return "";
}
/**
 * @param {Point | PointLike | null | undefined} point
 * @returns {string}
 */
function point$1(point) {
  return index(point && point.line) + ":" + index(point && point.column);
}
/**
 * @param {Position | PositionLike | null | undefined} pos
 * @returns {string}
 */
function position(pos) {
  return point$1(pos && pos.start) + "-" + point$1(pos && pos.end);
}
/**
 * @param {number | null | undefined} value
 * @returns {number}
 */
function index(value) {
  return value && typeof value === "number" ? value : 1;
}
//#endregion
//#region node_modules/mdast-util-from-markdown/lib/index.js
/**
 * @import {
 *   Break,
 *   Blockquote,
 *   Code,
 *   Definition,
 *   Emphasis,
 *   Heading,
 *   Html,
 *   Image,
 *   InlineCode,
 *   Link,
 *   ListItem,
 *   List,
 *   Nodes,
 *   Paragraph,
 *   PhrasingContent,
 *   ReferenceType,
 *   Root,
 *   Strong,
 *   Text,
 *   ThematicBreak
 * } from 'mdast'
 * @import {
 *   Encoding,
 *   Event,
 *   Token,
 *   Value
 * } from 'micromark-util-types'
 * @import {Point} from 'unist'
 * @import {
 *   CompileContext,
 *   CompileData,
 *   Config,
 *   Extension,
 *   Handle,
 *   OnEnterError,
 *   Options
 * } from './types.js'
 */
const own = {}.hasOwnProperty;
/**
 * Turn markdown into a syntax tree.
 *
 * @overload
 * @param {Value} value
 * @param {Encoding | null | undefined} [encoding]
 * @param {Options | null | undefined} [options]
 * @returns {Root}
 *
 * @overload
 * @param {Value} value
 * @param {Options | null | undefined} [options]
 * @returns {Root}
 *
 * @param {Value} value
 *   Markdown to parse.
 * @param {Encoding | Options | null | undefined} [encoding]
 *   Character encoding for when `value` is `Buffer`.
 * @param {Options | null | undefined} [options]
 *   Configuration.
 * @returns {Root}
 *   mdast tree.
 */
function fromMarkdown(value, encoding, options) {
  if (encoding && typeof encoding === "object") {
    options = encoding;
    encoding = void 0;
  }
  return compiler(options)(
    postprocess(
      parse$1(options)
        .document()
        .write(preprocess()(value, encoding, true)),
    ),
  );
}
/**
 * Note this compiler only understand complete buffering, not streaming.
 *
 * @param {Options | null | undefined} [options]
 */
function compiler(options) {
  /** @type {Config} */
  const config = {
    transforms: [],
    canContainEols: ["emphasis", "fragment", "heading", "paragraph", "strong"],
    enter: {
      autolink: opener(link),
      autolinkProtocol: onenterdata,
      autolinkEmail: onenterdata,
      atxHeading: opener(heading),
      blockQuote: opener(blockQuote),
      characterEscape: onenterdata,
      characterReference: onenterdata,
      codeFenced: opener(codeFlow),
      codeFencedFenceInfo: buffer,
      codeFencedFenceMeta: buffer,
      codeIndented: opener(codeFlow, buffer),
      codeText: opener(codeText, buffer),
      codeTextData: onenterdata,
      data: onenterdata,
      codeFlowValue: onenterdata,
      definition: opener(definition),
      definitionDestinationString: buffer,
      definitionLabelString: buffer,
      definitionTitleString: buffer,
      emphasis: opener(emphasis),
      hardBreakEscape: opener(hardBreak),
      hardBreakTrailing: opener(hardBreak),
      htmlFlow: opener(html, buffer),
      htmlFlowData: onenterdata,
      htmlText: opener(html, buffer),
      htmlTextData: onenterdata,
      image: opener(image),
      label: buffer,
      link: opener(link),
      listItem: opener(listItem),
      listItemValue: onenterlistitemvalue,
      listOrdered: opener(list, onenterlistordered),
      listUnordered: opener(list),
      paragraph: opener(paragraph),
      reference: onenterreference,
      referenceString: buffer,
      resourceDestinationString: buffer,
      resourceTitleString: buffer,
      setextHeading: opener(heading),
      strong: opener(strong),
      thematicBreak: opener(thematicBreak),
    },
    exit: {
      atxHeading: closer(),
      atxHeadingSequence: onexitatxheadingsequence,
      autolink: closer(),
      autolinkEmail: onexitautolinkemail,
      autolinkProtocol: onexitautolinkprotocol,
      blockQuote: closer(),
      characterEscapeValue: onexitdata,
      characterReferenceMarkerHexadecimal: onexitcharacterreferencemarker,
      characterReferenceMarkerNumeric: onexitcharacterreferencemarker,
      characterReferenceValue: onexitcharacterreferencevalue,
      characterReference: onexitcharacterreference,
      codeFenced: closer(onexitcodefenced),
      codeFencedFence: onexitcodefencedfence,
      codeFencedFenceInfo: onexitcodefencedfenceinfo,
      codeFencedFenceMeta: onexitcodefencedfencemeta,
      codeFlowValue: onexitdata,
      codeIndented: closer(onexitcodeindented),
      codeText: closer(onexitcodetext),
      codeTextData: onexitdata,
      data: onexitdata,
      definition: closer(),
      definitionDestinationString: onexitdefinitiondestinationstring,
      definitionLabelString: onexitdefinitionlabelstring,
      definitionTitleString: onexitdefinitiontitlestring,
      emphasis: closer(),
      hardBreakEscape: closer(onexithardbreak),
      hardBreakTrailing: closer(onexithardbreak),
      htmlFlow: closer(onexithtmlflow),
      htmlFlowData: onexitdata,
      htmlText: closer(onexithtmltext),
      htmlTextData: onexitdata,
      image: closer(onexitimage),
      label: onexitlabel,
      labelText: onexitlabeltext,
      lineEnding: onexitlineending,
      link: closer(onexitlink),
      listItem: closer(),
      listOrdered: closer(),
      listUnordered: closer(),
      paragraph: closer(),
      referenceString: onexitreferencestring,
      resourceDestinationString: onexitresourcedestinationstring,
      resourceTitleString: onexitresourcetitlestring,
      resource: onexitresource,
      setextHeading: closer(onexitsetextheading),
      setextHeadingLineSequence: onexitsetextheadinglinesequence,
      setextHeadingText: onexitsetextheadingtext,
      strong: closer(),
      thematicBreak: closer(),
    },
  };
  configure(config, (options || {}).mdastExtensions || []);
  /** @type {CompileData} */
  const data = {};
  return compile;
  /**
   * Turn micromark events into an mdast tree.
   *
   * @param {Array<Event>} events
   *   Events.
   * @returns {Root}
   *   mdast tree.
   */
  function compile(events) {
    /** @type {Root} */
    let tree = {
      type: "root",
      children: [],
    };
    /** @type {Omit<CompileContext, 'sliceSerialize'>} */
    const context = {
      stack: [tree],
      tokenStack: [],
      config,
      enter,
      exit,
      buffer,
      resume,
      data,
    };
    /** @type {Array<number>} */
    const listStack = [];
    let index = -1;
    while (++index < events.length)
      if (events[index][1].type === "listOrdered" || events[index][1].type === "listUnordered")
        if (events[index][0] === "enter") listStack.push(index);
        else index = prepareList(events, listStack.pop(), index);
    index = -1;
    while (++index < events.length) {
      const handler = config[events[index][0]];
      if (own.call(handler, events[index][1].type))
        handler[events[index][1].type].call(
          Object.assign({ sliceSerialize: events[index][2].sliceSerialize }, context),
          events[index][1],
        );
    }
    if (context.tokenStack.length > 0) {
      const tail = context.tokenStack[context.tokenStack.length - 1];
      (tail[1] || defaultOnError).call(context, void 0, tail[0]);
    }
    tree.position = {
      start: point(
        events.length > 0
          ? events[0][1].start
          : {
              line: 1,
              column: 1,
              offset: 0,
            },
      ),
      end: point(
        events.length > 0
          ? events[events.length - 2][1].end
          : {
              line: 1,
              column: 1,
              offset: 0,
            },
      ),
    };
    index = -1;
    while (++index < config.transforms.length) tree = config.transforms[index](tree) || tree;
    return tree;
  }
  /**
   * @param {Array<Event>} events
   * @param {number} start
   * @param {number} length
   * @returns {number}
   */
  function prepareList(events, start, length) {
    let index = start - 1;
    let containerBalance = -1;
    let listSpread = false;
    /** @type {Token | undefined} */
    let listItem;
    /** @type {number | undefined} */
    let lineIndex;
    /** @type {number | undefined} */
    let firstBlankLineIndex;
    /** @type {boolean | undefined} */
    let atMarker;
    while (++index <= length) {
      const event = events[index];
      switch (event[1].type) {
        case "listUnordered":
        case "listOrdered":
        case "blockQuote":
          if (event[0] === "enter") containerBalance++;
          else containerBalance--;
          atMarker = void 0;
          break;
        case "lineEndingBlank":
          if (event[0] === "enter") {
            if (listItem && !atMarker && !containerBalance && !firstBlankLineIndex)
              firstBlankLineIndex = index;
            atMarker = void 0;
          }
          break;
        case "linePrefix":
        case "listItemValue":
        case "listItemMarker":
        case "listItemPrefix":
        case "listItemPrefixWhitespace":
          break;
        default:
          atMarker = void 0;
      }
      if (
        (!containerBalance && event[0] === "enter" && event[1].type === "listItemPrefix") ||
        (containerBalance === -1 &&
          event[0] === "exit" &&
          (event[1].type === "listUnordered" || event[1].type === "listOrdered"))
      ) {
        if (listItem) {
          let tailIndex = index;
          lineIndex = void 0;
          while (tailIndex--) {
            const tailEvent = events[tailIndex];
            if (tailEvent[1].type === "lineEnding" || tailEvent[1].type === "lineEndingBlank") {
              if (tailEvent[0] === "exit") continue;
              if (lineIndex) {
                events[lineIndex][1].type = "lineEndingBlank";
                listSpread = true;
              }
              tailEvent[1].type = "lineEnding";
              lineIndex = tailIndex;
            } else if (
              tailEvent[1].type === "linePrefix" ||
              tailEvent[1].type === "blockQuotePrefix" ||
              tailEvent[1].type === "blockQuotePrefixWhitespace" ||
              tailEvent[1].type === "blockQuoteMarker" ||
              tailEvent[1].type === "listItemIndent"
            ) {
            } else break;
          }
          if (firstBlankLineIndex && (!lineIndex || firstBlankLineIndex < lineIndex))
            listItem._spread = true;
          listItem.end = Object.assign({}, lineIndex ? events[lineIndex][1].start : event[1].end);
          events.splice(lineIndex || index, 0, ["exit", listItem, event[2]]);
          index++;
          length++;
        }
        if (event[1].type === "listItemPrefix") {
          /** @type {Token} */
          const item = {
            type: "listItem",
            _spread: false,
            start: Object.assign({}, event[1].start),
            end: void 0,
          };
          listItem = item;
          events.splice(index, 0, ["enter", item, event[2]]);
          index++;
          length++;
          firstBlankLineIndex = void 0;
          atMarker = true;
        }
      }
    }
    events[start][1]._spread = listSpread;
    return length;
  }
  /**
   * Create an opener handle.
   *
   * @param {(token: Token) => Nodes} create
   *   Create a node.
   * @param {Handle | undefined} [and]
   *   Optional function to also run.
   * @returns {Handle}
   *   Handle.
   */
  function opener(create, and) {
    return open;
    /**
     * @this {CompileContext}
     * @param {Token} token
     * @returns {undefined}
     */
    function open(token) {
      enter.call(this, create(token), token);
      if (and) and.call(this, token);
    }
  }
  /**
   * @type {CompileContext['buffer']}
   */
  function buffer() {
    this.stack.push({
      type: "fragment",
      children: [],
    });
  }
  /**
   * @type {CompileContext['enter']}
   */
  function enter(node, token, errorHandler) {
    this.stack[this.stack.length - 1].children.push(node);
    this.stack.push(node);
    this.tokenStack.push([token, errorHandler || void 0]);
    node.position = {
      start: point(token.start),
      end: void 0,
    };
  }
  /**
   * Create a closer handle.
   *
   * @param {Handle | undefined} [and]
   *   Optional function to also run.
   * @returns {Handle}
   *   Handle.
   */
  function closer(and) {
    return close;
    /**
     * @this {CompileContext}
     * @param {Token} token
     * @returns {undefined}
     */
    function close(token) {
      if (and) and.call(this, token);
      exit.call(this, token);
    }
  }
  /**
   * @type {CompileContext['exit']}
   */
  function exit(token, onExitError) {
    const node = this.stack.pop();
    const open = this.tokenStack.pop();
    if (!open)
      throw new Error(
        "Cannot close `" +
          token.type +
          "` (" +
          stringifyPosition({
            start: token.start,
            end: token.end,
          }) +
          "): it’s not open",
      );
    else if (open[0].type !== token.type)
      if (onExitError) onExitError.call(this, token, open[0]);
      else (open[1] || defaultOnError).call(this, token, open[0]);
    node.position.end = point(token.end);
  }
  /**
   * @type {CompileContext['resume']}
   */
  function resume() {
    return toString(this.stack.pop());
  }
  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onenterlistordered() {
    this.data.expectingFirstListItemValue = true;
  }
  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onenterlistitemvalue(token) {
    if (this.data.expectingFirstListItemValue) {
      const ancestor = this.stack[this.stack.length - 2];
      ancestor.start = Number.parseInt(this.sliceSerialize(token), 10);
      this.data.expectingFirstListItemValue = void 0;
    }
  }
  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitcodefencedfenceinfo() {
    const data = this.resume();
    const node = this.stack[this.stack.length - 1];
    node.lang = data;
  }
  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitcodefencedfencemeta() {
    const data = this.resume();
    const node = this.stack[this.stack.length - 1];
    node.meta = data;
  }
  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitcodefencedfence() {
    if (this.data.flowCodeInside) return;
    this.buffer();
    this.data.flowCodeInside = true;
  }
  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitcodefenced() {
    const data = this.resume();
    const node = this.stack[this.stack.length - 1];
    node.value = data.replace(/^(\r?\n|\r)|(\r?\n|\r)$/g, "");
    this.data.flowCodeInside = void 0;
  }
  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitcodeindented() {
    const data = this.resume();
    const node = this.stack[this.stack.length - 1];
    node.value = data.replace(/(\r?\n|\r)$/g, "");
  }
  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitdefinitionlabelstring(token) {
    const label = this.resume();
    const node = this.stack[this.stack.length - 1];
    node.label = label;
    node.identifier = normalizeIdentifier(this.sliceSerialize(token)).toLowerCase();
  }
  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitdefinitiontitlestring() {
    const data = this.resume();
    const node = this.stack[this.stack.length - 1];
    node.title = data;
  }
  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitdefinitiondestinationstring() {
    const data = this.resume();
    const node = this.stack[this.stack.length - 1];
    node.url = data;
  }
  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitatxheadingsequence(token) {
    const node = this.stack[this.stack.length - 1];
    if (!node.depth) node.depth = this.sliceSerialize(token).length;
  }
  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitsetextheadingtext() {
    this.data.setextHeadingSlurpLineEnding = true;
  }
  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitsetextheadinglinesequence(token) {
    const node = this.stack[this.stack.length - 1];
    node.depth = this.sliceSerialize(token).codePointAt(0) === 61 ? 1 : 2;
  }
  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitsetextheading() {
    this.data.setextHeadingSlurpLineEnding = void 0;
  }
  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onenterdata(token) {
    /** @type {Array<Nodes>} */
    const siblings = this.stack[this.stack.length - 1].children;
    let tail = siblings[siblings.length - 1];
    if (!tail || tail.type !== "text") {
      tail = text();
      tail.position = {
        start: point(token.start),
        end: void 0,
      };
      siblings.push(tail);
    }
    this.stack.push(tail);
  }
  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitdata(token) {
    const tail = this.stack.pop();
    tail.value += this.sliceSerialize(token);
    tail.position.end = point(token.end);
  }
  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitlineending(token) {
    const context = this.stack[this.stack.length - 1];
    if (this.data.atHardBreak) {
      const tail = context.children[context.children.length - 1];
      tail.position.end = point(token.end);
      this.data.atHardBreak = void 0;
      return;
    }
    if (!this.data.setextHeadingSlurpLineEnding && config.canContainEols.includes(context.type)) {
      onenterdata.call(this, token);
      onexitdata.call(this, token);
    }
  }
  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexithardbreak() {
    this.data.atHardBreak = true;
  }
  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexithtmlflow() {
    const data = this.resume();
    const node = this.stack[this.stack.length - 1];
    node.value = data;
  }
  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexithtmltext() {
    const data = this.resume();
    const node = this.stack[this.stack.length - 1];
    node.value = data;
  }
  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitcodetext() {
    const data = this.resume();
    const node = this.stack[this.stack.length - 1];
    node.value = data;
  }
  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitlink() {
    const node = this.stack[this.stack.length - 1];
    if (this.data.inReference) {
      /** @type {ReferenceType} */
      const referenceType = this.data.referenceType || "shortcut";
      node.type += "Reference";
      node.referenceType = referenceType;
      delete node.url;
      delete node.title;
    } else {
      delete node.identifier;
      delete node.label;
    }
    this.data.referenceType = void 0;
  }
  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitimage() {
    const node = this.stack[this.stack.length - 1];
    if (this.data.inReference) {
      /** @type {ReferenceType} */
      const referenceType = this.data.referenceType || "shortcut";
      node.type += "Reference";
      node.referenceType = referenceType;
      delete node.url;
      delete node.title;
    } else {
      delete node.identifier;
      delete node.label;
    }
    this.data.referenceType = void 0;
  }
  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitlabeltext(token) {
    const string = this.sliceSerialize(token);
    const ancestor = this.stack[this.stack.length - 2];
    ancestor.label = decodeString(string);
    ancestor.identifier = normalizeIdentifier(string).toLowerCase();
  }
  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitlabel() {
    const fragment = this.stack[this.stack.length - 1];
    const value = this.resume();
    const node = this.stack[this.stack.length - 1];
    this.data.inReference = true;
    if (node.type === "link") node.children = fragment.children;
    else node.alt = value;
  }
  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitresourcedestinationstring() {
    const data = this.resume();
    const node = this.stack[this.stack.length - 1];
    node.url = data;
  }
  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitresourcetitlestring() {
    const data = this.resume();
    const node = this.stack[this.stack.length - 1];
    node.title = data;
  }
  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitresource() {
    this.data.inReference = void 0;
  }
  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onenterreference() {
    this.data.referenceType = "collapsed";
  }
  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitreferencestring(token) {
    const label = this.resume();
    const node = this.stack[this.stack.length - 1];
    node.label = label;
    node.identifier = normalizeIdentifier(this.sliceSerialize(token)).toLowerCase();
    this.data.referenceType = "full";
  }
  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitcharacterreferencemarker(token) {
    this.data.characterReferenceType = token.type;
  }
  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitcharacterreferencevalue(token) {
    const data = this.sliceSerialize(token);
    const type = this.data.characterReferenceType;
    /** @type {string} */
    let value;
    if (type) {
      value = decodeNumericCharacterReference(
        data,
        type === "characterReferenceMarkerNumeric" ? 10 : 16,
      );
      this.data.characterReferenceType = void 0;
    } else value = decodeNamedCharacterReference(data);
    const tail = this.stack[this.stack.length - 1];
    tail.value += value;
  }
  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitcharacterreference(token) {
    const tail = this.stack.pop();
    tail.position.end = point(token.end);
  }
  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitautolinkprotocol(token) {
    onexitdata.call(this, token);
    const node = this.stack[this.stack.length - 1];
    node.url = this.sliceSerialize(token);
  }
  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitautolinkemail(token) {
    onexitdata.call(this, token);
    const node = this.stack[this.stack.length - 1];
    node.url = "mailto:" + this.sliceSerialize(token);
  }
  /** @returns {Blockquote} */
  function blockQuote() {
    return {
      type: "blockquote",
      children: [],
    };
  }
  /** @returns {Code} */
  function codeFlow() {
    return {
      type: "code",
      lang: null,
      meta: null,
      value: "",
    };
  }
  /** @returns {InlineCode} */
  function codeText() {
    return {
      type: "inlineCode",
      value: "",
    };
  }
  /** @returns {Definition} */
  function definition() {
    return {
      type: "definition",
      identifier: "",
      label: null,
      title: null,
      url: "",
    };
  }
  /** @returns {Emphasis} */
  function emphasis() {
    return {
      type: "emphasis",
      children: [],
    };
  }
  /** @returns {Heading} */
  function heading() {
    return {
      type: "heading",
      depth: 0,
      children: [],
    };
  }
  /** @returns {Break} */
  function hardBreak() {
    return { type: "break" };
  }
  /** @returns {Html} */
  function html() {
    return {
      type: "html",
      value: "",
    };
  }
  /** @returns {Image} */
  function image() {
    return {
      type: "image",
      title: null,
      url: "",
      alt: null,
    };
  }
  /** @returns {Link} */
  function link() {
    return {
      type: "link",
      title: null,
      url: "",
      children: [],
    };
  }
  /**
   * @param {Token} token
   * @returns {List}
   */
  function list(token) {
    return {
      type: "list",
      ordered: token.type === "listOrdered",
      start: null,
      spread: token._spread,
      children: [],
    };
  }
  /**
   * @param {Token} token
   * @returns {ListItem}
   */
  function listItem(token) {
    return {
      type: "listItem",
      spread: token._spread,
      checked: null,
      children: [],
    };
  }
  /** @returns {Paragraph} */
  function paragraph() {
    return {
      type: "paragraph",
      children: [],
    };
  }
  /** @returns {Strong} */
  function strong() {
    return {
      type: "strong",
      children: [],
    };
  }
  /** @returns {Text} */
  function text() {
    return {
      type: "text",
      value: "",
    };
  }
  /** @returns {ThematicBreak} */
  function thematicBreak() {
    return { type: "thematicBreak" };
  }
}
/**
 * Copy a point-like value.
 *
 * @param {Point} d
 *   Point-like value.
 * @returns {Point}
 *   unist point.
 */
function point(d) {
  return {
    line: d.line,
    column: d.column,
    offset: d.offset,
  };
}
/**
 * @param {Config} combined
 * @param {Array<Array<Extension> | Extension>} extensions
 * @returns {undefined}
 */
function configure(combined, extensions) {
  let index = -1;
  while (++index < extensions.length) {
    const value = extensions[index];
    if (Array.isArray(value)) configure(combined, value);
    else extension(combined, value);
  }
}
/**
 * @param {Config} combined
 * @param {Extension} extension
 * @returns {undefined}
 */
function extension(combined, extension) {
  /** @type {keyof Extension} */
  let key;
  for (key in extension)
    if (own.call(extension, key))
      switch (key) {
        case "canContainEols": {
          const right = extension[key];
          if (right) combined[key].push(...right);
          break;
        }
        case "transforms": {
          const right = extension[key];
          if (right) combined[key].push(...right);
          break;
        }
        case "enter":
        case "exit": {
          const right = extension[key];
          if (right) Object.assign(combined[key], right);
          break;
        }
      }
}
/** @type {OnEnterError} */
function defaultOnError(left, right) {
  if (left)
    throw new Error(
      "Cannot close `" +
        left.type +
        "` (" +
        stringifyPosition({
          start: left.start,
          end: left.end,
        }) +
        "): a different token (`" +
        right.type +
        "`, " +
        stringifyPosition({
          start: right.start,
          end: right.end,
        }) +
        ") is open",
    );
  else
    throw new Error(
      "Cannot close document, a token (`" +
        right.type +
        "`, " +
        stringifyPosition({
          start: right.start,
          end: right.end,
        }) +
        ") is still open",
    );
}
//#endregion
//#region extensions/memory-wiki/src/markdown.ts
const WIKI_RELATED_START_MARKER = "<!-- openclaw:wiki:related:start -->";
const WIKI_RELATED_END_MARKER = "<!-- openclaw:wiki:related:end -->";
const WIKI_RAW_SOURCE_MARKER = "<!-- openclaw:wiki:raw-source -->";
const FRONTMATTER_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;
const OBSIDIAN_LINK_PATTERN = /\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g;
const MARKDOWN_LINK_PATTERN = /\[[^\]]+\]\(([^)]+)\)/g;
const RELATED_BLOCK_PATTERN$1 = new RegExp(
  `${WIKI_RELATED_START_MARKER}[\\s\\S]*?${WIKI_RELATED_END_MARKER}`,
  "g",
);
const MAX_WIKI_SEGMENT_BYTES = 240;
const MAX_WIKI_SAFE_WRITE_FILENAME_COMPONENT_BYTES =
  255 -
  Buffer.byteLength(".00000000-0000-4000-8000-000000000000.fallback.tmp") -
  Buffer.byteLength(".");
const WIKI_SEGMENT_HASH_BYTES = 12;
const WIKI_RESERVED_PAGE_STEMS = /* @__PURE__ */ new Set(["index"]);
const HUMAN_START_MARKER$1 = "<!-- openclaw:human:start -->";
const HUMAN_END_MARKER$1 = "<!-- openclaw:human:end -->";
function truncateUtf8CodePointSafe(value, maxBytes) {
  let result = "";
  let bytes = 0;
  for (const char of value) {
    const nextBytes = Buffer.byteLength(char);
    if (bytes + nextBytes > maxBytes) break;
    result += char;
    bytes += nextBytes;
  }
  return result;
}
function capWikiValueWithHash(raw, maxBytes, fallback) {
  if (Buffer.byteLength(raw) <= maxBytes) return raw;
  const suffix = createHash("sha1").update(raw).digest("hex").slice(0, WIKI_SEGMENT_HASH_BYTES);
  return `${truncateUtf8CodePointSafe(raw, maxBytes - Buffer.byteLength(`-${suffix}`)).replace(/-+$/g, "") || fallback}-${suffix}`;
}
function slugifyWikiSegment(raw) {
  const slug = normalizeLowercaseStringOrEmpty(raw)
    .replace(/[^\p{L}\p{N}\p{M}]+/gu, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (!slug) return "page";
  return capWikiValueWithHash(slug, MAX_WIKI_SEGMENT_BYTES, "page");
}
function slugifyWikiPageStem(raw) {
  const slug = slugifyWikiSegment(raw);
  if (!WIKI_RESERVED_PAGE_STEMS.has(slug)) return slug;
  return `${slug}-${createHash("sha1").update(slug).digest("hex").slice(0, WIKI_SEGMENT_HASH_BYTES)}`;
}
function createWikiPageFilename(stem, extension = ".md") {
  const normalizedExtension = extension.startsWith(".") ? extension : `.${extension}`;
  return `${capWikiValueWithHash(stem, Math.max(1, MAX_WIKI_SAFE_WRITE_FILENAME_COMPONENT_BYTES - Buffer.byteLength(normalizedExtension)), "page")}${normalizedExtension}`;
}
function parseWikiMarkdown(content) {
  const match = content.match(FRONTMATTER_PATTERN);
  if (!match)
    return {
      hasFrontmatter: false,
      frontmatter: {},
      body: content,
    };
  const frontmatter = match[1];
  if (frontmatter === void 0)
    return {
      hasFrontmatter: false,
      frontmatter: {},
      body: content,
    };
  const parsed = YAML.parse(frontmatter);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
    throw new TypeError("Wiki frontmatter must be a YAML mapping");
  return {
    hasFrontmatter: true,
    frontmatter: parsed,
    body: content.slice(match[0].length),
  };
}
function renderWikiMarkdown(params) {
  return `---\n${YAML.stringify(params.frontmatter).trimEnd()}\n---\n\n${params.body.trimStart()}`;
}
function extractTitleFromMarkdown(body) {
  return normalizeOptionalString(body.match(/^#\s+(.+?)\s*$/m)?.[1]);
}
function normalizeSourceIds(value) {
  return normalizeSingleOrTrimmedStringList(value);
}
function normalizeWikiClaimEvidence(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const record = value;
  const kind = normalizeOptionalString(record.kind);
  const sourceId = normalizeOptionalString(record.sourceId);
  const evidencePath = normalizeOptionalString(record.path);
  const lines = normalizeOptionalString(record.lines);
  const note = normalizeOptionalString(record.note);
  const updatedAt = normalizeOptionalString(record.updatedAt);
  const privacyTier = normalizeOptionalString(record.privacyTier);
  const weight =
    typeof record.weight === "number" && Number.isFinite(record.weight) ? record.weight : void 0;
  const confidence = normalizeOptionalNumber(record.confidence);
  if (
    !kind &&
    !sourceId &&
    !evidencePath &&
    !lines &&
    !note &&
    weight === void 0 &&
    confidence === void 0 &&
    !privacyTier &&
    !updatedAt
  )
    return null;
  return {
    ...(kind ? { kind } : {}),
    ...(sourceId ? { sourceId } : {}),
    ...(evidencePath ? { path: evidencePath } : {}),
    ...(lines ? { lines } : {}),
    ...(weight !== void 0 ? { weight } : {}),
    ...(confidence !== void 0 ? { confidence } : {}),
    ...(privacyTier ? { privacyTier } : {}),
    ...(note ? { note } : {}),
    ...(updatedAt ? { updatedAt } : {}),
  };
}
function normalizeWikiClaims(value) {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) return [];
    const record = entry;
    const text = normalizeOptionalString(record.text);
    if (!text) return [];
    const evidence = Array.isArray(record.evidence)
      ? record.evidence.flatMap((candidate) => {
          const normalized = normalizeWikiClaimEvidence(candidate);
          return normalized ? [normalized] : [];
        })
      : [];
    const confidence =
      typeof record.confidence === "number" && Number.isFinite(record.confidence)
        ? record.confidence
        : void 0;
    return [
      {
        ...(normalizeOptionalString(record.id) ? { id: normalizeOptionalString(record.id) } : {}),
        text,
        ...(normalizeOptionalString(record.status)
          ? { status: normalizeOptionalString(record.status) }
          : {}),
        ...(confidence !== void 0 ? { confidence } : {}),
        evidence,
        ...(normalizeOptionalString(record.updatedAt)
          ? { updatedAt: normalizeOptionalString(record.updatedAt) }
          : {}),
      },
    ];
  });
}
function normalizeOptionalNumber(value) {
  return asFiniteNumber(value);
}
function normalizeWikiPersonCard(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return;
  const record = value;
  const card = {
    ...(normalizeOptionalString(record.canonicalId)
      ? { canonicalId: normalizeOptionalString(record.canonicalId) }
      : {}),
    handles: normalizeSingleOrTrimmedStringList(record.handles),
    socials: normalizeSingleOrTrimmedStringList(record.socials),
    emails: normalizeSingleOrTrimmedStringList(record.emails ?? record.email),
    ...(normalizeOptionalString(record.timezone)
      ? { timezone: normalizeOptionalString(record.timezone) }
      : {}),
    ...(normalizeOptionalString(record.lane) ? { lane: normalizeOptionalString(record.lane) } : {}),
    askFor: normalizeSingleOrTrimmedStringList(record.askFor),
    avoidAskingFor: normalizeSingleOrTrimmedStringList(record.avoidAskingFor),
    bestUsedFor: normalizeSingleOrTrimmedStringList(record.bestUsedFor),
    notEnoughFor: normalizeSingleOrTrimmedStringList(record.notEnoughFor),
    ...(normalizeOptionalNumber(record.confidence) !== void 0
      ? { confidence: normalizeOptionalNumber(record.confidence) }
      : {}),
    ...(normalizeOptionalString(record.privacyTier)
      ? { privacyTier: normalizeOptionalString(record.privacyTier) }
      : {}),
    ...(normalizeOptionalString(record.lastRefreshedAt)
      ? { lastRefreshedAt: normalizeOptionalString(record.lastRefreshedAt) }
      : {}),
  };
  return Boolean(
    card.canonicalId || card.timezone || card.lane || card.privacyTier || card.lastRefreshedAt,
  ) ||
    typeof card.confidence === "number" ||
    card.handles.length > 0 ||
    card.socials.length > 0 ||
    card.emails.length > 0 ||
    card.askFor.length > 0 ||
    card.avoidAskingFor.length > 0 ||
    card.bestUsedFor.length > 0 ||
    card.notEnoughFor.length > 0
    ? card
    : void 0;
}
function normalizeWikiRelationships(value) {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) return [];
    const record = entry;
    const relationship = {
      ...(normalizeOptionalString(record.targetId)
        ? { targetId: normalizeOptionalString(record.targetId) }
        : {}),
      ...(normalizeOptionalString(record.targetPath)
        ? { targetPath: normalizeOptionalString(record.targetPath) }
        : {}),
      ...(normalizeOptionalString(record.targetTitle)
        ? { targetTitle: normalizeOptionalString(record.targetTitle) }
        : {}),
      ...(normalizeOptionalString(record.kind)
        ? { kind: normalizeOptionalString(record.kind) }
        : {}),
      ...(normalizeOptionalNumber(record.weight) !== void 0
        ? { weight: normalizeOptionalNumber(record.weight) }
        : {}),
      ...(normalizeOptionalNumber(record.confidence) !== void 0
        ? { confidence: normalizeOptionalNumber(record.confidence) }
        : {}),
      ...(normalizeOptionalString(record.evidenceKind)
        ? { evidenceKind: normalizeOptionalString(record.evidenceKind) }
        : {}),
      ...(normalizeOptionalString(record.privacyTier)
        ? { privacyTier: normalizeOptionalString(record.privacyTier) }
        : {}),
      ...(normalizeOptionalString(record.note)
        ? { note: normalizeOptionalString(record.note) }
        : {}),
      ...(normalizeOptionalString(record.updatedAt)
        ? { updatedAt: normalizeOptionalString(record.updatedAt) }
        : {}),
    };
    return Object.keys(relationship).length > 0 ? [relationship] : [];
  });
}
function normalizeMarkdownLinkTarget(sourceRelativePath, target) {
  return path.posix.normalize(path.posix.join(path.posix.dirname(sourceRelativePath), target));
}
function maskMarkdownCode(markdown) {
  const masked = markdown.split("");
  const visit = (node) => {
    if (node.type === "code" || node.type === "inlineCode") {
      const start = node.position?.start?.offset;
      const end = node.position?.end?.offset;
      if (start !== void 0 && end !== void 0) {
        for (let index = start; index < end; index++)
          if (masked[index] !== "\n" && masked[index] !== "\r") masked[index] = " ";
      }
      return;
    }
    for (const child of node.children ?? []) visit(child);
  };
  visit(fromMarkdown(markdown));
  return masked.join("");
}
function extractWikiLinks(markdown, sourceRelativePath) {
  const searchable = maskMarkdownCode(markdown.replace(RELATED_BLOCK_PATTERN$1, ""));
  const links = [];
  for (const match of searchable.matchAll(OBSIDIAN_LINK_PATTERN)) {
    const target = match[1]?.trim();
    if (target) links.push(target);
  }
  for (const match of searchable.matchAll(MARKDOWN_LINK_PATTERN)) {
    const rawTarget = match[1]?.trim();
    if (!rawTarget || rawTarget.startsWith("#") || /^[a-z]+:/i.test(rawTarget)) continue;
    const target = rawTarget.split("#")[0]?.split("?")[0]?.replace(/\\/g, "/").trim();
    if (target) links.push(normalizeMarkdownLinkTarget(sourceRelativePath, target));
  }
  return links;
}
function normalizeMarkdownLines(markdown) {
  return markdown
    .replace(/\r\n?/g, "\n")
    .trimStart()
    .split("\n")
    .map((line) => line.trimEnd());
}
function hasGeneratedWrapperLines(lines, patterns) {
  const firstWrapperLineIndex = lines.findIndex(
    (line) => line.trim().length > 0 && line.trim() !== "<!-- openclaw:wiki:raw-source -->",
  );
  if (firstWrapperLineIndex === -1 || !patterns[0]?.test(lines[firstWrapperLineIndex] ?? ""))
    return false;
  const remainingLines = lines
    .slice(firstWrapperLineIndex + 1)
    .filter(
      (line) => line.trim().length > 0 && line.trim() !== "<!-- openclaw:wiki:raw-source -->",
    );
  if (patterns[1] && !patterns[1].test(remainingLines[0] ?? "")) return false;
  let patternIndex = 2;
  for (const line of remainingLines.slice(1)) {
    const pattern = patterns[patternIndex];
    if (!pattern) return true;
    if (pattern.test(line)) patternIndex += 1;
  }
  return patternIndex === patterns.length;
}
function hasHumanNotesBlock(markdown) {
  return markdown.includes(HUMAN_START_MARKER$1) && markdown.includes(HUMAN_END_MARKER$1);
}
const SOURCE_CONTENT_HEADING = /(?:^|\r?\n)## Content\r?\n/u;
function afterSourceContentFence(page) {
  const heading = SOURCE_CONTENT_HEADING.exec(page);
  if (!heading) return 0;
  const fenceLineStart = heading.index + heading[0].length;
  const fence = /^`+/.exec(page.slice(fenceLineStart))?.[0];
  if (!fence) return fenceLineStart;
  const close = new RegExp(`\\r?\\n${fence}(?=\\r?\\n|$)`, "u").exec(
    page.slice(fenceLineStart + fence.length),
  );
  if (!close) return fenceLineStart;
  return fenceLineStart + fence.length + close.index + close[0].length;
}
function findNotesHumanBlock(page) {
  const searchFrom = afterSourceContentFence(page);
  const start = page.indexOf(HUMAN_START_MARKER$1, searchFrom);
  if (start === -1) return null;
  const endMarker = page.lastIndexOf(HUMAN_END_MARKER$1);
  if (endMarker < start) return null;
  return {
    start,
    end: endMarker + 27,
  };
}
function preserveHumanNotesBlock(rendered, existing) {
  const existingBlock = findNotesHumanBlock(existing);
  const renderedBlock = findNotesHumanBlock(rendered);
  if (!existingBlock || !renderedBlock) return rendered;
  return (
    rendered.slice(0, renderedBlock.start) +
    existing.slice(existingBlock.start, existingBlock.end) +
    rendered.slice(renderedBlock.end)
  );
}
function detectGeneratedSourceBody(markdown) {
  const lines = normalizeMarkdownLines(markdown);
  const normalized = lines.join("\n");
  if (
    hasGeneratedWrapperLines(lines, [
      /^# Memory Bridge(?:\s*\(|:)/u,
      /^## Bridge Source\s*$/u,
      /^## Content\s*$/u,
    ]) &&
    hasHumanNotesBlock(normalized)
  )
    return "bridge";
  if (
    hasGeneratedWrapperLines(lines, [
      /^# Unsafe Local Import:/u,
      /^## Unsafe Local Source\s*$/u,
      /^## Content\s*$/u,
    ]) &&
    hasHumanNotesBlock(normalized)
  )
    return "unsafe-local";
  if (
    hasGeneratedWrapperLines(lines, [
      /^#\s+\S/u,
      /^## Source\s*$/u,
      /^- Type: `local-file`\s*$/u,
      /^## Content\s*$/u,
    ]) &&
    hasHumanNotesBlock(normalized)
  )
    return "local-file";
  if (
    hasGeneratedWrapperLines(lines, [
      /^# ChatGPT Export:/u,
      /^## Source\s*$/u,
      /^- Conversation id: `[^`]+`\s*$/u,
      /^## Active Branch Transcript\s*$/u,
    ]) &&
    hasHumanNotesBlock(normalized)
  )
    return "chatgpt-export";
}
function detectUnmanagedRawSourceBody(markdown) {
  const trimBlankLines = (value) => value.replace(/^(?:[ \t]*\n)+/u, "");
  const normalized = trimBlankLines(markdown.replace(/\r\n?/g, "\n"));
  const withoutTitle = trimBlankLines(normalized.replace(/^#\s+.+?\s*\n/u, ""));
  return (
    normalized.startsWith("<!-- openclaw:wiki:raw-source -->") ||
    withoutTitle.startsWith("<!-- openclaw:wiki:raw-source -->")
  );
}
function hasWikiSourceFrontmatter(frontmatter) {
  return (
    normalizeOptionalString(frontmatter.pageType) !== void 0 ||
    normalizeOptionalString(frontmatter.sourceType) !== void 0 ||
    normalizeOptionalString(frontmatter.provenanceMode) !== void 0
  );
}
function isUnmanagedRawSourceSummary(page) {
  return (
    page.kind === "source" && page.unmanagedRawSourceBody === true && !page.generatedSourceBody
  );
}
function formatWikiLink(params) {
  const withoutExtension = params.relativePath.replace(/\.md$/i, "");
  if (params.renderMode === "obsidian") return `[[${withoutExtension}|${params.title}]]`;
  const linkTarget = params.sourceRelativeTo
    ? path.posix.relative(path.posix.dirname(params.sourceRelativeTo), params.relativePath)
    : params.relativePath;
  return `[${params.title}](${linkTarget})`;
}
function renderMarkdownFence(content, infoString = "text") {
  const fenceSize = Math.max(
    3,
    ...Array.from(content.matchAll(/`+/g), (match) => match[0].length + 1),
  );
  const fence = "`".repeat(fenceSize);
  return `${fence}${infoString}\n${content}\n${fence}`;
}
function inferWikiPageKind(relativePath) {
  const normalized = relativePath.split(path.sep).join("/");
  if (normalized.startsWith("entities/")) return "entity";
  if (normalized.startsWith("concepts/")) return "concept";
  if (normalized.startsWith("sources/")) return "source";
  if (normalized.startsWith("syntheses/")) return "synthesis";
  if (normalized.startsWith("reports/")) return "report";
  return null;
}
function scanWikiPageSummary(params) {
  const kind = inferWikiPageKind(params.relativePath);
  if (!kind) return { status: "ignored" };
  let parsed;
  try {
    parsed = parseWikiMarkdown(params.raw);
  } catch (error) {
    return {
      status: "invalid-frontmatter",
      error: {
        relativePath: params.relativePath.split(path.sep).join("/"),
        message: error instanceof Error ? error.message : String(error),
      },
    };
  }
  const title =
    (typeof parsed.frontmatter.title === "string" && parsed.frontmatter.title.trim()) ||
    extractTitleFromMarkdown(parsed.body) ||
    path.basename(params.relativePath, ".md");
  const generatedSourceBody = detectGeneratedSourceBody(parsed.body);
  const importedSourceBody =
    generatedSourceBody === "bridge" || generatedSourceBody === "unsafe-local"
      ? generatedSourceBody
      : void 0;
  const unmanagedRawSourceBody =
    !generatedSourceBody &&
    !hasWikiSourceFrontmatter(parsed.frontmatter) &&
    detectUnmanagedRawSourceBody(parsed.body);
  return {
    status: "valid",
    page: {
      absolutePath: params.absolutePath,
      relativePath: params.relativePath.split(path.sep).join("/"),
      kind,
      title,
      hasFrontmatter: parsed.hasFrontmatter,
      id: normalizeOptionalString(parsed.frontmatter.id),
      pageType: normalizeOptionalString(parsed.frontmatter.pageType),
      entityType: normalizeOptionalString(parsed.frontmatter.entityType),
      canonicalId: normalizeOptionalString(parsed.frontmatter.canonicalId),
      aliases: normalizeSingleOrTrimmedStringList(parsed.frontmatter.aliases),
      sourceIds: normalizeSourceIds(parsed.frontmatter.sourceIds),
      linkTargets: extractWikiLinks(params.raw, params.relativePath.split(path.sep).join("/")),
      claims: normalizeWikiClaims(parsed.frontmatter.claims),
      contradictions: normalizeSingleOrTrimmedStringList(parsed.frontmatter.contradictions),
      questions: normalizeSingleOrTrimmedStringList(parsed.frontmatter.questions),
      confidence:
        typeof parsed.frontmatter.confidence === "number" &&
        Number.isFinite(parsed.frontmatter.confidence)
          ? parsed.frontmatter.confidence
          : void 0,
      privacyTier: normalizeOptionalString(parsed.frontmatter.privacyTier),
      personCard: normalizeWikiPersonCard(parsed.frontmatter.personCard),
      relationships: normalizeWikiRelationships(parsed.frontmatter.relationships),
      bestUsedFor: normalizeSingleOrTrimmedStringList(parsed.frontmatter.bestUsedFor),
      notEnoughFor: normalizeSingleOrTrimmedStringList(parsed.frontmatter.notEnoughFor),
      sourceType: normalizeOptionalString(parsed.frontmatter.sourceType),
      provenanceMode: normalizeOptionalString(parsed.frontmatter.provenanceMode),
      ...(importedSourceBody ? { importedSourceBody } : {}),
      ...(generatedSourceBody ? { generatedSourceBody } : {}),
      ...(unmanagedRawSourceBody ? { unmanagedRawSourceBody } : {}),
      sourcePath: normalizeOptionalString(parsed.frontmatter.sourcePath),
      bridgeRelativePath: normalizeOptionalString(parsed.frontmatter.bridgeRelativePath),
      bridgeWorkspaceDir: normalizeOptionalString(parsed.frontmatter.bridgeWorkspaceDir),
      unsafeLocalConfiguredPath: normalizeOptionalString(
        parsed.frontmatter.unsafeLocalConfiguredPath,
      ),
      unsafeLocalRelativePath: normalizeOptionalString(parsed.frontmatter.unsafeLocalRelativePath),
      lastRefreshedAt: normalizeOptionalString(parsed.frontmatter.lastRefreshedAt),
      updatedAt: normalizeOptionalString(parsed.frontmatter.updatedAt),
    },
  };
}
function toWikiPageSummary(params) {
  const result = scanWikiPageSummary(params);
  return result.status === "valid" ? result.page : null;
}
//#endregion
//#region extensions/memory-wiki/src/mutation-coordinator.ts
const activeVaultMutations = new AsyncLocalStorage();
const vaultMutationQueue = new KeyedAsyncQueue();
const MAX_CACHED_VAULT_KEYS = 256;
const canonicalVaultKeys = /* @__PURE__ */ new Map();
function normalizeCanonicalVaultKey(vaultPath) {
  return process.platform === "win32" ? vaultPath.toLowerCase() : vaultPath;
}
async function resolveCanonicalVaultKey(resolvedPath) {
  const suffix = [];
  let candidate = resolvedPath;
  while (true)
    try {
      const existingPath = await fs$1.realpath(candidate);
      return normalizeCanonicalVaultKey(path.join(existingPath, ...suffix));
    } catch (error) {
      const code = error.code;
      const parent = path.dirname(candidate);
      if ((code !== "ENOENT" && code !== "ENOTDIR") || parent === candidate)
        return normalizeCanonicalVaultKey(resolvedPath);
      suffix.unshift(path.basename(candidate));
      candidate = parent;
    }
}
async function resolveMemoryWikiVaultMutationKey(vaultPath) {
  const resolvedPath = path.resolve(vaultPath);
  const cached = canonicalVaultKeys.get(resolvedPath);
  if (cached) return await cached;
  const canonical = resolveCanonicalVaultKey(resolvedPath);
  if (canonicalVaultKeys.size >= MAX_CACHED_VAULT_KEYS) {
    const oldest = canonicalVaultKeys.keys().next().value;
    if (oldest) canonicalVaultKeys.delete(oldest);
  }
  canonicalVaultKeys.set(resolvedPath, canonical);
  return await canonical;
}
/**
 * Keep coordinated vault read-modify-write transactions isolated from concurrent work in this process.
 * Nested compile calls re-enter; different agent vaults remain parallel.
 */
async function withMemoryWikiVaultMutation(vaultPath, mutation) {
  const key = await resolveMemoryWikiVaultMutationKey(vaultPath);
  const active = activeVaultMutations.getStore();
  if (active?.get(key)?.active) return await mutation();
  const lease = { active: true };
  const nextActive = new Map(active ?? []);
  nextActive.set(key, lease);
  return await vaultMutationQueue.enqueue(key, async () => {
    try {
      return await activeVaultMutations.run(nextActive, mutation);
    } finally {
      lease.active = false;
    }
  });
}
//#endregion
//#region extensions/memory-wiki/src/time.ts
function resolveMemoryWikiTimestamp(nowMs) {
  return (
    timestampMsToIsoString(nowMs) ??
    timestampMsToIsoString(Date.now()) ??
    /* @__PURE__ */ new Date().toISOString()
  );
}
//#endregion
//#region extensions/memory-wiki/src/vault.ts
const WIKI_VAULT_DIRECTORIES = [
  "entities",
  "concepts",
  "syntheses",
  "sources",
  "reports",
  "_attachments",
  "_views",
  ".openclaw-wiki",
  ".openclaw-wiki/cache",
];
function buildIndexMarkdown() {
  return withTrailingNewline(
    replaceManagedMarkdownBlock({
      original: "# Wiki Index\n",
      heading: "## Generated",
      startMarker: "<!-- openclaw:wiki:index:start -->",
      endMarker: "<!-- openclaw:wiki:index:end -->",
      body: "- No compiled pages yet.",
    }),
  );
}
function buildAgentsMarkdown() {
  return withTrailingNewline(`\
# Memory Wiki Agent Guide

- Treat generated blocks as plugin-owned.
- Preserve human notes outside managed markers.
- Prefer source-backed claims over wiki-to-wiki citation loops.
- Prefer structured \`claims\` with evidence over burying key beliefs only in prose.
- Use \`.openclaw-wiki/cache/agent-digest.json\` and \`claims.jsonl\` for machine reads; markdown pages are the human view.
`);
}
function buildWikiOverviewMarkdown(config) {
  return withTrailingNewline(`\
# Memory Wiki

This vault is maintained by the OpenClaw memory-wiki plugin.

- Vault mode: \`${config.vaultMode}\`
- Render mode: \`${config.vault.renderMode}\`
- Search corpus default: \`${config.search.corpus}\`

## Architecture
- Raw sources remain the evidence layer.
- To keep unmanaged raw Markdown in \`sources/\`, add \`${WIKI_RAW_SOURCE_MARKER}\` near the top of the page.
- Wiki pages are the human-readable synthesis layer.
- \`.openclaw-wiki/cache/agent-digest.json\` is the agent-facing compiled digest.

## Notes
<!-- openclaw:human:start -->
<!-- openclaw:human:end -->
`);
}
async function writeFileIfMissing(rootDir, relativePath, content, createdFiles) {
  const root$7 = await root(rootDir);
  try {
    await root$7.create(relativePath, content);
  } catch (err) {
    if (err instanceof FsSafeError && err.code === "already-exists") return;
    throw err;
  }
  createdFiles.push(path.join(rootDir, relativePath));
}
async function initializeMemoryWikiVault(config, options) {
  const rootDir = config.vault.path;
  const createdDirectories = [];
  const createdFiles = [];
  if (!(await pathExists(rootDir))) createdDirectories.push(rootDir);
  await fs$1.mkdir(rootDir, { recursive: true });
  for (const relativeDir of WIKI_VAULT_DIRECTORIES) {
    const fullPath = path.join(rootDir, relativeDir);
    if (!(await pathExists(fullPath))) createdDirectories.push(fullPath);
    await fs$1.mkdir(fullPath, { recursive: true });
  }
  await writeFileIfMissing(rootDir, "AGENTS.md", buildAgentsMarkdown(), createdFiles);
  await writeFileIfMissing(rootDir, "WIKI.md", buildWikiOverviewMarkdown(config), createdFiles);
  await writeFileIfMissing(rootDir, "index.md", buildIndexMarkdown(), createdFiles);
  await writeFileIfMissing(
    rootDir,
    "inbox.md",
    withTrailingNewline("# Inbox\n\nDrop raw ideas, questions, and source links here.\n"),
    createdFiles,
  );
  await writeFileIfMissing(rootDir, ".openclaw-wiki/log.jsonl", "", createdFiles);
  if (createdDirectories.length > 0 || createdFiles.length > 0)
    await appendMemoryWikiLog(rootDir, {
      type: "init",
      timestamp: resolveMemoryWikiTimestamp(options?.nowMs),
      details: {
        createdDirectories: createdDirectories.map((dir) => path.relative(rootDir, dir) || "."),
        createdFiles: createdFiles.map((file) => path.relative(rootDir, file)),
      },
    });
  return {
    rootDir,
    created: createdDirectories.length > 0 || createdFiles.length > 0,
    createdDirectories,
    createdFiles,
  };
}
//#endregion
//#region extensions/memory-wiki/src/compile.ts
const COMPILE_PAGE_GROUPS = [
  {
    kind: "source",
    dir: "sources",
    heading: "Sources",
  },
  {
    kind: "entity",
    dir: "entities",
    heading: "Entities",
  },
  {
    kind: "concept",
    dir: "concepts",
    heading: "Concepts",
  },
  {
    kind: "synthesis",
    dir: "syntheses",
    heading: "Syntheses",
  },
  {
    kind: "report",
    dir: "reports",
    heading: "Reports",
  },
];
const AGENT_DIGEST_PATH$1 = ".openclaw-wiki/cache/agent-digest.json";
const CLAIMS_DIGEST_PATH$1 = ".openclaw-wiki/cache/claims.jsonl";
const READ_PAGE_SUMMARIES_CONCURRENCY = 16;
const MAX_RELATED_PAGES_PER_SECTION = 12;
const MAX_SHARED_SOURCE_FANOUT = 24;
const DASHBOARD_PAGES = [
  {
    id: "report.open-questions",
    title: "Open Questions",
    relativePath: "reports/open-questions.md",
    buildBody: ({ config, pages, sourceRelativeTo }) => {
      const matches = pages.filter((page) => page.questions.length > 0);
      if (matches.length === 0) return "- No open questions right now.";
      return [
        `- Pages with open questions: ${matches.length}`,
        "",
        ...matches.map(
          (page) =>
            `- ${formatWikiLink({
              renderMode: config.vault.renderMode,
              relativePath: page.relativePath,
              sourceRelativeTo,
              title: page.title,
            })}: ${page.questions.join(" | ")}`,
        ),
      ].join("\n");
    },
  },
  {
    id: "report.contradictions",
    title: "Contradictions",
    relativePath: "reports/contradictions.md",
    buildBody: ({ config, pages, now, sourceRelativeTo }) => {
      const pageClusters = buildPageContradictionClusters(pages);
      const claimClusters = buildClaimContradictionClusters({
        pages,
        now,
      });
      if (pageClusters.length === 0 && claimClusters.length === 0)
        return "- No contradictions flagged right now.";
      const lines = [
        `- Contradiction note clusters: ${pageClusters.length}`,
        `- Competing claim clusters: ${claimClusters.length}`,
      ];
      if (pageClusters.length > 0) {
        lines.push("", "### Page Notes");
        for (const cluster of pageClusters)
          lines.push(formatPageContradictionClusterLine(config, cluster, sourceRelativeTo));
      }
      if (claimClusters.length > 0) {
        lines.push("", "### Claim Clusters");
        for (const cluster of claimClusters)
          lines.push(formatClaimContradictionClusterLine(config, cluster, sourceRelativeTo));
      }
      return lines.join("\n");
    },
  },
  {
    id: "report.low-confidence",
    title: "Low Confidence",
    relativePath: "reports/low-confidence.md",
    buildBody: ({ config, pages, now, sourceRelativeTo }) => {
      const pageMatches = pages
        .filter((page) => typeof page.confidence === "number" && page.confidence < 0.5)
        .toSorted((left, right) => (left.confidence ?? 1) - (right.confidence ?? 1));
      const claimMatches = collectWikiClaimHealth(pages, now)
        .filter((claim) => typeof claim.confidence === "number" && claim.confidence < 0.5)
        .toSorted((left, right) => (left.confidence ?? 1) - (right.confidence ?? 1));
      if (pageMatches.length === 0 && claimMatches.length === 0)
        return "- No low-confidence pages or claims right now.";
      const lines = [
        `- Low-confidence pages: ${pageMatches.length}`,
        `- Low-confidence claims: ${claimMatches.length}`,
      ];
      if (pageMatches.length > 0) {
        lines.push("", "### Pages");
        for (const page of pageMatches)
          lines.push(
            `- ${formatPageLink(config, page, sourceRelativeTo)}: confidence ${(page.confidence ?? 0).toFixed(2)}`,
          );
      }
      if (claimMatches.length > 0) {
        lines.push("", "### Claims");
        for (const claim of claimMatches)
          lines.push(`- ${formatClaimHealthLine(config, claim, sourceRelativeTo)}`);
      }
      return lines.join("\n");
    },
  },
  {
    id: "report.claim-health",
    title: "Claim Health",
    relativePath: "reports/claim-health.md",
    buildBody: ({ config, pages, now, sourceRelativeTo }) => {
      const claimHealth = collectWikiClaimHealth(pages, now);
      const missingEvidence = claimHealth.filter((claim) => claim.missingEvidence);
      const contestedClaims = claimHealth.filter((claim) => isClaimHealthContested(claim));
      const staleClaims = claimHealth.filter(
        (claim) => claim.freshness.level === "stale" || claim.freshness.level === "unknown",
      );
      if (missingEvidence.length === 0 && contestedClaims.length === 0 && staleClaims.length === 0)
        return "- No claim health issues right now.";
      const lines = [
        `- Claims missing evidence: ${missingEvidence.length}`,
        `- Contested claims: ${contestedClaims.length}`,
        `- Stale or unknown claims: ${staleClaims.length}`,
      ];
      if (missingEvidence.length > 0) {
        lines.push("", "### Missing Evidence");
        for (const claim of missingEvidence)
          lines.push(`- ${formatClaimHealthLine(config, claim, sourceRelativeTo)}`);
      }
      if (contestedClaims.length > 0) {
        lines.push("", "### Contested Claims");
        for (const claim of contestedClaims)
          lines.push(`- ${formatClaimHealthLine(config, claim, sourceRelativeTo)}`);
      }
      if (staleClaims.length > 0) {
        lines.push("", "### Stale Claims");
        for (const claim of staleClaims)
          lines.push(`- ${formatClaimHealthLine(config, claim, sourceRelativeTo)}`);
      }
      return lines.join("\n");
    },
  },
  {
    id: "report.stale-pages",
    title: "Stale Pages",
    relativePath: "reports/stale-pages.md",
    buildBody: ({ config, managedImportedSourcePagePaths, pages, now, sourceRelativeTo }) => {
      const matches = pages
        .filter(
          (page) =>
            page.kind !== "report" &&
            page.kind !== "concept" &&
            page.kind !== "synthesis" &&
            !(
              isUnmanagedRawSourceSummary(page) &&
              !managedImportedSourcePagePaths.has(page.relativePath)
            ),
        )
        .flatMap((page) => {
          const freshness = assessPageFreshness(page, now);
          if (freshness.level === "fresh") return [];
          return [
            {
              page,
              freshness,
            },
          ];
        })
        .toSorted((left, right) => left.page.title.localeCompare(right.page.title));
      if (matches.length === 0) return `- No aging or stale pages older than 30 days.`;
      return [
        `- Stale pages: ${matches.length}`,
        "",
        ...matches.map(
          ({ page, freshness }) =>
            `- ${formatPageLink(config, page, sourceRelativeTo)}: ${formatFreshnessLabel(freshness)}`,
        ),
      ].join("\n");
    },
  },
  {
    id: "report.person-agent-directory",
    title: "Person Agent Directory",
    relativePath: "reports/person-agent-directory.md",
    buildBody: ({ config, pages, now, sourceRelativeTo }) => {
      const matches = pages
        .filter((page) => page.kind !== "report" && isPersonLikePage(page))
        .toSorted((left, right) => left.title.localeCompare(right.title));
      if (matches.length === 0) return "- No person-like entity pages with agent cards yet.";
      const lines = [`- People with routing metadata: ${matches.length}`];
      for (const page of matches) {
        const freshness = assessPageFreshness(page, now);
        lines.push(`- ${formatPersonDirectoryLine(config, page, freshness, sourceRelativeTo)}`);
      }
      return lines.join("\n");
    },
  },
  {
    id: "report.relationship-graph",
    title: "Relationship Graph",
    relativePath: "reports/relationship-graph.md",
    buildBody: ({ config, pages, sourceRelativeTo }) => {
      const relationships = pages
        .flatMap((page) =>
          page.relationships.map((relationship) => ({
            page,
            relationship,
          })),
        )
        .toSorted((left, right) => {
          const leftTitle = left.relationship.targetTitle ?? left.relationship.targetId ?? "";
          const rightTitle = right.relationship.targetTitle ?? right.relationship.targetId ?? "";
          return `${left.page.title} ${leftTitle}`.localeCompare(
            `${right.page.title} ${rightTitle}`,
          );
        });
      if (relationships.length === 0) return "- No structured relationships yet.";
      return [
        `- Structured relationships: ${relationships.length}`,
        "",
        ...relationships.map(
          ({ page, relationship }) =>
            `- ${formatRelationshipLine(config, page, relationship, sourceRelativeTo)}`,
        ),
      ].join("\n");
    },
  },
  {
    id: "report.provenance-coverage",
    title: "Provenance Coverage",
    relativePath: "reports/provenance-coverage.md",
    buildBody: ({ config, pages, sourceRelativeTo }) => {
      const evidenceEntries = pages.flatMap((page) =>
        page.claims.flatMap((claim) =>
          claim.evidence.map((evidence) => ({
            page,
            claim,
            evidence,
          })),
        ),
      );
      const missingEvidence = pages.flatMap((page) =>
        page.claims
          .filter((claim) => claim.evidence.length === 0)
          .map((claim) => ({
            page,
            claim,
          })),
      );
      if (evidenceEntries.length === 0 && missingEvidence.length === 0)
        return "- No structured claims with provenance coverage yet.";
      const kindCounts = countBy(
        evidenceEntries.map(({ evidence }) => evidence.kind ?? "unspecified"),
      );
      const sourceCounts = countBy(
        evidenceEntries.map(({ evidence }) => evidence.sourceId ?? evidence.path ?? "inline"),
      );
      const lines = [
        `- Evidence entries: ${evidenceEntries.length}`,
        `- Claims missing evidence: ${missingEvidence.length}`,
        "",
        "### Evidence Classes",
        ...formatCountLines(kindCounts),
        "",
        "### Top Evidence Sources",
        ...formatCountLines(sourceCounts).slice(0, 20),
      ];
      if (missingEvidence.length > 0) {
        lines.push("", "### Missing Evidence");
        for (const { page, claim } of missingEvidence)
          lines.push(
            `- ${formatPageLink(config, page, sourceRelativeTo)}: ${formatClaimIdentityForPage(claim)}`,
          );
      }
      return lines.join("\n");
    },
  },
  {
    id: "report.privacy-review",
    title: "Privacy Review",
    relativePath: "reports/privacy-review.md",
    buildBody: ({ config, pages, sourceRelativeTo }) => {
      const entries = collectPrivacyReviewEntries(config, pages, sourceRelativeTo);
      if (entries.length === 0) return "- No non-public privacy tiers flagged right now.";
      return [`- Privacy review entries: ${entries.length}`, "", ...entries].join("\n");
    },
  },
];
async function collectMarkdownFiles(rootDir, relativeDir) {
  const dirPath = path.join(rootDir, relativeDir);
  return (
    await fs$1
      .readdir(dirPath, {
        withFileTypes: true,
        recursive: true,
      })
      .catch(() => [])
  )
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => {
      const absPath = path.join(entry.parentPath ?? dirPath, entry.name);
      return path.relative(rootDir, absPath).split(path.sep).join("/");
    })
    .filter((relativePath) => path.basename(relativePath) !== "index.md")
    .toSorted((left, right) => left.localeCompare(right));
}
async function readPageSummaries(rootDir) {
  const readResult = await runTasksWithConcurrency({
    tasks: (
      await Promise.all(
        COMPILE_PAGE_GROUPS.map((group) => collectMarkdownFiles(rootDir, group.dir)),
      )
    )
      .flat()
      .map((relativePath) => async () => {
        const absolutePath = path.join(rootDir, relativePath);
        return scanWikiPageSummary({
          absolutePath,
          relativePath,
          raw: await retryTransientMemoryRead(
            () => fs$1.readFile(absolutePath, "utf8"),
            `read wiki page ${absolutePath}`,
          ),
        });
      }),
    limit: READ_PAGE_SUMMARIES_CONCURRENCY,
    errorMode: "stop",
  });
  if (readResult.hasError) throw readResult.firstError;
  return {
    pages: readResult.results
      .flatMap((result) => (result.status === "valid" ? [result.page] : []))
      .toSorted((left, right) => left.title.localeCompare(right.title)),
    frontmatterErrors: readResult.results.flatMap((result) =>
      result.status === "invalid-frontmatter" ? [result.error] : [],
    ),
  };
}
function buildPageCounts(pages) {
  return {
    entity: pages.filter((page) => page.kind === "entity").length,
    concept: pages.filter((page) => page.kind === "concept").length,
    source: pages.filter((page) => page.kind === "source").length,
    synthesis: pages.filter((page) => page.kind === "synthesis").length,
    report: pages.filter((page) => page.kind === "report").length,
  };
}
function formatPageLink(config, page, sourceRelativeTo) {
  return formatWikiLink({
    renderMode: config.vault.renderMode,
    relativePath: page.relativePath,
    sourceRelativeTo,
    title: page.title,
  });
}
function formatFreshnessLabel(freshness) {
  switch (freshness.level) {
    case "fresh":
      return `fresh (${freshness.lastTouchedAt ?? "recent"})`;
    case "aging":
      return `aging (${freshness.lastTouchedAt ?? "unknown"})`;
    case "stale":
      return `stale (${freshness.lastTouchedAt ?? "unknown"})`;
    case "unknown":
      return freshness.reason;
  }
  throw new Error("Unsupported wiki freshness level");
}
function formatListPreview(values, maxItems = 3) {
  if (values.length === 0) return null;
  const shown = values.slice(0, maxItems).join(", ");
  return values.length > maxItems ? `${shown}, +${values.length - maxItems}` : shown;
}
function formatMaybeDetail(label, value) {
  return value ? `${label} ${value}` : null;
}
function isPersonLikePage(page) {
  const entityType = normalizeLowercaseStringOrEmpty(page.entityType);
  const pageType = normalizeLowercaseStringOrEmpty(page.pageType);
  return (
    Boolean(page.personCard) ||
    entityType === "person" ||
    entityType === "maintainer" ||
    pageType === "person" ||
    pageType === "maintainer"
  );
}
function formatPersonDirectoryLine(config, page, freshness, sourceRelativeTo) {
  const card = page.personCard;
  const details = [
    formatMaybeDetail("id", page.canonicalId ?? card?.canonicalId ?? page.id),
    formatMaybeDetail("aliases", formatListPreview(page.aliases)),
    formatMaybeDetail("handles", formatListPreview(card?.handles ?? [])),
    formatMaybeDetail("lane", card?.lane),
    formatMaybeDetail("ask", formatListPreview(card?.askFor ?? [])),
    formatMaybeDetail(
      "best",
      formatListPreview([...page.bestUsedFor, ...(card?.bestUsedFor ?? [])]),
    ),
    formatMaybeDetail("privacy", page.privacyTier ?? card?.privacyTier),
    formatMaybeDetail("refreshed", page.lastRefreshedAt ?? card?.lastRefreshedAt),
    formatMaybeDetail("freshness", formatFreshnessLabel(freshness)),
  ].filter(Boolean);
  return `${formatPageLink(config, page, sourceRelativeTo)}${details.length > 0 ? `: ${details.join("; ")}` : ""}`;
}
function formatRelationshipTarget(config, relationship, sourceRelativeTo) {
  if (relationship.targetPath && relationship.targetTitle)
    return formatWikiLink({
      renderMode: config.vault.renderMode,
      relativePath: relationship.targetPath,
      sourceRelativeTo,
      title: relationship.targetTitle,
    });
  return relationship.targetTitle ?? relationship.targetId ?? relationship.targetPath ?? "unknown";
}
function formatRelationshipLine(config, page, relationship, sourceRelativeTo) {
  const details = [
    relationship.kind ?? "related",
    typeof relationship.weight === "number" ? `weight ${relationship.weight.toFixed(2)}` : null,
    typeof relationship.confidence === "number"
      ? `confidence ${relationship.confidence.toFixed(2)}`
      : null,
    relationship.evidenceKind ? `evidence ${relationship.evidenceKind}` : null,
    relationship.privacyTier ? `privacy ${relationship.privacyTier}` : null,
    relationship.note,
  ].filter(Boolean);
  return `${formatPageLink(config, page, sourceRelativeTo)} -> ${formatRelationshipTarget(config, relationship, sourceRelativeTo)}${details.length > 0 ? ` (${details.join(", ")})` : ""}`;
}
function countBy(values) {
  const counts = /* @__PURE__ */ new Map();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return counts;
}
function formatCountLines(counts) {
  const lines = [...counts]
    .toSorted((left, right) => {
      if (left[1] !== right[1]) return right[1] - left[1];
      return left[0].localeCompare(right[0]);
    })
    .map(([label, count]) => `- ${label}: ${count}`);
  return lines.length > 0 ? lines : ["- None"];
}
function formatClaimIdentityForPage(claim) {
  return claim.id ? `\`${claim.id}\`: ${claim.text}` : claim.text;
}
function isReviewablePrivacyTier(value) {
  const tier = normalizeLowercaseStringOrEmpty(value);
  return tier !== "" && tier !== "public";
}
function formatEvidencePrivacyDetails(evidence) {
  return [
    evidence.kind ? `kind ${evidence.kind}` : null,
    evidence.sourceId ? `source ${evidence.sourceId}` : null,
    evidence.path ? `path ${evidence.path}` : null,
    evidence.lines ? `lines ${evidence.lines}` : null,
  ]
    .filter(Boolean)
    .join(", ");
}
function collectPrivacyReviewEntries(config, pages, sourceRelativeTo) {
  const entries = [];
  for (const page of pages) {
    if (isReviewablePrivacyTier(page.privacyTier))
      entries.push(
        `- ${formatPageLink(config, page, sourceRelativeTo)}: page privacy ${page.privacyTier}`,
      );
    if (isReviewablePrivacyTier(page.personCard?.privacyTier))
      entries.push(
        `- ${formatPageLink(config, page, sourceRelativeTo)}: person card privacy ${page.personCard?.privacyTier}`,
      );
    for (const relationship of page.relationships)
      if (isReviewablePrivacyTier(relationship.privacyTier))
        entries.push(
          `- ${formatPageLink(config, page, sourceRelativeTo)}: relationship privacy ${relationship.privacyTier} -> ${formatRelationshipTarget(config, relationship, sourceRelativeTo)}`,
        );
    for (const claim of page.claims)
      for (const evidence of claim.evidence) {
        if (!isReviewablePrivacyTier(evidence.privacyTier)) continue;
        const detail = formatEvidencePrivacyDetails(evidence);
        entries.push(
          `- ${formatPageLink(config, page, sourceRelativeTo)}: evidence privacy ${evidence.privacyTier} on ${formatClaimIdentityForPage(claim)}${detail ? ` (${detail})` : ""}`,
        );
      }
  }
  return entries;
}
function formatClaimIdentity(claim) {
  return claim.claimId ? `\`${claim.claimId}\`: ${claim.text}` : claim.text;
}
function isClaimHealthContested(claim) {
  return isClaimContestedStatus(claim.status);
}
function formatClaimHealthLine(config, claim, sourceRelativeTo) {
  const details = [
    `status ${claim.status}`,
    typeof claim.confidence === "number" ? `confidence ${claim.confidence.toFixed(2)}` : null,
    claim.missingEvidence ? "missing evidence" : `${claim.evidenceCount} evidence`,
    formatFreshnessLabel(claim.freshness),
  ].filter(Boolean);
  return `${formatWikiLink({
    renderMode: config.vault.renderMode,
    relativePath: claim.pagePath,
    sourceRelativeTo,
    title: claim.pageTitle,
  })}: ${formatClaimIdentity(claim)} (${details.join(", ")})`;
}
function formatPageContradictionClusterLine(config, cluster, sourceRelativeTo) {
  const pageRefs = cluster.entries.map((entry) =>
    formatWikiLink({
      renderMode: config.vault.renderMode,
      relativePath: entry.pagePath,
      sourceRelativeTo,
      title: entry.pageTitle,
    }),
  );
  return `- ${cluster.label}: ${pageRefs.join(" | ")}`;
}
function formatClaimContradictionClusterLine(config, cluster, sourceRelativeTo) {
  const entries = cluster.entries.map(
    (entry) =>
      `${formatWikiLink({
        renderMode: config.vault.renderMode,
        relativePath: entry.pagePath,
        sourceRelativeTo,
        title: entry.pageTitle,
      })} -> ${formatClaimIdentity(entry)} (${entry.status}, ${formatFreshnessLabel(entry.freshness)})`,
  );
  return `- \`${cluster.label}\`: ${entries.join(" | ")}`;
}
function normalizeComparableTarget(value) {
  return normalizeLowercaseStringOrEmpty(
    value
      .trim()
      .replace(/\\/g, "/")
      .replace(/\.md$/i, "")
      .replace(/^\.\/+/, "")
      .replace(/\/+$/, ""),
  );
}
function uniquePages(pages) {
  const seen = /* @__PURE__ */ new Set();
  const unique = [];
  for (const page of pages) {
    const key = page.id ?? page.relativePath;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(page);
  }
  return unique;
}
function buildPageLookupKeys(page) {
  const keys = /* @__PURE__ */ new Set();
  keys.add(normalizeComparableTarget(page.relativePath));
  keys.add(normalizeComparableTarget(page.relativePath.replace(/\.md$/i, "")));
  keys.add(normalizeComparableTarget(page.title));
  if (page.id) keys.add(normalizeComparableTarget(page.id));
  return keys;
}
function renderWikiPageLinks(params) {
  return params.pages
    .map(
      (page) =>
        `- ${formatWikiLink({
          renderMode: params.config.vault.renderMode,
          relativePath: page.relativePath,
          sourceRelativeTo: params.sourceRelativeTo,
          title: page.title,
        })}`,
    )
    .join("\n");
}
function sharedSourceFanout(page, allPages) {
  const sourceIds = new Set(page.sourceIds);
  const counts = /* @__PURE__ */ new Map();
  for (const candidate of allPages) {
    if (candidate.relativePath === page.relativePath) continue;
    for (const sourceId of candidate.sourceIds) {
      if (!sourceIds.has(sourceId)) continue;
      counts.set(sourceId, (counts.get(sourceId) ?? 0) + 1);
    }
  }
  return counts;
}
function buildRelatedBlockBody(params) {
  const candidatePages = params.allPages.filter((candidate) => candidate.kind !== "report");
  const sourceFanout = sharedSourceFanout(params.page, candidatePages);
  const pagesById = new Map(
    candidatePages.flatMap((candidate) => (candidate.id ? [[candidate.id, candidate]] : [])),
  );
  const sourcePages = uniquePages(
    params.page.sourceIds.flatMap((sourceId) => {
      const page = pagesById.get(sourceId);
      return page ? [page] : [];
    }),
  );
  const backlinkKeys = buildPageLookupKeys(params.page);
  const backlinks = uniquePages(
    candidatePages.filter((candidate) => {
      if (candidate.relativePath === params.page.relativePath) return false;
      if (candidate.sourceIds.includes(params.page.id ?? "")) return true;
      return candidate.linkTargets.some((target) =>
        backlinkKeys.has(normalizeComparableTarget(target)),
      );
    }),
  );
  const backlinkPages =
    backlinks.length <= MAX_SHARED_SOURCE_FANOUT
      ? backlinks.slice(0, MAX_RELATED_PAGES_PER_SECTION)
      : [];
  const relatedPages = uniquePages(
    candidatePages.filter((candidate) => {
      if (candidate.relativePath === params.page.relativePath) return false;
      if (sourcePages.some((sourcePage) => sourcePage.relativePath === candidate.relativePath))
        return false;
      if (backlinkPages.some((backlink) => backlink.relativePath === candidate.relativePath))
        return false;
      if (params.page.sourceIds.length === 0 || candidate.sourceIds.length === 0) return false;
      return params.page.sourceIds.some(
        (sourceId) =>
          candidate.sourceIds.includes(sourceId) &&
          (sourceFanout.get(sourceId) ?? 0) <= MAX_SHARED_SOURCE_FANOUT,
      );
    }),
  ).slice(0, MAX_RELATED_PAGES_PER_SECTION);
  const sections = [];
  if (sourcePages.length > 0)
    sections.push(
      "### Sources",
      renderWikiPageLinks({
        config: params.config,
        pages: sourcePages,
        sourceRelativeTo: params.page.relativePath,
      }),
    );
  if (backlinkPages.length > 0)
    sections.push(
      "### Referenced By",
      renderWikiPageLinks({
        config: params.config,
        pages: backlinkPages,
        sourceRelativeTo: params.page.relativePath,
      }),
    );
  if (relatedPages.length > 0)
    sections.push(
      "### Related Pages",
      renderWikiPageLinks({
        config: params.config,
        pages: relatedPages,
        sourceRelativeTo: params.page.relativePath,
      }),
    );
  if (sections.length === 0) return "- No related pages yet.";
  return sections.join("\n\n");
}
async function refreshPageRelatedBlocks(params) {
  if (!params.config.render.createBacklinks) return [];
  const root$3 = await root(params.config.vault.path);
  const updatedFiles = [];
  for (const page of params.pages) {
    if (page.kind === "report") continue;
    const original = await root$3.readText(page.relativePath);
    if (original.trim().length === 0) continue;
    const updated = withTrailingNewline(
      replaceManagedMarkdownBlock({
        original,
        heading: "## Related",
        startMarker: WIKI_RELATED_START_MARKER,
        endMarker: WIKI_RELATED_END_MARKER,
        body: buildRelatedBlockBody({
          config: params.config,
          page,
          allPages: params.pages,
        }),
      }),
    );
    if (updated === original) continue;
    await root$3.write(page.relativePath, updated);
    updatedFiles.push(page.absolutePath);
  }
  return updatedFiles;
}
function renderSectionList(params) {
  if (params.pages.length === 0) return `- ${params.emptyText}`;
  return params.pages
    .map(
      (page) =>
        `- ${formatWikiLink({
          renderMode: params.config.vault.renderMode,
          relativePath: page.relativePath,
          sourceRelativeTo: params.sourceRelativeTo,
          title: page.title,
        })}`,
    )
    .join("\n");
}
async function writeManagedMarkdownFile(params) {
  const root$4 = await root(params.rootDir);
  const original = await root$4.readText(params.relativePath).catch(() => `# ${params.title}\n`);
  parseWikiMarkdown(original);
  const rendered = withTrailingNewline(
    replaceManagedMarkdownBlock({
      original,
      heading: "## Generated",
      startMarker: params.startMarker,
      endMarker: params.endMarker,
      body: params.body,
    }),
  );
  if (rendered === original) return false;
  await root$4.write(params.relativePath, rendered);
  return true;
}
async function writeDashboardPage(params) {
  const root$5 = await root(params.rootDir);
  const original = await root$5.readText(params.definition.relativePath).catch(() =>
    renderWikiMarkdown({
      frontmatter: {
        pageType: "report",
        id: params.definition.id,
        title: params.definition.title,
        status: "active",
      },
      body: `# ${params.definition.title}\n`,
    }),
  );
  const parsed = parseWikiMarkdown(original);
  const updatedBody = replaceManagedMarkdownBlock({
    original: parsed.body.trim().length > 0 ? parsed.body : `# ${params.definition.title}\n`,
    heading: "## Generated",
    startMarker: `<!-- openclaw:wiki:${path.basename(params.definition.relativePath, ".md")}:start -->`,
    endMarker: `<!-- openclaw:wiki:${path.basename(params.definition.relativePath, ".md")}:end -->`,
    body: params.definition.buildBody({
      config: params.config,
      managedImportedSourcePagePaths: params.managedImportedSourcePagePaths,
      pages: params.pages,
      now: params.now,
      sourceRelativeTo: params.definition.relativePath,
    }),
  });
  const preservedUpdatedAt =
    typeof parsed.frontmatter.updatedAt === "string" && parsed.frontmatter.updatedAt.trim()
      ? parsed.frontmatter.updatedAt
      : params.now.toISOString();
  if (
    withTrailingNewline(
      renderWikiMarkdown({
        frontmatter: {
          ...parsed.frontmatter,
          pageType: "report",
          id: params.definition.id,
          title: params.definition.title,
          status:
            typeof parsed.frontmatter.status === "string" && parsed.frontmatter.status.trim()
              ? parsed.frontmatter.status
              : "active",
          updatedAt: preservedUpdatedAt,
        },
        body: updatedBody,
      }),
    ) === original
  )
    return false;
  const rendered = withTrailingNewline(
    renderWikiMarkdown({
      frontmatter: {
        ...parsed.frontmatter,
        pageType: "report",
        id: params.definition.id,
        title: params.definition.title,
        status:
          typeof parsed.frontmatter.status === "string" && parsed.frontmatter.status.trim()
            ? parsed.frontmatter.status
            : "active",
        updatedAt: params.now.toISOString(),
      },
      body: updatedBody,
    }),
  );
  await root$5.write(params.definition.relativePath, rendered);
  return true;
}
async function refreshDashboardPages(params) {
  if (!params.config.render.createDashboards) return [];
  const now = /* @__PURE__ */ new Date();
  const updatedFiles = [];
  for (const definition of DASHBOARD_PAGES)
    if (
      await writeDashboardPage({
        config: params.config,
        rootDir: params.rootDir,
        definition,
        managedImportedSourcePagePaths: params.managedImportedSourcePagePaths,
        pages: params.pages,
        now,
      })
    )
      updatedFiles.push(path.join(params.rootDir, definition.relativePath));
  return updatedFiles;
}
function buildRootIndexBody(params) {
  const claimCount = params.pages.reduce((total, page) => total + page.claims.length, 0);
  const lines = [
    `- Render mode: \`${params.config.vault.renderMode}\``,
    `- Total pages: ${params.pages.length}`,
    `- Claims: ${claimCount}`,
    `- Sources: ${params.counts.source}`,
    `- Entities: ${params.counts.entity}`,
    `- Concepts: ${params.counts.concept}`,
    `- Syntheses: ${params.counts.synthesis}`,
    `- Reports: ${params.counts.report}`,
  ];
  for (const group of COMPILE_PAGE_GROUPS) {
    lines.push("", `### ${group.heading}`);
    lines.push(
      renderSectionList({
        config: params.config,
        pages: params.pages.filter((page) => page.kind === group.kind),
        emptyText: `No ${normalizeLowercaseStringOrEmpty(group.heading)} yet.`,
      }),
    );
  }
  return lines.join("\n");
}
function buildDirectoryIndexBody(params) {
  return renderSectionList({
    config: params.config,
    pages: params.pages.filter((page) => page.kind === params.group.kind),
    emptyText: `No ${normalizeLowercaseStringOrEmpty(params.group.heading)} yet.`,
    sourceRelativeTo: `${params.group.dir}/index.md`,
  });
}
function createFreshnessSummary() {
  return {
    fresh: 0,
    aging: 0,
    stale: 0,
    unknown: 0,
  };
}
function rankFreshnessLevel(level) {
  switch (level) {
    case "fresh":
      return 3;
    case "aging":
      return 2;
    case "stale":
      return 1;
    case "unknown":
      return 0;
  }
  throw new Error("Unsupported wiki freshness level");
}
function sortClaims(page) {
  return [...page.claims].toSorted((left, right) => {
    const leftConfidence = left.confidence ?? -1;
    const rightConfidence = right.confidence ?? -1;
    if (leftConfidence !== rightConfidence) return rightConfidence - leftConfidence;
    const leftFreshness = rankFreshnessLevel(
      assessClaimFreshness({
        page,
        claim: left,
      }).level,
    );
    const rightFreshness = rankFreshnessLevel(
      assessClaimFreshness({
        page,
        claim: right,
      }).level,
    );
    if (leftFreshness !== rightFreshness) return rightFreshness - leftFreshness;
    return left.text.localeCompare(right.text);
  });
}
function buildAgentDigestClaimHealthSummary(pages) {
  const freshness = createFreshnessSummary();
  let contested = 0;
  let lowConfidence = 0;
  let missingEvidence = 0;
  for (const claim of collectWikiClaimHealth(pages)) {
    freshness[claim.freshness.level] += 1;
    if (isClaimHealthContested(claim)) contested += 1;
    if (typeof claim.confidence === "number" && claim.confidence < 0.5) lowConfidence += 1;
    if (claim.missingEvidence) missingEvidence += 1;
  }
  return {
    freshness,
    contested,
    lowConfidence,
    missingEvidence,
  };
}
function buildAgentDigestContradictionClusters(pages) {
  const pageClusters = buildPageContradictionClusters(pages).map((cluster) => ({
    key: cluster.key,
    label: cluster.label,
    kind: "page-note",
    entryCount: cluster.entries.length,
    paths: uniqueStrings(cluster.entries.map((entry) => entry.pagePath)).toSorted(),
  }));
  const claimClusters = buildClaimContradictionClusters({ pages }).map((cluster) => ({
    key: cluster.key,
    label: cluster.label,
    kind: "claim-id",
    entryCount: cluster.entries.length,
    paths: uniqueStrings(cluster.entries.map((entry) => entry.pagePath)).toSorted(),
  }));
  return [...pageClusters, ...claimClusters].toSorted((left, right) =>
    left.label.localeCompare(right.label),
  );
}
function buildAgentDigest(params) {
  const pages = [...params.pages]
    .toSorted((left, right) => left.relativePath.localeCompare(right.relativePath))
    .map((page) => {
      const pageFreshness = assessPageFreshness(page);
      return Object.assign(
        {},
        page.id ? { id: page.id } : {},
        {
          title: page.title,
          kind: page.kind,
          path: page.relativePath,
          aliases: [...page.aliases],
          sourceIds: [...page.sourceIds],
          questions: [...page.questions],
          contradictions: [...page.contradictions],
          bestUsedFor: [...page.bestUsedFor],
          notEnoughFor: [...page.notEnoughFor],
          relationshipCount: page.relationships.length,
          topRelationships: page.relationships.slice(0, 5),
        },
        page.pageType ? { pageType: page.pageType } : {},
        page.entityType ? { entityType: page.entityType } : {},
        page.canonicalId ? { canonicalId: page.canonicalId } : {},
        typeof page.confidence === "number" ? { confidence: page.confidence } : {},
        page.privacyTier ? { privacyTier: page.privacyTier } : {},
        page.personCard ? { personCard: page.personCard } : {},
        { freshnessLevel: pageFreshness.level },
        pageFreshness.lastTouchedAt ? { lastTouchedAt: pageFreshness.lastTouchedAt } : {},
        page.lastRefreshedAt ? { lastRefreshedAt: page.lastRefreshedAt } : {},
        {
          claimCount: page.claims.length,
          topClaims: sortClaims(page)
            .slice(0, 5)
            .map((claim) => {
              const freshness = assessClaimFreshness({
                page,
                claim,
              });
              return Object.assign(
                {},
                claim.id ? { id: claim.id } : {},
                {
                  text: claim.text,
                  status: normalizeClaimStatus(claim.status),
                },
                typeof claim.confidence === "number" ? { confidence: claim.confidence } : {},
                {
                  evidenceCount: claim.evidence.length,
                  missingEvidence: claim.evidence.length === 0,
                  evidence: [...claim.evidence],
                  freshnessLevel: freshness.level,
                },
                freshness.lastTouchedAt ? { lastTouchedAt: freshness.lastTouchedAt } : {},
              );
            }),
        },
      );
    });
  return {
    pageCounts: params.pageCounts,
    claimCount: params.pages.reduce((total, page) => total + page.claims.length, 0),
    claimHealth: buildAgentDigestClaimHealthSummary(params.pages),
    contradictionClusters: buildAgentDigestContradictionClusters(params.pages),
    pages,
  };
}
function buildClaimsDigestLines(params) {
  return params.pages
    .flatMap((page) =>
      sortClaims(page).map((claim) => {
        const freshness = assessClaimFreshness({
          page,
          claim,
        });
        return JSON.stringify({
          ...(claim.id ? { id: claim.id } : {}),
          pageId: page.id,
          pageTitle: page.title,
          pageKind: page.kind,
          pagePath: page.relativePath,
          pageType: page.pageType,
          entityType: page.entityType,
          canonicalId: page.canonicalId,
          aliases: page.aliases,
          text: claim.text,
          status: normalizeClaimStatus(claim.status),
          confidence: claim.confidence,
          sourceIds: page.sourceIds,
          evidenceKinds: uniqueStrings(claim.evidence.flatMap((entry) => entry.kind ?? [])),
          privacyTiers: [
            ...new Set(
              [
                page.privacyTier,
                page.personCard?.privacyTier,
                ...claim.evidence.map((entry) => entry.privacyTier),
              ].flatMap((entry) => entry ?? []),
            ),
          ],
          evidenceCount: claim.evidence.length,
          missingEvidence: claim.evidence.length === 0,
          evidence: claim.evidence,
          freshnessLevel: freshness.level,
          lastTouchedAt: freshness.lastTouchedAt,
        });
      }),
    )
    .toSorted((left, right) => left.localeCompare(right));
}
async function writeAgentDigestArtifacts(params) {
  const updatedFiles = [];
  const agentDigestPath = path.join(params.rootDir, AGENT_DIGEST_PATH$1);
  const claimsDigestPath = path.join(params.rootDir, CLAIMS_DIGEST_PATH$1);
  const agentDigest = `${JSON.stringify(
    buildAgentDigest({
      pages: params.pages,
      pageCounts: params.pageCounts,
    }),
    null,
    2,
  )}\n`;
  const claimsDigest = withTrailingNewline(
    buildClaimsDigestLines({ pages: params.pages }).join("\n"),
  );
  for (const [filePath, content] of [
    [agentDigestPath, agentDigest],
    [claimsDigestPath, claimsDigest],
  ]) {
    const relativePath = path.relative(params.rootDir, filePath);
    const root$6 = await root(params.rootDir);
    if ((await root$6.readText(relativePath).catch(() => "")) === content) continue;
    await root$6.write(relativePath, content);
    updatedFiles.push(filePath);
  }
  return updatedFiles;
}
async function compileMemoryWikiVaultUnlocked(config) {
  await initializeMemoryWikiVault(config);
  const rootDir = config.vault.path;
  const sourceSyncState = await readMemoryWikiSourceSyncState(rootDir);
  const managedImportedSourcePagePaths = new Set(
    Object.values(sourceSyncState.entries).map((entry) => entry.pagePath.split(path.sep).join("/")),
  );
  let scan = await readPageSummaries(rootDir);
  let pages = scan.pages;
  const updatedFiles = await refreshPageRelatedBlocks({
    config,
    pages,
  });
  if (updatedFiles.length > 0) {
    scan = await readPageSummaries(rootDir);
    pages = scan.pages;
  }
  const dashboardUpdatedFiles = await refreshDashboardPages({
    config,
    managedImportedSourcePagePaths,
    rootDir,
    pages,
  });
  updatedFiles.push(...dashboardUpdatedFiles);
  if (dashboardUpdatedFiles.length > 0) {
    scan = await readPageSummaries(rootDir);
    pages = scan.pages;
  }
  const counts = buildPageCounts(pages);
  const digestUpdatedFiles = await writeAgentDigestArtifacts({
    rootDir,
    pages,
    pageCounts: counts,
  });
  updatedFiles.push(...digestUpdatedFiles);
  const rootIndexPath = path.join(rootDir, "index.md");
  if (
    await writeManagedMarkdownFile({
      rootDir,
      relativePath: "index.md",
      title: "Wiki Index",
      startMarker: "<!-- openclaw:wiki:index:start -->",
      endMarker: "<!-- openclaw:wiki:index:end -->",
      body: buildRootIndexBody({
        config,
        pages,
        counts,
      }),
    })
  )
    updatedFiles.push(rootIndexPath);
  for (const group of COMPILE_PAGE_GROUPS) {
    const relativePath = path.join(group.dir, "index.md").replace(/\\/g, "/");
    const filePath = path.join(rootDir, relativePath);
    if (
      await writeManagedMarkdownFile({
        rootDir,
        relativePath,
        title: group.heading,
        startMarker: `<!-- openclaw:wiki:${group.dir}:index:start -->`,
        endMarker: `<!-- openclaw:wiki:${group.dir}:index:end -->`,
        body: buildDirectoryIndexBody({
          config,
          pages,
          group,
        }),
      })
    )
      updatedFiles.push(filePath);
  }
  if (updatedFiles.length > 0)
    await appendMemoryWikiLog(rootDir, {
      type: "compile",
      timestamp: /* @__PURE__ */ new Date().toISOString(),
      details: {
        pageCounts: counts,
        updatedFiles: updatedFiles.map((filePath) => path.relative(rootDir, filePath)),
      },
    });
  return {
    vaultRoot: rootDir,
    pageCounts: counts,
    pages,
    frontmatterErrors: scan.frontmatterErrors,
    claimCount: pages.reduce((total, page) => total + page.claims.length, 0),
    updatedFiles,
  };
}
async function compileMemoryWikiVault(config) {
  return await withMemoryWikiVaultMutation(config.vault.path, () =>
    compileMemoryWikiVaultUnlocked(config),
  );
}
async function hasMissingWikiIndexes(rootDir) {
  const required = [
    path.join(rootDir, "index.md"),
    ...COMPILE_PAGE_GROUPS.map((group) => path.join(rootDir, group.dir, "index.md")),
  ];
  for (const filePath of required)
    if (
      !(await fs$1
        .access(filePath)
        .then(() => true)
        .catch(() => false))
    )
      return true;
  return false;
}
async function refreshMemoryWikiIndexesAfterImport(params) {
  await initializeMemoryWikiVault(params.config);
  if (!params.config.ingest.autoCompile)
    return {
      refreshed: false,
      reason: "auto-compile-disabled",
    };
  const importChanged =
    params.syncResult.importedCount > 0 ||
    params.syncResult.updatedCount > 0 ||
    params.syncResult.removedCount > 0;
  const missingIndexes = await hasMissingWikiIndexes(params.config.vault.path);
  if (!importChanged && !missingIndexes)
    return {
      refreshed: false,
      reason: "no-import-changes",
    };
  const compile = await compileMemoryWikiVault(params.config);
  return {
    refreshed: true,
    reason: missingIndexes && !importChanged ? "missing-indexes" : "import-changed",
    compile,
  };
}
//#endregion
//#region extensions/memory-wiki/src/query.ts
const QUERY_DIRS = ["entities", "concepts", "sources", "syntheses", "reports"];
const AGENT_DIGEST_PATH = ".openclaw-wiki/cache/agent-digest.json";
const CLAIMS_DIGEST_PATH = ".openclaw-wiki/cache/claims.jsonl";
const QUERY_PAGE_READ_CONCURRENCY = 16;
const RELATED_BLOCK_PATTERN =
  /<!-- openclaw:wiki:related:start -->[\s\S]*?<!-- openclaw:wiki:related:end -->/g;
const MARKDOWN_FRONTMATTER_PATTERN = /^\s*---\r?\n[\s\S]*?\r?\n---\r?\n?/;
const ROUTE_QUESTION_STOP_WORDS = /* @__PURE__ */ new Set([
  "a",
  "about",
  "am",
  "an",
  "are",
  "ask",
  "asking",
  "be",
  "been",
  "being",
  "can",
  "could",
  "did",
  "do",
  "does",
  "for",
  "help",
  "how",
  "i",
  "in",
  "is",
  "know",
  "knows",
  "me",
  "my",
  "need",
  "needs",
  "of",
  "on",
  "or",
  "our",
  "question",
  "questions",
  "should",
  "the",
  "to",
  "us",
  "we",
  "what",
  "when",
  "where",
  "who",
  "whom",
  "whose",
  "why",
  "with",
  "would",
]);
function normalizePositiveInteger(value, fallback) {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.max(1, Math.floor(value))
    : fallback;
}
const WIKI_SEARCH_MODES = ["auto", "find-person", "route-question", "source-evidence", "raw-claim"];
function sortWikiSearchResults(results) {
  return results.toSorted((left, right) => {
    if (left.score !== right.score) return right.score - left.score;
    return left.title.localeCompare(right.title);
  });
}
function mergeWikiSearchCorpusResults(params) {
  const wikiResults = sortWikiSearchResults(params.wikiResults);
  const memoryResults = sortWikiSearchResults(params.memoryResults);
  if (!params.balanceCorpora || wikiResults.length === 0 || memoryResults.length === 0)
    return sortWikiSearchResults([...wikiResults, ...memoryResults]).slice(0, params.maxResults);
  const perCorpusCap = Math.ceil(params.maxResults / 2);
  const selectedWiki = wikiResults.slice(0, perCorpusCap);
  const selectedMemory = memoryResults.slice(0, perCorpusCap);
  const selected = [...selectedWiki, ...selectedMemory];
  if (selected.length < params.maxResults)
    selected.push(
      ...sortWikiSearchResults([
        ...wikiResults.slice(selectedWiki.length),
        ...memoryResults.slice(selectedMemory.length),
      ]).slice(0, params.maxResults - selected.length),
    );
  return sortWikiSearchResults(selected).slice(0, params.maxResults);
}
async function listWikiMarkdownFiles(rootDir) {
  return (
    await Promise.all(
      QUERY_DIRS.map(async (relativeDir) => {
        const dirPath = path.join(rootDir, relativeDir);
        return (
          await fs$1
            .readdir(dirPath, {
              withFileTypes: true,
              recursive: true,
            })
            .catch(() => [])
        )
          .filter(
            (entry) => entry.isFile() && entry.name.endsWith(".md") && entry.name !== "index.md",
          )
          .map((entry) => {
            const absPath = path.join(entry.parentPath ?? dirPath, entry.name);
            return path.relative(rootDir, absPath).split(path.sep).join("/");
          });
      }),
    )
  )
    .flat()
    .toSorted((left, right) => left.localeCompare(right));
}
async function readQueryableWikiPages(rootDir) {
  return readQueryableWikiPagesByPaths(rootDir, await listWikiMarkdownFiles(rootDir));
}
async function readQueryableWikiPagesByPaths(rootDir, files) {
  return await pMap(
    files,
    async (relativePath) => {
      const absolutePath = path.join(rootDir, relativePath);
      const raw = await fs$1.readFile(absolutePath, "utf8");
      const summary = toWikiPageSummary({
        absolutePath,
        relativePath,
        raw,
      });
      return summary
        ? {
            ...summary,
            raw,
          }
        : pMapSkip;
    },
    {
      concurrency: QUERY_PAGE_READ_CONCURRENCY,
      stopOnError: true,
    },
  );
}
function parseClaimsDigest(raw) {
  return raw.split(/\r?\n/).flatMap((line) => {
    const trimmed = line.trim();
    if (!trimmed) return [];
    try {
      const parsed = JSON.parse(trimmed);
      if (!parsed || typeof parsed !== "object" || typeof parsed.pagePath !== "string") return [];
      return [parsed];
    } catch {
      return [];
    }
  });
}
async function readQueryDigestBundle(rootDir) {
  const [agentDigestRaw, claimsDigestRaw] = await Promise.all([
    fs$1.readFile(path.join(rootDir, AGENT_DIGEST_PATH), "utf8").catch(() => null),
    fs$1.readFile(path.join(rootDir, CLAIMS_DIGEST_PATH), "utf8").catch(() => null),
  ]);
  if (!agentDigestRaw && !claimsDigestRaw) return null;
  const pages = (() => {
    if (!agentDigestRaw) return [];
    try {
      const parsed = JSON.parse(agentDigestRaw);
      return Array.isArray(parsed.pages) ? parsed.pages : [];
    } catch {
      return [];
    }
  })();
  const claims = claimsDigestRaw ? parseClaimsDigest(claimsDigestRaw) : [];
  if (pages.length === 0 && claims.length === 0) return null;
  return {
    pages,
    claims,
  };
}
function buildSnippet(raw, query) {
  const queryLower = normalizeLowercaseStringOrEmpty(query);
  const queryTokens = buildQueryTokens(queryLower);
  const lines = buildSnippetSearchText(raw)
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0);
  return (
    (
      lines.find((line) =>
        lineMatchesQuery(normalizeLowercaseStringOrEmpty(line), queryLower, queryTokens),
      ) ??
      lines
        .map((line) => ({
          line,
          hits: queryTokens.filter((token) => normalizeLowercaseStringOrEmpty(line).includes(token))
            .length,
        }))
        .toSorted((left, right) => right.hits - left.hits)
        .find((candidate) => candidate.hits > 0)?.line
    )?.trim() ||
    lines.find((line) => line.trim() !== "---")?.trim() ||
    ""
  );
}
function buildPageSearchText(page) {
  return [
    page.title,
    page.relativePath,
    page.id ?? "",
    page.pageType ?? "",
    page.entityType ?? "",
    page.canonicalId ?? "",
    page.aliases.join(" "),
    page.sourceIds.join(" "),
    page.questions.join(" "),
    page.contradictions.join(" "),
    page.privacyTier ?? "",
    page.bestUsedFor.join(" "),
    page.notEnoughFor.join(" "),
    page.personCard?.canonicalId ?? "",
    page.personCard?.handles.join(" ") ?? "",
    page.personCard?.socials.join(" ") ?? "",
    page.personCard?.emails.join(" ") ?? "",
    page.personCard?.timezone ?? "",
    page.personCard?.lane ?? "",
    page.personCard?.askFor.join(" ") ?? "",
    page.personCard?.avoidAskingFor.join(" ") ?? "",
    page.personCard?.bestUsedFor.join(" ") ?? "",
    page.personCard?.notEnoughFor.join(" ") ?? "",
    page.relationships
      .flatMap((relationship) => [
        relationship.targetId ?? "",
        relationship.targetPath ?? "",
        relationship.targetTitle ?? "",
        relationship.kind ?? "",
        relationship.evidenceKind ?? "",
        relationship.note ?? "",
      ])
      .join(" "),
    page.claims.map((claim) => claim.text).join(" "),
    page.claims.map((claim) => claim.id ?? "").join(" "),
    page.claims
      .flatMap((claim) =>
        claim.evidence.flatMap((evidence) => [
          evidence.kind ?? "",
          evidence.sourceId ?? "",
          evidence.path ?? "",
          evidence.lines ?? "",
          evidence.note ?? "",
          evidence.privacyTier ?? "",
        ]),
      )
      .join(" "),
  ]
    .filter(Boolean)
    .join("\n");
}
function stripGeneratedRelatedBlock(raw) {
  return raw.replace(RELATED_BLOCK_PATTERN, "");
}
function buildSnippetSearchText(raw) {
  return stripGeneratedRelatedBlock(raw).replace(MARKDOWN_FRONTMATTER_PATTERN, "");
}
function buildQueryTokens(queryLower) {
  return [
    ...new Set(
      queryLower
        .split(/[^a-z0-9@._-]+/i)
        .map((token) => token.trim())
        .filter((token) => token.length >= 2),
    ),
  ];
}
function buildRouteQuestionTokens(queryLower) {
  const tokens = buildQueryTokens(queryLower);
  const routedTokens = tokens.filter((token) => !ROUTE_QUESTION_STOP_WORDS.has(token));
  return routedTokens.length > 0 ? routedTokens : tokens;
}
function lineMatchesQuery(lineLower, queryLower, queryTokens) {
  if (queryLower.length > 0 && lineLower.includes(queryLower)) return true;
  return queryTokens.length > 0 && queryTokens.every((token) => lineLower.includes(token));
}
function buildDigestPageSearchText(page, claims) {
  return [
    page.title,
    page.path,
    page.id ?? "",
    page.pageType ?? "",
    page.entityType ?? "",
    page.canonicalId ?? "",
    page.aliases?.join(" ") ?? "",
    page.sourceIds.join(" "),
    page.questions.join(" "),
    page.contradictions.join(" "),
    page.privacyTier ?? "",
    page.bestUsedFor?.join(" ") ?? "",
    page.notEnoughFor?.join(" ") ?? "",
    page.personCard?.canonicalId ?? "",
    page.personCard?.handles.join(" ") ?? "",
    page.personCard?.socials.join(" ") ?? "",
    page.personCard?.emails.join(" ") ?? "",
    page.personCard?.timezone ?? "",
    page.personCard?.lane ?? "",
    page.personCard?.askFor.join(" ") ?? "",
    page.personCard?.avoidAskingFor.join(" ") ?? "",
    page.personCard?.bestUsedFor.join(" ") ?? "",
    page.personCard?.notEnoughFor.join(" ") ?? "",
    page.topRelationships
      ?.flatMap((relationship) => [
        relationship.targetId ?? "",
        relationship.targetPath ?? "",
        relationship.targetTitle ?? "",
        relationship.kind ?? "",
        relationship.evidenceKind ?? "",
        relationship.note ?? "",
      ])
      .join(" ") ?? "",
    claims.map((claim) => claim.text).join(" "),
    claims.map((claim) => claim.id ?? "").join(" "),
    claims.map((claim) => claim.evidenceKinds?.join(" ") ?? "").join(" "),
    claims.map((claim) => claim.privacyTiers?.join(" ") ?? "").join(" "),
  ]
    .filter(Boolean)
    .join("\n");
}
function isClaimTextOrIdMatch(claim, queryLower, queryTokens = buildQueryTokens(queryLower)) {
  if (lineMatchesQuery(normalizeLowercaseStringOrEmpty(claim.text), queryLower, [...queryTokens]))
    return true;
  return lineMatchesQuery(normalizeLowercaseStringOrEmpty(claim.id), queryLower, [...queryTokens]);
}
function scoreClaimMatch(params) {
  let score = 0;
  if (normalizeLowercaseStringOrEmpty(params.text).includes(params.queryLower)) score += 25;
  else if (
    params.queryTokens?.length &&
    params.queryTokens.every((token) =>
      normalizeLowercaseStringOrEmpty(params.text).includes(token),
    )
  )
    score += 18;
  if (normalizeLowercaseStringOrEmpty(params.id).includes(params.queryLower)) score += 10;
  if (typeof params.confidence === "number") score += Math.round(params.confidence * 10);
  switch (params.freshnessLevel) {
    case "fresh":
      score += 8;
      break;
    case "aging":
      score += 4;
      break;
    case "stale":
      score -= 2;
      break;
    case "unknown":
      score -= 4;
      break;
    case void 0:
      break;
  }
  score += isClaimContestedStatus(params.status) ? -6 : 4;
  return score;
}
function scoreDigestClaimMatch(claim, queryLower) {
  return scoreClaimMatch({
    text: claim.text,
    id: claim.id,
    confidence: claim.confidence,
    status: claim.status,
    freshnessLevel: claim.freshnessLevel,
    queryLower,
    queryTokens: buildQueryTokens(queryLower),
  });
}
function scoreWikiMetadataMatch(params) {
  let score = 0;
  const titleLower = normalizeLowercaseStringOrEmpty(params.title);
  const pathLower = normalizeLowercaseStringOrEmpty(params.path);
  const idLower = normalizeLowercaseStringOrEmpty(params.id);
  if (titleLower === params.queryLower) score += 50;
  else if (titleLower.includes(params.queryLower)) score += 20;
  if (pathLower.includes(params.queryLower)) score += 10;
  if (idLower.includes(params.queryLower)) score += 20;
  if (
    params.sourceIds.some((sourceId) =>
      normalizeLowercaseStringOrEmpty(sourceId).includes(params.queryLower),
    )
  )
    score += 12;
  return score;
}
function hasQueryMatch(value, queryLower, queryTokens) {
  return lineMatchesQuery(normalizeLowercaseStringOrEmpty(value), queryLower, [...queryTokens]);
}
function hasAnyQueryMatch(values, queryLower, queryTokens) {
  return values.some((value) => hasQueryMatch(value, queryLower, queryTokens));
}
function buildPageRouteQuestionFields(page) {
  return [
    page.personCard?.lane,
    ...(page.personCard?.askFor ?? []),
    ...(page.personCard?.avoidAskingFor ?? []),
    ...page.bestUsedFor,
    ...page.notEnoughFor,
    ...(page.personCard?.bestUsedFor ?? []),
    ...(page.personCard?.notEnoughFor ?? []),
    ...page.relationships.flatMap((relationship) => [
      relationship.kind,
      relationship.targetTitle,
      relationship.note,
    ]),
  ].filter((value) => Boolean(value));
}
function buildDigestRouteQuestionFields(page) {
  return [
    page.personCard?.lane,
    ...(page.personCard?.askFor ?? []),
    ...(page.personCard?.avoidAskingFor ?? []),
    ...(page.bestUsedFor ?? []),
    ...(page.notEnoughFor ?? []),
    ...(page.personCard?.bestUsedFor ?? []),
    ...(page.personCard?.notEnoughFor ?? []),
    ...(page.topRelationships?.flatMap((relationship) => [
      relationship.kind,
      relationship.targetTitle,
      relationship.note,
    ]) ?? []),
  ].filter((value) => Boolean(value));
}
function hasRouteQuestionMatch(values, queryLower) {
  return hasAnyQueryMatch(values, queryLower, buildRouteQuestionTokens(queryLower));
}
function isPersonLikeSummary(page) {
  const entityType = normalizeLowercaseStringOrEmpty(page.entityType);
  const pageType = normalizeLowercaseStringOrEmpty(page.pageType);
  return (
    Boolean(page.personCard) ||
    entityType === "person" ||
    entityType === "maintainer" ||
    pageType === "person" ||
    pageType === "maintainer"
  );
}
function scorePageSearchModeBoost(params) {
  const { page, queryLower, queryTokens } = params;
  switch (params.mode) {
    case "auto":
      return 0;
    case "find-person": {
      let score = isPersonLikeSummary(page) ? 24 : -4;
      if (
        hasAnyQueryMatch(
          [
            page.canonicalId,
            ...page.aliases,
            page.personCard?.canonicalId,
            ...(page.personCard?.handles ?? []),
            ...(page.personCard?.emails ?? []),
            ...(page.personCard?.socials ?? []),
          ],
          queryLower,
          queryTokens,
        )
      )
        score += 24;
      return score;
    }
    case "route-question": {
      let score = isPersonLikeSummary(page) ? 14 : 0;
      if (hasRouteQuestionMatch(buildPageRouteQuestionFields(page), queryLower)) score += 32;
      score += Math.min(8, page.relationships.length * 2);
      return score;
    }
    case "source-evidence": {
      let score = page.kind === "source" ? 22 : 0;
      if (
        hasAnyQueryMatch(
          [
            page.sourcePath,
            ...page.sourceIds,
            ...page.claims.flatMap((claim) =>
              claim.evidence.flatMap((evidence) => [
                evidence.kind,
                evidence.sourceId,
                evidence.path,
                evidence.lines,
                evidence.note,
              ]),
            ),
          ],
          queryLower,
          queryTokens,
        )
      )
        score += 30;
      return score;
    }
    case "raw-claim":
      return params.matchingClaims.length > 0 ? 42 : 0;
  }
  return 0;
}
function scoreDigestSearchModeBoost(params) {
  const { page, queryLower, queryTokens } = params;
  switch (params.mode) {
    case "auto":
      return 0;
    case "find-person": {
      let score = isPersonLikeSummary(page) ? 24 : -4;
      if (
        hasAnyQueryMatch(
          [
            page.canonicalId,
            ...(page.aliases ?? []),
            page.personCard?.canonicalId,
            ...(page.personCard?.handles ?? []),
            ...(page.personCard?.emails ?? []),
            ...(page.personCard?.socials ?? []),
          ],
          queryLower,
          queryTokens,
        )
      )
        score += 24;
      return score;
    }
    case "route-question": {
      let score = isPersonLikeSummary(page) ? 14 : 0;
      if (hasRouteQuestionMatch(buildDigestRouteQuestionFields(page), queryLower)) score += 32;
      score += Math.min(8, (page.relationshipCount ?? 0) * 2);
      return score;
    }
    case "source-evidence": {
      let score = page.kind === "source" ? 22 : 0;
      if (
        hasAnyQueryMatch(
          [
            ...page.sourceIds,
            ...params.claims.flatMap((claim) => [
              ...(claim.sourceIds ?? []),
              ...(claim.evidenceKinds ?? []),
              ...(claim.privacyTiers ?? []),
            ]),
          ],
          queryLower,
          queryTokens,
        )
      )
        score += 30;
      return score;
    }
    case "raw-claim":
      return params.matchingClaims.length > 0 ? 42 : 0;
  }
  return 0;
}
function buildDigestCandidatePaths(params) {
  const queryLower = normalizeLowercaseStringOrEmpty(params.query);
  const queryTokens = buildQueryTokens(queryLower);
  const claimsByPage = /* @__PURE__ */ new Map();
  for (const claim of params.digest.claims) {
    const current = claimsByPage.get(claim.pagePath) ?? [];
    current.push(claim);
    claimsByPage.set(claim.pagePath, current);
  }
  return params.digest.pages
    .map((page) => {
      const claims = claimsByPage.get(page.path) ?? [];
      if (
        !normalizeLowercaseStringOrEmpty(buildDigestPageSearchText(page, claims)).includes(
          queryLower,
        ) &&
        !(
          params.mode === "route-question" &&
          hasRouteQuestionMatch(buildDigestRouteQuestionFields(page), queryLower)
        )
      )
        return {
          path: page.path,
          score: 0,
        };
      let score =
        1 +
        scoreWikiMetadataMatch({
          title: page.title,
          path: page.path,
          id: page.id,
          sourceIds: page.sourceIds,
          queryLower,
        });
      const matchingClaims = claims
        .filter((claim) => isClaimTextOrIdMatch(claim, queryLower, queryTokens))
        .toSorted(
          (left, right) =>
            scoreDigestClaimMatch(right, queryLower) - scoreDigestClaimMatch(left, queryLower),
        );
      const [bestMatchingClaim] = matchingClaims;
      if (bestMatchingClaim) {
        score += scoreDigestClaimMatch(bestMatchingClaim, queryLower);
        score += Math.min(10, (matchingClaims.length - 1) * 2);
      }
      score += scoreDigestSearchModeBoost({
        page,
        claims,
        matchingClaims,
        queryLower,
        queryTokens,
        mode: params.mode,
      });
      return {
        path: page.path,
        score,
      };
    })
    .filter((candidate) => candidate.score > 0)
    .toSorted((left, right) => {
      if (left.score !== right.score) return right.score - left.score;
      return left.path.localeCompare(right.path);
    })
    .slice(0, Math.max(params.maxResults * 4, 20))
    .map((candidate) => candidate.path);
}
function isClaimMatch(claim, queryLower, queryTokens) {
  return isClaimTextOrIdMatch(claim, queryLower, queryTokens);
}
function rankClaimMatch(page, claim, queryLower, queryTokens) {
  const freshness = assessClaimFreshness({
    page,
    claim,
  });
  return scoreClaimMatch({
    text: claim.text,
    id: claim.id,
    confidence: claim.confidence,
    status: claim.status,
    freshnessLevel: freshness.level,
    queryLower,
    queryTokens,
  });
}
function getMatchingClaims(page, queryLower) {
  const queryTokens = buildQueryTokens(queryLower);
  return page.claims
    .filter((claim) => isClaimMatch(claim, queryLower, queryTokens))
    .toSorted(
      (left, right) =>
        rankClaimMatch(page, right, queryLower, queryTokens) -
        rankClaimMatch(page, left, queryLower, queryTokens),
    );
}
function buildPageSnippet(page, query) {
  const matchingClaim = getMatchingClaims(page, normalizeLowercaseStringOrEmpty(query))[0];
  if (matchingClaim) return matchingClaim.text;
  return buildSnippet(page.raw, query);
}
function scorePage(page, query, mode) {
  const queryLower = normalizeLowercaseStringOrEmpty(query);
  const queryTokens = buildQueryTokens(queryLower);
  const titleLower = normalizeLowercaseStringOrEmpty(page.title);
  const pathLower = normalizeLowercaseStringOrEmpty(page.relativePath);
  const idLower = normalizeLowercaseStringOrEmpty(page.id);
  const metadataLower = normalizeLowercaseStringOrEmpty(buildPageSearchText(page));
  const rawLower = normalizeLowercaseStringOrEmpty(stripGeneratedRelatedBlock(page.raw));
  const combinedLower = [titleLower, pathLower, idLower, metadataLower, rawLower].join("\n");
  const hasExactMatch =
    titleLower.includes(queryLower) ||
    pathLower.includes(queryLower) ||
    idLower.includes(queryLower) ||
    metadataLower.includes(queryLower) ||
    rawLower.includes(queryLower);
  const hasAllTokens =
    queryTokens.length > 0 && queryTokens.every((token) => combinedLower.includes(token));
  const hasModeMatch =
    mode === "route-question" &&
    hasRouteQuestionMatch(buildPageRouteQuestionFields(page), queryLower);
  if (!hasExactMatch && !hasAllTokens && !hasModeMatch) return 0;
  let score =
    1 +
    scoreWikiMetadataMatch({
      title: page.title,
      path: page.relativePath,
      id: page.id,
      sourceIds: page.sourceIds,
      queryLower,
    });
  const matchingClaims = getMatchingClaims(page, queryLower);
  const [bestMatchingClaim] = matchingClaims;
  if (bestMatchingClaim) {
    score += rankClaimMatch(page, bestMatchingClaim, queryLower, queryTokens);
    score += Math.min(10, (matchingClaims.length - 1) * 2);
  }
  score += scorePageSearchModeBoost({
    page,
    matchingClaims,
    queryLower,
    queryTokens,
    mode,
  });
  const bodyOccurrences = rawLower.split(queryLower).length - 1;
  score += Math.min(10, bodyOccurrences);
  for (const token of queryTokens) {
    if (titleLower.includes(token)) score += 8;
    if (pathLower.includes(token) || idLower.includes(token)) score += 6;
    if (metadataLower.includes(token)) score += 4;
    if (rawLower.includes(token)) score += 1;
  }
  return score;
}
function normalizeLookupKey(value) {
  const normalized = value.trim().replace(/\\/g, "/");
  return normalized.endsWith(".md") ? normalized : normalized.replace(/\/+$/, "");
}
function buildLookupCandidates(lookup) {
  const normalized = normalizeLookupKey(lookup);
  return uniqueStrings([normalized, normalized.endsWith(".md") ? normalized : `${normalized}.md`]);
}
function shouldEnforceSessionVisibility(params) {
  return (
    params.sandboxed === true ||
    Boolean(params.agentSessionKey?.trim()) ||
    Boolean(params.agentId?.trim())
  );
}
function shouldSearchSharedMemoryCorpus(config) {
  return config.search.corpus === "memory" || config.search.corpus === "all";
}
function shouldUseSharedMemory(config) {
  return config.search.backend === "shared" && shouldSearchSharedMemoryCorpus(config);
}
function assertSessionVisibilityAppConfig(params) {
  if (
    shouldUseSharedMemory(params.config) &&
    shouldEnforceSessionVisibility(params) &&
    !params.appConfig
  )
    throw new Error(
      `${params.operation} requires appConfig to enforce session visibility for session-bound shared memory calls.`,
    );
}
const SESSION_MEMORY_PATH_PREFIXES = ["sessions/", "qmd/sessions/", "qmd/sessions-"];
const SESSION_MEMORY_ROOT_PATHS = ["qmd/sessions"];
function isSessionMemoryPath(relPath) {
  const normalized = relPath.replace(/\\/g, "/");
  return (
    SESSION_MEMORY_PATH_PREFIXES.some((prefix) => normalized.startsWith(prefix)) ||
    SESSION_MEMORY_ROOT_PATHS.some((rootPath) => normalized === rootPath)
  );
}
function shouldSearchWiki(config) {
  return config.search.corpus === "wiki" || config.search.corpus === "all";
}
function shouldSearchSharedMemory(config, appConfig) {
  return shouldUseSharedMemory(config) && appConfig !== void 0;
}
function resolveActiveMemoryAgentId(params) {
  if (!params.appConfig) return null;
  if (params.agentId?.trim()) return params.agentId.trim();
  if (params.agentSessionKey?.trim())
    return resolveSessionAgentId({
      sessionKey: params.agentSessionKey,
      config: params.appConfig,
    });
  return resolveDefaultAgentId(params.appConfig);
}
async function resolveActiveMemoryManager(params) {
  const agentId = resolveActiveMemoryAgentId(params);
  if (!params.appConfig || !agentId) return null;
  try {
    const { manager } = await getActiveMemorySearchManager({
      cfg: params.appConfig,
      agentId,
    });
    return manager;
  } catch {
    return null;
  }
}
function buildMemoryManagerContractError(method) {
  return /* @__PURE__ */ new Error(
    `The active memory plugin's search manager does not implement ${method}() from the MemorySearchManager contract. Set search.backend to "local" for wiki-only access, or use a memory plugin that implements the contract.`,
  );
}
function buildMemorySearchTitle(resultPath) {
  const basename = path.basename(resultPath, path.extname(resultPath));
  return basename.length > 0 ? basename : resultPath;
}
function applySearchOverrides(config, overrides) {
  if (!overrides?.searchBackend && !overrides?.searchCorpus) return config;
  return {
    ...config,
    search: {
      backend: overrides.searchBackend ?? config.search.backend,
      corpus: overrides.searchCorpus ?? config.search.corpus,
    },
  };
}
function buildWikiProvenanceLabel(page) {
  if (page.sourceType === "memory-bridge-events")
    return `bridge events: ${page.bridgeRelativePath ?? page.relativePath}`;
  if (page.sourceType === "memory-bridge")
    return `bridge: ${page.bridgeRelativePath ?? page.relativePath}`;
  if (page.provenanceMode === "unsafe-local" || page.sourceType === "memory-unsafe-local")
    return `unsafe-local: ${page.unsafeLocalRelativePath ?? page.relativePath}`;
}
function buildWikiResultMetadata(page) {
  const provenanceLabel = buildWikiProvenanceLabel(page);
  return {
    ...(page.id ? { id: page.id } : {}),
    ...(page.sourceType ? { sourceType: page.sourceType } : {}),
    ...(page.provenanceMode ? { provenanceMode: page.provenanceMode } : {}),
    ...(page.sourcePath ? { sourcePath: page.sourcePath } : {}),
    ...(provenanceLabel ? { provenanceLabel } : {}),
    ...(page.updatedAt ? { updatedAt: page.updatedAt } : {}),
    ...("entityType" in page && page.entityType ? { entityType: page.entityType } : {}),
    ...("canonicalId" in page && page.canonicalId ? { canonicalId: page.canonicalId } : {}),
    ...("aliases" in page && page.aliases.length > 0 ? { aliases: [...page.aliases] } : {}),
    ...("privacyTier" in page && page.privacyTier ? { privacyTier: page.privacyTier } : {}),
  };
}
function buildClaimResultMetadata(claim) {
  if (!claim) return {};
  return {
    ...(claim.id ? { matchedClaimId: claim.id } : {}),
    ...(claim.status ? { matchedClaimStatus: claim.status } : {}),
    ...(typeof claim.confidence === "number" ? { matchedClaimConfidence: claim.confidence } : {}),
    evidenceKinds: uniqueStrings(claim.evidence.flatMap((evidence) => evidence.kind ?? [])),
    evidenceSourceIds: uniqueStrings(claim.evidence.flatMap((evidence) => evidence.sourceId ?? [])),
  };
}
function toWikiSearchResult(page, query, mode) {
  const matchingClaim = getMatchingClaims(page, normalizeLowercaseStringOrEmpty(query))[0];
  return {
    corpus: "wiki",
    path: page.relativePath,
    title: page.title,
    kind: page.kind,
    score: scorePage(page, query, mode),
    snippet: buildPageSnippet(page, query),
    searchMode: mode,
    ...buildWikiResultMetadata(page),
    ...buildClaimResultMetadata(matchingClaim),
  };
}
function toMemoryWikiSearchResult(result, mode) {
  return {
    corpus: "memory",
    path: result.path,
    title: buildMemorySearchTitle(result.path),
    kind: "memory",
    score: result.score,
    snippet: result.snippet,
    startLine: result.startLine,
    endLine: result.endLine,
    memorySource: result.source,
    searchMode: mode,
    ...(result.citation ? { citation: result.citation } : {}),
  };
}
async function filterMemoryWikiSearchHitsBySessionVisibility(params) {
  if (!params.hits.some((hit) => hit.source === "sessions")) return params.hits;
  return filterMemoryWikiSearchHitsWithSessionVisibility({
    canReadSessionPath: await createSessionMemoryPathVisibilityChecker({
      cfg: params.cfg,
      agentId: params.agentId,
      requesterSessionKey: params.requesterSessionKey,
      sandboxed: params.sandboxed,
    }),
    hits: params.hits,
  });
}
function filterSessionKeysByScopedAgent(params) {
  const scopedAgentId = normalizeLowercaseStringOrEmpty(params.scopedAgentId);
  if (!scopedAgentId) return params.keys;
  return params.keys.filter((key) => {
    if (params.cfg.session?.scope === "global" && key.trim().toLowerCase() === "global")
      return true;
    return (
      normalizeLowercaseStringOrEmpty(
        resolveSessionAgentId({
          sessionKey: key,
          config: params.cfg,
        }),
      ) === scopedAgentId
    );
  });
}
async function createSessionMemoryPathVisibilityChecker(params) {
  const visibility = resolveEffectiveSessionToolsVisibility({
    cfg: params.cfg,
    sandboxed: params.sandboxed,
  });
  const a2aPolicy = createAgentToAgentPolicy(params.cfg);
  const requesterAgentId = params.requesterSessionKey
    ? resolveSessionAgentId({
        sessionKey: params.requesterSessionKey,
        config: params.cfg,
      })
    : void 0;
  const scopedAgentId = params.agentId?.trim() || requesterAgentId;
  const guard = params.requesterSessionKey
    ? await createSessionVisibilityGuard({
        action: "history",
        requesterSessionKey: params.requesterSessionKey,
        visibility,
        a2aPolicy,
      })
    : null;
  const { store: combinedSessionStore } = loadCombinedSessionStoreForGateway(
    params.cfg,
    scopedAgentId ? { agentId: scopedAgentId } : {},
  );
  return (relPath) => {
    const identity = extractTranscriptIdentityFromSessionsMemoryHit(relPath);
    if (!identity) return false;
    const isQmdSessionPath = relPath.replace(/\\/g, "/").startsWith("qmd/");
    const normalizedScopedAgentId = normalizeLowercaseStringOrEmpty(scopedAgentId);
    const normalizedOwnerAgentId = normalizeLowercaseStringOrEmpty(identity.ownerAgentId);
    if (
      normalizedScopedAgentId &&
      normalizedOwnerAgentId &&
      normalizedOwnerAgentId !== normalizedScopedAgentId
    )
      return false;
    const archivedOwnerAgentId = Boolean(
      identity.archived &&
      ((identity.ownerAgentId &&
        (!normalizedScopedAgentId || normalizedOwnerAgentId === normalizedScopedAgentId)) ||
        (isQmdSessionPath && scopedAgentId)),
    )
      ? (identity.ownerAgentId ?? scopedAgentId)
      : void 0;
    const liveKeys = identity.liveStem
      ? resolveTranscriptStemToSessionKeys({
          store: combinedSessionStore,
          stem: identity.liveStem,
          allowQmdSlugFallback: false,
        })
      : [];
    const keys = filterSessionKeysByScopedAgent({
      cfg: params.cfg,
      scopedAgentId,
      keys:
        liveKeys.length > 0
          ? liveKeys
          : resolveTranscriptStemToSessionKeys({
              store: combinedSessionStore,
              stem: identity.stem,
              allowQmdSlugFallback: isQmdSessionPath && !identity.archived,
              ...(archivedOwnerAgentId ? { archivedOwnerAgentId } : {}),
            }),
    });
    if (!guard) return Boolean(scopedAgentId && keys.length > 0);
    return keys.some((key) => guard.check(key).allowed);
  };
}
function filterMemoryWikiSearchHitsWithSessionVisibility(params) {
  const next = [];
  for (const hit of params.hits) {
    if (hit.source !== "sessions") {
      next.push(hit);
      continue;
    }
    if (params.canReadSessionPath(hit.path)) next.push(hit);
  }
  return next;
}
function canReadSessionMemoryPath(params) {
  return (
    filterMemoryWikiSearchHitsWithSessionVisibility({
      canReadSessionPath: params.canReadSessionPath,
      hits: [
        {
          path: params.relPath,
          startLine: 1,
          endLine: 1,
          score: 0,
          snippet: "",
          source: "sessions",
        },
      ],
    }).length > 0
  );
}
async function searchWikiCorpus(params) {
  const digest = await readQueryDigestBundle(params.rootDir);
  const candidatePaths = digest
    ? buildDigestCandidatePaths({
        digest,
        query: params.query,
        maxResults: params.maxResults,
        mode: params.mode,
      })
    : [];
  const seenPaths = /* @__PURE__ */ new Set();
  const candidatePages =
    candidatePaths.length > 0
      ? await readQueryableWikiPagesByPaths(params.rootDir, candidatePaths)
      : await readQueryableWikiPages(params.rootDir);
  for (const page of candidatePages) seenPaths.add(page.relativePath);
  const results = candidatePages
    .map((page) => toWikiSearchResult(page, params.query, params.mode))
    .filter((page) => page.score > 0);
  if (candidatePaths.length === 0 || results.length >= params.maxResults) return results;
  const remainingPaths = (await listWikiMarkdownFiles(params.rootDir)).filter(
    (relativePath) => !seenPaths.has(relativePath),
  );
  const remainingPages = await readQueryableWikiPagesByPaths(params.rootDir, remainingPaths);
  return [
    ...results,
    ...remainingPages
      .map((page) => toWikiSearchResult(page, params.query, params.mode))
      .filter((page) => page.score > 0),
  ];
}
function resolveDigestClaimLookup(digest, lookup) {
  const claimId = lookup.trim().replace(/^claim:/i, "");
  return digest.claims.find((claim) => claim.id === claimId)?.pagePath ?? null;
}
function resolveQueryableWikiPageByLookup(pages, lookup) {
  const key = normalizeLookupKey(lookup);
  const withExtension = key.endsWith(".md") ? key : `${key}.md`;
  return (
    pages.find((page) => page.relativePath === key) ??
    pages.find((page) => page.relativePath === withExtension) ??
    pages.find((page) => page.relativePath.replace(/\.md$/i, "") === key) ??
    pages.find((page) => path.basename(page.relativePath, ".md") === key) ??
    pages.find((page) => page.id === key) ??
    null
  );
}
async function searchMemoryWiki(params) {
  const effectiveConfig = applySearchOverrides(params.config, params);
  assertSessionVisibilityAppConfig({
    config: effectiveConfig,
    appConfig: params.appConfig,
    ...(params.agentId ? { agentId: params.agentId } : {}),
    agentSessionKey: params.agentSessionKey,
    sandboxed: params.sandboxed,
    operation: "wiki_search",
  });
  await initializeMemoryWikiVault(effectiveConfig);
  const maxResults = normalizePositiveInteger(params.maxResults, 10);
  const mode = params.mode ?? "auto";
  const wikiResults = shouldSearchWiki(effectiveConfig)
    ? await searchWikiCorpus({
        rootDir: effectiveConfig.vault.path,
        query: params.query,
        maxResults,
        mode,
      })
    : [];
  const sharedMemoryManager = shouldSearchSharedMemory(effectiveConfig, params.appConfig)
    ? await resolveActiveMemoryManager({
        appConfig: params.appConfig,
        agentId: params.agentId,
        agentSessionKey: params.agentSessionKey,
      })
    : null;
  if (sharedMemoryManager && typeof sharedMemoryManager.search !== "function")
    throw buildMemoryManagerContractError("search");
  let rawMemoryResults = sharedMemoryManager
    ? await sharedMemoryManager.search(params.query, { maxResults })
    : [];
  if (
    params.appConfig &&
    shouldEnforceSessionVisibility(params) &&
    rawMemoryResults.some((hit) => hit.source === "sessions")
  )
    rawMemoryResults = await filterMemoryWikiSearchHitsBySessionVisibility({
      cfg: params.appConfig,
      agentId: params.agentId,
      requesterSessionKey: params.agentSessionKey,
      sandboxed: params.sandboxed === true,
      hits: rawMemoryResults,
    });
  return mergeWikiSearchCorpusResults({
    wikiResults,
    memoryResults: rawMemoryResults.map((result) => toMemoryWikiSearchResult(result, mode)),
    maxResults,
    balanceCorpora: effectiveConfig.search.corpus === "all",
  });
}
async function getMemoryWikiPage(params) {
  const effectiveConfig = applySearchOverrides(params.config, params);
  assertSessionVisibilityAppConfig({
    config: effectiveConfig,
    appConfig: params.appConfig,
    ...(params.agentId ? { agentId: params.agentId } : {}),
    agentSessionKey: params.agentSessionKey,
    sandboxed: params.sandboxed,
    operation: "wiki_get",
  });
  await initializeMemoryWikiVault(effectiveConfig);
  const fromLine = normalizePositiveInteger(params.fromLine, 1);
  const lineCount = normalizePositiveInteger(params.lineCount, 200);
  if (shouldSearchWiki(effectiveConfig)) {
    const digest = await readQueryDigestBundle(effectiveConfig.vault.path);
    const digestClaimPagePath = digest ? resolveDigestClaimLookup(digest, params.lookup) : null;
    const digestLookupPage = digestClaimPagePath
      ? ((
          await readQueryableWikiPagesByPaths(effectiveConfig.vault.path, [digestClaimPagePath])
        )[0] ?? null)
      : null;
    const pages = digestLookupPage
      ? [digestLookupPage]
      : await readQueryableWikiPages(effectiveConfig.vault.path);
    const page = digestLookupPage ?? resolveQueryableWikiPageByLookup(pages, params.lookup);
    if (page) {
      const lines = parseWikiMarkdown(page.raw).body.split(/\r?\n/);
      const totalLines = lines.length;
      const slice = lines.slice(fromLine - 1, fromLine - 1 + lineCount).join("\n");
      const truncated = fromLine - 1 + lineCount < totalLines;
      return {
        corpus: "wiki",
        path: page.relativePath,
        title: page.title,
        kind: page.kind,
        content: slice,
        fromLine,
        lineCount,
        totalLines,
        truncated,
        ...buildWikiResultMetadata(page),
      };
    }
  }
  if (!shouldSearchSharedMemory(effectiveConfig, params.appConfig)) return null;
  const manager = await resolveActiveMemoryManager({
    appConfig: params.appConfig,
    agentId: params.agentId,
    agentSessionKey: params.agentSessionKey,
  });
  if (!manager) return null;
  if (typeof manager.readFile !== "function") throw buildMemoryManagerContractError("readFile");
  const lookupCandidates = buildLookupCandidates(params.lookup);
  const canReadSessionPath =
    params.appConfig &&
    shouldEnforceSessionVisibility(params) &&
    lookupCandidates.some((relPath) => isSessionMemoryPath(relPath))
      ? await createSessionMemoryPathVisibilityChecker({
          cfg: params.appConfig,
          agentId: params.agentId,
          requesterSessionKey: params.agentSessionKey,
          sandboxed: params.sandboxed === true,
        })
      : null;
  for (const relPath of lookupCandidates) {
    if (
      canReadSessionPath &&
      isSessionMemoryPath(relPath) &&
      !canReadSessionMemoryPath({
        canReadSessionPath,
        relPath,
      })
    )
      continue;
    try {
      const result = await manager.readFile({
        relPath,
        from: fromLine,
        lines: lineCount,
      });
      return {
        corpus: "memory",
        path: result.path,
        title: buildMemorySearchTitle(result.path),
        kind: "memory",
        content: result.text,
        fromLine,
        lineCount,
      };
    } catch {
      continue;
    }
  }
  return null;
}
//#endregion
//#region extensions/memory-wiki/src/apply.ts
const GENERATED_START = "<!-- openclaw:wiki:generated:start -->";
const GENERATED_END = "<!-- openclaw:wiki:generated:end -->";
const HUMAN_START = "<!-- openclaw:human:start -->";
const HUMAN_END = "<!-- openclaw:human:end -->";
function normalizeMutationConfidence(params, options) {
  if (options.allowNull && params.confidence === null) return null;
  return readFiniteNumberParam(params, "confidence", {
    min: 0,
    max: 1,
  });
}
function normalizeMemoryWikiMutationOp(op) {
  if (op === "synthesis") return "create_synthesis";
  if (op === "metadata") return "update_metadata";
  return op;
}
function normalizeMemoryWikiMutationInput(rawParams) {
  const params = rawParams;
  if (normalizeMemoryWikiMutationOp(params.op) === "create_synthesis") {
    if (!params.title?.trim())
      throw new Error("wiki mutation requires title for create_synthesis.");
    if (!params.body?.trim()) throw new Error("wiki mutation requires body for create_synthesis.");
    if (!params.sourceIds || params.sourceIds.length === 0)
      throw new Error("wiki mutation requires at least one sourceId for create_synthesis.");
    const confidence = normalizeMutationConfidence(params, { allowNull: false });
    return {
      op: "create_synthesis",
      title: params.title,
      body: params.body,
      sourceIds: params.sourceIds,
      ...(Array.isArray(params.claims) ? { claims: normalizeWikiClaims(params.claims) } : {}),
      ...(params.contradictions ? { contradictions: params.contradictions } : {}),
      ...(params.questions ? { questions: params.questions } : {}),
      ...(typeof confidence === "number" ? { confidence } : {}),
      ...(params.status ? { status: params.status } : {}),
    };
  }
  if (!params.lookup?.trim()) throw new Error("wiki mutation requires lookup for update_metadata.");
  const confidence = normalizeMutationConfidence(params, { allowNull: true });
  return {
    op: "update_metadata",
    lookup: params.lookup,
    ...(params.sourceIds ? { sourceIds: params.sourceIds } : {}),
    ...(Array.isArray(params.claims) ? { claims: normalizeWikiClaims(params.claims) } : {}),
    ...(params.contradictions ? { contradictions: params.contradictions } : {}),
    ...(params.questions ? { questions: params.questions } : {}),
    ...(confidence !== void 0 ? { confidence } : {}),
    ...(params.status ? { status: params.status } : {}),
  };
}
function normalizeUniqueStrings(values) {
  if (!values) return;
  return uniqueStrings(normalizeStringEntries(values));
}
function ensureHumanNotesBlock(body) {
  if (body.includes(HUMAN_START) && body.includes(HUMAN_END)) return body;
  const trimmed = body.trimEnd();
  return `${trimmed.length > 0 ? `${trimmed}\n\n` : ""}## Notes\n${HUMAN_START}\n${HUMAN_END}\n`;
}
function buildSynthesisBody(params) {
  return ensureHumanNotesBlock(
    replaceManagedMarkdownBlock({
      original: params.originalBody?.trim().length
        ? params.originalBody
        : `# ${params.title}\n\n## Notes\n${HUMAN_START}\n${HUMAN_END}\n`,
      heading: "## Summary",
      startMarker: GENERATED_START,
      endMarker: GENERATED_END,
      body: params.generatedBody,
    }),
  );
}
function isMissingWikiPageError(error) {
  return error instanceof FsSafeError && error.code === "not-found";
}
async function readExistingWikiPage(root, pagePath) {
  try {
    return await root.readText(pagePath);
  } catch {
    try {
      return await root.readText(pagePath);
    } catch (retryError) {
      if (isMissingWikiPageError(retryError)) return "";
      throw retryError;
    }
  }
}
async function writeWikiPage(params) {
  const root$2 = await root(params.rootDir);
  const rendered = withTrailingNewline(
    renderWikiMarkdown({
      frontmatter: params.frontmatter,
      body: params.body,
    }),
  );
  if ((await readExistingWikiPage(root$2, params.relativePath)) === rendered) return false;
  await root$2.write(params.relativePath, rendered);
  return true;
}
async function resolveWritablePage(params) {
  return resolveQueryableWikiPageByLookup(
    await readQueryableWikiPages(params.config.vault.path),
    params.lookup,
  );
}
async function applyCreateSynthesisMutation(params) {
  const slug = slugifyWikiSegment(params.mutation.title);
  const pageStem = slugifyWikiPageStem(params.mutation.title);
  const pagePath = path.join("syntheses", `${pageStem}.md`).replace(/\\/g, "/");
  const parsed = parseWikiMarkdown(
    await readExistingWikiPage(await root(params.config.vault.path), pagePath),
  );
  const pageId =
    (typeof parsed.frontmatter.id === "string" && parsed.frontmatter.id.trim()) ||
    `synthesis.${slug}`;
  return {
    changed: await writeWikiPage({
      rootDir: params.config.vault.path,
      relativePath: pagePath,
      frontmatter: {
        ...parsed.frontmatter,
        pageType: "synthesis",
        id: pageId,
        title: params.mutation.title,
        sourceIds: normalizeSourceIds(params.mutation.sourceIds),
        ...(params.mutation.claims ? { claims: normalizeWikiClaims(params.mutation.claims) } : {}),
        ...(normalizeUniqueStrings(params.mutation.contradictions)
          ? { contradictions: normalizeUniqueStrings(params.mutation.contradictions) }
          : {}),
        ...(normalizeUniqueStrings(params.mutation.questions)
          ? { questions: normalizeUniqueStrings(params.mutation.questions) }
          : {}),
        ...(typeof params.mutation.confidence === "number"
          ? { confidence: params.mutation.confidence }
          : {}),
        status: params.mutation.status?.trim() || "active",
        updatedAt: /* @__PURE__ */ new Date().toISOString(),
      },
      body: buildSynthesisBody({
        title: params.mutation.title,
        originalBody: parsed.body,
        generatedBody: params.mutation.body.trim(),
      }),
    }),
    pagePath,
    pageId,
  };
}
function buildUpdatedFrontmatter(params) {
  const frontmatter = {
    ...params.original,
    updatedAt: /* @__PURE__ */ new Date().toISOString(),
  };
  if (params.mutation.sourceIds)
    frontmatter.sourceIds = normalizeSourceIds(params.mutation.sourceIds);
  if (params.mutation.claims) {
    const claims = normalizeWikiClaims(params.mutation.claims);
    if (claims.length > 0) frontmatter.claims = claims;
    else delete frontmatter.claims;
  }
  if (params.mutation.contradictions) {
    const contradictions = normalizeUniqueStrings(params.mutation.contradictions) ?? [];
    if (contradictions.length > 0) frontmatter.contradictions = contradictions;
    else delete frontmatter.contradictions;
  }
  if (params.mutation.questions) {
    const questions = normalizeUniqueStrings(params.mutation.questions) ?? [];
    if (questions.length > 0) frontmatter.questions = questions;
    else delete frontmatter.questions;
  }
  if (params.mutation.confidence === null) delete frontmatter.confidence;
  else if (typeof params.mutation.confidence === "number")
    frontmatter.confidence = params.mutation.confidence;
  if (params.mutation.status?.trim()) frontmatter.status = params.mutation.status.trim();
  return frontmatter;
}
async function applyUpdateMetadataMutation(params) {
  const page = await resolveWritablePage({
    config: params.config,
    lookup: params.mutation.lookup,
  });
  if (!page) throw new Error(`Wiki page not found: ${params.mutation.lookup}`);
  const parsed = parseWikiMarkdown(page.raw);
  return {
    changed: await writeWikiPage({
      rootDir: params.config.vault.path,
      relativePath: page.relativePath,
      frontmatter: buildUpdatedFrontmatter({
        original: parsed.frontmatter,
        mutation: params.mutation,
      }),
      body: parsed.body,
    }),
    pagePath: page.relativePath,
    ...(page.id ? { pageId: page.id } : {}),
  };
}
async function applyMemoryWikiMutationUnlocked(params) {
  await initializeMemoryWikiVault(params.config);
  const result =
    params.mutation.op === "create_synthesis"
      ? await applyCreateSynthesisMutation({
          config: params.config,
          mutation: params.mutation,
        })
      : await applyUpdateMetadataMutation({
          config: params.config,
          mutation: params.mutation,
        });
  const compile = await compileMemoryWikiVault(params.config);
  return {
    changed: result.changed,
    operation: params.mutation.op,
    pagePath: result.pagePath,
    ...(result.pageId ? { pageId: result.pageId } : {}),
    compile,
  };
}
async function applyMemoryWikiMutation(params) {
  return await withMemoryWikiVaultMutation(params.config.vault.path, () =>
    applyMemoryWikiMutationUnlocked(params),
  );
}
//#endregion
//#region extensions/memory-wiki/src/chatgpt-import.ts
const CHATGPT_PREFERENCE_SIGNAL_RE =
  /\b(prefer|prefers|preference|want|wants|need|needs|avoid|avoids|hate|hates|love|loves|default to|should default to|always use|don't want|does not want|likes|dislikes)\b/i;
const HUMAN_START_MARKER = "<!-- openclaw:human:start -->";
const HUMAN_END_MARKER = "<!-- openclaw:human:end -->";
const CHATGPT_RISK_RULES = [
  {
    label: "relationships",
    pattern:
      /\b(relationship|dating|breakup|jealous|sex|intimacy|partner|apology|trust|boyfriend|girlfriend|husband|wife)\b/i,
  },
  {
    label: "health",
    pattern:
      /\b(supplement|medication|diagnosis|symptom|therapy|depression|anxiety|mri|migraine|injury|pain|cortisol|sleep)\b/i,
  },
  {
    label: "legal_tax",
    pattern:
      /\b(contract|tax|legal|law|lawsuit|visa|immigration|license|insurance|claim|non-residence|residency)\b/i,
  },
  {
    label: "finance",
    pattern:
      /\b(investment|invest|portfolio|dividend|yield|coupon|valuation|mortgage|loan|crypto|covered call|call option|put option)\b/i,
  },
  {
    label: "drugs",
    pattern: /\b(vape|weed|cannabis|nicotine|opioid|ketamine)\b/i,
  },
];
function asRecord(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value;
}
function normalizeWhitespace(value) {
  return value.trim().replace(/\s+/g, " ");
}
function isMissingConversationPageError(error) {
  return asRecord(error)?.code === "ENOENT";
}
async function readExistingConversationPage(absolutePath) {
  try {
    return await fs$1.readFile(absolutePath, "utf8");
  } catch {
    try {
      return await fs$1.readFile(absolutePath, "utf8");
    } catch (retryError) {
      if (isMissingConversationPageError(retryError)) return "";
      throw retryError;
    }
  }
}
function resolveConversationSourcePath(exportInputPath) {
  const resolved = path.resolve(exportInputPath);
  return {
    exportPath: resolved,
    conversationsPath: resolved.endsWith(".json")
      ? resolved
      : path.join(resolved, "conversations.json"),
  };
}
async function loadConversations(exportInputPath) {
  const { exportPath, conversationsPath } = resolveConversationSourcePath(exportInputPath);
  const raw = await fs$1.readFile(conversationsPath, "utf8");
  const parsed = JSON.parse(raw);
  if (Array.isArray(parsed))
    return {
      exportPath,
      conversationsPath,
      conversations: parsed.filter((entry) => asRecord(entry) !== null),
    };
  const record = asRecord(parsed);
  if (record) {
    for (const value of Object.values(record))
      if (Array.isArray(value))
        return {
          exportPath,
          conversationsPath,
          conversations: value.filter((entry) => asRecord(entry) !== null),
        };
  }
  throw new Error(`Unrecognized ChatGPT conversations export format: ${conversationsPath}`);
}
function isoFromUnix(raw) {
  if (typeof raw !== "number" && typeof raw !== "string") return;
  const numeric = Number(raw);
  if (!Number.isFinite(numeric)) return;
  return timestampMsToIsoString(numeric * 1e3);
}
function cleanMessageText(value) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (
    (trimmed.includes("asset_pointer") ||
      trimmed.includes("image_asset_pointer") ||
      trimmed.includes("dalle") ||
      trimmed.includes("file_service")) &&
    trimmed.length > 40
  )
    return "";
  if (
    trimmed.startsWith("{") &&
    trimmed.length > 80 &&
    (trimmed.includes(":") || trimmed.includes("content_type"))
  ) {
    const textMatch = trimmed.match(/["']text["']\s*:\s*(["'])(.+?)\1/s);
    return textMatch?.[2] ? normalizeWhitespace(textMatch[2]) : "";
  }
  return trimmed;
}
function extractMessageText(message) {
  const content = asRecord(message.content);
  if (content) {
    const parts = content.parts;
    if (Array.isArray(parts)) {
      const collected = [];
      for (const part of parts) {
        if (typeof part === "string") {
          const cleaned = cleanMessageText(part);
          if (cleaned) collected.push(cleaned);
          continue;
        }
        const partRecord = asRecord(part);
        if (partRecord && typeof partRecord.text === "string" && partRecord.text.trim())
          collected.push(partRecord.text.trim());
      }
      return collected.join("\n").trim();
    }
    if (typeof content.text === "string") return cleanMessageText(content.text);
  }
  return typeof message.text === "string" ? cleanMessageText(message.text) : "";
}
function activeBranchMessages(conversation) {
  const mapping = asRecord(conversation.mapping);
  if (!mapping) return [];
  let currentNode =
    typeof conversation.current_node === "string" ? conversation.current_node : void 0;
  const seen = /* @__PURE__ */ new Set();
  const chain = [];
  while (currentNode && !seen.has(currentNode)) {
    seen.add(currentNode);
    const node = asRecord(mapping[currentNode]);
    if (!node) break;
    const message = asRecord(node.message);
    if (message) {
      const author = asRecord(message.author);
      const role = typeof author?.role === "string" ? author.role : "unknown";
      const text = extractMessageText(message);
      if (text)
        chain.push({
          role,
          text,
        });
    }
    currentNode = typeof node.parent === "string" ? node.parent : void 0;
  }
  return chain.toReversed();
}
function inferRisk(title, sampleText) {
  const blob = `${title}\n${sampleText}`.toLowerCase();
  const reasons = CHATGPT_RISK_RULES.filter((rule) => rule.pattern.test(blob)).map(
    (rule) => rule.label,
  );
  if (reasons.length > 0)
    return {
      level: "high",
      reasons: uniqueStrings(reasons),
    };
  if (/\b(career|job|salary|interview|offer|resume|cover letter)\b/i.test(blob))
    return {
      level: "medium",
      reasons: ["work_career"],
    };
  return {
    level: "low",
    reasons: [],
  };
}
function inferLabels(title, sampleText) {
  const blob = `${title}\n${sampleText}`.toLowerCase();
  const labels = /* @__PURE__ */ new Set(["domain/personal"]);
  const addAreaTopic = (area, topics) => {
    labels.add(area);
    for (const topic of topics) labels.add(topic);
  };
  const hasTranslation =
    /\b(translate|translation|traduc\w*|traducc\w*|traduç\w*|traducci[oó]n|traduccio|traducció|traduzione)\b/i.test(
      blob,
    );
  const hasLearning =
    /\b(anki|flashcards?|grammar|conjugat\w*|declension|pronunciation|vocab(?:ular(?:y|io))?|lesson|tutor|teacher|jlpt|kanji|hiragana|katakana|study|learn|practice)\b/i.test(
      blob,
    );
  const hasLanguageName =
    /\b(japanese|portuguese|catalan|castellano|espa[nñ]ol|franc[eé]s|french|italian|german|spanish)\b/i.test(
      blob,
    );
  if (hasTranslation) labels.add("topic/translation");
  if (
    hasLearning ||
    (hasLanguageName && /\b(learn|study|practice|lesson|tutor|grammar)\b/i.test(blob))
  )
    addAreaTopic("area/language-learning", ["topic/language-learning"]);
  if (
    /\b(hike|trail|hotel|flight|trip|travel|airport|itinerary|booking|airbnb|train|stay)\b/i.test(
      blob,
    )
  ) {
    labels.add("area/travel");
    labels.add("topic/travel");
  }
  if (
    /\b(recipe|cook|cooking|bread|sourdough|pizza|espresso|coffee|mousse|cast iron|meatballs?)\b/i.test(
      blob,
    )
  )
    addAreaTopic("area/cooking", ["topic/cooking"]);
  if (
    /\b(garden|orchard|plant|soil|compost|agroforestry|permaculture|mulch|beds?|irrigation|seeds?)\b/i.test(
      blob,
    )
  )
    addAreaTopic("area/gardening", ["topic/gardening"]);
  if (/\b(dating|relationship|partner|jealous|breakup|trust)\b/i.test(blob))
    addAreaTopic("area/relationships", ["topic/relationships"]);
  if (
    /\b(investment|invest|portfolio|dividend|yield|coupon|valuation|return|mortgage|loan|kraken|crypto|covered call|call option|put option|option chain|bond|stocks?)\b/i.test(
      blob,
    )
  )
    addAreaTopic("area/finance", ["topic/finance"]);
  if (
    /\b(contract|mou|tax|impuesto|legal|law|lawsuit|visa|immigration|license|licencia|dispute|claim|insurance|non-residence|residency)\b/i.test(
      blob,
    )
  )
    addAreaTopic("area/legal-tax", ["topic/legal-tax"]);
  if (
    /\b(supplement|medication|diagnos(?:is|e)|symptom|therapy|depress(?:ion|ed)|anxiet(?:y|ies)|mri|migraine|injur(?:y|ies)|pain|cortisol|sleep|dentist|dermatolog(?:ist|y))\b/i.test(
      blob,
    )
  )
    addAreaTopic("area/health", ["topic/health"]);
  if (
    /\b(book (an )?appointment|rebook|open (a )?new account|driving test|exam|gestor(?:a)?|itv)\b/i.test(
      blob,
    )
  )
    addAreaTopic("area/life-admin", ["topic/life-admin"]);
  if (/\b(frc|robot|robotics|wpilib|limelight|chiefdelphi)\b/i.test(blob))
    addAreaTopic("area/work", ["topic/robotics"]);
  else if (
    /\b(docker|git|python|node|npm|pip|sql|postgres|api|bug|stack trace|permission denied)\b/i.test(
      blob,
    )
  )
    addAreaTopic("area/work", ["topic/software"]);
  else if (/\b(job|interview|cover letter|resume|cv)\b/i.test(blob))
    addAreaTopic("area/work", ["topic/career"]);
  if (/\b(wifi|wi-fi|starlink|router|mesh|network|orbi|milesight|coverage)\b/i.test(blob))
    addAreaTopic("area/home", ["topic/home-infrastructure"]);
  if (/\b(p38|range rover|porsche|bmw|bobcat|excavator|auger|trailer|chainsaw|stihl)\b/i.test(blob))
    addAreaTopic("area/vehicles", ["topic/vehicles"]);
  if (![...labels].some((label) => label.startsWith("area/"))) labels.add("area/other");
  return [...labels];
}
function collectPreferenceSignals(userTexts) {
  const signals = [];
  const seen = /* @__PURE__ */ new Set();
  for (const text of userTexts.slice(0, 25))
    for (const rawLine of text.split(/\r?\n/)) {
      const line = normalizeWhitespace(rawLine);
      if (!line || !CHATGPT_PREFERENCE_SIGNAL_RE.test(line)) continue;
      const key = line.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      signals.push(line);
      if (signals.length >= 10) return signals;
    }
  return signals;
}
function buildTranscript(messages) {
  if (messages.length === 0) return "_No active-branch transcript could be reconstructed._";
  return messages
    .flatMap((message) => [
      `### ${message.role[0]?.toUpperCase() ?? "U"}${message.role.slice(1)}`,
      "",
      message.text,
      "",
    ])
    .join("\n")
    .trim();
}
function resolveConversationPagePath(record) {
  const conversationSlug = record.conversationId.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  const pageId = `source.chatgpt.${conversationSlug || createHash("sha1").update(record.conversationId).digest("hex").slice(0, 12)}`;
  const datePrefix = record.createdAt?.slice(0, 10) ?? "undated";
  const shortId = conversationSlug.slice(0, 8) || "export";
  return {
    pageId,
    pagePath: path
      .join("sources", `chatgpt-${datePrefix}-${conversationSlug || shortId}.md`)
      .replace(/\\/g, "/"),
  };
}
function toConversationRecord(conversation, sourcePath) {
  const conversationId =
    typeof conversation.conversation_id === "string" ? conversation.conversation_id.trim() : "";
  if (!conversationId) return null;
  const title =
    typeof conversation.title === "string" && conversation.title.trim()
      ? conversation.title.trim()
      : "Untitled conversation";
  const transcript = activeBranchMessages(conversation);
  const userTexts = transcript.filter((entry) => entry.role === "user").map((entry) => entry.text);
  const assistantTexts = transcript.filter((entry) => entry.role === "assistant");
  const sampleText = userTexts.slice(0, 6).join("\n");
  const risk = inferRisk(title, sampleText);
  const labels = inferLabels(title, sampleText);
  const { pageId, pagePath } = resolveConversationPagePath({
    conversationId,
    createdAt: isoFromUnix(conversation.create_time),
  });
  return {
    conversationId,
    title,
    createdAt: isoFromUnix(conversation.create_time),
    updatedAt: isoFromUnix(conversation.update_time) ?? isoFromUnix(conversation.create_time),
    sourcePath,
    pageId,
    pagePath,
    labels,
    risk,
    userMessageCount: userTexts.length,
    assistantMessageCount: assistantTexts.length,
    preferenceSignals: risk.level === "low" ? collectPreferenceSignals(userTexts) : [],
    firstUserLine: userTexts[0]?.split(/\r?\n/)[0]?.trim(),
    lastUserLine: userTexts.at(-1)?.split(/\r?\n/)[0]?.trim(),
    transcript,
  };
}
function renderConversationPage(record) {
  const autoDigestLines =
    record.risk.level === "low"
      ? [
          `- User messages: ${record.userMessageCount}`,
          `- Assistant messages: ${record.assistantMessageCount}`,
          ...(record.firstUserLine ? [`- First user line: ${record.firstUserLine}`] : []),
          ...(record.lastUserLine ? [`- Last user line: ${record.lastUserLine}`] : []),
          ...(record.preferenceSignals.length > 0
            ? ["- Preference signals:", ...record.preferenceSignals.map((line) => `  - ${line}`)]
            : ["- Preference signals: none detected"]),
        ]
      : [
          "- Auto digest withheld from durable-candidate generation until reviewed.",
          `- Risk reasons: ${record.risk.reasons.length > 0 ? record.risk.reasons.join(", ") : "none recorded"}`,
        ];
  return renderWikiMarkdown({
    frontmatter: {
      pageType: "source",
      id: record.pageId,
      title: `ChatGPT Export: ${record.title}`,
      sourceType: "chatgpt-export",
      sourceSystem: "chatgpt",
      sourcePath: record.sourcePath,
      conversationId: record.conversationId,
      riskLevel: record.risk.level,
      riskReasons: record.risk.reasons,
      labels: record.labels,
      status: "draft",
      ...(record.createdAt ? { createdAt: record.createdAt } : {}),
      ...(record.updatedAt ? { updatedAt: record.updatedAt } : {}),
    },
    body: [
      `# ChatGPT Export: ${record.title}`,
      "",
      "## Source",
      `- Conversation id: \`${record.conversationId}\``,
      `- Export file: \`${record.sourcePath}\``,
      ...(record.createdAt ? [`- Created: ${record.createdAt}`] : []),
      ...(record.updatedAt ? [`- Updated: ${record.updatedAt}`] : []),
      "",
      "## Auto Triage",
      `- Risk level: \`${record.risk.level}\``,
      `- Labels: ${record.labels.join(", ")}`,
      `- Active-branch messages: ${record.transcript.length}`,
      "",
      "## Auto Digest",
      ...autoDigestLines,
      "",
      "## Active Branch Transcript",
      buildTranscript(record.transcript),
      "",
      "## Notes",
      HUMAN_START_MARKER,
      HUMAN_END_MARKER,
      "",
    ].join("\n"),
  });
}
function replaceSimpleManagedBlock(params) {
  const escapedStart = params.startMarker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const escapedEnd = params.endMarker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const blockPattern = new RegExp(`${escapedStart}[\\s\\S]*?${escapedEnd}`);
  return params.original.replace(blockPattern, () => params.replacement);
}
function extractSimpleManagedBlock(params) {
  const escapedStart = params.startMarker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const escapedEnd = params.endMarker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const blockPattern = new RegExp(`${escapedStart}[\\s\\S]*?${escapedEnd}`);
  return params.body.match(blockPattern)?.[0] ?? null;
}
function extractManagedBlockBody(params) {
  const escapedStart = params.startMarker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const escapedEnd = params.endMarker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const blockPattern = new RegExp(`${escapedStart}\\n?([\\s\\S]*?)\\n?${escapedEnd}`);
  const captured = params.body.match(blockPattern)?.[1];
  return typeof captured === "string" ? captured.trim() : null;
}
function preserveExistingPageBlocks(rendered, existing) {
  if (!existing.trim()) return withTrailingNewline(rendered);
  const parsedExisting = parseWikiMarkdown(existing);
  const parsedRendered = parseWikiMarkdown(rendered);
  let nextBody = parsedRendered.body;
  const humanBlock = extractSimpleManagedBlock({
    body: parsedExisting.body,
    startMarker: HUMAN_START_MARKER,
    endMarker: HUMAN_END_MARKER,
  });
  if (humanBlock)
    nextBody = replaceSimpleManagedBlock({
      original: nextBody,
      startMarker: HUMAN_START_MARKER,
      endMarker: HUMAN_END_MARKER,
      replacement: humanBlock,
    });
  const relatedBody = extractManagedBlockBody({
    body: parsedExisting.body,
    startMarker: WIKI_RELATED_START_MARKER,
    endMarker: WIKI_RELATED_END_MARKER,
  });
  if (relatedBody)
    nextBody = replaceManagedMarkdownBlock({
      original: nextBody,
      heading: "## Related",
      startMarker: WIKI_RELATED_START_MARKER,
      endMarker: WIKI_RELATED_END_MARKER,
      body: relatedBody,
    });
  return withTrailingNewline(
    renderWikiMarkdown({
      frontmatter: parsedRendered.frontmatter,
      body: nextBody,
    }),
  );
}
function buildRunId(exportPath, nowIso) {
  const seed = `${exportPath}:${nowIso}:${Math.random()}`;
  return `chatgpt-${createHash("sha1").update(seed).digest("hex").slice(0, 12)}`;
}
function normalizeConversationActions(records, operations) {
  return records.map((record) => ({
    conversationId: record.conversationId,
    title: record.title,
    pagePath: record.pagePath,
    operation: operations.get(record.pagePath) ?? "skip",
    riskLevel: record.risk.level,
    labels: record.labels,
    userMessageCount: record.userMessageCount,
    assistantMessageCount: record.assistantMessageCount,
    preferenceSignals: record.preferenceSignals,
  }));
}
async function writeImportRunRecord(vaultRoot, record) {
  await writeMemoryWikiImportRunRecord(vaultRoot, record);
}
async function readImportRunRecord(vaultRoot, runId) {
  const record = await readMemoryWikiImportRunRecord(vaultRoot, runId);
  if (!record) throw new Error(`Memory Wiki import run not found: ${runId}`);
  return record;
}
async function writeTrackedImportPage(params) {
  const absolutePath = path.join(params.vaultRoot, params.relativePath);
  if (params.existing === params.rendered) return "skip";
  await fs$1.mkdir(path.dirname(absolutePath), { recursive: true });
  if (!params.existing) {
    await fs$1.writeFile(absolutePath, params.rendered, "utf8");
    params.record.createdPaths.push(params.relativePath);
    return "create";
  }
  const snapshotHash = createHash("sha1").update(params.relativePath).digest("hex").slice(0, 12);
  const snapshotRelativePath = path.join("snapshots", `${snapshotHash}.md`).replace(/\\/g, "/");
  const snapshotAbsolutePath = path.join(params.runDir, snapshotRelativePath);
  await fs$1.mkdir(path.dirname(snapshotAbsolutePath), { recursive: true });
  await fs$1.writeFile(snapshotAbsolutePath, params.existing, "utf8");
  await fs$1.writeFile(absolutePath, params.rendered, "utf8");
  params.record.updatedPaths.push({
    path: params.relativePath,
    snapshotPath: snapshotRelativePath,
  });
  return "update";
}
async function importChatGptConversations(params) {
  await initializeMemoryWikiVault(params.config, { nowMs: params.nowMs });
  const { exportPath, conversationsPath, conversations } = await loadConversations(
    params.exportPath,
  );
  const records = conversations
    .map((conversation) => toConversationRecord(conversation, conversationsPath))
    .filter((entry) => entry !== null)
    .toSorted((left, right) => left.pagePath.localeCompare(right.pagePath));
  const operations = /* @__PURE__ */ new Map();
  let createdCount = 0;
  let updatedCount = 0;
  let skippedCount = 0;
  let runId;
  const nowIso = resolveMemoryWikiTimestamp(params.nowMs);
  const importPlans = [];
  for (const record of records) {
    const rendered = renderConversationPage(record);
    const existing = await readExistingConversationPage(
      path.join(params.config.vault.path, record.pagePath),
    );
    const stabilized = preserveExistingPageBlocks(rendered, existing);
    const operation = existing === stabilized ? "skip" : existing ? "update" : "create";
    operations.set(record.pagePath, operation);
    if (operation === "create") createdCount += 1;
    else if (operation === "update") updatedCount += 1;
    else skippedCount += 1;
    importPlans.push({
      relativePath: record.pagePath,
      existing,
      rendered: stabilized,
      operation,
    });
  }
  let importRunRecord;
  const changedCount = createdCount + updatedCount;
  if (!params.dryRun && changedCount > 0) {
    const requiredStateRows = 1 + changedCount;
    const projectedStateRows = (await countMemoryWikiImportRunStateRows()) + requiredStateRows;
    if (projectedStateRows > 2e4)
      throw new Error(
        `Memory Wiki ChatGPT import exceeds SQLite import-run entry limit (${projectedStateRows}/${MEMORY_WIKI_IMPORT_RUN_STATE_MAX_ENTRIES})`,
      );
    runId = buildRunId(exportPath, nowIso);
    const importRunDir = path.join(resolveMemoryWikiImportRunsDir(params.config.vault.path), runId);
    importRunRecord = {
      version: 1,
      runId,
      importType: "chatgpt",
      exportPath,
      sourcePath: conversationsPath,
      appliedAt: nowIso,
      conversationCount: records.length,
      createdCount,
      updatedCount,
      skippedCount,
      createdPaths: [],
      updatedPaths: [],
    };
    for (const plan of importPlans) {
      if (plan.operation === "skip") continue;
      await writeTrackedImportPage({
        vaultRoot: params.config.vault.path,
        runDir: importRunDir,
        relativePath: plan.relativePath,
        existing: plan.existing,
        rendered: plan.rendered,
        record: importRunRecord,
      });
    }
  }
  let indexUpdatedFiles = [];
  if (!params.dryRun && importRunRecord)
    if (importRunRecord.createdPaths.length > 0 || importRunRecord.updatedPaths.length > 0) {
      indexUpdatedFiles = (await compileMemoryWikiVault(params.config)).updatedFiles;
      await writeImportRunRecord(params.config.vault.path, importRunRecord);
      await appendMemoryWikiLog(params.config.vault.path, {
        type: "ingest",
        timestamp: nowIso,
        details: {
          sourceType: "chatgpt-export",
          runId: importRunRecord.runId,
          exportPath,
          sourcePath: conversationsPath,
          conversationCount: records.length,
          createdCount: importRunRecord.createdPaths.length,
          updatedCount: importRunRecord.updatedPaths.length,
          skippedCount,
        },
      });
    } else runId = void 0;
  return {
    dryRun: Boolean(params.dryRun),
    exportPath,
    sourcePath: conversationsPath,
    conversationCount: records.length,
    createdCount,
    updatedCount,
    skippedCount,
    actions: normalizeConversationActions(records, operations),
    pagePaths: records.map((record) => record.pagePath),
    ...(runId ? { runId } : {}),
    indexUpdatedFiles,
  };
}
async function rollbackChatGptImportRun(params) {
  await initializeMemoryWikiVault(params.config);
  const record = await readImportRunRecord(params.config.vault.path, params.runId);
  if (record.rolledBackAt)
    return {
      runId: record.runId,
      removedCount: 0,
      restoredCount: 0,
      pagePaths: [
        ...record.createdPaths,
        ...record.updatedPaths.map((entry) => entry.path),
      ].toSorted((left, right) => left.localeCompare(right)),
      indexUpdatedFiles: [],
      alreadyRolledBack: true,
    };
  let removedCount = 0;
  for (const relativePath of record.createdPaths) {
    await fs$1
      .rm(path.join(params.config.vault.path, relativePath), { force: true })
      .catch(() => void 0);
    removedCount += 1;
  }
  let restoredCount = 0;
  const runDir = path.join(resolveMemoryWikiImportRunsDir(params.config.vault.path), record.runId);
  for (const entry of record.updatedPaths) {
    if (!entry.snapshotPath) continue;
    const snapshotPath = path.join(runDir, entry.snapshotPath);
    const snapshot = await fs$1.readFile(snapshotPath, "utf8");
    const targetPath = path.join(params.config.vault.path, entry.path);
    await fs$1.mkdir(path.dirname(targetPath), { recursive: true });
    await fs$1.writeFile(targetPath, snapshot, "utf8");
    restoredCount += 1;
  }
  const compile = await compileMemoryWikiVault(params.config);
  record.rolledBackAt = /* @__PURE__ */ new Date().toISOString();
  await writeImportRunRecord(params.config.vault.path, record);
  await appendMemoryWikiLog(params.config.vault.path, {
    type: "ingest",
    timestamp: record.rolledBackAt,
    details: {
      sourceType: "chatgpt-export",
      runId: record.runId,
      rollback: true,
      removedCount,
      restoredCount,
    },
  });
  return {
    runId: record.runId,
    removedCount,
    restoredCount,
    pagePaths: [...record.createdPaths, ...record.updatedPaths.map((entry) => entry.path)].toSorted(
      (left, right) => left.localeCompare(right),
    ),
    indexUpdatedFiles: compile.updatedFiles,
    alreadyRolledBack: false,
  };
}
//#endregion
//#region extensions/memory-wiki/src/ingest.ts
function resolveSourceTitle(sourcePath, explicitTitle) {
  if (explicitTitle?.trim()) return explicitTitle.trim();
  return path.basename(sourcePath, path.extname(sourcePath)).replace(/[-_]+/g, " ").trim();
}
function assertUtf8Text(buffer, sourcePath) {
  if (buffer.subarray(0, Math.min(buffer.length, 4096)).includes(0))
    throw new Error(`Cannot ingest binary file as markdown source: ${sourcePath}`);
  return buffer.toString("utf8");
}
function isEmptyExistingSourcePage(error) {
  return (
    typeof error === "object" &&
    error !== null &&
    (error.code === "ENOENT" || error.code === "EISDIR")
  );
}
async function readExistingSourcePage(pagePath) {
  let readError;
  for (let attempt = 0; attempt < 2; attempt += 1)
    try {
      return await fs$1.readFile(pagePath, "utf8");
    } catch (error) {
      readError = error;
    }
  if (isEmptyExistingSourcePage(readError)) return "";
  throw readError;
}
async function ingestMemoryWikiSource(params) {
  await initializeMemoryWikiVault(params.config, { nowMs: params.nowMs });
  const sourcePath = path.resolve(params.inputPath);
  const buffer = await fs$1.readFile(sourcePath);
  const content = assertUtf8Text(buffer, sourcePath);
  const title = resolveSourceTitle(sourcePath, params.title);
  const slug = slugifyWikiSegment(title);
  const pageStem = slugifyWikiPageStem(title);
  const pageId = `source.${slug}`;
  const pageRelativePath = path.join("sources", `${pageStem}.md`);
  const pagePath = path.join(params.config.vault.path, pageRelativePath);
  const created = !(await pathExists(pagePath));
  const timestamp = resolveMemoryWikiTimestamp(params.nowMs);
  const markdown = renderWikiMarkdown({
    frontmatter: {
      pageType: "source",
      id: pageId,
      title,
      sourceType: "local-file",
      sourcePath,
      ingestedAt: timestamp,
      updatedAt: timestamp,
      status: "active",
    },
    body: [
      `# ${title}`,
      "",
      "## Source",
      `- Type: \`local-file\``,
      `- Path: \`${sourcePath}\``,
      `- Bytes: ${buffer.byteLength}`,
      `- Updated: ${timestamp}`,
      "",
      "## Content",
      renderMarkdownFence(content, "text"),
      "",
      "## Notes",
      "<!-- openclaw:human:start -->",
      "<!-- openclaw:human:end -->",
      "",
    ].join("\n"),
  });
  const existing = created ? "" : await readExistingSourcePage(pagePath);
  await fs$1.writeFile(
    pagePath,
    existing ? preserveHumanNotesBlock(markdown, existing) : markdown,
    "utf8",
  );
  await appendMemoryWikiLog(params.config.vault.path, {
    type: "ingest",
    timestamp,
    details: {
      inputPath: sourcePath,
      pageId,
      pagePath: pageRelativePath.split(path.sep).join("/"),
      bytes: buffer.byteLength,
      created,
    },
  });
  const compile = await compileMemoryWikiVault(params.config);
  return {
    sourcePath,
    pageId,
    pagePath: pageRelativePath.split(path.sep).join("/"),
    title,
    bytes: buffer.byteLength,
    created,
    indexUpdatedFiles: compile.updatedFiles,
  };
}
//#endregion
//#region extensions/memory-wiki/src/lint.ts
function toExpectedPageType(page) {
  return page.kind;
}
function isUnmanagedRawSourcePage(page, managedImportedSourcePagePaths) {
  return (
    isUnmanagedRawSourceSummary(page) && !managedImportedSourcePagePaths.has(page.relativePath)
  );
}
function normalizeLintPathTarget(value) {
  return normalizeLintTarget(value, { stripQuery: true });
}
function normalizeLintAliasTextTarget(value) {
  return normalizeLintTarget(value, { stripQuery: false });
}
function normalizeLintTarget(value, options) {
  const withoutFragment = value.trim().replace(/\\/g, "/").split("#")[0] ?? "";
  return (options.stripQuery ? (withoutFragment.split("?")[0] ?? "") : withoutFragment)
    .replace(/\.md$/i, "")
    .replace(/^\.\/+/, "")
    .replace(/^\/+/, "")
    .replace(/\/+$/, "")
    .trim();
}
function normalizeLintAliasTarget(value) {
  return normalizeLowercaseStringOrEmpty(normalizeLintAliasTextTarget(value));
}
function hasLintTargetQuery(value) {
  return (value.trim().replace(/\\/g, "/").split("#")[0] ?? "").includes("?");
}
function isLintPathStyleTarget(value) {
  const withoutQuery = (value.trim().replace(/\\/g, "/").split("#")[0] ?? "").split("?")[0] ?? "";
  return (
    withoutQuery.startsWith("/") ||
    withoutQuery.startsWith("./") ||
    withoutQuery.includes("/") ||
    /\.md$/i.test(withoutQuery)
  );
}
function addPathTarget(index, raw) {
  const normalized = raw ? normalizeLintPathTarget(raw) : "";
  if (!normalized) return;
  index.pathTargets.add(normalized);
  index.pathTargets.add(path.posix.basename(normalized));
}
function addAliasTarget(index, raw) {
  const normalized = raw ? normalizeLintAliasTarget(raw) : "";
  if (normalized) index.aliasTargets.add(normalized);
}
function addSlugAliasTarget(index, raw) {
  const normalized = raw ? normalizeLintAliasTextTarget(raw) : "";
  if (normalized) index.aliasTargets.add(slugifyWikiSegment(normalized));
}
function addTitleTarget(index, raw) {
  addAliasTarget(index, raw);
  addSlugAliasTarget(index, raw);
}
function addPathSuffixTargets(index, raw) {
  const normalized = raw ? normalizeLintPathTarget(raw) : "";
  if (!normalized) return;
  const parts = normalized.split("/").filter(Boolean);
  for (let partIndex = 0; partIndex < parts.length; partIndex += 1) {
    const suffix = parts.slice(partIndex).join("/");
    addPathTarget(index, suffix);
    addSlugAliasTarget(index, suffix);
  }
}
function buildWikiLinkTargetIndex(pages) {
  const index = {
    pathTargets: /* @__PURE__ */ new Set(),
    aliasTargets: /* @__PURE__ */ new Set(),
  };
  for (const page of pages) {
    addPathTarget(index, page.relativePath);
    addTitleTarget(index, page.title);
    addPathSuffixTargets(index, page.sourcePath);
    addPathSuffixTargets(index, page.bridgeRelativePath);
    addPathSuffixTargets(index, page.unsafeLocalRelativePath);
  }
  return index;
}
function hasValidWikiLinkTarget(index, rawTarget) {
  const pathTarget = normalizeLintPathTarget(rawTarget);
  if (!pathTarget) return true;
  if (
    index.pathTargets.has(pathTarget) &&
    (!hasLintTargetQuery(rawTarget) || isLintPathStyleTarget(rawTarget))
  )
    return true;
  if (pathTarget.includes("/")) return false;
  return (
    index.aliasTargets.has(normalizeLintAliasTarget(rawTarget)) ||
    index.aliasTargets.has(slugifyWikiSegment(normalizeLintAliasTextTarget(rawTarget)))
  );
}
function collectBrokenLinkIssues(pages) {
  const validTargets = buildWikiLinkTargetIndex(pages);
  const issues = [];
  for (const page of pages)
    for (const linkTarget of page.linkTargets)
      if (!hasValidWikiLinkTarget(validTargets, linkTarget))
        issues.push({
          severity: "warning",
          category: "links",
          code: "broken-wikilink",
          path: page.relativePath,
          message: `Broken wikilink target \`${linkTarget}\`.`,
        });
  return issues;
}
function collectPageIssues(pages, managedImportedSourcePagePaths) {
  const issues = [];
  const pagesById = /* @__PURE__ */ new Map();
  const claimHealth = collectWikiClaimHealth(pages);
  for (const page of pages) {
    const requiresStructuredPageMetadata = !isUnmanagedRawSourcePage(
      page,
      managedImportedSourcePagePaths,
    );
    if (!page.id) {
      if (requiresStructuredPageMetadata)
        issues.push({
          severity: "error",
          category: "structure",
          code: "missing-id",
          path: page.relativePath,
          message: "Missing `id` frontmatter.",
        });
    } else {
      const current = pagesById.get(page.id) ?? [];
      current.push(page);
      pagesById.set(page.id, current);
    }
    if (!page.pageType) {
      if (requiresStructuredPageMetadata)
        issues.push({
          severity: "error",
          category: "structure",
          code: "missing-page-type",
          path: page.relativePath,
          message: "Missing `pageType` frontmatter.",
        });
    } else if (page.pageType !== toExpectedPageType(page))
      issues.push({
        severity: "error",
        category: "structure",
        code: "page-type-mismatch",
        path: page.relativePath,
        message: `Expected pageType \`${toExpectedPageType(page)}\`, found \`${page.pageType}\`.`,
      });
    if (!page.title.trim())
      issues.push({
        severity: "error",
        category: "structure",
        code: "missing-title",
        path: page.relativePath,
        message: "Missing page title.",
      });
    if (page.kind !== "source" && page.kind !== "report" && page.sourceIds.length === 0)
      issues.push({
        severity: "warning",
        category: "provenance",
        code: "missing-source-ids",
        path: page.relativePath,
        message: "Non-source page is missing `sourceIds` provenance.",
      });
    if (
      (page.sourceType === "memory-bridge" || page.sourceType === "memory-bridge-events") &&
      (!page.sourcePath || !page.bridgeRelativePath || !page.bridgeWorkspaceDir)
    )
      issues.push({
        severity: "warning",
        category: "provenance",
        code: "missing-import-provenance",
        path: page.relativePath,
        message:
          "Bridge-imported source page is missing `sourcePath`, `bridgeRelativePath`, or `bridgeWorkspaceDir` provenance.",
      });
    if (
      (page.provenanceMode === "unsafe-local" || page.sourceType === "memory-unsafe-local") &&
      (!page.sourcePath || !page.unsafeLocalConfiguredPath || !page.unsafeLocalRelativePath)
    )
      issues.push({
        severity: "warning",
        category: "provenance",
        code: "missing-import-provenance",
        path: page.relativePath,
        message:
          "Unsafe-local source page is missing `sourcePath`, `unsafeLocalConfiguredPath`, or `unsafeLocalRelativePath` provenance.",
      });
    if (page.contradictions.length > 0)
      issues.push({
        severity: "warning",
        category: "contradictions",
        code: "contradiction-present",
        path: page.relativePath,
        message: `Page lists ${page.contradictions.length} contradiction${page.contradictions.length === 1 ? "" : "s"} to resolve.`,
      });
    if (page.questions.length > 0)
      issues.push({
        severity: "warning",
        category: "open-questions",
        code: "open-question",
        path: page.relativePath,
        message: `Page lists ${page.questions.length} open question${page.questions.length === 1 ? "" : "s"}.`,
      });
    if (typeof page.confidence === "number" && page.confidence < 0.5)
      issues.push({
        severity: "warning",
        category: "quality",
        code: "low-confidence",
        path: page.relativePath,
        message: `Page confidence is low (${page.confidence.toFixed(2)}).`,
      });
    const freshness = assessPageFreshness(page);
    if (
      requiresStructuredPageMetadata &&
      page.kind !== "report" &&
      (freshness.level === "stale" || freshness.level === "unknown")
    )
      issues.push({
        severity: "warning",
        category: "quality",
        code: "stale-page",
        path: page.relativePath,
        message: `Page freshness needs review (${freshness.reason}).`,
      });
  }
  for (const claim of claimHealth) {
    if (claim.missingEvidence)
      issues.push({
        severity: "warning",
        category: "provenance",
        code: "claim-missing-evidence",
        path: claim.pagePath,
        message: `Claim ${claim.claimId ? `\`${claim.claimId}\`` : `\`${claim.text}\``} is missing structured evidence.`,
      });
    if (typeof claim.confidence === "number" && claim.confidence < 0.5)
      issues.push({
        severity: "warning",
        category: "quality",
        code: "claim-low-confidence",
        path: claim.pagePath,
        message: `Claim ${claim.claimId ? `\`${claim.claimId}\`` : `\`${claim.text}\``} has low confidence (${claim.confidence.toFixed(2)}).`,
      });
    if (claim.freshness.level === "stale" || claim.freshness.level === "unknown")
      issues.push({
        severity: "warning",
        category: "quality",
        code: "stale-claim",
        path: claim.pagePath,
        message: `Claim ${claim.claimId ? `\`${claim.claimId}\`` : `\`${claim.text}\``} freshness needs review (${claim.freshness.reason}).`,
      });
  }
  for (const cluster of buildClaimContradictionClusters({ pages }))
    for (const entry of cluster.entries)
      issues.push({
        severity: "warning",
        category: "contradictions",
        code: "claim-conflict",
        path: entry.pagePath,
        message: `Claim cluster \`${cluster.label}\` has competing variants across ${cluster.entries.length} pages.`,
      });
  for (const [id, matches] of pagesById.entries())
    if (matches.length > 1)
      for (const match of matches)
        issues.push({
          severity: "error",
          category: "structure",
          code: "duplicate-id",
          path: match.relativePath,
          message: `Duplicate page id \`${id}\`.`,
        });
  issues.push(...collectBrokenLinkIssues(pages));
  return issues.toSorted((left, right) => left.path.localeCompare(right.path));
}
function buildIssuesByCategory(issues) {
  return {
    structure: issues.filter((issue) => issue.category === "structure"),
    provenance: issues.filter((issue) => issue.category === "provenance"),
    links: issues.filter((issue) => issue.category === "links"),
    contradictions: issues.filter((issue) => issue.category === "contradictions"),
    "open-questions": issues.filter((issue) => issue.category === "open-questions"),
    quality: issues.filter((issue) => issue.category === "quality"),
  };
}
function buildLintReportBody(issues) {
  if (issues.length === 0) return "No issues found.";
  const errors = issues.filter((issue) => issue.severity === "error");
  const warnings = issues.filter((issue) => issue.severity === "warning");
  const byCategory = buildIssuesByCategory(issues);
  const lines = [`- Errors: ${errors.length}`, `- Warnings: ${warnings.length}`];
  if (errors.length > 0) {
    lines.push("", "### Errors");
    for (const issue of errors) lines.push(`- \`${issue.path}\`: ${issue.message}`);
  }
  if (warnings.length > 0) {
    lines.push("", "### Warnings");
    for (const issue of warnings) lines.push(`- \`${issue.path}\`: ${issue.message}`);
  }
  if (byCategory.contradictions.length > 0) {
    lines.push("", "### Contradictions");
    for (const issue of byCategory.contradictions)
      lines.push(`- \`${issue.path}\`: ${issue.message}`);
  }
  if (byCategory["open-questions"].length > 0) {
    lines.push("", "### Open Questions");
    for (const issue of byCategory["open-questions"])
      lines.push(`- \`${issue.path}\`: ${issue.message}`);
  }
  if (byCategory.provenance.length > 0 || byCategory.quality.length > 0) {
    lines.push("", "### Quality Follow-Up");
    for (const issue of [...byCategory.provenance, ...byCategory.quality])
      lines.push(`- \`${issue.path}\`: ${issue.message}`);
  }
  return lines.join("\n");
}
async function writeLintReport(rootDir, issues) {
  const reportPath = path.join(rootDir, "reports", "lint.md");
  const original = await fs$1.readFile(reportPath, "utf8").catch(() =>
    renderWikiMarkdown({
      frontmatter: {
        pageType: "report",
        id: "report.lint",
        title: "Lint Report",
        status: "active",
      },
      body: "# Lint Report\n",
    }),
  );
  parseWikiMarkdown(original);
  const updated = replaceManagedMarkdownBlock({
    original,
    heading: "## Generated",
    startMarker: "<!-- openclaw:wiki:lint:start -->",
    endMarker: "<!-- openclaw:wiki:lint:end -->",
    body: buildLintReportBody(issues),
  });
  await fs$1.writeFile(reportPath, withTrailingNewline(updated), "utf8");
  return reportPath;
}
async function lintMemoryWikiVault(config) {
  const compileResult = await compileMemoryWikiVault(config);
  const sourceSyncState = await readMemoryWikiSourceSyncState(config.vault.path);
  const managedImportedSourcePagePaths = new Set(
    Object.values(sourceSyncState.entries).map((entry) => entry.pagePath.split(path.sep).join("/")),
  );
  const issues = [
    ...compileResult.frontmatterErrors.map((error) => ({
      severity: "error",
      category: "structure",
      code: "invalid-frontmatter",
      path: error.relativePath,
      message: `Frontmatter failed to parse: ${error.message}`,
    })),
    ...collectPageIssues(compileResult.pages, managedImportedSourcePagePaths),
  ].toSorted((left, right) => left.path.localeCompare(right.path));
  const issuesByCategory = buildIssuesByCategory(issues);
  const reportPath = await writeLintReport(config.vault.path, issues);
  await appendMemoryWikiLog(config.vault.path, {
    type: "lint",
    timestamp: /* @__PURE__ */ new Date().toISOString(),
    details: {
      issueCount: issues.length,
      reportPath: path.relative(config.vault.path, reportPath),
    },
  });
  return {
    vaultRoot: config.vault.path,
    issueCount: issues.length,
    issues,
    issuesByCategory,
    reportPath,
  };
}
//#endregion
//#region extensions/memory-wiki/src/obsidian.ts
async function isExecutableFile(inputPath) {
  try {
    await fs$1.access(inputPath, process.platform === "win32" ? constants.F_OK : constants.X_OK);
    return true;
  } catch {
    return false;
  }
}
async function resolveCommandOnPath(command) {
  const pathEntries = (process.env.PATH ?? "").split(path.delimiter).filter(Boolean);
  const windowsExts =
    process.platform === "win32"
      ? (process.env.PATHEXT?.split(";").filter(Boolean) ?? [".EXE", ".CMD", ".BAT"])
      : [""];
  if (command.includes(path.sep)) return (await isExecutableFile(command)) ? command : null;
  for (const dir of pathEntries)
    for (const extension of windowsExts) {
      const candidate = path.join(dir, extension ? `${command}${extension}` : command);
      if (await isExecutableFile(candidate)) return candidate;
    }
  return null;
}
function buildVaultPrefix(config) {
  return config.obsidian.vaultName ? [`vault=${config.obsidian.vaultName}`] : [];
}
async function probeObsidianCli(deps) {
  const command = await (deps?.resolveCommand ?? resolveCommandOnPath)("obsidian");
  return {
    available: command !== null,
    command,
  };
}
async function runObsidianCli(params) {
  const probe = await probeObsidianCli({
    resolveCommand: params.deps?.resolveCommand ?? resolveCommandOnPath,
  });
  if (!probe.command) throw new Error("Obsidian CLI is not available on PATH.");
  const argv = [...buildVaultPrefix(params.config), params.subcommand, ...(params.args ?? [])];
  const { stdout, stderr } = params.deps?.exec
    ? await params.deps.exec(probe.command, argv, { encoding: "utf8" })
    : await runExec(probe.command, argv, { logOutput: false });
  return {
    command: probe.command,
    argv,
    stdout,
    stderr,
  };
}
async function runObsidianSearch(params) {
  return await runObsidianCli({
    config: params.config,
    subcommand: "search",
    args: [`query=${params.query}`],
    deps: params.deps,
  });
}
async function runObsidianOpen(params) {
  return await runObsidianCli({
    config: params.config,
    subcommand: "open",
    args: [`path=${params.vaultPath}`],
    deps: params.deps,
  });
}
async function runObsidianCommand(params) {
  return await runObsidianCli({
    config: params.config,
    subcommand: "command",
    args: [`id=${params.id}`],
    deps: params.deps,
  });
}
async function runObsidianDaily(params) {
  return await runObsidianCli({
    config: params.config,
    subcommand: "daily",
    deps: params.deps,
  });
}
//#endregion
//#region extensions/memory-wiki/src/vault-page-write.ts
function isRegularFileStat(value) {
  if (!value || typeof value !== "object") return false;
  const stat = value;
  return (
    (typeof stat.isFile === "function" ? stat.isFile.call(stat) : stat.isFile === true) &&
    typeof stat.nlink === "number"
  );
}
const isConcurrentRewriteRace = (error) =>
  error instanceof FsSafeError && error.code === "path-mismatch";
/**
 * Write `content` to a vault page, breaking an accidental hardlink first, and map
 * fs-safe guard failures to a labeled error. A transient concurrent-rewrite race
 * is retried briefly; on exhaustion (or any other guard failure) the error
 * propagates so the caller's safety contract is unchanged.
 */
async function writeGuardedVaultPage(params) {
  try {
    await retryAsync(
      async () => {
        if (isRegularFileStat(params.pageStat) && params.pageStat.nlink > 1)
          await params.vault.remove(params.pagePath);
        await params.vault.write(params.pagePath, params.content);
      },
      {
        attempts: 3,
        minDelayMs: 25,
        maxDelayMs: 50,
        label: `memory-wiki write ${params.pageLabel} ${params.pagePath}`,
        shouldRetry: isConcurrentRewriteRace,
      },
    );
  } catch (error) {
    if (error instanceof FsSafeError) {
      if (error.code !== "symlink" && error.code !== "path-alias")
        throw new Error(
          `Refusing to write ${params.pageLabel} (${error.code}): ${params.pagePath}: ${error.message}`,
          { cause: error },
        );
      throw new Error(`Refusing to write ${params.pageLabel} through symlink: ${params.pagePath}`, {
        cause: error,
      });
    }
    throw error;
  }
}
//#endregion
//#region extensions/memory-wiki/src/okf.ts
const OKF_RESERVED_FILENAMES = /* @__PURE__ */ new Set(["index.md", "log.md"]);
const OKF_MARKDOWN_LINK_PATTERN = /(!?)\[([^\]]*)\]\(([^)]+)\)/g;
const OKF_FENCE_PATTERN = /^ {0,3}(`{3,}|~{3,})/;
const OKF_RELATED_SECTION_PATTERN = new RegExp(
  `\\n+## Related\\n${WIKI_RELATED_START_MARKER}[\\s\\S]*?${WIKI_RELATED_END_MARKER}\\n?`,
  "g",
);
const OKF_VOLATILE_TIMESTAMP_LINE_PATTERN = /^(?:importedAt|updatedAt): .*\n/gm;
const OKF_HASH_CHARS = 8;
function toPosixPath(value) {
  return value.split(path.sep).join("/");
}
function trimMarkdownExtension(value) {
  return value.replace(/\.md$/i, "");
}
function createOkfBundleKey(params) {
  const producerId =
    normalizeOptionalString(params.rootFrontmatter.id) ??
    normalizeOptionalString(params.rootFrontmatter.okf_id);
  if (producerId) return slugifyWikiSegment(producerId);
  const label =
    normalizeOptionalString(params.rootFrontmatter.name) ??
    normalizeOptionalString(params.rootFrontmatter.title) ??
    params.bundleName;
  const hash = createHash("sha1").update(params.bundlePath).digest("hex").slice(0, OKF_HASH_CHARS);
  return `${slugifyWikiSegment(label)}-${hash}`;
}
function createOkfPageStem(bundleKey, conceptId) {
  return `okf-${bundleKey}-${slugifyWikiSegment(conceptId.replace(/\//g, "-"))}-${createHash("sha1").update(conceptId).digest("hex").slice(0, OKF_HASH_CHARS)}`;
}
function createOkfPageIdentity(bundleKey, conceptId) {
  const fileName = createWikiPageFilename(createOkfPageStem(bundleKey, conceptId));
  return {
    pageId: `concept.${trimMarkdownExtension(fileName)}`,
    pagePath: `concepts/${fileName}`,
  };
}
async function collectOkfMarkdownFiles(rootDir, warnings) {
  async function walk(relativeDir) {
    const absoluteDir = path.join(rootDir, relativeDir);
    const entries = await fs$1.readdir(absoluteDir, { withFileTypes: true }).catch((err) => {
      warnings.push({
        code: "unreadable-entry",
        path: toPosixPath(relativeDir) || ".",
        message: err instanceof Error ? err.message : "Unable to read OKF directory.",
      });
      return [];
    });
    const files = [];
    for (const entry of entries.toSorted((left, right) => left.name.localeCompare(right.name))) {
      if (entry.name === ".git" || entry.name === "node_modules") continue;
      const relativePath = path.join(relativeDir, entry.name);
      if (entry.isDirectory()) {
        files.push(...(await walk(relativePath)));
        continue;
      }
      if (entry.isFile() && entry.name.endsWith(".md")) files.push(relativePath);
    }
    return files;
  }
  return (await walk("")).map(toPosixPath).toSorted((left, right) => left.localeCompare(right));
}
function parseOkfMarkdown(content, relativePath) {
  const normalizedContent = content.replace(/\r\n/g, "\n");
  try {
    return parseWikiMarkdown(normalizedContent);
  } catch (err) {
    return {
      frontmatter: {},
      body: normalizedContent,
      warning: {
        code: "invalid-concept",
        path: relativePath,
        message: err instanceof Error ? err.message : "Unable to parse OKF frontmatter.",
      },
    };
  }
}
async function readOkfTextFile(params) {
  const root$1 = await root(params.bundlePath);
  const stat = await root$1.stat(params.relativePath).catch((err) => {
    params.warnings.push({
      code: "unreadable-entry",
      path: params.relativePath,
      message: err instanceof Error ? err.message : "Unable to read OKF concept.",
    });
    return null;
  });
  if (!stat) return null;
  if (!isRegularFileStat(stat)) {
    params.warnings.push({
      code: "unreadable-entry",
      path: params.relativePath,
      message: "Refusing to import OKF concept through non-regular or hardlinked file.",
    });
    return null;
  }
  return await root$1.readText(params.relativePath).catch((err) => {
    params.warnings.push({
      code: "unreadable-entry",
      path: params.relativePath,
      message: err instanceof Error ? err.message : "Unable to read OKF concept.",
    });
    return null;
  });
}
function deriveOkfTitle(relativePath, frontmatter) {
  return (
    normalizeOptionalString(frontmatter.title) ??
    path.posix.basename(relativePath, ".md").replace(/[-_]+/g, " ").trim() ??
    trimMarkdownExtension(relativePath)
  );
}
function normalizeOkfConcept(params) {
  const parsed = parseOkfMarkdown(params.content, params.relativePath);
  if (parsed.warning) return { warning: parsed.warning };
  const type = normalizeOptionalString(parsed.frontmatter.type);
  if (!type)
    return {
      warning: {
        code: "missing-type",
        path: params.relativePath,
        message: "OKF concept is missing required non-empty type frontmatter.",
      },
    };
  const conceptId = trimMarkdownExtension(params.relativePath);
  const timestamp = normalizeOptionalString(parsed.frontmatter.timestamp);
  return {
    concept: {
      conceptId,
      relativePath: params.relativePath,
      absolutePath: path.join(params.bundlePath, params.relativePath),
      frontmatter: parsed.frontmatter,
      body: parsed.body,
      type,
      title: deriveOkfTitle(params.relativePath, parsed.frontmatter),
      ...(normalizeOptionalString(parsed.frontmatter.description)
        ? { description: normalizeOptionalString(parsed.frontmatter.description) }
        : {}),
      ...(normalizeOptionalString(parsed.frontmatter.resource)
        ? { resource: normalizeOptionalString(parsed.frontmatter.resource) }
        : {}),
      tags: normalizeSingleOrTrimmedStringList(parsed.frontmatter.tags),
      ...(timestamp ? { timestamp } : {}),
    },
  };
}
function splitMarkdownLinkDestination(target) {
  const trimmed = target.trim();
  if (trimmed.startsWith("<")) {
    const end = trimmed.indexOf(">");
    if (end > 0)
      return {
        destination: trimmed.slice(1, end),
        titleSuffix: trimmed.slice(end + 1),
      };
  }
  const match = trimmed.match(/^(\S+)(\s+[\s\S]+)?$/);
  return {
    destination: match?.[1] ?? trimmed,
    titleSuffix: match?.[2] ?? "",
  };
}
function resolveOkfMarkdownTarget(sourceRelativePath, target) {
  const { destination } = splitMarkdownLinkDestination(target);
  const trimmed = destination.trim();
  if (!trimmed || trimmed.startsWith("#") || /^[a-z][a-z0-9+.-]*:/i.test(trimmed)) return null;
  const rawTargetWithoutSuffix = trimmed.split("#")[0]?.split("?")[0]?.replace(/\\/g, "/").trim();
  const targetWithoutSuffix = safeDecodeOkfLinkPath(rawTargetWithoutSuffix);
  if (!targetWithoutSuffix || !targetWithoutSuffix.endsWith(".md")) return null;
  const conceptId = trimMarkdownExtension(
    targetWithoutSuffix.startsWith("/")
      ? path.posix.normalize(targetWithoutSuffix.slice(1))
      : path.posix.normalize(
          path.posix.join(path.posix.dirname(sourceRelativePath), targetWithoutSuffix),
        ),
  );
  return conceptId.startsWith("../") ? null : conceptId;
}
function safeDecodeOkfLinkPath(value) {
  if (!value) return "";
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
function getMarkdownDestinationSuffix(destination) {
  const queryIndex = destination.indexOf("?");
  const fragmentIndex = destination.indexOf("#");
  const suffixIndex =
    queryIndex === -1
      ? fragmentIndex
      : fragmentIndex === -1
        ? queryIndex
        : Math.min(queryIndex, fragmentIndex);
  return suffixIndex === -1 ? "" : destination.slice(suffixIndex);
}
function rewriteOkfMarkdownLinks(params) {
  const linkedConceptIds = [];
  const rewriteLinks = (markdown) =>
    markdown.replace(OKF_MARKDOWN_LINK_PATTERN, (match, imagePrefix, label, rawTarget) => {
      const conceptId = resolveOkfMarkdownTarget(params.sourceRelativePath, rawTarget);
      if (!conceptId) return match;
      const target = params.pageByConceptId.get(conceptId);
      if (!target) return match;
      linkedConceptIds.push(conceptId);
      const { destination, titleSuffix } = splitMarkdownLinkDestination(rawTarget);
      return `${imagePrefix}[${label}](${path.posix.relative(path.posix.dirname(params.sourcePagePath), target.pagePath)}${getMarkdownDestinationSuffix(destination)}${titleSuffix})`;
    });
  return {
    body: rewriteMarkdownOutsideCode(params.body, rewriteLinks),
    linkedConceptIds: uniqueStrings(linkedConceptIds),
  };
}
function rewriteMarkdownLineOutsideInlineCode(line, rewriteLinks) {
  let result = "";
  let cursor = 0;
  while (cursor < line.length) {
    const codeStart = line.indexOf("`", cursor);
    if (codeStart === -1) {
      result += rewriteLinks(line.slice(cursor));
      break;
    }
    result += rewriteLinks(line.slice(cursor, codeStart));
    const delimiter = line.slice(codeStart).match(/^`+/)?.[0] ?? "`";
    const codeEnd = line.indexOf(delimiter, codeStart + delimiter.length);
    if (codeEnd === -1) {
      result += line.slice(codeStart);
      break;
    }
    result += line.slice(codeStart, codeEnd + delimiter.length);
    cursor = codeEnd + delimiter.length;
  }
  return result;
}
function rewriteMarkdownOutsideCode(markdown, rewriteLinks) {
  const lines = markdown.split(/(\n)/);
  let inFence = false;
  let fenceDelimiter = "";
  return lines
    .map((line) => {
      if (line === "\n") return line;
      const fenceMatch = line.match(OKF_FENCE_PATTERN);
      if (fenceMatch) {
        const delimiter = fenceMatch[1] ?? "";
        const closesFence =
          inFence &&
          delimiter.startsWith(fenceDelimiter[0] ?? "") &&
          delimiter.length >= fenceDelimiter.length;
        if (!inFence) {
          inFence = true;
          fenceDelimiter = delimiter;
        } else if (closesFence) {
          inFence = false;
          fenceDelimiter = "";
        }
        return line;
      }
      return inFence ? line : rewriteMarkdownLineOutsideInlineCode(line, rewriteLinks);
    })
    .join("");
}
function normalizeOkfRenderedPageForComparison(content) {
  const withoutRelated = content.replace(OKF_RELATED_SECTION_PATTERN, "\n");
  const frontmatterMatch = withoutRelated.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!frontmatterMatch) return withoutRelated.trimEnd();
  const normalizedFrontmatter =
    frontmatterMatch[1]?.replace(OKF_VOLATILE_TIMESTAMP_LINE_PATTERN, "") ?? "";
  return `---\n${normalizedFrontmatter.endsWith("\n") ? normalizedFrontmatter : `${normalizedFrontmatter}\n`}---\n${withoutRelated.slice(frontmatterMatch[0].length)}`.trimEnd();
}
async function writeOkfConceptPage(params) {
  const vault = await root(params.vaultRoot);
  const pageStat = await vault.stat(params.pagePath).catch((error) => {
    if (error instanceof FsSafeError && (error.code === "not-found" || error.code === "path-alias"))
      return null;
    throw error;
  });
  const existing = pageStat ? await vault.readText(params.pagePath).catch(() => "") : "";
  if (
    existing === params.content ||
    normalizeOkfRenderedPageForComparison(existing) ===
      normalizeOkfRenderedPageForComparison(params.content)
  )
    return {
      changed: false,
      created: !pageStat,
    };
  await writeGuardedVaultPage({
    vault,
    pagePath: params.pagePath,
    content: params.content,
    pageStat,
    pageLabel: "OKF concept page",
  });
  return {
    changed: true,
    created: !pageStat,
  };
}
async function removeStaleOkfConceptPages(params) {
  const vault = await root(params.vaultRoot);
  const conceptsDir = path.join(params.vaultRoot, "concepts");
  const entries = await fs$1.readdir(conceptsDir, { withFileTypes: true }).catch(() => []);
  const removedPagePaths = [];
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".md") || entry.name === "index.md") continue;
    const pagePath = `concepts/${entry.name}`;
    if (params.currentPagePaths.has(pagePath)) continue;
    const okf = parseWikiMarkdown(await vault.readText(pagePath).catch(() => "")).frontmatter.okf;
    if (
      okf &&
      typeof okf === "object" &&
      !Array.isArray(okf) &&
      okf.bundleKey === params.bundleKey
    ) {
      await vault.remove(pagePath);
      removedPagePaths.push(pagePath);
    }
  }
  return removedPagePaths;
}
function readRootOkfMetadata(params) {
  if (!params.rootIndex)
    return {
      key: createOkfBundleKey({
        rootFrontmatter: {},
        bundleName: params.bundleName,
        bundlePath: params.bundlePath,
      }),
    };
  const parsed = parseOkfMarkdown(params.rootIndex, "index.md");
  return {
    key: createOkfBundleKey({
      rootFrontmatter: parsed.frontmatter,
      bundleName: params.bundleName,
      bundlePath: params.bundlePath,
    }),
    ...(normalizeOptionalString(parsed.frontmatter.okf_version)
      ? { version: normalizeOptionalString(parsed.frontmatter.okf_version) }
      : {}),
  };
}
function formatOkfImportSummary(result) {
  return `Imported ${result.importedCount} OKF concept${result.importedCount === 1 ? "" : "s"} from ${result.bundlePath} into memory wiki. Updated ${result.updatedCount}; removed ${result.removedCount}; skipped ${result.skippedCount}; refreshed ${result.indexUpdatedFiles.length} index file${result.indexUpdatedFiles.length === 1 ? "" : "s"}.`;
}
async function importMemoryWikiOkfBundle(params) {
  await initializeMemoryWikiVault(params.config, { nowMs: params.nowMs });
  const bundlePath = path.resolve(params.bundlePath);
  if (!(await fs$1.stat(bundlePath)).isDirectory())
    throw new Error("wiki okf import expects an unpacked OKF bundle directory.");
  const warnings = [];
  const markdownFiles = await collectOkfMarkdownFiles(bundlePath, warnings);
  const concepts = [];
  let rootIndexContent;
  for (const relativePath of markdownFiles) {
    if (relativePath === "index.md")
      rootIndexContent =
        (await readOkfTextFile({
          bundlePath,
          relativePath,
          warnings,
        })) ?? void 0;
    if (OKF_RESERVED_FILENAMES.has(path.posix.basename(relativePath))) continue;
    const content = await readOkfTextFile({
      bundlePath,
      relativePath,
      warnings,
    });
    if (content === null) continue;
    const normalized = normalizeOkfConcept({
      bundlePath,
      relativePath,
      content,
    });
    if (normalized.warning) {
      warnings.push(normalized.warning);
      continue;
    }
    if (normalized.concept) concepts.push(normalized.concept);
  }
  const timestamp = resolveMemoryWikiTimestamp(params.nowMs);
  const bundleName = path.basename(bundlePath);
  const bundleMetadata = readRootOkfMetadata({
    rootIndex: rootIndexContent,
    bundleName,
    bundlePath,
  });
  const bundleKey = bundleMetadata.key;
  const pageByConceptId = /* @__PURE__ */ new Map();
  for (const concept of concepts)
    pageByConceptId.set(concept.conceptId, {
      ...createOkfPageIdentity(bundleKey, concept.conceptId),
      title: concept.title,
    });
  const importedPages = [];
  let updatedCount = 0;
  await fs$1.mkdir(path.join(params.config.vault.path, "concepts"), { recursive: true });
  for (const concept of concepts.toSorted((left, right) =>
    left.conceptId.localeCompare(right.conceptId),
  )) {
    const page = pageByConceptId.get(concept.conceptId);
    if (!page) continue;
    const rewritten = rewriteOkfMarkdownLinks({
      body: concept.body,
      sourcePagePath: page.pagePath,
      sourceRelativePath: concept.relativePath,
      pageByConceptId,
    });
    const relationships = rewritten.linkedConceptIds.flatMap((conceptId) => {
      const target = pageByConceptId.get(conceptId);
      return target
        ? [
            {
              targetId: target.pageId,
              targetPath: target.pagePath,
              targetTitle: target.title,
              kind: "okf-link",
              evidenceKind: "okf-markdown-link",
            },
          ]
        : [];
    });
    const frontmatter = {
      pageType: "concept",
      id: page.pageId,
      title: concept.title,
      sourceType: "okf",
      provenanceMode: "okf-import",
      sourcePath: concept.absolutePath,
      okfConceptId: concept.conceptId,
      okfType: concept.type,
      sourceIds: [`source.okf.${bundleKey}`],
      importedAt: timestamp,
      updatedAt: concept.timestamp ?? timestamp,
      status: "active",
      ...(concept.description ? { description: concept.description } : {}),
      ...(concept.resource ? { resource: concept.resource } : {}),
      ...(concept.tags.length > 0 ? { tags: concept.tags } : {}),
      ...(concept.timestamp ? { okfTimestamp: concept.timestamp } : {}),
      ...(relationships.length > 0 ? { relationships } : {}),
      okf: {
        ...(bundleMetadata.version ? { version: bundleMetadata.version } : {}),
        bundleName,
        bundleKey,
        conceptId: concept.conceptId,
        sourceRelativePath: concept.relativePath,
        frontmatter: concept.frontmatter,
      },
    };
    const writeResult = await writeOkfConceptPage({
      vaultRoot: params.config.vault.path,
      pagePath: page.pagePath,
      content: renderWikiMarkdown({
        frontmatter,
        body: rewritten.body,
      }),
    });
    if (!writeResult.created && writeResult.changed) updatedCount++;
    importedPages.push({
      conceptId: concept.conceptId,
      sourcePath: concept.absolutePath,
      pageId: page.pageId,
      pagePath: page.pagePath,
      title: concept.title,
      created: writeResult.created,
    });
  }
  const currentPagePaths = new Set(importedPages.map((page) => page.pagePath));
  const removedPagePaths =
    warnings.length === 0
      ? await removeStaleOkfConceptPages({
          vaultRoot: params.config.vault.path,
          bundleKey,
          currentPagePaths,
        })
      : [];
  await appendMemoryWikiLog(params.config.vault.path, {
    type: "okf-import",
    timestamp,
    details: {
      bundlePath,
      bundleName,
      importedCount: importedPages.length,
      updatedCount,
      removedCount: removedPagePaths.length,
      skippedCount: warnings.length,
      pagePaths: importedPages.map((page) => page.pagePath),
      removedPagePaths,
    },
  });
  const compile = await compileMemoryWikiVault(params.config);
  return {
    bundlePath,
    bundleName,
    ...(bundleMetadata.version ? { okfVersion: bundleMetadata.version } : {}),
    importedCount: importedPages.length,
    updatedCount,
    removedCount: removedPagePaths.length,
    skippedCount: warnings.length,
    pagePaths: importedPages.map((page) => page.pagePath),
    removedPagePaths,
    warnings,
    indexUpdatedFiles: compile.updatedFiles,
  };
}
//#endregion
//#region extensions/memory-wiki/src/source-page-shared.ts
function isUnreadableImportedSourcePage(error) {
  return error instanceof FsSafeError && (error.code === "not-file" || error.code === "hardlink");
}
async function readExistingImportedSourcePage(vault, pagePath) {
  let readError;
  for (let attempt = 0; attempt < 2; attempt += 1)
    try {
      return await vault.readText(pagePath);
    } catch (error) {
      readError = error;
    }
  if (isUnreadableImportedSourcePage(readError)) return "";
  throw readError;
}
async function writeImportedSourcePage(params) {
  if (
    await shouldSkipImportedSourceWrite({
      vaultRoot: params.vaultRoot,
      syncKey: params.syncKey,
      expectedPagePath: params.pagePath,
      expectedSourcePath: params.sourcePath,
      sourceUpdatedAtMs: params.sourceUpdatedAtMs,
      sourceSize: params.sourceSize,
      renderFingerprint: params.renderFingerprint,
      state: params.state,
    })
  )
    return {
      pagePath: params.pagePath,
      changed: false,
      created: false,
    };
  const vault = await root(params.vaultRoot);
  const pageStat = await vault.stat(params.pagePath).catch((error) => {
    if (error instanceof FsSafeError && (error.code === "not-found" || error.code === "path-alias"))
      return null;
    throw error;
  });
  const created = !pageStat;
  const updatedAt =
    timestampMsToIsoString(params.sourceUpdatedAtMs) ?? /* @__PURE__ */ new Date().toISOString();
  const raw = await fs$1.readFile(params.sourcePath, "utf8");
  const rendered = params.buildRendered(raw, updatedAt);
  const existing = pageStat ? await readExistingImportedSourcePage(vault, params.pagePath) : "";
  const nextRendered = existing ? preserveHumanNotesBlock(rendered, existing) : rendered;
  if (existing !== nextRendered)
    await writeGuardedVaultPage({
      vault,
      pagePath: params.pagePath,
      content: nextRendered,
      pageStat,
      pageLabel: "imported source page",
    });
  setImportedSourceEntry({
    syncKey: params.syncKey,
    state: params.state,
    entry: {
      group: params.group,
      pagePath: params.pagePath,
      sourcePath: params.sourcePath,
      sourceUpdatedAtMs: params.sourceUpdatedAtMs,
      sourceSize: params.sourceSize,
      renderFingerprint: params.renderFingerprint,
    },
  });
  return {
    pagePath: params.pagePath,
    changed: existing !== nextRendered,
    created,
  };
}
//#endregion
//#region extensions/memory-wiki/src/source-path-shared.ts
async function resolveArtifactKey(absolutePath) {
  const canonicalPath = await fs$1.realpath(absolutePath).catch(() => path.resolve(absolutePath));
  return process.platform === "win32"
    ? lowercasePreservingWhitespace(canonicalPath)
    : canonicalPath;
}
//#endregion
//#region extensions/memory-wiki/src/bridge.ts
function resolveMemoryWikiVaultAgentId(config) {
  if (config.vault.scope === "global") return null;
  const agentId = config.agentId?.trim();
  if (!agentId) throw new Error("Memory Wiki agent-scoped vault requires a resolved agent id");
  return normalizeAgentId(agentId);
}
function filterMemoryWikiBridgeArtifacts(params) {
  const vaultAgentId = resolveMemoryWikiVaultAgentId(params.config);
  const callerAgentId = params.callerAgentId?.trim();
  const agentId = vaultAgentId ?? (callerAgentId ? normalizeAgentId(callerAgentId) : null);
  if (!agentId) return params.artifacts;
  return params.artifacts.filter((artifact) => {
    return (Array.isArray(artifact.agentIds) ? artifact.agentIds : []).some(
      (artifactAgentId) =>
        typeof artifactAgentId === "string" &&
        artifactAgentId.trim().length > 0 &&
        normalizeAgentId(artifactAgentId) === agentId,
    );
  });
}
function shouldImportArtifact(artifact, bridgeConfig) {
  switch (artifact.kind) {
    case "memory-root":
      return bridgeConfig.indexMemoryRoot;
    case "daily-note":
      return bridgeConfig.indexDailyNotes;
    case "dream-report":
      return bridgeConfig.indexDreamReports;
    case "event-log":
      return bridgeConfig.followMemoryEvents;
    default:
      return false;
  }
}
async function collectBridgeArtifacts(bridgeConfig, vaultRoot, artifacts) {
  const collected = [];
  const vaultRootKey = await resolveArtifactKey(vaultRoot);
  for (const artifact of artifacts) {
    if (!shouldImportArtifact(artifact, bridgeConfig)) continue;
    const syncKey = await resolveArtifactKey(artifact.absolutePath);
    if (isPathInsideOrEqual(vaultRootKey, syncKey)) continue;
    collected.push({
      syncKey,
      artifactType: artifact.kind === "event-log" ? "memory-events" : "markdown",
      workspaceDir: artifact.workspaceDir,
      relativePath: artifact.relativePath,
      absolutePath: artifact.absolutePath,
    });
  }
  const deduped = /* @__PURE__ */ new Map();
  for (const artifact of collected) deduped.set(artifact.syncKey, artifact);
  return [...deduped.values()];
}
function isPathInsideOrEqual(parentPath, candidatePath) {
  const relative = path.relative(parentPath, candidatePath);
  return (
    relative === "" ||
    (relative !== ".." && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative))
  );
}
function resolveBridgeTitle(artifact, agentIds) {
  if (artifact.artifactType === "memory-events") {
    if (agentIds.length === 0) return "Memory Bridge: event journal";
    return `Memory Bridge (${agentIds.join(", ")}): event journal`;
  }
  const base = artifact.relativePath
    .replace(/\.md$/i, "")
    .replace(/^memory\//, "")
    .replace(/\//g, " / ");
  if (agentIds.length === 0) return `Memory Bridge: ${base}`;
  return `Memory Bridge (${agentIds.join(", ")}): ${base}`;
}
function resolveBridgePagePath(params) {
  const workspaceBaseSlug = slugifyWikiSegment(path.basename(params.workspaceDir));
  const workspaceHash = createHash("sha1").update(path.resolve(params.workspaceDir)).digest("hex");
  const artifactBaseSlug = slugifyWikiSegment(
    params.relativePath.replace(/\.md$/i, "").replace(/\//g, "-"),
  );
  const artifactHash = createHash("sha1").update(params.relativePath).digest("hex");
  const workspaceSlug = `${workspaceBaseSlug}-${workspaceHash.slice(0, 8)}`;
  const artifactSlug = `${artifactBaseSlug}-${artifactHash.slice(0, 8)}`;
  const fileName = createWikiPageFilename(`bridge-${workspaceSlug}-${artifactSlug}`);
  return {
    pageId: `source.bridge.${workspaceSlug}.${artifactSlug}`,
    pagePath: path.join("sources", fileName).replace(/\\/g, "/"),
    workspaceSlug,
    artifactSlug,
  };
}
async function writeBridgeSourcePage(params) {
  const { pageId, pagePath } = resolveBridgePagePath({
    workspaceDir: params.artifact.workspaceDir,
    relativePath: params.artifact.relativePath,
  });
  const title = resolveBridgeTitle(params.artifact, params.agentIds);
  const renderFingerprint = createHash("sha1")
    .update(
      JSON.stringify({
        artifactType: params.artifact.artifactType,
        workspaceDir: params.artifact.workspaceDir,
        relativePath: params.artifact.relativePath,
        agentIds: params.agentIds,
      }),
    )
    .digest("hex");
  return writeImportedSourcePage({
    vaultRoot: params.config.vault.path,
    syncKey: params.artifact.syncKey,
    sourcePath: params.artifact.absolutePath,
    sourceUpdatedAtMs: params.sourceUpdatedAtMs,
    sourceSize: params.sourceSize,
    renderFingerprint,
    pagePath,
    group: "bridge",
    state: params.state,
    buildRendered: (raw, updatedAt) => {
      const contentLanguage =
        params.artifact.artifactType === "memory-events" ? "json" : "markdown";
      return renderWikiMarkdown({
        frontmatter: {
          pageType: "source",
          id: pageId,
          title,
          sourceType:
            params.artifact.artifactType === "memory-events"
              ? "memory-bridge-events"
              : "memory-bridge",
          sourcePath: params.artifact.absolutePath,
          bridgeRelativePath: params.artifact.relativePath,
          bridgeWorkspaceDir: params.artifact.workspaceDir,
          bridgeAgentIds: params.agentIds,
          status: "active",
          updatedAt,
        },
        body: [
          `# ${title}`,
          "",
          "## Bridge Source",
          `- Workspace: \`${params.artifact.workspaceDir}\``,
          `- Relative path: \`${params.artifact.relativePath}\``,
          `- Kind: \`${params.artifact.artifactType}\``,
          `- Agents: ${params.agentIds.length > 0 ? params.agentIds.join(", ") : "unknown"}`,
          `- Updated: ${updatedAt}`,
          "",
          "## Content",
          renderMarkdownFence(raw, contentLanguage),
          "",
          "## Notes",
          "<!-- openclaw:human:start -->",
          "<!-- openclaw:human:end -->",
          "",
        ].join("\n"),
      });
    },
  });
}
async function syncMemoryWikiBridgeSources(params) {
  resolveMemoryWikiVaultAgentId(params.config);
  await initializeMemoryWikiVault(params.config);
  if (
    params.config.vaultMode !== "bridge" ||
    !params.config.bridge.enabled ||
    !params.config.bridge.readMemoryArtifacts ||
    !params.appConfig
  )
    return {
      importedCount: 0,
      updatedCount: 0,
      skippedCount: 0,
      removedCount: 0,
      artifactCount: 0,
      workspaces: 0,
      pagePaths: [],
    };
  const publicArtifacts = filterMemoryWikiBridgeArtifacts({
    config: params.config,
    artifacts: await listActiveMemoryPublicArtifacts({ cfg: params.appConfig }),
  });
  const results = [];
  const activeKeys = /* @__PURE__ */ new Set();
  const artifacts = await collectBridgeArtifacts(
    params.config.bridge,
    params.config.vault.path,
    publicArtifacts,
  );
  const state = await readMemoryWikiSourceSyncState(params.config.vault.path);
  assertMemoryWikiSourceSyncStateCapacity({
    state,
    group: "bridge",
    incomingCount: artifacts.length,
  });
  const agentIdsByWorkspace = /* @__PURE__ */ new Map();
  for (const artifact of publicArtifacts)
    agentIdsByWorkspace.set(artifact.workspaceDir, artifact.agentIds);
  const artifactCount = artifacts.length;
  for (const artifact of artifacts) {
    const stats = await fs$1.stat(artifact.absolutePath);
    activeKeys.add(artifact.syncKey);
    results.push(
      await writeBridgeSourcePage({
        config: params.config,
        artifact,
        agentIds: agentIdsByWorkspace.get(artifact.workspaceDir) ?? [],
        sourceUpdatedAtMs: stats.mtimeMs,
        sourceSize: stats.size,
        state,
      }),
    );
  }
  const workspaceCount = new Set(publicArtifacts.map((artifact) => artifact.workspaceDir)).size;
  const removedCount = getMemoryCapabilityRegistration()
    ? await pruneImportedSourceEntries({
        vaultRoot: params.config.vault.path,
        group: "bridge",
        activeKeys,
        state,
      })
    : 0;
  await writeMemoryWikiSourceSyncState(params.config.vault.path, state);
  const importedCount = results.filter((result) => result.changed && result.created).length;
  const updatedCount = results.filter((result) => result.changed && !result.created).length;
  const skippedCount = results.filter((result) => !result.changed).length;
  const pagePaths = results
    .map((result) => result.pagePath)
    .toSorted((left, right) => left.localeCompare(right));
  if (importedCount > 0 || updatedCount > 0 || removedCount > 0)
    await appendMemoryWikiLog(params.config.vault.path, {
      type: "ingest",
      timestamp: /* @__PURE__ */ new Date().toISOString(),
      details: {
        sourceType: "memory-bridge",
        workspaces: workspaceCount,
        artifactCount,
        importedCount,
        updatedCount,
        skippedCount,
        removedCount,
      },
    });
  return {
    importedCount,
    updatedCount,
    skippedCount,
    removedCount,
    artifactCount,
    workspaces: workspaceCount,
    pagePaths,
  };
}
//#endregion
//#region extensions/memory-wiki/src/unsafe-local.ts
const DIRECTORY_TEXT_EXTENSIONS = /* @__PURE__ */ new Set([
  ".json",
  ".jsonl",
  ".md",
  ".txt",
  ".yaml",
  ".yml",
]);
const UNSAFE_LOCAL_SYNC_CONCURRENCY = 16;
function detectFenceLanguage(filePath) {
  const ext = normalizeLowercaseStringOrEmpty(path.extname(filePath));
  if (ext === ".json" || ext === ".jsonl") return "json";
  if (ext === ".yaml" || ext === ".yml") return "yaml";
  if (ext === ".txt") return "text";
  return "markdown";
}
async function listAllowedFilesRecursive(rootDir) {
  const entries = await fs$1.readdir(rootDir, { withFileTypes: true }).catch(() => []);
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listAllowedFilesRecursive(fullPath)));
      continue;
    }
    if (
      entry.isFile() &&
      DIRECTORY_TEXT_EXTENSIONS.has(normalizeLowercaseStringOrEmpty(path.extname(entry.name)))
    )
      files.push(fullPath);
  }
  return files.toSorted((left, right) => left.localeCompare(right));
}
async function collectUnsafeLocalArtifacts(configuredPaths) {
  const artifacts = [];
  for (const configuredPath of configuredPaths) {
    const absoluteConfiguredPath = path.resolve(configuredPath);
    const stat = await fs$1.stat(absoluteConfiguredPath).catch(() => null);
    if (!stat) continue;
    if (stat.isDirectory()) {
      const files = await listAllowedFilesRecursive(absoluteConfiguredPath);
      for (const absolutePath of files)
        artifacts.push({
          syncKey: await resolveArtifactKey(absolutePath),
          configuredPath: absoluteConfiguredPath,
          absolutePath,
          relativePath: path.relative(absoluteConfiguredPath, absolutePath).replace(/\\/g, "/"),
        });
      continue;
    }
    if (stat.isFile())
      artifacts.push({
        syncKey: await resolveArtifactKey(absoluteConfiguredPath),
        configuredPath: absoluteConfiguredPath,
        absolutePath: absoluteConfiguredPath,
        relativePath: path.basename(absoluteConfiguredPath),
      });
  }
  const deduped = /* @__PURE__ */ new Map();
  for (const artifact of artifacts) deduped.set(artifact.syncKey, artifact);
  return [...deduped.values()];
}
function resolveUnsafeLocalPagePath(params) {
  const pageSlug = `${slugifyWikiSegment(path.basename(params.configuredPath))}-${createHash("sha1").update(path.resolve(params.configuredPath)).digest("hex").slice(0, 8)}-${slugifyWikiSegment(path.basename(params.absolutePath))}-${createHash("sha1").update(path.resolve(params.absolutePath)).digest("hex").slice(0, 8)}`;
  return {
    pageId: `source.unsafe-local.${pageSlug}`,
    pagePath: path
      .join("sources", createWikiPageFilename(`unsafe-local-${pageSlug}`))
      .replace(/\\/g, "/"),
  };
}
function resolveUnsafeLocalTitle(artifact) {
  return `Unsafe Local Import: ${artifact.relativePath}`;
}
async function writeUnsafeLocalSourcePage(params) {
  const { pageId, pagePath } = resolveUnsafeLocalPagePath({
    configuredPath: params.artifact.configuredPath,
    absolutePath: params.artifact.absolutePath,
  });
  const title = resolveUnsafeLocalTitle(params.artifact);
  const renderFingerprint = createHash("sha1")
    .update(
      JSON.stringify({
        configuredPath: params.artifact.configuredPath,
        relativePath: params.artifact.relativePath,
      }),
    )
    .digest("hex");
  return writeImportedSourcePage({
    vaultRoot: params.config.vault.path,
    syncKey: params.artifact.syncKey,
    sourcePath: params.artifact.absolutePath,
    sourceUpdatedAtMs: params.sourceUpdatedAtMs,
    sourceSize: params.sourceSize,
    renderFingerprint,
    pagePath,
    group: "unsafe-local",
    state: params.state,
    buildRendered: (raw, updatedAt) =>
      renderWikiMarkdown({
        frontmatter: {
          pageType: "source",
          id: pageId,
          title,
          sourceType: "memory-unsafe-local",
          provenanceMode: "unsafe-local",
          sourcePath: params.artifact.absolutePath,
          unsafeLocalConfiguredPath: params.artifact.configuredPath,
          unsafeLocalRelativePath: params.artifact.relativePath,
          status: "active",
          updatedAt,
        },
        body: [
          `# ${title}`,
          "",
          "## Unsafe Local Source",
          `- Configured path: \`${params.artifact.configuredPath}\``,
          `- Relative path: \`${params.artifact.relativePath}\``,
          `- Updated: ${updatedAt}`,
          "",
          "## Content",
          renderMarkdownFence(raw, detectFenceLanguage(params.artifact.absolutePath)),
          "",
          "## Notes",
          "<!-- openclaw:human:start -->",
          "<!-- openclaw:human:end -->",
          "",
        ].join("\n"),
      }),
  });
}
async function syncMemoryWikiUnsafeLocalSources(config) {
  await initializeMemoryWikiVault(config);
  if (
    config.vaultMode !== "unsafe-local" ||
    !config.unsafeLocal.allowPrivateMemoryCoreAccess ||
    config.unsafeLocal.paths.length === 0
  )
    return {
      importedCount: 0,
      updatedCount: 0,
      skippedCount: 0,
      removedCount: 0,
      artifactCount: 0,
      workspaces: 0,
      pagePaths: [],
    };
  const artifacts = await collectUnsafeLocalArtifacts(config.unsafeLocal.paths);
  const state = await readMemoryWikiSourceSyncState(config.vault.path);
  assertMemoryWikiSourceSyncStateCapacity({
    state,
    group: "unsafe-local",
    incomingCount: artifacts.length,
  });
  const activeKeys = /* @__PURE__ */ new Set();
  const results = await pMap(
    artifacts,
    async (artifact) => {
      const stats = await fs$1.stat(artifact.absolutePath);
      activeKeys.add(artifact.syncKey);
      return await writeUnsafeLocalSourcePage({
        config,
        artifact,
        sourceUpdatedAtMs: stats.mtimeMs,
        sourceSize: stats.size,
        state,
      });
    },
    {
      concurrency: UNSAFE_LOCAL_SYNC_CONCURRENCY,
      stopOnError: true,
    },
  );
  const removedCount = await pruneImportedSourceEntries({
    vaultRoot: config.vault.path,
    group: "unsafe-local",
    activeKeys,
    state,
  });
  await writeMemoryWikiSourceSyncState(config.vault.path, state);
  const importedCount = results.filter((result) => result.changed && result.created).length;
  const updatedCount = results.filter((result) => result.changed && !result.created).length;
  const skippedCount = results.filter((result) => !result.changed).length;
  const pagePaths = results
    .map((result) => result.pagePath)
    .toSorted((left, right) => left.localeCompare(right));
  if (importedCount > 0 || updatedCount > 0 || removedCount > 0)
    await appendMemoryWikiLog(config.vault.path, {
      type: "ingest",
      timestamp: /* @__PURE__ */ new Date().toISOString(),
      details: {
        sourceType: "memory-unsafe-local",
        configuredPathCount: config.unsafeLocal.paths.length,
        artifactCount: artifacts.length,
        importedCount,
        updatedCount,
        skippedCount,
        removedCount,
      },
    });
  return {
    importedCount,
    updatedCount,
    skippedCount,
    removedCount,
    artifactCount: artifacts.length,
    workspaces: 0,
    pagePaths,
  };
}
//#endregion
//#region extensions/memory-wiki/src/source-sync.ts
const activeImportedSourceSyncs = /* @__PURE__ */ new Map();
function resolveImportedSourceSyncRequestKey(params, vaultKey) {
  return JSON.stringify({
    ...params.config,
    vault: {
      ...params.config.vault,
      path: vaultKey,
    },
  });
}
async function syncMemoryWikiImportedSourcesOnce(params) {
  let syncResult;
  if (params.config.vaultMode === "bridge") syncResult = await syncMemoryWikiBridgeSources(params);
  else if (params.config.vaultMode === "unsafe-local")
    syncResult = await syncMemoryWikiUnsafeLocalSources(params.config);
  else
    syncResult = {
      importedCount: 0,
      updatedCount: 0,
      skippedCount: 0,
      removedCount: 0,
      artifactCount: 0,
      workspaces: 0,
      pagePaths: [],
    };
  const refreshResult = await refreshMemoryWikiIndexesAfterImport({
    config: params.config,
    syncResult,
  });
  return {
    ...syncResult,
    indexesRefreshed: refreshResult.refreshed,
    indexUpdatedFiles: refreshResult.compile?.updatedFiles ?? [],
    indexRefreshReason: refreshResult.reason,
  };
}
async function syncMemoryWikiImportedSources(params) {
  const vaultKey = await resolveMemoryWikiVaultMutationKey(params.config.vault.path);
  const requestKey = resolveImportedSourceSyncRequestKey(params, vaultKey);
  const active = activeImportedSourceSyncs.get(vaultKey) ?? [];
  const matching = active.find(
    (entry) => entry.requestKey === requestKey && entry.appConfig === params.appConfig,
  );
  if (matching) return await matching.promise;
  const promise = withMemoryWikiVaultMutation(params.config.vault.path, () =>
    syncMemoryWikiImportedSourcesOnce(params),
  );
  const entry = {
    requestKey,
    ...(params.appConfig ? { appConfig: params.appConfig } : {}),
    promise,
  };
  active.push(entry);
  activeImportedSourceSyncs.set(vaultKey, active);
  try {
    return await promise;
  } finally {
    const index = active.indexOf(entry);
    if (index >= 0) active.splice(index, 1);
    if (active.length === 0 && activeImportedSourceSyncs.get(vaultKey) === active)
      activeImportedSourceSyncs.delete(vaultKey);
  }
}
//#endregion
//#region extensions/memory-wiki/src/status.ts
async function collectVaultCounts(vaultPath) {
  const pageCounts = {
    entity: 0,
    concept: 0,
    source: 0,
    synthesis: 0,
    report: 0,
  };
  const sourceCounts = {
    native: 0,
    bridge: 0,
    bridgeEvents: 0,
    unsafeLocal: 0,
    other: 0,
  };
  for (const dir of ["entities", "concepts", "sources", "syntheses", "reports"]) {
    const dirPath = path.join(vaultPath, dir);
    const entries = await fs$1
      .readdir(dirPath, {
        withFileTypes: true,
        recursive: true,
      })
      .catch(() => []);
    for (const entry of entries) {
      if (!entry.isFile() || !entry.name.endsWith(".md") || entry.name === "index.md") continue;
      const absolutePath = path.join(entry.parentPath ?? dirPath, entry.name);
      const relativeToVault = path.relative(vaultPath, absolutePath).split(path.sep).join("/");
      const raw = await fs$1.readFile(absolutePath, "utf8").catch(() => null);
      if (raw === null) continue;
      const page = toWikiPageSummary({
        absolutePath,
        relativePath: relativeToVault,
        raw,
      });
      if (!page) continue;
      pageCounts[page.kind] += 1;
      if (page.kind !== "source") continue;
      if (page.sourceType === "memory-bridge-events") sourceCounts.bridgeEvents += 1;
      else if (page.sourceType === "memory-bridge") sourceCounts.bridge += 1;
      else if (page.provenanceMode === "unsafe-local" || page.sourceType === "memory-unsafe-local")
        sourceCounts.unsafeLocal += 1;
      else if (!page.sourceType) sourceCounts.native += 1;
      else sourceCounts.other += 1;
    }
  }
  return {
    pageCounts,
    sourceCounts,
  };
}
function buildWarnings(params) {
  const warnings = [];
  if (!params.vaultExists)
    warnings.push({
      code: "vault-missing",
      message: "Wiki vault has not been initialized yet.",
    });
  if (
    params.config.obsidian.enabled &&
    params.config.obsidian.useOfficialCli &&
    !params.obsidianCommand
  )
    warnings.push({
      code: "obsidian-cli-missing",
      message: "Obsidian CLI is enabled in config but `obsidian` is not available on PATH.",
    });
  if (params.config.vaultMode === "bridge" && !params.config.bridge.enabled)
    warnings.push({
      code: "bridge-disabled",
      message: "vaultMode is `bridge` but bridge.enabled is false.",
    });
  if (
    params.config.vaultMode === "bridge" &&
    params.config.bridge.enabled &&
    params.config.bridge.readMemoryArtifacts &&
    params.bridgePublicArtifactCount === 0
  )
    warnings.push({
      code: "bridge-artifacts-missing",
      message:
        "Bridge mode is enabled but the active memory plugin is not exporting any public memory artifacts yet.",
    });
  if (
    params.config.vaultMode === "unsafe-local" &&
    !params.config.unsafeLocal.allowPrivateMemoryCoreAccess
  )
    warnings.push({
      code: "unsafe-local-disabled",
      message: "vaultMode is `unsafe-local` but private memory-core access is disabled.",
    });
  if (
    params.config.vaultMode === "unsafe-local" &&
    params.config.unsafeLocal.allowPrivateMemoryCoreAccess &&
    params.config.unsafeLocal.paths.length === 0
  )
    warnings.push({
      code: "unsafe-local-paths-missing",
      message: "unsafe-local access is enabled but no private paths are configured.",
    });
  if (
    params.config.vaultMode !== "unsafe-local" &&
    params.config.unsafeLocal.allowPrivateMemoryCoreAccess
  )
    warnings.push({
      code: "unsafe-local-without-mode",
      message: "Private memory-core access is enabled outside unsafe-local mode.",
    });
  return warnings;
}
async function resolveMemoryWikiStatus(config, deps) {
  const agentId = resolveMemoryWikiVaultAgentId(config);
  const vaultExists = await (deps?.pathExists ?? pathExists)(config.vault.path);
  const bridgePublicArtifactCount =
    deps?.appConfig &&
    config.vaultMode === "bridge" &&
    config.bridge.enabled &&
    config.bridge.readMemoryArtifacts
      ? filterMemoryWikiBridgeArtifacts({
          config,
          callerAgentId: deps.callerAgentId,
          artifacts: await (deps.listPublicArtifacts ?? listActiveMemoryPublicArtifacts)({
            cfg: deps.appConfig,
          }),
        }).length
      : null;
  const obsidianProbe = await probeObsidianCli({ resolveCommand: deps?.resolveCommand });
  const counts = vaultExists
    ? await collectVaultCounts(config.vault.path)
    : {
        pageCounts: {
          entity: 0,
          concept: 0,
          source: 0,
          synthesis: 0,
          report: 0,
        },
        sourceCounts: {
          native: 0,
          bridge: 0,
          bridgeEvents: 0,
          unsafeLocal: 0,
          other: 0,
        },
      };
  return {
    vaultScope: config.vault.scope,
    agentId,
    vaultMode: config.vaultMode,
    renderMode: config.vault.renderMode,
    vaultPath: config.vault.path,
    vaultExists,
    bridge: config.bridge,
    bridgePublicArtifactCount,
    obsidianCli: {
      enabled: config.obsidian.enabled,
      requested: config.obsidian.enabled && config.obsidian.useOfficialCli,
      available: obsidianProbe.available,
      command: obsidianProbe.command,
    },
    unsafeLocal: {
      allowPrivateMemoryCoreAccess: config.unsafeLocal.allowPrivateMemoryCoreAccess,
      pathCount: config.unsafeLocal.paths.length,
    },
    pageCounts: counts.pageCounts,
    sourceCounts: counts.sourceCounts,
    warnings: buildWarnings({
      config,
      bridgePublicArtifactCount,
      vaultExists,
      obsidianCommand: obsidianProbe.command,
    }),
  };
}
function buildMemoryWikiDoctorReport(status) {
  const fixes = status.warnings.map((warning) => ({
    code: warning.code,
    message:
      warning.code === "vault-missing"
        ? "Run `openclaw wiki init` to create the vault layout."
        : warning.code === "obsidian-cli-missing"
          ? "Install the official Obsidian CLI or disable `obsidian.useOfficialCli`."
          : warning.code === "bridge-disabled"
            ? "Enable `plugins.entries.memory-wiki.config.bridge.enabled` or switch vaultMode away from `bridge`."
            : warning.code === "bridge-artifacts-missing"
              ? "Use a memory plugin that exports public artifacts, create/import memory artifacts first, or switch the wiki back to isolated mode."
              : warning.code === "unsafe-local-disabled"
                ? "Enable `unsafeLocal.allowPrivateMemoryCoreAccess` or switch vaultMode away from `unsafe-local`."
                : warning.code === "unsafe-local-paths-missing"
                  ? "Add explicit `unsafeLocal.paths` entries before running unsafe-local imports."
                  : "Disable private memory-core access unless you explicitly want unsafe-local mode.",
  }));
  return {
    healthy: status.warnings.length === 0,
    warningCount: status.warnings.length,
    status,
    fixes,
  };
}
function renderMemoryWikiStatus(status) {
  const lines = [
    `Wiki vault mode: ${status.vaultMode}`,
    `Vault scope: ${status.vaultScope}${status.agentId ? ` (${status.agentId})` : ""}`,
    `Vault: ${status.vaultExists ? "ready" : "missing"} (${status.vaultPath})`,
    `Render mode: ${status.renderMode}`,
    `Obsidian CLI: ${status.obsidianCli.available ? "available" : "missing"}${status.obsidianCli.requested ? " (requested)" : ""}`,
    `Bridge: ${status.bridge.enabled ? "enabled" : "disabled"}${typeof status.bridgePublicArtifactCount === "number" ? ` (${status.bridgePublicArtifactCount} exported artifact${status.bridgePublicArtifactCount === 1 ? "" : "s"})` : ""}`,
    `Unsafe local: ${status.unsafeLocal.allowPrivateMemoryCoreAccess ? `enabled (${status.unsafeLocal.pathCount} paths)` : "disabled"}`,
    `Pages: ${status.pageCounts.source} sources, ${status.pageCounts.entity} entities, ${status.pageCounts.concept} concepts, ${status.pageCounts.synthesis} syntheses, ${status.pageCounts.report} reports`,
    `Source provenance: ${status.sourceCounts.native} native, ${status.sourceCounts.bridge} bridge, ${status.sourceCounts.bridgeEvents} bridge-events, ${status.sourceCounts.unsafeLocal} unsafe-local, ${status.sourceCounts.other} other`,
  ];
  if (status.warnings.length > 0) {
    lines.push("", "Warnings:");
    for (const warning of status.warnings) lines.push(`- ${warning.message}`);
  }
  return lines.join("\n");
}
function renderMemoryWikiDoctor(report) {
  const lines = [
    report.healthy ? "Wiki doctor: healthy" : `Wiki doctor: ${report.warningCount} issue(s) found`,
    "",
    renderMemoryWikiStatus(report.status),
  ];
  if (report.fixes.length > 0) {
    lines.push("", "Suggested fixes:");
    for (const fix of report.fixes) lines.push(`- ${fix.message}`);
  }
  return lines.join("\n");
}
//#endregion
//#region extensions/memory-wiki/src/cli.ts
const WIKI_GATEWAY_TIMEOUT_MS = "30000";
const GATEWAY_TERMINAL_STRING_MAX_CHARS = 2e3;
const GATEWAY_RESPONSE_MAX_ARRAY_ITEMS = 1e4;
const GATEWAY_RESPONSE_MAX_STRING_CHARS = 1e4;
const GATEWAY_RESPONSE_MAX_CODE_CHARS = 256;
const ANSI_ESCAPE_SEQUENCE_PATTERN = new RegExp(
  String.raw`(?:\x1B\[[0-?]*[ -/]*[@-~]|\x1B[@-Z\\-_]|\x9B[0-?]*[ -/]*[@-~])`,
  "g",
);
const TERMINAL_CONTROL_CHARACTER_PATTERN = new RegExp(String.raw`[\x00-\x1F\x7F-\x9F]+`, "g");
const UNICODE_FORMAT_CONTROL_PATTERN = /[\u061C\u200B-\u200F\u202A-\u202E\u2060-\u206F\uFEFF]/g;
function sanitizeGatewayStringForTerminal(value) {
  const sanitized = (
    value.length > GATEWAY_TERMINAL_STRING_MAX_CHARS
      ? truncateUtf16Safe(value, GATEWAY_TERMINAL_STRING_MAX_CHARS)
      : value
  )
    .replace(ANSI_ESCAPE_SEQUENCE_PATTERN, "")
    .replace(TERMINAL_CONTROL_CHARACTER_PATTERN, " ")
    .replace(UNICODE_FORMAT_CONTROL_PATTERN, "");
  return value.length > GATEWAY_TERMINAL_STRING_MAX_CHARS
    ? `${sanitized}... [truncated]`
    : sanitized;
}
function escapeGatewayJsonForTerminal(json) {
  return json.replace(UNICODE_FORMAT_CONTROL_PATTERN, (char) => {
    const codePoint = char.codePointAt(0);
    return typeof codePoint === "number" ? `\\u${codePoint.toString(16).padStart(4, "0")}` : "";
  });
}
function writeOutput(output, writer = process.stdout) {
  writer.write(output.endsWith("\n") ? output : `${output}\n`);
}
function shouldRouteBridgeRuntimeThroughGateway(config) {
  return (
    config.vaultMode === "bridge" && config.bridge.enabled && config.bridge.readMemoryArtifacts
  );
}
function isBoundedGatewayString(value, maxChars = GATEWAY_RESPONSE_MAX_STRING_CHARS) {
  return typeof value === "string" && value.length <= maxChars;
}
function isStringArray(value, maxChars = GATEWAY_RESPONSE_MAX_STRING_CHARS) {
  return (
    Array.isArray(value) &&
    value.length <= GATEWAY_RESPONSE_MAX_ARRAY_ITEMS &&
    value.every((item) => isBoundedGatewayString(item, maxChars))
  );
}
function hasNumberFields(value, keys) {
  return keys.every((key) => typeof value[key] === "number");
}
function isWarningList(value) {
  return (
    Array.isArray(value) &&
    value.length <= GATEWAY_RESPONSE_MAX_ARRAY_ITEMS &&
    value.every(
      (item) =>
        isRecord(item) &&
        isBoundedGatewayString(item.code, GATEWAY_RESPONSE_MAX_CODE_CHARS) &&
        isBoundedGatewayString(item.message),
    )
  );
}
function isMemoryWikiStatus(value) {
  if (!isRecord(value)) return false;
  const bridge = value.bridge;
  const obsidianCli = value.obsidianCli;
  const unsafeLocal = value.unsafeLocal;
  const pageCounts = value.pageCounts;
  const sourceCounts = value.sourceCounts;
  return (
    isBoundedGatewayString(value.vaultScope, GATEWAY_RESPONSE_MAX_CODE_CHARS) &&
    (isBoundedGatewayString(value.agentId, GATEWAY_RESPONSE_MAX_CODE_CHARS) ||
      value.agentId === null) &&
    isBoundedGatewayString(value.vaultMode, GATEWAY_RESPONSE_MAX_CODE_CHARS) &&
    isBoundedGatewayString(value.renderMode, GATEWAY_RESPONSE_MAX_CODE_CHARS) &&
    isBoundedGatewayString(value.vaultPath) &&
    typeof value.vaultExists === "boolean" &&
    (typeof value.bridgePublicArtifactCount === "number" ||
      value.bridgePublicArtifactCount === null) &&
    isRecord(bridge) &&
    typeof bridge.enabled === "boolean" &&
    isRecord(obsidianCli) &&
    typeof obsidianCli.enabled === "boolean" &&
    typeof obsidianCli.requested === "boolean" &&
    typeof obsidianCli.available === "boolean" &&
    (isBoundedGatewayString(obsidianCli.command) || obsidianCli.command === null) &&
    isRecord(unsafeLocal) &&
    typeof unsafeLocal.allowPrivateMemoryCoreAccess === "boolean" &&
    typeof unsafeLocal.pathCount === "number" &&
    isRecord(pageCounts) &&
    hasNumberFields(pageCounts, ["source", "entity", "concept", "synthesis", "report"]) &&
    isRecord(sourceCounts) &&
    hasNumberFields(sourceCounts, ["native", "bridge", "bridgeEvents", "unsafeLocal", "other"]) &&
    isWarningList(value.warnings)
  );
}
function isMemoryWikiDoctorReport(value) {
  return (
    isRecord(value) &&
    typeof value.healthy === "boolean" &&
    typeof value.warningCount === "number" &&
    isMemoryWikiStatus(value.status) &&
    Array.isArray(value.fixes) &&
    value.fixes.length <= GATEWAY_RESPONSE_MAX_ARRAY_ITEMS &&
    value.fixes.every(
      (item) =>
        isRecord(item) &&
        isBoundedGatewayString(item.code, GATEWAY_RESPONSE_MAX_CODE_CHARS) &&
        isBoundedGatewayString(item.message),
    )
  );
}
function isMemoryWikiImportResult(value) {
  return (
    isRecord(value) &&
    hasNumberFields(value, [
      "importedCount",
      "updatedCount",
      "skippedCount",
      "removedCount",
      "artifactCount",
      "workspaces",
    ]) &&
    isStringArray(value.pagePaths) &&
    typeof value.indexesRefreshed === "boolean" &&
    isStringArray(value.indexUpdatedFiles) &&
    isBoundedGatewayString(value.indexRefreshReason, GATEWAY_RESPONSE_MAX_CODE_CHARS)
  );
}
function validateWikiGatewayResult(method, value) {
  if (method === "wiki.status" && isMemoryWikiStatus(value)) return value;
  if (method === "wiki.doctor" && isMemoryWikiDoctorReport(value)) return value;
  if (method === "wiki.bridge.import" && isMemoryWikiImportResult(value)) return value;
  throw new Error(`Invalid Gateway response for ${method}.`);
}
async function callWikiGateway(method, agentId) {
  return validateWikiGatewayResult(
    method,
    await callGatewayFromCli(
      method,
      { timeout: WIKI_GATEWAY_TIMEOUT_MS },
      agentId ? { agentId } : void 0,
      { progress: false },
    ),
  );
}
function normalizeCliStringList(values) {
  if (!values) return;
  const uniqueValues = uniqueStrings(normalizeStringEntries(values));
  return uniqueValues.length > 0 ? uniqueValues : void 0;
}
function collectCliValues(value, acc = []) {
  acc.push(value);
  return acc;
}
function parseWikiSearchEnumOption(value, allowed, label) {
  if (allowed.includes(value)) return value;
  throw new Error(`Invalid ${label}: ${value}. Expected one of: ${allowed.join(", ")}`);
}
async function resolveWikiApplyBody(params) {
  if (params.body?.trim()) return params.body;
  if (params.bodyFile?.trim()) return await fs$1.readFile(params.bodyFile, "utf8");
  throw new Error("wiki apply synthesis requires --body or --body-file.");
}
function formatMemoryWikiMutationSummary(result, json) {
  if (json) return JSON.stringify(result, null, 2);
  return `${result.changed ? "Updated" : "No changes for"} ${result.pagePath} via ${result.operation}. ${result.compile.updatedFiles.length > 0 ? `Refreshed ${result.compile.updatedFiles.length} index file${result.compile.updatedFiles.length === 1 ? "" : "s"}.` : "Indexes unchanged."}`;
}
function formatJsonOrText(result, json, render) {
  return json ? JSON.stringify(result, null, 2) : render(result);
}
function formatGatewayJsonOrText(result, json, render) {
  return json
    ? escapeGatewayJsonForTerminal(JSON.stringify(result, null, 2))
    : sanitizeGatewayStringForTerminal(render(result));
}
async function runWikiCommandWithSummary(params) {
  const result = await params.run();
  writeOutput(formatJsonOrText(result, params.json, params.render), params.stdout);
  return result;
}
async function runSyncedWikiCommandWithSummary(params) {
  await syncMemoryWikiImportedSources({
    config: params.config,
    appConfig: params.appConfig,
  });
  return runWikiCommandWithSummary(params);
}
function addWikiSearchConfigOptions(command) {
  return command
    .option("--backend <backend>", `Search backend (${WIKI_SEARCH_BACKENDS.join(", ")})`, (value) =>
      parseWikiSearchEnumOption(value, WIKI_SEARCH_BACKENDS, "backend"),
    )
    .option("--corpus <corpus>", `Search corpus (${WIKI_SEARCH_CORPORA.join(", ")})`, (value) =>
      parseWikiSearchEnumOption(value, WIKI_SEARCH_CORPORA, "corpus"),
    );
}
function invalidCliArgument(message) {
  const error = new Error(message);
  error.name = "InvalidArgumentError";
  error.code = "commander.invalidArgument";
  error.exitCode = 1;
  return error;
}
function parseWikiConfidenceOption(value) {
  const trimmed = value.trim();
  const confidence = /^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(trimmed) ? Number(trimmed) : NaN;
  if (!Number.isFinite(confidence) || confidence < 0 || confidence > 1)
    throw invalidCliArgument("--confidence must be a number between 0 and 1.");
  return confidence;
}
function parseWikiPositiveIntegerOption(value, flag) {
  const parsed = parseStrictPositiveInteger(value);
  if (parsed === void 0) throw invalidCliArgument(`${flag} must be a positive integer.`);
  return parsed;
}
function addWikiApplyMutationOptions(command) {
  return command
    .option("--source-id <id>", "Source id", collectCliValues)
    .option("--contradiction <text>", "Contradiction note", collectCliValues)
    .option("--question <text>", "Open question", collectCliValues)
    .option("--confidence <n>", "Confidence score between 0 and 1", parseWikiConfidenceOption)
    .option("--status <status>", "Page status");
}
async function runWikiStatus(params) {
  const routeThroughGateway = shouldRouteBridgeRuntimeThroughGateway(params.config);
  const status = routeThroughGateway
    ? await callWikiGateway("wiki.status", params.agentId)
    : await (async () => {
        await syncMemoryWikiImportedSources({
          config: params.config,
          appConfig: params.appConfig,
        });
        return await resolveMemoryWikiStatus(params.config, { appConfig: params.appConfig });
      })();
  writeOutput(
    routeThroughGateway
      ? formatGatewayJsonOrText(status, params.json, renderMemoryWikiStatus)
      : formatJsonOrText(status, params.json, renderMemoryWikiStatus),
    params.stdout,
  );
  return status;
}
async function runWikiDoctor(params) {
  const routeThroughGateway = shouldRouteBridgeRuntimeThroughGateway(params.config);
  const report = routeThroughGateway
    ? await callWikiGateway("wiki.doctor", params.agentId)
    : await (async () => {
        await syncMemoryWikiImportedSources({
          config: params.config,
          appConfig: params.appConfig,
        });
        return buildMemoryWikiDoctorReport(
          await resolveMemoryWikiStatus(params.config, { appConfig: params.appConfig }),
        );
      })();
  if (!report.healthy) process.exitCode = 1;
  writeOutput(
    routeThroughGateway
      ? formatGatewayJsonOrText(report, params.json, renderMemoryWikiDoctor)
      : formatJsonOrText(report, params.json, renderMemoryWikiDoctor),
    params.stdout,
  );
  return report;
}
async function runWikiInit(params) {
  return runWikiCommandWithSummary({
    json: params.json,
    stdout: params.stdout,
    run: () => initializeMemoryWikiVault(params.config),
    render: (value) =>
      `Initialized wiki vault at ${value.rootDir} (${value.createdDirectories.length} dirs, ${value.createdFiles.length} files).`,
  });
}
async function runWikiCompile(params) {
  return runSyncedWikiCommandWithSummary({
    config: params.config,
    appConfig: params.appConfig,
    json: params.json,
    stdout: params.stdout,
    run: () => compileMemoryWikiVault(params.config),
    render: (value) =>
      `Compiled wiki vault at ${value.vaultRoot} (${value.pages.length} pages, ${value.updatedFiles.length} indexes updated).`,
  });
}
async function runWikiLint(params) {
  return runSyncedWikiCommandWithSummary({
    config: params.config,
    appConfig: params.appConfig,
    json: params.json,
    stdout: params.stdout,
    run: () => lintMemoryWikiVault(params.config),
    render: (value) =>
      `Linted wiki vault at ${value.vaultRoot} (${value.issueCount} issues, report: ${value.reportPath}).`,
  });
}
async function runWikiIngest(params) {
  return runWikiCommandWithSummary({
    json: params.json,
    stdout: params.stdout,
    run: () =>
      ingestMemoryWikiSource({
        config: params.config,
        inputPath: params.inputPath,
        title: params.title,
      }),
    render: (value) =>
      `Ingested ${value.sourcePath} into ${value.pagePath}. Refreshed ${value.indexUpdatedFiles.length} index file${value.indexUpdatedFiles.length === 1 ? "" : "s"}.`,
  });
}
async function runWikiOkfImport(params) {
  return runWikiCommandWithSummary({
    json: params.json,
    stdout: params.stdout,
    run: () =>
      importMemoryWikiOkfBundle({
        config: params.config,
        bundlePath: params.bundlePath,
      }),
    render: formatOkfImportSummary,
  });
}
async function runWikiSearch(params) {
  if (params.mode && !WIKI_SEARCH_MODES.includes(params.mode))
    throw new Error(`wiki search --mode must be one of: ${WIKI_SEARCH_MODES.join(", ")}.`);
  await syncMemoryWikiImportedSources({
    config: params.config,
    appConfig: params.appConfig,
  });
  const results = await searchMemoryWiki({
    config: params.config,
    appConfig: params.appConfig,
    ...(params.agentId ? { agentId: params.agentId } : {}),
    query: params.query,
    maxResults: params.maxResults,
    searchBackend: params.searchBackend,
    searchCorpus: params.searchCorpus,
    mode: params.mode,
  });
  writeOutput(
    params.json
      ? JSON.stringify(results, null, 2)
      : results.length === 0
        ? "No wiki or memory results."
        : results
            .map(
              (result, index) =>
                `${index + 1}. ${result.title} (${result.corpus}/${result.kind})\nPath: ${result.path}${typeof result.startLine === "number" && typeof result.endLine === "number" ? `\nLines: ${result.startLine}-${result.endLine}` : ""}${result.provenanceLabel ? `\nProvenance: ${result.provenanceLabel}` : ""}${result.matchedClaimId ? `\nClaim: ${result.matchedClaimId}` : ""}${result.evidenceKinds && result.evidenceKinds.length > 0 ? `\nEvidence: ${result.evidenceKinds.join(", ")}` : ""}\nSnippet: ${result.snippet}`,
            )
            .join("\n\n"),
    params.stdout,
  );
  return results;
}
async function runWikiGet(params) {
  await syncMemoryWikiImportedSources({
    config: params.config,
    appConfig: params.appConfig,
  });
  const result = await getMemoryWikiPage({
    config: params.config,
    appConfig: params.appConfig,
    ...(params.agentId ? { agentId: params.agentId } : {}),
    lookup: params.lookup,
    fromLine: params.fromLine,
    lineCount: params.lineCount,
    searchBackend: params.searchBackend,
    searchCorpus: params.searchCorpus,
  });
  writeOutput(
    params.json
      ? JSON.stringify(result, null, 2)
      : (result?.content ?? `Wiki page not found: ${params.lookup}`),
    params.stdout,
  );
  return result;
}
async function runWikiApplySynthesis(params) {
  const sourceIds = normalizeCliStringList(params.sourceIds);
  if (!sourceIds) throw new Error("wiki apply synthesis requires at least one --source-id.");
  const body = await resolveWikiApplyBody({
    body: params.body,
    bodyFile: params.bodyFile,
  });
  await syncMemoryWikiImportedSources({
    config: params.config,
    appConfig: params.appConfig,
  });
  const result = await applyMemoryWikiMutation({
    config: params.config,
    mutation: {
      op: "create_synthesis",
      title: params.title,
      body,
      sourceIds,
      ...(normalizeCliStringList(params.contradictions)
        ? { contradictions: normalizeCliStringList(params.contradictions) }
        : {}),
      ...(normalizeCliStringList(params.questions)
        ? { questions: normalizeCliStringList(params.questions) }
        : {}),
      ...(typeof params.confidence === "number" ? { confidence: params.confidence } : {}),
      ...(params.status?.trim() ? { status: params.status.trim() } : {}),
    },
  });
  writeOutput(formatMemoryWikiMutationSummary(result, params.json), params.stdout);
  return result;
}
async function runWikiApplyMetadata(params) {
  await syncMemoryWikiImportedSources({
    config: params.config,
    appConfig: params.appConfig,
  });
  const result = await applyMemoryWikiMutation({
    config: params.config,
    mutation: {
      op: "update_metadata",
      lookup: params.lookup,
      ...(normalizeCliStringList(params.sourceIds)
        ? { sourceIds: normalizeCliStringList(params.sourceIds) }
        : {}),
      ...(normalizeCliStringList(params.contradictions)
        ? { contradictions: normalizeCliStringList(params.contradictions) }
        : {}),
      ...(normalizeCliStringList(params.questions)
        ? { questions: normalizeCliStringList(params.questions) }
        : {}),
      ...(params.clearConfidence
        ? { confidence: null }
        : typeof params.confidence === "number"
          ? { confidence: params.confidence }
          : {}),
      ...(params.status?.trim() ? { status: params.status.trim() } : {}),
    },
  });
  writeOutput(formatMemoryWikiMutationSummary(result, params.json), params.stdout);
  return result;
}
async function runWikiBridgeImport(params) {
  const render = (value) =>
    `Bridge import synced ${value.artifactCount} artifacts across ${value.workspaces} workspaces (${value.importedCount} new, ${value.updatedCount} updated, ${value.skippedCount} unchanged, ${value.removedCount} removed). Indexes ${value.indexesRefreshed ? `refreshed (${value.indexUpdatedFiles.length} files)` : `not refreshed (${value.indexRefreshReason})`}.`;
  if (shouldRouteBridgeRuntimeThroughGateway(params.config)) {
    const result = await callWikiGateway("wiki.bridge.import", params.agentId);
    writeOutput(formatGatewayJsonOrText(result, params.json, render), params.stdout);
    return result;
  }
  return runWikiCommandWithSummary({
    json: params.json,
    stdout: params.stdout,
    run: () =>
      syncMemoryWikiImportedSources({
        config: params.config,
        appConfig: params.appConfig,
      }),
    render,
  });
}
async function runWikiUnsafeLocalImport(params) {
  if (params.config.vault.scope === "agent")
    throw new Error("Unsafe-local import does not support memory-wiki vault.scope=agent.");
  return runWikiCommandWithSummary({
    json: params.json,
    stdout: params.stdout,
    run: () =>
      syncMemoryWikiImportedSources({
        config: params.config,
        appConfig: params.appConfig,
      }),
    render: (value) =>
      `Unsafe-local import synced ${value.artifactCount} artifacts (${value.importedCount} new, ${value.updatedCount} updated, ${value.skippedCount} unchanged, ${value.removedCount} removed). Indexes ${value.indexesRefreshed ? `refreshed (${value.indexUpdatedFiles.length} files)` : `not refreshed (${value.indexRefreshReason})`}.`,
  });
}
async function runWikiObsidianStatus(params) {
  return runWikiCommandWithSummary({
    json: params.json,
    stdout: params.stdout,
    run: () => probeObsidianCli(),
    render: (value) =>
      value.available
        ? `Obsidian CLI available at ${value.command}`
        : "Obsidian CLI is not available on PATH.",
  });
}
function assertOfficialObsidianCliSupported(config) {
  if (config.vault.scope === "agent")
    throw new Error("Official Obsidian CLI actions do not support memory-wiki vault.scope=agent.");
}
async function runWikiObsidianSearch(params) {
  assertOfficialObsidianCliSupported(params.config);
  return runWikiCommandWithSummary({
    json: params.json,
    stdout: params.stdout,
    run: () =>
      runObsidianSearch({
        config: params.config,
        query: params.query,
      }),
    render: (value) => value.stdout.trim(),
  });
}
async function runWikiObsidianOpenCli(params) {
  assertOfficialObsidianCliSupported(params.config);
  return runWikiCommandWithSummary({
    json: params.json,
    stdout: params.stdout,
    run: () =>
      runObsidianOpen({
        config: params.config,
        vaultPath: params.vaultPath,
      }),
    render: (value) => value.stdout.trim() || "Opened in Obsidian.",
  });
}
async function runWikiObsidianCommandCli(params) {
  assertOfficialObsidianCliSupported(params.config);
  return runWikiCommandWithSummary({
    json: params.json,
    stdout: params.stdout,
    run: () =>
      runObsidianCommand({
        config: params.config,
        id: params.id,
      }),
    render: (value) => value.stdout.trim() || "Command sent to Obsidian.",
  });
}
async function runWikiObsidianDailyCli(params) {
  assertOfficialObsidianCliSupported(params.config);
  return runWikiCommandWithSummary({
    json: params.json,
    stdout: params.stdout,
    run: () => runObsidianDaily({ config: params.config }),
    render: (value) => value.stdout.trim() || "Opened today's daily note.",
  });
}
function formatChatGptImportSummary(result) {
  if (result.dryRun)
    return `ChatGPT import dry run scanned ${result.conversationCount} conversations (${result.createdCount} new, ${result.updatedCount} updated, ${result.skippedCount} unchanged).`;
  const runSuffix = result.runId ? ` Run id: ${result.runId}.` : "";
  return `ChatGPT import applied ${result.conversationCount} conversations (${result.createdCount} new, ${result.updatedCount} updated, ${result.skippedCount} unchanged). Refreshed ${result.indexUpdatedFiles.length} index file${result.indexUpdatedFiles.length === 1 ? "" : "s"}.${runSuffix}`;
}
function formatChatGptRollbackSummary(result) {
  if (result.alreadyRolledBack)
    return `ChatGPT import run ${result.runId} was already rolled back.`;
  return `Rolled back ChatGPT import run ${result.runId} (${result.removedCount} removed, ${result.restoredCount} restored). Refreshed ${result.indexUpdatedFiles.length} index file${result.indexUpdatedFiles.length === 1 ? "" : "s"}.`;
}
async function runWikiChatGptImport(params) {
  return runWikiCommandWithSummary({
    json: params.json,
    stdout: params.stdout,
    run: () =>
      importChatGptConversations({
        config: params.config,
        exportPath: params.exportPath,
        dryRun: params.dryRun,
      }),
    render: formatChatGptImportSummary,
  });
}
async function runWikiChatGptRollback(params) {
  return runWikiCommandWithSummary({
    json: params.json,
    stdout: params.stdout,
    run: () =>
      rollbackChatGptImportRun({
        config: params.config,
        runId: params.runId,
      }),
    render: formatChatGptRollbackSummary,
  });
}
function registerWikiCli(program, registration) {
  const resolveConfig =
    registration.resolveConfig ??
    ((agentId, currentAppConfig) =>
      resolveMemoryWikiAgentConfig({
        config: registration.config,
        appConfig: currentAppConfig,
        ...(agentId ? { agentId } : {}),
      }));
  let commandContext;
  const requireCommandContext = () => {
    if (!commandContext) throw new Error("Memory Wiki CLI agent context was not resolved.");
    return commandContext;
  };
  const wiki = program
    .command("wiki")
    .description("Inspect and initialize the memory wiki vault")
    .option("--agent <id>", "Agent id for agent-scoped wiki vaults");
  wiki.hook("preAction", () => {
    const requestedAgentId = wiki.opts().agent?.trim() || void 0;
    const currentAppConfig = registration.getAppConfig?.();
    const config = resolveConfig(requestedAgentId, currentAppConfig);
    const agentId = config.agentId ?? requestedAgentId;
    commandContext = {
      config,
      ...(currentAppConfig ? { appConfig: currentAppConfig } : {}),
      ...(agentId ? { agentId } : {}),
    };
  });
  wiki
    .command("status")
    .description("Show wiki vault status")
    .option("--json", "Print JSON")
    .action(async (opts) => {
      const { agentId, appConfig, config } = requireCommandContext();
      await runWikiStatus({
        config,
        appConfig,
        agentId,
        json: opts.json,
      });
    });
  wiki
    .command("doctor")
    .description("Audit wiki vault setup and report actionable fixes")
    .option("--json", "Print JSON")
    .action(async (opts) => {
      const { agentId, appConfig, config } = requireCommandContext();
      await runWikiDoctor({
        config,
        appConfig,
        agentId,
        json: opts.json,
      });
    });
  wiki
    .command("init")
    .description("Initialize the wiki vault layout")
    .option("--json", "Print JSON")
    .action(async (opts) => {
      const { config } = requireCommandContext();
      await runWikiInit({
        config,
        json: opts.json,
      });
    });
  wiki
    .command("compile")
    .description("Refresh generated wiki indexes")
    .option("--json", "Print JSON")
    .action(async (opts) => {
      const { appConfig, config } = requireCommandContext();
      await runWikiCompile({
        config,
        appConfig,
        json: opts.json,
      });
    });
  wiki
    .command("lint")
    .description("Lint the wiki vault and write a report")
    .option("--json", "Print JSON")
    .action(async (opts) => {
      const { appConfig, config } = requireCommandContext();
      await runWikiLint({
        config,
        appConfig,
        json: opts.json,
      });
    });
  wiki
    .command("ingest")
    .description("Ingest a local file into the wiki sources folder")
    .argument("<path>", "Local file path to ingest")
    .option("--title <title>", "Override the source title")
    .option("--json", "Print JSON")
    .action(async (inputPath, opts) => {
      const { config } = requireCommandContext();
      await runWikiIngest({
        config,
        inputPath,
        title: opts.title,
        json: opts.json,
      });
    });
  wiki
    .command("okf")
    .description("Import Open Knowledge Format bundles")
    .command("import")
    .description("Import an unpacked OKF bundle into wiki concept pages")
    .argument("<path>", "OKF bundle directory")
    .option("--json", "Print JSON")
    .action(async (bundlePath, opts) => {
      const { config } = requireCommandContext();
      await runWikiOkfImport({
        config,
        bundlePath,
        json: opts.json,
      });
    });
  addWikiSearchConfigOptions(
    wiki
      .command("search")
      .description("Search wiki pages and, when configured, the active memory corpus")
      .argument("<query>", "Search query")
      .option("--max-results <n>", "Maximum results", (value) =>
        parseWikiPositiveIntegerOption(value, "--max-results"),
      )
      .option("--mode <mode>", `Search mode (${WIKI_SEARCH_MODES.join(", ")})`),
  )
    .option("--json", "Print JSON")
    .action(async (query, opts) => {
      const { agentId, appConfig, config } = requireCommandContext();
      await runWikiSearch({
        config,
        appConfig,
        agentId,
        query,
        maxResults: opts.maxResults,
        searchBackend: opts.backend,
        searchCorpus: opts.corpus,
        mode: opts.mode,
        json: opts.json,
      });
    });
  addWikiSearchConfigOptions(
    wiki
      .command("get")
      .description("Read a wiki page by id or relative path, with optional active-memory fallback")
      .argument("<lookup>", "Relative path or page id")
      .option("--from <n>", "Start line", (value) =>
        parseWikiPositiveIntegerOption(value, "--from"),
      )
      .option("--lines <n>", "Number of lines", (value) =>
        parseWikiPositiveIntegerOption(value, "--lines"),
      ),
  )
    .option("--json", "Print JSON")
    .action(async (lookup, opts) => {
      const { agentId, appConfig, config } = requireCommandContext();
      await runWikiGet({
        config,
        appConfig,
        agentId,
        lookup,
        fromLine: opts.from,
        lineCount: opts.lines,
        searchBackend: opts.backend,
        searchCorpus: opts.corpus,
        json: opts.json,
      });
    });
  const apply = wiki.command("apply").description("Apply narrow wiki mutations");
  addWikiApplyMutationOptions(
    apply
      .command("synthesis")
      .description("Create or refresh a synthesis page with managed summary content")
      .argument("<title>", "Synthesis title")
      .option("--body <text>", "Summary body text")
      .option("--body-file <path>", "Read summary body text from a file"),
  )
    .option("--json", "Print JSON")
    .action(async (title, opts) => {
      const { appConfig, config } = requireCommandContext();
      await runWikiApplySynthesis({
        config,
        appConfig,
        title,
        body: opts.body,
        bodyFile: opts.bodyFile,
        sourceIds: opts.sourceId,
        contradictions: opts.contradiction,
        questions: opts.question,
        confidence: opts.confidence,
        status: opts.status,
        json: opts.json,
      });
    });
  addWikiApplyMutationOptions(
    apply
      .command("metadata")
      .description("Update metadata on an existing page")
      .argument("<lookup>", "Relative path or page id"),
  )
    .option("--clear-confidence", "Remove any stored confidence value")
    .option("--json", "Print JSON")
    .action(async (lookup, opts) => {
      const { appConfig, config } = requireCommandContext();
      await runWikiApplyMetadata({
        config,
        appConfig,
        lookup,
        sourceIds: opts.sourceId,
        contradictions: opts.contradiction,
        questions: opts.question,
        confidence: opts.confidence,
        clearConfidence: opts.clearConfidence,
        status: opts.status,
        json: opts.json,
      });
    });
  wiki
    .command("bridge")
    .description("Import public memory artifacts into the wiki vault")
    .command("import")
    .description("Sync bridge-backed memory artifacts into wiki source pages")
    .option("--json", "Print JSON")
    .action(async (opts) => {
      const { agentId, appConfig, config } = requireCommandContext();
      await runWikiBridgeImport({
        config,
        appConfig,
        agentId,
        json: opts.json,
      });
    });
  wiki
    .command("unsafe-local")
    .description("Import explicitly configured private local paths into wiki source pages")
    .command("import")
    .description("Sync unsafe-local configured paths into wiki source pages")
    .option("--json", "Print JSON")
    .action(async (opts) => {
      const { appConfig, config } = requireCommandContext();
      await runWikiUnsafeLocalImport({
        config,
        appConfig,
        json: opts.json,
      });
    });
  const chatgpt = wiki
    .command("chatgpt")
    .description("Import ChatGPT export history into wiki source pages");
  chatgpt
    .command("import")
    .description("Import a ChatGPT export into draft wiki source pages")
    .requiredOption("--export <path>", "ChatGPT export directory or conversations.json path")
    .option("--dry-run", "Preview changes without writing", false)
    .option("--json", "Print JSON")
    .action(async (opts) => {
      const { config } = requireCommandContext();
      await runWikiChatGptImport({
        config,
        exportPath: opts.export,
        dryRun: opts.dryRun,
        json: opts.json,
      });
    });
  chatgpt
    .command("rollback")
    .description("Roll back a previously applied ChatGPT import run")
    .argument("<run-id>", "Import run id")
    .option("--json", "Print JSON")
    .action(async (runId, opts) => {
      const { config } = requireCommandContext();
      await runWikiChatGptRollback({
        config,
        runId,
        json: opts.json,
      });
    });
  const obsidian = wiki.command("obsidian").description("Run official Obsidian CLI helpers");
  obsidian
    .command("status")
    .description("Probe the Obsidian CLI")
    .option("--json", "Print JSON")
    .action(async (opts) => {
      const { config } = requireCommandContext();
      await runWikiObsidianStatus({
        config,
        json: opts.json,
      });
    });
  obsidian
    .command("search")
    .description("Search the current Obsidian vault")
    .argument("<query>", "Search query")
    .option("--json", "Print JSON")
    .action(async (query, opts) => {
      const { config } = requireCommandContext();
      await runWikiObsidianSearch({
        config,
        query,
        json: opts.json,
      });
    });
  obsidian
    .command("open")
    .description("Open a file in Obsidian by vault-relative path")
    .argument("<path>", "Vault-relative path")
    .option("--json", "Print JSON")
    .action(async (vaultPath, opts) => {
      const { config } = requireCommandContext();
      await runWikiObsidianOpenCli({
        config,
        vaultPath,
        json: opts.json,
      });
    });
  obsidian
    .command("command")
    .description("Execute an Obsidian command palette command by id")
    .argument("<id>", "Obsidian command id")
    .option("--json", "Print JSON")
    .action(async (id, opts) => {
      const { config } = requireCommandContext();
      await runWikiObsidianCommandCli({
        config,
        id,
        json: opts.json,
      });
    });
  obsidian
    .command("daily")
    .description("Open today's daily note in Obsidian")
    .option("--json", "Print JSON")
    .action(async (opts) => {
      const { config } = requireCommandContext();
      await runWikiObsidianDailyCli({
        config,
        json: opts.json,
      });
    });
}
//#endregion
export {
  readQueryableWikiPages as _,
  syncMemoryWikiImportedSources as a,
  initializeMemoryWikiVault as b,
  runObsidianDaily as c,
  lintMemoryWikiVault as d,
  ingestMemoryWikiSource as f,
  getMemoryWikiPage as g,
  WIKI_SEARCH_MODES as h,
  resolveMemoryWikiStatus as i,
  runObsidianOpen as l,
  normalizeMemoryWikiMutationInput as m,
  buildMemoryWikiDoctorReport as n,
  probeObsidianCli as o,
  applyMemoryWikiMutation as p,
  renderMemoryWikiStatus as r,
  runObsidianCommand as s,
  registerWikiCli as t,
  runObsidianSearch as u,
  searchMemoryWiki as v,
  parseWikiMarkdown as x,
  compileMemoryWikiVault as y,
};
