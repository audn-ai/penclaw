import { spawn, spawnSync } from "node:child_process";
import fs, { statSync } from "node:fs";
import path from "node:path";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import { v as resolveSessionAgentId } from "./agent-scope-y9xQv_q1.js";
import { r as retryTransientMemoryRead, t as hashText } from "./hash-DsDOoPhE.js";
import { n as HEARTBEAT_PROMPT } from "./heartbeat-Bkwxbekw.js";
import { i as isExecCompletionEvent } from "./heartbeat-events-filter-CwG3RmMF.js";
import { r as isHeartbeatUserMessage } from "./heartbeat-filter-MEiiKFU7.js";
import { i as hasInterSessionUserProvenance } from "./input-provenance-Xst3EirW.js";
import { f as stripInternalRuntimeContext } from "./internal-runtime-context-BW7WOTKc.js";
import { i as getRuntimeConfig } from "./io-B3ne6NxF.js";
import { n as canonicalizeMainSessionAlias } from "./main-session-nrmKYo2W.js";
import { T as formatErrorMessage } from "./openclaw-agent-db-VC51jrBW.js";
import {
  n as extractAgentIdFromSessionsDir,
  r as isDreamingNarrativeSessionStoreKey,
} from "./openclaw-runtime-session-gBBWk6Sw.js";
import {
  c as resolveSessionTranscriptsDirForAgent,
  g as isSessionArchiveArtifactName,
  p as isCompactionCheckpointTranscriptFileName,
  r as resolveSessionFilePath,
  x as parseUsageCountedSessionIdFromFileName,
  y as isUsageCountedSessionTranscriptFileName,
} from "./paths-TfuVT-K8.js";
import { c as redactSensitiveText } from "./redact-CUe6Oey5.js";
import { o as statRegularFile, r as readRegularFile } from "./regular-file-CuvhUtZS.js";
import { r as isCronRunSessionKey } from "./session-key-utils-B8sNp9l4.js";
import {
  h as resolveTranscriptSessionKeyBySessionId,
  i as listSessionEntries,
  m as resolveStorePath,
  o as loadTranscriptEventsSync,
  u as readTranscriptStatsSync,
} from "./session-store-runtime-BwE6SlGz.js";
import { n as parseSqliteSessionFileMarker } from "./sqlite-marker-BejbySI1.js";
import "./query-expansion-DzoKGtnD.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
import { r as stripInboundMetadata } from "./strip-inbound-meta-CbJ4Y6Dq.js";
import "./fs-utils-urkAyyL8.js";
import "./config-utils-CrO_J2Yw.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
import { s as resolveSafeTimeoutDelayMs } from "./timeouts-Dewo7BbT.js";
import { i as isSilentReplyPayloadText } from "./tokens-DKI4eGAu.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
import {
  a as resolveWindowsSpawnProgram,
  r as materializeWindowsSpawnProgram,
} from "./windows-spawn-C5RDaB22.js";
//#region packages/memory-host-sdk/src/host/session-transcript-corpus.ts
function isDreamingNarrativeSessionKeyLike(value) {
  return typeof value === "string" && isDreamingNarrativeSessionStoreKey(value);
}
function normalizeComparablePath$1(pathname) {
  const resolved = path.resolve(pathname);
  return process.platform === "win32" ? resolved.toLowerCase() : resolved;
}
function normalizeRealComparablePath(pathname) {
  try {
    return normalizeComparablePath$1(fs.realpathSync(pathname));
  } catch {
    try {
      return normalizeComparablePath$1(
        path.join(fs.realpathSync(path.dirname(pathname)), path.basename(pathname)),
      );
    } catch {
      return normalizeComparablePath$1(pathname);
    }
  }
}
function rememberArtifactDir(dirs, dir) {
  dirs.set(normalizeRealComparablePath(dir), dir);
}
function extractAgentIdFromSessionPath$1(absPath) {
  const parts = path.normalize(path.resolve(absPath)).split(path.sep).filter(Boolean);
  const sessionsIndex = parts.lastIndexOf("sessions");
  if (sessionsIndex < 2 || parts[sessionsIndex - 2] !== "agents") return null;
  return parts[sessionsIndex - 1] || null;
}
function resolveSessionStoreTranscriptCorpusSource(agentId, sessionsDir, storePath, entry) {
  const sessionFile =
    typeof entry?.sessionFile === "string" && entry.sessionFile.trim().length > 0
      ? entry.sessionFile.trim()
      : void 0;
  const sqliteMarker = sessionFile ? parseSqliteSessionFileMarker(sessionFile) : void 0;
  const sessionId =
    (typeof entry?.sessionId === "string" && entry.sessionId.trim().length > 0
      ? entry.sessionId.trim()
      : null) ??
    sqliteMarker?.sessionId ??
    (sessionFile ? parseUsageCountedSessionIdFromFileName(path.basename(sessionFile)) : null);
  if (!sessionId) return null;
  if (sqliteMarker) {
    if (!sessionFile) return null;
    if (
      sqliteMarker.sessionId !== sessionId ||
      normalizeAgentId(sqliteMarker.agentId) !== normalizeAgentId(agentId) ||
      normalizeComparablePath$1(sqliteMarker.storePath) !== normalizeComparablePath$1(storePath)
    )
      return null;
    return {
      sessionFile,
      sessionId,
      transcriptSource: "sqlite",
    };
  }
  try {
    if (!sessionFile)
      return {
        sessionFile: resolveSessionFilePath(sessionId, void 0, {
          agentId,
          sessionsDir,
        }),
        sessionId,
        transcriptSource: "file",
      };
    const resolved = resolveSessionFilePath(
      sessionId,
      { sessionFile },
      {
        agentId,
        sessionsDir,
      },
    );
    if (!path.isAbsolute(sessionFile)) {
      const candidate = path.resolve(sessionsDir, sessionFile);
      if (
        normalizeComparablePath$1(path.dirname(candidate)) !==
        normalizeComparablePath$1(sessionsDir)
      )
        return null;
      return normalizeRealComparablePath(resolved) === normalizeRealComparablePath(candidate)
        ? {
            sessionFile: candidate,
            sessionId,
            transcriptSource: "file",
          }
        : null;
    }
    const pathAgentId = extractAgentIdFromSessionPath$1(sessionFile);
    if (pathAgentId && normalizeAgentId(pathAgentId) !== normalizeAgentId(agentId)) return null;
    return normalizeRealComparablePath(resolved) === normalizeRealComparablePath(sessionFile)
      ? {
          sessionFile,
          sessionId,
          transcriptSource: "file",
        }
      : null;
  } catch {
    return null;
  }
}
function classifySessionEntry(sessionKey, entry, cronGeneratedSessionKeys) {
  return {
    generatedByDreamingNarrative:
      isDreamingNarrativeSessionStoreKey(sessionKey) ||
      isDreamingNarrativeSessionKeyLike(entry.spawnedBy),
    generatedByCronRun: cronGeneratedSessionKeys.has(sessionKey),
  };
}
function readParentSessionKeys(entry) {
  const keys = /* @__PURE__ */ new Set();
  for (const value of [entry?.parentSessionKey, entry?.spawnedBy]) {
    if (typeof value !== "string") continue;
    const trimmed = value.trim();
    if (trimmed) keys.add(trimmed);
  }
  return [...keys];
}
function collectCronGeneratedSessionKeys(summaries) {
  const entriesByKey = new Map(summaries.map((summary) => [summary.sessionKey, summary.entry]));
  const cronGeneratedKeys = /* @__PURE__ */ new Set();
  const cache = /* @__PURE__ */ new Map();
  const resolving = /* @__PURE__ */ new Set();
  const isCronGenerated = (sessionKey, entry) => {
    if (isCronRunSessionKey(sessionKey)) {
      cache.set(sessionKey, true);
      cronGeneratedKeys.add(sessionKey);
      return true;
    }
    const cached = cache.get(sessionKey);
    if (cached !== void 0) return cached;
    if (resolving.has(sessionKey)) return false;
    resolving.add(sessionKey);
    const generated = readParentSessionKeys(entry).some(
      (parentKey) =>
        isCronRunSessionKey(parentKey) || isCronGenerated(parentKey, entriesByKey.get(parentKey)),
    );
    resolving.delete(sessionKey);
    cache.set(sessionKey, generated);
    if (generated) cronGeneratedKeys.add(sessionKey);
    return generated;
  };
  for (const summary of summaries) isCronGenerated(summary.sessionKey, summary.entry);
  return cronGeneratedKeys;
}
function toSessionStoreCorpusEntry(
  agentId,
  sessionsDir,
  storePath,
  summary,
  cronGeneratedSessionKeys,
) {
  const source = resolveSessionStoreTranscriptCorpusSource(
    agentId,
    sessionsDir,
    storePath,
    summary.entry,
  );
  if (!source) return null;
  if (
    source.transcriptSource === "file" &&
    !isUsageCountedSessionTranscriptFileName(path.basename(source.sessionFile))
  )
    return null;
  const sessionKey = summary.sessionKey.trim();
  const classification = classifySessionEntry(
    summary.sessionKey,
    summary.entry,
    cronGeneratedSessionKeys,
  );
  return {
    agentId,
    artifactKind: "active-session",
    sessionFile: source.sessionFile,
    sessionId: source.sessionId,
    ...(source.transcriptSource === "sqlite" ? { transcriptSource: "sqlite" } : {}),
    ...(source.transcriptSource === "sqlite" && Number.isFinite(summary.entry.updatedAt)
      ? { updatedAtMs: summary.entry.updatedAt }
      : {}),
    ...(sessionKey ? { sessionKey } : {}),
    ...(classification.generatedByDreamingNarrative ? { generatedByDreamingNarrative: true } : {}),
    ...(classification.generatedByCronRun ? { generatedByCronRun: true } : {}),
  };
}
function listSessionTranscriptArtifactFiles(sessionsDir) {
  try {
    return fs
      .readdirSync(sessionsDir, { withFileTypes: true })
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((name) => isUsageCountedSessionTranscriptFileName(name))
      .filter((name) => isSessionArchiveArtifactName(name))
      .map((name) => path.join(sessionsDir, name));
  } catch {
    return [];
  }
}
function classifyTranscriptArtifact(artifactPath, activeEntriesByPath, activeEntriesBySessionId) {
  const directEntry = activeEntriesByPath.get(normalizeRealComparablePath(artifactPath));
  if (directEntry)
    return {
      generatedByDreamingNarrative: directEntry.generatedByDreamingNarrative === true,
      generatedByCronRun: directEntry.generatedByCronRun === true,
    };
  const sessionsDir = path.dirname(artifactPath);
  const primarySessionId = parseUsageCountedSessionIdFromFileName(path.basename(artifactPath));
  const primaryEntry =
    primarySessionId && isSessionArchiveArtifactName(path.basename(artifactPath))
      ? (activeEntriesByPath.get(
          normalizeRealComparablePath(path.join(sessionsDir, `${primarySessionId}.jsonl`)),
        ) ?? activeEntriesBySessionId.get(primarySessionId))
      : void 0;
  return {
    generatedByDreamingNarrative: primaryEntry?.generatedByDreamingNarrative === true,
    generatedByCronRun: primaryEntry?.generatedByCronRun === true,
  };
}
function toArtifactCorpusEntry(
  agentId,
  artifactPath,
  activeEntriesByPath,
  activeEntriesBySessionId,
) {
  const sessionId = parseUsageCountedSessionIdFromFileName(path.basename(artifactPath));
  if (!sessionId) return null;
  if (!isSessionArchiveArtifactName(path.basename(artifactPath))) return null;
  const classification = classifyTranscriptArtifact(
    artifactPath,
    activeEntriesByPath,
    activeEntriesBySessionId,
  );
  return {
    agentId,
    artifactKind: "archive-artifact",
    sessionFile: artifactPath,
    sessionId,
    ...(classification.generatedByDreamingNarrative ? { generatedByDreamingNarrative: true } : {}),
    ...(classification.generatedByCronRun ? { generatedByCronRun: true } : {}),
  };
}
function listSessionTranscriptCorpusEntriesForAgentSync(agentId) {
  const normalizedAgentId = normalizeAgentId(agentId);
  const cfg = getRuntimeConfig();
  const configuredStore = cfg.session?.store;
  const storePath = resolveStorePath(configuredStore, { agentId: normalizedAgentId });
  const sessionsDir = path.dirname(storePath);
  const fixedStoreOwnerAgentId = extractAgentIdFromSessionsDir(sessionsDir);
  const isAgentOwnedFixedStore =
    fixedStoreOwnerAgentId !== null &&
    normalizeAgentId(fixedStoreOwnerAgentId) === normalizedAgentId;
  const isSharedFixedStore =
    typeof configuredStore === "string" &&
    configuredStore.trim().length > 0 &&
    !configuredStore.includes("{agentId}") &&
    !isAgentOwnedFixedStore;
  const activeEntriesByPath = /* @__PURE__ */ new Map();
  const activeEntriesBySessionId = /* @__PURE__ */ new Map();
  const activeEntryOwnersByPath = /* @__PURE__ */ new Map();
  const artifactDirsByPath = /* @__PURE__ */ new Map();
  rememberArtifactDir(artifactDirsByPath, sessionsDir);
  const sessionEntries = listSessionEntries({
    agentId: normalizedAgentId,
    hydrateSkillPromptRefs: false,
    storePath,
  });
  const cronGeneratedSessionKeys = collectCronGeneratedSessionKeys(sessionEntries);
  for (const summary of sessionEntries) {
    const ownerAgentId = resolveSessionAgentId({
      config: cfg,
      sessionKey: isSharedFixedStore
        ? summary.sessionKey
        : canonicalizeMainSessionAlias({
            cfg,
            agentId: normalizedAgentId,
            sessionKey: summary.sessionKey,
          }),
      ...(isSharedFixedStore ? {} : { fallbackAgentId: normalizedAgentId }),
    });
    const entry = toSessionStoreCorpusEntry(
      ownerAgentId,
      sessionsDir,
      storePath,
      summary,
      cronGeneratedSessionKeys,
    );
    if (!entry) continue;
    const normalizedEntryPath =
      entry.transcriptSource === "sqlite" ? null : normalizeRealComparablePath(entry.sessionFile);
    if (normalizedEntryPath) {
      activeEntryOwnersByPath.set(normalizedEntryPath, ownerAgentId);
      rememberArtifactDir(artifactDirsByPath, path.dirname(entry.sessionFile));
    }
    if (ownerAgentId === normalizedAgentId) {
      activeEntriesBySessionId.set(entry.sessionId, entry);
      if (normalizedEntryPath) activeEntriesByPath.set(normalizedEntryPath, entry);
    }
  }
  const includeUnownedArtifacts = !isSharedFixedStore;
  const corpusEntries = [...activeEntriesBySessionId.values()].filter(
    (entry) => entry.transcriptSource === "sqlite",
  );
  const scannedArtifactPaths = /* @__PURE__ */ new Set();
  for (const artifactDir of artifactDirsByPath.values())
    for (const artifactPath of listSessionTranscriptArtifactFiles(artifactDir)) {
      const normalizedArtifactPath = normalizeRealComparablePath(artifactPath);
      if (scannedArtifactPaths.has(normalizedArtifactPath)) continue;
      scannedArtifactPaths.add(normalizedArtifactPath);
      if (activeEntriesByPath.has(normalizedArtifactPath)) continue;
      if (activeEntryOwnersByPath.get(normalizedArtifactPath)) continue;
      const primarySessionId = parseUsageCountedSessionIdFromFileName(path.basename(artifactPath));
      const primaryOwner =
        primarySessionId && isSessionArchiveArtifactName(path.basename(artifactPath))
          ? activeEntryOwnersByPath.get(
              normalizeRealComparablePath(
                path.join(path.dirname(artifactPath), `${primarySessionId}.jsonl`),
              ),
            )
          : void 0;
      if (primaryOwner && primaryOwner !== normalizedAgentId) continue;
      if (!primaryOwner && !includeUnownedArtifacts) continue;
      const entry = toArtifactCorpusEntry(
        normalizedAgentId,
        artifactPath,
        activeEntriesByPath,
        activeEntriesBySessionId,
      );
      if (entry) corpusEntries.push(entry);
    }
  return corpusEntries;
}
/**
 * Lists transcript corpus entries for QMD/memory indexing.
 *
 * Active sessions come from the session accessor seam; retained reset/delete
 * transcript artifacts remain explicit file artifacts until core owns archive
 * artifact enumeration.
 */
