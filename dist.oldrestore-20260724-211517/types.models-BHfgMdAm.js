import { t as isStringOption } from "./string-readers-A0wspDGq.js";
//#region src/config/types.models.ts
/** Provider API adapter ids accepted by model/provider config and schema generation. */
const MODEL_APIS = [
  "openai-completions",
  "openai-responses",
  "openai-chatgpt-responses",
  "anthropic-messages",
  "google-generative-ai",
  "google-vertex",
  "github-copilot",
  "bedrock-converse-stream",
  "ollama",
  "azure-openai-responses",
];
/** Thinking/reasoning payload dialects emitted by OpenAI-compatible providers. */
const MODEL_THINKING_FORMATS = [
  "openai",
  "openrouter",
  "deepseek",
  "together",
  "qwen",
  "qwen-chat-template",
  "zai",
];
/** Runtime guard for config-provided thinking format strings. */
function isModelThinkingFormat(value) {
  return isStringOption(value, MODEL_THINKING_FORMATS);
}
//#endregion
export { MODEL_THINKING_FORMATS as n, isModelThinkingFormat as r, MODEL_APIS as t };
