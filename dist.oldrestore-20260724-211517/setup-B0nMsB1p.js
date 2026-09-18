import { t as formatCliCommand } from "./command-format-H_Arqann.js";
import { u as withConsoleSubsystemsSuppressed } from "./console-CspqtrUy.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import { n as t } from "./i18n-BDUMKn0X.js";
import "./utils-DtcDeqWS.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-B-Fc-m0I.js";
import { i as resolveAgentModelPrimaryValue } from "./model-input-B7OGjVYg.js";
import { f as resolveGatewayPort } from "./paths-DEklnbzU.js";
import { n as WizardNavigationError, t as WizardCancelledError } from "./prompts-B0iOB1_a.js";
import { r as normalizeProviderId } from "./provider-id-BIcU_2-A.js";
import "./config-BDv-QbJ6.js";
import { r as defaultRuntime } from "./runtime-Bz6o617W.js";
import {
  n as listSetupMigrationOptions,
  r as runSetupMigrationImport,
  t as detectSetupMigrationSources,
} from "./setup.migration-import-DEDo12vj.js";
import { t as resolveSetupSecretInputString } from "./setup.secret-input-CSZyNx9j.js";
import {
  a as resolveQuickstartGatewayDefaults,
  i as requireRiskAcknowledgement,
  n as readSetupConfigFileSnapshot,
  o as writeWizardConfigFile,
  r as readValidSetupConfigFile,
} from "./setup.shared-p7f7ug1s.js";
import {
  c as formatPluginCompatibilityNotice,
  r as buildPluginCompatibilitySnapshotNotices,
} from "./status-V8msAxCA.js";
import { p as normalizeSecretInputString } from "./types.secrets-BV0ywRAy.js";
//#region src/wizard/navigation-prompter.ts
function inertProgress() {
  return {
    update: () => {},
    stop: () => {},
  };
}
function stableKey(value) {
  if (value === void 0) return "undefined";
  try {
    return JSON.stringify(value);
  } catch {
    return Object.prototype.toString.call(value);
  }
}
function optionSignature(options) {
  return stableKey(options.map((option) => [stableKey(option.value), option.label]));
}
function buildPromptSignature(kind, params) {
  return stableKey({
    kind,
    message: params.message,
    options: params.options ? optionSignature(params.options) : void 0,
    layout: params.layout,
  });
}
function applyNavigation(params, navigation) {
  return {
    ...params,
    navigation,
  };
}
var WizardPromptNavigator = class {
  constructor(base) {
    this.base = base;
    this.cursor = 0;
    this.restartRequested = false;
    this.backNavigationDisabled = false;
    this.records = [];
    this.prompter = {
      intro: async (title) => {
        if (!this.shouldSuppressOutput()) await this.base.intro(title);
      },
      outro: async (message) => {
        if (!this.shouldSuppressOutput()) await this.base.outro(message);
      },
      note: async (message, title) => {
        if (!this.shouldSuppressOutput()) await this.base.note(message, title);
      },
      plain: async (message) => {
        if (!this.shouldSuppressOutput()) await this.base.plain?.(message);
      },
      select: async (params) =>
        await this.prompt({
          kind: "select",
          params,
          signature: buildPromptSignature("select", params),
          cacheAnswer: true,
          withInitial: (nextParams, answer) => ({
            ...nextParams,
            initialValue: answer,
          }),
          call: (nextParams) => this.base.select(nextParams),
        }),
      multiselect: async (params) =>
        await this.prompt({
          kind: "multiselect",
          params,
          signature: buildPromptSignature("multiselect", params),
          cacheAnswer: true,
          withInitial: (nextParams, answer) => ({
            ...nextParams,
            initialValues: Array.isArray(answer) ? answer : nextParams.initialValues,
          }),
          call: (nextParams) => this.base.multiselect(nextParams),
        }),
      text: async (params) =>
        await this.prompt({
          kind: "text",
          params,
          signature: buildPromptSignature("text", params),
          cacheAnswer: params.sensitive !== true,
          withInitial: (nextParams, answer) => ({
            ...nextParams,
            initialValue: typeof answer === "string" ? answer : nextParams.initialValue,
          }),
          call: (nextParams) => this.base.text(nextParams),
        }),
      confirm: async (params) =>
        await this.prompt({
          kind: "confirm",
          params,
          signature: buildPromptSignature("confirm", params),
          cacheAnswer: true,
          withInitial: (nextParams, answer) => ({
            ...nextParams,
            initialValue: typeof answer === "boolean" ? answer : nextParams.initialValue,
          }),
          call: (nextParams) => this.base.confirm(nextParams),
        }),
      progress: (label) =>
        this.shouldSuppressOutput() ? inertProgress() : this.base.progress(label),
      disableBackNavigation: () => {
        this.backNavigationDisabled = true;
        this.targetIndex = void 0;
      },
    };
  }
  beginPass() {
    this.cursor = 0;
    this.restartRequested = false;
  }
  hasRestartRequest() {
    return this.restartRequested;
  }
  shouldSuppressOutput() {
    return this.targetIndex !== void 0 && this.cursor <= this.targetIndex;
  }
  matchingRecord(index, kind, signature) {
    const record = this.records[index];
    if (!record) return;
    if (record.kind === kind && record.signature === signature) return record;
    this.records.splice(index);
    if (this.targetIndex !== void 0 && index < this.targetIndex) this.targetIndex = void 0;
  }
  remember(index, request, answer) {
    if (!request.cacheAnswer) {
      this.records[index] = void 0;
      this.records.splice(index + 1);
      return;
    }
    const answerKey = stableKey(answer);
    const previous = this.records[index];
    this.records[index] = {
      kind: request.kind,
      signature: request.signature,
      answer,
      answerKey,
    };
    if (!previous || previous.answerKey !== answerKey || previous.signature !== request.signature)
      this.records.splice(index + 1);
  }
  async prompt(request) {
    const index = this.cursor;
    const record = this.matchingRecord(index, request.kind, request.signature);
    if (this.targetIndex !== void 0 && index < this.targetIndex && record) {
      this.cursor = index + 1;
      return record.answer;
    }
    const paramsWithNavigation = applyNavigation(
      record ? request.withInitial(request.params, record.answer) : request.params,
      {
        canGoBack: !this.backNavigationDisabled && index > 0,
        canGoForward: record !== void 0,
      },
    );
    try {
      const answer = await request.call(paramsWithNavigation);
      this.remember(index, request, answer);
      this.cursor = index + 1;
      if (this.targetIndex !== void 0 && index >= this.targetIndex) this.targetIndex = void 0;
      return answer;
    } catch (error) {
      if (error instanceof WizardNavigationError) {
        if (error.direction === "forward" && record) {
          this.cursor = index + 1;
          this.targetIndex = void 0;
          return record.answer;
        }
        if (error.direction === "back" && !this.backNavigationDisabled && index > 0) {
          this.targetIndex = index - 1;
          this.restartRequested = true;
        }
      }
      throw error;
    }
  }
};
async function runWizardWithPromptNavigation(basePrompter, runner) {
  const navigator = new WizardPromptNavigator(basePrompter);
  while (true) {
    navigator.beginPass();
    try {
      await runner(navigator.prompter);
      return;
    } catch (error) {
      if (
        error instanceof WizardNavigationError &&
        error.direction === "back" &&
        navigator.hasRestartRequest()
      )
        continue;
      throw error;
    }
  }
}
//#endregion
//#region src/wizard/setup.model-auth.ts
const loadAuthChoiceModule = createLazyRuntimeModule(() => import("./auth-choice-CyFH-xSr.js"));
const loadModelPickerModule = createLazyRuntimeModule(() => import("./model-picker-DdqDGdtc.js"));
function isAuthChoiceSelected(value, keepCurrentAuthChoice) {
  return keepCurrentAuthChoice === void 0 || value !== keepCurrentAuthChoice;
}
async function resolveAuthChoiceModelSelectionPolicy(params) {
  const preferredProvider = await params.resolvePreferredProviderForAuthChoice({
    choice: params.authChoice,
    config: params.config,
    workspaceDir: params.workspaceDir,
    env: params.env,
  });
  const [{ resolveManifestProviderAuthChoice }, { resolvePluginSetupProvider }] = await Promise.all(
    [import("./provider-auth-choices-CSAAWfY9.js"), import("./setup-registry-D9q-F-IP.js")],
  );
  const manifestChoice = resolveManifestProviderAuthChoice(params.authChoice, {
    config: params.config,
    workspaceDir: params.workspaceDir,
    env: params.env,
    includeUntrustedWorkspacePlugins: false,
  });
  if (manifestChoice) {
    const setupProvider = resolvePluginSetupProvider({
      provider: manifestChoice.providerId,
      config: params.config,
      workspaceDir: params.workspaceDir,
      env: params.env,
      pluginIds: [manifestChoice.pluginId],
    });
    const setupPolicy =
      setupProvider?.auth.find(
        (method) => normalizeProviderId(method.id) === normalizeProviderId(manifestChoice.methodId),
      )?.wizard?.modelSelection ?? setupProvider?.wizard?.setup?.modelSelection;
    return {
      preferredProvider,
      promptWhenAuthChoiceProvided: setupPolicy?.promptWhenAuthChoiceProvided === true,
      allowKeepCurrent: setupPolicy?.allowKeepCurrent ?? true,
    };
  }
  const { resolvePluginProviders, resolveProviderPluginChoice } =
    await import("./provider-auth-choice.runtime.js");
  const providers = resolvePluginProviders({
    config: params.config,
    workspaceDir: params.workspaceDir,
    env: params.env,
    mode: "setup",
  });
  const resolvedChoice = resolveProviderPluginChoice({
    providers,
    choice: params.authChoice,
  });
  const matchedProvider =
    resolvedChoice?.provider ??
    (() => {
      const preferredId = preferredProvider?.trim();
      if (!preferredId) return;
      return providers.find(
        (provider) => typeof provider.id === "string" && provider.id.trim() === preferredId,
      );
    })();
  const setupPolicy =
    resolvedChoice?.wizard?.modelSelection ?? matchedProvider?.wizard?.setup?.modelSelection;
  return {
    preferredProvider,
    promptWhenAuthChoiceProvided: setupPolicy?.promptWhenAuthChoiceProvided === true,
    allowKeepCurrent: setupPolicy?.allowKeepCurrent ?? true,
  };
}
/**
 * Run the provider auth-choice + default-model selection loop. When
 * `opts.authChoice` is set the prompt is skipped and the flag drives the flow
 * (public onboarding automation contract).
 */
