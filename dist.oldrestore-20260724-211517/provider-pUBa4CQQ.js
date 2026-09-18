import {
  d as readCodexPluginConfig,
  f as resolveCodexAppServerRuntimeOptions,
} from "./config-C1imjxk6.js";
import { t as expectDefined } from "./expect-runtime--WgnKYXT.js";
import { r as resolvePluginConfigObject } from "./plugin-config-runtime-ef53THzv.js";
import "./core-V3U0lOIj.js";
import "./provider-model-shared-CYlCpWlu.js";
import { r as resolveCodexSystemPromptContribution } from "./prompt-overlay-CFucGBor.js";
import {
  a as buildCodexModelDefinition,
  i as FALLBACK_CODEX_MODELS,
  n as CODEX_BASE_URL,
  o as buildCodexProviderConfig,
  r as CODEX_PROVIDER_ID,
  t as CODEX_APP_SERVER_AUTH_MARKER,
} from "./provider-catalog-DRyb6wGF.js";
import { a as normalizeModelCompat } from "./provider-model-compat-oht7fX8H.js";
import { t as buildCodexAppServerUsageSnapshot } from "./rate-limits-CGMwC7L1.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
//#region extensions/codex/provider.ts
/**
 * Codex provider plugin and live app-server model catalog discovery.
 */
const DEFAULT_DISCOVERY_TIMEOUT_MS = 2500;
const LIVE_DISCOVERY_ENV = "OPENCLAW_CODEX_DISCOVERY_LIVE";
const MODEL_DISCOVERY_PAGE_LIMIT = 100;
const CODEX_APP_SERVER_SETUP_METHOD_ID = "app-server";
const CODEX_DEFAULT_MODEL_REF = `${CODEX_PROVIDER_ID}/${expectDefined(FALLBACK_CODEX_MODELS[0], "Codex fallback model catalog must not be empty").id}`;
const codexCatalogLog = createSubsystemLogger("codex/catalog");
const CODEX_REASONING_EFFORTS = ["minimal", "low", "medium", "high", "xhigh", "max", "ultra"];
const GPT_56_MAX_REASONING_EFFORTS = ["low", "medium", "high", "xhigh", "max"];
const GPT_56_ULTRA_REASONING_EFFORTS = [...GPT_56_MAX_REASONING_EFFORTS, "ultra"];
const GPT_56_ULTRA_MODEL_IDS = /* @__PURE__ */ new Set(["gpt-5.6-sol", "gpt-5.6-terra"]);
const GPT_56_MAX_MODEL_IDS = /* @__PURE__ */ new Set([...GPT_56_ULTRA_MODEL_IDS, "gpt-5.6-luna"]);
const GPT_56_DEFAULT_REASONING_EFFORTS = /* @__PURE__ */ new Map([
  ["gpt-5.6-sol", "low"],
  ["gpt-5.6-terra", "medium"],
  ["gpt-5.6-luna", "medium"],
]);
const GPT_5_PRO_REASONING_EFFORTS = ["medium", "high", "xhigh"];
/**
 * Builds the Codex provider plugin, including setup metadata, catalog discovery,
 * dynamic model resolution, and prompt/thinking hooks.
 */
