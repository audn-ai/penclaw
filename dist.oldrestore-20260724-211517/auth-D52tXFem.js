import { cancel, confirm, isCancel, password, select, text } from "@clack/prompts";
import {
  a as resolveAgentDir,
  c as resolveDefaultAgentId,
  o as resolveAgentWorkspaceDir,
} from "./agent-scope-config-DVIR1nBa.js";
import "./src-Bl7G9qvi.js";
import { c as callGateway } from "./call-BVMO6az_.js";
import { t as createClackPrompter } from "./clack-prompter-Cu4E8Cn1.js";
import { r as repairCodexRuntimePluginInstallForModelSelection } from "./codex-runtime-plugin-install-Db4E_THw.js";
import "./agent-scope-y9xQv_q1.js";
import { t as formatCliCommand } from "./command-format-H_Arqann.js";
import { n as repairCopilotRuntimePluginInstallForModelSelection } from "./copilot-runtime-plugin-install-CLh9D0hH.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { n as externalCliDiscoveryForProviderAuth } from "./external-cli-discovery-To6-j7MZ.js";
import { r as logConfigUpdated } from "./logging-C64BTYfR.js";
import { n as normalizeAgentModelRefForConfig } from "./model-input-B7OGjVYg.js";
import { o as normalizeProviderId } from "./model-selection-normalize-BoKGJiBx.js";
import { n as normalizeSecretInput } from "./normalize-secret-input-Df_qhWv_.js";
import { C as resolveExpiresAtMsFromDurationMs } from "./number-coercion-CJQ8TR--.js";
import "./auth-profiles-CX7JDmZ9.js";
import { t as parseDurationMs } from "./parse-duration-Be19e01j.js";
import { n as listProfilesForProvider } from "./profile-list-I4BheGlK.js";
import {
  a as removeProviderAuthProfilesWithLock,
  c as upsertAuthProfileWithLock,
  r as promoteAuthProfileInOrder,
} from "./profiles-DxTOoenK.js";
import { t as styleSelectParams } from "./prompt-select-styled-params-CvMQXWIw.js";
import { n as stylePromptMessage } from "./prompt-style-BQVvtDcR.js";
import "./workspace-DXzCbuC0.js";
import { r as resolveProviderIdForAuth } from "./provider-auth-aliases-RaEzqkSo.js";
import {
  a as restorePriorAgentsDefaultsModelUnlessOptIn,
  i as resolveProviderMatch,
  n as applyProviderAuthConfigPatch,
  r as pickAuthMethod,
  t as applyDefaultModel,
} from "./provider-auth-choice-helpers-CZAJOSgv.js";
import { t as applyAuthProfileConfig } from "./provider-auth-helpers-CLs4Yz61.js";
import { n as validateAnthropicSetupToken } from "./provider-auth-token-DyHOhkct.js";
import { t as createVpsAwareOAuthHandlers } from "./provider-oauth-flow-CKUkw2zL.js";
import { n as resolvePluginProviders } from "./providers.runtime-Cmp9Ggnk.js";
import { t as isRemoteEnvironment } from "./remote-env-LtAgrReT.js";
import {
  i as resolvePluginSetupRegistry,
  r as resolvePluginSetupProvider,
} from "./setup-registry-B--wI5Zy.js";
import {
  a as loadValidConfigOrThrow,
  d as updateConfig,
  s as resolveKnownAgentId,
} from "./shared-DFGOIlxJ.js";
import { u as loadAuthProfileStoreForRuntime } from "./store-B7DoDdVM.js";
import {
  c as normalizeOptionalString,
  f as normalizeStringifiedOptionalString,
} from "./string-coerce-DW4mBlAt.js";
import { n as clearAuthProfileCooldown } from "./usage-BZgGbRoq.js";
import { n as resolveDefaultAgentWorkspaceDir } from "./workspace-default-h9TzWSvp.js";
//#region src/commands/models/auth.ts
/** Commands for adding, pasting, and logging into provider model auth profiles. */
async function refreshRunningGatewayAuthState() {
  try {
    await callGateway({
      method: "models.authStatus",
      params: { refresh: true },
      timeoutMs: 3e3,
    });
  } catch {}
}
function resolveManualTokenExpiryMs(expiresIn) {
  const normalizedExpiresIn = normalizeStringifiedOptionalString(expiresIn);
  if (!normalizedExpiresIn) return;
  const expires = resolveExpiresAtMsFromDurationMs(
    parseDurationMs(normalizedExpiresIn, { defaultUnit: "d" }),
  );
  if (expires === void 0)
    throw new Error("Invalid expiry duration: resulting token expiry is outside Date range.");
  return expires;
}
function guardCancel(value) {
  if (typeof value === "symbol" || isCancel(value)) {
    cancel("Cancelled.");
    process.exit(0);
  }
  return value;
}
const confirm$1 = async (params) =>
  guardCancel(
    await confirm({
      ...params,
      message: stylePromptMessage(params.message),
    }),
  );
