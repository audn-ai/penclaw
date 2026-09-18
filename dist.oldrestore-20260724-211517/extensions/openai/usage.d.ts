import {
  Yt as ProviderResolveUsageAuthContext,
  Zt as ProviderResolvedUsageAuth,
  kt as ProviderFetchUsageSnapshotContext,
} from "../../plugin-entry-DPCR66aO.js";
import { o as ProviderUsageSnapshot } from "../../provider-usage.types-CSw7pG9h.js";

//#region extensions/openai/usage.d.ts
declare function fetchOpenAIAdminUsage(params: {
  apiKey: string;
  projectId?: string;
  timeoutMs: number;
  fetchFn: typeof fetch;
  now?: number;
  periodDays?: number;
}): Promise<ProviderUsageSnapshot>;
declare function resolveOpenAIUsageAuth(
  ctx: ProviderResolveUsageAuthContext,
): Promise<ProviderResolvedUsageAuth>;
declare function fetchOpenAIUsage(
  ctx: ProviderFetchUsageSnapshotContext,
): Promise<ProviderUsageSnapshot>;
//#endregion
export { fetchOpenAIAdminUsage, fetchOpenAIUsage, resolveOpenAIUsageAuth };
