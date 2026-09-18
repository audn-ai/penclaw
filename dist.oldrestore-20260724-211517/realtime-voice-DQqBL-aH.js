import { randomUUID } from "node:crypto";
import {
  n as deliveryContextFromSession,
  o as normalizeDeliveryContext,
} from "./delivery-context.shared-WPZGmi9R.js";
import "./src-Bl7G9qvi.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { c as withTimeout } from "./fs-safe-RNq3oO57.js";
import { t as levenshteinDistance } from "./levenshtein-distance-BhvGlW0t.js";
import { s as resolveSessionWorkStartError } from "./lifecycle-5_TQ_dr5.js";
import { r as getActiveMemorySearchManager } from "./memory-runtime-CzgrvPt7.js";
import {
  a as isModelSelectionLocked,
  r as ModelSelectionLockedError,
} from "./model-overrides-BlzAR7Nc.js";
import {
  O as resolveNonNegativeIntegerOption,
  j as resolveTimerTimeoutMs,
} from "./number-coercion-CJQ8TR--.js";
import { n as forkSessionEntryFromParent } from "./session-fork-4nROD14H.js";
import { c as parseAgentSessionKey } from "./session-key-utils-B8sNp9l4.js";
import "./with-timeout-BseNE9qY.js";
import {
  N as parseRealtimeVoiceAgentConsultArgs,
  j as collectRealtimeVoiceAgentConsultVisibleText,
  k as buildRealtimeVoiceAgentConsultPrompt,
} from "./session-log-runtime-DVXN-XFR.js";
import {
  B as parseSessionThreadInfoFast,
  X as beginSessionWorkAdmission,
} from "./store-CzZJhTF6.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region src/talk/activation-name.ts
/**
 * Realtime voice activation-name matching for direct spoken address.
 *
 * The matcher accepts short names at the leading or trailing edge of a
 * transcript, strips the name before agent routing, and keeps fuzzy matching
 * conservative so ordinary dictation does not trigger Talk turns.
 */
