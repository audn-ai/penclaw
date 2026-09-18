//#region src/infra/provider-usage.types.d.ts
/** One quota window reported by a provider usage endpoint. */
type UsageWindow = {
  label: string;
  usedPercent: number;
  resetAt?: number;
};
/** Provider-reported monetary or credit facts. Units may be ISO currencies or provider credits. */
type ProviderUsageBilling =
  | {
      type: "balance";
      label?: string;
      amount: number;
      unit: string;
    }
  | {
      type: "spend";
      label?: string;
      amount: number;
      unit: string;
      period?: string;
      resetAt?: number;
    }
  | {
      type: "budget";
      label?: string;
      used: number;
      limit: number;
      unit: string;
      period?: string;
      resetAt?: number;
    };
/** Provider-reported daily cost and token totals. Costs are actual provider billing, not estimates. */
type ProviderUsageCostDaily = {
  date: string;
  amount: number;
  requests?: number;
  inputTokens: number;
  cacheReadTokens: number;
  cacheWriteTokens: number;
  outputTokens: number;
  totalTokens: number;
};
/** Aggregate model activity for the provider history window. */
type ProviderUsageModelBreakdown = {
  name: string;
  requests?: number;
  inputTokens: number;
  cacheReadTokens: number;
  cacheWriteTokens: number;
  outputTokens: number;
  totalTokens: number;
};
/** Aggregate provider billing category for the history window. */
type ProviderUsageCostBreakdown = {
  name: string;
  amount: number;
};
/** Provider-reported cost history and attribution for one bounded UTC window. */
type ProviderUsageCostHistory = {
  unit: string;
  periodDays: number;
  scope?: string;
  daily: ProviderUsageCostDaily[];
  models: ProviderUsageModelBreakdown[];
  categories: ProviderUsageCostBreakdown[];
};
type ProviderUsageSnapshot = {
  provider: UsageProviderId;
  displayName: string;
  windows: UsageWindow[];
  billing?: ProviderUsageBilling[];
  costHistory?: ProviderUsageCostHistory;
  summary?: string;
  plan?: string /** Account identity (email) the usage was fetched under, when known. */;
  accountEmail?: string;
  error?: string;
};
/** Normalized provider id. Usage providers are discovered from plugin hooks at runtime. */
type UsageProviderId = string;
//#endregion
export {
  ProviderUsageModelBreakdown as a,
  UsageWindow as c,
  ProviderUsageCostHistory as i,
  ProviderUsageCostBreakdown as n,
  ProviderUsageSnapshot as o,
  ProviderUsageCostDaily as r,
  UsageProviderId as s,
  ProviderUsageBilling as t,
};
