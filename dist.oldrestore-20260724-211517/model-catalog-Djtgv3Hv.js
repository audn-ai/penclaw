import { t as parseClawHubPluginSpec } from "./clawhub-spec-CzLwxQg_.js";
import {
  n as normalizeModelCatalogProviderRows,
  t as normalizeModelCatalog,
} from "./model-catalog-normalize-Ji73MOA0.js";
import { r as normalizeModelCatalogProviderId } from "./model-catalog-refs-BcuK-xC3.js";
import { s as parseRegistryNpmSpec } from "./npm-registry-spec-CqBTTiC9.js";
import "./utils-DtcDeqWS.js";
import { s as asFiniteNumber } from "./number-coercion-CJQ8TR--.js";
import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { h as normalizeUniqueTrimmedStringList } from "./string-normalization-CRyoFBPt.js";
import "./manifest-planner-DSmSdykb.js";
//#region src/model-catalog/provider-index/normalize.ts
const OPENCLAW_PROVIDER_INDEX_VERSION = 1;
function normalizeSafeKey(value) {
  const key = normalizeOptionalString(value) ?? "";
  return key && !isBlockedObjectKey(key) ? key : "";
}
function normalizeInstall(value) {
  if (!isRecord(value)) return;
  const clawhubSpec = normalizeOptionalString(value.clawhubSpec);
  const parsedClawHub = clawhubSpec ? parseClawHubPluginSpec(clawhubSpec) : null;
  const npmSpec = normalizeOptionalString(value.npmSpec);
  const parsedNpm = npmSpec ? parseRegistryNpmSpec(npmSpec) : null;
  if (!parsedClawHub && !parsedNpm) return;
  const defaultChoice =
    value.defaultChoice === "clawhub" && parsedClawHub
      ? "clawhub"
      : value.defaultChoice === "npm" && parsedNpm
        ? "npm"
        : void 0;
  const minHostVersion = normalizeOptionalString(value.minHostVersion);
  const expectedIntegrity = normalizeOptionalString(value.expectedIntegrity);
  return {
    ...(parsedClawHub ? { clawhubSpec } : {}),
    ...(parsedNpm ? { npmSpec: parsedNpm.raw } : {}),
    ...(defaultChoice ? { defaultChoice } : {}),
    ...(minHostVersion ? { minHostVersion } : {}),
    ...(expectedIntegrity ? { expectedIntegrity } : {}),
  };
}
function normalizePlugin(value) {
  if (!isRecord(value)) return;
  const id = normalizeSafeKey(value.id);
  if (!id) return;
  const packageName = normalizeOptionalString(value.package) ?? "";
  const source = normalizeOptionalString(value.source) ?? "";
  const install = normalizeInstall(value.install);
  return {
    id,
    ...(packageName ? { package: packageName } : {}),
    ...(source ? { source } : {}),
    ...(install ? { install } : {}),
  };
}
function normalizeCategories(value) {
  return normalizeUniqueTrimmedStringList(value);
}
function normalizePreviewCatalog(params) {
  const provider = normalizeModelCatalog(
    { providers: { [params.providerId]: params.value } },
    { ownedProviders: /* @__PURE__ */ new Set([params.providerId]) },
  )?.providers?.[params.providerId];
  if (!provider) return;
  for (const model of provider.models) model.status ??= "preview";
  return provider;
}
function normalizeOnboardingScopes(value) {
  const scopes = normalizeUniqueTrimmedStringList(value).filter(
    (scope) =>
      scope === "text-inference" || scope === "image-generation" || scope === "music-generation",
  );
  return scopes.length > 0 ? scopes : void 0;
}
function normalizeAssistantVisibility(value) {
  return value === "visible" || value === "manual-only" ? value : void 0;
}
function normalizeAuthChoice(params) {
  if (!isRecord(params.value)) return;
  const method = normalizeSafeKey(params.value.method);
  const choiceId = normalizeSafeKey(params.value.choiceId);
  const choiceLabel = normalizeOptionalString(params.value.choiceLabel) ?? "";
  if (!method || !choiceId || !choiceLabel) return;
  const choiceHint = normalizeOptionalString(params.value.choiceHint);
  const groupId = normalizeSafeKey(params.value.groupId) || params.providerId;
  const groupLabel = normalizeOptionalString(params.value.groupLabel) ?? params.providerName;
  const groupHint = normalizeOptionalString(params.value.groupHint);
  const optionKey = normalizeSafeKey(params.value.optionKey);
  const cliFlag = normalizeOptionalString(params.value.cliFlag);
  const cliOption = normalizeOptionalString(params.value.cliOption);
  const cliDescription = normalizeOptionalString(params.value.cliDescription);
  const assistantPriority = asFiniteNumber(params.value.assistantPriority);
  const assistantVisibility = normalizeAssistantVisibility(params.value.assistantVisibility);
  const onboardingScopes = normalizeOnboardingScopes(params.value.onboardingScopes);
  return {
    method,
    choiceId,
    choiceLabel,
    ...(choiceHint ? { choiceHint } : {}),
    ...(assistantPriority !== void 0 ? { assistantPriority } : {}),
    ...(assistantVisibility ? { assistantVisibility } : {}),
    ...(groupId ? { groupId } : {}),
    ...(groupLabel ? { groupLabel } : {}),
    ...(groupHint ? { groupHint } : {}),
    ...(optionKey ? { optionKey } : {}),
    ...(cliFlag ? { cliFlag } : {}),
    ...(cliOption ? { cliOption } : {}),
    ...(cliDescription ? { cliDescription } : {}),
    ...(onboardingScopes ? { onboardingScopes } : {}),
  };
}
function normalizeAuthChoices(params) {
  if (!Array.isArray(params.value)) return;
  const choices = params.value
    .map((value) =>
      normalizeAuthChoice({
        ...params,
        value,
      }),
    )
    .filter((choice) => Boolean(choice));
  return choices.length > 0 ? choices : void 0;
}
function normalizeProvider(rawProviderId, value) {
  if (!isRecord(value)) return;
  const providerId = normalizeModelCatalogProviderId(rawProviderId);
  if (!providerId) return;
  const id = normalizeModelCatalogProviderId(normalizeOptionalString(value.id) ?? "");
  if (id && id !== providerId) return;
  const name = normalizeOptionalString(value.name) ?? "";
  const plugin = normalizePlugin(value.plugin);
  if (!name || !plugin) return;
  const docs = normalizeOptionalString(value.docs) ?? "";
  const categories = normalizeCategories(value.categories);
  const authChoices = normalizeAuthChoices({
    providerId,
    providerName: name,
    value: value.authChoices,
  });
  const previewCatalog = normalizePreviewCatalog({
    providerId,
    value: value.previewCatalog,
  });
  return {
    id: providerId,
    name,
    plugin,
    ...(docs ? { docs } : {}),
    ...(categories.length > 0 ? { categories } : {}),
    ...(authChoices ? { authChoices } : {}),
    ...(previewCatalog ? { previewCatalog } : {}),
  };
}
function normalizeOpenClawProviderIndex(value) {
  if (!isRecord(value) || value.version !== OPENCLAW_PROVIDER_INDEX_VERSION) return;
  if (!isRecord(value.providers)) return;
  const providers = {};
  for (const [rawProviderId, rawProvider] of Object.entries(value.providers)) {
    const providerId = normalizeModelCatalogProviderId(rawProviderId);
    if (!providerId || isBlockedObjectKey(providerId)) continue;
    const provider = normalizeProvider(providerId, rawProvider);
    if (provider) providers[providerId] = provider;
  }
  return {
    version: OPENCLAW_PROVIDER_INDEX_VERSION,
    providers: Object.fromEntries(
      Object.entries(providers).toSorted(([left], [right]) => left.localeCompare(right)),
    ),
  };
}
//#endregion
//#region src/model-catalog/provider-index/openclaw-provider-index.ts
const OPENCLAW_PROVIDER_INDEX = {
  version: 1,
  providers: {
    moonshot: {
      id: "moonshot",
      name: "Moonshot AI",
      plugin: { id: "moonshot" },
      docs: "/providers/moonshot",
      categories: ["cloud", "llm"],
      previewCatalog: {
        models: [
          {
            id: "kimi-k2.6",
            name: "Kimi K2.6",
            input: ["text", "image"],
            contextWindow: 262144,
          },
          {
            id: "kimi-k2.7-code",
            name: "Kimi K2.7 Code",
            reasoning: true,
            input: ["text", "image"],
            contextWindow: 262144,
          },
        ],
      },
    },
    deepseek: {
      id: "deepseek",
      name: "DeepSeek",
      plugin: { id: "deepseek" },
      docs: "/providers/deepseek",
      categories: ["cloud", "llm"],
      previewCatalog: {
        models: [
          {
            id: "deepseek-v4-flash",
            name: "DeepSeek V4 Flash",
            input: ["text"],
            reasoning: true,
            contextWindow: 1e6,
          },
          {
            id: "deepseek-v4-pro",
            name: "DeepSeek V4 Pro",
            input: ["text"],
            reasoning: true,
            contextWindow: 1e6,
          },
          {
            id: "deepseek-chat",
            name: "DeepSeek Chat",
            input: ["text"],
            contextWindow: 1e6,
          },
          {
            id: "deepseek-reasoner",
            name: "DeepSeek Reasoner",
            input: ["text"],
            reasoning: true,
            contextWindow: 1e6,
          },
        ],
      },
    },
  },
};
//#endregion
//#region src/model-catalog/provider-index/load.ts
function loadOpenClawProviderIndex(source = OPENCLAW_PROVIDER_INDEX) {
  return (
    normalizeOpenClawProviderIndex(source) ?? {
      version: 1,
      providers: {},
    }
  );
}
//#endregion
//#region src/model-catalog/provider-index-planner.ts
function withPreviewStatusDefaults(providerCatalog) {
  return {
    ...providerCatalog,
    models: providerCatalog.models.map((model) => ({
      ...model,
      status: model.status ?? "preview",
    })),
  };
}
function planProviderIndexModelCatalogRows(params) {
  const providerFilter = params.providerFilter
    ? normalizeModelCatalogProviderId(params.providerFilter)
    : void 0;
  const entries = [];
  for (const [providerId, provider] of Object.entries(params.index.providers)) {
    const normalizedProvider = normalizeModelCatalogProviderId(providerId);
    if (
      !normalizedProvider ||
      (providerFilter && normalizedProvider !== providerFilter) ||
      !provider.previewCatalog
    )
      continue;
    const rows = normalizeModelCatalogProviderRows({
      provider: normalizedProvider,
      providerCatalog: withPreviewStatusDefaults(provider.previewCatalog),
      source: "provider-index",
    });
    if (rows.length === 0) continue;
    entries.push({
      provider: normalizedProvider,
      pluginId: provider.plugin.id,
      rows,
    });
  }
  return {
    entries,
    rows: entries
      .flatMap((entry) => entry.rows)
      .toSorted(
        (left, right) =>
          left.provider.localeCompare(right.provider) || left.id.localeCompare(right.id),
      ),
  };
}
//#endregion
export { loadOpenClawProviderIndex as n, planProviderIndexModelCatalogRows as t };
