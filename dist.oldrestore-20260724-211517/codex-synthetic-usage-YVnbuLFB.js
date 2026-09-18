import { t as CODEX_APP_SERVER_AUTH_MARKER } from "./model-auth-markers-CA2Xy59Z.js";
import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
//#region src/status/codex-synthetic-usage.ts
const CODEX_SYNTHETIC_USAGE_PROVIDER = "openai";
const CODEX_SYNTHETIC_USAGE_HOOK_PROVIDER = "codex";
/** Maps a provider auth label onto the usage credential type buckets. */
function resolveUsageCredentialType(authLabel) {
  const auth = normalizeOptionalLowercaseString(authLabel);
  if (!auth) return;
  if (auth.startsWith("oauth")) return "oauth";
  if (auth.startsWith("token")) return "token";
  if (auth.startsWith("api-key") || auth.startsWith("api key")) return "api_key";
}
function buildCodexSyntheticUsageAuth(params = {}) {
  return {
    provider: CODEX_SYNTHETIC_USAGE_PROVIDER,
    token: CODEX_APP_SERVER_AUTH_MARKER,
    ...(params.authProfileId ? { authProfileId: params.authProfileId } : {}),
    hookProvider: CODEX_SYNTHETIC_USAGE_HOOK_PROVIDER,
  };
}
function shouldUseCodexSyntheticUsageForRuntime(params) {
  const harness = normalizeOptionalLowercaseString(params.effectiveHarness);
  const provider = normalizeOptionalLowercaseString(params.provider);
  return (
    harness === CODEX_SYNTHETIC_USAGE_HOOK_PROVIDER &&
    (provider === CODEX_SYNTHETIC_USAGE_PROVIDER || provider === "codex")
  );
}
function hasDisplayableUsageSnapshot(snapshot) {
  return (
    snapshot.windows.length > 0 ||
    Boolean(snapshot.billing?.length) ||
    Boolean(snapshot.summary?.trim())
  );
}
function usageSnapshotRank(snapshot) {
  if (hasDisplayableUsageSnapshot(snapshot)) return 2;
  return snapshot.error ? 0 : 1;
}
function billingEntryKey(entry) {
  const period = "period" in entry ? (entry.period ?? "") : "";
  return [entry.type, entry.label ?? "", entry.unit, period].join("\0");
}
function mergeBilling(preferred, secondary) {
  const entries = /* @__PURE__ */ new Map();
  for (const entry of secondary.billing ?? []) entries.set(billingEntryKey(entry), entry);
  for (const entry of preferred.billing ?? []) entries.set(billingEntryKey(entry), entry);
  return entries.size > 0 ? [...entries.values()] : void 0;
}
function mergeUsageSnapshots(preferred, secondary) {
  const billing = mergeBilling(preferred, secondary);
  return {
    ...secondary,
    ...preferred,
    windows: preferred.windows.length > 0 ? preferred.windows : secondary.windows,
    ...(billing ? { billing } : {}),
    ...(preferred.summary?.trim()
      ? { summary: preferred.summary }
      : secondary.summary?.trim()
        ? { summary: secondary.summary }
        : {}),
    ...(preferred.plan?.trim()
      ? { plan: preferred.plan }
      : secondary.plan?.trim()
        ? { plan: secondary.plan }
        : {}),
    ...(!preferred.error ? { error: void 0 } : {}),
  };
}
function mergeUsageSummaries(base, extra) {
  if (!extra || extra.providers.length === 0) return base;
  const providersById = new Map(base.providers.map((provider) => [provider.provider, provider]));
  for (const provider of extra.providers) {
    const existing = providersById.get(provider.provider);
    if (!existing) {
      providersById.set(provider.provider, provider);
      continue;
    }
    const providerRank = usageSnapshotRank(provider);
    const existingRank = usageSnapshotRank(existing);
    const preferred =
      providerRank === 0 && existingRank === 0
        ? existing
        : providerRank >= existingRank
          ? provider
          : existing;
    const secondary = preferred === provider ? existing : provider;
    providersById.set(provider.provider, mergeUsageSnapshots(preferred, secondary));
  }
  return {
    updatedAt: base.updatedAt,
    providers: [...providersById.values()],
  };
}
//#endregion
export {
  shouldUseCodexSyntheticUsageForRuntime as i,
  mergeUsageSummaries as n,
  resolveUsageCredentialType as r,
  buildCodexSyntheticUsageAuth as t,
};
