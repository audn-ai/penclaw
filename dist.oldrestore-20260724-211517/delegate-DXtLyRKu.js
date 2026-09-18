import { normalizeStructuredPromptSection } from "@openclaw/ai/internal/shared";
import { r as createLazyRuntimeModule } from "./lazy-runtime-B-Fc-m0I.js";
import { t as buildMemoryPromptSection } from "./memory-state-z9GGEQiO.js";
import { n as parseSqliteSessionFileMarker } from "./sqlite-marker-BejbySI1.js";
//#region src/context-engine/delegate.ts
const loadCompactRuntime = createLazyRuntimeModule(() => import("./compact.runtime.js"));
function buildCompactionResultSessionTarget(params) {
  const sqliteMarker = parseSqliteSessionFileMarker(params.sessionFile);
  const sessionId = sqliteMarker?.sessionId ?? params.sessionId;
  if (!sessionId) return;
  const agentId = params.sessionTarget?.agentId ?? params.agentId ?? sqliteMarker?.agentId;
  const sessionKey = params.sessionTarget?.sessionKey ?? params.sessionKey;
  const storePath = params.sessionTarget?.storePath ?? sqliteMarker?.storePath;
  return {
    ...(agentId ? { agentId } : {}),
    sessionId,
    ...(sessionKey ? { sessionKey } : {}),
    ...(storePath ? { storePath } : {}),
    ...(params.sessionTarget?.threadId !== void 0
      ? { threadId: params.sessionTarget.threadId }
      : {}),
  };
}
/**
 * Delegate a context-engine compaction request to OpenClaw's built-in runtime compaction path.
 *
 * This is the same bridge used by the legacy context engine. Third-party
 * engines can call it from their own `compact()` implementations when they do
 * not own the compaction algorithm but still need `/compact` and overflow
 * recovery to use the stock runtime behavior.
 *
 * Note: `compactionTarget` is part of the public `compact()` contract, but the
 * built-in runtime compaction path does not expose that knob. This helper
 * ignores it to preserve legacy behavior; engines that need target-specific
 * compaction should implement their own `compact()` algorithm.
 */
async function delegateCompactionToRuntime(params) {
  const { compactEmbeddedAgentSessionDirect } = await loadCompactRuntime();
  const runtimeContext = params.runtimeContext ?? {};
  const { sessionFile: _legacySessionFile, ...runtimeContextParams } = runtimeContext;
  const sessionTarget = params.sessionTarget ?? runtimeContext.sessionTarget;
  const agentId = params.agentId ?? runtimeContext.agentId;
  const sessionKey = params.sessionKey ?? runtimeContext.sessionKey;
  const currentTokenCount =
    params.currentTokenCount ??
    (typeof runtimeContext.currentTokenCount === "number" &&
    Number.isFinite(runtimeContext.currentTokenCount) &&
    runtimeContext.currentTokenCount > 0
      ? Math.floor(runtimeContext.currentTokenCount)
      : void 0);
  const result = await compactEmbeddedAgentSessionDirect({
    ...runtimeContextParams,
    ...(agentId ? { agentId } : {}),
    sessionId: params.sessionId,
    ...(sessionKey ? { sessionKey } : {}),
    ...(sessionTarget ? { sessionTarget } : {}),
    tokenBudget: params.tokenBudget,
    ...(currentTokenCount !== void 0 ? { currentTokenCount } : {}),
    force: params.force,
    customInstructions: params.customInstructions,
    abortSignal: params.abortSignal,
    workspaceDir:
      typeof runtimeContext.workspaceDir === "string" ? runtimeContext.workspaceDir : process.cwd(),
  });
  const resultSessionTarget = result.result
    ? buildCompactionResultSessionTarget({
        agentId,
        sessionFile: result.result.sessionFile,
        sessionId: result.result.sessionId,
        sessionKey,
        sessionTarget,
      })
    : void 0;
  return {
    ok: result.ok,
    compacted: result.compacted,
    reason: result.reason,
    result: result.result
      ? {
          summary: result.result.summary,
          firstKeptEntryId: result.result.firstKeptEntryId,
          tokensBefore: result.result.tokensBefore,
          tokensAfter: result.result.tokensAfter,
          details: result.result.details,
          ...(result.result.sessionId ? { sessionId: result.result.sessionId } : {}),
          ...(resultSessionTarget ? { sessionTarget: resultSessionTarget } : {}),
        }
      : void 0,
  };
}
/**
 * Build a context-engine-ready systemPromptAddition from the active memory
 * plugin prompt path. This lets non-legacy engines explicitly opt into the
 * same memory/wiki guidance that the legacy engine gets via system prompt
 * assembly, without reimplementing memory prompt formatting.
 */
function buildMemorySystemPromptAddition(params) {
  const lines = buildMemoryPromptSection({
    availableTools: params.availableTools,
    citationsMode: params.citationsMode,
    agentId: params.agentId,
    agentSessionKey: params.agentSessionKey,
    sandboxed: params.sandboxed,
  });
  if (lines.length === 0) return;
  return normalizeStructuredPromptSection(lines.join("\n")) || void 0;
}
//#endregion
export { delegateCompactionToRuntime as n, buildMemorySystemPromptAddition as t };
