import { n as OPENAI_CODEX_RESPONSES_BASE_URL } from "./base-url-Cx2NFKoL.js";
//#region extensions/openai/openai-chatgpt-catalog.ts
const OPENAI_CODEX_BASE_URL = OPENAI_CODEX_RESPONSES_BASE_URL;
function buildOpenAICodexProvider() {
  return {
    baseUrl: OPENAI_CODEX_BASE_URL,
    api: "openai-chatgpt-responses",
    models: [],
  };
}
//#endregion
export { buildOpenAICodexProvider as t };
