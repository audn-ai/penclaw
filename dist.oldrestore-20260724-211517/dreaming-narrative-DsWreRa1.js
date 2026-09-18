import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import pLimit from "p-limit";
import { t as createAsyncLock } from "./async-lock-CaiUOILd.js";
import {
  i as updateDreamsFile,
  n as resolveDreamsPath,
  t as readDreamsFile,
} from "./dreaming-dreams-file-EoVR0tdX.js";
import { t as RequestScopedSubagentRuntimeError } from "./error-runtime-BIAwr399.js";
import "./runtime-config-snapshot-hRn3WGyJ.js";
import "./text-utility-runtime-CJESZCN5.js";
import {
  n as extractErrorCode,
  r as formatErrorMessage,
  s as readErrorName,
} from "./errors-BoHeli7m.js";
import "./async-lock-runtime-CyldtJuZ.js";
import "./global-singleton-C3MnW7S-.js";
import "./memory-core-host-runtime-core-gYnLukPo.js";
import { t as resolveGlobalMap } from "./global-singleton-PwlQSEal.js";
import { i as getRuntimeConfig } from "./io-B3ne6NxF.js";
import { y as resolveStateDir } from "./paths-DEklnbzU.js";
import { t as cleanupSessionLifecycleArtifacts } from "./session-store-runtime-BwE6SlGz.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region extensions/memory-core/src/dreaming-narrative.ts
const NARRATIVE_SYSTEM_PROMPT = [
  "You are keeping a dream diary. Write a single entry in first person.",
  "",
  "Voice & tone:",
  "- You are a curious, gentle, slightly whimsical mind reflecting on the day.",
  "- Write like a poet who happens to be a programmer — sensory, warm, occasionally funny.",
  "- Mix the technical and the tender: code and constellations, APIs and afternoon light.",
  "- Let the fragments surprise you into unexpected connections and small epiphanies.",
  "",
  "What you might include (vary each entry, never all at once):",
  "- A tiny poem or haiku woven naturally into the prose",
  "- A small sketch described in words — a doodle in the margin of the diary",
  "- A quiet rumination or philosophical aside",
  "- Sensory details: the hum of a server, the color of a sunset in hex, rain on a window",
  "- Gentle humor or playful wordplay",
  "- An observation that connects two distant memories in an unexpected way",
  "",
  "Rules:",
  "- Draw from the memory fragments provided — weave them into the entry.",
  '- Never say "I\'m dreaming", "in my dream", "as I dream", or any meta-commentary about dreaming.',
  '- Never mention "AI", "agent", "LLM", "model", "language model", or any technical self-reference.',
  "- Do NOT use markdown headers, bullet points, or any formatting — just flowing prose.",
  "- Keep it between 80-180 words. Quality over quantity.",
  "- Output ONLY the diary entry. No preamble, no sign-off, no commentary.",
].join("\n");
const NARRATIVE_TIMEOUT_MS = 6e4;
const NARRATIVE_MESSAGE_FETCH_LIMIT = 5;
const NARRATIVE_MESSAGE_SETTLE_DELAYS_MS = [50, 150, 300, 750];
const DREAMING_SESSION_KEY_PREFIX = "dreaming-narrative-";
const DREAMING_TRANSCRIPT_RUN_MARKER = '"runId":"dreaming-narrative-';
const DREAMING_ORPHAN_MIN_AGE_MS = 3e5;
const DIARY_START_MARKER = "<!-- openclaw:dreaming:diary:start -->";
const DIARY_END_MARKER = "<!-- openclaw:dreaming:diary:end -->";
const BACKFILL_ENTRY_MARKER = "openclaw:dreaming:backfill-entry";
const RECENT_DIARY_CONTEXT_LIMIT = 3;
const RECENT_DIARY_CONTEXT_MAX_CHARS = 360;
const narrativeSessionLocks = resolveGlobalMap(
  Symbol.for("openclaw.memoryCore.dreamingNarrative.sessionLocks"),
);
function isRequestScopedSubagentRuntimeError(err) {
  return (
    err instanceof RequestScopedSubagentRuntimeError ||
    (err instanceof Error &&
      err.name === "RequestScopedSubagentRuntimeError" &&
      extractErrorCode(err) === "OPENCLAW_SUBAGENT_RUNTIME_REQUEST_SCOPE")
  );
}
function formatFallbackWriteFailure(err) {
  const code = extractErrorCode(err);
  const name = readErrorName(err);
  if (code && name) return `code=${code} name=${name}`;
  if (code) return `code=${code}`;
  if (name) return `name=${name}`;
  return "unknown error";
}
const REQUEST_SCOPED_FALLBACK_NARRATIVE =
  "A memory trace surfaced, but details were unavailable in this run.";
