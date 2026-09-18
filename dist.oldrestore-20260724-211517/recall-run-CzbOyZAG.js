import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { setTimeout } from "node:timers/promises";
import {
  a as resolveAgentDir,
  o as resolveAgentWorkspaceDir,
} from "./agent-scope-config-DVIR1nBa.js";
import "./temp-path-DYqJUh96.js";
import "./routing-CwvmVRHd.js";
import {
  i as isMissingRegisteredMemoryToolsError,
  l as resolvePersistentTranscriptBaseDir,
  o as requireTransientWorkspaceDir,
  t as applyActiveMemoryRuntimeConfigSnapshot,
  u as resolveSafeTranscriptDir,
} from "./config-DSPNikPv.js";
import "./agent-runtime-BiQiwmwD.js";
import { t as tempWorkspace } from "./private-temp-workspace-BrSGWjaU.js";
import { r as buildRecallPrompt } from "./prompt-CFlUxlid.js";
import { o as getModelRef } from "./query-DX527y0q.js";
import { f as toSingleLineLogValue } from "./recall-state-BtFV2Jn8.js";
import {
  a as resolveRecallRunChannelContext,
  i as resolveCanonicalSessionKeyFromSessionId,
} from "./session-BHzzCQEf.js";
import { c as parseAgentSessionKey } from "./session-key-utils-B8sNp9l4.js";
import {
  s as patchSessionEntry,
  t as cleanupSessionLifecycleArtifacts,
} from "./session-store-runtime-BwE6SlGz.js";
import { a as readSessionTranscriptEvents } from "./session-transcript-runtime-B2hvNHEH.js";
import { t as formatSqliteSessionFileMarker } from "./sqlite-marker-BejbySI1.js";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-uPgNO8da.js";
import {
  d as transcriptSourceFromReturnedSessionFile,
  i as fileTranscriptSource,
} from "./transcript-Dzo9636l.js";
import {
  i as readMemoryToolResultEvidence,
  o as readPartialAssistantTextFromSources,
  t as attachPartialTimeoutData,
} from "./transcript-result-CGTBO0My.js";
import {
  i as readMergedActiveMemoryTranscriptState,
  n as readActiveMemorySearchDebugFromRunResult,
  r as readActiveMemorySessionFileFromRunResult,
} from "./transcript-watch-BDDL56fg.js";
import {
  o as ACTIVE_MEMORY_RECALL_LANE,
  t as ACTIVE_MEMORY_CLEANUP_RETRY_DELAYS_MS,
} from "./types-gz2L16qk.js";
//#region extensions/active-memory/recall-run.ts
function collectActiveMemoryTranscriptSources(params) {
  const sources = [params.runtimeSource];
  sources.push(fileTranscriptSource(params.artifactSessionFile));
  if (params.activeSessionFile && params.activeSessionFile !== params.artifactSessionFile)
    sources.push(
      transcriptSourceFromReturnedSessionFile({
        sessionFile: params.activeSessionFile,
        sessionKey: params.activeSessionKey,
      }),
    );
  return sources;
}
async function persistActiveMemoryTranscriptArtifact(params) {
  const events = [];
  const seen = /* @__PURE__ */ new Set();
  for (const source of params.sources) {
    if (source.kind !== "runtime") continue;
    let sourceEvents;
    try {
      sourceEvents = await readSessionTranscriptEvents(source.target);
    } catch {
      continue;
    }
    for (const event of sourceEvents) {
      const serialized = JSON.stringify(event);
      if (seen.has(serialized)) continue;
      seen.add(serialized);
      events.push(event);
    }
  }
  if (events.length === 0) return;
  await fs.mkdir(path.dirname(params.sessionFile), {
    recursive: true,
    mode: 448,
  });
  await fs.writeFile(
    params.sessionFile,
    `${events.map((event) => JSON.stringify(event)).join("\n")}\n`,
    {
      encoding: "utf8",
      mode: 384,
    },
  );
}
async function cleanupActiveMemoryRecallSession(params) {
  const sessionKeySegmentPrefix =
    parseAgentSessionKey(params.sessionKey)?.rest ?? params.sessionKey;
  let lastError;
  for (const delayMs of ACTIVE_MEMORY_CLEANUP_RETRY_DELAYS_MS) {
    if (delayMs > 0) await setTimeout(delayMs);
    try {
      const result = await cleanupSessionLifecycleArtifacts({
        agentId: params.agentId,
        archiveRemovedEntryTranscripts: false,
        orphanTranscriptMinAgeMs: 0,
        sessionKeySegmentPrefix,
        storePath: params.storePath,
        transcriptContentMarker: `"runId":"${params.sessionId}"`,
      });
      if (result.removedEntries !== 1)
        throw new Error(
          `active-memory recall cleanup removed ${String(result.removedEntries)} sessions`,
        );
      return;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError instanceof Error
    ? lastError
    : /* @__PURE__ */ new Error(`active-memory recall cleanup failed: ${String(lastError)}`);
}
async function runRecallSubagent(params) {
  const workspaceDir = resolveAgentWorkspaceDir(params.api.config, params.agentId);
  const agentDir = resolveAgentDir(params.api.config, params.agentId);
  const modelRef =
    params.modelRef ??
    getModelRef(params.api, params.agentId, params.config, {
      modelProviderId: params.currentModelProviderId,
      modelId: params.currentModelId,
    });
  if (!modelRef) return { rawReply: "NONE" };
  const subagentSessionId = `active-memory-${Date.now().toString(36)}-${crypto.randomUUID().slice(0, 8)}`;
  const parentSessionKey =
    params.sessionKey ??
    resolveCanonicalSessionKeyFromSessionId({
      api: params.api,
      agentId: params.agentId,
      sessionId: params.sessionId,
    });
  const subagentScope = parentSessionKey ?? params.sessionId ?? crypto.randomUUID();
  const subagentSuffix = `active-memory:${crypto.createHash("sha1").update(`${subagentScope}:${params.query}:${subagentSessionId}`).digest("hex").slice(0, 12)}`;
  const subagentSessionKey = parentSessionKey
    ? `${parentSessionKey}:${subagentSuffix}`
    : `agent:${params.agentId}:${subagentSuffix}`;
  const transientWorkspace = params.config.persistTranscripts
    ? void 0
    : await tempWorkspace({
        rootDir: resolvePreferredOpenClawTmpDir(),
        prefix: "openclaw-active-memory-",
      });
  const tempDir = transientWorkspace?.dir;
  const persistedDir = params.config.persistTranscripts
    ? resolveSafeTranscriptDir(
        resolvePersistentTranscriptBaseDir(params.api, params.agentId),
        params.config.transcriptDir,
      )
    : void 0;
  const artifactSessionFile =
    persistedDir !== void 0
      ? path.join(persistedDir, `${subagentSessionId}.jsonl`)
      : path.join(requireTransientWorkspaceDir(tempDir), "session.jsonl");
  const storePath = params.api.runtime.agent.session.resolveStorePath(
    params.api.config.session?.store,
    { agentId: params.agentId },
  );
  const runtimeSessionFile = formatSqliteSessionFileMarker({
    agentId: params.agentId,
    sessionId: subagentSessionId,
    storePath,
  });
  const runtimeSource = {
    kind: "runtime",
    target: {
      agentId: params.agentId,
      sessionId: subagentSessionId,
      sessionKey: subagentSessionKey,
      storePath,
    },
  };
  let transcriptSources = collectActiveMemoryTranscriptSources({
    artifactSessionFile,
    runtimeSource,
    activeSessionKey: subagentSessionKey,
  });
  let harnessHasUsableMemoryResult = false;
  let harnessHasUnavailableMemorySearchResult = false;
  let transcriptArtifactPersisted = false;
  let runtimeSessionCreated = false;
  try {
    const runtimeEntry = {
      pluginOwnerId: params.api.id,
      sessionId: subagentSessionId,
      sessionFile: runtimeSessionFile,
      updatedAt: Date.now(),
    };
    if (
      (
        await patchSessionEntry({
          agentId: params.agentId,
          fallbackEntry: runtimeEntry,
          replaceEntry: true,
          sessionKey: subagentSessionKey,
          skipMaintenance: true,
          storePath,
          update: (_entry, context) => (context.existingEntry ? null : runtimeEntry),
        })
      )?.sessionId !== subagentSessionId
    )
      throw new Error(`active-memory recall session already exists: ${subagentSessionKey}`);
    runtimeSessionCreated = true;
    params.onTranscriptSources?.(transcriptSources);
    if (persistedDir) {
      await fs.mkdir(persistedDir, {
        recursive: true,
        mode: 448,
      });
      await fs.chmod(persistedDir, 448).catch(() => void 0);
    }
    const prompt = buildRecallPrompt({
      config: params.config,
      query: params.query,
      searchQuery: params.searchQuery,
    });
    const { messageChannel, messageProvider } = resolveRecallRunChannelContext({
      api: params.api,
      agentId: params.agentId,
      sessionKey: parentSessionKey,
      sessionId: params.sessionId,
      messageProvider: params.messageProvider,
      channelId: params.channelId,
    });
    const embeddedConfig = applyActiveMemoryRuntimeConfigSnapshot(params.api.config, params.config);
    const embeddedTimeoutMs = params.config.timeoutMs + params.config.setupGraceTimeoutMs;
    const result = await params.api.runtime.agent.runEmbeddedAgent({
      sessionId: subagentSessionId,
      sessionKey: subagentSessionKey,
      agentId: params.agentId,
      sessionTarget: {
        agentId: params.agentId,
        sessionId: subagentSessionId,
        sessionKey: subagentSessionKey,
        storePath,
      },
      messageChannel,
      messageProvider,
      sessionFile: runtimeSessionFile,
      workspaceDir,
      agentDir,
      config: embeddedConfig,
      prompt,
      provider: modelRef.provider,
      model: modelRef.model,
      lane: ACTIVE_MEMORY_RECALL_LANE,
      timeoutMs: embeddedTimeoutMs,
      runId: subagentSessionId,
      trigger: "manual",
      toolsAllow: [...params.config.toolsAllow],
      disableMessageTool: true,
      allowGatewaySubagentBinding: true,
      bootstrapContextMode: "lightweight",
      verboseLevel: "off",
      thinkLevel: params.config.thinking,
      reasoningLevel: "off",
      silentExpected: true,
      authProfileFailurePolicy: "local",
      cleanupBundleMcpOnRunEnd: true,
      abortSignal: params.abortSignal,
      onAgentToolResult: (event) => {
        const evidence = readMemoryToolResultEvidence({
          ...event,
          toolsAllow: params.config.toolsAllow,
        });
        harnessHasUsableMemoryResult ||= evidence.hasUsableMemoryResult;
        harnessHasUnavailableMemorySearchResult ||= evidence.hasUnavailableMemorySearchResult;
      },
    });
    transcriptSources = collectActiveMemoryTranscriptSources({
      artifactSessionFile,
      runtimeSource,
      activeSessionFile: readActiveMemorySessionFileFromRunResult(result) ?? runtimeSessionFile,
      activeSessionKey: subagentSessionKey,
    });
    params.onTranscriptSources?.(transcriptSources);
    if (params.abortSignal?.aborted) {
      const reason = params.abortSignal.reason;
      if (reason instanceof Error) throw reason;
      const abortErr =
        reason !== void 0
          ? new Error("Operation aborted", { cause: reason })
          : /* @__PURE__ */ new Error("Operation aborted");
      abortErr.name = "AbortError";
      throw abortErr;
    }
    const rawReply = (result.payloads ?? [])
      .map((payload) => payload.text?.trim() ?? "")
      .filter(Boolean)
      .join("\n")
      .trim();
    if (params.config.persistTranscripts) {
      await persistActiveMemoryTranscriptArtifact({
        sources: transcriptSources,
        sessionFile: artifactSessionFile,
      });
      transcriptArtifactPersisted = true;
    }
    const transcriptState = await readMergedActiveMemoryTranscriptState({
      sources: transcriptSources,
      toolsAllow: params.config.toolsAllow,
    });
    const searchDebug =
      transcriptState.searchDebug ?? readActiveMemorySearchDebugFromRunResult(result);
    return {
      rawReply: rawReply || "NONE",
      transcriptPath: params.config.persistTranscripts ? artifactSessionFile : void 0,
      searchDebug,
      hasUsableMemoryResult: transcriptState.hasUsableMemoryResult || harnessHasUsableMemoryResult,
      hasUnavailableMemorySearchResult:
        transcriptState.hasUnavailableMemorySearchResult || harnessHasUnavailableMemorySearchResult,
    };
  } catch (error) {
    if (params.abortSignal?.aborted) {
      const partialReply = await readPartialAssistantTextFromSources(transcriptSources);
      const transcriptState = await readMergedActiveMemoryTranscriptState({
        sources: transcriptSources,
        toolsAllow: params.config.toolsAllow,
      });
      attachPartialTimeoutData(
        error,
        partialReply,
        transcriptState.searchDebug,
        transcriptState.hasUnavailableMemorySearchResult || harnessHasUnavailableMemorySearchResult,
      );
    }
    if (
      !params.abortSignal?.aborted &&
      isMissingRegisteredMemoryToolsError(error, params.config.toolsAllow)
    ) {
      params.api.logger.debug?.(
        `active-memory: no configured memory tools available; skipping sub-agent`,
      );
      return {
        rawReply: "NONE",
        resultStatus: "unavailable",
      };
    }
    if (!params.abortSignal?.aborted) {
      const message = toSingleLineLogValue(error instanceof Error ? error.message : String(error));
      params.api.logger.warn?.(
        `active-memory: memory sub-agent failed, skipping recall: ${message}`,
      );
      return {
        rawReply: "NONE",
        resultStatus: "failed",
      };
    }
    throw error;
  } finally {
    try {
      if (runtimeSessionCreated) {
        if (params.config.persistTranscripts && !transcriptArtifactPersisted)
          await persistActiveMemoryTranscriptArtifact({
            sources: transcriptSources,
            sessionFile: artifactSessionFile,
          }).catch((error) => {
            const message = toSingleLineLogValue(
              error instanceof Error ? error.message : String(error),
            );
            params.api.logger.debug?.(
              `active-memory: failed to persist recall transcript ${artifactSessionFile}: ${message}`,
            );
          });
        await cleanupActiveMemoryRecallSession({
          agentId: params.agentId,
          sessionId: subagentSessionId,
          sessionKey: subagentSessionKey,
          storePath,
        }).catch((error) => {
          const message = toSingleLineLogValue(
            error instanceof Error ? error.message : String(error),
          );
          params.api.logger.warn?.(
            `active-memory: failed to clean up recall session ${subagentSessionKey}: ${message}`,
          );
          throw error;
        });
      }
    } finally {
      await transientWorkspace?.cleanup();
    }
  }
}
//#endregion
export { runRecallSubagent as t };
