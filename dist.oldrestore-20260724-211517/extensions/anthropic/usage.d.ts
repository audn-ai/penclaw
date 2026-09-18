import {
  Yt as ProviderResolveUsageAuthContext,
  Zt as ProviderResolvedUsageAuth,
  kt as ProviderFetchUsageSnapshotContext,
} from "../../plugin-entry-DPCR66aO.js";
import { o as ProviderUsageSnapshot } from "../../provider-usage.types-CSw7pG9h.js";

//#region extensions/anthropic/usage.d.ts
declare function fetchAnthropicAdminUsage(params: {
  apiKey: string;
  timeoutMs: number;
  fetchFn: typeof fetch;
  now?: number;
  periodDays?: number;
}): Promise<ProviderUsageSnapshot>;
declare function resolveAnthropicUsageAuth(
  ctx: ProviderResolveUsageAuthContext,
): Promise<ProviderResolvedUsageAuth>;
/** Formats keychain plan metadata like ("max", "default_max_20x") as "Max (20x)". */
declare function formatClaudePlanLabel(
  subscriptionType?: string,
  rateLimitTier?: string,
): string | undefined;
declare function fetchAnthropicUsage(
  ctx: ProviderFetchUsageSnapshotContext,
): Promise<ProviderUsageSnapshot>;
//#endregion
export {
  fetchAnthropicAdminUsage,
  fetchAnthropicUsage,
  formatClaudePlanLabel,
  resolveAnthropicUsageAuth,
};