const text$1 = async (params) =>
  guardCancel(
    await text({
      ...params,
      message: stylePromptMessage(params.message),
    }),
  );
const password$1 = async (params) =>
  guardCancel(
    await password({
      ...params,
      message: stylePromptMessage(params.message),
    }),
  );
const select$1 = async (params) => guardCancel(await select(styleSelectParams(params)));
async function readPipedStdin() {
  process.stdin.setEncoding("utf8");
  let input = "";
  for await (const chunk of process.stdin) input += String(chunk);
  return input;
}
async function readPastedSecret(params) {
  const promptParams = {
    message: params.message,
    validate: params.validate,
  };
  const normalized = normalizeSecretInput(
    process.stdin.isTTY
      ? await (params.masked ? password$1(promptParams) : text$1(promptParams))
      : await readPipedStdin(),
  );
  const validationMessage = params.validate?.(normalized);
  if (validationMessage) throw new Error(validationMessage);
  return normalized;
}
function resolveDefaultTokenProfileId(provider) {
  return `${normalizeProviderId(provider)}:manual`;
}
function normalizeManualAuthProvider(provider) {
  const normalized = normalizeProviderId(provider);
  return normalized === "openai" || normalized === "codex" || normalized === "openai-codex"
    ? "openai"
    : normalized;
}
function isOpenAIProvider(provider) {
  return normalizeManualAuthProvider(provider) === "openai";
}
function stripBearerPrefix(value) {
  return value
    .trim()
    .replace(/^Bearer\s+/i, "")
    .trim();
}
function looksLikeOpenAIApiKey(value) {
  return /^sk-[A-Za-z0-9_-]{8,}$/.test(value.trim());
}
function looksLikeJwtToken(value) {
  const parts = stripBearerPrefix(value).split(".");
  return parts.length === 3 && parts.every((part) => /^[A-Za-z0-9_-]{8,}$/.test(part));
}
function looksLikeStructuredCredential(value) {
  const trimmed = value.trim();
  return trimmed.startsWith("{") || trimmed.startsWith("[");
}
function validateOpenAICodexApiKeyInput(value) {
  const trimmed = value.trim();
  if (!trimmed) return "Required";
  if (looksLikeOpenAIApiKey(trimmed)) return;
  if (looksLikeJwtToken(trimmed) || looksLikeStructuredCredential(trimmed))
    return `That looks like token or OAuth material, not an OpenAI API key. Use ${formatCliCommand("openclaw models auth paste-token --provider openai")} for token auth material.`;
  return "That does not look like an OpenAI API key.";
}
function listProvidersWithAuthMethods(providers) {
  return providers.filter((provider) => provider.auth.length > 0);
}
function listTokenAuthMethods(provider) {
  return provider.auth.filter((method) => method.kind === "token");
}
function listProvidersWithTokenMethods(providers) {
  return providers.filter((provider) => listTokenAuthMethods(provider).length > 0);
}
function mergeSetupProviders(providers, setupProviders) {
  if (setupProviders.length === 0) return [...providers];
  const setupById = new Map(
    setupProviders.map((provider) => [normalizeProviderId(provider.id), provider]),
  );
  const merged = providers.map(
    (provider) => setupById.get(normalizeProviderId(provider.id)) ?? provider,
  );
  const existing = new Set(merged.map((provider) => normalizeProviderId(provider.id)));
  for (const provider of setupProviders)
    if (!existing.has(normalizeProviderId(provider.id))) merged.push(provider);
  return merged;
}
function preferSetupAuthProviders(params) {
  const requestedProvider = params.requestedProvider
    ? normalizeManualAuthProvider(params.requestedProvider)
    : void 0;
  if (requestedProvider) {
    const setupProvider = resolvePluginSetupProvider({
      provider: requestedProvider,
      config: params.config,
      workspaceDir: params.workspaceDir,
    });
    return setupProvider ? [setupProvider] : [...params.providers];
  }
  const setupProviders = resolvePluginSetupRegistry({
    config: params.config,
    workspaceDir: params.workspaceDir,
  }).providers.map((entry) => entry.provider);
  return mergeSetupProviders(params.providers, setupProviders);
}
async function resolveModelsAuthContext(params) {
  const config = params?.config ?? (await loadValidConfigOrThrow());
  const agentId =
    resolveKnownAgentId({
      cfg: config,
      rawAgentId: params?.rawAgentId,
    }) ?? resolveDefaultAgentId(config);
  const agentDir = resolveAgentDir(config, agentId);
  const workspaceDir =
    resolveAgentWorkspaceDir(config, agentId) ?? resolveDefaultAgentWorkspaceDir();
  const requestedProvider = params?.requestedProvider?.trim();
  const providerRef = requestedProvider ? normalizeManualAuthProvider(requestedProvider) : void 0;
  return {
    config,
    agentDir,
    workspaceDir,
    providers: preferSetupAuthProviders({
      providers: resolvePluginProviders({
        config,
        workspaceDir,
        mode: "setup",
        includeUntrustedWorkspacePlugins: false,
        bundledProviderVitestCompat: true,
        ...(providerRef
          ? {
              providerRefs: [providerRef],
              activate: true,
            }
          : {}),
      }),
      config,
      workspaceDir,
      requestedProvider: providerRef,
    }),
  };
}
async function resolveModelsAuthAgentDir(rawAgentId) {
  const config = await loadValidConfigOrThrow();
  return resolveAgentDir(
    config,
    resolveKnownAgentId({
      cfg: config,
      rawAgentId,
    }) ?? resolveDefaultAgentId(config),
  );
}
function resolveRequestedProviderOrThrow(providers, rawProvider) {
  const requested = rawProvider?.trim();
  if (!requested) return null;
  const matched = resolveProviderMatch(providers, requested);
  if (matched) return matched;
  const available = providers
    .map((provider) => provider.id)
    .filter(Boolean)
    .toSorted((a, b) => a.localeCompare(b));
  const availableText = available.length > 0 ? available.join(", ") : "(none)";
  throw new Error(
    `Unknown provider "${requested}". Loaded providers: ${availableText}. Verify plugins via \`${formatCliCommand("openclaw plugins list --json")}\`.`,
  );
}
function resolveTokenMethodOrThrow(provider, rawMethod) {
  const tokenMethods = listTokenAuthMethods(provider);
  if (rawMethod?.trim()) {
    const matched = pickAuthMethod(provider, rawMethod);
    if (matched && matched.kind === "token") return matched;
    const available = tokenMethods.map((method) => method.id).join(", ") || "(none)";
    throw new Error(
      `Unknown token auth method "${rawMethod}" for provider "${provider.id}". Available token methods: ${available}.`,
    );
  }
  return null;
}
async function pickProviderAuthMethod(params) {
  const rawRequestedMethod = params.requestedMethod?.trim();
  if (rawRequestedMethod) return pickAuthMethod(params.provider, rawRequestedMethod);
  const oauthMethod = params.provider.auth.find((method) => method.kind === "oauth");
  if (oauthMethod) return oauthMethod;
  if (params.provider.auth.length === 1) return params.provider.auth[0] ?? null;
  return await params.prompter
    .select({
      message: `Auth method for ${params.provider.label}`,
      options: params.provider.auth.map((method) => ({
        value: method.id,
        label: method.label,
        hint: method.hint,
      })),
    })
    .then((id) => params.provider.auth.find((method) => method.id === id) ?? null);
}
async function pickProviderTokenMethod(params) {
  const explicitTokenMethod = resolveTokenMethodOrThrow(params.provider, params.requestedMethod);
  if (explicitTokenMethod) return explicitTokenMethod;
  const tokenMethods = listTokenAuthMethods(params.provider);
  if (tokenMethods.length === 0) return null;
  const setupTokenMethod = tokenMethods.find((method) => method.id === "setup-token");
  if (setupTokenMethod) return setupTokenMethod;
  if (tokenMethods.length === 1) return tokenMethods[0] ?? null;
  return await params.prompter
    .select({
      message: `Token method for ${params.provider.label}`,
      options: tokenMethods.map((method) => ({
        value: method.id,
        label: method.label,
        hint: method.hint,
      })),
    })
    .then((id) => tokenMethods.find((method) => method.id === id) ?? null);
}
async function persistProviderAuthResult(params) {
  const defaultModel = params.result.defaultModel
    ? normalizeAgentModelRefForConfig(params.result.defaultModel)
    : void 0;
  const profiles = params.profiles ?? params.result.profiles;
  const shouldUpdateConfig = Boolean(
    params.result.configPatch || (params.setDefault && defaultModel),
  );
  for (const profile of profiles) {
    const configuredSelection = resolveConfiguredAuthSelectionForProvider(
      params.config,
      profile.credential.provider,
    );
    await upsertAuthProfileWithLockOrThrow({
      profileId: profile.profileId,
      credential: profile.credential,
      agentDir: params.agentDir,
    });
    await promoteAuthProfileInOrder({
      agentDir: params.agentDir,
      provider: profile.credential.provider,
      profileId: profile.profileId,
      createIfMissing: configuredSelection.createIfMissing,
      ...(configuredSelection.order ? { createFromOrder: configuredSelection.order } : {}),
    });
  }
  if (shouldUpdateConfig) {
    const updated = await updateConfig((cfg) => {
      const priorAgentsDefaultsModel = cfg.agents?.defaults?.model;
      let next = cfg;
      if (params.result.configPatch)
        next = applyProviderAuthConfigPatch(next, params.result.configPatch, {
          replaceDefaultModels: params.result.replaceDefaultModels,
        });
      next = restorePriorAgentsDefaultsModelUnlessOptIn({
        cfg: next,
        priorAgentsDefaultsModel,
        setDefault: params.setDefault,
      });
      if (params.setDefault && defaultModel) next = applyDefaultModel(next, defaultModel);
      return next;
    });
    if (defaultModel) {
      const repaired = await repairCodexRuntimePluginInstallForModelSelection({
        cfg: updated,
        model: defaultModel,
      });
      const copilotRepaired = await repairCopilotRuntimePluginInstallForModelSelection({
        cfg: updated,
        model: defaultModel,
      });
      for (const warning of [...repaired.warnings, ...copilotRepaired.warnings])
        params.runtime.error?.(warning);
    }
    logConfigUpdated(params.runtime);
  }
  await refreshRunningGatewayAuthState();
  for (const profile of profiles)
    params.runtime.log(
      `Auth profile: ${profile.profileId} (${profile.credential.provider}/${credentialMode(profile.credential)})`,
    );
  if (defaultModel)
    params.runtime.log(
      params.setDefault
        ? `Default model set to ${defaultModel}`
        : `Default model available: ${defaultModel} (use --set-default to apply)`,
    );
  if (params.result.notes && params.result.notes.length > 0)
    await params.prompter.note(params.result.notes.join("\n"), "Provider notes");
}
function resolveConfiguredAuthSelectionForProvider(cfg, provider) {
  const providerAuthKey = resolveProviderIdForAuth(provider, { config: cfg });
  for (const [orderProvider, profileIds] of Object.entries(cfg.auth?.order ?? {}))
    if (
      profileIds.length > 0 &&
      resolveProviderIdForAuth(orderProvider, { config: cfg }) === providerAuthKey
    )
      return {
        createIfMissing: true,
        order: profileIds,
      };
  const profileIds = Object.entries(cfg.auth?.profiles ?? {})
    .filter(
      ([, profile]) =>
        resolveProviderIdForAuth(profile.provider, { config: cfg }) === providerAuthKey,
    )
    .map(([profileId]) => profileId);
  return profileIds.length > 0
    ? {
        createIfMissing: true,
        order: profileIds,
      }
    : { createIfMissing: false };
}
async function runProviderAuthMethod(params) {
  const selectedProviderId = normalizeProviderId(params.provider.id);
  await clearStaleProfileLockouts(selectedProviderId, params.agentDir);
  const result = await params.method.run({
    config: params.config,
    env: params.env ?? process.env,
    agentDir: params.agentDir,
    workspaceDir: params.workspaceDir,
    prompter: params.prompter,
    runtime: params.runtime,
    allowSecretRefPrompt: false,
    isRemote: params.isRemote ?? isRemoteEnvironment(),
    openUrl:
      params.openUrl ??
      (async (url) => {
        const { openUrl } = await import("./onboard-helpers-LaeM9LZm.js");
        await openUrl(url);
      }),
    oauth: {
      createVpsAwareHandlers: (runtimeParams) => createVpsAwareOAuthHandlers(runtimeParams),
    },
  });
  const resultProviderIds = new Set(
    result.profiles.map((profile) => normalizeProviderId(profile.credential.provider)),
  );
  for (const providerId of resultProviderIds)
    if (providerId && providerId !== selectedProviderId)
      await clearStaleProfileLockouts(providerId, params.agentDir);
  const profiles = resolveLoginProfiles({
    result,
    requestedProfileId: params.profileId,
  });
  await persistProviderAuthResult({
    result,
    profiles,
    config: params.config,
    agentDir: params.agentDir,
    runtime: params.runtime,
    prompter: params.prompter,
    setDefault: params.setDefault,
  });
  return {
    result,
    profiles,
  };
}
/** Runs an interactive provider setup-token auth flow. */
async function modelsAuthSetupTokenCommand(opts, runtime) {
  if (!process.stdin.isTTY)
    throw new Error(
      `setup-token requires an interactive TTY. In automation, use ${formatCliCommand("openclaw models auth paste-token --provider <provider>")} instead.`,
    );
  const { config, agentDir, workspaceDir, providers } = await resolveModelsAuthContext({
    requestedProvider: opts.provider,
    rawAgentId: opts.agent,
  });
  const tokenProviders = listProvidersWithTokenMethods(providers);
  if (tokenProviders.length === 0)
    throw new Error(
      `No provider token-auth plugins found. Install one via \`${formatCliCommand("openclaw plugins install")}\`.`,
    );
  const provider =
    resolveRequestedProviderOrThrow(tokenProviders, opts.provider) ?? tokenProviders[0] ?? null;
  if (!provider)
    throw new Error(
      `No token-capable provider is available. Run ${formatCliCommand("openclaw plugins list")} to verify provider plugins are installed.`,
    );
  if (!opts.yes) {
    if (
      !(await confirm$1({
        message: `Continue with ${provider.label} token auth?`,
        initialValue: true,
      }))
    )
      return;
  }
  const prompter = createClackPrompter();
  const method = await pickProviderTokenMethod({
    provider,
    prompter,
  });
  if (!method) throw new Error(`Provider "${provider.id}" does not expose a token auth method.`);
  await runProviderAuthMethod({
    config,
    agentDir,
    workspaceDir,
    provider,
    method,
    runtime,
    prompter,
  });
}
/** Reads a pasted bearer/setup token and stores it as an auth profile. */
async function modelsAuthPasteTokenCommand(opts, runtime) {
  const agentDir = await resolveModelsAuthAgentDir(opts.agent);
  const rawProvider = normalizeOptionalString(opts.provider);
  if (!rawProvider)
    throw new Error(
      `Missing --provider. Run ${formatCliCommand("openclaw models status")} or ${formatCliCommand("openclaw plugins list")} to choose a provider.`,
    );
  const provider = normalizeManualAuthProvider(rawProvider);
  const profileId =
    normalizeOptionalString(opts.profileId) || resolveDefaultTokenProfileId(provider);
  const validateTokenInput = (value) => {
    const trimmed = value?.trim();
    if (!trimmed) return "Required";
    if (provider === "anthropic")
      return validateAnthropicSetupToken(trimmed.replaceAll(/\s+/g, ""));
    if (isOpenAIProvider(provider) && looksLikeOpenAIApiKey(trimmed))
      return `That looks like an OpenAI API key. Use ${formatCliCommand("openclaw models auth paste-api-key --provider openai")} for API-key auth.`;
  };
  const tokenInput = await readPastedSecret({
    message: `Paste token for ${provider}`,
    masked: true,
    validate: validateTokenInput,
  });
  const token =
    provider === "anthropic"
      ? tokenInput.replaceAll(/\s+/g, "").trim()
      : (normalizeOptionalString(tokenInput) ?? "");
  const expires = resolveManualTokenExpiryMs(opts.expiresIn);
  await upsertAuthProfileWithLockOrThrow({
    profileId,
    credential: {
      type: "token",
      provider,
      token,
      ...(expires ? { expires } : {}),
    },
    agentDir,
  });
  await updateConfig((cfg) =>
    applyAuthProfileConfig(cfg, {
      profileId,
      provider,
      mode: "token",
    }),
  );
  await refreshRunningGatewayAuthState();
  logConfigUpdated(runtime);
  runtime.log(`Auth profile: ${profileId} (${provider}/token)`);
  if (provider === "anthropic") {
    runtime.log("Anthropic setup-token auth is supported in OpenClaw.");
    runtime.log("OpenClaw prefers Claude CLI reuse when it is available on the host.");
    runtime.log("Anthropic staff told us this OpenClaw path is allowed again.");
  }
}
/** Reads a pasted API key and stores it as an auth profile. */
async function modelsAuthPasteApiKeyCommand(opts, runtime) {
  const agentDir = await resolveModelsAuthAgentDir(opts.agent);
  const rawProvider = normalizeOptionalString(opts.provider);
  if (!rawProvider)
    throw new Error(
      `Missing --provider. Run ${formatCliCommand("openclaw models status")} or ${formatCliCommand("openclaw plugins list")} to choose a provider.`,
    );
  const provider = normalizeManualAuthProvider(rawProvider);
  const profileId =
    normalizeOptionalString(opts.profileId) || resolveDefaultTokenProfileId(provider);
  await upsertAuthProfileWithLockOrThrow({
    profileId,
    credential: {
      type: "api_key",
      provider,
      key: await readPastedSecret({
        message: `Paste API key for ${provider}`,
        masked: true,
        validate: (value) => {
          const trimmed = value?.trim();
          if (!trimmed) return "Required";
          if (isOpenAIProvider(provider)) return validateOpenAICodexApiKeyInput(trimmed);
        },
      }),
    },
    agentDir,
  });
  await updateConfig((cfg) =>
    applyAuthProfileConfig(cfg, {
      profileId,
      provider,
      mode: "api_key",
    }),
  );
  await refreshRunningGatewayAuthState();
  logConfigUpdated(runtime);
  runtime.log(`Auth profile: ${profileId} (${provider}/api_key)`);
}
async function upsertAuthProfileWithLockOrThrow(params) {
  if (!(await upsertAuthProfileWithLock(params)))
    throw new Error(
      "Failed to update auth profile store; the auth store lock may be busy. Wait a moment and retry.",
    );
}
/** Interactive helper for adding token auth profiles, with provider/method prompts. */
async function modelsAuthAddCommand(opts, runtime) {
  const { config, agentDir, workspaceDir, providers } = await resolveModelsAuthContext({
    rawAgentId: opts.agent,
  });
  const tokenProviders = listProvidersWithTokenMethods(providers);
  const provider = await select$1({
    message: "Token provider",
    options: [
      ...tokenProviders.map((providerPlugin) => ({
        value: providerPlugin.id,
        label: providerPlugin.id,
        hint: providerPlugin.docsPath ? `Docs: ${providerPlugin.docsPath}` : void 0,
      })),
      {
        value: "custom",
        label: "custom (type provider id)",
      },
    ],
  });
  const providerId =
    provider === "custom"
      ? normalizeProviderId(
          await text$1({
            message: "Provider id",
            validate: (value) => (value?.trim() ? void 0 : "Required"),
          }),
        )
      : provider;
  const providerPlugin =
    provider === "custom" ? null : resolveRequestedProviderOrThrow(tokenProviders, providerId);
  if (providerPlugin) {
    const tokenMethods = listTokenAuthMethods(providerPlugin);
    const methodId =
      tokenMethods.length > 0
        ? await select$1({
            message: "Token method",
            options: [
              ...tokenMethods.map((method) => ({
                value: method.id,
                label: method.label,
                hint: method.hint,
              })),
              {
                value: "paste",
                label: "paste token",
              },
            ],
          })
        : "paste";
    if (methodId !== "paste") {
      const prompter = createClackPrompter();
      const method = tokenMethods.find((candidate) => candidate.id === methodId);
      if (!method)
        throw new Error(
          `Unknown token auth method "${methodId}". Run ${formatCliCommand("openclaw models auth login --provider " + providerPlugin.id)} to choose interactively.`,
        );
      await runProviderAuthMethod({
        config,
        agentDir,
        workspaceDir,
        provider: providerPlugin,
        method,
        runtime,
        prompter,
      });
      return;
    }
  }
  const profileIdDefault = resolveDefaultTokenProfileId(providerId);
  await modelsAuthPasteTokenCommand(
    {
      provider: providerId,
      profileId: (
        await text$1({
          message: "Profile id",
          initialValue: profileIdDefault,
          validate: (value) => (value?.trim() ? void 0 : "Required"),
        })
      ).trim(),
      expiresIn: (await confirm$1({
        message: "Does this token expire?",
        initialValue: false,
      }))
        ? (
            await text$1({
              message: "Expires in (duration)",
              initialValue: "365d",
              validate: (value) => {
                try {
                  parseDurationMs(value ?? "", { defaultUnit: "d" });
                  return;
                } catch {
                  return "Invalid duration (e.g. 365d, 12h, 30m)";
                }
              },
            })
          ).trim()
        : void 0,
      agent: opts.agent,
    },
    runtime,
  );
}
/**
 * Clear stale cooldown/disabled state for all profiles matching a provider.
 * When a user explicitly runs `models auth login`, they intend to fix auth —
 * stale `auth_permanent` / `billing` lockouts should not persist across
 * a deliberate re-authentication attempt.
 */
