import { o as ProviderUsageSnapshot } from "./provider-usage.types-CSw7pG9h.js";

//#region extensions/github-copilot/usage.d.ts
declare function fetchCopilotUsage(
  token: string,
  timeoutMs: number,
  fetchFn: typeof fetch,
  githubDomain?: string,
): Promise<ProviderUsageSnapshot>;
//#endregion
export { fetchCopilotUsage as t };
