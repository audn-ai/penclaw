import { a as resolveAgentDir } from "./agent-scope-config-DVIR1nBa.js";
import { v as resolveSessionAgentId } from "./agent-scope-y9xQv_q1.js";
import "./number-coercion-EqFmHmOw.js";
import { t as buildAgentRuntimeAuthPlan } from "./auth-6NjuyOV9.js";
import { r as formatRemainingShort } from "./auth-health-DTCl3XuB.js";
import { i as resolveAuthProfileDisplayLabel } from "./auth-profiles-CX7JDmZ9.js";
import { f as renderExecTargetLabel } from "./bash-tools.exec-runtime-BiZhPykN.js";
import { d as refreshQueuedFollowupSession } from "./cleanup-DDlcY-PM.js";
import { i as resolveModelsCommandReply } from "./commands-models-DBIUoW_v.js";
import { t as resolveModelSelectionFromDirective } from "./directive-handling.model-selection-CqsPD_Nn.js";
import {
  a as formatElevatedUnavailableText,
  c as formatInternalVerbosePersistenceDeniedText,
  d as applyModelRuntimeDirective,
  f as resolveModelRuntimeDirective,
  i as formatElevatedRuntimeHint,
  l as resolveDirectiveTouchedSessionFields,
  n as enqueueModeSwitchEvents,
  o as formatInternalExecPersistenceDeniedText,
  r as formatDirectiveAck,
  s as formatInternalVerboseCurrentReplyOnlyText,
  t as canPersistSessionDirectiveDefaults,
  u as withOptions,
} from "./directive-handling.shared-CynZiykl.js";
import { t as resolveExecDefaults } from "./exec-defaults-CZ1jkNDD.js";
import {
  i as formatFastModeCurrentStatus,
  r as formatFastModeCommandOptions,
  s as formatFastModeValue,
} from "./fast-mode-BhVbWk_p.js";
import "./plugins-BKdf-5tW.js";
import { t as resolveFastModeState } from "./fast-mode-C6dQXWoG.js";
import { n as applyVerboseOverride, t as applyTraceOverride } from "./level-overrides-DZylhTAo.js";
import { g as resolveUsableCustomProviderApiKey } from "./model-auth-BWFdcEzF.js";
import { t as resolveEnvApiKey } from "./model-auth-env-DLe5znyS.js";
import "./model-selection-DOlkTrQa.js";
import {
  a as isModelSelectionLocked,
  i as applyModelOverrideToSessionEntry,
  t as MODEL_SELECTION_LOCKED_MESSAGE,
} from "./model-overrides-BlzAR7Nc.js";
import { n as resolveSelectedAndActiveModel } from "./model-runtime-CT6T4rg0.js";
import {
  i as modelKey,
  n as findNormalizedProviderValue,
  o as normalizeProviderId,
} from "./model-selection-normalize-BoKGJiBx.js";
import {
  r as buildConfiguredModelCatalog,
  v as resolveConfiguredModelRef,
  x as resolveModelRefFromString,
} from "./model-selection-shared-BliwFXJy.js";
import { o as asDateTimestampMs } from "./number-coercion-CJQ8TR--.js";
import {
  i as resolveAuthProfileOrder,
  t as isConfiguredAwsSdkAuthProfileForProvider,
} from "./order-BNCpk81x.js";
import { i as resolveAuthStorePathForDisplay } from "./path-resolve-8wkj2l4Z.js";
import { t as resolveAgentHarnessPolicy } from "./policy-C704eijA.js";
import { n as resolveQueueSettings } from "./queue-DBlMyPZt.js";
import { t as getChannelPlugin } from "./registry-mc8oBRx8.js";
import { t as resolveRuntimePolicySessionKey } from "./runtime-policy-session-key-Nefn4vsl.js";
import { n as resolveSandboxRuntimeStatus } from "./runtime-status-DT_QCQQG.js";
import { t as maskApiKey } from "./secret-mask-CWRecbVB.js";
import "./sandbox-BbGZOuCz.js";
import { t as persistReplySessionEntry } from "./session-entry-persistence-BPeN-I4M.js";
import { t as triggerSessionPatchHook } from "./session-patch-hooks-BiLQgeII.js";
import { r as resolveSessionRuntimeOverrideForProvider } from "./session-runtime-compat-DgCFENjt.js";
import {
  a as sessionModelOverrideChangesApplied,
  n as adoptPersistedSessionSnapshot,
  o as sessionSnapshotChangesApplied,
} from "./session-snapshot-merge-BUp0DZlF.js";
import { i as ensureAuthProfileStore } from "./store-B7DoDdVM.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
} from "./string-coerce-DW4mBlAt.js";
import { a as enqueueSystemEvent } from "./system-events-CIAdjAwz.js";
import {
  n as isThinkingLevelSupported,
  o as resolveSupportedThinkingLevel,
  t as formatThinkingLevels,
} from "./thinking-CVcRbjTC.js";
import { r as resolveEffectiveAgentRuntime } from "./thinking-runtime-D675lyzz.js";
import { s as coerceSecretRef } from "./types.secrets-BV0ywRAy.js";
import { o as isProfileInCooldown } from "./usage-state-BQLO_Yob.js";
import { h as shortenHomePath } from "./utils-DtcDeqWS.js";
//#region src/auto-reply/reply/directive-handling.auth.ts
function resolveStoredCredentialLabel(params) {
  const masked = maskApiKey(typeof params.value === "string" ? params.value : "");
  if (masked !== "missing") return masked;
  if (coerceSecretRef(params.refValue)) return params.mode === "compact" ? "(ref)" : "ref";
  return "missing";
}
function formatExpirationLabel(expires, now, formatUntil, compactExpiredPrefix = " expired") {
  const timestampMs = asDateTimestampMs(expires);
  if (timestampMs === void 0 || timestampMs <= 0) return "";
  return timestampMs <= now ? compactExpiredPrefix : ` exp ${formatUntil(timestampMs)}`;
}
function formatFlagsSuffix(flags) {
  return flags.length > 0 ? ` (${flags.join(", ")})` : "";
}
function isStoredAuthProfileType(value) {
  return value === "api_key" || value === "oauth" || value === "token";
}
/** Resolves the displayed auth source for a provider without exposing secrets. */
const resolveAuthLabel = async (
  provider,
  cfg,
  modelsPath,
  agentDir,
  mode = "compact",
  workspaceDir,
  options,
) => {
  const formatPath = (value) => shortenHomePath(value);
  const store = ensureAuthProfileStore(agentDir, { allowKeychainPrompt: false });
  const rawOrder = resolveAuthProfileOrder({
    cfg,
    store,
    provider,
  });
  const acceptedProfileTypes = options?.acceptedProfileTypes
    ? new Set(options.acceptedProfileTypes)
    : void 0;
  const order = acceptedProfileTypes
    ? rawOrder.filter((profileId) => {
        const profile = store.profiles[profileId];
        if (profile) return acceptedProfileTypes.has(profile.type);
        const configuredMode = cfg.auth?.profiles?.[profileId]?.mode;
        return isStoredAuthProfileType(configuredMode)
          ? acceptedProfileTypes.has(configuredMode)
          : true;
      })
    : rawOrder;
  const providerKey = normalizeProviderId(provider);
  const lastGood = findNormalizedProviderValue(store.lastGood, providerKey);
  const nextProfileId = order[0];
  const now = Date.now();
  const formatUntil = (timestampMs) =>
    formatRemainingShort(timestampMs - now, { underMinuteLabel: "soon" });
  if (order.length > 0) {
    if (mode === "compact") {
      const profileId = nextProfileId;
      if (!profileId)
        return {
          label: "missing",
          source: "missing",
        };
      const profile = store.profiles[profileId];
      const configProfile = cfg.auth?.profiles?.[profileId];
      const configOnlyAwsSdk = !profile
        ? isConfiguredAwsSdkAuthProfileForProvider({
            cfg,
            provider,
            profileId,
          })
        : false;
      const more = order.length > 1 ? ` (+${order.length - 1})` : "";
      if (configOnlyAwsSdk)
        return {
          label: `${profileId} aws-sdk${more}`,
          source: "",
        };
      if (
        !profile ||
        (configProfile?.provider && configProfile.provider !== profile.provider) ||
        (configProfile?.mode &&
          configProfile.mode !== profile.type &&
          !(configProfile.mode === "oauth" && profile.type === "token"))
      )
        return {
          label: `${profileId} missing${more}`,
          source: "",
        };
      if (profile.type === "api_key")
        return {
          label: `${profileId} api-key ${resolveStoredCredentialLabel({
            value: profile.key,
            refValue: profile.keyRef,
            mode,
          })}${more}`,
          source: "",
        };
      if (profile.type === "token")
        return {
          label: `${profileId} token ${resolveStoredCredentialLabel({
            value: profile.token,
            refValue: profile.tokenRef,
            mode,
          })}${formatExpirationLabel(profile.expires, now, formatUntil)}${more}`,
          source: "",
        };
      const display = resolveAuthProfileDisplayLabel({
        cfg,
        store,
        profileId,
      });
      return {
        label: `${display === profileId ? profileId : display} oauth${formatExpirationLabel(profile.expires, now, formatUntil)}${more}`,
        source: "",
      };
    }
    return {
      label: order
        .map((profileId) => {
          const profile = store.profiles[profileId];
          const configProfile = cfg.auth?.profiles?.[profileId];
          const flags = [];
          if (profileId === nextProfileId) flags.push("next");
          if (lastGood && profileId === lastGood) flags.push("lastGood");
          if (isProfileInCooldown(store, profileId)) {
            const until = store.usageStats?.[profileId]?.cooldownUntil;
            if (typeof until === "number" && Number.isFinite(until) && until > now)
              flags.push(`cooldown ${formatUntil(until)}`);
            else flags.push("cooldown");
          }
          if (
            !profile &&
            isConfiguredAwsSdkAuthProfileForProvider({
              cfg,
              provider,
              profileId,
            })
          )
            return `${profileId}=aws-sdk${formatFlagsSuffix(flags)}`;
          if (
            !profile ||
            (configProfile?.provider && configProfile.provider !== profile.provider) ||
            (configProfile?.mode &&
              configProfile.mode !== profile.type &&
              !(configProfile.mode === "oauth" && profile.type === "token"))
          )
            return `${profileId}=missing${formatFlagsSuffix(flags)}`;
          if (profile.type === "api_key")
            return `${profileId}=${resolveStoredCredentialLabel({
              value: profile.key,
              refValue: profile.keyRef,
              mode,
            })}${formatFlagsSuffix(flags)}`;
          if (profile.type === "token") {
            const tokenLabel = resolveStoredCredentialLabel({
              value: profile.token,
              refValue: profile.tokenRef,
              mode,
            });
            const expirationFlag = formatExpirationLabel(
              profile.expires,
              now,
              formatUntil,
              "expired",
            );
            if (expirationFlag) flags.push(expirationFlag);
            return `${profileId}=token:${tokenLabel}${formatFlagsSuffix(flags)}`;
          }
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
          const expirationFlag = formatExpirationLabel(
            profile.expires,
            now,
            formatUntil,
            "expired",
          );
          if (expirationFlag) flags.push(expirationFlag);
          return `${profileId}=OAuth${suffix ? ` ${suffix}` : ""}${formatFlagsSuffix(flags)}`;
        })
        .join(", "),
      source: `auth-profiles.json: ${formatPath(resolveAuthStorePathForDisplay(agentDir))}`,
    };
  }
  const envKey = resolveEnvApiKey(provider, process.env, {
    config: cfg,
    workspaceDir,
  });
  if (envKey)
    return {
      label:
        envKey.source.includes("ANTHROPIC_OAUTH_TOKEN") ||
        normalizeLowercaseStringOrEmpty(envKey.source).includes("oauth")
          ? "OAuth (env)"
          : maskApiKey(envKey.apiKey),
      source: mode === "verbose" ? envKey.source : "",
    };
  const customKey = resolveUsableCustomProviderApiKey({
    cfg,
    provider,
  })?.apiKey;
  if (customKey)
    return {
      label: maskApiKey(customKey),
      source: mode === "verbose" ? `models.json: ${formatPath(modelsPath)}` : "",
    };
  return {
    label: "missing",
    source: "missing",
  };
};
/** Formats an auth label plus source for one-line status output. */
const formatAuthLabel = (auth) => {
  if (!auth.source || auth.source === auth.label || auth.source === "missing") return auth.label;
  return `${auth.label} (${auth.source})`;
};
//#endregion
//#region src/auto-reply/reply/directive-handling.model-picker.ts
/** Resolves optional endpoint/API labels for a provider in picker details. */
function resolveProviderEndpointLabel(provider, cfg) {
  const normalized = normalizeProviderId(provider);
  const entry = findNormalizedProviderValue(cfg.models?.providers ?? {}, normalized);
  const endpoint = normalizeOptionalString(entry?.baseUrl);
  const api = normalizeOptionalString(entry?.api);
  return {
    endpoint: endpoint || void 0,
    api: api || void 0,
  };
}
//#endregion
//#region src/auto-reply/reply/directive-handling.model.ts
function isMissingAuthLabel(auth) {
  return auth.label === "missing" && auth.source === "missing";
}
function resolveStatusHarnessRuntime(params) {
  const sessionRuntime = resolveSessionRuntimeOverrideForProvider({
    provider: params.provider,
    entry: params.sessionEntry,
    cfg: params.cfg,
  });
  if (sessionRuntime) return sessionRuntime;
  return params.defaultRuntime;
}
function resolveStatusAcceptedProfileTypes(params) {
  if (normalizeProviderId(params.provider) !== "openai" || params.harnessRuntime === "codex")
    return;
  return ["api_key"];
}
async function resolveStatusAuthLabel(params) {
  const provider = normalizeProviderId(params.provider);
  const harnessPolicy = resolveAgentHarnessPolicy({
    provider,
    modelId: params.modelId,
    config: params.cfg,
    agentId: params.activeAgentId,
  });
  const harnessRuntime = resolveStatusHarnessRuntime({
    sessionEntry: params.sessionEntry,
    defaultRuntime: harnessPolicy.runtime,
    provider,
    cfg: params.cfg,
  });
  const auth = await resolveAuthLabel(
    params.provider,
    params.cfg,
    params.modelsPath,
    params.agentDir,
    params.authMode,
    params.workspaceDir,
    {
      acceptedProfileTypes: resolveStatusAcceptedProfileTypes({
        provider,
        harnessRuntime,
      }),
    },
  );
  if (!isMissingAuthLabel(auth)) return formatAuthLabel(auth);
  const effectiveAuthProvider = buildAgentRuntimeAuthPlan({
    provider,
    config: params.cfg,
    workspaceDir: params.workspaceDir,
    harnessRuntime,
  }).harnessAuthProvider;
  if (!effectiveAuthProvider || effectiveAuthProvider === provider) return formatAuthLabel(auth);
  const runtimeAuth = await resolveAuthLabel(
    effectiveAuthProvider,
    params.cfg,
    params.modelsPath,
    params.agentDir,
    params.authMode,
    params.workspaceDir,
  );
  if (isMissingAuthLabel(runtimeAuth)) return formatAuthLabel(auth);
  return `via ${harnessRuntime} runtime / ${effectiveAuthProvider} ${formatAuthLabel(runtimeAuth)}`;
}
function pushUniqueCatalogEntry(params) {
  const provider = normalizeProviderId(params.provider);
  const id = normalizeOptionalString(params.id) ?? "";
  if (!provider || !id) return;
  const key = modelKey(provider, id);
  if (params.keys.has(key)) return;
  params.keys.add(key);
  params.out.push({
    provider,
    id,
    name: params.fallbackNameToId ? (params.name ?? id) : params.name,
  });
}
function buildModelPickerCatalog(params) {
  const resolvedDefault = resolveConfiguredModelRef({
    cfg: params.cfg,
    defaultProvider: params.defaultProvider,
    defaultModel: params.defaultModel,
  });
  const buildConfiguredCatalog = () => {
    const out = [];
    const keys = /* @__PURE__ */ new Set();
    const pushRef = (ref, name) => {
      pushUniqueCatalogEntry({
        keys,
        out,
        provider: ref.provider,
        id: ref.model,
        name,
        fallbackNameToId: true,
      });
    };
    const pushRaw = (raw) => {
      const value = normalizeOptionalString(raw) ?? "";
      if (!value) return;
      const resolved = resolveModelRefFromString({
        raw: value,
        defaultProvider: params.defaultProvider,
        aliasIndex: params.aliasIndex,
      });
      if (!resolved) return;
      pushRef(resolved.ref);
    };
    pushRef(resolvedDefault);
    const modelConfig = params.cfg.agents?.defaults?.model;
    const modelFallbacks =
      modelConfig && typeof modelConfig === "object" ? (modelConfig.fallbacks ?? []) : [];
    for (const fallback of modelFallbacks) pushRaw(fallback ?? "");
    const imageConfig = params.cfg.agents?.defaults?.imageModel;
    if (imageConfig && typeof imageConfig === "object") {
      pushRaw(imageConfig.primary);
      for (const fallback of imageConfig.fallbacks ?? []) pushRaw(fallback ?? "");
    }
    for (const raw of Object.keys(params.cfg.agents?.defaults?.models ?? {})) pushRaw(raw);
    return out;
  };
  const keys = /* @__PURE__ */ new Set();
  const out = [];
  const push = (entry) => {
    pushUniqueCatalogEntry({
      keys,
      out,
      provider: entry.provider,
      id: entry.id ?? "",
      name: entry.name,
      fallbackNameToId: false,
    });
  };
  if (!(Object.keys(params.cfg.agents?.defaults?.models ?? {}).length > 0)) {
    for (const entry of params.allowedModelCatalog)
      push({
        provider: entry.provider,
        id: entry.id ?? "",
        name: entry.name,
      });
    for (const entry of buildConfiguredCatalog()) push(entry);
    return out;
  }
  for (const entry of params.allowedModelCatalog)
    push({
      provider: entry.provider,
      id: entry.id ?? "",
      name: entry.name,
    });
  for (const raw of Object.keys(params.cfg.agents?.defaults?.models ?? {})) {
    const resolved = resolveModelRefFromString({
      raw,
      defaultProvider: params.defaultProvider,
      aliasIndex: params.aliasIndex,
    });
    if (!resolved) continue;
    push({
      provider: resolved.ref.provider,
      id: resolved.ref.model,
      name: resolved.ref.model,
    });
  }
  if (resolvedDefault.model)
    push({
      provider: resolvedDefault.provider,
      id: resolvedDefault.model,
      name: resolvedDefault.model,
    });
  return out;
}
function filterMissingAuthNestedProviderDuplicates(params) {
  const configuredKeys = new Set(
    buildConfiguredModelCatalog({ cfg: params.cfg }).map((entry) =>
      modelKey(entry.provider, entry.id),
    ),
  );
  const wrapperKeys = /* @__PURE__ */ new Set();
  for (const entry of params.entries) {
    const id = normalizeOptionalString(entry.id) ?? "";
    const slash = id.indexOf("/");
    if (slash <= 0) continue;
    const nestedProvider = normalizeProviderId(id.slice(0, slash));
    const nestedModel = normalizeOptionalString(id.slice(slash + 1)) ?? "";
    const wrapperProvider = normalizeProviderId(entry.provider);
    if (!nestedProvider || !nestedModel || nestedProvider === wrapperProvider) continue;
    wrapperKeys.add(modelKey(nestedProvider, nestedModel));
  }
  if (wrapperKeys.size === 0) return params.entries;
  return params.entries.filter((entry) => {
    const provider = normalizeProviderId(entry.provider);
    const key = modelKey(provider, normalizeOptionalString(entry.id) ?? "");
    if (configuredKeys.has(key)) return true;
    return params.authByProvider.get(provider) !== "missing" || !wrapperKeys.has(key);
  });
}
async function maybeHandleModelDirectiveInfo(params) {
  if (!params.directives.hasModelDirective) return;
  const rawDirective = normalizeOptionalString(params.directives.rawModelDirective);
  const directive = rawDirective ? normalizeLowercaseStringOrEmpty(rawDirective) : void 0;
  const wantsStatus = directive === "status";
  const wantsSummary = !rawDirective;
  const wantsLegacyList = directive === "list";
  if (!wantsSummary && !wantsStatus && !wantsLegacyList) return;
  if (params.directives.rawModelProfile)
    return { text: "Auth profile override requires a model selection." };
  const pickerCatalog = buildModelPickerCatalog({
    cfg: params.cfg,
    defaultProvider: params.defaultProvider,
    defaultModel: params.defaultModel,
    aliasIndex: params.aliasIndex,
    allowedModelCatalog: params.allowedModelCatalog,
  });
  if (wantsLegacyList)
    return (
      (await resolveModelsCommandReply({
        cfg: params.cfg,
        commandBodyNormalized: "/models",
        surface: params.surface,
        currentModel: `${params.provider}/${params.model}`,
        agentId: params.activeAgentId,
        agentDir: params.agentDir,
        workspaceDir: params.workspaceDir,
        sessionEntry: isCompleteSessionEntry(params.sessionEntry) ? params.sessionEntry : void 0,
      })) ?? { text: "No models available." }
    );
  if (wantsSummary) {
    const modelRefs = resolveSelectedAndActiveModel({
      selectedProvider: params.provider,
      selectedModel: params.model,
      sessionEntry: params.sessionEntry,
    });
    const current = modelRefs.selected.label;
    const activeRuntimeLine = modelRefs.activeDiffers
      ? `Active: ${modelRefs.active.label} (runtime)`
      : null;
    const channelData = (
      params.surface ? getChannelPlugin(params.surface) : null
    )?.commands?.buildModelBrowseChannelData?.();
    if (channelData)
      return {
        text: [
          `Current: ${current}${modelRefs.activeDiffers ? " (selected)" : ""}`,
          activeRuntimeLine,
          "",
          "Tap below to browse models, or use:",
          "/model <provider/model> to switch",
          "/model <provider/model> --runtime <runtime> to switch harnesses",
          "/model status for details",
        ]
          .filter(Boolean)
          .join("\n"),
        channelData,
      };
    return {
      text: [
        `Current: ${current}${modelRefs.activeDiffers ? " (selected)" : ""}`,
        activeRuntimeLine,
        "",
        "Switch: /model <provider/model>",
        "Runtime: /model <provider/model> --runtime <runtime>",
        "Browse: /models (providers) or /models <provider> (models)",
        "More: /model status",
      ]
        .filter(Boolean)
        .join("\n"),
    };
  }
  const modelsPath = `${params.agentDir}/models.json`;
  const formatPath = (value) => shortenHomePath(value);
  const authMode = "verbose";
  if (pickerCatalog.length === 0) return { text: "No models available." };
  const authByProvider = /* @__PURE__ */ new Map();
  for (const entry of pickerCatalog) {
    const provider = normalizeProviderId(entry.provider);
    if (authByProvider.has(provider)) continue;
    const authLabel = await resolveStatusAuthLabel({
      provider,
      modelId: entry.id,
      cfg: params.cfg,
      modelsPath,
      agentDir: params.agentDir,
      activeAgentId: params.activeAgentId,
      authMode,
      workspaceDir: params.workspaceDir,
      sessionEntry: params.sessionEntry,
    });
    authByProvider.set(provider, authLabel);
  }
  const modelRefs = resolveSelectedAndActiveModel({
    selectedProvider: params.provider,
    selectedModel: params.model,
    sessionEntry: params.sessionEntry,
  });
  const current = modelRefs.selected.label;
  const defaultLabel = `${params.defaultProvider}/${params.defaultModel}`;
  const lines = [
    `Current: ${current}${modelRefs.activeDiffers ? " (selected)" : ""}`,
    modelRefs.activeDiffers ? `Active: ${modelRefs.active.label} (runtime)` : null,
    `Default: ${defaultLabel}`,
    `Agent: ${params.activeAgentId}`,
    `Auth file: ${formatPath(resolveAuthStorePathForDisplay(params.agentDir))}`,
  ].filter((line) => Boolean(line));
  if (params.resetModelOverride) lines.push(`(previous selection reset to default)`);
  const byProvider = /* @__PURE__ */ new Map();
  const statusCatalog = filterMissingAuthNestedProviderDuplicates({
    cfg: params.cfg,
    entries: pickerCatalog,
    authByProvider,
  });
  for (const entry of statusCatalog) {
    const provider = normalizeProviderId(entry.provider);
    const models = byProvider.get(provider);
    if (models) {
      models.push(entry);
      continue;
    }
    byProvider.set(provider, [entry]);
  }
  for (const provider of byProvider.keys()) {
    const models = byProvider.get(provider);
    if (!models) continue;
    const authLabel = authByProvider.get(provider) ?? "missing";
    const endpoint = resolveProviderEndpointLabel(provider, params.cfg);
    const endpointSuffix = endpoint.endpoint
      ? ` endpoint: ${endpoint.endpoint}`
      : " endpoint: default";
    const apiSuffix = endpoint.api ? ` api: ${endpoint.api}` : "";
    lines.push("");
    lines.push(`[${provider}]${endpointSuffix}${apiSuffix} auth: ${authLabel}`);
    for (const entry of models) {
      const label = `${provider}/${entry.id}`;
      const aliases = params.aliasIndex.byKey.get(label);
      const aliasSuffix = aliases && aliases.length > 0 ? ` (${aliases.join(", ")})` : "";
      lines.push(`  • ${label}${aliasSuffix}`);
    }
  }
  return { text: lines.join("\n") };
}
function isCompleteSessionEntry(entry) {
  return Boolean(
    entry && typeof entry.sessionId === "string" && typeof entry.updatedAt === "number",
  );
}
//#endregion
//#region src/auto-reply/reply/directive-handling.queue-validation.ts
/** Validates `/queue` directives and returns immediate status/error replies. */
function maybeHandleQueueDirective(params) {
  const { directives } = params;
  if (!directives.hasQueueDirective) return;
  if (
    !directives.queueMode &&
    !directives.queueReset &&
    !directives.hasQueueOptions &&
    directives.rawQueueMode === void 0 &&
    directives.rawDebounce === void 0 &&
    directives.rawCap === void 0 &&
    directives.rawDrop === void 0
  ) {
    const settings = resolveQueueSettings({
      cfg: params.cfg,
      channel: params.channel,
      sessionEntry: params.sessionEntry,
    });
    const debounceLabel =
      typeof settings.debounceMs === "number" ? `${settings.debounceMs}ms` : "default";
    const capLabel = typeof settings.cap === "number" ? String(settings.cap) : "default";
    const dropLabel = settings.dropPolicy ?? "default";
    return {
      text: withOptions(
        `Current queue settings: mode=${settings.mode}, debounce=${debounceLabel}, cap=${capLabel}, drop=${dropLabel}.`,
        "modes steer, followup, collect, interrupt; debounce:<ms|s|m>, cap:<n>, drop:old|new|summarize",
      ),
    };
  }
  const queueModeInvalid =
    !directives.queueMode && !directives.queueReset && Boolean(directives.rawQueueMode);
  const queueDebounceInvalid =
    directives.rawDebounce !== void 0 && typeof directives.debounceMs !== "number";
  const queueCapInvalid = directives.rawCap !== void 0 && typeof directives.cap !== "number";
  const queueDropInvalid = directives.rawDrop !== void 0 && !directives.dropPolicy;
  if (queueModeInvalid || queueDebounceInvalid || queueCapInvalid || queueDropInvalid) {
    const errors = [];
    if (queueModeInvalid)
      errors.push(
        `Unrecognized queue mode "${directives.rawQueueMode ?? ""}". Valid modes: steer, followup, collect, interrupt.`,
      );
    if (queueDebounceInvalid)
      errors.push(
        `Invalid debounce "${directives.rawDebounce ?? ""}". Use ms/s/m (e.g. debounce:1500ms, debounce:2s).`,
      );
    if (queueCapInvalid)
      errors.push(
        `Invalid cap "${directives.rawCap ?? ""}". Use a positive integer (e.g. cap:10).`,
      );
    if (queueDropInvalid)
      errors.push(
        `Invalid drop policy "${directives.rawDrop ?? ""}". Use drop:old, drop:new, or drop:summarize.`,
      );
    return { text: errors.join(" ") };
  }
}
//#endregion
//#region src/auto-reply/reply/directive-handling.impl.ts
/** Applies directive-only command state changes without running the agent. */
/** Handles inline directives that can be acknowledged without a model turn. */
async function handleDirectiveOnly(params) {
  const {
    directives,
    sessionEntry,
    sessionStore,
    sessionKey,
    storePath,
    elevatedEnabled,
    elevatedAllowed,
    defaultProvider,
    defaultModel,
    aliasIndex,
    allowedModelKeys,
    allowedModelCatalog,
    resetModelOverride,
    provider,
    model,
    initialModelLabel,
    formatModelSwitchEvent,
    currentThinkLevel,
    currentFastMode,
    currentVerboseLevel,
    currentReasoningLevel,
    currentElevatedLevel,
  } = params;
  const delegatedTraceAllowed = (params.gatewayClientScopes ?? []).includes("operator.admin");
  if (directives.hasTraceDirective && !params.senderIsOwner && !delegatedTraceAllowed)
    return {
      text: "❌ /trace is restricted to owners and gateway clients with operator.admin scope.",
    };
  const activeAgentId = resolveSessionAgentId({
    sessionKey: params.sessionKey,
    config: params.cfg,
  });
  const agentDir = resolveAgentDir(params.cfg, activeAgentId);
  const runtimePolicySessionKey = resolveRuntimePolicySessionKey({
    cfg: params.cfg,
    ctx: params.ctx,
    sessionKey: params.sessionKey,
  });
  const runtimeIsSandboxed = resolveSandboxRuntimeStatus({
    cfg: params.cfg,
    sessionKey: runtimePolicySessionKey,
  }).sandboxed;
  const shouldHintDirectRuntime = directives.hasElevatedDirective && !runtimeIsSandboxed;
  const allowInternalExecPersistence = canPersistSessionDirectiveDefaults({
    messageProvider: params.messageProvider,
    surface: params.surface,
    gatewayClientScopes: params.gatewayClientScopes,
    commandAuthorized: params.commandAuthorized,
    senderIsOwner: params.senderIsOwner,
  });
  const allowInternalVerbosePersistence = canPersistSessionDirectiveDefaults({
    messageProvider: params.messageProvider,
    surface: params.surface,
    gatewayClientScopes: params.gatewayClientScopes,
    commandAuthorized: params.commandAuthorized,
    senderIsOwner: params.senderIsOwner,
  });
  const modelInfo = await maybeHandleModelDirectiveInfo({
    directives,
    cfg: params.cfg,
    agentDir,
    activeAgentId,
    provider,
    model,
    defaultProvider,
    defaultModel,
    aliasIndex,
    allowedModelCatalog,
    resetModelOverride,
    workspaceDir: params.workspaceDir,
    surface: params.surface,
    sessionEntry,
  });
  if (modelInfo) return modelInfo;
  const modelResolution = resolveModelSelectionFromDirective({
    directives,
    cfg: params.cfg,
    agentDir,
    defaultProvider,
    defaultModel,
    aliasIndex,
    allowedModelKeys,
    allowedModelCatalog,
    provider,
  });
  if (modelResolution.errorText) return { text: modelResolution.errorText };
  const modelSelection = modelResolution.modelSelection;
  const profileOverride = modelResolution.profileOverride;
  if (modelSelection && isModelSelectionLocked(sessionEntry))
    return { text: MODEL_SELECTION_LOCKED_MESSAGE };
  const resolvedProvider = modelSelection?.provider ?? provider;
  const resolvedModel = modelSelection?.model ?? model;
  const modelRuntimeResolution = modelSelection
    ? resolveModelRuntimeDirective({
        rawRuntime: directives.rawModelRuntime,
        provider: resolvedProvider,
        cfg: params.cfg,
        sessionEntry,
      })
    : { kind: "unchanged" };
  if (modelRuntimeResolution.kind === "invalid") return { text: modelRuntimeResolution.errorText };
  const prospectiveSessionEntry = { ...sessionEntry };
  applyModelRuntimeDirective(prospectiveSessionEntry, modelRuntimeResolution);
  const thinkingRuntime = resolveEffectiveAgentRuntime({
    cfg: params.cfg,
    provider: resolvedProvider,
    modelId: resolvedModel,
    agentId: activeAgentId,
    sessionKey: runtimePolicySessionKey,
    sessionEntry: prospectiveSessionEntry,
  });
  const thinkingCatalog =
    params.thinkingCatalog && params.thinkingCatalog.length > 0
      ? params.thinkingCatalog
      : allowedModelCatalog.length > 0
        ? allowedModelCatalog
        : void 0;
  const fastModeState = resolveFastModeState({
    cfg: params.cfg,
    provider: resolvedProvider,
    model: resolvedModel,
    agentId: activeAgentId,
    sessionEntry: directives.clearFastMode ? void 0 : sessionEntry,
  });
  const effectiveFastMode =
    directives.fastMode ??
    (directives.clearFastMode ? fastModeState.mode : currentFastMode) ??
    fastModeState.mode;
  const effectiveFastModeSource = directives.fastMode !== void 0 ? "session" : fastModeState.source;
  if (directives.hasThinkDirective && !directives.thinkLevel && !directives.clearThinkLevel) {
    if (!directives.rawThinkLevel)
      return {
        text: withOptions(
          `Current thinking level: ${resolveSupportedThinkingLevel({
            provider: resolvedProvider,
            model: resolvedModel,
            level: currentThinkLevel ?? "off",
            catalog: thinkingCatalog,
            agentRuntime: thinkingRuntime,
          })}.`,
          `default, ${formatThinkingLevels(resolvedProvider, resolvedModel, ", ", thinkingCatalog, thinkingRuntime)}`,
        ),
      };
    return {
      text: `Unrecognized thinking level "${directives.rawThinkLevel}". Valid levels: default, ${formatThinkingLevels(resolvedProvider, resolvedModel, ", ", thinkingCatalog, thinkingRuntime)}.`,
    };
  }
  if (directives.hasVerboseDirective && !directives.verboseLevel) {
    if (!directives.rawVerboseLevel)
      return {
        text: withOptions(
          `Current verbose level: ${currentVerboseLevel ?? "off"}.`,
          "on, full, off",
        ),
      };
    return {
      text: `Unrecognized verbose level "${directives.rawVerboseLevel}". Valid levels: off, on, full.`,
    };
  }
  if (directives.hasTraceDirective && !directives.traceLevel) {
    if (!directives.rawTraceLevel)
      return {
        text: withOptions(
          `Current trace level: ${sessionEntry.traceLevel ?? "off"}.`,
          "on, off, raw",
        ),
      };
    return {
      text: `Unrecognized trace level "${directives.rawTraceLevel}". Valid levels: off, on, raw.`,
    };
  }
  if (directives.hasFastDirective && directives.fastMode === void 0 && !directives.clearFastMode) {
    if (
      !directives.rawFastMode ||
      normalizeLowercaseStringOrEmpty(directives.rawFastMode) === "status"
    ) {
      const statusText = formatFastModeCurrentStatus({
        mode: effectiveFastMode,
        source: effectiveFastModeSource,
        fastAutoOnSeconds: fastModeState.fastAutoOnSeconds,
      });
      if (normalizeLowercaseStringOrEmpty(directives.rawFastMode) === "status")
        return { text: statusText };
      return {
        text: withOptions(
          statusText,
          formatFastModeCommandOptions({ fastAutoOnSeconds: fastModeState.fastAutoOnSeconds }),
        ),
      };
    }
    return {
      text: `Unrecognized fast mode "${directives.rawFastMode}". Valid levels: on, off, auto, default, status.`,
    };
  }
  if (directives.hasReasoningDirective && !directives.reasoningLevel) {
    if (!directives.rawReasoningLevel)
      return {
        text: withOptions(
          `Current reasoning level: ${currentReasoningLevel ?? "off"}.`,
          "on, off, stream",
        ),
      };
    return {
      text: `Unrecognized reasoning level "${directives.rawReasoningLevel}". Valid levels: on, off, stream.`,
    };
  }
  if (directives.hasElevatedDirective && !directives.elevatedLevel) {
    if (!directives.rawElevatedLevel) {
      if (!elevatedEnabled || !elevatedAllowed)
        return {
          text: formatElevatedUnavailableText({
            runtimeSandboxed: runtimeIsSandboxed,
            failures: params.elevatedFailures,
            sessionKey: params.sessionKey,
          }),
        };
      return {
        text: [
          withOptions(
            `Current elevated level: ${currentElevatedLevel ?? "off"}.`,
            "on, off, ask, full",
          ),
          shouldHintDirectRuntime ? formatElevatedRuntimeHint() : null,
        ]
          .filter(Boolean)
          .join("\n"),
      };
    }
    return {
      text: `Unrecognized elevated level "${directives.rawElevatedLevel}". Valid levels: off, on, ask, full.`,
    };
  }
  if (directives.hasElevatedDirective && (!elevatedEnabled || !elevatedAllowed))
    return {
      text: formatElevatedUnavailableText({
        runtimeSandboxed: runtimeIsSandboxed,
        failures: params.elevatedFailures,
        sessionKey: params.sessionKey,
      }),
    };
  if (directives.hasExecDirective) {
    if (directives.invalidExecHost)
      return {
        text: `Unrecognized exec host "${directives.rawExecHost ?? ""}". Valid hosts: auto, sandbox, gateway, node.`,
      };
    if (directives.invalidExecSecurity)
      return {
        text: `Unrecognized exec security "${directives.rawExecSecurity ?? ""}". Valid: deny, allowlist, full.`,
      };
    if (directives.invalidExecAsk)
      return {
        text: `Unrecognized exec ask "${directives.rawExecAsk ?? ""}". Valid: off, on-miss, always.`,
      };
    if (directives.invalidExecNode) return { text: "Exec node requires a value." };
    if (!directives.hasExecOptions) {
      const execDefaults = resolveExecDefaults({
        cfg: params.cfg,
        sessionEntry,
        agentId: activeAgentId,
        sandboxAvailable: runtimeIsSandboxed,
      });
      const nodeLabel = execDefaults.node ? `node=${execDefaults.node}` : "node=(unset)";
      return {
        text: withOptions(
          `Current exec defaults: host=${renderExecTargetLabel(execDefaults.host)}, effective=${execDefaults.effectiveHost}, security=${execDefaults.security}, ask=${execDefaults.ask}, ${nodeLabel}.`,
          "host=auto|sandbox|gateway|node, security=deny|allowlist|full, ask=off|on-miss|always, node=<id>",
        ),
      };
    }
  }
  const queueAck = maybeHandleQueueDirective({
    directives,
    cfg: params.cfg,
    channel: provider,
    sessionEntry,
  });
  if (queueAck) return queueAck;
  if (
    directives.hasThinkDirective &&
    directives.thinkLevel &&
    !isThinkingLevelSupported({
      provider: resolvedProvider,
      model: resolvedModel,
      level: directives.thinkLevel,
      catalog: thinkingCatalog,
      agentRuntime: thinkingRuntime,
    })
  )
    return {
      text: `Thinking level "${directives.thinkLevel}" is not supported for ${resolvedProvider}/${resolvedModel}. Use one of: ${formatThinkingLevels(resolvedProvider, resolvedModel, ", ", thinkingCatalog, thinkingRuntime)}.`,
    };
  const resolvedDirectiveThinkLevel = directives.thinkLevel;
  const nextThinkLevel = directives.hasThinkDirective
    ? resolvedDirectiveThinkLevel
    : (sessionEntry?.thinkingLevel ?? currentThinkLevel);
  const remappedUnsupportedThinkLevel =
    !directives.hasThinkDirective &&
    nextThinkLevel &&
    !isThinkingLevelSupported({
      provider: resolvedProvider,
      model: resolvedModel,
      level: nextThinkLevel,
      catalog: thinkingCatalog,
      agentRuntime: thinkingRuntime,
    })
      ? resolveSupportedThinkingLevel({
          provider: resolvedProvider,
          model: resolvedModel,
          level: nextThinkLevel,
          catalog: thinkingCatalog,
          agentRuntime: thinkingRuntime,
        })
      : void 0;
  const shouldRemapUnsupportedThinkLevel =
    Boolean(remappedUnsupportedThinkLevel) && remappedUnsupportedThinkLevel !== nextThinkLevel;
  const prevElevatedLevel =
    currentElevatedLevel ?? sessionEntry.elevatedLevel ?? (elevatedAllowed ? "on" : "off");
  const prevReasoningLevel = currentReasoningLevel ?? sessionEntry.reasoningLevel ?? "off";
  let elevatedChanged =
    directives.hasElevatedDirective &&
    directives.elevatedLevel !== void 0 &&
    elevatedEnabled &&
    elevatedAllowed;
  let modelSelectionUpdated = false;
  let modelSelectionApplied = true;
  let sessionChangesApplied = true;
  let appliedSessionEntry = sessionEntry;
  const touchedSessionFields = resolveDirectiveTouchedSessionFields({
    directives,
    allowInternalExecPersistence,
    allowInternalVerbosePersistence,
  });
  if (shouldRemapUnsupportedThinkLevel && !touchedSessionFields.includes("thinkingLevel"))
    touchedSessionFields.push("thinkingLevel");
  const shouldPersistSessionEntry =
    (directives.hasThinkDirective &&
      (Boolean(directives.thinkLevel) || directives.clearThinkLevel)) ||
    (directives.hasFastDirective && (directives.fastMode !== void 0 || directives.clearFastMode)) ||
    (directives.hasVerboseDirective &&
      Boolean(directives.verboseLevel) &&
      allowInternalVerbosePersistence) ||
    (directives.hasTraceDirective && Boolean(directives.traceLevel)) ||
    (directives.hasReasoningDirective && Boolean(directives.reasoningLevel)) ||
    (directives.hasElevatedDirective && Boolean(directives.elevatedLevel)) ||
    (directives.hasExecDirective && directives.hasExecOptions && allowInternalExecPersistence) ||
    Boolean(modelSelection) ||
    directives.hasQueueDirective ||
    shouldRemapUnsupportedThinkLevel;
  const fastModeChanged =
    (directives.hasFastDirective &&
      directives.fastMode !== void 0 &&
      directives.fastMode !== currentFastMode) ||
    (directives.clearFastMode && currentFastMode !== fastModeState.mode);
  let reasoningChanged = directives.hasReasoningDirective && directives.reasoningLevel !== void 0;
  if (shouldPersistSessionEntry) {
    const initialSessionEntry = { ...sessionEntry };
    if (directives.clearThinkLevel) delete sessionEntry.thinkingLevel;
    else if (directives.hasThinkDirective && directives.thinkLevel && resolvedDirectiveThinkLevel)
      sessionEntry.thinkingLevel = resolvedDirectiveThinkLevel;
    if (directives.clearFastMode) delete sessionEntry.fastMode;
    else if (directives.hasFastDirective && directives.fastMode !== void 0)
      sessionEntry.fastMode = directives.fastMode;
    if (shouldRemapUnsupportedThinkLevel && remappedUnsupportedThinkLevel)
      sessionEntry.thinkingLevel = remappedUnsupportedThinkLevel;
    if (
      directives.hasVerboseDirective &&
      directives.verboseLevel &&
      allowInternalVerbosePersistence
    )
      applyVerboseOverride(sessionEntry, directives.verboseLevel);
    if (directives.hasTraceDirective && directives.traceLevel)
      applyTraceOverride(sessionEntry, directives.traceLevel);
    if (directives.hasReasoningDirective && directives.reasoningLevel) {
      if (directives.reasoningLevel === "off") sessionEntry.reasoningLevel = "off";
      else sessionEntry.reasoningLevel = directives.reasoningLevel;
      reasoningChanged =
        directives.reasoningLevel !== prevReasoningLevel && directives.reasoningLevel !== void 0;
    }
    if (directives.hasElevatedDirective && directives.elevatedLevel) {
      sessionEntry.elevatedLevel = directives.elevatedLevel;
      elevatedChanged =
        elevatedChanged ||
        (directives.elevatedLevel !== prevElevatedLevel && directives.elevatedLevel !== void 0);
    }
    if (directives.hasExecDirective && directives.hasExecOptions && allowInternalExecPersistence) {
      if (directives.execHost) sessionEntry.execHost = directives.execHost;
      if (directives.execSecurity) sessionEntry.execSecurity = directives.execSecurity;
      if (directives.execAsk) sessionEntry.execAsk = directives.execAsk;
      if (directives.execNode) sessionEntry.execNode = directives.execNode;
    }
    if (modelSelection) {
      const applied = applyModelOverrideToSessionEntry({
        entry: sessionEntry,
        selection: modelSelection,
        profileOverride,
        markLiveSwitchPending: true,
      });
      const appliedRuntime = applyModelRuntimeDirective(sessionEntry, modelRuntimeResolution);
      modelSelectionUpdated = applied.updated || appliedRuntime.updated;
    }
    if (directives.hasQueueDirective && directives.queueReset) {
      delete sessionEntry.queueMode;
      delete sessionEntry.queueDebounceMs;
      delete sessionEntry.queueCap;
      delete sessionEntry.queueDrop;
    } else if (directives.hasQueueDirective) {
      if (directives.queueMode) sessionEntry.queueMode = directives.queueMode;
      if (typeof directives.debounceMs === "number")
        sessionEntry.queueDebounceMs = directives.debounceMs;
      if (typeof directives.cap === "number") sessionEntry.queueCap = directives.cap;
      if (directives.dropPolicy) sessionEntry.queueDrop = directives.dropPolicy;
    }
    sessionEntry.updatedAt = Date.now();
    sessionStore[sessionKey] = sessionEntry;
    if (storePath) {
      const persistence = await persistReplySessionEntry({
        storePath,
        sessionKey,
        initialEntry: initialSessionEntry,
        entry: sessionEntry,
        reassertLiveModelSwitchPending:
          modelSelectionUpdated && sessionEntry.liveModelSwitchPending === true,
        touchedFields: touchedSessionFields,
      });
      if (persistence.status === "current") {
        const persistedEntry = persistence.entry;
        sessionStore[sessionKey] = persistedEntry;
        sessionChangesApplied = sessionSnapshotChangesApplied({
          initial: initialSessionEntry,
          next: sessionEntry,
          current: persistedEntry,
          touchedFields: touchedSessionFields,
        });
        if (modelSelection)
          modelSelectionApplied =
            sessionChangesApplied &&
            sessionModelOverrideChangesApplied({
              initial: initialSessionEntry,
              next: sessionEntry,
              current: persistedEntry,
              reassertLiveModelSwitchPending:
                modelSelectionUpdated && sessionEntry.liveModelSwitchPending === true,
            });
        adoptPersistedSessionSnapshot(sessionEntry, persistedEntry);
        appliedSessionEntry = sessionEntry;
      } else {
        if (persistence.entry) sessionStore[sessionKey] = persistence.entry;
        sessionChangesApplied = false;
        if (modelSelection) modelSelectionApplied = false;
      }
    }
    if (modelSelection && !modelSelectionApplied) sessionChangesApplied = false;
    if (!sessionChangesApplied) {
      if (params.persistenceState) params.persistenceState.sessionChangesApplied = false;
      return {
        text: modelSelection
          ? "Model change was not applied because the session changed. Retry."
          : "Session settings were not applied because the session changed. Retry.",
      };
    }
    if (modelSelection && modelSelectionUpdated && modelSelectionApplied && sessionKey) {
      triggerSessionPatchHook({
        cfg: params.cfg,
        sessionEntry: appliedSessionEntry,
        sessionKey,
        patch: {
          key: sessionKey,
          model:
            directives.rawModelDirective ?? `${modelSelection.provider}/${modelSelection.model}`,
        },
      });
      refreshQueuedFollowupSession({
        key: sessionKey,
        nextProvider: modelSelection.provider,
        nextModel: modelSelection.model,
        nextModelOverrideSource: "user",
        nextAuthProfileId: appliedSessionEntry.authProfileOverride,
        nextAuthProfileIdSource: appliedSessionEntry.authProfileOverrideSource,
        nextThinking: {
          level: appliedSessionEntry.thinkingLevel,
          catalog: thinkingCatalog,
          agentRuntime: resolveEffectiveAgentRuntime({
            cfg: params.cfg,
            provider: modelSelection.provider,
            modelId: modelSelection.model,
            agentId: activeAgentId,
            sessionKey: runtimePolicySessionKey,
            sessionEntry: appliedSessionEntry,
          }),
        },
      });
    }
  }
  if (modelSelection && modelSelectionApplied) {
    const nextLabel = `${modelSelection.provider}/${modelSelection.model}`;
    if (nextLabel !== initialModelLabel)
      enqueueSystemEvent(formatModelSwitchEvent(nextLabel, modelSelection.alias), {
        sessionKey,
        contextKey: `model:${nextLabel}`,
      });
  }
  enqueueModeSwitchEvents({
    enqueueSystemEvent,
    sessionEntry: appliedSessionEntry,
    sessionKey,
    elevatedChanged,
    reasoningChanged,
  });
  const parts = [];
  if (directives.clearThinkLevel) parts.push("Thinking level reset to default.");
  else if (directives.hasThinkDirective && directives.thinkLevel) {
    const displayedThinkLevel = resolvedDirectiveThinkLevel ?? directives.thinkLevel;
    parts.push(
      displayedThinkLevel === "off"
        ? "Thinking disabled."
        : `Thinking level set to ${displayedThinkLevel}.`,
    );
    if (directives.thinkLevel === "max" && displayedThinkLevel !== "max")
      parts.push(
        `max not supported for ${resolvedProvider}/${resolvedModel}; using ${displayedThinkLevel}.`,
      );
  }
  if (directives.clearFastMode) parts.push(formatDirectiveAck("Fast mode reset to default."));
  else if (directives.hasFastDirective && directives.fastMode !== void 0)
    parts.push(
      directives.fastMode === "auto"
        ? formatDirectiveAck("Fast mode set to auto.")
        : directives.fastMode
          ? formatDirectiveAck("Fast mode enabled.")
          : formatDirectiveAck("Fast mode disabled."),
    );
  if (directives.hasVerboseDirective && directives.verboseLevel)
    parts.push(
      !allowInternalVerbosePersistence
        ? formatDirectiveAck(formatInternalVerboseCurrentReplyOnlyText())
        : directives.verboseLevel === "off"
          ? formatDirectiveAck("Verbose logging disabled.")
          : directives.verboseLevel === "full"
            ? formatDirectiveAck("Verbose logging set to full.")
            : formatDirectiveAck("Verbose logging enabled."),
    );
  if (directives.hasTraceDirective && directives.traceLevel)
    parts.push(
      directives.traceLevel === "off"
        ? formatDirectiveAck("Trace disabled.")
        : directives.traceLevel === "raw"
          ? formatDirectiveAck(
              "Trace set to raw. Warning: trace output may contain sensitive information.",
            )
          : formatDirectiveAck(
              "Trace enabled. Warning: trace output may contain sensitive information.",
            ),
    );
  if (directives.hasVerboseDirective && directives.verboseLevel && !allowInternalVerbosePersistence)
    parts.push(formatDirectiveAck(formatInternalVerbosePersistenceDeniedText()));
  if (directives.hasReasoningDirective && directives.reasoningLevel)
    parts.push(
      directives.reasoningLevel === "off"
        ? formatDirectiveAck("Reasoning visibility disabled.")
        : directives.reasoningLevel === "stream"
          ? formatDirectiveAck("Reasoning stream enabled.")
          : formatDirectiveAck("Reasoning visibility enabled."),
    );
  if (directives.hasElevatedDirective && directives.elevatedLevel) {
    parts.push(
      directives.elevatedLevel === "off"
        ? formatDirectiveAck("Elevated mode disabled.")
        : directives.elevatedLevel === "full"
          ? formatDirectiveAck("Elevated mode set to full (auto-approve).")
          : formatDirectiveAck("Elevated mode set to ask (approvals may still apply)."),
    );
    if (shouldHintDirectRuntime) parts.push(formatElevatedRuntimeHint());
  }
  if (directives.hasExecDirective && directives.hasExecOptions && allowInternalExecPersistence) {
    const execParts = [];
    if (directives.execHost) execParts.push(`host=${directives.execHost}`);
    if (directives.execSecurity) execParts.push(`security=${directives.execSecurity}`);
    if (directives.execAsk) execParts.push(`ask=${directives.execAsk}`);
    if (directives.execNode) execParts.push(`node=${directives.execNode}`);
    if (execParts.length > 0)
      parts.push(formatDirectiveAck(`Exec defaults set (${execParts.join(", ")}).`));
  }
  if (directives.hasExecDirective && directives.hasExecOptions && !allowInternalExecPersistence)
    parts.push(formatDirectiveAck(formatInternalExecPersistenceDeniedText()));
  if (
    !directives.hasThinkDirective &&
    shouldRemapUnsupportedThinkLevel &&
    remappedUnsupportedThinkLevel
  )
    parts.push(
      `Thinking level set to ${remappedUnsupportedThinkLevel} (${nextThinkLevel} not supported for ${resolvedProvider}/${resolvedModel}).`,
    );
  if (modelSelection && modelSelectionApplied) {
    const label = `${modelSelection.provider}/${modelSelection.model}`;
    const labelWithAlias = modelSelection.alias ? `${modelSelection.alias} (${label})` : label;
    parts.push(
      modelSelection.isDefault
        ? `Model reset to default (${labelWithAlias}).`
        : `Model set to ${labelWithAlias} for this session.`,
    );
    if (profileOverride) parts.push(`Auth profile set to ${profileOverride}.`);
    if (modelRuntimeResolution.kind === "clear") parts.push("Runtime reset to configured policy.");
    else if (modelRuntimeResolution.kind === "set")
      parts.push(`Runtime set to ${modelRuntimeResolution.runtime} for this session.`);
  } else if (modelSelection)
    parts.push("Model change was not applied because the session changed. Retry.");
  if (directives.hasQueueDirective && directives.queueMode)
    parts.push(formatDirectiveAck(`Queue mode set to ${directives.queueMode}.`));
  else if (directives.hasQueueDirective && directives.queueReset)
    parts.push(formatDirectiveAck("Queue mode reset to default."));
  if (directives.hasQueueDirective && typeof directives.debounceMs === "number")
    parts.push(formatDirectiveAck(`Queue debounce set to ${directives.debounceMs}ms.`));
  if (directives.hasQueueDirective && typeof directives.cap === "number")
    parts.push(formatDirectiveAck(`Queue cap set to ${directives.cap}.`));
  if (directives.hasQueueDirective && directives.dropPolicy)
    parts.push(formatDirectiveAck(`Queue drop set to ${directives.dropPolicy}.`));
  if (fastModeChanged) {
    const nextFastMode = directives.clearFastMode ? fastModeState.mode : sessionEntry.fastMode;
    enqueueSystemEvent(
      nextFastMode === "auto"
        ? "Fast mode set to auto."
        : `Fast mode ${nextFastMode ? "enabled" : "disabled"}.`,
      {
        sessionKey,
        contextKey: `fast:${formatFastModeValue(nextFastMode)}`,
      },
    );
  }
  const ack = parts.join(" ").trim();
  if (!ack && directives.hasStatusDirective) return;
  return { text: ack || "OK." };
}
//#endregion
export { handleDirectiveOnly as t };
