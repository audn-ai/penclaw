import { t as expectDefined } from "./expect-CyE8FADM.js";
import { t as modelKey } from "./model-key-BaNhQShd.js";
import "./src-Bl7G9qvi.js";
import {
  d as isModelKeyAllowedBySet,
  x as resolveModelRefFromString,
} from "./model-selection-shared-BliwFXJy.js";
import { r as normalizeProviderId } from "./provider-id-BIcU_2-A.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import "./model-ref-shared-Bs7ONe2Q.js";
//#region src/auto-reply/reply/model-selection-directive.ts
function formatAddModelCommand(modelRef) {
  return `openclaw config set agents.defaults.models '${JSON.stringify({ [modelRef]: {} })}' --strict-json --merge`;
}
function formatNotAllowedError(params) {
  const rawRuntime = params.rawRuntime?.trim();
  const retryCommand = rawRuntime
    ? `/model ${params.modelRef} --runtime ${rawRuntime}`
    : `/model ${params.modelRef}`;
  const lines = [
    `Model "${params.modelRef}" is not allowed. Use /models to list providers, or /models <provider> to list models.`,
    `Add it with: ${formatAddModelCommand(params.modelRef)}`,
    `Then retry: ${retryCommand}`,
  ];
  if (rawRuntime && normalizeProviderId(rawRuntime) === "codex")
    lines.push("If the Codex runtime is missing, run: openclaw plugins enable codex");
  return lines.join("\n");
}
const FUZZY_VARIANT_TOKENS = [
  "lightning",
  "preview",
  "mini",
  "fast",
  "turbo",
  "lite",
  "beta",
  "small",
  "nano",
];
/** Resolves an explicit model directive string into a provider/model ref. */
function resolveModelRefFromDirectiveString(params) {
  return resolveModelRefFromString(params);
}
function boundedLevenshteinDistance(a, b, maxDistance) {
  if (a === b) return 0;
  if (!a || !b) return null;
  const aLen = a.length;
  const bLen = b.length;
  if (Math.abs(aLen - bLen) > maxDistance) return null;
  const prev = new Uint32Array(bLen + 1);
  const curr = new Uint32Array(bLen + 1);
  for (let index = 0; index <= bLen; index += 1) prev[index] = index;
  for (let i = 1; i <= aLen; i++) {
    curr[0] = i;
    let rowMin = expectDefined(curr[0], "curr entry at 0");
    const aChar = a.charCodeAt(i - 1);
    for (let j = 1; j <= bLen; j++) {
      const cost = aChar === b.charCodeAt(j - 1) ? 0 : 1;
      const distance = Math.min(
        expectDefined(prev[j], "prev entry at j") + 1,
        expectDefined(curr[j - 1], "curr entry at j 1") + 1,
        expectDefined(prev[j - 1], "prev entry at j 1") + cost,
      );
      curr[j] = distance;
      if (distance < rowMin) rowMin = distance;
    }
    if (rowMin > maxDistance) return null;
    for (let j = 0; j <= bLen; j++)
      prev[j] = expectDefined(curr[j], "model selection directive edit-distance row");
  }
  const dist = expectDefined(prev[bLen], "prev entry at b len");
  if (dist > maxDistance) return null;
  return dist;
}
function scoreFuzzyMatch(params) {
  const provider = normalizeProviderId(params.provider);
  const model = params.model;
  const fragment = normalizeLowercaseStringOrEmpty(params.fragment);
  const providerLower = normalizeLowercaseStringOrEmpty(provider);
  const modelLower = normalizeLowercaseStringOrEmpty(model);
  const haystack = `${providerLower}/${modelLower}`;
  const key = modelKey(provider, model);
  const scoreFragment = (value, weights) => {
    if (!fragment) return 0;
    let score = 0;
    if (value === fragment) score = Math.max(score, weights.exact);
    if (value.startsWith(fragment)) score = Math.max(score, weights.starts);
    if (value.includes(fragment)) score = Math.max(score, weights.includes);
    return score;
  };
  let score = 0;
  score += scoreFragment(haystack, {
    exact: 220,
    starts: 140,
    includes: 110,
  });
  score += scoreFragment(providerLower, {
    exact: 180,
    starts: 120,
    includes: 90,
  });
  score += scoreFragment(modelLower, {
    exact: 160,
    starts: 110,
    includes: 80,
  });
  const distModel = boundedLevenshteinDistance(fragment, modelLower, 3);
  if (distModel != null) score += (3 - distModel) * 70;
  const aliases = params.aliasIndex.byKey.get(key) ?? [];
  for (const alias of aliases)
    score += scoreFragment(normalizeLowercaseStringOrEmpty(alias), {
      exact: 140,
      starts: 90,
      includes: 60,
    });
  if (modelLower.startsWith(providerLower)) score += 30;
  const fragmentVariants = FUZZY_VARIANT_TOKENS.filter((token) => fragment.includes(token));
  const modelVariants = FUZZY_VARIANT_TOKENS.filter((token) => modelLower.includes(token));
  const variantMatchCount = fragmentVariants.filter((token) => modelLower.includes(token)).length;
  const variantCount = modelVariants.length;
  if (fragmentVariants.length === 0 && variantCount > 0) score -= variantCount * 30;
  else if (fragmentVariants.length > 0) {
    if (variantMatchCount > 0) score += variantMatchCount * 40;
    if (variantMatchCount === 0) score -= 20;
  }
  const isDefault =
    provider === normalizeProviderId(params.defaultProvider) && model === params.defaultModel;
  if (isDefault) score += 20;
  return {
    score,
    isDefault,
    variantCount,
    variantMatchCount,
    modelLength: modelLower.length,
    key,
  };
}
/** Resolves a `/model` directive into an allowlisted model selection or error. */
function resolveModelDirectiveSelection(params) {
  const { raw, defaultProvider, defaultModel, aliasIndex, allowedModelKeys } = params;
  const rawTrimmed = raw.trim();
  const rawLower = normalizeLowercaseStringOrEmpty(rawTrimmed);
  const pickAliasForKey = (provider, model) => aliasIndex.byKey.get(modelKey(provider, model))?.[0];
  const buildSelection = (provider, model) => {
    const alias = pickAliasForKey(provider, model);
    return {
      provider,
      model,
      isDefault: provider === defaultProvider && model === defaultModel,
      ...(alias ? { alias } : void 0),
    };
  };
  const resolveFuzzy = (paramsLocal) => {
    const fragment = normalizeLowercaseStringOrEmpty(paramsLocal.fragment);
    if (!fragment) return {};
    const providerFilter = paramsLocal.provider
      ? normalizeProviderId(paramsLocal.provider)
      : void 0;
    const candidates = [];
    for (const key of allowedModelKeys) {
      const slash = key.indexOf("/");
      if (slash <= 0) continue;
      const provider = normalizeProviderId(key.slice(0, slash));
      const model = key.slice(slash + 1);
      if (model === "*") continue;
      if (providerFilter && provider !== providerFilter) continue;
      candidates.push({
        provider,
        model,
      });
    }
    if (!paramsLocal.provider) {
      const aliasMatches = [];
      for (const [aliasKey, entry] of aliasIndex.byAlias.entries()) {
        if (!aliasKey.includes(fragment)) continue;
        aliasMatches.push({
          provider: entry.ref.provider,
          model: entry.ref.model,
        });
      }
      for (const match of aliasMatches) {
        const key = modelKey(match.provider, match.model);
        if (!isModelKeyAllowedBySet(allowedModelKeys, key)) continue;
        if (!candidates.some((c) => c.provider === match.provider && c.model === match.model))
          candidates.push(match);
      }
    }
    if (candidates.length === 0) return {};
    const bestScored = candidates
      .map((candidate) => {
        const details = scoreFuzzyMatch({
          provider: candidate.provider,
          model: candidate.model,
          fragment,
          aliasIndex,
          defaultProvider,
          defaultModel,
        });
        return Object.assign({ candidate }, details);
      })
      .toSorted((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if (a.isDefault !== b.isDefault) return a.isDefault ? -1 : 1;
        if (a.variantMatchCount !== b.variantMatchCount)
          return b.variantMatchCount - a.variantMatchCount;
        if (a.variantCount !== b.variantCount) return a.variantCount - b.variantCount;
        if (a.modelLength !== b.modelLength) return a.modelLength - b.modelLength;
        return a.key.localeCompare(b.key);
      })[0];
    const best = bestScored?.candidate;
    if (!best || !bestScored) return {};
    const minScore = providerFilter ? 90 : 120;
    if (bestScored.score < minScore) return {};
    return { selection: buildSelection(best.provider, best.model) };
  };
  const resolved = resolveModelRefFromDirectiveString({
    raw: rawTrimmed,
    defaultProvider,
    aliasIndex,
  });
  if (!resolved) {
    const fuzzy = resolveFuzzy({ fragment: rawTrimmed });
    if (fuzzy.selection || fuzzy.error) return fuzzy;
    return {
      error: `Unrecognized model "${rawTrimmed}". Use /models to list providers, or /models <provider> to list models.`,
    };
  }
  const resolvedKey = modelKey(resolved.ref.provider, resolved.ref.model);
  if (allowedModelKeys.size === 0 || isModelKeyAllowedBySet(allowedModelKeys, resolvedKey))
    return {
      selection: {
        provider: resolved.ref.provider,
        model: resolved.ref.model,
        isDefault: resolved.ref.provider === defaultProvider && resolved.ref.model === defaultModel,
        alias: resolved.alias,
      },
    };
  if (rawLower.includes("/")) {
    const slash = rawTrimmed.indexOf("/");
    const fuzzy = resolveFuzzy({
      provider: normalizeProviderId(rawTrimmed.slice(0, slash).trim()),
      fragment: rawTrimmed.slice(slash + 1).trim(),
    });
    if (fuzzy.selection || fuzzy.error) return fuzzy;
  }
  const fuzzy = resolveFuzzy({ fragment: rawTrimmed });
  if (fuzzy.selection || fuzzy.error) return fuzzy;
  return {
    error: formatNotAllowedError({
      modelRef: `${resolved.ref.provider}/${resolved.ref.model}`,
      rawRuntime: params.rawRuntime,
    }),
  };
}
//#endregion
export { resolveModelRefFromDirectiveString as n, resolveModelDirectiveSelection as t };
