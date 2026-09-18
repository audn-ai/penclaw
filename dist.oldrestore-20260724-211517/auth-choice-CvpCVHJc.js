import { r as resolveDefaultModelForAgent } from "./codex-plugin-diagnostics-DxsLhCf5.js";
import { t as formatCliCommand } from "./command-format-H_Arqann.js";
import { t as createModelAuthAvailabilityResolver } from "./model-auth-availability-CHBQPrVn.js";
import { r as loadModelCatalogSnapshot } from "./model-catalog-DxYvPELu.js";
import { _ as canonicalizeProviderModelId } from "./openai-routing-Cu28Ynzk.js";
import "./auth-profiles-CX7JDmZ9.js";
import "./model-selection-DOlkTrQa.js";
import { t as applyAuthChoiceLoadedPluginProvider } from "./provider-auth-choice-B9o6YJ0E.js";
import { t as buildProviderAuthRecoveryHint } from "./provider-auth-recovery-hint-DwukEoyu.js";
import { i as normalizeProviderIdForAuth } from "./provider-id-BIcU_2-A.js";
import { i as ensureAuthProfileStore } from "./store-B7DoDdVM.js";
import "./provider-auth-choice-preference-CXeOGofu.js";
//#region src/commands/auth-choice.apply.ts
async function normalizeLegacyChoice(authChoice, params) {
  if (authChoice === "oauth") return "setup-token";
  if (typeof authChoice !== "string") return authChoice;
  const { normalizeLegacyOnboardAuthChoice } = await import("./auth-choice-legacy-BkSTncqa.js");
  return normalizeLegacyOnboardAuthChoice(authChoice, params);
}
async function normalizeTokenProviderChoice(params) {
  if (!params.source.opts?.tokenProvider) return params.authChoice;
  if (
    params.authChoice !== "apiKey" &&
    params.authChoice !== "token" &&
    params.authChoice !== "setup-token"
  )
    return params.authChoice;
  const { normalizeApiKeyTokenProviderAuthChoice } =
    await import("./auth-choice.apply.api-providers-DzwEmZR7.js");
  return normalizeApiKeyTokenProviderAuthChoice({
    authChoice: params.authChoice,
    tokenProvider: params.source.opts.tokenProvider,
    config: params.source.config,
    env: params.source.env,
  });
}
async function formatDeprecatedProviderChoiceError(authChoice, params) {
  if (typeof authChoice !== "string") return;
  const { resolveManifestDeprecatedProviderAuthChoice } =
    await import("./provider-auth-choices-CSAAWfY9.js");
  const deprecatedChoice = resolveManifestDeprecatedProviderAuthChoice(authChoice, {
    config: params.config,
    env: params.env,
  });
  if (deprecatedChoice)
    return `Auth choice ${JSON.stringify(authChoice)} is no longer supported. Use ${JSON.stringify(deprecatedChoice.choiceId)} instead, or run ${formatCliCommand("openclaw onboard")} to choose interactively.`;
  const { resolveDeprecatedProviderInstallCatalogEntry } =
    await import("./provider-install-catalog-Dl8oe8Cu.js");
  const externalDeprecatedChoice = resolveDeprecatedProviderInstallCatalogEntry(authChoice, {
    config: params.config,
    env: params.env,
    includeUntrustedWorkspacePlugins: false,
  });
  if (!externalDeprecatedChoice) return;
  return `Auth choice ${JSON.stringify(authChoice)} is no longer supported. Use ${JSON.stringify(externalDeprecatedChoice.choiceId)} instead, or run ${formatCliCommand("openclaw onboard")} to choose interactively.`;
}
/** Apply a selected auth choice, returning the mutated config or retry/model override signals. */
async function applyAuthChoice(params) {
  const normalizedProviderAuthChoice = await normalizeTokenProviderChoice({
    authChoice:
      (await normalizeLegacyChoice(params.authChoice, {
        config: params.config,
        env: params.env,
      })) ?? params.authChoice,
    source: params,
  });
  const normalizedParams =
    normalizedProviderAuthChoice === params.authChoice
      ? params
      : {
          ...params,
          authChoice: normalizedProviderAuthChoice,
        };
  const result = await applyAuthChoiceLoadedPluginProvider(normalizedParams);
  if (result) return result;
  const deprecatedProviderChoiceError = await formatDeprecatedProviderChoiceError(
    normalizedParams.authChoice,
    {
      config: normalizedParams.config,
      env: normalizedParams.env,
    },
  );
  if (deprecatedProviderChoiceError) throw new Error(deprecatedProviderChoiceError);
  if (normalizedParams.authChoice === "token" || normalizedParams.authChoice === "setup-token")
    throw new Error(
      [
        `Auth choice "${normalizedParams.authChoice}" was not matched to a provider setup flow.`,
        `Run ${formatCliCommand("openclaw models auth login --provider <provider>")} for provider auth, or rerun ${formatCliCommand("openclaw onboard")} to choose interactively.`,
      ].join("\n"),
    );
  if (normalizedParams.authChoice === "oauth")
    throw new Error(
      `Auth choice "oauth" is no longer supported directly. Use a provider-specific auth entry, or run ${formatCliCommand("openclaw models auth login --provider <provider>")}.`,
    );
  return { config: normalizedParams.config };
}
//#endregion
//#region src/commands/auth-choice.model-check.ts
/**
 * Resolve the default model ref and its auth readiness. A catalog observation
 * makes transport-specific auth exact; absent observations remain
 * indeterminate when provider facts cannot choose one route. Shared by the
 * onboarding model check and the finalize hatch gating.
 */