async function listSessionTranscriptCorpusEntriesForAgent(agentId) {
  return listSessionTranscriptCorpusEntriesForAgentSync(agentId);
}
//#endregion
//#region packages/memory-host-sdk/src/host/session-files.ts
const SESSION_EXPORT_CONTENT_WRAP_CHARS = 800;
const SESSION_ENTRY_PARSE_YIELD_LINES = 250;
const MAX_DATE_TIMESTAMP_MS = 864e13;
const DIRECT_CRON_PROMPT_RE = /^\[cron:[^\]]+\]\s*/;
function shouldSkipTranscriptFileForDreaming(absPath) {
  const fileName = path.basename(absPath);
  if (isCompactionCheckpointTranscriptFileName(fileName)) return true;
  if (isSessionArchiveArtifactName(fileName) && !isUsageCountedSessionTranscriptFileName(fileName))
    return true;
  return false;
}
function isUsageCountedSessionArchiveTranscriptPath(absPath) {
  const fileName = path.basename(absPath);
  return (
    isUsageCountedSessionTranscriptFileName(fileName) &&
    isSessionArchiveArtifactName(fileName) &&
    parseUsageCountedSessionIdFromFileName(fileName) !== null
  );
}
function isDreamingNarrativeBootstrapRecord(record) {
  if (!record || typeof record !== "object" || Array.isArray(record)) return false;
  const candidate = record;
  if (
    candidate.type !== "custom" ||
    candidate.customType !== "openclaw:bootstrap-context:full" ||
    !candidate.data ||
    typeof candidate.data !== "object" ||
    Array.isArray(candidate.data)
  )
    return false;
  const runId = candidate.data.runId;
  return typeof runId === "string" && runId.startsWith("dreaming-narrative-");
}
function hasDreamingNarrativeRunId(value) {
  return typeof value === "string" && value.startsWith("dreaming-narrative-");
}
function isDreamingNarrativeGeneratedRecord(record) {
  if (isDreamingNarrativeBootstrapRecord(record)) return true;
  if (!record || typeof record !== "object" || Array.isArray(record)) return false;
  const candidate = record;
  if (hasDreamingNarrativeRunId(candidate.runId) || hasDreamingNarrativeRunId(candidate.sessionKey))
    return true;
  if (!candidate.data || typeof candidate.data !== "object" || Array.isArray(candidate.data))
    return false;
  const nested = candidate.data;
  return hasDreamingNarrativeRunId(nested.runId) || hasDreamingNarrativeRunId(nested.sessionKey);
}
function hasCronRunSessionKey(value) {
  return typeof value === "string" && isCronRunSessionKey(value);
}
function isCronRunGeneratedRecord(record) {
  if (!record || typeof record !== "object" || Array.isArray(record)) return false;
  const candidate = record;
  if (hasCronRunSessionKey(candidate.sessionKey)) return true;
  if (!candidate.data || typeof candidate.data !== "object" || Array.isArray(candidate.data))
    return false;
  const nested = candidate.data;
  return hasCronRunSessionKey(nested.sessionKey);
}
function normalizeComparablePath(pathname) {
  const resolved = path.resolve(pathname);
  return process.platform === "win32" ? resolved.toLowerCase() : resolved;
}
function normalizeSessionTranscriptPathForComparison(pathname) {
  return normalizeComparablePath(pathname);
}
function resolveSessionStoreTranscriptPath(sessionsDir, entry) {
  const resolved = resolveSessionStoreTranscriptResolvedPath(sessionsDir, entry);
  return resolved ? normalizeComparablePath(resolved) : null;
}
function resolveSessionStoreTranscriptResolvedPath(sessionsDir, entry) {
  if (typeof entry?.sessionFile === "string" && entry.sessionFile.trim().length > 0) {
    const sessionFile = entry.sessionFile.trim();
    return path.isAbsolute(sessionFile) ? sessionFile : path.resolve(sessionsDir, sessionFile);
  }
  if (typeof entry?.sessionId === "string" && entry.sessionId.trim().length > 0)
    return path.join(sessionsDir, `${entry.sessionId.trim()}.jsonl`);
  return null;
}
function isCanonicalSessionsDirForAgent(sessionsDir, agentId) {
  return (
    normalizeComparablePath(sessionsDir) ===
    normalizeComparablePath(resolveSessionTranscriptsDirForAgent(agentId))
  );
}
function loadSessionTranscriptClassificationForSessionsDir(sessionsDir) {
  const agentId = extractAgentIdFromSessionsDir(sessionsDir);
  if (agentId && isCanonicalSessionsDirForAgent(sessionsDir, agentId))
    return classifySessionTranscriptCorpusEntries(
      listSessionTranscriptCorpusEntriesForAgentSync(agentId),
    );
  const store = readSessionTranscriptClassificationStore(path.join(sessionsDir, "sessions.json"));
  const dreamingTranscriptPaths = /* @__PURE__ */ new Set();
  const cronRunTranscriptPaths = /* @__PURE__ */ new Set();
  for (const [sessionKey, entry] of Object.entries(store)) {
    const transcriptPath = resolveSessionStoreTranscriptPath(sessionsDir, entry);
    if (!transcriptPath) continue;
    if (isDreamingNarrativeSessionStoreKey(sessionKey)) dreamingTranscriptPaths.add(transcriptPath);
    if (isCronRunSessionKey(sessionKey)) cronRunTranscriptPaths.add(transcriptPath);
  }
  return {
    dreamingNarrativeTranscriptPaths: dreamingTranscriptPaths,
    cronRunTranscriptPaths,
  };
}
function readSessionTranscriptClassificationStore(storePath) {
  try {
    const parsed = JSON.parse(fs.readFileSync(storePath, "utf-8"));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return parsed;
  } catch {
    return {};
  }
}
function classifySessionTranscriptCorpusEntries(corpusEntries) {
  const dreamingTranscriptPaths = /* @__PURE__ */ new Set();
  const cronRunTranscriptPaths = /* @__PURE__ */ new Set();
  for (const entry of corpusEntries) {
    const normalizedPath = normalizeComparablePath(entry.sessionFile);
    if (entry.generatedByDreamingNarrative) dreamingTranscriptPaths.add(normalizedPath);
    if (entry.generatedByCronRun) cronRunTranscriptPaths.add(normalizedPath);
  }
  return {
    dreamingNarrativeTranscriptPaths: dreamingTranscriptPaths,
    cronRunTranscriptPaths,
  };
}
function loadDreamingNarrativeTranscriptPathSetForAgent(agentId) {
  return loadSessionTranscriptClassificationForAgent(agentId).dreamingNarrativeTranscriptPaths;
}
function loadSessionTranscriptClassificationForAgent(agentId) {
  return classifySessionTranscriptCorpusEntries(
    listSessionTranscriptCorpusEntriesForAgentSync(agentId),
  );
}
function classifySessionTranscriptFromSessionStore(absPath) {
  const sessionsDir = path.dirname(absPath);
  const normalizedAbsPath = normalizeComparablePath(absPath);
  const primarySessionId = parseUsageCountedSessionIdFromFileName(path.basename(absPath));
  const normalizedPrimaryPath =
    primarySessionId && isSessionArchiveArtifactName(path.basename(absPath))
      ? normalizeComparablePath(path.join(sessionsDir, `${primarySessionId}.jsonl`))
      : null;
  const classification = loadSessionTranscriptClassificationForSessionsDir(sessionsDir);
  const hasClassifiedPath = (paths) =>
    paths.has(normalizedAbsPath) ||
    (normalizedPrimaryPath !== null && paths.has(normalizedPrimaryPath));
  return {
    generatedByDreamingNarrative: hasClassifiedPath(
      classification.dreamingNarrativeTranscriptPaths,
    ),
    generatedByCronRun: hasClassifiedPath(classification.cronRunTranscriptPaths),
  };
}
async function listSessionFilesForAgent(agentId) {
  return (await listSessionTranscriptCorpusEntriesForAgent(agentId)).map(
    (entry) => entry.sessionFile,
  );
}
function extractAgentIdFromSessionPath(absPath) {
  const parts = path.normalize(path.resolve(absPath)).split(path.sep).filter(Boolean);
  const sessionsIndex = parts.lastIndexOf("sessions");
  if (sessionsIndex < 2 || parts[sessionsIndex - 2] !== "agents") return null;
  return parts[sessionsIndex - 1] || null;
}
function sessionPathForFile(absPath) {
  const agentId = extractAgentIdFromSessionPath(absPath);
  return path
    .join("sessions", ...(agentId ? [agentId] : []), path.basename(absPath))
    .replace(/\\/g, "/");
}
/** Returns the logical memory path for a live SQLite-backed session transcript. */
function sessionPathForSessionIdentity(agentId, sessionId) {
  return path.join("sessions", normalizeAgentId(agentId), `${sessionId}.jsonl`).replace(/\\/g, "/");
}
/**
 * Parses a deprecated path-shaped memory sync hint only when it points at an
 * OpenClaw-owned usage-counted transcript in the canonical agent sessions dir.
 */