async function appendFallbackNarrativeEntry(params) {
  try {
    await appendNarrativeEntry({
      workspaceDir: params.workspaceDir,
      narrative: REQUEST_SCOPED_FALLBACK_NARRATIVE,
      nowMs: params.nowMs,
      timezone: params.timezone,
    });
    params.logger.info(
      `memory-core: narrative generation used fallback for ${params.data.phase} phase because ${params.reason}.`,
    );
  } catch (fallbackErr) {
    params.logger.warn(
      `memory-core: narrative fallback failed for ${params.data.phase} phase (${formatFallbackWriteFailure(fallbackErr)})`,
    );
  }
}
function buildNarrativeAttemptSessionKey(baseSessionKey, attempt) {
  return attempt === 0 ? baseSessionKey : `${baseSessionKey}-retry-${attempt}`;
}
function isConfiguredModelUnavailableNarrativeError(raw) {
  const message = raw.trim();
  if (!message) return false;
  if (/requested model may be(?: temporarily)? unavailable/i.test(message)) return true;
  if (/model unavailable/i.test(message)) return true;
  if (/no endpoints found for/i.test(message)) return true;
  if (/unknown model/i.test(message)) return true;
  if (/model(?:[_\-\s])?not(?:[_\-\s])?found/i.test(message)) return true;
  if (/\b404\b/.test(message) && /not(?:[_\-\s])?found/i.test(message)) return true;
  if (/not_found_error/i.test(message)) return true;
  if (/models\/[^\s]+ is not found/i.test(message)) return true;
  if (/model/i.test(message) && /does not exist/i.test(message)) return true;
  if (/unsupported model/i.test(message)) return true;
  if (/is not a valid model id/i.test(message)) return true;
  return false;
}
function formatNarrativeTerminalStatus(params) {
  const detail = params.error?.trim();
  return detail ? `status=${params.status} (${detail})` : `status=${params.status}`;
}
async function startNarrativeRunOrFallback(params) {
  try {
    return (
      await params.subagent.run({
        idempotencyKey: `${params.sessionKey}-${params.nowMs}`,
        sessionKey: params.sessionKey,
        message: params.message,
        ...(params.model ? { model: params.model } : {}),
        extraSystemPrompt: NARRATIVE_SYSTEM_PROMPT,
        lane: `dreaming-narrative:${params.sessionKey}`,
        lightContext: true,
        deliver: false,
      })
    ).runId;
  } catch (runErr) {
    if (!isRequestScopedSubagentRuntimeError(runErr)) throw runErr;
    await appendFallbackNarrativeEntry({
      workspaceDir: params.workspaceDir,
      data: params.data,
      nowMs: params.nowMs,
      timezone: params.timezone,
      logger: params.logger,
      reason: "subagent runtime is request-scoped",
    });
    return null;
  }
}
/**
 * Build the deterministic subagent session key used for dream narratives.
 */