async function runSetupModelAuthStep(params) {
  const { opts, prompter, runtime, workspaceDir } = params;
  let nextConfig = params.config;
  const authChoiceFromPrompt = opts.authChoice === void 0;
  let authChoice = opts.authChoice;
  let authStore;
  let promptAuthChoiceGrouped;
  let keepCurrentAuthChoice;
  if (authChoiceFromPrompt) {
    const { ensureAuthProfileStore } = await import("./agents/auth-profiles.runtime.js");
    const authChoicePromptModule = await import("./auth-choice-prompt-gQGepsAL.js");
    promptAuthChoiceGrouped = authChoicePromptModule.promptAuthChoiceGrouped;
    keepCurrentAuthChoice = authChoicePromptModule.KEEP_CURRENT_AUTH_CHOICE;
    authStore = ensureAuthProfileStore(void 0, { allowKeychainPrompt: false });
  }
  while (true) {
    if (authChoiceFromPrompt)
      authChoice = await promptAuthChoiceGrouped({
        prompter,
        store: authStore,
        includeSkip: true,
        config: nextConfig,
        workspaceDir,
        allowKeepCurrentProvider: true,
      });
    if (authChoice === void 0) throw new WizardCancelledError(t("wizard.setup.authChoiceRequired"));
    if (!isAuthChoiceSelected(authChoice, keepCurrentAuthChoice)) break;
    if (authChoice === "custom-api-key") {
      const { promptCustomApiConfig } = await import("./onboard-custom-CLunZ7qK.js");
      nextConfig = (
        await promptCustomApiConfig({
          prompter,
          runtime,
          config: nextConfig,
          secretInputMode: opts.secretInputMode,
        })
      ).config;
      prompter.disableBackNavigation?.();
      break;
    }
    if (authChoice === "skip") {
      if (authChoiceFromPrompt) {
        const { applyPrimaryModel, promptDefaultModel } = await loadModelPickerModule();
        const modelSelection = await promptDefaultModel({
          config: nextConfig,
          prompter,
          allowKeep: true,
          ignoreAllowlist: true,
          includeProviderPluginSetups: false,
          loadCatalog: false,
          workspaceDir,
          runtime,
        });
        if (modelSelection.config) nextConfig = modelSelection.config;
        if (modelSelection.model) nextConfig = applyPrimaryModel(nextConfig, modelSelection.model);
        const { warnIfModelConfigLooksOff } = await loadAuthChoiceModule();
        await warnIfModelConfigLooksOff(nextConfig, prompter, { validateCatalog: false });
      }
      break;
    }
    const [
      { applyAuthChoice, resolvePreferredProviderForAuthChoice, warnIfModelConfigLooksOff },
      { applyPrimaryModel, promptDefaultModel },
    ] = await Promise.all([loadAuthChoiceModule(), loadModelPickerModule()]);
    prompter.disableBackNavigation?.();
    let authResult;
    try {
      authResult = await applyAuthChoice({
        authChoice,
        config: nextConfig,
        prompter,
        runtime,
        setDefaultModel: true,
        preserveExistingDefaultModel: true,
        opts: {
          ...opts,
          token: opts.authChoice === "apiKey" && opts.token ? opts.token : void 0,
        },
      });
    } catch (error) {
      if (error instanceof WizardCancelledError || !authChoiceFromPrompt) throw error;
      await prompter.note(
        [formatErrorMessage(error), t("wizard.setup.authChoiceFailedRetry")].join("\n"),
        t("wizard.setup.authChoiceFailedTitle"),
      );
      continue;
    }
    nextConfig = authResult.config;
    if (authResult.retrySelection) {
      if (authChoiceFromPrompt) continue;
      break;
    }
    if (authResult.agentModelOverride)
      nextConfig = applyPrimaryModel(nextConfig, authResult.agentModelOverride);
    const authChoiceModelSelectionPolicy = await resolveAuthChoiceModelSelectionPolicy({
      authChoice,
      config: nextConfig,
      workspaceDir,
      resolvePreferredProviderForAuthChoice,
    });
    if (authChoiceFromPrompt || authChoiceModelSelectionPolicy?.promptWhenAuthChoiceProvided) {
      const modelSelection = await promptDefaultModel({
        config: nextConfig,
        prompter,
        allowKeep: authChoiceModelSelectionPolicy?.allowKeepCurrent ?? true,
        ignoreAllowlist: true,
        includeProviderPluginSetups: true,
        preferredProvider: authChoiceModelSelectionPolicy?.preferredProvider,
        browseCatalogOnDemand: true,
        workspaceDir,
        runtime,
      });
      if (modelSelection.config) nextConfig = modelSelection.config;
      if (modelSelection.model) nextConfig = applyPrimaryModel(nextConfig, modelSelection.model);
    }
    await warnIfModelConfigLooksOff(nextConfig, prompter, { validateCatalog: false });
    break;
  }
  return nextConfig;
}
//#endregion
//#region src/wizard/setup.ts
const loadConfigLoggingModule = createLazyRuntimeModule(() => import("./logging-DtclSUgM.js"));
const loadOnboardConfigModule = createLazyRuntimeModule(
  () => import("./onboard-config-ClIyTyiX.js"),
);
function hasConfiguredDefaultModel(config) {
  return resolveAgentModelPrimaryValue(config.agents?.defaults?.model) !== void 0;
}
async function offerLiveModelVerification(params) {
  if (
    !(await params.prompter.confirm({
      message: t("wizard.setup.testAiAccess"),
      initialValue: true,
    }))
  )
    return params.config;
  const { verifySetupInference } = await import("./crestodian/setup-inference.js");
  const verify = async () => {
    const progress = params.prompter.progress(t("wizard.setup.testAiProgress"));
    const result = await withConsoleSubsystemsSuppressed(() =>
      verifySetupInference({ runtime: params.runtime }),
    );
    progress.stop();
    if (result.ok)
      await params.prompter.note(
        t("wizard.setup.testAiSuccess", { seconds: (result.latencyMs / 1e3).toFixed(1) }),
        t("wizard.setup.testAiTitle"),
      );
    else
      await params.prompter.note(
        t("wizard.setup.testAiFailure", { reason: result.error }),
        t("wizard.setup.testAiTitle"),
      );
    return result;
  };
  if ((await verify()).ok) return params.config;
  if (
    (await params.prompter.select({
      message: t("wizard.setup.testAiFailureChoice"),
      options: [
        {
          value: "fix",
          label: t("wizard.setup.testAiFix"),
        },
        {
          value: "continue",
          label: t("wizard.setup.testAiContinue"),
        },
      ],
    })) === "continue"
  )
    return params.config;
  const fixedConfig = await runSetupModelAuthStep({
    config: params.config,
    opts: {
      ...params.opts,
      authChoice: void 0,
    },
    prompter: params.prompter,
    runtime: params.runtime,
    workspaceDir: params.workspaceDir,
  });
  const persistedConfig = await params.writeConfig(fixedConfig);
  await verify();
  return persistedConfig;
}
function isSetupImportFlowChoice(flow) {
  return flow === "import" || flow.startsWith("import:");
}
function resolveImportProviderFromFlowChoice(flow) {
  return flow.startsWith("import:") ? flow.slice(7) : void 0;
}
async function runSetupWizard(opts, runtimeInput, prompter) {
  await runWizardWithPromptNavigation(
    prompter,
    async (navigationPrompter) => await runSetupWizardOnce(opts, runtimeInput, navigationPrompter),
  );
}
async function runSetupWizardOnce(opts, runtimeInput, prompter) {
  let runtime = runtimeInput;
  runtime ??= defaultRuntime;
  const onboardHelpers = await import("./onboard-helpers-LaeM9LZm.js");
  await onboardHelpers.printWizardHeader(runtime);
  await prompter.intro(t("wizard.setup.intro"));
  const snapshot = await readSetupConfigFileSnapshot();
  let baseConfig = snapshot.valid
    ? snapshot.exists
      ? (snapshot.sourceConfig ?? snapshot.config)
      : {}
    : {};
  baseConfig = await requireRiskAcknowledgement({
    opts,
    prompter,
    config: baseConfig,
  });
  let pendingPluginInstallMigrationBaseConfig = baseConfig;
  const writeSetupConfigFile = async (config, optsLocal = {}) =>
    await writeWizardConfigFile(config, {
      ...optsLocal,
      migrationBaseConfig: pendingPluginInstallMigrationBaseConfig,
      onPendingPluginInstallMigration: () => {
        pendingPluginInstallMigrationBaseConfig = void 0;
      },
    });
  if (snapshot.exists && !snapshot.valid) {
    await prompter.note(
      onboardHelpers.summarizeExistingConfig(baseConfig),
      t("wizard.setup.invalidConfigTitle"),
    );
    if (snapshot.issues.length > 0)
      await prompter.note(
        [
          ...snapshot.issues.map((iss) => `- ${iss.path}: ${iss.message}`),
          "",
          "Docs: https://docs.openclaw.ai/gateway/configuration",
        ].join("\n"),
        "Config issues",
      );
    await prompter.outro(
      `Config invalid. Run \`${formatCliCommand("openclaw doctor")}\` to repair it, then re-run setup.`,
    );
    runtime.exit(1);
    return;
  }
  const compatibilityNotices = snapshot.valid
    ? buildPluginCompatibilitySnapshotNotices({ config: baseConfig })
    : [];
  if (compatibilityNotices.length > 0)
    await prompter.note(
      [
        `Detected ${compatibilityNotices.length} plugin compatibility notice${compatibilityNotices.length === 1 ? "" : "s"} in the current config.`,
        ...compatibilityNotices
          .slice(0, 4)
          .map((notice) => `- ${formatPluginCompatibilityNotice(notice)}`),
        ...(compatibilityNotices.length > 4
          ? [`- ... +${compatibilityNotices.length - 4} more`]
          : []),
        "",
        `Review: ${formatCliCommand("openclaw doctor")}`,
        `Inspect: ${formatCliCommand("openclaw plugins inspect --all")}`,
      ].join("\n"),
      t("wizard.setup.pluginCompatibilityTitle"),
    );
  const quickstartHint = t("wizard.setup.flowQuickstartHint", {
    command: formatCliCommand("openclaw configure"),
  });
  const manualHint = t("wizard.setup.flowAdvancedHint");
  const hasExistingModelConfig = hasConfiguredDefaultModel(baseConfig);
  const migrationDetections = await detectSetupMigrationSources({
    config: baseConfig,
    runtime,
  });
  const importOptions = (
    await listSetupMigrationOptions({
      baseConfig,
      detections: migrationDetections,
    })
  ).map((option) => {
    const choice = {
      value: `import:${option.providerId}`,
      label: t("wizard.migration.importFrom", { source: option.label }),
    };
    if (option.hint) choice.hint = option.hint;
    return choice;
  });
  const explicitFlowRaw = opts.flow?.trim();
  const normalizedExplicitFlow = explicitFlowRaw === "manual" ? "advanced" : explicitFlowRaw;
  if (
    normalizedExplicitFlow &&
    normalizedExplicitFlow !== "quickstart" &&
    normalizedExplicitFlow !== "advanced" &&
    normalizedExplicitFlow !== "import"
  ) {
    runtime.error(
      "Invalid --flow. Use quickstart, manual, advanced, or import. Example: openclaw onboard --flow quickstart",
    );
    runtime.exit(1);
    return;
  }
  const explicitFlow =
    normalizedExplicitFlow === "quickstart" ||
    normalizedExplicitFlow === "advanced" ||
    normalizedExplicitFlow === "import"
      ? normalizedExplicitFlow
      : void 0;
  const keepModelOption = hasExistingModelConfig
    ? {
        value: "keep-model",
        label: t("wizard.setup.flowKeepModel"),
        hint: t("wizard.setup.flowKeepModelHint"),
      }
    : void 0;
  let flow =
    explicitFlow ??
    (await prompter.select({
      message: t("wizard.setup.setupMode"),
      options: [
        ...(keepModelOption ? [keepModelOption] : []),
        {
          value: "quickstart",
          label: t("wizard.setup.flowQuickstart"),
          hint: quickstartHint,
        },
        {
          value: "advanced",
          label: t("wizard.setup.flowAdvanced"),
          hint: manualHint,
        },
        ...importOptions,
      ],
      initialValue: hasExistingModelConfig ? "keep-model" : "quickstart",
    }));
  let keepExistingModelConfig = flow === "keep-model";
  if (keepExistingModelConfig) flow = "quickstart";
  if (opts.mode === "remote" && flow === "quickstart") {
    await prompter.note(t("wizard.setup.quickstartOnlyLocal"), t("wizard.setup.quickstartTitle"));
    flow = "advanced";
  }
  if (snapshot.exists && !keepExistingModelConfig)
    await prompter.note(
      onboardHelpers.summarizeExistingConfig(baseConfig),
      t("wizard.setup.existingConfigTitle"),
    );
  const usedImportFlow = Boolean(opts.importFrom || isSetupImportFlowChoice(flow));
  if (usedImportFlow) {
    const importFrom = opts.importFrom ?? resolveImportProviderFromFlowChoice(flow);
    prompter.disableBackNavigation?.();
    await runSetupMigrationImport({
      opts: {
        ...opts,
        ...(importFrom ? { importFrom } : {}),
      },
      baseConfig,
      detections: migrationDetections,
      prompter,
      runtime,
      readConfigFile: readValidSetupConfigFile,
      commitConfigFile: (cfg) => writeWizardConfigFile(cfg, { allowConfigSizeDrop: true }),
      continueOnboarding: true,
    });
    const migratedSnapshot = await readSetupConfigFileSnapshot();
    if (!migratedSnapshot.valid)
      throw new Error("Migration produced an invalid OpenClaw config. Run `openclaw doctor`.");
    baseConfig = migratedSnapshot.sourceConfig ?? migratedSnapshot.config;
    pendingPluginInstallMigrationBaseConfig = baseConfig;
    keepExistingModelConfig ||= hasConfiguredDefaultModel(baseConfig);
    flow = "quickstart";
  }
  const wizardFlow = flow === "advanced" ? "advanced" : "quickstart";
  const quickstartGateway = resolveQuickstartGatewayDefaults(baseConfig);
  if (flow === "quickstart") {
    const formatBind = (value) => {
      if (value === "loopback") return t("wizard.gateway.bindLoopback");
      if (value === "lan") return t("wizard.gateway.bindLan");
      if (value === "custom") return t("wizard.gateway.bindCustom");
      if (value === "tailnet") return t("wizard.gateway.bindTailnet");
      return t("wizard.gateway.bindAuto");
    };
    const formatAuth = (value) => {
      if (value === "token") return t("wizard.setup.quickstartAuthTokenDefault");
      return t("common.password");
    };
    const formatTailscale = (value) => {
      return t(`wizard.gatewayTailscale.${value}`);
    };
    const quickstartLines = quickstartGateway.hasExisting
      ? [
          t("wizard.setup.quickstartKeepSettings"),
          t("wizard.setup.quickstartGatewayPort", { port: quickstartGateway.port }),
          t("wizard.setup.quickstartGatewayBind", { bind: formatBind(quickstartGateway.bind) }),
          ...(quickstartGateway.bind === "custom" && quickstartGateway.customBindHost
            ? [
                t("wizard.setup.quickstartGatewayCustomIp", {
                  host: quickstartGateway.customBindHost,
                }),
              ]
            : []),
          t("wizard.setup.quickstartGatewayAuth", { auth: formatAuth(quickstartGateway.authMode) }),
          t("wizard.setup.quickstartTailscaleExposure", {
            exposure: formatTailscale(quickstartGateway.tailscaleMode),
          }),
          t("wizard.setup.quickstartDirectChannels"),
        ]
      : [
          t("wizard.setup.quickstartGatewayPort", { port: quickstartGateway.port }),
          t("wizard.setup.quickstartGatewayBind", { bind: t("wizard.gateway.bindLoopback") }),
          t("wizard.setup.quickstartGatewayAuth", {
            auth: t("wizard.setup.quickstartAuthTokenDefault"),
          }),
          t("wizard.setup.quickstartTailscaleExposure", {
            exposure: t("wizard.gatewayTailscale.off"),
          }),
          t("wizard.setup.quickstartDirectChannels"),
        ];
    await prompter.note(quickstartLines.join("\n"), "QuickStart");
  }
  const localPort = resolveGatewayPort(baseConfig);
  const localUrl = `ws://127.0.0.1:${localPort}`;
  let localGatewayToken = process.env.OPENCLAW_GATEWAY_TOKEN;
  try {
    const resolvedGatewayToken = await resolveSetupSecretInputString({
      config: baseConfig,
      value: baseConfig.gateway?.auth?.token,
      path: "gateway.auth.token",
      env: process.env,
    });
    if (resolvedGatewayToken) localGatewayToken = resolvedGatewayToken;
  } catch (error) {
    await prompter.note(
      [
        t("wizard.setup.secretRefProbeFailed", { field: "gateway.auth.token" }),
        formatErrorMessage(error),
      ].join("\n"),
      t("wizard.gateway.auth"),
    );
  }
  let localGatewayPassword = process.env.OPENCLAW_GATEWAY_PASSWORD;
  try {
    const resolvedGatewayPassword = await resolveSetupSecretInputString({
      config: baseConfig,
      value: baseConfig.gateway?.auth?.password,
      path: "gateway.auth.password",
      env: process.env,
    });
    if (resolvedGatewayPassword) localGatewayPassword = resolvedGatewayPassword;
  } catch (error) {
    await prompter.note(
      [
        t("wizard.setup.secretRefProbeFailed", { field: "gateway.auth.password" }),
        formatErrorMessage(error),
      ].join("\n"),
      t("wizard.gateway.auth"),
    );
  }
  const localProbe = await onboardHelpers.probeGatewayReachable({
    url: localUrl,
    token: localGatewayToken,
    password: localGatewayPassword,
  });
  const remoteUrl = baseConfig.gateway?.remote?.url?.trim() ?? "";
  let remoteGatewayToken = normalizeSecretInputString(baseConfig.gateway?.remote?.token);
  try {
    const resolvedRemoteGatewayToken = await resolveSetupSecretInputString({
      config: baseConfig,
      value: baseConfig.gateway?.remote?.token,
      path: "gateway.remote.token",
      env: process.env,
    });
    if (resolvedRemoteGatewayToken) remoteGatewayToken = resolvedRemoteGatewayToken;
  } catch (error) {
    await prompter.note(
      [
        "Could not resolve gateway.remote.token SecretRef for setup probe.",
        formatErrorMessage(error),
      ].join("\n"),
      "Gateway auth",
    );
  }
  const remoteProbe = remoteUrl
    ? await onboardHelpers.probeGatewayReachable({
        url: remoteUrl,
        token: remoteGatewayToken,
      })
    : null;
  const mode =
    opts.mode ??
    (flow === "quickstart"
      ? "local"
      : await prompter.select({
          message: t("wizard.setup.whatSetup"),
          options: [
            {
              value: "local",
              label: t("wizard.setup.localGateway"),
              hint: localProbe.ok
                ? t("wizard.setup.localGatewayReachable", { url: localUrl })
                : t("wizard.setup.localGatewayMissing", { url: localUrl }),
            },
            {
              value: "remote",
              label: t("wizard.setup.remoteGateway"),
              hint: !remoteUrl
                ? t("wizard.setup.remoteGatewayMissing")
                : remoteProbe?.ok
                  ? t("wizard.setup.remoteGatewayReachable", { url: remoteUrl })
                  : t("wizard.setup.remoteGatewayUnreachable", { url: remoteUrl }),
            },
          ],
        }));
  if (mode === "remote") {
    const { promptRemoteGatewayConfig } = await import("./onboard-remote-D36xSBnD.js");
    const { applySkipBootstrapConfig } = await loadOnboardConfigModule();
    const { logConfigUpdated } = await loadConfigLoggingModule();
    let nextConfig = await promptRemoteGatewayConfig(baseConfig, prompter, {
      secretInputMode: opts.secretInputMode,
    });
    if (opts.skipBootstrap) nextConfig = applySkipBootstrapConfig(nextConfig);
    nextConfig = onboardHelpers.applyWizardMetadata(nextConfig, {
      command: "onboard",
      mode,
    });
    prompter.disableBackNavigation?.();
    await writeSetupConfigFile(nextConfig, { allowConfigSizeDrop: false });
    logConfigUpdated(runtime);
    await prompter.outro(t("wizard.setup.remoteConfigured"));
    return;
  }
  const workspaceDir = resolveUserPath(
    (
      opts.workspace ??
      (flow === "quickstart"
        ? (baseConfig.agents?.defaults?.workspace ?? onboardHelpers.DEFAULT_WORKSPACE)
        : await prompter.text({
            message: t("wizard.setup.workspaceDirectory"),
            initialValue:
              baseConfig.agents?.defaults?.workspace ?? onboardHelpers.DEFAULT_WORKSPACE,
          }))
    ).trim() || onboardHelpers.DEFAULT_WORKSPACE,
  );
  const { applyLocalSetupWorkspaceConfig, applySkipBootstrapConfig } =
    await loadOnboardConfigModule();
  let nextConfig = applyLocalSetupWorkspaceConfig(baseConfig, workspaceDir);
  if (opts.skipBootstrap) nextConfig = applySkipBootstrapConfig(nextConfig);
  if (!keepExistingModelConfig)
    nextConfig = await runSetupModelAuthStep({
      config: nextConfig,
      opts,
      prompter,
      runtime,
      workspaceDir,
    });
  const { configureGatewayForSetup } = await import("./setup.gateway-config-BCZ5USk_.js");
  const gateway = await configureGatewayForSetup({
    flow: wizardFlow,
    baseConfig,
    nextConfig,
    localPort,
    quickstartGateway,
    secretInputMode: opts.secretInputMode,
    prompter,
    runtime,
  });
  nextConfig = gateway.nextConfig;
  const settings = gateway.settings;
  nextConfig = await writeSetupConfigFile(nextConfig, { allowConfigSizeDrop: false });
  if (
    opts.nonInteractive !== true &&
    opts.authChoice !== "skip" &&
    !usedImportFlow &&
    hasConfiguredDefaultModel(nextConfig)
  )
    nextConfig = await offerLiveModelVerification({
      config: nextConfig,
      opts,
      prompter,
      runtime,
      workspaceDir,
      writeConfig: async (config) =>
        await writeSetupConfigFile(config, { allowConfigSizeDrop: false }),
    });
  prompter.disableBackNavigation?.();
  if (opts.skipChannels ?? opts.skipProviders)
    await prompter.note(t("wizard.setup.skipChannels"), t("wizard.setup.channelsTitle"));
  else {
    const { listChannelPlugins } = await import("./plugins-DKUiZRqh.js");
    const { setupChannels } = await import("./onboard-channels-BHHrs1du.js");
    const quickstartAllowFromChannels =
      flow === "quickstart"
        ? listChannelPlugins()
            .filter((plugin) => plugin.meta.quickstartAllowFrom)
            .map((plugin) => plugin.id)
        : [];
    nextConfig = await setupChannels(nextConfig, runtime, prompter, {
      allowIMessageInstall: true,
      allowSignalInstall: true,
      deferStatusUntilSelection: flow === "quickstart",
      forceAllowFromChannels: quickstartAllowFromChannels,
      skipDmPolicyPrompt: flow === "quickstart",
      skipConfirm: flow === "quickstart",
      quickstartDefaults: flow === "quickstart",
      secretInputMode: opts.secretInputMode,
    });
  }
  nextConfig = await writeSetupConfigFile(nextConfig, { allowConfigSizeDrop: false });
  const { logConfigUpdated } = await loadConfigLoggingModule();
  logConfigUpdated(runtime);
  await onboardHelpers.ensureWorkspaceAndSessions(workspaceDir, runtime, {
    skipBootstrap: Boolean(nextConfig.agents?.defaults?.skipBootstrap),
    skipOptionalBootstrapFiles: nextConfig.agents?.defaults?.skipOptionalBootstrapFiles,
  });
  if (opts.skipSearch)
    await prompter.note(t("wizard.setup.skipSearch"), t("wizard.setup.searchTitle"));
  else {
    const { setupSearch } = await import("./onboard-search-CIFl14rz.js");
    nextConfig = await setupSearch(nextConfig, runtime, prompter, {
      quickstartDefaults: flow === "quickstart",
      secretInputMode: opts.secretInputMode,
    });
  }
  if (opts.skipSkills)
    await prompter.note(t("wizard.setup.skipSkills"), t("wizard.setup.skillsTitle"));
  else {
    const { setupSkills } = await import("./onboard-skills-DG60_2Zv.js");
    nextConfig = await setupSkills(nextConfig, workspaceDir, runtime, prompter, {
      nodeManager: opts.nodeManager,
    });
  }
  if (flow !== "quickstart") {
    const { setupOfficialPluginInstalls } = await import("./setup.official-plugins-DwqiOWAL.js");
    nextConfig = await setupOfficialPluginInstalls({
      config: nextConfig,
      prompter,
      runtime,
      workspaceDir,
    });
    const { setupPluginConfig } = await import("./setup.plugin-config-Dp8DjkcG.js");
    nextConfig = await setupPluginConfig({
      config: nextConfig,
      prompter,
      workspaceDir,
    });
  }
  if (!opts.skipHooks) {
    const { enableDefaultOnboardingInternalHooks } = await import("./onboard-hooks-B9MyjyDR.js");
    nextConfig = enableDefaultOnboardingInternalHooks(nextConfig);
  }
  nextConfig = onboardHelpers.applyWizardMetadata(nextConfig, {
    command: "onboard",
    mode,
  });
  nextConfig = await writeSetupConfigFile(nextConfig, { allowConfigSizeDrop: false });
  const { finalizeSetupWizard } = await import("./setup.finalize-oBUaKa6R.js");
  if (
    (
      await finalizeSetupWizard({
        flow: wizardFlow,
        opts,
        baseConfig,
        hadExistingConfig: snapshot.exists,
        nextConfig,
        workspaceDir,
        settings,
        prompter,
        runtime,
      })
    ).launchedTui
  )
    runtime.exit(0);
}
//#endregion
export { runSetupWizard as t };
