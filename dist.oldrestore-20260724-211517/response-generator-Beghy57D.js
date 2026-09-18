import crypto from "node:crypto";
import {
  i as applyModelOverrideToSessionEntry,
  r as ModelSelectionLockedError,
} from "./model-overrides-BlzAR7Nc.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import {
  l as resolveVoiceCallSessionKey,
  n as resolveCallAgentId,
  t as resolveVoiceResponseModel,
} from "./response-model-DrXWlBRg.js";
import { n as resolvePersistedSessionRuntimeId } from "./session-runtime-compat-DgCFENjt.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./model-session-runtime-C8Tj7-5X.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { l as normalizeStringEntries } from "./string-normalization-CRyoFBPt.js";
//#region extensions/voice-call/src/response-generator.ts
/**
 * Voice call response generator - uses the embedded OpenClaw agent for tool support.
 * Routes voice responses through the same agent infrastructure as messaging.
 */
function readExplicitToolsAllow(value) {
  if (!isRecord(value)) return;
  const allow = value.allow;
  if (!Array.isArray(allow)) return;
  return allow.filter((entry) => typeof entry === "string");
}
function resolveVoiceAgentToolsAllow(config, agentId) {
  const agents = isRecord(config.agents) ? config.agents : void 0;
  const agent = (Array.isArray(agents?.list) ? agents.list : []).find(
    (entry) => isRecord(entry) && entry.id === agentId,
  );
  if (!isRecord(agent)) return;
  return readExplicitToolsAllow(isRecord(agent.tools) ? agent.tools : void 0);
}
const VOICE_SPOKEN_OUTPUT_CONTRACT = [
  "Output format requirements:",
  '- Return only valid JSON in this exact shape: {"spoken":"..."}',
  "- Do not include markdown, code fences, planning text, or extra keys.",
  '- Put exactly what should be spoken to the caller into "spoken".',
  '- If there is nothing to say, return {"spoken":""}.',
].join("\n");
function normalizeSpokenText(value) {
  const normalized = value.replace(/\s+/g, " ").trim();
  return normalized.length > 0 ? normalized : null;
}
function tryParseSpokenJson(text) {
  const candidates = [];
  const trimmed = text.trim();
  if (!trimmed) return null;
  candidates.push(trimmed);
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  if (fenced?.[1]) candidates.push(fenced[1]);
  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace)
    candidates.push(trimmed.slice(firstBrace, lastBrace + 1));
  for (const candidate of candidates)
    try {
      const parsed = JSON.parse(candidate);
      if (typeof parsed?.spoken !== "string") continue;
      return normalizeSpokenText(parsed.spoken) ?? "";
    } catch {}
  const inlineSpokenMatch = trimmed.match(/"spoken"\s*:\s*"((?:[^"\\]|\\.)*)"/i);
  if (!inlineSpokenMatch) return null;
  try {
    return normalizeSpokenText(JSON.parse(`"${inlineSpokenMatch[1] ?? ""}"`)) ?? "";
  } catch {
    return null;
  }
}
function isLikelyMetaReasoningParagraph(paragraph) {
  const lower = normalizeLowercaseStringOrEmpty(paragraph);
  if (!lower) return false;
  if (lower.startsWith("thinking process")) return true;
  if (lower.startsWith("reasoning:") || lower.startsWith("analysis:")) return true;
  if (
    lower.startsWith("the user ") &&
    (lower.includes("i should") || lower.includes("i need to") || lower.includes("i will"))
  )
    return true;
  if (
    lower.includes("this is a natural continuation of the conversation") ||
    lower.includes("keep the conversation flowing")
  )
    return true;
  return false;
}
function sanitizePlainSpokenText(text) {
  const withoutCodeFences = text.replace(/```[\s\S]*?```/g, " ").trim();
  if (!withoutCodeFences) return null;
  const paragraphs = normalizeStringEntries(withoutCodeFences.split(/\n\s*\n+/));
  while (paragraphs.length > 1) {
    const firstParagraph = paragraphs.at(0);
    if (!firstParagraph || !isLikelyMetaReasoningParagraph(firstParagraph)) break;
    paragraphs.shift();
  }
  return normalizeSpokenText(paragraphs.join(" "));
}
function extractSpokenTextFromPayloads(payloads) {
  const spokenSegments = [];
  for (const payload of payloads) {
    if (payload.isError || payload.isReasoning) continue;
    const rawText = payload.text?.trim() ?? "";
    if (!rawText) continue;
    const structured = tryParseSpokenJson(rawText);
    if (structured !== null) {
      if (structured.length > 0) spokenSegments.push(structured);
      continue;
    }
    const plain = sanitizePlainSpokenText(rawText);
    if (plain) spokenSegments.push(plain);
  }
  return spokenSegments.length > 0 ? spokenSegments.join(" ").trim() : null;
}
async function deliverEarlyText(callback, text) {
  try {
    return await callback(text);
  } catch (error) {
    console.error("[voice-call] Early TTS delivery failed:", error);
    return false;
  }
}
function resolveVoiceSandboxSessionKey(agentId, sessionKey) {
  const trimmed = sessionKey.trim();
  if (trimmed.toLowerCase().startsWith("agent:")) return trimmed;
  return `agent:${agentId}:${trimmed}`;
}
/**
 * Generate a voice response using the embedded OpenClaw agent with full tool support.
 * Uses the same agent infrastructure as messaging for consistent behavior.
 */
