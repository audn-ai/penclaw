import { a as fetchWithSsrFGuard } from "../../fetch-guard-BKvfwdRa.js";
import { o as ProviderUsageSnapshot } from "../../provider-usage.types-CSw7pG9h.js";
//#region extensions/clawrouter/usage.d.ts
type ClawRouterUsageFetchGuard = typeof fetchWithSsrFGuard;
declare function fetchClawRouterUsage(params: {
  token: string;
  baseUrl?: string;
  timeoutMs: number /** Test-only seam; production keeps the shared SSRF guard owning transport. */;
  fetchGuard?: ClawRouterUsageFetchGuard;
}): Promise<ProviderUsageSnapshot>;
//#endregion
export { ClawRouterUsageFetchGuard, fetchClawRouterUsage };