function parseCanonicalSessionSyncTargetFromPath(sessionFile) {
  const trimmed = sessionFile.trim();
  if (!trimmed) return null;
  const resolved = path.resolve(trimmed);
  const fileName = path.basename(resolved);
  const sessionId = parseUsageCountedSessionIdFromFileName(fileName);
  if (!sessionId || !isUsageCountedSessionTranscriptFileName(fileName)) return null;
  const agentId = extractAgentIdFromSessionPath(resolved);
  if (!agentId) return null;
  const canonicalSessionsDir = normalizeComparablePath(
    resolveSessionTranscriptsDirForAgent(agentId),
  );
  if (normalizeComparablePath(path.dirname(resolved)) !== canonicalSessionsDir) return null;
  return {
    agentId,
    sessionId,
  };
}
/**
 * Resolves a current transcript path back to the canonical session-store
 * identity when available, falling back to the usage-counted file identity.
 */
function resolveSessionIdentityForTranscriptFile(sessionFile) {
  const parsed = parseCanonicalSessionSyncTargetFromPath(sessionFile);
  if (!parsed?.agentId) return null;
  const sessionsDir = resolveSessionTranscriptsDirForAgent(parsed.agentId);
  const normalizedSessionFile = normalizeComparablePath(sessionFile);
  const store = readSessionTranscriptClassificationStore(path.join(sessionsDir, "sessions.json"));
  for (const [sessionKey, entry] of Object.entries(store)) {
    if (resolveSessionStoreTranscriptPath(sessionsDir, entry) !== normalizedSessionFile) continue;
    const sessionId = typeof entry.sessionId === "string" ? entry.sessionId.trim() : "";
    if (!sessionId) continue;
    return {
      agentId: parsed.agentId,
      sessionId,
      ...(sessionKey.trim() ? { sessionKey } : {}),
    };
  }
  return {
    agentId: parsed.agentId,
    sessionId: parsed.sessionId,
  };
}
/** Resolves only deprecated path-shaped sync targets; live identity uses corpus entries. */
function resolveSessionFileForSyncTarget(target, defaultAgentId) {
  const sessionId = target.sessionId.trim();
  if (!(target.agentId ?? defaultAgentId ?? "").trim() || !sessionId) return null;
  return null;
}
async function logSessionFileReadFailure(absPath, err) {
  createSubsystemLogger("memory").debug(`Failed reading session file ${absPath}: ${String(err)}`);
}
function normalizeSessionText(value) {
  return value
    .replace(/\s*\n+\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
function collectRawSessionText(content) {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return null;
  const parts = [];
  for (const block of content) {
    if (!block || typeof block !== "object") continue;
    const record = block;
    if (record.type === "text" && typeof record.text === "string") parts.push(record.text);
  }
  return parts.length > 0 ? parts.join("\n") : null;
}
function isHighSurrogate(code) {
  return code >= 55296 && code <= 56319;
}
function isLowSurrogate(code) {
  return code >= 56320 && code <= 57343;
}
function splitLongSessionLine(text, maxChars = SESSION_EXPORT_CONTENT_WRAP_CHARS) {
  const normalized = text.trim();
  if (!normalized) return [];
  if (normalized.length <= maxChars) return [normalized];
  const segments = [];
  let cursor = 0;
  while (cursor < normalized.length) {
    if (normalized.length - cursor <= maxChars) {
      segments.push(normalized.slice(cursor).trim());
      break;
    }
    const limit = cursor + maxChars;
    let splitAt = limit;
    for (let index = limit; index > cursor; index -= 1)
      if (normalized[index] === " ") {
        splitAt = index;
        break;
      }
    if (
      splitAt < normalized.length &&
      splitAt > cursor &&
      isHighSurrogate(normalized.charCodeAt(splitAt - 1)) &&
      isLowSurrogate(normalized.charCodeAt(splitAt))
    )
      splitAt -= 1;
    segments.push(normalized.slice(cursor, splitAt).trim());
    cursor = splitAt;
    while (cursor < normalized.length && normalized[cursor] === " ") cursor += 1;
  }
  return segments.filter(Boolean);
}
function renderSessionExportLines(label, text) {
  return splitLongSessionLine(text).map((segment) => `${label}: ${segment}`);
}
/**
 * Strip OpenClaw-injected inbound metadata envelopes from a raw text block.
 *
 * User-role messages arriving from external channels (Telegram, Discord,
 * Slack, …) are stored with a multi-line prefix containing Conversation info,
 * Sender info, and other AI-facing metadata blocks. These envelopes must be
 * removed BEFORE normalization, because `stripInboundMetadata` relies on
 * newline structure and fenced `json` code fences to locate sentinels; once
 * `normalizeSessionText` collapses newlines into spaces, stripping is
 * impossible.
 *
 * See: https://github.com/openclaw/openclaw/issues/63921
 */
function stripInboundMetadataForUserRole(text, role) {
  if (role !== "user") return text;
  return stripInboundMetadata(text);
}
const GENERATED_SYSTEM_MESSAGE_RE = /^System(?: \(untrusted\))?: \[[^\]]+\]\s*/;
function isGeneratedSystemWrapperMessage(text, role) {
  if (role !== "user") return false;
  return GENERATED_SYSTEM_MESSAGE_RE.test(text);
}
function isGeneratedCronPromptMessage(text, role) {
  if (role !== "user") return false;
  return DIRECT_CRON_PROMPT_RE.test(text);
}
function isGeneratedHeartbeatPromptMessage(text, role) {
  return (
    role === "user" &&
    isHeartbeatUserMessage(
      {
        role,
        content: text,
      },
      HEARTBEAT_PROMPT,
    )
  );
}
function sanitizeSessionText(text, role) {
  const normalized = normalizeSessionText(
    stripInternalRuntimeContext(stripInboundMetadataForUserRole(text, role)),
  );
  if (!normalized) return null;
  if (isGeneratedSystemWrapperMessage(normalized, role)) return null;
  if (isGeneratedCronPromptMessage(normalized, role)) return null;
  if (isGeneratedHeartbeatPromptMessage(normalized, role)) return null;
  if (isSilentReplyPayloadText(normalized)) return null;
  if (role === "assistant" && normalized === "HEARTBEAT_OK") return null;
  if (isExecCompletionEvent(normalized.replace(GENERATED_SYSTEM_MESSAGE_RE, "").trim()))
    return null;
  return normalized;
}
function parseSessionTimestampMs(record, message) {
  const candidates = [message.timestamp, record.timestamp];
  for (const value of candidates) {
    if (typeof value === "number" && Number.isFinite(value)) {
      const ms = value > 0 && value < 1e11 ? value * 1e3 : value;
      if (Number.isFinite(ms) && ms > 0 && ms <= MAX_DATE_TIMESTAMP_MS) return ms;
    }
    if (typeof value === "string") {
      const parsed = Date.parse(value);
      if (Number.isFinite(parsed) && parsed > 0) return parsed;
    }
  }
  return 0;
}
function serializeTranscriptEvent(record) {
  const serialized = JSON.stringify(record);
  return typeof serialized === "string" ? serialized : null;
}
function serializeTranscriptEvents(records) {
  return records
    .map(serializeTranscriptEvent)
    .filter((line) => line !== null)
    .join("\n");
}
function resolveSessionEntryParseYieldLines(opts) {
  const configured = opts.parseYieldEveryLines;
  if (typeof configured === "number" && Number.isFinite(configured))
    return Math.max(1, Math.floor(configured));
  return SESSION_ENTRY_PARSE_YIELD_LINES;
}
function statSessionEntrySync(absPath, opts = {}) {
  const sqliteMarker = parseSqliteSessionFileMarker(absPath);
  if (sqliteMarker) {
    const stats = readTranscriptStatsSync({
      agentId: sqliteMarker.agentId,
      sessionId: sqliteMarker.sessionId,
      ...(opts.sessionKey ? { sessionKey: opts.sessionKey } : {}),
      storePath: sqliteMarker.storePath,
    });
    return {
      absPath,
      path: sessionPathForSessionIdentity(sqliteMarker.agentId, sqliteMarker.sessionId),
      mtimeMs: opts.updatedAtMs ?? stats.maxSeq,
      size: stats.sizeBytes,
    };
  }
  try {
    const stat = fs.statSync(absPath);
    return stat.isFile()
      ? {
          absPath,
          path: sessionPathForFile(absPath),
          mtimeMs: stat.mtimeMs,
          size: stat.size,
        }
      : null;
  } catch {
    return null;
  }
}
async function yieldSessionEntryParseIfNeeded(lineIndex, everyLines) {
  if (lineIndex > 0 && lineIndex % everyLines === 0)
    await new Promise((resolve) => {
      setImmediate(resolve);
    });
}
async function buildSessionEntry(absPath, opts = {}) {
  try {
    const sqliteMarker = parseSqliteSessionFileMarker(absPath);
    const rawSource = sqliteMarker
      ? (() => {
          const stats = readTranscriptStatsSync({
            agentId: sqliteMarker.agentId,
            sessionId: sqliteMarker.sessionId,
            ...(opts.sessionKey ? { sessionKey: opts.sessionKey } : {}),
            storePath: sqliteMarker.storePath,
          });
          const raw = serializeTranscriptEvents(
            loadTranscriptEventsSync({
              agentId: sqliteMarker.agentId,
              sessionId: sqliteMarker.sessionId,
              ...(opts.sessionKey ? { sessionKey: opts.sessionKey } : {}),
              storePath: sqliteMarker.storePath,
            }),
          );
          return {
            mtimeMs: opts.updatedAtMs ?? stats.maxSeq,
            path: sessionPathForSessionIdentity(sqliteMarker.agentId, sqliteMarker.sessionId),
            raw,
            size: stats.sizeBytes,
          };
        })()
      : null;
    let raw;
    let mtimeMs;
    let size;
    let memoryPath;
    if (rawSource) {
      raw = rawSource.raw;
      mtimeMs = rawSource.mtimeMs;
      size = rawSource.size;
      memoryPath = rawSource.path;
    } else {
      const regularFile = await statRegularFile(absPath);
      if (regularFile.missing) return null;
      const stat = regularFile.stat;
      if (shouldSkipTranscriptFileForDreaming(absPath))
        return {
          path: sessionPathForFile(absPath),
          absPath,
          mtimeMs: stat.mtimeMs,
          size: stat.size,
          hash: hashText("\n\n"),
          content: "",
          lineMap: [],
          messageTimestampsMs: [],
        };
      raw = (
        await retryTransientMemoryRead(
          () => readRegularFile({ filePath: absPath }),
          `read session transcript ${absPath}`,
        )
      ).buffer.toString("utf-8");
      mtimeMs = stat.mtimeMs;
      size = stat.size;
      memoryPath = sessionPathForFile(absPath);
    }
    const collected = [];
    const lineMap = [];
    const messageTimestampsMs = [];
    const parseYieldEveryLines = resolveSessionEntryParseYieldLines(opts);
    const sqliteSessionKey =
      sqliteMarker && !opts.sessionKey
        ? resolveTranscriptSessionKeyBySessionId({
            agentId: sqliteMarker.agentId,
            sessionId: sqliteMarker.sessionId,
            storePath: sqliteMarker.storePath,
          })
        : void 0;
    const sessionStoreClassification =
      !sqliteMarker &&
      (opts.generatedByDreamingNarrative === void 0 || opts.generatedByCronRun === void 0)
        ? classifySessionTranscriptFromSessionStore(absPath)
        : null;
    let generatedByDreamingNarrative =
      opts.generatedByDreamingNarrative ??
      (sqliteSessionKey ? isDreamingNarrativeSessionStoreKey(sqliteSessionKey) : void 0) ??
      sessionStoreClassification?.generatedByDreamingNarrative ??
      false;
    let generatedByCronRun =
      opts.generatedByCronRun ??
      (sqliteSessionKey ? isCronRunSessionKey(sqliteSessionKey) : void 0) ??
      sessionStoreClassification?.generatedByCronRun ??
      false;
    const allowArchiveRecordCronClassification =
      isUsageCountedSessionArchiveTranscriptPath(absPath);
    for (let jsonlIdx = 0, lineStart = 0; lineStart <= raw.length; jsonlIdx++) {
      await yieldSessionEntryParseIfNeeded(jsonlIdx, parseYieldEveryLines);
      const newlineIndex = raw.indexOf("\n", lineStart);
      const lineEnd = newlineIndex === -1 ? raw.length : newlineIndex;
      const line = raw.slice(lineStart, lineEnd);
      lineStart = newlineIndex === -1 ? raw.length + 1 : newlineIndex + 1;
      if (!line.trim()) continue;
      let record;
      try {
        record = JSON.parse(line);
      } catch {
        continue;
      }
      if (!generatedByDreamingNarrative && isDreamingNarrativeGeneratedRecord(record))
        generatedByDreamingNarrative = true;
      if (
        !generatedByCronRun &&
        allowArchiveRecordCronClassification &&
        isCronRunGeneratedRecord(record)
      ) {
        generatedByCronRun = true;
        collected.length = 0;
        lineMap.length = 0;
        messageTimestampsMs.length = 0;
      }
      if (!record || typeof record !== "object" || record.type !== "message") continue;
      const message = record.message;
      if (!message || typeof message.role !== "string") continue;
      if (message.role !== "user" && message.role !== "assistant") continue;
      if (message.role === "user" && hasInterSessionUserProvenance(message)) continue;
      const rawText = collectRawSessionText(message.content);
      if (rawText === null) continue;
      const text = sanitizeSessionText(rawText, message.role);
      if (!text) continue;
      if (generatedByDreamingNarrative || generatedByCronRun) continue;
      const safe = redactSensitiveText(text, { mode: "tools" });
      const renderedLines = renderSessionExportLines(
        message.role === "user" ? "User" : "Assistant",
        safe,
      );
      const timestampMs = parseSessionTimestampMs(record, message);
      collected.push(...renderedLines);
      lineMap.push(...renderedLines.map(() => jsonlIdx + 1));
      messageTimestampsMs.push(...renderedLines.map(() => timestampMs));
    }
    const content = collected.join("\n");
    return {
      path: memoryPath,
      absPath,
      mtimeMs,
      size,
      hash: hashText(content + "\n" + lineMap.join(",") + "\n" + messageTimestampsMs.join(",")),
      content,
      lineMap,
      messageTimestampsMs,
      ...(generatedByDreamingNarrative ? { generatedByDreamingNarrative: true } : {}),
      ...(generatedByCronRun ? { generatedByCronRun: true } : {}),
    };
  } catch (err) {
    logSessionFileReadFailure(absPath, err);
    return null;
  }
}
//#endregion
//#region packages/memory-host-sdk/src/host/qmd-query-parser.ts
/** Parse qmd stdout/stderr into normalized results, accepting known no-result markers. */
function parseQmdQueryJson(stdout, stderr) {
  const trimmedStdout = stdout.trim();
  const trimmedStderr = stderr.trim();
  const stdoutIsMarker = trimmedStdout.length > 0 && isQmdNoResultsOutput(trimmedStdout);
  const stderrIsMarker = trimmedStderr.length > 0 && isQmdNoResultsOutput(trimmedStderr);
  if (stdoutIsMarker || (!trimmedStdout && stderrIsMarker)) return [];
  if (!trimmedStdout) {
    const message = `stdout empty${trimmedStderr ? ` (stderr: ${summarizeQmdStderr(trimmedStderr)})` : ""}`;
    warnQmdQueryParseError(message);
    throw new Error(`qmd query returned invalid JSON: ${message}`);
  }
  try {
    const parsed = parseQmdQueryResultArray(trimmedStdout);
    if (parsed !== null) return parsed;
    const noisyPayload = extractFirstJsonArray(trimmedStdout);
    if (!noisyPayload) throw new Error("qmd query JSON response was not an array");
    const fallback = parseQmdQueryResultArray(noisyPayload);
    if (fallback !== null) return fallback;
    throw new Error("qmd query JSON response was not an array");
  } catch (err) {
    const message = formatErrorMessage(err);
    warnQmdQueryParseError(message);
    throw new Error(`qmd query returned invalid JSON: ${message}`, { cause: err });
  }
}
/** Emit parse warnings outside tests so broken qmd output is visible to operators. */
function warnQmdQueryParseError(message) {
  if (process.env.VITEST || false) return;
  process.stderr.write(`qmd query returned invalid JSON: ${message}\n`);
}
/** Detect qmd no-result marker output on stdout or stderr. */
function isQmdNoResultsOutput(raw) {
  return raw
    .split(/\r?\n/)
    .map((line) => normalizeLowercaseStringOrEmpty(line).replace(/\s+/g, " "))
    .filter((line) => line.length > 0)
    .some((line) => isQmdNoResultsLine(line));
}
/** Match qmd no-result lines with optional warning/info prefixes. */
function isQmdNoResultsLine(line) {
  if (line === "no results found" || line === "no results found.") return true;
  return /^(?:\[[^\]]+\]\s*)?(?:(?:warn(?:ing)?|info|error|qmd)\s*:\s*)+no results found\.?$/.test(
    line,
  );
}
/** Bound stderr context included in parse errors. */
function summarizeQmdStderr(raw) {
  return raw.length <= 120 ? raw : `${truncateUtf16Safe(raw, 117)}...`;
}
/** Parse and normalize a strict qmd JSON array payload. */
function parseQmdQueryResultArray(raw) {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed.map((item) => {
      if (typeof item !== "object" || item === null) return item;
      const record = item;
      return {
        docid: typeof record.docid === "string" ? record.docid : void 0,
        score:
          typeof record.score === "number" && Number.isFinite(record.score) ? record.score : void 0,
        collection: typeof record.collection === "string" ? record.collection : void 0,
        file: typeof record.file === "string" ? record.file : void 0,
        snippet: typeof record.snippet === "string" ? record.snippet : void 0,
        body: typeof record.body === "string" ? record.body : void 0,
        startLine: parseQmdLineNumber(record.start_line ?? record.startLine),
        endLine: parseQmdLineNumber(record.end_line ?? record.endLine),
      };
    });
  } catch {
    return null;
  }
}
/** Normalize qmd line numbers, rejecting zero, negative, and non-integer values. */
function parseQmdLineNumber(value) {
  return typeof value === "number" && Number.isSafeInteger(value) && value > 0 ? value : void 0;
}
/** Extract the first complete JSON array from noisy stdout. */
function extractFirstJsonArray(raw) {
  const start = raw.indexOf("[");
  if (start < 0) return null;
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = start; i < raw.length; i += 1) {
    const char = raw[i];
    if (char === void 0) break;
    if (inString) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (char === "\\") escaped = true;
      else if (char === '"') inString = false;
      continue;
    }
    if (char === '"') {
      inString = true;
      continue;
    }
    if (char === "[") depth += 1;
    else if (char === "]") {
      depth -= 1;
      if (depth === 0) return raw.slice(start, i + 1);
    }
  }
  return null;
}
//#endregion
//#region packages/memory-host-sdk/src/host/qmd-scope.ts
function isQmdScopeAllowed(scope, sessionKey) {
  if (!scope) return true;
  const parsed = parseQmdSessionScope(sessionKey);
  const channel = parsed.channel;
  const chatType = parsed.chatType;
  const normalizedKey = parsed.normalizedKey ?? "";
  const rawKey = normalizeLowercaseStringOrEmpty(sessionKey ?? "");
  for (const rule of scope.rules ?? []) {
    if (!rule) continue;
    const match = rule.match ?? {};
    if (match.channel && match.channel !== channel) continue;
    if (match.chatType && match.chatType !== chatType) continue;
    const normalizedPrefix = normalizeOptionalLowercaseString(match.keyPrefix) || void 0;
    const rawPrefix = normalizeOptionalLowercaseString(match.rawKeyPrefix) || void 0;
    if (rawPrefix && !rawKey.startsWith(rawPrefix)) continue;
    if (normalizedPrefix) {
      if (normalizedPrefix.startsWith("agent:")) {
        if (!rawKey.startsWith(normalizedPrefix)) continue;
      } else if (!normalizedKey.startsWith(normalizedPrefix)) continue;
    }
    return rule.action === "allow";
  }
  return (scope.default ?? "allow") === "allow";
}
function deriveQmdScopeChannel(key) {
  return parseQmdSessionScope(key).channel;
}
function deriveQmdScopeChatType(key) {
  return parseQmdSessionScope(key).chatType;
}
function parseQmdSessionScope(key) {
  const normalized = normalizeQmdSessionKey(key);
  if (!normalized) return {};
  const parts = normalized.split(":").filter(Boolean);
  let chatType;
  if (
    parts.length >= 2 &&
    (parts[1] === "group" || parts[1] === "channel" || parts[1] === "direct" || parts[1] === "dm")
  ) {
    if (parts.includes("group")) chatType = "group";
    else if (parts.includes("channel")) chatType = "channel";
    return {
      normalizedKey: normalized,
      channel: normalizeOptionalLowercaseString(parts[0]),
      chatType: chatType ?? "direct",
    };
  }
  if (normalized.includes(":group:"))
    return {
      normalizedKey: normalized,
      chatType: "group",
    };
  if (normalized.includes(":channel:"))
    return {
      normalizedKey: normalized,
      chatType: "channel",
    };
  return {
    normalizedKey: normalized,
    chatType: "direct",
  };
}
function normalizeQmdSessionKey(key) {
  if (!key) return;
  const trimmed = key.trim();
  if (!trimmed) return;
  const normalized = normalizeLowercaseStringOrEmpty(
    parseAgentSessionKey(trimmed)?.rest ?? trimmed,
  );
  if (normalized.startsWith("subagent:")) return;
  return normalized;
}
function parseAgentSessionKey(sessionKey) {
  const raw = normalizeOptionalLowercaseString(sessionKey);
  if (!raw) return null;
  const parts = raw.split(":").filter(Boolean);
  if (parts.length < 3 || parts[0] !== "agent") return null;
  const rest = parts.slice(2).join(":");
  return rest ? { rest } : null;
}
//#endregion
//#region packages/memory-host-sdk/src/host/qmd-process.ts
const DEFAULT_WINDOWS_SYSTEM_ROOT = "C:\\Windows";
function resolveQmdBinaryUnavailableReason(result) {
  return result.reason ?? "binary";
}
function resolveCliSpawnInvocation(params) {
  return materializeWindowsSpawnProgram(
    resolveWindowsSpawnProgram({
      command: params.command,
      platform: process.platform,
      env: params.env,
      execPath: process.execPath,
      packageName: params.packageName,
      allowShellFallback: false,
    }),
    params.args,
  );
}
async function checkQmdBinaryAvailability(params) {
  let spawnInvocation;
  try {
    spawnInvocation = resolveCliSpawnInvocation({
      command: params.command,
      args: [],
      env: params.env,
      packageName: "qmd",
    });
  } catch (err) {
    return {
      available: false,
      reason: "binary",
      error: formatQmdAvailabilityError(err),
    };
  }
  const cwd = params.cwd ?? process.cwd();
  const cwdError = validateQmdProbeCwd(cwd);
  if (cwdError) return cwdError;
  return await new Promise((resolve) => {
    let settled = false;
    let didSpawn = false;
    const finish = (result) => {
      if (settled) return;
      settled = true;
      if (timer) clearTimeout(timer);
      resolve(result);
    };
    const child = spawn(spawnInvocation.command, spawnInvocation.argv, {
      env: params.env,
      cwd,
      shell: spawnInvocation.shell,
      windowsHide: spawnInvocation.windowsHide,
      stdio: "ignore",
      detached: shouldUseQmdProcessGroup(),
    });
    const timeoutMs = resolveSafeTimeoutDelayMs(params.timeoutMs ?? 2e3, { minMs: 0 });
    const timer = setTimeout(() => {
      signalQmdProcessTree(child, "SIGKILL");
      finish({
        available: false,
        reason: "binary",
        error: `spawn ${params.command} timed out after ${timeoutMs}ms`,
      });
    }, timeoutMs);
    child.once("error", (err) => {
      finish({
        available: false,
        reason: "binary",
        error: formatQmdAvailabilityError(err),
      });
    });
    child.once("spawn", () => {
      didSpawn = true;
      signalQmdProcessTree(child);
      finish({ available: true });
    });
    child.once("close", () => {
      if (!didSpawn) return;
      finish({ available: true });
    });
  });
}
function validateQmdProbeCwd(cwd) {
  try {
    if (!statSync(cwd).isDirectory())
      return {
        available: false,
        reason: "workspace-cwd",
        error: `workspace directory is not a directory: ${cwd}`,
      };
    return null;
  } catch (err) {
    if (typeof err === "object" && err && "code" in err && err.code === "ENOENT")
      return {
        available: false,
        reason: "workspace-cwd",
        error: `workspace directory missing: ${cwd}`,
      };
    return {
      available: false,
      reason: "workspace-cwd",
      error: `workspace directory unavailable: ${cwd} (${formatQmdAvailabilityError(err)})`,
    };
  }
}
/**
 * Normalize an aborted signal into the error used to reject a killed command.
 * Prefers the caller-supplied abort reason (so a deadline message survives) and
 * falls back to a stable per-command abort error.
 */
