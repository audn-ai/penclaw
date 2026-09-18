import { r as normalizeProviderId } from "./provider-id-BIcU_2-A.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
//#region src/agents/provider-tool-policy.ts
function normalizeToolProviderPolicyKey(value) {
  const normalized = normalizeLowercaseStringOrEmpty(value);
  const slashIndex = normalized.indexOf("/");
  if (slashIndex <= 0) return normalizeProviderId(normalized);
  const provider = normalizeProviderId(normalized.slice(0, slashIndex));
  const modelId = normalized.slice(slashIndex + 1);
  return modelId ? `${provider}/${modelId}` : provider;
}
function isCanonicalToolProviderPolicyKey(value) {
  return normalizeLowercaseStringOrEmpty(value) === normalizeToolProviderPolicyKey(value);
}
function resolveProviderToolPolicyEntry(params) {
  const provider = params.modelProvider?.trim();
  if (!provider || !params.byProvider) return;
  const lookup = /* @__PURE__ */ new Map();
  for (const [key, value] of Object.entries(params.byProvider)) {
    if (!isRecord(value)) continue;
    const normalized = normalizeToolProviderPolicyKey(key);
    if (!normalized) continue;
    const canonical = isCanonicalToolProviderPolicyKey(key);
    const existing = lookup.get(normalized);
    if (!existing || (canonical && !existing.canonical))
      lookup.set(normalized, {
        key,
        policy: value,
        canonical,
      });
  }
  const normalizedProvider = normalizeToolProviderPolicyKey(provider);
  const rawModelId = normalizeOptionalLowercaseString(params.modelId);
  const fullModelId = rawModelId ? `${normalizedProvider}/${rawModelId}` : void 0;
  const candidates = [...(fullModelId ? [fullModelId] : []), normalizedProvider];
  for (const key of candidates) {
    const match = lookup.get(key);
    if (match)
      return {
        key: match.key,
        policy: match.policy,
      };
  }
}
function resolveProviderToolPolicy(params) {
  return resolveProviderToolPolicyEntry(params)?.policy;
}
//#endregion
export {
  resolveProviderToolPolicyEntry as i,
  normalizeToolProviderPolicyKey as n,
  resolveProviderToolPolicy as r,
  isCanonicalToolProviderPolicyKey as t,
};
