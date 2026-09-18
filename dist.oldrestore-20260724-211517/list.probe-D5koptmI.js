import crypto from "node:crypto";
import fs from "node:fs/promises";
import "./src-Bl7G9qvi.js";
import os from "node:os";
import path from "node:path";
import pMap from "p-map";
import "./agent-scope-y9xQv_q1.js";
import {
  a as resolveAgentDir,
  c as resolveDefaultAgentId,
  o as resolveAgentWorkspaceDir,
} from "./agent-scope-config-DVIR1nBa.js";
import { i as resolveAuthProfileDisplayLabel } from "./auth-profiles-CX7JDmZ9.js";
import { r as DEFAULT_PROVIDER } from "./defaults-CdX9UGcX.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { i as externalCliDiscoveryScoped } from "./external-cli-discovery-To6-j7MZ.js";
import { a as describeFailoverError } from "./failover-error-CYvhrluQ.js";
import { f as redactSecrets } from "./format-BCAYBsyK.js";
import { t as createLazyImportLoader } from "./lazy-promise-EhsWch5m.js";
import {
  d as hasUsableCustomProviderApiKey,
  g as resolveUsableCustomProviderApiKey,
  h as resolveProviderEntryApiKeyProfileReference,
  m as resolveProviderEntryApiKeyBinding,
} from "./model-auth-BWFdcEzF.js";
import { t as resolveEnvApiKey } from "./model-auth-env-DLe5znyS.js";
import { n as loadModelCatalog } from "./model-catalog-DxYvPELu.js";
import {
  c as parseModelRef,
  n as findNormalizedProviderValue,
  o as normalizeProviderId,
} from "./model-selection-normalize-BoKGJiBx.js";
import { a as disposeOpenClawAgentDatabaseByPath } from "./openclaw-agent-db-VC51jrBW.js";
import {
  a as resolveAuthProfileOrderWithMetadata,
  r as resolveAuthProfileEligibility,
} from "./order-BNCpk81x.js";
import "./model-selection-DOlkTrQa.js";
import {
  a as resolveSessionTranscriptPath,
  c as resolveSessionTranscriptsDirForAgent,
} from "./paths-TfuVT-K8.js";
import { n as listProfilesForProvider } from "./profile-list-I4BheGlK.js";
import { c as upsertAuthProfileWithLock } from "./profiles-DxTOoenK.js";
import "./workspace-DXzCbuC0.js";
import { r as resolveProviderIdForAuth } from "./provider-auth-aliases-RaEzqkSo.js";
import { n as resolveSecretRefString } from "./resolve-Dvpn9c2h.js";
import { r as formatMs } from "./shared-DFGOIlxJ.js";
import { c as resolveAuthProfileDatabasePath } from "./sqlite-BXljtvPf.js";
import {
  i as ensureAuthProfileStore,
  n as clearRuntimeAuthProfileStoreSnapshot,
} from "./store-B7DoDdVM.js";
import { p as normalizeUniqueStringEntries } from "./string-normalization-CRyoFBPt.js";
import {
  c as hasConfiguredSecretInput,
  p as normalizeSecretInputString,
  s as coerceSecretRef,
} from "./types.secrets-BV0ywRAy.js";
import { n as resolveDefaultAgentWorkspaceDir } from "./workspace-default-h9TzWSvp.js";
//#region src/commands/models/list.probe.models.ts
/** Model candidate normalization and catalog selection for auth probes. */
/** Groups configured model candidates by their requested provider identity. */
function buildProbeCandidateMap(modelCandidates) {
  const map = /* @__PURE__ */ new Map();
  for (const raw of modelCandidates) {
    const parsed = parseModelRef(raw ?? "", DEFAULT_PROVIDER);
    if (!parsed) continue;
    const list = map.get(parsed.provider) ?? [];
    if (!list.includes(parsed.model)) list.push(parsed.model);
    map.set(parsed.provider, list);
  }
  return map;
}
function catalogProbePriority(provider, modelId) {
  const id = modelId.trim().toLowerCase();
  if (provider !== "anthropic") return 50;
  if (/^claude-haiku-4-5-\d{8}$/.test(id)) return 0;
  if (id === "claude-haiku-4-5") return 1;
  if (id === "claude-sonnet-5" || id.startsWith("claude-sonnet-5-")) return 2;
  if (id === "claude-sonnet-4-6" || id.startsWith("claude-sonnet-4-6-")) return 3;
  if (id.startsWith("claude-sonnet-4-")) return 4;
  if (id.startsWith("claude-3-")) return 100;
  return 50;
}
/** Selects a requested-provider candidate before falling back to its catalog rows. */
function selectProbeModel(params) {
  const { provider, candidates, catalog } = params;
  const direct = candidates.get(provider);
  if (direct && direct.length > 0)
    return {
      provider,
      model: expectDefined(direct[0], "direct entry at 0"),
    };
  const fromCatalog = catalog
    .map((entry, index) => ({
      entry,
      index,
    }))
    .filter(({ entry }) => normalizeProviderId(entry.provider) === provider)
    .toSorted((left, right) => {
      return (
        catalogProbePriority(provider, left.entry.id) -
          catalogProbePriority(provider, right.entry.id) || left.index - right.index
      );
    })[0]?.entry;
  return fromCatalog
    ? {
        provider,
        model: fromCatalog.id,
      }
    : null;
}
//#endregion
//#region src/commands/models/list.probe.ts
/** Auth probe planning and execution helpers for model diagnostics. */
const PROBE_PROMPT = "Reply with OK. Do not use tools.";
/** Scrubs credential-shaped text before probe failures cross a UI or CLI boundary. */
function redactAuthProbeError(error) {
  return redactSecrets(error);
}
const embeddedRunnerModuleLoader = createLazyImportLoader(
  () => import("./embedded-agent-Co8ck_EF.js"),
);
function loadEmbeddedRunnerModule() {
  return embeddedRunnerModuleLoader.load();
}
/** Maps runtime failover reasons into stable auth probe status buckets. */
function mapFailoverReasonToProbeStatus(reason) {
  if (!reason) return "unknown";
  if (reason === "auth" || reason === "auth_permanent") return "auth";
  if (reason === "rate_limit" || reason === "overloaded") return "rate_limit";
  if (reason === "billing") return "billing";
  if (reason === "timeout") return "timeout";
  if (reason === "model_not_found") return "format";
  if (reason === "format") return "format";
  return "unknown";
}
function mapEligibilityReasonToProbeReasonCode(reasonCode) {
  if (reasonCode === "missing_credential") return "missing_credential";
  if (reasonCode === "expired") return "expired";
  if (reasonCode === "invalid_expires") return "invalid_expires";
  if (reasonCode === "unresolved_ref") return "unresolved_ref";
  return "ineligible_profile";
}
function formatMissingCredentialProbeError(reasonCode) {
  const legacyLine = "Auth profile credentials are missing or expired.";
  if (reasonCode === "expired")
    return `${legacyLine}\n↳ Auth reason [expired]: token credentials are expired.`;
  if (reasonCode === "invalid_expires")
    return `${legacyLine}\n↳ Auth reason [invalid_expires]: token expires must be a positive Unix ms timestamp.`;
  if (reasonCode === "missing_credential")
    return `${legacyLine}\n↳ Auth reason [missing_credential]: no inline credential or SecretRef is configured.`;
  if (reasonCode === "unresolved_ref")
    return `${legacyLine}\n↳ Auth reason [unresolved_ref]: configured SecretRef could not be resolved.`;
  return `${legacyLine}\n↳ Auth reason [ineligible_profile]: profile is incompatible with provider config.`;
}
function resolveProbeSecretRef(profile, cfg) {
  const defaults = cfg.secrets?.defaults;
  if (profile.type === "api_key") {
    if (normalizeSecretInputString(profile.key) !== void 0) return null;
    return coerceSecretRef(profile.keyRef, defaults);
  }
  if (profile.type === "token") {
    if (normalizeSecretInputString(profile.token) !== void 0) return null;
    return coerceSecretRef(profile.tokenRef, defaults);
  }
  return null;
}
function formatUnresolvedRefProbeError(refLabel) {
  return `Auth profile credentials are missing or expired.\n↳ Auth reason [unresolved_ref]: could not resolve SecretRef "${refLabel}".`;
}
function withDirectCredential(cfg, provider, value, mode) {
  const providers = cfg.models?.providers ?? {};
  const configKey =
    Object.keys(providers).find((key) => normalizeProviderId(key) === provider) ?? provider;
  const configured = providers[configKey];
  if (!configured) return withoutProfileFallback(cfg, provider);
  const auth = mode === "oauth" || mode === "token" ? mode : "api-key";
  return {
    ...cfg,
    models: {
      ...cfg.models,
      providers: {
        ...providers,
        [configKey]: {
          ...configured,
          apiKey: value,
          auth,
        },
      },
    },
    auth: {
      ...cfg.auth,
      order: {
        ...cfg.auth?.order,
        [provider]: [],
      },
    },
  };
}
function withoutProfileFallback(cfg, provider) {
  return {
    ...cfg,
    auth: {
      ...cfg.auth,
      order: {
        ...cfg.auth?.order,
        [provider]: [],
      },
    },
  };
}
async function resolveConfiguredProbeCredential(params) {
  const literal = normalizeSecretInputString(params.input);
  if (literal !== void 0) return literal;
  const ref = coerceSecretRef(params.input, params.cfg.secrets?.defaults);
  if (!ref) return null;
  try {
    return await resolveSecretRefString(ref, {
      config: params.cfg,
      env: process.env,
      cache: params.cache,
    });
  } catch {
    return null;
  }
}
async function maybeResolveUnresolvedRefIssue(params) {
  if (!params.profile) return null;
  const ref = resolveProbeSecretRef(params.profile, params.cfg);
  if (!ref) return null;
  try {
    await resolveSecretRefString(ref, {
      config: params.cfg,
      env: process.env,
      cache: params.cache,
    });
    return null;
  } catch {
    return {
      reasonCode: "unresolved_ref",
      error: formatUnresolvedRefProbeError(`${ref.source}:${ref.provider}:${ref.id}`),
    };
  }
}
/** Builds probe targets plus preflight failures for missing/invalid credentials. */
async function buildProbeTargets(params) {
  const { cfg, agentDir, providers, modelCandidates, options, workspaceDir } = params;
  const authAliasLookupParams = {
    config: cfg,
    workspaceDir,
  };
  const store = ensureAuthProfileStore(agentDir, {
    externalCli: externalCliDiscoveryScoped({
      config: cfg,
      allowKeychainPrompt: false,
      providerIds: providers.map((provider) =>
        resolveProviderIdForAuth(provider, authAliasLookupParams),
      ),
      profileIds: options.profileIds,
    }),
  });
  const providerFilter = options.provider?.trim();
  const providerFilterKey = providerFilter ? normalizeProviderId(providerFilter) : null;
  const profileFilter = new Set(normalizeUniqueStringEntries(options.profileIds));
  const refResolveCache = {};
  const catalog = await loadModelCatalog({ config: cfg });
  const candidates = buildProbeCandidateMap(modelCandidates);
  const targets = [];
  const results = [];
  for (const provider of providers) {
    const providerKey = normalizeProviderId(provider);
    const authProviderKey = resolveProviderIdForAuth(providerKey, authAliasLookupParams);
    if (providerFilterKey && providerKey !== providerFilterKey) continue;
    const model = selectProbeModel({
      provider: providerKey,
      candidates,
      catalog,
    });
    const configuredProvider = findNormalizedProviderValue(cfg.models?.providers, providerKey);
    const includeDirectKeys = options.includeDirectKeys === true && profileFilter.size === 0;
    const includeConfigKey =
      includeDirectKeys &&
      profileFilter.size === 0 &&
      hasConfiguredSecretInput(configuredProvider?.apiKey, cfg.secrets?.defaults);
    const profileIds = [
      .../* @__PURE__ */ new Set([
        ...listProfilesForProvider(store, authProviderKey),
        ...(authProviderKey === providerKey ? [] : listProfilesForProvider(store, providerKey)),
      ]),
    ];
    const configuredReference = includeConfigKey
      ? resolveProviderEntryApiKeyProfileReference({
          cfg,
          provider: providerKey,
          store,
        })
      : { kind: "none" };
    const configuredBinding =
      configuredReference.kind === "profile" && !profileIds.includes(configuredReference.profileId)
        ? await resolveProviderEntryApiKeyBinding({
            cfg,
            provider: providerKey,
            store,
            agentDir,
          })
        : null;
    const configuredValue =
      includeConfigKey &&
      configuredReference.kind !== "profile" &&
      configuredReference.kind !== "profile-incompatible"
        ? configuredReference.kind === "marker"
          ? (resolveUsableCustomProviderApiKey({
              cfg,
              provider: providerKey,
              env: process.env,
            })?.apiKey ?? null)
          : await resolveConfiguredProbeCredential({
              cfg,
              input: configuredProvider?.apiKey,
              cache: refResolveCache,
            })
        : null;
    const configuredMode =
      configuredProvider?.auth === "oauth" || configuredProvider?.auth === "token"
        ? configuredProvider.auth
        : "api_key";
    const resolvedEnvironmentValue = includeDirectKeys
      ? resolveEnvApiKey(authProviderKey, process.env, {
          config: cfg,
          workspaceDir,
        })
      : null;
    const environmentValue =
      resolvedEnvironmentValue?.apiKey === configuredValue ? null : resolvedEnvironmentValue;
    const appendDirectTargets = () => {
      if (includeConfigKey)
        if (configuredReference.kind === "profile-incompatible")
          results.push({
            provider: providerKey,
            model: model ? `${model.provider}/${model.model}` : void 0,
            profileId: configuredReference.profileId,
            label: "config",
            source: "models.json",
            mode: configuredMode,
            status: "unknown",
            reasonCode: "ineligible_profile",
            error: "Configured API key references an incompatible auth profile.",
          });
        else if (configuredReference.kind === "profile") {
          if (!profileIds.includes(configuredReference.profileId))
            if (configuredBinding?.kind === "profile-resolved" && model)
              targets.push({
                provider: providerKey,
                model,
                profileId: configuredBinding.auth.profileId,
                label: "config",
                source: "models.json",
                mode: configuredBinding.auth.mode,
                boundValue: configuredBinding.auth.apiKey,
              });
            else
              results.push({
                provider: providerKey,
                model: model ? `${model.provider}/${model.model}` : void 0,
                profileId: configuredReference.profileId,
                label: "config",
                source: "models.json",
                mode: configuredMode,
                status: model ? "unknown" : "no_model",
                reasonCode: model ? "unresolved_ref" : "no_model",
                error: model
                  ? "Configured auth profile could not be resolved."
                  : "No model available for probe",
              });
        } else if (!configuredValue)
          results.push({
            provider: providerKey,
            model: model ? `${model.provider}/${model.model}` : void 0,
            label: "config",
            source: "models.json",
            mode: configuredMode,
            status: model ? "unknown" : "no_model",
            reasonCode: model ? "unresolved_ref" : "no_model",
            error: model
              ? "Configured API key could not be resolved."
              : "No model available for probe",
          });
        else if (model)
          targets.push({
            provider: providerKey,
            model,
            label: "config",
            source: "models.json",
            mode: configuredMode,
            boundValue: configuredValue,
            ...(configuredReference.kind === "marker" ? { useRuntimeAuth: true } : {}),
          });
        else
          results.push({
            provider: providerKey,
            model: void 0,
            label: "config",
            source: "models.json",
            mode: configuredMode,
            status: "no_model",
            reasonCode: "no_model",
            error: "No model available for probe",
          });
      if (environmentValue) {
        const mode =
          configuredProvider?.auth === "oauth" || configuredProvider?.auth === "token"
            ? configuredProvider.auth
            : environmentValue.source.includes("OAUTH_TOKEN")
              ? "oauth"
              : "api_key";
        if (model)
          targets.push({
            provider: providerKey,
            model,
            label: environmentValue.source,
            source: "env",
            mode,
            boundValue: environmentValue.apiKey,
          });
        else
          results.push({
            provider: providerKey,
            model: void 0,
            label: environmentValue.source,
            source: "env",
            mode,
            status: "no_model",
            reasonCode: "no_model",
            error: "No model available for probe",
          });
      }
    };
    const explicitOrder =
      findNormalizedProviderValue(store.order, authProviderKey) ??
      findNormalizedProviderValue(store.order, providerKey) ??
      findNormalizedProviderValue(cfg?.auth?.order, authProviderKey) ??
      findNormalizedProviderValue(cfg?.auth?.order, providerKey);
    const orderResolution = resolveAuthProfileOrderWithMetadata({
      cfg,
      store,
      provider: providerKey,
      forModel: model?.model,
    });
    const allowedProfiles = orderResolution.hasExplicitOrder
      ? new Set(orderResolution.profileIds)
      : null;
    const filteredProfiles = profileFilter.size
      ? profileIds.filter((id) => profileFilter.has(id))
      : profileIds;
    if (filteredProfiles.length > 0) {
      for (const profileId of filteredProfiles) {
        const profile = store.profiles[profileId];
        const mode = profile?.type;
        const label = resolveAuthProfileDisplayLabel({
          cfg,
          store,
          profileId,
        });
        const isConfigBoundProfile =
          includeConfigKey &&
          configuredReference.kind === "profile" &&
          profileId === configuredReference.profileId;
        if (!isConfigBoundProfile && explicitOrder && !explicitOrder.includes(profileId)) {
          results.push({
            provider: providerKey,
            profileId,
            model: model ? `${model.provider}/${model.model}` : void 0,
            label,
            source: "profile",
            mode,
            status: "unknown",
            reasonCode: "excluded_by_auth_order",
            error: "Excluded by auth.order for this provider.",
          });
          continue;
        }
        if (!isConfigBoundProfile && allowedProfiles && !allowedProfiles.has(profileId)) {
          const reasonCode = mapEligibilityReasonToProbeReasonCode(
            resolveAuthProfileEligibility({
              cfg,
              store,
              provider: providerKey,
              profileId,
            }).reasonCode,
          );
          results.push({
            provider: providerKey,
            model: model ? `${model.provider}/${model.model}` : void 0,
            profileId,
            label,
            source: "profile",
            mode,
            status: "unknown",
            reasonCode,
            error: formatMissingCredentialProbeError(reasonCode),
          });
          continue;
        }
        const unresolvedRefIssue = await maybeResolveUnresolvedRefIssue({
          cfg,
          profile,
          cache: refResolveCache,
        });
        if (unresolvedRefIssue) {
          results.push({
            provider: providerKey,
            model: model ? `${model.provider}/${model.model}` : void 0,
            profileId,
            label,
            source: "profile",
            mode,
            status: "unknown",
            reasonCode: unresolvedRefIssue.reasonCode,
            error: unresolvedRefIssue.error,
          });
          continue;
        }
        if (!model) {
          results.push({
            provider: providerKey,
            model: void 0,
            profileId,
            label,
            source: "profile",
            mode,
            status: "no_model",
            reasonCode: "no_model",
            error: "No model available for probe",
          });
          continue;
        }
        targets.push({
          provider: providerKey,
          model,
          profileId,
          label,
          source: "profile",
          mode,
        });
      }
      appendDirectTargets();
      continue;
    }
    if (profileFilter.size > 0) continue;
    appendDirectTargets();
    if (includeConfigKey || environmentValue) continue;
    const hasUsableModelsJsonKey = hasUsableCustomProviderApiKey(cfg, providerKey);
    if (orderResolution.hasExplicitOrder && !hasUsableModelsJsonKey) continue;
    const envKey = orderResolution.hasExplicitOrder
      ? null
      : resolveEnvApiKey(authProviderKey, process.env, {
          config: cfg,
          workspaceDir,
        });
    if (!envKey && !hasUsableModelsJsonKey) continue;
    const label = envKey ? "env" : "models.json";
    const source = envKey ? "env" : "models.json";
    const mode = envKey?.source.includes("OAUTH_TOKEN") ? "oauth" : "api_key";
    if (!model) {
      results.push({
        provider: providerKey,
        model: void 0,
        label,
        source,
        mode,
        status: "no_model",
        reasonCode: "no_model",
        error: "No model available for probe",
      });
      continue;
    }
    targets.push({
      provider: providerKey,
      model,
      label,
      source,
      mode,
    });
  }
  return {
    targets,
    results,
  };
}
async function probeTarget(params) {
  const { cfg, agentId, agentDir, workspaceDir, sessionDir, target, timeoutMs, maxTokens } = params;
  const probeConfig = !target.boundValue
    ? cfg
    : target.useRuntimeAuth
      ? withoutProfileFallback(cfg, target.provider)
      : withDirectCredential(cfg, target.provider, target.boundValue, target.mode);
  if (!target.model)
    return {
      provider: target.provider,
      model: void 0,
      profileId: target.profileId,
      label: target.label,
      source: target.source,
      mode: target.mode,
      status: "no_model",
      reasonCode: "no_model",
      error: "No model available for probe",
    };
  const model = target.model;
  const sessionId = `probe-${target.provider}-${crypto.randomUUID()}`;
  const sessionFile = resolveSessionTranscriptPath(sessionId, agentId);
  await fs.mkdir(sessionDir, { recursive: true });
  let isolatedAgentDir = null;
  let isolatedProfileId;
  const start = Date.now();
  const buildResult = (status, error) => ({
    provider: target.provider,
    model: `${model.provider}/${model.model}`,
    profileId: target.profileId,
    label: target.label,
    source: target.source,
    mode: target.mode,
    status,
    ...(error ? { error } : {}),
    latencyMs: Date.now() - start,
  });
  try {
    if (target.boundValue)
      isolatedAgentDir = await fs.realpath(
        await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-auth-probe-")),
      );
    if (target.boundValue && !target.useRuntimeAuth && isolatedAgentDir) {
      isolatedProfileId = `${target.provider}:probe-${crypto.randomUUID()}`;
      const value = target.boundValue;
      const profile =
        target.mode === "oauth"
          ? {
              type: "oauth",
              provider: target.provider,
              access: value,
              refresh: "not-a-real",
              expires: Date.now() + 3600 * 1e3,
            }
          : target.mode === "token"
            ? {
                type: "token",
                provider: target.provider,
                token: value,
              }
            : {
                type: "api_key",
                provider: target.provider,
                key: value,
              };
      if (
        !(await upsertAuthProfileWithLock({
          profileId: isolatedProfileId,
          credential: profile,
          agentDir: isolatedAgentDir,
        }))
      )
        throw new Error("Could not prepare isolated auth probe profile");
    }
    const { runEmbeddedAgent } = await loadEmbeddedRunnerModule();
    await runEmbeddedAgent({
      sessionId,
      sessionFile,
      agentId,
      workspaceDir,
      agentDir: isolatedAgentDir ?? agentDir,
      config: probeConfig,
      prompt: PROBE_PROMPT,
      provider: target.model.provider,
      model: target.model.model,
      authProfileId: isolatedProfileId ?? target.profileId,
      authProfileIdSource: isolatedProfileId || target.profileId ? "user" : void 0,
      timeoutMs,
      runId: `probe-${crypto.randomUUID()}`,
      lane: `auth-probe:${target.provider}:${target.profileId ?? target.source}`,
      thinkLevel: "off",
      reasoningLevel: "off",
      verboseLevel: "off",
      streamParams: { maxTokens },
      disableTools: true,
      modelRun: true,
      cleanupBundleMcpOnRunEnd: true,
    });
    return buildResult("ok");
  } catch (err) {
    const described = describeFailoverError(err);
    return buildResult(
      mapFailoverReasonToProbeStatus(described.reason),
      redactAuthProbeError(described.message),
    );
  } finally {
    if (isolatedAgentDir) {
      clearRuntimeAuthProfileStoreSnapshot(isolatedAgentDir);
      disposeOpenClawAgentDatabaseByPath(resolveAuthProfileDatabasePath(isolatedAgentDir));
      await fs.rm(isolatedAgentDir, {
        recursive: true,
        force: true,
      });
    }
  }
}
async function runTargetsWithConcurrency(params) {
  const { cfg, targets, timeoutMs, maxTokens, onProgress } = params;
  const concurrency = Math.max(1, Math.min(targets.length || 1, params.concurrency));
  const agentId = params.agentId ?? resolveDefaultAgentId(cfg);
  const agentDir = params.agentDir ?? resolveAgentDir(cfg, agentId);
  const workspaceDir =
    params.workspaceDir ??
    resolveAgentWorkspaceDir(cfg, agentId) ??
    resolveDefaultAgentWorkspaceDir();
  const sessionDir = resolveSessionTranscriptsDirForAgent(agentId);
  await fs.mkdir(workspaceDir, { recursive: true });
  let completed = 0;
  return await pMap(
    targets,
    async (target) => {
      onProgress?.({
        completed,
        total: targets.length,
        label: `Probing ${target.provider}${target.profileId ? ` (${target.label})` : ""}`,
      });
      const result = await probeTarget({
        cfg,
        agentId,
        agentDir,
        workspaceDir,
        sessionDir,
        target,
        timeoutMs,
        maxTokens,
      });
      completed += 1;
      onProgress?.({
        completed,
        total: targets.length,
      });
      return result;
    },
    {
      concurrency,
      stopOnError: true,
    },
  );
}
/** Runs all auth probes with bounded concurrency and returns a summary. */
async function runAuthProbes(params) {
  const startedAt = Date.now();
  const plan = await buildProbeTargets({
    cfg: params.cfg,
    agentDir: params.agentDir,
    workspaceDir: params.workspaceDir,
    providers: params.providers,
    modelCandidates: params.modelCandidates,
    options: params.options,
  });
  const totalTargets = plan.targets.length;
  params.onProgress?.({
    completed: 0,
    total: totalTargets,
  });
  const results = totalTargets
    ? await runTargetsWithConcurrency({
        cfg: params.cfg,
        agentId: params.agentId,
        agentDir: params.agentDir,
        workspaceDir: params.workspaceDir,
        targets: plan.targets,
        timeoutMs: params.options.timeoutMs,
        maxTokens: params.options.maxTokens,
        concurrency: params.options.concurrency,
        onProgress: params.onProgress,
      })
    : [];
  const finishedAt = Date.now();
  return {
    startedAt,
    finishedAt,
    durationMs: finishedAt - startedAt,
    totalTargets,
    options: params.options,
    results: [...plan.results, ...results],
  };
}
/** Formats probe latency for table output. */
function formatProbeLatency(latencyMs) {
  if (!latencyMs && latencyMs !== 0) return "-";
  return formatMs(latencyMs);
}
/** Sorts probe results by provider and display label. */
function sortProbeResults(results) {
  return results.slice().toSorted((a, b) => {
    const provider = a.provider.localeCompare(b.provider);
    if (provider !== 0) return provider;
    const aLabel = a.label || a.profileId || "";
    const bLabel = b.label || b.profileId || "";
    return aLabel.localeCompare(bLabel);
  });
}
/** Produces the terse completion line for auth probe output. */
function describeProbeSummary(summary) {
  if (summary.totalTargets === 0) return "No probe targets.";
  return `Probed ${summary.totalTargets} target${summary.totalTargets === 1 ? "" : "s"} in ${formatMs(summary.durationMs)}`;
}
//#endregion
export {
  redactAuthProbeError as a,
  mapFailoverReasonToProbeStatus as i,
  describeProbeSummary as n,
  runAuthProbes as o,
  formatProbeLatency as r,
  sortProbeResults as s,
  buildProbeTargets as t,
};
