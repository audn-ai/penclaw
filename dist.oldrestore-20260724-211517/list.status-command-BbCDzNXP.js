import path from "node:path";
import {
  a as resolveAgentDir,
  c as resolveDefaultAgentId,
  o as resolveAgentWorkspaceDir,
} from "./agent-scope-config-DVIR1nBa.js";
import {
  c as resolveAgentExplicitModelPrimary,
  d as resolveAgentModelFallbacksOverride,
} from "./agent-scope-y9xQv_q1.js";
import "./parse-finite-number-Z7n6tXLk.js";
import {
  n as buildAuthHealthSummary,
  r as formatRemainingShort,
  t as DEFAULT_OAUTH_WARN_MS,
} from "./auth-health-DTCl3XuB.js";
import { i as resolveAuthProfileDisplayLabel } from "./auth-profiles-CX7JDmZ9.js";
import {
  a as restoreCurrentPluginMetadataSnapshotState,
  o as setCurrentPluginMetadataSnapshot,
  r as getCurrentPluginMetadataSnapshot,
  t as captureCurrentPluginMetadataSnapshotState,
} from "./current-plugin-metadata-snapshot-DGhQ40qh.js";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-CdX9UGcX.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import { r as createConfigIO } from "./io-B3ne6NxF.js";
import { t as createLazyImportLoader } from "./lazy-promise-EhsWch5m.js";
import { n as isRich } from "./list.format-TWH7EIb7.js";
import { t as loadModelsConfig } from "./load-config--T40e-Wr.js";
import { s as loadManifestMetadataSnapshot } from "./manifest-contract-eligibility-3WxfNDRv.js";
import { t as createModelAuthAvailabilityResolver } from "./model-auth-availability-CHBQPrVn.js";
import {
  g as resolveUsableCustomProviderApiKey,
  s as getCustomProviderApiKey,
} from "./model-auth-BWFdcEzF.js";
import { t as resolveEnvApiKey } from "./model-auth-env-DLe5znyS.js";
import {
  b as resolveProviderEnvAuthLookupMaps,
  d as isNonSecretApiKeyMarker,
  f as isOAuthApiKeyMarker,
  y as listProviderEnvAuthLookupKeys,
} from "./model-auth-markers-CA2Xy59Z.js";
import { r as loadModelCatalogSnapshot } from "./model-catalog-DxYvPELu.js";
import {
  i as resolveAgentModelPrimaryValue,
  r as resolveAgentModelFallbackValues,
} from "./model-input-B7OGjVYg.js";
import { a as resolveCliRuntimeExecutionProvider } from "./model-runtime-aliases-DMpABeI4.js";
import { t as isCliProvider } from "./model-selection-cli-BGoUsby5.js";
import { i as modelKey, o as normalizeProviderId } from "./model-selection-normalize-BoKGJiBx.js";
import "./config-BDv-QbJ6.js";
import {
  f as modelCatalogLogicalKey,
  i as buildModelAliasIndex,
  v as resolveConfiguredModelRef,
  x as resolveModelRefFromString,
} from "./model-selection-shared-BliwFXJy.js";
import {
  _ as parseStrictFiniteNumber,
  b as parseStrictPositiveInteger,
} from "./number-coercion-CJQ8TR--.js";
import { n as requestExitAfterOneShotOutput } from "./one-shot-exit-DdMGi0bf.js";
import {
  A as resolveMergedModelProviderConfig,
  n as OPENAI_PROVIDER_ID,
} from "./openai-routing-Cu28Ynzk.js";
import { i as resolveAuthStorePathForDisplay } from "./path-resolve-8wkj2l4Z.js";
import "./profiles-DxTOoenK.js";
import { o as loadPersistedAuthProfileStore } from "./persisted-B2tK2f7d.js";
import { t as resolveAgentHarnessPolicy } from "./policy-C704eijA.js";
import { n as listProfilesForProvider } from "./profile-list-I4BheGlK.js";
import { r as resolveProviderIdForAuth } from "./provider-auth-aliases-RaEzqkSo.js";
import "./model-selection-DOlkTrQa.js";
import { i as normalizeProviderIdForAuth } from "./provider-id-BIcU_2-A.js";
import { j as resolveProviderSyntheticAuthWithPlugin } from "./provider-runtime-DyIHJ2cX.js";
import { i as writeRuntimeJson } from "./runtime-Bz6o617W.js";
import { t as maskApiKey } from "./secret-mask-CWRecbVB.js";
import { n as ensureFlagCompatibility, s as resolveKnownAgentId } from "./shared-DFGOIlxJ.js";
import "./workspace-DXzCbuC0.js";
import {
  n as getShellEnvAppliedKeys,
  s as shouldEnableShellEnvFallback,
} from "./shell-env-DTBGUs4j.js";
import {
  c as getRuntimeAuthProfileStoreSnapshot,
  i as ensureAuthProfileStore,
  o as ensureAuthProfileStoreWithoutExternalProfiles,
} from "./store-B7DoDdVM.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
} from "./string-coerce-DW4mBlAt.js";
import { r as resolveRuntimeSyntheticAuthProviderRefs } from "./synthetic-auth.runtime.js";
import { r as theme, t as colorize } from "./theme-vjDs9tao.js";
import { o as resolveProfileUnusableUntilForDisplay } from "./usage-BZgGbRoq.js";
import {
  n as resolveUtilityModelRefForAgent,
  t as readUtilityModelSetting,
} from "./utility-model-wOa6LPAB.js";
import { h as shortenHomePath } from "./utils-DtcDeqWS.js";
import { n as resolveDefaultAgentWorkspaceDir } from "./workspace-default-h9TzWSvp.js";
//#region src/commands/models/list.auth-overview.ts
/** Builds provider auth summaries for model-list/status output. */
function formatMarkerOrSecret(value) {
  return isNonSecretApiKeyMarker(value, { includeEnvVarName: false })
    ? `marker(${value.trim()})`
    : maskApiKey(value);
}
function formatProfileSecretLabel(params) {
  const value = normalizeOptionalString(params.value) ?? "";
  if (value) {
    const display = formatMarkerOrSecret(value);
    return params.kind === "token" ? `token:${display}` : display;
  }
  if (params.ref) {
    const refLabel = `ref(${params.ref.source}:${params.ref.id})`;
    return params.kind === "token" ? `token:${refLabel}` : refLabel;
  }
  return params.kind === "token" ? "token:missing" : "missing";
}
function resolveProfileSourceAgentDir(params) {
  if (!params.agentDir || params.profileIds.length === 0) return params.agentDir;
  const localStore = loadPersistedAuthProfileStore(params.agentDir);
  if (params.profileIds.some((profileId) => Boolean(localStore?.profiles[profileId])))
    return params.agentDir;
  const mainStore = loadPersistedAuthProfileStore(void 0);
  return params.profileIds.every((profileId) => Boolean(mainStore?.profiles[profileId]))
    ? void 0
    : params.agentDir;
}
/** Resolves the effective auth source and profile counts for a provider. */
function resolveProviderAuthOverview(params) {
  const { provider, cfg, store } = params;
  const now = Date.now();
  const profiles = listProfilesForProvider(store, provider);
  const withUnusableSuffix = (base, profileId) => {
    const unusableUntil = resolveProfileUnusableUntilForDisplay(store, profileId);
    if (!unusableUntil || now >= unusableUntil) return base;
    const stats = store.usageStats?.[profileId];
    return `${base} [${typeof stats?.disabledUntil === "number" && now < stats.disabledUntil ? `disabled${stats.disabledReason ? `:${stats.disabledReason}` : ""}` : "cooldown"} ${formatRemainingShort(unusableUntil - now)}]`;
  };
  const labels = profiles.map((profileId) => {
    const profile = store.profiles[profileId];
    if (!profile) return `${profileId}=missing`;
    if (profile.type === "api_key")
      return withUnusableSuffix(
        `${profileId}=${formatProfileSecretLabel({
          value: profile.key,
          ref: profile.keyRef,
          kind: "api-key",
        })}`,
        profileId,
      );
    if (profile.type === "token")
      return withUnusableSuffix(
        `${profileId}=${formatProfileSecretLabel({
          value: profile.token,
          ref: profile.tokenRef,
          kind: "token",
        })}`,
        profileId,
      );
    const display = resolveAuthProfileDisplayLabel({
      cfg,
      store,
      profileId,
    });
    const suffix =
      display === profileId
        ? ""
        : display.startsWith(profileId)
          ? display.slice(profileId.length).trim()
          : `(${display})`;
    const base = `${profileId}=OAuth${suffix ? ` ${suffix}` : ""}`;
    return withUnusableSuffix(base, profileId);
  });
  const oauthCount = profiles.filter((id) => store.profiles[id]?.type === "oauth").length;
  const tokenCount = profiles.filter((id) => store.profiles[id]?.type === "token").length;
  const apiKeyCount = profiles.filter((id) => store.profiles[id]?.type === "api_key").length;
  const normalizedProvider = normalizeProviderIdForAuth(provider);
  const authLookupProvider = params.aliasMap?.[normalizedProvider] ?? normalizedProvider;
  const hasPrecomputedCandidates =
    params.envCandidateMap !== void 0 && Object.hasOwn(params.envCandidateMap, authLookupProvider);
  const hasPrecomputedEvidence =
    params.authEvidenceMap !== void 0 && Object.hasOwn(params.authEvidenceMap, authLookupProvider);
  const envKey = resolveEnvApiKey(provider, process.env, {
    config: cfg,
    workspaceDir: params.workspaceDir,
    aliasMap: params.aliasMap,
    candidateMap: params.envCandidateMap,
    authEvidenceMap: params.authEvidenceMap,
    skipSetupProviderFallback: hasPrecomputedCandidates || hasPrecomputedEvidence,
  });
  const customKey = getCustomProviderApiKey(cfg, provider);
  const usableCustomKey = resolveUsableCustomProviderApiKey({
    cfg,
    provider,
  });
  return {
    provider,
    effective: (() => {
      if (profiles.length > 0)
        return {
          kind: "profiles",
          detail: shortenHomePath(
            resolveAuthStorePathForDisplay(
              resolveProfileSourceAgentDir({
                agentDir: params.agentDir,
                profileIds: profiles,
              }),
            ),
          ),
        };
      if (envKey) {
        const normalizedSource = normalizeLowercaseStringOrEmpty(envKey.source);
        return {
          kind: "env",
          detail:
            envKey.source.includes("OAUTH_TOKEN") || normalizedSource.includes("oauth")
              ? "OAuth (env)"
              : maskApiKey(envKey.apiKey),
        };
      }
      if (usableCustomKey)
        return {
          kind: "models.json",
          detail: formatMarkerOrSecret(usableCustomKey.apiKey),
        };
      if (params.syntheticAuth)
        return {
          kind: "synthetic",
          detail: params.syntheticAuth.source,
        };
      if (customKey && isOAuthApiKeyMarker(customKey))
        return {
          kind: "models.json",
          detail: formatMarkerOrSecret(customKey),
        };
      return {
        kind: "missing",
        detail: "missing",
      };
    })(),
    profiles: {
      count: profiles.length,
      oauth: oauthCount,
      token: tokenCount,
      apiKey: apiKeyCount,
      labels,
    },
    ...(envKey
      ? {
          env: {
            value: (() => {
              const normalizedSource = normalizeLowercaseStringOrEmpty(envKey.source);
              return envKey.source.includes("OAUTH_TOKEN") || normalizedSource.includes("oauth")
                ? "OAuth (env)"
                : maskApiKey(envKey.apiKey);
            })(),
            source: envKey.source,
          },
        }
      : {}),
    ...(customKey
      ? {
          modelsJson: {
            value: formatMarkerOrSecret(customKey),
            source: `models.json: ${shortenHomePath(params.modelsPath)}`,
          },
        }
      : {}),
    ...(params.syntheticAuth
      ? {
          syntheticAuth: {
            value: params.syntheticAuth.value,
            source: params.syntheticAuth.source,
          },
        }
      : {}),
  };
}
//#endregion
//#region src/commands/models/list.status-command.ts
/** Implementation of `openclaw models status`. */
function resolveEnvAgentDirOverride(env = process.env) {
  const override = env.OPENCLAW_AGENT_DIR?.trim() || env.PI_CODING_AGENT_DIR?.trim();
  return override ? resolveUserPath(override, env) : void 0;
}
const providerUsageRuntimeLoader = createLazyImportLoader(
  () => import("./provider-usage-DCyZjr8M.js"),
);
const progressRuntimeLoader = createLazyImportLoader(() => import("./progress-_D0rc7TD.js"));
const terminalTableRuntimeLoader = createLazyImportLoader(() => import("./terminal-core/table.js"));
const listProbeRuntimeLoader = createLazyImportLoader(() => import("./list.probe-DutFY977.js"));
const DISPLAY_MODEL_PARSE_OPTIONS = { allowPluginNormalization: false };
function loadProviderUsageRuntime() {
  return providerUsageRuntimeLoader.load();
}
function loadProgressRuntime() {
  return progressRuntimeLoader.load();
}
function loadTerminalTableRuntime() {
  return terminalTableRuntimeLoader.load();
}
function loadListProbeRuntime() {
  return listProbeRuntimeLoader.load();
}
function parseOptionalPositiveFiniteOption(raw, label, fallback) {
  if (raw === void 0 || raw === null || raw === "") return fallback;
  const parsed = parseStrictFiniteNumber(raw);
  if (parsed === void 0 || parsed <= 0) throw new Error(`${label} must be a positive number.`);
  return parsed;
}
function parseOptionalPositiveIntegerOption(raw, label, fallback) {
  if (raw === void 0 || raw === null || raw === "") return fallback;
  const parsed = parseStrictPositiveInteger(raw);
  if (parsed === void 0) throw new Error(`${label} must be a positive integer.`);
  return parsed;
}
function isCompletePluginMetadataSnapshot(value) {
  if (!value || typeof value !== "object") return false;
  const snapshot = value;
  return (
    typeof snapshot.policyHash === "string" &&
    snapshot.index !== void 0 &&
    snapshot.manifestRegistry !== void 0
  );
}
function installCommandPluginMetadataSnapshot(params) {
  if (!isCompletePluginMetadataSnapshot(params.snapshot)) return () => {};
  if (
    getCurrentPluginMetadataSnapshot({
      config: params.config,
      workspaceDir: params.workspaceDir,
      env: params.env,
    })
  )
    return () => {};
  const previousState = captureCurrentPluginMetadataSnapshotState();
  setCurrentPluginMetadataSnapshot(params.snapshot, {
    config: params.config,
    workspaceDir: params.workspaceDir,
    env: params.env,
  });
  return () => {
    restoreCurrentPluginMetadataSnapshotState(previousState);
  };
}
function syntheticAuthCredential(provider, auth) {
  if (!auth.mode) return;
  if (auth.mode === "api-key")
    return {
      type: "api_key",
      provider,
      key: auth.credential,
    };
  if (auth.mode === "token" || auth.mode === "oauth")
    return {
      type: "token",
      provider,
      token: auth.credential,
      expires: auth.expiresAt,
    };
}
function finishModelsStatusOutput(runtime, check, checkStatus) {
  if (check) {
    if (!requestExitAfterOneShotOutput(runtime, checkStatus)) runtime.exit(checkStatus);
    return;
  }
  requestExitAfterOneShotOutput(runtime);
}
/** Prints model default, auth, provider, and optional probe status. */
async function modelsStatusCommand(opts, runtime) {
  ensureFlagCompatibility(opts);
  if (opts.plain && opts.probe) throw new Error("--probe cannot be used with --plain output.");
  const configPath = createConfigIO().configPath;
  const cfg = await loadModelsConfig({
    commandName: "models status",
    runtime,
  });
  const agentId = resolveKnownAgentId({
    cfg,
    rawAgentId: opts.agent,
  });
  const workspaceAgentId = agentId ?? resolveDefaultAgentId(cfg);
  const agentDir = agentId
    ? resolveAgentDir(cfg, agentId)
    : (resolveEnvAgentDirOverride() ?? resolveAgentDir(cfg, workspaceAgentId));
  const workspaceDir =
    resolveAgentWorkspaceDir(cfg, workspaceAgentId) ?? resolveDefaultAgentWorkspaceDir();
  const agentModelPrimary = agentId ? resolveAgentExplicitModelPrimary(cfg, agentId) : void 0;
  const agentFallbacksOverride = agentId
    ? resolveAgentModelFallbacksOverride(cfg, agentId)
    : void 0;
  const resolvedConfig =
    agentModelPrimary && agentModelPrimary.length > 0
      ? {
          ...cfg,
          agents: {
            ...cfg.agents,
            defaults: {
              ...cfg.agents?.defaults,
              model: {
                ...(typeof cfg.agents?.defaults?.model === "object"
                  ? cfg.agents.defaults.model
                  : {}),
                primary: agentModelPrimary,
              },
            },
          },
        }
      : cfg;
  const metadataSnapshot = loadManifestMetadataSnapshot({
    config: cfg,
    workspaceDir,
    env: process.env,
  });
  const cleanupPluginMetadataSnapshot = installCommandPluginMetadataSnapshot({
    snapshot: metadataSnapshot,
    config: cfg,
    workspaceDir,
    env: process.env,
  });
  try {
    const resolved = resolveConfiguredModelRef({
      cfg: resolvedConfig,
      defaultProvider: DEFAULT_PROVIDER,
      defaultModel: DEFAULT_MODEL,
      ...DISPLAY_MODEL_PARSE_OPTIONS,
    });
    const rawDefaultsModel = resolveAgentModelPrimaryValue(cfg.agents?.defaults?.model) ?? "";
    const rawModel = agentModelPrimary ?? rawDefaultsModel;
    const resolvedLabel = modelKey(resolved.provider, resolved.model);
    const defaultLabel = rawModel || resolvedLabel;
    const defaultsFallbacks = resolveAgentModelFallbackValues(cfg.agents?.defaults?.model);
    const fallbacks = agentFallbacksOverride ?? defaultsFallbacks;
    const imageModel = resolveAgentModelPrimaryValue(cfg.agents?.defaults?.imageModel) ?? "";
    const imageFallbacks = resolveAgentModelFallbackValues(cfg.agents?.defaults?.imageModel);
    const utilitySetting = readUtilityModelSetting(cfg, workspaceAgentId);
    const utilityModelRef = resolveUtilityModelRefForAgent({
      cfg,
      agentId: workspaceAgentId,
    });
    const utilityModelSource =
      utilitySetting.kind === "explicit"
        ? "config"
        : utilitySetting.kind === "disabled"
          ? "disabled"
          : utilityModelRef
            ? "provider-default"
            : "none";
    const aliases = Object.entries(cfg.agents?.defaults?.models ?? {}).reduce(
      (acc, [key, entry]) => {
        const alias = normalizeOptionalString(entry?.alias);
        if (alias) acc[alias] = key;
        return acc;
      },
      {},
    );
    const allowed = Object.keys(cfg.agents?.defaults?.models ?? {});
    const modelsPath = path.join(agentDir, "models.json");
    const aliasIndex = buildModelAliasIndex({
      cfg,
      defaultProvider: DEFAULT_PROVIDER,
      ...DISPLAY_MODEL_PARSE_OPTIONS,
    });
    const resolveStatusModelRef = (raw) => {
      const modelRef = raw?.trim();
      if (!modelRef) return;
      return resolveModelRefFromString({
        cfg,
        raw: modelRef,
        defaultProvider: DEFAULT_PROVIDER,
        aliasIndex,
        ...DISPLAY_MODEL_PARSE_OPTIONS,
      })?.ref;
    };
    const store = [defaultLabel, ...fallbacks].some(
      (raw) => normalizeProviderId(resolveStatusModelRef(raw)?.provider ?? "") === "openai",
    )
      ? ensureAuthProfileStore(agentDir, {
          allowKeychainPrompt: false,
          config: cfg,
          externalCliProviderIds: [OPENAI_PROVIDER_ID],
          readOnly: true,
        })
      : ensureAuthProfileStoreWithoutExternalProfiles(agentDir);
    const providersFromStore = new Set(
      Object.values(store.profiles)
        .map((profile) => normalizeProviderId(profile.provider))
        .filter((p) => Boolean(p)),
    );
    const providersFromConfig = new Set(
      Object.keys(cfg.models?.providers ?? {})
        .map((p) => (typeof p === "string" ? normalizeProviderId(p) : ""))
        .filter(Boolean),
    );
    const providersFromModels = /* @__PURE__ */ new Set();
    const providerUseRefs = [];
    const addProviderUse = (raw, allowCodexRuntimeFallback, routeScope) => {
      const ref = resolveStatusModelRef(raw);
      if (ref?.provider) {
        const provider = normalizeProviderId(ref.provider);
        providerUseRefs.push({
          provider,
          model: ref.model,
          allowCodexRuntimeFallback,
          routeScope,
        });
      }
    };
    for (const raw of [
      defaultLabel,
      ...fallbacks,
      imageModel,
      ...imageFallbacks,
      utilityModelRef ?? "",
      ...allowed,
    ]) {
      const ref = resolveStatusModelRef(raw);
      if (ref?.provider) providersFromModels.add(normalizeProviderId(ref.provider));
    }
    for (const raw of [defaultLabel, ...fallbacks]) addProviderUse(raw, true, "text");
    for (const raw of [imageModel, ...imageFallbacks]) addProviderUse(raw, false, "image");
    addProviderUse(utilityModelRef, false, "text");
    const resolvedUtilityRef = utilityModelRef ? resolveStatusModelRef(utilityModelRef) : void 0;
    const utilityModelDisplayRef = resolvedUtilityRef
      ? modelKey(normalizeProviderId(resolvedUtilityRef.provider), resolvedUtilityRef.model)
      : (utilityModelRef ?? null);
    const providersFromEnv = /* @__PURE__ */ new Set();
    const envLookupParams = {
      config: cfg,
      workspaceDir,
      env: process.env,
      metadataSnapshot,
    };
    const { aliasMap, envCandidateMap, authEvidenceMap } =
      resolveProviderEnvAuthLookupMaps(envLookupParams);
    for (const provider of listProviderEnvAuthLookupKeys({
      envCandidateMap,
      authEvidenceMap,
    }))
      if (
        resolveEnvApiKey(provider, process.env, {
          config: cfg,
          workspaceDir,
          aliasMap,
          candidateMap: envCandidateMap,
          authEvidenceMap,
          skipSetupProviderFallback: true,
        })
      )
        providersFromEnv.add(provider);
    const syntheticAuthProviderRefs = new Set(
      resolveRuntimeSyntheticAuthProviderRefs({
        index: metadataSnapshot.index,
        registryDiagnostics: metadataSnapshot.registryDiagnostics,
      }).map((provider) => normalizeProviderId(provider)),
    );
    const catalog = await loadModelCatalogSnapshot({
      config: cfg,
      readOnly: true,
      metadataSnapshot,
    });
    const routeSourcesByModel = /* @__PURE__ */ new Map();
    for (const entry of catalog.routeVariants) {
      if (entry.api === void 0 && entry.baseUrl === void 0) continue;
      const key = modelCatalogLogicalKey(entry);
      const sources = routeSourcesByModel.get(key) ?? [];
      sources.push({
        api: entry.api,
        baseUrl: entry.baseUrl,
      });
      routeSourcesByModel.set(key, sources);
    }
    const createStatusAuthResolver = (authStore) =>
      createModelAuthAvailabilityResolver({
        cfg,
        authStore,
        agentDir,
        workspaceDir,
        env: process.env,
        syntheticAuthProviderRefs: [...syntheticAuthProviderRefs].filter(
          (provider) => provider !== "codex",
        ),
        metadataSnapshot,
      });
    let authResolver = createStatusAuthResolver(store);
    const resolveProviderUses = (resolver) =>
      providerUseRefs.map((usage) => {
        const observedRoutes = routeSourcesByModel.get(
          modelCatalogLogicalKey({
            provider: usage.provider,
            id: usage.model,
          }),
        );
        const ref = {
          modelId: usage.model,
          ...(observedRoutes ? { observedRoutes } : {}),
        };
        const rawEvaluation =
          usage.routeScope === "text"
            ? resolver.evaluateModelAuth(usage.provider, ref)
            : {
                availability: resolver.resolveProviderAuthAvailability(usage.provider, ref),
                routeResolution: null,
              };
        const routeAuth = (() => {
          if (rawEvaluation.routeResolution?.kind === "incompatible")
            return {
              kind: "incompatible",
              code: rawEvaluation.routeResolution.code,
              message: rawEvaluation.routeResolution.message,
              evaluation: rawEvaluation,
              usesCodexRuntimeAuth: false,
            };
          const usesCodexRuntimeAuth =
            usage.allowCodexRuntimeFallback &&
            resolveAgentHarnessPolicy({
              provider: usage.provider,
              modelId: usage.model,
              ...(rawEvaluation.selectedRoute
                ? {
                    modelApi: rawEvaluation.selectedRoute.api,
                    modelBaseUrl: rawEvaluation.selectedRoute.baseUrl,
                  }
                : {}),
              config: cfg,
              agentId: workspaceAgentId,
            }).runtime === "codex";
          if (usesCodexRuntimeAuth && usage.provider !== "openai" && usage.provider !== "codex")
            return {
              kind: "incompatible",
              code: "unsupported-codex-runtime-provider",
              message: `The Codex runtime does not support provider ${usage.provider}.`,
              evaluation: rawEvaluation,
              usesCodexRuntimeAuth: false,
            };
          const evaluation = rawEvaluation;
          if (evaluation.selectedRoute)
            return {
              kind: "route",
              route: evaluation.selectedRoute,
              evaluation,
              usesCodexRuntimeAuth,
            };
          if (
            evaluation.routeResolution?.kind === "routes" ||
            evaluation.routeResolution?.kind === "indeterminate"
          )
            return {
              kind: "indeterminate",
              evaluation,
              usesCodexRuntimeAuth,
            };
          return {
            kind: "legacy",
            evaluation,
            usesCodexRuntimeAuth,
          };
        })();
        return {
          provider: usage.provider,
          model: usage.model,
          allowCodexRuntimeFallback: usage.allowCodexRuntimeFallback,
          routeAuth,
        };
      });
    let providerUses = resolveProviderUses(authResolver);
    const syntheticAuthByProvider = /* @__PURE__ */ new Map();
    const runtimeSyntheticAuthByProvider = /* @__PURE__ */ new Map();
    const cliRuntimeAuthUsages = providerUses
      .filter((usage) => usage.allowCodexRuntimeFallback && !usage.routeAuth.usesCodexRuntimeAuth)
      .map((usage) => {
        const runtimeProvider = resolveCliRuntimeExecutionProvider({
          provider: usage.provider,
          modelId: usage.model,
          cfg,
          agentId: workspaceAgentId,
        });
        const normalizedRuntime = runtimeProvider ? normalizeProviderId(runtimeProvider) : void 0;
        return normalizedRuntime && normalizedRuntime !== usage.provider
          ? {
              provider: usage.provider,
              model: usage.model,
              allowCodexRuntimeFallback: usage.allowCodexRuntimeFallback,
              runtime: normalizedRuntime,
            }
          : void 0;
      })
      .filter((usage) => Boolean(usage));
    const providers = Array.from(
      /* @__PURE__ */ new Set([
        ...providersFromStore,
        ...providersFromConfig,
        ...providersFromModels,
        ...providersFromEnv,
        ...cliRuntimeAuthUsages.map((usage) => usage.runtime),
      ]),
    )
      .map((p) => normalizeOptionalString(p) ?? "")
      .filter(Boolean)
      .toSorted((a, b) => a.localeCompare(b));
    const syntheticProvidersToProbe = new Set(
      providers.map((provider) => normalizeProviderId(provider)),
    );
    const codexProvider = normalizeProviderId(OPENAI_PROVIDER_ID);
    const codexProviderAlias = aliasMap[codexProvider] ?? codexProvider;
    let codexRuntimeAuthUsages = providerUses.filter(
      (usage) => usage.routeAuth.usesCodexRuntimeAuth,
    );
    if (codexRuntimeAuthUsages.length > 0) {
      syntheticProvidersToProbe.add(codexProvider);
      syntheticProvidersToProbe.add(codexProviderAlias);
      syntheticProvidersToProbe.add("codex");
    }
    for (const provider of syntheticProvidersToProbe) {
      const normalized = normalizeProviderId(provider);
      if (!syntheticAuthProviderRefs.has(normalized)) continue;
      const resolvedLocal = resolveProviderSyntheticAuthWithPlugin({
        provider: normalized,
        config: cfg,
        context: {
          config: cfg,
          provider: normalized,
          providerConfig: resolveMergedModelProviderConfig(cfg, normalized),
        },
      });
      if (!resolvedLocal) continue;
      const syntheticAuth = {
        value: "plugin-owned",
        source: resolvedLocal.source,
        credential: resolvedLocal.apiKey,
        mode: resolvedLocal.mode,
        expiresAt: resolvedLocal.expiresAt,
      };
      syntheticAuthByProvider.set(normalized, syntheticAuth);
      if (normalized !== "codex") runtimeSyntheticAuthByProvider.set(normalized, syntheticAuth);
      if (normalized !== "codex" && normalized === codexProviderAlias)
        syntheticAuthByProvider.set(codexProvider, syntheticAuth);
    }
    const runtimeCredentialsByProvider = new Map(
      Array.from(runtimeSyntheticAuthByProvider.entries())
        .map(([provider, auth]) => [provider, syntheticAuthCredential(provider, auth)])
        .filter((entry) => Boolean(entry[1])),
    );
    if (runtimeCredentialsByProvider.size > 0) {
      const syntheticProfiles = Object.fromEntries(
        Array.from(runtimeCredentialsByProvider.entries()).map(([provider, credential]) => [
          `${provider}:runtime-synthetic`,
          credential,
        ]),
      );
      authResolver = createStatusAuthResolver({
        ...store,
        profiles: {
          ...store.profiles,
          ...syntheticProfiles,
        },
      });
      providerUses = resolveProviderUses(authResolver);
      codexRuntimeAuthUsages = providerUses.filter((usage) => usage.routeAuth.usesCodexRuntimeAuth);
    }
    const applied = getShellEnvAppliedKeys();
    const shellFallbackEnabled =
      shouldEnableShellEnvFallback(process.env) || cfg.env?.shellEnv?.enabled === true;
    const providerAuth = Array.from(
      /* @__PURE__ */ new Set([
        ...providers,
        ...(codexRuntimeAuthUsages.length > 0 && syntheticAuthByProvider.has(codexProvider)
          ? [codexProvider]
          : []),
      ]),
    )
      .toSorted((a, b) => a.localeCompare(b))
      .map((provider) =>
        resolveProviderAuthOverview({
          provider,
          cfg,
          store,
          modelsPath,
          agentDir,
          workspaceDir,
          syntheticAuth: syntheticAuthByProvider.get(provider),
          aliasMap,
          envCandidateMap,
          authEvidenceMap,
        }),
      )
      .filter((entry) => {
        return (
          entry.profiles.count > 0 ||
          Boolean(entry.env) ||
          Boolean(entry.modelsJson) ||
          Boolean(entry.syntheticAuth)
        );
      });
    const providerAuthMap = new Map(providerAuth.map((entry) => [entry.provider, entry]));
    const missingProviderAuthEffective = {
      kind: "missing",
      detail: "missing",
    };
    const runtimeAuthStore = getRuntimeAuthProfileStoreSnapshot(agentDir);
    const authHealth = buildAuthHealthSummary({
      store: runtimeAuthStore
        ? {
            ...store,
            profiles: {
              ...store.profiles,
              ...runtimeAuthStore.profiles,
            },
          }
        : store,
      cfg,
      warnAfterMs: DEFAULT_OAUTH_WARN_MS,
      runtimeCredentialsByProvider,
      allowKeychainPrompt: false,
    });
    const authProfileHealthById = new Map(
      authHealth.profiles.map((profile) => [profile.profileId, profile]),
    );
    const resolveProviderAuthHealthId = (provider) =>
      resolveProviderIdForAuth(provider, envLookupParams);
    const resolveRuntimeAuthRouteEffective = (provider, evaluation) => {
      if (!evaluation)
        return providerAuthMap.get(provider)?.effective ?? missingProviderAuthEffective;
      if (evaluation?.availability === false) return missingProviderAuthEffective;
      const candidates = Array.from(
        /* @__PURE__ */ new Set([
          normalizeProviderId(provider),
          resolveProviderAuthHealthId(provider),
        ]),
      );
      const profileId = evaluation.selectedProfileId;
      if (profileId) {
        const credentialProvider = store.profiles[profileId]?.provider ?? provider;
        const source = providerAuthMap.get(
          resolveProviderAuthHealthId(credentialProvider),
        )?.effective;
        return source && source.kind !== "missing"
          ? source
          : {
              kind: "profiles",
              detail: profileId,
            };
      }
      for (const candidate of candidates) {
        const auth = providerAuthMap.get(candidate);
        if (evaluation.evidence === "environment" && auth?.env)
          return {
            kind: "env",
            detail: auth.env.value,
          };
        if (
          (evaluation.evidence === "provider-config" || evaluation.evidence === "runtime") &&
          auth?.modelsJson
        )
          return {
            kind: "models.json",
            detail: auth.modelsJson.value,
          };
        if (evaluation.evidence === "synthetic" && syntheticAuthByProvider.has(candidate))
          return {
            kind: "synthetic",
            detail: syntheticAuthByProvider.get(candidate)?.source ?? "plugin-owned",
          };
      }
      return providerAuthMap.get(provider)?.effective ?? missingProviderAuthEffective;
    };
    const resolveCliRuntimeAuthProvider = (usage) =>
      cliRuntimeAuthUsages.find(
        (candidate) =>
          candidate.provider === usage.provider &&
          candidate.model === usage.model &&
          candidate.allowCodexRuntimeFallback === usage.allowCodexRuntimeFallback,
      )?.runtime;
    const hasUsableAuthForProviderInUse = (usage) => {
      const cliRuntimeAuthProvider = resolveCliRuntimeAuthProvider(usage);
      if (cliRuntimeAuthProvider)
        return authResolver.resolveProviderAuthAvailability(cliRuntimeAuthProvider) !== false;
      if (usage.routeAuth.kind === "incompatible") return true;
      return usage.routeAuth.evaluation.availability !== false;
    };
    const codexRuntimeUsagesByProvider = /* @__PURE__ */ new Map();
    for (const usage of codexRuntimeAuthUsages) {
      const usages = codexRuntimeUsagesByProvider.get(usage.provider) ?? [];
      usages.push(usage);
      codexRuntimeUsagesByProvider.set(usage.provider, usages);
    }
    const runtimeAuthRoutes = Array.from(
      new Map([
        ...Array.from(codexRuntimeUsagesByProvider.entries()).map(([provider, usages]) => {
          const representative =
            usages.find((usage) => usage.routeAuth.evaluation.availability === true) ?? usages[0];
          const effective = resolveRuntimeAuthRouteEffective(
            codexProvider,
            representative?.routeAuth.evaluation,
          );
          const availabilities = usages.map((usage) => usage.routeAuth.evaluation.availability);
          return [
            `${provider}:codex:${codexProvider}`,
            {
              provider,
              runtime: "codex",
              authProvider: codexProvider,
              status: availabilities.every((availability) => availability === true)
                ? "usable"
                : availabilities.some((availability) => availability === false)
                  ? "missing"
                  : "indeterminate",
              effective,
            },
          ];
        }),
        ...cliRuntimeAuthUsages.map((usage) => {
          const evaluation = authResolver.evaluateModelAuth(usage.runtime);
          const effective = resolveRuntimeAuthRouteEffective(usage.runtime, evaluation);
          return [
            `${usage.provider}:${usage.runtime}:${usage.runtime}`,
            {
              provider: usage.provider,
              runtime: usage.runtime,
              authProvider: usage.runtime,
              status:
                evaluation.availability === true
                  ? "usable"
                  : evaluation.availability === false
                    ? "missing"
                    : "indeterminate",
              effective,
            },
          ];
        }),
      ]).values(),
    ).toSorted((a, b) => a.provider.localeCompare(b.provider));
    const modelRouteIssues = providerUses.flatMap((usage) => {
      const cliRuntimeAuthProvider = resolveCliRuntimeAuthProvider(usage);
      const evaluation = cliRuntimeAuthProvider
        ? authResolver.evaluateModelAuth(cliRuntimeAuthProvider)
        : usage.routeAuth.evaluation;
      if (usage.routeAuth.kind === "incompatible")
        return [
          {
            kind: "incompatible",
            provider: usage.provider,
            model: usage.model,
            code: usage.routeAuth.code,
            message: usage.routeAuth.message,
          },
        ];
      if (evaluation.availability === void 0)
        return [
          {
            kind: "indeterminate",
            provider: usage.provider,
            model: usage.model,
            ...(evaluation.evidence ? { evidence: evaluation.evidence } : {}),
            message: `Auth readiness could not be confirmed for ${usage.provider}/${usage.model}.`,
          },
        ];
      if (usage.routeAuth.kind !== "route" || evaluation.availability) return [];
      const authRequirement = usage.routeAuth.route.authRequirement;
      return [
        {
          kind: "missing-auth",
          provider: usage.provider,
          model: usage.model,
          authRequirement,
          message: `No usable ${authRequirement} authentication is available for ${usage.provider}/${usage.model}.`,
        },
      ];
    });
    const seenRouteIssues = /* @__PURE__ */ new Set();
    const dedupedModelRouteIssues = modelRouteIssues.filter((issue) => {
      const key = JSON.stringify(issue);
      if (seenRouteIssues.has(key)) return false;
      seenRouteIssues.add(key);
      return true;
    });
    const missingProvidersInUse = Array.from(
      new Set(
        providerUses
          .filter((usage) => !hasUsableAuthForProviderInUse(usage))
          .map((usage) => resolveCliRuntimeAuthProvider(usage) ?? usage.provider),
      ),
    )
      .filter(
        (provider) =>
          !isCliProvider(provider, cfg) ||
          cliRuntimeAuthUsages.some((usage) => usage.runtime === provider),
      )
      .toSorted((a, b) => a.localeCompare(b));
    const probeProfileIds = (() => {
      if (!opts.probeProfile) return [];
      return (Array.isArray(opts.probeProfile) ? opts.probeProfile : [opts.probeProfile])
        .flatMap((value) => (value ?? "").split(","))
        .map((value) => value.trim())
        .filter(Boolean);
    })();
    const probeTimeoutMs = parseOptionalPositiveFiniteOption(
      opts.probeTimeout,
      "--probe-timeout",
      8e3,
    );
    const probeConcurrency = parseOptionalPositiveIntegerOption(
      opts.probeConcurrency,
      "--probe-concurrency",
      2,
    );
    const probeMaxTokens = parseOptionalPositiveIntegerOption(
      opts.probeMaxTokens,
      "--probe-max-tokens",
      8,
    );
    const modelCandidates = [
      rawModel || resolvedLabel,
      ...fallbacks,
      imageModel,
      ...imageFallbacks,
      utilityModelRef ?? "",
      ...allowed,
    ]
      .filter(Boolean)
      .map(
        (raw) =>
          resolveModelRefFromString({
            raw: raw ?? "",
            defaultProvider: DEFAULT_PROVIDER,
            aliasIndex,
            ...DISPLAY_MODEL_PARSE_OPTIONS,
          })?.ref,
      )
      .filter((ref) => Boolean(ref))
      .map((ref) => `${ref.provider}/${ref.model}`);
    let probeSummary;
    if (opts.probe) {
      const [{ withProgressTotals }, { runAuthProbes }] = await Promise.all([
        loadProgressRuntime(),
        loadListProbeRuntime(),
      ]);
      probeSummary = await withProgressTotals(
        {
          label: "Probing auth profiles…",
          total: 1,
        },
        async (update) => {
          return await runAuthProbes({
            cfg,
            agentId: workspaceAgentId,
            agentDir,
            workspaceDir,
            providers,
            modelCandidates,
            options: {
              provider: opts.probeProvider,
              profileIds: probeProfileIds,
              timeoutMs: probeTimeoutMs,
              concurrency: probeConcurrency,
              maxTokens: probeMaxTokens,
            },
            onProgress: update,
          });
        },
      );
    }
    const providersWithOauth = providerAuth
      .filter(
        (entry) =>
          entry.profiles.oauth > 0 ||
          entry.profiles.token > 0 ||
          entry.env?.value === "OAuth (env)",
      )
      .map((entry) => {
        const count =
          entry.profiles.oauth +
          entry.profiles.token +
          (entry.env?.value === "OAuth (env)" ? 1 : 0);
        return `${entry.provider} (${count})`;
      });
    const oauthProfiles = authHealth.profiles.filter(
      (profile) => profile.type === "oauth" || profile.type === "token",
    );
    const unusableProfiles = (() => {
      const now = Date.now();
      const out = [];
      for (const profileId of Object.keys(store.usageStats ?? {})) {
        const unusableUntil = resolveProfileUnusableUntilForDisplay(store, profileId);
        if (!unusableUntil || now >= unusableUntil) continue;
        const stats = store.usageStats?.[profileId];
        const kind =
          typeof stats?.disabledUntil === "number" && now < stats.disabledUntil
            ? "disabled"
            : "cooldown";
        out.push({
          profileId,
          provider: store.profiles[profileId]?.provider,
          kind,
          reason: stats?.disabledReason,
          until: unusableUntil,
          remainingMs: unusableUntil - now,
        });
      }
      return out.toSorted((a, b) => a.remainingMs - b.remainingMs);
    })();
    const checkStatus = (() => {
      const resolveRouteAuthHealth = (usage) => {
        if (usage.routeAuth.kind === "incompatible") return "missing";
        const cliRuntimeAuthProvider = resolveCliRuntimeAuthProvider(usage);
        const evaluation = cliRuntimeAuthProvider
          ? authResolver.evaluateModelAuth(cliRuntimeAuthProvider)
          : usage.routeAuth.evaluation;
        if (evaluation.availability === void 0) return "indeterminate";
        if (!evaluation.availability) return "missing";
        const profileId = evaluation.selectedProfileId;
        if (!profileId) return "ok";
        const health = authProfileHealthById.get(profileId);
        if (health?.status === "expiring") return "expiring";
        if (health?.status === "expired" || health?.status === "missing") return "missing";
        return "ok";
      };
      const routeAuthHealth = new Set(providerUses.map(resolveRouteAuthHealth));
      const hasExpiredOrMissing =
        dedupedModelRouteIssues.some(
          (issue) => issue.kind === "incompatible" || issue.kind === "indeterminate",
        ) ||
        routeAuthHealth.has("missing") ||
        routeAuthHealth.has("indeterminate") ||
        missingProvidersInUse.length > 0;
      const hasExpiring = routeAuthHealth.has("expiring");
      if (hasExpiredOrMissing) return 1;
      if (hasExpiring) return 2;
      return 0;
    })();
    if (opts.json) {
      writeRuntimeJson(runtime, {
        configPath,
        ...(agentId ? { agentId } : {}),
        agentDir,
        defaultModel: defaultLabel,
        resolvedDefault: resolvedLabel,
        fallbacks,
        imageModel: imageModel || null,
        imageFallbacks,
        utilityModel: {
          ref: utilityModelDisplayRef,
          source: utilityModelSource,
        },
        ...(agentId
          ? {
              modelConfig: {
                defaultSource: agentModelPrimary ? "agent" : "defaults",
                fallbacksSource: agentFallbacksOverride !== void 0 ? "agent" : "defaults",
              },
            }
          : {}),
        aliases,
        allowed,
        auth: {
          storePath: resolveAuthStorePathForDisplay(agentDir),
          shellEnvFallback: {
            enabled: shellFallbackEnabled,
            appliedKeys: applied,
          },
          providersWithOAuth: providersWithOauth,
          missingProvidersInUse,
          modelRouteIssues: dedupedModelRouteIssues,
          runtimeAuthRoutes,
          providers: providerAuth,
          unusableProfiles,
          oauth: {
            warnAfterMs: authHealth.warnAfterMs,
            profiles: authHealth.profiles,
            providers: authHealth.providers,
          },
          probes: probeSummary,
        },
      });
      finishModelsStatusOutput(runtime, opts.check, checkStatus);
      return;
    }
    if (opts.plain) {
      runtime.log(resolvedLabel);
      finishModelsStatusOutput(runtime, opts.check, checkStatus);
      return;
    }
    const rich = isRich(opts);
    const label = (value) => colorize(rich, theme.accent, value.padEnd(14));
    const labelWithSource = (value, source) => label(source ? `${value} (${source})` : value);
    const displayDefault =
      rawModel && rawModel !== resolvedLabel
        ? `${resolvedLabel} (from ${rawModel})`
        : resolvedLabel;
    runtime.log(
      `${label("Config")}${colorize(rich, theme.muted, ":")} ${colorize(rich, theme.info, shortenHomePath(configPath))}`,
    );
    runtime.log(
      `${label("Agent dir")}${colorize(rich, theme.muted, ":")} ${colorize(rich, theme.info, shortenHomePath(agentDir))}`,
    );
    runtime.log(
      `${labelWithSource("Default", agentId ? (agentModelPrimary ? "agent" : "defaults") : void 0)}${colorize(rich, theme.muted, ":")} ${colorize(rich, theme.success, displayDefault)}`,
    );
    runtime.log(
      `${labelWithSource(`Fallbacks (${fallbacks.length || 0})`, agentId ? (agentFallbacksOverride !== void 0 ? "agent" : "defaults") : void 0)}${colorize(rich, theme.muted, ":")} ${colorize(rich, fallbacks.length ? theme.warn : theme.muted, fallbacks.length ? fallbacks.join(", ") : "-")}`,
    );
    runtime.log(
      `${label("Utility model")}${colorize(rich, theme.muted, ":")} ${colorize(rich, utilityModelDisplayRef ? theme.success : theme.muted, utilityModelDisplayRef ? `${utilityModelDisplayRef}${utilityModelSource === "provider-default" ? " (provider default)" : ""}` : utilityModelSource === "disabled" ? "off" : "-")}`,
    );
    runtime.log(
      `${labelWithSource("Image model", agentId ? "defaults" : void 0)}${colorize(rich, theme.muted, ":")} ${colorize(rich, imageModel ? theme.accentBright : theme.muted, imageModel || "-")}`,
    );
    runtime.log(
      `${labelWithSource(`Image fallbacks (${imageFallbacks.length || 0})`, agentId ? "defaults" : void 0)}${colorize(rich, theme.muted, ":")} ${colorize(rich, imageFallbacks.length ? theme.accentBright : theme.muted, imageFallbacks.length ? imageFallbacks.join(", ") : "-")}`,
    );
    runtime.log(
      `${label(`Aliases (${Object.keys(aliases).length || 0})`)}${colorize(rich, theme.muted, ":")} ${colorize(
        rich,
        Object.keys(aliases).length ? theme.accent : theme.muted,
        Object.keys(aliases).length
          ? Object.entries(aliases)
              .map(([alias, target]) =>
                rich
                  ? `${theme.accentDim(alias)} ${theme.muted("->")} ${theme.info(target)}`
                  : `${alias} -> ${target}`,
              )
              .join(", ")
          : "-",
      )}`,
    );
    runtime.log(
      `${label(`Configured models (${allowed.length || 0})`)}${colorize(rich, theme.muted, ":")} ${colorize(rich, allowed.length ? theme.info : theme.muted, allowed.length ? allowed.join(", ") : "all")}`,
    );
    runtime.log("");
    runtime.log(colorize(rich, theme.heading, "Auth overview"));
    runtime.log(
      `${label("Auth store")}${colorize(rich, theme.muted, ":")} ${colorize(rich, theme.info, shortenHomePath(resolveAuthStorePathForDisplay(agentDir)))}`,
    );
    runtime.log(
      `${label("Shell env")}${colorize(rich, theme.muted, ":")} ${colorize(rich, shellFallbackEnabled ? theme.success : theme.muted, shellFallbackEnabled ? "on" : "off")}${applied.length ? colorize(rich, theme.muted, ` (applied: ${applied.join(", ")})`) : ""}`,
    );
    runtime.log(
      `${label(`Providers w/ OAuth/tokens (${providersWithOauth.length || 0})`)}${colorize(rich, theme.muted, ":")} ${colorize(rich, providersWithOauth.length ? theme.info : theme.muted, providersWithOauth.length ? providersWithOauth.join(", ") : "-")}`,
    );
    const formatKey = (key) => colorize(rich, theme.warn, key);
    const formatKeyValue = (key, value) => `${formatKey(key)}=${colorize(rich, theme.info, value)}`;
    const formatSeparator = () => colorize(rich, theme.muted, " | ");
    for (const entry of providerAuth) {
      const separator = formatSeparator();
      const bits = [];
      bits.push(
        formatKeyValue(
          "effective",
          `${colorize(rich, theme.accentBright, entry.effective.kind)}:${colorize(rich, theme.muted, entry.effective.detail)}`,
        ),
      );
      if (entry.profiles.count > 0) {
        bits.push(
          formatKeyValue(
            "profiles",
            `${entry.profiles.count} (oauth=${entry.profiles.oauth}, token=${entry.profiles.token}, api_key=${entry.profiles.apiKey})`,
          ),
        );
        if (entry.profiles.labels.length > 0)
          bits.push(colorize(rich, theme.info, entry.profiles.labels.join(", ")));
      }
      if (entry.env)
        bits.push(
          formatKeyValue(
            "env",
            `${entry.env.value}${separator}${formatKeyValue("source", entry.env.source)}`,
          ),
        );
      if (entry.modelsJson)
        bits.push(
          formatKeyValue(
            "models.json",
            `${entry.modelsJson.value}${separator}${formatKeyValue("source", entry.modelsJson.source)}`,
          ),
        );
      if (entry.syntheticAuth)
        bits.push(
          formatKeyValue(
            "synthetic",
            `${entry.syntheticAuth.value}${separator}${formatKeyValue("source", entry.syntheticAuth.source)}`,
          ),
        );
      runtime.log(`- ${theme.heading(entry.provider)} ${bits.join(separator)}`);
    }
    if (runtimeAuthRoutes.length > 0) {
      runtime.log("");
      runtime.log(colorize(rich, theme.heading, "Runtime auth"));
      for (const route of runtimeAuthRoutes)
        runtime.log(
          `- ${theme.heading(route.provider)} via ${colorize(rich, theme.accentBright, route.runtime)} uses ${theme.heading(route.authProvider)} ${formatKeyValue("effective", `${colorize(rich, theme.accentBright, route.effective.kind)}:${colorize(rich, theme.muted, route.effective.detail)}`)}${formatSeparator()}${formatKeyValue("status", route.status)}`,
        );
    }
    if (dedupedModelRouteIssues.length > 0) {
      runtime.log("");
      runtime.log(colorize(rich, theme.heading, "Model route issues"));
      for (const issue of dedupedModelRouteIssues) {
        const modelRef = `${issue.provider}/${issue.model}`;
        if (issue.kind === "incompatible") {
          runtime.log(`- ${theme.heading(modelRef)} [${issue.code}] ${issue.message}`);
          continue;
        }
        if (issue.kind === "indeterminate") {
          runtime.log(`- ${theme.heading(modelRef)} [indeterminate] ${issue.message}`);
          continue;
        }
        runtime.log(
          `- ${theme.heading(modelRef)} requires ${issue.authRequirement} auth: ${issue.message}`,
        );
      }
    }
    if (missingProvidersInUse.length > 0) {
      const { buildProviderAuthRecoveryHint } =
        await import("./provider-auth-recovery-hint-BX2m63-W.js");
      runtime.log("");
      runtime.log(colorize(rich, theme.heading, "Missing auth"));
      for (const provider of missingProvidersInUse) {
        const hint = buildProviderAuthRecoveryHint({
          provider,
          config: cfg,
          includeEnvVar: !dedupedModelRouteIssues.some(
            (issue) =>
              issue.kind === "missing-auth" &&
              issue.provider === provider &&
              issue.authRequirement === "subscription",
          ),
        });
        runtime.log(`- ${theme.heading(provider)} ${hint}`);
      }
    }
    runtime.log("");
    runtime.log(colorize(rich, theme.heading, "OAuth/token status"));
    if (oauthProfiles.length === 0) runtime.log(colorize(rich, theme.muted, "- none"));
    else {
      const { formatUsageWindowSummary, loadProviderUsageSummary, resolveUsageProviderId } =
        await loadProviderUsageRuntime();
      const usageByProvider = /* @__PURE__ */ new Map();
      const usageProviders = Array.from(
        new Set(
          oauthProfiles
            .map((profile) =>
              resolveUsageProviderId(profile.provider, { credentialType: profile.type }),
            )
            .filter((provider) => Boolean(provider)),
        ),
      );
      if (usageProviders.length > 0)
        try {
          const usageSummary = await loadProviderUsageSummary({
            providers: usageProviders,
            agentDir,
            timeoutMs: 3500,
          });
          for (const snapshot of usageSummary.providers) {
            const formatted = formatUsageWindowSummary(snapshot, {
              now: Date.now(),
              maxWindows: 2,
              includeResets: true,
            });
            if (formatted) usageByProvider.set(snapshot.provider, formatted);
          }
        } catch {}
      const formatStatus = (status) => {
        if (status === "ok") return colorize(rich, theme.success, "ok");
        if (status === "static") return colorize(rich, theme.muted, "static");
        if (status === "expiring") return colorize(rich, theme.warn, "expiring");
        if (status === "missing") return colorize(rich, theme.warn, "unknown");
        return colorize(rich, theme.error, "expired");
      };
      const profilesByProvider = /* @__PURE__ */ new Map();
      for (const profile of oauthProfiles) {
        const current = profilesByProvider.get(profile.provider);
        if (current) current.push(profile);
        else profilesByProvider.set(profile.provider, [profile]);
      }
      for (const [provider, profiles] of profilesByProvider) {
        const usageKey = resolveUsageProviderId(provider, {
          credentialType: profiles.find(
            (profile) => profile.type === "oauth" || profile.type === "token",
          )?.type,
        });
        const usage = usageKey ? usageByProvider.get(usageKey) : void 0;
        const usageSuffix = usage ? colorize(rich, theme.muted, ` usage: ${usage}`) : "";
        runtime.log(`- ${colorize(rich, theme.heading, provider)}${usageSuffix}`);
        for (const profile of profiles) {
          const labelText = profile.label || profile.profileId;
          const labelLocal = colorize(rich, theme.accent, labelText);
          const status = formatStatus(profile.status);
          const expiry =
            profile.status === "static"
              ? ""
              : profile.expiresAt
                ? ` expires in ${formatRemainingShort(profile.remainingMs)}`
                : " expires unknown";
          runtime.log(`  - ${labelLocal} ${status}${expiry}`);
        }
      }
    }
    if (probeSummary) {
      const [
        { getTerminalTableWidth, renderTable },
        { describeProbeSummary, formatProbeLatency, sortProbeResults },
      ] = await Promise.all([loadTerminalTableRuntime(), loadListProbeRuntime()]);
      runtime.log("");
      runtime.log(colorize(rich, theme.heading, "Auth probes"));
      if (probeSummary.results.length === 0) runtime.log(colorize(rich, theme.muted, "- none"));
      else {
        const tableWidth = getTerminalTableWidth();
        const sorted = sortProbeResults(probeSummary.results);
        const statusColor = (status) => {
          if (status === "ok") return theme.success;
          if (status === "rate_limit") return theme.warn;
          if (status === "timeout" || status === "billing") return theme.warn;
          if (status === "auth" || status === "format") return theme.error;
          if (status === "no_model") return theme.muted;
          return theme.muted;
        };
        const rows = sorted.map((result) => {
          const status = colorize(rich, statusColor(result.status), result.status);
          const latency = formatProbeLatency(result.latencyMs);
          const modelLabel = result.model ?? `${result.provider}/-`;
          const modeLabel = result.mode
            ? ` ${colorize(rich, theme.muted, `(${result.mode})`)}`
            : "";
          const profile = `${colorize(rich, theme.accent, result.label)}${modeLabel}`;
          const detail = result.error?.trim();
          const detailLabel = detail ? `\n${colorize(rich, theme.muted, `↳ ${detail}`)}` : "";
          const statusLabel = `${status}${colorize(rich, theme.muted, ` · ${latency}`)}${detailLabel}`;
          return {
            Model: colorize(rich, theme.heading, modelLabel),
            Profile: profile,
            Status: statusLabel,
          };
        });
        runtime.log(
          renderTable({
            width: tableWidth,
            columns: [
              {
                key: "Model",
                header: "Model",
                minWidth: 18,
              },
              {
                key: "Profile",
                header: "Profile",
                minWidth: 24,
              },
              {
                key: "Status",
                header: "Status",
                minWidth: 12,
              },
            ],
            rows,
          }).trimEnd(),
        );
        runtime.log(colorize(rich, theme.muted, describeProbeSummary(probeSummary)));
      }
    }
    finishModelsStatusOutput(runtime, opts.check, checkStatus);
  } finally {
    cleanupPluginMetadataSnapshot();
  }
}
//#endregion
export { modelsStatusCommand };