function abortReason(signal, commandSummary) {
  const reason = signal?.reason;
  if (reason instanceof Error) return reason;
  if (typeof reason === "string" && reason.length > 0) return new Error(reason);
  return /* @__PURE__ */ new Error(`${commandSummary} aborted`);
}
async function runCliCommand(params) {
  return await new Promise((resolve, reject) => {
    const { signal } = params;
    if (signal?.aborted) {
      reject(abortReason(signal, params.commandSummary));
      return;
    }
    const child = spawn(params.spawnInvocation.command, params.spawnInvocation.argv, {
      env: params.env,
      cwd: params.cwd,
      shell: params.spawnInvocation.shell,
      windowsHide: params.spawnInvocation.windowsHide,
      detached: shouldUseQmdProcessGroup(),
    });
    let stdout = "";
    let stderr = "";
    let stdoutTruncated = false;
    let stderrTruncated = false;
    let settled = false;
    const discardStdout = params.discardStdout === true;
    const timeoutMs =
      params.timeoutMs === void 0 ? void 0 : resolveSafeTimeoutDelayMs(params.timeoutMs);
    const timer = timeoutMs
      ? setTimeout(() => {
          signalQmdProcessTree(child, "SIGKILL");
          settle(() =>
            reject(
              /* @__PURE__ */ new Error(`${params.commandSummary} timed out after ${timeoutMs}ms`),
            ),
          );
        }, timeoutMs)
      : null;
    const onAbort = () => {
      signalQmdProcessTree(child, "SIGKILL");
      settle(() => reject(abortReason(signal, params.commandSummary)));
    };
    function settle(run) {
      if (settled) return;
      settled = true;
      if (timer) clearTimeout(timer);
      signal?.removeEventListener("abort", onAbort);
      run();
    }
    signal?.addEventListener("abort", onAbort, { once: true });
    child.stdout.on("data", (data) => {
      if (discardStdout) return;
      const next = appendOutputWithCap(stdout, data.toString("utf8"), params.maxOutputChars);
      stdout = next.text;
      stdoutTruncated = stdoutTruncated || next.truncated;
    });
    child.stderr.on("data", (data) => {
      const next = appendOutputWithCap(stderr, data.toString("utf8"), params.maxOutputChars);
      stderr = next.text;
      stderrTruncated = stderrTruncated || next.truncated;
    });
    for (const streamName of ["stdout", "stderr"])
      child[streamName].on("error", (error) => {
        if (settled) return;
        signalQmdProcessTree(child, "SIGKILL");
        settle(() =>
          reject(
            new Error(`${params.commandSummary} ${streamName} error: ${error.message}`, {
              cause: error,
            }),
          ),
        );
      });
    child.on("error", (err) => {
      if (timer) clearTimeout(timer);
      settle(() => reject(err));
    });
    child.on("close", (code, closeSignal) => {
      if (timer) clearTimeout(timer);
      settle(() => {
        if (!discardStdout && (stdoutTruncated || stderrTruncated)) {
          reject(
            /* @__PURE__ */ new Error(
              `${params.commandSummary} produced too much output (limit ${params.maxOutputChars} chars)`,
            ),
          );
          return;
        }
        if (code === 0)
          resolve({
            stdout,
            stderr,
          });
        else
          reject(
            new CliCommandError({
              commandSummary: params.commandSummary,
              code,
              signal: closeSignal ?? null,
              stdout,
              stderr,
            }),
          );
      });
    });
  });
}
function shouldUseQmdProcessGroup() {
  return process.platform !== "win32";
}
function getEnvValueCaseInsensitive(env, expectedKey) {
  const direct = env[expectedKey];
  if (direct !== void 0) return direct;
  const expected = expectedKey.toUpperCase();
  const actualKey = Object.keys(env).find((key) => key.toUpperCase() === expected);
  return actualKey ? env[actualKey] : void 0;
}
function normalizeWindowsSystemRoot(raw) {
  const trimmed = raw?.trim();
  if (
    !trimmed ||
    trimmed.includes("\0") ||
    trimmed.includes("\r") ||
    trimmed.includes("\n") ||
    trimmed.includes(";")
  )
    return null;
  const normalized = path.win32.normalize(trimmed);
  if (!path.win32.isAbsolute(normalized) || normalized.startsWith("\\\\")) return null;
  const parsed = path.win32.parse(normalized);
  if (!/^[A-Za-z]:\\$/.test(parsed.root) || normalized.length <= parsed.root.length) return null;
  return normalized.replace(/[\\/]+$/, "");
}
function resolveWindowsTaskkillPath(env = process.env) {
  const systemRoot =
    normalizeWindowsSystemRoot(getEnvValueCaseInsensitive(env, "SystemRoot")) ??
    normalizeWindowsSystemRoot(getEnvValueCaseInsensitive(env, "WINDIR")) ??
    DEFAULT_WINDOWS_SYSTEM_ROOT;
  return path.win32.join(systemRoot, "System32", "taskkill.exe");
}
function signalQmdProcessTree(child, signal) {
  if (shouldUseQmdProcessGroup() && typeof child.pid === "number")
    try {
      if (signal === void 0) process.kill(-child.pid);
      else process.kill(-child.pid, signal);
      return;
    } catch {}
  if (!shouldUseQmdProcessGroup() && typeof child.pid === "number") {
    const taskkillPath = resolveWindowsTaskkillPath();
    const args = ["/PID", String(child.pid), "/T"];
    if (signal === "SIGKILL") args.push("/F");
    const result = spawnSync(taskkillPath, args, {
      stdio: "ignore",
      windowsHide: true,
    });
    if (!result.error && result.status === 0) return;
    if (signal !== "SIGKILL") {
      const forceResult = spawnSync(taskkillPath, [...args, "/F"], {
        stdio: "ignore",
        windowsHide: true,
      });
      if (!forceResult.error && forceResult.status === 0) return;
    }
  }
  if (signal === void 0) child.kill();
  else child.kill(signal);
}
var CliCommandError = class extends Error {
  constructor(params) {
    super(formatCliCommandFailureMessage(params));
    this.name = "CliCommandError";
    this.code = params.code;
    this.signal = params.signal;
    this.stdout = params.stdout;
    this.stderr = params.stderr;
  }
};
function formatCliCommandFailureMessage(params) {
  const exit =
    params.code === null ? `signal ${params.signal ?? "unknown"}` : `code ${String(params.code)}`;
  return `${params.commandSummary} failed (${exit}): ${params.stderr || params.stdout}`;
}
function appendOutputWithCap(current, chunk, maxChars) {
  const appended = current + chunk;
  const chars = Array.from(appended);
  if (chars.length <= maxChars)
    return {
      text: appended,
      truncated: false,
    };
  return {
    text: chars.slice(-maxChars).join(""),
    truncated: true,
  };
}
function formatQmdAvailabilityError(err) {
  if (err instanceof Error && err.message) return err.message;
  return String(err);
}
//#endregion
export {
  sessionPathForFile as _,
  deriveQmdScopeChannel as a,
  listSessionTranscriptCorpusEntriesForAgent as b,
  parseQmdQueryJson as c,
  loadDreamingNarrativeTranscriptPathSetForAgent as d,
  loadSessionTranscriptClassificationForAgent as f,
  resolveSessionIdentityForTranscriptFile as g,
  resolveSessionFileForSyncTarget as h,
  runCliCommand as i,
  buildSessionEntry as l,
  parseCanonicalSessionSyncTargetFromPath as m,
  resolveCliSpawnInvocation as n,
  deriveQmdScopeChatType as o,
  normalizeSessionTranscriptPathForComparison as p,
  resolveQmdBinaryUnavailableReason as r,
  isQmdScopeAllowed as s,
  checkQmdBinaryAvailability as t,
  listSessionFilesForAgent as u,
  sessionPathForSessionIdentity as v,
  statSessionEntrySync as y,
};