function buildCodexProvider(options = {}) {
  return {
    id: CODEX_PROVIDER_ID,
    label: "Codex",
    docsPath: "/providers/models",
    auth: [
      {
        id: CODEX_APP_SERVER_SETUP_METHOD_ID,
        label: "Codex app-server",
        hint: "Use the Codex app-server runtime and managed model catalog.",
        kind: "custom",
        wizard: {
          choiceId: CODEX_PROVIDER_ID,
          choiceLabel: "Codex app-server",
          choiceHint: "Use the Codex app-server runtime and managed model catalog.",
          assistantPriority: -40,
          groupId: CODEX_PROVIDER_ID,
          groupLabel: "Codex",
          groupHint: "Codex app-server model provider",
          onboardingScopes: ["text-inference"],
        },
        run: async () => ({
          profiles: [],
          defaultModel: CODEX_DEFAULT_MODEL_REF,
        }),
      },
    ],
    catalog: {
      order: "late",
      run: async (ctx) => {
        const pluginConfig =
          resolvePluginConfigObject(ctx.config, "codex") ??
          (ctx.config ? void 0 : options.pluginConfig);
        return await buildCodexProviderCatalog({
          env: ctx.env,
          pluginConfig,
          listModels: options.listModels,
        });
      },
    },
    staticCatalog: {
      order: "late",
      run: async () => ({ provider: buildCodexProviderConfig(FALLBACK_CODEX_MODELS) }),
    },
    resolveDynamicModel: (ctx) => resolveCodexDynamicModel(ctx.modelId),
    resolveSyntheticAuth: () => ({
      apiKey: CODEX_APP_SERVER_AUTH_MARKER,
      source: "codex-app-server",
      mode: "token",
    }),
    fetchUsageSnapshot: async (ctx) => {
      if (ctx.token !== "codex-app-server") return null;
      const appServer = resolveCodexAppServerRuntimeOptions({
        pluginConfig:
          resolvePluginConfigObject(ctx.config, "codex") ??
          (ctx.config ? void 0 : options.pluginConfig),
      });
      const usage = await (options.readUsage ?? requestCodexAppServerUsageLazy)({
        timeoutMs: ctx.timeoutMs,
        agentDir: ctx.agentDir,
        ...(ctx.authProfileId ? { authProfileId: ctx.authProfileId } : {}),
        config: ctx.config,
        startOptions: appServer.start,
      });
      const snapshot = buildCodexAppServerUsageSnapshot(usage.rateLimits);
      const accountEmail = ctx.email ?? usage.accountEmail;
      return accountEmail && !snapshot.error
        ? {
            ...snapshot,
            accountEmail,
          }
        : snapshot;
    },
    resolveThinkingProfile: ({ modelId, compat }) => {
      const efforts = resolveCodexThinkingEfforts({
        modelId,
        supportedReasoningEfforts: readCodexSupportedReasoningEfforts(compat),
      });
      const defaultLevel = GPT_56_DEFAULT_REASONING_EFFORTS.get(modelId.trim().toLowerCase());
      return {
        levels: [{ id: "off" }, ...efforts.map((id) => ({ id }))],
        ...(defaultLevel && efforts.includes(defaultLevel) ? { defaultLevel } : {}),
      };
    },
    resolveSystemPromptContribution: ({ config, modelId }) =>
      resolveCodexSystemPromptContribution({
        config,
        modelId,
      }),
    isModernModelRef: ({ modelId }) => isModernCodexModel(modelId),
  };
}
/**
 * Builds the Codex model catalog from live app-server discovery, falling back
 * to built-in model records when discovery is disabled or unavailable.
 */
