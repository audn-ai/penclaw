import {
  a as resolveAgentDir,
  c as resolveDefaultAgentId,
  o as resolveAgentWorkspaceDir,
} from "./agent-scope-config-DVIR1nBa.js";
import "./agent-scope-y9xQv_q1.js";
import { n as openUrl } from "./browser-open-BIKaPeXy.js";
import { n as enablePluginInConfig } from "./enable-DK_lFguo.js";
import { n as t } from "./i18n-BDUMKn0X.js";
import { n as normalizeAgentModelRefForConfig } from "./model-input-B7OGjVYg.js";
import { t as formatLiteralProviderPrefixedModelRef } from "./model-ref-shared-Bs7ONe2Q.js";
import "./auth-profiles-CX7JDmZ9.js";
import { c as upsertAuthProfileWithLock } from "./profiles-DxTOoenK.js";
import "./workspace-DXzCbuC0.js";
import {
  n as applyProviderAuthConfigPatch,
  t as applyDefaultModel,
} from "./provider-auth-choice-helpers-CZAJOSgv.js";
import { n as resolveManifestProviderAuthChoice } from "./provider-auth-choices-LxMRetjr.js";
import { t as applyAuthProfileConfig } from "./provider-auth-helpers-CLs4Yz61.js";
import { r as resolveProviderInstallCatalogEntry } from "./provider-install-catalog-BrWdgyBm.js";
import { t as createVpsAwareOAuthHandlers } from "./provider-oauth-flow-CKUkw2zL.js";
import { t as isRemoteEnvironment } from "./remote-env-LtAgrReT.js";
import { t as sanitizeTerminalText } from "./safe-text-DiGQuw-e.js";
import { n as resolveDefaultAgentWorkspaceDir } from "./workspace-default-h9TzWSvp.js";
//#region src/plugins/provider-auth-choice.ts
function formatModelRefForDisplay(modelRef, provider) {
  if (!provider.preserveLiteralProviderPrefix) return modelRef;
  return formatLiteralProviderPrefixedModelRef(provider.id, modelRef);
}
function restoreConfiguredPrimaryModel(nextConfig, originalConfig) {
  const originalModel = originalConfig.agents?.defaults?.model;
  const nextAgents = nextConfig.agents;
  const nextDefaults = nextAgents?.defaults;
  if (!nextDefaults) return nextConfig;
  if (originalModel !== void 0)
    return {
      ...nextConfig,
      agents: {
        ...nextAgents,
        defaults: {
          ...nextDefaults,
          model: originalModel,
        },
      },
    };
  const { model: _model, ...restDefaults } = nextDefaults;
  return {
    ...nextConfig,
    agents: {
      ...nextAgents,
      defaults: restDefaults,
    },
  };
}
function resolveConfiguredDefaultModelPrimary(cfg) {
  const model = cfg.agents?.defaults?.model;
  if (typeof model === "string") return model;
  if (model && typeof model === "object" && typeof model.primary === "string") return model.primary;
}
async function noteDefaultModelResult(params) {
  const selectedModelDisplay = params.selectedModelDisplay ?? params.selectedModel;
  if (
    params.preserveExistingDefaultModel === true &&
    params.previousPrimary &&
    params.previousPrimary !== params.selectedModel
  ) {
    await params.prompter.note(
      t("wizard.model.keptExistingDefault", {
        current: params.previousPrimary,
        selected: selectedModelDisplay,
      }),
      t("wizard.model.configuredTitle"),
    );
    return;
  }
  await params.prompter.note(
    t("wizard.model.defaultSet", { model: selectedModelDisplay }),
    t("wizard.model.configuredTitle"),
  );
}
async function applyDefaultModelFromAuthChoice(params) {
  const defaultModelBaseConfig = params.configBeforeProviderAuth ?? params.config;
  const previousPrimary = resolveConfiguredDefaultModelPrimary(defaultModelBaseConfig);
  const preservesDifferentPrimary =
    params.preserveExistingDefaultModel === true &&
    previousPrimary !== void 0 &&
    previousPrimary !== params.selectedModel;
  let nextConfig = applyDefaultModel(
    params.preserveExistingDefaultModel === true
      ? restoreConfiguredPrimaryModel(params.config, defaultModelBaseConfig)
      : params.config,
    params.selectedModel,
    { preserveExistingPrimary: params.preserveExistingDefaultModel === true },
  );
  if (!preservesDifferentPrimary) {
    const { CODEX_RUNTIME_PLUGIN_ID, ensureCodexRuntimePluginForModelSelection } =
      await import("./codex-runtime-plugin-install-BKeHdWRp.js");
    const codexInstall = await ensureCodexRuntimePluginForModelSelection({
      cfg: nextConfig,
      model: params.selectedModel,
      prompter: params.prompter,
      runtime: params.runtime,
      ...(params.workspaceDir !== void 0 ? { workspaceDir: params.workspaceDir } : {}),
    });
    nextConfig = codexInstall.cfg;
    await params.runSelectedModelHook(nextConfig);
    if (codexInstall.installed) {
      const { offerPostInstallMigrations } =
        await import("./setup.post-install-migration-BulVxiKp.js");
      nextConfig = (
        await offerPostInstallMigrations({
          config: nextConfig,
          runtime: params.runtime,
          prompter: params.prompter,
          installedPluginIds: [CODEX_RUNTIME_PLUGIN_ID],
        })
      ).config;
    }
    const { ensureCopilotRuntimePluginForModelSelection } =
      await import("./copilot-runtime-plugin-install-Dd2-3RUZ.js");
    nextConfig = (
      await ensureCopilotRuntimePluginForModelSelection({
        cfg: nextConfig,
        model: params.selectedModel,
        prompter: params.prompter,
        runtime: params.runtime,
        ...(params.workspaceDir !== void 0 ? { workspaceDir: params.workspaceDir } : {}),
      })
    ).cfg;
  }
  await noteDefaultModelResult({
    previousPrimary,
    selectedModel: params.selectedModel,
    selectedModelDisplay: params.selectedModelDisplay,
    preserveExistingDefaultModel: params.preserveExistingDefaultModel,
    prompter: params.prompter,
  });
  return nextConfig;
}
async function loadPluginProviderRuntime() {
  return await import("./provider-auth-choice.runtime.js");
}
function resolveManifestAuthChoiceScope(params) {
  return resolveManifestProviderAuthChoice(params.authChoice, {
    config: params.config,
    workspaceDir: params.workspaceDir,
    env: params.env,
    includeUntrustedWorkspacePlugins: false,
  });
}
function withProviderPluginId(provider, pluginId) {
  return provider.pluginId === pluginId
    ? provider
    : {
        ...provider,
        pluginId,
      };
}
async function runProviderPluginAuthMethodUnpersisted(params) {
  return await params.method.run({
    config: params.config,
    env: params.env,
    agentDir: params.agentDir,
    workspaceDir: params.workspaceDir,
    prompter: params.prompter,
    runtime: params.runtime,
    ...(params.signal ? { signal: params.signal } : {}),
    opts: params.opts,
    secretInputMode: params.secretInputMode,
    allowSecretRefPrompt: params.allowSecretRefPrompt,
    isRemote: params.isRemote ?? isRemoteEnvironment(),
    openUrl: async (url) => {
      if (params.isRemote === true) {
        await params.prompter.openUrl?.(url);
        return;
      }
      await openUrl(url);
    },
    oauth: { createVpsAwareHandlers: (opts) => createVpsAwareOAuthHandlers(opts) },
  });
}
function applyProviderPluginAuthMethodResultConfig(params) {
  const { result } = params;
  let nextConfig = params.config;
  if (result.configPatch)
    nextConfig = applyProviderAuthConfigPatch(nextConfig, result.configPatch, {
      replaceDefaultModels: result.replaceDefaultModels,
    });
  for (const profile of result.profiles)
    nextConfig = applyAuthProfileConfig(nextConfig, {
      profileId: profile.profileId,
      provider: profile.credential.provider,
      mode: profile.credential.type === "token" ? "token" : profile.credential.type,
      ...("email" in profile.credential && profile.credential.email
        ? { email: profile.credential.email }
        : {}),
      ...("displayName" in profile.credential && profile.credential.displayName
        ? { displayName: profile.credential.displayName }
        : {}),
    });
  return nextConfig;
}
async function runProviderPluginAuthMethod(params) {
  const agentId = params.agentId ?? resolveDefaultAgentId(params.config);
  const agentDir = params.agentDir ?? resolveAgentDir(params.config, agentId);
  const workspaceDir =
    params.workspaceDir ??
    resolveAgentWorkspaceDir(params.config, agentId) ??
    resolveDefaultAgentWorkspaceDir();
  const result = await runProviderPluginAuthMethodUnpersisted({
    config: params.config,
    env: params.env,
    runtime: params.runtime,
    prompter: params.prompter,
    method: params.method,
    agentDir,
    workspaceDir,
    secretInputMode: params.secretInputMode,
    allowSecretRefPrompt: params.allowSecretRefPrompt,
    opts: params.opts,
  });
  for (const profile of result.profiles)
    await upsertAuthProfileWithLockOrThrow({
      profileId: profile.profileId,
      credential: profile.credential,
      agentDir,
    });
  const nextConfig = applyProviderPluginAuthMethodResultConfig({
    config: params.config,
    result,
  });
  if (params.emitNotes !== false && result.notes && result.notes.length > 0)
    await params.prompter.note(result.notes.join("\n"), "Provider notes");
  const defaultModel = result.defaultModel
    ? normalizeAgentModelRefForConfig(result.defaultModel)
    : void 0;
  return {
    config: nextConfig,
    ...(defaultModel ? { defaultModel } : {}),
  };
}
async function applyAuthChoiceLoadedPluginProvider(params) {
  const agentId = params.agentId ?? resolveDefaultAgentId(params.config);
  const workspaceDir =
    resolveAgentWorkspaceDir(params.config, agentId) ?? resolveDefaultAgentWorkspaceDir();
  let nextConfig = params.config;
  let enabledConfig = params.config;
  const {
    resolvePluginProviders,
    resolvePluginSetupProvider,
    resolveProviderPluginChoice,
    runProviderModelSelectedHook,
  } = await loadPluginProviderRuntime();
  const manifestAuthChoice = resolveManifestAuthChoiceScope({
    authChoice: params.authChoice,
    config: nextConfig,
    workspaceDir,
    env: params.env,
  });
  const installCatalogEntry = resolveProviderInstallCatalogEntry(params.authChoice, {
    config: nextConfig,
    workspaceDir,
    env: params.env,
    includeUntrustedWorkspacePlugins: false,
  });
  const choicePlugin = manifestAuthChoice
    ? {
        pluginId: manifestAuthChoice.pluginId,
        label: manifestAuthChoice.choiceLabel,
      }
    : installCatalogEntry
      ? {
          pluginId: installCatalogEntry.pluginId,
          label: installCatalogEntry.label,
        }
      : void 0;
  if (choicePlugin) {
    const enableResult = enablePluginInConfig(nextConfig, choicePlugin.pluginId);
    if (!enableResult.enabled) {
      const safeLabel = sanitizeTerminalText(choicePlugin.label);
      await params.prompter.note(
        `${safeLabel} plugin is disabled (${enableResult.reason ?? "blocked"}).`,
        safeLabel,
      );
      return { config: nextConfig };
    }
    enabledConfig = enableResult.config;
  }
  const resolveScopedRuntimeProviders = (config) =>
    resolvePluginProviders({
      config,
      workspaceDir,
      env: params.env,
      mode: "setup",
      ...(manifestAuthChoice ? { onlyPluginIds: [manifestAuthChoice.pluginId] } : {}),
    });
  const setupProvider = manifestAuthChoice
    ? resolvePluginSetupProvider({
        provider: manifestAuthChoice.providerId,
        config: enabledConfig,
        workspaceDir,
        env: params.env,
        pluginIds: [manifestAuthChoice.pluginId],
      })
    : void 0;
  let providers = setupProvider
    ? [withProviderPluginId(setupProvider, manifestAuthChoice.pluginId)]
    : resolveScopedRuntimeProviders(enabledConfig);
  let resolved = resolveProviderPluginChoice({
    providers,
    choice: params.authChoice,
  });
  if (!resolved && setupProvider) {
    providers = resolveScopedRuntimeProviders(enabledConfig);
    resolved = resolveProviderPluginChoice({
      providers,
      choice: params.authChoice,
    });
  }
  if (!resolved && installCatalogEntry) {
    const { ensureOnboardingPluginInstalled } =
      await import("./onboarding-plugin-install-DCRPcBnf.js");
    const installResult = await ensureOnboardingPluginInstalled({
      cfg: nextConfig,
      entry: {
        pluginId: installCatalogEntry.pluginId,
        label: installCatalogEntry.label,
        install: installCatalogEntry.install,
        ...(installCatalogEntry.origin === "bundled"
          ? { trustedSourceLinkedOfficialInstall: true }
          : {}),
      },
      prompter: params.prompter,
      runtime: params.runtime,
      workspaceDir,
    });
    if (!installResult.installed)
      return {
        config: installResult.cfg,
        retrySelection: true,
      };
    nextConfig = installResult.cfg;
    providers = resolveScopedRuntimeProviders(nextConfig);
    resolved = resolveProviderPluginChoice({
      providers,
      choice: params.authChoice,
    });
  }
  if (!resolved)
    return nextConfig === params.config
      ? null
      : {
          config: nextConfig,
          retrySelection: true,
        };
  if (nextConfig === params.config && enabledConfig !== params.config) nextConfig = enabledConfig;
  const configBeforeProviderAuth = nextConfig;
  const applied = await runProviderPluginAuthMethod({
    config: nextConfig,
    env: params.env,
    runtime: params.runtime,
    prompter: params.prompter,
    method: resolved.method,
    agentDir: params.agentDir,
    agentId: params.agentId,
    workspaceDir,
    secretInputMode: params.opts?.secretInputMode,
    allowSecretRefPrompt: false,
    opts: params.opts,
  });
  nextConfig = applied.config;
  let agentModelOverride;
  if (applied.defaultModel) {
    const selectedModel = applied.defaultModel;
    const selectedModelDisplay = formatModelRefForDisplay(selectedModel, resolved.provider);
    if (params.setDefaultModel) {
      nextConfig = await applyDefaultModelFromAuthChoice({
        config: nextConfig,
        configBeforeProviderAuth,
        selectedModel,
        selectedModelDisplay,
        preserveExistingDefaultModel: params.preserveExistingDefaultModel,
        prompter: params.prompter,
        runtime: params.runtime,
        workspaceDir,
        runSelectedModelHook: async (config) => {
          await runProviderModelSelectedHook({
            config,
            model: selectedModel,
            prompter: params.prompter,
            agentDir: params.agentDir,
            workspaceDir,
          });
        },
      });
      return { config: nextConfig };
    }
    nextConfig = restoreConfiguredPrimaryModel(nextConfig, params.config);
    agentModelOverride = selectedModel;
  }
  return {
    config: nextConfig,
    agentModelOverride,
  };
}
async function upsertAuthProfileWithLockOrThrow(params) {
  if (!(await upsertAuthProfileWithLock(params)))
    throw new Error(
      "Failed to update auth profile store; the auth store lock may be busy. Wait a moment and retry.",
    );
}
//#endregion
export {
  runProviderPluginAuthMethodUnpersisted as i,
  applyProviderPluginAuthMethodResultConfig as n,
  runProviderPluginAuthMethod as r,
  applyAuthChoiceLoadedPluginProvider as t,
};