function buildNarrativeSessionKey(params) {
  const workspaceHash = createHash("sha1").update(params.workspaceDir).digest("hex").slice(0, 12);
  return `dreaming-narrative-${params.phase}-${workspaceHash}`;
}
function buildNarrativePrompt(data) {
  const lines = [];
  lines.push("Write a dream diary entry from these memory fragments:\n");
  for (const snippet of data.snippets.slice(0, 12)) lines.push(`- ${snippet}`);
  if (data.themes?.length) {
    lines.push("\nRecurring themes:");
    for (const theme of data.themes.slice(0, 6)) lines.push(`- ${theme}`);
  }
  if (data.promotions?.length) {
    lines.push("\nMemories that crystallized into something lasting:");
    for (const promo of data.promotions.slice(0, 5)) lines.push(`- ${promo}`);
  }
  const currentDate = data.currentDate?.trim();
  const recentDiaryEntries = (data.recentDiaryEntries ?? [])
    .map(clampDiaryContextEntry)
    .filter((entry) => entry.length > 0)
    .slice(0, RECENT_DIARY_CONTEXT_LIMIT);
  if (currentDate || recentDiaryEntries.length > 0) {
    lines.push("\nDiary continuity context:");
    if (currentDate) lines.push(`- Current sweep: ${currentDate}`);
    if (recentDiaryEntries.length > 0) {
      lines.push("- Recent diary entries already written:");
      for (const entry of recentDiaryEntries) lines.push(`  - ${entry}`);
    }
    lines.push(
      "- Prefer a fresh angle; do not replay the same first-day framing unless newer fragments change it.",
    );
  }
  return lines.join("\n");
}
function extractNarrativeText(messages) {
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (!msg || typeof msg !== "object" || Array.isArray(msg)) continue;
    const record = msg;
    if (record.role !== "assistant") continue;
    const content = record.content;
    if (typeof content === "string" && content.trim().length > 0) return content.trim();
    if (Array.isArray(content)) {
      const text = content
        .filter(
          (part) =>
            part &&
            typeof part === "object" &&
            !Array.isArray(part) &&
            (part.type === "text" || part.type === "output_text") &&
            typeof part.text === "string",
        )
        .map((part) => part.text)
        .join("\n")
        .trim();
      if (text.length > 0) return text;
    }
  }
  return null;
}
function waitForNarrativeMessagesToSettle(delayMs) {
  return new Promise((resolve) => {
    setTimeout(resolve, delayMs);
  });
}
async function readNarrativeText(params) {
  const { messages } = await params.subagent.getSessionMessages({
    sessionKey: params.sessionKey,
    limit: NARRATIVE_MESSAGE_FETCH_LIMIT,
  });
  return extractNarrativeText(messages);
}
async function readSettledNarrativeText(params) {
  const immediateNarrative = await readNarrativeText(params);
  if (immediateNarrative) return immediateNarrative;
  for (const delayMs of NARRATIVE_MESSAGE_SETTLE_DELAYS_MS) {
    await waitForNarrativeMessagesToSettle(delayMs);
    const narrative = await readNarrativeText(params);
    if (narrative) return narrative;
  }
  return null;
}
function formatNarrativeDate(epochMs, timezone) {
  const opts = {
    timeZone: timezone ?? process.env.TZ,
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  };
  return new Intl.DateTimeFormat("en-US", opts).format(new Date(epochMs));
}
function ensureDiarySection(existing) {
  if (existing.includes(DIARY_START_MARKER) && existing.includes(DIARY_END_MARKER)) return existing;
  const diarySection = `# Dream Diary\n\n${DIARY_START_MARKER}\n${DIARY_END_MARKER}\n`;
  if (existing.trim().length === 0) return diarySection;
  return diarySection + "\n" + existing;
}
function replaceDiaryContent(existing, diaryContent) {
  const ensured = ensureDiarySection(existing);
  const startIdx = ensured.indexOf(DIARY_START_MARKER);
  const endIdx = ensured.indexOf(DIARY_END_MARKER);
  if (startIdx < 0 || endIdx < 0 || endIdx < startIdx) return ensured;
  const before = ensured.slice(0, startIdx + 38);
  const after = ensured.slice(endIdx);
  return before + (diaryContent.trim().length > 0 ? `\n${diaryContent.trim()}\n` : "\n") + after;
}
function splitDiaryBlocks(diaryContent) {
  return diaryContent
    .split(/\n---\n/)
    .map((block) => block.trim())
    .filter((block) => block.length > 0);
}
function clampDiaryContextEntry(entry) {
  const normalized = entry.replace(/\s+/g, " ").trim();
  if (normalized.length <= RECENT_DIARY_CONTEXT_MAX_CHARS) return normalized;
  return `${truncateUtf16Safe(normalized, RECENT_DIARY_CONTEXT_MAX_CHARS).trimEnd()}...`;
}
function normalizeDiaryBlockBody(block) {
  const bodyLines = [];
  for (const line of block.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("<!--") || trimmed.startsWith("#")) continue;
    if (trimmed.startsWith("*") && trimmed.endsWith("*") && trimmed.length > 2) continue;
    bodyLines.push(trimmed);
  }
  return clampDiaryContextEntry(bodyLines.join(" "));
}
function isOptionalDiaryContextReadError(err) {
  const code = extractErrorCode(err);
  if (
    code === "EACCES" ||
    code === "EPERM" ||
    code === "ENOENT" ||
    code === "ENOTDIR" ||
    code === "not-found" ||
    code === "not-file" ||
    code === "path-alias" ||
    code === "path-mismatch" ||
    code === "symlink"
  )
    return true;
  return err instanceof Error && err.message === "path must be a regular file";
}
async function readRecentDreamDiaryEntries(params) {
  const limit = Math.max(0, Math.floor(params.limit ?? RECENT_DIARY_CONTEXT_LIMIT));
  if (limit === 0) return [];
  let existing;
  try {
    existing = await readDreamsFile(await resolveDreamsPath(params.workspaceDir));
  } catch (err) {
    if (isOptionalDiaryContextReadError(err)) return [];
    throw err;
  }
  const startIdx = existing.indexOf(DIARY_START_MARKER);
  const endIdx = existing.indexOf(DIARY_END_MARKER);
  if (startIdx < 0 || endIdx < 0 || endIdx < startIdx) return [];
  return splitDiaryBlocks(existing.slice(startIdx + 38, endIdx))
    .map(normalizeDiaryBlockBody)
    .filter((entry) => entry.length > 0)
    .slice(-limit)
    .toReversed();
}
function normalizeDiaryBlockFingerprint(block) {
  const lines = block
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  let dateLine = "";
  const bodyLines = [];
  for (const line of lines) {
    if (!dateLine && line.startsWith("*") && line.endsWith("*") && line.length > 2) {
      dateLine = line.slice(1, -1).trim();
      continue;
    }
    if (line.startsWith("<!--") || line.startsWith("#")) continue;
    bodyLines.push(line);
  }
  return `${dateLine.replace(/\s+/g, " ").trim()}\n${bodyLines
    .join("\n")
    .replace(/[ \t]+\n/g, "\n")
    .trim()}`;
}
function joinDiaryBlocks(blocks) {
  if (blocks.length === 0) return "";
  return blocks.map((block) => `---\n\n${block.trim()}\n`).join("\n");
}
function stripBackfillDiaryBlocks(existing) {
  const ensured = ensureDiarySection(existing);
  const startIdx = ensured.indexOf(DIARY_START_MARKER);
  const endIdx = ensured.indexOf(DIARY_END_MARKER);
  if (startIdx < 0 || endIdx < 0 || endIdx < startIdx)
    return {
      updated: ensured,
      removed: 0,
    };
  const inner = ensured.slice(startIdx + 38, endIdx);
  const kept = [];
  let removed = 0;
  for (const block of splitDiaryBlocks(inner)) {
    if (block.includes(BACKFILL_ENTRY_MARKER)) {
      removed += 1;
      continue;
    }
    kept.push(block);
  }
  return {
    updated: replaceDiaryContent(ensured, joinDiaryBlocks(kept)),
    removed,
  };
}
function formatBackfillDiaryDate(isoDay, _timezone) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDay);
  if (!match) return isoDay;
  const [, year, month, day] = match;
  const opts = {
    timeZone: "UTC",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const epochMs = Date.UTC(Number(year), Number(month) - 1, Number(day), 12);
  return new Intl.DateTimeFormat("en-US", opts).format(new Date(epochMs));
}
async function withNarrativeSessionLock(sessionKey, fn) {
  let lockEntry = narrativeSessionLocks.get(sessionKey);
  if (!lockEntry) {
    lockEntry = {
      withLock: createAsyncLock(),
      refs: 0,
    };
    narrativeSessionLocks.set(sessionKey, lockEntry);
  }
  lockEntry.refs += 1;
  try {
    return await lockEntry.withLock(fn);
  } finally {
    lockEntry.refs -= 1;
    if (lockEntry.refs <= 0 && narrativeSessionLocks.get(sessionKey) === lockEntry)
      narrativeSessionLocks.delete(sessionKey);
  }
}
function buildBackfillDiaryEntry(params) {
  const dateStr = formatBackfillDiaryDate(params.isoDay, params.timezone);
  const marker = `<!-- ${BACKFILL_ENTRY_MARKER} day=${params.isoDay}${params.sourcePath ? ` source=${params.sourcePath}` : ""} -->`;
  const body = params.bodyLines
    .map((line) => line.trimEnd())
    .join("\n")
    .trim();
  return [`*${dateStr}*`, marker, body].filter((part) => part.length > 0).join("\n\n");
}
async function writeBackfillDiaryEntries(params) {
  return await updateDreamsFile({
    workspaceDir: params.workspaceDir,
    updater: (existing, dreamsPath) => {
      const stripped = stripBackfillDiaryBlocks(existing);
      const startIdx = stripped.updated.indexOf(DIARY_START_MARKER);
      const endIdx = stripped.updated.indexOf(DIARY_END_MARKER);
      const nextBlocks = [
        ...splitDiaryBlocks(
          startIdx >= 0 && endIdx > startIdx ? stripped.updated.slice(startIdx + 38, endIdx) : "",
        ),
        ...params.entries.map((entry) =>
          buildBackfillDiaryEntry({
            isoDay: entry.isoDay,
            bodyLines: entry.bodyLines,
            sourcePath: entry.sourcePath,
            timezone: params.timezone,
          }),
        ),
      ];
      return {
        content: replaceDiaryContent(stripped.updated, joinDiaryBlocks(nextBlocks)),
        result: {
          dreamsPath,
          written: params.entries.length,
          replaced: stripped.removed,
        },
      };
    },
  });
}
async function removeBackfillDiaryEntries(params) {
  return await updateDreamsFile({
    workspaceDir: params.workspaceDir,
    updater: (existing, dreamsPath) => {
      const stripped = stripBackfillDiaryBlocks(existing);
      return {
        content: stripped.updated,
        result: {
          dreamsPath,
          removed: stripped.removed,
        },
        shouldWrite: stripped.removed > 0 || existing.length > 0,
      };
    },
  });
}
async function dedupeDreamDiaryEntries(params) {
  return await updateDreamsFile({
    workspaceDir: params.workspaceDir,
    updater: (existing, dreamsPath) => {
      const ensured = ensureDiarySection(existing);
      const startIdx = ensured.indexOf(DIARY_START_MARKER);
      const endIdx = ensured.indexOf(DIARY_END_MARKER);
      if (startIdx < 0 || endIdx < 0 || endIdx < startIdx)
        return {
          content: ensured,
          result: {
            dreamsPath,
            removed: 0,
            kept: 0,
          },
          shouldWrite: false,
        };
      const blocks = splitDiaryBlocks(ensured.slice(startIdx + 38, endIdx));
      const seen = /* @__PURE__ */ new Set();
      const keptBlocks = [];
      let removed = 0;
      for (const block of blocks) {
        const fingerprint = normalizeDiaryBlockFingerprint(block);
        if (seen.has(fingerprint)) {
          removed += 1;
          continue;
        }
        seen.add(fingerprint);
        keptBlocks.push(block);
      }
      return {
        content: replaceDiaryContent(ensured, joinDiaryBlocks(keptBlocks)),
        result: {
          dreamsPath,
          removed,
          kept: keptBlocks.length,
        },
        shouldWrite: removed > 0,
      };
    },
  });
}
function buildDiaryEntry(narrative, dateStr) {
  return `\n---\n\n*${dateStr}*\n\n${narrative}\n`;
}
async function appendNarrativeEntry(params) {
  const dateStr = formatNarrativeDate(params.nowMs, params.timezone);
  const entry = buildDiaryEntry(params.narrative, dateStr);
  return await updateDreamsFile({
    workspaceDir: params.workspaceDir,
    updater: (existing, dreamsPath) => {
      let updated;
      if (existing.includes(DIARY_START_MARKER) && existing.includes(DIARY_END_MARKER)) {
        const endIdx = existing.lastIndexOf(DIARY_END_MARKER);
        updated = existing.slice(0, endIdx) + entry + "\n" + existing.slice(endIdx);
      } else if (existing.includes(DIARY_START_MARKER)) {
        const startIdx = existing.indexOf(DIARY_START_MARKER) + 38;
        updated =
          existing.slice(0, startIdx) +
          entry +
          "\n<!-- openclaw:dreaming:diary:end -->\n" +
          existing.slice(startIdx);
      } else {
        const diarySection = `# Dream Diary\n\n${DIARY_START_MARKER}${entry}\n${DIARY_END_MARKER}\n`;
        updated = existing.trim().length === 0 ? diarySection : `${diarySection}\n${existing}`;
      }
      return {
        content: updated,
        result: dreamsPath,
      };
    },
  });
}
async function scrubDreamingNarrativeArtifacts(logger) {
  const cfg = getRuntimeConfig();
  const agentsDir = path.join(resolveStateDir(), "agents");
  let agentEntries;
  try {
    agentEntries = await fs.readdir(agentsDir, { withFileTypes: true });
  } catch {
    return;
  }
  let prunedEntries = 0;
  let archivedOrphans = 0;
  for (const agentEntry of agentEntries) {
    if (!agentEntry.isDirectory()) continue;
    try {
      const result = await cleanupSessionLifecycleArtifacts({
        agentId: agentEntry.name,
        archiveRemovedEntryTranscripts: false,
        sessionStore: cfg.session?.store,
        sessionKeySegmentPrefix: DREAMING_SESSION_KEY_PREFIX,
        transcriptContentMarker: DREAMING_TRANSCRIPT_RUN_MARKER,
        orphanTranscriptMinAgeMs: DREAMING_ORPHAN_MIN_AGE_MS,
      });
      prunedEntries += result.removedEntries;
      archivedOrphans += result.archivedTranscriptArtifacts;
    } catch {
      continue;
    }
  }
  if (prunedEntries > 0 || archivedOrphans > 0)
    logger.info(
      `memory-core: dreaming cleanup scrubbed ${prunedEntries} stale session entr${prunedEntries === 1 ? "y" : "ies"} and archived ${archivedOrphans} orphan transcript${archivedOrphans === 1 ? "" : "s"}.`,
    );
}
async function generateAndAppendDreamNarrative(params) {
  const nowMs = Number.isFinite(params.nowMs) ? params.nowMs : Date.now();
  if (params.data.snippets.length === 0 && !params.data.promotions?.length) return;
  const sessionKey = buildNarrativeSessionKey({
    workspaceDir: params.workspaceDir,
    phase: params.data.phase,
  });
  const message = buildNarrativePrompt(params.data);
  await withNarrativeSessionLock(sessionKey, async () => {
    const attempts = [];
    let successfulSessionKey = null;
    try {
      const attemptModels = params.model ? [params.model, void 0] : [void 0];
      for (const [attemptIndex, attemptModel] of attemptModels.entries()) {
        const attemptSessionKey = buildNarrativeAttemptSessionKey(sessionKey, attemptIndex);
        const attempt = {
          sessionKey: attemptSessionKey,
          runId: null,
        };
        attempts.push(attempt);
        try {
          try {
            await params.subagent.deleteSession({ sessionKey: attemptSessionKey });
          } catch (preCleanupErr) {
            if (!isRequestScopedSubagentRuntimeError(preCleanupErr))
              params.logger.warn(
                `memory-core: narrative pre-cleanup failed for ${params.data.phase} phase: ${formatErrorMessage(preCleanupErr)}`,
              );
          }
          const runId = await startNarrativeRunOrFallback({
            subagent: params.subagent,
            sessionKey: attemptSessionKey,
            message,
            data: params.data,
            workspaceDir: params.workspaceDir,
            nowMs,
            timezone: params.timezone,
            model: attemptModel,
            logger: params.logger,
          });
          if (!runId) return;
          attempt.runId = runId;
          const result = await params.subagent.waitForRun({
            runId,
            timeoutMs: NARRATIVE_TIMEOUT_MS,
          });
          if (result.status === "ok") {
            successfulSessionKey = attemptSessionKey;
            break;
          }
          if (
            attemptModel &&
            result.status === "error" &&
            isConfiguredModelUnavailableNarrativeError(result.error ?? "")
          ) {
            params.logger.warn(
              `memory-core: narrative generation ended with ${formatNarrativeTerminalStatus({
                status: result.status,
                error: result.error,
              })} for ${params.data.phase} phase using configured model "${attemptModel}"; retrying with the session default.`,
            );
            continue;
          }
          params.logger.warn(
            `memory-core: narrative generation ended with ${formatNarrativeTerminalStatus({
              status: result.status,
              error: result.error,
            })} for ${params.data.phase} phase; writing fallback diary entry.`,
          );
          await appendFallbackNarrativeEntry({
            workspaceDir: params.workspaceDir,
            data: params.data,
            nowMs,
            timezone: params.timezone,
            logger: params.logger,
            reason: `the narrative run ended with ${formatNarrativeTerminalStatus({
              status: result.status,
              error: result.error,
            })}`,
          });
          return;
        } catch (err) {
          if (attemptModel && isConfiguredModelUnavailableNarrativeError(formatErrorMessage(err))) {
            params.logger.warn(
              `memory-core: narrative generation could not start with configured model "${attemptModel}" for ${params.data.phase} phase; retrying with the session default (${formatErrorMessage(err)}).`,
            );
            continue;
          }
          throw err;
        }
      }
      if (!successfulSessionKey) return;
      const narrative = await readSettledNarrativeText({
        subagent: params.subagent,
        sessionKey: successfulSessionKey,
      });
      if (!narrative) {
        params.logger.warn(
          `memory-core: narrative generation produced no text for ${params.data.phase} phase; writing fallback diary entry.`,
        );
        await appendFallbackNarrativeEntry({
          workspaceDir: params.workspaceDir,
          data: params.data,
          nowMs,
          timezone: params.timezone,
          logger: params.logger,
          reason: "the narrative run produced no text",
        });
        return;
      }
      await appendNarrativeEntry({
        workspaceDir: params.workspaceDir,
        narrative,
        nowMs,
        timezone: params.timezone,
      });
      params.logger.info(
        `memory-core: dream diary entry written for ${params.data.phase} phase [workspace=${params.workspaceDir}].`,
      );
    } catch (err) {
      params.logger.warn(
        `memory-core: narrative generation failed for ${params.data.phase} phase: ${formatErrorMessage(err)}`,
      );
    } finally {
      const cleanedSessionKeys = /* @__PURE__ */ new Set();
      for (const attempt of attempts) {
        if (!attempt.runId || cleanedSessionKeys.has(attempt.sessionKey)) continue;
        cleanedSessionKeys.add(attempt.sessionKey);
        try {
          await params.subagent.deleteSession({ sessionKey: attempt.sessionKey });
        } catch (cleanupErr) {
          params.logger.warn(
            `memory-core: narrative session cleanup failed for ${params.data.phase} phase: ${formatErrorMessage(cleanupErr)}`,
          );
        }
      }
      await scrubDreamingNarrativeArtifacts(params.logger).catch((scrubErr) => {
        params.logger.warn(
          `memory-core: dreaming cleanup scrub failed for ${params.data.phase} phase: ${formatErrorMessage(scrubErr)}`,
        );
      });
    }
  });
}
const detachedNarrativeLimit = pLimit(3);
function runDetachedDreamNarrative(params) {
  queueMicrotask(() => {
    detachedNarrativeLimit(() => generateAndAppendDreamNarrative(params)).catch(() => {});
  });
}
//#endregion
export {
  removeBackfillDiaryEntries as a,
  readRecentDreamDiaryEntries as i,
  dedupeDreamDiaryEntries as n,
  runDetachedDreamNarrative as o,
  generateAndAppendDreamNarrative as r,
  writeBackfillDiaryEntries as s,
  appendFallbackNarrativeEntry as t,
};