async function buildCodexProviderCatalog(options = {}) {
  const config = readCodexPluginConfig(options.pluginConfig);
  const appServer = resolveCodexAppServerRuntimeOptions({ pluginConfig: options.pluginConfig });
  const timeoutMs = normalizeTimeoutMs(config.discovery?.timeoutMs);
  let discovered = [];
  if (config.discovery?.enabled !== false && !shouldSkipLiveDiscovery(options.env))
    discovered = await listModelsBestEffort({
      listModels: options.listModels ?? listCodexAppServerModelsLazy,
      timeoutMs,
      startOptions: appServer.start,
      onDiscoveryFailure: options.onDiscoveryFailure,
    });
  return {
    provider: buildCodexProviderConfig(discovered.length > 0 ? discovered : FALLBACK_CODEX_MODELS),
  };
}
function resolveCodexDynamicModel(modelId) {
  const id = modelId.trim();
  if (!id) return;
  const fallbackModel = FALLBACK_CODEX_MODELS.find((model) => model.id === id);
  return normalizeModelCompat({
    ...buildCodexModelDefinition({
      id,
      model: id,
      inputModalities: fallbackModel?.inputModalities ?? ["text"],
      supportedReasoningEfforts: fallbackModel?.supportedReasoningEfforts,
    }),
    provider: CODEX_PROVIDER_ID,
    baseUrl: CODEX_BASE_URL,
  });
}
async function listModelsBestEffort(params) {
  try {
    const models = [];
    let cursor;
    do {
      const result = await params.listModels({
        timeoutMs: params.timeoutMs,
        limit: MODEL_DISCOVERY_PAGE_LIMIT,
        cursor,
        startOptions: params.startOptions,
        sharedClient: false,
      });
      models.push(...result.models.filter((model) => !model.hidden));
      cursor = result.nextCursor;
    } while (cursor);
    return models;
  } catch (error) {
    params.onDiscoveryFailure?.(error);
    codexCatalogLog.debug("codex model discovery failed; using fallback catalog", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}
async function listCodexAppServerModelsLazy(options) {
  const { listCodexAppServerModels } = await import("./models-N25Fylnn.js");
  return listCodexAppServerModels(options);
}
function extractCodexAccountEmail(value) {
  if (!value || typeof value !== "object") return;
  const record = value;
  const account = record.account && typeof record.account === "object" ? record.account : record;
  const email = account.email ?? account.accountEmail;
  return typeof email === "string" && email.trim() ? email.trim() : void 0;
}
async function requestCodexAppServerUsageLazy(options) {
  const { withCodexAppServerJsonClient } = await import("./request-BOPuFoDG.js");
  const deadline = Date.now() + options.timeoutMs;
  return await withCodexAppServerJsonClient(
    {
      timeoutMs: options.timeoutMs,
      timeoutMessage: "codex app-server usage read timed out",
      agentDir: options.agentDir,
      ...(options.authProfileId ? { authProfileId: options.authProfileId } : {}),
      config: options.config,
      startOptions: options.startOptions,
      isolated: true,
      isolatedShutdown: CODEX_USAGE_ISOLATED_SHUTDOWN,
    },
    async (request) => {
      const rateLimits = await request({ method: "account/rateLimits/read" });
      const accountEmail = await readCodexAccountEmailBestEffort(request, deadline);
      return {
        rateLimits,
        ...(accountEmail ? { accountEmail } : {}),
      };
    },
  );
}
const CODEX_USAGE_ISOLATED_SHUTDOWN = {
  forceKillDelayMs: 200,
  exitTimeoutMs: 300,
};
const CODEX_ACCOUNT_READ_MAX_TIMEOUT_MS = 4e3;
const CODEX_USAGE_DEADLINE_RESERVE_MS =
  CODEX_USAGE_ISOLATED_SHUTDOWN.forceKillDelayMs +
  CODEX_USAGE_ISOLATED_SHUTDOWN.exitTimeoutMs +
  250;
async function readCodexAccountEmailBestEffort(request, deadline) {
  const boundMs = Math.min(
    CODEX_ACCOUNT_READ_MAX_TIMEOUT_MS,
    deadline - Date.now() - CODEX_USAGE_DEADLINE_RESERVE_MS,
  );
  if (boundMs <= 0) return;
  const read = request({
    method: "account/read",
    requestParams: {},
  }).then(
    (account) => extractCodexAccountEmail(account),
    () => void 0,
  );
  let timer;
  const timeout = new Promise((resolve) => {
    timer = setTimeout(() => resolve(void 0), boundMs);
    timer.unref?.();
  });
  try {
    return await Promise.race([read, timeout]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}
function normalizeTimeoutMs(value) {
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? value
    : DEFAULT_DISCOVERY_TIMEOUT_MS;
}
function shouldSkipLiveDiscovery(env = process.env) {
  const override = env[LIVE_DISCOVERY_ENV]?.trim().toLowerCase();
  if (override === "0" || override === "false") return true;
  return Boolean(env.VITEST) && override !== "1";
}
function isKnownXHighCodexModel(modelId) {
  const lower = modelId.trim().toLowerCase();
  return (
    lower.startsWith("gpt-5") ||
    lower.startsWith("o3") ||
    lower.startsWith("o4") ||
    lower.includes("codex")
  );
}
function normalizeCodexReasoningEfforts(efforts) {
  if (!efforts) return [];
  const supported = new Set(efforts.map((effort) => effort.trim().toLowerCase()));
  return CODEX_REASONING_EFFORTS.filter((effort) => supported.has(effort));
}
/** Read app-server reasoning metadata from a runtime model compat union. */
function readCodexSupportedReasoningEfforts(compat) {
  if (!compat || typeof compat !== "object" || Array.isArray(compat)) return;
  const efforts = compat.supportedReasoningEfforts;
  if (!Array.isArray(efforts)) return;
  const strings = efforts.filter((effort) => typeof effort === "string");
  return strings.some((effort) => effort.trim().toLowerCase() === "none") ? void 0 : strings;
}
function resolveCodexThinkingEfforts(params) {
  if (params.supportedReasoningEfforts)
    return normalizeCodexReasoningEfforts(params.supportedReasoningEfforts);
  const fallbackEfforts = resolveCodexFallbackReasoningEfforts(params.modelId);
  if (fallbackEfforts) return [...fallbackEfforts];
  return [
    "minimal",
    "low",
    "medium",
    "high",
    ...(isKnownXHighCodexModel(params.modelId) ? ["xhigh"] : []),
    ...(isMaxReasoningCodexModel(params.modelId) ? ["max"] : []),
  ];
}
/** Map a requested effort onto the authoritative app-server model contract. */
function resolveCodexSupportedReasoningEffort(params) {
  const supported = normalizeCodexReasoningEfforts(params.supportedReasoningEfforts);
  if (supported.includes(params.requested)) return params.requested;
  const fallbackEfforts =
    params.requested === "ultra" ? supported : supported.filter((effort) => effort !== "ultra");
  const requestedRank = CODEX_REASONING_EFFORTS.indexOf(params.requested);
  return (
    fallbackEfforts.find((effort) => CODEX_REASONING_EFFORTS.indexOf(effort) >= requestedRank) ??
    fallbackEfforts.at(-1)
  );
}
/** Return the known effort contract when app-server model metadata is unavailable. */
function resolveCodexFallbackReasoningEfforts(modelId) {
  const normalized = modelId.trim().toLowerCase();
  if (GPT_56_ULTRA_MODEL_IDS.has(normalized)) return GPT_56_ULTRA_REASONING_EFFORTS;
  if (normalized === "gpt-5.6-luna") return GPT_56_MAX_REASONING_EFFORTS;
  if (normalized === "gpt-5.5-pro" || normalized === "gpt-5.4-pro")
    return GPT_5_PRO_REASONING_EFFORTS;
}
/** Return whether the model uses the modern Codex reasoning profile. */
function isModernCodexModel(modelId) {
  const lower = modelId.trim().toLowerCase();
  return (
    GPT_56_MAX_MODEL_IDS.has(lower) ||
    lower === "gpt-5.5" ||
    lower === "gpt-5.5-pro" ||
    lower === "gpt-5.4" ||
    lower === "gpt-5.4-pro" ||
    lower === "gpt-5.4-mini" ||
    lower === "gpt-5.3-codex-spark"
  );
}
/** Return whether Codex accepts the preview GPT-5.6 `max` reasoning effort. */
function isMaxReasoningCodexModel(modelId) {
  const lower = modelId.trim().toLowerCase();
  return GPT_56_MAX_MODEL_IDS.has(lower);
}
//#endregion
export {
  readCodexSupportedReasoningEfforts as a,
  isModernCodexModel as i,
  buildCodexProviderCatalog as n,
  resolveCodexFallbackReasoningEfforts as o,
  isMaxReasoningCodexModel as r,
  resolveCodexSupportedReasoningEffort as s,
  buildCodexProvider as t,
};