async function clearStaleProfileLockouts(provider, agentDir) {
  try {
    const store = loadAuthProfileStoreForRuntime(agentDir, {
      externalCli: externalCliDiscoveryForProviderAuth({ provider }),
    });
    const profileIds = listProfilesForProvider(store, provider);
    for (const profileId of profileIds)
      await clearAuthProfileCooldown({
        store,
        profileId,
        agentDir,
      });
  } catch {}
}
/** Resolves a requested login provider or throws with available provider details. */
function resolveRequestedLoginProviderOrThrow(providers, rawProvider) {
  return resolveRequestedProviderOrThrow(providers, rawProvider);
}
function credentialMode(credential) {
  if (credential.type === "api_key") return "api_key";
  if (credential.type === "token") return "token";
  return "oauth";
}
/** Applies an optional profile-id override to a single returned login profile. */
function resolveLoginProfiles(params) {
  const requestedProfileId = params.requestedProfileId?.trim();
  if (!requestedProfileId) return params.result.profiles;
  if (params.result.profiles.length !== 1)
    throw new Error(
      "--profile-id requires exactly one returned auth profile from the selected auth method.",
    );
  const [profile] = params.result.profiles;
  return [
    {
      ...expectDefined(profile, "auth profile"),
      profileId: requestedProfileId,
    },
  ];
}
function maybeLogOpenAICodexNativeSearchTip(runtime, providerId) {
  if (providerId !== "openai") return;
  runtime.log(
    "Tip: Codex-capable models can use native Codex web search. Enable it with openclaw configure --section web (recommended mode: cached). Docs: https://docs.openclaw.ai/tools/web",
  );
}
async function runModelsAuthLoginFlow(opts) {
  const { config, agentDir, workspaceDir, providers } = await resolveModelsAuthContext({
    requestedProvider: opts.provider,
    rawAgentId: opts.agent,
    config: opts.config,
  });
  const prompter = opts.prompter;
  const authProviders = listProvidersWithAuthMethods(providers);
  if (authProviders.length === 0)
    throw new Error(
      `No provider plugins found. Install one via \`${formatCliCommand("openclaw plugins install")}\`.`,
    );
  const selectedProvider =
    resolveRequestedLoginProviderOrThrow(
      authProviders,
      opts.provider ? normalizeManualAuthProvider(opts.provider) : void 0,
    ) ??
    (await prompter
      .select({
        message: "Select a provider",
        options: authProviders.map((provider) => ({
          value: provider.id,
          label: provider.label,
          hint: provider.docsPath ? `Docs: ${provider.docsPath}` : void 0,
        })),
      })
      .then((id) => resolveProviderMatch(authProviders, id)));
  if (!selectedProvider)
    throw new Error(
      `Unknown provider. Run ${formatCliCommand("openclaw models status")} or ${formatCliCommand("openclaw plugins list")} to see available provider plugins.`,
    );
  const chosenMethod = await pickProviderAuthMethod({
    provider: selectedProvider,
    requestedMethod: opts.method,
    prompter,
  });
  if (!chosenMethod)
    throw new Error(
      `Unknown auth method. Run ${formatCliCommand("openclaw models auth login --provider " + selectedProvider.id)} without --method to choose interactively.`,
    );
  if (opts.force)
    try {
      if (
        !(await removeProviderAuthProfilesWithLock({
          provider: selectedProvider.id,
          agentDir,
        }))
      )
        throw new Error("profile store update failed");
      opts.runtime.log(
        `Removed cached auth profiles for provider "${selectedProvider.id}" (--force). Running fresh auth flow.`,
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(
        `Could not clear cached profiles for "${selectedProvider.id}" before re-login: ${message}. Re-login was not started because --force must remove cached profiles first.`,
        { cause: err },
      );
    }
  const { result, profiles } = await runProviderAuthMethod({
    config,
    agentDir,
    workspaceDir,
    provider: selectedProvider,
    method: chosenMethod,
    runtime: opts.runtime,
    prompter,
    profileId: opts.profileId,
    setDefault: opts.setDefault,
    env: opts.env,
    isRemote: opts.isRemote,
    openUrl: opts.openUrl,
  });
  maybeLogOpenAICodexNativeSearchTip(opts.runtime, selectedProvider.id);
  return {
    providerId: selectedProvider.id,
    methodId: chosenMethod.id,
    ...(result.defaultModel ? { defaultModel: result.defaultModel } : {}),
    profiles: profiles.map((profile) => ({
      profileId: profile.profileId,
      provider: profile.credential.provider,
      mode: credentialMode(profile.credential),
    })),
  };
}
async function modelsAuthLoginCommand(opts, runtime) {
  if (!process.stdin.isTTY)
    throw new Error(
      `models auth login requires an interactive TTY. In automation, use ${formatCliCommand("openclaw models auth paste-token --provider <provider>")} when token auth is available.`,
    );
  await runModelsAuthLoginFlow({
    ...opts,
    runtime,
    prompter: createClackPrompter(),
  });
}
//#endregion
export {
  modelsAuthAddCommand,
  modelsAuthLoginCommand,
  modelsAuthPasteApiKeyCommand,
  modelsAuthPasteTokenCommand,
  modelsAuthSetupTokenCommand,
  resolveLoginProfiles,
  resolveRequestedLoginProviderOrThrow,
  runModelsAuthLoginFlow,
};