async function generateVoiceResponse(params) {
  const {
    voiceConfig,
    callId,
    sessionKey,
    from,
    transcript,
    userMessage,
    coreConfig,
    agentRuntime,
    onEarlyText,
  } = params;
  if (!coreConfig)
    return {
      text: null,
      deliveredEarly: false,
      error: "Core config unavailable for voice response",
    };
  const cfg = coreConfig;
  const agentId = resolveCallAgentId({ agentId: params.agentId }, voiceConfig);
  const resolvedSessionKey = resolveVoiceCallSessionKey({
    config: {
      ...voiceConfig,
      agentId,
    },
    callId,
    phone: from,
    explicitSessionKey: sessionKey,
    coreSession: coreConfig.session,
  });
  const toolsAllow = resolveVoiceAgentToolsAllow(cfg, agentId);
  const storePath = agentRuntime.session.resolveStorePath(cfg.session?.store, { agentId });
  try {
    return await agentRuntime.session.runWithWorkAdmission(
      {
        storePath,
        sessionKey: resolvedSessionKey,
      },
      async (abortSignal) => {
        const agentDir = agentRuntime.resolveAgentDir(cfg, agentId);
        const workspaceDir = agentRuntime.resolveAgentWorkspaceDir(cfg, agentId);
        await agentRuntime.ensureAgentWorkspace({ dir: workspaceDir });
        const now = Date.now();
        const existingSessionEntry = agentRuntime.session.getSessionEntry({
          storePath,
          sessionKey: resolvedSessionKey,
        });
        const { provider, model } = resolveVoiceResponseModel({
          voiceConfig,
          agentRuntime,
        });
        let sessionEntry = existingSessionEntry;
        if (sessionEntry?.modelSelectionLocked === true && voiceConfig.responseModel)
          throw new ModelSelectionLockedError();
        if (!sessionEntry?.sessionId || voiceConfig.responseModel)
          sessionEntry =
            (await agentRuntime.session.patchSessionEntry({
              storePath,
              sessionKey: resolvedSessionKey,
              replaceEntry: true,
              fallbackEntry: sessionEntry ?? {
                sessionId: crypto.randomUUID(),
                updatedAt: now,
              },
              update: (entry) => {
                const next = entry.sessionId
                  ? { ...entry }
                  : {
                      ...entry,
                      sessionId: crypto.randomUUID(),
                      updatedAt: now,
                    };
                if (voiceConfig.responseModel)
                  applyModelOverrideToSessionEntry({
                    entry: next,
                    selection: {
                      provider,
                      model,
                    },
                    selectionSource: "auto",
                  });
                return next;
              },
            })) ?? void 0;
        if (!sessionEntry?.sessionId)
          return {
            text: null,
            deliveredEarly: false,
            error: "Voice response session could not be initialized",
          };
        const sessionId = sessionEntry.sessionId;
        const modelSelectionLocked = sessionEntry.modelSelectionLocked === true;
        const persistedRuntimeId = resolvePersistedSessionRuntimeId(sessionEntry);
        const thinkLevel = agentRuntime.resolveThinkingDefault({
          cfg,
          provider,
          model,
        });
        const agentName =
          agentRuntime.resolveAgentIdentity(cfg, agentId)?.name?.trim() || "assistant";
        const basePrompt =
          voiceConfig.responseSystemPrompt ??
          `You are ${agentName}, a helpful voice assistant on a phone call. Keep responses brief and conversational (1-2 sentences max). Be natural and friendly. The caller's phone number is ${from}. You have access to tools - use them when helpful.`;
        let extraSystemPrompt = basePrompt;
        if (transcript.length > 0)
          extraSystemPrompt = `${basePrompt}\n\nConversation so far:\n${transcript.map((entry) => `${entry.speaker === "bot" ? "You" : "Caller"}: ${entry.text}`).join("\n")}`;
        extraSystemPrompt = `${extraSystemPrompt}\n\n${VOICE_SPOKEN_OUTPUT_CONTRACT}`;
        const timeoutMs =
          voiceConfig.responseTimeoutMs ?? agentRuntime.resolveAgentTimeoutMs({ cfg });
        const runId = `voice:${callId}:${Date.now()}`;
        const blockReplyPayloads = [];
        let latestToolBoundaryMessageIndex;
        let blockReplyBoundariesReliable = true;
        let deliveredEarly = false;
        let lastFlushedText = null;
        const result = await agentRuntime.runEmbeddedAgent({
          sessionId,
          sessionKey: resolvedSessionKey,
          sessionTarget: {
            agentId,
            sessionId,
            sessionKey: resolvedSessionKey,
            storePath,
          },
          sandboxSessionKey: resolveVoiceSandboxSessionKey(agentId, resolvedSessionKey),
          agentId,
          messageProvider: "voice",
          workspaceDir,
          config: cfg,
          prompt: userMessage,
          provider,
          model,
          modelSelectionLocked,
          ...(persistedRuntimeId
            ? {
                agentHarnessId: persistedRuntimeId,
                agentHarnessRuntimeOverride: persistedRuntimeId,
              }
            : {}),
          thinkLevel,
          verboseLevel: "off",
          timeoutMs,
          runId,
          lane: "voice",
          extraSystemPrompt,
          agentDir,
          toolsAllow,
          abortSignal,
          blockReplyBreak: "text_end",
          onBlockReply: (payload, context) => {
            if (latestToolBoundaryMessageIndex !== void 0) {
              const messageIndex = context?.assistantMessageIndex;
              if (messageIndex === void 0) {
                blockReplyBoundariesReliable = false;
                return;
              }
              if (messageIndex <= latestToolBoundaryMessageIndex) return;
            }
            blockReplyPayloads.push(payload);
          },
          onBlockReplyFlush: async (context) => {
            if (context.reason === "tool_start") {
              blockReplyPayloads.length = 0;
              latestToolBoundaryMessageIndex = context.assistantMessageIndex;
              blockReplyBoundariesReliable = true;
              return;
            }
            if (context.reason !== "pre_compaction") return;
            const pendingPayloads = blockReplyPayloads.splice(0);
            const boundariesReliable = blockReplyBoundariesReliable;
            latestToolBoundaryMessageIndex = void 0;
            blockReplyBoundariesReliable = true;
            if (!context.attemptAccepted) return;
            if (deliveredEarly || !onEarlyText || !boundariesReliable) return;
            const text = extractSpokenTextFromPayloads(pendingPayloads);
            if (!text) return;
            lastFlushedText = text;
            deliveredEarly = await deliverEarlyText(onEarlyText, text);
          },
        });
        const text =
          extractSpokenTextFromPayloads(result.payloads ?? []) ??
          lastFlushedText ??
          extractSpokenTextFromPayloads(blockReplyPayloads);
        if (!text && result.meta?.aborted)
          return {
            text: null,
            deliveredEarly: false,
            error: "Response generation was aborted",
          };
        return {
          text,
          deliveredEarly,
        };
      },
    );
  } catch (err) {
    if (err instanceof ModelSelectionLockedError)
      return {
        text: null,
        deliveredEarly: false,
        error: err.message,
      };
    console.error(`[voice-call] Response generation failed:`, err);
    return {
      text: null,
      deliveredEarly: false,
      error: String(err),
    };
  }
}
//#endregion
export { generateVoiceResponse };