function resolveDefaultModelAuthStatus(config, options) {
  const ref = resolveDefaultModelForAgent({
    cfg: config,
    agentId: options?.agentId,
  });
  const evaluation = createModelAuthAvailabilityResolver({
    cfg: config,
    authStore: ensureAuthProfileStore(options?.agentDir, {
      allowKeychainPrompt: false,
      config,
      ...(ref.provider === "openai" ? { externalCliProviderIds: ["openai"] } : {}),
      readOnly: true,
    }),
    ...(options?.agentDir ? { agentDir: options.agentDir } : {}),
    ...(options?.env ? { env: options.env } : {}),
  }).evaluateModelAuth(ref.provider, {
    modelId: ref.model,
    ...(options?.observedRoutes?.length ? { observedRoutes: options.observedRoutes } : {}),
  });
  if (evaluation.routeResolution?.kind === "incompatible")
    return {
      provider: ref.provider,
      model: ref.model,
      status: "incompatible",
      hasAuth: false,
      code: evaluation.routeResolution.code,
      message: evaluation.routeResolution.message,
    };
  const availability = evaluation.availability;
  const authRequirement = evaluation.selectedRoute?.authRequirement;
  if (availability === true)
    return {
      provider: ref.provider,
      model: ref.model,
      status: "ready",
      hasAuth: true,
    };
  if (
    availability === void 0 &&
    (normalizeProviderIdForAuth(ref.provider) === "openai" ||
      evaluation.routeResolution !== null ||
      evaluation.evidence !== void 0)
  )
    return {
      provider: ref.provider,
      model: ref.model,
      status: "indeterminate",
      hasAuth: false,
    };
  return {
    provider: ref.provider,
    model: ref.model,
    status: "missing",
    hasAuth: false,
    ...(authRequirement ? { authRequirement } : {}),
  };
}
function catalogRouteObservation(entry) {
  if (!entry) return;
  const baseUrl = entry.baseUrl;
  if (entry.api === void 0 && baseUrl === void 0) return;
  return {
    ...(entry.api !== void 0 ? { api: entry.api } : {}),
    ...(baseUrl !== void 0 ? { baseUrl } : {}),
  };
}
/** Resolve logical model identity and every physical route represented by a catalog. */
function resolveDefaultModelCatalogFacts(config, catalog, options) {
  const ref = resolveDefaultModelForAgent({
    cfg: config,
    agentId: options?.agentId,
  });
  const provider = normalizeProviderIdForAuth(ref.provider);
  const modelId = canonicalizeProviderModelId(provider, ref.model);
  const matches = (entry) =>
    normalizeProviderIdForAuth(entry.provider) === provider &&
    canonicalizeProviderModelId(provider, entry.id) === modelId;
  const routeVariants = options?.routeVariants ?? catalog;
  const observedRoutes = routeVariants
    .filter(matches)
    .map(catalogRouteObservation)
    .filter((route) => route !== void 0);
  return {
    found: catalog.some(matches) || routeVariants.some(matches),
    ...(observedRoutes.length > 0 ? { observedRoutes } : {}),
  };
}
/** Warn when the selected default model is unknown or has no usable credentials. */
async function warnIfModelConfigLooksOff(config, prompter, options) {
  const ref = resolveDefaultModelForAgent({
    cfg: config,
    agentId: options?.agentId,
  });
  const warnings = [];
  const snapshot =
    options?.validateCatalog === false
      ? {
          entries: [],
          routeVariants: [],
        }
      : await loadModelCatalogSnapshot({
          config,
          useCache: false,
        });
  const catalog = snapshot.entries;
  const catalogFacts = resolveDefaultModelCatalogFacts(config, catalog, {
    ...(options?.agentId ? { agentId: options.agentId } : {}),
    routeVariants: snapshot.routeVariants,
  });
  const observedRoutes = options?.observedRoutes ?? catalogFacts.observedRoutes;
  if (options?.validateCatalog !== false) {
    if (catalog.length > 0) {
      if (!catalogFacts.found)
        warnings.push(
          `Model not found: ${ref.provider}/${ref.model}. Update agents.defaults.model or run /models list.`,
        );
    }
  }
  const authStatus = resolveDefaultModelAuthStatus(config, {
    ...(options?.agentId ? { agentId: options.agentId } : {}),
    ...(options?.agentDir ? { agentDir: options.agentDir } : {}),
    ...(options?.env ? { env: options.env } : {}),
    ...(observedRoutes ? { observedRoutes } : {}),
  });
  if (authStatus.status === "missing")
    warnings.push(
      `No auth configured for provider "${ref.provider}". The agent may fail until credentials are added. ${buildProviderAuthRecoveryHint(
        {
          provider: ref.provider,
          config,
          includeEnvVar: authStatus.authRequirement !== "subscription",
        },
      )}`,
    );
  else if (authStatus.status === "incompatible")
    warnings.push(
      `Model route is incompatible for "${ref.provider}/${ref.model}": ${authStatus.message}`,
    );
  else if (authStatus.status === "indeterminate")
    warnings.push(
      `Auth readiness could not be confirmed for "${ref.provider}/${ref.model}". Verify the selected model route and credential source before continuing.`,
    );
  if (warnings.length > 0) await prompter.note(warnings.join("\n"), "Model check");
}
//#endregion
export {
  applyAuthChoice as i,
  resolveDefaultModelCatalogFacts as n,
  warnIfModelConfigLooksOff as r,
  resolveDefaultModelAuthStatus as t,
};