const REALTIME_VOICE_ACTIVATION_NAME_MAX_WORDS = 2;
/** Count alphanumeric words in a configured activation name. */
function realtimeVoiceActivationNameWordCount(value) {
  return Array.from(value.matchAll(/[a-z0-9]+/gi)).length;
}
/** Normalize configured activation names while preserving word boundaries. */
function normalizeRealtimeVoiceActivationName(value) {
  return value.toLowerCase().replace(/\s+/g, " ").trim() || void 0;
}
/** Extract the supported leading activation-name prefix from a longer phrase. */
function normalizeRealtimeVoiceActivationNamePrefix(value, maxWords = 2) {
  const words = Array.from(value.matchAll(/[a-z0-9]+/gi), (match) => match[0]);
  if (words.length === 0) return;
  return words.slice(0, maxWords).join(" ");
}
/** Validate the configured activation name length bound. */
function isSupportedRealtimeVoiceActivationName(value, maxWords = 2) {
  const wordCount = realtimeVoiceActivationNameWordCount(value);
  return wordCount >= 1 && wordCount <= maxWords;
}
/** Normalize and reject unsupported activation names in one reusable step. */
function normalizeSupportedRealtimeVoiceActivationName(value, maxWords = 2) {
  if (typeof value !== "string") return;
  const normalized = normalizeRealtimeVoiceActivationName(value);
  return normalized && isSupportedRealtimeVoiceActivationName(normalized, maxWords)
    ? normalized
    : void 0;
}
/** Prefer longer names first so nested names match the most specific option. */
function sortRealtimeVoiceActivationNames(names) {
  return names.toSorted((left, right) => right.length - left.length || left.localeCompare(right));
}
/** Match and strip a configured activation name from either transcript edge. */
function matchRealtimeVoiceActivationName(text, activationNames, maxWords = 2) {
  const preparedActivationNames = [];
  for (const activationName of activationNames) {
    const normalizedActivationName = normalizeActivationNameCandidate(activationName);
    if (!normalizedActivationName) continue;
    preparedActivationNames.push({
      activationName,
      compact: compactActivationName(normalizedActivationName),
    });
  }
  if (preparedActivationNames.length === 0) return;
  const candidates = [
    ...leadingActivationNameCandidates(text, maxWords),
    ...trailingActivationNameCandidates(text, maxWords),
  ]
    .map((candidate) => ({
      candidate,
      compact: compactActivationName(candidate.heardName),
    }))
    .toSorted((left, right) => right.compact.length - left.compact.length);
  for (const { candidate, compact: heardCompact } of candidates)
    for (const { activationName, compact: activationCompact } of preparedActivationNames) {
      const exactMatch = heardCompact === activationCompact;
      const fuzzyMatch = isFuzzyActivationNameMatch(candidate, heardCompact, activationCompact);
      if (exactMatch || fuzzyMatch)
        return {
          allowed: true,
          text: stripEdgeActivationNameCandidate(text, candidate),
          activationName,
          heardName: candidate.heardName,
          match: exactMatch ? "exact" : "fuzzy",
          edge: candidate.edge,
        };
    }
}
function normalizeActivationNameCandidate(value) {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .replace(/\s+/g, " ")
      .trim() || void 0
  );
}
function compactActivationName(value) {
  return value.replace(/[^a-z0-9]+/g, "");
}
function leadingActivationNameCandidates(text, maxWords) {
  const nameStart = /^\s*(?:(?:hey|ok|okay)(?:\s*[-,:;]+\s*|\s+))?/i.exec(text)?.[0].length ?? 0;
  const candidates = [];
  const candidateStarts = nameStart > 0 ? [0, nameStart] : [0];
  for (const startIndex of candidateStarts) {
    const tokenPattern = /[a-z0-9]+/gi;
    tokenPattern.lastIndex = startIndex;
    const startCandidates = [];
    for (let wordCount = 0; wordCount < maxWords; wordCount += 1) {
      const token = tokenPattern.exec(text);
      if (!token) break;
      const previousEndIndex =
        wordCount === 0 ? startIndex : startCandidates[wordCount - 1]?.endIndex;
      const between = text.slice(previousEndIndex, token.index);
      if (wordCount > 0 && !/^[\s'-]+$/.test(between)) break;
      const endIndex = token.index + token[0].length;
      const heardName = normalizeActivationNameCandidate(text.slice(startIndex, endIndex));
      if (!heardName) break;
      const boundary = text.slice(endIndex).match(/^\s*([,.:;!?-]|$)/);
      startCandidates.push({
        edge: "leading",
        heardName,
        startIndex,
        endIndex,
        strongBoundary: Boolean(boundary),
      });
    }
    candidates.push(...startCandidates);
  }
  return candidates;
}
function trailingActivationNameCandidates(text, maxWords) {
  const tokens = Array.from(text.matchAll(/[a-z0-9]+/gi));
  const candidates = [];
  const tokenCount = Math.min(tokens.length, maxWords);
  for (let wordCount = 1; wordCount <= tokenCount; wordCount += 1) {
    const startToken = tokens[tokens.length - wordCount];
    const endToken = tokens[tokens.length - 1];
    if (!startToken || !endToken?.[0]) break;
    const startIndex = startToken.index ?? 0;
    const endIndex = (endToken.index ?? 0) + endToken[0].length;
    if (!/^\s*(?:[,.:;!?-]+\s*)?$/.test(text.slice(endIndex))) break;
    if (!/(^|[\s,.:;!?-])$/.test(text.slice(0, startIndex))) break;
    const directAddressBoundary = /(^|[,.:;!?-]\s*)$/.test(text.slice(0, startIndex));
    const trailingQuestion = /\?\s*$/.test(text);
    if (wordCount > 1) {
      const previousToken = tokens[tokens.length - wordCount + 1];
      const between = previousToken
        ? text.slice(startIndex + startToken[0].length, previousToken.index)
        : "";
      if (!/^[\s'-]+$/.test(between)) break;
    }
    const heardName = normalizeActivationNameCandidate(text.slice(startIndex, endIndex));
    if (!heardName) break;
    candidates.push({
      edge: "trailing",
      heardName,
      startIndex,
      endIndex,
      strongBoundary: directAddressBoundary && trailingQuestion,
    });
  }
  return candidates;
}
function hasOnlyPhoneticSubstitutions(left, right) {
  if (left.length !== right.length) return false;
  const vowels = /* @__PURE__ */ new Set(["a", "e", "i", "o", "u", "y"]);
  const liquids = /* @__PURE__ */ new Set(["l", "r"]);
  let substitutions = 0;
  for (let index = 0; index < left.length; index += 1) {
    const leftChar = left[index];
    const rightChar = right[index];
    if (leftChar === rightChar) continue;
    const vowelLike = vowels.has(leftChar ?? "") && vowels.has(rightChar ?? "");
    const liquidLike = liquids.has(leftChar ?? "") && liquids.has(rightChar ?? "");
    if (!vowelLike && !liquidLike) return false;
    substitutions += 1;
  }
  return substitutions > 0;
}
function commonPrefixLength(left, right) {
  const limit = Math.min(left.length, right.length);
  for (let index = 0; index < limit; index += 1) if (left[index] !== right[index]) return index;
  return limit;
}
function isFuzzyActivationNameMatch(candidate, heardCompact, activationCompact) {
  if (!heardCompact || !activationCompact || activationCompact.length < 5) return false;
  if (!candidate.strongBoundary) return false;
  if (heardCompact[0] !== activationCompact[0]) return false;
  const distance = levenshteinDistance(heardCompact, activationCompact);
  if (candidate.edge === "trailing")
    return (
      heardCompact.length === activationCompact.length &&
      hasOnlyPhoneticSubstitutions(heardCompact, activationCompact)
    );
  if (distance <= 1) return true;
  if (
    distance === 2 &&
    heardCompact.length >= 4 &&
    activationCompact.length >= 5 &&
    (heardCompact.length !== activationCompact.length ||
      hasOnlyPhoneticSubstitutions(heardCompact, activationCompact) ||
      commonPrefixLength(heardCompact, activationCompact) >= 6)
  )
    return true;
  if (
    distance === 3 &&
    heardCompact.length >= 7 &&
    activationCompact.length >= 7 &&
    heardCompact.length !== activationCompact.length &&
    commonPrefixLength(heardCompact, activationCompact) >= 5
  )
    return true;
  return false;
}
function stripEdgeActivationNameCandidate(text, candidate) {
  if (candidate.edge === "leading")
    return text
      .slice(candidate.endIndex)
      .replace(/^\s*(?:[-,:;.!?]+\s*)?/, "")
      .trim();
  return text
    .slice(0, candidate.startIndex)
    .replace(/\s*(?:[-,:;.!?]+\s*)?$/, "")
    .trim();
}
//#endregion
//#region src/talk/consult-transcript.ts
/**
 * Transcript guardrails for realtime voice agent consults.
 *
 * ASR often emits partial fragments or polite closings that should not trigger
 * an OpenClaw consult. This classifier names those skip reasons for callers.
 */
const REALTIME_VOICE_CONSULT_TRAILING_FRAGMENT_WORDS = /* @__PURE__ */ new Set([
  "a",
  "about",
  "an",
  "and",
  "as",
  "at",
  "because",
  "but",
  "by",
  "for",
  "from",
  "in",
  "of",
  "on",
  "or",
  "so",
  "that",
  "the",
  "then",
  "to",
  "with",
]);
/** Classify transcript text that is empty, incomplete, fragmented, or non-actionable. */
function classifySkippableRealtimeVoiceConsultTranscript(text) {
  const normalized = text.replace(/\s+/g, " ").trim().toLowerCase();
  if (!normalized) return "empty";
  if (/(\.\.\.|…)\s*$/.test(normalized)) return "incomplete-transcript";
  const lastWord = normalized.match(/[a-z']+$/)?.[0]?.replace(/^'+|'+$/g, "");
  if (lastWord && REALTIME_VOICE_CONSULT_TRAILING_FRAGMENT_WORDS.has(lastWord))
    return "trailing-fragment";
  if (
    !normalized.includes("?") &&
    (/^(i'?ll|i will) be (right )?back\b/.test(normalized) ||
      /\b(see you|bye(?:-bye)?|goodbye)\b/.test(normalized))
  )
    return "non-actionable-closing";
}
//#endregion
//#region src/talk/turn-context-tracker.ts
const DEFAULT_REALTIME_VOICE_TURN_CONTEXT_LIMIT = 32;
const DEFAULT_REALTIME_VOICE_IGNORED_CONTEXT_TTL_MS = 1e4;
function createRealtimeVoiceTurnContextTracker(options = {}) {
  const turns = [];
  let recentIgnoredContext;
  let nextId = 0;
  const owner = Symbol("realtimeVoiceTurnContextTracker");
  const now = options.now ?? Date.now;
  const limit = resolveNonNegativeIntegerOption(
    options.limit,
    DEFAULT_REALTIME_VOICE_TURN_CONTEXT_LIMIT,
  );
  const ignoredContextTtlMs = resolveNonNegativeIntegerOption(
    options.ignoredContextTtlMs,
    DEFAULT_REALTIME_VOICE_IGNORED_CONTEXT_TTL_MS,
  );
  const deferUntilAudio = options.deferUntilAudio === true;
  const prune = () => {
    for (let index = turns.length - 1; index >= 0; index -= 1) {
      const turn = turns[index];
      if (turn?.closed && !turn.hasAudio) turns.splice(index, 1);
    }
    while (turns.length > limit) {
      const completedIndex = turns.findIndex((turn) => turn.closed);
      turns.splice(Math.max(completedIndex, 0), 1);
    }
  };
  const expireClosedTurnsBeforeLaterAudio = () => {
    let hasLaterAudio = false;
    for (let index = turns.length - 1; index >= 0; index -= 1) {
      const turn = turns[index];
      if (!turn?.hasAudio) continue;
      if (turn.closed && hasLaterAudio) {
        turns.splice(index, 1);
        continue;
      }
      hasLaterAudio = true;
    }
  };
  const prepareForAudioContextRead = () => {
    prune();
    expireClosedTurnsBeforeLaterAudio();
  };
  const owns = (handle) => handle[owner] === true;
  return {
    open(context, ...extra) {
      const startedAt = now();
      const handle = {
        ...(extra[0] ?? {}),
        [owner]: true,
        id: `realtime-turn:${startedAt}:${++nextId}`,
        context,
        hasAudio: false,
        closed: false,
        startedAt,
      };
      if (!deferUntilAudio) {
        turns.push(handle);
        prune();
      }
      return handle;
    },
    markAudio(handle) {
      if (!owns(handle)) return;
      handle.hasAudio = true;
      handle.lastAudioAt = now();
      if (!turns.includes(handle)) {
        turns.push(handle);
        prune();
      }
    },
    close(handle) {
      if (!owns(handle)) return;
      handle.closed = true;
      if (!turns.includes(handle)) return;
      prune();
    },
    consumeAudioContext() {
      prepareForAudioContextRead();
      const index = turns.findIndex((turn) => turn.hasAudio);
      if (index < 0) return;
      const [turn] = turns.splice(index, 1);
      prune();
      return turn?.context;
    },
    peekAudioTurn() {
      prepareForAudioContextRead();
      return turns.find((turn) => turn.hasAudio);
    },
    hasAudioContext() {
      prepareForAudioContextRead();
      return turns.some((turn) => turn.hasAudio);
    },
    rememberIgnoredContext(context) {
      if (context === void 0) return;
      recentIgnoredContext = {
        context,
        createdAt: now(),
      };
    },
    consumeIgnoredContext() {
      const recent = recentIgnoredContext;
      recentIgnoredContext = void 0;
      if (!recent || now() - recent.createdAt > ignoredContextTtlMs) return;
      return recent.context;
    },
    size() {
      prune();
      return turns.length;
    },
    clear() {
      turns.length = 0;
      recentIgnoredContext = void 0;
    },
  };
}
//#endregion
//#region src/talk/output-activity-tracker.ts
/** Create a fresh output activity tracker for a realtime voice session. */
function createRealtimeVoiceOutputActivityTracker(options = {}) {
  const now = options.now ?? Date.now;
  let audioMs = 0;
  let chunks = 0;
  let sourceAudioBytes = 0;
  let sinkAudioBytes = 0;
  let playbackStarted = false;
  let streamEnding = false;
  let lastAudioAt;
  let playbackStartedAt;
  const snapshot = () => ({
    audioMs,
    chunks,
    sourceAudioBytes,
    sinkAudioBytes,
    playbackStarted,
    streamEnding,
    ...(lastAudioAt === void 0 ? {} : { lastAudioAt }),
    ...(playbackStartedAt === void 0 ? {} : { playbackStartedAt }),
  });
  return {
    markStreamOpened() {
      streamEnding = false;
      playbackStarted = false;
      playbackStartedAt = void 0;
      lastAudioAt = void 0;
    },
    markStreamEnding() {
      streamEnding = true;
    },
    markPlaybackStarted() {
      if (playbackStarted) return;
      playbackStarted = true;
      playbackStartedAt = now();
    },
    markAudio(delta) {
      audioMs += Math.max(0, delta.audioMs ?? 0);
      sourceAudioBytes += Math.max(0, delta.sourceAudioBytes ?? 0);
      sinkAudioBytes += Math.max(0, delta.sinkAudioBytes ?? 0);
      chunks += 1;
      lastAudioAt = now();
    },
    reset() {
      audioMs = 0;
      chunks = 0;
      sourceAudioBytes = 0;
      sinkAudioBytes = 0;
      playbackStarted = false;
      streamEnding = false;
      lastAudioAt = void 0;
      playbackStartedAt = void 0;
    },
    isActive(sinkActive = false) {
      return sinkActive || chunks > 0;
    },
    isInterruptible(sinkActive = false) {
      return sinkActive || chunks > 0 || audioMs > 0;
    },
    elapsedPlaybackMs() {
      return playbackStartedAt === void 0 ? 0 : now() - playbackStartedAt;
    },
    playbackWatchdogDelayMs({ marginMs, minMs = 1e3 }) {
      if (playbackStartedAt === void 0 || audioMs <= 0) return;
      return Math.max(minMs, audioMs - (now() - playbackStartedAt) + marginMs);
    },
    snapshot,
  };
}
let realtimeVoiceAgentConsultDeps = {
  randomUUID,
  forkSessionEntryFromParent,
};
/**
 * Fails closed when a realtime consult would cross a model-selection lock.
 */
function assertRealtimeVoiceAgentConsultModelSelectionUnlocked(params) {
  const candidates = /* @__PURE__ */ new Map();
  const remember = (sessionKey, fallbackAgentId, storePath) => {
    const candidateAgentId = parseAgentSessionKey(sessionKey)?.agentId ?? fallbackAgentId;
    const candidateStorePath =
      storePath ??
      params.agentRuntime.session.resolveStorePath(params.cfg.session?.store, {
        agentId: candidateAgentId,
      });
    candidates.set(`${candidateStorePath}\u0000${sessionKey}`, {
      sessionKey,
      storePath: candidateStorePath,
    });
  };
  remember(params.sessionKey, params.agentId, params.storePath);
  const requesterSessionKey = params.spawnedBy?.trim();
  if (requesterSessionKey) {
    const requesterAgentId = parseAgentSessionKey(requesterSessionKey)?.agentId ?? params.agentId;
    remember(requesterSessionKey, requesterAgentId);
    const { baseSessionKey } = parseSessionThreadInfoFast(requesterSessionKey);
    if (baseSessionKey && baseSessionKey !== requesterSessionKey)
      remember(baseSessionKey, requesterAgentId);
  }
  for (const { sessionKey, storePath } of candidates.values())
    if (
      isModelSelectionLocked(
        params.agentRuntime.session.getSessionEntry({
          storePath,
          sessionKey,
          readConsistency: "latest",
        }),
      )
    )
      throw new ModelSelectionLockedError();
}
function resolveRealtimeVoiceAgentSandboxSessionKey(agentId, sessionKey) {
  const trimmed = sessionKey.trim();
  if (trimmed.toLowerCase().startsWith("agent:")) return trimmed;
  return `agent:${agentId}:${trimmed}`;
}
function hasRoutableDeliveryContext(context) {
  return Boolean(context?.channel && context?.to);
}
function resolveDeliverySessionFields(context) {
  const normalized = normalizeDeliveryContext(context);
  if (!normalized?.channel || !normalized.to) return {};
  return {
    deliveryContext: normalized,
    lastChannel: normalized.channel,
    lastTo: normalized.to,
    lastAccountId: normalized.accountId,
    lastThreadId: normalized.threadId,
  };
}
function resolveRealtimeVoiceAgentDeliveryContext(params) {
  const requesterSessionKey = params.spawnedBy?.trim();
  try {
    const candidates = [];
    if (requesterSessionKey) {
      const { baseSessionKey } = parseSessionThreadInfoFast(requesterSessionKey);
      candidates.push(...[requesterSessionKey, baseSessionKey].filter((key) => Boolean(key)));
    }
    candidates.push(params.sessionKey);
    for (const key of candidates) {
      const context = deliveryContextFromSession(
        params.agentRuntime.session.getSessionEntry({
          storePath: params.storePath,
          sessionKey: key,
        }),
      );
      if (hasRoutableDeliveryContext(context)) return context;
    }
  } catch {}
}
async function resolveRealtimeVoiceAgentConsultSessionEntry(params) {
  const now = Date.now();
  const deliveryFields = resolveDeliverySessionFields(params.deliveryContext);
  const requesterSessionKey = params.spawnedBy?.trim();
  const requesterAgentId = parseAgentSessionKey(requesterSessionKey)?.agentId;
  const shouldFork =
    params.contextMode === "fork" &&
    requesterSessionKey &&
    (!requesterAgentId || requesterAgentId === params.agentId);
  let forkDecisionWarning;
  let patched = null;
  if (shouldFork) {
    const forked = await realtimeVoiceAgentConsultDeps.forkSessionEntryFromParent({
      storePath: params.storePath,
      parentSessionKey: requesterSessionKey,
      agentId: params.agentId,
      config: params.cfg,
      sessionKey: params.sessionKey,
      fallbackEntry: {
        sessionId: "",
        updatedAt: now,
      },
      skipForkWhen: (entry) => Boolean(entry.sessionId?.trim()),
      skipPatch: () => ({
        ...deliveryFields,
        updatedAt: now,
      }),
      patch: () => ({
        ...deliveryFields,
        spawnedBy: requesterSessionKey,
        updatedAt: now,
      }),
    });
    if (forked.status === "forked" || forked.status === "skipped") {
      if (forked.status === "skipped" && forked.decision?.status === "skip")
        forkDecisionWarning = forked.decision.message;
      if (forked.sessionEntry.sessionId?.trim()) patched = forked.sessionEntry;
    }
  }
  patched ??= await params.agentRuntime.session.patchSessionEntry({
    storePath: params.storePath,
    sessionKey: params.sessionKey,
    fallbackEntry: {
      sessionId: "",
      updatedAt: now,
    },
    update: async (entry) => {
      if (entry.sessionId?.trim())
        return {
          ...deliveryFields,
          updatedAt: now,
        };
      return {
        ...deliveryFields,
        sessionId: realtimeVoiceAgentConsultDeps.randomUUID(),
        ...(requesterSessionKey ? { spawnedBy: requesterSessionKey } : {}),
        updatedAt: now,
      };
    },
  });
  if (forkDecisionWarning) params.logger.warn(`[talk] ${forkDecisionWarning}`);
  if (patched?.sessionId?.trim()) return patched;
  throw new Error("realtime voice agent consult session could not be initialized");
}
/**
 * Runs an embedded agent consult and returns concise speakable text for realtime voice playback.
 */
async function consultRealtimeVoiceAgent(params) {
  const agentId = params.agentId ?? "main";
  const agentDir = params.agentRuntime.resolveAgentDir(params.cfg, agentId);
  const workspaceDir = params.agentRuntime.resolveAgentWorkspaceDir(params.cfg, agentId);
  const storePath = params.agentRuntime.session.resolveStorePath(params.cfg.session?.store, {
    agentId,
  });
  const initialSessionEntry = params.agentRuntime.session.getSessionEntry({
    storePath,
    sessionKey: params.sessionKey,
    readConsistency: "latest",
  });
  const modelLockParams = {
    cfg: params.cfg,
    agentRuntime: params.agentRuntime,
    agentId,
    sessionKey: params.sessionKey,
    spawnedBy: params.spawnedBy,
    storePath,
  };
  assertRealtimeVoiceAgentConsultModelSelectionUnlocked(modelLockParams);
  const lifecycleAbortController = new AbortController();
  const sessionWorkAdmission = await beginSessionWorkAdmission({
    scope: storePath,
    identities: [params.sessionKey, initialSessionEntry?.sessionId],
    onInterrupt: () =>
      lifecycleAbortController.abort(
        /* @__PURE__ */ new Error(
          "Realtime voice agent consult interrupted by a session lifecycle change.",
        ),
      ),
    assertAllowed: () => {
      const currentEntry = params.agentRuntime.session.getSessionEntry({
        storePath,
        sessionKey: params.sessionKey,
        readConsistency: "latest",
      });
      if (
        initialSessionEntry
          ? !currentEntry || currentEntry.sessionId !== initialSessionEntry.sessionId
          : Boolean(currentEntry)
      )
        throw new Error(`Session "${params.sessionKey}" changed while starting work. Retry.`);
      const archivedSessionError = resolveSessionWorkStartError(params.sessionKey, currentEntry);
      if (archivedSessionError) throw new Error(archivedSessionError);
      assertRealtimeVoiceAgentConsultModelSelectionUnlocked(modelLockParams);
    },
  });
  try {
    return await sessionWorkAdmission.run(async () => {
      await params.agentRuntime.ensureAgentWorkspace({ dir: workspaceDir });
      const resolvedDeliveryContext = resolveRealtimeVoiceAgentDeliveryContext({
        agentRuntime: params.agentRuntime,
        storePath,
        sessionKey: params.sessionKey,
        spawnedBy: params.spawnedBy,
      });
      const sessionEntry = await resolveRealtimeVoiceAgentConsultSessionEntry({
        agentId,
        cfg: params.cfg,
        sessionKey: params.sessionKey,
        spawnedBy: params.spawnedBy,
        contextMode: params.contextMode,
        deliveryContext: resolvedDeliveryContext,
        storePath,
        agentRuntime: params.agentRuntime,
        logger: params.logger,
      });
      const consultDeliveryContext =
        resolvedDeliveryContext ?? deliveryContextFromSession(sessionEntry);
      const sessionId = sessionEntry.sessionId;
      assertRealtimeVoiceAgentConsultModelSelectionUnlocked(modelLockParams);
      const result = await params.agentRuntime.runEmbeddedAgent({
        sessionId,
        sessionKey: params.sessionKey,
        sessionTarget: {
          agentId,
          sessionId,
          sessionKey: params.sessionKey,
          storePath,
        },
        sandboxSessionKey: resolveRealtimeVoiceAgentSandboxSessionKey(agentId, params.sessionKey),
        agentId,
        spawnedBy: params.spawnedBy,
        messageProvider: consultDeliveryContext?.channel ?? params.messageProvider,
        agentAccountId: consultDeliveryContext?.accountId,
        messageTo: consultDeliveryContext?.to,
        messageThreadId: consultDeliveryContext?.threadId,
        currentChannelId: consultDeliveryContext?.to,
        currentThreadTs:
          consultDeliveryContext?.threadId != null
            ? String(consultDeliveryContext.threadId)
            : void 0,
        workspaceDir,
        config: params.cfg,
        prompt: buildRealtimeVoiceAgentConsultPrompt({
          args: params.args,
          transcript: params.transcript,
          surface: params.surface,
          userLabel: params.userLabel,
          assistantLabel: params.assistantLabel,
          questionSourceLabel: params.questionSourceLabel,
        }),
        provider: params.provider,
        model: params.model,
        thinkLevel: params.thinkLevel ?? "high",
        fastMode: params.fastMode,
        verboseLevel: "off",
        reasoningLevel: "off",
        toolResultFormat: "plain",
        toolsAllow: params.toolsAllow,
        timeoutMs:
          params.timeoutMs ?? params.agentRuntime.resolveAgentTimeoutMs({ cfg: params.cfg }),
        runId: `${params.runIdPrefix}:${Date.now()}`,
        lane: params.lane,
        extraSystemPrompt:
          params.extraSystemPrompt ??
          "You are the configured OpenClaw agent receiving delegated requests from a live voice bridge. Act on behalf of the user, use available tools when appropriate, and return a brief speakable result.",
        agentDir,
        abortSignal: lifecycleAbortController.signal,
      });
      const text = collectRealtimeVoiceAgentConsultVisibleText(result.payloads ?? []);
      if (!text) {
        const reason = result.meta?.aborted
          ? "agent run aborted"
          : "agent returned no speakable text";
        params.logger.warn(`[talk] agent consult produced no answer: ${reason}`);
        return { text: params.fallbackText ?? "I need a moment to verify that before answering." };
      }
      return { text };
    });
  } finally {
    sessionWorkAdmission.release();
  }
}
//#endregion
//#region src/talk/agent-talkback-runtime.ts
/** Create a serial consult queue for realtime transcript talkback. */
function createRealtimeVoiceAgentTalkbackQueue(params) {
  let active = false;
  let pendingQuestions = [];
  let debounceTimer;
  let activeAbortController;
  const clearDebounceTimer = () => {
    if (!debounceTimer) return;
    clearTimeout(debounceTimer);
    debounceTimer = void 0;
  };
  const run = async (pending) => {
    const trimmed = pending.question.trim();
    if (!trimmed || params.isStopped()) return;
    if (active) {
      appendPendingQuestion(pendingQuestions, {
        question: trimmed,
        metadata: pending.metadata,
      });
      return;
    }
    active = true;
    let nextQuestion = {
      question: trimmed,
      metadata: pending.metadata,
    };
    let consultStartedAt;
    try {
      while (nextQuestion) {
        if (params.isStopped()) return;
        const currentQuestion = nextQuestion;
        consultStartedAt = Date.now();
        params.logger.info(
          `${params.logPrefix} consult: chars=${currentQuestion.question.length} queued=${pendingQuestions.length}`,
        );
        activeAbortController = new AbortController();
        const result = await params.consult({
          question: currentQuestion.question,
          metadata: currentQuestion.metadata,
          responseStyle: params.responseStyle,
          signal: activeAbortController.signal,
        });
        activeAbortController = void 0;
        const text = result.text.trim();
        params.logger.info(
          `${params.logPrefix} consult done: elapsedMs=${Date.now() - consultStartedAt} answerChars=${text.length} queued=${pendingQuestions.length}`,
        );
        if (!params.isStopped() && text) params.deliver(text);
        nextQuestion = pendingQuestions.shift();
      }
    } catch (error) {
      activeAbortController = void 0;
      if (params.isStopped() || isAbortError(error)) return;
      const message = error instanceof Error ? error.message : String(error);
      const elapsedDetail =
        consultStartedAt === void 0 ? "" : ` elapsedMs=${Date.now() - consultStartedAt}`;
      params.logger.warn(`${params.logPrefix} consult failed:${elapsedDetail} ${message}`);
      params.deliver(params.fallbackText);
    } finally {
      active = false;
      const queuedQuestion = pendingQuestions.shift();
      if (queuedQuestion && !params.isStopped()) run(queuedQuestion);
    }
  };
  return {
    close: () => {
      clearDebounceTimer();
      pendingQuestions = [];
      activeAbortController?.abort();
    },
    enqueue: (question, metadata) => {
      const trimmed = question.trim();
      if (!trimmed || params.isStopped()) return;
      if (active) {
        appendPendingQuestion(pendingQuestions, {
          question: trimmed,
          metadata,
        });
        params.logger.info(
          `${params.logPrefix} consult queued: chars=${trimmed.length} queued=${pendingQuestions.length}`,
        );
        clearDebounceTimer();
        return;
      }
      appendPendingQuestion(pendingQuestions, {
        question: trimmed,
        metadata,
      });
      clearDebounceTimer();
      debounceTimer = setTimeout(() => {
        debounceTimer = void 0;
        const queuedQuestion = pendingQuestions.shift();
        if (queuedQuestion && !params.isStopped()) run(queuedQuestion);
      }, params.debounceMs);
      debounceTimer.unref?.();
    },
  };
}
function appendPendingQuestion(queue, next) {
  const current = queue.at(-1);
  if (current && Object.is(current.metadata, next.metadata)) {
    current.question = `${current.question}\n${next.question}`;
    return;
  }
  queue.push(next);
}
function isAbortError(error) {
  return error instanceof Error && error.name === "AbortError";
}
//#endregion
//#region src/talk/fast-context-runtime.ts
/**
 * Fast context lookup for realtime voice consults.
 *
 * When memory/session search can answer quickly, Talk can return concise
 * context without launching a full agent consult; otherwise callers may fall
 * back to the normal consult flow.
 */
const MAX_SNIPPET_CHARS = 700;
var RealtimeFastContextTimeoutError = class extends Error {
  constructor(timeoutMs) {
    super(`fast context lookup timed out after ${timeoutMs}ms`);
    this.name = "RealtimeFastContextTimeoutError";
  }
};
function normalizeSnippet(text) {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= MAX_SNIPPET_CHARS) return normalized;
  return `${truncateUtf16Safe(normalized, MAX_SNIPPET_CHARS - 1).trimEnd()}...`;
}
function buildSearchQuery(args) {
  const parsed = parseRealtimeVoiceAgentConsultArgs(args);
  return [parsed.question, parsed.context].filter(Boolean).join("\n\n");
}
function resolveLabels(labels) {
  return {
    audienceLabel: labels?.audienceLabel?.trim() || "person",
    contextName: labels?.contextName?.trim() || "OpenClaw memory context",
  };
}
function buildContextText(params) {
  const hits = params.hits
    .map((hit, index) => {
      const location = `${hit.path}:${hit.startLine}-${hit.endLine}`;
      return `${index + 1}. [${hit.source}] ${location}\n${normalizeSnippet(hit.snippet)}`;
    })
    .join("\n\n");
  return [
    `Fast ${params.labels.contextName} found for the live ${params.labels.audienceLabel}.`,
    `Use this context only if it answers the ${params.labels.audienceLabel}'s question. If it is not relevant, say briefly that you do not have that context handy.`,
    `Question:\n${params.query}`,
    `Context:\n${hits}`,
  ].join("\n\n");
}
function buildMissText(query, labels) {
  return [
    `No relevant ${labels.contextName} was found quickly for the live ${labels.audienceLabel}.`,
    `Answer briefly that you do not have that context handy. Do not keep checking unless the ${labels.audienceLabel} asks you to.`,
    `Question:\n${query}`,
  ].join("\n\n");
}
async function lookupFastContext(params) {
  const memory = await getActiveMemorySearchManager({
    cfg: params.cfg,
    agentId: params.agentId,
  });
  if (!memory.manager)
    return {
      status: "unavailable",
      error: memory.error ?? "no active memory manager",
    };
  return {
    status: "hits",
    hits: await memory.manager.search(params.query, {
      maxResults: params.config.maxResults,
      sessionKey: params.sessionKey,
      sources: params.config.sources,
    }),
  };
}
/** Try to answer a realtime consult from fast memory/session context. */
async function resolveRealtimeVoiceFastContextConsult(params) {
  if (!params.config.enabled) return { handled: false };
  const labels = resolveLabels(params.labels);
  const query = buildSearchQuery(params.args);
  try {
    const timeoutMs = resolveTimerTimeoutMs(params.config.timeoutMs, 1);
    const lookup = await withTimeout(
      lookupFastContext({
        cfg: params.cfg,
        agentId: params.agentId,
        sessionKey: params.sessionKey,
        config: params.config,
        query,
      }),
      timeoutMs,
      { createError: () => new RealtimeFastContextTimeoutError(timeoutMs) },
    );
    if (lookup.status === "unavailable") {
      params.logger.debug?.(`[talk] fast context unavailable: ${lookup.error}`);
      return params.config.fallbackToConsult
        ? { handled: false }
        : {
            handled: true,
            result: { text: buildMissText(query, labels) },
          };
    }
    const { hits } = lookup;
    if (hits.length === 0)
      return params.config.fallbackToConsult
        ? { handled: false }
        : {
            handled: true,
            result: { text: buildMissText(query, labels) },
          };
    return {
      handled: true,
      result: {
        text: buildContextText({
          query,
          hits,
          labels,
        }),
      },
    };
  } catch (error) {
    const message = formatErrorMessage(error);
    params.logger.debug?.(`[talk] fast context lookup failed: ${message}`);
    return params.config.fallbackToConsult
      ? { handled: false }
      : {
          handled: true,
          result: { text: buildMissText(query, labels) },
        };
  }
}
//#endregion
//#region src/talk/audio-codec.ts
const TELEPHONY_SAMPLE_RATE = 8e3;
const RESAMPLE_FILTER_TAPS = 31;
const RESAMPLE_CUTOFF_GUARD = 0.94;
const RESAMPLE_MAX_PRECOMPUTED_PHASES = 4096;
const RESAMPLE_HALF_TAPS = Math.floor(RESAMPLE_FILTER_TAPS / 2);
const RESAMPLE_WINDOW = Array.from(
  { length: RESAMPLE_FILTER_TAPS },
  (_, tapIndex) => 0.5 - 0.5 * Math.cos((2 * Math.PI * tapIndex) / (RESAMPLE_FILTER_TAPS - 1)),
);
const HOST_IS_LITTLE_ENDIAN = new Uint16Array(new Uint8Array([1, 0]).buffer)[0] === 1;
/** Clamp an intermediate sample to signed 16-bit PCM range. */
function clamp16(value) {
  return Math.max(-32768, Math.min(32767, value));
}
function canUseInt16View(buffer) {
  return HOST_IS_LITTLE_ENDIAN && buffer.byteOffset % Int16Array.BYTES_PER_ELEMENT === 0;
}
function int16View(buffer) {
  return new Int16Array(
    buffer.buffer,
    buffer.byteOffset,
    Math.floor(buffer.byteLength / Int16Array.BYTES_PER_ELEMENT),
  );
}
function readInt16Samples(buffer) {
  if (canUseInt16View(buffer)) return int16View(buffer);
  const samples = new Int16Array(Math.floor(buffer.byteLength / Int16Array.BYTES_PER_ELEMENT));
  for (let i = 0; i < samples.length; i += 1)
    samples[i] = buffer.readInt16LE(i * Int16Array.BYTES_PER_ELEMENT);
  return samples;
}
function sinc(x) {
  if (x === 0) return 1;
  return Math.sin(Math.PI * x) / (Math.PI * x);
}
function gcd(left, right) {
  let a = Math.abs(Math.trunc(left));
  let b = Math.abs(Math.trunc(right));
  while (b !== 0) {
    const next = a % b;
    a = b;
    b = next;
  }
  return a || 1;
}
function buildResampleKernel(inputSampleRate, outputSampleRate, cutoffCyclesPerSample) {
  if (!Number.isInteger(inputSampleRate) || !Number.isInteger(outputSampleRate)) return;
  const divisor = gcd(inputSampleRate, outputSampleRate);
  const inputStep = inputSampleRate / divisor;
  const phaseCount = outputSampleRate / divisor;
  if (phaseCount > RESAMPLE_MAX_PRECOMPUTED_PHASES) return;
  return {
    coefficients: Array.from({ length: phaseCount }, (_, phaseIndex) => {
      const phase = phaseIndex / phaseCount;
      const phaseCoefficients = new Float64Array(RESAMPLE_FILTER_TAPS);
      for (let tap = -15; tap <= RESAMPLE_HALF_TAPS; tap += 1) {
        const distance = tap - phase;
        const lowPass = 2 * cutoffCyclesPerSample * sinc(2 * cutoffCyclesPerSample * distance);
        const tapIndex = tap + RESAMPLE_HALF_TAPS;
        phaseCoefficients[tapIndex] = lowPass * (RESAMPLE_WINDOW[tapIndex] ?? 0);
      }
      return phaseCoefficients;
    }),
    inputStep,
    phaseCount,
  };
}
function sampleBandlimitedWithCoefficients(input, center, coefficients) {
  let weighted = 0;
  let weightSum = 0;
  for (let tap = -15; tap <= RESAMPLE_HALF_TAPS; tap += 1) {
    const sampleIndex = center + tap;
    if (sampleIndex < 0 || sampleIndex >= input.length) continue;
    const coeff = coefficients[tap + RESAMPLE_HALF_TAPS] ?? 0;
    weighted += (input[sampleIndex] ?? 0) * coeff;
    weightSum += coeff;
  }
  if (weightSum === 0) return input[Math.max(0, Math.min(input.length - 1, center))] ?? 0;
  return weighted / weightSum;
}
function sampleBandlimited(input, srcPos, cutoffCyclesPerSample) {
  const center = Math.floor(srcPos);
  let weighted = 0;
  let weightSum = 0;
  for (let tap = -15; tap <= RESAMPLE_HALF_TAPS; tap += 1) {
    const sampleIndex = center + tap;
    if (sampleIndex < 0 || sampleIndex >= input.length) continue;
    const distance = sampleIndex - srcPos;
    const coeff =
      2 *
      cutoffCyclesPerSample *
      sinc(2 * cutoffCyclesPerSample * distance) *
      (RESAMPLE_WINDOW[tap + RESAMPLE_HALF_TAPS] ?? 0);
    weighted += (input[sampleIndex] ?? 0) * coeff;
    weightSum += coeff;
  }
  if (weightSum === 0)
    return input[Math.max(0, Math.min(input.length - 1, Math.round(srcPos)))] ?? 0;
  return weighted / weightSum;
}
/** Resample little-endian signed 16-bit PCM to another integer sample rate. */
function resamplePcm(input, inputSampleRate, outputSampleRate) {
  if (inputSampleRate === outputSampleRate) return input;
  const inputSamples = Math.floor(input.length / 2);
  if (inputSamples === 0) return Buffer.alloc(0);
  const ratio = inputSampleRate / outputSampleRate;
  const outputSamples = Math.floor(inputSamples / ratio);
  const output = Buffer.alloc(outputSamples * 2);
  const maxCutoff = 0.5;
  const downsampleCutoff = ratio > 1 ? maxCutoff / ratio : maxCutoff;
  const cutoffCyclesPerSample = Math.max(0.01, downsampleCutoff * RESAMPLE_CUTOFF_GUARD);
  const kernel = buildResampleKernel(inputSampleRate, outputSampleRate, cutoffCyclesPerSample);
  const inputView = readInt16Samples(input);
  const outputView = canUseInt16View(output) ? int16View(output) : void 0;
  for (let i = 0; i < outputSamples; i += 1) {
    const sample = Math.round(
      kernel
        ? sampleBandlimitedWithCoefficients(
            inputView,
            Math.floor((i * inputSampleRate) / outputSampleRate),
            expectDefined(
              kernel.coefficients[(i * kernel.inputStep) % kernel.phaseCount],
              "coefficients entry at (i * kernel.input step) % kernel.phase count",
            ) ?? kernel.coefficients[0],
          )
        : sampleBandlimited(inputView, i * ratio, cutoffCyclesPerSample),
    );
    if (outputView) outputView[i] = clamp16(sample);
    else output.writeInt16LE(clamp16(sample), i * 2);
  }
  return output;
}
/** Resample little-endian signed 16-bit PCM to the telephony 8 kHz rate. */
function resamplePcmTo8k(input, inputSampleRate) {
  return resamplePcm(input, inputSampleRate, TELEPHONY_SAMPLE_RATE);
}
/** Convert little-endian signed 16-bit PCM samples to G.711 mu-law bytes. */
function pcmToMulaw(pcm) {
  const pcmView = readInt16Samples(pcm);
  const mulaw = Buffer.alloc(pcmView.length);
  for (let i = 0; i < pcmView.length; i += 1) mulaw[i] = linearToMulaw(pcmView[i] ?? 0);
  return mulaw;
}
/** Expand G.711 mu-law bytes into little-endian signed 16-bit PCM samples. */
function mulawToPcm(mulaw) {
  const pcm = Buffer.alloc(mulaw.length * 2);
  const pcmView = canUseInt16View(pcm) ? int16View(pcm) : void 0;
  if (pcmView) {
    for (let i = 0; i < mulaw.length; i += 1) pcmView[i] = clamp16(mulawToLinear(mulaw[i] ?? 0));
    return pcm;
  }
  for (let i = 0; i < mulaw.length; i += 1)
    pcm.writeInt16LE(clamp16(mulawToLinear(mulaw[i] ?? 0)), i * 2);
  return pcm;
}
/** Resample signed 16-bit PCM to 8 kHz and encode it as G.711 mu-law. */
function convertPcmToMulaw8k(pcm, inputSampleRate) {
  return pcmToMulaw(resamplePcmTo8k(pcm, inputSampleRate));
}
function linearToMulaw(sampleInput) {
  let sample = sampleInput;
  const BIAS = 132;
  const CLIP = 32635;
  const sign = sample < 0 ? 128 : 0;
  if (sample < 0) sample = -sample;
  if (sample > CLIP) sample = CLIP;
  sample += BIAS;
  let exponent = 7;
  for (let expMask = 16384; (sample & expMask) === 0 && exponent > 0; exponent -= 1) expMask >>= 1;
  const mantissa = (sample >> (exponent + 3)) & 15;
  return ~(sign | (exponent << 4) | mantissa) & 255;
}
function mulawToLinear(value) {
  const muLaw = ~value & 255;
  const sign = muLaw & 128;
  const exponent = (muLaw >> 4) & 7;
  let sample = (((muLaw & 15) << 3) + 132) << exponent;
  sample -= 132;
  return sign ? -sample : sample;
}
//#endregion
export {
  normalizeRealtimeVoiceActivationNamePrefix as _,
  resamplePcmTo8k as a,
  sortRealtimeVoiceActivationNames as b,
  assertRealtimeVoiceAgentConsultModelSelectionUnlocked as c,
  createRealtimeVoiceTurnContextTracker as d,
  classifySkippableRealtimeVoiceConsultTranscript as f,
  normalizeRealtimeVoiceActivationName as g,
  matchRealtimeVoiceActivationName as h,
  resamplePcm as i,
  consultRealtimeVoiceAgent as l,
  isSupportedRealtimeVoiceActivationName as m,
  mulawToPcm as n,
  resolveRealtimeVoiceFastContextConsult as o,
  REALTIME_VOICE_ACTIVATION_NAME_MAX_WORDS as p,
  pcmToMulaw as r,
  createRealtimeVoiceAgentTalkbackQueue as s,
  convertPcmToMulaw8k as t,
  createRealtimeVoiceOutputActivityTracker as u,
  normalizeSupportedRealtimeVoiceActivationName as v,
  realtimeVoiceActivationNameWordCount as y,
};
