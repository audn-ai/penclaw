import {
  n as resolveGithubCopilotDomain,
  t as PUBLIC_GITHUB_COPILOT_DOMAIN,
} from "../../domain-D8-95X4Y.js";
import { t as createGithubCopilotDynamicModelHooks } from "../../dynamic-models-CGh0l1DN.js";
import { t as githubCopilotMemoryEmbeddingProviderAdapter } from "../../embeddings-C5rHN2A_.js";
import { t as resolveCopilotExtendedThinkingLevels } from "../../model-metadata-C-L7_SSr.js";
import { t as PROVIDER_ID } from "../../models-gdqXT4QH.js";
import { t as normalizeOptionalSecretInput } from "../../normalize-secret-input-Df_qhWv_.js";
import { r as resolvePluginConfigObject } from "../../plugin-config-runtime-ef53THzv.js";
import { t as definePluginEntry } from "../../plugin-entry-DzBhXPVE.js";
import { n as listProfilesForProvider } from "../../profile-list-I4BheGlK.js";
import { c as upsertAuthProfileWithLock } from "../../profiles-DxTOoenK.js";
import { t as applyAuthProfileConfig } from "../../provider-auth-helpers-CLs4Yz61.js";
import { o as normalizeGithubCopilotDomain } from "../../provider-auth-mypr64nh.js";
import { c as resolveDefaultSecretProviderAlias } from "../../ref-contract-DVV0zYUk.js";
import {
  n as sanitizeGithubCopilotReplayHistory,
  t as buildGithubCopilotReplayPolicy,
} from "../../replay-policy-DFURPrpA.js";
import { i as ensureAuthProfileStore } from "../../store-B7DoDdVM.js";
import { a as wrapCopilotProviderStream } from "../../stream-BGafGT4r.js";
import { s as coerceSecretRef } from "../../types.secrets-BV0ywRAy.js";
//#region extensions/github-copilot/index.ts
const COPILOT_ENV_VARS = ["COPILOT_GITHUB_TOKEN", "GH_TOKEN", "GITHUB_TOKEN"];
const DEFAULT_COPILOT_MODEL = "github-copilot/claude-opus-4.7";
const DEFAULT_COPILOT_PROFILE_ID = "github-copilot:github";
async function loadGithubCopilotRuntime() {
  return await import("./register.runtime.js");
}
function applyCopilotDefaultModel(cfg) {
  const defaults = cfg.agents?.defaults;
  const existingModel = defaults?.model;
  if (
    typeof existingModel === "string"
      ? existingModel.trim()
      : typeof existingModel === "object" && typeof existingModel?.primary === "string"
        ? existingModel.primary.trim()
        : ""
  )
    return cfg;
  const fallbacks =
    typeof existingModel === "object" && existingModel !== null && "fallbacks" in existingModel
      ? existingModel.fallbacks
      : void 0;
  return {
    ...cfg,
    agents: {
      ...cfg.agents,
      defaults: {
        ...defaults,
        model: {
          ...(fallbacks ? { fallbacks } : void 0),
          primary: DEFAULT_COPILOT_MODEL,
        },
        models: {
          ...defaults?.models,
          [DEFAULT_COPILOT_MODEL]: defaults?.models?.[DEFAULT_COPILOT_MODEL] ?? {},
        },
      },
    },
  };
}
function resolveExistingCopilotTokenProfileId(agentDir) {
  const authStore = ensureAuthProfileStore(agentDir, { allowKeychainPrompt: false });
  return listProfilesForProvider(authStore, PROVIDER_ID).find((profileId) => {
    const profile = authStore.profiles[profileId];
    if (profile?.type !== "token") return false;
    return Boolean(
      normalizeOptionalSecretInput(profile.token) || coerceSecretRef(profile.tokenRef)?.id.trim(),
    );
  });
}
function resolveExistingCopilotAuthResult(agentDir) {
  const profileId = resolveExistingCopilotTokenProfileId(agentDir);
  if (!profileId) return null;
  const credential = ensureAuthProfileStore(agentDir, { allowKeychainPrompt: false }).profiles[
    profileId
  ];
  if (!credential || credential.type !== "token") return null;
  return {
    profiles: [
      {
        profileId,
        credential,
      },
    ],
    defaultModel: DEFAULT_COPILOT_MODEL,
  };
}
function buildGithubCopilotDomainConfigPatch(domain) {
  const normalized = normalizeGithubCopilotDomain(domain);
  return { models: { providers: { [PROVIDER_ID]: { params: { githubDomain: normalized } } } } };
}
function clearGithubCopilotDomainConfigPatch() {
  return { models: { providers: { [PROVIDER_ID]: { params: { githubDomain: void 0 } } } } };
}
function applyGithubCopilotDomainToConfig(config, domain, previousDomain) {
  const isEnterprise = domain !== PUBLIC_GITHUB_COPILOT_DOMAIN;
  if (!isEnterprise && !(!isEnterprise && previousDomain !== "github.com")) return config;
  const models = config.models ?? {};
  const providers = models.providers ?? {};
  const provider = providers[PROVIDER_ID];
  const params = {};
  if (provider?.params) Object.assign(params, provider.params);
  if (isEnterprise) params.githubDomain = domain;
  else delete params.githubDomain;
  const nextProviders = { ...providers };
  if (provider)
    nextProviders[PROVIDER_ID] = {
      ...provider,
      params,
    };
  else Object.assign(nextProviders, { [PROVIDER_ID]: { params } });
  return {
    ...config,
    models: {
      ...models,
      providers: nextProviders,
    },
  };
}
async function resolveCopilotNonInteractiveToken(ctx, flagValue) {
  const resolveFromEnvChain = async () => {
    for (const envVar of COPILOT_ENV_VARS) {
      const resolved = await ctx.resolveApiKey({
        provider: PROVIDER_ID,
        flagName: "--github-copilot-token",
        envVar,
        envVarName: envVar,
        allowProfile: false,
        required: false,
      });
      if (resolved) return resolved;
    }
    return null;
  };
  if (ctx.opts.secretInputMode === "ref") {
    const resolved = await resolveFromEnvChain();
    if (resolved) return resolved;
    if (flagValue) {
      ctx.runtime.error(
        [
          "--github-copilot-token cannot be used with --secret-input-mode ref unless COPILOT_GITHUB_TOKEN, GH_TOKEN, or GITHUB_TOKEN is set in env.",
          "Set one of those env vars and omit --github-copilot-token, or use --secret-input-mode plaintext.",
        ].join("\n"),
      );
      ctx.runtime.exit(1);
    }
    return null;
  }
  const primary = await ctx.resolveApiKey({
    provider: PROVIDER_ID,
    flagValue,
    flagName: "--github-copilot-token",
    envVar: COPILOT_ENV_VARS[0],
    envVarName: COPILOT_ENV_VARS[0],
    allowProfile: false,
    required: false,
  });
  if (primary || flagValue) return primary;
  for (const envVar of COPILOT_ENV_VARS.slice(1)) {
    const resolved = await ctx.resolveApiKey({
      provider: PROVIDER_ID,
      flagName: "--github-copilot-token",
      envVar,
      envVarName: envVar,
      allowProfile: false,
      required: false,
    });
    if (resolved) return resolved;
  }
  return null;
}
async function runGitHubCopilotNonInteractiveAuth(ctx) {
  const opts = ctx.opts;
  const flagValue = normalizeOptionalSecretInput(opts?.githubCopilotToken);
  const resolved = await resolveCopilotNonInteractiveToken(ctx, flagValue);
  let profileId = DEFAULT_COPILOT_PROFILE_ID;
  if (resolved) {
    const useTokenRef = ctx.opts.secretInputMode === "ref" && resolved.source === "env";
    if (useTokenRef && !resolved.envVarName) {
      ctx.runtime.error(
        [
          '--secret-input-mode ref requires an explicit environment variable for provider "github-copilot".',
          "Set COPILOT_GITHUB_TOKEN in env and retry, or use --secret-input-mode plaintext.",
        ].join("\n"),
      );
      ctx.runtime.exit(1);
      return null;
    }
    await upsertAuthProfileWithLock({
      profileId,
      credential: {
        type: "token",
        provider: PROVIDER_ID,
        ...(useTokenRef
          ? {
              tokenRef: {
                source: "env",
                provider: resolveDefaultSecretProviderAlias(ctx.baseConfig, "env", {
                  preferFirstProviderForSource: true,
                }),
                id: resolved.envVarName,
              },
            }
          : { token: resolved.key }),
      },
      agentDir: ctx.agentDir,
    });
  } else {
    if (flagValue && ctx.opts.secretInputMode === "ref") return null;
    const existingProfileId = resolveExistingCopilotTokenProfileId(ctx.agentDir);
    if (!existingProfileId) {
      ctx.runtime.error(
        "Missing --github-copilot-token (or COPILOT_GITHUB_TOKEN / GH_TOKEN / GITHUB_TOKEN env var) for --auth-choice github-copilot.",
      );
      ctx.runtime.exit(1);
      return null;
    }
    profileId = existingProfileId;
  }
  const resolvedDomain = resolveGithubCopilotDomain({ config: ctx.config });
  const previousDomain = resolveGithubCopilotDomain({
    env: {},
    config: ctx.config,
  });
  return applyCopilotDefaultModel(
    applyAuthProfileConfig(
      applyGithubCopilotDomainToConfig(ctx.config, resolvedDomain, previousDomain),
      {
        profileId,
        provider: PROVIDER_ID,
        mode: "token",
      },
    ),
  );
}
var github_copilot_default = definePluginEntry({
  id: "github-copilot",
  name: "GitHub Copilot Provider",
  description: "Bundled GitHub Copilot provider plugin",
  register(api) {
    const startupPluginConfig = api.pluginConfig ?? {};
    function resolveCurrentPluginConfig(config) {
      const runtimePluginConfig = resolvePluginConfigObject(config, "github-copilot");
      if (runtimePluginConfig) return runtimePluginConfig;
      return config ? {} : startupPluginConfig;
    }
    const dynamicModels = createGithubCopilotDynamicModelHooks({
      discoveryEnabled: (config) => resolveCurrentPluginConfig(config).discovery?.enabled !== false,
    });
    async function runGithubCopilotUnifiedLiveCatalog(ctx) {
      const result = await dynamicModels.runCatalog(ctx);
      if (!result || !("provider" in result)) return null;
      return (result.provider.models ?? []).map((model) => {
        const entry = {
          kind: "text",
          provider: PROVIDER_ID,
          model: model.id,
          source: "live",
        };
        if (model.name) entry.label = model.name;
        return entry;
      });
    }
    async function promptForEnterpriseDomain(ctx) {
      const envDomain = ctx.env?.COPILOT_GITHUB_DOMAIN?.trim();
      if (envDomain) {
        const normalizedEnv = normalizeGithubCopilotDomain(envDomain);
        await ctx.prompter.note(
          `Using the GitHub Enterprise domain from COPILOT_GITHUB_DOMAIN (${normalizedEnv}). Unset it to enter a different domain interactively.`,
          "GitHub Copilot",
        );
        return normalizedEnv;
      }
      const current = resolveGithubCopilotDomain({
        env: ctx.env,
        config: ctx.config,
      });
      return normalizeGithubCopilotDomain(
        await ctx.prompter.text({
          message: "GitHub Enterprise domain (data residency)",
          placeholder: "your-org.ghe.com",
          initialValue: current === "github.com" ? "" : current,
          validate: (raw) => {
            const trimmed = raw.trim();
            if (!trimmed)
              return "Enter your GitHub Enterprise domain (for example your-org.ghe.com).";
            if (
              normalizeGithubCopilotDomain(trimmed) === "github.com" &&
              trimmed.toLowerCase() !== "github.com"
            ) {
              if (trimmed.toLowerCase().endsWith(".ghe.com"))
                return "Enter your tenant root (for example your-org.ghe.com), not a service host like api.your-org.ghe.com — service endpoints are derived automatically.";
              return "Enter a github.com or *.ghe.com hostname without scheme or path (for example your-org.ghe.com).";
            }
          },
        }),
      );
    }
    async function runGitHubCopilotDeviceAuth(ctx, domain) {
      const normalizedDomain = normalizeGithubCopilotDomain(domain);
      const isEnterprise = normalizedDomain !== PUBLIC_GITHUB_COPILOT_DOMAIN;
      const previousDomain = resolveGithubCopilotDomain({
        env: {},
        config: ctx.config,
      });
      const domainChanged = previousDomain !== normalizedDomain;
      const configPatch = isEnterprise
        ? buildGithubCopilotDomainConfigPatch(normalizedDomain)
        : previousDomain !== "github.com"
          ? clearGithubCopilotDomainConfigPatch()
          : void 0;
      const existing = resolveExistingCopilotAuthResult(ctx.agentDir);
      if (existing && !domainChanged) {
        if (
          !(await ctx.prompter.confirm({
            message: "GitHub Copilot auth already exists. Re-run login?",
            initialValue: false,
          }))
        )
          return {
            ...existing,
            ...(configPatch ? { configPatch } : {}),
          };
      } else if (existing && domainChanged)
        await ctx.prompter.note(
          isEnterprise
            ? `Switching to ${normalizedDomain} requires a new tenant login to authorize Copilot for that domain.`
            : "Switching back to github.com requires a new login to authorize Copilot for the public domain.",
          "GitHub Copilot",
        );
      await ctx.prompter.note(
        [
          isEnterprise
            ? `This will open a GitHub Enterprise device login (${normalizedDomain}) to authorize Copilot.`
            : "This will open a GitHub device login to authorize Copilot.",
          "Requires an active GitHub Copilot subscription.",
        ].join("\n"),
        "GitHub Copilot",
      );
      const { runGitHubCopilotDeviceFlow } = await import("./login.js");
      const result = await runGitHubCopilotDeviceFlow(
        {
          showCode: async ({ verificationUrl, userCode, expiresInMs }) => {
            const expiresInMinutes = Math.max(1, Math.round(expiresInMs / 6e4));
            if (ctx.isRemote) await ctx.openUrl(verificationUrl);
            await ctx.prompter.note(
              [
                "Open this URL in your browser and enter the code below.",
                `URL: ${verificationUrl}`,
                `Code: ${userCode}`,
                `Code expires in ${expiresInMinutes} minutes. Never share it.`,
                "",
                "If a browser does not open automatically after you continue, copy the URL manually.",
              ].join("\n"),
              "Authorize GitHub Copilot",
            );
          },
          ...(ctx.isRemote
            ? {}
            : {
                openUrl: async (url) => {
                  await ctx.openUrl(url);
                },
              }),
          ...(ctx.signal ? { signal: ctx.signal } : {}),
        },
        normalizedDomain,
      );
      if (result.status === "access_denied") {
        await ctx.prompter.note("GitHub Copilot login was cancelled.", "GitHub Copilot");
        return { profiles: [] };
      }
      if (result.status === "expired") {
        await ctx.prompter.note(
          "The GitHub device code expired. Retry login to get a new code.",
          "GitHub Copilot",
        );
        return { profiles: [] };
      }
      return {
        profiles: [
          {
            profileId: DEFAULT_COPILOT_PROFILE_ID,
            credential: {
              type: "token",
              provider: PROVIDER_ID,
              token: result.accessToken,
            },
          },
        ],
        defaultModel: DEFAULT_COPILOT_MODEL,
        ...(configPatch ? { configPatch } : {}),
      };
    }
    async function runGitHubCopilotAuth(ctx) {
      return await runGitHubCopilotDeviceAuth(ctx, PUBLIC_GITHUB_COPILOT_DOMAIN);
    }
    async function runGitHubCopilotEnterpriseAuth(ctx) {
      const domain = await promptForEnterpriseDomain(ctx);
      if (!domain) {
        await ctx.prompter.note("Enterprise login cancelled.", "GitHub Copilot");
        return { profiles: [] };
      }
      if (domain === "github.com") {
        await ctx.prompter.note(
          "github.com is the default — use the standard GitHub Copilot login instead of the enterprise (data residency) option.",
          "GitHub Copilot",
        );
        return { profiles: [] };
      }
      return await runGitHubCopilotDeviceAuth(ctx, domain);
    }
    api.registerMemoryEmbeddingProvider(githubCopilotMemoryEmbeddingProviderAdapter);
    api.registerProvider({
      id: PROVIDER_ID,
      label: "GitHub Copilot",
      docsPath: "/providers/models",
      envVars: COPILOT_ENV_VARS,
      auth: [
        {
          id: "device",
          label: "GitHub device login",
          hint: "Browser device-code flow",
          kind: "device_code",
          starterModel: DEFAULT_COPILOT_MODEL,
          run: async (ctx) => await runGitHubCopilotAuth(ctx),
          runNonInteractive: async (ctx) => await runGitHubCopilotNonInteractiveAuth(ctx),
        },
        {
          id: "device-enterprise",
          label: "GitHub Enterprise device login (data residency)",
          hint: "Device-code flow against your *.ghe.com tenant",
          kind: "device_code",
          run: async (ctx) => await runGitHubCopilotEnterpriseAuth(ctx),
          wizard: {
            choiceId: "github-copilot-enterprise",
            choiceLabel: "GitHub Copilot (Enterprise / data residency)",
            choiceHint: "Device login against your GitHub Enterprise (*.ghe.com) tenant",
            methodId: "device-enterprise",
            assistantPriority: 2,
            modelSelection: { promptWhenAuthChoiceProvided: true },
          },
        },
      ],
      wizard: {
        setup: {
          choiceId: "github-copilot",
          choiceLabel: "GitHub Copilot",
          choiceHint: "Device login with your GitHub account",
          methodId: "device",
          assistantPriority: 1,
          modelSelection: { promptWhenAuthChoiceProvided: true },
        },
      },
      catalog: {
        order: "late",
        run: dynamicModels.runCatalog,
      },
      prepareDynamicModel: dynamicModels.prepareDynamicModel,
      resolveDynamicModel: dynamicModels.resolveDynamicModel,
      preferRuntimeResolvedModel: dynamicModels.preferRuntimeResolvedModel,
      wrapStreamFn: wrapCopilotProviderStream,
      buildReplayPolicy: ({ modelId }) => buildGithubCopilotReplayPolicy(modelId),
      sanitizeReplayHistory: sanitizeGithubCopilotReplayHistory,
      resolveThinkingProfile: ({ modelId, compat }) => {
        return {
          levels: [
            { id: "off" },
            { id: "minimal" },
            { id: "low" },
            { id: "medium" },
            { id: "high" },
            ...resolveCopilotExtendedThinkingLevels(modelId, compat).map((id) => ({ id })),
          ],
        };
      },
      prepareRuntimeAuth: async (ctx) => {
        const { resolveCopilotApiToken } = await loadGithubCopilotRuntime();
        const token = await resolveCopilotApiToken({
          githubToken: ctx.apiKey,
          env: ctx.env,
          githubDomain: resolveGithubCopilotDomain({
            env: ctx.env,
            config: ctx.config,
          }),
        });
        return {
          apiKey: token.token,
          baseUrl: token.baseUrl,
          expiresAt: token.expiresAt,
        };
      },
      resolveUsageAuth: async (ctx) => await ctx.resolveOAuthToken(),
      fetchUsageSnapshot: async (ctx) => {
        const { fetchCopilotUsage } = await loadGithubCopilotRuntime();
        return await fetchCopilotUsage(
          ctx.token,
          ctx.timeoutMs,
          ctx.fetchFn,
          resolveGithubCopilotDomain({
            env: ctx.env,
            config: ctx.config,
          }),
        );
      },
    });
    api.registerModelCatalogProvider({
      provider: PROVIDER_ID,
      kinds: ["text"],
      liveCatalog: runGithubCopilotUnifiedLiveCatalog,
    });
  },
});
//#endregion
export { github_copilot_default as default };
