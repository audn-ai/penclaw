import { s as resolveDefaultAgentDir } from "./agent-scope-config-DVIR1nBa.js";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-CdX9UGcX.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { n as t } from "./i18n-BDUMKn0X.js";
import { a as createLazyRuntimeSurface } from "./lazy-runtime-B-Fc-m0I.js";
import { t as loadStaticManifestCatalogRowsForList } from "./list.manifest-catalog-Cfm7M_VF.js";
import { i as resolveProviderCatalogPluginIdsForFilter } from "./list.provider-catalog-GEBr32bW.js";
import "./agent-scope-y9xQv_q1.js";
import { r as loadModelCatalogSnapshot } from "./model-catalog-DxYvPELu.js";
import {
  n as resolveLogicalVisibleModelCatalog,
  t as resolveLogicalModelCatalogEntryState,
} from "./model-catalog-visibility-DRLQNOZh.js";
import {
  i as resolveAgentModelPrimaryValue,
  n as normalizeAgentModelRefForConfig,
  r as resolveAgentModelFallbackValues,
  t as normalizeAgentModelMapForConfig,
} from "./model-input-B7OGjVYg.js";
import { t as createModelPickerVisibleProviderPredicate } from "./model-picker-visibility-CK4psYGX.js";
import { n as createProviderAuthChecker } from "./model-provider-auth-DNlLhknV.js";
import {
  n as normalizeConfiguredProviderCatalogModelId,
  t as formatLiteralProviderPrefixedModelRef,
} from "./model-ref-shared-Bs7ONe2Q.js";
import {
  a as normalizeModelRef,
  i as modelKey,
  o as normalizeProviderId$1,
} from "./model-selection-normalize-BoKGJiBx.js";
import {
  i as buildModelAliasIndex,
  r as buildConfiguredModelCatalog,
  v as resolveConfiguredModelRef,
  x as resolveModelRefFromString,
} from "./model-selection-shared-BliwFXJy.js";
import {
  n as createProviderAuthResolver,
  t as createProviderApiKeyResolver,
} from "./models-config.providers.secrets-Dh4joY6h.js";
import "./auth-profiles-CX7JDmZ9.js";
import "./model-selection-DOlkTrQa.js";
import { p as openAIModelCatalogRoutePolicy } from "./openai-routing-Cu28Ynzk.js";
import { t as resolveAgentHarnessPolicy } from "./policy-C704eijA.js";
import {
  a as runProviderCatalog,
  i as resolveRuntimePluginDiscoveryProviders,
  n as normalizePluginDiscoveryResult,
  r as providerMatchesFilter,
  t as groupPluginDiscoveryProvidersByOrder,
} from "./provider-discovery-ag_BJ05f.js";
import { r as normalizeProviderId } from "./provider-id-BIcU_2-A.js";
import { f as resolveOwningPluginIdsForProviderRef } from "./providers-D0H29WPB.js";
import { i as formatTokenK } from "./shared-DFGOIlxJ.js";
import { o as ensureAuthProfileStoreWithoutExternalProfiles } from "./store-B7DoDdVM.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { g as sortUniqueStrings } from "./string-normalization-CRyoFBPt.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
//#region src/flows/model-picker.provider-catalog.ts
const log = createSubsystemLogger("model-picker-provider-catalog");
const DISCOVERY_ORDERS = ["simple", "profile", "paired", "late"];
function positiveNumber(value) {
  return typeof value === "number" && value > 0 ? value : void 0;
}
function providerAuthIds(provider) {
  return [provider.id, ...(provider.aliases ?? []), ...(provider.hookAliases ?? [])]
    .map(normalizeProviderId)
    .filter(Boolean);
}
function hasLiveProviderCatalog(provider) {
  return (
    typeof provider.catalog?.run === "function" || typeof provider.discovery?.run === "function"
  );
}
async function resolvePreferredProviderLiveCatalogProviders(params) {
  const liveProviders = (
    await resolveRuntimePluginDiscoveryProviders({
      config: params.cfg,
      env: params.env,
      onlyPluginIds: params.onlyPluginIds,
      includeUntrustedWorkspacePlugins: false,
      ...(params.workspaceDir !== void 0 ? { workspaceDir: params.workspaceDir } : {}),
    })
  )
    .filter((provider) =>
      providerMatchesFilter({
        provider,
        providerFilter: params.providerFilter,
      }),
    )
    .filter(hasLiveProviderCatalog);
  if (liveProviders.length > 0) return liveProviders;
  const { resolvePluginProviders } = await import("./providers.runtime.js");
  return resolvePluginProviders({
    config: params.cfg,
    env: params.env,
    onlyPluginIds: params.onlyPluginIds,
    includeUntrustedWorkspacePlugins: false,
    mode: "setup",
    activate: false,
    cache: false,
    ...(params.workspaceDir !== void 0 ? { workspaceDir: params.workspaceDir } : {}),
  }).filter(
    (provider) =>
      providerMatchesFilter({
        provider,
        providerFilter: params.providerFilter,
      }) && hasLiveProviderCatalog(provider),
  );
}
function resolveProviderEnvApiKey(provider, env) {
  for (const envVar of provider.envVars ?? []) {
    const normalized = envVar.trim();
    const value = env[normalized]?.trim();
    if (normalized && value)
      return {
        apiKey: value,
        discoveryApiKey: value,
      };
  }
}
function modelFromProviderCatalog(params) {
  const id = normalizeConfiguredProviderCatalogModelId(params.provider, params.model.id);
  const contextWindow =
    positiveNumber(params.model.contextWindow) ??
    positiveNumber(params.providerConfig.contextWindow);
  const contextTokens =
    positiveNumber(params.model.contextTokens) ??
    positiveNumber(params.providerConfig.contextTokens);
  const api = params.model.api ?? params.providerConfig.api;
  const baseUrl = params.model.baseUrl ?? params.providerConfig.baseUrl;
  return {
    id,
    name: params.model.name || id,
    provider: params.provider,
    ...(api !== void 0 ? { api } : {}),
    ...(baseUrl !== void 0 ? { baseUrl } : {}),
    ...(contextWindow !== void 0 ? { contextWindow } : {}),
    ...(contextTokens !== void 0 ? { contextTokens } : {}),
    reasoning: params.model.reasoning,
    input: params.model.input,
    ...(params.model.compat ? { compat: params.model.compat } : {}),
  };
}
/** Loads live catalog models for the user's preferred provider, ordered by discovery priority. */
async function loadPreferredProviderPickerCatalog(params) {
  const env = params.env ?? process.env;
  const agentDir = params.agentDir ?? resolveDefaultAgentDir(params.cfg, env);
  const providerFilter = normalizeProviderId(params.preferredProvider);
  if (!providerFilter) return [];
  const onlyPluginIds = await resolveProviderCatalogPluginIdsForFilter({
    cfg: params.cfg,
    env,
    providerFilter,
  });
  if (!onlyPluginIds || onlyPluginIds.length === 0) return [];
  const providers = await resolvePreferredProviderLiveCatalogProviders({
    cfg: params.cfg,
    env,
    onlyPluginIds,
    providerFilter,
    ...(params.workspaceDir !== void 0 ? { workspaceDir: params.workspaceDir } : {}),
  });
  if (providers.length === 0) return [];
  let authStore;
  const getAuthStore = () =>
    (authStore ??= ensureAuthProfileStoreWithoutExternalProfiles(agentDir, {
      allowKeychainPrompt: false,
    }));
  const resolveProviderApiKey = createProviderApiKeyResolver(env, getAuthStore, params.cfg);
  const resolveProviderAuth = createProviderAuthResolver(env, getAuthStore, params.cfg);
  const resolveFastProviderApiKey = (provider, providerId = provider.id) => {
    const normalizedProviderId = normalizeProviderId(providerId);
    if (providerAuthIds(provider).includes(normalizedProviderId)) {
      const fromEnv = resolveProviderEnvApiKey(provider, env);
      if (fromEnv) return fromEnv;
    }
    return resolveProviderApiKey(providerId);
  };
  const byOrder = groupPluginDiscoveryProvidersByOrder(providers);
  const rows = [];
  const seen = /* @__PURE__ */ new Set();
  for (const order of DISCOVERY_ORDERS)
    for (const provider of byOrder[order]) {
      let result;
      const resolveCatalogProviderApiKey = (providerId) =>
        resolveFastProviderApiKey(provider, providerId?.trim() || provider.id);
      const resolveCatalogProviderAuth = (providerId, options) =>
        resolveProviderAuth(providerId?.trim() || provider.id, options);
      try {
        result = await runProviderCatalog({
          provider,
          config: params.cfg,
          env,
          resolveProviderApiKey: resolveCatalogProviderApiKey,
          resolveProviderAuth: resolveCatalogProviderAuth,
          agentDir,
          ...(params.workspaceDir !== void 0 ? { workspaceDir: params.workspaceDir } : {}),
        });
      } catch (error) {
        log.warn(`provider catalog failed for ${provider.id}: ${formatErrorMessage(error)}`);
        continue;
      }
      const normalized = normalizePluginDiscoveryResult({
        provider,
        result,
      });
      for (const [providerIdRaw, providerConfig] of Object.entries(normalized)) {
        const providerId = normalizeProviderId(providerIdRaw);
        if (providerId !== providerFilter || !Array.isArray(providerConfig.models)) continue;
        for (const model of providerConfig.models) {
          const entry = modelFromProviderCatalog({
            provider: providerId,
            providerConfig,
            model,
          });
          const key = `${entry.provider}/${entry.id}`;
          if (seen.has(key)) continue;
          seen.add(key);
          rows.push(entry);
        }
      }
    }
  return rows;
}
//#endregion
//#region src/flows/model-picker.ts
const KEEP_VALUE = "__keep__";
const MANUAL_VALUE = "__manual__";
const BROWSE_VALUE = "__browse__";
const PROVIDER_FILTER_THRESHOLD = 30;
const EMPTY_LITERAL_PREFIX_PROVIDERS = /* @__PURE__ */ new Set();
const HIDDEN_ROUTER_MODELS = /* @__PURE__ */ new Set(["openrouter/auto"]);
function formatKeepCurrentModelLabel(params) {
  return params.configuredRaw
    ? t("wizard.model.keepCurrent", { value: params.configuredLabel })
    : t("wizard.model.keepCurrentDefault", { value: params.resolvedKey });
}
function formatModelRefLabel(params) {
  const providerId = normalizeProviderId$1(params.provider);
  const modelId = params.model.trim().toLowerCase();
  return providerId &&
    params.literalPrefixProviders.has(providerId) &&
    modelId.startsWith(`${providerId}/`)
    ? formatLiteralProviderPrefixedModelRef(params.provider, params.key)
    : params.key;
}
function resolvePickerAgentDir(params) {
  return params.agentDir ?? resolveDefaultAgentDir(params.cfg, params.env ?? process.env);
}
async function loadModelPickerRuntime() {
  return import("./model-picker.runtime.js");
}
const loadResolvedModelPickerRuntime = createLazyRuntimeSurface(
  loadModelPickerRuntime,
  ({ modelPickerRuntime }) => modelPickerRuntime,
);
function resolveConfiguredModelRaw(cfg) {
  return resolveAgentModelPrimaryValue(cfg.agents?.defaults?.model) ?? "";
}
function resolveConfiguredModelKeys(cfg) {
  const models = cfg.agents?.defaults?.models ?? {};
  return Object.keys(models)
    .map((key) => key.trim())
    .filter((key) => key.length > 0);
}
function toPickerCatalogEntry(row) {
  return {
    id: row.id,
    name: row.name,
    provider: row.provider,
    ...(row.api !== void 0 ? { api: row.api } : {}),
    ...(row.baseUrl !== void 0 ? { baseUrl: row.baseUrl } : {}),
    ...(row.contextWindow !== void 0 ? { contextWindow: row.contextWindow } : {}),
    reasoning: row.reasoning,
    input: row.input,
  };
}
function loadPickerModelCatalog(cfg, opts = {}) {
  const snapshot = (entries) => ({
    entries,
    routeVariants: entries,
  });
  if (cfg.models?.mode === "replace")
    return Promise.resolve(snapshot(buildConfiguredModelCatalog({ cfg })));
  if (opts.preferredProvider) {
    if (opts.preferLiveProviderCatalog)
      return loadPreferredProviderPickerCatalog({
        cfg,
        preferredProvider: opts.preferredProvider,
        ...(opts.agentDir !== void 0 ? { agentDir: opts.agentDir } : {}),
        ...(opts.workspaceDir !== void 0 ? { workspaceDir: opts.workspaceDir } : {}),
        ...(opts.env !== void 0 ? { env: opts.env } : {}),
      }).then((providerCatalog) => {
        if (providerCatalog.length > 0) return snapshot(providerCatalog);
        if (opts.allowStaticFallbackCatalog !== false) {
          const manifestRows = loadStaticManifestCatalogRowsForList({
            cfg,
            providerFilter: opts.preferredProvider,
            ...(opts.env !== void 0 ? { env: opts.env } : {}),
          });
          if (manifestRows.length > 0) return snapshot(manifestRows.map(toPickerCatalogEntry));
        }
        return opts.providerScoped ? snapshot([]) : loadModelCatalogSnapshot({ config: cfg });
      });
    const manifestRows = loadStaticManifestCatalogRowsForList({
      cfg,
      providerFilter: opts.preferredProvider,
      ...(opts.env !== void 0 ? { env: opts.env } : {}),
    });
    if (manifestRows.length > 0)
      return Promise.resolve(snapshot(manifestRows.map(toPickerCatalogEntry)));
    if (opts.providerScoped) return Promise.resolve(snapshot([]));
  }
  return loadModelCatalogSnapshot({ config: cfg });
}
async function resolvePickerLogicalCatalog(params) {
  const sourceOrder = /* @__PURE__ */ new Map();
  for (const entry of params.catalog) {
    const key =
      openAIModelCatalogRoutePolicy.resolveIdentity(entry)?.key ?? modelCatalogEntryKey(entry);
    if (!sourceOrder.has(key)) sourceOrder.set(key, sourceOrder.size);
  }
  return (
    await resolveLogicalVisibleModelCatalog({
      cfg: params.cfg,
      catalog: params.catalog,
      defaultProvider: params.defaultProvider,
      ...(params.defaultModel ? { defaultModel: params.defaultModel } : {}),
      ...(params.agentId ? { agentId: params.agentId } : {}),
      ...(params.workspaceDir ? { workspaceDir: params.workspaceDir } : {}),
      ...(params.view ? { view: params.view } : {}),
      routePolicy: openAIModelCatalogRoutePolicy,
      routeVariants: params.routeVariants,
      evaluateEntry: async (entry, routeVariants) => {
        const identity = openAIModelCatalogRoutePolicy.resolveIdentity(entry);
        return resolveLogicalModelCatalogEntryState({
          entry,
          evaluation: await params.hasAuth.evaluateModelAuth(entry.provider, {
            modelId: identity?.id ?? entry.id,
            observedRoutes: routeVariants.map((variant) => ({
              api: variant.api,
              baseUrl: variant.baseUrl,
            })),
          }),
          routePolicy: openAIModelCatalogRoutePolicy,
        });
      },
    })
  ).toSorted((left, right) => {
    const leftKey =
      openAIModelCatalogRoutePolicy.resolveIdentity(left)?.key ?? modelCatalogEntryKey(left);
    const rightKey =
      openAIModelCatalogRoutePolicy.resolveIdentity(right)?.key ?? modelCatalogEntryKey(right);
    return (
      (sourceOrder.get(leftKey) ?? Number.MAX_SAFE_INTEGER) -
      (sourceOrder.get(rightKey) ?? Number.MAX_SAFE_INTEGER)
    );
  });
}
function normalizeModelKeys(values) {
  const seen = /* @__PURE__ */ new Set();
  const next = [];
  for (const raw of values) {
    const value = normalizeAgentModelRefForConfig(raw);
    if (!value || seen.has(value)) continue;
    seen.add(value);
    next.push(value);
  }
  return next;
}
function resolveFallbackModelKey(params) {
  const raw = normalizeOptionalString(params.raw);
  if (!raw) return;
  const resolved = resolveModelRefFromString({
    cfg: params.cfg,
    raw,
    defaultProvider: params.defaultProvider,
    aliasIndex: params.aliasIndex,
  });
  if (!resolved) return;
  return modelKey(resolved.ref.provider, resolved.ref.model);
}
function resolveFallbackModelKeys(params) {
  return normalizeModelKeys(
    params.rawFallbacks
      .map((raw) =>
        resolveFallbackModelKey({
          cfg: params.cfg,
          raw,
          defaultProvider: params.defaultProvider,
          aliasIndex: params.aliasIndex,
        }),
      )
      .filter((key) => Boolean(key)),
  );
}
function createModelRouteRuntimeResolver(params) {
  const cache = /* @__PURE__ */ new Map();
  return (route) => {
    const baseUrlKey =
      typeof route.baseUrl === "string"
        ? route.baseUrl
        : route.baseUrl == null
          ? ""
          : typeof route.baseUrl;
    const key = [route.provider, route.modelId, route.api ?? "", baseUrlKey].join("\0");
    if (cache.has(key)) return cache.get(key);
    const policy = resolveAgentHarnessPolicy({
      provider: route.provider,
      modelId: route.modelId,
      modelApi: route.api,
      modelBaseUrl: route.baseUrl,
      config: params.config,
      env: params.env,
    });
    const runtime =
      policy.runtime === "codex" ? "codex" : policy.runtime === "openclaw" ? "openclaw" : void 0;
    cache.set(key, runtime);
    return runtime;
  };
}
function resolveModelRouteHint(params) {
  if (normalizeProviderId$1(params.provider) !== "openai") return;
  const runtime = params.resolveModelRouteRuntime({
    provider: params.provider,
    modelId: params.modelId,
    api: params.api,
    baseUrl: params.baseUrl,
  });
  return runtime === "codex"
    ? "Codex runtime route"
    : runtime === "openclaw"
      ? "OpenClaw runtime route"
      : void 0;
}
async function resolveLiteralPrefixProviderIds(params) {
  const { resolvePluginProviders } = await loadResolvedModelPickerRuntime();
  const providers = resolvePluginProviders({
    config: params.cfg,
    workspaceDir: params.workspaceDir,
    env: params.env,
    activate: false,
    cache: false,
    includeUntrustedWorkspacePlugins: false,
  });
  const ids = /* @__PURE__ */ new Set();
  for (const provider of providers) {
    if (!provider.preserveLiteralProviderPrefix) continue;
    const id = normalizeProviderId$1(provider.id);
    if (id) ids.add(id);
    for (const alias of provider.aliases ?? []) {
      const aliasId = normalizeProviderId$1(alias);
      if (aliasId) ids.add(aliasId);
    }
  }
  return ids;
}
function modelCatalogEntryKey(entry) {
  const normalizedRef = normalizeModelRef(entry.provider, entry.id);
  return modelKey(normalizedRef.provider, normalizedRef.model);
}
async function addModelSelectOption(params) {
  const normalizedRef = normalizeModelRef(params.entry.provider, params.entry.id);
  const key = modelCatalogEntryKey(params.entry);
  if (
    params.seen.has(key) ||
    HIDDEN_ROUTER_MODELS.has(key) ||
    !params.isVisibleProvider(normalizedRef.provider)
  )
    return;
  const hints = [];
  if (params.entry.name && params.entry.name !== params.entry.id) hints.push(params.entry.name);
  if (params.entry.contextWindow) hints.push(`ctx ${formatTokenK(params.entry.contextWindow)}`);
  if (params.entry.reasoning) hints.push("reasoning");
  const aliases = params.aliasIndex.byKey.get(key);
  if (aliases?.length) hints.push(`alias: ${aliases.join(", ")}`);
  const routeHint = resolveModelRouteHint({
    provider: normalizedRef.provider,
    modelId: normalizedRef.model,
    api: params.entry.api,
    baseUrl: params.entry.baseUrl,
    resolveModelRouteRuntime: params.resolveModelRouteRuntime,
  });
  if (routeHint) hints.push(routeHint);
  if (
    !(await params.hasAuth(normalizedRef.provider, {
      modelId: normalizedRef.model,
      api: params.entry.api,
      baseUrl: params.entry.baseUrl,
    }))
  )
    return;
  const label = formatModelRefLabel({
    provider: normalizedRef.provider,
    model: normalizedRef.model,
    key,
    literalPrefixProviders: params.literalPrefixProviders,
  });
  params.options.push({
    value: key,
    label,
    hint: hints.length > 0 ? hints.join(" · ") : void 0,
  });
  params.seen.add(key);
}
function splitModelKey(key) {
  const slashIndex = key.indexOf("/");
  if (slashIndex <= 0 || slashIndex >= key.length - 1) return;
  return {
    provider: key.slice(0, slashIndex),
    id: key.slice(slashIndex + 1),
  };
}
async function addModelKeySelectOption(params) {
  const entry = splitModelKey(params.key);
  if (!entry) return;
  const before = params.seen.size;
  await addModelSelectOption({
    entry,
    options: params.options,
    seen: params.seen,
    aliasIndex: params.aliasIndex,
    hasAuth: params.hasAuth,
    literalPrefixProviders: params.literalPrefixProviders ?? EMPTY_LITERAL_PREFIX_PROVIDERS,
    isVisibleProvider: params.isVisibleProvider,
    resolveModelRouteRuntime: params.resolveModelRouteRuntime,
  });
  if (params.seen.size > before) {
    const option = params.options.at(-1);
    if (option && !option.hint) option.hint = params.fallbackHint;
  }
}
function createPreferredProviderMatcher(params) {
  const normalizedPreferredProvider = normalizeProviderId$1(params.preferredProvider);
  const preferredOwnerPluginIds = resolveOwningPluginIdsForProviderRef({
    provider: normalizedPreferredProvider,
    config: params.cfg,
    workspaceDir: params.workspaceDir,
    env: params.env,
  });
  const preferredOwnerPluginIdSet = preferredOwnerPluginIds
    ? new Set(preferredOwnerPluginIds)
    : void 0;
  const entryProviderCache = /* @__PURE__ */ new Map();
  return (entryProvider) => {
    const normalizedEntryProvider = normalizeProviderId$1(entryProvider);
    if (normalizedEntryProvider === normalizedPreferredProvider) return true;
    const cached = entryProviderCache.get(normalizedEntryProvider);
    if (cached !== void 0) return cached;
    if (!preferredOwnerPluginIdSet) {
      entryProviderCache.set(normalizedEntryProvider, false);
      return false;
    }
    const value =
      resolveOwningPluginIdsForProviderRef({
        provider: normalizedEntryProvider,
        config: params.cfg,
        workspaceDir: params.workspaceDir,
        env: params.env,
      })?.some((pluginId) => preferredOwnerPluginIdSet.has(pluginId)) ?? false;
    entryProviderCache.set(normalizedEntryProvider, value);
    return value;
  };
}
async function promptManualModel(params) {
  const model = (
    (await params.prompter.text({
      message: params.allowBlank
        ? t("wizard.model.defaultModelBlankToKeep")
        : t("wizard.model.defaultModel"),
      initialValue: params.initialValue,
      placeholder: "provider/model",
      validate: params.allowBlank
        ? void 0
        : (value) => (normalizeOptionalString(value) ? void 0 : t("common.required")),
    })) ?? ""
  ).trim();
  if (!model) return {};
  return { model: normalizeAgentModelRefForConfig(model) };
}
function buildModelProviderFilterOptions(models) {
  return sortUniqueStrings(models.map((entry) => entry.provider)).map((provider) => {
    const count = models.filter((entry) => entry.provider === provider).length;
    return {
      value: provider,
      label: provider,
      hint: t("wizard.model.modelCount", {
        count,
        plural: count === 1 ? "" : "s",
      }),
    };
  });
}
async function maybeFilterModelsByProvider(params) {
  let next = params.models.filter((entry) => params.isVisibleProvider(entry.provider));
  const providerIds = sortUniqueStrings(next.map((entry) => entry.provider));
  const hasPreferredProvider = Boolean(params.preferredProvider);
  const shouldPromptProvider =
    !hasPreferredProvider && providerIds.length > 1 && next.length > PROVIDER_FILTER_THRESHOLD;
  const matchesPreferredProvider = params.preferredProvider
    ? createPreferredProviderMatcher({
        preferredProvider: params.preferredProvider,
        cfg: params.cfg,
        workspaceDir: params.workspaceDir,
        env: params.env,
      })
    : void 0;
  if (shouldPromptProvider) {
    const selection = await params.prompter.select({
      message: t("wizard.model.filterByProvider"),
      options: [
        {
          value: "*",
          label: t("wizard.model.allProviders"),
        },
        ...buildModelProviderFilterOptions(next),
      ],
      searchable: true,
    });
    if (selection !== "*") next = next.filter((entry) => entry.provider === selection);
  }
  if (hasPreferredProvider && params.preferredProvider) {
    const filtered = next.filter((entry) => matchesPreferredProvider?.(entry.provider));
    if (filtered.length > 0) next = filtered;
  }
  return next;
}
async function resolveProviderPluginSetupOptions(params) {
  const runtime = await loadResolvedModelPickerRuntime();
  return (
    "resolveProviderModelPickerContributions" in runtime &&
    typeof runtime.resolveProviderModelPickerContributions === "function"
      ? runtime
          .resolveProviderModelPickerContributions({
            config: params.cfg,
            workspaceDir: params.workspaceDir,
            env: params.env,
          })
          .map((contribution) => contribution.option)
      : runtime.resolveProviderModelPickerEntries({
          config: params.cfg,
          workspaceDir: params.workspaceDir,
          env: params.env,
        })
  ).map((entry) =>
    Object.assign(
      {
        value: entry.value,
        label: entry.label,
      },
      entry.hint ? { hint: entry.hint } : {},
    ),
  );
}
async function maybeHandleProviderPluginSelection(params) {
  let pluginResolution = null;
  let pluginProviders = [];
  if (params.selection.startsWith("provider-plugin:")) pluginResolution = params.selection;
  else if (!params.selection.includes("/")) {
    const { resolvePluginProviders } = await loadResolvedModelPickerRuntime();
    pluginProviders = resolvePluginProviders({
      config: params.cfg,
      workspaceDir: params.workspaceDir,
      env: params.env,
      mode: "setup",
    });
    pluginResolution = pluginProviders.some(
      (provider) => normalizeProviderId$1(provider.id) === normalizeProviderId$1(params.selection),
    )
      ? params.selection
      : null;
  }
  if (!pluginResolution) return null;
  if (!params.agentDir || !params.runtime) {
    await params.prompter.note(
      t("wizard.model.providerSetupUnavailable"),
      t("wizard.model.providerSetupUnavailableTitle"),
    );
    return {};
  }
  const {
    resolvePluginProviders,
    resolveProviderPluginChoice,
    runProviderModelSelectedHook,
    runProviderPluginAuthMethod,
  } = await loadResolvedModelPickerRuntime();
  if (pluginProviders.length === 0)
    pluginProviders = resolvePluginProviders({
      config: params.cfg,
      workspaceDir: params.workspaceDir,
      env: params.env,
      mode: "setup",
    });
  const resolved = resolveProviderPluginChoice({
    providers: pluginProviders,
    choice: pluginResolution,
  });
  if (!resolved) return {};
  const applied = await runProviderPluginAuthMethod({
    config: params.cfg,
    runtime: params.runtime,
    prompter: params.prompter,
    method: resolved.method,
    agentDir: params.agentDir,
    workspaceDir: params.workspaceDir,
  });
  if (applied.defaultModel)
    await runProviderModelSelectedHook({
      config: applied.config,
      model: applied.defaultModel,
      prompter: params.prompter,
      agentDir: params.agentDir,
      workspaceDir: params.workspaceDir,
      env: params.env,
    });
  return {
    model: applied.defaultModel,
    config: applied.config,
  };
}
async function promptDefaultModel(params) {
  const cfg = params.config;
  const pickerAgentDir = resolvePickerAgentDir({
    cfg,
    ...(params.agentDir !== void 0 ? { agentDir: params.agentDir } : {}),
    ...(params.env !== void 0 ? { env: params.env } : {}),
  });
  const allowKeep = params.allowKeep ?? true;
  const includeManual = params.includeManual ?? true;
  const includeProviderPluginSetups = params.includeProviderPluginSetups ?? false;
  const loadCatalog = params.loadCatalog ?? true;
  const browseCatalogOnDemand = params.browseCatalogOnDemand ?? false;
  const ignoreAllowlist = params.ignoreAllowlist ?? false;
  const preferredProviderRaw = normalizeOptionalString(params.preferredProvider);
  const preferredProvider = preferredProviderRaw
    ? normalizeProviderId$1(preferredProviderRaw)
    : void 0;
  const configuredRaw = resolveConfiguredModelRaw(cfg);
  const resolved = resolveConfiguredModelRef({
    cfg,
    defaultProvider: DEFAULT_PROVIDER,
    defaultModel: DEFAULT_MODEL,
    allowPluginNormalization: !loadCatalog || browseCatalogOnDemand ? false : void 0,
  });
  const resolvedKey = modelKey(resolved.provider, resolved.model);
  const configuredKey = configuredRaw ? resolvedKey : "";
  let literalPrefixProvidersCache;
  const resolveCachedLiteralPrefixProviders = async () => {
    if (!literalPrefixProvidersCache)
      literalPrefixProvidersCache = await resolveLiteralPrefixProviderIds({
        cfg,
        workspaceDir: params.workspaceDir,
        env: params.env,
      });
    return literalPrefixProvidersCache;
  };
  const resolveConfiguredDisplayLabel = async () => {
    if (!normalizeProviderId$1(resolved.provider)) return configuredRaw || resolvedKey;
    const literalPrefixProviders = await resolveCachedLiteralPrefixProviders();
    return formatModelRefLabel({
      provider: resolved.provider,
      model: resolved.model,
      key: configuredRaw || resolvedKey,
      literalPrefixProviders,
    });
  };
  if (
    loadCatalog &&
    browseCatalogOnDemand &&
    allowKeep &&
    (!preferredProvider || normalizeProviderId$1(resolved.provider) === preferredProvider)
  ) {
    const configuredLabel = await resolveConfiguredDisplayLabel();
    const options = [
      {
        value: KEEP_VALUE,
        label: formatKeepCurrentModelLabel({
          configuredRaw,
          configuredLabel,
          resolvedKey,
        }),
        hint:
          configuredRaw && configuredRaw !== resolvedKey
            ? t("wizard.model.resolvesTo", { value: resolvedKey })
            : void 0,
      },
    ];
    if (includeManual)
      options.push({
        value: MANUAL_VALUE,
        label: t("wizard.model.enterManually"),
      });
    options.push({
      value: BROWSE_VALUE,
      label: t("wizard.model.browseAll"),
      hint: t("wizard.model.loadsProviderCatalogs"),
    });
    const selection = await params.prompter.select({
      message: params.message ?? t("wizard.model.defaultModel"),
      options,
      initialValue: KEEP_VALUE,
      searchable: false,
    });
    if (selection === KEEP_VALUE) return {};
    if (selection === MANUAL_VALUE)
      return promptManualModel({
        prompter: params.prompter,
        allowBlank: false,
        initialValue: configuredRaw || resolvedKey || void 0,
      });
    if (selection !== BROWSE_VALUE) return { model: selection };
  }
  if (!loadCatalog) {
    const configuredLabel = await resolveConfiguredDisplayLabel();
    const options = [];
    if (allowKeep)
      options.push({
        value: KEEP_VALUE,
        label: formatKeepCurrentModelLabel({
          configuredRaw,
          configuredLabel,
          resolvedKey,
        }),
        hint:
          configuredRaw && configuredRaw !== resolvedKey
            ? t("wizard.model.resolvesTo", { value: resolvedKey })
            : void 0,
      });
    if (includeManual)
      options.push({
        value: MANUAL_VALUE,
        label: t("wizard.model.enterManually"),
      });
    if (configuredKey && !options.some((option) => option.value === configuredKey))
      options.push({
        value: configuredKey,
        label: configuredKey,
        hint: t("wizard.model.current"),
      });
    if (options.length === 0)
      return promptManualModel({
        prompter: params.prompter,
        allowBlank: allowKeep,
        initialValue: configuredRaw || resolvedKey || void 0,
      });
    const selection = await params.prompter.select({
      message: params.message ?? t("wizard.model.defaultModel"),
      options,
      initialValue: allowKeep ? KEEP_VALUE : configuredKey || MANUAL_VALUE,
      searchable: false,
    });
    if (selection === KEEP_VALUE) return {};
    if (selection === MANUAL_VALUE)
      return promptManualModel({
        prompter: params.prompter,
        allowBlank: false,
        initialValue: configuredRaw || resolvedKey || void 0,
      });
    return { model: selection };
  }
  const catalogProgress = params.prompter.progress(t("wizard.model.loadingModels"));
  let catalogSnapshot;
  try {
    const providerScopedCatalog = browseCatalogOnDemand && preferredProvider;
    catalogSnapshot = await loadPickerModelCatalog(cfg, {
      preferredProvider: providerScopedCatalog ? preferredProvider : void 0,
      preferLiveProviderCatalog: Boolean(providerScopedCatalog),
      providerScoped: Boolean(providerScopedCatalog),
      agentDir: pickerAgentDir,
      ...(params.workspaceDir !== void 0 ? { workspaceDir: params.workspaceDir } : {}),
      ...(params.env !== void 0 ? { env: params.env } : {}),
    });
  } finally {
    catalogProgress.stop();
  }
  const catalog = catalogSnapshot.entries;
  if (catalog.length === 0)
    return promptManualModel({
      prompter: params.prompter,
      allowBlank: allowKeep,
      initialValue: configuredRaw || resolvedKey || void 0,
    });
  const aliasIndex = buildModelAliasIndex({
    cfg,
    defaultProvider: DEFAULT_PROVIDER,
  });
  const hasAuth = createProviderAuthChecker({
    cfg,
    workspaceDir: params.workspaceDir,
    agentDir: pickerAgentDir,
    env: params.env,
  });
  const resolveModelRouteRuntime = createModelRouteRuntimeResolver({
    config: cfg,
    env: params.env,
  });
  const models = await resolvePickerLogicalCatalog({
    cfg,
    catalog,
    routeVariants: catalogSnapshot.routeVariants,
    defaultProvider: DEFAULT_PROVIDER,
    defaultModel: resolved.model,
    ...(params.workspaceDir ? { workspaceDir: params.workspaceDir } : {}),
    ...(ignoreAllowlist ? { view: "all" } : {}),
    hasAuth,
  });
  if (models.length === 0)
    return promptManualModel({
      prompter: params.prompter,
      allowBlank: allowKeep,
      initialValue: configuredRaw || resolvedKey || void 0,
    });
  const isVisibleProvider = createModelPickerVisibleProviderPredicate({
    config: cfg,
    env: params.env,
    includeSetupRegistry: true,
  });
  const filteredModels = await maybeFilterModelsByProvider({
    models,
    preferredProvider,
    prompter: params.prompter,
    cfg,
    workspaceDir: params.workspaceDir,
    env: params.env,
    isVisibleProvider,
  });
  if (filteredModels.length === 0)
    return promptManualModel({
      prompter: params.prompter,
      allowBlank: allowKeep,
      initialValue: configuredRaw || resolvedKey || void 0,
    });
  const matchesPreferredProvider = preferredProvider
    ? createPreferredProviderMatcher({
        preferredProvider,
        cfg,
        workspaceDir: params.workspaceDir,
        env: params.env,
      })
    : void 0;
  const hasPreferredProvider = preferredProvider
    ? filteredModels.some((entry) => matchesPreferredProvider?.(entry.provider))
    : false;
  const literalPrefixProviders = await resolveCachedLiteralPrefixProviders();
  const configuredLabel = formatModelRefLabel({
    provider: resolved.provider,
    model: resolved.model,
    key: configuredRaw || resolvedKey,
    literalPrefixProviders,
  });
  const options = [];
  if (allowKeep)
    options.push({
      value: KEEP_VALUE,
      label: formatKeepCurrentModelLabel({
        configuredRaw,
        configuredLabel,
        resolvedKey,
      }),
    });
  if (includeManual)
    options.push({
      value: MANUAL_VALUE,
      label: t("wizard.model.enterManually"),
    });
  if (includeProviderPluginSetups && params.agentDir)
    options.push(
      ...(await resolveProviderPluginSetupOptions({
        cfg,
        workspaceDir: params.workspaceDir,
        env: params.env,
      })),
    );
  const seen = /* @__PURE__ */ new Set();
  for (const entry of filteredModels)
    await addModelSelectOption({
      entry,
      options,
      seen,
      aliasIndex,
      hasAuth,
      literalPrefixProviders,
      isVisibleProvider,
      resolveModelRouteRuntime,
    });
  if (configuredKey && !seen.has(configuredKey))
    options.push({
      value: configuredKey,
      label: configuredLabel,
      hint: t("wizard.model.currentNotInCatalog"),
    });
  const firstPreferredModel =
    preferredProvider && hasPreferredProvider
      ? filteredModels.find((entry) => matchesPreferredProvider?.(entry.provider))
      : void 0;
  const firstPreferredModelKey = firstPreferredModel
    ? modelCatalogEntryKey(firstPreferredModel)
    : void 0;
  let initialValue = allowKeep ? KEEP_VALUE : configuredKey || void 0;
  if (!allowKeep && firstPreferredModelKey) initialValue = firstPreferredModelKey;
  else if (
    allowKeep &&
    firstPreferredModelKey &&
    preferredProvider &&
    !matchesPreferredProvider?.(resolved.provider)
  )
    initialValue = firstPreferredModelKey;
  const selectedValue =
    (await params.prompter.select({
      message: params.message ?? t("wizard.model.defaultModel"),
      options,
      initialValue,
      searchable: true,
    })) ?? "";
  if (selectedValue === KEEP_VALUE) return {};
  if (selectedValue === MANUAL_VALUE)
    return promptManualModel({
      prompter: params.prompter,
      allowBlank: false,
      initialValue: configuredRaw || resolvedKey || void 0,
    });
  const providerPluginResult = await maybeHandleProviderPluginSelection({
    selection: selectedValue,
    cfg,
    prompter: params.prompter,
    agentDir: params.agentDir,
    workspaceDir: params.workspaceDir,
    env: params.env,
    runtime: params.runtime,
  });
  if (providerPluginResult) return providerPluginResult;
  const model = normalizeAgentModelRefForConfig(selectedValue);
  const { runProviderModelSelectedHook } = await loadResolvedModelPickerRuntime();
  await runProviderModelSelectedHook({
    config: cfg,
    model,
    prompter: params.prompter,
    agentDir: params.agentDir,
    workspaceDir: params.workspaceDir,
    env: params.env,
  });
  return { model };
}
async function promptModelAllowlist(params) {
  const cfg = params.config;
  const pickerAgentDir = resolvePickerAgentDir({
    cfg,
    ...(params.agentDir !== void 0 ? { agentDir: params.agentDir } : {}),
    ...(params.env !== void 0 ? { env: params.env } : {}),
  });
  const existingKeys = resolveConfiguredModelKeys(cfg);
  const configuredRaw = resolveConfiguredModelRaw(cfg);
  const allowedKeys = normalizeModelKeys(params.allowedKeys ?? []);
  const allowedKeySet = allowedKeys.length > 0 ? new Set(allowedKeys) : null;
  const preferredProviderRaw = normalizeOptionalString(params.preferredProvider);
  const preferredProvider = preferredProviderRaw
    ? normalizeProviderId$1(preferredProviderRaw)
    : void 0;
  const resolved = resolveConfiguredModelRef({
    cfg,
    defaultProvider: DEFAULT_PROVIDER,
    defaultModel: DEFAULT_MODEL,
  });
  const resolvedKey = modelKey(resolved.provider, resolved.model);
  const aliasIndex = buildModelAliasIndex({
    cfg,
    defaultProvider: DEFAULT_PROVIDER,
  });
  const fallbackAliasIndex =
    resolved.provider === "openai"
      ? aliasIndex
      : buildModelAliasIndex({
          cfg,
          defaultProvider: resolved.provider,
        });
  const fallbackKeys = resolveFallbackModelKeys({
    cfg,
    rawFallbacks: resolveAgentModelFallbackValues(cfg.agents?.defaults?.model),
    defaultProvider: resolved.provider,
    aliasIndex: fallbackAliasIndex,
  });
  const initialSeeds = normalizeModelKeys([
    ...existingKeys,
    resolvedKey,
    ...fallbackKeys,
    ...(params.initialSelections ?? []),
  ]);
  const hasRealSeed =
    existingKeys.length > 0 ||
    fallbackKeys.length > 0 ||
    (params.initialSelections?.length ?? 0) > 0 ||
    configuredRaw.length > 0;
  const hasAuth = createProviderAuthChecker({
    cfg,
    workspaceDir: params.workspaceDir,
    agentDir: pickerAgentDir,
    env: params.env,
  });
  const resolveModelRouteRuntime = createModelRouteRuntimeResolver({
    config: cfg,
    env: params.env,
  });
  const matchesPreferredProvider = preferredProvider
    ? createPreferredProviderMatcher({
        preferredProvider,
        cfg,
        workspaceDir: params.workspaceDir,
        env: params.env,
      })
    : void 0;
  const loadCatalog = params.loadCatalog ?? true;
  const scopedFastKeys =
    allowedKeys.length > 0
      ? allowedKeys
      : !loadCatalog && preferredProvider && hasRealSeed
        ? initialSeeds.filter((key) => {
            const entry = splitModelKey(key);
            return entry ? matchesPreferredProvider?.(entry.provider) === true : false;
          })
        : [];
  if (scopedFastKeys.length > 0) {
    const isVisibleProvider = createModelPickerVisibleProviderPredicate({
      config: cfg,
      env: params.env,
      includeSetupRegistry: true,
    });
    const scopeKeys = allowedKeys.length > 0 ? allowedKeys : scopedFastKeys;
    const scopeKeySet = new Set(scopeKeys);
    const initialKeys = normalizeModelKeys(initialSeeds.filter((key) => scopeKeySet.has(key)));
    const options = [];
    const seen = /* @__PURE__ */ new Set();
    for (const key of scopeKeys)
      await addModelKeySelectOption({
        key,
        options,
        seen,
        aliasIndex,
        hasAuth,
        isVisibleProvider,
        resolveModelRouteRuntime,
        fallbackHint:
          allowedKeys.length > 0 ? t("wizard.model.allowed") : t("wizard.model.configured"),
      });
    if (options.length === 0) return {};
    const selected = normalizeModelKeys(
      await params.prompter.multiselect({
        message: params.message ?? t("wizard.model.allowlistPicker"),
        options,
        initialValues: initialKeys.length > 0 ? initialKeys : void 0,
        searchable: true,
      }),
    );
    if (selected.length > 0)
      return {
        models: selected,
        scopeKeys,
      };
    if (
      !(await params.prompter.confirm({
        message: t("wizard.model.removeProviderModels"),
        initialValue: false,
      }))
    )
      return {};
    return {
      models: [],
      scopeKeys,
    };
  }
  if (!loadCatalog) return {};
  const allowlistProgress = params.prompter.progress(t("wizard.model.loadingModels"));
  let catalogSnapshot;
  try {
    catalogSnapshot = await loadPickerModelCatalog(cfg, {
      preferredProvider,
      preferLiveProviderCatalog: Boolean(preferredProvider),
      providerScoped: Boolean(preferredProvider && params.providerScopedCatalog),
      allowStaticFallbackCatalog: !params.providerScopedCatalog,
      agentDir: pickerAgentDir,
      ...(params.workspaceDir !== void 0 ? { workspaceDir: params.workspaceDir } : {}),
      ...(params.env !== void 0 ? { env: params.env } : {}),
    });
  } finally {
    allowlistProgress.stop();
  }
  let catalog = catalogSnapshot.entries;
  let providerStaticCatalogRows;
  const loadProviderStaticCatalogRows = () =>
    (providerStaticCatalogRows ??= preferredProvider
      ? loadStaticManifestCatalogRowsForList({
          cfg,
          providerFilter: preferredProvider,
          ...(params.env !== void 0 ? { env: params.env } : {}),
        })
      : []);
  const providerScopedCatalogLoaded = Boolean(
    preferredProvider && params.providerScopedCatalog && catalog.length > 0,
  );
  if (providerScopedCatalogLoaded) {
    const deprecatedStaticKeys = new Set(
      loadProviderStaticCatalogRows()
        .filter((entry) => entry.status === "deprecated")
        .map((entry) => modelKey(entry.provider, entry.id)),
    );
    if (deprecatedStaticKeys.size > 0)
      catalog = catalog.filter(
        (entry) => !deprecatedStaticKeys.has(modelKey(entry.provider, entry.id)),
      );
  }
  if (preferredProvider) {
    let configuredCatalog = buildConfiguredModelCatalog({ cfg }).filter(
      (entry) => matchesPreferredProvider?.(entry.provider) === true,
    );
    if (providerScopedCatalogLoaded && configuredCatalog.length > 0) {
      const staticKeys = new Set(
        loadProviderStaticCatalogRows().map((entry) => modelKey(entry.provider, entry.id)),
      );
      configuredCatalog = configuredCatalog.filter(
        (entry) => !staticKeys.has(modelKey(entry.provider, entry.id)),
      );
    }
    const catalogKeys = new Set(catalog.map((entry) => modelKey(entry.provider, entry.id)));
    const mergedCatalog = [...catalog];
    for (const entry of configuredCatalog) {
      const key = modelKey(entry.provider, entry.id);
      if (catalogKeys.has(key)) continue;
      catalogKeys.add(key);
      mergedCatalog.push(entry);
    }
    catalog = mergedCatalog;
  }
  catalog = await resolvePickerLogicalCatalog({
    cfg,
    catalog,
    routeVariants: catalogSnapshot.routeVariants,
    defaultProvider: DEFAULT_PROVIDER,
    defaultModel: resolved.model,
    ...(params.workspaceDir ? { workspaceDir: params.workspaceDir } : {}),
    view: "all",
    hasAuth,
  });
  if (catalog.length === 0 && allowedKeys.length === 0) {
    const noCatalogInitialKeys =
      existingKeys.length > 0 ? normalizeModelKeys([...existingKeys, ...fallbackKeys]) : [];
    const parsed = (
      (await params.prompter.text({
        message: params.message ?? t("wizard.model.allowlistText"),
        initialValue: noCatalogInitialKeys.join(", "),
        placeholder: "provider/model, other-provider/model",
      })) ?? ""
    )
      .split(",")
      .map((value) => value.trim())
      .filter((value) => value.length > 0);
    if (parsed.length === 0) return {};
    return { models: normalizeModelKeys(parsed) };
  }
  const literalPrefixProviders = await resolveLiteralPrefixProviderIds({
    cfg,
    workspaceDir: params.workspaceDir,
    env: params.env,
  });
  const isVisibleProvider = createModelPickerVisibleProviderPredicate({
    config: cfg,
    env: params.env,
    includeSetupRegistry: true,
  });
  const isVisibleModelRef = (ref) => {
    const separatorIndex = ref.indexOf("/");
    return separatorIndex <= 0 || isVisibleProvider(ref.slice(0, separatorIndex));
  };
  const options = [];
  const seen = /* @__PURE__ */ new Set();
  const allowedCatalog = (
    allowedKeySet
      ? catalog.filter((entry) => allowedKeySet.has(modelKey(entry.provider, entry.id)))
      : catalog
  ).filter((entry) => isVisibleProvider(entry.provider));
  const filteredCatalog =
    preferredProvider && allowedCatalog.some((entry) => matchesPreferredProvider?.(entry.provider))
      ? allowedCatalog.filter((entry) => matchesPreferredProvider?.(entry.provider))
      : allowedCatalog;
  const scopedConfiguredKeys =
    preferredProvider && !allowedKeySet
      ? existingKeys.filter((key) => {
          if (!isVisibleModelRef(key)) return false;
          const entry = splitModelKey(key);
          return entry ? matchesPreferredProvider?.(entry.provider) === true : false;
        })
      : [];
  const scopeKeys = allowedKeySet
    ? allowedKeys
    : preferredProvider
      ? normalizeModelKeys([
          ...filteredCatalog.map((entry) => modelKey(entry.provider, entry.id)),
          ...scopedConfiguredKeys,
        ])
      : void 0;
  const scopeKeySet = scopeKeys ? new Set(scopeKeys) : null;
  const selectableInitialSeeds =
    scopeKeySet && !allowedKeySet
      ? initialSeeds.filter((key) => scopeKeySet.has(key))
      : initialSeeds;
  const initialKeys = allowedKeySet
    ? initialSeeds.filter((key) => allowedKeySet.has(key))
    : selectableInitialSeeds.filter(isVisibleModelRef);
  for (const entry of filteredCatalog)
    await addModelSelectOption({
      entry,
      options,
      seen,
      aliasIndex,
      hasAuth,
      literalPrefixProviders,
      isVisibleProvider,
      resolveModelRouteRuntime,
    });
  const supplementalKeys = (allowedKeySet ? allowedKeys : selectableInitialSeeds).filter(
    isVisibleModelRef,
  );
  for (const key of supplementalKeys) {
    if (seen.has(key)) continue;
    options.push({
      value: key,
      label: key,
      hint: allowedKeySet
        ? t("wizard.model.allowedNotInCatalog")
        : t("wizard.model.configuredNotInCatalog"),
    });
    seen.add(key);
  }
  if (options.length === 0) return {};
  const selected = normalizeModelKeys(
    await params.prompter.multiselect({
      message: params.message ?? t("wizard.model.allowlistPicker"),
      options,
      initialValues: initialKeys.length > 0 ? initialKeys : void 0,
      searchable: true,
    }),
  );
  if (selected.length > 0)
    return {
      models: selected,
      ...(scopeKeys ? { scopeKeys } : {}),
    };
  if (scopeKeys) {
    if (
      !(await params.prompter.confirm({
        message: t("wizard.model.removeProviderModels"),
        initialValue: false,
      }))
    )
      return {};
    return {
      models: [],
      scopeKeys,
    };
  }
  if (existingKeys.length === 0) return { models: [] };
  if (
    !(await params.prompter.confirm({
      message: t("wizard.model.clearAllowlist"),
      initialValue: false,
    }))
  )
    return {};
  return { models: [] };
}
function applyModelAllowlist(cfg, models, opts = {}) {
  const defaults = cfg.agents?.defaults;
  const normalized = normalizeModelKeys(models);
  const scopeKeys = opts.scopeKeys ? normalizeModelKeys(opts.scopeKeys) : [];
  const scopeKeySet = scopeKeys.length > 0 ? new Set(scopeKeys) : null;
  if (normalized.length === 0) {
    if (!defaults?.models) return cfg;
    if (scopeKeySet) {
      const nextModels = { ...defaults.models };
      for (const key of scopeKeySet) delete nextModels[key];
      const { models: _ignored, ...restDefaults } = defaults;
      return {
        ...cfg,
        agents: {
          ...cfg.agents,
          defaults:
            Object.keys(nextModels).length > 0
              ? {
                  ...defaults,
                  models: nextModels,
                }
              : restDefaults,
        },
      };
    }
    const { models: _ignored, ...restDefaults } = defaults;
    return {
      ...cfg,
      agents: {
        ...cfg.agents,
        defaults: restDefaults,
      },
    };
  }
  const existingModels = normalizeAgentModelMapForConfig(defaults?.models ?? {});
  if (scopeKeySet) {
    const nextModels = { ...existingModels };
    for (const key of scopeKeySet) delete nextModels[key];
    for (const key of normalized) nextModels[key] = existingModels[key] ?? {};
    return {
      ...cfg,
      agents: {
        ...cfg.agents,
        defaults: {
          ...defaults,
          models: nextModels,
        },
      },
    };
  }
  const nextModels = {};
  for (const key of normalized) nextModels[key] = existingModels[key] ?? {};
  return {
    ...cfg,
    agents: {
      ...cfg.agents,
      defaults: {
        ...defaults,
        models: nextModels,
      },
    },
  };
}
function applyModelFallbacksFromSelection(cfg, selection, opts = {}) {
  const normalized = normalizeModelKeys(selection);
  const scopeKeys = opts.scopeKeys ? normalizeModelKeys(opts.scopeKeys) : [];
  const scopeKeySet = scopeKeys.length > 0 ? new Set(scopeKeys) : null;
  if (normalized.length === 0 && !scopeKeySet) return cfg;
  const resolved = resolveConfiguredModelRef({
    cfg,
    defaultProvider: DEFAULT_PROVIDER,
    defaultModel: DEFAULT_MODEL,
  });
  const resolvedKey = modelKey(resolved.provider, resolved.model);
  const includesResolvedPrimary = normalized.includes(resolvedKey);
  if (!includesResolvedPrimary && !scopeKeySet) return cfg;
  const defaults = cfg.agents?.defaults;
  const existingModel = defaults?.model;
  const existingPrimary =
    typeof existingModel === "string"
      ? existingModel
      : existingModel && typeof existingModel === "object"
        ? existingModel.primary
        : void 0;
  const normalizedExistingPrimary =
    existingPrimary != null ? normalizeAgentModelRefForConfig(existingPrimary) : void 0;
  const preservedModelFields =
    existingModel && typeof existingModel === "object"
      ? (({ fallbacks: _oldFallbacks, ...rest }) => rest)(existingModel)
      : {};
  const aliasIndex = buildModelAliasIndex({
    cfg,
    defaultProvider: resolved.provider,
  });
  const existingFallbacks =
    existingModel && typeof existingModel === "object" && Array.isArray(existingModel.fallbacks)
      ? resolveFallbackModelKeys({
          cfg,
          rawFallbacks: existingModel.fallbacks,
          defaultProvider: resolved.provider,
          aliasIndex,
        })
      : [];
  const existingFallbackSet = new Set(existingFallbacks);
  const rawSelectedFallbacks = normalized.filter((key) => key !== resolvedKey);
  const selectedFallbacks =
    scopeKeySet && !includesResolvedPrimary
      ? rawSelectedFallbacks.filter((key) => existingFallbackSet.has(key))
      : rawSelectedFallbacks;
  const isVisibleProvider = createModelPickerVisibleProviderPredicate({
    config: cfg,
    includeSetupRegistry: true,
  });
  const isVisibleModelRef = (ref) => {
    const separatorIndex = ref.indexOf("/");
    return separatorIndex <= 0 || isVisibleProvider(ref.slice(0, separatorIndex));
  };
  const fallbacks = mergeFallbackSelection({
    existingFallbacks,
    selectedFallbacks,
    preserveExistingFallback: scopeKeySet
      ? (fallback) => !scopeKeySet.has(fallback)
      : (fallback) => !isVisibleModelRef(fallback),
  });
  const nextModel = {
    ...preservedModelFields,
    ...(normalizedExistingPrimary != null ? { primary: normalizedExistingPrimary } : {}),
    ...(fallbacks.length > 0 ? { fallbacks } : {}),
  };
  if (Object.keys(nextModel).length === 0) {
    if (!defaults || !Object.hasOwn(defaults, "model")) return cfg;
    const { model: _ignoredModel, ...restDefaults } = defaults;
    return {
      ...cfg,
      agents: {
        ...cfg.agents,
        defaults: restDefaults,
      },
    };
  }
  return {
    ...cfg,
    agents: {
      ...cfg.agents,
      defaults: {
        ...defaults,
        model: nextModel,
      },
    },
  };
}
function mergeFallbackSelection(params) {
  const selected = new Set(params.selectedFallbacks);
  const fallbacks = [];
  for (const fallback of params.existingFallbacks) {
    if (params.preserveExistingFallback(fallback)) {
      fallbacks.push(fallback);
      continue;
    }
    if (selected.delete(fallback)) fallbacks.push(fallback);
  }
  for (const fallback of params.selectedFallbacks)
    if (selected.has(fallback)) fallbacks.push(fallback);
  return fallbacks;
}
//#endregion
export {
  promptModelAllowlist as i,
  applyModelFallbacksFromSelection as n,
  promptDefaultModel as r,
  applyModelAllowlist as t,
};
