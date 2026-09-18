import { c as resolveDefaultAgentId } from "./agent-scope-config-DVIR1nBa.js";
import "./agent-scope-y9xQv_q1.js";
import { r as logVerbose } from "./globals-CNUzHTcU.js";
import {
  r as prepareSimpleCompletionModelForAgent,
  t as completeWithPreparedSimpleCompletionModel,
} from "./simple-completion-runtime-DThW6g7z.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region src/auto-reply/reply/conversation-label-generator.ts
const DEFAULT_MAX_LABEL_LENGTH = 128;
const CONVERSATION_LABEL_MAX_TOKENS = 4096;
const TIMEOUT_MS = 15e3;
function isTextContentBlock(block) {
  return block.type === "text";
}
function isCodexSimpleCompletionModel(model) {
  return model.api === "openai-chatgpt-responses";
}
function extractSimpleCompletionError(result) {
  if (result.stopReason !== "error") return null;
  return result.errorMessage?.trim() || "unknown error";
}
/** Generates a bounded human-readable label for a session, or null on failure. */
async function generateConversationLabel(params) {
  const { userMessage, prompt, cfg, agentId, agentDir } = params;
  const maxLength =
    typeof params.maxLength === "number" &&
    Number.isFinite(params.maxLength) &&
    params.maxLength > 0
      ? Math.floor(params.maxLength)
      : DEFAULT_MAX_LABEL_LENGTH;
  let prepared;
  try {
    prepared = await prepareSimpleCompletionModelForAgent({
      cfg,
      agentId: agentId ?? resolveDefaultAgentId(cfg),
      agentDir,
      useUtilityModel: true,
      useAsyncModelResolution: true,
      allowMissingApiKeyModes: ["aws-sdk"],
    });
  } catch (err) {
    logVerbose(`conversation-label-generator: model preparation failed: ${String(err)}`);
    return null;
  }
  if ("error" in prepared) {
    logVerbose(`conversation-label-generator: ${prepared.error}`);
    return null;
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const maxTokens = Math.min(CONVERSATION_LABEL_MAX_TOKENS, Math.floor(prepared.model.maxTokens));
    const result = await completeWithPreparedSimpleCompletionModel({
      model: prepared.model,
      auth: prepared.auth,
      cfg,
      context: {
        systemPrompt: prompt,
        messages: [
          {
            role: "user",
            content: userMessage,
            timestamp: Date.now(),
          },
        ],
      },
      options: {
        maxTokens,
        ...(isCodexSimpleCompletionModel(prepared.model) ? {} : { temperature: 0.3 }),
        signal: controller.signal,
      },
    });
    const errorMessage = extractSimpleCompletionError(result);
    if (errorMessage) {
      logVerbose(`conversation-label-generator: completion failed: ${errorMessage}`);
      return null;
    }
    const text = result.content
      .filter(isTextContentBlock)
      .map((block) => block.text)
      .join("")
      .trim();
    if (!text) return null;
    return truncateUtf16Safe(text, maxLength) || null;
  } catch (err) {
    logVerbose(`conversation-label-generator: completion failed: ${String(err)}`);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
//#endregion
export { generateConversationLabel as t };
