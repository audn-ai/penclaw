import {
  o as ProviderUsageSnapshot,
  s as UsageProviderId,
} from "./provider-usage.types-CSw7pG9h.js";

//#region src/infra/provider-usage.fetch.claude.d.ts
declare function fetchClaudeUsage(
  token: string,
  timeoutMs: number,
  fetchFn: typeof fetch,
): Promise<ProviderUsageSnapshot>;
//#endregion
//#region src/infra/provider-usage.fetch.codex.d.ts
declare function fetchCodexUsage(
  token: string,
  accountId: string | undefined,
  timeoutMs: number,
  fetchFn: typeof fetch,
): Promise<ProviderUsageSnapshot>;
//#endregion
//#region src/infra/provider-usage.fetch.deepseek.d.ts
declare function fetchDeepSeekUsage(
  apiKey: string,
  timeoutMs: number,
  fetchFn: typeof fetch,
): Promise<ProviderUsageSnapshot>;
//#endregion
//#region src/infra/provider-usage.fetch.gemini.d.ts
declare function fetchGeminiUsage(
  token: string,
  timeoutMs: number,
  fetchFn: typeof fetch,
  provider: UsageProviderId,
): Promise<ProviderUsageSnapshot>;
//#endregion
//#region src/infra/provider-usage.fetch.minimax.d.ts
type FetchMinimaxUsageOptions = {
  baseUrl?: string;
};
declare function fetchMinimaxUsage(
  apiKey: string,
  timeoutMs: number,
  fetchFn: typeof fetch,
  options?: FetchMinimaxUsageOptions,
): Promise<ProviderUsageSnapshot>;
//#endregion
//#region src/infra/provider-usage.fetch.zai.d.ts
declare function fetchZaiUsage(
  apiKey: string,
  timeoutMs: number,
  fetchFn: typeof fetch,
): Promise<ProviderUsageSnapshot>;
//#endregion
//#region src/infra/provider-usage.shared.d.ts
declare const PROVIDER_LABELS: {
  readonly anthropic: "Claude";
  readonly clawrouter: "ClawRouter";
  readonly deepseek: "DeepSeek";
  readonly "github-copilot": "Copilot";
  readonly "google-gemini-cli": "Gemini";
  readonly minimax: "MiniMax";
  readonly openai: "OpenAI";
  readonly openrouter: "OpenRouter";
  readonly venice: "Venice";
  readonly xiaomi: "Xiaomi";
  readonly "xiaomi-token-plan": "Xiaomi Token Plan";
  readonly zai: "z.ai";
};
declare const clampPercent: (value: number) => number;
//#endregion
//#region src/infra/provider-usage.fetch.shared.d.ts
/** Fetches JSON-compatible provider usage endpoints with an abort timeout. */
declare function fetchJson(
  url: string,
  init: RequestInit,
  timeoutMs: number,
  fetchFn: typeof fetch,
): Promise<Response>;
type BuildUsageHttpErrorSnapshotOptions = {
  provider: UsageProviderId;
  status: number;
  message?: string;
  tokenExpiredStatuses?: readonly number[];
};
/** Builds a provider usage snapshot for non-HTTP fetch or parse failures. */
declare function buildUsageErrorSnapshot(
  provider: UsageProviderId,
  error: string,
): ProviderUsageSnapshot;
declare function buildUsageHttpErrorSnapshot(
  options: BuildUsageHttpErrorSnapshotOptions,
): ProviderUsageSnapshot;
//#endregion
export {
  clampPercent as a,
  fetchGeminiUsage as c,
  fetchClaudeUsage as d,
  PROVIDER_LABELS as i,
  fetchDeepSeekUsage as l,
  buildUsageHttpErrorSnapshot as n,
  fetchZaiUsage as o,
  fetchJson as r,
  fetchMinimaxUsage as s,
  buildUsageErrorSnapshot as t,
  fetchCodexUsage as u,
};
