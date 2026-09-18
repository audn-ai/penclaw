import { s as resolveDefaultAgentDir } from "./agent-scope-config-DVIR1nBa.js";
import { r as resolveDefaultModelForAgent } from "./codex-plugin-diagnostics-DxsLhCf5.js";
import {
  c as normalizePluginsConfig,
  l as resolveEffectiveEnableState,
} from "./config-state-C1Qyxaws.js";
import { n as enablePluginInConfig } from "./enable-DK_lFguo.js";
import { n as t } from "./i18n-BDUMKn0X.js";
import { i as hasAuthProfileForProvider } from "./model-config.helpers-YCqd3cyK.js";
import { i as resolveAgentModelPrimaryValue } from "./model-input-B7OGjVYg.js";
import { t as resolveAgentHarnessPolicy } from "./policy-C704eijA.js";
import { i as resolveWebSearchProviderId } from "./runtime-Inp394Wl.js";
import "./model-selection-DOlkTrQa.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { t as sortFlowContributionsByLabel } from "./types-CnTXyUgM.js";
import {
  c as hasConfiguredSecretInput,
  p as normalizeSecretInputString,
  t as DEFAULT_SECRET_PROVIDER_ALIAS,
} from "./types.secrets-BV0ywRAy.js";
import { t as resolveWebSearchInstallCatalogEntries } from "./web-search-install-catalog-BFwolsTM.js";
import { t as resolvePluginWebSearchProviders } from "./web-search-providers.runtime.js";
import { n as sortWebSearchProviders } from "./web-search-providers.shared-CArHDy3x.js";
//#region src/flows/search-setup.ts
const SEARCH_INSTALL_CATALOG_ENTRY = Symbol("search-install-catalog-entry");
const WEB_SEARCH_DOCS_URL = "https://docs.openclaw.ai/tools/web";
const CODEX_HOSTED_SEARCH_PROVIDER_ID = "codex";
function resolveSearchProviderCredentialLabel(entry) {
  if (entry.requiresCredential === false) return `${entry.label} setup`;
  return normalizeOptionalString(entry.credentialLabel) || `${entry.label} API key`;
}
function listSearchProviderOptions(config) {
  return resolveSearchProviderOptions(config);
}
function showsSearchProviderInSetup(entry) {
  return entry.onboardingScopes?.includes("text-inference") ?? false;
}
function resolveSearchProviderOptions(config) {
  return resolveSearchProviderSetupContributions(config).map(
    (contribution) => contribution.provider,
  );
}
function buildSearchProviderSetupContribution(params) {
  return {
    id: `search:setup:${params.provider.id}`,
    kind: "search",
    surface: "setup",
    provider: params.provider,
    option: {
      value: params.provider.id,
      label: params.provider.label,
      ...(params.provider.hint ? { hint: params.provider.hint } : {}),
      ...(params.provider.docsUrl ? { docs: { path: params.provider.docsUrl } } : {}),
    },
    source: params.source,
  };
}
function resolveSearchProviderSetupContributions(config) {
  const runtimeProviders = sortWebSearchProviders(
    resolvePluginWebSearchProviders({
      config,
      env: process.env,
      mode: "setup",
    }),
  );
  const seenProviderIds = new Set(runtimeProviders.map((provider) => provider.id));
  const seenPluginIds = new Set(runtimeProviders.map((provider) => provider.pluginId));
  const normalizedPluginsConfig = normalizePluginsConfig(config?.plugins);
  const installCatalogProviders = resolveWebSearchInstallCatalogEntries()
    .filter(
      (entry) =>
        !seenProviderIds.has(entry.provider.id) &&
        !seenPluginIds.has(entry.pluginId) &&
        resolveEffectiveEnableState({
          id: entry.pluginId,
          origin: "global",
          config: normalizedPluginsConfig,
          rootConfig: config,
          enabledByDefault: true,
        }).enabled,
    )
    .map((entry) => Object.assign({}, entry.provider, { [SEARCH_INSTALL_CATALOG_ENTRY]: entry }));
  return sortFlowContributionsByLabel(
    sortWebSearchProviders([...runtimeProviders, ...installCatalogProviders])
      .filter(showsSearchProviderInSetup)
      .map((provider) =>
        buildSearchProviderSetupContribution({
          provider,
          source: SEARCH_INSTALL_CATALOG_ENTRY in provider ? "install-catalog" : "runtime",
        }),
      ),
  );
}
function defaultModelUsesCodexRuntime(config) {
  if (!resolveAgentModelPrimaryValue(config.agents?.defaults?.model)) return false;
  const defaultModel = resolveDefaultModelForAgent({ cfg: config });
  if (defaultModel.provider === CODEX_HOSTED_SEARCH_PROVIDER_ID) return true;
  return (
    resolveAgentHarnessPolicy({
      provider: defaultModel.provider,
      modelId: defaultModel.model,
      config,
    }).runtime === "codex"
  );
}
function prioritizeSearchProvider(providers, preferredProvider) {
  if (!preferredProvider) return [...providers];
  const preferred = providers.find((provider) => provider.id === preferredProvider);
  if (!preferred) return [...providers];
  return [preferred, ...providers.filter((provider) => provider.id !== preferredProvider)];
}
function resolveSearchProviderEntry(config, provider) {
  return resolveSearchProviderOptions(config).find((entry) => entry.id === provider);
}
function hasKeyInEnv(entry) {
  return entry.envVars.some((k) => Boolean(normalizeOptionalString(process.env[k])));
}
function providerNeedsCredential(entry) {
  return entry.requiresCredential !== false;
}
function formatAuthProviderLabel(providerId) {
  return providerId === "xai" ? "xAI" : providerId;
}
function providerIsReady(config, entry) {
  if (!providerNeedsCredential(entry)) return true;
  if (
    entry.authProviderId &&
    hasAuthProfileForProvider({
      provider: entry.authProviderId,
      agentDir: resolveDefaultAgentDir(config),
    })
  )
    return true;
  return hasExistingKey(config, entry.id) || hasKeyInEnv(entry);
}
function formatSearchProviderOptionLabel(label, note) {
  const normalizedNote = normalizeOptionalString(note);
  return normalizedNote ? `${label} (${normalizedNote})` : label;
}
function rawKeyValue(config, provider) {
  return resolveSearchProviderEntry(config, provider)?.getConfiguredCredentialValue?.(config);
}
function resolveExistingKey(config, provider) {
  return normalizeSecretInputString(rawKeyValue(config, provider));
}
function hasExistingKey(config, provider) {
  return hasConfiguredSecretInput(rawKeyValue(config, provider));
}
function buildSearchEnvRef(config, provider) {
  const entry =
    resolveSearchProviderEntry(config, provider) ??
    listSearchProviderOptions(config).find((candidate) => candidate.id === provider) ??
    listSearchProviderOptions().find((candidate) => candidate.id === provider);
  const resolvedEnvVar =
    entry?.envVars.find((k) => Boolean(normalizeOptionalString(process.env[k]))) ??
    entry?.envVars[0];
  if (!resolvedEnvVar)
    throw new Error(
      `No env var mapping for search provider "${provider}" at ${entry?.credentialPath ?? "unknown path"} in secret-input-mode=ref.`,
    );
  return {
    source: "env",
    provider: DEFAULT_SECRET_PROVIDER_ALIAS,
    id: resolvedEnvVar,
  };
}
function resolveSearchSecretInput(config, provider, key, secretInputMode) {
  if (secretInputMode === "ref") return buildSearchEnvRef(config, provider);
  return key;
}
function applySearchKey(config, provider, key) {
  const providerEntry = resolveSearchProviderEntry(config, provider);
  if (!providerEntry) return config;
  const search = {
    ...config.tools?.web?.search,
    provider,
    enabled: true,
  };
  if (!providerEntry.setConfiguredCredentialValue) providerEntry.setCredentialValue(search, key);
  const next = applySearchProviderSelectionConfig(
    {
      ...config,
      tools: {
        ...config.tools,
        web: {
          ...config.tools?.web,
          search,
        },
      },
    },
    providerEntry,
  );
  providerEntry.setConfiguredCredentialValue?.(next, key);
  return next;
}
function applySearchProviderSelectionConfig(config, providerEntry) {
  if (providerEntry.applySelectionConfig) return providerEntry.applySelectionConfig(config);
  if (providerEntry.pluginId) return enablePluginInConfig(config, providerEntry.pluginId).config;
  return config;
}
function applySearchProviderSelection(config, provider) {
  const providerEntry = resolveSearchProviderEntry(config, provider);
  if (!providerEntry) return config;
  const search = {
    ...config.tools?.web?.search,
    provider,
    enabled: true,
  };
  return applySearchProviderSelectionConfig(
    {
      ...config,
      tools: {
        ...config.tools,
        web: {
          ...config.tools?.web,
          search,
        },
      },
    },
    providerEntry,
  );
}
function preserveDisabledState(original, result) {
  if (original.tools?.web?.search?.enabled !== false) return result;
  const next = {
    ...result,
    tools: {
      ...result.tools,
      web: {
        ...result.tools?.web,
        search: {
          ...result.tools?.web?.search,
          enabled: false,
        },
      },
    },
  };
  const provider = next.tools?.web?.search?.provider;
  if (typeof provider !== "string") return next;
  const providerEntry = resolveSearchProviderEntry(original, provider);
  if (!providerEntry?.pluginId) return next;
  const pluginId = providerEntry.pluginId;
  const originalPluginEntry = original.plugins?.entries?.[pluginId];
  const resultPluginEntry = next.plugins?.entries?.[pluginId];
  const nextPlugins = { ...next.plugins };
  if (Array.isArray(original.plugins?.allow)) nextPlugins.allow = [...original.plugins.allow];
  else delete nextPlugins.allow;
  if (resultPluginEntry || originalPluginEntry) {
    const nextEntries = { ...nextPlugins.entries };
    const patchedEntry = { ...resultPluginEntry };
    if (typeof originalPluginEntry?.enabled === "boolean")
      patchedEntry.enabled = originalPluginEntry.enabled;
    else delete patchedEntry.enabled;
    nextEntries[pluginId] = patchedEntry;
    nextPlugins.entries = nextEntries;
  }
  return {
    ...next,
    plugins: nextPlugins,
  };
}
async function finalizeSearchProviderSetup(params) {
  let next = params.nextConfig;
  const installEntry = params.entry[SEARCH_INSTALL_CATALOG_ENTRY];
  if (installEntry && next.tools?.web?.search?.enabled !== false) {
    const { ensureOnboardingPluginInstalled } =
      await import("./onboarding-plugin-install-DCRPcBnf.js");
    const installed = await ensureOnboardingPluginInstalled({
      cfg: next,
      entry: {
        pluginId: installEntry.pluginId,
        label: installEntry.label,
        install: installEntry.install,
        ...(installEntry.trustedSourceLinkedOfficialInstall
          ? { trustedSourceLinkedOfficialInstall: true }
          : {}),
      },
      prompter: params.prompter,
      runtime: params.runtime,
      autoConfirmSingleSource: true,
    });
    if (!installed.installed) return params.originalConfig;
    next = installed.cfg;
  }
  if (params.opts?.preserveDisabledSearchState !== false)
    next = preserveDisabledState(params.originalConfig, next);
  if (!params.entry.runSetup) return next;
  next = await params.entry.runSetup({
    config: next,
    runtime: params.runtime,
    prompter: params.prompter,
    quickstartDefaults: params.opts?.quickstartDefaults,
    secretInputMode: params.opts?.secretInputMode,
  });
  return params.opts?.preserveDisabledSearchState === false
    ? next
    : preserveDisabledState(params.originalConfig, next);
}
async function runSearchSetupFlow(config, runtime, prompter, opts) {
  const availableProviderOptions = resolveSearchProviderOptions(config);
  const codexRecommended =
    defaultModelUsesCodexRuntime(config) &&
    availableProviderOptions.some((entry) => entry.id === CODEX_HOSTED_SEARCH_PROVIDER_ID);
  const providerOptions = prioritizeSearchProvider(
    availableProviderOptions,
    codexRecommended ? CODEX_HOSTED_SEARCH_PROVIDER_ID : void 0,
  );
  if (providerOptions.length === 0) {
    await prompter.note(
      [
        t("wizard.search.noProvidersByPolicy"),
        t("wizard.search.noProvidersAction"),
        t("wizard.search.docsLine", { url: WEB_SEARCH_DOCS_URL }),
      ].join("\n"),
      t("wizard.search.title"),
    );
    return config;
  }
  await prompter.note(
    [
      t("wizard.search.intro"),
      t("wizard.search.chooseProvider"),
      t("wizard.search.docsLine", { url: WEB_SEARCH_DOCS_URL }),
    ].join("\n"),
    t("wizard.search.title"),
  );
  const existingProvider = config.tools?.web?.search?.provider;
  const defaultChoice = (() => {
    if (existingProvider && providerOptions.some((entry) => entry.id === existingProvider))
      return existingProvider;
    if (codexRecommended) return CODEX_HOSTED_SEARCH_PROVIDER_ID;
    const autoDetectedId = resolveWebSearchProviderId({
      config,
      search: {
        ...config.tools?.web?.search,
        provider: void 0,
      },
      providers: [...providerOptions],
    });
    const autoDetected = providerOptions.find((entry) => entry.id === autoDetectedId);
    if (autoDetected) return autoDetected.id;
    const detected = providerOptions.find(
      (entry) => providerNeedsCredential(entry) && providerIsReady(config, entry),
    );
    if (detected) return detected.id;
    return "__skip__";
  })();
  const options = providerOptions.map((entry) => {
    const credentialHint =
      entry.requiresCredential === false
        ? t("wizard.search.keyFree")
        : providerIsReady(config, entry)
          ? t("wizard.search.configured")
          : entry.credentialLabel
            ? t("wizard.search.credentialRequired", { label: entry.credentialLabel })
            : t("wizard.search.apiKeyRequired");
    const hint = [normalizeOptionalString(entry.hint), credentialHint].filter(Boolean).join(" · ");
    return {
      value: entry.id,
      label: formatSearchProviderOptionLabel(entry.label, hint),
    };
  });
  const choice = await prompter.select({
    message: t("wizard.search.providerPrompt"),
    options: [
      ...options,
      {
        value: "__skip__",
        label: t("common.skipForNow"),
        hint: t("wizard.search.configureLaterHint"),
      },
    ],
    initialValue: defaultChoice,
    searchable: true,
  });
  if (choice === "__skip__") return config;
  const entry =
    resolveSearchProviderEntry(config, choice) ?? providerOptions.find((e) => e.id === choice);
  if (!entry) return config;
  const finalizeSelection = (nextConfig) =>
    finalizeSearchProviderSetup({
      originalConfig: config,
      nextConfig,
      entry,
      runtime,
      prompter,
      opts,
    });
  const credentialLabel = resolveSearchProviderCredentialLabel(entry);
  const existingKey = resolveExistingKey(config, choice);
  const keyConfigured = hasExistingKey(config, choice);
  const envAvailable = hasKeyInEnv(entry);
  const agentDir = resolveDefaultAgentDir(config);
  const authProviderId = entry.authProviderId;
  const providerAuthProfileAvailable = authProviderId
    ? hasAuthProfileForProvider({
        provider: authProviderId,
        agentDir,
      })
    : false;
  const oauthAuthProfileAvailable =
    authProviderId && providerAuthProfileAvailable
      ? hasAuthProfileForProvider({
          provider: authProviderId,
          agentDir,
          type: "oauth",
        })
      : false;
  const needsCredential = providerNeedsCredential(entry);
  if (opts?.quickstartDefaults && (providerAuthProfileAvailable || keyConfigured || envAvailable))
    return await finalizeSelection(
      existingKey
        ? applySearchKey(config, choice, existingKey)
        : applySearchProviderSelection(config, choice),
    );
  if (!needsCredential) {
    await prompter.note(
      [
        `${entry.label} works without an API key.`,
        "OpenClaw will enable the plugin and use it as your web_search provider.",
        `Docs: ${entry.docsUrl ?? "https://docs.openclaw.ai/tools/web"}`,
      ].join("\n"),
      "Web search",
    );
    return await finalizeSelection(applySearchProviderSelection(config, choice));
  }
  if (entry.credentialNote) await prompter.note(entry.credentialNote, entry.label);
  if (oauthAuthProfileAvailable && authProviderId) {
    const authProviderLabel = formatAuthProviderLabel(authProviderId);
    await prompter.note(
      [
        `${entry.label} can use your existing ${authProviderLabel} OAuth sign-in for web_search.`,
        "No separate API key is required; API-key auth remains available as a fallback.",
        `Docs: ${entry.docsUrl ?? WEB_SEARCH_DOCS_URL}`,
      ].join("\n"),
      "Web search",
    );
    return await finalizeSelection(applySearchProviderSelection(config, choice));
  }
  if (providerAuthProfileAvailable && authProviderId) {
    const authProviderLabel = formatAuthProviderLabel(authProviderId);
    await prompter.note(
      [
        `${entry.label} can use your existing ${authProviderLabel} auth profile for web_search.`,
        "No separate web-search key is required; API-key auth remains available as a fallback.",
        `Docs: ${entry.docsUrl ?? WEB_SEARCH_DOCS_URL}`,
      ].join("\n"),
      "Web search",
    );
    return await finalizeSelection(applySearchProviderSelection(config, choice));
  }
  if (opts?.secretInputMode === "ref") {
    if (keyConfigured) return await finalizeSelection(applySearchProviderSelection(config, choice));
    const ref = buildSearchEnvRef(config, choice);
    await prompter.note(
      [
        "Secret references enabled — OpenClaw will store a reference instead of the API key.",
        `Env var: ${ref.id}${envAvailable ? " (detected)" : ""}.`,
        ...(envAvailable ? [] : [`Set ${ref.id} in the Gateway environment.`]),
        "Docs: https://docs.openclaw.ai/tools/web",
      ].join("\n"),
      "Web search",
    );
    return await finalizeSelection(applySearchKey(config, choice, ref));
  }
  const key =
    normalizeOptionalString(
      await prompter.text({
        message: keyConfigured
          ? `${credentialLabel} (leave blank to keep current)`
          : envAvailable
            ? `${credentialLabel} (leave blank to use env var)`
            : credentialLabel,
        placeholder: keyConfigured ? "Leave blank to keep current" : entry.placeholder,
        sensitive: true,
      }),
    ) ?? "";
  if (key)
    return await finalizeSelection(
      applySearchKey(
        config,
        choice,
        resolveSearchSecretInput(config, choice, key, opts?.secretInputMode),
      ),
    );
  if (existingKey) return await finalizeSelection(applySearchKey(config, choice, existingKey));
  if (keyConfigured || envAvailable)
    return await finalizeSelection(applySearchProviderSelection(config, choice));
  await prompter.note(
    [
      `No ${credentialLabel} stored — web_search won't work until a key is available.`,
      `Get your key at: ${entry.signupUrl}`,
      "Docs: https://docs.openclaw.ai/tools/web",
    ].join("\n"),
    "Web search",
  );
  const search = {
    ...config.tools?.web?.search,
    enabled: false,
    provider: choice,
  };
  return applySearchProviderSelectionConfig(
    {
      ...config,
      tools: {
        ...config.tools,
        web: {
          ...config.tools?.web,
          search,
        },
      },
    },
    entry,
  );
}
//#endregion
export {
  applySearchKey,
  applySearchProviderSelection,
  hasExistingKey,
  hasKeyInEnv,
  listSearchProviderOptions,
  resolveExistingKey,
  resolveSearchProviderOptions,
  runSearchSetupFlow as setupSearch,
};
