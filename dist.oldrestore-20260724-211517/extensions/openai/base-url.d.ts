//#region extensions/openai/base-url.d.ts
declare const OPENAI_CODEX_RESPONSES_BASE_URL = "https://chatgpt.com/backend-api/codex";
declare const OPENAI_API_BASE_URL = "https://api.openai.com/v1";
type OpenAIEndpointKind = "unresolved" | "platform" | "chatgpt" | "custom" | "invalid";
/** Classifies exact native endpoints, valid custom URLs, and unsafe/invalid input. */
declare function classifyOpenAIBaseUrl(baseUrl: unknown): OpenAIEndpointKind;
declare function resolveOpenAIDefaultBaseUrl(env?: Record<string, string | undefined>): string;
declare function isOpenAIApiBaseUrl(baseUrl?: string): boolean;
declare function isOpenAICodexBaseUrl(baseUrl?: string): boolean;
/** True only for an HTTPS OpenAI Platform endpoint eligible for native transport hooks. */
declare function isOpenAIHttpsApiBaseUrl(baseUrl?: string): boolean;
declare function canonicalizeCodexResponsesBaseUrl(baseUrl?: string): string | undefined;
//#endregion
export {
  OPENAI_API_BASE_URL,
  OPENAI_CODEX_RESPONSES_BASE_URL,
  canonicalizeCodexResponsesBaseUrl,
  classifyOpenAIBaseUrl,
  isOpenAIApiBaseUrl,
  isOpenAICodexBaseUrl,
  isOpenAIHttpsApiBaseUrl,
  resolveOpenAIDefaultBaseUrl,
};
